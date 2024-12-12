<?php

use DotOrg\TryWordPress\Subjects_Controller;
use DotOrg\TryWordPress\Transformer;
use PHPUnit\Framework\TestCase;

class Liberate_Controller_Test extends TestCase {
	private Subjects_Controller $liberate_controller;

	private string $storage_post_type = 'lib_2';
	private string $endpoint          = '/try-wp/v1/subjects/blog-post';
	private string $source_html;

	private string $raw_title       = '<h1>This is the test title</h1>';
	private string $parsed_title    = 'This is the test title';
	private string $raw_date        = '<time>25 Oct 2024 18:39:20</time>';
	private string $parsed_date     = '2024-10-25 18:39:20';
	private string $date_iso_string = '2024-10-25T18:39:20.000Z';
	private string $raw_content     = '<div><p>This is the test content.</p></div>';
	private string $parsed_content  = '<p>This is the test content.</p>';

	private string $inserted_post_id;
	private string $transformed_post_id;

	protected function setUp(): void {
		parent::setUp();

		$this->liberate_controller = new Subjects_Controller( $this->storage_post_type );

		$this->source_html = '<html><head><title></title></head><body>' . $this->raw_content . '</body></html>';

		// we instantiate Promoter class so that the sample post we insert also has its transformed post saved in the database
		new Transformer( $this->storage_post_type );

		$this->inserted_post_id = wp_insert_post(
			array(
				'post_author'           => 23,
				'post_date'             => $this->parsed_date,
				'post_date_gmt'         => $this->parsed_date,
				'post_content'          => $this->parsed_content,
				'post_title'            => $this->parsed_title,
				'post_excerpt'          => 'This is the test excerpt',
				'post_status'           => 'draft',
				'comment_status'        => 'closed',
				'ping_status'           => 'closed',
				'post_password'         => '',
				'post_name'             => '',
				'to_ping'               => '',
				'pinged'                => $this->parsed_date,
				'post_modified'         => $this->parsed_date,
				'post_modified_gmt'     => $this->parsed_date,
				'post_content_filtered' => $this->raw_content,
				'post_parent'           => 0,
				'guid'                  => 'https://example.org/default',
				'menu_order'            => 0,
				'post_type'             => $this->storage_post_type,
				'comment_count'         => 0,
			)
		);
		update_post_meta( $this->inserted_post_id, 'raw_date', $this->raw_date );
		update_post_meta( $this->inserted_post_id, 'raw_title', $this->raw_title );
		update_post_meta( $this->inserted_post_id, 'raw_content', $this->raw_content );

		$this->transformed_post_id = get_post_meta( $this->inserted_post_id, '_dl_transformed', true );
	}

	protected function tearDown(): void {
		wp_delete_post( $this->inserted_post_id, true );
		wp_delete_post( $this->transformed_post_id, true );
	}

	public function testGetStoragePostType() {
		$this->assertEquals( $this->storage_post_type, $this->liberate_controller->get_storage_post_type() );
	}

	public function testValidRequestForInsert() {
		$source_url = 'https://example.org/default'; // non-unique, already inserted in setUp()

		$request = new WP_REST_Request( 'POST', $this->endpoint );
		$request->set_header( 'Content-Type', 'application/json' );
		$request->set_body(
			wp_json_encode(
				array(
					'sourceUrl' => $source_url,
				)
			)
		);
		$response = rest_do_request( $request );

		$result = $this->liberate_controller->valid_request_for_insert( $request );

		$this->assertInstanceOf( 'WP_Error', $result );
		$this->assertEquals( 'rest_source_url_not_unique', $result->get_error_code() );
		$this->assertEquals( 409, $response->get_status() );
	}

	public function testValidRequestForUpdateRule1() {
		// invalid id, rule 1 violation
		$api_endpoint = $this->endpoint . '/' . PHP_INT_MAX;
		$request      = new WP_REST_Request( 'POST', $api_endpoint );
		$request->set_body(
			wp_json_encode(
				array(
					'title' => 'Some title',
				)
			)
		);
		rest_do_request( $request );

		$result = $this->liberate_controller->valid_request_for_update( $request );
		$this->assertInstanceOf( 'WP_Error', $result );
		$this->assertEquals( 'rest_post_invalid_id', $result->get_error_code() );
	}

	public function testValidRequestForUpdateRule2() {
		// attempting to update sourceUrl/guid, rule 2 violation
		$api_endpoint = $this->endpoint . '/' . $this->inserted_post_id;
		$request      = new WP_REST_Request( 'PUT', $api_endpoint );
		$request->set_body(
			wp_json_encode(
				array(
					'title'     => 'Updated title',
					'sourceUrl' => 'https://example.org/different',
				)
			)
		);
		rest_do_request( $request );

		$result = $this->liberate_controller->valid_request_for_update( $request );
		$this->assertInstanceOf( 'WP_Error', $result );
		$this->assertEquals( 'rest_source_url_immutable', $result->get_error_code() );
	}

	public function testValidRequestForUpdateSuccess() {
		// valid id and same sourceUrl specified
		$api_endpoint = $this->endpoint . '/' . $this->inserted_post_id;
		$request      = new WP_REST_Request( 'POST', $api_endpoint );
		$request->set_query_params( array( 'id' => $this->inserted_post_id ) );
		$request->set_body(
			wp_json_encode(
				array(
					'title'     => 'Some title',
					'sourceUrl' => 'https://example.org/default',
				)
			)
		);
		rest_do_request( $request );

		$this->assertTrue( $this->liberate_controller->valid_request_for_update( $request ) );
	}

	public function testPrepareItemForResponseWithoutId() {
		$result = $this->liberate_controller->prepare_item_for_response(
			array(), // missing ID
			new WP_REST_Request()
		);

		$this->assertInstanceOf( 'WP_Error', $result );
	}

	public function testPrepareItemForResponse() {
		$source_url = 'https://example.org/' . __CLASS__ . '/' . __FUNCTION__;
		// Note: Not all fields are currently used, so we only look up for fields that we do use
		// When we start using a new field, this test would fail and require an update :)
		$post_array = array(
			'ID'                    => $this->inserted_post_id,
			'post_author'           => 23,
			'post_date'             => $this->parsed_date,
			'post_date_gmt'         => $this->parsed_date,
			'post_content'          => $this->parsed_content,
			'post_title'            => 'This is the test title',
			'post_excerpt'          => 'This is the test excerpt',
			'post_status'           => 'publish',
			'comment_status'        => 'closed',
			'ping_status'           => 'closed',
			'post_password'         => '',
			'post_name'             => '',
			'to_ping'               => '',
			'pinged'                => $this->parsed_date,
			'post_modified'         => $this->parsed_date,
			'post_modified_gmt'     => $this->parsed_date,
			'post_content_filtered' => $this->source_html,
			'post_parent'           => 0,
			'guid'                  => $source_url,
			'menu_order'            => 0,
			'post_type'             => $this->liberate_controller->get_storage_post_type(),
			'comment_count'         => 0,
		);

		$response = $this->liberate_controller->prepare_item_for_response(
			$post_array,
			new WP_REST_Request()
		);

		$this->assertEquals(
			array(
				'id'            => $this->inserted_post_id,
				'authorId'      => 23,
				'sourceUrl'     => $source_url,
				'sourceHtml'    => $this->source_html,
				'rawTitle'      => $this->raw_title,
				'parsedTitle'   => $this->parsed_title,
				'rawDate'       => $this->raw_date,
				'parsedDate'    => $this->parsed_date,
				'rawContent'    => $this->raw_content,
				'parsedContent' => $this->parsed_content,
				'transformedId' => $this->transformed_post_id,
				'previewUrl'    => get_permalink( $this->transformed_post_id ),
			),
			$response->get_data()
		);
	}

	public function testPrepareItemForDatabase() {
		$source_url = 'https://example.org/' . __CLASS__ . '/' . __FUNCTION__;

		// prepare the request object
		$request = new WP_REST_Request( 'POST', $this->endpoint . '/777' );
		$request->set_body(
			wp_json_encode(
				array(
					'id'            => 777,
					'authorId'      => 23,
					'sourceUrl'     => $source_url,
					'sourceHtml'    => $this->source_html,
					'rawTitle'      => $this->raw_title,
					'parsedTitle'   => $this->parsed_title,
					'rawDate'       => $this->raw_date,
					'parsedDate'    => $this->date_iso_string,
					'rawContent'    => $this->raw_content,
					'parsedContent' => $this->parsed_content,
				)
			)
		);
		rest_do_request( $request );

		// call the testing func
		$prepared_post = $this->liberate_controller->prepare_item_for_database( $request );

		$this->assertEquals( 777, $prepared_post['ID'] );
		$this->assertEquals( 23, $prepared_post['post_author'] );
		$this->assertEquals( $source_url, $prepared_post['guid'] );
		$this->assertEquals(
			$this->liberate_controller->get_storage_post_type(),
			$prepared_post['post_type']
		);
		$this->assertEquals(
			$this->parsed_title,
			$prepared_post['post_title']
		);
		$this->assertEquals(
			$this->raw_title,
			$prepared_post['meta']['raw_title']
		);
		$this->assertEquals(
			$this->parsed_content,
			$prepared_post['post_content']
		);
		$this->assertEquals(
			$this->source_html,
			$prepared_post['post_content_filtered']
		);
		$this->assertEquals( $this->parsed_date, $prepared_post['post_date'] );
		$this->assertEquals( $this->raw_date, $prepared_post['meta']['raw_date'] );
		$this->assertEquals( $this->raw_content, $prepared_post['meta']['raw_content'] );
	}

	public function testGetPostIdByGuidWithExistingPost() {
		$guid = 'https://example.org/default'; // This GUID was set in setUp()

		$post_id = $this->liberate_controller->get_post_id_by_guid( $guid );
		$this->assertEquals( $this->inserted_post_id, $post_id );

		// Test that it's cached
		$cache_key = 'try_wp_cache_guid_' . md5( $guid );
		$cached_id = wp_cache_get( $cache_key, 'try_wp' );
		$this->assertEquals( $post_id, $cached_id );
	}

	public function testGetPostIdByGuidWithNonExistentPost() {
		$guid = 'https://example.org/' . __CLASS__ . '/' . __FUNCTION__;

		$post_id = $this->liberate_controller->get_post_id_by_guid( $guid );
		$this->assertNull( $post_id );

		// Verify no cache was set
		$cache_key = 'try_wp_cache_guid_' . md5( $guid );
		$cached_id = wp_cache_get( $cache_key, 'try_wp' );
		$this->assertFalse( $cached_id );
	}

	public function testCacheIsInvalidatedWhenPostIsDeleted() {
		$guid = 'https://example.org/' . __CLASS__ . '/' . __FUNCTION__;

		// Create a new post
		$new_post_id = wp_insert_post(
			array(
				'post_author'           => 23,
				'post_date'             => $this->parsed_date,
				'post_date_gmt'         => $this->parsed_date,
				'post_content'          => $this->parsed_content,
				'post_title'            => $this->parsed_title,
				'post_excerpt'          => 'This is the test excerpt',
				'post_status'           => 'draft',
				'comment_status'        => 'closed',
				'ping_status'           => 'closed',
				'post_password'         => '',
				'post_name'             => '',
				'to_ping'               => '',
				'pinged'                => $this->parsed_date,
				'post_modified'         => $this->parsed_date,
				'post_modified_gmt'     => $this->parsed_date,
				'post_content_filtered' => $this->raw_content,
				'post_parent'           => 0,
				'guid'                  => $guid,
				'menu_order'            => 0,
				'post_type'             => $this->storage_post_type,
				'comment_count'         => 0,
			)
		);

		// First access to cache the post ID
		$post_id = $this->liberate_controller->get_post_id_by_guid( $guid );
		$this->assertEquals( $new_post_id, $post_id );

		// Verify it's in cache
		$cache_key = 'try_wp_cache_guid_' . md5( $guid );
		$cached_id = wp_cache_get( $cache_key, 'try_wp' );
		$this->assertEquals( $post_id, $cached_id );

		// Delete the post - this should trigger our delete_post hook
		wp_delete_post( $new_post_id, true );

		// Verify cache was cleared by the hook
		$cached_id = wp_cache_get( $cache_key, 'try_wp' );
		$this->assertFalse( $cached_id );

		// Later lookups should return null
		$post_id = $this->liberate_controller->get_post_id_by_guid( $guid );
		$this->assertNull( $post_id );
	}
}

<?php

use DotOrg\TryWordPress\Rest_API_Extender;
use PHPUnit\Framework\TestCase;

class Rest_API_Extender_Test extends TestCase {
	private Rest_API_Extender $rest_api_extender;
	private array $custom_post_types = array( 'lib_x', 'lib_y' );
	private int $post_id_in_db;
	private int $another_post_id_in_db;

	protected function setUp(): void {
		parent::setUp();

		// insert lib_x posts
		$this->post_id_in_db = wp_insert_post(
			array(
				'post_author'           => 1,
				'post_date'             => '2024-09-12 14:30:00',
				'post_date_gmt'         => '2024-09-12 14:30:00',
				'post_content'          => 'This is a new post',
				'post_title'            => 'Test post',
				'post_status'           => 'draft',
				'post_content_filtered' => '<div><p>Content 1</p><p>Content 2</p></div>',
				'guid'                  => 'https://example.com/x',
				'post_type'             => 'lib_x',
			)
		);
		wp_insert_post(
			array(
				'post_author'           => 1,
				'post_date'             => '2024-09-13 14:30:00',
				'post_date_gmt'         => '2024-09-13 14:30:00',
				'post_content'          => 'This is a new post',
				'post_title'            => 'Test post',
				'post_status'           => 'draft',
				'post_content_filtered' => '<div><p>Content 1</p><p>Content 2</p></div>',
				'guid'                  => 'https://example.com/y',
				'post_type'             => 'lib_x',
			)
		);

		$this->rest_api_extender = new Rest_API_Extender( $this->custom_post_types );
	}

	protected function tearDown(): void {
		parent::tearDown();

		$promoted_post_id = get_post_meta( $this->post_id_in_db, '_liberated_post', true );
		wp_delete_post( $this->post_id_in_db, true );
		wp_delete_post( $promoted_post_id, true );
	}

	public function testRegisterRoute(): void {
		do_action( 'rest_api_init' ); // so that register_route() executes.

		$routes = rest_get_server()->get_routes( 'wp/v2' );

		$this->assertArrayHasKey( '/wp/v2/lib_xs/(?P<id>\d+)/promote', $routes );
		$this->assertArrayHasKey( '/wp/v2/lib_ys/(?P<id>\d+)/promote', $routes );
	}

	public function testPromotePost(): void {
		$request = $this->createMock( \WP_REST_Request::class );
		$request->method( 'offsetGet' )->with( 'id' )->willReturn( $this->post_id_in_db );

		$result = $this->rest_api_extender->promote_post( $request );

		$this->assertInstanceOf( \WP_REST_Response::class, $result );
		$this->assertEquals( 200, $result->get_status() );
		$this->assertEquals( $this->post_id_in_db + 2, $result->get_data()['post_id'] );
	}

	public function testPromoteLiberatedPostTypes(): void {
		$result = $this->rest_api_extender->promote_liberated_post_types( get_post( $this->post_id_in_db ) );

		$promoted_post_id = get_post_meta( $this->post_id_in_db, '_liberated_post', true );

		$this->assertEquals( $this->post_id_in_db + 2, $promoted_post_id );
		$this->assertTrue( $result );
	}

	public function testFilterPostsByGuid(): void {
		$request1 = $this->createMock( \WP_REST_Request::class ); // query with known guid
		$request2 = $this->createMock( \WP_REST_Request::class ); // query with unknown guid
		$request3 = $this->createMock( \WP_REST_Request::class ); // query without guid

		// Set up the mock to return specific values when methods are called
		$request1->method( 'has_param' )
			->with( 'guid' )
			->willReturn( true );
		$request1->method( 'get_param' )
			->with( 'guid' )
			->willReturn( 'https://example.com/x' );
		$request2->method( 'has_param' )
			->with( 'guid' )
			->willReturn( true );
		$request2->method( 'get_param' )
			->with( 'guid' )
			->willReturn( 'https://example.com/unknown' );
		$request3->method( 'has_param' )
			->with( 'guid' )
			->willReturn( false );

		$args = $this->rest_api_extender->filter_posts_by_guid( 'lib_x', array(), $request1 );
		$this->assertArrayHasKey( 'p', $args );
		$this->assertEquals( $this->post_id_in_db, $args['p'] );

		$args = $this->rest_api_extender->filter_posts_by_guid( 'lib_x', array(), $request2 );
		$this->assertArrayHasKey( 'post__in', $args );
		$this->assertEquals( array( 0 ), $args['post__in'] );

		$args = $this->rest_api_extender->filter_posts_by_guid( 'lib_x', array(), $request3 );
		$this->assertEquals( array(), $args );
	}
}

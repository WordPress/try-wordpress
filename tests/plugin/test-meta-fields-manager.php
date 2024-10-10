<?php

use DotOrg\TryWordPress\Meta_Fields_Manager;
use PHPUnit\Framework\TestCase;

class Meta_Fields_Manager_Test extends TestCase {
	private Meta_Fields_Manager $meta_fields_manager;
	private string $custom_post_type = 'lib_x';

	protected function setUp(): void {
		parent::setUp();

		register_post_type(
			$this->custom_post_type,
			array(
				'public'              => false,
				'exclude_from_search' => true,
				'publicly_queryable'  => true,
				'show_in_rest'        => true,
				'show_ui'             => false,
				'show_in_menu'        => false,
				'supports'            => array( 'title', 'editor', 'custom-fields' ),
				'label'               => $this->custom_post_type,
				'rest_base'           => $this->custom_post_type,
			)
		);

		$this->meta_fields_manager = new Meta_Fields_Manager( $this->custom_post_type );
	}

	public function testRegisterMetaFields(): void {
		$reflection = new ReflectionClass( $this->meta_fields_manager );
		$property   = $reflection->getProperty( 'post_meta_fields' );
		$property->setValue(
			$this->meta_fields_manager,
			array( 'x', 'y' )
		);

		$this->meta_fields_manager->register_meta_fields();

		$this->assertEquals(
			array( 'x', 'y' ),
			array_keys( get_registered_meta_keys( 'post', 'lib_x' ) )
		);
	}

	public function testMoveMetaFields() {
		$prepared_post = new stdClass();
		$request       = $this->createMock( WP_REST_Request::class );

		$initial_meta = array(
			'guid'        => 'test-guid',
			'raw_content' => 'test-content',
			'other_field' => 'other-value',
		);

		// Set up the mock to return specific values when methods are called
		$request->method( 'get_param' )
			->with( 'meta' )
			->willReturn( $initial_meta );

		// Capture what's actually passed to set_param, to see how it has been modified
		$captured_meta = null;
		$request->method( 'set_param' )
			->willReturnCallback(
				function ( $key, $value ) use ( &$captured_meta ) {
					if ( 'meta' === $key ) {
						$captured_meta = $value;
					}
				}
			);

		$prepared_post = $this->meta_fields_manager->move_meta_fields( $prepared_post, $request );

		$this->assertEquals( 'test-guid', $prepared_post->guid, 'guid property on post object not set' );
		$this->assertEquals( 'test-content', $prepared_post->post_content_filtered, 'post_content_filtered property on post object not set' );
		$this->assertNotContains( 'test-guid', $captured_meta );
		$this->assertNotContains( 'test-content', $captured_meta );
	}

	public function testPrepareMetaFields() {
		$request  = $this->createMock( WP_REST_Request::class );
		$response = $this->createMock( WP_REST_Response::class );

		$post                        = new stdClass();
		$post->guid                  = 'test-guid';
		$post->post_content_filtered = 'test-content';

		// Set up the mock to return specific values when methods are called
		$response->method( 'get_data' )
			->willReturn( array() );

		// Capture what's actually passed to set_data, to see how it has been modified
		$captured_data = null;
		$response->method( 'set_data' )->willReturnCallback(
			function ( $value ) use ( &$captured_data ) {
				$captured_data = $value;
			}
		);

		$this->meta_fields_manager->prepare_meta_fields( $response, $post, $request );

		$this->assertArrayHasKey( 'meta', $captured_data );
		$this->assertEquals(
			array(
				'guid'        => 'test-guid',
				'raw_content' => 'test-content',
			),
			$captured_data['meta']
		);
	}
}

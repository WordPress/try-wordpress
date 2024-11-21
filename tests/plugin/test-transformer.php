<?php

use DotOrg\TryWordPress\Transformer;
use DotOrg\TryWordPress\SubjectType;
use PHPUnit\Framework\TestCase;

class Transformer_Test extends TestCase {
	private Transformer $transformer;
	private int $post_id_in_db;

	protected function setUp(): void {
		parent::setUp();

		// insert liberated_data post
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
				'post_type'             => 'liberated_data',
			)
		);
		update_post_meta( $this->post_id_in_db, 'subject_type', SubjectType::BLOGPOST->value );

		$this->transformer = new Transformer();
	}

	protected function tearDown(): void {
		parent::tearDown();

		$transformed_post_id = $this->transformer->get_transformed_post_id( $this->post_id_in_db );
		wp_delete_post( $transformed_post_id, true );
		wp_delete_post( $this->post_id_in_db, true );

		delete_post_meta( 99, Transformer::META_KEY_LIBERATED_OUTPUT );
	}

	public function testGetPostTypeForTransformedPost() {
		$reflection = new ReflectionClass( $this->transformer );
		$method     = $reflection->getMethod( 'get_post_type_for_transformed_post' );

		$result = $method->invokeArgs( $this->transformer, array( $this->post_id_in_db ) );
		$this->assertEquals( 'post', $result );

		update_post_meta( $this->post_id_in_db, 'subject_type', SubjectType::PRODUCT->value );

		$result = $method->invokeArgs( $this->transformer, array( $this->post_id_in_db ) );
		$this->assertEquals( 'product', $result );
	}

	public function testGetTransformedPost() {
		add_post_meta( 99, Transformer::META_KEY_LIBERATED_OUTPUT, 999 );

		$this->assertEquals( 999, $this->transformer->get_transformed_post_id( 99 ) );
		$this->assertEquals( null, $this->transformer->get_transformed_post_id( 88 ) );
	}

	public function testTransform(): void {
		$result = $this->transformer->transform( get_post( $this->post_id_in_db ) );

		$transformed_post_id = absint( get_post_meta( $this->post_id_in_db, Transformer::META_KEY_LIBERATED_OUTPUT, true ) );

		$this->assertEquals( $this->post_id_in_db + 1, $transformed_post_id );
		$this->assertTrue( $result );
	}
}

<?php

use DotOrg\TryWordPress\Promoter;
use PHPUnit\Framework\TestCase;

class Promoter_Test extends TestCase {
	private Promoter $promoter;
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
		update_post_meta( $this->post_id_in_db, 'content_type', 'blogpost' );

		$this->promoter = new Promoter( 'lib_x' );
	}

	protected function tearDown(): void {
		parent::tearDown();

		$promoted_post_id = $this->promoter->get_promoted_post_id( $this->post_id_in_db );
		wp_delete_post( $promoted_post_id, true );
		wp_delete_post( $this->post_id_in_db, true );

		delete_post_meta( 99, '_promoted_post' );
	}

	public function testGetPostTypeForPromotedPost() {
		$reflection = new ReflectionClass( $this->promoter );
		$method     = $reflection->getMethod( 'get_post_type_for_promoted_post' );

		$result = $method->invokeArgs( $this->promoter, array( $this->post_id_in_db ) );
		$this->assertEquals( 'post', $result );

		update_post_meta( $this->post_id_in_db, 'content_type', 'product' );

		$result = $method->invokeArgs( $this->promoter, array( $this->post_id_in_db ) );
		$this->assertEquals( 'product', $result );
	}

	public function testGetPromotedPost() {
		add_post_meta( 99, '_promoted_post', 999 );

		$this->assertEquals( 999, $this->promoter->get_promoted_post_id( 99 ) );
		$this->assertEquals( null, $this->promoter->get_promoted_post_id( 88 ) );
	}

	public function testPromote(): void {
		$result = $this->promoter->promote( get_post( $this->post_id_in_db ) );

		$promoted_post_id = absint( get_post_meta( $this->post_id_in_db, '_promoted_post', true ) );

		$this->assertEquals( $this->post_id_in_db + 1, $promoted_post_id );
		$this->assertTrue( $result );
	}
}

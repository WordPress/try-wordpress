<?php

use DotOrg\TryWordPress\Post_Type_Manager;
use PHPUnit\Framework\TestCase;

class Post_Type_Manager_Test extends TestCase {
	private Post_Type_Manager $post_type_manager;

	protected function setUp(): void {
		parent::setUp();
		$this->post_type_manager = new Post_Type_Manager();
	}

	public function testGetPostTypeConstants(): void {
		$reflection = new ReflectionClass( $this->post_type_manager );
		$method     = $reflection->getMethod( 'get_post_type_constants' );

		$result = $method->invoke( $this->post_type_manager );

		$this->assertIsArray( $result );
		$this->assertEquals( 4, count( $result ) );
		$this->assertContains( 'liberated_post', $result );
		$this->assertContains( 'liberated_page', $result );
		$this->assertContains( 'liberated_product', $result );
		$this->assertContains( 'liberated_navigation', $result );
	}

	public function testRegisterPostTypes(): void {
		$this->assertTrue( post_type_exists( 'liberated_post' ), 'Custom post type "liberated_post" not registered' );
		$this->assertTrue( post_type_exists( 'liberated_page' ), 'Custom post type "liberated_page" not registered' );
		$this->assertTrue( post_type_exists( 'liberated_product' ), 'Custom post type "liberated_product" not registered' );
		$this->assertTrue( post_type_exists( 'liberated_navigation' ), 'Custom post type "liberated_navigation" not registered' );
	}

	public function testGetCustomPostTypes(): void {
		$reflection = new ReflectionClass( $this->post_type_manager );
		$property   = $reflection->getProperty( 'custom_post_types' );
		$property->setValue(
			$this->post_type_manager,
			array( 'x', 'y' )
		);

		$this->assertEquals(
			array( 'x', 'y' ),
			$this->post_type_manager->get_custom_post_types()
		);
	}
}

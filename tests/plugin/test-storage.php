<?php

use DotOrg\TryWordPress\Storage;
use PHPUnit\Framework\TestCase;

class Storage_Test extends TestCase {
	private Storage $storage;

	protected function setUp(): void {
		parent::setUp();
		$this->storage = new Storage( 'lib_x', 'lib_crawl' );
	}

	public function testRegisterPostTypes(): void {
		do_action( 'init' );
		$this->assertTrue( post_type_exists( 'lib_x' ), 'Custom post type meant for storage not registered' );
		$this->assertTrue( post_type_exists( 'lib_crawl' ), 'Custom post type meant for storage not registered' );
	}
}

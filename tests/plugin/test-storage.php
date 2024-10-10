<?php

use DotOrg\TryWordPress\Storage;
use PHPUnit\Framework\TestCase;

class Storage_Test extends TestCase {
	private Storage $storage;

	protected function setUp(): void {
		parent::setUp();
		$this->storage = new Storage();
	}

	public function testRegisterPostTypes(): void {
		$this->assertTrue( post_type_exists( 'liberated_data' ), 'Custom post type "liberated_data" not registered' );
	}
}

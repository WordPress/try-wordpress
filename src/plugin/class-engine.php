<?php

namespace DotOrg\TryWordPress;

class Engine {

	private string $storage_post_type = 'liberated_data';

	public function __construct() {
		require 'class-post-type-ui.php';
		require 'class-transformer.php';
		require 'class-subjects-controller.php';
		require 'class-storage.php';

		( function () {
			$transformer = new Transformer( $this->storage_post_type );

			new Post_Type_UI( $this->storage_post_type, $transformer );

			// REST API
			new Subjects_Controller( $this->storage_post_type );

			new Storage( $this->storage_post_type );
		} )();
	}
}

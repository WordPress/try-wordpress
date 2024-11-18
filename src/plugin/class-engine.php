<?php

namespace DotOrg\TryWordPress;

class Engine {

	public const string STORAGE_POST_TYPE = 'liberated_data';

	public function __construct() {
		require 'class-post-type-ui.php';
		require 'class-transformer.php';
		require 'class-liberate-controller.php';
		require 'class-blogpost-controller.php';
		require 'class-page-controller.php';
		require 'class-storage.php';

		( function () {
			$transformer = new Transformer( self::STORAGE_POST_TYPE );

			new Post_Type_UI( self::STORAGE_POST_TYPE, $transformer );

			// REST API
			new Blogpost_Controller( self::STORAGE_POST_TYPE );
			new Page_Controller( self::STORAGE_POST_TYPE );

			new Storage( self::STORAGE_POST_TYPE );
		} )();
	}
}

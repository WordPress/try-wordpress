<?php

namespace DotOrg\TryWordPress;

class Engine {

	public const string LIBERATED_DATA_POST_TYPE = 'liberated_data';
	public const string CRAWLER_DATA_POST_TYPE   = 'dl_crawler_url';

	public function __construct() {
		require 'enum-subject-type.php';

		require 'class-post-type-ui.php';
		require 'class-transformer.php';
		require 'class-liberate-controller.php';
		require 'class-blogpost-controller.php';
		require 'class-page-controller.php';
		require 'class-controller-registry.php';
		require 'class-storage.php';
		require 'class-subject.php';
		require 'class-subject-repo.php';

		( function () {
			$transformer = new Transformer();

			new Post_Type_UI( self::LIBERATED_DATA_POST_TYPE, self::CRAWLER_DATA_POST_TYPE, $transformer );

			new Controller_Registry( self::LIBERATED_DATA_POST_TYPE, self::CRAWLER_DATA_POST_TYPE );

			new Storage( self::LIBERATED_DATA_POST_TYPE, self::CRAWLER_DATA_POST_TYPE );

			Subject_Repo::init( self::LIBERATED_DATA_POST_TYPE );
		} )();
	}
}

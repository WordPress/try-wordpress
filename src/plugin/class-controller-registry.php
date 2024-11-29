<?php

namespace DotOrg\TryWordPress;

class Controller_Registry {

	public function __construct( string $liberated_data_post_type, string $crawler_data_post_type ) {
		new Blogpost_Controller( $liberated_data_post_type );
		new Page_Controller( $liberated_data_post_type );
	}
}

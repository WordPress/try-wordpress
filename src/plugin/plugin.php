<?php
/**
 * Plugin Name: Try WordPress
 * Description: Try WordPress REST API.
 * Version: 0.0.1
 * Author: WordPress.org
 */

namespace DotOrg\TryWordPress;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require 'class-post-type-manager.php';
require 'class-post-type-ui.php';
require 'class-promoter.php';
require 'class-meta-fields-manager.php';
require 'class-rest-api-extender.php';
require 'class-storage.php';

( function () {
	$custom_post_types = array( Storage::POST_TYPE );

	$promoter = new Promoter();

	new Post_Type_UI( $custom_post_types, $promoter );
	new Meta_Fields_Manager( $custom_post_types );

	new Rest_API_Extender( $custom_post_types, $promoter );

	new Storage();
} )();

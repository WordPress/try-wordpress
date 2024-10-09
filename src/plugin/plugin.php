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

require 'class-post-type-ui.php';
require 'class-promoter.php';
require 'class-meta-fields-manager.php';
require 'class-rest-api-extender.php';
require 'class-storage.php';

( function () {
	$custom_post_type = Storage::POST_TYPE;

	$promoter = new Promoter( $custom_post_type );

	new Post_Type_UI( $custom_post_type, $promoter );
	new Meta_Fields_Manager( $custom_post_type );

	new Rest_API_Extender( $custom_post_type, $promoter );

	new Storage();
} )();

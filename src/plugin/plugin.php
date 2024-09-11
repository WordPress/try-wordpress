<?php
/**
 * Plugin Name: Try WordPress
 * Description: Try WordPress REST API.
 * Version: 0.0.1
 * Author: WordPress.org
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require 'class-liberation-engine.php';

new LiberationEngine();

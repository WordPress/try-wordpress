<?php

$_tests_dir = getenv( 'WP_TESTS_DIR' );
if ( ! $_tests_dir ) {
	$_tests_dir = rtrim( sys_get_temp_dir(), '/\\' ) . '/wordpress-tests-lib';
}

// Forward custom PHPUnit Polyfills configuration to PHPUnit bootstrap file.
$_phpunit_polyfills_path = getenv( 'WP_TESTS_PHPUNIT_POLYFILLS_PATH' );
if ( false !== $_phpunit_polyfills_path ) {
	define( 'WP_TESTS_PHPUNIT_POLYFILLS_PATH', $_phpunit_polyfills_path );
}

if ( ! file_exists( "$_tests_dir/includes/functions.php" ) ) {
	echo "Could not find $_tests_dir/includes/functions.php, have you run bin/install-wp-tests.sh ?" . PHP_EOL; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	exit( 1 );
}

// Give access to tests_add_filter() function.
require_once "$_tests_dir/includes/functions.php";

/**
 * Manually load the plugin being tested.
 */
function _manually_load_plugin() {
	$plugin_path_in_src = dirname( __DIR__, 2 ) . '/src/plugin/plugin.php';
	$plugin_path_in_wp  = dirname( __DIR__, 2 ) . '/plugins/plugin/plugin.php';

	if ( getenv( 'PHPUNIT_UNDER_GITHUB_ACTIONS' ) ) {
		require_once $plugin_path_in_src;
	} else {
		require_once $plugin_path_in_wp;
	}
}
tests_add_filter( 'muplugins_loaded', '_manually_load_plugin' );

global $wp_tests_options;
$wp_tests_options['permalink_structure'] = '/%postname%';

// Start up the WP testing environment.
require "$_tests_dir/includes/bootstrap.php";

// Require our own test code.
require_once __DIR__ . '/base-test.php';

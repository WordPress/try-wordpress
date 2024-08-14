<?php
/**
 * Plugin Name: Data Liberation
 * Description: Import sites to WordPress.
 * Version: 1.1
 * Author: WordPress.org
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class DataLiberation {
	public function __construct() {
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		add_action( 'admin_menu', array( $this, 'create_wizard_page' ) );
	}

	public function enqueue_scripts() {
        wp_enqueue_script( 'data-liberation', plugin_dir_url( __FILE__ ) . 'index.js', array( 'jquery' ), filemtime( plugin_dir_path( __FILE__ ) . 'index.js' ), true );
        wp_enqueue_style( 'data-liberation', plugin_dir_url( __FILE__ ) . 'css/data-liberation.css', array(), filemtime( plugin_dir_path( __FILE__ ) . 'css/data-liberation.css' ) );
	}

	public function create_wizard_page() {
		add_menu_page(
			'Data Liberation Wizard',
			'Data Liberation',
			'manage_options',
			'data-liberation',
			array( $this, 'render_wizard_page' ),
			'dashicons-admin-tools',
			100
		);
	}

	public function render_wizard_page() {
		include plugin_dir_path( __FILE__ ) . 'views/wizard.php';
	}
}

new DataLiberation();

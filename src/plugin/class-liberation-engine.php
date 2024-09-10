<?php

class LiberationEngine {
	const string POST_TYPE_POST       = 'liberated_post';
	const string POST_TYPE_PAGE       = 'liberated_page';
	const string POST_TYPE_PRODUCT    = 'liberated_product';
	const string POST_TYPE_NAVIGATION = 'liberated_navigation';

	public function __construct() {
		add_action( 'init', array( $this, 'register_post_types' ) );
	}

	public function register_post_types(): void {
		register_post_type(
			self::POST_TYPE_POST,
			array(
				'public'       => false,
				'label'        => 'Liberated Post',
				'show_in_rest' => true,
				'rest_base'    => 'liberated_posts',
				'show_ui'      => self::is_debug_mode(),
				'show_in_menu' => self::is_debug_mode(),
			)
		);
		register_post_type(
			self::POST_TYPE_PAGE,
			array(
				'public'       => false,
				'label'        => 'Liberated Page',
				'show_in_rest' => true,
				'rest_base'    => 'liberated_pages',
				'show_ui'      => self::is_debug_mode(),
				'show_in_menu' => self::is_debug_mode(),
			)
		);
		register_post_type(
			self::POST_TYPE_PRODUCT,
			array(
				'public'       => false,
				'label'        => 'Liberated Product',
				'show_in_rest' => true,
				'rest_base'    => 'liberated_products',
				'show_ui'      => self::is_debug_mode(),
				'show_in_menu' => self::is_debug_mode(),
			)
		);
		register_post_type(
			self::POST_TYPE_NAVIGATION,
			array(
				'public'       => false,
				'label'        => 'Liberated Navigation',
				'show_in_rest' => true,
				'rest_base'    => 'liberated_navigations',
				'show_ui'      => self::is_debug_mode(),
				'show_in_menu' => self::is_debug_mode(),
			)
		);
	}

	public function is_debug_mode(): bool {
		return defined( 'WP_DEBUG' ) && WP_DEBUG;
	}
}

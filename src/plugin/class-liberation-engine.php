<?php

class LiberationEngine {
	const string POST_TYPE_POST       = 'liberated_post';
	const string POST_TYPE_PAGE       = 'liberated_page';
	const string POST_TYPE_PRODUCT    = 'liberated_product';
	const string POST_TYPE_NAVIGATION = 'liberated_navigation';

	public function __construct() {
		add_action( 'init', array( $this, 'register_post_types' ) );
		add_action( 'init', array( $this, 'register_meta_fields' ) );

		// Intercept the REST API call for moving over 'guid' and 'raw_content' to posts table
		add_filter( 'rest_pre_insert_post', array( $this, 'move_meta_fields' ), 10, 2 );
		add_filter( 'rest_pre_insert_post_meta', array( $this, 'prevent_saving_moved_meta_fields' ), 10, 3 );
		add_filter( 'rest_prepare_post', array( $this, 'remove_moved_meta_fields' ), 10, 3 );
	}

	public function register_post_types() : void {
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

	public function is_debug_mode() : bool {
		return defined( 'WP_DEBUG' ) && WP_DEBUG;
	}

	public function register_meta_fields() : void {
		// @TODO: change to custom post types
		register_post_meta(
			'post', 'guid', array(
				'show_in_rest' => true,
				'single'       => true,
				'type'         => 'string',
			)
		);

		register_post_meta(
			'post', 'raw_title', array(
				'show_in_rest' => true,
				'single'       => true,
				'type'         => 'string',
			)
		);

		register_post_meta(
			'post', 'raw_date', array(
				'show_in_rest' => true,
				'single'       => true,
				'type'         => 'string',
			)
		);

		register_post_meta(
			'post', 'raw_content', array(
				'show_in_rest' => true,
				'single'       => true,
				'type'         => 'string',
			)
		);
	}

	public function move_meta_fields( $prepared_post, $request ) {
		$meta = $request->get_param( 'meta' );

		if ( isset( $meta[ 'guid' ] ) ) {
			$prepared_post->guid = $meta[ 'guid' ];
			unset( $meta[ 'guid' ] );
		}

		if ( isset( $meta[ 'raw_content' ] ) ) {
			$prepared_post->post_content_filtered = $meta[ 'raw_content' ];
			unset( $meta[ 'raw_content' ] );
		}

		$request->set_param( 'meta', $meta );

		return $prepared_post;
	}


	public function prevent_saving_moved_meta_fields( $meta, $post, $request ) {
		unset( $meta[ 'guid' ] );
		unset( $meta[ 'raw_content' ] );

		return $meta;
	}

	public function remove_moved_meta_fields( $response, $post, $request ) {
		$data = $response->get_data();

		$data[ 'meta' ][ 'guid' ]        = $post->guid;
		$data[ 'meta' ][ 'raw_content' ] = $post->post_content_filtered;

		$response->set_data( $data );

		return $response;
	}

}

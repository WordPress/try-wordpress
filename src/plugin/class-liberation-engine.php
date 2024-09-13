<?php

class LiberationEngine {
	const string POST_TYPE_POST       = 'liberated_post';
	const string POST_TYPE_PAGE       = 'liberated_page';
	const string POST_TYPE_PRODUCT    = 'liberated_product';
	const string POST_TYPE_NAVIGATION = 'liberated_navigation';

	private array $custom_post_types; // allows us to loop through constants defined above
	private array $custom_post_types_supports = array( 'title', 'editor', 'custom-fields' );
	private array $post_meta_fields = [ 'guid', 'raw_title', 'raw_date', 'raw_content' ];

	public function __construct() {
		$this->custom_post_types = $this->get_post_type_constants();

		add_action( 'init', array( $this, 'register_post_type_and_meta_fields' ) );

		// Intercept the REST API call for moving over 'guid' and 'raw_content' to posts table for our custom post types
		foreach ( $this->custom_post_types as $post_type ) {
			add_filter( 'rest_pre_insert_' . $post_type, array( $this, 'move_meta_fields' ), 10, 2 );
			add_filter( 'rest_prepare_' . $post_type, array( $this, 'prepare_meta_fields' ), 10, 3 );
		}
	}

	/**
	 * This function collects values of all constants defined as POST_TYPE_ in an array.
	 * Useful to declare multiple meta-fields on each one of them.
	 * Utilising this means a new constant when added to class is enough for inheriting meta-fields definition
	 *
	 * @return array
	 */
	private function get_post_type_constants() : array {
		$reflection = new ReflectionClass( $this );
		$constants  = $reflection->getConstants();

		return array_filter( $constants, function ( $key ) {
			return str_starts_with( $key, 'POST_TYPE_' );
		}, ARRAY_FILTER_USE_KEY );
	}

	public function register_post_type_and_meta_fields() : void {
		$this->register_post_types();
		$this->register_meta_fields();
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
				'supports'     => $this->custom_post_types_supports,
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
				'supports'     => $this->custom_post_types_supports,
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
				'supports'     => $this->custom_post_types_supports,
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
				'supports'     => $this->custom_post_types_supports,
			)
		);
	}

	public function is_debug_mode() : bool {
		return defined( 'WP_DEBUG' ) && WP_DEBUG;
	}

	public function register_meta_fields() : void {
		foreach ( $this->custom_post_types as $post_type ) {
			foreach ( $this->post_meta_fields as $field ) {
				register_post_meta( $post_type, $field, array(
					'show_in_rest' => true,
					'single'       => true,
					'type'         => 'string',
				) );
			}
		}
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

	public function prepare_meta_fields( $response, $post, $request ) {
		$data = $response->get_data();

		$data[ 'meta' ][ 'guid' ]        = $post->guid;
		$data[ 'meta' ][ 'raw_content' ] = $post->post_content_filtered;

		$response->set_data( $data );

		return $response;
	}
}

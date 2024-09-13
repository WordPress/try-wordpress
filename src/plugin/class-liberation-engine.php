<?php

class Liberation_Engine {
	const string POST_TYPE_POST       = 'liberated_post';
	const string POST_TYPE_PAGE       = 'liberated_page';
	const string POST_TYPE_PRODUCT    = 'liberated_product';
	const string POST_TYPE_NAVIGATION = 'liberated_navigation';

	/**
	 * Allows us to loop through constants defined above
	 *
	 * @var array $custom_post_types
	 */
	private array $custom_post_types;

	private array $custom_post_types_supports = array( 'title', 'editor', 'custom-fields' );
	private array $post_meta_fields           = array( 'guid', 'raw_title', 'raw_date', 'raw_content' );

	public function __construct() {
		$this->custom_post_types = $this->get_post_type_constants();

		add_action( 'init', array( $this, 'register_post_type_and_meta_fields' ) );

		// Intercept the REST API call for moving over 'guid' and 'raw_content' to posts table for our custom post types
		foreach ( $this->custom_post_types as $post_type ) {
			add_filter( 'rest_pre_insert_' . $post_type, array( $this, 'move_meta_fields' ), 10, 2 );
			add_filter( 'rest_prepare_' . $post_type, array( $this, 'prepare_meta_fields' ), 10, 3 );
		}

		// Extend REST API to add a 'promote' endpoint
		add_action( 'rest_api_init', array( $this, 'register_rest_api_route' ) );
	}

	/**
	 * This function collects values of all constants defined as POST_TYPE_ in an array.
	 * Useful to declare multiple meta-fields on each one of them.
	 * Utilising this means a new constant when added to class is enough for inheriting meta-fields definition
	 *
	 * @return array
	 */
	private function get_post_type_constants(): array {
		$reflection = new ReflectionClass( $this );
		$constants  = $reflection->getConstants();

		return array_filter(
			$constants,
			function ( $key ) {
				return str_starts_with( $key, 'POST_TYPE_' );
			},
			ARRAY_FILTER_USE_KEY
		);
	}

	public function register_post_type_and_meta_fields(): void {
		$this->register_post_types();
		$this->register_meta_fields();
	}

	public function register_post_types(): void {
		$args = array(
			'public'              => false,
			'exclude_from_search' => true,
			'publicly_queryable'  => true, // we need preview links of draft posts to function
			'show_in_rest'        => true,
			'show_ui'             => false,
			'show_in_menu'        => false,
			'supports'            => $this->custom_post_types_supports,
		);

		foreach ( $this->custom_post_types as $post_type ) {
			$label     = $post_type;
			$rest_base = $post_type . 's'; // plural

			$args['label']     = $label;
			$args['rest_base'] = $rest_base;

			register_post_type( $post_type, $args );
		}
	}

	public function register_meta_fields(): void {
		foreach ( $this->custom_post_types as $post_type ) {
			foreach ( $this->post_meta_fields as $field ) {
				register_post_meta(
					$post_type,
					$field,
					array(
						'show_in_rest' => true,
						'single'       => true,
						'type'         => 'string',
					)
				);
			}
		}
	}

	public function register_rest_api_route(): void {
		foreach ( $this->custom_post_types as $post_type ) {
			register_rest_route(
				'wp/v2',
				'/' . $post_type . '/(?P<id>\d+)/promote',
				array(
					'methods'             => 'POST',
					'callback'            => array( $this, 'promote_post' ),
					'permission_callback' => '__return_true',
					'args'                => array(
						'id' => array(
							'validate_callback' => function ( $param, $request, $key ) {
								return is_numeric( $param );
							},
						),
					),
				)
			);
		}
	}

	public function promote_post( $request ): WP_Error|WP_REST_Response {
		$post_id = $request['id'];
		$post    = get_post( $post_id );

		if ( ! $post ) {
			return new WP_Error( 'no_post', 'Invalid post ID', array( 'status' => 404 ) );
		}

		$this->promote_liberated_post_types( $post );

		return new WP_REST_Response(
			array(
				'success' => true,
				'message' => 'Post promoted successfully',
				'post_id' => $post_id,
			),
			200
		);
	}

	public function move_meta_fields( $prepared_post, $request ) {
		$meta = $request->get_param( 'meta' );

		if ( isset( $meta['guid'] ) ) {
			$prepared_post->guid = $meta['guid'];
			unset( $meta['guid'] );
		}

		if ( isset( $meta['raw_content'] ) ) {
			$prepared_post->post_content_filtered = $meta['raw_content'];
			unset( $meta['raw_content'] );
		}

		$request->set_param( 'meta', $meta );

		return $prepared_post;
	}

	public function prepare_meta_fields( $response, $post, $request ) {
		$data = $response->get_data();

		$data['meta']['guid']        = $post->guid;
		$data['meta']['raw_content'] = $post->post_content_filtered;

		$response->set_data( $data );

		return $response;
	}

	public function promote_liberated_post_types( $post ): bool {
		$inserted_post_id = wp_insert_post(
			array(
				'post_author'       => $post->post_author,
				'post_date'         => $post->post_date,
				'post_date_gmt'     => $post->post_date_gmt,
				'post_modified'     => $post->post_modified,
				'post_modified_gmt' => $post->post_modified_gmt,
				'post_content'      => $post->post_content,
				'post_title'        => $post->post_title,
				'post_excerpt'      => $post->post_excerpt,
				'post_status'       => 'publish',
				'comment_status'    => $post->comment_status,
				'ping_status'       => $post->ping_status,
				'post_password'     => $post->post_password,
				'post_name'         => $post->post_name,
				'post_type'         => str_replace( 'liberated_', '', $post->post_type ),
			)
		);

		// @TODO: handle attachments, terms etc in future
		// Note: Do not need anything from postmeta.
		// We should potentially use another plugin here for this purpose and call its API to do it for us.

		if ( is_wp_error( $inserted_post_id ) ) {
			return false;
		}

		add_post_meta( $post->ID, '_liberated_post', $inserted_post_id );
		return true;
	}
}

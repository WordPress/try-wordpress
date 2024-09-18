<?php

namespace DotOrg\TryWordPress;

class Meta_Fields_Manager {
	private array $custom_post_types;
	private array $post_meta_fields = array( 'guid', 'raw_title', 'raw_date', 'raw_content' );

	public function __construct( $custom_post_types ) {
		$this->custom_post_types = $custom_post_types;

		add_action( 'init', array( $this, 'register_meta_fields' ) );

		// Intercept the REST API call for moving over 'guid' and 'raw_content' to posts table for our custom post types
		foreach ( $this->custom_post_types as $post_type ) {
			add_filter( 'rest_pre_insert_' . $post_type, array( $this, 'move_meta_fields' ), 10, 2 );
			add_filter( 'rest_prepare_' . $post_type, array( $this, 'prepare_meta_fields' ), 10, 3 );
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

	/**
	 * This function moves some of the meta fields to the post object before saving
	 *
	 * @param object           $prepared_post Post object that is going to be saved.
	 * @param \WP_REST_Request $request REST API request object.
	 * @return object
	 */
	public function move_meta_fields( object $prepared_post, \WP_REST_Request $request ): object {
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

	public function prepare_meta_fields( \WP_REST_Response $response, object $post, \WP_REST_Request $request ): \WP_REST_Response {
		$data = $response->get_data();

		$data['meta']['guid']        = $post->guid;
		$data['meta']['raw_content'] = $post->post_content_filtered;

		$response->set_data( $data );

		return $response;
	}
}

<?php

namespace DotOrg\TryWordPress;

use WP_REST_Request;
use WP_REST_Response;
use WP_Error;

class Rest_API_Extender {
	private array $custom_post_types;

	public function __construct( $custom_post_types ) {
		$this->custom_post_types = $custom_post_types;

		add_action( 'rest_api_init', array( $this, 'register_route' ) );
	}

	public function register_route(): void {
		foreach ( $this->custom_post_types as $post_type ) {
			register_rest_route(
				'wp/v2',
				'/' . $post_type . 's/(?P<id>\d+)/promote',
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

	public function promote_post( WP_REST_Request $request ): WP_Error|WP_REST_Response {
		$post_id = $request['id'];
		$post    = get_post( $post_id );

		if ( ! $post ) {
			return new WP_Error( 'no_post', 'Invalid post ID', array( 'status' => 404 ) );
		}

		if ( $this->promote_liberated_post_types( $post ) ) {
			return new WP_REST_Response(
				array(
					'success' => true,
					'message' => 'Post promoted successfully',
					'post_id' => get_post_meta( $post_id, '_liberated_post', true ),
				),
				200
			);
		} else {
			return new WP_Error( 'error', 'Could not promote post', array( 'status' => 500 ) );
		}
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

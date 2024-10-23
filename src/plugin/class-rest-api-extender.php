<?php

namespace DotOrg\TryWordPress;

use WP_Error;
use WP_REST_Request;
use WP_REST_Response;

class Rest_API_Extender {
	private string $post_type;
	private Promoter $promoter;

	public function __construct( $custom_post_type, $promoter ) {
		$this->post_type = $custom_post_type;
		$this->promoter  = $promoter;

		add_action( 'rest_api_init', array( $this, 'register_route' ) );

		add_filter(
			'rest_' . $this->post_type . '_query',
			function ( $args, \WP_REST_Request $request ) {
				return $this->filter_posts_by_guid( $this->post_type, $args, $request );
			},
			10,
			2
		);

		add_filter( 'rest_prepare_' . $this->post_type, array( $this, 'inject_preview_link' ), 10, 3 );
	}

	public function register_route(): void {
		register_rest_route(
			'wp/v2',
			'/' . $this->post_type . '/(?P<id>\d+)/promote',
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

	public function promote_post( WP_REST_Request $request ): WP_Error|WP_REST_Response {
		$post_id = $request['id'];
		$post    = get_post( $post_id );

		if ( is_null( $post ) ) {
			return new WP_Error( 'no_post', 'Invalid post ID', array( 'status' => 404 ) );
		}

		if ( $this->promoter->promote( $post ) ) {
			return new WP_REST_Response(
				array(
					'success' => true,
					'message' => 'Post promoted successfully',
					'post_id' => $this->promoter->get_promoted_post_id( $post_id ),
				),
				200
			);
		} else {
			return new WP_Error( 'error', 'Could not promote post', array( 'status' => 500 ) );
		}
	}

	public function filter_posts_by_guid( $post_type, $args, \WP_REST_Request $request ): array {
		if ( ! $request->has_param( 'guid' ) ) {
			return $args;
		}

		$guid = urldecode( $request->get_param( 'guid' ) );

		global $wpdb;
		// @phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.DirectQuery
		$post_id = $wpdb->get_var(
			$wpdb->prepare(
				"SELECT ID FROM {$wpdb->posts} WHERE post_type = %s AND guid = %s AND post_status IN ('draft', 'publish') LIMIT 1",
				$post_type,
				$guid
			)
		);

		if ( $post_id ) {
			$args['p'] = (int) $post_id;
		} else {
			$args['post__in'] = array( 0 ); // This will ensure no posts are returned.
		}

		return $args;
	}

	public function inject_preview_link( WP_REST_Response $response, object $post, WP_REST_Request $request ): WP_REST_Response {
		$data = $response->get_data();

		$promoted_post_id = $this->promoter->get_promoted_post_id( $post->ID );
		if ( $promoted_post_id ) {
			$data['transformed_id'] = $promoted_post_id;
			$response->set_data( $data );
		}

		return $response;
	}
}

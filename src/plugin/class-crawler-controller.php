<?php

namespace DotOrg\TryWordPress;

use WP_Error;
use WP_REST_Controller;
use WP_REST_Response;
use WP_REST_Server;

class Crawler_Controller extends WP_REST_Controller {

	/**
	 * Domain is inferred from liberated_data guid
	 *
	 * @var string $domain Domain/Host being liberated
	 */
	private string $domain = '';

	private string $crawler_queue_post_type;

	public function __construct( string $domain, string $crawler_queue_post_type ) {
		$this->domain                  = $domain;
		$this->crawler_queue_post_type = $crawler_queue_post_type;

		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	public function register_routes(): void {
		$version   = '1';
		$namespace = 'try-wp/v' . $version;
		register_rest_route(
			$namespace,
			'/crawler/next',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_next_url' ),
					'permission_callback' => '__return_true',
					'args'                => array(
						'context' => array(
							'default' => 'view',
						),
					),
				),
			)
		);
		register_rest_route(
			$namespace,
			'/crawler/queue',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'queue_urls' ),
					'permission_callback' => '__return_true',
					// @TODO Specify args here so that sanitization is handled automatically
					'args'                => array(
						'context' => array(
							'default' => 'view',
						),
					),
				),
			)
		);
	}

	public function get_next_url( $request ): WP_REST_Response|WP_Error {
		$ready_to_crawl_urls = get_posts(
			array(
				'post_type'      => $this->crawler_queue_post_type,
				'posts_per_page' => 1,
				'post_status'    => 'discovered',
				'orderby'        => 'date',
				'order'          => 'ASC',
			)
		);

		if ( empty( $ready_to_crawl_urls ) ) {
			// have we finished crawling or haven't even started yet?
			$crawled_urls = get_posts(
				array(
					'post_type'      => $this->crawler_queue_post_type,
					'posts_per_page' => 1,
					'post_status'    => 'crawled',
					'orderby'        => 'date',
					'order'          => 'ASC',
				)
			);

			if ( empty( $crawled_urls ) ) {
				// we haven't begun, so return domain itself
				return new WP_REST_Response( $this->domain );
			}

			return new WP_REST_Response( null, 204 );
		}

		return new WP_REST_Response( $ready_to_crawl_urls[0]->guid );
	}

	public function queue_urls( $request ): WP_REST_Response|WP_Error {
		$request_data = json_decode( $request->get_body(), true );

		if ( empty( $request_data['sourceUrl'] ) ) {
			return new WP_REST_Response( null, 400 );
		}

		$post_id = $this->get_post_id_by_guid( $request_data['sourceUrl'] );
		if ( empty( $post_id ) ) {
			return new WP_REST_Response( null, 404 );
		}

		$source_url = sanitize_url( $request_data['sourceUrl'] );
		$marked     = $this->mark_url_as_crawled( $source_url );
		if ( is_wp_error( $marked ) ) {
			return $marked;
		}

		foreach ( $request_data['urls']as $url ) {
			$queued_result = $this->queue_url( $url );
			if ( is_wp_error( $queued_result ) ) {
				return $queued_result;
			}
		}

		return new WP_REST_Response();
	}

	private function queue_url( string $url ): true|WP_Error {
		$post_id = $this->get_post_id_by_guid( $url );

		// insert only if it's not present
		if ( empty( $post_id ) ) {
			$inserted_post_id = wp_insert_post(
				array(
					'post_type' => $this->crawler_queue_post_type,
					'guid'      => sanitize_url( $url ),
				),
				true
			);

			if ( is_wp_error( $inserted_post_id ) ) {
				return $inserted_post_id;
			}

			return true;
		}

		return true;
	}

	private function mark_url_as_crawled( $url ): true|WP_Error {
		$post_id           = $this->get_post_id_by_guid( $url );
		$post              = get_post( $post_id );
		$post->post_status = 'crawled';
		if ( wp_update_post( $post ) === $post->ID ) {
			return true;
		}

		return new WP_Error(
			'rest_save_failed',
			__( 'Failed to update url as crawled', 'try_wordpress' ),
			array( 'status' => 500 )
		);
	}

	public function get_post_id_by_guid( string $guid ): ?int {
		// Use wp_cache_* for guid -> postId
		$cache_group = 'try_wp';
		$cache_key   = 'try_wp_crawler_cache_guid_' . md5( $guid );
		$post_id     = wp_cache_get( $cache_key, $cache_group );

		if ( false !== $post_id ) {
			// Cache hit - get post using WordPress API
			$post = get_post( $post_id );
			if ( $post ) {
				return (int) $post_id;
			}
			// If post not found despite cache hit, delete the cache
			wp_cache_delete( $cache_key, $cache_group );
		}

		// Cache miss - query database
		global $wpdb;
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery
		$post_id = $wpdb->get_var(
			$wpdb->prepare(
				"SELECT ID FROM $wpdb->posts WHERE guid = %s",
				$guid
			)
		);

		if ( $post_id ) {
			// Cache the post ID for future lookups
			wp_cache_set( $cache_key, $post_id, $cache_group, YEAR_IN_SECONDS );
			return (int) $post_id;
		}

		return null;
	}
}

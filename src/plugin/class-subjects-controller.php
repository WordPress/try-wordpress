<?php

namespace DotOrg\TryWordPress;

use DateTime;
use DateTimeZone;
use WP_Error;
use WP_REST_Controller;
use WP_REST_Response;

class Subjects_Controller extends WP_REST_Controller {

	protected string $storage_post_type;

	public function __construct( $storage_post_type ) {
		$this->storage_post_type = $storage_post_type;

		$this->attach_filters();
	}

	public function get_storage_post_type(): string {
		return $this->storage_post_type;
	}

	public function valid_request_for_insert( $request ): bool|WP_Error {
		$request_data = json_decode( $request->get_body(), true );
		$guid         = $request_data['sourceUrl']; // required arg, will always be present at this point

		// Rule1: guid must be unique
		$post_id = $this->get_post_id_by_guid( $guid );

		if ( $post_id ) {
			return new WP_Error(
				'rest_source_url_not_unique',
				__( 'Source URL specified already exists', 'try_wordpress' ),
				array( 'status' => 409 )
			);
		}

		return true;
	}

	public function valid_request_for_update( $request ): bool|WP_Error {
		// Rule1: post id must be a valid id
		$post_id = $request['id'];
		$item    = get_post( $post_id );
		if ( is_null( $item ) ) {
			return new WP_Error(
				'rest_post_invalid_id',
				__( 'Invalid post ID.', 'try_wordpress' ),
				array( 'status' => 404 )
			);
		}

		// Rule2: if sourceUrl is supplied, it must be the same as already saved
		$request_data = json_decode( $request->get_body(), true );
		if ( isset( $request_data['sourceUrl'] ) && $request_data['sourceUrl'] !== $item->guid ) {
			return new WP_Error(
				'rest_source_url_immutable',
				__( 'Source URL is immutable', 'try_wordpress' ),
				array( 'status' => 400 )
			);
		}

		return true;
	}

	public function attach_filters(): void {
		add_filter(
			'wp_insert_post_empty_content',
			function ( $maybe_empty, $postarr ) {
				if ( $postarr['post_type'] === $this->storage_post_type ) {
					return false;
				}
				return $maybe_empty;
			},
			10,
			2
		);

		// Bust guid -> postId cache when a post is deleted
		add_action(
			'delete_post_' . $this->storage_post_type,
			function ( $post_id, $post ) {
				$cache_group = 'try_wp';
				$cache_key   = 'try_wp_cache_guid_' . md5( $post->guid );

				wp_cache_delete( $cache_key, $cache_group );
			},
			10,
			2
		);
	}

	public function prepare_item_for_response( $item, $request ): WP_REST_Response|WP_Error {
		if ( empty( $item['ID'] ) ) {
			return new WP_Error(
				'rest_post_missing_id',
				__( 'Missing post ID when preparing item for response.', 'try_wordpress' ),
				array( 'status' => 500 )
			);
		}

		$response = array(
			'id'            => $item['ID'],
			'authorId'      => $item['post_author'] ?? '',
			'sourceUrl'     => $item['guid'] ?? '',
			'sourceHtml'    => $item['post_content_filtered'] ?? '',
			'rawTitle'      => get_post_meta( $item['ID'], 'raw_title', true ),
			'parsedTitle'   => $item['post_title'] ?? '',
			'rawDate'       => get_post_meta( $item['ID'], 'raw_date', true ),
			'parsedDate'    => $item['post_date'] ?? '',
			'rawContent'    => get_post_meta( $item['ID'], 'raw_content', true ),
			'parsedContent' => $item['post_content'] ?? '',
			'transformedId' => get_post_meta( $item['ID'], '_dl_transformed', true ),
		);

		$response['previewUrl'] = get_permalink( $response['transformedId'] );

		return new WP_REST_Response( $response );
	}

	public function prepare_item_for_database( $request ): WP_Error|array {
		$prepared_post = array();
		$request_data  = json_decode( $request->get_body(), true );

		if ( isset( $request_data['parsedDate'] ) ) {
			try {
				$datetime      = new DateTime( $request_data['parsedDate'], new DateTimeZone( 'UTC' ) );
				$post_date     = $datetime->format( 'Y-m-d H:i:s' );
				$post_date_gmt = get_gmt_from_date( $post_date );
			} catch ( \Exception $e ) {
				return new WP_Error(
					'invalid_date_format',
					// translators: %s: Error message describing the invalid date format.
					sprintf( __( 'Invalid date format: %s', 'try_wordpress' ), $e->getMessage() ),
					array( 'status' => 400 )
				);
			}
		}

		// Prepare $postarr that can be passed to wp_insert_post()
		$prepared_post['ID']                    = $request['id'];
		$prepared_post['post_type']             = $this->storage_post_type;
		$prepared_post['post_title']            = $request_data['parsedTitle'] ?? '';
		$prepared_post['post_date']             = $post_date ?? '';
		$prepared_post['post_date_gmt']         = $post_date_gmt ?? '';
		$prepared_post['post_content']          = $request_data['parsedContent'] ?? '';
		$prepared_post['post_content_filtered'] = $request_data['sourceHtml'] ?? '';
		$prepared_post['guid']                  = $request_data['sourceUrl'] ?? '';
		$prepared_post['post_author']           = $request_data['authorId'] ?? '';

		$prepared_post['meta'] = array(
			'raw_title'   => $request_data['rawTitle'] ?? '',
			'raw_date'    => $request_data['rawDate'] ?? '',
			'raw_content' => $request_data['rawContent'] ?? '',
		);

		return $prepared_post;
	}

	public function get_post_id_by_guid( string $guid ): ?int {
		// Use wp_cache_* for guid -> postId
		$cache_group = 'try_wp';
		$cache_key   = 'try_wp_cache_guid_' . md5( $guid );
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

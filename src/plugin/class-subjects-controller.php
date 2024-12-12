<?php

namespace DotOrg\TryWordPress;

use DateTime;
use DateTimeZone;
use WP_Error;
use WP_REST_Controller;
use WP_REST_Response;
use WP_REST_Server;

class Subjects_Controller extends WP_REST_Controller {
	private string $storage_post_type;
	private array $subject_types;

	protected $schema;

	public function __construct( $storage_post_type ) {
		$this->storage_post_type = $storage_post_type;
		$this->init_schema();
		$this->subject_types = array_keys( $this->schema );

		add_action( 'rest_api_init', array( $this, 'register_routes' ) );

		$this->attach_filters();
		$this->get_item_schema();
	}

	public function init_schema(): void {
		$this->schema = array(
			'blog-post' => array(
				'$schema'    => 'http://json-schema.org/draft-04/schema#',
				'title'      => 'blogpost',
				'type'       => 'object',
				'properties' => array(
					'id'            => array(
						'description' => __( 'Unique identifier for liberated blogpost', 'try_wordpress' ),
						'type'        => 'integer',
						'context'     => array( 'view', 'edit' ),
						'readonly'    => true,
					),
					'authorId'      => array(
						'description' => __( 'Author ID of the blogpost', 'try_wordpress' ),
						'type'        => 'integer',
						'context'     => array( 'view', 'edit' ),
						'required'    => false,
					),
					'sourceUrl'     => array(
						'description' => __( 'Source URL from where the blogpost was liberated', 'try_wordpress' ),
						'type'        => 'string',
						'context'     => array( 'view', 'edit' ),
						'required'    => true,
						'arg_options' => array(
							'sanitize_callback' => 'sanitize_text_field',
						),
					),
					'sourceHtml'    => array(
						'description' => __( 'Source HTML from where the blogpost was liberated', 'try_wordpress' ),
						'type'        => 'string',
						'context'     => array( 'view', 'edit' ),
						'required'    => false,
						'arg_options' => array(
							'sanitize_callback' => 'sanitize_text_field',
						),
					),
					'rawTitle'      => array(
						'description' => __( 'Raw title of the blogpost', 'try_wordpress' ),
						'type'        => 'string',
						'context'     => array( 'view', 'edit' ),
						'required'    => false,
						'arg_options' => array(
							'sanitize_callback' => 'sanitize_text_field',
						),
					),
					'parsedTitle'   => array(
						'description' => __( 'Parsed title of the blogpost', 'try_wordpress' ),
						'type'        => 'string',
						'context'     => array( 'view', 'edit' ),
						'required'    => false,
						'arg_options' => array(
							'sanitize_callback' => 'sanitize_text_field',
						),
					),
					'rawDate'       => array(
						'description' => __( 'Raw date of the blogpost', 'try_wordpress' ),
						'type'        => 'string',
						'context'     => array( 'view', 'edit' ),
						'required'    => false,
						'arg_options' => array(
							'sanitize_callback' => 'sanitize_text_field',
						),
					),
					'parsedDate'    => array(
						'description' => __( 'Parsed date of the blogpost', 'try_wordpress' ),
						'type'        => 'string',
						'context'     => array( 'view', 'edit' ),
						'required'    => false,
						'arg_options' => array(
							'sanitize_callback' => 'sanitize_text_field',
						),
					),
					'rawContent'    => array(
						'description' => __( 'Raw content of the blogpost', 'try_wordpress' ),
						'type'        => 'string',
						'context'     => array( 'view', 'edit' ),
						'required'    => false,
						'arg_options' => array(
							'sanitize_callback' => 'sanitize_text_field',
						),
					),
					'parsedContent' => array(
						'description' => __( 'Parsed content of the blogpost', 'try_wordpress' ),
						'type'        => 'string',
						'context'     => array( 'view', 'edit' ),
						'required'    => false,
						'arg_options' => array(
							'sanitize_callback' => 'sanitize_text_field',
						),
					),
					'transformedId' => array(
						'description' => __( 'Post ID of transformed result of this liberated blogpost', 'try_wordpress' ),
						'type'        => 'string',
						'context'     => array( 'view', 'edit' ),
						'required'    => false,
						'arg_options' => array(
							'sanitize_callback' => 'sanitize_text_field',
						),
					),
				),
			),
			'page'      => array(
				'$schema'    => 'http://json-schema.org/draft-04/schema#',
				'title'      => 'page',
				'type'       => 'object',
				'properties' => array(
					'id'            => array(
						'description' => __( 'Unique identifier for liberated page', 'try_wordpress' ),
						'type'        => 'integer',
						'context'     => array( 'view', 'edit' ),
						'readonly'    => true,
					),
					'authorId'      => array(
						'description' => __( 'Author ID of the page', 'try_wordpress' ),
						'type'        => 'integer',
						'context'     => array( 'view', 'edit' ),
						'required'    => false,
					),
					'sourceUrl'     => array(
						'description' => __( 'Source URL from where the page was liberated', 'try_wordpress' ),
						'type'        => 'string',
						'context'     => array( 'view', 'edit' ),
						'required'    => true,
						'arg_options' => array(
							'sanitize_callback' => 'sanitize_text_field',
						),
					),
					'sourceHtml'    => array(
						'description' => __( 'Source HTML from where the page was liberated', 'try_wordpress' ),
						'type'        => 'string',
						'context'     => array( 'view', 'edit' ),
						'required'    => false,
						'arg_options' => array(
							'sanitize_callback' => 'sanitize_text_field',
						),
					),
					'rawTitle'      => array(
						'description' => __( 'Raw title of the page', 'try_wordpress' ),
						'type'        => 'string',
						'context'     => array( 'view', 'edit' ),
						'required'    => false,
						'arg_options' => array(
							'sanitize_callback' => 'sanitize_text_field',
						),
					),
					'parsedTitle'   => array(
						'description' => __( 'Parsed title of the page', 'try_wordpress' ),
						'type'        => 'string',
						'context'     => array( 'view', 'edit' ),
						'required'    => false,
						'arg_options' => array(
							'sanitize_callback' => 'sanitize_text_field',
						),
					),
					'rawDate'       => array(
						'description' => __( 'Raw date of the page', 'try_wordpress' ),
						'type'        => 'string',
						'context'     => array( 'view', 'edit' ),
						'required'    => false,
						'arg_options' => array(
							'sanitize_callback' => 'sanitize_text_field',
						),
					),
					'parsedDate'    => array(
						'description' => __( 'Parsed date of the page', 'try_wordpress' ),
						'type'        => 'string',
						'context'     => array( 'view', 'edit' ),
						'required'    => false,
						'arg_options' => array(
							'sanitize_callback' => 'sanitize_text_field',
						),
					),
					'rawContent'    => array(
						'description' => __( 'Raw content of the page', 'try_wordpress' ),
						'type'        => 'string',
						'context'     => array( 'view', 'edit' ),
						'required'    => false,
						'arg_options' => array(
							'sanitize_callback' => 'sanitize_text_field',
						),
					),
					'parsedContent' => array(
						'description' => __( 'Parsed content of the page', 'try_wordpress' ),
						'type'        => 'string',
						'context'     => array( 'view', 'edit' ),
						'required'    => false,
						'arg_options' => array(
							'sanitize_callback' => 'sanitize_text_field',
						),
					),
					'transformedId' => array(
						'description' => __( 'Post ID of transformed result of this liberated page', 'try_wordpress' ),
						'type'        => 'string',
						'context'     => array( 'view', 'edit' ),
						'required'    => false,
						'arg_options' => array(
							'sanitize_callback' => 'sanitize_text_field',
						),
					),
				),
			),
		);
	}

	public function register_routes(): void {
		$version   = '1';
		$namespace = 'try-wp/v' . $version;

		foreach ( $this->subject_types as $subject_type ) {
			register_rest_route(
				$namespace,
				'/subjects/' . $subject_type,
				array(
					array(
						'methods'             => WP_REST_Server::CREATABLE,
						'callback'            => array( $this, 'create_item' ),
						'permission_callback' => '__return_true',
						'args'                => $this->get_endpoint_args_for_subject_schema( $subject_type, WP_REST_Server::CREATABLE ),
					),
					array(
						'methods'             => WP_REST_Server::READABLE,
						'callback'            => array( $this, 'search_item' ),
						'permission_callback' => '__return_true',
						'args'                => $this->get_endpoint_args_for_subject_schema( $subject_type, WP_REST_Server::READABLE ),
					),
				)
			);

			register_rest_route(
				$namespace,
				'/subjects/' . $subject_type . '/(?P<id>\d+)',
				array(
					array(
						'methods'             => WP_REST_Server::READABLE,
						'callback'            => array( $this, 'get_item' ),
						'permission_callback' => '__return_true',
						'args'                => array(
							'context' => array(
								'default' => 'view',
							),
						),
					),
					array(
						'methods'             => WP_REST_Server::EDITABLE,
						'callback'            => array( $this, 'update_item' ),
						'permission_callback' => '__return_true',
						'args'                => $this->get_endpoint_args_for_subject_schema( $subject_type, WP_REST_Server::EDITABLE ),
					),
					array(
						'methods'             => WP_REST_Server::DELETABLE,
						'callback'            => array( $this, 'delete_item' ),
						'permission_callback' => '__return_true',
						'args'                => array(
							'force' => array(
								'default' => false,
							),
						),
					),
				)
			);

			register_rest_route(
				$namespace,
				'/subjects/' . $subject_type . '/schema',
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => function () use ( $subject_type ) {
						return $this->get_public_subject_schema( $subject_type );
					},
					'permission_callback' => '__return_true',
				)
			);
		}
	}

	public function get_public_subject_schema( $subject_type ) {
		$schema = $this->schema[ $subject_type ];
		return $this->remove_arg_options_from_schema( $schema );
	}

	private function remove_arg_options_from_schema( &$schema ) {
		foreach ( $schema['properties'] as &$property ) {
			unset( $property['arg_options'] );
		}
		return $schema;
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

	public function get_endpoint_args_for_subject_schema( $subject_type, $method ): array {
		return rest_get_endpoint_args_for_schema( $this->schema[ $subject_type ], $method );
	}

	public function get_item( $request ): WP_REST_Response|WP_Error {
		$post_id = $request['id'];
		$item    = get_post( $post_id, ARRAY_A );
		if ( is_null( $item ) ) {
			return new WP_Error(
				'rest_post_invalid_id',
				__( 'Invalid post ID.', 'try_wordpress' ),
				array( 'status' => 404 )
			);
		}

		return $this->prepare_item_for_response( $item, $request );
	}

	public function create_item( $request ): WP_REST_Response|WP_Error {
		$valid_request_for_insert = $this->valid_request_for_insert( $request );
		if ( is_wp_error( $valid_request_for_insert ) ) {
			return $valid_request_for_insert;
		}

		$item      = $this->prepare_item_for_database( $request );
		$item_meta = $item['meta'];
		unset( $item['meta'] );

		$result = wp_insert_post( $item, true );
		if ( is_wp_error( $result ) ) {
			return $result;
		}
		$item['ID'] = $result;

		foreach ( $item_meta as $key => $value ) {
			update_post_meta( $item['ID'], $key, $value );
		}
		update_post_meta( $item['ID'], 'subject_type', 'page' );

		return $this->prepare_item_for_response( $item, $request );
	}

	public function update_item( $request ): WP_REST_Response|WP_Error {
		$valid_request_for_update = $this->valid_request_for_update( $request );
		if ( is_wp_error( $valid_request_for_update ) ) {
			return $valid_request_for_update;
		}

		$item      = $this->prepare_item_for_database( $request );
		$item_meta = $item['meta'];
		unset( $item['meta'] );

		$result = wp_insert_post( $item, true );
		if ( is_wp_error( $result ) ) {
			return $result;
		}

		foreach ( $item_meta as $key => $value ) {
			update_post_meta( $item['ID'], $key, $value );
		}

		return $this->prepare_item_for_response( $item, $request );
	}

	public function delete_item( $request ): WP_Error|WP_REST_Response {
		$post_id = $request['id'];

		$item = get_post( $post_id );
		if ( is_null( $item ) ) {
			return new WP_Error(
				'rest_post_invalid_id',
				__( 'Invalid post ID.', 'try_wordpress' ),
				array( 'status' => 404 )
			);
		}

		if ( wp_delete_post( $request['id'], true ) ) {
			return new WP_REST_Response( true, 204 );
		}

		return new WP_Error( 'rest_could_not_delete', __( 'Could not delete', 'try_wordpress' ), array( 'status' => 500 ) );
	}

	public function search_item( $request ): WP_Error|WP_REST_Response {
		$guid = $request['sourceurl'] ?? '';

		if ( empty( $guid ) ) {
			return new WP_Error(
				'rest_search_invalid_sourceurl',
				__( 'Invalid source URL.', 'try_wordpress' ),
				array( 'status' => 400 )
			);
		}

		$post_id = $this->get_post_id_by_guid( $guid );

		if ( $post_id ) {
			$post = get_post( $post_id, ARRAY_A );
			return $this->prepare_item_for_response( $post, $request );
		}

		return new WP_Error(
			'rest_not_found',
			__( 'Not found', 'try_wordpress' ),
			array( 'status' => 404 )
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

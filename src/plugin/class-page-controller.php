<?php

namespace DotOrg\TryWordPress;

use WP_Error;
use WP_REST_Response;
use WP_REST_Server;

class Page_Controller extends Subjects_Controller {

	public function __construct( $storage_post_type ) {
		parent::__construct( $storage_post_type );

		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	public function register_routes(): void {
		$version             = '1';
		$namespace           = 'try-wp/v' . $version;
		$subject_type_plural = 'pages';
		register_rest_route(
			$namespace,
			'/' . $subject_type_plural,
			array(
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'create_item' ),
					'permission_callback' => '__return_true',
					'args'                => $this->get_endpoint_args_for_item_schema( WP_REST_Server::CREATABLE ),
				),
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'search_item' ),
					'permission_callback' => '__return_true',
					'args'                => $this->get_endpoint_args_for_item_schema( WP_REST_Server::READABLE ),
				),
			)
		);
		register_rest_route(
			$namespace,
			'/' . $subject_type_plural . '/(?P<id>\d+)',
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
					'args'                => $this->get_endpoint_args_for_item_schema( WP_REST_Server::EDITABLE ),
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
			'/' . $subject_type_plural . '/schema',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_public_item_schema' ),
				'permission_callback' => '__return_true',
			)
		);
	}

	public function get_item_schema(): array {
		if ( $this->schema ) {
			return $this->schema;
		}

		$schema = array(
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
		);

		$this->schema = $schema;
		return $this->schema;
	}
}

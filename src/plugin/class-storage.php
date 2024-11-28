<?php

namespace DotOrg\TryWordPress;

class Storage {
	private string $liberated_data_post_type;
	private string $liberated_data_post_type_name;
	private string $crawler_data_post_type;
	private string $crawler_data_post_type_name        = 'Crawler URL';
	private string $crawler_data_post_type_name_plural = 'Crawler URLs';

	private array $custom_post_types_supports = array( 'title', 'editor', 'custom-fields' );

	public function __construct( string $liberated_data_post_type, string $crawler_data_post_type ) {
		$this->liberated_data_post_type      = $liberated_data_post_type;
		$this->liberated_data_post_type_name = ucwords( str_replace( '_', ' ', $liberated_data_post_type ) );
		$this->crawler_data_post_type        = $crawler_data_post_type;

		add_action( 'init', array( $this, 'register_post_types' ) );
	}

	public function register_post_types(): void {
		register_post_type(
			$this->liberated_data_post_type,
			array(
				'public'              => false,
				'exclude_from_search' => true,
				'publicly_queryable'  => false,
				'show_in_rest'        => true,
				'show_ui'             => true,
				'show_in_menu'        => WP_DEBUG,
				'menu_icon'           => 'dashicons-database',
				'supports'            => $this->custom_post_types_supports,
				'labels'              => $this->get_post_type_registration_labels(
					$this->liberated_data_post_type_name,
					$this->liberated_data_post_type_name
				),
				'rest_base'           => $this->liberated_data_post_type,
			)
		);

		register_post_type(
			$this->crawler_data_post_type,
			array(
				'public'              => false,
				'exclude_from_search' => true,
				'publicly_queryable'  => false,
				'show_in_rest'        => false,
				'show_ui'             => true,
				'show_in_menu'        => WP_DEBUG,
				'menu_icon'           => 'dashicons-editor-ul',
				'supports'            => array( '' ), // has to be empty string array, otherwise title and content support comes in by default
				'labels'              => $this->get_post_type_registration_labels(
					$this->crawler_data_post_type_name,
					$this->crawler_data_post_type_name_plural
				),
				'rest_base'           => $this->crawler_data_post_type,
			)
		);

		register_post_status(
			'discovered',
			array(
				'label'                     => _x( 'Discovered', 'post status', 'try_wordpress' ),
				'public'                    => false,
				'exclude_from_search'       => true,
				'show_in_admin_all_list'    => true,
				'show_in_admin_status_list' => true,
				'internal'                  => true,
				// translators: %s: Number of discovered posts
				'label_count'               => _n_noop( 'Discovered <span class="count">(%s)</span>', 'Discovered <span class="count">(%s)</span>', 'try_wordpress' ),
			)
		);

		register_post_status(
			'crawled',
			array(
				'label'                     => _x( 'Crawled', 'post status', 'try_wordpress' ),
				'public'                    => false,
				'exclude_from_search'       => true,
				'show_in_admin_all_list'    => true,
				'show_in_admin_status_list' => true,
				'internal'                  => true,
				// translators: %s: Number of crawled posts
				'label_count'               => _n_noop( 'Crawled <span class="count">(%s)</span>', 'Crawled <span class="count">(%s)</span>', 'try_wordpress' ),
			)
		);
	}

	public function get_post_type_registration_labels( string $name, string $name_plural ): array {
		return array(
			'name'                  => $name_plural,
			'singular_name'         => $name,
			'menu_name'             => $name_plural,
			'name_admin_bar'        => $name,

			// translators: %s: Name of the custom post type in singular form
			'archives'              => sprintf( __( '%s Archives', 'try_wordpress' ), ucwords( $name ) ),

			// translators: %s: Name of the custom post type in singular form
			'attributes'            => sprintf( __( '%s Attributes', 'try_wordpress' ), ucwords( $name ) ),

			// translators: %s: Name of the custom post type in singular form
			'parent_item_colon'     => sprintf( __( 'Parent %s:', 'try_wordpress' ), ucwords( $name ) ),

			// translators: %s: Name of the custom post type in plural form
			'all_items'             => sprintf( __( 'All %s', 'try_wordpress' ), ucwords( $name_plural ) ),

			// translators: %s: Name of the custom post type in singular form
			'add_new_item'          => sprintf( __( 'Add New %s', 'try_wordpress' ), ucwords( $name ) ),
			'add_new'               => __( 'Add New', 'try_wordpress' ),

			// translators: %s: Name of the custom post type in singular form
			'new_item'              => sprintf( __( 'New %s', 'try_wordpress' ), ucwords( $name ) ),

			// translators: %s: Name of the custom post type in singular form
			'edit_item'             => sprintf( __( 'Edit %s', 'try_wordpress' ), ucwords( $name ) ),

			// translators: %s: Name of the custom post type in singular form
			'update_item'           => sprintf( __( 'Update %s', 'try_wordpress' ), ucwords( $name ) ),

			// translators: %s: Name of the custom post type in singular form
			'view_item'             => sprintf( __( 'View %s', 'try_wordpress' ), ucwords( $name ) ),

			// translators: %s: Name of the custom post type in plural form
			'view_items'            => sprintf( __( 'View %s', 'try_wordpress' ), ucwords( $name_plural ) ),

			// translators: %s: Name of the custom post type in singular form
			'search_items'          => sprintf( __( 'Search %s', 'try_wordpress' ), ucwords( $name ) ),

			'not_found'             => __( 'Not found', 'try_wordpress' ),
			'not_found_in_trash'    => __( 'Not found in Trash', 'try_wordpress' ),

			// translators: %s: Name of the custom post type in singular form
			'featured_image'        => sprintf( __( '%s Image', 'try_wordpress' ), ucwords( $name ) ),

			// translators: %s: Name of the custom post type in lowercase
			'set_featured_image'    => sprintf( __( 'Set %s image', 'try_wordpress' ), strtolower( $name ) ),

			// translators: %s: Name of the custom post type in lowercase
			'remove_featured_image' => sprintf( __( 'Remove %s image', 'try_wordpress' ), strtolower( $name ) ),

			// translators: %s: Name of the custom post type in lowercase
			'use_featured_image'    => sprintf( __( 'Use as %s image', 'try_wordpress' ), strtolower( $name ) ),

			// translators: %s: Name of the custom post type in lowercase
			'insert_into_item'      => sprintf( __( 'Insert into %s', 'try_wordpress' ), strtolower( $name ) ),

			// translators: %s: Name of the custom post type in lowercase
			'uploaded_to_this_item' => sprintf( __( 'Uploaded to this %s', 'try_wordpress' ), strtolower( $name ) ),

			// translators: %s: Name of the custom post type in plural form
			'items_list'            => sprintf( __( '%s list', 'try_wordpress' ), ucwords( $name_plural ) ),

			// translators: %s: Name of the custom post type in plural form
			'items_list_navigation' => sprintf( __( '%s list navigation', 'try_wordpress' ), ucwords( $name_plural ) ),

			// translators: %s: Name of the custom post type in lowercase plural form
			'filter_items_list'     => sprintf( __( 'Filter %s list', 'try_wordpress' ), strtolower( $name_plural ) ),
		);
	}
}

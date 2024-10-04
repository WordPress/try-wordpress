<?php

namespace DotOrg\TryWordPress;

class Storage {
	const string POST_TYPE      = 'liberated_data';
	const string POST_TYPE_NAME = 'Liberated Data';

	private array $custom_post_types_supports = array( 'title', 'editor', 'custom-fields' );

	public function __construct() {
		add_action( 'init', array( $this, 'register_post_types' ) );
	}

	private function get_singular_name(): string {
		return self::POST_TYPE_NAME;
	}

	private function get_plural_name(): string {
		return self::POST_TYPE_NAME;
	}

	public function register_post_types(): void {
		$name        = $this->get_singular_name();
		$name_plural = $this->get_plural_name();

		$args = array(
			'public'              => false,
			'exclude_from_search' => true,
			'publicly_queryable'  => false,
			'show_in_rest'        => true,
			'show_ui'             => true,
			'show_in_menu'        => WP_DEBUG,
			'menu_icon'           => 'dashicons-database',
			'supports'            => $this->custom_post_types_supports,
			'labels'              => $this->get_post_type_registration_labels( $name, $name_plural ),
			'rest_base'           => self::POST_TYPE,
		);

		register_post_type( self::POST_TYPE, $args );
	}

	public function get_post_type_registration_labels( $name, $name_plural ): array {
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

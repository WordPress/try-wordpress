<?php

namespace DotOrg\TryWordPress;

use ReflectionClass;

class Post_Type_Manager {
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

	public function __construct() {
		$this->custom_post_types = $this->get_post_type_constants();

		add_action( 'init', array( $this, 'register_post_types' ) );
	}

	private function should_show_ui(): bool {
		return wp_get_environment_type() === 'local';
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

	public function register_post_types(): void {
		$args = array(
			'public'              => false,
			'exclude_from_search' => true,
			'publicly_queryable'  => true,
			'show_in_rest'        => true,
			'show_ui'             => $this->should_show_ui(),
			'show_in_menu'        => $this->should_show_ui(),
			'menu_icon'           => 'dashicons-database',
			'supports'            => $this->custom_post_types_supports,
		);

		foreach ( $this->custom_post_types as $post_type ) {
			$name              = ucwords( str_replace( '_', ' ', $post_type ) );
			$name_plural       = $name . 's';
			$args['labels']    = array(
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
			$args['rest_base'] = $post_type . 's';
			register_post_type( $post_type, $args );
		}
	}

	public function get_custom_post_types(): array {
		return $this->custom_post_types;
	}
}

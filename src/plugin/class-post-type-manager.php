<?php

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
			'show_ui'             => false,
			'show_in_menu'        => false,
			'supports'            => $this->custom_post_types_supports,
		);

		foreach ( $this->custom_post_types as $post_type ) {
			$args['label']     = $post_type;
			$args['rest_base'] = $post_type . 's';
			register_post_type( $post_type, $args );
		}
	}

	public function get_custom_post_types(): array {
		return $this->custom_post_types;
	}
}

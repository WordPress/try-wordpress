<?php

namespace DotOrg\TryWordPress;

use WP_Post;

/**
 * Subject class offers an easy view of liberated data, abstracting away the implementation details
 *
 * WP specific data is private and only exposed via methods to limit leakage of implementation details
 * Raw data is available as public fields
 */
class Subject {

	private int $id;

	public string $source_html;
	public string $type;
	public string $title;
	public string $date;
	public string $content;

	/**
	 * Creates a new Subject instance from a WordPress post.
	 *
	 * @param int $post_id The WordPress post ID to create the subject from.
	 * @return Subject|false The Subject instance or false if the post doesn't exist.
	 */
	public static function from_post( int $post_id ): Subject|false {
		$post = get_post( $post_id );

		if ( ! $post instanceof WP_Post ) {
			return false;
		}

		return new self( $post );
	}

	/**
	 * Private constructor to enforce using the factory method.
	 *
	 * @param WP_Post $post The WordPress post to create the subject from.
	 */
	private function __construct( WP_Post $post ) {
		$this->id          = $post->ID;
		$this->source_html = $post->post_content_filtered;

		$this->type    = get_post_meta( $post->ID, 'subject_type', true );
		$this->title   = get_post_meta( $post->ID, 'raw_title', true );
		$this->date    = get_post_meta( $post->ID, 'raw_date', true );
		$this->content = get_post_meta( $post->ID, 'raw_content', true );
	}

	public function id(): int {
		return $this->id;
	}

	public function get_transformed_post( string $unique_plugin_slug ): WP_Post {
		$meta_key = Transformer::META_KEY_LIBERATED_OUTPUT;
		if ( ! empty( $unique_plugin_slug ) ) {
			$meta_key .= '_' . $unique_plugin_slug;
		}
		$transformed_post_id = absint( get_post_meta( $this->id, $meta_key, true ) );

		return WP_Post::get_instance( $transformed_post_id );
	}

	public function store_reference( int $transformed_post_id, string $unique_plugin_slug ): void {
		// Store a reference to the source
		update_post_meta( $transformed_post_id, Transformer::META_KEY_LIBERATED_SOURCE, $this->id );

		// Store a reference to your transformation in the source
		$meta_key = Transformer::META_KEY_LIBERATED_OUTPUT . '_' . $unique_plugin_slug;
		update_post_meta( $this->id, $meta_key, $transformed_post_id );

		// Control preview
		add_filter(
			'data_liberation_preview_transformed_post_id',
			function () use ( $transformed_post_id ) {
				return $transformed_post_id;
			}
		);
	}
}

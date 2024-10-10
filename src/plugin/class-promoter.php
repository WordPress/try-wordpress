<?php

namespace DotOrg\TryWordPress;

use WP_Post;

class Promoter {
	private string $meta_key_for_promoted_post = '_promoted_post';

	public function __construct( $post_type ) {
		// constantly promote for now
		add_action(
			'save_post_' . $post_type,
			function ( $post_id, $post ) {
				$this->promote( $post );
			},
			10,
			2
		);
	}

	private function get_post_type_for_promoted_post( int|WP_Post $liberated_post ): string {
		if ( is_int( $liberated_post ) ) {
			$liberated_post = get_post( $liberated_post );
		}

		$content_type = get_post_meta( $liberated_post->ID, 'content_type', true );
		switch ( $content_type ) {
			case 'blogpost':
			case 'post':
				$post_type = 'post';
				break;
			case 'product':
				$post_type = 'product';
				break;
			default:
				$post_type = 'post';
		}

		// @TODO: filter name would be changed w.r.t new verb in place of 'promoted' once its decided
		return apply_filters( 'post_type_for_promoted_post', $post_type, $liberated_post );
	}

	public function get_promoted_post_id( $liberated_post_id ): int|null {
		$value = get_post_meta( $liberated_post_id, $this->meta_key_for_promoted_post, true );
		if ( '' === $value ) {
			return null;
		}

		return absint( $value );
	}

	/**
	 * This function copies over the liberated_* custom post types to its destined post type.
	 *
	 * @param int|WP_Post $liberated_post Post id or Post object.
	 * @return bool
	 */
	public function promote( int|WP_Post $liberated_post ): bool {
		// @TODO: filter name would be changed w.r.t new verb in place of 'promoted' once its decided
		if ( apply_filters( 'skip_native_promotion', false ) ) {
			return true;
		}

		if ( is_int( $liberated_post ) ) {
			$liberated_post = get_post( $liberated_post );
		}

		$promoted_post_id = get_post_meta( $liberated_post->ID, $this->meta_key_for_promoted_post, true );

		$args = array(
			'post_author'       => $liberated_post->post_author,
			'post_date'         => $liberated_post->post_date,
			'post_date_gmt'     => $liberated_post->post_date_gmt,
			'post_modified'     => $liberated_post->post_modified,
			'post_modified_gmt' => $liberated_post->post_modified_gmt,
			'post_content'      => $liberated_post->post_content,
			'post_title'        => $liberated_post->post_title,
			'post_excerpt'      => $liberated_post->post_excerpt,
			'post_status'       => 'publish',
			'comment_status'    => $liberated_post->comment_status,
			'ping_status'       => $liberated_post->ping_status,
			'post_password'     => $liberated_post->post_password,
			'post_name'         => $liberated_post->post_name,
			'post_type'         => $this->get_post_type_for_promoted_post( $liberated_post->ID ),
		);
		if ( ! empty( $promoted_post_id ) ) {
			$args['ID'] = $promoted_post_id;
		}

		add_filter( 'wp_insert_post_empty_content', '__return_false' );
		$inserted_post_id = wp_insert_post( $args, true );
		remove_filter( 'wp_insert_post_empty_content', '__return_false' );

		// @TODO: handle attachments, terms etc in future
		// Note: Do not need anything from postmeta.
		// We should potentially use another plugin here for this purpose and call its API to do it for us.

		if ( 0 === $inserted_post_id || is_wp_error( $inserted_post_id ) ) {
			return false;
		}

		add_post_meta( $liberated_post->ID, $this->meta_key_for_promoted_post, $inserted_post_id );
		return true;
	}
}

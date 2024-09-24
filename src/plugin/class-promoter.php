<?php

namespace DotOrg\TryWordPress;

use WP_Post;

class Promoter {
	private string $meta_key_for_promoted_post = '_promoted_post';

	public function __construct() {}

	private function get_post_type_for_promoted_post( string $post_type ): string {
		return str_replace( 'liberated_', '', $post_type );
	}

	public function get_promoted_post( $liberated_post_id ): int {
		return absint( get_post_meta( $liberated_post_id, $this->meta_key_for_promoted_post, true ) );
	}

	/**
	 * This function copies over the liberated_* custom post types to its destined post type.
	 *
	 * @param int|WP_Post $liberated_post Post id or Post object.
	 * @return bool
	 */
	public function promote( int|WP_Post $liberated_post ): bool {
		if ( is_int( $liberated_post ) ) {
			$liberated_post = get_post( $liberated_post );
		}

		$inserted_post_id = wp_insert_post(
			array(
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
				'post_type'         => $this->get_post_type_for_promoted_post( $liberated_post->post_type ),
			)
		);

		// @TODO: handle attachments, terms etc in future
		// Note: Do not need anything from postmeta.
		// We should potentially use another plugin here for this purpose and call its API to do it for us.

		if ( is_wp_error( $inserted_post_id ) ) {
			return false;
		}

		add_post_meta( $liberated_post->ID, $this->meta_key_for_promoted_post, $inserted_post_id );
		return true;
	}
}

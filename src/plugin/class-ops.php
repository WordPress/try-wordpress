<?php

namespace DotOrg\TryWordPress;

use WP_Post;

class Ops {
	private static string $post_type;

	public static function init( string $post_type ): void {
		static::$post_type = $post_type;
	}

	/**
	 * Loops over all liberated_post posts for the specified subject_type
	 *
	 * @param string $subject_type Type of subject.
	 * @return WP_Post[]
	 */
	public static function loop( string $subject_type ): array {
		$args = array(
			'post_type'      => static::$post_type,
			'post_status'    => 'publish',
			'posts_per_page' => -1,
			// @phpcs:ignore
			'meta_query'     => array(
				'key'     => 'subject_type',
				'value'   => $subject_type,
				'compare' => '=',
			),
		);
		return get_posts( $args );
	}

	/**
	 * Takes the transformed post of this liberated_post out of public circulation
	 * Either by switching to "draft" post status or just updating its post_type to something (unknown or known with defined behavior) that does it
	 *
	 * @param WP_Post $liberated_post Post object of liberated post.
	 * @return void
	 */
	public static function suspend( WP_Post $liberated_post ) {
		// @TODO: Do the thing
	}

	/**
	 * Brings back the transformed post of this liberated_post as it was before suspension
	 *
	 * @param WP_Post $liberated_post Post object of liberated post.
	 * @return void
	 */
	public static function resume( WP_Post $liberated_post ) {
		// @TODO: Un-suspend the suspended post
	}

	/**
	 * Saves this new post as the final transformed output
	 *
	 * @param WP_Post $liberated_post Post object of liberated post.
	 * @param int     $post_id Post ID for newly transformed output.
	 * @return void
	 */
	public static function persist( WP_Post $liberated_post, int $post_id ): void {
		// @TODO: Finalise meta keys
		$previously_transformed_post_id = get_post_meta( $liberated_post->ID, '_dl_transformed', true );

		$old           = get_post_meta( $liberated_post->ID, '_old_dl_transformed', true );
		$old[ time() ] = $previously_transformed_post_id;
		update_post_meta( $post_id, '_old_dl_transformed', $old );
	}

	/**
	 * Returns true if we are running under a staging environment via WP Playground
	 *
	 * @return bool
	 */
	public static function is_preview(): bool {
		return defined( 'WP_PG_STAGING' ) && constant( 'WP_PG_STAGING' ) === true;
	}
}

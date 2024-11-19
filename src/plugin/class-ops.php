<?php

namespace DotOrg\TryWordPress;

use WP_Post;

class Ops {
	private static string $post_type;
	private static HandlerRegistry $handler_registry;

	public static function init( string $post_type ): void {
		static::$post_type        = $post_type;
		static::$handler_registry = new HandlerRegistry();
	}

	/**
	 * Register your handler for the specified subject type, disabling the native handler
	 *
	 * @param SubjectType $subject_type Type of subject.
	 * @param callable    $handler Function that would handle the transformation of subject for the specific subject type.
	 * @return void
	 */
	public static function handle( SubjectType $subject_type, callable $handler ): void {
		static::$handler_registry::add( $subject_type->value, $handler );
	}

	/**
	 * Loops over all liberated_post posts for the specified subject_type
	 *
	 * @param SubjectType $subject_type Type of subject.
	 * @return WP_Post[]
	 */
	public static function loop( SubjectType $subject_type ): array {
		// @TODO: Ensure query args are correct
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
	 * @param Subject $subject Subject object of liberated post.
	 * @return void
	 */
	public static function suspend( Subject $subject ) {
		// @TODO: Do the thing
	}

	/**
	 * Brings back the transformed post of this liberated_post as it was before suspension
	 *
	 * @param Subject $subject Subject object of liberated post.
	 * @return void
	 */
	public static function resume( Subject $subject ) {
		// @TODO: Un-suspend the suspended post
	}

	/**
	 * Saves this new post as the final transformed output
	 *
	 * @param Subject $subject Subject object of liberated post.
	 * @param int     $new_post_id Post ID for newly transformed output.
	 * @return void
	 */
	public static function persist( Subject $subject, int $new_post_id ): void {
		// @TODO: Finalise meta keys
		$previously_transformed_post_id = get_post_meta( $subject->id(), '_dl_transformed', true );

		$old           = get_post_meta( $subject->id(), '_old_dl_transformed', true );
		$old[ time() ] = $previously_transformed_post_id;
		update_post_meta( $new_post_id, '_old_dl_transformed', $old );

		update_post_meta( $subject->id(), '_dl_transformed', $new_post_id );
	}

	/**
	 * Returns true if we are running under a staging environment via WP Playground
	 * This requires using this constant if spinning up a staging for the website in WP Playground for it to work
	 *
	 * @return bool
	 */
	public static function is_preview(): bool {
		return defined( 'WP_PG_DL_STAGING' ) && constant( 'WP_PG_DL_STAGING' ) === true;
	}
}

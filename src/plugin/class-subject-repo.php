<?php

namespace DotOrg\TryWordPress;

class Subject_Repo {
	private static string $post_type;

	public static function init( string $post_type ): void {
		static::$post_type = $post_type;
	}

	/**
	 * Loops over all liberated_post posts for the specified subject_type
	 *
	 * @TODO: pagination support for large sites
	 *
	 * @param string $subject_type Type of subject.
	 * @return Subject[]
	 */
	public static function loop( string $subject_type ): array {
		$args = array(
			'post_type'      => static::$post_type,
			'post_status'    => 'draft',
			'posts_per_page' => -1,
		);

		if ( ! empty( $subject_type ) ) {
			// @phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
			$args['meta_query'] = array(
				'key'     => 'subject_type',
				'value'   => $subject_type,
				'compare' => '=',
			);
		}

		return array_map(
			function ( $post ) {
				return Subject::from_post( $post->ID );
			},
			get_posts( $args )
		);
	}
}

<?php

namespace DotOrg\TryWordPress;

use WP_Post;

class Transformer {
	public const string META_KEY_LIBERATED_SOURCE = '_data_liberation_source';
	public const string META_KEY_LIBERATED_OUTPUT = '_data_liberation_output';

	public function __construct() {
		foreach ( SubjectType::cases() as $case ) {
			add_action(
				'data_liberated_' . $case->value,
				function ( $subject ) {
					$this->transform( $subject->id() );
				}
			);
		}
	}

	private function get_post_type_for_transformed_post( int $liberated_post_id ): string {
		$subject_type = SubjectType::tryFrom(
			get_post_meta( $liberated_post_id, 'subject_type', true )
		);

		$post_type = match ( $subject_type ) {
			SubjectType::PAGE     => 'page',
			SubjectType::PRODUCT  => 'product',
			default               => 'post',
		};

		return $post_type;
	}

	public function get_transformed_post_id( $liberated_post_id ): int|null {
		$value = get_post_meta( $liberated_post_id, self::META_KEY_LIBERATED_OUTPUT, true );
		if ( '' === $value ) {
			return null;
		}

		return absint( $value );
	}

	public function transform( int|WP_Post $liberated_post ): bool {
		if ( is_int( $liberated_post ) ) {
			$liberated_post = get_post( $liberated_post );
		}

		$transformed_post_id = get_post_meta( $liberated_post->ID, self::META_KEY_LIBERATED_OUTPUT, true );

		$title = $liberated_post->post_title;
		if ( empty( $title ) ) {
			$title = '[Title]';
		}
		$body = $liberated_post->post_content;
		if ( empty( $body ) ) {
			$body = '[Body]';
		}

		$args = array(
			'post_author'       => $liberated_post->post_author,
			'post_date'         => $liberated_post->post_date,
			'post_date_gmt'     => $liberated_post->post_date_gmt,
			'post_modified'     => $liberated_post->post_modified,
			'post_modified_gmt' => $liberated_post->post_modified_gmt,
			'post_content'      => $body,
			'post_title'        => $title,
			'post_excerpt'      => $liberated_post->post_excerpt,
			'post_status'       => 'publish',
			'comment_status'    => $liberated_post->comment_status,
			'ping_status'       => $liberated_post->ping_status,
			'post_password'     => $liberated_post->post_password,
			'post_name'         => $liberated_post->post_name,
			'post_type'         => $this->get_post_type_for_transformed_post( $liberated_post->ID ),
		);
		if ( ! empty( $transformed_post_id ) ) {
			$args['ID'] = $transformed_post_id;
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

		update_post_meta( $inserted_post_id, self::META_KEY_LIBERATED_SOURCE, $liberated_post->ID );
		update_post_meta( $liberated_post->ID, self::META_KEY_LIBERATED_OUTPUT, $inserted_post_id );

		return true;
	}
}

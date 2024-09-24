<?php

namespace DotOrg\TryWordPress;

class Post_Type_UI {
	private array $post_types;

	public function __construct( $post_types ) {
		$this->post_types = $post_types;

		// Strip editor to be barebones.
		add_filter(
			'wp_editor_settings',
			function ( $settings, $editor_id ) {
				if ( 'content' === $editor_id && in_array( get_current_screen()->post_type, $this->post_types, true ) ) {
					$settings['tinymce']       = false;
					$settings['quicktags']     = false;
					$settings['media_buttons'] = false;
				}

				return $settings;
			},
			10,
			2
		);

		// CPT screen-specific filters
		add_action(
			'admin_head',
			function () {
				global $pagenow;

				$cpt_screen = false;
				if ( 'post-new.php' === $pagenow ) { // New post screen
					// @phpcs:ignore WordPress.Security.NonceVerification.Recommended
					if ( isset( $_GET['post_type'] ) && in_array( $_GET['post_type'], $this->post_types, true ) ) {
						$cpt_screen = true;
					}
				}

				if ( 'post.php' === $pagenow ) { // Edit post screen
					// @phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.InputNotValidated
					$post_type = get_post_type( absint( $_GET['post'] ) );
					if ( in_array( $post_type, $this->post_types, true ) ) {
						$cpt_screen = true;
					}
				}

				// phpcs:ignore Generic.CodeAnalysis.EmptyStatement.DetectedIf
				if ( $cpt_screen ) {
					// CPT screen-specific filters go here.
				}
			}
		);

		// Disable Block editor.
		add_filter(
			'use_block_editor_for_post_type',
			function ( $use_block_editor, $post_type ) {
				if ( in_array( $post_type, $this->post_types, true ) ) {
					return false;
				}

				return $use_block_editor;
			},
			10,
			2
		);

		// Remove meta boxes.
		add_action(
			'add_meta_boxes',
			function () {
				foreach ( $this->post_types as $post_type ) {
					// Remove default meta boxes
					remove_meta_box( 'submitdiv', $post_type, 'side' );
					remove_meta_box( 'slugdiv', $post_type, 'normal' );
					/**
					 * We would need to remove more metaboxes as their support is added to CPTs.
					 * Leaving code here for reference.
					 */
					// phpcs:ignore Squiz.PHP.CommentedOutCode.Found
					// remove_meta_box( 'postexcerpt', $post_type, 'normal' );
					// remove_meta_box( 'authordiv', $post_type, 'normal' );
					// remove_meta_box( 'categorydiv', $post_type, 'side' );
					// remove_meta_box( 'tagsdiv-post_tag', $post_type, 'side' );
					// remove_meta_box( 'postimagediv', $post_type, 'side' );
					// remove_meta_box( 'revisionsdiv', $post_type, 'normal' );
					// remove_meta_box( 'commentstatusdiv', $post_type, 'normal' );
					// remove_meta_box( 'commentsdiv', $post_type, 'normal' );
					// remove_meta_box( 'trackbacksdiv', $post_type, 'normal' );

					add_meta_box(
						'promotedpost',
						'Promoted To',
						function () {
							global $post;

							$post_id          = $post->ID;
							$promoted_post_id = get_post_meta( $post_id, '_promoted_post', true );

							if ( $promoted_post_id ) {
								echo '<pre>PostID: ' . esc_html( $promoted_post_id ) . '</pre>';
								$preview_link = get_permalink( $promoted_post_id );
								$edit_link    = get_edit_post_link( $promoted_post_id );
								?>
								<p>
									<a href="<?php echo esc_url( $preview_link ); ?>" target="_blank">Preview Post</a> |
									<a href="<?php echo esc_url( $edit_link ); ?>">Edit Post</a>
								</p>
								<?php
							} else {
								echo "<p>This post hasn't been promoted yet.</p>";
							}
						},
						$post_type,
						'side',
						'default'
					);
				}
			},
			999
		);
	}
}

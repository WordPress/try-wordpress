<?php

namespace DotOrg\TryWordPress;

class Post_Type_UI {
	private string $post_type;
	private Promoter $promoter;

	public function __construct( $custom_post_type, Promoter $promoter ) {
		$this->post_type = $custom_post_type;
		$this->promoter  = $promoter;

		$this->remove_add_new_option( $this->post_type );

		// Strip editor to be barebones.
		add_filter(
			'wp_editor_settings',
			function ( $settings, $editor_id ) {
				if ( 'content' === $editor_id && get_current_screen()->post_type === $this->post_type ) {
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
					if ( isset( $_GET['post_type'] ) && $_GET['post_type'] === $this->post_type ) {
						$cpt_screen = true;
					}
				}

				if ( 'post.php' === $pagenow ) { // Edit post screen
					// @phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.InputNotValidated
					$post_type = get_post_type( absint( $_GET['post'] ) );
					if ( $post_type === $this->post_type ) {
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
				if ( $post_type === $this->post_type ) {
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
				// Remove default meta boxes
				remove_meta_box( 'submitdiv', $this->post_type, 'side' );
				remove_meta_box( 'slugdiv', $this->post_type, 'normal' );
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
						$promoted_post_id = $this->promoter->get_promoted_post_id( $post_id );

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
					$this->post_type,
					'side',
					'default'
				);
			},
			999
		);
	}

	public function remove_add_new_option( $post_type ): void {
		// Remove "Add New" from sidebar menu.
		add_action(
			'admin_menu',
			function () use ( $post_type ) {
				$menu_slug    = 'edit.php?post_type=' . $post_type;
				$submenu_slug = 'post-new.php?post_type=' . $post_type;
				remove_submenu_page( $menu_slug, $submenu_slug );
			}
		);

		// Remove "Add New" from admin bar menu.
		add_action(
			'admin_bar_menu',
			function ( $wp_admin_bar ) use ( $post_type ) {
				$wp_admin_bar->remove_node( 'new-' . $post_type );
			},
			999
		);

		// Redirect if you go to "Add New" page directly.
		add_action(
			'admin_init',
			function () use ( $post_type ) {
				global $pagenow;
				// @phpcs:ignore WordPress.Security.NonceVerification.Recommended
				if ( 'post-new.php' === $pagenow && isset( $_GET['post_type'] ) && $_GET['post_type'] === $post_type ) {
					wp_safe_redirect( admin_url( 'edit.php?post_type=' . $post_type ) );
					exit;
				}
			}
		);

		// Hide "Add New" button next to title on the listing page.
		add_action(
			'admin_head',
			function () use ( $post_type ) {
				$post_type_key = $post_type;
				global $pagenow, $post_type;

				if ( 'edit.php' === $pagenow && $post_type === $post_type_key ) {
					echo '<style>.page-title-action { display: none !important; }</style>';
				}
			}
		);
	}
}

<?php

namespace DotOrg\TryWordPress;

class Subject {

	private int $id;

	public string $source_html;
	public string $type;
	public string $title;
	public string $date;
	public string $content;

	public function __construct( int $post_id ) {
		$post = get_post( $post_id );

		$this->id          = $post_id;
		$this->source_html = $post->post_content_filtered;

		$this->type    = get_post_meta( $post_id, 'subject_type', true );
		$this->title   = get_post_meta( $post_id, 'raw_title', true );
		$this->date    = get_post_meta( $post_id, 'raw_date', true );
		$this->content = get_post_meta( $post_id, 'raw_content', true );
	}

	public function is_valid(): bool {
		return 0 !== $this->id;
	}
}

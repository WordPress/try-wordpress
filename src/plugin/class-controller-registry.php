<?php

namespace DotOrg\TryWordPress;

class Controller_Registry {

	public function __construct( string $liberated_data_post_type, string $crawler_queue_post_type ) {
		new Blogpost_Controller( $liberated_data_post_type );
		new Page_Controller( $liberated_data_post_type );

		$domain = $this->infer_domain( $liberated_data_post_type );

		new Crawler_Controller( $domain, $crawler_queue_post_type );
	}

	private function infer_domain( $liberated_data_post_type ): string {
		$liberated_posts = get_posts(
			array(
				'post_type'      => $liberated_data_post_type,
				'posts_per_page' => 1,
				'post_status'    => 'draft',
			)
		);

		if ( ! empty( $liberated_posts ) ) {
			$domain = wp_parse_url( $liberated_posts[0]->guid, -1 );
			return $domain['scheme'] . '://' . $domain['host'];
		}

		return '';
	}
}

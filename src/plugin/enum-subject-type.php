<?php

namespace DotOrg\TryWordPress;

enum SubjectType: string {
	case BLOGPOST = 'blog-post';
	case PAGE     = 'page';
	case PRODUCT  = 'product';

	public function get_display_name(): string {
		return ucfirst( $this->value );
	}
}

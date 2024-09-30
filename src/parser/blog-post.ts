import { pasteHandler, serialize } from '@wordpress/blocks';
import { findDeepestChild } from '@/parser/util';
import {
	BlogPostContent,
	BlogPostDate,
	BlogPostTitle,
} from '@/model/content/BlogPost';

export function parsePostDate( html: string ): BlogPostDate {
	const container = document.createElement( 'div' );
	container.innerHTML = html.trim();
	const element = container.querySelector( 'time' );
	return new BlogPostDate( html, element ? element.dateTime : '' );
}

export function parsePostTitle( html: string ): BlogPostTitle {
	const deepestChild = findDeepestChild( html );
	return new BlogPostTitle( html, deepestChild?.innerHTML ?? '' );
}

export function parsePostContent( html: string ): BlogPostContent {
	return new BlogPostContent( html, serializeBlocks( html ) );
}

function serializeBlocks( html: string ): string {
	const blocks = pasteHandler( {
		mode: 'BLOCKS',
		HTML: html,
	} );
	return serialize( blocks );
}

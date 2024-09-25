import { pasteHandler, serialize } from '@wordpress/blocks';
import { findDeepestChild } from '@/parser/util';
import { PostContent, PostDate, PostTitle } from '@/model/Post';

export function parsePostDate( html: string ): PostDate {
	const container = document.createElement( 'div' );
	container.innerHTML = html.trim();
	const element = container.querySelector( 'time' );
	return new PostDate( html, element ? element.dateTime : '' );
}

export function parsePostTitle( html: string ): PostTitle {
	const deepestChild = findDeepestChild( html );
	return new PostTitle( html, deepestChild?.innerHTML ?? '' );
}

export function parsePostContent( html: string ): PostContent {
	return new PostContent( html, serializeBlocks( html ) );
}

function serializeBlocks( html: string ): string {
	const blocks = pasteHandler( {
		mode: 'BLOCKS',
		HTML: html,
	} );
	return serialize( blocks );
}

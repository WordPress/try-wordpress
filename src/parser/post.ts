import { pasteHandler, serialize } from '@wordpress/blocks';
import { findDeepestChild } from '@/parser/util';

export interface PostDate {
	original: string;
	parsed: string;
}

export interface PostTitle {
	original: string;
	parsed: string;
}

export interface PostContent {
	original: string;
	parsed: string;
}

export function parsePostDate( html: string ): PostDate {
	const container = document.createElement( 'div' );
	container.innerHTML = html.trim();
	const element = container.querySelector( 'time' );

	return {
		original: html,
		parsed: element ? element.dateTime : '',
	};
}

export function parsePostTitle( html: string ): PostTitle {
	const deepestChild = findDeepestChild( html );
	return {
		original: html,
		parsed: deepestChild?.innerHTML ?? '',
	};
}

export function parsePostContent( html: string ): PostContent {
	return {
		original: html,
		parsed: serializeBlocks( html ),
	};
}

function serializeBlocks( html: string ): string {
	const blocks = pasteHandler( {
		mode: 'BLOCKS',
		HTML: html,
	} );
	return serialize( blocks );
}
import { pasteHandler, serialize } from '@wordpress/blocks';

export interface PostDate {
	original: string;
	blocks: string;
}

export interface PostTitle {
	original: string;
	blocks: string;
}

export interface PostContent {
	original: string;
	blocks: string;
}

export function parsePostDate( html: string ): PostDate {
	return {
		original: html,
		blocks: serializeBlocks( html ),
	};
}

export function parsePostTitle( html: string ): PostTitle {
	return {
		original: html,
		blocks: serializeBlocks( html ),
	};
}

export function parsePostContent( html: string ): PostContent {
	return {
		original: html,
		blocks: serializeBlocks( html ),
	};
}

function serializeBlocks( html: string ): string {
	const blocks = pasteHandler( {
		mode: 'BLOCKS',
		HTML: html,
	} );
	return serialize( blocks );
}

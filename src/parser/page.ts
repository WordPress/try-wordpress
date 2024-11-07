import { pasteHandler, serialize } from '@wordpress/blocks';
import { findDeepestChild } from '@/parser/util';
import { newTextField, TextField } from '@/model/field/TextField';
import { HtmlField, newHtmlField } from '@/model/field/HtmlField';
import { Field } from '@/model/field/Field';

export function parsePageField( name: string, field: Field ): Field {
	switch ( name ) {
		case 'title':
			return parsePageTitle( field.original );
		case 'content':
			return parsePageContent( field.original );
		default:
			throw Error( `unknown field type ${ field.type }` );
	}
}

export function parsePageTitle( html: string ): TextField {
	const deepestChild = findDeepestChild( html );
	return newTextField( html, deepestChild?.innerHTML ?? '' );
}

export function parsePageContent( html: string ): HtmlField {
	return newHtmlField( html, serializeBlocks( html ) );
}

function serializeBlocks( html: string ): string {
	const blocks = pasteHandler( {
		mode: 'BLOCKS',
		HTML: html,
	} );
	return serialize( blocks );
}

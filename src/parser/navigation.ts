import { pasteHandler, serialize } from '@wordpress/blocks';
import { findDeepestChild } from '@/parser/util';
import { HtmlField, newHtmlField } from '@/model/field/HtmlField';
import { Field } from '@/model/field/Field';

export function parseNavigationField( name: string, field: Field ): Field {
	switch ( name ) {
		case 'navigation':
			return parseNavigation( field.original );
		default:
			throw Error( `unknown field type ${ field.type }` );
	}
}

export function parseNavigation( html: string ): HtmlField {
	return newHtmlField( html, serializeBlocks( html ) );
}

function serializeBlocks( html: string ): string {
	const blocks = pasteHandler( {
		mode: 'BLOCKS',
		HTML: html,
	} );
	return serialize( blocks );
}

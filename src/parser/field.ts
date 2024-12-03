import { Field, FieldType } from '@/model/field/Field';
import { DateField, newDateField } from '@/model/field/DateField';
import { newTextField, TextField } from '@/model/field/TextField';
import { findDeepestChild, htmlToBlocks } from '@/parser/util';
import { HtmlField, newHtmlField } from '@/model/field/HtmlField';

export function parseField( field: Field ): Field {
	switch ( field.type ) {
		case FieldType.Date:
			return parseDate( field.rawValue );
		case FieldType.Text:
			return parseText( field.rawValue );
		case FieldType.Html:
			return parseHtml( field.rawValue );
		default:
			throw Error( `unknown field type ${ field.type }` );
	}
}

function parseDate( html: string ): DateField {
	const container = document.createElement( 'div' );
	container.innerHTML = html.trim();
	const element = container.querySelector( 'time' );
	return newDateField( html, element ? element.dateTime : '' );
}

function parseText( html: string ): TextField {
	const deepestChild = findDeepestChild( html );
	return newTextField( html, deepestChild?.innerHTML ?? '' );
}

function parseHtml( html: string ): HtmlField {
	return newHtmlField( html, htmlToBlocks( html ) );
}

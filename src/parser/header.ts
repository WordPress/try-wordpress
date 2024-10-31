import { Field } from '@/model/field/Field';
import { serializeBlocks } from '@/parser/util';
import {
	NavigationField,
	newNavigationField,
} from '@/model/field/NavigationField';

export function parseHeaderField( name: string, field: Field ): Field {
	switch ( name ) {
		case 'navigation':
			return parseNavigation( field.original );
		default:
			throw Error( `unknown field type ${ field.type }` );
	}
}

function parseNavigation( html: string ): NavigationField {
	return newNavigationField( html, serializeBlocks( html ) );
}

import { Subject, SubjectType } from '@/model/subject/Subject';
import {
	NavigationField,
	newNavigationField,
} from '@/model/field/NavigationField';

export interface Header extends Subject {
	type: SubjectType.Header;
	navigation: NavigationField;
}

export function newHeader( sourceUrl: string ): Header {
	return {
		id: 0,
		transformedId: 0,
		type: SubjectType.Header,
		sourceUrl,
		navigation: newNavigationField(),
	};
}

export function validateHeader( header: Header ): boolean {
	const fields = [ header.navigation ];
	let isValid = true;
	for ( const f of fields ) {
		if ( f.original === '' || f.parsed === '' ) {
			isValid = false;
			break;
		}
	}
	return isValid;
}

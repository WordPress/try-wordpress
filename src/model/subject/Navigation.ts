import { Subject, SubjectType } from '@/model/subject/Subject';
import { HtmlField, newHtmlField } from '@/model/field/HtmlField';

export interface Navigation extends Subject {
	type: SubjectType.Navigation;
	content: HtmlField;
}

export function newNavigation( sourceUrl: string ): Navigation {
	return {
		id: 0,
		transformedId: 0,
		type: SubjectType.Navigation,
		sourceUrl,
		content: newHtmlField(),
	};
}

export function validateNavigation( navigation: Navigation ): boolean {
	const fields = [ navigation.content ];
	let isValid = true;
	for ( const f of fields ) {
		if ( f.original === '' || f.parsed === '' ) {
			isValid = false;
			break;
		}
	}
	return isValid;
}

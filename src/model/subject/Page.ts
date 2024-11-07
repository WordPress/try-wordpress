import { Subject, SubjectType } from '@/model/subject/Subject';
import { newTextField, TextField } from '@/model/field/TextField';
import { HtmlField, newHtmlField } from '@/model/field/HtmlField';

export interface Page extends Subject {
	type: SubjectType.Page;
	title: TextField;
	content: HtmlField;
}

export function newPage( sourceUrl: string ): Page {
	return {
		id: 0,
		transformedId: 0,
		type: SubjectType.Page,
		sourceUrl,
		title: newTextField(),
		content: newHtmlField(),
	};
}

export function validatePage( page: Page ): boolean {
	const fields = [ page.title, page.content ];
	let isValid = true;
	for ( const f of fields ) {
		if ( f.original === '' || f.parsed === '' ) {
			isValid = false;
			break;
		}
	}
	return isValid;
}

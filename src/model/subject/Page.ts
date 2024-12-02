import { Subject, SubjectType } from '@/model/subject/Subject';
import { newTextField } from '@/model/field/TextField';
import { newHtmlField } from '@/model/field/HtmlField';
import { newDateField } from '@/model/field/DateField';

export interface Page extends Subject {
	type: SubjectType.Page;
}

export function newPage( sourceUrl: string ): Page {
	return {
		id: 0,
		transformedId: 0,
		previewUrl: '',
		type: SubjectType.Page,
		sourceUrl,
		fields: {
			date: newDateField(),
			title: newTextField(),
			content: newHtmlField(),
		},
	};
}

export function validatePage( page: Page ): boolean {
	const fields = [ page.fields.title, page.fields.date, page.fields.content ];
	let isValid = true;
	for ( const f of fields ) {
		if ( f.rawValue === '' || f.parsedValue === '' ) {
			isValid = false;
			break;
		}
	}
	return isValid;
}

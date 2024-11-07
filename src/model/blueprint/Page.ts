import { SubjectType } from '@/model/subject/Subject';
import { FieldType } from '@/model/field/Field';
import { Blueprint } from '@/model/blueprint/Blueprint';

export interface PageBlueprint extends Blueprint {
	type: SubjectType.Page;
	fields: {
		title: { type: FieldType.Text; selector?: string };
		content: { type: FieldType.Html; selector?: string };
	};
}

export function newPageBlueprint( sourceUrl: string ): PageBlueprint {
	return {
		id: '',
		type: SubjectType.Page,
		sourceUrl,
		valid: false,
		fields: {
			title: {
				type: FieldType.Text,
				selector: '',
			},
			content: {
				type: FieldType.Html,
				selector: '',
			},
		},
	};
}

export function validatePageBlueprint(
	blueprint: PageBlueprint
): boolean {
	let isValid = true;
	for ( const f of Object.values( blueprint.fields ) ) {
		if ( f.selector === '' ) {
			isValid = false;
			break;
		}
	}
	return isValid;
}

import { SubjectType } from '@/model/subject/Subject';
import { FieldType } from '@/model/field/Field';
import { Blueprint } from '@/model/blueprint/Blueprint';

export interface NavigationBlueprint extends Blueprint {
	type: SubjectType.Navigation;
	fields: {
		content: { type: FieldType.Html; selector?: string };
	};
}

export function newNavigationBlueprint( sourceUrl: string ): NavigationBlueprint {
	return {
		id: '',
		type: SubjectType.Navigation,
		sourceUrl,
		valid: false,
		fields: {
			content: {
				type: FieldType.Html,
				selector: '',
			},
		},
	};
}

export function validateNavigationBlueprint(
	blueprint: NavigationBlueprint
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

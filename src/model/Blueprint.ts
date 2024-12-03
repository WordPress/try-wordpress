import { SubjectType } from '@/model/subject/Subject';

export interface Blueprint {
	type: SubjectType;
	id: string; // TODO: Probably need to make this a number when we start storing Blueprints on the backend.
	sourceUrl: string;
	valid: boolean;
	selectors: Record< string, string >;
}

export function newBlueprint(
	type: SubjectType,
	sourceUrl: string
): Blueprint {
	return {
		id: '',
		type,
		sourceUrl,
		valid: false,
		selectors: {},
	};
}

export function validateBlueprint( blueprint: Blueprint ): boolean {
	let isValid = true;
	for ( const selector of Object.values( blueprint.selectors ) ) {
		if ( selector === '' ) {
			isValid = false;
			break;
		}
	}
	return isValid;
}

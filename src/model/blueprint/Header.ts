import { SubjectType } from '@/model/subject/Subject';
import { Blueprint } from '@/model/blueprint/Blueprint';

export interface HeaderBlueprint extends Blueprint {
	type: SubjectType.Header;
	fields: {
		// TODO.
	};
}

export function newHeaderBlueprint( sourceUrl: string ): HeaderBlueprint {
	return {
		id: '',
		type: SubjectType.Header,
		sourceUrl,
		valid: false,
		fields: {
			// TODO.
		},
	};
}

export function validateHeaderBlueprint( blueprint: HeaderBlueprint ): boolean {
	// TODO: just returns false for now.
	return blueprint.type !== SubjectType.Header;
}

import { SubjectType } from '@/model/subject/Subject';
import { Blueprint } from '@/model/blueprint/Blueprint';

export interface NavigationBlueprint extends Blueprint {
	type: SubjectType.Navigation;
	fields: {
		// TODO.
	};
}

export function newNavigationBlueprint(
	sourceUrl: string
): NavigationBlueprint {
	return {
		id: '',
		type: SubjectType.Navigation,
		sourceUrl,
		valid: false,
		fields: {
			// TODO.
		},
	};
}

export function validateNavigationBlueprint(
	blueprint: NavigationBlueprint
): boolean {
	// TODO: just returns false for now.
	return blueprint.type !== SubjectType.Navigation;
}

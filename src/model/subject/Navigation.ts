import { Subject, SubjectType } from '@/model/subject/Subject';

export interface Navigation extends Omit< Subject, 'id' > {
	type: SubjectType.Navigation;
	id: string;
}

export function validateNavigation( navigation: Navigation ): boolean {
	// TODO: just returns false for now.
	return navigation.type !== SubjectType.Navigation;
}

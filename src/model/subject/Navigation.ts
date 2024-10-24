import { Subject, SubjectType } from '@/model/subject/Subject';

export interface Navigation extends Subject {
	type: SubjectType.Navigation;
}

export function validateNavigation( navigation: Navigation ): boolean {
	// TODO: just returns false for now.
	return navigation.type !== SubjectType.Navigation;
}

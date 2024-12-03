import { SubjectType } from '@/model/subject/Subject';
import { Blueprint } from '@/model/blueprint/Blueprint';

export interface PageBlueprint extends Blueprint {
	type: SubjectType.Page;
}

export function newPageBlueprint( sourceUrl: string ): PageBlueprint {
	return {
		id: '',
		type: SubjectType.Page,
		sourceUrl,
		valid: false,
		selectors: {},
	};
}

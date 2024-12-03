import { SubjectType } from '@/model/subject/Subject';
import { Blueprint } from '@/model/blueprint/Blueprint';

export interface BlogPostBlueprint extends Blueprint {
	type: SubjectType.BlogPost;
}

export function newBlogPostBlueprint( sourceUrl: string ): BlogPostBlueprint {
	return {
		id: '',
		type: SubjectType.BlogPost,
		sourceUrl,
		valid: false,
		selectors: {},
	};
}

import { SubjectType } from '@/model/subject/Subject';
import { FieldType } from '@/model/field/Field';
import { Blueprint } from '@/model/blueprint/Blueprint';

export interface BlogPostBlueprint extends Blueprint {
	type: SubjectType.BlogPost;
	fields: {
		title: { type: FieldType.Text; selector?: string };
		date: { type: FieldType.Date; selector?: string };
		content: { type: FieldType.Html; selector?: string };
	};
}

export function newBlogPostBlueprint( sourceUrl: string ): BlogPostBlueprint {
	return {
		id: '',
		type: SubjectType.BlogPost,
		sourceUrl,
		valid: false,
		fields: {
			date: {
				type: FieldType.Date,
				selector: '',
			},
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

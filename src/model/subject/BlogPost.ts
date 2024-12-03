import { Subject, SubjectType } from '@/model/subject/Subject';
import { newTextField } from '@/model/field/TextField';
import { newHtmlField } from '@/model/field/HtmlField';
import { newDateField } from '@/model/field/DateField';

export interface BlogPost extends Subject {
	type: SubjectType.BlogPost;
}

export function newBlogPost( sourceUrl: string ): BlogPost {
	return {
		id: 0,
		type: SubjectType.BlogPost,
		transformedId: 0,
		previewUrl: '',
		sourceUrl,
		fields: {
			date: newDateField(),
			title: newTextField(),
			content: newHtmlField(),
		},
	};
}

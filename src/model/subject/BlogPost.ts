import { Subject, SubjectType } from '@/model/subject/Subject';
import { DateField, newDateField } from '@/model/field/DateField';
import { newTextField, TextField } from '@/model/field/TextField';
import { HtmlField, newHtmlField } from '@/model/field/HtmlField';

export interface BlogPost extends Subject {
	type: SubjectType.BlogPost;
	date: DateField;
	title: TextField;
	content: HtmlField;
}

export function newBlogPost( sourceUrl: string ): BlogPost {
	return {
		id: 0,
		transformedId: 0,
		type: SubjectType.BlogPost,
		guid: sourceUrl,
		date: newDateField(),
		title: newTextField(),
		content: newHtmlField(),
	};
}

export function validateBlogPost( blogPost: BlogPost ): boolean {
	const fields = [ blogPost.title, blogPost.date, blogPost.content ];
	let isValid = true;
	for ( const f of fields ) {
		if ( f.original === '' || f.parsed === '' ) {
			isValid = false;
			break;
		}
	}
	return isValid;
}

import { Subject, SubjectType } from '@/model/subject/Subject';
import { DateField } from '@/model/field/DateField';
import { TextField } from '@/model/field/TextField';
import { HtmlField } from '@/model/field/HtmlField';

export interface BlogPost extends Subject {
	type: SubjectType.BlogPost;
	date: DateField;
	title: TextField;
	content: HtmlField;
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

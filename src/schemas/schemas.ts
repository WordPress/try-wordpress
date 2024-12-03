import BlogPostSchema from './blog-post.json';
import PageSchema from './page.json';
import { SubjectType } from '@/model/subject/Subject';

export function getSchema( subjectType: SubjectType ) {
	switch ( subjectType ) {
		case SubjectType.BlogPost:
			return BlogPostSchema;
		case SubjectType.Page:
			return PageSchema;
		default:
			throw new Error( `Unknown subjectType ${ subjectType }` );
	}
}

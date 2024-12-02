import BlogPostSchema from './blog-post.json';
import { SubjectType } from '@/model/subject/Subject';

export function getSchema( subjectType: SubjectType ) {
	switch ( subjectType ) {
		case SubjectType.BlogPost:
			return BlogPostSchema;
		default:
			throw new Error( `Unknown subjectType ${ subjectType }` );
	}
}

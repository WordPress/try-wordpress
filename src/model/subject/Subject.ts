import { Field } from '@/model/field/Field';

export enum SubjectType {
	BlogPost = 'blog-post',
	Page = 'page',
}

export const humanReadableSubjectType: Map< SubjectType, string > = new Map( [
	[ SubjectType.BlogPost, 'Blog Post' ],
	[ SubjectType.Page, 'Page' ],
] );

export interface Subject {
	type: SubjectType;
	id: number;
	transformedId: number;
	sourceUrl: string;
	previewUrl: string;
	fields: Record< string, Field >;
}

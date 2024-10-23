export enum SubjectType {
	BlogPost = 'blog-post',
}

export const humanReadableSubjectType: Map< SubjectType, string > = new Map( [
	[ SubjectType.BlogPost, 'Blog Post' ],
] );

export type Subject = GenericSubject< SubjectType >;

export interface GenericSubject< Type extends SubjectType > {
	type: Type;
	id: number;
	transformedId: number;
	guid: string;
}

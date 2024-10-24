export enum SubjectType {
	BlogPost = 'blog-post',
}

export const humanReadableSubjectType: Map< SubjectType, string > = new Map( [
	[ SubjectType.BlogPost, 'Blog Post' ],
] );

export interface Subject {
	type: SubjectType;
	id: number;
	transformedId: number;
	guid: string;
}

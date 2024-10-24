export enum SubjectType {
	Navigation = 'navigation',
	BlogPost = 'blog-post',
}

export const humanReadableSubjectType: Map< SubjectType, string > = new Map( [
	[ SubjectType.Navigation, 'Navigation' ],
	[ SubjectType.BlogPost, 'Blog Post' ],
] );

export interface Subject {
	type: SubjectType;
	id: number;
	transformedId: number;
	sourceUrl: string;
}

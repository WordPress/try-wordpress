export enum SubjectType {
	Header = 'header',
	BlogPost = 'blog-post',
}

export const humanReadableSubjectType: Map< SubjectType, string > = new Map( [
	[ SubjectType.Header, 'Header' ],
	[ SubjectType.BlogPost, 'Blog Post' ],
] );

export interface Subject {
	type: SubjectType;
	id: number;
	transformedId: number;
	sourceUrl: string;
}

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

export function newSubject( type: SubjectType, sourceUrl: string ): Subject {
	return {
		id: 0,
		type,
		transformedId: 0,
		previewUrl: '',
		sourceUrl,
		fields: {},
	};
}

export function validateFields( subject: Subject ): boolean {
	let isValid = true;
	Object.keys( subject.fields ).forEach( ( key ) => {
		const f = subject.fields[ key ];
		if ( f.rawValue === '' || f.parsedValue === '' ) {
			isValid = false;
		}
	} );
	return isValid;
}

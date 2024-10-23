import { FieldType, GenericField } from '@/model/field/Field';

export enum SubjectType {
	BlogPost = 'blog-post',
}

export const humanReadableSubjectType: Map< SubjectType, string > = new Map( [
	[ SubjectType.BlogPost, 'Blog Post' ],
] );

export type Subject = GenericSubject< any, PostFields< any, FieldType > >;

export interface GenericSubject<
	Type extends SubjectType,
	Fields extends PostFields< any, any >,
> {
	type: Type;
	id: number;
	transformedId: number;
	guid: string;
	fields: Fields;
}

type PostFields< FieldName extends string, T extends FieldType > = {
	[ Property in keyof FieldName ]: GenericField< T >;
};

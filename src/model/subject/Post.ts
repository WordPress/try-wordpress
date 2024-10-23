import { FieldType, GenericField } from '@/model/field/Field';

export enum PostType {
	BlogPost = 'liberated_data',
}

export const humanReadablePostType: Map< PostType, string > = new Map( [
	[ PostType.BlogPost, 'Blog Post' ],
] );

export type Post = GenericPost< any, PostFields< any, FieldType > >;
export type PostField = GenericField< FieldType >;

export interface GenericPost<
	Type extends PostType,
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

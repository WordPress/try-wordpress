export enum FieldType {
	Date = 'date',
	Text = 'text',
	Html = 'html',
}

export type Field = GenericField< FieldType >;

export interface GenericField< T extends FieldType > {
	type: T;
	original: string;
	parsed: string;
}

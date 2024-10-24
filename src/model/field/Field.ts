export enum FieldType {
	Date = 'date',
	Text = 'text',
	Html = 'html',
}

export interface Field {
	type: FieldType;
	original: string;
	parsed: string;
}

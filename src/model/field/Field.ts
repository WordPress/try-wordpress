export enum FieldType {
	Date = 'date',
	Text = 'text',
	Html = 'html',
	Navigation = 'navigation',
}

export interface Field {
	type: FieldType;
	original: string;
	parsed: string;
}

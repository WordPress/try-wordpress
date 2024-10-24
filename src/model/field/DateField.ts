import { Field, FieldType } from '@/model/field/Field';

export interface DateField extends Field {
	type: FieldType.Date;
	value: Date;
}

export function newDateField(
	original: string = '',
	parsed: string = ''
): DateField {
	const date = parsed === '' ? new Date() : new Date( parsed );
	return {
		type: FieldType.Date,
		original,
		parsed,
		value: date,
	};
}

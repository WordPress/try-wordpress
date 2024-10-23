import { FieldType, GenericField } from '@/model/field/Field';

export type DateField = GenericField< FieldType.Date > & {
	value: Date;
};

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

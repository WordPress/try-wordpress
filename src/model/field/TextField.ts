import { Field, FieldType } from '@/model/field/Field';

export interface TextField extends Field {
	type: FieldType.Text;
}

export function newTextField(
	original: string = '',
	parsed: string = ''
): TextField {
	return {
		type: FieldType.Text,
		original,
		parsed,
	};
}

import { FieldType, GenericField } from '@/model/field/Field';

export type TextField = GenericField< FieldType.Text >;

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

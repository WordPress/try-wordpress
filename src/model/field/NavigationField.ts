import { Field, FieldType } from '@/model/field/Field';

export interface NavigationField extends Field {
	type: FieldType.Navigation;
}

export function newNavigationField(
	original: string = '',
	parsed: string = ''
): NavigationField {
	return {
		type: FieldType.Navigation,
		original,
		parsed,
	};
}

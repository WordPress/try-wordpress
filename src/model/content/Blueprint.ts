import { FieldType, GenericField, PostType } from '@/model/content/Post';

export type Blueprint = GenericBlueprint<
	any,
	BlueprintFields< any, FieldType >
>;

export type BlueprintField = GenericBlueprintField< FieldType >;
export type BlueprintDateField = GenericBlueprintField< FieldType.Date >;
export type BlueprintTextField = GenericBlueprintField< FieldType.Text >;
export type BlueprintHtmlField = GenericBlueprintField< FieldType.Html >;

export interface GenericBlueprint<
	Type extends PostType,
	Fields extends BlueprintFields< any, any >,
> {
	type: Type;
	id: string; // TODO: Probably need to make this a number when we start storing Blueprints on the backend.
	sourceUrl: string;
	valid: false;
	fields: Fields;
}

interface GenericBlueprintField< T extends FieldType >
	extends Pick< GenericField< T >, 'type' > {
	selector?: string;
}

type BlueprintFields< FieldName extends string, T extends FieldType > = {
	[ Property in keyof FieldName ]: GenericBlueprintField< T >;
};

import { SubjectType } from '@/model/Subject';
import { FieldType } from '@/model/field/Field';
import { getSchema } from '@/schemas/schemas';

export interface SchemaField {
	name: string;
	type: FieldType;
}

// Returns all fields of the schema, indexed by name.
export function getSchemaFields(
	subjectType: SubjectType
): Record< string, SchemaField > {
	const schema = getSchema( subjectType );
	const fields = schema.fields as Record< string, { type: string } >;

	const schemaFields: Record< string, SchemaField > = {};
	Object.keys( fields ).forEach( ( key ) => {
		const field = fields[ key ];
		schemaFields[ key ] = {
			name: key,
			type: field.type as FieldType,
		};
	} );
	return schemaFields;
}

import { SubjectType } from '@/model/subject/Subject';
import { FieldType } from '@/model/field/Field';

export interface BlueprintField {
	type: FieldType;
	selector?: string;
}

export interface Blueprint {
	type: SubjectType;
	id: string; // TODO: Probably need to make this a number when we start storing Blueprints on the backend.
	sourceUrl: string;
	valid: boolean;
	fields: Record< string, BlueprintField >;
}

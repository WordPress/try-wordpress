import { ApiClient } from '@/api/ApiClient';
import { Blueprint } from '@/model/blueprint/Blueprint';
import { SubjectType } from '@/model/subject/Subject';

export class BlueprintsApi {
	// eslint-disable-next-line no-useless-constructor
	constructor( private readonly client: ApiClient ) {}

	async create( blueprint: Blueprint ): Promise< Blueprint > {
		blueprint.id = Date.now().toString( 16 );

		const values: Record< string, Blueprint > = {};
		values[ key( blueprint.id ) ] = blueprint;
		await browser.storage.local.set( values );

		// We also maintain an array of blueprintIds to serve as "index" for when we need to list blueprints.
		let blueprintIds: string[];
		const blueprintIdsValues =
			await browser.storage.local.get( 'blueprints' );
		if ( ! blueprintIdsValues || ! blueprintIdsValues.blueprints ) {
			blueprintIds = [];
		} else {
			blueprintIds = blueprintIdsValues.blueprints;
		}
		blueprintIds.push( blueprint.id );
		await browser.storage.local.set( { blueprints: blueprintIds } );

		return blueprint;
	}

	async update( blueprint: Blueprint ): Promise< Blueprint > {
		const values: Record< string, Blueprint > = {};
		values[ key( blueprint.id ) ] = blueprint;
		await browser.storage.local.set( values );
		return blueprint;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async findById( id: string ): Promise< Blueprint | null > {
		const values = await browser.storage.local.get( key( id ) );
		if ( ! values || ! values[ key( id ) ] ) {
			return null;
		}
		return values[ key( id ) ] as Blueprint;
	}

	async findBySubjectType(
		subjectType: SubjectType
	): Promise< Blueprint[] > {
		let blueprintIds = [];
		const values = await browser.storage.local.get( 'blueprints' );
		if ( values && values.blueprints ) {
			blueprintIds = values.blueprints;
		}

		const blueprints = [];
		for ( const blueprintId of blueprintIds ) {
			// eslint-disable-next-line react/no-is-mounted
			const blueprint = await this.findById( blueprintId );
			if ( blueprint && blueprint.type === subjectType ) {
				blueprints.push( blueprint );
			}
		}

		return blueprints;
	}
}

function key( blueprintId: string ): string {
	return `blueprint-${ blueprintId }`;
}

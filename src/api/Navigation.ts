import { ApiClient } from '@/api/ApiClient';
import { Navigation } from '@/model/subject/Navigation';

export class NavigationApi {
	// eslint-disable-next-line no-useless-constructor
	constructor( private readonly client: ApiClient ) {}

	async create( navigation: Navigation ): Promise< Navigation > {
		navigation.id = Date.now().toString( 16 );

		const values: Record< string, Navigation > = {};
		values[ key( navigation.id ) ] = navigation;
		await browser.storage.local.set( values );

		// We also maintain an array of navigationIds to serve as "index" for when we need to list navigations.
		let navigationIds: string[];
		const navigationIdsValues =
			await browser.storage.local.get( 'navigations' );
		if ( ! navigationIdsValues || ! navigationIdsValues.navigations ) {
			navigationIds = [];
		} else {
			navigationIds = navigationIdsValues.navigations;
		}
		navigationIds.push( navigation.id );
		await browser.storage.local.set( { navigations: navigationIds } );

		return navigation;
	}

	async update( navigation: Navigation ): Promise< Navigation > {
		const values: Record< string, Navigation > = {};
		values[ key( navigation.id ) ] = navigation;
		await browser.storage.local.set( values );
		return navigation;
	}
}

function key( id: string ): string {
	return `navigation-${ id }`;
}

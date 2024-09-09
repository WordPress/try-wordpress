import { PlaygroundClient } from '@wp-playground/client';

export interface Foo {
	name: string;
}

export class ApiClient {
	private readonly playgroundClient: PlaygroundClient;
	private readonly _siteUrl: string;

	constructor( playgroundClient: PlaygroundClient, siteUrl: string ) {
		this.playgroundClient = playgroundClient;
		this._siteUrl = siteUrl;
	}

	get siteUrl(): string {
		return this._siteUrl;
	}

	async getFoo(): Promise< Foo > {
		return new Promise( ( resolve ) => {
			try {
				resolve( { name: 'foo' } );
			} catch ( error ) {
				console.log( error );
				throw error;
			}
		} );
	}
}

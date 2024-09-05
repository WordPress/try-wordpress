export interface Foo {
	name: string;
}

export class ApiClient {
	private readonly url: string;
	constructor( opts: { url: string } ) {
		this.url = opts.url;
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

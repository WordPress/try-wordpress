import { ApiClient } from '@/api/ApiClient';
import { Header } from '@/model/subject/Header';

export class HeadersApi {
	constructor( private readonly client: ApiClient ) {}

	async create( header: Header ): Promise< Header > {
		header.id = await this.allocateId();
		const values: Record< string, Header > = {};
		values[ key( header.id ) ] = header;
		await browser.storage.local.set( values );
		return header;
	}

	async update( header: Header ): Promise< Header > {
		const values: Record< string, Header > = {};
		values[ key( header.id ) ] = header;
		await browser.storage.local.set( values );
		return header;
	}

	async findBySourceUrl( sourceUrl: string ): Promise< Header | null > {
		const headerIds = await this.getIds();
		for ( const headerId of headerIds ) {
			const header = await this.findById( headerId );
			if ( header && header.sourceUrl === sourceUrl ) {
				return header;
			}
		}
		return null;
	}

	private async getIds(): Promise< number[] > {
		const values = await browser.storage.local.get( 'headers' );
		if ( values && values.headers ) {
			return values.headers;
		}
		return [];
	}

	// We maintain an array of headerIds to serve as "index" for when we need to list headers.
	private async allocateId(): Promise< number > {
		let ids: number[];
		const idsValues = await browser.storage.local.get( 'headers' );
		if ( ! idsValues || ! idsValues.headers ) {
			ids = [];
		} else {
			ids = idsValues.headers;
		}
		let newId = 1;
		for ( const id of ids ) {
			if ( id > newId ) {
				newId = id + 1;
			}
		}
		ids.push( newId );
		await browser.storage.local.set( { headers: ids } );
		return newId;
	}

	private async findById( id: number ): Promise< Header | null > {
		const values = await browser.storage.local.get( key( id ) );
		if ( ! values || ! values[ key( id ) ] ) {
			return null;
		}
		return values[ key( id ) ] as Header;
	}
}

function key( id: number ): string {
	return `header-${ id }`;
}

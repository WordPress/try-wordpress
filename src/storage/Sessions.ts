export interface Session {
	id: string;
	url: string;
	title: string;
}

export class Sessions {
	static async create( data: {
		url: string;
		title: string;
	} ): Promise< Session > {
		const { url, title } = data;
		const session: Session = {
			id: Date.now().toString( 16 ),
			url,
			title,
		};

		const values: Record< string, Session > = {};
		values[ key( session.id ) ] = session;
		await browser.storage.local.set( values );
		return session;
	}

	static async get( id: string ): Promise< Session | null > {
		const values = await browser.storage.local.get( key( id ) );
		if ( ! values ) {
			return null;
		}

		return values[ key( id ) ] as Session;
	}
}

function key( id: string ): string {
	return `session-${ id }`;
}

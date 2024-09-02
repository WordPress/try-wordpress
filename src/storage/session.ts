export interface Session {
	id: string;
	url: string;
	title: string;
}

export async function createSession( data: {
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

	// We also maintain an array of sessionIds to serve as "index" for when we need to list sessions.
	let sessionIds: string[];
	const sessionIdsValues = await browser.storage.local.get( 'sessions' );
	if ( ! sessionIdsValues || ! sessionIdsValues.sessions ) {
		sessionIds = [];
	} else {
		sessionIds = sessionIdsValues.sessions;
	}
	sessionIds.push( session.id );
	await browser.storage.local.set( { sessions: sessionIds } );

	return session;
}

export async function getSession( id: string ): Promise< Session | null > {
	const values = await browser.storage.local.get( key( id ) );
	if ( ! values || ! values[ key( id ) ] ) {
		return null;
	}
	return values[ key( id ) ] as Session;
}

export async function listSessions(): Promise< Session[] > {
	let sessionIds = [];
	const values = await browser.storage.local.get( 'sessions' );
	if ( values && values.sessions ) {
		sessionIds = values.sessions;
	}

	const sessions = [];
	for ( const sessionId of sessionIds ) {
		const session = await getSession( sessionId );
		if ( session ) {
			sessions.push( session );
		}
	}

	return sessions;
}

function key( sessionId: string ): string {
	return `session-${ sessionId }`;
}

import { useNavigate } from 'react-router-dom';
import { Session, Sessions } from '@/storage/Sessions';

export function NewSession() {
	const navigate = useNavigate();
	const handleClick = async () => {
		try {
			const session = await createSession();
			navigate( `/view-session:${ session.id }` );
		} catch ( error ) {
			// TODO: Handle error.
			console.error( 'Failed to create session', error );
			return;
		}
	};

	return (
		<>
			<p>
				Start by navigating to the main page of your site, then click
				Continue.
			</p>
			<button onClick={ handleClick }>Continue</button>
		</>
	);
}

async function createSession(): Promise< Session > {
	const info = await getSiteInfo();
	if ( ! info ) {
		throw new Error( 'Failed to retrieve site info' );
	}

	return Sessions.create( {
		url: info.url,
		title: info.title ?? info.url.hostname,
	} );
}

async function getSiteInfo(): Promise< null | {
	url: URL;
	title?: string;
} > {
	const tabs = await browser.tabs.query( {
		currentWindow: true,
		active: true,
	} );
	if ( tabs.length !== 1 ) {
		return null;
	}
	const tab = tabs[ 0 ];

	if ( ! tab.url ) {
		return null;
	}

	return {
		url: new URL( tab.url ),
		title: tab.title,
	};
}

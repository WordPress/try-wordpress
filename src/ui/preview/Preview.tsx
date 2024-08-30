import { useEffect } from 'react';
import { startPlaygroundWeb } from '@wp-playground/client';

export function Preview( props: { slug: string } ) {
	const { slug } = props;
	const playgroundIframeId = 'playground';

	useEffect( () => {
		initPlayground( playgroundIframeId, slug ).catch( ( error ) => {
			console.error( error );
		} );
	}, [ slug ] );

	return (
		<>
			<iframe id="playground" />
		</>
	);
}

async function initPlayground( iframeId: string, slug: string ) {
	const iframe = document.getElementById( iframeId );
	if ( ! ( iframe instanceof HTMLIFrameElement ) ) {
		throw Error( 'Playground container element must be an iframe' );
	}
	if ( iframe.src !== '' ) {
		throw Error(
			'Playground container iframe must not have the src attribute set'
		);
	}

	const options = {
		iframe,
		remoteUrl:
			'https://playground.wordpress.net/remote.html?storage=browser',
		siteSlug: slug,
		blueprint: {
			login: true,
			steps: steps(),
		},
	};

	const client = await startPlaygroundWeb( options );
	console.log( 'Playground communication established!', client );
	return client;
}

function steps() {
	return [
		{
			step: 'login',
			username: 'admin',
			password: 'password',
		},
	];
}

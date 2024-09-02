import { useEffect, useState } from 'react';
import {
	PlaygroundClient,
	StartPlaygroundOptions,
	startPlaygroundWeb,
} from '@wp-playground/client';

const playgroundIframeId = 'playground';

export function Playground( props: { slug: string } ) {
	const { slug } = props;
	const [ playgroundUrl, setPlaygroundUrl ] = useState< string | null >();

	useEffect( () => {
		initPlayground( playgroundIframeId, slug )
			.then( async ( client: PlaygroundClient ) => {
				const url = await client.absoluteUrl;
				console.log( 'Playground communication established!', url );
				setPlaygroundUrl( url );
			} )
			.catch( ( error ) => {
				console.error( error );
			} );
	}, [ slug ] );

	return <iframe title={ slug } id={ playgroundIframeId } />;
}

async function initPlayground(
	iframeId: string,
	slug: string
): Promise< PlaygroundClient > {
	const iframe = document.getElementById( iframeId );
	if ( ! ( iframe instanceof HTMLIFrameElement ) ) {
		throw Error( 'Playground container element must be an iframe' );
	}
	if ( iframe.src !== '' ) {
		throw Error(
			'Playground container iframe must not have the src attribute set'
		);
	}

	const options: StartPlaygroundOptions = {
		iframe,
		remoteUrl:
			'https://playground.wordpress.net/remote.html?storage=browser',
		siteSlug: slug,
		blueprint: {
			login: true,
			steps: steps(),
		},
	};

	const client: PlaygroundClient = await startPlaygroundWeb( options );
	await client.isReady;
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

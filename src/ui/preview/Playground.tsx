import { useEffect } from 'react';
import {
	PlaygroundClient,
	StartPlaygroundOptions,
	startPlaygroundWeb,
} from '@wp-playground/client';

const playgroundIframeId = 'playground';

export interface PlaygroundInfo {
	url: string;
}

export function Playground( props: {
	slug: string;
	className?: string;
	onReady: ( info: PlaygroundInfo ) => void;
} ) {
	const { slug, className, onReady } = props;

	useEffect( () => {
		const iframe = document.getElementById( playgroundIframeId );
		if ( ! ( iframe instanceof HTMLIFrameElement ) ) {
			throw Error( 'Playground container element must be an iframe' );
		}
		if ( iframe.src !== '' ) {
			// Playground is already started.
			return;
		}

		initPlayground( iframe, slug )
			.then( async ( client: PlaygroundClient ) => {
				const info = {
					url: await client.absoluteUrl,
				};
				console.log( 'Playground communication established!', info );
				onReady( info );
			} )
			.catch( ( error ) => {
				throw error;
			} );
	}, [ slug, onReady ] );

	return (
		<iframe
			title={ slug }
			id={ playgroundIframeId }
			className={ className }
		/>
	);
}

async function initPlayground(
	iframe: HTMLIFrameElement,
	slug: string
): Promise< PlaygroundClient > {
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

import { useEffect, useState } from 'react';
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
	hideOnReady: boolean;
	onReady: ( info: PlaygroundInfo ) => void;
} ) {
	const { slug, hideOnReady, onReady } = props;
	const [ show, setShow ] = useState< boolean >( true );

	useEffect( () => {
		const iframe = document.getElementById( playgroundIframeId );
		if ( ! ( iframe instanceof HTMLIFrameElement ) ) {
			throw Error( 'Playground container element must be an iframe' );
		}
		if ( iframe.src !== '' ) {
			// Playground is already started.
			return;
		}

		const ready = ( info: PlaygroundInfo ) => {
			console.log( 'Playground communication established!', info );
			if ( hideOnReady ) {
				setShow( false );
			}
			onReady( info );
		};

		initPlayground( iframe, slug )
			.then( async ( client: PlaygroundClient ) => {
				const url = await client.absoluteUrl;
				ready( { url } );
			} )
			.catch( ( error ) => {
				throw error;
			} );
	}, [ slug, hideOnReady, onReady ] );

	const classes = show ? [] : [ 'hidden' ];
	return (
		<iframe
			title={ slug }
			id={ playgroundIframeId }
			className={ classes.join( ' ' ) }
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

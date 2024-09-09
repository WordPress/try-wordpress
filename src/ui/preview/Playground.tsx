import { useEffect } from 'react';
import {
	PlaygroundClient,
	StartPlaygroundOptions,
	startPlaygroundWeb,
} from '@wp-playground/client';
import { ApiClient } from '@/api/ApiClient';

const playgroundIframeId = 'playground';

export function Playground( props: {
	slug: string;
	className?: string;
	onReady: ( apiClient: ApiClient ) => void;
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
			.then( async ( playgroundClient: PlaygroundClient ) => {
				const apiClient = new ApiClient(
					playgroundClient,
					await playgroundClient.absoluteUrl
				);
				console.log(
					'Playground communication established!',
					apiClient.siteUrl
				);
				onReady( apiClient );
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
		{
			step: 'runPHP',
			code: deleteDefaultContent(),
		},
		{
			step: 'unzip',
			zipFile: {
				resource: 'url',
				url: 'plugin.zip',
			},
			extractToPath: '/wordpress/wp-content/plugins/try-wordpress',
		},
		{
			step: 'activatePlugin',
			pluginName: 'Try WordPress',
			pluginPath: '/wordpress/wp-content/plugins/try-wordpress',
		},
	];
}

function deleteDefaultContent(): string {
	return `<?php
require_once 'wordpress/wp-load.php';
$posts = get_posts( array( 'posts_per_page' => -1 ) );
foreach ( $posts as $post ) {
    wp_delete_post( $post->ID, true );
}
$pages = get_posts(
    array(
        'posts_per_page' => -1,
        'post_type'      => 'page',
        'post_status'    => array( 'publish', 'draft' ),
    )
);
foreach ( $pages as $page ) {
    wp_delete_post( $page->ID, true );
}
`;
}

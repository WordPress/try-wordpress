import { useEffect, useRef } from 'react';
import {
	MountDescriptor,
	PlaygroundClient,
	StartPlaygroundOptions,
	startPlaygroundWeb,
	StepDefinition,
} from '@wp-playground/client';

const playgroundIframeId = 'playground';

export function Playground( props: {
	slug: string;
	className?: string;
	blogName: string;
	onReady: ( client: PlaygroundClient ) => void;
} ) {
	const { slug, className, blogName, onReady } = props;

	const initializationRef = useRef( false );

	useEffect( () => {
		const iframe = document.getElementById( playgroundIframeId );
		if ( ! ( iframe instanceof HTMLIFrameElement ) ) {
			throw Error( 'Playground container element must be an iframe' );
		}
		if ( iframe.src !== '' || initializationRef.current ) {
			// Playground is already started or initialization has been attempted.
			return;
		}

		initializationRef.current = true;

		initPlayground( iframe, slug, blogName )
			.then( async ( client: PlaygroundClient ) => {
				const url = await client.absoluteUrl;
				console.log( 'Playground communication established', url );
				onReady( client );
			} )
			.catch( ( error ) => {
				throw error;
			} );
	}, [ slug, blogName, onReady ] );

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
	slug: string,
	blogName: string
): Promise< PlaygroundClient > {
	const mountDescriptor: MountDescriptor = {
		device: {
			type: 'opfs',
			path: '/try-wp-sites/' + slug,
		},
		mountpoint: '/wordpress',
	};

	const isWPInstalled = await isWordPressInstalled( slug );
	console.info( 'isWordPressInstalled', isWPInstalled );

	const options: StartPlaygroundOptions = {
		iframe,
		remoteUrl: `https://playground.wordpress.net/remote.html`,
		mounts: [ mountDescriptor ],
		shouldInstallWordPress: ! isWPInstalled,
		blueprint: {
			login: true,
			steps: steps(),
			siteOptions: {
				blogname: blogName,
			},
		},
	};

	const client: PlaygroundClient = await startPlaygroundWeb( options );
	await client.isReady();

	if ( ! isWPInstalled ) {
		await setWordPressAsInstalled( slug );
	}

	return client;
}

async function isWordPressInstalled( slug: string ) {
	const localStorageKey = `${ slug }-isWordPressInstalled`;
	let isInstalled = false;

	try {
		const result = await browser.storage.local.get( localStorageKey );
		if ( result[ localStorageKey ] === 'true' ) {
			isInstalled = true;
		}
		return isInstalled;
	} catch ( error ) {
		console.log( `Error: ${ error }` );
		return false; // In case of error, assume WordPress is not installed
	}
}

async function setWordPressAsInstalled( slug: string ) {
	const localStorageKey = `${ slug }-isWordPressInstalled`;
	await browser.storage.local.set( { [ localStorageKey ]: 'true' } );
}

function steps(): StepDefinition[] {
	return [
		{
			step: 'defineWpConfigConsts',
			consts: {
				WP_ENVIRONMENT_TYPE: 'local',
			},
		},
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
			step: 'runPHP',
			code: createHomePage(),
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
		{
			step: 'mkdir',
			path: '/wordpress/wp-content/mu-plugins',
		},
		{
			step: 'writeFile',
			path: '/wordpress/wp-content/mu-plugins/authenticate-rest-request.php',
			data: authenticateRestRequest(),
		},
	];
}

function authenticateRestRequest(): string {
	return `<?php
add_filter( "rest_authentication_errors", "__return_true" );
add_filter( "determine_current_user", function() { return 1; }, 99999 );
`;
}

function deleteDefaultContent(): string {
	return `<?php
require_once 'wordpress/wp-load.php';
wp_delete_post( 1, true );
wp_delete_post( 2, true );
wp_delete_post( 3, true );
`;
}

function createHomePage(): string {
	return `<?php
require_once 'wordpress/wp-load.php';
$term = get_term_by('slug', 'twentytwentyfour', 'wp_theme');
if(!$term){
    $term = wp_insert_term(
        'twentytwentyfour',
        'wp_theme'
    );
    $term_id = $term['term_id'];
} else {
    $term_id = $term->term_id;
}
$post_id = wp_insert_post(array(
    'post_title' => 'Home',
    'post_name' => 'home',
    'post_type' => 'wp_template',
    'post_status' => 'publish',
    'tax_input' => array(
        'wp_theme' => array($term_id)
    ),
    'post_content' => '<!-- wp:template-part {"slug":"header","theme":"twentytwentyfour","tagName":"header","area":"header"} /-->
<!-- wp:group {"tagName":"main","style":{"spacing":{"blockGap":"0","margin":{"top":"0"},"padding":{"right":"var:preset|spacing|20","left":"var:preset|spacing|20"}}},"layout":{"type":"default"}} -->
<main class="wp-block-group" style="margin-top:0;padding-right:var(--wp--preset--spacing--20);padding-left:var(--wp--preset--spacing--20)"><!-- wp:query {"queryId":5,"query":{"perPage":"30","pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false}} -->
<div class="wp-block-query"><!-- wp:post-template -->
<!-- wp:post-title {"isLink":true} /-->
<!-- wp:post-date /-->
<!-- /wp:post-template -->
<!-- wp:query-pagination -->
<!-- wp:query-pagination-previous /-->
<!-- wp:query-pagination-numbers /-->
<!-- wp:query-pagination-next /-->
<!-- /wp:query-pagination -->
<!-- wp:query-no-results -->
<!-- wp:paragraph {"placeholder":"Add text or blocks that will display when a query returns no results."} -->
<p></p>
<!-- /wp:paragraph -->
<!-- /wp:query-no-results --></div>
<!-- /wp:query --></main>
<!-- /wp:group -->
<!-- wp:template-part {"slug":"footer","theme":"twentytwentyfour","tagName":"footer","area":"footer"} /-->',
    ));
wp_set_object_terms($post_id, $term_id, 'wp_theme');
`;
}

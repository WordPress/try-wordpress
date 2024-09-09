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

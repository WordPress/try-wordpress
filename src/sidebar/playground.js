/* global HTMLIFrameElement */

import { startPlaygroundWeb } from '@wp-playground/client';

export async function initPlayground( iframeId ) {
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
		siteSlug: 'try-wordpress',
		blueprint: {
			login: true,
			landingPage: '/wp-admin/admin.php?page=data-liberation',
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
		{
			step: 'runPHP',
			code: "<?php require_once 'wordpress/wp-load.php'; $posts = get_posts(array('posts_per_page' => -1)); foreach ($posts as $post) { wp_delete_post($post->ID, true); } $pages = get_posts(array('posts_per_page' => -1, 'post_type' => 'page')); foreach ($pages as $page) { wp_delete_post($page->ID, true); } ?>",
		},
		{
			// set the TT4 homepage
			step: 'runPHP',
			code: '<?php require_once \'wordpress/wp-load.php\';\n$term = get_term_by(\'slug\', \'twentytwentyfour\', \'wp_theme\');\nif ( ! $term) {\n$term = wp_insert_term(\n\'twentytwentyfour\',\n\'wp_theme\'\n);\n$term_id = $term[\'term_id\'];\n} else {\n$term_id = $term->term_id;\n}\n$post_id = wp_insert_post(array(\n\'post_title\' => \'Home\',\n\'post_name\' => \'home\',\n\'post_type\' => \'wp_template\',\n\'post_status\' => \'publish\',\n\'tax_input\' => array(\n\'wp_theme\' => array( $term_id )\n),\n\'post_content\' => \'<!-- wp:template-part {"slug":"header","theme":"twentytwentyfour","tagName":"header","area":"header"} /-->\n<!-- wp:group {"tagName":"main","style":{"spacing":{"blockGap":"0","margin":{"top":"0"},"padding":{"right":"var:preset|spacing|20","left":"var:preset|spacing|20"}}},"layout":{"type":"default"}} -->\n<main class="wp-block-group" style="margin-top:0;padding-right:var(--wp--preset--spacing--20);padding-left:var(--wp--preset--spacing--20)"><!-- wp:query {"queryId":5,"query":{"perPage":"30","pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false}} -->\n<div class="wp-block-query"><!-- wp:post-template -->\n<!-- wp:post-title {"isLink":true} /-->\n<!-- wp:post-date /-->\n<!-- /wp:post-template -->\n<!-- wp:query-pagination -->\n<!-- wp:query-pagination-previous /-->\n<!-- wp:query-pagination-numbers /-->\n<!-- wp:query-pagination-next /-->\n<!-- /wp:query-pagination -->\n<!-- wp:query-no-results -->\n<!-- wp:paragraph {"placeholder":"Add text or blocks that will display when a query returns no results."} -->\n<p></p>\n<!-- /wp:paragraph -->\n<!-- /wp:query-no-results --></div>\n<!-- /wp:query --></main>\n<!-- /wp:group -->\n<!-- wp:template-part {"slug":"footer","theme":"twentytwentyfour","tagName":"footer","area":"footer"} /-->\',\n));\nwp_set_object_terms($post_id, $term_id, \'wp_theme\');',
		},
		{
			step: 'unzip',
			zipFile: {
				resource: 'url',
				url: 'https://github-proxy.com/proxy/?repo=akirk/try-wordpress&branch=rename-plugin&directory=plugins/data-liberation',
			},
			extractToPath: '/wordpress/wp-content',
		},
		{
			step: 'activatePlugin',
			pluginName: 'Data Liberation',
			pluginPath: '/wordpress/wp-content/plugins/data-liberation',
		},
	];
}

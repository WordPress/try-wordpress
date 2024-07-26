import { startPlaygroundWeb } from './playground-client.js';
const client = startPlaygroundWeb( {
	iframe: document.getElementById("wp"),
	remoteUrl: "https://playground.wordpress.net/remote.html?storage=browser",
	siteSlug: 'try-wordpress',
	blueprint:
	{
  "landingPage": "/wp-admin/admin.php?page=data-liberation",
  "steps": [
    {
      "step": "login",
      "username": "admin",
      "password": "password"
    },
    {
      "step": "runPHP",
      "code": "<?php require_once 'wordpress/wp-load.php'; $posts = get_posts(array('numberposts' => -1)); foreach ($posts as $post) { wp_delete_post($post->ID, true); } ?>"
    },
    {
        "step": "unzip",
        "zipFile": {
            "resource": "url",
            "url": "https://github-proxy.com/proxy/?repo=akirk/try-wordpress&branch=trunk&directory=plugins/data-liberation"
        },
        "extractToPath": "/wordpress/wp-content"
    },
    {
        "step": "activatePlugin",
        "pluginName": "Data Liberation",
        "pluginPath": "/wordpress/wp-content/plugins/data-liberation"
    }
  ],
  "login": true
}
}).then(
	async function ( p ) {
		window.playground = p;
		console.log( 'Playground communication established!', p );
	}
);

const MESSAGE_NAMESPACE = 'TRY_WORDPRESS';
document.getElementById('import-current-page').addEventListener('click', function( e ) {
	e.preventDefault();
	chrome.tabs.query(
		{ active: true, currentWindow: true },
		function ( tabs ) {
			if ( ! tabs || ! tabs.length || ! window.playground ) {
				console.log( window.playground );
				return;
			}

			// tabs is an array of all tabs that match the query parameters
			const currentTab = tabs[ 0 ];

			// Send a message to the current tab
			chrome.tabs.sendMessage( currentTab.id, {
				sender: MESSAGE_NAMESPACE,
				import: true
			}, function( response ) {
				// console.log( response, chrome.runtime.lastError );
				if ( response && response.code ) {
					console.log( response.code );
					console.log( window.playground.run( response ) );
				}
			} );
		}
	);
	return false;
});

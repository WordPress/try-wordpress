import { startPlaygroundWeb } from './playground-client.js';
const client = startPlaygroundWeb( {
	iframe: document.getElementById("wp"),
	remoteUrl: "https://playground.wordpress.net/remote.html",
	blueprint:
	{
  "landingPage": "/wp-admin/",
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
      "step": "mkdir",
      "path": "wordpress/wp-content/mu-plugins"
    },
    {
      "step": "writeFile",
      "path": "wordpress/wp-content/mu-plugins/show-admin-notice-2.php",
      "data": "<?php\nadd_action(\n'admin_notices',\nfunction() {\necho '<div class=\"notice notice-success\" id=\"custom-admin-notice-2\"><p>' . esc_html( 'Welcome to Data Liberation!' ) . '</p></div>';\n}\n);"
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
					console.log( window.playground.run( response.code ) );
				}
			} );
		}
	);
	return false;
});

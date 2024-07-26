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

const relayToPlayground = function( response ) {
	console.log( response, chrome.runtime.lastError );
	if ( response && response.stepId ) {
		document.getElementById('wp').contentWindow.postMessage( {
			type: 'relay',
			data: response
		}, '*' );
	}
	if ( response && response.code && window.playground ) {
		console.log( response.code );
		console.log( window.playground.run( response ) );
	}
};

window.addEventListener('message', function( event ) {
	if ( 'relay' !== event.data.type ) {
		return;
	}
	const data = event.data.data;
	if ( 'data-liberation-message' !== data.type ) {
		return;
	}
	if ( 'start-import' === data.action ) {
		document.getElementById('wp').contentWindow.postMessage( {
			type: 'relay',
			data: {
				stepId: 'detecting',
				stepText: 'Detecting CMS...',
			}
		}, '*' );
		startImport();
	}
});

const MESSAGE_NAMESPACE = 'TRY_WORDPRESS';

chrome.runtime.onMessage.addListener(
	function ( message, sender, sendResponse ) {
		if ( ! message.sender || message.sender !== MESSAGE_NAMESPACE ) {
			return;
		}
		relayToPlayground( message );
	}
);
const startImport = function() {
	chrome.tabs.query(
		{ active: true, currentWindow: true },
		function ( tabs ) {
			if ( ! tabs || ! tabs.length ) {
				return;
			}

			// tabs is an array of all tabs that match the query parameters
			const currentTab = tabs[ 0 ];

			// Send a message to the current tab
			chrome.tabs.sendMessage( currentTab.id, {
				sender: MESSAGE_NAMESPACE,
				import: true
			}, relayToPlayground );
		}
	);
	return false;
};

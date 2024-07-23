import { startPlaygroundWeb } from './playground-client.js';
const client = startPlaygroundWeb( {
	iframe: document.getElementById("wp"),
	remoteUrl: "https://playground.wordpress.net/remote.html",
	landingPage: '/'

// };
// 	onBlueprintStepCompleted: function( step ) {
// 		if ( typeof step === 'undefined' ) return;
// 		if ( typeof step.bytes != 'undefined' ) console.log( new TextDecoder().decode( step.bytes ) );
// 		console.log( step );
// 	},
// 	blueprint: {
// 		"steps": [
// 		{
// 			"command": "installPlugin",
// 			pluginZipFile: {
// 				resource: 'wordpress.org/plugins',
// 				slug: 'hello-dolly',
// 			}
// 		}
// 		]
// 	}
}).then(
	async function ( p ) {
		window.playground = p;
		console.log('playground',p);
		console.log(await window.playground.run({code: "<?php include 'wordpress/wp-load.php'; print_r(wp_count_posts());"}).then(c => new TextDecoder().decode( c.bytes )));
	}
);
console.log(client);

const MESSAGE_NAMESPACE = 'TRY_WORDPRESS';
document.getElementById('import-current-page').addEventListener('click', function( e ) {
	e.preventDefault();
	chrome.tabs.query(
		{ active: true, currentWindow: true },
		function ( tabs ) {
			if ( ! tabs || ! tabs.length || ! window.playground ) {
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
					console.log( playground.run( response.code ) );
				}
			} );
		}
	);
	return false;
});

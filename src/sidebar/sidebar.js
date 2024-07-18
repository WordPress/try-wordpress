import { startPlaygroundWeb, login, installPlugin } from 'https://playground.wordpress.net/client/index.js';
const blueprint = {
    "landingPage": "/wp-admin/",
    "steps":
    [
        {
            "step": "login",
            "username": "admin",
            "password": "password"
        },
        {
            "step": "mkdir",
            "path": "wordpress/wp-content/mu-plugins"
        },
        {
            "step": "writeFile",
            "path": "wordpress/wp-content/mu-plugins/show-admin-notice-1.php",
            "data": "%3C?php\nadd_action(\n'admin_notices',\nfunction()%20{\necho%20'%3Cdiv%20class=\"notice%20notice-success\"%20id=\"custom-admin-notice-1\"%3E%3Cp%3E'%20.%20esc_html(%20'WordPress%20Playground%20in%20the%20sidebar!'%20)%20.%20'%3C/p%3E%3C/div%3E';\n}\n);"
        }
    ],
    "login": true
};
startPlaygroundWeb({
	iframe: document.getElementById("wp"),
	siteSlug: 'try-wordpress',
	remoteUrl: 'https://playground.wordpress.net/remote.html?storage=browser',
	onBlueprintStepCompleted: function( step ) {
		if ( typeof step === 'undefined' ) return;
		if ( typeof step.bytes != 'undefined' ) console.log( new TextDecoder().decode( step.bytes ) );
		console.log( step );
	},
	blueprint: blueprint
}).then(function ( p ) {
	const queue = [ location.href ];
	window.playground = p;
});

document.getElementById('import-current-site').addEventListener('click', function() {

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
				if ( response.code ) {
					window.playground.run( response.code );
				}
			} );
		}
	);
});

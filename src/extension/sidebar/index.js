/* global chrome */

import { initPlayground } from './playground';

const iframeId = 'playground';
window.playground = await initPlayground( iframeId );

const relayToPlayground = function ( response ) {
	console.log( response, chrome.runtime.lastError );
	if ( response && response.stepId ) {
		document.getElementById( iframeId ).contentWindow.postMessage(
			{
				type: 'relay',
				data: response,
			},
			'*'
		);
	}
	if ( response && response.code && window.playground ) {
		console.log( response.code );
		console.log( window.playground.run( response ) );
	}
};

window.addEventListener( 'message', function ( event ) {
	if ( 'relay' !== event.data.type ) {
		return;
	}
	const data = event.data.data;
	if ( 'try-wordpress-message' !== data.type ) {
		return;
	}
	if ( 'start-import' === data.action ) {
		document.getElementById( iframeId ).contentWindow.postMessage(
			{
				type: 'relay',
				data: {
					stepId: 'detecting',
					stepText: 'Detecting CMS...',
				},
			},
			'*'
		);
		startImport();
	}
} );

const MESSAGE_NAMESPACE = 'TRY_WORDPRESS';

chrome.runtime.onMessage.addListener( function ( message ) {
	if ( ! message.sender || message.sender !== MESSAGE_NAMESPACE ) {
		return;
	}
	relayToPlayground( message );
} );
const startImport = function () {
	chrome.tabs.query(
		{ active: true, currentWindow: true },
		function ( tabs ) {
			if ( ! tabs || ! tabs.length ) {
				return;
			}

			// tabs is an array of all tabs that match the query parameters
			const currentTab = tabs[ 0 ];

			// Send a message to the current tab
			chrome.tabs.sendMessage(
				currentTab.id,
				{
					sender: MESSAGE_NAMESPACE,
					import: true,
				},
				relayToPlayground
			);
		}
	);
	return false;
};

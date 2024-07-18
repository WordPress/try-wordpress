/* global chrome */

export const TOGGLE_KEY = 'IS_ENABLED';
export const MESSAGE_NAMESPACE = 'TRY_WORDPRESS';

/**
 * Set the toggle state in the session storage.
 * @param {boolean} bool
 */
export const setToggleState = ( bool ) => {
	chrome.storage.session.set( { [ TOGGLE_KEY ]: bool } );
};

/**
 * Set the badge text and color based on the isEnabled state.
 * @param {boolean} isEnabled
 */
export const setToggleView = ( isEnabled ) => {
	let text = '';
	if ( isEnabled ) {
		text = 'On';
	}
	chrome.action.setBadgeText( { text } );
	chrome.action.setBadgeBackgroundColor( { color: '#FF3131' } );
	chrome.action.setBadgeTextColor( { color: '#FFFFFF' } );
};

/**
 * Send a message to the current tab to enable/disable the plugin.
 * @param {boolean} isEnabled
 */
export const togglePlugin = ( isEnabled ) => {
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
				isEnabled,
			} );
		}
	);
};

export const getToggleState = ( callback ) => {
	chrome.storage.session.get( TOGGLE_KEY, function ( data ) {
		let isEnabled = false;

		if ( data[ TOGGLE_KEY ] === undefined ) {
			isEnabled = true;
		} else {
			isEnabled = data[ TOGGLE_KEY ];
		}

		callback( isEnabled );
	} );
};

export const captureAndDownloadPageAsMHTML = () => {
	// Query for the currently active tab
	chrome.tabs.query(
		{ active: true, currentWindow: true },
		function ( tabs ) {
			// Get the first tab from the query result (it should be the active tab)
			const tab = tabs[ 0 ];

			// Capture the page as MHTML
			chrome.pageCapture.saveAsMHTML(
				{ tabId: tab.id },
				async ( mhtmlData ) => {
					const content = await mhtmlData.text();
					const url =
						'data:application/x-mimearchive;base64,' +
						btoa( content );
					chrome.downloads.download( {
						url,
						filename: 'filename.mhtml',
					} );
				}
			);
		}
	);
};

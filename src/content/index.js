import {
	addUserControls,
	addStyle,
	removeStyle,
	updateUserControlText,
	removeUserControls,
} from './utils/interface.js';
import { copyElementAndContent, getContentsToCopy } from './utils/dom.js';
import { insertViaWpRestApi, setWpSiteInfo, isWordPress } from './extractors/wp.js';
import { isTwitter, queryTwitterFollowers } from './extractors/twitter.js';
// Constants
const MESSAGE_NAMESPACE = 'TRY_WORDPRESS';
console.log( 'Content script loaded', MESSAGE_NAMESPACE );
/**
 * Handle the mouse over event.
 * @param {MouseEvent} event
 */
function onMouseOver( event ) {
	addStyle( event.target );

	updateUserControlText( `Copy <${ event.target.tagName.toLowerCase() }>` );
}

/**
 * Handle the click event.
 * @param {MouseEvent} event
 */
function onClick( event ) {
	updateUserControlText( 'Copying...' );

	// Make sure we update the user control text before copying the element.
	// eslint-disable-next-line no-undef
	requestAnimationFrame( () => {
		setTimeout( () => {
			copyElementAndContent( event.target, document );
			updateUserControlText( 'Copied!' );
		}, 0 );
	} );
}

/**
 * Handle the mouse out event.
 * @param {MouseEvent} event
 */
function onMouseOut( event ) {
	removeStyle( event.target );
}

let importPercent = 1;

/* global chrome */
chrome.runtime.onMessage.addListener(
	function ( message, sender, sendResponse ) {
		if ( ! message.sender || message.sender !== MESSAGE_NAMESPACE ) {
			return;
		}
		console.log( 'Starting import' );

		chrome.runtime.sendMessage( {
			sender: MESSAGE_NAMESPACE,
			siteTitle: document.title,
		} );

		if ( message.import ) {
			console.log( {
				wp: isWordPress(),
				twitter: isTwitter(),
			});
			if ( isWordPress() ) {
				chrome.runtime.sendMessage( {
					sender: MESSAGE_NAMESPACE,
					stepId: 'detecting',
					stepText: 'Detected WordPress!',
					stepCssClass: 'completed',
					percent: ++importPercent,
				});
				setWpSiteInfo();
				insertViaWpRestApi();
				// insertSingleViaWpRestApi( isWordPress() );
			}
			if ( isTwitter() ) {
				queryTwitterFollowers( window );
			}
			return true;
		}

		if ( message.isEnabled ) {
			document.body.addEventListener( 'mouseover', onMouseOver );
			document.body.addEventListener( 'mouseout', onMouseOut );
			document.body.addEventListener( 'click', onClick );

			addUserControls();
		} else {
			document.body.removeEventListener( 'mouseover', onMouseOver );
			document.body.removeEventListener( 'mouseout', onMouseOut );
			document.body.removeEventListener( 'click', onClick );
			removeUserControls();
		}

		sendResponse( { received: true } );
	}
);

// Export the getContentsToCopy function for testing.
window.__PatternEverywhere = {
	getContentsToCopy,
};

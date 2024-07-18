import {
	addUserControls,
	addStyle,
	removeStyle,
	updateUserControlText,
	removeUserControls,
} from './utils/interface.js';
import { copyElementAndContent, getContentsToCopy } from './utils/dom.js';

// Constants
const MESSAGE_NAMESPACE = 'TRY_WORDPRESS';

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

/* global chrome */
chrome.runtime.onMessage.addListener(
	function ( message, sender, sendResponse ) {
		if ( ! message.sender || message.sender !== MESSAGE_NAMESPACE ) {
			return;
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

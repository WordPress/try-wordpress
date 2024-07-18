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

const wpInsertPost = ( data ) => {
	data.post_status = 'publish';
	let code = "<?php require_once 'wordpress/wp-load.php';\n";
	code += "echo wp_insert_post(\n";
	code += "[\n";
	for ( let key in data ) {
		code += "'" + key + "'=>'" + data[key].replace(/'/g, "\\'" ) + "',\n";
	}
	code += "]);";

	return code;
};

const isWordPress = () => {
	const article = document.querySelector( 'article.post' );
	if ( article ) {
		// get the id from the css class post-<id>
		const id = article.className.match( /post-(\d+)/ );
		return id[1];
	}
	return false;
};

const insertViaWpRestApi = async ( id, sendResponse ) => {
	const url = `/wp-json/wp/v2/posts/${id}`;
	const response = await  fetch( url );
	const data = await  response.json();
	console.log(data);
	const code = wpInsertPost( {
		post_title: data.title.rendered,
		post_content: data.content.rendered,
		post_date: data.date,
	} );
	sendResponse( {code} );
};

/* global chrome */
chrome.runtime.onMessage.addListener(
	function ( message, sender, sendResponse ) {
		if ( ! message.sender || message.sender !== MESSAGE_NAMESPACE ) {
			// console.log(message);
			return;
		}

		if ( message.import ) {
			if ( isWordPress() ) {
				insertViaWpRestApi( isWordPress(), sendResponse );
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

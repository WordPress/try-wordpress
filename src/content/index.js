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
	code += 'echo wp_insert_post(\n';
	code += '[\n';
	for ( let key in data ) {
		code +=
			"'" + key + "'=>'" + data[ key ].replace( /'/g, "\\'" ) + "',\n";
	}
	code += ']);';

	return code;
};

const isWordPress = () => {
	const post = document.querySelector( 'article.post' );
	if ( post ) {
		// get the id from the css class post-<id>
		const id = post.className.match( /post-(\d+)/ );
		return 'posts/' + id[ 1 ];
	}
	const page = document.querySelector( 'article.page' );
	if ( page ) {
		// get the id from the css class post-<id>
		const id = page.className.match( /post-(\d+)/ );
		return 'pages/' + id[ 1 ];
	}
	return false;
};

const insertViaWpRestApi = async () => {
	const post_types = {
		post: '/wp-json/wp/v2/posts',
		// 'page': '/wp-json/wp/v2/pages',
	};
	for ( const post_type in post_types ) {
		console.log( post_types[ post_type ] );
		let page = 1,
			total = 1;
		do {
			const response = await fetch(
				post_types[ post_type ] + '?page=' + page
			);
			total = Math.min( 10, response.headers.get( 'X-WP-Totalpages' ) );
			const items = await response.json();
			for ( const i in items ) {
				const data = items[ i ];
				const code = wpInsertPost( {
					post_title: data.title.rendered,
					post_content: data.content.rendered,
					post_date: data.date,
					post_type: data.type,
				} );
				importPercent += 0.4;
				chrome.runtime.sendMessage( {
					sender: MESSAGE_NAMESPACE,
					stepId: 'imported-' + data.id,
					stepText:
						'Imported ' +
						( data.title.rendered ||
							data.excerpt?.rendered
								.replace( /<[^>]+/g, '' )
								.substring( 0, 20 ) + '...' ),
					stepCssClass: 'completed',
					percent: Math.floor( importPercent ),
					code,
				} );
			}
		} while ( page++ < total );
	}
	chrome.runtime.sendMessage( {
		sender: MESSAGE_NAMESPACE,
		percent: 100,
	} );
};
let importPercent = 1;

const insertSingleViaWpRestApi = async ( id ) => {
	const url = `/wp-json/wp/v2/${ id }`;
	const response = await fetch( url );
	const data = await response.json();

	const code = wpInsertPost( {
		ID: data.id,
		post_title: data.title.rendered,
		post_content: data.content.rendered,
		post_date: data.date,
		post_type: data.type,
	} );
	chrome.runtime.sendMessage( {
		sender: MESSAGE_NAMESPACE,
		stepId: 'imported-post',
		stepText:
			'Imported ' +
			( data.title.rendered ||
				data.excerpt?.rendered
					.replace( /<[^>]+/g, '' )
					.substring( 0, 20 ) + '...' ),
		stepCssClass: 'completed',
		percent: ++importPercent,
		code,
	} );
};

const setWpSiteInfo = async () => {
	const response = await fetch( `/wp-json/` );
	const data = await response.json();
	chrome.runtime.sendMessage( {
		sender: MESSAGE_NAMESPACE,
		siteTitle: data.name,
		code:
			"<?php require_once 'wordpress/wp-load.php'; update_option( 'blogname', '" +
			data.name.replace( /'/g, "\\'" ) +
			"' );",
	} );
};

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
			if ( isWordPress() ) {
				chrome.runtime.sendMessage( {
					sender: MESSAGE_NAMESPACE,
					stepId: 'detecting',
					stepText: 'Detected WordPress!',
					stepCssClass: 'completed',
					percent: ++importPercent,
				} );
				setWpSiteInfo();
				insertViaWpRestApi();
				// insertSingleViaWpRestApi( isWordPress() );
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

// Constants
import { findExtractors } from './extractor/registry';

const MESSAGE_NAMESPACE = 'TRY_WORDPRESS';

const extractors = findExtractors( document );
if ( extractors.length === 0 ) {
	throw new Error( 'No extractor was found' );
} else if ( extractors.length > 1 ) {
	throw new Error( 'Multiple extractors were found' );
}

const extractor = extractors[ 0 ];
console.log( `Found extractor ${ extractor.meta().slug }` );

const result = extractor.extract( document );
console.log( result );

const wpInsertPost = ( data: any ) => {
	data.post_status = 'publish';
	let code = "<?php require_once 'wordpress/wp-load.php';\n";
	code += 'echo wp_insert_post(\n';
	code += '[\n';
	for ( const key in data ) {
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
	const postTypes = {
		post: '/wp-json/wp/v2/posts',
		// 'page': '/wp-json/wp/v2/pages',
	};
	type key = keyof typeof postTypes;

	for ( const postType in postTypes ) {
		console.log( postTypes[ postType as key ] );
		let page = 1,
			total = 1;
		do {
			const response = await fetch(
				postTypes[ postType as key ] + '?page=' + page
			);
			total = Math.min(
				10,
				parseInt( response.headers.get( 'X-WP-Totalpages' ) )
			);
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

/*
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
*/

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

		sendResponse( { received: true } );
	}
);

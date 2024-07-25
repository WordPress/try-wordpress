
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

export const isWordPress = () => {
	const post = document.querySelector( 'article.post' );
	if ( post ) {
		// get the id from the css class post-<id>
		const id = post.className.match( /post-(\d+)/ );
		return 'posts/' + id[1];
	}
	const page = document.querySelector( 'article.page' );
	if ( page ) {
		// get the id from the css class post-<id>
		const id = page.className.match( /post-(\d+)/ );
		return 'pages/' + id[1];
	}
	return false;
};

export const insertViaWpRestApi = async () => {
	const post_types = {
		'post': '/wp-json/wp/v2/posts',
		// 'page': '/wp-json/wp/v2/pages',
	};
	for ( const post_type in post_types ) {
		console.log( post_types[ post_type ] );
		let page = 1, total = 1;
		do {
			const response = await fetch( post_types[ post_type ] + '?page=' + page );
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
				importPercent += .4;
				chrome.runtime.sendMessage( {
					sender: MESSAGE_NAMESPACE,
					stepId: 'imported-' + data.id,
					stepText: 'Imported ' + ( data.title.rendered || data.excerpt?.rendered.replace( /<[^>]+/g, '' ).substring( 0, 20 ) + '...' ),
					stepCssClass: 'completed',
					percent: Math.floor( importPercent ),
					code
				} );
			}
		} while ( page++ < total );
	}
	chrome.runtime.sendMessage( {
		sender: MESSAGE_NAMESPACE,
		percent: 100
	} );
}

export const insertSingleViaWpRestApi = async ( id ) => {
	const url = `/wp-json/wp/v2/${id}`;
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
		stepText: 'Imported ' + ( data.title.rendered || data.excerpt?.rendered.replace( /<[^>]+/g, '' ).substring( 0, 20 ) + '...' ),
		stepCssClass: 'completed',
		percent: ++importPercent,
		code
	} );
};

export const setWpSiteInfo = async () => {
	const response = await fetch( `/wp-json/` );
	const data = await response.json();
	chrome.runtime.sendMessage( {
		sender: MESSAGE_NAMESPACE,
		siteTitle: data.name,
		code: "<?php require_once 'wordpress/wp-load.php'; update_option( 'blogname', '" + data.name.replace(/'/g, "\\'" ) + "' );"
	} );
};

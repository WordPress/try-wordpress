const MESSAGE_NAMESPACE = 'TRY_WORDPRESS';
document.getElementById('import-current-page').addEventListener('click', function( e ) {
	e.preventDefault();
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
				import: true
			}, function( response ) {
				// console.log( response, chrome.runtime.lastError );
				if ( response && response.code ) {
					document.getElementById('wp').contentWindow.postMessage( { type: 'php-request', code: response.code }, '*' );
				}
			} );
		}
	);
	return false;
});

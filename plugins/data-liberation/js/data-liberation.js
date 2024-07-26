if ( document.getElementById( 'data-liberation-import' ) ) {
	document.getElementById( 'data-liberation-import' ).addEventListener( 'click', function() {
		const progressContainer = document.getElementById( 'progress-container' );
		progressContainer.style.display = 'block';

		const progressBar = document.getElementById( 'progress-bar' );
		const progressText = document.getElementById( 'progress-text' );
		progressBar.style.width = '0%';
		progressText.textContent = 'Progress: 0%';

		window.parent.postMessage({
				type: 'data-liberation-message',
				data: {
					'action': 'start-import'
				}
			}, '*' );

		window.addEventListener( 'message', function( event ) {
			// if (event.origin !== window.location.origin) return; // Ignore messages from different origins
			if ( ! event.data ) {
				return;
			}

			if ( typeof event.data.total !== 'undefined' && typeof event.data.percent !== 'undefined' ) {
				const total = event.data.total;
				const percent = event.data.percent;

				// Update progress bar and text
				progressBar.style.width = percent + '%';
				progressText.textContent = 'Progress: ' + percent + '% out of ' + total + '%';

				// Optionally hide progress when complete
				if ( percent >= 100 ) {
					progressText.textContent = 'Import Complete!';
				}
			}
		});
	} );

	window.addEventListener( 'message', function( event ) {
		// if (event.origin !== window.location.origin) return; // Ignore messages from different origins
		if ( ! event.data ) {
			return;
		}

		if ( typeof event.data.stepId !== 'undefined' ) {
			let stepElement = document.getElementById( 'step-' + event.data.stepId );
			if ( ! stepElement ) {
				stepElement = document.createElement( 'li' );
				stepElement.id = 'step-' + event.data.stepId;
				document.getElementById( 'todo-list' ).appendChild( stepElement );
			}
			if ( typeof event.data.stepText !== 'undefined' ) {
				stepElement.textContent = event.data.stepText;
			}
			if ( typeof event.data.stepCssClass !== 'undefined' ) {
				stepElement.className = event.data.stepCssClass;
			}
		}

		if ( typeof event.data.removeStepId !== 'undefined' ) {
			let stepElement = document.getElementById( 'step-' + event.data.removeStepId );
			if ( stepElement ) {
				stepElement.parentNode.removeChild( stepElement );
			}
		}

		if ( typeof event.data.siteTitle !== 'undefined' ) {
			document.getElementById( 'site-title' ).value = event.data.siteTitle;
		}
	});
}

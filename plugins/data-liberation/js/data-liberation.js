if ( document.getElementById( 'data-liberation-import' ) ) {
	document.getElementById( 'data-liberation-import' ).addEventListener( 'click', function() {
		const progressContainer = document.getElementById( 'progress-container' );
		progressContainer.style.display = 'block';

		const progressBar = document.getElementById( 'progress-bar' );
		const progressText = document.getElementById( 'progress-text' );
		progressBar.style.width = '0%';
		progressText.textContent = 'Progress: 0%';

		window.parent.postMessage({
				type: 'relay',
				data: {
					type: 'data-liberation-message',
					action: 'start-import'
				}
			}, '*' );

		window.addEventListener( 'message', function( event ) {
			console.log( event );
			if ( typeof event.data !== 'object' || event.data.type !== 'relay' ) {
				return;
			}
			const data = event.data;

			if ( typeof data.total !== 'undefined' && typeof data.percent !== 'undefined' ) {
				const total = data.total;
				const percent = data.percent;

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
		console.log( event );
		if ( typeof event.data !== 'object' || event.data.type !== 'relay' ) {
			return;
		}
		const data = event.data;

		if ( typeof data.stepId !== 'undefined' ) {
			let stepElement = document.getElementById( 'step-' + data.stepId );
			if ( ! stepElement ) {
				stepElement = document.createElement( 'li' );
				stepElement.id = 'step-' + data.stepId;
				document.getElementById( 'todo-list' ).appendChild( stepElement );
			}
			if ( typeof data.stepText !== 'undefined' ) {
				stepElement.textContent = data.stepText;
			}
			if ( typeof data.stepCssClass !== 'undefined' ) {
				stepElement.className = data.stepCssClass;
			}
		}

		if ( typeof data.removeStepId !== 'undefined' ) {
			let stepElement = document.getElementById( 'step-' + data.removeStepId );
			if ( stepElement ) {
				stepElement.parentNode.removeChild( stepElement );
			}
		}

		if ( typeof data.siteTitle !== 'undefined' ) {
			document.getElementById( 'site-title' ).value = event.data.siteTitle;
		}
	});
}

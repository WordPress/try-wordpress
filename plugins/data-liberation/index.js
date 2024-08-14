if ( document.getElementById( 'data-liberation-import' ) ) {
	document
		.getElementById( 'data-liberation-import' )
		.addEventListener( 'click', function () {
			const progressContainer =
				document.getElementById( 'progress-container' );
			progressContainer.style.display = 'block';

			const progressBar = document.getElementById( 'progress-bar' );
			const progressText = document.getElementById( 'progress-text' );
			progressBar.style.width = '1%';
			progressText.textContent = '1%';

			window.parent.postMessage(
				{
					type: 'relay',
					data: {
						type: 'data-liberation-message',
						action: 'start-import',
					},
				},
				'*'
			);

			window.addEventListener( 'message', function ( event ) {
				console.log( event );
				if (
					typeof event.data !== 'object' ||
					event.data.type !== 'relay'
				) {
					return;
				}
				const data = event.data.data;

				if ( typeof data.percent !== 'undefined' ) {
					const percent = data.percent;
					if ( data.percent < parseInt( progressBar.style.width ) ) {
						return;
					}

					progressBar.style.width = percent + '%';
					progressText.textContent = percent + '%';

					if ( percent >= 100 ) {
						progressBar.className = 'done';
						progressText.textContent = 'Import Complete!';
					}
				}
			} );
		} );

	window.addEventListener( 'message', function ( event ) {
		console.log( event );
		if ( typeof event.data !== 'object' || event.data.type !== 'relay' ) {
			return;
		}
		const data = event.data.data;
		console.log( data );
		if ( typeof data.siteTitle !== 'undefined' ) {
			document.getElementById( 'site-title' ).value = data.siteTitle;
		}

		const todoList = document.getElementById( 'todo-list' );
		if ( ! todoList ) {
			return;
		}

		if ( typeof data.stepId !== 'undefined' ) {
			let stepElement = document.getElementById( 'step-' + data.stepId );
			if ( ! stepElement ) {
				stepElement = document.createElement( 'li' );
				stepElement.id = 'step-' + data.stepId;
				if ( todoList.firstChild ) {
					todoList.insertBefore( stepElement, todoList.firstChild );
				} else {
					todoList.appendChild( stepElement );
				}
			}
			if ( typeof data.stepText !== 'undefined' ) {
				stepElement.textContent = data.stepText;
			}
			if ( typeof data.stepCssClass !== 'undefined' ) {
				stepElement.className = data.stepCssClass;
			}
		}

		if ( typeof data.removeStepId !== 'undefined' ) {
			const stepElement = document.getElementById(
				'step-' + data.removeStepId
			);
			if ( stepElement ) {
				stepElement.parentNode.removeChild( stepElement );
			}
		}
	} );
}

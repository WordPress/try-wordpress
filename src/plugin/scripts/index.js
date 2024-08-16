import { EventBus } from '../../shared/event-bus';

const progressContainer = document.getElementById( 'progress-container' );
const progressBar = document.getElementById( 'progress-bar' );
const progressText = document.getElementById( 'progress-text' );

const startImportButton = document.getElementById( 'try-wordpress-import' );
if ( startImportButton ) {
	const eventBus = new EventBus( { targetWindow: window.parent } );
	// TODO.
	eventBus.addListener( 'foo', () => {} );

	window.addEventListener( 'message', handleStartImportResponse );
	window.addEventListener( 'message', handleMessage );
	startImportButton.addEventListener( 'click', startImport );
}

function startImport() {
	progressContainer.style.display = 'block';
	progressBar.style.width = '1%';
	progressText.textContent = '1%';

	window.parent.postMessage(
		{
			type: 'relay',
			data: {
				type: 'try-wordpress-message',
				action: 'start-import',
			},
		},
		'*'
	);
}

function handleStartImportResponse( event ) {
	if ( typeof event.data !== 'object' || event.data.type !== 'relay' ) {
		return;
	}
	const data = event.data.data;
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
}

function handleMessage( event ) {
	if ( typeof event.data !== 'object' || event.data.type !== 'relay' ) {
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
}

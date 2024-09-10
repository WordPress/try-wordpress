import { Actions, Message, Namespace } from '@/api/ContentApi';

browser.runtime.onMessage.addListener(
	( message: Message, sender, sendResponse ) => {
		if ( message.namespace !== Namespace ) {
			return;
		}

		switch ( message.action ) {
			case Actions.EnableHighlighting:
				document.body.addEventListener( 'mouseover', onMouseOver );
				document.body.addEventListener( 'mouseout', onMouseOut );
				document.body.addEventListener( 'click', onClick );
				break;
			case Actions.DisableHighlighting:
				document.body.removeEventListener( 'mouseover', onMouseOver );
				document.body.removeEventListener( 'mouseout', onMouseOut );
				document.body.removeEventListener( 'click', onClick );
				break;
			default:
				console.error( `Unknown action: ${ message.action }` );
				break;
		}
	}
);

function onClick( event: MouseEvent ) {
	event.preventDefault();
}

function onMouseOver( event: MouseEvent ) {
	const element = event.target as HTMLElement | null;
	if ( ! element ) {
		return;
	}
	element.style.outline = '1px solid blue';
	toggleCursorStyle();
}

function onMouseOut( event: MouseEvent ) {
	const element = event.target as HTMLElement | null;
	if ( ! element ) {
		return;
	}
	element.style.outline = '';
	toggleCursorStyle();
}

function toggleCursorStyle() {
	const styleId = 'hover-highlighter-style';
	let style = document.getElementById( styleId );
	if ( style ) {
		// If the style element exists, remove it
		style.remove();
	} else {
		// If the style element does not exist, create and inject it
		style = document.createElement( 'style' );
		style.id = styleId;
		style.textContent = `
		*:hover {
			cursor: crosshair !important;
		}
	  `;
		document.head.append( style );
	}
}

import { Message } from '@/bus/Message';
import { ContentBus } from '@/bus/ContentBus';
import { AppBus } from '@/bus/AppBus';

let currentElement: HTMLElement | null = null;

ContentBus.listen( ( message: Message, sendResponse: any ) => {
	switch ( message.action ) {
		case ContentBus.actions.EnableHighlighting:
			document.body.addEventListener( 'mouseover', onMouseOver );
			document.body.addEventListener( 'mouseout', onMouseOut );
			document.body.addEventListener( 'click', onClick );
			enableHighlightingCursor();
			break;
		case ContentBus.actions.DisableHighlighting:
			document.body.removeEventListener( 'mouseover', onMouseOver );
			document.body.removeEventListener( 'mouseout', onMouseOut );
			document.body.removeEventListener( 'click', onClick );
			disableHighlightingCursor();
			removeStyle();
			break;
		case ContentBus.actions.GetCurrentUrl:
			sendResponse( document.documentURI );
			break;
		default:
			console.error( `Unknown action: ${ message.action }` );
			break;
	}
} );

function onClick( event: MouseEvent ) {
	event.preventDefault();
	const element = event.target as HTMLElement;
	if ( ! element ) {
		return;
	}
	const clone = element.cloneNode( true ) as HTMLElement;
	clone.style.outline = '';
	let content = clone.outerHTML.trim();
	content = content.replaceAll( ' style=""', '' );
	void AppBus.elementClicked( content );
}

function onMouseOver( event: MouseEvent ) {
	const element = event.target as HTMLElement | null;
	if ( ! element ) {
		return;
	}
	currentElement = element;
	currentElement.style.outline = '1px solid blue';
}

function onMouseOut( event: MouseEvent ) {
	const element = event.target as HTMLElement | null;
	if ( ! element ) {
		return;
	}
	removeStyle();
	currentElement = null;
}

function removeStyle() {
	if ( ! currentElement ) {
		return;
	}
	currentElement.style.outline = '';
}

const cursorStyleId = 'hover-highlighter-style';

function enableHighlightingCursor() {
	let style = document.getElementById( cursorStyleId );
	if ( style ) {
		// The highlighting cursor is already enabled.
		return;
	}
	style = document.createElement( 'style' );
	style.id = cursorStyleId;
	style.textContent = '* { cursor: crosshair !important; }';
	document.head.append( style );
}

function disableHighlightingCursor() {
	const style = document.getElementById( cursorStyleId );
	if ( style ) {
		style.remove();
	}
}

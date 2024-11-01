import { AppBus } from '@/bus/AppBus';
import { startListening } from '@/bus/Bus';
import { CommandTypes } from '@/bus/Command';

let currentElement: HTMLElement | null = null;

startListening( CommandTypes.GetCurrentPageInfo, ( event ) => {
	event.sendResponse( {
		url: document.documentURI,
		title: document.title,
	} );
} );

startListening( CommandTypes.NavigateTo, ( event ) => {
	const url = ( event.event.payload as any ).url;
	if ( document.location.href !== url ) {
		document.location.href = url;
	}
} );

startListening( CommandTypes.EnableHighlighting, () => {
	document.body.addEventListener( 'mouseover', onMouseOver );
	document.body.addEventListener( 'mouseout', onMouseOut );
	document.body.addEventListener( 'click', onClick );
	enableHighlightingCursor();
} );

startListening( CommandTypes.DisableHighlighting, () => {
	document.body.removeEventListener( 'mouseover', onMouseOver );
	document.body.removeEventListener( 'mouseout', onMouseOut );
	document.body.removeEventListener( 'click', onClick );
	disableHighlightingCursor();
	removeStyle();
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

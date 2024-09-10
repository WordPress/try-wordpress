import { Listener, Message, Namespace } from '@/bus/Message';

enum Actions {
	EnableHighlighting = 1,
	DisableHighlighting,
}

export const ContentBus = {
	namespace: `${ Namespace }_CONTENT`,
	actions: Actions,
	listen,
	stopListening,
	enableHighlighting,
	disableHighlighting,
};

let listener: Listener;

function listen( list: Listener ) {
	stopListening();
	listener = ( message: Message ) => {
		if ( message.namespace !== ContentBus.namespace ) {
			return;
		}
		list( message );
	};
	browser.runtime.onMessage.addListener( listener );
}

function stopListening() {
	if ( listener ) {
		browser.runtime.onMessage.removeListener( listener );
	}
}

async function enableHighlighting(): Promise< void > {
	return sendMessageToContent( {
		action: Actions.EnableHighlighting,
		payload: {},
	} );
}

async function disableHighlighting(): Promise< void > {
	return sendMessageToContent( {
		action: Actions.DisableHighlighting,
		payload: {},
	} );
}

async function sendMessageToContent(
	message: Omit< Message, 'namespace' >
): Promise< void > {
	const currentTabId = await getCurrentTabId();
	if ( ! currentTabId ) {
		throw Error( 'current tab not found' );
	}
	const messageWithNamespace: Message = {
		namespace: ContentBus.namespace,
		action: message.action,
		payload: message.payload,
	};
	await browser.tabs.sendMessage( currentTabId, messageWithNamespace );
}

async function getCurrentTabId(): Promise< number | undefined > {
	const tabs = await browser.tabs.query( {
		currentWindow: true,
		active: true,
	} );
	if ( tabs.length !== 1 ) {
		return;
	}
	return tabs[ 0 ]?.id;
}

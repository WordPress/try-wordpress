import { Listener, Message, Namespace } from '@/bus/Message';
import MessageSender = browser.runtime.MessageSender;

enum Actions {
	EnableHighlighting = 1,
	DisableHighlighting,
	GetCurrentPageInfo,
	NavigateTo,
}

interface CurrentPageInfo {
	url: string;
	title: string;
}
async function getCurrentPageInfo(): Promise< CurrentPageInfo > {
	return sendMessageToContent( {
		action: Actions.GetCurrentPageInfo,
		payload: {},
	} );
}

async function navigateTo( url: string ): Promise< void > {
	return sendMessageToContent( {
		action: Actions.NavigateTo,
		payload: { url },
	} );
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

export const ContentBus = {
	namespace: `${ Namespace }_CONTENT`,
	actions: Actions,
	listen,
	stopListening,
	enableHighlighting,
	disableHighlighting,
	getCurrentPageInfo,
	navigateTo,
};

let listener: (
	message: Message,
	sender: MessageSender,
	sendResponse: ( response?: any ) => void
) => void;

function listen( list: Listener ) {
	stopListening();
	listener = (
		message: Message,
		sender: MessageSender,
		sendResponse: ( response?: any ) => void
	) => {
		if ( message.namespace !== ContentBus.namespace ) {
			return;
		}
		list( message, sendResponse );
	};
	browser.runtime.onMessage.addListener( listener );
}

function stopListening() {
	if ( listener ) {
		browser.runtime.onMessage.removeListener( listener );
	}
}

async function sendMessageToContent(
	message: Omit< Message, 'namespace' >
): Promise< any | void > {
	const currentTabId = await getCurrentTabId();
	if ( ! currentTabId ) {
		throw Error( 'current tab not found' );
	}
	const messageWithNamespace: Message = {
		namespace: ContentBus.namespace,
		action: message.action,
		payload: message.payload,
	};
	return browser.tabs.sendMessage( currentTabId, messageWithNamespace );
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

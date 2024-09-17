import { Listener, Message, Namespace } from '@/bus/Message';
import MessageSender = browser.runtime.MessageSender;

enum Actions {
	ElementClicked = 1,
}

async function elementClicked( content: string ): Promise< void > {
	return sendMessageToApp( {
		action: Actions.ElementClicked,
		payload: { content },
	} );
}

export const AppBus = {
	namespace: `${ Namespace }_APP`,
	actions: Actions,
	listen,
	stopListening,
	elementClicked,
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
		if ( message.namespace !== AppBus.namespace ) {
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
async function sendMessageToApp(
	message: Omit< Message, 'namespace' >
): Promise< any | void > {
	const messageWithNamespace: Message = {
		namespace: AppBus.namespace,
		action: message.action,
		payload: message.payload,
	};
	return browser.runtime.sendMessage( messageWithNamespace );
}

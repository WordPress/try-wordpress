import { Listener, Message, Namespace } from '@/bus/Message';

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

let listener: Listener;

function listen( list: Listener ) {
	stopListening();
	listener = ( message: Message ) => {
		if ( message.namespace !== AppBus.namespace ) {
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
async function sendMessageToApp(
	message: Omit< Message, 'namespace' >
): Promise< void > {
	const messageWithNamespace: Message = {
		namespace: AppBus.namespace,
		action: message.action,
		payload: message.payload,
	};
	await browser.runtime.sendMessage( messageWithNamespace );
}

import { Actions, Message, Namespace } from '@/api/ContentApi';

browser.runtime.onMessage.addListener(
	( message: Message, sender, sendResponse ) => {
		if ( message.namespace !== Namespace ) {
			return;
		}

		switch ( message.action ) {
			case Actions.EnableHighlighting:
				console.log( message.action );
				break;
			case Actions.DisableHighlighting:
				console.log( message.action );
				break;
			default:
				console.error( `Unknown action: ${ message.action }` );
				break;
		}
	}
);

export const Namespace = 'TRY_WORDPRESS';

export enum Actions {
	EnableHighlighting = 1,
	DisableHighlighting,
	ImportPost,
}

export interface Message {
	namespace: string;
	action: number;
	payload?: object;
}

export class ContentApi {
	async enableHighlighting(): Promise< void > {
		return this.sendMessageToContent( {
			action: Actions.EnableHighlighting,
		} );
	}

	async disableHighlighting(): Promise< void > {
		return this.sendMessageToContent( {
			action: Actions.DisableHighlighting,
		} );
	}

	async importPost(): Promise< void > {
		return this.sendMessageToApp( { action: Actions.ImportPost } );
	}

	private async sendMessageToApp(
		message: Omit< Message, 'namespace' >
	): Promise< void > {
		const messageWithNamespace: Message = {
			namespace: Namespace,
			action: message.action,
			payload: message.payload,
		};
		await browser.runtime.sendMessage( messageWithNamespace );
	}

	private async sendMessageToContent(
		message: Omit< Message, 'namespace' >
	): Promise< void > {
		const currentTabId = await this.getCurrentTabId();
		if ( ! currentTabId ) {
			throw Error( 'current tab not found' );
		}
		const messageWithNamespace: Message = {
			namespace: Namespace,
			action: message.action,
			payload: message.payload,
		};
		await browser.tabs.sendMessage( currentTabId, messageWithNamespace );
	}

	private async getCurrentTabId(): Promise< number | undefined > {
		const tabs = await browser.tabs.query( {
			currentWindow: true,
			active: true,
		} );
		if ( tabs.length !== 1 ) {
			return;
		}
		return tabs[ 0 ]?.id;
	}
}

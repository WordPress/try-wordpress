import { Namespace } from '@/bus/Bus';

export enum CommandTypes {
	GetCurrentPageInfo = 'GetCurrentPageInfo',
	NavigateTo = 'NavigateTo',
	EnableHighlighting = 'EnableHighlighting',
	DisableHighlighting = 'DisableHighlighting',
}

export interface CurrentPageInfo {
	url: string;
	title: string;
}

export type CommandType = `${ CommandTypes }`;

export interface Command {
	type: CommandType;
	payload: object;
}

export async function sendCommandToContent( command: Command ): Promise< any > {
	const currentTabId = await getCurrentTabId();
	if ( ! currentTabId ) {
		throw Error( 'current tab not found' );
	}
	return browser.tabs.sendMessage( currentTabId, {
		namespace: Namespace,
		type: command.type,
		payload: command.payload,
	} );
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

export class Settings {
	static async setCurrentPath( path: string ): Promise< void > {
		return browser.storage.local.set( { currentPath: path } );
	}

	static async currentPath(): Promise< string | null > {
		const values = await browser.storage.local.get( 'currentPath' );
		if ( ! values ) {
			return null;
		}
		return values.currentPath as string;
	}
}

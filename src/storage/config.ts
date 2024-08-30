export interface Config {
	currentPath: string;
}

export async function setConfig( value: Config ): Promise< void > {
	const config = await getConfig();
	let key: keyof Config;
	for ( key in value ) {
		config[ key ] = value[ key ];
	}
	return browser.storage.local.set( { config: config } );
}

export async function getConfig(): Promise< Config > {
	const values = await browser.storage.local.get( 'config' );
	if ( ! values || ! values.config ) {
		return { currentPath: '/' };
	}
	return values.config as Config;
}

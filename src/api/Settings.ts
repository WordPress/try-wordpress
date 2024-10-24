import { ApiClient } from '@/api/ApiClient';
import { SiteSettings } from '@/model/SiteSettings';
import { ApiSettings } from '@/api/ApiTypes';

interface UpdateBody {
	title?: string;
}

export class SettingsApi {
	// eslint-disable-next-line no-useless-constructor
	constructor( private readonly client: ApiClient ) {}

	async update( body: UpdateBody ): Promise< SiteSettings > {
		const actualBody: any = {};
		if ( body.title ) {
			actualBody.title = body.title;
		}
		if ( Object.keys( actualBody ).length === 0 ) {
			throw Error( 'attempting to update zero fields' );
		}
		const response = ( await this.client.post(
			`/settings`,
			actualBody
		) ) as ApiSettings;
		return makeSiteSettingsFromApiResponse( response );
	}
}

function makeSiteSettingsFromApiResponse(
	response: ApiSettings
): SiteSettings {
	return {
		title: response.title,
	};
}

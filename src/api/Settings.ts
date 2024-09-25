/* eslint-disable camelcase */
import { WP_REST_API_Settings } from 'wp-types';
import { SiteSettings } from '@/model/SiteSettings';
import { ApiClient } from '@/api/ApiClient';
export interface ApiSettings extends WP_REST_API_Settings {}
/* eslint-enable camelcase */

interface UpdateBody {
	title?: string;
}

export class SettingsApi {
	// eslint-disable-next-line no-useless-constructor
	constructor( private readonly client: ApiClient ) {}

	async update( body: UpdateBody ): Promise< SiteSettings > {
		const response = ( await this.client.post(
			`/settings`,
			makeUpdateRequestBody( body )
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

function makeUpdateRequestBody( body: UpdateBody ): object {
	const actualBody: any = {};
	if ( body.title ) {
		actualBody.title = body.title;
	}
	if ( Object.keys( actualBody ).length === 0 ) {
		throw Error( 'attempting to update zero fields' );
	}
	return {
		title: body.title,
	};
}

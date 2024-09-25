/* eslint-disable camelcase */
import { WP_REST_API_Settings } from 'wp-types';
import { SiteSettings } from '@/model/SiteSettings';
export interface ApiSettings extends WP_REST_API_Settings {}
/* eslint-enable camelcase */

export interface UpdateSettingsBody {
	title?: string;
}

export function apiResponseToSiteSettings(
	response: ApiSettings
): SiteSettings {
	return {
		title: response.title,
	};
}

export function siteSettingsUpdateToApiRequestBody(
	body: UpdateSettingsBody
): object {
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

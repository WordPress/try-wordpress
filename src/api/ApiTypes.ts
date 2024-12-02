/* eslint-disable camelcase */
import { WP_REST_API_Settings, WP_REST_API_User } from 'wp-types';

export type ApiPost = {
	id: number;
	transformedId: number;
	previewUrl: string;
	sourceUrl: string;
	rawDate?: string;
	parsedDate?: string;
	rawTitle?: string;
	parsedTitle?: string;
	rawContent?: string;
	parsedContent?: string;
};

export type ApiPage = ApiPost;

export type ApiUser = WP_REST_API_User;

export type ApiSettings = WP_REST_API_Settings;
/* eslint-enable camelcase */

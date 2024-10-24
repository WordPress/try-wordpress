/* eslint-disable camelcase */
import {
	WP_REST_API_Post,
	WP_REST_API_Settings,
	WP_REST_API_User,
} from 'wp-types';

export type ApiPost = WP_REST_API_Post & {
	transformed_id: number;
};

export type ApiUser = WP_REST_API_User;

export type ApiSettings = WP_REST_API_Settings;
/* eslint-enable camelcase */

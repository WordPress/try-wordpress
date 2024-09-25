/* eslint-disable camelcase */
import { WP_REST_API_User } from 'wp-types';
export interface ApiUser extends WP_REST_API_User {}
/* eslint-enable camelcase */

import { ApiClient } from '@/api/ApiClient';

interface CreateBody {
	username: string;
	email: string;
	password: string;
	role?: string; // default roles: administrator, editor, author, subscriber (default)
	firstname?: string;
	lastname?: string;
}

export class UsersApi {
	// eslint-disable-next-line no-useless-constructor
	constructor( private readonly client: ApiClient ) {}

	async create( body: CreateBody ): Promise< ApiUser > {
		const actualBody: any = {
			username: body.username,
			email: body.email,
			password: body.password,
		};
		if ( body.role ) {
			actualBody.roles = [ body.role ];
		}
		if ( body.firstname ) {
			actualBody.first_name = body.firstname;
		}
		if ( body.lastname ) {
			actualBody.last_name = body.lastname;
		}
		return ( await this.client.post( `/users`, actualBody ) ) as ApiUser;
	}
}

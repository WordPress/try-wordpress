/* eslint-disable react/no-is-mounted */
import { PlaygroundClient } from '@wp-playground/client';
import { User } from '@/api/User';
import { PostsApi } from '@/api/post';
import { SettingsApi } from '@/api/settings';

export interface CreateUserBody {
	username: string;
	email: string;
	password: string;
	role?: string; // default roles: administrator, editor, author, subscriber (default)
	firstname?: string;
	lastname?: string;
}

export class ApiClient {
	private readonly playgroundClient: PlaygroundClient;
	private readonly _siteUrl: string;
	private readonly _posts: PostsApi;
	private readonly _settings: SettingsApi;

	constructor( playgroundClient: PlaygroundClient, siteUrl: string ) {
		this.playgroundClient = playgroundClient;
		this._siteUrl = siteUrl;
		this._posts = new PostsApi( this );
		this._settings = new SettingsApi( this );
	}

	get siteUrl(): string {
		return this._siteUrl;
	}

	get posts(): PostsApi {
		return this._posts;
	}

	get settings(): SettingsApi {
		return this._settings;
	}

	async createUser( body: CreateUserBody ): Promise< User > {
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
		return ( await this.post( `/users`, actualBody ) ) as User;
	}

	async get( route: string ): Promise< object > {
		const response = await this.playgroundClient.request( {
			url: `/index.php?rest_route=/wp/v2${ route }`,
			method: 'GET',
		} );
		if ( response.httpStatusCode !== 200 ) {
			console.error( response );
			throw Error( response.json.message );
		}
		return response.json;
	}

	async post( route: string, body: object ): Promise< object > {
		const response = await this.playgroundClient.request( {
			url: `/index.php?rest_route=/wp/v2${ route }`,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify( body ),
		} );

		if ( response.httpStatusCode < 200 || response.httpStatusCode >= 300 ) {
			console.error( response );
			throw Error( response.json.message );
		}
		return response.json;
	}
}

/* eslint-enable react/no-is-mounted */

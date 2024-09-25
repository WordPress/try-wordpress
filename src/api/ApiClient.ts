/* eslint-disable react/no-is-mounted */
import { PlaygroundClient } from '@wp-playground/client';
import { User } from '@/api/User';
import {
	apiResponseToSiteSettings,
	ApiSettings,
	siteSettingsUpdateToApiRequestBody,
	UpdateSettingsBody,
} from '@/api/settings';
import {
	ApiPost,
	apiResponseToPost,
	CreatePostBody,
	postUpdateToApiRequestBody,
	UpdatePostBody,
} from '@/api/post';
import { Post } from '@/model/Post';
import { SiteSettings } from '@/model/SiteSettings';

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

	constructor( playgroundClient: PlaygroundClient, siteUrl: string ) {
		this.playgroundClient = playgroundClient;
		this._siteUrl = siteUrl;
	}

	get siteUrl(): string {
		return this._siteUrl;
	}

	async createPost( body: CreatePostBody ): Promise< Post > {
		const response = ( await this.post( '/liberated_posts', {
			meta: {
				guid: body.guid,
			},
		} ) ) as ApiPost;
		return apiResponseToPost( response );
	}

	async updatePost( id: number, body: UpdatePostBody ): Promise< Post > {
		const response = ( await this.post(
			`/liberated_posts/${ id }`,
			postUpdateToApiRequestBody( body )
		) ) as ApiPost;
		return apiResponseToPost( response );
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async getPostByGuid( guid: string ): Promise< Post | null > {
		return null;
	}

	async updateSiteSettings(
		body: UpdateSettingsBody
	): Promise< SiteSettings > {
		const response = ( await this.post(
			`/settings`,
			siteSettingsUpdateToApiRequestBody( body )
		) ) as ApiSettings;
		return apiResponseToSiteSettings( response );
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

	private async get( route: string ): Promise< object > {
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

	private async post( route: string, body: object ): Promise< object > {
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

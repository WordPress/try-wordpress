/* eslint-disable react/no-is-mounted */

import { PlaygroundClient } from '@wp-playground/client';
import { ApiPost } from '@/api/ApiPost';
import { ApiSettings } from '@/api/ApiSettings';
import { User } from '@/api/User';
import { PostContent, PostDate, PostTitle } from '@/parser/post';

export interface CreatePostBody {
	guid: string;
}

export interface CreateUserBody {
	username: string;
	email: string;
	password: string;
	role?: string; // default roles: administrator, editor, author, subscriber (default)
	firstname?: string;
	lastname?: string;
}

export interface UpdatePostBody {
	date?: PostDate;
	title?: PostTitle;
	content?: PostContent;
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

	async createPost( body: CreatePostBody ): Promise< ApiPost > {
		return ( await this.post( '/liberated_posts', {
			meta: {
				guid: body.guid,
			},
		} ) ) as ApiPost;
	}

	async updatePost( id: number, body: UpdatePostBody ): Promise< ApiPost > {
		const actualBody: any = {};
		if ( body.date ) {
			actualBody.date = body.date.parsed;
		}
		if ( body.title ) {
			actualBody.title = body.title.parsed;
		}
		if ( body.content ) {
			actualBody.content = body.content.parsed;
			actualBody.meta = {
				raw_content: body.content.original,
			};
		}
		return ( await this.post(
			`/liberated_posts/${ id }`,
			actualBody
		) ) as ApiPost;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async getPostByGuid( guid: string ): Promise< ApiPost | null > {
		return null;
	}

	async updateSiteTitle( title: string ): Promise< ApiSettings > {
		return ( await this.post( `/settings`, {
			title,
		} ) ) as ApiSettings;
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

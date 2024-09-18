/* eslint-disable camelcase */
/* eslint-disable react/no-is-mounted */

import { PlaygroundClient } from '@wp-playground/client';
import { WP_REST_API_Post } from 'wp-types';

export interface Post {
	id: number;
	title: string;
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

	async createPost( data: { guid: string } ): Promise< Post > {
		const { guid } = data;
		const post = ( await this.post( '/liberated_posts', {
			meta: {
				guid,
			},
		} ) ) as WP_REST_API_Post;

		return { id: post.id, title: post.title.raw ?? '' };
	}

	async getPosts(): Promise< Post[] > {
		const response = ( await this.get( '/posts' ) ) as WP_REST_API_Post[];
		return response.map( ( post ) => {
			return {
				id: post.id,
				title: post.title.rendered,
			};
		} );
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
			body: JSON.stringify( body ),
		} );
		if ( response.httpStatusCode !== 201 ) {
			console.error( response );
			throw Error( response.json.message );
		}
		return response.json;
	}
}

/* eslint-enable camelcase */
/* eslint-enable react/no-is-mounted */

/* eslint-disable camelcase */

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

	async getPosts(): Promise< Post[] > {
		// eslint-disable-next-line react/no-is-mounted
		const response = ( await this.get(
			'/wp/v2/posts'
		) ) as WP_REST_API_Post[];

		return response.map( ( post ) => {
			return {
				id: post.id,
				title: post.title.rendered,
			};
		} );
	}

	private async get( route: string ): Promise< object > {
		const response = await this.playgroundClient.request( {
			url: `/index.php?rest_route=${ route }`,
			method: 'GET',
		} );
		if ( response.httpStatusCode !== 200 ) {
			throw Error( response.json.message );
		}
		return response.json;
	}
}

/* eslint-enable camelcase */

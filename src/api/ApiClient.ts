/* eslint-disable camelcase */

import { PlaygroundClient } from '@wp-playground/client';
import type { WP_REST_API_Posts } from 'wp-types';

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
		const response = ( await this.get(
			'/wp/v2/posts'
		) ) as WP_REST_API_Posts;

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
		return response.json;
	}
}

/* eslint-enable camelcase */

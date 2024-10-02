/* eslint-disable camelcase */
import { WP_REST_API_Post } from 'wp-types';
type ApiPost = WP_REST_API_Post;
/* eslint-enable camelcase */

import { ApiClient } from '@/api/ApiClient';
import { Post } from '@/model/content/Post';

interface PostMeta {
	guid: string;
}

export class PostsApi {
	// eslint-disable-next-line no-useless-constructor
	constructor( private readonly client: ApiClient ) {}

	async findById( id: string ): Promise< Post | null > {
		// eslint-disable-next-line react/no-is-mounted
		const posts = await this.find( { id } );
		return posts.length === 0 ? null : fromApiResponse( posts[ 0 ] );
	}

	async findByGuid( guid: string ): Promise< Post | null > {
		// eslint-disable-next-line react/no-is-mounted
		const posts = await this.find( { guid } );
		return posts.length === 0 ? null : fromApiResponse( posts[ 0 ] );
	}

	private async find(
		params: Record< string, string >
	): Promise< ApiPost[] > {
		// A liberated_post is always draft.
		params.status = 'draft';

		// TODO: For now we're querying liberated_posts but this must be changed as this call needs to retrieve
		//       any kind of post.
		return ( await this.client.get(
			`/liberated_posts`,
			params
		) ) as ApiPost[];
	}
}

function fromApiResponse( response: ApiPost ): Post {
	const meta = response.meta as unknown as PostMeta;
	return {
		type: response.type,
		guid: meta.guid,
		id: response.id,
		url: response.link,
		fields: {},
	};
}

/* eslint-disable camelcase */
import { WP_REST_API_Post } from 'wp-types';
type ApiPost = WP_REST_API_Post;
/* eslint-enable camelcase */

import { Post, PostContent, PostDate, PostTitle } from '@/model/Post';
import { ApiClient } from '@/api/ApiClient';

interface CreateBody {
	guid: string;
}

interface UpdateBody {
	date?: PostDate;
	title?: PostTitle;
	content?: PostContent;
}

interface PostMeta {
	guid: string;
	raw_title: string;
	raw_date: string;
	raw_content: string;
}

export class PostsApi {
	// eslint-disable-next-line no-useless-constructor
	constructor( private readonly client: ApiClient ) {}

	async create( body: CreateBody ): Promise< Post > {
		const response = ( await this.client.post( '/liberated_posts', {
			meta: {
				guid: body.guid,
			},
		} ) ) as ApiPost;
		return makePostFromApiResponse( response );
	}

	async update( id: number, body: UpdateBody ): Promise< Post > {
		const actualBody: any = { meta: {} };
		if ( body.date ) {
			actualBody.date = body.date.parsed;
			actualBody.meta.raw_date = body.date.original;
		}
		if ( body.title ) {
			actualBody.title = body.title.parsed;
			actualBody.meta.raw_title = body.title.original;
		}
		if ( body.content ) {
			actualBody.content = body.content.parsed;
			actualBody.meta.raw_content = body.content.original;
		}
		if ( Object.keys( actualBody ).length === 0 ) {
			throw Error( 'attempting to update zero fields' );
		}
		const response = ( await this.client.post(
			`/liberated_posts/${ id }`,
			actualBody
		) ) as ApiPost;
		return makePostFromApiResponse( response );
	}

	async getByGuid( guid: string ): Promise< Post | null > {
		const posts = ( await this.client.get( `/liberated_posts`, {
			context: 'edit',
			status: 'draft',
			guid,
		} ) ) as ApiPost[];
		return posts.length === 0
			? null
			: makePostFromApiResponse( posts[ 0 ] );
	}
}

function makePostFromApiResponse( response: ApiPost ): Post {
	const meta = response.meta as unknown as PostMeta;
	const date = new PostDate( meta.raw_date, response.date_gmt );
	const title = new PostTitle( meta.raw_title, response.title.raw ?? '' );
	const content = new PostContent(
		meta.raw_content,
		response.content.raw ?? ''
	);

	return {
		guid: meta.guid,
		id: response.id,
		url: response.link,
		date,
		content,
		title,
	};
}

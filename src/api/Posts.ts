/* eslint-disable camelcase */
import { WP_REST_API_Post } from 'wp-types';
interface ApiPost extends WP_REST_API_Post {}
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
		const response = ( await this.client.post(
			`/liberated_posts/${ id }`,
			makeUpdateRequestBody( body )
		) ) as ApiPost;
		return makePostFromApiResponse( response );
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async getByGuid( guid: string ): Promise< Post | null > {
		return null;
	}
}

function makePostFromApiResponse( response: ApiPost ): Post {
	const meta = response.meta as unknown as PostMeta;
	const date = new PostDate( response.date_gmt, meta.raw_date );
	const title = new PostTitle( response.title.raw ?? '', meta.raw_title );
	const content = new PostContent(
		response.content.raw ?? '',
		meta.raw_content
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

function makeUpdateRequestBody( body: UpdateBody ): object {
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
	return actualBody;
}

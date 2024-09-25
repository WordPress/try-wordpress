/* eslint-disable camelcase */
import { WP_REST_API_Post } from 'wp-types';
export interface ApiPost extends WP_REST_API_Post {}
/* eslint-enable camelcase */

import { Post, PostContent, PostDate, PostTitle } from '@/model/Post';

export interface CreatePostBody {
	guid: string;
}

export interface UpdatePostBody {
	date?: PostDate;
	title?: PostTitle;
	content?: PostContent;
}

export function apiResponseToPost( response: ApiPost ): Post {
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

export function postUpdateToApiRequestBody( body: UpdatePostBody ): object {
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

interface PostMeta {
	guid: string;
	raw_title: string;
	raw_date: string;
	raw_content: string;
}

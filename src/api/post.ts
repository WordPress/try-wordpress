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

interface PostMeta {
	guid: string;
	raw_title: string;
	raw_date: string;
	raw_content: string;
}

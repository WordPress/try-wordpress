/* eslint-disable camelcase */
import { WP_REST_API_Post } from 'wp-types';
type ApiPost = WP_REST_API_Post;
/* eslint-enable camelcase */

import { BlogPost } from '@/model/content/BlogPost';
import { ApiClient } from '@/api/ApiClient';
import {
	DateField,
	HtmlField,
	newDateField,
	newHtmlField,
	newTextField,
	PostType,
	TextField,
} from '@/model/content/Post';

interface CreateBody {
	guid: string;
}

interface UpdateBody {
	date?: DateField;
	title?: TextField;
	content?: HtmlField;
}

interface PostMeta {
	guid: string;
	raw_title: string;
	raw_date: string;
	raw_content: string;
}

export class BlogPostsApi {
	// eslint-disable-next-line no-useless-constructor
	constructor( private readonly client: ApiClient ) {}

	async create( body: CreateBody ): Promise< BlogPost > {
		const response = ( await this.client.post( '/liberated_data', {
			meta: {
				guid: body.guid,
			},
		} ) ) as ApiPost;
		return fromApiResponse( response );
	}

	async update( id: number, body: UpdateBody ): Promise< BlogPost > {
		const actualBody: any = {};
		if ( body.date || body.title || body.content ) {
			actualBody.meta = {};
		}
		if ( body.date ) {
			actualBody.date = body.date.value.toISOString();
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
			`/liberated_data/${ id }`,
			actualBody
		) ) as ApiPost;
		return fromApiResponse( response );
	}

	async findById( id: string ): Promise< BlogPost | null > {
		// eslint-disable-next-line react/no-is-mounted
		const posts = await this.find( { id } );
		return posts.length === 0 ? null : fromApiResponse( posts[ 0 ] );
	}

	async findByGuid( guid: string ): Promise< BlogPost | null > {
		// eslint-disable-next-line react/no-is-mounted
		const posts = await this.find( { guid } );
		return posts.length === 0 ? null : fromApiResponse( posts[ 0 ] );
	}

	private async find(
		params: Record< string, string >
	): Promise< ApiPost[] > {
		params.status = 'draft';
		// Must set context to 'edit' to have all fields in the response.
		params.context = 'edit';
		return ( await this.client.get(
			`/liberated_data`,
			params
		) ) as ApiPost[];
	}
}

function fromApiResponse( response: ApiPost ): BlogPost {
	const meta = response.meta as unknown as PostMeta;
	const date = newDateField( meta.raw_date, response.date_gmt );
	const title = newTextField( meta.raw_title, response.title.raw ?? '' );
	const content = newHtmlField(
		meta.raw_content,
		response.content.raw ?? ''
	);

	return {
		type: PostType.BlogPost,
		guid: meta.guid,
		id: response.id,
		url: response.link,
		fields: {
			date,
			content,
			title,
		},
	};
}

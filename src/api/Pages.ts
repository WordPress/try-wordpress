import { Page } from '@/model/subject/Page';
import { ApiClient } from '@/api/ApiClient';
import { SubjectType } from '@/model/subject/Subject';
import { newTextField, TextField } from '@/model/field/TextField';
import { HtmlField, newHtmlField } from '@/model/field/HtmlField';
import { ApiPost } from '@/api/ApiTypes';

interface UpdateBody {
	title?: TextField;
	content?: HtmlField;
}

interface PostMeta {
	guid: string;
	raw_title: string;
	raw_content: string;
}

export class PagesApi {
	// eslint-disable-next-line no-useless-constructor
	constructor( private readonly client: ApiClient ) {}

	async create( blogPost: Page ): Promise< Page > {
		const response = ( await this.client.post( '/liberated_data', {
			meta: {
				guid: blogPost.sourceUrl,
			},
		} ) ) as ApiPost;
		return fromApiResponse( response );
	}

	async update( id: number, body: UpdateBody ): Promise< Page > {
		const actualBody: any = {};
		if ( body.title || body.content ) {
			actualBody.meta = {};
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

	async findById( id: string ): Promise< Page | null > {
		// eslint-disable-next-line react/no-is-mounted
		const posts = await this.find( { id } );
		return posts.length === 0 ? null : fromApiResponse( posts[ 0 ] );
	}

	async findBySourceUrl( sourceUrl: string ): Promise< Page | null > {
		// eslint-disable-next-line react/no-is-mounted
		const posts = await this.find( { guid: sourceUrl } );
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

function fromApiResponse( response: ApiPost ): Page {
	const meta = response.meta as unknown as PostMeta;
	const title = newTextField( meta.raw_title, response.title.raw ?? '' );
	const content = newHtmlField(
		meta.raw_content,
		response.content.raw ?? ''
	);

	return {
		type: SubjectType.Page,
		sourceUrl: meta.guid,
		id: response.id,
		transformedId: response.transformed_id,
		title,
		content,
	};
}

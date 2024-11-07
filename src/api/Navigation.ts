import { Navigation } from '@/model/subject/Navigation';
import { ApiClient } from '@/api/ApiClient';
import { SubjectType } from '@/model/subject/Subject';
import { HtmlField, newHtmlField } from '@/model/field/HtmlField';
import { ApiPost } from '@/api/ApiTypes';

interface UpdateBody {
	content?: HtmlField;
}

interface PostMeta {
	guid: string;
	raw_content: string;
}

export class NavigationApi {
	// eslint-disable-next-line no-useless-constructor
	constructor( private readonly client: ApiClient ) {}

	async create( navigation: Navigation ): Promise< Navigation > {
		const response = ( await this.client.post( '/liberated_data_navigation', {
			meta: {
				guid: navigation.sourceUrl,
			},
		} ) ) as ApiPost;
		return fromApiResponse( response );
	}

	async update( id: number, body: UpdateBody ): Promise< Navigation > {
		const actualBody: any = {};
		if ( body.content ) {
			actualBody.meta = {};
		}
		if ( body.content ) {
			actualBody.content = body.content.parsed;
			actualBody.meta.raw_content = body.content.original;
		}
		if ( Object.keys( actualBody ).length === 0 ) {
			throw Error( 'attempting to update zero fields' );
		}
		const response = ( await this.client.post(
			`/liberated_data_navigation/${ id }`,
			actualBody
		) ) as ApiPost;
		return fromApiResponse( response );
	}

	async findById( id: string ): Promise< Navigation | null > {
		// eslint-disable-next-line react/no-is-mounted
		const posts = await this.find( { id } );
		return posts.length === 0 ? null : fromApiResponse( posts[ 0 ] );
	}

	async findBySourceUrl( sourceUrl: string ): Promise< Navigation | null > {
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
			`/liberated_data_navigation`,
			params
		) ) as ApiPost[];
	}
}

function fromApiResponse( response: ApiPost ): Navigation {
	const meta = response.meta as unknown as PostMeta;
	const content = newHtmlField(
		meta.raw_content,
		response.content.raw ?? ''
	);

	return {
		type: SubjectType.Navigation,
		sourceUrl: meta.guid,
		id: response.id,
		transformedId: response.transformed_id,
		content,
	};
}

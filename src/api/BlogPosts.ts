import { ApiClient } from '@/api/ApiClient';
import { Subject, SubjectType } from '@/model/Subject';
import { newDateField } from '@/model/field/DateField';
import { newTextField } from '@/model/field/TextField';
import { newHtmlField } from '@/model/field/HtmlField';
import { ApiPost } from '@/api/ApiTypes';

export class BlogPostsApi {
	// eslint-disable-next-line no-useless-constructor
	constructor( private readonly client: ApiClient ) {}

	async create( blogPost: Subject ): Promise< Subject > {
		const response = ( await this.client.post( '/blog-posts', {
			sourceUrl: blogPost.sourceUrl,
		} ) ) as ApiPost;
		return fromApiResponse( response );
	}

	async update( id: number, post: Subject ): Promise< Subject > {
		const response = ( await this.client.post(
			`/blog-posts/${ id }`,
			toApiRequest( post )
		) ) as ApiPost;
		return fromApiResponse( response );
	}

	async findById( id: string ): Promise< Subject | null > {
		const post = ( await this.client.get(
			'/blog-posts/' + id
		) ) as ApiPost;
		return post ? fromApiResponse( post ) : null;
	}

	async findBySourceUrl( sourceUrl: string ): Promise< Subject | null > {
		const post = ( await this.client.get(
			'/blog-posts?sourceurl=' + sourceUrl
		) ) as ApiPost;
		return post ? fromApiResponse( post ) : null;
	}
}

function fromApiResponse( response: ApiPost ): Subject {
	const date = newDateField( response.rawDate, response.parsedDate );
	const title = newTextField( response.rawTitle, response.parsedTitle ?? '' );
	const content = newHtmlField(
		response.rawContent,
		response.parsedContent ?? ''
	);

	return {
		id: response.id,
		type: SubjectType.BlogPost,
		sourceUrl: response.sourceUrl,
		transformedId: response.transformedId,
		previewUrl: response.previewUrl,
		fields: {
			title,
			date,
			content,
		},
	};
}

function toApiRequest( post: Subject ): ApiPost {
	let request: ApiPost = {
		id: post.id,
		// read-only from api perspective, so including it has no effect
		transformedId: post.transformedId,
		// update not allowed so will be a bad request if you try to do it
		sourceUrl: post.sourceUrl,
		// read-only from api perspective, so including it has no effect
		previewUrl: post.previewUrl,
	};

	if ( post.fields.date ) {
		request = {
			...request,
			rawDate: post.fields.date.rawValue,
			parsedDate: post.fields.date.parsedValue.toISOString(),
		};
	}

	if ( post.fields.title ) {
		request = {
			...request,
			rawTitle: post.fields.title.rawValue,
			parsedTitle: post.fields.title.parsedValue,
		};
	}

	if ( post.fields.content ) {
		request = {
			...request,
			rawContent: post.fields.content.rawValue,
			parsedContent: post.fields.content.parsedValue,
		};
	}

	return request;
}

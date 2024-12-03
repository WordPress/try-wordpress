import { ApiClient } from '@/api/ApiClient';
import { Subject, SubjectType } from '@/model/Subject';
import { ApiPost } from '@/api/ApiTypes';
import { newDateField } from '@/model/field/DateField';
import { newTextField } from '@/model/field/TextField';
import { newHtmlField } from '@/model/field/HtmlField';

const endpoints = new Map< string, string >( [
	[ SubjectType.BlogPost, '/blog-posts' ],
	[ SubjectType.Page, '/pages' ],
] );

export class SubjectsApi {
	constructor( private readonly client: ApiClient ) {}

	async create( type: SubjectType, sourceUrl: string ): Promise< Subject > {
		const path = getEndpoint( type );
		const response = ( await this.client.post( path, {
			sourceUrl,
		} ) ) as ApiPost;
		return fromApiResponse( response );
	}

	async update( subject: Subject ): Promise< Subject > {
		const path = `${ getEndpoint( subject.type ) }/${ subject.id }`;
		const response = ( await this.client.post(
			path,
			toApiUpdateRequest( subject )
		) ) as ApiPost;
		return fromApiResponse( response );
	}

	async findById( type: SubjectType, id: number ): Promise< Subject | null > {
		const path = `${ getEndpoint( type ) }/${ id }`;
		const post = ( await this.client.get( path ) ) as ApiPost;
		return post ? fromApiResponse( post ) : null;
	}

	async findBySourceUrl(
		type: SubjectType,
		sourceUrl: string
	): Promise< Subject | null > {
		const path = `${ getEndpoint( type ) }?sourceurl=${ sourceUrl }`;
		const post = ( await this.client.get( path ) ) as ApiPost;
		return post ? fromApiResponse( post ) : null;
	}
}

function getEndpoint( type: SubjectType ): string {
	const endpoint = endpoints.get( type );
	if ( ! endpoint ) {
		throw Error( `unknown endpoint: ${ type }` );
	}
	return endpoint;
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

type UpdateBody = Omit< ApiPost, 'sourceUrl' | 'transformedId' | 'previewUrl' >;

function toApiUpdateRequest( subject: Subject ): UpdateBody {
	let request: UpdateBody = {
		id: subject.id,
	};

	if ( subject.fields.date ) {
		request = {
			...request,
			rawDate: subject.fields.date.rawValue,
			parsedDate: subject.fields.date.parsedValue.toISOString(),
		};
	}

	if ( subject.fields.title ) {
		request = {
			...request,
			rawTitle: subject.fields.title.rawValue,
			parsedTitle: subject.fields.title.parsedValue,
		};
	}

	if ( subject.fields.content ) {
		request = {
			...request,
			rawContent: subject.fields.content.rawValue,
			parsedContent: subject.fields.content.parsedValue,
		};
	}

	return request;
}

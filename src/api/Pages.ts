import { ApiClient } from '@/api/ApiClient';
import { Subject, SubjectType } from '@/model/Subject';
import { newTextField } from '@/model/field/TextField';
import { newHtmlField } from '@/model/field/HtmlField';
import { ApiPage } from '@/api/ApiTypes';
import { newDateField } from '@/model/field/DateField';

export class PagesApi {
	// eslint-disable-next-line no-useless-constructor
	constructor( private readonly client: ApiClient ) {}

	async create( page: Subject ): Promise< Subject > {
		const response = ( await this.client.post( '/pages', {
			sourceUrl: page.sourceUrl,
		} ) ) as ApiPage;
		return fromApiResponse( response );
	}

	async update( id: number, page: Subject ): Promise< Subject > {
		const response = ( await this.client.post(
			`/pages/${ id }`,
			toApiRequest( page )
		) ) as ApiPage;
		return fromApiResponse( response );
	}

	async findById( id: string ): Promise< Subject | null > {
		const page = ( await this.client.get( '/pages/' + id ) ) as ApiPage;
		return page ? fromApiResponse( page ) : null;
	}

	async findBySourceUrl( sourceUrl: string ): Promise< Subject | null > {
		const page = ( await this.client.get(
			'/pages?sourceurl=' + sourceUrl
		) ) as ApiPage;
		return page ? fromApiResponse( page ) : null;
	}
}

function fromApiResponse( response: ApiPage ): Subject {
	const date = newDateField( response.rawDate, response.parsedDate );
	const title = newTextField( response.rawTitle, response.parsedTitle ?? '' );
	const content = newHtmlField(
		response.rawContent,
		response.parsedContent ?? ''
	);

	return {
		id: response.id,
		type: SubjectType.Page,
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

function toApiRequest( page: Subject ): ApiPage {
	return {
		id: page.id,
		// read-only from api perspective, so including it has no effect
		transformedId: page.transformedId,
		// update not allowed so will be a bad request if you try to do it
		sourceUrl: page.sourceUrl,
		// read-only from api perspective, so including it has no effect
		previewUrl: page.previewUrl,
		rawDate: page.fields.date.rawValue,
		parsedDate: page.fields.date.parsedValue.toISOString(),
		rawTitle: page.fields.title.rawValue,
		parsedTitle: page.fields.title.parsedValue,
		rawContent: page.fields.content.rawValue,
		parsedContent: page.fields.content.parsedValue,
	};
}

/**
 * Source of data to be extracted, like a DOM document, a URL or any other kind of resource.
 * For the moment, only DOM Document is supported.
 */
export abstract class Source {
	abstract resource(): any;
}

/**
 * Source backed by a DOM document instance.
 */
export class DOMSource extends Source {
	private readonly document: Document;

	constructor( document: Document ) {
		super();
		this.document = document;
	}

	resource(): Document {
		return this.document;
	}
}

/**
 * Information about the Source to be extracted.
 */
export interface SourceInfo {
	/**
	 * The site's title.
	 */
	title: string;
}

/**
 * A piece of data in the Source under extraction, like a post or a page.
 */
export interface SourceData {
	/**
	 * Slug of the Extractor which extracted this data.
	 * This is automatically set, the Extractor does not need to set it.
	 */
	extractor: string;
	title: string;
	content: string;
}

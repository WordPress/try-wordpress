/**
 * A piece of data in the site, like a post or a page.
 */
export interface SiteData {
	/**
	 * Slug of the Extractor which extracted this entry.
	 * This is automatically set, the Extractor does not need to set it.
	 */
	extractor: string;
	title: string;
	content: string;
}

export interface ExtractorInfo {
	/**
	 * Unique identifier of the Extractor, e.g. "wordpress-rest".
	 * Must be a lower-case string.
	 * There must not be more than one extractor with the same slug.
	 */
	slug: string;

	/**
	 * Title of the Extractor, e.g. "WordPress".
	 */
	title: string;

	/**
	 * Description of the Extractor, e.g. "Extracts posts and pages from a WordPress site using the WordPress REST API".
	 */
	description: string;
}

export interface Extractor {
	/**
	 * Returns information about the Extractor.
	 */
	info(): ExtractorInfo;

	/**
	 * Tells whether the Extractor can handle a given Document.
	 */
	handles( document: Document ): boolean;

	/**
	 * Extracts Entries from a given Document.
	 */
	extract(
		document: Document,
		callback: ( entry: SiteData ) => void
	): Promise< void >;
}

/**
 * Information about the site to be extracted.
 */
export interface SiteInfo {
	/**
	 * The site's title.
	 */
	title: string;
}

/**
 * A piece of data in the site under extraction, like a post or a page.
 */
export interface SiteData {
	/**
	 * Slug of the Extractor which extracted this data.
	 * This is automatically set, the Extractor does not need to set it.
	 */
	extractor: string;
	title: string;
	content: string;
}

/**
 * Information about the Extractor.
 */
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
	 * Extracts information about the site, like its title.
	 */
	extractInfo( document: Document ): Promise< SiteInfo >;

	/**
	 * Extracts data from a given Document.
	 */
	extractData(
		document: Document,
		callback: ( siteData: SiteData ) => void
	): Promise< void >;
}

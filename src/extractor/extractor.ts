import { SourceData, SourceInfo, Source } from './source';

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
	 * Tells whether the Extractor can handle a given Source.
	 */
	handles( source: Source ): boolean;

	/**
	 * Extracts information about the Source, like its title, language, etc.
	 */
	extractInfo( source: Source ): Promise< SourceInfo >;

	/**
	 * Extracts data from a given Document.
	 */
	extractData(
		source: Source,
		callback: ( siteData: SourceData ) => void
	): Promise< void >;
}

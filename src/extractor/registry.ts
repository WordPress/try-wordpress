import { Extractor } from './extractor';
import { WordPressRestExtractor } from './wordpress-rest';

const extractors = new Map< string, Extractor >();

registerExtractor( new WordPressRestExtractor() );

/**
 * Find Extractors that support a given document.
 */
export function findExtractors( document: Document ): Extractor[] {
	let matches: Extractor[] = [];
	for ( let [ slug, extractor ] of extractors ) {
		if ( extractor.handles( document ) ) {
			matches.push( extractor );
		}
	}
	return matches;
}

/**
 * Register an Extractor.
 */
function registerExtractor( extractor: Extractor ) {
	const slug = extractor.meta().slug;
	if ( extractors.has( slug ) ) {
		throw new Error(
			`An Extractor with slug ${ slug } is already registered`
		);
	}
	extractors.set( slug, extractor );
}

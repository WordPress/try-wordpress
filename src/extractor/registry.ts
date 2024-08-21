import { Extractor } from './extractor';
import { WordPressRestExtractor } from './wordpress-rest';
import { Source } from './source';

const extractors = new Map< string, Extractor >();

registerExtractor( new WordPressRestExtractor() );

/**
 * Find Extractors that support a given document.
 */
export function findExtractors( source: Source ): Extractor[] {
	let matches: Extractor[] = [];
	for ( let [ slug, extractor ] of extractors ) {
		if ( extractor.handles( source ) ) {
			matches.push( extractor );
		}
	}
	return matches;
}

/**
 * Register an Extractor.
 */
function registerExtractor( extractor: Extractor ) {
	const slug = extractor.info().slug;
	if ( extractors.has( slug ) ) {
		throw new Error(
			`An Extractor with slug ${ slug } is already registered`
		);
	}
	extractors.set( slug, extractor );
}

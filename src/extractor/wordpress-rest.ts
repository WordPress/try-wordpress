import { Extractor, ExtractorInfo } from './extractor';
import { DOMSource, Source, SourceData, SourceInfo } from './source';

export class WordPressRestExtractor implements Extractor {
	info(): ExtractorInfo {
		return {
			slug: 'wordpress-rest',
			title: 'WordPress REST API',
			description:
				'Extracts posts and pages from a WordPress site using the WordPress REST API',
		};
	}

	supports( source: Source ): boolean {
		if ( ! ( source instanceof DOMSource ) ) {
			return false;
		}
		const document = source.resource();

		const post = document.querySelector( 'article.post' );
		if ( post ) {
			// Check if the CSS class matches `post-<id>`.
			const matches = post.className.match( /post-(\d+)/ );
			if ( matches !== null ) {
				return true;
			}
		}

		const page = document.querySelector( 'article.page' );
		if ( page ) {
			// Check if the CSS class matches `post-<id>`.
			const matches = page.className.match( /post-(\d+)/ );
			if ( matches !== null ) {
				return true;
			}
		}

		return false;
	}

	async extractInfo( source: Source ): Promise< SourceInfo > {
		// TODO.
		return { title: 'Foo' };
	}

	async extractData(
		source: Source,
		callback: ( entry: SourceData ) => void
	): Promise< void > {
		// TODO.
	}
}

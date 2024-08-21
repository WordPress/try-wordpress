import { SiteData, Extractor, ExtractorInfo, SiteInfo } from './extractor';

export class WordPressRestExtractor implements Extractor {
	info(): ExtractorInfo {
		return {
			slug: 'wordpress-rest',
			title: 'WordPress REST API',
			description:
				'Extracts posts and pages from a WordPress site using the WordPress REST API',
		};
	}

	handles( document: Document ): boolean {
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

	async extractInfo( document: Document ): Promise< SiteInfo > {
		// TODO.
		return { title: 'Foo' };
	}

	async extractData(
		document: Document,
		callback: ( entry: SiteData ) => void
	): Promise< void > {
		// TODO.
	}
}

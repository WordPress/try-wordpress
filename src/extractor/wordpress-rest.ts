import { Entry, Extractor, ExtractorMeta } from './extractor';

export class WordPressRestExtractor implements Extractor {
	meta(): ExtractorMeta {
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
			// get the id from the css class post-<id>
			const id = post.className.match( /post-(\d+)/ );
			return true;
		}

		const page = document.querySelector( 'article.page' );
		if ( page ) {
			// get the id from the css class post-<id>
			const id = page.className.match( /post-(\d+)/ );
			return true;
		}

		return false;
	}

	extract( document: Document ): Entry[] {
		// TODO.
		return [];
	}
}

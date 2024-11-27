import { CommandTypes, sendCommandToContent } from '@/bus/Command';

interface CrawlerState {
	isActive: boolean;
	nextProcessTime: number;
	rateLimit: number;
}

interface QueueUrlsResponse {
	accepted: number;
	rejected: number;
	queueSize: number;
	crawledCount: number;
}

interface NextUrlResponse {
	url: string;
}

interface QueueUrlsRequest {
	urls: string[];
	sourceUrl: string;
}

class Crawler {
	private readonly state: CrawlerState;
	private process: ( html: string ) => Promise< void >;

	constructor() {
		this.state = {
			isActive: false,
			nextProcessTime: 0,
			rateLimit: 1.0, // pages per sec; 1.0 means 1000ms delay between delays
		};
		// Initialize with empty process function
		this.process = async () => {};
	}

	private log( level: 'log' | 'warn' | 'error', ...args: any[] ): void {
		console[ level ]( ...args );
	}

	// Allow setting the process function
	public setProcessFunction(
		processFn: ( html: string ) => Promise< void >
	): void {
		this.process = processFn;
	}

	public async start(): Promise< void > {
		if ( this.state.isActive ) {
			this.log( 'log', 'Crawler already running' );
			return;
		}

		this.state.isActive = true;
		this.log( 'log', 'Crawler started' );

		while ( this.state.isActive ) {
			const next = await this.getNextUrl();
			if ( next ) {
				await this.processUrl( next );
			} else {
				this.state.isActive = false;
				this.log( 'log', 'Crawler finished' );
			}
		}
	}

	private async processUrl( url: string ): Promise< void > {
		this.log( 'log', 'processing url', url );
		try {
			// Wait until we're allowed to process the next URL
			await this.waitForRateLimit();

			await this.navigateToUrl( url );

			// @TODO: Get the HTML content via bus?
			const html = document.documentElement.outerHTML;

			// Process the page content
			await this.process( html );

			// Extract and queue new URLs
			const links = this.extractLinks( html );
			await this.queueUrls( links, url );
		} catch ( error ) {
			this.log( 'error', 'Error processing URL', url, error );
			this.state.isActive = false;
		}
	}

	private async waitForRateLimit(): Promise< void > {
		const now = Date.now();
		const delayMs = 1000 / this.state.rateLimit; // Convert rate limit to milliseconds between requests

		if ( now < this.state.nextProcessTime ) {
			await new Promise( ( resolve ) =>
				setTimeout( resolve, this.state.nextProcessTime - now )
			);
		}

		// Calculate next allowed process time using the delay
		this.state.nextProcessTime = now + delayMs;
	}

	private extractLinks( htmlString: string ): string[] {
		// Create a DOM parser instance
		const parser = new DOMParser();

		// Parse the HTML string into a document
		const doc = parser.parseFromString( htmlString, 'text/html' );

		// Find all anchor tags
		const linkElements = doc.querySelectorAll( 'a' );

		// Convert NodeList to Array and extract link data
		const links = Array.from( linkElements ).map( ( link ) => {
			// Get the href attribute
			const href = link.getAttribute( 'href' );

			// Skip if no href, or it's a javascript: link or anchor link
			if (
				! href ||
				href.startsWith( 'javascript:' ) ||
				href.startsWith( '#' )
			) {
				return null;
			}

			// Try to resolve relative URLs to absolute
			let absoluteUrl;
			try {
				absoluteUrl = new URL( href, window.location.origin ).href;
			} catch ( e ) {
				// If URL parsing fails, use the original href
				absoluteUrl = href;
			}

			const isExternal = link.hostname !== window.location.hostname;
			if ( isExternal ) {
				return null;
			}

			return absoluteUrl;
		} );

		// Filter out null values and return unique links
		return links
			.filter( ( link ) => link !== null )
			.filter(
				( link, index, self ) =>
					index === self.findIndex( ( l ) => l === link )
			);
	}

	private async queueUrls(
		urls: string[],
		sourceUrl: string,
		retryCount = 0,
		maxRetries = 5
	): Promise< QueueUrlsResponse > {
		const request: QueueUrlsRequest = {
			urls,
			sourceUrl,
		};

		const response = await fetch( '/crawl-api/queue-urls', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify( request ),
		} );

		if ( ! response.ok ) {
			this.log(
				'warn',
				`Attempt ${
					retryCount + 1
				}/${ maxRetries } failed: HTTP error! status: ${
					response.status
				}`
			);

			if ( retryCount >= maxRetries - 1 ) {
				return Promise.reject(
					new Error(
						`Failed to queue URLs after ${ maxRetries } attempts`
					)
				);
			}

			// Wait before retrying
			await this.sleep();

			// Recursive call
			return this.queueUrls( urls, sourceUrl, retryCount++, maxRetries );
		}

		return response.json();
	}

	private async sleep( ms: number = 1000 ): Promise< void > {
		return new Promise( ( resolve ) => setTimeout( resolve, ms ) );
	}

	private async getNextUrl(
		retryCount = 0,
		maxRetries = 5
	): Promise< string | null > {
		const response = await fetch( '/crawl-api/next-url' );

		// crawling queue is finished
		if ( response.status === 204 ) {
			return null;
		}

		if ( ! response.ok ) {
			this.log(
				'warn',
				`Attempt ${
					retryCount + 1
				}/${ maxRetries } failed: HTTP error! status: ${
					response.status
				}`
			);

			if ( retryCount >= maxRetries - 1 ) {
				return Promise.reject(
					new Error(
						`Failed to get next URL after ${ maxRetries } attempts`
					)
				);
			}

			// Wait before retrying
			await this.sleep();

			// Recursive call
			return this.getNextUrl( retryCount++, maxRetries );
		}

		const data: NextUrlResponse = await response.json();
		return data.url;
	}

	private async navigateToUrl( url: string ): Promise< void > {
		void sendCommandToContent( {
			type: CommandTypes.NavigateTo,
			payload: { url },
		} );
	}

	public stop(): void {
		this.state.isActive = false;
	}

	public updateRateLimit( newLimit: number ): void {
		// only allow between 0.1 and 10 pages per second - no reason for this limit; feel free to change
		this.state.rateLimit = Math.max( 0.1, Math.min( 10.0, newLimit ) );
	}
}

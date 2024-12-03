import { PHPResponse, PlaygroundClient } from '@wp-playground/client';
import { BlogPostsApi } from '@/api/BlogPosts';
import { PagesApi } from '@/api/Pages';
import { SettingsApi } from '@/api/Settings';
import { UsersApi } from '@/api/Users';
import { BlueprintsApi } from '@/api/Blueprints';
import { SubjectsApi } from '@/api/SubjectsApi';

export class ApiClient {
	private readonly playgroundClient: PlaygroundClient;
	private readonly _siteUrl: string;
	private readonly _subjects: SubjectsApi;
	private readonly _blogPosts: BlogPostsApi;
	private readonly _pages: PagesApi;
	private readonly _settings: SettingsApi;
	private readonly _users: UsersApi;
	private readonly _blueprints: BlueprintsApi;

	constructor( playgroundClient: PlaygroundClient, siteUrl: string ) {
		this.playgroundClient = playgroundClient;
		this._siteUrl = siteUrl;
		this._blueprints = new BlueprintsApi( this );
		this._subjects = new SubjectsApi( this );
		this._blogPosts = new BlogPostsApi( this );
		this._pages = new PagesApi( this );
		this._settings = new SettingsApi( this );
		this._users = new UsersApi( this );
	}

	get siteUrl(): string {
		return this._siteUrl;
	}

	get blueprints(): BlueprintsApi {
		return this._blueprints;
	}

	get subjects(): SubjectsApi {
		return this._subjects;
	}

	get blogPosts(): BlogPostsApi {
		return this._blogPosts;
	}

	get pages(): PagesApi {
		return this._pages;
	}

	get settings(): SettingsApi {
		return this._settings;
	}

	get users(): UsersApi {
		return this._users;
	}

	async get(
		route: string,
		params?: Record< string, string >
	): Promise< object | null > {
		let url = `/index.php?rest_route=/try-wp/v1${ route }`;
		for ( const name in params ) {
			const encoded = encodeURIComponent( params[ name ] );
			url += `&${ name }=${ encoded }`;
		}
		const response = await this.playgroundClient.request( {
			url,
			method: 'GET',
		} );
		if ( response.httpStatusCode === 404 ) {
			return null;
		}
		if ( response.httpStatusCode < 200 || response.httpStatusCode >= 300 ) {
			logFailedRequest( { url, params, response } );
			throw Error( response.json.message );
		}
		return response.json;
	}

	async post( route: string, body: object ): Promise< object > {
		const url = `/index.php?rest_route=/try-wp/v1${ route }`;
		const response = await this.playgroundClient.request( {
			url,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify( body ),
		} );

		if ( response.httpStatusCode < 200 || response.httpStatusCode >= 300 ) {
			logFailedRequest( { url, response } );
			throw Error( response.json.message );
		}
		return response.json;
	}
}

function logFailedRequest( args: {
	url: string;
	params?: Record< string, string >;
	response: PHPResponse;
} ) {
	const { url, params, response } = args;
	const message = `Request to ${ url } failed [${ response.httpStatusCode }]`;
	if ( params ) {
		console.error( message, params, response.json, response );
	} else {
		console.error( message, response.json, response );
	}
}

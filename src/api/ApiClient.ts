import { PlaygroundClient } from '@wp-playground/client';
import { BlogPostsApi } from '@/api/BlogPosts';
import { SettingsApi } from '@/api/Settings';
import { UsersApi } from '@/api/Users';
import { PostsApi } from '@/api/Posts';
import { BlueprintsApi } from '@/api/Blueprints';

export class ApiClient {
	private readonly playgroundClient: PlaygroundClient;
	private readonly _siteUrl: string;
	private readonly _blogPosts: BlogPostsApi;
	private readonly _settings: SettingsApi;
	private readonly _users: UsersApi;
	private readonly _posts: PostsApi;
	private readonly _blueprints: BlueprintsApi;

	constructor( playgroundClient: PlaygroundClient, siteUrl: string ) {
		this.playgroundClient = playgroundClient;
		this._siteUrl = siteUrl;
		this._blueprints = new BlueprintsApi( this );
		this._posts = new PostsApi( this );
		this._blogPosts = new BlogPostsApi( this );
		this._settings = new SettingsApi( this );
		this._users = new UsersApi( this );
	}

	get siteUrl(): string {
		return this._siteUrl;
	}

	get blueprints(): BlueprintsApi {
		return this._blueprints;
	}

	get posts(): PostsApi {
		return this._posts;
	}

	get blogPosts(): BlogPostsApi {
		return this._blogPosts;
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
	): Promise< object > {
		let url = `/index.php?rest_route=/wp/v2${ route }`;
		for ( const name in params ) {
			const encoded = encodeURIComponent( params[ name ] );
			url += `&${ name }=${ encoded }`;
		}
		const response = await this.playgroundClient.request( {
			url,
			method: 'GET',
		} );
		if ( response.httpStatusCode !== 200 ) {
			console.error( response, params, response.json );
			throw Error( response.json.message );
		}
		return response.json;
	}

	async post( route: string, body: object ): Promise< object > {
		const response = await this.playgroundClient.request( {
			url: `/index.php?rest_route=/wp/v2${ route }`,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify( body ),
		} );

		if ( response.httpStatusCode < 200 || response.httpStatusCode >= 300 ) {
			console.error( response, body, response.json );
			throw Error( response.json.message );
		}
		return response.json;
	}
}

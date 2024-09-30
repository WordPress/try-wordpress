export interface BlogPost {
	id: number;
	guid: string;
	url: string;
	date: BlogPostDate;
	title: BlogPostTitle;
	content: BlogPostContent;
}

abstract class BlogPostSection< T > {
	original: string;
	parsed: string;
	constructor( original: string = '', parsed: string = '' ) {
		this.original = original;
		this.parsed = parsed;
	}
	abstract get value(): T;
}

export class BlogPostDate extends BlogPostSection< Date > {
	readonly _value: Date;
	constructor( original: string = '', parsed: string = '' ) {
		super( original, parsed );
		this._value = parsed === '' ? new Date() : new Date( this.parsed );
	}
	get value(): Date {
		return this._value;
	}
	get utcString(): string {
		return this._value.toISOString();
	}
}

export class BlogPostTitle extends BlogPostSection< string > {
	get value(): string {
		return this.parsed;
	}
}

export class BlogPostContent extends BlogPostSection< string > {
	get value(): string {
		return this.parsed;
	}
}

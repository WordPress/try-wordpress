export interface Post {
	id: number;
	guid: string;
	url: string;
	date: PostDate;
	title: PostTitle;
	content: PostContent;
}

abstract class PostSection< T > {
	original: string;
	parsed: string;
	constructor( original: string = '', parsed: string = '' ) {
		this.original = original;
		this.parsed = parsed;
	}
	abstract get value(): T;
}

export class PostDate extends PostSection< Date > {
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

export class PostTitle extends PostSection< string > {
	get value(): string {
		return this.parsed;
	}
}

export class PostContent extends PostSection< string > {
	get value(): string {
		return this.parsed;
	}
}

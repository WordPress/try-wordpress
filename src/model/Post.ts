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
	constructor( original: string, parsed: string ) {
		this.original = original;
		this.parsed = parsed;
	}
	abstract value(): T;
}

export class PostDate extends PostSection< Date > {
	value(): Date {
		return new Date( this.parsed );
	}
}

export class PostTitle extends PostSection< string > {
	value(): string {
		return this.parsed;
	}
}

export class PostContent extends PostSection< string > {
	value(): string {
		return this.parsed;
	}
}

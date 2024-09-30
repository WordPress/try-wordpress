abstract class Section< T > {
	original: string;
	parsed: string;
	constructor( original: string = '', parsed: string = '' ) {
		this.original = original;
		this.parsed = parsed;
	}
	abstract get value(): T;
}

export class DateSection extends Section< Date > {
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

export class TextSection extends Section< string > {
	get value(): string {
		return this.parsed;
	}
}

export class HtmlSection extends Section< string > {
	get value(): string {
		return this.parsed;
	}
}

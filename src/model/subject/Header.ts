import { Subject, SubjectType } from '@/model/subject/Subject';

export interface Header extends Subject {
	type: SubjectType.Header;
}

export function newHeader( sourceUrl: string ): Header {
	return {
		id: 0,
		transformedId: 0,
		type: SubjectType.Header,
		sourceUrl,
	};
}

export function validateHeader( header: Header ): boolean {
	// TODO: just returns false for now.
	return header.type !== SubjectType.Header;
}

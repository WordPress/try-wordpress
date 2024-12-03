import { Subject, SubjectType } from '@/model/subject/Subject';

export interface BlogPost extends Subject {
	type: SubjectType.BlogPost;
}

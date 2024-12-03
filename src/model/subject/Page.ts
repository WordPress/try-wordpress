import { Subject, SubjectType } from '@/model/subject/Subject';

export interface Page extends Subject {
	type: SubjectType.Page;
}

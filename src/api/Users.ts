import { ApiClient } from '@/api/ApiClient';
import { User } from '@/model/User';
import { ApiUser } from '@/api/ApiTypes';

interface CreateBody {
	username: string;
	email: string;
	password: string;
	role?: string; // default roles: administrator, editor, author, subscriber (default)
	firstName?: string;
	lastName?: string;
}

export class UsersApi {
	// eslint-disable-next-line no-useless-constructor
	constructor( private readonly client: ApiClient ) {}

	async create( body: CreateBody ): Promise< User > {
		const actualBody: any = {
			username: body.username,
			email: body.email,
			password: body.password,
		};
		if ( body.role ) {
			actualBody.roles = [ body.role ];
		}
		if ( body.firstName ) {
			actualBody.first_name = body.firstName;
		}
		if ( body.lastName ) {
			actualBody.last_name = body.lastName;
		}
		const response = ( await this.client.post(
			`/users`,
			actualBody
		) ) as ApiUser;
		return makeUserFromApiResponse( response );
	}
}

function makeUserFromApiResponse( response: ApiUser ): User {
	return {
		username: response.username ?? '',
		email: response.email ?? '',
		role: response.roles ? response.roles[ 0 ] : '',
		firstName: response.first_name ?? '',
		lastName: response.last_name ?? '',
	};
}

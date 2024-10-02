import { useNavigate, useParams } from 'react-router-dom';
import { useBlueprint } from '@/ui/blueprints/useBlueprint';
import { humanReadablePostType } from '@/model/content/Post';
import { Toolbar } from '@/ui/blueprints/Toolbar';
import { ReactElement } from 'react';
import { Screens } from '@/ui/App';
import { useSessionContext } from '@/ui/session/SessionProvider';

export function Import() {
	const params = useParams();
	const blueprintId = params.blueprintId!;
	const [ blueprint ] = useBlueprint( blueprintId );
	const { session } = useSessionContext();
	const navigate = useNavigate();

	const fields: ReactElement[] = [];
	if ( blueprint ) {
		for ( const [ name, field ] of Object.entries( blueprint.fields ) ) {
			fields.push(
				<li key={ name }>
					{ name }: { field.selector }
				</li>
			);
		}
	}

	return (
		<>
			{ ! blueprint ? (
				'Loading...'
			) : (
				<>
					<Toolbar>
						<button
							onClick={ async () => {
								navigate(
									Screens.blueprints.edit(
										session.id,
										blueprint.id
									)
								);
							} }
						>
							Edit blueprint
						</button>
						<button
							onClick={ async () => {
								console.log( 'TODO' );
							} }
						>
							Continue (TODO)
						</button>
					</Toolbar>
					We&apos;ll now import{ ' ' }
					{ humanReadablePostType.get( blueprint.type ) }s using the
					following selectors:
					<br />
					<br />
					<ul>{ fields }</ul>
				</>
			) }
		</>
	);
}

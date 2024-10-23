import { useNavigate, useParams } from 'react-router-dom';
import { useBlueprint } from '@/ui/blueprints/useBlueprint';
import { humanReadableSubjectType } from '@/model/subject/Subject';
import { Toolbar } from '@/ui/blueprints/Toolbar';
import { ReactElement, useEffect } from 'react';
import { Screens } from '@/ui/App';
import { useSessionContext } from '@/ui/session/SessionProvider';

export function Import() {
	const params = useParams();
	const blueprintId = params.blueprintId!;
	const [ blueprint ] = useBlueprint( blueprintId );
	const { session } = useSessionContext();
	const navigate = useNavigate();

	// Navigate to the blueprint's edit screen if the blueprint is not valid.
	useEffect( () => {
		if ( blueprint && ! blueprint.valid ) {
			navigate( Screens.blueprints.edit( session.id, blueprint.id ) );
		}
	}, [ session.id, blueprint ] );

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
					{ humanReadableSubjectType.get( blueprint.type ) }s using
					the following selectors:
					<br />
					<br />
					<ul>{ fields }</ul>
				</>
			) }
		</>
	);
}

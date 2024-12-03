import { useNavigate, useParams } from 'react-router-dom';
import { useBlueprint } from '@/ui/hooks/useBlueprint';
import { humanReadableSubjectType } from '@/model/Subject';
import { Toolbar } from '@/ui/components/Toolbar';
import { ReactElement, useEffect } from 'react';
import { Screens } from '@/ui/App';
import { useSessionContext } from '@/ui/session/SessionProvider';
import { Button } from '@wordpress/components';

export function ImportWithBlueprint() {
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
	}, [ session.id, blueprint, navigate ] );

	const fields: ReactElement[] = [];
	if ( blueprint ) {
		for ( const [ name, selector ] of Object.entries(
			blueprint.selectors
		) ) {
			fields.push(
				<li key={ name }>
					{ name }: { selector }
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
						<Button
							variant="secondary"
							className="button-block"
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
						</Button>
						<Button
							variant="primary"
							className="button-block"
							onClick={ async () => {
								console.log( 'TODO' );
							} }
						>
							Continue
						</Button>
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

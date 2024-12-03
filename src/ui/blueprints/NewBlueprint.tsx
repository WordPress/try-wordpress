import { useEffect, useState } from 'react';
import { useSessionContext } from '@/ui/session/SessionProvider';
import { useNavigate, useParams } from 'react-router-dom';
import { Screens } from '@/ui/App';
import { Toolbar } from '@/ui/components/Toolbar';
import { humanReadableSubjectType, SubjectType } from '@/model/Subject';
import { newBlueprint } from '@/model/Blueprint';
import {
	CommandTypes,
	CurrentPageInfo,
	sendCommandToContent,
} from '@/bus/Command';
import { Button } from '@wordpress/components';

export function NewBlueprint() {
	const params = useParams();
	const subjectType = params.subjectType as SubjectType;
	const navigate = useNavigate();
	const [ isLoading, setIsLoading ] = useState( true );
	const { session, apiClient } = useSessionContext();

	// Check if there is already a blueprint for the subjectType and if so,
	// redirect to that blueprint's edit screen if the blueprint is not valid yet,
	// or redirect to the import screen if the blueprint is already valid.
	useEffect( () => {
		if ( ! apiClient ) {
			return;
		}

		async function maybeRedirect() {
			const blueprints =
				await apiClient!.blueprints.findBySubjectType( subjectType );
			const blueprint = blueprints.length > 0 ? blueprints[ 0 ] : null;
			if ( blueprint && blueprint.valid ) {
				navigate(
					Screens.importWithBlueprint( session.id, blueprint.id )
				);
				return;
			} else if ( blueprint ) {
				navigate( Screens.blueprints.edit( session.id, blueprint.id ) );
				return;
			}
			setIsLoading( false );
		}

		maybeRedirect().catch( console.error );
	}, [ session.id, apiClient, subjectType, navigate ] );

	const navigateMessage = (
		<>
			Navigate to the page of a{ ' ' }
			{ humanReadableSubjectType.get( subjectType ) }.
		</>
	);

	const element = (
		<>
			<Toolbar>
				<Button
					variant="primary"
					className="button-block"
					onClick={ async () => {
						const currentPage = ( await sendCommandToContent( {
							type: CommandTypes.GetCurrentPageInfo,
							payload: {},
						} ) ) as CurrentPageInfo;
						const blueprint = await apiClient!.blueprints.create(
							newBlueprint( subjectType, currentPage.url )
						);
						navigate(
							Screens.blueprints.edit( session.id, blueprint.id )
						);
					} }
				>
					Continue
				</Button>
			</Toolbar>
			<div>{ navigateMessage }</div>
		</>
	);

	return <>{ isLoading ? 'Loading...' : element }</>;
}

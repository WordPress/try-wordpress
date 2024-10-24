import { useEffect, useState } from 'react';
import { ContentBus } from '@/bus/ContentBus';
import { useSessionContext } from '@/ui/session/SessionProvider';
import { useNavigate, useParams } from 'react-router-dom';
import { Screens } from '@/ui/App';
import { Toolbar } from '@/ui/blueprints/Toolbar';
import { humanReadableSubjectType, SubjectType } from '@/model/subject/Subject';
import { newBlogPostBlueprint } from '@/model/blueprint/BlogPost';
import { Blueprint } from '@/model/blueprint/Blueprint';

export function NewBlueprint() {
	const params = useParams();
	const postType = params.postType as SubjectType;
	const navigate = useNavigate();
	const [ isLoading, setIsLoading ] = useState( true );
	const { session, apiClient } = useSessionContext();

	// Check if there is already a blueprint for the postType and if so,
	// redirect to that blueprint's edit screen is the blueprint is not valid yet,
	// or redirect to the import screen if the blueprint is already valid.
	useEffect( () => {
		if ( ! apiClient ) {
			return;
		}
		async function maybeRedirect() {
			const blueprints =
				await apiClient!.blueprints.findByPostType( postType );
			const blueprint = blueprints.length > 0 ? blueprints[ 0 ] : null;
			if ( blueprint && blueprint.valid ) {
				navigate( Screens.import( session.id, blueprint.id ) );
				return;
			} else if ( blueprint ) {
				navigate( Screens.blueprints.edit( session.id, blueprint.id ) );
				return;
			}
			setIsLoading( false );
		}
		maybeRedirect().catch( console.error );
	}, [ session.id, apiClient, postType, navigate ] );

	const navigateMessage = (
		<>
			Navigate to the page of a{ ' ' }
			{ humanReadableSubjectType.get( postType ) }
		</>
	);

	const element = (
		<>
			<Toolbar>
				<button
					onClick={ async () => {
						const currentPage =
							await ContentBus.getCurrentPageInfo();
						let blueprint: Blueprint | null;
						switch ( postType ) {
							case SubjectType.BlogPost:
								blueprint = await apiClient!.blueprints.create(
									newBlogPostBlueprint( currentPage.url )
								);
								break;
							default:
								throw Error(
									`unknown post type ${ postType }`
								);
						}
						navigate(
							Screens.blueprints.edit( session.id, blueprint.id )
						);
					} }
				>
					Continue
				</button>
			</Toolbar>
			<div>{ navigateMessage }</div>
		</>
	);

	return <>{ isLoading ? 'Loading...' : element }</>;
}

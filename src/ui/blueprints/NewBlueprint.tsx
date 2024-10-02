import { useEffect, useState } from 'react';
import { ContentBus } from '@/bus/ContentBus';
import { useSessionContext } from '@/ui/session/SessionProvider';
import { useNavigate, useParams } from 'react-router-dom';
import { Screens } from '@/ui/App';
import { Toolbar } from '@/ui/blueprints/Toolbar';
import { humanReadablePostType, PostType } from '@/model/content/Post';
import { newBlogPostBlueprint } from '@/model/content/BlogPost';
import { Blueprint } from '@/model/content/Blueprint';

export function NewBlueprint() {
	const params = useParams();
	const postType = params.postType as PostType;
	const navigate = useNavigate();
	const [ isLoading, setIsLoading ] = useState( true );
	const { session, apiClient } = useSessionContext();

	// Check if there is already a blueprint for the postType,
	// and if so, redirect to that blueprint.
	useEffect( () => {
		if ( ! apiClient ) {
			return;
		}
		async function maybeRedirect() {
			const blueprints =
				await apiClient!.blueprints.findByPostType( postType );
			const blueprint = blueprints.length > 0 ? blueprints[ 0 ] : null;
			if ( blueprint ) {
				navigate( Screens.blueprints.edit( session.id, blueprint.id ) );
				return;
			}
			setIsLoading( false );
		}
		maybeRedirect().catch( console.error );
	}, [ session.id, apiClient, postType, navigate ] );

	const element = (
		<>
			<Toolbar>
				<button
					onClick={ async () => {
						const currentPage =
							await ContentBus.getCurrentPageInfo();
						let blueprint: Blueprint | null;
						switch ( postType ) {
							case PostType.BlogPost:
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
			<div>
				Navigate to the page of a{ ' ' }
				{ humanReadablePostType.get( postType ) }
			</div>
		</>
	);

	return <>{ isLoading ? 'Loading...' : element }</>;
}

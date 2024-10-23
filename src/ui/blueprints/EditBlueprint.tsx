import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useSessionContext } from '@/ui/session/SessionProvider';
import { BlueprintEditor } from '@/ui/blueprints/BlueprintEditor';
import { ContentBus } from '@/bus/ContentBus';
import { Toolbar } from '@/ui/blueprints/Toolbar';
import {
	parsePostContent,
	parsePostDate,
	parsePostTitle,
} from '@/parser/blog-post';
import { PostField, PostType } from '@/model/content/Post';
import { Screens } from '@/ui/App';
import { useBlueprint } from '@/ui/blueprints/useBlueprint';
import { usePostForBlueprint } from '@/ui/blueprints/usePostForBlueprint';

export function EditBlueprint() {
	const params = useParams();
	const blueprintId = params.blueprintId!;
	const [ blueprint, setBlueprint ] = useBlueprint( blueprintId );
	const [ post, setPost ] = usePostForBlueprint( blueprint );
	const { session, apiClient, playgroundClient } = useSessionContext();
	const navigate = useNavigate();

	// Make the source site navigate to the blueprint's source URL.
	useEffect( () => {
		if ( blueprint ) {
			void ContentBus.navigateTo( blueprint.sourceUrl );
		}
	}, [ blueprint ] );

	// Make playground navigate to the post's URL.
	useEffect( () => {
		if ( post && !! playgroundClient ) {
			void playgroundClient.goTo( '/?p=' + post.transformedId );
		}
	}, [ post, playgroundClient ] );

	// Handle field change events.
	async function onFieldChanged(
		name: string,
		field: PostField,
		selector: string
	) {
		if ( ! blueprint || ! post ) {
			return;
		}
		let postFieldsToUpdate: object | undefined;
		switch ( post.type ) {
			case PostType.BlogPost:
				switch ( name ) {
					case 'date':
						field = parsePostDate( field.original );
						postFieldsToUpdate = {
							date: field,
						};
						break;
					case 'title':
						field = parsePostTitle( field.original );
						postFieldsToUpdate = {
							title: field,
						};
						break;
					case 'content':
						field = parsePostContent( field.original );
						postFieldsToUpdate = {
							content: field,
						};
						break;
				}
				break;
			default:
				throw Error( `unknown post type ${ field.type }` );
		}

		blueprint.fields[ name ].selector = selector;

		let isBlueprintValid = true;
		for ( const f of Object.values( blueprint.fields ) ) {
			if ( f.selector === '' ) {
				isBlueprintValid = false;
			}
		}
		blueprint.valid = isBlueprintValid;

		const bp = await apiClient!.blueprints.update( blueprint );
		setBlueprint( bp );

		if ( postFieldsToUpdate ) {
			const p = await apiClient!.blogPosts.update(
				post.id,
				postFieldsToUpdate
			);
			setPost( p );
			void playgroundClient.goTo( '/?p=' + post.transformedId );
		}
	}

	let isValid = ! blueprint ? false : blueprint.valid;
	if ( ! post ) {
		isValid = false;
	} else if ( isValid && post ) {
		for ( const f of Object.values( post.fields ) ) {
			if ( f.original === '' || f.parsed === '' ) {
				isValid = false;
				break;
			}
		}
	}

	return (
		<>
			{ ! blueprint || ! post ? (
				'Loading...'
			) : (
				<>
					<Toolbar>
						<button
							disabled={ ! isValid }
							onClick={ async () => {
								await ContentBus.disableHighlighting();
								navigate(
									Screens.import( session.id, blueprint!.id )
								);
							} }
						>
							Continue
						</button>
					</Toolbar>
					<BlueprintEditor
						blueprint={ blueprint }
						post={ post }
						fieldOrder={ {
							title: 0,
							date: 1,
							content: 2,
						} }
						onFieldChanged={ onFieldChanged }
					/>
				</>
			) }
		</>
	);
}

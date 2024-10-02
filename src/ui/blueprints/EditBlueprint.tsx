import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSessionContext } from '@/ui/session/SessionProvider';
import { BlueprintEditor } from '@/ui/blueprints/BlueprintEditor';
import { ContentBus } from '@/bus/ContentBus';
import { Toolbar } from '@/ui/blueprints/Toolbar';
import {
	parsePostContent,
	parsePostDate,
	parsePostTitle,
} from '@/parser/blog-post';
import { Post, PostField, PostType } from '@/model/content/Post';
import { Blueprint } from '@/model/content/Blueprint';
import { Screens } from '@/ui/App';

export function EditBlueprint() {
	const params = useParams();
	const blueprintId = params.blueprintId!;
	const [ post, setPost ] = useState< Post >();
	const [ blueprint, setBlueprint ] = useState< Blueprint >();
	const { session, apiClient, playgroundClient } = useSessionContext();
	const navigate = useNavigate();

	// Load the blueprint,
	// and make the source site navigate to the blueprint's source URL.
	useEffect( () => {
		if ( apiClient ) {
			apiClient.blueprints
				.findById( blueprintId )
				.then( ( bp ) => {
					if ( ! bp ) {
						throw Error(
							`blueprint with id ${ blueprintId } not found`
						);
					}
					setBlueprint( bp );
					void ContentBus.navigateTo( bp.sourceUrl );
				} )
				.catch( console.error );
		}
	}, [ blueprintId, apiClient ] );

	// Load a post to preview the blueprint's results,
	// and make playground navigate to that post's URL.
	// If a post already exists for the blueprint's source URL, we use that post,
	// otherwise we create a new post.
	useEffect( () => {
		if ( ! blueprint ) {
			return;
		}
		async function loadPost( bp: Blueprint ) {
			let p: Post | null;
			switch ( bp.type ) {
				case PostType.BlogPost:
					p = await apiClient!.blogPosts.findByGuid( bp.sourceUrl );
					break;
				default:
					throw Error( `unknown blueprint type ${ bp.type }` );
			}
			if ( ! p ) {
				switch ( bp.type ) {
					case PostType.BlogPost:
						p = await apiClient!.blogPosts.create( {
							guid: bp.sourceUrl,
						} );
						break;
					default:
						throw Error( `unknown post type ${ bp.type }` );
				}
			}
			setPost( p );
			void playgroundClient.goTo( p.url );
		}
		loadPost( blueprint ).catch( console.error );
	}, [ blueprint, apiClient, playgroundClient ] );

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
		const bp = await apiClient!.blueprints.update( blueprint );
		setBlueprint( bp );

		if ( postFieldsToUpdate ) {
			const p = await apiClient!.blogPosts.update(
				post.id,
				postFieldsToUpdate
			);
			setPost( p );
			void playgroundClient.goTo( post.url );
		}
	}

	let isValid = true;
	if ( ! blueprint || ! post ) {
		isValid = false;
	} else {
		for ( const field of Object.values( blueprint.fields ) ) {
			if ( field.selector === '' ) {
				isValid = false;
				break;
			}
		}
		if ( isValid ) {
			for ( const field of Object.values( post.fields ) ) {
				if ( field.original === '' || field.parsed === '' ) {
					isValid = false;
					break;
				}
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

import { useParams } from 'react-router-dom';
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
import { Post, PostType } from '@/model/content/Post';
import { Blueprint } from '@/model/content/Blueprint';

export function EditBlueprint() {
	const params = useParams();
	const blueprintId = params.blueprintId!;
	const [ post, setPost ] = useState< Post >();
	const [ blueprint, setBlueprint ] = useState< Blueprint >();
	const { apiClient, playgroundClient } = useSessionContext();

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
	}

	return (
		<>
			{ ! post ? (
				'Loading...'
			) : (
				<>
					<Toolbar>
						<button
							disabled={ ! isValid }
							onClick={ async () => {
								await ContentBus.disableHighlighting();
								console.log( 'TODO: import' );
							} }
						>
							Import
						</button>
					</Toolbar>
					<BlueprintEditor
						post={ post }
						fieldOrder={ {
							title: 0,
							date: 1,
							content: 2,
						} }
						onFieldChanged={ async ( name, field ) => {
							let fieldsToUpdate: object | undefined;
							switch ( post.type ) {
								case PostType.BlogPost:
									switch ( name ) {
										case 'date':
											field = parsePostDate(
												field.original
											);
											fieldsToUpdate = { date: field };
											break;
										case 'title':
											field = parsePostTitle(
												field.original
											);
											fieldsToUpdate = { title: field };
											break;
										case 'content':
											field = parsePostContent(
												field.original
											);
											fieldsToUpdate = { content: field };
											break;
									}
									break;
								default:
									throw Error(
										`unknown post type ${ field.type }`
									);
							}
							if ( ! fieldsToUpdate ) {
								return;
							}
							const p = await apiClient!.blogPosts.update(
								post.id,
								fieldsToUpdate
							);
							setPost( p );
							void playgroundClient.goTo( post.url );
						} }
					/>
				</>
			) }
		</>
	);
}

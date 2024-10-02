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
	const [ post, setPost ] = useState< Post >();
	const [ blueprint, setBlueprint ] = useState< Blueprint >();
	const { blueprintId } = useParams();
	const { apiClient, playgroundClient } = useSessionContext();

	useEffect( () => {
		if ( ! apiClient ) {
			return;
		}
		// Load the blueprint and a post to preview the blueprint's results.
		// If a post already exists for the source URL, load that post,
		// otherwise create a new post.
		async function load( bpId: string ) {
			const bp = await apiClient!.blueprints.findById( bpId );
			if ( ! bp ) {
				throw Error( `blueprint with id ${ bpId } not found` );
			}
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
			setBlueprint( bp );
			setPost( p );
			void playgroundClient.goTo( p.url );
			void ContentBus.navigateTo( bp.sourceUrl );
		}
		load( blueprintId! ).catch( console.error );
	}, [ blueprintId, apiClient, playgroundClient ] );

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

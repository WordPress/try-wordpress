import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useSessionContext } from '@/ui/session/SessionProvider';
import { BlogPostBlueprintEditor } from '@/ui/blueprints/blog-post/BlogPostBlueprintEditor';
import { ContentBus } from '@/bus/ContentBus';
import { Toolbar } from '@/ui/blueprints/Toolbar';
import {
	parseBlogPostContent,
	parseBlogPostDate,
	parseBlogPostTitle,
} from '@/parser/blog-post';
import { SubjectType } from '@/model/subject/Subject';
import { Screens } from '@/ui/App';
import { useBlueprint } from '@/ui/blueprints/useBlueprint';
import { useSubjectForBlueprint } from '@/ui/blueprints/useSubjectForBlueprint';
import { Field } from '@/model/field/Field';
import { BlogPost } from '@/model/subject/BlogPost';

export function EditBlueprint() {
	const params = useParams();
	const blueprintId = params.blueprintId!;
	const [ blueprint, setBlueprint ] = useBlueprint( blueprintId );
	const [ subject, setSubject ] = useSubjectForBlueprint( blueprint );
	const { session, apiClient, playgroundClient } = useSessionContext();
	const navigate = useNavigate();

	// Make the source site navigate to the blueprint's source URL.
	useEffect( () => {
		if ( blueprint ) {
			void ContentBus.navigateTo( blueprint.sourceUrl );
		}
	}, [ blueprint ] );

	// Make playground navigate to the transformed post of the subject.
	useEffect( () => {
		if ( subject && !! playgroundClient ) {
			void playgroundClient.goTo( '/?p=' + subject.transformedId );
		}
	}, [ subject, playgroundClient ] );

	// Handle field change events.
	async function onFieldChanged(
		name: string,
		field: Field,
		selector: string
	) {
		if ( ! blueprint || ! subject ) {
			return;
		}
		let subjectFieldsToUpdate: object | undefined;
		switch ( subject.type ) {
			case SubjectType.BlogPost:
				switch ( name ) {
					case 'date':
						field = parseBlogPostDate( field.original );
						subjectFieldsToUpdate = {
							date: field,
						};
						break;
					case 'title':
						field = parseBlogPostTitle( field.original );
						subjectFieldsToUpdate = {
							title: field,
						};
						break;
					case 'content':
						field = parseBlogPostContent( field.original );
						subjectFieldsToUpdate = {
							content: field,
						};
						break;
					default:
						throw Error( `unknown field type ${ field.type }` );
				}
				break;
			default:
				throw Error( `unknown subject type ${ subject.type }` );
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

		if ( subjectFieldsToUpdate ) {
			const p = await apiClient!.blogPosts.update(
				subject.id,
				subjectFieldsToUpdate
			);
			setSubject( p );
			void playgroundClient.goTo( '/?p=' + subject.transformedId );
		}
	}

	let isValid = ! blueprint ? false : blueprint.valid;
	if ( ! subject ) {
		isValid = false;
	} else if ( isValid && subject ) {
		let fields: Field[];
		switch ( subject.type ) {
			case SubjectType.BlogPost:
				const blogPost = subject as BlogPost;
				fields = [ blogPost.title, blogPost.date, blogPost.content ];
				break;
			default:
				throw Error( `unknown subject type ${ subject.type }` );
		}
		for ( const f of fields ) {
			if ( f.original === '' || f.parsed === '' ) {
				isValid = false;
				break;
			}
		}
	}

	return (
		<>
			{ ! blueprint || ! subject ? (
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
					<BlogPostBlueprintEditor
						blueprint={ blueprint }
						subject={ subject as BlogPost }
						onFieldChanged={ onFieldChanged }
					/>
				</>
			) }
		</>
	);
}

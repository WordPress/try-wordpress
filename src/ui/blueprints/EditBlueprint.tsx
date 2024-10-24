import { useNavigate, useParams } from 'react-router-dom';
import { ReactElement, useEffect } from 'react';
import { useSessionContext } from '@/ui/session/SessionProvider';
import { BlogPostBlueprintEditor } from '@/ui/blueprints/blog-post/BlogPostBlueprintEditor';
import { ContentBus } from '@/bus/ContentBus';
import { Toolbar } from '@/ui/blueprints/Toolbar';
import { parseBlogPostField } from '@/parser/blog-post';
import { SubjectType } from '@/model/subject/Subject';
import { Screens } from '@/ui/App';
import { useBlueprint } from '@/ui/blueprints/useBlueprint';
import { useSubjectForBlueprint } from '@/ui/blueprints/useSubjectForBlueprint';
import { Field } from '@/model/field/Field';
import { BlogPost, validateBlogPost } from '@/model/subject/BlogPost';
import {
	BlogPostBlueprint,
	validateBlogpostBlueprint,
} from '@/model/blueprint/BlogPost';

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

		blueprint.fields[ name ].selector = selector;

		const subjectFieldsToUpdate: Record< string, Field > = {};
		switch ( subject.type ) {
			case SubjectType.BlogPost:
				blueprint.valid = validateBlogpostBlueprint( blueprint );
				subjectFieldsToUpdate[ name ] = parseBlogPostField(
					name,
					field
				);
				break;
			default:
				throw Error( `unknown subject type ${ subject.type }` );
		}

		const bp = await apiClient!.blueprints.update( blueprint );
		setBlueprint( bp );

		const p = await apiClient!.blogPosts.update(
			subject.id,
			subjectFieldsToUpdate
		);
		setSubject( p );
		void playgroundClient.goTo( '/?p=' + subject.transformedId );
	}

	let isValid = false;
	let editor: ReactElement | undefined;

	if ( blueprint && subject ) {
		switch ( subject.type ) {
			case SubjectType.BlogPost:
				isValid = validateBlogPost( subject as BlogPost );
				editor = (
					<BlogPostBlueprintEditor
						blueprint={ blueprint as BlogPostBlueprint }
						subject={ subject as BlogPost }
						onFieldChanged={ onFieldChanged }
					/>
				);
				break;
			default:
				throw Error( `unknown subject type ${ subject.type }` );
		}
	}

	if ( isValid ) {
		isValid = blueprint!.valid;
	}

	return (
		<>
			{ ! editor ? (
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
					{ editor }
				</>
			) }
		</>
	);
}

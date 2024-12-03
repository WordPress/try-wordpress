import { useNavigate, useParams } from 'react-router-dom';
import { ReactElement, useEffect } from 'react';
import { useSessionContext } from '@/ui/session/SessionProvider';
import { BlueprintEditor } from '@/ui/blueprints/BlueprintEditor';
import { Toolbar } from '@/ui/components/Toolbar';
import { SubjectType } from '@/model/subject/Subject';
import { Screens } from '@/ui/App';
import { useBlueprint } from '@/ui/hooks/useBlueprint';
import { useSubject } from '@/ui/hooks/useSubject';
import { Field } from '@/model/field/Field';
import { BlogPost, validateBlogPost } from '@/model/subject/BlogPost';
import { Page, validatePage } from '@/model/subject/Page';
import { CommandTypes, sendCommandToContent } from '@/bus/Command';
import { Button } from '@wordpress/components';
import { validateBlueprint } from '@/model/Blueprint';
import { parseField } from '@/parser/field';

export function EditBlueprint() {
	const params = useParams();
	const blueprintId = params.blueprintId!;
	const [ blueprint, setBlueprint ] = useBlueprint( blueprintId );
	const [ subject, setSubject ] = useSubject(
		blueprint?.type,
		blueprint?.sourceUrl
	);
	const { session, apiClient, playgroundClient } = useSessionContext();
	const navigate = useNavigate();

	// Make the source site navigate to the blueprint's source URL.
	useEffect( () => {
		if ( blueprint ) {
			void sendCommandToContent( {
				type: CommandTypes.NavigateTo,
				payload: { url: blueprint.sourceUrl },
			} );
		}
	}, [ blueprint ] );

	// Make playground navigate to the transformed post of the page.
	useEffect( () => {
		if ( subject && !! playgroundClient ) {
			void playgroundClient.goTo( subject.previewUrl );
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

		blueprint.selectors[ name ] = selector;

		switch ( subject.type ) {
			case SubjectType.BlogPost:
				blueprint.valid = validateBlueprint( blueprint );
				subject.fields[ name ] = parseField( field );
				break;
			case SubjectType.Page:
				blueprint.valid = validateBlueprint( blueprint );
				subject.fields[ name ] = parseField( field );
				break;
			default:
				throw Error( `unknown subject type ${ subject.type }` );
		}

		const bp = await apiClient!.blueprints.update( blueprint );
		setBlueprint( bp );

		const p = await apiClient!.blogPosts.update(
			subject.id,
			subject as BlogPost
		);
		setSubject( p );
	}

	let isValid = false;
	let editor: ReactElement | undefined;

	if ( blueprint && subject ) {
		editor = (
			<BlueprintEditor
				blueprint={ blueprint }
				subject={ subject }
				onFieldChanged={ onFieldChanged }
			/>
		);

		switch ( subject.type ) {
			case SubjectType.BlogPost:
				isValid = validateBlogPost( subject as BlogPost );
				break;
			case SubjectType.Page:
				isValid = validatePage( subject as Page );
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
						<Button
							variant="primary"
							className="button-block"
							disabled={ ! isValid }
							onClick={ async () => {
								void sendCommandToContent( {
									type: CommandTypes.SwitchToDefaultMode,
									payload: {},
								} );
								navigate(
									Screens.importWithBlueprint(
										session.id,
										blueprint!.id
									)
								);
							} }
						>
							Continue
						</Button>
					</Toolbar>
					{ editor }
				</>
			) }
		</>
	);
}

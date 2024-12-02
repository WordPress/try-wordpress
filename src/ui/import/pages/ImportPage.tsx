import { useEffect, useState } from 'react';
import { useSessionContext } from '@/ui/session/SessionProvider';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelectedPages } from '@/ui/import/pages/useSelectedPages';
import { useSubject } from '@/ui/hooks/useSubject';
import { SubjectType } from '@/model/subject/Subject';
import { Field } from '@/model/field/Field';
import { Page } from '@/model/subject/Page';
import { FieldsEditor } from '@/ui/components/FieldsEditor/FieldsEditor';
import { CommandTypes, sendCommandToContent } from '@/bus/Command';
import { parsePageField } from '@/parser/page';
import { Toolbar } from '@/ui/import/pages/Toolbar';
import { Screens } from '@/ui/App';

// Import a specific page.
// The urls of pages to import come from local storage.
export function ImportPage() {
	const params = useParams();
	const pageIndex = parseInt( params.page! ?? 0, 10 );
	const { session, playgroundClient, apiClient } = useSessionContext();
	const navigate = useNavigate();
	const [ selectedPages ] = useSelectedPages();
	const [ sourceUrl, setSourceUrl ] = useState< string >();
	const [ subject, setPage ] = useSubject( SubjectType.Page, sourceUrl );
	const page: Page | undefined = subject ? ( subject as Page ) : undefined;

	// Find the url of the page to import.
	useEffect( () => {
		if ( ! selectedPages ) {
			return;
		}
		if (
			selectedPages.length === 0 ||
			! selectedPages[ pageIndex ] ||
			selectedPages[ pageIndex ] === ''
		) {
			throw Error( `page with index ${ pageIndex } not found` );
		}
		setSourceUrl( selectedPages[ pageIndex ] );
	}, [ session.id, pageIndex, navigate, selectedPages ] );

	// Make the source site navigate to the source URL.
	useEffect( () => {
		if ( sourceUrl ) {
			void sendCommandToContent( {
				type: CommandTypes.NavigateTo,
				payload: { url: sourceUrl },
			} );
		}
	}, [ sourceUrl ] );

	// Make playground navigate to the transformed post of the page.
	useEffect( () => {
		if ( page && !! playgroundClient ) {
			void playgroundClient.goTo( page.previewUrl );
		}
	}, [ page, playgroundClient ] );

	if ( ! page ) {
		return 'Loading...';
	}

	const fields: { name: string; field: Field }[] = [
		{ name: 'title', field: page.fields.title },
		{ name: 'content', field: page.fields.content },
	];

	const selectors: {
		name: string;
		selector?: string;
	}[] = [
		{
			name: 'title',
			selector: '',
		},
		{
			name: 'content',
			selector: '',
		},
	];

	const backUrl =
		pageIndex === 0
			? Screens.importPagesSelectPages( session.id )
			: Screens.importPagesImportPage( session.id, pageIndex - 1 );
	const continueUrl =
		pageIndex === selectedPages!.length - 1
			? Screens.importPagesDone( session.id )
			: Screens.importPagesImportPage( session.id, pageIndex + 1 );

	return (
		<>
			<Toolbar
				backUrl={ backUrl }
				continueUrl={ continueUrl }
				canContinue={ true }
			/>
			<p>
				Importing page { pageIndex + 1 } of { selectedPages!.length }
			</p>
			<FieldsEditor
				fields={ fields }
				selectors={ selectors }
				onFieldChanged={ async ( name: string, field: Field ) => {
					// @ts-ignore
					page[ name ] = parsePageField( name, field );
					const p = await apiClient!.pages.update( page!.id, page );
					setPage( p );
				} }
			/>
		</>
	);
}

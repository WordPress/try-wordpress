import { useState } from 'react';
import { PreviewTabBar } from '@/ui/preview/PreviewTabBar';
import { Playground, PlaygroundInfo } from '@/ui/preview/Playground';

const tabFront = 0;
const tabAdmin = 1;

export function Preview( props: { sessionId: string } ) {
	const { sessionId } = props;
	const [ currentTab, setCurrentTab ] = useState< number >( tabFront );
	const [ playgroundInfo, setPlaygroundInfo ] = useState< PlaygroundInfo >();

	const isPlaygroundLoading = ! (
		playgroundInfo?.url && playgroundInfo.url.length > 0
	);

	const playground = (
		<Playground
			slug={ sessionId }
			hideOnReady={ true }
			onReady={ ( info ) => {
				setPlaygroundInfo( info );
			} }
		/>
	);

	const tabBar = isPlaygroundLoading ? null : (
		<PreviewTabBar
			entries={ [ 'Preview', 'Admin' ] }
			value={ currentTab }
			className={ 'preview-tabs' }
			tabClassName={ 'preview-tabs-tab' }
			onChange={ ( tab: number ) => setCurrentTab( tab ) }
		/>
	);

	const previewFrontClasses = currentTab === tabFront ? [] : [ 'hidden' ];
	const previewFront = isPlaygroundLoading ? null : (
		<iframe
			title={ `${ sessionId }-front` }
			src={ playgroundInfo.url }
			className={ previewFrontClasses.join( ' ' ) }
		/>
	);

	const previewAdminClasses = currentTab === tabAdmin ? [] : [ 'hidden' ];
	const previewAdmin = isPlaygroundLoading ? null : (
		<iframe
			title={ `${ sessionId }-admin` }
			src={ `${ playgroundInfo.url }/wp-admin/` }
			className={ previewAdminClasses.join( ' ' ) }
		/>
	);

	return (
		<>
			{ playground }
			{ tabBar }
			{ previewFront }
			{ previewAdmin }
		</>
	);
}

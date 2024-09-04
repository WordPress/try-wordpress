import { useState } from 'react';
import { PreviewTabBar } from '@/ui/preview/PreviewTabBar';
import { Playground, PlaygroundInfo } from '@/ui/preview/Playground';

const tabFront = 0;
const tabAdmin = 1;
const defaultTab = tabFront;

export function Preview( props: { sessionId: string } ) {
	const { sessionId } = props;
	const [ currentTab, setCurrentTab ] = useState< number >( defaultTab );
	const [ playgroundInfo, setPlaygroundInfo ] = useState< PlaygroundInfo >();

	const previewAdminUrl =
		playgroundInfo?.url && playgroundInfo.url?.length > 0
			? `${ playgroundInfo.url }/wp-admin/`
			: '';

	const isPlaygroundLoading = previewAdminUrl === '';

	const tabBar = (
		<PreviewTabBar
			entries={ [ 'Preview', 'Admin' ] }
			value={ currentTab }
			className="preview-tabs"
			tabClassName={ 'preview-tabs-tab' }
			onChange={ ( tab: number ) => setCurrentTab( tab ) }
		/>
	);

	const previewFront = (
		<Playground
			slug={ sessionId }
			onReady={ ( info ) => {
				setPlaygroundInfo( info );
			} }
		/>
	);

	const previewAdmin = (
		<iframe title={ `${ sessionId }-admin` } src={ previewAdminUrl } />
	);

	const showTabBar = ! isPlaygroundLoading;
	const showPreviewFront = currentTab === tabFront;
	const showPreviewAdmin = currentTab === tabAdmin;

	return (
		<>
			<div className={ showTabBar ? '' : 'hidden' }>{ tabBar }</div>
			<div
				className={
					showPreviewFront
						? 'preview-tab-panel'
						: 'preview-tab-panel hidden'
				}
			>
				{ previewFront }
			</div>
			<div
				className={
					showPreviewAdmin
						? 'preview-tab-panel'
						: 'preview-tab-panel hidden'
				}
			>
				{ previewAdmin }
			</div>
		</>
	);
}

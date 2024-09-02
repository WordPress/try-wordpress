import { useState } from 'react';
import { PreviewTabBar } from '@/ui/preview/PreviewTabBar';
import { Playground } from '@/ui/preview/Playground';

export function Preview( props: { sessionId: string } ) {
	const { sessionId } = props;
	const [ currentTab, setCurrentTab ] = useState< number >( 0 );

	return (
		<>
			<PreviewTabBar
				entries={ [ 'Preview', 'Admin' ] }
				value={ currentTab }
				className={ 'preview-tabs' }
				tabClassName={ 'preview-tabs-tab' }
				onChange={ ( tab: number ) => setCurrentTab( tab ) }
			/>
			<Playground slug={ sessionId } />
		</>
	);
}

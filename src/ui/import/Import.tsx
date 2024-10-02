import { useParams } from 'react-router-dom';
import { useBlueprint } from '@/ui/blueprints/useBlueprint';
import { humanReadablePostType } from '@/model/content/Post';
import { Toolbar } from '@/ui/blueprints/Toolbar';
import { ReactElement } from 'react';

export function Import() {
	const params = useParams();
	const blueprintId = params.blueprintId!;
	const [ blueprint ] = useBlueprint( blueprintId );

	const fields: ReactElement[] = [];
	if ( blueprint ) {
		for ( const [ name, field ] of Object.entries( blueprint.fields ) ) {
			fields.push(
				<li key={ name }>
					{ name }: { field.selector }
				</li>
			);
		}
	}

	return (
		<>
			{ ! blueprint ? (
				'Loading...'
			) : (
				<>
					<Toolbar>
						<button
							onClick={ async () => {
								console.log( 'TODO' );
							} }
						>
							Continue (TODO)
						</button>
					</Toolbar>
					We&apos;ll now import{ ' ' }
					{ humanReadablePostType.get( blueprint.type ) }s using the
					following selectors:
					<br />
					<br />
					<ul>{ fields }</ul>
				</>
			) }
		</>
	);
}

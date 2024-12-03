import { useSessionContext } from '@/ui/session/SessionProvider';
import { useNavigate } from 'react-router-dom';
import { Screens } from '@/ui/App';
import { SubjectType } from '@/model/Subject';
import { Button } from '@wordpress/components';

export function ViewSession() {
	const { session } = useSessionContext();
	const navigate = useNavigate();

	return (
		<>
			<h1>
				{ session.title } ({ session.url })
			</h1>
			<ul>
				<li>
					<Button
						variant="primary"
						className="button-block"
						onClick={ () =>
							navigate(
								Screens.blueprints.new(
									session.id,
									SubjectType.BlogPost
								)
							)
						}
					>
						Import Posts
					</Button>
				</li>
				<li>
					<Button
						variant="primary"
						className="button-block"
						onClick={ () =>
							navigate( Screens.importPagesStart( session.id ) )
						}
					>
						Import Pages
					</Button>
				</li>
			</ul>
		</>
	);
}

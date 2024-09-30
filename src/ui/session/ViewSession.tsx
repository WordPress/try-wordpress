import { useSessionContext } from '@/ui/session/SessionProvider';
import { useNavigate } from 'react-router-dom';
import { Screens } from '@/ui/App';

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
					<button
						onClick={ () =>
							navigate( Screens.flows.blogPost.new( session.id ) )
						}
					>
						Import Blog Post
					</button>
				</li>
			</ul>
		</>
	);
}

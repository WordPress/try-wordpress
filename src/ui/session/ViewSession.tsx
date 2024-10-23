import { useSessionContext } from '@/ui/session/SessionProvider';
import { useNavigate } from 'react-router-dom';
import { Screens } from '@/ui/App';
import { PostType } from '@/model/subject/Post';

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
							navigate(
								Screens.blueprints.new(
									session.id,
									PostType.BlogPost
								)
							)
						}
					>
						Import Blog Posts
					</button>
				</li>
			</ul>
		</>
	);
}

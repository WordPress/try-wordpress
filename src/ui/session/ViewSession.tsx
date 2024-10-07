import { useSessionContext } from '@/ui/session/SessionProvider';
import { useNavigate } from 'react-router-dom';
import { Screens } from '@/ui/App';
import { PostType } from '@/model/content/Post';

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
								Screens.posts.new(
									session.id,
									PostType.BlogPost
								)
							)
						}
					>
						Import Blog Post
					</button>
				</li>
			</ul>
		</>
	);
}

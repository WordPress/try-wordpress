import { useParams } from 'react-router-dom';

export function EditBlogPost() {
	const { postId } = useParams();

	return <div>edit: { postId }</div>;
}

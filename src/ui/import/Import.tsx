import { useParams } from 'react-router-dom';

export function Import() {
	const params = useParams();
	const blueprintId = params.blueprintId!;
	return <>{ blueprintId }</>;
}

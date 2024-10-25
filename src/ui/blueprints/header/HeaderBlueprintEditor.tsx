import { Field } from '@/model/field/Field';
import { HeaderBlueprint } from '@/model/blueprint/Header';
import { Header } from '@/model/subject/Header';

interface Props {
	blueprint: HeaderBlueprint;
	subject: Header;
	onFieldChanged: ( name: string, field: Field, selector: string ) => void;
}

export function HeaderBlueprintEditor( props: Props ) {
	const {} = props;
	return <>TODO</>;
}

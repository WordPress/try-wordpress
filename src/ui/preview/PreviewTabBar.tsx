export function PreviewTabBar( props: {
	entries: string[];
	value: number;
	className: string;
	tabClassName: string;
	hidden?: boolean;
	onChange: ( newValue: number ) => void;
} ) {
	const { entries, value, className, tabClassName, onChange } = props;

	const tabs = entries.map( ( label, index ) => {
		const key = label.toLowerCase().replace( ' ', '-' );
		const classes = [ tabClassName ];
		if ( value === index ) {
			classes.push( 'selected' );
		}
		return (
			<div key={ key } className={ classes.join( ' ' ) }>
				<input
					id={ key }
					name="tabs"
					type="radio"
					onClick={ () => onChange( index ) }
					checked={ value === index }
				/>
				<label htmlFor={ key }>{ label }</label>
			</div>
		);
	} );

	return <div className={ className }>{ tabs }</div>;
}

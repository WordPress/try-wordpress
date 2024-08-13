import { getStylesString } from '../../src/content/utils/dom';

describe( 'Style formatting', function () {
	test( 'Convert styles object to a string', () => {
		const styles = {
			color: 'red',
			'background-color': 'blue',
		};

		const result = getStylesString( styles );

		expect( result ).toBe( 'color:red;background-color:blue' );
	} );
} );

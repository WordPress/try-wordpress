import {
	supportsColor,
	supportsBorderRadius,
	supportsBorder,
	supportsTypography,
	supportsDisplayTypes,
	supportsDimensions,
} from './block-features.js';

const defaultBlockElementSupports = [
	...supportsColor,
	...supportsTypography,
	...supportsDimensions,
];

/**
 * Get the supported properties for a given block.
 *
 * @param {string} tagName The tag name of the block.
 * @return {Array} The supported properties.
 */
export const getBlockSupports = ( tagName ) => {
	switch ( tagName.toLowerCase() ) {
		case 'div':
		case 'ul':
		case 'li':
		case 'section':
		case 'main':
		case 'nav':
			return [
				...defaultBlockElementSupports,
				...supportsBorderRadius,
				...supportsBorder,
				...supportsDisplayTypes,
			];
		case 'h1':
		case 'h2':
		case 'h3':
		case 'h4':
		case 'h5':
		case 'h6':
		case 'p':
			return defaultBlockElementSupports;
		case 'img':
			return [ ...supportsBorderRadius, ...supportsBorder ];
		default:
			return [];
	}
};

/**
 * Depending on the property and the tag, we might want to ignore zero values.
 * For example: margin: 0px is irrelevant on a DIV but relevant on a P or H1.
 *
 * @param {string} tagName  The tag name of the block.
 * @param {string} property The property to check.
 * @param {string} value    The value of the property.
 * @return {boolean} Whether the property should be ignored.
 */
export const shouldIgnoreValue = ( tagName, property, value ) => {
	const isZeroValue = value === '0' || value === '0px';
	let relevantProperties = [];

	switch ( tagName.toLowerCase() ) {
		case 'div':
		case 'section':
		case 'main':
		case 'ul':
		case 'li':
		case 'nav':
			relevantProperties = [
				...supportsBorderRadius,
				...supportsBorder,
				...supportsDimensions,
			];
			break;
		default:
			relevantProperties = [];
	}

	return relevantProperties.includes( property ) && isZeroValue;
};

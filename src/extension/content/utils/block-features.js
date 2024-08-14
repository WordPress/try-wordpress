/**
 * Each of these arrays contains a list of CSS properties that are supported by the block.
 * Maybe in the future we should use the block supports API to get this information.
 * See: https://developer.wordpress.org/block-editor/reference-guides/block-api/block-supports/
 */

export const supportsColor = [ 'color', 'background-color' ];

export const supportsBorderRadius = [
	'border-top-left-radius',
	'border-top-right-radius',
	'border-bottom-left-radius',
	'border-bottom-right-radius',
];

export const supportsBorder = [
	'border-top-color',
	'border-top-width',
	'border-right-color',
	'border-right-width',
	'border-bottom-color',
	'border-bottom-width',
	'border-left-color',
	'border-left-width',
];

export const supportsTypography = [
	'font-size',
	'font-weight',
	'font-family',
	'line-height',
	'text-align',
];

export const supportsDisplayTypes = [
	'display',
	'flex-direction',
	'justify-content',
	'align-items',
	'flex-wrap',
	'flex-basis',
	'grid-template-columns',
	'gap',
	'row-gap',
	'column-gap',
];

export const supportsDimensions = [
	'padding-right',
	'padding-left',
	'padding-top',
	'padding-bottom',
	'margin-right',
	'margin-left',
	'margin-top',
	'margin-bottom',
];

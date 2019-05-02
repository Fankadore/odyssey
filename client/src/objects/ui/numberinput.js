import { TextInput } from '../../lib/phaser-ui.js';

export default class NumberInput extends TextInput {
	constructor(scene, x, y, defaultMessage, callback) {
		super(scene, x, y, 'number-input', 'number-input-active', false, defaultMessage, null, callback);
	}
}

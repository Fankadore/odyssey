import { TextInput } from '../../lib/phaser-ui.js';

export default class InputBox extends TextInput {
	constructor(scene, x, y, defaultMessage, callback) {
		super(scene, x, y, 'text-input', 'text-input-active', false, defaultMessage, null, callback);
	}
}

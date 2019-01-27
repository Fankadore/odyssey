import { TextInput } from '../../lib/phaser-ui.js';

export default class PasswordBox extends TextInput {
	constructor(scene, x, y, callback) {
		super(scene, x, y, 'text-input', 'text-input-active', true, "Password", null, callback);
	}
}

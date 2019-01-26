import TextInput from './textinput.js';

export default class InputBox extends TextInput {
	constructor(scene, x, y, defaultMessage, callback) {
		super(scene, x, y, 'text-input', 'text-input-active', false, defaultMessage, callback);
	}
}

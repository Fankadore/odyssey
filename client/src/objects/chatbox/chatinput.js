import { TextInput } from '../../lib/phaser-ui.js';

export default class ChatInput extends TextInput {
	constructor(scene, x, y, defaultMessage, callback) {
		super(scene, x, y, 'chatbox-input', 'chatbox-input-active', false, defaultMessage, null, callback).setOrigin(0);
		this.inputText.setColor('#ffffff');
		this.defaultMessage.setColor('#999999');
	}
}

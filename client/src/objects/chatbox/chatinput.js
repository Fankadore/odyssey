import { TextInput } from '../../lib/phaser-ui.js';
import config from '../../config.js';

export default class ChatInput extends TextInput {
	constructor(scene, callback) {

		super(scene, config.CHATINPUT.x, config.CHATINPUT.y, 'chatbox-input', 'chatbox-input-active', false, "", null, callback).setOrigin(0);
		this.inputText.setColor('#ffffff');
		this.defaultMessage.setColor('#999999');
	}
}

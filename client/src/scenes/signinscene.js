import { Scene } from '../lib/phaser.js';
import config from '../config.js';
import SignInPanel from '../panels/signinpanel.js';

export default class SignInScene extends Scene {
	constructor() {
		super({key: 'signInScene'});
	}
	
	create() {
		this.client = this.scene.get('clientScene');

		const centreX = config.GAME.x + (config.GAME.width / 2);
		const centreY = config.GAME.y + (config.GAME.height / 2);
		this.signInPanel = new SignInPanel(this, centreX, centreY);

		this.inputKeys = this.input.keyboard.addKeys(config.KEYBOARD_KEYS);
		this.input.keyboard.on('keydown', event => this.onKeyDown(event));
	}

	onKeyDown(event) {
		let key = event.key;
		key = key.replace(/Page/g, 'Page_');
		key = key.replace(/Arrow/g, '');
		if (key === ' ') key = 'Space';

		if (this.signInPanel.active) this.signInPanel.onKeyDown(key);
	}
}

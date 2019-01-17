import { Scene } from '../lib/phaser.js';
import config from '../config.js';

import TextInput from '../objects/menu/textinput.js';

export default class SignInScene extends Scene {
	constructor() {
		super({key: 'signInScene'});
	}

	create() {
		this.graphics = this.add.graphics();
		this.graphics.fillStyle(0x000000);
		this.graphics.fillRect(0, 0, config.MAP_WIDTH, config.MAP_HEIGHT);
		this.usernameBox = new TextInput(this, (config.MAP_WIDTH / 2) - 64, (config.MAP_HEIGHT / 2.5) + 32, 128, 24);
		this.passwordBox = new TextInput(this, (config.MAP_WIDTH / 2) - 64, (config.MAP_HEIGHT / 2.5) + 64, 128, 24);
		
		let style = { fontFamily: 'Arial', fontSize: (config.FONT_SIZE * 3) + 'px', fill: '#ffffff' };
		this.add.text(config.MAP_WIDTH / 2, config.MAP_HEIGHT / 5, "Odyssey", style).setOrigin(0.5);

		style = { fontFamily: 'Arial', fontSize: (config.FONT_SIZE * 2) + 'px', fill: '#ffffff' };
		this.add.text(config.MAP_WIDTH / 2, config.MAP_HEIGHT / 2.5, "Sign In", style).setOrigin(0.5);

		this.usernameBox.setFocus(true);

		const client = this.scene.get('clientScene');
		this.input.on('pointerdown', pointer => {
			client.emitSignIn("Fank", "asd");
		});
	}

	update() {

	}
}

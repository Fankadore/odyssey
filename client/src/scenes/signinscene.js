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
		this.passwordBox.password = true;

		let style = { fontFamily: 'Arial', fontSize: (config.FONT_SIZE * 3) + 'px', fill: '#ffffff' };
		this.add.text(config.MAP_WIDTH / 2, config.MAP_HEIGHT / 5, "Odyssey", style).setOrigin(0.5);

		style = { fontFamily: 'Arial', fontSize: (config.FONT_SIZE * 2) + 'px', fill: '#ffffff' };
		this.add.text(config.MAP_WIDTH / 2, config.MAP_HEIGHT / 2.5, "Sign In", style).setOrigin(0.5);

		const client = this.scene.get('clientScene');
		this.createKeyboardInputs();
		this.input.on('pointerdown', pointer => {
			// client.emitSignIn("Fank", "asd");
		});
		this.activeBox = null;
		this.setActive(this.usernameBox);
	}
	
	createKeyboardInputs() {
		this.inputKeys = this.input.keyboard.addKeys('ARROWLEFT,ARROWRIGHT,ARROWUP,ARROWDOWN,SPACE,BACKSPACE,DELETE,CONTROL,SHIFT,ALT,ALTGRAPH,ENTER,TAB,ESCAPE,CAPSLOCK,PAGE_UP,PAGE_DOWN,HOME,END,INSERT,F1,F2,F3,F4,F5,F6,F7,F8,F9,F10,F11,F12');
		this.input.keyboard.on('keydown', event => {
			let key = event.key;
			key = key.replace(/Page/g, 'Page_');
			if (key === ' ') key = 'Space';

			if (this.inputKeys[key.toUpperCase()]) {
				if (key === 'ArrowLeft') {
					// TODO: Move cursor left
				}
				else if (key === 'ArrowRight') {
					// TODO: Move cursor right
				}
				else if (key === 'Tab') {
					if (this.activeBox === this.usernameBox) this.setActive(this.passwordBox);
					else this.setActive(this.usernameBox);
				}
				else if (key === 'Enter') {
					// TODO: Select next input box or send sign in request
					if (this.activeBox === this.usernameBox) {
						this.setActive(this.passwordBox);
					}
					else if (this.activeBox === this.passwordBox) {
						const client = this.scene.get('clientScene');
						const username = this.usernameBox.message;
						const password = this.passwordBox.message;
						client.emitSignIn(username, password);
					}
					else {
						this.setActive(this.usernameBox);
					}
				}
				else if (key === 'Space') {
					this.activeBox.addChar(' ');
				}
				else if (key === 'Backspace' || key === 'Delete') {	// Delete
					this.activeBox.removeChar()
				}
			}
			else {
				if (this.inputKeys['SHIFT'].isDown) key = key.toUpperCase();
				this.activeBox.addChar(key);
			}
		});
	}

	setActive(inputBox) {
		if (this.activeBox) this.activeBox.setFocus(false);
		this.activeBox = inputBox;
		this.activeBox.setFocus(true);
	}
}

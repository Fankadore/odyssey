import { Scene } from '../lib/phaser.js';
import config from '../config.js';

import Panel from '../objects/ui/panel.js';
import InputBox from '../objects/ui/inputbox.js';
import PasswordBox from '../objects/ui/passwordbox.js';
import SubmitButton from '../objects/ui/submitbutton.js';
import ToggleLight from '../objects/ui/togglelight.js';

export default class SignInScene extends Scene {
	constructor() {
		super({key: 'signInScene'});
	}

	preload() {
		this.load.setPath('client/assets/gfx/');
		this.load.image('panel-large', 'panel-large.png');
		this.load.image('panel-medium', 'panel-medium.png');
		this.load.image('text-input', 'text-input.png');
		this.load.image('text-input-active', 'text-input-active.png');
		this.load.image('toggle', 'toggle.png');
		this.load.image('toggle-active', 'toggle-active.png');
		this.load.image('button', 'button.png');
		this.load.image('button-active', 'button-active.png');
		this.load.image('button-slim', 'button-slim.png');
		this.load.image('button-slim-active', 'button-slim-active.png');
	}

	create() {
		this.client = this.scene.get('clientScene');
		const centreX = config.GAME_LEFT + (config.GAME_WIDTH / 2);
		const centreY = config.GAME_TOP + (config.GAME_HEIGHT / 2);

		// Panel
		this.backgroundPanel = new Panel(this, centreX, centreY, 'panel-large');
		this.signInPanel = new Panel(this, centreX, centreY + 64, 'panel-medium');
		
		// Title
		let style = { fontFamily: 'Arial', fontSize: (config.FONT_SIZE * 3) + 'px', fill: '#ffffff' };
		this.add.text(centreX, centreY / 2, "Odyssey", style).setOrigin(0.5);
		
		// Sign In / Sign Up Buttons
		this.activeToggle = null;
		this.signInToggle = new ToggleLight(this, centreX - 60, centreY - 50, "Sign In", (toggle) => this.setActiveToggle(toggle));
		this.signUpToggle = new ToggleLight(this, centreX + 60, centreY - 50, "Sign Up", (toggle) => this.setActiveToggle(toggle));

		// Inputs Boxes
		this.activeBox = null;
		this.usernameBox = new InputBox(this, centreX, centreY + 16, "Username", (box) => this.setActiveBox(box));
		this.passwordBox = new PasswordBox(this, centreX, centreY + 48, (box) => this.setActiveBox(box));
		this.emailBox = new InputBox(this, centreX, centreY + 80, "Email", (box) => this.setActiveBox(box));
		
		// Submit Button
		this.submitButton = new SubmitButton(this, centreX, centreY + 128, () => this.submitInfo());

		this.createKeyboardInputs();
		this.setActiveBox(this.usernameBox);
		this.setActiveToggle(this.signInToggle);
	}

	createKeyboardInputs() {
		this.inputKeys = this.input.keyboard.addKeys(config.KEYBOARD_KEYS);
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
					if (this.activeBox === this.usernameBox) this.setActiveBox(this.passwordBox);
					else if (this.activeBox === this.passwordBox) {
						if (this.activeToggle === this.signInToggle) this.setActiveBox(this.usernameBox);
						else if (this.activeToggle === this.signUpToggle) this.setActiveBox(this.emailBox);
					}
					else this.setActiveBox(this.usernameBox);
				}
				else if (key === 'Enter') {
					// TODO: Select next input box or send sign in request
					if (this.activeBox === this.usernameBox) {
						this.setActiveBox(this.passwordBox);
					}
					else if (this.activeBox === this.passwordBox) {
						if (this.activeToggle === this.signInToggle) this.submitInfo();
						else if (this.activeToggle === this.signUpToggle) this.setActiveBox(this.emailBox);
					}
					else if (this.activeBox === this.emailBox) {
						if (this.activeToggle === this.signInToggle) this.setActiveBox(this.usernameBox);
						else if (this.activeToggle === this.signUpToggle) this.submitInfo();
					}
					else {
						this.setActiveBox(this.usernameBox);
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
				if (this.inputKeys.SHIFT.isDown) key = key.toUpperCase();
				this.activeBox.addChar(key);
			}
		});
	}

	setActiveBox(inputBox) {
		if (this.activeBox) this.activeBox.setFocus(false);
		this.activeBox = inputBox;
		this.activeBox.setFocus(true);
	}

	setActiveToggle(toggle) {
		if (this.activeToggle) this.activeToggle.onUp();
		this.activeToggle = toggle;
		this.activeToggle.onDown();
		if (toggle === this.signInToggle) {
			this.emailBox.setVisible(false);
			if (this.activeBox === this.emailBox) this.setActiveBox(this.usernameBox);
		}
		else if (toggle === this.signUpToggle) {
			this.emailBox.setVisible(true);
		}
	}

	submitInfo() {
		const username = this.usernameBox.message;
		const password = this.passwordBox.message;
		if (!username || !password) {
			this.setActiveBox(this.usernameBox);
		}
		else {
			if (this.activeToggle === this.signInToggle) this.client.emitSignIn(username, password);
			else if (this.activeToggle === this.signUpToggle) this.client.emitSignUp(username, password);
		}
	}
}

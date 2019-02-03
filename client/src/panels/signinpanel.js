import { Panel } from '../lib/phaser-ui.js';
import config from '../config.js';

import InputBox from '../objects/ui/inputbox.js';
import PasswordBox from '../objects/ui/passwordbox.js';
import SubmitButton from '../objects/ui/submitbutton.js';
import ToggleLight from '../objects/ui/togglelight.js';

export default class SignInPanel extends Panel {
	constructor(scene, x, y) {
    super(scene, x, y, true);
    
		// Panel
		this.backgroundPanel = scene.add.image(x, y, 'background-large');
		this.signInPanel = scene.add.image(x, y + 64, 'background-medium');
		
		// Title
		let style = { fontFamily: 'Arial', fontSize: '36px', fill: '#ffffff' };
		this.title = scene.add.text(x, y / 2, "Odyssey", style).setOrigin(0.5);
		
		// Sign In / Sign Up Buttons
		this.activeToggle = null;
		this.signInToggle = new ToggleLight(scene, x - 60, y - 50, "Sign In", (toggle) => this.setActiveToggle(toggle));
		this.signUpToggle = new ToggleLight(scene, x + 60, y - 50, "Sign Up", (toggle) => this.setActiveToggle(toggle));

		// Inputs Boxes
		this.activeBox = null;
		this.usernameBox = new InputBox(scene, x, y + 16, "Username", (box) => this.setActiveBox(box));
		this.passwordBox = new PasswordBox(scene, x, y + 48, (box) => this.setActiveBox(box));
		this.emailBox = new InputBox(scene, x, y + 80, "Email", (box) => this.setActiveBox(box));
		
		// Submit Button
		this.submitButton = new SubmitButton(scene, x, y + 128, () => this.submitInfo());

		this.setActiveBox(this.usernameBox);
    this.setActiveToggle(this.signInToggle);
    
		this.children = [this.backgroundPanel, this.signInPanel, this.title, this.signInToggle, this.signUpToggle, this.usernameBox, this.passwordBox, this.emailBox, this.submitButton];
		this.setActive(true);
	}

	setActive(value) {
		super.setActive(value);
		if (this.activeToggle = this.signInToggle) this.emailBox.setVisible(false);
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
			if (this.activeToggle === this.signInToggle) this.scene.client.emitSignIn(username, password);
			else if (this.activeToggle === this.signUpToggle) this.scene.client.emitSignUp(username, password);
		}
	}

  onKeyDown(key) {
    if (this.scene.inputKeys[key.toUpperCase()]) {
			if (key === 'Left') {	// Move cursor left
				// TODO: Move cursor left
			}
			else if (key === 'Right') {	// Move cursor right
				// TODO: Move cursor right
			}
			else if (key === 'Tab') {	// Select next inputbox
				if (this.activeBox === this.usernameBox) this.setActiveBox(this.passwordBox);
				else if (this.activeBox === this.passwordBox) {
					if (this.activeToggle === this.signInToggle) this.setActiveBox(this.usernameBox);
					else if (this.activeToggle === this.signUpToggle) this.setActiveBox(this.emailBox);
				}
				else this.setActiveBox(this.usernameBox);
			}
			else if (key === 'Enter') {	// Select next inputbox or submit signin info
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
			else if (key === 'Backspace' || key === 'Delete') {
				this.activeBox.removeChar()
			}
		}
		else {
			if (this.scene.inputKeys.SHIFT.isDown) key = key.toUpperCase();
			this.activeBox.addChar(key);
		}
  }
}

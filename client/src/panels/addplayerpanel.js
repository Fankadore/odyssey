import { Panel, Button } from '../lib/phaser-ui.js';
import InputBox from '../objects/ui/inputbox.js';
import SubmitButton from '../objects/ui/submitbutton.js';
import ToggleLightSlim from '../objects/ui/togglelightslim.js';
import ButtonLightSlim from '../objects/ui/buttonlightslim.js';
import CloseButton from '../objects/ui/closebutton.js';

export default class AddPlayerPanel extends Panel {
	constructor(scene, x, y, admin) {
		super(scene, x, y, false);
		this.admin = admin;

		// Panel
		this.background = scene.add.image(x, y, 'background-large');
		this.closeButton = new CloseButton(scene, this.background.x + (this.background.width / 2) - 16, this.background.y - (this.background.height / 2) + 16, () => scene.switchPanel("selectPlayer"));
		this.width = this.background.width;
		this.height = this.background.height;

		// Title
		let style = { fontFamily: 'Arial', fontSize: '36px', fill: '#ffffff' };
		this.title = scene.add.text(x, y - 132, "Add Player", style).setOrigin(0.5);

		// Name Field
		this.nameBox = new InputBox(scene, x, y - 64, "Player Name");
		this.nameBox.setFocus(true);

		// Add Player Template Button - Admin
		this.addTemplateButton = new ButtonLightSlim(scene, x, y - 32, "Add Class", (button) => scene.switchPanel("addTemplate"));

		// Player Template Buttons
		this.activeToggle = null;
		this.templateToggles = [];
		if (scene.playerTemplates) {
			for (let i = 0; i < scene.playerTemplates.length; i++) {
				const template = scene.playerTemplates[i];
				this.templateToggles[i] = new ToggleLightSlim(scene, x, y + (i * 32), template.name, (toggle) => this.setActiveToggle(toggle));
				this.templateToggles[i].templateId = scene.playerTemplates[i]._id;
			}
		}

		// Submit Button
		this.submitButton = new SubmitButton(scene, x, y + 160, () => this.addPlayer());

		this.children = [this.background, this.closeButton, this.title, this.nameBox, this.addTemplateButton, this.submitButton].concat(this.templateToggles);
		this.setActive(false);
	}

	setActiveToggle(toggle) {
		if (this.activeToggle) this.activeToggle.onUp();
		this.activeToggle = toggle;
		this.activeToggle.onDown();
	}

	addPlayer() {
		if (!this.activeToggle) return;
		const name = this.nameBox.message;
		const templateId = this.activeToggle.templateId;
		if (!name || !templateId) return;
		this.scene.client.emitAddPlayer(name, templateId);
	}

	onKeyDown(key) {
		if (this.scene.inputKeys[key.toUpperCase()]) {
			if (key === 'Left') {	// Move cursor left
				// TODO: Move cursor left
			}
			else if (key === 'Right') {	// Move cursor right
				// TODO: Move cursor right
			}
			else if (key === 'Tab') {	//	Switch selected template
				
			}
			else if (key === 'Enter') {	// Add player
				this.addPlayer();
			}
			else if (key === 'Escape') {	// Return to player select
				this.scene.switchPanel("selectPlayer");
			}
			else if (key === 'Space') {
				this.nameBox.addChar(' ');
			}
			else if (key === 'Backspace' || key === 'Delete') {
				this.nameBox.removeChar();
			}
		}
		else {
			if (this.scene.inputKeys.SHIFT.isDown) key = key.toUpperCase();
			this.nameBox.addChar(key);
		}
	}
}

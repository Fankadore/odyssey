import Phaser from '../../lib/phaser.js';
import config from '../../config.js';

import Panel from '../ui/panel.js';
import InputBox from '../ui/inputbox.js';
import SubmitButton from '../ui/submitbutton.js';
import ToggleLightSlim from '../ui/togglelightslim.js';
import CloseButton from '../ui/closebutton.js';

export default class AddPlayerPanel extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);
    
    // Panel
    this.background = new Panel(scene, 0, 0, 'panel-large');
    this.closeButton = new CloseButton(scene, this.background.x + (this.background.width / 2) - 16, this.background.y - (this.background.height / 2) + 16, scene.switchPanel.bind(scene));

    // Title
		let style = { fontFamily: 'Arial', fontSize: '36px', fill: '#ffffff' };
    this.title = scene.add.text(0, -132, "Add Player", style).setOrigin(0.5);

    // Name Field
    this.nameBox = new InputBox(scene, 0, -32, "Player Name");
    this.nameBox.setFocus(true);

    // Player Template Buttons
    this.activeToggle = null;
    this.templateToggles = [];
		if (scene.playerTemplates) {
      for (let i = 0; i < scene.playerTemplates.length; i++) {
				const template = scene.playerTemplates[i];
        this.templateToggles[i] = new ToggleLightSlim(scene, 0, 16 + (i * 32), template.name, (toggle) => this.setActiveToggle(toggle));
        this.templateToggles[i].templateId = scene.playerTemplates[i]._id;
      }
    }

    // Submit Button
    this.submitButton = new SubmitButton(scene, 0, 160, () => this.submitInfo());

    // Keyboard Inputs
    this.inputKeys = scene.input.keyboard.addKeys(config.KEYBOARD_KEYS);
    scene.input.keyboard.on('keydown', event => {
      let key = event.key;
			if (key === ' ') key = 'Space';

			if (this.inputKeys[key.toUpperCase()]) {
				if (key === 'ArrowLeft') {
					// TODO: Move cursor left
				}
				else if (key === 'ArrowRight') {
					// TODO: Move cursor right
        }
        else if (key === 'Enter') {
          this.submitInfo();
        }
				else if (key === 'Space') {
					this.nameBox.addChar(' ');
				}
				else if (key === 'Backspace' || key === 'Delete') {	// Delete
					this.nameBox.removeChar()
				}
			}
			else {
				if (this.inputKeys.SHIFT.isDown) key = key.toUpperCase();
				this.nameBox.addChar(key);
			}
    });

    this.add([this.background, this.closeButton, this.title, this.nameBox, this.submitButton].concat(this.templateToggles));
    scene.add.existing(this);
  }

  setActiveToggle(toggle) {
    if (this.activeToggle) this.activeToggle.onUp();
    this.activeToggle = toggle;
    this.activeToggle.onDown();
  }

  submitInfo() {
    if (!this.activeToggle) return;
    const name = this.nameBox.message;
    const templateId = this.activeToggle.templateId;
    if (!name || !templateId) return;
    this.scene.client.emitAddPlayer(name, templateId);
  }
}

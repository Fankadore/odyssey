import { Panel } from '../lib/phaser-ui.js';
import CloseButton from '../objects/ui/closebutton.js';

export default class AdminPanel extends Panel {
	constructor(scene, x, y) {
		super(scene, x, y, false);

		// Panel
		this.background = scene.add.image(x, y, 'background-large');
		this.closeButton = new CloseButton(scene, this.background.x + (this.background.width / 2) - 16, this.background.y - (this.background.height / 2) + 16, () => scene.switchPanel("selectPlayer"));
		this.width = this.background.width;
		this.height = this.background.height;

		// Title
		let style = { fontFamily: 'Arial', fontSize: '36px', fill: '#ffffff' };
		this.title = scene.add.text(x, y - 132, "Admin", style).setOrigin(0.5);

		this.children = [this.background, this.closeButton, this.title];
		this.setActive(false);
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

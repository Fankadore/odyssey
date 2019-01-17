import Phaser from '../../lib/phaser.js';
import config from '../../config.js';

export default class InputBox extends Phaser.GameObjects.GameObject {
	constructor(scene, x, y, width, height) {
		super(scene);
		scene.graphics.fillStyle(0xFFFFFF);
		this.background = new Phaser.Geom.Rectangle(x, y, width, height);
		scene.graphics.fillRectShape(this.background);
		this.inputText = scene.add.text(x + 4, y, "Testing Testing", config.FONT_STYLE).setOrigin(0, -0.25);
		this.focus = false;
	}

	update() {
		if (this.focus) {
			// Update Cursor
		}
	}
	
	setFocus(focus) {
		this.focus = focus;
		if (focus) this.scene.graphics.lineStyle(2, 0xFF0000);
		else this.scene.graphics.lineStyle(2, 0x000000);
		this.scene.graphics.strokeRectShape(this.background);
	}

	addChar(char) {
		this.inputText.text += char;
	}

	removeChar() {
		this.inputText.text.pop();
	}
}

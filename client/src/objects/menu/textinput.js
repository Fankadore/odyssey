import Phaser from '../../lib/phaser.js';
import config from '../../config.js';

export default class InputBox extends Phaser.GameObjects.GameObject {
	constructor(scene, x, y, width, height, defaultMessage = "") {
		super(scene);
		this.password = false;
		this.message = defaultMessage;
		scene.graphics.fillStyle(0xFFFFFF);
		this.background = new Phaser.Geom.Rectangle(x, y, width, height);
		scene.graphics.fillRectShape(this.background);
		this.inputText = scene.add.text(x + 4, y, "", config.FONT_STYLE).setOrigin(0, -0.25);
	}
	
	setFocus(focus) {
		if (focus) this.scene.graphics.lineStyle(2, 0xFF0000);
		else this.scene.graphics.lineStyle(2, 0x000000);
		this.scene.graphics.strokeRectShape(this.background);
	}

	addChar(char) {
		this.message += char;
		let text = this.message;
		if (this.password) text = text.replace(/./g, '*');
		this.inputText.setText(text);
	}

	removeChar() {
		this.message = this.message.slice(0, -1);
		let text = this.message;
		if (this.password) text = text.replace(/./g, '*');
		this.inputText.setText(text);
	}
}

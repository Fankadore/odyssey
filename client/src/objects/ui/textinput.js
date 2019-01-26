import Phaser from '../../lib/phaser.js';

export default class TextInput extends Phaser.GameObjects.Container {
	constructor(scene, x, y, texture, focusTexture, password = false, defaultMessage = "", callback) {
		super(scene, x, y);
		this.normalTexture = texture;
		this.focusTexture = focusTexture;
		this.password = password;
		this.message = "";
		this.callback = callback;

		// Input Image
		this.image = scene.add.image(0, 0, 'text-input');
		this.setInteractive(new Phaser.Geom.Rectangle(-(this.image.width / 2), -(this.image.height / 2), this.image.width, this.image.height), Phaser.Geom.Rectangle.Contains);

		// Input Text
		let style = { fontFamily: 'Arial', fontSize: (this.image.height / 2) + "px", fill: '#000000' };
		this.defaultMessage = scene.add.text(4 - (this.image.width / 2), 0, defaultMessage, style).setOrigin(0, 0.5).setDepth(this.image.depth + 1);
		this.inputText = scene.add.text(4 - (this.image.width / 2), 0, "", style).setOrigin(0, 0.5).setDepth(this.image.depth + 1);
		
		this.on('pointerdown', () => {
			if (this.callback) this.callback(this);
		});
		
		this.add([this.image, this.defaultMessage, this.inputText]);
		scene.add.existing(this);
	}
	
	setVisible(visible) {
		super.setVisible(visible);
		if (visible && this.inputText.text === "") this.defaultMessage.setVisible(true);
		else this.defaultMessage.setVisible(false);
	}

	setFocus(focus) {
		if (focus) this.image.setTexture(this.focusTexture);
		else this.image.setTexture(this.normalTexture);
	}

	addChar(char) {
		this.updateText(this.message + char);
		this.defaultMessage.setVisible(false);
	}

	removeChar() {
		this.updateText(this.message.slice(0, -1));
		if (this.message === "") this.defaultMessage.setVisible(true);
	}

	updateText(text) {
		this.message = text;
		if (this.password) text = text.replace(/./g, '*');
		this.inputText.setText(text);
	}
}

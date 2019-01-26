import Phaser from '../../lib/phaser.js';

export default class Toggle extends Phaser.GameObjects.Container {
	constructor(scene, x, y, texture, activeTexture, message = "", style, callback) {
		super(scene, x, y);
		this.normalTexture = texture;
		this.activeTexture = activeTexture;
		this.callback = callback;

		// Toggle Image
		this.image = scene.add.image(0, 0, texture);
		this.setInteractive(new Phaser.Geom.Rectangle(-(this.image.width / 2), -(this.image.height / 2), this.image.width, this.image.height), Phaser.Geom.Rectangle.Contains);

		// Toggle Label
		if (!style) style = { fontFamily: 'Arial', fontSize: this.height + 'px', fill: '#000000' };
		this.label = scene.add.text(0, 0, message, style).setOrigin(0.5).setDepth(this.image.depth + 1);
		
		// Mouse Inputs
		this.on('pointerdown', () => {
			if (this.callback) this.callback(this);
		});

		this.add([this.image, this.label]);
		scene.add.existing(this);
	}

	onDown() {
		this.image.setTexture(this.activeTexture);
	}
	onUp() {
		this.image.setTexture(this.normalTexture);
	}
}

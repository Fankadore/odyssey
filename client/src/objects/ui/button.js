import Phaser from '../../lib/phaser.js';

export default class Button extends Phaser.GameObjects.Container {
	constructor(scene, x, y, texture, activeTexture, message = "", style, callback) {
		super(scene, x, y);
		this.normalTexture = texture;
		this.activeTexture = activeTexture;
		this.callback = callback;
		
		// Button Image
		this.image = scene.add.image(0, 0, texture);
		this.setInteractive(new Phaser.Geom.Rectangle(-(this.image.width / 2), -(this.image.height / 2), this.image.width, this.image.height), Phaser.Geom.Rectangle.Contains);
		
		// Button Label
		if (!style) style = { fontFamily: 'Arial', fontSize: this.image.height + 'px', fill: '#000000' };
		this.label = scene.add.text(0, 0, message, style).setOrigin(0.5).setDepth(this.image.depth + 1);

    this.on('pointerdown', () => {
      if (this.callback) this.callback(this);
    });
    this.on('pointerover', pointer => this.image.setTexture(this.activeTexture));
		this.on('pointerout', pointer => this.image.setTexture(this.normalTexture));
		
		this.add([this.image, this.label]);
		scene.add.existing(this);
	}
}

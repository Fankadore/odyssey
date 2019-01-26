import Phaser from '../../lib/phaser.js';

export default class CloseButton extends Phaser.GameObjects.Image {
	constructor(scene, x, y, callback) {
		super(scene, x, y, 'close-button').setInteractive();
		this.normalTexture = 'close-button';
		this.activeTexture = 'close-button-active';
    this.callback = callback;
    
    this.on('pointerdown', () => {
      if (this.callback) this.callback();
    });
    this.on('pointerover', pointer => this.setTexture(this.activeTexture));
    this.on('pointerout', pointer => this.setTexture(this.normalTexture));
		scene.add.existing(this);
	}
}

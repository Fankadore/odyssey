import Phaser from '../../lib/phaser.js';

export default class Panel extends Phaser.GameObjects.Image {
	constructor(scene, x, y, texture) {
		super(scene, x, y, texture);
		scene.add.existing(this);
	}
}

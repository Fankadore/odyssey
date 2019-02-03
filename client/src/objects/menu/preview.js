import Phaser from '../../lib/phaser.js';

export default class Preview extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, 'potions');
		scene.add.existing(this);
  }

  setSelected(item) {
		this.setFrame(item.sprite);
	}
	
	clear() {
		this.setFrame(0);	
	}
}

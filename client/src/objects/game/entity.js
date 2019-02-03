import Phaser from '../../lib/phaser.js';
import config from '../../config.js';

export default class Entity extends Phaser.GameObjects.Sprite {
	constructor(scene, gameId, gridX, gridY, sprite, spritesheet) {
		const x = config.MAP.x + (gridX * config.TILE_SIZE);
		const y = config.MAP.y + (gridY * config.TILE_SIZE);
		
		super(scene, x, y, spritesheet, sprite).setOrigin(0);
		this.gameId = gameId;
		this.grid = {
			x: gridX,
			y: gridY
		};
		this.sprite = sprite;
		scene.add.existing(this);
	}

	setFrame(frame) {
		super.setFrame(frame);
	}
}

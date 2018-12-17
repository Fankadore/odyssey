import Phaser from '../lib/phaser.js';
import config from '../config.js';

const offsetX = 0.5;
const offsetY = -0.75;

export default class Text extends Phaser.GameObjects.Text {
	constructor(scene, data) {
		super(scene, (data.x + data.lerpX + offsetX) * config.TILE_SIZE, (data.y + data.lerpY + offsetY) * config.TILE_SIZE, data.message, { fontFamily: 'Arial', fontSize: config.FONT_SIZE + 'px', fill: data.colour });
		this.gameId = data.gameId;
		this.setOrigin(0.5, 0.5);
		this.setAlign('center');
		this.update(data);
		scene.add.existing(this);
	}

	update(data) {
		if (data.x != null && data.lerpX != null) this.x = (data.x + data.lerpX + offsetX) * config.TILE_SIZE;
		if (data.y != null && data.lerpY != null) this.y = (data.y + data.lerpY + offsetY) * config.TILE_SIZE;
		if (data.message != null) this.text = data.message;
		if (data.colour != null) this.style = { fontFamily: 'Arial', fontSize: config.FONT_SIZE + 'px', fill: data.colour };
	}
}

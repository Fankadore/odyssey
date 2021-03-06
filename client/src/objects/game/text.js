import Phaser from '../../lib/phaser.js';
import config from '../../config.js';

const offsetX = 0.5;
const offsetY = -0.75;

export default class Text extends Phaser.GameObjects.Text {
	constructor(scene, data) {
		const x = config.MAP.x + (data.x + data.lerpX + offsetX) * config.TILE_SIZE;
		const y = config.MAP.y + (data.y + data.lerpY + offsetY) * config.TILE_SIZE;
		const style = config.FONT;
		style.fill = data.colour;
		super(scene, x, y, data.message, style).setOrigin(0.5).setAlign('center').setDepth(100);

		this.gameId = data.gameId;
		scene.add.existing(this);
	}

	onUpdate(data) {
		if (data.x != null && data.lerpX != null) this.x = config.MAP.x + (data.x + data.lerpX + offsetX) * config.TILE_SIZE;
		if (data.y != null && data.lerpY != null) this.y = config.MAP.y + (data.y + data.lerpY + offsetY) * config.TILE_SIZE;
		if (data.message != null) this.setText(data.message);
		if (data.colour != null) this.setColor(data.colour);
	}
}

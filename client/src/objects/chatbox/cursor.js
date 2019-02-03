import Phaser from '../../lib/phaser.js';
import config from '../../config.js';

export default class Cursor extends Phaser.GameObjects.Graphics {
	constructor(scene) {
		super(scene);
		this.x = config.CHATBOX.x + (config.TILE_SIZE / 2);
		this.y = config.CHATBOX.y + config.CHATBOX.height - config.FONT.height;
		this.width = 5;
		this.height = config.FONT.height;
		this.focus = true;
		this.speed = 500;
		this.timer = 0;
		
		this.lineStyle(this.width, 0xFF00FF);
		this.beginPath();
		this.moveTo(this.x, this.y);
		this.lineTo(this.x, this.y + this.height);
		this.closePath();
		this.strokePath();
	}

	onUpdate() {
		if (this.focus) {
			const now = new Date().getTime();
			if (now - this.timer >= this.speed) {
				this.setVisible(!this.visible);
				this.timer = now;
			}
		}
		else {
			if (this.visible) this.setVisible(false);
		}
	}
}
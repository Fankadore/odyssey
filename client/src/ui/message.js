import Phaser from '../lib/phaser.js';
import config from '../config.js';

export default class Message extends Phaser.GameObjects.Text {
	constructor(scene, data) {
		if (!data.colour) {
			switch (data.type) {
				case 'gameInfoGlobal': data.colour = '#00ffff';
				break;
				case 'gameInfoMap': data.colour = '#ffff00';
				break;
				case 'gameInfoPlayer': data.colour = '#ffffff';
				break;
				case 'messageGlobal': data.colour = '#ff00ff';
				break;
				case 'messageMap': data.colour = '#dddddd';
				break;
				case 'messagePlayer': data.colour = '#00ff00';
				break;
				default: data.colour = '#ffffff';
			}
		}

		super(scene, config.CHATBOX_LEFT + (config.TILE_SIZE / 2), config.CHATBOX_BOTTOM - (config.FONT_SIZE * 2), data.message, {fontFamily: 'Arial', fontSize: config.FONT_SIZE + 'px', fill: data.colour});
		this.senderId = data.senderId;
		this.message = data.message;
		this.type = data.type;
		this.colour = data.colour;
		scene.add.existing(this);
	}
}
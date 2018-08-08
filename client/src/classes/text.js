"use strict";

import Phaser from '../lib/phaser.js';
import config from '../config.js';

export default class Text extends Phaser.GameObjects.Text {
	constructor(scene, x, y, message) {
		super(scene, x * config.TILESIZE, y * config.TILESIZE, message, { fontSize: '32px', fill: '#ffffff' });
		scene.add.existing(this);
	}

	update() {

	}
}

class FloatText extends Text {
	constructor(scene, x, y, message) {
		super(scene, x, y, message);
		this.timer = 0;
	}

	update() {
		this.timer
		this.y--;
	}
}

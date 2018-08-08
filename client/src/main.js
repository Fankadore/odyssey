/*** Entry Point ***/

import Phaser from './lib/phaser.js';
import GameScene from './scene.js';
import config from './config.js';

const phaserConfig = {
	type: Phaser.AUTO,
	width: config.WIDTH,
	height: config.HEIGHT,
	parent: 'game-window',
	scene: [GameScene]
};

const game = new Phaser.Game(phaserConfig);
/*** Entry Point ***/

import Phaser from './lib/phaser.js';
import ClientScene from './scenes/clientscene.js';
import UIScene from './scenes/uiscene.js';
import GameScene from './scenes/gamescene.js';
import config from './config.js';

const phaserConfig = {
	type: Phaser.AUTO,
	width: config.WIDTH,
	height: config.HEIGHT,
	parent: 'game-window',
	scene: [GameScene, UIScene, ClientScene]
};

const game = new Phaser.Game(phaserConfig);

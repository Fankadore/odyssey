/*** Entry Point ***/

import Phaser from './lib/phaser.js';
import ClientScene from './client/clientscene.js';
import UIScene from './ui/uiscene.js';
import GameScene from './game/gamescene.js';
import config from './config.js';

const phaserConfig = {
	type: Phaser.AUTO,
	width: config.WIDTH,
	height: config.HEIGHT,
	parent: 'game-window',
	scene: [GameScene, UIScene, ClientScene],	// TODO: Signup/signin scene, create/select player scene
	input: { gamepad: true }
};

const game = new Phaser.Game(phaserConfig);

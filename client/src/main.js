/*** Entry Point ***/

import Phaser from './lib/phaser.js';
import LoaderScene from './scenes/loaderscene.js';
import ClientScene from './scenes/clientscene.js';
import SignInScene from './scenes/signinscene.js';
import PlayerSelectScene from './scenes/playerselectscene.js';
import PlayScene from './scenes/playscene.js';
import config from './config.js';

const phaserConfig = {
	type: Phaser.AUTO,
	width: config.GAME_WIDTH,
	height: config.GAME_HEIGHT,
	parent: 'game-window',
	scene: [LoaderScene, ClientScene, SignInScene, PlayerSelectScene, PlayScene],
	input: { gamepad: true }
};

/*
	Client Scene - Input Emitter, State Receiver
	Sign In Scene - Title, Sign In Form, Sign Up Form
	Player Select Scene - Player Previews, Create Player Form
	Play Scene - Game, Menu, Chatbox
*/
const game = new Phaser.Game(phaserConfig);

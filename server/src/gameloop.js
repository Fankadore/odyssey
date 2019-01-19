/*** Game Loop ***/
/* Keeps track of time and co-ordinates the game and server */

import NodeGameLoop from 'node-gameloop';

import db from './db.js';
import game from './game.js';
import server from './server.js';
import config from './config.js';

class GameLoop {
	constructor() {
		this.timer = {
			backup: 0,
			minute: 0
		};

		this.id = NodeGameLoop.setGameLoop((delta) => this.update(delta), config.FRAMERATE);
	}

	update(delta) {
		// Increase Timers
		this.timer.backup += delta;
		this.timer.minute += delta;

		// Update the game state
		let updatePack = game.update(delta);
		// Send updated state to clients
		server.sendUpdatePack(updatePack);
		
		// Minute timer script
		if (this.timer.minute >= 60) {
			this.timer.minute -= 60;
			// TODO: run minute timer script
		}

		// Periodic backup to database
		if (this.timer.backup >= config.BACKUP_TIME) {
			this.timer.backup -= config.BACKUP_TIME;
			let dbPack = game.getDBPack();
			db.backup(dbPack);
		}
	}
}

const gameLoop = new GameLoop();
export default gameLoop;

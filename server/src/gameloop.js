/*** Game Loop ***/
/* Keeps track of time and co-ordinates the game and server */

import NodeGameLoop from 'node-gameloop';

import db from './db.js';
import game from './game.js';
import server from './server.js';
import config from './config.js';

class GameLoop {
  constructor() {
    this.id = null;
    this.timer = {
      backup: 0
    };
    this.start();
  }
  start() {
    this.id = NodeGameLoop.setGameLoop((delta) => {
      // Update the game state
      let updatePack = game.update(delta);
      
      // Send updated state to clients
      server.sendUpdatePack(updatePack);
      
      // Periodic backup to database
      this.timer.backup += delta;
      if (this.timer.backup >= config.BACKUP_TIME) {
        this.timer.backup -= config.BACKUP_TIME;
        // SAVE STATE
      }
    }, config.FRAMERATE);
  }
}

const gameLoop = new GameLoop();
export default gameLoop;
import fs from 'fs';

import Map from './classes/map.js';
import Player from './classes/player.js';
import db from './db.js';
import config from './config.js';
import Bot from './classes/bot.js';

class Game {
	constructor() {
		this.playerList = [];
		this.mapList = [];
		this.messageQueue = [];

		this.createMaps();
	}

	createMaps() {
		this.mapData = JSON.parse(fs.readFileSync('./server/data/map.json', 'utf8'));
		for (let id = 0; id < config.MAX_MAPS; id++) {
			this.mapList[id] = new Map(id, this.mapData[id]);
		}
	}

	update(delta) {
		let pack = {
			players: [],
			maps: []
		};
		
		this.playerList.forEach((player) => {
			pack.players[player.id] = player.update(delta);
		});
		
		this.mapList.forEach((map) => {
			pack.maps[map.id] = map.update(delta);
		});
		
		return pack;
	}

	playerLogin(id) {
		let player = new Player(id);
		this.playerList[id] = player;
		this.sendServerMessage(`${player.name} has logged in.`);
		return player;
	}
	
	playerLogout(id) {
		let player = this.playerList[id];
		if (player) {
			db.savePlayerData(player.getPack);
			this.sendServerMessage(`${player.name} has logged out.`);
			delete this.playerList[id];
		}
	}

	sendServerMessage(message) {
		this.messageQueue.push({message});
	}

	sendMapMessage(map, message) {
		this.messageQueue.push({message, map});
	}

	sendPlayerMessage(id, message) {
		this.messageQueue.push({message, id});
	}

	checkVacant(mapId, x, y) {
		// Check for Map Edges
		if (x < 0 || x >= config.MAP_COLUMNS) return false;
		if (y < 0 || y >= config.MAP_ROWS) return false;
		
		let map = this.mapList[mapId];
		
		// Check for Wall Tiles
		if (map.tiles[y][x].wall === true) return false;
		
		// Check for Bots
		let bots = map.bots.filter((bot) => {
			if (bot.x === x && bot.y === y) return true;
		});
		if (bots.length > 0) return false;
		
		// Check for Players
		let players = this.playerList.filter((player) => {
			if (player.map === map.id && player.x === x && player.y === y && !player.isDead) return true;
		});
		if (players.length > 0) return false;

		return true;
	}

	spawnBot(ref, mapId, x, y) {
		new Bot(ref, mapId, x, y);
	}
}

const game = new Game();
export default game;

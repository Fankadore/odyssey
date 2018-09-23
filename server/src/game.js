import fs from 'fs';

import db from './db.js';
import config from './config.js';
import util from './util.js';
import Map from './classes/map.js';
import Player from './classes/player.js';
import Bot from './classes/bot.js';
import Item from './classes/item.js';
import Effect from './classes/effect.js';
import Text from './classes/text.js';
import Message from './classes/message.js';

class Game {
	constructor() {
		this.playerList = [];
		this.mapList = [];
		this.messageQueue = [];

		// Create Maps
		this.mapData = JSON.parse(fs.readFileSync('./server/data/maps.json', 'utf8'));
		for (let id = 0; id < config.MAX_MAPS; id++) {
			this.mapList[id] = new Map(id, this.mapData[id]);
		}
	}

	update(delta) {
		let pack = {
			players: [],
			maps: [],
			messages: this.messageQueue
		};
		this.messageQueue = [];

		this.playerList.forEach((player) => {
			pack.players[player.id] = player.update(delta);
		});
		
		this.mapList.forEach((map) => {
			pack.maps[map.id] = map.update(delta);
		});

		return pack;
	}

	// Players
	playerLogin(id) {
		let player = new Player(id);
		this.playerList[id] = player;
		this.sendGameInfoGlobal(`${player.name} has logged in.`);
		return player;
	}
	
	playerLogout(id) {
		let player = this.playerList[id];
		if (player) {
			db.savePlayerData(player.getPack);
			this.sendGameInfoGlobal(`${player.name} has logged out.`);
			delete this.mapList[player.mapId].texts[player.displayNameId];
			delete this.playerList[id];
		}
	}

	// Game Info
	sendGameInfoGlobal(message) {
		this.messageQueue.push(new Message(null, message, 'gameInfo'));
	}
	sendGameInfoMap(mapId, message) {
		this.messageQueue.push(new Message(null, message, 'gameInfo', mapId));
	}
	sendGameInfoPlayer(id, message) {
		this.messageQueue.push(new Message(null, message, 'gameInfo', null, id));
	}
	
	// Chat Messages
	sendMessageGlobal(senderId, message) {
		this.messageQueue.push(new Message(senderId, message, 'messageGlobal'));
	}
	sendMessageMap(senderId, mapId, message) {
		this.messageQueue.push(new Message(senderId, message, 'messageMap', mapId));
	}
	sendMessagePlayer(senderId, id, message) {
		this.messageQueue.push(new Message(senderId, message, 'messagePlayer', null, id));
	}

	// Map
	isVacant(mapId, x, y) {
		// Check for Map Edges
		if (x < 0 || x >= config.MAP_COLUMNS) return false;
		if (y < 0 || y >= config.MAP_ROWS) return false;
		
		let map = this.mapList[mapId];
		
		// Check for Wall Tiles
		if (map.tiles.wall[y][x] === true) return false;
		
		// Check for Bots
		let bots = map.bots.filter((bot) => {
			if (bot.x === x && bot.y === y && !bot.isDead) return true;
		});
		if (bots.length > 0) return false;
		
		// Check for Players
		let players = this.playerList.filter((player) => {
			if (player.mapId === map.id && player.x === x && player.y === y && !player.isDead) return true;
		});
		if (players.length > 0) return false;

		return true;
	}

	spawnBot(mapId, x, y, botClass) {
		new Bot({
			mapId,
			x,
			y,
			botClass
		});
	}
	
	spawnMapItem(mapId, x, y, itemClass, stack = 0) {
		new Item({
			owner: 'map',
			mapId,
			id: util.firstEmptyIndex(this.mapList[mapId].items),
			x,
			y,
			itemClass,
			stack
		});
	}

	spawnDamageText(mapId, x, y, damage) {
		new Text(mapId, x, y + 0.5, damage, '#ff0000', 1.25, 0, -1);
	}

	spawnEffect(mapId, x, y, sprite, loop, speed, maxFrame, startFrame) {
		new Effect(mapId, x, y, sprite, loop, speed, maxFrame, startFrame);
	}
}

const game = new Game();
export default game;

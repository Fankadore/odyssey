import db from './db.js';
import config from './config.js';

import Map from './classes/map.js';
import Player from './classes/player.js';
import Bot from './classes/bot.js';
import Item from './classes/item.js';
import Effect from './classes/effect.js';
import Text from './classes/text.js';
import Message from './classes/message.js';

class Game {
	constructor() {
		this.maps = [];
		this.players = [];
		this.bots = [];
		this.items = [];
		this.effects = [];
		this.texts = [];
		this.messageQueue = [];
		
		this.playerTemplates = {};
		this.botTemplates = {};
		this.itemTemplates = {};
		this.itemTypes = {};

		this.experienceToLevel = [];
		let exp = 10
		for (let i = 0; i < config.MAX_LEVEL; i++) {
			exp = (exp + (exp % 2)) * 1.5;
			this.experienceToLevel[i] = exp;
		}
		this.loadMaps();
		this.loadPlayerTemplates();
		this.loadBotTemplates();
		// this.loadItemTemplates();
	}

	loadMaps() {
		db.getAllMaps()
		.then(mapData => {
			const orderedMapData = [];
			for (let id = 0; id < mapData.length; id++) {
				const data = mapData[id];
				if (data) orderedMapData[data.mapId] = data;
			}

			for (let id = 0; id < config.MAX_MAPS; id++) {
				if (orderedMapData[id]) {
					this.maps[id] = new Map(id, orderedMapData[id]);
				}
				else {
					this.maps[id] = new Map(id);
				}
			}
		})
		.catch(err => console.log(err));
	}

	loadPlayerTemplates() {
		db.getAllPlayerTemplates()
		.then(templates => {
			this.playerTemplates = {};
			templates.forEach(template => {
				this.playerTemplates[template._id] = template;
			});
		}).catch(err => console.log(err));
	}

	loadBotTemplates() {
		db.getAllBotTemplates()
		.then(templates => {
			this.botTemplates = {};
			templates.forEach(template => {
				this.botTemplates[template._id] = template;
			});
		}).catch(err => console.log(err));
	}

	loadItemTemplates() {
		db.getAllItemTemplates()
		.then(templates => {
			this.itemTemplates = {};
			templates.forEach(template => {
				this.itemTemplates[template._id] = template;
			});
		}).catch(err => console.log(err));
	}

	update(delta) {
		let pack = {
			players: [],
			bots: [],
			items: [],
			effects: [],
			texts: [],
			messages: [].concat(this.messageQueue)
		};
		this.messageQueue = [];

		for (let i = 0; i < this.players.length; i++) {
			const player = this.players[i];
			if (player != null) {
				pack.players[player.gameId] = player.update(delta);
			}
		}
		for (let i = 0; i < this.bots.length; i++) {
			const bot = this.bots[i];
			if (bot != null) {
				pack.bots[bot.gameId] = bot.update(delta);
			}
		}
		for (let i = 0; i < this.items.length; i++) {
			const item = this.items[i];
			if (item != null) {
				pack.items[item.id] = item.update(delta);
			}
		}
		for (let i = 0; i < this.effects.length; i++) {
			const effect = this.effects[i];
			if (effect != null) {
				pack.effects[effect.id] = effect.update(delta);
			}
		}
		for (let i = 0; i < this.texts.length; i++) {
			const text = this.texts[i];
			if (text != null) {
				pack.texts[text.id] = text.update(delta);
			}
		}

		return pack;
	}

	// Players
	playerLogin(socketId, data) {
		for (let player of this.players) {
			if (player && player.name === data.name) {
				console.log("Player is already signed in.");
				return null;
			}
		}

		const player = new Player(socketId, data);
		db.log(`${socketId} - ${player.name} has logged in.`);
		this.sendGameInfoGlobal(`${player.name} has logged in.`);
		return player;
	}
	playerLogout(playerId) {
		let player = this.players[playerId];
		if (player) {
			const playerData = player.getDBPack()
			db.log(`${player.socketId} - ${player.name} has logged out.`);
			this.sendGameInfoGlobal(`${player.name} has logged out.`);
			delete this.texts[player.displayNameId];
			delete this.players[playerId];
			db.savePlayer(playerData);
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
		
		// Check for Wall Tiles
		let map = this.maps[mapId];
		if (map.isWall[y][x] === true) return false;
		
		// Check for Bots
		let bots = this.bots.filter((bot) => {
			if (bot.mapId === mapId && bot.x === x && bot.y === y && !bot.isDead) return true;
		});
		if (bots.length > 0) return false;
		
		// Check for Players
		let players = this.players.filter((player) => {
			if (player.mapId === mapId && player.x === x && player.y === y && !player.isDead) return true;
		});
		if (players.length > 0) return false;

		return true;
	}

	spawnBot(mapId, x, y, templateId) {
		const direction = 'down';
		const template = this.botTemplates[templateId];
		if (template) {
			new Bot(mapId, x, y, direction, template);
		}
		else {
			console.log("Bot Template does not exist with that Id");
		}
	}
	
	async spawnMapItem(mapId, x, y, templateId, stack = 0) {
		let template = await db.getItemTemplate(templateId);
		if (template) {
			new Item(mapId, x, y, template, stack);
		}
		else {
			console.log("Item Template does not exist with that Id");
		}
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

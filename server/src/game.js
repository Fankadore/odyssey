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

		this.loadMaps();
		this.loadPlayerTemplates();
		this.loadBotTemplates();
		this.loadItemTemplates();
		this.loadCommands();
		this.loadItems();
		this.loadBots();
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
				template.type = config.ITEM_TYPES[template.itemType];
				this.itemTemplates[template._id] = template;
			});
		}).catch(err => console.log(err));
	}

	loadCommands() {
		this.commands = {
			move: (data, player) => player.input.direction = data.direction,
			run: (data, player) => player.input.run = data.state,
			pickup: (data, player) => {
				if (!player.input.pickup && data.state) player.pickUp();
				player.input.pickup = data.state;
			},
			attack: (data, player) => {
				player.input.attack = data.state;
				player.attack(1, player.direction);
			},
			doubleClickItem: (data, player) => player.useItem(data.slot),
			rightClickItem: (data, player) => player.dropItem(data.slot),
			dragStopGame: (data, player) => player.dropItem(data.slot),
			dragStopInventory: (data, player) => player.moveItemToSlot(data.slot, data.newSlot),
			dragStopEquipment: (data, player) => player.moveItemToSlot(data.slot, data.newSlot),
			serverChat: (data, player) => game.sendMessageGlobal(player.gameId, `${player.name} yells, "${data.message}"`),
			mapChat: (data, player) => game.sendMessageMap(player.gameId, player.mapId, `${player.name} says, "${data.message}"`),
			playerChat: (data, player) => {
				const target = game.players[data.targetId];
				if (target) {
					game.sendMessagePlayer(player.gameId, target.gameId, `${player.name} whispers, "${data.message}"`);
					game.sendMessagePlayer(player.gameId, player.gameId, `You whisper to ${target.name}, "${data.message}"`);
				}
			},
			macro1: (data) => {
				if (data) this.spawnMapItem(1, 5, 5, "5c1bfeb7d8fb6012cc966083");
			},
			macro2: (data) => {
				if (data) this.spawnBot(1, 5, 5, "5c1becde28d05b077cbaa385");
			},
			macro3: (data) => {
				if (data) {
					if (player.sprite >= config.MAX_SPRITES) player.sprite = 1;
					else player.sprite++;
				}
			},
			macro4: (data) => {
			},

		};
		
		this.godCommands = {
			spawnMapItem: (data) => this.spawnMapItem(data.args[0], data.args[1], data.args[2], data.args[3], data.args[4]),
			spawnBot: (data) => this.spawnBot(data.args[0], data.args[1], data.args[2], data.args[3], data.args[4]),
			setSprite: (data, player) => player.sprite = data.args[0]
		};
	}

	async loadItems() {
		let itemData = await db.getAllItems();
		for (let i = 0; i < itemData.length; i++) {
			const item = itemData[i];
			if (!item) continue;
			item.template.type = config.ITEM_TYPES[item.template.itemType]
			new Item(item);
		}
	}
	async loadBots() {
		let botData = await db.getAllBots();
		for (let i = 0; i < botData.length; i++) {
			new Bot(botData[i]);
		}
	}
	requestDBId() {
		return db.generateId();
	}

	update(delta) {
		const pack = {
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
			if (player != null) pack.players[player.gameId] = player.update(delta);
		}
		for (let i = 0; i < this.bots.length; i++) {
			const bot = this.bots[i];
			if (bot) pack.bots[bot.gameId] = bot.update(delta);
		}
		for (let i = 0; i < this.items.length; i++) {
			const item = this.items[i];
			if (item) pack.items[item.gameId] = item.update(delta);
		}
		for (let i = 0; i < this.effects.length; i++) {
			const effect = this.effects[i];
			if (effect) pack.effects[effect.id] = effect.update(delta);
		}
		for (let i = 0; i < this.texts.length; i++) {
			const text = this.texts[i];
			if (text) pack.texts[text.gameId] = text.update(delta);
		}
		return pack;
	}

	getDBPack() {
		const dbPack = {
			players: [],
			bots: [],
			items: []
		};
		this.players.forEach(player => dbPack.players.push(player.getDBPack()));
		this.bots.forEach(bot => dbPack.bots.push(bot.getDBPack()));
		this.items.forEach(item => dbPack.items.push(item.getDBPack()));
		return dbPack;
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
	getExpToLevel(level) {
		let exp = 10;
		for (let i = 1; i < config.MAX_LEVEL; i++) {
			if (i === level) return exp;
			exp = (exp + (exp % 2)) * 1.5;
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
		if (x < 0 || x >= config.MAP_COLUMNS || y < 0 || y >= config.MAP_ROWS) return false;
		
		// Check for Wall Tiles
		const map = this.maps[mapId];
		if (map.isWall[y][x]) return false;
		
		// Check for Actors
		const actorList = this.players.concat(this.bots);
		const actorsOnTile = actorList.filter(actor => {
			return actor.mapId === mapId && actor.x === x && actor.y === y && !actor.isDead;
		});
		if (actorsOnTile.length > 0) return false;

		return true;
	}

	spawnBot(mapId, x, y, templateId, direction = 'down') {
		const template = this.botTemplates[templateId];
		if (template) {
			new Bot({mapId, x, y, direction, template});
		}
		else {
			console.log("Bot Template does not exist with that Id");
		}
	}
	
	spawnMapItem(mapId, x, y, templateId, stack = 0) {
		let template = this.itemTemplates[templateId];
		if (template) {
			new Item({mapId, x, y, template, stack});
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

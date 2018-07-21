"use strict";
import config from '../config.js';
import util from '../utilities.js';

class Tile {
	constructor(mapData, x, y) {
		this.layer = [];
		for (let i = 0; i < config.MAP_LAYERS; i++) {
			this.layer[i] = mapData.tiles[i][(y * config.MAP_COLUMNS) + x];
		}
		
		this.wall = mapData.walls[(y * config.MAP_COLUMNS) + x];
		this.canAttack = false;
		this.healthMax = 0;
		this.health = this.healthMax;
		this.defence = 0;

		this.warpMap = 0;
		this.warpX = 0;
		this.warpY = 0;

		this.walkScript = function() {
			// Run MapWalk#_x_y script
		};
		this.clickScript = function() {
			// Run MapClick#_x_y script
		};
		this.attackScript = function() {
			// Run MapAttack#_x_y script
		};
		
	}
	
}

export default class Map {
	constructor(id) {
		this.id = id;
		let data = Map.data[this.id];

		this.name = data.name;
		this.dropChance = util.clamp(data.dropChance, 0, 100);
		//this.dropChance = 0 = 0% chance to drop items in inventory (drop nothing), 100 = 100% chance to drop (drop everything)
		this.dropAmountEQ = util.clamp(data.dropAmountEQ, 0, config.EQUIPMENT_SIZE);
		//this.dropAmountEQ = number of equipped items the player will drop on death. dropEQ = EQUIPMENT_SIZE = drop all equipment
		
		this.items = data.items;
		this.bots = data.bots;
		this.effects = data.effects;
		this.texts = data.texts;
		
		this.tiles = [];
		for (let y = 0; y < config.MAP_COLUMNS; y++) {
			this.tiles[y] = [];
			for (let x = 0; x < config.MAP_ROWS; x++) {
				this.tiles[y][x] = new Tile(data, x, y);
			}
		}
		
		this.initPack = {players: [], items: [], bots: [], effects: [], texts: []};
		this.removePack = {players: [], items: [], bots: [], effects: [], texts: []};
		Map.list[this.id] = this;
	}
	
	upload() {
		Map.data[this.id] = JSON.parse(fs.readFileSync('./server/data/map.json', 'utf8'))[this.id];
		for (let y = 0; y < config.MAP_ROWS; y++) {
			for (let x = 0; x < config.MAP_COLUMNS; x++) {
				let tile = this.tiles[y][x];
				for (let i = 0; i < config.MAP_LAYERS; i++) {
					tile.layer[i] = Map.data[this.id].tiles[i][(y * config.MAP_COLUMNS) + x];
				}
			}
		}
		for (let i in Player.list) {
			let player = Player.list[i];
			if (player.map === this.id) {
				player.loadMap();
			}
		}
	}
	
	update() {
		let mapPack = {
			name: this.name,
			items: [],
			bots: [],
			effects: [],
			texts: []
		};
		
		for (let i in this.items) {
			mapPack.items.push(this.items[i].update());
		}
		for (let i in this.bots) {
			mapPack.bots.push(this.bots[i].update());
		}
		for (let i in this.effects) {
			mapPack.effects.push(this.effects[i].update());
		}
		for (let i in this.texts) {
			mapPack.texts[i].push(this.texts[i].update());
		}
		
		return mapPack;
	}
	
	getPack() {
		let mapPack = {
			name: this.name,
			tiles: this.getTilePack(),
			items: [],
			bots: [],
			effects: [],
			texts: []
		};
		
		for (let i in this.items) {
			mapPack.items.push(this.items[i].getPack());
		}
		for (let i in this.bots) {
			mapPack.bots.push(this.bots[i].getPack());
		}
		for (let i in this.effects) {
			mapPack.effects.push(this.effects[i].getPack());
		}
		for (let i in this.texts) {
			mapPack.texts.push(this.texts[i].getPack());
		}
		
		return mapPack;
	}
	
	getTilePack() {
		let tilePack = [];
		for (let i = 0; i < config.MAP_LAYERS; i++) {
			tilePack[i] = [];
		}
		
		for (let y = 0; y < config.MAP_ROWS; y++) {
			for (let x = 0; x < config.MAP_COLUMNS; x++) {
				for (let i = 0; i < config.MAP_LAYERS; i++) {
					tilePack[i][(y * config.MAP_COLUMNS) + x] = this.tiles[y][x].layer[i];
				}
			}
		}
		
		return tilePack;
	}
	
	static updateAll() {
		let allMapPack = [];
		for (let i in Map.list) {
			allMapPack[i] = Map.list[i].update();
		}
		return allMapPack;
	}
}
import { Scene } from '../lib/phaser.js';
import util from '../lib/util.js';
import config from '../config.js';

import Actor from './actor.js';
import MapItem from './mapitem.js';
import Text from './text.js';
import Effect from './effect.js';

export default class GameScene extends Scene {
  constructor() {
    super({key: 'gameScene', active: true});
  }

	init() {
		this.players = [];
		this.bots = [];
		this.items = [];
		this.texts = [];
    this.effects = [];
		this.tilemap = null;
		this.layer = [];
	}

  preload() {
		this.load.setPath('client/assets/');
		this.load.image('map', 'gfx/map.png');
		
    this.load.spritesheet('sprites', 'gfx/sprites.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('effects', 'gfx/effects.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('floor', 'gfx/floor.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('potions', 'gfx/potions.png', {frameWidth: 32, frameHeight: 32});
  }

  create() {
		// Create Anims
		for (let sprite = 0; sprite < config.SPRITE_COUNT; sprite++) {
			const frame = sprite * config.SPRITE_FRAMES;

			this.anims.create({
				key: sprite + 'walkleft',
				frames: this.anims.generateFrameNumbers('sprites', { frames: [frame + 6, frame + 7, frame + 6] }),
				frameRate: 5
			});
			this.anims.create({
				key: sprite + 'walkright',
				frames: this.anims.generateFrameNumbers('sprites', { frames: [frame + 9, frame + 10, frame + 9] }),
				frameRate: 5
			});
			this.anims.create({
				key: sprite + 'walkup',
				frames: this.anims.generateFrameNumbers('sprites', { frames: [frame + 3, frame + 4, frame + 3] }),
				frameRate: 5
			});
			this.anims.create({
				key: sprite + 'walkdown',
				frames: this.anims.generateFrameNumbers('sprites', { frames: [frame + 0, frame + 1, frame + 0] }),
				frameRate: 5
			});
		}

		// Create Tilemap
		this.add.image(0, 0, 'map').setOrigin(0, 0).setDepth(-101);
		this.tilemap = this.make.tilemap({ width: 12, height: 12, tileWidth: 32, tileHeight: 32 });
		const tiles = this.tilemap.addTilesetImage('floor');
		this.layer = [];
		for (let i = 0; i < config.MAP_LAYERS; i++) {
			this.layer[i] = this.tilemap.createBlankDynamicLayer(i, tiles);
		}

		// Make sure the UI is above the Map
		this.scene.sendToBack();
	}

  onUpdate(data) {
    // Update Players
    if (data.players) {
			const addPlayers = data.players.filter((playerData) => {	// filter players on new list but not old
				return (this.players[playerData.id] == null);
			});
			const removePlayers = this.players.filter((player) => {	// filter players on old list but not new
				return (data.players[player.id] == null);
			});
			const updatePlayers = this.players.filter((player) => {	// filter players on both lists
				return (data.players[player.id] != null);
			});

			addPlayers.forEach((playerData) => {
				this.players[playerData.id] = new Actor(this, playerData);
			});
			removePlayers.forEach((player) => {
				delete this.players[player.id];
				player.destroy();
			});
			updatePlayers.forEach((player) => {
        player.update(data.players[player.id]);
			});
    }

		// Update Bots
		if (data.bots) {
			const addBots = data.bots.filter((botData) => {	// filter bots on new list but not old
				if (!botData) return false;
				return (this.bots[botData.id] == null);
			});
			const removeBots = this.bots.filter((bot) => {	// filter bots on old list but not new
				if (!bot) return false;
				return (data.bots[bot.id] == null);
			});
			const updateBots = this.bots.filter((bot) => {	// filter bots on both lists
				if (!bot) return false;
				return (data.bots[bot.id] != null);
			});
			
			addBots.forEach((botData) => {
				this.bots[botData.id] = new Actor(this, botData);
			});
			removeBots.forEach((bot) => {
				delete this.bots[bot.id];
				bot.destroy();
			});
			updateBots.forEach((bot) => {
				bot.update(data.bots[bot.id]);
			});
		}

		// Update Map Items
		if (data.items) {
			const addItems = data.items.filter((itemData) => {	// filter item on new list but not old
				if (!itemData) return false;
				return (this.items[itemData.id] == null);
			});
			const removeItems = this.items.filter((item) => {	// filter items on old list but not new
				if (!item) return false;
				return (data.items[item.id] == null);
			});
			const updateItems = this.items.filter((item) => {	// filter items on both lists
				if (!item) return false;
				return (data.items[item.id] != null);
			});
		
			addItems.forEach((itemData) => {
				this.items[itemData.id] = new MapItem(this, itemData);
			});
			removeItems.forEach((item) => {
				delete this.items[item.id];
				item.destroy();
			});
			updateItems.forEach((item) => {
				item.update(data.items[item.id]);
			});
		}

		// Update Text
		if (data.texts) {
			const addTexts = data.texts.filter((textData) => {	// filter text on new list but not old
				if (!textData) return false;
				return (this.texts[textData.id] == null);
			});
			const removeTexts = this.texts.filter((text) => {	// filter texts on old list but not new
				if (!text) return false;
				return (data.texts[text.id] == null);
			});
			const updateTexts = this.texts.filter((text) => {	// filter texts on both lists
				if (!text) return false;
				return (data.texts[text.id] != null);
			});
			
			addTexts.forEach((textData) => {
				this.texts[textData.id] = new Text(this, textData);
			});
			removeTexts.forEach((text) => {
				delete this.texts[text.id];
				text.destroy();
			});
			updateTexts.forEach((text) => {
				text.update(data.texts[text.id]);
			});
		}

		// Update Effects
		if (data.effects) {
			const addEffects = data.effects.filter((effectData) => {	// filter effect on new list but not old
				if (!effectData) return false;
				return (this.effects[effectData.id] == null);
			});
			const removeEffects = this.effects.filter((effect) => {	// filter effects on old list but not new
				if (!effect) return false;
				return (data.effects[effect.id] == null);
			});
			const updateEffects = this.effects.filter((effect) => {	// filter effects on both lists
				if (!effect) return false;
				return (data.effects[effect.id] != null);
			});
			
			addEffects.forEach((effectData) => {
				this.effects[effectData.id] = new Effect(this, effectData);
			});
			removeEffects.forEach((effect) => {
				delete this.effects[effect.id];
				effect.destroy();
			});
			updateEffects.forEach((effect) => {
				effect.update(data.effects[effect.id]);
			});
		}
	}
	
  onLoadMap(tiles) {
		// Update Tiles
		for (let i = 0; i < config.MAP_LAYERS; i++) {
			if (this.layer[i]) {
				this.layer[i].putTilesAt(tiles.layer[i], 0, 0);
			}
		}
	}
	
	clickMap(x, y) {
		const messages = [];
		
		this.items.forEach((item) => {
			if (item.grid.x === x && item.grid.y === y) {
				if (item.stack > 1) {
					messages.push(`You see ${item.stack} ${util.plural(item.name)}!`);
				}
				else {
					messages.push(`You see ${util.indefiniteArticle(item.name)}!`);
				}
			}
		});
		
		this.players.forEach((player) => {
			if (player.grid.x === x && player.grid.y == y) {
				messages.push(`You see ${player.name}!`);
			}
		});

		this.bots.forEach((bot) => {
			if (bot.grid.x === x && bot.grid.y == y) {
				messages.push(`You see ${bot.name}!`);
			}
		});

		return messages;
	}
}

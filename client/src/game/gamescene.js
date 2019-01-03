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
    if (data.players) {
			// Add Players - filter for players on new list but not old
			data.players.filter(playerData => playerData && this.players[playerData.gameId] == null)
			.forEach(playerData => this.players[playerData.gameId] = new Actor(this, playerData));
			
			// Remove Players - filter for players on old list but not new
			this.players.filter(player => player && data.players[player.gameId] == null)
			.forEach(player => {
				delete this.players[player.gameId];
				player.destroy();
			});

			// Update Players - filter for players on both lists
			this.players.filter(player => player && data.players[player.gameId] != null)
			.forEach(player => player.update(data.players[player.gameId]));
    }

		if (data.bots) {
			// Add Bots - filter for bots on new list but not old
			data.bots.filter(botData => botData && this.bots[botData.gameId] == null)
			.forEach(botData => this.bots[botData.gameId] = new Actor(this, botData));

			// Remove Bots - filter for bots on old list but not new
			this.bots.filter(bot => bot && data.bots[bot.gameId] == null)
			.forEach(bot => {
				delete this.bots[bot.gameId];
				bot.destroy();
			});

			// Update Bots - filter for bots on both lists
			this.bots.filter(bot => bot && data.bots[bot.gameId] != null)
			.forEach(bot => bot.update(data.bots[bot.gameId]));
		}

		if (data.items) {
			// Add Map Items - filter for items on new list but not old
			data.items.filter(itemData => itemData && this.items[itemData.gameId] == null)
			.forEach(itemData => this.items[itemData.gameId] = new MapItem(this, itemData));

			// Remove Map Items - filter for items on old list but not new
			this.items.filter(item => item && data.items[item.gameId] == null)
			.forEach(item => {
				delete this.items[item.gameId];
				item.destroy();
			});
			
			// Update Map Items - filter for items on both lists
			this.items.filter(item => item && data.items[item.gameId] != null)
			.forEach(item => item.update(data.items[item.gameId]));
		}

		if (data.texts) {
			// Add Texts - filter for texts on new list but not old
			data.texts.filter(textData => textData && this.texts[textData.gameId] == null)
			.forEach(textData => this.texts[textData.gameId] = new Text(this, textData));

			// Remove Texts - filter for texts on old list but not new
			this.texts.filter(text => text && data.texts[text.gameId] == null)
			.forEach(text => {
				delete this.texts[text.gameId];
				text.destroy();
			});

			// Update Texts - filter for texts on both lists
			this.texts.filter(text => text && data.texts[text.gameId] != null)
			.forEach(text => text.update(data.texts[text.gameId]));
		}

		if (data.effects) {
			// Add Effects - filter for effects on new list but not old
			data.effects.filter(effectData => effectData && this.effects[effectData.gameId] == null)
			.forEach(effectData => this.effects[effectData.gameId] = new Effect(this, effectData));

			// Remove Effects - filter for effects on old list but not new
			this.effects.filter((effect) => effect && data.effects[effect.gameId] == null)
			.forEach(effect => {
				delete this.effects[effect.gameId];
				effect.destroy();
			});

			// Update Effects - filter for effects on both lists
			this.effects.filter((effect) => effect && data.effects[effect.gameId] != null)
			.forEach(effect => effect.update(data.effects[effect.gameId]));
		}
	}
	
  onLoadMap(tiles) {
		// Update Tiles
		for (let i = 0; i < config.MAP_LAYERS; i++) {
			if (this.layer[i]) {
				this.layer[i].putTilesAt(tiles[i], 0, 0);
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

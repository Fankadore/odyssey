import util from '../../lib/util.js';
import config from '../../config.js';

import Actor from './actor.js';
import MapItem from './mapitem.js';
import Text from './text.js';
import Effect from './effect.js';

export default class Game {
  constructor(scene) {
    this.players = [];
		this.bots = [];
		this.items = [];
		this.texts = [];
    this.effects = [];
		this.tilemap = null;
    this.layer = [];

    // Create Tilemap
    scene.add.image(config.MAP.x, config.MAP.y, 'map').setOrigin(0).setDepth(-101);  // TODO: remove
    this.tilemap = scene.make.tilemap({ width: config.MAP.columns, height: config.MAP.rows, tileWidth: config.TILE_SIZE, tileHeight: config.TILE_SIZE });
    const tiles = this.tilemap.addTilesetImage('floor');
    this.layer = [];
    for (let i = 0; i < config.MAP.layers; i++) {
      this.layer[i] = this.tilemap.createBlankDynamicLayer(i, tiles).setPosition(config.MAP.x, config.MAP.y);
		}
		this.onLoadMap(scene.initData.tiles);
  }

  onUpdate(scene, data) {
    if (data.players) {
			// Add Players - filter for players on new list but not old
			data.players.filter(playerData => playerData && !this.players[playerData.gameId])
			.forEach(playerData => this.players[playerData.gameId] = new Actor(scene, playerData));
			
			// Remove Players - filter for players on old list but not new
			this.players.filter(player => player && !data.players[player.gameId])
			.forEach(player => {
				delete this.players[player.gameId];
				player.destroy();
			});

			// Update Players - filter for players on both lists
			this.players.filter(player => player && data.players[player.gameId])
			.forEach(player => player.onUpdate(data.players[player.gameId]));
    }

		if (data.bots) {
			// Add Bots - filter for bots on new list but not old
			data.bots.filter(botData => botData && !this.bots[botData.gameId])
			.forEach(botData => this.bots[botData.gameId] = new Actor(scene, botData));

			// Remove Bots - filter for bots on old list but not new
			this.bots.filter(bot => bot && !data.bots[bot.gameId])
			.forEach(bot => {
				delete this.bots[bot.gameId];
				bot.destroy();
			});

			// Update Bots - filter for bots on both lists
			this.bots.filter(bot => bot && data.bots[bot.gameId])
			.forEach(bot => bot.onUpdate(data.bots[bot.gameId]));
		}

		if (data.items) {
			// Add Map Items - filter for items on new list but not old
			data.items.filter(itemData => itemData && !this.items[itemData.gameId])
			.forEach(itemData => this.items[itemData.gameId] = new MapItem(scene, itemData));

			// Remove Map Items - filter for items on old list but not new
			this.items.filter(item => item && !data.items[item.gameId])
			.forEach(item => {
				delete this.items[item.gameId];
				item.destroy();
			});
			
			// Update Map Items - filter for items on both lists
			this.items.filter(item => item && data.items[item.gameId])
			.forEach(item => item.onUpdate(data.items[item.gameId]));
		}

		if (data.texts) {
			// Add Texts - filter for texts on new list but not old
			data.texts.filter(textData => textData && !this.texts[textData.gameId])
			.forEach(textData => this.texts[textData.gameId] = new Text(scene, textData));

			// Remove Texts - filter for texts on old list but not new
			this.texts.filter(text => text && !data.texts[text.gameId])
			.forEach(text => {
				delete this.texts[text.gameId];
				text.destroy();
			});

			// Update Texts - filter for texts on both lists
			this.texts.filter(text => text && data.texts[text.gameId])
			.forEach(text => text.onUpdate(data.texts[text.gameId]));
		}

		if (data.effects) {
			// Add Effects - filter for effects on new list but not old
			data.effects.filter(effectData => effectData && !this.effects[effectData.gameId])
			.forEach(effectData => this.effects[effectData.gameId] = new Effect(scene, effectData));

			// Remove Effects - filter for effects on old list but not new
			this.effects.filter(effect => effect && !data.effects[effect.gameId])
			.forEach(effect => {
				delete this.effects[effect.gameId];
				effect.destroy();
			});

			// Update Effects - filter for effects on both lists
			this.effects.filter(effect => effect && data.effects[effect.gameId])
			.forEach(effect => effect.onUpdate(data.effects[effect.gameId]));
		}
  }

  onLoadMap(tiles) {
		// Update Tiles
		for (let i = 0; i < config.MAP.layers; i++) {
			if (this.layer[i]) {
				this.layer[i].putTilesAt(tiles[i], 0, 0);
			}
		}
  }

  clickMap(pixelX, pixelY, rightClick) {
		if (rightClick) return null;
		pixelX -= config.MAP.x;
		pixelY -= config.MAP.y;
		const x = (pixelX - (pixelX % config.TILE_SIZE)) / config.TILE_SIZE;
		const y = (pixelY - (pixelY % config.TILE_SIZE)) / config.TILE_SIZE;
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

		if (messages.length > 0) return messages;
	}
}

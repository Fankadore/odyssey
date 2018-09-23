import { Scene } from '../lib/phaser.js';
import Actor from '../classes/actor.js';
import MapItem from '../classes/mapitem.js';
import Text from '../classes/text.js';
import Effect from '../classes/effect.js';
import config from '../config.js';

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
		this.tiles = [];
		this.mapData = null;
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
    this.createAnims();
		this.createTilemap();
		this.scene.sendToBack();
	}
	
	createAnims() {
		for (let sprite = 0; sprite < config.SPRITE_COUNT; sprite++) {
			let frame = sprite * 13;

			this.anims.create({
				key: sprite + 'walk_left',
				frames: this.anims.generateFrameNumbers('sprites', { frames: [frame + 6, frame + 7, frame + 6] }),
				frameRate: 5
			});
			this.anims.create({
				key: sprite + 'walk_right',
				frames: this.anims.generateFrameNumbers('sprites', { frames: [frame + 9, frame + 10, frame + 9] }),
				frameRate: 5
			});
			this.anims.create({
				key: sprite + 'walk_up',
				frames: this.anims.generateFrameNumbers('sprites', { frames: [frame + 3, frame + 4, frame + 3] }),
				frameRate: 5
			});
			this.anims.create({
				key: sprite + 'walk_down',
				frames: this.anims.generateFrameNumbers('sprites', { frames: [frame + 0, frame + 1, frame + 0] }),
				frameRate: 5
			});

			this.anims.create({
				key: sprite + 'attack_left',
				frames: this.anims.generateFrameNumbers('sprites', { frames: [frame + 8] }),
				frameRate: 1
			});
			this.anims.create({
				key: sprite + 'attack_right',
				frames: this.anims.generateFrameNumbers('sprites', { frames: [frame + 11] }),
				frameRate: 1
			});
			this.anims.create({
				key: sprite + 'attack_up',
				frames: this.anims.generateFrameNumbers('sprites', { frames: [frame + 5] }),
				frameRate: 1
			});
			this.anims.create({
				key: sprite + 'attack_down',
				frames: this.anims.generateFrameNumbers('sprites', { frames: [frame + 2] }),
				frameRate: 1
			});

			this.anims.create({
				key: sprite + 'dead',
				frames: this.anims.generateFrameNumbers('sprites', { frames: [frame + 12] }),
				frameRate: 1
			});
		}
  }
	
	createTilemap() {
		const data = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
		this.add.image(0, 0, 'map').setOrigin(0, 0).setDepth(-101);
		this.tilemap = this.make.tilemap({ width: 12, height: 12, tileWidth: 32, tileHeight: 32 });
		const tiles = this.tilemap.addTilesetImage('floor');
		this.layer = [];
		for (let i = 0; i < 6; i++) {
			this.layer[i] = this.tilemap.createBlankDynamicLayer(i, tiles);
		}
	}

  onUpdate(data, delta) {
    // Update Players
    if (data.players) {
			let addPlayers = data.players.filter((playerData) => {	// filter players on new list but not old
				return (this.players[playerData.id] == null);
			});
			let removePlayers = this.players.filter((player) => {	// filter players on old list but not new
				return (data.players[player.id] == null);
			});
			let updatePlayers = this.players.filter((player) => {	// filter players on both lists
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
			let addBots = data.bots.filter((botData) => {	// filter bots on new list but not old
				if (!botData) return false;
				return (this.bots[botData.id] == null);
			});
			let removeBots = this.bots.filter((bot) => {	// filter bots on old list but not new
				if (!bot) return false;
				return (data.bots[bot.id] == null);
			});
			let updateBots = this.bots.filter((bot) => {	// filter bots on both lists
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
			let addItems = data.items.filter((itemData) => {	// filter item on new list but not old
				if (!itemData) return false;
				return (this.items[itemData.id] == null);
			});
			let removeItems = this.items.filter((item) => {	// filter items on old list but not new
				if (!item) return false;
				return (data.items[item.id] == null);
			});
			let updateItems = this.items.filter((item) => {	// filter items on both lists
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
			let addTexts = data.texts.filter((textData) => {	// filter text on new list but not old
				if (!textData) return false;
				return (this.texts[textData.id] == null);
			});
			let removeTexts = this.texts.filter((text) => {	// filter texts on old list but not new
				if (!text) return false;
				return (data.texts[text.id] == null);
			});
			let updateTexts = this.texts.filter((text) => {	// filter texts on both lists
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
			let addEffects = data.effects.filter((effectData) => {	// filter effect on new list but not old
				if (!effectData) return false;
				return (this.effects[effectData.id] == null);
			});
			let removeEffects = this.effects.filter((effect) => {	// filter effects on old list but not new
				if (!effect) return false;
				return (data.effects[effect.id] == null);
			});
			let updateEffects = this.effects.filter((effect) => {	// filter effects on both lists
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
	
  loadMap(data) {
		// Update Tiles
		if (!this.layer) return;

		for (let i = 0; i < 6; i++) {
			for (let y = 0; y < config.MAP_ROWS; y++) {
				for (let x = 0; x < config.MAP_COLUMNS; x++) {
					this.layer[i].putTileAt(data.tiles.layer[i][y][x], x, y);
				}
			}
		}
  }
}

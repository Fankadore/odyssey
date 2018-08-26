import { Scene } from './lib/phaser.js';
import Actor from './classes/actor.js';
import MapItem from './classes/mapitem.js';
import Text from './classes/text.js';
import config from './config.js';

export default class GameScene extends Scene {
	constructor() {
		super({key: 'game'});
	}

	preload() {
		this.load.image('map', 'client/assets/gfx/map.png');
		
    this.load.spritesheet('sprites', 'client/assets/gfx/sprites.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('effects', 'client/assets/gfx/effects.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('floor', 'client/assets/gfx/floor.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('potions', 'client/assets/gfx/potions.png', {frameWidth: 32, frameHeight: 32});
	}
	
	create() {
		this.socket = null;

		this.keyLeft = null;
		this.keyRight = null;
		this.keyUp = null;
		this.keyDown = null;

		this.list = {
			players: [],
			bots: [],
			items: [],
			texts: []
		};

		this.updateData = {
			players: [],
			bots: [],
			items: [],
			ui: {
				health: 0,
				inventory: []
			}
		};

		this.createClient();

		this.createTilemap();
		this.createUI();
		this.createInputs();
		this.createAnims();
		this.loadMap();
	}

	update(time, delta) {
		let data = this.updateData;
		
		// Update Players
		if (data.players) {
			let addPlayers = data.players.filter((playerData) => {	// filter players on new list but not old
				return (this.list.players[playerData.id] === null || this.list.players[playerData.id] === undefined);
			});
			let removePlayers = this.list.players.filter((player) => {	// filter players on old list but not new
				return (data.players[player.id] === null || data.players[player.id] === undefined);
			});
			let updatePlayers = this.list.players.filter((player) => {	// filter players on both lists
				return (data.players[player.id] !== null && data.players[player.id] !== undefined);
			});

			addPlayers.forEach((playerData) => {
				this.list.players[playerData.id] = new Actor(this, playerData);
			});
			removePlayers.forEach((player) => {
				delete this.list.players[player.id];
				player.destroy();
			});
			updatePlayers.forEach((player) => {
				player.update(data.players[player.id]);
			});
		}

		if (!data.map) return;

		// Update Bots
		let bots = data.map.bots;
		if (bots) {
			let addBots = bots.filter((botData) => {	// filter bots on new list but not old
				return (this.list.bots[botData.id] === null || this.list.bots[botData.id] === undefined);
			});
			let removeBots = this.list.bots.filter((bot) => {	// filter bots on old list but not new
				return (bots[bot.id] === null || bots[bot.id] === undefined);
			});
			let updateBots = this.list.bots.filter((bot) => {	// filter bots on both lists
				return (bots[bot.id] !== null && bots[bot.id] !== undefined);
			});
			
			addBots.forEach((botData) => {
				this.list.bots[botData.id] = new Actor(this, botData);
			});
			removeBots.forEach((bot) => {
				delete this.list.bots[bot.id];
				bot.destroy();
			});
			updateBots.forEach((bot) => {
				bot.update(bots[bot.id]);
			});
		}

		// Update Map Items
		let items = data.map.items;
		if (items) {
			let addItems = items.filter((itemData) => {	// filter item on new list but not old
				if (!itemData) return false;
				return (this.list.items[itemData.id] == null);
			});
			let removeItems = this.list.items.filter((item) => {	// filter items on old list but not new
				if (!item) return false;
				return (items[item.id] == null);
			});
			let updateItems = this.list.items.filter((item) => {	// filter items on both lists
				if (!item) return false;
				return (items[item.id] != null);
			});

			addItems.forEach((itemData) => {
				this.list.items[itemData.id] = new MapItem(this, itemData);
			});
			removeItems.forEach((item) => {
				delete this.list.items[item.id];
				item.destroy();
			});
			updateItems.forEach((item) => {
				item.update(items[item.id]);
			});
		}
		
		// Update Text
		let texts = data.map.texts;
		if (texts) {
			let addTexts = texts.filter((textData) => {	// filter text on new list but not old
				if (!textData) return false;
				return (this.list.texts[textData.id] == null);
			});
			let removeTexts = this.list.texts.filter((text) => {	// filter texts on old list but not new
				if (!text) return false;
				return (texts[text.id] == null);
			});
			let updateTexts = this.list.texts.filter((text) => {	// filter texts on both lists
				if (!text) return false;
				return (texts[text.id] != null);
			});
			
			addTexts.forEach((textData) => {
				this.list.texts[textData.id] = new Text(this, textData);
			});
			removeTexts.forEach((text) => {
				delete this.list.texts[text.id];
				text.destroy();
			});
			updateTexts.forEach((text) => {
				text.update(texts[text.id]);
			});
		}
	}

	// Create Game
	createTilemap() {
		// this.tilemap = this.make.tilemap({tileWidth: config.TILE_SIZE, tileHeight: config.TILE_SIZE, width: 10, height: 10});
		this.add.image(0, 0, 'map').setOrigin(0, 0);
	}

	createUI() {
		this.ui = {
			id: 0,
			name : "Some Random",
			health: 0,
			inventory: []
		};
	}

	emitInputMove(direction) {
		this.socket.emit('input', {
			input: 'move',
			direction
		});
	}

	createInputs() {
		this.keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
		this.keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
		this.keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
		this.keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
		this.keyShift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
		this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
		this.keyCtrl = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);

		this.pressingLeft = false;
		this.pressingRight = false;
		this.pressingUp = false;
		this.pressingDown = false;

		this.input.keyboard.on('keydown_LEFT', function(event) {
			this.pressingLeft = true;
			this.emitInputMove('left');
		}, this);
		this.input.keyboard.on('keydown_RIGHT', function(event) {
			this.pressingRight = true;
			this.emitInputMove('right');
		}, this);
		this.input.keyboard.on('keydown_UP', function(event) {
			this.pressingUp = true;
			this.emitInputMove('up');
		}, this);
		this.input.keyboard.on('keydown_DOWN', function(event) {
			this.pressingDown = true;
			this.emitInputMove('down');
		}, this);
		
		this.input.keyboard.on('keyup_LEFT', function(event) {
			this.pressingLeft = false;
			if (this.pressingRight) {
				this.emitInputMove('right');
			}
			else if (this.pressingUp) {
				this.emitInputMove('up');
			}
			else if (this.pressingDown) {
				this.emitInputMove('down');
			}
			else {
				this.emitInputMove(null);
			}
		}, this);
		this.input.keyboard.on('keyup_RIGHT', function(event) {
			this.pressingRight = false;
			if (this.pressingLeft) {
				this.emitInputMove('left');
			}
			else if (this.pressingUp) {
				this.emitInputMove('up');
			}
			else if (this.pressingDown) {
				this.emitInputMove('down');
			}
			else {
				this.emitInputMove(null);
			}
		}, this);
		this.input.keyboard.on('keyup_UP', function(event) {
			this.pressingUp = false;
			if (this.pressingLeft) {
				this.emitInputMove('left');
			}
			else if (this.pressingRight) {
				this.emitInputMove('right');
			}
			else if (this.pressingDown) {
				this.emitInputMove('down');
			}
			else {
				this.emitInputMove(null);
			}
		}, this);
		this.input.keyboard.on('keyup_DOWN', function(event) {
			this.pressingDown = false;
			if (this.pressingLeft) {
				this.emitInputMove('left');
			}
			else if (this.pressingRight) {
				this.emitInputMove('right');
			}
			else if (this.pressingUp) {
				this.emitInputMove('up');
			}
			else {
				this.emitInputMove(null);
			}
		}, this);
		
		this.input.keyboard.on('keydown_SHIFT', function(event) {
			this.socket.emit('input', {
				input: 'run',
				state: true
			});
		}, this);
		this.input.keyboard.on('keyup_SHIFT', function(event) {
			this.socket.emit('input', {
				input: 'run',
				state: false
			});
		}, this);
		
		this.input.keyboard.on('keydown_ENTER', function(event) {
			this.socket.emit('input', {
				input: 'pickup',
				state: true
			});
		}, this);
		this.input.keyboard.on('keyup_ENTER', function(event) {
			this.socket.emit('input', {
				input: 'pickup',
				state: false
			});
		}, this);

		this.input.keyboard.on('keydown_CTRL', function(event) {
			this.socket.emit('input', {
				input: 'attack',
				state: true
			});
		}, this);
		this.input.keyboard.on('keyup_CTRL', function(event) {
			this.socket.emit('input', {
				input: 'attack',
				state: false
			});
		}, this);
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

	loadMap() {

	}

	// Client
	createClient() {
		this.socket = io.connect();
		this.socket.on('init', (data) => this.onInit(data));
		this.socket.on('update', (data) => this.onUpdate(data));
		this.socket.emit('login');
	}

	onInit(data) {
		this.ui.id = data.id;
		this.ui.name = data.name;
		this.ui.healthMax = data.healthMax;
		this.ui.health = data.health;
		this.ui.inventory = data.inventory;
	}

	onUpdate(data) {
		if (data) {
			this.updateData = data;
		}
	}
}
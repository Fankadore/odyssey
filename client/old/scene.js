import { Scene } from './lib/phaser.js';
import Map from './classes/map.js';
import UI from './classes/ui.js';
import Actor from './classes/actor.js';
import config from './config.js';
import util from './util.js';

export default class Game extends Scene {
	constructor() {
		super({key: 'game'});
	}

	preload() {
		this.load.setPath('client/assets/');
		this.load.image('map', 'gfx/map.png');
		this.load.image('slot', 'gfx/slot.png');
		
    this.load.spritesheet('sprites', 'gfx/sprites.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('effects', 'gfx/effects.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('floor', 'gfx/floor.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('potions', 'gfx/potions.png', {frameWidth: 32, frameHeight: 32});
	}
	
	create() {
		this.socket = null;
		
		this.keyLeft = null;
		this.keyRight = null;
		this.keyUp = null;
		this.keyDown = null;

		this.players = [];

		this.updateData = {
			players: [],
			ui: {},
			map: {},
			messages: []
		};

		this.createClient();

		this.map = new Map();
		this.add.image(0, 0, 'map').setOrigin(0, 0);

		this.ui = new UI(this);

		this.createKeyboardInputs();
		this.createMouseInputs();
		this.createAnims();
		this.loadMap();
	}

	update(time, delta) {
		let data = this.updateData;
		
		// Update Players
		if (data.players) {
			let addPlayers = data.players.filter((playerData) => {	// filter players on new list but not old
				return (this.players[playerData.id] === null || this.players[playerData.id] === undefined);
			});
			let removePlayers = this.players.filter((player) => {	// filter players on old list but not new
				return (data.players[player.id] === null || data.players[player.id] === undefined);
			});
			let updatePlayers = this.players.filter((player) => {	// filter players on both lists
				return (data.players[player.id] !== null && data.players[player.id] !== undefined);
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

		if (data.map) {
			this.map.update(this, data.map, delta);
		}

		if (data.ui) {
			this.ui.update(this, data.ui, delta);
		}
	}

	emitInputMove(direction) {
		this.socket.emit('input', {
			input: 'move',
			direction
		});
	}

	createKeyboardInputs() {
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
	
	createMouseInputs() {
		this.input.mouse.disableContextMenu();

		this.input.on('pointerdown', function(pointer) {
			let x = pointer.x;
			let y = pointer.y;
			if (this.ui.isWithinMapBounds(x, y)) {
				// Click on Map
				let tileX = ((x - config.MAP_LEFT) - (x % config.TILE_SIZE)) / config.TILE_SIZE;
				let tileY = ((y - config.MAP_TOP) - (y % config.TILE_SIZE)) / config.TILE_SIZE;
			}
			else if (this.ui.isWithinInventoryBounds(x, y)) {
				// Click on Inventory
				let slotX = this.ui.getSlotXFromX(x, config.INVENTORY_LEFT);
				let slotY = this.ui.getSlotYFromY(y, config.INVENTORY_TOP);
				let slot = util.getIndexFromXY(slotX, slotY, config.INVENTORY_COLUMNS);
				if (pointer.leftButtonDown()) {
					if (this.ui.clickSlot(slot)) {
						this.socket.emit('input', {
							input: 'doubleClickItem',
							slot: slot
						});
					}
				}
				else if (pointer.rightButtonDown()) {
					if (this.ui.rightClickSlot(slot)) {
						this.socket.emit('input', {
							input: 'rightClickItem',
							slot: slot
						});
					}
				}
			}
			else if (this.ui.isWithinEquipmentBounds(x, y)) {
				// Click on Equipment
				let slotX = this.ui.getSlotXFromX(x, config.EQUIPMENT_LEFT);
				let slotY = this.ui.getSlotYFromY(y, config.EQUIPMENT_TOP);
				let slot = config.INVENTORY_SIZE + util.getIndexFromXY(slotX, slotY, config.EQUIPMENT_COLUMNS);
				if (pointer.leftButtonDown()) {
					if (this.ui.clickSlot(slot)) {
						this.socket.emit('input', {
							input: 'doubleClickItem',
							slot: slot
						});
					}
				}
				else if (pointer.rightButtonDown()) {
					if (this.ui.rightClickSlot(slot)) {
						this.socket.emit('input', {
							input: 'rightClickItem',
							slot: slot
						});
					}
				}
			}
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
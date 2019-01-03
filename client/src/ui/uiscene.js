import { Scene } from '../lib/phaser.js';
import util from '../lib/util.js';
import config from '../config.js';
import Menu from './menu.js';
import Statbox from './statbox.js';
import Inventory from './inventory.js';
import Infobox from './infobox.js';
import Chatbox from './chatbox.js';

export default class UIScene extends Scene {
  constructor() {
    super({key: 'uiScene', active: true});
  }

	init() {
		this.state = {
			direction: null,
			attack: false,
			pickUp: false,
			run: false,
			scroll: null,
			macro1: false,
			macro2: false,
			macro3: false,
			macro4: false
		};

		this.inputs = {
			left: false,
			right: false,
			up: false,
			down: false,
			attack: false,
			pickUp: false,
			run: false,
			scrollUp: false,
			scrollDown: false,
			macro1: false,
			macro2: false,
			macro3: false,
			macro4: false
		};

		this.moveSpeed = 0;
		this.attackSpeed = 0;
    this.attackTimer = 0;

		this.menu = new Menu(this);
		this.statbox = new Statbox(this);
		this.inventory = new Inventory(this);
		this.infobox = new Infobox(this);
		this.chatbox = new Chatbox(this);
		this.client = null;
		this.gamepad = null;
	}

  preload() {
    this.load.setPath('client/assets/');
    this.load.image('menu', 'gfx/menu.png');
    this.load.image('menu-panel', 'gfx/menu-panel.png');
    this.load.image('map-name', 'gfx/map-name.png');
    this.load.image('statbox', 'gfx/statbox.png');
    this.load.image('infobox', 'gfx/infobox.png');
    this.load.image('info-preview', 'gfx/info-preview.png');
    this.load.image('chatbox', 'gfx/chatbox.png');
    this.load.image('slot', 'gfx/slot.png');
    this.load.image('equipment-slot', 'gfx/equipment-slot.png');
    this.load.image('health-bar', 'gfx/health-bar.png');
    this.load.image('health-bar-empty', 'gfx/health-bar-empty.png');
    this.load.image('energy-bar', 'gfx/energy-bar.png');
    this.load.image('energy-bar-empty', 'gfx/energy-bar-empty.png');
    this.load.image('mana-bar', 'gfx/mana-bar.png');
    this.load.image('mana-bar-empty', 'gfx/mana-bar-empty.png');
    this.load.image('experience-bar', 'gfx/experience-bar.png');
    this.load.image('experience-bar-empty', 'gfx/experience-bar-empty.png');
  }

  create() {
		this.menu.create(this);
		this.statbox.create(this);
		this.inventory.create(this);
		this.infobox.create(this);
		this.chatbox.create(this);

		this.client = this.scene.get('clientScene');
		this.createGamepadInputs();
		this.createKeyboardInputs();
		this.createMouseInputs(this.client);
	}
	
	createGamepadInputs() {
		this.input.gamepad.once('connected', pad => this.gamepad = pad);
		
		this.input.gamepad.on('down', (pad, button, index) => {
			if (button.index === 14) this.inputs.left = true;
			else if (button.index === 15) this.inputs.right = true;
			else if (button.index === 12) this.inputs.up = true;
			else if (button.index === 13) this.inputs.down = true;
			else if (button.index === 2) this.inputs.pickUp = true;
			else if (button.index === 6) this.inputs.run = true;
			else if (button.index === 7) this.inputs.attack = true;
		});
		this.input.gamepad.on('up', (pad, button, index) => {
			if (button.index === 14) this.inputs.left = false;
			else if (button.index === 15) this.inputs.right = false;
			else if (button.index === 12) this.inputs.up = false;
			else if (button.index === 13) this.inputs.down = false;
			else if (button.index === 2) this.inputs.pickUp = false;
			else if (button.index === 6) this.inputs.run = false;
			else if (button.index === 7) this.inputs.attack = false;
		});
	}
	
	createKeyboardInputs() {
		this.input.keyboard.on('keydown', event => {
			if (event.keyCode === 37) this.inputs.left = true;
			else if (event.keyCode === 39) this.inputs.right = true;
			else if (event.keyCode === 38) this.inputs.up = true;
			else if (event.keyCode === 40) this.inputs.down = true;
			else if (event.keyCode === 13) this.inputs.pickUp = true;
			else if (event.keyCode === 16) this.inputs.run = true;
			else if (event.keyCode === 17) this.inputs.attack = true;
			else if (event.keyCode === 112) this.inputs.macro1 = true;
			else if (event.keyCode === 113) this.inputs.macro2 = true;
			else if (event.keyCode === 114) this.inputs.macro3 = true;
			else if (event.keyCode === 115) this.inputs.macro4 = true;
			else if (event.keyCode === 33) this.inputs.scrollUp = true;
			else if (event.keyCode === 34) this.inputs.scrollDown = true;
		});
		this.input.keyboard.on('keyup', event => {
			if (event.keyCode === 37) this.inputs.left = false;
			else if (event.keyCode === 39) this.inputs.right = false;
			else if (event.keyCode === 38) this.inputs.up = false;
			else if (event.keyCode === 40) this.inputs.down = false;
			else if (event.keyCode === 13) this.inputs.pickUp = false;
			else if (event.keyCode === 16) this.inputs.run = false;
			else if (event.keyCode === 17) this.inputs.attack = false;
			else if (event.keyCode === 112) this.inputs.macro1 = false;
			else if (event.keyCode === 113) this.inputs.macro2 = false;
			else if (event.keyCode === 114) this.inputs.macro3 = false;
			else if (event.keyCode === 115) this.inputs.macro4 = false;
			else if (event.keyCode === 33) this.inputs.scrollUp = false;
			else if (event.keyCode === 34) this.inputs.scrollDown = false;
		});
	}
	
	createMouseInputs() {
		this.input.mouse.disableContextMenu();
		this.input.on('pointerdown', (pointer) => {
			const x = pointer.x;
			const y = pointer.y;
			if (this.isWithinMapBounds(x, y)) {
				// Click on Map
				const tileX = ((x - config.MAP_LEFT) - (x % config.TILE_SIZE)) / config.TILE_SIZE;
				const tileY = ((y - config.MAP_TOP) - (y % config.TILE_SIZE)) / config.TILE_SIZE;
				const game = this.scene.get('gameScene');
				const gameMessages = game.clickMap(tileX, tileY);
				if (gameMessages.length > 0) {
					gameMessages.forEach((message) => {
						this.chatbox.clientsideMessage(message);
					});
				}
			}
			else if (this.isWithinInventoryBounds(x, y)) {
				// Click on Inventory
				const slotX = this.inventory.getSlotXFromX(x, config.INVENTORY_LEFT);
				const slotY = this.inventory.getSlotYFromY(y, config.INVENTORY_TOP);
				const slot = util.getIndexFromXY(slotX, slotY, config.INVENTORY_COLUMNS);
				this.buttonDown(pointer, slot);
			}
			else if (this.isWithinEquipmentBounds(x, y)) {
				// Click on Equipment
				const slotX = this.inventory.getSlotXFromX(x, config.EQUIPMENT_LEFT);
				const slotY = this.inventory.getSlotYFromY(y, config.EQUIPMENT_TOP);
				const slot = config.INVENTORY_SIZE + util.getIndexFromXY(slotX, slotY, config.EQUIPMENT_COLUMNS);
				this.buttonDown(pointer, slot);
			}
		});
		this.input.on('dragstart', (pointer, item) => {
			item.dragged = true;
		});
		this.input.on('drag', (pointer, item, dragX, dragY) => {
			item.x = pointer.x - (config.TILE_SIZE / 2);
			item.y = pointer.y - (config.TILE_SIZE / 2);
		});
		this.input.on('dragend', (pointer, item) => {
			setTimeout(() => item.dragged = false, 50);

			if (this.isWithinMapBounds(pointer.x, pointer.y)) {
				this.client.emitInputDrag('dragStopGame', item.slot);
				this.clearItemInfo();
			}
			else if (this.isWithinInventoryBounds(pointer.x, pointer.y)) {
				const newSlotX = this.inventory.getSlotXFromX(pointer.x, config.INVENTORY_LEFT);
				const newSlotY = this.inventory.getSlotYFromY(pointer.y, config.INVENTORY_TOP);
				const newSlot = util.getIndexFromXY(newSlotX, newSlotY, config.INVENTORY_COLUMNS);
				if (item.slot !== newSlot) {
					this.client.emitInputDrag('dragStopInventory', item.slot, newSlot);
					this.inventory.setSelected(newSlot);
				}
				
			}
			else if (this.isWithinEquipmentBounds(pointer.x, pointer.y)) {
				const newSlotX = this.inventory.getSlotXFromX(pointer.x, config.EQUIPMENT_LEFT);
				const newSlotY = this.inventory.getSlotYFromY(pointer.y, config.EQUIPMENT_TOP);
				const newSlot = config.INVENTORY_SIZE + util.getIndexFromXY(newSlotX, newSlotY, config.EQUIPMENT_COLUMNS);
				if (item.slot !== newSlot) {
					this.client.emitInputDrag('dragStopEquipment', item.slot, newSlot);
					this.inventory.setSelected(newSlot);
				}
			}
		});
	}

	buttonDown(pointer, slot) {
		if (pointer.leftButtonDown()) {
			if (this.inventory.clickSlot(slot)) this.client.emitInputClick('doubleClickItem', slot);
			const item = this.inventory.setSelected(slot);
			if (item) this.infobox.setPreview(item.sprite, item.name, item.description);
			else this.infobox.clear();
		}
		else if (pointer.rightButtonDown()) {
			if (this.inventory.hasItemInSlot(slot)) this.client.emitInputClick('rightClickItem', slot);
			this.clearItemInfo();
		}
	}

	update() {
		if (this.gamepad) this.updateGamepadSticks();

		if (this.state.attack !== this.inputs.attack) {
			this.state.attack = this.inputs.attack;
			this.client.emitInput('attack', this.inputs.attack);
		}
		if (this.state.pickUp !== this.inputs.pickUp) {
			this.state.pickUp = this.inputs.pickUp;
			this.client.emitInput('pickup', this.inputs.pickUp);
		}
		if (this.state.run !== this.inputs.run) {
			this.state.run = this.inputs.run;
			this.client.emitInput('run', this.inputs.run);
		}
		if (this.state.macro1 !== this.inputs.macro1) {
			this.state.macro1 = this.inputs.macro1;
			this.client.emitInput('macro1', this.inputs.macro1);
		}
		if (this.state.macro2 !== this.inputs.macro2) {
			this.state.macro2 = this.inputs.macro2;
			this.client.emitInput('macro2', this.inputs.macro2);
		}
		if (this.state.macro3 !== this.inputs.macro3) {
			this.state.macro3 = this.inputs.macro3;
			this.client.emitInput('macro3', this.inputs.macro3);
		}
		if (this.state.macro4 !== this.inputs.macro4) {
			this.state.macro4 = this.inputs.macro4;
			this.client.emitInput('macro4', this.inputs.macro4);
		}

		if (!this.state.scroll) {
			if (this.inputs.scrollUp) this.state.scroll = 'up';
			else if (this.inputs.scrollDown) this.state.scroll = 'down';
		}
		else if (this.state.scroll === 'up' && !this.inputs.scrollUp) {
			if (this.inputs.scrollDown) this.state.scroll = 'down';
			else this.state.scroll = null;
		}
		else if (this.state.scroll === 'down' && !this.inputs.scrollDown) {
			if (this.inputs.scrollUp) this.state.scroll = 'up';
			else this.state.scroll = null;
		}
		if (this.state.scroll === 'up') this.chatbox.scrollUp();
		else if (this.state.scroll === 'down') this.chatbox.scrollDown();

		if (!this.state.direction) {
			if (this.inputs.left) this.state.direction = 'left';
			else if (this.inputs.right) this.state.direction = 'right';
			else if (this.inputs.up) this.state.direction = 'up';
			else if (this.inputs.down) this.state.direction = 'down';
			if (this.state.direction) this.client.emitInputMove(this.state.direction);
		}
		else if (this.state.direction === 'left' && !this.inputs.left) {
			if (this.inputs.right) this.state.direction = 'right';
			else if (this.inputs.up) this.state.direction = 'up';
			else if (this.inputs.down) this.state.direction = 'down';
			else this.state.direction = null;
			this.client.emitInputMove(this.state.direction);
		}
		else if (this.state.direction === 'right' && !this.inputs.right) {
			if (this.inputs.left) this.state.direction = 'left';
			else if (this.inputs.up) this.state.direction = 'up';
			else if (this.inputs.down) this.state.direction = 'down';
			else this.state.direction = null;
			this.client.emitInputMove(this.state.direction);
		}
		else if (this.state.direction === 'up' && !this.inputs.up) {
			if (this.inputs.left) this.state.direction = 'left';
			else if (this.inputs.right) this.state.direction = 'right';
			else if (this.inputs.down) this.state.direction = 'down';
			else this.state.direction = null;
			this.client.emitInputMove(this.state.direction);
		}
		else if (this.state.direction === 'down' && !this.inputs.down) {
			if (this.inputs.left) this.state.direction = 'left';
			else if (this.inputs.right) this.state.direction = 'right';
			else if (this.inputs.up) this.state.direction = 'up';
			else this.state.direction = null;
			this.client.emitInputMove(this.state.direction);
		}
	}

  onUpdate(data) {
		if (data.moveSpeed != null) this.moveSpeed = data.moveSpeed;
		if (data.attackSpeed != null) this.attackSpeed = data.attackSpeed;
		if (data.attackTimer != null) this.attackTimer = data.attackTimer;

		if (this.statbox) this.statbox.onUpdate(data);
		if (this.inventory) this.inventory.onUpdate(data.inventory);
		if (this.chatbox) this.chatbox.onUpdate(data.messages);
  }
	
	updateGamepadSticks() {
		const x = this.gamepad.axes[0].value;
		const y = this.gamepad.axes[1].value;

		if (x < -0.6) this.inputs.left = true;
		else this.inputs.left = false;
		if (x > 0.6) this.inputs.right = true;
		else this.inputs.right = false;
		if (y < -0.6) this.inputs.up = true;
		else this.inputs.up = false;
		if (y > 0.6) this.inputs.down = true;
		else this.inputs.down = false;
	}

	onLoadMap(data) {
		if (this.menu) this.menu.onLoadMap(data.name);
		// player is on data.isHostile tile = show pk indicator
	}

	isWithinMapBounds(x, y) {
		return (x >= config.MAP_LEFT && x < config.MAP_RIGHT && y >= config.MAP_TOP && y < config.MAP_BOTTOM);
	}

	isWithinInventoryBounds(x, y) {
		return (x >= config.INVENTORY_LEFT && x < config.INVENTORY_RIGHT && y >= config.INVENTORY_TOP && y < config.INVENTORY_BOTTOM);
	}
	
	isWithinEquipmentBounds(x, y) {
		return (x >= config.EQUIPMENT_LEFT && x < config.EQUIPMENT_RIGHT && y >= config.EQUIPMENT_TOP && y < config.EQUIPMENT_BOTTOM);
	}
	
	clearItemInfo() {
		this.inventory.setSelected(null);
		this.infobox.clear();
	}
}

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
		this.pressingLeft = false;
		this.pressingRight = false;
		this.pressingUp = false;
		this.pressingDown = false;

		this.moveSpeed = 0;
		this.attackSpeed = 0;
    this.attackTimer = 0;

		this.menu = new Menu(this);
		this.statbox = new Statbox(this);
		this.inventory = new Inventory(this);
		this.infobox = new Infobox(this);
		this.chatbox = new Chatbox(this);
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

		// Create Inputs
		const client = this.scene.get('clientScene');
		
		// Create Keyboard Inputs
		this.input.keyboard.on('keydown_LEFT', () => {
			this.pressingLeft = true;
			client.emitInputMove('left');
		});
		this.input.keyboard.on('keydown_RIGHT', () => {
			this.pressingRight = true;
			client.emitInputMove('right');
		});
		this.input.keyboard.on('keydown_UP', () => {
			this.pressingUp = true;
			client.emitInputMove('up');
		});
		this.input.keyboard.on('keydown_DOWN', () => {
			this.pressingDown = true;
			client.emitInputMove('down');
		});
		
		this.input.keyboard.on('keyup_LEFT', () => {
			this.pressingLeft = false;
			if (this.pressingRight) {
				client.emitInputMove('right');
			}
			else if (this.pressingUp) {
				client.emitInputMove('up');
			}
			else if (this.pressingDown) {
				client.emitInputMove('down');
			}
			else {
				client.emitInputMove(null);
			}
		});
		this.input.keyboard.on('keyup_RIGHT', () => {
			this.pressingRight = false;
			if (this.pressingLeft) {
				client.emitInputMove('left');
			}
			else if (this.pressingUp) {
				client.emitInputMove('up');
			}
			else if (this.pressingDown) {
				client.emitInputMove('down');
			}
			else {
				client.emitInputMove(null);
			}
		});
		this.input.keyboard.on('keyup_UP', () => {
			this.pressingUp = false;
			if (this.pressingLeft) {
				client.emitInputMove('left');
			}
			else if (this.pressingRight) {
				client.emitInputMove('right');
			}
			else if (this.pressingDown) {
				client.emitInputMove('down');
			}
			else {
				client.emitInputMove(null);
			}
		});
		this.input.keyboard.on('keyup_DOWN', () => {
			this.pressingDown = false;
			if (this.pressingLeft) {
				client.emitInputMove('left');
			}
			else if (this.pressingRight) {
				client.emitInputMove('right');
			}
			else if (this.pressingUp) {
				client.emitInputMove('up');
			}
			else {
				client.emitInputMove(null);
			}
		});
		
		this.input.keyboard.on('keydown_SHIFT', () => client.emitInput('run', true));
		this.input.keyboard.on('keyup_SHIFT', () => client.emitInput('run', false));
		this.input.keyboard.on('keydown_ENTER', () => client.emitInput('pickup', true));
		this.input.keyboard.on('keyup_ENTER', () => client.emitInput('pickup', false));
		this.input.keyboard.on('keydown_CTRL', () => client.emitInput('attack', true));
		this.input.keyboard.on('keyup_CTRL', () => client.emitInput('attack', false));
		this.input.keyboard.on('keydown_PAGE_UP', () => this.chatbox.scrollUp());
		this.input.keyboard.on('keydown_PAGE_DOWN', () => this.chatbox.scrollDown());
		this.input.keyboard.on('keydown_F2', () => client.emitCommand('spawnMapItem', 1, 5, 5, "5c1bfeb7d8fb6012cc966083"));
		this.input.keyboard.on('keydown_F3', () => client.emitCommand('spawnMapItem', 1, 5, 5, 5));
		this.input.keyboard.on('keydown_F4', () => client.emitCommand('spawnBot', 1, 5, 5, 0));
		this.input.keyboard.on('keydown_F5', () => client.emitCommand('setSprite', 1));
		
		// Create Mouse Inputs
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
				this.buttonDown(client, pointer, slot);
			}
			else if (this.isWithinEquipmentBounds(x, y)) {
				// Click on Equipment
				const slotX = this.inventory.getSlotXFromX(x, config.EQUIPMENT_LEFT);
				const slotY = this.inventory.getSlotYFromY(y, config.EQUIPMENT_TOP);
				const slot = config.INVENTORY_SIZE + util.getIndexFromXY(slotX, slotY, config.EQUIPMENT_COLUMNS);
				this.buttonDown(client, pointer, slot);
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
				client.emitInputDrag('dragStopGame', item.slot);
				this.clearItemInfo();
			}
			else if (this.isWithinInventoryBounds(pointer.x, pointer.y)) {
				const newSlotX = this.inventory.getSlotXFromX(pointer.x, config.INVENTORY_LEFT);
				const newSlotY = this.inventory.getSlotYFromY(pointer.y, config.INVENTORY_TOP);
				const newSlot = util.getIndexFromXY(newSlotX, newSlotY, config.INVENTORY_COLUMNS);
				if (item.slot !== newSlot) {
					client.emitInputDrag('dragStopInventory', item.slot, newSlot);
					this.inventory.setSelected(newSlot);
				}
				
			}
			else if (this.isWithinEquipmentBounds(pointer.x, pointer.y)) {
				const newSlotX = this.inventory.getSlotXFromX(pointer.x, config.EQUIPMENT_LEFT);
				const newSlotY = this.inventory.getSlotYFromY(pointer.y, config.EQUIPMENT_TOP);
				const newSlot = config.INVENTORY_SIZE + util.getIndexFromXY(newSlotX, newSlotY, config.EQUIPMENT_COLUMNS);
				if (item.slot !== newSlot) {
					client.emitInputDrag('dragStopEquipment', item.slot, newSlot);
					this.inventory.setSelected(newSlot);
				}
			}
		});
	}
	
  onUpdate(data) {
		if (data.moveSpeed != null) this.moveSpeed = data.moveSpeed;
		if (data.attackSpeed != null) this.attackSpeed = data.attackSpeed;
		if (data.attackTimer != null) this.attackTimer = data.attackTimer;

		if (this.statbox) this.statbox.onUpdate(data);
		if (this.inventory) this.inventory.onUpdate(data.inventory);
		if (this.chatbox) this.chatbox.onUpdate(data.messages);
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

	buttonDown(client, pointer, slot) {
		if (pointer.leftButtonDown()) {
			if (this.inventory.clickSlot(slot)) client.emitInputClick('doubleClickItem', slot);
			const item = this.inventory.setSelected(slot);
			if (item) this.infobox.setPreview(item.sprite, item.name, item.description);
			else this.infobox.clear();
		}
		else if (pointer.rightButtonDown()) {
			if (this.inventory.hasItemInSlot(slot)) client.emitInputClick('rightClickItem', slot);
			this.clearItemInfo();
		}
	}

	clearItemInfo() {
		this.inventory.setSelected(null);
		this.infobox.clear();
	}
}

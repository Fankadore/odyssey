import { Scene } from '../lib/phaser.js';
import InventoryItem from './inventoryitem.js';
import Chatbox from './chatbox.js';
import Message from './message.js';
import config from '../config.js';
import util from '../util.js';

export default class UIScene extends Scene {
  constructor() {
    super({key: 'uiScene', active: true});
  }

	init() {
		this.pressingLeft = false;
		this.pressingRight = false;
		this.pressingUp = false;
		this.pressingDown = false;

    this.mapName = 'Blank Map';
		this.health = 0;
		this.healthMax = 0;
		this.energy = 0;
		this.energyMax = 0;
		this.moveSpeed = 0;
		this.attackSpeed = 0;
    this.attackTimer = 0;
		
		this.healthBar = null;
		this.energyBar = null;
		this.manaBar = null;
		this.experienceBar = null;

    this.inventory = [];
		this.chatbox = new Chatbox(this);

		this.menuView = 'inventory';
		this.selected = null;
	}

  preload() {
    this.load.setPath('client/assets/');
    this.load.image('menu', 'gfx/menu.png');
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
		this.input.keyboard.on('keydown_F1', () => client.emitCommand('spawnMapItem', 1, 5, 5, 4));
		this.input.keyboard.on('keydown_F2', () => client.emitCommand('spawnMapItem', 1, 5, 5, 5));
		this.input.keyboard.on('keydown_F3', () => client.emitCommand('spawnBot', 1, 5, 5, 0));
		this.input.keyboard.on('keydown_F4', () => client.emitCommand('spawnBot', 1, 5, 5, 1));
		
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
				game.clickMap(tileX, tileY);
				
			}
			else if (this.isWithinInventoryBounds(x, y)) {
				// Click on Inventory
				const slotX = this.getSlotXFromX(x, config.INVENTORY_LEFT);
				const slotY = this.getSlotYFromY(y, config.INVENTORY_TOP);
				const slot = util.getIndexFromXY(slotX, slotY, config.INVENTORY_COLUMNS);
				if (pointer.leftButtonDown()) {
					if (this.clickSlot(slot)) {
						client.emitInputClick('doubleClickItem', slot);
					}
				}
				else if (pointer.rightButtonDown()) {
					if (this.rightClickSlot(slot)) {
						client.emitInputClick('rightClickItem', slot);
					}
				}
			}
			else if (this.isWithinEquipmentBounds(x, y)) {
				// Click on Equipment
				const slotX = this.getSlotXFromX(x, config.EQUIPMENT_LEFT);
				const slotY = this.getSlotYFromY(y, config.EQUIPMENT_TOP);
				const slot = config.INVENTORY_SIZE + util.getIndexFromXY(slotX, slotY, config.EQUIPMENT_COLUMNS);
				if (pointer.leftButtonDown()) {
					if (this.clickSlot(slot)) {
						client.emitInputClick('doubleClickItem', slot);
					}
				}
				else if (pointer.rightButtonDown()) {
					if (this.rightClickSlot(slot)) {
						client.emitInputClick('rightClickItem', slot);
					}
				}
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
			}
			else if (this.isWithinInventoryBounds(pointer.x, pointer.y)) {
				let newSlotX = this.getSlotXFromX(pointer.x, config.INVENTORY_LEFT);
				let newSlotY = this.getSlotYFromY(pointer.y, config.INVENTORY_TOP);
				let newSlot = util.getIndexFromXY(newSlotX, newSlotY, config.INVENTORY_COLUMNS);
				if (item.slot !== newSlot) client.emitInputDrag('dragStopInventory', item.slot, newSlot);
			}
			else if (this.isWithinEquipmentBounds(pointer.x, pointer.y)) {
				let newSlotX = this.getSlotXFromX(pointer.x, config.EQUIPMENT_LEFT);
				let newSlotY = this.getSlotYFromY(pointer.y, config.EQUIPMENT_TOP);
				let newSlot = config.INVENTORY_SIZE + util.getIndexFromXY(newSlotX, newSlotY, config.EQUIPMENT_COLUMNS);
				if (item.slot !== newSlot) {
					client.emitInputDrag('dragStopEquipment', item.slot, newSlot);
				}
			}
		});

		this.add.image(config.MENU_LEFT, config.MENU_TOP, 'menu').setOrigin(0, 0);
		
		// Create Statbox
		this.graphics = this.make.graphics();		
    this.graphics.fillRect(config.STATBOX_LEFT, config.STATBOX_TOP, config.STATBOX_WIDTH, 12);
    this.graphics.fillRect(config.STATBOX_LEFT, config.STATBOX_TOP + (config.STATBOX_HEIGHT / 4), config.STATBOX_WIDTH, 12);
    this.graphics.fillRect(config.STATBOX_LEFT, config.STATBOX_TOP + (config.STATBOX_HEIGHT / 2), config.STATBOX_WIDTH, 12);
    this.graphics.fillRect(config.STATBOX_LEFT, config.STATBOX_TOP + ((config.STATBOX_HEIGHT / 4) * 3), config.STATBOX_WIDTH, 12);
    this.statBarMask = this.graphics.createGeometryMask();

		this.add.image(config.STATBOX_LEFT, config.STATBOX_TOP, 'health-bar-empty').setOrigin(0, 0);
		this.add.image(config.STATBOX_LEFT, config.STATBOX_TOP + (config.STATBOX_HEIGHT / 4), 'energy-bar-empty').setOrigin(0, 0);
		this.add.image(config.STATBOX_LEFT, config.STATBOX_TOP + (config.STATBOX_HEIGHT / 2), 'mana-bar-empty').setOrigin(0, 0);
		this.add.image(config.STATBOX_LEFT, config.STATBOX_TOP + ((config.STATBOX_HEIGHT / 4) * 3), 'experience-bar-empty').setOrigin(0, 0);
		
		this.healthBar = this.add.image(config.STATBOX_LEFT, config.STATBOX_TOP, 'health-bar').setOrigin(0, 0).setMask(this.statBarMask);
		this.energyBar = this.add.image(config.STATBOX_LEFT, config.STATBOX_TOP + (config.STATBOX_HEIGHT / 4), 'energy-bar').setOrigin(0, 0).setMask(this.statBarMask);
		this.manaBar = this.add.image(config.STATBOX_LEFT, config.STATBOX_TOP + (config.STATBOX_HEIGHT / 2), 'mana-bar').setOrigin(0, 0).setMask(this.statBarMask);
		this.experienceBar = this.add.image(config.STATBOX_LEFT, config.STATBOX_TOP + ((config.STATBOX_HEIGHT / 4) * 3), 'experience-bar').setOrigin(0, 0).setMask(this.statBarMask);
		
		// Create Inventory
		for (let slot = 0; slot < config.INVENTORY_SIZE + config.EQUIPMENT_SIZE; slot++) {
			if (slot < config.INVENTORY_SIZE) {
				this.add.image(this.getXFromSlot(slot), this.getYFromSlot(slot), 'slot').setOrigin(0, 0);
			}
			else {
				this.add.image(this.getXFromSlot(slot), this.getYFromSlot(slot), 'equipment-slot').setOrigin(0, 0);
			}
		}

		// Create Infobox
		
		
		// Create Chatbox
		this.add.image(config.CHATBOX_LEFT, config.CHATBOX_TOP, 'chatbox').setOrigin(0, 0);

	}

  onUpdate(data) {
		if (data.health != null) this.health = data.health;
		if (data.healthMax != null) this.healthMax = data.healthMax;
		if (data.energy != null) this.energy = data.energy;
		if (data.energyMax != null) this.energyMax = data.energyMax;
		if (data.moveSpeed != null) this.moveSpeed = data.moveSpeed;
		if (data.attackSpeed != null) this.attackSpeed = data.attackSpeed;
		if (data.attackTimer != null) this.attackTimer = data.attackTimer;
		
		// Update Stat Bars
		if (this.graphics) {
			this.graphics.clear();
			this.graphics.fillRect(config.STATBOX_LEFT, config.STATBOX_TOP, config.STATBOX_WIDTH * (this.health / this.healthMax), 12);
			this.graphics.fillRect(config.STATBOX_LEFT, config.STATBOX_TOP + (config.STATBOX_HEIGHT / 4), config.STATBOX_WIDTH * (this.energy / this.energyMax), 12);
			this.graphics.fillRect(config.STATBOX_LEFT, config.STATBOX_TOP + (config.STATBOX_HEIGHT / 2), config.STATBOX_WIDTH * (1 / 1), 12);
			this.graphics.fillRect(config.STATBOX_LEFT, config.STATBOX_TOP + ((config.STATBOX_HEIGHT / 4) * 3), config.STATBOX_WIDTH * (1 / 1), 12);
		}
		
		// Update Inventory Items
		if (data.inventory) {
			let addItems = data.inventory.filter((itemData) => {	// filter text on new list but not old
				if (!itemData) return false;
				return (this.inventory[itemData.slot] == null);
			});
			let removeItems = this.inventory.filter((item) => {	// filter items on old list but not new
				if (!item) return false;
				return (data.inventory[item.slot] == null);
			});
			let updateItems = this.inventory.filter((item) => {	// filter items on both lists
				if (!item) return false;
				return (data.inventory[item.slot] != null);
			});
			
			addItems.forEach((itemData) => {
				itemData.x = this.getXFromSlot(itemData.slot);
				itemData.y = this.getYFromSlot(itemData.slot);
				this.inventory[itemData.slot] = new InventoryItem(this, itemData);
			});
			removeItems.forEach((item) => {
				delete this.inventory[item.slot];
				item.destroy();
			});
			updateItems.forEach((item) => {
				let itemData = data.inventory[item.slot];
				itemData.x = this.getXFromSlot(itemData.slot);
				itemData.y = this.getYFromSlot(itemData.slot);
				item.onUpdate(itemData);
			});
		}
		
		// Update Messages
		if (data.messages) {
			data.messages.forEach((messageData) => {
				this.chatbox.messages.unshift(new Message(this, messageData));
			});
			this.chatbox.onUpdate();
		}

		// Update Cursor
		this.chatbox.cursor.onUpdate();
  }
	
	onLoadMap(mapName) {
		this.mapName = mapName;
	}

  displayInventory() {
		this.menuView = 'inventory';
	}
	
	displayMenu() {
		this.menuView = 'menu';
  }

  clickSlot(slot) {
		this.selected = slot;
		let item = this.inventory[slot];
		if (item) {
			if (item.clickedTime > 0) {
				item.clickedTime = 0;
				return true;	// Double Click
			}
			else {
				item.clickedTime = new Date().getTime();
			}
		}
		return false;	// Single Click
	}

	rightClickSlot(slot) {
		this.selected = null;
		let item = this.inventory[slot];
		return (item) ? true : false;
  }
  
  getXFromSlot(slot) {	// Takes a slot number and turns it into a pixel x
		if (slot < 0 || slot >= config.INVENTORY_SIZE + config.EQUIPMENT_SIZE) return null;
	
		if (slot < config.INVENTORY_SIZE) {
			return config.INVENTORY_LEFT + (util.getXFromIndex(slot, config.INVENTORY_COLUMNS) * config.SLOT_SIZE);
		}
		else {
			return config.EQUIPMENT_LEFT + (util.getXFromIndex(slot - config.INVENTORY_SIZE, config.EQUIPMENT_COLUMNS) * config.SLOT_SIZE);
		}
	}
	
	getYFromSlot(slot) {	// Takes a slot number and turns it into a pixel y
		if (slot < 0 || slot >= config.INVENTORY_SIZE + config.EQUIPMENT_SIZE) return null;
	
		if (slot < config.INVENTORY_SIZE) {
			return config.INVENTORY_TOP + (util.getYFromIndex(slot, config.INVENTORY_COLUMNS) * config.SLOT_SIZE);
		}
		else {
			return config.EQUIPMENT_TOP + (util.getYFromIndex(slot - config.INVENTORY_SIZE, config.EQUIPMENT_COLUMNS) * config.SLOT_SIZE);
		}
	}

	getSlotXFromX(x, offsetX = 0) {	// Takes a pixel x and turns it into slot x
		x -= offsetX;
		return (x - (x % config.SLOT_SIZE)) / config.SLOT_SIZE;
	}

	getSlotYFromY(y, offsetY = 0) {	// Takes a pixel y and turns it into slot y
		y -= offsetY;
		return (y - (y % config.SLOT_SIZE)) / config.SLOT_SIZE;
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
}

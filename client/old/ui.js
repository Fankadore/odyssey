import InventoryItem from './inventoryitem.js';
import config from '../config.js';
import util from '../util.js';

export default class UI {
	constructor(scene) {
		this.health = 0;
		this.healthMax = 0;
		this.energy = 0;
		this.energyMax = 0;
		this.moveSpeed = 0;
		this.attackSpeed = 0;
		this.attackTimer = 0;
		this.inventory = [];
		this.view = 'inventory';
		this.selected = null;

		for (let slot = 0; slot < config.INVENTORY_SIZE + config.EQUIPMENT_SIZE; slot++) {
			scene.add.image(this.getXFromSlot(slot), this.getYFromSlot(slot), 'slot').setOrigin(0, 0);
		}
	}

	update(scene, data, delta) {
		if (data.health != null) this.health = data.health;
		if (data.healthMax != null) this.healthMax = data.healthMax;
		if (data.energy != null) this.energy = data.energy;
		if (data.energyMax != null) this.energyMax = data.energyMax;
		if (data.moveSpeed != null) this.moveSpeed = data.moveSpeed;
		if (data.attackSpeed != null) this.attackSpeed = data.attackSpeed;
		if (data.attackTimer != null) this.attackTimer = data.attackTimer;

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
				this.inventory[itemData.slot] = new InventoryItem(scene, itemData);
			});
			removeItems.forEach((item) => {
				delete this.inventory[item.slot];
				item.destroy();
			});
			updateItems.forEach((item) => {
				let itemData = data.inventory[item.slot];
				itemData.x = this.getXFromSlot(itemData.slot);
				itemData.y = this.getYFromSlot(itemData.slot);
				item.update(itemData, delta);
			});
		}
	}

	displayInventory() {
		this.view = 'inventory';
	}

	displayMenu() {
		this.view = 'menu';
	}

	clickSlot(slot) {
		this.selected = slot;
		let item = this.inventory[slot];
		if (item != null) {
			if (item.clicked) {
				// Double Click
				item.clicked = false;
				item.clickTime = 0;
				return true;
			}
			else {
				item.clicked = true;
			}
		}
		return false;
	}

	rightClickSlot(slot) {
		this.selected = null;
		let item = this.inventory[slot];
		if (item != null) return true;
		return false;
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
		return (x - ((x - offsetX) % config.SLOT_SIZE) - offsetX) / config.SLOT_SIZE;
	}

	getSlotYFromY(y, offsetY = 0) {	// Takes a pixel y and turns it into slot y
		return (y - ((y - offsetY) % config.SLOT_SIZE) - offsetY) / config.SLOT_SIZE;
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
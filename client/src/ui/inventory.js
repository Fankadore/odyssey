import util from '../lib/util.js';
import config from '../config.js';
import InventoryItem from './inventoryitem.js';

export default class Inventory {
	constructor() {
		this.items = [];
		this.slots = [];
		this.selected = null;
		this.InventoryItem = null;
	}

	create(scene) {
		for (let slot = 0; slot < config.INVENTORY_SIZE + config.EQUIPMENT_SIZE; slot++) {
			if (slot < config.INVENTORY_SIZE) {
				this.slots[slot] = scene.add.image(this.getXFromSlot(slot), this.getYFromSlot(slot), 'slot').setOrigin(0, 0);
			}
			else {
				this.slots[slot] = scene.add.image(this.getXFromSlot(slot), this.getYFromSlot(slot), 'equipment-slot').setOrigin(0, 0);
			}
		}
		this.InventoryItem = (itemData) => {
			return new InventoryItem(scene, itemData);
		};
	}

	onUpdate(data) {
		if (!data) return;
		
		const addItems = data.filter((itemData) => {	// filter text on new list but not old
			if (!itemData) return false;
			return (this.items[itemData.slot] == null);
		});
		const removeItems = this.items.filter((item) => {	// filter items on old list but not new
			if (!item) return false;
			return (data[item.slot] == null);
		});
		const updateItems = this.items.filter((item) => {	// filter items on both lists
			if (!item) return false;
			return (data[item.slot] != null);
		});
		
		addItems.forEach((itemData) => {
			itemData.x = this.getXFromSlot(itemData.slot) + 3;
			itemData.y = this.getYFromSlot(itemData.slot) + 3;
			this.items[itemData.slot] = this.InventoryItem(itemData);
		});
		removeItems.forEach((item) => {
			if (item.slot === this.selected) this.setSelected(null);
			delete this.items[item.slot];
			item.destroy();
		});
		updateItems.forEach((item) => {
			const itemData = data[item.slot];
			itemData.x = this.getXFromSlot(itemData.slot) + 3;
			itemData.y = this.getYFromSlot(itemData.slot) + 3;
			item.onUpdate(itemData);
		});
	}

	setSelected(slot) {
		if (this.selected != null) this.slots[this.selected].setTint(0xffffff);

		if (slot != null && slot >= 0 && slot < config.INVENTORY_SIZE + config.EQUIPMENT_SIZE) {
			this.selected = slot;
			this.slots[slot].setTint(0x00ffff);
			return this.items[slot];
		}
		else {
			this.selected = null;
		}
	}

	clickSlot(slot) {
		const item = this.items[slot];
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

	hasItemInSlot(slot) {
		return (this.items[slot]) ? true : false;
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
}

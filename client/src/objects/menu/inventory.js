import util from '../../lib/util.js';
import config from '../../config.js';
import InventoryItem from './inventoryitem.js';

export default class Inventory {
	constructor(scene) {
		this.items = [];
		this.slots = [];
		this.selected = null;

		for (let slot = 0; slot < config.INVENTORY_SIZE + config.EQUIPMENT_SIZE; slot++) {
			const x = this.getXFromSlot(slot);
			const y = this.getYFromSlot(slot);
			let imageRef = 'slot';
			if (slot >= config.INVENTORY_SIZE) imageRef = 'equipment-slot';
			this.slots[slot] = scene.add.image(x, y, imageRef).setOrigin(0, 0);
		}

		this.InventoryItem = (itemData) => new InventoryItem(scene, itemData);
	}

	onUpdate(data) {
		if (!data) return;
		
		// Add Items - filter for items on new list but not old
		data.filter(itemData => itemData && !this.items[itemData.slot])
		.forEach(itemData => {
			itemData.x = this.getXFromSlot(itemData.slot) + 3;
			itemData.y = this.getYFromSlot(itemData.slot) + 3;
			this.items[itemData.slot] = this.InventoryItem(itemData);
		});

		// Remove Items - filter for items on old list but not new
		this.items.filter(item => item && !data[item.slot])
		.forEach(item => {
			if (item.slot === this.selected) this.setSelected(null);
			delete this.items[item.slot];
			item.destroy();
		});

		// Update Items - filter for items on both lists
		this.items.filter(item => item && data[item.slot])
		.forEach(item => {
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
			return null;
		}
	}

	clickSlot(slot) {
		const data = {};
		data.item = this.setSelected(slot);
		if (data.item) data.doubleClick = this.checkDoubleClick(data.item);
		return data;
	}

	checkDoubleClick(item) {
		if (!item) return false;
		
		if (item.clickedTime > 0) {
			item.clickedTime = 0;
			return true;	// Double Click
		}
		else {
			item.clickedTime = new Date().getTime();
			return false;	// Single Click
		}
	}

	hasItemInSlot(slot) {
		return !!this.items[slot];
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

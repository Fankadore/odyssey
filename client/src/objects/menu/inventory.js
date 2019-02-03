import { Panel } from '../../lib/phaser-ui.js';
import util from '../../lib/util.js';
import config from '../../config.js';
import InventoryItem from './inventoryitem.js';

export default class Inventory extends Panel {
	constructor(scene, x, y) {
		super(scene, x, y, true);

		this.items = [];
		this.slots = [];
		this.selected = scene.add.image(x + (config.SLOT_SIZE / 2), y + (config.SLOT_SIZE / 2), 'selected').setVisible(false);
	}

	onUpdate(data) {
		if (!data) return;
		
		// Add Items - filter for items on new list but not old
		data.filter(itemData => itemData && !this.items[itemData.slot])
		.forEach(itemData => {
			itemData.x = this.getXFromSlot(itemData.slot);
			itemData.y = this.getYFromSlot(itemData.slot);
			this.items[itemData.slot] = new InventoryItem(this.scene, itemData);
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
			itemData.x = this.getXFromSlot(itemData.slot);
			itemData.y = this.getYFromSlot(itemData.slot);
			item.onUpdate(itemData);
		});
	}

	setSelected(slot) {
		if (slot != null && slot >= 0 && slot < config.INVENTORY.size + config.EQUIPMENT.size) {
			if (!this.selected.visible) this.selected.setVisible(true);
			this.selected.setPosition(this.getXFromSlot(slot), this.getYFromSlot(slot));
			this.selected.slot = slot;
			return this.items[slot];
		}
		else {
			this.selected.setVisible(false);
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
		if (slot < 0 || slot >= config.INVENTORY.size + config.EQUIPMENT.size) return null;
	
		if (slot < config.INVENTORY.size) {
			return this.x + (config.SLOT_SIZE / 2) + (util.getXFromIndex(slot, config.INVENTORY.columns) * config.SLOT_SIZE);
		}
		else {
			return this.x + (config.SLOT_SIZE / 2) + (util.getXFromIndex(slot - config.INVENTORY.size, config.EQUIPMENT.columns) * config.SLOT_SIZE);
		}
	}
	
	getYFromSlot(slot) {	// Takes a slot number and turns it into a pixel y
		if (slot < 0 || slot >= config.INVENTORY.size + config.EQUIPMENT.size) return null;
	
		if (slot < config.INVENTORY.size) {
			return this.y + (config.SLOT_SIZE / 2) + (util.getYFromIndex(slot, config.INVENTORY.columns) * config.SLOT_SIZE);
		}
		else {
			return this.y + (config.SLOT_SIZE / 2) + 2 + (util.getYFromIndex(slot, config.INVENTORY.columns) * config.SLOT_SIZE);
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

import db from '../db.js';
import game from '../game.js';
import util from '../util.js';

export default class InventoryItem {
	constructor(playerId, slot, itemRef, stack) {
		this.player = playerId;
		this.slot = slot;
		this.itemRef = itemRef;
		this.stack = stack;

		let data = db.getItemData(this.itemRef);
		this.name = data.name;
		this.type = data.type;
		this.sprite = data.sprite;
		this.reusable = data.reusable;
		this.damageBonus = data.damageBonus;
		this.defenceBonus = data.defenceBonus;
		this.healthMaxBonus = data.healthMaxBonus;
		this.energyMaxBonus = data.energyMaxBonus;
		this.rangeBonus = data.rangeBonus;
		
		this.clicked = false;
		this.clickTime = 0;
		
		game.playerList[this.player].inventory[this.slot] = this;
	}

	update() {
		return this.getPack();
	}

	getPack() {
		return {
			slot: this.slot,
			index: this.index,
			stack: this.stack,
			name: this.name,
			sprite: this.sprite,
			type: this.type,
			reusable: this.reusable,
			damageBonus: this.damageBonus,
			defenceBonus: this.defenceBonus,
			healthMaxBonus: this.healthMaxBonus,
			energyMaxBonus: this.energyMaxBonus,
			rangeBonus: this.rangeBonus
		};
	}
	
	remove() {
		delete game.playerList[this.player].inventory[this.slot];
	}
	
	checkIsEquipment() {
		if (this.type === 'weapon' || this.type === 'shield' || this.type === 'armour' || this.type === 'helmet' || this.type === 'ring') {
			return true;
		}
		else {
			return false;
		}
	}
	
	findEquipmentSlot() {
		switch (this.type) {
			case "weapon": return config.INVENTORY_SIZE;
			break;
			case "shield": return config.INVENTORY_SIZE + 1;
			break;
			case "armour": return config.INVENTORY_SIZE + 2;
			break;
			case "helmet": return config.INVENTORY_SIZE + 3;
			break;
			case "ring": return config.INVENTORY_SIZE + 4;
			break;
			default: return null;
		}
	}
}

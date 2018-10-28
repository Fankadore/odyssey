import db from '../db.js';
import game from '../game.js';
import config from '../config.js';
import util from '../util.js';
import Entity from './entity.js';

export default class Item extends Entity {
	constructor(data) {
		if (!data.owner || data.itemClass == null || data.id == null) return;
		
		if (data.owner === 'player') {
			if (data.slot == null) return;
		}
		else if (data.owner === 'bot') {
			if (data.mapId == null || data.slot == null) return;
		}
		else if (data.owner === 'map') {
			if (data.mapId == null || data.x == null || data.y == null) return;
		}

		if (data.mapId === undefined) data.mapId = null;
		if (data.x === undefined) data.x = null;
		if (data.y === undefined) data.y = null;
		if (data.z === undefined) data.z = -10;
		if (data.slot === undefined) data.slot = null;

		let classData = db.getItemData(data.itemClass);
		if (data.name == null) data.name = classData.name;
		if (data.type == null) data.type = classData.type;
		if (data.sprite == null) data.sprite = classData.sprite;
		if (data.reusable == null) data.reusable = classData.reusable;
		if (data.stack == null) data.stack = classData.stack;

		if (data.passiveDamage == null) data.passiveDamage = classData.passiveDamage;
		if (data.passiveDefence == null) data.passiveDefence = classData.passiveDefence;
		if (data.passiveHealthMax == null) data.passiveHealthMax = classData.passiveHealthMax;
		if (data.passiveEnergyMax == null) data.passiveEnergyMax = classData.passiveEnergyMax;
		if (data.passiveRange == null) data.passiveRange = classData.passiveRange;

		if (data.equipDamage == null) data.equipDamage = classData.equipDamage;
		if (data.equipDefence == null) data.equipDefence = classData.equipDefence;
		if (data.equipHealthMax == null) data.equipHealthMax = classData.equipHealthMax;
		if (data.equipEnergyMax == null) data.equipEnergyMax = classData.equipEnergyMax;
		if (data.equipRange == null) data.equipRange = classData.equipRange;

		super(data.mapId, data.x, data.y, data.sprite);
		this.owner = data.owner;
		this.id = data.id;
		this.itemClass = data.itemClass;
		this.stack = data.stack;
		this.slot = data.slot;
		this.z = data.z;
		
		this.name = data.name;
		this.type = data.type;
		this.reusable = data.reusable;

		this.passiveDamage = data.passiveDamage;
		this.passiveDefence = data.passiveDefence;
		this.passiveHealthMax = data.passiveHealthMax;
		this.passiveEnergyMax = data.passiveEnergyMax;
		this.passiveRange = data.passiveRange;
		this.equipDamage = data.equipDamage;
		this.equipDefence = data.equipDefence;
		this.equipHealthMax = data.equipHealthMax;
		this.equipEnergyMax = data.equipEnergyMax;
		this.equipRange = data.equipRange;

		if (data.owner === 'map') {
			game.mapList[this.mapId].items[this.id] = this;
		}
		else if (data.owner === 'player') {
			game.playerList[this.id].inventory[this.slot] = this;
		}
		else if (data.owner === 'bot') {
			game.mapList[this.mapId].bots[this.id].inventory[this.slot] = this;
		}
	}
	
	get damage() {
		let damageTotal = this.passiveDamage + this.equipDamage;
		return (damageTotal < 0) ? 0 : damageTotal;
	}
	get defence() {
		let defenceTotal = this.passiveDefence + this.equipDefence;
		return (defenceTotal < 0) ? 0 : defenceTotal;
	}
	get healthMax() {
		let healthMaxTotal = this.passiveHealthMax + this.equipHealthMax;
		return (healthMaxTotal < 0) ? 0 : healthMaxTotal;
	}
	get energyMax() {
		let energyMaxTotal = this.passiveEnergyMax + this.equipEnergyMax;
		return (energyMaxTotal < 0) ? 0 : energyMaxTotal;
	}
	get range() {
		let rangeTotal = this.passiveRange + this.equipRange;
		return (rangeTotal < 0) ? 0 : rangeTotal;
	}

	update(delta) {
		return this.getPack();
	}

	getPack() {
		return {
			id: this.id,
			mapId: this.mapId,
			x: this.x,
			y: this.y,
			z: this.z,
			slot: this.slot,
			itemClass: this.itemClass,
			stack: this.stack,
			name: this.name,
			sprite: this.sprite,
			type: this.type,
			reusable: this.reusable,
			damageBonus: this.damageBonus,
			defenceBonus: this.defenceBonus,
			healthMaxBonus: this.healthMaxBonus,
			energyMaxBonus: this.energyMaxBonus,
			rangeBonus: this.rangeBonus,
			isVisible: this.isVisible
		};
	}
	
	remove() {
		if (this.owner === 'player') {
			delete game.playerList[this.id].inventory[this.slot];
		}
		else if (this.owner === 'map') {
			delete game.mapList[this.mapId].items[this.id];
		}
		else if (this.owner === 'bot') {
			delete game.mapList[this.mapId].bots[this.id].inventory[this.slot];
		}
	}
	
	isEquipment() {
		const itemTypes = ['weapon', 'shield', 'armour', 'helmet', 'ring'];
		return (itemTypes.includes(this.type));
	}

	canEquip(slot) {
		if (slot === config.INVENTORY_SIZE) {
			if (this.type === 'weapon') return true;
		}
		else if (slot === config.INVENTORY_SIZE + 1) {
			if (this.type === 'shield') return true;
		}
		else if (slot === config.INVENTORY_SIZE + 2) {
			if (this.type === 'armour') return true;
		}
		else if (slot === config.INVENTORY_SIZE + 3) {
			if (this.type === 'helmet') return true;
		}
		else if (slot === config.INVENTORY_SIZE + 4) {
			if (this.type === 'ring') return true;
		}

		return false;
	}

	moveToPlayer(id, slot) {
		if (id == null || slot == null) return;

		this.remove();
		this.owner = 'player';
		this.id = id;
		this.slot = slot;
		game.playerList[this.id].inventory[this.slot] = this;
	}

	moveToMap(mapId, x, y) {
		if (mapId == null || x == null || y == null) return;

		this.remove();
		this.owner = 'map';
		this.mapId = mapId;
		this.id = util.firstEmptyIndex(game.mapList[this.mapId].items);
		this.x = x;
		this.y = y;
		game.mapList[this.mapId].items[this.id] = this;
	}

	moveToBot(mapId, id, slot) {
		if (mapId == null || id == null || slot == null) return;

		this.remove();
		this.owner = 'bot';
		this.mapId = mapId;
		this.id = id;
		this.slot = slot;
		game.mapList[this.mapId].bots[this.id].inventory[this.slot] = this;
	}
}

import db from '../db.js';
import game from '../game.js';
import config from '../config.js';
import util from '../util.js';
import Entity from './entity.js';

export default class Item extends Entity {
	constructor(position, template, stack) {
		if (position.playerId === undefined) position.playerId = null;
		if (position.botId === undefined) position.botId = null;
		if (position.slot === undefined) position.slot = null;
		if (position.mapId === undefined) position.mapId = null;
		if (position.x === undefined) position.x = null;
		if (position.y === undefined) position.y = null;

		super(position.mapId, position.x, position.y, template.sprite);
		this.z = -10;
		this.playerId = position.playerId;
		this.botId = position.botId;
		this.slot = position.slot;
		
		this.name = template.name;
		this.description = template.description;
		this.reusable = template.reusable;
		
		this.type = template.type.name;
		this.stackable = template.type.stackable;
		this.equippableSlot = template.type.equippableSlot;
		
		this.passive = {
			damage: template.passive.damage,
			defence: template.passive.defence,
			healthMax: template.passive.healthMax,
			energyMax: template.passive.energyMax,
			range: template.passive.range
		};
		this.equipped = {
			damage: template.equipped.damage,
			defence: template.equipped.defence,
			healthMax: template.equipped.healthMax,
			energyMax: template.equipped.energyMax,
			range: template.equipped.range
		};
		
		if (this.stackable) {
			if (stack < 1) stack = 1;
			this.stack = stack;
		}
		else {
			this.stack = 0;
		}

		this.id = util.firstEmptyIndex(game.items);
		game.items[this.id] = this;
	}
	
	get damage() {
		const damageTotal = this.passiveDamage + this.equipDamage;
		return (damageTotal < 0) ? 0 : damageTotal;
	}
	get defence() {
		const defenceTotal = this.passiveDefence + this.equipDefence;
		return (defenceTotal < 0) ? 0 : defenceTotal;
	}
	get healthMax() {
		const healthMaxTotal = this.passiveHealthMax + this.equipHealthMax;
		return (healthMaxTotal < 0) ? 0 : healthMaxTotal;
	}
	get energyMax() {
		const energyMaxTotal = this.passiveEnergyMax + this.equipEnergyMax;
		return (energyMaxTotal < 0) ? 0 : energyMaxTotal;
	}
	get range() {
		const rangeTotal = this.passiveRange + this.equipRange;
		return (rangeTotal < 0) ? 0 : rangeTotal;
	}

	update(delta) {
		return this.getPack();
	}

	getPack() {
		return {
			id: this.id,
			playerId: this.playerId,
			botId: this.botId,
			slot: this.slot,
			mapId: this.mapId,
			x: this.x,
			y: this.y,
			z: this.z,
			name: this.name,
			description: this.description,
			sprite: this.sprite,
			type: this.type,
			reusable: this.reusable,
			passive: this.passive,
			equipped: this.equipped,
			stack: this.stack,
			isVisible: this.isVisible
		};
	}
	
	remove() {
		if (this.owner === 'player') {
			delete game.players[this.id].inventory[this.slot];
		}
		else if (this.owner === 'map') {
			delete game.maps[this.mapId].items[this.id];
		}
		else if (this.owner === 'bot') {
			delete game.maps[this.mapId].bots[this.id].inventory[this.slot];
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
		game.players[this.id].inventory[this.slot] = this;
	}

	moveToMap(mapId, x, y) {
		if (mapId == null || x == null || y == null) return;

		this.remove();
		this.owner = 'map';
		this.mapId = mapId;
		this.id = util.firstEmptyIndex(game.maps[this.mapId].items);
		this.x = x;
		this.y = y;
		game.maps[this.mapId].items[this.id] = this;
	}

	moveToBot(mapId, id, slot) {
		if (mapId == null || id == null || slot == null) return;

		this.remove();
		this.owner = 'bot';
		this.mapId = mapId;
		this.id = id;
		this.slot = slot;
		game.maps[this.mapId].bots[this.id].inventory[this.slot] = this;
	}
}

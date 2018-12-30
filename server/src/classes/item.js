import game from '../game.js';
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
		
		this.templateId = template._id;
		this.name = template.name;
		this.description = template.description;
		this.reusable = template.reusable;

		this.type = template.type.name;
		this.stackable = template.type.stackable;
		this.equippedSlot = template.type.equippedSlot;
		
		this.passive = {
			damage: template.passiveDamage,
			defence: template.passiveDefence,
			healthMax: template.passiveHealthMax,
			energyMax: template.passiveEnergyMax,
			range: template.passiveRange
		};
		this.equipped = {
			damage: template.equippedDamage,
			defence: template.equippedDefence,
			healthMax: template.equippedHealthMax,
			energyMax: template.equippedEnergyMax,
			range: template.equippedRange
		};
		
		if (this.stackable) {
			if (stack < 1) stack = 1;
			this.stack = stack;
		}
		else {
			this.stack = 0;
		}

		this.gameId = util.firstEmptyIndex(game.items);
		game.items[this.gameId] = this;
	}

	update(delta) {
		return this.getPack();
	}

	getPack() {
		return {
			gameId: this.gameId,
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
		delete game.items[this.gameId];
	}

	removeOne() {
		if (this.stack > 1) {
			this.stack--;
		}
		else {
			this.remove();
		}
	}

	moveToInventory(playerId, botId, slot) {
		this.playerId = playerId;
		this.botId = botId;
		this.slot = slot;
		this.mapId = null;
		this.x = null;
		this.y = null;
		this.z = null;
	}

	moveToMap(mapId, x, y) {
		this.mapId = mapId;
		this.x = x;
		this.y = y;
		this.z = this.getZPosition(mapId, x, y);
		this.playerId = null;
		this.botId = null;
		this.slot = null;
	}
	
	getZPosition(mapId, x, y) {
		return -10;
	}

	isEquipment() {
		if (this.equippedSlot >= 0) {
			return true;
		}
		else {
			return false;
		}
	}
}

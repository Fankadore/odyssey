import Entity from './entity.js';

export default class MapItem extends Entity {
	constructor(scene, data) {
		super(scene, data.gameId, data.x, data.y, data.sprite, 'potions');
		this.passive = {};
		this.equipped = {};
		this.onUpdate(data);
	}
	
	onUpdate(data) {
		if (!data) return;
		if (data.name != null) this.name = data.name;
		if (data.sprite != null && data.sprite !== this.sprite) {
			this.sprite = data.sprite;
			this.setFrame(this.sprite);
		}
		if (data.x != null) this.grid.x = data.x;
		if (data.y != null) this.grid.y = data.y;
		if (data.z != null && this.depth !== data.z) this.setDepth(data.z);
		if (data.isVisible != null) this.isVisible = data.isVisible;
		
		if (data.stackable != null) this.stackable = data.stackable;
		if (data.stack != null) this.stack = data.stack;
		if (data.template != null) this.template = data.template;
		if (data.type != null) this.type = data.type;
		if (data.reusable != null) this.reusable = data.reusable;

		if (data.passive) {
			if (data.passive.damage != null) this.passive.damage = data.passive.damage;
			if (data.passive.defence != null) this.passive.defence = data.passive.defence;
			if (data.passive.healthMax != null) this.passive.healthMax = data.passive.healthMax;
			if (data.passive.energyMax != null) this.passive.energyMax = data.passive.energyMax;
			if (data.passive.range != null) this.passive.range = data.passive.range;
		}
		if (data.equipped) {
			if (data.equipped.damage != null) this.equipped.damage = data.equipped.damage;
			if (data.equipped.defence != null) this.equipped.defence = data.equipped.defence;
			if (data.equipped.healthMax != null) this.equipped.healthMax = data.equipped.healthMax;
			if (data.equipped.energyMax != null) this.equipped.energyMax = data.equipped.energyMax;
			if (data.equipped.range != null) this.equipped.range = data.equipped.range;
		}
	}
}

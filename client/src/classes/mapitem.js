import Entity from './entity.js';

export default class MapItem extends Entity {
	constructor(scene, data) {
		super(scene, data.id, data.name, data.x, data.y, data.sprite, 'potions');
		this.update(data);
	}
	
	update(data) {
		if (!data) return;
		if (data.name != null) this.name = data.name;
		if (data.sprite != null) this.sprite = data.sprite;
		if (data.x != null) this.grid.x = data.x;
		if (data.y != null) this.grid.y = data.y;
		// if (data.z != null && this.depth !== data.z) this.setDepth(data.z);
		if (data.isVisible != null) this.isVisible = data.isVisible;

		if (data.itemClass != null) this.itemClass = data.itemClass;
		if (data.stack != null) this.stack = data.stack;
		if (data.type != null) this.type = data.type;
		if (data.reusable != null) this.reusable = data.reusable;

		if (data.damageBonus != null) this.damageBonus = data.damageBonus;
		if (data.defenceBonus != null) this.defenceBonus = data.defenceBonus;
		if (data.healthMaxBonus != null) this.healthMaxBonus = data.healthMaxBonus;
		if (data.energyMaxBonus != null) this.energyMaxBonus = data.energyMaxBonus;
		if (data.rangeBonus != null) this.rangeBonus = data.rangeBonus;
	}
}
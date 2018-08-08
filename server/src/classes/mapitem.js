import db from '../db.js';
import game from '../game.js';
import util from '../util.js';

export default class MapItem extends Entity {
	constructor(map, x, y, itemRef, stack) {
		let data = db.getItemData(itemRef);

		super(map, x, y, data.sprite);
		this.itemRef = itemRef;
		this.stack = stack;
		this.name = data.name;
		this.damageBonus = data.damageBonus;
		this.defenceBonus = data.defenceBonus;
		this.healthMaxBonus = data.healthMaxBonus;
		this.energyMaxBonus = data.energyMaxBonus;
		this.rangeBonus = data.rangeBonus;

		this.id = util.firstEmptyIndex(game.mapList[this.map].items);
		game.mapList[this.map].items[this.id] = this;
	}

	update() {
		return this.getPack();
	}
	
	getPack() {
		return {
			id: this.id,
			map: this.map,
			x: this.x,
			y: this.y,
			name: this.name,
			sprite: this.sprite,
			stack: this.stack,
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
		delete game.mapList[this.map].items[this.id];
	}
}

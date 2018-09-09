import Phaser from '../lib/phaser.js';

export default class InventoryItem extends Phaser.GameObjects.Sprite {
	constructor(scene, data) {
		super(scene, data.x, data.y, 'potions', data.sprite).setOrigin(0, 0).setInteractive();
		this.update(data);
		this.clicked = false;
		this.clickTime = 0;
		this.dragged = false;
		scene.add.existing(this);
		scene.input.setDraggable(this);
	}

	update(data, delta) {
		if (data.slot != null) this.slot = data.slot;
		if (data.x != null && !this.dragged) this.x = data.x;
		if (data.y != null && !this.dragged) this.y = data.y;
		if (data.itemClass != null) this.itemClass = data.itemClass;
		if (data.stack != null) this.stack = data.stack;
		if (data.name != null) this.name = data.name;
		if (data.sprite != null) this.sprite = data.sprite;
		if (data.type != null) this.type = data.type;
		if (data.reusable != null) this.reusable = data.reusable;
		if (data.damageBonus != null) this.damageBonus = data.damageBonus;
		if (data.defenceBonus != null) this.defenceBonus = data.defenceBonus;
		if (data.healthMaxBonus != null) this.healthMaxBonus = data.healthMaxBonus;
		if (data.energyMaxBonus != null) this.energyMaxBonus = data.energyMaxBonus;
		if (data.rangeBonus != null) this.rangeBonus = data.rangeBonus;

		if (this.clicked) {
			this.clickTime += delta;
			if (this.clickTime > 250) {
				this.clicked = false;
				this.clickTime = 0;
			}
		}
	}
}
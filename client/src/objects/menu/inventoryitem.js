import Phaser from '../../lib/phaser.js';

export default class InventoryItem extends Phaser.GameObjects.Sprite {
	constructor(scene, data) {
		super(scene, data.x, data.y, 'potions', data.sprite).setOrigin(0, 0).setInteractive();
		this.clickedTime = 0;
		this.dragged = false;
		this.passive = {};
		this.equipped = {};
		this.onUpdate(data);
		scene.add.existing(this);
		scene.input.setDraggable(this);
	}

	onUpdate(data) {
		if (!data) return;
		if (data.name != null) this.name = data.name;
		if (data.description != null) this.description = data.description;
		if (data.sprite != null && data.sprite !== this.sprite) {
			this.sprite = data.sprite;
			this.setFrame(this.sprite);
		}
		if (data.slot != null) this.slot = data.slot;
		if (data.x != null && !this.dragged) this.x = data.x;
		if (data.y != null && !this.dragged) this.y = data.y;
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

		if (this.clickedTime > 0) {
			const now = new Date().getTime();
			if (now - this.clickedTime > 250) {
				this.clickedTime = 0;
			}
		}
	}
}

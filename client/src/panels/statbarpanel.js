import { Panel } from '../lib/phaser-ui.js';
import StatBar from '../objects/menu/statbar.js';

export default class StatBarPanel extends Panel {
	constructor(scene, x, y) {
		super(scene, x, y, true);
		this.health = 1;
		this.healthMax = 1;
		this.energy = 1;
		this.energyMax = 1;
		this.mana = 1;
		this.manaMax = 1;
		this.experience = 1;
		this.experienceMax = 1;

		// Statbars
		this.healthBar = new StatBar(scene, x, y + 1, 'health-bar', 'health-bar-empty');
		this.energyBar = new StatBar(scene, x, y + 9 + 3, 'energy-bar', 'energy-bar-empty');
		this.manaBar = new StatBar(scene, x, y + 18 + 5, 'mana-bar', 'mana-bar-empty');
		this.experienceBar = new StatBar(scene, x, y + 27 + 7, 'experience-bar', 'experience-bar-empty');
		
		this.children = [this.healthBar, this.energyBar, this.manaBar, this.experienceBar];
		this.setActive(true);
	}

	onUpdate(data) {
		if (data.health != null || data.healthMax != null) {
			if (data.health != null) this.health = data.health;
			if (data.healthMax != null) this.healthMax = data.healthMax;
			this.healthBar.onUpdate(this.health, this.healthMax);
		}
		if (data.energy != null || data.energyMax != null) {
			if (data.energy != null) this.energy = data.energy;
			if (data.energyMax != null) this.energyMax = data.energyMax;
			this.energyBar.onUpdate(this.energy, this.energyMax);
		}
		if (data.mana != null || data.manaMax != null) {
			if (data.mana != null) this.mana = data.mana;
			if (data.manaMax != null) this.manaMax = data.manaMax;
			this.manaBar.onUpdate(this.mana, this.manaMax);
		}
		if (data.experience != null || data.experienceMax != null) {
			if (data.experience != null) this.experience = data.experience;
			if (data.experienceMax != null) this.experienceMax = data.experienceMax;
			this.experienceBar.onUpdate(this.experience, this.experienceMax);
		}
	}
}

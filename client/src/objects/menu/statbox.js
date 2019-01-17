import config from '../../config.js';

export default class Statbox {
	constructor(scene) {
		this.health = 0;
		this.healthMax = 0;
		this.energy = 0;
		this.energyMax = 0;
		this.statBarMask = null;
		this.healthBar = null;
		this.energyBar = null;
		this.manaBar = null;
		this.experienceBar = null;
		
    scene.add.image(config.STATBOX_LEFT, config.STATBOX_TOP, 'statbox').setOrigin(0, 0);

		this.graphics = scene.make.graphics();
    this.graphics.fillRect(config.STATBAR_LEFT, config.STATBAR_TOP, config.STATBAR_WIDTH, config.STATBAR_HEIGHT);
    this.graphics.fillRect(config.STATBAR_LEFT, config.STATBAR_TOP + (config.STATBAR_HEIGHT + 2), config.STATBAR_WIDTH, config.STATBAR_HEIGHT);
    this.graphics.fillRect(config.STATBAR_LEFT, config.STATBAR_TOP + ((config.STATBAR_HEIGHT + 2) * 2), config.STATBAR_WIDTH, config.STATBAR_HEIGHT);
    this.graphics.fillRect(config.STATBAR_LEFT, config.STATBAR_TOP + ((config.STATBAR_HEIGHT + 2) * 3), config.STATBAR_WIDTH, config.STATBAR_HEIGHT);
    this.statBarMask = this.graphics.createGeometryMask();

		scene.add.image(config.STATBAR_LEFT, config.STATBAR_TOP, 'health-bar-empty').setOrigin(0, 0);
		scene.add.image(config.STATBAR_LEFT, config.STATBAR_TOP + (config.STATBAR_HEIGHT + 2), 'energy-bar-empty').setOrigin(0, 0);
		scene.add.image(config.STATBAR_LEFT, config.STATBAR_TOP + ((config.STATBAR_HEIGHT + 2) * 2), 'mana-bar-empty').setOrigin(0, 0);
		scene.add.image(config.STATBAR_LEFT, config.STATBAR_TOP + ((config.STATBAR_HEIGHT + 2) * 3), 'experience-bar-empty').setOrigin(0, 0);
		
		this.healthBar = scene.add.image(config.STATBAR_LEFT, config.STATBAR_TOP, 'health-bar').setOrigin(0, 0).setMask(this.statBarMask);
		this.energyBar = scene.add.image(config.STATBAR_LEFT, config.STATBAR_TOP + (config.STATBAR_HEIGHT + 2), 'energy-bar').setOrigin(0, 0).setMask(this.statBarMask);
		this.manaBar = scene.add.image(config.STATBAR_LEFT, config.STATBAR_TOP + ((config.STATBAR_HEIGHT + 2) * 2), 'mana-bar').setOrigin(0, 0).setMask(this.statBarMask);
		this.experienceBar = scene.add.image(config.STATBAR_LEFT, config.STATBAR_TOP + ((config.STATBAR_HEIGHT + 2) * 3), 'experience-bar').setOrigin(0, 0).setMask(this.statBarMask);
  }

  onUpdate(data) {
    if (data.health != null) this.health = data.health;
		if (data.healthMax != null) this.healthMax = data.healthMax;
		if (data.energy != null) this.energy = data.energy;
		if (data.energyMax != null) this.energyMax = data.energyMax;

    // Update Stat Bar Mask
		if (this.graphics) {
			this.graphics.clear();
			this.graphics.fillRect(config.STATBAR_LEFT, config.STATBAR_TOP, config.STATBAR_WIDTH * (this.health / this.healthMax), config.STATBAR_HEIGHT);
			this.graphics.fillRect(config.STATBAR_LEFT, config.STATBAR_TOP + (config.STATBAR_HEIGHT + 2), config.STATBAR_WIDTH * (this.energy / this.energyMax), config.STATBAR_HEIGHT);
			this.graphics.fillRect(config.STATBAR_LEFT, config.STATBAR_TOP + ((config.STATBAR_HEIGHT + 2) * 2), config.STATBAR_WIDTH * (1 / 1), config.STATBAR_HEIGHT);
			this.graphics.fillRect(config.STATBAR_LEFT, config.STATBAR_TOP + ((config.STATBAR_HEIGHT + 2) * 3), config.STATBAR_WIDTH * (1 / 1), config.STATBAR_HEIGHT);
		}
  }
}

import game from '../game.js';
import config from '../config.js';
import util from '../util.js';
import Actor from './actor.js';

// A Bot is an Actor with conditional inputs

export default class Bot extends Actor {
	constructor(mapId, x, y, direction, template) {
		super(mapId, x, y, direction, template.name, template.sprite);
		this.controller = 'bot';
		this.damageBase = template.damageBase;
		this.defenceBase = template.defenceBase;
		this.healthMaxBase = template.healthMaxBase;
		this.energyMaxBase = template.energyMaxBase;
		this.rangeBase = template.rangeBase;
		this.restore();
		
		this.hostile = template.hostile;
		this.target = null;
		this.setTask('wandering');
		this.moveTimer = 0;

		this.gameId = util.firstEmptyIndex(game.bots);
		game.bots[this.gameId] = this;
	}
	
	getMapItem(mapId, id) {
		const slot = super.getMapItem(mapId, id);
		if (slot == null) return;
		
		const item = game.items[id];
		item.moveToBot(this.mapId, this.gameId, slot);
	}

	getItem(data) {
		let slot = super.getItem(data);
		if (slot == null) return;

		data.owner = 'bot';
		data.mapId = this.mapId;
		data.gameId = this.gameId;
		data.slot = slot;
		new Item(data);
	}

	update(delta) {
		super.update(delta); 	// Default Actor Update
		if (this.isDead) return;

		this.moveTimer++;
		
		// AI Inputs
		switch(this.task) {
			case 'wandering':		// Move randomly
				this.move();
				this.pickUp();
			break;
			case 'following':		// Move towards target
				if (this.target) {
					this.moveToTarget(this.target, false);
				}
				else {
					// No target
					this.setTask('wandering');
				}
			break;
			case 'attacking':		// Move towards target and attack
				if (this.target) {
					this.moveToTarget(this.target, true);
				}
				else {
					// No target
					this.setTask('wandering');
				}
			break;
			// case 'idle':
			default: 					// Stand still
			break;
		}
		
		return this.getPack();
	}
	
	getPack() {
		return {
			gameId: this.gameId,
			name: this.name,
			sprite: this.sprite,
			direction: this.direction,
			mapId: this.mapId,
			x: this.startX,
			y: this.startY,
			z: this.z,
			destinationX: this.destinationX,
			destinationY: this.destinationY,
			lerp: this.lerp,
			isRunning: this.isRunning,
			isAttacking: this.isAttacking,
			isDead: false,
			isVisible: this.isVisible
		};
	}

	remove() {
		delete game.maps[this.mapId].bots[this.gameId];
	}
	
	move(direction) {
		let moveTime = 24;
		if (this.isRunning) {
			moveTime = 17;
		}
		if (this.moveTimer > moveTime && this.attackTimer === 0) {
			super.move(direction);
			this.moveTimer = 0;
		}
	}
	
	takeDamage(damage, source) {
		if (source instanceof Actor) this.setTask('attacking', source);
		super.takeDamage(damage, source);
	}
	
	pickUp() {
		super.pickUp();
		this.checkBestEquipment();
	}

	setDead() {
		super.setDead();
		delete game.mapData[this.mapId].bots[this.gameId];
	}

	// Inputs
	setTask(task, target) {
		switch (task) {
			case 'wandering':
				this.laziness = 7;
				this.target = null;
				this.task = task;
			break;
			case 'following':
				if (target === null) {
					this.setTask('wandering');
				}
				else {
					this.laziness = 0;
					this.target = target;
					this.task = task;
				}
			break;
			case 'attacking':
				if (target === null) {
					this.setTask('wandering');
				}
				else {
					this.laziness = 0;
					this.target = target;
					this.task = task;
				}
			break;
			default:	//idling
				this.laziness = 7;
				this.target = null;
				this.task = 'idle';
			break;
		}
	}
	
	checkBestEquipment() {
		for (let slot = 0; slot < config.INVENTORY_SIZE; slot++) {
			let item = this.inventory[slot];
			if (!item) {
				continue;
			}
			
			switch (item.type) {
				case 'weapon':
					if (this.inventory[config.INVENTORY_SIZE]) {
						if (item.damage > this.inventory[config.INVENTORY_SIZE].damage) {
							this.equipItem(slot);
							continue;
						}
					}
					else {
						this.equipItem(slot);
					}
				break;
				case 'shield':
					if (this.inventory[config.INVENTORY_SIZE + 1]) {
						if (item.defence > this.inventory[config.INVENTORY_SIZE + 1].defence) {
							this.equipItem(slot);
							continue;
						}
					}
					else {
						this.equipItem(slot);
					}
				break;
				case 'armour':
					if (this.inventory[config.INVENTORY_SIZE + 2]) {
						if (item.defence > this.inventory[config.INVENTORY_SIZE + 2].defence) {
							this.equipItem(slot);
							continue;
						}
					}
					else {
						this.equipItem(slot);
					}
				break;
				case 'helmet':
					if (this.inventory[config.INVENTORY_SIZE + 3]) {
						if (item.defence > this.inventory[config.INVENTORY_SIZE + 3].defence) {
							this.equipItem(slot);
							continue;
						}
					}
					else {
						this.equipItem(slot);
					}
				break;
				case 'ring':
					if (this.inventory[config.INVENTORY_SIZE + 4]) {
						if (item.damage > this.inventory[config.INVENTORY_SIZE + 4].damage) {
							this.equipItem(slot);
							continue;
						}
					}
					else {
						this.equipItem(slot);
					}
				break;
			}
		}
	}
}

import db from '../db.js';
import game from '../game.js';
import config from '../config.js';
import util from '../util.js';
import Actor from './Actor.js';

// A Bot is an Actor with conditional inputs

export default class Bot extends Actor {
	constructor(botRef, map, x, y) {
		let data = db.getBotData(botRef);

		super(map, x, y, data.name, data.sprite);
		this.botRef = botRef;
		this.hostile = data.hostile;		// Whether bot attacks on sight

		this.target = null;
		this.setTask('wandering');
		this.moveTimer = 0;
		
		this.id = util.firstEmptyIndex(game.mapList[this.map].bots);
		game.mapList[this.map].bots[this.id] = this;
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
			id: this.id,
			map: this.map,
			x: this.x,
			y: this.y,
			name: this.name,
			sprite: this.sprite,
			direction: this.direction,
			isMoving: this.isMoving,
			isRunning: this.isRunning,
			isAttacking: this.isAttacking,
			isDead: this.isDead
		};
	}

	remove() {
		delete game.mapList[this.map].bots[this.id];
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
		if (source instanceof Actor) {
			this.setTask('attacking', source);
		}
		super.takeDamage(damage, source);
	}
	
	respawn() {
		super.respawn();
		this.setTask('wandering');
	}
	
	pickUp() {
		super.pickUp();
		this.checkBestEquipment();
	}
	
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
						if (item.damageBonus > this.inventory[config.INVENTORY_SIZE].damageBonus) {
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
						if (item.defenceBonus > this.inventory[config.INVENTORY_SIZE + 1].defenceBonus) {
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
						if (item.defenceBonus > this.inventory[config.INVENTORY_SIZE + 2].defenceBonus) {
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
						if (item.defenceBonus > this.inventory[config.INVENTORY_SIZE + 3].defenceBonus) {
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
						if (item.damageBonus > this.inventory[config.INVENTORY_SIZE + 4].damageBonus) {
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

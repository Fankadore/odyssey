import db from '../db.js';
import game from '../game.js';
import config from '../config.js';
import util from '../util.js';
import Actor from './actor.js';

// A Bot is an Actor with conditional inputs

export default class Bot extends Actor {
	constructor(data) {
		if (data.mapId == null || data.x == null || data.y == null || data.botClass == null) {
			db.log("Bot requires parameters: mapId, x, y, botClass");
			return;
		}

		let classData = db.getBotData(data.botClass);
		if (!data.name) data.name = classData.name;
		if (data.sprite == null) data.sprite = classData.sprite;
		if (data.hostile == null) data.hostile = classData.hostile;
		
		super(data.mapId, data.x, data.y, data.name, data.sprite);
		if (data.id == null) data.id = util.firstEmptyIndex(game.mapList[this.mapId].bots);
		this.id = data.id;
		this.botClass = data.botClass;
		this.hostile = data.hostile;
		this.calcBaseStats();
		this.restore();

		this.target = null;
		this.setTask('wandering');
		this.moveTimer = 0;

		game.mapList[this.mapId].bots[this.id] = this;
	}
	
	getMapItem(mapId, id) {
		let slot = super.getMapItem(mapId, id);
		if (slot == null) return;
		
		let item = game.mapList[mapId].items[id];
		item.moveToBot(this.mapId, this.id, slot);
	}

	getItem(data) {
		let slot = super.getItem(data);
		if (slot == null) return;

		data.owner = 'bot';
		data.mapId = this.mapId;
		data.id = this.id;
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
			id: this.id,
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
		delete game.mapList[this.mapId].bots[this.id];
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
		for (let i = 0; i < game.mapList[this.mapId].items.length; i++) {
			let item = game.mapList[this.mapId].items[i];
			if (item && item.x === this.x && item.y === this.y) {
				let slot = this.getMapItem(item.mapId, item.id);
				if (slot != null) {
					item.moveToBot(this.mapId, this.id, slot);
				}
				else {
					// Inventory full
					break;
				}
			}
		}
		this.checkBestEquipment();
	}

	setDead() {
		super.setDead();
		delete game.mapData[this.mapId].bots[this.id];
	}

	calcBaseStats() {
		if (this.botClass == null) return;
		
		let classData = db.getBotData(this.botClass);
		this.damageBase = classData.damageBase;
		this.defenceBase = classData.defenceBase;
		this.healthMaxBase = classData.healthMaxBase;
		this.energyMaxBase = classData.energyMaxBase;
		this.rangeBase = classData.rangeBase;
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

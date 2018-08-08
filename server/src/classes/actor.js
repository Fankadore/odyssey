import db from '../db.js';
import game from '../game.js';
import config from '../config.js';
import util from '../util.js';
import Entity from './entity.js';
import Text from './text.js';

// An Actor is an Entity which can move, attack and interact with items

export default class Actor extends Entity {
	constructor(map, x, y, name, sprite) {
		sprite = util.clamp(sprite, 1, config.MAX_SPRITES);

		super(map, x, y, sprite);
		this.controller = 'bot';
		this.name = name;

		this.inventory = [];

		this.calcStats();
		this.restore();

		this.direction = 'down';
		this.startX = this.x;
		this.startY = this.y;
		this.destinationX = this.x;
		this.destinationY = this.y;
		this.lerp = 0;

		this.isMoving = false;
		this.isRunning = false;
		this.moveSpeed = 2.5;
		this.movementTimer = 0;
		this.laziness = 0;

		this.isAttacking = false;
		this.attackSpeed = 1;
		this.attackTimer = 0;	
		this.target = null;
		this.kills = 0;
		this.deaths = 0;

		this.isDead = false;
		this.respawnTimer = 0;
		this.respawnSpeed = 10;
		this.respawnMap = map;
		this.respawnX = x;
		this.respawnY = y;
	}
	
	// Character Stats
	get damage() {
		if (this.damageBase + this.damageBonus < 0) {
			return 0;
		}
		else {
			return this.damageBase + this.damageBonus;
		}
	}
	get defence() {
		if (this.defenceBase + this.defenceBonus < 0) {
			return 0;
		}
		else {
			return this.defenceBase + this.defenceBonus;
		}
	}
	get healthMax() {
		if (this.healthMaxBase + this.healthMaxBonus < 1) {
			return 1;
		}
		else {
			return this.healthMaxBase + this.healthMaxBonus;
		}
	}
	get energyMax() {
		if (this.energyMaxBase + this.energyMaxBonus < 0) {
			return 0;
		}
		else {
			return this.energyMaxBase + this.energyMaxBonus;
		}
	}
	get range() {
		if (this.rangeBase + this.rangeBonus < 1) {
			return 1;
		}
		else {
			return this.rangeBase + this.rangeBonus;
		}
	}

	calcBaseStats() {	// Class and Level
		//TODO: check db for class stats: base and increase per level
		// this.damageBase = class.base.damage + (class.increasePerLevel.damage * this.level);
		this.damageBase = 5;
		this.defenceBase = 0;
		this.healthMaxBase = 10;
		this.energyMaxBase = 40;
		this.rangeBase = 1;
	}

	calcBonusStats() {	// Items (equipped and passive) and Effects (spells and potions)
		let itemBonus = this.calcItemBonus();
		let effectBonus = this.calcEffectBonus();

		this.damageBonus = itemBonus.damage + effectBonus.damage;
		this.defenceBonus = itemBonus.defence + effectBonus.defence;
		this.healthMaxBonus = itemBonus.healthMax + effectBonus.healthMax;
		this.energyMaxBonus = itemBonus.energyMax + effectBonus.energyMax;
		this.rangeBonus = itemBonus.range + effectBonus.range;
	}

	calcStats() {
		this.calcBaseStats();
		this.calcBonusStats();
	}

	calcItemBonus() {
		let itemBonus = {
			damage: 0,
			defence: 0,
			healthMax: 0,
			energyMax: 0,
			range: 0
		};

		// For each item in inventory check for bonuses
		for (let i = 0; i < (config.INVENTORY_SIZE + config.EQUIPMENT_SIZE); i++) {
			let item = this.inventory[i];
			if (item && !item.remove) {
				itemBonus.damage += item.passiveDamage;
				itemBonus.defence += item.passiveDefence;
				itemBonus.healthMax += item.passiveHealthMax;
				itemBonus.energyMax += item.passiveEnergyMax;
				itemBonus.range += item.passiveRange;

				if (i >= config.INVENTORY_SIZE) {
					itemBonus.damage += item.equipDamage;
					itemBonus.defence += item.equipDefence;
					itemBonus.healthMax += item.equipHealthMax;
					itemBonus.energyMax += item.equipEnergyMax;
					itemBonus.range += item.equipRange;
				}
			}
		}
		
		return itemBonus;
	}

	calcEffectBonus() {
		let effectBonus = {
			damage: 0,
			defence: 0,
			healthMax: 0,
			energyMax: 0,
			range: 0
		};

		// TODO: work out how to do effects for spells and potions
		return effectBonus;
	}

	restore() {
		this.health = this.healthMax;
		this.energy = this.energyMax;
	}
	
	// Movement
	move(direction) {
		if (this.isMoving) return;

		if (direction) {
			this.direction = direction;
		}

		if (direction === 'left') {
			if (!game.checkVacant(this.map, this.x - 1, this.y)) return;
			this.destinationX--;
		}
		else if (direction === 'right') {
			if (!game.checkVacant(this.map, this.x + 1, this.y)) return;
			this.destinationX++;
		}
		else if (direction === 'up') {
			if (!game.checkVacant(this.map, this.x, this.y - 1)) return;
			this.destinationY--;
		}
		else if (direction === 'down') {
			if (!game.checkVacant(this.map, this.x, this.y + 1)) return;
			this.destinationY++;
		}
		else {
			switch (Math.floor(Math.random() * (this.laziness + 3))) {
				case 0: this.move('left');
				break;
				case 1: this.move('right');
				break;
				case 2: this.move('up');
				break;
				case 3: this.move('down');
				break;
				default: // Don't Move
			}
			return;
		}

		// Set move speed
		if (this.isRunning) {
			if (this.energy > 0) {
				this.energy--;
				this.moveSpeed = 4;
			}
			else {
				this.energy = 0;
				this.moveSpeed = 2.5;
				this.isRunning = false;
			}
		}
		else {
			this.moveSpeed = 2.5;
		}
		
		this.isMoving = true;
	}
	
	moveToTarget(target, hostile) {
		if (!target) return;
		
		if (target.x === this.x && target.y === this.y) {
			this.move();
		}
		else if (Math.floor(Math.random() * 2 === 0)) {
			if (target.x < this.x) {
				if (target.x >= (this.x - this.range) && target.y === this.y) {
					if (hostile) {
						this.direction = 'left';
						if (!this.isMoving) {
							this.attack('left');
						}
					}
				}
				else {
					this.move('left');
				}
			}
			else if (target.x > this.x) {
				if (target.x === this.x + this.range && target.y === this.y) {
					if (hostile) {
						this.direction = 'right';
						if (!this.isMoving) {
							this.attack('right');
						}
					}
				}
				else {
					this.move('right');
				}
			}
			else if (target.y < this.y) {
				if (target.x === this.x && target.y === this.y - this.range) {
					if (hostile) {
						this.direction = 'up';
						if (!this.isMoving) {
							this.attack('up');
						}
					}
				}
				else {
					this.move('up');
				}
			}
			else if (target.y > this.y) {
				if (target.x === this.x && target.y === this.y + this.range) {
					if (hostile) {
						this.direction = 'down';
						if (!this.isMoving) {
							this.attack('down');
						}
					}
				}
				else {
					this.move('down');
				}
			}
		}
		else {
			if (target.y > this.y) {
				if (target.x === this.x && target.y === this.y + this.range) {
					if (hostile) {
						if (!this.isMoving) {
							this.attack('down');
						}
					}
				}
				else {
					this.move('down');
				}
			}
			else if (target.y < this.y) {
				if (target.x === this.x && target.y === this.y - this.range) {
					if (hostile) {
						if (!this.isMoving) {
							this.attack('up');
						}
					}
				}
				else {
					this.move('up');
				}
			}
			else if (target.x > this.x) {
				if (target.x === this.x + this.range && target.y === this.y) {
					if (hostile) {
						if (!this.isMoving) {
							this.attack('right');
						}
					}
				}
				else {
					this.move('right');
				}
			}
			else if (target.x < this.x) {
				if (target.x >= (this.x - this.range) && target.y === this.y) {
					if (hostile) {
						if (!this.isMoving) {
							this.attack('left');
						}
					}
				}
				else {
					this.move('left');
				}
			}
		}
	}
	
	// Combat
	checkInRange(direction, target, range) {
		if (target.map !== this.map) return false;
		if (target.x === this.x && target.y === this.y) return false;	// Stacked does not count as in range
		
		if (target.y === this.y) {
			if (direction === 'left') {
				if (this.x === 0) {
					return false;
				}
				else {
					return (target.x < this.x && target.x >= (this.x - range));
				}
			}
			else if (direction === 'right') {
				if (this.x === config.MAP_COLUMNS - 1) {
					return false;
				}
				else {
					return (target.x > this.x && target.x <= (this.x + range));
				}
			}
		}
		else if (target.x === this.x) {
			if (direction === 'up') {
				if (this.y === 0) {
					return false;
				}
				else {
					return (target.y < this.y && target.y >= (this.y - range));
				}
			}
			else if (direction === 'down') {
				if (this.y === config.MAP_ROWS - 1) {
					return false;
				}
				else {
					return (target.y > this.y && target.y <= (this.y + range));
				}
			}
		}
		
		return false;
	}

	attack(numTargets = 1, direction = this.direction) {
		if (this.isAttacking || this.attackTimer > 0) return;

		this.isAttacking = true;

		let actorList = game.playerList.concat(game.mapList[this.map].bots);
		let targetList = actorList.filter((actor) => {
			if (actor === this || actor.isDead) return false;
			if (this.checkInRange(direction, actor, this.range)) return true;
		});
		
		targetList.sort((a, b) => {
			return (a.z - b.z);	// Lowest to highest
		});
		
		targetList = targetList.splice(-numTargets);
		
		targetList.forEach((target) => {
			target.takeDamage(this.damage, this);
		});
	}
	
	takeDamage(damage, source) {
		damage -= this.defence;
		if (damage < 0) {
			damage = 0;
		}
		else {
			this.health -= damage;
			if (this.health <= 0) {
				this.setDead(source);
			}
			console.log(`${source.name} hits ${this.name} for ${damage} damage.`);
		}

		new Text(this.map, this.x, this.y, damage, '#FF0000', 0, -1);
	}
	
	respawn() {
		game.sendServerMessage(this.name + " is back from the dead.");

		this.map = this.respawnMap;
		this.x = this.respawnX;
		this.y = this.respawnY;
		this.startX = this.respawnX;
		this.startY = this.respawnY;
		this.destinationX = this.respawnX;
		this.destinationY = this.respawnY;
		
		this.calcBonusStats();
		this.restore();
		
		this.isWalking = false;
		this.isRunning = false;
		this.isAttacking = false;
		this.isDead = false;
		this.respawnTimer = 0;
	}
	
	setDead(source) {
		let map = game.mapList[this.map];

		// Inventory Item Drop Chance
		let dropChance = util.clamp(map.dropChance, 0, 100);
		if (dropChance > 0) {
			let items = this.inventory.filter((item) => {
				if (item.slot < config.INVENTORY_SIZE) return true;
				return false;
			});

			items.forEach((item) => {
				if (Math.floor(Math.random() * 101) <= dropChance) {
					this.dropItem(item.slot);
				}
			});
		}

		// Equipped Item Drop Amount
		let dropAmountEQ = util.clamp(map.dropAmountEQ, 0, config.EQUIPMENT_SIZE);
		if (dropAmountEQ > 0) {
			let equipment = this.inventory.filter((item) => {
				if (item.slot >= config.INVENTORY_SIZE) return true;
				return false;
			});

			equipment = util.shuffle(equipment);
			equipment.splice(-dropAmountEQ);
			equipment.forEach((item) => {
				this.dropItem(equipment.slot);
			});
		}
		
		this.isDead = true;
		this.health = 0;
		this.energy = 0;
		this.deaths++;
		
		if (source) {
			if (source.controller = 'player') {
				game.sendServerMessage(source.name + " has murdered " + this.name + " in cold blood!");
				source.kills++;
				if (source.target === this) {
					source.target = null;
				}
			}
			else {
				game.sendServerMessage(this.name + " has been killed by " + source.name + "!");
			}
		}
		else {
			game.sendServerMessage(this.name + " has died!");
		}
	}
	
	// Inventory
	pickUp() {
		game.mapList[this.map].items.forEach((item) => {
			if (item.x === this.x && item.y === this.y) {
				if (this.getItem(item.itemClass, item.stack)) {
					item.remove();
				}
			}
		});
	}
	
	getItem(itemClass, stack) {
		if (stack > 0) {			// Stackable Items
			let emptySlot = -1;
			for (let slot = 0; slot < config.INVENTORY_SIZE; slot++) {
				if (this.inventory[slot]) {
					if (this.inventory[slot].class === itemClass) {
						this.inventory[slot].stack += stack;
						return true;
					}
				}
				else if (emptySlot < 0) {
					emptySlot = slot;
				}
				
				if (slot === config.INVENTORY_SIZE - 1) {
					if (emptySlot >= 0 && emptySlot < config.INVENTORY_SIZE) {
						new InventoryItem(this.id, emptySlot, itemClass, stack);
						return true;
					}
					else {	// Inventory full
						return false;
					}
				}
			}
		}
		else {			// Non-Stackable Item
			for (let slot = 0; slot < config.INVENTORY_SIZE; slot++) {
				if (!this.inventory[slot]) {
					new InventoryItem(this.id, slot, itemClass, stack);
					return true;
				}
				else {
					if (slot === config.INVENTORY_SIZE - 1) {	// Inventory full
						return false;
					}
				}
			}
		}
	}
	
	dropItem(slot) {
		let item = this.inventory[slot];
		if (!item) return;
		
		if (slot < config.INVENTORY_SIZE) {
			// Destroy Inventory Item
			item.remove();
			
			// Create Map Item
			game.spawnItem(this.map, this.x, this.y, item.class, item.stack);
		}
		else {
			this.unequipItem(slot);
			this.calcBonusStats();
		}
	}
	
	useItem(slot) {
		let item = this.inventory[slot];
		if (!item) return;
		// if (!db.items[item.id].use.call(this, slot)) return;	// Run 'use' script
		
		if (item.checkIsEquipment()) {	// Equipment Items
			if (slot < config.INVENTORY_SIZE) {	// Check if item is equipped
				this.equipItem(slot);
			}
			else {
				this.unequipItem(slot);
			}
		}
		else {	// Non-Equipment Items
			if (!item.reusable) {
				if (item.stack > 1) {
					item.stack--;
				}
				else {
					item.remove();
				}
			}
		}
	}
	
	hasItem(itemClass) {
		let count = 0;
		for (let i = 0; i < config.INVENTORY_SIZE; i++) {
			if (this.inventory[i]) {
				if (this.inventory[i].class === itemClass) {
					count++;
				}
			}
		}
		return count;
	}
	
	moveItemToSlot(slot, newSlot) {
		if (!slot || !newSlot) return;
		if (slot === newSlot) return;

		let item = this.inventory[slot];
		let newItem = this.inventory[newSlot];

		if (item) {
			if (newItem) {
				if (slot >= config.INVENTORY_SIZE) {
					if (newSlot >= config.INVENTORY_SIZE) {
						if (newItem.type === item.type) {
							item.slot = newSlot;
							newItem.slot = slot;
							util.swap(this.inventory, slot, newSlot);
						}
						else {
							game.sendPlayerMessage(this.id, "That cannot be equipped there.");
						}
					}
					else {
						if (newItem.type === item.type) {
							item.equipped = false;
							newItem.equipped = true;
							item.slot = newSlot;
							newItem.slot = slot;
							util.swap(this.inventory, slot, newSlot);
							this.calcBonusStats();
						}
						else {
							newSlot = this.findFirstEmptySlot();
							if (newSlot) {
								item.equipped = false;
								item.slot = newSlot;
								util.swap(this.inventory, slot, newSlot);
								this.calcBonusStats();
							}
							else {
								game.sendPlayerMessage(this.id, "Your inventory is full.");
							}
						}
					}
				}
				else {
					if (newSlot >= config.INVENTORY_SIZE) {
						if (newItem.type === item.type) {
							item.equipped = true;
							newItem.equipped = false;
							item.slot = newSlot;
							newItem.slot = slot;
							util.swap(this.inventory, slot, newSlot);
							this.calcBonusStats();
						}
						else {
							game.sendPlayerMessage(this.id, "That cannot be equipped there.");
						}
					}
					else {
						item.slot = newSlot;
						newItem.slot = slot;
						util.swap(this.inventory, slot, newSlot);
					}
				}
			}
			else {
				if (slot >= config.INVENTORY_SIZE) {
					if (newSlot >= config.INVENTORY_SIZE) {
						if (newSlot === item.findEquipmentSlot()) {
							item.slot = newSlot;
							this.inventory[newSlot] = item;
							delete this.inventory[slot];
						}
						else {
							game.sendPlayerMessage(this.id, "That cannot be equipped there.");
						}
					}
					else {
						item.equipped = false;
						item.slot = newSlot;
						this.inventory[newSlot] = item;
						delete this.inventory[slot];
						this.calcBonusStats();
					}
				}
				else {
					if (newSlot >= config.INVENTORY_SIZE) {
						if (newSlot === item.findEquipmentSlot()) {
							item.equipped = true;
							item.slot = newSlot;
							this.inventory[newSlot] = item;
							delete this.inventory[slot];
							this.calcBonusStats();
						}
						else {
							game.sendPlayerMessage(this.id, "That cannot be equipped there.");
						}
					}
					else {
						item.slot = newSlot;
						this.inventory[newSlot] = item;
						delete this.inventory[slot];
					}
				}
			}
		}
	}

	equipItem(slot) {
		let newSlot = item.findEquipmentSlot();
		this.moveItemToSlot(slot, newSlot);
		this.calcBonusStats();
	}

	unequipItem(slot) {
		let item = this.inventory[slot];
		if (!item) return;
		
		if (item.slot >= config.INVENTORY_SIZE) {
			let newSlot = this.findFirstEmptySlot();
			if (newSlot === null) {
				game.sendPlayerMessage(this.id, "Your inventory is full.");
			}
			else {
				this.moveItemToSlot(slot, newSlot);
			}
		}
	}
	
	findFirstEmptySlot() {
		for (let slot = 0; slot < config.INVENTORY_SIZE; slot++) {
			if (!this.inventory[slot]) return slot;
		}
		return null;
	}


	update(delta) {
		// Inventory Item Update
		this.inventory.forEach((item) => {
			item.update();
		});

		// Respawning
		if (this.isDead) {
			this.respawnTimer += delta;
			if (this.respawnTimer >= this.respawnSpeed) {
				this.respawn();
			}
			return;
		}
		
		// Attacking
		if (this.isAttacking || this.attackTimer > 0) {
			this.attackTimer += delta;
			if (this.attackTimer >= 0.3) {
				this.isAttacking = false;
			}
			if (this.attackTimer >= this.attackSpeed) {
				this.attackTimer = 0;
			}
		}
		
		// Movement
		if (this.isMoving) {
			this.lerp += delta * this.moveSpeed;
			
			if (this.lerp >= 0.49) {
				this.x = this.destinationX;
				this.y = this.destinationY;
			}
			
			if (this.lerp >= 0.99) {
				this.startX = this.destinationX;
				this.startY = this.destinationY;
				this.lerp = 0;
				this.isMoving = false;
			}
		}
	}
}

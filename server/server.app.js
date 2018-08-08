/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./server/src/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./server/src/classes/Actor.js":
/*!*************************************!*\
  !*** ./server/src/classes/Actor.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Actor; });
/* harmony import */ var _db_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../db.js */ "./server/src/db.js");
/* harmony import */ var _game_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../game.js */ "./server/src/game.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config.js */ "./server/src/config.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util.js */ "./server/src/util.js");
/* harmony import */ var _entity_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./entity.js */ "./server/src/classes/entity.js");
/* harmony import */ var _text_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./text.js */ "./server/src/classes/text.js");







// An Actor is an Entity which can move, attack and interact with items

class Actor extends _entity_js__WEBPACK_IMPORTED_MODULE_4__["default"] {
	constructor(map, x, y, name, sprite) {
		sprite = _util_js__WEBPACK_IMPORTED_MODULE_3__["default"].clamp(sprite, 1, _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].MAX_SPRITES);

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
		for (let i = 0; i < (_config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE + _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].EQUIPMENT_SIZE); i++) {
			let item = this.inventory[i];
			if (item && !item.remove) {
				itemBonus.damage += item.passiveDamage;
				itemBonus.defence += item.passiveDefence;
				itemBonus.healthMax += item.passiveHealthMax;
				itemBonus.energyMax += item.passiveEnergyMax;
				itemBonus.range += item.passiveRange;

				if (i >= _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE) {
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
			if (!_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].checkVacant(this.map, this.x - 1, this.y)) return;
			this.destinationX--;
		}
		else if (direction === 'right') {
			if (!_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].checkVacant(this.map, this.x + 1, this.y)) return;
			this.destinationX++;
		}
		else if (direction === 'up') {
			if (!_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].checkVacant(this.map, this.x, this.y - 1)) return;
			this.destinationY--;
		}
		else if (direction === 'down') {
			if (!_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].checkVacant(this.map, this.x, this.y + 1)) return;
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
				if (this.x === _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].MAP_COLUMNS - 1) {
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
				if (this.y === _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].MAP_ROWS - 1) {
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

		let actorList = _game_js__WEBPACK_IMPORTED_MODULE_1__["default"].playerList.concat(_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[this.map].bots);
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

		new _text_js__WEBPACK_IMPORTED_MODULE_5__["default"](this.map, this.x, this.y, damage, '#FF0000', 0, -1);
	}
	
	respawn() {
		_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendServerMessage(this.name + " is back from the dead.");

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
		let map = _game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[this.map];

		// Inventory Item Drop Chance
		let dropChance = _util_js__WEBPACK_IMPORTED_MODULE_3__["default"].clamp(map.dropChance, 0, 100);
		if (dropChance > 0) {
			let items = this.inventory.filter((item) => {
				if (item.slot < _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE) return true;
				return false;
			});

			items.forEach((item) => {
				if (Math.floor(Math.random() * 101) <= dropChance) {
					this.dropItem(item.slot);
				}
			});
		}

		// Equipped Item Drop Amount
		let dropAmountEQ = _util_js__WEBPACK_IMPORTED_MODULE_3__["default"].clamp(map.dropAmountEQ, 0, _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].EQUIPMENT_SIZE);
		if (dropAmountEQ > 0) {
			let equipment = this.inventory.filter((item) => {
				if (item.slot >= _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE) return true;
				return false;
			});

			equipment = _util_js__WEBPACK_IMPORTED_MODULE_3__["default"].shuffle(equipment);
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
				_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendServerMessage(source.name + " has murdered " + this.name + " in cold blood!");
				source.kills++;
				if (source.target === this) {
					source.target = null;
				}
			}
			else {
				_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendServerMessage(this.name + " has been killed by " + source.name + "!");
			}
		}
		else {
			_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendServerMessage(this.name + " has died!");
		}
	}
	
	// Inventory
	pickUp() {
		_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[this.map].items.forEach((item) => {
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
			for (let slot = 0; slot < _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE; slot++) {
				if (this.inventory[slot]) {
					if (this.inventory[slot].class === itemClass) {
						this.inventory[slot].stack += stack;
						return true;
					}
				}
				else if (emptySlot < 0) {
					emptySlot = slot;
				}
				
				if (slot === _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE - 1) {
					if (emptySlot >= 0 && emptySlot < _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE) {
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
			for (let slot = 0; slot < _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE; slot++) {
				if (!this.inventory[slot]) {
					new InventoryItem(this.id, slot, itemClass, stack);
					return true;
				}
				else {
					if (slot === _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE - 1) {	// Inventory full
						return false;
					}
				}
			}
		}
	}
	
	dropItem(slot) {
		let item = this.inventory[slot];
		if (!item) return;
		
		if (slot < _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE) {
			// Destroy Inventory Item
			item.remove();
			
			// Create Map Item
			_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].spawnItem(this.map, this.x, this.y, item.class, item.stack);
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
			if (slot < _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE) {	// Check if item is equipped
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
		for (let i = 0; i < _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE; i++) {
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
				if (slot >= _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE) {
					if (newSlot >= _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE) {
						if (newItem.type === item.type) {
							item.slot = newSlot;
							newItem.slot = slot;
							_util_js__WEBPACK_IMPORTED_MODULE_3__["default"].swap(this.inventory, slot, newSlot);
						}
						else {
							_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendPlayerMessage(this.id, "That cannot be equipped there.");
						}
					}
					else {
						if (newItem.type === item.type) {
							item.equipped = false;
							newItem.equipped = true;
							item.slot = newSlot;
							newItem.slot = slot;
							_util_js__WEBPACK_IMPORTED_MODULE_3__["default"].swap(this.inventory, slot, newSlot);
							this.calcBonusStats();
						}
						else {
							newSlot = this.findFirstEmptySlot();
							if (newSlot) {
								item.equipped = false;
								item.slot = newSlot;
								_util_js__WEBPACK_IMPORTED_MODULE_3__["default"].swap(this.inventory, slot, newSlot);
								this.calcBonusStats();
							}
							else {
								_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendPlayerMessage(this.id, "Your inventory is full.");
							}
						}
					}
				}
				else {
					if (newSlot >= _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE) {
						if (newItem.type === item.type) {
							item.equipped = true;
							newItem.equipped = false;
							item.slot = newSlot;
							newItem.slot = slot;
							_util_js__WEBPACK_IMPORTED_MODULE_3__["default"].swap(this.inventory, slot, newSlot);
							this.calcBonusStats();
						}
						else {
							_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendPlayerMessage(this.id, "That cannot be equipped there.");
						}
					}
					else {
						item.slot = newSlot;
						newItem.slot = slot;
						_util_js__WEBPACK_IMPORTED_MODULE_3__["default"].swap(this.inventory, slot, newSlot);
					}
				}
			}
			else {
				if (slot >= _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE) {
					if (newSlot >= _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE) {
						if (newSlot === item.findEquipmentSlot()) {
							item.slot = newSlot;
							this.inventory[newSlot] = item;
							delete this.inventory[slot];
						}
						else {
							_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendPlayerMessage(this.id, "That cannot be equipped there.");
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
					if (newSlot >= _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE) {
						if (newSlot === item.findEquipmentSlot()) {
							item.equipped = true;
							item.slot = newSlot;
							this.inventory[newSlot] = item;
							delete this.inventory[slot];
							this.calcBonusStats();
						}
						else {
							_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendPlayerMessage(this.id, "That cannot be equipped there.");
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
		
		if (item.slot >= _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE) {
			let newSlot = this.findFirstEmptySlot();
			if (newSlot === null) {
				_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendPlayerMessage(this.id, "Your inventory is full.");
			}
			else {
				this.moveItemToSlot(slot, newSlot);
			}
		}
	}
	
	findFirstEmptySlot() {
		for (let slot = 0; slot < _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE; slot++) {
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


/***/ }),

/***/ "./server/src/classes/actor.js":
/*!*************************************!*\
  !*** ./server/src/classes/actor.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Actor; });
/* harmony import */ var _db_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../db.js */ "./server/src/db.js");
/* harmony import */ var _game_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../game.js */ "./server/src/game.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config.js */ "./server/src/config.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util.js */ "./server/src/util.js");
/* harmony import */ var _entity_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./entity.js */ "./server/src/classes/entity.js");
/* harmony import */ var _text_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./text.js */ "./server/src/classes/text.js");







// An Actor is an Entity which can move, attack and interact with items

class Actor extends _entity_js__WEBPACK_IMPORTED_MODULE_4__["default"] {
	constructor(map, x, y, name, sprite) {
		sprite = _util_js__WEBPACK_IMPORTED_MODULE_3__["default"].clamp(sprite, 1, _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].MAX_SPRITES);

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
		for (let i = 0; i < (_config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE + _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].EQUIPMENT_SIZE); i++) {
			let item = this.inventory[i];
			if (item && !item.remove) {
				itemBonus.damage += item.passiveDamage;
				itemBonus.defence += item.passiveDefence;
				itemBonus.healthMax += item.passiveHealthMax;
				itemBonus.energyMax += item.passiveEnergyMax;
				itemBonus.range += item.passiveRange;

				if (i >= _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE) {
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
			if (!_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].checkVacant(this.map, this.x - 1, this.y)) return;
			this.destinationX--;
		}
		else if (direction === 'right') {
			if (!_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].checkVacant(this.map, this.x + 1, this.y)) return;
			this.destinationX++;
		}
		else if (direction === 'up') {
			if (!_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].checkVacant(this.map, this.x, this.y - 1)) return;
			this.destinationY--;
		}
		else if (direction === 'down') {
			if (!_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].checkVacant(this.map, this.x, this.y + 1)) return;
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
				if (this.x === _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].MAP_COLUMNS - 1) {
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
				if (this.y === _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].MAP_ROWS - 1) {
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

		let actorList = _game_js__WEBPACK_IMPORTED_MODULE_1__["default"].playerList.concat(_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[this.map].bots);
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

		new _text_js__WEBPACK_IMPORTED_MODULE_5__["default"](this.map, this.x, this.y, damage, '#FF0000', 0, -1);
	}
	
	respawn() {
		_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendServerMessage(this.name + " is back from the dead.");

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
		let map = _game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[this.map];

		// Inventory Item Drop Chance
		let dropChance = _util_js__WEBPACK_IMPORTED_MODULE_3__["default"].clamp(map.dropChance, 0, 100);
		if (dropChance > 0) {
			let items = this.inventory.filter((item) => {
				if (item.slot < _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE) return true;
				return false;
			});

			items.forEach((item) => {
				if (Math.floor(Math.random() * 101) <= dropChance) {
					this.dropItem(item.slot);
				}
			});
		}

		// Equipped Item Drop Amount
		let dropAmountEQ = _util_js__WEBPACK_IMPORTED_MODULE_3__["default"].clamp(map.dropAmountEQ, 0, _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].EQUIPMENT_SIZE);
		if (dropAmountEQ > 0) {
			let equipment = this.inventory.filter((item) => {
				if (item.slot >= _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE) return true;
				return false;
			});

			equipment = _util_js__WEBPACK_IMPORTED_MODULE_3__["default"].shuffle(equipment);
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
				_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendServerMessage(source.name + " has murdered " + this.name + " in cold blood!");
				source.kills++;
				if (source.target === this) {
					source.target = null;
				}
			}
			else {
				_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendServerMessage(this.name + " has been killed by " + source.name + "!");
			}
		}
		else {
			_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendServerMessage(this.name + " has died!");
		}
	}
	
	// Inventory
	pickUp() {
		_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[this.map].items.forEach((item) => {
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
			for (let slot = 0; slot < _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE; slot++) {
				if (this.inventory[slot]) {
					if (this.inventory[slot].class === itemClass) {
						this.inventory[slot].stack += stack;
						return true;
					}
				}
				else if (emptySlot < 0) {
					emptySlot = slot;
				}
				
				if (slot === _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE - 1) {
					if (emptySlot >= 0 && emptySlot < _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE) {
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
			for (let slot = 0; slot < _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE; slot++) {
				if (!this.inventory[slot]) {
					new InventoryItem(this.id, slot, itemClass, stack);
					return true;
				}
				else {
					if (slot === _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE - 1) {	// Inventory full
						return false;
					}
				}
			}
		}
	}
	
	dropItem(slot) {
		let item = this.inventory[slot];
		if (!item) return;
		
		if (slot < _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE) {
			// Destroy Inventory Item
			item.remove();
			
			// Create Map Item
			_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].spawnItem(this.map, this.x, this.y, item.class, item.stack);
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
			if (slot < _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE) {	// Check if item is equipped
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
		for (let i = 0; i < _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE; i++) {
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
				if (slot >= _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE) {
					if (newSlot >= _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE) {
						if (newItem.type === item.type) {
							item.slot = newSlot;
							newItem.slot = slot;
							_util_js__WEBPACK_IMPORTED_MODULE_3__["default"].swap(this.inventory, slot, newSlot);
						}
						else {
							_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendPlayerMessage(this.id, "That cannot be equipped there.");
						}
					}
					else {
						if (newItem.type === item.type) {
							item.equipped = false;
							newItem.equipped = true;
							item.slot = newSlot;
							newItem.slot = slot;
							_util_js__WEBPACK_IMPORTED_MODULE_3__["default"].swap(this.inventory, slot, newSlot);
							this.calcBonusStats();
						}
						else {
							newSlot = this.findFirstEmptySlot();
							if (newSlot) {
								item.equipped = false;
								item.slot = newSlot;
								_util_js__WEBPACK_IMPORTED_MODULE_3__["default"].swap(this.inventory, slot, newSlot);
								this.calcBonusStats();
							}
							else {
								_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendPlayerMessage(this.id, "Your inventory is full.");
							}
						}
					}
				}
				else {
					if (newSlot >= _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE) {
						if (newItem.type === item.type) {
							item.equipped = true;
							newItem.equipped = false;
							item.slot = newSlot;
							newItem.slot = slot;
							_util_js__WEBPACK_IMPORTED_MODULE_3__["default"].swap(this.inventory, slot, newSlot);
							this.calcBonusStats();
						}
						else {
							_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendPlayerMessage(this.id, "That cannot be equipped there.");
						}
					}
					else {
						item.slot = newSlot;
						newItem.slot = slot;
						_util_js__WEBPACK_IMPORTED_MODULE_3__["default"].swap(this.inventory, slot, newSlot);
					}
				}
			}
			else {
				if (slot >= _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE) {
					if (newSlot >= _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE) {
						if (newSlot === item.findEquipmentSlot()) {
							item.slot = newSlot;
							this.inventory[newSlot] = item;
							delete this.inventory[slot];
						}
						else {
							_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendPlayerMessage(this.id, "That cannot be equipped there.");
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
					if (newSlot >= _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE) {
						if (newSlot === item.findEquipmentSlot()) {
							item.equipped = true;
							item.slot = newSlot;
							this.inventory[newSlot] = item;
							delete this.inventory[slot];
							this.calcBonusStats();
						}
						else {
							_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendPlayerMessage(this.id, "That cannot be equipped there.");
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
		
		if (item.slot >= _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE) {
			let newSlot = this.findFirstEmptySlot();
			if (newSlot === null) {
				_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendPlayerMessage(this.id, "Your inventory is full.");
			}
			else {
				this.moveItemToSlot(slot, newSlot);
			}
		}
	}
	
	findFirstEmptySlot() {
		for (let slot = 0; slot < _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE; slot++) {
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


/***/ }),

/***/ "./server/src/classes/bot.js":
/*!***********************************!*\
  !*** ./server/src/classes/bot.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Bot; });
/* harmony import */ var _db_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../db.js */ "./server/src/db.js");
/* harmony import */ var _game_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../game.js */ "./server/src/game.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config.js */ "./server/src/config.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util.js */ "./server/src/util.js");
/* harmony import */ var _Actor_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Actor.js */ "./server/src/classes/Actor.js");






// A Bot is an Actor with conditional inputs

class Bot extends _Actor_js__WEBPACK_IMPORTED_MODULE_4__["default"] {
	constructor(botRef, map, x, y) {
		let data = _db_js__WEBPACK_IMPORTED_MODULE_0__["default"].getBotData(botRef);

		super(map, x, y, data.name, data.sprite);
		this.botRef = botRef;
		this.hostile = data.hostile;		// Whether bot attacks on sight

		this.target = null;
		this.setTask('wandering');
		this.moveTimer = 0;
		
		this.id = _util_js__WEBPACK_IMPORTED_MODULE_3__["default"].firstEmptyIndex(_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[this.map].bots);
		_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[this.map].bots[this.id] = this;
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
			map: this.map,
			x: this.startX,
			y: this.startY,
			z: this.z,
			destinationX: this.destinationX,
			destinationY: this.destinationY,
			lerp: this.lerp,
			isRunning: this.isRunning,
			isAttacking: this.isAttacking,
			isDead: this.isDead
		};
	}

	remove() {
		delete _game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[this.map].bots[this.id];
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
		if (source instanceof _Actor_js__WEBPACK_IMPORTED_MODULE_4__["default"]) {
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
		for (let slot = 0; slot < _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE; slot++) {
			let item = this.inventory[slot];
			if (!item) {
				continue;
			}
			
			switch (item.type) {
				case 'weapon':
					if (this.inventory[_config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE]) {
						if (item.damageBonus > this.inventory[_config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE].damageBonus) {
							this.equipItem(slot);
							continue;
						}
					}
					else {
						this.equipItem(slot);
					}
				break;
				case 'shield':
					if (this.inventory[_config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE + 1]) {
						if (item.defenceBonus > this.inventory[_config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE + 1].defenceBonus) {
							this.equipItem(slot);
							continue;
						}
					}
					else {
						this.equipItem(slot);
					}
				break;
				case 'armour':
					if (this.inventory[_config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE + 2]) {
						if (item.defenceBonus > this.inventory[_config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE + 2].defenceBonus) {
							this.equipItem(slot);
							continue;
						}
					}
					else {
						this.equipItem(slot);
					}
				break;
				case 'helmet':
					if (this.inventory[_config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE + 3]) {
						if (item.defenceBonus > this.inventory[_config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE + 3].defenceBonus) {
							this.equipItem(slot);
							continue;
						}
					}
					else {
						this.equipItem(slot);
					}
				break;
				case 'ring':
					if (this.inventory[_config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE + 4]) {
						if (item.damageBonus > this.inventory[_config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE + 4].damageBonus) {
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


/***/ }),

/***/ "./server/src/classes/entity.js":
/*!**************************************!*\
  !*** ./server/src/classes/entity.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Entity; });
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config.js */ "./server/src/config.js");


// An Entity is any object that appears on the map

class Entity {
	constructor(map, x, y, sprite = 0) {
		this.map = map;
		this.x = x;
		this.y = y;
		if (sprite < 0) {
			sprite = 0;
		}
		this.sprite = sprite;
	}
}

/***/ }),

/***/ "./server/src/classes/map.js":
/*!***********************************!*\
  !*** ./server/src/classes/map.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Map; });
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config.js */ "./server/src/config.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util.js */ "./server/src/util.js");
/* harmony import */ var _tile_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tile.js */ "./server/src/classes/tile.js");




class Map {
	constructor(id, data) {
		this.id = id;

		this.name = data.name;
		this.dropChance = _util_js__WEBPACK_IMPORTED_MODULE_1__["default"].clamp(data.dropChance, 0, 100);
		//this.dropChance = 0 = 0% chance to drop items in inventory (drop nothing), 100 = 100% chance to drop (drop everything)
		this.dropAmountEQ = _util_js__WEBPACK_IMPORTED_MODULE_1__["default"].clamp(data.dropAmountEQ, 0, _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].EQUIPMENT_SIZE);
		//this.dropAmountEQ = number of equipped items the player will drop on death. dropEQ = EQUIPMENT_SIZE = drop all equipment
		
		this.items = data.items;
		this.bots = data.bots;
		this.effects = data.effects;
		this.texts = data.texts;
		
		this.tiles = [];
		for (let y = 0; y < _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].MAP_COLUMNS; y++) {
			this.tiles[y] = [];
			for (let x = 0; x < _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].MAP_ROWS; x++) {
				let tileData = this.getTileData(data, (y * _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].MAP_COLUMNS) + x);
				this.tiles[y][x] = new _tile_js__WEBPACK_IMPORTED_MODULE_2__["default"](tileData);
			}
		}
	}
	
	upload() {
		game.mapData[this.id] = JSON.parse(fs.readFileSync('./server/data/map.json', 'utf8'))[this.id];
		for (let y = 0; y < _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].MAP_ROWS; y++) {
			for (let x = 0; x < _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].MAP_COLUMNS; x++) {
				for (let i = 0; i < _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].MAP_LAYERS; i++) {
					this.tiles[y][x].layer[i] = game.mapData[this.id].tiles[i][(y * _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].MAP_COLUMNS) + x];
				}
			}
		}
		game.playerList.forEach((player) => {
			if (player.map === this.id) {
				player.loadMap();
			}
		});
	}
	
	update(delta) {
		let pack = {
			name: this.name,
			items: [],
			bots: [],
			effects: [],
			texts: []
		};
		
		this.items.forEach((item) => {
			pack.items[item.id] = item.update(delta);
		});
		this.bots.forEach((bot) => {
			pack.bots[bot.id] = bot.update(delta);
		});
		this.effects.forEach((effect) => {
			pack.effects[effect.id] = effect.update(delta);
		});
		this.texts.forEach((text) => {
			pack.texts[text.id] = text.update(delta);
		});
		
		return pack;
	}
	
	getPack() {
		let mapPack = {
			name: this.name,
			tiles: this.getTilePack(),
			items: [],
			bots: [],
			effects: [],
			texts: []
		};

		this.items.forEach((item) => {
			mapPack.items[item.id] = item.getPack();
		});
		this.bots.forEach((bot) => {
			mapPack.bots[bot.id] = bot.getPack();
		});
		this.effects.forEach((effect) => {
			mapPack.effects[effect.id] = effect.getPack();
		});
		this.texts.forEach((text) => {
			mapPack.texts[text.id] = text.getPack();
		});
		
		return mapPack;
	}
	
	getTilePack() {
		let tilePack = [];

		for (let y = 0; y < _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].MAP_ROWS; y++) {
			tilePack[y] = [];
			for (let x = 0; x < _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].MAP_COLUMNS; x++) {
				tilePack[y][x] = this.tiles[y][x].getPack();
			}
		}

		return tilePack;
	}

	getTileData(data, index = 0) {
		if (!data) return;

		let tileData = {
			layer: [],
			wall: data.tiles.wall[index],
			//canAttack: data.canAttack[index],
			//damage: data.damage[index],
			//defence: data.defence[index],
			//healthMax: data.healthMax[index],
			//warpMap: data.warpMap[index],
			//warpX: data.warpX[index],
			//warpY: data.warpY[index]
		};

		for (let i = 0; i < _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].MAP_LAYERS; i++) {
			tileData.layer[i] = data.tiles.layer[i][index];
		}

		return tileData;
	};
}

/***/ }),

/***/ "./server/src/classes/player.js":
/*!**************************************!*\
  !*** ./server/src/classes/player.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Player; });
/* harmony import */ var _db_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../db.js */ "./server/src/db.js");
/* harmony import */ var _game_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../game.js */ "./server/src/game.js");
/* harmony import */ var _actor_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./actor.js */ "./server/src/classes/actor.js");




// A Player is an Actor which takes input from a client

class Player extends _actor_js__WEBPACK_IMPORTED_MODULE_2__["default"] {
	constructor(id) {
		let data = _db_js__WEBPACK_IMPORTED_MODULE_0__["default"].getPlayerData(id);

		super(data.map, data.x, data.y, data.name, data.sprite);
		this.controller = 'player';
		this.id = id;
		this.adminAccess = data.adminAccess;

		this.damageBase = data.damageBase;				// minimum damage a player can have
		this.defenceBase = data.defenceBase;			// minimum defence a player can have
		this.healthMaxBase = data.healthMaxBase;	// max health without bonuses
		this.energyMaxBase = data.energyMaxBase;	// max energy without bonuses
		this.calcStats();
		this.restore();

		this.selected = null;
		this.input = {
			direction: null,
			run: false,
			pickup: false,
			attack: false
		}
	}

	loadMap() {
		
	}
	
	update(delta) {
		super.update(delta);		// Default Actor Update
		
		if (!this.isDead) {
			// Check for Atack Input
			if (this.input.attack && this.attackTimer === 0) {
				this.attack();
			}
			
			// Check for Movement Input
			if (!this.isMoving) {
				if (this.input.direction) {
					// Check for Run Input
					if (this.input.run) {
						if (this.energy > 0) {
							this.isRunning = true;
						}
						else {
							this.isRunning = false;
						}
					}
					else {
						this.isRunning = false;
					}
					this.move(this.input.direction);
				}
			}
		}
		
		return this.getPack();
	}
	
	getPack() {
		return {
			id: this.id,
			name: this.name,
			sprite: this.sprite,
			direction: this.direction,
			map: this.map,
			x: this.startX,
			y: this.startY,
			z: this.z,
			destinationX: this.destinationX,
			destinationY: this.destinationY,
			lerp: this.lerp,
			isRunning: this.isRunning,
			isAttacking: this.isAttacking,
			isDead: this.isDead
		};
	}
	
	getPrivatePack() {
		return {
			id: this.id,
			health: this.health,
			healthMax: this.healthMax,
			energy: this.energy,
			energyMax: this.energyMax,
			moveSpeed: this.moveSpeed,
			attackSpeed: this.attackSpeed,
			attackTimer: this.attackTimer,
			inventory: this.getInventoryPack()
		};
	}
	
	getInventoryPack() {
		let inventoryPack = [];
		
		this.inventory.forEach((item) => {
			inventoryPack[item.slot] = item.getPack();
		});
		
		return inventoryPack;
	}
	
	checkAdmin(access = 1) {
		if (access < 1) access = 1;
		return (this.adminAccess >= access);
	}

	onInput(data) {
		switch (data.input) {
			case null:
			case 'move': this.input.direction = data.direction;
			break;
			case 'run': this.input.run = data.state;
			break;
			case 'pickup':
				if (!this.input.pickup && data.state) {
					this.pickUp();
				}
				this.input.pickup = data.state;
			break;
			case 'attack':
				this.input.attack = data.state;
				this.attack(1, this.direction);
			break;
			case 'doubleClickItem':
				if (this.inventory[data.slot]) {
					if (!this.isDead) {
						this.useItem(data.slot);
					}
				}
			break;
			case 'rightClickItem':
				if (this.inventory[data.slot]) {
					if (!this.isDead) {
						this.dropItem(data.slot);
					}
				}
			break;
			case 'dragStopGame':
				if (this.inventory[data.slot]) {
					if (!this.isDead) {
						this.dropItem(data.slot);
					}
				}
			break;
			case 'dragStopInventory':
				if (this.inventory[data.slot]) {
					if (!this.isDead) {
						this.moveItemToSlot(data.slot, data.newSlot);
					}
				}
			break;
			case 'dragStopEquipment':
				if (this.inventory[data.slot]) {
					if (!this.isDead) {
						this.moveItemToSlot(data.slot, data.newSlot);
					}
				}
			break;
			case 'serverChat': _game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendServerMessage(`${this.name} yells, "${data.message}"`);
			break;
			case 'mapChat': _game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendMapMessage(this.map, `${this.name} says, "${data.message}"`);
			break;
			case 'playerChat':
				let target = this.playerList[data.targetId];
				if (target) {
					_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendPlayerMessage(target.id, `${this.name} whispers, "${data.message}"`);
					_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendPlayerMessage(this.id, `You whisper to ${target.name}, "${data.message}"`);
				}
			break;

			// God Inputs
			case 'spawnItem':
				if (this.checkAdmin(2)) {
					_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].spawnItem(data.mapId, data.x, data.y, data.type, data.stack);
				}
				else {
					_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendPlayerMessage(this.id, `You don't have access to that command.`);
				}
			break;
			case 'uploadMap':
				if (this.checkAdmin(2)) {
					_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[data.mapId].upload();
				}
				else {
					_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendPlayerMessage(this.id, `You don't have access to that command.`);
				}
			break;
		}
	}
}

/***/ }),

/***/ "./server/src/classes/text.js":
/*!************************************!*\
  !*** ./server/src/classes/text.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Text; });
/* harmony import */ var _game_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../game.js */ "./server/src/game.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util.js */ "./server/src/util.js");



class Text {
	constructor(map, x, y, message, colour = '#000000', velX = 0, velY = 0) {
		this.map = map;
		this.x = x;
		this.y = y;
		this.message = message;
		this.colour = colour;
		
		this.velX = velX;
		this.velY = velY;
		this.timer = 0;

		this.id = _util_js__WEBPACK_IMPORTED_MODULE_1__["default"].firstEmptyIndex(_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].mapList[this.map].texts);
		_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].mapList[this.map].texts[this.id] = this;
	}
	
	update(delta) {
		this.timer += delta;
		if (this.timer > 3) {
			this.remove();
		}

		this.x += this.velX;
		this.y += this.velY;

		return this.getPack();
	}
	
	getPack() {
		return {
			id: this.id,
			map: this.map,
			x: this.x,
			y: this.y,
			message: this.message,
			colour: this.colour
		};
	}

	remove() {
		delete _game_js__WEBPACK_IMPORTED_MODULE_0__["default"].mapList[this.map].texts[this.id];
	}
}


/***/ }),

/***/ "./server/src/classes/tile.js":
/*!************************************!*\
  !*** ./server/src/classes/tile.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Tile; });
class Tile {
	constructor(data) {
		this.layer = data.layer;
    this.wall = data.wall;
    this.canAttack = data.canAttack;
    this.damage = data.damage;
		this.defence = data.defence;
		this.healthMax = data.healthMax;
		this.health = this.healthMax;

		this.warpMap = data.warpMap;
		this.warpX = data.warpX;
		this.warpY = data.warpY;
  }

	onWalk() {
		// Run MapWalk#_x_y script
  }
  
	onClick() {
		// Run MapClick#_x_y script
  }
  
	onAttack() {
		// Run MapAttack#_x_y script
  }
  
  getPack() {
    return {
      layer: this.layer,
      wall: this.wall,
      canAttack: this.canAttack,
      damage: this.damage,
      defence: this.defence,
      healthMax: this.healthMax,
      warpMap: this.warpMap,
      warpX: this.warpX,
      warpY: this.warpY
    };
  }
}


/***/ }),

/***/ "./server/src/config.js":
/*!******************************!*\
  !*** ./server/src/config.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const config = {};

config.PORT = 2000;
config.FRAMERATE = 1000 / 60;
config.TILE_SIZE = 32;
config.SLOT_SIZE = config.TILE_SIZE + 6;

config.MAP_LAYERS = 6;
config.MAP_COLUMNS = 12;
config.MAP_ROWS = 12;

config.MAX_MAPS = 10;
config.MAX_USERS = 100;
config.MAX_SPRITES = 13;
config.MAX_EFFECTS = 70;

config.MAX_HEALTH_BASE = 200;
config.MAX_HEALTH_BONUS = 55;
config.MAX_ENERGY_BASE = 200;
config.MAX_ENERGY_BONUS = 55;

config.INVENTORY_SIZE = 20;
config.EQUIPMENT_SIZE = 5;

config.START_MAP = 1;
config.START_X = 5;
config.START_Y = 5;
config.START_NAME = 'New Player';
config.START_SPRITE = 1;
config.START_DAMAGE = 2;
config.START_DEFENCE = 0;
config.START_HEALTH_MAX = 20;
config.START_ENERGY_MAX = 10;

config.BACKUP_TIME = 5;

/* harmony default export */ __webpack_exports__["default"] = (config);


/***/ }),

/***/ "./server/src/db.js":
/*!**************************!*\
  !*** ./server/src/db.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var mongojs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongojs */ "mongojs");
/* harmony import */ var mongojs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongojs__WEBPACK_IMPORTED_MODULE_0__);


const mongo = mongojs__WEBPACK_IMPORTED_MODULE_0___default()('localhost:27017/odyssey', ['accounts', 'players', 'maps', 'items', 'npcs']);

class Database {
  constructor() {
    // This should be held in database
    this.items = [
      {	// type 0
        name: "Blank Item",
        sprite: 68,
        type: 'none',
        reusable: false,
        
        use:		function() {
                return true;
              },
        get:		function() {
                return true;
              },
        drop:	function() {
                return true;
              }
      },
      {	// type 1
        name: "Health Potion",
        sprite: 1,
        type: 'potion',
        reusable: false,
        
        use:		function() {
                let value = 10;
                this.health += value;
                new FloatText(this.gridPosition.x, this.gridPosition.y, value, "#00FF00");
                if (this.health > this.healthMax) {
                  this.health = this.healthMax;
                }
                return true;
              },
        get:		function() {
                return true;
              },
        drop:	function() {
                return true;
              }
      }, 
      {	// type 2
        name: "Energy Potion",
        sprite: 2,
        type: 'potion',
        reusable: false,
        
        use:		function() {
                let value = 10;
                this.energy += value;
                new FloatText(this.gridPosition.x, this.gridPosition.y, value, "#FFFF00");
                if (this.energy > this.energyMax) {
                  this.energy = this.energyMax;
                }
                return true;
              },
        get:		function() {
                return true;
              },
        drop:	function() {
                return true;
              }
      }, 
      {	// type 3
        name: "Incognito",
        sprite: 12,
        type: 'special',
        reusable: true,
        
        use:		function() {
                this.setSprite(game.rnd.integerInRange(1, MAX_SPRITES));
                return true;
              },
        get:		function() {
                return true;
              },
        drop:	function() {
                return true;
              }
      },
      {	// type 4
        name: "Sword",
        sprite: 10,
        type: 'weapon',
        reusable: true,
        
        use:		function() {
                return true;
              },
        get:		function() {
                return true;
              },
        drop:	function() {
                return true;
              },
        
        damageBonus: 1,
        defenceBonus: 0,
        healthMaxBonus: 0,
        energyMaxBonus: 0,
        rangeBonus: 0
        
      },
      {	// type 5
        name: "Axe",
        sprite: 14,
        type: 'weapon',
        reusable: true,
        
        use:		function() {
                return true;
              },
        get:		function() {
                return true;
              },
        drop:	function() {
                return true;
              },
        
        damageBonus: 2,
        defenceBonus: 0,
        healthMaxBonus: 0,
        energyMaxBonus: 0,
        rangeBonus: 0
        
      }
      
    ];

    this.maps = [
      {	// id 0
        name: "Blank Map",
        dropChance: 100,
        dropAmountEQ: 0,
        join:		function() {
                return true;
              },
        leave:	function() {
                return true;
              },
      },
      {	// id 1
        name: "Crendale 1",
        dropChance: 100,
        dropAmountEQ: 0,
        join:		function() {
                return true;
              },
        leave:	function() {
                return true;
              },
      },
      {	// id 2
        name: "Crendale 2",
        dropChance: 100,
        dropAmountEQ: 0,
        join:		function() {
                return true;
              },
        leave:	function() {
                return true;
              },
      },
      {	// id 3
        name: "Crendale 3",
        dropChance: 100,
        dropAmountEQ: 0,
        join:		function() {
                return true;
              },
        leave:	function() {
                return true;
              },
      },
      {	// id 4
        name: "Crendale 4",
        dropChance: 100,
        dropAmountEQ: 0,
        join:		function() {
                return true;
              },
        leave:	function() {
                return true;
              },
      },
      {	// id 5
        name: "Crendale 5",
        dropChance: 100,
        dropAmountEQ: 0,
        join:		function() {
                return true;
              },
        leave:	function() {
                return true;
              },
      },
      {	// id 6
        name: "Crendale 6",
        dropChance: 100,
        dropAmountEQ: 0,
        join:		function() {
                return true;
              },
        leave:	function() {
                return true;
              },
      },
      {	// id 7
        name: "Crendale 7",
        dropChance: 100,
        dropAmountEQ: 0,
        join:		function() {
                return true;
              },
        leave:	function() {
                return true;
              },
      },
      {	// id 8
        name: "Crendale 8",
        dropChance: 100,
        dropAmountEQ: 0,
        join:		function() {
                return true;
              },
        leave:	function() {
                return true;
              },
      },
      {	// id 9
        name: "Crendale 9",
        dropChance: 100,
        dropAmountEQ: 0,
        join:		function() {
                return true;
              },
        leave:	function() {
                return true;
              },
      },
    ];

    this.players = [
      {	//id 0
        name: "Fankadore",
        sprite: 1,
        adminAccess: 0,
        map: 1,
        x: 5,
        y: 5,
        damageBase: 10,
        defenceBase: 2,
        healthMaxBase: 20,
        energyMaxBase: 40
      },
      {	//id 1
        name: "Obbitt",
        sprite: 3,
        adminAccess: 0,
        map: 1,
        x: 4,
        y: 4,
        damageBase: 10,
        defenceBase: 2,
        healthMaxBase: 20,
        energyMaxBase: 40
      },
      {	//id 2
        name: "Frolik",
        sprite: 5,
        adminAccess: 0,
        map: 1,
        x: 5,
        y: 5,
        damageBase: 10,
        defenceBase: 2,
        healthMaxBase: 20,
        energyMaxBase: 40
      },
    ];

    this.bots = [
      {	//id 0
        name: "Rat",
        sprite: 0,
        damage: 1,
        healthMax: 3,
      },
      {	//id 1
        name: "Snake",
        sprite: 1,
        damage: 2,
        healthMax: 5,
      },
    ];

  }

	log(message) {
		console.log(message);
	}

  find(username) {
    mongo.accounts.findOne({username: username}, (err, res) => {
      if (err) throw err;
      if (res) {
        return res;
      }
      else {
        this.log(`Player not found with username: ${username}`);
      }
    });
  }

  getPlayerData(id) {
    let playerData = {};

    if (this.players[id]) {	// From Database
      playerData = this.players[id];
		}
		else {	// First Login
      playerData.name = config.START_NAME;
      playerData.sprite = config.START_SPRITE;
      playerData.adminAccess = 0;
      
      playerData.map = config.START_MAP;
      playerData.x = config.START_X;
      playerData.y = config.START_Y;
      
      playerData.damageBase = config.START_DAMAGE;
      playerData.defenceBase = config.START_DEFENCE;
      playerData.healthMaxBase = config.START_HEALTH_MAX;
      playerData.energyMaxBase = config.START_ENERGY_MAX;
    }
    
    return playerData;
  }

  savePlayerData(data) {
    //mongo.players.save(data.id, data);
  }

  getMapData(id) {
    let mapData = {};

    if (this.maps[id]) {
      mapData = this.maps[id];
    }
    else {
      mapData.name = "Blank Map";
      mapData.items = [];
      mapData.bots = [];
      mapData.effects = [];
      mapData.texts = [];
      mapData.dropChance = 100;
      mapData.dropAmountEQ = 5;
      mapData.tiles = {
        layer: [ 
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ],
        wall: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
        canAttack: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
        damage: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        defence: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        healthMax: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        warpMap: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        warpX: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        warpY: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      };
    }

    return mapData;
  }
  
  saveMapData(data) {
    mongo.maps.save(data.id, data);
  }

  getBotData(ref) {
    return this.bots[ref];
  }
}

const db = new Database();
/* harmony default export */ __webpack_exports__["default"] = (db);


/***/ }),

/***/ "./server/src/game.js":
/*!****************************!*\
  !*** ./server/src/game.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _classes_map_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./classes/map.js */ "./server/src/classes/map.js");
/* harmony import */ var _classes_player_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./classes/player.js */ "./server/src/classes/player.js");
/* harmony import */ var _db_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./db.js */ "./server/src/db.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./config.js */ "./server/src/config.js");
/* harmony import */ var _classes_bot_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./classes/bot.js */ "./server/src/classes/bot.js");








class Game {
	constructor() {
		this.playerList = [];
		this.mapList = [];
		this.messageQueue = [];

		this.createMaps();
	}

	createMaps() {
		this.mapData = JSON.parse(fs__WEBPACK_IMPORTED_MODULE_0___default.a.readFileSync('./server/data/map.json', 'utf8'));
		for (let id = 0; id < _config_js__WEBPACK_IMPORTED_MODULE_4__["default"].MAX_MAPS; id++) {
			this.mapList[id] = new _classes_map_js__WEBPACK_IMPORTED_MODULE_1__["default"](id, this.mapData[id]);
		}
	}

	update(delta) {
		let pack = {
			players: [],
			maps: []
		};
		
		this.playerList.forEach((player) => {
			pack.players[player.id] = player.update(delta);
		});
		
		this.mapList.forEach((map) => {
			pack.maps[map.id] = map.update(delta);
		});
		
		return pack;
	}

	playerLogin(id) {
		let player = new _classes_player_js__WEBPACK_IMPORTED_MODULE_2__["default"](id);
		this.playerList[id] = player;
		this.sendServerMessage(`${player.name} has logged in.`);
		return player;
	}
	
	playerLogout(id) {
		let player = this.playerList[id];
		if (player) {
			_db_js__WEBPACK_IMPORTED_MODULE_3__["default"].savePlayerData(player.getPack);
			this.sendServerMessage(`${player.name} has logged out.`);
			delete this.playerList[id];
		}
	}

	sendServerMessage(message) {
		this.messageQueue.push({message});
	}

	sendMapMessage(map, message) {
		this.messageQueue.push({message, map});
	}

	sendPlayerMessage(id, message) {
		this.messageQueue.push({message, id});
	}

	checkVacant(mapId, x, y) {
		// Check for Map Edges
		if (x < 0 || x >= _config_js__WEBPACK_IMPORTED_MODULE_4__["default"].MAP_COLUMNS) return false;
		if (y < 0 || y >= _config_js__WEBPACK_IMPORTED_MODULE_4__["default"].MAP_ROWS) return false;
		
		let map = this.mapList[mapId];
		
		// Check for Wall Tiles
		if (map.tiles[y][x].wall === true) return false;
		
		// Check for Bots
		let bots = map.bots.filter((bot) => {
			if (bot.x === x && bot.y === y && !bot.isDead) return true;
		});
		if (bots.length > 0) return false;
		
		// Check for Players
		let players = this.playerList.filter((player) => {
			if (player.map === map.id && player.x === x && player.y === y && !player.isDead) return true;
		});
		if (players.length > 0) return false;

		return true;
	}

	spawnBot(ref, mapId, x, y) {
		new _classes_bot_js__WEBPACK_IMPORTED_MODULE_5__["default"](ref, mapId, x, y);
	}
}

const game = new Game();
/* harmony default export */ __webpack_exports__["default"] = (game);


/***/ }),

/***/ "./server/src/gameloop.js":
/*!********************************!*\
  !*** ./server/src/gameloop.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var node_gameloop__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node-gameloop */ "node-gameloop");
/* harmony import */ var node_gameloop__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_gameloop__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _db_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./db.js */ "./server/src/db.js");
/* harmony import */ var _game_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./game.js */ "./server/src/game.js");
/* harmony import */ var _server_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./server.js */ "./server/src/server.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./config.js */ "./server/src/config.js");
/*** Game Loop ***/
/* Keeps track of time and co-ordinates the game and server */








class GameLoop {
  constructor() {
    this.id = null;
    this.timer = {
      backup: 0
    };
    this.start();
  }
  start() {
    this.id = node_gameloop__WEBPACK_IMPORTED_MODULE_0___default.a.setGameLoop((delta) => {
      // Update the game state
      let updatePack = _game_js__WEBPACK_IMPORTED_MODULE_2__["default"].update(delta);
      
      // Send updated state to clients
      _server_js__WEBPACK_IMPORTED_MODULE_3__["default"].sendUpdatePack(updatePack);
      
      // Periodic backup to database
      this.timer.backup += delta;
      if (this.timer.backup >= _config_js__WEBPACK_IMPORTED_MODULE_4__["default"].BACKUP_TIME) {
        this.timer.backup -= _config_js__WEBPACK_IMPORTED_MODULE_4__["default"].BACKUP_TIME;
        // SAVE STATE
      }
    }, _config_js__WEBPACK_IMPORTED_MODULE_4__["default"].FRAMERATE);
  }
}

const gameLoop = new GameLoop();
/* harmony default export */ __webpack_exports__["default"] = (gameLoop);

/***/ }),

/***/ "./server/src/main.js":
/*!****************************!*\
  !*** ./server/src/main.js ***!
  \****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _db_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./db.js */ "./server/src/db.js");
/* harmony import */ var _game_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./game.js */ "./server/src/game.js");
/* harmony import */ var _server_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./server.js */ "./server/src/server.js");
/* harmony import */ var _gameloop_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./gameloop.js */ "./server/src/gameloop.js");






/***/ }),

/***/ "./server/src/server.js":
/*!******************************!*\
  !*** ./server/src/server.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! http */ "http");
/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(http__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var socket_io__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! socket.io */ "socket.io");
/* harmony import */ var socket_io__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(socket_io__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _db_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./db.js */ "./server/src/db.js");
/* harmony import */ var _game_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./game.js */ "./server/src/game.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./config.js */ "./server/src/config.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./util.js */ "./server/src/util.js");










class Server {
	constructor() {
		const app = express__WEBPACK_IMPORTED_MODULE_0___default()();
		const server = http__WEBPACK_IMPORTED_MODULE_1___default.a.Server(app);
		const io = socket_io__WEBPACK_IMPORTED_MODULE_2___default()(server);
		const port = process.env.PORT || _config_js__WEBPACK_IMPORTED_MODULE_6__["default"].PORT;
		const publicPath = path__WEBPACK_IMPORTED_MODULE_3___default.a.resolve(__dirname, '../client');
		
		app.get('/', (req, res) => res.sendFile(publicPath + '/index.html'));
		app.use('/client', express__WEBPACK_IMPORTED_MODULE_0___default.a.static(publicPath));
		server.listen(port, () => _db_js__WEBPACK_IMPORTED_MODULE_4__["default"].log(`Server started. Listening on ${server.address().port}`));

		this.socketList = [];
		io.sockets.on('connection', (socket) => this.onConnect(socket));
	}

	// Receive data from clients
	onConnect(socket) {
		socket.id = _util_js__WEBPACK_IMPORTED_MODULE_7__["default"].firstEmptyIndex(this.socketList);
		this.socketList[socket.id] = socket;
		_db_js__WEBPACK_IMPORTED_MODULE_4__["default"].log(`New Connection: Id ${socket.id}`);
		
		socket.on('disconnect', () => this.onDisconnect(socket.id));
		socket.on('login', () => this.onLogin(socket.id));
		socket.on('logout', () => this.onLogout(socket.id));
	}

	onDisconnect(id) {
		if (_game_js__WEBPACK_IMPORTED_MODULE_5__["default"].playerList[id]) {
			_game_js__WEBPACK_IMPORTED_MODULE_5__["default"].playerLogout(id);
		}
		delete this.socketList[id];
		_db_js__WEBPACK_IMPORTED_MODULE_4__["default"].log(`Disconnected: Id ${id}`);
	}

	onLogin(id) {		
		// Create Player
		let player = _game_js__WEBPACK_IMPORTED_MODULE_5__["default"].playerLogin(id);
		
		// Receive Inputs
		let socket = this.socketList[id];
		socket.on('input', (data) => player.onInput(data));
	}
	
	onLogout(id) {
		_game_js__WEBPACK_IMPORTED_MODULE_5__["default"].playerLogout(id);
	}
	
	// Send data to clients
	sendUpdatePack(updatePack) {
		_game_js__WEBPACK_IMPORTED_MODULE_5__["default"].playerList.forEach((player) => {
			let pack = {};
			pack.private = player.getPrivatePack();
			pack.players = updatePack.players.filter((playerData) => {
				return (playerData.map === player.map);
			});
			pack.map = updatePack.maps[player.map];
			
			let socket = this.socketList[player.id];
			socket.emit('update', pack);
		});
	}
	
	sendMapData(mapId) {
		_game_js__WEBPACK_IMPORTED_MODULE_5__["default"].playerList.forEach((player) => {
			if (player.map === mapId) {
				let socket = this.socketList[player.id];
				socket.emit('loadMap', _db_js__WEBPACK_IMPORTED_MODULE_4__["default"].map[mapId]);
			}
		});
	}

}

const server = new Server();
/* harmony default export */ __webpack_exports__["default"] = (server);


/***/ }),

/***/ "./server/src/util.js":
/*!****************************!*\
  !*** ./server/src/util.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function shuffle(array) {
  let currentIndex = array.length;
  let temp;
  let randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temp = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temp;
  }
  return array;
}

function swap(array, i, j) {
  let temp = array[i];
  array[i] = array[j];
  array[j] = temp;
}

function firstEmptyIndex(array) {
  for (let i = 0; i <= array.length; i++) {
    if (!array[i]) {
      return i;
    }
  }
}

function lerp(start, end, time) {
  //return start + (time * (end - start));
  return ((1 - time) * start) + (time * end);
}

function clamp(value, minimum, maximum) {
  if (value < minimum) {
    return minimum;
  }
  else if (value > maximum) {
    return maximum;
  }
  else {
    return value;
  }
}

/* harmony default export */ __webpack_exports__["default"] = ({
  shuffle,
  swap,
  firstEmptyIndex,
  lerp,
  clamp
});

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "mongojs":
/*!**************************!*\
  !*** external "mongojs" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("mongojs");

/***/ }),

/***/ "node-gameloop":
/*!********************************!*\
  !*** external "node-gameloop" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("node-gameloop");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL0FjdG9yLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy9hY3Rvci5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2NsYXNzZXMvYm90LmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy9lbnRpdHkuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL21hcC5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2NsYXNzZXMvcGxheWVyLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy90ZXh0LmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy90aWxlLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY29uZmlnLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvZGIuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9nYW1lLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvZ2FtZWxvb3AuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9tYWluLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvc2VydmVyLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvdXRpbC5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJleHByZXNzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZnNcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJodHRwXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibW9uZ29qc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcIm5vZGUtZ2FtZWxvb3BcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJwYXRoXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwic29ja2V0LmlvXCIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQXlDLGlDQUFpQztBQUMxRSx3SEFBZ0gsbUJBQW1CLEVBQUU7QUFDckk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbUJBQW1CO0FBQ25CO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsNklBQXFEO0FBQ3RFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLCtEQUErRDs7QUFFL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxzQkFBc0I7QUFDdEIsR0FBRzs7QUFFSDs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLFlBQVksUUFBUSxVQUFVLE9BQU8sT0FBTztBQUM5RDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJOztBQUVKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7O0FBRUo7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBLHFCQUFxQiwwRUFBOEI7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUixxQkFBcUIsMEVBQThCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwRkFBOEM7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx5REFBeUQ7O0FBRXpELGdDQUFnQztBQUNoQyxrRkFBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUIsdUVBQTJCO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0JBQW9CLDBFQUE4QjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDN3dCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG1CQUFtQjtBQUNuQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLDZJQUFxRDtBQUN0RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwrREFBK0Q7O0FBRS9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0Esc0JBQXNCO0FBQ3RCLEdBQUc7O0FBRUg7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixZQUFZLFFBQVEsVUFBVSxPQUFPLE9BQU87QUFDOUQ7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTs7QUFFSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJOztBQUVKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQSxxQkFBcUIsMEVBQThCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1IscUJBQXFCLDBFQUE4QjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEZBQThDO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EseURBQXlEOztBQUV6RCxnQ0FBZ0M7QUFDaEMsa0ZBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCLHVFQUEyQjtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQiwwRUFBOEI7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDN3dCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsOEJBQThCOztBQUU5QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0Esc0JBQXNCO0FBQ3RCOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxvQkFBb0IsMEVBQThCO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQ3ROQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDZEE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLG9FQUF3QjtBQUN6QztBQUNBLGtCQUFrQixpRUFBcUI7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCLGlFQUFxQjtBQUN0QyxrQkFBa0Isb0VBQXdCO0FBQzFDLG1CQUFtQixtRUFBdUI7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxpQkFBaUIsaUVBQXFCO0FBQ3RDO0FBQ0Esa0JBQWtCLG9FQUF3QjtBQUMxQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUJBQWlCLG1FQUF1QjtBQUN4QztBQUNBOztBQUVBO0FBQ0E7QUFDQSxDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ2xJQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG9DQUFvQztBQUNwQyxzQ0FBc0M7QUFDdEMsMENBQTBDO0FBQzFDLDBDQUEwQztBQUMxQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQSxzQkFBc0I7O0FBRXRCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEZBQWdELFVBQVUsV0FBVyxhQUFhO0FBQ2xGO0FBQ0EsZ0dBQW9ELFVBQVUsVUFBVSxhQUFhO0FBQ3JGO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0ZBQTBDLFVBQVUsY0FBYyxhQUFhO0FBQy9FLG1HQUF1RCxZQUFZLEtBQUssYUFBYTtBQUNyRjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQzs7Ozs7Ozs7Ozs7Ozs7OztBQ3RNQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ3hDQTtBQUFBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7OztBQ3BDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0EsZUFBZTs7QUFFZjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE9BQU87QUFDUCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQSxlQUFlOztBQUVmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0EsZUFBZTtBQUNmLE9BQU87QUFDUCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0EsZUFBZTtBQUNmLE9BQU87QUFDUCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0EsZUFBZTtBQUNmLE9BQU87QUFDUCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0EsZUFBZTtBQUNmLE9BQU87QUFDUCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0EsZUFBZTtBQUNmLE9BQU87QUFDUCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0EsZUFBZTtBQUNmLE9BQU87QUFDUCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0EsZUFBZTtBQUNmLE9BQU87QUFDUCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0EsZUFBZTtBQUNmLE9BQU87QUFDUCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0EsZUFBZTtBQUNmLE9BQU87QUFDUCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0EsZUFBZTtBQUNmLE9BQU87QUFDUDs7QUFFQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw0QkFBNEIsbUJBQW1CO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvREFBb0QsU0FBUztBQUM3RDtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBOztBQUVBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMxWUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtCQUFrQixrRUFBc0I7QUFDeEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsWUFBWTtBQUN4QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLFlBQVk7QUFDekM7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMEJBQTBCLFFBQVE7QUFDbEM7O0FBRUE7QUFDQSwwQkFBMEIsYUFBYTtBQUN2Qzs7QUFFQTtBQUNBLDBCQUEwQixZQUFZO0FBQ3RDOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwR0E7QUFBQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0EseUU7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDckNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwrR0FBbUUsc0JBQXNCOztBQUV6RjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyRUFBK0IsVUFBVTs7QUFFekM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlFQUE2QixHQUFHO0FBQ2hDOztBQUVBLGM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDckZBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQixtQkFBbUI7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEc7Ozs7Ozs7Ozs7O0FDbkRBLG9DOzs7Ozs7Ozs7OztBQ0FBLCtCOzs7Ozs7Ozs7OztBQ0FBLGlDOzs7Ozs7Ozs7OztBQ0FBLG9DOzs7Ozs7Ozs7OztBQ0FBLDBDOzs7Ozs7Ozs7OztBQ0FBLGlDOzs7Ozs7Ozs7OztBQ0FBLHNDIiwiZmlsZSI6InNlcnZlci5hcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NlcnZlci9zcmMvbWFpbi5qc1wiKTtcbiIsImltcG9ydCBkYiBmcm9tICcuLi9kYi5qcyc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4uL2dhbWUuanMnO1xyXG5pbXBvcnQgY29uZmlnIGZyb20gJy4uL2NvbmZpZy5qcyc7XHJcbmltcG9ydCB1dGlsIGZyb20gJy4uL3V0aWwuanMnO1xyXG5pbXBvcnQgRW50aXR5IGZyb20gJy4vZW50aXR5LmpzJztcclxuaW1wb3J0IFRleHQgZnJvbSAnLi90ZXh0LmpzJztcclxuXHJcbi8vIEFuIEFjdG9yIGlzIGFuIEVudGl0eSB3aGljaCBjYW4gbW92ZSwgYXR0YWNrIGFuZCBpbnRlcmFjdCB3aXRoIGl0ZW1zXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBY3RvciBleHRlbmRzIEVudGl0eSB7XHJcblx0Y29uc3RydWN0b3IobWFwLCB4LCB5LCBuYW1lLCBzcHJpdGUpIHtcclxuXHRcdHNwcml0ZSA9IHV0aWwuY2xhbXAoc3ByaXRlLCAxLCBjb25maWcuTUFYX1NQUklURVMpO1xyXG5cclxuXHRcdHN1cGVyKG1hcCwgeCwgeSwgc3ByaXRlKTtcclxuXHRcdHRoaXMuY29udHJvbGxlciA9ICdib3QnO1xyXG5cdFx0dGhpcy5uYW1lID0gbmFtZTtcclxuXHJcblx0XHR0aGlzLmludmVudG9yeSA9IFtdO1xyXG5cclxuXHRcdHRoaXMuY2FsY1N0YXRzKCk7XHJcblx0XHR0aGlzLnJlc3RvcmUoKTtcclxuXHJcblx0XHR0aGlzLmRpcmVjdGlvbiA9ICdkb3duJztcclxuXHRcdHRoaXMuc3RhcnRYID0gdGhpcy54O1xyXG5cdFx0dGhpcy5zdGFydFkgPSB0aGlzLnk7XHJcblx0XHR0aGlzLmRlc3RpbmF0aW9uWCA9IHRoaXMueDtcclxuXHRcdHRoaXMuZGVzdGluYXRpb25ZID0gdGhpcy55O1xyXG5cdFx0dGhpcy5sZXJwID0gMDtcclxuXHJcblx0XHR0aGlzLmlzTW92aW5nID0gZmFsc2U7XHJcblx0XHR0aGlzLmlzUnVubmluZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy5tb3ZlU3BlZWQgPSAyLjU7XHJcblx0XHR0aGlzLm1vdmVtZW50VGltZXIgPSAwO1xyXG5cdFx0dGhpcy5sYXppbmVzcyA9IDA7XHJcblxyXG5cdFx0dGhpcy5pc0F0dGFja2luZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy5hdHRhY2tTcGVlZCA9IDE7XHJcblx0XHR0aGlzLmF0dGFja1RpbWVyID0gMDtcdFxyXG5cdFx0dGhpcy50YXJnZXQgPSBudWxsO1xyXG5cdFx0dGhpcy5raWxscyA9IDA7XHJcblx0XHR0aGlzLmRlYXRocyA9IDA7XHJcblxyXG5cdFx0dGhpcy5pc0RlYWQgPSBmYWxzZTtcclxuXHRcdHRoaXMucmVzcGF3blRpbWVyID0gMDtcclxuXHRcdHRoaXMucmVzcGF3blNwZWVkID0gMTA7XHJcblx0XHR0aGlzLnJlc3Bhd25NYXAgPSBtYXA7XHJcblx0XHR0aGlzLnJlc3Bhd25YID0geDtcclxuXHRcdHRoaXMucmVzcGF3blkgPSB5O1xyXG5cdH1cclxuXHRcclxuXHQvLyBDaGFyYWN0ZXIgU3RhdHNcclxuXHRnZXQgZGFtYWdlKCkge1xyXG5cdFx0aWYgKHRoaXMuZGFtYWdlQmFzZSArIHRoaXMuZGFtYWdlQm9udXMgPCAwKSB7XHJcblx0XHRcdHJldHVybiAwO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmRhbWFnZUJhc2UgKyB0aGlzLmRhbWFnZUJvbnVzO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRnZXQgZGVmZW5jZSgpIHtcclxuXHRcdGlmICh0aGlzLmRlZmVuY2VCYXNlICsgdGhpcy5kZWZlbmNlQm9udXMgPCAwKSB7XHJcblx0XHRcdHJldHVybiAwO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmRlZmVuY2VCYXNlICsgdGhpcy5kZWZlbmNlQm9udXM7XHJcblx0XHR9XHJcblx0fVxyXG5cdGdldCBoZWFsdGhNYXgoKSB7XHJcblx0XHRpZiAodGhpcy5oZWFsdGhNYXhCYXNlICsgdGhpcy5oZWFsdGhNYXhCb251cyA8IDEpIHtcclxuXHRcdFx0cmV0dXJuIDE7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuaGVhbHRoTWF4QmFzZSArIHRoaXMuaGVhbHRoTWF4Qm9udXM7XHJcblx0XHR9XHJcblx0fVxyXG5cdGdldCBlbmVyZ3lNYXgoKSB7XHJcblx0XHRpZiAodGhpcy5lbmVyZ3lNYXhCYXNlICsgdGhpcy5lbmVyZ3lNYXhCb251cyA8IDApIHtcclxuXHRcdFx0cmV0dXJuIDA7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuZW5lcmd5TWF4QmFzZSArIHRoaXMuZW5lcmd5TWF4Qm9udXM7XHJcblx0XHR9XHJcblx0fVxyXG5cdGdldCByYW5nZSgpIHtcclxuXHRcdGlmICh0aGlzLnJhbmdlQmFzZSArIHRoaXMucmFuZ2VCb251cyA8IDEpIHtcclxuXHRcdFx0cmV0dXJuIDE7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMucmFuZ2VCYXNlICsgdGhpcy5yYW5nZUJvbnVzO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Y2FsY0Jhc2VTdGF0cygpIHtcdC8vIENsYXNzIGFuZCBMZXZlbFxyXG5cdFx0Ly9UT0RPOiBjaGVjayBkYiBmb3IgY2xhc3Mgc3RhdHM6IGJhc2UgYW5kIGluY3JlYXNlIHBlciBsZXZlbFxyXG5cdFx0Ly8gdGhpcy5kYW1hZ2VCYXNlID0gY2xhc3MuYmFzZS5kYW1hZ2UgKyAoY2xhc3MuaW5jcmVhc2VQZXJMZXZlbC5kYW1hZ2UgKiB0aGlzLmxldmVsKTtcclxuXHRcdHRoaXMuZGFtYWdlQmFzZSA9IDU7XHJcblx0XHR0aGlzLmRlZmVuY2VCYXNlID0gMDtcclxuXHRcdHRoaXMuaGVhbHRoTWF4QmFzZSA9IDEwO1xyXG5cdFx0dGhpcy5lbmVyZ3lNYXhCYXNlID0gNDA7XHJcblx0XHR0aGlzLnJhbmdlQmFzZSA9IDE7XHJcblx0fVxyXG5cclxuXHRjYWxjQm9udXNTdGF0cygpIHtcdC8vIEl0ZW1zIChlcXVpcHBlZCBhbmQgcGFzc2l2ZSkgYW5kIEVmZmVjdHMgKHNwZWxscyBhbmQgcG90aW9ucylcclxuXHRcdGxldCBpdGVtQm9udXMgPSB0aGlzLmNhbGNJdGVtQm9udXMoKTtcclxuXHRcdGxldCBlZmZlY3RCb251cyA9IHRoaXMuY2FsY0VmZmVjdEJvbnVzKCk7XHJcblxyXG5cdFx0dGhpcy5kYW1hZ2VCb251cyA9IGl0ZW1Cb251cy5kYW1hZ2UgKyBlZmZlY3RCb251cy5kYW1hZ2U7XHJcblx0XHR0aGlzLmRlZmVuY2VCb251cyA9IGl0ZW1Cb251cy5kZWZlbmNlICsgZWZmZWN0Qm9udXMuZGVmZW5jZTtcclxuXHRcdHRoaXMuaGVhbHRoTWF4Qm9udXMgPSBpdGVtQm9udXMuaGVhbHRoTWF4ICsgZWZmZWN0Qm9udXMuaGVhbHRoTWF4O1xyXG5cdFx0dGhpcy5lbmVyZ3lNYXhCb251cyA9IGl0ZW1Cb251cy5lbmVyZ3lNYXggKyBlZmZlY3RCb251cy5lbmVyZ3lNYXg7XHJcblx0XHR0aGlzLnJhbmdlQm9udXMgPSBpdGVtQm9udXMucmFuZ2UgKyBlZmZlY3RCb251cy5yYW5nZTtcclxuXHR9XHJcblxyXG5cdGNhbGNTdGF0cygpIHtcclxuXHRcdHRoaXMuY2FsY0Jhc2VTdGF0cygpO1xyXG5cdFx0dGhpcy5jYWxjQm9udXNTdGF0cygpO1xyXG5cdH1cclxuXHJcblx0Y2FsY0l0ZW1Cb251cygpIHtcclxuXHRcdGxldCBpdGVtQm9udXMgPSB7XHJcblx0XHRcdGRhbWFnZTogMCxcclxuXHRcdFx0ZGVmZW5jZTogMCxcclxuXHRcdFx0aGVhbHRoTWF4OiAwLFxyXG5cdFx0XHRlbmVyZ3lNYXg6IDAsXHJcblx0XHRcdHJhbmdlOiAwXHJcblx0XHR9O1xyXG5cclxuXHRcdC8vIEZvciBlYWNoIGl0ZW0gaW4gaW52ZW50b3J5IGNoZWNrIGZvciBib251c2VzXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IChjb25maWcuSU5WRU5UT1JZX1NJWkUgKyBjb25maWcuRVFVSVBNRU5UX1NJWkUpOyBpKyspIHtcclxuXHRcdFx0bGV0IGl0ZW0gPSB0aGlzLmludmVudG9yeVtpXTtcclxuXHRcdFx0aWYgKGl0ZW0gJiYgIWl0ZW0ucmVtb3ZlKSB7XHJcblx0XHRcdFx0aXRlbUJvbnVzLmRhbWFnZSArPSBpdGVtLnBhc3NpdmVEYW1hZ2U7XHJcblx0XHRcdFx0aXRlbUJvbnVzLmRlZmVuY2UgKz0gaXRlbS5wYXNzaXZlRGVmZW5jZTtcclxuXHRcdFx0XHRpdGVtQm9udXMuaGVhbHRoTWF4ICs9IGl0ZW0ucGFzc2l2ZUhlYWx0aE1heDtcclxuXHRcdFx0XHRpdGVtQm9udXMuZW5lcmd5TWF4ICs9IGl0ZW0ucGFzc2l2ZUVuZXJneU1heDtcclxuXHRcdFx0XHRpdGVtQm9udXMucmFuZ2UgKz0gaXRlbS5wYXNzaXZlUmFuZ2U7XHJcblxyXG5cdFx0XHRcdGlmIChpID49IGNvbmZpZy5JTlZFTlRPUllfU0laRSkge1xyXG5cdFx0XHRcdFx0aXRlbUJvbnVzLmRhbWFnZSArPSBpdGVtLmVxdWlwRGFtYWdlO1xyXG5cdFx0XHRcdFx0aXRlbUJvbnVzLmRlZmVuY2UgKz0gaXRlbS5lcXVpcERlZmVuY2U7XHJcblx0XHRcdFx0XHRpdGVtQm9udXMuaGVhbHRoTWF4ICs9IGl0ZW0uZXF1aXBIZWFsdGhNYXg7XHJcblx0XHRcdFx0XHRpdGVtQm9udXMuZW5lcmd5TWF4ICs9IGl0ZW0uZXF1aXBFbmVyZ3lNYXg7XHJcblx0XHRcdFx0XHRpdGVtQm9udXMucmFuZ2UgKz0gaXRlbS5lcXVpcFJhbmdlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gaXRlbUJvbnVzO1xyXG5cdH1cclxuXHJcblx0Y2FsY0VmZmVjdEJvbnVzKCkge1xyXG5cdFx0bGV0IGVmZmVjdEJvbnVzID0ge1xyXG5cdFx0XHRkYW1hZ2U6IDAsXHJcblx0XHRcdGRlZmVuY2U6IDAsXHJcblx0XHRcdGhlYWx0aE1heDogMCxcclxuXHRcdFx0ZW5lcmd5TWF4OiAwLFxyXG5cdFx0XHRyYW5nZTogMFxyXG5cdFx0fTtcclxuXHJcblx0XHQvLyBUT0RPOiB3b3JrIG91dCBob3cgdG8gZG8gZWZmZWN0cyBmb3Igc3BlbGxzIGFuZCBwb3Rpb25zXHJcblx0XHRyZXR1cm4gZWZmZWN0Qm9udXM7XHJcblx0fVxyXG5cclxuXHRyZXN0b3JlKCkge1xyXG5cdFx0dGhpcy5oZWFsdGggPSB0aGlzLmhlYWx0aE1heDtcclxuXHRcdHRoaXMuZW5lcmd5ID0gdGhpcy5lbmVyZ3lNYXg7XHJcblx0fVxyXG5cdFxyXG5cdC8vIE1vdmVtZW50XHJcblx0bW92ZShkaXJlY3Rpb24pIHtcclxuXHRcdGlmICh0aGlzLmlzTW92aW5nKSByZXR1cm47XHJcblxyXG5cdFx0aWYgKGRpcmVjdGlvbikge1xyXG5cdFx0XHR0aGlzLmRpcmVjdGlvbiA9IGRpcmVjdGlvbjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoZGlyZWN0aW9uID09PSAnbGVmdCcpIHtcclxuXHRcdFx0aWYgKCFnYW1lLmNoZWNrVmFjYW50KHRoaXMubWFwLCB0aGlzLnggLSAxLCB0aGlzLnkpKSByZXR1cm47XHJcblx0XHRcdHRoaXMuZGVzdGluYXRpb25YLS07XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdyaWdodCcpIHtcclxuXHRcdFx0aWYgKCFnYW1lLmNoZWNrVmFjYW50KHRoaXMubWFwLCB0aGlzLnggKyAxLCB0aGlzLnkpKSByZXR1cm47XHJcblx0XHRcdHRoaXMuZGVzdGluYXRpb25YKys7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChkaXJlY3Rpb24gPT09ICd1cCcpIHtcclxuXHRcdFx0aWYgKCFnYW1lLmNoZWNrVmFjYW50KHRoaXMubWFwLCB0aGlzLngsIHRoaXMueSAtIDEpKSByZXR1cm47XHJcblx0XHRcdHRoaXMuZGVzdGluYXRpb25ZLS07XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdkb3duJykge1xyXG5cdFx0XHRpZiAoIWdhbWUuY2hlY2tWYWNhbnQodGhpcy5tYXAsIHRoaXMueCwgdGhpcy55ICsgMSkpIHJldHVybjtcclxuXHRcdFx0dGhpcy5kZXN0aW5hdGlvblkrKztcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRzd2l0Y2ggKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICh0aGlzLmxhemluZXNzICsgMykpKSB7XHJcblx0XHRcdFx0Y2FzZSAwOiB0aGlzLm1vdmUoJ2xlZnQnKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIDE6IHRoaXMubW92ZSgncmlnaHQnKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIDI6IHRoaXMubW92ZSgndXAnKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIDM6IHRoaXMubW92ZSgnZG93bicpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGRlZmF1bHQ6IC8vIERvbid0IE1vdmVcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gU2V0IG1vdmUgc3BlZWRcclxuXHRcdGlmICh0aGlzLmlzUnVubmluZykge1xyXG5cdFx0XHRpZiAodGhpcy5lbmVyZ3kgPiAwKSB7XHJcblx0XHRcdFx0dGhpcy5lbmVyZ3ktLTtcclxuXHRcdFx0XHR0aGlzLm1vdmVTcGVlZCA9IDQ7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5lbmVyZ3kgPSAwO1xyXG5cdFx0XHRcdHRoaXMubW92ZVNwZWVkID0gMi41O1xyXG5cdFx0XHRcdHRoaXMuaXNSdW5uaW5nID0gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHR0aGlzLm1vdmVTcGVlZCA9IDIuNTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dGhpcy5pc01vdmluZyA9IHRydWU7XHJcblx0fVxyXG5cdFxyXG5cdG1vdmVUb1RhcmdldCh0YXJnZXQsIGhvc3RpbGUpIHtcclxuXHRcdGlmICghdGFyZ2V0KSByZXR1cm47XHJcblx0XHRcclxuXHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICYmIHRhcmdldC55ID09PSB0aGlzLnkpIHtcclxuXHRcdFx0dGhpcy5tb3ZlKCk7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyID09PSAwKSkge1xyXG5cdFx0XHRpZiAodGFyZ2V0LnggPCB0aGlzLngpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LnggPj0gKHRoaXMueCAtIHRoaXMucmFuZ2UpICYmIHRhcmdldC55ID09PSB0aGlzLnkpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ2xlZnQnO1xyXG5cdFx0XHRcdFx0XHRpZiAoIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmF0dGFjaygnbGVmdCcpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCdsZWZ0Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHRhcmdldC54ID4gdGhpcy54KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggKyB0aGlzLnJhbmdlICYmIHRhcmdldC55ID09PSB0aGlzLnkpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ3JpZ2h0JztcclxuXHRcdFx0XHRcdFx0aWYgKCF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ3JpZ2h0Jyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ3JpZ2h0Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHRhcmdldC55IDwgdGhpcy55KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggJiYgdGFyZ2V0LnkgPT09IHRoaXMueSAtIHRoaXMucmFuZ2UpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ3VwJztcclxuXHRcdFx0XHRcdFx0aWYgKCF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ3VwJyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ3VwJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHRhcmdldC55ID4gdGhpcy55KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggJiYgdGFyZ2V0LnkgPT09IHRoaXMueSArIHRoaXMucmFuZ2UpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ2Rvd24nO1xyXG5cdFx0XHRcdFx0XHRpZiAoIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmF0dGFjaygnZG93bicpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCdkb3duJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0aWYgKHRhcmdldC55ID4gdGhpcy55KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggJiYgdGFyZ2V0LnkgPT09IHRoaXMueSArIHRoaXMucmFuZ2UpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlKSB7XHJcblx0XHRcdFx0XHRcdGlmICghdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCdkb3duJyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ2Rvd24nKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodGFyZ2V0LnkgPCB0aGlzLnkpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LnggPT09IHRoaXMueCAmJiB0YXJnZXQueSA9PT0gdGhpcy55IC0gdGhpcy5yYW5nZSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUpIHtcclxuXHRcdFx0XHRcdFx0aWYgKCF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ3VwJyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ3VwJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHRhcmdldC54ID4gdGhpcy54KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggKyB0aGlzLnJhbmdlICYmIHRhcmdldC55ID09PSB0aGlzLnkpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlKSB7XHJcblx0XHRcdFx0XHRcdGlmICghdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCdyaWdodCcpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCdyaWdodCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICh0YXJnZXQueCA8IHRoaXMueCkge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQueCA+PSAodGhpcy54IC0gdGhpcy5yYW5nZSkgJiYgdGFyZ2V0LnkgPT09IHRoaXMueSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUpIHtcclxuXHRcdFx0XHRcdFx0aWYgKCF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ2xlZnQnKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSgnbGVmdCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHQvLyBDb21iYXRcclxuXHRjaGVja0luUmFuZ2UoZGlyZWN0aW9uLCB0YXJnZXQsIHJhbmdlKSB7XHJcblx0XHRpZiAodGFyZ2V0Lm1hcCAhPT0gdGhpcy5tYXApIHJldHVybiBmYWxzZTtcclxuXHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICYmIHRhcmdldC55ID09PSB0aGlzLnkpIHJldHVybiBmYWxzZTtcdC8vIFN0YWNrZWQgZG9lcyBub3QgY291bnQgYXMgaW4gcmFuZ2VcclxuXHRcdFxyXG5cdFx0aWYgKHRhcmdldC55ID09PSB0aGlzLnkpIHtcclxuXHRcdFx0aWYgKGRpcmVjdGlvbiA9PT0gJ2xlZnQnKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMueCA9PT0gMCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHJldHVybiAodGFyZ2V0LnggPCB0aGlzLnggJiYgdGFyZ2V0LnggPj0gKHRoaXMueCAtIHJhbmdlKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ3JpZ2h0Jykge1xyXG5cdFx0XHRcdGlmICh0aGlzLnggPT09IGNvbmZpZy5NQVBfQ09MVU1OUyAtIDEpIHtcclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gKHRhcmdldC54ID4gdGhpcy54ICYmIHRhcmdldC54IDw9ICh0aGlzLnggKyByYW5nZSkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAodGFyZ2V0LnggPT09IHRoaXMueCkge1xyXG5cdFx0XHRpZiAoZGlyZWN0aW9uID09PSAndXAnKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMueSA9PT0gMCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHJldHVybiAodGFyZ2V0LnkgPCB0aGlzLnkgJiYgdGFyZ2V0LnkgPj0gKHRoaXMueSAtIHJhbmdlKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ2Rvd24nKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMueSA9PT0gY29uZmlnLk1BUF9ST1dTIC0gMSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHJldHVybiAodGFyZ2V0LnkgPiB0aGlzLnkgJiYgdGFyZ2V0LnkgPD0gKHRoaXMueSArIHJhbmdlKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblxyXG5cdGF0dGFjayhudW1UYXJnZXRzID0gMSwgZGlyZWN0aW9uID0gdGhpcy5kaXJlY3Rpb24pIHtcclxuXHRcdGlmICh0aGlzLmlzQXR0YWNraW5nIHx8IHRoaXMuYXR0YWNrVGltZXIgPiAwKSByZXR1cm47XHJcblxyXG5cdFx0dGhpcy5pc0F0dGFja2luZyA9IHRydWU7XHJcblxyXG5cdFx0bGV0IGFjdG9yTGlzdCA9IGdhbWUucGxheWVyTGlzdC5jb25jYXQoZ2FtZS5tYXBMaXN0W3RoaXMubWFwXS5ib3RzKTtcclxuXHRcdGxldCB0YXJnZXRMaXN0ID0gYWN0b3JMaXN0LmZpbHRlcigoYWN0b3IpID0+IHtcclxuXHRcdFx0aWYgKGFjdG9yID09PSB0aGlzIHx8IGFjdG9yLmlzRGVhZCkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRpZiAodGhpcy5jaGVja0luUmFuZ2UoZGlyZWN0aW9uLCBhY3RvciwgdGhpcy5yYW5nZSkpIHJldHVybiB0cnVlO1xyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcdHRhcmdldExpc3Quc29ydCgoYSwgYikgPT4ge1xyXG5cdFx0XHRyZXR1cm4gKGEueiAtIGIueik7XHQvLyBMb3dlc3QgdG8gaGlnaGVzdFxyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcdHRhcmdldExpc3QgPSB0YXJnZXRMaXN0LnNwbGljZSgtbnVtVGFyZ2V0cyk7XHJcblx0XHRcclxuXHRcdHRhcmdldExpc3QuZm9yRWFjaCgodGFyZ2V0KSA9PiB7XHJcblx0XHRcdHRhcmdldC50YWtlRGFtYWdlKHRoaXMuZGFtYWdlLCB0aGlzKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRcclxuXHR0YWtlRGFtYWdlKGRhbWFnZSwgc291cmNlKSB7XHJcblx0XHRkYW1hZ2UgLT0gdGhpcy5kZWZlbmNlO1xyXG5cdFx0aWYgKGRhbWFnZSA8IDApIHtcclxuXHRcdFx0ZGFtYWdlID0gMDtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHR0aGlzLmhlYWx0aCAtPSBkYW1hZ2U7XHJcblx0XHRcdGlmICh0aGlzLmhlYWx0aCA8PSAwKSB7XHJcblx0XHRcdFx0dGhpcy5zZXREZWFkKHNvdXJjZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0Y29uc29sZS5sb2coYCR7c291cmNlLm5hbWV9IGhpdHMgJHt0aGlzLm5hbWV9IGZvciAke2RhbWFnZX0gZGFtYWdlLmApO1xyXG5cdFx0fVxyXG5cclxuXHRcdG5ldyBUZXh0KHRoaXMubWFwLCB0aGlzLngsIHRoaXMueSwgZGFtYWdlLCAnI0ZGMDAwMCcsIDAsIC0xKTtcclxuXHR9XHJcblx0XHJcblx0cmVzcGF3bigpIHtcclxuXHRcdGdhbWUuc2VuZFNlcnZlck1lc3NhZ2UodGhpcy5uYW1lICsgXCIgaXMgYmFjayBmcm9tIHRoZSBkZWFkLlwiKTtcclxuXHJcblx0XHR0aGlzLm1hcCA9IHRoaXMucmVzcGF3bk1hcDtcclxuXHRcdHRoaXMueCA9IHRoaXMucmVzcGF3blg7XHJcblx0XHR0aGlzLnkgPSB0aGlzLnJlc3Bhd25ZO1xyXG5cdFx0dGhpcy5zdGFydFggPSB0aGlzLnJlc3Bhd25YO1xyXG5cdFx0dGhpcy5zdGFydFkgPSB0aGlzLnJlc3Bhd25ZO1xyXG5cdFx0dGhpcy5kZXN0aW5hdGlvblggPSB0aGlzLnJlc3Bhd25YO1xyXG5cdFx0dGhpcy5kZXN0aW5hdGlvblkgPSB0aGlzLnJlc3Bhd25ZO1xyXG5cdFx0XHJcblx0XHR0aGlzLmNhbGNCb251c1N0YXRzKCk7XHJcblx0XHR0aGlzLnJlc3RvcmUoKTtcclxuXHRcdFxyXG5cdFx0dGhpcy5pc1dhbGtpbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMuaXNSdW5uaW5nID0gZmFsc2U7XHJcblx0XHR0aGlzLmlzQXR0YWNraW5nID0gZmFsc2U7XHJcblx0XHR0aGlzLmlzRGVhZCA9IGZhbHNlO1xyXG5cdFx0dGhpcy5yZXNwYXduVGltZXIgPSAwO1xyXG5cdH1cclxuXHRcclxuXHRzZXREZWFkKHNvdXJjZSkge1xyXG5cdFx0bGV0IG1hcCA9IGdhbWUubWFwTGlzdFt0aGlzLm1hcF07XHJcblxyXG5cdFx0Ly8gSW52ZW50b3J5IEl0ZW0gRHJvcCBDaGFuY2VcclxuXHRcdGxldCBkcm9wQ2hhbmNlID0gdXRpbC5jbGFtcChtYXAuZHJvcENoYW5jZSwgMCwgMTAwKTtcclxuXHRcdGlmIChkcm9wQ2hhbmNlID4gMCkge1xyXG5cdFx0XHRsZXQgaXRlbXMgPSB0aGlzLmludmVudG9yeS5maWx0ZXIoKGl0ZW0pID0+IHtcclxuXHRcdFx0XHRpZiAoaXRlbS5zbG90IDwgY29uZmlnLklOVkVOVE9SWV9TSVpFKSByZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0aXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG5cdFx0XHRcdGlmIChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDEpIDw9IGRyb3BDaGFuY2UpIHtcclxuXHRcdFx0XHRcdHRoaXMuZHJvcEl0ZW0oaXRlbS5zbG90KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEVxdWlwcGVkIEl0ZW0gRHJvcCBBbW91bnRcclxuXHRcdGxldCBkcm9wQW1vdW50RVEgPSB1dGlsLmNsYW1wKG1hcC5kcm9wQW1vdW50RVEsIDAsIGNvbmZpZy5FUVVJUE1FTlRfU0laRSk7XHJcblx0XHRpZiAoZHJvcEFtb3VudEVRID4gMCkge1xyXG5cdFx0XHRsZXQgZXF1aXBtZW50ID0gdGhpcy5pbnZlbnRvcnkuZmlsdGVyKChpdGVtKSA9PiB7XHJcblx0XHRcdFx0aWYgKGl0ZW0uc2xvdCA+PSBjb25maWcuSU5WRU5UT1JZX1NJWkUpIHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRlcXVpcG1lbnQgPSB1dGlsLnNodWZmbGUoZXF1aXBtZW50KTtcclxuXHRcdFx0ZXF1aXBtZW50LnNwbGljZSgtZHJvcEFtb3VudEVRKTtcclxuXHRcdFx0ZXF1aXBtZW50LmZvckVhY2goKGl0ZW0pID0+IHtcclxuXHRcdFx0XHR0aGlzLmRyb3BJdGVtKGVxdWlwbWVudC5zbG90KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHRoaXMuaXNEZWFkID0gdHJ1ZTtcclxuXHRcdHRoaXMuaGVhbHRoID0gMDtcclxuXHRcdHRoaXMuZW5lcmd5ID0gMDtcclxuXHRcdHRoaXMuZGVhdGhzKys7XHJcblx0XHRcclxuXHRcdGlmIChzb3VyY2UpIHtcclxuXHRcdFx0aWYgKHNvdXJjZS5jb250cm9sbGVyID0gJ3BsYXllcicpIHtcclxuXHRcdFx0XHRnYW1lLnNlbmRTZXJ2ZXJNZXNzYWdlKHNvdXJjZS5uYW1lICsgXCIgaGFzIG11cmRlcmVkIFwiICsgdGhpcy5uYW1lICsgXCIgaW4gY29sZCBibG9vZCFcIik7XHJcblx0XHRcdFx0c291cmNlLmtpbGxzKys7XHJcblx0XHRcdFx0aWYgKHNvdXJjZS50YXJnZXQgPT09IHRoaXMpIHtcclxuXHRcdFx0XHRcdHNvdXJjZS50YXJnZXQgPSBudWxsO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRnYW1lLnNlbmRTZXJ2ZXJNZXNzYWdlKHRoaXMubmFtZSArIFwiIGhhcyBiZWVuIGtpbGxlZCBieSBcIiArIHNvdXJjZS5uYW1lICsgXCIhXCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Z2FtZS5zZW5kU2VydmVyTWVzc2FnZSh0aGlzLm5hbWUgKyBcIiBoYXMgZGllZCFcIik7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdC8vIEludmVudG9yeVxyXG5cdHBpY2tVcCgpIHtcclxuXHRcdGdhbWUubWFwTGlzdFt0aGlzLm1hcF0uaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG5cdFx0XHRpZiAoaXRlbS54ID09PSB0aGlzLnggJiYgaXRlbS55ID09PSB0aGlzLnkpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5nZXRJdGVtKGl0ZW0uaXRlbUNsYXNzLCBpdGVtLnN0YWNrKSkge1xyXG5cdFx0XHRcdFx0aXRlbS5yZW1vdmUoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHRcclxuXHRnZXRJdGVtKGl0ZW1DbGFzcywgc3RhY2spIHtcclxuXHRcdGlmIChzdGFjayA+IDApIHtcdFx0XHQvLyBTdGFja2FibGUgSXRlbXNcclxuXHRcdFx0bGV0IGVtcHR5U2xvdCA9IC0xO1xyXG5cdFx0XHRmb3IgKGxldCBzbG90ID0gMDsgc2xvdCA8IGNvbmZpZy5JTlZFTlRPUllfU0laRTsgc2xvdCsrKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuaW52ZW50b3J5W3Nsb3RdKSB7XHJcblx0XHRcdFx0XHRpZiAodGhpcy5pbnZlbnRvcnlbc2xvdF0uY2xhc3MgPT09IGl0ZW1DbGFzcykge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmludmVudG9yeVtzbG90XS5zdGFjayArPSBzdGFjaztcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2UgaWYgKGVtcHR5U2xvdCA8IDApIHtcclxuXHRcdFx0XHRcdGVtcHR5U2xvdCA9IHNsb3Q7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGlmIChzbG90ID09PSBjb25maWcuSU5WRU5UT1JZX1NJWkUgLSAxKSB7XHJcblx0XHRcdFx0XHRpZiAoZW1wdHlTbG90ID49IDAgJiYgZW1wdHlTbG90IDwgY29uZmlnLklOVkVOVE9SWV9TSVpFKSB7XHJcblx0XHRcdFx0XHRcdG5ldyBJbnZlbnRvcnlJdGVtKHRoaXMuaWQsIGVtcHR5U2xvdCwgaXRlbUNsYXNzLCBzdGFjayk7XHJcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSB7XHQvLyBJbnZlbnRvcnkgZnVsbFxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcdFx0XHQvLyBOb24tU3RhY2thYmxlIEl0ZW1cclxuXHRcdFx0Zm9yIChsZXQgc2xvdCA9IDA7IHNsb3QgPCBjb25maWcuSU5WRU5UT1JZX1NJWkU7IHNsb3QrKykge1xyXG5cdFx0XHRcdGlmICghdGhpcy5pbnZlbnRvcnlbc2xvdF0pIHtcclxuXHRcdFx0XHRcdG5ldyBJbnZlbnRvcnlJdGVtKHRoaXMuaWQsIHNsb3QsIGl0ZW1DbGFzcywgc3RhY2spO1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0aWYgKHNsb3QgPT09IGNvbmZpZy5JTlZFTlRPUllfU0laRSAtIDEpIHtcdC8vIEludmVudG9yeSBmdWxsXHJcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0ZHJvcEl0ZW0oc2xvdCkge1xyXG5cdFx0bGV0IGl0ZW0gPSB0aGlzLmludmVudG9yeVtzbG90XTtcclxuXHRcdGlmICghaXRlbSkgcmV0dXJuO1xyXG5cdFx0XHJcblx0XHRpZiAoc2xvdCA8IGNvbmZpZy5JTlZFTlRPUllfU0laRSkge1xyXG5cdFx0XHQvLyBEZXN0cm95IEludmVudG9yeSBJdGVtXHJcblx0XHRcdGl0ZW0ucmVtb3ZlKCk7XHJcblx0XHRcdFxyXG5cdFx0XHQvLyBDcmVhdGUgTWFwIEl0ZW1cclxuXHRcdFx0Z2FtZS5zcGF3bkl0ZW0odGhpcy5tYXAsIHRoaXMueCwgdGhpcy55LCBpdGVtLmNsYXNzLCBpdGVtLnN0YWNrKTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHR0aGlzLnVuZXF1aXBJdGVtKHNsb3QpO1xyXG5cdFx0XHR0aGlzLmNhbGNCb251c1N0YXRzKCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHVzZUl0ZW0oc2xvdCkge1xyXG5cdFx0bGV0IGl0ZW0gPSB0aGlzLmludmVudG9yeVtzbG90XTtcclxuXHRcdGlmICghaXRlbSkgcmV0dXJuO1xyXG5cdFx0Ly8gaWYgKCFkYi5pdGVtc1tpdGVtLmlkXS51c2UuY2FsbCh0aGlzLCBzbG90KSkgcmV0dXJuO1x0Ly8gUnVuICd1c2UnIHNjcmlwdFxyXG5cdFx0XHJcblx0XHRpZiAoaXRlbS5jaGVja0lzRXF1aXBtZW50KCkpIHtcdC8vIEVxdWlwbWVudCBJdGVtc1xyXG5cdFx0XHRpZiAoc2xvdCA8IGNvbmZpZy5JTlZFTlRPUllfU0laRSkge1x0Ly8gQ2hlY2sgaWYgaXRlbSBpcyBlcXVpcHBlZFxyXG5cdFx0XHRcdHRoaXMuZXF1aXBJdGVtKHNsb3QpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMudW5lcXVpcEl0ZW0oc2xvdCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2Uge1x0Ly8gTm9uLUVxdWlwbWVudCBJdGVtc1xyXG5cdFx0XHRpZiAoIWl0ZW0ucmV1c2FibGUpIHtcclxuXHRcdFx0XHRpZiAoaXRlbS5zdGFjayA+IDEpIHtcclxuXHRcdFx0XHRcdGl0ZW0uc3RhY2stLTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRpdGVtLnJlbW92ZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRoYXNJdGVtKGl0ZW1DbGFzcykge1xyXG5cdFx0bGV0IGNvdW50ID0gMDtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY29uZmlnLklOVkVOVE9SWV9TSVpFOyBpKyspIHtcclxuXHRcdFx0aWYgKHRoaXMuaW52ZW50b3J5W2ldKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuaW52ZW50b3J5W2ldLmNsYXNzID09PSBpdGVtQ2xhc3MpIHtcclxuXHRcdFx0XHRcdGNvdW50Kys7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY291bnQ7XHJcblx0fVxyXG5cdFxyXG5cdG1vdmVJdGVtVG9TbG90KHNsb3QsIG5ld1Nsb3QpIHtcclxuXHRcdGlmICghc2xvdCB8fCAhbmV3U2xvdCkgcmV0dXJuO1xyXG5cdFx0aWYgKHNsb3QgPT09IG5ld1Nsb3QpIHJldHVybjtcclxuXHJcblx0XHRsZXQgaXRlbSA9IHRoaXMuaW52ZW50b3J5W3Nsb3RdO1xyXG5cdFx0bGV0IG5ld0l0ZW0gPSB0aGlzLmludmVudG9yeVtuZXdTbG90XTtcclxuXHJcblx0XHRpZiAoaXRlbSkge1xyXG5cdFx0XHRpZiAobmV3SXRlbSkge1xyXG5cdFx0XHRcdGlmIChzbG90ID49IGNvbmZpZy5JTlZFTlRPUllfU0laRSkge1xyXG5cdFx0XHRcdFx0aWYgKG5ld1Nsb3QgPj0gY29uZmlnLklOVkVOVE9SWV9TSVpFKSB7XHJcblx0XHRcdFx0XHRcdGlmIChuZXdJdGVtLnR5cGUgPT09IGl0ZW0udHlwZSkge1xyXG5cdFx0XHRcdFx0XHRcdGl0ZW0uc2xvdCA9IG5ld1Nsb3Q7XHJcblx0XHRcdFx0XHRcdFx0bmV3SXRlbS5zbG90ID0gc2xvdDtcclxuXHRcdFx0XHRcdFx0XHR1dGlsLnN3YXAodGhpcy5pbnZlbnRvcnksIHNsb3QsIG5ld1Nsb3QpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdGdhbWUuc2VuZFBsYXllck1lc3NhZ2UodGhpcy5pZCwgXCJUaGF0IGNhbm5vdCBiZSBlcXVpcHBlZCB0aGVyZS5cIik7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRpZiAobmV3SXRlbS50eXBlID09PSBpdGVtLnR5cGUpIHtcclxuXHRcdFx0XHRcdFx0XHRpdGVtLmVxdWlwcGVkID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdFx0bmV3SXRlbS5lcXVpcHBlZCA9IHRydWU7XHJcblx0XHRcdFx0XHRcdFx0aXRlbS5zbG90ID0gbmV3U2xvdDtcclxuXHRcdFx0XHRcdFx0XHRuZXdJdGVtLnNsb3QgPSBzbG90O1xyXG5cdFx0XHRcdFx0XHRcdHV0aWwuc3dhcCh0aGlzLmludmVudG9yeSwgc2xvdCwgbmV3U2xvdCk7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5jYWxjQm9udXNTdGF0cygpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdG5ld1Nsb3QgPSB0aGlzLmZpbmRGaXJzdEVtcHR5U2xvdCgpO1xyXG5cdFx0XHRcdFx0XHRcdGlmIChuZXdTbG90KSB7XHJcblx0XHRcdFx0XHRcdFx0XHRpdGVtLmVxdWlwcGVkID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdFx0XHRpdGVtLnNsb3QgPSBuZXdTbG90O1xyXG5cdFx0XHRcdFx0XHRcdFx0dXRpbC5zd2FwKHRoaXMuaW52ZW50b3J5LCBzbG90LCBuZXdTbG90KTtcclxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuY2FsY0JvbnVzU3RhdHMoKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRnYW1lLnNlbmRQbGF5ZXJNZXNzYWdlKHRoaXMuaWQsIFwiWW91ciBpbnZlbnRvcnkgaXMgZnVsbC5cIik7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0aWYgKG5ld1Nsb3QgPj0gY29uZmlnLklOVkVOVE9SWV9TSVpFKSB7XHJcblx0XHRcdFx0XHRcdGlmIChuZXdJdGVtLnR5cGUgPT09IGl0ZW0udHlwZSkge1xyXG5cdFx0XHRcdFx0XHRcdGl0ZW0uZXF1aXBwZWQgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRcdG5ld0l0ZW0uZXF1aXBwZWQgPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0XHRpdGVtLnNsb3QgPSBuZXdTbG90O1xyXG5cdFx0XHRcdFx0XHRcdG5ld0l0ZW0uc2xvdCA9IHNsb3Q7XHJcblx0XHRcdFx0XHRcdFx0dXRpbC5zd2FwKHRoaXMuaW52ZW50b3J5LCBzbG90LCBuZXdTbG90KTtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmNhbGNCb251c1N0YXRzKCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0Z2FtZS5zZW5kUGxheWVyTWVzc2FnZSh0aGlzLmlkLCBcIlRoYXQgY2Fubm90IGJlIGVxdWlwcGVkIHRoZXJlLlwiKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdGl0ZW0uc2xvdCA9IG5ld1Nsb3Q7XHJcblx0XHRcdFx0XHRcdG5ld0l0ZW0uc2xvdCA9IHNsb3Q7XHJcblx0XHRcdFx0XHRcdHV0aWwuc3dhcCh0aGlzLmludmVudG9yeSwgc2xvdCwgbmV3U2xvdCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdGlmIChzbG90ID49IGNvbmZpZy5JTlZFTlRPUllfU0laRSkge1xyXG5cdFx0XHRcdFx0aWYgKG5ld1Nsb3QgPj0gY29uZmlnLklOVkVOVE9SWV9TSVpFKSB7XHJcblx0XHRcdFx0XHRcdGlmIChuZXdTbG90ID09PSBpdGVtLmZpbmRFcXVpcG1lbnRTbG90KCkpIHtcclxuXHRcdFx0XHRcdFx0XHRpdGVtLnNsb3QgPSBuZXdTbG90O1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuaW52ZW50b3J5W25ld1Nsb3RdID0gaXRlbTtcclxuXHRcdFx0XHRcdFx0XHRkZWxldGUgdGhpcy5pbnZlbnRvcnlbc2xvdF07XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0Z2FtZS5zZW5kUGxheWVyTWVzc2FnZSh0aGlzLmlkLCBcIlRoYXQgY2Fubm90IGJlIGVxdWlwcGVkIHRoZXJlLlwiKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdGl0ZW0uZXF1aXBwZWQgPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0aXRlbS5zbG90ID0gbmV3U2xvdDtcclxuXHRcdFx0XHRcdFx0dGhpcy5pbnZlbnRvcnlbbmV3U2xvdF0gPSBpdGVtO1xyXG5cdFx0XHRcdFx0XHRkZWxldGUgdGhpcy5pbnZlbnRvcnlbc2xvdF07XHJcblx0XHRcdFx0XHRcdHRoaXMuY2FsY0JvbnVzU3RhdHMoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRpZiAobmV3U2xvdCA+PSBjb25maWcuSU5WRU5UT1JZX1NJWkUpIHtcclxuXHRcdFx0XHRcdFx0aWYgKG5ld1Nsb3QgPT09IGl0ZW0uZmluZEVxdWlwbWVudFNsb3QoKSkge1xyXG5cdFx0XHRcdFx0XHRcdGl0ZW0uZXF1aXBwZWQgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRcdGl0ZW0uc2xvdCA9IG5ld1Nsb3Q7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5pbnZlbnRvcnlbbmV3U2xvdF0gPSBpdGVtO1xyXG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSB0aGlzLmludmVudG9yeVtzbG90XTtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmNhbGNCb251c1N0YXRzKCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0Z2FtZS5zZW5kUGxheWVyTWVzc2FnZSh0aGlzLmlkLCBcIlRoYXQgY2Fubm90IGJlIGVxdWlwcGVkIHRoZXJlLlwiKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdGl0ZW0uc2xvdCA9IG5ld1Nsb3Q7XHJcblx0XHRcdFx0XHRcdHRoaXMuaW52ZW50b3J5W25ld1Nsb3RdID0gaXRlbTtcclxuXHRcdFx0XHRcdFx0ZGVsZXRlIHRoaXMuaW52ZW50b3J5W3Nsb3RdO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZXF1aXBJdGVtKHNsb3QpIHtcclxuXHRcdGxldCBuZXdTbG90ID0gaXRlbS5maW5kRXF1aXBtZW50U2xvdCgpO1xyXG5cdFx0dGhpcy5tb3ZlSXRlbVRvU2xvdChzbG90LCBuZXdTbG90KTtcclxuXHRcdHRoaXMuY2FsY0JvbnVzU3RhdHMoKTtcclxuXHR9XHJcblxyXG5cdHVuZXF1aXBJdGVtKHNsb3QpIHtcclxuXHRcdGxldCBpdGVtID0gdGhpcy5pbnZlbnRvcnlbc2xvdF07XHJcblx0XHRpZiAoIWl0ZW0pIHJldHVybjtcclxuXHRcdFxyXG5cdFx0aWYgKGl0ZW0uc2xvdCA+PSBjb25maWcuSU5WRU5UT1JZX1NJWkUpIHtcclxuXHRcdFx0bGV0IG5ld1Nsb3QgPSB0aGlzLmZpbmRGaXJzdEVtcHR5U2xvdCgpO1xyXG5cdFx0XHRpZiAobmV3U2xvdCA9PT0gbnVsbCkge1xyXG5cdFx0XHRcdGdhbWUuc2VuZFBsYXllck1lc3NhZ2UodGhpcy5pZCwgXCJZb3VyIGludmVudG9yeSBpcyBmdWxsLlwiKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHR0aGlzLm1vdmVJdGVtVG9TbG90KHNsb3QsIG5ld1Nsb3QpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGZpbmRGaXJzdEVtcHR5U2xvdCgpIHtcclxuXHRcdGZvciAobGV0IHNsb3QgPSAwOyBzbG90IDwgY29uZmlnLklOVkVOVE9SWV9TSVpFOyBzbG90KyspIHtcclxuXHRcdFx0aWYgKCF0aGlzLmludmVudG9yeVtzbG90XSkgcmV0dXJuIHNsb3Q7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9XHJcblxyXG5cclxuXHR1cGRhdGUoZGVsdGEpIHtcclxuXHRcdC8vIEludmVudG9yeSBJdGVtIFVwZGF0ZVxyXG5cdFx0dGhpcy5pbnZlbnRvcnkuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG5cdFx0XHRpdGVtLnVwZGF0ZSgpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0Ly8gUmVzcGF3bmluZ1xyXG5cdFx0aWYgKHRoaXMuaXNEZWFkKSB7XHJcblx0XHRcdHRoaXMucmVzcGF3blRpbWVyICs9IGRlbHRhO1xyXG5cdFx0XHRpZiAodGhpcy5yZXNwYXduVGltZXIgPj0gdGhpcy5yZXNwYXduU3BlZWQpIHtcclxuXHRcdFx0XHR0aGlzLnJlc3Bhd24oKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vIEF0dGFja2luZ1xyXG5cdFx0aWYgKHRoaXMuaXNBdHRhY2tpbmcgfHwgdGhpcy5hdHRhY2tUaW1lciA+IDApIHtcclxuXHRcdFx0dGhpcy5hdHRhY2tUaW1lciArPSBkZWx0YTtcclxuXHRcdFx0aWYgKHRoaXMuYXR0YWNrVGltZXIgPj0gMC4zKSB7XHJcblx0XHRcdFx0dGhpcy5pc0F0dGFja2luZyA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh0aGlzLmF0dGFja1RpbWVyID49IHRoaXMuYXR0YWNrU3BlZWQpIHtcclxuXHRcdFx0XHR0aGlzLmF0dGFja1RpbWVyID0gMDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBNb3ZlbWVudFxyXG5cdFx0aWYgKHRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0dGhpcy5sZXJwICs9IGRlbHRhICogdGhpcy5tb3ZlU3BlZWQ7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAodGhpcy5sZXJwID49IDAuNDkpIHtcclxuXHRcdFx0XHR0aGlzLnggPSB0aGlzLmRlc3RpbmF0aW9uWDtcclxuXHRcdFx0XHR0aGlzLnkgPSB0aGlzLmRlc3RpbmF0aW9uWTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0aWYgKHRoaXMubGVycCA+PSAwLjk5KSB7XHJcblx0XHRcdFx0dGhpcy5zdGFydFggPSB0aGlzLmRlc3RpbmF0aW9uWDtcclxuXHRcdFx0XHR0aGlzLnN0YXJ0WSA9IHRoaXMuZGVzdGluYXRpb25ZO1xyXG5cdFx0XHRcdHRoaXMubGVycCA9IDA7XHJcblx0XHRcdFx0dGhpcy5pc01vdmluZyA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbiIsImltcG9ydCBkYiBmcm9tICcuLi9kYi5qcyc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4uL2dhbWUuanMnO1xyXG5pbXBvcnQgY29uZmlnIGZyb20gJy4uL2NvbmZpZy5qcyc7XHJcbmltcG9ydCB1dGlsIGZyb20gJy4uL3V0aWwuanMnO1xyXG5pbXBvcnQgRW50aXR5IGZyb20gJy4vZW50aXR5LmpzJztcclxuaW1wb3J0IFRleHQgZnJvbSAnLi90ZXh0LmpzJztcclxuXHJcbi8vIEFuIEFjdG9yIGlzIGFuIEVudGl0eSB3aGljaCBjYW4gbW92ZSwgYXR0YWNrIGFuZCBpbnRlcmFjdCB3aXRoIGl0ZW1zXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBY3RvciBleHRlbmRzIEVudGl0eSB7XHJcblx0Y29uc3RydWN0b3IobWFwLCB4LCB5LCBuYW1lLCBzcHJpdGUpIHtcclxuXHRcdHNwcml0ZSA9IHV0aWwuY2xhbXAoc3ByaXRlLCAxLCBjb25maWcuTUFYX1NQUklURVMpO1xyXG5cclxuXHRcdHN1cGVyKG1hcCwgeCwgeSwgc3ByaXRlKTtcclxuXHRcdHRoaXMuY29udHJvbGxlciA9ICdib3QnO1xyXG5cdFx0dGhpcy5uYW1lID0gbmFtZTtcclxuXHJcblx0XHR0aGlzLmludmVudG9yeSA9IFtdO1xyXG5cclxuXHRcdHRoaXMuY2FsY1N0YXRzKCk7XHJcblx0XHR0aGlzLnJlc3RvcmUoKTtcclxuXHJcblx0XHR0aGlzLmRpcmVjdGlvbiA9ICdkb3duJztcclxuXHRcdHRoaXMuc3RhcnRYID0gdGhpcy54O1xyXG5cdFx0dGhpcy5zdGFydFkgPSB0aGlzLnk7XHJcblx0XHR0aGlzLmRlc3RpbmF0aW9uWCA9IHRoaXMueDtcclxuXHRcdHRoaXMuZGVzdGluYXRpb25ZID0gdGhpcy55O1xyXG5cdFx0dGhpcy5sZXJwID0gMDtcclxuXHJcblx0XHR0aGlzLmlzTW92aW5nID0gZmFsc2U7XHJcblx0XHR0aGlzLmlzUnVubmluZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy5tb3ZlU3BlZWQgPSAyLjU7XHJcblx0XHR0aGlzLm1vdmVtZW50VGltZXIgPSAwO1xyXG5cdFx0dGhpcy5sYXppbmVzcyA9IDA7XHJcblxyXG5cdFx0dGhpcy5pc0F0dGFja2luZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy5hdHRhY2tTcGVlZCA9IDE7XHJcblx0XHR0aGlzLmF0dGFja1RpbWVyID0gMDtcdFxyXG5cdFx0dGhpcy50YXJnZXQgPSBudWxsO1xyXG5cdFx0dGhpcy5raWxscyA9IDA7XHJcblx0XHR0aGlzLmRlYXRocyA9IDA7XHJcblxyXG5cdFx0dGhpcy5pc0RlYWQgPSBmYWxzZTtcclxuXHRcdHRoaXMucmVzcGF3blRpbWVyID0gMDtcclxuXHRcdHRoaXMucmVzcGF3blNwZWVkID0gMTA7XHJcblx0XHR0aGlzLnJlc3Bhd25NYXAgPSBtYXA7XHJcblx0XHR0aGlzLnJlc3Bhd25YID0geDtcclxuXHRcdHRoaXMucmVzcGF3blkgPSB5O1xyXG5cdH1cclxuXHRcclxuXHQvLyBDaGFyYWN0ZXIgU3RhdHNcclxuXHRnZXQgZGFtYWdlKCkge1xyXG5cdFx0aWYgKHRoaXMuZGFtYWdlQmFzZSArIHRoaXMuZGFtYWdlQm9udXMgPCAwKSB7XHJcblx0XHRcdHJldHVybiAwO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmRhbWFnZUJhc2UgKyB0aGlzLmRhbWFnZUJvbnVzO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRnZXQgZGVmZW5jZSgpIHtcclxuXHRcdGlmICh0aGlzLmRlZmVuY2VCYXNlICsgdGhpcy5kZWZlbmNlQm9udXMgPCAwKSB7XHJcblx0XHRcdHJldHVybiAwO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmRlZmVuY2VCYXNlICsgdGhpcy5kZWZlbmNlQm9udXM7XHJcblx0XHR9XHJcblx0fVxyXG5cdGdldCBoZWFsdGhNYXgoKSB7XHJcblx0XHRpZiAodGhpcy5oZWFsdGhNYXhCYXNlICsgdGhpcy5oZWFsdGhNYXhCb251cyA8IDEpIHtcclxuXHRcdFx0cmV0dXJuIDE7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuaGVhbHRoTWF4QmFzZSArIHRoaXMuaGVhbHRoTWF4Qm9udXM7XHJcblx0XHR9XHJcblx0fVxyXG5cdGdldCBlbmVyZ3lNYXgoKSB7XHJcblx0XHRpZiAodGhpcy5lbmVyZ3lNYXhCYXNlICsgdGhpcy5lbmVyZ3lNYXhCb251cyA8IDApIHtcclxuXHRcdFx0cmV0dXJuIDA7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuZW5lcmd5TWF4QmFzZSArIHRoaXMuZW5lcmd5TWF4Qm9udXM7XHJcblx0XHR9XHJcblx0fVxyXG5cdGdldCByYW5nZSgpIHtcclxuXHRcdGlmICh0aGlzLnJhbmdlQmFzZSArIHRoaXMucmFuZ2VCb251cyA8IDEpIHtcclxuXHRcdFx0cmV0dXJuIDE7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMucmFuZ2VCYXNlICsgdGhpcy5yYW5nZUJvbnVzO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Y2FsY0Jhc2VTdGF0cygpIHtcdC8vIENsYXNzIGFuZCBMZXZlbFxyXG5cdFx0Ly9UT0RPOiBjaGVjayBkYiBmb3IgY2xhc3Mgc3RhdHM6IGJhc2UgYW5kIGluY3JlYXNlIHBlciBsZXZlbFxyXG5cdFx0Ly8gdGhpcy5kYW1hZ2VCYXNlID0gY2xhc3MuYmFzZS5kYW1hZ2UgKyAoY2xhc3MuaW5jcmVhc2VQZXJMZXZlbC5kYW1hZ2UgKiB0aGlzLmxldmVsKTtcclxuXHRcdHRoaXMuZGFtYWdlQmFzZSA9IDU7XHJcblx0XHR0aGlzLmRlZmVuY2VCYXNlID0gMDtcclxuXHRcdHRoaXMuaGVhbHRoTWF4QmFzZSA9IDEwO1xyXG5cdFx0dGhpcy5lbmVyZ3lNYXhCYXNlID0gNDA7XHJcblx0XHR0aGlzLnJhbmdlQmFzZSA9IDE7XHJcblx0fVxyXG5cclxuXHRjYWxjQm9udXNTdGF0cygpIHtcdC8vIEl0ZW1zIChlcXVpcHBlZCBhbmQgcGFzc2l2ZSkgYW5kIEVmZmVjdHMgKHNwZWxscyBhbmQgcG90aW9ucylcclxuXHRcdGxldCBpdGVtQm9udXMgPSB0aGlzLmNhbGNJdGVtQm9udXMoKTtcclxuXHRcdGxldCBlZmZlY3RCb251cyA9IHRoaXMuY2FsY0VmZmVjdEJvbnVzKCk7XHJcblxyXG5cdFx0dGhpcy5kYW1hZ2VCb251cyA9IGl0ZW1Cb251cy5kYW1hZ2UgKyBlZmZlY3RCb251cy5kYW1hZ2U7XHJcblx0XHR0aGlzLmRlZmVuY2VCb251cyA9IGl0ZW1Cb251cy5kZWZlbmNlICsgZWZmZWN0Qm9udXMuZGVmZW5jZTtcclxuXHRcdHRoaXMuaGVhbHRoTWF4Qm9udXMgPSBpdGVtQm9udXMuaGVhbHRoTWF4ICsgZWZmZWN0Qm9udXMuaGVhbHRoTWF4O1xyXG5cdFx0dGhpcy5lbmVyZ3lNYXhCb251cyA9IGl0ZW1Cb251cy5lbmVyZ3lNYXggKyBlZmZlY3RCb251cy5lbmVyZ3lNYXg7XHJcblx0XHR0aGlzLnJhbmdlQm9udXMgPSBpdGVtQm9udXMucmFuZ2UgKyBlZmZlY3RCb251cy5yYW5nZTtcclxuXHR9XHJcblxyXG5cdGNhbGNTdGF0cygpIHtcclxuXHRcdHRoaXMuY2FsY0Jhc2VTdGF0cygpO1xyXG5cdFx0dGhpcy5jYWxjQm9udXNTdGF0cygpO1xyXG5cdH1cclxuXHJcblx0Y2FsY0l0ZW1Cb251cygpIHtcclxuXHRcdGxldCBpdGVtQm9udXMgPSB7XHJcblx0XHRcdGRhbWFnZTogMCxcclxuXHRcdFx0ZGVmZW5jZTogMCxcclxuXHRcdFx0aGVhbHRoTWF4OiAwLFxyXG5cdFx0XHRlbmVyZ3lNYXg6IDAsXHJcblx0XHRcdHJhbmdlOiAwXHJcblx0XHR9O1xyXG5cclxuXHRcdC8vIEZvciBlYWNoIGl0ZW0gaW4gaW52ZW50b3J5IGNoZWNrIGZvciBib251c2VzXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IChjb25maWcuSU5WRU5UT1JZX1NJWkUgKyBjb25maWcuRVFVSVBNRU5UX1NJWkUpOyBpKyspIHtcclxuXHRcdFx0bGV0IGl0ZW0gPSB0aGlzLmludmVudG9yeVtpXTtcclxuXHRcdFx0aWYgKGl0ZW0gJiYgIWl0ZW0ucmVtb3ZlKSB7XHJcblx0XHRcdFx0aXRlbUJvbnVzLmRhbWFnZSArPSBpdGVtLnBhc3NpdmVEYW1hZ2U7XHJcblx0XHRcdFx0aXRlbUJvbnVzLmRlZmVuY2UgKz0gaXRlbS5wYXNzaXZlRGVmZW5jZTtcclxuXHRcdFx0XHRpdGVtQm9udXMuaGVhbHRoTWF4ICs9IGl0ZW0ucGFzc2l2ZUhlYWx0aE1heDtcclxuXHRcdFx0XHRpdGVtQm9udXMuZW5lcmd5TWF4ICs9IGl0ZW0ucGFzc2l2ZUVuZXJneU1heDtcclxuXHRcdFx0XHRpdGVtQm9udXMucmFuZ2UgKz0gaXRlbS5wYXNzaXZlUmFuZ2U7XHJcblxyXG5cdFx0XHRcdGlmIChpID49IGNvbmZpZy5JTlZFTlRPUllfU0laRSkge1xyXG5cdFx0XHRcdFx0aXRlbUJvbnVzLmRhbWFnZSArPSBpdGVtLmVxdWlwRGFtYWdlO1xyXG5cdFx0XHRcdFx0aXRlbUJvbnVzLmRlZmVuY2UgKz0gaXRlbS5lcXVpcERlZmVuY2U7XHJcblx0XHRcdFx0XHRpdGVtQm9udXMuaGVhbHRoTWF4ICs9IGl0ZW0uZXF1aXBIZWFsdGhNYXg7XHJcblx0XHRcdFx0XHRpdGVtQm9udXMuZW5lcmd5TWF4ICs9IGl0ZW0uZXF1aXBFbmVyZ3lNYXg7XHJcblx0XHRcdFx0XHRpdGVtQm9udXMucmFuZ2UgKz0gaXRlbS5lcXVpcFJhbmdlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gaXRlbUJvbnVzO1xyXG5cdH1cclxuXHJcblx0Y2FsY0VmZmVjdEJvbnVzKCkge1xyXG5cdFx0bGV0IGVmZmVjdEJvbnVzID0ge1xyXG5cdFx0XHRkYW1hZ2U6IDAsXHJcblx0XHRcdGRlZmVuY2U6IDAsXHJcblx0XHRcdGhlYWx0aE1heDogMCxcclxuXHRcdFx0ZW5lcmd5TWF4OiAwLFxyXG5cdFx0XHRyYW5nZTogMFxyXG5cdFx0fTtcclxuXHJcblx0XHQvLyBUT0RPOiB3b3JrIG91dCBob3cgdG8gZG8gZWZmZWN0cyBmb3Igc3BlbGxzIGFuZCBwb3Rpb25zXHJcblx0XHRyZXR1cm4gZWZmZWN0Qm9udXM7XHJcblx0fVxyXG5cclxuXHRyZXN0b3JlKCkge1xyXG5cdFx0dGhpcy5oZWFsdGggPSB0aGlzLmhlYWx0aE1heDtcclxuXHRcdHRoaXMuZW5lcmd5ID0gdGhpcy5lbmVyZ3lNYXg7XHJcblx0fVxyXG5cdFxyXG5cdC8vIE1vdmVtZW50XHJcblx0bW92ZShkaXJlY3Rpb24pIHtcclxuXHRcdGlmICh0aGlzLmlzTW92aW5nKSByZXR1cm47XHJcblxyXG5cdFx0aWYgKGRpcmVjdGlvbikge1xyXG5cdFx0XHR0aGlzLmRpcmVjdGlvbiA9IGRpcmVjdGlvbjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoZGlyZWN0aW9uID09PSAnbGVmdCcpIHtcclxuXHRcdFx0aWYgKCFnYW1lLmNoZWNrVmFjYW50KHRoaXMubWFwLCB0aGlzLnggLSAxLCB0aGlzLnkpKSByZXR1cm47XHJcblx0XHRcdHRoaXMuZGVzdGluYXRpb25YLS07XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdyaWdodCcpIHtcclxuXHRcdFx0aWYgKCFnYW1lLmNoZWNrVmFjYW50KHRoaXMubWFwLCB0aGlzLnggKyAxLCB0aGlzLnkpKSByZXR1cm47XHJcblx0XHRcdHRoaXMuZGVzdGluYXRpb25YKys7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChkaXJlY3Rpb24gPT09ICd1cCcpIHtcclxuXHRcdFx0aWYgKCFnYW1lLmNoZWNrVmFjYW50KHRoaXMubWFwLCB0aGlzLngsIHRoaXMueSAtIDEpKSByZXR1cm47XHJcblx0XHRcdHRoaXMuZGVzdGluYXRpb25ZLS07XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdkb3duJykge1xyXG5cdFx0XHRpZiAoIWdhbWUuY2hlY2tWYWNhbnQodGhpcy5tYXAsIHRoaXMueCwgdGhpcy55ICsgMSkpIHJldHVybjtcclxuXHRcdFx0dGhpcy5kZXN0aW5hdGlvblkrKztcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRzd2l0Y2ggKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICh0aGlzLmxhemluZXNzICsgMykpKSB7XHJcblx0XHRcdFx0Y2FzZSAwOiB0aGlzLm1vdmUoJ2xlZnQnKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIDE6IHRoaXMubW92ZSgncmlnaHQnKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIDI6IHRoaXMubW92ZSgndXAnKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIDM6IHRoaXMubW92ZSgnZG93bicpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGRlZmF1bHQ6IC8vIERvbid0IE1vdmVcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gU2V0IG1vdmUgc3BlZWRcclxuXHRcdGlmICh0aGlzLmlzUnVubmluZykge1xyXG5cdFx0XHRpZiAodGhpcy5lbmVyZ3kgPiAwKSB7XHJcblx0XHRcdFx0dGhpcy5lbmVyZ3ktLTtcclxuXHRcdFx0XHR0aGlzLm1vdmVTcGVlZCA9IDQ7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5lbmVyZ3kgPSAwO1xyXG5cdFx0XHRcdHRoaXMubW92ZVNwZWVkID0gMi41O1xyXG5cdFx0XHRcdHRoaXMuaXNSdW5uaW5nID0gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHR0aGlzLm1vdmVTcGVlZCA9IDIuNTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dGhpcy5pc01vdmluZyA9IHRydWU7XHJcblx0fVxyXG5cdFxyXG5cdG1vdmVUb1RhcmdldCh0YXJnZXQsIGhvc3RpbGUpIHtcclxuXHRcdGlmICghdGFyZ2V0KSByZXR1cm47XHJcblx0XHRcclxuXHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICYmIHRhcmdldC55ID09PSB0aGlzLnkpIHtcclxuXHRcdFx0dGhpcy5tb3ZlKCk7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyID09PSAwKSkge1xyXG5cdFx0XHRpZiAodGFyZ2V0LnggPCB0aGlzLngpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LnggPj0gKHRoaXMueCAtIHRoaXMucmFuZ2UpICYmIHRhcmdldC55ID09PSB0aGlzLnkpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ2xlZnQnO1xyXG5cdFx0XHRcdFx0XHRpZiAoIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmF0dGFjaygnbGVmdCcpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCdsZWZ0Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHRhcmdldC54ID4gdGhpcy54KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggKyB0aGlzLnJhbmdlICYmIHRhcmdldC55ID09PSB0aGlzLnkpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ3JpZ2h0JztcclxuXHRcdFx0XHRcdFx0aWYgKCF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ3JpZ2h0Jyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ3JpZ2h0Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHRhcmdldC55IDwgdGhpcy55KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggJiYgdGFyZ2V0LnkgPT09IHRoaXMueSAtIHRoaXMucmFuZ2UpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ3VwJztcclxuXHRcdFx0XHRcdFx0aWYgKCF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ3VwJyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ3VwJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHRhcmdldC55ID4gdGhpcy55KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggJiYgdGFyZ2V0LnkgPT09IHRoaXMueSArIHRoaXMucmFuZ2UpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ2Rvd24nO1xyXG5cdFx0XHRcdFx0XHRpZiAoIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmF0dGFjaygnZG93bicpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCdkb3duJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0aWYgKHRhcmdldC55ID4gdGhpcy55KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggJiYgdGFyZ2V0LnkgPT09IHRoaXMueSArIHRoaXMucmFuZ2UpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlKSB7XHJcblx0XHRcdFx0XHRcdGlmICghdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCdkb3duJyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ2Rvd24nKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodGFyZ2V0LnkgPCB0aGlzLnkpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LnggPT09IHRoaXMueCAmJiB0YXJnZXQueSA9PT0gdGhpcy55IC0gdGhpcy5yYW5nZSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUpIHtcclxuXHRcdFx0XHRcdFx0aWYgKCF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ3VwJyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ3VwJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHRhcmdldC54ID4gdGhpcy54KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggKyB0aGlzLnJhbmdlICYmIHRhcmdldC55ID09PSB0aGlzLnkpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlKSB7XHJcblx0XHRcdFx0XHRcdGlmICghdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCdyaWdodCcpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCdyaWdodCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICh0YXJnZXQueCA8IHRoaXMueCkge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQueCA+PSAodGhpcy54IC0gdGhpcy5yYW5nZSkgJiYgdGFyZ2V0LnkgPT09IHRoaXMueSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUpIHtcclxuXHRcdFx0XHRcdFx0aWYgKCF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ2xlZnQnKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSgnbGVmdCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHQvLyBDb21iYXRcclxuXHRjaGVja0luUmFuZ2UoZGlyZWN0aW9uLCB0YXJnZXQsIHJhbmdlKSB7XHJcblx0XHRpZiAodGFyZ2V0Lm1hcCAhPT0gdGhpcy5tYXApIHJldHVybiBmYWxzZTtcclxuXHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICYmIHRhcmdldC55ID09PSB0aGlzLnkpIHJldHVybiBmYWxzZTtcdC8vIFN0YWNrZWQgZG9lcyBub3QgY291bnQgYXMgaW4gcmFuZ2VcclxuXHRcdFxyXG5cdFx0aWYgKHRhcmdldC55ID09PSB0aGlzLnkpIHtcclxuXHRcdFx0aWYgKGRpcmVjdGlvbiA9PT0gJ2xlZnQnKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMueCA9PT0gMCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHJldHVybiAodGFyZ2V0LnggPCB0aGlzLnggJiYgdGFyZ2V0LnggPj0gKHRoaXMueCAtIHJhbmdlKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ3JpZ2h0Jykge1xyXG5cdFx0XHRcdGlmICh0aGlzLnggPT09IGNvbmZpZy5NQVBfQ09MVU1OUyAtIDEpIHtcclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gKHRhcmdldC54ID4gdGhpcy54ICYmIHRhcmdldC54IDw9ICh0aGlzLnggKyByYW5nZSkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAodGFyZ2V0LnggPT09IHRoaXMueCkge1xyXG5cdFx0XHRpZiAoZGlyZWN0aW9uID09PSAndXAnKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMueSA9PT0gMCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHJldHVybiAodGFyZ2V0LnkgPCB0aGlzLnkgJiYgdGFyZ2V0LnkgPj0gKHRoaXMueSAtIHJhbmdlKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ2Rvd24nKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMueSA9PT0gY29uZmlnLk1BUF9ST1dTIC0gMSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHJldHVybiAodGFyZ2V0LnkgPiB0aGlzLnkgJiYgdGFyZ2V0LnkgPD0gKHRoaXMueSArIHJhbmdlKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblxyXG5cdGF0dGFjayhudW1UYXJnZXRzID0gMSwgZGlyZWN0aW9uID0gdGhpcy5kaXJlY3Rpb24pIHtcclxuXHRcdGlmICh0aGlzLmlzQXR0YWNraW5nIHx8IHRoaXMuYXR0YWNrVGltZXIgPiAwKSByZXR1cm47XHJcblxyXG5cdFx0dGhpcy5pc0F0dGFja2luZyA9IHRydWU7XHJcblxyXG5cdFx0bGV0IGFjdG9yTGlzdCA9IGdhbWUucGxheWVyTGlzdC5jb25jYXQoZ2FtZS5tYXBMaXN0W3RoaXMubWFwXS5ib3RzKTtcclxuXHRcdGxldCB0YXJnZXRMaXN0ID0gYWN0b3JMaXN0LmZpbHRlcigoYWN0b3IpID0+IHtcclxuXHRcdFx0aWYgKGFjdG9yID09PSB0aGlzIHx8IGFjdG9yLmlzRGVhZCkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRpZiAodGhpcy5jaGVja0luUmFuZ2UoZGlyZWN0aW9uLCBhY3RvciwgdGhpcy5yYW5nZSkpIHJldHVybiB0cnVlO1xyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcdHRhcmdldExpc3Quc29ydCgoYSwgYikgPT4ge1xyXG5cdFx0XHRyZXR1cm4gKGEueiAtIGIueik7XHQvLyBMb3dlc3QgdG8gaGlnaGVzdFxyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcdHRhcmdldExpc3QgPSB0YXJnZXRMaXN0LnNwbGljZSgtbnVtVGFyZ2V0cyk7XHJcblx0XHRcclxuXHRcdHRhcmdldExpc3QuZm9yRWFjaCgodGFyZ2V0KSA9PiB7XHJcblx0XHRcdHRhcmdldC50YWtlRGFtYWdlKHRoaXMuZGFtYWdlLCB0aGlzKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRcclxuXHR0YWtlRGFtYWdlKGRhbWFnZSwgc291cmNlKSB7XHJcblx0XHRkYW1hZ2UgLT0gdGhpcy5kZWZlbmNlO1xyXG5cdFx0aWYgKGRhbWFnZSA8IDApIHtcclxuXHRcdFx0ZGFtYWdlID0gMDtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHR0aGlzLmhlYWx0aCAtPSBkYW1hZ2U7XHJcblx0XHRcdGlmICh0aGlzLmhlYWx0aCA8PSAwKSB7XHJcblx0XHRcdFx0dGhpcy5zZXREZWFkKHNvdXJjZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0Y29uc29sZS5sb2coYCR7c291cmNlLm5hbWV9IGhpdHMgJHt0aGlzLm5hbWV9IGZvciAke2RhbWFnZX0gZGFtYWdlLmApO1xyXG5cdFx0fVxyXG5cclxuXHRcdG5ldyBUZXh0KHRoaXMubWFwLCB0aGlzLngsIHRoaXMueSwgZGFtYWdlLCAnI0ZGMDAwMCcsIDAsIC0xKTtcclxuXHR9XHJcblx0XHJcblx0cmVzcGF3bigpIHtcclxuXHRcdGdhbWUuc2VuZFNlcnZlck1lc3NhZ2UodGhpcy5uYW1lICsgXCIgaXMgYmFjayBmcm9tIHRoZSBkZWFkLlwiKTtcclxuXHJcblx0XHR0aGlzLm1hcCA9IHRoaXMucmVzcGF3bk1hcDtcclxuXHRcdHRoaXMueCA9IHRoaXMucmVzcGF3blg7XHJcblx0XHR0aGlzLnkgPSB0aGlzLnJlc3Bhd25ZO1xyXG5cdFx0dGhpcy5zdGFydFggPSB0aGlzLnJlc3Bhd25YO1xyXG5cdFx0dGhpcy5zdGFydFkgPSB0aGlzLnJlc3Bhd25ZO1xyXG5cdFx0dGhpcy5kZXN0aW5hdGlvblggPSB0aGlzLnJlc3Bhd25YO1xyXG5cdFx0dGhpcy5kZXN0aW5hdGlvblkgPSB0aGlzLnJlc3Bhd25ZO1xyXG5cdFx0XHJcblx0XHR0aGlzLmNhbGNCb251c1N0YXRzKCk7XHJcblx0XHR0aGlzLnJlc3RvcmUoKTtcclxuXHRcdFxyXG5cdFx0dGhpcy5pc1dhbGtpbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMuaXNSdW5uaW5nID0gZmFsc2U7XHJcblx0XHR0aGlzLmlzQXR0YWNraW5nID0gZmFsc2U7XHJcblx0XHR0aGlzLmlzRGVhZCA9IGZhbHNlO1xyXG5cdFx0dGhpcy5yZXNwYXduVGltZXIgPSAwO1xyXG5cdH1cclxuXHRcclxuXHRzZXREZWFkKHNvdXJjZSkge1xyXG5cdFx0bGV0IG1hcCA9IGdhbWUubWFwTGlzdFt0aGlzLm1hcF07XHJcblxyXG5cdFx0Ly8gSW52ZW50b3J5IEl0ZW0gRHJvcCBDaGFuY2VcclxuXHRcdGxldCBkcm9wQ2hhbmNlID0gdXRpbC5jbGFtcChtYXAuZHJvcENoYW5jZSwgMCwgMTAwKTtcclxuXHRcdGlmIChkcm9wQ2hhbmNlID4gMCkge1xyXG5cdFx0XHRsZXQgaXRlbXMgPSB0aGlzLmludmVudG9yeS5maWx0ZXIoKGl0ZW0pID0+IHtcclxuXHRcdFx0XHRpZiAoaXRlbS5zbG90IDwgY29uZmlnLklOVkVOVE9SWV9TSVpFKSByZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0aXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG5cdFx0XHRcdGlmIChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDEpIDw9IGRyb3BDaGFuY2UpIHtcclxuXHRcdFx0XHRcdHRoaXMuZHJvcEl0ZW0oaXRlbS5zbG90KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEVxdWlwcGVkIEl0ZW0gRHJvcCBBbW91bnRcclxuXHRcdGxldCBkcm9wQW1vdW50RVEgPSB1dGlsLmNsYW1wKG1hcC5kcm9wQW1vdW50RVEsIDAsIGNvbmZpZy5FUVVJUE1FTlRfU0laRSk7XHJcblx0XHRpZiAoZHJvcEFtb3VudEVRID4gMCkge1xyXG5cdFx0XHRsZXQgZXF1aXBtZW50ID0gdGhpcy5pbnZlbnRvcnkuZmlsdGVyKChpdGVtKSA9PiB7XHJcblx0XHRcdFx0aWYgKGl0ZW0uc2xvdCA+PSBjb25maWcuSU5WRU5UT1JZX1NJWkUpIHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRlcXVpcG1lbnQgPSB1dGlsLnNodWZmbGUoZXF1aXBtZW50KTtcclxuXHRcdFx0ZXF1aXBtZW50LnNwbGljZSgtZHJvcEFtb3VudEVRKTtcclxuXHRcdFx0ZXF1aXBtZW50LmZvckVhY2goKGl0ZW0pID0+IHtcclxuXHRcdFx0XHR0aGlzLmRyb3BJdGVtKGVxdWlwbWVudC5zbG90KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHRoaXMuaXNEZWFkID0gdHJ1ZTtcclxuXHRcdHRoaXMuaGVhbHRoID0gMDtcclxuXHRcdHRoaXMuZW5lcmd5ID0gMDtcclxuXHRcdHRoaXMuZGVhdGhzKys7XHJcblx0XHRcclxuXHRcdGlmIChzb3VyY2UpIHtcclxuXHRcdFx0aWYgKHNvdXJjZS5jb250cm9sbGVyID0gJ3BsYXllcicpIHtcclxuXHRcdFx0XHRnYW1lLnNlbmRTZXJ2ZXJNZXNzYWdlKHNvdXJjZS5uYW1lICsgXCIgaGFzIG11cmRlcmVkIFwiICsgdGhpcy5uYW1lICsgXCIgaW4gY29sZCBibG9vZCFcIik7XHJcblx0XHRcdFx0c291cmNlLmtpbGxzKys7XHJcblx0XHRcdFx0aWYgKHNvdXJjZS50YXJnZXQgPT09IHRoaXMpIHtcclxuXHRcdFx0XHRcdHNvdXJjZS50YXJnZXQgPSBudWxsO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRnYW1lLnNlbmRTZXJ2ZXJNZXNzYWdlKHRoaXMubmFtZSArIFwiIGhhcyBiZWVuIGtpbGxlZCBieSBcIiArIHNvdXJjZS5uYW1lICsgXCIhXCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Z2FtZS5zZW5kU2VydmVyTWVzc2FnZSh0aGlzLm5hbWUgKyBcIiBoYXMgZGllZCFcIik7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdC8vIEludmVudG9yeVxyXG5cdHBpY2tVcCgpIHtcclxuXHRcdGdhbWUubWFwTGlzdFt0aGlzLm1hcF0uaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG5cdFx0XHRpZiAoaXRlbS54ID09PSB0aGlzLnggJiYgaXRlbS55ID09PSB0aGlzLnkpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5nZXRJdGVtKGl0ZW0uaXRlbUNsYXNzLCBpdGVtLnN0YWNrKSkge1xyXG5cdFx0XHRcdFx0aXRlbS5yZW1vdmUoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHRcclxuXHRnZXRJdGVtKGl0ZW1DbGFzcywgc3RhY2spIHtcclxuXHRcdGlmIChzdGFjayA+IDApIHtcdFx0XHQvLyBTdGFja2FibGUgSXRlbXNcclxuXHRcdFx0bGV0IGVtcHR5U2xvdCA9IC0xO1xyXG5cdFx0XHRmb3IgKGxldCBzbG90ID0gMDsgc2xvdCA8IGNvbmZpZy5JTlZFTlRPUllfU0laRTsgc2xvdCsrKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuaW52ZW50b3J5W3Nsb3RdKSB7XHJcblx0XHRcdFx0XHRpZiAodGhpcy5pbnZlbnRvcnlbc2xvdF0uY2xhc3MgPT09IGl0ZW1DbGFzcykge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmludmVudG9yeVtzbG90XS5zdGFjayArPSBzdGFjaztcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2UgaWYgKGVtcHR5U2xvdCA8IDApIHtcclxuXHRcdFx0XHRcdGVtcHR5U2xvdCA9IHNsb3Q7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGlmIChzbG90ID09PSBjb25maWcuSU5WRU5UT1JZX1NJWkUgLSAxKSB7XHJcblx0XHRcdFx0XHRpZiAoZW1wdHlTbG90ID49IDAgJiYgZW1wdHlTbG90IDwgY29uZmlnLklOVkVOVE9SWV9TSVpFKSB7XHJcblx0XHRcdFx0XHRcdG5ldyBJbnZlbnRvcnlJdGVtKHRoaXMuaWQsIGVtcHR5U2xvdCwgaXRlbUNsYXNzLCBzdGFjayk7XHJcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSB7XHQvLyBJbnZlbnRvcnkgZnVsbFxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcdFx0XHQvLyBOb24tU3RhY2thYmxlIEl0ZW1cclxuXHRcdFx0Zm9yIChsZXQgc2xvdCA9IDA7IHNsb3QgPCBjb25maWcuSU5WRU5UT1JZX1NJWkU7IHNsb3QrKykge1xyXG5cdFx0XHRcdGlmICghdGhpcy5pbnZlbnRvcnlbc2xvdF0pIHtcclxuXHRcdFx0XHRcdG5ldyBJbnZlbnRvcnlJdGVtKHRoaXMuaWQsIHNsb3QsIGl0ZW1DbGFzcywgc3RhY2spO1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0aWYgKHNsb3QgPT09IGNvbmZpZy5JTlZFTlRPUllfU0laRSAtIDEpIHtcdC8vIEludmVudG9yeSBmdWxsXHJcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0ZHJvcEl0ZW0oc2xvdCkge1xyXG5cdFx0bGV0IGl0ZW0gPSB0aGlzLmludmVudG9yeVtzbG90XTtcclxuXHRcdGlmICghaXRlbSkgcmV0dXJuO1xyXG5cdFx0XHJcblx0XHRpZiAoc2xvdCA8IGNvbmZpZy5JTlZFTlRPUllfU0laRSkge1xyXG5cdFx0XHQvLyBEZXN0cm95IEludmVudG9yeSBJdGVtXHJcblx0XHRcdGl0ZW0ucmVtb3ZlKCk7XHJcblx0XHRcdFxyXG5cdFx0XHQvLyBDcmVhdGUgTWFwIEl0ZW1cclxuXHRcdFx0Z2FtZS5zcGF3bkl0ZW0odGhpcy5tYXAsIHRoaXMueCwgdGhpcy55LCBpdGVtLmNsYXNzLCBpdGVtLnN0YWNrKTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHR0aGlzLnVuZXF1aXBJdGVtKHNsb3QpO1xyXG5cdFx0XHR0aGlzLmNhbGNCb251c1N0YXRzKCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHVzZUl0ZW0oc2xvdCkge1xyXG5cdFx0bGV0IGl0ZW0gPSB0aGlzLmludmVudG9yeVtzbG90XTtcclxuXHRcdGlmICghaXRlbSkgcmV0dXJuO1xyXG5cdFx0Ly8gaWYgKCFkYi5pdGVtc1tpdGVtLmlkXS51c2UuY2FsbCh0aGlzLCBzbG90KSkgcmV0dXJuO1x0Ly8gUnVuICd1c2UnIHNjcmlwdFxyXG5cdFx0XHJcblx0XHRpZiAoaXRlbS5jaGVja0lzRXF1aXBtZW50KCkpIHtcdC8vIEVxdWlwbWVudCBJdGVtc1xyXG5cdFx0XHRpZiAoc2xvdCA8IGNvbmZpZy5JTlZFTlRPUllfU0laRSkge1x0Ly8gQ2hlY2sgaWYgaXRlbSBpcyBlcXVpcHBlZFxyXG5cdFx0XHRcdHRoaXMuZXF1aXBJdGVtKHNsb3QpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMudW5lcXVpcEl0ZW0oc2xvdCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2Uge1x0Ly8gTm9uLUVxdWlwbWVudCBJdGVtc1xyXG5cdFx0XHRpZiAoIWl0ZW0ucmV1c2FibGUpIHtcclxuXHRcdFx0XHRpZiAoaXRlbS5zdGFjayA+IDEpIHtcclxuXHRcdFx0XHRcdGl0ZW0uc3RhY2stLTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRpdGVtLnJlbW92ZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRoYXNJdGVtKGl0ZW1DbGFzcykge1xyXG5cdFx0bGV0IGNvdW50ID0gMDtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY29uZmlnLklOVkVOVE9SWV9TSVpFOyBpKyspIHtcclxuXHRcdFx0aWYgKHRoaXMuaW52ZW50b3J5W2ldKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuaW52ZW50b3J5W2ldLmNsYXNzID09PSBpdGVtQ2xhc3MpIHtcclxuXHRcdFx0XHRcdGNvdW50Kys7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY291bnQ7XHJcblx0fVxyXG5cdFxyXG5cdG1vdmVJdGVtVG9TbG90KHNsb3QsIG5ld1Nsb3QpIHtcclxuXHRcdGlmICghc2xvdCB8fCAhbmV3U2xvdCkgcmV0dXJuO1xyXG5cdFx0aWYgKHNsb3QgPT09IG5ld1Nsb3QpIHJldHVybjtcclxuXHJcblx0XHRsZXQgaXRlbSA9IHRoaXMuaW52ZW50b3J5W3Nsb3RdO1xyXG5cdFx0bGV0IG5ld0l0ZW0gPSB0aGlzLmludmVudG9yeVtuZXdTbG90XTtcclxuXHJcblx0XHRpZiAoaXRlbSkge1xyXG5cdFx0XHRpZiAobmV3SXRlbSkge1xyXG5cdFx0XHRcdGlmIChzbG90ID49IGNvbmZpZy5JTlZFTlRPUllfU0laRSkge1xyXG5cdFx0XHRcdFx0aWYgKG5ld1Nsb3QgPj0gY29uZmlnLklOVkVOVE9SWV9TSVpFKSB7XHJcblx0XHRcdFx0XHRcdGlmIChuZXdJdGVtLnR5cGUgPT09IGl0ZW0udHlwZSkge1xyXG5cdFx0XHRcdFx0XHRcdGl0ZW0uc2xvdCA9IG5ld1Nsb3Q7XHJcblx0XHRcdFx0XHRcdFx0bmV3SXRlbS5zbG90ID0gc2xvdDtcclxuXHRcdFx0XHRcdFx0XHR1dGlsLnN3YXAodGhpcy5pbnZlbnRvcnksIHNsb3QsIG5ld1Nsb3QpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdGdhbWUuc2VuZFBsYXllck1lc3NhZ2UodGhpcy5pZCwgXCJUaGF0IGNhbm5vdCBiZSBlcXVpcHBlZCB0aGVyZS5cIik7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRpZiAobmV3SXRlbS50eXBlID09PSBpdGVtLnR5cGUpIHtcclxuXHRcdFx0XHRcdFx0XHRpdGVtLmVxdWlwcGVkID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdFx0bmV3SXRlbS5lcXVpcHBlZCA9IHRydWU7XHJcblx0XHRcdFx0XHRcdFx0aXRlbS5zbG90ID0gbmV3U2xvdDtcclxuXHRcdFx0XHRcdFx0XHRuZXdJdGVtLnNsb3QgPSBzbG90O1xyXG5cdFx0XHRcdFx0XHRcdHV0aWwuc3dhcCh0aGlzLmludmVudG9yeSwgc2xvdCwgbmV3U2xvdCk7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5jYWxjQm9udXNTdGF0cygpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdG5ld1Nsb3QgPSB0aGlzLmZpbmRGaXJzdEVtcHR5U2xvdCgpO1xyXG5cdFx0XHRcdFx0XHRcdGlmIChuZXdTbG90KSB7XHJcblx0XHRcdFx0XHRcdFx0XHRpdGVtLmVxdWlwcGVkID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdFx0XHRpdGVtLnNsb3QgPSBuZXdTbG90O1xyXG5cdFx0XHRcdFx0XHRcdFx0dXRpbC5zd2FwKHRoaXMuaW52ZW50b3J5LCBzbG90LCBuZXdTbG90KTtcclxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuY2FsY0JvbnVzU3RhdHMoKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRnYW1lLnNlbmRQbGF5ZXJNZXNzYWdlKHRoaXMuaWQsIFwiWW91ciBpbnZlbnRvcnkgaXMgZnVsbC5cIik7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0aWYgKG5ld1Nsb3QgPj0gY29uZmlnLklOVkVOVE9SWV9TSVpFKSB7XHJcblx0XHRcdFx0XHRcdGlmIChuZXdJdGVtLnR5cGUgPT09IGl0ZW0udHlwZSkge1xyXG5cdFx0XHRcdFx0XHRcdGl0ZW0uZXF1aXBwZWQgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRcdG5ld0l0ZW0uZXF1aXBwZWQgPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0XHRpdGVtLnNsb3QgPSBuZXdTbG90O1xyXG5cdFx0XHRcdFx0XHRcdG5ld0l0ZW0uc2xvdCA9IHNsb3Q7XHJcblx0XHRcdFx0XHRcdFx0dXRpbC5zd2FwKHRoaXMuaW52ZW50b3J5LCBzbG90LCBuZXdTbG90KTtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmNhbGNCb251c1N0YXRzKCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0Z2FtZS5zZW5kUGxheWVyTWVzc2FnZSh0aGlzLmlkLCBcIlRoYXQgY2Fubm90IGJlIGVxdWlwcGVkIHRoZXJlLlwiKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdGl0ZW0uc2xvdCA9IG5ld1Nsb3Q7XHJcblx0XHRcdFx0XHRcdG5ld0l0ZW0uc2xvdCA9IHNsb3Q7XHJcblx0XHRcdFx0XHRcdHV0aWwuc3dhcCh0aGlzLmludmVudG9yeSwgc2xvdCwgbmV3U2xvdCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdGlmIChzbG90ID49IGNvbmZpZy5JTlZFTlRPUllfU0laRSkge1xyXG5cdFx0XHRcdFx0aWYgKG5ld1Nsb3QgPj0gY29uZmlnLklOVkVOVE9SWV9TSVpFKSB7XHJcblx0XHRcdFx0XHRcdGlmIChuZXdTbG90ID09PSBpdGVtLmZpbmRFcXVpcG1lbnRTbG90KCkpIHtcclxuXHRcdFx0XHRcdFx0XHRpdGVtLnNsb3QgPSBuZXdTbG90O1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuaW52ZW50b3J5W25ld1Nsb3RdID0gaXRlbTtcclxuXHRcdFx0XHRcdFx0XHRkZWxldGUgdGhpcy5pbnZlbnRvcnlbc2xvdF07XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0Z2FtZS5zZW5kUGxheWVyTWVzc2FnZSh0aGlzLmlkLCBcIlRoYXQgY2Fubm90IGJlIGVxdWlwcGVkIHRoZXJlLlwiKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdGl0ZW0uZXF1aXBwZWQgPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0aXRlbS5zbG90ID0gbmV3U2xvdDtcclxuXHRcdFx0XHRcdFx0dGhpcy5pbnZlbnRvcnlbbmV3U2xvdF0gPSBpdGVtO1xyXG5cdFx0XHRcdFx0XHRkZWxldGUgdGhpcy5pbnZlbnRvcnlbc2xvdF07XHJcblx0XHRcdFx0XHRcdHRoaXMuY2FsY0JvbnVzU3RhdHMoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRpZiAobmV3U2xvdCA+PSBjb25maWcuSU5WRU5UT1JZX1NJWkUpIHtcclxuXHRcdFx0XHRcdFx0aWYgKG5ld1Nsb3QgPT09IGl0ZW0uZmluZEVxdWlwbWVudFNsb3QoKSkge1xyXG5cdFx0XHRcdFx0XHRcdGl0ZW0uZXF1aXBwZWQgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRcdGl0ZW0uc2xvdCA9IG5ld1Nsb3Q7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5pbnZlbnRvcnlbbmV3U2xvdF0gPSBpdGVtO1xyXG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSB0aGlzLmludmVudG9yeVtzbG90XTtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmNhbGNCb251c1N0YXRzKCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0Z2FtZS5zZW5kUGxheWVyTWVzc2FnZSh0aGlzLmlkLCBcIlRoYXQgY2Fubm90IGJlIGVxdWlwcGVkIHRoZXJlLlwiKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdGl0ZW0uc2xvdCA9IG5ld1Nsb3Q7XHJcblx0XHRcdFx0XHRcdHRoaXMuaW52ZW50b3J5W25ld1Nsb3RdID0gaXRlbTtcclxuXHRcdFx0XHRcdFx0ZGVsZXRlIHRoaXMuaW52ZW50b3J5W3Nsb3RdO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZXF1aXBJdGVtKHNsb3QpIHtcclxuXHRcdGxldCBuZXdTbG90ID0gaXRlbS5maW5kRXF1aXBtZW50U2xvdCgpO1xyXG5cdFx0dGhpcy5tb3ZlSXRlbVRvU2xvdChzbG90LCBuZXdTbG90KTtcclxuXHRcdHRoaXMuY2FsY0JvbnVzU3RhdHMoKTtcclxuXHR9XHJcblxyXG5cdHVuZXF1aXBJdGVtKHNsb3QpIHtcclxuXHRcdGxldCBpdGVtID0gdGhpcy5pbnZlbnRvcnlbc2xvdF07XHJcblx0XHRpZiAoIWl0ZW0pIHJldHVybjtcclxuXHRcdFxyXG5cdFx0aWYgKGl0ZW0uc2xvdCA+PSBjb25maWcuSU5WRU5UT1JZX1NJWkUpIHtcclxuXHRcdFx0bGV0IG5ld1Nsb3QgPSB0aGlzLmZpbmRGaXJzdEVtcHR5U2xvdCgpO1xyXG5cdFx0XHRpZiAobmV3U2xvdCA9PT0gbnVsbCkge1xyXG5cdFx0XHRcdGdhbWUuc2VuZFBsYXllck1lc3NhZ2UodGhpcy5pZCwgXCJZb3VyIGludmVudG9yeSBpcyBmdWxsLlwiKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHR0aGlzLm1vdmVJdGVtVG9TbG90KHNsb3QsIG5ld1Nsb3QpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGZpbmRGaXJzdEVtcHR5U2xvdCgpIHtcclxuXHRcdGZvciAobGV0IHNsb3QgPSAwOyBzbG90IDwgY29uZmlnLklOVkVOVE9SWV9TSVpFOyBzbG90KyspIHtcclxuXHRcdFx0aWYgKCF0aGlzLmludmVudG9yeVtzbG90XSkgcmV0dXJuIHNsb3Q7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9XHJcblxyXG5cclxuXHR1cGRhdGUoZGVsdGEpIHtcclxuXHRcdC8vIEludmVudG9yeSBJdGVtIFVwZGF0ZVxyXG5cdFx0dGhpcy5pbnZlbnRvcnkuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG5cdFx0XHRpdGVtLnVwZGF0ZSgpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0Ly8gUmVzcGF3bmluZ1xyXG5cdFx0aWYgKHRoaXMuaXNEZWFkKSB7XHJcblx0XHRcdHRoaXMucmVzcGF3blRpbWVyICs9IGRlbHRhO1xyXG5cdFx0XHRpZiAodGhpcy5yZXNwYXduVGltZXIgPj0gdGhpcy5yZXNwYXduU3BlZWQpIHtcclxuXHRcdFx0XHR0aGlzLnJlc3Bhd24oKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vIEF0dGFja2luZ1xyXG5cdFx0aWYgKHRoaXMuaXNBdHRhY2tpbmcgfHwgdGhpcy5hdHRhY2tUaW1lciA+IDApIHtcclxuXHRcdFx0dGhpcy5hdHRhY2tUaW1lciArPSBkZWx0YTtcclxuXHRcdFx0aWYgKHRoaXMuYXR0YWNrVGltZXIgPj0gMC4zKSB7XHJcblx0XHRcdFx0dGhpcy5pc0F0dGFja2luZyA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh0aGlzLmF0dGFja1RpbWVyID49IHRoaXMuYXR0YWNrU3BlZWQpIHtcclxuXHRcdFx0XHR0aGlzLmF0dGFja1RpbWVyID0gMDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBNb3ZlbWVudFxyXG5cdFx0aWYgKHRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0dGhpcy5sZXJwICs9IGRlbHRhICogdGhpcy5tb3ZlU3BlZWQ7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAodGhpcy5sZXJwID49IDAuNDkpIHtcclxuXHRcdFx0XHR0aGlzLnggPSB0aGlzLmRlc3RpbmF0aW9uWDtcclxuXHRcdFx0XHR0aGlzLnkgPSB0aGlzLmRlc3RpbmF0aW9uWTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0aWYgKHRoaXMubGVycCA+PSAwLjk5KSB7XHJcblx0XHRcdFx0dGhpcy5zdGFydFggPSB0aGlzLmRlc3RpbmF0aW9uWDtcclxuXHRcdFx0XHR0aGlzLnN0YXJ0WSA9IHRoaXMuZGVzdGluYXRpb25ZO1xyXG5cdFx0XHRcdHRoaXMubGVycCA9IDA7XHJcblx0XHRcdFx0dGhpcy5pc01vdmluZyA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbiIsImltcG9ydCBkYiBmcm9tICcuLi9kYi5qcyc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4uL2dhbWUuanMnO1xyXG5pbXBvcnQgY29uZmlnIGZyb20gJy4uL2NvbmZpZy5qcyc7XHJcbmltcG9ydCB1dGlsIGZyb20gJy4uL3V0aWwuanMnO1xyXG5pbXBvcnQgQWN0b3IgZnJvbSAnLi9BY3Rvci5qcyc7XHJcblxyXG4vLyBBIEJvdCBpcyBhbiBBY3RvciB3aXRoIGNvbmRpdGlvbmFsIGlucHV0c1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQm90IGV4dGVuZHMgQWN0b3Ige1xyXG5cdGNvbnN0cnVjdG9yKGJvdFJlZiwgbWFwLCB4LCB5KSB7XHJcblx0XHRsZXQgZGF0YSA9IGRiLmdldEJvdERhdGEoYm90UmVmKTtcclxuXHJcblx0XHRzdXBlcihtYXAsIHgsIHksIGRhdGEubmFtZSwgZGF0YS5zcHJpdGUpO1xyXG5cdFx0dGhpcy5ib3RSZWYgPSBib3RSZWY7XHJcblx0XHR0aGlzLmhvc3RpbGUgPSBkYXRhLmhvc3RpbGU7XHRcdC8vIFdoZXRoZXIgYm90IGF0dGFja3Mgb24gc2lnaHRcclxuXHJcblx0XHR0aGlzLnRhcmdldCA9IG51bGw7XHJcblx0XHR0aGlzLnNldFRhc2soJ3dhbmRlcmluZycpO1xyXG5cdFx0dGhpcy5tb3ZlVGltZXIgPSAwO1xyXG5cdFx0XHJcblx0XHR0aGlzLmlkID0gdXRpbC5maXJzdEVtcHR5SW5kZXgoZ2FtZS5tYXBMaXN0W3RoaXMubWFwXS5ib3RzKTtcclxuXHRcdGdhbWUubWFwTGlzdFt0aGlzLm1hcF0uYm90c1t0aGlzLmlkXSA9IHRoaXM7XHJcblx0fVxyXG5cdFxyXG5cdHVwZGF0ZShkZWx0YSkge1xyXG5cdFx0c3VwZXIudXBkYXRlKGRlbHRhKTsgXHQvLyBEZWZhdWx0IEFjdG9yIFVwZGF0ZVxyXG5cdFx0aWYgKHRoaXMuaXNEZWFkKSByZXR1cm47XHJcblxyXG5cdFx0dGhpcy5tb3ZlVGltZXIrKztcclxuXHRcdFxyXG5cdFx0Ly8gQUkgSW5wdXRzXHJcblx0XHRzd2l0Y2godGhpcy50YXNrKSB7XHJcblx0XHRcdGNhc2UgJ3dhbmRlcmluZyc6XHRcdC8vIE1vdmUgcmFuZG9tbHlcclxuXHRcdFx0XHR0aGlzLm1vdmUoKTtcclxuXHRcdFx0XHR0aGlzLnBpY2tVcCgpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnZm9sbG93aW5nJzpcdFx0Ly8gTW92ZSB0b3dhcmRzIHRhcmdldFxyXG5cdFx0XHRcdGlmICh0aGlzLnRhcmdldCkge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlVG9UYXJnZXQodGhpcy50YXJnZXQsIGZhbHNlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHQvLyBObyB0YXJnZXRcclxuXHRcdFx0XHRcdHRoaXMuc2V0VGFzaygnd2FuZGVyaW5nJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnYXR0YWNraW5nJzpcdFx0Ly8gTW92ZSB0b3dhcmRzIHRhcmdldCBhbmQgYXR0YWNrXHJcblx0XHRcdFx0aWYgKHRoaXMudGFyZ2V0KSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmVUb1RhcmdldCh0aGlzLnRhcmdldCwgdHJ1ZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly8gTm8gdGFyZ2V0XHJcblx0XHRcdFx0XHR0aGlzLnNldFRhc2soJ3dhbmRlcmluZycpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdC8vIGNhc2UgJ2lkbGUnOlxyXG5cdFx0XHRkZWZhdWx0OiBcdFx0XHRcdFx0Ly8gU3RhbmQgc3RpbGxcclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiB0aGlzLmdldFBhY2soKTtcclxuXHR9XHJcblx0XHJcblx0Z2V0UGFjaygpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGlkOiB0aGlzLmlkLFxyXG5cdFx0XHRuYW1lOiB0aGlzLm5hbWUsXHJcblx0XHRcdHNwcml0ZTogdGhpcy5zcHJpdGUsXHJcblx0XHRcdGRpcmVjdGlvbjogdGhpcy5kaXJlY3Rpb24sXHJcblx0XHRcdG1hcDogdGhpcy5tYXAsXHJcblx0XHRcdHg6IHRoaXMuc3RhcnRYLFxyXG5cdFx0XHR5OiB0aGlzLnN0YXJ0WSxcclxuXHRcdFx0ejogdGhpcy56LFxyXG5cdFx0XHRkZXN0aW5hdGlvblg6IHRoaXMuZGVzdGluYXRpb25YLFxyXG5cdFx0XHRkZXN0aW5hdGlvblk6IHRoaXMuZGVzdGluYXRpb25ZLFxyXG5cdFx0XHRsZXJwOiB0aGlzLmxlcnAsXHJcblx0XHRcdGlzUnVubmluZzogdGhpcy5pc1J1bm5pbmcsXHJcblx0XHRcdGlzQXR0YWNraW5nOiB0aGlzLmlzQXR0YWNraW5nLFxyXG5cdFx0XHRpc0RlYWQ6IHRoaXMuaXNEZWFkXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0cmVtb3ZlKCkge1xyXG5cdFx0ZGVsZXRlIGdhbWUubWFwTGlzdFt0aGlzLm1hcF0uYm90c1t0aGlzLmlkXTtcclxuXHR9XHJcblx0XHJcblx0bW92ZShkaXJlY3Rpb24pIHtcclxuXHRcdGxldCBtb3ZlVGltZSA9IDI0O1xyXG5cdFx0aWYgKHRoaXMuaXNSdW5uaW5nKSB7XHJcblx0XHRcdG1vdmVUaW1lID0gMTc7XHJcblx0XHR9XHJcblx0XHRpZiAodGhpcy5tb3ZlVGltZXIgPiBtb3ZlVGltZSAmJiB0aGlzLmF0dGFja1RpbWVyID09PSAwKSB7XHJcblx0XHRcdHN1cGVyLm1vdmUoZGlyZWN0aW9uKTtcclxuXHRcdFx0dGhpcy5tb3ZlVGltZXIgPSAwO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHR0YWtlRGFtYWdlKGRhbWFnZSwgc291cmNlKSB7XHJcblx0XHRpZiAoc291cmNlIGluc3RhbmNlb2YgQWN0b3IpIHtcclxuXHRcdFx0dGhpcy5zZXRUYXNrKCdhdHRhY2tpbmcnLCBzb3VyY2UpO1xyXG5cdFx0fVxyXG5cdFx0c3VwZXIudGFrZURhbWFnZShkYW1hZ2UsIHNvdXJjZSk7XHJcblx0fVxyXG5cdFxyXG5cdHJlc3Bhd24oKSB7XHJcblx0XHRzdXBlci5yZXNwYXduKCk7XHJcblx0XHR0aGlzLnNldFRhc2soJ3dhbmRlcmluZycpO1xyXG5cdH1cclxuXHRcclxuXHRwaWNrVXAoKSB7XHJcblx0XHRzdXBlci5waWNrVXAoKTtcclxuXHRcdHRoaXMuY2hlY2tCZXN0RXF1aXBtZW50KCk7XHJcblx0fVxyXG5cdFxyXG5cdHNldFRhc2sodGFzaywgdGFyZ2V0KSB7XHJcblx0XHRzd2l0Y2ggKHRhc2spIHtcclxuXHRcdFx0Y2FzZSAnd2FuZGVyaW5nJzpcclxuXHRcdFx0XHR0aGlzLmxhemluZXNzID0gNztcclxuXHRcdFx0XHR0aGlzLnRhcmdldCA9IG51bGw7XHJcblx0XHRcdFx0dGhpcy50YXNrID0gdGFzaztcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ2ZvbGxvd2luZyc6XHJcblx0XHRcdFx0aWYgKHRhcmdldCA9PT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0dGhpcy5zZXRUYXNrKCd3YW5kZXJpbmcnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLmxhemluZXNzID0gMDtcclxuXHRcdFx0XHRcdHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xyXG5cdFx0XHRcdFx0dGhpcy50YXNrID0gdGFzaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdhdHRhY2tpbmcnOlxyXG5cdFx0XHRcdGlmICh0YXJnZXQgPT09IG51bGwpIHtcclxuXHRcdFx0XHRcdHRoaXMuc2V0VGFzaygnd2FuZGVyaW5nJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5sYXppbmVzcyA9IDA7XHJcblx0XHRcdFx0XHR0aGlzLnRhcmdldCA9IHRhcmdldDtcclxuXHRcdFx0XHRcdHRoaXMudGFzayA9IHRhc2s7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0ZGVmYXVsdDpcdC8vaWRsaW5nXHJcblx0XHRcdFx0dGhpcy5sYXppbmVzcyA9IDc7XHJcblx0XHRcdFx0dGhpcy50YXJnZXQgPSBudWxsO1xyXG5cdFx0XHRcdHRoaXMudGFzayA9ICdpZGxlJztcclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGNoZWNrQmVzdEVxdWlwbWVudCgpIHtcclxuXHRcdGZvciAobGV0IHNsb3QgPSAwOyBzbG90IDwgY29uZmlnLklOVkVOVE9SWV9TSVpFOyBzbG90KyspIHtcclxuXHRcdFx0bGV0IGl0ZW0gPSB0aGlzLmludmVudG9yeVtzbG90XTtcclxuXHRcdFx0aWYgKCFpdGVtKSB7XHJcblx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdHN3aXRjaCAoaXRlbS50eXBlKSB7XHJcblx0XHRcdFx0Y2FzZSAnd2VhcG9uJzpcclxuXHRcdFx0XHRcdGlmICh0aGlzLmludmVudG9yeVtjb25maWcuSU5WRU5UT1JZX1NJWkVdKSB7XHJcblx0XHRcdFx0XHRcdGlmIChpdGVtLmRhbWFnZUJvbnVzID4gdGhpcy5pbnZlbnRvcnlbY29uZmlnLklOVkVOVE9SWV9TSVpFXS5kYW1hZ2VCb251cykge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuZXF1aXBJdGVtKHNsb3QpO1xyXG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5lcXVpcEl0ZW0oc2xvdCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAnc2hpZWxkJzpcclxuXHRcdFx0XHRcdGlmICh0aGlzLmludmVudG9yeVtjb25maWcuSU5WRU5UT1JZX1NJWkUgKyAxXSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoaXRlbS5kZWZlbmNlQm9udXMgPiB0aGlzLmludmVudG9yeVtjb25maWcuSU5WRU5UT1JZX1NJWkUgKyAxXS5kZWZlbmNlQm9udXMpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmVxdWlwSXRlbShzbG90KTtcclxuXHRcdFx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZXF1aXBJdGVtKHNsb3QpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ2FybW91cic6XHJcblx0XHRcdFx0XHRpZiAodGhpcy5pbnZlbnRvcnlbY29uZmlnLklOVkVOVE9SWV9TSVpFICsgMl0pIHtcclxuXHRcdFx0XHRcdFx0aWYgKGl0ZW0uZGVmZW5jZUJvbnVzID4gdGhpcy5pbnZlbnRvcnlbY29uZmlnLklOVkVOVE9SWV9TSVpFICsgMl0uZGVmZW5jZUJvbnVzKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5lcXVpcEl0ZW0oc2xvdCk7XHJcblx0XHRcdFx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmVxdWlwSXRlbShzbG90KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdoZWxtZXQnOlxyXG5cdFx0XHRcdFx0aWYgKHRoaXMuaW52ZW50b3J5W2NvbmZpZy5JTlZFTlRPUllfU0laRSArIDNdKSB7XHJcblx0XHRcdFx0XHRcdGlmIChpdGVtLmRlZmVuY2VCb251cyA+IHRoaXMuaW52ZW50b3J5W2NvbmZpZy5JTlZFTlRPUllfU0laRSArIDNdLmRlZmVuY2VCb251cykge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuZXF1aXBJdGVtKHNsb3QpO1xyXG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5lcXVpcEl0ZW0oc2xvdCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAncmluZyc6XHJcblx0XHRcdFx0XHRpZiAodGhpcy5pbnZlbnRvcnlbY29uZmlnLklOVkVOVE9SWV9TSVpFICsgNF0pIHtcclxuXHRcdFx0XHRcdFx0aWYgKGl0ZW0uZGFtYWdlQm9udXMgPiB0aGlzLmludmVudG9yeVtjb25maWcuSU5WRU5UT1JZX1NJWkUgKyA0XS5kYW1hZ2VCb251cykge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuZXF1aXBJdGVtKHNsb3QpO1xyXG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5lcXVpcEl0ZW0oc2xvdCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn1cclxuIiwiaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9jb25maWcuanMnO1xyXG5cclxuLy8gQW4gRW50aXR5IGlzIGFueSBvYmplY3QgdGhhdCBhcHBlYXJzIG9uIHRoZSBtYXBcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVudGl0eSB7XHJcblx0Y29uc3RydWN0b3IobWFwLCB4LCB5LCBzcHJpdGUgPSAwKSB7XHJcblx0XHR0aGlzLm1hcCA9IG1hcDtcclxuXHRcdHRoaXMueCA9IHg7XHJcblx0XHR0aGlzLnkgPSB5O1xyXG5cdFx0aWYgKHNwcml0ZSA8IDApIHtcclxuXHRcdFx0c3ByaXRlID0gMDtcclxuXHRcdH1cclxuXHRcdHRoaXMuc3ByaXRlID0gc3ByaXRlO1xyXG5cdH1cclxufSIsImltcG9ydCBjb25maWcgZnJvbSAnLi4vY29uZmlnLmpzJztcclxuaW1wb3J0IHV0aWwgZnJvbSAnLi4vdXRpbC5qcyc7XHJcbmltcG9ydCBUaWxlIGZyb20gJy4vdGlsZS5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXAge1xyXG5cdGNvbnN0cnVjdG9yKGlkLCBkYXRhKSB7XHJcblx0XHR0aGlzLmlkID0gaWQ7XHJcblxyXG5cdFx0dGhpcy5uYW1lID0gZGF0YS5uYW1lO1xyXG5cdFx0dGhpcy5kcm9wQ2hhbmNlID0gdXRpbC5jbGFtcChkYXRhLmRyb3BDaGFuY2UsIDAsIDEwMCk7XHJcblx0XHQvL3RoaXMuZHJvcENoYW5jZSA9IDAgPSAwJSBjaGFuY2UgdG8gZHJvcCBpdGVtcyBpbiBpbnZlbnRvcnkgKGRyb3Agbm90aGluZyksIDEwMCA9IDEwMCUgY2hhbmNlIHRvIGRyb3AgKGRyb3AgZXZlcnl0aGluZylcclxuXHRcdHRoaXMuZHJvcEFtb3VudEVRID0gdXRpbC5jbGFtcChkYXRhLmRyb3BBbW91bnRFUSwgMCwgY29uZmlnLkVRVUlQTUVOVF9TSVpFKTtcclxuXHRcdC8vdGhpcy5kcm9wQW1vdW50RVEgPSBudW1iZXIgb2YgZXF1aXBwZWQgaXRlbXMgdGhlIHBsYXllciB3aWxsIGRyb3Agb24gZGVhdGguIGRyb3BFUSA9IEVRVUlQTUVOVF9TSVpFID0gZHJvcCBhbGwgZXF1aXBtZW50XHJcblx0XHRcclxuXHRcdHRoaXMuaXRlbXMgPSBkYXRhLml0ZW1zO1xyXG5cdFx0dGhpcy5ib3RzID0gZGF0YS5ib3RzO1xyXG5cdFx0dGhpcy5lZmZlY3RzID0gZGF0YS5lZmZlY3RzO1xyXG5cdFx0dGhpcy50ZXh0cyA9IGRhdGEudGV4dHM7XHJcblx0XHRcclxuXHRcdHRoaXMudGlsZXMgPSBbXTtcclxuXHRcdGZvciAobGV0IHkgPSAwOyB5IDwgY29uZmlnLk1BUF9DT0xVTU5TOyB5KyspIHtcclxuXHRcdFx0dGhpcy50aWxlc1t5XSA9IFtdO1xyXG5cdFx0XHRmb3IgKGxldCB4ID0gMDsgeCA8IGNvbmZpZy5NQVBfUk9XUzsgeCsrKSB7XHJcblx0XHRcdFx0bGV0IHRpbGVEYXRhID0gdGhpcy5nZXRUaWxlRGF0YShkYXRhLCAoeSAqIGNvbmZpZy5NQVBfQ09MVU1OUykgKyB4KTtcclxuXHRcdFx0XHR0aGlzLnRpbGVzW3ldW3hdID0gbmV3IFRpbGUodGlsZURhdGEpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHVwbG9hZCgpIHtcclxuXHRcdGdhbWUubWFwRGF0YVt0aGlzLmlkXSA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKCcuL3NlcnZlci9kYXRhL21hcC5qc29uJywgJ3V0ZjgnKSlbdGhpcy5pZF07XHJcblx0XHRmb3IgKGxldCB5ID0gMDsgeSA8IGNvbmZpZy5NQVBfUk9XUzsgeSsrKSB7XHJcblx0XHRcdGZvciAobGV0IHggPSAwOyB4IDwgY29uZmlnLk1BUF9DT0xVTU5TOyB4KyspIHtcclxuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGNvbmZpZy5NQVBfTEFZRVJTOyBpKyspIHtcclxuXHRcdFx0XHRcdHRoaXMudGlsZXNbeV1beF0ubGF5ZXJbaV0gPSBnYW1lLm1hcERhdGFbdGhpcy5pZF0udGlsZXNbaV1bKHkgKiBjb25maWcuTUFQX0NPTFVNTlMpICsgeF07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRnYW1lLnBsYXllckxpc3QuZm9yRWFjaCgocGxheWVyKSA9PiB7XHJcblx0XHRcdGlmIChwbGF5ZXIubWFwID09PSB0aGlzLmlkKSB7XHJcblx0XHRcdFx0cGxheWVyLmxvYWRNYXAoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cdFxyXG5cdHVwZGF0ZShkZWx0YSkge1xyXG5cdFx0bGV0IHBhY2sgPSB7XHJcblx0XHRcdG5hbWU6IHRoaXMubmFtZSxcclxuXHRcdFx0aXRlbXM6IFtdLFxyXG5cdFx0XHRib3RzOiBbXSxcclxuXHRcdFx0ZWZmZWN0czogW10sXHJcblx0XHRcdHRleHRzOiBbXVxyXG5cdFx0fTtcclxuXHRcdFxyXG5cdFx0dGhpcy5pdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XHJcblx0XHRcdHBhY2suaXRlbXNbaXRlbS5pZF0gPSBpdGVtLnVwZGF0ZShkZWx0YSk7XHJcblx0XHR9KTtcclxuXHRcdHRoaXMuYm90cy5mb3JFYWNoKChib3QpID0+IHtcclxuXHRcdFx0cGFjay5ib3RzW2JvdC5pZF0gPSBib3QudXBkYXRlKGRlbHRhKTtcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5lZmZlY3RzLmZvckVhY2goKGVmZmVjdCkgPT4ge1xyXG5cdFx0XHRwYWNrLmVmZmVjdHNbZWZmZWN0LmlkXSA9IGVmZmVjdC51cGRhdGUoZGVsdGEpO1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLnRleHRzLmZvckVhY2goKHRleHQpID0+IHtcclxuXHRcdFx0cGFjay50ZXh0c1t0ZXh0LmlkXSA9IHRleHQudXBkYXRlKGRlbHRhKTtcclxuXHRcdH0pO1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gcGFjaztcclxuXHR9XHJcblx0XHJcblx0Z2V0UGFjaygpIHtcclxuXHRcdGxldCBtYXBQYWNrID0ge1xyXG5cdFx0XHRuYW1lOiB0aGlzLm5hbWUsXHJcblx0XHRcdHRpbGVzOiB0aGlzLmdldFRpbGVQYWNrKCksXHJcblx0XHRcdGl0ZW1zOiBbXSxcclxuXHRcdFx0Ym90czogW10sXHJcblx0XHRcdGVmZmVjdHM6IFtdLFxyXG5cdFx0XHR0ZXh0czogW11cclxuXHRcdH07XHJcblxyXG5cdFx0dGhpcy5pdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XHJcblx0XHRcdG1hcFBhY2suaXRlbXNbaXRlbS5pZF0gPSBpdGVtLmdldFBhY2soKTtcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5ib3RzLmZvckVhY2goKGJvdCkgPT4ge1xyXG5cdFx0XHRtYXBQYWNrLmJvdHNbYm90LmlkXSA9IGJvdC5nZXRQYWNrKCk7XHJcblx0XHR9KTtcclxuXHRcdHRoaXMuZWZmZWN0cy5mb3JFYWNoKChlZmZlY3QpID0+IHtcclxuXHRcdFx0bWFwUGFjay5lZmZlY3RzW2VmZmVjdC5pZF0gPSBlZmZlY3QuZ2V0UGFjaygpO1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLnRleHRzLmZvckVhY2goKHRleHQpID0+IHtcclxuXHRcdFx0bWFwUGFjay50ZXh0c1t0ZXh0LmlkXSA9IHRleHQuZ2V0UGFjaygpO1xyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcdHJldHVybiBtYXBQYWNrO1xyXG5cdH1cclxuXHRcclxuXHRnZXRUaWxlUGFjaygpIHtcclxuXHRcdGxldCB0aWxlUGFjayA9IFtdO1xyXG5cclxuXHRcdGZvciAobGV0IHkgPSAwOyB5IDwgY29uZmlnLk1BUF9ST1dTOyB5KyspIHtcclxuXHRcdFx0dGlsZVBhY2tbeV0gPSBbXTtcclxuXHRcdFx0Zm9yIChsZXQgeCA9IDA7IHggPCBjb25maWcuTUFQX0NPTFVNTlM7IHgrKykge1xyXG5cdFx0XHRcdHRpbGVQYWNrW3ldW3hdID0gdGhpcy50aWxlc1t5XVt4XS5nZXRQYWNrKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGlsZVBhY2s7XHJcblx0fVxyXG5cclxuXHRnZXRUaWxlRGF0YShkYXRhLCBpbmRleCA9IDApIHtcclxuXHRcdGlmICghZGF0YSkgcmV0dXJuO1xyXG5cclxuXHRcdGxldCB0aWxlRGF0YSA9IHtcclxuXHRcdFx0bGF5ZXI6IFtdLFxyXG5cdFx0XHR3YWxsOiBkYXRhLnRpbGVzLndhbGxbaW5kZXhdLFxyXG5cdFx0XHQvL2NhbkF0dGFjazogZGF0YS5jYW5BdHRhY2tbaW5kZXhdLFxyXG5cdFx0XHQvL2RhbWFnZTogZGF0YS5kYW1hZ2VbaW5kZXhdLFxyXG5cdFx0XHQvL2RlZmVuY2U6IGRhdGEuZGVmZW5jZVtpbmRleF0sXHJcblx0XHRcdC8vaGVhbHRoTWF4OiBkYXRhLmhlYWx0aE1heFtpbmRleF0sXHJcblx0XHRcdC8vd2FycE1hcDogZGF0YS53YXJwTWFwW2luZGV4XSxcclxuXHRcdFx0Ly93YXJwWDogZGF0YS53YXJwWFtpbmRleF0sXHJcblx0XHRcdC8vd2FycFk6IGRhdGEud2FycFlbaW5kZXhdXHJcblx0XHR9O1xyXG5cclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY29uZmlnLk1BUF9MQVlFUlM7IGkrKykge1xyXG5cdFx0XHR0aWxlRGF0YS5sYXllcltpXSA9IGRhdGEudGlsZXMubGF5ZXJbaV1baW5kZXhdO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0aWxlRGF0YTtcclxuXHR9O1xyXG59IiwiaW1wb3J0IGRiIGZyb20gJy4uL2RiLmpzJztcclxuaW1wb3J0IGdhbWUgZnJvbSAnLi4vZ2FtZS5qcyc7XHJcbmltcG9ydCBBY3RvciBmcm9tICcuL2FjdG9yLmpzJztcclxuXHJcbi8vIEEgUGxheWVyIGlzIGFuIEFjdG9yIHdoaWNoIHRha2VzIGlucHV0IGZyb20gYSBjbGllbnRcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXllciBleHRlbmRzIEFjdG9yIHtcclxuXHRjb25zdHJ1Y3RvcihpZCkge1xyXG5cdFx0bGV0IGRhdGEgPSBkYi5nZXRQbGF5ZXJEYXRhKGlkKTtcclxuXHJcblx0XHRzdXBlcihkYXRhLm1hcCwgZGF0YS54LCBkYXRhLnksIGRhdGEubmFtZSwgZGF0YS5zcHJpdGUpO1xyXG5cdFx0dGhpcy5jb250cm9sbGVyID0gJ3BsYXllcic7XHJcblx0XHR0aGlzLmlkID0gaWQ7XHJcblx0XHR0aGlzLmFkbWluQWNjZXNzID0gZGF0YS5hZG1pbkFjY2VzcztcclxuXHJcblx0XHR0aGlzLmRhbWFnZUJhc2UgPSBkYXRhLmRhbWFnZUJhc2U7XHRcdFx0XHQvLyBtaW5pbXVtIGRhbWFnZSBhIHBsYXllciBjYW4gaGF2ZVxyXG5cdFx0dGhpcy5kZWZlbmNlQmFzZSA9IGRhdGEuZGVmZW5jZUJhc2U7XHRcdFx0Ly8gbWluaW11bSBkZWZlbmNlIGEgcGxheWVyIGNhbiBoYXZlXHJcblx0XHR0aGlzLmhlYWx0aE1heEJhc2UgPSBkYXRhLmhlYWx0aE1heEJhc2U7XHQvLyBtYXggaGVhbHRoIHdpdGhvdXQgYm9udXNlc1xyXG5cdFx0dGhpcy5lbmVyZ3lNYXhCYXNlID0gZGF0YS5lbmVyZ3lNYXhCYXNlO1x0Ly8gbWF4IGVuZXJneSB3aXRob3V0IGJvbnVzZXNcclxuXHRcdHRoaXMuY2FsY1N0YXRzKCk7XHJcblx0XHR0aGlzLnJlc3RvcmUoKTtcclxuXHJcblx0XHR0aGlzLnNlbGVjdGVkID0gbnVsbDtcclxuXHRcdHRoaXMuaW5wdXQgPSB7XHJcblx0XHRcdGRpcmVjdGlvbjogbnVsbCxcclxuXHRcdFx0cnVuOiBmYWxzZSxcclxuXHRcdFx0cGlja3VwOiBmYWxzZSxcclxuXHRcdFx0YXR0YWNrOiBmYWxzZVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0bG9hZE1hcCgpIHtcclxuXHRcdFxyXG5cdH1cclxuXHRcclxuXHR1cGRhdGUoZGVsdGEpIHtcclxuXHRcdHN1cGVyLnVwZGF0ZShkZWx0YSk7XHRcdC8vIERlZmF1bHQgQWN0b3IgVXBkYXRlXHJcblx0XHRcclxuXHRcdGlmICghdGhpcy5pc0RlYWQpIHtcclxuXHRcdFx0Ly8gQ2hlY2sgZm9yIEF0YWNrIElucHV0XHJcblx0XHRcdGlmICh0aGlzLmlucHV0LmF0dGFjayAmJiB0aGlzLmF0dGFja1RpbWVyID09PSAwKSB7XHJcblx0XHRcdFx0dGhpcy5hdHRhY2soKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0Ly8gQ2hlY2sgZm9yIE1vdmVtZW50IElucHV0XHJcblx0XHRcdGlmICghdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdGlmICh0aGlzLmlucHV0LmRpcmVjdGlvbikge1xyXG5cdFx0XHRcdFx0Ly8gQ2hlY2sgZm9yIFJ1biBJbnB1dFxyXG5cdFx0XHRcdFx0aWYgKHRoaXMuaW5wdXQucnVuKSB7XHJcblx0XHRcdFx0XHRcdGlmICh0aGlzLmVuZXJneSA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmlzUnVubmluZyA9IHRydWU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5pc1J1bm5pbmcgPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuaXNSdW5uaW5nID0gZmFsc2U7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUodGhpcy5pbnB1dC5kaXJlY3Rpb24pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gdGhpcy5nZXRQYWNrKCk7XHJcblx0fVxyXG5cdFxyXG5cdGdldFBhY2soKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRpZDogdGhpcy5pZCxcclxuXHRcdFx0bmFtZTogdGhpcy5uYW1lLFxyXG5cdFx0XHRzcHJpdGU6IHRoaXMuc3ByaXRlLFxyXG5cdFx0XHRkaXJlY3Rpb246IHRoaXMuZGlyZWN0aW9uLFxyXG5cdFx0XHRtYXA6IHRoaXMubWFwLFxyXG5cdFx0XHR4OiB0aGlzLnN0YXJ0WCxcclxuXHRcdFx0eTogdGhpcy5zdGFydFksXHJcblx0XHRcdHo6IHRoaXMueixcclxuXHRcdFx0ZGVzdGluYXRpb25YOiB0aGlzLmRlc3RpbmF0aW9uWCxcclxuXHRcdFx0ZGVzdGluYXRpb25ZOiB0aGlzLmRlc3RpbmF0aW9uWSxcclxuXHRcdFx0bGVycDogdGhpcy5sZXJwLFxyXG5cdFx0XHRpc1J1bm5pbmc6IHRoaXMuaXNSdW5uaW5nLFxyXG5cdFx0XHRpc0F0dGFja2luZzogdGhpcy5pc0F0dGFja2luZyxcclxuXHRcdFx0aXNEZWFkOiB0aGlzLmlzRGVhZFxyXG5cdFx0fTtcclxuXHR9XHJcblx0XHJcblx0Z2V0UHJpdmF0ZVBhY2soKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRpZDogdGhpcy5pZCxcclxuXHRcdFx0aGVhbHRoOiB0aGlzLmhlYWx0aCxcclxuXHRcdFx0aGVhbHRoTWF4OiB0aGlzLmhlYWx0aE1heCxcclxuXHRcdFx0ZW5lcmd5OiB0aGlzLmVuZXJneSxcclxuXHRcdFx0ZW5lcmd5TWF4OiB0aGlzLmVuZXJneU1heCxcclxuXHRcdFx0bW92ZVNwZWVkOiB0aGlzLm1vdmVTcGVlZCxcclxuXHRcdFx0YXR0YWNrU3BlZWQ6IHRoaXMuYXR0YWNrU3BlZWQsXHJcblx0XHRcdGF0dGFja1RpbWVyOiB0aGlzLmF0dGFja1RpbWVyLFxyXG5cdFx0XHRpbnZlbnRvcnk6IHRoaXMuZ2V0SW52ZW50b3J5UGFjaygpXHJcblx0XHR9O1xyXG5cdH1cclxuXHRcclxuXHRnZXRJbnZlbnRvcnlQYWNrKCkge1xyXG5cdFx0bGV0IGludmVudG9yeVBhY2sgPSBbXTtcclxuXHRcdFxyXG5cdFx0dGhpcy5pbnZlbnRvcnkuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG5cdFx0XHRpbnZlbnRvcnlQYWNrW2l0ZW0uc2xvdF0gPSBpdGVtLmdldFBhY2soKTtcclxuXHRcdH0pO1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gaW52ZW50b3J5UGFjaztcclxuXHR9XHJcblx0XHJcblx0Y2hlY2tBZG1pbihhY2Nlc3MgPSAxKSB7XHJcblx0XHRpZiAoYWNjZXNzIDwgMSkgYWNjZXNzID0gMTtcclxuXHRcdHJldHVybiAodGhpcy5hZG1pbkFjY2VzcyA+PSBhY2Nlc3MpO1xyXG5cdH1cclxuXHJcblx0b25JbnB1dChkYXRhKSB7XHJcblx0XHRzd2l0Y2ggKGRhdGEuaW5wdXQpIHtcclxuXHRcdFx0Y2FzZSBudWxsOlxyXG5cdFx0XHRjYXNlICdtb3ZlJzogdGhpcy5pbnB1dC5kaXJlY3Rpb24gPSBkYXRhLmRpcmVjdGlvbjtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ3J1bic6IHRoaXMuaW5wdXQucnVuID0gZGF0YS5zdGF0ZTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ3BpY2t1cCc6XHJcblx0XHRcdFx0aWYgKCF0aGlzLmlucHV0LnBpY2t1cCAmJiBkYXRhLnN0YXRlKSB7XHJcblx0XHRcdFx0XHR0aGlzLnBpY2tVcCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLmlucHV0LnBpY2t1cCA9IGRhdGEuc3RhdGU7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdhdHRhY2snOlxyXG5cdFx0XHRcdHRoaXMuaW5wdXQuYXR0YWNrID0gZGF0YS5zdGF0ZTtcclxuXHRcdFx0XHR0aGlzLmF0dGFjaygxLCB0aGlzLmRpcmVjdGlvbik7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdkb3VibGVDbGlja0l0ZW0nOlxyXG5cdFx0XHRcdGlmICh0aGlzLmludmVudG9yeVtkYXRhLnNsb3RdKSB7XHJcblx0XHRcdFx0XHRpZiAoIXRoaXMuaXNEZWFkKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMudXNlSXRlbShkYXRhLnNsb3QpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ3JpZ2h0Q2xpY2tJdGVtJzpcclxuXHRcdFx0XHRpZiAodGhpcy5pbnZlbnRvcnlbZGF0YS5zbG90XSkge1xyXG5cdFx0XHRcdFx0aWYgKCF0aGlzLmlzRGVhZCkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRyb3BJdGVtKGRhdGEuc2xvdCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnZHJhZ1N0b3BHYW1lJzpcclxuXHRcdFx0XHRpZiAodGhpcy5pbnZlbnRvcnlbZGF0YS5zbG90XSkge1xyXG5cdFx0XHRcdFx0aWYgKCF0aGlzLmlzRGVhZCkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRyb3BJdGVtKGRhdGEuc2xvdCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnZHJhZ1N0b3BJbnZlbnRvcnknOlxyXG5cdFx0XHRcdGlmICh0aGlzLmludmVudG9yeVtkYXRhLnNsb3RdKSB7XHJcblx0XHRcdFx0XHRpZiAoIXRoaXMuaXNEZWFkKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMubW92ZUl0ZW1Ub1Nsb3QoZGF0YS5zbG90LCBkYXRhLm5ld1Nsb3QpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ2RyYWdTdG9wRXF1aXBtZW50JzpcclxuXHRcdFx0XHRpZiAodGhpcy5pbnZlbnRvcnlbZGF0YS5zbG90XSkge1xyXG5cdFx0XHRcdFx0aWYgKCF0aGlzLmlzRGVhZCkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLm1vdmVJdGVtVG9TbG90KGRhdGEuc2xvdCwgZGF0YS5uZXdTbG90KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdzZXJ2ZXJDaGF0JzogZ2FtZS5zZW5kU2VydmVyTWVzc2FnZShgJHt0aGlzLm5hbWV9IHllbGxzLCBcIiR7ZGF0YS5tZXNzYWdlfVwiYCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdtYXBDaGF0JzogZ2FtZS5zZW5kTWFwTWVzc2FnZSh0aGlzLm1hcCwgYCR7dGhpcy5uYW1lfSBzYXlzLCBcIiR7ZGF0YS5tZXNzYWdlfVwiYCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdwbGF5ZXJDaGF0JzpcclxuXHRcdFx0XHRsZXQgdGFyZ2V0ID0gdGhpcy5wbGF5ZXJMaXN0W2RhdGEudGFyZ2V0SWRdO1xyXG5cdFx0XHRcdGlmICh0YXJnZXQpIHtcclxuXHRcdFx0XHRcdGdhbWUuc2VuZFBsYXllck1lc3NhZ2UodGFyZ2V0LmlkLCBgJHt0aGlzLm5hbWV9IHdoaXNwZXJzLCBcIiR7ZGF0YS5tZXNzYWdlfVwiYCk7XHJcblx0XHRcdFx0XHRnYW1lLnNlbmRQbGF5ZXJNZXNzYWdlKHRoaXMuaWQsIGBZb3Ugd2hpc3BlciB0byAke3RhcmdldC5uYW1lfSwgXCIke2RhdGEubWVzc2FnZX1cImApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHQvLyBHb2QgSW5wdXRzXHJcblx0XHRcdGNhc2UgJ3NwYXduSXRlbSc6XHJcblx0XHRcdFx0aWYgKHRoaXMuY2hlY2tBZG1pbigyKSkge1xyXG5cdFx0XHRcdFx0Z2FtZS5zcGF3bkl0ZW0oZGF0YS5tYXBJZCwgZGF0YS54LCBkYXRhLnksIGRhdGEudHlwZSwgZGF0YS5zdGFjayk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0Z2FtZS5zZW5kUGxheWVyTWVzc2FnZSh0aGlzLmlkLCBgWW91IGRvbid0IGhhdmUgYWNjZXNzIHRvIHRoYXQgY29tbWFuZC5gKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICd1cGxvYWRNYXAnOlxyXG5cdFx0XHRcdGlmICh0aGlzLmNoZWNrQWRtaW4oMikpIHtcclxuXHRcdFx0XHRcdGdhbWUubWFwTGlzdFtkYXRhLm1hcElkXS51cGxvYWQoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRnYW1lLnNlbmRQbGF5ZXJNZXNzYWdlKHRoaXMuaWQsIGBZb3UgZG9uJ3QgaGF2ZSBhY2Nlc3MgdG8gdGhhdCBjb21tYW5kLmApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0fVxyXG59IiwiaW1wb3J0IGdhbWUgZnJvbSAnLi4vZ2FtZS5qcyc7XHJcbmltcG9ydCB1dGlsIGZyb20gJy4uL3V0aWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGV4dCB7XHJcblx0Y29uc3RydWN0b3IobWFwLCB4LCB5LCBtZXNzYWdlLCBjb2xvdXIgPSAnIzAwMDAwMCcsIHZlbFggPSAwLCB2ZWxZID0gMCkge1xyXG5cdFx0dGhpcy5tYXAgPSBtYXA7XHJcblx0XHR0aGlzLnggPSB4O1xyXG5cdFx0dGhpcy55ID0geTtcclxuXHRcdHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XHJcblx0XHR0aGlzLmNvbG91ciA9IGNvbG91cjtcclxuXHRcdFxyXG5cdFx0dGhpcy52ZWxYID0gdmVsWDtcclxuXHRcdHRoaXMudmVsWSA9IHZlbFk7XHJcblx0XHR0aGlzLnRpbWVyID0gMDtcclxuXHJcblx0XHR0aGlzLmlkID0gdXRpbC5maXJzdEVtcHR5SW5kZXgoZ2FtZS5tYXBMaXN0W3RoaXMubWFwXS50ZXh0cyk7XHJcblx0XHRnYW1lLm1hcExpc3RbdGhpcy5tYXBdLnRleHRzW3RoaXMuaWRdID0gdGhpcztcclxuXHR9XHJcblx0XHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHR0aGlzLnRpbWVyICs9IGRlbHRhO1xyXG5cdFx0aWYgKHRoaXMudGltZXIgPiAzKSB7XHJcblx0XHRcdHRoaXMucmVtb3ZlKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy54ICs9IHRoaXMudmVsWDtcclxuXHRcdHRoaXMueSArPSB0aGlzLnZlbFk7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuZ2V0UGFjaygpO1xyXG5cdH1cclxuXHRcclxuXHRnZXRQYWNrKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0aWQ6IHRoaXMuaWQsXHJcblx0XHRcdG1hcDogdGhpcy5tYXAsXHJcblx0XHRcdHg6IHRoaXMueCxcclxuXHRcdFx0eTogdGhpcy55LFxyXG5cdFx0XHRtZXNzYWdlOiB0aGlzLm1lc3NhZ2UsXHJcblx0XHRcdGNvbG91cjogdGhpcy5jb2xvdXJcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHRyZW1vdmUoKSB7XHJcblx0XHRkZWxldGUgZ2FtZS5tYXBMaXN0W3RoaXMubWFwXS50ZXh0c1t0aGlzLmlkXTtcclxuXHR9XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGlsZSB7XHJcblx0Y29uc3RydWN0b3IoZGF0YSkge1xyXG5cdFx0dGhpcy5sYXllciA9IGRhdGEubGF5ZXI7XHJcbiAgICB0aGlzLndhbGwgPSBkYXRhLndhbGw7XHJcbiAgICB0aGlzLmNhbkF0dGFjayA9IGRhdGEuY2FuQXR0YWNrO1xyXG4gICAgdGhpcy5kYW1hZ2UgPSBkYXRhLmRhbWFnZTtcclxuXHRcdHRoaXMuZGVmZW5jZSA9IGRhdGEuZGVmZW5jZTtcclxuXHRcdHRoaXMuaGVhbHRoTWF4ID0gZGF0YS5oZWFsdGhNYXg7XHJcblx0XHR0aGlzLmhlYWx0aCA9IHRoaXMuaGVhbHRoTWF4O1xyXG5cclxuXHRcdHRoaXMud2FycE1hcCA9IGRhdGEud2FycE1hcDtcclxuXHRcdHRoaXMud2FycFggPSBkYXRhLndhcnBYO1xyXG5cdFx0dGhpcy53YXJwWSA9IGRhdGEud2FycFk7XHJcbiAgfVxyXG5cclxuXHRvbldhbGsoKSB7XHJcblx0XHQvLyBSdW4gTWFwV2FsayNfeF95IHNjcmlwdFxyXG4gIH1cclxuICBcclxuXHRvbkNsaWNrKCkge1xyXG5cdFx0Ly8gUnVuIE1hcENsaWNrI194X3kgc2NyaXB0XHJcbiAgfVxyXG4gIFxyXG5cdG9uQXR0YWNrKCkge1xyXG5cdFx0Ly8gUnVuIE1hcEF0dGFjayNfeF95IHNjcmlwdFxyXG4gIH1cclxuICBcclxuICBnZXRQYWNrKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbGF5ZXI6IHRoaXMubGF5ZXIsXHJcbiAgICAgIHdhbGw6IHRoaXMud2FsbCxcclxuICAgICAgY2FuQXR0YWNrOiB0aGlzLmNhbkF0dGFjayxcclxuICAgICAgZGFtYWdlOiB0aGlzLmRhbWFnZSxcclxuICAgICAgZGVmZW5jZTogdGhpcy5kZWZlbmNlLFxyXG4gICAgICBoZWFsdGhNYXg6IHRoaXMuaGVhbHRoTWF4LFxyXG4gICAgICB3YXJwTWFwOiB0aGlzLndhcnBNYXAsXHJcbiAgICAgIHdhcnBYOiB0aGlzLndhcnBYLFxyXG4gICAgICB3YXJwWTogdGhpcy53YXJwWVxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuIiwiY29uc3QgY29uZmlnID0ge307XHJcblxyXG5jb25maWcuUE9SVCA9IDIwMDA7XHJcbmNvbmZpZy5GUkFNRVJBVEUgPSAxMDAwIC8gNjA7XHJcbmNvbmZpZy5USUxFX1NJWkUgPSAzMjtcclxuY29uZmlnLlNMT1RfU0laRSA9IGNvbmZpZy5USUxFX1NJWkUgKyA2O1xyXG5cclxuY29uZmlnLk1BUF9MQVlFUlMgPSA2O1xyXG5jb25maWcuTUFQX0NPTFVNTlMgPSAxMjtcclxuY29uZmlnLk1BUF9ST1dTID0gMTI7XHJcblxyXG5jb25maWcuTUFYX01BUFMgPSAxMDtcclxuY29uZmlnLk1BWF9VU0VSUyA9IDEwMDtcclxuY29uZmlnLk1BWF9TUFJJVEVTID0gMTM7XHJcbmNvbmZpZy5NQVhfRUZGRUNUUyA9IDcwO1xyXG5cclxuY29uZmlnLk1BWF9IRUFMVEhfQkFTRSA9IDIwMDtcclxuY29uZmlnLk1BWF9IRUFMVEhfQk9OVVMgPSA1NTtcclxuY29uZmlnLk1BWF9FTkVSR1lfQkFTRSA9IDIwMDtcclxuY29uZmlnLk1BWF9FTkVSR1lfQk9OVVMgPSA1NTtcclxuXHJcbmNvbmZpZy5JTlZFTlRPUllfU0laRSA9IDIwO1xyXG5jb25maWcuRVFVSVBNRU5UX1NJWkUgPSA1O1xyXG5cclxuY29uZmlnLlNUQVJUX01BUCA9IDE7XHJcbmNvbmZpZy5TVEFSVF9YID0gNTtcclxuY29uZmlnLlNUQVJUX1kgPSA1O1xyXG5jb25maWcuU1RBUlRfTkFNRSA9ICdOZXcgUGxheWVyJztcclxuY29uZmlnLlNUQVJUX1NQUklURSA9IDE7XHJcbmNvbmZpZy5TVEFSVF9EQU1BR0UgPSAyO1xyXG5jb25maWcuU1RBUlRfREVGRU5DRSA9IDA7XHJcbmNvbmZpZy5TVEFSVF9IRUFMVEhfTUFYID0gMjA7XHJcbmNvbmZpZy5TVEFSVF9FTkVSR1lfTUFYID0gMTA7XHJcblxyXG5jb25maWcuQkFDS1VQX1RJTUUgPSA1O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY29uZmlnO1xyXG4iLCJpbXBvcnQgbW9uZ29qcyBmcm9tIFwibW9uZ29qc1wiO1xyXG5cclxuY29uc3QgbW9uZ28gPSBtb25nb2pzKCdsb2NhbGhvc3Q6MjcwMTcvb2R5c3NleScsIFsnYWNjb3VudHMnLCAncGxheWVycycsICdtYXBzJywgJ2l0ZW1zJywgJ25wY3MnXSk7XHJcblxyXG5jbGFzcyBEYXRhYmFzZSB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAvLyBUaGlzIHNob3VsZCBiZSBoZWxkIGluIGRhdGFiYXNlXHJcbiAgICB0aGlzLml0ZW1zID0gW1xyXG4gICAgICB7XHQvLyB0eXBlIDBcclxuICAgICAgICBuYW1lOiBcIkJsYW5rIEl0ZW1cIixcclxuICAgICAgICBzcHJpdGU6IDY4LFxyXG4gICAgICAgIHR5cGU6ICdub25lJyxcclxuICAgICAgICByZXVzYWJsZTogZmFsc2UsXHJcbiAgICAgICAgXHJcbiAgICAgICAgdXNlOlx0XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgZ2V0Olx0XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgZHJvcDpcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHQvLyB0eXBlIDFcclxuICAgICAgICBuYW1lOiBcIkhlYWx0aCBQb3Rpb25cIixcclxuICAgICAgICBzcHJpdGU6IDEsXHJcbiAgICAgICAgdHlwZTogJ3BvdGlvbicsXHJcbiAgICAgICAgcmV1c2FibGU6IGZhbHNlLFxyXG4gICAgICAgIFxyXG4gICAgICAgIHVzZTpcdFx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSAxMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGVhbHRoICs9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgbmV3IEZsb2F0VGV4dCh0aGlzLmdyaWRQb3NpdGlvbi54LCB0aGlzLmdyaWRQb3NpdGlvbi55LCB2YWx1ZSwgXCIjMDBGRjAwXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaGVhbHRoID4gdGhpcy5oZWFsdGhNYXgpIHtcclxuICAgICAgICAgICAgICAgICAgdGhpcy5oZWFsdGggPSB0aGlzLmhlYWx0aE1heDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgZ2V0Olx0XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgZHJvcDpcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICB9LCBcclxuICAgICAge1x0Ly8gdHlwZSAyXHJcbiAgICAgICAgbmFtZTogXCJFbmVyZ3kgUG90aW9uXCIsXHJcbiAgICAgICAgc3ByaXRlOiAyLFxyXG4gICAgICAgIHR5cGU6ICdwb3Rpb24nLFxyXG4gICAgICAgIHJldXNhYmxlOiBmYWxzZSxcclxuICAgICAgICBcclxuICAgICAgICB1c2U6XHRcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gMTA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVuZXJneSArPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIG5ldyBGbG9hdFRleHQodGhpcy5ncmlkUG9zaXRpb24ueCwgdGhpcy5ncmlkUG9zaXRpb24ueSwgdmFsdWUsIFwiI0ZGRkYwMFwiKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmVuZXJneSA+IHRoaXMuZW5lcmd5TWF4KSB7XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMuZW5lcmd5ID0gdGhpcy5lbmVyZ3lNYXg7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgIGdldDpcdFx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgIGRyb3A6XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgfSwgXHJcbiAgICAgIHtcdC8vIHR5cGUgM1xyXG4gICAgICAgIG5hbWU6IFwiSW5jb2duaXRvXCIsXHJcbiAgICAgICAgc3ByaXRlOiAxMixcclxuICAgICAgICB0eXBlOiAnc3BlY2lhbCcsXHJcbiAgICAgICAgcmV1c2FibGU6IHRydWUsXHJcbiAgICAgICAgXHJcbiAgICAgICAgdXNlOlx0XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3ByaXRlKGdhbWUucm5kLmludGVnZXJJblJhbmdlKDEsIE1BWF9TUFJJVEVTKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgIGdldDpcdFx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgIGRyb3A6XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAge1x0Ly8gdHlwZSA0XHJcbiAgICAgICAgbmFtZTogXCJTd29yZFwiLFxyXG4gICAgICAgIHNwcml0ZTogMTAsXHJcbiAgICAgICAgdHlwZTogJ3dlYXBvbicsXHJcbiAgICAgICAgcmV1c2FibGU6IHRydWUsXHJcbiAgICAgICAgXHJcbiAgICAgICAgdXNlOlx0XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgZ2V0Olx0XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgZHJvcDpcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICBcclxuICAgICAgICBkYW1hZ2VCb251czogMSxcclxuICAgICAgICBkZWZlbmNlQm9udXM6IDAsXHJcbiAgICAgICAgaGVhbHRoTWF4Qm9udXM6IDAsXHJcbiAgICAgICAgZW5lcmd5TWF4Qm9udXM6IDAsXHJcbiAgICAgICAgcmFuZ2VCb251czogMFxyXG4gICAgICAgIFxyXG4gICAgICB9LFxyXG4gICAgICB7XHQvLyB0eXBlIDVcclxuICAgICAgICBuYW1lOiBcIkF4ZVwiLFxyXG4gICAgICAgIHNwcml0ZTogMTQsXHJcbiAgICAgICAgdHlwZTogJ3dlYXBvbicsXHJcbiAgICAgICAgcmV1c2FibGU6IHRydWUsXHJcbiAgICAgICAgXHJcbiAgICAgICAgdXNlOlx0XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgZ2V0Olx0XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgZHJvcDpcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICBcclxuICAgICAgICBkYW1hZ2VCb251czogMixcclxuICAgICAgICBkZWZlbmNlQm9udXM6IDAsXHJcbiAgICAgICAgaGVhbHRoTWF4Qm9udXM6IDAsXHJcbiAgICAgICAgZW5lcmd5TWF4Qm9udXM6IDAsXHJcbiAgICAgICAgcmFuZ2VCb251czogMFxyXG4gICAgICAgIFxyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgXTtcclxuXHJcbiAgICB0aGlzLm1hcHMgPSBbXHJcbiAgICAgIHtcdC8vIGlkIDBcclxuICAgICAgICBuYW1lOiBcIkJsYW5rIE1hcFwiLFxyXG4gICAgICAgIGRyb3BDaGFuY2U6IDEwMCxcclxuICAgICAgICBkcm9wQW1vdW50RVE6IDAsXHJcbiAgICAgICAgam9pbjpcdFx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgIGxlYXZlOlx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICB7XHQvLyBpZCAxXHJcbiAgICAgICAgbmFtZTogXCJDcmVuZGFsZSAxXCIsXHJcbiAgICAgICAgZHJvcENoYW5jZTogMTAwLFxyXG4gICAgICAgIGRyb3BBbW91bnRFUTogMCxcclxuICAgICAgICBqb2luOlx0XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgbGVhdmU6XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcdC8vIGlkIDJcclxuICAgICAgICBuYW1lOiBcIkNyZW5kYWxlIDJcIixcclxuICAgICAgICBkcm9wQ2hhbmNlOiAxMDAsXHJcbiAgICAgICAgZHJvcEFtb3VudEVROiAwLFxyXG4gICAgICAgIGpvaW46XHRcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICBsZWF2ZTpcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAge1x0Ly8gaWQgM1xyXG4gICAgICAgIG5hbWU6IFwiQ3JlbmRhbGUgM1wiLFxyXG4gICAgICAgIGRyb3BDaGFuY2U6IDEwMCxcclxuICAgICAgICBkcm9wQW1vdW50RVE6IDAsXHJcbiAgICAgICAgam9pbjpcdFx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgIGxlYXZlOlx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICB7XHQvLyBpZCA0XHJcbiAgICAgICAgbmFtZTogXCJDcmVuZGFsZSA0XCIsXHJcbiAgICAgICAgZHJvcENoYW5jZTogMTAwLFxyXG4gICAgICAgIGRyb3BBbW91bnRFUTogMCxcclxuICAgICAgICBqb2luOlx0XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgbGVhdmU6XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcdC8vIGlkIDVcclxuICAgICAgICBuYW1lOiBcIkNyZW5kYWxlIDVcIixcclxuICAgICAgICBkcm9wQ2hhbmNlOiAxMDAsXHJcbiAgICAgICAgZHJvcEFtb3VudEVROiAwLFxyXG4gICAgICAgIGpvaW46XHRcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICBsZWF2ZTpcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAge1x0Ly8gaWQgNlxyXG4gICAgICAgIG5hbWU6IFwiQ3JlbmRhbGUgNlwiLFxyXG4gICAgICAgIGRyb3BDaGFuY2U6IDEwMCxcclxuICAgICAgICBkcm9wQW1vdW50RVE6IDAsXHJcbiAgICAgICAgam9pbjpcdFx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgIGxlYXZlOlx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICB7XHQvLyBpZCA3XHJcbiAgICAgICAgbmFtZTogXCJDcmVuZGFsZSA3XCIsXHJcbiAgICAgICAgZHJvcENoYW5jZTogMTAwLFxyXG4gICAgICAgIGRyb3BBbW91bnRFUTogMCxcclxuICAgICAgICBqb2luOlx0XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgbGVhdmU6XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcdC8vIGlkIDhcclxuICAgICAgICBuYW1lOiBcIkNyZW5kYWxlIDhcIixcclxuICAgICAgICBkcm9wQ2hhbmNlOiAxMDAsXHJcbiAgICAgICAgZHJvcEFtb3VudEVROiAwLFxyXG4gICAgICAgIGpvaW46XHRcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICBsZWF2ZTpcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAge1x0Ly8gaWQgOVxyXG4gICAgICAgIG5hbWU6IFwiQ3JlbmRhbGUgOVwiLFxyXG4gICAgICAgIGRyb3BDaGFuY2U6IDEwMCxcclxuICAgICAgICBkcm9wQW1vdW50RVE6IDAsXHJcbiAgICAgICAgam9pbjpcdFx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgIGxlYXZlOlx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgXTtcclxuXHJcbiAgICB0aGlzLnBsYXllcnMgPSBbXHJcbiAgICAgIHtcdC8vaWQgMFxyXG4gICAgICAgIG5hbWU6IFwiRmFua2Fkb3JlXCIsXHJcbiAgICAgICAgc3ByaXRlOiAxLFxyXG4gICAgICAgIGFkbWluQWNjZXNzOiAwLFxyXG4gICAgICAgIG1hcDogMSxcclxuICAgICAgICB4OiA1LFxyXG4gICAgICAgIHk6IDUsXHJcbiAgICAgICAgZGFtYWdlQmFzZTogMTAsXHJcbiAgICAgICAgZGVmZW5jZUJhc2U6IDIsXHJcbiAgICAgICAgaGVhbHRoTWF4QmFzZTogMjAsXHJcbiAgICAgICAgZW5lcmd5TWF4QmFzZTogNDBcclxuICAgICAgfSxcclxuICAgICAge1x0Ly9pZCAxXHJcbiAgICAgICAgbmFtZTogXCJPYmJpdHRcIixcclxuICAgICAgICBzcHJpdGU6IDMsXHJcbiAgICAgICAgYWRtaW5BY2Nlc3M6IDAsXHJcbiAgICAgICAgbWFwOiAxLFxyXG4gICAgICAgIHg6IDQsXHJcbiAgICAgICAgeTogNCxcclxuICAgICAgICBkYW1hZ2VCYXNlOiAxMCxcclxuICAgICAgICBkZWZlbmNlQmFzZTogMixcclxuICAgICAgICBoZWFsdGhNYXhCYXNlOiAyMCxcclxuICAgICAgICBlbmVyZ3lNYXhCYXNlOiA0MFxyXG4gICAgICB9LFxyXG4gICAgICB7XHQvL2lkIDJcclxuICAgICAgICBuYW1lOiBcIkZyb2xpa1wiLFxyXG4gICAgICAgIHNwcml0ZTogNSxcclxuICAgICAgICBhZG1pbkFjY2VzczogMCxcclxuICAgICAgICBtYXA6IDEsXHJcbiAgICAgICAgeDogNSxcclxuICAgICAgICB5OiA1LFxyXG4gICAgICAgIGRhbWFnZUJhc2U6IDEwLFxyXG4gICAgICAgIGRlZmVuY2VCYXNlOiAyLFxyXG4gICAgICAgIGhlYWx0aE1heEJhc2U6IDIwLFxyXG4gICAgICAgIGVuZXJneU1heEJhc2U6IDQwXHJcbiAgICAgIH0sXHJcbiAgICBdO1xyXG5cclxuICAgIHRoaXMuYm90cyA9IFtcclxuICAgICAge1x0Ly9pZCAwXHJcbiAgICAgICAgbmFtZTogXCJSYXRcIixcclxuICAgICAgICBzcHJpdGU6IDAsXHJcbiAgICAgICAgZGFtYWdlOiAxLFxyXG4gICAgICAgIGhlYWx0aE1heDogMyxcclxuICAgICAgfSxcclxuICAgICAge1x0Ly9pZCAxXHJcbiAgICAgICAgbmFtZTogXCJTbmFrZVwiLFxyXG4gICAgICAgIHNwcml0ZTogMSxcclxuICAgICAgICBkYW1hZ2U6IDIsXHJcbiAgICAgICAgaGVhbHRoTWF4OiA1LFxyXG4gICAgICB9LFxyXG4gICAgXTtcclxuXHJcbiAgfVxyXG5cclxuXHRsb2cobWVzc2FnZSkge1xyXG5cdFx0Y29uc29sZS5sb2cobWVzc2FnZSk7XHJcblx0fVxyXG5cclxuICBmaW5kKHVzZXJuYW1lKSB7XHJcbiAgICBtb25nby5hY2NvdW50cy5maW5kT25lKHt1c2VybmFtZTogdXNlcm5hbWV9LCAoZXJyLCByZXMpID0+IHtcclxuICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xyXG4gICAgICBpZiAocmVzKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB0aGlzLmxvZyhgUGxheWVyIG5vdCBmb3VuZCB3aXRoIHVzZXJuYW1lOiAke3VzZXJuYW1lfWApO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldFBsYXllckRhdGEoaWQpIHtcclxuICAgIGxldCBwbGF5ZXJEYXRhID0ge307XHJcblxyXG4gICAgaWYgKHRoaXMucGxheWVyc1tpZF0pIHtcdC8vIEZyb20gRGF0YWJhc2VcclxuICAgICAgcGxheWVyRGF0YSA9IHRoaXMucGxheWVyc1tpZF07XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcdC8vIEZpcnN0IExvZ2luXHJcbiAgICAgIHBsYXllckRhdGEubmFtZSA9IGNvbmZpZy5TVEFSVF9OQU1FO1xyXG4gICAgICBwbGF5ZXJEYXRhLnNwcml0ZSA9IGNvbmZpZy5TVEFSVF9TUFJJVEU7XHJcbiAgICAgIHBsYXllckRhdGEuYWRtaW5BY2Nlc3MgPSAwO1xyXG4gICAgICBcclxuICAgICAgcGxheWVyRGF0YS5tYXAgPSBjb25maWcuU1RBUlRfTUFQO1xyXG4gICAgICBwbGF5ZXJEYXRhLnggPSBjb25maWcuU1RBUlRfWDtcclxuICAgICAgcGxheWVyRGF0YS55ID0gY29uZmlnLlNUQVJUX1k7XHJcbiAgICAgIFxyXG4gICAgICBwbGF5ZXJEYXRhLmRhbWFnZUJhc2UgPSBjb25maWcuU1RBUlRfREFNQUdFO1xyXG4gICAgICBwbGF5ZXJEYXRhLmRlZmVuY2VCYXNlID0gY29uZmlnLlNUQVJUX0RFRkVOQ0U7XHJcbiAgICAgIHBsYXllckRhdGEuaGVhbHRoTWF4QmFzZSA9IGNvbmZpZy5TVEFSVF9IRUFMVEhfTUFYO1xyXG4gICAgICBwbGF5ZXJEYXRhLmVuZXJneU1heEJhc2UgPSBjb25maWcuU1RBUlRfRU5FUkdZX01BWDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcmV0dXJuIHBsYXllckRhdGE7XHJcbiAgfVxyXG5cclxuICBzYXZlUGxheWVyRGF0YShkYXRhKSB7XHJcbiAgICAvL21vbmdvLnBsYXllcnMuc2F2ZShkYXRhLmlkLCBkYXRhKTtcclxuICB9XHJcblxyXG4gIGdldE1hcERhdGEoaWQpIHtcclxuICAgIGxldCBtYXBEYXRhID0ge307XHJcblxyXG4gICAgaWYgKHRoaXMubWFwc1tpZF0pIHtcclxuICAgICAgbWFwRGF0YSA9IHRoaXMubWFwc1tpZF07XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgbWFwRGF0YS5uYW1lID0gXCJCbGFuayBNYXBcIjtcclxuICAgICAgbWFwRGF0YS5pdGVtcyA9IFtdO1xyXG4gICAgICBtYXBEYXRhLmJvdHMgPSBbXTtcclxuICAgICAgbWFwRGF0YS5lZmZlY3RzID0gW107XHJcbiAgICAgIG1hcERhdGEudGV4dHMgPSBbXTtcclxuICAgICAgbWFwRGF0YS5kcm9wQ2hhbmNlID0gMTAwO1xyXG4gICAgICBtYXBEYXRhLmRyb3BBbW91bnRFUSA9IDU7XHJcbiAgICAgIG1hcERhdGEudGlsZXMgPSB7XHJcbiAgICAgICAgbGF5ZXI6IFsgXHJcbiAgICAgICAgICBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXHJcbiAgICAgICAgICBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXHJcbiAgICAgICAgICBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXHJcbiAgICAgICAgICBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXHJcbiAgICAgICAgICBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXHJcbiAgICAgICAgICBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXHJcbiAgICAgICAgXSxcclxuICAgICAgICB3YWxsOiBbZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZV0sXHJcbiAgICAgICAgY2FuQXR0YWNrOiBbZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZV0sXHJcbiAgICAgICAgZGFtYWdlOiBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXHJcbiAgICAgICAgZGVmZW5jZTogWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxyXG4gICAgICAgIGhlYWx0aE1heDogWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxyXG4gICAgICAgIHdhcnBNYXA6IFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcclxuICAgICAgICB3YXJwWDogWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxyXG4gICAgICAgIHdhcnBZOiBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF1cclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbWFwRGF0YTtcclxuICB9XHJcbiAgXHJcbiAgc2F2ZU1hcERhdGEoZGF0YSkge1xyXG4gICAgbW9uZ28ubWFwcy5zYXZlKGRhdGEuaWQsIGRhdGEpO1xyXG4gIH1cclxuXHJcbiAgZ2V0Qm90RGF0YShyZWYpIHtcclxuICAgIHJldHVybiB0aGlzLmJvdHNbcmVmXTtcclxuICB9XHJcbn1cclxuXHJcbmNvbnN0IGRiID0gbmV3IERhdGFiYXNlKCk7XHJcbmV4cG9ydCBkZWZhdWx0IGRiO1xyXG4iLCJpbXBvcnQgZnMgZnJvbSAnZnMnO1xyXG5cclxuaW1wb3J0IE1hcCBmcm9tICcuL2NsYXNzZXMvbWFwLmpzJztcclxuaW1wb3J0IFBsYXllciBmcm9tICcuL2NsYXNzZXMvcGxheWVyLmpzJztcclxuaW1wb3J0IGRiIGZyb20gJy4vZGIuanMnO1xyXG5pbXBvcnQgY29uZmlnIGZyb20gJy4vY29uZmlnLmpzJztcclxuaW1wb3J0IEJvdCBmcm9tICcuL2NsYXNzZXMvYm90LmpzJztcclxuXHJcbmNsYXNzIEdhbWUge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0dGhpcy5wbGF5ZXJMaXN0ID0gW107XHJcblx0XHR0aGlzLm1hcExpc3QgPSBbXTtcclxuXHRcdHRoaXMubWVzc2FnZVF1ZXVlID0gW107XHJcblxyXG5cdFx0dGhpcy5jcmVhdGVNYXBzKCk7XHJcblx0fVxyXG5cclxuXHRjcmVhdGVNYXBzKCkge1xyXG5cdFx0dGhpcy5tYXBEYXRhID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoJy4vc2VydmVyL2RhdGEvbWFwLmpzb24nLCAndXRmOCcpKTtcclxuXHRcdGZvciAobGV0IGlkID0gMDsgaWQgPCBjb25maWcuTUFYX01BUFM7IGlkKyspIHtcclxuXHRcdFx0dGhpcy5tYXBMaXN0W2lkXSA9IG5ldyBNYXAoaWQsIHRoaXMubWFwRGF0YVtpZF0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHRsZXQgcGFjayA9IHtcclxuXHRcdFx0cGxheWVyczogW10sXHJcblx0XHRcdG1hcHM6IFtdXHJcblx0XHR9O1xyXG5cdFx0XHJcblx0XHR0aGlzLnBsYXllckxpc3QuZm9yRWFjaCgocGxheWVyKSA9PiB7XHJcblx0XHRcdHBhY2sucGxheWVyc1twbGF5ZXIuaWRdID0gcGxheWVyLnVwZGF0ZShkZWx0YSk7XHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdFx0dGhpcy5tYXBMaXN0LmZvckVhY2goKG1hcCkgPT4ge1xyXG5cdFx0XHRwYWNrLm1hcHNbbWFwLmlkXSA9IG1hcC51cGRhdGUoZGVsdGEpO1xyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcdHJldHVybiBwYWNrO1xyXG5cdH1cclxuXHJcblx0cGxheWVyTG9naW4oaWQpIHtcclxuXHRcdGxldCBwbGF5ZXIgPSBuZXcgUGxheWVyKGlkKTtcclxuXHRcdHRoaXMucGxheWVyTGlzdFtpZF0gPSBwbGF5ZXI7XHJcblx0XHR0aGlzLnNlbmRTZXJ2ZXJNZXNzYWdlKGAke3BsYXllci5uYW1lfSBoYXMgbG9nZ2VkIGluLmApO1xyXG5cdFx0cmV0dXJuIHBsYXllcjtcclxuXHR9XHJcblx0XHJcblx0cGxheWVyTG9nb3V0KGlkKSB7XHJcblx0XHRsZXQgcGxheWVyID0gdGhpcy5wbGF5ZXJMaXN0W2lkXTtcclxuXHRcdGlmIChwbGF5ZXIpIHtcclxuXHRcdFx0ZGIuc2F2ZVBsYXllckRhdGEocGxheWVyLmdldFBhY2spO1xyXG5cdFx0XHR0aGlzLnNlbmRTZXJ2ZXJNZXNzYWdlKGAke3BsYXllci5uYW1lfSBoYXMgbG9nZ2VkIG91dC5gKTtcclxuXHRcdFx0ZGVsZXRlIHRoaXMucGxheWVyTGlzdFtpZF07XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzZW5kU2VydmVyTWVzc2FnZShtZXNzYWdlKSB7XHJcblx0XHR0aGlzLm1lc3NhZ2VRdWV1ZS5wdXNoKHttZXNzYWdlfSk7XHJcblx0fVxyXG5cclxuXHRzZW5kTWFwTWVzc2FnZShtYXAsIG1lc3NhZ2UpIHtcclxuXHRcdHRoaXMubWVzc2FnZVF1ZXVlLnB1c2goe21lc3NhZ2UsIG1hcH0pO1xyXG5cdH1cclxuXHJcblx0c2VuZFBsYXllck1lc3NhZ2UoaWQsIG1lc3NhZ2UpIHtcclxuXHRcdHRoaXMubWVzc2FnZVF1ZXVlLnB1c2goe21lc3NhZ2UsIGlkfSk7XHJcblx0fVxyXG5cclxuXHRjaGVja1ZhY2FudChtYXBJZCwgeCwgeSkge1xyXG5cdFx0Ly8gQ2hlY2sgZm9yIE1hcCBFZGdlc1xyXG5cdFx0aWYgKHggPCAwIHx8IHggPj0gY29uZmlnLk1BUF9DT0xVTU5TKSByZXR1cm4gZmFsc2U7XHJcblx0XHRpZiAoeSA8IDAgfHwgeSA+PSBjb25maWcuTUFQX1JPV1MpIHJldHVybiBmYWxzZTtcclxuXHRcdFxyXG5cdFx0bGV0IG1hcCA9IHRoaXMubWFwTGlzdFttYXBJZF07XHJcblx0XHRcclxuXHRcdC8vIENoZWNrIGZvciBXYWxsIFRpbGVzXHJcblx0XHRpZiAobWFwLnRpbGVzW3ldW3hdLndhbGwgPT09IHRydWUpIHJldHVybiBmYWxzZTtcclxuXHRcdFxyXG5cdFx0Ly8gQ2hlY2sgZm9yIEJvdHNcclxuXHRcdGxldCBib3RzID0gbWFwLmJvdHMuZmlsdGVyKChib3QpID0+IHtcclxuXHRcdFx0aWYgKGJvdC54ID09PSB4ICYmIGJvdC55ID09PSB5ICYmICFib3QuaXNEZWFkKSByZXR1cm4gdHJ1ZTtcclxuXHRcdH0pO1xyXG5cdFx0aWYgKGJvdHMubGVuZ3RoID4gMCkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHJcblx0XHQvLyBDaGVjayBmb3IgUGxheWVyc1xyXG5cdFx0bGV0IHBsYXllcnMgPSB0aGlzLnBsYXllckxpc3QuZmlsdGVyKChwbGF5ZXIpID0+IHtcclxuXHRcdFx0aWYgKHBsYXllci5tYXAgPT09IG1hcC5pZCAmJiBwbGF5ZXIueCA9PT0geCAmJiBwbGF5ZXIueSA9PT0geSAmJiAhcGxheWVyLmlzRGVhZCkgcmV0dXJuIHRydWU7XHJcblx0XHR9KTtcclxuXHRcdGlmIChwbGF5ZXJzLmxlbmd0aCA+IDApIHJldHVybiBmYWxzZTtcclxuXHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdHNwYXduQm90KHJlZiwgbWFwSWQsIHgsIHkpIHtcclxuXHRcdG5ldyBCb3QocmVmLCBtYXBJZCwgeCwgeSk7XHJcblx0fVxyXG59XHJcblxyXG5jb25zdCBnYW1lID0gbmV3IEdhbWUoKTtcclxuZXhwb3J0IGRlZmF1bHQgZ2FtZTtcclxuIiwiLyoqKiBHYW1lIExvb3AgKioqL1xyXG4vKiBLZWVwcyB0cmFjayBvZiB0aW1lIGFuZCBjby1vcmRpbmF0ZXMgdGhlIGdhbWUgYW5kIHNlcnZlciAqL1xyXG5cclxuaW1wb3J0IE5vZGVHYW1lTG9vcCBmcm9tICdub2RlLWdhbWVsb29wJztcclxuXHJcbmltcG9ydCBkYiBmcm9tICcuL2RiLmpzJztcclxuaW1wb3J0IGdhbWUgZnJvbSAnLi9nYW1lLmpzJztcclxuaW1wb3J0IHNlcnZlciBmcm9tICcuL3NlcnZlci5qcyc7XHJcbmltcG9ydCBjb25maWcgZnJvbSAnLi9jb25maWcuanMnO1xyXG5cclxuY2xhc3MgR2FtZUxvb3Age1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5pZCA9IG51bGw7XHJcbiAgICB0aGlzLnRpbWVyID0ge1xyXG4gICAgICBiYWNrdXA6IDBcclxuICAgIH07XHJcbiAgICB0aGlzLnN0YXJ0KCk7XHJcbiAgfVxyXG4gIHN0YXJ0KCkge1xyXG4gICAgdGhpcy5pZCA9IE5vZGVHYW1lTG9vcC5zZXRHYW1lTG9vcCgoZGVsdGEpID0+IHtcclxuICAgICAgLy8gVXBkYXRlIHRoZSBnYW1lIHN0YXRlXHJcbiAgICAgIGxldCB1cGRhdGVQYWNrID0gZ2FtZS51cGRhdGUoZGVsdGEpO1xyXG4gICAgICBcclxuICAgICAgLy8gU2VuZCB1cGRhdGVkIHN0YXRlIHRvIGNsaWVudHNcclxuICAgICAgc2VydmVyLnNlbmRVcGRhdGVQYWNrKHVwZGF0ZVBhY2spO1xyXG4gICAgICBcclxuICAgICAgLy8gUGVyaW9kaWMgYmFja3VwIHRvIGRhdGFiYXNlXHJcbiAgICAgIHRoaXMudGltZXIuYmFja3VwICs9IGRlbHRhO1xyXG4gICAgICBpZiAodGhpcy50aW1lci5iYWNrdXAgPj0gY29uZmlnLkJBQ0tVUF9USU1FKSB7XHJcbiAgICAgICAgdGhpcy50aW1lci5iYWNrdXAgLT0gY29uZmlnLkJBQ0tVUF9USU1FO1xyXG4gICAgICAgIC8vIFNBVkUgU1RBVEVcclxuICAgICAgfVxyXG4gICAgfSwgY29uZmlnLkZSQU1FUkFURSk7XHJcbiAgfVxyXG59XHJcblxyXG5jb25zdCBnYW1lTG9vcCA9IG5ldyBHYW1lTG9vcCgpO1xyXG5leHBvcnQgZGVmYXVsdCBnYW1lTG9vcDsiLCJpbXBvcnQgZGIgZnJvbSAnLi9kYi5qcyc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4vZ2FtZS5qcyc7XHJcbmltcG9ydCBzZXJ2ZXIgZnJvbSAnLi9zZXJ2ZXIuanMnO1xyXG5pbXBvcnQgZ2FtZWxvb3AgZnJvbSAnLi9nYW1lbG9vcC5qcyc7XHJcbiIsImltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xyXG5pbXBvcnQgaHR0cCBmcm9tICdodHRwJztcclxuaW1wb3J0IHNvY2tldElPIGZyb20gJ3NvY2tldC5pbyc7XHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xyXG5cclxuaW1wb3J0IGRiIGZyb20gJy4vZGIuanMnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuL2dhbWUuanMnO1xyXG5pbXBvcnQgY29uZmlnIGZyb20gJy4vY29uZmlnLmpzJztcclxuaW1wb3J0IHV0aWwgZnJvbSAnLi91dGlsLmpzJztcclxuXHJcbmNsYXNzIFNlcnZlciB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHRjb25zdCBhcHAgPSBleHByZXNzKCk7XHJcblx0XHRjb25zdCBzZXJ2ZXIgPSBodHRwLlNlcnZlcihhcHApO1xyXG5cdFx0Y29uc3QgaW8gPSBzb2NrZXRJTyhzZXJ2ZXIpO1xyXG5cdFx0Y29uc3QgcG9ydCA9IHByb2Nlc3MuZW52LlBPUlQgfHwgY29uZmlnLlBPUlQ7XHJcblx0XHRjb25zdCBwdWJsaWNQYXRoID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uL2NsaWVudCcpO1xyXG5cdFx0XHJcblx0XHRhcHAuZ2V0KCcvJywgKHJlcSwgcmVzKSA9PiByZXMuc2VuZEZpbGUocHVibGljUGF0aCArICcvaW5kZXguaHRtbCcpKTtcclxuXHRcdGFwcC51c2UoJy9jbGllbnQnLCBleHByZXNzLnN0YXRpYyhwdWJsaWNQYXRoKSk7XHJcblx0XHRzZXJ2ZXIubGlzdGVuKHBvcnQsICgpID0+IGRiLmxvZyhgU2VydmVyIHN0YXJ0ZWQuIExpc3RlbmluZyBvbiAke3NlcnZlci5hZGRyZXNzKCkucG9ydH1gKSk7XHJcblxyXG5cdFx0dGhpcy5zb2NrZXRMaXN0ID0gW107XHJcblx0XHRpby5zb2NrZXRzLm9uKCdjb25uZWN0aW9uJywgKHNvY2tldCkgPT4gdGhpcy5vbkNvbm5lY3Qoc29ja2V0KSk7XHJcblx0fVxyXG5cclxuXHQvLyBSZWNlaXZlIGRhdGEgZnJvbSBjbGllbnRzXHJcblx0b25Db25uZWN0KHNvY2tldCkge1xyXG5cdFx0c29ja2V0LmlkID0gdXRpbC5maXJzdEVtcHR5SW5kZXgodGhpcy5zb2NrZXRMaXN0KTtcclxuXHRcdHRoaXMuc29ja2V0TGlzdFtzb2NrZXQuaWRdID0gc29ja2V0O1xyXG5cdFx0ZGIubG9nKGBOZXcgQ29ubmVjdGlvbjogSWQgJHtzb2NrZXQuaWR9YCk7XHJcblx0XHRcclxuXHRcdHNvY2tldC5vbignZGlzY29ubmVjdCcsICgpID0+IHRoaXMub25EaXNjb25uZWN0KHNvY2tldC5pZCkpO1xyXG5cdFx0c29ja2V0Lm9uKCdsb2dpbicsICgpID0+IHRoaXMub25Mb2dpbihzb2NrZXQuaWQpKTtcclxuXHRcdHNvY2tldC5vbignbG9nb3V0JywgKCkgPT4gdGhpcy5vbkxvZ291dChzb2NrZXQuaWQpKTtcclxuXHR9XHJcblxyXG5cdG9uRGlzY29ubmVjdChpZCkge1xyXG5cdFx0aWYgKGdhbWUucGxheWVyTGlzdFtpZF0pIHtcclxuXHRcdFx0Z2FtZS5wbGF5ZXJMb2dvdXQoaWQpO1xyXG5cdFx0fVxyXG5cdFx0ZGVsZXRlIHRoaXMuc29ja2V0TGlzdFtpZF07XHJcblx0XHRkYi5sb2coYERpc2Nvbm5lY3RlZDogSWQgJHtpZH1gKTtcclxuXHR9XHJcblxyXG5cdG9uTG9naW4oaWQpIHtcdFx0XHJcblx0XHQvLyBDcmVhdGUgUGxheWVyXHJcblx0XHRsZXQgcGxheWVyID0gZ2FtZS5wbGF5ZXJMb2dpbihpZCk7XHJcblx0XHRcclxuXHRcdC8vIFJlY2VpdmUgSW5wdXRzXHJcblx0XHRsZXQgc29ja2V0ID0gdGhpcy5zb2NrZXRMaXN0W2lkXTtcclxuXHRcdHNvY2tldC5vbignaW5wdXQnLCAoZGF0YSkgPT4gcGxheWVyLm9uSW5wdXQoZGF0YSkpO1xyXG5cdH1cclxuXHRcclxuXHRvbkxvZ291dChpZCkge1xyXG5cdFx0Z2FtZS5wbGF5ZXJMb2dvdXQoaWQpO1xyXG5cdH1cclxuXHRcclxuXHQvLyBTZW5kIGRhdGEgdG8gY2xpZW50c1xyXG5cdHNlbmRVcGRhdGVQYWNrKHVwZGF0ZVBhY2spIHtcclxuXHRcdGdhbWUucGxheWVyTGlzdC5mb3JFYWNoKChwbGF5ZXIpID0+IHtcclxuXHRcdFx0bGV0IHBhY2sgPSB7fTtcclxuXHRcdFx0cGFjay5wcml2YXRlID0gcGxheWVyLmdldFByaXZhdGVQYWNrKCk7XHJcblx0XHRcdHBhY2sucGxheWVycyA9IHVwZGF0ZVBhY2sucGxheWVycy5maWx0ZXIoKHBsYXllckRhdGEpID0+IHtcclxuXHRcdFx0XHRyZXR1cm4gKHBsYXllckRhdGEubWFwID09PSBwbGF5ZXIubWFwKTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdHBhY2subWFwID0gdXBkYXRlUGFjay5tYXBzW3BsYXllci5tYXBdO1xyXG5cdFx0XHRcclxuXHRcdFx0bGV0IHNvY2tldCA9IHRoaXMuc29ja2V0TGlzdFtwbGF5ZXIuaWRdO1xyXG5cdFx0XHRzb2NrZXQuZW1pdCgndXBkYXRlJywgcGFjayk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0XHJcblx0c2VuZE1hcERhdGEobWFwSWQpIHtcclxuXHRcdGdhbWUucGxheWVyTGlzdC5mb3JFYWNoKChwbGF5ZXIpID0+IHtcclxuXHRcdFx0aWYgKHBsYXllci5tYXAgPT09IG1hcElkKSB7XHJcblx0XHRcdFx0bGV0IHNvY2tldCA9IHRoaXMuc29ja2V0TGlzdFtwbGF5ZXIuaWRdO1xyXG5cdFx0XHRcdHNvY2tldC5lbWl0KCdsb2FkTWFwJywgZGIubWFwW21hcElkXSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcbn1cclxuXHJcbmNvbnN0IHNlcnZlciA9IG5ldyBTZXJ2ZXIoKTtcclxuZXhwb3J0IGRlZmF1bHQgc2VydmVyO1xyXG4iLCJmdW5jdGlvbiBzaHVmZmxlKGFycmF5KSB7XHJcbiAgbGV0IGN1cnJlbnRJbmRleCA9IGFycmF5Lmxlbmd0aDtcclxuICBsZXQgdGVtcDtcclxuICBsZXQgcmFuZG9tSW5kZXg7XHJcbiAgd2hpbGUgKGN1cnJlbnRJbmRleCAhPT0gMCkge1xyXG4gICAgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyZW50SW5kZXgpO1xyXG4gICAgY3VycmVudEluZGV4IC09IDE7XHJcbiAgICB0ZW1wID0gYXJyYXlbY3VycmVudEluZGV4XTtcclxuICAgIGFycmF5W2N1cnJlbnRJbmRleF0gPSBhcnJheVtyYW5kb21JbmRleF07XHJcbiAgICBhcnJheVtyYW5kb21JbmRleF0gPSB0ZW1wO1xyXG4gIH1cclxuICByZXR1cm4gYXJyYXk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN3YXAoYXJyYXksIGksIGopIHtcclxuICBsZXQgdGVtcCA9IGFycmF5W2ldO1xyXG4gIGFycmF5W2ldID0gYXJyYXlbal07XHJcbiAgYXJyYXlbal0gPSB0ZW1wO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmaXJzdEVtcHR5SW5kZXgoYXJyYXkpIHtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8PSBhcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgaWYgKCFhcnJheVtpXSkge1xyXG4gICAgICByZXR1cm4gaTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxlcnAoc3RhcnQsIGVuZCwgdGltZSkge1xyXG4gIC8vcmV0dXJuIHN0YXJ0ICsgKHRpbWUgKiAoZW5kIC0gc3RhcnQpKTtcclxuICByZXR1cm4gKCgxIC0gdGltZSkgKiBzdGFydCkgKyAodGltZSAqIGVuZCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNsYW1wKHZhbHVlLCBtaW5pbXVtLCBtYXhpbXVtKSB7XHJcbiAgaWYgKHZhbHVlIDwgbWluaW11bSkge1xyXG4gICAgcmV0dXJuIG1pbmltdW07XHJcbiAgfVxyXG4gIGVsc2UgaWYgKHZhbHVlID4gbWF4aW11bSkge1xyXG4gICAgcmV0dXJuIG1heGltdW07XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHNodWZmbGUsXHJcbiAgc3dhcCxcclxuICBmaXJzdEVtcHR5SW5kZXgsXHJcbiAgbGVycCxcclxuICBjbGFtcFxyXG59OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV4cHJlc3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZnNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaHR0cFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJtb25nb2pzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm5vZGUtZ2FtZWxvb3BcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJzb2NrZXQuaW9cIik7Il0sInNvdXJjZVJvb3QiOiIifQ==
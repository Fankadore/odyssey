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

		let targetList = _game_js__WEBPACK_IMPORTED_MODULE_1__["default"].playerList.filter((player) => {
			if (player === this || player.isDead) return false;
			if (!this.checkInRange(direction, player, this.range)) return false;
			return true;
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
			if (bot.x === x && bot.y === y) return true;
		});
		if (bots.length > 0) return false;
		
		// Check for Players
		let players = this.playerList.filter((player) => {
			if (player.map === map.id && player.x === x && player.y === y && !player.isDead) return true;
		});
		if (players.length > 0) return false;

		return true;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL2FjdG9yLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy9lbnRpdHkuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL21hcC5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2NsYXNzZXMvcGxheWVyLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy90ZXh0LmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy90aWxlLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY29uZmlnLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvZGIuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9nYW1lLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvZ2FtZWxvb3AuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9tYWluLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvc2VydmVyLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvdXRpbC5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJleHByZXNzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZnNcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJodHRwXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibW9uZ29qc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcIm5vZGUtZ2FtZWxvb3BcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJwYXRoXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwic29ja2V0LmlvXCIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQXlDLGlDQUFpQztBQUMxRSx3SEFBZ0gsbUJBQW1CLEVBQUU7QUFDckk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbUJBQW1CO0FBQ25CO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsNklBQXFEO0FBQ3RFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLCtEQUErRDs7QUFFL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxzQkFBc0I7QUFDdEIsR0FBRzs7QUFFSDs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLFlBQVksUUFBUSxVQUFVLE9BQU8sT0FBTztBQUM5RDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJOztBQUVKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7O0FBRUo7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBLHFCQUFxQiwwRUFBOEI7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUixxQkFBcUIsMEVBQThCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwRkFBOEM7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx5REFBeUQ7O0FBRXpELGdDQUFnQztBQUNoQyxrRkFBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUIsdUVBQTJCO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0JBQW9CLDBFQUE4QjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQzd3QkE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ2RBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQixvRUFBd0I7QUFDekM7QUFDQSxrQkFBa0IsaUVBQXFCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixpRUFBcUI7QUFDdEMsa0JBQWtCLG9FQUF3QjtBQUMxQyxtQkFBbUIsbUVBQXVCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsaUJBQWlCLGlFQUFxQjtBQUN0QztBQUNBLGtCQUFrQixvRUFBd0I7QUFDMUM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlCQUFpQixtRUFBdUI7QUFDeEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsSUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxvQ0FBb0M7QUFDcEMsc0NBQXNDO0FBQ3RDLDBDQUEwQztBQUMxQywwQ0FBMEM7QUFDMUM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0Esc0JBQXNCOztBQUV0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRGQUFnRCxVQUFVLFdBQVcsYUFBYTtBQUNsRjtBQUNBLGdHQUFvRCxVQUFVLFVBQVUsYUFBYTtBQUNyRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNGQUEwQyxVQUFVLGNBQWMsYUFBYTtBQUMvRSxtR0FBdUQsWUFBWSxLQUFLLGFBQWE7QUFDckY7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0TUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUN4Q0E7QUFBQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDZCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBLGVBQWU7O0FBRWY7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxPQUFPO0FBQ1AsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0EsZUFBZTs7QUFFZjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBLGVBQWU7QUFDZixPQUFPO0FBQ1AsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBLGVBQWU7QUFDZixPQUFPO0FBQ1AsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBLGVBQWU7QUFDZixPQUFPO0FBQ1AsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBLGVBQWU7QUFDZixPQUFPO0FBQ1AsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBLGVBQWU7QUFDZixPQUFPO0FBQ1AsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBLGVBQWU7QUFDZixPQUFPO0FBQ1AsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBLGVBQWU7QUFDZixPQUFPO0FBQ1AsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBLGVBQWU7QUFDZixPQUFPO0FBQ1AsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBLGVBQWU7QUFDZixPQUFPO0FBQ1AsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBLGVBQWU7QUFDZixPQUFPO0FBQ1A7O0FBRUE7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsNEJBQTRCLG1CQUFtQjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0RBQW9ELFNBQVM7QUFDN0Q7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTs7QUFFQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3RZQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtCQUFrQixrRUFBc0I7QUFDeEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsWUFBWTtBQUN4QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLFlBQVk7QUFDekM7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMEJBQTBCLFFBQVE7QUFDbEM7O0FBRUE7QUFDQSwwQkFBMEIsYUFBYTtBQUN2Qzs7QUFFQTtBQUNBLDBCQUEwQixZQUFZO0FBQ3RDOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQy9GQTtBQUFBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQSx5RTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLCtHQUFtRSxzQkFBc0I7O0FBRXpGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJFQUErQixVQUFVOztBQUV6QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUVBQTZCLEdBQUc7QUFDaEM7O0FBRUEsYztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNyRkE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLG1CQUFtQjtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRzs7Ozs7Ozs7Ozs7QUNuREEsb0M7Ozs7Ozs7Ozs7O0FDQUEsK0I7Ozs7Ozs7Ozs7O0FDQUEsaUM7Ozs7Ozs7Ozs7O0FDQUEsb0M7Ozs7Ozs7Ozs7O0FDQUEsMEM7Ozs7Ozs7Ozs7O0FDQUEsaUM7Ozs7Ozs7Ozs7O0FDQUEsc0MiLCJmaWxlIjoic2VydmVyLmFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc2VydmVyL3NyYy9tYWluLmpzXCIpO1xuIiwiaW1wb3J0IGRiIGZyb20gJy4uL2RiLmpzJztcclxuaW1wb3J0IGdhbWUgZnJvbSAnLi4vZ2FtZS5qcyc7XHJcbmltcG9ydCBjb25maWcgZnJvbSAnLi4vY29uZmlnLmpzJztcclxuaW1wb3J0IHV0aWwgZnJvbSAnLi4vdXRpbC5qcyc7XHJcbmltcG9ydCBFbnRpdHkgZnJvbSAnLi9lbnRpdHkuanMnO1xyXG5pbXBvcnQgVGV4dCBmcm9tICcuL3RleHQuanMnO1xyXG5cclxuLy8gQW4gQWN0b3IgaXMgYW4gRW50aXR5IHdoaWNoIGNhbiBtb3ZlLCBhdHRhY2sgYW5kIGludGVyYWN0IHdpdGggaXRlbXNcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFjdG9yIGV4dGVuZHMgRW50aXR5IHtcclxuXHRjb25zdHJ1Y3RvcihtYXAsIHgsIHksIG5hbWUsIHNwcml0ZSkge1xyXG5cdFx0c3ByaXRlID0gdXRpbC5jbGFtcChzcHJpdGUsIDEsIGNvbmZpZy5NQVhfU1BSSVRFUyk7XHJcblxyXG5cdFx0c3VwZXIobWFwLCB4LCB5LCBzcHJpdGUpO1xyXG5cdFx0dGhpcy5jb250cm9sbGVyID0gJ2JvdCc7XHJcblx0XHR0aGlzLm5hbWUgPSBuYW1lO1xyXG5cclxuXHRcdHRoaXMuaW52ZW50b3J5ID0gW107XHJcblxyXG5cdFx0dGhpcy5jYWxjU3RhdHMoKTtcclxuXHRcdHRoaXMucmVzdG9yZSgpO1xyXG5cclxuXHRcdHRoaXMuZGlyZWN0aW9uID0gJ2Rvd24nO1xyXG5cdFx0dGhpcy5zdGFydFggPSB0aGlzLng7XHJcblx0XHR0aGlzLnN0YXJ0WSA9IHRoaXMueTtcclxuXHRcdHRoaXMuZGVzdGluYXRpb25YID0gdGhpcy54O1xyXG5cdFx0dGhpcy5kZXN0aW5hdGlvblkgPSB0aGlzLnk7XHJcblx0XHR0aGlzLmxlcnAgPSAwO1xyXG5cclxuXHRcdHRoaXMuaXNNb3ZpbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMuaXNSdW5uaW5nID0gZmFsc2U7XHJcblx0XHR0aGlzLm1vdmVTcGVlZCA9IDIuNTtcclxuXHRcdHRoaXMubW92ZW1lbnRUaW1lciA9IDA7XHJcblx0XHR0aGlzLmxhemluZXNzID0gMDtcclxuXHJcblx0XHR0aGlzLmlzQXR0YWNraW5nID0gZmFsc2U7XHJcblx0XHR0aGlzLmF0dGFja1NwZWVkID0gMTtcclxuXHRcdHRoaXMuYXR0YWNrVGltZXIgPSAwO1x0XHJcblx0XHR0aGlzLnRhcmdldCA9IG51bGw7XHJcblx0XHR0aGlzLmtpbGxzID0gMDtcclxuXHRcdHRoaXMuZGVhdGhzID0gMDtcclxuXHJcblx0XHR0aGlzLmlzRGVhZCA9IGZhbHNlO1xyXG5cdFx0dGhpcy5yZXNwYXduVGltZXIgPSAwO1xyXG5cdFx0dGhpcy5yZXNwYXduU3BlZWQgPSAxMDtcclxuXHRcdHRoaXMucmVzcGF3bk1hcCA9IG1hcDtcclxuXHRcdHRoaXMucmVzcGF3blggPSB4O1xyXG5cdFx0dGhpcy5yZXNwYXduWSA9IHk7XHJcblx0fVxyXG5cdFxyXG5cdC8vIENoYXJhY3RlciBTdGF0c1xyXG5cdGdldCBkYW1hZ2UoKSB7XHJcblx0XHRpZiAodGhpcy5kYW1hZ2VCYXNlICsgdGhpcy5kYW1hZ2VCb251cyA8IDApIHtcclxuXHRcdFx0cmV0dXJuIDA7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuZGFtYWdlQmFzZSArIHRoaXMuZGFtYWdlQm9udXM7XHJcblx0XHR9XHJcblx0fVxyXG5cdGdldCBkZWZlbmNlKCkge1xyXG5cdFx0aWYgKHRoaXMuZGVmZW5jZUJhc2UgKyB0aGlzLmRlZmVuY2VCb251cyA8IDApIHtcclxuXHRcdFx0cmV0dXJuIDA7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuZGVmZW5jZUJhc2UgKyB0aGlzLmRlZmVuY2VCb251cztcclxuXHRcdH1cclxuXHR9XHJcblx0Z2V0IGhlYWx0aE1heCgpIHtcclxuXHRcdGlmICh0aGlzLmhlYWx0aE1heEJhc2UgKyB0aGlzLmhlYWx0aE1heEJvbnVzIDwgMSkge1xyXG5cdFx0XHRyZXR1cm4gMTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5oZWFsdGhNYXhCYXNlICsgdGhpcy5oZWFsdGhNYXhCb251cztcclxuXHRcdH1cclxuXHR9XHJcblx0Z2V0IGVuZXJneU1heCgpIHtcclxuXHRcdGlmICh0aGlzLmVuZXJneU1heEJhc2UgKyB0aGlzLmVuZXJneU1heEJvbnVzIDwgMCkge1xyXG5cdFx0XHRyZXR1cm4gMDtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5lbmVyZ3lNYXhCYXNlICsgdGhpcy5lbmVyZ3lNYXhCb251cztcclxuXHRcdH1cclxuXHR9XHJcblx0Z2V0IHJhbmdlKCkge1xyXG5cdFx0aWYgKHRoaXMucmFuZ2VCYXNlICsgdGhpcy5yYW5nZUJvbnVzIDwgMSkge1xyXG5cdFx0XHRyZXR1cm4gMTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5yYW5nZUJhc2UgKyB0aGlzLnJhbmdlQm9udXM7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRjYWxjQmFzZVN0YXRzKCkge1x0Ly8gQ2xhc3MgYW5kIExldmVsXHJcblx0XHQvL1RPRE86IGNoZWNrIGRiIGZvciBjbGFzcyBzdGF0czogYmFzZSBhbmQgaW5jcmVhc2UgcGVyIGxldmVsXHJcblx0XHQvLyB0aGlzLmRhbWFnZUJhc2UgPSBjbGFzcy5iYXNlLmRhbWFnZSArIChjbGFzcy5pbmNyZWFzZVBlckxldmVsLmRhbWFnZSAqIHRoaXMubGV2ZWwpO1xyXG5cdFx0dGhpcy5kYW1hZ2VCYXNlID0gNTtcclxuXHRcdHRoaXMuZGVmZW5jZUJhc2UgPSAwO1xyXG5cdFx0dGhpcy5oZWFsdGhNYXhCYXNlID0gMTA7XHJcblx0XHR0aGlzLmVuZXJneU1heEJhc2UgPSA0MDtcclxuXHRcdHRoaXMucmFuZ2VCYXNlID0gMTtcclxuXHR9XHJcblxyXG5cdGNhbGNCb251c1N0YXRzKCkge1x0Ly8gSXRlbXMgKGVxdWlwcGVkIGFuZCBwYXNzaXZlKSBhbmQgRWZmZWN0cyAoc3BlbGxzIGFuZCBwb3Rpb25zKVxyXG5cdFx0bGV0IGl0ZW1Cb251cyA9IHRoaXMuY2FsY0l0ZW1Cb251cygpO1xyXG5cdFx0bGV0IGVmZmVjdEJvbnVzID0gdGhpcy5jYWxjRWZmZWN0Qm9udXMoKTtcclxuXHJcblx0XHR0aGlzLmRhbWFnZUJvbnVzID0gaXRlbUJvbnVzLmRhbWFnZSArIGVmZmVjdEJvbnVzLmRhbWFnZTtcclxuXHRcdHRoaXMuZGVmZW5jZUJvbnVzID0gaXRlbUJvbnVzLmRlZmVuY2UgKyBlZmZlY3RCb251cy5kZWZlbmNlO1xyXG5cdFx0dGhpcy5oZWFsdGhNYXhCb251cyA9IGl0ZW1Cb251cy5oZWFsdGhNYXggKyBlZmZlY3RCb251cy5oZWFsdGhNYXg7XHJcblx0XHR0aGlzLmVuZXJneU1heEJvbnVzID0gaXRlbUJvbnVzLmVuZXJneU1heCArIGVmZmVjdEJvbnVzLmVuZXJneU1heDtcclxuXHRcdHRoaXMucmFuZ2VCb251cyA9IGl0ZW1Cb251cy5yYW5nZSArIGVmZmVjdEJvbnVzLnJhbmdlO1xyXG5cdH1cclxuXHJcblx0Y2FsY1N0YXRzKCkge1xyXG5cdFx0dGhpcy5jYWxjQmFzZVN0YXRzKCk7XHJcblx0XHR0aGlzLmNhbGNCb251c1N0YXRzKCk7XHJcblx0fVxyXG5cclxuXHRjYWxjSXRlbUJvbnVzKCkge1xyXG5cdFx0bGV0IGl0ZW1Cb251cyA9IHtcclxuXHRcdFx0ZGFtYWdlOiAwLFxyXG5cdFx0XHRkZWZlbmNlOiAwLFxyXG5cdFx0XHRoZWFsdGhNYXg6IDAsXHJcblx0XHRcdGVuZXJneU1heDogMCxcclxuXHRcdFx0cmFuZ2U6IDBcclxuXHRcdH07XHJcblxyXG5cdFx0Ly8gRm9yIGVhY2ggaXRlbSBpbiBpbnZlbnRvcnkgY2hlY2sgZm9yIGJvbnVzZXNcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgKGNvbmZpZy5JTlZFTlRPUllfU0laRSArIGNvbmZpZy5FUVVJUE1FTlRfU0laRSk7IGkrKykge1xyXG5cdFx0XHRsZXQgaXRlbSA9IHRoaXMuaW52ZW50b3J5W2ldO1xyXG5cdFx0XHRpZiAoaXRlbSAmJiAhaXRlbS5yZW1vdmUpIHtcclxuXHRcdFx0XHRpdGVtQm9udXMuZGFtYWdlICs9IGl0ZW0ucGFzc2l2ZURhbWFnZTtcclxuXHRcdFx0XHRpdGVtQm9udXMuZGVmZW5jZSArPSBpdGVtLnBhc3NpdmVEZWZlbmNlO1xyXG5cdFx0XHRcdGl0ZW1Cb251cy5oZWFsdGhNYXggKz0gaXRlbS5wYXNzaXZlSGVhbHRoTWF4O1xyXG5cdFx0XHRcdGl0ZW1Cb251cy5lbmVyZ3lNYXggKz0gaXRlbS5wYXNzaXZlRW5lcmd5TWF4O1xyXG5cdFx0XHRcdGl0ZW1Cb251cy5yYW5nZSArPSBpdGVtLnBhc3NpdmVSYW5nZTtcclxuXHJcblx0XHRcdFx0aWYgKGkgPj0gY29uZmlnLklOVkVOVE9SWV9TSVpFKSB7XHJcblx0XHRcdFx0XHRpdGVtQm9udXMuZGFtYWdlICs9IGl0ZW0uZXF1aXBEYW1hZ2U7XHJcblx0XHRcdFx0XHRpdGVtQm9udXMuZGVmZW5jZSArPSBpdGVtLmVxdWlwRGVmZW5jZTtcclxuXHRcdFx0XHRcdGl0ZW1Cb251cy5oZWFsdGhNYXggKz0gaXRlbS5lcXVpcEhlYWx0aE1heDtcclxuXHRcdFx0XHRcdGl0ZW1Cb251cy5lbmVyZ3lNYXggKz0gaXRlbS5lcXVpcEVuZXJneU1heDtcclxuXHRcdFx0XHRcdGl0ZW1Cb251cy5yYW5nZSArPSBpdGVtLmVxdWlwUmFuZ2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiBpdGVtQm9udXM7XHJcblx0fVxyXG5cclxuXHRjYWxjRWZmZWN0Qm9udXMoKSB7XHJcblx0XHRsZXQgZWZmZWN0Qm9udXMgPSB7XHJcblx0XHRcdGRhbWFnZTogMCxcclxuXHRcdFx0ZGVmZW5jZTogMCxcclxuXHRcdFx0aGVhbHRoTWF4OiAwLFxyXG5cdFx0XHRlbmVyZ3lNYXg6IDAsXHJcblx0XHRcdHJhbmdlOiAwXHJcblx0XHR9O1xyXG5cclxuXHRcdC8vIFRPRE86IHdvcmsgb3V0IGhvdyB0byBkbyBlZmZlY3RzIGZvciBzcGVsbHMgYW5kIHBvdGlvbnNcclxuXHRcdHJldHVybiBlZmZlY3RCb251cztcclxuXHR9XHJcblxyXG5cdHJlc3RvcmUoKSB7XHJcblx0XHR0aGlzLmhlYWx0aCA9IHRoaXMuaGVhbHRoTWF4O1xyXG5cdFx0dGhpcy5lbmVyZ3kgPSB0aGlzLmVuZXJneU1heDtcclxuXHR9XHJcblx0XHJcblx0Ly8gTW92ZW1lbnRcclxuXHRtb3ZlKGRpcmVjdGlvbikge1xyXG5cdFx0aWYgKHRoaXMuaXNNb3ZpbmcpIHJldHVybjtcclxuXHJcblx0XHRpZiAoZGlyZWN0aW9uKSB7XHJcblx0XHRcdHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChkaXJlY3Rpb24gPT09ICdsZWZ0Jykge1xyXG5cdFx0XHRpZiAoIWdhbWUuY2hlY2tWYWNhbnQodGhpcy5tYXAsIHRoaXMueCAtIDEsIHRoaXMueSkpIHJldHVybjtcclxuXHRcdFx0dGhpcy5kZXN0aW5hdGlvblgtLTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ3JpZ2h0Jykge1xyXG5cdFx0XHRpZiAoIWdhbWUuY2hlY2tWYWNhbnQodGhpcy5tYXAsIHRoaXMueCArIDEsIHRoaXMueSkpIHJldHVybjtcclxuXHRcdFx0dGhpcy5kZXN0aW5hdGlvblgrKztcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ3VwJykge1xyXG5cdFx0XHRpZiAoIWdhbWUuY2hlY2tWYWNhbnQodGhpcy5tYXAsIHRoaXMueCwgdGhpcy55IC0gMSkpIHJldHVybjtcclxuXHRcdFx0dGhpcy5kZXN0aW5hdGlvblktLTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ2Rvd24nKSB7XHJcblx0XHRcdGlmICghZ2FtZS5jaGVja1ZhY2FudCh0aGlzLm1hcCwgdGhpcy54LCB0aGlzLnkgKyAxKSkgcmV0dXJuO1xyXG5cdFx0XHR0aGlzLmRlc3RpbmF0aW9uWSsrO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHN3aXRjaCAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKHRoaXMubGF6aW5lc3MgKyAzKSkpIHtcclxuXHRcdFx0XHRjYXNlIDA6IHRoaXMubW92ZSgnbGVmdCcpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgMTogdGhpcy5tb3ZlKCdyaWdodCcpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgMjogdGhpcy5tb3ZlKCd1cCcpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgMzogdGhpcy5tb3ZlKCdkb3duJyk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0ZGVmYXVsdDogLy8gRG9uJ3QgTW92ZVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBTZXQgbW92ZSBzcGVlZFxyXG5cdFx0aWYgKHRoaXMuaXNSdW5uaW5nKSB7XHJcblx0XHRcdGlmICh0aGlzLmVuZXJneSA+IDApIHtcclxuXHRcdFx0XHR0aGlzLmVuZXJneS0tO1xyXG5cdFx0XHRcdHRoaXMubW92ZVNwZWVkID0gNDtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHR0aGlzLmVuZXJneSA9IDA7XHJcblx0XHRcdFx0dGhpcy5tb3ZlU3BlZWQgPSAyLjU7XHJcblx0XHRcdFx0dGhpcy5pc1J1bm5pbmcgPSBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHRoaXMubW92ZVNwZWVkID0gMi41O1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR0aGlzLmlzTW92aW5nID0gdHJ1ZTtcclxuXHR9XHJcblx0XHJcblx0bW92ZVRvVGFyZ2V0KHRhcmdldCwgaG9zdGlsZSkge1xyXG5cdFx0aWYgKCF0YXJnZXQpIHJldHVybjtcclxuXHRcdFxyXG5cdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggJiYgdGFyZ2V0LnkgPT09IHRoaXMueSkge1xyXG5cdFx0XHR0aGlzLm1vdmUoKTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIgPT09IDApKSB7XHJcblx0XHRcdGlmICh0YXJnZXQueCA8IHRoaXMueCkge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQueCA+PSAodGhpcy54IC0gdGhpcy5yYW5nZSkgJiYgdGFyZ2V0LnkgPT09IHRoaXMueSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnbGVmdCc7XHJcblx0XHRcdFx0XHRcdGlmICghdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCdsZWZ0Jyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ2xlZnQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodGFyZ2V0LnggPiB0aGlzLngpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LnggPT09IHRoaXMueCArIHRoaXMucmFuZ2UgJiYgdGFyZ2V0LnkgPT09IHRoaXMueSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAncmlnaHQnO1xyXG5cdFx0XHRcdFx0XHRpZiAoIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmF0dGFjaygncmlnaHQnKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSgncmlnaHQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodGFyZ2V0LnkgPCB0aGlzLnkpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LnggPT09IHRoaXMueCAmJiB0YXJnZXQueSA9PT0gdGhpcy55IC0gdGhpcy5yYW5nZSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAndXAnO1xyXG5cdFx0XHRcdFx0XHRpZiAoIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmF0dGFjaygndXAnKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSgndXAnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodGFyZ2V0LnkgPiB0aGlzLnkpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LnggPT09IHRoaXMueCAmJiB0YXJnZXQueSA9PT0gdGhpcy55ICsgdGhpcy5yYW5nZSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnZG93bic7XHJcblx0XHRcdFx0XHRcdGlmICghdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCdkb3duJyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ2Rvd24nKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRpZiAodGFyZ2V0LnkgPiB0aGlzLnkpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LnggPT09IHRoaXMueCAmJiB0YXJnZXQueSA9PT0gdGhpcy55ICsgdGhpcy5yYW5nZSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUpIHtcclxuXHRcdFx0XHRcdFx0aWYgKCF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ2Rvd24nKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSgnZG93bicpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICh0YXJnZXQueSA8IHRoaXMueSkge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICYmIHRhcmdldC55ID09PSB0aGlzLnkgLSB0aGlzLnJhbmdlKSB7XHJcblx0XHRcdFx0XHRpZiAoaG9zdGlsZSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmF0dGFjaygndXAnKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSgndXAnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodGFyZ2V0LnggPiB0aGlzLngpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LnggPT09IHRoaXMueCArIHRoaXMucmFuZ2UgJiYgdGFyZ2V0LnkgPT09IHRoaXMueSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUpIHtcclxuXHRcdFx0XHRcdFx0aWYgKCF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ3JpZ2h0Jyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ3JpZ2h0Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHRhcmdldC54IDwgdGhpcy54KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID49ICh0aGlzLnggLSB0aGlzLnJhbmdlKSAmJiB0YXJnZXQueSA9PT0gdGhpcy55KSB7XHJcblx0XHRcdFx0XHRpZiAoaG9zdGlsZSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmF0dGFjaygnbGVmdCcpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCdsZWZ0Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdC8vIENvbWJhdFxyXG5cdGNoZWNrSW5SYW5nZShkaXJlY3Rpb24sIHRhcmdldCwgcmFuZ2UpIHtcclxuXHRcdGlmICh0YXJnZXQubWFwICE9PSB0aGlzLm1hcCkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggJiYgdGFyZ2V0LnkgPT09IHRoaXMueSkgcmV0dXJuIGZhbHNlO1x0Ly8gU3RhY2tlZCBkb2VzIG5vdCBjb3VudCBhcyBpbiByYW5nZVxyXG5cdFx0XHJcblx0XHRpZiAodGFyZ2V0LnkgPT09IHRoaXMueSkge1xyXG5cdFx0XHRpZiAoZGlyZWN0aW9uID09PSAnbGVmdCcpIHtcclxuXHRcdFx0XHRpZiAodGhpcy54ID09PSAwKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0cmV0dXJuICh0YXJnZXQueCA8IHRoaXMueCAmJiB0YXJnZXQueCA+PSAodGhpcy54IC0gcmFuZ2UpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAoZGlyZWN0aW9uID09PSAncmlnaHQnKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMueCA9PT0gY29uZmlnLk1BUF9DT0xVTU5TIC0gMSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHJldHVybiAodGFyZ2V0LnggPiB0aGlzLnggJiYgdGFyZ2V0LnggPD0gKHRoaXMueCArIHJhbmdlKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmICh0YXJnZXQueCA9PT0gdGhpcy54KSB7XHJcblx0XHRcdGlmIChkaXJlY3Rpb24gPT09ICd1cCcpIHtcclxuXHRcdFx0XHRpZiAodGhpcy55ID09PSAwKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0cmV0dXJuICh0YXJnZXQueSA8IHRoaXMueSAmJiB0YXJnZXQueSA+PSAodGhpcy55IC0gcmFuZ2UpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAoZGlyZWN0aW9uID09PSAnZG93bicpIHtcclxuXHRcdFx0XHRpZiAodGhpcy55ID09PSBjb25maWcuTUFQX1JPV1MgLSAxKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0cmV0dXJuICh0YXJnZXQueSA+IHRoaXMueSAmJiB0YXJnZXQueSA8PSAodGhpcy55ICsgcmFuZ2UpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0YXR0YWNrKG51bVRhcmdldHMgPSAxLCBkaXJlY3Rpb24gPSB0aGlzLmRpcmVjdGlvbikge1xyXG5cdFx0aWYgKHRoaXMuaXNBdHRhY2tpbmcgfHwgdGhpcy5hdHRhY2tUaW1lciA+IDApIHJldHVybjtcclxuXHJcblx0XHR0aGlzLmlzQXR0YWNraW5nID0gdHJ1ZTtcclxuXHJcblx0XHRsZXQgdGFyZ2V0TGlzdCA9IGdhbWUucGxheWVyTGlzdC5maWx0ZXIoKHBsYXllcikgPT4ge1xyXG5cdFx0XHRpZiAocGxheWVyID09PSB0aGlzIHx8IHBsYXllci5pc0RlYWQpIHJldHVybiBmYWxzZTtcclxuXHRcdFx0aWYgKCF0aGlzLmNoZWNrSW5SYW5nZShkaXJlY3Rpb24sIHBsYXllciwgdGhpcy5yYW5nZSkpIHJldHVybiBmYWxzZTtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdFx0dGFyZ2V0TGlzdC5zb3J0KChhLCBiKSA9PiB7XHJcblx0XHRcdHJldHVybiAoYS56IC0gYi56KTtcdC8vIExvd2VzdCB0byBoaWdoZXN0XHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdFx0dGFyZ2V0TGlzdCA9IHRhcmdldExpc3Quc3BsaWNlKC1udW1UYXJnZXRzKTtcclxuXHRcdFxyXG5cdFx0dGFyZ2V0TGlzdC5mb3JFYWNoKCh0YXJnZXQpID0+IHtcclxuXHRcdFx0dGFyZ2V0LnRha2VEYW1hZ2UodGhpcy5kYW1hZ2UsIHRoaXMpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdFxyXG5cdHRha2VEYW1hZ2UoZGFtYWdlLCBzb3VyY2UpIHtcclxuXHRcdGRhbWFnZSAtPSB0aGlzLmRlZmVuY2U7XHJcblx0XHRpZiAoZGFtYWdlIDwgMCkge1xyXG5cdFx0XHRkYW1hZ2UgPSAwO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHRoaXMuaGVhbHRoIC09IGRhbWFnZTtcclxuXHRcdFx0aWYgKHRoaXMuaGVhbHRoIDw9IDApIHtcclxuXHRcdFx0XHR0aGlzLnNldERlYWQoc291cmNlKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRjb25zb2xlLmxvZyhgJHtzb3VyY2UubmFtZX0gaGl0cyAke3RoaXMubmFtZX0gZm9yICR7ZGFtYWdlfSBkYW1hZ2UuYCk7XHJcblx0XHR9XHJcblxyXG5cdFx0bmV3IFRleHQodGhpcy5tYXAsIHRoaXMueCwgdGhpcy55LCBkYW1hZ2UsICcjRkYwMDAwJywgMCwgLTEpO1xyXG5cdH1cclxuXHRcclxuXHRyZXNwYXduKCkge1xyXG5cdFx0Z2FtZS5zZW5kU2VydmVyTWVzc2FnZSh0aGlzLm5hbWUgKyBcIiBpcyBiYWNrIGZyb20gdGhlIGRlYWQuXCIpO1xyXG5cclxuXHRcdHRoaXMubWFwID0gdGhpcy5yZXNwYXduTWFwO1xyXG5cdFx0dGhpcy54ID0gdGhpcy5yZXNwYXduWDtcclxuXHRcdHRoaXMueSA9IHRoaXMucmVzcGF3blk7XHJcblx0XHR0aGlzLnN0YXJ0WCA9IHRoaXMucmVzcGF3blg7XHJcblx0XHR0aGlzLnN0YXJ0WSA9IHRoaXMucmVzcGF3blk7XHJcblx0XHR0aGlzLmRlc3RpbmF0aW9uWCA9IHRoaXMucmVzcGF3blg7XHJcblx0XHR0aGlzLmRlc3RpbmF0aW9uWSA9IHRoaXMucmVzcGF3blk7XHJcblx0XHRcclxuXHRcdHRoaXMuY2FsY0JvbnVzU3RhdHMoKTtcclxuXHRcdHRoaXMucmVzdG9yZSgpO1xyXG5cdFx0XHJcblx0XHR0aGlzLmlzV2Fsa2luZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy5pc1J1bm5pbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMuaXNBdHRhY2tpbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMuaXNEZWFkID0gZmFsc2U7XHJcblx0XHR0aGlzLnJlc3Bhd25UaW1lciA9IDA7XHJcblx0fVxyXG5cdFxyXG5cdHNldERlYWQoc291cmNlKSB7XHJcblx0XHRsZXQgbWFwID0gZ2FtZS5tYXBMaXN0W3RoaXMubWFwXTtcclxuXHJcblx0XHQvLyBJbnZlbnRvcnkgSXRlbSBEcm9wIENoYW5jZVxyXG5cdFx0bGV0IGRyb3BDaGFuY2UgPSB1dGlsLmNsYW1wKG1hcC5kcm9wQ2hhbmNlLCAwLCAxMDApO1xyXG5cdFx0aWYgKGRyb3BDaGFuY2UgPiAwKSB7XHJcblx0XHRcdGxldCBpdGVtcyA9IHRoaXMuaW52ZW50b3J5LmZpbHRlcigoaXRlbSkgPT4ge1xyXG5cdFx0XHRcdGlmIChpdGVtLnNsb3QgPCBjb25maWcuSU5WRU5UT1JZX1NJWkUpIHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XHJcblx0XHRcdFx0aWYgKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMSkgPD0gZHJvcENoYW5jZSkge1xyXG5cdFx0XHRcdFx0dGhpcy5kcm9wSXRlbShpdGVtLnNsb3QpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gRXF1aXBwZWQgSXRlbSBEcm9wIEFtb3VudFxyXG5cdFx0bGV0IGRyb3BBbW91bnRFUSA9IHV0aWwuY2xhbXAobWFwLmRyb3BBbW91bnRFUSwgMCwgY29uZmlnLkVRVUlQTUVOVF9TSVpFKTtcclxuXHRcdGlmIChkcm9wQW1vdW50RVEgPiAwKSB7XHJcblx0XHRcdGxldCBlcXVpcG1lbnQgPSB0aGlzLmludmVudG9yeS5maWx0ZXIoKGl0ZW0pID0+IHtcclxuXHRcdFx0XHRpZiAoaXRlbS5zbG90ID49IGNvbmZpZy5JTlZFTlRPUllfU0laRSkgcmV0dXJuIHRydWU7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdGVxdWlwbWVudCA9IHV0aWwuc2h1ZmZsZShlcXVpcG1lbnQpO1xyXG5cdFx0XHRlcXVpcG1lbnQuc3BsaWNlKC1kcm9wQW1vdW50RVEpO1xyXG5cdFx0XHRlcXVpcG1lbnQuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuZHJvcEl0ZW0oZXF1aXBtZW50LnNsb3QpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dGhpcy5pc0RlYWQgPSB0cnVlO1xyXG5cdFx0dGhpcy5oZWFsdGggPSAwO1xyXG5cdFx0dGhpcy5lbmVyZ3kgPSAwO1xyXG5cdFx0dGhpcy5kZWF0aHMrKztcclxuXHRcdFxyXG5cdFx0aWYgKHNvdXJjZSkge1xyXG5cdFx0XHRpZiAoc291cmNlLmNvbnRyb2xsZXIgPSAncGxheWVyJykge1xyXG5cdFx0XHRcdGdhbWUuc2VuZFNlcnZlck1lc3NhZ2Uoc291cmNlLm5hbWUgKyBcIiBoYXMgbXVyZGVyZWQgXCIgKyB0aGlzLm5hbWUgKyBcIiBpbiBjb2xkIGJsb29kIVwiKTtcclxuXHRcdFx0XHRzb3VyY2Uua2lsbHMrKztcclxuXHRcdFx0XHRpZiAoc291cmNlLnRhcmdldCA9PT0gdGhpcykge1xyXG5cdFx0XHRcdFx0c291cmNlLnRhcmdldCA9IG51bGw7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdGdhbWUuc2VuZFNlcnZlck1lc3NhZ2UodGhpcy5uYW1lICsgXCIgaGFzIGJlZW4ga2lsbGVkIGJ5IFwiICsgc291cmNlLm5hbWUgKyBcIiFcIik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRnYW1lLnNlbmRTZXJ2ZXJNZXNzYWdlKHRoaXMubmFtZSArIFwiIGhhcyBkaWVkIVwiKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0Ly8gSW52ZW50b3J5XHJcblx0cGlja1VwKCkge1xyXG5cdFx0Z2FtZS5tYXBMaXN0W3RoaXMubWFwXS5pdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XHJcblx0XHRcdGlmIChpdGVtLnggPT09IHRoaXMueCAmJiBpdGVtLnkgPT09IHRoaXMueSkge1xyXG5cdFx0XHRcdGlmICh0aGlzLmdldEl0ZW0oaXRlbS5pdGVtQ2xhc3MsIGl0ZW0uc3RhY2spKSB7XHJcblx0XHRcdFx0XHRpdGVtLnJlbW92ZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cdFxyXG5cdGdldEl0ZW0oaXRlbUNsYXNzLCBzdGFjaykge1xyXG5cdFx0aWYgKHN0YWNrID4gMCkge1x0XHRcdC8vIFN0YWNrYWJsZSBJdGVtc1xyXG5cdFx0XHRsZXQgZW1wdHlTbG90ID0gLTE7XHJcblx0XHRcdGZvciAobGV0IHNsb3QgPSAwOyBzbG90IDwgY29uZmlnLklOVkVOVE9SWV9TSVpFOyBzbG90KyspIHtcclxuXHRcdFx0XHRpZiAodGhpcy5pbnZlbnRvcnlbc2xvdF0pIHtcclxuXHRcdFx0XHRcdGlmICh0aGlzLmludmVudG9yeVtzbG90XS5jbGFzcyA9PT0gaXRlbUNsYXNzKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuaW52ZW50b3J5W3Nsb3RdLnN0YWNrICs9IHN0YWNrO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBpZiAoZW1wdHlTbG90IDwgMCkge1xyXG5cdFx0XHRcdFx0ZW1wdHlTbG90ID0gc2xvdDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYgKHNsb3QgPT09IGNvbmZpZy5JTlZFTlRPUllfU0laRSAtIDEpIHtcclxuXHRcdFx0XHRcdGlmIChlbXB0eVNsb3QgPj0gMCAmJiBlbXB0eVNsb3QgPCBjb25maWcuSU5WRU5UT1JZX1NJWkUpIHtcclxuXHRcdFx0XHRcdFx0bmV3IEludmVudG9yeUl0ZW0odGhpcy5pZCwgZW1wdHlTbG90LCBpdGVtQ2xhc3MsIHN0YWNrKTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIHtcdC8vIEludmVudG9yeSBmdWxsXHJcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2Uge1x0XHRcdC8vIE5vbi1TdGFja2FibGUgSXRlbVxyXG5cdFx0XHRmb3IgKGxldCBzbG90ID0gMDsgc2xvdCA8IGNvbmZpZy5JTlZFTlRPUllfU0laRTsgc2xvdCsrKSB7XHJcblx0XHRcdFx0aWYgKCF0aGlzLmludmVudG9yeVtzbG90XSkge1xyXG5cdFx0XHRcdFx0bmV3IEludmVudG9yeUl0ZW0odGhpcy5pZCwgc2xvdCwgaXRlbUNsYXNzLCBzdGFjayk7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRpZiAoc2xvdCA9PT0gY29uZmlnLklOVkVOVE9SWV9TSVpFIC0gMSkge1x0Ly8gSW52ZW50b3J5IGZ1bGxcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRkcm9wSXRlbShzbG90KSB7XHJcblx0XHRsZXQgaXRlbSA9IHRoaXMuaW52ZW50b3J5W3Nsb3RdO1xyXG5cdFx0aWYgKCFpdGVtKSByZXR1cm47XHJcblx0XHRcclxuXHRcdGlmIChzbG90IDwgY29uZmlnLklOVkVOVE9SWV9TSVpFKSB7XHJcblx0XHRcdC8vIERlc3Ryb3kgSW52ZW50b3J5IEl0ZW1cclxuXHRcdFx0aXRlbS5yZW1vdmUoKTtcclxuXHRcdFx0XHJcblx0XHRcdC8vIENyZWF0ZSBNYXAgSXRlbVxyXG5cdFx0XHRnYW1lLnNwYXduSXRlbSh0aGlzLm1hcCwgdGhpcy54LCB0aGlzLnksIGl0ZW0uY2xhc3MsIGl0ZW0uc3RhY2spO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHRoaXMudW5lcXVpcEl0ZW0oc2xvdCk7XHJcblx0XHRcdHRoaXMuY2FsY0JvbnVzU3RhdHMoKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0dXNlSXRlbShzbG90KSB7XHJcblx0XHRsZXQgaXRlbSA9IHRoaXMuaW52ZW50b3J5W3Nsb3RdO1xyXG5cdFx0aWYgKCFpdGVtKSByZXR1cm47XHJcblx0XHQvLyBpZiAoIWRiLml0ZW1zW2l0ZW0uaWRdLnVzZS5jYWxsKHRoaXMsIHNsb3QpKSByZXR1cm47XHQvLyBSdW4gJ3VzZScgc2NyaXB0XHJcblx0XHRcclxuXHRcdGlmIChpdGVtLmNoZWNrSXNFcXVpcG1lbnQoKSkge1x0Ly8gRXF1aXBtZW50IEl0ZW1zXHJcblx0XHRcdGlmIChzbG90IDwgY29uZmlnLklOVkVOVE9SWV9TSVpFKSB7XHQvLyBDaGVjayBpZiBpdGVtIGlzIGVxdWlwcGVkXHJcblx0XHRcdFx0dGhpcy5lcXVpcEl0ZW0oc2xvdCk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0dGhpcy51bmVxdWlwSXRlbShzbG90KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHQvLyBOb24tRXF1aXBtZW50IEl0ZW1zXHJcblx0XHRcdGlmICghaXRlbS5yZXVzYWJsZSkge1xyXG5cdFx0XHRcdGlmIChpdGVtLnN0YWNrID4gMSkge1xyXG5cdFx0XHRcdFx0aXRlbS5zdGFjay0tO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdGl0ZW0ucmVtb3ZlKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGhhc0l0ZW0oaXRlbUNsYXNzKSB7XHJcblx0XHRsZXQgY291bnQgPSAwO1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjb25maWcuSU5WRU5UT1JZX1NJWkU7IGkrKykge1xyXG5cdFx0XHRpZiAodGhpcy5pbnZlbnRvcnlbaV0pIHtcclxuXHRcdFx0XHRpZiAodGhpcy5pbnZlbnRvcnlbaV0uY2xhc3MgPT09IGl0ZW1DbGFzcykge1xyXG5cdFx0XHRcdFx0Y291bnQrKztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBjb3VudDtcclxuXHR9XHJcblx0XHJcblx0bW92ZUl0ZW1Ub1Nsb3Qoc2xvdCwgbmV3U2xvdCkge1xyXG5cdFx0aWYgKCFzbG90IHx8ICFuZXdTbG90KSByZXR1cm47XHJcblx0XHRpZiAoc2xvdCA9PT0gbmV3U2xvdCkgcmV0dXJuO1xyXG5cclxuXHRcdGxldCBpdGVtID0gdGhpcy5pbnZlbnRvcnlbc2xvdF07XHJcblx0XHRsZXQgbmV3SXRlbSA9IHRoaXMuaW52ZW50b3J5W25ld1Nsb3RdO1xyXG5cclxuXHRcdGlmIChpdGVtKSB7XHJcblx0XHRcdGlmIChuZXdJdGVtKSB7XHJcblx0XHRcdFx0aWYgKHNsb3QgPj0gY29uZmlnLklOVkVOVE9SWV9TSVpFKSB7XHJcblx0XHRcdFx0XHRpZiAobmV3U2xvdCA+PSBjb25maWcuSU5WRU5UT1JZX1NJWkUpIHtcclxuXHRcdFx0XHRcdFx0aWYgKG5ld0l0ZW0udHlwZSA9PT0gaXRlbS50eXBlKSB7XHJcblx0XHRcdFx0XHRcdFx0aXRlbS5zbG90ID0gbmV3U2xvdDtcclxuXHRcdFx0XHRcdFx0XHRuZXdJdGVtLnNsb3QgPSBzbG90O1xyXG5cdFx0XHRcdFx0XHRcdHV0aWwuc3dhcCh0aGlzLmludmVudG9yeSwgc2xvdCwgbmV3U2xvdCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0Z2FtZS5zZW5kUGxheWVyTWVzc2FnZSh0aGlzLmlkLCBcIlRoYXQgY2Fubm90IGJlIGVxdWlwcGVkIHRoZXJlLlwiKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdGlmIChuZXdJdGVtLnR5cGUgPT09IGl0ZW0udHlwZSkge1xyXG5cdFx0XHRcdFx0XHRcdGl0ZW0uZXF1aXBwZWQgPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0XHRuZXdJdGVtLmVxdWlwcGVkID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0XHRpdGVtLnNsb3QgPSBuZXdTbG90O1xyXG5cdFx0XHRcdFx0XHRcdG5ld0l0ZW0uc2xvdCA9IHNsb3Q7XHJcblx0XHRcdFx0XHRcdFx0dXRpbC5zd2FwKHRoaXMuaW52ZW50b3J5LCBzbG90LCBuZXdTbG90KTtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmNhbGNCb251c1N0YXRzKCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0bmV3U2xvdCA9IHRoaXMuZmluZEZpcnN0RW1wdHlTbG90KCk7XHJcblx0XHRcdFx0XHRcdFx0aWYgKG5ld1Nsb3QpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGl0ZW0uZXF1aXBwZWQgPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0XHRcdGl0ZW0uc2xvdCA9IG5ld1Nsb3Q7XHJcblx0XHRcdFx0XHRcdFx0XHR1dGlsLnN3YXAodGhpcy5pbnZlbnRvcnksIHNsb3QsIG5ld1Nsb3QpO1xyXG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5jYWxjQm9udXNTdGF0cygpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdGdhbWUuc2VuZFBsYXllck1lc3NhZ2UodGhpcy5pZCwgXCJZb3VyIGludmVudG9yeSBpcyBmdWxsLlwiKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRpZiAobmV3U2xvdCA+PSBjb25maWcuSU5WRU5UT1JZX1NJWkUpIHtcclxuXHRcdFx0XHRcdFx0aWYgKG5ld0l0ZW0udHlwZSA9PT0gaXRlbS50eXBlKSB7XHJcblx0XHRcdFx0XHRcdFx0aXRlbS5lcXVpcHBlZCA9IHRydWU7XHJcblx0XHRcdFx0XHRcdFx0bmV3SXRlbS5lcXVpcHBlZCA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRcdGl0ZW0uc2xvdCA9IG5ld1Nsb3Q7XHJcblx0XHRcdFx0XHRcdFx0bmV3SXRlbS5zbG90ID0gc2xvdDtcclxuXHRcdFx0XHRcdFx0XHR1dGlsLnN3YXAodGhpcy5pbnZlbnRvcnksIHNsb3QsIG5ld1Nsb3QpO1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuY2FsY0JvbnVzU3RhdHMoKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRnYW1lLnNlbmRQbGF5ZXJNZXNzYWdlKHRoaXMuaWQsIFwiVGhhdCBjYW5ub3QgYmUgZXF1aXBwZWQgdGhlcmUuXCIpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0aXRlbS5zbG90ID0gbmV3U2xvdDtcclxuXHRcdFx0XHRcdFx0bmV3SXRlbS5zbG90ID0gc2xvdDtcclxuXHRcdFx0XHRcdFx0dXRpbC5zd2FwKHRoaXMuaW52ZW50b3J5LCBzbG90LCBuZXdTbG90KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0aWYgKHNsb3QgPj0gY29uZmlnLklOVkVOVE9SWV9TSVpFKSB7XHJcblx0XHRcdFx0XHRpZiAobmV3U2xvdCA+PSBjb25maWcuSU5WRU5UT1JZX1NJWkUpIHtcclxuXHRcdFx0XHRcdFx0aWYgKG5ld1Nsb3QgPT09IGl0ZW0uZmluZEVxdWlwbWVudFNsb3QoKSkge1xyXG5cdFx0XHRcdFx0XHRcdGl0ZW0uc2xvdCA9IG5ld1Nsb3Q7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5pbnZlbnRvcnlbbmV3U2xvdF0gPSBpdGVtO1xyXG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSB0aGlzLmludmVudG9yeVtzbG90XTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRnYW1lLnNlbmRQbGF5ZXJNZXNzYWdlKHRoaXMuaWQsIFwiVGhhdCBjYW5ub3QgYmUgZXF1aXBwZWQgdGhlcmUuXCIpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0aXRlbS5lcXVpcHBlZCA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRpdGVtLnNsb3QgPSBuZXdTbG90O1xyXG5cdFx0XHRcdFx0XHR0aGlzLmludmVudG9yeVtuZXdTbG90XSA9IGl0ZW07XHJcblx0XHRcdFx0XHRcdGRlbGV0ZSB0aGlzLmludmVudG9yeVtzbG90XTtcclxuXHRcdFx0XHRcdFx0dGhpcy5jYWxjQm9udXNTdGF0cygpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdGlmIChuZXdTbG90ID49IGNvbmZpZy5JTlZFTlRPUllfU0laRSkge1xyXG5cdFx0XHRcdFx0XHRpZiAobmV3U2xvdCA9PT0gaXRlbS5maW5kRXF1aXBtZW50U2xvdCgpKSB7XHJcblx0XHRcdFx0XHRcdFx0aXRlbS5lcXVpcHBlZCA9IHRydWU7XHJcblx0XHRcdFx0XHRcdFx0aXRlbS5zbG90ID0gbmV3U2xvdDtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmludmVudG9yeVtuZXdTbG90XSA9IGl0ZW07XHJcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIHRoaXMuaW52ZW50b3J5W3Nsb3RdO1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuY2FsY0JvbnVzU3RhdHMoKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRnYW1lLnNlbmRQbGF5ZXJNZXNzYWdlKHRoaXMuaWQsIFwiVGhhdCBjYW5ub3QgYmUgZXF1aXBwZWQgdGhlcmUuXCIpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0aXRlbS5zbG90ID0gbmV3U2xvdDtcclxuXHRcdFx0XHRcdFx0dGhpcy5pbnZlbnRvcnlbbmV3U2xvdF0gPSBpdGVtO1xyXG5cdFx0XHRcdFx0XHRkZWxldGUgdGhpcy5pbnZlbnRvcnlbc2xvdF07XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRlcXVpcEl0ZW0oc2xvdCkge1xyXG5cdFx0bGV0IG5ld1Nsb3QgPSBpdGVtLmZpbmRFcXVpcG1lbnRTbG90KCk7XHJcblx0XHR0aGlzLm1vdmVJdGVtVG9TbG90KHNsb3QsIG5ld1Nsb3QpO1xyXG5cdFx0dGhpcy5jYWxjQm9udXNTdGF0cygpO1xyXG5cdH1cclxuXHJcblx0dW5lcXVpcEl0ZW0oc2xvdCkge1xyXG5cdFx0bGV0IGl0ZW0gPSB0aGlzLmludmVudG9yeVtzbG90XTtcclxuXHRcdGlmICghaXRlbSkgcmV0dXJuO1xyXG5cdFx0XHJcblx0XHRpZiAoaXRlbS5zbG90ID49IGNvbmZpZy5JTlZFTlRPUllfU0laRSkge1xyXG5cdFx0XHRsZXQgbmV3U2xvdCA9IHRoaXMuZmluZEZpcnN0RW1wdHlTbG90KCk7XHJcblx0XHRcdGlmIChuZXdTbG90ID09PSBudWxsKSB7XHJcblx0XHRcdFx0Z2FtZS5zZW5kUGxheWVyTWVzc2FnZSh0aGlzLmlkLCBcIllvdXIgaW52ZW50b3J5IGlzIGZ1bGwuXCIpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMubW92ZUl0ZW1Ub1Nsb3Qoc2xvdCwgbmV3U2xvdCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0ZmluZEZpcnN0RW1wdHlTbG90KCkge1xyXG5cdFx0Zm9yIChsZXQgc2xvdCA9IDA7IHNsb3QgPCBjb25maWcuSU5WRU5UT1JZX1NJWkU7IHNsb3QrKykge1xyXG5cdFx0XHRpZiAoIXRoaXMuaW52ZW50b3J5W3Nsb3RdKSByZXR1cm4gc2xvdDtcclxuXHRcdH1cclxuXHRcdHJldHVybiBudWxsO1xyXG5cdH1cclxuXHJcblxyXG5cdHVwZGF0ZShkZWx0YSkge1xyXG5cdFx0Ly8gSW52ZW50b3J5IEl0ZW0gVXBkYXRlXHJcblx0XHR0aGlzLmludmVudG9yeS5mb3JFYWNoKChpdGVtKSA9PiB7XHJcblx0XHRcdGl0ZW0udXBkYXRlKCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHQvLyBSZXNwYXduaW5nXHJcblx0XHRpZiAodGhpcy5pc0RlYWQpIHtcclxuXHRcdFx0dGhpcy5yZXNwYXduVGltZXIgKz0gZGVsdGE7XHJcblx0XHRcdGlmICh0aGlzLnJlc3Bhd25UaW1lciA+PSB0aGlzLnJlc3Bhd25TcGVlZCkge1xyXG5cdFx0XHRcdHRoaXMucmVzcGF3bigpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly8gQXR0YWNraW5nXHJcblx0XHRpZiAodGhpcy5pc0F0dGFja2luZyB8fCB0aGlzLmF0dGFja1RpbWVyID4gMCkge1xyXG5cdFx0XHR0aGlzLmF0dGFja1RpbWVyICs9IGRlbHRhO1xyXG5cdFx0XHRpZiAodGhpcy5hdHRhY2tUaW1lciA+PSAwLjMpIHtcclxuXHRcdFx0XHR0aGlzLmlzQXR0YWNraW5nID0gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHRoaXMuYXR0YWNrVGltZXIgPj0gdGhpcy5hdHRhY2tTcGVlZCkge1xyXG5cdFx0XHRcdHRoaXMuYXR0YWNrVGltZXIgPSAwO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vIE1vdmVtZW50XHJcblx0XHRpZiAodGhpcy5pc01vdmluZykge1xyXG5cdFx0XHR0aGlzLmxlcnAgKz0gZGVsdGEgKiB0aGlzLm1vdmVTcGVlZDtcclxuXHRcdFx0XHJcblx0XHRcdGlmICh0aGlzLmxlcnAgPj0gMC40OSkge1xyXG5cdFx0XHRcdHRoaXMueCA9IHRoaXMuZGVzdGluYXRpb25YO1xyXG5cdFx0XHRcdHRoaXMueSA9IHRoaXMuZGVzdGluYXRpb25ZO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAodGhpcy5sZXJwID49IDAuOTkpIHtcclxuXHRcdFx0XHR0aGlzLnN0YXJ0WCA9IHRoaXMuZGVzdGluYXRpb25YO1xyXG5cdFx0XHRcdHRoaXMuc3RhcnRZID0gdGhpcy5kZXN0aW5hdGlvblk7XHJcblx0XHRcdFx0dGhpcy5sZXJwID0gMDtcclxuXHRcdFx0XHR0aGlzLmlzTW92aW5nID0gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn1cclxuIiwiaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9jb25maWcuanMnO1xyXG5cclxuLy8gQW4gRW50aXR5IGlzIGFueSBvYmplY3QgdGhhdCBhcHBlYXJzIG9uIHRoZSBtYXBcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVudGl0eSB7XHJcblx0Y29uc3RydWN0b3IobWFwLCB4LCB5LCBzcHJpdGUgPSAwKSB7XHJcblx0XHR0aGlzLm1hcCA9IG1hcDtcclxuXHRcdHRoaXMueCA9IHg7XHJcblx0XHR0aGlzLnkgPSB5O1xyXG5cdFx0aWYgKHNwcml0ZSA8IDApIHtcclxuXHRcdFx0c3ByaXRlID0gMDtcclxuXHRcdH1cclxuXHRcdHRoaXMuc3ByaXRlID0gc3ByaXRlO1xyXG5cdH1cclxufSIsImltcG9ydCBjb25maWcgZnJvbSAnLi4vY29uZmlnLmpzJztcclxuaW1wb3J0IHV0aWwgZnJvbSAnLi4vdXRpbC5qcyc7XHJcbmltcG9ydCBUaWxlIGZyb20gJy4vdGlsZS5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXAge1xyXG5cdGNvbnN0cnVjdG9yKGlkLCBkYXRhKSB7XHJcblx0XHR0aGlzLmlkID0gaWQ7XHJcblxyXG5cdFx0dGhpcy5uYW1lID0gZGF0YS5uYW1lO1xyXG5cdFx0dGhpcy5kcm9wQ2hhbmNlID0gdXRpbC5jbGFtcChkYXRhLmRyb3BDaGFuY2UsIDAsIDEwMCk7XHJcblx0XHQvL3RoaXMuZHJvcENoYW5jZSA9IDAgPSAwJSBjaGFuY2UgdG8gZHJvcCBpdGVtcyBpbiBpbnZlbnRvcnkgKGRyb3Agbm90aGluZyksIDEwMCA9IDEwMCUgY2hhbmNlIHRvIGRyb3AgKGRyb3AgZXZlcnl0aGluZylcclxuXHRcdHRoaXMuZHJvcEFtb3VudEVRID0gdXRpbC5jbGFtcChkYXRhLmRyb3BBbW91bnRFUSwgMCwgY29uZmlnLkVRVUlQTUVOVF9TSVpFKTtcclxuXHRcdC8vdGhpcy5kcm9wQW1vdW50RVEgPSBudW1iZXIgb2YgZXF1aXBwZWQgaXRlbXMgdGhlIHBsYXllciB3aWxsIGRyb3Agb24gZGVhdGguIGRyb3BFUSA9IEVRVUlQTUVOVF9TSVpFID0gZHJvcCBhbGwgZXF1aXBtZW50XHJcblx0XHRcclxuXHRcdHRoaXMuaXRlbXMgPSBkYXRhLml0ZW1zO1xyXG5cdFx0dGhpcy5ib3RzID0gZGF0YS5ib3RzO1xyXG5cdFx0dGhpcy5lZmZlY3RzID0gZGF0YS5lZmZlY3RzO1xyXG5cdFx0dGhpcy50ZXh0cyA9IGRhdGEudGV4dHM7XHJcblx0XHRcclxuXHRcdHRoaXMudGlsZXMgPSBbXTtcclxuXHRcdGZvciAobGV0IHkgPSAwOyB5IDwgY29uZmlnLk1BUF9DT0xVTU5TOyB5KyspIHtcclxuXHRcdFx0dGhpcy50aWxlc1t5XSA9IFtdO1xyXG5cdFx0XHRmb3IgKGxldCB4ID0gMDsgeCA8IGNvbmZpZy5NQVBfUk9XUzsgeCsrKSB7XHJcblx0XHRcdFx0bGV0IHRpbGVEYXRhID0gdGhpcy5nZXRUaWxlRGF0YShkYXRhLCAoeSAqIGNvbmZpZy5NQVBfQ09MVU1OUykgKyB4KTtcclxuXHRcdFx0XHR0aGlzLnRpbGVzW3ldW3hdID0gbmV3IFRpbGUodGlsZURhdGEpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHVwbG9hZCgpIHtcclxuXHRcdGdhbWUubWFwRGF0YVt0aGlzLmlkXSA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKCcuL3NlcnZlci9kYXRhL21hcC5qc29uJywgJ3V0ZjgnKSlbdGhpcy5pZF07XHJcblx0XHRmb3IgKGxldCB5ID0gMDsgeSA8IGNvbmZpZy5NQVBfUk9XUzsgeSsrKSB7XHJcblx0XHRcdGZvciAobGV0IHggPSAwOyB4IDwgY29uZmlnLk1BUF9DT0xVTU5TOyB4KyspIHtcclxuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGNvbmZpZy5NQVBfTEFZRVJTOyBpKyspIHtcclxuXHRcdFx0XHRcdHRoaXMudGlsZXNbeV1beF0ubGF5ZXJbaV0gPSBnYW1lLm1hcERhdGFbdGhpcy5pZF0udGlsZXNbaV1bKHkgKiBjb25maWcuTUFQX0NPTFVNTlMpICsgeF07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRnYW1lLnBsYXllckxpc3QuZm9yRWFjaCgocGxheWVyKSA9PiB7XHJcblx0XHRcdGlmIChwbGF5ZXIubWFwID09PSB0aGlzLmlkKSB7XHJcblx0XHRcdFx0cGxheWVyLmxvYWRNYXAoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cdFxyXG5cdHVwZGF0ZShkZWx0YSkge1xyXG5cdFx0bGV0IHBhY2sgPSB7XHJcblx0XHRcdG5hbWU6IHRoaXMubmFtZSxcclxuXHRcdFx0aXRlbXM6IFtdLFxyXG5cdFx0XHRib3RzOiBbXSxcclxuXHRcdFx0ZWZmZWN0czogW10sXHJcblx0XHRcdHRleHRzOiBbXVxyXG5cdFx0fTtcclxuXHRcdFxyXG5cdFx0dGhpcy5pdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XHJcblx0XHRcdHBhY2suaXRlbXNbaXRlbS5pZF0gPSBpdGVtLnVwZGF0ZShkZWx0YSk7XHJcblx0XHR9KTtcclxuXHRcdHRoaXMuYm90cy5mb3JFYWNoKChib3QpID0+IHtcclxuXHRcdFx0cGFjay5ib3RzW2JvdC5pZF0gPSBib3QudXBkYXRlKGRlbHRhKTtcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5lZmZlY3RzLmZvckVhY2goKGVmZmVjdCkgPT4ge1xyXG5cdFx0XHRwYWNrLmVmZmVjdHNbZWZmZWN0LmlkXSA9IGVmZmVjdC51cGRhdGUoZGVsdGEpO1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLnRleHRzLmZvckVhY2goKHRleHQpID0+IHtcclxuXHRcdFx0cGFjay50ZXh0c1t0ZXh0LmlkXSA9IHRleHQudXBkYXRlKGRlbHRhKTtcclxuXHRcdH0pO1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gcGFjaztcclxuXHR9XHJcblx0XHJcblx0Z2V0UGFjaygpIHtcclxuXHRcdGxldCBtYXBQYWNrID0ge1xyXG5cdFx0XHRuYW1lOiB0aGlzLm5hbWUsXHJcblx0XHRcdHRpbGVzOiB0aGlzLmdldFRpbGVQYWNrKCksXHJcblx0XHRcdGl0ZW1zOiBbXSxcclxuXHRcdFx0Ym90czogW10sXHJcblx0XHRcdGVmZmVjdHM6IFtdLFxyXG5cdFx0XHR0ZXh0czogW11cclxuXHRcdH07XHJcblxyXG5cdFx0dGhpcy5pdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XHJcblx0XHRcdG1hcFBhY2suaXRlbXNbaXRlbS5pZF0gPSBpdGVtLmdldFBhY2soKTtcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5ib3RzLmZvckVhY2goKGJvdCkgPT4ge1xyXG5cdFx0XHRtYXBQYWNrLmJvdHNbYm90LmlkXSA9IGJvdC5nZXRQYWNrKCk7XHJcblx0XHR9KTtcclxuXHRcdHRoaXMuZWZmZWN0cy5mb3JFYWNoKChlZmZlY3QpID0+IHtcclxuXHRcdFx0bWFwUGFjay5lZmZlY3RzW2VmZmVjdC5pZF0gPSBlZmZlY3QuZ2V0UGFjaygpO1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLnRleHRzLmZvckVhY2goKHRleHQpID0+IHtcclxuXHRcdFx0bWFwUGFjay50ZXh0c1t0ZXh0LmlkXSA9IHRleHQuZ2V0UGFjaygpO1xyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcdHJldHVybiBtYXBQYWNrO1xyXG5cdH1cclxuXHRcclxuXHRnZXRUaWxlUGFjaygpIHtcclxuXHRcdGxldCB0aWxlUGFjayA9IFtdO1xyXG5cclxuXHRcdGZvciAobGV0IHkgPSAwOyB5IDwgY29uZmlnLk1BUF9ST1dTOyB5KyspIHtcclxuXHRcdFx0dGlsZVBhY2tbeV0gPSBbXTtcclxuXHRcdFx0Zm9yIChsZXQgeCA9IDA7IHggPCBjb25maWcuTUFQX0NPTFVNTlM7IHgrKykge1xyXG5cdFx0XHRcdHRpbGVQYWNrW3ldW3hdID0gdGhpcy50aWxlc1t5XVt4XS5nZXRQYWNrKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGlsZVBhY2s7XHJcblx0fVxyXG5cclxuXHRnZXRUaWxlRGF0YShkYXRhLCBpbmRleCA9IDApIHtcclxuXHRcdGlmICghZGF0YSkgcmV0dXJuO1xyXG5cclxuXHRcdGxldCB0aWxlRGF0YSA9IHtcclxuXHRcdFx0bGF5ZXI6IFtdLFxyXG5cdFx0XHR3YWxsOiBkYXRhLnRpbGVzLndhbGxbaW5kZXhdLFxyXG5cdFx0XHQvL2NhbkF0dGFjazogZGF0YS5jYW5BdHRhY2tbaW5kZXhdLFxyXG5cdFx0XHQvL2RhbWFnZTogZGF0YS5kYW1hZ2VbaW5kZXhdLFxyXG5cdFx0XHQvL2RlZmVuY2U6IGRhdGEuZGVmZW5jZVtpbmRleF0sXHJcblx0XHRcdC8vaGVhbHRoTWF4OiBkYXRhLmhlYWx0aE1heFtpbmRleF0sXHJcblx0XHRcdC8vd2FycE1hcDogZGF0YS53YXJwTWFwW2luZGV4XSxcclxuXHRcdFx0Ly93YXJwWDogZGF0YS53YXJwWFtpbmRleF0sXHJcblx0XHRcdC8vd2FycFk6IGRhdGEud2FycFlbaW5kZXhdXHJcblx0XHR9O1xyXG5cclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY29uZmlnLk1BUF9MQVlFUlM7IGkrKykge1xyXG5cdFx0XHR0aWxlRGF0YS5sYXllcltpXSA9IGRhdGEudGlsZXMubGF5ZXJbaV1baW5kZXhdO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0aWxlRGF0YTtcclxuXHR9O1xyXG59IiwiaW1wb3J0IGRiIGZyb20gJy4uL2RiLmpzJztcclxuaW1wb3J0IGdhbWUgZnJvbSAnLi4vZ2FtZS5qcyc7XHJcbmltcG9ydCBBY3RvciBmcm9tICcuL2FjdG9yLmpzJztcclxuXHJcbi8vIEEgUGxheWVyIGlzIGFuIEFjdG9yIHdoaWNoIHRha2VzIGlucHV0IGZyb20gYSBjbGllbnRcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXllciBleHRlbmRzIEFjdG9yIHtcclxuXHRjb25zdHJ1Y3RvcihpZCkge1xyXG5cdFx0bGV0IGRhdGEgPSBkYi5nZXRQbGF5ZXJEYXRhKGlkKTtcclxuXHJcblx0XHRzdXBlcihkYXRhLm1hcCwgZGF0YS54LCBkYXRhLnksIGRhdGEubmFtZSwgZGF0YS5zcHJpdGUpO1xyXG5cdFx0dGhpcy5jb250cm9sbGVyID0gJ3BsYXllcic7XHJcblx0XHR0aGlzLmlkID0gaWQ7XHJcblx0XHR0aGlzLmFkbWluQWNjZXNzID0gZGF0YS5hZG1pbkFjY2VzcztcclxuXHJcblx0XHR0aGlzLmRhbWFnZUJhc2UgPSBkYXRhLmRhbWFnZUJhc2U7XHRcdFx0XHQvLyBtaW5pbXVtIGRhbWFnZSBhIHBsYXllciBjYW4gaGF2ZVxyXG5cdFx0dGhpcy5kZWZlbmNlQmFzZSA9IGRhdGEuZGVmZW5jZUJhc2U7XHRcdFx0Ly8gbWluaW11bSBkZWZlbmNlIGEgcGxheWVyIGNhbiBoYXZlXHJcblx0XHR0aGlzLmhlYWx0aE1heEJhc2UgPSBkYXRhLmhlYWx0aE1heEJhc2U7XHQvLyBtYXggaGVhbHRoIHdpdGhvdXQgYm9udXNlc1xyXG5cdFx0dGhpcy5lbmVyZ3lNYXhCYXNlID0gZGF0YS5lbmVyZ3lNYXhCYXNlO1x0Ly8gbWF4IGVuZXJneSB3aXRob3V0IGJvbnVzZXNcclxuXHRcdHRoaXMuY2FsY1N0YXRzKCk7XHJcblx0XHR0aGlzLnJlc3RvcmUoKTtcclxuXHJcblx0XHR0aGlzLnNlbGVjdGVkID0gbnVsbDtcclxuXHRcdHRoaXMuaW5wdXQgPSB7XHJcblx0XHRcdGRpcmVjdGlvbjogbnVsbCxcclxuXHRcdFx0cnVuOiBmYWxzZSxcclxuXHRcdFx0cGlja3VwOiBmYWxzZSxcclxuXHRcdFx0YXR0YWNrOiBmYWxzZVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0bG9hZE1hcCgpIHtcclxuXHRcdFxyXG5cdH1cclxuXHRcclxuXHR1cGRhdGUoZGVsdGEpIHtcclxuXHRcdHN1cGVyLnVwZGF0ZShkZWx0YSk7XHRcdC8vIERlZmF1bHQgQWN0b3IgVXBkYXRlXHJcblx0XHRcclxuXHRcdGlmICghdGhpcy5pc0RlYWQpIHtcclxuXHRcdFx0Ly8gQ2hlY2sgZm9yIEF0YWNrIElucHV0XHJcblx0XHRcdGlmICh0aGlzLmlucHV0LmF0dGFjayAmJiB0aGlzLmF0dGFja1RpbWVyID09PSAwKSB7XHJcblx0XHRcdFx0dGhpcy5hdHRhY2soKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0Ly8gQ2hlY2sgZm9yIE1vdmVtZW50IElucHV0XHJcblx0XHRcdGlmICghdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdGlmICh0aGlzLmlucHV0LmRpcmVjdGlvbikge1xyXG5cdFx0XHRcdFx0Ly8gQ2hlY2sgZm9yIFJ1biBJbnB1dFxyXG5cdFx0XHRcdFx0aWYgKHRoaXMuaW5wdXQucnVuKSB7XHJcblx0XHRcdFx0XHRcdGlmICh0aGlzLmVuZXJneSA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmlzUnVubmluZyA9IHRydWU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5pc1J1bm5pbmcgPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuaXNSdW5uaW5nID0gZmFsc2U7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUodGhpcy5pbnB1dC5kaXJlY3Rpb24pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gdGhpcy5nZXRQYWNrKCk7XHJcblx0fVxyXG5cdFxyXG5cdGdldFBhY2soKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRpZDogdGhpcy5pZCxcclxuXHRcdFx0bmFtZTogdGhpcy5uYW1lLFxyXG5cdFx0XHRzcHJpdGU6IHRoaXMuc3ByaXRlLFxyXG5cdFx0XHRkaXJlY3Rpb246IHRoaXMuZGlyZWN0aW9uLFxyXG5cdFx0XHRtYXA6IHRoaXMubWFwLFxyXG5cdFx0XHR4OiB0aGlzLnN0YXJ0WCxcclxuXHRcdFx0eTogdGhpcy5zdGFydFksXHJcblx0XHRcdHo6IHRoaXMueixcclxuXHRcdFx0ZGVzdGluYXRpb25YOiB0aGlzLmRlc3RpbmF0aW9uWCxcclxuXHRcdFx0ZGVzdGluYXRpb25ZOiB0aGlzLmRlc3RpbmF0aW9uWSxcclxuXHRcdFx0bGVycDogdGhpcy5sZXJwLFxyXG5cdFx0XHRpc1J1bm5pbmc6IHRoaXMuaXNSdW5uaW5nLFxyXG5cdFx0XHRpc0F0dGFja2luZzogdGhpcy5pc0F0dGFja2luZyxcclxuXHRcdFx0aXNEZWFkOiB0aGlzLmlzRGVhZFxyXG5cdFx0fTtcclxuXHR9XHJcblx0XHJcblx0Z2V0UHJpdmF0ZVBhY2soKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRpZDogdGhpcy5pZCxcclxuXHRcdFx0aGVhbHRoOiB0aGlzLmhlYWx0aCxcclxuXHRcdFx0aGVhbHRoTWF4OiB0aGlzLmhlYWx0aE1heCxcclxuXHRcdFx0ZW5lcmd5OiB0aGlzLmVuZXJneSxcclxuXHRcdFx0ZW5lcmd5TWF4OiB0aGlzLmVuZXJneU1heCxcclxuXHRcdFx0bW92ZVNwZWVkOiB0aGlzLm1vdmVTcGVlZCxcclxuXHRcdFx0YXR0YWNrU3BlZWQ6IHRoaXMuYXR0YWNrU3BlZWQsXHJcblx0XHRcdGF0dGFja1RpbWVyOiB0aGlzLmF0dGFja1RpbWVyLFxyXG5cdFx0XHRpbnZlbnRvcnk6IHRoaXMuZ2V0SW52ZW50b3J5UGFjaygpXHJcblx0XHR9O1xyXG5cdH1cclxuXHRcclxuXHRnZXRJbnZlbnRvcnlQYWNrKCkge1xyXG5cdFx0bGV0IGludmVudG9yeVBhY2sgPSBbXTtcclxuXHRcdFxyXG5cdFx0dGhpcy5pbnZlbnRvcnkuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG5cdFx0XHRpbnZlbnRvcnlQYWNrW2l0ZW0uc2xvdF0gPSBpdGVtLmdldFBhY2soKTtcclxuXHRcdH0pO1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gaW52ZW50b3J5UGFjaztcclxuXHR9XHJcblx0XHJcblx0Y2hlY2tBZG1pbihhY2Nlc3MgPSAxKSB7XHJcblx0XHRpZiAoYWNjZXNzIDwgMSkgYWNjZXNzID0gMTtcclxuXHRcdHJldHVybiAodGhpcy5hZG1pbkFjY2VzcyA+PSBhY2Nlc3MpO1xyXG5cdH1cclxuXHJcblx0b25JbnB1dChkYXRhKSB7XHJcblx0XHRzd2l0Y2ggKGRhdGEuaW5wdXQpIHtcclxuXHRcdFx0Y2FzZSBudWxsOlxyXG5cdFx0XHRjYXNlICdtb3ZlJzogdGhpcy5pbnB1dC5kaXJlY3Rpb24gPSBkYXRhLmRpcmVjdGlvbjtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ3J1bic6IHRoaXMuaW5wdXQucnVuID0gZGF0YS5zdGF0ZTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ3BpY2t1cCc6XHJcblx0XHRcdFx0aWYgKCF0aGlzLmlucHV0LnBpY2t1cCAmJiBkYXRhLnN0YXRlKSB7XHJcblx0XHRcdFx0XHR0aGlzLnBpY2tVcCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLmlucHV0LnBpY2t1cCA9IGRhdGEuc3RhdGU7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdhdHRhY2snOlxyXG5cdFx0XHRcdHRoaXMuaW5wdXQuYXR0YWNrID0gZGF0YS5zdGF0ZTtcclxuXHRcdFx0XHR0aGlzLmF0dGFjaygxLCB0aGlzLmRpcmVjdGlvbik7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdkb3VibGVDbGlja0l0ZW0nOlxyXG5cdFx0XHRcdGlmICh0aGlzLmludmVudG9yeVtkYXRhLnNsb3RdKSB7XHJcblx0XHRcdFx0XHRpZiAoIXRoaXMuaXNEZWFkKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMudXNlSXRlbShkYXRhLnNsb3QpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ3JpZ2h0Q2xpY2tJdGVtJzpcclxuXHRcdFx0XHRpZiAodGhpcy5pbnZlbnRvcnlbZGF0YS5zbG90XSkge1xyXG5cdFx0XHRcdFx0aWYgKCF0aGlzLmlzRGVhZCkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRyb3BJdGVtKGRhdGEuc2xvdCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnZHJhZ1N0b3BHYW1lJzpcclxuXHRcdFx0XHRpZiAodGhpcy5pbnZlbnRvcnlbZGF0YS5zbG90XSkge1xyXG5cdFx0XHRcdFx0aWYgKCF0aGlzLmlzRGVhZCkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRyb3BJdGVtKGRhdGEuc2xvdCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnZHJhZ1N0b3BJbnZlbnRvcnknOlxyXG5cdFx0XHRcdGlmICh0aGlzLmludmVudG9yeVtkYXRhLnNsb3RdKSB7XHJcblx0XHRcdFx0XHRpZiAoIXRoaXMuaXNEZWFkKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMubW92ZUl0ZW1Ub1Nsb3QoZGF0YS5zbG90LCBkYXRhLm5ld1Nsb3QpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ2RyYWdTdG9wRXF1aXBtZW50JzpcclxuXHRcdFx0XHRpZiAodGhpcy5pbnZlbnRvcnlbZGF0YS5zbG90XSkge1xyXG5cdFx0XHRcdFx0aWYgKCF0aGlzLmlzRGVhZCkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLm1vdmVJdGVtVG9TbG90KGRhdGEuc2xvdCwgZGF0YS5uZXdTbG90KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdzZXJ2ZXJDaGF0JzogZ2FtZS5zZW5kU2VydmVyTWVzc2FnZShgJHt0aGlzLm5hbWV9IHllbGxzLCBcIiR7ZGF0YS5tZXNzYWdlfVwiYCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdtYXBDaGF0JzogZ2FtZS5zZW5kTWFwTWVzc2FnZSh0aGlzLm1hcCwgYCR7dGhpcy5uYW1lfSBzYXlzLCBcIiR7ZGF0YS5tZXNzYWdlfVwiYCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdwbGF5ZXJDaGF0JzpcclxuXHRcdFx0XHRsZXQgdGFyZ2V0ID0gdGhpcy5wbGF5ZXJMaXN0W2RhdGEudGFyZ2V0SWRdO1xyXG5cdFx0XHRcdGlmICh0YXJnZXQpIHtcclxuXHRcdFx0XHRcdGdhbWUuc2VuZFBsYXllck1lc3NhZ2UodGFyZ2V0LmlkLCBgJHt0aGlzLm5hbWV9IHdoaXNwZXJzLCBcIiR7ZGF0YS5tZXNzYWdlfVwiYCk7XHJcblx0XHRcdFx0XHRnYW1lLnNlbmRQbGF5ZXJNZXNzYWdlKHRoaXMuaWQsIGBZb3Ugd2hpc3BlciB0byAke3RhcmdldC5uYW1lfSwgXCIke2RhdGEubWVzc2FnZX1cImApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHQvLyBHb2QgSW5wdXRzXHJcblx0XHRcdGNhc2UgJ3NwYXduSXRlbSc6XHJcblx0XHRcdFx0aWYgKHRoaXMuY2hlY2tBZG1pbigyKSkge1xyXG5cdFx0XHRcdFx0Z2FtZS5zcGF3bkl0ZW0oZGF0YS5tYXBJZCwgZGF0YS54LCBkYXRhLnksIGRhdGEudHlwZSwgZGF0YS5zdGFjayk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0Z2FtZS5zZW5kUGxheWVyTWVzc2FnZSh0aGlzLmlkLCBgWW91IGRvbid0IGhhdmUgYWNjZXNzIHRvIHRoYXQgY29tbWFuZC5gKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICd1cGxvYWRNYXAnOlxyXG5cdFx0XHRcdGlmICh0aGlzLmNoZWNrQWRtaW4oMikpIHtcclxuXHRcdFx0XHRcdGdhbWUubWFwTGlzdFtkYXRhLm1hcElkXS51cGxvYWQoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRnYW1lLnNlbmRQbGF5ZXJNZXNzYWdlKHRoaXMuaWQsIGBZb3UgZG9uJ3QgaGF2ZSBhY2Nlc3MgdG8gdGhhdCBjb21tYW5kLmApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0fVxyXG59IiwiaW1wb3J0IGdhbWUgZnJvbSAnLi4vZ2FtZS5qcyc7XHJcbmltcG9ydCB1dGlsIGZyb20gJy4uL3V0aWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGV4dCB7XHJcblx0Y29uc3RydWN0b3IobWFwLCB4LCB5LCBtZXNzYWdlLCBjb2xvdXIgPSAnIzAwMDAwMCcsIHZlbFggPSAwLCB2ZWxZID0gMCkge1xyXG5cdFx0dGhpcy5tYXAgPSBtYXA7XHJcblx0XHR0aGlzLnggPSB4O1xyXG5cdFx0dGhpcy55ID0geTtcclxuXHRcdHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XHJcblx0XHR0aGlzLmNvbG91ciA9IGNvbG91cjtcclxuXHRcdFxyXG5cdFx0dGhpcy52ZWxYID0gdmVsWDtcclxuXHRcdHRoaXMudmVsWSA9IHZlbFk7XHJcblx0XHR0aGlzLnRpbWVyID0gMDtcclxuXHJcblx0XHR0aGlzLmlkID0gdXRpbC5maXJzdEVtcHR5SW5kZXgoZ2FtZS5tYXBMaXN0W3RoaXMubWFwXS50ZXh0cyk7XHJcblx0XHRnYW1lLm1hcExpc3RbdGhpcy5tYXBdLnRleHRzW3RoaXMuaWRdID0gdGhpcztcclxuXHR9XHJcblx0XHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHR0aGlzLnRpbWVyICs9IGRlbHRhO1xyXG5cdFx0aWYgKHRoaXMudGltZXIgPiAzKSB7XHJcblx0XHRcdHRoaXMucmVtb3ZlKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy54ICs9IHRoaXMudmVsWDtcclxuXHRcdHRoaXMueSArPSB0aGlzLnZlbFk7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuZ2V0UGFjaygpO1xyXG5cdH1cclxuXHRcclxuXHRnZXRQYWNrKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0aWQ6IHRoaXMuaWQsXHJcblx0XHRcdG1hcDogdGhpcy5tYXAsXHJcblx0XHRcdHg6IHRoaXMueCxcclxuXHRcdFx0eTogdGhpcy55LFxyXG5cdFx0XHRtZXNzYWdlOiB0aGlzLm1lc3NhZ2UsXHJcblx0XHRcdGNvbG91cjogdGhpcy5jb2xvdXJcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHRyZW1vdmUoKSB7XHJcblx0XHRkZWxldGUgZ2FtZS5tYXBMaXN0W3RoaXMubWFwXS50ZXh0c1t0aGlzLmlkXTtcclxuXHR9XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGlsZSB7XHJcblx0Y29uc3RydWN0b3IoZGF0YSkge1xyXG5cdFx0dGhpcy5sYXllciA9IGRhdGEubGF5ZXI7XHJcbiAgICB0aGlzLndhbGwgPSBkYXRhLndhbGw7XHJcbiAgICB0aGlzLmNhbkF0dGFjayA9IGRhdGEuY2FuQXR0YWNrO1xyXG4gICAgdGhpcy5kYW1hZ2UgPSBkYXRhLmRhbWFnZTtcclxuXHRcdHRoaXMuZGVmZW5jZSA9IGRhdGEuZGVmZW5jZTtcclxuXHRcdHRoaXMuaGVhbHRoTWF4ID0gZGF0YS5oZWFsdGhNYXg7XHJcblx0XHR0aGlzLmhlYWx0aCA9IHRoaXMuaGVhbHRoTWF4O1xyXG5cclxuXHRcdHRoaXMud2FycE1hcCA9IGRhdGEud2FycE1hcDtcclxuXHRcdHRoaXMud2FycFggPSBkYXRhLndhcnBYO1xyXG5cdFx0dGhpcy53YXJwWSA9IGRhdGEud2FycFk7XHJcbiAgfVxyXG5cclxuXHRvbldhbGsoKSB7XHJcblx0XHQvLyBSdW4gTWFwV2FsayNfeF95IHNjcmlwdFxyXG4gIH1cclxuICBcclxuXHRvbkNsaWNrKCkge1xyXG5cdFx0Ly8gUnVuIE1hcENsaWNrI194X3kgc2NyaXB0XHJcbiAgfVxyXG4gIFxyXG5cdG9uQXR0YWNrKCkge1xyXG5cdFx0Ly8gUnVuIE1hcEF0dGFjayNfeF95IHNjcmlwdFxyXG4gIH1cclxuICBcclxuICBnZXRQYWNrKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbGF5ZXI6IHRoaXMubGF5ZXIsXHJcbiAgICAgIHdhbGw6IHRoaXMud2FsbCxcclxuICAgICAgY2FuQXR0YWNrOiB0aGlzLmNhbkF0dGFjayxcclxuICAgICAgZGFtYWdlOiB0aGlzLmRhbWFnZSxcclxuICAgICAgZGVmZW5jZTogdGhpcy5kZWZlbmNlLFxyXG4gICAgICBoZWFsdGhNYXg6IHRoaXMuaGVhbHRoTWF4LFxyXG4gICAgICB3YXJwTWFwOiB0aGlzLndhcnBNYXAsXHJcbiAgICAgIHdhcnBYOiB0aGlzLndhcnBYLFxyXG4gICAgICB3YXJwWTogdGhpcy53YXJwWVxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuIiwiY29uc3QgY29uZmlnID0ge307XHJcblxyXG5jb25maWcuUE9SVCA9IDIwMDA7XHJcbmNvbmZpZy5GUkFNRVJBVEUgPSAxMDAwIC8gNjA7XHJcbmNvbmZpZy5USUxFX1NJWkUgPSAzMjtcclxuY29uZmlnLlNMT1RfU0laRSA9IGNvbmZpZy5USUxFX1NJWkUgKyA2O1xyXG5cclxuY29uZmlnLk1BUF9MQVlFUlMgPSA2O1xyXG5jb25maWcuTUFQX0NPTFVNTlMgPSAxMjtcclxuY29uZmlnLk1BUF9ST1dTID0gMTI7XHJcblxyXG5jb25maWcuTUFYX01BUFMgPSAxMDtcclxuY29uZmlnLk1BWF9VU0VSUyA9IDEwMDtcclxuY29uZmlnLk1BWF9TUFJJVEVTID0gMTM7XHJcbmNvbmZpZy5NQVhfRUZGRUNUUyA9IDcwO1xyXG5cclxuY29uZmlnLk1BWF9IRUFMVEhfQkFTRSA9IDIwMDtcclxuY29uZmlnLk1BWF9IRUFMVEhfQk9OVVMgPSA1NTtcclxuY29uZmlnLk1BWF9FTkVSR1lfQkFTRSA9IDIwMDsgIFxyXG5jb25maWcuTUFYX0VORVJHWV9CT05VUyA9IDU1O1xyXG5cclxuY29uZmlnLklOVkVOVE9SWV9TSVpFID0gMjA7XHJcbmNvbmZpZy5FUVVJUE1FTlRfU0laRSA9IDU7XHJcblxyXG5jb25maWcuU1RBUlRfTUFQID0gMTtcclxuY29uZmlnLlNUQVJUX1ggPSA1O1xyXG5jb25maWcuU1RBUlRfWSA9IDU7XHJcbmNvbmZpZy5TVEFSVF9OQU1FID0gJ05ldyBQbGF5ZXInO1xyXG5jb25maWcuU1RBUlRfU1BSSVRFID0gMTtcclxuY29uZmlnLlNUQVJUX0RBTUFHRSA9IDI7XHJcbmNvbmZpZy5TVEFSVF9ERUZFTkNFID0gMDtcclxuY29uZmlnLlNUQVJUX0hFQUxUSF9NQVggPSAyMDtcclxuY29uZmlnLlNUQVJUX0VORVJHWV9NQVggPSAxMDtcclxuXHJcbmNvbmZpZy5CQUNLVVBfVElNRSA9IDU7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjb25maWc7XHJcbiIsImltcG9ydCBtb25nb2pzIGZyb20gXCJtb25nb2pzXCI7XHJcblxyXG5jb25zdCBtb25nbyA9IG1vbmdvanMoJ2xvY2FsaG9zdDoyNzAxNy9vZHlzc2V5JywgWydhY2NvdW50cycsICdwbGF5ZXJzJywgJ21hcHMnLCAnaXRlbXMnLCAnbnBjcyddKTtcclxuXHJcbmNsYXNzIERhdGFiYXNlIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIC8vIFRoaXMgc2hvdWxkIGJlIGhlbGQgaW4gZGF0YWJhc2VcclxuICAgIHRoaXMuaXRlbXMgPSBbXHJcbiAgICAgIHtcdC8vIHR5cGUgMFxyXG4gICAgICAgIG5hbWU6IFwiQmxhbmsgSXRlbVwiLFxyXG4gICAgICAgIHNwcml0ZTogNjgsXHJcbiAgICAgICAgdHlwZTogJ25vbmUnLFxyXG4gICAgICAgIHJldXNhYmxlOiBmYWxzZSxcclxuICAgICAgICBcclxuICAgICAgICB1c2U6XHRcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICBnZXQ6XHRcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICBkcm9wOlx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHtcdC8vIHR5cGUgMVxyXG4gICAgICAgIG5hbWU6IFwiSGVhbHRoIFBvdGlvblwiLFxyXG4gICAgICAgIHNwcml0ZTogMSxcclxuICAgICAgICB0eXBlOiAncG90aW9uJyxcclxuICAgICAgICByZXVzYWJsZTogZmFsc2UsXHJcbiAgICAgICAgXHJcbiAgICAgICAgdXNlOlx0XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IDEwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oZWFsdGggKz0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICBuZXcgRmxvYXRUZXh0KHRoaXMuZ3JpZFBvc2l0aW9uLngsIHRoaXMuZ3JpZFBvc2l0aW9uLnksIHZhbHVlLCBcIiMwMEZGMDBcIik7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5oZWFsdGggPiB0aGlzLmhlYWx0aE1heCkge1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLmhlYWx0aCA9IHRoaXMuaGVhbHRoTWF4O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICBnZXQ6XHRcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICBkcm9wOlx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgIH0sIFxyXG4gICAgICB7XHQvLyB0eXBlIDJcclxuICAgICAgICBuYW1lOiBcIkVuZXJneSBQb3Rpb25cIixcclxuICAgICAgICBzcHJpdGU6IDIsXHJcbiAgICAgICAgdHlwZTogJ3BvdGlvbicsXHJcbiAgICAgICAgcmV1c2FibGU6IGZhbHNlLFxyXG4gICAgICAgIFxyXG4gICAgICAgIHVzZTpcdFx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSAxMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuZW5lcmd5ICs9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgbmV3IEZsb2F0VGV4dCh0aGlzLmdyaWRQb3NpdGlvbi54LCB0aGlzLmdyaWRQb3NpdGlvbi55LCB2YWx1ZSwgXCIjRkZGRjAwXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZW5lcmd5ID4gdGhpcy5lbmVyZ3lNYXgpIHtcclxuICAgICAgICAgICAgICAgICAgdGhpcy5lbmVyZ3kgPSB0aGlzLmVuZXJneU1heDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgZ2V0Olx0XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgZHJvcDpcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICB9LCBcclxuICAgICAge1x0Ly8gdHlwZSAzXHJcbiAgICAgICAgbmFtZTogXCJJbmNvZ25pdG9cIixcclxuICAgICAgICBzcHJpdGU6IDEyLFxyXG4gICAgICAgIHR5cGU6ICdzcGVjaWFsJyxcclxuICAgICAgICByZXVzYWJsZTogdHJ1ZSxcclxuICAgICAgICBcclxuICAgICAgICB1c2U6XHRcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTcHJpdGUoZ2FtZS5ybmQuaW50ZWdlckluUmFuZ2UoMSwgTUFYX1NQUklURVMpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgZ2V0Olx0XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgZHJvcDpcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHQvLyB0eXBlIDRcclxuICAgICAgICBuYW1lOiBcIlN3b3JkXCIsXHJcbiAgICAgICAgc3ByaXRlOiAxMCxcclxuICAgICAgICB0eXBlOiAnd2VhcG9uJyxcclxuICAgICAgICByZXVzYWJsZTogdHJ1ZSxcclxuICAgICAgICBcclxuICAgICAgICB1c2U6XHRcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICBnZXQ6XHRcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICBkcm9wOlx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgIFxyXG4gICAgICAgIGRhbWFnZUJvbnVzOiAxLFxyXG4gICAgICAgIGRlZmVuY2VCb251czogMCxcclxuICAgICAgICBoZWFsdGhNYXhCb251czogMCxcclxuICAgICAgICBlbmVyZ3lNYXhCb251czogMCxcclxuICAgICAgICByYW5nZUJvbnVzOiAwXHJcbiAgICAgICAgXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcdC8vIHR5cGUgNVxyXG4gICAgICAgIG5hbWU6IFwiQXhlXCIsXHJcbiAgICAgICAgc3ByaXRlOiAxNCxcclxuICAgICAgICB0eXBlOiAnd2VhcG9uJyxcclxuICAgICAgICByZXVzYWJsZTogdHJ1ZSxcclxuICAgICAgICBcclxuICAgICAgICB1c2U6XHRcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICBnZXQ6XHRcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICBkcm9wOlx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgIFxyXG4gICAgICAgIGRhbWFnZUJvbnVzOiAyLFxyXG4gICAgICAgIGRlZmVuY2VCb251czogMCxcclxuICAgICAgICBoZWFsdGhNYXhCb251czogMCxcclxuICAgICAgICBlbmVyZ3lNYXhCb251czogMCxcclxuICAgICAgICByYW5nZUJvbnVzOiAwXHJcbiAgICAgICAgXHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICBdO1xyXG5cclxuICAgIHRoaXMubWFwcyA9IFtcclxuICAgICAge1x0Ly8gaWQgMFxyXG4gICAgICAgIG5hbWU6IFwiQmxhbmsgTWFwXCIsXHJcbiAgICAgICAgZHJvcENoYW5jZTogMTAwLFxyXG4gICAgICAgIGRyb3BBbW91bnRFUTogMCxcclxuICAgICAgICBqb2luOlx0XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgbGVhdmU6XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcdC8vIGlkIDFcclxuICAgICAgICBuYW1lOiBcIkNyZW5kYWxlIDFcIixcclxuICAgICAgICBkcm9wQ2hhbmNlOiAxMDAsXHJcbiAgICAgICAgZHJvcEFtb3VudEVROiAwLFxyXG4gICAgICAgIGpvaW46XHRcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICBsZWF2ZTpcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAge1x0Ly8gaWQgMlxyXG4gICAgICAgIG5hbWU6IFwiQ3JlbmRhbGUgMlwiLFxyXG4gICAgICAgIGRyb3BDaGFuY2U6IDEwMCxcclxuICAgICAgICBkcm9wQW1vdW50RVE6IDAsXHJcbiAgICAgICAgam9pbjpcdFx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgIGxlYXZlOlx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICB7XHQvLyBpZCAzXHJcbiAgICAgICAgbmFtZTogXCJDcmVuZGFsZSAzXCIsXHJcbiAgICAgICAgZHJvcENoYW5jZTogMTAwLFxyXG4gICAgICAgIGRyb3BBbW91bnRFUTogMCxcclxuICAgICAgICBqb2luOlx0XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgbGVhdmU6XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcdC8vIGlkIDRcclxuICAgICAgICBuYW1lOiBcIkNyZW5kYWxlIDRcIixcclxuICAgICAgICBkcm9wQ2hhbmNlOiAxMDAsXHJcbiAgICAgICAgZHJvcEFtb3VudEVROiAwLFxyXG4gICAgICAgIGpvaW46XHRcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICBsZWF2ZTpcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAge1x0Ly8gaWQgNVxyXG4gICAgICAgIG5hbWU6IFwiQ3JlbmRhbGUgNVwiLFxyXG4gICAgICAgIGRyb3BDaGFuY2U6IDEwMCxcclxuICAgICAgICBkcm9wQW1vdW50RVE6IDAsXHJcbiAgICAgICAgam9pbjpcdFx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgIGxlYXZlOlx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICB7XHQvLyBpZCA2XHJcbiAgICAgICAgbmFtZTogXCJDcmVuZGFsZSA2XCIsXHJcbiAgICAgICAgZHJvcENoYW5jZTogMTAwLFxyXG4gICAgICAgIGRyb3BBbW91bnRFUTogMCxcclxuICAgICAgICBqb2luOlx0XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgbGVhdmU6XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcdC8vIGlkIDdcclxuICAgICAgICBuYW1lOiBcIkNyZW5kYWxlIDdcIixcclxuICAgICAgICBkcm9wQ2hhbmNlOiAxMDAsXHJcbiAgICAgICAgZHJvcEFtb3VudEVROiAwLFxyXG4gICAgICAgIGpvaW46XHRcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICBsZWF2ZTpcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAge1x0Ly8gaWQgOFxyXG4gICAgICAgIG5hbWU6IFwiQ3JlbmRhbGUgOFwiLFxyXG4gICAgICAgIGRyb3BDaGFuY2U6IDEwMCxcclxuICAgICAgICBkcm9wQW1vdW50RVE6IDAsXHJcbiAgICAgICAgam9pbjpcdFx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgIGxlYXZlOlx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICB7XHQvLyBpZCA5XHJcbiAgICAgICAgbmFtZTogXCJDcmVuZGFsZSA5XCIsXHJcbiAgICAgICAgZHJvcENoYW5jZTogMTAwLFxyXG4gICAgICAgIGRyb3BBbW91bnRFUTogMCxcclxuICAgICAgICBqb2luOlx0XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgbGVhdmU6XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICBdO1xyXG5cclxuICAgIHRoaXMucGxheWVycyA9IFtcclxuICAgICAge1x0Ly9pZCAwXHJcbiAgICAgICAgbmFtZTogXCJGYW5rYWRvcmVcIixcclxuICAgICAgICBzcHJpdGU6IDEsXHJcbiAgICAgICAgYWRtaW5BY2Nlc3M6IDAsXHJcbiAgICAgICAgbWFwOiAxLFxyXG4gICAgICAgIHg6IDUsXHJcbiAgICAgICAgeTogNSxcclxuICAgICAgICBkYW1hZ2VCYXNlOiAxMCxcclxuICAgICAgICBkZWZlbmNlQmFzZTogMixcclxuICAgICAgICBoZWFsdGhNYXhCYXNlOiAyMCxcclxuICAgICAgICBlbmVyZ3lNYXhCYXNlOiA0MFxyXG4gICAgICB9LFxyXG4gICAgICB7XHQvL2lkIDFcclxuICAgICAgICBuYW1lOiBcIk9iYml0dFwiLFxyXG4gICAgICAgIHNwcml0ZTogMyxcclxuICAgICAgICBhZG1pbkFjY2VzczogMCxcclxuICAgICAgICBtYXA6IDEsXHJcbiAgICAgICAgeDogNCxcclxuICAgICAgICB5OiA0LFxyXG4gICAgICAgIGRhbWFnZUJhc2U6IDEwLFxyXG4gICAgICAgIGRlZmVuY2VCYXNlOiAyLFxyXG4gICAgICAgIGhlYWx0aE1heEJhc2U6IDIwLFxyXG4gICAgICAgIGVuZXJneU1heEJhc2U6IDQwXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcdC8vaWQgMlxyXG4gICAgICAgIG5hbWU6IFwiRnJvbGlrXCIsXHJcbiAgICAgICAgc3ByaXRlOiA1LFxyXG4gICAgICAgIGFkbWluQWNjZXNzOiAwLFxyXG4gICAgICAgIG1hcDogMSxcclxuICAgICAgICB4OiA1LFxyXG4gICAgICAgIHk6IDUsXHJcbiAgICAgICAgZGFtYWdlQmFzZTogMTAsXHJcbiAgICAgICAgZGVmZW5jZUJhc2U6IDIsXHJcbiAgICAgICAgaGVhbHRoTWF4QmFzZTogMjAsXHJcbiAgICAgICAgZW5lcmd5TWF4QmFzZTogNDBcclxuICAgICAgfSxcclxuICAgIF07XHJcblxyXG4gICAgdGhpcy5ib3RzID0gW1xyXG4gICAgICB7XHQvL2lkIDBcclxuICAgICAgICBuYW1lOiBcIlJhdFwiLFxyXG4gICAgICAgIHNwcml0ZTogMCxcclxuICAgICAgICBkYW1hZ2U6IDEsXHJcbiAgICAgICAgaGVhbHRoTWF4OiAzLFxyXG4gICAgICB9LFxyXG4gICAgICB7XHQvL2lkIDFcclxuICAgICAgICBuYW1lOiBcIlNuYWtlXCIsXHJcbiAgICAgICAgc3ByaXRlOiAxLFxyXG4gICAgICAgIGRhbWFnZTogMixcclxuICAgICAgICBoZWFsdGhNYXg6IDUsXHJcbiAgICAgIH0sXHJcbiAgICBdO1xyXG5cclxuICB9XHJcblxyXG5cdGxvZyhtZXNzYWdlKSB7XHJcblx0XHRjb25zb2xlLmxvZyhtZXNzYWdlKTtcclxuXHR9XHJcblxyXG4gIGZpbmQodXNlcm5hbWUpIHtcclxuICAgIG1vbmdvLmFjY291bnRzLmZpbmRPbmUoe3VzZXJuYW1lOiB1c2VybmFtZX0sIChlcnIsIHJlcykgPT4ge1xyXG4gICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XHJcbiAgICAgIGlmIChyZXMpIHtcclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHRoaXMubG9nKGBQbGF5ZXIgbm90IGZvdW5kIHdpdGggdXNlcm5hbWU6ICR7dXNlcm5hbWV9YCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0UGxheWVyRGF0YShpZCkge1xyXG4gICAgbGV0IHBsYXllckRhdGEgPSB7fTtcclxuXHJcbiAgICBpZiAodGhpcy5wbGF5ZXJzW2lkXSkge1x0Ly8gRnJvbSBEYXRhYmFzZVxyXG4gICAgICBwbGF5ZXJEYXRhID0gdGhpcy5wbGF5ZXJzW2lkXTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1x0Ly8gRmlyc3QgTG9naW5cclxuICAgICAgcGxheWVyRGF0YS5uYW1lID0gY29uZmlnLlNUQVJUX05BTUU7XHJcbiAgICAgIHBsYXllckRhdGEuc3ByaXRlID0gY29uZmlnLlNUQVJUX1NQUklURTtcclxuICAgICAgcGxheWVyRGF0YS5hZG1pbkFjY2VzcyA9IDA7XHJcbiAgICAgIFxyXG4gICAgICBwbGF5ZXJEYXRhLm1hcCA9IGNvbmZpZy5TVEFSVF9NQVA7XHJcbiAgICAgIHBsYXllckRhdGEueCA9IGNvbmZpZy5TVEFSVF9YO1xyXG4gICAgICBwbGF5ZXJEYXRhLnkgPSBjb25maWcuU1RBUlRfWTtcclxuICAgICAgXHJcbiAgICAgIHBsYXllckRhdGEuZGFtYWdlQmFzZSA9IGNvbmZpZy5TVEFSVF9EQU1BR0U7XHJcbiAgICAgIHBsYXllckRhdGEuZGVmZW5jZUJhc2UgPSBjb25maWcuU1RBUlRfREVGRU5DRTtcclxuICAgICAgcGxheWVyRGF0YS5oZWFsdGhNYXhCYXNlID0gY29uZmlnLlNUQVJUX0hFQUxUSF9NQVg7XHJcbiAgICAgIHBsYXllckRhdGEuZW5lcmd5TWF4QmFzZSA9IGNvbmZpZy5TVEFSVF9FTkVSR1lfTUFYO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICByZXR1cm4gcGxheWVyRGF0YTtcclxuICB9XHJcblxyXG4gIHNhdmVQbGF5ZXJEYXRhKGRhdGEpIHtcclxuICAgIC8vbW9uZ28ucGxheWVycy5zYXZlKGRhdGEuaWQsIGRhdGEpO1xyXG4gIH1cclxuXHJcbiAgZ2V0TWFwRGF0YShpZCkge1xyXG4gICAgbGV0IG1hcERhdGEgPSB7fTtcclxuXHJcbiAgICBpZiAodGhpcy5tYXBzW2lkXSkge1xyXG4gICAgICBtYXBEYXRhID0gdGhpcy5tYXBzW2lkXTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBtYXBEYXRhLm5hbWUgPSBcIkJsYW5rIE1hcFwiO1xyXG4gICAgICBtYXBEYXRhLml0ZW1zID0gW107XHJcbiAgICAgIG1hcERhdGEuYm90cyA9IFtdO1xyXG4gICAgICBtYXBEYXRhLmVmZmVjdHMgPSBbXTtcclxuICAgICAgbWFwRGF0YS50ZXh0cyA9IFtdO1xyXG4gICAgICBtYXBEYXRhLmRyb3BDaGFuY2UgPSAxMDA7XHJcbiAgICAgIG1hcERhdGEuZHJvcEFtb3VudEVRID0gNTtcclxuICAgICAgbWFwRGF0YS50aWxlcyA9IHtcclxuICAgICAgICBsYXllcjogWyBcclxuICAgICAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcclxuICAgICAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcclxuICAgICAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcclxuICAgICAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcclxuICAgICAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcclxuICAgICAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcclxuICAgICAgICBdLFxyXG4gICAgICAgIHdhbGw6IFtmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlXSxcclxuICAgICAgICBjYW5BdHRhY2s6IFtmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlXSxcclxuICAgICAgICBkYW1hZ2U6IFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcclxuICAgICAgICBkZWZlbmNlOiBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXHJcbiAgICAgICAgaGVhbHRoTWF4OiBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXHJcbiAgICAgICAgd2FycE1hcDogWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxyXG4gICAgICAgIHdhcnBYOiBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXHJcbiAgICAgICAgd2FycFk6IFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXVxyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBtYXBEYXRhO1xyXG4gIH1cclxuICBcclxuICBzYXZlTWFwRGF0YShkYXRhKSB7XHJcbiAgICBtb25nby5tYXBzLnNhdmUoZGF0YS5pZCwgZGF0YSk7XHJcbiAgfVxyXG59XHJcblxyXG5jb25zdCBkYiA9IG5ldyBEYXRhYmFzZSgpO1xyXG5leHBvcnQgZGVmYXVsdCBkYjtcclxuIiwiaW1wb3J0IGZzIGZyb20gJ2ZzJztcclxuXHJcbmltcG9ydCBNYXAgZnJvbSAnLi9jbGFzc2VzL21hcC5qcyc7XHJcbmltcG9ydCBQbGF5ZXIgZnJvbSAnLi9jbGFzc2VzL3BsYXllci5qcyc7XHJcbmltcG9ydCBkYiBmcm9tICcuL2RiLmpzJztcclxuaW1wb3J0IGNvbmZpZyBmcm9tICcuL2NvbmZpZy5qcyc7XHJcblxyXG5jbGFzcyBHYW1lIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHRoaXMucGxheWVyTGlzdCA9IFtdO1xyXG5cdFx0dGhpcy5tYXBMaXN0ID0gW107XHJcblx0XHR0aGlzLm1lc3NhZ2VRdWV1ZSA9IFtdO1xyXG5cclxuXHRcdHRoaXMuY3JlYXRlTWFwcygpO1xyXG5cdH1cclxuXHJcblx0Y3JlYXRlTWFwcygpIHtcclxuXHRcdHRoaXMubWFwRGF0YSA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKCcuL3NlcnZlci9kYXRhL21hcC5qc29uJywgJ3V0ZjgnKSk7XHJcblx0XHRmb3IgKGxldCBpZCA9IDA7IGlkIDwgY29uZmlnLk1BWF9NQVBTOyBpZCsrKSB7XHJcblx0XHRcdHRoaXMubWFwTGlzdFtpZF0gPSBuZXcgTWFwKGlkLCB0aGlzLm1hcERhdGFbaWRdKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHVwZGF0ZShkZWx0YSkge1xyXG5cdFx0bGV0IHBhY2sgPSB7XHJcblx0XHRcdHBsYXllcnM6IFtdLFxyXG5cdFx0XHRtYXBzOiBbXVxyXG5cdFx0fTtcclxuXHRcdFxyXG5cdFx0dGhpcy5wbGF5ZXJMaXN0LmZvckVhY2goKHBsYXllcikgPT4ge1xyXG5cdFx0XHRwYWNrLnBsYXllcnNbcGxheWVyLmlkXSA9IHBsYXllci51cGRhdGUoZGVsdGEpO1xyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcdHRoaXMubWFwTGlzdC5mb3JFYWNoKChtYXApID0+IHtcclxuXHRcdFx0cGFjay5tYXBzW21hcC5pZF0gPSBtYXAudXBkYXRlKGRlbHRhKTtcclxuXHRcdH0pO1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gcGFjaztcclxuXHR9XHJcblxyXG5cdHBsYXllckxvZ2luKGlkKSB7XHJcblx0XHRsZXQgcGxheWVyID0gbmV3IFBsYXllcihpZCk7XHJcblx0XHR0aGlzLnBsYXllckxpc3RbaWRdID0gcGxheWVyO1xyXG5cdFx0dGhpcy5zZW5kU2VydmVyTWVzc2FnZShgJHtwbGF5ZXIubmFtZX0gaGFzIGxvZ2dlZCBpbi5gKTtcclxuXHRcdHJldHVybiBwbGF5ZXI7XHJcblx0fVxyXG5cdFxyXG5cdHBsYXllckxvZ291dChpZCkge1xyXG5cdFx0bGV0IHBsYXllciA9IHRoaXMucGxheWVyTGlzdFtpZF07XHJcblx0XHRpZiAocGxheWVyKSB7XHJcblx0XHRcdGRiLnNhdmVQbGF5ZXJEYXRhKHBsYXllci5nZXRQYWNrKTtcclxuXHRcdFx0dGhpcy5zZW5kU2VydmVyTWVzc2FnZShgJHtwbGF5ZXIubmFtZX0gaGFzIGxvZ2dlZCBvdXQuYCk7XHJcblx0XHRcdGRlbGV0ZSB0aGlzLnBsYXllckxpc3RbaWRdO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c2VuZFNlcnZlck1lc3NhZ2UobWVzc2FnZSkge1xyXG5cdFx0dGhpcy5tZXNzYWdlUXVldWUucHVzaCh7bWVzc2FnZX0pO1xyXG5cdH1cclxuXHJcblx0c2VuZE1hcE1lc3NhZ2UobWFwLCBtZXNzYWdlKSB7XHJcblx0XHR0aGlzLm1lc3NhZ2VRdWV1ZS5wdXNoKHttZXNzYWdlLCBtYXB9KTtcclxuXHR9XHJcblxyXG5cdHNlbmRQbGF5ZXJNZXNzYWdlKGlkLCBtZXNzYWdlKSB7XHJcblx0XHR0aGlzLm1lc3NhZ2VRdWV1ZS5wdXNoKHttZXNzYWdlLCBpZH0pO1xyXG5cdH1cclxuXHJcblx0Y2hlY2tWYWNhbnQobWFwSWQsIHgsIHkpIHtcclxuXHRcdC8vIENoZWNrIGZvciBNYXAgRWRnZXNcclxuXHRcdGlmICh4IDwgMCB8fCB4ID49IGNvbmZpZy5NQVBfQ09MVU1OUykgcmV0dXJuIGZhbHNlO1xyXG5cdFx0aWYgKHkgPCAwIHx8IHkgPj0gY29uZmlnLk1BUF9ST1dTKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcclxuXHRcdGxldCBtYXAgPSB0aGlzLm1hcExpc3RbbWFwSWRdO1xyXG5cdFx0XHJcblx0XHQvLyBDaGVjayBmb3IgV2FsbCBUaWxlc1xyXG5cdFx0aWYgKG1hcC50aWxlc1t5XVt4XS53YWxsID09PSB0cnVlKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcclxuXHRcdC8vIENoZWNrIGZvciBCb3RzXHJcblx0XHRsZXQgYm90cyA9IG1hcC5ib3RzLmZpbHRlcigoYm90KSA9PiB7XHJcblx0XHRcdGlmIChib3QueCA9PT0geCAmJiBib3QueSA9PT0geSkgcmV0dXJuIHRydWU7XHJcblx0XHR9KTtcclxuXHRcdGlmIChib3RzLmxlbmd0aCA+IDApIHJldHVybiBmYWxzZTtcclxuXHRcdFxyXG5cdFx0Ly8gQ2hlY2sgZm9yIFBsYXllcnNcclxuXHRcdGxldCBwbGF5ZXJzID0gdGhpcy5wbGF5ZXJMaXN0LmZpbHRlcigocGxheWVyKSA9PiB7XHJcblx0XHRcdGlmIChwbGF5ZXIubWFwID09PSBtYXAuaWQgJiYgcGxheWVyLnggPT09IHggJiYgcGxheWVyLnkgPT09IHkgJiYgIXBsYXllci5pc0RlYWQpIHJldHVybiB0cnVlO1xyXG5cdFx0fSk7XHJcblx0XHRpZiAocGxheWVycy5sZW5ndGggPiAwKSByZXR1cm4gZmFsc2U7XHJcblxyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG59XHJcblxyXG5jb25zdCBnYW1lID0gbmV3IEdhbWUoKTtcclxuZXhwb3J0IGRlZmF1bHQgZ2FtZTtcclxuIiwiLyoqKiBHYW1lIExvb3AgKioqL1xyXG4vKiBLZWVwcyB0cmFjayBvZiB0aW1lIGFuZCBjby1vcmRpbmF0ZXMgdGhlIGdhbWUgYW5kIHNlcnZlciAqL1xyXG5cclxuaW1wb3J0IE5vZGVHYW1lTG9vcCBmcm9tICdub2RlLWdhbWVsb29wJztcclxuXHJcbmltcG9ydCBkYiBmcm9tICcuL2RiLmpzJztcclxuaW1wb3J0IGdhbWUgZnJvbSAnLi9nYW1lLmpzJztcclxuaW1wb3J0IHNlcnZlciBmcm9tICcuL3NlcnZlci5qcyc7XHJcbmltcG9ydCBjb25maWcgZnJvbSAnLi9jb25maWcuanMnO1xyXG5cclxuY2xhc3MgR2FtZUxvb3Age1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5pZCA9IG51bGw7XHJcbiAgICB0aGlzLnRpbWVyID0ge1xyXG4gICAgICBiYWNrdXA6IDBcclxuICAgIH07XHJcbiAgICB0aGlzLnN0YXJ0KCk7XHJcbiAgfVxyXG4gIHN0YXJ0KCkge1xyXG4gICAgdGhpcy5pZCA9IE5vZGVHYW1lTG9vcC5zZXRHYW1lTG9vcCgoZGVsdGEpID0+IHtcclxuICAgICAgLy8gVXBkYXRlIHRoZSBnYW1lIHN0YXRlXHJcbiAgICAgIGxldCB1cGRhdGVQYWNrID0gZ2FtZS51cGRhdGUoZGVsdGEpO1xyXG4gICAgICBcclxuICAgICAgLy8gU2VuZCB1cGRhdGVkIHN0YXRlIHRvIGNsaWVudHNcclxuICAgICAgc2VydmVyLnNlbmRVcGRhdGVQYWNrKHVwZGF0ZVBhY2spO1xyXG4gICAgICBcclxuICAgICAgLy8gUGVyaW9kaWMgYmFja3VwIHRvIGRhdGFiYXNlXHJcbiAgICAgIHRoaXMudGltZXIuYmFja3VwICs9IGRlbHRhO1xyXG4gICAgICBpZiAodGhpcy50aW1lci5iYWNrdXAgPj0gY29uZmlnLkJBQ0tVUF9USU1FKSB7XHJcbiAgICAgICAgdGhpcy50aW1lci5iYWNrdXAgLT0gY29uZmlnLkJBQ0tVUF9USU1FO1xyXG4gICAgICAgIC8vIFNBVkUgU1RBVEVcclxuICAgICAgfVxyXG4gICAgfSwgY29uZmlnLkZSQU1FUkFURSk7XHJcbiAgfVxyXG59XHJcblxyXG5jb25zdCBnYW1lTG9vcCA9IG5ldyBHYW1lTG9vcCgpO1xyXG5leHBvcnQgZGVmYXVsdCBnYW1lTG9vcDsiLCJpbXBvcnQgZGIgZnJvbSAnLi9kYi5qcyc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4vZ2FtZS5qcyc7XHJcbmltcG9ydCBzZXJ2ZXIgZnJvbSAnLi9zZXJ2ZXIuanMnO1xyXG5pbXBvcnQgZ2FtZWxvb3AgZnJvbSAnLi9nYW1lbG9vcC5qcyc7XHJcbiIsImltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xyXG5pbXBvcnQgaHR0cCBmcm9tICdodHRwJztcclxuaW1wb3J0IHNvY2tldElPIGZyb20gJ3NvY2tldC5pbyc7XHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xyXG5cclxuaW1wb3J0IGRiIGZyb20gJy4vZGIuanMnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuL2dhbWUuanMnO1xyXG5pbXBvcnQgY29uZmlnIGZyb20gJy4vY29uZmlnLmpzJztcclxuaW1wb3J0IHV0aWwgZnJvbSAnLi91dGlsLmpzJztcclxuXHJcbmNsYXNzIFNlcnZlciB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHRjb25zdCBhcHAgPSBleHByZXNzKCk7XHJcblx0XHRjb25zdCBzZXJ2ZXIgPSBodHRwLlNlcnZlcihhcHApO1xyXG5cdFx0Y29uc3QgaW8gPSBzb2NrZXRJTyhzZXJ2ZXIpO1xyXG5cdFx0Y29uc3QgcG9ydCA9IHByb2Nlc3MuZW52LlBPUlQgfHwgY29uZmlnLlBPUlQ7XHJcblx0XHRjb25zdCBwdWJsaWNQYXRoID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uL2NsaWVudCcpO1xyXG5cdFx0XHJcblx0XHRhcHAuZ2V0KCcvJywgKHJlcSwgcmVzKSA9PiByZXMuc2VuZEZpbGUocHVibGljUGF0aCArICcvaW5kZXguaHRtbCcpKTtcclxuXHRcdGFwcC51c2UoJy9jbGllbnQnLCBleHByZXNzLnN0YXRpYyhwdWJsaWNQYXRoKSk7XHJcblx0XHRzZXJ2ZXIubGlzdGVuKHBvcnQsICgpID0+IGRiLmxvZyhgU2VydmVyIHN0YXJ0ZWQuIExpc3RlbmluZyBvbiAke3NlcnZlci5hZGRyZXNzKCkucG9ydH1gKSk7XHJcblxyXG5cdFx0dGhpcy5zb2NrZXRMaXN0ID0gW107XHJcblx0XHRpby5zb2NrZXRzLm9uKCdjb25uZWN0aW9uJywgKHNvY2tldCkgPT4gdGhpcy5vbkNvbm5lY3Qoc29ja2V0KSk7XHJcblx0fVxyXG5cclxuXHQvLyBSZWNlaXZlIGRhdGEgZnJvbSBjbGllbnRzXHJcblx0b25Db25uZWN0KHNvY2tldCkge1xyXG5cdFx0c29ja2V0LmlkID0gdXRpbC5maXJzdEVtcHR5SW5kZXgodGhpcy5zb2NrZXRMaXN0KTtcclxuXHRcdHRoaXMuc29ja2V0TGlzdFtzb2NrZXQuaWRdID0gc29ja2V0O1xyXG5cdFx0ZGIubG9nKGBOZXcgQ29ubmVjdGlvbjogSWQgJHtzb2NrZXQuaWR9YCk7XHJcblx0XHRcclxuXHRcdHNvY2tldC5vbignZGlzY29ubmVjdCcsICgpID0+IHRoaXMub25EaXNjb25uZWN0KHNvY2tldC5pZCkpO1xyXG5cdFx0c29ja2V0Lm9uKCdsb2dpbicsICgpID0+IHRoaXMub25Mb2dpbihzb2NrZXQuaWQpKTtcclxuXHRcdHNvY2tldC5vbignbG9nb3V0JywgKCkgPT4gdGhpcy5vbkxvZ291dChzb2NrZXQuaWQpKTtcclxuXHR9XHJcblxyXG5cdG9uRGlzY29ubmVjdChpZCkge1xyXG5cdFx0aWYgKGdhbWUucGxheWVyTGlzdFtpZF0pIHtcclxuXHRcdFx0Z2FtZS5wbGF5ZXJMb2dvdXQoaWQpO1xyXG5cdFx0fVxyXG5cdFx0ZGVsZXRlIHRoaXMuc29ja2V0TGlzdFtpZF07XHJcblx0XHRkYi5sb2coYERpc2Nvbm5lY3RlZDogSWQgJHtpZH1gKTtcclxuXHR9XHJcblxyXG5cdG9uTG9naW4oaWQpIHtcdFx0XHJcblx0XHQvLyBDcmVhdGUgUGxheWVyXHJcblx0XHRsZXQgcGxheWVyID0gZ2FtZS5wbGF5ZXJMb2dpbihpZCk7XHJcblx0XHRcclxuXHRcdC8vIFJlY2VpdmUgSW5wdXRzXHJcblx0XHRsZXQgc29ja2V0ID0gdGhpcy5zb2NrZXRMaXN0W2lkXTtcclxuXHRcdHNvY2tldC5vbignaW5wdXQnLCAoZGF0YSkgPT4gcGxheWVyLm9uSW5wdXQoZGF0YSkpO1xyXG5cdH1cclxuXHRcclxuXHRvbkxvZ291dChpZCkge1xyXG5cdFx0Z2FtZS5wbGF5ZXJMb2dvdXQoaWQpO1xyXG5cdH1cclxuXHRcclxuXHQvLyBTZW5kIGRhdGEgdG8gY2xpZW50c1xyXG5cdHNlbmRVcGRhdGVQYWNrKHVwZGF0ZVBhY2spIHtcclxuXHRcdGdhbWUucGxheWVyTGlzdC5mb3JFYWNoKChwbGF5ZXIpID0+IHtcclxuXHRcdFx0bGV0IHBhY2sgPSB7fTtcclxuXHRcdFx0cGFjay5wcml2YXRlID0gcGxheWVyLmdldFByaXZhdGVQYWNrKCk7XHJcblx0XHRcdHBhY2sucGxheWVycyA9IHVwZGF0ZVBhY2sucGxheWVycy5maWx0ZXIoKHBsYXllckRhdGEpID0+IHtcclxuXHRcdFx0XHRyZXR1cm4gKHBsYXllckRhdGEubWFwID09PSBwbGF5ZXIubWFwKTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdHBhY2subWFwID0gdXBkYXRlUGFjay5tYXBzW3BsYXllci5tYXBdO1xyXG5cdFx0XHRcclxuXHRcdFx0bGV0IHNvY2tldCA9IHRoaXMuc29ja2V0TGlzdFtwbGF5ZXIuaWRdO1xyXG5cdFx0XHRzb2NrZXQuZW1pdCgndXBkYXRlJywgcGFjayk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0XHJcblx0c2VuZE1hcERhdGEobWFwSWQpIHtcclxuXHRcdGdhbWUucGxheWVyTGlzdC5mb3JFYWNoKChwbGF5ZXIpID0+IHtcclxuXHRcdFx0aWYgKHBsYXllci5tYXAgPT09IG1hcElkKSB7XHJcblx0XHRcdFx0bGV0IHNvY2tldCA9IHRoaXMuc29ja2V0TGlzdFtwbGF5ZXIuaWRdO1xyXG5cdFx0XHRcdHNvY2tldC5lbWl0KCdsb2FkTWFwJywgZGIubWFwW21hcElkXSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcbn1cclxuXHJcbmNvbnN0IHNlcnZlciA9IG5ldyBTZXJ2ZXIoKTtcclxuZXhwb3J0IGRlZmF1bHQgc2VydmVyO1xyXG4iLCJmdW5jdGlvbiBzaHVmZmxlKGFycmF5KSB7XHJcbiAgbGV0IGN1cnJlbnRJbmRleCA9IGFycmF5Lmxlbmd0aDtcclxuICBsZXQgdGVtcDtcclxuICBsZXQgcmFuZG9tSW5kZXg7XHJcbiAgd2hpbGUgKGN1cnJlbnRJbmRleCAhPT0gMCkge1xyXG4gICAgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyZW50SW5kZXgpO1xyXG4gICAgY3VycmVudEluZGV4IC09IDE7XHJcbiAgICB0ZW1wID0gYXJyYXlbY3VycmVudEluZGV4XTtcclxuICAgIGFycmF5W2N1cnJlbnRJbmRleF0gPSBhcnJheVtyYW5kb21JbmRleF07XHJcbiAgICBhcnJheVtyYW5kb21JbmRleF0gPSB0ZW1wO1xyXG4gIH1cclxuICByZXR1cm4gYXJyYXk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN3YXAoYXJyYXksIGksIGopIHtcclxuICBsZXQgdGVtcCA9IGFycmF5W2ldO1xyXG4gIGFycmF5W2ldID0gYXJyYXlbal07XHJcbiAgYXJyYXlbal0gPSB0ZW1wO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmaXJzdEVtcHR5SW5kZXgoYXJyYXkpIHtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8PSBhcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgaWYgKCFhcnJheVtpXSkge1xyXG4gICAgICByZXR1cm4gaTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxlcnAoc3RhcnQsIGVuZCwgdGltZSkge1xyXG4gIC8vcmV0dXJuIHN0YXJ0ICsgKHRpbWUgKiAoZW5kIC0gc3RhcnQpKTtcclxuICByZXR1cm4gKCgxIC0gdGltZSkgKiBzdGFydCkgKyAodGltZSAqIGVuZCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNsYW1wKHZhbHVlLCBtaW5pbXVtLCBtYXhpbXVtKSB7XHJcbiAgaWYgKHZhbHVlIDwgbWluaW11bSkge1xyXG4gICAgcmV0dXJuIG1pbmltdW07XHJcbiAgfVxyXG4gIGVsc2UgaWYgKHZhbHVlID4gbWF4aW11bSkge1xyXG4gICAgcmV0dXJuIG1heGltdW07XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHNodWZmbGUsXHJcbiAgc3dhcCxcclxuICBmaXJzdEVtcHR5SW5kZXgsXHJcbiAgbGVycCxcclxuICBjbGFtcFxyXG59OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV4cHJlc3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZnNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaHR0cFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJtb25nb2pzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm5vZGUtZ2FtZWxvb3BcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJzb2NrZXQuaW9cIik7Il0sInNvdXJjZVJvb3QiOiIifQ==
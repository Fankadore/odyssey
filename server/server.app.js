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
		// this.damageBase = playerClass.damageBase + (playerClass.increasePerLevel.damage * this.level);
		this.damageBase = 5;
		this.defenceBase = 0;
		this.healthMaxBase = 10;
		this.energyMaxBase = 40;
		this.rangeBase = 1;
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
			if (!_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].isVacant(this.map, this.x - 1, this.y)) return;
			this.destinationX--;
		}
		else if (direction === 'right') {
			if (!_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].isVacant(this.map, this.x + 1, this.y)) return;
			this.destinationX++;
		}
		else if (direction === 'up') {
			if (!_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].isVacant(this.map, this.x, this.y - 1)) return;
			this.destinationY--;
		}
		else if (direction === 'down') {
			if (!_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].isVacant(this.map, this.x, this.y + 1)) return;
			this.destinationY++;
		}
		else {
			switch (_util_js__WEBPACK_IMPORTED_MODULE_3__["default"].randomInt(0, 3 + this.laziness)) {
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
		else if (_util_js__WEBPACK_IMPORTED_MODULE_3__["default"].randomInt(0, 1) === 0) {
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
		_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].spawnMapItem(this.map, this.x, this.y, 1);
		
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
		_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].spawnDamageText(this.map, this.x, this.y, damage);
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
		for (let item of _game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[this.map].items) {
			if (item && item.x === this.x && item.y === this.y) {
				let slot = this.getMapItem(item.map, item.id);
				if (slot != null) {
					item.moveToPlayer(this.id, slot);
				}
				else {
					// Inventory full
					break;
				}
			}
		}
	}
	
	getMapItem(mapId, id) {
		let item = _game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[mapId].items[id];
		if (!item) return null;

		if (item.stack > 0) {
			let slot = this.findItemSlot(item.itemClass);
			if (slot >= 0) {
				this.inventory[slot].stack += item.stack;
				item.remove();
				return null;
			}
		}

		let slot = this.findFirstEmptySlot();
		return slot;
	}

	getItem(data) {
		if (!data || data.itemClass == null) return null;

		if (data.stack) {
			slot = this.findItemSlot(data.itemClass);
			if (slot >= 0) {
				this.inventory[slot].stack += data.stack;
				return null;
			}
		}

		return this.findFirstEmptySlot();
	}
	
	dropItem(slot) {
		let item = this.inventory[slot];
		if (!item) return;
		
		if (slot >= _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE) {
			this.unequipItem(slot);
			return;
		}

		item.moveToMap(this.map, this.x, this.y);
	}
	
	useItem(slot) {
		let item = this.inventory[slot];
		if (!item) return;

		// if (!db.items[item.id].use.call(this, slot)) return;	// Run 'use' script
		
		if (item.isEquipment()) {	// Equipment Items
			if (slot < _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE) {	// Check if item is equipped
				this.equipItem(slot);
			}
			else {
				this.unequipItem(slot);
			}
			return;
		}

		if (item.reusable) return;
		
		if (item.stack > 1) {
			item.stack--;
			return;
		}

		item.remove();
	}
	
	hasItem(itemClass) {
		let count = 0;
		for (let slot = 0; slot < _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE + _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].EQUIPMENT_SIZE; slot++) {
			if (this.inventory[slot]) {
				if (this.inventory[slot].itemClass === itemClass) {
					count++;
				}
			}
		}
		return count;
	}

	findItemSlot(itemClass) {
		let slot = null;
		for (let checkSlot = 0; checkSlot < _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE + _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].EQUIPMENT_SIZE; checkSlot++) {
			if (this.inventory[checkSlot]) {
				if (this.inventory[checkSlot].itemClass === itemClass) {
					slot = checkSlot;
					break;
				}
			}
		}
		return slot;
	}
	
	moveItemToSlot(slot, newSlot) {
		if (slot == null || newSlot == null || slot === newSlot) return;	// null == undefined, null != 0
		if (slot >= _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE + _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].EQUIPMENT_SIZE) return;
		if (newSlot >= _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE + _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].EQUIPMENT_SIZE) return;

		let item = this.inventory[slot];
		let newItem = this.inventory[newSlot];
		if (!item) return;

		function swapSlots() {
			item.slot = newSlot;
			if (newItem) newItem.slot = slot;
			_util_js__WEBPACK_IMPORTED_MODULE_3__["default"].swap(this.inventory, slot, newSlot);
			this.calcBonusStats();
		}
		
		if (newSlot >= _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE) {	// Target slot is for equipment
			if (!item.canEquip(newSlot)) {
				_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendPlayerMessage(this.id, "That cannot be equipped there.");
				return;
			}
		}

		// No new item in new slot
		if (!newItem) {
			swapSlots();
			return;
		}

		// New item in new slot, old item in inventory
		if (slot < _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE) {
			swapSlots();
			return;
		}

		// Old item is equipped, new item is equipped
		if (newSlot >= _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE) {
			swapSlots();
			return
		}

		// Old item is equipped, new item in inventory, same item type
		if (newItem.type === item.type) {
			swapSlots();
			return;
		}

		// Old item is equipped, new item in inventory, different types
		newSlot = this.findFirstEmptySlot();
		if (newSlot == null) {
			_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendPlayerMessage(this.id, "Your inventory is full.");
			return;
		}

		swapSlots();
	}

	equipItem(slot) {
		let newSlot = null;
		for (let i = _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE; i < _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].EQUIPMENT_SIZE; i++) {
			if (item.canEquip(i)) {
				newSlot = i;
				if (!this.inventory[i]) break;
			}
		}
		if (newSlot === null) return;

		this.moveItemToSlot(slot, newSlot);
	}

	unequipItem(slot) {
		if (slot < _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE) return;
		if (!this.inventory[slot]) return;
		
		let newSlot = this.findFirstEmptySlot();
		if (newSlot == null) {
			_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendPlayerMessage(this.id, "Your inventory is full.");
			return;
		}

		this.moveItemToSlot(slot, newSlot);
	}
	
	findFirstEmptySlot() {
		for (let slot = 0; slot < _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE; slot++) {
			if (this.inventory[slot] == null) return slot;
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
			if (this.respawnTimer >= this.respawnSpeed) this.respawn();
			return;
		}
		
		// Attacking
		if (this.isAttacking || this.attackTimer > 0) {
			this.attackTimer += delta;
			if (this.attackTimer >= 0.3) this.isAttacking = false;
			if (this.attackTimer >= this.attackSpeed) this.attackTimer = 0;
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

	getInventoryPack() {
		let inventoryPack = [];
		
		this.inventory.forEach((item) => {
			inventoryPack[item.slot] = item.getPack();
		});
		
		return inventoryPack;
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
/* harmony import */ var _actor_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./actor.js */ "./server/src/classes/actor.js");






// A Bot is an Actor with conditional inputs

class Bot extends _actor_js__WEBPACK_IMPORTED_MODULE_4__["default"] {
	constructor(data) {
		if (data.botClass == null || data.map == null || data.x == null || data.y == null) return;

		if (data.id == null) data.id = _util_js__WEBPACK_IMPORTED_MODULE_3__["default"].firstEmptyIndex(_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[this.map].bots);
		
		let classData = _db_js__WEBPACK_IMPORTED_MODULE_0__["default"].getBotData(data.botClass);
		if (!data.name) data.name = classData.name;
		if (data.sprite == null) data.sprite = classData.sprite;
		if (data.hostile == null) data.hostile = classData.hostile;
		if (data.damageBase == null) data.damageBase = classData.damageBase;
		if (data.defenceBase == null) data.defenceBase = classData.defenceBase;
		if (data.healthMaxBase == null) data.healthMaxBase = classData.healthMaxBase;
		if (data.energyMaxBase == null) data.energyMaxBase = classData.energyMaxBase;
		if (data.rangeBase == null) data.rangeBase = classData.rangeBase;

		super(data.map, data.x, data.y, data.name, data.sprite);
		this.id = data.id;
		this.botClass = data.botClass;
		this.hostile = data.hostile;
		this.damageBase = data.damageBase;
		this.defenceBase = data.defenceBase;
		this.healthMaxBase = data.healthMaxBase;
		this.energyMaxBase = data.energyMaxBase;
		this.rangeBase = data.rangeBase;
		
		this.target = null;
		this.setTask('wandering');
		this.moveTimer = 0;

		_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[this.map].bots[this.id] = this;
	}
	
	getMapItem(mapId, id) {
		let slot = super.getMapItem(mapId, id);
		if (slot == null) return;
		
		let item = _game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[mapId].items[id];
		item.moveToBot(this.map, this.id, slot);
	}

	getItem(data) {
		let slot = super.getItem(data);
		if (slot == null) return;

		data.owner = 'bot';
		data.mapId = this.map;
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
			map: this.map,
			x: this.startX,
			y: this.startY,
			z: this.z,
			destinationX: this.destinationX,
			destinationY: this.destinationY,
			lerp: this.lerp,
			isRunning: this.isRunning,
			isAttacking: this.isAttacking,
			isDead: this.isDead,
			isVisible: this.isVisible
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
		if (source instanceof _actor_js__WEBPACK_IMPORTED_MODULE_4__["default"]) {
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


// An Entity is any object which can appear on the map

class Entity {
	constructor(map, x, y, sprite = 0) {
		this.map = map;
		this.x = x;
		this.y = y;
		if (sprite < 0) sprite = 0;
		this.sprite = sprite;
		this.isVisible = true;
	}
}

/***/ }),

/***/ "./server/src/classes/item.js":
/*!************************************!*\
  !*** ./server/src/classes/item.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Item; });
/* harmony import */ var _db_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../db.js */ "./server/src/db.js");
/* harmony import */ var _game_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../game.js */ "./server/src/game.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util.js */ "./server/src/util.js");
/* harmony import */ var _entity_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./entity.js */ "./server/src/classes/entity.js");





class Item extends _entity_js__WEBPACK_IMPORTED_MODULE_3__["default"] {
	constructor(data) {
		if (!data.owner || data.itemClass == null || data.id == null) return;
		
		if (data.owner === 'player') {
			if (data.slot == null) return;
		}
		else if (data.owner === 'bot') {
			if (data.mapId == null || data.slot == null) return;
		}
		else if (data.owner === 'map') {
			if (data.mapId == null || data.x == null || data.y == null) return;
		}

		if (data.mapId === undefined) data.mapId = null;
		if (data.x === undefined) data.x = null;
		if (data.y === undefined) data.y = null;
		if (data.slot === undefined) data.slot = null;

		let classData = _db_js__WEBPACK_IMPORTED_MODULE_0__["default"].getItemData(data.itemClass);
		if (data.name == null) data.name = classData.name;
		if (data.type == null) data.type = classData.type;
		if (data.sprite == null) data.sprite = classData.sprite;
		if (data.reusable == null) data.reusable = classData.reusable;
		if (data.damageBonus == null) data.damageBonus = classData.damageBonus;
		if (data.defenceBonus == null) data.defenceBonus = classData.defenceBonus;
		if (data.healthMaxBonus == null) data.healthMaxBonus = classData.healthMaxBonus;
		if (data.energyMaxBonus == null) data.energyMaxBonus = classData.energyMaxBonus;
		if (data.rangeBonus == null) data.rangeBonus = classData.rangeBonus;
		if (data.stack == null) data.stack = classData.stack;

		super(data.mapId, data.x, data.y, data.sprite);
		this.owner = data.owner;
		this.id = data.id;
		this.itemClass = data.itemClass;
		this.stack = data.stack;
		this.slot = data.slot;
		
		this.name = data.name;
		this.type = data.type;
		this.reusable = data.reusable;
		this.damageBonus = data.damageBonus;
		this.defenceBonus = data.defenceBonus;
		this.healthMaxBonus = data.healthMaxBonus;
		this.energyMaxBonus = data.energyMaxBonus;
		this.rangeBonus = data.rangeBonus;
		
		this.clicked = false;
		this.clickTime = 0;

		if (data.owner === 'map') {
			_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[this.map].items[this.id] = this;
		}
		else if (data.owner === 'player') {
			_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].playerList[this.id].inventory[this.slot] = this;
		}
		else if (data.owner === 'bot') {
			_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[this.map].bots[this.id].inventory[this.slot] = this;
		}
	}
	
	update(delta) {
		return this.getPack();
	}

	getPack() {
		return {
			id: this.id,
			map: this.map,
			x: this.x,
			y: this.y,
			slot: this.slot,
			itemClass: this.itemClass,
			stack: this.stack,
			name: this.name,
			sprite: this.sprite,
			type: this.type,
			reusable: this.reusable,
			damageBonus: this.damageBonus,
			defenceBonus: this.defenceBonus,
			healthMaxBonus: this.healthMaxBonus,
			energyMaxBonus: this.energyMaxBonus,
			rangeBonus: this.rangeBonus,
			isVisible: this.isVisible
		};
	}
	
	remove() {
		if (this.owner === 'player') {
			delete _game_js__WEBPACK_IMPORTED_MODULE_1__["default"].playerList[this.id].inventory[this.slot];
		}
		else if (this.owner === 'map') {
			delete _game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[this.map].items[this.id];
		}
		else if (this.owner === 'bot') {
			delete _game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[this.map].bots[this.id].inventory[this.slot];
		}
	}
	
	isEquipment() {
		if (this.type === 'weapon' || this.type === 'shield' || this.type === 'armour' || this.type === 'helmet' || this.type === 'ring') {
			return true;
		}
		else {
			return false;
		}
	}

	canEquip(slot) {
		if (slot === config.INVENTORY_SIZE) {
			if (this.type === 'weapon') return true;
		}
		else if (slot === config.INVENTORY_SIZE + 1) {
			if (this.type === 'shield') return true;
		}
		else if (slot === config.INVENTORY_SIZE + 2) {
			if (this.type === 'armour') return true;
		}
		else if (slot === config.INVENTORY_SIZE + 3) {
			if (this.type === 'helmet') return true;
		}
		else if (slot === config.INVENTORY_SIZE + 4) {
			if (this.type === 'ring') return true;
		}

		return false;
	}

	moveToPlayer(id, slot) {
		if (id == null || slot == null) return;

		this.remove();
		this.owner = 'player';
		this.id = id;
		this.slot = slot;
		_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].playerList[id].inventory[slot] = this;
	}

	moveToMap(mapId, x, y) {
		if (mapId == null || x == null || y == null) return;

		this.remove();
		this.owner = 'map';
		this.map = mapId;
		this.id = _util_js__WEBPACK_IMPORTED_MODULE_2__["default"].firstEmptyIndex(_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[mapId].items);
		this.x = x;
		this.y = y;
		_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[mapId].items[id] = this;
	}

	moveToBot(mapId, id, slot) {
		if (mapId == null || id == null || slot == null) return;

		this.remove();
		this.owner = 'bot';
		this.map = mapId;
		this.id = id;
		this.slot = slot;
		_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[mapId].bots[id].inventory[slot] = this;
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
			isDead: this.isDead,
			isVisible: this.isVisible
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
					_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].spawnMapItem(data.mapId, data.x, data.y, data.type, data.stack);
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
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config.js */ "./server/src/config.js");



const mongo = mongojs__WEBPACK_IMPORTED_MODULE_0___default()('localhost:27017/odyssey', ['accounts', 'players', 'maps', 'items', 'bots']);

class Database {
  constructor() {
    // These should be held in the database
    this.items = [
      {	// type 0
        name: "Blank Item",
        sprite: 68,
        type: 'none',
        stack: 0,
        reusable: false,
        damageBonus: 0,
        defenceBonus: 0,
        healthMaxBonus: 0,
        energyMaxBonus: 0,
        rangeBonus: 0
      },
      {	// type 1
        name: "Health Potion",
        sprite: 1,
        type: 'potion',
        stack: 1,
        reusable: false,
        damageBonus: 0,
        defenceBonus: 0,
        healthMaxBonus: 0,
        energyMaxBonus: 0,
        rangeBonus: 0
      }, 
      {	// type 2
        name: "Energy Potion",
        sprite: 2,
        type: 'potion',
        stack: 1,
        reusable: false,
        damageBonus: 0,
        defenceBonus: 0,
        healthMaxBonus: 0,
        energyMaxBonus: 0,
        rangeBonus: 0
      }, 
      {	// type 3
        name: "Incognito",
        sprite: 12,
        type: 'special',
        stack: 0,
        reusable: true,
        damageBonus: 0,
        defenceBonus: 0,
        healthMaxBonus: 0,
        energyMaxBonus: 0,
        rangeBonus: 0
      },
      {	// type 4
        name: "Sword",
        sprite: 10,
        type: 'weapon',
        stack: 0,
        reusable: true,
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
        stack: 0,
        reusable: true,
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
        energyMaxBase: 40,
        rangeBase: 1
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
        energyMaxBase: 40,
        rangeBase: 1
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
        energyMaxBase: 40,
        rangeBase: 1
      },
    ];

    this.bots = [
      {	//id 0
        name: "Rat",
        sprite: 0,
        hostile: false,
        damageBase: 1,
        defenceBase: 0,
        healthMaxBase: 5,
        energyMaxBase: 10,
        rangeBase: 1
      },
      {	//id 1
        name: "Snake",
        sprite: 1,
        hostile: true,
        damageBase: 2,
        defenceBase: 0,
        healthMaxBase: 5,
        energyMaxBase: 5,
        rangeBase: 1
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
      playerData.name = _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].START_NAME;
      playerData.sprite = _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].START_SPRITE;
      playerData.adminAccess = 0;
      
      playerData.map = _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].START_MAP;
      playerData.x = _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].START_X;
      playerData.y = _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].START_Y;
      
      playerData.damageBase = _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].START_DAMAGE;
      playerData.defenceBase = _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].START_DEFENCE;
      playerData.healthMaxBase = _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].START_HEALTH_MAX;
      playerData.energyMaxBase = _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].START_ENERGY_MAX;
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

  getBotData(botClass) {
    return this.bots[botClass];
  }

  saveBotData(mapId, id) {

  }

  getItemData(itemClass) {
    return this.items[itemClass];
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
/* harmony import */ var _db_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./db.js */ "./server/src/db.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./config.js */ "./server/src/config.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util.js */ "./server/src/util.js");
/* harmony import */ var _classes_map_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./classes/map.js */ "./server/src/classes/map.js");
/* harmony import */ var _classes_player_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./classes/player.js */ "./server/src/classes/player.js");
/* harmony import */ var _classes_bot_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./classes/bot.js */ "./server/src/classes/bot.js");
/* harmony import */ var _classes_item_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./classes/item.js */ "./server/src/classes/item.js");










class Game {
	constructor() {
		this.playerList = [];
		this.mapList = [];
		this.messageQueue = [];

		// Create Maps
		this.mapData = JSON.parse(fs__WEBPACK_IMPORTED_MODULE_0___default.a.readFileSync('./server/data/map.json', 'utf8'));
		for (let id = 0; id < _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].MAX_MAPS; id++) {
			this.mapList[id] = new _classes_map_js__WEBPACK_IMPORTED_MODULE_4__["default"](id, this.mapData[id]);
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

	// Players
	playerLogin(id) {
		let player = new _classes_player_js__WEBPACK_IMPORTED_MODULE_5__["default"](id);
		this.playerList[id] = player;
		this.sendServerMessage(`${player.name} has logged in.`);
		return player;
	}
	
	playerLogout(id) {
		let player = this.playerList[id];
		if (player) {
			_db_js__WEBPACK_IMPORTED_MODULE_1__["default"].savePlayerData(player.getPack);
			this.sendServerMessage(`${player.name} has logged out.`);
			delete this.playerList[id];
		}
	}

	// Messages
	sendServerMessage(message) {
		this.messageQueue.push({message});
	}

	sendMapMessage(mapId, message) {
		this.messageQueue.push({message, mapId});
	}

	sendPlayerMessage(id, message) {
		this.messageQueue.push({message, id});
	}

	// Map
	isVacant(mapId, x, y) {
		// Check for Map Edges
		if (x < 0 || x >= _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].MAP_COLUMNS) return false;
		if (y < 0 || y >= _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].MAP_ROWS) return false;
		
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

	spawnBot(mapId, x, y, botClass) {
		new _classes_bot_js__WEBPACK_IMPORTED_MODULE_6__["default"](mapId, x, y, botClass);
	}
	
	spawnMapItem(mapId, x, y, itemClass, stack = 0) {
		new _classes_item_js__WEBPACK_IMPORTED_MODULE_7__["default"]({
			owner: 'map',
			mapId,
			id: _util_js__WEBPACK_IMPORTED_MODULE_3__["default"].firstEmptyIndex(this.mapList[mapId].items),
			x,
			y,
			itemClass,
			stack
		});
	}

	spawnDamageText(mapId, x, y, damage) {
		new Text(mapId, x, y, damage, '#FF0000', 0, -1);
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
  if (array.length < 1) return 0;
  
  for (let i = 0; i <= array.length; i++) {
    if (array[i] == null) return i;
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

function randomInt(minimum, maximum) {
  maximum++;
  return Math.floor((Math.random() * maximum) + minimum);
}

/* harmony default export */ __webpack_exports__["default"] = ({
  shuffle,
  swap,
  firstEmptyIndex,
  lerp,
  clamp,
  randomInt
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL2FjdG9yLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy9ib3QuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL2VudGl0eS5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2NsYXNzZXMvaXRlbS5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2NsYXNzZXMvbWFwLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL3RpbGUuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jb25maWcuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9kYi5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2dhbWUuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9nYW1lbG9vcC5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9zZXJ2ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy91dGlsLmpzIiwid2VicGFjazovLy9leHRlcm5hbCBcImV4cHJlc3NcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJmc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImh0dHBcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJtb25nb2pzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibm9kZS1nYW1lbG9vcFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInBhdGhcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJzb2NrZXQuaW9cIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLDZJQUFxRDtBQUN0RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxtQkFBbUI7QUFDbkI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsK0RBQStEOztBQUUvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0Esc0JBQXNCO0FBQ3RCLEdBQUc7O0FBRUg7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixZQUFZLFFBQVEsVUFBVSxPQUFPLE9BQU87QUFDOUQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJOztBQUVKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7O0FBRUo7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLHlEQUF5RDs7QUFFekQsMkJBQTJCO0FBQzNCLGtGQUFzQztBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQkFBb0IsOElBQXNEO0FBQzFFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHlCQUF5QixtSkFBMkQ7QUFDcEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0VBQWtFO0FBQ2xFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxxRkFBeUM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpRkFBcUMsdUVBQTJCO0FBQ2hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxvQkFBb0IsMEVBQThCO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN4dUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esc0JBQXNCO0FBQ3RCOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQiwwRUFBOEI7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDM1BBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2JBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcktBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQixvRUFBd0I7QUFDekM7QUFDQSxrQkFBa0IsaUVBQXFCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixpRUFBcUI7QUFDdEMsa0JBQWtCLG9FQUF3QjtBQUMxQyxtQkFBbUIsbUVBQXVCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsaUJBQWlCLGlFQUFxQjtBQUN0QztBQUNBLGtCQUFrQixvRUFBd0I7QUFDMUM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlCQUFpQixtRUFBdUI7QUFDeEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsSUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxvQ0FBb0M7QUFDcEMsc0NBQXNDO0FBQ3RDLDBDQUEwQztBQUMxQywwQ0FBMEM7QUFDMUM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0Esc0JBQXNCOztBQUV0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0RkFBZ0QsVUFBVSxXQUFXLGFBQWE7QUFDbEY7QUFDQSxnR0FBb0QsVUFBVSxVQUFVLGFBQWE7QUFDckY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzRkFBMEMsVUFBVSxjQUFjLGFBQWE7QUFDL0UsbUdBQXVELFlBQVksS0FBSyxhQUFhO0FBQ3JGO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDOzs7Ozs7Ozs7Ozs7OztBQ3ZMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ3hDQTtBQUFBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsT0FBTztBQUNQLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBLGVBQWU7QUFDZixPQUFPO0FBQ1AsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBLGVBQWU7QUFDZixPQUFPO0FBQ1AsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBLGVBQWU7QUFDZixPQUFPO0FBQ1AsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBLGVBQWU7QUFDZixPQUFPO0FBQ1AsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBLGVBQWU7QUFDZixPQUFPO0FBQ1AsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBLGVBQWU7QUFDZixPQUFPO0FBQ1AsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBLGVBQWU7QUFDZixPQUFPO0FBQ1AsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBLGVBQWU7QUFDZixPQUFPO0FBQ1AsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBLGVBQWU7QUFDZixPQUFPO0FBQ1AsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBLGVBQWU7QUFDZixPQUFPO0FBQ1A7O0FBRUE7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDRCQUE0QixtQkFBbUI7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9EQUFvRCxTQUFTO0FBQzdEO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7O0FBRUEsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzVXQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxrQkFBa0Isa0VBQXNCO0FBQ3hDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsWUFBWTtBQUN4QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLFlBQVk7QUFDekM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwwQkFBMEIsUUFBUTtBQUNsQzs7QUFFQTtBQUNBLDBCQUEwQixlQUFlO0FBQ3pDOztBQUVBO0FBQ0EsMEJBQTBCLFlBQVk7QUFDdEM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0SEE7QUFBQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0EseUU7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDckNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwrR0FBbUUsc0JBQXNCOztBQUV6RjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyRUFBK0IsVUFBVTs7QUFFekM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlFQUE2QixHQUFHO0FBQ2hDOztBQUVBLGM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDckZBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGlCQUFpQixtQkFBbUI7QUFDcEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHOzs7Ozs7Ozs7OztBQ3pEQSxvQzs7Ozs7Ozs7Ozs7QUNBQSwrQjs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSxvQzs7Ozs7Ozs7Ozs7QUNBQSwwQzs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSxzQyIsImZpbGUiOiJzZXJ2ZXIuYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zZXJ2ZXIvc3JjL21haW4uanNcIik7XG4iLCJpbXBvcnQgZGIgZnJvbSAnLi4vZGIuanMnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuLi9nYW1lLmpzJztcclxuaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9jb25maWcuanMnO1xyXG5pbXBvcnQgdXRpbCBmcm9tICcuLi91dGlsLmpzJztcclxuaW1wb3J0IEVudGl0eSBmcm9tICcuL2VudGl0eS5qcyc7XHJcblxyXG4vLyBBbiBBY3RvciBpcyBhbiBFbnRpdHkgd2hpY2ggY2FuIG1vdmUsIGF0dGFjayBhbmQgaW50ZXJhY3Qgd2l0aCBpdGVtc1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWN0b3IgZXh0ZW5kcyBFbnRpdHkge1xyXG5cdGNvbnN0cnVjdG9yKG1hcCwgeCwgeSwgbmFtZSwgc3ByaXRlKSB7XHJcblx0XHRzcHJpdGUgPSB1dGlsLmNsYW1wKHNwcml0ZSwgMSwgY29uZmlnLk1BWF9TUFJJVEVTKTtcclxuXHJcblx0XHRzdXBlcihtYXAsIHgsIHksIHNwcml0ZSk7XHJcblx0XHR0aGlzLmNvbnRyb2xsZXIgPSAnYm90JztcclxuXHRcdHRoaXMubmFtZSA9IG5hbWU7XHJcblxyXG5cdFx0dGhpcy5pbnZlbnRvcnkgPSBbXTtcclxuXHJcblx0XHR0aGlzLmNhbGNTdGF0cygpO1xyXG5cdFx0dGhpcy5yZXN0b3JlKCk7XHJcblxyXG5cdFx0dGhpcy5kaXJlY3Rpb24gPSAnZG93bic7XHJcblx0XHR0aGlzLnN0YXJ0WCA9IHRoaXMueDtcclxuXHRcdHRoaXMuc3RhcnRZID0gdGhpcy55O1xyXG5cdFx0dGhpcy5kZXN0aW5hdGlvblggPSB0aGlzLng7XHJcblx0XHR0aGlzLmRlc3RpbmF0aW9uWSA9IHRoaXMueTtcclxuXHRcdHRoaXMubGVycCA9IDA7XHJcblxyXG5cdFx0dGhpcy5pc01vdmluZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy5pc1J1bm5pbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMubW92ZVNwZWVkID0gMi41O1xyXG5cdFx0dGhpcy5tb3ZlbWVudFRpbWVyID0gMDtcclxuXHRcdHRoaXMubGF6aW5lc3MgPSAwO1xyXG5cclxuXHRcdHRoaXMuaXNBdHRhY2tpbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMuYXR0YWNrU3BlZWQgPSAxO1xyXG5cdFx0dGhpcy5hdHRhY2tUaW1lciA9IDA7XHRcclxuXHRcdHRoaXMudGFyZ2V0ID0gbnVsbDtcclxuXHRcdHRoaXMua2lsbHMgPSAwO1xyXG5cdFx0dGhpcy5kZWF0aHMgPSAwO1xyXG5cclxuXHRcdHRoaXMuaXNEZWFkID0gZmFsc2U7XHJcblx0XHR0aGlzLnJlc3Bhd25UaW1lciA9IDA7XHJcblx0XHR0aGlzLnJlc3Bhd25TcGVlZCA9IDEwO1xyXG5cdFx0dGhpcy5yZXNwYXduTWFwID0gbWFwO1xyXG5cdFx0dGhpcy5yZXNwYXduWCA9IHg7XHJcblx0XHR0aGlzLnJlc3Bhd25ZID0geTtcclxuXHR9XHJcblx0XHJcblx0Ly8gQ2hhcmFjdGVyIFN0YXRzXHJcblx0Z2V0IGRhbWFnZSgpIHtcclxuXHRcdGlmICh0aGlzLmRhbWFnZUJhc2UgKyB0aGlzLmRhbWFnZUJvbnVzIDwgMCkge1xyXG5cdFx0XHRyZXR1cm4gMDtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5kYW1hZ2VCYXNlICsgdGhpcy5kYW1hZ2VCb251cztcclxuXHRcdH1cclxuXHR9XHJcblx0Z2V0IGRlZmVuY2UoKSB7XHJcblx0XHRpZiAodGhpcy5kZWZlbmNlQmFzZSArIHRoaXMuZGVmZW5jZUJvbnVzIDwgMCkge1xyXG5cdFx0XHRyZXR1cm4gMDtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5kZWZlbmNlQmFzZSArIHRoaXMuZGVmZW5jZUJvbnVzO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRnZXQgaGVhbHRoTWF4KCkge1xyXG5cdFx0aWYgKHRoaXMuaGVhbHRoTWF4QmFzZSArIHRoaXMuaGVhbHRoTWF4Qm9udXMgPCAxKSB7XHJcblx0XHRcdHJldHVybiAxO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmhlYWx0aE1heEJhc2UgKyB0aGlzLmhlYWx0aE1heEJvbnVzO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRnZXQgZW5lcmd5TWF4KCkge1xyXG5cdFx0aWYgKHRoaXMuZW5lcmd5TWF4QmFzZSArIHRoaXMuZW5lcmd5TWF4Qm9udXMgPCAwKSB7XHJcblx0XHRcdHJldHVybiAwO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmVuZXJneU1heEJhc2UgKyB0aGlzLmVuZXJneU1heEJvbnVzO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRnZXQgcmFuZ2UoKSB7XHJcblx0XHRpZiAodGhpcy5yYW5nZUJhc2UgKyB0aGlzLnJhbmdlQm9udXMgPCAxKSB7XHJcblx0XHRcdHJldHVybiAxO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHJldHVybiB0aGlzLnJhbmdlQmFzZSArIHRoaXMucmFuZ2VCb251cztcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGNhbGNCYXNlU3RhdHMoKSB7XHQvLyBDbGFzcyBhbmQgTGV2ZWxcclxuXHRcdC8vVE9ETzogY2hlY2sgZGIgZm9yIGNsYXNzIHN0YXRzOiBiYXNlIGFuZCBpbmNyZWFzZSBwZXIgbGV2ZWxcclxuXHRcdC8vIHRoaXMuZGFtYWdlQmFzZSA9IHBsYXllckNsYXNzLmRhbWFnZUJhc2UgKyAocGxheWVyQ2xhc3MuaW5jcmVhc2VQZXJMZXZlbC5kYW1hZ2UgKiB0aGlzLmxldmVsKTtcclxuXHRcdHRoaXMuZGFtYWdlQmFzZSA9IDU7XHJcblx0XHR0aGlzLmRlZmVuY2VCYXNlID0gMDtcclxuXHRcdHRoaXMuaGVhbHRoTWF4QmFzZSA9IDEwO1xyXG5cdFx0dGhpcy5lbmVyZ3lNYXhCYXNlID0gNDA7XHJcblx0XHR0aGlzLnJhbmdlQmFzZSA9IDE7XHJcblx0fVxyXG5cclxuXHRjYWxjSXRlbUJvbnVzKCkge1xyXG5cdFx0bGV0IGl0ZW1Cb251cyA9IHtcclxuXHRcdFx0ZGFtYWdlOiAwLFxyXG5cdFx0XHRkZWZlbmNlOiAwLFxyXG5cdFx0XHRoZWFsdGhNYXg6IDAsXHJcblx0XHRcdGVuZXJneU1heDogMCxcclxuXHRcdFx0cmFuZ2U6IDBcclxuXHRcdH07XHJcblxyXG5cdFx0Ly8gRm9yIGVhY2ggaXRlbSBpbiBpbnZlbnRvcnkgY2hlY2sgZm9yIGJvbnVzZXNcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgKGNvbmZpZy5JTlZFTlRPUllfU0laRSArIGNvbmZpZy5FUVVJUE1FTlRfU0laRSk7IGkrKykge1xyXG5cdFx0XHRsZXQgaXRlbSA9IHRoaXMuaW52ZW50b3J5W2ldO1xyXG5cdFx0XHRpZiAoaXRlbSAmJiAhaXRlbS5yZW1vdmUpIHtcclxuXHRcdFx0XHRpdGVtQm9udXMuZGFtYWdlICs9IGl0ZW0ucGFzc2l2ZURhbWFnZTtcclxuXHRcdFx0XHRpdGVtQm9udXMuZGVmZW5jZSArPSBpdGVtLnBhc3NpdmVEZWZlbmNlO1xyXG5cdFx0XHRcdGl0ZW1Cb251cy5oZWFsdGhNYXggKz0gaXRlbS5wYXNzaXZlSGVhbHRoTWF4O1xyXG5cdFx0XHRcdGl0ZW1Cb251cy5lbmVyZ3lNYXggKz0gaXRlbS5wYXNzaXZlRW5lcmd5TWF4O1xyXG5cdFx0XHRcdGl0ZW1Cb251cy5yYW5nZSArPSBpdGVtLnBhc3NpdmVSYW5nZTtcclxuXHJcblx0XHRcdFx0aWYgKGkgPj0gY29uZmlnLklOVkVOVE9SWV9TSVpFKSB7XHJcblx0XHRcdFx0XHRpdGVtQm9udXMuZGFtYWdlICs9IGl0ZW0uZXF1aXBEYW1hZ2U7XHJcblx0XHRcdFx0XHRpdGVtQm9udXMuZGVmZW5jZSArPSBpdGVtLmVxdWlwRGVmZW5jZTtcclxuXHRcdFx0XHRcdGl0ZW1Cb251cy5oZWFsdGhNYXggKz0gaXRlbS5lcXVpcEhlYWx0aE1heDtcclxuXHRcdFx0XHRcdGl0ZW1Cb251cy5lbmVyZ3lNYXggKz0gaXRlbS5lcXVpcEVuZXJneU1heDtcclxuXHRcdFx0XHRcdGl0ZW1Cb251cy5yYW5nZSArPSBpdGVtLmVxdWlwUmFuZ2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiBpdGVtQm9udXM7XHJcblx0fVxyXG5cclxuXHRjYWxjRWZmZWN0Qm9udXMoKSB7XHJcblx0XHRsZXQgZWZmZWN0Qm9udXMgPSB7XHJcblx0XHRcdGRhbWFnZTogMCxcclxuXHRcdFx0ZGVmZW5jZTogMCxcclxuXHRcdFx0aGVhbHRoTWF4OiAwLFxyXG5cdFx0XHRlbmVyZ3lNYXg6IDAsXHJcblx0XHRcdHJhbmdlOiAwXHJcblx0XHR9O1xyXG5cclxuXHRcdC8vIFRPRE86IHdvcmsgb3V0IGhvdyB0byBkbyBlZmZlY3RzIGZvciBzcGVsbHMgYW5kIHBvdGlvbnNcclxuXHRcdHJldHVybiBlZmZlY3RCb251cztcclxuXHR9XHJcblx0XHJcblx0Y2FsY0JvbnVzU3RhdHMoKSB7XHQvLyBJdGVtcyAoZXF1aXBwZWQgYW5kIHBhc3NpdmUpIGFuZCBFZmZlY3RzIChzcGVsbHMgYW5kIHBvdGlvbnMpXHJcblx0XHRsZXQgaXRlbUJvbnVzID0gdGhpcy5jYWxjSXRlbUJvbnVzKCk7XHJcblx0XHRsZXQgZWZmZWN0Qm9udXMgPSB0aGlzLmNhbGNFZmZlY3RCb251cygpO1xyXG5cclxuXHRcdHRoaXMuZGFtYWdlQm9udXMgPSBpdGVtQm9udXMuZGFtYWdlICsgZWZmZWN0Qm9udXMuZGFtYWdlO1xyXG5cdFx0dGhpcy5kZWZlbmNlQm9udXMgPSBpdGVtQm9udXMuZGVmZW5jZSArIGVmZmVjdEJvbnVzLmRlZmVuY2U7XHJcblx0XHR0aGlzLmhlYWx0aE1heEJvbnVzID0gaXRlbUJvbnVzLmhlYWx0aE1heCArIGVmZmVjdEJvbnVzLmhlYWx0aE1heDtcclxuXHRcdHRoaXMuZW5lcmd5TWF4Qm9udXMgPSBpdGVtQm9udXMuZW5lcmd5TWF4ICsgZWZmZWN0Qm9udXMuZW5lcmd5TWF4O1xyXG5cdFx0dGhpcy5yYW5nZUJvbnVzID0gaXRlbUJvbnVzLnJhbmdlICsgZWZmZWN0Qm9udXMucmFuZ2U7XHJcblx0fVxyXG5cclxuXHRjYWxjU3RhdHMoKSB7XHJcblx0XHR0aGlzLmNhbGNCYXNlU3RhdHMoKTtcclxuXHRcdHRoaXMuY2FsY0JvbnVzU3RhdHMoKTtcclxuXHR9XHJcblxyXG5cdHJlc3RvcmUoKSB7XHJcblx0XHR0aGlzLmhlYWx0aCA9IHRoaXMuaGVhbHRoTWF4O1xyXG5cdFx0dGhpcy5lbmVyZ3kgPSB0aGlzLmVuZXJneU1heDtcclxuXHR9XHJcblx0XHJcblx0Ly8gTW92ZW1lbnRcclxuXHRtb3ZlKGRpcmVjdGlvbikge1xyXG5cdFx0aWYgKHRoaXMuaXNNb3ZpbmcpIHJldHVybjtcclxuXHJcblx0XHRpZiAoZGlyZWN0aW9uKSB7XHJcblx0XHRcdHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChkaXJlY3Rpb24gPT09ICdsZWZ0Jykge1xyXG5cdFx0XHRpZiAoIWdhbWUuaXNWYWNhbnQodGhpcy5tYXAsIHRoaXMueCAtIDEsIHRoaXMueSkpIHJldHVybjtcclxuXHRcdFx0dGhpcy5kZXN0aW5hdGlvblgtLTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ3JpZ2h0Jykge1xyXG5cdFx0XHRpZiAoIWdhbWUuaXNWYWNhbnQodGhpcy5tYXAsIHRoaXMueCArIDEsIHRoaXMueSkpIHJldHVybjtcclxuXHRcdFx0dGhpcy5kZXN0aW5hdGlvblgrKztcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ3VwJykge1xyXG5cdFx0XHRpZiAoIWdhbWUuaXNWYWNhbnQodGhpcy5tYXAsIHRoaXMueCwgdGhpcy55IC0gMSkpIHJldHVybjtcclxuXHRcdFx0dGhpcy5kZXN0aW5hdGlvblktLTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ2Rvd24nKSB7XHJcblx0XHRcdGlmICghZ2FtZS5pc1ZhY2FudCh0aGlzLm1hcCwgdGhpcy54LCB0aGlzLnkgKyAxKSkgcmV0dXJuO1xyXG5cdFx0XHR0aGlzLmRlc3RpbmF0aW9uWSsrO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHN3aXRjaCAodXRpbC5yYW5kb21JbnQoMCwgMyArIHRoaXMubGF6aW5lc3MpKSB7XHJcblx0XHRcdFx0Y2FzZSAwOiB0aGlzLm1vdmUoJ2xlZnQnKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIDE6IHRoaXMubW92ZSgncmlnaHQnKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIDI6IHRoaXMubW92ZSgndXAnKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIDM6IHRoaXMubW92ZSgnZG93bicpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGRlZmF1bHQ6IC8vIERvbid0IE1vdmVcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gU2V0IG1vdmUgc3BlZWRcclxuXHRcdGlmICh0aGlzLmlzUnVubmluZykge1xyXG5cdFx0XHRpZiAodGhpcy5lbmVyZ3kgPiAwKSB7XHJcblx0XHRcdFx0dGhpcy5lbmVyZ3ktLTtcclxuXHRcdFx0XHR0aGlzLm1vdmVTcGVlZCA9IDQ7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5lbmVyZ3kgPSAwO1xyXG5cdFx0XHRcdHRoaXMubW92ZVNwZWVkID0gMi41O1xyXG5cdFx0XHRcdHRoaXMuaXNSdW5uaW5nID0gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHR0aGlzLm1vdmVTcGVlZCA9IDIuNTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dGhpcy5pc01vdmluZyA9IHRydWU7XHJcblx0fVxyXG5cdFxyXG5cdG1vdmVUb1RhcmdldCh0YXJnZXQsIGhvc3RpbGUpIHtcclxuXHRcdGlmICghdGFyZ2V0KSByZXR1cm47XHJcblx0XHRcclxuXHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICYmIHRhcmdldC55ID09PSB0aGlzLnkpIHtcclxuXHRcdFx0dGhpcy5tb3ZlKCk7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmICh1dGlsLnJhbmRvbUludCgwLCAxKSA9PT0gMCkge1xyXG5cdFx0XHRpZiAodGFyZ2V0LnggPCB0aGlzLngpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LnggPj0gKHRoaXMueCAtIHRoaXMucmFuZ2UpICYmIHRhcmdldC55ID09PSB0aGlzLnkpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ2xlZnQnO1xyXG5cdFx0XHRcdFx0XHRpZiAoIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmF0dGFjaygnbGVmdCcpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCdsZWZ0Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHRhcmdldC54ID4gdGhpcy54KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggKyB0aGlzLnJhbmdlICYmIHRhcmdldC55ID09PSB0aGlzLnkpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ3JpZ2h0JztcclxuXHRcdFx0XHRcdFx0aWYgKCF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ3JpZ2h0Jyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ3JpZ2h0Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHRhcmdldC55IDwgdGhpcy55KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggJiYgdGFyZ2V0LnkgPT09IHRoaXMueSAtIHRoaXMucmFuZ2UpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ3VwJztcclxuXHRcdFx0XHRcdFx0aWYgKCF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ3VwJyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ3VwJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHRhcmdldC55ID4gdGhpcy55KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggJiYgdGFyZ2V0LnkgPT09IHRoaXMueSArIHRoaXMucmFuZ2UpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ2Rvd24nO1xyXG5cdFx0XHRcdFx0XHRpZiAoIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmF0dGFjaygnZG93bicpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCdkb3duJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0aWYgKHRhcmdldC55ID4gdGhpcy55KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggJiYgdGFyZ2V0LnkgPT09IHRoaXMueSArIHRoaXMucmFuZ2UpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlKSB7XHJcblx0XHRcdFx0XHRcdGlmICghdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCdkb3duJyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ2Rvd24nKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodGFyZ2V0LnkgPCB0aGlzLnkpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LnggPT09IHRoaXMueCAmJiB0YXJnZXQueSA9PT0gdGhpcy55IC0gdGhpcy5yYW5nZSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUpIHtcclxuXHRcdFx0XHRcdFx0aWYgKCF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ3VwJyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ3VwJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHRhcmdldC54ID4gdGhpcy54KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggKyB0aGlzLnJhbmdlICYmIHRhcmdldC55ID09PSB0aGlzLnkpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlKSB7XHJcblx0XHRcdFx0XHRcdGlmICghdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCdyaWdodCcpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCdyaWdodCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICh0YXJnZXQueCA8IHRoaXMueCkge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQueCA+PSAodGhpcy54IC0gdGhpcy5yYW5nZSkgJiYgdGFyZ2V0LnkgPT09IHRoaXMueSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUpIHtcclxuXHRcdFx0XHRcdFx0aWYgKCF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ2xlZnQnKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSgnbGVmdCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHQvLyBDb21iYXRcclxuXHRjaGVja0luUmFuZ2UoZGlyZWN0aW9uLCB0YXJnZXQsIHJhbmdlKSB7XHJcblx0XHRpZiAodGFyZ2V0Lm1hcCAhPT0gdGhpcy5tYXApIHJldHVybiBmYWxzZTtcclxuXHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICYmIHRhcmdldC55ID09PSB0aGlzLnkpIHJldHVybiBmYWxzZTtcdC8vIFN0YWNrZWQgZG9lcyBub3QgY291bnQgYXMgaW4gcmFuZ2VcclxuXHRcdFxyXG5cdFx0aWYgKHRhcmdldC55ID09PSB0aGlzLnkpIHtcclxuXHRcdFx0aWYgKGRpcmVjdGlvbiA9PT0gJ2xlZnQnKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMueCA9PT0gMCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHJldHVybiAodGFyZ2V0LnggPCB0aGlzLnggJiYgdGFyZ2V0LnggPj0gKHRoaXMueCAtIHJhbmdlKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ3JpZ2h0Jykge1xyXG5cdFx0XHRcdGlmICh0aGlzLnggPT09IGNvbmZpZy5NQVBfQ09MVU1OUyAtIDEpIHtcclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gKHRhcmdldC54ID4gdGhpcy54ICYmIHRhcmdldC54IDw9ICh0aGlzLnggKyByYW5nZSkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAodGFyZ2V0LnggPT09IHRoaXMueCkge1xyXG5cdFx0XHRpZiAoZGlyZWN0aW9uID09PSAndXAnKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMueSA9PT0gMCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHJldHVybiAodGFyZ2V0LnkgPCB0aGlzLnkgJiYgdGFyZ2V0LnkgPj0gKHRoaXMueSAtIHJhbmdlKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ2Rvd24nKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMueSA9PT0gY29uZmlnLk1BUF9ST1dTIC0gMSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHJldHVybiAodGFyZ2V0LnkgPiB0aGlzLnkgJiYgdGFyZ2V0LnkgPD0gKHRoaXMueSArIHJhbmdlKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblxyXG5cdGF0dGFjayhudW1UYXJnZXRzID0gMSwgZGlyZWN0aW9uID0gdGhpcy5kaXJlY3Rpb24pIHtcclxuXHRcdGlmICh0aGlzLmlzQXR0YWNraW5nIHx8IHRoaXMuYXR0YWNrVGltZXIgPiAwKSByZXR1cm47XHJcblxyXG5cdFx0dGhpcy5pc0F0dGFja2luZyA9IHRydWU7XHJcblx0XHRnYW1lLnNwYXduTWFwSXRlbSh0aGlzLm1hcCwgdGhpcy54LCB0aGlzLnksIDEpO1xyXG5cdFx0XHJcblx0XHRsZXQgYWN0b3JMaXN0ID0gZ2FtZS5wbGF5ZXJMaXN0LmNvbmNhdChnYW1lLm1hcExpc3RbdGhpcy5tYXBdLmJvdHMpO1xyXG5cdFx0bGV0IHRhcmdldExpc3QgPSBhY3Rvckxpc3QuZmlsdGVyKChhY3RvcikgPT4ge1xyXG5cdFx0XHRpZiAoYWN0b3IgPT09IHRoaXMgfHwgYWN0b3IuaXNEZWFkKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdGlmICh0aGlzLmNoZWNrSW5SYW5nZShkaXJlY3Rpb24sIGFjdG9yLCB0aGlzLnJhbmdlKSkgcmV0dXJuIHRydWU7XHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdFx0dGFyZ2V0TGlzdC5zb3J0KChhLCBiKSA9PiB7XHJcblx0XHRcdHJldHVybiAoYS56IC0gYi56KTtcdC8vIExvd2VzdCB0byBoaWdoZXN0XHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdFx0dGFyZ2V0TGlzdCA9IHRhcmdldExpc3Quc3BsaWNlKC1udW1UYXJnZXRzKTtcclxuXHRcdFxyXG5cdFx0dGFyZ2V0TGlzdC5mb3JFYWNoKCh0YXJnZXQpID0+IHtcclxuXHRcdFx0dGFyZ2V0LnRha2VEYW1hZ2UodGhpcy5kYW1hZ2UsIHRoaXMpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdFxyXG5cdHRha2VEYW1hZ2UoZGFtYWdlLCBzb3VyY2UpIHtcclxuXHRcdGRhbWFnZSAtPSB0aGlzLmRlZmVuY2U7XHJcblx0XHRpZiAoZGFtYWdlIDwgMCkge1xyXG5cdFx0XHRkYW1hZ2UgPSAwO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHRoaXMuaGVhbHRoIC09IGRhbWFnZTtcclxuXHRcdFx0aWYgKHRoaXMuaGVhbHRoIDw9IDApIHtcclxuXHRcdFx0XHR0aGlzLnNldERlYWQoc291cmNlKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRjb25zb2xlLmxvZyhgJHtzb3VyY2UubmFtZX0gaGl0cyAke3RoaXMubmFtZX0gZm9yICR7ZGFtYWdlfSBkYW1hZ2UuYCk7XHJcblx0XHR9XHJcblx0XHRnYW1lLnNwYXduRGFtYWdlVGV4dCh0aGlzLm1hcCwgdGhpcy54LCB0aGlzLnksIGRhbWFnZSk7XHJcblx0fVxyXG5cdFxyXG5cdHJlc3Bhd24oKSB7XHJcblx0XHRnYW1lLnNlbmRTZXJ2ZXJNZXNzYWdlKHRoaXMubmFtZSArIFwiIGlzIGJhY2sgZnJvbSB0aGUgZGVhZC5cIik7XHJcblxyXG5cdFx0dGhpcy5tYXAgPSB0aGlzLnJlc3Bhd25NYXA7XHJcblx0XHR0aGlzLnggPSB0aGlzLnJlc3Bhd25YO1xyXG5cdFx0dGhpcy55ID0gdGhpcy5yZXNwYXduWTtcclxuXHRcdHRoaXMuc3RhcnRYID0gdGhpcy5yZXNwYXduWDtcclxuXHRcdHRoaXMuc3RhcnRZID0gdGhpcy5yZXNwYXduWTtcclxuXHRcdHRoaXMuZGVzdGluYXRpb25YID0gdGhpcy5yZXNwYXduWDtcclxuXHRcdHRoaXMuZGVzdGluYXRpb25ZID0gdGhpcy5yZXNwYXduWTtcclxuXHRcdFxyXG5cdFx0dGhpcy5jYWxjQm9udXNTdGF0cygpO1xyXG5cdFx0dGhpcy5yZXN0b3JlKCk7XHJcblx0XHRcclxuXHRcdHRoaXMuaXNXYWxraW5nID0gZmFsc2U7XHJcblx0XHR0aGlzLmlzUnVubmluZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy5pc0F0dGFja2luZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy5pc0RlYWQgPSBmYWxzZTtcclxuXHRcdHRoaXMucmVzcGF3blRpbWVyID0gMDtcclxuXHR9XHJcblx0XHJcblx0c2V0RGVhZChzb3VyY2UpIHtcclxuXHRcdGxldCBtYXAgPSBnYW1lLm1hcExpc3RbdGhpcy5tYXBdO1xyXG5cclxuXHRcdC8vIEludmVudG9yeSBJdGVtIERyb3AgQ2hhbmNlXHJcblx0XHRsZXQgZHJvcENoYW5jZSA9IHV0aWwuY2xhbXAobWFwLmRyb3BDaGFuY2UsIDAsIDEwMCk7XHJcblx0XHRpZiAoZHJvcENoYW5jZSA+IDApIHtcclxuXHRcdFx0bGV0IGl0ZW1zID0gdGhpcy5pbnZlbnRvcnkuZmlsdGVyKChpdGVtKSA9PiB7XHJcblx0XHRcdFx0aWYgKGl0ZW0uc2xvdCA8IGNvbmZpZy5JTlZFTlRPUllfU0laRSkgcmV0dXJuIHRydWU7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcclxuXHRcdFx0XHRpZiAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAxKSA8PSBkcm9wQ2hhbmNlKSB7XHJcblx0XHRcdFx0XHR0aGlzLmRyb3BJdGVtKGl0ZW0uc2xvdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBFcXVpcHBlZCBJdGVtIERyb3AgQW1vdW50XHJcblx0XHRsZXQgZHJvcEFtb3VudEVRID0gdXRpbC5jbGFtcChtYXAuZHJvcEFtb3VudEVRLCAwLCBjb25maWcuRVFVSVBNRU5UX1NJWkUpO1xyXG5cdFx0aWYgKGRyb3BBbW91bnRFUSA+IDApIHtcclxuXHRcdFx0bGV0IGVxdWlwbWVudCA9IHRoaXMuaW52ZW50b3J5LmZpbHRlcigoaXRlbSkgPT4ge1xyXG5cdFx0XHRcdGlmIChpdGVtLnNsb3QgPj0gY29uZmlnLklOVkVOVE9SWV9TSVpFKSByZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0ZXF1aXBtZW50ID0gdXRpbC5zaHVmZmxlKGVxdWlwbWVudCk7XHJcblx0XHRcdGVxdWlwbWVudC5zcGxpY2UoLWRyb3BBbW91bnRFUSk7XHJcblx0XHRcdGVxdWlwbWVudC5mb3JFYWNoKChpdGVtKSA9PiB7XHJcblx0XHRcdFx0dGhpcy5kcm9wSXRlbShlcXVpcG1lbnQuc2xvdCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR0aGlzLmlzRGVhZCA9IHRydWU7XHJcblx0XHR0aGlzLmhlYWx0aCA9IDA7XHJcblx0XHR0aGlzLmVuZXJneSA9IDA7XHJcblx0XHR0aGlzLmRlYXRocysrO1xyXG5cdFx0XHJcblx0XHRpZiAoc291cmNlKSB7XHJcblx0XHRcdGlmIChzb3VyY2UuY29udHJvbGxlciA9ICdwbGF5ZXInKSB7XHJcblx0XHRcdFx0Z2FtZS5zZW5kU2VydmVyTWVzc2FnZShzb3VyY2UubmFtZSArIFwiIGhhcyBtdXJkZXJlZCBcIiArIHRoaXMubmFtZSArIFwiIGluIGNvbGQgYmxvb2QhXCIpO1xyXG5cdFx0XHRcdHNvdXJjZS5raWxscysrO1xyXG5cdFx0XHRcdGlmIChzb3VyY2UudGFyZ2V0ID09PSB0aGlzKSB7XHJcblx0XHRcdFx0XHRzb3VyY2UudGFyZ2V0ID0gbnVsbDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0Z2FtZS5zZW5kU2VydmVyTWVzc2FnZSh0aGlzLm5hbWUgKyBcIiBoYXMgYmVlbiBraWxsZWQgYnkgXCIgKyBzb3VyY2UubmFtZSArIFwiIVwiKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGdhbWUuc2VuZFNlcnZlck1lc3NhZ2UodGhpcy5uYW1lICsgXCIgaGFzIGRpZWQhXCIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHQvLyBJbnZlbnRvcnlcclxuXHRwaWNrVXAoKSB7XHJcblx0XHRmb3IgKGxldCBpdGVtIG9mIGdhbWUubWFwTGlzdFt0aGlzLm1hcF0uaXRlbXMpIHtcclxuXHRcdFx0aWYgKGl0ZW0gJiYgaXRlbS54ID09PSB0aGlzLnggJiYgaXRlbS55ID09PSB0aGlzLnkpIHtcclxuXHRcdFx0XHRsZXQgc2xvdCA9IHRoaXMuZ2V0TWFwSXRlbShpdGVtLm1hcCwgaXRlbS5pZCk7XHJcblx0XHRcdFx0aWYgKHNsb3QgIT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0aXRlbS5tb3ZlVG9QbGF5ZXIodGhpcy5pZCwgc2xvdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly8gSW52ZW50b3J5IGZ1bGxcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRnZXRNYXBJdGVtKG1hcElkLCBpZCkge1xyXG5cdFx0bGV0IGl0ZW0gPSBnYW1lLm1hcExpc3RbbWFwSWRdLml0ZW1zW2lkXTtcclxuXHRcdGlmICghaXRlbSkgcmV0dXJuIG51bGw7XHJcblxyXG5cdFx0aWYgKGl0ZW0uc3RhY2sgPiAwKSB7XHJcblx0XHRcdGxldCBzbG90ID0gdGhpcy5maW5kSXRlbVNsb3QoaXRlbS5pdGVtQ2xhc3MpO1xyXG5cdFx0XHRpZiAoc2xvdCA+PSAwKSB7XHJcblx0XHRcdFx0dGhpcy5pbnZlbnRvcnlbc2xvdF0uc3RhY2sgKz0gaXRlbS5zdGFjaztcclxuXHRcdFx0XHRpdGVtLnJlbW92ZSgpO1xyXG5cdFx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IHNsb3QgPSB0aGlzLmZpbmRGaXJzdEVtcHR5U2xvdCgpO1xyXG5cdFx0cmV0dXJuIHNsb3Q7XHJcblx0fVxyXG5cclxuXHRnZXRJdGVtKGRhdGEpIHtcclxuXHRcdGlmICghZGF0YSB8fCBkYXRhLml0ZW1DbGFzcyA9PSBudWxsKSByZXR1cm4gbnVsbDtcclxuXHJcblx0XHRpZiAoZGF0YS5zdGFjaykge1xyXG5cdFx0XHRzbG90ID0gdGhpcy5maW5kSXRlbVNsb3QoZGF0YS5pdGVtQ2xhc3MpO1xyXG5cdFx0XHRpZiAoc2xvdCA+PSAwKSB7XHJcblx0XHRcdFx0dGhpcy5pbnZlbnRvcnlbc2xvdF0uc3RhY2sgKz0gZGF0YS5zdGFjaztcclxuXHRcdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0aGlzLmZpbmRGaXJzdEVtcHR5U2xvdCgpO1xyXG5cdH1cclxuXHRcclxuXHRkcm9wSXRlbShzbG90KSB7XHJcblx0XHRsZXQgaXRlbSA9IHRoaXMuaW52ZW50b3J5W3Nsb3RdO1xyXG5cdFx0aWYgKCFpdGVtKSByZXR1cm47XHJcblx0XHRcclxuXHRcdGlmIChzbG90ID49IGNvbmZpZy5JTlZFTlRPUllfU0laRSkge1xyXG5cdFx0XHR0aGlzLnVuZXF1aXBJdGVtKHNsb3QpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aXRlbS5tb3ZlVG9NYXAodGhpcy5tYXAsIHRoaXMueCwgdGhpcy55KTtcclxuXHR9XHJcblx0XHJcblx0dXNlSXRlbShzbG90KSB7XHJcblx0XHRsZXQgaXRlbSA9IHRoaXMuaW52ZW50b3J5W3Nsb3RdO1xyXG5cdFx0aWYgKCFpdGVtKSByZXR1cm47XHJcblxyXG5cdFx0Ly8gaWYgKCFkYi5pdGVtc1tpdGVtLmlkXS51c2UuY2FsbCh0aGlzLCBzbG90KSkgcmV0dXJuO1x0Ly8gUnVuICd1c2UnIHNjcmlwdFxyXG5cdFx0XHJcblx0XHRpZiAoaXRlbS5pc0VxdWlwbWVudCgpKSB7XHQvLyBFcXVpcG1lbnQgSXRlbXNcclxuXHRcdFx0aWYgKHNsb3QgPCBjb25maWcuSU5WRU5UT1JZX1NJWkUpIHtcdC8vIENoZWNrIGlmIGl0ZW0gaXMgZXF1aXBwZWRcclxuXHRcdFx0XHR0aGlzLmVxdWlwSXRlbShzbG90KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHR0aGlzLnVuZXF1aXBJdGVtKHNsb3QpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoaXRlbS5yZXVzYWJsZSkgcmV0dXJuO1xyXG5cdFx0XHJcblx0XHRpZiAoaXRlbS5zdGFjayA+IDEpIHtcclxuXHRcdFx0aXRlbS5zdGFjay0tO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aXRlbS5yZW1vdmUoKTtcclxuXHR9XHJcblx0XHJcblx0aGFzSXRlbShpdGVtQ2xhc3MpIHtcclxuXHRcdGxldCBjb3VudCA9IDA7XHJcblx0XHRmb3IgKGxldCBzbG90ID0gMDsgc2xvdCA8IGNvbmZpZy5JTlZFTlRPUllfU0laRSArIGNvbmZpZy5FUVVJUE1FTlRfU0laRTsgc2xvdCsrKSB7XHJcblx0XHRcdGlmICh0aGlzLmludmVudG9yeVtzbG90XSkge1xyXG5cdFx0XHRcdGlmICh0aGlzLmludmVudG9yeVtzbG90XS5pdGVtQ2xhc3MgPT09IGl0ZW1DbGFzcykge1xyXG5cdFx0XHRcdFx0Y291bnQrKztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBjb3VudDtcclxuXHR9XHJcblxyXG5cdGZpbmRJdGVtU2xvdChpdGVtQ2xhc3MpIHtcclxuXHRcdGxldCBzbG90ID0gbnVsbDtcclxuXHRcdGZvciAobGV0IGNoZWNrU2xvdCA9IDA7IGNoZWNrU2xvdCA8IGNvbmZpZy5JTlZFTlRPUllfU0laRSArIGNvbmZpZy5FUVVJUE1FTlRfU0laRTsgY2hlY2tTbG90KyspIHtcclxuXHRcdFx0aWYgKHRoaXMuaW52ZW50b3J5W2NoZWNrU2xvdF0pIHtcclxuXHRcdFx0XHRpZiAodGhpcy5pbnZlbnRvcnlbY2hlY2tTbG90XS5pdGVtQ2xhc3MgPT09IGl0ZW1DbGFzcykge1xyXG5cdFx0XHRcdFx0c2xvdCA9IGNoZWNrU2xvdDtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHNsb3Q7XHJcblx0fVxyXG5cdFxyXG5cdG1vdmVJdGVtVG9TbG90KHNsb3QsIG5ld1Nsb3QpIHtcclxuXHRcdGlmIChzbG90ID09IG51bGwgfHwgbmV3U2xvdCA9PSBudWxsIHx8IHNsb3QgPT09IG5ld1Nsb3QpIHJldHVybjtcdC8vIG51bGwgPT0gdW5kZWZpbmVkLCBudWxsICE9IDBcclxuXHRcdGlmIChzbG90ID49IGNvbmZpZy5JTlZFTlRPUllfU0laRSArIGNvbmZpZy5FUVVJUE1FTlRfU0laRSkgcmV0dXJuO1xyXG5cdFx0aWYgKG5ld1Nsb3QgPj0gY29uZmlnLklOVkVOVE9SWV9TSVpFICsgY29uZmlnLkVRVUlQTUVOVF9TSVpFKSByZXR1cm47XHJcblxyXG5cdFx0bGV0IGl0ZW0gPSB0aGlzLmludmVudG9yeVtzbG90XTtcclxuXHRcdGxldCBuZXdJdGVtID0gdGhpcy5pbnZlbnRvcnlbbmV3U2xvdF07XHJcblx0XHRpZiAoIWl0ZW0pIHJldHVybjtcclxuXHJcblx0XHRmdW5jdGlvbiBzd2FwU2xvdHMoKSB7XHJcblx0XHRcdGl0ZW0uc2xvdCA9IG5ld1Nsb3Q7XHJcblx0XHRcdGlmIChuZXdJdGVtKSBuZXdJdGVtLnNsb3QgPSBzbG90O1xyXG5cdFx0XHR1dGlsLnN3YXAodGhpcy5pbnZlbnRvcnksIHNsb3QsIG5ld1Nsb3QpO1xyXG5cdFx0XHR0aGlzLmNhbGNCb251c1N0YXRzKCk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmIChuZXdTbG90ID49IGNvbmZpZy5JTlZFTlRPUllfU0laRSkge1x0Ly8gVGFyZ2V0IHNsb3QgaXMgZm9yIGVxdWlwbWVudFxyXG5cdFx0XHRpZiAoIWl0ZW0uY2FuRXF1aXAobmV3U2xvdCkpIHtcclxuXHRcdFx0XHRnYW1lLnNlbmRQbGF5ZXJNZXNzYWdlKHRoaXMuaWQsIFwiVGhhdCBjYW5ub3QgYmUgZXF1aXBwZWQgdGhlcmUuXCIpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIE5vIG5ldyBpdGVtIGluIG5ldyBzbG90XHJcblx0XHRpZiAoIW5ld0l0ZW0pIHtcclxuXHRcdFx0c3dhcFNsb3RzKCk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBOZXcgaXRlbSBpbiBuZXcgc2xvdCwgb2xkIGl0ZW0gaW4gaW52ZW50b3J5XHJcblx0XHRpZiAoc2xvdCA8IGNvbmZpZy5JTlZFTlRPUllfU0laRSkge1xyXG5cdFx0XHRzd2FwU2xvdHMoKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIE9sZCBpdGVtIGlzIGVxdWlwcGVkLCBuZXcgaXRlbSBpcyBlcXVpcHBlZFxyXG5cdFx0aWYgKG5ld1Nsb3QgPj0gY29uZmlnLklOVkVOVE9SWV9TSVpFKSB7XHJcblx0XHRcdHN3YXBTbG90cygpO1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBPbGQgaXRlbSBpcyBlcXVpcHBlZCwgbmV3IGl0ZW0gaW4gaW52ZW50b3J5LCBzYW1lIGl0ZW0gdHlwZVxyXG5cdFx0aWYgKG5ld0l0ZW0udHlwZSA9PT0gaXRlbS50eXBlKSB7XHJcblx0XHRcdHN3YXBTbG90cygpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gT2xkIGl0ZW0gaXMgZXF1aXBwZWQsIG5ldyBpdGVtIGluIGludmVudG9yeSwgZGlmZmVyZW50IHR5cGVzXHJcblx0XHRuZXdTbG90ID0gdGhpcy5maW5kRmlyc3RFbXB0eVNsb3QoKTtcclxuXHRcdGlmIChuZXdTbG90ID09IG51bGwpIHtcclxuXHRcdFx0Z2FtZS5zZW5kUGxheWVyTWVzc2FnZSh0aGlzLmlkLCBcIllvdXIgaW52ZW50b3J5IGlzIGZ1bGwuXCIpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0c3dhcFNsb3RzKCk7XHJcblx0fVxyXG5cclxuXHRlcXVpcEl0ZW0oc2xvdCkge1xyXG5cdFx0bGV0IG5ld1Nsb3QgPSBudWxsO1xyXG5cdFx0Zm9yIChsZXQgaSA9IGNvbmZpZy5JTlZFTlRPUllfU0laRTsgaSA8IGNvbmZpZy5FUVVJUE1FTlRfU0laRTsgaSsrKSB7XHJcblx0XHRcdGlmIChpdGVtLmNhbkVxdWlwKGkpKSB7XHJcblx0XHRcdFx0bmV3U2xvdCA9IGk7XHJcblx0XHRcdFx0aWYgKCF0aGlzLmludmVudG9yeVtpXSkgYnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmIChuZXdTbG90ID09PSBudWxsKSByZXR1cm47XHJcblxyXG5cdFx0dGhpcy5tb3ZlSXRlbVRvU2xvdChzbG90LCBuZXdTbG90KTtcclxuXHR9XHJcblxyXG5cdHVuZXF1aXBJdGVtKHNsb3QpIHtcclxuXHRcdGlmIChzbG90IDwgY29uZmlnLklOVkVOVE9SWV9TSVpFKSByZXR1cm47XHJcblx0XHRpZiAoIXRoaXMuaW52ZW50b3J5W3Nsb3RdKSByZXR1cm47XHJcblx0XHRcclxuXHRcdGxldCBuZXdTbG90ID0gdGhpcy5maW5kRmlyc3RFbXB0eVNsb3QoKTtcclxuXHRcdGlmIChuZXdTbG90ID09IG51bGwpIHtcclxuXHRcdFx0Z2FtZS5zZW5kUGxheWVyTWVzc2FnZSh0aGlzLmlkLCBcIllvdXIgaW52ZW50b3J5IGlzIGZ1bGwuXCIpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5tb3ZlSXRlbVRvU2xvdChzbG90LCBuZXdTbG90KTtcclxuXHR9XHJcblx0XHJcblx0ZmluZEZpcnN0RW1wdHlTbG90KCkge1xyXG5cdFx0Zm9yIChsZXQgc2xvdCA9IDA7IHNsb3QgPCBjb25maWcuSU5WRU5UT1JZX1NJWkU7IHNsb3QrKykge1xyXG5cdFx0XHRpZiAodGhpcy5pbnZlbnRvcnlbc2xvdF0gPT0gbnVsbCkgcmV0dXJuIHNsb3Q7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9XHJcblxyXG5cclxuXHR1cGRhdGUoZGVsdGEpIHtcclxuXHRcdC8vIEludmVudG9yeSBJdGVtIFVwZGF0ZVxyXG5cdFx0dGhpcy5pbnZlbnRvcnkuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG5cdFx0XHRpdGVtLnVwZGF0ZSgpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0Ly8gUmVzcGF3bmluZ1xyXG5cdFx0aWYgKHRoaXMuaXNEZWFkKSB7XHJcblx0XHRcdHRoaXMucmVzcGF3blRpbWVyICs9IGRlbHRhO1xyXG5cdFx0XHRpZiAodGhpcy5yZXNwYXduVGltZXIgPj0gdGhpcy5yZXNwYXduU3BlZWQpIHRoaXMucmVzcGF3bigpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vIEF0dGFja2luZ1xyXG5cdFx0aWYgKHRoaXMuaXNBdHRhY2tpbmcgfHwgdGhpcy5hdHRhY2tUaW1lciA+IDApIHtcclxuXHRcdFx0dGhpcy5hdHRhY2tUaW1lciArPSBkZWx0YTtcclxuXHRcdFx0aWYgKHRoaXMuYXR0YWNrVGltZXIgPj0gMC4zKSB0aGlzLmlzQXR0YWNraW5nID0gZmFsc2U7XHJcblx0XHRcdGlmICh0aGlzLmF0dGFja1RpbWVyID49IHRoaXMuYXR0YWNrU3BlZWQpIHRoaXMuYXR0YWNrVGltZXIgPSAwO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBNb3ZlbWVudFxyXG5cdFx0aWYgKHRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0dGhpcy5sZXJwICs9IGRlbHRhICogdGhpcy5tb3ZlU3BlZWQ7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAodGhpcy5sZXJwID49IDAuNDkpIHtcclxuXHRcdFx0XHR0aGlzLnggPSB0aGlzLmRlc3RpbmF0aW9uWDtcclxuXHRcdFx0XHR0aGlzLnkgPSB0aGlzLmRlc3RpbmF0aW9uWTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0aWYgKHRoaXMubGVycCA+PSAwLjk5KSB7XHJcblx0XHRcdFx0dGhpcy5zdGFydFggPSB0aGlzLmRlc3RpbmF0aW9uWDtcclxuXHRcdFx0XHR0aGlzLnN0YXJ0WSA9IHRoaXMuZGVzdGluYXRpb25ZO1xyXG5cdFx0XHRcdHRoaXMubGVycCA9IDA7XHJcblx0XHRcdFx0dGhpcy5pc01vdmluZyA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRnZXRJbnZlbnRvcnlQYWNrKCkge1xyXG5cdFx0bGV0IGludmVudG9yeVBhY2sgPSBbXTtcclxuXHRcdFxyXG5cdFx0dGhpcy5pbnZlbnRvcnkuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG5cdFx0XHRpbnZlbnRvcnlQYWNrW2l0ZW0uc2xvdF0gPSBpdGVtLmdldFBhY2soKTtcclxuXHRcdH0pO1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gaW52ZW50b3J5UGFjaztcclxuXHR9XHJcbn1cclxuIiwiaW1wb3J0IGRiIGZyb20gJy4uL2RiLmpzJztcclxuaW1wb3J0IGdhbWUgZnJvbSAnLi4vZ2FtZS5qcyc7XHJcbmltcG9ydCBjb25maWcgZnJvbSAnLi4vY29uZmlnLmpzJztcclxuaW1wb3J0IHV0aWwgZnJvbSAnLi4vdXRpbC5qcyc7XHJcbmltcG9ydCBBY3RvciBmcm9tICcuL2FjdG9yLmpzJztcclxuXHJcbi8vIEEgQm90IGlzIGFuIEFjdG9yIHdpdGggY29uZGl0aW9uYWwgaW5wdXRzXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCb3QgZXh0ZW5kcyBBY3RvciB7XHJcblx0Y29uc3RydWN0b3IoZGF0YSkge1xyXG5cdFx0aWYgKGRhdGEuYm90Q2xhc3MgPT0gbnVsbCB8fCBkYXRhLm1hcCA9PSBudWxsIHx8IGRhdGEueCA9PSBudWxsIHx8IGRhdGEueSA9PSBudWxsKSByZXR1cm47XHJcblxyXG5cdFx0aWYgKGRhdGEuaWQgPT0gbnVsbCkgZGF0YS5pZCA9IHV0aWwuZmlyc3RFbXB0eUluZGV4KGdhbWUubWFwTGlzdFt0aGlzLm1hcF0uYm90cyk7XHJcblx0XHRcclxuXHRcdGxldCBjbGFzc0RhdGEgPSBkYi5nZXRCb3REYXRhKGRhdGEuYm90Q2xhc3MpO1xyXG5cdFx0aWYgKCFkYXRhLm5hbWUpIGRhdGEubmFtZSA9IGNsYXNzRGF0YS5uYW1lO1xyXG5cdFx0aWYgKGRhdGEuc3ByaXRlID09IG51bGwpIGRhdGEuc3ByaXRlID0gY2xhc3NEYXRhLnNwcml0ZTtcclxuXHRcdGlmIChkYXRhLmhvc3RpbGUgPT0gbnVsbCkgZGF0YS5ob3N0aWxlID0gY2xhc3NEYXRhLmhvc3RpbGU7XHJcblx0XHRpZiAoZGF0YS5kYW1hZ2VCYXNlID09IG51bGwpIGRhdGEuZGFtYWdlQmFzZSA9IGNsYXNzRGF0YS5kYW1hZ2VCYXNlO1xyXG5cdFx0aWYgKGRhdGEuZGVmZW5jZUJhc2UgPT0gbnVsbCkgZGF0YS5kZWZlbmNlQmFzZSA9IGNsYXNzRGF0YS5kZWZlbmNlQmFzZTtcclxuXHRcdGlmIChkYXRhLmhlYWx0aE1heEJhc2UgPT0gbnVsbCkgZGF0YS5oZWFsdGhNYXhCYXNlID0gY2xhc3NEYXRhLmhlYWx0aE1heEJhc2U7XHJcblx0XHRpZiAoZGF0YS5lbmVyZ3lNYXhCYXNlID09IG51bGwpIGRhdGEuZW5lcmd5TWF4QmFzZSA9IGNsYXNzRGF0YS5lbmVyZ3lNYXhCYXNlO1xyXG5cdFx0aWYgKGRhdGEucmFuZ2VCYXNlID09IG51bGwpIGRhdGEucmFuZ2VCYXNlID0gY2xhc3NEYXRhLnJhbmdlQmFzZTtcclxuXHJcblx0XHRzdXBlcihkYXRhLm1hcCwgZGF0YS54LCBkYXRhLnksIGRhdGEubmFtZSwgZGF0YS5zcHJpdGUpO1xyXG5cdFx0dGhpcy5pZCA9IGRhdGEuaWQ7XHJcblx0XHR0aGlzLmJvdENsYXNzID0gZGF0YS5ib3RDbGFzcztcclxuXHRcdHRoaXMuaG9zdGlsZSA9IGRhdGEuaG9zdGlsZTtcclxuXHRcdHRoaXMuZGFtYWdlQmFzZSA9IGRhdGEuZGFtYWdlQmFzZTtcclxuXHRcdHRoaXMuZGVmZW5jZUJhc2UgPSBkYXRhLmRlZmVuY2VCYXNlO1xyXG5cdFx0dGhpcy5oZWFsdGhNYXhCYXNlID0gZGF0YS5oZWFsdGhNYXhCYXNlO1xyXG5cdFx0dGhpcy5lbmVyZ3lNYXhCYXNlID0gZGF0YS5lbmVyZ3lNYXhCYXNlO1xyXG5cdFx0dGhpcy5yYW5nZUJhc2UgPSBkYXRhLnJhbmdlQmFzZTtcclxuXHRcdFxyXG5cdFx0dGhpcy50YXJnZXQgPSBudWxsO1xyXG5cdFx0dGhpcy5zZXRUYXNrKCd3YW5kZXJpbmcnKTtcclxuXHRcdHRoaXMubW92ZVRpbWVyID0gMDtcclxuXHJcblx0XHRnYW1lLm1hcExpc3RbdGhpcy5tYXBdLmJvdHNbdGhpcy5pZF0gPSB0aGlzO1xyXG5cdH1cclxuXHRcclxuXHRnZXRNYXBJdGVtKG1hcElkLCBpZCkge1xyXG5cdFx0bGV0IHNsb3QgPSBzdXBlci5nZXRNYXBJdGVtKG1hcElkLCBpZCk7XHJcblx0XHRpZiAoc2xvdCA9PSBudWxsKSByZXR1cm47XHJcblx0XHRcclxuXHRcdGxldCBpdGVtID0gZ2FtZS5tYXBMaXN0W21hcElkXS5pdGVtc1tpZF07XHJcblx0XHRpdGVtLm1vdmVUb0JvdCh0aGlzLm1hcCwgdGhpcy5pZCwgc2xvdCk7XHJcblx0fVxyXG5cclxuXHRnZXRJdGVtKGRhdGEpIHtcclxuXHRcdGxldCBzbG90ID0gc3VwZXIuZ2V0SXRlbShkYXRhKTtcclxuXHRcdGlmIChzbG90ID09IG51bGwpIHJldHVybjtcclxuXHJcblx0XHRkYXRhLm93bmVyID0gJ2JvdCc7XHJcblx0XHRkYXRhLm1hcElkID0gdGhpcy5tYXA7XHJcblx0XHRkYXRhLmlkID0gdGhpcy5pZDtcclxuXHRcdGRhdGEuc2xvdCA9IHNsb3Q7XHJcblx0XHRuZXcgSXRlbShkYXRhKTtcclxuXHR9XHJcblxyXG5cdHVwZGF0ZShkZWx0YSkge1xyXG5cdFx0c3VwZXIudXBkYXRlKGRlbHRhKTsgXHQvLyBEZWZhdWx0IEFjdG9yIFVwZGF0ZVxyXG5cdFx0aWYgKHRoaXMuaXNEZWFkKSByZXR1cm47XHJcblxyXG5cdFx0dGhpcy5tb3ZlVGltZXIrKztcclxuXHRcdFxyXG5cdFx0Ly8gQUkgSW5wdXRzXHJcblx0XHRzd2l0Y2godGhpcy50YXNrKSB7XHJcblx0XHRcdGNhc2UgJ3dhbmRlcmluZyc6XHRcdC8vIE1vdmUgcmFuZG9tbHlcclxuXHRcdFx0XHR0aGlzLm1vdmUoKTtcclxuXHRcdFx0XHR0aGlzLnBpY2tVcCgpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnZm9sbG93aW5nJzpcdFx0Ly8gTW92ZSB0b3dhcmRzIHRhcmdldFxyXG5cdFx0XHRcdGlmICh0aGlzLnRhcmdldCkge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlVG9UYXJnZXQodGhpcy50YXJnZXQsIGZhbHNlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHQvLyBObyB0YXJnZXRcclxuXHRcdFx0XHRcdHRoaXMuc2V0VGFzaygnd2FuZGVyaW5nJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnYXR0YWNraW5nJzpcdFx0Ly8gTW92ZSB0b3dhcmRzIHRhcmdldCBhbmQgYXR0YWNrXHJcblx0XHRcdFx0aWYgKHRoaXMudGFyZ2V0KSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmVUb1RhcmdldCh0aGlzLnRhcmdldCwgdHJ1ZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly8gTm8gdGFyZ2V0XHJcblx0XHRcdFx0XHR0aGlzLnNldFRhc2soJ3dhbmRlcmluZycpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdC8vIGNhc2UgJ2lkbGUnOlxyXG5cdFx0XHRkZWZhdWx0OiBcdFx0XHRcdFx0Ly8gU3RhbmQgc3RpbGxcclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiB0aGlzLmdldFBhY2soKTtcclxuXHR9XHJcblx0XHJcblx0Z2V0UGFjaygpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGlkOiB0aGlzLmlkLFxyXG5cdFx0XHRuYW1lOiB0aGlzLm5hbWUsXHJcblx0XHRcdHNwcml0ZTogdGhpcy5zcHJpdGUsXHJcblx0XHRcdGRpcmVjdGlvbjogdGhpcy5kaXJlY3Rpb24sXHJcblx0XHRcdG1hcDogdGhpcy5tYXAsXHJcblx0XHRcdHg6IHRoaXMuc3RhcnRYLFxyXG5cdFx0XHR5OiB0aGlzLnN0YXJ0WSxcclxuXHRcdFx0ejogdGhpcy56LFxyXG5cdFx0XHRkZXN0aW5hdGlvblg6IHRoaXMuZGVzdGluYXRpb25YLFxyXG5cdFx0XHRkZXN0aW5hdGlvblk6IHRoaXMuZGVzdGluYXRpb25ZLFxyXG5cdFx0XHRsZXJwOiB0aGlzLmxlcnAsXHJcblx0XHRcdGlzUnVubmluZzogdGhpcy5pc1J1bm5pbmcsXHJcblx0XHRcdGlzQXR0YWNraW5nOiB0aGlzLmlzQXR0YWNraW5nLFxyXG5cdFx0XHRpc0RlYWQ6IHRoaXMuaXNEZWFkLFxyXG5cdFx0XHRpc1Zpc2libGU6IHRoaXMuaXNWaXNpYmxlXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0cmVtb3ZlKCkge1xyXG5cdFx0ZGVsZXRlIGdhbWUubWFwTGlzdFt0aGlzLm1hcF0uYm90c1t0aGlzLmlkXTtcclxuXHR9XHJcblx0XHJcblx0bW92ZShkaXJlY3Rpb24pIHtcclxuXHRcdGxldCBtb3ZlVGltZSA9IDI0O1xyXG5cdFx0aWYgKHRoaXMuaXNSdW5uaW5nKSB7XHJcblx0XHRcdG1vdmVUaW1lID0gMTc7XHJcblx0XHR9XHJcblx0XHRpZiAodGhpcy5tb3ZlVGltZXIgPiBtb3ZlVGltZSAmJiB0aGlzLmF0dGFja1RpbWVyID09PSAwKSB7XHJcblx0XHRcdHN1cGVyLm1vdmUoZGlyZWN0aW9uKTtcclxuXHRcdFx0dGhpcy5tb3ZlVGltZXIgPSAwO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHR0YWtlRGFtYWdlKGRhbWFnZSwgc291cmNlKSB7XHJcblx0XHRpZiAoc291cmNlIGluc3RhbmNlb2YgQWN0b3IpIHtcclxuXHRcdFx0dGhpcy5zZXRUYXNrKCdhdHRhY2tpbmcnLCBzb3VyY2UpO1xyXG5cdFx0fVxyXG5cdFx0c3VwZXIudGFrZURhbWFnZShkYW1hZ2UsIHNvdXJjZSk7XHJcblx0fVxyXG5cdFxyXG5cdHJlc3Bhd24oKSB7XHJcblx0XHRzdXBlci5yZXNwYXduKCk7XHJcblx0XHR0aGlzLnNldFRhc2soJ3dhbmRlcmluZycpO1xyXG5cdH1cclxuXHRcclxuXHRwaWNrVXAoKSB7XHJcblx0XHRzdXBlci5waWNrVXAoKTtcclxuXHRcdHRoaXMuY2hlY2tCZXN0RXF1aXBtZW50KCk7XHJcblx0fVxyXG5cdFxyXG5cdHNldFRhc2sodGFzaywgdGFyZ2V0KSB7XHJcblx0XHRzd2l0Y2ggKHRhc2spIHtcclxuXHRcdFx0Y2FzZSAnd2FuZGVyaW5nJzpcclxuXHRcdFx0XHR0aGlzLmxhemluZXNzID0gNztcclxuXHRcdFx0XHR0aGlzLnRhcmdldCA9IG51bGw7XHJcblx0XHRcdFx0dGhpcy50YXNrID0gdGFzaztcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ2ZvbGxvd2luZyc6XHJcblx0XHRcdFx0aWYgKHRhcmdldCA9PT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0dGhpcy5zZXRUYXNrKCd3YW5kZXJpbmcnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLmxhemluZXNzID0gMDtcclxuXHRcdFx0XHRcdHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xyXG5cdFx0XHRcdFx0dGhpcy50YXNrID0gdGFzaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdhdHRhY2tpbmcnOlxyXG5cdFx0XHRcdGlmICh0YXJnZXQgPT09IG51bGwpIHtcclxuXHRcdFx0XHRcdHRoaXMuc2V0VGFzaygnd2FuZGVyaW5nJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5sYXppbmVzcyA9IDA7XHJcblx0XHRcdFx0XHR0aGlzLnRhcmdldCA9IHRhcmdldDtcclxuXHRcdFx0XHRcdHRoaXMudGFzayA9IHRhc2s7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0ZGVmYXVsdDpcdC8vaWRsaW5nXHJcblx0XHRcdFx0dGhpcy5sYXppbmVzcyA9IDc7XHJcblx0XHRcdFx0dGhpcy50YXJnZXQgPSBudWxsO1xyXG5cdFx0XHRcdHRoaXMudGFzayA9ICdpZGxlJztcclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGNoZWNrQmVzdEVxdWlwbWVudCgpIHtcclxuXHRcdGZvciAobGV0IHNsb3QgPSAwOyBzbG90IDwgY29uZmlnLklOVkVOVE9SWV9TSVpFOyBzbG90KyspIHtcclxuXHRcdFx0bGV0IGl0ZW0gPSB0aGlzLmludmVudG9yeVtzbG90XTtcclxuXHRcdFx0aWYgKCFpdGVtKSB7XHJcblx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdHN3aXRjaCAoaXRlbS50eXBlKSB7XHJcblx0XHRcdFx0Y2FzZSAnd2VhcG9uJzpcclxuXHRcdFx0XHRcdGlmICh0aGlzLmludmVudG9yeVtjb25maWcuSU5WRU5UT1JZX1NJWkVdKSB7XHJcblx0XHRcdFx0XHRcdGlmIChpdGVtLmRhbWFnZUJvbnVzID4gdGhpcy5pbnZlbnRvcnlbY29uZmlnLklOVkVOVE9SWV9TSVpFXS5kYW1hZ2VCb251cykge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuZXF1aXBJdGVtKHNsb3QpO1xyXG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5lcXVpcEl0ZW0oc2xvdCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAnc2hpZWxkJzpcclxuXHRcdFx0XHRcdGlmICh0aGlzLmludmVudG9yeVtjb25maWcuSU5WRU5UT1JZX1NJWkUgKyAxXSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoaXRlbS5kZWZlbmNlQm9udXMgPiB0aGlzLmludmVudG9yeVtjb25maWcuSU5WRU5UT1JZX1NJWkUgKyAxXS5kZWZlbmNlQm9udXMpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmVxdWlwSXRlbShzbG90KTtcclxuXHRcdFx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZXF1aXBJdGVtKHNsb3QpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ2FybW91cic6XHJcblx0XHRcdFx0XHRpZiAodGhpcy5pbnZlbnRvcnlbY29uZmlnLklOVkVOVE9SWV9TSVpFICsgMl0pIHtcclxuXHRcdFx0XHRcdFx0aWYgKGl0ZW0uZGVmZW5jZUJvbnVzID4gdGhpcy5pbnZlbnRvcnlbY29uZmlnLklOVkVOVE9SWV9TSVpFICsgMl0uZGVmZW5jZUJvbnVzKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5lcXVpcEl0ZW0oc2xvdCk7XHJcblx0XHRcdFx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmVxdWlwSXRlbShzbG90KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdoZWxtZXQnOlxyXG5cdFx0XHRcdFx0aWYgKHRoaXMuaW52ZW50b3J5W2NvbmZpZy5JTlZFTlRPUllfU0laRSArIDNdKSB7XHJcblx0XHRcdFx0XHRcdGlmIChpdGVtLmRlZmVuY2VCb251cyA+IHRoaXMuaW52ZW50b3J5W2NvbmZpZy5JTlZFTlRPUllfU0laRSArIDNdLmRlZmVuY2VCb251cykge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuZXF1aXBJdGVtKHNsb3QpO1xyXG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5lcXVpcEl0ZW0oc2xvdCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAncmluZyc6XHJcblx0XHRcdFx0XHRpZiAodGhpcy5pbnZlbnRvcnlbY29uZmlnLklOVkVOVE9SWV9TSVpFICsgNF0pIHtcclxuXHRcdFx0XHRcdFx0aWYgKGl0ZW0uZGFtYWdlQm9udXMgPiB0aGlzLmludmVudG9yeVtjb25maWcuSU5WRU5UT1JZX1NJWkUgKyA0XS5kYW1hZ2VCb251cykge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuZXF1aXBJdGVtKHNsb3QpO1xyXG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5lcXVpcEl0ZW0oc2xvdCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn1cclxuIiwiaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9jb25maWcuanMnO1xyXG5cclxuLy8gQW4gRW50aXR5IGlzIGFueSBvYmplY3Qgd2hpY2ggY2FuIGFwcGVhciBvbiB0aGUgbWFwXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbnRpdHkge1xyXG5cdGNvbnN0cnVjdG9yKG1hcCwgeCwgeSwgc3ByaXRlID0gMCkge1xyXG5cdFx0dGhpcy5tYXAgPSBtYXA7XHJcblx0XHR0aGlzLnggPSB4O1xyXG5cdFx0dGhpcy55ID0geTtcclxuXHRcdGlmIChzcHJpdGUgPCAwKSBzcHJpdGUgPSAwO1xyXG5cdFx0dGhpcy5zcHJpdGUgPSBzcHJpdGU7XHJcblx0XHR0aGlzLmlzVmlzaWJsZSA9IHRydWU7XHJcblx0fVxyXG59IiwiaW1wb3J0IGRiIGZyb20gJy4uL2RiLmpzJztcclxuaW1wb3J0IGdhbWUgZnJvbSAnLi4vZ2FtZS5qcyc7XHJcbmltcG9ydCB1dGlsIGZyb20gJy4uL3V0aWwuanMnO1xyXG5pbXBvcnQgRW50aXR5IGZyb20gJy4vZW50aXR5LmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEl0ZW0gZXh0ZW5kcyBFbnRpdHkge1xyXG5cdGNvbnN0cnVjdG9yKGRhdGEpIHtcclxuXHRcdGlmICghZGF0YS5vd25lciB8fCBkYXRhLml0ZW1DbGFzcyA9PSBudWxsIHx8IGRhdGEuaWQgPT0gbnVsbCkgcmV0dXJuO1xyXG5cdFx0XHJcblx0XHRpZiAoZGF0YS5vd25lciA9PT0gJ3BsYXllcicpIHtcclxuXHRcdFx0aWYgKGRhdGEuc2xvdCA9PSBudWxsKSByZXR1cm47XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChkYXRhLm93bmVyID09PSAnYm90Jykge1xyXG5cdFx0XHRpZiAoZGF0YS5tYXBJZCA9PSBudWxsIHx8IGRhdGEuc2xvdCA9PSBudWxsKSByZXR1cm47XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChkYXRhLm93bmVyID09PSAnbWFwJykge1xyXG5cdFx0XHRpZiAoZGF0YS5tYXBJZCA9PSBudWxsIHx8IGRhdGEueCA9PSBudWxsIHx8IGRhdGEueSA9PSBudWxsKSByZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGRhdGEubWFwSWQgPT09IHVuZGVmaW5lZCkgZGF0YS5tYXBJZCA9IG51bGw7XHJcblx0XHRpZiAoZGF0YS54ID09PSB1bmRlZmluZWQpIGRhdGEueCA9IG51bGw7XHJcblx0XHRpZiAoZGF0YS55ID09PSB1bmRlZmluZWQpIGRhdGEueSA9IG51bGw7XHJcblx0XHRpZiAoZGF0YS5zbG90ID09PSB1bmRlZmluZWQpIGRhdGEuc2xvdCA9IG51bGw7XHJcblxyXG5cdFx0bGV0IGNsYXNzRGF0YSA9IGRiLmdldEl0ZW1EYXRhKGRhdGEuaXRlbUNsYXNzKTtcclxuXHRcdGlmIChkYXRhLm5hbWUgPT0gbnVsbCkgZGF0YS5uYW1lID0gY2xhc3NEYXRhLm5hbWU7XHJcblx0XHRpZiAoZGF0YS50eXBlID09IG51bGwpIGRhdGEudHlwZSA9IGNsYXNzRGF0YS50eXBlO1xyXG5cdFx0aWYgKGRhdGEuc3ByaXRlID09IG51bGwpIGRhdGEuc3ByaXRlID0gY2xhc3NEYXRhLnNwcml0ZTtcclxuXHRcdGlmIChkYXRhLnJldXNhYmxlID09IG51bGwpIGRhdGEucmV1c2FibGUgPSBjbGFzc0RhdGEucmV1c2FibGU7XHJcblx0XHRpZiAoZGF0YS5kYW1hZ2VCb251cyA9PSBudWxsKSBkYXRhLmRhbWFnZUJvbnVzID0gY2xhc3NEYXRhLmRhbWFnZUJvbnVzO1xyXG5cdFx0aWYgKGRhdGEuZGVmZW5jZUJvbnVzID09IG51bGwpIGRhdGEuZGVmZW5jZUJvbnVzID0gY2xhc3NEYXRhLmRlZmVuY2VCb251cztcclxuXHRcdGlmIChkYXRhLmhlYWx0aE1heEJvbnVzID09IG51bGwpIGRhdGEuaGVhbHRoTWF4Qm9udXMgPSBjbGFzc0RhdGEuaGVhbHRoTWF4Qm9udXM7XHJcblx0XHRpZiAoZGF0YS5lbmVyZ3lNYXhCb251cyA9PSBudWxsKSBkYXRhLmVuZXJneU1heEJvbnVzID0gY2xhc3NEYXRhLmVuZXJneU1heEJvbnVzO1xyXG5cdFx0aWYgKGRhdGEucmFuZ2VCb251cyA9PSBudWxsKSBkYXRhLnJhbmdlQm9udXMgPSBjbGFzc0RhdGEucmFuZ2VCb251cztcclxuXHRcdGlmIChkYXRhLnN0YWNrID09IG51bGwpIGRhdGEuc3RhY2sgPSBjbGFzc0RhdGEuc3RhY2s7XHJcblxyXG5cdFx0c3VwZXIoZGF0YS5tYXBJZCwgZGF0YS54LCBkYXRhLnksIGRhdGEuc3ByaXRlKTtcclxuXHRcdHRoaXMub3duZXIgPSBkYXRhLm93bmVyO1xyXG5cdFx0dGhpcy5pZCA9IGRhdGEuaWQ7XHJcblx0XHR0aGlzLml0ZW1DbGFzcyA9IGRhdGEuaXRlbUNsYXNzO1xyXG5cdFx0dGhpcy5zdGFjayA9IGRhdGEuc3RhY2s7XHJcblx0XHR0aGlzLnNsb3QgPSBkYXRhLnNsb3Q7XHJcblx0XHRcclxuXHRcdHRoaXMubmFtZSA9IGRhdGEubmFtZTtcclxuXHRcdHRoaXMudHlwZSA9IGRhdGEudHlwZTtcclxuXHRcdHRoaXMucmV1c2FibGUgPSBkYXRhLnJldXNhYmxlO1xyXG5cdFx0dGhpcy5kYW1hZ2VCb251cyA9IGRhdGEuZGFtYWdlQm9udXM7XHJcblx0XHR0aGlzLmRlZmVuY2VCb251cyA9IGRhdGEuZGVmZW5jZUJvbnVzO1xyXG5cdFx0dGhpcy5oZWFsdGhNYXhCb251cyA9IGRhdGEuaGVhbHRoTWF4Qm9udXM7XHJcblx0XHR0aGlzLmVuZXJneU1heEJvbnVzID0gZGF0YS5lbmVyZ3lNYXhCb251cztcclxuXHRcdHRoaXMucmFuZ2VCb251cyA9IGRhdGEucmFuZ2VCb251cztcclxuXHRcdFxyXG5cdFx0dGhpcy5jbGlja2VkID0gZmFsc2U7XHJcblx0XHR0aGlzLmNsaWNrVGltZSA9IDA7XHJcblxyXG5cdFx0aWYgKGRhdGEub3duZXIgPT09ICdtYXAnKSB7XHJcblx0XHRcdGdhbWUubWFwTGlzdFt0aGlzLm1hcF0uaXRlbXNbdGhpcy5pZF0gPSB0aGlzO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoZGF0YS5vd25lciA9PT0gJ3BsYXllcicpIHtcclxuXHRcdFx0Z2FtZS5wbGF5ZXJMaXN0W3RoaXMuaWRdLmludmVudG9yeVt0aGlzLnNsb3RdID0gdGhpcztcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKGRhdGEub3duZXIgPT09ICdib3QnKSB7XHJcblx0XHRcdGdhbWUubWFwTGlzdFt0aGlzLm1hcF0uYm90c1t0aGlzLmlkXS5pbnZlbnRvcnlbdGhpcy5zbG90XSA9IHRoaXM7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHVwZGF0ZShkZWx0YSkge1xyXG5cdFx0cmV0dXJuIHRoaXMuZ2V0UGFjaygpO1xyXG5cdH1cclxuXHJcblx0Z2V0UGFjaygpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGlkOiB0aGlzLmlkLFxyXG5cdFx0XHRtYXA6IHRoaXMubWFwLFxyXG5cdFx0XHR4OiB0aGlzLngsXHJcblx0XHRcdHk6IHRoaXMueSxcclxuXHRcdFx0c2xvdDogdGhpcy5zbG90LFxyXG5cdFx0XHRpdGVtQ2xhc3M6IHRoaXMuaXRlbUNsYXNzLFxyXG5cdFx0XHRzdGFjazogdGhpcy5zdGFjayxcclxuXHRcdFx0bmFtZTogdGhpcy5uYW1lLFxyXG5cdFx0XHRzcHJpdGU6IHRoaXMuc3ByaXRlLFxyXG5cdFx0XHR0eXBlOiB0aGlzLnR5cGUsXHJcblx0XHRcdHJldXNhYmxlOiB0aGlzLnJldXNhYmxlLFxyXG5cdFx0XHRkYW1hZ2VCb251czogdGhpcy5kYW1hZ2VCb251cyxcclxuXHRcdFx0ZGVmZW5jZUJvbnVzOiB0aGlzLmRlZmVuY2VCb251cyxcclxuXHRcdFx0aGVhbHRoTWF4Qm9udXM6IHRoaXMuaGVhbHRoTWF4Qm9udXMsXHJcblx0XHRcdGVuZXJneU1heEJvbnVzOiB0aGlzLmVuZXJneU1heEJvbnVzLFxyXG5cdFx0XHRyYW5nZUJvbnVzOiB0aGlzLnJhbmdlQm9udXMsXHJcblx0XHRcdGlzVmlzaWJsZTogdGhpcy5pc1Zpc2libGVcclxuXHRcdH07XHJcblx0fVxyXG5cdFxyXG5cdHJlbW92ZSgpIHtcclxuXHRcdGlmICh0aGlzLm93bmVyID09PSAncGxheWVyJykge1xyXG5cdFx0XHRkZWxldGUgZ2FtZS5wbGF5ZXJMaXN0W3RoaXMuaWRdLmludmVudG9yeVt0aGlzLnNsb3RdO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAodGhpcy5vd25lciA9PT0gJ21hcCcpIHtcclxuXHRcdFx0ZGVsZXRlIGdhbWUubWFwTGlzdFt0aGlzLm1hcF0uaXRlbXNbdGhpcy5pZF07XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmICh0aGlzLm93bmVyID09PSAnYm90Jykge1xyXG5cdFx0XHRkZWxldGUgZ2FtZS5tYXBMaXN0W3RoaXMubWFwXS5ib3RzW3RoaXMuaWRdLmludmVudG9yeVt0aGlzLnNsb3RdO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRpc0VxdWlwbWVudCgpIHtcclxuXHRcdGlmICh0aGlzLnR5cGUgPT09ICd3ZWFwb24nIHx8IHRoaXMudHlwZSA9PT0gJ3NoaWVsZCcgfHwgdGhpcy50eXBlID09PSAnYXJtb3VyJyB8fCB0aGlzLnR5cGUgPT09ICdoZWxtZXQnIHx8IHRoaXMudHlwZSA9PT0gJ3JpbmcnKSB7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGNhbkVxdWlwKHNsb3QpIHtcclxuXHRcdGlmIChzbG90ID09PSBjb25maWcuSU5WRU5UT1JZX1NJWkUpIHtcclxuXHRcdFx0aWYgKHRoaXMudHlwZSA9PT0gJ3dlYXBvbicpIHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoc2xvdCA9PT0gY29uZmlnLklOVkVOVE9SWV9TSVpFICsgMSkge1xyXG5cdFx0XHRpZiAodGhpcy50eXBlID09PSAnc2hpZWxkJykgcmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChzbG90ID09PSBjb25maWcuSU5WRU5UT1JZX1NJWkUgKyAyKSB7XHJcblx0XHRcdGlmICh0aGlzLnR5cGUgPT09ICdhcm1vdXInKSByZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKHNsb3QgPT09IGNvbmZpZy5JTlZFTlRPUllfU0laRSArIDMpIHtcclxuXHRcdFx0aWYgKHRoaXMudHlwZSA9PT0gJ2hlbG1ldCcpIHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoc2xvdCA9PT0gY29uZmlnLklOVkVOVE9SWV9TSVpFICsgNCkge1xyXG5cdFx0XHRpZiAodGhpcy50eXBlID09PSAncmluZycpIHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblxyXG5cdG1vdmVUb1BsYXllcihpZCwgc2xvdCkge1xyXG5cdFx0aWYgKGlkID09IG51bGwgfHwgc2xvdCA9PSBudWxsKSByZXR1cm47XHJcblxyXG5cdFx0dGhpcy5yZW1vdmUoKTtcclxuXHRcdHRoaXMub3duZXIgPSAncGxheWVyJztcclxuXHRcdHRoaXMuaWQgPSBpZDtcclxuXHRcdHRoaXMuc2xvdCA9IHNsb3Q7XHJcblx0XHRnYW1lLnBsYXllckxpc3RbaWRdLmludmVudG9yeVtzbG90XSA9IHRoaXM7XHJcblx0fVxyXG5cclxuXHRtb3ZlVG9NYXAobWFwSWQsIHgsIHkpIHtcclxuXHRcdGlmIChtYXBJZCA9PSBudWxsIHx8IHggPT0gbnVsbCB8fCB5ID09IG51bGwpIHJldHVybjtcclxuXHJcblx0XHR0aGlzLnJlbW92ZSgpO1xyXG5cdFx0dGhpcy5vd25lciA9ICdtYXAnO1xyXG5cdFx0dGhpcy5tYXAgPSBtYXBJZDtcclxuXHRcdHRoaXMuaWQgPSB1dGlsLmZpcnN0RW1wdHlJbmRleChnYW1lLm1hcExpc3RbbWFwSWRdLml0ZW1zKTtcclxuXHRcdHRoaXMueCA9IHg7XHJcblx0XHR0aGlzLnkgPSB5O1xyXG5cdFx0Z2FtZS5tYXBMaXN0W21hcElkXS5pdGVtc1tpZF0gPSB0aGlzO1xyXG5cdH1cclxuXHJcblx0bW92ZVRvQm90KG1hcElkLCBpZCwgc2xvdCkge1xyXG5cdFx0aWYgKG1hcElkID09IG51bGwgfHwgaWQgPT0gbnVsbCB8fCBzbG90ID09IG51bGwpIHJldHVybjtcclxuXHJcblx0XHR0aGlzLnJlbW92ZSgpO1xyXG5cdFx0dGhpcy5vd25lciA9ICdib3QnO1xyXG5cdFx0dGhpcy5tYXAgPSBtYXBJZDtcclxuXHRcdHRoaXMuaWQgPSBpZDtcclxuXHRcdHRoaXMuc2xvdCA9IHNsb3Q7XHJcblx0XHRnYW1lLm1hcExpc3RbbWFwSWRdLmJvdHNbaWRdLmludmVudG9yeVtzbG90XSA9IHRoaXM7XHJcblx0fVxyXG59XHJcbiIsImltcG9ydCBjb25maWcgZnJvbSAnLi4vY29uZmlnLmpzJztcclxuaW1wb3J0IHV0aWwgZnJvbSAnLi4vdXRpbC5qcyc7XHJcbmltcG9ydCBUaWxlIGZyb20gJy4vdGlsZS5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXAge1xyXG5cdGNvbnN0cnVjdG9yKGlkLCBkYXRhKSB7XHJcblx0XHR0aGlzLmlkID0gaWQ7XHJcblxyXG5cdFx0dGhpcy5uYW1lID0gZGF0YS5uYW1lO1xyXG5cdFx0dGhpcy5kcm9wQ2hhbmNlID0gdXRpbC5jbGFtcChkYXRhLmRyb3BDaGFuY2UsIDAsIDEwMCk7XHJcblx0XHQvL3RoaXMuZHJvcENoYW5jZSA9IDAgPSAwJSBjaGFuY2UgdG8gZHJvcCBpdGVtcyBpbiBpbnZlbnRvcnkgKGRyb3Agbm90aGluZyksIDEwMCA9IDEwMCUgY2hhbmNlIHRvIGRyb3AgKGRyb3AgZXZlcnl0aGluZylcclxuXHRcdHRoaXMuZHJvcEFtb3VudEVRID0gdXRpbC5jbGFtcChkYXRhLmRyb3BBbW91bnRFUSwgMCwgY29uZmlnLkVRVUlQTUVOVF9TSVpFKTtcclxuXHRcdC8vdGhpcy5kcm9wQW1vdW50RVEgPSBudW1iZXIgb2YgZXF1aXBwZWQgaXRlbXMgdGhlIHBsYXllciB3aWxsIGRyb3Agb24gZGVhdGguIGRyb3BFUSA9IEVRVUlQTUVOVF9TSVpFID0gZHJvcCBhbGwgZXF1aXBtZW50XHJcblx0XHRcclxuXHRcdHRoaXMuaXRlbXMgPSBkYXRhLml0ZW1zO1xyXG5cdFx0dGhpcy5ib3RzID0gZGF0YS5ib3RzO1xyXG5cdFx0dGhpcy5lZmZlY3RzID0gZGF0YS5lZmZlY3RzO1xyXG5cdFx0dGhpcy50ZXh0cyA9IGRhdGEudGV4dHM7XHJcblx0XHRcclxuXHRcdHRoaXMudGlsZXMgPSBbXTtcclxuXHRcdGZvciAobGV0IHkgPSAwOyB5IDwgY29uZmlnLk1BUF9DT0xVTU5TOyB5KyspIHtcclxuXHRcdFx0dGhpcy50aWxlc1t5XSA9IFtdO1xyXG5cdFx0XHRmb3IgKGxldCB4ID0gMDsgeCA8IGNvbmZpZy5NQVBfUk9XUzsgeCsrKSB7XHJcblx0XHRcdFx0bGV0IHRpbGVEYXRhID0gdGhpcy5nZXRUaWxlRGF0YShkYXRhLCAoeSAqIGNvbmZpZy5NQVBfQ09MVU1OUykgKyB4KTtcclxuXHRcdFx0XHR0aGlzLnRpbGVzW3ldW3hdID0gbmV3IFRpbGUodGlsZURhdGEpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHVwbG9hZCgpIHtcclxuXHRcdGdhbWUubWFwRGF0YVt0aGlzLmlkXSA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKCcuL3NlcnZlci9kYXRhL21hcC5qc29uJywgJ3V0ZjgnKSlbdGhpcy5pZF07XHJcblx0XHRmb3IgKGxldCB5ID0gMDsgeSA8IGNvbmZpZy5NQVBfUk9XUzsgeSsrKSB7XHJcblx0XHRcdGZvciAobGV0IHggPSAwOyB4IDwgY29uZmlnLk1BUF9DT0xVTU5TOyB4KyspIHtcclxuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGNvbmZpZy5NQVBfTEFZRVJTOyBpKyspIHtcclxuXHRcdFx0XHRcdHRoaXMudGlsZXNbeV1beF0ubGF5ZXJbaV0gPSBnYW1lLm1hcERhdGFbdGhpcy5pZF0udGlsZXNbaV1bKHkgKiBjb25maWcuTUFQX0NPTFVNTlMpICsgeF07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRnYW1lLnBsYXllckxpc3QuZm9yRWFjaCgocGxheWVyKSA9PiB7XHJcblx0XHRcdGlmIChwbGF5ZXIubWFwID09PSB0aGlzLmlkKSB7XHJcblx0XHRcdFx0cGxheWVyLmxvYWRNYXAoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cdFxyXG5cdHVwZGF0ZShkZWx0YSkge1xyXG5cdFx0bGV0IHBhY2sgPSB7XHJcblx0XHRcdG5hbWU6IHRoaXMubmFtZSxcclxuXHRcdFx0aXRlbXM6IFtdLFxyXG5cdFx0XHRib3RzOiBbXSxcclxuXHRcdFx0ZWZmZWN0czogW10sXHJcblx0XHRcdHRleHRzOiBbXVxyXG5cdFx0fTtcclxuXHRcdFxyXG5cdFx0dGhpcy5pdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XHJcblx0XHRcdHBhY2suaXRlbXNbaXRlbS5pZF0gPSBpdGVtLnVwZGF0ZShkZWx0YSk7XHJcblx0XHR9KTtcclxuXHRcdHRoaXMuYm90cy5mb3JFYWNoKChib3QpID0+IHtcclxuXHRcdFx0cGFjay5ib3RzW2JvdC5pZF0gPSBib3QudXBkYXRlKGRlbHRhKTtcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5lZmZlY3RzLmZvckVhY2goKGVmZmVjdCkgPT4ge1xyXG5cdFx0XHRwYWNrLmVmZmVjdHNbZWZmZWN0LmlkXSA9IGVmZmVjdC51cGRhdGUoZGVsdGEpO1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLnRleHRzLmZvckVhY2goKHRleHQpID0+IHtcclxuXHRcdFx0cGFjay50ZXh0c1t0ZXh0LmlkXSA9IHRleHQudXBkYXRlKGRlbHRhKTtcclxuXHRcdH0pO1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gcGFjaztcclxuXHR9XHJcblx0XHJcblx0Z2V0UGFjaygpIHtcclxuXHRcdGxldCBtYXBQYWNrID0ge1xyXG5cdFx0XHRuYW1lOiB0aGlzLm5hbWUsXHJcblx0XHRcdHRpbGVzOiB0aGlzLmdldFRpbGVQYWNrKCksXHJcblx0XHRcdGl0ZW1zOiBbXSxcclxuXHRcdFx0Ym90czogW10sXHJcblx0XHRcdGVmZmVjdHM6IFtdLFxyXG5cdFx0XHR0ZXh0czogW11cclxuXHRcdH07XHJcblxyXG5cdFx0dGhpcy5pdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XHJcblx0XHRcdG1hcFBhY2suaXRlbXNbaXRlbS5pZF0gPSBpdGVtLmdldFBhY2soKTtcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5ib3RzLmZvckVhY2goKGJvdCkgPT4ge1xyXG5cdFx0XHRtYXBQYWNrLmJvdHNbYm90LmlkXSA9IGJvdC5nZXRQYWNrKCk7XHJcblx0XHR9KTtcclxuXHRcdHRoaXMuZWZmZWN0cy5mb3JFYWNoKChlZmZlY3QpID0+IHtcclxuXHRcdFx0bWFwUGFjay5lZmZlY3RzW2VmZmVjdC5pZF0gPSBlZmZlY3QuZ2V0UGFjaygpO1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLnRleHRzLmZvckVhY2goKHRleHQpID0+IHtcclxuXHRcdFx0bWFwUGFjay50ZXh0c1t0ZXh0LmlkXSA9IHRleHQuZ2V0UGFjaygpO1xyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcdHJldHVybiBtYXBQYWNrO1xyXG5cdH1cclxuXHRcclxuXHRnZXRUaWxlUGFjaygpIHtcclxuXHRcdGxldCB0aWxlUGFjayA9IFtdO1xyXG5cclxuXHRcdGZvciAobGV0IHkgPSAwOyB5IDwgY29uZmlnLk1BUF9ST1dTOyB5KyspIHtcclxuXHRcdFx0dGlsZVBhY2tbeV0gPSBbXTtcclxuXHRcdFx0Zm9yIChsZXQgeCA9IDA7IHggPCBjb25maWcuTUFQX0NPTFVNTlM7IHgrKykge1xyXG5cdFx0XHRcdHRpbGVQYWNrW3ldW3hdID0gdGhpcy50aWxlc1t5XVt4XS5nZXRQYWNrKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGlsZVBhY2s7XHJcblx0fVxyXG5cclxuXHRnZXRUaWxlRGF0YShkYXRhLCBpbmRleCA9IDApIHtcclxuXHRcdGlmICghZGF0YSkgcmV0dXJuO1xyXG5cclxuXHRcdGxldCB0aWxlRGF0YSA9IHtcclxuXHRcdFx0bGF5ZXI6IFtdLFxyXG5cdFx0XHR3YWxsOiBkYXRhLnRpbGVzLndhbGxbaW5kZXhdLFxyXG5cdFx0XHQvL2NhbkF0dGFjazogZGF0YS5jYW5BdHRhY2tbaW5kZXhdLFxyXG5cdFx0XHQvL2RhbWFnZTogZGF0YS5kYW1hZ2VbaW5kZXhdLFxyXG5cdFx0XHQvL2RlZmVuY2U6IGRhdGEuZGVmZW5jZVtpbmRleF0sXHJcblx0XHRcdC8vaGVhbHRoTWF4OiBkYXRhLmhlYWx0aE1heFtpbmRleF0sXHJcblx0XHRcdC8vd2FycE1hcDogZGF0YS53YXJwTWFwW2luZGV4XSxcclxuXHRcdFx0Ly93YXJwWDogZGF0YS53YXJwWFtpbmRleF0sXHJcblx0XHRcdC8vd2FycFk6IGRhdGEud2FycFlbaW5kZXhdXHJcblx0XHR9O1xyXG5cclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY29uZmlnLk1BUF9MQVlFUlM7IGkrKykge1xyXG5cdFx0XHR0aWxlRGF0YS5sYXllcltpXSA9IGRhdGEudGlsZXMubGF5ZXJbaV1baW5kZXhdO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0aWxlRGF0YTtcclxuXHR9O1xyXG59IiwiaW1wb3J0IGRiIGZyb20gJy4uL2RiLmpzJztcclxuaW1wb3J0IGdhbWUgZnJvbSAnLi4vZ2FtZS5qcyc7XHJcbmltcG9ydCBBY3RvciBmcm9tICcuL2FjdG9yLmpzJztcclxuXHJcbi8vIEEgUGxheWVyIGlzIGFuIEFjdG9yIHdoaWNoIHRha2VzIGlucHV0IGZyb20gYSBjbGllbnRcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXllciBleHRlbmRzIEFjdG9yIHtcclxuXHRjb25zdHJ1Y3RvcihpZCkge1xyXG5cdFx0bGV0IGRhdGEgPSBkYi5nZXRQbGF5ZXJEYXRhKGlkKTtcclxuXHJcblx0XHRzdXBlcihkYXRhLm1hcCwgZGF0YS54LCBkYXRhLnksIGRhdGEubmFtZSwgZGF0YS5zcHJpdGUpO1xyXG5cdFx0dGhpcy5jb250cm9sbGVyID0gJ3BsYXllcic7XHJcblx0XHR0aGlzLmlkID0gaWQ7XHJcblx0XHR0aGlzLmFkbWluQWNjZXNzID0gZGF0YS5hZG1pbkFjY2VzcztcclxuXHJcblx0XHR0aGlzLmRhbWFnZUJhc2UgPSBkYXRhLmRhbWFnZUJhc2U7XHRcdFx0XHQvLyBtaW5pbXVtIGRhbWFnZSBhIHBsYXllciBjYW4gaGF2ZVxyXG5cdFx0dGhpcy5kZWZlbmNlQmFzZSA9IGRhdGEuZGVmZW5jZUJhc2U7XHRcdFx0Ly8gbWluaW11bSBkZWZlbmNlIGEgcGxheWVyIGNhbiBoYXZlXHJcblx0XHR0aGlzLmhlYWx0aE1heEJhc2UgPSBkYXRhLmhlYWx0aE1heEJhc2U7XHQvLyBtYXggaGVhbHRoIHdpdGhvdXQgYm9udXNlc1xyXG5cdFx0dGhpcy5lbmVyZ3lNYXhCYXNlID0gZGF0YS5lbmVyZ3lNYXhCYXNlO1x0Ly8gbWF4IGVuZXJneSB3aXRob3V0IGJvbnVzZXNcclxuXHRcdHRoaXMuY2FsY1N0YXRzKCk7XHJcblx0XHR0aGlzLnJlc3RvcmUoKTtcclxuXHJcblx0XHR0aGlzLnNlbGVjdGVkID0gbnVsbDtcclxuXHRcdHRoaXMuaW5wdXQgPSB7XHJcblx0XHRcdGRpcmVjdGlvbjogbnVsbCxcclxuXHRcdFx0cnVuOiBmYWxzZSxcclxuXHRcdFx0cGlja3VwOiBmYWxzZSxcclxuXHRcdFx0YXR0YWNrOiBmYWxzZVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0bG9hZE1hcCgpIHtcclxuXHRcdFxyXG5cdH1cclxuXHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHRzdXBlci51cGRhdGUoZGVsdGEpO1x0XHQvLyBEZWZhdWx0IEFjdG9yIFVwZGF0ZVxyXG5cdFx0XHJcblx0XHRpZiAoIXRoaXMuaXNEZWFkKSB7XHJcblx0XHRcdC8vIENoZWNrIGZvciBBdGFjayBJbnB1dFxyXG5cdFx0XHRpZiAodGhpcy5pbnB1dC5hdHRhY2sgJiYgdGhpcy5hdHRhY2tUaW1lciA9PT0gMCkge1xyXG5cdFx0XHRcdHRoaXMuYXR0YWNrKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdC8vIENoZWNrIGZvciBNb3ZlbWVudCBJbnB1dFxyXG5cdFx0XHRpZiAoIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5pbnB1dC5kaXJlY3Rpb24pIHtcclxuXHRcdFx0XHRcdC8vIENoZWNrIGZvciBSdW4gSW5wdXRcclxuXHRcdFx0XHRcdGlmICh0aGlzLmlucHV0LnJ1bikge1xyXG5cdFx0XHRcdFx0XHRpZiAodGhpcy5lbmVyZ3kgPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5pc1J1bm5pbmcgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuaXNSdW5uaW5nID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmlzUnVubmluZyA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKHRoaXMuaW5wdXQuZGlyZWN0aW9uKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIHRoaXMuZ2V0UGFjaygpO1xyXG5cdH1cclxuXHRcclxuXHRnZXRQYWNrKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0aWQ6IHRoaXMuaWQsXHJcblx0XHRcdG5hbWU6IHRoaXMubmFtZSxcclxuXHRcdFx0c3ByaXRlOiB0aGlzLnNwcml0ZSxcclxuXHRcdFx0ZGlyZWN0aW9uOiB0aGlzLmRpcmVjdGlvbixcclxuXHRcdFx0bWFwOiB0aGlzLm1hcCxcclxuXHRcdFx0eDogdGhpcy5zdGFydFgsXHJcblx0XHRcdHk6IHRoaXMuc3RhcnRZLFxyXG5cdFx0XHR6OiB0aGlzLnosXHJcblx0XHRcdGRlc3RpbmF0aW9uWDogdGhpcy5kZXN0aW5hdGlvblgsXHJcblx0XHRcdGRlc3RpbmF0aW9uWTogdGhpcy5kZXN0aW5hdGlvblksXHJcblx0XHRcdGxlcnA6IHRoaXMubGVycCxcclxuXHRcdFx0aXNSdW5uaW5nOiB0aGlzLmlzUnVubmluZyxcclxuXHRcdFx0aXNBdHRhY2tpbmc6IHRoaXMuaXNBdHRhY2tpbmcsXHJcblx0XHRcdGlzRGVhZDogdGhpcy5pc0RlYWQsXHJcblx0XHRcdGlzVmlzaWJsZTogdGhpcy5pc1Zpc2libGVcclxuXHRcdH07XHJcblx0fVxyXG5cdFxyXG5cdGdldFByaXZhdGVQYWNrKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0aWQ6IHRoaXMuaWQsXHJcblx0XHRcdGhlYWx0aDogdGhpcy5oZWFsdGgsXHJcblx0XHRcdGhlYWx0aE1heDogdGhpcy5oZWFsdGhNYXgsXHJcblx0XHRcdGVuZXJneTogdGhpcy5lbmVyZ3ksXHJcblx0XHRcdGVuZXJneU1heDogdGhpcy5lbmVyZ3lNYXgsXHJcblx0XHRcdG1vdmVTcGVlZDogdGhpcy5tb3ZlU3BlZWQsXHJcblx0XHRcdGF0dGFja1NwZWVkOiB0aGlzLmF0dGFja1NwZWVkLFxyXG5cdFx0XHRhdHRhY2tUaW1lcjogdGhpcy5hdHRhY2tUaW1lcixcclxuXHRcdFx0aW52ZW50b3J5OiB0aGlzLmdldEludmVudG9yeVBhY2soKVxyXG5cdFx0fTtcclxuXHR9XHJcblx0XHJcblx0Y2hlY2tBZG1pbihhY2Nlc3MgPSAxKSB7XHJcblx0XHRpZiAoYWNjZXNzIDwgMSkgYWNjZXNzID0gMTtcclxuXHRcdHJldHVybiAodGhpcy5hZG1pbkFjY2VzcyA+PSBhY2Nlc3MpO1xyXG5cdH1cclxuXHJcblx0b25JbnB1dChkYXRhKSB7XHJcblx0XHRzd2l0Y2ggKGRhdGEuaW5wdXQpIHtcclxuXHRcdFx0Y2FzZSBudWxsOlxyXG5cdFx0XHRjYXNlICdtb3ZlJzogdGhpcy5pbnB1dC5kaXJlY3Rpb24gPSBkYXRhLmRpcmVjdGlvbjtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ3J1bic6IHRoaXMuaW5wdXQucnVuID0gZGF0YS5zdGF0ZTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ3BpY2t1cCc6XHJcblx0XHRcdFx0aWYgKCF0aGlzLmlucHV0LnBpY2t1cCAmJiBkYXRhLnN0YXRlKSB7XHJcblx0XHRcdFx0XHR0aGlzLnBpY2tVcCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLmlucHV0LnBpY2t1cCA9IGRhdGEuc3RhdGU7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdhdHRhY2snOlxyXG5cdFx0XHRcdHRoaXMuaW5wdXQuYXR0YWNrID0gZGF0YS5zdGF0ZTtcclxuXHRcdFx0XHR0aGlzLmF0dGFjaygxLCB0aGlzLmRpcmVjdGlvbik7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdkb3VibGVDbGlja0l0ZW0nOlxyXG5cdFx0XHRcdGlmICh0aGlzLmludmVudG9yeVtkYXRhLnNsb3RdKSB7XHJcblx0XHRcdFx0XHRpZiAoIXRoaXMuaXNEZWFkKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMudXNlSXRlbShkYXRhLnNsb3QpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ3JpZ2h0Q2xpY2tJdGVtJzpcclxuXHRcdFx0XHRpZiAodGhpcy5pbnZlbnRvcnlbZGF0YS5zbG90XSkge1xyXG5cdFx0XHRcdFx0aWYgKCF0aGlzLmlzRGVhZCkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRyb3BJdGVtKGRhdGEuc2xvdCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnZHJhZ1N0b3BHYW1lJzpcclxuXHRcdFx0XHRpZiAodGhpcy5pbnZlbnRvcnlbZGF0YS5zbG90XSkge1xyXG5cdFx0XHRcdFx0aWYgKCF0aGlzLmlzRGVhZCkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRyb3BJdGVtKGRhdGEuc2xvdCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnZHJhZ1N0b3BJbnZlbnRvcnknOlxyXG5cdFx0XHRjYXNlICdkcmFnU3RvcEVxdWlwbWVudCc6XHJcblx0XHRcdFx0aWYgKHRoaXMuaW52ZW50b3J5W2RhdGEuc2xvdF0pIHtcclxuXHRcdFx0XHRcdGlmICghdGhpcy5pc0RlYWQpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5tb3ZlSXRlbVRvU2xvdChkYXRhLnNsb3QsIGRhdGEubmV3U2xvdCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnc2VydmVyQ2hhdCc6IGdhbWUuc2VuZFNlcnZlck1lc3NhZ2UoYCR7dGhpcy5uYW1lfSB5ZWxscywgXCIke2RhdGEubWVzc2FnZX1cImApO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnbWFwQ2hhdCc6IGdhbWUuc2VuZE1hcE1lc3NhZ2UodGhpcy5tYXAsIGAke3RoaXMubmFtZX0gc2F5cywgXCIke2RhdGEubWVzc2FnZX1cImApO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAncGxheWVyQ2hhdCc6XHJcblx0XHRcdFx0bGV0IHRhcmdldCA9IHRoaXMucGxheWVyTGlzdFtkYXRhLnRhcmdldElkXTtcclxuXHRcdFx0XHRpZiAodGFyZ2V0KSB7XHJcblx0XHRcdFx0XHRnYW1lLnNlbmRQbGF5ZXJNZXNzYWdlKHRhcmdldC5pZCwgYCR7dGhpcy5uYW1lfSB3aGlzcGVycywgXCIke2RhdGEubWVzc2FnZX1cImApO1xyXG5cdFx0XHRcdFx0Z2FtZS5zZW5kUGxheWVyTWVzc2FnZSh0aGlzLmlkLCBgWW91IHdoaXNwZXIgdG8gJHt0YXJnZXQubmFtZX0sIFwiJHtkYXRhLm1lc3NhZ2V9XCJgKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0Ly8gR29kIElucHV0c1xyXG5cdFx0XHRjYXNlICdzcGF3bkl0ZW0nOlxyXG5cdFx0XHRcdGlmICh0aGlzLmNoZWNrQWRtaW4oMikpIHtcclxuXHRcdFx0XHRcdGdhbWUuc3Bhd25NYXBJdGVtKGRhdGEubWFwSWQsIGRhdGEueCwgZGF0YS55LCBkYXRhLnR5cGUsIGRhdGEuc3RhY2spO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdGdhbWUuc2VuZFBsYXllck1lc3NhZ2UodGhpcy5pZCwgYFlvdSBkb24ndCBoYXZlIGFjY2VzcyB0byB0aGF0IGNvbW1hbmQuYCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAndXBsb2FkTWFwJzpcclxuXHRcdFx0XHRpZiAodGhpcy5jaGVja0FkbWluKDIpKSB7XHJcblx0XHRcdFx0XHRnYW1lLm1hcExpc3RbZGF0YS5tYXBJZF0udXBsb2FkKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0Z2FtZS5zZW5kUGxheWVyTWVzc2FnZSh0aGlzLmlkLCBgWW91IGRvbid0IGhhdmUgYWNjZXNzIHRvIHRoYXQgY29tbWFuZC5gKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbGUge1xyXG5cdGNvbnN0cnVjdG9yKGRhdGEpIHtcclxuXHRcdHRoaXMubGF5ZXIgPSBkYXRhLmxheWVyO1xyXG4gICAgdGhpcy53YWxsID0gZGF0YS53YWxsO1xyXG4gICAgdGhpcy5jYW5BdHRhY2sgPSBkYXRhLmNhbkF0dGFjaztcclxuICAgIHRoaXMuZGFtYWdlID0gZGF0YS5kYW1hZ2U7XHJcblx0XHR0aGlzLmRlZmVuY2UgPSBkYXRhLmRlZmVuY2U7XHJcblx0XHR0aGlzLmhlYWx0aE1heCA9IGRhdGEuaGVhbHRoTWF4O1xyXG5cdFx0dGhpcy5oZWFsdGggPSB0aGlzLmhlYWx0aE1heDtcclxuXHJcblx0XHR0aGlzLndhcnBNYXAgPSBkYXRhLndhcnBNYXA7XHJcblx0XHR0aGlzLndhcnBYID0gZGF0YS53YXJwWDtcclxuXHRcdHRoaXMud2FycFkgPSBkYXRhLndhcnBZO1xyXG4gIH1cclxuXHJcblx0b25XYWxrKCkge1xyXG5cdFx0Ly8gUnVuIE1hcFdhbGsjX3hfeSBzY3JpcHRcclxuICB9XHJcbiAgXHJcblx0b25DbGljaygpIHtcclxuXHRcdC8vIFJ1biBNYXBDbGljayNfeF95IHNjcmlwdFxyXG4gIH1cclxuICBcclxuXHRvbkF0dGFjaygpIHtcclxuXHRcdC8vIFJ1biBNYXBBdHRhY2sjX3hfeSBzY3JpcHRcclxuICB9XHJcbiAgXHJcbiAgZ2V0UGFjaygpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGxheWVyOiB0aGlzLmxheWVyLFxyXG4gICAgICB3YWxsOiB0aGlzLndhbGwsXHJcbiAgICAgIGNhbkF0dGFjazogdGhpcy5jYW5BdHRhY2ssXHJcbiAgICAgIGRhbWFnZTogdGhpcy5kYW1hZ2UsXHJcbiAgICAgIGRlZmVuY2U6IHRoaXMuZGVmZW5jZSxcclxuICAgICAgaGVhbHRoTWF4OiB0aGlzLmhlYWx0aE1heCxcclxuICAgICAgd2FycE1hcDogdGhpcy53YXJwTWFwLFxyXG4gICAgICB3YXJwWDogdGhpcy53YXJwWCxcclxuICAgICAgd2FycFk6IHRoaXMud2FycFlcclxuICAgIH07XHJcbiAgfVxyXG59XHJcbiIsImNvbnN0IGNvbmZpZyA9IHt9O1xyXG5cclxuY29uZmlnLlBPUlQgPSAyMDAwO1xyXG5jb25maWcuRlJBTUVSQVRFID0gMTAwMCAvIDYwO1xyXG5jb25maWcuVElMRV9TSVpFID0gMzI7XHJcbmNvbmZpZy5TTE9UX1NJWkUgPSBjb25maWcuVElMRV9TSVpFICsgNjtcclxuXHJcbmNvbmZpZy5NQVBfTEFZRVJTID0gNjtcclxuY29uZmlnLk1BUF9DT0xVTU5TID0gMTI7XHJcbmNvbmZpZy5NQVBfUk9XUyA9IDEyO1xyXG5cclxuY29uZmlnLk1BWF9NQVBTID0gMTA7XHJcbmNvbmZpZy5NQVhfVVNFUlMgPSAxMDA7XHJcbmNvbmZpZy5NQVhfU1BSSVRFUyA9IDEzO1xyXG5jb25maWcuTUFYX0VGRkVDVFMgPSA3MDtcclxuXHJcbmNvbmZpZy5NQVhfSEVBTFRIX0JBU0UgPSAyMDA7XHJcbmNvbmZpZy5NQVhfSEVBTFRIX0JPTlVTID0gNTU7XHJcbmNvbmZpZy5NQVhfRU5FUkdZX0JBU0UgPSAyMDA7XHJcbmNvbmZpZy5NQVhfRU5FUkdZX0JPTlVTID0gNTU7XHJcblxyXG5jb25maWcuSU5WRU5UT1JZX1NJWkUgPSAyMDtcclxuY29uZmlnLkVRVUlQTUVOVF9TSVpFID0gNTtcclxuXHJcbmNvbmZpZy5TVEFSVF9NQVAgPSAxO1xyXG5jb25maWcuU1RBUlRfWCA9IDU7XHJcbmNvbmZpZy5TVEFSVF9ZID0gNTtcclxuY29uZmlnLlNUQVJUX05BTUUgPSAnTmV3IFBsYXllcic7XHJcbmNvbmZpZy5TVEFSVF9TUFJJVEUgPSAxO1xyXG5jb25maWcuU1RBUlRfREFNQUdFID0gMjtcclxuY29uZmlnLlNUQVJUX0RFRkVOQ0UgPSAwO1xyXG5jb25maWcuU1RBUlRfSEVBTFRIX01BWCA9IDIwO1xyXG5jb25maWcuU1RBUlRfRU5FUkdZX01BWCA9IDEwO1xyXG5cclxuY29uZmlnLkJBQ0tVUF9USU1FID0gNTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNvbmZpZztcclxuIiwiaW1wb3J0IG1vbmdvanMgZnJvbSBcIm1vbmdvanNcIjtcclxuaW1wb3J0IGNvbmZpZyBmcm9tIFwiLi9jb25maWcuanNcIjtcclxuXHJcbmNvbnN0IG1vbmdvID0gbW9uZ29qcygnbG9jYWxob3N0OjI3MDE3L29keXNzZXknLCBbJ2FjY291bnRzJywgJ3BsYXllcnMnLCAnbWFwcycsICdpdGVtcycsICdib3RzJ10pO1xyXG5cclxuY2xhc3MgRGF0YWJhc2Uge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgLy8gVGhlc2Ugc2hvdWxkIGJlIGhlbGQgaW4gdGhlIGRhdGFiYXNlXHJcbiAgICB0aGlzLml0ZW1zID0gW1xyXG4gICAgICB7XHQvLyB0eXBlIDBcclxuICAgICAgICBuYW1lOiBcIkJsYW5rIEl0ZW1cIixcclxuICAgICAgICBzcHJpdGU6IDY4LFxyXG4gICAgICAgIHR5cGU6ICdub25lJyxcclxuICAgICAgICBzdGFjazogMCxcclxuICAgICAgICByZXVzYWJsZTogZmFsc2UsXHJcbiAgICAgICAgZGFtYWdlQm9udXM6IDAsXHJcbiAgICAgICAgZGVmZW5jZUJvbnVzOiAwLFxyXG4gICAgICAgIGhlYWx0aE1heEJvbnVzOiAwLFxyXG4gICAgICAgIGVuZXJneU1heEJvbnVzOiAwLFxyXG4gICAgICAgIHJhbmdlQm9udXM6IDBcclxuICAgICAgfSxcclxuICAgICAge1x0Ly8gdHlwZSAxXHJcbiAgICAgICAgbmFtZTogXCJIZWFsdGggUG90aW9uXCIsXHJcbiAgICAgICAgc3ByaXRlOiAxLFxyXG4gICAgICAgIHR5cGU6ICdwb3Rpb24nLFxyXG4gICAgICAgIHN0YWNrOiAxLFxyXG4gICAgICAgIHJldXNhYmxlOiBmYWxzZSxcclxuICAgICAgICBkYW1hZ2VCb251czogMCxcclxuICAgICAgICBkZWZlbmNlQm9udXM6IDAsXHJcbiAgICAgICAgaGVhbHRoTWF4Qm9udXM6IDAsXHJcbiAgICAgICAgZW5lcmd5TWF4Qm9udXM6IDAsXHJcbiAgICAgICAgcmFuZ2VCb251czogMFxyXG4gICAgICB9LCBcclxuICAgICAge1x0Ly8gdHlwZSAyXHJcbiAgICAgICAgbmFtZTogXCJFbmVyZ3kgUG90aW9uXCIsXHJcbiAgICAgICAgc3ByaXRlOiAyLFxyXG4gICAgICAgIHR5cGU6ICdwb3Rpb24nLFxyXG4gICAgICAgIHN0YWNrOiAxLFxyXG4gICAgICAgIHJldXNhYmxlOiBmYWxzZSxcclxuICAgICAgICBkYW1hZ2VCb251czogMCxcclxuICAgICAgICBkZWZlbmNlQm9udXM6IDAsXHJcbiAgICAgICAgaGVhbHRoTWF4Qm9udXM6IDAsXHJcbiAgICAgICAgZW5lcmd5TWF4Qm9udXM6IDAsXHJcbiAgICAgICAgcmFuZ2VCb251czogMFxyXG4gICAgICB9LCBcclxuICAgICAge1x0Ly8gdHlwZSAzXHJcbiAgICAgICAgbmFtZTogXCJJbmNvZ25pdG9cIixcclxuICAgICAgICBzcHJpdGU6IDEyLFxyXG4gICAgICAgIHR5cGU6ICdzcGVjaWFsJyxcclxuICAgICAgICBzdGFjazogMCxcclxuICAgICAgICByZXVzYWJsZTogdHJ1ZSxcclxuICAgICAgICBkYW1hZ2VCb251czogMCxcclxuICAgICAgICBkZWZlbmNlQm9udXM6IDAsXHJcbiAgICAgICAgaGVhbHRoTWF4Qm9udXM6IDAsXHJcbiAgICAgICAgZW5lcmd5TWF4Qm9udXM6IDAsXHJcbiAgICAgICAgcmFuZ2VCb251czogMFxyXG4gICAgICB9LFxyXG4gICAgICB7XHQvLyB0eXBlIDRcclxuICAgICAgICBuYW1lOiBcIlN3b3JkXCIsXHJcbiAgICAgICAgc3ByaXRlOiAxMCxcclxuICAgICAgICB0eXBlOiAnd2VhcG9uJyxcclxuICAgICAgICBzdGFjazogMCxcclxuICAgICAgICByZXVzYWJsZTogdHJ1ZSxcclxuICAgICAgICBkYW1hZ2VCb251czogMSxcclxuICAgICAgICBkZWZlbmNlQm9udXM6IDAsXHJcbiAgICAgICAgaGVhbHRoTWF4Qm9udXM6IDAsXHJcbiAgICAgICAgZW5lcmd5TWF4Qm9udXM6IDAsXHJcbiAgICAgICAgcmFuZ2VCb251czogMFxyXG4gICAgICAgIFxyXG4gICAgICB9LFxyXG4gICAgICB7XHQvLyB0eXBlIDVcclxuICAgICAgICBuYW1lOiBcIkF4ZVwiLFxyXG4gICAgICAgIHNwcml0ZTogMTQsXHJcbiAgICAgICAgdHlwZTogJ3dlYXBvbicsXHJcbiAgICAgICAgc3RhY2s6IDAsXHJcbiAgICAgICAgcmV1c2FibGU6IHRydWUsXHJcbiAgICAgICAgZGFtYWdlQm9udXM6IDIsXHJcbiAgICAgICAgZGVmZW5jZUJvbnVzOiAwLFxyXG4gICAgICAgIGhlYWx0aE1heEJvbnVzOiAwLFxyXG4gICAgICAgIGVuZXJneU1heEJvbnVzOiAwLFxyXG4gICAgICAgIHJhbmdlQm9udXM6IDBcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgIF07XHJcblxyXG4gICAgdGhpcy5tYXBzID0gW1xyXG4gICAgICB7XHQvLyBpZCAwXHJcbiAgICAgICAgbmFtZTogXCJCbGFuayBNYXBcIixcclxuICAgICAgICBkcm9wQ2hhbmNlOiAxMDAsXHJcbiAgICAgICAgZHJvcEFtb3VudEVROiAwLFxyXG4gICAgICAgIGpvaW46XHRcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICBsZWF2ZTpcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAge1x0Ly8gaWQgMVxyXG4gICAgICAgIG5hbWU6IFwiQ3JlbmRhbGUgMVwiLFxyXG4gICAgICAgIGRyb3BDaGFuY2U6IDEwMCxcclxuICAgICAgICBkcm9wQW1vdW50RVE6IDAsXHJcbiAgICAgICAgam9pbjpcdFx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgIGxlYXZlOlx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICB7XHQvLyBpZCAyXHJcbiAgICAgICAgbmFtZTogXCJDcmVuZGFsZSAyXCIsXHJcbiAgICAgICAgZHJvcENoYW5jZTogMTAwLFxyXG4gICAgICAgIGRyb3BBbW91bnRFUTogMCxcclxuICAgICAgICBqb2luOlx0XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgbGVhdmU6XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcdC8vIGlkIDNcclxuICAgICAgICBuYW1lOiBcIkNyZW5kYWxlIDNcIixcclxuICAgICAgICBkcm9wQ2hhbmNlOiAxMDAsXHJcbiAgICAgICAgZHJvcEFtb3VudEVROiAwLFxyXG4gICAgICAgIGpvaW46XHRcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICBsZWF2ZTpcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAge1x0Ly8gaWQgNFxyXG4gICAgICAgIG5hbWU6IFwiQ3JlbmRhbGUgNFwiLFxyXG4gICAgICAgIGRyb3BDaGFuY2U6IDEwMCxcclxuICAgICAgICBkcm9wQW1vdW50RVE6IDAsXHJcbiAgICAgICAgam9pbjpcdFx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgIGxlYXZlOlx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICB7XHQvLyBpZCA1XHJcbiAgICAgICAgbmFtZTogXCJDcmVuZGFsZSA1XCIsXHJcbiAgICAgICAgZHJvcENoYW5jZTogMTAwLFxyXG4gICAgICAgIGRyb3BBbW91bnRFUTogMCxcclxuICAgICAgICBqb2luOlx0XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgbGVhdmU6XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcdC8vIGlkIDZcclxuICAgICAgICBuYW1lOiBcIkNyZW5kYWxlIDZcIixcclxuICAgICAgICBkcm9wQ2hhbmNlOiAxMDAsXHJcbiAgICAgICAgZHJvcEFtb3VudEVROiAwLFxyXG4gICAgICAgIGpvaW46XHRcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICBsZWF2ZTpcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAge1x0Ly8gaWQgN1xyXG4gICAgICAgIG5hbWU6IFwiQ3JlbmRhbGUgN1wiLFxyXG4gICAgICAgIGRyb3BDaGFuY2U6IDEwMCxcclxuICAgICAgICBkcm9wQW1vdW50RVE6IDAsXHJcbiAgICAgICAgam9pbjpcdFx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgIGxlYXZlOlx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICB7XHQvLyBpZCA4XHJcbiAgICAgICAgbmFtZTogXCJDcmVuZGFsZSA4XCIsXHJcbiAgICAgICAgZHJvcENoYW5jZTogMTAwLFxyXG4gICAgICAgIGRyb3BBbW91bnRFUTogMCxcclxuICAgICAgICBqb2luOlx0XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgbGVhdmU6XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcdC8vIGlkIDlcclxuICAgICAgICBuYW1lOiBcIkNyZW5kYWxlIDlcIixcclxuICAgICAgICBkcm9wQ2hhbmNlOiAxMDAsXHJcbiAgICAgICAgZHJvcEFtb3VudEVROiAwLFxyXG4gICAgICAgIGpvaW46XHRcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICBsZWF2ZTpcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIF07XHJcblxyXG4gICAgdGhpcy5wbGF5ZXJzID0gW1xyXG4gICAgICB7XHQvL2lkIDBcclxuICAgICAgICBuYW1lOiBcIkZhbmthZG9yZVwiLFxyXG4gICAgICAgIHNwcml0ZTogMSxcclxuICAgICAgICBhZG1pbkFjY2VzczogMCxcclxuICAgICAgICBtYXA6IDEsXHJcbiAgICAgICAgeDogNSxcclxuICAgICAgICB5OiA1LFxyXG4gICAgICAgIGRhbWFnZUJhc2U6IDEwLFxyXG4gICAgICAgIGRlZmVuY2VCYXNlOiAyLFxyXG4gICAgICAgIGhlYWx0aE1heEJhc2U6IDIwLFxyXG4gICAgICAgIGVuZXJneU1heEJhc2U6IDQwLFxyXG4gICAgICAgIHJhbmdlQmFzZTogMVxyXG4gICAgICB9LFxyXG4gICAgICB7XHQvL2lkIDFcclxuICAgICAgICBuYW1lOiBcIk9iYml0dFwiLFxyXG4gICAgICAgIHNwcml0ZTogMyxcclxuICAgICAgICBhZG1pbkFjY2VzczogMCxcclxuICAgICAgICBtYXA6IDEsXHJcbiAgICAgICAgeDogNCxcclxuICAgICAgICB5OiA0LFxyXG4gICAgICAgIGRhbWFnZUJhc2U6IDEwLFxyXG4gICAgICAgIGRlZmVuY2VCYXNlOiAyLFxyXG4gICAgICAgIGhlYWx0aE1heEJhc2U6IDIwLFxyXG4gICAgICAgIGVuZXJneU1heEJhc2U6IDQwLFxyXG4gICAgICAgIHJhbmdlQmFzZTogMVxyXG4gICAgICB9LFxyXG4gICAgICB7XHQvL2lkIDJcclxuICAgICAgICBuYW1lOiBcIkZyb2xpa1wiLFxyXG4gICAgICAgIHNwcml0ZTogNSxcclxuICAgICAgICBhZG1pbkFjY2VzczogMCxcclxuICAgICAgICBtYXA6IDEsXHJcbiAgICAgICAgeDogNSxcclxuICAgICAgICB5OiA1LFxyXG4gICAgICAgIGRhbWFnZUJhc2U6IDEwLFxyXG4gICAgICAgIGRlZmVuY2VCYXNlOiAyLFxyXG4gICAgICAgIGhlYWx0aE1heEJhc2U6IDIwLFxyXG4gICAgICAgIGVuZXJneU1heEJhc2U6IDQwLFxyXG4gICAgICAgIHJhbmdlQmFzZTogMVxyXG4gICAgICB9LFxyXG4gICAgXTtcclxuXHJcbiAgICB0aGlzLmJvdHMgPSBbXHJcbiAgICAgIHtcdC8vaWQgMFxyXG4gICAgICAgIG5hbWU6IFwiUmF0XCIsXHJcbiAgICAgICAgc3ByaXRlOiAwLFxyXG4gICAgICAgIGhvc3RpbGU6IGZhbHNlLFxyXG4gICAgICAgIGRhbWFnZUJhc2U6IDEsXHJcbiAgICAgICAgZGVmZW5jZUJhc2U6IDAsXHJcbiAgICAgICAgaGVhbHRoTWF4QmFzZTogNSxcclxuICAgICAgICBlbmVyZ3lNYXhCYXNlOiAxMCxcclxuICAgICAgICByYW5nZUJhc2U6IDFcclxuICAgICAgfSxcclxuICAgICAge1x0Ly9pZCAxXHJcbiAgICAgICAgbmFtZTogXCJTbmFrZVwiLFxyXG4gICAgICAgIHNwcml0ZTogMSxcclxuICAgICAgICBob3N0aWxlOiB0cnVlLFxyXG4gICAgICAgIGRhbWFnZUJhc2U6IDIsXHJcbiAgICAgICAgZGVmZW5jZUJhc2U6IDAsXHJcbiAgICAgICAgaGVhbHRoTWF4QmFzZTogNSxcclxuICAgICAgICBlbmVyZ3lNYXhCYXNlOiA1LFxyXG4gICAgICAgIHJhbmdlQmFzZTogMVxyXG4gICAgICB9LFxyXG4gICAgXTtcclxuXHJcbiAgfVxyXG5cclxuXHRsb2cobWVzc2FnZSkge1xyXG5cdFx0Y29uc29sZS5sb2cobWVzc2FnZSk7XHJcblx0fVxyXG5cclxuICBmaW5kKHVzZXJuYW1lKSB7XHJcbiAgICBtb25nby5hY2NvdW50cy5maW5kT25lKHt1c2VybmFtZTogdXNlcm5hbWV9LCAoZXJyLCByZXMpID0+IHtcclxuICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xyXG4gICAgICBpZiAocmVzKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB0aGlzLmxvZyhgUGxheWVyIG5vdCBmb3VuZCB3aXRoIHVzZXJuYW1lOiAke3VzZXJuYW1lfWApO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldFBsYXllckRhdGEoaWQpIHtcclxuICAgIGxldCBwbGF5ZXJEYXRhID0ge307XHJcblxyXG4gICAgaWYgKHRoaXMucGxheWVyc1tpZF0pIHtcdC8vIEZyb20gRGF0YWJhc2VcclxuICAgICAgcGxheWVyRGF0YSA9IHRoaXMucGxheWVyc1tpZF07XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcdC8vIEZpcnN0IExvZ2luXHJcbiAgICAgIHBsYXllckRhdGEubmFtZSA9IGNvbmZpZy5TVEFSVF9OQU1FO1xyXG4gICAgICBwbGF5ZXJEYXRhLnNwcml0ZSA9IGNvbmZpZy5TVEFSVF9TUFJJVEU7XHJcbiAgICAgIHBsYXllckRhdGEuYWRtaW5BY2Nlc3MgPSAwO1xyXG4gICAgICBcclxuICAgICAgcGxheWVyRGF0YS5tYXAgPSBjb25maWcuU1RBUlRfTUFQO1xyXG4gICAgICBwbGF5ZXJEYXRhLnggPSBjb25maWcuU1RBUlRfWDtcclxuICAgICAgcGxheWVyRGF0YS55ID0gY29uZmlnLlNUQVJUX1k7XHJcbiAgICAgIFxyXG4gICAgICBwbGF5ZXJEYXRhLmRhbWFnZUJhc2UgPSBjb25maWcuU1RBUlRfREFNQUdFO1xyXG4gICAgICBwbGF5ZXJEYXRhLmRlZmVuY2VCYXNlID0gY29uZmlnLlNUQVJUX0RFRkVOQ0U7XHJcbiAgICAgIHBsYXllckRhdGEuaGVhbHRoTWF4QmFzZSA9IGNvbmZpZy5TVEFSVF9IRUFMVEhfTUFYO1xyXG4gICAgICBwbGF5ZXJEYXRhLmVuZXJneU1heEJhc2UgPSBjb25maWcuU1RBUlRfRU5FUkdZX01BWDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcmV0dXJuIHBsYXllckRhdGE7XHJcbiAgfVxyXG5cclxuICBzYXZlUGxheWVyRGF0YShkYXRhKSB7XHJcbiAgICAvL21vbmdvLnBsYXllcnMuc2F2ZShkYXRhLmlkLCBkYXRhKTtcclxuICB9XHJcblxyXG4gIGdldE1hcERhdGEoaWQpIHtcclxuICAgIGxldCBtYXBEYXRhID0ge307XHJcblxyXG4gICAgaWYgKHRoaXMubWFwc1tpZF0pIHtcclxuICAgICAgbWFwRGF0YSA9IHRoaXMubWFwc1tpZF07XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgbWFwRGF0YS5uYW1lID0gXCJCbGFuayBNYXBcIjtcclxuICAgICAgbWFwRGF0YS5pdGVtcyA9IFtdO1xyXG4gICAgICBtYXBEYXRhLmJvdHMgPSBbXTtcclxuICAgICAgbWFwRGF0YS5lZmZlY3RzID0gW107XHJcbiAgICAgIG1hcERhdGEudGV4dHMgPSBbXTtcclxuICAgICAgbWFwRGF0YS5kcm9wQ2hhbmNlID0gMTAwO1xyXG4gICAgICBtYXBEYXRhLmRyb3BBbW91bnRFUSA9IDU7XHJcbiAgICAgIG1hcERhdGEudGlsZXMgPSB7XHJcbiAgICAgICAgbGF5ZXI6IFsgXHJcbiAgICAgICAgICBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXHJcbiAgICAgICAgICBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXHJcbiAgICAgICAgICBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXHJcbiAgICAgICAgICBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXHJcbiAgICAgICAgICBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXHJcbiAgICAgICAgICBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXHJcbiAgICAgICAgXSxcclxuICAgICAgICB3YWxsOiBbZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZV0sXHJcbiAgICAgICAgY2FuQXR0YWNrOiBbZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZV0sXHJcbiAgICAgICAgZGFtYWdlOiBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXHJcbiAgICAgICAgZGVmZW5jZTogWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxyXG4gICAgICAgIGhlYWx0aE1heDogWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxyXG4gICAgICAgIHdhcnBNYXA6IFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcclxuICAgICAgICB3YXJwWDogWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxyXG4gICAgICAgIHdhcnBZOiBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF1cclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbWFwRGF0YTtcclxuICB9XHJcbiAgXHJcbiAgc2F2ZU1hcERhdGEoZGF0YSkge1xyXG4gICAgbW9uZ28ubWFwcy5zYXZlKGRhdGEuaWQsIGRhdGEpO1xyXG4gIH1cclxuXHJcbiAgZ2V0Qm90RGF0YShib3RDbGFzcykge1xyXG4gICAgcmV0dXJuIHRoaXMuYm90c1tib3RDbGFzc107XHJcbiAgfVxyXG5cclxuICBzYXZlQm90RGF0YShtYXBJZCwgaWQpIHtcclxuXHJcbiAgfVxyXG5cclxuICBnZXRJdGVtRGF0YShpdGVtQ2xhc3MpIHtcclxuICAgIHJldHVybiB0aGlzLml0ZW1zW2l0ZW1DbGFzc107XHJcbiAgfVxyXG59XHJcblxyXG5jb25zdCBkYiA9IG5ldyBEYXRhYmFzZSgpO1xyXG5leHBvcnQgZGVmYXVsdCBkYjtcclxuIiwiaW1wb3J0IGZzIGZyb20gJ2ZzJztcclxuXHJcbmltcG9ydCBkYiBmcm9tICcuL2RiLmpzJztcclxuaW1wb3J0IGNvbmZpZyBmcm9tICcuL2NvbmZpZy5qcyc7XHJcbmltcG9ydCB1dGlsIGZyb20gJy4vdXRpbC5qcyc7XHJcbmltcG9ydCBNYXAgZnJvbSAnLi9jbGFzc2VzL21hcC5qcyc7XHJcbmltcG9ydCBQbGF5ZXIgZnJvbSAnLi9jbGFzc2VzL3BsYXllci5qcyc7XHJcbmltcG9ydCBCb3QgZnJvbSAnLi9jbGFzc2VzL2JvdC5qcyc7XHJcbmltcG9ydCBJdGVtIGZyb20gJy4vY2xhc3Nlcy9pdGVtLmpzJztcclxuXHJcbmNsYXNzIEdhbWUge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0dGhpcy5wbGF5ZXJMaXN0ID0gW107XHJcblx0XHR0aGlzLm1hcExpc3QgPSBbXTtcclxuXHRcdHRoaXMubWVzc2FnZVF1ZXVlID0gW107XHJcblxyXG5cdFx0Ly8gQ3JlYXRlIE1hcHNcclxuXHRcdHRoaXMubWFwRGF0YSA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKCcuL3NlcnZlci9kYXRhL21hcC5qc29uJywgJ3V0ZjgnKSk7XHJcblx0XHRmb3IgKGxldCBpZCA9IDA7IGlkIDwgY29uZmlnLk1BWF9NQVBTOyBpZCsrKSB7XHJcblx0XHRcdHRoaXMubWFwTGlzdFtpZF0gPSBuZXcgTWFwKGlkLCB0aGlzLm1hcERhdGFbaWRdKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHVwZGF0ZShkZWx0YSkge1xyXG5cdFx0bGV0IHBhY2sgPSB7XHJcblx0XHRcdHBsYXllcnM6IFtdLFxyXG5cdFx0XHRtYXBzOiBbXVxyXG5cdFx0fTtcclxuXHRcdFxyXG5cdFx0dGhpcy5wbGF5ZXJMaXN0LmZvckVhY2goKHBsYXllcikgPT4ge1xyXG5cdFx0XHRwYWNrLnBsYXllcnNbcGxheWVyLmlkXSA9IHBsYXllci51cGRhdGUoZGVsdGEpO1xyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcdHRoaXMubWFwTGlzdC5mb3JFYWNoKChtYXApID0+IHtcclxuXHRcdFx0cGFjay5tYXBzW21hcC5pZF0gPSBtYXAudXBkYXRlKGRlbHRhKTtcclxuXHRcdH0pO1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gcGFjaztcclxuXHR9XHJcblxyXG5cdC8vIFBsYXllcnNcclxuXHRwbGF5ZXJMb2dpbihpZCkge1xyXG5cdFx0bGV0IHBsYXllciA9IG5ldyBQbGF5ZXIoaWQpO1xyXG5cdFx0dGhpcy5wbGF5ZXJMaXN0W2lkXSA9IHBsYXllcjtcclxuXHRcdHRoaXMuc2VuZFNlcnZlck1lc3NhZ2UoYCR7cGxheWVyLm5hbWV9IGhhcyBsb2dnZWQgaW4uYCk7XHJcblx0XHRyZXR1cm4gcGxheWVyO1xyXG5cdH1cclxuXHRcclxuXHRwbGF5ZXJMb2dvdXQoaWQpIHtcclxuXHRcdGxldCBwbGF5ZXIgPSB0aGlzLnBsYXllckxpc3RbaWRdO1xyXG5cdFx0aWYgKHBsYXllcikge1xyXG5cdFx0XHRkYi5zYXZlUGxheWVyRGF0YShwbGF5ZXIuZ2V0UGFjayk7XHJcblx0XHRcdHRoaXMuc2VuZFNlcnZlck1lc3NhZ2UoYCR7cGxheWVyLm5hbWV9IGhhcyBsb2dnZWQgb3V0LmApO1xyXG5cdFx0XHRkZWxldGUgdGhpcy5wbGF5ZXJMaXN0W2lkXTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIE1lc3NhZ2VzXHJcblx0c2VuZFNlcnZlck1lc3NhZ2UobWVzc2FnZSkge1xyXG5cdFx0dGhpcy5tZXNzYWdlUXVldWUucHVzaCh7bWVzc2FnZX0pO1xyXG5cdH1cclxuXHJcblx0c2VuZE1hcE1lc3NhZ2UobWFwSWQsIG1lc3NhZ2UpIHtcclxuXHRcdHRoaXMubWVzc2FnZVF1ZXVlLnB1c2goe21lc3NhZ2UsIG1hcElkfSk7XHJcblx0fVxyXG5cclxuXHRzZW5kUGxheWVyTWVzc2FnZShpZCwgbWVzc2FnZSkge1xyXG5cdFx0dGhpcy5tZXNzYWdlUXVldWUucHVzaCh7bWVzc2FnZSwgaWR9KTtcclxuXHR9XHJcblxyXG5cdC8vIE1hcFxyXG5cdGlzVmFjYW50KG1hcElkLCB4LCB5KSB7XHJcblx0XHQvLyBDaGVjayBmb3IgTWFwIEVkZ2VzXHJcblx0XHRpZiAoeCA8IDAgfHwgeCA+PSBjb25maWcuTUFQX0NPTFVNTlMpIHJldHVybiBmYWxzZTtcclxuXHRcdGlmICh5IDwgMCB8fCB5ID49IGNvbmZpZy5NQVBfUk9XUykgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHJcblx0XHRsZXQgbWFwID0gdGhpcy5tYXBMaXN0W21hcElkXTtcclxuXHRcdFxyXG5cdFx0Ly8gQ2hlY2sgZm9yIFdhbGwgVGlsZXNcclxuXHRcdGlmIChtYXAudGlsZXNbeV1beF0ud2FsbCA9PT0gdHJ1ZSkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHJcblx0XHQvLyBDaGVjayBmb3IgQm90c1xyXG5cdFx0bGV0IGJvdHMgPSBtYXAuYm90cy5maWx0ZXIoKGJvdCkgPT4ge1xyXG5cdFx0XHRpZiAoYm90LnggPT09IHggJiYgYm90LnkgPT09IHkgJiYgIWJvdC5pc0RlYWQpIHJldHVybiB0cnVlO1xyXG5cdFx0fSk7XHJcblx0XHRpZiAoYm90cy5sZW5ndGggPiAwKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcclxuXHRcdC8vIENoZWNrIGZvciBQbGF5ZXJzXHJcblx0XHRsZXQgcGxheWVycyA9IHRoaXMucGxheWVyTGlzdC5maWx0ZXIoKHBsYXllcikgPT4ge1xyXG5cdFx0XHRpZiAocGxheWVyLm1hcCA9PT0gbWFwLmlkICYmIHBsYXllci54ID09PSB4ICYmIHBsYXllci55ID09PSB5ICYmICFwbGF5ZXIuaXNEZWFkKSByZXR1cm4gdHJ1ZTtcclxuXHRcdH0pO1xyXG5cdFx0aWYgKHBsYXllcnMubGVuZ3RoID4gMCkgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHJcblx0c3Bhd25Cb3QobWFwSWQsIHgsIHksIGJvdENsYXNzKSB7XHJcblx0XHRuZXcgQm90KG1hcElkLCB4LCB5LCBib3RDbGFzcyk7XHJcblx0fVxyXG5cdFxyXG5cdHNwYXduTWFwSXRlbShtYXBJZCwgeCwgeSwgaXRlbUNsYXNzLCBzdGFjayA9IDApIHtcclxuXHRcdG5ldyBJdGVtKHtcclxuXHRcdFx0b3duZXI6ICdtYXAnLFxyXG5cdFx0XHRtYXBJZCxcclxuXHRcdFx0aWQ6IHV0aWwuZmlyc3RFbXB0eUluZGV4KHRoaXMubWFwTGlzdFttYXBJZF0uaXRlbXMpLFxyXG5cdFx0XHR4LFxyXG5cdFx0XHR5LFxyXG5cdFx0XHRpdGVtQ2xhc3MsXHJcblx0XHRcdHN0YWNrXHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHNwYXduRGFtYWdlVGV4dChtYXBJZCwgeCwgeSwgZGFtYWdlKSB7XHJcblx0XHRuZXcgVGV4dChtYXBJZCwgeCwgeSwgZGFtYWdlLCAnI0ZGMDAwMCcsIDAsIC0xKTtcclxuXHR9XHJcbn1cclxuXHJcbmNvbnN0IGdhbWUgPSBuZXcgR2FtZSgpO1xyXG5leHBvcnQgZGVmYXVsdCBnYW1lO1xyXG4iLCIvKioqIEdhbWUgTG9vcCAqKiovXHJcbi8qIEtlZXBzIHRyYWNrIG9mIHRpbWUgYW5kIGNvLW9yZGluYXRlcyB0aGUgZ2FtZSBhbmQgc2VydmVyICovXHJcblxyXG5pbXBvcnQgTm9kZUdhbWVMb29wIGZyb20gJ25vZGUtZ2FtZWxvb3AnO1xyXG5cclxuaW1wb3J0IGRiIGZyb20gJy4vZGIuanMnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuL2dhbWUuanMnO1xyXG5pbXBvcnQgc2VydmVyIGZyb20gJy4vc2VydmVyLmpzJztcclxuaW1wb3J0IGNvbmZpZyBmcm9tICcuL2NvbmZpZy5qcyc7XHJcblxyXG5jbGFzcyBHYW1lTG9vcCB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLmlkID0gbnVsbDtcclxuICAgIHRoaXMudGltZXIgPSB7XHJcbiAgICAgIGJhY2t1cDogMFxyXG4gICAgfTtcclxuICAgIHRoaXMuc3RhcnQoKTtcclxuICB9XHJcbiAgc3RhcnQoKSB7XHJcbiAgICB0aGlzLmlkID0gTm9kZUdhbWVMb29wLnNldEdhbWVMb29wKChkZWx0YSkgPT4ge1xyXG4gICAgICAvLyBVcGRhdGUgdGhlIGdhbWUgc3RhdGVcclxuICAgICAgbGV0IHVwZGF0ZVBhY2sgPSBnYW1lLnVwZGF0ZShkZWx0YSk7XHJcbiAgICAgIFxyXG4gICAgICAvLyBTZW5kIHVwZGF0ZWQgc3RhdGUgdG8gY2xpZW50c1xyXG4gICAgICBzZXJ2ZXIuc2VuZFVwZGF0ZVBhY2sodXBkYXRlUGFjayk7XHJcbiAgICAgIFxyXG4gICAgICAvLyBQZXJpb2RpYyBiYWNrdXAgdG8gZGF0YWJhc2VcclxuICAgICAgdGhpcy50aW1lci5iYWNrdXAgKz0gZGVsdGE7XHJcbiAgICAgIGlmICh0aGlzLnRpbWVyLmJhY2t1cCA+PSBjb25maWcuQkFDS1VQX1RJTUUpIHtcclxuICAgICAgICB0aGlzLnRpbWVyLmJhY2t1cCAtPSBjb25maWcuQkFDS1VQX1RJTUU7XHJcbiAgICAgICAgLy8gU0FWRSBTVEFURVxyXG4gICAgICB9XHJcbiAgICB9LCBjb25maWcuRlJBTUVSQVRFKTtcclxuICB9XHJcbn1cclxuXHJcbmNvbnN0IGdhbWVMb29wID0gbmV3IEdhbWVMb29wKCk7XHJcbmV4cG9ydCBkZWZhdWx0IGdhbWVMb29wOyIsImltcG9ydCBkYiBmcm9tICcuL2RiLmpzJztcclxuaW1wb3J0IGdhbWUgZnJvbSAnLi9nYW1lLmpzJztcclxuaW1wb3J0IHNlcnZlciBmcm9tICcuL3NlcnZlci5qcyc7XHJcbmltcG9ydCBnYW1lbG9vcCBmcm9tICcuL2dhbWVsb29wLmpzJztcclxuIiwiaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XHJcbmltcG9ydCBodHRwIGZyb20gJ2h0dHAnO1xyXG5pbXBvcnQgc29ja2V0SU8gZnJvbSAnc29ja2V0LmlvJztcclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcblxyXG5pbXBvcnQgZGIgZnJvbSAnLi9kYi5qcyc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4vZ2FtZS5qcyc7XHJcbmltcG9ydCBjb25maWcgZnJvbSAnLi9jb25maWcuanMnO1xyXG5pbXBvcnQgdXRpbCBmcm9tICcuL3V0aWwuanMnO1xyXG5cclxuY2xhc3MgU2VydmVyIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdGNvbnN0IGFwcCA9IGV4cHJlc3MoKTtcclxuXHRcdGNvbnN0IHNlcnZlciA9IGh0dHAuU2VydmVyKGFwcCk7XHJcblx0XHRjb25zdCBpbyA9IHNvY2tldElPKHNlcnZlcik7XHJcblx0XHRjb25zdCBwb3J0ID0gcHJvY2Vzcy5lbnYuUE9SVCB8fCBjb25maWcuUE9SVDtcclxuXHRcdGNvbnN0IHB1YmxpY1BhdGggPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4vY2xpZW50Jyk7XHJcblx0XHRcclxuXHRcdGFwcC5nZXQoJy8nLCAocmVxLCByZXMpID0+IHJlcy5zZW5kRmlsZShwdWJsaWNQYXRoICsgJy9pbmRleC5odG1sJykpO1xyXG5cdFx0YXBwLnVzZSgnL2NsaWVudCcsIGV4cHJlc3Muc3RhdGljKHB1YmxpY1BhdGgpKTtcclxuXHRcdHNlcnZlci5saXN0ZW4ocG9ydCwgKCkgPT4gZGIubG9nKGBTZXJ2ZXIgc3RhcnRlZC4gTGlzdGVuaW5nIG9uICR7c2VydmVyLmFkZHJlc3MoKS5wb3J0fWApKTtcclxuXHJcblx0XHR0aGlzLnNvY2tldExpc3QgPSBbXTtcclxuXHRcdGlvLnNvY2tldHMub24oJ2Nvbm5lY3Rpb24nLCAoc29ja2V0KSA9PiB0aGlzLm9uQ29ubmVjdChzb2NrZXQpKTtcclxuXHR9XHJcblxyXG5cdC8vIFJlY2VpdmUgZGF0YSBmcm9tIGNsaWVudHNcclxuXHRvbkNvbm5lY3Qoc29ja2V0KSB7XHJcblx0XHRzb2NrZXQuaWQgPSB1dGlsLmZpcnN0RW1wdHlJbmRleCh0aGlzLnNvY2tldExpc3QpO1xyXG5cdFx0dGhpcy5zb2NrZXRMaXN0W3NvY2tldC5pZF0gPSBzb2NrZXQ7XHJcblx0XHRkYi5sb2coYE5ldyBDb25uZWN0aW9uOiBJZCAke3NvY2tldC5pZH1gKTtcclxuXHRcdFxyXG5cdFx0c29ja2V0Lm9uKCdkaXNjb25uZWN0JywgKCkgPT4gdGhpcy5vbkRpc2Nvbm5lY3Qoc29ja2V0LmlkKSk7XHJcblx0XHRzb2NrZXQub24oJ2xvZ2luJywgKCkgPT4gdGhpcy5vbkxvZ2luKHNvY2tldC5pZCkpO1xyXG5cdFx0c29ja2V0Lm9uKCdsb2dvdXQnLCAoKSA9PiB0aGlzLm9uTG9nb3V0KHNvY2tldC5pZCkpO1xyXG5cdH1cclxuXHJcblx0b25EaXNjb25uZWN0KGlkKSB7XHJcblx0XHRpZiAoZ2FtZS5wbGF5ZXJMaXN0W2lkXSkge1xyXG5cdFx0XHRnYW1lLnBsYXllckxvZ291dChpZCk7XHJcblx0XHR9XHJcblx0XHRkZWxldGUgdGhpcy5zb2NrZXRMaXN0W2lkXTtcclxuXHRcdGRiLmxvZyhgRGlzY29ubmVjdGVkOiBJZCAke2lkfWApO1xyXG5cdH1cclxuXHJcblx0b25Mb2dpbihpZCkge1x0XHRcclxuXHRcdC8vIENyZWF0ZSBQbGF5ZXJcclxuXHRcdGxldCBwbGF5ZXIgPSBnYW1lLnBsYXllckxvZ2luKGlkKTtcclxuXHRcdFxyXG5cdFx0Ly8gUmVjZWl2ZSBJbnB1dHNcclxuXHRcdGxldCBzb2NrZXQgPSB0aGlzLnNvY2tldExpc3RbaWRdO1xyXG5cdFx0c29ja2V0Lm9uKCdpbnB1dCcsIChkYXRhKSA9PiBwbGF5ZXIub25JbnB1dChkYXRhKSk7XHJcblx0fVxyXG5cdFxyXG5cdG9uTG9nb3V0KGlkKSB7XHJcblx0XHRnYW1lLnBsYXllckxvZ291dChpZCk7XHJcblx0fVxyXG5cdFxyXG5cdC8vIFNlbmQgZGF0YSB0byBjbGllbnRzXHJcblx0c2VuZFVwZGF0ZVBhY2sodXBkYXRlUGFjaykge1xyXG5cdFx0Z2FtZS5wbGF5ZXJMaXN0LmZvckVhY2goKHBsYXllcikgPT4ge1xyXG5cdFx0XHRsZXQgcGFjayA9IHt9O1xyXG5cdFx0XHRwYWNrLnByaXZhdGUgPSBwbGF5ZXIuZ2V0UHJpdmF0ZVBhY2soKTtcclxuXHRcdFx0cGFjay5wbGF5ZXJzID0gdXBkYXRlUGFjay5wbGF5ZXJzLmZpbHRlcigocGxheWVyRGF0YSkgPT4ge1xyXG5cdFx0XHRcdHJldHVybiAocGxheWVyRGF0YS5tYXAgPT09IHBsYXllci5tYXApO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0cGFjay5tYXAgPSB1cGRhdGVQYWNrLm1hcHNbcGxheWVyLm1hcF07XHJcblx0XHRcdFxyXG5cdFx0XHRsZXQgc29ja2V0ID0gdGhpcy5zb2NrZXRMaXN0W3BsYXllci5pZF07XHJcblx0XHRcdHNvY2tldC5lbWl0KCd1cGRhdGUnLCBwYWNrKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRcclxuXHRzZW5kTWFwRGF0YShtYXBJZCkge1xyXG5cdFx0Z2FtZS5wbGF5ZXJMaXN0LmZvckVhY2goKHBsYXllcikgPT4ge1xyXG5cdFx0XHRpZiAocGxheWVyLm1hcCA9PT0gbWFwSWQpIHtcclxuXHRcdFx0XHRsZXQgc29ja2V0ID0gdGhpcy5zb2NrZXRMaXN0W3BsYXllci5pZF07XHJcblx0XHRcdFx0c29ja2V0LmVtaXQoJ2xvYWRNYXAnLCBkYi5tYXBbbWFwSWRdKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxufVxyXG5cclxuY29uc3Qgc2VydmVyID0gbmV3IFNlcnZlcigpO1xyXG5leHBvcnQgZGVmYXVsdCBzZXJ2ZXI7XHJcbiIsImZ1bmN0aW9uIHNodWZmbGUoYXJyYXkpIHtcclxuICBsZXQgY3VycmVudEluZGV4ID0gYXJyYXkubGVuZ3RoO1xyXG4gIGxldCB0ZW1wO1xyXG4gIGxldCByYW5kb21JbmRleDtcclxuICB3aGlsZSAoY3VycmVudEluZGV4ICE9PSAwKSB7XHJcbiAgICByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGN1cnJlbnRJbmRleCk7XHJcbiAgICBjdXJyZW50SW5kZXggLT0gMTtcclxuICAgIHRlbXAgPSBhcnJheVtjdXJyZW50SW5kZXhdO1xyXG4gICAgYXJyYXlbY3VycmVudEluZGV4XSA9IGFycmF5W3JhbmRvbUluZGV4XTtcclxuICAgIGFycmF5W3JhbmRvbUluZGV4XSA9IHRlbXA7XHJcbiAgfVxyXG4gIHJldHVybiBhcnJheTtcclxufVxyXG5cclxuZnVuY3Rpb24gc3dhcChhcnJheSwgaSwgaikge1xyXG4gIGxldCB0ZW1wID0gYXJyYXlbaV07XHJcbiAgYXJyYXlbaV0gPSBhcnJheVtqXTtcclxuICBhcnJheVtqXSA9IHRlbXA7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpcnN0RW1wdHlJbmRleChhcnJheSkge1xyXG4gIGlmIChhcnJheS5sZW5ndGggPCAxKSByZXR1cm4gMDtcclxuICBcclxuICBmb3IgKGxldCBpID0gMDsgaSA8PSBhcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgaWYgKGFycmF5W2ldID09IG51bGwpIHJldHVybiBpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbGVycChzdGFydCwgZW5kLCB0aW1lKSB7XHJcbiAgLy9yZXR1cm4gc3RhcnQgKyAodGltZSAqIChlbmQgLSBzdGFydCkpO1xyXG4gIHJldHVybiAoKDEgLSB0aW1lKSAqIHN0YXJ0KSArICh0aW1lICogZW5kKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2xhbXAodmFsdWUsIG1pbmltdW0sIG1heGltdW0pIHtcclxuICBpZiAodmFsdWUgPCBtaW5pbXVtKSB7XHJcbiAgICByZXR1cm4gbWluaW11bTtcclxuICB9XHJcbiAgZWxzZSBpZiAodmFsdWUgPiBtYXhpbXVtKSB7XHJcbiAgICByZXR1cm4gbWF4aW11bTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiByYW5kb21JbnQobWluaW11bSwgbWF4aW11bSkge1xyXG4gIG1heGltdW0rKztcclxuICByZXR1cm4gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIG1heGltdW0pICsgbWluaW11bSk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBzaHVmZmxlLFxyXG4gIHN3YXAsXHJcbiAgZmlyc3RFbXB0eUluZGV4LFxyXG4gIGxlcnAsXHJcbiAgY2xhbXAsXHJcbiAgcmFuZG9tSW50XHJcbn07IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJmc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJodHRwXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm1vbmdvanNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibm9kZS1nYW1lbG9vcFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXRoXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInNvY2tldC5pb1wiKTsiXSwic291cmNlUm9vdCI6IiJ9
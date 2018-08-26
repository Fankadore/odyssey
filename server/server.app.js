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
	constructor(mapId, x, y, name, sprite) {
		sprite = _util_js__WEBPACK_IMPORTED_MODULE_3__["default"].clamp(sprite, 1, _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].MAX_SPRITES);

		super(mapId, x, y, sprite);
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
		this.respawnMap = mapId;
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
			if (!_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].isVacant(this.mapId, this.x - 1, this.y)) return;
			this.destinationX--;
		}
		else if (direction === 'right') {
			if (!_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].isVacant(this.mapId, this.x + 1, this.y)) return;
			this.destinationX++;
		}
		else if (direction === 'up') {
			if (!_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].isVacant(this.mapId, this.x, this.y - 1)) return;
			this.destinationY--;
		}
		else if (direction === 'down') {
			if (!_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].isVacant(this.mapId, this.x, this.y + 1)) return;
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
		if (target.mapId !== this.mapId) return false;
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
		// game.spawnMapItem(this.mapId, this.x, this.y, 1);
		// game.spawnDamageText(this.mapId, this.x, this.y, this.damage); //test
		
		let actorList = _game_js__WEBPACK_IMPORTED_MODULE_1__["default"].playerList.concat(_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[this.mapId].bots);
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
				this.setDead(source.controller, source.name);
				source.kills++;
				if (source.target === this) source.target = null;
			}
			console.log(`${source.name} hits ${this.name} for ${damage} damage.`);
		}
		_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].spawnDamageText(this.mapId, this.x, this.y, damage);
	}
	
	respawn() {
		_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendServerMessage(this.name + " is back from the dead.");

		this.mapId = this.respawnMap;
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
	
	setDead(killerController, killerName) {
		let map = _game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[this.mapId];

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
		
		if (killerController && killerName) {
			if (killerController = 'player') {
				_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendServerMessage(killerName + " has murdered " + this.name + " in cold blood!");
			}
			else {
				_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendServerMessage(this.name + " has been killed by " + killerName + "!");
			}
		}
		else {
			_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendServerMessage(this.name + " has died!");
		}
	}
	
	// Inventory
	pickUp() {
		// See Player and Bot classes
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

		item.moveToMap(this.mapId, this.x, this.y);
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
		if (data.botClass == null || data.mapId == null || data.x == null || data.y == null) return;

		if (data.id == null) data.id = _util_js__WEBPACK_IMPORTED_MODULE_3__["default"].firstEmptyIndex(_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[this.mapId].bots);
		
		let classData = _db_js__WEBPACK_IMPORTED_MODULE_0__["default"].getBotData(data.botClass);
		if (!data.name) data.name = classData.name;
		if (data.sprite == null) data.sprite = classData.sprite;
		if (data.hostile == null) data.hostile = classData.hostile;
		if (data.damageBase == null) data.damageBase = classData.damageBase;
		if (data.defenceBase == null) data.defenceBase = classData.defenceBase;
		if (data.healthMaxBase == null) data.healthMaxBase = classData.healthMaxBase;
		if (data.energyMaxBase == null) data.energyMaxBase = classData.energyMaxBase;
		if (data.rangeBase == null) data.rangeBase = classData.rangeBase;

		super(data.mapId, data.x, data.y, data.name, data.sprite);
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

		_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[this.mapId].bots[this.id] = this;
	}
	
	getMapItem(mapId, id) {
		let slot = super.getMapItem(mapId, id);
		if (slot == null) return;
		
		let item = _game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[mapId].items[id];
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
			isDead: this.isDead,
			isVisible: this.isVisible
		};
	}

	remove() {
		delete _game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[this.mapId].bots[this.id];
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
		for (let item of _game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[this.mapId].items) {
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
	constructor(mapId, x, y, sprite = 0) {
		this.mapId = mapId;
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
			_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[this.mapId].items[this.id] = this;
		}
		else if (data.owner === 'player') {
			_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].playerList[this.id].inventory[this.slot] = this;
		}
		else if (data.owner === 'bot') {
			_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[this.mapId].bots[this.id].inventory[this.slot] = this;
		}
	}
	
	update(delta) {
		return this.getPack();
	}

	getPack() {
		return {
			id: this.id,
			mapId: this.mapId,
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
			delete _game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[this.mapId].items[this.id];
		}
		else if (this.owner === 'bot') {
			delete _game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[this.mapId].bots[this.id].inventory[this.slot];
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
		_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].playerList[this.id].inventory[this.slot] = this;
	}

	moveToMap(mapId, x, y) {
		if (mapId == null || x == null || y == null) return;

		this.remove();
		this.owner = 'map';
		this.mapId = mapId;
		this.id = _util_js__WEBPACK_IMPORTED_MODULE_2__["default"].firstEmptyIndex(_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[this.mapId].items);
		this.x = x;
		this.y = y;
		_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[this.mapId].items[this.id] = this;
	}

	moveToBot(mapId, id, slot) {
		if (mapId == null || id == null || slot == null) return;

		this.remove();
		this.owner = 'bot';
		this.mapId = mapId;
		this.id = id;
		this.slot = slot;
		_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[this.mapId].bots[this.id].inventory[this.slot] = this;
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
			if (player.mapId === this.id) {
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

/***/ "./server/src/classes/message.js":
/*!***************************************!*\
  !*** ./server/src/classes/message.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Message; });
class Message {
  constructor(message, mapId, id) {
    this.mapId = mapId;
    this.id = id;
    this.message = message;
  }
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

		super(data.mapId, data.x, data.y, data.name, data.sprite);
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
			mapId: this.mapId,
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
			case 'mapChat': _game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendMapMessage(this.mapId, `${this.name} says, "${data.message}"`);
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

	pickUp() {
		for (let item of _game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[this.mapId].items) {
			if (item && item.x === this.x && item.y === this.y) {
				let slot = this.getMapItem(item.mapId, item.id);
				if (slot != null) {
					item.moveToPlayer(this.id, slot);
				}
				else {
					// Inventory full
					_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendPlayerMessage(this.id, "Your inventory is full.");
					break;
				}
			}
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
	constructor(mapId, x, y, message, colour = '#000000', displayTime = 2, velX = 0, velY = 0) {
		this.mapId = mapId;
		this.x = x;
		this.y = y;
		this.velX = velX;
		this.velY = velY;
		this.lerpX = 0;
		this.lerpY = 0;

		this.message = message;
		this.colour = colour;
		this.displayTime = displayTime;
		this.timer = 0;

		this.id = _util_js__WEBPACK_IMPORTED_MODULE_1__["default"].firstEmptyIndex(_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].mapList[this.mapId].texts);
		_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].mapList[this.mapId].texts[this.id] = this;
		console.log(this.id);
	}
	
	update(delta) {
		this.timer += delta;
		if (this.displayTime > 0 && this.timer > this.displayTime) {
			this.remove();
		}

		this.lerpX += delta * this.velX;
		this.lerpY += delta * this.velY;

		if (this.lerpX < -1) {
			this.lerpX++;
			this.x--;
		}
		else if (this.lerpX > 1) {
			this.lerpX--;
			this.x++;
		}

		if (this.lerpY < -1) {
			this.lerpY++;
			this.y--;
		}
		else if (this.lerpY > 1) {
			this.lerpY--;
			this.y++;
		}
		
		return this.getPack();
	}
	
	getPack() {
		return {
			id: this.id,
			mapId: this.mapId,
			x: this.x,
			y: this.y,
			lerpX: this.lerpX,
			lerpY: this.lerpY,
			message: this.message,
			colour: this.colour
		};
	}

	remove() {
		delete _game_js__WEBPACK_IMPORTED_MODULE_0__["default"].mapList[this.mapId].texts[this.id];
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
config.BACKUP_TIME = 5;

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
        mapId: 1,
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
        mapId: 1,
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
        mapId: 1,
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
      
      playerData.mapId = _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].START_MAP;
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
/* harmony import */ var _classes_text_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./classes/text.js */ "./server/src/classes/text.js");
/* harmony import */ var _classes_message_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./classes/message.js */ "./server/src/classes/message.js");












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
			maps: [],
			messages: this.messageQueue
		};
		
		this.playerList.forEach((player) => {
			pack.players[player.id] = player.update(delta);
		});
		
		this.mapList.forEach((map) => {
			pack.maps[map.id] = map.update(delta);
		});

		this.messageQueue = [];
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
		this.messageQueue.push(new _classes_message_js__WEBPACK_IMPORTED_MODULE_9__["default"](message, null, null));
	}

	sendMapMessage(mapId, message) {
		this.messageQueue.push(new _classes_message_js__WEBPACK_IMPORTED_MODULE_9__["default"](message, mapId, null));
	}

	sendPlayerMessage(id, message) {
		this.messageQueue.push(new _classes_message_js__WEBPACK_IMPORTED_MODULE_9__["default"](message, null, id));
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
			if (player.mapId === map.id && player.x === x && player.y === y && !player.isDead) return true;
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
		new _classes_text_js__WEBPACK_IMPORTED_MODULE_8__["default"](mapId, x, y - 0.5, damage, '#ff0000', 1.25, 0, -1);
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
				return (playerData.mapId === player.mapId);
			});

			pack.map = updatePack.maps[player.mapId];

			pack.messages = updatePack.messages.filter((message) => {
				return ((message.mapId === null && message.id === null) || player.mapId === message.mapId || player.id === message.id);
			});
			
			let socket = this.socketList[player.id];
			socket.emit('update', pack);
		});
	}
	
	sendMapData(mapId) {
		_game_js__WEBPACK_IMPORTED_MODULE_5__["default"].playerList.forEach((player) => {
			if (player.mapId === mapId) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL2FjdG9yLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy9ib3QuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL2VudGl0eS5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2NsYXNzZXMvaXRlbS5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2NsYXNzZXMvbWFwLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy9tZXNzYWdlLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL3RleHQuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL3RpbGUuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jb25maWcuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9kYi5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2dhbWUuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9nYW1lbG9vcC5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9zZXJ2ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy91dGlsLmpzIiwid2VicGFjazovLy9leHRlcm5hbCBcImV4cHJlc3NcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJmc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImh0dHBcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJtb25nb2pzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibm9kZS1nYW1lbG9vcFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInBhdGhcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJzb2NrZXQuaW9cIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLDZJQUFxRDtBQUN0RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxtQkFBbUI7QUFDbkI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsK0RBQStEOztBQUUvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtRUFBbUU7O0FBRW5FO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLHNCQUFzQjtBQUN0QixHQUFHOztBQUVIOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLFlBQVksUUFBUSxVQUFVLE9BQU8sT0FBTztBQUM5RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7O0FBRUo7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTs7QUFFSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEseURBQXlEOztBQUV6RCwyQkFBMkI7QUFDM0Isa0ZBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9CQUFvQiw4SUFBc0Q7QUFDMUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EseUJBQXlCLG1KQUEyRDtBQUNwRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrRUFBa0U7QUFDbEU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHFGQUF5QztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlGQUFxQyx1RUFBMkI7QUFDaEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQiwwRUFBOEI7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzV0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxzQkFBc0I7QUFDdEI7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQiwwRUFBOEI7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDdFFBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2JBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcktBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQixvRUFBd0I7QUFDekM7QUFDQSxrQkFBa0IsaUVBQXFCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixpRUFBcUI7QUFDdEMsa0JBQWtCLG9FQUF3QjtBQUMxQyxtQkFBbUIsbUVBQXVCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsaUJBQWlCLGlFQUFxQjtBQUN0QztBQUNBLGtCQUFrQixvRUFBd0I7QUFDMUM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlCQUFpQixtRUFBdUI7QUFDeEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQzs7Ozs7Ozs7Ozs7Ozs7QUNsSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG9DQUFvQztBQUNwQyxzQ0FBc0M7QUFDdEMsMENBQTBDO0FBQzFDLDBDQUEwQztBQUMxQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQSxzQkFBc0I7O0FBRXRCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRGQUFnRCxVQUFVLFdBQVcsYUFBYTtBQUNsRjtBQUNBLGtHQUFzRCxVQUFVLFVBQVUsYUFBYTtBQUN2RjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNGQUEwQyxVQUFVLGNBQWMsYUFBYTtBQUMvRSxtR0FBdUQsWUFBWSxLQUFLLGFBQWE7QUFDckY7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDOzs7Ozs7Ozs7Ozs7Ozs7O0FDdk1BO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ3hDQTtBQUFBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDakNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE9BQU87QUFDUCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQSxlQUFlO0FBQ2YsT0FBTztBQUNQLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQSxlQUFlO0FBQ2YsT0FBTztBQUNQLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQSxlQUFlO0FBQ2YsT0FBTztBQUNQLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQSxlQUFlO0FBQ2YsT0FBTztBQUNQLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQSxlQUFlO0FBQ2YsT0FBTztBQUNQLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQSxlQUFlO0FBQ2YsT0FBTztBQUNQLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQSxlQUFlO0FBQ2YsT0FBTztBQUNQLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQSxlQUFlO0FBQ2YsT0FBTztBQUNQLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQSxlQUFlO0FBQ2YsT0FBTztBQUNQLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQSxlQUFlO0FBQ2YsT0FBTztBQUNQOztBQUVBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw0QkFBNEIsbUJBQW1CO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvREFBb0QsU0FBUztBQUM3RDtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBOztBQUVBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzVXQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0JBQWtCLGtFQUFzQjtBQUN4QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixZQUFZO0FBQ3hDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsWUFBWTtBQUN6QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzFIQTtBQUFBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQSx5RTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLCtHQUFtRSxzQkFBc0I7O0FBRXpGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJFQUErQixVQUFVOztBQUV6QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUVBQTZCLEdBQUc7QUFDaEM7O0FBRUEsYztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxJQUFJOztBQUVKOztBQUVBO0FBQ0E7QUFDQSxJQUFJOztBQUVKO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUM1RkE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsaUJBQWlCLG1CQUFtQjtBQUNwQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEc7Ozs7Ozs7Ozs7O0FDekRBLG9DOzs7Ozs7Ozs7OztBQ0FBLCtCOzs7Ozs7Ozs7OztBQ0FBLGlDOzs7Ozs7Ozs7OztBQ0FBLG9DOzs7Ozs7Ozs7OztBQ0FBLDBDOzs7Ozs7Ozs7OztBQ0FBLGlDOzs7Ozs7Ozs7OztBQ0FBLHNDIiwiZmlsZSI6InNlcnZlci5hcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NlcnZlci9zcmMvbWFpbi5qc1wiKTtcbiIsImltcG9ydCBkYiBmcm9tICcuLi9kYi5qcyc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4uL2dhbWUuanMnO1xyXG5pbXBvcnQgY29uZmlnIGZyb20gJy4uL2NvbmZpZy5qcyc7XHJcbmltcG9ydCB1dGlsIGZyb20gJy4uL3V0aWwuanMnO1xyXG5pbXBvcnQgRW50aXR5IGZyb20gJy4vZW50aXR5LmpzJztcclxuXHJcbi8vIEFuIEFjdG9yIGlzIGFuIEVudGl0eSB3aGljaCBjYW4gbW92ZSwgYXR0YWNrIGFuZCBpbnRlcmFjdCB3aXRoIGl0ZW1zXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBY3RvciBleHRlbmRzIEVudGl0eSB7XHJcblx0Y29uc3RydWN0b3IobWFwSWQsIHgsIHksIG5hbWUsIHNwcml0ZSkge1xyXG5cdFx0c3ByaXRlID0gdXRpbC5jbGFtcChzcHJpdGUsIDEsIGNvbmZpZy5NQVhfU1BSSVRFUyk7XHJcblxyXG5cdFx0c3VwZXIobWFwSWQsIHgsIHksIHNwcml0ZSk7XHJcblx0XHR0aGlzLmNvbnRyb2xsZXIgPSAnYm90JztcclxuXHRcdHRoaXMubmFtZSA9IG5hbWU7XHJcblxyXG5cdFx0dGhpcy5pbnZlbnRvcnkgPSBbXTtcclxuXHJcblx0XHR0aGlzLmNhbGNTdGF0cygpO1xyXG5cdFx0dGhpcy5yZXN0b3JlKCk7XHJcblxyXG5cdFx0dGhpcy5kaXJlY3Rpb24gPSAnZG93bic7XHJcblx0XHR0aGlzLnN0YXJ0WCA9IHRoaXMueDtcclxuXHRcdHRoaXMuc3RhcnRZID0gdGhpcy55O1xyXG5cdFx0dGhpcy5kZXN0aW5hdGlvblggPSB0aGlzLng7XHJcblx0XHR0aGlzLmRlc3RpbmF0aW9uWSA9IHRoaXMueTtcclxuXHRcdHRoaXMubGVycCA9IDA7XHJcblxyXG5cdFx0dGhpcy5pc01vdmluZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy5pc1J1bm5pbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMubW92ZVNwZWVkID0gMi41O1xyXG5cdFx0dGhpcy5tb3ZlbWVudFRpbWVyID0gMDtcclxuXHRcdHRoaXMubGF6aW5lc3MgPSAwO1xyXG5cclxuXHRcdHRoaXMuaXNBdHRhY2tpbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMuYXR0YWNrU3BlZWQgPSAxO1xyXG5cdFx0dGhpcy5hdHRhY2tUaW1lciA9IDA7XHRcclxuXHRcdHRoaXMudGFyZ2V0ID0gbnVsbDtcclxuXHRcdHRoaXMua2lsbHMgPSAwO1xyXG5cdFx0dGhpcy5kZWF0aHMgPSAwO1xyXG5cclxuXHRcdHRoaXMuaXNEZWFkID0gZmFsc2U7XHJcblx0XHR0aGlzLnJlc3Bhd25UaW1lciA9IDA7XHJcblx0XHR0aGlzLnJlc3Bhd25TcGVlZCA9IDEwO1xyXG5cdFx0dGhpcy5yZXNwYXduTWFwID0gbWFwSWQ7XHJcblx0XHR0aGlzLnJlc3Bhd25YID0geDtcclxuXHRcdHRoaXMucmVzcGF3blkgPSB5O1xyXG5cdH1cclxuXHRcclxuXHQvLyBDaGFyYWN0ZXIgU3RhdHNcclxuXHRnZXQgZGFtYWdlKCkge1xyXG5cdFx0aWYgKHRoaXMuZGFtYWdlQmFzZSArIHRoaXMuZGFtYWdlQm9udXMgPCAwKSB7XHJcblx0XHRcdHJldHVybiAwO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmRhbWFnZUJhc2UgKyB0aGlzLmRhbWFnZUJvbnVzO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRnZXQgZGVmZW5jZSgpIHtcclxuXHRcdGlmICh0aGlzLmRlZmVuY2VCYXNlICsgdGhpcy5kZWZlbmNlQm9udXMgPCAwKSB7XHJcblx0XHRcdHJldHVybiAwO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmRlZmVuY2VCYXNlICsgdGhpcy5kZWZlbmNlQm9udXM7XHJcblx0XHR9XHJcblx0fVxyXG5cdGdldCBoZWFsdGhNYXgoKSB7XHJcblx0XHRpZiAodGhpcy5oZWFsdGhNYXhCYXNlICsgdGhpcy5oZWFsdGhNYXhCb251cyA8IDEpIHtcclxuXHRcdFx0cmV0dXJuIDE7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuaGVhbHRoTWF4QmFzZSArIHRoaXMuaGVhbHRoTWF4Qm9udXM7XHJcblx0XHR9XHJcblx0fVxyXG5cdGdldCBlbmVyZ3lNYXgoKSB7XHJcblx0XHRpZiAodGhpcy5lbmVyZ3lNYXhCYXNlICsgdGhpcy5lbmVyZ3lNYXhCb251cyA8IDApIHtcclxuXHRcdFx0cmV0dXJuIDA7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuZW5lcmd5TWF4QmFzZSArIHRoaXMuZW5lcmd5TWF4Qm9udXM7XHJcblx0XHR9XHJcblx0fVxyXG5cdGdldCByYW5nZSgpIHtcclxuXHRcdGlmICh0aGlzLnJhbmdlQmFzZSArIHRoaXMucmFuZ2VCb251cyA8IDEpIHtcclxuXHRcdFx0cmV0dXJuIDE7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMucmFuZ2VCYXNlICsgdGhpcy5yYW5nZUJvbnVzO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Y2FsY0Jhc2VTdGF0cygpIHtcdC8vIENsYXNzIGFuZCBMZXZlbFxyXG5cdFx0Ly9UT0RPOiBjaGVjayBkYiBmb3IgY2xhc3Mgc3RhdHM6IGJhc2UgYW5kIGluY3JlYXNlIHBlciBsZXZlbFxyXG5cdFx0Ly8gdGhpcy5kYW1hZ2VCYXNlID0gcGxheWVyQ2xhc3MuZGFtYWdlQmFzZSArIChwbGF5ZXJDbGFzcy5pbmNyZWFzZVBlckxldmVsLmRhbWFnZSAqIHRoaXMubGV2ZWwpO1xyXG5cdFx0dGhpcy5kYW1hZ2VCYXNlID0gNTtcclxuXHRcdHRoaXMuZGVmZW5jZUJhc2UgPSAwO1xyXG5cdFx0dGhpcy5oZWFsdGhNYXhCYXNlID0gMTA7XHJcblx0XHR0aGlzLmVuZXJneU1heEJhc2UgPSA0MDtcclxuXHRcdHRoaXMucmFuZ2VCYXNlID0gMTtcclxuXHR9XHJcblxyXG5cdGNhbGNJdGVtQm9udXMoKSB7XHJcblx0XHRsZXQgaXRlbUJvbnVzID0ge1xyXG5cdFx0XHRkYW1hZ2U6IDAsXHJcblx0XHRcdGRlZmVuY2U6IDAsXHJcblx0XHRcdGhlYWx0aE1heDogMCxcclxuXHRcdFx0ZW5lcmd5TWF4OiAwLFxyXG5cdFx0XHRyYW5nZTogMFxyXG5cdFx0fTtcclxuXHJcblx0XHQvLyBGb3IgZWFjaCBpdGVtIGluIGludmVudG9yeSBjaGVjayBmb3IgYm9udXNlc1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCAoY29uZmlnLklOVkVOVE9SWV9TSVpFICsgY29uZmlnLkVRVUlQTUVOVF9TSVpFKTsgaSsrKSB7XHJcblx0XHRcdGxldCBpdGVtID0gdGhpcy5pbnZlbnRvcnlbaV07XHJcblx0XHRcdGlmIChpdGVtICYmICFpdGVtLnJlbW92ZSkge1xyXG5cdFx0XHRcdGl0ZW1Cb251cy5kYW1hZ2UgKz0gaXRlbS5wYXNzaXZlRGFtYWdlO1xyXG5cdFx0XHRcdGl0ZW1Cb251cy5kZWZlbmNlICs9IGl0ZW0ucGFzc2l2ZURlZmVuY2U7XHJcblx0XHRcdFx0aXRlbUJvbnVzLmhlYWx0aE1heCArPSBpdGVtLnBhc3NpdmVIZWFsdGhNYXg7XHJcblx0XHRcdFx0aXRlbUJvbnVzLmVuZXJneU1heCArPSBpdGVtLnBhc3NpdmVFbmVyZ3lNYXg7XHJcblx0XHRcdFx0aXRlbUJvbnVzLnJhbmdlICs9IGl0ZW0ucGFzc2l2ZVJhbmdlO1xyXG5cclxuXHRcdFx0XHRpZiAoaSA+PSBjb25maWcuSU5WRU5UT1JZX1NJWkUpIHtcclxuXHRcdFx0XHRcdGl0ZW1Cb251cy5kYW1hZ2UgKz0gaXRlbS5lcXVpcERhbWFnZTtcclxuXHRcdFx0XHRcdGl0ZW1Cb251cy5kZWZlbmNlICs9IGl0ZW0uZXF1aXBEZWZlbmNlO1xyXG5cdFx0XHRcdFx0aXRlbUJvbnVzLmhlYWx0aE1heCArPSBpdGVtLmVxdWlwSGVhbHRoTWF4O1xyXG5cdFx0XHRcdFx0aXRlbUJvbnVzLmVuZXJneU1heCArPSBpdGVtLmVxdWlwRW5lcmd5TWF4O1xyXG5cdFx0XHRcdFx0aXRlbUJvbnVzLnJhbmdlICs9IGl0ZW0uZXF1aXBSYW5nZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIGl0ZW1Cb251cztcclxuXHR9XHJcblxyXG5cdGNhbGNFZmZlY3RCb251cygpIHtcclxuXHRcdGxldCBlZmZlY3RCb251cyA9IHtcclxuXHRcdFx0ZGFtYWdlOiAwLFxyXG5cdFx0XHRkZWZlbmNlOiAwLFxyXG5cdFx0XHRoZWFsdGhNYXg6IDAsXHJcblx0XHRcdGVuZXJneU1heDogMCxcclxuXHRcdFx0cmFuZ2U6IDBcclxuXHRcdH07XHJcblxyXG5cdFx0Ly8gVE9ETzogd29yayBvdXQgaG93IHRvIGRvIGVmZmVjdHMgZm9yIHNwZWxscyBhbmQgcG90aW9uc1xyXG5cdFx0cmV0dXJuIGVmZmVjdEJvbnVzO1xyXG5cdH1cclxuXHRcclxuXHRjYWxjQm9udXNTdGF0cygpIHtcdC8vIEl0ZW1zIChlcXVpcHBlZCBhbmQgcGFzc2l2ZSkgYW5kIEVmZmVjdHMgKHNwZWxscyBhbmQgcG90aW9ucylcclxuXHRcdGxldCBpdGVtQm9udXMgPSB0aGlzLmNhbGNJdGVtQm9udXMoKTtcclxuXHRcdGxldCBlZmZlY3RCb251cyA9IHRoaXMuY2FsY0VmZmVjdEJvbnVzKCk7XHJcblxyXG5cdFx0dGhpcy5kYW1hZ2VCb251cyA9IGl0ZW1Cb251cy5kYW1hZ2UgKyBlZmZlY3RCb251cy5kYW1hZ2U7XHJcblx0XHR0aGlzLmRlZmVuY2VCb251cyA9IGl0ZW1Cb251cy5kZWZlbmNlICsgZWZmZWN0Qm9udXMuZGVmZW5jZTtcclxuXHRcdHRoaXMuaGVhbHRoTWF4Qm9udXMgPSBpdGVtQm9udXMuaGVhbHRoTWF4ICsgZWZmZWN0Qm9udXMuaGVhbHRoTWF4O1xyXG5cdFx0dGhpcy5lbmVyZ3lNYXhCb251cyA9IGl0ZW1Cb251cy5lbmVyZ3lNYXggKyBlZmZlY3RCb251cy5lbmVyZ3lNYXg7XHJcblx0XHR0aGlzLnJhbmdlQm9udXMgPSBpdGVtQm9udXMucmFuZ2UgKyBlZmZlY3RCb251cy5yYW5nZTtcclxuXHR9XHJcblxyXG5cdGNhbGNTdGF0cygpIHtcclxuXHRcdHRoaXMuY2FsY0Jhc2VTdGF0cygpO1xyXG5cdFx0dGhpcy5jYWxjQm9udXNTdGF0cygpO1xyXG5cdH1cclxuXHJcblx0cmVzdG9yZSgpIHtcclxuXHRcdHRoaXMuaGVhbHRoID0gdGhpcy5oZWFsdGhNYXg7XHJcblx0XHR0aGlzLmVuZXJneSA9IHRoaXMuZW5lcmd5TWF4O1xyXG5cdH1cclxuXHRcclxuXHQvLyBNb3ZlbWVudFxyXG5cdG1vdmUoZGlyZWN0aW9uKSB7XHJcblx0XHRpZiAodGhpcy5pc01vdmluZykgcmV0dXJuO1xyXG5cclxuXHRcdGlmIChkaXJlY3Rpb24pIHtcclxuXHRcdFx0dGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGRpcmVjdGlvbiA9PT0gJ2xlZnQnKSB7XHJcblx0XHRcdGlmICghZ2FtZS5pc1ZhY2FudCh0aGlzLm1hcElkLCB0aGlzLnggLSAxLCB0aGlzLnkpKSByZXR1cm47XHJcblx0XHRcdHRoaXMuZGVzdGluYXRpb25YLS07XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdyaWdodCcpIHtcclxuXHRcdFx0aWYgKCFnYW1lLmlzVmFjYW50KHRoaXMubWFwSWQsIHRoaXMueCArIDEsIHRoaXMueSkpIHJldHVybjtcclxuXHRcdFx0dGhpcy5kZXN0aW5hdGlvblgrKztcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ3VwJykge1xyXG5cdFx0XHRpZiAoIWdhbWUuaXNWYWNhbnQodGhpcy5tYXBJZCwgdGhpcy54LCB0aGlzLnkgLSAxKSkgcmV0dXJuO1xyXG5cdFx0XHR0aGlzLmRlc3RpbmF0aW9uWS0tO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoZGlyZWN0aW9uID09PSAnZG93bicpIHtcclxuXHRcdFx0aWYgKCFnYW1lLmlzVmFjYW50KHRoaXMubWFwSWQsIHRoaXMueCwgdGhpcy55ICsgMSkpIHJldHVybjtcclxuXHRcdFx0dGhpcy5kZXN0aW5hdGlvblkrKztcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRzd2l0Y2ggKHV0aWwucmFuZG9tSW50KDAsIDMgKyB0aGlzLmxhemluZXNzKSkge1xyXG5cdFx0XHRcdGNhc2UgMDogdGhpcy5tb3ZlKCdsZWZ0Jyk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAxOiB0aGlzLm1vdmUoJ3JpZ2h0Jyk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAyOiB0aGlzLm1vdmUoJ3VwJyk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAzOiB0aGlzLm1vdmUoJ2Rvd24nKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRkZWZhdWx0OiAvLyBEb24ndCBNb3ZlXHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFNldCBtb3ZlIHNwZWVkXHJcblx0XHRpZiAodGhpcy5pc1J1bm5pbmcpIHtcclxuXHRcdFx0aWYgKHRoaXMuZW5lcmd5ID4gMCkge1xyXG5cdFx0XHRcdHRoaXMuZW5lcmd5LS07XHJcblx0XHRcdFx0dGhpcy5tb3ZlU3BlZWQgPSA0O1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMuZW5lcmd5ID0gMDtcclxuXHRcdFx0XHR0aGlzLm1vdmVTcGVlZCA9IDIuNTtcclxuXHRcdFx0XHR0aGlzLmlzUnVubmluZyA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0dGhpcy5tb3ZlU3BlZWQgPSAyLjU7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHRoaXMuaXNNb3ZpbmcgPSB0cnVlO1xyXG5cdH1cclxuXHRcclxuXHRtb3ZlVG9UYXJnZXQodGFyZ2V0LCBob3N0aWxlKSB7XHJcblx0XHRpZiAoIXRhcmdldCkgcmV0dXJuO1xyXG5cdFx0XHJcblx0XHRpZiAodGFyZ2V0LnggPT09IHRoaXMueCAmJiB0YXJnZXQueSA9PT0gdGhpcy55KSB7XHJcblx0XHRcdHRoaXMubW92ZSgpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAodXRpbC5yYW5kb21JbnQoMCwgMSkgPT09IDApIHtcclxuXHRcdFx0aWYgKHRhcmdldC54IDwgdGhpcy54KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID49ICh0aGlzLnggLSB0aGlzLnJhbmdlKSAmJiB0YXJnZXQueSA9PT0gdGhpcy55KSB7XHJcblx0XHRcdFx0XHRpZiAoaG9zdGlsZSkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdsZWZ0JztcclxuXHRcdFx0XHRcdFx0aWYgKCF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ2xlZnQnKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSgnbGVmdCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICh0YXJnZXQueCA+IHRoaXMueCkge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICsgdGhpcy5yYW5nZSAmJiB0YXJnZXQueSA9PT0gdGhpcy55KSB7XHJcblx0XHRcdFx0XHRpZiAoaG9zdGlsZSkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdyaWdodCc7XHJcblx0XHRcdFx0XHRcdGlmICghdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCdyaWdodCcpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCdyaWdodCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICh0YXJnZXQueSA8IHRoaXMueSkge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICYmIHRhcmdldC55ID09PSB0aGlzLnkgLSB0aGlzLnJhbmdlKSB7XHJcblx0XHRcdFx0XHRpZiAoaG9zdGlsZSkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICd1cCc7XHJcblx0XHRcdFx0XHRcdGlmICghdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCd1cCcpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCd1cCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICh0YXJnZXQueSA+IHRoaXMueSkge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICYmIHRhcmdldC55ID09PSB0aGlzLnkgKyB0aGlzLnJhbmdlKSB7XHJcblx0XHRcdFx0XHRpZiAoaG9zdGlsZSkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdkb3duJztcclxuXHRcdFx0XHRcdFx0aWYgKCF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ2Rvd24nKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSgnZG93bicpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGlmICh0YXJnZXQueSA+IHRoaXMueSkge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICYmIHRhcmdldC55ID09PSB0aGlzLnkgKyB0aGlzLnJhbmdlKSB7XHJcblx0XHRcdFx0XHRpZiAoaG9zdGlsZSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmF0dGFjaygnZG93bicpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCdkb3duJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHRhcmdldC55IDwgdGhpcy55KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggJiYgdGFyZ2V0LnkgPT09IHRoaXMueSAtIHRoaXMucmFuZ2UpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlKSB7XHJcblx0XHRcdFx0XHRcdGlmICghdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCd1cCcpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCd1cCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICh0YXJnZXQueCA+IHRoaXMueCkge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICsgdGhpcy5yYW5nZSAmJiB0YXJnZXQueSA9PT0gdGhpcy55KSB7XHJcblx0XHRcdFx0XHRpZiAoaG9zdGlsZSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmF0dGFjaygncmlnaHQnKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSgncmlnaHQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodGFyZ2V0LnggPCB0aGlzLngpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LnggPj0gKHRoaXMueCAtIHRoaXMucmFuZ2UpICYmIHRhcmdldC55ID09PSB0aGlzLnkpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlKSB7XHJcblx0XHRcdFx0XHRcdGlmICghdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCdsZWZ0Jyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ2xlZnQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0Ly8gQ29tYmF0XHJcblx0Y2hlY2tJblJhbmdlKGRpcmVjdGlvbiwgdGFyZ2V0LCByYW5nZSkge1xyXG5cdFx0aWYgKHRhcmdldC5tYXBJZCAhPT0gdGhpcy5tYXBJZCkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggJiYgdGFyZ2V0LnkgPT09IHRoaXMueSkgcmV0dXJuIGZhbHNlO1x0Ly8gU3RhY2tlZCBkb2VzIG5vdCBjb3VudCBhcyBpbiByYW5nZVxyXG5cdFx0XHJcblx0XHRpZiAodGFyZ2V0LnkgPT09IHRoaXMueSkge1xyXG5cdFx0XHRpZiAoZGlyZWN0aW9uID09PSAnbGVmdCcpIHtcclxuXHRcdFx0XHRpZiAodGhpcy54ID09PSAwKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0cmV0dXJuICh0YXJnZXQueCA8IHRoaXMueCAmJiB0YXJnZXQueCA+PSAodGhpcy54IC0gcmFuZ2UpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAoZGlyZWN0aW9uID09PSAncmlnaHQnKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMueCA9PT0gY29uZmlnLk1BUF9DT0xVTU5TIC0gMSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHJldHVybiAodGFyZ2V0LnggPiB0aGlzLnggJiYgdGFyZ2V0LnggPD0gKHRoaXMueCArIHJhbmdlKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmICh0YXJnZXQueCA9PT0gdGhpcy54KSB7XHJcblx0XHRcdGlmIChkaXJlY3Rpb24gPT09ICd1cCcpIHtcclxuXHRcdFx0XHRpZiAodGhpcy55ID09PSAwKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0cmV0dXJuICh0YXJnZXQueSA8IHRoaXMueSAmJiB0YXJnZXQueSA+PSAodGhpcy55IC0gcmFuZ2UpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAoZGlyZWN0aW9uID09PSAnZG93bicpIHtcclxuXHRcdFx0XHRpZiAodGhpcy55ID09PSBjb25maWcuTUFQX1JPV1MgLSAxKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0cmV0dXJuICh0YXJnZXQueSA+IHRoaXMueSAmJiB0YXJnZXQueSA8PSAodGhpcy55ICsgcmFuZ2UpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0YXR0YWNrKG51bVRhcmdldHMgPSAxLCBkaXJlY3Rpb24gPSB0aGlzLmRpcmVjdGlvbikge1xyXG5cdFx0aWYgKHRoaXMuaXNBdHRhY2tpbmcgfHwgdGhpcy5hdHRhY2tUaW1lciA+IDApIHJldHVybjtcclxuXHJcblx0XHR0aGlzLmlzQXR0YWNraW5nID0gdHJ1ZTtcclxuXHRcdC8vIGdhbWUuc3Bhd25NYXBJdGVtKHRoaXMubWFwSWQsIHRoaXMueCwgdGhpcy55LCAxKTtcclxuXHRcdC8vIGdhbWUuc3Bhd25EYW1hZ2VUZXh0KHRoaXMubWFwSWQsIHRoaXMueCwgdGhpcy55LCB0aGlzLmRhbWFnZSk7IC8vdGVzdFxyXG5cdFx0XHJcblx0XHRsZXQgYWN0b3JMaXN0ID0gZ2FtZS5wbGF5ZXJMaXN0LmNvbmNhdChnYW1lLm1hcExpc3RbdGhpcy5tYXBJZF0uYm90cyk7XHJcblx0XHRsZXQgdGFyZ2V0TGlzdCA9IGFjdG9yTGlzdC5maWx0ZXIoKGFjdG9yKSA9PiB7XHJcblx0XHRcdGlmIChhY3RvciA9PT0gdGhpcyB8fCBhY3Rvci5pc0RlYWQpIHJldHVybiBmYWxzZTtcclxuXHRcdFx0aWYgKHRoaXMuY2hlY2tJblJhbmdlKGRpcmVjdGlvbiwgYWN0b3IsIHRoaXMucmFuZ2UpKSByZXR1cm4gdHJ1ZTtcclxuXHRcdH0pO1xyXG5cdFx0XHJcblx0XHR0YXJnZXRMaXN0LnNvcnQoKGEsIGIpID0+IHtcclxuXHRcdFx0cmV0dXJuIChhLnogLSBiLnopO1x0Ly8gTG93ZXN0IHRvIGhpZ2hlc3RcclxuXHRcdH0pO1xyXG5cdFx0XHJcblx0XHR0YXJnZXRMaXN0ID0gdGFyZ2V0TGlzdC5zcGxpY2UoLW51bVRhcmdldHMpO1xyXG5cdFx0XHJcblx0XHR0YXJnZXRMaXN0LmZvckVhY2goKHRhcmdldCkgPT4ge1xyXG5cdFx0XHR0YXJnZXQudGFrZURhbWFnZSh0aGlzLmRhbWFnZSwgdGhpcyk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0XHJcblx0dGFrZURhbWFnZShkYW1hZ2UsIHNvdXJjZSkge1xyXG5cdFx0ZGFtYWdlIC09IHRoaXMuZGVmZW5jZTtcclxuXHRcdGlmIChkYW1hZ2UgPCAwKSB7XHJcblx0XHRcdGRhbWFnZSA9IDA7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0dGhpcy5oZWFsdGggLT0gZGFtYWdlO1xyXG5cdFx0XHRpZiAodGhpcy5oZWFsdGggPD0gMCkge1xyXG5cdFx0XHRcdHRoaXMuc2V0RGVhZChzb3VyY2UuY29udHJvbGxlciwgc291cmNlLm5hbWUpO1xyXG5cdFx0XHRcdHNvdXJjZS5raWxscysrO1xyXG5cdFx0XHRcdGlmIChzb3VyY2UudGFyZ2V0ID09PSB0aGlzKSBzb3VyY2UudGFyZ2V0ID0gbnVsbDtcclxuXHRcdFx0fVxyXG5cdFx0XHRjb25zb2xlLmxvZyhgJHtzb3VyY2UubmFtZX0gaGl0cyAke3RoaXMubmFtZX0gZm9yICR7ZGFtYWdlfSBkYW1hZ2UuYCk7XHJcblx0XHR9XHJcblx0XHRnYW1lLnNwYXduRGFtYWdlVGV4dCh0aGlzLm1hcElkLCB0aGlzLngsIHRoaXMueSwgZGFtYWdlKTtcclxuXHR9XHJcblx0XHJcblx0cmVzcGF3bigpIHtcclxuXHRcdGdhbWUuc2VuZFNlcnZlck1lc3NhZ2UodGhpcy5uYW1lICsgXCIgaXMgYmFjayBmcm9tIHRoZSBkZWFkLlwiKTtcclxuXHJcblx0XHR0aGlzLm1hcElkID0gdGhpcy5yZXNwYXduTWFwO1xyXG5cdFx0dGhpcy54ID0gdGhpcy5yZXNwYXduWDtcclxuXHRcdHRoaXMueSA9IHRoaXMucmVzcGF3blk7XHJcblx0XHR0aGlzLnN0YXJ0WCA9IHRoaXMucmVzcGF3blg7XHJcblx0XHR0aGlzLnN0YXJ0WSA9IHRoaXMucmVzcGF3blk7XHJcblx0XHR0aGlzLmRlc3RpbmF0aW9uWCA9IHRoaXMucmVzcGF3blg7XHJcblx0XHR0aGlzLmRlc3RpbmF0aW9uWSA9IHRoaXMucmVzcGF3blk7XHJcblx0XHRcclxuXHRcdHRoaXMuY2FsY0JvbnVzU3RhdHMoKTtcclxuXHRcdHRoaXMucmVzdG9yZSgpO1xyXG5cdFx0XHJcblx0XHR0aGlzLmlzV2Fsa2luZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy5pc1J1bm5pbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMuaXNBdHRhY2tpbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMuaXNEZWFkID0gZmFsc2U7XHJcblx0XHR0aGlzLnJlc3Bhd25UaW1lciA9IDA7XHJcblx0fVxyXG5cdFxyXG5cdHNldERlYWQoa2lsbGVyQ29udHJvbGxlciwga2lsbGVyTmFtZSkge1xyXG5cdFx0bGV0IG1hcCA9IGdhbWUubWFwTGlzdFt0aGlzLm1hcElkXTtcclxuXHJcblx0XHQvLyBJbnZlbnRvcnkgSXRlbSBEcm9wIENoYW5jZVxyXG5cdFx0bGV0IGRyb3BDaGFuY2UgPSB1dGlsLmNsYW1wKG1hcC5kcm9wQ2hhbmNlLCAwLCAxMDApO1xyXG5cdFx0aWYgKGRyb3BDaGFuY2UgPiAwKSB7XHJcblx0XHRcdGxldCBpdGVtcyA9IHRoaXMuaW52ZW50b3J5LmZpbHRlcigoaXRlbSkgPT4ge1xyXG5cdFx0XHRcdGlmIChpdGVtLnNsb3QgPCBjb25maWcuSU5WRU5UT1JZX1NJWkUpIHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XHJcblx0XHRcdFx0aWYgKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMSkgPD0gZHJvcENoYW5jZSkge1xyXG5cdFx0XHRcdFx0dGhpcy5kcm9wSXRlbShpdGVtLnNsb3QpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gRXF1aXBwZWQgSXRlbSBEcm9wIEFtb3VudFxyXG5cdFx0bGV0IGRyb3BBbW91bnRFUSA9IHV0aWwuY2xhbXAobWFwLmRyb3BBbW91bnRFUSwgMCwgY29uZmlnLkVRVUlQTUVOVF9TSVpFKTtcclxuXHRcdGlmIChkcm9wQW1vdW50RVEgPiAwKSB7XHJcblx0XHRcdGxldCBlcXVpcG1lbnQgPSB0aGlzLmludmVudG9yeS5maWx0ZXIoKGl0ZW0pID0+IHtcclxuXHRcdFx0XHRpZiAoaXRlbS5zbG90ID49IGNvbmZpZy5JTlZFTlRPUllfU0laRSkgcmV0dXJuIHRydWU7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdGVxdWlwbWVudCA9IHV0aWwuc2h1ZmZsZShlcXVpcG1lbnQpO1xyXG5cdFx0XHRlcXVpcG1lbnQuc3BsaWNlKC1kcm9wQW1vdW50RVEpO1xyXG5cdFx0XHRlcXVpcG1lbnQuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuZHJvcEl0ZW0oZXF1aXBtZW50LnNsb3QpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dGhpcy5pc0RlYWQgPSB0cnVlO1xyXG5cdFx0dGhpcy5oZWFsdGggPSAwO1xyXG5cdFx0dGhpcy5lbmVyZ3kgPSAwO1xyXG5cdFx0dGhpcy5kZWF0aHMrKztcclxuXHRcdFxyXG5cdFx0aWYgKGtpbGxlckNvbnRyb2xsZXIgJiYga2lsbGVyTmFtZSkge1xyXG5cdFx0XHRpZiAoa2lsbGVyQ29udHJvbGxlciA9ICdwbGF5ZXInKSB7XHJcblx0XHRcdFx0Z2FtZS5zZW5kU2VydmVyTWVzc2FnZShraWxsZXJOYW1lICsgXCIgaGFzIG11cmRlcmVkIFwiICsgdGhpcy5uYW1lICsgXCIgaW4gY29sZCBibG9vZCFcIik7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0Z2FtZS5zZW5kU2VydmVyTWVzc2FnZSh0aGlzLm5hbWUgKyBcIiBoYXMgYmVlbiBraWxsZWQgYnkgXCIgKyBraWxsZXJOYW1lICsgXCIhXCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Z2FtZS5zZW5kU2VydmVyTWVzc2FnZSh0aGlzLm5hbWUgKyBcIiBoYXMgZGllZCFcIik7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdC8vIEludmVudG9yeVxyXG5cdHBpY2tVcCgpIHtcclxuXHRcdC8vIFNlZSBQbGF5ZXIgYW5kIEJvdCBjbGFzc2VzXHJcblx0fVxyXG5cdFxyXG5cdGdldE1hcEl0ZW0obWFwSWQsIGlkKSB7XHJcblx0XHRsZXQgaXRlbSA9IGdhbWUubWFwTGlzdFttYXBJZF0uaXRlbXNbaWRdO1xyXG5cdFx0aWYgKCFpdGVtKSByZXR1cm4gbnVsbDtcclxuXHJcblx0XHRpZiAoaXRlbS5zdGFjayA+IDApIHtcclxuXHRcdFx0bGV0IHNsb3QgPSB0aGlzLmZpbmRJdGVtU2xvdChpdGVtLml0ZW1DbGFzcyk7XHJcblx0XHRcdGlmIChzbG90ID49IDApIHtcclxuXHRcdFx0XHR0aGlzLmludmVudG9yeVtzbG90XS5zdGFjayArPSBpdGVtLnN0YWNrO1xyXG5cdFx0XHRcdGl0ZW0ucmVtb3ZlKCk7XHJcblx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRsZXQgc2xvdCA9IHRoaXMuZmluZEZpcnN0RW1wdHlTbG90KCk7XHJcblx0XHRyZXR1cm4gc2xvdDtcclxuXHR9XHJcblxyXG5cdGdldEl0ZW0oZGF0YSkge1xyXG5cdFx0aWYgKCFkYXRhIHx8IGRhdGEuaXRlbUNsYXNzID09IG51bGwpIHJldHVybiBudWxsO1xyXG5cclxuXHRcdGlmIChkYXRhLnN0YWNrKSB7XHJcblx0XHRcdHNsb3QgPSB0aGlzLmZpbmRJdGVtU2xvdChkYXRhLml0ZW1DbGFzcyk7XHJcblx0XHRcdGlmIChzbG90ID49IDApIHtcclxuXHRcdFx0XHR0aGlzLmludmVudG9yeVtzbG90XS5zdGFjayArPSBkYXRhLnN0YWNrO1xyXG5cdFx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuZmluZEZpcnN0RW1wdHlTbG90KCk7XHJcblx0fVxyXG5cdFxyXG5cdGRyb3BJdGVtKHNsb3QpIHtcclxuXHRcdGxldCBpdGVtID0gdGhpcy5pbnZlbnRvcnlbc2xvdF07XHJcblx0XHRpZiAoIWl0ZW0pIHJldHVybjtcclxuXHRcdFxyXG5cdFx0aWYgKHNsb3QgPj0gY29uZmlnLklOVkVOVE9SWV9TSVpFKSB7XHJcblx0XHRcdHRoaXMudW5lcXVpcEl0ZW0oc2xvdCk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpdGVtLm1vdmVUb01hcCh0aGlzLm1hcElkLCB0aGlzLngsIHRoaXMueSk7XHJcblx0fVxyXG5cdFxyXG5cdHVzZUl0ZW0oc2xvdCkge1xyXG5cdFx0bGV0IGl0ZW0gPSB0aGlzLmludmVudG9yeVtzbG90XTtcclxuXHRcdGlmICghaXRlbSkgcmV0dXJuO1xyXG5cclxuXHRcdC8vIGlmICghZGIuaXRlbXNbaXRlbS5pZF0udXNlLmNhbGwodGhpcywgc2xvdCkpIHJldHVybjtcdC8vIFJ1biAndXNlJyBzY3JpcHRcclxuXHRcdFxyXG5cdFx0aWYgKGl0ZW0uaXNFcXVpcG1lbnQoKSkge1x0Ly8gRXF1aXBtZW50IEl0ZW1zXHJcblx0XHRcdGlmIChzbG90IDwgY29uZmlnLklOVkVOVE9SWV9TSVpFKSB7XHQvLyBDaGVjayBpZiBpdGVtIGlzIGVxdWlwcGVkXHJcblx0XHRcdFx0dGhpcy5lcXVpcEl0ZW0oc2xvdCk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0dGhpcy51bmVxdWlwSXRlbShzbG90KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGl0ZW0ucmV1c2FibGUpIHJldHVybjtcclxuXHRcdFxyXG5cdFx0aWYgKGl0ZW0uc3RhY2sgPiAxKSB7XHJcblx0XHRcdGl0ZW0uc3RhY2stLTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGl0ZW0ucmVtb3ZlKCk7XHJcblx0fVxyXG5cdFxyXG5cdGhhc0l0ZW0oaXRlbUNsYXNzKSB7XHJcblx0XHRsZXQgY291bnQgPSAwO1xyXG5cdFx0Zm9yIChsZXQgc2xvdCA9IDA7IHNsb3QgPCBjb25maWcuSU5WRU5UT1JZX1NJWkUgKyBjb25maWcuRVFVSVBNRU5UX1NJWkU7IHNsb3QrKykge1xyXG5cdFx0XHRpZiAodGhpcy5pbnZlbnRvcnlbc2xvdF0pIHtcclxuXHRcdFx0XHRpZiAodGhpcy5pbnZlbnRvcnlbc2xvdF0uaXRlbUNsYXNzID09PSBpdGVtQ2xhc3MpIHtcclxuXHRcdFx0XHRcdGNvdW50Kys7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY291bnQ7XHJcblx0fVxyXG5cclxuXHRmaW5kSXRlbVNsb3QoaXRlbUNsYXNzKSB7XHJcblx0XHRsZXQgc2xvdCA9IG51bGw7XHJcblx0XHRmb3IgKGxldCBjaGVja1Nsb3QgPSAwOyBjaGVja1Nsb3QgPCBjb25maWcuSU5WRU5UT1JZX1NJWkUgKyBjb25maWcuRVFVSVBNRU5UX1NJWkU7IGNoZWNrU2xvdCsrKSB7XHJcblx0XHRcdGlmICh0aGlzLmludmVudG9yeVtjaGVja1Nsb3RdKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuaW52ZW50b3J5W2NoZWNrU2xvdF0uaXRlbUNsYXNzID09PSBpdGVtQ2xhc3MpIHtcclxuXHRcdFx0XHRcdHNsb3QgPSBjaGVja1Nsb3Q7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBzbG90O1xyXG5cdH1cclxuXHRcclxuXHRtb3ZlSXRlbVRvU2xvdChzbG90LCBuZXdTbG90KSB7XHJcblx0XHRpZiAoc2xvdCA9PSBudWxsIHx8IG5ld1Nsb3QgPT0gbnVsbCB8fCBzbG90ID09PSBuZXdTbG90KSByZXR1cm47XHQvLyBudWxsID09IHVuZGVmaW5lZCwgbnVsbCAhPSAwXHJcblx0XHRpZiAoc2xvdCA+PSBjb25maWcuSU5WRU5UT1JZX1NJWkUgKyBjb25maWcuRVFVSVBNRU5UX1NJWkUpIHJldHVybjtcclxuXHRcdGlmIChuZXdTbG90ID49IGNvbmZpZy5JTlZFTlRPUllfU0laRSArIGNvbmZpZy5FUVVJUE1FTlRfU0laRSkgcmV0dXJuO1xyXG5cclxuXHRcdGxldCBpdGVtID0gdGhpcy5pbnZlbnRvcnlbc2xvdF07XHJcblx0XHRsZXQgbmV3SXRlbSA9IHRoaXMuaW52ZW50b3J5W25ld1Nsb3RdO1xyXG5cdFx0aWYgKCFpdGVtKSByZXR1cm47XHJcblxyXG5cdFx0ZnVuY3Rpb24gc3dhcFNsb3RzKCkge1xyXG5cdFx0XHRpdGVtLnNsb3QgPSBuZXdTbG90O1xyXG5cdFx0XHRpZiAobmV3SXRlbSkgbmV3SXRlbS5zbG90ID0gc2xvdDtcclxuXHRcdFx0dXRpbC5zd2FwKHRoaXMuaW52ZW50b3J5LCBzbG90LCBuZXdTbG90KTtcclxuXHRcdFx0dGhpcy5jYWxjQm9udXNTdGF0cygpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRpZiAobmV3U2xvdCA+PSBjb25maWcuSU5WRU5UT1JZX1NJWkUpIHtcdC8vIFRhcmdldCBzbG90IGlzIGZvciBlcXVpcG1lbnRcclxuXHRcdFx0aWYgKCFpdGVtLmNhbkVxdWlwKG5ld1Nsb3QpKSB7XHJcblx0XHRcdFx0Z2FtZS5zZW5kUGxheWVyTWVzc2FnZSh0aGlzLmlkLCBcIlRoYXQgY2Fubm90IGJlIGVxdWlwcGVkIHRoZXJlLlwiKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyBObyBuZXcgaXRlbSBpbiBuZXcgc2xvdFxyXG5cdFx0aWYgKCFuZXdJdGVtKSB7XHJcblx0XHRcdHN3YXBTbG90cygpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gTmV3IGl0ZW0gaW4gbmV3IHNsb3QsIG9sZCBpdGVtIGluIGludmVudG9yeVxyXG5cdFx0aWYgKHNsb3QgPCBjb25maWcuSU5WRU5UT1JZX1NJWkUpIHtcclxuXHRcdFx0c3dhcFNsb3RzKCk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBPbGQgaXRlbSBpcyBlcXVpcHBlZCwgbmV3IGl0ZW0gaXMgZXF1aXBwZWRcclxuXHRcdGlmIChuZXdTbG90ID49IGNvbmZpZy5JTlZFTlRPUllfU0laRSkge1xyXG5cdFx0XHRzd2FwU2xvdHMoKTtcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gT2xkIGl0ZW0gaXMgZXF1aXBwZWQsIG5ldyBpdGVtIGluIGludmVudG9yeSwgc2FtZSBpdGVtIHR5cGVcclxuXHRcdGlmIChuZXdJdGVtLnR5cGUgPT09IGl0ZW0udHlwZSkge1xyXG5cdFx0XHRzd2FwU2xvdHMoKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIE9sZCBpdGVtIGlzIGVxdWlwcGVkLCBuZXcgaXRlbSBpbiBpbnZlbnRvcnksIGRpZmZlcmVudCB0eXBlc1xyXG5cdFx0bmV3U2xvdCA9IHRoaXMuZmluZEZpcnN0RW1wdHlTbG90KCk7XHJcblx0XHRpZiAobmV3U2xvdCA9PSBudWxsKSB7XHJcblx0XHRcdGdhbWUuc2VuZFBsYXllck1lc3NhZ2UodGhpcy5pZCwgXCJZb3VyIGludmVudG9yeSBpcyBmdWxsLlwiKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHN3YXBTbG90cygpO1xyXG5cdH1cclxuXHJcblx0ZXF1aXBJdGVtKHNsb3QpIHtcclxuXHRcdGxldCBuZXdTbG90ID0gbnVsbDtcclxuXHRcdGZvciAobGV0IGkgPSBjb25maWcuSU5WRU5UT1JZX1NJWkU7IGkgPCBjb25maWcuRVFVSVBNRU5UX1NJWkU7IGkrKykge1xyXG5cdFx0XHRpZiAoaXRlbS5jYW5FcXVpcChpKSkge1xyXG5cdFx0XHRcdG5ld1Nsb3QgPSBpO1xyXG5cdFx0XHRcdGlmICghdGhpcy5pbnZlbnRvcnlbaV0pIGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRpZiAobmV3U2xvdCA9PT0gbnVsbCkgcmV0dXJuO1xyXG5cclxuXHRcdHRoaXMubW92ZUl0ZW1Ub1Nsb3Qoc2xvdCwgbmV3U2xvdCk7XHJcblx0fVxyXG5cclxuXHR1bmVxdWlwSXRlbShzbG90KSB7XHJcblx0XHRpZiAoc2xvdCA8IGNvbmZpZy5JTlZFTlRPUllfU0laRSkgcmV0dXJuO1xyXG5cdFx0aWYgKCF0aGlzLmludmVudG9yeVtzbG90XSkgcmV0dXJuO1xyXG5cdFx0XHJcblx0XHRsZXQgbmV3U2xvdCA9IHRoaXMuZmluZEZpcnN0RW1wdHlTbG90KCk7XHJcblx0XHRpZiAobmV3U2xvdCA9PSBudWxsKSB7XHJcblx0XHRcdGdhbWUuc2VuZFBsYXllck1lc3NhZ2UodGhpcy5pZCwgXCJZb3VyIGludmVudG9yeSBpcyBmdWxsLlwiKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMubW92ZUl0ZW1Ub1Nsb3Qoc2xvdCwgbmV3U2xvdCk7XHJcblx0fVxyXG5cdFxyXG5cdGZpbmRGaXJzdEVtcHR5U2xvdCgpIHtcclxuXHRcdGZvciAobGV0IHNsb3QgPSAwOyBzbG90IDwgY29uZmlnLklOVkVOVE9SWV9TSVpFOyBzbG90KyspIHtcclxuXHRcdFx0aWYgKHRoaXMuaW52ZW50b3J5W3Nsb3RdID09IG51bGwpIHJldHVybiBzbG90O1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fVxyXG5cclxuXHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHQvLyBJbnZlbnRvcnkgSXRlbSBVcGRhdGVcclxuXHRcdHRoaXMuaW52ZW50b3J5LmZvckVhY2goKGl0ZW0pID0+IHtcclxuXHRcdFx0aXRlbS51cGRhdGUoKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8vIFJlc3Bhd25pbmdcclxuXHRcdGlmICh0aGlzLmlzRGVhZCkge1xyXG5cdFx0XHR0aGlzLnJlc3Bhd25UaW1lciArPSBkZWx0YTtcclxuXHRcdFx0aWYgKHRoaXMucmVzcGF3blRpbWVyID49IHRoaXMucmVzcGF3blNwZWVkKSB0aGlzLnJlc3Bhd24oKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBBdHRhY2tpbmdcclxuXHRcdGlmICh0aGlzLmlzQXR0YWNraW5nIHx8IHRoaXMuYXR0YWNrVGltZXIgPiAwKSB7XHJcblx0XHRcdHRoaXMuYXR0YWNrVGltZXIgKz0gZGVsdGE7XHJcblx0XHRcdGlmICh0aGlzLmF0dGFja1RpbWVyID49IDAuMykgdGhpcy5pc0F0dGFja2luZyA9IGZhbHNlO1xyXG5cdFx0XHRpZiAodGhpcy5hdHRhY2tUaW1lciA+PSB0aGlzLmF0dGFja1NwZWVkKSB0aGlzLmF0dGFja1RpbWVyID0gMDtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly8gTW92ZW1lbnRcclxuXHRcdGlmICh0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdHRoaXMubGVycCArPSBkZWx0YSAqIHRoaXMubW92ZVNwZWVkO1xyXG5cdFx0XHRcclxuXHRcdFx0aWYgKHRoaXMubGVycCA+PSAwLjQ5KSB7XHJcblx0XHRcdFx0dGhpcy54ID0gdGhpcy5kZXN0aW5hdGlvblg7XHJcblx0XHRcdFx0dGhpcy55ID0gdGhpcy5kZXN0aW5hdGlvblk7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdGlmICh0aGlzLmxlcnAgPj0gMC45OSkge1xyXG5cdFx0XHRcdHRoaXMuc3RhcnRYID0gdGhpcy5kZXN0aW5hdGlvblg7XHJcblx0XHRcdFx0dGhpcy5zdGFydFkgPSB0aGlzLmRlc3RpbmF0aW9uWTtcclxuXHRcdFx0XHR0aGlzLmxlcnAgPSAwO1xyXG5cdFx0XHRcdHRoaXMuaXNNb3ZpbmcgPSBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Z2V0SW52ZW50b3J5UGFjaygpIHtcclxuXHRcdGxldCBpbnZlbnRvcnlQYWNrID0gW107XHJcblx0XHRcclxuXHRcdHRoaXMuaW52ZW50b3J5LmZvckVhY2goKGl0ZW0pID0+IHtcclxuXHRcdFx0aW52ZW50b3J5UGFja1tpdGVtLnNsb3RdID0gaXRlbS5nZXRQYWNrKCk7XHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdFx0cmV0dXJuIGludmVudG9yeVBhY2s7XHJcblx0fVxyXG59XHJcbiIsImltcG9ydCBkYiBmcm9tICcuLi9kYi5qcyc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4uL2dhbWUuanMnO1xyXG5pbXBvcnQgY29uZmlnIGZyb20gJy4uL2NvbmZpZy5qcyc7XHJcbmltcG9ydCB1dGlsIGZyb20gJy4uL3V0aWwuanMnO1xyXG5pbXBvcnQgQWN0b3IgZnJvbSAnLi9hY3Rvci5qcyc7XHJcblxyXG4vLyBBIEJvdCBpcyBhbiBBY3RvciB3aXRoIGNvbmRpdGlvbmFsIGlucHV0c1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQm90IGV4dGVuZHMgQWN0b3Ige1xyXG5cdGNvbnN0cnVjdG9yKGRhdGEpIHtcclxuXHRcdGlmIChkYXRhLmJvdENsYXNzID09IG51bGwgfHwgZGF0YS5tYXBJZCA9PSBudWxsIHx8IGRhdGEueCA9PSBudWxsIHx8IGRhdGEueSA9PSBudWxsKSByZXR1cm47XHJcblxyXG5cdFx0aWYgKGRhdGEuaWQgPT0gbnVsbCkgZGF0YS5pZCA9IHV0aWwuZmlyc3RFbXB0eUluZGV4KGdhbWUubWFwTGlzdFt0aGlzLm1hcElkXS5ib3RzKTtcclxuXHRcdFxyXG5cdFx0bGV0IGNsYXNzRGF0YSA9IGRiLmdldEJvdERhdGEoZGF0YS5ib3RDbGFzcyk7XHJcblx0XHRpZiAoIWRhdGEubmFtZSkgZGF0YS5uYW1lID0gY2xhc3NEYXRhLm5hbWU7XHJcblx0XHRpZiAoZGF0YS5zcHJpdGUgPT0gbnVsbCkgZGF0YS5zcHJpdGUgPSBjbGFzc0RhdGEuc3ByaXRlO1xyXG5cdFx0aWYgKGRhdGEuaG9zdGlsZSA9PSBudWxsKSBkYXRhLmhvc3RpbGUgPSBjbGFzc0RhdGEuaG9zdGlsZTtcclxuXHRcdGlmIChkYXRhLmRhbWFnZUJhc2UgPT0gbnVsbCkgZGF0YS5kYW1hZ2VCYXNlID0gY2xhc3NEYXRhLmRhbWFnZUJhc2U7XHJcblx0XHRpZiAoZGF0YS5kZWZlbmNlQmFzZSA9PSBudWxsKSBkYXRhLmRlZmVuY2VCYXNlID0gY2xhc3NEYXRhLmRlZmVuY2VCYXNlO1xyXG5cdFx0aWYgKGRhdGEuaGVhbHRoTWF4QmFzZSA9PSBudWxsKSBkYXRhLmhlYWx0aE1heEJhc2UgPSBjbGFzc0RhdGEuaGVhbHRoTWF4QmFzZTtcclxuXHRcdGlmIChkYXRhLmVuZXJneU1heEJhc2UgPT0gbnVsbCkgZGF0YS5lbmVyZ3lNYXhCYXNlID0gY2xhc3NEYXRhLmVuZXJneU1heEJhc2U7XHJcblx0XHRpZiAoZGF0YS5yYW5nZUJhc2UgPT0gbnVsbCkgZGF0YS5yYW5nZUJhc2UgPSBjbGFzc0RhdGEucmFuZ2VCYXNlO1xyXG5cclxuXHRcdHN1cGVyKGRhdGEubWFwSWQsIGRhdGEueCwgZGF0YS55LCBkYXRhLm5hbWUsIGRhdGEuc3ByaXRlKTtcclxuXHRcdHRoaXMuaWQgPSBkYXRhLmlkO1xyXG5cdFx0dGhpcy5ib3RDbGFzcyA9IGRhdGEuYm90Q2xhc3M7XHJcblx0XHR0aGlzLmhvc3RpbGUgPSBkYXRhLmhvc3RpbGU7XHJcblx0XHR0aGlzLmRhbWFnZUJhc2UgPSBkYXRhLmRhbWFnZUJhc2U7XHJcblx0XHR0aGlzLmRlZmVuY2VCYXNlID0gZGF0YS5kZWZlbmNlQmFzZTtcclxuXHRcdHRoaXMuaGVhbHRoTWF4QmFzZSA9IGRhdGEuaGVhbHRoTWF4QmFzZTtcclxuXHRcdHRoaXMuZW5lcmd5TWF4QmFzZSA9IGRhdGEuZW5lcmd5TWF4QmFzZTtcclxuXHRcdHRoaXMucmFuZ2VCYXNlID0gZGF0YS5yYW5nZUJhc2U7XHJcblx0XHRcclxuXHRcdHRoaXMudGFyZ2V0ID0gbnVsbDtcclxuXHRcdHRoaXMuc2V0VGFzaygnd2FuZGVyaW5nJyk7XHJcblx0XHR0aGlzLm1vdmVUaW1lciA9IDA7XHJcblxyXG5cdFx0Z2FtZS5tYXBMaXN0W3RoaXMubWFwSWRdLmJvdHNbdGhpcy5pZF0gPSB0aGlzO1xyXG5cdH1cclxuXHRcclxuXHRnZXRNYXBJdGVtKG1hcElkLCBpZCkge1xyXG5cdFx0bGV0IHNsb3QgPSBzdXBlci5nZXRNYXBJdGVtKG1hcElkLCBpZCk7XHJcblx0XHRpZiAoc2xvdCA9PSBudWxsKSByZXR1cm47XHJcblx0XHRcclxuXHRcdGxldCBpdGVtID0gZ2FtZS5tYXBMaXN0W21hcElkXS5pdGVtc1tpZF07XHJcblx0XHRpdGVtLm1vdmVUb0JvdCh0aGlzLm1hcElkLCB0aGlzLmlkLCBzbG90KTtcclxuXHR9XHJcblxyXG5cdGdldEl0ZW0oZGF0YSkge1xyXG5cdFx0bGV0IHNsb3QgPSBzdXBlci5nZXRJdGVtKGRhdGEpO1xyXG5cdFx0aWYgKHNsb3QgPT0gbnVsbCkgcmV0dXJuO1xyXG5cclxuXHRcdGRhdGEub3duZXIgPSAnYm90JztcclxuXHRcdGRhdGEubWFwSWQgPSB0aGlzLm1hcElkO1xyXG5cdFx0ZGF0YS5pZCA9IHRoaXMuaWQ7XHJcblx0XHRkYXRhLnNsb3QgPSBzbG90O1xyXG5cdFx0bmV3IEl0ZW0oZGF0YSk7XHJcblx0fVxyXG5cclxuXHR1cGRhdGUoZGVsdGEpIHtcclxuXHRcdHN1cGVyLnVwZGF0ZShkZWx0YSk7IFx0Ly8gRGVmYXVsdCBBY3RvciBVcGRhdGVcclxuXHRcdGlmICh0aGlzLmlzRGVhZCkgcmV0dXJuO1xyXG5cclxuXHRcdHRoaXMubW92ZVRpbWVyKys7XHJcblx0XHRcclxuXHRcdC8vIEFJIElucHV0c1xyXG5cdFx0c3dpdGNoKHRoaXMudGFzaykge1xyXG5cdFx0XHRjYXNlICd3YW5kZXJpbmcnOlx0XHQvLyBNb3ZlIHJhbmRvbWx5XHJcblx0XHRcdFx0dGhpcy5tb3ZlKCk7XHJcblx0XHRcdFx0dGhpcy5waWNrVXAoKTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ2ZvbGxvd2luZyc6XHRcdC8vIE1vdmUgdG93YXJkcyB0YXJnZXRcclxuXHRcdFx0XHRpZiAodGhpcy50YXJnZXQpIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZVRvVGFyZ2V0KHRoaXMudGFyZ2V0LCBmYWxzZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly8gTm8gdGFyZ2V0XHJcblx0XHRcdFx0XHR0aGlzLnNldFRhc2soJ3dhbmRlcmluZycpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ2F0dGFja2luZyc6XHRcdC8vIE1vdmUgdG93YXJkcyB0YXJnZXQgYW5kIGF0dGFja1xyXG5cdFx0XHRcdGlmICh0aGlzLnRhcmdldCkge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlVG9UYXJnZXQodGhpcy50YXJnZXQsIHRydWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdC8vIE5vIHRhcmdldFxyXG5cdFx0XHRcdFx0dGhpcy5zZXRUYXNrKCd3YW5kZXJpbmcnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHQvLyBjYXNlICdpZGxlJzpcclxuXHRcdFx0ZGVmYXVsdDogXHRcdFx0XHRcdC8vIFN0YW5kIHN0aWxsXHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gdGhpcy5nZXRQYWNrKCk7XHJcblx0fVxyXG5cdFxyXG5cdGdldFBhY2soKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRpZDogdGhpcy5pZCxcclxuXHRcdFx0bmFtZTogdGhpcy5uYW1lLFxyXG5cdFx0XHRzcHJpdGU6IHRoaXMuc3ByaXRlLFxyXG5cdFx0XHRkaXJlY3Rpb246IHRoaXMuZGlyZWN0aW9uLFxyXG5cdFx0XHRtYXBJZDogdGhpcy5tYXBJZCxcclxuXHRcdFx0eDogdGhpcy5zdGFydFgsXHJcblx0XHRcdHk6IHRoaXMuc3RhcnRZLFxyXG5cdFx0XHR6OiB0aGlzLnosXHJcblx0XHRcdGRlc3RpbmF0aW9uWDogdGhpcy5kZXN0aW5hdGlvblgsXHJcblx0XHRcdGRlc3RpbmF0aW9uWTogdGhpcy5kZXN0aW5hdGlvblksXHJcblx0XHRcdGxlcnA6IHRoaXMubGVycCxcclxuXHRcdFx0aXNSdW5uaW5nOiB0aGlzLmlzUnVubmluZyxcclxuXHRcdFx0aXNBdHRhY2tpbmc6IHRoaXMuaXNBdHRhY2tpbmcsXHJcblx0XHRcdGlzRGVhZDogdGhpcy5pc0RlYWQsXHJcblx0XHRcdGlzVmlzaWJsZTogdGhpcy5pc1Zpc2libGVcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHRyZW1vdmUoKSB7XHJcblx0XHRkZWxldGUgZ2FtZS5tYXBMaXN0W3RoaXMubWFwSWRdLmJvdHNbdGhpcy5pZF07XHJcblx0fVxyXG5cdFxyXG5cdG1vdmUoZGlyZWN0aW9uKSB7XHJcblx0XHRsZXQgbW92ZVRpbWUgPSAyNDtcclxuXHRcdGlmICh0aGlzLmlzUnVubmluZykge1xyXG5cdFx0XHRtb3ZlVGltZSA9IDE3O1xyXG5cdFx0fVxyXG5cdFx0aWYgKHRoaXMubW92ZVRpbWVyID4gbW92ZVRpbWUgJiYgdGhpcy5hdHRhY2tUaW1lciA9PT0gMCkge1xyXG5cdFx0XHRzdXBlci5tb3ZlKGRpcmVjdGlvbik7XHJcblx0XHRcdHRoaXMubW92ZVRpbWVyID0gMDtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0dGFrZURhbWFnZShkYW1hZ2UsIHNvdXJjZSkge1xyXG5cdFx0aWYgKHNvdXJjZSBpbnN0YW5jZW9mIEFjdG9yKSB7XHJcblx0XHRcdHRoaXMuc2V0VGFzaygnYXR0YWNraW5nJywgc291cmNlKTtcclxuXHRcdH1cclxuXHRcdHN1cGVyLnRha2VEYW1hZ2UoZGFtYWdlLCBzb3VyY2UpO1xyXG5cdH1cclxuXHRcclxuXHRyZXNwYXduKCkge1xyXG5cdFx0c3VwZXIucmVzcGF3bigpO1xyXG5cdFx0dGhpcy5zZXRUYXNrKCd3YW5kZXJpbmcnKTtcclxuXHR9XHJcblx0XHJcblx0cGlja1VwKCkge1xyXG5cdFx0Zm9yIChsZXQgaXRlbSBvZiBnYW1lLm1hcExpc3RbdGhpcy5tYXBJZF0uaXRlbXMpIHtcclxuXHRcdFx0aWYgKGl0ZW0gJiYgaXRlbS54ID09PSB0aGlzLnggJiYgaXRlbS55ID09PSB0aGlzLnkpIHtcclxuXHRcdFx0XHRsZXQgc2xvdCA9IHRoaXMuZ2V0TWFwSXRlbShpdGVtLm1hcElkLCBpdGVtLmlkKTtcclxuXHRcdFx0XHRpZiAoc2xvdCAhPSBudWxsKSB7XHJcblx0XHRcdFx0XHRpdGVtLm1vdmVUb0JvdCh0aGlzLm1hcElkLCB0aGlzLmlkLCBzbG90KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHQvLyBJbnZlbnRvcnkgZnVsbFxyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHR0aGlzLmNoZWNrQmVzdEVxdWlwbWVudCgpO1xyXG5cdH1cclxuXHRcclxuXHRzZXRUYXNrKHRhc2ssIHRhcmdldCkge1xyXG5cdFx0c3dpdGNoICh0YXNrKSB7XHJcblx0XHRcdGNhc2UgJ3dhbmRlcmluZyc6XHJcblx0XHRcdFx0dGhpcy5sYXppbmVzcyA9IDc7XHJcblx0XHRcdFx0dGhpcy50YXJnZXQgPSBudWxsO1xyXG5cdFx0XHRcdHRoaXMudGFzayA9IHRhc2s7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdmb2xsb3dpbmcnOlxyXG5cdFx0XHRcdGlmICh0YXJnZXQgPT09IG51bGwpIHtcclxuXHRcdFx0XHRcdHRoaXMuc2V0VGFzaygnd2FuZGVyaW5nJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5sYXppbmVzcyA9IDA7XHJcblx0XHRcdFx0XHR0aGlzLnRhcmdldCA9IHRhcmdldDtcclxuXHRcdFx0XHRcdHRoaXMudGFzayA9IHRhc2s7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnYXR0YWNraW5nJzpcclxuXHRcdFx0XHRpZiAodGFyZ2V0ID09PSBudWxsKSB7XHJcblx0XHRcdFx0XHR0aGlzLnNldFRhc2soJ3dhbmRlcmluZycpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubGF6aW5lc3MgPSAwO1xyXG5cdFx0XHRcdFx0dGhpcy50YXJnZXQgPSB0YXJnZXQ7XHJcblx0XHRcdFx0XHR0aGlzLnRhc2sgPSB0YXNrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGRlZmF1bHQ6XHQvL2lkbGluZ1xyXG5cdFx0XHRcdHRoaXMubGF6aW5lc3MgPSA3O1xyXG5cdFx0XHRcdHRoaXMudGFyZ2V0ID0gbnVsbDtcclxuXHRcdFx0XHR0aGlzLnRhc2sgPSAnaWRsZSc7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRjaGVja0Jlc3RFcXVpcG1lbnQoKSB7XHJcblx0XHRmb3IgKGxldCBzbG90ID0gMDsgc2xvdCA8IGNvbmZpZy5JTlZFTlRPUllfU0laRTsgc2xvdCsrKSB7XHJcblx0XHRcdGxldCBpdGVtID0gdGhpcy5pbnZlbnRvcnlbc2xvdF07XHJcblx0XHRcdGlmICghaXRlbSkge1xyXG5cdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRzd2l0Y2ggKGl0ZW0udHlwZSkge1xyXG5cdFx0XHRcdGNhc2UgJ3dlYXBvbic6XHJcblx0XHRcdFx0XHRpZiAodGhpcy5pbnZlbnRvcnlbY29uZmlnLklOVkVOVE9SWV9TSVpFXSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoaXRlbS5kYW1hZ2VCb251cyA+IHRoaXMuaW52ZW50b3J5W2NvbmZpZy5JTlZFTlRPUllfU0laRV0uZGFtYWdlQm9udXMpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmVxdWlwSXRlbShzbG90KTtcclxuXHRcdFx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZXF1aXBJdGVtKHNsb3QpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ3NoaWVsZCc6XHJcblx0XHRcdFx0XHRpZiAodGhpcy5pbnZlbnRvcnlbY29uZmlnLklOVkVOVE9SWV9TSVpFICsgMV0pIHtcclxuXHRcdFx0XHRcdFx0aWYgKGl0ZW0uZGVmZW5jZUJvbnVzID4gdGhpcy5pbnZlbnRvcnlbY29uZmlnLklOVkVOVE9SWV9TSVpFICsgMV0uZGVmZW5jZUJvbnVzKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5lcXVpcEl0ZW0oc2xvdCk7XHJcblx0XHRcdFx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmVxdWlwSXRlbShzbG90KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdhcm1vdXInOlxyXG5cdFx0XHRcdFx0aWYgKHRoaXMuaW52ZW50b3J5W2NvbmZpZy5JTlZFTlRPUllfU0laRSArIDJdKSB7XHJcblx0XHRcdFx0XHRcdGlmIChpdGVtLmRlZmVuY2VCb251cyA+IHRoaXMuaW52ZW50b3J5W2NvbmZpZy5JTlZFTlRPUllfU0laRSArIDJdLmRlZmVuY2VCb251cykge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuZXF1aXBJdGVtKHNsb3QpO1xyXG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5lcXVpcEl0ZW0oc2xvdCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAnaGVsbWV0JzpcclxuXHRcdFx0XHRcdGlmICh0aGlzLmludmVudG9yeVtjb25maWcuSU5WRU5UT1JZX1NJWkUgKyAzXSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoaXRlbS5kZWZlbmNlQm9udXMgPiB0aGlzLmludmVudG9yeVtjb25maWcuSU5WRU5UT1JZX1NJWkUgKyAzXS5kZWZlbmNlQm9udXMpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmVxdWlwSXRlbShzbG90KTtcclxuXHRcdFx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZXF1aXBJdGVtKHNsb3QpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ3JpbmcnOlxyXG5cdFx0XHRcdFx0aWYgKHRoaXMuaW52ZW50b3J5W2NvbmZpZy5JTlZFTlRPUllfU0laRSArIDRdKSB7XHJcblx0XHRcdFx0XHRcdGlmIChpdGVtLmRhbWFnZUJvbnVzID4gdGhpcy5pbnZlbnRvcnlbY29uZmlnLklOVkVOVE9SWV9TSVpFICsgNF0uZGFtYWdlQm9udXMpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmVxdWlwSXRlbShzbG90KTtcclxuXHRcdFx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZXF1aXBJdGVtKHNsb3QpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbiIsImltcG9ydCBjb25maWcgZnJvbSAnLi4vY29uZmlnLmpzJztcclxuXHJcbi8vIEFuIEVudGl0eSBpcyBhbnkgb2JqZWN0IHdoaWNoIGNhbiBhcHBlYXIgb24gdGhlIG1hcFxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW50aXR5IHtcclxuXHRjb25zdHJ1Y3RvcihtYXBJZCwgeCwgeSwgc3ByaXRlID0gMCkge1xyXG5cdFx0dGhpcy5tYXBJZCA9IG1hcElkO1xyXG5cdFx0dGhpcy54ID0geDtcclxuXHRcdHRoaXMueSA9IHk7XHJcblx0XHRpZiAoc3ByaXRlIDwgMCkgc3ByaXRlID0gMDtcclxuXHRcdHRoaXMuc3ByaXRlID0gc3ByaXRlO1xyXG5cdFx0dGhpcy5pc1Zpc2libGUgPSB0cnVlO1xyXG5cdH1cclxufSIsImltcG9ydCBkYiBmcm9tICcuLi9kYi5qcyc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4uL2dhbWUuanMnO1xyXG5pbXBvcnQgdXRpbCBmcm9tICcuLi91dGlsLmpzJztcclxuaW1wb3J0IEVudGl0eSBmcm9tICcuL2VudGl0eS5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJdGVtIGV4dGVuZHMgRW50aXR5IHtcclxuXHRjb25zdHJ1Y3RvcihkYXRhKSB7XHJcblx0XHRpZiAoIWRhdGEub3duZXIgfHwgZGF0YS5pdGVtQ2xhc3MgPT0gbnVsbCB8fCBkYXRhLmlkID09IG51bGwpIHJldHVybjtcclxuXHRcdFxyXG5cdFx0aWYgKGRhdGEub3duZXIgPT09ICdwbGF5ZXInKSB7XHJcblx0XHRcdGlmIChkYXRhLnNsb3QgPT0gbnVsbCkgcmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoZGF0YS5vd25lciA9PT0gJ2JvdCcpIHtcclxuXHRcdFx0aWYgKGRhdGEubWFwSWQgPT0gbnVsbCB8fCBkYXRhLnNsb3QgPT0gbnVsbCkgcmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoZGF0YS5vd25lciA9PT0gJ21hcCcpIHtcclxuXHRcdFx0aWYgKGRhdGEubWFwSWQgPT0gbnVsbCB8fCBkYXRhLnggPT0gbnVsbCB8fCBkYXRhLnkgPT0gbnVsbCkgcmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChkYXRhLm1hcElkID09PSB1bmRlZmluZWQpIGRhdGEubWFwSWQgPSBudWxsO1xyXG5cdFx0aWYgKGRhdGEueCA9PT0gdW5kZWZpbmVkKSBkYXRhLnggPSBudWxsO1xyXG5cdFx0aWYgKGRhdGEueSA9PT0gdW5kZWZpbmVkKSBkYXRhLnkgPSBudWxsO1xyXG5cdFx0aWYgKGRhdGEuc2xvdCA9PT0gdW5kZWZpbmVkKSBkYXRhLnNsb3QgPSBudWxsO1xyXG5cclxuXHRcdGxldCBjbGFzc0RhdGEgPSBkYi5nZXRJdGVtRGF0YShkYXRhLml0ZW1DbGFzcyk7XHJcblx0XHRpZiAoZGF0YS5uYW1lID09IG51bGwpIGRhdGEubmFtZSA9IGNsYXNzRGF0YS5uYW1lO1xyXG5cdFx0aWYgKGRhdGEudHlwZSA9PSBudWxsKSBkYXRhLnR5cGUgPSBjbGFzc0RhdGEudHlwZTtcclxuXHRcdGlmIChkYXRhLnNwcml0ZSA9PSBudWxsKSBkYXRhLnNwcml0ZSA9IGNsYXNzRGF0YS5zcHJpdGU7XHJcblx0XHRpZiAoZGF0YS5yZXVzYWJsZSA9PSBudWxsKSBkYXRhLnJldXNhYmxlID0gY2xhc3NEYXRhLnJldXNhYmxlO1xyXG5cdFx0aWYgKGRhdGEuZGFtYWdlQm9udXMgPT0gbnVsbCkgZGF0YS5kYW1hZ2VCb251cyA9IGNsYXNzRGF0YS5kYW1hZ2VCb251cztcclxuXHRcdGlmIChkYXRhLmRlZmVuY2VCb251cyA9PSBudWxsKSBkYXRhLmRlZmVuY2VCb251cyA9IGNsYXNzRGF0YS5kZWZlbmNlQm9udXM7XHJcblx0XHRpZiAoZGF0YS5oZWFsdGhNYXhCb251cyA9PSBudWxsKSBkYXRhLmhlYWx0aE1heEJvbnVzID0gY2xhc3NEYXRhLmhlYWx0aE1heEJvbnVzO1xyXG5cdFx0aWYgKGRhdGEuZW5lcmd5TWF4Qm9udXMgPT0gbnVsbCkgZGF0YS5lbmVyZ3lNYXhCb251cyA9IGNsYXNzRGF0YS5lbmVyZ3lNYXhCb251cztcclxuXHRcdGlmIChkYXRhLnJhbmdlQm9udXMgPT0gbnVsbCkgZGF0YS5yYW5nZUJvbnVzID0gY2xhc3NEYXRhLnJhbmdlQm9udXM7XHJcblx0XHRpZiAoZGF0YS5zdGFjayA9PSBudWxsKSBkYXRhLnN0YWNrID0gY2xhc3NEYXRhLnN0YWNrO1xyXG5cclxuXHRcdHN1cGVyKGRhdGEubWFwSWQsIGRhdGEueCwgZGF0YS55LCBkYXRhLnNwcml0ZSk7XHJcblx0XHR0aGlzLm93bmVyID0gZGF0YS5vd25lcjtcclxuXHRcdHRoaXMuaWQgPSBkYXRhLmlkO1xyXG5cdFx0dGhpcy5pdGVtQ2xhc3MgPSBkYXRhLml0ZW1DbGFzcztcclxuXHRcdHRoaXMuc3RhY2sgPSBkYXRhLnN0YWNrO1xyXG5cdFx0dGhpcy5zbG90ID0gZGF0YS5zbG90O1xyXG5cdFx0XHJcblx0XHR0aGlzLm5hbWUgPSBkYXRhLm5hbWU7XHJcblx0XHR0aGlzLnR5cGUgPSBkYXRhLnR5cGU7XHJcblx0XHR0aGlzLnJldXNhYmxlID0gZGF0YS5yZXVzYWJsZTtcclxuXHRcdHRoaXMuZGFtYWdlQm9udXMgPSBkYXRhLmRhbWFnZUJvbnVzO1xyXG5cdFx0dGhpcy5kZWZlbmNlQm9udXMgPSBkYXRhLmRlZmVuY2VCb251cztcclxuXHRcdHRoaXMuaGVhbHRoTWF4Qm9udXMgPSBkYXRhLmhlYWx0aE1heEJvbnVzO1xyXG5cdFx0dGhpcy5lbmVyZ3lNYXhCb251cyA9IGRhdGEuZW5lcmd5TWF4Qm9udXM7XHJcblx0XHR0aGlzLnJhbmdlQm9udXMgPSBkYXRhLnJhbmdlQm9udXM7XHJcblx0XHRcclxuXHRcdHRoaXMuY2xpY2tlZCA9IGZhbHNlO1xyXG5cdFx0dGhpcy5jbGlja1RpbWUgPSAwO1xyXG5cclxuXHRcdGlmIChkYXRhLm93bmVyID09PSAnbWFwJykge1xyXG5cdFx0XHRnYW1lLm1hcExpc3RbdGhpcy5tYXBJZF0uaXRlbXNbdGhpcy5pZF0gPSB0aGlzO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoZGF0YS5vd25lciA9PT0gJ3BsYXllcicpIHtcclxuXHRcdFx0Z2FtZS5wbGF5ZXJMaXN0W3RoaXMuaWRdLmludmVudG9yeVt0aGlzLnNsb3RdID0gdGhpcztcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKGRhdGEub3duZXIgPT09ICdib3QnKSB7XHJcblx0XHRcdGdhbWUubWFwTGlzdFt0aGlzLm1hcElkXS5ib3RzW3RoaXMuaWRdLmludmVudG9yeVt0aGlzLnNsb3RdID0gdGhpcztcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5nZXRQYWNrKCk7XHJcblx0fVxyXG5cclxuXHRnZXRQYWNrKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0aWQ6IHRoaXMuaWQsXHJcblx0XHRcdG1hcElkOiB0aGlzLm1hcElkLFxyXG5cdFx0XHR4OiB0aGlzLngsXHJcblx0XHRcdHk6IHRoaXMueSxcclxuXHRcdFx0c2xvdDogdGhpcy5zbG90LFxyXG5cdFx0XHRpdGVtQ2xhc3M6IHRoaXMuaXRlbUNsYXNzLFxyXG5cdFx0XHRzdGFjazogdGhpcy5zdGFjayxcclxuXHRcdFx0bmFtZTogdGhpcy5uYW1lLFxyXG5cdFx0XHRzcHJpdGU6IHRoaXMuc3ByaXRlLFxyXG5cdFx0XHR0eXBlOiB0aGlzLnR5cGUsXHJcblx0XHRcdHJldXNhYmxlOiB0aGlzLnJldXNhYmxlLFxyXG5cdFx0XHRkYW1hZ2VCb251czogdGhpcy5kYW1hZ2VCb251cyxcclxuXHRcdFx0ZGVmZW5jZUJvbnVzOiB0aGlzLmRlZmVuY2VCb251cyxcclxuXHRcdFx0aGVhbHRoTWF4Qm9udXM6IHRoaXMuaGVhbHRoTWF4Qm9udXMsXHJcblx0XHRcdGVuZXJneU1heEJvbnVzOiB0aGlzLmVuZXJneU1heEJvbnVzLFxyXG5cdFx0XHRyYW5nZUJvbnVzOiB0aGlzLnJhbmdlQm9udXMsXHJcblx0XHRcdGlzVmlzaWJsZTogdGhpcy5pc1Zpc2libGVcclxuXHRcdH07XHJcblx0fVxyXG5cdFxyXG5cdHJlbW92ZSgpIHtcclxuXHRcdGlmICh0aGlzLm93bmVyID09PSAncGxheWVyJykge1xyXG5cdFx0XHRkZWxldGUgZ2FtZS5wbGF5ZXJMaXN0W3RoaXMuaWRdLmludmVudG9yeVt0aGlzLnNsb3RdO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAodGhpcy5vd25lciA9PT0gJ21hcCcpIHtcclxuXHRcdFx0ZGVsZXRlIGdhbWUubWFwTGlzdFt0aGlzLm1hcElkXS5pdGVtc1t0aGlzLmlkXTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKHRoaXMub3duZXIgPT09ICdib3QnKSB7XHJcblx0XHRcdGRlbGV0ZSBnYW1lLm1hcExpc3RbdGhpcy5tYXBJZF0uYm90c1t0aGlzLmlkXS5pbnZlbnRvcnlbdGhpcy5zbG90XTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0aXNFcXVpcG1lbnQoKSB7XHJcblx0XHRpZiAodGhpcy50eXBlID09PSAnd2VhcG9uJyB8fCB0aGlzLnR5cGUgPT09ICdzaGllbGQnIHx8IHRoaXMudHlwZSA9PT0gJ2FybW91cicgfHwgdGhpcy50eXBlID09PSAnaGVsbWV0JyB8fCB0aGlzLnR5cGUgPT09ICdyaW5nJykge1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRjYW5FcXVpcChzbG90KSB7XHJcblx0XHRpZiAoc2xvdCA9PT0gY29uZmlnLklOVkVOVE9SWV9TSVpFKSB7XHJcblx0XHRcdGlmICh0aGlzLnR5cGUgPT09ICd3ZWFwb24nKSByZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKHNsb3QgPT09IGNvbmZpZy5JTlZFTlRPUllfU0laRSArIDEpIHtcclxuXHRcdFx0aWYgKHRoaXMudHlwZSA9PT0gJ3NoaWVsZCcpIHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoc2xvdCA9PT0gY29uZmlnLklOVkVOVE9SWV9TSVpFICsgMikge1xyXG5cdFx0XHRpZiAodGhpcy50eXBlID09PSAnYXJtb3VyJykgcmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChzbG90ID09PSBjb25maWcuSU5WRU5UT1JZX1NJWkUgKyAzKSB7XHJcblx0XHRcdGlmICh0aGlzLnR5cGUgPT09ICdoZWxtZXQnKSByZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKHNsb3QgPT09IGNvbmZpZy5JTlZFTlRPUllfU0laRSArIDQpIHtcclxuXHRcdFx0aWYgKHRoaXMudHlwZSA9PT0gJ3JpbmcnKSByZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG5cclxuXHRtb3ZlVG9QbGF5ZXIoaWQsIHNsb3QpIHtcclxuXHRcdGlmIChpZCA9PSBudWxsIHx8IHNsb3QgPT0gbnVsbCkgcmV0dXJuO1xyXG5cclxuXHRcdHRoaXMucmVtb3ZlKCk7XHJcblx0XHR0aGlzLm93bmVyID0gJ3BsYXllcic7XHJcblx0XHR0aGlzLmlkID0gaWQ7XHJcblx0XHR0aGlzLnNsb3QgPSBzbG90O1xyXG5cdFx0Z2FtZS5wbGF5ZXJMaXN0W3RoaXMuaWRdLmludmVudG9yeVt0aGlzLnNsb3RdID0gdGhpcztcclxuXHR9XHJcblxyXG5cdG1vdmVUb01hcChtYXBJZCwgeCwgeSkge1xyXG5cdFx0aWYgKG1hcElkID09IG51bGwgfHwgeCA9PSBudWxsIHx8IHkgPT0gbnVsbCkgcmV0dXJuO1xyXG5cclxuXHRcdHRoaXMucmVtb3ZlKCk7XHJcblx0XHR0aGlzLm93bmVyID0gJ21hcCc7XHJcblx0XHR0aGlzLm1hcElkID0gbWFwSWQ7XHJcblx0XHR0aGlzLmlkID0gdXRpbC5maXJzdEVtcHR5SW5kZXgoZ2FtZS5tYXBMaXN0W3RoaXMubWFwSWRdLml0ZW1zKTtcclxuXHRcdHRoaXMueCA9IHg7XHJcblx0XHR0aGlzLnkgPSB5O1xyXG5cdFx0Z2FtZS5tYXBMaXN0W3RoaXMubWFwSWRdLml0ZW1zW3RoaXMuaWRdID0gdGhpcztcclxuXHR9XHJcblxyXG5cdG1vdmVUb0JvdChtYXBJZCwgaWQsIHNsb3QpIHtcclxuXHRcdGlmIChtYXBJZCA9PSBudWxsIHx8IGlkID09IG51bGwgfHwgc2xvdCA9PSBudWxsKSByZXR1cm47XHJcblxyXG5cdFx0dGhpcy5yZW1vdmUoKTtcclxuXHRcdHRoaXMub3duZXIgPSAnYm90JztcclxuXHRcdHRoaXMubWFwSWQgPSBtYXBJZDtcclxuXHRcdHRoaXMuaWQgPSBpZDtcclxuXHRcdHRoaXMuc2xvdCA9IHNsb3Q7XHJcblx0XHRnYW1lLm1hcExpc3RbdGhpcy5tYXBJZF0uYm90c1t0aGlzLmlkXS5pbnZlbnRvcnlbdGhpcy5zbG90XSA9IHRoaXM7XHJcblx0fVxyXG59XHJcbiIsImltcG9ydCBjb25maWcgZnJvbSAnLi4vY29uZmlnLmpzJztcclxuaW1wb3J0IHV0aWwgZnJvbSAnLi4vdXRpbC5qcyc7XHJcbmltcG9ydCBUaWxlIGZyb20gJy4vdGlsZS5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXAge1xyXG5cdGNvbnN0cnVjdG9yKGlkLCBkYXRhKSB7XHJcblx0XHR0aGlzLmlkID0gaWQ7XHJcblxyXG5cdFx0dGhpcy5uYW1lID0gZGF0YS5uYW1lO1xyXG5cdFx0dGhpcy5kcm9wQ2hhbmNlID0gdXRpbC5jbGFtcChkYXRhLmRyb3BDaGFuY2UsIDAsIDEwMCk7XHJcblx0XHQvL3RoaXMuZHJvcENoYW5jZSA9IDAgPSAwJSBjaGFuY2UgdG8gZHJvcCBpdGVtcyBpbiBpbnZlbnRvcnkgKGRyb3Agbm90aGluZyksIDEwMCA9IDEwMCUgY2hhbmNlIHRvIGRyb3AgKGRyb3AgZXZlcnl0aGluZylcclxuXHRcdHRoaXMuZHJvcEFtb3VudEVRID0gdXRpbC5jbGFtcChkYXRhLmRyb3BBbW91bnRFUSwgMCwgY29uZmlnLkVRVUlQTUVOVF9TSVpFKTtcclxuXHRcdC8vdGhpcy5kcm9wQW1vdW50RVEgPSBudW1iZXIgb2YgZXF1aXBwZWQgaXRlbXMgdGhlIHBsYXllciB3aWxsIGRyb3Agb24gZGVhdGguIGRyb3BFUSA9IEVRVUlQTUVOVF9TSVpFID0gZHJvcCBhbGwgZXF1aXBtZW50XHJcblx0XHRcclxuXHRcdHRoaXMuaXRlbXMgPSBkYXRhLml0ZW1zO1xyXG5cdFx0dGhpcy5ib3RzID0gZGF0YS5ib3RzO1xyXG5cdFx0dGhpcy5lZmZlY3RzID0gZGF0YS5lZmZlY3RzO1xyXG5cdFx0dGhpcy50ZXh0cyA9IGRhdGEudGV4dHM7XHJcblx0XHRcclxuXHRcdHRoaXMudGlsZXMgPSBbXTtcclxuXHRcdGZvciAobGV0IHkgPSAwOyB5IDwgY29uZmlnLk1BUF9DT0xVTU5TOyB5KyspIHtcclxuXHRcdFx0dGhpcy50aWxlc1t5XSA9IFtdO1xyXG5cdFx0XHRmb3IgKGxldCB4ID0gMDsgeCA8IGNvbmZpZy5NQVBfUk9XUzsgeCsrKSB7XHJcblx0XHRcdFx0bGV0IHRpbGVEYXRhID0gdGhpcy5nZXRUaWxlRGF0YShkYXRhLCAoeSAqIGNvbmZpZy5NQVBfQ09MVU1OUykgKyB4KTtcclxuXHRcdFx0XHR0aGlzLnRpbGVzW3ldW3hdID0gbmV3IFRpbGUodGlsZURhdGEpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHVwbG9hZCgpIHtcclxuXHRcdGdhbWUubWFwRGF0YVt0aGlzLmlkXSA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKCcuL3NlcnZlci9kYXRhL21hcC5qc29uJywgJ3V0ZjgnKSlbdGhpcy5pZF07XHJcblx0XHRmb3IgKGxldCB5ID0gMDsgeSA8IGNvbmZpZy5NQVBfUk9XUzsgeSsrKSB7XHJcblx0XHRcdGZvciAobGV0IHggPSAwOyB4IDwgY29uZmlnLk1BUF9DT0xVTU5TOyB4KyspIHtcclxuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGNvbmZpZy5NQVBfTEFZRVJTOyBpKyspIHtcclxuXHRcdFx0XHRcdHRoaXMudGlsZXNbeV1beF0ubGF5ZXJbaV0gPSBnYW1lLm1hcERhdGFbdGhpcy5pZF0udGlsZXNbaV1bKHkgKiBjb25maWcuTUFQX0NPTFVNTlMpICsgeF07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRnYW1lLnBsYXllckxpc3QuZm9yRWFjaCgocGxheWVyKSA9PiB7XHJcblx0XHRcdGlmIChwbGF5ZXIubWFwSWQgPT09IHRoaXMuaWQpIHtcclxuXHRcdFx0XHRwbGF5ZXIubG9hZE1hcCgpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblx0XHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHRsZXQgcGFjayA9IHtcclxuXHRcdFx0bmFtZTogdGhpcy5uYW1lLFxyXG5cdFx0XHRpdGVtczogW10sXHJcblx0XHRcdGJvdHM6IFtdLFxyXG5cdFx0XHRlZmZlY3RzOiBbXSxcclxuXHRcdFx0dGV4dHM6IFtdXHJcblx0XHR9O1xyXG5cdFx0XHJcblx0XHR0aGlzLml0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcclxuXHRcdFx0cGFjay5pdGVtc1tpdGVtLmlkXSA9IGl0ZW0udXBkYXRlKGRlbHRhKTtcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5ib3RzLmZvckVhY2goKGJvdCkgPT4ge1xyXG5cdFx0XHRwYWNrLmJvdHNbYm90LmlkXSA9IGJvdC51cGRhdGUoZGVsdGEpO1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLmVmZmVjdHMuZm9yRWFjaCgoZWZmZWN0KSA9PiB7XHJcblx0XHRcdHBhY2suZWZmZWN0c1tlZmZlY3QuaWRdID0gZWZmZWN0LnVwZGF0ZShkZWx0YSk7XHJcblx0XHR9KTtcclxuXHRcdHRoaXMudGV4dHMuZm9yRWFjaCgodGV4dCkgPT4ge1xyXG5cdFx0XHRwYWNrLnRleHRzW3RleHQuaWRdID0gdGV4dC51cGRhdGUoZGVsdGEpO1xyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcdHJldHVybiBwYWNrO1xyXG5cdH1cclxuXHRcclxuXHRnZXRQYWNrKCkge1xyXG5cdFx0bGV0IG1hcFBhY2sgPSB7XHJcblx0XHRcdG5hbWU6IHRoaXMubmFtZSxcclxuXHRcdFx0dGlsZXM6IHRoaXMuZ2V0VGlsZVBhY2soKSxcclxuXHRcdFx0aXRlbXM6IFtdLFxyXG5cdFx0XHRib3RzOiBbXSxcclxuXHRcdFx0ZWZmZWN0czogW10sXHJcblx0XHRcdHRleHRzOiBbXVxyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLml0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcclxuXHRcdFx0bWFwUGFjay5pdGVtc1tpdGVtLmlkXSA9IGl0ZW0uZ2V0UGFjaygpO1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLmJvdHMuZm9yRWFjaCgoYm90KSA9PiB7XHJcblx0XHRcdG1hcFBhY2suYm90c1tib3QuaWRdID0gYm90LmdldFBhY2soKTtcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5lZmZlY3RzLmZvckVhY2goKGVmZmVjdCkgPT4ge1xyXG5cdFx0XHRtYXBQYWNrLmVmZmVjdHNbZWZmZWN0LmlkXSA9IGVmZmVjdC5nZXRQYWNrKCk7XHJcblx0XHR9KTtcclxuXHRcdHRoaXMudGV4dHMuZm9yRWFjaCgodGV4dCkgPT4ge1xyXG5cdFx0XHRtYXBQYWNrLnRleHRzW3RleHQuaWRdID0gdGV4dC5nZXRQYWNrKCk7XHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdFx0cmV0dXJuIG1hcFBhY2s7XHJcblx0fVxyXG5cdFxyXG5cdGdldFRpbGVQYWNrKCkge1xyXG5cdFx0bGV0IHRpbGVQYWNrID0gW107XHJcblxyXG5cdFx0Zm9yIChsZXQgeSA9IDA7IHkgPCBjb25maWcuTUFQX1JPV1M7IHkrKykge1xyXG5cdFx0XHR0aWxlUGFja1t5XSA9IFtdO1xyXG5cdFx0XHRmb3IgKGxldCB4ID0gMDsgeCA8IGNvbmZpZy5NQVBfQ09MVU1OUzsgeCsrKSB7XHJcblx0XHRcdFx0dGlsZVBhY2tbeV1beF0gPSB0aGlzLnRpbGVzW3ldW3hdLmdldFBhY2soKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0aWxlUGFjaztcclxuXHR9XHJcblxyXG5cdGdldFRpbGVEYXRhKGRhdGEsIGluZGV4ID0gMCkge1xyXG5cdFx0aWYgKCFkYXRhKSByZXR1cm47XHJcblxyXG5cdFx0bGV0IHRpbGVEYXRhID0ge1xyXG5cdFx0XHRsYXllcjogW10sXHJcblx0XHRcdHdhbGw6IGRhdGEudGlsZXMud2FsbFtpbmRleF0sXHJcblx0XHRcdC8vY2FuQXR0YWNrOiBkYXRhLmNhbkF0dGFja1tpbmRleF0sXHJcblx0XHRcdC8vZGFtYWdlOiBkYXRhLmRhbWFnZVtpbmRleF0sXHJcblx0XHRcdC8vZGVmZW5jZTogZGF0YS5kZWZlbmNlW2luZGV4XSxcclxuXHRcdFx0Ly9oZWFsdGhNYXg6IGRhdGEuaGVhbHRoTWF4W2luZGV4XSxcclxuXHRcdFx0Ly93YXJwTWFwOiBkYXRhLndhcnBNYXBbaW5kZXhdLFxyXG5cdFx0XHQvL3dhcnBYOiBkYXRhLndhcnBYW2luZGV4XSxcclxuXHRcdFx0Ly93YXJwWTogZGF0YS53YXJwWVtpbmRleF1cclxuXHRcdH07XHJcblxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjb25maWcuTUFQX0xBWUVSUzsgaSsrKSB7XHJcblx0XHRcdHRpbGVEYXRhLmxheWVyW2ldID0gZGF0YS50aWxlcy5sYXllcltpXVtpbmRleF07XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRpbGVEYXRhO1xyXG5cdH07XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBNZXNzYWdlIHtcclxuICBjb25zdHJ1Y3RvcihtZXNzYWdlLCBtYXBJZCwgaWQpIHtcclxuICAgIHRoaXMubWFwSWQgPSBtYXBJZDtcclxuICAgIHRoaXMuaWQgPSBpZDtcclxuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XHJcbiAgfVxyXG59IiwiaW1wb3J0IGRiIGZyb20gJy4uL2RiLmpzJztcclxuaW1wb3J0IGdhbWUgZnJvbSAnLi4vZ2FtZS5qcyc7XHJcbmltcG9ydCBBY3RvciBmcm9tICcuL2FjdG9yLmpzJztcclxuXHJcbi8vIEEgUGxheWVyIGlzIGFuIEFjdG9yIHdoaWNoIHRha2VzIGlucHV0IGZyb20gYSBjbGllbnRcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXllciBleHRlbmRzIEFjdG9yIHtcclxuXHRjb25zdHJ1Y3RvcihpZCkge1xyXG5cdFx0bGV0IGRhdGEgPSBkYi5nZXRQbGF5ZXJEYXRhKGlkKTtcclxuXHJcblx0XHRzdXBlcihkYXRhLm1hcElkLCBkYXRhLngsIGRhdGEueSwgZGF0YS5uYW1lLCBkYXRhLnNwcml0ZSk7XHJcblx0XHR0aGlzLmNvbnRyb2xsZXIgPSAncGxheWVyJztcclxuXHRcdHRoaXMuaWQgPSBpZDtcclxuXHRcdHRoaXMuYWRtaW5BY2Nlc3MgPSBkYXRhLmFkbWluQWNjZXNzO1xyXG5cclxuXHRcdHRoaXMuZGFtYWdlQmFzZSA9IGRhdGEuZGFtYWdlQmFzZTtcdFx0XHRcdC8vIG1pbmltdW0gZGFtYWdlIGEgcGxheWVyIGNhbiBoYXZlXHJcblx0XHR0aGlzLmRlZmVuY2VCYXNlID0gZGF0YS5kZWZlbmNlQmFzZTtcdFx0XHQvLyBtaW5pbXVtIGRlZmVuY2UgYSBwbGF5ZXIgY2FuIGhhdmVcclxuXHRcdHRoaXMuaGVhbHRoTWF4QmFzZSA9IGRhdGEuaGVhbHRoTWF4QmFzZTtcdC8vIG1heCBoZWFsdGggd2l0aG91dCBib251c2VzXHJcblx0XHR0aGlzLmVuZXJneU1heEJhc2UgPSBkYXRhLmVuZXJneU1heEJhc2U7XHQvLyBtYXggZW5lcmd5IHdpdGhvdXQgYm9udXNlc1xyXG5cdFx0dGhpcy5jYWxjU3RhdHMoKTtcclxuXHRcdHRoaXMucmVzdG9yZSgpO1xyXG5cclxuXHRcdHRoaXMuc2VsZWN0ZWQgPSBudWxsO1xyXG5cdFx0dGhpcy5pbnB1dCA9IHtcclxuXHRcdFx0ZGlyZWN0aW9uOiBudWxsLFxyXG5cdFx0XHRydW46IGZhbHNlLFxyXG5cdFx0XHRwaWNrdXA6IGZhbHNlLFxyXG5cdFx0XHRhdHRhY2s6IGZhbHNlXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRsb2FkTWFwKCkge1xyXG5cdFx0XHJcblx0fVxyXG5cclxuXHR1cGRhdGUoZGVsdGEpIHtcclxuXHRcdHN1cGVyLnVwZGF0ZShkZWx0YSk7XHRcdC8vIERlZmF1bHQgQWN0b3IgVXBkYXRlXHJcblx0XHRcclxuXHRcdGlmICghdGhpcy5pc0RlYWQpIHtcclxuXHRcdFx0Ly8gQ2hlY2sgZm9yIEF0YWNrIElucHV0XHJcblx0XHRcdGlmICh0aGlzLmlucHV0LmF0dGFjayAmJiB0aGlzLmF0dGFja1RpbWVyID09PSAwKSB7XHJcblx0XHRcdFx0dGhpcy5hdHRhY2soKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0Ly8gQ2hlY2sgZm9yIE1vdmVtZW50IElucHV0XHJcblx0XHRcdGlmICghdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdGlmICh0aGlzLmlucHV0LmRpcmVjdGlvbikge1xyXG5cdFx0XHRcdFx0Ly8gQ2hlY2sgZm9yIFJ1biBJbnB1dFxyXG5cdFx0XHRcdFx0aWYgKHRoaXMuaW5wdXQucnVuKSB7XHJcblx0XHRcdFx0XHRcdGlmICh0aGlzLmVuZXJneSA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmlzUnVubmluZyA9IHRydWU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5pc1J1bm5pbmcgPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuaXNSdW5uaW5nID0gZmFsc2U7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUodGhpcy5pbnB1dC5kaXJlY3Rpb24pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gdGhpcy5nZXRQYWNrKCk7XHJcblx0fVxyXG5cdFxyXG5cdGdldFBhY2soKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRpZDogdGhpcy5pZCxcclxuXHRcdFx0bmFtZTogdGhpcy5uYW1lLFxyXG5cdFx0XHRzcHJpdGU6IHRoaXMuc3ByaXRlLFxyXG5cdFx0XHRkaXJlY3Rpb246IHRoaXMuZGlyZWN0aW9uLFxyXG5cdFx0XHRtYXBJZDogdGhpcy5tYXBJZCxcclxuXHRcdFx0eDogdGhpcy5zdGFydFgsXHJcblx0XHRcdHk6IHRoaXMuc3RhcnRZLFxyXG5cdFx0XHR6OiB0aGlzLnosXHJcblx0XHRcdGRlc3RpbmF0aW9uWDogdGhpcy5kZXN0aW5hdGlvblgsXHJcblx0XHRcdGRlc3RpbmF0aW9uWTogdGhpcy5kZXN0aW5hdGlvblksXHJcblx0XHRcdGxlcnA6IHRoaXMubGVycCxcclxuXHRcdFx0aXNSdW5uaW5nOiB0aGlzLmlzUnVubmluZyxcclxuXHRcdFx0aXNBdHRhY2tpbmc6IHRoaXMuaXNBdHRhY2tpbmcsXHJcblx0XHRcdGlzRGVhZDogdGhpcy5pc0RlYWQsXHJcblx0XHRcdGlzVmlzaWJsZTogdGhpcy5pc1Zpc2libGVcclxuXHRcdH07XHJcblx0fVxyXG5cdFxyXG5cdGdldFByaXZhdGVQYWNrKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0aWQ6IHRoaXMuaWQsXHJcblx0XHRcdGhlYWx0aDogdGhpcy5oZWFsdGgsXHJcblx0XHRcdGhlYWx0aE1heDogdGhpcy5oZWFsdGhNYXgsXHJcblx0XHRcdGVuZXJneTogdGhpcy5lbmVyZ3ksXHJcblx0XHRcdGVuZXJneU1heDogdGhpcy5lbmVyZ3lNYXgsXHJcblx0XHRcdG1vdmVTcGVlZDogdGhpcy5tb3ZlU3BlZWQsXHJcblx0XHRcdGF0dGFja1NwZWVkOiB0aGlzLmF0dGFja1NwZWVkLFxyXG5cdFx0XHRhdHRhY2tUaW1lcjogdGhpcy5hdHRhY2tUaW1lcixcclxuXHRcdFx0aW52ZW50b3J5OiB0aGlzLmdldEludmVudG9yeVBhY2soKVxyXG5cdFx0fTtcclxuXHR9XHJcblx0XHJcblx0Y2hlY2tBZG1pbihhY2Nlc3MgPSAxKSB7XHJcblx0XHRpZiAoYWNjZXNzIDwgMSkgYWNjZXNzID0gMTtcclxuXHRcdHJldHVybiAodGhpcy5hZG1pbkFjY2VzcyA+PSBhY2Nlc3MpO1xyXG5cdH1cclxuXHJcblx0b25JbnB1dChkYXRhKSB7XHJcblx0XHRzd2l0Y2ggKGRhdGEuaW5wdXQpIHtcclxuXHRcdFx0Y2FzZSBudWxsOlxyXG5cdFx0XHRjYXNlICdtb3ZlJzogdGhpcy5pbnB1dC5kaXJlY3Rpb24gPSBkYXRhLmRpcmVjdGlvbjtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ3J1bic6IHRoaXMuaW5wdXQucnVuID0gZGF0YS5zdGF0ZTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ3BpY2t1cCc6XHJcblx0XHRcdFx0aWYgKCF0aGlzLmlucHV0LnBpY2t1cCAmJiBkYXRhLnN0YXRlKSB7XHJcblx0XHRcdFx0XHR0aGlzLnBpY2tVcCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLmlucHV0LnBpY2t1cCA9IGRhdGEuc3RhdGU7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdhdHRhY2snOlxyXG5cdFx0XHRcdHRoaXMuaW5wdXQuYXR0YWNrID0gZGF0YS5zdGF0ZTtcclxuXHRcdFx0XHR0aGlzLmF0dGFjaygxLCB0aGlzLmRpcmVjdGlvbik7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdkb3VibGVDbGlja0l0ZW0nOlxyXG5cdFx0XHRcdGlmICh0aGlzLmludmVudG9yeVtkYXRhLnNsb3RdKSB7XHJcblx0XHRcdFx0XHRpZiAoIXRoaXMuaXNEZWFkKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMudXNlSXRlbShkYXRhLnNsb3QpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ3JpZ2h0Q2xpY2tJdGVtJzpcclxuXHRcdFx0XHRpZiAodGhpcy5pbnZlbnRvcnlbZGF0YS5zbG90XSkge1xyXG5cdFx0XHRcdFx0aWYgKCF0aGlzLmlzRGVhZCkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRyb3BJdGVtKGRhdGEuc2xvdCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnZHJhZ1N0b3BHYW1lJzpcclxuXHRcdFx0XHRpZiAodGhpcy5pbnZlbnRvcnlbZGF0YS5zbG90XSkge1xyXG5cdFx0XHRcdFx0aWYgKCF0aGlzLmlzRGVhZCkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRyb3BJdGVtKGRhdGEuc2xvdCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnZHJhZ1N0b3BJbnZlbnRvcnknOlxyXG5cdFx0XHRjYXNlICdkcmFnU3RvcEVxdWlwbWVudCc6XHJcblx0XHRcdFx0aWYgKHRoaXMuaW52ZW50b3J5W2RhdGEuc2xvdF0pIHtcclxuXHRcdFx0XHRcdGlmICghdGhpcy5pc0RlYWQpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5tb3ZlSXRlbVRvU2xvdChkYXRhLnNsb3QsIGRhdGEubmV3U2xvdCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnc2VydmVyQ2hhdCc6IGdhbWUuc2VuZFNlcnZlck1lc3NhZ2UoYCR7dGhpcy5uYW1lfSB5ZWxscywgXCIke2RhdGEubWVzc2FnZX1cImApO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnbWFwQ2hhdCc6IGdhbWUuc2VuZE1hcE1lc3NhZ2UodGhpcy5tYXBJZCwgYCR7dGhpcy5uYW1lfSBzYXlzLCBcIiR7ZGF0YS5tZXNzYWdlfVwiYCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdwbGF5ZXJDaGF0JzpcclxuXHRcdFx0XHRsZXQgdGFyZ2V0ID0gdGhpcy5wbGF5ZXJMaXN0W2RhdGEudGFyZ2V0SWRdO1xyXG5cdFx0XHRcdGlmICh0YXJnZXQpIHtcclxuXHRcdFx0XHRcdGdhbWUuc2VuZFBsYXllck1lc3NhZ2UodGFyZ2V0LmlkLCBgJHt0aGlzLm5hbWV9IHdoaXNwZXJzLCBcIiR7ZGF0YS5tZXNzYWdlfVwiYCk7XHJcblx0XHRcdFx0XHRnYW1lLnNlbmRQbGF5ZXJNZXNzYWdlKHRoaXMuaWQsIGBZb3Ugd2hpc3BlciB0byAke3RhcmdldC5uYW1lfSwgXCIke2RhdGEubWVzc2FnZX1cImApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHQvLyBHb2QgSW5wdXRzXHJcblx0XHRcdGNhc2UgJ3NwYXduSXRlbSc6XHJcblx0XHRcdFx0aWYgKHRoaXMuY2hlY2tBZG1pbigyKSkge1xyXG5cdFx0XHRcdFx0Z2FtZS5zcGF3bk1hcEl0ZW0oZGF0YS5tYXBJZCwgZGF0YS54LCBkYXRhLnksIGRhdGEudHlwZSwgZGF0YS5zdGFjayk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0Z2FtZS5zZW5kUGxheWVyTWVzc2FnZSh0aGlzLmlkLCBgWW91IGRvbid0IGhhdmUgYWNjZXNzIHRvIHRoYXQgY29tbWFuZC5gKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICd1cGxvYWRNYXAnOlxyXG5cdFx0XHRcdGlmICh0aGlzLmNoZWNrQWRtaW4oMikpIHtcclxuXHRcdFx0XHRcdGdhbWUubWFwTGlzdFtkYXRhLm1hcElkXS51cGxvYWQoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRnYW1lLnNlbmRQbGF5ZXJNZXNzYWdlKHRoaXMuaWQsIGBZb3UgZG9uJ3QgaGF2ZSBhY2Nlc3MgdG8gdGhhdCBjb21tYW5kLmApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwaWNrVXAoKSB7XHJcblx0XHRmb3IgKGxldCBpdGVtIG9mIGdhbWUubWFwTGlzdFt0aGlzLm1hcElkXS5pdGVtcykge1xyXG5cdFx0XHRpZiAoaXRlbSAmJiBpdGVtLnggPT09IHRoaXMueCAmJiBpdGVtLnkgPT09IHRoaXMueSkge1xyXG5cdFx0XHRcdGxldCBzbG90ID0gdGhpcy5nZXRNYXBJdGVtKGl0ZW0ubWFwSWQsIGl0ZW0uaWQpO1xyXG5cdFx0XHRcdGlmIChzbG90ICE9IG51bGwpIHtcclxuXHRcdFx0XHRcdGl0ZW0ubW92ZVRvUGxheWVyKHRoaXMuaWQsIHNsb3QpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdC8vIEludmVudG9yeSBmdWxsXHJcblx0XHRcdFx0XHRnYW1lLnNlbmRQbGF5ZXJNZXNzYWdlKHRoaXMuaWQsIFwiWW91ciBpbnZlbnRvcnkgaXMgZnVsbC5cIik7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn0iLCJpbXBvcnQgZ2FtZSBmcm9tICcuLi9nYW1lLmpzJztcclxuaW1wb3J0IHV0aWwgZnJvbSAnLi4vdXRpbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXh0IHtcclxuXHRjb25zdHJ1Y3RvcihtYXBJZCwgeCwgeSwgbWVzc2FnZSwgY29sb3VyID0gJyMwMDAwMDAnLCBkaXNwbGF5VGltZSA9IDIsIHZlbFggPSAwLCB2ZWxZID0gMCkge1xyXG5cdFx0dGhpcy5tYXBJZCA9IG1hcElkO1xyXG5cdFx0dGhpcy54ID0geDtcclxuXHRcdHRoaXMueSA9IHk7XHJcblx0XHR0aGlzLnZlbFggPSB2ZWxYO1xyXG5cdFx0dGhpcy52ZWxZID0gdmVsWTtcclxuXHRcdHRoaXMubGVycFggPSAwO1xyXG5cdFx0dGhpcy5sZXJwWSA9IDA7XHJcblxyXG5cdFx0dGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcclxuXHRcdHRoaXMuY29sb3VyID0gY29sb3VyO1xyXG5cdFx0dGhpcy5kaXNwbGF5VGltZSA9IGRpc3BsYXlUaW1lO1xyXG5cdFx0dGhpcy50aW1lciA9IDA7XHJcblxyXG5cdFx0dGhpcy5pZCA9IHV0aWwuZmlyc3RFbXB0eUluZGV4KGdhbWUubWFwTGlzdFt0aGlzLm1hcElkXS50ZXh0cyk7XHJcblx0XHRnYW1lLm1hcExpc3RbdGhpcy5tYXBJZF0udGV4dHNbdGhpcy5pZF0gPSB0aGlzO1xyXG5cdFx0Y29uc29sZS5sb2codGhpcy5pZCk7XHJcblx0fVxyXG5cdFxyXG5cdHVwZGF0ZShkZWx0YSkge1xyXG5cdFx0dGhpcy50aW1lciArPSBkZWx0YTtcclxuXHRcdGlmICh0aGlzLmRpc3BsYXlUaW1lID4gMCAmJiB0aGlzLnRpbWVyID4gdGhpcy5kaXNwbGF5VGltZSkge1xyXG5cdFx0XHR0aGlzLnJlbW92ZSgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMubGVycFggKz0gZGVsdGEgKiB0aGlzLnZlbFg7XHJcblx0XHR0aGlzLmxlcnBZICs9IGRlbHRhICogdGhpcy52ZWxZO1xyXG5cclxuXHRcdGlmICh0aGlzLmxlcnBYIDwgLTEpIHtcclxuXHRcdFx0dGhpcy5sZXJwWCsrO1xyXG5cdFx0XHR0aGlzLngtLTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKHRoaXMubGVycFggPiAxKSB7XHJcblx0XHRcdHRoaXMubGVycFgtLTtcclxuXHRcdFx0dGhpcy54Kys7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMubGVycFkgPCAtMSkge1xyXG5cdFx0XHR0aGlzLmxlcnBZKys7XHJcblx0XHRcdHRoaXMueS0tO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAodGhpcy5sZXJwWSA+IDEpIHtcclxuXHRcdFx0dGhpcy5sZXJwWS0tO1xyXG5cdFx0XHR0aGlzLnkrKztcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIHRoaXMuZ2V0UGFjaygpO1xyXG5cdH1cclxuXHRcclxuXHRnZXRQYWNrKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0aWQ6IHRoaXMuaWQsXHJcblx0XHRcdG1hcElkOiB0aGlzLm1hcElkLFxyXG5cdFx0XHR4OiB0aGlzLngsXHJcblx0XHRcdHk6IHRoaXMueSxcclxuXHRcdFx0bGVycFg6IHRoaXMubGVycFgsXHJcblx0XHRcdGxlcnBZOiB0aGlzLmxlcnBZLFxyXG5cdFx0XHRtZXNzYWdlOiB0aGlzLm1lc3NhZ2UsXHJcblx0XHRcdGNvbG91cjogdGhpcy5jb2xvdXJcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHRyZW1vdmUoKSB7XHJcblx0XHRkZWxldGUgZ2FtZS5tYXBMaXN0W3RoaXMubWFwSWRdLnRleHRzW3RoaXMuaWRdO1xyXG5cdH1cclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBUaWxlIHtcclxuXHRjb25zdHJ1Y3RvcihkYXRhKSB7XHJcblx0XHR0aGlzLmxheWVyID0gZGF0YS5sYXllcjtcclxuICAgIHRoaXMud2FsbCA9IGRhdGEud2FsbDtcclxuICAgIHRoaXMuY2FuQXR0YWNrID0gZGF0YS5jYW5BdHRhY2s7XHJcbiAgICB0aGlzLmRhbWFnZSA9IGRhdGEuZGFtYWdlO1xyXG5cdFx0dGhpcy5kZWZlbmNlID0gZGF0YS5kZWZlbmNlO1xyXG5cdFx0dGhpcy5oZWFsdGhNYXggPSBkYXRhLmhlYWx0aE1heDtcclxuXHRcdHRoaXMuaGVhbHRoID0gdGhpcy5oZWFsdGhNYXg7XHJcblxyXG5cdFx0dGhpcy53YXJwTWFwID0gZGF0YS53YXJwTWFwO1xyXG5cdFx0dGhpcy53YXJwWCA9IGRhdGEud2FycFg7XHJcblx0XHR0aGlzLndhcnBZID0gZGF0YS53YXJwWTtcclxuICB9XHJcblxyXG5cdG9uV2FsaygpIHtcclxuXHRcdC8vIFJ1biBNYXBXYWxrI194X3kgc2NyaXB0XHJcbiAgfVxyXG4gIFxyXG5cdG9uQ2xpY2soKSB7XHJcblx0XHQvLyBSdW4gTWFwQ2xpY2sjX3hfeSBzY3JpcHRcclxuICB9XHJcbiAgXHJcblx0b25BdHRhY2soKSB7XHJcblx0XHQvLyBSdW4gTWFwQXR0YWNrI194X3kgc2NyaXB0XHJcbiAgfVxyXG4gIFxyXG4gIGdldFBhY2soKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBsYXllcjogdGhpcy5sYXllcixcclxuICAgICAgd2FsbDogdGhpcy53YWxsLFxyXG4gICAgICBjYW5BdHRhY2s6IHRoaXMuY2FuQXR0YWNrLFxyXG4gICAgICBkYW1hZ2U6IHRoaXMuZGFtYWdlLFxyXG4gICAgICBkZWZlbmNlOiB0aGlzLmRlZmVuY2UsXHJcbiAgICAgIGhlYWx0aE1heDogdGhpcy5oZWFsdGhNYXgsXHJcbiAgICAgIHdhcnBNYXA6IHRoaXMud2FycE1hcCxcclxuICAgICAgd2FycFg6IHRoaXMud2FycFgsXHJcbiAgICAgIHdhcnBZOiB0aGlzLndhcnBZXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG4iLCJjb25zdCBjb25maWcgPSB7fTtcclxuXHJcbmNvbmZpZy5QT1JUID0gMjAwMDtcclxuY29uZmlnLkZSQU1FUkFURSA9IDEwMDAgLyA2MDtcclxuY29uZmlnLkJBQ0tVUF9USU1FID0gNTtcclxuXHJcbmNvbmZpZy5NQVBfTEFZRVJTID0gNjtcclxuY29uZmlnLk1BUF9DT0xVTU5TID0gMTI7XHJcbmNvbmZpZy5NQVBfUk9XUyA9IDEyO1xyXG5cclxuY29uZmlnLk1BWF9NQVBTID0gMTA7XHJcbmNvbmZpZy5NQVhfVVNFUlMgPSAxMDA7XHJcbmNvbmZpZy5NQVhfU1BSSVRFUyA9IDEzO1xyXG5jb25maWcuTUFYX0VGRkVDVFMgPSA3MDtcclxuXHJcbmNvbmZpZy5NQVhfSEVBTFRIX0JBU0UgPSAyMDA7XHJcbmNvbmZpZy5NQVhfSEVBTFRIX0JPTlVTID0gNTU7XHJcbmNvbmZpZy5NQVhfRU5FUkdZX0JBU0UgPSAyMDA7XHJcbmNvbmZpZy5NQVhfRU5FUkdZX0JPTlVTID0gNTU7XHJcblxyXG5jb25maWcuSU5WRU5UT1JZX1NJWkUgPSAyMDtcclxuY29uZmlnLkVRVUlQTUVOVF9TSVpFID0gNTtcclxuXHJcbmNvbmZpZy5TVEFSVF9NQVAgPSAxO1xyXG5jb25maWcuU1RBUlRfWCA9IDU7XHJcbmNvbmZpZy5TVEFSVF9ZID0gNTtcclxuY29uZmlnLlNUQVJUX05BTUUgPSAnTmV3IFBsYXllcic7XHJcbmNvbmZpZy5TVEFSVF9TUFJJVEUgPSAxO1xyXG5jb25maWcuU1RBUlRfREFNQUdFID0gMjtcclxuY29uZmlnLlNUQVJUX0RFRkVOQ0UgPSAwO1xyXG5jb25maWcuU1RBUlRfSEVBTFRIX01BWCA9IDIwO1xyXG5jb25maWcuU1RBUlRfRU5FUkdZX01BWCA9IDEwO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY29uZmlnO1xyXG4iLCJpbXBvcnQgbW9uZ29qcyBmcm9tIFwibW9uZ29qc1wiO1xyXG5pbXBvcnQgY29uZmlnIGZyb20gXCIuL2NvbmZpZy5qc1wiO1xyXG5cclxuY29uc3QgbW9uZ28gPSBtb25nb2pzKCdsb2NhbGhvc3Q6MjcwMTcvb2R5c3NleScsIFsnYWNjb3VudHMnLCAncGxheWVycycsICdtYXBzJywgJ2l0ZW1zJywgJ2JvdHMnXSk7XHJcblxyXG5jbGFzcyBEYXRhYmFzZSB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAvLyBUaGVzZSBzaG91bGQgYmUgaGVsZCBpbiB0aGUgZGF0YWJhc2VcclxuICAgIHRoaXMuaXRlbXMgPSBbXHJcbiAgICAgIHtcdC8vIHR5cGUgMFxyXG4gICAgICAgIG5hbWU6IFwiQmxhbmsgSXRlbVwiLFxyXG4gICAgICAgIHNwcml0ZTogNjgsXHJcbiAgICAgICAgdHlwZTogJ25vbmUnLFxyXG4gICAgICAgIHN0YWNrOiAwLFxyXG4gICAgICAgIHJldXNhYmxlOiBmYWxzZSxcclxuICAgICAgICBkYW1hZ2VCb251czogMCxcclxuICAgICAgICBkZWZlbmNlQm9udXM6IDAsXHJcbiAgICAgICAgaGVhbHRoTWF4Qm9udXM6IDAsXHJcbiAgICAgICAgZW5lcmd5TWF4Qm9udXM6IDAsXHJcbiAgICAgICAgcmFuZ2VCb251czogMFxyXG4gICAgICB9LFxyXG4gICAgICB7XHQvLyB0eXBlIDFcclxuICAgICAgICBuYW1lOiBcIkhlYWx0aCBQb3Rpb25cIixcclxuICAgICAgICBzcHJpdGU6IDEsXHJcbiAgICAgICAgdHlwZTogJ3BvdGlvbicsXHJcbiAgICAgICAgc3RhY2s6IDEsXHJcbiAgICAgICAgcmV1c2FibGU6IGZhbHNlLFxyXG4gICAgICAgIGRhbWFnZUJvbnVzOiAwLFxyXG4gICAgICAgIGRlZmVuY2VCb251czogMCxcclxuICAgICAgICBoZWFsdGhNYXhCb251czogMCxcclxuICAgICAgICBlbmVyZ3lNYXhCb251czogMCxcclxuICAgICAgICByYW5nZUJvbnVzOiAwXHJcbiAgICAgIH0sIFxyXG4gICAgICB7XHQvLyB0eXBlIDJcclxuICAgICAgICBuYW1lOiBcIkVuZXJneSBQb3Rpb25cIixcclxuICAgICAgICBzcHJpdGU6IDIsXHJcbiAgICAgICAgdHlwZTogJ3BvdGlvbicsXHJcbiAgICAgICAgc3RhY2s6IDEsXHJcbiAgICAgICAgcmV1c2FibGU6IGZhbHNlLFxyXG4gICAgICAgIGRhbWFnZUJvbnVzOiAwLFxyXG4gICAgICAgIGRlZmVuY2VCb251czogMCxcclxuICAgICAgICBoZWFsdGhNYXhCb251czogMCxcclxuICAgICAgICBlbmVyZ3lNYXhCb251czogMCxcclxuICAgICAgICByYW5nZUJvbnVzOiAwXHJcbiAgICAgIH0sIFxyXG4gICAgICB7XHQvLyB0eXBlIDNcclxuICAgICAgICBuYW1lOiBcIkluY29nbml0b1wiLFxyXG4gICAgICAgIHNwcml0ZTogMTIsXHJcbiAgICAgICAgdHlwZTogJ3NwZWNpYWwnLFxyXG4gICAgICAgIHN0YWNrOiAwLFxyXG4gICAgICAgIHJldXNhYmxlOiB0cnVlLFxyXG4gICAgICAgIGRhbWFnZUJvbnVzOiAwLFxyXG4gICAgICAgIGRlZmVuY2VCb251czogMCxcclxuICAgICAgICBoZWFsdGhNYXhCb251czogMCxcclxuICAgICAgICBlbmVyZ3lNYXhCb251czogMCxcclxuICAgICAgICByYW5nZUJvbnVzOiAwXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcdC8vIHR5cGUgNFxyXG4gICAgICAgIG5hbWU6IFwiU3dvcmRcIixcclxuICAgICAgICBzcHJpdGU6IDEwLFxyXG4gICAgICAgIHR5cGU6ICd3ZWFwb24nLFxyXG4gICAgICAgIHN0YWNrOiAwLFxyXG4gICAgICAgIHJldXNhYmxlOiB0cnVlLFxyXG4gICAgICAgIGRhbWFnZUJvbnVzOiAxLFxyXG4gICAgICAgIGRlZmVuY2VCb251czogMCxcclxuICAgICAgICBoZWFsdGhNYXhCb251czogMCxcclxuICAgICAgICBlbmVyZ3lNYXhCb251czogMCxcclxuICAgICAgICByYW5nZUJvbnVzOiAwXHJcbiAgICAgICAgXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcdC8vIHR5cGUgNVxyXG4gICAgICAgIG5hbWU6IFwiQXhlXCIsXHJcbiAgICAgICAgc3ByaXRlOiAxNCxcclxuICAgICAgICB0eXBlOiAnd2VhcG9uJyxcclxuICAgICAgICBzdGFjazogMCxcclxuICAgICAgICByZXVzYWJsZTogdHJ1ZSxcclxuICAgICAgICBkYW1hZ2VCb251czogMixcclxuICAgICAgICBkZWZlbmNlQm9udXM6IDAsXHJcbiAgICAgICAgaGVhbHRoTWF4Qm9udXM6IDAsXHJcbiAgICAgICAgZW5lcmd5TWF4Qm9udXM6IDAsXHJcbiAgICAgICAgcmFuZ2VCb251czogMFxyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgXTtcclxuXHJcbiAgICB0aGlzLm1hcHMgPSBbXHJcbiAgICAgIHtcdC8vIGlkIDBcclxuICAgICAgICBuYW1lOiBcIkJsYW5rIE1hcFwiLFxyXG4gICAgICAgIGRyb3BDaGFuY2U6IDEwMCxcclxuICAgICAgICBkcm9wQW1vdW50RVE6IDAsXHJcbiAgICAgICAgam9pbjpcdFx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgIGxlYXZlOlx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICB7XHQvLyBpZCAxXHJcbiAgICAgICAgbmFtZTogXCJDcmVuZGFsZSAxXCIsXHJcbiAgICAgICAgZHJvcENoYW5jZTogMTAwLFxyXG4gICAgICAgIGRyb3BBbW91bnRFUTogMCxcclxuICAgICAgICBqb2luOlx0XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgbGVhdmU6XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcdC8vIGlkIDJcclxuICAgICAgICBuYW1lOiBcIkNyZW5kYWxlIDJcIixcclxuICAgICAgICBkcm9wQ2hhbmNlOiAxMDAsXHJcbiAgICAgICAgZHJvcEFtb3VudEVROiAwLFxyXG4gICAgICAgIGpvaW46XHRcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICBsZWF2ZTpcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAge1x0Ly8gaWQgM1xyXG4gICAgICAgIG5hbWU6IFwiQ3JlbmRhbGUgM1wiLFxyXG4gICAgICAgIGRyb3BDaGFuY2U6IDEwMCxcclxuICAgICAgICBkcm9wQW1vdW50RVE6IDAsXHJcbiAgICAgICAgam9pbjpcdFx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgIGxlYXZlOlx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICB7XHQvLyBpZCA0XHJcbiAgICAgICAgbmFtZTogXCJDcmVuZGFsZSA0XCIsXHJcbiAgICAgICAgZHJvcENoYW5jZTogMTAwLFxyXG4gICAgICAgIGRyb3BBbW91bnRFUTogMCxcclxuICAgICAgICBqb2luOlx0XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgbGVhdmU6XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcdC8vIGlkIDVcclxuICAgICAgICBuYW1lOiBcIkNyZW5kYWxlIDVcIixcclxuICAgICAgICBkcm9wQ2hhbmNlOiAxMDAsXHJcbiAgICAgICAgZHJvcEFtb3VudEVROiAwLFxyXG4gICAgICAgIGpvaW46XHRcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICBsZWF2ZTpcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAge1x0Ly8gaWQgNlxyXG4gICAgICAgIG5hbWU6IFwiQ3JlbmRhbGUgNlwiLFxyXG4gICAgICAgIGRyb3BDaGFuY2U6IDEwMCxcclxuICAgICAgICBkcm9wQW1vdW50RVE6IDAsXHJcbiAgICAgICAgam9pbjpcdFx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgIGxlYXZlOlx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICB7XHQvLyBpZCA3XHJcbiAgICAgICAgbmFtZTogXCJDcmVuZGFsZSA3XCIsXHJcbiAgICAgICAgZHJvcENoYW5jZTogMTAwLFxyXG4gICAgICAgIGRyb3BBbW91bnRFUTogMCxcclxuICAgICAgICBqb2luOlx0XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgbGVhdmU6XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcdC8vIGlkIDhcclxuICAgICAgICBuYW1lOiBcIkNyZW5kYWxlIDhcIixcclxuICAgICAgICBkcm9wQ2hhbmNlOiAxMDAsXHJcbiAgICAgICAgZHJvcEFtb3VudEVROiAwLFxyXG4gICAgICAgIGpvaW46XHRcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICBsZWF2ZTpcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAge1x0Ly8gaWQgOVxyXG4gICAgICAgIG5hbWU6IFwiQ3JlbmRhbGUgOVwiLFxyXG4gICAgICAgIGRyb3BDaGFuY2U6IDEwMCxcclxuICAgICAgICBkcm9wQW1vdW50RVE6IDAsXHJcbiAgICAgICAgam9pbjpcdFx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgIGxlYXZlOlx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgXTtcclxuXHJcbiAgICB0aGlzLnBsYXllcnMgPSBbXHJcbiAgICAgIHtcdC8vaWQgMFxyXG4gICAgICAgIG5hbWU6IFwiRmFua2Fkb3JlXCIsXHJcbiAgICAgICAgc3ByaXRlOiAxLFxyXG4gICAgICAgIGFkbWluQWNjZXNzOiAwLFxyXG4gICAgICAgIG1hcElkOiAxLFxyXG4gICAgICAgIHg6IDUsXHJcbiAgICAgICAgeTogNSxcclxuICAgICAgICBkYW1hZ2VCYXNlOiAxMCxcclxuICAgICAgICBkZWZlbmNlQmFzZTogMixcclxuICAgICAgICBoZWFsdGhNYXhCYXNlOiAyMCxcclxuICAgICAgICBlbmVyZ3lNYXhCYXNlOiA0MCxcclxuICAgICAgICByYW5nZUJhc2U6IDFcclxuICAgICAgfSxcclxuICAgICAge1x0Ly9pZCAxXHJcbiAgICAgICAgbmFtZTogXCJPYmJpdHRcIixcclxuICAgICAgICBzcHJpdGU6IDMsXHJcbiAgICAgICAgYWRtaW5BY2Nlc3M6IDAsXHJcbiAgICAgICAgbWFwSWQ6IDEsXHJcbiAgICAgICAgeDogNCxcclxuICAgICAgICB5OiA0LFxyXG4gICAgICAgIGRhbWFnZUJhc2U6IDEwLFxyXG4gICAgICAgIGRlZmVuY2VCYXNlOiAyLFxyXG4gICAgICAgIGhlYWx0aE1heEJhc2U6IDIwLFxyXG4gICAgICAgIGVuZXJneU1heEJhc2U6IDQwLFxyXG4gICAgICAgIHJhbmdlQmFzZTogMVxyXG4gICAgICB9LFxyXG4gICAgICB7XHQvL2lkIDJcclxuICAgICAgICBuYW1lOiBcIkZyb2xpa1wiLFxyXG4gICAgICAgIHNwcml0ZTogNSxcclxuICAgICAgICBhZG1pbkFjY2VzczogMCxcclxuICAgICAgICBtYXBJZDogMSxcclxuICAgICAgICB4OiA1LFxyXG4gICAgICAgIHk6IDUsXHJcbiAgICAgICAgZGFtYWdlQmFzZTogMTAsXHJcbiAgICAgICAgZGVmZW5jZUJhc2U6IDIsXHJcbiAgICAgICAgaGVhbHRoTWF4QmFzZTogMjAsXHJcbiAgICAgICAgZW5lcmd5TWF4QmFzZTogNDAsXHJcbiAgICAgICAgcmFuZ2VCYXNlOiAxXHJcbiAgICAgIH0sXHJcbiAgICBdO1xyXG5cclxuICAgIHRoaXMuYm90cyA9IFtcclxuICAgICAge1x0Ly9pZCAwXHJcbiAgICAgICAgbmFtZTogXCJSYXRcIixcclxuICAgICAgICBzcHJpdGU6IDAsXHJcbiAgICAgICAgaG9zdGlsZTogZmFsc2UsXHJcbiAgICAgICAgZGFtYWdlQmFzZTogMSxcclxuICAgICAgICBkZWZlbmNlQmFzZTogMCxcclxuICAgICAgICBoZWFsdGhNYXhCYXNlOiA1LFxyXG4gICAgICAgIGVuZXJneU1heEJhc2U6IDEwLFxyXG4gICAgICAgIHJhbmdlQmFzZTogMVxyXG4gICAgICB9LFxyXG4gICAgICB7XHQvL2lkIDFcclxuICAgICAgICBuYW1lOiBcIlNuYWtlXCIsXHJcbiAgICAgICAgc3ByaXRlOiAxLFxyXG4gICAgICAgIGhvc3RpbGU6IHRydWUsXHJcbiAgICAgICAgZGFtYWdlQmFzZTogMixcclxuICAgICAgICBkZWZlbmNlQmFzZTogMCxcclxuICAgICAgICBoZWFsdGhNYXhCYXNlOiA1LFxyXG4gICAgICAgIGVuZXJneU1heEJhc2U6IDUsXHJcbiAgICAgICAgcmFuZ2VCYXNlOiAxXHJcbiAgICAgIH0sXHJcbiAgICBdO1xyXG5cclxuICB9XHJcblxyXG5cdGxvZyhtZXNzYWdlKSB7XHJcblx0XHRjb25zb2xlLmxvZyhtZXNzYWdlKTtcclxuXHR9XHJcblxyXG4gIGZpbmQodXNlcm5hbWUpIHtcclxuICAgIG1vbmdvLmFjY291bnRzLmZpbmRPbmUoe3VzZXJuYW1lOiB1c2VybmFtZX0sIChlcnIsIHJlcykgPT4ge1xyXG4gICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XHJcbiAgICAgIGlmIChyZXMpIHtcclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHRoaXMubG9nKGBQbGF5ZXIgbm90IGZvdW5kIHdpdGggdXNlcm5hbWU6ICR7dXNlcm5hbWV9YCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0UGxheWVyRGF0YShpZCkge1xyXG4gICAgbGV0IHBsYXllckRhdGEgPSB7fTtcclxuXHJcbiAgICBpZiAodGhpcy5wbGF5ZXJzW2lkXSkge1x0Ly8gRnJvbSBEYXRhYmFzZVxyXG4gICAgICBwbGF5ZXJEYXRhID0gdGhpcy5wbGF5ZXJzW2lkXTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1x0Ly8gRmlyc3QgTG9naW5cclxuICAgICAgcGxheWVyRGF0YS5uYW1lID0gY29uZmlnLlNUQVJUX05BTUU7XHJcbiAgICAgIHBsYXllckRhdGEuc3ByaXRlID0gY29uZmlnLlNUQVJUX1NQUklURTtcclxuICAgICAgcGxheWVyRGF0YS5hZG1pbkFjY2VzcyA9IDA7XHJcbiAgICAgIFxyXG4gICAgICBwbGF5ZXJEYXRhLm1hcElkID0gY29uZmlnLlNUQVJUX01BUDtcclxuICAgICAgcGxheWVyRGF0YS54ID0gY29uZmlnLlNUQVJUX1g7XHJcbiAgICAgIHBsYXllckRhdGEueSA9IGNvbmZpZy5TVEFSVF9ZO1xyXG4gICAgICBcclxuICAgICAgcGxheWVyRGF0YS5kYW1hZ2VCYXNlID0gY29uZmlnLlNUQVJUX0RBTUFHRTtcclxuICAgICAgcGxheWVyRGF0YS5kZWZlbmNlQmFzZSA9IGNvbmZpZy5TVEFSVF9ERUZFTkNFO1xyXG4gICAgICBwbGF5ZXJEYXRhLmhlYWx0aE1heEJhc2UgPSBjb25maWcuU1RBUlRfSEVBTFRIX01BWDtcclxuICAgICAgcGxheWVyRGF0YS5lbmVyZ3lNYXhCYXNlID0gY29uZmlnLlNUQVJUX0VORVJHWV9NQVg7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJldHVybiBwbGF5ZXJEYXRhO1xyXG4gIH1cclxuXHJcbiAgc2F2ZVBsYXllckRhdGEoZGF0YSkge1xyXG4gICAgLy9tb25nby5wbGF5ZXJzLnNhdmUoZGF0YS5pZCwgZGF0YSk7XHJcbiAgfVxyXG5cclxuICBnZXRNYXBEYXRhKGlkKSB7XHJcbiAgICBsZXQgbWFwRGF0YSA9IHt9O1xyXG5cclxuICAgIGlmICh0aGlzLm1hcHNbaWRdKSB7XHJcbiAgICAgIG1hcERhdGEgPSB0aGlzLm1hcHNbaWRdO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIG1hcERhdGEubmFtZSA9IFwiQmxhbmsgTWFwXCI7XHJcbiAgICAgIG1hcERhdGEuaXRlbXMgPSBbXTtcclxuICAgICAgbWFwRGF0YS5ib3RzID0gW107XHJcbiAgICAgIG1hcERhdGEuZWZmZWN0cyA9IFtdO1xyXG4gICAgICBtYXBEYXRhLnRleHRzID0gW107XHJcbiAgICAgIG1hcERhdGEuZHJvcENoYW5jZSA9IDEwMDtcclxuICAgICAgbWFwRGF0YS5kcm9wQW1vdW50RVEgPSA1O1xyXG4gICAgICBtYXBEYXRhLnRpbGVzID0ge1xyXG4gICAgICAgIGxheWVyOiBbIFxyXG4gICAgICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxyXG4gICAgICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxyXG4gICAgICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxyXG4gICAgICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxyXG4gICAgICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxyXG4gICAgICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgd2FsbDogW2ZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2VdLFxyXG4gICAgICAgIGNhbkF0dGFjazogW2ZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2VdLFxyXG4gICAgICAgIGRhbWFnZTogWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxyXG4gICAgICAgIGRlZmVuY2U6IFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcclxuICAgICAgICBoZWFsdGhNYXg6IFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcclxuICAgICAgICB3YXJwTWFwOiBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXHJcbiAgICAgICAgd2FycFg6IFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcclxuICAgICAgICB3YXJwWTogWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdXHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hcERhdGE7XHJcbiAgfVxyXG4gIFxyXG4gIHNhdmVNYXBEYXRhKGRhdGEpIHtcclxuICAgIG1vbmdvLm1hcHMuc2F2ZShkYXRhLmlkLCBkYXRhKTtcclxuICB9XHJcblxyXG4gIGdldEJvdERhdGEoYm90Q2xhc3MpIHtcclxuICAgIHJldHVybiB0aGlzLmJvdHNbYm90Q2xhc3NdO1xyXG4gIH1cclxuXHJcbiAgc2F2ZUJvdERhdGEobWFwSWQsIGlkKSB7XHJcblxyXG4gIH1cclxuXHJcbiAgZ2V0SXRlbURhdGEoaXRlbUNsYXNzKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pdGVtc1tpdGVtQ2xhc3NdO1xyXG4gIH1cclxufVxyXG5cclxuY29uc3QgZGIgPSBuZXcgRGF0YWJhc2UoKTtcclxuZXhwb3J0IGRlZmF1bHQgZGI7XHJcbiIsImltcG9ydCBmcyBmcm9tICdmcyc7XHJcblxyXG5pbXBvcnQgZGIgZnJvbSAnLi9kYi5qcyc7XHJcbmltcG9ydCBjb25maWcgZnJvbSAnLi9jb25maWcuanMnO1xyXG5pbXBvcnQgdXRpbCBmcm9tICcuL3V0aWwuanMnO1xyXG5pbXBvcnQgTWFwIGZyb20gJy4vY2xhc3Nlcy9tYXAuanMnO1xyXG5pbXBvcnQgUGxheWVyIGZyb20gJy4vY2xhc3Nlcy9wbGF5ZXIuanMnO1xyXG5pbXBvcnQgQm90IGZyb20gJy4vY2xhc3Nlcy9ib3QuanMnO1xyXG5pbXBvcnQgSXRlbSBmcm9tICcuL2NsYXNzZXMvaXRlbS5qcyc7XHJcbmltcG9ydCBUZXh0IGZyb20gJy4vY2xhc3Nlcy90ZXh0LmpzJztcclxuaW1wb3J0IE1lc3NhZ2UgZnJvbSAnLi9jbGFzc2VzL21lc3NhZ2UuanMnO1xyXG5cclxuY2xhc3MgR2FtZSB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHR0aGlzLnBsYXllckxpc3QgPSBbXTtcclxuXHRcdHRoaXMubWFwTGlzdCA9IFtdO1xyXG5cdFx0dGhpcy5tZXNzYWdlUXVldWUgPSBbXTtcclxuXHJcblx0XHQvLyBDcmVhdGUgTWFwc1xyXG5cdFx0dGhpcy5tYXBEYXRhID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoJy4vc2VydmVyL2RhdGEvbWFwLmpzb24nLCAndXRmOCcpKTtcclxuXHRcdGZvciAobGV0IGlkID0gMDsgaWQgPCBjb25maWcuTUFYX01BUFM7IGlkKyspIHtcclxuXHRcdFx0dGhpcy5tYXBMaXN0W2lkXSA9IG5ldyBNYXAoaWQsIHRoaXMubWFwRGF0YVtpZF0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHRsZXQgcGFjayA9IHtcclxuXHRcdFx0cGxheWVyczogW10sXHJcblx0XHRcdG1hcHM6IFtdLFxyXG5cdFx0XHRtZXNzYWdlczogdGhpcy5tZXNzYWdlUXVldWVcclxuXHRcdH07XHJcblx0XHRcclxuXHRcdHRoaXMucGxheWVyTGlzdC5mb3JFYWNoKChwbGF5ZXIpID0+IHtcclxuXHRcdFx0cGFjay5wbGF5ZXJzW3BsYXllci5pZF0gPSBwbGF5ZXIudXBkYXRlKGRlbHRhKTtcclxuXHRcdH0pO1xyXG5cdFx0XHJcblx0XHR0aGlzLm1hcExpc3QuZm9yRWFjaCgobWFwKSA9PiB7XHJcblx0XHRcdHBhY2subWFwc1ttYXAuaWRdID0gbWFwLnVwZGF0ZShkZWx0YSk7XHJcblx0XHR9KTtcclxuXHJcblx0XHR0aGlzLm1lc3NhZ2VRdWV1ZSA9IFtdO1xyXG5cdFx0cmV0dXJuIHBhY2s7XHJcblx0fVxyXG5cclxuXHQvLyBQbGF5ZXJzXHJcblx0cGxheWVyTG9naW4oaWQpIHtcclxuXHRcdGxldCBwbGF5ZXIgPSBuZXcgUGxheWVyKGlkKTtcclxuXHRcdHRoaXMucGxheWVyTGlzdFtpZF0gPSBwbGF5ZXI7XHJcblx0XHR0aGlzLnNlbmRTZXJ2ZXJNZXNzYWdlKGAke3BsYXllci5uYW1lfSBoYXMgbG9nZ2VkIGluLmApO1xyXG5cdFx0cmV0dXJuIHBsYXllcjtcclxuXHR9XHJcblx0XHJcblx0cGxheWVyTG9nb3V0KGlkKSB7XHJcblx0XHRsZXQgcGxheWVyID0gdGhpcy5wbGF5ZXJMaXN0W2lkXTtcclxuXHRcdGlmIChwbGF5ZXIpIHtcclxuXHRcdFx0ZGIuc2F2ZVBsYXllckRhdGEocGxheWVyLmdldFBhY2spO1xyXG5cdFx0XHR0aGlzLnNlbmRTZXJ2ZXJNZXNzYWdlKGAke3BsYXllci5uYW1lfSBoYXMgbG9nZ2VkIG91dC5gKTtcclxuXHRcdFx0ZGVsZXRlIHRoaXMucGxheWVyTGlzdFtpZF07XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLyBNZXNzYWdlc1xyXG5cdHNlbmRTZXJ2ZXJNZXNzYWdlKG1lc3NhZ2UpIHtcclxuXHRcdHRoaXMubWVzc2FnZVF1ZXVlLnB1c2gobmV3IE1lc3NhZ2UobWVzc2FnZSwgbnVsbCwgbnVsbCkpO1xyXG5cdH1cclxuXHJcblx0c2VuZE1hcE1lc3NhZ2UobWFwSWQsIG1lc3NhZ2UpIHtcclxuXHRcdHRoaXMubWVzc2FnZVF1ZXVlLnB1c2gobmV3IE1lc3NhZ2UobWVzc2FnZSwgbWFwSWQsIG51bGwpKTtcclxuXHR9XHJcblxyXG5cdHNlbmRQbGF5ZXJNZXNzYWdlKGlkLCBtZXNzYWdlKSB7XHJcblx0XHR0aGlzLm1lc3NhZ2VRdWV1ZS5wdXNoKG5ldyBNZXNzYWdlKG1lc3NhZ2UsIG51bGwsIGlkKSk7XHJcblx0fVxyXG5cclxuXHQvLyBNYXBcclxuXHRpc1ZhY2FudChtYXBJZCwgeCwgeSkge1xyXG5cdFx0Ly8gQ2hlY2sgZm9yIE1hcCBFZGdlc1xyXG5cdFx0aWYgKHggPCAwIHx8IHggPj0gY29uZmlnLk1BUF9DT0xVTU5TKSByZXR1cm4gZmFsc2U7XHJcblx0XHRpZiAoeSA8IDAgfHwgeSA+PSBjb25maWcuTUFQX1JPV1MpIHJldHVybiBmYWxzZTtcclxuXHRcdFxyXG5cdFx0bGV0IG1hcCA9IHRoaXMubWFwTGlzdFttYXBJZF07XHJcblx0XHRcclxuXHRcdC8vIENoZWNrIGZvciBXYWxsIFRpbGVzXHJcblx0XHRpZiAobWFwLnRpbGVzW3ldW3hdLndhbGwgPT09IHRydWUpIHJldHVybiBmYWxzZTtcclxuXHRcdFxyXG5cdFx0Ly8gQ2hlY2sgZm9yIEJvdHNcclxuXHRcdGxldCBib3RzID0gbWFwLmJvdHMuZmlsdGVyKChib3QpID0+IHtcclxuXHRcdFx0aWYgKGJvdC54ID09PSB4ICYmIGJvdC55ID09PSB5ICYmICFib3QuaXNEZWFkKSByZXR1cm4gdHJ1ZTtcclxuXHRcdH0pO1xyXG5cdFx0aWYgKGJvdHMubGVuZ3RoID4gMCkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHJcblx0XHQvLyBDaGVjayBmb3IgUGxheWVyc1xyXG5cdFx0bGV0IHBsYXllcnMgPSB0aGlzLnBsYXllckxpc3QuZmlsdGVyKChwbGF5ZXIpID0+IHtcclxuXHRcdFx0aWYgKHBsYXllci5tYXBJZCA9PT0gbWFwLmlkICYmIHBsYXllci54ID09PSB4ICYmIHBsYXllci55ID09PSB5ICYmICFwbGF5ZXIuaXNEZWFkKSByZXR1cm4gdHJ1ZTtcclxuXHRcdH0pO1xyXG5cdFx0aWYgKHBsYXllcnMubGVuZ3RoID4gMCkgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHJcblx0c3Bhd25Cb3QobWFwSWQsIHgsIHksIGJvdENsYXNzKSB7XHJcblx0XHRuZXcgQm90KG1hcElkLCB4LCB5LCBib3RDbGFzcyk7XHJcblx0fVxyXG5cdFxyXG5cdHNwYXduTWFwSXRlbShtYXBJZCwgeCwgeSwgaXRlbUNsYXNzLCBzdGFjayA9IDApIHtcclxuXHRcdG5ldyBJdGVtKHtcclxuXHRcdFx0b3duZXI6ICdtYXAnLFxyXG5cdFx0XHRtYXBJZCxcclxuXHRcdFx0aWQ6IHV0aWwuZmlyc3RFbXB0eUluZGV4KHRoaXMubWFwTGlzdFttYXBJZF0uaXRlbXMpLFxyXG5cdFx0XHR4LFxyXG5cdFx0XHR5LFxyXG5cdFx0XHRpdGVtQ2xhc3MsXHJcblx0XHRcdHN0YWNrXHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHNwYXduRGFtYWdlVGV4dChtYXBJZCwgeCwgeSwgZGFtYWdlKSB7XHJcblx0XHRuZXcgVGV4dChtYXBJZCwgeCwgeSAtIDAuNSwgZGFtYWdlLCAnI2ZmMDAwMCcsIDEuMjUsIDAsIC0xKTtcclxuXHR9XHJcbn1cclxuXHJcbmNvbnN0IGdhbWUgPSBuZXcgR2FtZSgpO1xyXG5leHBvcnQgZGVmYXVsdCBnYW1lO1xyXG4iLCIvKioqIEdhbWUgTG9vcCAqKiovXHJcbi8qIEtlZXBzIHRyYWNrIG9mIHRpbWUgYW5kIGNvLW9yZGluYXRlcyB0aGUgZ2FtZSBhbmQgc2VydmVyICovXHJcblxyXG5pbXBvcnQgTm9kZUdhbWVMb29wIGZyb20gJ25vZGUtZ2FtZWxvb3AnO1xyXG5cclxuaW1wb3J0IGRiIGZyb20gJy4vZGIuanMnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuL2dhbWUuanMnO1xyXG5pbXBvcnQgc2VydmVyIGZyb20gJy4vc2VydmVyLmpzJztcclxuaW1wb3J0IGNvbmZpZyBmcm9tICcuL2NvbmZpZy5qcyc7XHJcblxyXG5jbGFzcyBHYW1lTG9vcCB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLmlkID0gbnVsbDtcclxuICAgIHRoaXMudGltZXIgPSB7XHJcbiAgICAgIGJhY2t1cDogMFxyXG4gICAgfTtcclxuICAgIHRoaXMuc3RhcnQoKTtcclxuICB9XHJcbiAgc3RhcnQoKSB7XHJcbiAgICB0aGlzLmlkID0gTm9kZUdhbWVMb29wLnNldEdhbWVMb29wKChkZWx0YSkgPT4ge1xyXG4gICAgICAvLyBVcGRhdGUgdGhlIGdhbWUgc3RhdGVcclxuICAgICAgbGV0IHVwZGF0ZVBhY2sgPSBnYW1lLnVwZGF0ZShkZWx0YSk7XHJcbiAgICAgIFxyXG4gICAgICAvLyBTZW5kIHVwZGF0ZWQgc3RhdGUgdG8gY2xpZW50c1xyXG4gICAgICBzZXJ2ZXIuc2VuZFVwZGF0ZVBhY2sodXBkYXRlUGFjayk7XHJcbiAgICAgIFxyXG4gICAgICAvLyBQZXJpb2RpYyBiYWNrdXAgdG8gZGF0YWJhc2VcclxuICAgICAgdGhpcy50aW1lci5iYWNrdXAgKz0gZGVsdGE7XHJcbiAgICAgIGlmICh0aGlzLnRpbWVyLmJhY2t1cCA+PSBjb25maWcuQkFDS1VQX1RJTUUpIHtcclxuICAgICAgICB0aGlzLnRpbWVyLmJhY2t1cCAtPSBjb25maWcuQkFDS1VQX1RJTUU7XHJcbiAgICAgICAgLy8gU0FWRSBTVEFURVxyXG4gICAgICB9XHJcbiAgICB9LCBjb25maWcuRlJBTUVSQVRFKTtcclxuICB9XHJcbn1cclxuXHJcbmNvbnN0IGdhbWVMb29wID0gbmV3IEdhbWVMb29wKCk7XHJcbmV4cG9ydCBkZWZhdWx0IGdhbWVMb29wOyIsImltcG9ydCBkYiBmcm9tICcuL2RiLmpzJztcclxuaW1wb3J0IGdhbWUgZnJvbSAnLi9nYW1lLmpzJztcclxuaW1wb3J0IHNlcnZlciBmcm9tICcuL3NlcnZlci5qcyc7XHJcbmltcG9ydCBnYW1lbG9vcCBmcm9tICcuL2dhbWVsb29wLmpzJztcclxuIiwiaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XHJcbmltcG9ydCBodHRwIGZyb20gJ2h0dHAnO1xyXG5pbXBvcnQgc29ja2V0SU8gZnJvbSAnc29ja2V0LmlvJztcclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcblxyXG5pbXBvcnQgZGIgZnJvbSAnLi9kYi5qcyc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4vZ2FtZS5qcyc7XHJcbmltcG9ydCBjb25maWcgZnJvbSAnLi9jb25maWcuanMnO1xyXG5pbXBvcnQgdXRpbCBmcm9tICcuL3V0aWwuanMnO1xyXG5cclxuY2xhc3MgU2VydmVyIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdGNvbnN0IGFwcCA9IGV4cHJlc3MoKTtcclxuXHRcdGNvbnN0IHNlcnZlciA9IGh0dHAuU2VydmVyKGFwcCk7XHJcblx0XHRjb25zdCBpbyA9IHNvY2tldElPKHNlcnZlcik7XHJcblx0XHRjb25zdCBwb3J0ID0gcHJvY2Vzcy5lbnYuUE9SVCB8fCBjb25maWcuUE9SVDtcclxuXHRcdGNvbnN0IHB1YmxpY1BhdGggPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4vY2xpZW50Jyk7XHJcblx0XHRcclxuXHRcdGFwcC5nZXQoJy8nLCAocmVxLCByZXMpID0+IHJlcy5zZW5kRmlsZShwdWJsaWNQYXRoICsgJy9pbmRleC5odG1sJykpO1xyXG5cdFx0YXBwLnVzZSgnL2NsaWVudCcsIGV4cHJlc3Muc3RhdGljKHB1YmxpY1BhdGgpKTtcclxuXHRcdHNlcnZlci5saXN0ZW4ocG9ydCwgKCkgPT4gZGIubG9nKGBTZXJ2ZXIgc3RhcnRlZC4gTGlzdGVuaW5nIG9uICR7c2VydmVyLmFkZHJlc3MoKS5wb3J0fWApKTtcclxuXHJcblx0XHR0aGlzLnNvY2tldExpc3QgPSBbXTtcclxuXHRcdGlvLnNvY2tldHMub24oJ2Nvbm5lY3Rpb24nLCAoc29ja2V0KSA9PiB0aGlzLm9uQ29ubmVjdChzb2NrZXQpKTtcclxuXHR9XHJcblxyXG5cdC8vIFJlY2VpdmUgZGF0YSBmcm9tIGNsaWVudHNcclxuXHRvbkNvbm5lY3Qoc29ja2V0KSB7XHJcblx0XHRzb2NrZXQuaWQgPSB1dGlsLmZpcnN0RW1wdHlJbmRleCh0aGlzLnNvY2tldExpc3QpO1xyXG5cdFx0dGhpcy5zb2NrZXRMaXN0W3NvY2tldC5pZF0gPSBzb2NrZXQ7XHJcblx0XHRkYi5sb2coYE5ldyBDb25uZWN0aW9uOiBJZCAke3NvY2tldC5pZH1gKTtcclxuXHRcdFxyXG5cdFx0c29ja2V0Lm9uKCdkaXNjb25uZWN0JywgKCkgPT4gdGhpcy5vbkRpc2Nvbm5lY3Qoc29ja2V0LmlkKSk7XHJcblx0XHRzb2NrZXQub24oJ2xvZ2luJywgKCkgPT4gdGhpcy5vbkxvZ2luKHNvY2tldC5pZCkpO1xyXG5cdFx0c29ja2V0Lm9uKCdsb2dvdXQnLCAoKSA9PiB0aGlzLm9uTG9nb3V0KHNvY2tldC5pZCkpO1xyXG5cdH1cclxuXHJcblx0b25EaXNjb25uZWN0KGlkKSB7XHJcblx0XHRpZiAoZ2FtZS5wbGF5ZXJMaXN0W2lkXSkge1xyXG5cdFx0XHRnYW1lLnBsYXllckxvZ291dChpZCk7XHJcblx0XHR9XHJcblx0XHRkZWxldGUgdGhpcy5zb2NrZXRMaXN0W2lkXTtcclxuXHRcdGRiLmxvZyhgRGlzY29ubmVjdGVkOiBJZCAke2lkfWApO1xyXG5cdH1cclxuXHJcblx0b25Mb2dpbihpZCkge1x0XHRcclxuXHRcdC8vIENyZWF0ZSBQbGF5ZXJcclxuXHRcdGxldCBwbGF5ZXIgPSBnYW1lLnBsYXllckxvZ2luKGlkKTtcclxuXHRcdFxyXG5cdFx0Ly8gUmVjZWl2ZSBJbnB1dHNcclxuXHRcdGxldCBzb2NrZXQgPSB0aGlzLnNvY2tldExpc3RbaWRdO1xyXG5cdFx0c29ja2V0Lm9uKCdpbnB1dCcsIChkYXRhKSA9PiBwbGF5ZXIub25JbnB1dChkYXRhKSk7XHJcblx0fVxyXG5cdFxyXG5cdG9uTG9nb3V0KGlkKSB7XHJcblx0XHRnYW1lLnBsYXllckxvZ291dChpZCk7XHJcblx0fVxyXG5cdFxyXG5cdC8vIFNlbmQgZGF0YSB0byBjbGllbnRzXHJcblx0c2VuZFVwZGF0ZVBhY2sodXBkYXRlUGFjaykge1xyXG5cdFx0Z2FtZS5wbGF5ZXJMaXN0LmZvckVhY2goKHBsYXllcikgPT4ge1xyXG5cdFx0XHRsZXQgcGFjayA9IHt9O1xyXG5cdFx0XHRcclxuXHRcdFx0cGFjay5wcml2YXRlID0gcGxheWVyLmdldFByaXZhdGVQYWNrKCk7XHJcblx0XHRcdFxyXG5cdFx0XHRwYWNrLnBsYXllcnMgPSB1cGRhdGVQYWNrLnBsYXllcnMuZmlsdGVyKChwbGF5ZXJEYXRhKSA9PiB7XHJcblx0XHRcdFx0cmV0dXJuIChwbGF5ZXJEYXRhLm1hcElkID09PSBwbGF5ZXIubWFwSWQpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHBhY2subWFwID0gdXBkYXRlUGFjay5tYXBzW3BsYXllci5tYXBJZF07XHJcblxyXG5cdFx0XHRwYWNrLm1lc3NhZ2VzID0gdXBkYXRlUGFjay5tZXNzYWdlcy5maWx0ZXIoKG1lc3NhZ2UpID0+IHtcclxuXHRcdFx0XHRyZXR1cm4gKChtZXNzYWdlLm1hcElkID09PSBudWxsICYmIG1lc3NhZ2UuaWQgPT09IG51bGwpIHx8IHBsYXllci5tYXBJZCA9PT0gbWVzc2FnZS5tYXBJZCB8fCBwbGF5ZXIuaWQgPT09IG1lc3NhZ2UuaWQpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0XHJcblx0XHRcdGxldCBzb2NrZXQgPSB0aGlzLnNvY2tldExpc3RbcGxheWVyLmlkXTtcclxuXHRcdFx0c29ja2V0LmVtaXQoJ3VwZGF0ZScsIHBhY2spO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdFxyXG5cdHNlbmRNYXBEYXRhKG1hcElkKSB7XHJcblx0XHRnYW1lLnBsYXllckxpc3QuZm9yRWFjaCgocGxheWVyKSA9PiB7XHJcblx0XHRcdGlmIChwbGF5ZXIubWFwSWQgPT09IG1hcElkKSB7XHJcblx0XHRcdFx0bGV0IHNvY2tldCA9IHRoaXMuc29ja2V0TGlzdFtwbGF5ZXIuaWRdO1xyXG5cdFx0XHRcdHNvY2tldC5lbWl0KCdsb2FkTWFwJywgZGIubWFwW21hcElkXSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcbn1cclxuXHJcbmNvbnN0IHNlcnZlciA9IG5ldyBTZXJ2ZXIoKTtcclxuZXhwb3J0IGRlZmF1bHQgc2VydmVyO1xyXG4iLCJmdW5jdGlvbiBzaHVmZmxlKGFycmF5KSB7XHJcbiAgbGV0IGN1cnJlbnRJbmRleCA9IGFycmF5Lmxlbmd0aDtcclxuICBsZXQgdGVtcDtcclxuICBsZXQgcmFuZG9tSW5kZXg7XHJcbiAgd2hpbGUgKGN1cnJlbnRJbmRleCAhPT0gMCkge1xyXG4gICAgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyZW50SW5kZXgpO1xyXG4gICAgY3VycmVudEluZGV4IC09IDE7XHJcbiAgICB0ZW1wID0gYXJyYXlbY3VycmVudEluZGV4XTtcclxuICAgIGFycmF5W2N1cnJlbnRJbmRleF0gPSBhcnJheVtyYW5kb21JbmRleF07XHJcbiAgICBhcnJheVtyYW5kb21JbmRleF0gPSB0ZW1wO1xyXG4gIH1cclxuICByZXR1cm4gYXJyYXk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN3YXAoYXJyYXksIGksIGopIHtcclxuICBsZXQgdGVtcCA9IGFycmF5W2ldO1xyXG4gIGFycmF5W2ldID0gYXJyYXlbal07XHJcbiAgYXJyYXlbal0gPSB0ZW1wO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmaXJzdEVtcHR5SW5kZXgoYXJyYXkpIHtcclxuICBpZiAoYXJyYXkubGVuZ3RoIDwgMSkgcmV0dXJuIDA7XHJcbiAgXHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPD0gYXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgIGlmIChhcnJheVtpXSA9PSBudWxsKSByZXR1cm4gaTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxlcnAoc3RhcnQsIGVuZCwgdGltZSkge1xyXG4gIC8vcmV0dXJuIHN0YXJ0ICsgKHRpbWUgKiAoZW5kIC0gc3RhcnQpKTtcclxuICByZXR1cm4gKCgxIC0gdGltZSkgKiBzdGFydCkgKyAodGltZSAqIGVuZCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNsYW1wKHZhbHVlLCBtaW5pbXVtLCBtYXhpbXVtKSB7XHJcbiAgaWYgKHZhbHVlIDwgbWluaW11bSkge1xyXG4gICAgcmV0dXJuIG1pbmltdW07XHJcbiAgfVxyXG4gIGVsc2UgaWYgKHZhbHVlID4gbWF4aW11bSkge1xyXG4gICAgcmV0dXJuIG1heGltdW07XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gcmFuZG9tSW50KG1pbmltdW0sIG1heGltdW0pIHtcclxuICBtYXhpbXVtKys7XHJcbiAgcmV0dXJuIE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiBtYXhpbXVtKSArIG1pbmltdW0pO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgc2h1ZmZsZSxcclxuICBzd2FwLFxyXG4gIGZpcnN0RW1wdHlJbmRleCxcclxuICBsZXJwLFxyXG4gIGNsYW1wLFxyXG4gIHJhbmRvbUludFxyXG59OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV4cHJlc3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZnNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaHR0cFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJtb25nb2pzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm5vZGUtZ2FtZWxvb3BcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJzb2NrZXQuaW9cIik7Il0sInNvdXJjZVJvb3QiOiIifQ==
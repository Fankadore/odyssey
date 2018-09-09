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
		// game.sendGameInfoGlobal("TESTING");
		// game.spawnBot(this.mapId, this.x, this.y, 1);
		_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].spawnMapItem(this.mapId, this.x, this.y, 0);
		_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].spawnMapItem(this.mapId, this.x, this.y, 1);
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
		}
		_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].spawnDamageText(this.mapId, this.x, this.y, damage);
	}
	
	respawn() {
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
				if (!item) return false;
				if (item.slot < _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE) return true;
				return false;
			});

			items.forEach((item) => {
				if (!item) return;
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
				_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendGameInfoGlobal(killerName + " has murdered " + this.name + " in cold blood!");
			}
			else {
				_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendGameInfoGlobal(this.name + " has been killed by " + killerName + "!");
			}
		}
		else {
			_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendGameInfoGlobal(this.name + " has died!");
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

		// Target slot is for equipment - check type matches
		if (newSlot >= _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE) {
			if (!item.canEquip(newSlot)) {
				_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendGameInfoPlayer(this.id, "That cannot be equipped there.");
				return;
			}
		}

		const swapSlots = () => {
			item.slot = newSlot;
			if (newItem) newItem.slot = slot;
			_util_js__WEBPACK_IMPORTED_MODULE_3__["default"].swap(this.inventory, slot, newSlot);
			this.calcBonusStats();
		};

		// IF No new item in new slot
		// OR New item in new slot, old item in inventory
		// OR New item in new slot, old item is equipped, new item can be equipped in old slot
		if (!newItem || slot < _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE || newItem.canEquip(slot)) {
			swapSlots();
		}
		else {
			// Old item is equipped, new item cannot be equipped in old slot
			newSlot = this.findFirstEmptySlot();
			if (newSlot != null) {
				swapSlots();
			}
			else {
				_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendGameInfoPlayer(this.id, "Your inventory is full.");
			}
		}
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
			_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendGameInfoPlayer(this.id, "Your inventory is full.");
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
			if (!item) return;
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
			if (!item) return;
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
		if (data.id == null) data.id = _util_js__WEBPACK_IMPORTED_MODULE_3__["default"].firstEmptyIndex(_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[this.mapId].bots);
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
		for (let i = 0; i < _game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[this.mapId].items.length; i++) {
			let item = _game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[this.mapId].items[i];
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
		if (data.z === undefined) data.z = -10;
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
		this.z = data.z;
		
		this.name = data.name;
		this.type = data.type;
		this.reusable = data.reusable;
		this.damageBonus = data.damageBonus;
		this.defenceBonus = data.defenceBonus;
		this.healthMaxBonus = data.healthMaxBonus;
		this.energyMaxBonus = data.energyMaxBonus;
		this.rangeBonus = data.rangeBonus;

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
			z: this.z,
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
			bots: [],
			items: [],
			effects: [],
			texts: []
		};

		this.bots.forEach((bot) => {
			mapPack.bots[bot.id] = bot.getPack();
		});
		this.items.forEach((item) => {
			mapPack.items[item.id] = item.getPack();
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
	constructor(senderId, message, type, mapId, id, colour) {
		this.senderId = senderId; // null = server
		this.message = message;
		this.type = type;
		this.mapId = mapId;
		this.id = id;
		this.colour = colour;
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
				if (!this.isDead) this.attack(1, this.direction);
			break;
			case 'doubleClickItem':
				if (this.inventory[data.slot]) {
					if (!this.isDead) this.useItem(data.slot);
				}
			break;
			case 'rightClickItem':
				if (this.inventory[data.slot]) {
					if (!this.isDead) this.dropItem(data.slot);
				}
			break;
			case 'dragStopGame':
				if (this.inventory[data.slot]) {
					if (!this.isDead) this.dropItem(data.slot);
				}
			break;
			case 'dragStopInventory':
			case 'dragStopEquipment':
				if (this.inventory[data.slot]) {
					if (!this.isDead) this.moveItemToSlot(data.slot, data.newSlot);
				}
			break;
			case 'serverChat': _game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendMessageGlobal(this.id, `${this.name} yells, "${data.message}"`);
			break;
			case 'mapChat': _game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendMessageMap(this.id, this.mapId, `${this.name} says, "${data.message}"`);
			break;
			case 'playerChat':
				let target = this.playerList[data.targetId];
				if (target) {
					_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendMessagePlayer(this.id, target.id, `${this.name} whispers, "${data.message}"`);
					_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendMessagePlayer(this.id, this.id, `You whisper to ${target.name}, "${data.message}"`);
				}
			break;

			// God Inputs
			case 'spawnItem':
				if (this.checkAdmin(2)) {
					_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].spawnMapItem(data.mapId, data.x, data.y, data.type, data.stack);
				}
				else {
					_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendGameInfoPlayer(this.id, `You don't have access to that command.`);
				}
			break;
			case 'uploadMap':
				if (this.checkAdmin(2)) {
					_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[data.mapId].upload();
				}
				else {
					_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendGameInfoPlayer(this.id, `You don't have access to that command.`);
				}
			break;
		}
	}

	pickUp() {
		for (let i = 0; i < _game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[this.mapId].items.length; i++) {
			let item = _game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[this.mapId].items[i];
			if (item && item.x === this.x && item.y === this.y) {
				let slot = this.getMapItem(item.mapId, item.id);
				if (slot != null) {
					item.moveToPlayer(this.id, slot);
				}
				else {
					// Inventory full
					_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendGameInfoPlayer(this.id, "Your inventory is full.");
					break;
				}
			}
		}
	}

	respawn() {
		super.respawn();
		_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendGameInfoPlayer(this.id, "The Angel of Mercy has saved your soul.");
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
        sprite: 2,
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
		this.messageQueue = [];

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
		this.sendGameInfoGlobal(`${player.name} has logged in.`);
		return player;
	}
	
	playerLogout(id) {
		let player = this.playerList[id];
		if (player) {
			_db_js__WEBPACK_IMPORTED_MODULE_1__["default"].savePlayerData(player.getPack);
			this.sendGameInfoGlobal(`${player.name} has logged out.`);
			delete this.playerList[id];
		}
	}

	// Game Info
	sendGameInfoGlobal(message) {
		this.messageQueue.push(new _classes_message_js__WEBPACK_IMPORTED_MODULE_9__["default"](null, message, 'gameInfo'));
	}
	sendGameInfoMap(mapId, message) {
		this.messageQueue.push(new _classes_message_js__WEBPACK_IMPORTED_MODULE_9__["default"](null, message, 'gameInfo', mapId));
	}
	sendGameInfoPlayer(id, message) {
		this.messageQueue.push(new _classes_message_js__WEBPACK_IMPORTED_MODULE_9__["default"](null, message, 'gameInfo', null, id));
	}
	
	// Chat Messages
	sendMessageGlobal(senderId, message) {
		this.messageQueue.push(new _classes_message_js__WEBPACK_IMPORTED_MODULE_9__["default"](senderId, message, 'messageGlobal'));
	}
	sendMessageMap(senderId, mapId, message) {
		this.messageQueue.push(new _classes_message_js__WEBPACK_IMPORTED_MODULE_9__["default"](senderId, message, 'messageMap', mapId));
	}
	sendMessagePlayer(senderId, id, message) {
		this.messageQueue.push(new _classes_message_js__WEBPACK_IMPORTED_MODULE_9__["default"](senderId, message, 'messagePlayer', null, id));
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
		new _classes_bot_js__WEBPACK_IMPORTED_MODULE_6__["default"]({
			mapId,
			x,
			y,
			botClass
		});
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
			
			pack.game = updatePack.maps[player.mapId];
			pack.game.players = updatePack.players.filter((playerData) => {
				return (playerData.mapId === player.mapId && (playerData.isVisible || playerData.id === player.id));
			});

			pack.ui = player.getPrivatePack();
			pack.ui.messages = updatePack.messages.filter((message) => {
				return ((message.mapId == null && message.id == null) || player.mapId === message.mapId || player.id === message.id);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL2FjdG9yLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy9ib3QuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL2VudGl0eS5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2NsYXNzZXMvaXRlbS5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2NsYXNzZXMvbWFwLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy9tZXNzYWdlLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL3RleHQuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL3RpbGUuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jb25maWcuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9kYi5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2dhbWUuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9nYW1lbG9vcC5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9zZXJ2ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy91dGlsLmpzIiwid2VicGFjazovLy9leHRlcm5hbCBcImV4cHJlc3NcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJmc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImh0dHBcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJtb25nb2pzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibm9kZS1nYW1lbG9vcFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInBhdGhcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJzb2NrZXQuaW9cIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLDZJQUFxRDtBQUN0RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxtQkFBbUI7QUFDbkI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsK0RBQStEOztBQUUvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtRUFBbUU7O0FBRW5FO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLHNCQUFzQjtBQUN0QixHQUFHOztBQUVIOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7O0FBRUo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJOztBQUVKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSx5REFBeUQ7O0FBRXpELDJCQUEyQjtBQUMzQixrRkFBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW9CLDhJQUFzRDtBQUMxRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx5QkFBeUIsbUpBQTJEO0FBQ3BGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGtFQUFrRTtBQUNsRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUZBQXFDLHVFQUEyQjtBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esb0JBQW9CLDBFQUE4QjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2p0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxzQkFBc0I7QUFDdEI7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLHVGQUEyQztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0JBQW9CLDBFQUE4QjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUNyUUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcktBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQixvRUFBd0I7QUFDekM7QUFDQSxrQkFBa0IsaUVBQXFCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixpRUFBcUI7QUFDdEMsa0JBQWtCLG9FQUF3QjtBQUMxQyxtQkFBbUIsbUVBQXVCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsaUJBQWlCLGlFQUFxQjtBQUN0QztBQUNBLGtCQUFrQixvRUFBd0I7QUFDMUM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlCQUFpQixtRUFBdUI7QUFDeEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQzs7Ozs7Ozs7Ozs7Ozs7QUNsSUE7QUFDQTtBQUNBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ1RBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsb0NBQW9DO0FBQ3BDLHNDQUFzQztBQUN0QywwQ0FBMEM7QUFDMUMsMENBQTBDO0FBQzFDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBLHNCQUFzQjs7QUFFdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxR0FBeUQsVUFBVSxXQUFXLGFBQWE7QUFDM0Y7QUFDQSwyR0FBK0QsVUFBVSxVQUFVLGFBQWE7QUFDaEc7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrRkFBbUQsVUFBVSxjQUFjLGFBQWE7QUFDeEYsNEdBQWdFLFlBQVksS0FBSyxhQUFhO0FBQzlGO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsdUZBQTJDO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDOzs7Ozs7Ozs7Ozs7Ozs7O0FDck1BO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUN4Q0E7QUFBQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7OztBQ2pDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxPQUFPO0FBQ1AsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0EsZUFBZTtBQUNmLE9BQU87QUFDUCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0EsZUFBZTtBQUNmLE9BQU87QUFDUCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0EsZUFBZTtBQUNmLE9BQU87QUFDUCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0EsZUFBZTtBQUNmLE9BQU87QUFDUCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0EsZUFBZTtBQUNmLE9BQU87QUFDUCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0EsZUFBZTtBQUNmLE9BQU87QUFDUCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0EsZUFBZTtBQUNmLE9BQU87QUFDUCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0EsZUFBZTtBQUNmLE9BQU87QUFDUCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0EsZUFBZTtBQUNmLE9BQU87QUFDUCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0EsZUFBZTtBQUNmLE9BQU87QUFDUDs7QUFFQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsNEJBQTRCLG1CQUFtQjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0RBQW9ELFNBQVM7QUFDN0Q7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTs7QUFFQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM1V0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtCQUFrQixrRUFBc0I7QUFDeEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsWUFBWTtBQUN6QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLFlBQVk7QUFDMUM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDeElBO0FBQUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBLHlFOzs7Ozs7Ozs7Ozs7Ozs7OztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsK0dBQW1FLHNCQUFzQjs7QUFFekY7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkVBQStCLFVBQVU7O0FBRXpDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5RUFBNkIsR0FBRztBQUNoQzs7QUFFQSxjO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSTs7QUFFSjtBQUNBO0FBQ0E7QUFDQSxJQUFJOztBQUVKO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUMxRkE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsaUJBQWlCLG1CQUFtQjtBQUNwQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEc7Ozs7Ozs7Ozs7O0FDekRBLG9DOzs7Ozs7Ozs7OztBQ0FBLCtCOzs7Ozs7Ozs7OztBQ0FBLGlDOzs7Ozs7Ozs7OztBQ0FBLG9DOzs7Ozs7Ozs7OztBQ0FBLDBDOzs7Ozs7Ozs7OztBQ0FBLGlDOzs7Ozs7Ozs7OztBQ0FBLHNDIiwiZmlsZSI6InNlcnZlci5hcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NlcnZlci9zcmMvbWFpbi5qc1wiKTtcbiIsImltcG9ydCBkYiBmcm9tICcuLi9kYi5qcyc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4uL2dhbWUuanMnO1xyXG5pbXBvcnQgY29uZmlnIGZyb20gJy4uL2NvbmZpZy5qcyc7XHJcbmltcG9ydCB1dGlsIGZyb20gJy4uL3V0aWwuanMnO1xyXG5pbXBvcnQgRW50aXR5IGZyb20gJy4vZW50aXR5LmpzJztcclxuXHJcbi8vIEFuIEFjdG9yIGlzIGFuIEVudGl0eSB3aGljaCBjYW4gbW92ZSwgYXR0YWNrIGFuZCBpbnRlcmFjdCB3aXRoIGl0ZW1zXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBY3RvciBleHRlbmRzIEVudGl0eSB7XHJcblx0Y29uc3RydWN0b3IobWFwSWQsIHgsIHksIG5hbWUsIHNwcml0ZSkge1xyXG5cdFx0c3ByaXRlID0gdXRpbC5jbGFtcChzcHJpdGUsIDEsIGNvbmZpZy5NQVhfU1BSSVRFUyk7XHJcblxyXG5cdFx0c3VwZXIobWFwSWQsIHgsIHksIHNwcml0ZSk7XHJcblx0XHR0aGlzLmNvbnRyb2xsZXIgPSAnYm90JztcclxuXHRcdHRoaXMubmFtZSA9IG5hbWU7XHJcblxyXG5cdFx0dGhpcy5pbnZlbnRvcnkgPSBbXTtcclxuXHJcblx0XHR0aGlzLmNhbGNTdGF0cygpO1xyXG5cdFx0dGhpcy5yZXN0b3JlKCk7XHJcblxyXG5cdFx0dGhpcy5kaXJlY3Rpb24gPSAnZG93bic7XHJcblx0XHR0aGlzLnN0YXJ0WCA9IHRoaXMueDtcclxuXHRcdHRoaXMuc3RhcnRZID0gdGhpcy55O1xyXG5cdFx0dGhpcy5kZXN0aW5hdGlvblggPSB0aGlzLng7XHJcblx0XHR0aGlzLmRlc3RpbmF0aW9uWSA9IHRoaXMueTtcclxuXHRcdHRoaXMubGVycCA9IDA7XHJcblxyXG5cdFx0dGhpcy5pc01vdmluZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy5pc1J1bm5pbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMubW92ZVNwZWVkID0gMi41O1xyXG5cdFx0dGhpcy5tb3ZlbWVudFRpbWVyID0gMDtcclxuXHRcdHRoaXMubGF6aW5lc3MgPSAwO1xyXG5cclxuXHRcdHRoaXMuaXNBdHRhY2tpbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMuYXR0YWNrU3BlZWQgPSAxO1xyXG5cdFx0dGhpcy5hdHRhY2tUaW1lciA9IDA7XHRcclxuXHRcdHRoaXMudGFyZ2V0ID0gbnVsbDtcclxuXHRcdHRoaXMua2lsbHMgPSAwO1xyXG5cdFx0dGhpcy5kZWF0aHMgPSAwO1xyXG5cclxuXHRcdHRoaXMuaXNEZWFkID0gZmFsc2U7XHJcblx0XHR0aGlzLnJlc3Bhd25UaW1lciA9IDA7XHJcblx0XHR0aGlzLnJlc3Bhd25TcGVlZCA9IDEwO1xyXG5cdFx0dGhpcy5yZXNwYXduTWFwID0gbWFwSWQ7XHJcblx0XHR0aGlzLnJlc3Bhd25YID0geDtcclxuXHRcdHRoaXMucmVzcGF3blkgPSB5O1xyXG5cdH1cclxuXHRcclxuXHQvLyBDaGFyYWN0ZXIgU3RhdHNcclxuXHRnZXQgZGFtYWdlKCkge1xyXG5cdFx0aWYgKHRoaXMuZGFtYWdlQmFzZSArIHRoaXMuZGFtYWdlQm9udXMgPCAwKSB7XHJcblx0XHRcdHJldHVybiAwO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmRhbWFnZUJhc2UgKyB0aGlzLmRhbWFnZUJvbnVzO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRnZXQgZGVmZW5jZSgpIHtcclxuXHRcdGlmICh0aGlzLmRlZmVuY2VCYXNlICsgdGhpcy5kZWZlbmNlQm9udXMgPCAwKSB7XHJcblx0XHRcdHJldHVybiAwO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmRlZmVuY2VCYXNlICsgdGhpcy5kZWZlbmNlQm9udXM7XHJcblx0XHR9XHJcblx0fVxyXG5cdGdldCBoZWFsdGhNYXgoKSB7XHJcblx0XHRpZiAodGhpcy5oZWFsdGhNYXhCYXNlICsgdGhpcy5oZWFsdGhNYXhCb251cyA8IDEpIHtcclxuXHRcdFx0cmV0dXJuIDE7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuaGVhbHRoTWF4QmFzZSArIHRoaXMuaGVhbHRoTWF4Qm9udXM7XHJcblx0XHR9XHJcblx0fVxyXG5cdGdldCBlbmVyZ3lNYXgoKSB7XHJcblx0XHRpZiAodGhpcy5lbmVyZ3lNYXhCYXNlICsgdGhpcy5lbmVyZ3lNYXhCb251cyA8IDApIHtcclxuXHRcdFx0cmV0dXJuIDA7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuZW5lcmd5TWF4QmFzZSArIHRoaXMuZW5lcmd5TWF4Qm9udXM7XHJcblx0XHR9XHJcblx0fVxyXG5cdGdldCByYW5nZSgpIHtcclxuXHRcdGlmICh0aGlzLnJhbmdlQmFzZSArIHRoaXMucmFuZ2VCb251cyA8IDEpIHtcclxuXHRcdFx0cmV0dXJuIDE7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMucmFuZ2VCYXNlICsgdGhpcy5yYW5nZUJvbnVzO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Y2FsY0Jhc2VTdGF0cygpIHtcdC8vIENsYXNzIGFuZCBMZXZlbFxyXG5cdFx0Ly9UT0RPOiBjaGVjayBkYiBmb3IgY2xhc3Mgc3RhdHM6IGJhc2UgYW5kIGluY3JlYXNlIHBlciBsZXZlbFxyXG5cdFx0Ly8gdGhpcy5kYW1hZ2VCYXNlID0gcGxheWVyQ2xhc3MuZGFtYWdlQmFzZSArIChwbGF5ZXJDbGFzcy5pbmNyZWFzZVBlckxldmVsLmRhbWFnZSAqIHRoaXMubGV2ZWwpO1xyXG5cdFx0dGhpcy5kYW1hZ2VCYXNlID0gNTtcclxuXHRcdHRoaXMuZGVmZW5jZUJhc2UgPSAwO1xyXG5cdFx0dGhpcy5oZWFsdGhNYXhCYXNlID0gMTA7XHJcblx0XHR0aGlzLmVuZXJneU1heEJhc2UgPSA0MDtcclxuXHRcdHRoaXMucmFuZ2VCYXNlID0gMTtcclxuXHR9XHJcblxyXG5cdGNhbGNJdGVtQm9udXMoKSB7XHJcblx0XHRsZXQgaXRlbUJvbnVzID0ge1xyXG5cdFx0XHRkYW1hZ2U6IDAsXHJcblx0XHRcdGRlZmVuY2U6IDAsXHJcblx0XHRcdGhlYWx0aE1heDogMCxcclxuXHRcdFx0ZW5lcmd5TWF4OiAwLFxyXG5cdFx0XHRyYW5nZTogMFxyXG5cdFx0fTtcclxuXHJcblx0XHQvLyBGb3IgZWFjaCBpdGVtIGluIGludmVudG9yeSBjaGVjayBmb3IgYm9udXNlc1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCAoY29uZmlnLklOVkVOVE9SWV9TSVpFICsgY29uZmlnLkVRVUlQTUVOVF9TSVpFKTsgaSsrKSB7XHJcblx0XHRcdGxldCBpdGVtID0gdGhpcy5pbnZlbnRvcnlbaV07XHJcblx0XHRcdGlmIChpdGVtICYmICFpdGVtLnJlbW92ZSkge1xyXG5cdFx0XHRcdGl0ZW1Cb251cy5kYW1hZ2UgKz0gaXRlbS5wYXNzaXZlRGFtYWdlO1xyXG5cdFx0XHRcdGl0ZW1Cb251cy5kZWZlbmNlICs9IGl0ZW0ucGFzc2l2ZURlZmVuY2U7XHJcblx0XHRcdFx0aXRlbUJvbnVzLmhlYWx0aE1heCArPSBpdGVtLnBhc3NpdmVIZWFsdGhNYXg7XHJcblx0XHRcdFx0aXRlbUJvbnVzLmVuZXJneU1heCArPSBpdGVtLnBhc3NpdmVFbmVyZ3lNYXg7XHJcblx0XHRcdFx0aXRlbUJvbnVzLnJhbmdlICs9IGl0ZW0ucGFzc2l2ZVJhbmdlO1xyXG5cclxuXHRcdFx0XHRpZiAoaSA+PSBjb25maWcuSU5WRU5UT1JZX1NJWkUpIHtcclxuXHRcdFx0XHRcdGl0ZW1Cb251cy5kYW1hZ2UgKz0gaXRlbS5lcXVpcERhbWFnZTtcclxuXHRcdFx0XHRcdGl0ZW1Cb251cy5kZWZlbmNlICs9IGl0ZW0uZXF1aXBEZWZlbmNlO1xyXG5cdFx0XHRcdFx0aXRlbUJvbnVzLmhlYWx0aE1heCArPSBpdGVtLmVxdWlwSGVhbHRoTWF4O1xyXG5cdFx0XHRcdFx0aXRlbUJvbnVzLmVuZXJneU1heCArPSBpdGVtLmVxdWlwRW5lcmd5TWF4O1xyXG5cdFx0XHRcdFx0aXRlbUJvbnVzLnJhbmdlICs9IGl0ZW0uZXF1aXBSYW5nZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIGl0ZW1Cb251cztcclxuXHR9XHJcblxyXG5cdGNhbGNFZmZlY3RCb251cygpIHtcclxuXHRcdGxldCBlZmZlY3RCb251cyA9IHtcclxuXHRcdFx0ZGFtYWdlOiAwLFxyXG5cdFx0XHRkZWZlbmNlOiAwLFxyXG5cdFx0XHRoZWFsdGhNYXg6IDAsXHJcblx0XHRcdGVuZXJneU1heDogMCxcclxuXHRcdFx0cmFuZ2U6IDBcclxuXHRcdH07XHJcblxyXG5cdFx0Ly8gVE9ETzogd29yayBvdXQgaG93IHRvIGRvIGVmZmVjdHMgZm9yIHNwZWxscyBhbmQgcG90aW9uc1xyXG5cdFx0cmV0dXJuIGVmZmVjdEJvbnVzO1xyXG5cdH1cclxuXHRcclxuXHRjYWxjQm9udXNTdGF0cygpIHtcdC8vIEl0ZW1zIChlcXVpcHBlZCBhbmQgcGFzc2l2ZSkgYW5kIEVmZmVjdHMgKHNwZWxscyBhbmQgcG90aW9ucylcclxuXHRcdGxldCBpdGVtQm9udXMgPSB0aGlzLmNhbGNJdGVtQm9udXMoKTtcclxuXHRcdGxldCBlZmZlY3RCb251cyA9IHRoaXMuY2FsY0VmZmVjdEJvbnVzKCk7XHJcblxyXG5cdFx0dGhpcy5kYW1hZ2VCb251cyA9IGl0ZW1Cb251cy5kYW1hZ2UgKyBlZmZlY3RCb251cy5kYW1hZ2U7XHJcblx0XHR0aGlzLmRlZmVuY2VCb251cyA9IGl0ZW1Cb251cy5kZWZlbmNlICsgZWZmZWN0Qm9udXMuZGVmZW5jZTtcclxuXHRcdHRoaXMuaGVhbHRoTWF4Qm9udXMgPSBpdGVtQm9udXMuaGVhbHRoTWF4ICsgZWZmZWN0Qm9udXMuaGVhbHRoTWF4O1xyXG5cdFx0dGhpcy5lbmVyZ3lNYXhCb251cyA9IGl0ZW1Cb251cy5lbmVyZ3lNYXggKyBlZmZlY3RCb251cy5lbmVyZ3lNYXg7XHJcblx0XHR0aGlzLnJhbmdlQm9udXMgPSBpdGVtQm9udXMucmFuZ2UgKyBlZmZlY3RCb251cy5yYW5nZTtcclxuXHR9XHJcblxyXG5cdGNhbGNTdGF0cygpIHtcclxuXHRcdHRoaXMuY2FsY0Jhc2VTdGF0cygpO1xyXG5cdFx0dGhpcy5jYWxjQm9udXNTdGF0cygpO1xyXG5cdH1cclxuXHJcblx0cmVzdG9yZSgpIHtcclxuXHRcdHRoaXMuaGVhbHRoID0gdGhpcy5oZWFsdGhNYXg7XHJcblx0XHR0aGlzLmVuZXJneSA9IHRoaXMuZW5lcmd5TWF4O1xyXG5cdH1cclxuXHRcclxuXHQvLyBNb3ZlbWVudFxyXG5cdG1vdmUoZGlyZWN0aW9uKSB7XHJcblx0XHRpZiAodGhpcy5pc01vdmluZykgcmV0dXJuO1xyXG5cclxuXHRcdGlmIChkaXJlY3Rpb24pIHtcclxuXHRcdFx0dGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGRpcmVjdGlvbiA9PT0gJ2xlZnQnKSB7XHJcblx0XHRcdGlmICghZ2FtZS5pc1ZhY2FudCh0aGlzLm1hcElkLCB0aGlzLnggLSAxLCB0aGlzLnkpKSByZXR1cm47XHJcblx0XHRcdHRoaXMuZGVzdGluYXRpb25YLS07XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdyaWdodCcpIHtcclxuXHRcdFx0aWYgKCFnYW1lLmlzVmFjYW50KHRoaXMubWFwSWQsIHRoaXMueCArIDEsIHRoaXMueSkpIHJldHVybjtcclxuXHRcdFx0dGhpcy5kZXN0aW5hdGlvblgrKztcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ3VwJykge1xyXG5cdFx0XHRpZiAoIWdhbWUuaXNWYWNhbnQodGhpcy5tYXBJZCwgdGhpcy54LCB0aGlzLnkgLSAxKSkgcmV0dXJuO1xyXG5cdFx0XHR0aGlzLmRlc3RpbmF0aW9uWS0tO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoZGlyZWN0aW9uID09PSAnZG93bicpIHtcclxuXHRcdFx0aWYgKCFnYW1lLmlzVmFjYW50KHRoaXMubWFwSWQsIHRoaXMueCwgdGhpcy55ICsgMSkpIHJldHVybjtcclxuXHRcdFx0dGhpcy5kZXN0aW5hdGlvblkrKztcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRzd2l0Y2ggKHV0aWwucmFuZG9tSW50KDAsIDMgKyB0aGlzLmxhemluZXNzKSkge1xyXG5cdFx0XHRcdGNhc2UgMDogdGhpcy5tb3ZlKCdsZWZ0Jyk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAxOiB0aGlzLm1vdmUoJ3JpZ2h0Jyk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAyOiB0aGlzLm1vdmUoJ3VwJyk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAzOiB0aGlzLm1vdmUoJ2Rvd24nKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRkZWZhdWx0OiAvLyBEb24ndCBNb3ZlXHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFNldCBtb3ZlIHNwZWVkXHJcblx0XHRpZiAodGhpcy5pc1J1bm5pbmcpIHtcclxuXHRcdFx0aWYgKHRoaXMuZW5lcmd5ID4gMCkge1xyXG5cdFx0XHRcdHRoaXMuZW5lcmd5LS07XHJcblx0XHRcdFx0dGhpcy5tb3ZlU3BlZWQgPSA0O1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMuZW5lcmd5ID0gMDtcclxuXHRcdFx0XHR0aGlzLm1vdmVTcGVlZCA9IDIuNTtcclxuXHRcdFx0XHR0aGlzLmlzUnVubmluZyA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0dGhpcy5tb3ZlU3BlZWQgPSAyLjU7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHRoaXMuaXNNb3ZpbmcgPSB0cnVlO1xyXG5cdH1cclxuXHRcclxuXHRtb3ZlVG9UYXJnZXQodGFyZ2V0LCBob3N0aWxlKSB7XHJcblx0XHRpZiAoIXRhcmdldCkgcmV0dXJuO1xyXG5cdFx0XHJcblx0XHRpZiAodGFyZ2V0LnggPT09IHRoaXMueCAmJiB0YXJnZXQueSA9PT0gdGhpcy55KSB7XHJcblx0XHRcdHRoaXMubW92ZSgpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAodXRpbC5yYW5kb21JbnQoMCwgMSkgPT09IDApIHtcclxuXHRcdFx0aWYgKHRhcmdldC54IDwgdGhpcy54KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID49ICh0aGlzLnggLSB0aGlzLnJhbmdlKSAmJiB0YXJnZXQueSA9PT0gdGhpcy55KSB7XHJcblx0XHRcdFx0XHRpZiAoaG9zdGlsZSkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdsZWZ0JztcclxuXHRcdFx0XHRcdFx0aWYgKCF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ2xlZnQnKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSgnbGVmdCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICh0YXJnZXQueCA+IHRoaXMueCkge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICsgdGhpcy5yYW5nZSAmJiB0YXJnZXQueSA9PT0gdGhpcy55KSB7XHJcblx0XHRcdFx0XHRpZiAoaG9zdGlsZSkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdyaWdodCc7XHJcblx0XHRcdFx0XHRcdGlmICghdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCdyaWdodCcpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCdyaWdodCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICh0YXJnZXQueSA8IHRoaXMueSkge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICYmIHRhcmdldC55ID09PSB0aGlzLnkgLSB0aGlzLnJhbmdlKSB7XHJcblx0XHRcdFx0XHRpZiAoaG9zdGlsZSkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICd1cCc7XHJcblx0XHRcdFx0XHRcdGlmICghdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCd1cCcpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCd1cCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICh0YXJnZXQueSA+IHRoaXMueSkge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICYmIHRhcmdldC55ID09PSB0aGlzLnkgKyB0aGlzLnJhbmdlKSB7XHJcblx0XHRcdFx0XHRpZiAoaG9zdGlsZSkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdkb3duJztcclxuXHRcdFx0XHRcdFx0aWYgKCF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ2Rvd24nKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSgnZG93bicpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGlmICh0YXJnZXQueSA+IHRoaXMueSkge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICYmIHRhcmdldC55ID09PSB0aGlzLnkgKyB0aGlzLnJhbmdlKSB7XHJcblx0XHRcdFx0XHRpZiAoaG9zdGlsZSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmF0dGFjaygnZG93bicpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCdkb3duJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHRhcmdldC55IDwgdGhpcy55KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggJiYgdGFyZ2V0LnkgPT09IHRoaXMueSAtIHRoaXMucmFuZ2UpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlKSB7XHJcblx0XHRcdFx0XHRcdGlmICghdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCd1cCcpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCd1cCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICh0YXJnZXQueCA+IHRoaXMueCkge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICsgdGhpcy5yYW5nZSAmJiB0YXJnZXQueSA9PT0gdGhpcy55KSB7XHJcblx0XHRcdFx0XHRpZiAoaG9zdGlsZSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmF0dGFjaygncmlnaHQnKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSgncmlnaHQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodGFyZ2V0LnggPCB0aGlzLngpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LnggPj0gKHRoaXMueCAtIHRoaXMucmFuZ2UpICYmIHRhcmdldC55ID09PSB0aGlzLnkpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlKSB7XHJcblx0XHRcdFx0XHRcdGlmICghdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCdsZWZ0Jyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ2xlZnQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0Ly8gQ29tYmF0XHJcblx0Y2hlY2tJblJhbmdlKGRpcmVjdGlvbiwgdGFyZ2V0LCByYW5nZSkge1xyXG5cdFx0aWYgKHRhcmdldC5tYXBJZCAhPT0gdGhpcy5tYXBJZCkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggJiYgdGFyZ2V0LnkgPT09IHRoaXMueSkgcmV0dXJuIGZhbHNlO1x0Ly8gU3RhY2tlZCBkb2VzIG5vdCBjb3VudCBhcyBpbiByYW5nZVxyXG5cdFx0XHJcblx0XHRpZiAodGFyZ2V0LnkgPT09IHRoaXMueSkge1xyXG5cdFx0XHRpZiAoZGlyZWN0aW9uID09PSAnbGVmdCcpIHtcclxuXHRcdFx0XHRpZiAodGhpcy54ID09PSAwKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0cmV0dXJuICh0YXJnZXQueCA8IHRoaXMueCAmJiB0YXJnZXQueCA+PSAodGhpcy54IC0gcmFuZ2UpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAoZGlyZWN0aW9uID09PSAncmlnaHQnKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMueCA9PT0gY29uZmlnLk1BUF9DT0xVTU5TIC0gMSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHJldHVybiAodGFyZ2V0LnggPiB0aGlzLnggJiYgdGFyZ2V0LnggPD0gKHRoaXMueCArIHJhbmdlKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmICh0YXJnZXQueCA9PT0gdGhpcy54KSB7XHJcblx0XHRcdGlmIChkaXJlY3Rpb24gPT09ICd1cCcpIHtcclxuXHRcdFx0XHRpZiAodGhpcy55ID09PSAwKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0cmV0dXJuICh0YXJnZXQueSA8IHRoaXMueSAmJiB0YXJnZXQueSA+PSAodGhpcy55IC0gcmFuZ2UpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAoZGlyZWN0aW9uID09PSAnZG93bicpIHtcclxuXHRcdFx0XHRpZiAodGhpcy55ID09PSBjb25maWcuTUFQX1JPV1MgLSAxKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0cmV0dXJuICh0YXJnZXQueSA+IHRoaXMueSAmJiB0YXJnZXQueSA8PSAodGhpcy55ICsgcmFuZ2UpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0YXR0YWNrKG51bVRhcmdldHMgPSAxLCBkaXJlY3Rpb24gPSB0aGlzLmRpcmVjdGlvbikge1xyXG5cdFx0aWYgKHRoaXMuaXNBdHRhY2tpbmcgfHwgdGhpcy5hdHRhY2tUaW1lciA+IDApIHJldHVybjtcclxuXHJcblx0XHR0aGlzLmlzQXR0YWNraW5nID0gdHJ1ZTtcclxuXHRcdC8vIGdhbWUuc2VuZEdhbWVJbmZvR2xvYmFsKFwiVEVTVElOR1wiKTtcclxuXHRcdC8vIGdhbWUuc3Bhd25Cb3QodGhpcy5tYXBJZCwgdGhpcy54LCB0aGlzLnksIDEpO1xyXG5cdFx0Z2FtZS5zcGF3bk1hcEl0ZW0odGhpcy5tYXBJZCwgdGhpcy54LCB0aGlzLnksIDApO1xyXG5cdFx0Z2FtZS5zcGF3bk1hcEl0ZW0odGhpcy5tYXBJZCwgdGhpcy54LCB0aGlzLnksIDEpO1xyXG5cdFx0Ly8gZ2FtZS5zcGF3bkRhbWFnZVRleHQodGhpcy5tYXBJZCwgdGhpcy54LCB0aGlzLnksIHRoaXMuZGFtYWdlKTsgLy90ZXN0XHJcblx0XHRcclxuXHRcdGxldCBhY3Rvckxpc3QgPSBnYW1lLnBsYXllckxpc3QuY29uY2F0KGdhbWUubWFwTGlzdFt0aGlzLm1hcElkXS5ib3RzKTtcclxuXHRcdGxldCB0YXJnZXRMaXN0ID0gYWN0b3JMaXN0LmZpbHRlcigoYWN0b3IpID0+IHtcclxuXHRcdFx0aWYgKGFjdG9yID09PSB0aGlzIHx8IGFjdG9yLmlzRGVhZCkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRpZiAodGhpcy5jaGVja0luUmFuZ2UoZGlyZWN0aW9uLCBhY3RvciwgdGhpcy5yYW5nZSkpIHJldHVybiB0cnVlO1xyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcdHRhcmdldExpc3Quc29ydCgoYSwgYikgPT4ge1xyXG5cdFx0XHRyZXR1cm4gKGEueiAtIGIueik7XHQvLyBMb3dlc3QgdG8gaGlnaGVzdFxyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcdHRhcmdldExpc3QgPSB0YXJnZXRMaXN0LnNwbGljZSgtbnVtVGFyZ2V0cyk7XHJcblx0XHRcclxuXHRcdHRhcmdldExpc3QuZm9yRWFjaCgodGFyZ2V0KSA9PiB7XHJcblx0XHRcdHRhcmdldC50YWtlRGFtYWdlKHRoaXMuZGFtYWdlLCB0aGlzKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRcclxuXHR0YWtlRGFtYWdlKGRhbWFnZSwgc291cmNlKSB7XHJcblx0XHRkYW1hZ2UgLT0gdGhpcy5kZWZlbmNlO1xyXG5cdFx0aWYgKGRhbWFnZSA8IDApIHtcclxuXHRcdFx0ZGFtYWdlID0gMDtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHR0aGlzLmhlYWx0aCAtPSBkYW1hZ2U7XHJcblx0XHRcdGlmICh0aGlzLmhlYWx0aCA8PSAwKSB7XHJcblx0XHRcdFx0dGhpcy5zZXREZWFkKHNvdXJjZS5jb250cm9sbGVyLCBzb3VyY2UubmFtZSk7XHJcblx0XHRcdFx0c291cmNlLmtpbGxzKys7XHJcblx0XHRcdFx0aWYgKHNvdXJjZS50YXJnZXQgPT09IHRoaXMpIHNvdXJjZS50YXJnZXQgPSBudWxsO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRnYW1lLnNwYXduRGFtYWdlVGV4dCh0aGlzLm1hcElkLCB0aGlzLngsIHRoaXMueSwgZGFtYWdlKTtcclxuXHR9XHJcblx0XHJcblx0cmVzcGF3bigpIHtcclxuXHRcdHRoaXMubWFwSWQgPSB0aGlzLnJlc3Bhd25NYXA7XHJcblx0XHR0aGlzLnggPSB0aGlzLnJlc3Bhd25YO1xyXG5cdFx0dGhpcy55ID0gdGhpcy5yZXNwYXduWTtcclxuXHRcdHRoaXMuc3RhcnRYID0gdGhpcy5yZXNwYXduWDtcclxuXHRcdHRoaXMuc3RhcnRZID0gdGhpcy5yZXNwYXduWTtcclxuXHRcdHRoaXMuZGVzdGluYXRpb25YID0gdGhpcy5yZXNwYXduWDtcclxuXHRcdHRoaXMuZGVzdGluYXRpb25ZID0gdGhpcy5yZXNwYXduWTtcclxuXHRcdFxyXG5cdFx0dGhpcy5jYWxjQm9udXNTdGF0cygpO1xyXG5cdFx0dGhpcy5yZXN0b3JlKCk7XHJcblx0XHRcclxuXHRcdHRoaXMuaXNXYWxraW5nID0gZmFsc2U7XHJcblx0XHR0aGlzLmlzUnVubmluZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy5pc0F0dGFja2luZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy5pc0RlYWQgPSBmYWxzZTtcclxuXHRcdHRoaXMucmVzcGF3blRpbWVyID0gMDtcclxuXHR9XHJcblx0XHJcblx0c2V0RGVhZChraWxsZXJDb250cm9sbGVyLCBraWxsZXJOYW1lKSB7XHJcblx0XHRsZXQgbWFwID0gZ2FtZS5tYXBMaXN0W3RoaXMubWFwSWRdO1xyXG5cclxuXHRcdC8vIEludmVudG9yeSBJdGVtIERyb3AgQ2hhbmNlXHJcblx0XHRsZXQgZHJvcENoYW5jZSA9IHV0aWwuY2xhbXAobWFwLmRyb3BDaGFuY2UsIDAsIDEwMCk7XHJcblx0XHRpZiAoZHJvcENoYW5jZSA+IDApIHtcclxuXHRcdFx0bGV0IGl0ZW1zID0gdGhpcy5pbnZlbnRvcnkuZmlsdGVyKChpdGVtKSA9PiB7XHJcblx0XHRcdFx0aWYgKCFpdGVtKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0aWYgKGl0ZW0uc2xvdCA8IGNvbmZpZy5JTlZFTlRPUllfU0laRSkgcmV0dXJuIHRydWU7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcclxuXHRcdFx0XHRpZiAoIWl0ZW0pIHJldHVybjtcclxuXHRcdFx0XHRpZiAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAxKSA8PSBkcm9wQ2hhbmNlKSB7XHJcblx0XHRcdFx0XHR0aGlzLmRyb3BJdGVtKGl0ZW0uc2xvdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBFcXVpcHBlZCBJdGVtIERyb3AgQW1vdW50XHJcblx0XHRsZXQgZHJvcEFtb3VudEVRID0gdXRpbC5jbGFtcChtYXAuZHJvcEFtb3VudEVRLCAwLCBjb25maWcuRVFVSVBNRU5UX1NJWkUpO1xyXG5cdFx0aWYgKGRyb3BBbW91bnRFUSA+IDApIHtcclxuXHRcdFx0bGV0IGVxdWlwbWVudCA9IHRoaXMuaW52ZW50b3J5LmZpbHRlcigoaXRlbSkgPT4ge1xyXG5cdFx0XHRcdGlmIChpdGVtLnNsb3QgPj0gY29uZmlnLklOVkVOVE9SWV9TSVpFKSByZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0ZXF1aXBtZW50ID0gdXRpbC5zaHVmZmxlKGVxdWlwbWVudCk7XHJcblx0XHRcdGVxdWlwbWVudC5zcGxpY2UoLWRyb3BBbW91bnRFUSk7XHJcblx0XHRcdGVxdWlwbWVudC5mb3JFYWNoKChpdGVtKSA9PiB7XHJcblx0XHRcdFx0dGhpcy5kcm9wSXRlbShlcXVpcG1lbnQuc2xvdCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR0aGlzLmlzRGVhZCA9IHRydWU7XHJcblx0XHR0aGlzLmhlYWx0aCA9IDA7XHJcblx0XHR0aGlzLmVuZXJneSA9IDA7XHJcblx0XHR0aGlzLmRlYXRocysrO1xyXG5cdFx0XHJcblx0XHRpZiAoa2lsbGVyQ29udHJvbGxlciAmJiBraWxsZXJOYW1lKSB7XHJcblx0XHRcdGlmIChraWxsZXJDb250cm9sbGVyID0gJ3BsYXllcicpIHtcclxuXHRcdFx0XHRnYW1lLnNlbmRHYW1lSW5mb0dsb2JhbChraWxsZXJOYW1lICsgXCIgaGFzIG11cmRlcmVkIFwiICsgdGhpcy5uYW1lICsgXCIgaW4gY29sZCBibG9vZCFcIik7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0Z2FtZS5zZW5kR2FtZUluZm9HbG9iYWwodGhpcy5uYW1lICsgXCIgaGFzIGJlZW4ga2lsbGVkIGJ5IFwiICsga2lsbGVyTmFtZSArIFwiIVwiKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGdhbWUuc2VuZEdhbWVJbmZvR2xvYmFsKHRoaXMubmFtZSArIFwiIGhhcyBkaWVkIVwiKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0Ly8gSW52ZW50b3J5XHJcblx0cGlja1VwKCkge1xyXG5cdFx0Ly8gU2VlIFBsYXllciBhbmQgQm90IGNsYXNzZXNcclxuXHR9XHJcblx0XHJcblx0Z2V0TWFwSXRlbShtYXBJZCwgaWQpIHtcclxuXHRcdGxldCBpdGVtID0gZ2FtZS5tYXBMaXN0W21hcElkXS5pdGVtc1tpZF07XHJcblx0XHRpZiAoIWl0ZW0pIHJldHVybiBudWxsO1xyXG5cclxuXHRcdGlmIChpdGVtLnN0YWNrID4gMCkge1xyXG5cdFx0XHRsZXQgc2xvdCA9IHRoaXMuZmluZEl0ZW1TbG90KGl0ZW0uaXRlbUNsYXNzKTtcclxuXHRcdFx0aWYgKHNsb3QgPj0gMCkge1xyXG5cdFx0XHRcdHRoaXMuaW52ZW50b3J5W3Nsb3RdLnN0YWNrICs9IGl0ZW0uc3RhY2s7XHJcblx0XHRcdFx0aXRlbS5yZW1vdmUoKTtcclxuXHRcdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBzbG90ID0gdGhpcy5maW5kRmlyc3RFbXB0eVNsb3QoKTtcclxuXHRcdHJldHVybiBzbG90O1xyXG5cdH1cclxuXHJcblx0Z2V0SXRlbShkYXRhKSB7XHJcblx0XHRpZiAoIWRhdGEgfHwgZGF0YS5pdGVtQ2xhc3MgPT0gbnVsbCkgcmV0dXJuIG51bGw7XHJcblxyXG5cdFx0aWYgKGRhdGEuc3RhY2spIHtcclxuXHRcdFx0c2xvdCA9IHRoaXMuZmluZEl0ZW1TbG90KGRhdGEuaXRlbUNsYXNzKTtcclxuXHRcdFx0aWYgKHNsb3QgPj0gMCkge1xyXG5cdFx0XHRcdHRoaXMuaW52ZW50b3J5W3Nsb3RdLnN0YWNrICs9IGRhdGEuc3RhY2s7XHJcblx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGhpcy5maW5kRmlyc3RFbXB0eVNsb3QoKTtcclxuXHR9XHJcblx0XHJcblx0ZHJvcEl0ZW0oc2xvdCkge1xyXG5cdFx0bGV0IGl0ZW0gPSB0aGlzLmludmVudG9yeVtzbG90XTtcclxuXHRcdGlmICghaXRlbSkgcmV0dXJuO1xyXG5cdFx0XHJcblx0XHRpZiAoc2xvdCA+PSBjb25maWcuSU5WRU5UT1JZX1NJWkUpIHtcclxuXHRcdFx0dGhpcy51bmVxdWlwSXRlbShzbG90KTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGl0ZW0ubW92ZVRvTWFwKHRoaXMubWFwSWQsIHRoaXMueCwgdGhpcy55KTtcclxuXHR9XHJcblx0XHJcblx0dXNlSXRlbShzbG90KSB7XHJcblx0XHRsZXQgaXRlbSA9IHRoaXMuaW52ZW50b3J5W3Nsb3RdO1xyXG5cdFx0aWYgKCFpdGVtKSByZXR1cm47XHJcblxyXG5cdFx0Ly8gaWYgKCFkYi5pdGVtc1tpdGVtLmlkXS51c2UuY2FsbCh0aGlzLCBzbG90KSkgcmV0dXJuO1x0Ly8gUnVuICd1c2UnIHNjcmlwdFxyXG5cclxuXHRcdGlmIChpdGVtLmlzRXF1aXBtZW50KCkpIHtcdC8vIEVxdWlwbWVudCBJdGVtc1xyXG5cdFx0XHRpZiAoc2xvdCA8IGNvbmZpZy5JTlZFTlRPUllfU0laRSkge1x0Ly8gQ2hlY2sgaWYgaXRlbSBpcyBlcXVpcHBlZFxyXG5cdFx0XHRcdHRoaXMuZXF1aXBJdGVtKHNsb3QpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMudW5lcXVpcEl0ZW0oc2xvdCk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChpdGVtLnJldXNhYmxlKSByZXR1cm47XHJcblx0XHRcclxuXHRcdGlmIChpdGVtLnN0YWNrID4gMSkge1xyXG5cdFx0XHRpdGVtLnN0YWNrLS07XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpdGVtLnJlbW92ZSgpO1xyXG5cdH1cclxuXHRcclxuXHRoYXNJdGVtKGl0ZW1DbGFzcykge1xyXG5cdFx0bGV0IGNvdW50ID0gMDtcclxuXHRcdGZvciAobGV0IHNsb3QgPSAwOyBzbG90IDwgY29uZmlnLklOVkVOVE9SWV9TSVpFICsgY29uZmlnLkVRVUlQTUVOVF9TSVpFOyBzbG90KyspIHtcclxuXHRcdFx0aWYgKHRoaXMuaW52ZW50b3J5W3Nsb3RdKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuaW52ZW50b3J5W3Nsb3RdLml0ZW1DbGFzcyA9PT0gaXRlbUNsYXNzKSB7XHJcblx0XHRcdFx0XHRjb3VudCsrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGNvdW50O1xyXG5cdH1cclxuXHJcblx0ZmluZEl0ZW1TbG90KGl0ZW1DbGFzcykge1xyXG5cdFx0bGV0IHNsb3QgPSBudWxsO1xyXG5cdFx0Zm9yIChsZXQgY2hlY2tTbG90ID0gMDsgY2hlY2tTbG90IDwgY29uZmlnLklOVkVOVE9SWV9TSVpFICsgY29uZmlnLkVRVUlQTUVOVF9TSVpFOyBjaGVja1Nsb3QrKykge1xyXG5cdFx0XHRpZiAodGhpcy5pbnZlbnRvcnlbY2hlY2tTbG90XSkge1xyXG5cdFx0XHRcdGlmICh0aGlzLmludmVudG9yeVtjaGVja1Nsb3RdLml0ZW1DbGFzcyA9PT0gaXRlbUNsYXNzKSB7XHJcblx0XHRcdFx0XHRzbG90ID0gY2hlY2tTbG90O1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gc2xvdDtcclxuXHR9XHJcblx0XHJcblx0bW92ZUl0ZW1Ub1Nsb3Qoc2xvdCwgbmV3U2xvdCkge1xyXG5cdFx0aWYgKHNsb3QgPT0gbnVsbCB8fCBuZXdTbG90ID09IG51bGwgfHwgc2xvdCA9PT0gbmV3U2xvdCkgcmV0dXJuO1x0Ly8gbnVsbCA9PSB1bmRlZmluZWQsIG51bGwgIT0gMFxyXG5cdFx0aWYgKHNsb3QgPj0gY29uZmlnLklOVkVOVE9SWV9TSVpFICsgY29uZmlnLkVRVUlQTUVOVF9TSVpFKSByZXR1cm47XHJcblx0XHRpZiAobmV3U2xvdCA+PSBjb25maWcuSU5WRU5UT1JZX1NJWkUgKyBjb25maWcuRVFVSVBNRU5UX1NJWkUpIHJldHVybjtcclxuXHJcblx0XHRsZXQgaXRlbSA9IHRoaXMuaW52ZW50b3J5W3Nsb3RdO1xyXG5cdFx0bGV0IG5ld0l0ZW0gPSB0aGlzLmludmVudG9yeVtuZXdTbG90XTtcclxuXHRcdGlmICghaXRlbSkgcmV0dXJuO1xyXG5cclxuXHRcdC8vIFRhcmdldCBzbG90IGlzIGZvciBlcXVpcG1lbnQgLSBjaGVjayB0eXBlIG1hdGNoZXNcclxuXHRcdGlmIChuZXdTbG90ID49IGNvbmZpZy5JTlZFTlRPUllfU0laRSkge1xyXG5cdFx0XHRpZiAoIWl0ZW0uY2FuRXF1aXAobmV3U2xvdCkpIHtcclxuXHRcdFx0XHRnYW1lLnNlbmRHYW1lSW5mb1BsYXllcih0aGlzLmlkLCBcIlRoYXQgY2Fubm90IGJlIGVxdWlwcGVkIHRoZXJlLlwiKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBzd2FwU2xvdHMgPSAoKSA9PiB7XHJcblx0XHRcdGl0ZW0uc2xvdCA9IG5ld1Nsb3Q7XHJcblx0XHRcdGlmIChuZXdJdGVtKSBuZXdJdGVtLnNsb3QgPSBzbG90O1xyXG5cdFx0XHR1dGlsLnN3YXAodGhpcy5pbnZlbnRvcnksIHNsb3QsIG5ld1Nsb3QpO1xyXG5cdFx0XHR0aGlzLmNhbGNCb251c1N0YXRzKCk7XHJcblx0XHR9O1xyXG5cclxuXHRcdC8vIElGIE5vIG5ldyBpdGVtIGluIG5ldyBzbG90XHJcblx0XHQvLyBPUiBOZXcgaXRlbSBpbiBuZXcgc2xvdCwgb2xkIGl0ZW0gaW4gaW52ZW50b3J5XHJcblx0XHQvLyBPUiBOZXcgaXRlbSBpbiBuZXcgc2xvdCwgb2xkIGl0ZW0gaXMgZXF1aXBwZWQsIG5ldyBpdGVtIGNhbiBiZSBlcXVpcHBlZCBpbiBvbGQgc2xvdFxyXG5cdFx0aWYgKCFuZXdJdGVtIHx8IHNsb3QgPCBjb25maWcuSU5WRU5UT1JZX1NJWkUgfHwgbmV3SXRlbS5jYW5FcXVpcChzbG90KSkge1xyXG5cdFx0XHRzd2FwU2xvdHMoKTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHQvLyBPbGQgaXRlbSBpcyBlcXVpcHBlZCwgbmV3IGl0ZW0gY2Fubm90IGJlIGVxdWlwcGVkIGluIG9sZCBzbG90XHJcblx0XHRcdG5ld1Nsb3QgPSB0aGlzLmZpbmRGaXJzdEVtcHR5U2xvdCgpO1xyXG5cdFx0XHRpZiAobmV3U2xvdCAhPSBudWxsKSB7XHJcblx0XHRcdFx0c3dhcFNsb3RzKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0Z2FtZS5zZW5kR2FtZUluZm9QbGF5ZXIodGhpcy5pZCwgXCJZb3VyIGludmVudG9yeSBpcyBmdWxsLlwiKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZXF1aXBJdGVtKHNsb3QpIHtcclxuXHRcdGxldCBuZXdTbG90ID0gbnVsbDtcclxuXHRcdGZvciAobGV0IGkgPSBjb25maWcuSU5WRU5UT1JZX1NJWkU7IGkgPCBjb25maWcuRVFVSVBNRU5UX1NJWkU7IGkrKykge1xyXG5cdFx0XHRpZiAoaXRlbS5jYW5FcXVpcChpKSkge1xyXG5cdFx0XHRcdG5ld1Nsb3QgPSBpO1xyXG5cdFx0XHRcdGlmICghdGhpcy5pbnZlbnRvcnlbaV0pIGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRpZiAobmV3U2xvdCA9PT0gbnVsbCkgcmV0dXJuO1xyXG5cclxuXHRcdHRoaXMubW92ZUl0ZW1Ub1Nsb3Qoc2xvdCwgbmV3U2xvdCk7XHJcblx0fVxyXG5cclxuXHR1bmVxdWlwSXRlbShzbG90KSB7XHJcblx0XHRpZiAoc2xvdCA8IGNvbmZpZy5JTlZFTlRPUllfU0laRSkgcmV0dXJuO1xyXG5cdFx0aWYgKCF0aGlzLmludmVudG9yeVtzbG90XSkgcmV0dXJuO1xyXG5cdFx0XHJcblx0XHRsZXQgbmV3U2xvdCA9IHRoaXMuZmluZEZpcnN0RW1wdHlTbG90KCk7XHJcblx0XHRpZiAobmV3U2xvdCA9PSBudWxsKSB7XHJcblx0XHRcdGdhbWUuc2VuZEdhbWVJbmZvUGxheWVyKHRoaXMuaWQsIFwiWW91ciBpbnZlbnRvcnkgaXMgZnVsbC5cIik7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLm1vdmVJdGVtVG9TbG90KHNsb3QsIG5ld1Nsb3QpO1xyXG5cdH1cclxuXHRcclxuXHRmaW5kRmlyc3RFbXB0eVNsb3QoKSB7XHJcblx0XHRmb3IgKGxldCBzbG90ID0gMDsgc2xvdCA8IGNvbmZpZy5JTlZFTlRPUllfU0laRTsgc2xvdCsrKSB7XHJcblx0XHRcdGlmICh0aGlzLmludmVudG9yeVtzbG90XSA9PSBudWxsKSByZXR1cm4gc2xvdDtcclxuXHRcdH1cclxuXHRcdHJldHVybiBudWxsO1xyXG5cdH1cclxuXHJcblxyXG5cdHVwZGF0ZShkZWx0YSkge1xyXG5cdFx0Ly8gSW52ZW50b3J5IEl0ZW0gVXBkYXRlXHJcblx0XHR0aGlzLmludmVudG9yeS5mb3JFYWNoKChpdGVtKSA9PiB7XHJcblx0XHRcdGlmICghaXRlbSkgcmV0dXJuO1xyXG5cdFx0XHRpdGVtLnVwZGF0ZSgpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0Ly8gUmVzcGF3bmluZ1xyXG5cdFx0aWYgKHRoaXMuaXNEZWFkKSB7XHJcblx0XHRcdHRoaXMucmVzcGF3blRpbWVyICs9IGRlbHRhO1xyXG5cdFx0XHRpZiAodGhpcy5yZXNwYXduVGltZXIgPj0gdGhpcy5yZXNwYXduU3BlZWQpIHRoaXMucmVzcGF3bigpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vIEF0dGFja2luZ1xyXG5cdFx0aWYgKHRoaXMuaXNBdHRhY2tpbmcgfHwgdGhpcy5hdHRhY2tUaW1lciA+IDApIHtcclxuXHRcdFx0dGhpcy5hdHRhY2tUaW1lciArPSBkZWx0YTtcclxuXHRcdFx0aWYgKHRoaXMuYXR0YWNrVGltZXIgPj0gMC4zKSB0aGlzLmlzQXR0YWNraW5nID0gZmFsc2U7XHJcblx0XHRcdGlmICh0aGlzLmF0dGFja1RpbWVyID49IHRoaXMuYXR0YWNrU3BlZWQpIHRoaXMuYXR0YWNrVGltZXIgPSAwO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBNb3ZlbWVudFxyXG5cdFx0aWYgKHRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0dGhpcy5sZXJwICs9IGRlbHRhICogdGhpcy5tb3ZlU3BlZWQ7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAodGhpcy5sZXJwID49IDAuNDkpIHtcclxuXHRcdFx0XHR0aGlzLnggPSB0aGlzLmRlc3RpbmF0aW9uWDtcclxuXHRcdFx0XHR0aGlzLnkgPSB0aGlzLmRlc3RpbmF0aW9uWTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0aWYgKHRoaXMubGVycCA+PSAwLjk5KSB7XHJcblx0XHRcdFx0dGhpcy5zdGFydFggPSB0aGlzLmRlc3RpbmF0aW9uWDtcclxuXHRcdFx0XHR0aGlzLnN0YXJ0WSA9IHRoaXMuZGVzdGluYXRpb25ZO1xyXG5cdFx0XHRcdHRoaXMubGVycCA9IDA7XHJcblx0XHRcdFx0dGhpcy5pc01vdmluZyA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRnZXRJbnZlbnRvcnlQYWNrKCkge1xyXG5cdFx0bGV0IGludmVudG9yeVBhY2sgPSBbXTtcclxuXHRcdFxyXG5cdFx0dGhpcy5pbnZlbnRvcnkuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG5cdFx0XHRpZiAoIWl0ZW0pIHJldHVybjtcclxuXHRcdFx0aW52ZW50b3J5UGFja1tpdGVtLnNsb3RdID0gaXRlbS5nZXRQYWNrKCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gaW52ZW50b3J5UGFjaztcclxuXHR9XHJcbn1cclxuIiwiaW1wb3J0IGRiIGZyb20gJy4uL2RiLmpzJztcclxuaW1wb3J0IGdhbWUgZnJvbSAnLi4vZ2FtZS5qcyc7XHJcbmltcG9ydCBjb25maWcgZnJvbSAnLi4vY29uZmlnLmpzJztcclxuaW1wb3J0IHV0aWwgZnJvbSAnLi4vdXRpbC5qcyc7XHJcbmltcG9ydCBBY3RvciBmcm9tICcuL2FjdG9yLmpzJztcclxuXHJcbi8vIEEgQm90IGlzIGFuIEFjdG9yIHdpdGggY29uZGl0aW9uYWwgaW5wdXRzXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCb3QgZXh0ZW5kcyBBY3RvciB7XHJcblx0Y29uc3RydWN0b3IoZGF0YSkge1xyXG5cdFx0XHJcblx0XHRsZXQgY2xhc3NEYXRhID0gZGIuZ2V0Qm90RGF0YShkYXRhLmJvdENsYXNzKTtcclxuXHRcdGlmICghZGF0YS5uYW1lKSBkYXRhLm5hbWUgPSBjbGFzc0RhdGEubmFtZTtcclxuXHRcdGlmIChkYXRhLnNwcml0ZSA9PSBudWxsKSBkYXRhLnNwcml0ZSA9IGNsYXNzRGF0YS5zcHJpdGU7XHJcblx0XHRpZiAoZGF0YS5ob3N0aWxlID09IG51bGwpIGRhdGEuaG9zdGlsZSA9IGNsYXNzRGF0YS5ob3N0aWxlO1xyXG5cdFx0aWYgKGRhdGEuZGFtYWdlQmFzZSA9PSBudWxsKSBkYXRhLmRhbWFnZUJhc2UgPSBjbGFzc0RhdGEuZGFtYWdlQmFzZTtcclxuXHRcdGlmIChkYXRhLmRlZmVuY2VCYXNlID09IG51bGwpIGRhdGEuZGVmZW5jZUJhc2UgPSBjbGFzc0RhdGEuZGVmZW5jZUJhc2U7XHJcblx0XHRpZiAoZGF0YS5oZWFsdGhNYXhCYXNlID09IG51bGwpIGRhdGEuaGVhbHRoTWF4QmFzZSA9IGNsYXNzRGF0YS5oZWFsdGhNYXhCYXNlO1xyXG5cdFx0aWYgKGRhdGEuZW5lcmd5TWF4QmFzZSA9PSBudWxsKSBkYXRhLmVuZXJneU1heEJhc2UgPSBjbGFzc0RhdGEuZW5lcmd5TWF4QmFzZTtcclxuXHRcdGlmIChkYXRhLnJhbmdlQmFzZSA9PSBudWxsKSBkYXRhLnJhbmdlQmFzZSA9IGNsYXNzRGF0YS5yYW5nZUJhc2U7XHJcblx0XHRcclxuXHRcdHN1cGVyKGRhdGEubWFwSWQsIGRhdGEueCwgZGF0YS55LCBkYXRhLm5hbWUsIGRhdGEuc3ByaXRlKTtcclxuXHRcdGlmIChkYXRhLmlkID09IG51bGwpIGRhdGEuaWQgPSB1dGlsLmZpcnN0RW1wdHlJbmRleChnYW1lLm1hcExpc3RbdGhpcy5tYXBJZF0uYm90cyk7XHJcblx0XHR0aGlzLmlkID0gZGF0YS5pZDtcclxuXHRcdHRoaXMuYm90Q2xhc3MgPSBkYXRhLmJvdENsYXNzO1xyXG5cdFx0dGhpcy5ob3N0aWxlID0gZGF0YS5ob3N0aWxlO1xyXG5cdFx0dGhpcy5kYW1hZ2VCYXNlID0gZGF0YS5kYW1hZ2VCYXNlO1xyXG5cdFx0dGhpcy5kZWZlbmNlQmFzZSA9IGRhdGEuZGVmZW5jZUJhc2U7XHJcblx0XHR0aGlzLmhlYWx0aE1heEJhc2UgPSBkYXRhLmhlYWx0aE1heEJhc2U7XHJcblx0XHR0aGlzLmVuZXJneU1heEJhc2UgPSBkYXRhLmVuZXJneU1heEJhc2U7XHJcblx0XHR0aGlzLnJhbmdlQmFzZSA9IGRhdGEucmFuZ2VCYXNlO1xyXG5cdFx0XHJcblx0XHR0aGlzLnRhcmdldCA9IG51bGw7XHJcblx0XHR0aGlzLnNldFRhc2soJ3dhbmRlcmluZycpO1xyXG5cdFx0dGhpcy5tb3ZlVGltZXIgPSAwO1xyXG5cclxuXHRcdGdhbWUubWFwTGlzdFt0aGlzLm1hcElkXS5ib3RzW3RoaXMuaWRdID0gdGhpcztcclxuXHR9XHJcblx0XHJcblx0Z2V0TWFwSXRlbShtYXBJZCwgaWQpIHtcclxuXHRcdGxldCBzbG90ID0gc3VwZXIuZ2V0TWFwSXRlbShtYXBJZCwgaWQpO1xyXG5cdFx0aWYgKHNsb3QgPT0gbnVsbCkgcmV0dXJuO1xyXG5cdFx0XHJcblx0XHRsZXQgaXRlbSA9IGdhbWUubWFwTGlzdFttYXBJZF0uaXRlbXNbaWRdO1xyXG5cdFx0aXRlbS5tb3ZlVG9Cb3QodGhpcy5tYXBJZCwgdGhpcy5pZCwgc2xvdCk7XHJcblx0fVxyXG5cclxuXHRnZXRJdGVtKGRhdGEpIHtcclxuXHRcdGxldCBzbG90ID0gc3VwZXIuZ2V0SXRlbShkYXRhKTtcclxuXHRcdGlmIChzbG90ID09IG51bGwpIHJldHVybjtcclxuXHJcblx0XHRkYXRhLm93bmVyID0gJ2JvdCc7XHJcblx0XHRkYXRhLm1hcElkID0gdGhpcy5tYXBJZDtcclxuXHRcdGRhdGEuaWQgPSB0aGlzLmlkO1xyXG5cdFx0ZGF0YS5zbG90ID0gc2xvdDtcclxuXHRcdG5ldyBJdGVtKGRhdGEpO1xyXG5cdH1cclxuXHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHRzdXBlci51cGRhdGUoZGVsdGEpOyBcdC8vIERlZmF1bHQgQWN0b3IgVXBkYXRlXHJcblx0XHRpZiAodGhpcy5pc0RlYWQpIHJldHVybjtcclxuXHJcblx0XHR0aGlzLm1vdmVUaW1lcisrO1xyXG5cdFx0XHJcblx0XHQvLyBBSSBJbnB1dHNcclxuXHRcdHN3aXRjaCh0aGlzLnRhc2spIHtcclxuXHRcdFx0Y2FzZSAnd2FuZGVyaW5nJzpcdFx0Ly8gTW92ZSByYW5kb21seVxyXG5cdFx0XHRcdHRoaXMubW92ZSgpO1xyXG5cdFx0XHRcdHRoaXMucGlja1VwKCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdmb2xsb3dpbmcnOlx0XHQvLyBNb3ZlIHRvd2FyZHMgdGFyZ2V0XHJcblx0XHRcdFx0aWYgKHRoaXMudGFyZ2V0KSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmVUb1RhcmdldCh0aGlzLnRhcmdldCwgZmFsc2UpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdC8vIE5vIHRhcmdldFxyXG5cdFx0XHRcdFx0dGhpcy5zZXRUYXNrKCd3YW5kZXJpbmcnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdhdHRhY2tpbmcnOlx0XHQvLyBNb3ZlIHRvd2FyZHMgdGFyZ2V0IGFuZCBhdHRhY2tcclxuXHRcdFx0XHRpZiAodGhpcy50YXJnZXQpIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZVRvVGFyZ2V0KHRoaXMudGFyZ2V0LCB0cnVlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHQvLyBObyB0YXJnZXRcclxuXHRcdFx0XHRcdHRoaXMuc2V0VGFzaygnd2FuZGVyaW5nJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Ly8gY2FzZSAnaWRsZSc6XHJcblx0XHRcdGRlZmF1bHQ6IFx0XHRcdFx0XHQvLyBTdGFuZCBzdGlsbFxyXG5cdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIHRoaXMuZ2V0UGFjaygpO1xyXG5cdH1cclxuXHRcclxuXHRnZXRQYWNrKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0aWQ6IHRoaXMuaWQsXHJcblx0XHRcdG5hbWU6IHRoaXMubmFtZSxcclxuXHRcdFx0c3ByaXRlOiB0aGlzLnNwcml0ZSxcclxuXHRcdFx0ZGlyZWN0aW9uOiB0aGlzLmRpcmVjdGlvbixcclxuXHRcdFx0bWFwSWQ6IHRoaXMubWFwSWQsXHJcblx0XHRcdHg6IHRoaXMuc3RhcnRYLFxyXG5cdFx0XHR5OiB0aGlzLnN0YXJ0WSxcclxuXHRcdFx0ejogdGhpcy56LFxyXG5cdFx0XHRkZXN0aW5hdGlvblg6IHRoaXMuZGVzdGluYXRpb25YLFxyXG5cdFx0XHRkZXN0aW5hdGlvblk6IHRoaXMuZGVzdGluYXRpb25ZLFxyXG5cdFx0XHRsZXJwOiB0aGlzLmxlcnAsXHJcblx0XHRcdGlzUnVubmluZzogdGhpcy5pc1J1bm5pbmcsXHJcblx0XHRcdGlzQXR0YWNraW5nOiB0aGlzLmlzQXR0YWNraW5nLFxyXG5cdFx0XHRpc0RlYWQ6IHRoaXMuaXNEZWFkLFxyXG5cdFx0XHRpc1Zpc2libGU6IHRoaXMuaXNWaXNpYmxlXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0cmVtb3ZlKCkge1xyXG5cdFx0ZGVsZXRlIGdhbWUubWFwTGlzdFt0aGlzLm1hcElkXS5ib3RzW3RoaXMuaWRdO1xyXG5cdH1cclxuXHRcclxuXHRtb3ZlKGRpcmVjdGlvbikge1xyXG5cdFx0bGV0IG1vdmVUaW1lID0gMjQ7XHJcblx0XHRpZiAodGhpcy5pc1J1bm5pbmcpIHtcclxuXHRcdFx0bW92ZVRpbWUgPSAxNztcclxuXHRcdH1cclxuXHRcdGlmICh0aGlzLm1vdmVUaW1lciA+IG1vdmVUaW1lICYmIHRoaXMuYXR0YWNrVGltZXIgPT09IDApIHtcclxuXHRcdFx0c3VwZXIubW92ZShkaXJlY3Rpb24pO1xyXG5cdFx0XHR0aGlzLm1vdmVUaW1lciA9IDA7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHRha2VEYW1hZ2UoZGFtYWdlLCBzb3VyY2UpIHtcclxuXHRcdGlmIChzb3VyY2UgaW5zdGFuY2VvZiBBY3Rvcikge1xyXG5cdFx0XHR0aGlzLnNldFRhc2soJ2F0dGFja2luZycsIHNvdXJjZSk7XHJcblx0XHR9XHJcblx0XHRzdXBlci50YWtlRGFtYWdlKGRhbWFnZSwgc291cmNlKTtcclxuXHR9XHJcblx0XHJcblx0cmVzcGF3bigpIHtcclxuXHRcdHN1cGVyLnJlc3Bhd24oKTtcclxuXHRcdHRoaXMuc2V0VGFzaygnd2FuZGVyaW5nJyk7XHJcblx0fVxyXG5cdFxyXG5cdHBpY2tVcCgpIHtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgZ2FtZS5tYXBMaXN0W3RoaXMubWFwSWRdLml0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGxldCBpdGVtID0gZ2FtZS5tYXBMaXN0W3RoaXMubWFwSWRdLml0ZW1zW2ldO1xyXG5cdFx0XHRpZiAoaXRlbSAmJiBpdGVtLnggPT09IHRoaXMueCAmJiBpdGVtLnkgPT09IHRoaXMueSkge1xyXG5cdFx0XHRcdGxldCBzbG90ID0gdGhpcy5nZXRNYXBJdGVtKGl0ZW0ubWFwSWQsIGl0ZW0uaWQpO1xyXG5cdFx0XHRcdGlmIChzbG90ICE9IG51bGwpIHtcclxuXHRcdFx0XHRcdGl0ZW0ubW92ZVRvQm90KHRoaXMubWFwSWQsIHRoaXMuaWQsIHNsb3QpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdC8vIEludmVudG9yeSBmdWxsXHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHRoaXMuY2hlY2tCZXN0RXF1aXBtZW50KCk7XHJcblx0fVxyXG5cdFxyXG5cdHNldFRhc2sodGFzaywgdGFyZ2V0KSB7XHJcblx0XHRzd2l0Y2ggKHRhc2spIHtcclxuXHRcdFx0Y2FzZSAnd2FuZGVyaW5nJzpcclxuXHRcdFx0XHR0aGlzLmxhemluZXNzID0gNztcclxuXHRcdFx0XHR0aGlzLnRhcmdldCA9IG51bGw7XHJcblx0XHRcdFx0dGhpcy50YXNrID0gdGFzaztcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ2ZvbGxvd2luZyc6XHJcblx0XHRcdFx0aWYgKHRhcmdldCA9PT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0dGhpcy5zZXRUYXNrKCd3YW5kZXJpbmcnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLmxhemluZXNzID0gMDtcclxuXHRcdFx0XHRcdHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xyXG5cdFx0XHRcdFx0dGhpcy50YXNrID0gdGFzaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdhdHRhY2tpbmcnOlxyXG5cdFx0XHRcdGlmICh0YXJnZXQgPT09IG51bGwpIHtcclxuXHRcdFx0XHRcdHRoaXMuc2V0VGFzaygnd2FuZGVyaW5nJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5sYXppbmVzcyA9IDA7XHJcblx0XHRcdFx0XHR0aGlzLnRhcmdldCA9IHRhcmdldDtcclxuXHRcdFx0XHRcdHRoaXMudGFzayA9IHRhc2s7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0ZGVmYXVsdDpcdC8vaWRsaW5nXHJcblx0XHRcdFx0dGhpcy5sYXppbmVzcyA9IDc7XHJcblx0XHRcdFx0dGhpcy50YXJnZXQgPSBudWxsO1xyXG5cdFx0XHRcdHRoaXMudGFzayA9ICdpZGxlJztcclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGNoZWNrQmVzdEVxdWlwbWVudCgpIHtcclxuXHRcdGZvciAobGV0IHNsb3QgPSAwOyBzbG90IDwgY29uZmlnLklOVkVOVE9SWV9TSVpFOyBzbG90KyspIHtcclxuXHRcdFx0bGV0IGl0ZW0gPSB0aGlzLmludmVudG9yeVtzbG90XTtcclxuXHRcdFx0aWYgKCFpdGVtKSB7XHJcblx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdHN3aXRjaCAoaXRlbS50eXBlKSB7XHJcblx0XHRcdFx0Y2FzZSAnd2VhcG9uJzpcclxuXHRcdFx0XHRcdGlmICh0aGlzLmludmVudG9yeVtjb25maWcuSU5WRU5UT1JZX1NJWkVdKSB7XHJcblx0XHRcdFx0XHRcdGlmIChpdGVtLmRhbWFnZUJvbnVzID4gdGhpcy5pbnZlbnRvcnlbY29uZmlnLklOVkVOVE9SWV9TSVpFXS5kYW1hZ2VCb251cykge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuZXF1aXBJdGVtKHNsb3QpO1xyXG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5lcXVpcEl0ZW0oc2xvdCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAnc2hpZWxkJzpcclxuXHRcdFx0XHRcdGlmICh0aGlzLmludmVudG9yeVtjb25maWcuSU5WRU5UT1JZX1NJWkUgKyAxXSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoaXRlbS5kZWZlbmNlQm9udXMgPiB0aGlzLmludmVudG9yeVtjb25maWcuSU5WRU5UT1JZX1NJWkUgKyAxXS5kZWZlbmNlQm9udXMpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmVxdWlwSXRlbShzbG90KTtcclxuXHRcdFx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZXF1aXBJdGVtKHNsb3QpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ2FybW91cic6XHJcblx0XHRcdFx0XHRpZiAodGhpcy5pbnZlbnRvcnlbY29uZmlnLklOVkVOVE9SWV9TSVpFICsgMl0pIHtcclxuXHRcdFx0XHRcdFx0aWYgKGl0ZW0uZGVmZW5jZUJvbnVzID4gdGhpcy5pbnZlbnRvcnlbY29uZmlnLklOVkVOVE9SWV9TSVpFICsgMl0uZGVmZW5jZUJvbnVzKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5lcXVpcEl0ZW0oc2xvdCk7XHJcblx0XHRcdFx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmVxdWlwSXRlbShzbG90KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdoZWxtZXQnOlxyXG5cdFx0XHRcdFx0aWYgKHRoaXMuaW52ZW50b3J5W2NvbmZpZy5JTlZFTlRPUllfU0laRSArIDNdKSB7XHJcblx0XHRcdFx0XHRcdGlmIChpdGVtLmRlZmVuY2VCb251cyA+IHRoaXMuaW52ZW50b3J5W2NvbmZpZy5JTlZFTlRPUllfU0laRSArIDNdLmRlZmVuY2VCb251cykge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuZXF1aXBJdGVtKHNsb3QpO1xyXG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5lcXVpcEl0ZW0oc2xvdCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAncmluZyc6XHJcblx0XHRcdFx0XHRpZiAodGhpcy5pbnZlbnRvcnlbY29uZmlnLklOVkVOVE9SWV9TSVpFICsgNF0pIHtcclxuXHRcdFx0XHRcdFx0aWYgKGl0ZW0uZGFtYWdlQm9udXMgPiB0aGlzLmludmVudG9yeVtjb25maWcuSU5WRU5UT1JZX1NJWkUgKyA0XS5kYW1hZ2VCb251cykge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuZXF1aXBJdGVtKHNsb3QpO1xyXG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5lcXVpcEl0ZW0oc2xvdCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn1cclxuIiwiaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9jb25maWcuanMnO1xyXG5cclxuLy8gQW4gRW50aXR5IGlzIGFueSBvYmplY3Qgd2hpY2ggY2FuIGFwcGVhciBvbiB0aGUgbWFwXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbnRpdHkge1xyXG5cdGNvbnN0cnVjdG9yKG1hcElkLCB4LCB5LCBzcHJpdGUgPSAwKSB7XHJcblx0XHR0aGlzLm1hcElkID0gbWFwSWQ7XHJcblx0XHR0aGlzLnggPSB4O1xyXG5cdFx0dGhpcy55ID0geTtcclxuXHRcdGlmIChzcHJpdGUgPCAwKSBzcHJpdGUgPSAwO1xyXG5cdFx0dGhpcy5zcHJpdGUgPSBzcHJpdGU7XHJcblx0XHR0aGlzLmlzVmlzaWJsZSA9IHRydWU7XHJcblx0fVxyXG59IiwiaW1wb3J0IGRiIGZyb20gJy4uL2RiLmpzJztcclxuaW1wb3J0IGdhbWUgZnJvbSAnLi4vZ2FtZS5qcyc7XHJcbmltcG9ydCB1dGlsIGZyb20gJy4uL3V0aWwuanMnO1xyXG5pbXBvcnQgRW50aXR5IGZyb20gJy4vZW50aXR5LmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEl0ZW0gZXh0ZW5kcyBFbnRpdHkge1xyXG5cdGNvbnN0cnVjdG9yKGRhdGEpIHtcclxuXHRcdGlmICghZGF0YS5vd25lciB8fCBkYXRhLml0ZW1DbGFzcyA9PSBudWxsIHx8IGRhdGEuaWQgPT0gbnVsbCkgcmV0dXJuO1xyXG5cdFx0XHJcblx0XHRpZiAoZGF0YS5vd25lciA9PT0gJ3BsYXllcicpIHtcclxuXHRcdFx0aWYgKGRhdGEuc2xvdCA9PSBudWxsKSByZXR1cm47XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChkYXRhLm93bmVyID09PSAnYm90Jykge1xyXG5cdFx0XHRpZiAoZGF0YS5tYXBJZCA9PSBudWxsIHx8IGRhdGEuc2xvdCA9PSBudWxsKSByZXR1cm47XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChkYXRhLm93bmVyID09PSAnbWFwJykge1xyXG5cdFx0XHRpZiAoZGF0YS5tYXBJZCA9PSBudWxsIHx8IGRhdGEueCA9PSBudWxsIHx8IGRhdGEueSA9PSBudWxsKSByZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGRhdGEubWFwSWQgPT09IHVuZGVmaW5lZCkgZGF0YS5tYXBJZCA9IG51bGw7XHJcblx0XHRpZiAoZGF0YS54ID09PSB1bmRlZmluZWQpIGRhdGEueCA9IG51bGw7XHJcblx0XHRpZiAoZGF0YS55ID09PSB1bmRlZmluZWQpIGRhdGEueSA9IG51bGw7XHJcblx0XHRpZiAoZGF0YS56ID09PSB1bmRlZmluZWQpIGRhdGEueiA9IC0xMDtcclxuXHRcdGlmIChkYXRhLnNsb3QgPT09IHVuZGVmaW5lZCkgZGF0YS5zbG90ID0gbnVsbDtcclxuXHJcblx0XHRsZXQgY2xhc3NEYXRhID0gZGIuZ2V0SXRlbURhdGEoZGF0YS5pdGVtQ2xhc3MpO1xyXG5cdFx0aWYgKGRhdGEubmFtZSA9PSBudWxsKSBkYXRhLm5hbWUgPSBjbGFzc0RhdGEubmFtZTtcclxuXHRcdGlmIChkYXRhLnR5cGUgPT0gbnVsbCkgZGF0YS50eXBlID0gY2xhc3NEYXRhLnR5cGU7XHJcblx0XHRpZiAoZGF0YS5zcHJpdGUgPT0gbnVsbCkgZGF0YS5zcHJpdGUgPSBjbGFzc0RhdGEuc3ByaXRlO1xyXG5cdFx0aWYgKGRhdGEucmV1c2FibGUgPT0gbnVsbCkgZGF0YS5yZXVzYWJsZSA9IGNsYXNzRGF0YS5yZXVzYWJsZTtcclxuXHRcdGlmIChkYXRhLmRhbWFnZUJvbnVzID09IG51bGwpIGRhdGEuZGFtYWdlQm9udXMgPSBjbGFzc0RhdGEuZGFtYWdlQm9udXM7XHJcblx0XHRpZiAoZGF0YS5kZWZlbmNlQm9udXMgPT0gbnVsbCkgZGF0YS5kZWZlbmNlQm9udXMgPSBjbGFzc0RhdGEuZGVmZW5jZUJvbnVzO1xyXG5cdFx0aWYgKGRhdGEuaGVhbHRoTWF4Qm9udXMgPT0gbnVsbCkgZGF0YS5oZWFsdGhNYXhCb251cyA9IGNsYXNzRGF0YS5oZWFsdGhNYXhCb251cztcclxuXHRcdGlmIChkYXRhLmVuZXJneU1heEJvbnVzID09IG51bGwpIGRhdGEuZW5lcmd5TWF4Qm9udXMgPSBjbGFzc0RhdGEuZW5lcmd5TWF4Qm9udXM7XHJcblx0XHRpZiAoZGF0YS5yYW5nZUJvbnVzID09IG51bGwpIGRhdGEucmFuZ2VCb251cyA9IGNsYXNzRGF0YS5yYW5nZUJvbnVzO1xyXG5cdFx0aWYgKGRhdGEuc3RhY2sgPT0gbnVsbCkgZGF0YS5zdGFjayA9IGNsYXNzRGF0YS5zdGFjaztcclxuXHJcblx0XHRzdXBlcihkYXRhLm1hcElkLCBkYXRhLngsIGRhdGEueSwgZGF0YS5zcHJpdGUpO1xyXG5cdFx0dGhpcy5vd25lciA9IGRhdGEub3duZXI7XHJcblx0XHR0aGlzLmlkID0gZGF0YS5pZDtcclxuXHRcdHRoaXMuaXRlbUNsYXNzID0gZGF0YS5pdGVtQ2xhc3M7XHJcblx0XHR0aGlzLnN0YWNrID0gZGF0YS5zdGFjaztcclxuXHRcdHRoaXMuc2xvdCA9IGRhdGEuc2xvdDtcclxuXHRcdHRoaXMueiA9IGRhdGEuejtcclxuXHRcdFxyXG5cdFx0dGhpcy5uYW1lID0gZGF0YS5uYW1lO1xyXG5cdFx0dGhpcy50eXBlID0gZGF0YS50eXBlO1xyXG5cdFx0dGhpcy5yZXVzYWJsZSA9IGRhdGEucmV1c2FibGU7XHJcblx0XHR0aGlzLmRhbWFnZUJvbnVzID0gZGF0YS5kYW1hZ2VCb251cztcclxuXHRcdHRoaXMuZGVmZW5jZUJvbnVzID0gZGF0YS5kZWZlbmNlQm9udXM7XHJcblx0XHR0aGlzLmhlYWx0aE1heEJvbnVzID0gZGF0YS5oZWFsdGhNYXhCb251cztcclxuXHRcdHRoaXMuZW5lcmd5TWF4Qm9udXMgPSBkYXRhLmVuZXJneU1heEJvbnVzO1xyXG5cdFx0dGhpcy5yYW5nZUJvbnVzID0gZGF0YS5yYW5nZUJvbnVzO1xyXG5cclxuXHRcdGlmIChkYXRhLm93bmVyID09PSAnbWFwJykge1xyXG5cdFx0XHRnYW1lLm1hcExpc3RbdGhpcy5tYXBJZF0uaXRlbXNbdGhpcy5pZF0gPSB0aGlzO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoZGF0YS5vd25lciA9PT0gJ3BsYXllcicpIHtcclxuXHRcdFx0Z2FtZS5wbGF5ZXJMaXN0W3RoaXMuaWRdLmludmVudG9yeVt0aGlzLnNsb3RdID0gdGhpcztcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKGRhdGEub3duZXIgPT09ICdib3QnKSB7XHJcblx0XHRcdGdhbWUubWFwTGlzdFt0aGlzLm1hcElkXS5ib3RzW3RoaXMuaWRdLmludmVudG9yeVt0aGlzLnNsb3RdID0gdGhpcztcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5nZXRQYWNrKCk7XHJcblx0fVxyXG5cclxuXHRnZXRQYWNrKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0aWQ6IHRoaXMuaWQsXHJcblx0XHRcdG1hcElkOiB0aGlzLm1hcElkLFxyXG5cdFx0XHR4OiB0aGlzLngsXHJcblx0XHRcdHk6IHRoaXMueSxcclxuXHRcdFx0ejogdGhpcy56LFxyXG5cdFx0XHRzbG90OiB0aGlzLnNsb3QsXHJcblx0XHRcdGl0ZW1DbGFzczogdGhpcy5pdGVtQ2xhc3MsXHJcblx0XHRcdHN0YWNrOiB0aGlzLnN0YWNrLFxyXG5cdFx0XHRuYW1lOiB0aGlzLm5hbWUsXHJcblx0XHRcdHNwcml0ZTogdGhpcy5zcHJpdGUsXHJcblx0XHRcdHR5cGU6IHRoaXMudHlwZSxcclxuXHRcdFx0cmV1c2FibGU6IHRoaXMucmV1c2FibGUsXHJcblx0XHRcdGRhbWFnZUJvbnVzOiB0aGlzLmRhbWFnZUJvbnVzLFxyXG5cdFx0XHRkZWZlbmNlQm9udXM6IHRoaXMuZGVmZW5jZUJvbnVzLFxyXG5cdFx0XHRoZWFsdGhNYXhCb251czogdGhpcy5oZWFsdGhNYXhCb251cyxcclxuXHRcdFx0ZW5lcmd5TWF4Qm9udXM6IHRoaXMuZW5lcmd5TWF4Qm9udXMsXHJcblx0XHRcdHJhbmdlQm9udXM6IHRoaXMucmFuZ2VCb251cyxcclxuXHRcdFx0aXNWaXNpYmxlOiB0aGlzLmlzVmlzaWJsZVxyXG5cdFx0fTtcclxuXHR9XHJcblx0XHJcblx0cmVtb3ZlKCkge1xyXG5cdFx0aWYgKHRoaXMub3duZXIgPT09ICdwbGF5ZXInKSB7XHJcblx0XHRcdGRlbGV0ZSBnYW1lLnBsYXllckxpc3RbdGhpcy5pZF0uaW52ZW50b3J5W3RoaXMuc2xvdF07XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmICh0aGlzLm93bmVyID09PSAnbWFwJykge1xyXG5cdFx0XHRkZWxldGUgZ2FtZS5tYXBMaXN0W3RoaXMubWFwSWRdLml0ZW1zW3RoaXMuaWRdO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAodGhpcy5vd25lciA9PT0gJ2JvdCcpIHtcclxuXHRcdFx0ZGVsZXRlIGdhbWUubWFwTGlzdFt0aGlzLm1hcElkXS5ib3RzW3RoaXMuaWRdLmludmVudG9yeVt0aGlzLnNsb3RdO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRpc0VxdWlwbWVudCgpIHtcclxuXHRcdGlmICh0aGlzLnR5cGUgPT09ICd3ZWFwb24nIHx8IHRoaXMudHlwZSA9PT0gJ3NoaWVsZCcgfHwgdGhpcy50eXBlID09PSAnYXJtb3VyJyB8fCB0aGlzLnR5cGUgPT09ICdoZWxtZXQnIHx8IHRoaXMudHlwZSA9PT0gJ3JpbmcnKSB7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGNhbkVxdWlwKHNsb3QpIHtcclxuXHRcdGlmIChzbG90ID09PSBjb25maWcuSU5WRU5UT1JZX1NJWkUpIHtcclxuXHRcdFx0aWYgKHRoaXMudHlwZSA9PT0gJ3dlYXBvbicpIHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoc2xvdCA9PT0gY29uZmlnLklOVkVOVE9SWV9TSVpFICsgMSkge1xyXG5cdFx0XHRpZiAodGhpcy50eXBlID09PSAnc2hpZWxkJykgcmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChzbG90ID09PSBjb25maWcuSU5WRU5UT1JZX1NJWkUgKyAyKSB7XHJcblx0XHRcdGlmICh0aGlzLnR5cGUgPT09ICdhcm1vdXInKSByZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKHNsb3QgPT09IGNvbmZpZy5JTlZFTlRPUllfU0laRSArIDMpIHtcclxuXHRcdFx0aWYgKHRoaXMudHlwZSA9PT0gJ2hlbG1ldCcpIHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoc2xvdCA9PT0gY29uZmlnLklOVkVOVE9SWV9TSVpFICsgNCkge1xyXG5cdFx0XHRpZiAodGhpcy50eXBlID09PSAncmluZycpIHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblxyXG5cdG1vdmVUb1BsYXllcihpZCwgc2xvdCkge1xyXG5cdFx0aWYgKGlkID09IG51bGwgfHwgc2xvdCA9PSBudWxsKSByZXR1cm47XHJcblxyXG5cdFx0dGhpcy5yZW1vdmUoKTtcclxuXHRcdHRoaXMub3duZXIgPSAncGxheWVyJztcclxuXHRcdHRoaXMuaWQgPSBpZDtcclxuXHRcdHRoaXMuc2xvdCA9IHNsb3Q7XHJcblx0XHRnYW1lLnBsYXllckxpc3RbdGhpcy5pZF0uaW52ZW50b3J5W3RoaXMuc2xvdF0gPSB0aGlzO1xyXG5cdH1cclxuXHJcblx0bW92ZVRvTWFwKG1hcElkLCB4LCB5KSB7XHJcblx0XHRpZiAobWFwSWQgPT0gbnVsbCB8fCB4ID09IG51bGwgfHwgeSA9PSBudWxsKSByZXR1cm47XHJcblxyXG5cdFx0dGhpcy5yZW1vdmUoKTtcclxuXHRcdHRoaXMub3duZXIgPSAnbWFwJztcclxuXHRcdHRoaXMubWFwSWQgPSBtYXBJZDtcclxuXHRcdHRoaXMuaWQgPSB1dGlsLmZpcnN0RW1wdHlJbmRleChnYW1lLm1hcExpc3RbdGhpcy5tYXBJZF0uaXRlbXMpO1xyXG5cdFx0dGhpcy54ID0geDtcclxuXHRcdHRoaXMueSA9IHk7XHJcblx0XHRnYW1lLm1hcExpc3RbdGhpcy5tYXBJZF0uaXRlbXNbdGhpcy5pZF0gPSB0aGlzO1xyXG5cdH1cclxuXHJcblx0bW92ZVRvQm90KG1hcElkLCBpZCwgc2xvdCkge1xyXG5cdFx0aWYgKG1hcElkID09IG51bGwgfHwgaWQgPT0gbnVsbCB8fCBzbG90ID09IG51bGwpIHJldHVybjtcclxuXHJcblx0XHR0aGlzLnJlbW92ZSgpO1xyXG5cdFx0dGhpcy5vd25lciA9ICdib3QnO1xyXG5cdFx0dGhpcy5tYXBJZCA9IG1hcElkO1xyXG5cdFx0dGhpcy5pZCA9IGlkO1xyXG5cdFx0dGhpcy5zbG90ID0gc2xvdDtcclxuXHRcdGdhbWUubWFwTGlzdFt0aGlzLm1hcElkXS5ib3RzW3RoaXMuaWRdLmludmVudG9yeVt0aGlzLnNsb3RdID0gdGhpcztcclxuXHR9XHJcbn1cclxuIiwiaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9jb25maWcuanMnO1xyXG5pbXBvcnQgdXRpbCBmcm9tICcuLi91dGlsLmpzJztcclxuaW1wb3J0IFRpbGUgZnJvbSAnLi90aWxlLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hcCB7XHJcblx0Y29uc3RydWN0b3IoaWQsIGRhdGEpIHtcclxuXHRcdHRoaXMuaWQgPSBpZDtcclxuXHJcblx0XHR0aGlzLm5hbWUgPSBkYXRhLm5hbWU7XHJcblx0XHR0aGlzLmRyb3BDaGFuY2UgPSB1dGlsLmNsYW1wKGRhdGEuZHJvcENoYW5jZSwgMCwgMTAwKTtcclxuXHRcdC8vdGhpcy5kcm9wQ2hhbmNlID0gMCA9IDAlIGNoYW5jZSB0byBkcm9wIGl0ZW1zIGluIGludmVudG9yeSAoZHJvcCBub3RoaW5nKSwgMTAwID0gMTAwJSBjaGFuY2UgdG8gZHJvcCAoZHJvcCBldmVyeXRoaW5nKVxyXG5cdFx0dGhpcy5kcm9wQW1vdW50RVEgPSB1dGlsLmNsYW1wKGRhdGEuZHJvcEFtb3VudEVRLCAwLCBjb25maWcuRVFVSVBNRU5UX1NJWkUpO1xyXG5cdFx0Ly90aGlzLmRyb3BBbW91bnRFUSA9IG51bWJlciBvZiBlcXVpcHBlZCBpdGVtcyB0aGUgcGxheWVyIHdpbGwgZHJvcCBvbiBkZWF0aC4gZHJvcEVRID0gRVFVSVBNRU5UX1NJWkUgPSBkcm9wIGFsbCBlcXVpcG1lbnRcclxuXHRcdFxyXG5cdFx0dGhpcy5pdGVtcyA9IGRhdGEuaXRlbXM7XHJcblx0XHR0aGlzLmJvdHMgPSBkYXRhLmJvdHM7XHJcblx0XHR0aGlzLmVmZmVjdHMgPSBkYXRhLmVmZmVjdHM7XHJcblx0XHR0aGlzLnRleHRzID0gZGF0YS50ZXh0cztcclxuXHRcdFxyXG5cdFx0dGhpcy50aWxlcyA9IFtdO1xyXG5cdFx0Zm9yIChsZXQgeSA9IDA7IHkgPCBjb25maWcuTUFQX0NPTFVNTlM7IHkrKykge1xyXG5cdFx0XHR0aGlzLnRpbGVzW3ldID0gW107XHJcblx0XHRcdGZvciAobGV0IHggPSAwOyB4IDwgY29uZmlnLk1BUF9ST1dTOyB4KyspIHtcclxuXHRcdFx0XHRsZXQgdGlsZURhdGEgPSB0aGlzLmdldFRpbGVEYXRhKGRhdGEsICh5ICogY29uZmlnLk1BUF9DT0xVTU5TKSArIHgpO1xyXG5cdFx0XHRcdHRoaXMudGlsZXNbeV1beF0gPSBuZXcgVGlsZSh0aWxlRGF0YSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0dXBsb2FkKCkge1xyXG5cdFx0Z2FtZS5tYXBEYXRhW3RoaXMuaWRdID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoJy4vc2VydmVyL2RhdGEvbWFwLmpzb24nLCAndXRmOCcpKVt0aGlzLmlkXTtcclxuXHRcdGZvciAobGV0IHkgPSAwOyB5IDwgY29uZmlnLk1BUF9ST1dTOyB5KyspIHtcclxuXHRcdFx0Zm9yIChsZXQgeCA9IDA7IHggPCBjb25maWcuTUFQX0NPTFVNTlM7IHgrKykge1xyXG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY29uZmlnLk1BUF9MQVlFUlM7IGkrKykge1xyXG5cdFx0XHRcdFx0dGhpcy50aWxlc1t5XVt4XS5sYXllcltpXSA9IGdhbWUubWFwRGF0YVt0aGlzLmlkXS50aWxlc1tpXVsoeSAqIGNvbmZpZy5NQVBfQ09MVU1OUykgKyB4XTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGdhbWUucGxheWVyTGlzdC5mb3JFYWNoKChwbGF5ZXIpID0+IHtcclxuXHRcdFx0aWYgKHBsYXllci5tYXBJZCA9PT0gdGhpcy5pZCkge1xyXG5cdFx0XHRcdHBsYXllci5sb2FkTWFwKCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHRcclxuXHR1cGRhdGUoZGVsdGEpIHtcclxuXHRcdGxldCBwYWNrID0ge1xyXG5cdFx0XHRuYW1lOiB0aGlzLm5hbWUsXHJcblx0XHRcdGl0ZW1zOiBbXSxcclxuXHRcdFx0Ym90czogW10sXHJcblx0XHRcdGVmZmVjdHM6IFtdLFxyXG5cdFx0XHR0ZXh0czogW11cclxuXHRcdH07XHJcblx0XHRcclxuXHRcdHRoaXMuaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG5cdFx0XHRwYWNrLml0ZW1zW2l0ZW0uaWRdID0gaXRlbS51cGRhdGUoZGVsdGEpO1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLmJvdHMuZm9yRWFjaCgoYm90KSA9PiB7XHJcblx0XHRcdHBhY2suYm90c1tib3QuaWRdID0gYm90LnVwZGF0ZShkZWx0YSk7XHJcblx0XHR9KTtcclxuXHRcdHRoaXMuZWZmZWN0cy5mb3JFYWNoKChlZmZlY3QpID0+IHtcclxuXHRcdFx0cGFjay5lZmZlY3RzW2VmZmVjdC5pZF0gPSBlZmZlY3QudXBkYXRlKGRlbHRhKTtcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy50ZXh0cy5mb3JFYWNoKCh0ZXh0KSA9PiB7XHJcblx0XHRcdHBhY2sudGV4dHNbdGV4dC5pZF0gPSB0ZXh0LnVwZGF0ZShkZWx0YSk7XHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdFx0cmV0dXJuIHBhY2s7XHJcblx0fVxyXG5cdFxyXG5cdGdldFBhY2soKSB7XHJcblx0XHRsZXQgbWFwUGFjayA9IHtcclxuXHRcdFx0bmFtZTogdGhpcy5uYW1lLFxyXG5cdFx0XHR0aWxlczogdGhpcy5nZXRUaWxlUGFjaygpLFxyXG5cdFx0XHRib3RzOiBbXSxcclxuXHRcdFx0aXRlbXM6IFtdLFxyXG5cdFx0XHRlZmZlY3RzOiBbXSxcclxuXHRcdFx0dGV4dHM6IFtdXHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuYm90cy5mb3JFYWNoKChib3QpID0+IHtcclxuXHRcdFx0bWFwUGFjay5ib3RzW2JvdC5pZF0gPSBib3QuZ2V0UGFjaygpO1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLml0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcclxuXHRcdFx0bWFwUGFjay5pdGVtc1tpdGVtLmlkXSA9IGl0ZW0uZ2V0UGFjaygpO1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLmVmZmVjdHMuZm9yRWFjaCgoZWZmZWN0KSA9PiB7XHJcblx0XHRcdG1hcFBhY2suZWZmZWN0c1tlZmZlY3QuaWRdID0gZWZmZWN0LmdldFBhY2soKTtcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy50ZXh0cy5mb3JFYWNoKCh0ZXh0KSA9PiB7XHJcblx0XHRcdG1hcFBhY2sudGV4dHNbdGV4dC5pZF0gPSB0ZXh0LmdldFBhY2soKTtcclxuXHRcdH0pO1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gbWFwUGFjaztcclxuXHR9XHJcblx0XHJcblx0Z2V0VGlsZVBhY2soKSB7XHJcblx0XHRsZXQgdGlsZVBhY2sgPSBbXTtcclxuXHJcblx0XHRmb3IgKGxldCB5ID0gMDsgeSA8IGNvbmZpZy5NQVBfUk9XUzsgeSsrKSB7XHJcblx0XHRcdHRpbGVQYWNrW3ldID0gW107XHJcblx0XHRcdGZvciAobGV0IHggPSAwOyB4IDwgY29uZmlnLk1BUF9DT0xVTU5TOyB4KyspIHtcclxuXHRcdFx0XHR0aWxlUGFja1t5XVt4XSA9IHRoaXMudGlsZXNbeV1beF0uZ2V0UGFjaygpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRpbGVQYWNrO1xyXG5cdH1cclxuXHJcblx0Z2V0VGlsZURhdGEoZGF0YSwgaW5kZXggPSAwKSB7XHJcblx0XHRpZiAoIWRhdGEpIHJldHVybjtcclxuXHJcblx0XHRsZXQgdGlsZURhdGEgPSB7XHJcblx0XHRcdGxheWVyOiBbXSxcclxuXHRcdFx0d2FsbDogZGF0YS50aWxlcy53YWxsW2luZGV4XSxcclxuXHRcdFx0Ly9jYW5BdHRhY2s6IGRhdGEuY2FuQXR0YWNrW2luZGV4XSxcclxuXHRcdFx0Ly9kYW1hZ2U6IGRhdGEuZGFtYWdlW2luZGV4XSxcclxuXHRcdFx0Ly9kZWZlbmNlOiBkYXRhLmRlZmVuY2VbaW5kZXhdLFxyXG5cdFx0XHQvL2hlYWx0aE1heDogZGF0YS5oZWFsdGhNYXhbaW5kZXhdLFxyXG5cdFx0XHQvL3dhcnBNYXA6IGRhdGEud2FycE1hcFtpbmRleF0sXHJcblx0XHRcdC8vd2FycFg6IGRhdGEud2FycFhbaW5kZXhdLFxyXG5cdFx0XHQvL3dhcnBZOiBkYXRhLndhcnBZW2luZGV4XVxyXG5cdFx0fTtcclxuXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGNvbmZpZy5NQVBfTEFZRVJTOyBpKyspIHtcclxuXHRcdFx0dGlsZURhdGEubGF5ZXJbaV0gPSBkYXRhLnRpbGVzLmxheWVyW2ldW2luZGV4XTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGlsZURhdGE7XHJcblx0fTtcclxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIE1lc3NhZ2Uge1xyXG5cdGNvbnN0cnVjdG9yKHNlbmRlcklkLCBtZXNzYWdlLCB0eXBlLCBtYXBJZCwgaWQsIGNvbG91cikge1xyXG5cdFx0dGhpcy5zZW5kZXJJZCA9IHNlbmRlcklkOyAvLyBudWxsID0gc2VydmVyXHJcblx0XHR0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xyXG5cdFx0dGhpcy50eXBlID0gdHlwZTtcclxuXHRcdHRoaXMubWFwSWQgPSBtYXBJZDtcclxuXHRcdHRoaXMuaWQgPSBpZDtcclxuXHRcdHRoaXMuY29sb3VyID0gY29sb3VyO1xyXG5cdH1cclxufSIsImltcG9ydCBkYiBmcm9tICcuLi9kYi5qcyc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4uL2dhbWUuanMnO1xyXG5pbXBvcnQgQWN0b3IgZnJvbSAnLi9hY3Rvci5qcyc7XHJcblxyXG4vLyBBIFBsYXllciBpcyBhbiBBY3RvciB3aGljaCB0YWtlcyBpbnB1dCBmcm9tIGEgY2xpZW50XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF5ZXIgZXh0ZW5kcyBBY3RvciB7XHJcblx0Y29uc3RydWN0b3IoaWQpIHtcclxuXHRcdGxldCBkYXRhID0gZGIuZ2V0UGxheWVyRGF0YShpZCk7XHJcblxyXG5cdFx0c3VwZXIoZGF0YS5tYXBJZCwgZGF0YS54LCBkYXRhLnksIGRhdGEubmFtZSwgZGF0YS5zcHJpdGUpO1xyXG5cdFx0dGhpcy5jb250cm9sbGVyID0gJ3BsYXllcic7XHJcblx0XHR0aGlzLmlkID0gaWQ7XHJcblx0XHR0aGlzLmFkbWluQWNjZXNzID0gZGF0YS5hZG1pbkFjY2VzcztcclxuXHJcblx0XHR0aGlzLmRhbWFnZUJhc2UgPSBkYXRhLmRhbWFnZUJhc2U7XHRcdFx0XHQvLyBtaW5pbXVtIGRhbWFnZSBhIHBsYXllciBjYW4gaGF2ZVxyXG5cdFx0dGhpcy5kZWZlbmNlQmFzZSA9IGRhdGEuZGVmZW5jZUJhc2U7XHRcdFx0Ly8gbWluaW11bSBkZWZlbmNlIGEgcGxheWVyIGNhbiBoYXZlXHJcblx0XHR0aGlzLmhlYWx0aE1heEJhc2UgPSBkYXRhLmhlYWx0aE1heEJhc2U7XHQvLyBtYXggaGVhbHRoIHdpdGhvdXQgYm9udXNlc1xyXG5cdFx0dGhpcy5lbmVyZ3lNYXhCYXNlID0gZGF0YS5lbmVyZ3lNYXhCYXNlO1x0Ly8gbWF4IGVuZXJneSB3aXRob3V0IGJvbnVzZXNcclxuXHRcdHRoaXMuY2FsY1N0YXRzKCk7XHJcblx0XHR0aGlzLnJlc3RvcmUoKTtcclxuXHJcblx0XHR0aGlzLnNlbGVjdGVkID0gbnVsbDtcclxuXHRcdHRoaXMuaW5wdXQgPSB7XHJcblx0XHRcdGRpcmVjdGlvbjogbnVsbCxcclxuXHRcdFx0cnVuOiBmYWxzZSxcclxuXHRcdFx0cGlja3VwOiBmYWxzZSxcclxuXHRcdFx0YXR0YWNrOiBmYWxzZVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0bG9hZE1hcCgpIHtcclxuXHRcdFxyXG5cdH1cclxuXHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHRzdXBlci51cGRhdGUoZGVsdGEpO1x0XHQvLyBEZWZhdWx0IEFjdG9yIFVwZGF0ZVxyXG5cdFx0XHJcblx0XHRpZiAoIXRoaXMuaXNEZWFkKSB7XHJcblx0XHRcdC8vIENoZWNrIGZvciBBdGFjayBJbnB1dFxyXG5cdFx0XHRpZiAodGhpcy5pbnB1dC5hdHRhY2sgJiYgdGhpcy5hdHRhY2tUaW1lciA9PT0gMCkge1xyXG5cdFx0XHRcdHRoaXMuYXR0YWNrKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdC8vIENoZWNrIGZvciBNb3ZlbWVudCBJbnB1dFxyXG5cdFx0XHRpZiAoIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5pbnB1dC5kaXJlY3Rpb24pIHtcclxuXHRcdFx0XHRcdC8vIENoZWNrIGZvciBSdW4gSW5wdXRcclxuXHRcdFx0XHRcdGlmICh0aGlzLmlucHV0LnJ1bikge1xyXG5cdFx0XHRcdFx0XHRpZiAodGhpcy5lbmVyZ3kgPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5pc1J1bm5pbmcgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuaXNSdW5uaW5nID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmlzUnVubmluZyA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKHRoaXMuaW5wdXQuZGlyZWN0aW9uKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIHRoaXMuZ2V0UGFjaygpO1xyXG5cdH1cclxuXHRcclxuXHRnZXRQYWNrKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0aWQ6IHRoaXMuaWQsXHJcblx0XHRcdG5hbWU6IHRoaXMubmFtZSxcclxuXHRcdFx0c3ByaXRlOiB0aGlzLnNwcml0ZSxcclxuXHRcdFx0ZGlyZWN0aW9uOiB0aGlzLmRpcmVjdGlvbixcclxuXHRcdFx0bWFwSWQ6IHRoaXMubWFwSWQsXHJcblx0XHRcdHg6IHRoaXMuc3RhcnRYLFxyXG5cdFx0XHR5OiB0aGlzLnN0YXJ0WSxcclxuXHRcdFx0ejogdGhpcy56LFxyXG5cdFx0XHRkZXN0aW5hdGlvblg6IHRoaXMuZGVzdGluYXRpb25YLFxyXG5cdFx0XHRkZXN0aW5hdGlvblk6IHRoaXMuZGVzdGluYXRpb25ZLFxyXG5cdFx0XHRsZXJwOiB0aGlzLmxlcnAsXHJcblx0XHRcdGlzUnVubmluZzogdGhpcy5pc1J1bm5pbmcsXHJcblx0XHRcdGlzQXR0YWNraW5nOiB0aGlzLmlzQXR0YWNraW5nLFxyXG5cdFx0XHRpc0RlYWQ6IHRoaXMuaXNEZWFkLFxyXG5cdFx0XHRpc1Zpc2libGU6IHRoaXMuaXNWaXNpYmxlXHJcblx0XHR9O1xyXG5cdH1cclxuXHRcclxuXHRnZXRQcml2YXRlUGFjaygpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGlkOiB0aGlzLmlkLFxyXG5cdFx0XHRoZWFsdGg6IHRoaXMuaGVhbHRoLFxyXG5cdFx0XHRoZWFsdGhNYXg6IHRoaXMuaGVhbHRoTWF4LFxyXG5cdFx0XHRlbmVyZ3k6IHRoaXMuZW5lcmd5LFxyXG5cdFx0XHRlbmVyZ3lNYXg6IHRoaXMuZW5lcmd5TWF4LFxyXG5cdFx0XHRtb3ZlU3BlZWQ6IHRoaXMubW92ZVNwZWVkLFxyXG5cdFx0XHRhdHRhY2tTcGVlZDogdGhpcy5hdHRhY2tTcGVlZCxcclxuXHRcdFx0YXR0YWNrVGltZXI6IHRoaXMuYXR0YWNrVGltZXIsXHJcblx0XHRcdGludmVudG9yeTogdGhpcy5nZXRJbnZlbnRvcnlQYWNrKClcclxuXHRcdH07XHJcblx0fVxyXG5cdFxyXG5cdGNoZWNrQWRtaW4oYWNjZXNzID0gMSkge1xyXG5cdFx0aWYgKGFjY2VzcyA8IDEpIGFjY2VzcyA9IDE7XHJcblx0XHRyZXR1cm4gKHRoaXMuYWRtaW5BY2Nlc3MgPj0gYWNjZXNzKTtcclxuXHR9XHJcblxyXG5cdG9uSW5wdXQoZGF0YSkge1xyXG5cdFx0c3dpdGNoIChkYXRhLmlucHV0KSB7XHJcblx0XHRcdGNhc2UgbnVsbDpcclxuXHRcdFx0Y2FzZSAnbW92ZSc6IHRoaXMuaW5wdXQuZGlyZWN0aW9uID0gZGF0YS5kaXJlY3Rpb247XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdydW4nOiB0aGlzLmlucHV0LnJ1biA9IGRhdGEuc3RhdGU7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdwaWNrdXAnOlxyXG5cdFx0XHRcdGlmICghdGhpcy5pbnB1dC5waWNrdXAgJiYgZGF0YS5zdGF0ZSkge1xyXG5cdFx0XHRcdFx0dGhpcy5waWNrVXAoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5pbnB1dC5waWNrdXAgPSBkYXRhLnN0YXRlO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnYXR0YWNrJzpcclxuXHRcdFx0XHR0aGlzLmlucHV0LmF0dGFjayA9IGRhdGEuc3RhdGU7XHJcblx0XHRcdFx0aWYgKCF0aGlzLmlzRGVhZCkgdGhpcy5hdHRhY2soMSwgdGhpcy5kaXJlY3Rpb24pO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnZG91YmxlQ2xpY2tJdGVtJzpcclxuXHRcdFx0XHRpZiAodGhpcy5pbnZlbnRvcnlbZGF0YS5zbG90XSkge1xyXG5cdFx0XHRcdFx0aWYgKCF0aGlzLmlzRGVhZCkgdGhpcy51c2VJdGVtKGRhdGEuc2xvdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAncmlnaHRDbGlja0l0ZW0nOlxyXG5cdFx0XHRcdGlmICh0aGlzLmludmVudG9yeVtkYXRhLnNsb3RdKSB7XHJcblx0XHRcdFx0XHRpZiAoIXRoaXMuaXNEZWFkKSB0aGlzLmRyb3BJdGVtKGRhdGEuc2xvdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnZHJhZ1N0b3BHYW1lJzpcclxuXHRcdFx0XHRpZiAodGhpcy5pbnZlbnRvcnlbZGF0YS5zbG90XSkge1xyXG5cdFx0XHRcdFx0aWYgKCF0aGlzLmlzRGVhZCkgdGhpcy5kcm9wSXRlbShkYXRhLnNsb3QpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ2RyYWdTdG9wSW52ZW50b3J5JzpcclxuXHRcdFx0Y2FzZSAnZHJhZ1N0b3BFcXVpcG1lbnQnOlxyXG5cdFx0XHRcdGlmICh0aGlzLmludmVudG9yeVtkYXRhLnNsb3RdKSB7XHJcblx0XHRcdFx0XHRpZiAoIXRoaXMuaXNEZWFkKSB0aGlzLm1vdmVJdGVtVG9TbG90KGRhdGEuc2xvdCwgZGF0YS5uZXdTbG90KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdzZXJ2ZXJDaGF0JzogZ2FtZS5zZW5kTWVzc2FnZUdsb2JhbCh0aGlzLmlkLCBgJHt0aGlzLm5hbWV9IHllbGxzLCBcIiR7ZGF0YS5tZXNzYWdlfVwiYCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdtYXBDaGF0JzogZ2FtZS5zZW5kTWVzc2FnZU1hcCh0aGlzLmlkLCB0aGlzLm1hcElkLCBgJHt0aGlzLm5hbWV9IHNheXMsIFwiJHtkYXRhLm1lc3NhZ2V9XCJgKTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ3BsYXllckNoYXQnOlxyXG5cdFx0XHRcdGxldCB0YXJnZXQgPSB0aGlzLnBsYXllckxpc3RbZGF0YS50YXJnZXRJZF07XHJcblx0XHRcdFx0aWYgKHRhcmdldCkge1xyXG5cdFx0XHRcdFx0Z2FtZS5zZW5kTWVzc2FnZVBsYXllcih0aGlzLmlkLCB0YXJnZXQuaWQsIGAke3RoaXMubmFtZX0gd2hpc3BlcnMsIFwiJHtkYXRhLm1lc3NhZ2V9XCJgKTtcclxuXHRcdFx0XHRcdGdhbWUuc2VuZE1lc3NhZ2VQbGF5ZXIodGhpcy5pZCwgdGhpcy5pZCwgYFlvdSB3aGlzcGVyIHRvICR7dGFyZ2V0Lm5hbWV9LCBcIiR7ZGF0YS5tZXNzYWdlfVwiYCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHJcblx0XHRcdC8vIEdvZCBJbnB1dHNcclxuXHRcdFx0Y2FzZSAnc3Bhd25JdGVtJzpcclxuXHRcdFx0XHRpZiAodGhpcy5jaGVja0FkbWluKDIpKSB7XHJcblx0XHRcdFx0XHRnYW1lLnNwYXduTWFwSXRlbShkYXRhLm1hcElkLCBkYXRhLngsIGRhdGEueSwgZGF0YS50eXBlLCBkYXRhLnN0YWNrKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRnYW1lLnNlbmRHYW1lSW5mb1BsYXllcih0aGlzLmlkLCBgWW91IGRvbid0IGhhdmUgYWNjZXNzIHRvIHRoYXQgY29tbWFuZC5gKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICd1cGxvYWRNYXAnOlxyXG5cdFx0XHRcdGlmICh0aGlzLmNoZWNrQWRtaW4oMikpIHtcclxuXHRcdFx0XHRcdGdhbWUubWFwTGlzdFtkYXRhLm1hcElkXS51cGxvYWQoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRnYW1lLnNlbmRHYW1lSW5mb1BsYXllcih0aGlzLmlkLCBgWW91IGRvbid0IGhhdmUgYWNjZXNzIHRvIHRoYXQgY29tbWFuZC5gKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cGlja1VwKCkge1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBnYW1lLm1hcExpc3RbdGhpcy5tYXBJZF0uaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0bGV0IGl0ZW0gPSBnYW1lLm1hcExpc3RbdGhpcy5tYXBJZF0uaXRlbXNbaV07XHJcblx0XHRcdGlmIChpdGVtICYmIGl0ZW0ueCA9PT0gdGhpcy54ICYmIGl0ZW0ueSA9PT0gdGhpcy55KSB7XHJcblx0XHRcdFx0bGV0IHNsb3QgPSB0aGlzLmdldE1hcEl0ZW0oaXRlbS5tYXBJZCwgaXRlbS5pZCk7XHJcblx0XHRcdFx0aWYgKHNsb3QgIT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0aXRlbS5tb3ZlVG9QbGF5ZXIodGhpcy5pZCwgc2xvdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly8gSW52ZW50b3J5IGZ1bGxcclxuXHRcdFx0XHRcdGdhbWUuc2VuZEdhbWVJbmZvUGxheWVyKHRoaXMuaWQsIFwiWW91ciBpbnZlbnRvcnkgaXMgZnVsbC5cIik7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJlc3Bhd24oKSB7XHJcblx0XHRzdXBlci5yZXNwYXduKCk7XHJcblx0XHRnYW1lLnNlbmRHYW1lSW5mb1BsYXllcih0aGlzLmlkLCBcIlRoZSBBbmdlbCBvZiBNZXJjeSBoYXMgc2F2ZWQgeW91ciBzb3VsLlwiKTtcclxuXHR9XHJcbn0iLCJpbXBvcnQgZ2FtZSBmcm9tICcuLi9nYW1lLmpzJztcclxuaW1wb3J0IHV0aWwgZnJvbSAnLi4vdXRpbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXh0IHtcclxuXHRjb25zdHJ1Y3RvcihtYXBJZCwgeCwgeSwgbWVzc2FnZSwgY29sb3VyID0gJyMwMDAwMDAnLCBkaXNwbGF5VGltZSA9IDIsIHZlbFggPSAwLCB2ZWxZID0gMCkge1xyXG5cdFx0dGhpcy5tYXBJZCA9IG1hcElkO1xyXG5cdFx0dGhpcy54ID0geDtcclxuXHRcdHRoaXMueSA9IHk7XHJcblx0XHR0aGlzLnZlbFggPSB2ZWxYO1xyXG5cdFx0dGhpcy52ZWxZID0gdmVsWTtcclxuXHRcdHRoaXMubGVycFggPSAwO1xyXG5cdFx0dGhpcy5sZXJwWSA9IDA7XHJcblxyXG5cdFx0dGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcclxuXHRcdHRoaXMuY29sb3VyID0gY29sb3VyO1xyXG5cdFx0dGhpcy5kaXNwbGF5VGltZSA9IGRpc3BsYXlUaW1lO1xyXG5cdFx0dGhpcy50aW1lciA9IDA7XHJcblxyXG5cdFx0dGhpcy5pZCA9IHV0aWwuZmlyc3RFbXB0eUluZGV4KGdhbWUubWFwTGlzdFt0aGlzLm1hcElkXS50ZXh0cyk7XHJcblx0XHRnYW1lLm1hcExpc3RbdGhpcy5tYXBJZF0udGV4dHNbdGhpcy5pZF0gPSB0aGlzO1xyXG5cdH1cclxuXHRcclxuXHR1cGRhdGUoZGVsdGEpIHtcclxuXHRcdHRoaXMudGltZXIgKz0gZGVsdGE7XHJcblx0XHRpZiAodGhpcy5kaXNwbGF5VGltZSA+IDAgJiYgdGhpcy50aW1lciA+IHRoaXMuZGlzcGxheVRpbWUpIHtcclxuXHRcdFx0dGhpcy5yZW1vdmUoKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLmxlcnBYICs9IGRlbHRhICogdGhpcy52ZWxYO1xyXG5cdFx0dGhpcy5sZXJwWSArPSBkZWx0YSAqIHRoaXMudmVsWTtcclxuXHJcblx0XHRpZiAodGhpcy5sZXJwWCA8IC0xKSB7XHJcblx0XHRcdHRoaXMubGVycFgrKztcclxuXHRcdFx0dGhpcy54LS07XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmICh0aGlzLmxlcnBYID4gMSkge1xyXG5cdFx0XHR0aGlzLmxlcnBYLS07XHJcblx0XHRcdHRoaXMueCsrO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLmxlcnBZIDwgLTEpIHtcclxuXHRcdFx0dGhpcy5sZXJwWSsrO1xyXG5cdFx0XHR0aGlzLnktLTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKHRoaXMubGVycFkgPiAxKSB7XHJcblx0XHRcdHRoaXMubGVycFktLTtcclxuXHRcdFx0dGhpcy55Kys7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiB0aGlzLmdldFBhY2soKTtcclxuXHR9XHJcblx0XHJcblx0Z2V0UGFjaygpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGlkOiB0aGlzLmlkLFxyXG5cdFx0XHRtYXBJZDogdGhpcy5tYXBJZCxcclxuXHRcdFx0eDogdGhpcy54LFxyXG5cdFx0XHR5OiB0aGlzLnksXHJcblx0XHRcdGxlcnBYOiB0aGlzLmxlcnBYLFxyXG5cdFx0XHRsZXJwWTogdGhpcy5sZXJwWSxcclxuXHRcdFx0bWVzc2FnZTogdGhpcy5tZXNzYWdlLFxyXG5cdFx0XHRjb2xvdXI6IHRoaXMuY29sb3VyXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0cmVtb3ZlKCkge1xyXG5cdFx0ZGVsZXRlIGdhbWUubWFwTGlzdFt0aGlzLm1hcElkXS50ZXh0c1t0aGlzLmlkXTtcclxuXHR9XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGlsZSB7XHJcblx0Y29uc3RydWN0b3IoZGF0YSkge1xyXG5cdFx0dGhpcy5sYXllciA9IGRhdGEubGF5ZXI7XHJcbiAgICB0aGlzLndhbGwgPSBkYXRhLndhbGw7XHJcbiAgICB0aGlzLmNhbkF0dGFjayA9IGRhdGEuY2FuQXR0YWNrO1xyXG4gICAgdGhpcy5kYW1hZ2UgPSBkYXRhLmRhbWFnZTtcclxuXHRcdHRoaXMuZGVmZW5jZSA9IGRhdGEuZGVmZW5jZTtcclxuXHRcdHRoaXMuaGVhbHRoTWF4ID0gZGF0YS5oZWFsdGhNYXg7XHJcblx0XHR0aGlzLmhlYWx0aCA9IHRoaXMuaGVhbHRoTWF4O1xyXG5cclxuXHRcdHRoaXMud2FycE1hcCA9IGRhdGEud2FycE1hcDtcclxuXHRcdHRoaXMud2FycFggPSBkYXRhLndhcnBYO1xyXG5cdFx0dGhpcy53YXJwWSA9IGRhdGEud2FycFk7XHJcbiAgfVxyXG5cclxuXHRvbldhbGsoKSB7XHJcblx0XHQvLyBSdW4gTWFwV2FsayNfeF95IHNjcmlwdFxyXG4gIH1cclxuICBcclxuXHRvbkNsaWNrKCkge1xyXG5cdFx0Ly8gUnVuIE1hcENsaWNrI194X3kgc2NyaXB0XHJcbiAgfVxyXG4gIFxyXG5cdG9uQXR0YWNrKCkge1xyXG5cdFx0Ly8gUnVuIE1hcEF0dGFjayNfeF95IHNjcmlwdFxyXG4gIH1cclxuICBcclxuICBnZXRQYWNrKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbGF5ZXI6IHRoaXMubGF5ZXIsXHJcbiAgICAgIHdhbGw6IHRoaXMud2FsbCxcclxuICAgICAgY2FuQXR0YWNrOiB0aGlzLmNhbkF0dGFjayxcclxuICAgICAgZGFtYWdlOiB0aGlzLmRhbWFnZSxcclxuICAgICAgZGVmZW5jZTogdGhpcy5kZWZlbmNlLFxyXG4gICAgICBoZWFsdGhNYXg6IHRoaXMuaGVhbHRoTWF4LFxyXG4gICAgICB3YXJwTWFwOiB0aGlzLndhcnBNYXAsXHJcbiAgICAgIHdhcnBYOiB0aGlzLndhcnBYLFxyXG4gICAgICB3YXJwWTogdGhpcy53YXJwWVxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuIiwiY29uc3QgY29uZmlnID0ge307XHJcblxyXG5jb25maWcuUE9SVCA9IDIwMDA7XHJcbmNvbmZpZy5GUkFNRVJBVEUgPSAxMDAwIC8gNjA7XHJcbmNvbmZpZy5CQUNLVVBfVElNRSA9IDU7XHJcblxyXG5jb25maWcuTUFQX0xBWUVSUyA9IDY7XHJcbmNvbmZpZy5NQVBfQ09MVU1OUyA9IDEyO1xyXG5jb25maWcuTUFQX1JPV1MgPSAxMjtcclxuXHJcbmNvbmZpZy5NQVhfTUFQUyA9IDEwO1xyXG5jb25maWcuTUFYX1VTRVJTID0gMTAwO1xyXG5jb25maWcuTUFYX1NQUklURVMgPSAxMztcclxuY29uZmlnLk1BWF9FRkZFQ1RTID0gNzA7XHJcblxyXG5jb25maWcuTUFYX0hFQUxUSF9CQVNFID0gMjAwO1xyXG5jb25maWcuTUFYX0hFQUxUSF9CT05VUyA9IDU1O1xyXG5jb25maWcuTUFYX0VORVJHWV9CQVNFID0gMjAwO1xyXG5jb25maWcuTUFYX0VORVJHWV9CT05VUyA9IDU1O1xyXG5cclxuY29uZmlnLklOVkVOVE9SWV9TSVpFID0gMjA7XHJcbmNvbmZpZy5FUVVJUE1FTlRfU0laRSA9IDU7XHJcblxyXG5jb25maWcuU1RBUlRfTUFQID0gMTtcclxuY29uZmlnLlNUQVJUX1ggPSA1O1xyXG5jb25maWcuU1RBUlRfWSA9IDU7XHJcbmNvbmZpZy5TVEFSVF9OQU1FID0gJ05ldyBQbGF5ZXInO1xyXG5jb25maWcuU1RBUlRfU1BSSVRFID0gMTtcclxuY29uZmlnLlNUQVJUX0RBTUFHRSA9IDI7XHJcbmNvbmZpZy5TVEFSVF9ERUZFTkNFID0gMDtcclxuY29uZmlnLlNUQVJUX0hFQUxUSF9NQVggPSAyMDtcclxuY29uZmlnLlNUQVJUX0VORVJHWV9NQVggPSAxMDtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNvbmZpZztcclxuIiwiaW1wb3J0IG1vbmdvanMgZnJvbSBcIm1vbmdvanNcIjtcclxuaW1wb3J0IGNvbmZpZyBmcm9tIFwiLi9jb25maWcuanNcIjtcclxuXHJcbmNvbnN0IG1vbmdvID0gbW9uZ29qcygnbG9jYWxob3N0OjI3MDE3L29keXNzZXknLCBbJ2FjY291bnRzJywgJ3BsYXllcnMnLCAnbWFwcycsICdpdGVtcycsICdib3RzJ10pO1xyXG5cclxuY2xhc3MgRGF0YWJhc2Uge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgLy8gVGhlc2Ugc2hvdWxkIGJlIGhlbGQgaW4gdGhlIGRhdGFiYXNlXHJcbiAgICB0aGlzLml0ZW1zID0gW1xyXG4gICAgICB7XHQvLyB0eXBlIDBcclxuICAgICAgICBuYW1lOiBcIkJsYW5rIEl0ZW1cIixcclxuICAgICAgICBzcHJpdGU6IDY4LFxyXG4gICAgICAgIHR5cGU6ICdub25lJyxcclxuICAgICAgICBzdGFjazogMCxcclxuICAgICAgICByZXVzYWJsZTogZmFsc2UsXHJcbiAgICAgICAgZGFtYWdlQm9udXM6IDAsXHJcbiAgICAgICAgZGVmZW5jZUJvbnVzOiAwLFxyXG4gICAgICAgIGhlYWx0aE1heEJvbnVzOiAwLFxyXG4gICAgICAgIGVuZXJneU1heEJvbnVzOiAwLFxyXG4gICAgICAgIHJhbmdlQm9udXM6IDBcclxuICAgICAgfSxcclxuICAgICAge1x0Ly8gdHlwZSAxXHJcbiAgICAgICAgbmFtZTogXCJIZWFsdGggUG90aW9uXCIsXHJcbiAgICAgICAgc3ByaXRlOiAxLFxyXG4gICAgICAgIHR5cGU6ICdwb3Rpb24nLFxyXG4gICAgICAgIHN0YWNrOiAxLFxyXG4gICAgICAgIHJldXNhYmxlOiBmYWxzZSxcclxuICAgICAgICBkYW1hZ2VCb251czogMCxcclxuICAgICAgICBkZWZlbmNlQm9udXM6IDAsXHJcbiAgICAgICAgaGVhbHRoTWF4Qm9udXM6IDAsXHJcbiAgICAgICAgZW5lcmd5TWF4Qm9udXM6IDAsXHJcbiAgICAgICAgcmFuZ2VCb251czogMFxyXG4gICAgICB9LCBcclxuICAgICAge1x0Ly8gdHlwZSAyXHJcbiAgICAgICAgbmFtZTogXCJFbmVyZ3kgUG90aW9uXCIsXHJcbiAgICAgICAgc3ByaXRlOiAyLFxyXG4gICAgICAgIHR5cGU6ICdwb3Rpb24nLFxyXG4gICAgICAgIHN0YWNrOiAxLFxyXG4gICAgICAgIHJldXNhYmxlOiBmYWxzZSxcclxuICAgICAgICBkYW1hZ2VCb251czogMCxcclxuICAgICAgICBkZWZlbmNlQm9udXM6IDAsXHJcbiAgICAgICAgaGVhbHRoTWF4Qm9udXM6IDAsXHJcbiAgICAgICAgZW5lcmd5TWF4Qm9udXM6IDAsXHJcbiAgICAgICAgcmFuZ2VCb251czogMFxyXG4gICAgICB9LCBcclxuICAgICAge1x0Ly8gdHlwZSAzXHJcbiAgICAgICAgbmFtZTogXCJJbmNvZ25pdG9cIixcclxuICAgICAgICBzcHJpdGU6IDEyLFxyXG4gICAgICAgIHR5cGU6ICdzcGVjaWFsJyxcclxuICAgICAgICBzdGFjazogMCxcclxuICAgICAgICByZXVzYWJsZTogdHJ1ZSxcclxuICAgICAgICBkYW1hZ2VCb251czogMCxcclxuICAgICAgICBkZWZlbmNlQm9udXM6IDAsXHJcbiAgICAgICAgaGVhbHRoTWF4Qm9udXM6IDAsXHJcbiAgICAgICAgZW5lcmd5TWF4Qm9udXM6IDAsXHJcbiAgICAgICAgcmFuZ2VCb251czogMFxyXG4gICAgICB9LFxyXG4gICAgICB7XHQvLyB0eXBlIDRcclxuICAgICAgICBuYW1lOiBcIlN3b3JkXCIsXHJcbiAgICAgICAgc3ByaXRlOiAxMCxcclxuICAgICAgICB0eXBlOiAnd2VhcG9uJyxcclxuICAgICAgICBzdGFjazogMCxcclxuICAgICAgICByZXVzYWJsZTogdHJ1ZSxcclxuICAgICAgICBkYW1hZ2VCb251czogMSxcclxuICAgICAgICBkZWZlbmNlQm9udXM6IDAsXHJcbiAgICAgICAgaGVhbHRoTWF4Qm9udXM6IDAsXHJcbiAgICAgICAgZW5lcmd5TWF4Qm9udXM6IDAsXHJcbiAgICAgICAgcmFuZ2VCb251czogMFxyXG4gICAgICAgIFxyXG4gICAgICB9LFxyXG4gICAgICB7XHQvLyB0eXBlIDVcclxuICAgICAgICBuYW1lOiBcIkF4ZVwiLFxyXG4gICAgICAgIHNwcml0ZTogMTQsXHJcbiAgICAgICAgdHlwZTogJ3dlYXBvbicsXHJcbiAgICAgICAgc3RhY2s6IDAsXHJcbiAgICAgICAgcmV1c2FibGU6IHRydWUsXHJcbiAgICAgICAgZGFtYWdlQm9udXM6IDIsXHJcbiAgICAgICAgZGVmZW5jZUJvbnVzOiAwLFxyXG4gICAgICAgIGhlYWx0aE1heEJvbnVzOiAwLFxyXG4gICAgICAgIGVuZXJneU1heEJvbnVzOiAwLFxyXG4gICAgICAgIHJhbmdlQm9udXM6IDBcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgIF07XHJcblxyXG4gICAgdGhpcy5tYXBzID0gW1xyXG4gICAgICB7XHQvLyBpZCAwXHJcbiAgICAgICAgbmFtZTogXCJCbGFuayBNYXBcIixcclxuICAgICAgICBkcm9wQ2hhbmNlOiAxMDAsXHJcbiAgICAgICAgZHJvcEFtb3VudEVROiAwLFxyXG4gICAgICAgIGpvaW46XHRcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICBsZWF2ZTpcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAge1x0Ly8gaWQgMVxyXG4gICAgICAgIG5hbWU6IFwiQ3JlbmRhbGUgMVwiLFxyXG4gICAgICAgIGRyb3BDaGFuY2U6IDEwMCxcclxuICAgICAgICBkcm9wQW1vdW50RVE6IDAsXHJcbiAgICAgICAgam9pbjpcdFx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgIGxlYXZlOlx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICB7XHQvLyBpZCAyXHJcbiAgICAgICAgbmFtZTogXCJDcmVuZGFsZSAyXCIsXHJcbiAgICAgICAgZHJvcENoYW5jZTogMTAwLFxyXG4gICAgICAgIGRyb3BBbW91bnRFUTogMCxcclxuICAgICAgICBqb2luOlx0XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgbGVhdmU6XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcdC8vIGlkIDNcclxuICAgICAgICBuYW1lOiBcIkNyZW5kYWxlIDNcIixcclxuICAgICAgICBkcm9wQ2hhbmNlOiAxMDAsXHJcbiAgICAgICAgZHJvcEFtb3VudEVROiAwLFxyXG4gICAgICAgIGpvaW46XHRcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICBsZWF2ZTpcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAge1x0Ly8gaWQgNFxyXG4gICAgICAgIG5hbWU6IFwiQ3JlbmRhbGUgNFwiLFxyXG4gICAgICAgIGRyb3BDaGFuY2U6IDEwMCxcclxuICAgICAgICBkcm9wQW1vdW50RVE6IDAsXHJcbiAgICAgICAgam9pbjpcdFx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgIGxlYXZlOlx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICB7XHQvLyBpZCA1XHJcbiAgICAgICAgbmFtZTogXCJDcmVuZGFsZSA1XCIsXHJcbiAgICAgICAgZHJvcENoYW5jZTogMTAwLFxyXG4gICAgICAgIGRyb3BBbW91bnRFUTogMCxcclxuICAgICAgICBqb2luOlx0XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgbGVhdmU6XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcdC8vIGlkIDZcclxuICAgICAgICBuYW1lOiBcIkNyZW5kYWxlIDZcIixcclxuICAgICAgICBkcm9wQ2hhbmNlOiAxMDAsXHJcbiAgICAgICAgZHJvcEFtb3VudEVROiAwLFxyXG4gICAgICAgIGpvaW46XHRcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICBsZWF2ZTpcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAge1x0Ly8gaWQgN1xyXG4gICAgICAgIG5hbWU6IFwiQ3JlbmRhbGUgN1wiLFxyXG4gICAgICAgIGRyb3BDaGFuY2U6IDEwMCxcclxuICAgICAgICBkcm9wQW1vdW50RVE6IDAsXHJcbiAgICAgICAgam9pbjpcdFx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgIGxlYXZlOlx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICB7XHQvLyBpZCA4XHJcbiAgICAgICAgbmFtZTogXCJDcmVuZGFsZSA4XCIsXHJcbiAgICAgICAgZHJvcENoYW5jZTogMTAwLFxyXG4gICAgICAgIGRyb3BBbW91bnRFUTogMCxcclxuICAgICAgICBqb2luOlx0XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgbGVhdmU6XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcdC8vIGlkIDlcclxuICAgICAgICBuYW1lOiBcIkNyZW5kYWxlIDlcIixcclxuICAgICAgICBkcm9wQ2hhbmNlOiAxMDAsXHJcbiAgICAgICAgZHJvcEFtb3VudEVROiAwLFxyXG4gICAgICAgIGpvaW46XHRcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICBsZWF2ZTpcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIF07XHJcblxyXG4gICAgdGhpcy5wbGF5ZXJzID0gW1xyXG4gICAgICB7XHQvL2lkIDBcclxuICAgICAgICBuYW1lOiBcIkZhbmthZG9yZVwiLFxyXG4gICAgICAgIHNwcml0ZTogMSxcclxuICAgICAgICBhZG1pbkFjY2VzczogMCxcclxuICAgICAgICBtYXBJZDogMSxcclxuICAgICAgICB4OiA1LFxyXG4gICAgICAgIHk6IDUsXHJcbiAgICAgICAgZGFtYWdlQmFzZTogMTAsXHJcbiAgICAgICAgZGVmZW5jZUJhc2U6IDIsXHJcbiAgICAgICAgaGVhbHRoTWF4QmFzZTogMjAsXHJcbiAgICAgICAgZW5lcmd5TWF4QmFzZTogNDAsXHJcbiAgICAgICAgcmFuZ2VCYXNlOiAxXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcdC8vaWQgMVxyXG4gICAgICAgIG5hbWU6IFwiT2JiaXR0XCIsXHJcbiAgICAgICAgc3ByaXRlOiAzLFxyXG4gICAgICAgIGFkbWluQWNjZXNzOiAwLFxyXG4gICAgICAgIG1hcElkOiAxLFxyXG4gICAgICAgIHg6IDQsXHJcbiAgICAgICAgeTogNCxcclxuICAgICAgICBkYW1hZ2VCYXNlOiAxMCxcclxuICAgICAgICBkZWZlbmNlQmFzZTogMixcclxuICAgICAgICBoZWFsdGhNYXhCYXNlOiAyMCxcclxuICAgICAgICBlbmVyZ3lNYXhCYXNlOiA0MCxcclxuICAgICAgICByYW5nZUJhc2U6IDFcclxuICAgICAgfSxcclxuICAgICAge1x0Ly9pZCAyXHJcbiAgICAgICAgbmFtZTogXCJGcm9saWtcIixcclxuICAgICAgICBzcHJpdGU6IDUsXHJcbiAgICAgICAgYWRtaW5BY2Nlc3M6IDAsXHJcbiAgICAgICAgbWFwSWQ6IDEsXHJcbiAgICAgICAgeDogNSxcclxuICAgICAgICB5OiA1LFxyXG4gICAgICAgIGRhbWFnZUJhc2U6IDEwLFxyXG4gICAgICAgIGRlZmVuY2VCYXNlOiAyLFxyXG4gICAgICAgIGhlYWx0aE1heEJhc2U6IDIwLFxyXG4gICAgICAgIGVuZXJneU1heEJhc2U6IDQwLFxyXG4gICAgICAgIHJhbmdlQmFzZTogMVxyXG4gICAgICB9LFxyXG4gICAgXTtcclxuXHJcbiAgICB0aGlzLmJvdHMgPSBbXHJcbiAgICAgIHtcdC8vaWQgMFxyXG4gICAgICAgIG5hbWU6IFwiUmF0XCIsXHJcbiAgICAgICAgc3ByaXRlOiAwLFxyXG4gICAgICAgIGhvc3RpbGU6IGZhbHNlLFxyXG4gICAgICAgIGRhbWFnZUJhc2U6IDEsXHJcbiAgICAgICAgZGVmZW5jZUJhc2U6IDAsXHJcbiAgICAgICAgaGVhbHRoTWF4QmFzZTogNSxcclxuICAgICAgICBlbmVyZ3lNYXhCYXNlOiAxMCxcclxuICAgICAgICByYW5nZUJhc2U6IDFcclxuICAgICAgfSxcclxuICAgICAge1x0Ly9pZCAxXHJcbiAgICAgICAgbmFtZTogXCJTbmFrZVwiLFxyXG4gICAgICAgIHNwcml0ZTogMixcclxuICAgICAgICBob3N0aWxlOiB0cnVlLFxyXG4gICAgICAgIGRhbWFnZUJhc2U6IDIsXHJcbiAgICAgICAgZGVmZW5jZUJhc2U6IDAsXHJcbiAgICAgICAgaGVhbHRoTWF4QmFzZTogNSxcclxuICAgICAgICBlbmVyZ3lNYXhCYXNlOiA1LFxyXG4gICAgICAgIHJhbmdlQmFzZTogMVxyXG4gICAgICB9LFxyXG4gICAgXTtcclxuXHJcbiAgfVxyXG5cclxuXHRsb2cobWVzc2FnZSkge1xyXG5cdFx0Y29uc29sZS5sb2cobWVzc2FnZSk7XHJcblx0fVxyXG5cclxuICBmaW5kKHVzZXJuYW1lKSB7XHJcbiAgICBtb25nby5hY2NvdW50cy5maW5kT25lKHt1c2VybmFtZTogdXNlcm5hbWV9LCAoZXJyLCByZXMpID0+IHtcclxuICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xyXG4gICAgICBpZiAocmVzKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB0aGlzLmxvZyhgUGxheWVyIG5vdCBmb3VuZCB3aXRoIHVzZXJuYW1lOiAke3VzZXJuYW1lfWApO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldFBsYXllckRhdGEoaWQpIHtcclxuICAgIGxldCBwbGF5ZXJEYXRhID0ge307XHJcblxyXG4gICAgaWYgKHRoaXMucGxheWVyc1tpZF0pIHtcdC8vIEZyb20gRGF0YWJhc2VcclxuICAgICAgcGxheWVyRGF0YSA9IHRoaXMucGxheWVyc1tpZF07XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcdC8vIEZpcnN0IExvZ2luXHJcbiAgICAgIHBsYXllckRhdGEubmFtZSA9IGNvbmZpZy5TVEFSVF9OQU1FO1xyXG4gICAgICBwbGF5ZXJEYXRhLnNwcml0ZSA9IGNvbmZpZy5TVEFSVF9TUFJJVEU7XHJcbiAgICAgIHBsYXllckRhdGEuYWRtaW5BY2Nlc3MgPSAwO1xyXG4gICAgICBcclxuICAgICAgcGxheWVyRGF0YS5tYXBJZCA9IGNvbmZpZy5TVEFSVF9NQVA7XHJcbiAgICAgIHBsYXllckRhdGEueCA9IGNvbmZpZy5TVEFSVF9YO1xyXG4gICAgICBwbGF5ZXJEYXRhLnkgPSBjb25maWcuU1RBUlRfWTtcclxuICAgICAgXHJcbiAgICAgIHBsYXllckRhdGEuZGFtYWdlQmFzZSA9IGNvbmZpZy5TVEFSVF9EQU1BR0U7XHJcbiAgICAgIHBsYXllckRhdGEuZGVmZW5jZUJhc2UgPSBjb25maWcuU1RBUlRfREVGRU5DRTtcclxuICAgICAgcGxheWVyRGF0YS5oZWFsdGhNYXhCYXNlID0gY29uZmlnLlNUQVJUX0hFQUxUSF9NQVg7XHJcbiAgICAgIHBsYXllckRhdGEuZW5lcmd5TWF4QmFzZSA9IGNvbmZpZy5TVEFSVF9FTkVSR1lfTUFYO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICByZXR1cm4gcGxheWVyRGF0YTtcclxuICB9XHJcblxyXG4gIHNhdmVQbGF5ZXJEYXRhKGRhdGEpIHtcclxuICAgIC8vbW9uZ28ucGxheWVycy5zYXZlKGRhdGEuaWQsIGRhdGEpO1xyXG4gIH1cclxuXHJcbiAgZ2V0TWFwRGF0YShpZCkge1xyXG4gICAgbGV0IG1hcERhdGEgPSB7fTtcclxuXHJcbiAgICBpZiAodGhpcy5tYXBzW2lkXSkge1xyXG4gICAgICBtYXBEYXRhID0gdGhpcy5tYXBzW2lkXTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBtYXBEYXRhLm5hbWUgPSBcIkJsYW5rIE1hcFwiO1xyXG4gICAgICBtYXBEYXRhLml0ZW1zID0gW107XHJcbiAgICAgIG1hcERhdGEuYm90cyA9IFtdO1xyXG4gICAgICBtYXBEYXRhLmVmZmVjdHMgPSBbXTtcclxuICAgICAgbWFwRGF0YS50ZXh0cyA9IFtdO1xyXG4gICAgICBtYXBEYXRhLmRyb3BDaGFuY2UgPSAxMDA7XHJcbiAgICAgIG1hcERhdGEuZHJvcEFtb3VudEVRID0gNTtcclxuICAgICAgbWFwRGF0YS50aWxlcyA9IHtcclxuICAgICAgICBsYXllcjogWyBcclxuICAgICAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcclxuICAgICAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcclxuICAgICAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcclxuICAgICAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcclxuICAgICAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcclxuICAgICAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcclxuICAgICAgICBdLFxyXG4gICAgICAgIHdhbGw6IFtmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlXSxcclxuICAgICAgICBjYW5BdHRhY2s6IFtmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlXSxcclxuICAgICAgICBkYW1hZ2U6IFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcclxuICAgICAgICBkZWZlbmNlOiBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXHJcbiAgICAgICAgaGVhbHRoTWF4OiBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXHJcbiAgICAgICAgd2FycE1hcDogWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxyXG4gICAgICAgIHdhcnBYOiBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXHJcbiAgICAgICAgd2FycFk6IFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXVxyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBtYXBEYXRhO1xyXG4gIH1cclxuICBcclxuICBzYXZlTWFwRGF0YShkYXRhKSB7XHJcbiAgICBtb25nby5tYXBzLnNhdmUoZGF0YS5pZCwgZGF0YSk7XHJcbiAgfVxyXG5cclxuICBnZXRCb3REYXRhKGJvdENsYXNzKSB7XHJcbiAgICByZXR1cm4gdGhpcy5ib3RzW2JvdENsYXNzXTtcclxuICB9XHJcblxyXG4gIHNhdmVCb3REYXRhKG1hcElkLCBpZCkge1xyXG5cclxuICB9XHJcblxyXG4gIGdldEl0ZW1EYXRhKGl0ZW1DbGFzcykge1xyXG4gICAgcmV0dXJuIHRoaXMuaXRlbXNbaXRlbUNsYXNzXTtcclxuICB9XHJcbn1cclxuXHJcbmNvbnN0IGRiID0gbmV3IERhdGFiYXNlKCk7XHJcbmV4cG9ydCBkZWZhdWx0IGRiO1xyXG4iLCJpbXBvcnQgZnMgZnJvbSAnZnMnO1xyXG5cclxuaW1wb3J0IGRiIGZyb20gJy4vZGIuanMnO1xyXG5pbXBvcnQgY29uZmlnIGZyb20gJy4vY29uZmlnLmpzJztcclxuaW1wb3J0IHV0aWwgZnJvbSAnLi91dGlsLmpzJztcclxuaW1wb3J0IE1hcCBmcm9tICcuL2NsYXNzZXMvbWFwLmpzJztcclxuaW1wb3J0IFBsYXllciBmcm9tICcuL2NsYXNzZXMvcGxheWVyLmpzJztcclxuaW1wb3J0IEJvdCBmcm9tICcuL2NsYXNzZXMvYm90LmpzJztcclxuaW1wb3J0IEl0ZW0gZnJvbSAnLi9jbGFzc2VzL2l0ZW0uanMnO1xyXG5pbXBvcnQgVGV4dCBmcm9tICcuL2NsYXNzZXMvdGV4dC5qcyc7XHJcbmltcG9ydCBNZXNzYWdlIGZyb20gJy4vY2xhc3Nlcy9tZXNzYWdlLmpzJztcclxuXHJcbmNsYXNzIEdhbWUge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0dGhpcy5wbGF5ZXJMaXN0ID0gW107XHJcblx0XHR0aGlzLm1hcExpc3QgPSBbXTtcclxuXHRcdHRoaXMubWVzc2FnZVF1ZXVlID0gW107XHJcblxyXG5cdFx0Ly8gQ3JlYXRlIE1hcHNcclxuXHRcdHRoaXMubWFwRGF0YSA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKCcuL3NlcnZlci9kYXRhL21hcC5qc29uJywgJ3V0ZjgnKSk7XHJcblx0XHRmb3IgKGxldCBpZCA9IDA7IGlkIDwgY29uZmlnLk1BWF9NQVBTOyBpZCsrKSB7XHJcblx0XHRcdHRoaXMubWFwTGlzdFtpZF0gPSBuZXcgTWFwKGlkLCB0aGlzLm1hcERhdGFbaWRdKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHVwZGF0ZShkZWx0YSkge1xyXG5cdFx0bGV0IHBhY2sgPSB7XHJcblx0XHRcdHBsYXllcnM6IFtdLFxyXG5cdFx0XHRtYXBzOiBbXSxcclxuXHRcdFx0bWVzc2FnZXM6IHRoaXMubWVzc2FnZVF1ZXVlXHJcblx0XHR9O1xyXG5cdFx0dGhpcy5tZXNzYWdlUXVldWUgPSBbXTtcclxuXHJcblx0XHR0aGlzLnBsYXllckxpc3QuZm9yRWFjaCgocGxheWVyKSA9PiB7XHJcblx0XHRcdHBhY2sucGxheWVyc1twbGF5ZXIuaWRdID0gcGxheWVyLnVwZGF0ZShkZWx0YSk7XHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdFx0dGhpcy5tYXBMaXN0LmZvckVhY2goKG1hcCkgPT4ge1xyXG5cdFx0XHRwYWNrLm1hcHNbbWFwLmlkXSA9IG1hcC51cGRhdGUoZGVsdGEpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIHBhY2s7XHJcblx0fVxyXG5cclxuXHQvLyBQbGF5ZXJzXHJcblx0cGxheWVyTG9naW4oaWQpIHtcclxuXHRcdGxldCBwbGF5ZXIgPSBuZXcgUGxheWVyKGlkKTtcclxuXHRcdHRoaXMucGxheWVyTGlzdFtpZF0gPSBwbGF5ZXI7XHJcblx0XHR0aGlzLnNlbmRHYW1lSW5mb0dsb2JhbChgJHtwbGF5ZXIubmFtZX0gaGFzIGxvZ2dlZCBpbi5gKTtcclxuXHRcdHJldHVybiBwbGF5ZXI7XHJcblx0fVxyXG5cdFxyXG5cdHBsYXllckxvZ291dChpZCkge1xyXG5cdFx0bGV0IHBsYXllciA9IHRoaXMucGxheWVyTGlzdFtpZF07XHJcblx0XHRpZiAocGxheWVyKSB7XHJcblx0XHRcdGRiLnNhdmVQbGF5ZXJEYXRhKHBsYXllci5nZXRQYWNrKTtcclxuXHRcdFx0dGhpcy5zZW5kR2FtZUluZm9HbG9iYWwoYCR7cGxheWVyLm5hbWV9IGhhcyBsb2dnZWQgb3V0LmApO1xyXG5cdFx0XHRkZWxldGUgdGhpcy5wbGF5ZXJMaXN0W2lkXTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIEdhbWUgSW5mb1xyXG5cdHNlbmRHYW1lSW5mb0dsb2JhbChtZXNzYWdlKSB7XHJcblx0XHR0aGlzLm1lc3NhZ2VRdWV1ZS5wdXNoKG5ldyBNZXNzYWdlKG51bGwsIG1lc3NhZ2UsICdnYW1lSW5mbycpKTtcclxuXHR9XHJcblx0c2VuZEdhbWVJbmZvTWFwKG1hcElkLCBtZXNzYWdlKSB7XHJcblx0XHR0aGlzLm1lc3NhZ2VRdWV1ZS5wdXNoKG5ldyBNZXNzYWdlKG51bGwsIG1lc3NhZ2UsICdnYW1lSW5mbycsIG1hcElkKSk7XHJcblx0fVxyXG5cdHNlbmRHYW1lSW5mb1BsYXllcihpZCwgbWVzc2FnZSkge1xyXG5cdFx0dGhpcy5tZXNzYWdlUXVldWUucHVzaChuZXcgTWVzc2FnZShudWxsLCBtZXNzYWdlLCAnZ2FtZUluZm8nLCBudWxsLCBpZCkpO1xyXG5cdH1cclxuXHRcclxuXHQvLyBDaGF0IE1lc3NhZ2VzXHJcblx0c2VuZE1lc3NhZ2VHbG9iYWwoc2VuZGVySWQsIG1lc3NhZ2UpIHtcclxuXHRcdHRoaXMubWVzc2FnZVF1ZXVlLnB1c2gobmV3IE1lc3NhZ2Uoc2VuZGVySWQsIG1lc3NhZ2UsICdtZXNzYWdlR2xvYmFsJykpO1xyXG5cdH1cclxuXHRzZW5kTWVzc2FnZU1hcChzZW5kZXJJZCwgbWFwSWQsIG1lc3NhZ2UpIHtcclxuXHRcdHRoaXMubWVzc2FnZVF1ZXVlLnB1c2gobmV3IE1lc3NhZ2Uoc2VuZGVySWQsIG1lc3NhZ2UsICdtZXNzYWdlTWFwJywgbWFwSWQpKTtcclxuXHR9XHJcblx0c2VuZE1lc3NhZ2VQbGF5ZXIoc2VuZGVySWQsIGlkLCBtZXNzYWdlKSB7XHJcblx0XHR0aGlzLm1lc3NhZ2VRdWV1ZS5wdXNoKG5ldyBNZXNzYWdlKHNlbmRlcklkLCBtZXNzYWdlLCAnbWVzc2FnZVBsYXllcicsIG51bGwsIGlkKSk7XHJcblx0fVxyXG5cclxuXHQvLyBNYXBcclxuXHRpc1ZhY2FudChtYXBJZCwgeCwgeSkge1xyXG5cdFx0Ly8gQ2hlY2sgZm9yIE1hcCBFZGdlc1xyXG5cdFx0aWYgKHggPCAwIHx8IHggPj0gY29uZmlnLk1BUF9DT0xVTU5TKSByZXR1cm4gZmFsc2U7XHJcblx0XHRpZiAoeSA8IDAgfHwgeSA+PSBjb25maWcuTUFQX1JPV1MpIHJldHVybiBmYWxzZTtcclxuXHRcdFxyXG5cdFx0bGV0IG1hcCA9IHRoaXMubWFwTGlzdFttYXBJZF07XHJcblx0XHRcclxuXHRcdC8vIENoZWNrIGZvciBXYWxsIFRpbGVzXHJcblx0XHRpZiAobWFwLnRpbGVzW3ldW3hdLndhbGwgPT09IHRydWUpIHJldHVybiBmYWxzZTtcclxuXHRcdFxyXG5cdFx0Ly8gQ2hlY2sgZm9yIEJvdHNcclxuXHRcdGxldCBib3RzID0gbWFwLmJvdHMuZmlsdGVyKChib3QpID0+IHtcclxuXHRcdFx0aWYgKGJvdC54ID09PSB4ICYmIGJvdC55ID09PSB5ICYmICFib3QuaXNEZWFkKSByZXR1cm4gdHJ1ZTtcclxuXHRcdH0pO1xyXG5cdFx0aWYgKGJvdHMubGVuZ3RoID4gMCkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHJcblx0XHQvLyBDaGVjayBmb3IgUGxheWVyc1xyXG5cdFx0bGV0IHBsYXllcnMgPSB0aGlzLnBsYXllckxpc3QuZmlsdGVyKChwbGF5ZXIpID0+IHtcclxuXHRcdFx0aWYgKHBsYXllci5tYXBJZCA9PT0gbWFwLmlkICYmIHBsYXllci54ID09PSB4ICYmIHBsYXllci55ID09PSB5ICYmICFwbGF5ZXIuaXNEZWFkKSByZXR1cm4gdHJ1ZTtcclxuXHRcdH0pO1xyXG5cdFx0aWYgKHBsYXllcnMubGVuZ3RoID4gMCkgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHJcblx0c3Bhd25Cb3QobWFwSWQsIHgsIHksIGJvdENsYXNzKSB7XHJcblx0XHRuZXcgQm90KHtcclxuXHRcdFx0bWFwSWQsXHJcblx0XHRcdHgsXHJcblx0XHRcdHksXHJcblx0XHRcdGJvdENsYXNzXHJcblx0XHR9KTtcclxuXHR9XHJcblx0XHJcblx0c3Bhd25NYXBJdGVtKG1hcElkLCB4LCB5LCBpdGVtQ2xhc3MsIHN0YWNrID0gMCkge1xyXG5cdFx0bmV3IEl0ZW0oe1xyXG5cdFx0XHRvd25lcjogJ21hcCcsXHJcblx0XHRcdG1hcElkLFxyXG5cdFx0XHRpZDogdXRpbC5maXJzdEVtcHR5SW5kZXgodGhpcy5tYXBMaXN0W21hcElkXS5pdGVtcyksXHJcblx0XHRcdHgsXHJcblx0XHRcdHksXHJcblx0XHRcdGl0ZW1DbGFzcyxcclxuXHRcdFx0c3RhY2tcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0c3Bhd25EYW1hZ2VUZXh0KG1hcElkLCB4LCB5LCBkYW1hZ2UpIHtcclxuXHRcdG5ldyBUZXh0KG1hcElkLCB4LCB5IC0gMC41LCBkYW1hZ2UsICcjZmYwMDAwJywgMS4yNSwgMCwgLTEpO1xyXG5cdH1cclxufVxyXG5cclxuY29uc3QgZ2FtZSA9IG5ldyBHYW1lKCk7XHJcbmV4cG9ydCBkZWZhdWx0IGdhbWU7XHJcbiIsIi8qKiogR2FtZSBMb29wICoqKi9cclxuLyogS2VlcHMgdHJhY2sgb2YgdGltZSBhbmQgY28tb3JkaW5hdGVzIHRoZSBnYW1lIGFuZCBzZXJ2ZXIgKi9cclxuXHJcbmltcG9ydCBOb2RlR2FtZUxvb3AgZnJvbSAnbm9kZS1nYW1lbG9vcCc7XHJcblxyXG5pbXBvcnQgZGIgZnJvbSAnLi9kYi5qcyc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4vZ2FtZS5qcyc7XHJcbmltcG9ydCBzZXJ2ZXIgZnJvbSAnLi9zZXJ2ZXIuanMnO1xyXG5pbXBvcnQgY29uZmlnIGZyb20gJy4vY29uZmlnLmpzJztcclxuXHJcbmNsYXNzIEdhbWVMb29wIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuaWQgPSBudWxsO1xyXG4gICAgdGhpcy50aW1lciA9IHtcclxuICAgICAgYmFja3VwOiAwXHJcbiAgICB9O1xyXG4gICAgdGhpcy5zdGFydCgpO1xyXG4gIH1cclxuICBzdGFydCgpIHtcclxuICAgIHRoaXMuaWQgPSBOb2RlR2FtZUxvb3Auc2V0R2FtZUxvb3AoKGRlbHRhKSA9PiB7XHJcbiAgICAgIC8vIFVwZGF0ZSB0aGUgZ2FtZSBzdGF0ZVxyXG4gICAgICBsZXQgdXBkYXRlUGFjayA9IGdhbWUudXBkYXRlKGRlbHRhKTtcclxuICAgICAgXHJcbiAgICAgIC8vIFNlbmQgdXBkYXRlZCBzdGF0ZSB0byBjbGllbnRzXHJcbiAgICAgIHNlcnZlci5zZW5kVXBkYXRlUGFjayh1cGRhdGVQYWNrKTtcclxuICAgICAgXHJcbiAgICAgIC8vIFBlcmlvZGljIGJhY2t1cCB0byBkYXRhYmFzZVxyXG4gICAgICB0aGlzLnRpbWVyLmJhY2t1cCArPSBkZWx0YTtcclxuICAgICAgaWYgKHRoaXMudGltZXIuYmFja3VwID49IGNvbmZpZy5CQUNLVVBfVElNRSkge1xyXG4gICAgICAgIHRoaXMudGltZXIuYmFja3VwIC09IGNvbmZpZy5CQUNLVVBfVElNRTtcclxuICAgICAgICAvLyBTQVZFIFNUQVRFXHJcbiAgICAgIH1cclxuICAgIH0sIGNvbmZpZy5GUkFNRVJBVEUpO1xyXG4gIH1cclxufVxyXG5cclxuY29uc3QgZ2FtZUxvb3AgPSBuZXcgR2FtZUxvb3AoKTtcclxuZXhwb3J0IGRlZmF1bHQgZ2FtZUxvb3A7IiwiaW1wb3J0IGRiIGZyb20gJy4vZGIuanMnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuL2dhbWUuanMnO1xyXG5pbXBvcnQgc2VydmVyIGZyb20gJy4vc2VydmVyLmpzJztcclxuaW1wb3J0IGdhbWVsb29wIGZyb20gJy4vZ2FtZWxvb3AuanMnO1xyXG4iLCJpbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcclxuaW1wb3J0IGh0dHAgZnJvbSAnaHR0cCc7XHJcbmltcG9ydCBzb2NrZXRJTyBmcm9tICdzb2NrZXQuaW8nO1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuXHJcbmltcG9ydCBkYiBmcm9tICcuL2RiLmpzJztcclxuaW1wb3J0IGdhbWUgZnJvbSAnLi9nYW1lLmpzJztcclxuaW1wb3J0IGNvbmZpZyBmcm9tICcuL2NvbmZpZy5qcyc7XHJcbmltcG9ydCB1dGlsIGZyb20gJy4vdXRpbC5qcyc7XHJcblxyXG5jbGFzcyBTZXJ2ZXIge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0Y29uc3QgYXBwID0gZXhwcmVzcygpO1xyXG5cdFx0Y29uc3Qgc2VydmVyID0gaHR0cC5TZXJ2ZXIoYXBwKTtcclxuXHRcdGNvbnN0IGlvID0gc29ja2V0SU8oc2VydmVyKTtcclxuXHRcdGNvbnN0IHBvcnQgPSBwcm9jZXNzLmVudi5QT1JUIHx8IGNvbmZpZy5QT1JUO1xyXG5cdFx0Y29uc3QgcHVibGljUGF0aCA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLi9jbGllbnQnKTtcclxuXHRcdFxyXG5cdFx0YXBwLmdldCgnLycsIChyZXEsIHJlcykgPT4gcmVzLnNlbmRGaWxlKHB1YmxpY1BhdGggKyAnL2luZGV4Lmh0bWwnKSk7XHJcblx0XHRhcHAudXNlKCcvY2xpZW50JywgZXhwcmVzcy5zdGF0aWMocHVibGljUGF0aCkpO1xyXG5cdFx0c2VydmVyLmxpc3Rlbihwb3J0LCAoKSA9PiBkYi5sb2coYFNlcnZlciBzdGFydGVkLiBMaXN0ZW5pbmcgb24gJHtzZXJ2ZXIuYWRkcmVzcygpLnBvcnR9YCkpO1xyXG5cclxuXHRcdHRoaXMuc29ja2V0TGlzdCA9IFtdO1xyXG5cdFx0aW8uc29ja2V0cy5vbignY29ubmVjdGlvbicsIChzb2NrZXQpID0+IHRoaXMub25Db25uZWN0KHNvY2tldCkpO1xyXG5cdH1cclxuXHJcblx0Ly8gUmVjZWl2ZSBkYXRhIGZyb20gY2xpZW50c1xyXG5cdG9uQ29ubmVjdChzb2NrZXQpIHtcclxuXHRcdHNvY2tldC5pZCA9IHV0aWwuZmlyc3RFbXB0eUluZGV4KHRoaXMuc29ja2V0TGlzdCk7XHJcblx0XHR0aGlzLnNvY2tldExpc3Rbc29ja2V0LmlkXSA9IHNvY2tldDtcclxuXHRcdGRiLmxvZyhgTmV3IENvbm5lY3Rpb246IElkICR7c29ja2V0LmlkfWApO1xyXG5cdFx0XHJcblx0XHRzb2NrZXQub24oJ2Rpc2Nvbm5lY3QnLCAoKSA9PiB0aGlzLm9uRGlzY29ubmVjdChzb2NrZXQuaWQpKTtcclxuXHRcdHNvY2tldC5vbignbG9naW4nLCAoKSA9PiB0aGlzLm9uTG9naW4oc29ja2V0LmlkKSk7XHJcblx0XHRzb2NrZXQub24oJ2xvZ291dCcsICgpID0+IHRoaXMub25Mb2dvdXQoc29ja2V0LmlkKSk7XHJcblx0fVxyXG5cclxuXHRvbkRpc2Nvbm5lY3QoaWQpIHtcclxuXHRcdGlmIChnYW1lLnBsYXllckxpc3RbaWRdKSB7XHJcblx0XHRcdGdhbWUucGxheWVyTG9nb3V0KGlkKTtcclxuXHRcdH1cclxuXHRcdGRlbGV0ZSB0aGlzLnNvY2tldExpc3RbaWRdO1xyXG5cdFx0ZGIubG9nKGBEaXNjb25uZWN0ZWQ6IElkICR7aWR9YCk7XHJcblx0fVxyXG5cclxuXHRvbkxvZ2luKGlkKSB7XHRcdFxyXG5cdFx0Ly8gQ3JlYXRlIFBsYXllclxyXG5cdFx0bGV0IHBsYXllciA9IGdhbWUucGxheWVyTG9naW4oaWQpO1xyXG5cdFx0XHJcblx0XHQvLyBSZWNlaXZlIElucHV0c1xyXG5cdFx0bGV0IHNvY2tldCA9IHRoaXMuc29ja2V0TGlzdFtpZF07XHJcblx0XHRzb2NrZXQub24oJ2lucHV0JywgKGRhdGEpID0+IHBsYXllci5vbklucHV0KGRhdGEpKTtcclxuXHR9XHJcblx0XHJcblx0b25Mb2dvdXQoaWQpIHtcclxuXHRcdGdhbWUucGxheWVyTG9nb3V0KGlkKTtcclxuXHR9XHJcblx0XHJcblx0Ly8gU2VuZCBkYXRhIHRvIGNsaWVudHNcclxuXHRzZW5kVXBkYXRlUGFjayh1cGRhdGVQYWNrKSB7XHJcblx0XHRnYW1lLnBsYXllckxpc3QuZm9yRWFjaCgocGxheWVyKSA9PiB7XHJcblx0XHRcdGxldCBwYWNrID0ge307XHJcblx0XHRcdFxyXG5cdFx0XHRwYWNrLmdhbWUgPSB1cGRhdGVQYWNrLm1hcHNbcGxheWVyLm1hcElkXTtcclxuXHRcdFx0cGFjay5nYW1lLnBsYXllcnMgPSB1cGRhdGVQYWNrLnBsYXllcnMuZmlsdGVyKChwbGF5ZXJEYXRhKSA9PiB7XHJcblx0XHRcdFx0cmV0dXJuIChwbGF5ZXJEYXRhLm1hcElkID09PSBwbGF5ZXIubWFwSWQgJiYgKHBsYXllckRhdGEuaXNWaXNpYmxlIHx8IHBsYXllckRhdGEuaWQgPT09IHBsYXllci5pZCkpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHBhY2sudWkgPSBwbGF5ZXIuZ2V0UHJpdmF0ZVBhY2soKTtcclxuXHRcdFx0cGFjay51aS5tZXNzYWdlcyA9IHVwZGF0ZVBhY2subWVzc2FnZXMuZmlsdGVyKChtZXNzYWdlKSA9PiB7XHJcblx0XHRcdFx0cmV0dXJuICgobWVzc2FnZS5tYXBJZCA9PSBudWxsICYmIG1lc3NhZ2UuaWQgPT0gbnVsbCkgfHwgcGxheWVyLm1hcElkID09PSBtZXNzYWdlLm1hcElkIHx8IHBsYXllci5pZCA9PT0gbWVzc2FnZS5pZCk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0bGV0IHNvY2tldCA9IHRoaXMuc29ja2V0TGlzdFtwbGF5ZXIuaWRdO1xyXG5cdFx0XHRzb2NrZXQuZW1pdCgndXBkYXRlJywgcGFjayk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0XHJcblx0c2VuZE1hcERhdGEobWFwSWQpIHtcclxuXHRcdGdhbWUucGxheWVyTGlzdC5mb3JFYWNoKChwbGF5ZXIpID0+IHtcclxuXHRcdFx0aWYgKHBsYXllci5tYXBJZCA9PT0gbWFwSWQpIHtcclxuXHRcdFx0XHRsZXQgc29ja2V0ID0gdGhpcy5zb2NrZXRMaXN0W3BsYXllci5pZF07XHJcblx0XHRcdFx0c29ja2V0LmVtaXQoJ2xvYWRNYXAnLCBkYi5tYXBbbWFwSWRdKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxufVxyXG5cclxuY29uc3Qgc2VydmVyID0gbmV3IFNlcnZlcigpO1xyXG5leHBvcnQgZGVmYXVsdCBzZXJ2ZXI7XHJcbiIsImZ1bmN0aW9uIHNodWZmbGUoYXJyYXkpIHtcclxuICBsZXQgY3VycmVudEluZGV4ID0gYXJyYXkubGVuZ3RoO1xyXG4gIGxldCB0ZW1wO1xyXG4gIGxldCByYW5kb21JbmRleDtcclxuICB3aGlsZSAoY3VycmVudEluZGV4ICE9PSAwKSB7XHJcbiAgICByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGN1cnJlbnRJbmRleCk7XHJcbiAgICBjdXJyZW50SW5kZXggLT0gMTtcclxuICAgIHRlbXAgPSBhcnJheVtjdXJyZW50SW5kZXhdO1xyXG4gICAgYXJyYXlbY3VycmVudEluZGV4XSA9IGFycmF5W3JhbmRvbUluZGV4XTtcclxuICAgIGFycmF5W3JhbmRvbUluZGV4XSA9IHRlbXA7XHJcbiAgfVxyXG4gIHJldHVybiBhcnJheTtcclxufVxyXG5cclxuZnVuY3Rpb24gc3dhcChhcnJheSwgaSwgaikge1xyXG4gIGxldCB0ZW1wID0gYXJyYXlbaV07XHJcbiAgYXJyYXlbaV0gPSBhcnJheVtqXTtcclxuICBhcnJheVtqXSA9IHRlbXA7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpcnN0RW1wdHlJbmRleChhcnJheSkge1xyXG4gIGlmIChhcnJheS5sZW5ndGggPCAxKSByZXR1cm4gMDtcclxuICBcclxuICBmb3IgKGxldCBpID0gMDsgaSA8PSBhcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgaWYgKGFycmF5W2ldID09IG51bGwpIHJldHVybiBpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbGVycChzdGFydCwgZW5kLCB0aW1lKSB7XHJcbiAgLy9yZXR1cm4gc3RhcnQgKyAodGltZSAqIChlbmQgLSBzdGFydCkpO1xyXG4gIHJldHVybiAoKDEgLSB0aW1lKSAqIHN0YXJ0KSArICh0aW1lICogZW5kKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2xhbXAodmFsdWUsIG1pbmltdW0sIG1heGltdW0pIHtcclxuICBpZiAodmFsdWUgPCBtaW5pbXVtKSB7XHJcbiAgICByZXR1cm4gbWluaW11bTtcclxuICB9XHJcbiAgZWxzZSBpZiAodmFsdWUgPiBtYXhpbXVtKSB7XHJcbiAgICByZXR1cm4gbWF4aW11bTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiByYW5kb21JbnQobWluaW11bSwgbWF4aW11bSkge1xyXG4gIG1heGltdW0rKztcclxuICByZXR1cm4gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIG1heGltdW0pICsgbWluaW11bSk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBzaHVmZmxlLFxyXG4gIHN3YXAsXHJcbiAgZmlyc3RFbXB0eUluZGV4LFxyXG4gIGxlcnAsXHJcbiAgY2xhbXAsXHJcbiAgcmFuZG9tSW50XHJcbn07IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJmc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJodHRwXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm1vbmdvanNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibm9kZS1nYW1lbG9vcFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXRoXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInNvY2tldC5pb1wiKTsiXSwic291cmNlUm9vdCI6IiJ9
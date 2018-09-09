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
		_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].spawnEffect(this.mapId, this.x, this.y, 0);
		// game.spawnMapItem(this.mapId, this.x, this.y, 0);
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

/***/ "./server/src/classes/effect.js":
/*!**************************************!*\
  !*** ./server/src/classes/effect.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Effect; });
/* harmony import */ var _entity_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./entity.js */ "./server/src/classes/entity.js");
/* harmony import */ var _game_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../game.js */ "./server/src/game.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config.js */ "./server/src/config.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util.js */ "./server/src/util.js");





class Effect extends _entity_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
	constructor(mapId, x, y, sprite = 0, loop = 0, speed = 12, maxFrame = 7, startFrame = 0) {
		super(mapId, x, y, _util_js__WEBPACK_IMPORTED_MODULE_3__["default"].clamp(sprite, 0, _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].MAX_EFFECTS - 1));
		this.maxFrame = _util_js__WEBPACK_IMPORTED_MODULE_3__["default"].clamp(maxFrame, 0, 7);
		this.startFrame = _util_js__WEBPACK_IMPORTED_MODULE_3__["default"].clamp(startFrame, 0, this.maxFrame);
		this.currentFrame = this.startFrame;
		
		this.loop = loop;
		this.speed = speed;
		this.timer = 0;
		
		this.id = _util_js__WEBPACK_IMPORTED_MODULE_3__["default"].firstEmptyIndex(_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[this.mapId].effects);
		_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[this.mapId].effects[this.id] = this;
	}
	
	update(delta) {
		this.timer += delta;
		
		if (this.timer >= 1 / this.speed) {
			this.timer = 0;
			this.currentFrame++;

			if (this.currentFrame > this.maxFrame) {
				if (this.loop < 0) {
					this.currentFrame = this.startFrame;
				}
				else if (this.loop > 0) {
					this.currentFrame = this.startFrame;
					this.loop--;
				}
				else {
					this.currentFrame = this.maxFrame;
					this.remove();
				}
			}
		}

		return this.getPack();
	}
	
	getPack() {
		return {
			id: this.id,
			mapId: this.mapId,
			x: this.x,
			y: this.y,
			sprite: this.sprite,
			currentFrame: this.currentFrame
		};
	}
	
	remove() {
		delete _game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[this.mapId].effects[this.id];
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
config.MAX_EFFECTS = 71;

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
/* harmony import */ var _classes_effect_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./classes/effect.js */ "./server/src/classes/effect.js");
/* harmony import */ var _classes_text_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./classes/text.js */ "./server/src/classes/text.js");
/* harmony import */ var _classes_message_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./classes/message.js */ "./server/src/classes/message.js");













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
		this.messageQueue.push(new _classes_message_js__WEBPACK_IMPORTED_MODULE_10__["default"](null, message, 'gameInfo'));
	}
	sendGameInfoMap(mapId, message) {
		this.messageQueue.push(new _classes_message_js__WEBPACK_IMPORTED_MODULE_10__["default"](null, message, 'gameInfo', mapId));
	}
	sendGameInfoPlayer(id, message) {
		this.messageQueue.push(new _classes_message_js__WEBPACK_IMPORTED_MODULE_10__["default"](null, message, 'gameInfo', null, id));
	}
	
	// Chat Messages
	sendMessageGlobal(senderId, message) {
		this.messageQueue.push(new _classes_message_js__WEBPACK_IMPORTED_MODULE_10__["default"](senderId, message, 'messageGlobal'));
	}
	sendMessageMap(senderId, mapId, message) {
		this.messageQueue.push(new _classes_message_js__WEBPACK_IMPORTED_MODULE_10__["default"](senderId, message, 'messageMap', mapId));
	}
	sendMessagePlayer(senderId, id, message) {
		this.messageQueue.push(new _classes_message_js__WEBPACK_IMPORTED_MODULE_10__["default"](senderId, message, 'messagePlayer', null, id));
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
		new _classes_text_js__WEBPACK_IMPORTED_MODULE_9__["default"](mapId, x, y - 0.5, damage, '#ff0000', 1.25, 0, -1);
	}
	spawnEffect(mapId, x, y, sprite, loop, speed, maxFrame, startFrame) {
		new _classes_effect_js__WEBPACK_IMPORTED_MODULE_8__["default"](mapId, x, y, sprite, loop, speed, maxFrame, startFrame);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL2FjdG9yLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy9ib3QuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL2VmZmVjdC5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2NsYXNzZXMvZW50aXR5LmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy9pdGVtLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy9tYXAuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL21lc3NhZ2UuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL3BsYXllci5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2NsYXNzZXMvdGV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2NsYXNzZXMvdGlsZS5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2NvbmZpZy5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2RiLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvZ2FtZS5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2dhbWVsb29wLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL3NlcnZlci5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL3V0aWwuanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZXhwcmVzc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImZzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiaHR0cFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcIm1vbmdvanNcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJub2RlLWdhbWVsb29wXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicGF0aFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInNvY2tldC5pb1wiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsNklBQXFEO0FBQ3RFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLG1CQUFtQjtBQUNuQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwrREFBK0Q7O0FBRS9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUVBQW1FOztBQUVuRTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxzQkFBc0I7QUFDdEIsR0FBRzs7QUFFSDs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJOztBQUVKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTs7QUFFSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEseURBQXlEOztBQUV6RCwyQkFBMkI7QUFDM0Isa0ZBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9CQUFvQiw4SUFBc0Q7QUFDMUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EseUJBQXlCLG1KQUEyRDtBQUNwRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrRUFBa0U7QUFDbEU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlGQUFxQyx1RUFBMkI7QUFDaEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQiwwRUFBOEI7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esc0JBQXNCO0FBQ3RCOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQix1RkFBMkM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQiwwRUFBOEI7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDclFBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRTtBQUNBLEM7Ozs7Ozs7Ozs7Ozs7OztBQzNEQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNiQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNyS0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLG9FQUF3QjtBQUN6QztBQUNBLGtCQUFrQixpRUFBcUI7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCLGlFQUFxQjtBQUN0QyxrQkFBa0Isb0VBQXdCO0FBQzFDLG1CQUFtQixtRUFBdUI7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxpQkFBaUIsaUVBQXFCO0FBQ3RDO0FBQ0Esa0JBQWtCLG9FQUF3QjtBQUMxQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUJBQWlCLG1FQUF1QjtBQUN4QztBQUNBOztBQUVBO0FBQ0E7QUFDQSxDOzs7Ozs7Ozs7Ozs7OztBQ2xJQTtBQUNBO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDVEE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxvQ0FBb0M7QUFDcEMsc0NBQXNDO0FBQ3RDLDBDQUEwQztBQUMxQywwQ0FBMEM7QUFDMUM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0Esc0JBQXNCOztBQUV0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFHQUF5RCxVQUFVLFdBQVcsYUFBYTtBQUMzRjtBQUNBLDJHQUErRCxVQUFVLFVBQVUsYUFBYTtBQUNoRztBQUNBO0FBQ0E7QUFDQTtBQUNBLCtGQUFtRCxVQUFVLGNBQWMsYUFBYTtBQUN4Riw0R0FBZ0UsWUFBWSxLQUFLLGFBQWE7QUFDOUY7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQix1RkFBMkM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7Ozs7Ozs7Ozs7Ozs7QUNyTUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ3hDQTtBQUFBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDakNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE9BQU87QUFDUCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQSxlQUFlO0FBQ2YsT0FBTztBQUNQLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQSxlQUFlO0FBQ2YsT0FBTztBQUNQLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQSxlQUFlO0FBQ2YsT0FBTztBQUNQLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQSxlQUFlO0FBQ2YsT0FBTztBQUNQLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQSxlQUFlO0FBQ2YsT0FBTztBQUNQLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQSxlQUFlO0FBQ2YsT0FBTztBQUNQLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQSxlQUFlO0FBQ2YsT0FBTztBQUNQLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQSxlQUFlO0FBQ2YsT0FBTztBQUNQLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQSxlQUFlO0FBQ2YsT0FBTztBQUNQLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQSxlQUFlO0FBQ2YsT0FBTztBQUNQOztBQUVBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw0QkFBNEIsbUJBQW1CO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvREFBb0QsU0FBUztBQUM3RDtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBOztBQUVBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM1V0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0JBQWtCLGtFQUFzQjtBQUN4QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QixZQUFZO0FBQ3pDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsWUFBWTtBQUMxQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM1SUE7QUFBQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0EseUU7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDckNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwrR0FBbUUsc0JBQXNCOztBQUV6RjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyRUFBK0IsVUFBVTs7QUFFekM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlFQUE2QixHQUFHO0FBQ2hDOztBQUVBLGM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJOztBQUVKO0FBQ0E7QUFDQTtBQUNBLElBQUk7O0FBRUo7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7OztBQzFGQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxpQkFBaUIsbUJBQW1CO0FBQ3BDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRzs7Ozs7Ozs7Ozs7QUN6REEsb0M7Ozs7Ozs7Ozs7O0FDQUEsK0I7Ozs7Ozs7Ozs7O0FDQUEsaUM7Ozs7Ozs7Ozs7O0FDQUEsb0M7Ozs7Ozs7Ozs7O0FDQUEsMEM7Ozs7Ozs7Ozs7O0FDQUEsaUM7Ozs7Ozs7Ozs7O0FDQUEsc0MiLCJmaWxlIjoic2VydmVyLmFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc2VydmVyL3NyYy9tYWluLmpzXCIpO1xuIiwiaW1wb3J0IGRiIGZyb20gJy4uL2RiLmpzJztcclxuaW1wb3J0IGdhbWUgZnJvbSAnLi4vZ2FtZS5qcyc7XHJcbmltcG9ydCBjb25maWcgZnJvbSAnLi4vY29uZmlnLmpzJztcclxuaW1wb3J0IHV0aWwgZnJvbSAnLi4vdXRpbC5qcyc7XHJcbmltcG9ydCBFbnRpdHkgZnJvbSAnLi9lbnRpdHkuanMnO1xyXG5cclxuLy8gQW4gQWN0b3IgaXMgYW4gRW50aXR5IHdoaWNoIGNhbiBtb3ZlLCBhdHRhY2sgYW5kIGludGVyYWN0IHdpdGggaXRlbXNcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFjdG9yIGV4dGVuZHMgRW50aXR5IHtcclxuXHRjb25zdHJ1Y3RvcihtYXBJZCwgeCwgeSwgbmFtZSwgc3ByaXRlKSB7XHJcblx0XHRzcHJpdGUgPSB1dGlsLmNsYW1wKHNwcml0ZSwgMSwgY29uZmlnLk1BWF9TUFJJVEVTKTtcclxuXHJcblx0XHRzdXBlcihtYXBJZCwgeCwgeSwgc3ByaXRlKTtcclxuXHRcdHRoaXMuY29udHJvbGxlciA9ICdib3QnO1xyXG5cdFx0dGhpcy5uYW1lID0gbmFtZTtcclxuXHJcblx0XHR0aGlzLmludmVudG9yeSA9IFtdO1xyXG5cclxuXHRcdHRoaXMuY2FsY1N0YXRzKCk7XHJcblx0XHR0aGlzLnJlc3RvcmUoKTtcclxuXHJcblx0XHR0aGlzLmRpcmVjdGlvbiA9ICdkb3duJztcclxuXHRcdHRoaXMuc3RhcnRYID0gdGhpcy54O1xyXG5cdFx0dGhpcy5zdGFydFkgPSB0aGlzLnk7XHJcblx0XHR0aGlzLmRlc3RpbmF0aW9uWCA9IHRoaXMueDtcclxuXHRcdHRoaXMuZGVzdGluYXRpb25ZID0gdGhpcy55O1xyXG5cdFx0dGhpcy5sZXJwID0gMDtcclxuXHJcblx0XHR0aGlzLmlzTW92aW5nID0gZmFsc2U7XHJcblx0XHR0aGlzLmlzUnVubmluZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy5tb3ZlU3BlZWQgPSAyLjU7XHJcblx0XHR0aGlzLm1vdmVtZW50VGltZXIgPSAwO1xyXG5cdFx0dGhpcy5sYXppbmVzcyA9IDA7XHJcblxyXG5cdFx0dGhpcy5pc0F0dGFja2luZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy5hdHRhY2tTcGVlZCA9IDE7XHJcblx0XHR0aGlzLmF0dGFja1RpbWVyID0gMDtcdFxyXG5cdFx0dGhpcy50YXJnZXQgPSBudWxsO1xyXG5cdFx0dGhpcy5raWxscyA9IDA7XHJcblx0XHR0aGlzLmRlYXRocyA9IDA7XHJcblxyXG5cdFx0dGhpcy5pc0RlYWQgPSBmYWxzZTtcclxuXHRcdHRoaXMucmVzcGF3blRpbWVyID0gMDtcclxuXHRcdHRoaXMucmVzcGF3blNwZWVkID0gMTA7XHJcblx0XHR0aGlzLnJlc3Bhd25NYXAgPSBtYXBJZDtcclxuXHRcdHRoaXMucmVzcGF3blggPSB4O1xyXG5cdFx0dGhpcy5yZXNwYXduWSA9IHk7XHJcblx0fVxyXG5cdFxyXG5cdC8vIENoYXJhY3RlciBTdGF0c1xyXG5cdGdldCBkYW1hZ2UoKSB7XHJcblx0XHRpZiAodGhpcy5kYW1hZ2VCYXNlICsgdGhpcy5kYW1hZ2VCb251cyA8IDApIHtcclxuXHRcdFx0cmV0dXJuIDA7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuZGFtYWdlQmFzZSArIHRoaXMuZGFtYWdlQm9udXM7XHJcblx0XHR9XHJcblx0fVxyXG5cdGdldCBkZWZlbmNlKCkge1xyXG5cdFx0aWYgKHRoaXMuZGVmZW5jZUJhc2UgKyB0aGlzLmRlZmVuY2VCb251cyA8IDApIHtcclxuXHRcdFx0cmV0dXJuIDA7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuZGVmZW5jZUJhc2UgKyB0aGlzLmRlZmVuY2VCb251cztcclxuXHRcdH1cclxuXHR9XHJcblx0Z2V0IGhlYWx0aE1heCgpIHtcclxuXHRcdGlmICh0aGlzLmhlYWx0aE1heEJhc2UgKyB0aGlzLmhlYWx0aE1heEJvbnVzIDwgMSkge1xyXG5cdFx0XHRyZXR1cm4gMTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5oZWFsdGhNYXhCYXNlICsgdGhpcy5oZWFsdGhNYXhCb251cztcclxuXHRcdH1cclxuXHR9XHJcblx0Z2V0IGVuZXJneU1heCgpIHtcclxuXHRcdGlmICh0aGlzLmVuZXJneU1heEJhc2UgKyB0aGlzLmVuZXJneU1heEJvbnVzIDwgMCkge1xyXG5cdFx0XHRyZXR1cm4gMDtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5lbmVyZ3lNYXhCYXNlICsgdGhpcy5lbmVyZ3lNYXhCb251cztcclxuXHRcdH1cclxuXHR9XHJcblx0Z2V0IHJhbmdlKCkge1xyXG5cdFx0aWYgKHRoaXMucmFuZ2VCYXNlICsgdGhpcy5yYW5nZUJvbnVzIDwgMSkge1xyXG5cdFx0XHRyZXR1cm4gMTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5yYW5nZUJhc2UgKyB0aGlzLnJhbmdlQm9udXM7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRjYWxjQmFzZVN0YXRzKCkge1x0Ly8gQ2xhc3MgYW5kIExldmVsXHJcblx0XHQvL1RPRE86IGNoZWNrIGRiIGZvciBjbGFzcyBzdGF0czogYmFzZSBhbmQgaW5jcmVhc2UgcGVyIGxldmVsXHJcblx0XHQvLyB0aGlzLmRhbWFnZUJhc2UgPSBwbGF5ZXJDbGFzcy5kYW1hZ2VCYXNlICsgKHBsYXllckNsYXNzLmluY3JlYXNlUGVyTGV2ZWwuZGFtYWdlICogdGhpcy5sZXZlbCk7XHJcblx0XHR0aGlzLmRhbWFnZUJhc2UgPSA1O1xyXG5cdFx0dGhpcy5kZWZlbmNlQmFzZSA9IDA7XHJcblx0XHR0aGlzLmhlYWx0aE1heEJhc2UgPSAxMDtcclxuXHRcdHRoaXMuZW5lcmd5TWF4QmFzZSA9IDQwO1xyXG5cdFx0dGhpcy5yYW5nZUJhc2UgPSAxO1xyXG5cdH1cclxuXHJcblx0Y2FsY0l0ZW1Cb251cygpIHtcclxuXHRcdGxldCBpdGVtQm9udXMgPSB7XHJcblx0XHRcdGRhbWFnZTogMCxcclxuXHRcdFx0ZGVmZW5jZTogMCxcclxuXHRcdFx0aGVhbHRoTWF4OiAwLFxyXG5cdFx0XHRlbmVyZ3lNYXg6IDAsXHJcblx0XHRcdHJhbmdlOiAwXHJcblx0XHR9O1xyXG5cclxuXHRcdC8vIEZvciBlYWNoIGl0ZW0gaW4gaW52ZW50b3J5IGNoZWNrIGZvciBib251c2VzXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IChjb25maWcuSU5WRU5UT1JZX1NJWkUgKyBjb25maWcuRVFVSVBNRU5UX1NJWkUpOyBpKyspIHtcclxuXHRcdFx0bGV0IGl0ZW0gPSB0aGlzLmludmVudG9yeVtpXTtcclxuXHRcdFx0aWYgKGl0ZW0gJiYgIWl0ZW0ucmVtb3ZlKSB7XHJcblx0XHRcdFx0aXRlbUJvbnVzLmRhbWFnZSArPSBpdGVtLnBhc3NpdmVEYW1hZ2U7XHJcblx0XHRcdFx0aXRlbUJvbnVzLmRlZmVuY2UgKz0gaXRlbS5wYXNzaXZlRGVmZW5jZTtcclxuXHRcdFx0XHRpdGVtQm9udXMuaGVhbHRoTWF4ICs9IGl0ZW0ucGFzc2l2ZUhlYWx0aE1heDtcclxuXHRcdFx0XHRpdGVtQm9udXMuZW5lcmd5TWF4ICs9IGl0ZW0ucGFzc2l2ZUVuZXJneU1heDtcclxuXHRcdFx0XHRpdGVtQm9udXMucmFuZ2UgKz0gaXRlbS5wYXNzaXZlUmFuZ2U7XHJcblxyXG5cdFx0XHRcdGlmIChpID49IGNvbmZpZy5JTlZFTlRPUllfU0laRSkge1xyXG5cdFx0XHRcdFx0aXRlbUJvbnVzLmRhbWFnZSArPSBpdGVtLmVxdWlwRGFtYWdlO1xyXG5cdFx0XHRcdFx0aXRlbUJvbnVzLmRlZmVuY2UgKz0gaXRlbS5lcXVpcERlZmVuY2U7XHJcblx0XHRcdFx0XHRpdGVtQm9udXMuaGVhbHRoTWF4ICs9IGl0ZW0uZXF1aXBIZWFsdGhNYXg7XHJcblx0XHRcdFx0XHRpdGVtQm9udXMuZW5lcmd5TWF4ICs9IGl0ZW0uZXF1aXBFbmVyZ3lNYXg7XHJcblx0XHRcdFx0XHRpdGVtQm9udXMucmFuZ2UgKz0gaXRlbS5lcXVpcFJhbmdlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gaXRlbUJvbnVzO1xyXG5cdH1cclxuXHJcblx0Y2FsY0VmZmVjdEJvbnVzKCkge1xyXG5cdFx0bGV0IGVmZmVjdEJvbnVzID0ge1xyXG5cdFx0XHRkYW1hZ2U6IDAsXHJcblx0XHRcdGRlZmVuY2U6IDAsXHJcblx0XHRcdGhlYWx0aE1heDogMCxcclxuXHRcdFx0ZW5lcmd5TWF4OiAwLFxyXG5cdFx0XHRyYW5nZTogMFxyXG5cdFx0fTtcclxuXHJcblx0XHQvLyBUT0RPOiB3b3JrIG91dCBob3cgdG8gZG8gZWZmZWN0cyBmb3Igc3BlbGxzIGFuZCBwb3Rpb25zXHJcblx0XHRyZXR1cm4gZWZmZWN0Qm9udXM7XHJcblx0fVxyXG5cdFxyXG5cdGNhbGNCb251c1N0YXRzKCkge1x0Ly8gSXRlbXMgKGVxdWlwcGVkIGFuZCBwYXNzaXZlKSBhbmQgRWZmZWN0cyAoc3BlbGxzIGFuZCBwb3Rpb25zKVxyXG5cdFx0bGV0IGl0ZW1Cb251cyA9IHRoaXMuY2FsY0l0ZW1Cb251cygpO1xyXG5cdFx0bGV0IGVmZmVjdEJvbnVzID0gdGhpcy5jYWxjRWZmZWN0Qm9udXMoKTtcclxuXHJcblx0XHR0aGlzLmRhbWFnZUJvbnVzID0gaXRlbUJvbnVzLmRhbWFnZSArIGVmZmVjdEJvbnVzLmRhbWFnZTtcclxuXHRcdHRoaXMuZGVmZW5jZUJvbnVzID0gaXRlbUJvbnVzLmRlZmVuY2UgKyBlZmZlY3RCb251cy5kZWZlbmNlO1xyXG5cdFx0dGhpcy5oZWFsdGhNYXhCb251cyA9IGl0ZW1Cb251cy5oZWFsdGhNYXggKyBlZmZlY3RCb251cy5oZWFsdGhNYXg7XHJcblx0XHR0aGlzLmVuZXJneU1heEJvbnVzID0gaXRlbUJvbnVzLmVuZXJneU1heCArIGVmZmVjdEJvbnVzLmVuZXJneU1heDtcclxuXHRcdHRoaXMucmFuZ2VCb251cyA9IGl0ZW1Cb251cy5yYW5nZSArIGVmZmVjdEJvbnVzLnJhbmdlO1xyXG5cdH1cclxuXHJcblx0Y2FsY1N0YXRzKCkge1xyXG5cdFx0dGhpcy5jYWxjQmFzZVN0YXRzKCk7XHJcblx0XHR0aGlzLmNhbGNCb251c1N0YXRzKCk7XHJcblx0fVxyXG5cclxuXHRyZXN0b3JlKCkge1xyXG5cdFx0dGhpcy5oZWFsdGggPSB0aGlzLmhlYWx0aE1heDtcclxuXHRcdHRoaXMuZW5lcmd5ID0gdGhpcy5lbmVyZ3lNYXg7XHJcblx0fVxyXG5cdFxyXG5cdC8vIE1vdmVtZW50XHJcblx0bW92ZShkaXJlY3Rpb24pIHtcclxuXHRcdGlmICh0aGlzLmlzTW92aW5nKSByZXR1cm47XHJcblxyXG5cdFx0aWYgKGRpcmVjdGlvbikge1xyXG5cdFx0XHR0aGlzLmRpcmVjdGlvbiA9IGRpcmVjdGlvbjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoZGlyZWN0aW9uID09PSAnbGVmdCcpIHtcclxuXHRcdFx0aWYgKCFnYW1lLmlzVmFjYW50KHRoaXMubWFwSWQsIHRoaXMueCAtIDEsIHRoaXMueSkpIHJldHVybjtcclxuXHRcdFx0dGhpcy5kZXN0aW5hdGlvblgtLTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ3JpZ2h0Jykge1xyXG5cdFx0XHRpZiAoIWdhbWUuaXNWYWNhbnQodGhpcy5tYXBJZCwgdGhpcy54ICsgMSwgdGhpcy55KSkgcmV0dXJuO1xyXG5cdFx0XHR0aGlzLmRlc3RpbmF0aW9uWCsrO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoZGlyZWN0aW9uID09PSAndXAnKSB7XHJcblx0XHRcdGlmICghZ2FtZS5pc1ZhY2FudCh0aGlzLm1hcElkLCB0aGlzLngsIHRoaXMueSAtIDEpKSByZXR1cm47XHJcblx0XHRcdHRoaXMuZGVzdGluYXRpb25ZLS07XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdkb3duJykge1xyXG5cdFx0XHRpZiAoIWdhbWUuaXNWYWNhbnQodGhpcy5tYXBJZCwgdGhpcy54LCB0aGlzLnkgKyAxKSkgcmV0dXJuO1xyXG5cdFx0XHR0aGlzLmRlc3RpbmF0aW9uWSsrO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHN3aXRjaCAodXRpbC5yYW5kb21JbnQoMCwgMyArIHRoaXMubGF6aW5lc3MpKSB7XHJcblx0XHRcdFx0Y2FzZSAwOiB0aGlzLm1vdmUoJ2xlZnQnKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIDE6IHRoaXMubW92ZSgncmlnaHQnKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIDI6IHRoaXMubW92ZSgndXAnKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIDM6IHRoaXMubW92ZSgnZG93bicpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGRlZmF1bHQ6IC8vIERvbid0IE1vdmVcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gU2V0IG1vdmUgc3BlZWRcclxuXHRcdGlmICh0aGlzLmlzUnVubmluZykge1xyXG5cdFx0XHRpZiAodGhpcy5lbmVyZ3kgPiAwKSB7XHJcblx0XHRcdFx0dGhpcy5lbmVyZ3ktLTtcclxuXHRcdFx0XHR0aGlzLm1vdmVTcGVlZCA9IDQ7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5lbmVyZ3kgPSAwO1xyXG5cdFx0XHRcdHRoaXMubW92ZVNwZWVkID0gMi41O1xyXG5cdFx0XHRcdHRoaXMuaXNSdW5uaW5nID0gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHR0aGlzLm1vdmVTcGVlZCA9IDIuNTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dGhpcy5pc01vdmluZyA9IHRydWU7XHJcblx0fVxyXG5cdFxyXG5cdG1vdmVUb1RhcmdldCh0YXJnZXQsIGhvc3RpbGUpIHtcclxuXHRcdGlmICghdGFyZ2V0KSByZXR1cm47XHJcblx0XHRcclxuXHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICYmIHRhcmdldC55ID09PSB0aGlzLnkpIHtcclxuXHRcdFx0dGhpcy5tb3ZlKCk7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmICh1dGlsLnJhbmRvbUludCgwLCAxKSA9PT0gMCkge1xyXG5cdFx0XHRpZiAodGFyZ2V0LnggPCB0aGlzLngpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LnggPj0gKHRoaXMueCAtIHRoaXMucmFuZ2UpICYmIHRhcmdldC55ID09PSB0aGlzLnkpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ2xlZnQnO1xyXG5cdFx0XHRcdFx0XHRpZiAoIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmF0dGFjaygnbGVmdCcpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCdsZWZ0Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHRhcmdldC54ID4gdGhpcy54KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggKyB0aGlzLnJhbmdlICYmIHRhcmdldC55ID09PSB0aGlzLnkpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ3JpZ2h0JztcclxuXHRcdFx0XHRcdFx0aWYgKCF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ3JpZ2h0Jyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ3JpZ2h0Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHRhcmdldC55IDwgdGhpcy55KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggJiYgdGFyZ2V0LnkgPT09IHRoaXMueSAtIHRoaXMucmFuZ2UpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ3VwJztcclxuXHRcdFx0XHRcdFx0aWYgKCF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ3VwJyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ3VwJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHRhcmdldC55ID4gdGhpcy55KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggJiYgdGFyZ2V0LnkgPT09IHRoaXMueSArIHRoaXMucmFuZ2UpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ2Rvd24nO1xyXG5cdFx0XHRcdFx0XHRpZiAoIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmF0dGFjaygnZG93bicpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCdkb3duJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0aWYgKHRhcmdldC55ID4gdGhpcy55KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggJiYgdGFyZ2V0LnkgPT09IHRoaXMueSArIHRoaXMucmFuZ2UpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlKSB7XHJcblx0XHRcdFx0XHRcdGlmICghdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCdkb3duJyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ2Rvd24nKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodGFyZ2V0LnkgPCB0aGlzLnkpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LnggPT09IHRoaXMueCAmJiB0YXJnZXQueSA9PT0gdGhpcy55IC0gdGhpcy5yYW5nZSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUpIHtcclxuXHRcdFx0XHRcdFx0aWYgKCF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ3VwJyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ3VwJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHRhcmdldC54ID4gdGhpcy54KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggKyB0aGlzLnJhbmdlICYmIHRhcmdldC55ID09PSB0aGlzLnkpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlKSB7XHJcblx0XHRcdFx0XHRcdGlmICghdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCdyaWdodCcpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCdyaWdodCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICh0YXJnZXQueCA8IHRoaXMueCkge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQueCA+PSAodGhpcy54IC0gdGhpcy5yYW5nZSkgJiYgdGFyZ2V0LnkgPT09IHRoaXMueSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUpIHtcclxuXHRcdFx0XHRcdFx0aWYgKCF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ2xlZnQnKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSgnbGVmdCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHQvLyBDb21iYXRcclxuXHRjaGVja0luUmFuZ2UoZGlyZWN0aW9uLCB0YXJnZXQsIHJhbmdlKSB7XHJcblx0XHRpZiAodGFyZ2V0Lm1hcElkICE9PSB0aGlzLm1hcElkKSByZXR1cm4gZmFsc2U7XHJcblx0XHRpZiAodGFyZ2V0LnggPT09IHRoaXMueCAmJiB0YXJnZXQueSA9PT0gdGhpcy55KSByZXR1cm4gZmFsc2U7XHQvLyBTdGFja2VkIGRvZXMgbm90IGNvdW50IGFzIGluIHJhbmdlXHJcblx0XHRcclxuXHRcdGlmICh0YXJnZXQueSA9PT0gdGhpcy55KSB7XHJcblx0XHRcdGlmIChkaXJlY3Rpb24gPT09ICdsZWZ0Jykge1xyXG5cdFx0XHRcdGlmICh0aGlzLnggPT09IDApIHtcclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gKHRhcmdldC54IDwgdGhpcy54ICYmIHRhcmdldC54ID49ICh0aGlzLnggLSByYW5nZSkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdyaWdodCcpIHtcclxuXHRcdFx0XHRpZiAodGhpcy54ID09PSBjb25maWcuTUFQX0NPTFVNTlMgLSAxKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0cmV0dXJuICh0YXJnZXQueCA+IHRoaXMueCAmJiB0YXJnZXQueCA8PSAodGhpcy54ICsgcmFuZ2UpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKHRhcmdldC54ID09PSB0aGlzLngpIHtcclxuXHRcdFx0aWYgKGRpcmVjdGlvbiA9PT0gJ3VwJykge1xyXG5cdFx0XHRcdGlmICh0aGlzLnkgPT09IDApIHtcclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gKHRhcmdldC55IDwgdGhpcy55ICYmIHRhcmdldC55ID49ICh0aGlzLnkgLSByYW5nZSkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdkb3duJykge1xyXG5cdFx0XHRcdGlmICh0aGlzLnkgPT09IGNvbmZpZy5NQVBfUk9XUyAtIDEpIHtcclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gKHRhcmdldC55ID4gdGhpcy55ICYmIHRhcmdldC55IDw9ICh0aGlzLnkgKyByYW5nZSkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG5cclxuXHRhdHRhY2sobnVtVGFyZ2V0cyA9IDEsIGRpcmVjdGlvbiA9IHRoaXMuZGlyZWN0aW9uKSB7XHJcblx0XHRpZiAodGhpcy5pc0F0dGFja2luZyB8fCB0aGlzLmF0dGFja1RpbWVyID4gMCkgcmV0dXJuO1xyXG5cclxuXHRcdHRoaXMuaXNBdHRhY2tpbmcgPSB0cnVlO1xyXG5cdFx0Ly8gZ2FtZS5zZW5kR2FtZUluZm9HbG9iYWwoXCJURVNUSU5HXCIpO1xyXG5cdFx0Ly8gZ2FtZS5zcGF3bkJvdCh0aGlzLm1hcElkLCB0aGlzLngsIHRoaXMueSwgMSk7XHJcblx0XHRnYW1lLnNwYXduRWZmZWN0KHRoaXMubWFwSWQsIHRoaXMueCwgdGhpcy55LCAwKTtcclxuXHRcdC8vIGdhbWUuc3Bhd25NYXBJdGVtKHRoaXMubWFwSWQsIHRoaXMueCwgdGhpcy55LCAwKTtcclxuXHRcdC8vIGdhbWUuc3Bhd25NYXBJdGVtKHRoaXMubWFwSWQsIHRoaXMueCwgdGhpcy55LCAxKTtcclxuXHRcdC8vIGdhbWUuc3Bhd25EYW1hZ2VUZXh0KHRoaXMubWFwSWQsIHRoaXMueCwgdGhpcy55LCB0aGlzLmRhbWFnZSk7IC8vdGVzdFxyXG5cdFx0XHJcblx0XHRsZXQgYWN0b3JMaXN0ID0gZ2FtZS5wbGF5ZXJMaXN0LmNvbmNhdChnYW1lLm1hcExpc3RbdGhpcy5tYXBJZF0uYm90cyk7XHJcblx0XHRsZXQgdGFyZ2V0TGlzdCA9IGFjdG9yTGlzdC5maWx0ZXIoKGFjdG9yKSA9PiB7XHJcblx0XHRcdGlmIChhY3RvciA9PT0gdGhpcyB8fCBhY3Rvci5pc0RlYWQpIHJldHVybiBmYWxzZTtcclxuXHRcdFx0aWYgKHRoaXMuY2hlY2tJblJhbmdlKGRpcmVjdGlvbiwgYWN0b3IsIHRoaXMucmFuZ2UpKSByZXR1cm4gdHJ1ZTtcclxuXHRcdH0pO1xyXG5cdFx0XHJcblx0XHR0YXJnZXRMaXN0LnNvcnQoKGEsIGIpID0+IHtcclxuXHRcdFx0cmV0dXJuIChhLnogLSBiLnopO1x0Ly8gTG93ZXN0IHRvIGhpZ2hlc3RcclxuXHRcdH0pO1xyXG5cdFx0XHJcblx0XHR0YXJnZXRMaXN0ID0gdGFyZ2V0TGlzdC5zcGxpY2UoLW51bVRhcmdldHMpO1xyXG5cdFx0XHJcblx0XHR0YXJnZXRMaXN0LmZvckVhY2goKHRhcmdldCkgPT4ge1xyXG5cdFx0XHR0YXJnZXQudGFrZURhbWFnZSh0aGlzLmRhbWFnZSwgdGhpcyk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0XHJcblx0dGFrZURhbWFnZShkYW1hZ2UsIHNvdXJjZSkge1xyXG5cdFx0ZGFtYWdlIC09IHRoaXMuZGVmZW5jZTtcclxuXHRcdGlmIChkYW1hZ2UgPCAwKSB7XHJcblx0XHRcdGRhbWFnZSA9IDA7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0dGhpcy5oZWFsdGggLT0gZGFtYWdlO1xyXG5cdFx0XHRpZiAodGhpcy5oZWFsdGggPD0gMCkge1xyXG5cdFx0XHRcdHRoaXMuc2V0RGVhZChzb3VyY2UuY29udHJvbGxlciwgc291cmNlLm5hbWUpO1xyXG5cdFx0XHRcdHNvdXJjZS5raWxscysrO1xyXG5cdFx0XHRcdGlmIChzb3VyY2UudGFyZ2V0ID09PSB0aGlzKSBzb3VyY2UudGFyZ2V0ID0gbnVsbDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Z2FtZS5zcGF3bkRhbWFnZVRleHQodGhpcy5tYXBJZCwgdGhpcy54LCB0aGlzLnksIGRhbWFnZSk7XHJcblx0fVxyXG5cdFxyXG5cdHJlc3Bhd24oKSB7XHJcblx0XHR0aGlzLm1hcElkID0gdGhpcy5yZXNwYXduTWFwO1xyXG5cdFx0dGhpcy54ID0gdGhpcy5yZXNwYXduWDtcclxuXHRcdHRoaXMueSA9IHRoaXMucmVzcGF3blk7XHJcblx0XHR0aGlzLnN0YXJ0WCA9IHRoaXMucmVzcGF3blg7XHJcblx0XHR0aGlzLnN0YXJ0WSA9IHRoaXMucmVzcGF3blk7XHJcblx0XHR0aGlzLmRlc3RpbmF0aW9uWCA9IHRoaXMucmVzcGF3blg7XHJcblx0XHR0aGlzLmRlc3RpbmF0aW9uWSA9IHRoaXMucmVzcGF3blk7XHJcblx0XHRcclxuXHRcdHRoaXMuY2FsY0JvbnVzU3RhdHMoKTtcclxuXHRcdHRoaXMucmVzdG9yZSgpO1xyXG5cdFx0XHJcblx0XHR0aGlzLmlzV2Fsa2luZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy5pc1J1bm5pbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMuaXNBdHRhY2tpbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMuaXNEZWFkID0gZmFsc2U7XHJcblx0XHR0aGlzLnJlc3Bhd25UaW1lciA9IDA7XHJcblx0fVxyXG5cdFxyXG5cdHNldERlYWQoa2lsbGVyQ29udHJvbGxlciwga2lsbGVyTmFtZSkge1xyXG5cdFx0bGV0IG1hcCA9IGdhbWUubWFwTGlzdFt0aGlzLm1hcElkXTtcclxuXHJcblx0XHQvLyBJbnZlbnRvcnkgSXRlbSBEcm9wIENoYW5jZVxyXG5cdFx0bGV0IGRyb3BDaGFuY2UgPSB1dGlsLmNsYW1wKG1hcC5kcm9wQ2hhbmNlLCAwLCAxMDApO1xyXG5cdFx0aWYgKGRyb3BDaGFuY2UgPiAwKSB7XHJcblx0XHRcdGxldCBpdGVtcyA9IHRoaXMuaW52ZW50b3J5LmZpbHRlcigoaXRlbSkgPT4ge1xyXG5cdFx0XHRcdGlmICghaXRlbSkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdGlmIChpdGVtLnNsb3QgPCBjb25maWcuSU5WRU5UT1JZX1NJWkUpIHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XHJcblx0XHRcdFx0aWYgKCFpdGVtKSByZXR1cm47XHJcblx0XHRcdFx0aWYgKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMSkgPD0gZHJvcENoYW5jZSkge1xyXG5cdFx0XHRcdFx0dGhpcy5kcm9wSXRlbShpdGVtLnNsb3QpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gRXF1aXBwZWQgSXRlbSBEcm9wIEFtb3VudFxyXG5cdFx0bGV0IGRyb3BBbW91bnRFUSA9IHV0aWwuY2xhbXAobWFwLmRyb3BBbW91bnRFUSwgMCwgY29uZmlnLkVRVUlQTUVOVF9TSVpFKTtcclxuXHRcdGlmIChkcm9wQW1vdW50RVEgPiAwKSB7XHJcblx0XHRcdGxldCBlcXVpcG1lbnQgPSB0aGlzLmludmVudG9yeS5maWx0ZXIoKGl0ZW0pID0+IHtcclxuXHRcdFx0XHRpZiAoaXRlbS5zbG90ID49IGNvbmZpZy5JTlZFTlRPUllfU0laRSkgcmV0dXJuIHRydWU7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdGVxdWlwbWVudCA9IHV0aWwuc2h1ZmZsZShlcXVpcG1lbnQpO1xyXG5cdFx0XHRlcXVpcG1lbnQuc3BsaWNlKC1kcm9wQW1vdW50RVEpO1xyXG5cdFx0XHRlcXVpcG1lbnQuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuZHJvcEl0ZW0oZXF1aXBtZW50LnNsb3QpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dGhpcy5pc0RlYWQgPSB0cnVlO1xyXG5cdFx0dGhpcy5oZWFsdGggPSAwO1xyXG5cdFx0dGhpcy5lbmVyZ3kgPSAwO1xyXG5cdFx0dGhpcy5kZWF0aHMrKztcclxuXHRcdFxyXG5cdFx0aWYgKGtpbGxlckNvbnRyb2xsZXIgJiYga2lsbGVyTmFtZSkge1xyXG5cdFx0XHRpZiAoa2lsbGVyQ29udHJvbGxlciA9ICdwbGF5ZXInKSB7XHJcblx0XHRcdFx0Z2FtZS5zZW5kR2FtZUluZm9HbG9iYWwoa2lsbGVyTmFtZSArIFwiIGhhcyBtdXJkZXJlZCBcIiArIHRoaXMubmFtZSArIFwiIGluIGNvbGQgYmxvb2QhXCIpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdGdhbWUuc2VuZEdhbWVJbmZvR2xvYmFsKHRoaXMubmFtZSArIFwiIGhhcyBiZWVuIGtpbGxlZCBieSBcIiArIGtpbGxlck5hbWUgKyBcIiFcIik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRnYW1lLnNlbmRHYW1lSW5mb0dsb2JhbCh0aGlzLm5hbWUgKyBcIiBoYXMgZGllZCFcIik7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdC8vIEludmVudG9yeVxyXG5cdHBpY2tVcCgpIHtcclxuXHRcdC8vIFNlZSBQbGF5ZXIgYW5kIEJvdCBjbGFzc2VzXHJcblx0fVxyXG5cdFxyXG5cdGdldE1hcEl0ZW0obWFwSWQsIGlkKSB7XHJcblx0XHRsZXQgaXRlbSA9IGdhbWUubWFwTGlzdFttYXBJZF0uaXRlbXNbaWRdO1xyXG5cdFx0aWYgKCFpdGVtKSByZXR1cm4gbnVsbDtcclxuXHJcblx0XHRpZiAoaXRlbS5zdGFjayA+IDApIHtcclxuXHRcdFx0bGV0IHNsb3QgPSB0aGlzLmZpbmRJdGVtU2xvdChpdGVtLml0ZW1DbGFzcyk7XHJcblx0XHRcdGlmIChzbG90ID49IDApIHtcclxuXHRcdFx0XHR0aGlzLmludmVudG9yeVtzbG90XS5zdGFjayArPSBpdGVtLnN0YWNrO1xyXG5cdFx0XHRcdGl0ZW0ucmVtb3ZlKCk7XHJcblx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRsZXQgc2xvdCA9IHRoaXMuZmluZEZpcnN0RW1wdHlTbG90KCk7XHJcblx0XHRyZXR1cm4gc2xvdDtcclxuXHR9XHJcblxyXG5cdGdldEl0ZW0oZGF0YSkge1xyXG5cdFx0aWYgKCFkYXRhIHx8IGRhdGEuaXRlbUNsYXNzID09IG51bGwpIHJldHVybiBudWxsO1xyXG5cclxuXHRcdGlmIChkYXRhLnN0YWNrKSB7XHJcblx0XHRcdHNsb3QgPSB0aGlzLmZpbmRJdGVtU2xvdChkYXRhLml0ZW1DbGFzcyk7XHJcblx0XHRcdGlmIChzbG90ID49IDApIHtcclxuXHRcdFx0XHR0aGlzLmludmVudG9yeVtzbG90XS5zdGFjayArPSBkYXRhLnN0YWNrO1xyXG5cdFx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuZmluZEZpcnN0RW1wdHlTbG90KCk7XHJcblx0fVxyXG5cdFxyXG5cdGRyb3BJdGVtKHNsb3QpIHtcclxuXHRcdGxldCBpdGVtID0gdGhpcy5pbnZlbnRvcnlbc2xvdF07XHJcblx0XHRpZiAoIWl0ZW0pIHJldHVybjtcclxuXHRcdFxyXG5cdFx0aWYgKHNsb3QgPj0gY29uZmlnLklOVkVOVE9SWV9TSVpFKSB7XHJcblx0XHRcdHRoaXMudW5lcXVpcEl0ZW0oc2xvdCk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpdGVtLm1vdmVUb01hcCh0aGlzLm1hcElkLCB0aGlzLngsIHRoaXMueSk7XHJcblx0fVxyXG5cdFxyXG5cdHVzZUl0ZW0oc2xvdCkge1xyXG5cdFx0bGV0IGl0ZW0gPSB0aGlzLmludmVudG9yeVtzbG90XTtcclxuXHRcdGlmICghaXRlbSkgcmV0dXJuO1xyXG5cclxuXHRcdC8vIGlmICghZGIuaXRlbXNbaXRlbS5pZF0udXNlLmNhbGwodGhpcywgc2xvdCkpIHJldHVybjtcdC8vIFJ1biAndXNlJyBzY3JpcHRcclxuXHJcblx0XHRpZiAoaXRlbS5pc0VxdWlwbWVudCgpKSB7XHQvLyBFcXVpcG1lbnQgSXRlbXNcclxuXHRcdFx0aWYgKHNsb3QgPCBjb25maWcuSU5WRU5UT1JZX1NJWkUpIHtcdC8vIENoZWNrIGlmIGl0ZW0gaXMgZXF1aXBwZWRcclxuXHRcdFx0XHR0aGlzLmVxdWlwSXRlbShzbG90KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHR0aGlzLnVuZXF1aXBJdGVtKHNsb3QpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoaXRlbS5yZXVzYWJsZSkgcmV0dXJuO1xyXG5cdFx0XHJcblx0XHRpZiAoaXRlbS5zdGFjayA+IDEpIHtcclxuXHRcdFx0aXRlbS5zdGFjay0tO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aXRlbS5yZW1vdmUoKTtcclxuXHR9XHJcblx0XHJcblx0aGFzSXRlbShpdGVtQ2xhc3MpIHtcclxuXHRcdGxldCBjb3VudCA9IDA7XHJcblx0XHRmb3IgKGxldCBzbG90ID0gMDsgc2xvdCA8IGNvbmZpZy5JTlZFTlRPUllfU0laRSArIGNvbmZpZy5FUVVJUE1FTlRfU0laRTsgc2xvdCsrKSB7XHJcblx0XHRcdGlmICh0aGlzLmludmVudG9yeVtzbG90XSkge1xyXG5cdFx0XHRcdGlmICh0aGlzLmludmVudG9yeVtzbG90XS5pdGVtQ2xhc3MgPT09IGl0ZW1DbGFzcykge1xyXG5cdFx0XHRcdFx0Y291bnQrKztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBjb3VudDtcclxuXHR9XHJcblxyXG5cdGZpbmRJdGVtU2xvdChpdGVtQ2xhc3MpIHtcclxuXHRcdGxldCBzbG90ID0gbnVsbDtcclxuXHRcdGZvciAobGV0IGNoZWNrU2xvdCA9IDA7IGNoZWNrU2xvdCA8IGNvbmZpZy5JTlZFTlRPUllfU0laRSArIGNvbmZpZy5FUVVJUE1FTlRfU0laRTsgY2hlY2tTbG90KyspIHtcclxuXHRcdFx0aWYgKHRoaXMuaW52ZW50b3J5W2NoZWNrU2xvdF0pIHtcclxuXHRcdFx0XHRpZiAodGhpcy5pbnZlbnRvcnlbY2hlY2tTbG90XS5pdGVtQ2xhc3MgPT09IGl0ZW1DbGFzcykge1xyXG5cdFx0XHRcdFx0c2xvdCA9IGNoZWNrU2xvdDtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHNsb3Q7XHJcblx0fVxyXG5cdFxyXG5cdG1vdmVJdGVtVG9TbG90KHNsb3QsIG5ld1Nsb3QpIHtcclxuXHRcdGlmIChzbG90ID09IG51bGwgfHwgbmV3U2xvdCA9PSBudWxsIHx8IHNsb3QgPT09IG5ld1Nsb3QpIHJldHVybjtcdC8vIG51bGwgPT0gdW5kZWZpbmVkLCBudWxsICE9IDBcclxuXHRcdGlmIChzbG90ID49IGNvbmZpZy5JTlZFTlRPUllfU0laRSArIGNvbmZpZy5FUVVJUE1FTlRfU0laRSkgcmV0dXJuO1xyXG5cdFx0aWYgKG5ld1Nsb3QgPj0gY29uZmlnLklOVkVOVE9SWV9TSVpFICsgY29uZmlnLkVRVUlQTUVOVF9TSVpFKSByZXR1cm47XHJcblxyXG5cdFx0bGV0IGl0ZW0gPSB0aGlzLmludmVudG9yeVtzbG90XTtcclxuXHRcdGxldCBuZXdJdGVtID0gdGhpcy5pbnZlbnRvcnlbbmV3U2xvdF07XHJcblx0XHRpZiAoIWl0ZW0pIHJldHVybjtcclxuXHJcblx0XHQvLyBUYXJnZXQgc2xvdCBpcyBmb3IgZXF1aXBtZW50IC0gY2hlY2sgdHlwZSBtYXRjaGVzXHJcblx0XHRpZiAobmV3U2xvdCA+PSBjb25maWcuSU5WRU5UT1JZX1NJWkUpIHtcclxuXHRcdFx0aWYgKCFpdGVtLmNhbkVxdWlwKG5ld1Nsb3QpKSB7XHJcblx0XHRcdFx0Z2FtZS5zZW5kR2FtZUluZm9QbGF5ZXIodGhpcy5pZCwgXCJUaGF0IGNhbm5vdCBiZSBlcXVpcHBlZCB0aGVyZS5cIik7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3Qgc3dhcFNsb3RzID0gKCkgPT4ge1xyXG5cdFx0XHRpdGVtLnNsb3QgPSBuZXdTbG90O1xyXG5cdFx0XHRpZiAobmV3SXRlbSkgbmV3SXRlbS5zbG90ID0gc2xvdDtcclxuXHRcdFx0dXRpbC5zd2FwKHRoaXMuaW52ZW50b3J5LCBzbG90LCBuZXdTbG90KTtcclxuXHRcdFx0dGhpcy5jYWxjQm9udXNTdGF0cygpO1xyXG5cdFx0fTtcclxuXHJcblx0XHQvLyBJRiBObyBuZXcgaXRlbSBpbiBuZXcgc2xvdFxyXG5cdFx0Ly8gT1IgTmV3IGl0ZW0gaW4gbmV3IHNsb3QsIG9sZCBpdGVtIGluIGludmVudG9yeVxyXG5cdFx0Ly8gT1IgTmV3IGl0ZW0gaW4gbmV3IHNsb3QsIG9sZCBpdGVtIGlzIGVxdWlwcGVkLCBuZXcgaXRlbSBjYW4gYmUgZXF1aXBwZWQgaW4gb2xkIHNsb3RcclxuXHRcdGlmICghbmV3SXRlbSB8fCBzbG90IDwgY29uZmlnLklOVkVOVE9SWV9TSVpFIHx8IG5ld0l0ZW0uY2FuRXF1aXAoc2xvdCkpIHtcclxuXHRcdFx0c3dhcFNsb3RzKCk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Ly8gT2xkIGl0ZW0gaXMgZXF1aXBwZWQsIG5ldyBpdGVtIGNhbm5vdCBiZSBlcXVpcHBlZCBpbiBvbGQgc2xvdFxyXG5cdFx0XHRuZXdTbG90ID0gdGhpcy5maW5kRmlyc3RFbXB0eVNsb3QoKTtcclxuXHRcdFx0aWYgKG5ld1Nsb3QgIT0gbnVsbCkge1xyXG5cdFx0XHRcdHN3YXBTbG90cygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdGdhbWUuc2VuZEdhbWVJbmZvUGxheWVyKHRoaXMuaWQsIFwiWW91ciBpbnZlbnRvcnkgaXMgZnVsbC5cIik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGVxdWlwSXRlbShzbG90KSB7XHJcblx0XHRsZXQgbmV3U2xvdCA9IG51bGw7XHJcblx0XHRmb3IgKGxldCBpID0gY29uZmlnLklOVkVOVE9SWV9TSVpFOyBpIDwgY29uZmlnLkVRVUlQTUVOVF9TSVpFOyBpKyspIHtcclxuXHRcdFx0aWYgKGl0ZW0uY2FuRXF1aXAoaSkpIHtcclxuXHRcdFx0XHRuZXdTbG90ID0gaTtcclxuXHRcdFx0XHRpZiAoIXRoaXMuaW52ZW50b3J5W2ldKSBicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aWYgKG5ld1Nsb3QgPT09IG51bGwpIHJldHVybjtcclxuXHJcblx0XHR0aGlzLm1vdmVJdGVtVG9TbG90KHNsb3QsIG5ld1Nsb3QpO1xyXG5cdH1cclxuXHJcblx0dW5lcXVpcEl0ZW0oc2xvdCkge1xyXG5cdFx0aWYgKHNsb3QgPCBjb25maWcuSU5WRU5UT1JZX1NJWkUpIHJldHVybjtcclxuXHRcdGlmICghdGhpcy5pbnZlbnRvcnlbc2xvdF0pIHJldHVybjtcclxuXHRcdFxyXG5cdFx0bGV0IG5ld1Nsb3QgPSB0aGlzLmZpbmRGaXJzdEVtcHR5U2xvdCgpO1xyXG5cdFx0aWYgKG5ld1Nsb3QgPT0gbnVsbCkge1xyXG5cdFx0XHRnYW1lLnNlbmRHYW1lSW5mb1BsYXllcih0aGlzLmlkLCBcIllvdXIgaW52ZW50b3J5IGlzIGZ1bGwuXCIpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5tb3ZlSXRlbVRvU2xvdChzbG90LCBuZXdTbG90KTtcclxuXHR9XHJcblx0XHJcblx0ZmluZEZpcnN0RW1wdHlTbG90KCkge1xyXG5cdFx0Zm9yIChsZXQgc2xvdCA9IDA7IHNsb3QgPCBjb25maWcuSU5WRU5UT1JZX1NJWkU7IHNsb3QrKykge1xyXG5cdFx0XHRpZiAodGhpcy5pbnZlbnRvcnlbc2xvdF0gPT0gbnVsbCkgcmV0dXJuIHNsb3Q7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9XHJcblxyXG5cclxuXHR1cGRhdGUoZGVsdGEpIHtcclxuXHRcdC8vIEludmVudG9yeSBJdGVtIFVwZGF0ZVxyXG5cdFx0dGhpcy5pbnZlbnRvcnkuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG5cdFx0XHRpZiAoIWl0ZW0pIHJldHVybjtcclxuXHRcdFx0aXRlbS51cGRhdGUoKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8vIFJlc3Bhd25pbmdcclxuXHRcdGlmICh0aGlzLmlzRGVhZCkge1xyXG5cdFx0XHR0aGlzLnJlc3Bhd25UaW1lciArPSBkZWx0YTtcclxuXHRcdFx0aWYgKHRoaXMucmVzcGF3blRpbWVyID49IHRoaXMucmVzcGF3blNwZWVkKSB0aGlzLnJlc3Bhd24oKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBBdHRhY2tpbmdcclxuXHRcdGlmICh0aGlzLmlzQXR0YWNraW5nIHx8IHRoaXMuYXR0YWNrVGltZXIgPiAwKSB7XHJcblx0XHRcdHRoaXMuYXR0YWNrVGltZXIgKz0gZGVsdGE7XHJcblx0XHRcdGlmICh0aGlzLmF0dGFja1RpbWVyID49IDAuMykgdGhpcy5pc0F0dGFja2luZyA9IGZhbHNlO1xyXG5cdFx0XHRpZiAodGhpcy5hdHRhY2tUaW1lciA+PSB0aGlzLmF0dGFja1NwZWVkKSB0aGlzLmF0dGFja1RpbWVyID0gMDtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly8gTW92ZW1lbnRcclxuXHRcdGlmICh0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdHRoaXMubGVycCArPSBkZWx0YSAqIHRoaXMubW92ZVNwZWVkO1xyXG5cdFx0XHRcclxuXHRcdFx0aWYgKHRoaXMubGVycCA+PSAwLjQ5KSB7XHJcblx0XHRcdFx0dGhpcy54ID0gdGhpcy5kZXN0aW5hdGlvblg7XHJcblx0XHRcdFx0dGhpcy55ID0gdGhpcy5kZXN0aW5hdGlvblk7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdGlmICh0aGlzLmxlcnAgPj0gMC45OSkge1xyXG5cdFx0XHRcdHRoaXMuc3RhcnRYID0gdGhpcy5kZXN0aW5hdGlvblg7XHJcblx0XHRcdFx0dGhpcy5zdGFydFkgPSB0aGlzLmRlc3RpbmF0aW9uWTtcclxuXHRcdFx0XHR0aGlzLmxlcnAgPSAwO1xyXG5cdFx0XHRcdHRoaXMuaXNNb3ZpbmcgPSBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Z2V0SW52ZW50b3J5UGFjaygpIHtcclxuXHRcdGxldCBpbnZlbnRvcnlQYWNrID0gW107XHJcblx0XHRcclxuXHRcdHRoaXMuaW52ZW50b3J5LmZvckVhY2goKGl0ZW0pID0+IHtcclxuXHRcdFx0aWYgKCFpdGVtKSByZXR1cm47XHJcblx0XHRcdGludmVudG9yeVBhY2tbaXRlbS5zbG90XSA9IGl0ZW0uZ2V0UGFjaygpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIGludmVudG9yeVBhY2s7XHJcblx0fVxyXG59XHJcbiIsImltcG9ydCBkYiBmcm9tICcuLi9kYi5qcyc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4uL2dhbWUuanMnO1xyXG5pbXBvcnQgY29uZmlnIGZyb20gJy4uL2NvbmZpZy5qcyc7XHJcbmltcG9ydCB1dGlsIGZyb20gJy4uL3V0aWwuanMnO1xyXG5pbXBvcnQgQWN0b3IgZnJvbSAnLi9hY3Rvci5qcyc7XHJcblxyXG4vLyBBIEJvdCBpcyBhbiBBY3RvciB3aXRoIGNvbmRpdGlvbmFsIGlucHV0c1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQm90IGV4dGVuZHMgQWN0b3Ige1xyXG5cdGNvbnN0cnVjdG9yKGRhdGEpIHtcclxuXHRcdFxyXG5cdFx0bGV0IGNsYXNzRGF0YSA9IGRiLmdldEJvdERhdGEoZGF0YS5ib3RDbGFzcyk7XHJcblx0XHRpZiAoIWRhdGEubmFtZSkgZGF0YS5uYW1lID0gY2xhc3NEYXRhLm5hbWU7XHJcblx0XHRpZiAoZGF0YS5zcHJpdGUgPT0gbnVsbCkgZGF0YS5zcHJpdGUgPSBjbGFzc0RhdGEuc3ByaXRlO1xyXG5cdFx0aWYgKGRhdGEuaG9zdGlsZSA9PSBudWxsKSBkYXRhLmhvc3RpbGUgPSBjbGFzc0RhdGEuaG9zdGlsZTtcclxuXHRcdGlmIChkYXRhLmRhbWFnZUJhc2UgPT0gbnVsbCkgZGF0YS5kYW1hZ2VCYXNlID0gY2xhc3NEYXRhLmRhbWFnZUJhc2U7XHJcblx0XHRpZiAoZGF0YS5kZWZlbmNlQmFzZSA9PSBudWxsKSBkYXRhLmRlZmVuY2VCYXNlID0gY2xhc3NEYXRhLmRlZmVuY2VCYXNlO1xyXG5cdFx0aWYgKGRhdGEuaGVhbHRoTWF4QmFzZSA9PSBudWxsKSBkYXRhLmhlYWx0aE1heEJhc2UgPSBjbGFzc0RhdGEuaGVhbHRoTWF4QmFzZTtcclxuXHRcdGlmIChkYXRhLmVuZXJneU1heEJhc2UgPT0gbnVsbCkgZGF0YS5lbmVyZ3lNYXhCYXNlID0gY2xhc3NEYXRhLmVuZXJneU1heEJhc2U7XHJcblx0XHRpZiAoZGF0YS5yYW5nZUJhc2UgPT0gbnVsbCkgZGF0YS5yYW5nZUJhc2UgPSBjbGFzc0RhdGEucmFuZ2VCYXNlO1xyXG5cdFx0XHJcblx0XHRzdXBlcihkYXRhLm1hcElkLCBkYXRhLngsIGRhdGEueSwgZGF0YS5uYW1lLCBkYXRhLnNwcml0ZSk7XHJcblx0XHRpZiAoZGF0YS5pZCA9PSBudWxsKSBkYXRhLmlkID0gdXRpbC5maXJzdEVtcHR5SW5kZXgoZ2FtZS5tYXBMaXN0W3RoaXMubWFwSWRdLmJvdHMpO1xyXG5cdFx0dGhpcy5pZCA9IGRhdGEuaWQ7XHJcblx0XHR0aGlzLmJvdENsYXNzID0gZGF0YS5ib3RDbGFzcztcclxuXHRcdHRoaXMuaG9zdGlsZSA9IGRhdGEuaG9zdGlsZTtcclxuXHRcdHRoaXMuZGFtYWdlQmFzZSA9IGRhdGEuZGFtYWdlQmFzZTtcclxuXHRcdHRoaXMuZGVmZW5jZUJhc2UgPSBkYXRhLmRlZmVuY2VCYXNlO1xyXG5cdFx0dGhpcy5oZWFsdGhNYXhCYXNlID0gZGF0YS5oZWFsdGhNYXhCYXNlO1xyXG5cdFx0dGhpcy5lbmVyZ3lNYXhCYXNlID0gZGF0YS5lbmVyZ3lNYXhCYXNlO1xyXG5cdFx0dGhpcy5yYW5nZUJhc2UgPSBkYXRhLnJhbmdlQmFzZTtcclxuXHRcdFxyXG5cdFx0dGhpcy50YXJnZXQgPSBudWxsO1xyXG5cdFx0dGhpcy5zZXRUYXNrKCd3YW5kZXJpbmcnKTtcclxuXHRcdHRoaXMubW92ZVRpbWVyID0gMDtcclxuXHJcblx0XHRnYW1lLm1hcExpc3RbdGhpcy5tYXBJZF0uYm90c1t0aGlzLmlkXSA9IHRoaXM7XHJcblx0fVxyXG5cdFxyXG5cdGdldE1hcEl0ZW0obWFwSWQsIGlkKSB7XHJcblx0XHRsZXQgc2xvdCA9IHN1cGVyLmdldE1hcEl0ZW0obWFwSWQsIGlkKTtcclxuXHRcdGlmIChzbG90ID09IG51bGwpIHJldHVybjtcclxuXHRcdFxyXG5cdFx0bGV0IGl0ZW0gPSBnYW1lLm1hcExpc3RbbWFwSWRdLml0ZW1zW2lkXTtcclxuXHRcdGl0ZW0ubW92ZVRvQm90KHRoaXMubWFwSWQsIHRoaXMuaWQsIHNsb3QpO1xyXG5cdH1cclxuXHJcblx0Z2V0SXRlbShkYXRhKSB7XHJcblx0XHRsZXQgc2xvdCA9IHN1cGVyLmdldEl0ZW0oZGF0YSk7XHJcblx0XHRpZiAoc2xvdCA9PSBudWxsKSByZXR1cm47XHJcblxyXG5cdFx0ZGF0YS5vd25lciA9ICdib3QnO1xyXG5cdFx0ZGF0YS5tYXBJZCA9IHRoaXMubWFwSWQ7XHJcblx0XHRkYXRhLmlkID0gdGhpcy5pZDtcclxuXHRcdGRhdGEuc2xvdCA9IHNsb3Q7XHJcblx0XHRuZXcgSXRlbShkYXRhKTtcclxuXHR9XHJcblxyXG5cdHVwZGF0ZShkZWx0YSkge1xyXG5cdFx0c3VwZXIudXBkYXRlKGRlbHRhKTsgXHQvLyBEZWZhdWx0IEFjdG9yIFVwZGF0ZVxyXG5cdFx0aWYgKHRoaXMuaXNEZWFkKSByZXR1cm47XHJcblxyXG5cdFx0dGhpcy5tb3ZlVGltZXIrKztcclxuXHRcdFxyXG5cdFx0Ly8gQUkgSW5wdXRzXHJcblx0XHRzd2l0Y2godGhpcy50YXNrKSB7XHJcblx0XHRcdGNhc2UgJ3dhbmRlcmluZyc6XHRcdC8vIE1vdmUgcmFuZG9tbHlcclxuXHRcdFx0XHR0aGlzLm1vdmUoKTtcclxuXHRcdFx0XHR0aGlzLnBpY2tVcCgpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnZm9sbG93aW5nJzpcdFx0Ly8gTW92ZSB0b3dhcmRzIHRhcmdldFxyXG5cdFx0XHRcdGlmICh0aGlzLnRhcmdldCkge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlVG9UYXJnZXQodGhpcy50YXJnZXQsIGZhbHNlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHQvLyBObyB0YXJnZXRcclxuXHRcdFx0XHRcdHRoaXMuc2V0VGFzaygnd2FuZGVyaW5nJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnYXR0YWNraW5nJzpcdFx0Ly8gTW92ZSB0b3dhcmRzIHRhcmdldCBhbmQgYXR0YWNrXHJcblx0XHRcdFx0aWYgKHRoaXMudGFyZ2V0KSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmVUb1RhcmdldCh0aGlzLnRhcmdldCwgdHJ1ZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly8gTm8gdGFyZ2V0XHJcblx0XHRcdFx0XHR0aGlzLnNldFRhc2soJ3dhbmRlcmluZycpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdC8vIGNhc2UgJ2lkbGUnOlxyXG5cdFx0XHRkZWZhdWx0OiBcdFx0XHRcdFx0Ly8gU3RhbmQgc3RpbGxcclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiB0aGlzLmdldFBhY2soKTtcclxuXHR9XHJcblx0XHJcblx0Z2V0UGFjaygpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGlkOiB0aGlzLmlkLFxyXG5cdFx0XHRuYW1lOiB0aGlzLm5hbWUsXHJcblx0XHRcdHNwcml0ZTogdGhpcy5zcHJpdGUsXHJcblx0XHRcdGRpcmVjdGlvbjogdGhpcy5kaXJlY3Rpb24sXHJcblx0XHRcdG1hcElkOiB0aGlzLm1hcElkLFxyXG5cdFx0XHR4OiB0aGlzLnN0YXJ0WCxcclxuXHRcdFx0eTogdGhpcy5zdGFydFksXHJcblx0XHRcdHo6IHRoaXMueixcclxuXHRcdFx0ZGVzdGluYXRpb25YOiB0aGlzLmRlc3RpbmF0aW9uWCxcclxuXHRcdFx0ZGVzdGluYXRpb25ZOiB0aGlzLmRlc3RpbmF0aW9uWSxcclxuXHRcdFx0bGVycDogdGhpcy5sZXJwLFxyXG5cdFx0XHRpc1J1bm5pbmc6IHRoaXMuaXNSdW5uaW5nLFxyXG5cdFx0XHRpc0F0dGFja2luZzogdGhpcy5pc0F0dGFja2luZyxcclxuXHRcdFx0aXNEZWFkOiB0aGlzLmlzRGVhZCxcclxuXHRcdFx0aXNWaXNpYmxlOiB0aGlzLmlzVmlzaWJsZVxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdHJlbW92ZSgpIHtcclxuXHRcdGRlbGV0ZSBnYW1lLm1hcExpc3RbdGhpcy5tYXBJZF0uYm90c1t0aGlzLmlkXTtcclxuXHR9XHJcblx0XHJcblx0bW92ZShkaXJlY3Rpb24pIHtcclxuXHRcdGxldCBtb3ZlVGltZSA9IDI0O1xyXG5cdFx0aWYgKHRoaXMuaXNSdW5uaW5nKSB7XHJcblx0XHRcdG1vdmVUaW1lID0gMTc7XHJcblx0XHR9XHJcblx0XHRpZiAodGhpcy5tb3ZlVGltZXIgPiBtb3ZlVGltZSAmJiB0aGlzLmF0dGFja1RpbWVyID09PSAwKSB7XHJcblx0XHRcdHN1cGVyLm1vdmUoZGlyZWN0aW9uKTtcclxuXHRcdFx0dGhpcy5tb3ZlVGltZXIgPSAwO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHR0YWtlRGFtYWdlKGRhbWFnZSwgc291cmNlKSB7XHJcblx0XHRpZiAoc291cmNlIGluc3RhbmNlb2YgQWN0b3IpIHtcclxuXHRcdFx0dGhpcy5zZXRUYXNrKCdhdHRhY2tpbmcnLCBzb3VyY2UpO1xyXG5cdFx0fVxyXG5cdFx0c3VwZXIudGFrZURhbWFnZShkYW1hZ2UsIHNvdXJjZSk7XHJcblx0fVxyXG5cdFxyXG5cdHJlc3Bhd24oKSB7XHJcblx0XHRzdXBlci5yZXNwYXduKCk7XHJcblx0XHR0aGlzLnNldFRhc2soJ3dhbmRlcmluZycpO1xyXG5cdH1cclxuXHRcclxuXHRwaWNrVXAoKSB7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGdhbWUubWFwTGlzdFt0aGlzLm1hcElkXS5pdGVtcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRsZXQgaXRlbSA9IGdhbWUubWFwTGlzdFt0aGlzLm1hcElkXS5pdGVtc1tpXTtcclxuXHRcdFx0aWYgKGl0ZW0gJiYgaXRlbS54ID09PSB0aGlzLnggJiYgaXRlbS55ID09PSB0aGlzLnkpIHtcclxuXHRcdFx0XHRsZXQgc2xvdCA9IHRoaXMuZ2V0TWFwSXRlbShpdGVtLm1hcElkLCBpdGVtLmlkKTtcclxuXHRcdFx0XHRpZiAoc2xvdCAhPSBudWxsKSB7XHJcblx0XHRcdFx0XHRpdGVtLm1vdmVUb0JvdCh0aGlzLm1hcElkLCB0aGlzLmlkLCBzbG90KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHQvLyBJbnZlbnRvcnkgZnVsbFxyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHR0aGlzLmNoZWNrQmVzdEVxdWlwbWVudCgpO1xyXG5cdH1cclxuXHRcclxuXHRzZXRUYXNrKHRhc2ssIHRhcmdldCkge1xyXG5cdFx0c3dpdGNoICh0YXNrKSB7XHJcblx0XHRcdGNhc2UgJ3dhbmRlcmluZyc6XHJcblx0XHRcdFx0dGhpcy5sYXppbmVzcyA9IDc7XHJcblx0XHRcdFx0dGhpcy50YXJnZXQgPSBudWxsO1xyXG5cdFx0XHRcdHRoaXMudGFzayA9IHRhc2s7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdmb2xsb3dpbmcnOlxyXG5cdFx0XHRcdGlmICh0YXJnZXQgPT09IG51bGwpIHtcclxuXHRcdFx0XHRcdHRoaXMuc2V0VGFzaygnd2FuZGVyaW5nJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5sYXppbmVzcyA9IDA7XHJcblx0XHRcdFx0XHR0aGlzLnRhcmdldCA9IHRhcmdldDtcclxuXHRcdFx0XHRcdHRoaXMudGFzayA9IHRhc2s7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnYXR0YWNraW5nJzpcclxuXHRcdFx0XHRpZiAodGFyZ2V0ID09PSBudWxsKSB7XHJcblx0XHRcdFx0XHR0aGlzLnNldFRhc2soJ3dhbmRlcmluZycpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubGF6aW5lc3MgPSAwO1xyXG5cdFx0XHRcdFx0dGhpcy50YXJnZXQgPSB0YXJnZXQ7XHJcblx0XHRcdFx0XHR0aGlzLnRhc2sgPSB0YXNrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGRlZmF1bHQ6XHQvL2lkbGluZ1xyXG5cdFx0XHRcdHRoaXMubGF6aW5lc3MgPSA3O1xyXG5cdFx0XHRcdHRoaXMudGFyZ2V0ID0gbnVsbDtcclxuXHRcdFx0XHR0aGlzLnRhc2sgPSAnaWRsZSc7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRjaGVja0Jlc3RFcXVpcG1lbnQoKSB7XHJcblx0XHRmb3IgKGxldCBzbG90ID0gMDsgc2xvdCA8IGNvbmZpZy5JTlZFTlRPUllfU0laRTsgc2xvdCsrKSB7XHJcblx0XHRcdGxldCBpdGVtID0gdGhpcy5pbnZlbnRvcnlbc2xvdF07XHJcblx0XHRcdGlmICghaXRlbSkge1xyXG5cdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRzd2l0Y2ggKGl0ZW0udHlwZSkge1xyXG5cdFx0XHRcdGNhc2UgJ3dlYXBvbic6XHJcblx0XHRcdFx0XHRpZiAodGhpcy5pbnZlbnRvcnlbY29uZmlnLklOVkVOVE9SWV9TSVpFXSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoaXRlbS5kYW1hZ2VCb251cyA+IHRoaXMuaW52ZW50b3J5W2NvbmZpZy5JTlZFTlRPUllfU0laRV0uZGFtYWdlQm9udXMpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmVxdWlwSXRlbShzbG90KTtcclxuXHRcdFx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZXF1aXBJdGVtKHNsb3QpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ3NoaWVsZCc6XHJcblx0XHRcdFx0XHRpZiAodGhpcy5pbnZlbnRvcnlbY29uZmlnLklOVkVOVE9SWV9TSVpFICsgMV0pIHtcclxuXHRcdFx0XHRcdFx0aWYgKGl0ZW0uZGVmZW5jZUJvbnVzID4gdGhpcy5pbnZlbnRvcnlbY29uZmlnLklOVkVOVE9SWV9TSVpFICsgMV0uZGVmZW5jZUJvbnVzKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5lcXVpcEl0ZW0oc2xvdCk7XHJcblx0XHRcdFx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmVxdWlwSXRlbShzbG90KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdhcm1vdXInOlxyXG5cdFx0XHRcdFx0aWYgKHRoaXMuaW52ZW50b3J5W2NvbmZpZy5JTlZFTlRPUllfU0laRSArIDJdKSB7XHJcblx0XHRcdFx0XHRcdGlmIChpdGVtLmRlZmVuY2VCb251cyA+IHRoaXMuaW52ZW50b3J5W2NvbmZpZy5JTlZFTlRPUllfU0laRSArIDJdLmRlZmVuY2VCb251cykge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuZXF1aXBJdGVtKHNsb3QpO1xyXG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5lcXVpcEl0ZW0oc2xvdCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAnaGVsbWV0JzpcclxuXHRcdFx0XHRcdGlmICh0aGlzLmludmVudG9yeVtjb25maWcuSU5WRU5UT1JZX1NJWkUgKyAzXSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoaXRlbS5kZWZlbmNlQm9udXMgPiB0aGlzLmludmVudG9yeVtjb25maWcuSU5WRU5UT1JZX1NJWkUgKyAzXS5kZWZlbmNlQm9udXMpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmVxdWlwSXRlbShzbG90KTtcclxuXHRcdFx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZXF1aXBJdGVtKHNsb3QpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ3JpbmcnOlxyXG5cdFx0XHRcdFx0aWYgKHRoaXMuaW52ZW50b3J5W2NvbmZpZy5JTlZFTlRPUllfU0laRSArIDRdKSB7XHJcblx0XHRcdFx0XHRcdGlmIChpdGVtLmRhbWFnZUJvbnVzID4gdGhpcy5pbnZlbnRvcnlbY29uZmlnLklOVkVOVE9SWV9TSVpFICsgNF0uZGFtYWdlQm9udXMpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmVxdWlwSXRlbShzbG90KTtcclxuXHRcdFx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZXF1aXBJdGVtKHNsb3QpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbiIsImltcG9ydCBFbnRpdHkgZnJvbSAnLi9lbnRpdHkuanMnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuLi9nYW1lLmpzJztcclxuaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9jb25maWcuanMnO1xyXG5pbXBvcnQgdXRpbCBmcm9tICcuLi91dGlsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVmZmVjdCBleHRlbmRzIEVudGl0eSB7XHJcblx0Y29uc3RydWN0b3IobWFwSWQsIHgsIHksIHNwcml0ZSA9IDAsIGxvb3AgPSAwLCBzcGVlZCA9IDEyLCBtYXhGcmFtZSA9IDcsIHN0YXJ0RnJhbWUgPSAwKSB7XHJcblx0XHRzdXBlcihtYXBJZCwgeCwgeSwgdXRpbC5jbGFtcChzcHJpdGUsIDAsIGNvbmZpZy5NQVhfRUZGRUNUUyAtIDEpKTtcclxuXHRcdHRoaXMubWF4RnJhbWUgPSB1dGlsLmNsYW1wKG1heEZyYW1lLCAwLCA3KTtcclxuXHRcdHRoaXMuc3RhcnRGcmFtZSA9IHV0aWwuY2xhbXAoc3RhcnRGcmFtZSwgMCwgdGhpcy5tYXhGcmFtZSk7XHJcblx0XHR0aGlzLmN1cnJlbnRGcmFtZSA9IHRoaXMuc3RhcnRGcmFtZTtcclxuXHRcdFxyXG5cdFx0dGhpcy5sb29wID0gbG9vcDtcclxuXHRcdHRoaXMuc3BlZWQgPSBzcGVlZDtcclxuXHRcdHRoaXMudGltZXIgPSAwO1xyXG5cdFx0XHJcblx0XHR0aGlzLmlkID0gdXRpbC5maXJzdEVtcHR5SW5kZXgoZ2FtZS5tYXBMaXN0W3RoaXMubWFwSWRdLmVmZmVjdHMpO1xyXG5cdFx0Z2FtZS5tYXBMaXN0W3RoaXMubWFwSWRdLmVmZmVjdHNbdGhpcy5pZF0gPSB0aGlzO1xyXG5cdH1cclxuXHRcclxuXHR1cGRhdGUoZGVsdGEpIHtcclxuXHRcdHRoaXMudGltZXIgKz0gZGVsdGE7XHJcblx0XHRcclxuXHRcdGlmICh0aGlzLnRpbWVyID49IDEgLyB0aGlzLnNwZWVkKSB7XHJcblx0XHRcdHRoaXMudGltZXIgPSAwO1xyXG5cdFx0XHR0aGlzLmN1cnJlbnRGcmFtZSsrO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuY3VycmVudEZyYW1lID4gdGhpcy5tYXhGcmFtZSkge1xyXG5cdFx0XHRcdGlmICh0aGlzLmxvb3AgPCAwKSB7XHJcblx0XHRcdFx0XHR0aGlzLmN1cnJlbnRGcmFtZSA9IHRoaXMuc3RhcnRGcmFtZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBpZiAodGhpcy5sb29wID4gMCkge1xyXG5cdFx0XHRcdFx0dGhpcy5jdXJyZW50RnJhbWUgPSB0aGlzLnN0YXJ0RnJhbWU7XHJcblx0XHRcdFx0XHR0aGlzLmxvb3AtLTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLmN1cnJlbnRGcmFtZSA9IHRoaXMubWF4RnJhbWU7XHJcblx0XHRcdFx0XHR0aGlzLnJlbW92ZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0aGlzLmdldFBhY2soKTtcclxuXHR9XHJcblx0XHJcblx0Z2V0UGFjaygpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGlkOiB0aGlzLmlkLFxyXG5cdFx0XHRtYXBJZDogdGhpcy5tYXBJZCxcclxuXHRcdFx0eDogdGhpcy54LFxyXG5cdFx0XHR5OiB0aGlzLnksXHJcblx0XHRcdHNwcml0ZTogdGhpcy5zcHJpdGUsXHJcblx0XHRcdGN1cnJlbnRGcmFtZTogdGhpcy5jdXJyZW50RnJhbWVcclxuXHRcdH07XHJcblx0fVxyXG5cdFxyXG5cdHJlbW92ZSgpIHtcclxuXHRcdGRlbGV0ZSBnYW1lLm1hcExpc3RbdGhpcy5tYXBJZF0uZWZmZWN0c1t0aGlzLmlkXTtcclxuXHR9XHRcclxufSIsImltcG9ydCBjb25maWcgZnJvbSAnLi4vY29uZmlnLmpzJztcclxuXHJcbi8vIEFuIEVudGl0eSBpcyBhbnkgb2JqZWN0IHdoaWNoIGNhbiBhcHBlYXIgb24gdGhlIG1hcFxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW50aXR5IHtcclxuXHRjb25zdHJ1Y3RvcihtYXBJZCwgeCwgeSwgc3ByaXRlID0gMCkge1xyXG5cdFx0dGhpcy5tYXBJZCA9IG1hcElkO1xyXG5cdFx0dGhpcy54ID0geDtcclxuXHRcdHRoaXMueSA9IHk7XHJcblx0XHRpZiAoc3ByaXRlIDwgMCkgc3ByaXRlID0gMDtcclxuXHRcdHRoaXMuc3ByaXRlID0gc3ByaXRlO1xyXG5cdFx0dGhpcy5pc1Zpc2libGUgPSB0cnVlO1xyXG5cdH1cclxufSIsImltcG9ydCBkYiBmcm9tICcuLi9kYi5qcyc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4uL2dhbWUuanMnO1xyXG5pbXBvcnQgdXRpbCBmcm9tICcuLi91dGlsLmpzJztcclxuaW1wb3J0IEVudGl0eSBmcm9tICcuL2VudGl0eS5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJdGVtIGV4dGVuZHMgRW50aXR5IHtcclxuXHRjb25zdHJ1Y3RvcihkYXRhKSB7XHJcblx0XHRpZiAoIWRhdGEub3duZXIgfHwgZGF0YS5pdGVtQ2xhc3MgPT0gbnVsbCB8fCBkYXRhLmlkID09IG51bGwpIHJldHVybjtcclxuXHRcdFxyXG5cdFx0aWYgKGRhdGEub3duZXIgPT09ICdwbGF5ZXInKSB7XHJcblx0XHRcdGlmIChkYXRhLnNsb3QgPT0gbnVsbCkgcmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoZGF0YS5vd25lciA9PT0gJ2JvdCcpIHtcclxuXHRcdFx0aWYgKGRhdGEubWFwSWQgPT0gbnVsbCB8fCBkYXRhLnNsb3QgPT0gbnVsbCkgcmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoZGF0YS5vd25lciA9PT0gJ21hcCcpIHtcclxuXHRcdFx0aWYgKGRhdGEubWFwSWQgPT0gbnVsbCB8fCBkYXRhLnggPT0gbnVsbCB8fCBkYXRhLnkgPT0gbnVsbCkgcmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChkYXRhLm1hcElkID09PSB1bmRlZmluZWQpIGRhdGEubWFwSWQgPSBudWxsO1xyXG5cdFx0aWYgKGRhdGEueCA9PT0gdW5kZWZpbmVkKSBkYXRhLnggPSBudWxsO1xyXG5cdFx0aWYgKGRhdGEueSA9PT0gdW5kZWZpbmVkKSBkYXRhLnkgPSBudWxsO1xyXG5cdFx0aWYgKGRhdGEueiA9PT0gdW5kZWZpbmVkKSBkYXRhLnogPSAtMTA7XHJcblx0XHRpZiAoZGF0YS5zbG90ID09PSB1bmRlZmluZWQpIGRhdGEuc2xvdCA9IG51bGw7XHJcblxyXG5cdFx0bGV0IGNsYXNzRGF0YSA9IGRiLmdldEl0ZW1EYXRhKGRhdGEuaXRlbUNsYXNzKTtcclxuXHRcdGlmIChkYXRhLm5hbWUgPT0gbnVsbCkgZGF0YS5uYW1lID0gY2xhc3NEYXRhLm5hbWU7XHJcblx0XHRpZiAoZGF0YS50eXBlID09IG51bGwpIGRhdGEudHlwZSA9IGNsYXNzRGF0YS50eXBlO1xyXG5cdFx0aWYgKGRhdGEuc3ByaXRlID09IG51bGwpIGRhdGEuc3ByaXRlID0gY2xhc3NEYXRhLnNwcml0ZTtcclxuXHRcdGlmIChkYXRhLnJldXNhYmxlID09IG51bGwpIGRhdGEucmV1c2FibGUgPSBjbGFzc0RhdGEucmV1c2FibGU7XHJcblx0XHRpZiAoZGF0YS5kYW1hZ2VCb251cyA9PSBudWxsKSBkYXRhLmRhbWFnZUJvbnVzID0gY2xhc3NEYXRhLmRhbWFnZUJvbnVzO1xyXG5cdFx0aWYgKGRhdGEuZGVmZW5jZUJvbnVzID09IG51bGwpIGRhdGEuZGVmZW5jZUJvbnVzID0gY2xhc3NEYXRhLmRlZmVuY2VCb251cztcclxuXHRcdGlmIChkYXRhLmhlYWx0aE1heEJvbnVzID09IG51bGwpIGRhdGEuaGVhbHRoTWF4Qm9udXMgPSBjbGFzc0RhdGEuaGVhbHRoTWF4Qm9udXM7XHJcblx0XHRpZiAoZGF0YS5lbmVyZ3lNYXhCb251cyA9PSBudWxsKSBkYXRhLmVuZXJneU1heEJvbnVzID0gY2xhc3NEYXRhLmVuZXJneU1heEJvbnVzO1xyXG5cdFx0aWYgKGRhdGEucmFuZ2VCb251cyA9PSBudWxsKSBkYXRhLnJhbmdlQm9udXMgPSBjbGFzc0RhdGEucmFuZ2VCb251cztcclxuXHRcdGlmIChkYXRhLnN0YWNrID09IG51bGwpIGRhdGEuc3RhY2sgPSBjbGFzc0RhdGEuc3RhY2s7XHJcblxyXG5cdFx0c3VwZXIoZGF0YS5tYXBJZCwgZGF0YS54LCBkYXRhLnksIGRhdGEuc3ByaXRlKTtcclxuXHRcdHRoaXMub3duZXIgPSBkYXRhLm93bmVyO1xyXG5cdFx0dGhpcy5pZCA9IGRhdGEuaWQ7XHJcblx0XHR0aGlzLml0ZW1DbGFzcyA9IGRhdGEuaXRlbUNsYXNzO1xyXG5cdFx0dGhpcy5zdGFjayA9IGRhdGEuc3RhY2s7XHJcblx0XHR0aGlzLnNsb3QgPSBkYXRhLnNsb3Q7XHJcblx0XHR0aGlzLnogPSBkYXRhLno7XHJcblx0XHRcclxuXHRcdHRoaXMubmFtZSA9IGRhdGEubmFtZTtcclxuXHRcdHRoaXMudHlwZSA9IGRhdGEudHlwZTtcclxuXHRcdHRoaXMucmV1c2FibGUgPSBkYXRhLnJldXNhYmxlO1xyXG5cdFx0dGhpcy5kYW1hZ2VCb251cyA9IGRhdGEuZGFtYWdlQm9udXM7XHJcblx0XHR0aGlzLmRlZmVuY2VCb251cyA9IGRhdGEuZGVmZW5jZUJvbnVzO1xyXG5cdFx0dGhpcy5oZWFsdGhNYXhCb251cyA9IGRhdGEuaGVhbHRoTWF4Qm9udXM7XHJcblx0XHR0aGlzLmVuZXJneU1heEJvbnVzID0gZGF0YS5lbmVyZ3lNYXhCb251cztcclxuXHRcdHRoaXMucmFuZ2VCb251cyA9IGRhdGEucmFuZ2VCb251cztcclxuXHJcblx0XHRpZiAoZGF0YS5vd25lciA9PT0gJ21hcCcpIHtcclxuXHRcdFx0Z2FtZS5tYXBMaXN0W3RoaXMubWFwSWRdLml0ZW1zW3RoaXMuaWRdID0gdGhpcztcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKGRhdGEub3duZXIgPT09ICdwbGF5ZXInKSB7XHJcblx0XHRcdGdhbWUucGxheWVyTGlzdFt0aGlzLmlkXS5pbnZlbnRvcnlbdGhpcy5zbG90XSA9IHRoaXM7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChkYXRhLm93bmVyID09PSAnYm90Jykge1xyXG5cdFx0XHRnYW1lLm1hcExpc3RbdGhpcy5tYXBJZF0uYm90c1t0aGlzLmlkXS5pbnZlbnRvcnlbdGhpcy5zbG90XSA9IHRoaXM7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHVwZGF0ZShkZWx0YSkge1xyXG5cdFx0cmV0dXJuIHRoaXMuZ2V0UGFjaygpO1xyXG5cdH1cclxuXHJcblx0Z2V0UGFjaygpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGlkOiB0aGlzLmlkLFxyXG5cdFx0XHRtYXBJZDogdGhpcy5tYXBJZCxcclxuXHRcdFx0eDogdGhpcy54LFxyXG5cdFx0XHR5OiB0aGlzLnksXHJcblx0XHRcdHo6IHRoaXMueixcclxuXHRcdFx0c2xvdDogdGhpcy5zbG90LFxyXG5cdFx0XHRpdGVtQ2xhc3M6IHRoaXMuaXRlbUNsYXNzLFxyXG5cdFx0XHRzdGFjazogdGhpcy5zdGFjayxcclxuXHRcdFx0bmFtZTogdGhpcy5uYW1lLFxyXG5cdFx0XHRzcHJpdGU6IHRoaXMuc3ByaXRlLFxyXG5cdFx0XHR0eXBlOiB0aGlzLnR5cGUsXHJcblx0XHRcdHJldXNhYmxlOiB0aGlzLnJldXNhYmxlLFxyXG5cdFx0XHRkYW1hZ2VCb251czogdGhpcy5kYW1hZ2VCb251cyxcclxuXHRcdFx0ZGVmZW5jZUJvbnVzOiB0aGlzLmRlZmVuY2VCb251cyxcclxuXHRcdFx0aGVhbHRoTWF4Qm9udXM6IHRoaXMuaGVhbHRoTWF4Qm9udXMsXHJcblx0XHRcdGVuZXJneU1heEJvbnVzOiB0aGlzLmVuZXJneU1heEJvbnVzLFxyXG5cdFx0XHRyYW5nZUJvbnVzOiB0aGlzLnJhbmdlQm9udXMsXHJcblx0XHRcdGlzVmlzaWJsZTogdGhpcy5pc1Zpc2libGVcclxuXHRcdH07XHJcblx0fVxyXG5cdFxyXG5cdHJlbW92ZSgpIHtcclxuXHRcdGlmICh0aGlzLm93bmVyID09PSAncGxheWVyJykge1xyXG5cdFx0XHRkZWxldGUgZ2FtZS5wbGF5ZXJMaXN0W3RoaXMuaWRdLmludmVudG9yeVt0aGlzLnNsb3RdO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAodGhpcy5vd25lciA9PT0gJ21hcCcpIHtcclxuXHRcdFx0ZGVsZXRlIGdhbWUubWFwTGlzdFt0aGlzLm1hcElkXS5pdGVtc1t0aGlzLmlkXTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKHRoaXMub3duZXIgPT09ICdib3QnKSB7XHJcblx0XHRcdGRlbGV0ZSBnYW1lLm1hcExpc3RbdGhpcy5tYXBJZF0uYm90c1t0aGlzLmlkXS5pbnZlbnRvcnlbdGhpcy5zbG90XTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0aXNFcXVpcG1lbnQoKSB7XHJcblx0XHRpZiAodGhpcy50eXBlID09PSAnd2VhcG9uJyB8fCB0aGlzLnR5cGUgPT09ICdzaGllbGQnIHx8IHRoaXMudHlwZSA9PT0gJ2FybW91cicgfHwgdGhpcy50eXBlID09PSAnaGVsbWV0JyB8fCB0aGlzLnR5cGUgPT09ICdyaW5nJykge1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRjYW5FcXVpcChzbG90KSB7XHJcblx0XHRpZiAoc2xvdCA9PT0gY29uZmlnLklOVkVOVE9SWV9TSVpFKSB7XHJcblx0XHRcdGlmICh0aGlzLnR5cGUgPT09ICd3ZWFwb24nKSByZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKHNsb3QgPT09IGNvbmZpZy5JTlZFTlRPUllfU0laRSArIDEpIHtcclxuXHRcdFx0aWYgKHRoaXMudHlwZSA9PT0gJ3NoaWVsZCcpIHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoc2xvdCA9PT0gY29uZmlnLklOVkVOVE9SWV9TSVpFICsgMikge1xyXG5cdFx0XHRpZiAodGhpcy50eXBlID09PSAnYXJtb3VyJykgcmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChzbG90ID09PSBjb25maWcuSU5WRU5UT1JZX1NJWkUgKyAzKSB7XHJcblx0XHRcdGlmICh0aGlzLnR5cGUgPT09ICdoZWxtZXQnKSByZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKHNsb3QgPT09IGNvbmZpZy5JTlZFTlRPUllfU0laRSArIDQpIHtcclxuXHRcdFx0aWYgKHRoaXMudHlwZSA9PT0gJ3JpbmcnKSByZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG5cclxuXHRtb3ZlVG9QbGF5ZXIoaWQsIHNsb3QpIHtcclxuXHRcdGlmIChpZCA9PSBudWxsIHx8IHNsb3QgPT0gbnVsbCkgcmV0dXJuO1xyXG5cclxuXHRcdHRoaXMucmVtb3ZlKCk7XHJcblx0XHR0aGlzLm93bmVyID0gJ3BsYXllcic7XHJcblx0XHR0aGlzLmlkID0gaWQ7XHJcblx0XHR0aGlzLnNsb3QgPSBzbG90O1xyXG5cdFx0Z2FtZS5wbGF5ZXJMaXN0W3RoaXMuaWRdLmludmVudG9yeVt0aGlzLnNsb3RdID0gdGhpcztcclxuXHR9XHJcblxyXG5cdG1vdmVUb01hcChtYXBJZCwgeCwgeSkge1xyXG5cdFx0aWYgKG1hcElkID09IG51bGwgfHwgeCA9PSBudWxsIHx8IHkgPT0gbnVsbCkgcmV0dXJuO1xyXG5cclxuXHRcdHRoaXMucmVtb3ZlKCk7XHJcblx0XHR0aGlzLm93bmVyID0gJ21hcCc7XHJcblx0XHR0aGlzLm1hcElkID0gbWFwSWQ7XHJcblx0XHR0aGlzLmlkID0gdXRpbC5maXJzdEVtcHR5SW5kZXgoZ2FtZS5tYXBMaXN0W3RoaXMubWFwSWRdLml0ZW1zKTtcclxuXHRcdHRoaXMueCA9IHg7XHJcblx0XHR0aGlzLnkgPSB5O1xyXG5cdFx0Z2FtZS5tYXBMaXN0W3RoaXMubWFwSWRdLml0ZW1zW3RoaXMuaWRdID0gdGhpcztcclxuXHR9XHJcblxyXG5cdG1vdmVUb0JvdChtYXBJZCwgaWQsIHNsb3QpIHtcclxuXHRcdGlmIChtYXBJZCA9PSBudWxsIHx8IGlkID09IG51bGwgfHwgc2xvdCA9PSBudWxsKSByZXR1cm47XHJcblxyXG5cdFx0dGhpcy5yZW1vdmUoKTtcclxuXHRcdHRoaXMub3duZXIgPSAnYm90JztcclxuXHRcdHRoaXMubWFwSWQgPSBtYXBJZDtcclxuXHRcdHRoaXMuaWQgPSBpZDtcclxuXHRcdHRoaXMuc2xvdCA9IHNsb3Q7XHJcblx0XHRnYW1lLm1hcExpc3RbdGhpcy5tYXBJZF0uYm90c1t0aGlzLmlkXS5pbnZlbnRvcnlbdGhpcy5zbG90XSA9IHRoaXM7XHJcblx0fVxyXG59XHJcbiIsImltcG9ydCBjb25maWcgZnJvbSAnLi4vY29uZmlnLmpzJztcclxuaW1wb3J0IHV0aWwgZnJvbSAnLi4vdXRpbC5qcyc7XHJcbmltcG9ydCBUaWxlIGZyb20gJy4vdGlsZS5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXAge1xyXG5cdGNvbnN0cnVjdG9yKGlkLCBkYXRhKSB7XHJcblx0XHR0aGlzLmlkID0gaWQ7XHJcblxyXG5cdFx0dGhpcy5uYW1lID0gZGF0YS5uYW1lO1xyXG5cdFx0dGhpcy5kcm9wQ2hhbmNlID0gdXRpbC5jbGFtcChkYXRhLmRyb3BDaGFuY2UsIDAsIDEwMCk7XHJcblx0XHQvL3RoaXMuZHJvcENoYW5jZSA9IDAgPSAwJSBjaGFuY2UgdG8gZHJvcCBpdGVtcyBpbiBpbnZlbnRvcnkgKGRyb3Agbm90aGluZyksIDEwMCA9IDEwMCUgY2hhbmNlIHRvIGRyb3AgKGRyb3AgZXZlcnl0aGluZylcclxuXHRcdHRoaXMuZHJvcEFtb3VudEVRID0gdXRpbC5jbGFtcChkYXRhLmRyb3BBbW91bnRFUSwgMCwgY29uZmlnLkVRVUlQTUVOVF9TSVpFKTtcclxuXHRcdC8vdGhpcy5kcm9wQW1vdW50RVEgPSBudW1iZXIgb2YgZXF1aXBwZWQgaXRlbXMgdGhlIHBsYXllciB3aWxsIGRyb3Agb24gZGVhdGguIGRyb3BFUSA9IEVRVUlQTUVOVF9TSVpFID0gZHJvcCBhbGwgZXF1aXBtZW50XHJcblx0XHRcclxuXHRcdHRoaXMuaXRlbXMgPSBkYXRhLml0ZW1zO1xyXG5cdFx0dGhpcy5ib3RzID0gZGF0YS5ib3RzO1xyXG5cdFx0dGhpcy5lZmZlY3RzID0gZGF0YS5lZmZlY3RzO1xyXG5cdFx0dGhpcy50ZXh0cyA9IGRhdGEudGV4dHM7XHJcblx0XHRcclxuXHRcdHRoaXMudGlsZXMgPSBbXTtcclxuXHRcdGZvciAobGV0IHkgPSAwOyB5IDwgY29uZmlnLk1BUF9DT0xVTU5TOyB5KyspIHtcclxuXHRcdFx0dGhpcy50aWxlc1t5XSA9IFtdO1xyXG5cdFx0XHRmb3IgKGxldCB4ID0gMDsgeCA8IGNvbmZpZy5NQVBfUk9XUzsgeCsrKSB7XHJcblx0XHRcdFx0bGV0IHRpbGVEYXRhID0gdGhpcy5nZXRUaWxlRGF0YShkYXRhLCAoeSAqIGNvbmZpZy5NQVBfQ09MVU1OUykgKyB4KTtcclxuXHRcdFx0XHR0aGlzLnRpbGVzW3ldW3hdID0gbmV3IFRpbGUodGlsZURhdGEpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHVwbG9hZCgpIHtcclxuXHRcdGdhbWUubWFwRGF0YVt0aGlzLmlkXSA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKCcuL3NlcnZlci9kYXRhL21hcC5qc29uJywgJ3V0ZjgnKSlbdGhpcy5pZF07XHJcblx0XHRmb3IgKGxldCB5ID0gMDsgeSA8IGNvbmZpZy5NQVBfUk9XUzsgeSsrKSB7XHJcblx0XHRcdGZvciAobGV0IHggPSAwOyB4IDwgY29uZmlnLk1BUF9DT0xVTU5TOyB4KyspIHtcclxuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGNvbmZpZy5NQVBfTEFZRVJTOyBpKyspIHtcclxuXHRcdFx0XHRcdHRoaXMudGlsZXNbeV1beF0ubGF5ZXJbaV0gPSBnYW1lLm1hcERhdGFbdGhpcy5pZF0udGlsZXNbaV1bKHkgKiBjb25maWcuTUFQX0NPTFVNTlMpICsgeF07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRnYW1lLnBsYXllckxpc3QuZm9yRWFjaCgocGxheWVyKSA9PiB7XHJcblx0XHRcdGlmIChwbGF5ZXIubWFwSWQgPT09IHRoaXMuaWQpIHtcclxuXHRcdFx0XHRwbGF5ZXIubG9hZE1hcCgpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblx0XHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHRsZXQgcGFjayA9IHtcclxuXHRcdFx0bmFtZTogdGhpcy5uYW1lLFxyXG5cdFx0XHRpdGVtczogW10sXHJcblx0XHRcdGJvdHM6IFtdLFxyXG5cdFx0XHRlZmZlY3RzOiBbXSxcclxuXHRcdFx0dGV4dHM6IFtdXHJcblx0XHR9O1xyXG5cdFx0XHJcblx0XHR0aGlzLml0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcclxuXHRcdFx0cGFjay5pdGVtc1tpdGVtLmlkXSA9IGl0ZW0udXBkYXRlKGRlbHRhKTtcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5ib3RzLmZvckVhY2goKGJvdCkgPT4ge1xyXG5cdFx0XHRwYWNrLmJvdHNbYm90LmlkXSA9IGJvdC51cGRhdGUoZGVsdGEpO1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLmVmZmVjdHMuZm9yRWFjaCgoZWZmZWN0KSA9PiB7XHJcblx0XHRcdHBhY2suZWZmZWN0c1tlZmZlY3QuaWRdID0gZWZmZWN0LnVwZGF0ZShkZWx0YSk7XHJcblx0XHR9KTtcclxuXHRcdHRoaXMudGV4dHMuZm9yRWFjaCgodGV4dCkgPT4ge1xyXG5cdFx0XHRwYWNrLnRleHRzW3RleHQuaWRdID0gdGV4dC51cGRhdGUoZGVsdGEpO1xyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcdHJldHVybiBwYWNrO1xyXG5cdH1cclxuXHRcclxuXHRnZXRQYWNrKCkge1xyXG5cdFx0bGV0IG1hcFBhY2sgPSB7XHJcblx0XHRcdG5hbWU6IHRoaXMubmFtZSxcclxuXHRcdFx0dGlsZXM6IHRoaXMuZ2V0VGlsZVBhY2soKSxcclxuXHRcdFx0Ym90czogW10sXHJcblx0XHRcdGl0ZW1zOiBbXSxcclxuXHRcdFx0ZWZmZWN0czogW10sXHJcblx0XHRcdHRleHRzOiBbXVxyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLmJvdHMuZm9yRWFjaCgoYm90KSA9PiB7XHJcblx0XHRcdG1hcFBhY2suYm90c1tib3QuaWRdID0gYm90LmdldFBhY2soKTtcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5pdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XHJcblx0XHRcdG1hcFBhY2suaXRlbXNbaXRlbS5pZF0gPSBpdGVtLmdldFBhY2soKTtcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5lZmZlY3RzLmZvckVhY2goKGVmZmVjdCkgPT4ge1xyXG5cdFx0XHRtYXBQYWNrLmVmZmVjdHNbZWZmZWN0LmlkXSA9IGVmZmVjdC5nZXRQYWNrKCk7XHJcblx0XHR9KTtcclxuXHRcdHRoaXMudGV4dHMuZm9yRWFjaCgodGV4dCkgPT4ge1xyXG5cdFx0XHRtYXBQYWNrLnRleHRzW3RleHQuaWRdID0gdGV4dC5nZXRQYWNrKCk7XHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdFx0cmV0dXJuIG1hcFBhY2s7XHJcblx0fVxyXG5cdFxyXG5cdGdldFRpbGVQYWNrKCkge1xyXG5cdFx0bGV0IHRpbGVQYWNrID0gW107XHJcblxyXG5cdFx0Zm9yIChsZXQgeSA9IDA7IHkgPCBjb25maWcuTUFQX1JPV1M7IHkrKykge1xyXG5cdFx0XHR0aWxlUGFja1t5XSA9IFtdO1xyXG5cdFx0XHRmb3IgKGxldCB4ID0gMDsgeCA8IGNvbmZpZy5NQVBfQ09MVU1OUzsgeCsrKSB7XHJcblx0XHRcdFx0dGlsZVBhY2tbeV1beF0gPSB0aGlzLnRpbGVzW3ldW3hdLmdldFBhY2soKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0aWxlUGFjaztcclxuXHR9XHJcblxyXG5cdGdldFRpbGVEYXRhKGRhdGEsIGluZGV4ID0gMCkge1xyXG5cdFx0aWYgKCFkYXRhKSByZXR1cm47XHJcblxyXG5cdFx0bGV0IHRpbGVEYXRhID0ge1xyXG5cdFx0XHRsYXllcjogW10sXHJcblx0XHRcdHdhbGw6IGRhdGEudGlsZXMud2FsbFtpbmRleF0sXHJcblx0XHRcdC8vY2FuQXR0YWNrOiBkYXRhLmNhbkF0dGFja1tpbmRleF0sXHJcblx0XHRcdC8vZGFtYWdlOiBkYXRhLmRhbWFnZVtpbmRleF0sXHJcblx0XHRcdC8vZGVmZW5jZTogZGF0YS5kZWZlbmNlW2luZGV4XSxcclxuXHRcdFx0Ly9oZWFsdGhNYXg6IGRhdGEuaGVhbHRoTWF4W2luZGV4XSxcclxuXHRcdFx0Ly93YXJwTWFwOiBkYXRhLndhcnBNYXBbaW5kZXhdLFxyXG5cdFx0XHQvL3dhcnBYOiBkYXRhLndhcnBYW2luZGV4XSxcclxuXHRcdFx0Ly93YXJwWTogZGF0YS53YXJwWVtpbmRleF1cclxuXHRcdH07XHJcblxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjb25maWcuTUFQX0xBWUVSUzsgaSsrKSB7XHJcblx0XHRcdHRpbGVEYXRhLmxheWVyW2ldID0gZGF0YS50aWxlcy5sYXllcltpXVtpbmRleF07XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRpbGVEYXRhO1xyXG5cdH07XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBNZXNzYWdlIHtcclxuXHRjb25zdHJ1Y3RvcihzZW5kZXJJZCwgbWVzc2FnZSwgdHlwZSwgbWFwSWQsIGlkLCBjb2xvdXIpIHtcclxuXHRcdHRoaXMuc2VuZGVySWQgPSBzZW5kZXJJZDsgLy8gbnVsbCA9IHNlcnZlclxyXG5cdFx0dGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcclxuXHRcdHRoaXMudHlwZSA9IHR5cGU7XHJcblx0XHR0aGlzLm1hcElkID0gbWFwSWQ7XHJcblx0XHR0aGlzLmlkID0gaWQ7XHJcblx0XHR0aGlzLmNvbG91ciA9IGNvbG91cjtcclxuXHR9XHJcbn0iLCJpbXBvcnQgZGIgZnJvbSAnLi4vZGIuanMnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuLi9nYW1lLmpzJztcclxuaW1wb3J0IEFjdG9yIGZyb20gJy4vYWN0b3IuanMnO1xyXG5cclxuLy8gQSBQbGF5ZXIgaXMgYW4gQWN0b3Igd2hpY2ggdGFrZXMgaW5wdXQgZnJvbSBhIGNsaWVudFxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyIGV4dGVuZHMgQWN0b3Ige1xyXG5cdGNvbnN0cnVjdG9yKGlkKSB7XHJcblx0XHRsZXQgZGF0YSA9IGRiLmdldFBsYXllckRhdGEoaWQpO1xyXG5cclxuXHRcdHN1cGVyKGRhdGEubWFwSWQsIGRhdGEueCwgZGF0YS55LCBkYXRhLm5hbWUsIGRhdGEuc3ByaXRlKTtcclxuXHRcdHRoaXMuY29udHJvbGxlciA9ICdwbGF5ZXInO1xyXG5cdFx0dGhpcy5pZCA9IGlkO1xyXG5cdFx0dGhpcy5hZG1pbkFjY2VzcyA9IGRhdGEuYWRtaW5BY2Nlc3M7XHJcblxyXG5cdFx0dGhpcy5kYW1hZ2VCYXNlID0gZGF0YS5kYW1hZ2VCYXNlO1x0XHRcdFx0Ly8gbWluaW11bSBkYW1hZ2UgYSBwbGF5ZXIgY2FuIGhhdmVcclxuXHRcdHRoaXMuZGVmZW5jZUJhc2UgPSBkYXRhLmRlZmVuY2VCYXNlO1x0XHRcdC8vIG1pbmltdW0gZGVmZW5jZSBhIHBsYXllciBjYW4gaGF2ZVxyXG5cdFx0dGhpcy5oZWFsdGhNYXhCYXNlID0gZGF0YS5oZWFsdGhNYXhCYXNlO1x0Ly8gbWF4IGhlYWx0aCB3aXRob3V0IGJvbnVzZXNcclxuXHRcdHRoaXMuZW5lcmd5TWF4QmFzZSA9IGRhdGEuZW5lcmd5TWF4QmFzZTtcdC8vIG1heCBlbmVyZ3kgd2l0aG91dCBib251c2VzXHJcblx0XHR0aGlzLmNhbGNTdGF0cygpO1xyXG5cdFx0dGhpcy5yZXN0b3JlKCk7XHJcblxyXG5cdFx0dGhpcy5zZWxlY3RlZCA9IG51bGw7XHJcblx0XHR0aGlzLmlucHV0ID0ge1xyXG5cdFx0XHRkaXJlY3Rpb246IG51bGwsXHJcblx0XHRcdHJ1bjogZmFsc2UsXHJcblx0XHRcdHBpY2t1cDogZmFsc2UsXHJcblx0XHRcdGF0dGFjazogZmFsc2VcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGxvYWRNYXAoKSB7XHJcblx0XHRcclxuXHR9XHJcblxyXG5cdHVwZGF0ZShkZWx0YSkge1xyXG5cdFx0c3VwZXIudXBkYXRlKGRlbHRhKTtcdFx0Ly8gRGVmYXVsdCBBY3RvciBVcGRhdGVcclxuXHRcdFxyXG5cdFx0aWYgKCF0aGlzLmlzRGVhZCkge1xyXG5cdFx0XHQvLyBDaGVjayBmb3IgQXRhY2sgSW5wdXRcclxuXHRcdFx0aWYgKHRoaXMuaW5wdXQuYXR0YWNrICYmIHRoaXMuYXR0YWNrVGltZXIgPT09IDApIHtcclxuXHRcdFx0XHR0aGlzLmF0dGFjaygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHQvLyBDaGVjayBmb3IgTW92ZW1lbnQgSW5wdXRcclxuXHRcdFx0aWYgKCF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuaW5wdXQuZGlyZWN0aW9uKSB7XHJcblx0XHRcdFx0XHQvLyBDaGVjayBmb3IgUnVuIElucHV0XHJcblx0XHRcdFx0XHRpZiAodGhpcy5pbnB1dC5ydW4pIHtcclxuXHRcdFx0XHRcdFx0aWYgKHRoaXMuZW5lcmd5ID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuaXNSdW5uaW5nID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmlzUnVubmluZyA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5pc1J1bm5pbmcgPSBmYWxzZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHRoaXMubW92ZSh0aGlzLmlucHV0LmRpcmVjdGlvbik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiB0aGlzLmdldFBhY2soKTtcclxuXHR9XHJcblx0XHJcblx0Z2V0UGFjaygpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGlkOiB0aGlzLmlkLFxyXG5cdFx0XHRuYW1lOiB0aGlzLm5hbWUsXHJcblx0XHRcdHNwcml0ZTogdGhpcy5zcHJpdGUsXHJcblx0XHRcdGRpcmVjdGlvbjogdGhpcy5kaXJlY3Rpb24sXHJcblx0XHRcdG1hcElkOiB0aGlzLm1hcElkLFxyXG5cdFx0XHR4OiB0aGlzLnN0YXJ0WCxcclxuXHRcdFx0eTogdGhpcy5zdGFydFksXHJcblx0XHRcdHo6IHRoaXMueixcclxuXHRcdFx0ZGVzdGluYXRpb25YOiB0aGlzLmRlc3RpbmF0aW9uWCxcclxuXHRcdFx0ZGVzdGluYXRpb25ZOiB0aGlzLmRlc3RpbmF0aW9uWSxcclxuXHRcdFx0bGVycDogdGhpcy5sZXJwLFxyXG5cdFx0XHRpc1J1bm5pbmc6IHRoaXMuaXNSdW5uaW5nLFxyXG5cdFx0XHRpc0F0dGFja2luZzogdGhpcy5pc0F0dGFja2luZyxcclxuXHRcdFx0aXNEZWFkOiB0aGlzLmlzRGVhZCxcclxuXHRcdFx0aXNWaXNpYmxlOiB0aGlzLmlzVmlzaWJsZVxyXG5cdFx0fTtcclxuXHR9XHJcblx0XHJcblx0Z2V0UHJpdmF0ZVBhY2soKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRpZDogdGhpcy5pZCxcclxuXHRcdFx0aGVhbHRoOiB0aGlzLmhlYWx0aCxcclxuXHRcdFx0aGVhbHRoTWF4OiB0aGlzLmhlYWx0aE1heCxcclxuXHRcdFx0ZW5lcmd5OiB0aGlzLmVuZXJneSxcclxuXHRcdFx0ZW5lcmd5TWF4OiB0aGlzLmVuZXJneU1heCxcclxuXHRcdFx0bW92ZVNwZWVkOiB0aGlzLm1vdmVTcGVlZCxcclxuXHRcdFx0YXR0YWNrU3BlZWQ6IHRoaXMuYXR0YWNrU3BlZWQsXHJcblx0XHRcdGF0dGFja1RpbWVyOiB0aGlzLmF0dGFja1RpbWVyLFxyXG5cdFx0XHRpbnZlbnRvcnk6IHRoaXMuZ2V0SW52ZW50b3J5UGFjaygpXHJcblx0XHR9O1xyXG5cdH1cclxuXHRcclxuXHRjaGVja0FkbWluKGFjY2VzcyA9IDEpIHtcclxuXHRcdGlmIChhY2Nlc3MgPCAxKSBhY2Nlc3MgPSAxO1xyXG5cdFx0cmV0dXJuICh0aGlzLmFkbWluQWNjZXNzID49IGFjY2Vzcyk7XHJcblx0fVxyXG5cclxuXHRvbklucHV0KGRhdGEpIHtcclxuXHRcdHN3aXRjaCAoZGF0YS5pbnB1dCkge1xyXG5cdFx0XHRjYXNlIG51bGw6XHJcblx0XHRcdGNhc2UgJ21vdmUnOiB0aGlzLmlucHV0LmRpcmVjdGlvbiA9IGRhdGEuZGlyZWN0aW9uO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAncnVuJzogdGhpcy5pbnB1dC5ydW4gPSBkYXRhLnN0YXRlO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAncGlja3VwJzpcclxuXHRcdFx0XHRpZiAoIXRoaXMuaW5wdXQucGlja3VwICYmIGRhdGEuc3RhdGUpIHtcclxuXHRcdFx0XHRcdHRoaXMucGlja1VwKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMuaW5wdXQucGlja3VwID0gZGF0YS5zdGF0ZTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ2F0dGFjayc6XHJcblx0XHRcdFx0dGhpcy5pbnB1dC5hdHRhY2sgPSBkYXRhLnN0YXRlO1xyXG5cdFx0XHRcdGlmICghdGhpcy5pc0RlYWQpIHRoaXMuYXR0YWNrKDEsIHRoaXMuZGlyZWN0aW9uKTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ2RvdWJsZUNsaWNrSXRlbSc6XHJcblx0XHRcdFx0aWYgKHRoaXMuaW52ZW50b3J5W2RhdGEuc2xvdF0pIHtcclxuXHRcdFx0XHRcdGlmICghdGhpcy5pc0RlYWQpIHRoaXMudXNlSXRlbShkYXRhLnNsb3QpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ3JpZ2h0Q2xpY2tJdGVtJzpcclxuXHRcdFx0XHRpZiAodGhpcy5pbnZlbnRvcnlbZGF0YS5zbG90XSkge1xyXG5cdFx0XHRcdFx0aWYgKCF0aGlzLmlzRGVhZCkgdGhpcy5kcm9wSXRlbShkYXRhLnNsb3QpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ2RyYWdTdG9wR2FtZSc6XHJcblx0XHRcdFx0aWYgKHRoaXMuaW52ZW50b3J5W2RhdGEuc2xvdF0pIHtcclxuXHRcdFx0XHRcdGlmICghdGhpcy5pc0RlYWQpIHRoaXMuZHJvcEl0ZW0oZGF0YS5zbG90KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdkcmFnU3RvcEludmVudG9yeSc6XHJcblx0XHRcdGNhc2UgJ2RyYWdTdG9wRXF1aXBtZW50JzpcclxuXHRcdFx0XHRpZiAodGhpcy5pbnZlbnRvcnlbZGF0YS5zbG90XSkge1xyXG5cdFx0XHRcdFx0aWYgKCF0aGlzLmlzRGVhZCkgdGhpcy5tb3ZlSXRlbVRvU2xvdChkYXRhLnNsb3QsIGRhdGEubmV3U2xvdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnc2VydmVyQ2hhdCc6IGdhbWUuc2VuZE1lc3NhZ2VHbG9iYWwodGhpcy5pZCwgYCR7dGhpcy5uYW1lfSB5ZWxscywgXCIke2RhdGEubWVzc2FnZX1cImApO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnbWFwQ2hhdCc6IGdhbWUuc2VuZE1lc3NhZ2VNYXAodGhpcy5pZCwgdGhpcy5tYXBJZCwgYCR7dGhpcy5uYW1lfSBzYXlzLCBcIiR7ZGF0YS5tZXNzYWdlfVwiYCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdwbGF5ZXJDaGF0JzpcclxuXHRcdFx0XHRsZXQgdGFyZ2V0ID0gdGhpcy5wbGF5ZXJMaXN0W2RhdGEudGFyZ2V0SWRdO1xyXG5cdFx0XHRcdGlmICh0YXJnZXQpIHtcclxuXHRcdFx0XHRcdGdhbWUuc2VuZE1lc3NhZ2VQbGF5ZXIodGhpcy5pZCwgdGFyZ2V0LmlkLCBgJHt0aGlzLm5hbWV9IHdoaXNwZXJzLCBcIiR7ZGF0YS5tZXNzYWdlfVwiYCk7XHJcblx0XHRcdFx0XHRnYW1lLnNlbmRNZXNzYWdlUGxheWVyKHRoaXMuaWQsIHRoaXMuaWQsIGBZb3Ugd2hpc3BlciB0byAke3RhcmdldC5uYW1lfSwgXCIke2RhdGEubWVzc2FnZX1cImApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHQvLyBHb2QgSW5wdXRzXHJcblx0XHRcdGNhc2UgJ3NwYXduSXRlbSc6XHJcblx0XHRcdFx0aWYgKHRoaXMuY2hlY2tBZG1pbigyKSkge1xyXG5cdFx0XHRcdFx0Z2FtZS5zcGF3bk1hcEl0ZW0oZGF0YS5tYXBJZCwgZGF0YS54LCBkYXRhLnksIGRhdGEudHlwZSwgZGF0YS5zdGFjayk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0Z2FtZS5zZW5kR2FtZUluZm9QbGF5ZXIodGhpcy5pZCwgYFlvdSBkb24ndCBoYXZlIGFjY2VzcyB0byB0aGF0IGNvbW1hbmQuYCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAndXBsb2FkTWFwJzpcclxuXHRcdFx0XHRpZiAodGhpcy5jaGVja0FkbWluKDIpKSB7XHJcblx0XHRcdFx0XHRnYW1lLm1hcExpc3RbZGF0YS5tYXBJZF0udXBsb2FkKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0Z2FtZS5zZW5kR2FtZUluZm9QbGF5ZXIodGhpcy5pZCwgYFlvdSBkb24ndCBoYXZlIGFjY2VzcyB0byB0aGF0IGNvbW1hbmQuYCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHBpY2tVcCgpIHtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgZ2FtZS5tYXBMaXN0W3RoaXMubWFwSWRdLml0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGxldCBpdGVtID0gZ2FtZS5tYXBMaXN0W3RoaXMubWFwSWRdLml0ZW1zW2ldO1xyXG5cdFx0XHRpZiAoaXRlbSAmJiBpdGVtLnggPT09IHRoaXMueCAmJiBpdGVtLnkgPT09IHRoaXMueSkge1xyXG5cdFx0XHRcdGxldCBzbG90ID0gdGhpcy5nZXRNYXBJdGVtKGl0ZW0ubWFwSWQsIGl0ZW0uaWQpO1xyXG5cdFx0XHRcdGlmIChzbG90ICE9IG51bGwpIHtcclxuXHRcdFx0XHRcdGl0ZW0ubW92ZVRvUGxheWVyKHRoaXMuaWQsIHNsb3QpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdC8vIEludmVudG9yeSBmdWxsXHJcblx0XHRcdFx0XHRnYW1lLnNlbmRHYW1lSW5mb1BsYXllcih0aGlzLmlkLCBcIllvdXIgaW52ZW50b3J5IGlzIGZ1bGwuXCIpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXNwYXduKCkge1xyXG5cdFx0c3VwZXIucmVzcGF3bigpO1xyXG5cdFx0Z2FtZS5zZW5kR2FtZUluZm9QbGF5ZXIodGhpcy5pZCwgXCJUaGUgQW5nZWwgb2YgTWVyY3kgaGFzIHNhdmVkIHlvdXIgc291bC5cIik7XHJcblx0fVxyXG59IiwiaW1wb3J0IGdhbWUgZnJvbSAnLi4vZ2FtZS5qcyc7XHJcbmltcG9ydCB1dGlsIGZyb20gJy4uL3V0aWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGV4dCB7XHJcblx0Y29uc3RydWN0b3IobWFwSWQsIHgsIHksIG1lc3NhZ2UsIGNvbG91ciA9ICcjMDAwMDAwJywgZGlzcGxheVRpbWUgPSAyLCB2ZWxYID0gMCwgdmVsWSA9IDApIHtcclxuXHRcdHRoaXMubWFwSWQgPSBtYXBJZDtcclxuXHRcdHRoaXMueCA9IHg7XHJcblx0XHR0aGlzLnkgPSB5O1xyXG5cdFx0dGhpcy52ZWxYID0gdmVsWDtcclxuXHRcdHRoaXMudmVsWSA9IHZlbFk7XHJcblx0XHR0aGlzLmxlcnBYID0gMDtcclxuXHRcdHRoaXMubGVycFkgPSAwO1xyXG5cclxuXHRcdHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XHJcblx0XHR0aGlzLmNvbG91ciA9IGNvbG91cjtcclxuXHRcdHRoaXMuZGlzcGxheVRpbWUgPSBkaXNwbGF5VGltZTtcclxuXHRcdHRoaXMudGltZXIgPSAwO1xyXG5cclxuXHRcdHRoaXMuaWQgPSB1dGlsLmZpcnN0RW1wdHlJbmRleChnYW1lLm1hcExpc3RbdGhpcy5tYXBJZF0udGV4dHMpO1xyXG5cdFx0Z2FtZS5tYXBMaXN0W3RoaXMubWFwSWRdLnRleHRzW3RoaXMuaWRdID0gdGhpcztcclxuXHR9XHJcblx0XHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHR0aGlzLnRpbWVyICs9IGRlbHRhO1xyXG5cdFx0aWYgKHRoaXMuZGlzcGxheVRpbWUgPiAwICYmIHRoaXMudGltZXIgPiB0aGlzLmRpc3BsYXlUaW1lKSB7XHJcblx0XHRcdHRoaXMucmVtb3ZlKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5sZXJwWCArPSBkZWx0YSAqIHRoaXMudmVsWDtcclxuXHRcdHRoaXMubGVycFkgKz0gZGVsdGEgKiB0aGlzLnZlbFk7XHJcblxyXG5cdFx0aWYgKHRoaXMubGVycFggPCAtMSkge1xyXG5cdFx0XHR0aGlzLmxlcnBYKys7XHJcblx0XHRcdHRoaXMueC0tO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAodGhpcy5sZXJwWCA+IDEpIHtcclxuXHRcdFx0dGhpcy5sZXJwWC0tO1xyXG5cdFx0XHR0aGlzLngrKztcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5sZXJwWSA8IC0xKSB7XHJcblx0XHRcdHRoaXMubGVycFkrKztcclxuXHRcdFx0dGhpcy55LS07XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmICh0aGlzLmxlcnBZID4gMSkge1xyXG5cdFx0XHR0aGlzLmxlcnBZLS07XHJcblx0XHRcdHRoaXMueSsrO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gdGhpcy5nZXRQYWNrKCk7XHJcblx0fVxyXG5cdFxyXG5cdGdldFBhY2soKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRpZDogdGhpcy5pZCxcclxuXHRcdFx0bWFwSWQ6IHRoaXMubWFwSWQsXHJcblx0XHRcdHg6IHRoaXMueCxcclxuXHRcdFx0eTogdGhpcy55LFxyXG5cdFx0XHRsZXJwWDogdGhpcy5sZXJwWCxcclxuXHRcdFx0bGVycFk6IHRoaXMubGVycFksXHJcblx0XHRcdG1lc3NhZ2U6IHRoaXMubWVzc2FnZSxcclxuXHRcdFx0Y29sb3VyOiB0aGlzLmNvbG91clxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdHJlbW92ZSgpIHtcclxuXHRcdGRlbGV0ZSBnYW1lLm1hcExpc3RbdGhpcy5tYXBJZF0udGV4dHNbdGhpcy5pZF07XHJcblx0fVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbGUge1xyXG5cdGNvbnN0cnVjdG9yKGRhdGEpIHtcclxuXHRcdHRoaXMubGF5ZXIgPSBkYXRhLmxheWVyO1xyXG4gICAgdGhpcy53YWxsID0gZGF0YS53YWxsO1xyXG4gICAgdGhpcy5jYW5BdHRhY2sgPSBkYXRhLmNhbkF0dGFjaztcclxuICAgIHRoaXMuZGFtYWdlID0gZGF0YS5kYW1hZ2U7XHJcblx0XHR0aGlzLmRlZmVuY2UgPSBkYXRhLmRlZmVuY2U7XHJcblx0XHR0aGlzLmhlYWx0aE1heCA9IGRhdGEuaGVhbHRoTWF4O1xyXG5cdFx0dGhpcy5oZWFsdGggPSB0aGlzLmhlYWx0aE1heDtcclxuXHJcblx0XHR0aGlzLndhcnBNYXAgPSBkYXRhLndhcnBNYXA7XHJcblx0XHR0aGlzLndhcnBYID0gZGF0YS53YXJwWDtcclxuXHRcdHRoaXMud2FycFkgPSBkYXRhLndhcnBZO1xyXG4gIH1cclxuXHJcblx0b25XYWxrKCkge1xyXG5cdFx0Ly8gUnVuIE1hcFdhbGsjX3hfeSBzY3JpcHRcclxuICB9XHJcbiAgXHJcblx0b25DbGljaygpIHtcclxuXHRcdC8vIFJ1biBNYXBDbGljayNfeF95IHNjcmlwdFxyXG4gIH1cclxuICBcclxuXHRvbkF0dGFjaygpIHtcclxuXHRcdC8vIFJ1biBNYXBBdHRhY2sjX3hfeSBzY3JpcHRcclxuICB9XHJcbiAgXHJcbiAgZ2V0UGFjaygpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGxheWVyOiB0aGlzLmxheWVyLFxyXG4gICAgICB3YWxsOiB0aGlzLndhbGwsXHJcbiAgICAgIGNhbkF0dGFjazogdGhpcy5jYW5BdHRhY2ssXHJcbiAgICAgIGRhbWFnZTogdGhpcy5kYW1hZ2UsXHJcbiAgICAgIGRlZmVuY2U6IHRoaXMuZGVmZW5jZSxcclxuICAgICAgaGVhbHRoTWF4OiB0aGlzLmhlYWx0aE1heCxcclxuICAgICAgd2FycE1hcDogdGhpcy53YXJwTWFwLFxyXG4gICAgICB3YXJwWDogdGhpcy53YXJwWCxcclxuICAgICAgd2FycFk6IHRoaXMud2FycFlcclxuICAgIH07XHJcbiAgfVxyXG59XHJcbiIsImNvbnN0IGNvbmZpZyA9IHt9O1xyXG5cclxuY29uZmlnLlBPUlQgPSAyMDAwO1xyXG5jb25maWcuRlJBTUVSQVRFID0gMTAwMCAvIDYwO1xyXG5jb25maWcuQkFDS1VQX1RJTUUgPSA1O1xyXG5cclxuY29uZmlnLk1BUF9MQVlFUlMgPSA2O1xyXG5jb25maWcuTUFQX0NPTFVNTlMgPSAxMjtcclxuY29uZmlnLk1BUF9ST1dTID0gMTI7XHJcblxyXG5jb25maWcuTUFYX01BUFMgPSAxMDtcclxuY29uZmlnLk1BWF9VU0VSUyA9IDEwMDtcclxuY29uZmlnLk1BWF9TUFJJVEVTID0gMTM7XHJcbmNvbmZpZy5NQVhfRUZGRUNUUyA9IDcxO1xyXG5cclxuY29uZmlnLk1BWF9IRUFMVEhfQkFTRSA9IDIwMDtcclxuY29uZmlnLk1BWF9IRUFMVEhfQk9OVVMgPSA1NTtcclxuY29uZmlnLk1BWF9FTkVSR1lfQkFTRSA9IDIwMDtcclxuY29uZmlnLk1BWF9FTkVSR1lfQk9OVVMgPSA1NTtcclxuXHJcbmNvbmZpZy5JTlZFTlRPUllfU0laRSA9IDIwO1xyXG5jb25maWcuRVFVSVBNRU5UX1NJWkUgPSA1O1xyXG5cclxuY29uZmlnLlNUQVJUX01BUCA9IDE7XHJcbmNvbmZpZy5TVEFSVF9YID0gNTtcclxuY29uZmlnLlNUQVJUX1kgPSA1O1xyXG5jb25maWcuU1RBUlRfTkFNRSA9ICdOZXcgUGxheWVyJztcclxuY29uZmlnLlNUQVJUX1NQUklURSA9IDE7XHJcbmNvbmZpZy5TVEFSVF9EQU1BR0UgPSAyO1xyXG5jb25maWcuU1RBUlRfREVGRU5DRSA9IDA7XHJcbmNvbmZpZy5TVEFSVF9IRUFMVEhfTUFYID0gMjA7XHJcbmNvbmZpZy5TVEFSVF9FTkVSR1lfTUFYID0gMTA7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjb25maWc7XHJcbiIsImltcG9ydCBtb25nb2pzIGZyb20gXCJtb25nb2pzXCI7XHJcbmltcG9ydCBjb25maWcgZnJvbSBcIi4vY29uZmlnLmpzXCI7XHJcblxyXG5jb25zdCBtb25nbyA9IG1vbmdvanMoJ2xvY2FsaG9zdDoyNzAxNy9vZHlzc2V5JywgWydhY2NvdW50cycsICdwbGF5ZXJzJywgJ21hcHMnLCAnaXRlbXMnLCAnYm90cyddKTtcclxuXHJcbmNsYXNzIERhdGFiYXNlIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIC8vIFRoZXNlIHNob3VsZCBiZSBoZWxkIGluIHRoZSBkYXRhYmFzZVxyXG4gICAgdGhpcy5pdGVtcyA9IFtcclxuICAgICAge1x0Ly8gdHlwZSAwXHJcbiAgICAgICAgbmFtZTogXCJCbGFuayBJdGVtXCIsXHJcbiAgICAgICAgc3ByaXRlOiA2OCxcclxuICAgICAgICB0eXBlOiAnbm9uZScsXHJcbiAgICAgICAgc3RhY2s6IDAsXHJcbiAgICAgICAgcmV1c2FibGU6IGZhbHNlLFxyXG4gICAgICAgIGRhbWFnZUJvbnVzOiAwLFxyXG4gICAgICAgIGRlZmVuY2VCb251czogMCxcclxuICAgICAgICBoZWFsdGhNYXhCb251czogMCxcclxuICAgICAgICBlbmVyZ3lNYXhCb251czogMCxcclxuICAgICAgICByYW5nZUJvbnVzOiAwXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcdC8vIHR5cGUgMVxyXG4gICAgICAgIG5hbWU6IFwiSGVhbHRoIFBvdGlvblwiLFxyXG4gICAgICAgIHNwcml0ZTogMSxcclxuICAgICAgICB0eXBlOiAncG90aW9uJyxcclxuICAgICAgICBzdGFjazogMSxcclxuICAgICAgICByZXVzYWJsZTogZmFsc2UsXHJcbiAgICAgICAgZGFtYWdlQm9udXM6IDAsXHJcbiAgICAgICAgZGVmZW5jZUJvbnVzOiAwLFxyXG4gICAgICAgIGhlYWx0aE1heEJvbnVzOiAwLFxyXG4gICAgICAgIGVuZXJneU1heEJvbnVzOiAwLFxyXG4gICAgICAgIHJhbmdlQm9udXM6IDBcclxuICAgICAgfSwgXHJcbiAgICAgIHtcdC8vIHR5cGUgMlxyXG4gICAgICAgIG5hbWU6IFwiRW5lcmd5IFBvdGlvblwiLFxyXG4gICAgICAgIHNwcml0ZTogMixcclxuICAgICAgICB0eXBlOiAncG90aW9uJyxcclxuICAgICAgICBzdGFjazogMSxcclxuICAgICAgICByZXVzYWJsZTogZmFsc2UsXHJcbiAgICAgICAgZGFtYWdlQm9udXM6IDAsXHJcbiAgICAgICAgZGVmZW5jZUJvbnVzOiAwLFxyXG4gICAgICAgIGhlYWx0aE1heEJvbnVzOiAwLFxyXG4gICAgICAgIGVuZXJneU1heEJvbnVzOiAwLFxyXG4gICAgICAgIHJhbmdlQm9udXM6IDBcclxuICAgICAgfSwgXHJcbiAgICAgIHtcdC8vIHR5cGUgM1xyXG4gICAgICAgIG5hbWU6IFwiSW5jb2duaXRvXCIsXHJcbiAgICAgICAgc3ByaXRlOiAxMixcclxuICAgICAgICB0eXBlOiAnc3BlY2lhbCcsXHJcbiAgICAgICAgc3RhY2s6IDAsXHJcbiAgICAgICAgcmV1c2FibGU6IHRydWUsXHJcbiAgICAgICAgZGFtYWdlQm9udXM6IDAsXHJcbiAgICAgICAgZGVmZW5jZUJvbnVzOiAwLFxyXG4gICAgICAgIGhlYWx0aE1heEJvbnVzOiAwLFxyXG4gICAgICAgIGVuZXJneU1heEJvbnVzOiAwLFxyXG4gICAgICAgIHJhbmdlQm9udXM6IDBcclxuICAgICAgfSxcclxuICAgICAge1x0Ly8gdHlwZSA0XHJcbiAgICAgICAgbmFtZTogXCJTd29yZFwiLFxyXG4gICAgICAgIHNwcml0ZTogMTAsXHJcbiAgICAgICAgdHlwZTogJ3dlYXBvbicsXHJcbiAgICAgICAgc3RhY2s6IDAsXHJcbiAgICAgICAgcmV1c2FibGU6IHRydWUsXHJcbiAgICAgICAgZGFtYWdlQm9udXM6IDEsXHJcbiAgICAgICAgZGVmZW5jZUJvbnVzOiAwLFxyXG4gICAgICAgIGhlYWx0aE1heEJvbnVzOiAwLFxyXG4gICAgICAgIGVuZXJneU1heEJvbnVzOiAwLFxyXG4gICAgICAgIHJhbmdlQm9udXM6IDBcclxuICAgICAgICBcclxuICAgICAgfSxcclxuICAgICAge1x0Ly8gdHlwZSA1XHJcbiAgICAgICAgbmFtZTogXCJBeGVcIixcclxuICAgICAgICBzcHJpdGU6IDE0LFxyXG4gICAgICAgIHR5cGU6ICd3ZWFwb24nLFxyXG4gICAgICAgIHN0YWNrOiAwLFxyXG4gICAgICAgIHJldXNhYmxlOiB0cnVlLFxyXG4gICAgICAgIGRhbWFnZUJvbnVzOiAyLFxyXG4gICAgICAgIGRlZmVuY2VCb251czogMCxcclxuICAgICAgICBoZWFsdGhNYXhCb251czogMCxcclxuICAgICAgICBlbmVyZ3lNYXhCb251czogMCxcclxuICAgICAgICByYW5nZUJvbnVzOiAwXHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICBdO1xyXG5cclxuICAgIHRoaXMubWFwcyA9IFtcclxuICAgICAge1x0Ly8gaWQgMFxyXG4gICAgICAgIG5hbWU6IFwiQmxhbmsgTWFwXCIsXHJcbiAgICAgICAgZHJvcENoYW5jZTogMTAwLFxyXG4gICAgICAgIGRyb3BBbW91bnRFUTogMCxcclxuICAgICAgICBqb2luOlx0XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgbGVhdmU6XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcdC8vIGlkIDFcclxuICAgICAgICBuYW1lOiBcIkNyZW5kYWxlIDFcIixcclxuICAgICAgICBkcm9wQ2hhbmNlOiAxMDAsXHJcbiAgICAgICAgZHJvcEFtb3VudEVROiAwLFxyXG4gICAgICAgIGpvaW46XHRcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICBsZWF2ZTpcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAge1x0Ly8gaWQgMlxyXG4gICAgICAgIG5hbWU6IFwiQ3JlbmRhbGUgMlwiLFxyXG4gICAgICAgIGRyb3BDaGFuY2U6IDEwMCxcclxuICAgICAgICBkcm9wQW1vdW50RVE6IDAsXHJcbiAgICAgICAgam9pbjpcdFx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgIGxlYXZlOlx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICB7XHQvLyBpZCAzXHJcbiAgICAgICAgbmFtZTogXCJDcmVuZGFsZSAzXCIsXHJcbiAgICAgICAgZHJvcENoYW5jZTogMTAwLFxyXG4gICAgICAgIGRyb3BBbW91bnRFUTogMCxcclxuICAgICAgICBqb2luOlx0XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgbGVhdmU6XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcdC8vIGlkIDRcclxuICAgICAgICBuYW1lOiBcIkNyZW5kYWxlIDRcIixcclxuICAgICAgICBkcm9wQ2hhbmNlOiAxMDAsXHJcbiAgICAgICAgZHJvcEFtb3VudEVROiAwLFxyXG4gICAgICAgIGpvaW46XHRcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICBsZWF2ZTpcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAge1x0Ly8gaWQgNVxyXG4gICAgICAgIG5hbWU6IFwiQ3JlbmRhbGUgNVwiLFxyXG4gICAgICAgIGRyb3BDaGFuY2U6IDEwMCxcclxuICAgICAgICBkcm9wQW1vdW50RVE6IDAsXHJcbiAgICAgICAgam9pbjpcdFx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgIGxlYXZlOlx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICB7XHQvLyBpZCA2XHJcbiAgICAgICAgbmFtZTogXCJDcmVuZGFsZSA2XCIsXHJcbiAgICAgICAgZHJvcENoYW5jZTogMTAwLFxyXG4gICAgICAgIGRyb3BBbW91bnRFUTogMCxcclxuICAgICAgICBqb2luOlx0XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgbGVhdmU6XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcdC8vIGlkIDdcclxuICAgICAgICBuYW1lOiBcIkNyZW5kYWxlIDdcIixcclxuICAgICAgICBkcm9wQ2hhbmNlOiAxMDAsXHJcbiAgICAgICAgZHJvcEFtb3VudEVROiAwLFxyXG4gICAgICAgIGpvaW46XHRcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICBsZWF2ZTpcdGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAge1x0Ly8gaWQgOFxyXG4gICAgICAgIG5hbWU6IFwiQ3JlbmRhbGUgOFwiLFxyXG4gICAgICAgIGRyb3BDaGFuY2U6IDEwMCxcclxuICAgICAgICBkcm9wQW1vdW50RVE6IDAsXHJcbiAgICAgICAgam9pbjpcdFx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgIGxlYXZlOlx0ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICB7XHQvLyBpZCA5XHJcbiAgICAgICAgbmFtZTogXCJDcmVuZGFsZSA5XCIsXHJcbiAgICAgICAgZHJvcENoYW5jZTogMTAwLFxyXG4gICAgICAgIGRyb3BBbW91bnRFUTogMCxcclxuICAgICAgICBqb2luOlx0XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgbGVhdmU6XHRmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICBdO1xyXG5cclxuICAgIHRoaXMucGxheWVycyA9IFtcclxuICAgICAge1x0Ly9pZCAwXHJcbiAgICAgICAgbmFtZTogXCJGYW5rYWRvcmVcIixcclxuICAgICAgICBzcHJpdGU6IDEsXHJcbiAgICAgICAgYWRtaW5BY2Nlc3M6IDAsXHJcbiAgICAgICAgbWFwSWQ6IDEsXHJcbiAgICAgICAgeDogNSxcclxuICAgICAgICB5OiA1LFxyXG4gICAgICAgIGRhbWFnZUJhc2U6IDEwLFxyXG4gICAgICAgIGRlZmVuY2VCYXNlOiAyLFxyXG4gICAgICAgIGhlYWx0aE1heEJhc2U6IDIwLFxyXG4gICAgICAgIGVuZXJneU1heEJhc2U6IDQwLFxyXG4gICAgICAgIHJhbmdlQmFzZTogMVxyXG4gICAgICB9LFxyXG4gICAgICB7XHQvL2lkIDFcclxuICAgICAgICBuYW1lOiBcIk9iYml0dFwiLFxyXG4gICAgICAgIHNwcml0ZTogMyxcclxuICAgICAgICBhZG1pbkFjY2VzczogMCxcclxuICAgICAgICBtYXBJZDogMSxcclxuICAgICAgICB4OiA0LFxyXG4gICAgICAgIHk6IDQsXHJcbiAgICAgICAgZGFtYWdlQmFzZTogMTAsXHJcbiAgICAgICAgZGVmZW5jZUJhc2U6IDIsXHJcbiAgICAgICAgaGVhbHRoTWF4QmFzZTogMjAsXHJcbiAgICAgICAgZW5lcmd5TWF4QmFzZTogNDAsXHJcbiAgICAgICAgcmFuZ2VCYXNlOiAxXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcdC8vaWQgMlxyXG4gICAgICAgIG5hbWU6IFwiRnJvbGlrXCIsXHJcbiAgICAgICAgc3ByaXRlOiA1LFxyXG4gICAgICAgIGFkbWluQWNjZXNzOiAwLFxyXG4gICAgICAgIG1hcElkOiAxLFxyXG4gICAgICAgIHg6IDUsXHJcbiAgICAgICAgeTogNSxcclxuICAgICAgICBkYW1hZ2VCYXNlOiAxMCxcclxuICAgICAgICBkZWZlbmNlQmFzZTogMixcclxuICAgICAgICBoZWFsdGhNYXhCYXNlOiAyMCxcclxuICAgICAgICBlbmVyZ3lNYXhCYXNlOiA0MCxcclxuICAgICAgICByYW5nZUJhc2U6IDFcclxuICAgICAgfSxcclxuICAgIF07XHJcblxyXG4gICAgdGhpcy5ib3RzID0gW1xyXG4gICAgICB7XHQvL2lkIDBcclxuICAgICAgICBuYW1lOiBcIlJhdFwiLFxyXG4gICAgICAgIHNwcml0ZTogMCxcclxuICAgICAgICBob3N0aWxlOiBmYWxzZSxcclxuICAgICAgICBkYW1hZ2VCYXNlOiAxLFxyXG4gICAgICAgIGRlZmVuY2VCYXNlOiAwLFxyXG4gICAgICAgIGhlYWx0aE1heEJhc2U6IDUsXHJcbiAgICAgICAgZW5lcmd5TWF4QmFzZTogMTAsXHJcbiAgICAgICAgcmFuZ2VCYXNlOiAxXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcdC8vaWQgMVxyXG4gICAgICAgIG5hbWU6IFwiU25ha2VcIixcclxuICAgICAgICBzcHJpdGU6IDIsXHJcbiAgICAgICAgaG9zdGlsZTogdHJ1ZSxcclxuICAgICAgICBkYW1hZ2VCYXNlOiAyLFxyXG4gICAgICAgIGRlZmVuY2VCYXNlOiAwLFxyXG4gICAgICAgIGhlYWx0aE1heEJhc2U6IDUsXHJcbiAgICAgICAgZW5lcmd5TWF4QmFzZTogNSxcclxuICAgICAgICByYW5nZUJhc2U6IDFcclxuICAgICAgfSxcclxuICAgIF07XHJcblxyXG4gIH1cclxuXHJcblx0bG9nKG1lc3NhZ2UpIHtcclxuXHRcdGNvbnNvbGUubG9nKG1lc3NhZ2UpO1xyXG5cdH1cclxuXHJcbiAgZmluZCh1c2VybmFtZSkge1xyXG4gICAgbW9uZ28uYWNjb3VudHMuZmluZE9uZSh7dXNlcm5hbWU6IHVzZXJuYW1lfSwgKGVyciwgcmVzKSA9PiB7XHJcbiAgICAgIGlmIChlcnIpIHRocm93IGVycjtcclxuICAgICAgaWYgKHJlcykge1xyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdGhpcy5sb2coYFBsYXllciBub3QgZm91bmQgd2l0aCB1c2VybmFtZTogJHt1c2VybmFtZX1gKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRQbGF5ZXJEYXRhKGlkKSB7XHJcbiAgICBsZXQgcGxheWVyRGF0YSA9IHt9O1xyXG5cclxuICAgIGlmICh0aGlzLnBsYXllcnNbaWRdKSB7XHQvLyBGcm9tIERhdGFiYXNlXHJcbiAgICAgIHBsYXllckRhdGEgPSB0aGlzLnBsYXllcnNbaWRdO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHQvLyBGaXJzdCBMb2dpblxyXG4gICAgICBwbGF5ZXJEYXRhLm5hbWUgPSBjb25maWcuU1RBUlRfTkFNRTtcclxuICAgICAgcGxheWVyRGF0YS5zcHJpdGUgPSBjb25maWcuU1RBUlRfU1BSSVRFO1xyXG4gICAgICBwbGF5ZXJEYXRhLmFkbWluQWNjZXNzID0gMDtcclxuICAgICAgXHJcbiAgICAgIHBsYXllckRhdGEubWFwSWQgPSBjb25maWcuU1RBUlRfTUFQO1xyXG4gICAgICBwbGF5ZXJEYXRhLnggPSBjb25maWcuU1RBUlRfWDtcclxuICAgICAgcGxheWVyRGF0YS55ID0gY29uZmlnLlNUQVJUX1k7XHJcbiAgICAgIFxyXG4gICAgICBwbGF5ZXJEYXRhLmRhbWFnZUJhc2UgPSBjb25maWcuU1RBUlRfREFNQUdFO1xyXG4gICAgICBwbGF5ZXJEYXRhLmRlZmVuY2VCYXNlID0gY29uZmlnLlNUQVJUX0RFRkVOQ0U7XHJcbiAgICAgIHBsYXllckRhdGEuaGVhbHRoTWF4QmFzZSA9IGNvbmZpZy5TVEFSVF9IRUFMVEhfTUFYO1xyXG4gICAgICBwbGF5ZXJEYXRhLmVuZXJneU1heEJhc2UgPSBjb25maWcuU1RBUlRfRU5FUkdZX01BWDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcmV0dXJuIHBsYXllckRhdGE7XHJcbiAgfVxyXG5cclxuICBzYXZlUGxheWVyRGF0YShkYXRhKSB7XHJcbiAgICAvL21vbmdvLnBsYXllcnMuc2F2ZShkYXRhLmlkLCBkYXRhKTtcclxuICB9XHJcblxyXG4gIGdldE1hcERhdGEoaWQpIHtcclxuICAgIGxldCBtYXBEYXRhID0ge307XHJcblxyXG4gICAgaWYgKHRoaXMubWFwc1tpZF0pIHtcclxuICAgICAgbWFwRGF0YSA9IHRoaXMubWFwc1tpZF07XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgbWFwRGF0YS5uYW1lID0gXCJCbGFuayBNYXBcIjtcclxuICAgICAgbWFwRGF0YS5pdGVtcyA9IFtdO1xyXG4gICAgICBtYXBEYXRhLmJvdHMgPSBbXTtcclxuICAgICAgbWFwRGF0YS5lZmZlY3RzID0gW107XHJcbiAgICAgIG1hcERhdGEudGV4dHMgPSBbXTtcclxuICAgICAgbWFwRGF0YS5kcm9wQ2hhbmNlID0gMTAwO1xyXG4gICAgICBtYXBEYXRhLmRyb3BBbW91bnRFUSA9IDU7XHJcbiAgICAgIG1hcERhdGEudGlsZXMgPSB7XHJcbiAgICAgICAgbGF5ZXI6IFsgXHJcbiAgICAgICAgICBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXHJcbiAgICAgICAgICBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXHJcbiAgICAgICAgICBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXHJcbiAgICAgICAgICBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXHJcbiAgICAgICAgICBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXHJcbiAgICAgICAgICBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXHJcbiAgICAgICAgXSxcclxuICAgICAgICB3YWxsOiBbZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZV0sXHJcbiAgICAgICAgY2FuQXR0YWNrOiBbZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZV0sXHJcbiAgICAgICAgZGFtYWdlOiBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXHJcbiAgICAgICAgZGVmZW5jZTogWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxyXG4gICAgICAgIGhlYWx0aE1heDogWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxyXG4gICAgICAgIHdhcnBNYXA6IFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcclxuICAgICAgICB3YXJwWDogWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxyXG4gICAgICAgIHdhcnBZOiBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF1cclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbWFwRGF0YTtcclxuICB9XHJcbiAgXHJcbiAgc2F2ZU1hcERhdGEoZGF0YSkge1xyXG4gICAgbW9uZ28ubWFwcy5zYXZlKGRhdGEuaWQsIGRhdGEpO1xyXG4gIH1cclxuXHJcbiAgZ2V0Qm90RGF0YShib3RDbGFzcykge1xyXG4gICAgcmV0dXJuIHRoaXMuYm90c1tib3RDbGFzc107XHJcbiAgfVxyXG5cclxuICBzYXZlQm90RGF0YShtYXBJZCwgaWQpIHtcclxuXHJcbiAgfVxyXG5cclxuICBnZXRJdGVtRGF0YShpdGVtQ2xhc3MpIHtcclxuICAgIHJldHVybiB0aGlzLml0ZW1zW2l0ZW1DbGFzc107XHJcbiAgfVxyXG59XHJcblxyXG5jb25zdCBkYiA9IG5ldyBEYXRhYmFzZSgpO1xyXG5leHBvcnQgZGVmYXVsdCBkYjtcclxuIiwiaW1wb3J0IGZzIGZyb20gJ2ZzJztcclxuXHJcbmltcG9ydCBkYiBmcm9tICcuL2RiLmpzJztcclxuaW1wb3J0IGNvbmZpZyBmcm9tICcuL2NvbmZpZy5qcyc7XHJcbmltcG9ydCB1dGlsIGZyb20gJy4vdXRpbC5qcyc7XHJcbmltcG9ydCBNYXAgZnJvbSAnLi9jbGFzc2VzL21hcC5qcyc7XHJcbmltcG9ydCBQbGF5ZXIgZnJvbSAnLi9jbGFzc2VzL3BsYXllci5qcyc7XHJcbmltcG9ydCBCb3QgZnJvbSAnLi9jbGFzc2VzL2JvdC5qcyc7XHJcbmltcG9ydCBJdGVtIGZyb20gJy4vY2xhc3Nlcy9pdGVtLmpzJztcclxuaW1wb3J0IEVmZmVjdCBmcm9tICcuL2NsYXNzZXMvZWZmZWN0LmpzJztcclxuaW1wb3J0IFRleHQgZnJvbSAnLi9jbGFzc2VzL3RleHQuanMnO1xyXG5pbXBvcnQgTWVzc2FnZSBmcm9tICcuL2NsYXNzZXMvbWVzc2FnZS5qcyc7XHJcblxyXG5jbGFzcyBHYW1lIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHRoaXMucGxheWVyTGlzdCA9IFtdO1xyXG5cdFx0dGhpcy5tYXBMaXN0ID0gW107XHJcblx0XHR0aGlzLm1lc3NhZ2VRdWV1ZSA9IFtdO1xyXG5cclxuXHRcdC8vIENyZWF0ZSBNYXBzXHJcblx0XHR0aGlzLm1hcERhdGEgPSBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYygnLi9zZXJ2ZXIvZGF0YS9tYXAuanNvbicsICd1dGY4JykpO1xyXG5cdFx0Zm9yIChsZXQgaWQgPSAwOyBpZCA8IGNvbmZpZy5NQVhfTUFQUzsgaWQrKykge1xyXG5cdFx0XHR0aGlzLm1hcExpc3RbaWRdID0gbmV3IE1hcChpZCwgdGhpcy5tYXBEYXRhW2lkXSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR1cGRhdGUoZGVsdGEpIHtcclxuXHRcdGxldCBwYWNrID0ge1xyXG5cdFx0XHRwbGF5ZXJzOiBbXSxcclxuXHRcdFx0bWFwczogW10sXHJcblx0XHRcdG1lc3NhZ2VzOiB0aGlzLm1lc3NhZ2VRdWV1ZVxyXG5cdFx0fTtcclxuXHRcdHRoaXMubWVzc2FnZVF1ZXVlID0gW107XHJcblxyXG5cdFx0dGhpcy5wbGF5ZXJMaXN0LmZvckVhY2goKHBsYXllcikgPT4ge1xyXG5cdFx0XHRwYWNrLnBsYXllcnNbcGxheWVyLmlkXSA9IHBsYXllci51cGRhdGUoZGVsdGEpO1xyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcdHRoaXMubWFwTGlzdC5mb3JFYWNoKChtYXApID0+IHtcclxuXHRcdFx0cGFjay5tYXBzW21hcC5pZF0gPSBtYXAudXBkYXRlKGRlbHRhKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBwYWNrO1xyXG5cdH1cclxuXHJcblx0Ly8gUGxheWVyc1xyXG5cdHBsYXllckxvZ2luKGlkKSB7XHJcblx0XHRsZXQgcGxheWVyID0gbmV3IFBsYXllcihpZCk7XHJcblx0XHR0aGlzLnBsYXllckxpc3RbaWRdID0gcGxheWVyO1xyXG5cdFx0dGhpcy5zZW5kR2FtZUluZm9HbG9iYWwoYCR7cGxheWVyLm5hbWV9IGhhcyBsb2dnZWQgaW4uYCk7XHJcblx0XHRyZXR1cm4gcGxheWVyO1xyXG5cdH1cclxuXHRcclxuXHRwbGF5ZXJMb2dvdXQoaWQpIHtcclxuXHRcdGxldCBwbGF5ZXIgPSB0aGlzLnBsYXllckxpc3RbaWRdO1xyXG5cdFx0aWYgKHBsYXllcikge1xyXG5cdFx0XHRkYi5zYXZlUGxheWVyRGF0YShwbGF5ZXIuZ2V0UGFjayk7XHJcblx0XHRcdHRoaXMuc2VuZEdhbWVJbmZvR2xvYmFsKGAke3BsYXllci5uYW1lfSBoYXMgbG9nZ2VkIG91dC5gKTtcclxuXHRcdFx0ZGVsZXRlIHRoaXMucGxheWVyTGlzdFtpZF07XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLyBHYW1lIEluZm9cclxuXHRzZW5kR2FtZUluZm9HbG9iYWwobWVzc2FnZSkge1xyXG5cdFx0dGhpcy5tZXNzYWdlUXVldWUucHVzaChuZXcgTWVzc2FnZShudWxsLCBtZXNzYWdlLCAnZ2FtZUluZm8nKSk7XHJcblx0fVxyXG5cdHNlbmRHYW1lSW5mb01hcChtYXBJZCwgbWVzc2FnZSkge1xyXG5cdFx0dGhpcy5tZXNzYWdlUXVldWUucHVzaChuZXcgTWVzc2FnZShudWxsLCBtZXNzYWdlLCAnZ2FtZUluZm8nLCBtYXBJZCkpO1xyXG5cdH1cclxuXHRzZW5kR2FtZUluZm9QbGF5ZXIoaWQsIG1lc3NhZ2UpIHtcclxuXHRcdHRoaXMubWVzc2FnZVF1ZXVlLnB1c2gobmV3IE1lc3NhZ2UobnVsbCwgbWVzc2FnZSwgJ2dhbWVJbmZvJywgbnVsbCwgaWQpKTtcclxuXHR9XHJcblx0XHJcblx0Ly8gQ2hhdCBNZXNzYWdlc1xyXG5cdHNlbmRNZXNzYWdlR2xvYmFsKHNlbmRlcklkLCBtZXNzYWdlKSB7XHJcblx0XHR0aGlzLm1lc3NhZ2VRdWV1ZS5wdXNoKG5ldyBNZXNzYWdlKHNlbmRlcklkLCBtZXNzYWdlLCAnbWVzc2FnZUdsb2JhbCcpKTtcclxuXHR9XHJcblx0c2VuZE1lc3NhZ2VNYXAoc2VuZGVySWQsIG1hcElkLCBtZXNzYWdlKSB7XHJcblx0XHR0aGlzLm1lc3NhZ2VRdWV1ZS5wdXNoKG5ldyBNZXNzYWdlKHNlbmRlcklkLCBtZXNzYWdlLCAnbWVzc2FnZU1hcCcsIG1hcElkKSk7XHJcblx0fVxyXG5cdHNlbmRNZXNzYWdlUGxheWVyKHNlbmRlcklkLCBpZCwgbWVzc2FnZSkge1xyXG5cdFx0dGhpcy5tZXNzYWdlUXVldWUucHVzaChuZXcgTWVzc2FnZShzZW5kZXJJZCwgbWVzc2FnZSwgJ21lc3NhZ2VQbGF5ZXInLCBudWxsLCBpZCkpO1xyXG5cdH1cclxuXHJcblx0Ly8gTWFwXHJcblx0aXNWYWNhbnQobWFwSWQsIHgsIHkpIHtcclxuXHRcdC8vIENoZWNrIGZvciBNYXAgRWRnZXNcclxuXHRcdGlmICh4IDwgMCB8fCB4ID49IGNvbmZpZy5NQVBfQ09MVU1OUykgcmV0dXJuIGZhbHNlO1xyXG5cdFx0aWYgKHkgPCAwIHx8IHkgPj0gY29uZmlnLk1BUF9ST1dTKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcclxuXHRcdGxldCBtYXAgPSB0aGlzLm1hcExpc3RbbWFwSWRdO1xyXG5cdFx0XHJcblx0XHQvLyBDaGVjayBmb3IgV2FsbCBUaWxlc1xyXG5cdFx0aWYgKG1hcC50aWxlc1t5XVt4XS53YWxsID09PSB0cnVlKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcclxuXHRcdC8vIENoZWNrIGZvciBCb3RzXHJcblx0XHRsZXQgYm90cyA9IG1hcC5ib3RzLmZpbHRlcigoYm90KSA9PiB7XHJcblx0XHRcdGlmIChib3QueCA9PT0geCAmJiBib3QueSA9PT0geSAmJiAhYm90LmlzRGVhZCkgcmV0dXJuIHRydWU7XHJcblx0XHR9KTtcclxuXHRcdGlmIChib3RzLmxlbmd0aCA+IDApIHJldHVybiBmYWxzZTtcclxuXHRcdFxyXG5cdFx0Ly8gQ2hlY2sgZm9yIFBsYXllcnNcclxuXHRcdGxldCBwbGF5ZXJzID0gdGhpcy5wbGF5ZXJMaXN0LmZpbHRlcigocGxheWVyKSA9PiB7XHJcblx0XHRcdGlmIChwbGF5ZXIubWFwSWQgPT09IG1hcC5pZCAmJiBwbGF5ZXIueCA9PT0geCAmJiBwbGF5ZXIueSA9PT0geSAmJiAhcGxheWVyLmlzRGVhZCkgcmV0dXJuIHRydWU7XHJcblx0XHR9KTtcclxuXHRcdGlmIChwbGF5ZXJzLmxlbmd0aCA+IDApIHJldHVybiBmYWxzZTtcclxuXHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdHNwYXduQm90KG1hcElkLCB4LCB5LCBib3RDbGFzcykge1xyXG5cdFx0bmV3IEJvdCh7XHJcblx0XHRcdG1hcElkLFxyXG5cdFx0XHR4LFxyXG5cdFx0XHR5LFxyXG5cdFx0XHRib3RDbGFzc1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdFxyXG5cdHNwYXduTWFwSXRlbShtYXBJZCwgeCwgeSwgaXRlbUNsYXNzLCBzdGFjayA9IDApIHtcclxuXHRcdG5ldyBJdGVtKHtcclxuXHRcdFx0b3duZXI6ICdtYXAnLFxyXG5cdFx0XHRtYXBJZCxcclxuXHRcdFx0aWQ6IHV0aWwuZmlyc3RFbXB0eUluZGV4KHRoaXMubWFwTGlzdFttYXBJZF0uaXRlbXMpLFxyXG5cdFx0XHR4LFxyXG5cdFx0XHR5LFxyXG5cdFx0XHRpdGVtQ2xhc3MsXHJcblx0XHRcdHN0YWNrXHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHNwYXduRGFtYWdlVGV4dChtYXBJZCwgeCwgeSwgZGFtYWdlKSB7XHJcblx0XHRuZXcgVGV4dChtYXBJZCwgeCwgeSAtIDAuNSwgZGFtYWdlLCAnI2ZmMDAwMCcsIDEuMjUsIDAsIC0xKTtcclxuXHR9XHJcblx0c3Bhd25FZmZlY3QobWFwSWQsIHgsIHksIHNwcml0ZSwgbG9vcCwgc3BlZWQsIG1heEZyYW1lLCBzdGFydEZyYW1lKSB7XHJcblx0XHRuZXcgRWZmZWN0KG1hcElkLCB4LCB5LCBzcHJpdGUsIGxvb3AsIHNwZWVkLCBtYXhGcmFtZSwgc3RhcnRGcmFtZSk7XHJcblx0fVxyXG59XHJcblxyXG5jb25zdCBnYW1lID0gbmV3IEdhbWUoKTtcclxuZXhwb3J0IGRlZmF1bHQgZ2FtZTtcclxuIiwiLyoqKiBHYW1lIExvb3AgKioqL1xyXG4vKiBLZWVwcyB0cmFjayBvZiB0aW1lIGFuZCBjby1vcmRpbmF0ZXMgdGhlIGdhbWUgYW5kIHNlcnZlciAqL1xyXG5cclxuaW1wb3J0IE5vZGVHYW1lTG9vcCBmcm9tICdub2RlLWdhbWVsb29wJztcclxuXHJcbmltcG9ydCBkYiBmcm9tICcuL2RiLmpzJztcclxuaW1wb3J0IGdhbWUgZnJvbSAnLi9nYW1lLmpzJztcclxuaW1wb3J0IHNlcnZlciBmcm9tICcuL3NlcnZlci5qcyc7XHJcbmltcG9ydCBjb25maWcgZnJvbSAnLi9jb25maWcuanMnO1xyXG5cclxuY2xhc3MgR2FtZUxvb3Age1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5pZCA9IG51bGw7XHJcbiAgICB0aGlzLnRpbWVyID0ge1xyXG4gICAgICBiYWNrdXA6IDBcclxuICAgIH07XHJcbiAgICB0aGlzLnN0YXJ0KCk7XHJcbiAgfVxyXG4gIHN0YXJ0KCkge1xyXG4gICAgdGhpcy5pZCA9IE5vZGVHYW1lTG9vcC5zZXRHYW1lTG9vcCgoZGVsdGEpID0+IHtcclxuICAgICAgLy8gVXBkYXRlIHRoZSBnYW1lIHN0YXRlXHJcbiAgICAgIGxldCB1cGRhdGVQYWNrID0gZ2FtZS51cGRhdGUoZGVsdGEpO1xyXG4gICAgICBcclxuICAgICAgLy8gU2VuZCB1cGRhdGVkIHN0YXRlIHRvIGNsaWVudHNcclxuICAgICAgc2VydmVyLnNlbmRVcGRhdGVQYWNrKHVwZGF0ZVBhY2spO1xyXG4gICAgICBcclxuICAgICAgLy8gUGVyaW9kaWMgYmFja3VwIHRvIGRhdGFiYXNlXHJcbiAgICAgIHRoaXMudGltZXIuYmFja3VwICs9IGRlbHRhO1xyXG4gICAgICBpZiAodGhpcy50aW1lci5iYWNrdXAgPj0gY29uZmlnLkJBQ0tVUF9USU1FKSB7XHJcbiAgICAgICAgdGhpcy50aW1lci5iYWNrdXAgLT0gY29uZmlnLkJBQ0tVUF9USU1FO1xyXG4gICAgICAgIC8vIFNBVkUgU1RBVEVcclxuICAgICAgfVxyXG4gICAgfSwgY29uZmlnLkZSQU1FUkFURSk7XHJcbiAgfVxyXG59XHJcblxyXG5jb25zdCBnYW1lTG9vcCA9IG5ldyBHYW1lTG9vcCgpO1xyXG5leHBvcnQgZGVmYXVsdCBnYW1lTG9vcDsiLCJpbXBvcnQgZGIgZnJvbSAnLi9kYi5qcyc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4vZ2FtZS5qcyc7XHJcbmltcG9ydCBzZXJ2ZXIgZnJvbSAnLi9zZXJ2ZXIuanMnO1xyXG5pbXBvcnQgZ2FtZWxvb3AgZnJvbSAnLi9nYW1lbG9vcC5qcyc7XHJcbiIsImltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xyXG5pbXBvcnQgaHR0cCBmcm9tICdodHRwJztcclxuaW1wb3J0IHNvY2tldElPIGZyb20gJ3NvY2tldC5pbyc7XHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xyXG5cclxuaW1wb3J0IGRiIGZyb20gJy4vZGIuanMnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuL2dhbWUuanMnO1xyXG5pbXBvcnQgY29uZmlnIGZyb20gJy4vY29uZmlnLmpzJztcclxuaW1wb3J0IHV0aWwgZnJvbSAnLi91dGlsLmpzJztcclxuXHJcbmNsYXNzIFNlcnZlciB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHRjb25zdCBhcHAgPSBleHByZXNzKCk7XHJcblx0XHRjb25zdCBzZXJ2ZXIgPSBodHRwLlNlcnZlcihhcHApO1xyXG5cdFx0Y29uc3QgaW8gPSBzb2NrZXRJTyhzZXJ2ZXIpO1xyXG5cdFx0Y29uc3QgcG9ydCA9IHByb2Nlc3MuZW52LlBPUlQgfHwgY29uZmlnLlBPUlQ7XHJcblx0XHRjb25zdCBwdWJsaWNQYXRoID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uL2NsaWVudCcpO1xyXG5cdFx0XHJcblx0XHRhcHAuZ2V0KCcvJywgKHJlcSwgcmVzKSA9PiByZXMuc2VuZEZpbGUocHVibGljUGF0aCArICcvaW5kZXguaHRtbCcpKTtcclxuXHRcdGFwcC51c2UoJy9jbGllbnQnLCBleHByZXNzLnN0YXRpYyhwdWJsaWNQYXRoKSk7XHJcblx0XHRzZXJ2ZXIubGlzdGVuKHBvcnQsICgpID0+IGRiLmxvZyhgU2VydmVyIHN0YXJ0ZWQuIExpc3RlbmluZyBvbiAke3NlcnZlci5hZGRyZXNzKCkucG9ydH1gKSk7XHJcblxyXG5cdFx0dGhpcy5zb2NrZXRMaXN0ID0gW107XHJcblx0XHRpby5zb2NrZXRzLm9uKCdjb25uZWN0aW9uJywgKHNvY2tldCkgPT4gdGhpcy5vbkNvbm5lY3Qoc29ja2V0KSk7XHJcblx0fVxyXG5cclxuXHQvLyBSZWNlaXZlIGRhdGEgZnJvbSBjbGllbnRzXHJcblx0b25Db25uZWN0KHNvY2tldCkge1xyXG5cdFx0c29ja2V0LmlkID0gdXRpbC5maXJzdEVtcHR5SW5kZXgodGhpcy5zb2NrZXRMaXN0KTtcclxuXHRcdHRoaXMuc29ja2V0TGlzdFtzb2NrZXQuaWRdID0gc29ja2V0O1xyXG5cdFx0ZGIubG9nKGBOZXcgQ29ubmVjdGlvbjogSWQgJHtzb2NrZXQuaWR9YCk7XHJcblx0XHRcclxuXHRcdHNvY2tldC5vbignZGlzY29ubmVjdCcsICgpID0+IHRoaXMub25EaXNjb25uZWN0KHNvY2tldC5pZCkpO1xyXG5cdFx0c29ja2V0Lm9uKCdsb2dpbicsICgpID0+IHRoaXMub25Mb2dpbihzb2NrZXQuaWQpKTtcclxuXHRcdHNvY2tldC5vbignbG9nb3V0JywgKCkgPT4gdGhpcy5vbkxvZ291dChzb2NrZXQuaWQpKTtcclxuXHR9XHJcblxyXG5cdG9uRGlzY29ubmVjdChpZCkge1xyXG5cdFx0aWYgKGdhbWUucGxheWVyTGlzdFtpZF0pIHtcclxuXHRcdFx0Z2FtZS5wbGF5ZXJMb2dvdXQoaWQpO1xyXG5cdFx0fVxyXG5cdFx0ZGVsZXRlIHRoaXMuc29ja2V0TGlzdFtpZF07XHJcblx0XHRkYi5sb2coYERpc2Nvbm5lY3RlZDogSWQgJHtpZH1gKTtcclxuXHR9XHJcblxyXG5cdG9uTG9naW4oaWQpIHtcdFx0XHJcblx0XHQvLyBDcmVhdGUgUGxheWVyXHJcblx0XHRsZXQgcGxheWVyID0gZ2FtZS5wbGF5ZXJMb2dpbihpZCk7XHJcblx0XHRcclxuXHRcdC8vIFJlY2VpdmUgSW5wdXRzXHJcblx0XHRsZXQgc29ja2V0ID0gdGhpcy5zb2NrZXRMaXN0W2lkXTtcclxuXHRcdHNvY2tldC5vbignaW5wdXQnLCAoZGF0YSkgPT4gcGxheWVyLm9uSW5wdXQoZGF0YSkpO1xyXG5cdH1cclxuXHRcclxuXHRvbkxvZ291dChpZCkge1xyXG5cdFx0Z2FtZS5wbGF5ZXJMb2dvdXQoaWQpO1xyXG5cdH1cclxuXHRcclxuXHQvLyBTZW5kIGRhdGEgdG8gY2xpZW50c1xyXG5cdHNlbmRVcGRhdGVQYWNrKHVwZGF0ZVBhY2spIHtcclxuXHRcdGdhbWUucGxheWVyTGlzdC5mb3JFYWNoKChwbGF5ZXIpID0+IHtcclxuXHRcdFx0bGV0IHBhY2sgPSB7fTtcclxuXHRcdFx0XHJcblx0XHRcdHBhY2suZ2FtZSA9IHVwZGF0ZVBhY2subWFwc1twbGF5ZXIubWFwSWRdO1xyXG5cdFx0XHRwYWNrLmdhbWUucGxheWVycyA9IHVwZGF0ZVBhY2sucGxheWVycy5maWx0ZXIoKHBsYXllckRhdGEpID0+IHtcclxuXHRcdFx0XHRyZXR1cm4gKHBsYXllckRhdGEubWFwSWQgPT09IHBsYXllci5tYXBJZCAmJiAocGxheWVyRGF0YS5pc1Zpc2libGUgfHwgcGxheWVyRGF0YS5pZCA9PT0gcGxheWVyLmlkKSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0cGFjay51aSA9IHBsYXllci5nZXRQcml2YXRlUGFjaygpO1xyXG5cdFx0XHRwYWNrLnVpLm1lc3NhZ2VzID0gdXBkYXRlUGFjay5tZXNzYWdlcy5maWx0ZXIoKG1lc3NhZ2UpID0+IHtcclxuXHRcdFx0XHRyZXR1cm4gKChtZXNzYWdlLm1hcElkID09IG51bGwgJiYgbWVzc2FnZS5pZCA9PSBudWxsKSB8fCBwbGF5ZXIubWFwSWQgPT09IG1lc3NhZ2UubWFwSWQgfHwgcGxheWVyLmlkID09PSBtZXNzYWdlLmlkKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRsZXQgc29ja2V0ID0gdGhpcy5zb2NrZXRMaXN0W3BsYXllci5pZF07XHJcblx0XHRcdHNvY2tldC5lbWl0KCd1cGRhdGUnLCBwYWNrKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRcclxuXHRzZW5kTWFwRGF0YShtYXBJZCkge1xyXG5cdFx0Z2FtZS5wbGF5ZXJMaXN0LmZvckVhY2goKHBsYXllcikgPT4ge1xyXG5cdFx0XHRpZiAocGxheWVyLm1hcElkID09PSBtYXBJZCkge1xyXG5cdFx0XHRcdGxldCBzb2NrZXQgPSB0aGlzLnNvY2tldExpc3RbcGxheWVyLmlkXTtcclxuXHRcdFx0XHRzb2NrZXQuZW1pdCgnbG9hZE1hcCcsIGRiLm1hcFttYXBJZF0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG59XHJcblxyXG5jb25zdCBzZXJ2ZXIgPSBuZXcgU2VydmVyKCk7XHJcbmV4cG9ydCBkZWZhdWx0IHNlcnZlcjtcclxuIiwiZnVuY3Rpb24gc2h1ZmZsZShhcnJheSkge1xyXG4gIGxldCBjdXJyZW50SW5kZXggPSBhcnJheS5sZW5ndGg7XHJcbiAgbGV0IHRlbXA7XHJcbiAgbGV0IHJhbmRvbUluZGV4O1xyXG4gIHdoaWxlIChjdXJyZW50SW5kZXggIT09IDApIHtcclxuICAgIHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY3VycmVudEluZGV4KTtcclxuICAgIGN1cnJlbnRJbmRleCAtPSAxO1xyXG4gICAgdGVtcCA9IGFycmF5W2N1cnJlbnRJbmRleF07XHJcbiAgICBhcnJheVtjdXJyZW50SW5kZXhdID0gYXJyYXlbcmFuZG9tSW5kZXhdO1xyXG4gICAgYXJyYXlbcmFuZG9tSW5kZXhdID0gdGVtcDtcclxuICB9XHJcbiAgcmV0dXJuIGFycmF5O1xyXG59XHJcblxyXG5mdW5jdGlvbiBzd2FwKGFycmF5LCBpLCBqKSB7XHJcbiAgbGV0IHRlbXAgPSBhcnJheVtpXTtcclxuICBhcnJheVtpXSA9IGFycmF5W2pdO1xyXG4gIGFycmF5W2pdID0gdGVtcDtcclxufVxyXG5cclxuZnVuY3Rpb24gZmlyc3RFbXB0eUluZGV4KGFycmF5KSB7XHJcbiAgaWYgKGFycmF5Lmxlbmd0aCA8IDEpIHJldHVybiAwO1xyXG4gIFxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDw9IGFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICBpZiAoYXJyYXlbaV0gPT0gbnVsbCkgcmV0dXJuIGk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBsZXJwKHN0YXJ0LCBlbmQsIHRpbWUpIHtcclxuICAvL3JldHVybiBzdGFydCArICh0aW1lICogKGVuZCAtIHN0YXJ0KSk7XHJcbiAgcmV0dXJuICgoMSAtIHRpbWUpICogc3RhcnQpICsgKHRpbWUgKiBlbmQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjbGFtcCh2YWx1ZSwgbWluaW11bSwgbWF4aW11bSkge1xyXG4gIGlmICh2YWx1ZSA8IG1pbmltdW0pIHtcclxuICAgIHJldHVybiBtaW5pbXVtO1xyXG4gIH1cclxuICBlbHNlIGlmICh2YWx1ZSA+IG1heGltdW0pIHtcclxuICAgIHJldHVybiBtYXhpbXVtO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHJldHVybiB2YWx1ZTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJhbmRvbUludChtaW5pbXVtLCBtYXhpbXVtKSB7XHJcbiAgbWF4aW11bSsrO1xyXG4gIHJldHVybiBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogbWF4aW11bSkgKyBtaW5pbXVtKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHNodWZmbGUsXHJcbiAgc3dhcCxcclxuICBmaXJzdEVtcHR5SW5kZXgsXHJcbiAgbGVycCxcclxuICBjbGFtcCxcclxuICByYW5kb21JbnRcclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJleHByZXNzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImZzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImh0dHBcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibW9uZ29qc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJub2RlLWdhbWVsb29wXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInBhdGhcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwic29ja2V0LmlvXCIpOyJdLCJzb3VyY2VSb290IjoiIn0=
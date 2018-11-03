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
		this.controller = null;
		this.name = name;
		this.description = "";
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
	}
	
	// Character Stats
	get damage() {
		let damageTotal = this.damageBase + this.damageBonus;
		return (damageTotal < 0) ? 0 : damageTotal;
	}
	get defence() {
		let defenceTotal = this.defenceBase + this.defenceBonus;
		return (defenceTotal < 0) ? 0 : defenceTotal;
	}
	get healthMax() {
		let healthMaxTotal = this.healthMaxBase + this.healthMaxBonus
		return (healthMaxTotal < 1) ? 1 : healthMaxTotal;
	}
	get energyMax() {
		let energyMaxTotal = this.energyMaxBase + this.energyMaxBonus;
		return (energyMaxTotal < 0) ? 0 : energyMaxTotal;
	}
	get range() {
		let rangeTotal = this.rangeBase + this.rangeBonus;
		return (rangeTotal < 1) ? 1 : rangeTotal;
	}

	calcBaseStats() {
		// See Player and Bot classes
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
			if (item) {
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
		console.log(`${this.health}/${this.healthMax}`);
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

	setDead() {
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
				if (item && item.slot >= _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE) return true;
				return false;
			});

			equipment = _util_js__WEBPACK_IMPORTED_MODULE_3__["default"].shuffle(equipment);
			equipment.splice(-dropAmountEQ);
			equipment.forEach((item) => {
				this.dropItem(equipment.slot);
			});
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
		for (let i = _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE; i < _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE + _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].EQUIPMENT_SIZE; i++) {
			if (this.inventory[slot].canEquip(i)) {
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
			if (item) item.update();
		});

		if (this.isDead) return;
		
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
		if (data.mapId == null || data.x == null || data.y == null || data.botClass == null) {
			_db_js__WEBPACK_IMPORTED_MODULE_0__["default"].log("Bot requires parameters: mapId, x, y, botClass");
			return;
		}

		let classData = _db_js__WEBPACK_IMPORTED_MODULE_0__["default"].getBotData(data.botClass);
		if (!data.name) data.name = classData.name;
		if (data.sprite == null) data.sprite = classData.sprite;
		if (data.hostile == null) data.hostile = classData.hostile;
		
		super(data.mapId, data.x, data.y, data.name, data.sprite);
		this.controller = 'bot';
		if (data.id == null) data.id = _util_js__WEBPACK_IMPORTED_MODULE_3__["default"].firstEmptyIndex(_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[this.mapId].bots);
		this.id = data.id;
		this.botClass = data.botClass;
		this.hostile = data.hostile;
		this.calcBaseStats();
		this.restore();

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
			isDead: false,
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
		if (source instanceof _actor_js__WEBPACK_IMPORTED_MODULE_4__["default"]) this.setTask('attacking', source);
		super.takeDamage(damage, source);
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

	setDead() {
		super.setDead();
		delete _game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapData[this.mapId].bots[this.id];
	}

	calcBaseStats() {
		if (this.botClass == null) return;
		
		let classData = _db_js__WEBPACK_IMPORTED_MODULE_0__["default"].getBotData(this.botClass);
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
		for (let slot = 0; slot < _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE; slot++) {
			let item = this.inventory[slot];
			if (!item) {
				continue;
			}
			
			switch (item.type) {
				case 'weapon':
					if (this.inventory[_config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE]) {
						if (item.damage > this.inventory[_config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE].damage) {
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
						if (item.defence > this.inventory[_config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE + 1].defence) {
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
						if (item.defence > this.inventory[_config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE + 2].defence) {
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
						if (item.defence > this.inventory[_config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE + 3].defence) {
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
						if (item.damage > this.inventory[_config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE + 4].damage) {
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
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config.js */ "./server/src/config.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util.js */ "./server/src/util.js");
/* harmony import */ var _entity_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./entity.js */ "./server/src/classes/entity.js");






class Item extends _entity_js__WEBPACK_IMPORTED_MODULE_4__["default"] {
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
		if (data.description == null) data.description = classData.description;
		if (data.type == null) data.type = classData.type;
		if (data.sprite == null) data.sprite = classData.sprite;
		if (data.reusable == null) data.reusable = classData.reusable;
		if (data.stack == null) data.stack = classData.stack;

		if (data.passiveDamage == null) data.passiveDamage = classData.passiveDamage;
		if (data.passiveDefence == null) data.passiveDefence = classData.passiveDefence;
		if (data.passiveHealthMax == null) data.passiveHealthMax = classData.passiveHealthMax;
		if (data.passiveEnergyMax == null) data.passiveEnergyMax = classData.passiveEnergyMax;
		if (data.passiveRange == null) data.passiveRange = classData.passiveRange;

		if (data.equipDamage == null) data.equipDamage = classData.equipDamage;
		if (data.equipDefence == null) data.equipDefence = classData.equipDefence;
		if (data.equipHealthMax == null) data.equipHealthMax = classData.equipHealthMax;
		if (data.equipEnergyMax == null) data.equipEnergyMax = classData.equipEnergyMax;
		if (data.equipRange == null) data.equipRange = classData.equipRange;

		super(data.mapId, data.x, data.y, data.sprite);
		this.owner = data.owner;
		this.id = data.id;
		this.itemClass = data.itemClass;
		this.stack = data.stack;
		this.slot = data.slot;
		this.z = data.z;
		
		this.name = data.name;
		this.description = data.description;
		this.type = data.type;
		this.reusable = data.reusable;

		this.passiveDamage = data.passiveDamage;
		this.passiveDefence = data.passiveDefence;
		this.passiveHealthMax = data.passiveHealthMax;
		this.passiveEnergyMax = data.passiveEnergyMax;
		this.passiveRange = data.passiveRange;
		this.equipDamage = data.equipDamage;
		this.equipDefence = data.equipDefence;
		this.equipHealthMax = data.equipHealthMax;
		this.equipEnergyMax = data.equipEnergyMax;
		this.equipRange = data.equipRange;

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
	
	get damage() {
		let damageTotal = this.passiveDamage + this.equipDamage;
		return (damageTotal < 0) ? 0 : damageTotal;
	}
	get defence() {
		let defenceTotal = this.passiveDefence + this.equipDefence;
		return (defenceTotal < 0) ? 0 : defenceTotal;
	}
	get healthMax() {
		let healthMaxTotal = this.passiveHealthMax + this.equipHealthMax;
		return (healthMaxTotal < 0) ? 0 : healthMaxTotal;
	}
	get energyMax() {
		let energyMaxTotal = this.passiveEnergyMax + this.equipEnergyMax;
		return (energyMaxTotal < 0) ? 0 : energyMaxTotal;
	}
	get range() {
		let rangeTotal = this.passiveRange + this.equipRange;
		return (rangeTotal < 0) ? 0 : rangeTotal;
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
			description: this.description,
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
		const itemTypes = ['weapon', 'shield', 'armour', 'helmet', 'ring'];
		return (itemTypes.includes(this.type));
	}

	canEquip(slot) {
		if (slot === _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE) {
			if (this.type === 'weapon') return true;
		}
		else if (slot === _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE + 1) {
			if (this.type === 'shield') return true;
		}
		else if (slot === _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE + 2) {
			if (this.type === 'armour') return true;
		}
		else if (slot === _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE + 3) {
			if (this.type === 'helmet') return true;
		}
		else if (slot === _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE + 4) {
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
		this.id = _util_js__WEBPACK_IMPORTED_MODULE_3__["default"].firstEmptyIndex(_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].mapList[this.mapId].items);
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
		this.tiles = data.tiles;
	}
	
	update(delta) {
		let pack = {
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
			tiles: this.tiles,
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
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config.js */ "./server/src/config.js");
/* harmony import */ var _actor_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./actor.js */ "./server/src/classes/actor.js");
/* harmony import */ var _text_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./text.js */ "./server/src/classes/text.js");






// A Player is an immortal Actor which takes input from a client

class Player extends _actor_js__WEBPACK_IMPORTED_MODULE_3__["default"] {
	constructor(id) {
		const data = _db_js__WEBPACK_IMPORTED_MODULE_0__["default"].getPlayerData(id);

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

		this.isDead = false;
		this.deaths = 0;
		this.respawnTimer = 0;
		this.respawnSpeed = 10;
		this.respawnMap = data.mapId;
		this.respawnX = data.x;
		this.respawnY = data.y;

		this.selected = null;
		this.input = {
			direction: null,
			run: false,
			pickup: false,
			attack: false
		}
	}

	update(delta) {
		super.update(delta);		// Default Actor Update
		if (this.isDead) {
			// Respawning
			this.respawnTimer += delta;
			if (this.respawnTimer >= this.respawnSpeed) this.respawn();
		}
		else {
			// Check for Atack Input
			if (this.input.attack && this.attackTimer === 0) this.attack();
			
			// Check for Movement Input
			if (!this.isMoving) {
				if (this.input.direction) {
					// Check for Run Input
					if (this.input.run) {
						(this.energy > 0) ? this.isRunning = true : this.isRunning = false;
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
			description: this.description,
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

	setDead(killerController, killerName) {
		super.setDead();
		this.isDead = true;
		this.health = 0;
		this.energy = 0;
		this.deaths++;
		
		if (killerController && killerName) {
			if (killerController === 'player') {
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
		_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendGameInfoPlayer(this.id, "The Angel of Mercy refuses to let you die.");
	}

	calcBaseStats() {	// Class and Level
		//TODO: check db for class stats: base and increase per level
		// this.damageBase = playerClass.damageBase + (playerClass.increasePerLevel.damage * this.level);
		this.damageBase = _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].START_DAMAGE;
		this.defenceBase = _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].START_DEFENCE;
		this.healthMaxBase = _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].START_HEALTH_MAX;
		this.energyMaxBase = _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].START_ENERGY_MAX;
		this.rangeBase = _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].START_RANGE;
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
config.BACKUP_TIME = 120;

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
config.START_RANGE = 1;

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
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mongojs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mongojs */ "mongojs");
/* harmony import */ var mongojs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(mongojs__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./config.js */ "./server/src/config.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util.js */ "./server/src/util.js");





const mongo = mongojs__WEBPACK_IMPORTED_MODULE_1___default()('localhost:27017/odyssey', ['accounts', 'players', 'maps', 'items', 'bots']);

class Database {
	constructor() {
		this.maps = JSON.parse(fs__WEBPACK_IMPORTED_MODULE_0___default.a.readFileSync('./server/data/maps.json', 'utf8'));
		this.players = JSON.parse(fs__WEBPACK_IMPORTED_MODULE_0___default.a.readFileSync('./server/data/players.json', 'utf8'));
		this.items = JSON.parse(fs__WEBPACK_IMPORTED_MODULE_0___default.a.readFileSync('./server/data/item-classes.json', 'utf8'));
		this.bots = JSON.parse(fs__WEBPACK_IMPORTED_MODULE_0___default.a.readFileSync('./server/data/bot-classes.json', 'utf8'));
		this.serverLog = [];
	}

	backup() {
		const serverLog = this.getServerLog();
		this.serverLog = [];
		
		const promiseLog = fs__WEBPACK_IMPORTED_MODULE_0___default.a.promises.writeFile('./server/data/serverlog.json', JSON.stringify(serverLog), 'utf8');
		const promisePlayers = fs__WEBPACK_IMPORTED_MODULE_0___default.a.promises.writeFile('./server/data/players.json', JSON.stringify(this.players), 'utf8');
		const promiseMaps = fs__WEBPACK_IMPORTED_MODULE_0___default.a.promises.writeFile('./server/data/maps.json', JSON.stringify(this.maps), 'utf8');
		Promise.all([promiseLog, promisePlayers, promiseMaps])
		.then(this.log("Game saved to disk."))
		.catch((err) => this.log(err.message));
	}

	log(message) {
		const date = new Date();
		console.log(_util_js__WEBPACK_IMPORTED_MODULE_3__["default"].timestamp(date) + " - " + message);
		this.serverLog.push({
			message,
			date
		});
	}

	getServerLog() {
		return JSON.parse(fs__WEBPACK_IMPORTED_MODULE_0___default.a.readFileSync('./server/data/serverlog.json', 'utf8')).concat(this.serverLog);
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
		let playerData = this.players[id];

		if (!playerData) {  // First Login
			playerData = {
				name: _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].START_NAME,
				description: "",
				sprite: _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].START_SPRITE,
				adminAccess: 0,
				mapId: _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].START_MAP,
				x: _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].START_X,
				y: _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].START_Y,
				damageBase: _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].START_DAMAGE,
				defenceBase: _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].START_DEFENCE,
				healthMaxBase: _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].START_HEALTH_MAX,
				energyMaxBase: _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].START_ENERGY_MAX,
				rangeBase: _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].START_RANGE
			};
		}
		
		return playerData;
	}

	savePlayerData(data) {
		this.players[data.id] = data;

		fs__WEBPACK_IMPORTED_MODULE_0___default.a.writeFile('./server/data/players.json', JSON.stringify(this.players), 'utf8', (err) => {
			if (err) {
				this.log(err);
			}
			else {
				this.log("Player data backed up.");
			}
		});
		//mongo.players.save(data.id, data);
	}

	getMapData(mapId) {
		let mapData = this.maps[mapId];

		if (!mapData) {
			mapData.name = "Blank Map";
			mapData.items = [];
			mapData.bots = [];
			mapData.effects = [];
			mapData.texts = [];
			mapData.dropChance = 100;
			mapData.dropAmountEQ = 1;
			mapData.tiles = {
				layer: [
					[[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
					[[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
					[[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
					[[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
					[[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
					[[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
				],
				wall: [[false, false, false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false, false, false]],
				canAttack: [[false, false, false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false, false, false]],
				damage: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
				defence: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
				healthMax: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
				warpMap: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
				warpX: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
				warpY: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
			};
		}

		return mapData;
	}
	
	saveMapData(data) {
		this.maps[data.id] = data;

		fs__WEBPACK_IMPORTED_MODULE_0___default.a.writeFile('./server/data/maps.json', JSON.stringify(this.maps), 'utf8', (err) => {
			if (err) {
				this.log(err);
			}
			else {
				this.log("Map data backed up.");
			}
		});
		//mongo.maps.save(data.id, data);
	}

	getBotData(botClass) {
		let botData = this.bots[botClass];

		if (!botData) {  // First Login
			botData = {
				name: _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].START_NAME,
				description: "",
				sprite: _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].START_SPRITE,
				mapId: _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].START_MAP,
				x: _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].START_X,
				y: _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].START_Y,
				damageBase: _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].START_DAMAGE,
				defenceBase: _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].START_DEFENCE,
				healthMaxBase: _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].START_HEALTH_MAX,
				energyMaxBase: _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].START_ENERGY_MAX,
				rangeBase: _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].START_RANGE
			};
		}
		
		return botData;
	}

	saveBotData(data) {
		this.bots[data.botClass] = data;

		fs__WEBPACK_IMPORTED_MODULE_0___default.a.writeFile('./server/data/bot-classes.json', JSON.stringify(this.bots), 'utf8', (err) => {
      if (err) {
        this.log(err);
      }
      else {
        this.log("Bot Class data backed up.");
      }
    });
	}

	getItemData(itemClass) {
		return this.items[itemClass];
	}

	saveItemData(data) {
		this.items[data.itemClass] = data;

		fs__WEBPACK_IMPORTED_MODULE_0___default.a.writeFile('./server/data/item-classes.json', JSON.stringify(this.items), 'utf8', (err) => {
      if (err) {
        this.log(err);
      }
      else {
        this.log("Item Class data backed up.");
      }
    });
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
		this.mapData = JSON.parse(fs__WEBPACK_IMPORTED_MODULE_0___default.a.readFileSync('./server/data/maps.json', 'utf8'));
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
		const player = new _classes_player_js__WEBPACK_IMPORTED_MODULE_5__["default"](id);
		this.playerList[id] = player;
		this.sendGameInfoGlobal(`${player.name} has logged in.`);
		return player;
	}
	
	playerLogout(id) {
		let player = this.playerList[id];
		if (player) {
			_db_js__WEBPACK_IMPORTED_MODULE_1__["default"].savePlayerData(player.getPack);
			this.sendGameInfoGlobal(`${player.name} has logged out.`);
			delete this.mapList[player.mapId].texts[player.displayNameId];
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
		if (map.tiles.wall[y][x] === true) return false;
		
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
		new _classes_text_js__WEBPACK_IMPORTED_MODULE_9__["default"](mapId, x, y + 0.5, damage, '#ff0000', 1.25, 0, -1);
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
		this.timer = {
			backup: 0,
			minute: 0
		};

		this.id = node_gameloop__WEBPACK_IMPORTED_MODULE_0___default.a.setGameLoop((delta) => this.update(delta), _config_js__WEBPACK_IMPORTED_MODULE_4__["default"].FRAMERATE);
	}

	update(delta) {
		// Increase Timers
		this.timer.backup += delta;
		this.timer.minute += delta;

		// Update the game state
		let updatePack = _game_js__WEBPACK_IMPORTED_MODULE_2__["default"].update(delta);
		// Send updated state to clients
		_server_js__WEBPACK_IMPORTED_MODULE_3__["default"].sendUpdatePack(updatePack);
		
		// Minute timer script
		if (this.timer.minute >= 60) {
			this.timer.minute -= 60;
			// TODO: run minute timer script
		}

		// Periodic backup to database
		if (this.timer.backup >= _config_js__WEBPACK_IMPORTED_MODULE_4__["default"].BACKUP_TIME) {
			this.timer.backup -= _config_js__WEBPACK_IMPORTED_MODULE_4__["default"].BACKUP_TIME;
			_db_js__WEBPACK_IMPORTED_MODULE_1__["default"].backup();
		}
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
		const httpServer = http__WEBPACK_IMPORTED_MODULE_1___default.a.Server(app);
		const io = socket_io__WEBPACK_IMPORTED_MODULE_2___default()(httpServer);
		const port = process.env.PORT || _config_js__WEBPACK_IMPORTED_MODULE_6__["default"].PORT;
		const publicPath = path__WEBPACK_IMPORTED_MODULE_3___default.a.resolve(__dirname, '../client');
		
		app.get('/', (req, res) => res.sendFile(publicPath + '/index.html'));
		app.use('/client', express__WEBPACK_IMPORTED_MODULE_0___default.a.static(publicPath));
		httpServer.listen(port, () => _db_js__WEBPACK_IMPORTED_MODULE_4__["default"].log(`Server started. Listening on port ${httpServer.address().port}...`));

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
		socket.on('input', (data) => this.onInput(player, data));

		// Send Map Data
		this.sendMapData(player.id, player.mapId);
	}
	
	onLogout(id) {
		_game_js__WEBPACK_IMPORTED_MODULE_5__["default"].playerLogout(id);
	}
	
	async onInput(player, data) {
		switch (data.input) {
			case null:
			case 'move': player.input.direction = data.direction;
			break;
			case 'run': player.input.run = data.state;
			break;
			case 'pickup':
				if (!player.input.pickup && data.state) {
					player.pickUp();
				}
				player.input.pickup = data.state;
			break;
			case 'attack':
			player.input.attack = data.state;
				if (!player.isDead) player.attack(1, player.direction);
			break;
			case 'doubleClickItem':
				if (player.inventory[data.slot]) {
					if (!player.isDead) player.useItem(data.slot);
				}
			break;
			case 'rightClickItem':
				if (player.inventory[data.slot]) {
					if (!player.isDead) player.dropItem(data.slot);
				}
			break;
			case 'dragStopGame':
				if (player.inventory[data.slot]) {
					if (!player.isDead) player.dropItem(data.slot);
				}
			break;
			case 'dragStopInventory':
			case 'dragStopEquipment':
				if (player.inventory[data.slot]) {
					if (!player.isDead) player.moveItemToSlot(data.slot, data.newSlot);
				}
			break;
			case 'serverChat': _game_js__WEBPACK_IMPORTED_MODULE_5__["default"].sendMessageGlobal(player.id, `${player.name} yells, "${data.message}"`);
			break;
			case 'mapChat': _game_js__WEBPACK_IMPORTED_MODULE_5__["default"].sendMessageMap(player.id, player.mapId, `${player.name} says, "${data.message}"`);
			break;
			case 'playerChat':
				let target = player.playerList[data.targetId];
				if (target) {
					_game_js__WEBPACK_IMPORTED_MODULE_5__["default"].sendMessagePlayer(player.id, target.id, `${player.name} whispers, "${data.message}"`);
					_game_js__WEBPACK_IMPORTED_MODULE_5__["default"].sendMessagePlayer(player.id, player.id, `You whisper to ${target.name}, "${data.message}"`);
				}
			break;

			// God Inputs
			case 'spawnMapItem':
				if (player.adminAccess >= 2) {
					_game_js__WEBPACK_IMPORTED_MODULE_5__["default"].spawnMapItem(data.args[0], data.args[1], data.args[2], data.args[3], data.args[4]);
				}
				else {
					_game_js__WEBPACK_IMPORTED_MODULE_5__["default"].sendGameInfoPlayer(player.id, `You don't have access to that command.`);
				}
			break;
			case 'spawnBot':
				if (player.adminAccess >= 2) {
					_game_js__WEBPACK_IMPORTED_MODULE_5__["default"].spawnBot(data.args[0], data.args[1], data.args[2], data.args[3]);
				}
				else {
					_game_js__WEBPACK_IMPORTED_MODULE_5__["default"].sendGameInfoPlayer(player.id, `You don't have access to that command.`);
				}
			break;
			case 'uploadMap':
				if (player.adminAccess >= 2) {
					await _db_js__WEBPACK_IMPORTED_MODULE_4__["default"].saveMapData(data);
		
					_game_js__WEBPACK_IMPORTED_MODULE_5__["default"].playerList.forEach((player) => {
						if (player.mapId === data.id) {
							this.sendMapData(player.id, player.mapId);
						}
					});
				}
				else {
					_game_js__WEBPACK_IMPORTED_MODULE_5__["default"].sendGameInfoPlayer(player.id, `You don't have access to that command.`);
				}
			break;
		}
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
	
	sendMapData(id, mapId) {
		let socket = this.socketList[id];
		socket.emit('loadMap', _db_js__WEBPACK_IMPORTED_MODULE_4__["default"].getMapData(mapId));
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
  return Math.floor((Math.random() * (maximum + 1)) + minimum);
}

function getXFromIndex(index, columns) {
  return index % columns;
}

function getYFromIndex(index, columns) {
  return (index - (index % columns)) / columns;
}

function getIndexFromXY(x, y, columns) {
  return (y * columns) + x;
}

function timestamp(date) {
  if (!(date instanceof Date)) return "Invalid date";
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();
  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;
  if (hour < 10) hour = "0" + hour;
  if (minute < 10) minute = "0" + minute;
  if (second < 10) second = "0" + second;
  return `${date.getFullYear()}-${month}-${day} ${hour}:${minute}:${second}`;
}

function indefiniteArticle(word) {
	let regex = /trousers$|jeans$|glasses$/i;
	if (word.match(regex)) return "a pair of " + word;

	regex = /^[aeiou]/i;
	if (word.match(regex)) return "an " + word;

	return "a " + word;
}

function plural(word) {
	let regex = /sheep$|deer$|fish$/i;
	if (word.match(regex)) return word;

	regex = /trousers$|jeans$|glasses$/i;
	if (word.match(regex)) return "pairs of " + word;
	
	regex = /stomach$|epoch$|/i;
	if (word.match(regex)) return word + "s";
	
	regex = /f$|fe$/i;
	if (word.match(regex)) return word.replace(regex, "ves");

	regex = /[sxz]$|ch$|sh$|ato$/i;
	if (word.match(regex)) return word + "es";
	
	regex = /y$/i;
	if (word.match(regex)) return word.replace(regex, "ies");
	
	return word + "s";
}

/* harmony default export */ __webpack_exports__["default"] = ({
  shuffle,
  swap,
  firstEmptyIndex,
  lerp,
  clamp,
  randomInt,
  getXFromIndex,
  getYFromIndex,
  getIndexFromXY,
  timestamp,
  indefiniteArticle,
  plural
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL2FjdG9yLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy9ib3QuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL2VmZmVjdC5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2NsYXNzZXMvZW50aXR5LmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy9pdGVtLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy9tYXAuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL21lc3NhZ2UuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL3BsYXllci5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2NsYXNzZXMvdGV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2NvbmZpZy5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2RiLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvZ2FtZS5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2dhbWVsb29wLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL3NlcnZlci5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL3V0aWwuanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZXhwcmVzc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImZzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiaHR0cFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcIm1vbmdvanNcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJub2RlLWdhbWVsb29wXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicGF0aFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInNvY2tldC5pb1wiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLDZJQUFxRDtBQUN0RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxtQkFBbUI7QUFDbkI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsK0RBQStEOztBQUUvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLHNCQUFzQjtBQUN0QixHQUFHOztBQUVIOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQSxpQkFBaUIsWUFBWSxHQUFHLGVBQWU7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJOztBQUVKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTs7QUFFSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLHlEQUF5RDs7QUFFekQsMkJBQTJCO0FBQzNCLGtGQUFzQztBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQkFBb0IsOElBQXNEO0FBQzFFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHlCQUF5QixtSkFBMkQ7QUFDcEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0VBQWtFO0FBQ2xFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpRkFBcUMsMklBQW1EO0FBQ3hGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxvQkFBb0IsMEVBQThCO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDam9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHNCQUFzQjtBQUN0Qjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQix1RkFBMkM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxvQkFBb0IsMEVBQThCO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzVRQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEU7QUFDQSxDOzs7Ozs7Ozs7Ozs7Ozs7QUMzREE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZNQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsQzs7Ozs7Ozs7Ozs7Ozs7QUNyRUE7QUFDQTtBQUNBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsb0NBQW9DO0FBQ3BDLHNDQUFzQztBQUN0QywwQ0FBMEM7QUFDMUMsMENBQTBDO0FBQzFDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLHVGQUEyQztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM0tBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDcEVBO0FBQUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMEJBQTBCLG1CQUFtQjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdELFNBQVM7QUFDekQ7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTs7QUFFQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoTUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0JBQWtCLGtFQUFzQjtBQUN4QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QixZQUFZO0FBQ3pDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsWUFBWTtBQUMxQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM5SUE7QUFBQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx3SEFBNEUsMEJBQTBCOztBQUV0RztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyRUFBK0IsVUFBVTs7QUFFekM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlFQUE2QixHQUFHO0FBQ2hDOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUdBQTJELFlBQVksV0FBVyxhQUFhO0FBQy9GO0FBQ0EsK0dBQW1FLFlBQVksVUFBVSxhQUFhO0FBQ3RHO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUdBQXFELFlBQVksY0FBYyxhQUFhO0FBQzVGLGdIQUFvRSxZQUFZLEtBQUssYUFBYTtBQUNsRztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSTs7QUFFSjtBQUNBO0FBQ0E7QUFDQSxJQUFJOztBQUVKO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7OztBQzdLQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxpQkFBaUIsbUJBQW1CO0FBQ3BDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLG1CQUFtQixHQUFHLE1BQU0sR0FBRyxJQUFJLEdBQUcsS0FBSyxHQUFHLE9BQU8sR0FBRyxPQUFPO0FBQzNFOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3pIQSxvQzs7Ozs7Ozs7Ozs7QUNBQSwrQjs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSxvQzs7Ozs7Ozs7Ozs7QUNBQSwwQzs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSxzQyIsImZpbGUiOiJzZXJ2ZXIuYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zZXJ2ZXIvc3JjL21haW4uanNcIik7XG4iLCJpbXBvcnQgZGIgZnJvbSAnLi4vZGIuanMnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuLi9nYW1lLmpzJztcclxuaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9jb25maWcuanMnO1xyXG5pbXBvcnQgdXRpbCBmcm9tICcuLi91dGlsLmpzJztcclxuaW1wb3J0IEVudGl0eSBmcm9tICcuL2VudGl0eS5qcyc7XHJcblxyXG4vLyBBbiBBY3RvciBpcyBhbiBFbnRpdHkgd2hpY2ggY2FuIG1vdmUsIGF0dGFjayBhbmQgaW50ZXJhY3Qgd2l0aCBpdGVtc1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWN0b3IgZXh0ZW5kcyBFbnRpdHkge1xyXG5cdGNvbnN0cnVjdG9yKG1hcElkLCB4LCB5LCBuYW1lLCBzcHJpdGUpIHtcclxuXHRcdHNwcml0ZSA9IHV0aWwuY2xhbXAoc3ByaXRlLCAxLCBjb25maWcuTUFYX1NQUklURVMpO1xyXG5cclxuXHRcdHN1cGVyKG1hcElkLCB4LCB5LCBzcHJpdGUpO1xyXG5cdFx0dGhpcy5jb250cm9sbGVyID0gbnVsbDtcclxuXHRcdHRoaXMubmFtZSA9IG5hbWU7XHJcblx0XHR0aGlzLmRlc2NyaXB0aW9uID0gXCJcIjtcclxuXHRcdHRoaXMuaW52ZW50b3J5ID0gW107XHJcblxyXG5cdFx0dGhpcy5jYWxjU3RhdHMoKTtcclxuXHRcdHRoaXMucmVzdG9yZSgpO1xyXG5cclxuXHRcdHRoaXMuZGlyZWN0aW9uID0gJ2Rvd24nO1xyXG5cdFx0dGhpcy5zdGFydFggPSB0aGlzLng7XHJcblx0XHR0aGlzLnN0YXJ0WSA9IHRoaXMueTtcclxuXHRcdHRoaXMuZGVzdGluYXRpb25YID0gdGhpcy54O1xyXG5cdFx0dGhpcy5kZXN0aW5hdGlvblkgPSB0aGlzLnk7XHJcblx0XHR0aGlzLmxlcnAgPSAwO1xyXG5cclxuXHRcdHRoaXMuaXNNb3ZpbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMuaXNSdW5uaW5nID0gZmFsc2U7XHJcblx0XHR0aGlzLm1vdmVTcGVlZCA9IDIuNTtcclxuXHRcdHRoaXMubW92ZW1lbnRUaW1lciA9IDA7XHJcblx0XHR0aGlzLmxhemluZXNzID0gMDtcclxuXHJcblx0XHR0aGlzLmlzQXR0YWNraW5nID0gZmFsc2U7XHJcblx0XHR0aGlzLmF0dGFja1NwZWVkID0gMTtcclxuXHRcdHRoaXMuYXR0YWNrVGltZXIgPSAwO1x0XHJcblx0XHR0aGlzLnRhcmdldCA9IG51bGw7XHJcblx0XHR0aGlzLmtpbGxzID0gMDtcclxuXHR9XHJcblx0XHJcblx0Ly8gQ2hhcmFjdGVyIFN0YXRzXHJcblx0Z2V0IGRhbWFnZSgpIHtcclxuXHRcdGxldCBkYW1hZ2VUb3RhbCA9IHRoaXMuZGFtYWdlQmFzZSArIHRoaXMuZGFtYWdlQm9udXM7XHJcblx0XHRyZXR1cm4gKGRhbWFnZVRvdGFsIDwgMCkgPyAwIDogZGFtYWdlVG90YWw7XHJcblx0fVxyXG5cdGdldCBkZWZlbmNlKCkge1xyXG5cdFx0bGV0IGRlZmVuY2VUb3RhbCA9IHRoaXMuZGVmZW5jZUJhc2UgKyB0aGlzLmRlZmVuY2VCb251cztcclxuXHRcdHJldHVybiAoZGVmZW5jZVRvdGFsIDwgMCkgPyAwIDogZGVmZW5jZVRvdGFsO1xyXG5cdH1cclxuXHRnZXQgaGVhbHRoTWF4KCkge1xyXG5cdFx0bGV0IGhlYWx0aE1heFRvdGFsID0gdGhpcy5oZWFsdGhNYXhCYXNlICsgdGhpcy5oZWFsdGhNYXhCb251c1xyXG5cdFx0cmV0dXJuIChoZWFsdGhNYXhUb3RhbCA8IDEpID8gMSA6IGhlYWx0aE1heFRvdGFsO1xyXG5cdH1cclxuXHRnZXQgZW5lcmd5TWF4KCkge1xyXG5cdFx0bGV0IGVuZXJneU1heFRvdGFsID0gdGhpcy5lbmVyZ3lNYXhCYXNlICsgdGhpcy5lbmVyZ3lNYXhCb251cztcclxuXHRcdHJldHVybiAoZW5lcmd5TWF4VG90YWwgPCAwKSA/IDAgOiBlbmVyZ3lNYXhUb3RhbDtcclxuXHR9XHJcblx0Z2V0IHJhbmdlKCkge1xyXG5cdFx0bGV0IHJhbmdlVG90YWwgPSB0aGlzLnJhbmdlQmFzZSArIHRoaXMucmFuZ2VCb251cztcclxuXHRcdHJldHVybiAocmFuZ2VUb3RhbCA8IDEpID8gMSA6IHJhbmdlVG90YWw7XHJcblx0fVxyXG5cclxuXHRjYWxjQmFzZVN0YXRzKCkge1xyXG5cdFx0Ly8gU2VlIFBsYXllciBhbmQgQm90IGNsYXNzZXNcclxuXHR9XHJcblxyXG5cdGNhbGNJdGVtQm9udXMoKSB7XHJcblx0XHRsZXQgaXRlbUJvbnVzID0ge1xyXG5cdFx0XHRkYW1hZ2U6IDAsXHJcblx0XHRcdGRlZmVuY2U6IDAsXHJcblx0XHRcdGhlYWx0aE1heDogMCxcclxuXHRcdFx0ZW5lcmd5TWF4OiAwLFxyXG5cdFx0XHRyYW5nZTogMFxyXG5cdFx0fTtcclxuXHRcdFxyXG5cdFx0Ly8gRm9yIGVhY2ggaXRlbSBpbiBpbnZlbnRvcnkgY2hlY2sgZm9yIGJvbnVzZXNcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgKGNvbmZpZy5JTlZFTlRPUllfU0laRSArIGNvbmZpZy5FUVVJUE1FTlRfU0laRSk7IGkrKykge1xyXG5cdFx0XHRsZXQgaXRlbSA9IHRoaXMuaW52ZW50b3J5W2ldO1xyXG5cdFx0XHRpZiAoaXRlbSkge1xyXG5cdFx0XHRcdGl0ZW1Cb251cy5kYW1hZ2UgKz0gaXRlbS5wYXNzaXZlRGFtYWdlO1xyXG5cdFx0XHRcdGl0ZW1Cb251cy5kZWZlbmNlICs9IGl0ZW0ucGFzc2l2ZURlZmVuY2U7XHJcblx0XHRcdFx0aXRlbUJvbnVzLmhlYWx0aE1heCArPSBpdGVtLnBhc3NpdmVIZWFsdGhNYXg7XHJcblx0XHRcdFx0aXRlbUJvbnVzLmVuZXJneU1heCArPSBpdGVtLnBhc3NpdmVFbmVyZ3lNYXg7XHJcblx0XHRcdFx0aXRlbUJvbnVzLnJhbmdlICs9IGl0ZW0ucGFzc2l2ZVJhbmdlO1xyXG5cclxuXHRcdFx0XHRpZiAoaSA+PSBjb25maWcuSU5WRU5UT1JZX1NJWkUpIHtcclxuXHRcdFx0XHRcdGl0ZW1Cb251cy5kYW1hZ2UgKz0gaXRlbS5lcXVpcERhbWFnZTtcclxuXHRcdFx0XHRcdGl0ZW1Cb251cy5kZWZlbmNlICs9IGl0ZW0uZXF1aXBEZWZlbmNlO1xyXG5cdFx0XHRcdFx0aXRlbUJvbnVzLmhlYWx0aE1heCArPSBpdGVtLmVxdWlwSGVhbHRoTWF4O1xyXG5cdFx0XHRcdFx0aXRlbUJvbnVzLmVuZXJneU1heCArPSBpdGVtLmVxdWlwRW5lcmd5TWF4O1xyXG5cdFx0XHRcdFx0aXRlbUJvbnVzLnJhbmdlICs9IGl0ZW0uZXF1aXBSYW5nZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIGl0ZW1Cb251cztcclxuXHR9XHJcblxyXG5cdGNhbGNFZmZlY3RCb251cygpIHtcclxuXHRcdGxldCBlZmZlY3RCb251cyA9IHtcclxuXHRcdFx0ZGFtYWdlOiAwLFxyXG5cdFx0XHRkZWZlbmNlOiAwLFxyXG5cdFx0XHRoZWFsdGhNYXg6IDAsXHJcblx0XHRcdGVuZXJneU1heDogMCxcclxuXHRcdFx0cmFuZ2U6IDBcclxuXHRcdH07XHJcblxyXG5cdFx0Ly8gVE9ETzogd29yayBvdXQgaG93IHRvIGRvIGVmZmVjdHMgZm9yIHNwZWxscyBhbmQgcG90aW9uc1xyXG5cdFx0cmV0dXJuIGVmZmVjdEJvbnVzO1xyXG5cdH1cclxuXHRcclxuXHRjYWxjQm9udXNTdGF0cygpIHtcdC8vIEl0ZW1zIChlcXVpcHBlZCBhbmQgcGFzc2l2ZSkgYW5kIEVmZmVjdHMgKHNwZWxscyBhbmQgcG90aW9ucylcclxuXHRcdGxldCBpdGVtQm9udXMgPSB0aGlzLmNhbGNJdGVtQm9udXMoKTtcclxuXHRcdGxldCBlZmZlY3RCb251cyA9IHRoaXMuY2FsY0VmZmVjdEJvbnVzKCk7XHJcblxyXG5cdFx0dGhpcy5kYW1hZ2VCb251cyA9IGl0ZW1Cb251cy5kYW1hZ2UgKyBlZmZlY3RCb251cy5kYW1hZ2U7XHJcblx0XHR0aGlzLmRlZmVuY2VCb251cyA9IGl0ZW1Cb251cy5kZWZlbmNlICsgZWZmZWN0Qm9udXMuZGVmZW5jZTtcclxuXHRcdHRoaXMuaGVhbHRoTWF4Qm9udXMgPSBpdGVtQm9udXMuaGVhbHRoTWF4ICsgZWZmZWN0Qm9udXMuaGVhbHRoTWF4O1xyXG5cdFx0dGhpcy5lbmVyZ3lNYXhCb251cyA9IGl0ZW1Cb251cy5lbmVyZ3lNYXggKyBlZmZlY3RCb251cy5lbmVyZ3lNYXg7XHJcblx0XHR0aGlzLnJhbmdlQm9udXMgPSBpdGVtQm9udXMucmFuZ2UgKyBlZmZlY3RCb251cy5yYW5nZTtcclxuXHR9XHJcblxyXG5cdGNhbGNTdGF0cygpIHtcclxuXHRcdHRoaXMuY2FsY0Jhc2VTdGF0cygpO1xyXG5cdFx0dGhpcy5jYWxjQm9udXNTdGF0cygpO1xyXG5cdH1cclxuXHJcblx0cmVzdG9yZSgpIHtcclxuXHRcdHRoaXMuaGVhbHRoID0gdGhpcy5oZWFsdGhNYXg7XHJcblx0XHR0aGlzLmVuZXJneSA9IHRoaXMuZW5lcmd5TWF4O1xyXG5cdH1cclxuXHRcclxuXHQvLyBNb3ZlbWVudFxyXG5cdG1vdmUoZGlyZWN0aW9uKSB7XHJcblx0XHRpZiAodGhpcy5pc01vdmluZykgcmV0dXJuO1xyXG5cclxuXHRcdGlmIChkaXJlY3Rpb24pIHtcclxuXHRcdFx0dGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGRpcmVjdGlvbiA9PT0gJ2xlZnQnKSB7XHJcblx0XHRcdGlmICghZ2FtZS5pc1ZhY2FudCh0aGlzLm1hcElkLCB0aGlzLnggLSAxLCB0aGlzLnkpKSByZXR1cm47XHJcblx0XHRcdHRoaXMuZGVzdGluYXRpb25YLS07XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdyaWdodCcpIHtcclxuXHRcdFx0aWYgKCFnYW1lLmlzVmFjYW50KHRoaXMubWFwSWQsIHRoaXMueCArIDEsIHRoaXMueSkpIHJldHVybjtcclxuXHRcdFx0dGhpcy5kZXN0aW5hdGlvblgrKztcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ3VwJykge1xyXG5cdFx0XHRpZiAoIWdhbWUuaXNWYWNhbnQodGhpcy5tYXBJZCwgdGhpcy54LCB0aGlzLnkgLSAxKSkgcmV0dXJuO1xyXG5cdFx0XHR0aGlzLmRlc3RpbmF0aW9uWS0tO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoZGlyZWN0aW9uID09PSAnZG93bicpIHtcclxuXHRcdFx0aWYgKCFnYW1lLmlzVmFjYW50KHRoaXMubWFwSWQsIHRoaXMueCwgdGhpcy55ICsgMSkpIHJldHVybjtcclxuXHRcdFx0dGhpcy5kZXN0aW5hdGlvblkrKztcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRzd2l0Y2ggKHV0aWwucmFuZG9tSW50KDAsIDMgKyB0aGlzLmxhemluZXNzKSkge1xyXG5cdFx0XHRcdGNhc2UgMDogdGhpcy5tb3ZlKCdsZWZ0Jyk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAxOiB0aGlzLm1vdmUoJ3JpZ2h0Jyk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAyOiB0aGlzLm1vdmUoJ3VwJyk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAzOiB0aGlzLm1vdmUoJ2Rvd24nKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRkZWZhdWx0OiAvLyBEb24ndCBNb3ZlXHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFNldCBtb3ZlIHNwZWVkXHJcblx0XHRpZiAodGhpcy5pc1J1bm5pbmcpIHtcclxuXHRcdFx0aWYgKHRoaXMuZW5lcmd5ID4gMCkge1xyXG5cdFx0XHRcdHRoaXMuZW5lcmd5LS07XHJcblx0XHRcdFx0dGhpcy5tb3ZlU3BlZWQgPSA0O1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMuZW5lcmd5ID0gMDtcclxuXHRcdFx0XHR0aGlzLm1vdmVTcGVlZCA9IDIuNTtcclxuXHRcdFx0XHR0aGlzLmlzUnVubmluZyA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0dGhpcy5tb3ZlU3BlZWQgPSAyLjU7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHRoaXMuaXNNb3ZpbmcgPSB0cnVlO1xyXG5cdH1cclxuXHRcclxuXHRtb3ZlVG9UYXJnZXQodGFyZ2V0LCBob3N0aWxlKSB7XHJcblx0XHRpZiAoIXRhcmdldCkgcmV0dXJuO1xyXG5cdFx0XHJcblx0XHRpZiAodGFyZ2V0LnggPT09IHRoaXMueCAmJiB0YXJnZXQueSA9PT0gdGhpcy55KSB7XHJcblx0XHRcdHRoaXMubW92ZSgpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAodXRpbC5yYW5kb21JbnQoMCwgMSkgPT09IDApIHtcclxuXHRcdFx0aWYgKHRhcmdldC54IDwgdGhpcy54KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID49ICh0aGlzLnggLSB0aGlzLnJhbmdlKSAmJiB0YXJnZXQueSA9PT0gdGhpcy55KSB7XHJcblx0XHRcdFx0XHRpZiAoaG9zdGlsZSkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdsZWZ0JztcclxuXHRcdFx0XHRcdFx0aWYgKCF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ2xlZnQnKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSgnbGVmdCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICh0YXJnZXQueCA+IHRoaXMueCkge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICsgdGhpcy5yYW5nZSAmJiB0YXJnZXQueSA9PT0gdGhpcy55KSB7XHJcblx0XHRcdFx0XHRpZiAoaG9zdGlsZSkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdyaWdodCc7XHJcblx0XHRcdFx0XHRcdGlmICghdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCdyaWdodCcpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCdyaWdodCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICh0YXJnZXQueSA8IHRoaXMueSkge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICYmIHRhcmdldC55ID09PSB0aGlzLnkgLSB0aGlzLnJhbmdlKSB7XHJcblx0XHRcdFx0XHRpZiAoaG9zdGlsZSkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICd1cCc7XHJcblx0XHRcdFx0XHRcdGlmICghdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCd1cCcpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCd1cCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICh0YXJnZXQueSA+IHRoaXMueSkge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICYmIHRhcmdldC55ID09PSB0aGlzLnkgKyB0aGlzLnJhbmdlKSB7XHJcblx0XHRcdFx0XHRpZiAoaG9zdGlsZSkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdkb3duJztcclxuXHRcdFx0XHRcdFx0aWYgKCF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ2Rvd24nKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSgnZG93bicpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGlmICh0YXJnZXQueSA+IHRoaXMueSkge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICYmIHRhcmdldC55ID09PSB0aGlzLnkgKyB0aGlzLnJhbmdlKSB7XHJcblx0XHRcdFx0XHRpZiAoaG9zdGlsZSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmF0dGFjaygnZG93bicpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCdkb3duJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHRhcmdldC55IDwgdGhpcy55KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggJiYgdGFyZ2V0LnkgPT09IHRoaXMueSAtIHRoaXMucmFuZ2UpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlKSB7XHJcblx0XHRcdFx0XHRcdGlmICghdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCd1cCcpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCd1cCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICh0YXJnZXQueCA+IHRoaXMueCkge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICsgdGhpcy5yYW5nZSAmJiB0YXJnZXQueSA9PT0gdGhpcy55KSB7XHJcblx0XHRcdFx0XHRpZiAoaG9zdGlsZSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmF0dGFjaygncmlnaHQnKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSgncmlnaHQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodGFyZ2V0LnggPCB0aGlzLngpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LnggPj0gKHRoaXMueCAtIHRoaXMucmFuZ2UpICYmIHRhcmdldC55ID09PSB0aGlzLnkpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlKSB7XHJcblx0XHRcdFx0XHRcdGlmICghdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCdsZWZ0Jyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ2xlZnQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0Ly8gQ29tYmF0XHJcblx0Y2hlY2tJblJhbmdlKGRpcmVjdGlvbiwgdGFyZ2V0LCByYW5nZSkge1xyXG5cdFx0aWYgKHRhcmdldC5tYXBJZCAhPT0gdGhpcy5tYXBJZCkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggJiYgdGFyZ2V0LnkgPT09IHRoaXMueSkgcmV0dXJuIGZhbHNlO1x0Ly8gU3RhY2tlZCBkb2VzIG5vdCBjb3VudCBhcyBpbiByYW5nZVxyXG5cdFx0XHJcblx0XHRpZiAodGFyZ2V0LnkgPT09IHRoaXMueSkge1xyXG5cdFx0XHRpZiAoZGlyZWN0aW9uID09PSAnbGVmdCcpIHtcclxuXHRcdFx0XHRpZiAodGhpcy54ID09PSAwKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0cmV0dXJuICh0YXJnZXQueCA8IHRoaXMueCAmJiB0YXJnZXQueCA+PSAodGhpcy54IC0gcmFuZ2UpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAoZGlyZWN0aW9uID09PSAncmlnaHQnKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMueCA9PT0gY29uZmlnLk1BUF9DT0xVTU5TIC0gMSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHJldHVybiAodGFyZ2V0LnggPiB0aGlzLnggJiYgdGFyZ2V0LnggPD0gKHRoaXMueCArIHJhbmdlKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmICh0YXJnZXQueCA9PT0gdGhpcy54KSB7XHJcblx0XHRcdGlmIChkaXJlY3Rpb24gPT09ICd1cCcpIHtcclxuXHRcdFx0XHRpZiAodGhpcy55ID09PSAwKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0cmV0dXJuICh0YXJnZXQueSA8IHRoaXMueSAmJiB0YXJnZXQueSA+PSAodGhpcy55IC0gcmFuZ2UpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAoZGlyZWN0aW9uID09PSAnZG93bicpIHtcclxuXHRcdFx0XHRpZiAodGhpcy55ID09PSBjb25maWcuTUFQX1JPV1MgLSAxKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0cmV0dXJuICh0YXJnZXQueSA+IHRoaXMueSAmJiB0YXJnZXQueSA8PSAodGhpcy55ICsgcmFuZ2UpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0YXR0YWNrKG51bVRhcmdldHMgPSAxLCBkaXJlY3Rpb24gPSB0aGlzLmRpcmVjdGlvbikge1xyXG5cdFx0aWYgKHRoaXMuaXNBdHRhY2tpbmcgfHwgdGhpcy5hdHRhY2tUaW1lciA+IDApIHJldHVybjtcclxuXHJcblx0XHR0aGlzLmlzQXR0YWNraW5nID0gdHJ1ZTtcclxuXHRcdFxyXG5cdFx0bGV0IGFjdG9yTGlzdCA9IGdhbWUucGxheWVyTGlzdC5jb25jYXQoZ2FtZS5tYXBMaXN0W3RoaXMubWFwSWRdLmJvdHMpO1xyXG5cdFx0bGV0IHRhcmdldExpc3QgPSBhY3Rvckxpc3QuZmlsdGVyKChhY3RvcikgPT4ge1xyXG5cdFx0XHRpZiAoYWN0b3IgPT09IHRoaXMgfHwgYWN0b3IuaXNEZWFkKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdGlmICh0aGlzLmNoZWNrSW5SYW5nZShkaXJlY3Rpb24sIGFjdG9yLCB0aGlzLnJhbmdlKSkgcmV0dXJuIHRydWU7XHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdFx0dGFyZ2V0TGlzdC5zb3J0KChhLCBiKSA9PiB7XHJcblx0XHRcdHJldHVybiAoYS56IC0gYi56KTtcdC8vIExvd2VzdCB0byBoaWdoZXN0XHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdFx0dGFyZ2V0TGlzdCA9IHRhcmdldExpc3Quc3BsaWNlKC1udW1UYXJnZXRzKTtcclxuXHRcdFxyXG5cdFx0dGFyZ2V0TGlzdC5mb3JFYWNoKCh0YXJnZXQpID0+IHtcclxuXHRcdFx0dGFyZ2V0LnRha2VEYW1hZ2UodGhpcy5kYW1hZ2UsIHRoaXMpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdFxyXG5cdHRha2VEYW1hZ2UoZGFtYWdlLCBzb3VyY2UpIHtcclxuXHRcdGNvbnNvbGUubG9nKGAke3RoaXMuaGVhbHRofS8ke3RoaXMuaGVhbHRoTWF4fWApO1xyXG5cdFx0ZGFtYWdlIC09IHRoaXMuZGVmZW5jZTtcclxuXHRcdGlmIChkYW1hZ2UgPCAwKSB7XHJcblx0XHRcdGRhbWFnZSA9IDA7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0dGhpcy5oZWFsdGggLT0gZGFtYWdlO1xyXG5cdFx0XHRpZiAodGhpcy5oZWFsdGggPD0gMCkge1xyXG5cdFx0XHRcdHRoaXMuc2V0RGVhZChzb3VyY2UuY29udHJvbGxlciwgc291cmNlLm5hbWUpO1xyXG5cdFx0XHRcdHNvdXJjZS5raWxscysrO1xyXG5cdFx0XHRcdGlmIChzb3VyY2UudGFyZ2V0ID09PSB0aGlzKSBzb3VyY2UudGFyZ2V0ID0gbnVsbDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Z2FtZS5zcGF3bkRhbWFnZVRleHQodGhpcy5tYXBJZCwgdGhpcy54LCB0aGlzLnksIGRhbWFnZSk7XHJcblx0fVx0XHJcblxyXG5cdHNldERlYWQoKSB7XHJcblx0XHRsZXQgbWFwID0gZ2FtZS5tYXBMaXN0W3RoaXMubWFwSWRdO1xyXG5cclxuXHRcdC8vIEludmVudG9yeSBJdGVtIERyb3AgQ2hhbmNlXHJcblx0XHRsZXQgZHJvcENoYW5jZSA9IHV0aWwuY2xhbXAobWFwLmRyb3BDaGFuY2UsIDAsIDEwMCk7XHJcblx0XHRpZiAoZHJvcENoYW5jZSA+IDApIHtcclxuXHRcdFx0bGV0IGl0ZW1zID0gdGhpcy5pbnZlbnRvcnkuZmlsdGVyKChpdGVtKSA9PiB7XHJcblx0XHRcdFx0aWYgKCFpdGVtKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0aWYgKGl0ZW0uc2xvdCA8IGNvbmZpZy5JTlZFTlRPUllfU0laRSkgcmV0dXJuIHRydWU7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcclxuXHRcdFx0XHRpZiAoIWl0ZW0pIHJldHVybjtcclxuXHRcdFx0XHRpZiAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAxKSA8PSBkcm9wQ2hhbmNlKSB7XHJcblx0XHRcdFx0XHR0aGlzLmRyb3BJdGVtKGl0ZW0uc2xvdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBFcXVpcHBlZCBJdGVtIERyb3AgQW1vdW50XHJcblx0XHRsZXQgZHJvcEFtb3VudEVRID0gdXRpbC5jbGFtcChtYXAuZHJvcEFtb3VudEVRLCAwLCBjb25maWcuRVFVSVBNRU5UX1NJWkUpO1xyXG5cdFx0aWYgKGRyb3BBbW91bnRFUSA+IDApIHtcclxuXHRcdFx0bGV0IGVxdWlwbWVudCA9IHRoaXMuaW52ZW50b3J5LmZpbHRlcigoaXRlbSkgPT4ge1xyXG5cdFx0XHRcdGlmIChpdGVtICYmIGl0ZW0uc2xvdCA+PSBjb25maWcuSU5WRU5UT1JZX1NJWkUpIHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRlcXVpcG1lbnQgPSB1dGlsLnNodWZmbGUoZXF1aXBtZW50KTtcclxuXHRcdFx0ZXF1aXBtZW50LnNwbGljZSgtZHJvcEFtb3VudEVRKTtcclxuXHRcdFx0ZXF1aXBtZW50LmZvckVhY2goKGl0ZW0pID0+IHtcclxuXHRcdFx0XHR0aGlzLmRyb3BJdGVtKGVxdWlwbWVudC5zbG90KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdC8vIEludmVudG9yeVxyXG5cdHBpY2tVcCgpIHtcclxuXHRcdC8vIFNlZSBQbGF5ZXIgYW5kIEJvdCBjbGFzc2VzXHJcblx0fVxyXG5cdFxyXG5cdGdldE1hcEl0ZW0obWFwSWQsIGlkKSB7XHJcblx0XHRsZXQgaXRlbSA9IGdhbWUubWFwTGlzdFttYXBJZF0uaXRlbXNbaWRdO1xyXG5cdFx0aWYgKCFpdGVtKSByZXR1cm4gbnVsbDtcclxuXHJcblx0XHRpZiAoaXRlbS5zdGFjayA+IDApIHtcclxuXHRcdFx0bGV0IHNsb3QgPSB0aGlzLmZpbmRJdGVtU2xvdChpdGVtLml0ZW1DbGFzcyk7XHJcblx0XHRcdGlmIChzbG90ID49IDApIHtcclxuXHRcdFx0XHR0aGlzLmludmVudG9yeVtzbG90XS5zdGFjayArPSBpdGVtLnN0YWNrO1xyXG5cdFx0XHRcdGl0ZW0ucmVtb3ZlKCk7XHJcblx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRsZXQgc2xvdCA9IHRoaXMuZmluZEZpcnN0RW1wdHlTbG90KCk7XHJcblx0XHRyZXR1cm4gc2xvdDtcclxuXHR9XHJcblxyXG5cdGdldEl0ZW0oZGF0YSkge1xyXG5cdFx0aWYgKCFkYXRhIHx8IGRhdGEuaXRlbUNsYXNzID09IG51bGwpIHJldHVybiBudWxsO1xyXG5cclxuXHRcdGlmIChkYXRhLnN0YWNrKSB7XHJcblx0XHRcdHNsb3QgPSB0aGlzLmZpbmRJdGVtU2xvdChkYXRhLml0ZW1DbGFzcyk7XHJcblx0XHRcdGlmIChzbG90ID49IDApIHtcclxuXHRcdFx0XHR0aGlzLmludmVudG9yeVtzbG90XS5zdGFjayArPSBkYXRhLnN0YWNrO1xyXG5cdFx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuZmluZEZpcnN0RW1wdHlTbG90KCk7XHJcblx0fVxyXG5cdFxyXG5cdGRyb3BJdGVtKHNsb3QpIHtcclxuXHRcdGxldCBpdGVtID0gdGhpcy5pbnZlbnRvcnlbc2xvdF07XHJcblx0XHRpZiAoIWl0ZW0pIHJldHVybjtcclxuXHRcdFxyXG5cdFx0aWYgKHNsb3QgPj0gY29uZmlnLklOVkVOVE9SWV9TSVpFKSB7XHJcblx0XHRcdHRoaXMudW5lcXVpcEl0ZW0oc2xvdCk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpdGVtLm1vdmVUb01hcCh0aGlzLm1hcElkLCB0aGlzLngsIHRoaXMueSk7XHJcblx0fVxyXG5cdFxyXG5cdHVzZUl0ZW0oc2xvdCkge1xyXG5cdFx0bGV0IGl0ZW0gPSB0aGlzLmludmVudG9yeVtzbG90XTtcclxuXHRcdGlmICghaXRlbSkgcmV0dXJuO1xyXG5cclxuXHRcdC8vIGlmICghZGIuaXRlbXNbaXRlbS5pZF0udXNlLmNhbGwodGhpcywgc2xvdCkpIHJldHVybjtcdC8vIFJ1biAndXNlJyBzY3JpcHRcclxuXHJcblx0XHRpZiAoaXRlbS5pc0VxdWlwbWVudCgpKSB7XHQvLyBFcXVpcG1lbnQgSXRlbXNcclxuXHRcdFx0aWYgKHNsb3QgPCBjb25maWcuSU5WRU5UT1JZX1NJWkUpIHtcdC8vIENoZWNrIGlmIGl0ZW0gaXMgZXF1aXBwZWRcclxuXHRcdFx0XHR0aGlzLmVxdWlwSXRlbShzbG90KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHR0aGlzLnVuZXF1aXBJdGVtKHNsb3QpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoaXRlbS5yZXVzYWJsZSkgcmV0dXJuO1xyXG5cdFx0XHJcblx0XHRpZiAoaXRlbS5zdGFjayA+IDEpIHtcclxuXHRcdFx0aXRlbS5zdGFjay0tO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aXRlbS5yZW1vdmUoKTtcclxuXHR9XHJcblx0XHJcblx0aGFzSXRlbShpdGVtQ2xhc3MpIHtcclxuXHRcdGxldCBjb3VudCA9IDA7XHJcblx0XHRmb3IgKGxldCBzbG90ID0gMDsgc2xvdCA8IGNvbmZpZy5JTlZFTlRPUllfU0laRSArIGNvbmZpZy5FUVVJUE1FTlRfU0laRTsgc2xvdCsrKSB7XHJcblx0XHRcdGlmICh0aGlzLmludmVudG9yeVtzbG90XSkge1xyXG5cdFx0XHRcdGlmICh0aGlzLmludmVudG9yeVtzbG90XS5pdGVtQ2xhc3MgPT09IGl0ZW1DbGFzcykge1xyXG5cdFx0XHRcdFx0Y291bnQrKztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBjb3VudDtcclxuXHR9XHJcblxyXG5cdGZpbmRJdGVtU2xvdChpdGVtQ2xhc3MpIHtcclxuXHRcdGxldCBzbG90ID0gbnVsbDtcclxuXHRcdGZvciAobGV0IGNoZWNrU2xvdCA9IDA7IGNoZWNrU2xvdCA8IGNvbmZpZy5JTlZFTlRPUllfU0laRSArIGNvbmZpZy5FUVVJUE1FTlRfU0laRTsgY2hlY2tTbG90KyspIHtcclxuXHRcdFx0aWYgKHRoaXMuaW52ZW50b3J5W2NoZWNrU2xvdF0pIHtcclxuXHRcdFx0XHRpZiAodGhpcy5pbnZlbnRvcnlbY2hlY2tTbG90XS5pdGVtQ2xhc3MgPT09IGl0ZW1DbGFzcykge1xyXG5cdFx0XHRcdFx0c2xvdCA9IGNoZWNrU2xvdDtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHNsb3Q7XHJcblx0fVxyXG5cdFxyXG5cdG1vdmVJdGVtVG9TbG90KHNsb3QsIG5ld1Nsb3QpIHtcclxuXHRcdGlmIChzbG90ID09IG51bGwgfHwgbmV3U2xvdCA9PSBudWxsIHx8IHNsb3QgPT09IG5ld1Nsb3QpIHJldHVybjtcdC8vIG51bGwgPT0gdW5kZWZpbmVkLCBudWxsICE9IDBcclxuXHRcdGlmIChzbG90ID49IGNvbmZpZy5JTlZFTlRPUllfU0laRSArIGNvbmZpZy5FUVVJUE1FTlRfU0laRSkgcmV0dXJuO1xyXG5cdFx0aWYgKG5ld1Nsb3QgPj0gY29uZmlnLklOVkVOVE9SWV9TSVpFICsgY29uZmlnLkVRVUlQTUVOVF9TSVpFKSByZXR1cm47XHJcblxyXG5cdFx0bGV0IGl0ZW0gPSB0aGlzLmludmVudG9yeVtzbG90XTtcclxuXHRcdGxldCBuZXdJdGVtID0gdGhpcy5pbnZlbnRvcnlbbmV3U2xvdF07XHJcblx0XHRpZiAoIWl0ZW0pIHJldHVybjtcclxuXHJcblx0XHQvLyBUYXJnZXQgc2xvdCBpcyBmb3IgZXF1aXBtZW50IC0gY2hlY2sgdHlwZSBtYXRjaGVzXHJcblx0XHRpZiAobmV3U2xvdCA+PSBjb25maWcuSU5WRU5UT1JZX1NJWkUpIHtcclxuXHRcdFx0aWYgKCFpdGVtLmNhbkVxdWlwKG5ld1Nsb3QpKSB7XHJcblx0XHRcdFx0Z2FtZS5zZW5kR2FtZUluZm9QbGF5ZXIodGhpcy5pZCwgXCJUaGF0IGNhbm5vdCBiZSBlcXVpcHBlZCB0aGVyZS5cIik7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3Qgc3dhcFNsb3RzID0gKCkgPT4ge1xyXG5cdFx0XHRpdGVtLnNsb3QgPSBuZXdTbG90O1xyXG5cdFx0XHRpZiAobmV3SXRlbSkgbmV3SXRlbS5zbG90ID0gc2xvdDtcclxuXHRcdFx0dXRpbC5zd2FwKHRoaXMuaW52ZW50b3J5LCBzbG90LCBuZXdTbG90KTtcclxuXHRcdFx0dGhpcy5jYWxjQm9udXNTdGF0cygpO1xyXG5cdFx0fTtcclxuXHJcblx0XHQvLyBJRiBObyBuZXcgaXRlbSBpbiBuZXcgc2xvdFxyXG5cdFx0Ly8gT1IgTmV3IGl0ZW0gaW4gbmV3IHNsb3QsIG9sZCBpdGVtIGluIGludmVudG9yeVxyXG5cdFx0Ly8gT1IgTmV3IGl0ZW0gaW4gbmV3IHNsb3QsIG9sZCBpdGVtIGlzIGVxdWlwcGVkLCBuZXcgaXRlbSBjYW4gYmUgZXF1aXBwZWQgaW4gb2xkIHNsb3RcclxuXHRcdGlmICghbmV3SXRlbSB8fCBzbG90IDwgY29uZmlnLklOVkVOVE9SWV9TSVpFIHx8IG5ld0l0ZW0uY2FuRXF1aXAoc2xvdCkpIHtcclxuXHRcdFx0c3dhcFNsb3RzKCk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Ly8gT2xkIGl0ZW0gaXMgZXF1aXBwZWQsIG5ldyBpdGVtIGNhbm5vdCBiZSBlcXVpcHBlZCBpbiBvbGQgc2xvdFxyXG5cdFx0XHRuZXdTbG90ID0gdGhpcy5maW5kRmlyc3RFbXB0eVNsb3QoKTtcclxuXHRcdFx0aWYgKG5ld1Nsb3QgIT0gbnVsbCkge1xyXG5cdFx0XHRcdHN3YXBTbG90cygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdGdhbWUuc2VuZEdhbWVJbmZvUGxheWVyKHRoaXMuaWQsIFwiWW91ciBpbnZlbnRvcnkgaXMgZnVsbC5cIik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGVxdWlwSXRlbShzbG90KSB7XHJcblx0XHRsZXQgbmV3U2xvdCA9IG51bGw7XHJcblx0XHRmb3IgKGxldCBpID0gY29uZmlnLklOVkVOVE9SWV9TSVpFOyBpIDwgY29uZmlnLklOVkVOVE9SWV9TSVpFICsgY29uZmlnLkVRVUlQTUVOVF9TSVpFOyBpKyspIHtcclxuXHRcdFx0aWYgKHRoaXMuaW52ZW50b3J5W3Nsb3RdLmNhbkVxdWlwKGkpKSB7XHJcblx0XHRcdFx0bmV3U2xvdCA9IGk7XHJcblx0XHRcdFx0aWYgKCF0aGlzLmludmVudG9yeVtpXSkgYnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmIChuZXdTbG90ID09PSBudWxsKSByZXR1cm47XHJcblxyXG5cdFx0dGhpcy5tb3ZlSXRlbVRvU2xvdChzbG90LCBuZXdTbG90KTtcclxuXHR9XHJcblxyXG5cdHVuZXF1aXBJdGVtKHNsb3QpIHtcclxuXHRcdGlmIChzbG90IDwgY29uZmlnLklOVkVOVE9SWV9TSVpFKSByZXR1cm47XHJcblx0XHRpZiAoIXRoaXMuaW52ZW50b3J5W3Nsb3RdKSByZXR1cm47XHJcblx0XHRcclxuXHRcdGxldCBuZXdTbG90ID0gdGhpcy5maW5kRmlyc3RFbXB0eVNsb3QoKTtcclxuXHRcdGlmIChuZXdTbG90ID09IG51bGwpIHtcclxuXHRcdFx0Z2FtZS5zZW5kR2FtZUluZm9QbGF5ZXIodGhpcy5pZCwgXCJZb3VyIGludmVudG9yeSBpcyBmdWxsLlwiKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMubW92ZUl0ZW1Ub1Nsb3Qoc2xvdCwgbmV3U2xvdCk7XHJcblx0fVxyXG5cdFxyXG5cdGZpbmRGaXJzdEVtcHR5U2xvdCgpIHtcclxuXHRcdGZvciAobGV0IHNsb3QgPSAwOyBzbG90IDwgY29uZmlnLklOVkVOVE9SWV9TSVpFOyBzbG90KyspIHtcclxuXHRcdFx0aWYgKHRoaXMuaW52ZW50b3J5W3Nsb3RdID09IG51bGwpIHJldHVybiBzbG90O1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fVxyXG5cclxuXHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHQvLyBJbnZlbnRvcnkgSXRlbSBVcGRhdGVcclxuXHRcdHRoaXMuaW52ZW50b3J5LmZvckVhY2goKGl0ZW0pID0+IHtcclxuXHRcdFx0aWYgKGl0ZW0pIGl0ZW0udXBkYXRlKCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRpZiAodGhpcy5pc0RlYWQpIHJldHVybjtcclxuXHRcdFxyXG5cdFx0Ly8gQXR0YWNraW5nXHJcblx0XHRpZiAodGhpcy5pc0F0dGFja2luZyB8fCB0aGlzLmF0dGFja1RpbWVyID4gMCkge1xyXG5cdFx0XHR0aGlzLmF0dGFja1RpbWVyICs9IGRlbHRhO1xyXG5cdFx0XHRpZiAodGhpcy5hdHRhY2tUaW1lciA+PSAwLjMpIHRoaXMuaXNBdHRhY2tpbmcgPSBmYWxzZTtcclxuXHRcdFx0aWYgKHRoaXMuYXR0YWNrVGltZXIgPj0gdGhpcy5hdHRhY2tTcGVlZCkgdGhpcy5hdHRhY2tUaW1lciA9IDA7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vIE1vdmVtZW50XHJcblx0XHRpZiAodGhpcy5pc01vdmluZykge1xyXG5cdFx0XHR0aGlzLmxlcnAgKz0gZGVsdGEgKiB0aGlzLm1vdmVTcGVlZDtcclxuXHRcdFx0XHJcblx0XHRcdGlmICh0aGlzLmxlcnAgPj0gMC40OSkge1xyXG5cdFx0XHRcdHRoaXMueCA9IHRoaXMuZGVzdGluYXRpb25YO1xyXG5cdFx0XHRcdHRoaXMueSA9IHRoaXMuZGVzdGluYXRpb25ZO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAodGhpcy5sZXJwID49IDAuOTkpIHtcclxuXHRcdFx0XHR0aGlzLnN0YXJ0WCA9IHRoaXMuZGVzdGluYXRpb25YO1xyXG5cdFx0XHRcdHRoaXMuc3RhcnRZID0gdGhpcy5kZXN0aW5hdGlvblk7XHJcblx0XHRcdFx0dGhpcy5sZXJwID0gMDtcclxuXHRcdFx0XHR0aGlzLmlzTW92aW5nID0gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGdldEludmVudG9yeVBhY2soKSB7XHJcblx0XHRsZXQgaW52ZW50b3J5UGFjayA9IFtdO1xyXG5cdFx0XHJcblx0XHR0aGlzLmludmVudG9yeS5mb3JFYWNoKChpdGVtKSA9PiB7XHJcblx0XHRcdGlmICghaXRlbSkgcmV0dXJuO1xyXG5cdFx0XHRpbnZlbnRvcnlQYWNrW2l0ZW0uc2xvdF0gPSBpdGVtLmdldFBhY2soKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBpbnZlbnRvcnlQYWNrO1xyXG5cdH1cclxufVxyXG4iLCJpbXBvcnQgZGIgZnJvbSAnLi4vZGIuanMnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuLi9nYW1lLmpzJztcclxuaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9jb25maWcuanMnO1xyXG5pbXBvcnQgdXRpbCBmcm9tICcuLi91dGlsLmpzJztcclxuaW1wb3J0IEFjdG9yIGZyb20gJy4vYWN0b3IuanMnO1xyXG5cclxuLy8gQSBCb3QgaXMgYW4gQWN0b3Igd2l0aCBjb25kaXRpb25hbCBpbnB1dHNcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJvdCBleHRlbmRzIEFjdG9yIHtcclxuXHRjb25zdHJ1Y3RvcihkYXRhKSB7XHJcblx0XHRpZiAoZGF0YS5tYXBJZCA9PSBudWxsIHx8IGRhdGEueCA9PSBudWxsIHx8IGRhdGEueSA9PSBudWxsIHx8IGRhdGEuYm90Q2xhc3MgPT0gbnVsbCkge1xyXG5cdFx0XHRkYi5sb2coXCJCb3QgcmVxdWlyZXMgcGFyYW1ldGVyczogbWFwSWQsIHgsIHksIGJvdENsYXNzXCIpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGNsYXNzRGF0YSA9IGRiLmdldEJvdERhdGEoZGF0YS5ib3RDbGFzcyk7XHJcblx0XHRpZiAoIWRhdGEubmFtZSkgZGF0YS5uYW1lID0gY2xhc3NEYXRhLm5hbWU7XHJcblx0XHRpZiAoZGF0YS5zcHJpdGUgPT0gbnVsbCkgZGF0YS5zcHJpdGUgPSBjbGFzc0RhdGEuc3ByaXRlO1xyXG5cdFx0aWYgKGRhdGEuaG9zdGlsZSA9PSBudWxsKSBkYXRhLmhvc3RpbGUgPSBjbGFzc0RhdGEuaG9zdGlsZTtcclxuXHRcdFxyXG5cdFx0c3VwZXIoZGF0YS5tYXBJZCwgZGF0YS54LCBkYXRhLnksIGRhdGEubmFtZSwgZGF0YS5zcHJpdGUpO1xyXG5cdFx0dGhpcy5jb250cm9sbGVyID0gJ2JvdCc7XHJcblx0XHRpZiAoZGF0YS5pZCA9PSBudWxsKSBkYXRhLmlkID0gdXRpbC5maXJzdEVtcHR5SW5kZXgoZ2FtZS5tYXBMaXN0W3RoaXMubWFwSWRdLmJvdHMpO1xyXG5cdFx0dGhpcy5pZCA9IGRhdGEuaWQ7XHJcblx0XHR0aGlzLmJvdENsYXNzID0gZGF0YS5ib3RDbGFzcztcclxuXHRcdHRoaXMuaG9zdGlsZSA9IGRhdGEuaG9zdGlsZTtcclxuXHRcdHRoaXMuY2FsY0Jhc2VTdGF0cygpO1xyXG5cdFx0dGhpcy5yZXN0b3JlKCk7XHJcblxyXG5cdFx0dGhpcy50YXJnZXQgPSBudWxsO1xyXG5cdFx0dGhpcy5zZXRUYXNrKCd3YW5kZXJpbmcnKTtcclxuXHRcdHRoaXMubW92ZVRpbWVyID0gMDtcclxuXHJcblx0XHRnYW1lLm1hcExpc3RbdGhpcy5tYXBJZF0uYm90c1t0aGlzLmlkXSA9IHRoaXM7XHJcblx0fVxyXG5cdFxyXG5cdGdldE1hcEl0ZW0obWFwSWQsIGlkKSB7XHJcblx0XHRsZXQgc2xvdCA9IHN1cGVyLmdldE1hcEl0ZW0obWFwSWQsIGlkKTtcclxuXHRcdGlmIChzbG90ID09IG51bGwpIHJldHVybjtcclxuXHRcdFxyXG5cdFx0bGV0IGl0ZW0gPSBnYW1lLm1hcExpc3RbbWFwSWRdLml0ZW1zW2lkXTtcclxuXHRcdGl0ZW0ubW92ZVRvQm90KHRoaXMubWFwSWQsIHRoaXMuaWQsIHNsb3QpO1xyXG5cdH1cclxuXHJcblx0Z2V0SXRlbShkYXRhKSB7XHJcblx0XHRsZXQgc2xvdCA9IHN1cGVyLmdldEl0ZW0oZGF0YSk7XHJcblx0XHRpZiAoc2xvdCA9PSBudWxsKSByZXR1cm47XHJcblxyXG5cdFx0ZGF0YS5vd25lciA9ICdib3QnO1xyXG5cdFx0ZGF0YS5tYXBJZCA9IHRoaXMubWFwSWQ7XHJcblx0XHRkYXRhLmlkID0gdGhpcy5pZDtcclxuXHRcdGRhdGEuc2xvdCA9IHNsb3Q7XHJcblx0XHRuZXcgSXRlbShkYXRhKTtcclxuXHR9XHJcblxyXG5cdHVwZGF0ZShkZWx0YSkge1xyXG5cdFx0c3VwZXIudXBkYXRlKGRlbHRhKTsgXHQvLyBEZWZhdWx0IEFjdG9yIFVwZGF0ZVxyXG5cdFx0aWYgKHRoaXMuaXNEZWFkKSByZXR1cm47XHJcblxyXG5cdFx0dGhpcy5tb3ZlVGltZXIrKztcclxuXHRcdFxyXG5cdFx0Ly8gQUkgSW5wdXRzXHJcblx0XHRzd2l0Y2godGhpcy50YXNrKSB7XHJcblx0XHRcdGNhc2UgJ3dhbmRlcmluZyc6XHRcdC8vIE1vdmUgcmFuZG9tbHlcclxuXHRcdFx0XHR0aGlzLm1vdmUoKTtcclxuXHRcdFx0XHR0aGlzLnBpY2tVcCgpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnZm9sbG93aW5nJzpcdFx0Ly8gTW92ZSB0b3dhcmRzIHRhcmdldFxyXG5cdFx0XHRcdGlmICh0aGlzLnRhcmdldCkge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlVG9UYXJnZXQodGhpcy50YXJnZXQsIGZhbHNlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHQvLyBObyB0YXJnZXRcclxuXHRcdFx0XHRcdHRoaXMuc2V0VGFzaygnd2FuZGVyaW5nJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnYXR0YWNraW5nJzpcdFx0Ly8gTW92ZSB0b3dhcmRzIHRhcmdldCBhbmQgYXR0YWNrXHJcblx0XHRcdFx0aWYgKHRoaXMudGFyZ2V0KSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmVUb1RhcmdldCh0aGlzLnRhcmdldCwgdHJ1ZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly8gTm8gdGFyZ2V0XHJcblx0XHRcdFx0XHR0aGlzLnNldFRhc2soJ3dhbmRlcmluZycpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdC8vIGNhc2UgJ2lkbGUnOlxyXG5cdFx0XHRkZWZhdWx0OiBcdFx0XHRcdFx0Ly8gU3RhbmQgc3RpbGxcclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiB0aGlzLmdldFBhY2soKTtcclxuXHR9XHJcblx0XHJcblx0Z2V0UGFjaygpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGlkOiB0aGlzLmlkLFxyXG5cdFx0XHRuYW1lOiB0aGlzLm5hbWUsXHJcblx0XHRcdHNwcml0ZTogdGhpcy5zcHJpdGUsXHJcblx0XHRcdGRpcmVjdGlvbjogdGhpcy5kaXJlY3Rpb24sXHJcblx0XHRcdG1hcElkOiB0aGlzLm1hcElkLFxyXG5cdFx0XHR4OiB0aGlzLnN0YXJ0WCxcclxuXHRcdFx0eTogdGhpcy5zdGFydFksXHJcblx0XHRcdHo6IHRoaXMueixcclxuXHRcdFx0ZGVzdGluYXRpb25YOiB0aGlzLmRlc3RpbmF0aW9uWCxcclxuXHRcdFx0ZGVzdGluYXRpb25ZOiB0aGlzLmRlc3RpbmF0aW9uWSxcclxuXHRcdFx0bGVycDogdGhpcy5sZXJwLFxyXG5cdFx0XHRpc1J1bm5pbmc6IHRoaXMuaXNSdW5uaW5nLFxyXG5cdFx0XHRpc0F0dGFja2luZzogdGhpcy5pc0F0dGFja2luZyxcclxuXHRcdFx0aXNEZWFkOiBmYWxzZSxcclxuXHRcdFx0aXNWaXNpYmxlOiB0aGlzLmlzVmlzaWJsZVxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdHJlbW92ZSgpIHtcclxuXHRcdGRlbGV0ZSBnYW1lLm1hcExpc3RbdGhpcy5tYXBJZF0uYm90c1t0aGlzLmlkXTtcclxuXHR9XHJcblx0XHJcblx0bW92ZShkaXJlY3Rpb24pIHtcclxuXHRcdGxldCBtb3ZlVGltZSA9IDI0O1xyXG5cdFx0aWYgKHRoaXMuaXNSdW5uaW5nKSB7XHJcblx0XHRcdG1vdmVUaW1lID0gMTc7XHJcblx0XHR9XHJcblx0XHRpZiAodGhpcy5tb3ZlVGltZXIgPiBtb3ZlVGltZSAmJiB0aGlzLmF0dGFja1RpbWVyID09PSAwKSB7XHJcblx0XHRcdHN1cGVyLm1vdmUoZGlyZWN0aW9uKTtcclxuXHRcdFx0dGhpcy5tb3ZlVGltZXIgPSAwO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHR0YWtlRGFtYWdlKGRhbWFnZSwgc291cmNlKSB7XHJcblx0XHRpZiAoc291cmNlIGluc3RhbmNlb2YgQWN0b3IpIHRoaXMuc2V0VGFzaygnYXR0YWNraW5nJywgc291cmNlKTtcclxuXHRcdHN1cGVyLnRha2VEYW1hZ2UoZGFtYWdlLCBzb3VyY2UpO1xyXG5cdH1cclxuXHRcclxuXHRwaWNrVXAoKSB7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGdhbWUubWFwTGlzdFt0aGlzLm1hcElkXS5pdGVtcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRsZXQgaXRlbSA9IGdhbWUubWFwTGlzdFt0aGlzLm1hcElkXS5pdGVtc1tpXTtcclxuXHRcdFx0aWYgKGl0ZW0gJiYgaXRlbS54ID09PSB0aGlzLnggJiYgaXRlbS55ID09PSB0aGlzLnkpIHtcclxuXHRcdFx0XHRsZXQgc2xvdCA9IHRoaXMuZ2V0TWFwSXRlbShpdGVtLm1hcElkLCBpdGVtLmlkKTtcclxuXHRcdFx0XHRpZiAoc2xvdCAhPSBudWxsKSB7XHJcblx0XHRcdFx0XHRpdGVtLm1vdmVUb0JvdCh0aGlzLm1hcElkLCB0aGlzLmlkLCBzbG90KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHQvLyBJbnZlbnRvcnkgZnVsbFxyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHR0aGlzLmNoZWNrQmVzdEVxdWlwbWVudCgpO1xyXG5cdH1cclxuXHJcblx0c2V0RGVhZCgpIHtcclxuXHRcdHN1cGVyLnNldERlYWQoKTtcclxuXHRcdGRlbGV0ZSBnYW1lLm1hcERhdGFbdGhpcy5tYXBJZF0uYm90c1t0aGlzLmlkXTtcclxuXHR9XHJcblxyXG5cdGNhbGNCYXNlU3RhdHMoKSB7XHJcblx0XHRpZiAodGhpcy5ib3RDbGFzcyA9PSBudWxsKSByZXR1cm47XHJcblx0XHRcclxuXHRcdGxldCBjbGFzc0RhdGEgPSBkYi5nZXRCb3REYXRhKHRoaXMuYm90Q2xhc3MpO1xyXG5cdFx0dGhpcy5kYW1hZ2VCYXNlID0gY2xhc3NEYXRhLmRhbWFnZUJhc2U7XHJcblx0XHR0aGlzLmRlZmVuY2VCYXNlID0gY2xhc3NEYXRhLmRlZmVuY2VCYXNlO1xyXG5cdFx0dGhpcy5oZWFsdGhNYXhCYXNlID0gY2xhc3NEYXRhLmhlYWx0aE1heEJhc2U7XHJcblx0XHR0aGlzLmVuZXJneU1heEJhc2UgPSBjbGFzc0RhdGEuZW5lcmd5TWF4QmFzZTtcclxuXHRcdHRoaXMucmFuZ2VCYXNlID0gY2xhc3NEYXRhLnJhbmdlQmFzZTtcclxuXHR9XHJcblxyXG5cdC8vIElucHV0c1xyXG5cdHNldFRhc2sodGFzaywgdGFyZ2V0KSB7XHJcblx0XHRzd2l0Y2ggKHRhc2spIHtcclxuXHRcdFx0Y2FzZSAnd2FuZGVyaW5nJzpcclxuXHRcdFx0XHR0aGlzLmxhemluZXNzID0gNztcclxuXHRcdFx0XHR0aGlzLnRhcmdldCA9IG51bGw7XHJcblx0XHRcdFx0dGhpcy50YXNrID0gdGFzaztcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ2ZvbGxvd2luZyc6XHJcblx0XHRcdFx0aWYgKHRhcmdldCA9PT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0dGhpcy5zZXRUYXNrKCd3YW5kZXJpbmcnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLmxhemluZXNzID0gMDtcclxuXHRcdFx0XHRcdHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xyXG5cdFx0XHRcdFx0dGhpcy50YXNrID0gdGFzaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdhdHRhY2tpbmcnOlxyXG5cdFx0XHRcdGlmICh0YXJnZXQgPT09IG51bGwpIHtcclxuXHRcdFx0XHRcdHRoaXMuc2V0VGFzaygnd2FuZGVyaW5nJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5sYXppbmVzcyA9IDA7XHJcblx0XHRcdFx0XHR0aGlzLnRhcmdldCA9IHRhcmdldDtcclxuXHRcdFx0XHRcdHRoaXMudGFzayA9IHRhc2s7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0ZGVmYXVsdDpcdC8vaWRsaW5nXHJcblx0XHRcdFx0dGhpcy5sYXppbmVzcyA9IDc7XHJcblx0XHRcdFx0dGhpcy50YXJnZXQgPSBudWxsO1xyXG5cdFx0XHRcdHRoaXMudGFzayA9ICdpZGxlJztcclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGNoZWNrQmVzdEVxdWlwbWVudCgpIHtcclxuXHRcdGZvciAobGV0IHNsb3QgPSAwOyBzbG90IDwgY29uZmlnLklOVkVOVE9SWV9TSVpFOyBzbG90KyspIHtcclxuXHRcdFx0bGV0IGl0ZW0gPSB0aGlzLmludmVudG9yeVtzbG90XTtcclxuXHRcdFx0aWYgKCFpdGVtKSB7XHJcblx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdHN3aXRjaCAoaXRlbS50eXBlKSB7XHJcblx0XHRcdFx0Y2FzZSAnd2VhcG9uJzpcclxuXHRcdFx0XHRcdGlmICh0aGlzLmludmVudG9yeVtjb25maWcuSU5WRU5UT1JZX1NJWkVdKSB7XHJcblx0XHRcdFx0XHRcdGlmIChpdGVtLmRhbWFnZSA+IHRoaXMuaW52ZW50b3J5W2NvbmZpZy5JTlZFTlRPUllfU0laRV0uZGFtYWdlKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5lcXVpcEl0ZW0oc2xvdCk7XHJcblx0XHRcdFx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmVxdWlwSXRlbShzbG90KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdzaGllbGQnOlxyXG5cdFx0XHRcdFx0aWYgKHRoaXMuaW52ZW50b3J5W2NvbmZpZy5JTlZFTlRPUllfU0laRSArIDFdKSB7XHJcblx0XHRcdFx0XHRcdGlmIChpdGVtLmRlZmVuY2UgPiB0aGlzLmludmVudG9yeVtjb25maWcuSU5WRU5UT1JZX1NJWkUgKyAxXS5kZWZlbmNlKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5lcXVpcEl0ZW0oc2xvdCk7XHJcblx0XHRcdFx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmVxdWlwSXRlbShzbG90KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdhcm1vdXInOlxyXG5cdFx0XHRcdFx0aWYgKHRoaXMuaW52ZW50b3J5W2NvbmZpZy5JTlZFTlRPUllfU0laRSArIDJdKSB7XHJcblx0XHRcdFx0XHRcdGlmIChpdGVtLmRlZmVuY2UgPiB0aGlzLmludmVudG9yeVtjb25maWcuSU5WRU5UT1JZX1NJWkUgKyAyXS5kZWZlbmNlKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5lcXVpcEl0ZW0oc2xvdCk7XHJcblx0XHRcdFx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmVxdWlwSXRlbShzbG90KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdoZWxtZXQnOlxyXG5cdFx0XHRcdFx0aWYgKHRoaXMuaW52ZW50b3J5W2NvbmZpZy5JTlZFTlRPUllfU0laRSArIDNdKSB7XHJcblx0XHRcdFx0XHRcdGlmIChpdGVtLmRlZmVuY2UgPiB0aGlzLmludmVudG9yeVtjb25maWcuSU5WRU5UT1JZX1NJWkUgKyAzXS5kZWZlbmNlKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5lcXVpcEl0ZW0oc2xvdCk7XHJcblx0XHRcdFx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmVxdWlwSXRlbShzbG90KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdyaW5nJzpcclxuXHRcdFx0XHRcdGlmICh0aGlzLmludmVudG9yeVtjb25maWcuSU5WRU5UT1JZX1NJWkUgKyA0XSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoaXRlbS5kYW1hZ2UgPiB0aGlzLmludmVudG9yeVtjb25maWcuSU5WRU5UT1JZX1NJWkUgKyA0XS5kYW1hZ2UpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmVxdWlwSXRlbShzbG90KTtcclxuXHRcdFx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZXF1aXBJdGVtKHNsb3QpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbiIsImltcG9ydCBFbnRpdHkgZnJvbSAnLi9lbnRpdHkuanMnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuLi9nYW1lLmpzJztcclxuaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9jb25maWcuanMnO1xyXG5pbXBvcnQgdXRpbCBmcm9tICcuLi91dGlsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVmZmVjdCBleHRlbmRzIEVudGl0eSB7XHJcblx0Y29uc3RydWN0b3IobWFwSWQsIHgsIHksIHNwcml0ZSA9IDAsIGxvb3AgPSAwLCBzcGVlZCA9IDEyLCBtYXhGcmFtZSA9IDcsIHN0YXJ0RnJhbWUgPSAwKSB7XHJcblx0XHRzdXBlcihtYXBJZCwgeCwgeSwgdXRpbC5jbGFtcChzcHJpdGUsIDAsIGNvbmZpZy5NQVhfRUZGRUNUUyAtIDEpKTtcclxuXHRcdHRoaXMubWF4RnJhbWUgPSB1dGlsLmNsYW1wKG1heEZyYW1lLCAwLCA3KTtcclxuXHRcdHRoaXMuc3RhcnRGcmFtZSA9IHV0aWwuY2xhbXAoc3RhcnRGcmFtZSwgMCwgdGhpcy5tYXhGcmFtZSk7XHJcblx0XHR0aGlzLmN1cnJlbnRGcmFtZSA9IHRoaXMuc3RhcnRGcmFtZTtcclxuXHRcdFxyXG5cdFx0dGhpcy5sb29wID0gbG9vcDtcclxuXHRcdHRoaXMuc3BlZWQgPSBzcGVlZDtcclxuXHRcdHRoaXMudGltZXIgPSAwO1xyXG5cdFx0XHJcblx0XHR0aGlzLmlkID0gdXRpbC5maXJzdEVtcHR5SW5kZXgoZ2FtZS5tYXBMaXN0W3RoaXMubWFwSWRdLmVmZmVjdHMpO1xyXG5cdFx0Z2FtZS5tYXBMaXN0W3RoaXMubWFwSWRdLmVmZmVjdHNbdGhpcy5pZF0gPSB0aGlzO1xyXG5cdH1cclxuXHRcclxuXHR1cGRhdGUoZGVsdGEpIHtcclxuXHRcdHRoaXMudGltZXIgKz0gZGVsdGE7XHJcblx0XHRcclxuXHRcdGlmICh0aGlzLnRpbWVyID49IDEgLyB0aGlzLnNwZWVkKSB7XHJcblx0XHRcdHRoaXMudGltZXIgPSAwO1xyXG5cdFx0XHR0aGlzLmN1cnJlbnRGcmFtZSsrO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuY3VycmVudEZyYW1lID4gdGhpcy5tYXhGcmFtZSkge1xyXG5cdFx0XHRcdGlmICh0aGlzLmxvb3AgPCAwKSB7XHJcblx0XHRcdFx0XHR0aGlzLmN1cnJlbnRGcmFtZSA9IHRoaXMuc3RhcnRGcmFtZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBpZiAodGhpcy5sb29wID4gMCkge1xyXG5cdFx0XHRcdFx0dGhpcy5jdXJyZW50RnJhbWUgPSB0aGlzLnN0YXJ0RnJhbWU7XHJcblx0XHRcdFx0XHR0aGlzLmxvb3AtLTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLmN1cnJlbnRGcmFtZSA9IHRoaXMubWF4RnJhbWU7XHJcblx0XHRcdFx0XHR0aGlzLnJlbW92ZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0aGlzLmdldFBhY2soKTtcclxuXHR9XHJcblx0XHJcblx0Z2V0UGFjaygpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGlkOiB0aGlzLmlkLFxyXG5cdFx0XHRtYXBJZDogdGhpcy5tYXBJZCxcclxuXHRcdFx0eDogdGhpcy54LFxyXG5cdFx0XHR5OiB0aGlzLnksXHJcblx0XHRcdHNwcml0ZTogdGhpcy5zcHJpdGUsXHJcblx0XHRcdGN1cnJlbnRGcmFtZTogdGhpcy5jdXJyZW50RnJhbWVcclxuXHRcdH07XHJcblx0fVxyXG5cdFxyXG5cdHJlbW92ZSgpIHtcclxuXHRcdGRlbGV0ZSBnYW1lLm1hcExpc3RbdGhpcy5tYXBJZF0uZWZmZWN0c1t0aGlzLmlkXTtcclxuXHR9XHRcclxufSIsImltcG9ydCBjb25maWcgZnJvbSAnLi4vY29uZmlnLmpzJztcclxuXHJcbi8vIEFuIEVudGl0eSBpcyBhbnkgb2JqZWN0IHdoaWNoIGNhbiBhcHBlYXIgb24gdGhlIG1hcFxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW50aXR5IHtcclxuXHRjb25zdHJ1Y3RvcihtYXBJZCwgeCwgeSwgc3ByaXRlID0gMCkge1xyXG5cdFx0dGhpcy5tYXBJZCA9IG1hcElkO1xyXG5cdFx0dGhpcy54ID0geDtcclxuXHRcdHRoaXMueSA9IHk7XHJcblx0XHRpZiAoc3ByaXRlIDwgMCkgc3ByaXRlID0gMDtcclxuXHRcdHRoaXMuc3ByaXRlID0gc3ByaXRlO1xyXG5cdFx0dGhpcy5pc1Zpc2libGUgPSB0cnVlO1xyXG5cdH1cclxufSIsImltcG9ydCBkYiBmcm9tICcuLi9kYi5qcyc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4uL2dhbWUuanMnO1xyXG5pbXBvcnQgY29uZmlnIGZyb20gJy4uL2NvbmZpZy5qcyc7XHJcbmltcG9ydCB1dGlsIGZyb20gJy4uL3V0aWwuanMnO1xyXG5pbXBvcnQgRW50aXR5IGZyb20gJy4vZW50aXR5LmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEl0ZW0gZXh0ZW5kcyBFbnRpdHkge1xyXG5cdGNvbnN0cnVjdG9yKGRhdGEpIHtcclxuXHRcdGlmICghZGF0YS5vd25lciB8fCBkYXRhLml0ZW1DbGFzcyA9PSBudWxsIHx8IGRhdGEuaWQgPT0gbnVsbCkgcmV0dXJuO1xyXG5cdFx0XHJcblx0XHRpZiAoZGF0YS5vd25lciA9PT0gJ3BsYXllcicpIHtcclxuXHRcdFx0aWYgKGRhdGEuc2xvdCA9PSBudWxsKSByZXR1cm47XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChkYXRhLm93bmVyID09PSAnYm90Jykge1xyXG5cdFx0XHRpZiAoZGF0YS5tYXBJZCA9PSBudWxsIHx8IGRhdGEuc2xvdCA9PSBudWxsKSByZXR1cm47XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChkYXRhLm93bmVyID09PSAnbWFwJykge1xyXG5cdFx0XHRpZiAoZGF0YS5tYXBJZCA9PSBudWxsIHx8IGRhdGEueCA9PSBudWxsIHx8IGRhdGEueSA9PSBudWxsKSByZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGRhdGEubWFwSWQgPT09IHVuZGVmaW5lZCkgZGF0YS5tYXBJZCA9IG51bGw7XHJcblx0XHRpZiAoZGF0YS54ID09PSB1bmRlZmluZWQpIGRhdGEueCA9IG51bGw7XHJcblx0XHRpZiAoZGF0YS55ID09PSB1bmRlZmluZWQpIGRhdGEueSA9IG51bGw7XHJcblx0XHRpZiAoZGF0YS56ID09PSB1bmRlZmluZWQpIGRhdGEueiA9IC0xMDtcclxuXHRcdGlmIChkYXRhLnNsb3QgPT09IHVuZGVmaW5lZCkgZGF0YS5zbG90ID0gbnVsbDtcclxuXHJcblx0XHRsZXQgY2xhc3NEYXRhID0gZGIuZ2V0SXRlbURhdGEoZGF0YS5pdGVtQ2xhc3MpO1xyXG5cdFx0aWYgKGRhdGEubmFtZSA9PSBudWxsKSBkYXRhLm5hbWUgPSBjbGFzc0RhdGEubmFtZTtcclxuXHRcdGlmIChkYXRhLmRlc2NyaXB0aW9uID09IG51bGwpIGRhdGEuZGVzY3JpcHRpb24gPSBjbGFzc0RhdGEuZGVzY3JpcHRpb247XHJcblx0XHRpZiAoZGF0YS50eXBlID09IG51bGwpIGRhdGEudHlwZSA9IGNsYXNzRGF0YS50eXBlO1xyXG5cdFx0aWYgKGRhdGEuc3ByaXRlID09IG51bGwpIGRhdGEuc3ByaXRlID0gY2xhc3NEYXRhLnNwcml0ZTtcclxuXHRcdGlmIChkYXRhLnJldXNhYmxlID09IG51bGwpIGRhdGEucmV1c2FibGUgPSBjbGFzc0RhdGEucmV1c2FibGU7XHJcblx0XHRpZiAoZGF0YS5zdGFjayA9PSBudWxsKSBkYXRhLnN0YWNrID0gY2xhc3NEYXRhLnN0YWNrO1xyXG5cclxuXHRcdGlmIChkYXRhLnBhc3NpdmVEYW1hZ2UgPT0gbnVsbCkgZGF0YS5wYXNzaXZlRGFtYWdlID0gY2xhc3NEYXRhLnBhc3NpdmVEYW1hZ2U7XHJcblx0XHRpZiAoZGF0YS5wYXNzaXZlRGVmZW5jZSA9PSBudWxsKSBkYXRhLnBhc3NpdmVEZWZlbmNlID0gY2xhc3NEYXRhLnBhc3NpdmVEZWZlbmNlO1xyXG5cdFx0aWYgKGRhdGEucGFzc2l2ZUhlYWx0aE1heCA9PSBudWxsKSBkYXRhLnBhc3NpdmVIZWFsdGhNYXggPSBjbGFzc0RhdGEucGFzc2l2ZUhlYWx0aE1heDtcclxuXHRcdGlmIChkYXRhLnBhc3NpdmVFbmVyZ3lNYXggPT0gbnVsbCkgZGF0YS5wYXNzaXZlRW5lcmd5TWF4ID0gY2xhc3NEYXRhLnBhc3NpdmVFbmVyZ3lNYXg7XHJcblx0XHRpZiAoZGF0YS5wYXNzaXZlUmFuZ2UgPT0gbnVsbCkgZGF0YS5wYXNzaXZlUmFuZ2UgPSBjbGFzc0RhdGEucGFzc2l2ZVJhbmdlO1xyXG5cclxuXHRcdGlmIChkYXRhLmVxdWlwRGFtYWdlID09IG51bGwpIGRhdGEuZXF1aXBEYW1hZ2UgPSBjbGFzc0RhdGEuZXF1aXBEYW1hZ2U7XHJcblx0XHRpZiAoZGF0YS5lcXVpcERlZmVuY2UgPT0gbnVsbCkgZGF0YS5lcXVpcERlZmVuY2UgPSBjbGFzc0RhdGEuZXF1aXBEZWZlbmNlO1xyXG5cdFx0aWYgKGRhdGEuZXF1aXBIZWFsdGhNYXggPT0gbnVsbCkgZGF0YS5lcXVpcEhlYWx0aE1heCA9IGNsYXNzRGF0YS5lcXVpcEhlYWx0aE1heDtcclxuXHRcdGlmIChkYXRhLmVxdWlwRW5lcmd5TWF4ID09IG51bGwpIGRhdGEuZXF1aXBFbmVyZ3lNYXggPSBjbGFzc0RhdGEuZXF1aXBFbmVyZ3lNYXg7XHJcblx0XHRpZiAoZGF0YS5lcXVpcFJhbmdlID09IG51bGwpIGRhdGEuZXF1aXBSYW5nZSA9IGNsYXNzRGF0YS5lcXVpcFJhbmdlO1xyXG5cclxuXHRcdHN1cGVyKGRhdGEubWFwSWQsIGRhdGEueCwgZGF0YS55LCBkYXRhLnNwcml0ZSk7XHJcblx0XHR0aGlzLm93bmVyID0gZGF0YS5vd25lcjtcclxuXHRcdHRoaXMuaWQgPSBkYXRhLmlkO1xyXG5cdFx0dGhpcy5pdGVtQ2xhc3MgPSBkYXRhLml0ZW1DbGFzcztcclxuXHRcdHRoaXMuc3RhY2sgPSBkYXRhLnN0YWNrO1xyXG5cdFx0dGhpcy5zbG90ID0gZGF0YS5zbG90O1xyXG5cdFx0dGhpcy56ID0gZGF0YS56O1xyXG5cdFx0XHJcblx0XHR0aGlzLm5hbWUgPSBkYXRhLm5hbWU7XHJcblx0XHR0aGlzLmRlc2NyaXB0aW9uID0gZGF0YS5kZXNjcmlwdGlvbjtcclxuXHRcdHRoaXMudHlwZSA9IGRhdGEudHlwZTtcclxuXHRcdHRoaXMucmV1c2FibGUgPSBkYXRhLnJldXNhYmxlO1xyXG5cclxuXHRcdHRoaXMucGFzc2l2ZURhbWFnZSA9IGRhdGEucGFzc2l2ZURhbWFnZTtcclxuXHRcdHRoaXMucGFzc2l2ZURlZmVuY2UgPSBkYXRhLnBhc3NpdmVEZWZlbmNlO1xyXG5cdFx0dGhpcy5wYXNzaXZlSGVhbHRoTWF4ID0gZGF0YS5wYXNzaXZlSGVhbHRoTWF4O1xyXG5cdFx0dGhpcy5wYXNzaXZlRW5lcmd5TWF4ID0gZGF0YS5wYXNzaXZlRW5lcmd5TWF4O1xyXG5cdFx0dGhpcy5wYXNzaXZlUmFuZ2UgPSBkYXRhLnBhc3NpdmVSYW5nZTtcclxuXHRcdHRoaXMuZXF1aXBEYW1hZ2UgPSBkYXRhLmVxdWlwRGFtYWdlO1xyXG5cdFx0dGhpcy5lcXVpcERlZmVuY2UgPSBkYXRhLmVxdWlwRGVmZW5jZTtcclxuXHRcdHRoaXMuZXF1aXBIZWFsdGhNYXggPSBkYXRhLmVxdWlwSGVhbHRoTWF4O1xyXG5cdFx0dGhpcy5lcXVpcEVuZXJneU1heCA9IGRhdGEuZXF1aXBFbmVyZ3lNYXg7XHJcblx0XHR0aGlzLmVxdWlwUmFuZ2UgPSBkYXRhLmVxdWlwUmFuZ2U7XHJcblxyXG5cdFx0aWYgKGRhdGEub3duZXIgPT09ICdtYXAnKSB7XHJcblx0XHRcdGdhbWUubWFwTGlzdFt0aGlzLm1hcElkXS5pdGVtc1t0aGlzLmlkXSA9IHRoaXM7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChkYXRhLm93bmVyID09PSAncGxheWVyJykge1xyXG5cdFx0XHRnYW1lLnBsYXllckxpc3RbdGhpcy5pZF0uaW52ZW50b3J5W3RoaXMuc2xvdF0gPSB0aGlzO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoZGF0YS5vd25lciA9PT0gJ2JvdCcpIHtcclxuXHRcdFx0Z2FtZS5tYXBMaXN0W3RoaXMubWFwSWRdLmJvdHNbdGhpcy5pZF0uaW52ZW50b3J5W3RoaXMuc2xvdF0gPSB0aGlzO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRnZXQgZGFtYWdlKCkge1xyXG5cdFx0bGV0IGRhbWFnZVRvdGFsID0gdGhpcy5wYXNzaXZlRGFtYWdlICsgdGhpcy5lcXVpcERhbWFnZTtcclxuXHRcdHJldHVybiAoZGFtYWdlVG90YWwgPCAwKSA/IDAgOiBkYW1hZ2VUb3RhbDtcclxuXHR9XHJcblx0Z2V0IGRlZmVuY2UoKSB7XHJcblx0XHRsZXQgZGVmZW5jZVRvdGFsID0gdGhpcy5wYXNzaXZlRGVmZW5jZSArIHRoaXMuZXF1aXBEZWZlbmNlO1xyXG5cdFx0cmV0dXJuIChkZWZlbmNlVG90YWwgPCAwKSA/IDAgOiBkZWZlbmNlVG90YWw7XHJcblx0fVxyXG5cdGdldCBoZWFsdGhNYXgoKSB7XHJcblx0XHRsZXQgaGVhbHRoTWF4VG90YWwgPSB0aGlzLnBhc3NpdmVIZWFsdGhNYXggKyB0aGlzLmVxdWlwSGVhbHRoTWF4O1xyXG5cdFx0cmV0dXJuIChoZWFsdGhNYXhUb3RhbCA8IDApID8gMCA6IGhlYWx0aE1heFRvdGFsO1xyXG5cdH1cclxuXHRnZXQgZW5lcmd5TWF4KCkge1xyXG5cdFx0bGV0IGVuZXJneU1heFRvdGFsID0gdGhpcy5wYXNzaXZlRW5lcmd5TWF4ICsgdGhpcy5lcXVpcEVuZXJneU1heDtcclxuXHRcdHJldHVybiAoZW5lcmd5TWF4VG90YWwgPCAwKSA/IDAgOiBlbmVyZ3lNYXhUb3RhbDtcclxuXHR9XHJcblx0Z2V0IHJhbmdlKCkge1xyXG5cdFx0bGV0IHJhbmdlVG90YWwgPSB0aGlzLnBhc3NpdmVSYW5nZSArIHRoaXMuZXF1aXBSYW5nZTtcclxuXHRcdHJldHVybiAocmFuZ2VUb3RhbCA8IDApID8gMCA6IHJhbmdlVG90YWw7XHJcblx0fVxyXG5cclxuXHR1cGRhdGUoZGVsdGEpIHtcclxuXHRcdHJldHVybiB0aGlzLmdldFBhY2soKTtcclxuXHR9XHJcblxyXG5cdGdldFBhY2soKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRpZDogdGhpcy5pZCxcclxuXHRcdFx0bWFwSWQ6IHRoaXMubWFwSWQsXHJcblx0XHRcdHg6IHRoaXMueCxcclxuXHRcdFx0eTogdGhpcy55LFxyXG5cdFx0XHR6OiB0aGlzLnosXHJcblx0XHRcdHNsb3Q6IHRoaXMuc2xvdCxcclxuXHRcdFx0aXRlbUNsYXNzOiB0aGlzLml0ZW1DbGFzcyxcclxuXHRcdFx0c3RhY2s6IHRoaXMuc3RhY2ssXHJcblx0XHRcdG5hbWU6IHRoaXMubmFtZSxcclxuXHRcdFx0ZGVzY3JpcHRpb246IHRoaXMuZGVzY3JpcHRpb24sXHJcblx0XHRcdHNwcml0ZTogdGhpcy5zcHJpdGUsXHJcblx0XHRcdHR5cGU6IHRoaXMudHlwZSxcclxuXHRcdFx0cmV1c2FibGU6IHRoaXMucmV1c2FibGUsXHJcblx0XHRcdGRhbWFnZUJvbnVzOiB0aGlzLmRhbWFnZUJvbnVzLFxyXG5cdFx0XHRkZWZlbmNlQm9udXM6IHRoaXMuZGVmZW5jZUJvbnVzLFxyXG5cdFx0XHRoZWFsdGhNYXhCb251czogdGhpcy5oZWFsdGhNYXhCb251cyxcclxuXHRcdFx0ZW5lcmd5TWF4Qm9udXM6IHRoaXMuZW5lcmd5TWF4Qm9udXMsXHJcblx0XHRcdHJhbmdlQm9udXM6IHRoaXMucmFuZ2VCb251cyxcclxuXHRcdFx0aXNWaXNpYmxlOiB0aGlzLmlzVmlzaWJsZVxyXG5cdFx0fTtcclxuXHR9XHJcblx0XHJcblx0cmVtb3ZlKCkge1xyXG5cdFx0aWYgKHRoaXMub3duZXIgPT09ICdwbGF5ZXInKSB7XHJcblx0XHRcdGRlbGV0ZSBnYW1lLnBsYXllckxpc3RbdGhpcy5pZF0uaW52ZW50b3J5W3RoaXMuc2xvdF07XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmICh0aGlzLm93bmVyID09PSAnbWFwJykge1xyXG5cdFx0XHRkZWxldGUgZ2FtZS5tYXBMaXN0W3RoaXMubWFwSWRdLml0ZW1zW3RoaXMuaWRdO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAodGhpcy5vd25lciA9PT0gJ2JvdCcpIHtcclxuXHRcdFx0ZGVsZXRlIGdhbWUubWFwTGlzdFt0aGlzLm1hcElkXS5ib3RzW3RoaXMuaWRdLmludmVudG9yeVt0aGlzLnNsb3RdO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRpc0VxdWlwbWVudCgpIHtcclxuXHRcdGNvbnN0IGl0ZW1UeXBlcyA9IFsnd2VhcG9uJywgJ3NoaWVsZCcsICdhcm1vdXInLCAnaGVsbWV0JywgJ3JpbmcnXTtcclxuXHRcdHJldHVybiAoaXRlbVR5cGVzLmluY2x1ZGVzKHRoaXMudHlwZSkpO1xyXG5cdH1cclxuXHJcblx0Y2FuRXF1aXAoc2xvdCkge1xyXG5cdFx0aWYgKHNsb3QgPT09IGNvbmZpZy5JTlZFTlRPUllfU0laRSkge1xyXG5cdFx0XHRpZiAodGhpcy50eXBlID09PSAnd2VhcG9uJykgcmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChzbG90ID09PSBjb25maWcuSU5WRU5UT1JZX1NJWkUgKyAxKSB7XHJcblx0XHRcdGlmICh0aGlzLnR5cGUgPT09ICdzaGllbGQnKSByZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKHNsb3QgPT09IGNvbmZpZy5JTlZFTlRPUllfU0laRSArIDIpIHtcclxuXHRcdFx0aWYgKHRoaXMudHlwZSA9PT0gJ2FybW91cicpIHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoc2xvdCA9PT0gY29uZmlnLklOVkVOVE9SWV9TSVpFICsgMykge1xyXG5cdFx0XHRpZiAodGhpcy50eXBlID09PSAnaGVsbWV0JykgcmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChzbG90ID09PSBjb25maWcuSU5WRU5UT1JZX1NJWkUgKyA0KSB7XHJcblx0XHRcdGlmICh0aGlzLnR5cGUgPT09ICdyaW5nJykgcmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0bW92ZVRvUGxheWVyKGlkLCBzbG90KSB7XHJcblx0XHRpZiAoaWQgPT0gbnVsbCB8fCBzbG90ID09IG51bGwpIHJldHVybjtcclxuXHJcblx0XHR0aGlzLnJlbW92ZSgpO1xyXG5cdFx0dGhpcy5vd25lciA9ICdwbGF5ZXInO1xyXG5cdFx0dGhpcy5pZCA9IGlkO1xyXG5cdFx0dGhpcy5zbG90ID0gc2xvdDtcclxuXHRcdGdhbWUucGxheWVyTGlzdFt0aGlzLmlkXS5pbnZlbnRvcnlbdGhpcy5zbG90XSA9IHRoaXM7XHJcblx0fVxyXG5cclxuXHRtb3ZlVG9NYXAobWFwSWQsIHgsIHkpIHtcclxuXHRcdGlmIChtYXBJZCA9PSBudWxsIHx8IHggPT0gbnVsbCB8fCB5ID09IG51bGwpIHJldHVybjtcclxuXHJcblx0XHR0aGlzLnJlbW92ZSgpO1xyXG5cdFx0dGhpcy5vd25lciA9ICdtYXAnO1xyXG5cdFx0dGhpcy5tYXBJZCA9IG1hcElkO1xyXG5cdFx0dGhpcy5pZCA9IHV0aWwuZmlyc3RFbXB0eUluZGV4KGdhbWUubWFwTGlzdFt0aGlzLm1hcElkXS5pdGVtcyk7XHJcblx0XHR0aGlzLnggPSB4O1xyXG5cdFx0dGhpcy55ID0geTtcclxuXHRcdGdhbWUubWFwTGlzdFt0aGlzLm1hcElkXS5pdGVtc1t0aGlzLmlkXSA9IHRoaXM7XHJcblx0fVxyXG5cclxuXHRtb3ZlVG9Cb3QobWFwSWQsIGlkLCBzbG90KSB7XHJcblx0XHRpZiAobWFwSWQgPT0gbnVsbCB8fCBpZCA9PSBudWxsIHx8IHNsb3QgPT0gbnVsbCkgcmV0dXJuO1xyXG5cclxuXHRcdHRoaXMucmVtb3ZlKCk7XHJcblx0XHR0aGlzLm93bmVyID0gJ2JvdCc7XHJcblx0XHR0aGlzLm1hcElkID0gbWFwSWQ7XHJcblx0XHR0aGlzLmlkID0gaWQ7XHJcblx0XHR0aGlzLnNsb3QgPSBzbG90O1xyXG5cdFx0Z2FtZS5tYXBMaXN0W3RoaXMubWFwSWRdLmJvdHNbdGhpcy5pZF0uaW52ZW50b3J5W3RoaXMuc2xvdF0gPSB0aGlzO1xyXG5cdH1cclxufVxyXG4iLCJpbXBvcnQgY29uZmlnIGZyb20gJy4uL2NvbmZpZy5qcyc7XHJcbmltcG9ydCB1dGlsIGZyb20gJy4uL3V0aWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFwIHtcclxuXHRjb25zdHJ1Y3RvcihpZCwgZGF0YSkge1xyXG5cdFx0dGhpcy5pZCA9IGlkO1xyXG5cclxuXHRcdHRoaXMubmFtZSA9IGRhdGEubmFtZTtcclxuXHRcdHRoaXMuZHJvcENoYW5jZSA9IHV0aWwuY2xhbXAoZGF0YS5kcm9wQ2hhbmNlLCAwLCAxMDApO1xyXG5cdFx0Ly90aGlzLmRyb3BDaGFuY2UgPSAwID0gMCUgY2hhbmNlIHRvIGRyb3AgaXRlbXMgaW4gaW52ZW50b3J5IChkcm9wIG5vdGhpbmcpLCAxMDAgPSAxMDAlIGNoYW5jZSB0byBkcm9wIChkcm9wIGV2ZXJ5dGhpbmcpXHJcblx0XHR0aGlzLmRyb3BBbW91bnRFUSA9IHV0aWwuY2xhbXAoZGF0YS5kcm9wQW1vdW50RVEsIDAsIGNvbmZpZy5FUVVJUE1FTlRfU0laRSk7XHJcblx0XHQvL3RoaXMuZHJvcEFtb3VudEVRID0gbnVtYmVyIG9mIGVxdWlwcGVkIGl0ZW1zIHRoZSBwbGF5ZXIgd2lsbCBkcm9wIG9uIGRlYXRoLiBkcm9wRVEgPSBFUVVJUE1FTlRfU0laRSA9IGRyb3AgYWxsIGVxdWlwbWVudFxyXG5cdFx0XHJcblx0XHR0aGlzLml0ZW1zID0gZGF0YS5pdGVtcztcclxuXHRcdHRoaXMuYm90cyA9IGRhdGEuYm90cztcclxuXHRcdHRoaXMuZWZmZWN0cyA9IGRhdGEuZWZmZWN0cztcclxuXHRcdHRoaXMudGV4dHMgPSBkYXRhLnRleHRzO1xyXG5cdFx0dGhpcy50aWxlcyA9IGRhdGEudGlsZXM7XHJcblx0fVxyXG5cdFxyXG5cdHVwZGF0ZShkZWx0YSkge1xyXG5cdFx0bGV0IHBhY2sgPSB7XHJcblx0XHRcdGl0ZW1zOiBbXSxcclxuXHRcdFx0Ym90czogW10sXHJcblx0XHRcdGVmZmVjdHM6IFtdLFxyXG5cdFx0XHR0ZXh0czogW11cclxuXHRcdH07XHJcblx0XHRcclxuXHRcdHRoaXMuaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG5cdFx0XHRwYWNrLml0ZW1zW2l0ZW0uaWRdID0gaXRlbS51cGRhdGUoZGVsdGEpO1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLmJvdHMuZm9yRWFjaCgoYm90KSA9PiB7XHJcblx0XHRcdHBhY2suYm90c1tib3QuaWRdID0gYm90LnVwZGF0ZShkZWx0YSk7XHJcblx0XHR9KTtcclxuXHRcdHRoaXMuZWZmZWN0cy5mb3JFYWNoKChlZmZlY3QpID0+IHtcclxuXHRcdFx0cGFjay5lZmZlY3RzW2VmZmVjdC5pZF0gPSBlZmZlY3QudXBkYXRlKGRlbHRhKTtcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy50ZXh0cy5mb3JFYWNoKCh0ZXh0KSA9PiB7XHJcblx0XHRcdHBhY2sudGV4dHNbdGV4dC5pZF0gPSB0ZXh0LnVwZGF0ZShkZWx0YSk7XHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdFx0cmV0dXJuIHBhY2s7XHJcblx0fVxyXG5cdFxyXG5cdGdldFBhY2soKSB7XHJcblx0XHRsZXQgbWFwUGFjayA9IHtcclxuXHRcdFx0bmFtZTogdGhpcy5uYW1lLFxyXG5cdFx0XHR0aWxlczogdGhpcy50aWxlcyxcclxuXHRcdFx0Ym90czogW10sXHJcblx0XHRcdGl0ZW1zOiBbXSxcclxuXHRcdFx0ZWZmZWN0czogW10sXHJcblx0XHRcdHRleHRzOiBbXVxyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLmJvdHMuZm9yRWFjaCgoYm90KSA9PiB7XHJcblx0XHRcdG1hcFBhY2suYm90c1tib3QuaWRdID0gYm90LmdldFBhY2soKTtcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5pdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XHJcblx0XHRcdG1hcFBhY2suaXRlbXNbaXRlbS5pZF0gPSBpdGVtLmdldFBhY2soKTtcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5lZmZlY3RzLmZvckVhY2goKGVmZmVjdCkgPT4ge1xyXG5cdFx0XHRtYXBQYWNrLmVmZmVjdHNbZWZmZWN0LmlkXSA9IGVmZmVjdC5nZXRQYWNrKCk7XHJcblx0XHR9KTtcclxuXHRcdHRoaXMudGV4dHMuZm9yRWFjaCgodGV4dCkgPT4ge1xyXG5cdFx0XHRtYXBQYWNrLnRleHRzW3RleHQuaWRdID0gdGV4dC5nZXRQYWNrKCk7XHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdFx0cmV0dXJuIG1hcFBhY2s7XHJcblx0fVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWVzc2FnZSB7XHJcblx0Y29uc3RydWN0b3Ioc2VuZGVySWQsIG1lc3NhZ2UsIHR5cGUsIG1hcElkLCBpZCwgY29sb3VyKSB7XHJcblx0XHR0aGlzLnNlbmRlcklkID0gc2VuZGVySWQ7IC8vIG51bGwgPSBzZXJ2ZXJcclxuXHRcdHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XHJcblx0XHR0aGlzLnR5cGUgPSB0eXBlO1xyXG5cdFx0dGhpcy5tYXBJZCA9IG1hcElkO1xyXG5cdFx0dGhpcy5pZCA9IGlkO1xyXG5cdFx0dGhpcy5jb2xvdXIgPSBjb2xvdXI7XHJcblx0fVxyXG59IiwiaW1wb3J0IGRiIGZyb20gJy4uL2RiLmpzJztcclxuaW1wb3J0IGdhbWUgZnJvbSAnLi4vZ2FtZS5qcyc7XHJcbmltcG9ydCBjb25maWcgZnJvbSAnLi4vY29uZmlnLmpzJztcclxuaW1wb3J0IEFjdG9yIGZyb20gJy4vYWN0b3IuanMnO1xyXG5pbXBvcnQgVGV4dCBmcm9tICcuL3RleHQuanMnO1xyXG5cclxuLy8gQSBQbGF5ZXIgaXMgYW4gaW1tb3J0YWwgQWN0b3Igd2hpY2ggdGFrZXMgaW5wdXQgZnJvbSBhIGNsaWVudFxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyIGV4dGVuZHMgQWN0b3Ige1xyXG5cdGNvbnN0cnVjdG9yKGlkKSB7XHJcblx0XHRjb25zdCBkYXRhID0gZGIuZ2V0UGxheWVyRGF0YShpZCk7XHJcblxyXG5cdFx0c3VwZXIoZGF0YS5tYXBJZCwgZGF0YS54LCBkYXRhLnksIGRhdGEubmFtZSwgZGF0YS5zcHJpdGUpO1xyXG5cdFx0dGhpcy5jb250cm9sbGVyID0gJ3BsYXllcic7XHJcblx0XHR0aGlzLmlkID0gaWQ7XHJcblx0XHR0aGlzLmFkbWluQWNjZXNzID0gZGF0YS5hZG1pbkFjY2VzcztcclxuXHJcblx0XHR0aGlzLmRhbWFnZUJhc2UgPSBkYXRhLmRhbWFnZUJhc2U7XHRcdFx0XHQvLyBtaW5pbXVtIGRhbWFnZSBhIHBsYXllciBjYW4gaGF2ZVxyXG5cdFx0dGhpcy5kZWZlbmNlQmFzZSA9IGRhdGEuZGVmZW5jZUJhc2U7XHRcdFx0Ly8gbWluaW11bSBkZWZlbmNlIGEgcGxheWVyIGNhbiBoYXZlXHJcblx0XHR0aGlzLmhlYWx0aE1heEJhc2UgPSBkYXRhLmhlYWx0aE1heEJhc2U7XHQvLyBtYXggaGVhbHRoIHdpdGhvdXQgYm9udXNlc1xyXG5cdFx0dGhpcy5lbmVyZ3lNYXhCYXNlID0gZGF0YS5lbmVyZ3lNYXhCYXNlO1x0Ly8gbWF4IGVuZXJneSB3aXRob3V0IGJvbnVzZXNcclxuXHRcdHRoaXMuY2FsY1N0YXRzKCk7XHJcblx0XHR0aGlzLnJlc3RvcmUoKTtcclxuXHJcblx0XHR0aGlzLmlzRGVhZCA9IGZhbHNlO1xyXG5cdFx0dGhpcy5kZWF0aHMgPSAwO1xyXG5cdFx0dGhpcy5yZXNwYXduVGltZXIgPSAwO1xyXG5cdFx0dGhpcy5yZXNwYXduU3BlZWQgPSAxMDtcclxuXHRcdHRoaXMucmVzcGF3bk1hcCA9IGRhdGEubWFwSWQ7XHJcblx0XHR0aGlzLnJlc3Bhd25YID0gZGF0YS54O1xyXG5cdFx0dGhpcy5yZXNwYXduWSA9IGRhdGEueTtcclxuXHJcblx0XHR0aGlzLnNlbGVjdGVkID0gbnVsbDtcclxuXHRcdHRoaXMuaW5wdXQgPSB7XHJcblx0XHRcdGRpcmVjdGlvbjogbnVsbCxcclxuXHRcdFx0cnVuOiBmYWxzZSxcclxuXHRcdFx0cGlja3VwOiBmYWxzZSxcclxuXHRcdFx0YXR0YWNrOiBmYWxzZVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHRzdXBlci51cGRhdGUoZGVsdGEpO1x0XHQvLyBEZWZhdWx0IEFjdG9yIFVwZGF0ZVxyXG5cdFx0aWYgKHRoaXMuaXNEZWFkKSB7XHJcblx0XHRcdC8vIFJlc3Bhd25pbmdcclxuXHRcdFx0dGhpcy5yZXNwYXduVGltZXIgKz0gZGVsdGE7XHJcblx0XHRcdGlmICh0aGlzLnJlc3Bhd25UaW1lciA+PSB0aGlzLnJlc3Bhd25TcGVlZCkgdGhpcy5yZXNwYXduKCk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Ly8gQ2hlY2sgZm9yIEF0YWNrIElucHV0XHJcblx0XHRcdGlmICh0aGlzLmlucHV0LmF0dGFjayAmJiB0aGlzLmF0dGFja1RpbWVyID09PSAwKSB0aGlzLmF0dGFjaygpO1xyXG5cdFx0XHRcclxuXHRcdFx0Ly8gQ2hlY2sgZm9yIE1vdmVtZW50IElucHV0XHJcblx0XHRcdGlmICghdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdGlmICh0aGlzLmlucHV0LmRpcmVjdGlvbikge1xyXG5cdFx0XHRcdFx0Ly8gQ2hlY2sgZm9yIFJ1biBJbnB1dFxyXG5cdFx0XHRcdFx0aWYgKHRoaXMuaW5wdXQucnVuKSB7XHJcblx0XHRcdFx0XHRcdCh0aGlzLmVuZXJneSA+IDApID8gdGhpcy5pc1J1bm5pbmcgPSB0cnVlIDogdGhpcy5pc1J1bm5pbmcgPSBmYWxzZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmlzUnVubmluZyA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKHRoaXMuaW5wdXQuZGlyZWN0aW9uKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIHRoaXMuZ2V0UGFjaygpO1xyXG5cdH1cclxuXHRcclxuXHRnZXRQYWNrKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0aWQ6IHRoaXMuaWQsXHJcblx0XHRcdG5hbWU6IHRoaXMubmFtZSxcclxuXHRcdFx0ZGVzY3JpcHRpb246IHRoaXMuZGVzY3JpcHRpb24sXHJcblx0XHRcdHNwcml0ZTogdGhpcy5zcHJpdGUsXHJcblx0XHRcdGRpcmVjdGlvbjogdGhpcy5kaXJlY3Rpb24sXHJcblx0XHRcdG1hcElkOiB0aGlzLm1hcElkLFxyXG5cdFx0XHR4OiB0aGlzLnN0YXJ0WCxcclxuXHRcdFx0eTogdGhpcy5zdGFydFksXHJcblx0XHRcdHo6IHRoaXMueixcclxuXHRcdFx0ZGVzdGluYXRpb25YOiB0aGlzLmRlc3RpbmF0aW9uWCxcclxuXHRcdFx0ZGVzdGluYXRpb25ZOiB0aGlzLmRlc3RpbmF0aW9uWSxcclxuXHRcdFx0bGVycDogdGhpcy5sZXJwLFxyXG5cdFx0XHRpc1J1bm5pbmc6IHRoaXMuaXNSdW5uaW5nLFxyXG5cdFx0XHRpc0F0dGFja2luZzogdGhpcy5pc0F0dGFja2luZyxcclxuXHRcdFx0aXNEZWFkOiB0aGlzLmlzRGVhZCxcclxuXHRcdFx0aXNWaXNpYmxlOiB0aGlzLmlzVmlzaWJsZVxyXG5cdFx0fTtcclxuXHR9XHJcblx0XHJcblx0Z2V0UHJpdmF0ZVBhY2soKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRpZDogdGhpcy5pZCxcclxuXHRcdFx0aGVhbHRoOiB0aGlzLmhlYWx0aCxcclxuXHRcdFx0aGVhbHRoTWF4OiB0aGlzLmhlYWx0aE1heCxcclxuXHRcdFx0ZW5lcmd5OiB0aGlzLmVuZXJneSxcclxuXHRcdFx0ZW5lcmd5TWF4OiB0aGlzLmVuZXJneU1heCxcclxuXHRcdFx0bW92ZVNwZWVkOiB0aGlzLm1vdmVTcGVlZCxcclxuXHRcdFx0YXR0YWNrU3BlZWQ6IHRoaXMuYXR0YWNrU3BlZWQsXHJcblx0XHRcdGF0dGFja1RpbWVyOiB0aGlzLmF0dGFja1RpbWVyLFxyXG5cdFx0XHRpbnZlbnRvcnk6IHRoaXMuZ2V0SW52ZW50b3J5UGFjaygpXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0cGlja1VwKCkge1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBnYW1lLm1hcExpc3RbdGhpcy5tYXBJZF0uaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0bGV0IGl0ZW0gPSBnYW1lLm1hcExpc3RbdGhpcy5tYXBJZF0uaXRlbXNbaV07XHJcblx0XHRcdGlmIChpdGVtICYmIGl0ZW0ueCA9PT0gdGhpcy54ICYmIGl0ZW0ueSA9PT0gdGhpcy55KSB7XHJcblx0XHRcdFx0bGV0IHNsb3QgPSB0aGlzLmdldE1hcEl0ZW0oaXRlbS5tYXBJZCwgaXRlbS5pZCk7XHJcblx0XHRcdFx0aWYgKHNsb3QgIT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0aXRlbS5tb3ZlVG9QbGF5ZXIodGhpcy5pZCwgc2xvdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly8gSW52ZW50b3J5IGZ1bGxcclxuXHRcdFx0XHRcdGdhbWUuc2VuZEdhbWVJbmZvUGxheWVyKHRoaXMuaWQsIFwiWW91ciBpbnZlbnRvcnkgaXMgZnVsbC5cIik7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHNldERlYWQoa2lsbGVyQ29udHJvbGxlciwga2lsbGVyTmFtZSkge1xyXG5cdFx0c3VwZXIuc2V0RGVhZCgpO1xyXG5cdFx0dGhpcy5pc0RlYWQgPSB0cnVlO1xyXG5cdFx0dGhpcy5oZWFsdGggPSAwO1xyXG5cdFx0dGhpcy5lbmVyZ3kgPSAwO1xyXG5cdFx0dGhpcy5kZWF0aHMrKztcclxuXHRcdFxyXG5cdFx0aWYgKGtpbGxlckNvbnRyb2xsZXIgJiYga2lsbGVyTmFtZSkge1xyXG5cdFx0XHRpZiAoa2lsbGVyQ29udHJvbGxlciA9PT0gJ3BsYXllcicpIHtcclxuXHRcdFx0XHRnYW1lLnNlbmRHYW1lSW5mb0dsb2JhbChraWxsZXJOYW1lICsgXCIgaGFzIG11cmRlcmVkIFwiICsgdGhpcy5uYW1lICsgXCIgaW4gY29sZCBibG9vZCFcIik7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0Z2FtZS5zZW5kR2FtZUluZm9HbG9iYWwodGhpcy5uYW1lICsgXCIgaGFzIGJlZW4ga2lsbGVkIGJ5IFwiICsga2lsbGVyTmFtZSArIFwiIVwiKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGdhbWUuc2VuZEdhbWVJbmZvR2xvYmFsKHRoaXMubmFtZSArIFwiIGhhcyBkaWVkIVwiKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJlc3Bhd24oKSB7XHJcblx0XHR0aGlzLm1hcElkID0gdGhpcy5yZXNwYXduTWFwO1xyXG5cdFx0dGhpcy54ID0gdGhpcy5yZXNwYXduWDtcclxuXHRcdHRoaXMueSA9IHRoaXMucmVzcGF3blk7XHJcblx0XHR0aGlzLnN0YXJ0WCA9IHRoaXMucmVzcGF3blg7XHJcblx0XHR0aGlzLnN0YXJ0WSA9IHRoaXMucmVzcGF3blk7XHJcblx0XHR0aGlzLmRlc3RpbmF0aW9uWCA9IHRoaXMucmVzcGF3blg7XHJcblx0XHR0aGlzLmRlc3RpbmF0aW9uWSA9IHRoaXMucmVzcGF3blk7XHJcblx0XHRcclxuXHRcdHRoaXMuY2FsY0JvbnVzU3RhdHMoKTtcclxuXHRcdHRoaXMucmVzdG9yZSgpO1xyXG5cdFx0XHJcblx0XHR0aGlzLmlzV2Fsa2luZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy5pc1J1bm5pbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMuaXNBdHRhY2tpbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMuaXNEZWFkID0gZmFsc2U7XHJcblx0XHR0aGlzLnJlc3Bhd25UaW1lciA9IDA7XHJcblx0XHRnYW1lLnNlbmRHYW1lSW5mb1BsYXllcih0aGlzLmlkLCBcIlRoZSBBbmdlbCBvZiBNZXJjeSByZWZ1c2VzIHRvIGxldCB5b3UgZGllLlwiKTtcclxuXHR9XHJcblxyXG5cdGNhbGNCYXNlU3RhdHMoKSB7XHQvLyBDbGFzcyBhbmQgTGV2ZWxcclxuXHRcdC8vVE9ETzogY2hlY2sgZGIgZm9yIGNsYXNzIHN0YXRzOiBiYXNlIGFuZCBpbmNyZWFzZSBwZXIgbGV2ZWxcclxuXHRcdC8vIHRoaXMuZGFtYWdlQmFzZSA9IHBsYXllckNsYXNzLmRhbWFnZUJhc2UgKyAocGxheWVyQ2xhc3MuaW5jcmVhc2VQZXJMZXZlbC5kYW1hZ2UgKiB0aGlzLmxldmVsKTtcclxuXHRcdHRoaXMuZGFtYWdlQmFzZSA9IGNvbmZpZy5TVEFSVF9EQU1BR0U7XHJcblx0XHR0aGlzLmRlZmVuY2VCYXNlID0gY29uZmlnLlNUQVJUX0RFRkVOQ0U7XHJcblx0XHR0aGlzLmhlYWx0aE1heEJhc2UgPSBjb25maWcuU1RBUlRfSEVBTFRIX01BWDtcclxuXHRcdHRoaXMuZW5lcmd5TWF4QmFzZSA9IGNvbmZpZy5TVEFSVF9FTkVSR1lfTUFYO1xyXG5cdFx0dGhpcy5yYW5nZUJhc2UgPSBjb25maWcuU1RBUlRfUkFOR0U7XHJcblx0fVxyXG59XHJcbiIsImltcG9ydCBnYW1lIGZyb20gJy4uL2dhbWUuanMnO1xyXG5pbXBvcnQgdXRpbCBmcm9tICcuLi91dGlsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRleHQge1xyXG5cdGNvbnN0cnVjdG9yKG1hcElkLCB4LCB5LCBtZXNzYWdlLCBjb2xvdXIgPSAnIzAwMDAwMCcsIGRpc3BsYXlUaW1lID0gMiwgdmVsWCA9IDAsIHZlbFkgPSAwKSB7XHJcblx0XHR0aGlzLm1hcElkID0gbWFwSWQ7XHJcblx0XHR0aGlzLnggPSB4O1xyXG5cdFx0dGhpcy55ID0geTtcclxuXHRcdHRoaXMudmVsWCA9IHZlbFg7XHJcblx0XHR0aGlzLnZlbFkgPSB2ZWxZO1xyXG5cdFx0dGhpcy5sZXJwWCA9IDA7XHJcblx0XHR0aGlzLmxlcnBZID0gMDtcclxuXHJcblx0XHR0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xyXG5cdFx0dGhpcy5jb2xvdXIgPSBjb2xvdXI7XHJcblx0XHR0aGlzLmRpc3BsYXlUaW1lID0gZGlzcGxheVRpbWU7XHJcblx0XHR0aGlzLnRpbWVyID0gMDtcclxuXHJcblx0XHR0aGlzLmlkID0gdXRpbC5maXJzdEVtcHR5SW5kZXgoZ2FtZS5tYXBMaXN0W3RoaXMubWFwSWRdLnRleHRzKTtcclxuXHRcdGdhbWUubWFwTGlzdFt0aGlzLm1hcElkXS50ZXh0c1t0aGlzLmlkXSA9IHRoaXM7XHJcblx0fVxyXG5cdFxyXG5cdHVwZGF0ZShkZWx0YSkge1xyXG5cdFx0dGhpcy50aW1lciArPSBkZWx0YTtcclxuXHRcdGlmICh0aGlzLmRpc3BsYXlUaW1lID4gMCAmJiB0aGlzLnRpbWVyID4gdGhpcy5kaXNwbGF5VGltZSkge1xyXG5cdFx0XHR0aGlzLnJlbW92ZSgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMubGVycFggKz0gZGVsdGEgKiB0aGlzLnZlbFg7XHJcblx0XHR0aGlzLmxlcnBZICs9IGRlbHRhICogdGhpcy52ZWxZO1xyXG5cclxuXHRcdGlmICh0aGlzLmxlcnBYIDwgLTEpIHtcclxuXHRcdFx0dGhpcy5sZXJwWCsrO1xyXG5cdFx0XHR0aGlzLngtLTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKHRoaXMubGVycFggPiAxKSB7XHJcblx0XHRcdHRoaXMubGVycFgtLTtcclxuXHRcdFx0dGhpcy54Kys7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMubGVycFkgPCAtMSkge1xyXG5cdFx0XHR0aGlzLmxlcnBZKys7XHJcblx0XHRcdHRoaXMueS0tO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAodGhpcy5sZXJwWSA+IDEpIHtcclxuXHRcdFx0dGhpcy5sZXJwWS0tO1xyXG5cdFx0XHR0aGlzLnkrKztcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIHRoaXMuZ2V0UGFjaygpO1xyXG5cdH1cclxuXHRcclxuXHRnZXRQYWNrKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0aWQ6IHRoaXMuaWQsXHJcblx0XHRcdG1hcElkOiB0aGlzLm1hcElkLFxyXG5cdFx0XHR4OiB0aGlzLngsXHJcblx0XHRcdHk6IHRoaXMueSxcclxuXHRcdFx0bGVycFg6IHRoaXMubGVycFgsXHJcblx0XHRcdGxlcnBZOiB0aGlzLmxlcnBZLFxyXG5cdFx0XHRtZXNzYWdlOiB0aGlzLm1lc3NhZ2UsXHJcblx0XHRcdGNvbG91cjogdGhpcy5jb2xvdXJcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHRyZW1vdmUoKSB7XHJcblx0XHRkZWxldGUgZ2FtZS5tYXBMaXN0W3RoaXMubWFwSWRdLnRleHRzW3RoaXMuaWRdO1xyXG5cdH1cclxufVxyXG4iLCJjb25zdCBjb25maWcgPSB7fTtcclxuXHJcbmNvbmZpZy5QT1JUID0gMjAwMDtcclxuY29uZmlnLkZSQU1FUkFURSA9IDEwMDAgLyA2MDtcclxuY29uZmlnLkJBQ0tVUF9USU1FID0gMTIwO1xyXG5cclxuY29uZmlnLk1BUF9MQVlFUlMgPSA2O1xyXG5jb25maWcuTUFQX0NPTFVNTlMgPSAxMjtcclxuY29uZmlnLk1BUF9ST1dTID0gMTI7XHJcblxyXG5jb25maWcuTUFYX01BUFMgPSAxMDtcclxuY29uZmlnLk1BWF9VU0VSUyA9IDEwMDtcclxuY29uZmlnLk1BWF9TUFJJVEVTID0gMTM7XHJcbmNvbmZpZy5NQVhfRUZGRUNUUyA9IDcxO1xyXG5cclxuY29uZmlnLk1BWF9IRUFMVEhfQkFTRSA9IDIwMDtcclxuY29uZmlnLk1BWF9IRUFMVEhfQk9OVVMgPSA1NTtcclxuY29uZmlnLk1BWF9FTkVSR1lfQkFTRSA9IDIwMDtcclxuY29uZmlnLk1BWF9FTkVSR1lfQk9OVVMgPSA1NTtcclxuXHJcbmNvbmZpZy5JTlZFTlRPUllfU0laRSA9IDIwO1xyXG5jb25maWcuRVFVSVBNRU5UX1NJWkUgPSA1O1xyXG5cclxuY29uZmlnLlNUQVJUX01BUCA9IDE7XHJcbmNvbmZpZy5TVEFSVF9YID0gNTtcclxuY29uZmlnLlNUQVJUX1kgPSA1O1xyXG5jb25maWcuU1RBUlRfTkFNRSA9ICdOZXcgUGxheWVyJztcclxuY29uZmlnLlNUQVJUX1NQUklURSA9IDE7XHJcbmNvbmZpZy5TVEFSVF9EQU1BR0UgPSAyO1xyXG5jb25maWcuU1RBUlRfREVGRU5DRSA9IDA7XHJcbmNvbmZpZy5TVEFSVF9IRUFMVEhfTUFYID0gMjA7XHJcbmNvbmZpZy5TVEFSVF9FTkVSR1lfTUFYID0gMTA7XHJcbmNvbmZpZy5TVEFSVF9SQU5HRSA9IDE7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjb25maWc7XHJcbiIsImltcG9ydCBmcyBmcm9tICdmcyc7XHJcbmltcG9ydCBtb25nb2pzIGZyb20gXCJtb25nb2pzXCI7XHJcbmltcG9ydCBjb25maWcgZnJvbSBcIi4vY29uZmlnLmpzXCI7XHJcbmltcG9ydCB1dGlsIGZyb20gXCIuL3V0aWwuanNcIjtcclxuXHJcbmNvbnN0IG1vbmdvID0gbW9uZ29qcygnbG9jYWxob3N0OjI3MDE3L29keXNzZXknLCBbJ2FjY291bnRzJywgJ3BsYXllcnMnLCAnbWFwcycsICdpdGVtcycsICdib3RzJ10pO1xyXG5cclxuY2xhc3MgRGF0YWJhc2Uge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0dGhpcy5tYXBzID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoJy4vc2VydmVyL2RhdGEvbWFwcy5qc29uJywgJ3V0ZjgnKSk7XHJcblx0XHR0aGlzLnBsYXllcnMgPSBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYygnLi9zZXJ2ZXIvZGF0YS9wbGF5ZXJzLmpzb24nLCAndXRmOCcpKTtcclxuXHRcdHRoaXMuaXRlbXMgPSBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYygnLi9zZXJ2ZXIvZGF0YS9pdGVtLWNsYXNzZXMuanNvbicsICd1dGY4JykpO1xyXG5cdFx0dGhpcy5ib3RzID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoJy4vc2VydmVyL2RhdGEvYm90LWNsYXNzZXMuanNvbicsICd1dGY4JykpO1xyXG5cdFx0dGhpcy5zZXJ2ZXJMb2cgPSBbXTtcclxuXHR9XHJcblxyXG5cdGJhY2t1cCgpIHtcclxuXHRcdGNvbnN0IHNlcnZlckxvZyA9IHRoaXMuZ2V0U2VydmVyTG9nKCk7XHJcblx0XHR0aGlzLnNlcnZlckxvZyA9IFtdO1xyXG5cdFx0XHJcblx0XHRjb25zdCBwcm9taXNlTG9nID0gZnMucHJvbWlzZXMud3JpdGVGaWxlKCcuL3NlcnZlci9kYXRhL3NlcnZlcmxvZy5qc29uJywgSlNPTi5zdHJpbmdpZnkoc2VydmVyTG9nKSwgJ3V0ZjgnKTtcclxuXHRcdGNvbnN0IHByb21pc2VQbGF5ZXJzID0gZnMucHJvbWlzZXMud3JpdGVGaWxlKCcuL3NlcnZlci9kYXRhL3BsYXllcnMuanNvbicsIEpTT04uc3RyaW5naWZ5KHRoaXMucGxheWVycyksICd1dGY4Jyk7XHJcblx0XHRjb25zdCBwcm9taXNlTWFwcyA9IGZzLnByb21pc2VzLndyaXRlRmlsZSgnLi9zZXJ2ZXIvZGF0YS9tYXBzLmpzb24nLCBKU09OLnN0cmluZ2lmeSh0aGlzLm1hcHMpLCAndXRmOCcpO1xyXG5cdFx0UHJvbWlzZS5hbGwoW3Byb21pc2VMb2csIHByb21pc2VQbGF5ZXJzLCBwcm9taXNlTWFwc10pXHJcblx0XHQudGhlbih0aGlzLmxvZyhcIkdhbWUgc2F2ZWQgdG8gZGlzay5cIikpXHJcblx0XHQuY2F0Y2goKGVycikgPT4gdGhpcy5sb2coZXJyLm1lc3NhZ2UpKTtcclxuXHR9XHJcblxyXG5cdGxvZyhtZXNzYWdlKSB7XHJcblx0XHRjb25zdCBkYXRlID0gbmV3IERhdGUoKTtcclxuXHRcdGNvbnNvbGUubG9nKHV0aWwudGltZXN0YW1wKGRhdGUpICsgXCIgLSBcIiArIG1lc3NhZ2UpO1xyXG5cdFx0dGhpcy5zZXJ2ZXJMb2cucHVzaCh7XHJcblx0XHRcdG1lc3NhZ2UsXHJcblx0XHRcdGRhdGVcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0Z2V0U2VydmVyTG9nKCkge1xyXG5cdFx0cmV0dXJuIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKCcuL3NlcnZlci9kYXRhL3NlcnZlcmxvZy5qc29uJywgJ3V0ZjgnKSkuY29uY2F0KHRoaXMuc2VydmVyTG9nKTtcclxuXHR9XHJcblxyXG5cdGZpbmQodXNlcm5hbWUpIHtcclxuXHRcdG1vbmdvLmFjY291bnRzLmZpbmRPbmUoe3VzZXJuYW1lOiB1c2VybmFtZX0sIChlcnIsIHJlcykgPT4ge1xyXG5cdFx0XHRpZiAoZXJyKSB0aHJvdyBlcnI7XHJcblx0XHRcdGlmIChyZXMpIHtcclxuXHRcdFx0XHRyZXR1cm4gcmVzO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMubG9nKGBQbGF5ZXIgbm90IGZvdW5kIHdpdGggdXNlcm5hbWU6ICR7dXNlcm5hbWV9YCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0Z2V0UGxheWVyRGF0YShpZCkge1xyXG5cdFx0bGV0IHBsYXllckRhdGEgPSB0aGlzLnBsYXllcnNbaWRdO1xyXG5cclxuXHRcdGlmICghcGxheWVyRGF0YSkgeyAgLy8gRmlyc3QgTG9naW5cclxuXHRcdFx0cGxheWVyRGF0YSA9IHtcclxuXHRcdFx0XHRuYW1lOiBjb25maWcuU1RBUlRfTkFNRSxcclxuXHRcdFx0XHRkZXNjcmlwdGlvbjogXCJcIixcclxuXHRcdFx0XHRzcHJpdGU6IGNvbmZpZy5TVEFSVF9TUFJJVEUsXHJcblx0XHRcdFx0YWRtaW5BY2Nlc3M6IDAsXHJcblx0XHRcdFx0bWFwSWQ6IGNvbmZpZy5TVEFSVF9NQVAsXHJcblx0XHRcdFx0eDogY29uZmlnLlNUQVJUX1gsXHJcblx0XHRcdFx0eTogY29uZmlnLlNUQVJUX1ksXHJcblx0XHRcdFx0ZGFtYWdlQmFzZTogY29uZmlnLlNUQVJUX0RBTUFHRSxcclxuXHRcdFx0XHRkZWZlbmNlQmFzZTogY29uZmlnLlNUQVJUX0RFRkVOQ0UsXHJcblx0XHRcdFx0aGVhbHRoTWF4QmFzZTogY29uZmlnLlNUQVJUX0hFQUxUSF9NQVgsXHJcblx0XHRcdFx0ZW5lcmd5TWF4QmFzZTogY29uZmlnLlNUQVJUX0VORVJHWV9NQVgsXHJcblx0XHRcdFx0cmFuZ2VCYXNlOiBjb25maWcuU1RBUlRfUkFOR0VcclxuXHRcdFx0fTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIHBsYXllckRhdGE7XHJcblx0fVxyXG5cclxuXHRzYXZlUGxheWVyRGF0YShkYXRhKSB7XHJcblx0XHR0aGlzLnBsYXllcnNbZGF0YS5pZF0gPSBkYXRhO1xyXG5cclxuXHRcdGZzLndyaXRlRmlsZSgnLi9zZXJ2ZXIvZGF0YS9wbGF5ZXJzLmpzb24nLCBKU09OLnN0cmluZ2lmeSh0aGlzLnBsYXllcnMpLCAndXRmOCcsIChlcnIpID0+IHtcclxuXHRcdFx0aWYgKGVycikge1xyXG5cdFx0XHRcdHRoaXMubG9nKGVycik7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5sb2coXCJQbGF5ZXIgZGF0YSBiYWNrZWQgdXAuXCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdC8vbW9uZ28ucGxheWVycy5zYXZlKGRhdGEuaWQsIGRhdGEpO1xyXG5cdH1cclxuXHJcblx0Z2V0TWFwRGF0YShtYXBJZCkge1xyXG5cdFx0bGV0IG1hcERhdGEgPSB0aGlzLm1hcHNbbWFwSWRdO1xyXG5cclxuXHRcdGlmICghbWFwRGF0YSkge1xyXG5cdFx0XHRtYXBEYXRhLm5hbWUgPSBcIkJsYW5rIE1hcFwiO1xyXG5cdFx0XHRtYXBEYXRhLml0ZW1zID0gW107XHJcblx0XHRcdG1hcERhdGEuYm90cyA9IFtdO1xyXG5cdFx0XHRtYXBEYXRhLmVmZmVjdHMgPSBbXTtcclxuXHRcdFx0bWFwRGF0YS50ZXh0cyA9IFtdO1xyXG5cdFx0XHRtYXBEYXRhLmRyb3BDaGFuY2UgPSAxMDA7XHJcblx0XHRcdG1hcERhdGEuZHJvcEFtb3VudEVRID0gMTtcclxuXHRcdFx0bWFwRGF0YS50aWxlcyA9IHtcclxuXHRcdFx0XHRsYXllcjogW1xyXG5cdFx0XHRcdFx0W1swLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF1dLFxyXG5cdFx0XHRcdFx0W1swLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF1dLFxyXG5cdFx0XHRcdFx0W1swLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF1dLFxyXG5cdFx0XHRcdFx0W1swLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF1dLFxyXG5cdFx0XHRcdFx0W1swLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF1dLFxyXG5cdFx0XHRcdFx0W1swLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF1dXHJcblx0XHRcdFx0XSxcclxuXHRcdFx0XHR3YWxsOiBbW2ZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2VdLCBbZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZV0sIFtmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlXSwgW2ZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2VdLCBbZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZV0sIFtmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlXSwgW2ZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2VdLCBbZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZV0sIFtmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlXSwgW2ZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2VdLCBbZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZV0sIFtmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlXV0sXHJcblx0XHRcdFx0Y2FuQXR0YWNrOiBbW2ZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2VdLCBbZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZV0sIFtmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlXSwgW2ZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2VdLCBbZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZV0sIFtmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlXSwgW2ZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2VdLCBbZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZV0sIFtmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlXSwgW2ZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2VdLCBbZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZV0sIFtmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlXV0sXHJcblx0XHRcdFx0ZGFtYWdlOiBbWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXV0sXHJcblx0XHRcdFx0ZGVmZW5jZTogW1swLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF1dLFxyXG5cdFx0XHRcdGhlYWx0aE1heDogW1swLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF1dLFxyXG5cdFx0XHRcdHdhcnBNYXA6IFtbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdXSxcclxuXHRcdFx0XHR3YXJwWDogW1swLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF1dLFxyXG5cdFx0XHRcdHdhcnBZOiBbWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXV1cclxuXHRcdFx0fTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gbWFwRGF0YTtcclxuXHR9XHJcblx0XHJcblx0c2F2ZU1hcERhdGEoZGF0YSkge1xyXG5cdFx0dGhpcy5tYXBzW2RhdGEuaWRdID0gZGF0YTtcclxuXHJcblx0XHRmcy53cml0ZUZpbGUoJy4vc2VydmVyL2RhdGEvbWFwcy5qc29uJywgSlNPTi5zdHJpbmdpZnkodGhpcy5tYXBzKSwgJ3V0ZjgnLCAoZXJyKSA9PiB7XHJcblx0XHRcdGlmIChlcnIpIHtcclxuXHRcdFx0XHR0aGlzLmxvZyhlcnIpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMubG9nKFwiTWFwIGRhdGEgYmFja2VkIHVwLlwiKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHQvL21vbmdvLm1hcHMuc2F2ZShkYXRhLmlkLCBkYXRhKTtcclxuXHR9XHJcblxyXG5cdGdldEJvdERhdGEoYm90Q2xhc3MpIHtcclxuXHRcdGxldCBib3REYXRhID0gdGhpcy5ib3RzW2JvdENsYXNzXTtcclxuXHJcblx0XHRpZiAoIWJvdERhdGEpIHsgIC8vIEZpcnN0IExvZ2luXHJcblx0XHRcdGJvdERhdGEgPSB7XHJcblx0XHRcdFx0bmFtZTogY29uZmlnLlNUQVJUX05BTUUsXHJcblx0XHRcdFx0ZGVzY3JpcHRpb246IFwiXCIsXHJcblx0XHRcdFx0c3ByaXRlOiBjb25maWcuU1RBUlRfU1BSSVRFLFxyXG5cdFx0XHRcdG1hcElkOiBjb25maWcuU1RBUlRfTUFQLFxyXG5cdFx0XHRcdHg6IGNvbmZpZy5TVEFSVF9YLFxyXG5cdFx0XHRcdHk6IGNvbmZpZy5TVEFSVF9ZLFxyXG5cdFx0XHRcdGRhbWFnZUJhc2U6IGNvbmZpZy5TVEFSVF9EQU1BR0UsXHJcblx0XHRcdFx0ZGVmZW5jZUJhc2U6IGNvbmZpZy5TVEFSVF9ERUZFTkNFLFxyXG5cdFx0XHRcdGhlYWx0aE1heEJhc2U6IGNvbmZpZy5TVEFSVF9IRUFMVEhfTUFYLFxyXG5cdFx0XHRcdGVuZXJneU1heEJhc2U6IGNvbmZpZy5TVEFSVF9FTkVSR1lfTUFYLFxyXG5cdFx0XHRcdHJhbmdlQmFzZTogY29uZmlnLlNUQVJUX1JBTkdFXHJcblx0XHRcdH07XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiBib3REYXRhO1xyXG5cdH1cclxuXHJcblx0c2F2ZUJvdERhdGEoZGF0YSkge1xyXG5cdFx0dGhpcy5ib3RzW2RhdGEuYm90Q2xhc3NdID0gZGF0YTtcclxuXHJcblx0XHRmcy53cml0ZUZpbGUoJy4vc2VydmVyL2RhdGEvYm90LWNsYXNzZXMuanNvbicsIEpTT04uc3RyaW5naWZ5KHRoaXMuYm90cyksICd1dGY4JywgKGVycikgPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgdGhpcy5sb2coZXJyKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB0aGlzLmxvZyhcIkJvdCBDbGFzcyBkYXRhIGJhY2tlZCB1cC5cIik7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cdH1cclxuXHJcblx0Z2V0SXRlbURhdGEoaXRlbUNsYXNzKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5pdGVtc1tpdGVtQ2xhc3NdO1xyXG5cdH1cclxuXHJcblx0c2F2ZUl0ZW1EYXRhKGRhdGEpIHtcclxuXHRcdHRoaXMuaXRlbXNbZGF0YS5pdGVtQ2xhc3NdID0gZGF0YTtcclxuXHJcblx0XHRmcy53cml0ZUZpbGUoJy4vc2VydmVyL2RhdGEvaXRlbS1jbGFzc2VzLmpzb24nLCBKU09OLnN0cmluZ2lmeSh0aGlzLml0ZW1zKSwgJ3V0ZjgnLCAoZXJyKSA9PiB7XHJcbiAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICB0aGlzLmxvZyhlcnIpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHRoaXMubG9nKFwiSXRlbSBDbGFzcyBkYXRhIGJhY2tlZCB1cC5cIik7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cdH1cclxufVxyXG5cclxuY29uc3QgZGIgPSBuZXcgRGF0YWJhc2UoKTtcclxuZXhwb3J0IGRlZmF1bHQgZGI7XHJcbiIsImltcG9ydCBmcyBmcm9tICdmcyc7XHJcblxyXG5pbXBvcnQgZGIgZnJvbSAnLi9kYi5qcyc7XHJcbmltcG9ydCBjb25maWcgZnJvbSAnLi9jb25maWcuanMnO1xyXG5pbXBvcnQgdXRpbCBmcm9tICcuL3V0aWwuanMnO1xyXG5pbXBvcnQgTWFwIGZyb20gJy4vY2xhc3Nlcy9tYXAuanMnO1xyXG5pbXBvcnQgUGxheWVyIGZyb20gJy4vY2xhc3Nlcy9wbGF5ZXIuanMnO1xyXG5pbXBvcnQgQm90IGZyb20gJy4vY2xhc3Nlcy9ib3QuanMnO1xyXG5pbXBvcnQgSXRlbSBmcm9tICcuL2NsYXNzZXMvaXRlbS5qcyc7XHJcbmltcG9ydCBFZmZlY3QgZnJvbSAnLi9jbGFzc2VzL2VmZmVjdC5qcyc7XHJcbmltcG9ydCBUZXh0IGZyb20gJy4vY2xhc3Nlcy90ZXh0LmpzJztcclxuaW1wb3J0IE1lc3NhZ2UgZnJvbSAnLi9jbGFzc2VzL21lc3NhZ2UuanMnO1xyXG5cclxuY2xhc3MgR2FtZSB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHR0aGlzLnBsYXllckxpc3QgPSBbXTtcclxuXHRcdHRoaXMubWFwTGlzdCA9IFtdO1xyXG5cdFx0dGhpcy5tZXNzYWdlUXVldWUgPSBbXTtcclxuXHJcblx0XHQvLyBDcmVhdGUgTWFwc1xyXG5cdFx0dGhpcy5tYXBEYXRhID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoJy4vc2VydmVyL2RhdGEvbWFwcy5qc29uJywgJ3V0ZjgnKSk7XHJcblx0XHRmb3IgKGxldCBpZCA9IDA7IGlkIDwgY29uZmlnLk1BWF9NQVBTOyBpZCsrKSB7XHJcblx0XHRcdHRoaXMubWFwTGlzdFtpZF0gPSBuZXcgTWFwKGlkLCB0aGlzLm1hcERhdGFbaWRdKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHVwZGF0ZShkZWx0YSkge1xyXG5cdFx0bGV0IHBhY2sgPSB7XHJcblx0XHRcdHBsYXllcnM6IFtdLFxyXG5cdFx0XHRtYXBzOiBbXSxcclxuXHRcdFx0bWVzc2FnZXM6IHRoaXMubWVzc2FnZVF1ZXVlXHJcblx0XHR9O1xyXG5cdFx0dGhpcy5tZXNzYWdlUXVldWUgPSBbXTtcclxuXHJcblx0XHR0aGlzLnBsYXllckxpc3QuZm9yRWFjaCgocGxheWVyKSA9PiB7XHJcblx0XHRcdHBhY2sucGxheWVyc1twbGF5ZXIuaWRdID0gcGxheWVyLnVwZGF0ZShkZWx0YSk7XHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdFx0dGhpcy5tYXBMaXN0LmZvckVhY2goKG1hcCkgPT4ge1xyXG5cdFx0XHRwYWNrLm1hcHNbbWFwLmlkXSA9IG1hcC51cGRhdGUoZGVsdGEpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIHBhY2s7XHJcblx0fVxyXG5cclxuXHQvLyBQbGF5ZXJzXHJcblx0cGxheWVyTG9naW4oaWQpIHtcclxuXHRcdGNvbnN0IHBsYXllciA9IG5ldyBQbGF5ZXIoaWQpO1xyXG5cdFx0dGhpcy5wbGF5ZXJMaXN0W2lkXSA9IHBsYXllcjtcclxuXHRcdHRoaXMuc2VuZEdhbWVJbmZvR2xvYmFsKGAke3BsYXllci5uYW1lfSBoYXMgbG9nZ2VkIGluLmApO1xyXG5cdFx0cmV0dXJuIHBsYXllcjtcclxuXHR9XHJcblx0XHJcblx0cGxheWVyTG9nb3V0KGlkKSB7XHJcblx0XHRsZXQgcGxheWVyID0gdGhpcy5wbGF5ZXJMaXN0W2lkXTtcclxuXHRcdGlmIChwbGF5ZXIpIHtcclxuXHRcdFx0ZGIuc2F2ZVBsYXllckRhdGEocGxheWVyLmdldFBhY2spO1xyXG5cdFx0XHR0aGlzLnNlbmRHYW1lSW5mb0dsb2JhbChgJHtwbGF5ZXIubmFtZX0gaGFzIGxvZ2dlZCBvdXQuYCk7XHJcblx0XHRcdGRlbGV0ZSB0aGlzLm1hcExpc3RbcGxheWVyLm1hcElkXS50ZXh0c1twbGF5ZXIuZGlzcGxheU5hbWVJZF07XHJcblx0XHRcdGRlbGV0ZSB0aGlzLnBsYXllckxpc3RbaWRdO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gR2FtZSBJbmZvXHJcblx0c2VuZEdhbWVJbmZvR2xvYmFsKG1lc3NhZ2UpIHtcclxuXHRcdHRoaXMubWVzc2FnZVF1ZXVlLnB1c2gobmV3IE1lc3NhZ2UobnVsbCwgbWVzc2FnZSwgJ2dhbWVJbmZvJykpO1xyXG5cdH1cclxuXHRzZW5kR2FtZUluZm9NYXAobWFwSWQsIG1lc3NhZ2UpIHtcclxuXHRcdHRoaXMubWVzc2FnZVF1ZXVlLnB1c2gobmV3IE1lc3NhZ2UobnVsbCwgbWVzc2FnZSwgJ2dhbWVJbmZvJywgbWFwSWQpKTtcclxuXHR9XHJcblx0c2VuZEdhbWVJbmZvUGxheWVyKGlkLCBtZXNzYWdlKSB7XHJcblx0XHR0aGlzLm1lc3NhZ2VRdWV1ZS5wdXNoKG5ldyBNZXNzYWdlKG51bGwsIG1lc3NhZ2UsICdnYW1lSW5mbycsIG51bGwsIGlkKSk7XHJcblx0fVxyXG5cdFxyXG5cdC8vIENoYXQgTWVzc2FnZXNcclxuXHRzZW5kTWVzc2FnZUdsb2JhbChzZW5kZXJJZCwgbWVzc2FnZSkge1xyXG5cdFx0dGhpcy5tZXNzYWdlUXVldWUucHVzaChuZXcgTWVzc2FnZShzZW5kZXJJZCwgbWVzc2FnZSwgJ21lc3NhZ2VHbG9iYWwnKSk7XHJcblx0fVxyXG5cdHNlbmRNZXNzYWdlTWFwKHNlbmRlcklkLCBtYXBJZCwgbWVzc2FnZSkge1xyXG5cdFx0dGhpcy5tZXNzYWdlUXVldWUucHVzaChuZXcgTWVzc2FnZShzZW5kZXJJZCwgbWVzc2FnZSwgJ21lc3NhZ2VNYXAnLCBtYXBJZCkpO1xyXG5cdH1cclxuXHRzZW5kTWVzc2FnZVBsYXllcihzZW5kZXJJZCwgaWQsIG1lc3NhZ2UpIHtcclxuXHRcdHRoaXMubWVzc2FnZVF1ZXVlLnB1c2gobmV3IE1lc3NhZ2Uoc2VuZGVySWQsIG1lc3NhZ2UsICdtZXNzYWdlUGxheWVyJywgbnVsbCwgaWQpKTtcclxuXHR9XHJcblxyXG5cdC8vIE1hcFxyXG5cdGlzVmFjYW50KG1hcElkLCB4LCB5KSB7XHJcblx0XHQvLyBDaGVjayBmb3IgTWFwIEVkZ2VzXHJcblx0XHRpZiAoeCA8IDAgfHwgeCA+PSBjb25maWcuTUFQX0NPTFVNTlMpIHJldHVybiBmYWxzZTtcclxuXHRcdGlmICh5IDwgMCB8fCB5ID49IGNvbmZpZy5NQVBfUk9XUykgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHJcblx0XHRsZXQgbWFwID0gdGhpcy5tYXBMaXN0W21hcElkXTtcclxuXHRcdFxyXG5cdFx0Ly8gQ2hlY2sgZm9yIFdhbGwgVGlsZXNcclxuXHRcdGlmIChtYXAudGlsZXMud2FsbFt5XVt4XSA9PT0gdHJ1ZSkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHJcblx0XHQvLyBDaGVjayBmb3IgQm90c1xyXG5cdFx0bGV0IGJvdHMgPSBtYXAuYm90cy5maWx0ZXIoKGJvdCkgPT4ge1xyXG5cdFx0XHRpZiAoYm90LnggPT09IHggJiYgYm90LnkgPT09IHkgJiYgIWJvdC5pc0RlYWQpIHJldHVybiB0cnVlO1xyXG5cdFx0fSk7XHJcblx0XHRpZiAoYm90cy5sZW5ndGggPiAwKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcclxuXHRcdC8vIENoZWNrIGZvciBQbGF5ZXJzXHJcblx0XHRsZXQgcGxheWVycyA9IHRoaXMucGxheWVyTGlzdC5maWx0ZXIoKHBsYXllcikgPT4ge1xyXG5cdFx0XHRpZiAocGxheWVyLm1hcElkID09PSBtYXAuaWQgJiYgcGxheWVyLnggPT09IHggJiYgcGxheWVyLnkgPT09IHkgJiYgIXBsYXllci5pc0RlYWQpIHJldHVybiB0cnVlO1xyXG5cdFx0fSk7XHJcblx0XHRpZiAocGxheWVycy5sZW5ndGggPiAwKSByZXR1cm4gZmFsc2U7XHJcblxyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cclxuXHRzcGF3bkJvdChtYXBJZCwgeCwgeSwgYm90Q2xhc3MpIHtcclxuXHRcdG5ldyBCb3Qoe1xyXG5cdFx0XHRtYXBJZCxcclxuXHRcdFx0eCxcclxuXHRcdFx0eSxcclxuXHRcdFx0Ym90Q2xhc3NcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRcclxuXHRzcGF3bk1hcEl0ZW0obWFwSWQsIHgsIHksIGl0ZW1DbGFzcywgc3RhY2sgPSAwKSB7XHJcblx0XHRuZXcgSXRlbSh7XHJcblx0XHRcdG93bmVyOiAnbWFwJyxcclxuXHRcdFx0bWFwSWQsXHJcblx0XHRcdGlkOiB1dGlsLmZpcnN0RW1wdHlJbmRleCh0aGlzLm1hcExpc3RbbWFwSWRdLml0ZW1zKSxcclxuXHRcdFx0eCxcclxuXHRcdFx0eSxcclxuXHRcdFx0aXRlbUNsYXNzLFxyXG5cdFx0XHRzdGFja1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRzcGF3bkRhbWFnZVRleHQobWFwSWQsIHgsIHksIGRhbWFnZSkge1xyXG5cdFx0bmV3IFRleHQobWFwSWQsIHgsIHkgKyAwLjUsIGRhbWFnZSwgJyNmZjAwMDAnLCAxLjI1LCAwLCAtMSk7XHJcblx0fVxyXG5cclxuXHRzcGF3bkVmZmVjdChtYXBJZCwgeCwgeSwgc3ByaXRlLCBsb29wLCBzcGVlZCwgbWF4RnJhbWUsIHN0YXJ0RnJhbWUpIHtcclxuXHRcdG5ldyBFZmZlY3QobWFwSWQsIHgsIHksIHNwcml0ZSwgbG9vcCwgc3BlZWQsIG1heEZyYW1lLCBzdGFydEZyYW1lKTtcclxuXHR9XHJcbn1cclxuXHJcbmNvbnN0IGdhbWUgPSBuZXcgR2FtZSgpO1xyXG5leHBvcnQgZGVmYXVsdCBnYW1lO1xyXG4iLCIvKioqIEdhbWUgTG9vcCAqKiovXHJcbi8qIEtlZXBzIHRyYWNrIG9mIHRpbWUgYW5kIGNvLW9yZGluYXRlcyB0aGUgZ2FtZSBhbmQgc2VydmVyICovXHJcblxyXG5pbXBvcnQgTm9kZUdhbWVMb29wIGZyb20gJ25vZGUtZ2FtZWxvb3AnO1xyXG5cclxuaW1wb3J0IGRiIGZyb20gJy4vZGIuanMnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuL2dhbWUuanMnO1xyXG5pbXBvcnQgc2VydmVyIGZyb20gJy4vc2VydmVyLmpzJztcclxuaW1wb3J0IGNvbmZpZyBmcm9tICcuL2NvbmZpZy5qcyc7XHJcblxyXG5jbGFzcyBHYW1lTG9vcCB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHR0aGlzLnRpbWVyID0ge1xyXG5cdFx0XHRiYWNrdXA6IDAsXHJcblx0XHRcdG1pbnV0ZTogMFxyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLmlkID0gTm9kZUdhbWVMb29wLnNldEdhbWVMb29wKChkZWx0YSkgPT4gdGhpcy51cGRhdGUoZGVsdGEpLCBjb25maWcuRlJBTUVSQVRFKTtcclxuXHR9XHJcblxyXG5cdHVwZGF0ZShkZWx0YSkge1xyXG5cdFx0Ly8gSW5jcmVhc2UgVGltZXJzXHJcblx0XHR0aGlzLnRpbWVyLmJhY2t1cCArPSBkZWx0YTtcclxuXHRcdHRoaXMudGltZXIubWludXRlICs9IGRlbHRhO1xyXG5cclxuXHRcdC8vIFVwZGF0ZSB0aGUgZ2FtZSBzdGF0ZVxyXG5cdFx0bGV0IHVwZGF0ZVBhY2sgPSBnYW1lLnVwZGF0ZShkZWx0YSk7XHJcblx0XHQvLyBTZW5kIHVwZGF0ZWQgc3RhdGUgdG8gY2xpZW50c1xyXG5cdFx0c2VydmVyLnNlbmRVcGRhdGVQYWNrKHVwZGF0ZVBhY2spO1xyXG5cdFx0XHJcblx0XHQvLyBNaW51dGUgdGltZXIgc2NyaXB0XHJcblx0XHRpZiAodGhpcy50aW1lci5taW51dGUgPj0gNjApIHtcclxuXHRcdFx0dGhpcy50aW1lci5taW51dGUgLT0gNjA7XHJcblx0XHRcdC8vIFRPRE86IHJ1biBtaW51dGUgdGltZXIgc2NyaXB0XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gUGVyaW9kaWMgYmFja3VwIHRvIGRhdGFiYXNlXHJcblx0XHRpZiAodGhpcy50aW1lci5iYWNrdXAgPj0gY29uZmlnLkJBQ0tVUF9USU1FKSB7XHJcblx0XHRcdHRoaXMudGltZXIuYmFja3VwIC09IGNvbmZpZy5CQUNLVVBfVElNRTtcclxuXHRcdFx0ZGIuYmFja3VwKCk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5jb25zdCBnYW1lTG9vcCA9IG5ldyBHYW1lTG9vcCgpO1xyXG5leHBvcnQgZGVmYXVsdCBnYW1lTG9vcDtcclxuIiwiaW1wb3J0IGRiIGZyb20gJy4vZGIuanMnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuL2dhbWUuanMnO1xyXG5pbXBvcnQgc2VydmVyIGZyb20gJy4vc2VydmVyLmpzJztcclxuaW1wb3J0IGdhbWVsb29wIGZyb20gJy4vZ2FtZWxvb3AuanMnO1xyXG4iLCJpbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcclxuaW1wb3J0IGh0dHAgZnJvbSAnaHR0cCc7XHJcbmltcG9ydCBzb2NrZXRJTyBmcm9tICdzb2NrZXQuaW8nO1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuXHJcbmltcG9ydCBkYiBmcm9tICcuL2RiLmpzJztcclxuaW1wb3J0IGdhbWUgZnJvbSAnLi9nYW1lLmpzJztcclxuaW1wb3J0IGNvbmZpZyBmcm9tICcuL2NvbmZpZy5qcyc7XHJcbmltcG9ydCB1dGlsIGZyb20gJy4vdXRpbC5qcyc7XHJcblxyXG5jbGFzcyBTZXJ2ZXIge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0Y29uc3QgYXBwID0gZXhwcmVzcygpO1xyXG5cdFx0Y29uc3QgaHR0cFNlcnZlciA9IGh0dHAuU2VydmVyKGFwcCk7XHJcblx0XHRjb25zdCBpbyA9IHNvY2tldElPKGh0dHBTZXJ2ZXIpO1xyXG5cdFx0Y29uc3QgcG9ydCA9IHByb2Nlc3MuZW52LlBPUlQgfHwgY29uZmlnLlBPUlQ7XHJcblx0XHRjb25zdCBwdWJsaWNQYXRoID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uL2NsaWVudCcpO1xyXG5cdFx0XHJcblx0XHRhcHAuZ2V0KCcvJywgKHJlcSwgcmVzKSA9PiByZXMuc2VuZEZpbGUocHVibGljUGF0aCArICcvaW5kZXguaHRtbCcpKTtcclxuXHRcdGFwcC51c2UoJy9jbGllbnQnLCBleHByZXNzLnN0YXRpYyhwdWJsaWNQYXRoKSk7XHJcblx0XHRodHRwU2VydmVyLmxpc3Rlbihwb3J0LCAoKSA9PiBkYi5sb2coYFNlcnZlciBzdGFydGVkLiBMaXN0ZW5pbmcgb24gcG9ydCAke2h0dHBTZXJ2ZXIuYWRkcmVzcygpLnBvcnR9Li4uYCkpO1xyXG5cclxuXHRcdHRoaXMuc29ja2V0TGlzdCA9IFtdO1xyXG5cdFx0aW8uc29ja2V0cy5vbignY29ubmVjdGlvbicsIChzb2NrZXQpID0+IHRoaXMub25Db25uZWN0KHNvY2tldCkpO1xyXG5cdH1cclxuXHJcblx0Ly8gUmVjZWl2ZSBkYXRhIGZyb20gY2xpZW50c1xyXG5cdG9uQ29ubmVjdChzb2NrZXQpIHtcclxuXHRcdHNvY2tldC5pZCA9IHV0aWwuZmlyc3RFbXB0eUluZGV4KHRoaXMuc29ja2V0TGlzdCk7XHJcblx0XHR0aGlzLnNvY2tldExpc3Rbc29ja2V0LmlkXSA9IHNvY2tldDtcclxuXHRcdGRiLmxvZyhgTmV3IENvbm5lY3Rpb246IElkICR7c29ja2V0LmlkfWApO1xyXG5cdFx0XHJcblx0XHRzb2NrZXQub24oJ2Rpc2Nvbm5lY3QnLCAoKSA9PiB0aGlzLm9uRGlzY29ubmVjdChzb2NrZXQuaWQpKTtcclxuXHRcdHNvY2tldC5vbignbG9naW4nLCAoKSA9PiB0aGlzLm9uTG9naW4oc29ja2V0LmlkKSk7XHJcblx0XHRzb2NrZXQub24oJ2xvZ291dCcsICgpID0+IHRoaXMub25Mb2dvdXQoc29ja2V0LmlkKSk7XHJcblx0fVxyXG5cclxuXHRvbkRpc2Nvbm5lY3QoaWQpIHtcclxuXHRcdGlmIChnYW1lLnBsYXllckxpc3RbaWRdKSB7XHJcblx0XHRcdGdhbWUucGxheWVyTG9nb3V0KGlkKTtcclxuXHRcdH1cclxuXHRcdGRlbGV0ZSB0aGlzLnNvY2tldExpc3RbaWRdO1xyXG5cdFx0ZGIubG9nKGBEaXNjb25uZWN0ZWQ6IElkICR7aWR9YCk7XHJcblx0fVxyXG5cclxuXHRvbkxvZ2luKGlkKSB7XHJcblx0XHQvLyBDcmVhdGUgUGxheWVyXHJcblx0XHRsZXQgcGxheWVyID0gZ2FtZS5wbGF5ZXJMb2dpbihpZCk7XHJcblx0XHRcclxuXHRcdC8vIFJlY2VpdmUgSW5wdXRzXHJcblx0XHRsZXQgc29ja2V0ID0gdGhpcy5zb2NrZXRMaXN0W2lkXTtcclxuXHRcdHNvY2tldC5vbignaW5wdXQnLCAoZGF0YSkgPT4gdGhpcy5vbklucHV0KHBsYXllciwgZGF0YSkpO1xyXG5cclxuXHRcdC8vIFNlbmQgTWFwIERhdGFcclxuXHRcdHRoaXMuc2VuZE1hcERhdGEocGxheWVyLmlkLCBwbGF5ZXIubWFwSWQpO1xyXG5cdH1cclxuXHRcclxuXHRvbkxvZ291dChpZCkge1xyXG5cdFx0Z2FtZS5wbGF5ZXJMb2dvdXQoaWQpO1xyXG5cdH1cclxuXHRcclxuXHRhc3luYyBvbklucHV0KHBsYXllciwgZGF0YSkge1xyXG5cdFx0c3dpdGNoIChkYXRhLmlucHV0KSB7XHJcblx0XHRcdGNhc2UgbnVsbDpcclxuXHRcdFx0Y2FzZSAnbW92ZSc6IHBsYXllci5pbnB1dC5kaXJlY3Rpb24gPSBkYXRhLmRpcmVjdGlvbjtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ3J1bic6IHBsYXllci5pbnB1dC5ydW4gPSBkYXRhLnN0YXRlO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAncGlja3VwJzpcclxuXHRcdFx0XHRpZiAoIXBsYXllci5pbnB1dC5waWNrdXAgJiYgZGF0YS5zdGF0ZSkge1xyXG5cdFx0XHRcdFx0cGxheWVyLnBpY2tVcCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRwbGF5ZXIuaW5wdXQucGlja3VwID0gZGF0YS5zdGF0ZTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ2F0dGFjayc6XHJcblx0XHRcdHBsYXllci5pbnB1dC5hdHRhY2sgPSBkYXRhLnN0YXRlO1xyXG5cdFx0XHRcdGlmICghcGxheWVyLmlzRGVhZCkgcGxheWVyLmF0dGFjaygxLCBwbGF5ZXIuZGlyZWN0aW9uKTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ2RvdWJsZUNsaWNrSXRlbSc6XHJcblx0XHRcdFx0aWYgKHBsYXllci5pbnZlbnRvcnlbZGF0YS5zbG90XSkge1xyXG5cdFx0XHRcdFx0aWYgKCFwbGF5ZXIuaXNEZWFkKSBwbGF5ZXIudXNlSXRlbShkYXRhLnNsb3QpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ3JpZ2h0Q2xpY2tJdGVtJzpcclxuXHRcdFx0XHRpZiAocGxheWVyLmludmVudG9yeVtkYXRhLnNsb3RdKSB7XHJcblx0XHRcdFx0XHRpZiAoIXBsYXllci5pc0RlYWQpIHBsYXllci5kcm9wSXRlbShkYXRhLnNsb3QpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ2RyYWdTdG9wR2FtZSc6XHJcblx0XHRcdFx0aWYgKHBsYXllci5pbnZlbnRvcnlbZGF0YS5zbG90XSkge1xyXG5cdFx0XHRcdFx0aWYgKCFwbGF5ZXIuaXNEZWFkKSBwbGF5ZXIuZHJvcEl0ZW0oZGF0YS5zbG90KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdkcmFnU3RvcEludmVudG9yeSc6XHJcblx0XHRcdGNhc2UgJ2RyYWdTdG9wRXF1aXBtZW50JzpcclxuXHRcdFx0XHRpZiAocGxheWVyLmludmVudG9yeVtkYXRhLnNsb3RdKSB7XHJcblx0XHRcdFx0XHRpZiAoIXBsYXllci5pc0RlYWQpIHBsYXllci5tb3ZlSXRlbVRvU2xvdChkYXRhLnNsb3QsIGRhdGEubmV3U2xvdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnc2VydmVyQ2hhdCc6IGdhbWUuc2VuZE1lc3NhZ2VHbG9iYWwocGxheWVyLmlkLCBgJHtwbGF5ZXIubmFtZX0geWVsbHMsIFwiJHtkYXRhLm1lc3NhZ2V9XCJgKTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ21hcENoYXQnOiBnYW1lLnNlbmRNZXNzYWdlTWFwKHBsYXllci5pZCwgcGxheWVyLm1hcElkLCBgJHtwbGF5ZXIubmFtZX0gc2F5cywgXCIke2RhdGEubWVzc2FnZX1cImApO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAncGxheWVyQ2hhdCc6XHJcblx0XHRcdFx0bGV0IHRhcmdldCA9IHBsYXllci5wbGF5ZXJMaXN0W2RhdGEudGFyZ2V0SWRdO1xyXG5cdFx0XHRcdGlmICh0YXJnZXQpIHtcclxuXHRcdFx0XHRcdGdhbWUuc2VuZE1lc3NhZ2VQbGF5ZXIocGxheWVyLmlkLCB0YXJnZXQuaWQsIGAke3BsYXllci5uYW1lfSB3aGlzcGVycywgXCIke2RhdGEubWVzc2FnZX1cImApO1xyXG5cdFx0XHRcdFx0Z2FtZS5zZW5kTWVzc2FnZVBsYXllcihwbGF5ZXIuaWQsIHBsYXllci5pZCwgYFlvdSB3aGlzcGVyIHRvICR7dGFyZ2V0Lm5hbWV9LCBcIiR7ZGF0YS5tZXNzYWdlfVwiYCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHJcblx0XHRcdC8vIEdvZCBJbnB1dHNcclxuXHRcdFx0Y2FzZSAnc3Bhd25NYXBJdGVtJzpcclxuXHRcdFx0XHRpZiAocGxheWVyLmFkbWluQWNjZXNzID49IDIpIHtcclxuXHRcdFx0XHRcdGdhbWUuc3Bhd25NYXBJdGVtKGRhdGEuYXJnc1swXSwgZGF0YS5hcmdzWzFdLCBkYXRhLmFyZ3NbMl0sIGRhdGEuYXJnc1szXSwgZGF0YS5hcmdzWzRdKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRnYW1lLnNlbmRHYW1lSW5mb1BsYXllcihwbGF5ZXIuaWQsIGBZb3UgZG9uJ3QgaGF2ZSBhY2Nlc3MgdG8gdGhhdCBjb21tYW5kLmApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ3NwYXduQm90JzpcclxuXHRcdFx0XHRpZiAocGxheWVyLmFkbWluQWNjZXNzID49IDIpIHtcclxuXHRcdFx0XHRcdGdhbWUuc3Bhd25Cb3QoZGF0YS5hcmdzWzBdLCBkYXRhLmFyZ3NbMV0sIGRhdGEuYXJnc1syXSwgZGF0YS5hcmdzWzNdKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRnYW1lLnNlbmRHYW1lSW5mb1BsYXllcihwbGF5ZXIuaWQsIGBZb3UgZG9uJ3QgaGF2ZSBhY2Nlc3MgdG8gdGhhdCBjb21tYW5kLmApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ3VwbG9hZE1hcCc6XHJcblx0XHRcdFx0aWYgKHBsYXllci5hZG1pbkFjY2VzcyA+PSAyKSB7XHJcblx0XHRcdFx0XHRhd2FpdCBkYi5zYXZlTWFwRGF0YShkYXRhKTtcclxuXHRcdFxyXG5cdFx0XHRcdFx0Z2FtZS5wbGF5ZXJMaXN0LmZvckVhY2goKHBsYXllcikgPT4ge1xyXG5cdFx0XHRcdFx0XHRpZiAocGxheWVyLm1hcElkID09PSBkYXRhLmlkKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5zZW5kTWFwRGF0YShwbGF5ZXIuaWQsIHBsYXllci5tYXBJZCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdGdhbWUuc2VuZEdhbWVJbmZvUGxheWVyKHBsYXllci5pZCwgYFlvdSBkb24ndCBoYXZlIGFjY2VzcyB0byB0aGF0IGNvbW1hbmQuYCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIFNlbmQgZGF0YSB0byBjbGllbnRzXHJcblx0c2VuZFVwZGF0ZVBhY2sodXBkYXRlUGFjaykge1xyXG5cdFx0Z2FtZS5wbGF5ZXJMaXN0LmZvckVhY2goKHBsYXllcikgPT4ge1xyXG5cdFx0XHRsZXQgcGFjayA9IHt9O1xyXG5cdFx0XHRcclxuXHRcdFx0cGFjay5nYW1lID0gdXBkYXRlUGFjay5tYXBzW3BsYXllci5tYXBJZF07XHJcblx0XHRcdHBhY2suZ2FtZS5wbGF5ZXJzID0gdXBkYXRlUGFjay5wbGF5ZXJzLmZpbHRlcigocGxheWVyRGF0YSkgPT4ge1xyXG5cdFx0XHRcdHJldHVybiAocGxheWVyRGF0YS5tYXBJZCA9PT0gcGxheWVyLm1hcElkICYmIChwbGF5ZXJEYXRhLmlzVmlzaWJsZSB8fCBwbGF5ZXJEYXRhLmlkID09PSBwbGF5ZXIuaWQpKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRwYWNrLnVpID0gcGxheWVyLmdldFByaXZhdGVQYWNrKCk7XHJcblx0XHRcdHBhY2sudWkubWVzc2FnZXMgPSB1cGRhdGVQYWNrLm1lc3NhZ2VzLmZpbHRlcigobWVzc2FnZSkgPT4ge1xyXG5cdFx0XHRcdHJldHVybiAoKG1lc3NhZ2UubWFwSWQgPT0gbnVsbCAmJiBtZXNzYWdlLmlkID09IG51bGwpIHx8IHBsYXllci5tYXBJZCA9PT0gbWVzc2FnZS5tYXBJZCB8fCBwbGF5ZXIuaWQgPT09IG1lc3NhZ2UuaWQpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdGxldCBzb2NrZXQgPSB0aGlzLnNvY2tldExpc3RbcGxheWVyLmlkXTtcclxuXHRcdFx0c29ja2V0LmVtaXQoJ3VwZGF0ZScsIHBhY2spO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdFxyXG5cdHNlbmRNYXBEYXRhKGlkLCBtYXBJZCkge1xyXG5cdFx0bGV0IHNvY2tldCA9IHRoaXMuc29ja2V0TGlzdFtpZF07XHJcblx0XHRzb2NrZXQuZW1pdCgnbG9hZE1hcCcsIGRiLmdldE1hcERhdGEobWFwSWQpKTtcclxuXHR9XHJcblxyXG59XHJcblxyXG5jb25zdCBzZXJ2ZXIgPSBuZXcgU2VydmVyKCk7XHJcbmV4cG9ydCBkZWZhdWx0IHNlcnZlcjtcclxuIiwiZnVuY3Rpb24gc2h1ZmZsZShhcnJheSkge1xyXG4gIGxldCBjdXJyZW50SW5kZXggPSBhcnJheS5sZW5ndGg7XHJcbiAgbGV0IHRlbXA7XHJcbiAgbGV0IHJhbmRvbUluZGV4O1xyXG4gIHdoaWxlIChjdXJyZW50SW5kZXggIT09IDApIHtcclxuICAgIHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY3VycmVudEluZGV4KTtcclxuICAgIGN1cnJlbnRJbmRleCAtPSAxO1xyXG4gICAgdGVtcCA9IGFycmF5W2N1cnJlbnRJbmRleF07XHJcbiAgICBhcnJheVtjdXJyZW50SW5kZXhdID0gYXJyYXlbcmFuZG9tSW5kZXhdO1xyXG4gICAgYXJyYXlbcmFuZG9tSW5kZXhdID0gdGVtcDtcclxuICB9XHJcbiAgcmV0dXJuIGFycmF5O1xyXG59XHJcblxyXG5mdW5jdGlvbiBzd2FwKGFycmF5LCBpLCBqKSB7XHJcbiAgbGV0IHRlbXAgPSBhcnJheVtpXTtcclxuICBhcnJheVtpXSA9IGFycmF5W2pdO1xyXG4gIGFycmF5W2pdID0gdGVtcDtcclxufVxyXG5cclxuZnVuY3Rpb24gZmlyc3RFbXB0eUluZGV4KGFycmF5KSB7XHJcbiAgaWYgKGFycmF5Lmxlbmd0aCA8IDEpIHJldHVybiAwO1xyXG4gIFxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDw9IGFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICBpZiAoYXJyYXlbaV0gPT0gbnVsbCkgcmV0dXJuIGk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBsZXJwKHN0YXJ0LCBlbmQsIHRpbWUpIHtcclxuICAvL3JldHVybiBzdGFydCArICh0aW1lICogKGVuZCAtIHN0YXJ0KSk7XHJcbiAgcmV0dXJuICgoMSAtIHRpbWUpICogc3RhcnQpICsgKHRpbWUgKiBlbmQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjbGFtcCh2YWx1ZSwgbWluaW11bSwgbWF4aW11bSkge1xyXG4gIGlmICh2YWx1ZSA8IG1pbmltdW0pIHtcclxuICAgIHJldHVybiBtaW5pbXVtO1xyXG4gIH1cclxuICBlbHNlIGlmICh2YWx1ZSA+IG1heGltdW0pIHtcclxuICAgIHJldHVybiBtYXhpbXVtO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHJldHVybiB2YWx1ZTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJhbmRvbUludChtaW5pbXVtLCBtYXhpbXVtKSB7XHJcbiAgcmV0dXJuIE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiAobWF4aW11bSArIDEpKSArIG1pbmltdW0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRYRnJvbUluZGV4KGluZGV4LCBjb2x1bW5zKSB7XHJcbiAgcmV0dXJuIGluZGV4ICUgY29sdW1ucztcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0WUZyb21JbmRleChpbmRleCwgY29sdW1ucykge1xyXG4gIHJldHVybiAoaW5kZXggLSAoaW5kZXggJSBjb2x1bW5zKSkgLyBjb2x1bW5zO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRJbmRleEZyb21YWSh4LCB5LCBjb2x1bW5zKSB7XHJcbiAgcmV0dXJuICh5ICogY29sdW1ucykgKyB4O1xyXG59XHJcblxyXG5mdW5jdGlvbiB0aW1lc3RhbXAoZGF0ZSkge1xyXG4gIGlmICghKGRhdGUgaW5zdGFuY2VvZiBEYXRlKSkgcmV0dXJuIFwiSW52YWxpZCBkYXRlXCI7XHJcbiAgbGV0IG1vbnRoID0gZGF0ZS5nZXRNb250aCgpICsgMTtcclxuICBsZXQgZGF5ID0gZGF0ZS5nZXREYXRlKCk7XHJcbiAgbGV0IGhvdXIgPSBkYXRlLmdldEhvdXJzKCk7XHJcbiAgbGV0IG1pbnV0ZSA9IGRhdGUuZ2V0TWludXRlcygpO1xyXG4gIGxldCBzZWNvbmQgPSBkYXRlLmdldFNlY29uZHMoKTtcclxuICBpZiAobW9udGggPCAxMCkgbW9udGggPSBcIjBcIiArIG1vbnRoO1xyXG4gIGlmIChkYXkgPCAxMCkgZGF5ID0gXCIwXCIgKyBkYXk7XHJcbiAgaWYgKGhvdXIgPCAxMCkgaG91ciA9IFwiMFwiICsgaG91cjtcclxuICBpZiAobWludXRlIDwgMTApIG1pbnV0ZSA9IFwiMFwiICsgbWludXRlO1xyXG4gIGlmIChzZWNvbmQgPCAxMCkgc2Vjb25kID0gXCIwXCIgKyBzZWNvbmQ7XHJcbiAgcmV0dXJuIGAke2RhdGUuZ2V0RnVsbFllYXIoKX0tJHttb250aH0tJHtkYXl9ICR7aG91cn06JHttaW51dGV9OiR7c2Vjb25kfWA7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluZGVmaW5pdGVBcnRpY2xlKHdvcmQpIHtcclxuXHRsZXQgcmVnZXggPSAvdHJvdXNlcnMkfGplYW5zJHxnbGFzc2VzJC9pO1xyXG5cdGlmICh3b3JkLm1hdGNoKHJlZ2V4KSkgcmV0dXJuIFwiYSBwYWlyIG9mIFwiICsgd29yZDtcclxuXHJcblx0cmVnZXggPSAvXlthZWlvdV0vaTtcclxuXHRpZiAod29yZC5tYXRjaChyZWdleCkpIHJldHVybiBcImFuIFwiICsgd29yZDtcclxuXHJcblx0cmV0dXJuIFwiYSBcIiArIHdvcmQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBsdXJhbCh3b3JkKSB7XHJcblx0bGV0IHJlZ2V4ID0gL3NoZWVwJHxkZWVyJHxmaXNoJC9pO1xyXG5cdGlmICh3b3JkLm1hdGNoKHJlZ2V4KSkgcmV0dXJuIHdvcmQ7XHJcblxyXG5cdHJlZ2V4ID0gL3Ryb3VzZXJzJHxqZWFucyR8Z2xhc3NlcyQvaTtcclxuXHRpZiAod29yZC5tYXRjaChyZWdleCkpIHJldHVybiBcInBhaXJzIG9mIFwiICsgd29yZDtcclxuXHRcclxuXHRyZWdleCA9IC9zdG9tYWNoJHxlcG9jaCR8L2k7XHJcblx0aWYgKHdvcmQubWF0Y2gocmVnZXgpKSByZXR1cm4gd29yZCArIFwic1wiO1xyXG5cdFxyXG5cdHJlZ2V4ID0gL2YkfGZlJC9pO1xyXG5cdGlmICh3b3JkLm1hdGNoKHJlZ2V4KSkgcmV0dXJuIHdvcmQucmVwbGFjZShyZWdleCwgXCJ2ZXNcIik7XHJcblxyXG5cdHJlZ2V4ID0gL1tzeHpdJHxjaCR8c2gkfGF0byQvaTtcclxuXHRpZiAod29yZC5tYXRjaChyZWdleCkpIHJldHVybiB3b3JkICsgXCJlc1wiO1xyXG5cdFxyXG5cdHJlZ2V4ID0gL3kkL2k7XHJcblx0aWYgKHdvcmQubWF0Y2gocmVnZXgpKSByZXR1cm4gd29yZC5yZXBsYWNlKHJlZ2V4LCBcImllc1wiKTtcclxuXHRcclxuXHRyZXR1cm4gd29yZCArIFwic1wiO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgc2h1ZmZsZSxcclxuICBzd2FwLFxyXG4gIGZpcnN0RW1wdHlJbmRleCxcclxuICBsZXJwLFxyXG4gIGNsYW1wLFxyXG4gIHJhbmRvbUludCxcclxuICBnZXRYRnJvbUluZGV4LFxyXG4gIGdldFlGcm9tSW5kZXgsXHJcbiAgZ2V0SW5kZXhGcm9tWFksXHJcbiAgdGltZXN0YW1wLFxyXG4gIGluZGVmaW5pdGVBcnRpY2xlLFxyXG4gIHBsdXJhbFxyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJleHByZXNzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImZzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImh0dHBcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibW9uZ29qc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJub2RlLWdhbWVsb29wXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInBhdGhcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwic29ja2V0LmlvXCIpOyJdLCJzb3VyY2VSb290IjoiIn0=
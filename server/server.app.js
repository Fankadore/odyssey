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
	constructor(mapId, x, y, direction, name, sprite) {
		sprite = _util_js__WEBPACK_IMPORTED_MODULE_3__["default"].clamp(sprite, 1, _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].MAX_SPRITES);

		super(mapId, x, y, sprite);
		this.controller = null;
		this.name = name;
		this.description = "";
		this.inventory = [];

		this.direction = direction;
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

		this.calcBonusStats();
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

	calcBaseStats(template) {
		this.damageBase = template.damageBase || 1;
		this.defenceBase = template.defenceBase || 0;
		this.healthMaxBase = template.healthMaxBase + (template.healthPerLevel * (this.level - 1)) || 1;
		this.energyMaxBase = template.energyMaxBase + (template.energyPerLevel * (this.level - 1)) || 1;
		this.rangeBase = template.rangeBase || 1;
	}

	calcItemBonus() {
		const itemBonus = {
			damage: 0,
			defence: 0,
			healthMax: 0,
			energyMax: 0,
			range: 0
		};
		
		// For each item in inventory check for bonuses
		for (let i = 0; i < (_config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE + _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].EQUIPMENT_SIZE); i++) {
			const item = this.inventory[i];
			if (item) {
				itemBonus.damage += item.passive.damage;
				itemBonus.defence += item.passive.defence;
				itemBonus.healthMax += item.passive.healthMax;
				itemBonus.energyMax += item.passive.energyMax;
				itemBonus.range += item.passive.range;

				if (i >= _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE) {
					itemBonus.damage += item.equipped.damage;
					itemBonus.defence += item.equipped.defence;
					itemBonus.healthMax += item.equipped.healthMax;
					itemBonus.energyMax += item.equipped.energyMax;
					itemBonus.range += item.equipped.range;
				}
			}
		}
		
		return itemBonus;
	}

	calcEffectBonus() {
		const effectBonus = {
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
		const itemBonus = this.calcItemBonus();
		const effectBonus = this.calcEffectBonus();

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
		
		const playerList = _game_js__WEBPACK_IMPORTED_MODULE_1__["default"].players.filter(player => player.mapId === this.mapId);
		const botList = _game_js__WEBPACK_IMPORTED_MODULE_1__["default"].bots.filter(bot => bot.mapId === this.mapId);
		const actorList = playerList.concat(botList);
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
		let map = _game_js__WEBPACK_IMPORTED_MODULE_1__["default"].maps[this.mapId];

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
		const items = _game_js__WEBPACK_IMPORTED_MODULE_1__["default"].items.filter(item => {
			return item.mapId === this.mapId && item.x === this.x && item.y === this.y;
		});
		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			if (item) {
				// if item is stackable and you already have some
				if (item.stackable) {
					
				}
				const slot = this.findFirstEmptySlot();
				if (slot == null) return false;

				item.playerId = this.playerId;
				item.botId = this.botId;
				item.slot = slot;
				item.mapId = null;
				item.x = null;
				item.y = null;
			}
		}
	}
	
	getMapItem(mapId, id) {
		let item = _game_js__WEBPACK_IMPORTED_MODULE_1__["default"].maps[mapId].items[id];
		if (!item) return null;

		if (item.stack > 0) {
			let slot = this.findItemSlot(item.itemTemplate);
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
		if (!data || data.itemTemplate == null) return null;

		if (data.stack) {
			slot = this.findItemSlot(data.itemTemplate);
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
	
	hasItem(templateId) {
		let count = 0;
		for (let slot = 0; slot < _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE + _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].EQUIPMENT_SIZE; slot++) {
			if (this.inventory[slot]) {
				if (this.inventory[slot].itemTemplate === itemTemplate) {
					count++;
				}
			}
		}
		return count;
	}

	findItemSlot(itemTemplate) {
		let slot = null;
		for (let checkSlot = 0; checkSlot < _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].INVENTORY_SIZE + _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].EQUIPMENT_SIZE; checkSlot++) {
			if (this.inventory[checkSlot]) {
				if (this.inventory[checkSlot].itemTemplate === itemTemplate) {
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
/* harmony import */ var _game_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../game.js */ "./server/src/game.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config.js */ "./server/src/config.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util.js */ "./server/src/util.js");
/* harmony import */ var _actor_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./actor.js */ "./server/src/classes/actor.js");





// A Bot is an Actor with conditional inputs

class Bot extends _actor_js__WEBPACK_IMPORTED_MODULE_3__["default"] {
	constructor(mapId, x, y, direction, template) {
		super(mapId, x, y, direction, template.name, template.sprite);
		this.controller = 'bot';
		this.damageBase = template.damageBase;
		this.defenceBase = template.defenceBase;
		this.healthMaxBase = template.healthMaxBase;
		this.energyMaxBase = template.energyMaxBase;
		this.rangeBase = template.rangeBase;
		this.restore();
		
		this.hostile = template.hostile;
		this.target = null;
		this.setTask('wandering');
		this.moveTimer = 0;

		this.gameId = _util_js__WEBPACK_IMPORTED_MODULE_2__["default"].firstEmptyIndex(_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].bots);
		_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].bots[this.gameId] = this;
	}
	
	getMapItem(mapId, id) {
		const slot = super.getMapItem(mapId, id);
		if (slot == null) return;
		
		const item = _game_js__WEBPACK_IMPORTED_MODULE_0__["default"].items[id];
		item.moveToBot(this.mapId, this.gameId, slot);
	}

	getItem(data) {
		let slot = super.getItem(data);
		if (slot == null) return;

		data.owner = 'bot';
		data.mapId = this.mapId;
		data.gameId = this.gameId;
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
			gameId: this.gameId,
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
		delete _game_js__WEBPACK_IMPORTED_MODULE_0__["default"].maps[this.mapId].bots[this.gameId];
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
		if (source instanceof _actor_js__WEBPACK_IMPORTED_MODULE_3__["default"]) this.setTask('attacking', source);
		super.takeDamage(damage, source);
	}
	
	pickUp() {
		super.pickUp();
		this.checkBestEquipment();
	}

	setDead() {
		super.setDead();
		delete _game_js__WEBPACK_IMPORTED_MODULE_0__["default"].mapData[this.mapId].bots[this.gameId];
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
		for (let slot = 0; slot < _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].INVENTORY_SIZE; slot++) {
			let item = this.inventory[slot];
			if (!item) {
				continue;
			}
			
			switch (item.type) {
				case 'weapon':
					if (this.inventory[_config_js__WEBPACK_IMPORTED_MODULE_1__["default"].INVENTORY_SIZE]) {
						if (item.damage > this.inventory[_config_js__WEBPACK_IMPORTED_MODULE_1__["default"].INVENTORY_SIZE].damage) {
							this.equipItem(slot);
							continue;
						}
					}
					else {
						this.equipItem(slot);
					}
				break;
				case 'shield':
					if (this.inventory[_config_js__WEBPACK_IMPORTED_MODULE_1__["default"].INVENTORY_SIZE + 1]) {
						if (item.defence > this.inventory[_config_js__WEBPACK_IMPORTED_MODULE_1__["default"].INVENTORY_SIZE + 1].defence) {
							this.equipItem(slot);
							continue;
						}
					}
					else {
						this.equipItem(slot);
					}
				break;
				case 'armour':
					if (this.inventory[_config_js__WEBPACK_IMPORTED_MODULE_1__["default"].INVENTORY_SIZE + 2]) {
						if (item.defence > this.inventory[_config_js__WEBPACK_IMPORTED_MODULE_1__["default"].INVENTORY_SIZE + 2].defence) {
							this.equipItem(slot);
							continue;
						}
					}
					else {
						this.equipItem(slot);
					}
				break;
				case 'helmet':
					if (this.inventory[_config_js__WEBPACK_IMPORTED_MODULE_1__["default"].INVENTORY_SIZE + 3]) {
						if (item.defence > this.inventory[_config_js__WEBPACK_IMPORTED_MODULE_1__["default"].INVENTORY_SIZE + 3].defence) {
							this.equipItem(slot);
							continue;
						}
					}
					else {
						this.equipItem(slot);
					}
				break;
				case 'ring':
					if (this.inventory[_config_js__WEBPACK_IMPORTED_MODULE_1__["default"].INVENTORY_SIZE + 4]) {
						if (item.damage > this.inventory[_config_js__WEBPACK_IMPORTED_MODULE_1__["default"].INVENTORY_SIZE + 4].damage) {
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
		
		this.id = _util_js__WEBPACK_IMPORTED_MODULE_3__["default"].firstEmptyIndex(_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].maps[this.mapId].effects);
		_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].maps[this.mapId].effects[this.id] = this;
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
		delete _game_js__WEBPACK_IMPORTED_MODULE_1__["default"].maps[this.mapId].effects[this.id];
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
	constructor(mapId, x, y, sprite = 1) {
		this.mapId = mapId;
		this.x = x;
		this.y = y;
		if (sprite < 1) sprite = 1;
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
/* harmony import */ var _game_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../game.js */ "./server/src/game.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config.js */ "./server/src/config.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util.js */ "./server/src/util.js");
/* harmony import */ var _entity_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./entity.js */ "./server/src/classes/entity.js");





class Item extends _entity_js__WEBPACK_IMPORTED_MODULE_3__["default"] {
	constructor(position, template, stack) {
		if (position.playerId === undefined) position.playerId = null;
		if (position.botId === undefined) position.botId = null;
		if (position.slot === undefined) position.slot = null;
		if (position.mapId === undefined) position.mapId = null;
		if (position.x === undefined) position.x = null;
		if (position.y === undefined) position.y = null;

		super(position.mapId, position.x, position.y, template.sprite);
		this.z = -10;
		this.playerId = position.playerId;
		this.botId = position.botId;
		this.slot = position.slot;
		
		this.name = template.name;
		this.description = template.description;
		this.reusable = template.reusable;
		
		this.type = template.type.name;
		this.stackable = template.type.stackable;
		this.equippableSlot = template.type.equippableSlot;
		
		this.passive = {
			damage: template.passiveDamage,
			defence: template.passiveDefence,
			healthMax: template.passiveHealthMax,
			energyMax: template.passiveEnergyMax,
			range: template.passiveRange
		};
		this.equipped = {
			damage: template.equippedDamage,
			defence: template.equippedDefence,
			healthMax: template.equippedHealthMax,
			energyMax: template.equippedEnergyMax,
			range: template.equippedRange
		};
		
		if (this.stackable) {
			if (stack < 1) stack = 1;
			this.stack = stack;
		}
		else {
			this.stack = 0;
		}

		this.id = _util_js__WEBPACK_IMPORTED_MODULE_2__["default"].firstEmptyIndex(_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].items);
		_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].items[this.id] = this;
	}
	
	get damage() {
		const damageTotal = this.passiveDamage + this.equipDamage;
		return (damageTotal < 0) ? 0 : damageTotal;
	}
	get defence() {
		const defenceTotal = this.passiveDefence + this.equipDefence;
		return (defenceTotal < 0) ? 0 : defenceTotal;
	}
	get healthMax() {
		const healthMaxTotal = this.passiveHealthMax + this.equipHealthMax;
		return (healthMaxTotal < 0) ? 0 : healthMaxTotal;
	}
	get energyMax() {
		const energyMaxTotal = this.passiveEnergyMax + this.equipEnergyMax;
		return (energyMaxTotal < 0) ? 0 : energyMaxTotal;
	}
	get range() {
		const rangeTotal = this.passiveRange + this.equipRange;
		return (rangeTotal < 0) ? 0 : rangeTotal;
	}

	update(delta) {
		return this.getPack();
	}

	getPack() {
		return {
			id: this.id,
			playerId: this.playerId,
			botId: this.botId,
			slot: this.slot,
			mapId: this.mapId,
			x: this.x,
			y: this.y,
			z: this.z,
			name: this.name,
			description: this.description,
			sprite: this.sprite,
			type: this.type,
			reusable: this.reusable,
			passive: this.passive,
			equipped: this.equipped,
			stack: this.stack,
			isVisible: this.isVisible
		};
	}
	
	remove() {
		if (this.owner === 'player') {
			delete _game_js__WEBPACK_IMPORTED_MODULE_0__["default"].players[this.id].inventory[this.slot];
		}
		else if (this.owner === 'map') {
			delete _game_js__WEBPACK_IMPORTED_MODULE_0__["default"].maps[this.mapId].items[this.id];
		}
		else if (this.owner === 'bot') {
			delete _game_js__WEBPACK_IMPORTED_MODULE_0__["default"].maps[this.mapId].bots[this.id].inventory[this.slot];
		}
	}
	
	isEquipment() {
		const itemTypes = ['weapon', 'shield', 'armour', 'helmet', 'ring'];
		return (itemTypes.includes(this.type));
	}

	canEquip(slot) {
		if (slot === _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].INVENTORY_SIZE) {
			if (this.type === 'weapon') return true;
		}
		else if (slot === _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].INVENTORY_SIZE + 1) {
			if (this.type === 'shield') return true;
		}
		else if (slot === _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].INVENTORY_SIZE + 2) {
			if (this.type === 'armour') return true;
		}
		else if (slot === _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].INVENTORY_SIZE + 3) {
			if (this.type === 'helmet') return true;
		}
		else if (slot === _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].INVENTORY_SIZE + 4) {
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
		_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].players[this.id].inventory[this.slot] = this;
	}

	moveToMap(mapId, x, y) {
		if (mapId == null || x == null || y == null) return;

		this.remove();
		this.owner = 'map';
		this.mapId = mapId;
		this.id = _util_js__WEBPACK_IMPORTED_MODULE_2__["default"].firstEmptyIndex(_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].maps[this.mapId].items);
		this.x = x;
		this.y = y;
		_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].maps[this.mapId].items[this.id] = this;
	}

	moveToBot(mapId, id, slot) {
		if (mapId == null || id == null || slot == null) return;

		this.remove();
		this.owner = 'bot';
		this.mapId = mapId;
		this.id = id;
		this.slot = slot;
		_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].maps[this.mapId].bots[this.id].inventory[this.slot] = this;
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
	constructor(mapId, data = {}) {
		this.mapId = mapId;

		if (data.name == null) data.name = "Blank Map";
		if (data.dropChance == null) data.dropChance = 100;
		if (data.dropAmountEQ == null) data.dropAmountEQ = 1;
		if (!data.tiles) data.tiles = _util_js__WEBPACK_IMPORTED_MODULE_1__["default"].create3dArray(_config_js__WEBPACK_IMPORTED_MODULE_0__["default"].MAP_COLUMNS, _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].MAP_ROWS, _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].MAP_LAYERS, 0);
		if (!data.isWall) data.isWall = _util_js__WEBPACK_IMPORTED_MODULE_1__["default"].create2dArray(_config_js__WEBPACK_IMPORTED_MODULE_0__["default"].MAP_COLUMNS, _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].MAP_ROWS, false);
		if (!data.isHostile) data.isHostile = _util_js__WEBPACK_IMPORTED_MODULE_1__["default"].create2dArray(_config_js__WEBPACK_IMPORTED_MODULE_0__["default"].MAP_COLUMNS, _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].MAP_ROWS, false);
		if (!data.damage) data.damage = _util_js__WEBPACK_IMPORTED_MODULE_1__["default"].create2dArray(_config_js__WEBPACK_IMPORTED_MODULE_0__["default"].MAP_COLUMNS, _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].MAP_ROWS, null);
		if (!data.warpMap) data.warpMap = _util_js__WEBPACK_IMPORTED_MODULE_1__["default"].create2dArray(_config_js__WEBPACK_IMPORTED_MODULE_0__["default"].MAP_COLUMNS, _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].MAP_ROWS, null);
		if (!data.warpX) data.warpX = _util_js__WEBPACK_IMPORTED_MODULE_1__["default"].create2dArray(_config_js__WEBPACK_IMPORTED_MODULE_0__["default"].MAP_COLUMNS, _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].MAP_ROWS, null);
		if (!data.warpY) data.warpY = _util_js__WEBPACK_IMPORTED_MODULE_1__["default"].create2dArray(_config_js__WEBPACK_IMPORTED_MODULE_0__["default"].MAP_COLUMNS, _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].MAP_ROWS, null);

		this.name = data.name;
		this.dropChance = _util_js__WEBPACK_IMPORTED_MODULE_1__["default"].clamp(data.dropChance, 0, 100);
		this.dropAmountEQ = _util_js__WEBPACK_IMPORTED_MODULE_1__["default"].clamp(data.dropAmountEQ, 0, _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].EQUIPMENT_SIZE);
		//this.dropChance = 0 = 0% chance to drop items in inventory (drop nothing), 100 = 100% chance to drop (drop everything)
		//this.dropAmountEQ = number of equipped items the player will drop on death. dropEQ = EQUIPMENT_SIZE = drop all equipment
		this.tiles = data.tiles;
		this.isWall = data.isWall;
		this.isHostile = data.isHostile;
		this.damage = data.damage;
		this.warpMap = data.warpMap;
		this.warpX = data.warpX;
		this.warpY = data.warpY;
	}
	
	upload(data) {
		if (data.name != null) this.name = data.name;
		if (data.dropChance != null) this.dropChance = data.dropChance;
		if (data.dropAmountEQ != null) this.dropAmountEQ = data.dropAmountEQ;
		if (data.tiles) this.tiles = data.tiles;
		if (data.isWall) this.isWall = data.isWall;
		if (data.isHostile) this.isHostile = data.isHostile;
		if (data.damage) this.damage = data.damage;
		if (data.warpMap) this.warpMap = data.warpMap;
		if (data.warpX) this.warpX = data.warpX;
		if (data.warpY) this.warpY = data.warpY;
	}

	getPack() {
		return {
			mapId: this.mapId,
			name: this.name,
			dropChance: this.dropChance,
			dropAmountEQ: this.dropAmountEQ,
			tiles: this.tiles,
			isWall: this.isWall,
			isHostile: this.isHostile,
			damage: this.damage,
			warpMap: this.warpMap,
			warpX: this.warpX,
			warpY: this.warpY
		};
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
/* harmony import */ var _game_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../game.js */ "./server/src/game.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config.js */ "./server/src/config.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util.js */ "./server/src/util.js");
/* harmony import */ var _actor_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./actor.js */ "./server/src/classes/actor.js");





// A Player is an immortal Actor which takes input from a client

class Player extends _actor_js__WEBPACK_IMPORTED_MODULE_3__["default"] {
	constructor(socketId, data) {
		if (data.sprite == null) data.sprite = data.template.sprite;

		super(data.mapId, data.x, data.y, data.direction, data.name, data.sprite);
		this.controller = 'player';
		this.id = data._id;
		this.socketId = socketId;
		this.accountId = data.account;
		this.adminAccess = data.adminAccess;

		this.level = data.level;
		this.experience = data.experience;
		this.templateId = data.template._id;
		this.template = data.template.name;
		this.calcBaseStats(data.template);
		this.restore();

		this.isDead = false;
		this.deaths = 0;
		this.respawnTimer = 0;
		this.respawnSpeed = 10;
		this.respawnMap = data.mapId;
		this.respawnX = data.x;
		this.respawnY = data.y;

		this.input = {
			direction: null,
			run: false,
			pickup: false,
			attack: false
		};

		this.gameId = _util_js__WEBPACK_IMPORTED_MODULE_2__["default"].firstEmptyIndex(_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].players);
		_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].players[this.gameId] = this;
	}

	update(delta) {
		super.update(delta);		// Default Actor Update
		if (this.isDead) {
			// Respawning
			this.respawnTimer += delta;
			if (this.respawnTimer >= this.respawnSpeed) this.respawn();
		}
		else {
			// Check for Attack Input
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
		
		return this.getGamePack();
	}
	
	getGamePack() {
		return {
			gameId: this.gameId,
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
	
	getUIPack() {
		return {
			level: this.level,
			experience: this.experience,
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

	getDBPack() {
		return {
			name: this.name,
			account: this.accountId,
			template: this.templateId,
			level: this.level,
			experience: this.experience,
			mapId: this.mapId,
			x: this.x,
			y: this.y,
			direction: this.direction,
			adminAccess: this.adminAccess,
			sprite: this.sprite
		}
	}

	pickUp() {
		if (super.pickUp() === false) _game_js__WEBPACK_IMPORTED_MODULE_0__["default"].sendGameInfoPlayer(this.gameId, "Your inventory is full.");
	}

	setDead(killerController, killerName) {
		super.setDead();
		this.isDead = true;
		this.health = 0;
		this.energy = 0;
		this.deaths++;
		
		if (killerController && killerName) {
			if (killerController === 'player') {
				_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].sendGameInfoGlobal(killerName + " has murdered " + this.name + " in cold blood!");
			}
			else {
				_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].sendGameInfoGlobal(this.name + " has been killed by " + killerName + "!");
			}
		}
		else {
			_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].sendGameInfoGlobal(this.name + " has died!");
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
		_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].sendGameInfoPlayer(this.gameId, "The Angel of Mercy refuses to let you die.");
	}

	gainExperience(experience) {
		if (this.experience + experience <= 0) {
			this.experience = 0;	
			return;
		}

		this.experience += experience;
		if (this.experience >= _game_js__WEBPACK_IMPORTED_MODULE_0__["default"].experienceToLevel[this.level]) {
			this.levelUp();
		}
	}

	levelUp() {
		if (this.level < _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].MAX_LEVEL) {
			const rolloverExperience = this.experience - _game_js__WEBPACK_IMPORTED_MODULE_0__["default"].experienceToLevel[this.level];
			this.experience = 0;
			this.level++;
			this.calcBaseStats();
			_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].sendGameInfoPlayer(this.gameId, `Level up! You are now level ${this.level}!`);
			this.gainExperience(rolloverExperience);
		}
	}
	
	calcBaseStats(template) {
		if (!template) template = _game_js__WEBPACK_IMPORTED_MODULE_0__["default"].playerTemplates[this.templateId];
		super.calcBaseStats(template);
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

		this.id = _util_js__WEBPACK_IMPORTED_MODULE_1__["default"].firstEmptyIndex(_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].maps[this.mapId].texts);
		_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].maps[this.mapId].texts[this.id] = this;
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
		delete _game_js__WEBPACK_IMPORTED_MODULE_0__["default"].maps[this.mapId].texts[this.id];
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
config.MAX_LEVEL = 30;

config.MAX_HEALTH_BASE = 200;
config.MAX_HEALTH_BONUS = 55;
config.MAX_ENERGY_BASE = 200;
config.MAX_ENERGY_BONUS = 55;

config.INVENTORY_SIZE = 20;
config.EQUIPMENT_SIZE = 5;

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
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bcrypt */ "bcrypt");
/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bcrypt__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util.js */ "./server/src/util.js");
/* harmony import */ var _models_account_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./models/account.js */ "./server/src/models/account.js");
/* harmony import */ var _models_player_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./models/player.js */ "./server/src/models/player.js");
/* harmony import */ var _models_playerTemplate_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./models/playerTemplate.js */ "./server/src/models/playerTemplate.js");
/* harmony import */ var _models_botTemplate_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./models/botTemplate.js */ "./server/src/models/botTemplate.js");
/* harmony import */ var _models_itemType_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./models/itemType.js */ "./server/src/models/itemType.js");
/* harmony import */ var _models_itemTemplate_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./models/itemTemplate.js */ "./server/src/models/itemTemplate.js");
/* harmony import */ var _models_map_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./models/map.js */ "./server/src/models/map.js");













const fsp = fs__WEBPACK_IMPORTED_MODULE_2___default.a.promises;
mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Promise = Promise;
mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.connect('mongodb://localhost/odyssey', {useNewUrlParser: true});

class Database {
	constructor() {
		this.serverLog = [];
	}

	async backup() {
		//TODO save everything
		// const maps = save-all-maps
		// const players = save-all-online-players
		// const bots = save-all-bots
		// const items = save-all-items
		let logSaved = this.saveLog();
		await Promise.all([logSaved]);
		this.log("Game saved to disk.");
	}
	
	log(message) {
		const date = new Date();
		console.log(_util_js__WEBPACK_IMPORTED_MODULE_3__["default"].timestamp(date) + " - " + message);
		this.serverLog.push({
			message,
			date
		});
	}
	async saveLog() {
		try {
			const savedLog = await fsp.readFile('./server/log.json');
			const newLog = JSON.parse(savedLog).concat(this.serverLog);
			this.serverLog = [];
			await fsp.writeFile('./server/log.json', JSON.stringify(newLog));
			return true;
		}
		catch(err) {
			console.log(err);
			return false;
		}
	}
	async clearLog() {
		try {
			this.serverLog = [];
			await fsp.writeFile('./server/log.json', "[]");
			return true;
		}
		catch (err) {
			console.log(err);
			return false;
		}
	}

	async hashPassword(password) {
		return await new Promise((resolve, reject) => {
			bcrypt__WEBPACK_IMPORTED_MODULE_1___default.a.hash(password, 10, (err, hash) => {
				if (err) reject(err);
				else resolve(hash);
			});
		});
	}
	async comparePassword(password, hashedPassword) {
		return await new Promise((resolve, reject) => {
			bcrypt__WEBPACK_IMPORTED_MODULE_1___default.a.compare(password, hashedPassword, (err, match) => {
				if (err) reject(err);
				else resolve(match);
			});
		});
	}
	async authAccount(username, password) {
		const account = await _models_account_js__WEBPACK_IMPORTED_MODULE_4__["default"].findOne({username: username}).exec();
		if (!account) return false;
		
		return this.comparePassword(password, account.password);
	}

	async addAccount(username, password, email) {
		let account = await this.getAccountId(username);
		if (account) {
			console.log(`Account already exists with username ${username}.`);
			return false;
		}

		const hashedPassword = await this.hashPassword(password);
		account = new _models_account_js__WEBPACK_IMPORTED_MODULE_4__["default"]({
			_id: new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Types.ObjectId,
			username,
			password: hashedPassword
		});
		//if (email) account.email = email;

		return await account.save()
		.then(result => {
			this.log(`Account added: ${username}.`)
			return true;
		})
		.catch(err => console.log(err));
	}
	async getAccount(accountId) {
		return await _models_account_js__WEBPACK_IMPORTED_MODULE_4__["default"].findById(accountId)
		.select('_id username password email verified')
		.exec()
		.then(account => account)
		.catch(err => console.log(err));
	}
	async getAccountId(username) {
		return await _models_account_js__WEBPACK_IMPORTED_MODULE_4__["default"].findOne({username: username})
		.select('_id')
		.exec()
		.then(account => {
			if (account) {
				return account._id;
			}
			else {
				return null;
			}
		})
		.catch(err => console.log(err));
	}
	async saveAccount(data) {
		return await _models_account_js__WEBPACK_IMPORTED_MODULE_4__["default"].updateOne({username: data.username}, {$set: data})
		.exec()
		.then(result => true)
		.catch(err => console.log(err));
	}

	async addPlayer(accountId, name, templateId) {
		let account = await this.getAccount(accountId);
		if (!account) {
			console.log("Account does not exist with that id.");
			return false;
		}
		let template = await this.getPlayerTemplate(templateId);
		if (!template) {
			console.log("Player Template does not exist with that id.");
			return false;
		}
		let player = await this.getPlayer(name);
		if (player) {
			console.log("Player already exists with that name.");
			return false;
		}

		player = new _models_player_js__WEBPACK_IMPORTED_MODULE_5__["default"]({
			_id : new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Types.ObjectId,
			name,
			account: accountId,
			template: templateId
		});

		return await player.save()
		.then(result => true)
		.catch(err => console.log(err));
	}
	async getPlayer(name) {
		return await _models_player_js__WEBPACK_IMPORTED_MODULE_5__["default"].findOne({name: name})
		.select('_id account name template level experience mapId x y direction adminAccess sprite')
		.populate('template')
		.exec()
		.then(player => player)
		.catch(err => console.log(err));
	}
	async savePlayer(data) {
		return await _models_player_js__WEBPACK_IMPORTED_MODULE_5__["default"].updateOne({name: data.name}, {$set: data})
		.exec()
		.then(result => true)
		.catch(err => console.log(err));
	}

	async addBot(templateName, mapId, x, y) {
		let templateId = await this.getPlayerTemplateId(templateName);
		if (!templateId) {
			console.log("Bot Template does not exist with that name.");
			return false;
		}
		let bot = await this.getBot(name);
		if (bot) {
			console.log("Bot already exists with that name.");
			return false;
		}

		bot = new Bot({
			_id : new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Types.ObjectId,
			template: templateId,
			mapId,
			x,
			y
		});

		return await bot.save()
		.then(result => true)
		.catch(err => console.log(err));
	}
	async getBot(name) {
		return await Bot.findOne({name: name})
		.select('_id name sprite template level experience mapId x y direction')
		.populate('template')
		.exec()
		.then(bot => bot)
		.catch(err => console.log(err));
	}
	async saveBot(data) {
		return await Bot.updateOne({name: data.name}, {$set: data})
		.exec()
		.then(result => true)
		.catch(err => console.log(err));
	}

	async getMap(mapId) {
		return await _models_map_js__WEBPACK_IMPORTED_MODULE_10__["default"].findOne({mapId: mapId})
		.select('mapId name dropChance dropAmountEQ tiles isWall isHostile damage warpMap warpX warpY')
		.exec()
		.then(map => map)
		.catch(err => console.log(err));
	}
	async saveMap(data) {
		return await _models_map_js__WEBPACK_IMPORTED_MODULE_10__["default"].updateOne({mapId: data.mapId}, {$set: data}, {upsert: true})
		.exec()
		.then(result => true)
		.catch(err => console.log(err));
	}
	async getAllMaps() {
		try {
			return await _models_map_js__WEBPACK_IMPORTED_MODULE_10__["default"].find({})
			.select('mapId name tiles hostile dropChance dropAmountEQ')
			.exec()
			.then(maps => maps)
			.catch(err => console.log(err));
		}
		catch(err) {
			console.log(err);
		}
	}

	async addPlayerTemplate(data) {
		if (!data.name) {
			console.log("Name is required.");
			return;
		}

		let checkTemplate = await _models_playerTemplate_js__WEBPACK_IMPORTED_MODULE_6__["default"].findOne({name: data.name})
		.exec()
		.then(template => template)
		.catch(err => console.log(err));

		if (checkTemplate) {
			console.log("Template already exists with that name.");
			return;
		}

		const template = new _models_playerTemplate_js__WEBPACK_IMPORTED_MODULE_6__["default"]({
			_id: new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Types.ObjectId,
			name: data.name,
			sprite: data.sprite,
			damageBase: data.damageBase,
			defenceBase: data.defenceBase,
			healthMaxBase: data.healthMaxBase,
			energyMaxBase: data.energyMaxBase,
			rangeBase: data.rangeBase,
			healthPerLevel: data.healthPerLevel,
			energyPerLevel: data.energyPerLevel
		});

		return await template.save()
		.then(result => true)
		.catch(err => console.log(err));
	}
	async getPlayerTemplate(templateId) {
		return await _models_playerTemplate_js__WEBPACK_IMPORTED_MODULE_6__["default"].findById(templateId)
		.select('name sprite damageBase defenceBase healthMaxBase energyMaxBase rangeBase healthPerLevel, energyPerLevel')
		.exec()
		.then(template => template)
		.catch(err => console.log(err));
	}
	async getAllPlayerTemplates() {
		return await _models_playerTemplate_js__WEBPACK_IMPORTED_MODULE_6__["default"].find({})
		.select('_id name sprite damageBase defenceBase healthMaxBase energyMaxBase rangeBase healthPerLevel, energyPerLevel')
		.exec()
		.then(templates => templates)
		.catch(err => console.log(err));
	}

	async addBotTemplate(data) {
		const template = new _models_botTemplate_js__WEBPACK_IMPORTED_MODULE_7__["default"]({
			_id: new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Types.ObjectId,
			name: data.name,
			sprite: data.sprite,
			damageBase: data.damageBase,
			defenceBase: data.defenceBase,
			healthMaxBase: data.healthMaxBase,
			energyMaxBase: data.energyMaxBase,
			rangeBase: data.rangeBase,
			hostile: data.hostile
		});

		return await template.save()
		.then(result => true)
		.catch(err => console.log(err));
	}
	async getBotTemplate(templateId) {
		return await _models_botTemplate_js__WEBPACK_IMPORTED_MODULE_7__["default"].findById(templateId)
		.select('name sprite damageBase defenceBase healthMaxBase energyMaxBase rangeBase hostile')
		.exec()
		.then(template => template)
		.catch(err => console.log(err));
	}
	async getAllBotTemplates() {
		return await _models_botTemplate_js__WEBPACK_IMPORTED_MODULE_7__["default"].find({})
		.select('_id name sprite damageBase defenceBase healthMaxBase energyMaxBase rangeBase hostile')
		.exec()
		.then(templates => templates)
		.catch(err => console.log(err));
	}

	async addItemType(data) {
		const type = new _models_itemType_js__WEBPACK_IMPORTED_MODULE_8__["default"]({
			_id: new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Types.ObjectId,
			name: data.name,
			stackable: data.stackable,
			equippedSlot: data.equippedSlot
		});

		return await type.save()
		.then(result => true)
		.catch(err => console.log(err));
	}
	async getItemType(typeId) {
		return await _models_itemType_js__WEBPACK_IMPORTED_MODULE_8__["default"].findById(typeId)
		.select('name stackable equippedSlot')
		.exec()
		.then(type => type)
		.catch(err => console.log(err));
	}
	async getAllItemTypes() {
		return await _models_itemType_js__WEBPACK_IMPORTED_MODULE_8__["default"].find({})
		.select('_id name stackable equippedSlot')
		.exec()
		.then(types => types)
		.catch(err => console.log(err));
	}

	async addItemTemplate(data) {
		const template = new _models_itemTemplate_js__WEBPACK_IMPORTED_MODULE_9__["default"]({
			_id: new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Types.ObjectId,
			name: data.name,
			sprite: data.sprite,
			type: data.typeId,
			passiveDamage: data.passiveDamage,
			passiveDefence: data.passiveDefence,
			passiveHealthMax: data.passiveHealthMax,
			passiveEnergyMax: data.passiveEnergyMax,
			passiveRange: data.passiveRange,
			equippedDamage: data.equippedDamage,
			equippedDefence: data.equippedDefence,
			equippedHealthMax: data.equippedHealthMax,
			equippedEnergyMax: data.equippedEnergyMax,
			equippedRange: data.equippedRange
		});

		return await template.save()
		.then(result => true)
		.catch(err => console.log(err));
	}
	async getItemTemplate(templateId) {
		return await _models_itemTemplate_js__WEBPACK_IMPORTED_MODULE_9__["default"].findById(templateId)
		.select('name sprite type passiveDamage passiveDefence passiveHealthMax passiveEnergyMaxBase passiveRange equippedDamage equippedDefence equippedHealthMax equippedEnergyMaxBase equippedRange')
		.populate('type')
		.exec()
		.then(template => template)
		.catch(err => console.log(err));
	}
	async getAllItemTemplates() {
		return await _models_itemTemplate_js__WEBPACK_IMPORTED_MODULE_9__["default"].find({})
		.select('_id name sprite type passiveDamage passiveDefence passiveHealthMax passiveEnergyMaxBase passiveRange equippedDamage equippedDefence equippedHealthMax equippedEnergyMaxBase equippedRange')
		.populate('type')
		.exec()
		.then(templates => templates)
		.catch(err => console.log(err));
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
/* harmony import */ var _db_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./db.js */ "./server/src/db.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config.js */ "./server/src/config.js");
/* harmony import */ var _classes_map_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./classes/map.js */ "./server/src/classes/map.js");
/* harmony import */ var _classes_player_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./classes/player.js */ "./server/src/classes/player.js");
/* harmony import */ var _classes_bot_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./classes/bot.js */ "./server/src/classes/bot.js");
/* harmony import */ var _classes_item_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./classes/item.js */ "./server/src/classes/item.js");
/* harmony import */ var _classes_effect_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./classes/effect.js */ "./server/src/classes/effect.js");
/* harmony import */ var _classes_text_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./classes/text.js */ "./server/src/classes/text.js");
/* harmony import */ var _classes_message_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./classes/message.js */ "./server/src/classes/message.js");











class Game {
	constructor() {
		this.maps = [];
		this.players = [];
		this.bots = [];
		this.items = [];
		this.effects = [];
		this.texts = [];
		this.messageQueue = [];
		
		this.playerTemplates = {};
		this.botTemplates = {};
		this.itemTemplates = {};

		this.loadMaps();
		this.loadPlayerTemplates();
		this.loadBotTemplates();
		this.loadItemTemplates();
	}

	loadMaps() {
		_db_js__WEBPACK_IMPORTED_MODULE_0__["default"].getAllMaps()
		.then(mapData => {
			const orderedMapData = [];
			for (let id = 0; id < mapData.length; id++) {
				const data = mapData[id];
				if (data) orderedMapData[data.mapId] = data;
			}

			for (let id = 0; id < _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].MAX_MAPS; id++) {
				if (orderedMapData[id]) {
					this.maps[id] = new _classes_map_js__WEBPACK_IMPORTED_MODULE_2__["default"](id, orderedMapData[id]);
				}
				else {
					this.maps[id] = new _classes_map_js__WEBPACK_IMPORTED_MODULE_2__["default"](id);
				}
			}
		})
		.catch(err => console.log(err));
	}

	loadPlayerTemplates() {
		_db_js__WEBPACK_IMPORTED_MODULE_0__["default"].getAllPlayerTemplates()
		.then(templates => {
			this.playerTemplates = {};
			templates.forEach(template => {
				this.playerTemplates[template._id] = template;
			});
		}).catch(err => console.log(err));
	}

	loadBotTemplates() {
		_db_js__WEBPACK_IMPORTED_MODULE_0__["default"].getAllBotTemplates()
		.then(templates => {
			this.botTemplates = {};
			templates.forEach(template => {
				this.botTemplates[template._id] = template;
			});
		}).catch(err => console.log(err));
	}

	loadItemTemplates() {
		_db_js__WEBPACK_IMPORTED_MODULE_0__["default"].getAllItemTemplates()
		.then(templates => {
			this.itemTemplates = {};
			templates.forEach(template => {
				this.itemTemplates[template._id] = template;
			});
		}).catch(err => console.log(err));
	}

	update(delta) {
		let pack = {
			players: [],
			bots: [],
			items: [],
			effects: [],
			texts: [],
			messages: [].concat(this.messageQueue)
		};
		this.messageQueue = [];

		for (let i = 0; i < this.players.length; i++) {
			const player = this.players[i];
			if (player != null) {
				pack.players[player.gameId] = player.update(delta);
			}
		}
		for (let i = 0; i < this.bots.length; i++) {
			const bot = this.bots[i];
			if (bot != null) {
				pack.bots[bot.gameId] = bot.update(delta);
			}
		}
		for (let i = 0; i < this.items.length; i++) {
			const item = this.items[i];
			if (item != null) {
				pack.items[item.id] = item.update(delta);
			}
		}
		for (let i = 0; i < this.effects.length; i++) {
			const effect = this.effects[i];
			if (effect != null) {
				pack.effects[effect.id] = effect.update(delta);
			}
		}
		for (let i = 0; i < this.texts.length; i++) {
			const text = this.texts[i];
			if (text != null) {
				pack.texts[text.id] = text.update(delta);
			}
		}

		return pack;
	}

	// Players
	playerLogin(socketId, data) {
		for (let player of this.players) {
			if (player && player.name === data.name) {
				console.log("Player is already signed in.");
				return null;
			}
		}

		const player = new _classes_player_js__WEBPACK_IMPORTED_MODULE_3__["default"](socketId, data);
		_db_js__WEBPACK_IMPORTED_MODULE_0__["default"].log(`${socketId} - ${player.name} has logged in.`);
		this.sendGameInfoGlobal(`${player.name} has logged in.`);
		return player;
	}
	playerLogout(playerId) {
		let player = this.players[playerId];
		if (player) {
			const playerData = player.getDBPack()
			_db_js__WEBPACK_IMPORTED_MODULE_0__["default"].log(`${player.socketId} - ${player.name} has logged out.`);
			this.sendGameInfoGlobal(`${player.name} has logged out.`);
			delete this.texts[player.displayNameId];
			delete this.players[playerId];
			_db_js__WEBPACK_IMPORTED_MODULE_0__["default"].savePlayer(playerData);
		}
	}
	getExpToLevel(level) {
		let exp = 10;
		for (let i = 1; i < _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].MAX_LEVEL; i++) {
			if (i === level) return exp;
			exp = (exp + (exp % 2)) * 1.5;
		}
	}

	// Game Info
	sendGameInfoGlobal(message) {
		this.messageQueue.push(new _classes_message_js__WEBPACK_IMPORTED_MODULE_8__["default"](null, message, 'gameInfo'));
	}
	sendGameInfoMap(mapId, message) {
		this.messageQueue.push(new _classes_message_js__WEBPACK_IMPORTED_MODULE_8__["default"](null, message, 'gameInfo', mapId));
	}
	sendGameInfoPlayer(id, message) {
		this.messageQueue.push(new _classes_message_js__WEBPACK_IMPORTED_MODULE_8__["default"](null, message, 'gameInfo', null, id));
	}
	
	// Chat Messages
	sendMessageGlobal(senderId, message) {
		this.messageQueue.push(new _classes_message_js__WEBPACK_IMPORTED_MODULE_8__["default"](senderId, message, 'messageGlobal'));
	}
	sendMessageMap(senderId, mapId, message) {
		this.messageQueue.push(new _classes_message_js__WEBPACK_IMPORTED_MODULE_8__["default"](senderId, message, 'messageMap', mapId));
	}
	sendMessagePlayer(senderId, id, message) {
		this.messageQueue.push(new _classes_message_js__WEBPACK_IMPORTED_MODULE_8__["default"](senderId, message, 'messagePlayer', null, id));
	}

	// Map
	isVacant(mapId, x, y) {
		// Check for Map Edges
		if (x < 0 || x >= _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].MAP_COLUMNS) return false;
		if (y < 0 || y >= _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].MAP_ROWS) return false;
		
		// Check for Wall Tiles
		let map = this.maps[mapId];
		if (map.isWall[y][x] === true) return false;
		
		// Check for Bots
		let bots = this.bots.filter((bot) => {
			if (bot.mapId === mapId && bot.x === x && bot.y === y && !bot.isDead) return true;
		});
		if (bots.length > 0) return false;
		
		// Check for Players
		let players = this.players.filter((player) => {
			if (player.mapId === mapId && player.x === x && player.y === y && !player.isDead) return true;
		});
		if (players.length > 0) return false;

		return true;
	}

	spawnBot(mapId, x, y, templateId, direction = 'down') {
		templateId = '5c1becde28d05b077cbaa385';
		const template = this.botTemplates[templateId];
		if (template) {
			new _classes_bot_js__WEBPACK_IMPORTED_MODULE_4__["default"](mapId, x, y, direction, template);
		}
		else {
			console.log("Bot Template does not exist with that Id");
		}
	}
	
	spawnMapItem(mapId, x, y, templateId, stack = 1) {
		templateId = "5c1bfeb7d8fb6012cc966083";
		let template = this.itemTemplates[templateId];
		if (template) {
			new _classes_item_js__WEBPACK_IMPORTED_MODULE_5__["default"]({mapId, x, y}, template, stack);
		}
		else {
			console.log("Item Template does not exist with that Id");
		}
	}

	spawnDamageText(mapId, x, y, damage) {
		new _classes_text_js__WEBPACK_IMPORTED_MODULE_7__["default"](mapId, x, y + 0.5, damage, '#ff0000', 1.25, 0, -1);
	}

	spawnEffect(mapId, x, y, sprite, loop, speed, maxFrame, startFrame) {
		new _classes_effect_js__WEBPACK_IMPORTED_MODULE_6__["default"](mapId, x, y, sprite, loop, speed, maxFrame, startFrame);
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

/***/ "./server/src/models/account.js":
/*!**************************************!*\
  !*** ./server/src/models/account.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);


const accountSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema({
  _id: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.SchemaTypes.ObjectId,
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  email: {type: String, unique: true, sparse: true, match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/},
  verified: {type: Boolean, default: false}
});

/* harmony default export */ __webpack_exports__["default"] = (mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.model('Account', accountSchema));


/***/ }),

/***/ "./server/src/models/botTemplate.js":
/*!******************************************!*\
  !*** ./server/src/models/botTemplate.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);


const botTemplateSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema({
  _id: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.SchemaTypes.ObjectId,
  name: {type: String, default: "Bot"},
  sprite: {type: Number, default: 1},
  damageBase: {type: Number, default: 0},
  defenceBase: {type: Number, default: 0},
  healthMaxBase: {type: Number, default: 1},
  energyMaxBase: {type: Number, default: 1},
  rangeBase: {type: Number, default: 1},
  hostile: {type: Boolean, default: true}
});

/* harmony default export */ __webpack_exports__["default"] = (mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.model('BotTemplate', botTemplateSchema));


/***/ }),

/***/ "./server/src/models/itemTemplate.js":
/*!*******************************************!*\
  !*** ./server/src/models/itemTemplate.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);


const itemTemplateSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema({
	_id: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.SchemaTypes.ObjectId,
	name: {type: String, required: true},
	sprite: {type: Number, default: 1},
	type: {type: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.SchemaTypes.ObjectId, ref: 'ItemType', required: true},
	passiveDamage: {type: Number, default: 0},
	passiveDefence: {type: Number, default: 0},
	passiveHealthMax: {type: Number, default: 0},
	passiveEnergyMax: {type: Number, default: 0},
	passiveRange: {type: Number, default: 0},
	equippedDamage: {type: Number, default: 0},
	equippedDefence: {type: Number, default: 0},
	equippedHealthMax: {type: Number, default: 0},
	equippedEnergyMax: {type: Number, default: 0},
	equippedRange: {type: Number, default: 0}
});

/* harmony default export */ __webpack_exports__["default"] = (mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.model('ItemTemplate', itemTemplateSchema));


/***/ }),

/***/ "./server/src/models/itemType.js":
/*!***************************************!*\
  !*** ./server/src/models/itemType.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);


const itemTypeSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema({
	_id: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.SchemaTypes.ObjectId,
	name: {type: String, required: true},
	equippedSlot: {type: Number, required: true},
	stackable: {type: Boolean, required: true}
});

/* harmony default export */ __webpack_exports__["default"] = (mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.model('ItemType', itemTypeSchema));


/***/ }),

/***/ "./server/src/models/map.js":
/*!**********************************!*\
  !*** ./server/src/models/map.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);


const mapSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema({
	_id: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.SchemaTypes.ObjectId,
	mapId: Number,
	name: {type: String, required: true},
	dropChance: {type: Number, default: 100},
	dropAmountEQ: {type: Number, default: 1},
	tiles: {type: [[[Number]]], default: [[[]]]},
	isWall: {type: [[Boolean]], default: false},
	isHostile: {type: [[Boolean]], default: false},
	damage: {type: [[Number]], default: null},
	warpMap: {type: [[Number]], default: null},
	warpX: {type: [[Number]], default: null},
	warpY: {type: [[Number]], default: null}
});

/* harmony default export */ __webpack_exports__["default"] = (mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.model('Map', mapSchema));


/***/ }),

/***/ "./server/src/models/player.js":
/*!*************************************!*\
  !*** ./server/src/models/player.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);


const playerSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema({
  _id: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.SchemaTypes.ObjectId,
  account: {type: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.SchemaTypes.ObjectId, ref: 'Account', required: true},
  name: {type: String, required: true, unique: true},
  template: {type: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.SchemaTypes.ObjectId, ref: 'PlayerTemplate', required: true},
  level: {type: Number, default: 1},
  experience: {type: Number, default: 0},
  mapId: {type: Number, default: 1},
  x: {type: Number, default: 5},
  y: {type: Number, default: 5},
  direction: {type: String, default: 'down'},
  adminAccess: {type: Number, default: 0},
  sprite: Number
});

/* harmony default export */ __webpack_exports__["default"] = (mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.model('Player', playerSchema));


/***/ }),

/***/ "./server/src/models/playerTemplate.js":
/*!*********************************************!*\
  !*** ./server/src/models/playerTemplate.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);


const playerTemplateSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema({
  _id: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.SchemaTypes.ObjectId,
  name: {type: String, required: true, unique: true},
  sprite: {type: Number, default: 1},
  damageBase: {type: Number, default: 0},
  defenceBase: {type: Number, default: 0},
  healthMaxBase: {type: Number, default: 1},
  energyMaxBase: {type: Number, default: 1},
  rangeBase: {type: Number, default: 1},
  healthPerLevel: {type: Number, default: 0},
  energyPerLevel: {type: Number, default: 0}
});

/* harmony default export */ __webpack_exports__["default"] = (mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.model('PlayerTemplate', playerTemplateSchema));


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

		this.socketList = {};
		this.activeAccounts = {};

		io.sockets.on('connection', socket => this.onConnect(socket));
	}

	/* connect => signin => selectplayer
	** connect when page loads - shows signin page
	** signin when username and password is submitted
 	** selectplayer when character is chosen - logs into the game
	*/

	// Receive data from clients
	onConnect(socket) {
		this.socketList[socket.id] = socket;
		_db_js__WEBPACK_IMPORTED_MODULE_4__["default"].log(`${socket.id} - Socket connected.`);
		
		socket.on('disconnect', () => this.onDisconnect(socket));
		socket.on('signup', (data) => this.onSignUp(data.username, data.password, data.email));
		socket.on('signin', (data) => this.onSignIn(socket, data.username, data.password));
		socket.on('signout', () => this.onSignOut(socket));
		// Tell client they have connected
	}

	async onDisconnect(socket) {
		if (socket.playerId != null && _game_js__WEBPACK_IMPORTED_MODULE_5__["default"].players[socket.playerId]) await this.onLogOut(socket);
		if (socket.accountId && this.activeAccounts[socket.accountId]) await this.onSignOut(socket);

		_db_js__WEBPACK_IMPORTED_MODULE_4__["default"].log(`${socket.id} - Socket disconnected.`);
		delete this.socketList[socket.id];
	}

	async onSignUp(username, password, email) {
		let success = await _db_js__WEBPACK_IMPORTED_MODULE_4__["default"].addAccount(username, password, email);
		if (success) {
			console.log("Tell client signup was successful");
		}
		else {
			console.log("Tell client signup was not successful");
		}
	}

	async onSignIn(socket, username, password) {
		let success = await _db_js__WEBPACK_IMPORTED_MODULE_4__["default"].authAccount(username, password);
		if (!success) {
			console.log(`Sign in failed on username ${username}`);
			// Tell client signin was not successful
			return;
		}

		let accountId = await _db_js__WEBPACK_IMPORTED_MODULE_4__["default"].getAccountId(username);
		if (this.activeAccounts[accountId]) {
			console.log("That account is already signed in.");
			// Tell client that account is already signed in
			return;
		}
		
		socket.accountId = accountId;
		this.activeAccounts[accountId] = username;

		socket.on('addPlayer', (data) => this.onAddPlayer(socket, data.name, data.templateName));
		socket.on('login', (name) => this.onLogIn(socket, name));
		socket.on('logout', () => this.onLogOut(socket));
		socket.on('addPlayerTemplate', (data) => this.onAddPlayerTemplate(data));

		_db_js__WEBPACK_IMPORTED_MODULE_4__["default"].log(`${socket.id} - ${username} signed in.`);
		this.sendSignedIn(socket);
	}
	
	async onSignOut(socket) {
		if (socket.playerId != null) await this.onLogOut(socket);
		
		if (socket.accountId) {
			const username = this.activeAccounts[socket.accountId];
			_db_js__WEBPACK_IMPORTED_MODULE_4__["default"].log(`${socket.id} - ${username} signed out.`);
			delete this.activeAccounts[socket.accountId];
			socket.accountId = null;
			this.sendSignedOut(socket);
		}
	}

	async onAddPlayer(socket, name, templateId) {
		let success = await _db_js__WEBPACK_IMPORTED_MODULE_4__["default"].addPlayer(socket.accountId, name, templateId);
		if (success) {
			const username = this.activeAccounts[socket.accountId];
			_db_js__WEBPACK_IMPORTED_MODULE_4__["default"].log(`${socket.id} - ${name} has been added as a player to account ${username}.`);
			// Tell client add player was successful
		}
		else {
			// Tell client add player was not successful
		}
	}
	
	async onAddPlayerTemplate(data) {
		let success = await _db_js__WEBPACK_IMPORTED_MODULE_4__["default"].addPlayerTemplate(data);
		if (success) {
			_game_js__WEBPACK_IMPORTED_MODULE_5__["default"].loadPlayerTemplates();
			_db_js__WEBPACK_IMPORTED_MODULE_4__["default"].log(`${socket.id} - ${data.name} has been added as a player template.`);
			// Tell client add player was successful
		}
		else {
			// Tell client add player was not successful
		}
	}

	async onLogIn(socket, name) {
		if (!socket.accountId) {
			console.log("Not signed into account.");
			return;
		}
		if (socket.playerId != null) {
			console.log("Already logged in.");
			return;
		}

		let playerData = await _db_js__WEBPACK_IMPORTED_MODULE_4__["default"].getPlayer(name);
		if (!playerData) {
			console.log("No player with that name.");
			return;
		}

		if (""+socket.accountId !== ""+playerData.account) {	// Cast to string before comparison
			_db_js__WEBPACK_IMPORTED_MODULE_4__["default"].log(`Attempt to login to player (${playerData.name}) from wrong account (${socket.accountId}) on socket ${socket.id}.`);
			return;
		}

		const player = _game_js__WEBPACK_IMPORTED_MODULE_5__["default"].playerLogin(socket.id, playerData);
		if (!player) return;
	
		socket.playerId = player.gameId;
		socket.on('input', (data) => this.onInput(player, data));
		this.sendMapData(socket, player.mapId);
	}
	
	async onLogOut(socket) {
		if (socket.playerId != null) {
			await _game_js__WEBPACK_IMPORTED_MODULE_5__["default"].playerLogout(socket.playerId);
			socket.playerId = null;
		}
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
			case 'serverChat': _game_js__WEBPACK_IMPORTED_MODULE_5__["default"].sendMessageGlobal(player.gameId, `${player.name} yells, "${data.message}"`);
			break;
			case 'mapChat': _game_js__WEBPACK_IMPORTED_MODULE_5__["default"].sendMessageMap(player.gameId, player.mapId, `${player.name} says, "${data.message}"`);
			break;
			case 'playerChat':
				let target = _game_js__WEBPACK_IMPORTED_MODULE_5__["default"].players[data.targetId];
				if (target) {
					_game_js__WEBPACK_IMPORTED_MODULE_5__["default"].sendMessagePlayer(player.gameId, target.gameId, `${player.name} whispers, "${data.message}"`);
					_game_js__WEBPACK_IMPORTED_MODULE_5__["default"].sendMessagePlayer(player.gameId, player.gameId, `You whisper to ${target.name}, "${data.message}"`);
				}
			break;

			// God Inputs
			case 'spawnMapItem':
				if (player.adminAccess >= 2) {
					_game_js__WEBPACK_IMPORTED_MODULE_5__["default"].spawnMapItem(data.args[0], data.args[1], data.args[2], data.args[3], data.args[4]);
				}
				else {
					_game_js__WEBPACK_IMPORTED_MODULE_5__["default"].sendGameInfoPlayer(player.gameId, `You don't have access to that command.`);
				}
			break;
			case 'spawnBot':
				if (player.adminAccess >= 2) {
					_game_js__WEBPACK_IMPORTED_MODULE_5__["default"].spawnBot(data.args[0], data.args[1], data.args[2], data.args[3], data.args[4]);
				}
				else {
					_game_js__WEBPACK_IMPORTED_MODULE_5__["default"].sendGameInfoPlayer(player.gameId, `You don't have access to that command.`);
				}
			case 'setSprite':
				if (player.adminAccess >= 2) {
					player.sprite = data.args[0];
				}
				else {
					_game_js__WEBPACK_IMPORTED_MODULE_5__["default"].sendGameInfoPlayer(player.gameId, `You don't have access to that command.`);
				}
			break;
			case 'uploadMap':
				if (player.adminAccess < 2) {
					_game_js__WEBPACK_IMPORTED_MODULE_5__["default"].sendGameInfoPlayer(player.gameId, `You don't have access to that command.`);
					return;
				}

				let success = await _db_js__WEBPACK_IMPORTED_MODULE_4__["default"].saveMap(data);
				if (!success) {
					console.log("Failed to upload map.");
					return;
				}

				_game_js__WEBPACK_IMPORTED_MODULE_5__["default"].players.forEach((player) => {
					if (player.mapId === data.mapId) {
						this.sendMapData(this.socketList[player.socketId], player.mapId);
					}
				});
			break;
		}
	}

	// Send data to clients
	sendUpdatePack(updatePack) {
		_game_js__WEBPACK_IMPORTED_MODULE_5__["default"].players.forEach((player) => {
			const pack = {
				game: {
					players: []
				},
				ui: player.getUIPack()
			};

			for (let playerData of updatePack.players) {
				if (playerData && (playerData.mapId === player.mapId && (playerData.isVisible || playerData.socketId === player.socketId))) {
					pack.game.players[playerData.gameId] = playerData;
				}
			}
			// pack.game.players = updatePack.players.filter((playerData) => {
			// 	return (playerData.mapId === player.mapId && (playerData.isVisible || playerData.socketId === player.socketId));
			// });
			pack.game.bots = updatePack.bots.filter(bot => {
				return bot.mapId === player.mapId;
			});
			pack.game.items = updatePack.items.filter(item => {
				return item.mapId === player.mapId;
			});
			pack.game.effects = updatePack.effects.filter(effect => {
				return effect.mapId === player.mapId;
			});
			pack.game.texts = updatePack.texts.filter(text => {
				return text.mapId === player.mapId;
			});

			pack.ui.messages = updatePack.messages.filter((message) => {
				return ((message.mapId == null && message.id == null) || player.mapId === message.mapId || player.gameId === message.id);
			});
			
			this.socketList[player.socketId].emit('update', pack);
		});
	}
	
	sendMapData(socket, mapId) {
		const mapData = _game_js__WEBPACK_IMPORTED_MODULE_5__["default"].maps[mapId].getPack();
		socket.emit('loadMap', mapData);
	}

	async sendSignedIn(socket) {
		let account = await _db_js__WEBPACK_IMPORTED_MODULE_4__["default"].getAccount(socket.accountId);
		socket.emit('signedIn', {
			email: account.email,
			verified: account.verified,
			//dateCreated: account.dateCreated
		});
	}

	sendSignedOut(socket) {
		socket.emit('signedOut');
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
function create2dArray(columns, rows, defaultValue) {
  const array = [];
  for (let y = 0; y < rows; y++) {
    array[y] = [];
    for (let x = 0; x < columns; x++) {
      array[y][x] = defaultValue;
    }
  }
  return array;
}

function create3dArray(columns, rows, layers, defaultValue) {
  const array = [];
  for (let z = 0; z < layers; z++) {
    array[z] = []; 
    for (let y = 0; y < rows; y++) {
      array[z][y] = [];
      for (let x = 0; x < columns; x++) {
        array[z][y][x] = defaultValue;
      }
    }
  }
  return array;
}

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
  const temp = array[i];
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
  create2dArray,
  create3dArray,
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

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("bcrypt");

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

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("mongoose");

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL2FjdG9yLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy9ib3QuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL2VmZmVjdC5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2NsYXNzZXMvZW50aXR5LmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy9pdGVtLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy9tYXAuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL21lc3NhZ2UuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL3BsYXllci5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2NsYXNzZXMvdGV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2NvbmZpZy5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2RiLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvZ2FtZS5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2dhbWVsb29wLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL21vZGVscy9hY2NvdW50LmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvbW9kZWxzL2JvdFRlbXBsYXRlLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvbW9kZWxzL2l0ZW1UZW1wbGF0ZS5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL21vZGVscy9pdGVtVHlwZS5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL21vZGVscy9tYXAuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9tb2RlbHMvcGxheWVyLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvbW9kZWxzL3BsYXllclRlbXBsYXRlLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvc2VydmVyLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvdXRpbC5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJiY3J5cHRcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJleHByZXNzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZnNcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJodHRwXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibW9uZ29vc2VcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJub2RlLWdhbWVsb29wXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicGF0aFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInNvY2tldC5pb1wiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLDZJQUFxRDtBQUN0RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxtQkFBbUI7QUFDbkI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsK0RBQStEOztBQUUvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxzQkFBc0I7QUFDdEIsR0FBRzs7QUFFSDs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0EsaUJBQWlCLFlBQVksR0FBRyxlQUFlO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTs7QUFFSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7O0FBRUo7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxpQkFBaUIsa0JBQWtCO0FBQ25DO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEseURBQXlEOztBQUV6RCwyQkFBMkI7QUFDM0Isa0ZBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9CQUFvQiw4SUFBc0Q7QUFDMUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EseUJBQXlCLG1KQUEyRDtBQUNwRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrRUFBa0U7QUFDbEU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlGQUFxQywySUFBbUQ7QUFDeEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQiwwRUFBOEI7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzFwQkE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHNCQUFzQjtBQUN0Qjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0JBQW9CLDBFQUE4QjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM1T0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFO0FBQ0EsQzs7Ozs7Ozs7Ozs7Ozs7O0FDM0RBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7OztBQzNLQTtBQUNBOztBQUVBO0FBQ0EsNkJBQTZCO0FBQzdCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDNURBO0FBQ0E7QUFDQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUhBQXVFLFdBQVc7QUFDbEY7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcE1BO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDcEVBO0FBQUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN4QkE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHdGQUFpRCxzQkFBc0I7O0FBRXZFO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0osR0FBRztBQUNIO0FBQ0E7QUFDQSw0RkFBeUMsbUJBQW1CO0FBQzVEOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsdURBQXVELFNBQVM7QUFDaEU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQSw4QkFBOEIsU0FBUztBQUN2QztBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1GQUFnQyxtQkFBbUI7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLHFGQUFrQyx3QkFBd0IsR0FBRyxXQUFXO0FBQ3hFO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrRkFBK0IsV0FBVztBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9GQUFpQyxnQkFBZ0IsR0FBRyxXQUFXO0FBQy9EO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLFdBQVc7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsZ0JBQWdCLEdBQUcsV0FBVztBQUM1RDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGdGQUE0QixhQUFhO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtGQUE4QixrQkFBa0IsR0FBRyxXQUFXLEdBQUcsYUFBYTtBQUM5RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrRUFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsdUdBQW9ELGdCQUFnQjtBQUNwRTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0ZBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUZBQWtDO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrRkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzRkFBbUM7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzWUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIscUJBQXFCO0FBQ3hDO0FBQ0E7QUFDQTs7QUFFQSxtQkFBbUIsa0VBQXNCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0osR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSixHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUJBQWlCLHlCQUF5QjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLHNCQUFzQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLHVCQUF1QjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLHlCQUF5QjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLHVCQUF1QjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHdEQUFZLFNBQVMsS0FBSyxZQUFZO0FBQ3RDLDZCQUE2QixZQUFZO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlEQUFhLGdCQUFnQixLQUFLLFlBQVk7QUFDOUMsOEJBQThCLFlBQVk7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsa0VBQXNCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlFQUFhLFlBQVk7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQy9PQTtBQUFBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUNIQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSwyQ0FBMkM7QUFDeEQsYUFBYSw2QkFBNkI7QUFDMUMsVUFBVSxvRUFBb0UseUJBQXlCLDZCQUE2QixJQUFJLFFBQVEsSUFBSSxRQUFRLElBQUksUUFBUSxJQUFJLGdDQUFnQyxHQUFHLEtBQUs7QUFDcE4sYUFBYTtBQUNiLENBQUM7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7QUNWQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUyw2QkFBNkI7QUFDdEMsV0FBVyx5QkFBeUI7QUFDcEMsZUFBZSx5QkFBeUI7QUFDeEMsZ0JBQWdCLHlCQUF5QjtBQUN6QyxrQkFBa0IseUJBQXlCO0FBQzNDLGtCQUFrQix5QkFBeUI7QUFDM0MsY0FBYyx5QkFBeUI7QUFDdkMsWUFBWTtBQUNaLENBQUM7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7QUNkQTs7QUFFQTtBQUNBO0FBQ0EsUUFBUSw2QkFBNkI7QUFDckMsVUFBVSx5QkFBeUI7QUFDbkMsUUFBUSw0R0FBcUU7QUFDN0UsaUJBQWlCLHlCQUF5QjtBQUMxQyxrQkFBa0IseUJBQXlCO0FBQzNDLG9CQUFvQix5QkFBeUI7QUFDN0Msb0JBQW9CLHlCQUF5QjtBQUM3QyxnQkFBZ0IseUJBQXlCO0FBQ3pDLGtCQUFrQix5QkFBeUI7QUFDM0MsbUJBQW1CLHlCQUF5QjtBQUM1QyxxQkFBcUIseUJBQXlCO0FBQzlDLHFCQUFxQix5QkFBeUI7QUFDOUMsaUJBQWlCO0FBQ2pCLENBQUM7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuQkE7O0FBRUE7QUFDQTtBQUNBLFFBQVEsNkJBQTZCO0FBQ3JDLGdCQUFnQiw2QkFBNkI7QUFDN0MsYUFBYTtBQUNiLENBQUM7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7QUNUQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLDZCQUE2QjtBQUNyQyxjQUFjLDJCQUEyQjtBQUN6QyxnQkFBZ0IseUJBQXlCO0FBQ3pDLFNBQVMsb0NBQW9DO0FBQzdDLFVBQVUsa0NBQWtDO0FBQzVDLGFBQWEsa0NBQWtDO0FBQy9DLFVBQVUsZ0NBQWdDO0FBQzFDLFdBQVcsZ0NBQWdDO0FBQzNDLFNBQVMsZ0NBQWdDO0FBQ3pDLFNBQVM7QUFDVCxDQUFDOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7O0FDakJBOztBQUVBO0FBQ0E7QUFDQSxZQUFZLDJHQUFvRTtBQUNoRixTQUFTLDJDQUEyQztBQUNwRCxhQUFhLGtIQUEyRTtBQUN4RixVQUFVLHlCQUF5QjtBQUNuQyxlQUFlLHlCQUF5QjtBQUN4QyxVQUFVLHlCQUF5QjtBQUNuQyxNQUFNLHlCQUF5QjtBQUMvQixNQUFNLHlCQUF5QjtBQUMvQixjQUFjLDhCQUE4QjtBQUM1QyxnQkFBZ0IseUJBQXlCO0FBQ3pDO0FBQ0EsQ0FBQzs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7OztBQ2pCQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUywyQ0FBMkM7QUFDcEQsV0FBVyx5QkFBeUI7QUFDcEMsZUFBZSx5QkFBeUI7QUFDeEMsZ0JBQWdCLHlCQUF5QjtBQUN6QyxrQkFBa0IseUJBQXlCO0FBQzNDLGtCQUFrQix5QkFBeUI7QUFDM0MsY0FBYyx5QkFBeUI7QUFDdkMsbUJBQW1CLHlCQUF5QjtBQUM1QyxtQkFBbUI7QUFDbkIsQ0FBQzs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2ZBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esd0hBQTRFLDBCQUEwQjs7QUFFdEc7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esd0RBQVksVUFBVTs7QUFFdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSx3REFBWSxVQUFVO0FBQ3RCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDZDQUE2QyxTQUFTO0FBQ3REO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx3REFBWSxVQUFVLEtBQUssU0FBUztBQUNwQztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHlEQUFhLFVBQVUsS0FBSyxTQUFTO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5REFBYSxVQUFVLEtBQUssS0FBSyx5Q0FBeUMsU0FBUztBQUNuRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5REFBYSxVQUFVLEtBQUssVUFBVTtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsc0RBQXNEO0FBQ3RELHFGQUF5QyxnQkFBZ0Isd0JBQXdCLGlCQUFpQixjQUFjLFVBQVU7QUFDMUg7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkdBQStELFlBQVksV0FBVyxhQUFhO0FBQ25HO0FBQ0EsbUhBQXVFLFlBQVksVUFBVSxhQUFhO0FBQzFHO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUdBQTZELFlBQVksY0FBYyxhQUFhO0FBQ3BHLHdIQUE0RSxZQUFZLEtBQUssYUFBYTtBQUMxRztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7O0FBRUo7QUFDQTtBQUNBLElBQUk7O0FBRUo7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUM1VEE7QUFBQTtBQUNBO0FBQ0EsaUJBQWlCLFVBQVU7QUFDM0I7QUFDQSxtQkFBbUIsYUFBYTtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUIsWUFBWTtBQUM3QixrQjtBQUNBLG1CQUFtQixVQUFVO0FBQzdCO0FBQ0EscUJBQXFCLGFBQWE7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxpQkFBaUIsbUJBQW1CO0FBQ3BDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLG1CQUFtQixHQUFHLE1BQU0sR0FBRyxJQUFJLEdBQUcsS0FBSyxHQUFHLE9BQU8sR0FBRyxPQUFPO0FBQzNFOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNwSkEsbUM7Ozs7Ozs7Ozs7O0FDQUEsb0M7Ozs7Ozs7Ozs7O0FDQUEsK0I7Ozs7Ozs7Ozs7O0FDQUEsaUM7Ozs7Ozs7Ozs7O0FDQUEscUM7Ozs7Ozs7Ozs7O0FDQUEsMEM7Ozs7Ozs7Ozs7O0FDQUEsaUM7Ozs7Ozs7Ozs7O0FDQUEsc0MiLCJmaWxlIjoic2VydmVyLmFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc2VydmVyL3NyYy9tYWluLmpzXCIpO1xuIiwiaW1wb3J0IGRiIGZyb20gJy4uL2RiLmpzJztcclxuaW1wb3J0IGdhbWUgZnJvbSAnLi4vZ2FtZS5qcyc7XHJcbmltcG9ydCBjb25maWcgZnJvbSAnLi4vY29uZmlnLmpzJztcclxuaW1wb3J0IHV0aWwgZnJvbSAnLi4vdXRpbC5qcyc7XHJcbmltcG9ydCBFbnRpdHkgZnJvbSAnLi9lbnRpdHkuanMnO1xyXG5cclxuLy8gQW4gQWN0b3IgaXMgYW4gRW50aXR5IHdoaWNoIGNhbiBtb3ZlLCBhdHRhY2sgYW5kIGludGVyYWN0IHdpdGggaXRlbXNcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFjdG9yIGV4dGVuZHMgRW50aXR5IHtcclxuXHRjb25zdHJ1Y3RvcihtYXBJZCwgeCwgeSwgZGlyZWN0aW9uLCBuYW1lLCBzcHJpdGUpIHtcclxuXHRcdHNwcml0ZSA9IHV0aWwuY2xhbXAoc3ByaXRlLCAxLCBjb25maWcuTUFYX1NQUklURVMpO1xyXG5cclxuXHRcdHN1cGVyKG1hcElkLCB4LCB5LCBzcHJpdGUpO1xyXG5cdFx0dGhpcy5jb250cm9sbGVyID0gbnVsbDtcclxuXHRcdHRoaXMubmFtZSA9IG5hbWU7XHJcblx0XHR0aGlzLmRlc2NyaXB0aW9uID0gXCJcIjtcclxuXHRcdHRoaXMuaW52ZW50b3J5ID0gW107XHJcblxyXG5cdFx0dGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XHJcblx0XHR0aGlzLnN0YXJ0WCA9IHRoaXMueDtcclxuXHRcdHRoaXMuc3RhcnRZID0gdGhpcy55O1xyXG5cdFx0dGhpcy5kZXN0aW5hdGlvblggPSB0aGlzLng7XHJcblx0XHR0aGlzLmRlc3RpbmF0aW9uWSA9IHRoaXMueTtcclxuXHRcdHRoaXMubGVycCA9IDA7XHJcblxyXG5cdFx0dGhpcy5pc01vdmluZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy5pc1J1bm5pbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMubW92ZVNwZWVkID0gMi41O1xyXG5cdFx0dGhpcy5tb3ZlbWVudFRpbWVyID0gMDtcclxuXHRcdHRoaXMubGF6aW5lc3MgPSAwO1xyXG5cclxuXHRcdHRoaXMuaXNBdHRhY2tpbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMuYXR0YWNrU3BlZWQgPSAxO1xyXG5cdFx0dGhpcy5hdHRhY2tUaW1lciA9IDA7XHRcclxuXHRcdHRoaXMudGFyZ2V0ID0gbnVsbDtcclxuXHRcdHRoaXMua2lsbHMgPSAwO1xyXG5cclxuXHRcdHRoaXMuY2FsY0JvbnVzU3RhdHMoKTtcclxuXHR9XHJcblx0XHJcblx0Ly8gQ2hhcmFjdGVyIFN0YXRzXHJcblx0Z2V0IGRhbWFnZSgpIHtcclxuXHRcdGxldCBkYW1hZ2VUb3RhbCA9IHRoaXMuZGFtYWdlQmFzZSArIHRoaXMuZGFtYWdlQm9udXM7XHJcblx0XHRyZXR1cm4gKGRhbWFnZVRvdGFsIDwgMCkgPyAwIDogZGFtYWdlVG90YWw7XHJcblx0fVxyXG5cdGdldCBkZWZlbmNlKCkge1xyXG5cdFx0bGV0IGRlZmVuY2VUb3RhbCA9IHRoaXMuZGVmZW5jZUJhc2UgKyB0aGlzLmRlZmVuY2VCb251cztcclxuXHRcdHJldHVybiAoZGVmZW5jZVRvdGFsIDwgMCkgPyAwIDogZGVmZW5jZVRvdGFsO1xyXG5cdH1cclxuXHRnZXQgaGVhbHRoTWF4KCkge1xyXG5cdFx0bGV0IGhlYWx0aE1heFRvdGFsID0gdGhpcy5oZWFsdGhNYXhCYXNlICsgdGhpcy5oZWFsdGhNYXhCb251c1xyXG5cdFx0cmV0dXJuIChoZWFsdGhNYXhUb3RhbCA8IDEpID8gMSA6IGhlYWx0aE1heFRvdGFsO1xyXG5cdH1cclxuXHRnZXQgZW5lcmd5TWF4KCkge1xyXG5cdFx0bGV0IGVuZXJneU1heFRvdGFsID0gdGhpcy5lbmVyZ3lNYXhCYXNlICsgdGhpcy5lbmVyZ3lNYXhCb251cztcclxuXHRcdHJldHVybiAoZW5lcmd5TWF4VG90YWwgPCAwKSA/IDAgOiBlbmVyZ3lNYXhUb3RhbDtcclxuXHR9XHJcblx0Z2V0IHJhbmdlKCkge1xyXG5cdFx0bGV0IHJhbmdlVG90YWwgPSB0aGlzLnJhbmdlQmFzZSArIHRoaXMucmFuZ2VCb251cztcclxuXHRcdHJldHVybiAocmFuZ2VUb3RhbCA8IDEpID8gMSA6IHJhbmdlVG90YWw7XHJcblx0fVxyXG5cclxuXHRjYWxjQmFzZVN0YXRzKHRlbXBsYXRlKSB7XHJcblx0XHR0aGlzLmRhbWFnZUJhc2UgPSB0ZW1wbGF0ZS5kYW1hZ2VCYXNlIHx8IDE7XHJcblx0XHR0aGlzLmRlZmVuY2VCYXNlID0gdGVtcGxhdGUuZGVmZW5jZUJhc2UgfHwgMDtcclxuXHRcdHRoaXMuaGVhbHRoTWF4QmFzZSA9IHRlbXBsYXRlLmhlYWx0aE1heEJhc2UgKyAodGVtcGxhdGUuaGVhbHRoUGVyTGV2ZWwgKiAodGhpcy5sZXZlbCAtIDEpKSB8fCAxO1xyXG5cdFx0dGhpcy5lbmVyZ3lNYXhCYXNlID0gdGVtcGxhdGUuZW5lcmd5TWF4QmFzZSArICh0ZW1wbGF0ZS5lbmVyZ3lQZXJMZXZlbCAqICh0aGlzLmxldmVsIC0gMSkpIHx8IDE7XHJcblx0XHR0aGlzLnJhbmdlQmFzZSA9IHRlbXBsYXRlLnJhbmdlQmFzZSB8fCAxO1xyXG5cdH1cclxuXHJcblx0Y2FsY0l0ZW1Cb251cygpIHtcclxuXHRcdGNvbnN0IGl0ZW1Cb251cyA9IHtcclxuXHRcdFx0ZGFtYWdlOiAwLFxyXG5cdFx0XHRkZWZlbmNlOiAwLFxyXG5cdFx0XHRoZWFsdGhNYXg6IDAsXHJcblx0XHRcdGVuZXJneU1heDogMCxcclxuXHRcdFx0cmFuZ2U6IDBcclxuXHRcdH07XHJcblx0XHRcclxuXHRcdC8vIEZvciBlYWNoIGl0ZW0gaW4gaW52ZW50b3J5IGNoZWNrIGZvciBib251c2VzXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IChjb25maWcuSU5WRU5UT1JZX1NJWkUgKyBjb25maWcuRVFVSVBNRU5UX1NJWkUpOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgaXRlbSA9IHRoaXMuaW52ZW50b3J5W2ldO1xyXG5cdFx0XHRpZiAoaXRlbSkge1xyXG5cdFx0XHRcdGl0ZW1Cb251cy5kYW1hZ2UgKz0gaXRlbS5wYXNzaXZlLmRhbWFnZTtcclxuXHRcdFx0XHRpdGVtQm9udXMuZGVmZW5jZSArPSBpdGVtLnBhc3NpdmUuZGVmZW5jZTtcclxuXHRcdFx0XHRpdGVtQm9udXMuaGVhbHRoTWF4ICs9IGl0ZW0ucGFzc2l2ZS5oZWFsdGhNYXg7XHJcblx0XHRcdFx0aXRlbUJvbnVzLmVuZXJneU1heCArPSBpdGVtLnBhc3NpdmUuZW5lcmd5TWF4O1xyXG5cdFx0XHRcdGl0ZW1Cb251cy5yYW5nZSArPSBpdGVtLnBhc3NpdmUucmFuZ2U7XHJcblxyXG5cdFx0XHRcdGlmIChpID49IGNvbmZpZy5JTlZFTlRPUllfU0laRSkge1xyXG5cdFx0XHRcdFx0aXRlbUJvbnVzLmRhbWFnZSArPSBpdGVtLmVxdWlwcGVkLmRhbWFnZTtcclxuXHRcdFx0XHRcdGl0ZW1Cb251cy5kZWZlbmNlICs9IGl0ZW0uZXF1aXBwZWQuZGVmZW5jZTtcclxuXHRcdFx0XHRcdGl0ZW1Cb251cy5oZWFsdGhNYXggKz0gaXRlbS5lcXVpcHBlZC5oZWFsdGhNYXg7XHJcblx0XHRcdFx0XHRpdGVtQm9udXMuZW5lcmd5TWF4ICs9IGl0ZW0uZXF1aXBwZWQuZW5lcmd5TWF4O1xyXG5cdFx0XHRcdFx0aXRlbUJvbnVzLnJhbmdlICs9IGl0ZW0uZXF1aXBwZWQucmFuZ2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiBpdGVtQm9udXM7XHJcblx0fVxyXG5cclxuXHRjYWxjRWZmZWN0Qm9udXMoKSB7XHJcblx0XHRjb25zdCBlZmZlY3RCb251cyA9IHtcclxuXHRcdFx0ZGFtYWdlOiAwLFxyXG5cdFx0XHRkZWZlbmNlOiAwLFxyXG5cdFx0XHRoZWFsdGhNYXg6IDAsXHJcblx0XHRcdGVuZXJneU1heDogMCxcclxuXHRcdFx0cmFuZ2U6IDBcclxuXHRcdH07XHJcblxyXG5cdFx0Ly8gVE9ETzogd29yayBvdXQgaG93IHRvIGRvIGVmZmVjdHMgZm9yIHNwZWxscyBhbmQgcG90aW9uc1xyXG5cdFx0cmV0dXJuIGVmZmVjdEJvbnVzO1xyXG5cdH1cclxuXHRcclxuXHRjYWxjQm9udXNTdGF0cygpIHtcdC8vIEl0ZW1zIChlcXVpcHBlZCBhbmQgcGFzc2l2ZSkgYW5kIEVmZmVjdHMgKHNwZWxscyBhbmQgcG90aW9ucylcclxuXHRcdGNvbnN0IGl0ZW1Cb251cyA9IHRoaXMuY2FsY0l0ZW1Cb251cygpO1xyXG5cdFx0Y29uc3QgZWZmZWN0Qm9udXMgPSB0aGlzLmNhbGNFZmZlY3RCb251cygpO1xyXG5cclxuXHRcdHRoaXMuZGFtYWdlQm9udXMgPSBpdGVtQm9udXMuZGFtYWdlICsgZWZmZWN0Qm9udXMuZGFtYWdlO1xyXG5cdFx0dGhpcy5kZWZlbmNlQm9udXMgPSBpdGVtQm9udXMuZGVmZW5jZSArIGVmZmVjdEJvbnVzLmRlZmVuY2U7XHJcblx0XHR0aGlzLmhlYWx0aE1heEJvbnVzID0gaXRlbUJvbnVzLmhlYWx0aE1heCArIGVmZmVjdEJvbnVzLmhlYWx0aE1heDtcclxuXHRcdHRoaXMuZW5lcmd5TWF4Qm9udXMgPSBpdGVtQm9udXMuZW5lcmd5TWF4ICsgZWZmZWN0Qm9udXMuZW5lcmd5TWF4O1xyXG5cdFx0dGhpcy5yYW5nZUJvbnVzID0gaXRlbUJvbnVzLnJhbmdlICsgZWZmZWN0Qm9udXMucmFuZ2U7XHJcblx0fVxyXG5cclxuXHRjYWxjU3RhdHMoKSB7XHJcblx0XHR0aGlzLmNhbGNCYXNlU3RhdHMoKTtcclxuXHRcdHRoaXMuY2FsY0JvbnVzU3RhdHMoKTtcclxuXHR9XHJcblxyXG5cdHJlc3RvcmUoKSB7XHJcblx0XHR0aGlzLmhlYWx0aCA9IHRoaXMuaGVhbHRoTWF4O1xyXG5cdFx0dGhpcy5lbmVyZ3kgPSB0aGlzLmVuZXJneU1heDtcclxuXHR9XHJcblx0XHJcblx0Ly8gTW92ZW1lbnRcclxuXHRtb3ZlKGRpcmVjdGlvbikge1xyXG5cdFx0aWYgKHRoaXMuaXNNb3ZpbmcpIHJldHVybjtcclxuXHJcblx0XHRpZiAoZGlyZWN0aW9uKSB7XHJcblx0XHRcdHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChkaXJlY3Rpb24gPT09ICdsZWZ0Jykge1xyXG5cdFx0XHRpZiAoIWdhbWUuaXNWYWNhbnQodGhpcy5tYXBJZCwgdGhpcy54IC0gMSwgdGhpcy55KSkgcmV0dXJuO1xyXG5cdFx0XHR0aGlzLmRlc3RpbmF0aW9uWC0tO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoZGlyZWN0aW9uID09PSAncmlnaHQnKSB7XHJcblx0XHRcdGlmICghZ2FtZS5pc1ZhY2FudCh0aGlzLm1hcElkLCB0aGlzLnggKyAxLCB0aGlzLnkpKSByZXR1cm47XHJcblx0XHRcdHRoaXMuZGVzdGluYXRpb25YKys7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChkaXJlY3Rpb24gPT09ICd1cCcpIHtcclxuXHRcdFx0aWYgKCFnYW1lLmlzVmFjYW50KHRoaXMubWFwSWQsIHRoaXMueCwgdGhpcy55IC0gMSkpIHJldHVybjtcclxuXHRcdFx0dGhpcy5kZXN0aW5hdGlvblktLTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ2Rvd24nKSB7XHJcblx0XHRcdGlmICghZ2FtZS5pc1ZhY2FudCh0aGlzLm1hcElkLCB0aGlzLngsIHRoaXMueSArIDEpKSByZXR1cm47XHJcblx0XHRcdHRoaXMuZGVzdGluYXRpb25ZKys7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0c3dpdGNoICh1dGlsLnJhbmRvbUludCgwLCAzICsgdGhpcy5sYXppbmVzcykpIHtcclxuXHRcdFx0XHRjYXNlIDA6IHRoaXMubW92ZSgnbGVmdCcpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgMTogdGhpcy5tb3ZlKCdyaWdodCcpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgMjogdGhpcy5tb3ZlKCd1cCcpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgMzogdGhpcy5tb3ZlKCdkb3duJyk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0ZGVmYXVsdDogLy8gRG9uJ3QgTW92ZVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBTZXQgbW92ZSBzcGVlZFxyXG5cdFx0aWYgKHRoaXMuaXNSdW5uaW5nKSB7XHJcblx0XHRcdGlmICh0aGlzLmVuZXJneSA+IDApIHtcclxuXHRcdFx0XHR0aGlzLmVuZXJneS0tO1xyXG5cdFx0XHRcdHRoaXMubW92ZVNwZWVkID0gNDtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHR0aGlzLmVuZXJneSA9IDA7XHJcblx0XHRcdFx0dGhpcy5tb3ZlU3BlZWQgPSAyLjU7XHJcblx0XHRcdFx0dGhpcy5pc1J1bm5pbmcgPSBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHRoaXMubW92ZVNwZWVkID0gMi41O1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR0aGlzLmlzTW92aW5nID0gdHJ1ZTtcclxuXHR9XHJcblx0XHJcblx0bW92ZVRvVGFyZ2V0KHRhcmdldCwgaG9zdGlsZSkge1xyXG5cdFx0aWYgKCF0YXJnZXQpIHJldHVybjtcclxuXHRcdFxyXG5cdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggJiYgdGFyZ2V0LnkgPT09IHRoaXMueSkge1xyXG5cdFx0XHR0aGlzLm1vdmUoKTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKHV0aWwucmFuZG9tSW50KDAsIDEpID09PSAwKSB7XHJcblx0XHRcdGlmICh0YXJnZXQueCA8IHRoaXMueCkge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQueCA+PSAodGhpcy54IC0gdGhpcy5yYW5nZSkgJiYgdGFyZ2V0LnkgPT09IHRoaXMueSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnbGVmdCc7XHJcblx0XHRcdFx0XHRcdGlmICghdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCdsZWZ0Jyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ2xlZnQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodGFyZ2V0LnggPiB0aGlzLngpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LnggPT09IHRoaXMueCArIHRoaXMucmFuZ2UgJiYgdGFyZ2V0LnkgPT09IHRoaXMueSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAncmlnaHQnO1xyXG5cdFx0XHRcdFx0XHRpZiAoIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmF0dGFjaygncmlnaHQnKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSgncmlnaHQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodGFyZ2V0LnkgPCB0aGlzLnkpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LnggPT09IHRoaXMueCAmJiB0YXJnZXQueSA9PT0gdGhpcy55IC0gdGhpcy5yYW5nZSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAndXAnO1xyXG5cdFx0XHRcdFx0XHRpZiAoIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmF0dGFjaygndXAnKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSgndXAnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodGFyZ2V0LnkgPiB0aGlzLnkpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LnggPT09IHRoaXMueCAmJiB0YXJnZXQueSA9PT0gdGhpcy55ICsgdGhpcy5yYW5nZSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnZG93bic7XHJcblx0XHRcdFx0XHRcdGlmICghdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCdkb3duJyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ2Rvd24nKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRpZiAodGFyZ2V0LnkgPiB0aGlzLnkpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LnggPT09IHRoaXMueCAmJiB0YXJnZXQueSA9PT0gdGhpcy55ICsgdGhpcy5yYW5nZSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUpIHtcclxuXHRcdFx0XHRcdFx0aWYgKCF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ2Rvd24nKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSgnZG93bicpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICh0YXJnZXQueSA8IHRoaXMueSkge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICYmIHRhcmdldC55ID09PSB0aGlzLnkgLSB0aGlzLnJhbmdlKSB7XHJcblx0XHRcdFx0XHRpZiAoaG9zdGlsZSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmF0dGFjaygndXAnKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSgndXAnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodGFyZ2V0LnggPiB0aGlzLngpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LnggPT09IHRoaXMueCArIHRoaXMucmFuZ2UgJiYgdGFyZ2V0LnkgPT09IHRoaXMueSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUpIHtcclxuXHRcdFx0XHRcdFx0aWYgKCF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ3JpZ2h0Jyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ3JpZ2h0Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHRhcmdldC54IDwgdGhpcy54KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID49ICh0aGlzLnggLSB0aGlzLnJhbmdlKSAmJiB0YXJnZXQueSA9PT0gdGhpcy55KSB7XHJcblx0XHRcdFx0XHRpZiAoaG9zdGlsZSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmF0dGFjaygnbGVmdCcpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCdsZWZ0Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdC8vIENvbWJhdFxyXG5cdGNoZWNrSW5SYW5nZShkaXJlY3Rpb24sIHRhcmdldCwgcmFuZ2UpIHtcclxuXHRcdGlmICh0YXJnZXQubWFwSWQgIT09IHRoaXMubWFwSWQpIHJldHVybiBmYWxzZTtcclxuXHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICYmIHRhcmdldC55ID09PSB0aGlzLnkpIHJldHVybiBmYWxzZTtcdC8vIFN0YWNrZWQgZG9lcyBub3QgY291bnQgYXMgaW4gcmFuZ2VcclxuXHRcdFxyXG5cdFx0aWYgKHRhcmdldC55ID09PSB0aGlzLnkpIHtcclxuXHRcdFx0aWYgKGRpcmVjdGlvbiA9PT0gJ2xlZnQnKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMueCA9PT0gMCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHJldHVybiAodGFyZ2V0LnggPCB0aGlzLnggJiYgdGFyZ2V0LnggPj0gKHRoaXMueCAtIHJhbmdlKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ3JpZ2h0Jykge1xyXG5cdFx0XHRcdGlmICh0aGlzLnggPT09IGNvbmZpZy5NQVBfQ09MVU1OUyAtIDEpIHtcclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gKHRhcmdldC54ID4gdGhpcy54ICYmIHRhcmdldC54IDw9ICh0aGlzLnggKyByYW5nZSkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAodGFyZ2V0LnggPT09IHRoaXMueCkge1xyXG5cdFx0XHRpZiAoZGlyZWN0aW9uID09PSAndXAnKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMueSA9PT0gMCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHJldHVybiAodGFyZ2V0LnkgPCB0aGlzLnkgJiYgdGFyZ2V0LnkgPj0gKHRoaXMueSAtIHJhbmdlKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ2Rvd24nKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMueSA9PT0gY29uZmlnLk1BUF9ST1dTIC0gMSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHJldHVybiAodGFyZ2V0LnkgPiB0aGlzLnkgJiYgdGFyZ2V0LnkgPD0gKHRoaXMueSArIHJhbmdlKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblxyXG5cdGF0dGFjayhudW1UYXJnZXRzID0gMSwgZGlyZWN0aW9uID0gdGhpcy5kaXJlY3Rpb24pIHtcclxuXHRcdGlmICh0aGlzLmlzQXR0YWNraW5nIHx8IHRoaXMuYXR0YWNrVGltZXIgPiAwKSByZXR1cm47XHJcblxyXG5cdFx0dGhpcy5pc0F0dGFja2luZyA9IHRydWU7XHJcblx0XHRcclxuXHRcdGNvbnN0IHBsYXllckxpc3QgPSBnYW1lLnBsYXllcnMuZmlsdGVyKHBsYXllciA9PiBwbGF5ZXIubWFwSWQgPT09IHRoaXMubWFwSWQpO1xyXG5cdFx0Y29uc3QgYm90TGlzdCA9IGdhbWUuYm90cy5maWx0ZXIoYm90ID0+IGJvdC5tYXBJZCA9PT0gdGhpcy5tYXBJZCk7XHJcblx0XHRjb25zdCBhY3Rvckxpc3QgPSBwbGF5ZXJMaXN0LmNvbmNhdChib3RMaXN0KTtcclxuXHRcdGxldCB0YXJnZXRMaXN0ID0gYWN0b3JMaXN0LmZpbHRlcigoYWN0b3IpID0+IHtcclxuXHRcdFx0aWYgKGFjdG9yID09PSB0aGlzIHx8IGFjdG9yLmlzRGVhZCkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRpZiAodGhpcy5jaGVja0luUmFuZ2UoZGlyZWN0aW9uLCBhY3RvciwgdGhpcy5yYW5nZSkpIHJldHVybiB0cnVlO1xyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcdHRhcmdldExpc3Quc29ydCgoYSwgYikgPT4ge1xyXG5cdFx0XHRyZXR1cm4gKGEueiAtIGIueik7XHQvLyBMb3dlc3QgdG8gaGlnaGVzdFxyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcdHRhcmdldExpc3QgPSB0YXJnZXRMaXN0LnNwbGljZSgtbnVtVGFyZ2V0cyk7XHJcblx0XHRcclxuXHRcdHRhcmdldExpc3QuZm9yRWFjaCgodGFyZ2V0KSA9PiB7XHJcblx0XHRcdHRhcmdldC50YWtlRGFtYWdlKHRoaXMuZGFtYWdlLCB0aGlzKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRcclxuXHR0YWtlRGFtYWdlKGRhbWFnZSwgc291cmNlKSB7XHJcblx0XHRjb25zb2xlLmxvZyhgJHt0aGlzLmhlYWx0aH0vJHt0aGlzLmhlYWx0aE1heH1gKTtcclxuXHRcdGRhbWFnZSAtPSB0aGlzLmRlZmVuY2U7XHJcblx0XHRpZiAoZGFtYWdlIDwgMCkge1xyXG5cdFx0XHRkYW1hZ2UgPSAwO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHRoaXMuaGVhbHRoIC09IGRhbWFnZTtcclxuXHRcdFx0aWYgKHRoaXMuaGVhbHRoIDw9IDApIHtcclxuXHRcdFx0XHR0aGlzLnNldERlYWQoc291cmNlLmNvbnRyb2xsZXIsIHNvdXJjZS5uYW1lKTtcclxuXHRcdFx0XHRzb3VyY2Uua2lsbHMrKztcclxuXHRcdFx0XHRpZiAoc291cmNlLnRhcmdldCA9PT0gdGhpcykgc291cmNlLnRhcmdldCA9IG51bGw7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGdhbWUuc3Bhd25EYW1hZ2VUZXh0KHRoaXMubWFwSWQsIHRoaXMueCwgdGhpcy55LCBkYW1hZ2UpO1xyXG5cdH1cdFxyXG5cclxuXHRzZXREZWFkKCkge1xyXG5cdFx0bGV0IG1hcCA9IGdhbWUubWFwc1t0aGlzLm1hcElkXTtcclxuXHJcblx0XHQvLyBJbnZlbnRvcnkgSXRlbSBEcm9wIENoYW5jZVxyXG5cdFx0bGV0IGRyb3BDaGFuY2UgPSB1dGlsLmNsYW1wKG1hcC5kcm9wQ2hhbmNlLCAwLCAxMDApO1xyXG5cdFx0aWYgKGRyb3BDaGFuY2UgPiAwKSB7XHJcblx0XHRcdGxldCBpdGVtcyA9IHRoaXMuaW52ZW50b3J5LmZpbHRlcigoaXRlbSkgPT4ge1xyXG5cdFx0XHRcdGlmICghaXRlbSkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdGlmIChpdGVtLnNsb3QgPCBjb25maWcuSU5WRU5UT1JZX1NJWkUpIHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XHJcblx0XHRcdFx0aWYgKCFpdGVtKSByZXR1cm47XHJcblx0XHRcdFx0aWYgKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMSkgPD0gZHJvcENoYW5jZSkge1xyXG5cdFx0XHRcdFx0dGhpcy5kcm9wSXRlbShpdGVtLnNsb3QpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gRXF1aXBwZWQgSXRlbSBEcm9wIEFtb3VudFxyXG5cdFx0bGV0IGRyb3BBbW91bnRFUSA9IHV0aWwuY2xhbXAobWFwLmRyb3BBbW91bnRFUSwgMCwgY29uZmlnLkVRVUlQTUVOVF9TSVpFKTtcclxuXHRcdGlmIChkcm9wQW1vdW50RVEgPiAwKSB7XHJcblx0XHRcdGxldCBlcXVpcG1lbnQgPSB0aGlzLmludmVudG9yeS5maWx0ZXIoKGl0ZW0pID0+IHtcclxuXHRcdFx0XHRpZiAoaXRlbSAmJiBpdGVtLnNsb3QgPj0gY29uZmlnLklOVkVOVE9SWV9TSVpFKSByZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0ZXF1aXBtZW50ID0gdXRpbC5zaHVmZmxlKGVxdWlwbWVudCk7XHJcblx0XHRcdGVxdWlwbWVudC5zcGxpY2UoLWRyb3BBbW91bnRFUSk7XHJcblx0XHRcdGVxdWlwbWVudC5mb3JFYWNoKChpdGVtKSA9PiB7XHJcblx0XHRcdFx0dGhpcy5kcm9wSXRlbShlcXVpcG1lbnQuc2xvdCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHQvLyBJbnZlbnRvcnlcclxuXHRwaWNrVXAoKSB7XHJcblx0XHRjb25zdCBpdGVtcyA9IGdhbWUuaXRlbXMuZmlsdGVyKGl0ZW0gPT4ge1xyXG5cdFx0XHRyZXR1cm4gaXRlbS5tYXBJZCA9PT0gdGhpcy5tYXBJZCAmJiBpdGVtLnggPT09IHRoaXMueCAmJiBpdGVtLnkgPT09IHRoaXMueTtcclxuXHRcdH0pO1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRjb25zdCBpdGVtID0gaXRlbXNbaV07XHJcblx0XHRcdGlmIChpdGVtKSB7XHJcblx0XHRcdFx0Ly8gaWYgaXRlbSBpcyBzdGFja2FibGUgYW5kIHlvdSBhbHJlYWR5IGhhdmUgc29tZVxyXG5cdFx0XHRcdGlmIChpdGVtLnN0YWNrYWJsZSkge1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNvbnN0IHNsb3QgPSB0aGlzLmZpbmRGaXJzdEVtcHR5U2xvdCgpO1xyXG5cdFx0XHRcdGlmIChzbG90ID09IG51bGwpIHJldHVybiBmYWxzZTtcclxuXHJcblx0XHRcdFx0aXRlbS5wbGF5ZXJJZCA9IHRoaXMucGxheWVySWQ7XHJcblx0XHRcdFx0aXRlbS5ib3RJZCA9IHRoaXMuYm90SWQ7XHJcblx0XHRcdFx0aXRlbS5zbG90ID0gc2xvdDtcclxuXHRcdFx0XHRpdGVtLm1hcElkID0gbnVsbDtcclxuXHRcdFx0XHRpdGVtLnggPSBudWxsO1xyXG5cdFx0XHRcdGl0ZW0ueSA9IG51bGw7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0Z2V0TWFwSXRlbShtYXBJZCwgaWQpIHtcclxuXHRcdGxldCBpdGVtID0gZ2FtZS5tYXBzW21hcElkXS5pdGVtc1tpZF07XHJcblx0XHRpZiAoIWl0ZW0pIHJldHVybiBudWxsO1xyXG5cclxuXHRcdGlmIChpdGVtLnN0YWNrID4gMCkge1xyXG5cdFx0XHRsZXQgc2xvdCA9IHRoaXMuZmluZEl0ZW1TbG90KGl0ZW0uaXRlbVRlbXBsYXRlKTtcclxuXHRcdFx0aWYgKHNsb3QgPj0gMCkge1xyXG5cdFx0XHRcdHRoaXMuaW52ZW50b3J5W3Nsb3RdLnN0YWNrICs9IGl0ZW0uc3RhY2s7XHJcblx0XHRcdFx0aXRlbS5yZW1vdmUoKTtcclxuXHRcdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBzbG90ID0gdGhpcy5maW5kRmlyc3RFbXB0eVNsb3QoKTtcclxuXHRcdHJldHVybiBzbG90O1xyXG5cdH1cclxuXHJcblx0Z2V0SXRlbShkYXRhKSB7XHJcblx0XHRpZiAoIWRhdGEgfHwgZGF0YS5pdGVtVGVtcGxhdGUgPT0gbnVsbCkgcmV0dXJuIG51bGw7XHJcblxyXG5cdFx0aWYgKGRhdGEuc3RhY2spIHtcclxuXHRcdFx0c2xvdCA9IHRoaXMuZmluZEl0ZW1TbG90KGRhdGEuaXRlbVRlbXBsYXRlKTtcclxuXHRcdFx0aWYgKHNsb3QgPj0gMCkge1xyXG5cdFx0XHRcdHRoaXMuaW52ZW50b3J5W3Nsb3RdLnN0YWNrICs9IGRhdGEuc3RhY2s7XHJcblx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGhpcy5maW5kRmlyc3RFbXB0eVNsb3QoKTtcclxuXHR9XHJcblx0XHJcblx0ZHJvcEl0ZW0oc2xvdCkge1xyXG5cdFx0bGV0IGl0ZW0gPSB0aGlzLmludmVudG9yeVtzbG90XTtcclxuXHRcdGlmICghaXRlbSkgcmV0dXJuO1xyXG5cdFx0XHJcblx0XHRpZiAoc2xvdCA+PSBjb25maWcuSU5WRU5UT1JZX1NJWkUpIHtcclxuXHRcdFx0dGhpcy51bmVxdWlwSXRlbShzbG90KTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGl0ZW0ubW92ZVRvTWFwKHRoaXMubWFwSWQsIHRoaXMueCwgdGhpcy55KTtcclxuXHR9XHJcblx0XHJcblx0dXNlSXRlbShzbG90KSB7XHJcblx0XHRsZXQgaXRlbSA9IHRoaXMuaW52ZW50b3J5W3Nsb3RdO1xyXG5cdFx0aWYgKCFpdGVtKSByZXR1cm47XHJcblxyXG5cdFx0Ly8gaWYgKCFkYi5pdGVtc1tpdGVtLmlkXS51c2UuY2FsbCh0aGlzLCBzbG90KSkgcmV0dXJuO1x0Ly8gUnVuICd1c2UnIHNjcmlwdFxyXG5cclxuXHRcdGlmIChpdGVtLmlzRXF1aXBtZW50KCkpIHtcdC8vIEVxdWlwbWVudCBJdGVtc1xyXG5cdFx0XHRpZiAoc2xvdCA8IGNvbmZpZy5JTlZFTlRPUllfU0laRSkge1x0Ly8gQ2hlY2sgaWYgaXRlbSBpcyBlcXVpcHBlZFxyXG5cdFx0XHRcdHRoaXMuZXF1aXBJdGVtKHNsb3QpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMudW5lcXVpcEl0ZW0oc2xvdCk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChpdGVtLnJldXNhYmxlKSByZXR1cm47XHJcblx0XHRcclxuXHRcdGlmIChpdGVtLnN0YWNrID4gMSkge1xyXG5cdFx0XHRpdGVtLnN0YWNrLS07XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpdGVtLnJlbW92ZSgpO1xyXG5cdH1cclxuXHRcclxuXHRoYXNJdGVtKHRlbXBsYXRlSWQpIHtcclxuXHRcdGxldCBjb3VudCA9IDA7XHJcblx0XHRmb3IgKGxldCBzbG90ID0gMDsgc2xvdCA8IGNvbmZpZy5JTlZFTlRPUllfU0laRSArIGNvbmZpZy5FUVVJUE1FTlRfU0laRTsgc2xvdCsrKSB7XHJcblx0XHRcdGlmICh0aGlzLmludmVudG9yeVtzbG90XSkge1xyXG5cdFx0XHRcdGlmICh0aGlzLmludmVudG9yeVtzbG90XS5pdGVtVGVtcGxhdGUgPT09IGl0ZW1UZW1wbGF0ZSkge1xyXG5cdFx0XHRcdFx0Y291bnQrKztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBjb3VudDtcclxuXHR9XHJcblxyXG5cdGZpbmRJdGVtU2xvdChpdGVtVGVtcGxhdGUpIHtcclxuXHRcdGxldCBzbG90ID0gbnVsbDtcclxuXHRcdGZvciAobGV0IGNoZWNrU2xvdCA9IDA7IGNoZWNrU2xvdCA8IGNvbmZpZy5JTlZFTlRPUllfU0laRSArIGNvbmZpZy5FUVVJUE1FTlRfU0laRTsgY2hlY2tTbG90KyspIHtcclxuXHRcdFx0aWYgKHRoaXMuaW52ZW50b3J5W2NoZWNrU2xvdF0pIHtcclxuXHRcdFx0XHRpZiAodGhpcy5pbnZlbnRvcnlbY2hlY2tTbG90XS5pdGVtVGVtcGxhdGUgPT09IGl0ZW1UZW1wbGF0ZSkge1xyXG5cdFx0XHRcdFx0c2xvdCA9IGNoZWNrU2xvdDtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHNsb3Q7XHJcblx0fVxyXG5cdFxyXG5cdG1vdmVJdGVtVG9TbG90KHNsb3QsIG5ld1Nsb3QpIHtcclxuXHRcdGlmIChzbG90ID09IG51bGwgfHwgbmV3U2xvdCA9PSBudWxsIHx8IHNsb3QgPT09IG5ld1Nsb3QpIHJldHVybjtcdC8vIG51bGwgPT0gdW5kZWZpbmVkLCBudWxsICE9IDBcclxuXHRcdGlmIChzbG90ID49IGNvbmZpZy5JTlZFTlRPUllfU0laRSArIGNvbmZpZy5FUVVJUE1FTlRfU0laRSkgcmV0dXJuO1xyXG5cdFx0aWYgKG5ld1Nsb3QgPj0gY29uZmlnLklOVkVOVE9SWV9TSVpFICsgY29uZmlnLkVRVUlQTUVOVF9TSVpFKSByZXR1cm47XHJcblxyXG5cdFx0bGV0IGl0ZW0gPSB0aGlzLmludmVudG9yeVtzbG90XTtcclxuXHRcdGxldCBuZXdJdGVtID0gdGhpcy5pbnZlbnRvcnlbbmV3U2xvdF07XHJcblx0XHRpZiAoIWl0ZW0pIHJldHVybjtcclxuXHJcblx0XHQvLyBUYXJnZXQgc2xvdCBpcyBmb3IgZXF1aXBtZW50IC0gY2hlY2sgdHlwZSBtYXRjaGVzXHJcblx0XHRpZiAobmV3U2xvdCA+PSBjb25maWcuSU5WRU5UT1JZX1NJWkUpIHtcclxuXHRcdFx0aWYgKCFpdGVtLmNhbkVxdWlwKG5ld1Nsb3QpKSB7XHJcblx0XHRcdFx0Z2FtZS5zZW5kR2FtZUluZm9QbGF5ZXIodGhpcy5pZCwgXCJUaGF0IGNhbm5vdCBiZSBlcXVpcHBlZCB0aGVyZS5cIik7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3Qgc3dhcFNsb3RzID0gKCkgPT4ge1xyXG5cdFx0XHRpdGVtLnNsb3QgPSBuZXdTbG90O1xyXG5cdFx0XHRpZiAobmV3SXRlbSkgbmV3SXRlbS5zbG90ID0gc2xvdDtcclxuXHRcdFx0dXRpbC5zd2FwKHRoaXMuaW52ZW50b3J5LCBzbG90LCBuZXdTbG90KTtcclxuXHRcdFx0dGhpcy5jYWxjQm9udXNTdGF0cygpO1xyXG5cdFx0fTtcclxuXHJcblx0XHQvLyBJRiBObyBuZXcgaXRlbSBpbiBuZXcgc2xvdFxyXG5cdFx0Ly8gT1IgTmV3IGl0ZW0gaW4gbmV3IHNsb3QsIG9sZCBpdGVtIGluIGludmVudG9yeVxyXG5cdFx0Ly8gT1IgTmV3IGl0ZW0gaW4gbmV3IHNsb3QsIG9sZCBpdGVtIGlzIGVxdWlwcGVkLCBuZXcgaXRlbSBjYW4gYmUgZXF1aXBwZWQgaW4gb2xkIHNsb3RcclxuXHRcdGlmICghbmV3SXRlbSB8fCBzbG90IDwgY29uZmlnLklOVkVOVE9SWV9TSVpFIHx8IG5ld0l0ZW0uY2FuRXF1aXAoc2xvdCkpIHtcclxuXHRcdFx0c3dhcFNsb3RzKCk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Ly8gT2xkIGl0ZW0gaXMgZXF1aXBwZWQsIG5ldyBpdGVtIGNhbm5vdCBiZSBlcXVpcHBlZCBpbiBvbGQgc2xvdFxyXG5cdFx0XHRuZXdTbG90ID0gdGhpcy5maW5kRmlyc3RFbXB0eVNsb3QoKTtcclxuXHRcdFx0aWYgKG5ld1Nsb3QgIT0gbnVsbCkge1xyXG5cdFx0XHRcdHN3YXBTbG90cygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdGdhbWUuc2VuZEdhbWVJbmZvUGxheWVyKHRoaXMuaWQsIFwiWW91ciBpbnZlbnRvcnkgaXMgZnVsbC5cIik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGVxdWlwSXRlbShzbG90KSB7XHJcblx0XHRsZXQgbmV3U2xvdCA9IG51bGw7XHJcblx0XHRmb3IgKGxldCBpID0gY29uZmlnLklOVkVOVE9SWV9TSVpFOyBpIDwgY29uZmlnLklOVkVOVE9SWV9TSVpFICsgY29uZmlnLkVRVUlQTUVOVF9TSVpFOyBpKyspIHtcclxuXHRcdFx0aWYgKHRoaXMuaW52ZW50b3J5W3Nsb3RdLmNhbkVxdWlwKGkpKSB7XHJcblx0XHRcdFx0bmV3U2xvdCA9IGk7XHJcblx0XHRcdFx0aWYgKCF0aGlzLmludmVudG9yeVtpXSkgYnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmIChuZXdTbG90ID09PSBudWxsKSByZXR1cm47XHJcblxyXG5cdFx0dGhpcy5tb3ZlSXRlbVRvU2xvdChzbG90LCBuZXdTbG90KTtcclxuXHR9XHJcblxyXG5cdHVuZXF1aXBJdGVtKHNsb3QpIHtcclxuXHRcdGlmIChzbG90IDwgY29uZmlnLklOVkVOVE9SWV9TSVpFKSByZXR1cm47XHJcblx0XHRpZiAoIXRoaXMuaW52ZW50b3J5W3Nsb3RdKSByZXR1cm47XHJcblx0XHRcclxuXHRcdGxldCBuZXdTbG90ID0gdGhpcy5maW5kRmlyc3RFbXB0eVNsb3QoKTtcclxuXHRcdGlmIChuZXdTbG90ID09IG51bGwpIHtcclxuXHRcdFx0Z2FtZS5zZW5kR2FtZUluZm9QbGF5ZXIodGhpcy5pZCwgXCJZb3VyIGludmVudG9yeSBpcyBmdWxsLlwiKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMubW92ZUl0ZW1Ub1Nsb3Qoc2xvdCwgbmV3U2xvdCk7XHJcblx0fVxyXG5cdFxyXG5cdGZpbmRGaXJzdEVtcHR5U2xvdCgpIHtcclxuXHRcdGZvciAobGV0IHNsb3QgPSAwOyBzbG90IDwgY29uZmlnLklOVkVOVE9SWV9TSVpFOyBzbG90KyspIHtcclxuXHRcdFx0aWYgKHRoaXMuaW52ZW50b3J5W3Nsb3RdID09IG51bGwpIHJldHVybiBzbG90O1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fVxyXG5cclxuXHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHQvLyBJbnZlbnRvcnkgSXRlbSBVcGRhdGVcclxuXHRcdHRoaXMuaW52ZW50b3J5LmZvckVhY2goKGl0ZW0pID0+IHtcclxuXHRcdFx0aWYgKGl0ZW0pIGl0ZW0udXBkYXRlKCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRpZiAodGhpcy5pc0RlYWQpIHJldHVybjtcclxuXHRcdFxyXG5cdFx0Ly8gQXR0YWNraW5nXHJcblx0XHRpZiAodGhpcy5pc0F0dGFja2luZyB8fCB0aGlzLmF0dGFja1RpbWVyID4gMCkge1xyXG5cdFx0XHR0aGlzLmF0dGFja1RpbWVyICs9IGRlbHRhO1xyXG5cdFx0XHRpZiAodGhpcy5hdHRhY2tUaW1lciA+PSAwLjMpIHRoaXMuaXNBdHRhY2tpbmcgPSBmYWxzZTtcclxuXHRcdFx0aWYgKHRoaXMuYXR0YWNrVGltZXIgPj0gdGhpcy5hdHRhY2tTcGVlZCkgdGhpcy5hdHRhY2tUaW1lciA9IDA7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vIE1vdmVtZW50XHJcblx0XHRpZiAodGhpcy5pc01vdmluZykge1xyXG5cdFx0XHR0aGlzLmxlcnAgKz0gZGVsdGEgKiB0aGlzLm1vdmVTcGVlZDtcclxuXHRcdFx0XHJcblx0XHRcdGlmICh0aGlzLmxlcnAgPj0gMC40OSkge1xyXG5cdFx0XHRcdHRoaXMueCA9IHRoaXMuZGVzdGluYXRpb25YO1xyXG5cdFx0XHRcdHRoaXMueSA9IHRoaXMuZGVzdGluYXRpb25ZO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAodGhpcy5sZXJwID49IDAuOTkpIHtcclxuXHRcdFx0XHR0aGlzLnN0YXJ0WCA9IHRoaXMuZGVzdGluYXRpb25YO1xyXG5cdFx0XHRcdHRoaXMuc3RhcnRZID0gdGhpcy5kZXN0aW5hdGlvblk7XHJcblx0XHRcdFx0dGhpcy5sZXJwID0gMDtcclxuXHRcdFx0XHR0aGlzLmlzTW92aW5nID0gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGdldEludmVudG9yeVBhY2soKSB7XHJcblx0XHRsZXQgaW52ZW50b3J5UGFjayA9IFtdO1xyXG5cdFx0XHJcblx0XHR0aGlzLmludmVudG9yeS5mb3JFYWNoKChpdGVtKSA9PiB7XHJcblx0XHRcdGlmICghaXRlbSkgcmV0dXJuO1xyXG5cdFx0XHRpbnZlbnRvcnlQYWNrW2l0ZW0uc2xvdF0gPSBpdGVtLmdldFBhY2soKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBpbnZlbnRvcnlQYWNrO1xyXG5cdH1cclxufVxyXG4iLCJpbXBvcnQgZ2FtZSBmcm9tICcuLi9nYW1lLmpzJztcclxuaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9jb25maWcuanMnO1xyXG5pbXBvcnQgdXRpbCBmcm9tICcuLi91dGlsLmpzJztcclxuaW1wb3J0IEFjdG9yIGZyb20gJy4vYWN0b3IuanMnO1xyXG5cclxuLy8gQSBCb3QgaXMgYW4gQWN0b3Igd2l0aCBjb25kaXRpb25hbCBpbnB1dHNcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJvdCBleHRlbmRzIEFjdG9yIHtcclxuXHRjb25zdHJ1Y3RvcihtYXBJZCwgeCwgeSwgZGlyZWN0aW9uLCB0ZW1wbGF0ZSkge1xyXG5cdFx0c3VwZXIobWFwSWQsIHgsIHksIGRpcmVjdGlvbiwgdGVtcGxhdGUubmFtZSwgdGVtcGxhdGUuc3ByaXRlKTtcclxuXHRcdHRoaXMuY29udHJvbGxlciA9ICdib3QnO1xyXG5cdFx0dGhpcy5kYW1hZ2VCYXNlID0gdGVtcGxhdGUuZGFtYWdlQmFzZTtcclxuXHRcdHRoaXMuZGVmZW5jZUJhc2UgPSB0ZW1wbGF0ZS5kZWZlbmNlQmFzZTtcclxuXHRcdHRoaXMuaGVhbHRoTWF4QmFzZSA9IHRlbXBsYXRlLmhlYWx0aE1heEJhc2U7XHJcblx0XHR0aGlzLmVuZXJneU1heEJhc2UgPSB0ZW1wbGF0ZS5lbmVyZ3lNYXhCYXNlO1xyXG5cdFx0dGhpcy5yYW5nZUJhc2UgPSB0ZW1wbGF0ZS5yYW5nZUJhc2U7XHJcblx0XHR0aGlzLnJlc3RvcmUoKTtcclxuXHRcdFxyXG5cdFx0dGhpcy5ob3N0aWxlID0gdGVtcGxhdGUuaG9zdGlsZTtcclxuXHRcdHRoaXMudGFyZ2V0ID0gbnVsbDtcclxuXHRcdHRoaXMuc2V0VGFzaygnd2FuZGVyaW5nJyk7XHJcblx0XHR0aGlzLm1vdmVUaW1lciA9IDA7XHJcblxyXG5cdFx0dGhpcy5nYW1lSWQgPSB1dGlsLmZpcnN0RW1wdHlJbmRleChnYW1lLmJvdHMpO1xyXG5cdFx0Z2FtZS5ib3RzW3RoaXMuZ2FtZUlkXSA9IHRoaXM7XHJcblx0fVxyXG5cdFxyXG5cdGdldE1hcEl0ZW0obWFwSWQsIGlkKSB7XHJcblx0XHRjb25zdCBzbG90ID0gc3VwZXIuZ2V0TWFwSXRlbShtYXBJZCwgaWQpO1xyXG5cdFx0aWYgKHNsb3QgPT0gbnVsbCkgcmV0dXJuO1xyXG5cdFx0XHJcblx0XHRjb25zdCBpdGVtID0gZ2FtZS5pdGVtc1tpZF07XHJcblx0XHRpdGVtLm1vdmVUb0JvdCh0aGlzLm1hcElkLCB0aGlzLmdhbWVJZCwgc2xvdCk7XHJcblx0fVxyXG5cclxuXHRnZXRJdGVtKGRhdGEpIHtcclxuXHRcdGxldCBzbG90ID0gc3VwZXIuZ2V0SXRlbShkYXRhKTtcclxuXHRcdGlmIChzbG90ID09IG51bGwpIHJldHVybjtcclxuXHJcblx0XHRkYXRhLm93bmVyID0gJ2JvdCc7XHJcblx0XHRkYXRhLm1hcElkID0gdGhpcy5tYXBJZDtcclxuXHRcdGRhdGEuZ2FtZUlkID0gdGhpcy5nYW1lSWQ7XHJcblx0XHRkYXRhLnNsb3QgPSBzbG90O1xyXG5cdFx0bmV3IEl0ZW0oZGF0YSk7XHJcblx0fVxyXG5cclxuXHR1cGRhdGUoZGVsdGEpIHtcclxuXHRcdHN1cGVyLnVwZGF0ZShkZWx0YSk7IFx0Ly8gRGVmYXVsdCBBY3RvciBVcGRhdGVcclxuXHRcdGlmICh0aGlzLmlzRGVhZCkgcmV0dXJuO1xyXG5cclxuXHRcdHRoaXMubW92ZVRpbWVyKys7XHJcblx0XHRcclxuXHRcdC8vIEFJIElucHV0c1xyXG5cdFx0c3dpdGNoKHRoaXMudGFzaykge1xyXG5cdFx0XHRjYXNlICd3YW5kZXJpbmcnOlx0XHQvLyBNb3ZlIHJhbmRvbWx5XHJcblx0XHRcdFx0dGhpcy5tb3ZlKCk7XHJcblx0XHRcdFx0dGhpcy5waWNrVXAoKTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ2ZvbGxvd2luZyc6XHRcdC8vIE1vdmUgdG93YXJkcyB0YXJnZXRcclxuXHRcdFx0XHRpZiAodGhpcy50YXJnZXQpIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZVRvVGFyZ2V0KHRoaXMudGFyZ2V0LCBmYWxzZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly8gTm8gdGFyZ2V0XHJcblx0XHRcdFx0XHR0aGlzLnNldFRhc2soJ3dhbmRlcmluZycpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ2F0dGFja2luZyc6XHRcdC8vIE1vdmUgdG93YXJkcyB0YXJnZXQgYW5kIGF0dGFja1xyXG5cdFx0XHRcdGlmICh0aGlzLnRhcmdldCkge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlVG9UYXJnZXQodGhpcy50YXJnZXQsIHRydWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdC8vIE5vIHRhcmdldFxyXG5cdFx0XHRcdFx0dGhpcy5zZXRUYXNrKCd3YW5kZXJpbmcnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHQvLyBjYXNlICdpZGxlJzpcclxuXHRcdFx0ZGVmYXVsdDogXHRcdFx0XHRcdC8vIFN0YW5kIHN0aWxsXHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gdGhpcy5nZXRQYWNrKCk7XHJcblx0fVxyXG5cdFxyXG5cdGdldFBhY2soKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRnYW1lSWQ6IHRoaXMuZ2FtZUlkLFxyXG5cdFx0XHRuYW1lOiB0aGlzLm5hbWUsXHJcblx0XHRcdHNwcml0ZTogdGhpcy5zcHJpdGUsXHJcblx0XHRcdGRpcmVjdGlvbjogdGhpcy5kaXJlY3Rpb24sXHJcblx0XHRcdG1hcElkOiB0aGlzLm1hcElkLFxyXG5cdFx0XHR4OiB0aGlzLnN0YXJ0WCxcclxuXHRcdFx0eTogdGhpcy5zdGFydFksXHJcblx0XHRcdHo6IHRoaXMueixcclxuXHRcdFx0ZGVzdGluYXRpb25YOiB0aGlzLmRlc3RpbmF0aW9uWCxcclxuXHRcdFx0ZGVzdGluYXRpb25ZOiB0aGlzLmRlc3RpbmF0aW9uWSxcclxuXHRcdFx0bGVycDogdGhpcy5sZXJwLFxyXG5cdFx0XHRpc1J1bm5pbmc6IHRoaXMuaXNSdW5uaW5nLFxyXG5cdFx0XHRpc0F0dGFja2luZzogdGhpcy5pc0F0dGFja2luZyxcclxuXHRcdFx0aXNEZWFkOiBmYWxzZSxcclxuXHRcdFx0aXNWaXNpYmxlOiB0aGlzLmlzVmlzaWJsZVxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdHJlbW92ZSgpIHtcclxuXHRcdGRlbGV0ZSBnYW1lLm1hcHNbdGhpcy5tYXBJZF0uYm90c1t0aGlzLmdhbWVJZF07XHJcblx0fVxyXG5cdFxyXG5cdG1vdmUoZGlyZWN0aW9uKSB7XHJcblx0XHRsZXQgbW92ZVRpbWUgPSAyNDtcclxuXHRcdGlmICh0aGlzLmlzUnVubmluZykge1xyXG5cdFx0XHRtb3ZlVGltZSA9IDE3O1xyXG5cdFx0fVxyXG5cdFx0aWYgKHRoaXMubW92ZVRpbWVyID4gbW92ZVRpbWUgJiYgdGhpcy5hdHRhY2tUaW1lciA9PT0gMCkge1xyXG5cdFx0XHRzdXBlci5tb3ZlKGRpcmVjdGlvbik7XHJcblx0XHRcdHRoaXMubW92ZVRpbWVyID0gMDtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0dGFrZURhbWFnZShkYW1hZ2UsIHNvdXJjZSkge1xyXG5cdFx0aWYgKHNvdXJjZSBpbnN0YW5jZW9mIEFjdG9yKSB0aGlzLnNldFRhc2soJ2F0dGFja2luZycsIHNvdXJjZSk7XHJcblx0XHRzdXBlci50YWtlRGFtYWdlKGRhbWFnZSwgc291cmNlKTtcclxuXHR9XHJcblx0XHJcblx0cGlja1VwKCkge1xyXG5cdFx0c3VwZXIucGlja1VwKCk7XHJcblx0XHR0aGlzLmNoZWNrQmVzdEVxdWlwbWVudCgpO1xyXG5cdH1cclxuXHJcblx0c2V0RGVhZCgpIHtcclxuXHRcdHN1cGVyLnNldERlYWQoKTtcclxuXHRcdGRlbGV0ZSBnYW1lLm1hcERhdGFbdGhpcy5tYXBJZF0uYm90c1t0aGlzLmdhbWVJZF07XHJcblx0fVxyXG5cclxuXHQvLyBJbnB1dHNcclxuXHRzZXRUYXNrKHRhc2ssIHRhcmdldCkge1xyXG5cdFx0c3dpdGNoICh0YXNrKSB7XHJcblx0XHRcdGNhc2UgJ3dhbmRlcmluZyc6XHJcblx0XHRcdFx0dGhpcy5sYXppbmVzcyA9IDc7XHJcblx0XHRcdFx0dGhpcy50YXJnZXQgPSBudWxsO1xyXG5cdFx0XHRcdHRoaXMudGFzayA9IHRhc2s7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdmb2xsb3dpbmcnOlxyXG5cdFx0XHRcdGlmICh0YXJnZXQgPT09IG51bGwpIHtcclxuXHRcdFx0XHRcdHRoaXMuc2V0VGFzaygnd2FuZGVyaW5nJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5sYXppbmVzcyA9IDA7XHJcblx0XHRcdFx0XHR0aGlzLnRhcmdldCA9IHRhcmdldDtcclxuXHRcdFx0XHRcdHRoaXMudGFzayA9IHRhc2s7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnYXR0YWNraW5nJzpcclxuXHRcdFx0XHRpZiAodGFyZ2V0ID09PSBudWxsKSB7XHJcblx0XHRcdFx0XHR0aGlzLnNldFRhc2soJ3dhbmRlcmluZycpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubGF6aW5lc3MgPSAwO1xyXG5cdFx0XHRcdFx0dGhpcy50YXJnZXQgPSB0YXJnZXQ7XHJcblx0XHRcdFx0XHR0aGlzLnRhc2sgPSB0YXNrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGRlZmF1bHQ6XHQvL2lkbGluZ1xyXG5cdFx0XHRcdHRoaXMubGF6aW5lc3MgPSA3O1xyXG5cdFx0XHRcdHRoaXMudGFyZ2V0ID0gbnVsbDtcclxuXHRcdFx0XHR0aGlzLnRhc2sgPSAnaWRsZSc7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRjaGVja0Jlc3RFcXVpcG1lbnQoKSB7XHJcblx0XHRmb3IgKGxldCBzbG90ID0gMDsgc2xvdCA8IGNvbmZpZy5JTlZFTlRPUllfU0laRTsgc2xvdCsrKSB7XHJcblx0XHRcdGxldCBpdGVtID0gdGhpcy5pbnZlbnRvcnlbc2xvdF07XHJcblx0XHRcdGlmICghaXRlbSkge1xyXG5cdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRzd2l0Y2ggKGl0ZW0udHlwZSkge1xyXG5cdFx0XHRcdGNhc2UgJ3dlYXBvbic6XHJcblx0XHRcdFx0XHRpZiAodGhpcy5pbnZlbnRvcnlbY29uZmlnLklOVkVOVE9SWV9TSVpFXSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoaXRlbS5kYW1hZ2UgPiB0aGlzLmludmVudG9yeVtjb25maWcuSU5WRU5UT1JZX1NJWkVdLmRhbWFnZSkge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuZXF1aXBJdGVtKHNsb3QpO1xyXG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5lcXVpcEl0ZW0oc2xvdCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAnc2hpZWxkJzpcclxuXHRcdFx0XHRcdGlmICh0aGlzLmludmVudG9yeVtjb25maWcuSU5WRU5UT1JZX1NJWkUgKyAxXSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoaXRlbS5kZWZlbmNlID4gdGhpcy5pbnZlbnRvcnlbY29uZmlnLklOVkVOVE9SWV9TSVpFICsgMV0uZGVmZW5jZSkge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuZXF1aXBJdGVtKHNsb3QpO1xyXG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5lcXVpcEl0ZW0oc2xvdCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAnYXJtb3VyJzpcclxuXHRcdFx0XHRcdGlmICh0aGlzLmludmVudG9yeVtjb25maWcuSU5WRU5UT1JZX1NJWkUgKyAyXSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoaXRlbS5kZWZlbmNlID4gdGhpcy5pbnZlbnRvcnlbY29uZmlnLklOVkVOVE9SWV9TSVpFICsgMl0uZGVmZW5jZSkge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuZXF1aXBJdGVtKHNsb3QpO1xyXG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5lcXVpcEl0ZW0oc2xvdCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAnaGVsbWV0JzpcclxuXHRcdFx0XHRcdGlmICh0aGlzLmludmVudG9yeVtjb25maWcuSU5WRU5UT1JZX1NJWkUgKyAzXSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoaXRlbS5kZWZlbmNlID4gdGhpcy5pbnZlbnRvcnlbY29uZmlnLklOVkVOVE9SWV9TSVpFICsgM10uZGVmZW5jZSkge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuZXF1aXBJdGVtKHNsb3QpO1xyXG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5lcXVpcEl0ZW0oc2xvdCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAncmluZyc6XHJcblx0XHRcdFx0XHRpZiAodGhpcy5pbnZlbnRvcnlbY29uZmlnLklOVkVOVE9SWV9TSVpFICsgNF0pIHtcclxuXHRcdFx0XHRcdFx0aWYgKGl0ZW0uZGFtYWdlID4gdGhpcy5pbnZlbnRvcnlbY29uZmlnLklOVkVOVE9SWV9TSVpFICsgNF0uZGFtYWdlKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5lcXVpcEl0ZW0oc2xvdCk7XHJcblx0XHRcdFx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmVxdWlwSXRlbShzbG90KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG4iLCJpbXBvcnQgRW50aXR5IGZyb20gJy4vZW50aXR5LmpzJztcclxuaW1wb3J0IGdhbWUgZnJvbSAnLi4vZ2FtZS5qcyc7XHJcbmltcG9ydCBjb25maWcgZnJvbSAnLi4vY29uZmlnLmpzJztcclxuaW1wb3J0IHV0aWwgZnJvbSAnLi4vdXRpbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFZmZlY3QgZXh0ZW5kcyBFbnRpdHkge1xyXG5cdGNvbnN0cnVjdG9yKG1hcElkLCB4LCB5LCBzcHJpdGUgPSAwLCBsb29wID0gMCwgc3BlZWQgPSAxMiwgbWF4RnJhbWUgPSA3LCBzdGFydEZyYW1lID0gMCkge1xyXG5cdFx0c3VwZXIobWFwSWQsIHgsIHksIHV0aWwuY2xhbXAoc3ByaXRlLCAwLCBjb25maWcuTUFYX0VGRkVDVFMgLSAxKSk7XHJcblx0XHR0aGlzLm1heEZyYW1lID0gdXRpbC5jbGFtcChtYXhGcmFtZSwgMCwgNyk7XHJcblx0XHR0aGlzLnN0YXJ0RnJhbWUgPSB1dGlsLmNsYW1wKHN0YXJ0RnJhbWUsIDAsIHRoaXMubWF4RnJhbWUpO1xyXG5cdFx0dGhpcy5jdXJyZW50RnJhbWUgPSB0aGlzLnN0YXJ0RnJhbWU7XHJcblx0XHRcclxuXHRcdHRoaXMubG9vcCA9IGxvb3A7XHJcblx0XHR0aGlzLnNwZWVkID0gc3BlZWQ7XHJcblx0XHR0aGlzLnRpbWVyID0gMDtcclxuXHRcdFxyXG5cdFx0dGhpcy5pZCA9IHV0aWwuZmlyc3RFbXB0eUluZGV4KGdhbWUubWFwc1t0aGlzLm1hcElkXS5lZmZlY3RzKTtcclxuXHRcdGdhbWUubWFwc1t0aGlzLm1hcElkXS5lZmZlY3RzW3RoaXMuaWRdID0gdGhpcztcclxuXHR9XHJcblx0XHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHR0aGlzLnRpbWVyICs9IGRlbHRhO1xyXG5cdFx0XHJcblx0XHRpZiAodGhpcy50aW1lciA+PSAxIC8gdGhpcy5zcGVlZCkge1xyXG5cdFx0XHR0aGlzLnRpbWVyID0gMDtcclxuXHRcdFx0dGhpcy5jdXJyZW50RnJhbWUrKztcclxuXHJcblx0XHRcdGlmICh0aGlzLmN1cnJlbnRGcmFtZSA+IHRoaXMubWF4RnJhbWUpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5sb29wIDwgMCkge1xyXG5cdFx0XHRcdFx0dGhpcy5jdXJyZW50RnJhbWUgPSB0aGlzLnN0YXJ0RnJhbWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2UgaWYgKHRoaXMubG9vcCA+IDApIHtcclxuXHRcdFx0XHRcdHRoaXMuY3VycmVudEZyYW1lID0gdGhpcy5zdGFydEZyYW1lO1xyXG5cdFx0XHRcdFx0dGhpcy5sb29wLS07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5jdXJyZW50RnJhbWUgPSB0aGlzLm1heEZyYW1lO1xyXG5cdFx0XHRcdFx0dGhpcy5yZW1vdmUoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGhpcy5nZXRQYWNrKCk7XHJcblx0fVxyXG5cdFxyXG5cdGdldFBhY2soKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRpZDogdGhpcy5pZCxcclxuXHRcdFx0bWFwSWQ6IHRoaXMubWFwSWQsXHJcblx0XHRcdHg6IHRoaXMueCxcclxuXHRcdFx0eTogdGhpcy55LFxyXG5cdFx0XHRzcHJpdGU6IHRoaXMuc3ByaXRlLFxyXG5cdFx0XHRjdXJyZW50RnJhbWU6IHRoaXMuY3VycmVudEZyYW1lXHJcblx0XHR9O1xyXG5cdH1cclxuXHRcclxuXHRyZW1vdmUoKSB7XHJcblx0XHRkZWxldGUgZ2FtZS5tYXBzW3RoaXMubWFwSWRdLmVmZmVjdHNbdGhpcy5pZF07XHJcblx0fVx0XHJcbn0iLCJpbXBvcnQgY29uZmlnIGZyb20gJy4uL2NvbmZpZy5qcyc7XHJcblxyXG4vLyBBbiBFbnRpdHkgaXMgYW55IG9iamVjdCB3aGljaCBjYW4gYXBwZWFyIG9uIHRoZSBtYXBcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVudGl0eSB7XHJcblx0Y29uc3RydWN0b3IobWFwSWQsIHgsIHksIHNwcml0ZSA9IDEpIHtcclxuXHRcdHRoaXMubWFwSWQgPSBtYXBJZDtcclxuXHRcdHRoaXMueCA9IHg7XHJcblx0XHR0aGlzLnkgPSB5O1xyXG5cdFx0aWYgKHNwcml0ZSA8IDEpIHNwcml0ZSA9IDE7XHJcblx0XHR0aGlzLnNwcml0ZSA9IHNwcml0ZTtcclxuXHRcdHRoaXMuaXNWaXNpYmxlID0gdHJ1ZTtcclxuXHR9XHJcbn1cclxuIiwiaW1wb3J0IGdhbWUgZnJvbSAnLi4vZ2FtZS5qcyc7XHJcbmltcG9ydCBjb25maWcgZnJvbSAnLi4vY29uZmlnLmpzJztcclxuaW1wb3J0IHV0aWwgZnJvbSAnLi4vdXRpbC5qcyc7XHJcbmltcG9ydCBFbnRpdHkgZnJvbSAnLi9lbnRpdHkuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSXRlbSBleHRlbmRzIEVudGl0eSB7XHJcblx0Y29uc3RydWN0b3IocG9zaXRpb24sIHRlbXBsYXRlLCBzdGFjaykge1xyXG5cdFx0aWYgKHBvc2l0aW9uLnBsYXllcklkID09PSB1bmRlZmluZWQpIHBvc2l0aW9uLnBsYXllcklkID0gbnVsbDtcclxuXHRcdGlmIChwb3NpdGlvbi5ib3RJZCA9PT0gdW5kZWZpbmVkKSBwb3NpdGlvbi5ib3RJZCA9IG51bGw7XHJcblx0XHRpZiAocG9zaXRpb24uc2xvdCA9PT0gdW5kZWZpbmVkKSBwb3NpdGlvbi5zbG90ID0gbnVsbDtcclxuXHRcdGlmIChwb3NpdGlvbi5tYXBJZCA9PT0gdW5kZWZpbmVkKSBwb3NpdGlvbi5tYXBJZCA9IG51bGw7XHJcblx0XHRpZiAocG9zaXRpb24ueCA9PT0gdW5kZWZpbmVkKSBwb3NpdGlvbi54ID0gbnVsbDtcclxuXHRcdGlmIChwb3NpdGlvbi55ID09PSB1bmRlZmluZWQpIHBvc2l0aW9uLnkgPSBudWxsO1xyXG5cclxuXHRcdHN1cGVyKHBvc2l0aW9uLm1hcElkLCBwb3NpdGlvbi54LCBwb3NpdGlvbi55LCB0ZW1wbGF0ZS5zcHJpdGUpO1xyXG5cdFx0dGhpcy56ID0gLTEwO1xyXG5cdFx0dGhpcy5wbGF5ZXJJZCA9IHBvc2l0aW9uLnBsYXllcklkO1xyXG5cdFx0dGhpcy5ib3RJZCA9IHBvc2l0aW9uLmJvdElkO1xyXG5cdFx0dGhpcy5zbG90ID0gcG9zaXRpb24uc2xvdDtcclxuXHRcdFxyXG5cdFx0dGhpcy5uYW1lID0gdGVtcGxhdGUubmFtZTtcclxuXHRcdHRoaXMuZGVzY3JpcHRpb24gPSB0ZW1wbGF0ZS5kZXNjcmlwdGlvbjtcclxuXHRcdHRoaXMucmV1c2FibGUgPSB0ZW1wbGF0ZS5yZXVzYWJsZTtcclxuXHRcdFxyXG5cdFx0dGhpcy50eXBlID0gdGVtcGxhdGUudHlwZS5uYW1lO1xyXG5cdFx0dGhpcy5zdGFja2FibGUgPSB0ZW1wbGF0ZS50eXBlLnN0YWNrYWJsZTtcclxuXHRcdHRoaXMuZXF1aXBwYWJsZVNsb3QgPSB0ZW1wbGF0ZS50eXBlLmVxdWlwcGFibGVTbG90O1xyXG5cdFx0XHJcblx0XHR0aGlzLnBhc3NpdmUgPSB7XHJcblx0XHRcdGRhbWFnZTogdGVtcGxhdGUucGFzc2l2ZURhbWFnZSxcclxuXHRcdFx0ZGVmZW5jZTogdGVtcGxhdGUucGFzc2l2ZURlZmVuY2UsXHJcblx0XHRcdGhlYWx0aE1heDogdGVtcGxhdGUucGFzc2l2ZUhlYWx0aE1heCxcclxuXHRcdFx0ZW5lcmd5TWF4OiB0ZW1wbGF0ZS5wYXNzaXZlRW5lcmd5TWF4LFxyXG5cdFx0XHRyYW5nZTogdGVtcGxhdGUucGFzc2l2ZVJhbmdlXHJcblx0XHR9O1xyXG5cdFx0dGhpcy5lcXVpcHBlZCA9IHtcclxuXHRcdFx0ZGFtYWdlOiB0ZW1wbGF0ZS5lcXVpcHBlZERhbWFnZSxcclxuXHRcdFx0ZGVmZW5jZTogdGVtcGxhdGUuZXF1aXBwZWREZWZlbmNlLFxyXG5cdFx0XHRoZWFsdGhNYXg6IHRlbXBsYXRlLmVxdWlwcGVkSGVhbHRoTWF4LFxyXG5cdFx0XHRlbmVyZ3lNYXg6IHRlbXBsYXRlLmVxdWlwcGVkRW5lcmd5TWF4LFxyXG5cdFx0XHRyYW5nZTogdGVtcGxhdGUuZXF1aXBwZWRSYW5nZVxyXG5cdFx0fTtcclxuXHRcdFxyXG5cdFx0aWYgKHRoaXMuc3RhY2thYmxlKSB7XHJcblx0XHRcdGlmIChzdGFjayA8IDEpIHN0YWNrID0gMTtcclxuXHRcdFx0dGhpcy5zdGFjayA9IHN0YWNrO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHRoaXMuc3RhY2sgPSAwO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuaWQgPSB1dGlsLmZpcnN0RW1wdHlJbmRleChnYW1lLml0ZW1zKTtcclxuXHRcdGdhbWUuaXRlbXNbdGhpcy5pZF0gPSB0aGlzO1xyXG5cdH1cclxuXHRcclxuXHRnZXQgZGFtYWdlKCkge1xyXG5cdFx0Y29uc3QgZGFtYWdlVG90YWwgPSB0aGlzLnBhc3NpdmVEYW1hZ2UgKyB0aGlzLmVxdWlwRGFtYWdlO1xyXG5cdFx0cmV0dXJuIChkYW1hZ2VUb3RhbCA8IDApID8gMCA6IGRhbWFnZVRvdGFsO1xyXG5cdH1cclxuXHRnZXQgZGVmZW5jZSgpIHtcclxuXHRcdGNvbnN0IGRlZmVuY2VUb3RhbCA9IHRoaXMucGFzc2l2ZURlZmVuY2UgKyB0aGlzLmVxdWlwRGVmZW5jZTtcclxuXHRcdHJldHVybiAoZGVmZW5jZVRvdGFsIDwgMCkgPyAwIDogZGVmZW5jZVRvdGFsO1xyXG5cdH1cclxuXHRnZXQgaGVhbHRoTWF4KCkge1xyXG5cdFx0Y29uc3QgaGVhbHRoTWF4VG90YWwgPSB0aGlzLnBhc3NpdmVIZWFsdGhNYXggKyB0aGlzLmVxdWlwSGVhbHRoTWF4O1xyXG5cdFx0cmV0dXJuIChoZWFsdGhNYXhUb3RhbCA8IDApID8gMCA6IGhlYWx0aE1heFRvdGFsO1xyXG5cdH1cclxuXHRnZXQgZW5lcmd5TWF4KCkge1xyXG5cdFx0Y29uc3QgZW5lcmd5TWF4VG90YWwgPSB0aGlzLnBhc3NpdmVFbmVyZ3lNYXggKyB0aGlzLmVxdWlwRW5lcmd5TWF4O1xyXG5cdFx0cmV0dXJuIChlbmVyZ3lNYXhUb3RhbCA8IDApID8gMCA6IGVuZXJneU1heFRvdGFsO1xyXG5cdH1cclxuXHRnZXQgcmFuZ2UoKSB7XHJcblx0XHRjb25zdCByYW5nZVRvdGFsID0gdGhpcy5wYXNzaXZlUmFuZ2UgKyB0aGlzLmVxdWlwUmFuZ2U7XHJcblx0XHRyZXR1cm4gKHJhbmdlVG90YWwgPCAwKSA/IDAgOiByYW5nZVRvdGFsO1xyXG5cdH1cclxuXHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5nZXRQYWNrKCk7XHJcblx0fVxyXG5cclxuXHRnZXRQYWNrKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0aWQ6IHRoaXMuaWQsXHJcblx0XHRcdHBsYXllcklkOiB0aGlzLnBsYXllcklkLFxyXG5cdFx0XHRib3RJZDogdGhpcy5ib3RJZCxcclxuXHRcdFx0c2xvdDogdGhpcy5zbG90LFxyXG5cdFx0XHRtYXBJZDogdGhpcy5tYXBJZCxcclxuXHRcdFx0eDogdGhpcy54LFxyXG5cdFx0XHR5OiB0aGlzLnksXHJcblx0XHRcdHo6IHRoaXMueixcclxuXHRcdFx0bmFtZTogdGhpcy5uYW1lLFxyXG5cdFx0XHRkZXNjcmlwdGlvbjogdGhpcy5kZXNjcmlwdGlvbixcclxuXHRcdFx0c3ByaXRlOiB0aGlzLnNwcml0ZSxcclxuXHRcdFx0dHlwZTogdGhpcy50eXBlLFxyXG5cdFx0XHRyZXVzYWJsZTogdGhpcy5yZXVzYWJsZSxcclxuXHRcdFx0cGFzc2l2ZTogdGhpcy5wYXNzaXZlLFxyXG5cdFx0XHRlcXVpcHBlZDogdGhpcy5lcXVpcHBlZCxcclxuXHRcdFx0c3RhY2s6IHRoaXMuc3RhY2ssXHJcblx0XHRcdGlzVmlzaWJsZTogdGhpcy5pc1Zpc2libGVcclxuXHRcdH07XHJcblx0fVxyXG5cdFxyXG5cdHJlbW92ZSgpIHtcclxuXHRcdGlmICh0aGlzLm93bmVyID09PSAncGxheWVyJykge1xyXG5cdFx0XHRkZWxldGUgZ2FtZS5wbGF5ZXJzW3RoaXMuaWRdLmludmVudG9yeVt0aGlzLnNsb3RdO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAodGhpcy5vd25lciA9PT0gJ21hcCcpIHtcclxuXHRcdFx0ZGVsZXRlIGdhbWUubWFwc1t0aGlzLm1hcElkXS5pdGVtc1t0aGlzLmlkXTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKHRoaXMub3duZXIgPT09ICdib3QnKSB7XHJcblx0XHRcdGRlbGV0ZSBnYW1lLm1hcHNbdGhpcy5tYXBJZF0uYm90c1t0aGlzLmlkXS5pbnZlbnRvcnlbdGhpcy5zbG90XTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0aXNFcXVpcG1lbnQoKSB7XHJcblx0XHRjb25zdCBpdGVtVHlwZXMgPSBbJ3dlYXBvbicsICdzaGllbGQnLCAnYXJtb3VyJywgJ2hlbG1ldCcsICdyaW5nJ107XHJcblx0XHRyZXR1cm4gKGl0ZW1UeXBlcy5pbmNsdWRlcyh0aGlzLnR5cGUpKTtcclxuXHR9XHJcblxyXG5cdGNhbkVxdWlwKHNsb3QpIHtcclxuXHRcdGlmIChzbG90ID09PSBjb25maWcuSU5WRU5UT1JZX1NJWkUpIHtcclxuXHRcdFx0aWYgKHRoaXMudHlwZSA9PT0gJ3dlYXBvbicpIHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoc2xvdCA9PT0gY29uZmlnLklOVkVOVE9SWV9TSVpFICsgMSkge1xyXG5cdFx0XHRpZiAodGhpcy50eXBlID09PSAnc2hpZWxkJykgcmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChzbG90ID09PSBjb25maWcuSU5WRU5UT1JZX1NJWkUgKyAyKSB7XHJcblx0XHRcdGlmICh0aGlzLnR5cGUgPT09ICdhcm1vdXInKSByZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKHNsb3QgPT09IGNvbmZpZy5JTlZFTlRPUllfU0laRSArIDMpIHtcclxuXHRcdFx0aWYgKHRoaXMudHlwZSA9PT0gJ2hlbG1ldCcpIHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoc2xvdCA9PT0gY29uZmlnLklOVkVOVE9SWV9TSVpFICsgNCkge1xyXG5cdFx0XHRpZiAodGhpcy50eXBlID09PSAncmluZycpIHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblxyXG5cdG1vdmVUb1BsYXllcihpZCwgc2xvdCkge1xyXG5cdFx0aWYgKGlkID09IG51bGwgfHwgc2xvdCA9PSBudWxsKSByZXR1cm47XHJcblxyXG5cdFx0dGhpcy5yZW1vdmUoKTtcclxuXHRcdHRoaXMub3duZXIgPSAncGxheWVyJztcclxuXHRcdHRoaXMuaWQgPSBpZDtcclxuXHRcdHRoaXMuc2xvdCA9IHNsb3Q7XHJcblx0XHRnYW1lLnBsYXllcnNbdGhpcy5pZF0uaW52ZW50b3J5W3RoaXMuc2xvdF0gPSB0aGlzO1xyXG5cdH1cclxuXHJcblx0bW92ZVRvTWFwKG1hcElkLCB4LCB5KSB7XHJcblx0XHRpZiAobWFwSWQgPT0gbnVsbCB8fCB4ID09IG51bGwgfHwgeSA9PSBudWxsKSByZXR1cm47XHJcblxyXG5cdFx0dGhpcy5yZW1vdmUoKTtcclxuXHRcdHRoaXMub3duZXIgPSAnbWFwJztcclxuXHRcdHRoaXMubWFwSWQgPSBtYXBJZDtcclxuXHRcdHRoaXMuaWQgPSB1dGlsLmZpcnN0RW1wdHlJbmRleChnYW1lLm1hcHNbdGhpcy5tYXBJZF0uaXRlbXMpO1xyXG5cdFx0dGhpcy54ID0geDtcclxuXHRcdHRoaXMueSA9IHk7XHJcblx0XHRnYW1lLm1hcHNbdGhpcy5tYXBJZF0uaXRlbXNbdGhpcy5pZF0gPSB0aGlzO1xyXG5cdH1cclxuXHJcblx0bW92ZVRvQm90KG1hcElkLCBpZCwgc2xvdCkge1xyXG5cdFx0aWYgKG1hcElkID09IG51bGwgfHwgaWQgPT0gbnVsbCB8fCBzbG90ID09IG51bGwpIHJldHVybjtcclxuXHJcblx0XHR0aGlzLnJlbW92ZSgpO1xyXG5cdFx0dGhpcy5vd25lciA9ICdib3QnO1xyXG5cdFx0dGhpcy5tYXBJZCA9IG1hcElkO1xyXG5cdFx0dGhpcy5pZCA9IGlkO1xyXG5cdFx0dGhpcy5zbG90ID0gc2xvdDtcclxuXHRcdGdhbWUubWFwc1t0aGlzLm1hcElkXS5ib3RzW3RoaXMuaWRdLmludmVudG9yeVt0aGlzLnNsb3RdID0gdGhpcztcclxuXHR9XHJcbn1cclxuIiwiaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9jb25maWcuanMnO1xyXG5pbXBvcnQgdXRpbCBmcm9tICcuLi91dGlsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hcCB7XHJcblx0Y29uc3RydWN0b3IobWFwSWQsIGRhdGEgPSB7fSkge1xyXG5cdFx0dGhpcy5tYXBJZCA9IG1hcElkO1xyXG5cclxuXHRcdGlmIChkYXRhLm5hbWUgPT0gbnVsbCkgZGF0YS5uYW1lID0gXCJCbGFuayBNYXBcIjtcclxuXHRcdGlmIChkYXRhLmRyb3BDaGFuY2UgPT0gbnVsbCkgZGF0YS5kcm9wQ2hhbmNlID0gMTAwO1xyXG5cdFx0aWYgKGRhdGEuZHJvcEFtb3VudEVRID09IG51bGwpIGRhdGEuZHJvcEFtb3VudEVRID0gMTtcclxuXHRcdGlmICghZGF0YS50aWxlcykgZGF0YS50aWxlcyA9IHV0aWwuY3JlYXRlM2RBcnJheShjb25maWcuTUFQX0NPTFVNTlMsIGNvbmZpZy5NQVBfUk9XUywgY29uZmlnLk1BUF9MQVlFUlMsIDApO1xyXG5cdFx0aWYgKCFkYXRhLmlzV2FsbCkgZGF0YS5pc1dhbGwgPSB1dGlsLmNyZWF0ZTJkQXJyYXkoY29uZmlnLk1BUF9DT0xVTU5TLCBjb25maWcuTUFQX1JPV1MsIGZhbHNlKTtcclxuXHRcdGlmICghZGF0YS5pc0hvc3RpbGUpIGRhdGEuaXNIb3N0aWxlID0gdXRpbC5jcmVhdGUyZEFycmF5KGNvbmZpZy5NQVBfQ09MVU1OUywgY29uZmlnLk1BUF9ST1dTLCBmYWxzZSk7XHJcblx0XHRpZiAoIWRhdGEuZGFtYWdlKSBkYXRhLmRhbWFnZSA9IHV0aWwuY3JlYXRlMmRBcnJheShjb25maWcuTUFQX0NPTFVNTlMsIGNvbmZpZy5NQVBfUk9XUywgbnVsbCk7XHJcblx0XHRpZiAoIWRhdGEud2FycE1hcCkgZGF0YS53YXJwTWFwID0gdXRpbC5jcmVhdGUyZEFycmF5KGNvbmZpZy5NQVBfQ09MVU1OUywgY29uZmlnLk1BUF9ST1dTLCBudWxsKTtcclxuXHRcdGlmICghZGF0YS53YXJwWCkgZGF0YS53YXJwWCA9IHV0aWwuY3JlYXRlMmRBcnJheShjb25maWcuTUFQX0NPTFVNTlMsIGNvbmZpZy5NQVBfUk9XUywgbnVsbCk7XHJcblx0XHRpZiAoIWRhdGEud2FycFkpIGRhdGEud2FycFkgPSB1dGlsLmNyZWF0ZTJkQXJyYXkoY29uZmlnLk1BUF9DT0xVTU5TLCBjb25maWcuTUFQX1JPV1MsIG51bGwpO1xyXG5cclxuXHRcdHRoaXMubmFtZSA9IGRhdGEubmFtZTtcclxuXHRcdHRoaXMuZHJvcENoYW5jZSA9IHV0aWwuY2xhbXAoZGF0YS5kcm9wQ2hhbmNlLCAwLCAxMDApO1xyXG5cdFx0dGhpcy5kcm9wQW1vdW50RVEgPSB1dGlsLmNsYW1wKGRhdGEuZHJvcEFtb3VudEVRLCAwLCBjb25maWcuRVFVSVBNRU5UX1NJWkUpO1xyXG5cdFx0Ly90aGlzLmRyb3BDaGFuY2UgPSAwID0gMCUgY2hhbmNlIHRvIGRyb3AgaXRlbXMgaW4gaW52ZW50b3J5IChkcm9wIG5vdGhpbmcpLCAxMDAgPSAxMDAlIGNoYW5jZSB0byBkcm9wIChkcm9wIGV2ZXJ5dGhpbmcpXHJcblx0XHQvL3RoaXMuZHJvcEFtb3VudEVRID0gbnVtYmVyIG9mIGVxdWlwcGVkIGl0ZW1zIHRoZSBwbGF5ZXIgd2lsbCBkcm9wIG9uIGRlYXRoLiBkcm9wRVEgPSBFUVVJUE1FTlRfU0laRSA9IGRyb3AgYWxsIGVxdWlwbWVudFxyXG5cdFx0dGhpcy50aWxlcyA9IGRhdGEudGlsZXM7XHJcblx0XHR0aGlzLmlzV2FsbCA9IGRhdGEuaXNXYWxsO1xyXG5cdFx0dGhpcy5pc0hvc3RpbGUgPSBkYXRhLmlzSG9zdGlsZTtcclxuXHRcdHRoaXMuZGFtYWdlID0gZGF0YS5kYW1hZ2U7XHJcblx0XHR0aGlzLndhcnBNYXAgPSBkYXRhLndhcnBNYXA7XHJcblx0XHR0aGlzLndhcnBYID0gZGF0YS53YXJwWDtcclxuXHRcdHRoaXMud2FycFkgPSBkYXRhLndhcnBZO1xyXG5cdH1cclxuXHRcclxuXHR1cGxvYWQoZGF0YSkge1xyXG5cdFx0aWYgKGRhdGEubmFtZSAhPSBudWxsKSB0aGlzLm5hbWUgPSBkYXRhLm5hbWU7XHJcblx0XHRpZiAoZGF0YS5kcm9wQ2hhbmNlICE9IG51bGwpIHRoaXMuZHJvcENoYW5jZSA9IGRhdGEuZHJvcENoYW5jZTtcclxuXHRcdGlmIChkYXRhLmRyb3BBbW91bnRFUSAhPSBudWxsKSB0aGlzLmRyb3BBbW91bnRFUSA9IGRhdGEuZHJvcEFtb3VudEVRO1xyXG5cdFx0aWYgKGRhdGEudGlsZXMpIHRoaXMudGlsZXMgPSBkYXRhLnRpbGVzO1xyXG5cdFx0aWYgKGRhdGEuaXNXYWxsKSB0aGlzLmlzV2FsbCA9IGRhdGEuaXNXYWxsO1xyXG5cdFx0aWYgKGRhdGEuaXNIb3N0aWxlKSB0aGlzLmlzSG9zdGlsZSA9IGRhdGEuaXNIb3N0aWxlO1xyXG5cdFx0aWYgKGRhdGEuZGFtYWdlKSB0aGlzLmRhbWFnZSA9IGRhdGEuZGFtYWdlO1xyXG5cdFx0aWYgKGRhdGEud2FycE1hcCkgdGhpcy53YXJwTWFwID0gZGF0YS53YXJwTWFwO1xyXG5cdFx0aWYgKGRhdGEud2FycFgpIHRoaXMud2FycFggPSBkYXRhLndhcnBYO1xyXG5cdFx0aWYgKGRhdGEud2FycFkpIHRoaXMud2FycFkgPSBkYXRhLndhcnBZO1xyXG5cdH1cclxuXHJcblx0Z2V0UGFjaygpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdG1hcElkOiB0aGlzLm1hcElkLFxyXG5cdFx0XHRuYW1lOiB0aGlzLm5hbWUsXHJcblx0XHRcdGRyb3BDaGFuY2U6IHRoaXMuZHJvcENoYW5jZSxcclxuXHRcdFx0ZHJvcEFtb3VudEVROiB0aGlzLmRyb3BBbW91bnRFUSxcclxuXHRcdFx0dGlsZXM6IHRoaXMudGlsZXMsXHJcblx0XHRcdGlzV2FsbDogdGhpcy5pc1dhbGwsXHJcblx0XHRcdGlzSG9zdGlsZTogdGhpcy5pc0hvc3RpbGUsXHJcblx0XHRcdGRhbWFnZTogdGhpcy5kYW1hZ2UsXHJcblx0XHRcdHdhcnBNYXA6IHRoaXMud2FycE1hcCxcclxuXHRcdFx0d2FycFg6IHRoaXMud2FycFgsXHJcblx0XHRcdHdhcnBZOiB0aGlzLndhcnBZXHJcblx0XHR9O1xyXG5cdH1cclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBNZXNzYWdlIHtcclxuXHRjb25zdHJ1Y3RvcihzZW5kZXJJZCwgbWVzc2FnZSwgdHlwZSwgbWFwSWQsIGlkLCBjb2xvdXIpIHtcclxuXHRcdHRoaXMuc2VuZGVySWQgPSBzZW5kZXJJZDsgLy8gbnVsbCA9IHNlcnZlclxyXG5cdFx0dGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcclxuXHRcdHRoaXMudHlwZSA9IHR5cGU7XHJcblx0XHR0aGlzLm1hcElkID0gbWFwSWQ7XHJcblx0XHR0aGlzLmlkID0gaWQ7XHJcblx0XHR0aGlzLmNvbG91ciA9IGNvbG91cjtcclxuXHR9XHJcbn0iLCJpbXBvcnQgZ2FtZSBmcm9tICcuLi9nYW1lLmpzJztcclxuaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9jb25maWcuanMnO1xyXG5pbXBvcnQgdXRpbCBmcm9tICcuLi91dGlsLmpzJztcclxuaW1wb3J0IEFjdG9yIGZyb20gJy4vYWN0b3IuanMnO1xyXG5cclxuLy8gQSBQbGF5ZXIgaXMgYW4gaW1tb3J0YWwgQWN0b3Igd2hpY2ggdGFrZXMgaW5wdXQgZnJvbSBhIGNsaWVudFxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyIGV4dGVuZHMgQWN0b3Ige1xyXG5cdGNvbnN0cnVjdG9yKHNvY2tldElkLCBkYXRhKSB7XHJcblx0XHRpZiAoZGF0YS5zcHJpdGUgPT0gbnVsbCkgZGF0YS5zcHJpdGUgPSBkYXRhLnRlbXBsYXRlLnNwcml0ZTtcclxuXHJcblx0XHRzdXBlcihkYXRhLm1hcElkLCBkYXRhLngsIGRhdGEueSwgZGF0YS5kaXJlY3Rpb24sIGRhdGEubmFtZSwgZGF0YS5zcHJpdGUpO1xyXG5cdFx0dGhpcy5jb250cm9sbGVyID0gJ3BsYXllcic7XHJcblx0XHR0aGlzLmlkID0gZGF0YS5faWQ7XHJcblx0XHR0aGlzLnNvY2tldElkID0gc29ja2V0SWQ7XHJcblx0XHR0aGlzLmFjY291bnRJZCA9IGRhdGEuYWNjb3VudDtcclxuXHRcdHRoaXMuYWRtaW5BY2Nlc3MgPSBkYXRhLmFkbWluQWNjZXNzO1xyXG5cclxuXHRcdHRoaXMubGV2ZWwgPSBkYXRhLmxldmVsO1xyXG5cdFx0dGhpcy5leHBlcmllbmNlID0gZGF0YS5leHBlcmllbmNlO1xyXG5cdFx0dGhpcy50ZW1wbGF0ZUlkID0gZGF0YS50ZW1wbGF0ZS5faWQ7XHJcblx0XHR0aGlzLnRlbXBsYXRlID0gZGF0YS50ZW1wbGF0ZS5uYW1lO1xyXG5cdFx0dGhpcy5jYWxjQmFzZVN0YXRzKGRhdGEudGVtcGxhdGUpO1xyXG5cdFx0dGhpcy5yZXN0b3JlKCk7XHJcblxyXG5cdFx0dGhpcy5pc0RlYWQgPSBmYWxzZTtcclxuXHRcdHRoaXMuZGVhdGhzID0gMDtcclxuXHRcdHRoaXMucmVzcGF3blRpbWVyID0gMDtcclxuXHRcdHRoaXMucmVzcGF3blNwZWVkID0gMTA7XHJcblx0XHR0aGlzLnJlc3Bhd25NYXAgPSBkYXRhLm1hcElkO1xyXG5cdFx0dGhpcy5yZXNwYXduWCA9IGRhdGEueDtcclxuXHRcdHRoaXMucmVzcGF3blkgPSBkYXRhLnk7XHJcblxyXG5cdFx0dGhpcy5pbnB1dCA9IHtcclxuXHRcdFx0ZGlyZWN0aW9uOiBudWxsLFxyXG5cdFx0XHRydW46IGZhbHNlLFxyXG5cdFx0XHRwaWNrdXA6IGZhbHNlLFxyXG5cdFx0XHRhdHRhY2s6IGZhbHNlXHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuZ2FtZUlkID0gdXRpbC5maXJzdEVtcHR5SW5kZXgoZ2FtZS5wbGF5ZXJzKTtcclxuXHRcdGdhbWUucGxheWVyc1t0aGlzLmdhbWVJZF0gPSB0aGlzO1xyXG5cdH1cclxuXHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHRzdXBlci51cGRhdGUoZGVsdGEpO1x0XHQvLyBEZWZhdWx0IEFjdG9yIFVwZGF0ZVxyXG5cdFx0aWYgKHRoaXMuaXNEZWFkKSB7XHJcblx0XHRcdC8vIFJlc3Bhd25pbmdcclxuXHRcdFx0dGhpcy5yZXNwYXduVGltZXIgKz0gZGVsdGE7XHJcblx0XHRcdGlmICh0aGlzLnJlc3Bhd25UaW1lciA+PSB0aGlzLnJlc3Bhd25TcGVlZCkgdGhpcy5yZXNwYXduKCk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Ly8gQ2hlY2sgZm9yIEF0dGFjayBJbnB1dFxyXG5cdFx0XHRpZiAodGhpcy5pbnB1dC5hdHRhY2sgJiYgdGhpcy5hdHRhY2tUaW1lciA9PT0gMCkgdGhpcy5hdHRhY2soKTtcclxuXHRcdFx0XHJcblx0XHRcdC8vIENoZWNrIGZvciBNb3ZlbWVudCBJbnB1dFxyXG5cdFx0XHRpZiAoIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5pbnB1dC5kaXJlY3Rpb24pIHtcclxuXHRcdFx0XHRcdC8vIENoZWNrIGZvciBSdW4gSW5wdXRcclxuXHRcdFx0XHRcdGlmICh0aGlzLmlucHV0LnJ1bikge1xyXG5cdFx0XHRcdFx0XHQodGhpcy5lbmVyZ3kgPiAwKSA/IHRoaXMuaXNSdW5uaW5nID0gdHJ1ZSA6IHRoaXMuaXNSdW5uaW5nID0gZmFsc2U7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5pc1J1bm5pbmcgPSBmYWxzZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHRoaXMubW92ZSh0aGlzLmlucHV0LmRpcmVjdGlvbik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiB0aGlzLmdldEdhbWVQYWNrKCk7XHJcblx0fVxyXG5cdFxyXG5cdGdldEdhbWVQYWNrKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0Z2FtZUlkOiB0aGlzLmdhbWVJZCxcclxuXHRcdFx0bmFtZTogdGhpcy5uYW1lLFxyXG5cdFx0XHRkZXNjcmlwdGlvbjogdGhpcy5kZXNjcmlwdGlvbixcclxuXHRcdFx0c3ByaXRlOiB0aGlzLnNwcml0ZSxcclxuXHRcdFx0ZGlyZWN0aW9uOiB0aGlzLmRpcmVjdGlvbixcclxuXHRcdFx0bWFwSWQ6IHRoaXMubWFwSWQsXHJcblx0XHRcdHg6IHRoaXMuc3RhcnRYLFxyXG5cdFx0XHR5OiB0aGlzLnN0YXJ0WSxcclxuXHRcdFx0ejogdGhpcy56LFxyXG5cdFx0XHRkZXN0aW5hdGlvblg6IHRoaXMuZGVzdGluYXRpb25YLFxyXG5cdFx0XHRkZXN0aW5hdGlvblk6IHRoaXMuZGVzdGluYXRpb25ZLFxyXG5cdFx0XHRsZXJwOiB0aGlzLmxlcnAsXHJcblx0XHRcdGlzUnVubmluZzogdGhpcy5pc1J1bm5pbmcsXHJcblx0XHRcdGlzQXR0YWNraW5nOiB0aGlzLmlzQXR0YWNraW5nLFxyXG5cdFx0XHRpc0RlYWQ6IHRoaXMuaXNEZWFkLFxyXG5cdFx0XHRpc1Zpc2libGU6IHRoaXMuaXNWaXNpYmxlXHJcblx0XHR9O1xyXG5cdH1cclxuXHRcclxuXHRnZXRVSVBhY2soKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRsZXZlbDogdGhpcy5sZXZlbCxcclxuXHRcdFx0ZXhwZXJpZW5jZTogdGhpcy5leHBlcmllbmNlLFxyXG5cdFx0XHRoZWFsdGg6IHRoaXMuaGVhbHRoLFxyXG5cdFx0XHRoZWFsdGhNYXg6IHRoaXMuaGVhbHRoTWF4LFxyXG5cdFx0XHRlbmVyZ3k6IHRoaXMuZW5lcmd5LFxyXG5cdFx0XHRlbmVyZ3lNYXg6IHRoaXMuZW5lcmd5TWF4LFxyXG5cdFx0XHRtb3ZlU3BlZWQ6IHRoaXMubW92ZVNwZWVkLFxyXG5cdFx0XHRhdHRhY2tTcGVlZDogdGhpcy5hdHRhY2tTcGVlZCxcclxuXHRcdFx0YXR0YWNrVGltZXI6IHRoaXMuYXR0YWNrVGltZXIsXHJcblx0XHRcdGludmVudG9yeTogdGhpcy5nZXRJbnZlbnRvcnlQYWNrKClcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHRnZXREQlBhY2soKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRuYW1lOiB0aGlzLm5hbWUsXHJcblx0XHRcdGFjY291bnQ6IHRoaXMuYWNjb3VudElkLFxyXG5cdFx0XHR0ZW1wbGF0ZTogdGhpcy50ZW1wbGF0ZUlkLFxyXG5cdFx0XHRsZXZlbDogdGhpcy5sZXZlbCxcclxuXHRcdFx0ZXhwZXJpZW5jZTogdGhpcy5leHBlcmllbmNlLFxyXG5cdFx0XHRtYXBJZDogdGhpcy5tYXBJZCxcclxuXHRcdFx0eDogdGhpcy54LFxyXG5cdFx0XHR5OiB0aGlzLnksXHJcblx0XHRcdGRpcmVjdGlvbjogdGhpcy5kaXJlY3Rpb24sXHJcblx0XHRcdGFkbWluQWNjZXNzOiB0aGlzLmFkbWluQWNjZXNzLFxyXG5cdFx0XHRzcHJpdGU6IHRoaXMuc3ByaXRlXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwaWNrVXAoKSB7XHJcblx0XHRpZiAoc3VwZXIucGlja1VwKCkgPT09IGZhbHNlKSBnYW1lLnNlbmRHYW1lSW5mb1BsYXllcih0aGlzLmdhbWVJZCwgXCJZb3VyIGludmVudG9yeSBpcyBmdWxsLlwiKTtcclxuXHR9XHJcblxyXG5cdHNldERlYWQoa2lsbGVyQ29udHJvbGxlciwga2lsbGVyTmFtZSkge1xyXG5cdFx0c3VwZXIuc2V0RGVhZCgpO1xyXG5cdFx0dGhpcy5pc0RlYWQgPSB0cnVlO1xyXG5cdFx0dGhpcy5oZWFsdGggPSAwO1xyXG5cdFx0dGhpcy5lbmVyZ3kgPSAwO1xyXG5cdFx0dGhpcy5kZWF0aHMrKztcclxuXHRcdFxyXG5cdFx0aWYgKGtpbGxlckNvbnRyb2xsZXIgJiYga2lsbGVyTmFtZSkge1xyXG5cdFx0XHRpZiAoa2lsbGVyQ29udHJvbGxlciA9PT0gJ3BsYXllcicpIHtcclxuXHRcdFx0XHRnYW1lLnNlbmRHYW1lSW5mb0dsb2JhbChraWxsZXJOYW1lICsgXCIgaGFzIG11cmRlcmVkIFwiICsgdGhpcy5uYW1lICsgXCIgaW4gY29sZCBibG9vZCFcIik7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0Z2FtZS5zZW5kR2FtZUluZm9HbG9iYWwodGhpcy5uYW1lICsgXCIgaGFzIGJlZW4ga2lsbGVkIGJ5IFwiICsga2lsbGVyTmFtZSArIFwiIVwiKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGdhbWUuc2VuZEdhbWVJbmZvR2xvYmFsKHRoaXMubmFtZSArIFwiIGhhcyBkaWVkIVwiKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJlc3Bhd24oKSB7XHJcblx0XHR0aGlzLm1hcElkID0gdGhpcy5yZXNwYXduTWFwO1xyXG5cdFx0dGhpcy54ID0gdGhpcy5yZXNwYXduWDtcclxuXHRcdHRoaXMueSA9IHRoaXMucmVzcGF3blk7XHJcblx0XHR0aGlzLnN0YXJ0WCA9IHRoaXMucmVzcGF3blg7XHJcblx0XHR0aGlzLnN0YXJ0WSA9IHRoaXMucmVzcGF3blk7XHJcblx0XHR0aGlzLmRlc3RpbmF0aW9uWCA9IHRoaXMucmVzcGF3blg7XHJcblx0XHR0aGlzLmRlc3RpbmF0aW9uWSA9IHRoaXMucmVzcGF3blk7XHJcblx0XHRcclxuXHRcdHRoaXMuY2FsY0JvbnVzU3RhdHMoKTtcclxuXHRcdHRoaXMucmVzdG9yZSgpO1xyXG5cdFx0XHJcblx0XHR0aGlzLmlzV2Fsa2luZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy5pc1J1bm5pbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMuaXNBdHRhY2tpbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMuaXNEZWFkID0gZmFsc2U7XHJcblx0XHR0aGlzLnJlc3Bhd25UaW1lciA9IDA7XHJcblx0XHRnYW1lLnNlbmRHYW1lSW5mb1BsYXllcih0aGlzLmdhbWVJZCwgXCJUaGUgQW5nZWwgb2YgTWVyY3kgcmVmdXNlcyB0byBsZXQgeW91IGRpZS5cIik7XHJcblx0fVxyXG5cclxuXHRnYWluRXhwZXJpZW5jZShleHBlcmllbmNlKSB7XHJcblx0XHRpZiAodGhpcy5leHBlcmllbmNlICsgZXhwZXJpZW5jZSA8PSAwKSB7XHJcblx0XHRcdHRoaXMuZXhwZXJpZW5jZSA9IDA7XHRcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuZXhwZXJpZW5jZSArPSBleHBlcmllbmNlO1xyXG5cdFx0aWYgKHRoaXMuZXhwZXJpZW5jZSA+PSBnYW1lLmV4cGVyaWVuY2VUb0xldmVsW3RoaXMubGV2ZWxdKSB7XHJcblx0XHRcdHRoaXMubGV2ZWxVcCgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0bGV2ZWxVcCgpIHtcclxuXHRcdGlmICh0aGlzLmxldmVsIDwgY29uZmlnLk1BWF9MRVZFTCkge1xyXG5cdFx0XHRjb25zdCByb2xsb3ZlckV4cGVyaWVuY2UgPSB0aGlzLmV4cGVyaWVuY2UgLSBnYW1lLmV4cGVyaWVuY2VUb0xldmVsW3RoaXMubGV2ZWxdO1xyXG5cdFx0XHR0aGlzLmV4cGVyaWVuY2UgPSAwO1xyXG5cdFx0XHR0aGlzLmxldmVsKys7XHJcblx0XHRcdHRoaXMuY2FsY0Jhc2VTdGF0cygpO1xyXG5cdFx0XHRnYW1lLnNlbmRHYW1lSW5mb1BsYXllcih0aGlzLmdhbWVJZCwgYExldmVsIHVwISBZb3UgYXJlIG5vdyBsZXZlbCAke3RoaXMubGV2ZWx9IWApO1xyXG5cdFx0XHR0aGlzLmdhaW5FeHBlcmllbmNlKHJvbGxvdmVyRXhwZXJpZW5jZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGNhbGNCYXNlU3RhdHModGVtcGxhdGUpIHtcclxuXHRcdGlmICghdGVtcGxhdGUpIHRlbXBsYXRlID0gZ2FtZS5wbGF5ZXJUZW1wbGF0ZXNbdGhpcy50ZW1wbGF0ZUlkXTtcclxuXHRcdHN1cGVyLmNhbGNCYXNlU3RhdHModGVtcGxhdGUpO1xyXG5cdH1cclxufVxyXG4iLCJpbXBvcnQgZ2FtZSBmcm9tICcuLi9nYW1lLmpzJztcclxuaW1wb3J0IHV0aWwgZnJvbSAnLi4vdXRpbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXh0IHtcclxuXHRjb25zdHJ1Y3RvcihtYXBJZCwgeCwgeSwgbWVzc2FnZSwgY29sb3VyID0gJyMwMDAwMDAnLCBkaXNwbGF5VGltZSA9IDIsIHZlbFggPSAwLCB2ZWxZID0gMCkge1xyXG5cdFx0dGhpcy5tYXBJZCA9IG1hcElkO1xyXG5cdFx0dGhpcy54ID0geDtcclxuXHRcdHRoaXMueSA9IHk7XHJcblx0XHR0aGlzLnZlbFggPSB2ZWxYO1xyXG5cdFx0dGhpcy52ZWxZID0gdmVsWTtcclxuXHRcdHRoaXMubGVycFggPSAwO1xyXG5cdFx0dGhpcy5sZXJwWSA9IDA7XHJcblxyXG5cdFx0dGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcclxuXHRcdHRoaXMuY29sb3VyID0gY29sb3VyO1xyXG5cdFx0dGhpcy5kaXNwbGF5VGltZSA9IGRpc3BsYXlUaW1lO1xyXG5cdFx0dGhpcy50aW1lciA9IDA7XHJcblxyXG5cdFx0dGhpcy5pZCA9IHV0aWwuZmlyc3RFbXB0eUluZGV4KGdhbWUubWFwc1t0aGlzLm1hcElkXS50ZXh0cyk7XHJcblx0XHRnYW1lLm1hcHNbdGhpcy5tYXBJZF0udGV4dHNbdGhpcy5pZF0gPSB0aGlzO1xyXG5cdH1cclxuXHRcclxuXHR1cGRhdGUoZGVsdGEpIHtcclxuXHRcdHRoaXMudGltZXIgKz0gZGVsdGE7XHJcblx0XHRpZiAodGhpcy5kaXNwbGF5VGltZSA+IDAgJiYgdGhpcy50aW1lciA+IHRoaXMuZGlzcGxheVRpbWUpIHtcclxuXHRcdFx0dGhpcy5yZW1vdmUoKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLmxlcnBYICs9IGRlbHRhICogdGhpcy52ZWxYO1xyXG5cdFx0dGhpcy5sZXJwWSArPSBkZWx0YSAqIHRoaXMudmVsWTtcclxuXHJcblx0XHRpZiAodGhpcy5sZXJwWCA8IC0xKSB7XHJcblx0XHRcdHRoaXMubGVycFgrKztcclxuXHRcdFx0dGhpcy54LS07XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmICh0aGlzLmxlcnBYID4gMSkge1xyXG5cdFx0XHR0aGlzLmxlcnBYLS07XHJcblx0XHRcdHRoaXMueCsrO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLmxlcnBZIDwgLTEpIHtcclxuXHRcdFx0dGhpcy5sZXJwWSsrO1xyXG5cdFx0XHR0aGlzLnktLTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKHRoaXMubGVycFkgPiAxKSB7XHJcblx0XHRcdHRoaXMubGVycFktLTtcclxuXHRcdFx0dGhpcy55Kys7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiB0aGlzLmdldFBhY2soKTtcclxuXHR9XHJcblx0XHJcblx0Z2V0UGFjaygpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGlkOiB0aGlzLmlkLFxyXG5cdFx0XHRtYXBJZDogdGhpcy5tYXBJZCxcclxuXHRcdFx0eDogdGhpcy54LFxyXG5cdFx0XHR5OiB0aGlzLnksXHJcblx0XHRcdGxlcnBYOiB0aGlzLmxlcnBYLFxyXG5cdFx0XHRsZXJwWTogdGhpcy5sZXJwWSxcclxuXHRcdFx0bWVzc2FnZTogdGhpcy5tZXNzYWdlLFxyXG5cdFx0XHRjb2xvdXI6IHRoaXMuY29sb3VyXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0cmVtb3ZlKCkge1xyXG5cdFx0ZGVsZXRlIGdhbWUubWFwc1t0aGlzLm1hcElkXS50ZXh0c1t0aGlzLmlkXTtcclxuXHR9XHJcbn1cclxuIiwiY29uc3QgY29uZmlnID0ge307XHJcblxyXG5jb25maWcuUE9SVCA9IDIwMDA7XHJcbmNvbmZpZy5GUkFNRVJBVEUgPSAxMDAwIC8gNjA7XHJcbmNvbmZpZy5CQUNLVVBfVElNRSA9IDEyMDtcclxuXHJcbmNvbmZpZy5NQVBfTEFZRVJTID0gNjtcclxuY29uZmlnLk1BUF9DT0xVTU5TID0gMTI7XHJcbmNvbmZpZy5NQVBfUk9XUyA9IDEyO1xyXG5cclxuY29uZmlnLk1BWF9NQVBTID0gMTA7XHJcbmNvbmZpZy5NQVhfVVNFUlMgPSAxMDA7XHJcbmNvbmZpZy5NQVhfU1BSSVRFUyA9IDEzO1xyXG5jb25maWcuTUFYX0VGRkVDVFMgPSA3MTtcclxuY29uZmlnLk1BWF9MRVZFTCA9IDMwO1xyXG5cclxuY29uZmlnLk1BWF9IRUFMVEhfQkFTRSA9IDIwMDtcclxuY29uZmlnLk1BWF9IRUFMVEhfQk9OVVMgPSA1NTtcclxuY29uZmlnLk1BWF9FTkVSR1lfQkFTRSA9IDIwMDtcclxuY29uZmlnLk1BWF9FTkVSR1lfQk9OVVMgPSA1NTtcclxuXHJcbmNvbmZpZy5JTlZFTlRPUllfU0laRSA9IDIwO1xyXG5jb25maWcuRVFVSVBNRU5UX1NJWkUgPSA1O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY29uZmlnO1xyXG4iLCJpbXBvcnQgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xyXG5pbXBvcnQgYmNyeXB0IGZyb20gJ2JjcnlwdCc7XHJcbmltcG9ydCBmcyBmcm9tICdmcyc7XHJcblxyXG5pbXBvcnQgdXRpbCBmcm9tIFwiLi91dGlsLmpzXCI7XHJcbmltcG9ydCBBY2NvdW50IGZyb20gJy4vbW9kZWxzL2FjY291bnQuanMnO1xyXG5pbXBvcnQgUGxheWVyIGZyb20gJy4vbW9kZWxzL3BsYXllci5qcyc7XHJcbmltcG9ydCBQbGF5ZXJUZW1wbGF0ZSBmcm9tICcuL21vZGVscy9wbGF5ZXJUZW1wbGF0ZS5qcyc7XHJcbmltcG9ydCBCb3RUZW1wbGF0ZSBmcm9tICcuL21vZGVscy9ib3RUZW1wbGF0ZS5qcyc7XHJcbmltcG9ydCBJdGVtVHlwZSBmcm9tICcuL21vZGVscy9pdGVtVHlwZS5qcyc7XHJcbmltcG9ydCBJdGVtVGVtcGxhdGUgZnJvbSAnLi9tb2RlbHMvaXRlbVRlbXBsYXRlLmpzJztcclxuaW1wb3J0IE1hcCBmcm9tICcuL21vZGVscy9tYXAuanMnO1xyXG5cclxuY29uc3QgZnNwID0gZnMucHJvbWlzZXM7XHJcbm1vbmdvb3NlLlByb21pc2UgPSBQcm9taXNlO1xyXG5tb25nb29zZS5jb25uZWN0KCdtb25nb2RiOi8vbG9jYWxob3N0L29keXNzZXknLCB7dXNlTmV3VXJsUGFyc2VyOiB0cnVlfSk7XHJcblxyXG5jbGFzcyBEYXRhYmFzZSB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHR0aGlzLnNlcnZlckxvZyA9IFtdO1xyXG5cdH1cclxuXHJcblx0YXN5bmMgYmFja3VwKCkge1xyXG5cdFx0Ly9UT0RPIHNhdmUgZXZlcnl0aGluZ1xyXG5cdFx0Ly8gY29uc3QgbWFwcyA9IHNhdmUtYWxsLW1hcHNcclxuXHRcdC8vIGNvbnN0IHBsYXllcnMgPSBzYXZlLWFsbC1vbmxpbmUtcGxheWVyc1xyXG5cdFx0Ly8gY29uc3QgYm90cyA9IHNhdmUtYWxsLWJvdHNcclxuXHRcdC8vIGNvbnN0IGl0ZW1zID0gc2F2ZS1hbGwtaXRlbXNcclxuXHRcdGxldCBsb2dTYXZlZCA9IHRoaXMuc2F2ZUxvZygpO1xyXG5cdFx0YXdhaXQgUHJvbWlzZS5hbGwoW2xvZ1NhdmVkXSk7XHJcblx0XHR0aGlzLmxvZyhcIkdhbWUgc2F2ZWQgdG8gZGlzay5cIik7XHJcblx0fVxyXG5cdFxyXG5cdGxvZyhtZXNzYWdlKSB7XHJcblx0XHRjb25zdCBkYXRlID0gbmV3IERhdGUoKTtcclxuXHRcdGNvbnNvbGUubG9nKHV0aWwudGltZXN0YW1wKGRhdGUpICsgXCIgLSBcIiArIG1lc3NhZ2UpO1xyXG5cdFx0dGhpcy5zZXJ2ZXJMb2cucHVzaCh7XHJcblx0XHRcdG1lc3NhZ2UsXHJcblx0XHRcdGRhdGVcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRhc3luYyBzYXZlTG9nKCkge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0Y29uc3Qgc2F2ZWRMb2cgPSBhd2FpdCBmc3AucmVhZEZpbGUoJy4vc2VydmVyL2xvZy5qc29uJyk7XHJcblx0XHRcdGNvbnN0IG5ld0xvZyA9IEpTT04ucGFyc2Uoc2F2ZWRMb2cpLmNvbmNhdCh0aGlzLnNlcnZlckxvZyk7XHJcblx0XHRcdHRoaXMuc2VydmVyTG9nID0gW107XHJcblx0XHRcdGF3YWl0IGZzcC53cml0ZUZpbGUoJy4vc2VydmVyL2xvZy5qc29uJywgSlNPTi5zdHJpbmdpZnkobmV3TG9nKSk7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0Y2F0Y2goZXJyKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHR9XHJcblx0YXN5bmMgY2xlYXJMb2coKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHR0aGlzLnNlcnZlckxvZyA9IFtdO1xyXG5cdFx0XHRhd2FpdCBmc3Aud3JpdGVGaWxlKCcuL3NlcnZlci9sb2cuanNvbicsIFwiW11cIik7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0Y2F0Y2ggKGVycikge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRhc3luYyBoYXNoUGFzc3dvcmQocGFzc3dvcmQpIHtcclxuXHRcdHJldHVybiBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblx0XHRcdGJjcnlwdC5oYXNoKHBhc3N3b3JkLCAxMCwgKGVyciwgaGFzaCkgPT4ge1xyXG5cdFx0XHRcdGlmIChlcnIpIHJlamVjdChlcnIpO1xyXG5cdFx0XHRcdGVsc2UgcmVzb2x2ZShoYXNoKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0YXN5bmMgY29tcGFyZVBhc3N3b3JkKHBhc3N3b3JkLCBoYXNoZWRQYXNzd29yZCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0YmNyeXB0LmNvbXBhcmUocGFzc3dvcmQsIGhhc2hlZFBhc3N3b3JkLCAoZXJyLCBtYXRjaCkgPT4ge1xyXG5cdFx0XHRcdGlmIChlcnIpIHJlamVjdChlcnIpO1xyXG5cdFx0XHRcdGVsc2UgcmVzb2x2ZShtYXRjaCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdGFzeW5jIGF1dGhBY2NvdW50KHVzZXJuYW1lLCBwYXNzd29yZCkge1xyXG5cdFx0Y29uc3QgYWNjb3VudCA9IGF3YWl0IEFjY291bnQuZmluZE9uZSh7dXNlcm5hbWU6IHVzZXJuYW1lfSkuZXhlYygpO1xyXG5cdFx0aWYgKCFhY2NvdW50KSByZXR1cm4gZmFsc2U7XHJcblx0XHRcclxuXHRcdHJldHVybiB0aGlzLmNvbXBhcmVQYXNzd29yZChwYXNzd29yZCwgYWNjb3VudC5wYXNzd29yZCk7XHJcblx0fVxyXG5cclxuXHRhc3luYyBhZGRBY2NvdW50KHVzZXJuYW1lLCBwYXNzd29yZCwgZW1haWwpIHtcclxuXHRcdGxldCBhY2NvdW50ID0gYXdhaXQgdGhpcy5nZXRBY2NvdW50SWQodXNlcm5hbWUpO1xyXG5cdFx0aWYgKGFjY291bnQpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coYEFjY291bnQgYWxyZWFkeSBleGlzdHMgd2l0aCB1c2VybmFtZSAke3VzZXJuYW1lfS5gKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IGhhc2hlZFBhc3N3b3JkID0gYXdhaXQgdGhpcy5oYXNoUGFzc3dvcmQocGFzc3dvcmQpO1xyXG5cdFx0YWNjb3VudCA9IG5ldyBBY2NvdW50KHtcclxuXHRcdFx0X2lkOiBuZXcgbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQsXHJcblx0XHRcdHVzZXJuYW1lLFxyXG5cdFx0XHRwYXNzd29yZDogaGFzaGVkUGFzc3dvcmRcclxuXHRcdH0pO1xyXG5cdFx0Ly9pZiAoZW1haWwpIGFjY291bnQuZW1haWwgPSBlbWFpbDtcclxuXHJcblx0XHRyZXR1cm4gYXdhaXQgYWNjb3VudC5zYXZlKClcclxuXHRcdC50aGVuKHJlc3VsdCA9PiB7XHJcblx0XHRcdHRoaXMubG9nKGBBY2NvdW50IGFkZGVkOiAke3VzZXJuYW1lfS5gKVxyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH0pXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBnZXRBY2NvdW50KGFjY291bnRJZCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IEFjY291bnQuZmluZEJ5SWQoYWNjb3VudElkKVxyXG5cdFx0LnNlbGVjdCgnX2lkIHVzZXJuYW1lIHBhc3N3b3JkIGVtYWlsIHZlcmlmaWVkJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKGFjY291bnQgPT4gYWNjb3VudClcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIGdldEFjY291bnRJZCh1c2VybmFtZSkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IEFjY291bnQuZmluZE9uZSh7dXNlcm5hbWU6IHVzZXJuYW1lfSlcclxuXHRcdC5zZWxlY3QoJ19pZCcpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbihhY2NvdW50ID0+IHtcclxuXHRcdFx0aWYgKGFjY291bnQpIHtcclxuXHRcdFx0XHRyZXR1cm4gYWNjb3VudC5faWQ7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBzYXZlQWNjb3VudChkYXRhKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgQWNjb3VudC51cGRhdGVPbmUoe3VzZXJuYW1lOiBkYXRhLnVzZXJuYW1lfSwgeyRzZXQ6IGRhdGF9KVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4ocmVzdWx0ID0+IHRydWUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHJcblx0YXN5bmMgYWRkUGxheWVyKGFjY291bnRJZCwgbmFtZSwgdGVtcGxhdGVJZCkge1xyXG5cdFx0bGV0IGFjY291bnQgPSBhd2FpdCB0aGlzLmdldEFjY291bnQoYWNjb3VudElkKTtcclxuXHRcdGlmICghYWNjb3VudCkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIkFjY291bnQgZG9lcyBub3QgZXhpc3Qgd2l0aCB0aGF0IGlkLlwiKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0bGV0IHRlbXBsYXRlID0gYXdhaXQgdGhpcy5nZXRQbGF5ZXJUZW1wbGF0ZSh0ZW1wbGF0ZUlkKTtcclxuXHRcdGlmICghdGVtcGxhdGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJQbGF5ZXIgVGVtcGxhdGUgZG9lcyBub3QgZXhpc3Qgd2l0aCB0aGF0IGlkLlwiKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0bGV0IHBsYXllciA9IGF3YWl0IHRoaXMuZ2V0UGxheWVyKG5hbWUpO1xyXG5cdFx0aWYgKHBsYXllcikge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIlBsYXllciBhbHJlYWR5IGV4aXN0cyB3aXRoIHRoYXQgbmFtZS5cIik7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHRwbGF5ZXIgPSBuZXcgUGxheWVyKHtcclxuXHRcdFx0X2lkIDogbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkLFxyXG5cdFx0XHRuYW1lLFxyXG5cdFx0XHRhY2NvdW50OiBhY2NvdW50SWQsXHJcblx0XHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZUlkXHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gYXdhaXQgcGxheWVyLnNhdmUoKVxyXG5cdFx0LnRoZW4ocmVzdWx0ID0+IHRydWUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBnZXRQbGF5ZXIobmFtZSkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IFBsYXllci5maW5kT25lKHtuYW1lOiBuYW1lfSlcclxuXHRcdC5zZWxlY3QoJ19pZCBhY2NvdW50IG5hbWUgdGVtcGxhdGUgbGV2ZWwgZXhwZXJpZW5jZSBtYXBJZCB4IHkgZGlyZWN0aW9uIGFkbWluQWNjZXNzIHNwcml0ZScpXHJcblx0XHQucG9wdWxhdGUoJ3RlbXBsYXRlJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHBsYXllciA9PiBwbGF5ZXIpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBzYXZlUGxheWVyKGRhdGEpIHtcclxuXHRcdHJldHVybiBhd2FpdCBQbGF5ZXIudXBkYXRlT25lKHtuYW1lOiBkYXRhLm5hbWV9LCB7JHNldDogZGF0YX0pXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbihyZXN1bHQgPT4gdHJ1ZSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cclxuXHRhc3luYyBhZGRCb3QodGVtcGxhdGVOYW1lLCBtYXBJZCwgeCwgeSkge1xyXG5cdFx0bGV0IHRlbXBsYXRlSWQgPSBhd2FpdCB0aGlzLmdldFBsYXllclRlbXBsYXRlSWQodGVtcGxhdGVOYW1lKTtcclxuXHRcdGlmICghdGVtcGxhdGVJZCkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIkJvdCBUZW1wbGF0ZSBkb2VzIG5vdCBleGlzdCB3aXRoIHRoYXQgbmFtZS5cIik7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHRcdGxldCBib3QgPSBhd2FpdCB0aGlzLmdldEJvdChuYW1lKTtcclxuXHRcdGlmIChib3QpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJCb3QgYWxyZWFkeSBleGlzdHMgd2l0aCB0aGF0IG5hbWUuXCIpO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0Ym90ID0gbmV3IEJvdCh7XHJcblx0XHRcdF9pZCA6IG5ldyBtb25nb29zZS5UeXBlcy5PYmplY3RJZCxcclxuXHRcdFx0dGVtcGxhdGU6IHRlbXBsYXRlSWQsXHJcblx0XHRcdG1hcElkLFxyXG5cdFx0XHR4LFxyXG5cdFx0XHR5XHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gYXdhaXQgYm90LnNhdmUoKVxyXG5cdFx0LnRoZW4ocmVzdWx0ID0+IHRydWUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBnZXRCb3QobmFtZSkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IEJvdC5maW5kT25lKHtuYW1lOiBuYW1lfSlcclxuXHRcdC5zZWxlY3QoJ19pZCBuYW1lIHNwcml0ZSB0ZW1wbGF0ZSBsZXZlbCBleHBlcmllbmNlIG1hcElkIHggeSBkaXJlY3Rpb24nKVxyXG5cdFx0LnBvcHVsYXRlKCd0ZW1wbGF0ZScpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbihib3QgPT4gYm90KVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgc2F2ZUJvdChkYXRhKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgQm90LnVwZGF0ZU9uZSh7bmFtZTogZGF0YS5uYW1lfSwgeyRzZXQ6IGRhdGF9KVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4ocmVzdWx0ID0+IHRydWUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHJcblx0YXN5bmMgZ2V0TWFwKG1hcElkKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgTWFwLmZpbmRPbmUoe21hcElkOiBtYXBJZH0pXHJcblx0XHQuc2VsZWN0KCdtYXBJZCBuYW1lIGRyb3BDaGFuY2UgZHJvcEFtb3VudEVRIHRpbGVzIGlzV2FsbCBpc0hvc3RpbGUgZGFtYWdlIHdhcnBNYXAgd2FycFggd2FycFknKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4obWFwID0+IG1hcClcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIHNhdmVNYXAoZGF0YSkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IE1hcC51cGRhdGVPbmUoe21hcElkOiBkYXRhLm1hcElkfSwgeyRzZXQ6IGRhdGF9LCB7dXBzZXJ0OiB0cnVlfSlcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHJlc3VsdCA9PiB0cnVlKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgZ2V0QWxsTWFwcygpIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHJldHVybiBhd2FpdCBNYXAuZmluZCh7fSlcclxuXHRcdFx0LnNlbGVjdCgnbWFwSWQgbmFtZSB0aWxlcyBob3N0aWxlIGRyb3BDaGFuY2UgZHJvcEFtb3VudEVRJylcclxuXHRcdFx0LmV4ZWMoKVxyXG5cdFx0XHQudGhlbihtYXBzID0+IG1hcHMpXHJcblx0XHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0XHR9XHJcblx0XHRjYXRjaChlcnIpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGFzeW5jIGFkZFBsYXllclRlbXBsYXRlKGRhdGEpIHtcclxuXHRcdGlmICghZGF0YS5uYW1lKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiTmFtZSBpcyByZXF1aXJlZC5cIik7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgY2hlY2tUZW1wbGF0ZSA9IGF3YWl0IFBsYXllclRlbXBsYXRlLmZpbmRPbmUoe25hbWU6IGRhdGEubmFtZX0pXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbih0ZW1wbGF0ZSA9PiB0ZW1wbGF0ZSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblxyXG5cdFx0aWYgKGNoZWNrVGVtcGxhdGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJUZW1wbGF0ZSBhbHJlYWR5IGV4aXN0cyB3aXRoIHRoYXQgbmFtZS5cIik7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCB0ZW1wbGF0ZSA9IG5ldyBQbGF5ZXJUZW1wbGF0ZSh7XHJcblx0XHRcdF9pZDogbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkLFxyXG5cdFx0XHRuYW1lOiBkYXRhLm5hbWUsXHJcblx0XHRcdHNwcml0ZTogZGF0YS5zcHJpdGUsXHJcblx0XHRcdGRhbWFnZUJhc2U6IGRhdGEuZGFtYWdlQmFzZSxcclxuXHRcdFx0ZGVmZW5jZUJhc2U6IGRhdGEuZGVmZW5jZUJhc2UsXHJcblx0XHRcdGhlYWx0aE1heEJhc2U6IGRhdGEuaGVhbHRoTWF4QmFzZSxcclxuXHRcdFx0ZW5lcmd5TWF4QmFzZTogZGF0YS5lbmVyZ3lNYXhCYXNlLFxyXG5cdFx0XHRyYW5nZUJhc2U6IGRhdGEucmFuZ2VCYXNlLFxyXG5cdFx0XHRoZWFsdGhQZXJMZXZlbDogZGF0YS5oZWFsdGhQZXJMZXZlbCxcclxuXHRcdFx0ZW5lcmd5UGVyTGV2ZWw6IGRhdGEuZW5lcmd5UGVyTGV2ZWxcclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBhd2FpdCB0ZW1wbGF0ZS5zYXZlKClcclxuXHRcdC50aGVuKHJlc3VsdCA9PiB0cnVlKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgZ2V0UGxheWVyVGVtcGxhdGUodGVtcGxhdGVJZCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IFBsYXllclRlbXBsYXRlLmZpbmRCeUlkKHRlbXBsYXRlSWQpXHJcblx0XHQuc2VsZWN0KCduYW1lIHNwcml0ZSBkYW1hZ2VCYXNlIGRlZmVuY2VCYXNlIGhlYWx0aE1heEJhc2UgZW5lcmd5TWF4QmFzZSByYW5nZUJhc2UgaGVhbHRoUGVyTGV2ZWwsIGVuZXJneVBlckxldmVsJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHRlbXBsYXRlID0+IHRlbXBsYXRlKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgZ2V0QWxsUGxheWVyVGVtcGxhdGVzKCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IFBsYXllclRlbXBsYXRlLmZpbmQoe30pXHJcblx0XHQuc2VsZWN0KCdfaWQgbmFtZSBzcHJpdGUgZGFtYWdlQmFzZSBkZWZlbmNlQmFzZSBoZWFsdGhNYXhCYXNlIGVuZXJneU1heEJhc2UgcmFuZ2VCYXNlIGhlYWx0aFBlckxldmVsLCBlbmVyZ3lQZXJMZXZlbCcpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbih0ZW1wbGF0ZXMgPT4gdGVtcGxhdGVzKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblxyXG5cdGFzeW5jIGFkZEJvdFRlbXBsYXRlKGRhdGEpIHtcclxuXHRcdGNvbnN0IHRlbXBsYXRlID0gbmV3IEJvdFRlbXBsYXRlKHtcclxuXHRcdFx0X2lkOiBuZXcgbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQsXHJcblx0XHRcdG5hbWU6IGRhdGEubmFtZSxcclxuXHRcdFx0c3ByaXRlOiBkYXRhLnNwcml0ZSxcclxuXHRcdFx0ZGFtYWdlQmFzZTogZGF0YS5kYW1hZ2VCYXNlLFxyXG5cdFx0XHRkZWZlbmNlQmFzZTogZGF0YS5kZWZlbmNlQmFzZSxcclxuXHRcdFx0aGVhbHRoTWF4QmFzZTogZGF0YS5oZWFsdGhNYXhCYXNlLFxyXG5cdFx0XHRlbmVyZ3lNYXhCYXNlOiBkYXRhLmVuZXJneU1heEJhc2UsXHJcblx0XHRcdHJhbmdlQmFzZTogZGF0YS5yYW5nZUJhc2UsXHJcblx0XHRcdGhvc3RpbGU6IGRhdGEuaG9zdGlsZVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIGF3YWl0IHRlbXBsYXRlLnNhdmUoKVxyXG5cdFx0LnRoZW4ocmVzdWx0ID0+IHRydWUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBnZXRCb3RUZW1wbGF0ZSh0ZW1wbGF0ZUlkKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgQm90VGVtcGxhdGUuZmluZEJ5SWQodGVtcGxhdGVJZClcclxuXHRcdC5zZWxlY3QoJ25hbWUgc3ByaXRlIGRhbWFnZUJhc2UgZGVmZW5jZUJhc2UgaGVhbHRoTWF4QmFzZSBlbmVyZ3lNYXhCYXNlIHJhbmdlQmFzZSBob3N0aWxlJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHRlbXBsYXRlID0+IHRlbXBsYXRlKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgZ2V0QWxsQm90VGVtcGxhdGVzKCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IEJvdFRlbXBsYXRlLmZpbmQoe30pXHJcblx0XHQuc2VsZWN0KCdfaWQgbmFtZSBzcHJpdGUgZGFtYWdlQmFzZSBkZWZlbmNlQmFzZSBoZWFsdGhNYXhCYXNlIGVuZXJneU1heEJhc2UgcmFuZ2VCYXNlIGhvc3RpbGUnKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4odGVtcGxhdGVzID0+IHRlbXBsYXRlcylcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cclxuXHRhc3luYyBhZGRJdGVtVHlwZShkYXRhKSB7XHJcblx0XHRjb25zdCB0eXBlID0gbmV3IEl0ZW1UeXBlKHtcclxuXHRcdFx0X2lkOiBuZXcgbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQsXHJcblx0XHRcdG5hbWU6IGRhdGEubmFtZSxcclxuXHRcdFx0c3RhY2thYmxlOiBkYXRhLnN0YWNrYWJsZSxcclxuXHRcdFx0ZXF1aXBwZWRTbG90OiBkYXRhLmVxdWlwcGVkU2xvdFxyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIGF3YWl0IHR5cGUuc2F2ZSgpXHJcblx0XHQudGhlbihyZXN1bHQgPT4gdHJ1ZSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIGdldEl0ZW1UeXBlKHR5cGVJZCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IEl0ZW1UeXBlLmZpbmRCeUlkKHR5cGVJZClcclxuXHRcdC5zZWxlY3QoJ25hbWUgc3RhY2thYmxlIGVxdWlwcGVkU2xvdCcpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbih0eXBlID0+IHR5cGUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBnZXRBbGxJdGVtVHlwZXMoKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgSXRlbVR5cGUuZmluZCh7fSlcclxuXHRcdC5zZWxlY3QoJ19pZCBuYW1lIHN0YWNrYWJsZSBlcXVpcHBlZFNsb3QnKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4odHlwZXMgPT4gdHlwZXMpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHJcblx0YXN5bmMgYWRkSXRlbVRlbXBsYXRlKGRhdGEpIHtcclxuXHRcdGNvbnN0IHRlbXBsYXRlID0gbmV3IEl0ZW1UZW1wbGF0ZSh7XHJcblx0XHRcdF9pZDogbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkLFxyXG5cdFx0XHRuYW1lOiBkYXRhLm5hbWUsXHJcblx0XHRcdHNwcml0ZTogZGF0YS5zcHJpdGUsXHJcblx0XHRcdHR5cGU6IGRhdGEudHlwZUlkLFxyXG5cdFx0XHRwYXNzaXZlRGFtYWdlOiBkYXRhLnBhc3NpdmVEYW1hZ2UsXHJcblx0XHRcdHBhc3NpdmVEZWZlbmNlOiBkYXRhLnBhc3NpdmVEZWZlbmNlLFxyXG5cdFx0XHRwYXNzaXZlSGVhbHRoTWF4OiBkYXRhLnBhc3NpdmVIZWFsdGhNYXgsXHJcblx0XHRcdHBhc3NpdmVFbmVyZ3lNYXg6IGRhdGEucGFzc2l2ZUVuZXJneU1heCxcclxuXHRcdFx0cGFzc2l2ZVJhbmdlOiBkYXRhLnBhc3NpdmVSYW5nZSxcclxuXHRcdFx0ZXF1aXBwZWREYW1hZ2U6IGRhdGEuZXF1aXBwZWREYW1hZ2UsXHJcblx0XHRcdGVxdWlwcGVkRGVmZW5jZTogZGF0YS5lcXVpcHBlZERlZmVuY2UsXHJcblx0XHRcdGVxdWlwcGVkSGVhbHRoTWF4OiBkYXRhLmVxdWlwcGVkSGVhbHRoTWF4LFxyXG5cdFx0XHRlcXVpcHBlZEVuZXJneU1heDogZGF0YS5lcXVpcHBlZEVuZXJneU1heCxcclxuXHRcdFx0ZXF1aXBwZWRSYW5nZTogZGF0YS5lcXVpcHBlZFJhbmdlXHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gYXdhaXQgdGVtcGxhdGUuc2F2ZSgpXHJcblx0XHQudGhlbihyZXN1bHQgPT4gdHJ1ZSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIGdldEl0ZW1UZW1wbGF0ZSh0ZW1wbGF0ZUlkKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgSXRlbVRlbXBsYXRlLmZpbmRCeUlkKHRlbXBsYXRlSWQpXHJcblx0XHQuc2VsZWN0KCduYW1lIHNwcml0ZSB0eXBlIHBhc3NpdmVEYW1hZ2UgcGFzc2l2ZURlZmVuY2UgcGFzc2l2ZUhlYWx0aE1heCBwYXNzaXZlRW5lcmd5TWF4QmFzZSBwYXNzaXZlUmFuZ2UgZXF1aXBwZWREYW1hZ2UgZXF1aXBwZWREZWZlbmNlIGVxdWlwcGVkSGVhbHRoTWF4IGVxdWlwcGVkRW5lcmd5TWF4QmFzZSBlcXVpcHBlZFJhbmdlJylcclxuXHRcdC5wb3B1bGF0ZSgndHlwZScpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbih0ZW1wbGF0ZSA9PiB0ZW1wbGF0ZSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIGdldEFsbEl0ZW1UZW1wbGF0ZXMoKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgSXRlbVRlbXBsYXRlLmZpbmQoe30pXHJcblx0XHQuc2VsZWN0KCdfaWQgbmFtZSBzcHJpdGUgdHlwZSBwYXNzaXZlRGFtYWdlIHBhc3NpdmVEZWZlbmNlIHBhc3NpdmVIZWFsdGhNYXggcGFzc2l2ZUVuZXJneU1heEJhc2UgcGFzc2l2ZVJhbmdlIGVxdWlwcGVkRGFtYWdlIGVxdWlwcGVkRGVmZW5jZSBlcXVpcHBlZEhlYWx0aE1heCBlcXVpcHBlZEVuZXJneU1heEJhc2UgZXF1aXBwZWRSYW5nZScpXHJcblx0XHQucG9wdWxhdGUoJ3R5cGUnKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4odGVtcGxhdGVzID0+IHRlbXBsYXRlcylcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG59XHJcblxyXG5jb25zdCBkYiA9IG5ldyBEYXRhYmFzZSgpO1xyXG5leHBvcnQgZGVmYXVsdCBkYjtcclxuIiwiaW1wb3J0IGRiIGZyb20gJy4vZGIuanMnO1xyXG5pbXBvcnQgY29uZmlnIGZyb20gJy4vY29uZmlnLmpzJztcclxuXHJcbmltcG9ydCBNYXAgZnJvbSAnLi9jbGFzc2VzL21hcC5qcyc7XHJcbmltcG9ydCBQbGF5ZXIgZnJvbSAnLi9jbGFzc2VzL3BsYXllci5qcyc7XHJcbmltcG9ydCBCb3QgZnJvbSAnLi9jbGFzc2VzL2JvdC5qcyc7XHJcbmltcG9ydCBJdGVtIGZyb20gJy4vY2xhc3Nlcy9pdGVtLmpzJztcclxuaW1wb3J0IEVmZmVjdCBmcm9tICcuL2NsYXNzZXMvZWZmZWN0LmpzJztcclxuaW1wb3J0IFRleHQgZnJvbSAnLi9jbGFzc2VzL3RleHQuanMnO1xyXG5pbXBvcnQgTWVzc2FnZSBmcm9tICcuL2NsYXNzZXMvbWVzc2FnZS5qcyc7XHJcblxyXG5jbGFzcyBHYW1lIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHRoaXMubWFwcyA9IFtdO1xyXG5cdFx0dGhpcy5wbGF5ZXJzID0gW107XHJcblx0XHR0aGlzLmJvdHMgPSBbXTtcclxuXHRcdHRoaXMuaXRlbXMgPSBbXTtcclxuXHRcdHRoaXMuZWZmZWN0cyA9IFtdO1xyXG5cdFx0dGhpcy50ZXh0cyA9IFtdO1xyXG5cdFx0dGhpcy5tZXNzYWdlUXVldWUgPSBbXTtcclxuXHRcdFxyXG5cdFx0dGhpcy5wbGF5ZXJUZW1wbGF0ZXMgPSB7fTtcclxuXHRcdHRoaXMuYm90VGVtcGxhdGVzID0ge307XHJcblx0XHR0aGlzLml0ZW1UZW1wbGF0ZXMgPSB7fTtcclxuXHJcblx0XHR0aGlzLmxvYWRNYXBzKCk7XHJcblx0XHR0aGlzLmxvYWRQbGF5ZXJUZW1wbGF0ZXMoKTtcclxuXHRcdHRoaXMubG9hZEJvdFRlbXBsYXRlcygpO1xyXG5cdFx0dGhpcy5sb2FkSXRlbVRlbXBsYXRlcygpO1xyXG5cdH1cclxuXHJcblx0bG9hZE1hcHMoKSB7XHJcblx0XHRkYi5nZXRBbGxNYXBzKClcclxuXHRcdC50aGVuKG1hcERhdGEgPT4ge1xyXG5cdFx0XHRjb25zdCBvcmRlcmVkTWFwRGF0YSA9IFtdO1xyXG5cdFx0XHRmb3IgKGxldCBpZCA9IDA7IGlkIDwgbWFwRGF0YS5sZW5ndGg7IGlkKyspIHtcclxuXHRcdFx0XHRjb25zdCBkYXRhID0gbWFwRGF0YVtpZF07XHJcblx0XHRcdFx0aWYgKGRhdGEpIG9yZGVyZWRNYXBEYXRhW2RhdGEubWFwSWRdID0gZGF0YTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Zm9yIChsZXQgaWQgPSAwOyBpZCA8IGNvbmZpZy5NQVhfTUFQUzsgaWQrKykge1xyXG5cdFx0XHRcdGlmIChvcmRlcmVkTWFwRGF0YVtpZF0pIHtcclxuXHRcdFx0XHRcdHRoaXMubWFwc1tpZF0gPSBuZXcgTWFwKGlkLCBvcmRlcmVkTWFwRGF0YVtpZF0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubWFwc1tpZF0gPSBuZXcgTWFwKGlkKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHJcblx0bG9hZFBsYXllclRlbXBsYXRlcygpIHtcclxuXHRcdGRiLmdldEFsbFBsYXllclRlbXBsYXRlcygpXHJcblx0XHQudGhlbih0ZW1wbGF0ZXMgPT4ge1xyXG5cdFx0XHR0aGlzLnBsYXllclRlbXBsYXRlcyA9IHt9O1xyXG5cdFx0XHR0ZW1wbGF0ZXMuZm9yRWFjaCh0ZW1wbGF0ZSA9PiB7XHJcblx0XHRcdFx0dGhpcy5wbGF5ZXJUZW1wbGF0ZXNbdGVtcGxhdGUuX2lkXSA9IHRlbXBsYXRlO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pLmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblxyXG5cdGxvYWRCb3RUZW1wbGF0ZXMoKSB7XHJcblx0XHRkYi5nZXRBbGxCb3RUZW1wbGF0ZXMoKVxyXG5cdFx0LnRoZW4odGVtcGxhdGVzID0+IHtcclxuXHRcdFx0dGhpcy5ib3RUZW1wbGF0ZXMgPSB7fTtcclxuXHRcdFx0dGVtcGxhdGVzLmZvckVhY2godGVtcGxhdGUgPT4ge1xyXG5cdFx0XHRcdHRoaXMuYm90VGVtcGxhdGVzW3RlbXBsYXRlLl9pZF0gPSB0ZW1wbGF0ZTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KS5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cclxuXHRsb2FkSXRlbVRlbXBsYXRlcygpIHtcclxuXHRcdGRiLmdldEFsbEl0ZW1UZW1wbGF0ZXMoKVxyXG5cdFx0LnRoZW4odGVtcGxhdGVzID0+IHtcclxuXHRcdFx0dGhpcy5pdGVtVGVtcGxhdGVzID0ge307XHJcblx0XHRcdHRlbXBsYXRlcy5mb3JFYWNoKHRlbXBsYXRlID0+IHtcclxuXHRcdFx0XHR0aGlzLml0ZW1UZW1wbGF0ZXNbdGVtcGxhdGUuX2lkXSA9IHRlbXBsYXRlO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pLmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblxyXG5cdHVwZGF0ZShkZWx0YSkge1xyXG5cdFx0bGV0IHBhY2sgPSB7XHJcblx0XHRcdHBsYXllcnM6IFtdLFxyXG5cdFx0XHRib3RzOiBbXSxcclxuXHRcdFx0aXRlbXM6IFtdLFxyXG5cdFx0XHRlZmZlY3RzOiBbXSxcclxuXHRcdFx0dGV4dHM6IFtdLFxyXG5cdFx0XHRtZXNzYWdlczogW10uY29uY2F0KHRoaXMubWVzc2FnZVF1ZXVlKVxyXG5cdFx0fTtcclxuXHRcdHRoaXMubWVzc2FnZVF1ZXVlID0gW107XHJcblxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBsYXllcnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgcGxheWVyID0gdGhpcy5wbGF5ZXJzW2ldO1xyXG5cdFx0XHRpZiAocGxheWVyICE9IG51bGwpIHtcclxuXHRcdFx0XHRwYWNrLnBsYXllcnNbcGxheWVyLmdhbWVJZF0gPSBwbGF5ZXIudXBkYXRlKGRlbHRhKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmJvdHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgYm90ID0gdGhpcy5ib3RzW2ldO1xyXG5cdFx0XHRpZiAoYm90ICE9IG51bGwpIHtcclxuXHRcdFx0XHRwYWNrLmJvdHNbYm90LmdhbWVJZF0gPSBib3QudXBkYXRlKGRlbHRhKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLml0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IGl0ZW0gPSB0aGlzLml0ZW1zW2ldO1xyXG5cdFx0XHRpZiAoaXRlbSAhPSBudWxsKSB7XHJcblx0XHRcdFx0cGFjay5pdGVtc1tpdGVtLmlkXSA9IGl0ZW0udXBkYXRlKGRlbHRhKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmVmZmVjdHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgZWZmZWN0ID0gdGhpcy5lZmZlY3RzW2ldO1xyXG5cdFx0XHRpZiAoZWZmZWN0ICE9IG51bGwpIHtcclxuXHRcdFx0XHRwYWNrLmVmZmVjdHNbZWZmZWN0LmlkXSA9IGVmZmVjdC51cGRhdGUoZGVsdGEpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudGV4dHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgdGV4dCA9IHRoaXMudGV4dHNbaV07XHJcblx0XHRcdGlmICh0ZXh0ICE9IG51bGwpIHtcclxuXHRcdFx0XHRwYWNrLnRleHRzW3RleHQuaWRdID0gdGV4dC51cGRhdGUoZGVsdGEpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHBhY2s7XHJcblx0fVxyXG5cclxuXHQvLyBQbGF5ZXJzXHJcblx0cGxheWVyTG9naW4oc29ja2V0SWQsIGRhdGEpIHtcclxuXHRcdGZvciAobGV0IHBsYXllciBvZiB0aGlzLnBsYXllcnMpIHtcclxuXHRcdFx0aWYgKHBsYXllciAmJiBwbGF5ZXIubmFtZSA9PT0gZGF0YS5uYW1lKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJQbGF5ZXIgaXMgYWxyZWFkeSBzaWduZWQgaW4uXCIpO1xyXG5cdFx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgcGxheWVyID0gbmV3IFBsYXllcihzb2NrZXRJZCwgZGF0YSk7XHJcblx0XHRkYi5sb2coYCR7c29ja2V0SWR9IC0gJHtwbGF5ZXIubmFtZX0gaGFzIGxvZ2dlZCBpbi5gKTtcclxuXHRcdHRoaXMuc2VuZEdhbWVJbmZvR2xvYmFsKGAke3BsYXllci5uYW1lfSBoYXMgbG9nZ2VkIGluLmApO1xyXG5cdFx0cmV0dXJuIHBsYXllcjtcclxuXHR9XHJcblx0cGxheWVyTG9nb3V0KHBsYXllcklkKSB7XHJcblx0XHRsZXQgcGxheWVyID0gdGhpcy5wbGF5ZXJzW3BsYXllcklkXTtcclxuXHRcdGlmIChwbGF5ZXIpIHtcclxuXHRcdFx0Y29uc3QgcGxheWVyRGF0YSA9IHBsYXllci5nZXREQlBhY2soKVxyXG5cdFx0XHRkYi5sb2coYCR7cGxheWVyLnNvY2tldElkfSAtICR7cGxheWVyLm5hbWV9IGhhcyBsb2dnZWQgb3V0LmApO1xyXG5cdFx0XHR0aGlzLnNlbmRHYW1lSW5mb0dsb2JhbChgJHtwbGF5ZXIubmFtZX0gaGFzIGxvZ2dlZCBvdXQuYCk7XHJcblx0XHRcdGRlbGV0ZSB0aGlzLnRleHRzW3BsYXllci5kaXNwbGF5TmFtZUlkXTtcclxuXHRcdFx0ZGVsZXRlIHRoaXMucGxheWVyc1twbGF5ZXJJZF07XHJcblx0XHRcdGRiLnNhdmVQbGF5ZXIocGxheWVyRGF0YSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdGdldEV4cFRvTGV2ZWwobGV2ZWwpIHtcclxuXHRcdGxldCBleHAgPSAxMDtcclxuXHRcdGZvciAobGV0IGkgPSAxOyBpIDwgY29uZmlnLk1BWF9MRVZFTDsgaSsrKSB7XHJcblx0XHRcdGlmIChpID09PSBsZXZlbCkgcmV0dXJuIGV4cDtcclxuXHRcdFx0ZXhwID0gKGV4cCArIChleHAgJSAyKSkgKiAxLjU7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLyBHYW1lIEluZm9cclxuXHRzZW5kR2FtZUluZm9HbG9iYWwobWVzc2FnZSkge1xyXG5cdFx0dGhpcy5tZXNzYWdlUXVldWUucHVzaChuZXcgTWVzc2FnZShudWxsLCBtZXNzYWdlLCAnZ2FtZUluZm8nKSk7XHJcblx0fVxyXG5cdHNlbmRHYW1lSW5mb01hcChtYXBJZCwgbWVzc2FnZSkge1xyXG5cdFx0dGhpcy5tZXNzYWdlUXVldWUucHVzaChuZXcgTWVzc2FnZShudWxsLCBtZXNzYWdlLCAnZ2FtZUluZm8nLCBtYXBJZCkpO1xyXG5cdH1cclxuXHRzZW5kR2FtZUluZm9QbGF5ZXIoaWQsIG1lc3NhZ2UpIHtcclxuXHRcdHRoaXMubWVzc2FnZVF1ZXVlLnB1c2gobmV3IE1lc3NhZ2UobnVsbCwgbWVzc2FnZSwgJ2dhbWVJbmZvJywgbnVsbCwgaWQpKTtcclxuXHR9XHJcblx0XHJcblx0Ly8gQ2hhdCBNZXNzYWdlc1xyXG5cdHNlbmRNZXNzYWdlR2xvYmFsKHNlbmRlcklkLCBtZXNzYWdlKSB7XHJcblx0XHR0aGlzLm1lc3NhZ2VRdWV1ZS5wdXNoKG5ldyBNZXNzYWdlKHNlbmRlcklkLCBtZXNzYWdlLCAnbWVzc2FnZUdsb2JhbCcpKTtcclxuXHR9XHJcblx0c2VuZE1lc3NhZ2VNYXAoc2VuZGVySWQsIG1hcElkLCBtZXNzYWdlKSB7XHJcblx0XHR0aGlzLm1lc3NhZ2VRdWV1ZS5wdXNoKG5ldyBNZXNzYWdlKHNlbmRlcklkLCBtZXNzYWdlLCAnbWVzc2FnZU1hcCcsIG1hcElkKSk7XHJcblx0fVxyXG5cdHNlbmRNZXNzYWdlUGxheWVyKHNlbmRlcklkLCBpZCwgbWVzc2FnZSkge1xyXG5cdFx0dGhpcy5tZXNzYWdlUXVldWUucHVzaChuZXcgTWVzc2FnZShzZW5kZXJJZCwgbWVzc2FnZSwgJ21lc3NhZ2VQbGF5ZXInLCBudWxsLCBpZCkpO1xyXG5cdH1cclxuXHJcblx0Ly8gTWFwXHJcblx0aXNWYWNhbnQobWFwSWQsIHgsIHkpIHtcclxuXHRcdC8vIENoZWNrIGZvciBNYXAgRWRnZXNcclxuXHRcdGlmICh4IDwgMCB8fCB4ID49IGNvbmZpZy5NQVBfQ09MVU1OUykgcmV0dXJuIGZhbHNlO1xyXG5cdFx0aWYgKHkgPCAwIHx8IHkgPj0gY29uZmlnLk1BUF9ST1dTKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcclxuXHRcdC8vIENoZWNrIGZvciBXYWxsIFRpbGVzXHJcblx0XHRsZXQgbWFwID0gdGhpcy5tYXBzW21hcElkXTtcclxuXHRcdGlmIChtYXAuaXNXYWxsW3ldW3hdID09PSB0cnVlKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcclxuXHRcdC8vIENoZWNrIGZvciBCb3RzXHJcblx0XHRsZXQgYm90cyA9IHRoaXMuYm90cy5maWx0ZXIoKGJvdCkgPT4ge1xyXG5cdFx0XHRpZiAoYm90Lm1hcElkID09PSBtYXBJZCAmJiBib3QueCA9PT0geCAmJiBib3QueSA9PT0geSAmJiAhYm90LmlzRGVhZCkgcmV0dXJuIHRydWU7XHJcblx0XHR9KTtcclxuXHRcdGlmIChib3RzLmxlbmd0aCA+IDApIHJldHVybiBmYWxzZTtcclxuXHRcdFxyXG5cdFx0Ly8gQ2hlY2sgZm9yIFBsYXllcnNcclxuXHRcdGxldCBwbGF5ZXJzID0gdGhpcy5wbGF5ZXJzLmZpbHRlcigocGxheWVyKSA9PiB7XHJcblx0XHRcdGlmIChwbGF5ZXIubWFwSWQgPT09IG1hcElkICYmIHBsYXllci54ID09PSB4ICYmIHBsYXllci55ID09PSB5ICYmICFwbGF5ZXIuaXNEZWFkKSByZXR1cm4gdHJ1ZTtcclxuXHRcdH0pO1xyXG5cdFx0aWYgKHBsYXllcnMubGVuZ3RoID4gMCkgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHJcblx0c3Bhd25Cb3QobWFwSWQsIHgsIHksIHRlbXBsYXRlSWQsIGRpcmVjdGlvbiA9ICdkb3duJykge1xyXG5cdFx0dGVtcGxhdGVJZCA9ICc1YzFiZWNkZTI4ZDA1YjA3N2NiYWEzODUnO1xyXG5cdFx0Y29uc3QgdGVtcGxhdGUgPSB0aGlzLmJvdFRlbXBsYXRlc1t0ZW1wbGF0ZUlkXTtcclxuXHRcdGlmICh0ZW1wbGF0ZSkge1xyXG5cdFx0XHRuZXcgQm90KG1hcElkLCB4LCB5LCBkaXJlY3Rpb24sIHRlbXBsYXRlKTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIkJvdCBUZW1wbGF0ZSBkb2VzIG5vdCBleGlzdCB3aXRoIHRoYXQgSWRcIik7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHNwYXduTWFwSXRlbShtYXBJZCwgeCwgeSwgdGVtcGxhdGVJZCwgc3RhY2sgPSAxKSB7XHJcblx0XHR0ZW1wbGF0ZUlkID0gXCI1YzFiZmViN2Q4ZmI2MDEyY2M5NjYwODNcIjtcclxuXHRcdGxldCB0ZW1wbGF0ZSA9IHRoaXMuaXRlbVRlbXBsYXRlc1t0ZW1wbGF0ZUlkXTtcclxuXHRcdGlmICh0ZW1wbGF0ZSkge1xyXG5cdFx0XHRuZXcgSXRlbSh7bWFwSWQsIHgsIHl9LCB0ZW1wbGF0ZSwgc3RhY2spO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiSXRlbSBUZW1wbGF0ZSBkb2VzIG5vdCBleGlzdCB3aXRoIHRoYXQgSWRcIik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzcGF3bkRhbWFnZVRleHQobWFwSWQsIHgsIHksIGRhbWFnZSkge1xyXG5cdFx0bmV3IFRleHQobWFwSWQsIHgsIHkgKyAwLjUsIGRhbWFnZSwgJyNmZjAwMDAnLCAxLjI1LCAwLCAtMSk7XHJcblx0fVxyXG5cclxuXHRzcGF3bkVmZmVjdChtYXBJZCwgeCwgeSwgc3ByaXRlLCBsb29wLCBzcGVlZCwgbWF4RnJhbWUsIHN0YXJ0RnJhbWUpIHtcclxuXHRcdG5ldyBFZmZlY3QobWFwSWQsIHgsIHksIHNwcml0ZSwgbG9vcCwgc3BlZWQsIG1heEZyYW1lLCBzdGFydEZyYW1lKTtcclxuXHR9XHJcbn1cclxuXHJcbmNvbnN0IGdhbWUgPSBuZXcgR2FtZSgpO1xyXG5leHBvcnQgZGVmYXVsdCBnYW1lO1xyXG4iLCIvKioqIEdhbWUgTG9vcCAqKiovXHJcbi8qIEtlZXBzIHRyYWNrIG9mIHRpbWUgYW5kIGNvLW9yZGluYXRlcyB0aGUgZ2FtZSBhbmQgc2VydmVyICovXHJcblxyXG5pbXBvcnQgTm9kZUdhbWVMb29wIGZyb20gJ25vZGUtZ2FtZWxvb3AnO1xyXG5cclxuaW1wb3J0IGRiIGZyb20gJy4vZGIuanMnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuL2dhbWUuanMnO1xyXG5pbXBvcnQgc2VydmVyIGZyb20gJy4vc2VydmVyLmpzJztcclxuaW1wb3J0IGNvbmZpZyBmcm9tICcuL2NvbmZpZy5qcyc7XHJcblxyXG5jbGFzcyBHYW1lTG9vcCB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHR0aGlzLnRpbWVyID0ge1xyXG5cdFx0XHRiYWNrdXA6IDAsXHJcblx0XHRcdG1pbnV0ZTogMFxyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLmlkID0gTm9kZUdhbWVMb29wLnNldEdhbWVMb29wKChkZWx0YSkgPT4gdGhpcy51cGRhdGUoZGVsdGEpLCBjb25maWcuRlJBTUVSQVRFKTtcclxuXHR9XHJcblxyXG5cdHVwZGF0ZShkZWx0YSkge1xyXG5cdFx0Ly8gSW5jcmVhc2UgVGltZXJzXHJcblx0XHR0aGlzLnRpbWVyLmJhY2t1cCArPSBkZWx0YTtcclxuXHRcdHRoaXMudGltZXIubWludXRlICs9IGRlbHRhO1xyXG5cclxuXHRcdC8vIFVwZGF0ZSB0aGUgZ2FtZSBzdGF0ZVxyXG5cdFx0bGV0IHVwZGF0ZVBhY2sgPSBnYW1lLnVwZGF0ZShkZWx0YSk7XHJcblx0XHQvLyBTZW5kIHVwZGF0ZWQgc3RhdGUgdG8gY2xpZW50c1xyXG5cdFx0c2VydmVyLnNlbmRVcGRhdGVQYWNrKHVwZGF0ZVBhY2spO1xyXG5cdFx0XHJcblx0XHQvLyBNaW51dGUgdGltZXIgc2NyaXB0XHJcblx0XHRpZiAodGhpcy50aW1lci5taW51dGUgPj0gNjApIHtcclxuXHRcdFx0dGhpcy50aW1lci5taW51dGUgLT0gNjA7XHJcblx0XHRcdC8vIFRPRE86IHJ1biBtaW51dGUgdGltZXIgc2NyaXB0XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gUGVyaW9kaWMgYmFja3VwIHRvIGRhdGFiYXNlXHJcblx0XHRpZiAodGhpcy50aW1lci5iYWNrdXAgPj0gY29uZmlnLkJBQ0tVUF9USU1FKSB7XHJcblx0XHRcdHRoaXMudGltZXIuYmFja3VwIC09IGNvbmZpZy5CQUNLVVBfVElNRTtcclxuXHRcdFx0ZGIuYmFja3VwKCk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5jb25zdCBnYW1lTG9vcCA9IG5ldyBHYW1lTG9vcCgpO1xyXG5leHBvcnQgZGVmYXVsdCBnYW1lTG9vcDtcclxuIiwiaW1wb3J0IGRiIGZyb20gJy4vZGIuanMnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuL2dhbWUuanMnO1xyXG5pbXBvcnQgc2VydmVyIGZyb20gJy4vc2VydmVyLmpzJztcclxuaW1wb3J0IGdhbWVsb29wIGZyb20gJy4vZ2FtZWxvb3AuanMnO1xyXG4iLCJpbXBvcnQgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xyXG5cclxuY29uc3QgYWNjb3VudFNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoe1xyXG4gIF9pZDogbW9uZ29vc2UuU2NoZW1hVHlwZXMuT2JqZWN0SWQsXHJcbiAgdXNlcm5hbWU6IHt0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlLCB1bmlxdWU6IHRydWV9LFxyXG4gIHBhc3N3b3JkOiB7dHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZX0sXHJcbiAgZW1haWw6IHt0eXBlOiBTdHJpbmcsIHVuaXF1ZTogdHJ1ZSwgc3BhcnNlOiB0cnVlLCBtYXRjaDogL14oKFtePD4oKVxcW1xcXVxcXFwuLDs6XFxzQFwiXSsoXFwuW148PigpXFxbXFxdXFxcXC4sOzpcXHNAXCJdKykqKXwoXCIuK1wiKSlAKChcXFtbMC05XXsxLDN9XFwuWzAtOV17MSwzfVxcLlswLTldezEsM31cXC5bMC05XXsxLDN9XSl8KChbYS16QS1aXFwtMC05XStcXC4pK1thLXpBLVpdezIsfSkpJC99LFxyXG4gIHZlcmlmaWVkOiB7dHlwZTogQm9vbGVhbiwgZGVmYXVsdDogZmFsc2V9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWwoJ0FjY291bnQnLCBhY2NvdW50U2NoZW1hKTtcclxuIiwiaW1wb3J0IG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcclxuXHJcbmNvbnN0IGJvdFRlbXBsYXRlU2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYSh7XHJcbiAgX2lkOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCxcclxuICBuYW1lOiB7dHlwZTogU3RyaW5nLCBkZWZhdWx0OiBcIkJvdFwifSxcclxuICBzcHJpdGU6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDF9LFxyXG4gIGRhbWFnZUJhc2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG4gIGRlZmVuY2VCYXNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuICBoZWFsdGhNYXhCYXNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuICBlbmVyZ3lNYXhCYXNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuICByYW5nZUJhc2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDF9LFxyXG4gIGhvc3RpbGU6IHt0eXBlOiBCb29sZWFuLCBkZWZhdWx0OiB0cnVlfVxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1vbmdvb3NlLm1vZGVsKCdCb3RUZW1wbGF0ZScsIGJvdFRlbXBsYXRlU2NoZW1hKTtcclxuIiwiaW1wb3J0IG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcclxuXHJcbmNvbnN0IGl0ZW1UZW1wbGF0ZVNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoe1xyXG5cdF9pZDogbW9uZ29vc2UuU2NoZW1hVHlwZXMuT2JqZWN0SWQsXHJcblx0bmFtZToge3R5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWV9LFxyXG5cdHNwcml0ZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMX0sXHJcblx0dHlwZToge3R5cGU6IG1vbmdvb3NlLlNjaGVtYVR5cGVzLk9iamVjdElkLCByZWY6ICdJdGVtVHlwZScsIHJlcXVpcmVkOiB0cnVlfSxcclxuXHRwYXNzaXZlRGFtYWdlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuXHRwYXNzaXZlRGVmZW5jZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcblx0cGFzc2l2ZUhlYWx0aE1heDoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcblx0cGFzc2l2ZUVuZXJneU1heDoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcblx0cGFzc2l2ZVJhbmdlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuXHRlcXVpcHBlZERhbWFnZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcblx0ZXF1aXBwZWREZWZlbmNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuXHRlcXVpcHBlZEhlYWx0aE1heDoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcblx0ZXF1aXBwZWRFbmVyZ3lNYXg6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG5cdGVxdWlwcGVkUmFuZ2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWwoJ0l0ZW1UZW1wbGF0ZScsIGl0ZW1UZW1wbGF0ZVNjaGVtYSk7XHJcbiIsImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XHJcblxyXG5jb25zdCBpdGVtVHlwZVNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoe1xyXG5cdF9pZDogbW9uZ29vc2UuU2NoZW1hVHlwZXMuT2JqZWN0SWQsXHJcblx0bmFtZToge3R5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWV9LFxyXG5cdGVxdWlwcGVkU2xvdDoge3R5cGU6IE51bWJlciwgcmVxdWlyZWQ6IHRydWV9LFxyXG5cdHN0YWNrYWJsZToge3R5cGU6IEJvb2xlYW4sIHJlcXVpcmVkOiB0cnVlfVxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1vbmdvb3NlLm1vZGVsKCdJdGVtVHlwZScsIGl0ZW1UeXBlU2NoZW1hKTtcclxuIiwiaW1wb3J0IG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcclxuXHJcbmNvbnN0IG1hcFNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoe1xyXG5cdF9pZDogbW9uZ29vc2UuU2NoZW1hVHlwZXMuT2JqZWN0SWQsXHJcblx0bWFwSWQ6IE51bWJlcixcclxuXHRuYW1lOiB7dHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZX0sXHJcblx0ZHJvcENoYW5jZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMTAwfSxcclxuXHRkcm9wQW1vdW50RVE6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDF9LFxyXG5cdHRpbGVzOiB7dHlwZTogW1tbTnVtYmVyXV1dLCBkZWZhdWx0OiBbW1tdXV19LFxyXG5cdGlzV2FsbDoge3R5cGU6IFtbQm9vbGVhbl1dLCBkZWZhdWx0OiBmYWxzZX0sXHJcblx0aXNIb3N0aWxlOiB7dHlwZTogW1tCb29sZWFuXV0sIGRlZmF1bHQ6IGZhbHNlfSxcclxuXHRkYW1hZ2U6IHt0eXBlOiBbW051bWJlcl1dLCBkZWZhdWx0OiBudWxsfSxcclxuXHR3YXJwTWFwOiB7dHlwZTogW1tOdW1iZXJdXSwgZGVmYXVsdDogbnVsbH0sXHJcblx0d2FycFg6IHt0eXBlOiBbW051bWJlcl1dLCBkZWZhdWx0OiBudWxsfSxcclxuXHR3YXJwWToge3R5cGU6IFtbTnVtYmVyXV0sIGRlZmF1bHQ6IG51bGx9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWwoJ01hcCcsIG1hcFNjaGVtYSk7XHJcbiIsImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XHJcblxyXG5jb25zdCBwbGF5ZXJTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcclxuICBfaWQ6IG1vbmdvb3NlLlNjaGVtYVR5cGVzLk9iamVjdElkLFxyXG4gIGFjY291bnQ6IHt0eXBlOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCwgcmVmOiAnQWNjb3VudCcsIHJlcXVpcmVkOiB0cnVlfSxcclxuICBuYW1lOiB7dHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSwgdW5pcXVlOiB0cnVlfSxcclxuICB0ZW1wbGF0ZToge3R5cGU6IG1vbmdvb3NlLlNjaGVtYVR5cGVzLk9iamVjdElkLCByZWY6ICdQbGF5ZXJUZW1wbGF0ZScsIHJlcXVpcmVkOiB0cnVlfSxcclxuICBsZXZlbDoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMX0sXHJcbiAgZXhwZXJpZW5jZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcbiAgbWFwSWQ6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDF9LFxyXG4gIHg6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDV9LFxyXG4gIHk6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDV9LFxyXG4gIGRpcmVjdGlvbjoge3R5cGU6IFN0cmluZywgZGVmYXVsdDogJ2Rvd24nfSxcclxuICBhZG1pbkFjY2Vzczoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcbiAgc3ByaXRlOiBOdW1iZXJcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBtb25nb29zZS5tb2RlbCgnUGxheWVyJywgcGxheWVyU2NoZW1hKTtcclxuIiwiaW1wb3J0IG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcclxuXHJcbmNvbnN0IHBsYXllclRlbXBsYXRlU2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYSh7XHJcbiAgX2lkOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCxcclxuICBuYW1lOiB7dHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSwgdW5pcXVlOiB0cnVlfSxcclxuICBzcHJpdGU6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDF9LFxyXG4gIGRhbWFnZUJhc2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG4gIGRlZmVuY2VCYXNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuICBoZWFsdGhNYXhCYXNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuICBlbmVyZ3lNYXhCYXNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuICByYW5nZUJhc2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDF9LFxyXG4gIGhlYWx0aFBlckxldmVsOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuICBlbmVyZ3lQZXJMZXZlbDoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH1cclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBtb25nb29zZS5tb2RlbCgnUGxheWVyVGVtcGxhdGUnLCBwbGF5ZXJUZW1wbGF0ZVNjaGVtYSk7XHJcbiIsImltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xyXG5pbXBvcnQgaHR0cCBmcm9tICdodHRwJztcclxuaW1wb3J0IHNvY2tldElPIGZyb20gJ3NvY2tldC5pbyc7XHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xyXG5cclxuaW1wb3J0IGRiIGZyb20gJy4vZGIuanMnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuL2dhbWUuanMnO1xyXG5pbXBvcnQgY29uZmlnIGZyb20gJy4vY29uZmlnLmpzJztcclxuXHJcbmNsYXNzIFNlcnZlciB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHRjb25zdCBhcHAgPSBleHByZXNzKCk7XHJcblx0XHRjb25zdCBodHRwU2VydmVyID0gaHR0cC5TZXJ2ZXIoYXBwKTtcclxuXHRcdGNvbnN0IGlvID0gc29ja2V0SU8oaHR0cFNlcnZlcik7XHJcblx0XHRjb25zdCBwb3J0ID0gcHJvY2Vzcy5lbnYuUE9SVCB8fCBjb25maWcuUE9SVDtcclxuXHRcdGNvbnN0IHB1YmxpY1BhdGggPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4vY2xpZW50Jyk7XHJcblx0XHRcclxuXHRcdGFwcC5nZXQoJy8nLCAocmVxLCByZXMpID0+IHJlcy5zZW5kRmlsZShwdWJsaWNQYXRoICsgJy9pbmRleC5odG1sJykpO1xyXG5cdFx0YXBwLnVzZSgnL2NsaWVudCcsIGV4cHJlc3Muc3RhdGljKHB1YmxpY1BhdGgpKTtcclxuXHRcdGh0dHBTZXJ2ZXIubGlzdGVuKHBvcnQsICgpID0+IGRiLmxvZyhgU2VydmVyIHN0YXJ0ZWQuIExpc3RlbmluZyBvbiBwb3J0ICR7aHR0cFNlcnZlci5hZGRyZXNzKCkucG9ydH0uLi5gKSk7XHJcblxyXG5cdFx0dGhpcy5zb2NrZXRMaXN0ID0ge307XHJcblx0XHR0aGlzLmFjdGl2ZUFjY291bnRzID0ge307XHJcblxyXG5cdFx0aW8uc29ja2V0cy5vbignY29ubmVjdGlvbicsIHNvY2tldCA9PiB0aGlzLm9uQ29ubmVjdChzb2NrZXQpKTtcclxuXHR9XHJcblxyXG5cdC8qIGNvbm5lY3QgPT4gc2lnbmluID0+IHNlbGVjdHBsYXllclxyXG5cdCoqIGNvbm5lY3Qgd2hlbiBwYWdlIGxvYWRzIC0gc2hvd3Mgc2lnbmluIHBhZ2VcclxuXHQqKiBzaWduaW4gd2hlbiB1c2VybmFtZSBhbmQgcGFzc3dvcmQgaXMgc3VibWl0dGVkXHJcbiBcdCoqIHNlbGVjdHBsYXllciB3aGVuIGNoYXJhY3RlciBpcyBjaG9zZW4gLSBsb2dzIGludG8gdGhlIGdhbWVcclxuXHQqL1xyXG5cclxuXHQvLyBSZWNlaXZlIGRhdGEgZnJvbSBjbGllbnRzXHJcblx0b25Db25uZWN0KHNvY2tldCkge1xyXG5cdFx0dGhpcy5zb2NrZXRMaXN0W3NvY2tldC5pZF0gPSBzb2NrZXQ7XHJcblx0XHRkYi5sb2coYCR7c29ja2V0LmlkfSAtIFNvY2tldCBjb25uZWN0ZWQuYCk7XHJcblx0XHRcclxuXHRcdHNvY2tldC5vbignZGlzY29ubmVjdCcsICgpID0+IHRoaXMub25EaXNjb25uZWN0KHNvY2tldCkpO1xyXG5cdFx0c29ja2V0Lm9uKCdzaWdudXAnLCAoZGF0YSkgPT4gdGhpcy5vblNpZ25VcChkYXRhLnVzZXJuYW1lLCBkYXRhLnBhc3N3b3JkLCBkYXRhLmVtYWlsKSk7XHJcblx0XHRzb2NrZXQub24oJ3NpZ25pbicsIChkYXRhKSA9PiB0aGlzLm9uU2lnbkluKHNvY2tldCwgZGF0YS51c2VybmFtZSwgZGF0YS5wYXNzd29yZCkpO1xyXG5cdFx0c29ja2V0Lm9uKCdzaWdub3V0JywgKCkgPT4gdGhpcy5vblNpZ25PdXQoc29ja2V0KSk7XHJcblx0XHQvLyBUZWxsIGNsaWVudCB0aGV5IGhhdmUgY29ubmVjdGVkXHJcblx0fVxyXG5cclxuXHRhc3luYyBvbkRpc2Nvbm5lY3Qoc29ja2V0KSB7XHJcblx0XHRpZiAoc29ja2V0LnBsYXllcklkICE9IG51bGwgJiYgZ2FtZS5wbGF5ZXJzW3NvY2tldC5wbGF5ZXJJZF0pIGF3YWl0IHRoaXMub25Mb2dPdXQoc29ja2V0KTtcclxuXHRcdGlmIChzb2NrZXQuYWNjb3VudElkICYmIHRoaXMuYWN0aXZlQWNjb3VudHNbc29ja2V0LmFjY291bnRJZF0pIGF3YWl0IHRoaXMub25TaWduT3V0KHNvY2tldCk7XHJcblxyXG5cdFx0ZGIubG9nKGAke3NvY2tldC5pZH0gLSBTb2NrZXQgZGlzY29ubmVjdGVkLmApO1xyXG5cdFx0ZGVsZXRlIHRoaXMuc29ja2V0TGlzdFtzb2NrZXQuaWRdO1xyXG5cdH1cclxuXHJcblx0YXN5bmMgb25TaWduVXAodXNlcm5hbWUsIHBhc3N3b3JkLCBlbWFpbCkge1xyXG5cdFx0bGV0IHN1Y2Nlc3MgPSBhd2FpdCBkYi5hZGRBY2NvdW50KHVzZXJuYW1lLCBwYXNzd29yZCwgZW1haWwpO1xyXG5cdFx0aWYgKHN1Y2Nlc3MpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJUZWxsIGNsaWVudCBzaWdudXAgd2FzIHN1Y2Nlc3NmdWxcIik7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJUZWxsIGNsaWVudCBzaWdudXAgd2FzIG5vdCBzdWNjZXNzZnVsXCIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0YXN5bmMgb25TaWduSW4oc29ja2V0LCB1c2VybmFtZSwgcGFzc3dvcmQpIHtcclxuXHRcdGxldCBzdWNjZXNzID0gYXdhaXQgZGIuYXV0aEFjY291bnQodXNlcm5hbWUsIHBhc3N3b3JkKTtcclxuXHRcdGlmICghc3VjY2Vzcykge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhgU2lnbiBpbiBmYWlsZWQgb24gdXNlcm5hbWUgJHt1c2VybmFtZX1gKTtcclxuXHRcdFx0Ly8gVGVsbCBjbGllbnQgc2lnbmluIHdhcyBub3Qgc3VjY2Vzc2Z1bFxyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGFjY291bnRJZCA9IGF3YWl0IGRiLmdldEFjY291bnRJZCh1c2VybmFtZSk7XHJcblx0XHRpZiAodGhpcy5hY3RpdmVBY2NvdW50c1thY2NvdW50SWRdKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiVGhhdCBhY2NvdW50IGlzIGFscmVhZHkgc2lnbmVkIGluLlwiKTtcclxuXHRcdFx0Ly8gVGVsbCBjbGllbnQgdGhhdCBhY2NvdW50IGlzIGFscmVhZHkgc2lnbmVkIGluXHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0c29ja2V0LmFjY291bnRJZCA9IGFjY291bnRJZDtcclxuXHRcdHRoaXMuYWN0aXZlQWNjb3VudHNbYWNjb3VudElkXSA9IHVzZXJuYW1lO1xyXG5cclxuXHRcdHNvY2tldC5vbignYWRkUGxheWVyJywgKGRhdGEpID0+IHRoaXMub25BZGRQbGF5ZXIoc29ja2V0LCBkYXRhLm5hbWUsIGRhdGEudGVtcGxhdGVOYW1lKSk7XHJcblx0XHRzb2NrZXQub24oJ2xvZ2luJywgKG5hbWUpID0+IHRoaXMub25Mb2dJbihzb2NrZXQsIG5hbWUpKTtcclxuXHRcdHNvY2tldC5vbignbG9nb3V0JywgKCkgPT4gdGhpcy5vbkxvZ091dChzb2NrZXQpKTtcclxuXHRcdHNvY2tldC5vbignYWRkUGxheWVyVGVtcGxhdGUnLCAoZGF0YSkgPT4gdGhpcy5vbkFkZFBsYXllclRlbXBsYXRlKGRhdGEpKTtcclxuXHJcblx0XHRkYi5sb2coYCR7c29ja2V0LmlkfSAtICR7dXNlcm5hbWV9IHNpZ25lZCBpbi5gKTtcclxuXHRcdHRoaXMuc2VuZFNpZ25lZEluKHNvY2tldCk7XHJcblx0fVxyXG5cdFxyXG5cdGFzeW5jIG9uU2lnbk91dChzb2NrZXQpIHtcclxuXHRcdGlmIChzb2NrZXQucGxheWVySWQgIT0gbnVsbCkgYXdhaXQgdGhpcy5vbkxvZ091dChzb2NrZXQpO1xyXG5cdFx0XHJcblx0XHRpZiAoc29ja2V0LmFjY291bnRJZCkge1xyXG5cdFx0XHRjb25zdCB1c2VybmFtZSA9IHRoaXMuYWN0aXZlQWNjb3VudHNbc29ja2V0LmFjY291bnRJZF07XHJcblx0XHRcdGRiLmxvZyhgJHtzb2NrZXQuaWR9IC0gJHt1c2VybmFtZX0gc2lnbmVkIG91dC5gKTtcclxuXHRcdFx0ZGVsZXRlIHRoaXMuYWN0aXZlQWNjb3VudHNbc29ja2V0LmFjY291bnRJZF07XHJcblx0XHRcdHNvY2tldC5hY2NvdW50SWQgPSBudWxsO1xyXG5cdFx0XHR0aGlzLnNlbmRTaWduZWRPdXQoc29ja2V0KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGFzeW5jIG9uQWRkUGxheWVyKHNvY2tldCwgbmFtZSwgdGVtcGxhdGVJZCkge1xyXG5cdFx0bGV0IHN1Y2Nlc3MgPSBhd2FpdCBkYi5hZGRQbGF5ZXIoc29ja2V0LmFjY291bnRJZCwgbmFtZSwgdGVtcGxhdGVJZCk7XHJcblx0XHRpZiAoc3VjY2Vzcykge1xyXG5cdFx0XHRjb25zdCB1c2VybmFtZSA9IHRoaXMuYWN0aXZlQWNjb3VudHNbc29ja2V0LmFjY291bnRJZF07XHJcblx0XHRcdGRiLmxvZyhgJHtzb2NrZXQuaWR9IC0gJHtuYW1lfSBoYXMgYmVlbiBhZGRlZCBhcyBhIHBsYXllciB0byBhY2NvdW50ICR7dXNlcm5hbWV9LmApO1xyXG5cdFx0XHQvLyBUZWxsIGNsaWVudCBhZGQgcGxheWVyIHdhcyBzdWNjZXNzZnVsXHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Ly8gVGVsbCBjbGllbnQgYWRkIHBsYXllciB3YXMgbm90IHN1Y2Nlc3NmdWxcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0YXN5bmMgb25BZGRQbGF5ZXJUZW1wbGF0ZShkYXRhKSB7XHJcblx0XHRsZXQgc3VjY2VzcyA9IGF3YWl0IGRiLmFkZFBsYXllclRlbXBsYXRlKGRhdGEpO1xyXG5cdFx0aWYgKHN1Y2Nlc3MpIHtcclxuXHRcdFx0Z2FtZS5sb2FkUGxheWVyVGVtcGxhdGVzKCk7XHJcblx0XHRcdGRiLmxvZyhgJHtzb2NrZXQuaWR9IC0gJHtkYXRhLm5hbWV9IGhhcyBiZWVuIGFkZGVkIGFzIGEgcGxheWVyIHRlbXBsYXRlLmApO1xyXG5cdFx0XHQvLyBUZWxsIGNsaWVudCBhZGQgcGxheWVyIHdhcyBzdWNjZXNzZnVsXHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Ly8gVGVsbCBjbGllbnQgYWRkIHBsYXllciB3YXMgbm90IHN1Y2Nlc3NmdWxcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGFzeW5jIG9uTG9nSW4oc29ja2V0LCBuYW1lKSB7XHJcblx0XHRpZiAoIXNvY2tldC5hY2NvdW50SWQpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJOb3Qgc2lnbmVkIGludG8gYWNjb3VudC5cIik7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdGlmIChzb2NrZXQucGxheWVySWQgIT0gbnVsbCkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIkFscmVhZHkgbG9nZ2VkIGluLlwiKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBwbGF5ZXJEYXRhID0gYXdhaXQgZGIuZ2V0UGxheWVyKG5hbWUpO1xyXG5cdFx0aWYgKCFwbGF5ZXJEYXRhKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiTm8gcGxheWVyIHdpdGggdGhhdCBuYW1lLlwiKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChcIlwiK3NvY2tldC5hY2NvdW50SWQgIT09IFwiXCIrcGxheWVyRGF0YS5hY2NvdW50KSB7XHQvLyBDYXN0IHRvIHN0cmluZyBiZWZvcmUgY29tcGFyaXNvblxyXG5cdFx0XHRkYi5sb2coYEF0dGVtcHQgdG8gbG9naW4gdG8gcGxheWVyICgke3BsYXllckRhdGEubmFtZX0pIGZyb20gd3JvbmcgYWNjb3VudCAoJHtzb2NrZXQuYWNjb3VudElkfSkgb24gc29ja2V0ICR7c29ja2V0LmlkfS5gKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHBsYXllciA9IGdhbWUucGxheWVyTG9naW4oc29ja2V0LmlkLCBwbGF5ZXJEYXRhKTtcclxuXHRcdGlmICghcGxheWVyKSByZXR1cm47XHJcblx0XHJcblx0XHRzb2NrZXQucGxheWVySWQgPSBwbGF5ZXIuZ2FtZUlkO1xyXG5cdFx0c29ja2V0Lm9uKCdpbnB1dCcsIChkYXRhKSA9PiB0aGlzLm9uSW5wdXQocGxheWVyLCBkYXRhKSk7XHJcblx0XHR0aGlzLnNlbmRNYXBEYXRhKHNvY2tldCwgcGxheWVyLm1hcElkKTtcclxuXHR9XHJcblx0XHJcblx0YXN5bmMgb25Mb2dPdXQoc29ja2V0KSB7XHJcblx0XHRpZiAoc29ja2V0LnBsYXllcklkICE9IG51bGwpIHtcclxuXHRcdFx0YXdhaXQgZ2FtZS5wbGF5ZXJMb2dvdXQoc29ja2V0LnBsYXllcklkKTtcclxuXHRcdFx0c29ja2V0LnBsYXllcklkID0gbnVsbDtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGFzeW5jIG9uSW5wdXQocGxheWVyLCBkYXRhKSB7XHJcblx0XHRzd2l0Y2ggKGRhdGEuaW5wdXQpIHtcclxuXHRcdFx0Y2FzZSBudWxsOlxyXG5cdFx0XHRjYXNlICdtb3ZlJzogcGxheWVyLmlucHV0LmRpcmVjdGlvbiA9IGRhdGEuZGlyZWN0aW9uO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAncnVuJzogcGxheWVyLmlucHV0LnJ1biA9IGRhdGEuc3RhdGU7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdwaWNrdXAnOlxyXG5cdFx0XHRcdGlmICghcGxheWVyLmlucHV0LnBpY2t1cCAmJiBkYXRhLnN0YXRlKSB7XHJcblx0XHRcdFx0XHRwbGF5ZXIucGlja1VwKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHBsYXllci5pbnB1dC5waWNrdXAgPSBkYXRhLnN0YXRlO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnYXR0YWNrJzpcclxuXHRcdFx0cGxheWVyLmlucHV0LmF0dGFjayA9IGRhdGEuc3RhdGU7XHJcblx0XHRcdFx0aWYgKCFwbGF5ZXIuaXNEZWFkKSBwbGF5ZXIuYXR0YWNrKDEsIHBsYXllci5kaXJlY3Rpb24pO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnZG91YmxlQ2xpY2tJdGVtJzpcclxuXHRcdFx0XHRpZiAocGxheWVyLmludmVudG9yeVtkYXRhLnNsb3RdKSB7XHJcblx0XHRcdFx0XHRpZiAoIXBsYXllci5pc0RlYWQpIHBsYXllci51c2VJdGVtKGRhdGEuc2xvdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAncmlnaHRDbGlja0l0ZW0nOlxyXG5cdFx0XHRcdGlmIChwbGF5ZXIuaW52ZW50b3J5W2RhdGEuc2xvdF0pIHtcclxuXHRcdFx0XHRcdGlmICghcGxheWVyLmlzRGVhZCkgcGxheWVyLmRyb3BJdGVtKGRhdGEuc2xvdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnZHJhZ1N0b3BHYW1lJzpcclxuXHRcdFx0XHRpZiAocGxheWVyLmludmVudG9yeVtkYXRhLnNsb3RdKSB7XHJcblx0XHRcdFx0XHRpZiAoIXBsYXllci5pc0RlYWQpIHBsYXllci5kcm9wSXRlbShkYXRhLnNsb3QpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ2RyYWdTdG9wSW52ZW50b3J5JzpcclxuXHRcdFx0Y2FzZSAnZHJhZ1N0b3BFcXVpcG1lbnQnOlxyXG5cdFx0XHRcdGlmIChwbGF5ZXIuaW52ZW50b3J5W2RhdGEuc2xvdF0pIHtcclxuXHRcdFx0XHRcdGlmICghcGxheWVyLmlzRGVhZCkgcGxheWVyLm1vdmVJdGVtVG9TbG90KGRhdGEuc2xvdCwgZGF0YS5uZXdTbG90KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdzZXJ2ZXJDaGF0JzogZ2FtZS5zZW5kTWVzc2FnZUdsb2JhbChwbGF5ZXIuZ2FtZUlkLCBgJHtwbGF5ZXIubmFtZX0geWVsbHMsIFwiJHtkYXRhLm1lc3NhZ2V9XCJgKTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ21hcENoYXQnOiBnYW1lLnNlbmRNZXNzYWdlTWFwKHBsYXllci5nYW1lSWQsIHBsYXllci5tYXBJZCwgYCR7cGxheWVyLm5hbWV9IHNheXMsIFwiJHtkYXRhLm1lc3NhZ2V9XCJgKTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ3BsYXllckNoYXQnOlxyXG5cdFx0XHRcdGxldCB0YXJnZXQgPSBnYW1lLnBsYXllcnNbZGF0YS50YXJnZXRJZF07XHJcblx0XHRcdFx0aWYgKHRhcmdldCkge1xyXG5cdFx0XHRcdFx0Z2FtZS5zZW5kTWVzc2FnZVBsYXllcihwbGF5ZXIuZ2FtZUlkLCB0YXJnZXQuZ2FtZUlkLCBgJHtwbGF5ZXIubmFtZX0gd2hpc3BlcnMsIFwiJHtkYXRhLm1lc3NhZ2V9XCJgKTtcclxuXHRcdFx0XHRcdGdhbWUuc2VuZE1lc3NhZ2VQbGF5ZXIocGxheWVyLmdhbWVJZCwgcGxheWVyLmdhbWVJZCwgYFlvdSB3aGlzcGVyIHRvICR7dGFyZ2V0Lm5hbWV9LCBcIiR7ZGF0YS5tZXNzYWdlfVwiYCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHJcblx0XHRcdC8vIEdvZCBJbnB1dHNcclxuXHRcdFx0Y2FzZSAnc3Bhd25NYXBJdGVtJzpcclxuXHRcdFx0XHRpZiAocGxheWVyLmFkbWluQWNjZXNzID49IDIpIHtcclxuXHRcdFx0XHRcdGdhbWUuc3Bhd25NYXBJdGVtKGRhdGEuYXJnc1swXSwgZGF0YS5hcmdzWzFdLCBkYXRhLmFyZ3NbMl0sIGRhdGEuYXJnc1szXSwgZGF0YS5hcmdzWzRdKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRnYW1lLnNlbmRHYW1lSW5mb1BsYXllcihwbGF5ZXIuZ2FtZUlkLCBgWW91IGRvbid0IGhhdmUgYWNjZXNzIHRvIHRoYXQgY29tbWFuZC5gKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdzcGF3bkJvdCc6XHJcblx0XHRcdFx0aWYgKHBsYXllci5hZG1pbkFjY2VzcyA+PSAyKSB7XHJcblx0XHRcdFx0XHRnYW1lLnNwYXduQm90KGRhdGEuYXJnc1swXSwgZGF0YS5hcmdzWzFdLCBkYXRhLmFyZ3NbMl0sIGRhdGEuYXJnc1szXSwgZGF0YS5hcmdzWzRdKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRnYW1lLnNlbmRHYW1lSW5mb1BsYXllcihwbGF5ZXIuZ2FtZUlkLCBgWW91IGRvbid0IGhhdmUgYWNjZXNzIHRvIHRoYXQgY29tbWFuZC5gKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdGNhc2UgJ3NldFNwcml0ZSc6XHJcblx0XHRcdFx0aWYgKHBsYXllci5hZG1pbkFjY2VzcyA+PSAyKSB7XHJcblx0XHRcdFx0XHRwbGF5ZXIuc3ByaXRlID0gZGF0YS5hcmdzWzBdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdGdhbWUuc2VuZEdhbWVJbmZvUGxheWVyKHBsYXllci5nYW1lSWQsIGBZb3UgZG9uJ3QgaGF2ZSBhY2Nlc3MgdG8gdGhhdCBjb21tYW5kLmApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ3VwbG9hZE1hcCc6XHJcblx0XHRcdFx0aWYgKHBsYXllci5hZG1pbkFjY2VzcyA8IDIpIHtcclxuXHRcdFx0XHRcdGdhbWUuc2VuZEdhbWVJbmZvUGxheWVyKHBsYXllci5nYW1lSWQsIGBZb3UgZG9uJ3QgaGF2ZSBhY2Nlc3MgdG8gdGhhdCBjb21tYW5kLmApO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0bGV0IHN1Y2Nlc3MgPSBhd2FpdCBkYi5zYXZlTWFwKGRhdGEpO1xyXG5cdFx0XHRcdGlmICghc3VjY2Vzcykge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJGYWlsZWQgdG8gdXBsb2FkIG1hcC5cIik7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRnYW1lLnBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XHJcblx0XHRcdFx0XHRpZiAocGxheWVyLm1hcElkID09PSBkYXRhLm1hcElkKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuc2VuZE1hcERhdGEodGhpcy5zb2NrZXRMaXN0W3BsYXllci5zb2NrZXRJZF0sIHBsYXllci5tYXBJZCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gU2VuZCBkYXRhIHRvIGNsaWVudHNcclxuXHRzZW5kVXBkYXRlUGFjayh1cGRhdGVQYWNrKSB7XHJcblx0XHRnYW1lLnBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XHJcblx0XHRcdGNvbnN0IHBhY2sgPSB7XHJcblx0XHRcdFx0Z2FtZToge1xyXG5cdFx0XHRcdFx0cGxheWVyczogW11cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHVpOiBwbGF5ZXIuZ2V0VUlQYWNrKClcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdGZvciAobGV0IHBsYXllckRhdGEgb2YgdXBkYXRlUGFjay5wbGF5ZXJzKSB7XHJcblx0XHRcdFx0aWYgKHBsYXllckRhdGEgJiYgKHBsYXllckRhdGEubWFwSWQgPT09IHBsYXllci5tYXBJZCAmJiAocGxheWVyRGF0YS5pc1Zpc2libGUgfHwgcGxheWVyRGF0YS5zb2NrZXRJZCA9PT0gcGxheWVyLnNvY2tldElkKSkpIHtcclxuXHRcdFx0XHRcdHBhY2suZ2FtZS5wbGF5ZXJzW3BsYXllckRhdGEuZ2FtZUlkXSA9IHBsYXllckRhdGE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdC8vIHBhY2suZ2FtZS5wbGF5ZXJzID0gdXBkYXRlUGFjay5wbGF5ZXJzLmZpbHRlcigocGxheWVyRGF0YSkgPT4ge1xyXG5cdFx0XHQvLyBcdHJldHVybiAocGxheWVyRGF0YS5tYXBJZCA9PT0gcGxheWVyLm1hcElkICYmIChwbGF5ZXJEYXRhLmlzVmlzaWJsZSB8fCBwbGF5ZXJEYXRhLnNvY2tldElkID09PSBwbGF5ZXIuc29ja2V0SWQpKTtcclxuXHRcdFx0Ly8gfSk7XHJcblx0XHRcdHBhY2suZ2FtZS5ib3RzID0gdXBkYXRlUGFjay5ib3RzLmZpbHRlcihib3QgPT4ge1xyXG5cdFx0XHRcdHJldHVybiBib3QubWFwSWQgPT09IHBsYXllci5tYXBJZDtcclxuXHRcdFx0fSk7XHJcblx0XHRcdHBhY2suZ2FtZS5pdGVtcyA9IHVwZGF0ZVBhY2suaXRlbXMuZmlsdGVyKGl0ZW0gPT4ge1xyXG5cdFx0XHRcdHJldHVybiBpdGVtLm1hcElkID09PSBwbGF5ZXIubWFwSWQ7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRwYWNrLmdhbWUuZWZmZWN0cyA9IHVwZGF0ZVBhY2suZWZmZWN0cy5maWx0ZXIoZWZmZWN0ID0+IHtcclxuXHRcdFx0XHRyZXR1cm4gZWZmZWN0Lm1hcElkID09PSBwbGF5ZXIubWFwSWQ7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRwYWNrLmdhbWUudGV4dHMgPSB1cGRhdGVQYWNrLnRleHRzLmZpbHRlcih0ZXh0ID0+IHtcclxuXHRcdFx0XHRyZXR1cm4gdGV4dC5tYXBJZCA9PT0gcGxheWVyLm1hcElkO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHBhY2sudWkubWVzc2FnZXMgPSB1cGRhdGVQYWNrLm1lc3NhZ2VzLmZpbHRlcigobWVzc2FnZSkgPT4ge1xyXG5cdFx0XHRcdHJldHVybiAoKG1lc3NhZ2UubWFwSWQgPT0gbnVsbCAmJiBtZXNzYWdlLmlkID09IG51bGwpIHx8IHBsYXllci5tYXBJZCA9PT0gbWVzc2FnZS5tYXBJZCB8fCBwbGF5ZXIuZ2FtZUlkID09PSBtZXNzYWdlLmlkKTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdFxyXG5cdFx0XHR0aGlzLnNvY2tldExpc3RbcGxheWVyLnNvY2tldElkXS5lbWl0KCd1cGRhdGUnLCBwYWNrKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRcclxuXHRzZW5kTWFwRGF0YShzb2NrZXQsIG1hcElkKSB7XHJcblx0XHRjb25zdCBtYXBEYXRhID0gZ2FtZS5tYXBzW21hcElkXS5nZXRQYWNrKCk7XHJcblx0XHRzb2NrZXQuZW1pdCgnbG9hZE1hcCcsIG1hcERhdGEpO1xyXG5cdH1cclxuXHJcblx0YXN5bmMgc2VuZFNpZ25lZEluKHNvY2tldCkge1xyXG5cdFx0bGV0IGFjY291bnQgPSBhd2FpdCBkYi5nZXRBY2NvdW50KHNvY2tldC5hY2NvdW50SWQpO1xyXG5cdFx0c29ja2V0LmVtaXQoJ3NpZ25lZEluJywge1xyXG5cdFx0XHRlbWFpbDogYWNjb3VudC5lbWFpbCxcclxuXHRcdFx0dmVyaWZpZWQ6IGFjY291bnQudmVyaWZpZWQsXHJcblx0XHRcdC8vZGF0ZUNyZWF0ZWQ6IGFjY291bnQuZGF0ZUNyZWF0ZWRcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0c2VuZFNpZ25lZE91dChzb2NrZXQpIHtcclxuXHRcdHNvY2tldC5lbWl0KCdzaWduZWRPdXQnKTtcclxuXHR9XHJcbn1cclxuXHJcbmNvbnN0IHNlcnZlciA9IG5ldyBTZXJ2ZXIoKTtcclxuZXhwb3J0IGRlZmF1bHQgc2VydmVyO1xyXG4iLCJmdW5jdGlvbiBjcmVhdGUyZEFycmF5KGNvbHVtbnMsIHJvd3MsIGRlZmF1bHRWYWx1ZSkge1xyXG4gIGNvbnN0IGFycmF5ID0gW107XHJcbiAgZm9yIChsZXQgeSA9IDA7IHkgPCByb3dzOyB5KyspIHtcclxuICAgIGFycmF5W3ldID0gW107XHJcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IGNvbHVtbnM7IHgrKykge1xyXG4gICAgICBhcnJheVt5XVt4XSA9IGRlZmF1bHRWYWx1ZTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGFycmF5O1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGUzZEFycmF5KGNvbHVtbnMsIHJvd3MsIGxheWVycywgZGVmYXVsdFZhbHVlKSB7XHJcbiAgY29uc3QgYXJyYXkgPSBbXTtcclxuICBmb3IgKGxldCB6ID0gMDsgeiA8IGxheWVyczsgeisrKSB7XHJcbiAgICBhcnJheVt6XSA9IFtdOyBcclxuICAgIGZvciAobGV0IHkgPSAwOyB5IDwgcm93czsgeSsrKSB7XHJcbiAgICAgIGFycmF5W3pdW3ldID0gW107XHJcbiAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgY29sdW1uczsgeCsrKSB7XHJcbiAgICAgICAgYXJyYXlbel1beV1beF0gPSBkZWZhdWx0VmFsdWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGFycmF5O1xyXG59XHJcblxyXG5mdW5jdGlvbiBzaHVmZmxlKGFycmF5KSB7XHJcbiAgbGV0IGN1cnJlbnRJbmRleCA9IGFycmF5Lmxlbmd0aDtcclxuICBsZXQgdGVtcDtcclxuICBsZXQgcmFuZG9tSW5kZXg7XHJcbiAgd2hpbGUgKGN1cnJlbnRJbmRleCAhPT0gMCkge1xyXG4gICAgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyZW50SW5kZXgpO1xyXG4gICAgY3VycmVudEluZGV4IC09IDE7XHJcbiAgICB0ZW1wID0gYXJyYXlbY3VycmVudEluZGV4XTtcclxuICAgIGFycmF5W2N1cnJlbnRJbmRleF0gPSBhcnJheVtyYW5kb21JbmRleF07XHJcbiAgICBhcnJheVtyYW5kb21JbmRleF0gPSB0ZW1wO1xyXG4gIH1cclxuICByZXR1cm4gYXJyYXk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN3YXAoYXJyYXksIGksIGopIHtcclxuICBjb25zdCB0ZW1wID0gYXJyYXlbaV07XHJcbiAgYXJyYXlbaV0gPSBhcnJheVtqXTtcclxuICBhcnJheVtqXSA9IHRlbXA7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpcnN0RW1wdHlJbmRleChhcnJheSkge1xyXG4gIGlmIChhcnJheS5sZW5ndGggPCAxKSByZXR1cm4gMDtcclxuICBcclxuICBmb3IgKGxldCBpID0gMDsgaSA8PSBhcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgaWYgKGFycmF5W2ldID09IG51bGwpIHJldHVybiBpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbGVycChzdGFydCwgZW5kLCB0aW1lKSB7XHJcbiAgLy9yZXR1cm4gc3RhcnQgKyAodGltZSAqIChlbmQgLSBzdGFydCkpO1xyXG4gIHJldHVybiAoKDEgLSB0aW1lKSAqIHN0YXJ0KSArICh0aW1lICogZW5kKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2xhbXAodmFsdWUsIG1pbmltdW0sIG1heGltdW0pIHtcclxuICBpZiAodmFsdWUgPCBtaW5pbXVtKSB7XHJcbiAgICByZXR1cm4gbWluaW11bTtcclxuICB9XHJcbiAgZWxzZSBpZiAodmFsdWUgPiBtYXhpbXVtKSB7XHJcbiAgICByZXR1cm4gbWF4aW11bTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiByYW5kb21JbnQobWluaW11bSwgbWF4aW11bSkge1xyXG4gIHJldHVybiBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogKG1heGltdW0gKyAxKSkgKyBtaW5pbXVtKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0WEZyb21JbmRleChpbmRleCwgY29sdW1ucykge1xyXG4gIHJldHVybiBpbmRleCAlIGNvbHVtbnM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFlGcm9tSW5kZXgoaW5kZXgsIGNvbHVtbnMpIHtcclxuICByZXR1cm4gKGluZGV4IC0gKGluZGV4ICUgY29sdW1ucykpIC8gY29sdW1ucztcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0SW5kZXhGcm9tWFkoeCwgeSwgY29sdW1ucykge1xyXG4gIHJldHVybiAoeSAqIGNvbHVtbnMpICsgeDtcclxufVxyXG5cclxuZnVuY3Rpb24gdGltZXN0YW1wKGRhdGUpIHtcclxuICBpZiAoIShkYXRlIGluc3RhbmNlb2YgRGF0ZSkpIHJldHVybiBcIkludmFsaWQgZGF0ZVwiO1xyXG4gIGxldCBtb250aCA9IGRhdGUuZ2V0TW9udGgoKSArIDE7XHJcbiAgbGV0IGRheSA9IGRhdGUuZ2V0RGF0ZSgpO1xyXG4gIGxldCBob3VyID0gZGF0ZS5nZXRIb3VycygpO1xyXG4gIGxldCBtaW51dGUgPSBkYXRlLmdldE1pbnV0ZXMoKTtcclxuICBsZXQgc2Vjb25kID0gZGF0ZS5nZXRTZWNvbmRzKCk7XHJcbiAgaWYgKG1vbnRoIDwgMTApIG1vbnRoID0gXCIwXCIgKyBtb250aDtcclxuICBpZiAoZGF5IDwgMTApIGRheSA9IFwiMFwiICsgZGF5O1xyXG4gIGlmIChob3VyIDwgMTApIGhvdXIgPSBcIjBcIiArIGhvdXI7XHJcbiAgaWYgKG1pbnV0ZSA8IDEwKSBtaW51dGUgPSBcIjBcIiArIG1pbnV0ZTtcclxuICBpZiAoc2Vjb25kIDwgMTApIHNlY29uZCA9IFwiMFwiICsgc2Vjb25kO1xyXG4gIHJldHVybiBgJHtkYXRlLmdldEZ1bGxZZWFyKCl9LSR7bW9udGh9LSR7ZGF5fSAke2hvdXJ9OiR7bWludXRlfToke3NlY29uZH1gO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbmRlZmluaXRlQXJ0aWNsZSh3b3JkKSB7XHJcblx0bGV0IHJlZ2V4ID0gL3Ryb3VzZXJzJHxqZWFucyR8Z2xhc3NlcyQvaTtcclxuXHRpZiAod29yZC5tYXRjaChyZWdleCkpIHJldHVybiBcImEgcGFpciBvZiBcIiArIHdvcmQ7XHJcblxyXG5cdHJlZ2V4ID0gL15bYWVpb3VdL2k7XHJcblx0aWYgKHdvcmQubWF0Y2gocmVnZXgpKSByZXR1cm4gXCJhbiBcIiArIHdvcmQ7XHJcblxyXG5cdHJldHVybiBcImEgXCIgKyB3b3JkO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwbHVyYWwod29yZCkge1xyXG5cdGxldCByZWdleCA9IC9zaGVlcCR8ZGVlciR8ZmlzaCQvaTtcclxuXHRpZiAod29yZC5tYXRjaChyZWdleCkpIHJldHVybiB3b3JkO1xyXG5cclxuXHRyZWdleCA9IC90cm91c2VycyR8amVhbnMkfGdsYXNzZXMkL2k7XHJcblx0aWYgKHdvcmQubWF0Y2gocmVnZXgpKSByZXR1cm4gXCJwYWlycyBvZiBcIiArIHdvcmQ7XHJcblx0XHJcblx0cmVnZXggPSAvc3RvbWFjaCR8ZXBvY2gkfC9pO1xyXG5cdGlmICh3b3JkLm1hdGNoKHJlZ2V4KSkgcmV0dXJuIHdvcmQgKyBcInNcIjtcclxuXHRcclxuXHRyZWdleCA9IC9mJHxmZSQvaTtcclxuXHRpZiAod29yZC5tYXRjaChyZWdleCkpIHJldHVybiB3b3JkLnJlcGxhY2UocmVnZXgsIFwidmVzXCIpO1xyXG5cclxuXHRyZWdleCA9IC9bc3h6XSR8Y2gkfHNoJHxhdG8kL2k7XHJcblx0aWYgKHdvcmQubWF0Y2gocmVnZXgpKSByZXR1cm4gd29yZCArIFwiZXNcIjtcclxuXHRcclxuXHRyZWdleCA9IC95JC9pO1xyXG5cdGlmICh3b3JkLm1hdGNoKHJlZ2V4KSkgcmV0dXJuIHdvcmQucmVwbGFjZShyZWdleCwgXCJpZXNcIik7XHJcblx0XHJcblx0cmV0dXJuIHdvcmQgKyBcInNcIjtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIGNyZWF0ZTJkQXJyYXksXHJcbiAgY3JlYXRlM2RBcnJheSxcclxuICBzaHVmZmxlLFxyXG4gIHN3YXAsXHJcbiAgZmlyc3RFbXB0eUluZGV4LFxyXG4gIGxlcnAsXHJcbiAgY2xhbXAsXHJcbiAgcmFuZG9tSW50LFxyXG4gIGdldFhGcm9tSW5kZXgsXHJcbiAgZ2V0WUZyb21JbmRleCxcclxuICBnZXRJbmRleEZyb21YWSxcclxuICB0aW1lc3RhbXAsXHJcbiAgaW5kZWZpbml0ZUFydGljbGUsXHJcbiAgcGx1cmFsXHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImJjcnlwdFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJleHByZXNzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImZzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImh0dHBcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibW9uZ29vc2VcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibm9kZS1nYW1lbG9vcFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXRoXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInNvY2tldC5pb1wiKTsiXSwic291cmNlUm9vdCI6IiJ9
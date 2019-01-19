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
/* harmony import */ var _game_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../game.js */ "./server/src/game.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config.js */ "./server/src/config.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util.js */ "./server/src/util.js");
/* harmony import */ var _entity_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./entity.js */ "./server/src/classes/entity.js");





// An Actor is an Entity which can move, attack and interact with items

class Actor extends _entity_js__WEBPACK_IMPORTED_MODULE_3__["default"] {
	constructor(mapId, x, y, direction, name, sprite) {
		sprite = _util_js__WEBPACK_IMPORTED_MODULE_2__["default"].clamp(sprite, 1, _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].MAX_SPRITES);

		super(mapId, x, y, sprite);
		this.name = name;
		this.description = "";

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

		const inventory = this.getInventory();

		// For each item in inventory check for bonuses
		for (let i = 0; i < inventory.length; i++) {
			const item = inventory[i];
			itemBonus.damage += item.passive.damage;
			itemBonus.defence += item.passive.defence;
			itemBonus.healthMax += item.passive.healthMax;
			itemBonus.energyMax += item.passive.energyMax;
			itemBonus.range += item.passive.range;

			if (item.slot >= _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].INVENTORY_SIZE) {
				itemBonus.damage += item.equipped.damage;
				itemBonus.defence += item.equipped.defence;
				itemBonus.healthMax += item.equipped.healthMax;
				itemBonus.energyMax += item.equipped.energyMax;
				itemBonus.range += item.equipped.range;
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
	
	inputData() {
		// See Player and Bot classes
	}

	// Movement
	move(direction) {
		if (this.isMoving) return;

		if (direction) {
			this.direction = direction;
		}

		if (direction === 'left') {
			if (!_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].isVacant(this.mapId, this.x - 1, this.y)) return;
			this.destinationX--;
		}
		else if (direction === 'right') {
			if (!_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].isVacant(this.mapId, this.x + 1, this.y)) return;
			this.destinationX++;
		}
		else if (direction === 'up') {
			if (!_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].isVacant(this.mapId, this.x, this.y - 1)) return;
			this.destinationY--;
		}
		else if (direction === 'down') {
			if (!_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].isVacant(this.mapId, this.x, this.y + 1)) return;
			this.destinationY++;
		}
		else {
			switch (_util_js__WEBPACK_IMPORTED_MODULE_2__["default"].randomInt(0, 3 + this.laziness)) {
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
		else if (_util_js__WEBPACK_IMPORTED_MODULE_2__["default"].randomInt(0, 1) === 0) {
			if (target.x < this.x) {
				if (target.x >= (this.x - this.range) && target.y === this.y) {
					if (hostile && !this.isMoving) {
						this.direction = 'left';
						this.attack('left');
					}
				}
				else {
					this.move('left');
				}
			}
			else if (target.x > this.x) {
				if (target.x === this.x + this.range && target.y === this.y) {
					if (hostile && !this.isMoving) {
						this.direction = 'right';
						this.attack('right');
					}
				}
				else {
					this.move('right');
				}
			}
			else if (target.y < this.y) {
				if (target.x === this.x && target.y === this.y - this.range) {
					if (hostile && !this.isMoving) {
						this.direction = 'up';
						this.attack('up');
					}
				}
				else {
					this.move('up');
				}
			}
			else if (target.y > this.y) {
				if (target.x === this.x && target.y === this.y + this.range) {
					if (hostile && !this.isMoving) {
						this.direction = 'down';
						this.attack('down');
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
					if (hostile && !this.isMoving) {
						this.direction = 'down';
						this.attack('down');
					}
				}
				else {
					this.move('down');
				}
			}
			else if (target.y < this.y) {
				if (target.x === this.x && target.y === this.y - this.range) {
					if (hostile && !this.isMoving) {
						this.direction = 'up';
						this.attack('up');
					}
				}
				else {
					this.move('up');
				}
			}
			else if (target.x > this.x) {
				if (target.x === this.x + this.range && target.y === this.y) {
					if (hostile && !this.isMoving) {
						this.direction = 'right';
						this.attack('right');
					}
				}
				else {
					this.move('right');
				}
			}
			else if (target.x < this.x) {
				if (target.x >= (this.x - this.range) && target.y === this.y) {
					if (hostile && !this.isMoving) {
						this.direction = 'left';
						this.attack('left');
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
				if (this.x === _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].MAP_COLUMNS - 1) {
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
				if (this.y === _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].MAP_ROWS - 1) {
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
		
		const playerList = _game_js__WEBPACK_IMPORTED_MODULE_0__["default"].players.filter(player => player.mapId === this.mapId);
		const botList = _game_js__WEBPACK_IMPORTED_MODULE_0__["default"].bots.filter(bot => bot.mapId === this.mapId);
		const actorList = playerList.concat(botList);
		let targetList = actorList.filter(actor => {
			return actor !== this && !actor.isDead && this.checkInRange(direction, actor, this.range);
		});
		
		targetList.sort((a, b) => {
			return (a.z - b.z);	// Lowest to highest
		});
		
		targetList = targetList.splice(-numTargets);
		
		targetList.forEach((target) => {
			target.takeDamage(this.damage, this);
		});
	}
	
	takeDamage(damage, attacker) {
		damage -= this.defence;
		if (damage < 0) damage = 0;
		_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].spawnDamageText(this.mapId, this.x, this.y, damage);
		if (damage === 0) return;
		
		this.health -= damage;
		if (this.health <= 0) {
			this.setDead();
			
			if (!attacker) {
				_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].sendGameInfoGlobal(this.name + " has died!");
				return;
			}

			attacker.kills++;
			if (attacker.target === this) attacker.target = null;
			if (attacker.playerId) {
				_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].sendGameInfoGlobal(attacker.name + " has murdered " + this.name + " in cold blood!");
			}
			else {
				_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].sendGameInfoGlobal(this.name + " has been killed by " + attacker.name + "!");
			}
		}
	}	

	setDead() {
		const map = _game_js__WEBPACK_IMPORTED_MODULE_0__["default"].maps[this.mapId];
		const inventory = this.getInventory();

		// Inventory Item Drop Chance
		const dropChance = _util_js__WEBPACK_IMPORTED_MODULE_2__["default"].clamp(map.dropChance, 0, 100);
		if (dropChance > 0) {
			const items = inventory.filter(item => {
				return item.slot < _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].INVENTORY_SIZE;
			});

			items.forEach(item => {
				if (Math.floor(Math.random() * 101) <= dropChance) {
					item.moveToMap(this.mapId, this.x, this.y);
				}
			});
			this.calcBonusStats();
		}

		// Equipped Item Drop Amount
		const dropAmountEQ = _util_js__WEBPACK_IMPORTED_MODULE_2__["default"].clamp(map.dropAmountEQ, 0, _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].EQUIPMENT_SIZE);
		if (dropAmountEQ > 0) {
			let equipment = inventory.filter(item => {
				return item.slot >= _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].INVENTORY_SIZE;
			});

			equipment = _util_js__WEBPACK_IMPORTED_MODULE_2__["default"].shuffle(equipment);
			equipment.splice(-dropAmountEQ);
			equipment.forEach(item => {
				item.moveToMap(this.mapId, this.x, this.y);
			});
			this.calcBonusStats();
		}
	}
	
	// Inventory
	pickUp() {
		const mapItems = _game_js__WEBPACK_IMPORTED_MODULE_0__["default"].items.filter(item => {
			return item.mapId === this.mapId && item.x === this.x && item.y === this.y;
		});
		for (let i = 0; i < mapItems.length; i++) {
			const item = mapItems[i];
			if (!item) continue;
			
			if (item.stackable) {
				const inventory = this.getInventory();
				if (inventory.length > 0) {
					const sameItems = inventory.filter(inventoryItem => {
						return inventoryItem.templateId === item.templateId;
					});
					if (sameItems.length > 0) {
						sameItems[0].stack += item.stack;
						item.remove();
						continue;
					}
				}
			}

			const slot = this.findFirstEmptySlot();
			if (slot == null) return false;

			item.moveToInventory(this.playerId, this.botId, slot);
		}
	}

	getInventory() {
		// See Player and Bot classes
	}

	getItem(slot) {
		const inventory = this.getInventory();
		const items = inventory.filter(item => {
			return item.slot === slot;
		});
		return items[0];
	}

	hasItem(templateId) {
		const inventory = this.getInventory();
		const items = _game_js__WEBPACK_IMPORTED_MODULE_0__["default"].items.filter(item => {
			return item.templateId === templateId;
		});
		if (items[0].stackable) {
			return items[0].stack;
		}
		else {
			return items.length;
		}
	}

	findItemSlot(templateId) {
		const inventory = this.getInventory();
		const items = inventory.filter(item => {
			return item.templateId === templateId;
		});
		return items[0].slot;
	}

	findFirstEmptySlot() {
		const inventory = this.getInventory();

		for (let slot = 0; slot < _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].INVENTORY_SIZE; slot++) {
			let occupied = false;
			for (let i = 0; i < inventory.length; i++) {
				if (inventory[i].slot === slot) {
					occupied = true;
					break;
				}
			}
			if (!occupied) return slot;
		}
		return null;
	}

	useItem(slot) {
		const item = this.getItem(slot);
		if (!item) return;

		// TODO: if (!useScript()) return;

		if (item.isEquipment()) {
			if (item.slot < _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].INVENTORY_SIZE) {	// Check if item is equipped
				this.equipItem(item);
				return;
			}
			else {
				this.unequipItem(item);
			}
		}

		if (!item.reusable) item.removeOne();
	}

	dropItem(slot) {
		const item = this.getItem(slot);
		if (!item) return;
		item.moveToMap(this.mapId, this.x, this.y);
		this.calcBonusStats();
	}

	moveItemToSlot(slot, newSlot) {
		if (slot == null || newSlot == null || slot === newSlot) return;	// null == undefined, null != 0
		if (slot >= _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].INVENTORY_SIZE + _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].EQUIPMENT_SIZE) return;
		if (newSlot >= _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].INVENTORY_SIZE + _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].EQUIPMENT_SIZE) return;

		const item = this.getItem(slot);
		const newItem = this.getItem(newSlot);
		if (!item) return;

		// Target slot is for equipment - check type matches
		if (newSlot >= _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].INVENTORY_SIZE) {
			if (item.equippedSlot + _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].INVENTORY_SIZE !== newSlot) {
				_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].sendGameInfoPlayer(this.id, "That cannot be equipped there.");
				return;
			}
		}

		const swapSlots = () => {
			item.slot = newSlot;
			if (newItem) newItem.slot = slot;
			this.calcBonusStats();
		};

		// IF No new item in new slot
		// OR New item in new slot, old item in inventory
		// OR New item in new slot, old item is equipped, new item can be equipped in old slot
		if (!newItem || slot < _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].INVENTORY_SIZE || newItem.equippedSlot + _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].INVENTORY_SIZE === slot) {
			swapSlots();
		}
		else {
			// Old item is equipped, new item cannot be equipped in old slot
			newSlot = this.findFirstEmptySlot();
			if (newSlot != null) {
				swapSlots();
			}
			else {
				_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].sendGameInfoPlayer(this.id, "Your inventory is full.");
			}
		}
	}

	equipItem(item) {
		const equippedItem = this.getItem(item.equippedSlot + _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].INVENTORY_SIZE);
		item.slot = item.equippedSlot + _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].INVENTORY_SIZE;
		if (equippedItem) equippedItem.slot = this.findFirstEmptySlot();
		this.calcBonusStats();
	}

	unequipItem(item) {
		const newSlot = this.findFirstEmptySlot();
		if (newSlot == null) {
			_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].sendGameInfoPlayer(this.gameId, "Your inventory is full.");
			return;
		}
		item.slot = newSlot;
		this.calcBonusStats();
	}

	update(delta) {
		// Inventory Item Update
		const inventory = this.getInventory();
		inventory.forEach(item => {
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
		const inventoryPack = [];
		const inventory = this.getInventory();
		inventory.forEach((item) => {
			if (item) inventoryPack[item.slot] = item.getPack();
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
	constructor(data) {
		let { _id, mapId, x, y, direction, template, name, sprite, hostile,
					damageBase, defenceBase, healthMaxBase, energyMaxBase, rangeBase 
				} = data;
		
		if (_id == null) _id = _game_js__WEBPACK_IMPORTED_MODULE_0__["default"].requestDBId();
		if (name == null) name = template.name;
		if (sprite == null) sprite = template.sprite;
		if (hostile == null) hostile = template.hostile;
		if (damageBase == null) damageBase = template.damageBase;
		if (defenceBase == null) defenceBase = template.defenceBase;
		if (healthMaxBase == null) healthMaxBase = template.healthMaxBase;
		if (energyMaxBase == null) energyMaxBase = template.energyMaxBase;
		if (rangeBase == null) rangeBase = template.rangeBase;

		super(mapId, x, y, direction, name, sprite);
		this.botId = _id;
		this.templateId = template._id;
		this.damageBase = damageBase;
		this.defenceBase = defenceBase;
		this.healthMaxBase = healthMaxBase;
		this.energyMaxBase = energyMaxBase;
		this.rangeBase = rangeBase;
		this.restore();
		
		this.hostile = hostile;
		this.target = null;
		this.setTask('wandering');
		this.moveTimer = 0;

		this.gameId = _util_js__WEBPACK_IMPORTED_MODULE_2__["default"].firstEmptyIndex(_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].bots);
		_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].bots[this.gameId] = this;
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
	
	getDBPack() {
		return {
			botId: this.botId,
			templateId: this.templateId,
			mapId: this.mapId,
			x: this.x,
			y: this.y,
			direction: this.direction,
			name: this.name,
			sprite: this.sprite,
			hostile: this.hostile
		};
	}

	remove() {
		delete _game_js__WEBPACK_IMPORTED_MODULE_0__["default"].bots[this.gameId];
	}
	
	move(direction) {
		let moveTime = 24;
		if (this.isRunning) moveTime = 17;
		if (this.moveTimer > moveTime && this.attackTimer === 0) {
			super.move(direction);
			this.moveTimer = 0;
		}
	}
	
	takeDamage(damage, attacker) {
		if (attacker instanceof _actor_js__WEBPACK_IMPORTED_MODULE_3__["default"]) this.setTask('attacking', attacker);
		super.takeDamage(damage, attacker);
	}
	
	pickUp() {
		super.pickUp();
		this.checkBestEquipment();
	}

	getInventory() {
		const inventory = _game_js__WEBPACK_IMPORTED_MODULE_0__["default"].items.filter(item => {
			return ""+item.botId === ""+this.botId;
		});
		return inventory;
	}

	setDead() {
		super.setDead();
		this.remove();
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
		const inventory = this.getInventory();
		const equipment = [];
		for (let slot = 0; slot < _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].EQUIPMENT_SIZE; slot++) {
			equipment.push([]);
		}

		for (let i = 0; i < inventory.length; i++) {
			const item = inventory[i];
			for (let slot = 0; slot < _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].EQUIPMENT_SIZE; slot++) {
				if (item.equippedSlot === slot) {
					equipment[slot].push(item);
				}
			}
		}

		if (equipment[0].length > 0) {
			equipment[0].sort((a, b) => b.equipped.damage - a.equipped.damage);
			this.equipItem(equipment[0][0]);
		}
		if (equipment[1].length > 0) {
			equipment[1].sort((a, b) => b.equipped.defence - a.equipped.defence);
			this.equipItem(equipment[1][0]);
		}
		if (equipment[2].length > 0) {
			equipment[2].sort((a, b) => b.equipped.defence - a.equipped.defence);
			this.equipItem(equipment[2][0]);
		}
		if (equipment[3].length > 0) {
			equipment[3].sort((a, b) => b.equipped.defence - a.equipped.defence);
			this.equipItem(equipment[3][0]);
		}
		if (equipment[4].length > 0) {
			equipment[4].sort((a, b) => b.equipped.defence - a.equipped.defence);
			this.equipItem(equipment[4][0]);
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
		
		this.gameId = _util_js__WEBPACK_IMPORTED_MODULE_3__["default"].firstEmptyIndex(_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].effects);
		_game_js__WEBPACK_IMPORTED_MODULE_1__["default"].effects[this.gameId] = this;
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
			gameId: this.gameId,
			mapId: this.mapId,
			x: this.x,
			y: this.y,
			sprite: this.sprite,
			currentFrame: this.currentFrame
		};
	}
	
	remove() {
		delete _game_js__WEBPACK_IMPORTED_MODULE_1__["default"].effects[this.gameId];
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
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util.js */ "./server/src/util.js");
/* harmony import */ var _entity_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./entity.js */ "./server/src/classes/entity.js");




class Item extends _entity_js__WEBPACK_IMPORTED_MODULE_2__["default"] {
	constructor(data) {
		if (!data) return;

		let { _id, playerId, botId, slot, mapId, x, y, template, stack, sprite, name, description, reusable, createdBy, createdDate,
					passiveDamage, passiveDefence, passiveHealthMax, passiveEnergyMax, passiveRange,
					equippedDamage, equippedDefence, equippedHealthMax, equippedEnergyMax, equippedRange
				} = data;

		if (_id == null) _id = _game_js__WEBPACK_IMPORTED_MODULE_0__["default"].requestDBId();
		if (playerId === undefined) playerId = null;
		if (botId === undefined) botId = null;
		if (slot === undefined) slot = null;
		if (mapId === undefined) mapId = null;
		if (x === undefined) x = null;
		if (y === undefined) y = null;
		if (createdBy === undefined) createdBy = null;
		if (createdDate === undefined) createdDate = new Date();

		if (sprite === undefined) sprite = template.sprite;
		if (name === undefined) name = template.name;
		if (description === undefined) description = template.description;
		if (reusable === undefined) reusable = template.reusable;
		if (passiveDamage === undefined) passiveDamage = template.passiveDamage;
		if (passiveDefence === undefined) passiveDefence = template.passiveDefence;
		if (passiveHealthMax === undefined) passiveHealthMax = template.passiveHealthMax;
		if (passiveEnergyMax === undefined) passiveEnergyMax = template.passiveEnergyMax;
		if (passiveRange === undefined) passiveRange = template.passiveRange;
		if (equippedDamage === undefined) equippedDamage = template.equippedDamage;
		if (equippedDefence === undefined) equippedDefence = template.equippedDefence;
		if (equippedHealthMax === undefined) equippedHealthMax = template.equippedHealthMax;
		if (equippedEnergyMax === undefined) equippedEnergyMax = template.equippedEnergyMax;
		if (equippedRange === undefined) equippedRange = template.equippedRange;

		super(mapId, x, y, sprite);
		this.z = -10;
		this.itemId = _id;
		this.playerId = playerId;
		this.botId = botId;
		this.slot = slot;
		
		this.templateId = template._id;
		this.name = name;
		this.description = description;
		this.reusable = reusable;

		this.type = template.type.name;
		this.stackable = template.type.stackable;
		this.equippedSlot = template.type.equippedSlot;
		
		this.passive = {
			damage: passiveDamage,
			defence: passiveDefence,
			healthMax: passiveHealthMax,
			energyMax: passiveEnergyMax,
			range: passiveRange
		};
		this.equipped = {
			damage: equippedDamage,
			defence: equippedDefence,
			healthMax: equippedHealthMax,
			energyMax: equippedEnergyMax,
			range: equippedRange
		};
		
		if (this.stackable) {
			if (stack < 1) stack = 1;
			this.stack = stack;
		}
		else {
			this.stack = 0;
		}

		this.gameId = _util_js__WEBPACK_IMPORTED_MODULE_1__["default"].firstEmptyIndex(_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].items);
		_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].items[this.gameId] = this;
	}

	update(delta) {
		return this.getPack();
	}

	getDBPack() {
		return {
			itemId: this.itemId,
			playerId: this.playerId,
			botId: this.botId,
			slot: this.slot,
			mapId: this.mapId,
			x: this.x,
			y: this.y,
			createdBy: this.createdBy,
			createdDate: this.createdDate,
			templateId: this.templateId,
			name: this.name,
			description: this.description,
			sprite: this.sprite,
			reusable: this.reusable,
			passiveDamage: this.passive.damage,
			passiveDefence: this.passive.defence,
			passiveHealthMax: this.passive.healthMax,
			passiveEnergyMax: this.passive.energyMax,
			passiveRange: this.passive.range,
			equippedDamage: this.equipped.damage,
			equippedDefence: this.equipped.defence,
			equippedHealthMax: this.equipped.healthMax,
			equippedEnergyMax: this.equipped.energyMax,
			equippedRange: this.equipped.range,
			stack: this.stack,
			isVisible: this.isVisible
		};
	}
	
	getPack() {
		return {
			gameId: this.gameId,
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
		delete _game_js__WEBPACK_IMPORTED_MODULE_0__["default"].items[this.gameId];
	}

	removeOne() {
		if (this.stack > 1) {
			this.stack--;
		}
		else {
			this.remove();
		}
	}

	moveToInventory(playerId, botId, slot) {
		this.playerId = playerId;
		this.botId = botId;
		this.slot = slot;
		this.mapId = null;
		this.x = null;
		this.y = null;
		this.z = null;
	}

	moveToMap(mapId, x, y) {
		this.mapId = mapId;
		this.x = x;
		this.y = y;
		this.z = this.getZPosition(mapId, x, y);
		this.playerId = null;
		this.botId = null;
		this.slot = null;
	}
	
	getZPosition(mapId, x, y) {
		return -10;
	}

	isEquipment() {
		if (this.equippedSlot >= 0) {
			return true;
		}
		else {
			return false;
		}
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

	getUpdatePack() {
		return {
			mapId: this.mapId,
			name: this.name,
			tiles: this.tiles
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
		this.playerId = data._id;
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

	inputData(data) {
		if (this.isDead) {
			_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].sendGameInfoPlayer(this.gameId, "You are dead.");
			return;
		}

		if (_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].godCommands[data.input]) {
			if (this.adminAccess > 0) {
				_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].godCommands[data.input](data, this);
			}
			else {
				_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].sendGameInfoPlayer(this.gameId, "You don't have access to that command.");
			}
		}
		else {
			if (_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].commands[data.input]) {
				_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].commands[data.input](data, this);
			}
			else {
				_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].sendGameInfoPlayer(this.gameId, "Invalid command.");
			}
		}
	}

	pickUp() {
		if (super.pickUp() === false) _game_js__WEBPACK_IMPORTED_MODULE_0__["default"].sendGameInfoPlayer(this.gameId, "Your inventory is full.");
	}
	
	getInventory() {
		const inventory = _game_js__WEBPACK_IMPORTED_MODULE_0__["default"].items.filter(item => {
			return ""+item.playerId === ""+this.playerId;
		});
		return inventory;
	}

	setDead() {
		super.setDead();
		this.isDead = true;
		this.health = 0;
		this.energy = 0;
		this.deaths++;
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

		this.gameId = _util_js__WEBPACK_IMPORTED_MODULE_1__["default"].firstEmptyIndex(_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].texts);
		_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].texts[this.gameId] = this;
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
			gameId: this.gameId,
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
		delete _game_js__WEBPACK_IMPORTED_MODULE_0__["default"].texts[this.gameId];
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
/* harmony import */ var _models_bot_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./models/bot.js */ "./server/src/models/bot.js");
/* harmony import */ var _models_botTemplate_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./models/botTemplate.js */ "./server/src/models/botTemplate.js");
/* harmony import */ var _models_item_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./models/item.js */ "./server/src/models/item.js");
/* harmony import */ var _models_itemTemplate_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./models/itemTemplate.js */ "./server/src/models/itemTemplate.js");
/* harmony import */ var _models_itemType_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./models/itemType.js */ "./server/src/models/itemType.js");
/* harmony import */ var _models_map_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./models/map.js */ "./server/src/models/map.js");















const fsp = fs__WEBPACK_IMPORTED_MODULE_2___default.a.promises;
mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Promise = Promise;
mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.connect('mongodb://localhost/odyssey', {useNewUrlParser: true});

class Database {
	constructor() {
		this.serverLog = [];
	}

	async backup(data = {}) {
		//TODO save everything
		// const maps = save-all-maps
		let players = this.saveOnlinePlayers(data.players);
		const bots = this.saveAllBots(data.bots);
		let items = this.saveAllItems(data.items);
		let logSaved = this.saveLog();
		Promise.all([players, bots, items, logSaved])
		.then(() => this.log("Game saved to disk."));
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

	generateId() {
		return new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Types.ObjectId;
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
		let account = await _models_account_js__WEBPACK_IMPORTED_MODULE_4__["default"].findOne({username: username}).exec();
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
	async getAccountByUsername(username) {
		return await _models_account_js__WEBPACK_IMPORTED_MODULE_4__["default"].findOne({username: username})
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
	async getPlayersByAccount(accountId) {
		return await _models_player_js__WEBPACK_IMPORTED_MODULE_5__["default"].find({account: accountId})
		.select('_id account name template level experience mapId x y direction adminAccess sprite')
		.populate('template')
		.exec()
		.then(players => players)
		.catch(err => console.log(err));
	}
	async savePlayer(data) {
		return await _models_player_js__WEBPACK_IMPORTED_MODULE_5__["default"].updateOne({name: data.name}, {$set: data})
		.exec()
		.then(result => true)
		.catch(err => console.log(err));
	}
	saveOnlinePlayers(players = []) {
		for (let i = 0; i < players.length; i++) {
			const player = players[i];
			if (!player) continue;
			this.savePlayer(player);
		}
	}

	async addBot(data) {
		let template = await this.getBotTemplate(data.templateId);
		if (!template) {
			console.log("Bot Template does not exist with that id.");
			return false;
		}

		let _id = data.botId;
		if (!_id) _id = new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Types.ObjectId;

		const bot = new _models_bot_js__WEBPACK_IMPORTED_MODULE_7__["default"]({
			_id,
			template: data.templateId,
			mapId: data.mapId,
			x: data.x,
			y: data.y,
			direction: data.direction
		});

		return await bot.save()
		.then(result => true)
		.catch(err => console.log(err));
	}
	async getBot(botId) {
		return await _models_bot_js__WEBPACK_IMPORTED_MODULE_7__["default"].findOne({_id: botId})
		.select('_id name sprite template level experience mapId x y direction')
		.populate('template')
		.exec()
		.then(bot => bot)
		.catch(err => console.log(err));
	}
	async saveBot(data) {
		return await _models_bot_js__WEBPACK_IMPORTED_MODULE_7__["default"].updateOne({_id: data.botId}, {$set: data})
		.exec()
		.then(result => true)
		.catch(err => console.log(err));
	}
	async getAllBots() {
		return await _models_bot_js__WEBPACK_IMPORTED_MODULE_7__["default"].find({})
		.select('_id template mapId x y direction')
		.populate('template')
		.exec()
		.then(bots => bots)
		.catch(err => console.log(err));
	}
	async saveAllBots(currentBots) {
		if (!currentBots) return;

		let savedBots = await this.getAllBots();
		const newBots = currentBots.filter(bot => !savedBots.find(savedBot => savedBot._id === bot.botId));
		const existingBots = currentBots.filter(bot => savedBots.find(savedBot => savedBot._id === bot.botId));
		const deleteBots = savedBots.filter(bot => !existingBots.find(existingBot => existingBot.botId === bot._id));
		const updateBots = existingBots.filter(bot => !deleteBots.includes(bot));

		// Add new Bots
		for (let i = 0; i < newBots.length; i++) {
			this.addBot(newBots[i]);
		}

		// Delete removed Bots
		for (let i = 0; i < deleteBots.length; i++) {
			_models_bot_js__WEBPACK_IMPORTED_MODULE_7__["default"].deleteOne({_id: deleteBots[i]._id}, err => {
				if (err) console.log(err);
			});
		}

		// Update the rest
		for (let i = 0; i < updateBots.length; i++) {
			const bot = updateBots[i];
			if (!bot) continue;
			this.saveBot(bot);
		}
	}

	async getMap(mapId) {
		return await _models_map_js__WEBPACK_IMPORTED_MODULE_12__["default"].findOne({mapId: mapId})
		.select('mapId name dropChance dropAmountEQ tiles isWall isHostile damage warpMap warpX warpY')
		.exec()
		.then(map => map)
		.catch(err => console.log(err));
	}
	async saveMap(data) {
		return await _models_map_js__WEBPACK_IMPORTED_MODULE_12__["default"].updateOne({mapId: data.mapId}, {$set: data}, {upsert: true})
		.exec()
		.then(result => true)
		.catch(err => console.log(err));
	}
	async getAllMaps() {
		try {
			return await _models_map_js__WEBPACK_IMPORTED_MODULE_12__["default"].find({})
			.select('mapId name dropChance dropAmountEQ tiles isWall isHostile damage warpMap warpX warpY')
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
		const template = new _models_botTemplate_js__WEBPACK_IMPORTED_MODULE_8__["default"]({
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
		return await _models_botTemplate_js__WEBPACK_IMPORTED_MODULE_8__["default"].findById(templateId)
		.select('_id name sprite damageBase defenceBase healthMaxBase energyMaxBase rangeBase hostile')
		.exec()
		.then(template => template)
		.catch(err => console.log(err));
	}
	async getAllBotTemplates() {
		return await _models_botTemplate_js__WEBPACK_IMPORTED_MODULE_8__["default"].find({})
		.select('_id name sprite damageBase defenceBase healthMaxBase energyMaxBase rangeBase hostile')
		.exec()
		.then(templates => templates)
		.catch(err => console.log(err));
	}

	async addItemType(data) {
		const type = new _models_itemType_js__WEBPACK_IMPORTED_MODULE_11__["default"]({
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
		return await _models_itemType_js__WEBPACK_IMPORTED_MODULE_11__["default"].findById(typeId)
		.select('name stackable equippedSlot')
		.exec()
		.then(type => type)
		.catch(err => console.log(err));
	}
	async getAllItemTypes() {
		return await _models_itemType_js__WEBPACK_IMPORTED_MODULE_11__["default"].find({})
		.select('_id name stackable equippedSlot')
		.exec()
		.then(types => types)
		.catch(err => console.log(err));
	}

	async addItemTemplate(data) {
		const template = new _models_itemTemplate_js__WEBPACK_IMPORTED_MODULE_10__["default"]({
			_id: new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Types.ObjectId,
			name: data.name,
			sprite: data.sprite,
			reusable: data.reusable,
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
		return await _models_itemTemplate_js__WEBPACK_IMPORTED_MODULE_10__["default"].findById(templateId)
		.select('name sprite reusable type passiveDamage passiveDefence passiveHealthMax passiveEnergyMaxBase passiveRange equippedDamage equippedDefence equippedHealthMax equippedEnergyMaxBase equippedRange')
		.populate('type')
		.exec()
		.then(template => template)
		.catch(err => console.log(err));
	}
	async getAllItemTemplates() {
		return await _models_itemTemplate_js__WEBPACK_IMPORTED_MODULE_10__["default"].find({})
		.select('_id name sprite reusable type passiveDamage passiveDefence passiveHealthMax passiveEnergyMaxBase passiveRange equippedDamage equippedDefence equippedHealthMax equippedEnergyMaxBase equippedRange')
		.populate('type')
		.exec()
		.then(templates => templates)
		.catch(err => console.log(err));
	}

	async addItem(data) {
		let template = await this.getItemTemplate(data.templateId);
		if (!template) {
			console.log("Item Template does not exist with that id.");
			return false;
		}
		let _id = data.itemId;
		if (!_id) _id = new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Types.ObjectId;

		const item = new _models_item_js__WEBPACK_IMPORTED_MODULE_9__["default"]({
			_id,
			template: data.templateId,
			stack: data.stack,
			playerId: data.playerId,
			botId: data.botId,
			slot: data.slot,
			mapId: data.mapId,
			x: data.x,
			y: data.y,
			createdBy: data.createdBy,
			createdDate: data.createdDate
		});

		return await item.save()
		.then(result => true)
		.catch(err => console.log(err));
	}
	async getItem(itemId) {
		return await _models_item_js__WEBPACK_IMPORTED_MODULE_9__["default"].findOne({_id: itemId})
		.select('_id template stack playerId botId slot mapId x y createdDate createdBy')
		.exec()
		.then(item => item)
		.catch(err => console.log(err));
	}
	async saveItem(data) {
		return await _models_item_js__WEBPACK_IMPORTED_MODULE_9__["default"].updateOne({_id: data.itemId}, {$set: data}, {upsert: true})
		.exec()
		.then(result => true)
		.catch(err => console.log(err));
	}
	async getAllItems() {
		try {
			return await _models_item_js__WEBPACK_IMPORTED_MODULE_9__["default"].find({})
			.select('_id template stack playerId botId slot mapId x y createdDate createdBy')
			.populate('template')
			.exec()
			.then(items => items)
			.catch(err => console.log(err));
		}
		catch(err) {
			console.log(err);
		}
	}
	async saveAllItems(currentItems) {
		if (!currentItems) return;

		let savedItems = await this.getAllItems();
		const newItems = currentItems.filter(item => !savedItems.find(savedItem => savedItem._id === item.itemId));
		const existingItems = currentItems.filter(item => savedItems.find(savedItem => savedItem._id === item.itemId));
		const deleteItems = savedItems.filter(item => !existingItems.find(existingItem => existingItem.itemId === item._id));
		const updateItems = existingItems.filter(item => !deleteItems.includes(item));
		
		// Add new Items
		for (let i = 0; i < newItems.length; i++) {
			this.addItem(newItems[i]);
		}

		// Delete removed Items
		for (let i = 0; i < deleteItems.length; i++) {
			_models_item_js__WEBPACK_IMPORTED_MODULE_9__["default"].deleteOne({_id: deleteItems[i]._id}, err => {
				if (err) console.log(err);
			});
		}

		// Update the rest
		for (let i = 0; i < updateItems.length; i++) {
			const item = updateItems[i];
			if (!item) continue;
			this.saveItem(item);
		}
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
		this.loadCommands();
		this.loadItems();
		this.loadBots();
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

	loadCommands() {
		this.commands = {
			move: (data, player) => player.input.direction = data.direction,
			run: (data, player) => player.input.run = data.state,
			pickup: (data, player) => {
				if (!player.input.pickup && data.state) player.pickUp();
				player.input.pickup = data.state;
			},
			attack: (data, player) => {
				player.input.attack = data.state;
				player.attack(1, player.direction);
			},
			doubleClickItem: (data, player) => player.useItem(data.slot),
			rightClickItem: (data, player) => player.dropItem(data.slot),
			dragStopGame: (data, player) => player.dropItem(data.slot),
			dragStopInventory: (data, player) => player.moveItemToSlot(data.slot, data.newSlot),
			dragStopEquipment: (data, player) => player.moveItemToSlot(data.slot, data.newSlot),
			serverChat: (data, player) => game.sendMessageGlobal(player.gameId, `${player.name} yells, "${data.message}"`),
			mapChat: (data, player) => game.sendMessageMap(player.gameId, player.mapId, `${player.name} says, "${data.message}"`),
			playerChat: (data, player) => {
				const target = game.players[data.targetId];
				if (target) {
					game.sendMessagePlayer(player.gameId, target.gameId, `${player.name} whispers, "${data.message}"`);
					game.sendMessagePlayer(player.gameId, player.gameId, `You whisper to ${target.name}, "${data.message}"`);
				}
			},
			macro1: (data) => {
				if (data) this.spawnMapItem(1, 5, 5, "5c1bfeb7d8fb6012cc966083");
			},
			macro2: (data) => {
				if (data) this.spawnBot(1, 5, 5, "5c1becde28d05b077cbaa385");
			},
			macro3: (data) => {
				if (data) {
					if (player.sprite >= _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].MAX_SPRITES) player.sprite = 1;
					else player.sprite++;
				}
			},
			macro4: (data) => {
			},

		};
		
		this.godCommands = {
			spawnMapItem: (data) => this.spawnMapItem(data.args[0], data.args[1], data.args[2], data.args[3], data.args[4]),
			spawnBot: (data) => this.spawnBot(data.args[0], data.args[1], data.args[2], data.args[3], data.args[4]),
			setSprite: (data, player) => player.sprite = data.args[0]
		};
	}

	async loadItems() {
		let itemData = await _db_js__WEBPACK_IMPORTED_MODULE_0__["default"].getAllItems();
		for (let i = 0; i < itemData.length; i++) {
			new _classes_item_js__WEBPACK_IMPORTED_MODULE_5__["default"](itemData[i]);
		}
	}
	async loadBots() {
		let botData = await _db_js__WEBPACK_IMPORTED_MODULE_0__["default"].getAllBots();
		for (let i = 0; i < botData.length; i++) {
			new _classes_bot_js__WEBPACK_IMPORTED_MODULE_4__["default"](botData[i]);
		}
	}
	requestDBId() {
		return _db_js__WEBPACK_IMPORTED_MODULE_0__["default"].generateId();
	}

	update(delta) {
		const pack = {
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
			if (player != null) pack.players[player.gameId] = player.update(delta);
		}
		for (let i = 0; i < this.bots.length; i++) {
			const bot = this.bots[i];
			if (bot) pack.bots[bot.gameId] = bot.update(delta);
		}
		for (let i = 0; i < this.items.length; i++) {
			const item = this.items[i];
			if (item) pack.items[item.gameId] = item.update(delta);
		}
		for (let i = 0; i < this.effects.length; i++) {
			const effect = this.effects[i];
			if (effect) pack.effects[effect.id] = effect.update(delta);
		}
		for (let i = 0; i < this.texts.length; i++) {
			const text = this.texts[i];
			if (text) pack.texts[text.gameId] = text.update(delta);
		}
		return pack;
	}

	getDBPack() {
		const dbPack = {
			players: [],
			bots: [],
			items: []
		};
		this.players.forEach(player => dbPack.players.push(player.getDBPack()));
		this.bots.forEach(bot => dbPack.bots.push(bot.getDBPack()));
		this.items.forEach(item => dbPack.items.push(item.getDBPack()));
		return dbPack;
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
		if (x < 0 || x >= _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].MAP_COLUMNS || y < 0 || y >= _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].MAP_ROWS) return false;
		
		// Check for Wall Tiles
		const map = this.maps[mapId];
		if (map.isWall[y][x]) return false;
		
		// Check for Actors
		const actorList = this.players.concat(this.bots);
		const actorsOnTile = actorList.filter(actor => {
			return actor.mapId === mapId && actor.x === x && actor.y === y && !actor.isDead;
		});
		if (actorsOnTile.length > 0) return false;

		return true;
	}

	spawnBot(mapId, x, y, templateId, direction = 'down') {
		const template = this.botTemplates[templateId];
		if (template) {
			new _classes_bot_js__WEBPACK_IMPORTED_MODULE_4__["default"]({mapId, x, y, direction, template});
		}
		else {
			console.log("Bot Template does not exist with that Id");
		}
	}
	
	spawnMapItem(mapId, x, y, templateId, stack = 0) {
		let template = this.itemTemplates[templateId];
		if (template) {
			new _classes_item_js__WEBPACK_IMPORTED_MODULE_5__["default"]({mapId, x, y, template, stack});
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
			let dbPack = _game_js__WEBPACK_IMPORTED_MODULE_2__["default"].getDBPack();
			_db_js__WEBPACK_IMPORTED_MODULE_1__["default"].backup(dbPack);
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

/***/ "./server/src/models/bot.js":
/*!**********************************!*\
  !*** ./server/src/models/bot.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);


const botSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema({
  _id: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.SchemaTypes.ObjectId,
  mapId: {type: Number, default: 1},
  x: {type: Number, default: 5},
  y: {type: Number, default: 5},
  template: {type: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.SchemaTypes.ObjectId, ref: 'BotTemplate', required: true},
  direction: {type: String, default: 'down'}
});

/* harmony default export */ __webpack_exports__["default"] = (mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.model('Bot', botSchema));


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

/***/ "./server/src/models/item.js":
/*!***********************************!*\
  !*** ./server/src/models/item.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);


const itemSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema({
  _id: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.SchemaTypes.ObjectId,
  template: {type: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.SchemaTypes.ObjectId, ref: 'ItemTemplate', required: true},
  stack: {type: Number, default: 0},
  playerId: {type: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.SchemaTypes.ObjectId, default: null},
  botId: {type: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.SchemaTypes.ObjectId, default: null},
  slot: {type: Number, default: null},
  mapId: {type: Number, default: null},
  x: {type: Number, default: null},
  y: {type: Number, default: null},
  createdBy: {type: String},
  createdDate: {type: Date}
});

/* harmony default export */ __webpack_exports__["default"] = (mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.model('Item', itemSchema));


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
	reusable: {type: Boolean, default: true},
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
			socket.emit('signedIn', false);	// Tell client signin was not successful
			return;
		}

		let account = await _db_js__WEBPACK_IMPORTED_MODULE_4__["default"].getAccountByUsername(username);
		if (this.activeAccounts[account._id]) {
			console.log("That account is already signed in.");
			socket.emit('signedIn', false);	// Tell client that account is already signed in
			return;
		}
		
		socket.accountId = account._id;
		this.activeAccounts[account._id] = username;

		socket.on('addPlayer', (data) => this.onAddPlayer(socket, data.name, data.templateName));
		socket.on('login', (name) => this.onLogIn(socket, name));
		socket.on('logout', () => this.onLogOut(socket));
		socket.on('addPlayerTemplate', (data) => this.onAddPlayerTemplate(data));

		_db_js__WEBPACK_IMPORTED_MODULE_4__["default"].log(`${socket.id} - ${username} signed in.`);
		let players = await _db_js__WEBPACK_IMPORTED_MODULE_4__["default"].getPlayersByAccount(account._id);
		socket.emit('signedIn', {
			account,
			players
		});
	}
	
	async onSignOut(socket) {
		if (socket.playerId != null) await this.onLogOut(socket);
		
		if (socket.accountId) {
			const username = this.activeAccounts[socket.accountId];
			_db_js__WEBPACK_IMPORTED_MODULE_4__["default"].log(`${socket.id} - ${username} signed out.`);
			delete this.activeAccounts[socket.accountId];
			socket.accountId = null;
			socket.emit('signedOut');
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
			socket.emit('loggedIn', false);
			return;
		}
		if (socket.playerId != null) {
			console.log("Already logged in.");
			socket.emit('loggedIn', false);
			return;
		}

		let playerData = await _db_js__WEBPACK_IMPORTED_MODULE_4__["default"].getPlayer(name);
		if (!playerData) {
			console.log("No player with that name.");
			socket.emit('loggedIn', false);
			return;
		}

		if (""+socket.accountId !== ""+playerData.account) {	// Cast to string before comparison
			_db_js__WEBPACK_IMPORTED_MODULE_4__["default"].log(`Attempt to login to player (${playerData.name}) from wrong account (${socket.accountId}) on socket ${socket.id}.`);
			socket.emit('loggedIn', false);
			return;
		}

		const player = _game_js__WEBPACK_IMPORTED_MODULE_5__["default"].playerLogin(socket.id, playerData);
		if (!player) {
			socket.emit('loggedIn', false);
			return;
		}
	
		socket.playerId = player.gameId;
		socket.on('input', (data) => player.inputData(data));
		socket.on('uploadMap', (data) => {
			if (player.adminAccess >= 2) this.onUploadMap(data);
			else _game_js__WEBPACK_IMPORTED_MODULE_5__["default"].sendGameInfoPlayer(player.gameId, `You don't have access to that command.`);
		});
		const mapData = _game_js__WEBPACK_IMPORTED_MODULE_5__["default"].maps[player.mapId].getPack();
		socket.emit('loggedIn', mapData);
	}
	
	async onLogOut(socket) {
		if (socket.playerId != null) {
			await _game_js__WEBPACK_IMPORTED_MODULE_5__["default"].playerLogout(socket.playerId);
			socket.playerId = null;
		}
	}
	
	async onUploadMap(data) {
		let success = await _db_js__WEBPACK_IMPORTED_MODULE_4__["default"].saveMap(data);
		if (!success) {
			console.log("Failed to upload map.");
			return;
		}
		_game_js__WEBPACK_IMPORTED_MODULE_5__["default"].maps[data.mapId].upload(data);
		
		_game_js__WEBPACK_IMPORTED_MODULE_5__["default"].players.forEach((player) => {
			if (player.mapId === data.mapId) {
				this.sendMapData(this.socketList[player.socketId], player.mapId);
			}
		});
	}

	// Send data to clients
	sendUpdatePack(updatePack) {
		_game_js__WEBPACK_IMPORTED_MODULE_5__["default"].players.forEach(player => {
			const pack = {
				game: {
					players: [],
					bots: [],
					items: [],
					effects: [],
					texts: []
				},
				menu: player.getUIPack(),
				chatbox: {}
			};

			for (let playerData of updatePack.players) {
				if (playerData && ((playerData.mapId === player.mapId && playerData.isVisible) || playerData.socketId === player.socketId)) {
					pack.game.players[playerData.gameId] = playerData;
				}
			}
			for (let bot of updatePack.bots) {
				if (bot && bot.mapId === player.mapId) pack.game.bots[bot.gameId] = bot;
			}
			for (let item of updatePack.items) {
				if (item && item.mapId === player.mapId) pack.game.items[item.gameId] = item;
			}
			for (let effect of updatePack.effects) {
				if (effect && effect.mapId === player.mapId) pack.game.effects[effect.gameId] = effect;
			}
			for (let text of updatePack.texts) {
				if (text && text.mapId === player.mapId) pack.game.texts[text.gameId] = text;
			}


/* 			pack.game.players = updatePack.players.filter(playerData => playerData.socketId === player.socketId || (playerData.mapId === player.mapId && playerData.isVisible));
			pack.game.bots = updatePack.bots.filter(bot => bot.mapId === player.mapId);
			pack.game.items = updatePack.items.filter(item => item.mapId === player.mapId);
			pack.game.effects = updatePack.effects.filter(effect => effect.mapId === player.mapId);
			pack.game.texts = updatePack.texts.filter(text => text.mapId === player.mapId); */

			pack.chatbox.messages = updatePack.messages.filter(message => {
				return (message.mapId == null && message.id == null) || player.mapId === message.mapId || player.gameId === message.id;
			});
			
			this.socketList[player.socketId].emit('update', pack);
		});
	}
	
	sendMapData(socket, mapId) {
		const mapData = _game_js__WEBPACK_IMPORTED_MODULE_5__["default"].maps[mapId].getPack();
		socket.emit('loadMap', mapData);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL2FjdG9yLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy9ib3QuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL2VmZmVjdC5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2NsYXNzZXMvZW50aXR5LmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy9pdGVtLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy9tYXAuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL21lc3NhZ2UuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL3BsYXllci5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2NsYXNzZXMvdGV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2NvbmZpZy5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2RiLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvZ2FtZS5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2dhbWVsb29wLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL21vZGVscy9hY2NvdW50LmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvbW9kZWxzL2JvdC5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL21vZGVscy9ib3RUZW1wbGF0ZS5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL21vZGVscy9pdGVtLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvbW9kZWxzL2l0ZW1UZW1wbGF0ZS5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL21vZGVscy9pdGVtVHlwZS5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL21vZGVscy9tYXAuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9tb2RlbHMvcGxheWVyLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvbW9kZWxzL3BsYXllclRlbXBsYXRlLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvc2VydmVyLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvdXRpbC5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJiY3J5cHRcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJleHByZXNzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZnNcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJodHRwXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibW9uZ29vc2VcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJub2RlLWdhbWVsb29wXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicGF0aFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInNvY2tldC5pb1wiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxpQkFBaUIsc0JBQXNCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsbUJBQW1CO0FBQ25CO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwrREFBK0Q7O0FBRS9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxzQkFBc0I7QUFDdEIsR0FBRzs7QUFFSDs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEU7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJOztBQUVKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7O0FBRUo7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILGlCQUFpQixxQkFBcUI7QUFDdEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxvQkFBb0IsMEVBQThCO0FBQ2xEO0FBQ0Esa0JBQWtCLHNCQUFzQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsdUZBQTJDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0VBQWtFO0FBQ2xFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0bkJBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0Esc0JBQXNCO0FBQ3RCOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsMEVBQThCO0FBQ2xEO0FBQ0E7O0FBRUEsaUJBQWlCLHNCQUFzQjtBQUN2QztBQUNBLHFCQUFxQiwwRUFBOEI7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzlOQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEU7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQzNEQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDYkE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdkxBO0FBQ0E7O0FBRUE7QUFDQSw2QkFBNkI7QUFDN0I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUNwRUE7QUFDQTtBQUNBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNUQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtSEFBdUUsV0FBVztBQUNsRjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0TkE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7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Q0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLG1CQUFtQixHQUFHLE1BQU0sR0FBRyxJQUFJLEdBQUcsS0FBSyxHQUFHLE9BQU8sR0FBRyxPQUFPO0FBQzNFOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNwSkEsbUM7Ozs7Ozs7Ozs7O0FDQUEsb0M7Ozs7Ozs7Ozs7O0FDQUEsK0I7Ozs7Ozs7Ozs7O0FDQUEsaUM7Ozs7Ozs7Ozs7O0FDQUEscUM7Ozs7Ozs7Ozs7O0FDQUEsMEM7Ozs7Ozs7Ozs7O0FDQUEsaUM7Ozs7Ozs7Ozs7O0FDQUEsc0MiLCJmaWxlIjoic2VydmVyLmFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc2VydmVyL3NyYy9tYWluLmpzXCIpO1xuIiwiaW1wb3J0IGdhbWUgZnJvbSAnLi4vZ2FtZS5qcyc7XHJcbmltcG9ydCBjb25maWcgZnJvbSAnLi4vY29uZmlnLmpzJztcclxuaW1wb3J0IHV0aWwgZnJvbSAnLi4vdXRpbC5qcyc7XHJcbmltcG9ydCBFbnRpdHkgZnJvbSAnLi9lbnRpdHkuanMnO1xyXG5cclxuLy8gQW4gQWN0b3IgaXMgYW4gRW50aXR5IHdoaWNoIGNhbiBtb3ZlLCBhdHRhY2sgYW5kIGludGVyYWN0IHdpdGggaXRlbXNcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFjdG9yIGV4dGVuZHMgRW50aXR5IHtcclxuXHRjb25zdHJ1Y3RvcihtYXBJZCwgeCwgeSwgZGlyZWN0aW9uLCBuYW1lLCBzcHJpdGUpIHtcclxuXHRcdHNwcml0ZSA9IHV0aWwuY2xhbXAoc3ByaXRlLCAxLCBjb25maWcuTUFYX1NQUklURVMpO1xyXG5cclxuXHRcdHN1cGVyKG1hcElkLCB4LCB5LCBzcHJpdGUpO1xyXG5cdFx0dGhpcy5uYW1lID0gbmFtZTtcclxuXHRcdHRoaXMuZGVzY3JpcHRpb24gPSBcIlwiO1xyXG5cclxuXHRcdHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xyXG5cdFx0dGhpcy5zdGFydFggPSB0aGlzLng7XHJcblx0XHR0aGlzLnN0YXJ0WSA9IHRoaXMueTtcclxuXHRcdHRoaXMuZGVzdGluYXRpb25YID0gdGhpcy54O1xyXG5cdFx0dGhpcy5kZXN0aW5hdGlvblkgPSB0aGlzLnk7XHJcblx0XHR0aGlzLmxlcnAgPSAwO1xyXG5cclxuXHRcdHRoaXMuaXNNb3ZpbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMuaXNSdW5uaW5nID0gZmFsc2U7XHJcblx0XHR0aGlzLm1vdmVTcGVlZCA9IDIuNTtcclxuXHRcdHRoaXMubW92ZW1lbnRUaW1lciA9IDA7XHJcblx0XHR0aGlzLmxhemluZXNzID0gMDtcclxuXHJcblx0XHR0aGlzLmlzQXR0YWNraW5nID0gZmFsc2U7XHJcblx0XHR0aGlzLmF0dGFja1NwZWVkID0gMTtcclxuXHRcdHRoaXMuYXR0YWNrVGltZXIgPSAwO1x0XHJcblx0XHR0aGlzLnRhcmdldCA9IG51bGw7XHJcblx0XHR0aGlzLmtpbGxzID0gMDtcclxuXHJcblx0XHR0aGlzLmNhbGNCb251c1N0YXRzKCk7XHJcblx0fVxyXG5cdFxyXG5cdC8vIENoYXJhY3RlciBTdGF0c1xyXG5cdGdldCBkYW1hZ2UoKSB7XHJcblx0XHRsZXQgZGFtYWdlVG90YWwgPSB0aGlzLmRhbWFnZUJhc2UgKyB0aGlzLmRhbWFnZUJvbnVzO1xyXG5cdFx0cmV0dXJuIChkYW1hZ2VUb3RhbCA8IDApID8gMCA6IGRhbWFnZVRvdGFsO1xyXG5cdH1cclxuXHRnZXQgZGVmZW5jZSgpIHtcclxuXHRcdGxldCBkZWZlbmNlVG90YWwgPSB0aGlzLmRlZmVuY2VCYXNlICsgdGhpcy5kZWZlbmNlQm9udXM7XHJcblx0XHRyZXR1cm4gKGRlZmVuY2VUb3RhbCA8IDApID8gMCA6IGRlZmVuY2VUb3RhbDtcclxuXHR9XHJcblx0Z2V0IGhlYWx0aE1heCgpIHtcclxuXHRcdGxldCBoZWFsdGhNYXhUb3RhbCA9IHRoaXMuaGVhbHRoTWF4QmFzZSArIHRoaXMuaGVhbHRoTWF4Qm9udXNcclxuXHRcdHJldHVybiAoaGVhbHRoTWF4VG90YWwgPCAxKSA/IDEgOiBoZWFsdGhNYXhUb3RhbDtcclxuXHR9XHJcblx0Z2V0IGVuZXJneU1heCgpIHtcclxuXHRcdGxldCBlbmVyZ3lNYXhUb3RhbCA9IHRoaXMuZW5lcmd5TWF4QmFzZSArIHRoaXMuZW5lcmd5TWF4Qm9udXM7XHJcblx0XHRyZXR1cm4gKGVuZXJneU1heFRvdGFsIDwgMCkgPyAwIDogZW5lcmd5TWF4VG90YWw7XHJcblx0fVxyXG5cdGdldCByYW5nZSgpIHtcclxuXHRcdGxldCByYW5nZVRvdGFsID0gdGhpcy5yYW5nZUJhc2UgKyB0aGlzLnJhbmdlQm9udXM7XHJcblx0XHRyZXR1cm4gKHJhbmdlVG90YWwgPCAxKSA/IDEgOiByYW5nZVRvdGFsO1xyXG5cdH1cclxuXHJcblx0Y2FsY0Jhc2VTdGF0cyh0ZW1wbGF0ZSkge1xyXG5cdFx0dGhpcy5kYW1hZ2VCYXNlID0gdGVtcGxhdGUuZGFtYWdlQmFzZSB8fCAxO1xyXG5cdFx0dGhpcy5kZWZlbmNlQmFzZSA9IHRlbXBsYXRlLmRlZmVuY2VCYXNlIHx8IDA7XHJcblx0XHR0aGlzLmhlYWx0aE1heEJhc2UgPSB0ZW1wbGF0ZS5oZWFsdGhNYXhCYXNlICsgKHRlbXBsYXRlLmhlYWx0aFBlckxldmVsICogKHRoaXMubGV2ZWwgLSAxKSkgfHwgMTtcclxuXHRcdHRoaXMuZW5lcmd5TWF4QmFzZSA9IHRlbXBsYXRlLmVuZXJneU1heEJhc2UgKyAodGVtcGxhdGUuZW5lcmd5UGVyTGV2ZWwgKiAodGhpcy5sZXZlbCAtIDEpKSB8fCAxO1xyXG5cdFx0dGhpcy5yYW5nZUJhc2UgPSB0ZW1wbGF0ZS5yYW5nZUJhc2UgfHwgMTtcclxuXHR9XHJcblxyXG5cdGNhbGNJdGVtQm9udXMoKSB7XHJcblx0XHRjb25zdCBpdGVtQm9udXMgPSB7XHJcblx0XHRcdGRhbWFnZTogMCxcclxuXHRcdFx0ZGVmZW5jZTogMCxcclxuXHRcdFx0aGVhbHRoTWF4OiAwLFxyXG5cdFx0XHRlbmVyZ3lNYXg6IDAsXHJcblx0XHRcdHJhbmdlOiAwXHJcblx0XHR9O1xyXG5cclxuXHRcdGNvbnN0IGludmVudG9yeSA9IHRoaXMuZ2V0SW52ZW50b3J5KCk7XHJcblxyXG5cdFx0Ly8gRm9yIGVhY2ggaXRlbSBpbiBpbnZlbnRvcnkgY2hlY2sgZm9yIGJvbnVzZXNcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgaW52ZW50b3J5Lmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IGl0ZW0gPSBpbnZlbnRvcnlbaV07XHJcblx0XHRcdGl0ZW1Cb251cy5kYW1hZ2UgKz0gaXRlbS5wYXNzaXZlLmRhbWFnZTtcclxuXHRcdFx0aXRlbUJvbnVzLmRlZmVuY2UgKz0gaXRlbS5wYXNzaXZlLmRlZmVuY2U7XHJcblx0XHRcdGl0ZW1Cb251cy5oZWFsdGhNYXggKz0gaXRlbS5wYXNzaXZlLmhlYWx0aE1heDtcclxuXHRcdFx0aXRlbUJvbnVzLmVuZXJneU1heCArPSBpdGVtLnBhc3NpdmUuZW5lcmd5TWF4O1xyXG5cdFx0XHRpdGVtQm9udXMucmFuZ2UgKz0gaXRlbS5wYXNzaXZlLnJhbmdlO1xyXG5cclxuXHRcdFx0aWYgKGl0ZW0uc2xvdCA+PSBjb25maWcuSU5WRU5UT1JZX1NJWkUpIHtcclxuXHRcdFx0XHRpdGVtQm9udXMuZGFtYWdlICs9IGl0ZW0uZXF1aXBwZWQuZGFtYWdlO1xyXG5cdFx0XHRcdGl0ZW1Cb251cy5kZWZlbmNlICs9IGl0ZW0uZXF1aXBwZWQuZGVmZW5jZTtcclxuXHRcdFx0XHRpdGVtQm9udXMuaGVhbHRoTWF4ICs9IGl0ZW0uZXF1aXBwZWQuaGVhbHRoTWF4O1xyXG5cdFx0XHRcdGl0ZW1Cb251cy5lbmVyZ3lNYXggKz0gaXRlbS5lcXVpcHBlZC5lbmVyZ3lNYXg7XHJcblx0XHRcdFx0aXRlbUJvbnVzLnJhbmdlICs9IGl0ZW0uZXF1aXBwZWQucmFuZ2U7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIGl0ZW1Cb251cztcclxuXHR9XHJcblxyXG5cdGNhbGNFZmZlY3RCb251cygpIHtcclxuXHRcdGNvbnN0IGVmZmVjdEJvbnVzID0ge1xyXG5cdFx0XHRkYW1hZ2U6IDAsXHJcblx0XHRcdGRlZmVuY2U6IDAsXHJcblx0XHRcdGhlYWx0aE1heDogMCxcclxuXHRcdFx0ZW5lcmd5TWF4OiAwLFxyXG5cdFx0XHRyYW5nZTogMFxyXG5cdFx0fTtcclxuXHJcblx0XHQvLyBUT0RPOiB3b3JrIG91dCBob3cgdG8gZG8gZWZmZWN0cyBmb3Igc3BlbGxzIGFuZCBwb3Rpb25zXHJcblx0XHRyZXR1cm4gZWZmZWN0Qm9udXM7XHJcblx0fVxyXG5cdFxyXG5cdGNhbGNCb251c1N0YXRzKCkge1x0Ly8gSXRlbXMgKGVxdWlwcGVkIGFuZCBwYXNzaXZlKSBhbmQgRWZmZWN0cyAoc3BlbGxzIGFuZCBwb3Rpb25zKVxyXG5cdFx0Y29uc3QgaXRlbUJvbnVzID0gdGhpcy5jYWxjSXRlbUJvbnVzKCk7XHJcblx0XHRjb25zdCBlZmZlY3RCb251cyA9IHRoaXMuY2FsY0VmZmVjdEJvbnVzKCk7XHJcblxyXG5cdFx0dGhpcy5kYW1hZ2VCb251cyA9IGl0ZW1Cb251cy5kYW1hZ2UgKyBlZmZlY3RCb251cy5kYW1hZ2U7XHJcblx0XHR0aGlzLmRlZmVuY2VCb251cyA9IGl0ZW1Cb251cy5kZWZlbmNlICsgZWZmZWN0Qm9udXMuZGVmZW5jZTtcclxuXHRcdHRoaXMuaGVhbHRoTWF4Qm9udXMgPSBpdGVtQm9udXMuaGVhbHRoTWF4ICsgZWZmZWN0Qm9udXMuaGVhbHRoTWF4O1xyXG5cdFx0dGhpcy5lbmVyZ3lNYXhCb251cyA9IGl0ZW1Cb251cy5lbmVyZ3lNYXggKyBlZmZlY3RCb251cy5lbmVyZ3lNYXg7XHJcblx0XHR0aGlzLnJhbmdlQm9udXMgPSBpdGVtQm9udXMucmFuZ2UgKyBlZmZlY3RCb251cy5yYW5nZTtcclxuXHR9XHJcblxyXG5cdGNhbGNTdGF0cygpIHtcclxuXHRcdHRoaXMuY2FsY0Jhc2VTdGF0cygpO1xyXG5cdFx0dGhpcy5jYWxjQm9udXNTdGF0cygpO1xyXG5cdH1cclxuXHJcblx0cmVzdG9yZSgpIHtcclxuXHRcdHRoaXMuaGVhbHRoID0gdGhpcy5oZWFsdGhNYXg7XHJcblx0XHR0aGlzLmVuZXJneSA9IHRoaXMuZW5lcmd5TWF4O1xyXG5cdH1cclxuXHRcclxuXHRpbnB1dERhdGEoKSB7XHJcblx0XHQvLyBTZWUgUGxheWVyIGFuZCBCb3QgY2xhc3Nlc1xyXG5cdH1cclxuXHJcblx0Ly8gTW92ZW1lbnRcclxuXHRtb3ZlKGRpcmVjdGlvbikge1xyXG5cdFx0aWYgKHRoaXMuaXNNb3ZpbmcpIHJldHVybjtcclxuXHJcblx0XHRpZiAoZGlyZWN0aW9uKSB7XHJcblx0XHRcdHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChkaXJlY3Rpb24gPT09ICdsZWZ0Jykge1xyXG5cdFx0XHRpZiAoIWdhbWUuaXNWYWNhbnQodGhpcy5tYXBJZCwgdGhpcy54IC0gMSwgdGhpcy55KSkgcmV0dXJuO1xyXG5cdFx0XHR0aGlzLmRlc3RpbmF0aW9uWC0tO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoZGlyZWN0aW9uID09PSAncmlnaHQnKSB7XHJcblx0XHRcdGlmICghZ2FtZS5pc1ZhY2FudCh0aGlzLm1hcElkLCB0aGlzLnggKyAxLCB0aGlzLnkpKSByZXR1cm47XHJcblx0XHRcdHRoaXMuZGVzdGluYXRpb25YKys7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChkaXJlY3Rpb24gPT09ICd1cCcpIHtcclxuXHRcdFx0aWYgKCFnYW1lLmlzVmFjYW50KHRoaXMubWFwSWQsIHRoaXMueCwgdGhpcy55IC0gMSkpIHJldHVybjtcclxuXHRcdFx0dGhpcy5kZXN0aW5hdGlvblktLTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ2Rvd24nKSB7XHJcblx0XHRcdGlmICghZ2FtZS5pc1ZhY2FudCh0aGlzLm1hcElkLCB0aGlzLngsIHRoaXMueSArIDEpKSByZXR1cm47XHJcblx0XHRcdHRoaXMuZGVzdGluYXRpb25ZKys7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0c3dpdGNoICh1dGlsLnJhbmRvbUludCgwLCAzICsgdGhpcy5sYXppbmVzcykpIHtcclxuXHRcdFx0XHRjYXNlIDA6IHRoaXMubW92ZSgnbGVmdCcpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgMTogdGhpcy5tb3ZlKCdyaWdodCcpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgMjogdGhpcy5tb3ZlKCd1cCcpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgMzogdGhpcy5tb3ZlKCdkb3duJyk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0ZGVmYXVsdDogLy8gRG9uJ3QgTW92ZVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBTZXQgbW92ZSBzcGVlZFxyXG5cdFx0aWYgKHRoaXMuaXNSdW5uaW5nKSB7XHJcblx0XHRcdGlmICh0aGlzLmVuZXJneSA+IDApIHtcclxuXHRcdFx0XHR0aGlzLmVuZXJneS0tO1xyXG5cdFx0XHRcdHRoaXMubW92ZVNwZWVkID0gNDtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHR0aGlzLmVuZXJneSA9IDA7XHJcblx0XHRcdFx0dGhpcy5tb3ZlU3BlZWQgPSAyLjU7XHJcblx0XHRcdFx0dGhpcy5pc1J1bm5pbmcgPSBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHRoaXMubW92ZVNwZWVkID0gMi41O1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR0aGlzLmlzTW92aW5nID0gdHJ1ZTtcclxuXHR9XHJcblx0XHJcblx0bW92ZVRvVGFyZ2V0KHRhcmdldCwgaG9zdGlsZSkge1xyXG5cdFx0aWYgKCF0YXJnZXQpIHJldHVybjtcclxuXHRcdFxyXG5cdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggJiYgdGFyZ2V0LnkgPT09IHRoaXMueSkge1xyXG5cdFx0XHR0aGlzLm1vdmUoKTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKHV0aWwucmFuZG9tSW50KDAsIDEpID09PSAwKSB7XHJcblx0XHRcdGlmICh0YXJnZXQueCA8IHRoaXMueCkge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQueCA+PSAodGhpcy54IC0gdGhpcy5yYW5nZSkgJiYgdGFyZ2V0LnkgPT09IHRoaXMueSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUgJiYgIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnbGVmdCc7XHJcblx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCdsZWZ0Jyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCdsZWZ0Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHRhcmdldC54ID4gdGhpcy54KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggKyB0aGlzLnJhbmdlICYmIHRhcmdldC55ID09PSB0aGlzLnkpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlICYmICF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ3JpZ2h0JztcclxuXHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ3JpZ2h0Jyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCdyaWdodCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICh0YXJnZXQueSA8IHRoaXMueSkge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICYmIHRhcmdldC55ID09PSB0aGlzLnkgLSB0aGlzLnJhbmdlKSB7XHJcblx0XHRcdFx0XHRpZiAoaG9zdGlsZSAmJiAhdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICd1cCc7XHJcblx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCd1cCcpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSgndXAnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodGFyZ2V0LnkgPiB0aGlzLnkpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LnggPT09IHRoaXMueCAmJiB0YXJnZXQueSA9PT0gdGhpcy55ICsgdGhpcy5yYW5nZSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUgJiYgIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnZG93bic7XHJcblx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCdkb3duJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCdkb3duJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0aWYgKHRhcmdldC55ID4gdGhpcy55KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggJiYgdGFyZ2V0LnkgPT09IHRoaXMueSArIHRoaXMucmFuZ2UpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlICYmICF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ2Rvd24nO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmF0dGFjaygnZG93bicpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSgnZG93bicpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICh0YXJnZXQueSA8IHRoaXMueSkge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICYmIHRhcmdldC55ID09PSB0aGlzLnkgLSB0aGlzLnJhbmdlKSB7XHJcblx0XHRcdFx0XHRpZiAoaG9zdGlsZSAmJiAhdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICd1cCc7XHJcblx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCd1cCcpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSgndXAnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodGFyZ2V0LnggPiB0aGlzLngpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LnggPT09IHRoaXMueCArIHRoaXMucmFuZ2UgJiYgdGFyZ2V0LnkgPT09IHRoaXMueSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUgJiYgIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAncmlnaHQnO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmF0dGFjaygncmlnaHQnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ3JpZ2h0Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHRhcmdldC54IDwgdGhpcy54KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID49ICh0aGlzLnggLSB0aGlzLnJhbmdlKSAmJiB0YXJnZXQueSA9PT0gdGhpcy55KSB7XHJcblx0XHRcdFx0XHRpZiAoaG9zdGlsZSAmJiAhdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdsZWZ0JztcclxuXHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ2xlZnQnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ2xlZnQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0Ly8gQ29tYmF0XHJcblx0Y2hlY2tJblJhbmdlKGRpcmVjdGlvbiwgdGFyZ2V0LCByYW5nZSkge1xyXG5cdFx0aWYgKHRhcmdldC5tYXBJZCAhPT0gdGhpcy5tYXBJZCkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggJiYgdGFyZ2V0LnkgPT09IHRoaXMueSkgcmV0dXJuIGZhbHNlO1x0Ly8gU3RhY2tlZCBkb2VzIG5vdCBjb3VudCBhcyBpbiByYW5nZVxyXG5cdFx0XHJcblx0XHRpZiAodGFyZ2V0LnkgPT09IHRoaXMueSkge1xyXG5cdFx0XHRpZiAoZGlyZWN0aW9uID09PSAnbGVmdCcpIHtcclxuXHRcdFx0XHRpZiAodGhpcy54ID09PSAwKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0cmV0dXJuICh0YXJnZXQueCA8IHRoaXMueCAmJiB0YXJnZXQueCA+PSAodGhpcy54IC0gcmFuZ2UpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAoZGlyZWN0aW9uID09PSAncmlnaHQnKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMueCA9PT0gY29uZmlnLk1BUF9DT0xVTU5TIC0gMSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHJldHVybiAodGFyZ2V0LnggPiB0aGlzLnggJiYgdGFyZ2V0LnggPD0gKHRoaXMueCArIHJhbmdlKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmICh0YXJnZXQueCA9PT0gdGhpcy54KSB7XHJcblx0XHRcdGlmIChkaXJlY3Rpb24gPT09ICd1cCcpIHtcclxuXHRcdFx0XHRpZiAodGhpcy55ID09PSAwKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0cmV0dXJuICh0YXJnZXQueSA8IHRoaXMueSAmJiB0YXJnZXQueSA+PSAodGhpcy55IC0gcmFuZ2UpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAoZGlyZWN0aW9uID09PSAnZG93bicpIHtcclxuXHRcdFx0XHRpZiAodGhpcy55ID09PSBjb25maWcuTUFQX1JPV1MgLSAxKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0cmV0dXJuICh0YXJnZXQueSA+IHRoaXMueSAmJiB0YXJnZXQueSA8PSAodGhpcy55ICsgcmFuZ2UpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0YXR0YWNrKG51bVRhcmdldHMgPSAxLCBkaXJlY3Rpb24gPSB0aGlzLmRpcmVjdGlvbikge1xyXG5cdFx0aWYgKHRoaXMuaXNBdHRhY2tpbmcgfHwgdGhpcy5hdHRhY2tUaW1lciA+IDApIHJldHVybjtcclxuXHJcblx0XHR0aGlzLmlzQXR0YWNraW5nID0gdHJ1ZTtcclxuXHRcdFxyXG5cdFx0Y29uc3QgcGxheWVyTGlzdCA9IGdhbWUucGxheWVycy5maWx0ZXIocGxheWVyID0+IHBsYXllci5tYXBJZCA9PT0gdGhpcy5tYXBJZCk7XHJcblx0XHRjb25zdCBib3RMaXN0ID0gZ2FtZS5ib3RzLmZpbHRlcihib3QgPT4gYm90Lm1hcElkID09PSB0aGlzLm1hcElkKTtcclxuXHRcdGNvbnN0IGFjdG9yTGlzdCA9IHBsYXllckxpc3QuY29uY2F0KGJvdExpc3QpO1xyXG5cdFx0bGV0IHRhcmdldExpc3QgPSBhY3Rvckxpc3QuZmlsdGVyKGFjdG9yID0+IHtcclxuXHRcdFx0cmV0dXJuIGFjdG9yICE9PSB0aGlzICYmICFhY3Rvci5pc0RlYWQgJiYgdGhpcy5jaGVja0luUmFuZ2UoZGlyZWN0aW9uLCBhY3RvciwgdGhpcy5yYW5nZSk7XHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdFx0dGFyZ2V0TGlzdC5zb3J0KChhLCBiKSA9PiB7XHJcblx0XHRcdHJldHVybiAoYS56IC0gYi56KTtcdC8vIExvd2VzdCB0byBoaWdoZXN0XHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdFx0dGFyZ2V0TGlzdCA9IHRhcmdldExpc3Quc3BsaWNlKC1udW1UYXJnZXRzKTtcclxuXHRcdFxyXG5cdFx0dGFyZ2V0TGlzdC5mb3JFYWNoKCh0YXJnZXQpID0+IHtcclxuXHRcdFx0dGFyZ2V0LnRha2VEYW1hZ2UodGhpcy5kYW1hZ2UsIHRoaXMpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdFxyXG5cdHRha2VEYW1hZ2UoZGFtYWdlLCBhdHRhY2tlcikge1xyXG5cdFx0ZGFtYWdlIC09IHRoaXMuZGVmZW5jZTtcclxuXHRcdGlmIChkYW1hZ2UgPCAwKSBkYW1hZ2UgPSAwO1xyXG5cdFx0Z2FtZS5zcGF3bkRhbWFnZVRleHQodGhpcy5tYXBJZCwgdGhpcy54LCB0aGlzLnksIGRhbWFnZSk7XHJcblx0XHRpZiAoZGFtYWdlID09PSAwKSByZXR1cm47XHJcblx0XHRcclxuXHRcdHRoaXMuaGVhbHRoIC09IGRhbWFnZTtcclxuXHRcdGlmICh0aGlzLmhlYWx0aCA8PSAwKSB7XHJcblx0XHRcdHRoaXMuc2V0RGVhZCgpO1xyXG5cdFx0XHRcclxuXHRcdFx0aWYgKCFhdHRhY2tlcikge1xyXG5cdFx0XHRcdGdhbWUuc2VuZEdhbWVJbmZvR2xvYmFsKHRoaXMubmFtZSArIFwiIGhhcyBkaWVkIVwiKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGF0dGFja2VyLmtpbGxzKys7XHJcblx0XHRcdGlmIChhdHRhY2tlci50YXJnZXQgPT09IHRoaXMpIGF0dGFja2VyLnRhcmdldCA9IG51bGw7XHJcblx0XHRcdGlmIChhdHRhY2tlci5wbGF5ZXJJZCkge1xyXG5cdFx0XHRcdGdhbWUuc2VuZEdhbWVJbmZvR2xvYmFsKGF0dGFja2VyLm5hbWUgKyBcIiBoYXMgbXVyZGVyZWQgXCIgKyB0aGlzLm5hbWUgKyBcIiBpbiBjb2xkIGJsb29kIVwiKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRnYW1lLnNlbmRHYW1lSW5mb0dsb2JhbCh0aGlzLm5hbWUgKyBcIiBoYXMgYmVlbiBraWxsZWQgYnkgXCIgKyBhdHRhY2tlci5uYW1lICsgXCIhXCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVx0XHJcblxyXG5cdHNldERlYWQoKSB7XHJcblx0XHRjb25zdCBtYXAgPSBnYW1lLm1hcHNbdGhpcy5tYXBJZF07XHJcblx0XHRjb25zdCBpbnZlbnRvcnkgPSB0aGlzLmdldEludmVudG9yeSgpO1xyXG5cclxuXHRcdC8vIEludmVudG9yeSBJdGVtIERyb3AgQ2hhbmNlXHJcblx0XHRjb25zdCBkcm9wQ2hhbmNlID0gdXRpbC5jbGFtcChtYXAuZHJvcENoYW5jZSwgMCwgMTAwKTtcclxuXHRcdGlmIChkcm9wQ2hhbmNlID4gMCkge1xyXG5cdFx0XHRjb25zdCBpdGVtcyA9IGludmVudG9yeS5maWx0ZXIoaXRlbSA9PiB7XHJcblx0XHRcdFx0cmV0dXJuIGl0ZW0uc2xvdCA8IGNvbmZpZy5JTlZFTlRPUllfU0laRTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRpdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xyXG5cdFx0XHRcdGlmIChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDEpIDw9IGRyb3BDaGFuY2UpIHtcclxuXHRcdFx0XHRcdGl0ZW0ubW92ZVRvTWFwKHRoaXMubWFwSWQsIHRoaXMueCwgdGhpcy55KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0XHR0aGlzLmNhbGNCb251c1N0YXRzKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gRXF1aXBwZWQgSXRlbSBEcm9wIEFtb3VudFxyXG5cdFx0Y29uc3QgZHJvcEFtb3VudEVRID0gdXRpbC5jbGFtcChtYXAuZHJvcEFtb3VudEVRLCAwLCBjb25maWcuRVFVSVBNRU5UX1NJWkUpO1xyXG5cdFx0aWYgKGRyb3BBbW91bnRFUSA+IDApIHtcclxuXHRcdFx0bGV0IGVxdWlwbWVudCA9IGludmVudG9yeS5maWx0ZXIoaXRlbSA9PiB7XHJcblx0XHRcdFx0cmV0dXJuIGl0ZW0uc2xvdCA+PSBjb25maWcuSU5WRU5UT1JZX1NJWkU7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0ZXF1aXBtZW50ID0gdXRpbC5zaHVmZmxlKGVxdWlwbWVudCk7XHJcblx0XHRcdGVxdWlwbWVudC5zcGxpY2UoLWRyb3BBbW91bnRFUSk7XHJcblx0XHRcdGVxdWlwbWVudC5mb3JFYWNoKGl0ZW0gPT4ge1xyXG5cdFx0XHRcdGl0ZW0ubW92ZVRvTWFwKHRoaXMubWFwSWQsIHRoaXMueCwgdGhpcy55KTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdHRoaXMuY2FsY0JvbnVzU3RhdHMoKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0Ly8gSW52ZW50b3J5XHJcblx0cGlja1VwKCkge1xyXG5cdFx0Y29uc3QgbWFwSXRlbXMgPSBnYW1lLml0ZW1zLmZpbHRlcihpdGVtID0+IHtcclxuXHRcdFx0cmV0dXJuIGl0ZW0ubWFwSWQgPT09IHRoaXMubWFwSWQgJiYgaXRlbS54ID09PSB0aGlzLnggJiYgaXRlbS55ID09PSB0aGlzLnk7XHJcblx0XHR9KTtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbWFwSXRlbXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgaXRlbSA9IG1hcEl0ZW1zW2ldO1xyXG5cdFx0XHRpZiAoIWl0ZW0pIGNvbnRpbnVlO1xyXG5cdFx0XHRcclxuXHRcdFx0aWYgKGl0ZW0uc3RhY2thYmxlKSB7XHJcblx0XHRcdFx0Y29uc3QgaW52ZW50b3J5ID0gdGhpcy5nZXRJbnZlbnRvcnkoKTtcclxuXHRcdFx0XHRpZiAoaW52ZW50b3J5Lmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdGNvbnN0IHNhbWVJdGVtcyA9IGludmVudG9yeS5maWx0ZXIoaW52ZW50b3J5SXRlbSA9PiB7XHJcblx0XHRcdFx0XHRcdHJldHVybiBpbnZlbnRvcnlJdGVtLnRlbXBsYXRlSWQgPT09IGl0ZW0udGVtcGxhdGVJZDtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0aWYgKHNhbWVJdGVtcy5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdHNhbWVJdGVtc1swXS5zdGFjayArPSBpdGVtLnN0YWNrO1xyXG5cdFx0XHRcdFx0XHRpdGVtLnJlbW92ZSgpO1xyXG5cdFx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbnN0IHNsb3QgPSB0aGlzLmZpbmRGaXJzdEVtcHR5U2xvdCgpO1xyXG5cdFx0XHRpZiAoc2xvdCA9PSBudWxsKSByZXR1cm4gZmFsc2U7XHJcblxyXG5cdFx0XHRpdGVtLm1vdmVUb0ludmVudG9yeSh0aGlzLnBsYXllcklkLCB0aGlzLmJvdElkLCBzbG90KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGdldEludmVudG9yeSgpIHtcclxuXHRcdC8vIFNlZSBQbGF5ZXIgYW5kIEJvdCBjbGFzc2VzXHJcblx0fVxyXG5cclxuXHRnZXRJdGVtKHNsb3QpIHtcclxuXHRcdGNvbnN0IGludmVudG9yeSA9IHRoaXMuZ2V0SW52ZW50b3J5KCk7XHJcblx0XHRjb25zdCBpdGVtcyA9IGludmVudG9yeS5maWx0ZXIoaXRlbSA9PiB7XHJcblx0XHRcdHJldHVybiBpdGVtLnNsb3QgPT09IHNsb3Q7XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBpdGVtc1swXTtcclxuXHR9XHJcblxyXG5cdGhhc0l0ZW0odGVtcGxhdGVJZCkge1xyXG5cdFx0Y29uc3QgaW52ZW50b3J5ID0gdGhpcy5nZXRJbnZlbnRvcnkoKTtcclxuXHRcdGNvbnN0IGl0ZW1zID0gZ2FtZS5pdGVtcy5maWx0ZXIoaXRlbSA9PiB7XHJcblx0XHRcdHJldHVybiBpdGVtLnRlbXBsYXRlSWQgPT09IHRlbXBsYXRlSWQ7XHJcblx0XHR9KTtcclxuXHRcdGlmIChpdGVtc1swXS5zdGFja2FibGUpIHtcclxuXHRcdFx0cmV0dXJuIGl0ZW1zWzBdLnN0YWNrO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHJldHVybiBpdGVtcy5sZW5ndGg7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRmaW5kSXRlbVNsb3QodGVtcGxhdGVJZCkge1xyXG5cdFx0Y29uc3QgaW52ZW50b3J5ID0gdGhpcy5nZXRJbnZlbnRvcnkoKTtcclxuXHRcdGNvbnN0IGl0ZW1zID0gaW52ZW50b3J5LmZpbHRlcihpdGVtID0+IHtcclxuXHRcdFx0cmV0dXJuIGl0ZW0udGVtcGxhdGVJZCA9PT0gdGVtcGxhdGVJZDtcclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIGl0ZW1zWzBdLnNsb3Q7XHJcblx0fVxyXG5cclxuXHRmaW5kRmlyc3RFbXB0eVNsb3QoKSB7XHJcblx0XHRjb25zdCBpbnZlbnRvcnkgPSB0aGlzLmdldEludmVudG9yeSgpO1xyXG5cclxuXHRcdGZvciAobGV0IHNsb3QgPSAwOyBzbG90IDwgY29uZmlnLklOVkVOVE9SWV9TSVpFOyBzbG90KyspIHtcclxuXHRcdFx0bGV0IG9jY3VwaWVkID0gZmFsc2U7XHJcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgaW52ZW50b3J5Lmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0aWYgKGludmVudG9yeVtpXS5zbG90ID09PSBzbG90KSB7XHJcblx0XHRcdFx0XHRvY2N1cGllZCA9IHRydWU7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCFvY2N1cGllZCkgcmV0dXJuIHNsb3Q7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9XHJcblxyXG5cdHVzZUl0ZW0oc2xvdCkge1xyXG5cdFx0Y29uc3QgaXRlbSA9IHRoaXMuZ2V0SXRlbShzbG90KTtcclxuXHRcdGlmICghaXRlbSkgcmV0dXJuO1xyXG5cclxuXHRcdC8vIFRPRE86IGlmICghdXNlU2NyaXB0KCkpIHJldHVybjtcclxuXHJcblx0XHRpZiAoaXRlbS5pc0VxdWlwbWVudCgpKSB7XHJcblx0XHRcdGlmIChpdGVtLnNsb3QgPCBjb25maWcuSU5WRU5UT1JZX1NJWkUpIHtcdC8vIENoZWNrIGlmIGl0ZW0gaXMgZXF1aXBwZWRcclxuXHRcdFx0XHR0aGlzLmVxdWlwSXRlbShpdGVtKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0dGhpcy51bmVxdWlwSXRlbShpdGVtKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghaXRlbS5yZXVzYWJsZSkgaXRlbS5yZW1vdmVPbmUoKTtcclxuXHR9XHJcblxyXG5cdGRyb3BJdGVtKHNsb3QpIHtcclxuXHRcdGNvbnN0IGl0ZW0gPSB0aGlzLmdldEl0ZW0oc2xvdCk7XHJcblx0XHRpZiAoIWl0ZW0pIHJldHVybjtcclxuXHRcdGl0ZW0ubW92ZVRvTWFwKHRoaXMubWFwSWQsIHRoaXMueCwgdGhpcy55KTtcclxuXHRcdHRoaXMuY2FsY0JvbnVzU3RhdHMoKTtcclxuXHR9XHJcblxyXG5cdG1vdmVJdGVtVG9TbG90KHNsb3QsIG5ld1Nsb3QpIHtcclxuXHRcdGlmIChzbG90ID09IG51bGwgfHwgbmV3U2xvdCA9PSBudWxsIHx8IHNsb3QgPT09IG5ld1Nsb3QpIHJldHVybjtcdC8vIG51bGwgPT0gdW5kZWZpbmVkLCBudWxsICE9IDBcclxuXHRcdGlmIChzbG90ID49IGNvbmZpZy5JTlZFTlRPUllfU0laRSArIGNvbmZpZy5FUVVJUE1FTlRfU0laRSkgcmV0dXJuO1xyXG5cdFx0aWYgKG5ld1Nsb3QgPj0gY29uZmlnLklOVkVOVE9SWV9TSVpFICsgY29uZmlnLkVRVUlQTUVOVF9TSVpFKSByZXR1cm47XHJcblxyXG5cdFx0Y29uc3QgaXRlbSA9IHRoaXMuZ2V0SXRlbShzbG90KTtcclxuXHRcdGNvbnN0IG5ld0l0ZW0gPSB0aGlzLmdldEl0ZW0obmV3U2xvdCk7XHJcblx0XHRpZiAoIWl0ZW0pIHJldHVybjtcclxuXHJcblx0XHQvLyBUYXJnZXQgc2xvdCBpcyBmb3IgZXF1aXBtZW50IC0gY2hlY2sgdHlwZSBtYXRjaGVzXHJcblx0XHRpZiAobmV3U2xvdCA+PSBjb25maWcuSU5WRU5UT1JZX1NJWkUpIHtcclxuXHRcdFx0aWYgKGl0ZW0uZXF1aXBwZWRTbG90ICsgY29uZmlnLklOVkVOVE9SWV9TSVpFICE9PSBuZXdTbG90KSB7XHJcblx0XHRcdFx0Z2FtZS5zZW5kR2FtZUluZm9QbGF5ZXIodGhpcy5pZCwgXCJUaGF0IGNhbm5vdCBiZSBlcXVpcHBlZCB0aGVyZS5cIik7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3Qgc3dhcFNsb3RzID0gKCkgPT4ge1xyXG5cdFx0XHRpdGVtLnNsb3QgPSBuZXdTbG90O1xyXG5cdFx0XHRpZiAobmV3SXRlbSkgbmV3SXRlbS5zbG90ID0gc2xvdDtcclxuXHRcdFx0dGhpcy5jYWxjQm9udXNTdGF0cygpO1xyXG5cdFx0fTtcclxuXHJcblx0XHQvLyBJRiBObyBuZXcgaXRlbSBpbiBuZXcgc2xvdFxyXG5cdFx0Ly8gT1IgTmV3IGl0ZW0gaW4gbmV3IHNsb3QsIG9sZCBpdGVtIGluIGludmVudG9yeVxyXG5cdFx0Ly8gT1IgTmV3IGl0ZW0gaW4gbmV3IHNsb3QsIG9sZCBpdGVtIGlzIGVxdWlwcGVkLCBuZXcgaXRlbSBjYW4gYmUgZXF1aXBwZWQgaW4gb2xkIHNsb3RcclxuXHRcdGlmICghbmV3SXRlbSB8fCBzbG90IDwgY29uZmlnLklOVkVOVE9SWV9TSVpFIHx8IG5ld0l0ZW0uZXF1aXBwZWRTbG90ICsgY29uZmlnLklOVkVOVE9SWV9TSVpFID09PSBzbG90KSB7XHJcblx0XHRcdHN3YXBTbG90cygpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdC8vIE9sZCBpdGVtIGlzIGVxdWlwcGVkLCBuZXcgaXRlbSBjYW5ub3QgYmUgZXF1aXBwZWQgaW4gb2xkIHNsb3RcclxuXHRcdFx0bmV3U2xvdCA9IHRoaXMuZmluZEZpcnN0RW1wdHlTbG90KCk7XHJcblx0XHRcdGlmIChuZXdTbG90ICE9IG51bGwpIHtcclxuXHRcdFx0XHRzd2FwU2xvdHMoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRnYW1lLnNlbmRHYW1lSW5mb1BsYXllcih0aGlzLmlkLCBcIllvdXIgaW52ZW50b3J5IGlzIGZ1bGwuXCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRlcXVpcEl0ZW0oaXRlbSkge1xyXG5cdFx0Y29uc3QgZXF1aXBwZWRJdGVtID0gdGhpcy5nZXRJdGVtKGl0ZW0uZXF1aXBwZWRTbG90ICsgY29uZmlnLklOVkVOVE9SWV9TSVpFKTtcclxuXHRcdGl0ZW0uc2xvdCA9IGl0ZW0uZXF1aXBwZWRTbG90ICsgY29uZmlnLklOVkVOVE9SWV9TSVpFO1xyXG5cdFx0aWYgKGVxdWlwcGVkSXRlbSkgZXF1aXBwZWRJdGVtLnNsb3QgPSB0aGlzLmZpbmRGaXJzdEVtcHR5U2xvdCgpO1xyXG5cdFx0dGhpcy5jYWxjQm9udXNTdGF0cygpO1xyXG5cdH1cclxuXHJcblx0dW5lcXVpcEl0ZW0oaXRlbSkge1xyXG5cdFx0Y29uc3QgbmV3U2xvdCA9IHRoaXMuZmluZEZpcnN0RW1wdHlTbG90KCk7XHJcblx0XHRpZiAobmV3U2xvdCA9PSBudWxsKSB7XHJcblx0XHRcdGdhbWUuc2VuZEdhbWVJbmZvUGxheWVyKHRoaXMuZ2FtZUlkLCBcIllvdXIgaW52ZW50b3J5IGlzIGZ1bGwuXCIpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRpdGVtLnNsb3QgPSBuZXdTbG90O1xyXG5cdFx0dGhpcy5jYWxjQm9udXNTdGF0cygpO1xyXG5cdH1cclxuXHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHQvLyBJbnZlbnRvcnkgSXRlbSBVcGRhdGVcclxuXHRcdGNvbnN0IGludmVudG9yeSA9IHRoaXMuZ2V0SW52ZW50b3J5KCk7XHJcblx0XHRpbnZlbnRvcnkuZm9yRWFjaChpdGVtID0+IHtcclxuXHRcdFx0aWYgKGl0ZW0pIGl0ZW0udXBkYXRlKCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRpZiAodGhpcy5pc0RlYWQpIHJldHVybjtcclxuXHRcdFxyXG5cdFx0Ly8gQXR0YWNraW5nXHJcblx0XHRpZiAodGhpcy5pc0F0dGFja2luZyB8fCB0aGlzLmF0dGFja1RpbWVyID4gMCkge1xyXG5cdFx0XHR0aGlzLmF0dGFja1RpbWVyICs9IGRlbHRhO1xyXG5cdFx0XHRpZiAodGhpcy5hdHRhY2tUaW1lciA+PSAwLjMpIHRoaXMuaXNBdHRhY2tpbmcgPSBmYWxzZTtcclxuXHRcdFx0aWYgKHRoaXMuYXR0YWNrVGltZXIgPj0gdGhpcy5hdHRhY2tTcGVlZCkgdGhpcy5hdHRhY2tUaW1lciA9IDA7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vIE1vdmVtZW50XHJcblx0XHRpZiAodGhpcy5pc01vdmluZykge1xyXG5cdFx0XHR0aGlzLmxlcnAgKz0gZGVsdGEgKiB0aGlzLm1vdmVTcGVlZDtcclxuXHRcdFx0XHJcblx0XHRcdGlmICh0aGlzLmxlcnAgPj0gMC40OSkge1xyXG5cdFx0XHRcdHRoaXMueCA9IHRoaXMuZGVzdGluYXRpb25YO1xyXG5cdFx0XHRcdHRoaXMueSA9IHRoaXMuZGVzdGluYXRpb25ZO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAodGhpcy5sZXJwID49IDAuOTkpIHtcclxuXHRcdFx0XHR0aGlzLnN0YXJ0WCA9IHRoaXMuZGVzdGluYXRpb25YO1xyXG5cdFx0XHRcdHRoaXMuc3RhcnRZID0gdGhpcy5kZXN0aW5hdGlvblk7XHJcblx0XHRcdFx0dGhpcy5sZXJwID0gMDtcclxuXHRcdFx0XHR0aGlzLmlzTW92aW5nID0gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGdldEludmVudG9yeVBhY2soKSB7XHJcblx0XHRjb25zdCBpbnZlbnRvcnlQYWNrID0gW107XHJcblx0XHRjb25zdCBpbnZlbnRvcnkgPSB0aGlzLmdldEludmVudG9yeSgpO1xyXG5cdFx0aW52ZW50b3J5LmZvckVhY2goKGl0ZW0pID0+IHtcclxuXHRcdFx0aWYgKGl0ZW0pIGludmVudG9yeVBhY2tbaXRlbS5zbG90XSA9IGl0ZW0uZ2V0UGFjaygpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIGludmVudG9yeVBhY2s7XHJcblx0fVxyXG59XHJcbiIsImltcG9ydCBnYW1lIGZyb20gJy4uL2dhbWUuanMnO1xyXG5pbXBvcnQgY29uZmlnIGZyb20gJy4uL2NvbmZpZy5qcyc7XHJcbmltcG9ydCB1dGlsIGZyb20gJy4uL3V0aWwuanMnO1xyXG5pbXBvcnQgQWN0b3IgZnJvbSAnLi9hY3Rvci5qcyc7XHJcblxyXG4vLyBBIEJvdCBpcyBhbiBBY3RvciB3aXRoIGNvbmRpdGlvbmFsIGlucHV0c1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQm90IGV4dGVuZHMgQWN0b3Ige1xyXG5cdGNvbnN0cnVjdG9yKGRhdGEpIHtcclxuXHRcdGxldCB7IF9pZCwgbWFwSWQsIHgsIHksIGRpcmVjdGlvbiwgdGVtcGxhdGUsIG5hbWUsIHNwcml0ZSwgaG9zdGlsZSxcclxuXHRcdFx0XHRcdGRhbWFnZUJhc2UsIGRlZmVuY2VCYXNlLCBoZWFsdGhNYXhCYXNlLCBlbmVyZ3lNYXhCYXNlLCByYW5nZUJhc2UgXHJcblx0XHRcdFx0fSA9IGRhdGE7XHJcblx0XHRcclxuXHRcdGlmIChfaWQgPT0gbnVsbCkgX2lkID0gZ2FtZS5yZXF1ZXN0REJJZCgpO1xyXG5cdFx0aWYgKG5hbWUgPT0gbnVsbCkgbmFtZSA9IHRlbXBsYXRlLm5hbWU7XHJcblx0XHRpZiAoc3ByaXRlID09IG51bGwpIHNwcml0ZSA9IHRlbXBsYXRlLnNwcml0ZTtcclxuXHRcdGlmIChob3N0aWxlID09IG51bGwpIGhvc3RpbGUgPSB0ZW1wbGF0ZS5ob3N0aWxlO1xyXG5cdFx0aWYgKGRhbWFnZUJhc2UgPT0gbnVsbCkgZGFtYWdlQmFzZSA9IHRlbXBsYXRlLmRhbWFnZUJhc2U7XHJcblx0XHRpZiAoZGVmZW5jZUJhc2UgPT0gbnVsbCkgZGVmZW5jZUJhc2UgPSB0ZW1wbGF0ZS5kZWZlbmNlQmFzZTtcclxuXHRcdGlmIChoZWFsdGhNYXhCYXNlID09IG51bGwpIGhlYWx0aE1heEJhc2UgPSB0ZW1wbGF0ZS5oZWFsdGhNYXhCYXNlO1xyXG5cdFx0aWYgKGVuZXJneU1heEJhc2UgPT0gbnVsbCkgZW5lcmd5TWF4QmFzZSA9IHRlbXBsYXRlLmVuZXJneU1heEJhc2U7XHJcblx0XHRpZiAocmFuZ2VCYXNlID09IG51bGwpIHJhbmdlQmFzZSA9IHRlbXBsYXRlLnJhbmdlQmFzZTtcclxuXHJcblx0XHRzdXBlcihtYXBJZCwgeCwgeSwgZGlyZWN0aW9uLCBuYW1lLCBzcHJpdGUpO1xyXG5cdFx0dGhpcy5ib3RJZCA9IF9pZDtcclxuXHRcdHRoaXMudGVtcGxhdGVJZCA9IHRlbXBsYXRlLl9pZDtcclxuXHRcdHRoaXMuZGFtYWdlQmFzZSA9IGRhbWFnZUJhc2U7XHJcblx0XHR0aGlzLmRlZmVuY2VCYXNlID0gZGVmZW5jZUJhc2U7XHJcblx0XHR0aGlzLmhlYWx0aE1heEJhc2UgPSBoZWFsdGhNYXhCYXNlO1xyXG5cdFx0dGhpcy5lbmVyZ3lNYXhCYXNlID0gZW5lcmd5TWF4QmFzZTtcclxuXHRcdHRoaXMucmFuZ2VCYXNlID0gcmFuZ2VCYXNlO1xyXG5cdFx0dGhpcy5yZXN0b3JlKCk7XHJcblx0XHRcclxuXHRcdHRoaXMuaG9zdGlsZSA9IGhvc3RpbGU7XHJcblx0XHR0aGlzLnRhcmdldCA9IG51bGw7XHJcblx0XHR0aGlzLnNldFRhc2soJ3dhbmRlcmluZycpO1xyXG5cdFx0dGhpcy5tb3ZlVGltZXIgPSAwO1xyXG5cclxuXHRcdHRoaXMuZ2FtZUlkID0gdXRpbC5maXJzdEVtcHR5SW5kZXgoZ2FtZS5ib3RzKTtcclxuXHRcdGdhbWUuYm90c1t0aGlzLmdhbWVJZF0gPSB0aGlzO1xyXG5cdH1cclxuXHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHRzdXBlci51cGRhdGUoZGVsdGEpOyBcdC8vIERlZmF1bHQgQWN0b3IgVXBkYXRlXHJcblx0XHRpZiAodGhpcy5pc0RlYWQpIHJldHVybjtcclxuXHJcblx0XHR0aGlzLm1vdmVUaW1lcisrO1xyXG5cdFx0XHJcblx0XHQvLyBBSSBJbnB1dHNcclxuXHRcdHN3aXRjaCh0aGlzLnRhc2spIHtcclxuXHRcdFx0Y2FzZSAnd2FuZGVyaW5nJzpcdFx0Ly8gTW92ZSByYW5kb21seVxyXG5cdFx0XHRcdHRoaXMubW92ZSgpO1xyXG5cdFx0XHRcdHRoaXMucGlja1VwKCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdmb2xsb3dpbmcnOlx0XHQvLyBNb3ZlIHRvd2FyZHMgdGFyZ2V0XHJcblx0XHRcdFx0aWYgKHRoaXMudGFyZ2V0KSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmVUb1RhcmdldCh0aGlzLnRhcmdldCwgZmFsc2UpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdC8vIE5vIHRhcmdldFxyXG5cdFx0XHRcdFx0dGhpcy5zZXRUYXNrKCd3YW5kZXJpbmcnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdhdHRhY2tpbmcnOlx0XHQvLyBNb3ZlIHRvd2FyZHMgdGFyZ2V0IGFuZCBhdHRhY2tcclxuXHRcdFx0XHRpZiAodGhpcy50YXJnZXQpIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZVRvVGFyZ2V0KHRoaXMudGFyZ2V0LCB0cnVlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHQvLyBObyB0YXJnZXRcclxuXHRcdFx0XHRcdHRoaXMuc2V0VGFzaygnd2FuZGVyaW5nJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Ly8gY2FzZSAnaWRsZSc6XHJcblx0XHRcdGRlZmF1bHQ6IFx0XHRcdFx0XHQvLyBTdGFuZCBzdGlsbFxyXG5cdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIHRoaXMuZ2V0UGFjaygpO1xyXG5cdH1cclxuXHRcclxuXHRnZXRQYWNrKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0Z2FtZUlkOiB0aGlzLmdhbWVJZCxcclxuXHRcdFx0bmFtZTogdGhpcy5uYW1lLFxyXG5cdFx0XHRzcHJpdGU6IHRoaXMuc3ByaXRlLFxyXG5cdFx0XHRkaXJlY3Rpb246IHRoaXMuZGlyZWN0aW9uLFxyXG5cdFx0XHRtYXBJZDogdGhpcy5tYXBJZCxcclxuXHRcdFx0eDogdGhpcy5zdGFydFgsXHJcblx0XHRcdHk6IHRoaXMuc3RhcnRZLFxyXG5cdFx0XHR6OiB0aGlzLnosXHJcblx0XHRcdGRlc3RpbmF0aW9uWDogdGhpcy5kZXN0aW5hdGlvblgsXHJcblx0XHRcdGRlc3RpbmF0aW9uWTogdGhpcy5kZXN0aW5hdGlvblksXHJcblx0XHRcdGxlcnA6IHRoaXMubGVycCxcclxuXHRcdFx0aXNSdW5uaW5nOiB0aGlzLmlzUnVubmluZyxcclxuXHRcdFx0aXNBdHRhY2tpbmc6IHRoaXMuaXNBdHRhY2tpbmcsXHJcblx0XHRcdGlzRGVhZDogZmFsc2UsXHJcblx0XHRcdGlzVmlzaWJsZTogdGhpcy5pc1Zpc2libGVcclxuXHRcdH07XHJcblx0fVxyXG5cdFxyXG5cdGdldERCUGFjaygpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGJvdElkOiB0aGlzLmJvdElkLFxyXG5cdFx0XHR0ZW1wbGF0ZUlkOiB0aGlzLnRlbXBsYXRlSWQsXHJcblx0XHRcdG1hcElkOiB0aGlzLm1hcElkLFxyXG5cdFx0XHR4OiB0aGlzLngsXHJcblx0XHRcdHk6IHRoaXMueSxcclxuXHRcdFx0ZGlyZWN0aW9uOiB0aGlzLmRpcmVjdGlvbixcclxuXHRcdFx0bmFtZTogdGhpcy5uYW1lLFxyXG5cdFx0XHRzcHJpdGU6IHRoaXMuc3ByaXRlLFxyXG5cdFx0XHRob3N0aWxlOiB0aGlzLmhvc3RpbGVcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHRyZW1vdmUoKSB7XHJcblx0XHRkZWxldGUgZ2FtZS5ib3RzW3RoaXMuZ2FtZUlkXTtcclxuXHR9XHJcblx0XHJcblx0bW92ZShkaXJlY3Rpb24pIHtcclxuXHRcdGxldCBtb3ZlVGltZSA9IDI0O1xyXG5cdFx0aWYgKHRoaXMuaXNSdW5uaW5nKSBtb3ZlVGltZSA9IDE3O1xyXG5cdFx0aWYgKHRoaXMubW92ZVRpbWVyID4gbW92ZVRpbWUgJiYgdGhpcy5hdHRhY2tUaW1lciA9PT0gMCkge1xyXG5cdFx0XHRzdXBlci5tb3ZlKGRpcmVjdGlvbik7XHJcblx0XHRcdHRoaXMubW92ZVRpbWVyID0gMDtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0dGFrZURhbWFnZShkYW1hZ2UsIGF0dGFja2VyKSB7XHJcblx0XHRpZiAoYXR0YWNrZXIgaW5zdGFuY2VvZiBBY3RvcikgdGhpcy5zZXRUYXNrKCdhdHRhY2tpbmcnLCBhdHRhY2tlcik7XHJcblx0XHRzdXBlci50YWtlRGFtYWdlKGRhbWFnZSwgYXR0YWNrZXIpO1xyXG5cdH1cclxuXHRcclxuXHRwaWNrVXAoKSB7XHJcblx0XHRzdXBlci5waWNrVXAoKTtcclxuXHRcdHRoaXMuY2hlY2tCZXN0RXF1aXBtZW50KCk7XHJcblx0fVxyXG5cclxuXHRnZXRJbnZlbnRvcnkoKSB7XHJcblx0XHRjb25zdCBpbnZlbnRvcnkgPSBnYW1lLml0ZW1zLmZpbHRlcihpdGVtID0+IHtcclxuXHRcdFx0cmV0dXJuIFwiXCIraXRlbS5ib3RJZCA9PT0gXCJcIit0aGlzLmJvdElkO1xyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gaW52ZW50b3J5O1xyXG5cdH1cclxuXHJcblx0c2V0RGVhZCgpIHtcclxuXHRcdHN1cGVyLnNldERlYWQoKTtcclxuXHRcdHRoaXMucmVtb3ZlKCk7XHJcblx0fVxyXG5cclxuXHQvLyBJbnB1dHNcclxuXHRzZXRUYXNrKHRhc2ssIHRhcmdldCkge1xyXG5cdFx0c3dpdGNoICh0YXNrKSB7XHJcblx0XHRcdGNhc2UgJ3dhbmRlcmluZyc6XHJcblx0XHRcdFx0dGhpcy5sYXppbmVzcyA9IDc7XHJcblx0XHRcdFx0dGhpcy50YXJnZXQgPSBudWxsO1xyXG5cdFx0XHRcdHRoaXMudGFzayA9IHRhc2s7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdmb2xsb3dpbmcnOlxyXG5cdFx0XHRcdGlmICh0YXJnZXQgPT09IG51bGwpIHtcclxuXHRcdFx0XHRcdHRoaXMuc2V0VGFzaygnd2FuZGVyaW5nJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5sYXppbmVzcyA9IDA7XHJcblx0XHRcdFx0XHR0aGlzLnRhcmdldCA9IHRhcmdldDtcclxuXHRcdFx0XHRcdHRoaXMudGFzayA9IHRhc2s7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnYXR0YWNraW5nJzpcclxuXHRcdFx0XHRpZiAodGFyZ2V0ID09PSBudWxsKSB7XHJcblx0XHRcdFx0XHR0aGlzLnNldFRhc2soJ3dhbmRlcmluZycpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubGF6aW5lc3MgPSAwO1xyXG5cdFx0XHRcdFx0dGhpcy50YXJnZXQgPSB0YXJnZXQ7XHJcblx0XHRcdFx0XHR0aGlzLnRhc2sgPSB0YXNrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGRlZmF1bHQ6XHQvL2lkbGluZ1xyXG5cdFx0XHRcdHRoaXMubGF6aW5lc3MgPSA3O1xyXG5cdFx0XHRcdHRoaXMudGFyZ2V0ID0gbnVsbDtcclxuXHRcdFx0XHR0aGlzLnRhc2sgPSAnaWRsZSc7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRjaGVja0Jlc3RFcXVpcG1lbnQoKSB7XHJcblx0XHRjb25zdCBpbnZlbnRvcnkgPSB0aGlzLmdldEludmVudG9yeSgpO1xyXG5cdFx0Y29uc3QgZXF1aXBtZW50ID0gW107XHJcblx0XHRmb3IgKGxldCBzbG90ID0gMDsgc2xvdCA8IGNvbmZpZy5FUVVJUE1FTlRfU0laRTsgc2xvdCsrKSB7XHJcblx0XHRcdGVxdWlwbWVudC5wdXNoKFtdKTtcclxuXHRcdH1cclxuXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGludmVudG9yeS5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRjb25zdCBpdGVtID0gaW52ZW50b3J5W2ldO1xyXG5cdFx0XHRmb3IgKGxldCBzbG90ID0gMDsgc2xvdCA8IGNvbmZpZy5FUVVJUE1FTlRfU0laRTsgc2xvdCsrKSB7XHJcblx0XHRcdFx0aWYgKGl0ZW0uZXF1aXBwZWRTbG90ID09PSBzbG90KSB7XHJcblx0XHRcdFx0XHRlcXVpcG1lbnRbc2xvdF0ucHVzaChpdGVtKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoZXF1aXBtZW50WzBdLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0ZXF1aXBtZW50WzBdLnNvcnQoKGEsIGIpID0+IGIuZXF1aXBwZWQuZGFtYWdlIC0gYS5lcXVpcHBlZC5kYW1hZ2UpO1xyXG5cdFx0XHR0aGlzLmVxdWlwSXRlbShlcXVpcG1lbnRbMF1bMF0pO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGVxdWlwbWVudFsxXS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdGVxdWlwbWVudFsxXS5zb3J0KChhLCBiKSA9PiBiLmVxdWlwcGVkLmRlZmVuY2UgLSBhLmVxdWlwcGVkLmRlZmVuY2UpO1xyXG5cdFx0XHR0aGlzLmVxdWlwSXRlbShlcXVpcG1lbnRbMV1bMF0pO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGVxdWlwbWVudFsyXS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdGVxdWlwbWVudFsyXS5zb3J0KChhLCBiKSA9PiBiLmVxdWlwcGVkLmRlZmVuY2UgLSBhLmVxdWlwcGVkLmRlZmVuY2UpO1xyXG5cdFx0XHR0aGlzLmVxdWlwSXRlbShlcXVpcG1lbnRbMl1bMF0pO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGVxdWlwbWVudFszXS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdGVxdWlwbWVudFszXS5zb3J0KChhLCBiKSA9PiBiLmVxdWlwcGVkLmRlZmVuY2UgLSBhLmVxdWlwcGVkLmRlZmVuY2UpO1xyXG5cdFx0XHR0aGlzLmVxdWlwSXRlbShlcXVpcG1lbnRbM11bMF0pO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGVxdWlwbWVudFs0XS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdGVxdWlwbWVudFs0XS5zb3J0KChhLCBiKSA9PiBiLmVxdWlwcGVkLmRlZmVuY2UgLSBhLmVxdWlwcGVkLmRlZmVuY2UpO1xyXG5cdFx0XHR0aGlzLmVxdWlwSXRlbShlcXVpcG1lbnRbNF1bMF0pO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG4iLCJpbXBvcnQgRW50aXR5IGZyb20gJy4vZW50aXR5LmpzJztcclxuaW1wb3J0IGdhbWUgZnJvbSAnLi4vZ2FtZS5qcyc7XHJcbmltcG9ydCBjb25maWcgZnJvbSAnLi4vY29uZmlnLmpzJztcclxuaW1wb3J0IHV0aWwgZnJvbSAnLi4vdXRpbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFZmZlY3QgZXh0ZW5kcyBFbnRpdHkge1xyXG5cdGNvbnN0cnVjdG9yKG1hcElkLCB4LCB5LCBzcHJpdGUgPSAwLCBsb29wID0gMCwgc3BlZWQgPSAxMiwgbWF4RnJhbWUgPSA3LCBzdGFydEZyYW1lID0gMCkge1xyXG5cdFx0c3VwZXIobWFwSWQsIHgsIHksIHV0aWwuY2xhbXAoc3ByaXRlLCAwLCBjb25maWcuTUFYX0VGRkVDVFMgLSAxKSk7XHJcblx0XHR0aGlzLm1heEZyYW1lID0gdXRpbC5jbGFtcChtYXhGcmFtZSwgMCwgNyk7XHJcblx0XHR0aGlzLnN0YXJ0RnJhbWUgPSB1dGlsLmNsYW1wKHN0YXJ0RnJhbWUsIDAsIHRoaXMubWF4RnJhbWUpO1xyXG5cdFx0dGhpcy5jdXJyZW50RnJhbWUgPSB0aGlzLnN0YXJ0RnJhbWU7XHJcblx0XHRcclxuXHRcdHRoaXMubG9vcCA9IGxvb3A7XHJcblx0XHR0aGlzLnNwZWVkID0gc3BlZWQ7XHJcblx0XHR0aGlzLnRpbWVyID0gMDtcclxuXHRcdFxyXG5cdFx0dGhpcy5nYW1lSWQgPSB1dGlsLmZpcnN0RW1wdHlJbmRleChnYW1lLmVmZmVjdHMpO1xyXG5cdFx0Z2FtZS5lZmZlY3RzW3RoaXMuZ2FtZUlkXSA9IHRoaXM7XHJcblx0fVxyXG5cdFxyXG5cdHVwZGF0ZShkZWx0YSkge1xyXG5cdFx0dGhpcy50aW1lciArPSBkZWx0YTtcclxuXHRcdFxyXG5cdFx0aWYgKHRoaXMudGltZXIgPj0gMSAvIHRoaXMuc3BlZWQpIHtcclxuXHRcdFx0dGhpcy50aW1lciA9IDA7XHJcblx0XHRcdHRoaXMuY3VycmVudEZyYW1lKys7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5jdXJyZW50RnJhbWUgPiB0aGlzLm1heEZyYW1lKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMubG9vcCA8IDApIHtcclxuXHRcdFx0XHRcdHRoaXMuY3VycmVudEZyYW1lID0gdGhpcy5zdGFydEZyYW1lO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIGlmICh0aGlzLmxvb3AgPiAwKSB7XHJcblx0XHRcdFx0XHR0aGlzLmN1cnJlbnRGcmFtZSA9IHRoaXMuc3RhcnRGcmFtZTtcclxuXHRcdFx0XHRcdHRoaXMubG9vcC0tO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMuY3VycmVudEZyYW1lID0gdGhpcy5tYXhGcmFtZTtcclxuXHRcdFx0XHRcdHRoaXMucmVtb3ZlKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuZ2V0UGFjaygpO1xyXG5cdH1cclxuXHRcclxuXHRnZXRQYWNrKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0Z2FtZUlkOiB0aGlzLmdhbWVJZCxcclxuXHRcdFx0bWFwSWQ6IHRoaXMubWFwSWQsXHJcblx0XHRcdHg6IHRoaXMueCxcclxuXHRcdFx0eTogdGhpcy55LFxyXG5cdFx0XHRzcHJpdGU6IHRoaXMuc3ByaXRlLFxyXG5cdFx0XHRjdXJyZW50RnJhbWU6IHRoaXMuY3VycmVudEZyYW1lXHJcblx0XHR9O1xyXG5cdH1cclxuXHRcclxuXHRyZW1vdmUoKSB7XHJcblx0XHRkZWxldGUgZ2FtZS5lZmZlY3RzW3RoaXMuZ2FtZUlkXTtcclxuXHR9XHRcclxufVxyXG4iLCJpbXBvcnQgY29uZmlnIGZyb20gJy4uL2NvbmZpZy5qcyc7XHJcblxyXG4vLyBBbiBFbnRpdHkgaXMgYW55IG9iamVjdCB3aGljaCBjYW4gYXBwZWFyIG9uIHRoZSBtYXBcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVudGl0eSB7XHJcblx0Y29uc3RydWN0b3IobWFwSWQsIHgsIHksIHNwcml0ZSA9IDEpIHtcclxuXHRcdHRoaXMubWFwSWQgPSBtYXBJZDtcclxuXHRcdHRoaXMueCA9IHg7XHJcblx0XHR0aGlzLnkgPSB5O1xyXG5cdFx0aWYgKHNwcml0ZSA8IDEpIHNwcml0ZSA9IDE7XHJcblx0XHR0aGlzLnNwcml0ZSA9IHNwcml0ZTtcclxuXHRcdHRoaXMuaXNWaXNpYmxlID0gdHJ1ZTtcclxuXHR9XHJcbn1cclxuIiwiaW1wb3J0IGdhbWUgZnJvbSAnLi4vZ2FtZS5qcyc7XHJcbmltcG9ydCB1dGlsIGZyb20gJy4uL3V0aWwuanMnO1xyXG5pbXBvcnQgRW50aXR5IGZyb20gJy4vZW50aXR5LmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEl0ZW0gZXh0ZW5kcyBFbnRpdHkge1xyXG5cdGNvbnN0cnVjdG9yKGRhdGEpIHtcclxuXHRcdGlmICghZGF0YSkgcmV0dXJuO1xyXG5cclxuXHRcdGxldCB7IF9pZCwgcGxheWVySWQsIGJvdElkLCBzbG90LCBtYXBJZCwgeCwgeSwgdGVtcGxhdGUsIHN0YWNrLCBzcHJpdGUsIG5hbWUsIGRlc2NyaXB0aW9uLCByZXVzYWJsZSwgY3JlYXRlZEJ5LCBjcmVhdGVkRGF0ZSxcclxuXHRcdFx0XHRcdHBhc3NpdmVEYW1hZ2UsIHBhc3NpdmVEZWZlbmNlLCBwYXNzaXZlSGVhbHRoTWF4LCBwYXNzaXZlRW5lcmd5TWF4LCBwYXNzaXZlUmFuZ2UsXHJcblx0XHRcdFx0XHRlcXVpcHBlZERhbWFnZSwgZXF1aXBwZWREZWZlbmNlLCBlcXVpcHBlZEhlYWx0aE1heCwgZXF1aXBwZWRFbmVyZ3lNYXgsIGVxdWlwcGVkUmFuZ2VcclxuXHRcdFx0XHR9ID0gZGF0YTtcclxuXHJcblx0XHRpZiAoX2lkID09IG51bGwpIF9pZCA9IGdhbWUucmVxdWVzdERCSWQoKTtcclxuXHRcdGlmIChwbGF5ZXJJZCA9PT0gdW5kZWZpbmVkKSBwbGF5ZXJJZCA9IG51bGw7XHJcblx0XHRpZiAoYm90SWQgPT09IHVuZGVmaW5lZCkgYm90SWQgPSBudWxsO1xyXG5cdFx0aWYgKHNsb3QgPT09IHVuZGVmaW5lZCkgc2xvdCA9IG51bGw7XHJcblx0XHRpZiAobWFwSWQgPT09IHVuZGVmaW5lZCkgbWFwSWQgPSBudWxsO1xyXG5cdFx0aWYgKHggPT09IHVuZGVmaW5lZCkgeCA9IG51bGw7XHJcblx0XHRpZiAoeSA9PT0gdW5kZWZpbmVkKSB5ID0gbnVsbDtcclxuXHRcdGlmIChjcmVhdGVkQnkgPT09IHVuZGVmaW5lZCkgY3JlYXRlZEJ5ID0gbnVsbDtcclxuXHRcdGlmIChjcmVhdGVkRGF0ZSA9PT0gdW5kZWZpbmVkKSBjcmVhdGVkRGF0ZSA9IG5ldyBEYXRlKCk7XHJcblxyXG5cdFx0aWYgKHNwcml0ZSA9PT0gdW5kZWZpbmVkKSBzcHJpdGUgPSB0ZW1wbGF0ZS5zcHJpdGU7XHJcblx0XHRpZiAobmFtZSA9PT0gdW5kZWZpbmVkKSBuYW1lID0gdGVtcGxhdGUubmFtZTtcclxuXHRcdGlmIChkZXNjcmlwdGlvbiA9PT0gdW5kZWZpbmVkKSBkZXNjcmlwdGlvbiA9IHRlbXBsYXRlLmRlc2NyaXB0aW9uO1xyXG5cdFx0aWYgKHJldXNhYmxlID09PSB1bmRlZmluZWQpIHJldXNhYmxlID0gdGVtcGxhdGUucmV1c2FibGU7XHJcblx0XHRpZiAocGFzc2l2ZURhbWFnZSA9PT0gdW5kZWZpbmVkKSBwYXNzaXZlRGFtYWdlID0gdGVtcGxhdGUucGFzc2l2ZURhbWFnZTtcclxuXHRcdGlmIChwYXNzaXZlRGVmZW5jZSA9PT0gdW5kZWZpbmVkKSBwYXNzaXZlRGVmZW5jZSA9IHRlbXBsYXRlLnBhc3NpdmVEZWZlbmNlO1xyXG5cdFx0aWYgKHBhc3NpdmVIZWFsdGhNYXggPT09IHVuZGVmaW5lZCkgcGFzc2l2ZUhlYWx0aE1heCA9IHRlbXBsYXRlLnBhc3NpdmVIZWFsdGhNYXg7XHJcblx0XHRpZiAocGFzc2l2ZUVuZXJneU1heCA9PT0gdW5kZWZpbmVkKSBwYXNzaXZlRW5lcmd5TWF4ID0gdGVtcGxhdGUucGFzc2l2ZUVuZXJneU1heDtcclxuXHRcdGlmIChwYXNzaXZlUmFuZ2UgPT09IHVuZGVmaW5lZCkgcGFzc2l2ZVJhbmdlID0gdGVtcGxhdGUucGFzc2l2ZVJhbmdlO1xyXG5cdFx0aWYgKGVxdWlwcGVkRGFtYWdlID09PSB1bmRlZmluZWQpIGVxdWlwcGVkRGFtYWdlID0gdGVtcGxhdGUuZXF1aXBwZWREYW1hZ2U7XHJcblx0XHRpZiAoZXF1aXBwZWREZWZlbmNlID09PSB1bmRlZmluZWQpIGVxdWlwcGVkRGVmZW5jZSA9IHRlbXBsYXRlLmVxdWlwcGVkRGVmZW5jZTtcclxuXHRcdGlmIChlcXVpcHBlZEhlYWx0aE1heCA9PT0gdW5kZWZpbmVkKSBlcXVpcHBlZEhlYWx0aE1heCA9IHRlbXBsYXRlLmVxdWlwcGVkSGVhbHRoTWF4O1xyXG5cdFx0aWYgKGVxdWlwcGVkRW5lcmd5TWF4ID09PSB1bmRlZmluZWQpIGVxdWlwcGVkRW5lcmd5TWF4ID0gdGVtcGxhdGUuZXF1aXBwZWRFbmVyZ3lNYXg7XHJcblx0XHRpZiAoZXF1aXBwZWRSYW5nZSA9PT0gdW5kZWZpbmVkKSBlcXVpcHBlZFJhbmdlID0gdGVtcGxhdGUuZXF1aXBwZWRSYW5nZTtcclxuXHJcblx0XHRzdXBlcihtYXBJZCwgeCwgeSwgc3ByaXRlKTtcclxuXHRcdHRoaXMueiA9IC0xMDtcclxuXHRcdHRoaXMuaXRlbUlkID0gX2lkO1xyXG5cdFx0dGhpcy5wbGF5ZXJJZCA9IHBsYXllcklkO1xyXG5cdFx0dGhpcy5ib3RJZCA9IGJvdElkO1xyXG5cdFx0dGhpcy5zbG90ID0gc2xvdDtcclxuXHRcdFxyXG5cdFx0dGhpcy50ZW1wbGF0ZUlkID0gdGVtcGxhdGUuX2lkO1xyXG5cdFx0dGhpcy5uYW1lID0gbmFtZTtcclxuXHRcdHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcclxuXHRcdHRoaXMucmV1c2FibGUgPSByZXVzYWJsZTtcclxuXHJcblx0XHR0aGlzLnR5cGUgPSB0ZW1wbGF0ZS50eXBlLm5hbWU7XHJcblx0XHR0aGlzLnN0YWNrYWJsZSA9IHRlbXBsYXRlLnR5cGUuc3RhY2thYmxlO1xyXG5cdFx0dGhpcy5lcXVpcHBlZFNsb3QgPSB0ZW1wbGF0ZS50eXBlLmVxdWlwcGVkU2xvdDtcclxuXHRcdFxyXG5cdFx0dGhpcy5wYXNzaXZlID0ge1xyXG5cdFx0XHRkYW1hZ2U6IHBhc3NpdmVEYW1hZ2UsXHJcblx0XHRcdGRlZmVuY2U6IHBhc3NpdmVEZWZlbmNlLFxyXG5cdFx0XHRoZWFsdGhNYXg6IHBhc3NpdmVIZWFsdGhNYXgsXHJcblx0XHRcdGVuZXJneU1heDogcGFzc2l2ZUVuZXJneU1heCxcclxuXHRcdFx0cmFuZ2U6IHBhc3NpdmVSYW5nZVxyXG5cdFx0fTtcclxuXHRcdHRoaXMuZXF1aXBwZWQgPSB7XHJcblx0XHRcdGRhbWFnZTogZXF1aXBwZWREYW1hZ2UsXHJcblx0XHRcdGRlZmVuY2U6IGVxdWlwcGVkRGVmZW5jZSxcclxuXHRcdFx0aGVhbHRoTWF4OiBlcXVpcHBlZEhlYWx0aE1heCxcclxuXHRcdFx0ZW5lcmd5TWF4OiBlcXVpcHBlZEVuZXJneU1heCxcclxuXHRcdFx0cmFuZ2U6IGVxdWlwcGVkUmFuZ2VcclxuXHRcdH07XHJcblx0XHRcclxuXHRcdGlmICh0aGlzLnN0YWNrYWJsZSkge1xyXG5cdFx0XHRpZiAoc3RhY2sgPCAxKSBzdGFjayA9IDE7XHJcblx0XHRcdHRoaXMuc3RhY2sgPSBzdGFjaztcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHR0aGlzLnN0YWNrID0gMDtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLmdhbWVJZCA9IHV0aWwuZmlyc3RFbXB0eUluZGV4KGdhbWUuaXRlbXMpO1xyXG5cdFx0Z2FtZS5pdGVtc1t0aGlzLmdhbWVJZF0gPSB0aGlzO1xyXG5cdH1cclxuXHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5nZXRQYWNrKCk7XHJcblx0fVxyXG5cclxuXHRnZXREQlBhY2soKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRpdGVtSWQ6IHRoaXMuaXRlbUlkLFxyXG5cdFx0XHRwbGF5ZXJJZDogdGhpcy5wbGF5ZXJJZCxcclxuXHRcdFx0Ym90SWQ6IHRoaXMuYm90SWQsXHJcblx0XHRcdHNsb3Q6IHRoaXMuc2xvdCxcclxuXHRcdFx0bWFwSWQ6IHRoaXMubWFwSWQsXHJcblx0XHRcdHg6IHRoaXMueCxcclxuXHRcdFx0eTogdGhpcy55LFxyXG5cdFx0XHRjcmVhdGVkQnk6IHRoaXMuY3JlYXRlZEJ5LFxyXG5cdFx0XHRjcmVhdGVkRGF0ZTogdGhpcy5jcmVhdGVkRGF0ZSxcclxuXHRcdFx0dGVtcGxhdGVJZDogdGhpcy50ZW1wbGF0ZUlkLFxyXG5cdFx0XHRuYW1lOiB0aGlzLm5hbWUsXHJcblx0XHRcdGRlc2NyaXB0aW9uOiB0aGlzLmRlc2NyaXB0aW9uLFxyXG5cdFx0XHRzcHJpdGU6IHRoaXMuc3ByaXRlLFxyXG5cdFx0XHRyZXVzYWJsZTogdGhpcy5yZXVzYWJsZSxcclxuXHRcdFx0cGFzc2l2ZURhbWFnZTogdGhpcy5wYXNzaXZlLmRhbWFnZSxcclxuXHRcdFx0cGFzc2l2ZURlZmVuY2U6IHRoaXMucGFzc2l2ZS5kZWZlbmNlLFxyXG5cdFx0XHRwYXNzaXZlSGVhbHRoTWF4OiB0aGlzLnBhc3NpdmUuaGVhbHRoTWF4LFxyXG5cdFx0XHRwYXNzaXZlRW5lcmd5TWF4OiB0aGlzLnBhc3NpdmUuZW5lcmd5TWF4LFxyXG5cdFx0XHRwYXNzaXZlUmFuZ2U6IHRoaXMucGFzc2l2ZS5yYW5nZSxcclxuXHRcdFx0ZXF1aXBwZWREYW1hZ2U6IHRoaXMuZXF1aXBwZWQuZGFtYWdlLFxyXG5cdFx0XHRlcXVpcHBlZERlZmVuY2U6IHRoaXMuZXF1aXBwZWQuZGVmZW5jZSxcclxuXHRcdFx0ZXF1aXBwZWRIZWFsdGhNYXg6IHRoaXMuZXF1aXBwZWQuaGVhbHRoTWF4LFxyXG5cdFx0XHRlcXVpcHBlZEVuZXJneU1heDogdGhpcy5lcXVpcHBlZC5lbmVyZ3lNYXgsXHJcblx0XHRcdGVxdWlwcGVkUmFuZ2U6IHRoaXMuZXF1aXBwZWQucmFuZ2UsXHJcblx0XHRcdHN0YWNrOiB0aGlzLnN0YWNrLFxyXG5cdFx0XHRpc1Zpc2libGU6IHRoaXMuaXNWaXNpYmxlXHJcblx0XHR9O1xyXG5cdH1cclxuXHRcclxuXHRnZXRQYWNrKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0Z2FtZUlkOiB0aGlzLmdhbWVJZCxcclxuXHRcdFx0cGxheWVySWQ6IHRoaXMucGxheWVySWQsXHJcblx0XHRcdGJvdElkOiB0aGlzLmJvdElkLFxyXG5cdFx0XHRzbG90OiB0aGlzLnNsb3QsXHJcblx0XHRcdG1hcElkOiB0aGlzLm1hcElkLFxyXG5cdFx0XHR4OiB0aGlzLngsXHJcblx0XHRcdHk6IHRoaXMueSxcclxuXHRcdFx0ejogdGhpcy56LFxyXG5cdFx0XHRuYW1lOiB0aGlzLm5hbWUsXHJcblx0XHRcdGRlc2NyaXB0aW9uOiB0aGlzLmRlc2NyaXB0aW9uLFxyXG5cdFx0XHRzcHJpdGU6IHRoaXMuc3ByaXRlLFxyXG5cdFx0XHR0eXBlOiB0aGlzLnR5cGUsXHJcblx0XHRcdHJldXNhYmxlOiB0aGlzLnJldXNhYmxlLFxyXG5cdFx0XHRwYXNzaXZlOiB0aGlzLnBhc3NpdmUsXHJcblx0XHRcdGVxdWlwcGVkOiB0aGlzLmVxdWlwcGVkLFxyXG5cdFx0XHRzdGFjazogdGhpcy5zdGFjayxcclxuXHRcdFx0aXNWaXNpYmxlOiB0aGlzLmlzVmlzaWJsZVxyXG5cdFx0fTtcclxuXHR9XHJcblx0XHJcblx0cmVtb3ZlKCkge1xyXG5cdFx0ZGVsZXRlIGdhbWUuaXRlbXNbdGhpcy5nYW1lSWRdO1xyXG5cdH1cclxuXHJcblx0cmVtb3ZlT25lKCkge1xyXG5cdFx0aWYgKHRoaXMuc3RhY2sgPiAxKSB7XHJcblx0XHRcdHRoaXMuc3RhY2stLTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHR0aGlzLnJlbW92ZSgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0bW92ZVRvSW52ZW50b3J5KHBsYXllcklkLCBib3RJZCwgc2xvdCkge1xyXG5cdFx0dGhpcy5wbGF5ZXJJZCA9IHBsYXllcklkO1xyXG5cdFx0dGhpcy5ib3RJZCA9IGJvdElkO1xyXG5cdFx0dGhpcy5zbG90ID0gc2xvdDtcclxuXHRcdHRoaXMubWFwSWQgPSBudWxsO1xyXG5cdFx0dGhpcy54ID0gbnVsbDtcclxuXHRcdHRoaXMueSA9IG51bGw7XHJcblx0XHR0aGlzLnogPSBudWxsO1xyXG5cdH1cclxuXHJcblx0bW92ZVRvTWFwKG1hcElkLCB4LCB5KSB7XHJcblx0XHR0aGlzLm1hcElkID0gbWFwSWQ7XHJcblx0XHR0aGlzLnggPSB4O1xyXG5cdFx0dGhpcy55ID0geTtcclxuXHRcdHRoaXMueiA9IHRoaXMuZ2V0WlBvc2l0aW9uKG1hcElkLCB4LCB5KTtcclxuXHRcdHRoaXMucGxheWVySWQgPSBudWxsO1xyXG5cdFx0dGhpcy5ib3RJZCA9IG51bGw7XHJcblx0XHR0aGlzLnNsb3QgPSBudWxsO1xyXG5cdH1cclxuXHRcclxuXHRnZXRaUG9zaXRpb24obWFwSWQsIHgsIHkpIHtcclxuXHRcdHJldHVybiAtMTA7XHJcblx0fVxyXG5cclxuXHRpc0VxdWlwbWVudCgpIHtcclxuXHRcdGlmICh0aGlzLmVxdWlwcGVkU2xvdCA+PSAwKSB7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuIiwiaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9jb25maWcuanMnO1xyXG5pbXBvcnQgdXRpbCBmcm9tICcuLi91dGlsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hcCB7XHJcblx0Y29uc3RydWN0b3IobWFwSWQsIGRhdGEgPSB7fSkge1xyXG5cdFx0dGhpcy5tYXBJZCA9IG1hcElkO1xyXG5cclxuXHRcdGlmIChkYXRhLm5hbWUgPT0gbnVsbCkgZGF0YS5uYW1lID0gXCJCbGFuayBNYXBcIjtcclxuXHRcdGlmIChkYXRhLmRyb3BDaGFuY2UgPT0gbnVsbCkgZGF0YS5kcm9wQ2hhbmNlID0gMTAwO1xyXG5cdFx0aWYgKGRhdGEuZHJvcEFtb3VudEVRID09IG51bGwpIGRhdGEuZHJvcEFtb3VudEVRID0gMTtcclxuXHRcdGlmICghZGF0YS50aWxlcykgZGF0YS50aWxlcyA9IHV0aWwuY3JlYXRlM2RBcnJheShjb25maWcuTUFQX0NPTFVNTlMsIGNvbmZpZy5NQVBfUk9XUywgY29uZmlnLk1BUF9MQVlFUlMsIDApO1xyXG5cdFx0aWYgKCFkYXRhLmlzV2FsbCkgZGF0YS5pc1dhbGwgPSB1dGlsLmNyZWF0ZTJkQXJyYXkoY29uZmlnLk1BUF9DT0xVTU5TLCBjb25maWcuTUFQX1JPV1MsIGZhbHNlKTtcclxuXHRcdGlmICghZGF0YS5pc0hvc3RpbGUpIGRhdGEuaXNIb3N0aWxlID0gdXRpbC5jcmVhdGUyZEFycmF5KGNvbmZpZy5NQVBfQ09MVU1OUywgY29uZmlnLk1BUF9ST1dTLCBmYWxzZSk7XHJcblx0XHRpZiAoIWRhdGEuZGFtYWdlKSBkYXRhLmRhbWFnZSA9IHV0aWwuY3JlYXRlMmRBcnJheShjb25maWcuTUFQX0NPTFVNTlMsIGNvbmZpZy5NQVBfUk9XUywgbnVsbCk7XHJcblx0XHRpZiAoIWRhdGEud2FycE1hcCkgZGF0YS53YXJwTWFwID0gdXRpbC5jcmVhdGUyZEFycmF5KGNvbmZpZy5NQVBfQ09MVU1OUywgY29uZmlnLk1BUF9ST1dTLCBudWxsKTtcclxuXHRcdGlmICghZGF0YS53YXJwWCkgZGF0YS53YXJwWCA9IHV0aWwuY3JlYXRlMmRBcnJheShjb25maWcuTUFQX0NPTFVNTlMsIGNvbmZpZy5NQVBfUk9XUywgbnVsbCk7XHJcblx0XHRpZiAoIWRhdGEud2FycFkpIGRhdGEud2FycFkgPSB1dGlsLmNyZWF0ZTJkQXJyYXkoY29uZmlnLk1BUF9DT0xVTU5TLCBjb25maWcuTUFQX1JPV1MsIG51bGwpO1xyXG5cclxuXHRcdHRoaXMubmFtZSA9IGRhdGEubmFtZTtcclxuXHRcdHRoaXMuZHJvcENoYW5jZSA9IHV0aWwuY2xhbXAoZGF0YS5kcm9wQ2hhbmNlLCAwLCAxMDApO1xyXG5cdFx0dGhpcy5kcm9wQW1vdW50RVEgPSB1dGlsLmNsYW1wKGRhdGEuZHJvcEFtb3VudEVRLCAwLCBjb25maWcuRVFVSVBNRU5UX1NJWkUpO1xyXG5cdFx0Ly90aGlzLmRyb3BDaGFuY2UgPSAwID0gMCUgY2hhbmNlIHRvIGRyb3AgaXRlbXMgaW4gaW52ZW50b3J5IChkcm9wIG5vdGhpbmcpLCAxMDAgPSAxMDAlIGNoYW5jZSB0byBkcm9wIChkcm9wIGV2ZXJ5dGhpbmcpXHJcblx0XHQvL3RoaXMuZHJvcEFtb3VudEVRID0gbnVtYmVyIG9mIGVxdWlwcGVkIGl0ZW1zIHRoZSBwbGF5ZXIgd2lsbCBkcm9wIG9uIGRlYXRoLiBkcm9wRVEgPSBFUVVJUE1FTlRfU0laRSA9IGRyb3AgYWxsIGVxdWlwbWVudFxyXG5cdFx0dGhpcy50aWxlcyA9IGRhdGEudGlsZXM7XHJcblx0XHR0aGlzLmlzV2FsbCA9IGRhdGEuaXNXYWxsO1xyXG5cdFx0dGhpcy5pc0hvc3RpbGUgPSBkYXRhLmlzSG9zdGlsZTtcclxuXHRcdHRoaXMuZGFtYWdlID0gZGF0YS5kYW1hZ2U7XHJcblx0XHR0aGlzLndhcnBNYXAgPSBkYXRhLndhcnBNYXA7XHJcblx0XHR0aGlzLndhcnBYID0gZGF0YS53YXJwWDtcclxuXHRcdHRoaXMud2FycFkgPSBkYXRhLndhcnBZO1xyXG5cdH1cclxuXHRcclxuXHR1cGxvYWQoZGF0YSkge1xyXG5cdFx0aWYgKGRhdGEubmFtZSAhPSBudWxsKSB0aGlzLm5hbWUgPSBkYXRhLm5hbWU7XHJcblx0XHRpZiAoZGF0YS5kcm9wQ2hhbmNlICE9IG51bGwpIHRoaXMuZHJvcENoYW5jZSA9IGRhdGEuZHJvcENoYW5jZTtcclxuXHRcdGlmIChkYXRhLmRyb3BBbW91bnRFUSAhPSBudWxsKSB0aGlzLmRyb3BBbW91bnRFUSA9IGRhdGEuZHJvcEFtb3VudEVRO1xyXG5cdFx0aWYgKGRhdGEudGlsZXMpIHRoaXMudGlsZXMgPSBkYXRhLnRpbGVzO1xyXG5cdFx0aWYgKGRhdGEuaXNXYWxsKSB0aGlzLmlzV2FsbCA9IGRhdGEuaXNXYWxsO1xyXG5cdFx0aWYgKGRhdGEuaXNIb3N0aWxlKSB0aGlzLmlzSG9zdGlsZSA9IGRhdGEuaXNIb3N0aWxlO1xyXG5cdFx0aWYgKGRhdGEuZGFtYWdlKSB0aGlzLmRhbWFnZSA9IGRhdGEuZGFtYWdlO1xyXG5cdFx0aWYgKGRhdGEud2FycE1hcCkgdGhpcy53YXJwTWFwID0gZGF0YS53YXJwTWFwO1xyXG5cdFx0aWYgKGRhdGEud2FycFgpIHRoaXMud2FycFggPSBkYXRhLndhcnBYO1xyXG5cdFx0aWYgKGRhdGEud2FycFkpIHRoaXMud2FycFkgPSBkYXRhLndhcnBZO1xyXG5cdH1cclxuXHJcblx0Z2V0UGFjaygpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdG1hcElkOiB0aGlzLm1hcElkLFxyXG5cdFx0XHRuYW1lOiB0aGlzLm5hbWUsXHJcblx0XHRcdGRyb3BDaGFuY2U6IHRoaXMuZHJvcENoYW5jZSxcclxuXHRcdFx0ZHJvcEFtb3VudEVROiB0aGlzLmRyb3BBbW91bnRFUSxcclxuXHRcdFx0dGlsZXM6IHRoaXMudGlsZXMsXHJcblx0XHRcdGlzV2FsbDogdGhpcy5pc1dhbGwsXHJcblx0XHRcdGlzSG9zdGlsZTogdGhpcy5pc0hvc3RpbGUsXHJcblx0XHRcdGRhbWFnZTogdGhpcy5kYW1hZ2UsXHJcblx0XHRcdHdhcnBNYXA6IHRoaXMud2FycE1hcCxcclxuXHRcdFx0d2FycFg6IHRoaXMud2FycFgsXHJcblx0XHRcdHdhcnBZOiB0aGlzLndhcnBZXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0Z2V0VXBkYXRlUGFjaygpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdG1hcElkOiB0aGlzLm1hcElkLFxyXG5cdFx0XHRuYW1lOiB0aGlzLm5hbWUsXHJcblx0XHRcdHRpbGVzOiB0aGlzLnRpbGVzXHJcblx0XHR9O1xyXG5cdH1cclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBNZXNzYWdlIHtcclxuXHRjb25zdHJ1Y3RvcihzZW5kZXJJZCwgbWVzc2FnZSwgdHlwZSwgbWFwSWQsIGlkLCBjb2xvdXIpIHtcclxuXHRcdHRoaXMuc2VuZGVySWQgPSBzZW5kZXJJZDsgLy8gbnVsbCA9IHNlcnZlclxyXG5cdFx0dGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcclxuXHRcdHRoaXMudHlwZSA9IHR5cGU7XHJcblx0XHR0aGlzLm1hcElkID0gbWFwSWQ7XHJcblx0XHR0aGlzLmlkID0gaWQ7XHJcblx0XHR0aGlzLmNvbG91ciA9IGNvbG91cjtcclxuXHR9XHJcbn0iLCJpbXBvcnQgZ2FtZSBmcm9tICcuLi9nYW1lLmpzJztcclxuaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9jb25maWcuanMnO1xyXG5pbXBvcnQgdXRpbCBmcm9tICcuLi91dGlsLmpzJztcclxuaW1wb3J0IEFjdG9yIGZyb20gJy4vYWN0b3IuanMnO1xyXG5cclxuLy8gQSBQbGF5ZXIgaXMgYW4gaW1tb3J0YWwgQWN0b3Igd2hpY2ggdGFrZXMgaW5wdXQgZnJvbSBhIGNsaWVudFxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyIGV4dGVuZHMgQWN0b3Ige1xyXG5cdGNvbnN0cnVjdG9yKHNvY2tldElkLCBkYXRhKSB7XHJcblx0XHRpZiAoZGF0YS5zcHJpdGUgPT0gbnVsbCkgZGF0YS5zcHJpdGUgPSBkYXRhLnRlbXBsYXRlLnNwcml0ZTtcclxuXHJcblx0XHRzdXBlcihkYXRhLm1hcElkLCBkYXRhLngsIGRhdGEueSwgZGF0YS5kaXJlY3Rpb24sIGRhdGEubmFtZSwgZGF0YS5zcHJpdGUpO1xyXG5cdFx0dGhpcy5wbGF5ZXJJZCA9IGRhdGEuX2lkO1xyXG5cdFx0dGhpcy5zb2NrZXRJZCA9IHNvY2tldElkO1xyXG5cdFx0dGhpcy5hY2NvdW50SWQgPSBkYXRhLmFjY291bnQ7XHJcblx0XHR0aGlzLmFkbWluQWNjZXNzID0gZGF0YS5hZG1pbkFjY2VzcztcclxuXHJcblx0XHR0aGlzLmxldmVsID0gZGF0YS5sZXZlbDtcclxuXHRcdHRoaXMuZXhwZXJpZW5jZSA9IGRhdGEuZXhwZXJpZW5jZTtcclxuXHRcdHRoaXMudGVtcGxhdGVJZCA9IGRhdGEudGVtcGxhdGUuX2lkO1xyXG5cdFx0dGhpcy50ZW1wbGF0ZSA9IGRhdGEudGVtcGxhdGUubmFtZTtcclxuXHRcdHRoaXMuY2FsY0Jhc2VTdGF0cyhkYXRhLnRlbXBsYXRlKTtcclxuXHRcdHRoaXMucmVzdG9yZSgpO1xyXG5cclxuXHRcdHRoaXMuaXNEZWFkID0gZmFsc2U7XHJcblx0XHR0aGlzLmRlYXRocyA9IDA7XHJcblx0XHR0aGlzLnJlc3Bhd25UaW1lciA9IDA7XHJcblx0XHR0aGlzLnJlc3Bhd25TcGVlZCA9IDEwO1xyXG5cdFx0dGhpcy5yZXNwYXduTWFwID0gZGF0YS5tYXBJZDtcclxuXHRcdHRoaXMucmVzcGF3blggPSBkYXRhLng7XHJcblx0XHR0aGlzLnJlc3Bhd25ZID0gZGF0YS55O1xyXG5cclxuXHRcdHRoaXMuaW5wdXQgPSB7XHJcblx0XHRcdGRpcmVjdGlvbjogbnVsbCxcclxuXHRcdFx0cnVuOiBmYWxzZSxcclxuXHRcdFx0cGlja3VwOiBmYWxzZSxcclxuXHRcdFx0YXR0YWNrOiBmYWxzZVxyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLmdhbWVJZCA9IHV0aWwuZmlyc3RFbXB0eUluZGV4KGdhbWUucGxheWVycyk7XHJcblx0XHRnYW1lLnBsYXllcnNbdGhpcy5nYW1lSWRdID0gdGhpcztcclxuXHR9XHJcblxyXG5cdHVwZGF0ZShkZWx0YSkge1xyXG5cdFx0c3VwZXIudXBkYXRlKGRlbHRhKTtcdFx0Ly8gRGVmYXVsdCBBY3RvciBVcGRhdGVcclxuXHRcdGlmICh0aGlzLmlzRGVhZCkge1xyXG5cdFx0XHQvLyBSZXNwYXduaW5nXHJcblx0XHRcdHRoaXMucmVzcGF3blRpbWVyICs9IGRlbHRhO1xyXG5cdFx0XHRpZiAodGhpcy5yZXNwYXduVGltZXIgPj0gdGhpcy5yZXNwYXduU3BlZWQpIHRoaXMucmVzcGF3bigpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdC8vIENoZWNrIGZvciBBdHRhY2sgSW5wdXRcclxuXHRcdFx0aWYgKHRoaXMuaW5wdXQuYXR0YWNrICYmIHRoaXMuYXR0YWNrVGltZXIgPT09IDApIHRoaXMuYXR0YWNrKCk7XHJcblx0XHRcdFxyXG5cdFx0XHQvLyBDaGVjayBmb3IgTW92ZW1lbnQgSW5wdXRcclxuXHRcdFx0aWYgKCF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuaW5wdXQuZGlyZWN0aW9uKSB7XHJcblx0XHRcdFx0XHQvLyBDaGVjayBmb3IgUnVuIElucHV0XHJcblx0XHRcdFx0XHRpZiAodGhpcy5pbnB1dC5ydW4pIHtcclxuXHRcdFx0XHRcdFx0KHRoaXMuZW5lcmd5ID4gMCkgPyB0aGlzLmlzUnVubmluZyA9IHRydWUgOiB0aGlzLmlzUnVubmluZyA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuaXNSdW5uaW5nID0gZmFsc2U7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUodGhpcy5pbnB1dC5kaXJlY3Rpb24pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gdGhpcy5nZXRHYW1lUGFjaygpO1xyXG5cdH1cclxuXHRcclxuXHRnZXRHYW1lUGFjaygpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGdhbWVJZDogdGhpcy5nYW1lSWQsXHJcblx0XHRcdG5hbWU6IHRoaXMubmFtZSxcclxuXHRcdFx0ZGVzY3JpcHRpb246IHRoaXMuZGVzY3JpcHRpb24sXHJcblx0XHRcdHNwcml0ZTogdGhpcy5zcHJpdGUsXHJcblx0XHRcdGRpcmVjdGlvbjogdGhpcy5kaXJlY3Rpb24sXHJcblx0XHRcdG1hcElkOiB0aGlzLm1hcElkLFxyXG5cdFx0XHR4OiB0aGlzLnN0YXJ0WCxcclxuXHRcdFx0eTogdGhpcy5zdGFydFksXHJcblx0XHRcdHo6IHRoaXMueixcclxuXHRcdFx0ZGVzdGluYXRpb25YOiB0aGlzLmRlc3RpbmF0aW9uWCxcclxuXHRcdFx0ZGVzdGluYXRpb25ZOiB0aGlzLmRlc3RpbmF0aW9uWSxcclxuXHRcdFx0bGVycDogdGhpcy5sZXJwLFxyXG5cdFx0XHRpc1J1bm5pbmc6IHRoaXMuaXNSdW5uaW5nLFxyXG5cdFx0XHRpc0F0dGFja2luZzogdGhpcy5pc0F0dGFja2luZyxcclxuXHRcdFx0aXNEZWFkOiB0aGlzLmlzRGVhZCxcclxuXHRcdFx0aXNWaXNpYmxlOiB0aGlzLmlzVmlzaWJsZVxyXG5cdFx0fTtcclxuXHR9XHJcblx0XHJcblx0Z2V0VUlQYWNrKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0bGV2ZWw6IHRoaXMubGV2ZWwsXHJcblx0XHRcdGV4cGVyaWVuY2U6IHRoaXMuZXhwZXJpZW5jZSxcclxuXHRcdFx0aGVhbHRoOiB0aGlzLmhlYWx0aCxcclxuXHRcdFx0aGVhbHRoTWF4OiB0aGlzLmhlYWx0aE1heCxcclxuXHRcdFx0ZW5lcmd5OiB0aGlzLmVuZXJneSxcclxuXHRcdFx0ZW5lcmd5TWF4OiB0aGlzLmVuZXJneU1heCxcclxuXHRcdFx0bW92ZVNwZWVkOiB0aGlzLm1vdmVTcGVlZCxcclxuXHRcdFx0YXR0YWNrU3BlZWQ6IHRoaXMuYXR0YWNrU3BlZWQsXHJcblx0XHRcdGF0dGFja1RpbWVyOiB0aGlzLmF0dGFja1RpbWVyLFxyXG5cdFx0XHRpbnZlbnRvcnk6IHRoaXMuZ2V0SW52ZW50b3J5UGFjaygpXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0Z2V0REJQYWNrKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0bmFtZTogdGhpcy5uYW1lLFxyXG5cdFx0XHRhY2NvdW50OiB0aGlzLmFjY291bnRJZCxcclxuXHRcdFx0dGVtcGxhdGU6IHRoaXMudGVtcGxhdGVJZCxcclxuXHRcdFx0bGV2ZWw6IHRoaXMubGV2ZWwsXHJcblx0XHRcdGV4cGVyaWVuY2U6IHRoaXMuZXhwZXJpZW5jZSxcclxuXHRcdFx0bWFwSWQ6IHRoaXMubWFwSWQsXHJcblx0XHRcdHg6IHRoaXMueCxcclxuXHRcdFx0eTogdGhpcy55LFxyXG5cdFx0XHRkaXJlY3Rpb246IHRoaXMuZGlyZWN0aW9uLFxyXG5cdFx0XHRhZG1pbkFjY2VzczogdGhpcy5hZG1pbkFjY2VzcyxcclxuXHRcdFx0c3ByaXRlOiB0aGlzLnNwcml0ZVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0aW5wdXREYXRhKGRhdGEpIHtcclxuXHRcdGlmICh0aGlzLmlzRGVhZCkge1xyXG5cdFx0XHRnYW1lLnNlbmRHYW1lSW5mb1BsYXllcih0aGlzLmdhbWVJZCwgXCJZb3UgYXJlIGRlYWQuXCIpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGdhbWUuZ29kQ29tbWFuZHNbZGF0YS5pbnB1dF0pIHtcclxuXHRcdFx0aWYgKHRoaXMuYWRtaW5BY2Nlc3MgPiAwKSB7XHJcblx0XHRcdFx0Z2FtZS5nb2RDb21tYW5kc1tkYXRhLmlucHV0XShkYXRhLCB0aGlzKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRnYW1lLnNlbmRHYW1lSW5mb1BsYXllcih0aGlzLmdhbWVJZCwgXCJZb3UgZG9uJ3QgaGF2ZSBhY2Nlc3MgdG8gdGhhdCBjb21tYW5kLlwiKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGlmIChnYW1lLmNvbW1hbmRzW2RhdGEuaW5wdXRdKSB7XHJcblx0XHRcdFx0Z2FtZS5jb21tYW5kc1tkYXRhLmlucHV0XShkYXRhLCB0aGlzKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRnYW1lLnNlbmRHYW1lSW5mb1BsYXllcih0aGlzLmdhbWVJZCwgXCJJbnZhbGlkIGNvbW1hbmQuXCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwaWNrVXAoKSB7XHJcblx0XHRpZiAoc3VwZXIucGlja1VwKCkgPT09IGZhbHNlKSBnYW1lLnNlbmRHYW1lSW5mb1BsYXllcih0aGlzLmdhbWVJZCwgXCJZb3VyIGludmVudG9yeSBpcyBmdWxsLlwiKTtcclxuXHR9XHJcblx0XHJcblx0Z2V0SW52ZW50b3J5KCkge1xyXG5cdFx0Y29uc3QgaW52ZW50b3J5ID0gZ2FtZS5pdGVtcy5maWx0ZXIoaXRlbSA9PiB7XHJcblx0XHRcdHJldHVybiBcIlwiK2l0ZW0ucGxheWVySWQgPT09IFwiXCIrdGhpcy5wbGF5ZXJJZDtcclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIGludmVudG9yeTtcclxuXHR9XHJcblxyXG5cdHNldERlYWQoKSB7XHJcblx0XHRzdXBlci5zZXREZWFkKCk7XHJcblx0XHR0aGlzLmlzRGVhZCA9IHRydWU7XHJcblx0XHR0aGlzLmhlYWx0aCA9IDA7XHJcblx0XHR0aGlzLmVuZXJneSA9IDA7XHJcblx0XHR0aGlzLmRlYXRocysrO1xyXG5cdH1cclxuXHJcblx0cmVzcGF3bigpIHtcclxuXHRcdHRoaXMubWFwSWQgPSB0aGlzLnJlc3Bhd25NYXA7XHJcblx0XHR0aGlzLnggPSB0aGlzLnJlc3Bhd25YO1xyXG5cdFx0dGhpcy55ID0gdGhpcy5yZXNwYXduWTtcclxuXHRcdHRoaXMuc3RhcnRYID0gdGhpcy5yZXNwYXduWDtcclxuXHRcdHRoaXMuc3RhcnRZID0gdGhpcy5yZXNwYXduWTtcclxuXHRcdHRoaXMuZGVzdGluYXRpb25YID0gdGhpcy5yZXNwYXduWDtcclxuXHRcdHRoaXMuZGVzdGluYXRpb25ZID0gdGhpcy5yZXNwYXduWTtcclxuXHRcdFxyXG5cdFx0dGhpcy5jYWxjQm9udXNTdGF0cygpO1xyXG5cdFx0dGhpcy5yZXN0b3JlKCk7XHJcblx0XHRcclxuXHRcdHRoaXMuaXNXYWxraW5nID0gZmFsc2U7XHJcblx0XHR0aGlzLmlzUnVubmluZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy5pc0F0dGFja2luZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy5pc0RlYWQgPSBmYWxzZTtcclxuXHRcdHRoaXMucmVzcGF3blRpbWVyID0gMDtcclxuXHRcdGdhbWUuc2VuZEdhbWVJbmZvUGxheWVyKHRoaXMuZ2FtZUlkLCBcIlRoZSBBbmdlbCBvZiBNZXJjeSByZWZ1c2VzIHRvIGxldCB5b3UgZGllLlwiKTtcclxuXHR9XHJcblxyXG5cdGdhaW5FeHBlcmllbmNlKGV4cGVyaWVuY2UpIHtcclxuXHRcdGlmICh0aGlzLmV4cGVyaWVuY2UgKyBleHBlcmllbmNlIDw9IDApIHtcclxuXHRcdFx0dGhpcy5leHBlcmllbmNlID0gMDtcdFxyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5leHBlcmllbmNlICs9IGV4cGVyaWVuY2U7XHJcblx0XHRpZiAodGhpcy5leHBlcmllbmNlID49IGdhbWUuZXhwZXJpZW5jZVRvTGV2ZWxbdGhpcy5sZXZlbF0pIHtcclxuXHRcdFx0dGhpcy5sZXZlbFVwKCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRsZXZlbFVwKCkge1xyXG5cdFx0aWYgKHRoaXMubGV2ZWwgPCBjb25maWcuTUFYX0xFVkVMKSB7XHJcblx0XHRcdGNvbnN0IHJvbGxvdmVyRXhwZXJpZW5jZSA9IHRoaXMuZXhwZXJpZW5jZSAtIGdhbWUuZXhwZXJpZW5jZVRvTGV2ZWxbdGhpcy5sZXZlbF07XHJcblx0XHRcdHRoaXMuZXhwZXJpZW5jZSA9IDA7XHJcblx0XHRcdHRoaXMubGV2ZWwrKztcclxuXHRcdFx0dGhpcy5jYWxjQmFzZVN0YXRzKCk7XHJcblx0XHRcdGdhbWUuc2VuZEdhbWVJbmZvUGxheWVyKHRoaXMuZ2FtZUlkLCBgTGV2ZWwgdXAhIFlvdSBhcmUgbm93IGxldmVsICR7dGhpcy5sZXZlbH0hYCk7XHJcblx0XHRcdHRoaXMuZ2FpbkV4cGVyaWVuY2Uocm9sbG92ZXJFeHBlcmllbmNlKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0Y2FsY0Jhc2VTdGF0cyh0ZW1wbGF0ZSkge1xyXG5cdFx0aWYgKCF0ZW1wbGF0ZSkgdGVtcGxhdGUgPSBnYW1lLnBsYXllclRlbXBsYXRlc1t0aGlzLnRlbXBsYXRlSWRdO1xyXG5cdFx0c3VwZXIuY2FsY0Jhc2VTdGF0cyh0ZW1wbGF0ZSk7XHJcblx0fVxyXG59XHJcbiIsImltcG9ydCBnYW1lIGZyb20gJy4uL2dhbWUuanMnO1xyXG5pbXBvcnQgdXRpbCBmcm9tICcuLi91dGlsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRleHQge1xyXG5cdGNvbnN0cnVjdG9yKG1hcElkLCB4LCB5LCBtZXNzYWdlLCBjb2xvdXIgPSAnIzAwMDAwMCcsIGRpc3BsYXlUaW1lID0gMiwgdmVsWCA9IDAsIHZlbFkgPSAwKSB7XHJcblx0XHR0aGlzLm1hcElkID0gbWFwSWQ7XHJcblx0XHR0aGlzLnggPSB4O1xyXG5cdFx0dGhpcy55ID0geTtcclxuXHRcdHRoaXMudmVsWCA9IHZlbFg7XHJcblx0XHR0aGlzLnZlbFkgPSB2ZWxZO1xyXG5cdFx0dGhpcy5sZXJwWCA9IDA7XHJcblx0XHR0aGlzLmxlcnBZID0gMDtcclxuXHJcblx0XHR0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xyXG5cdFx0dGhpcy5jb2xvdXIgPSBjb2xvdXI7XHJcblx0XHR0aGlzLmRpc3BsYXlUaW1lID0gZGlzcGxheVRpbWU7XHJcblx0XHR0aGlzLnRpbWVyID0gMDtcclxuXHJcblx0XHR0aGlzLmdhbWVJZCA9IHV0aWwuZmlyc3RFbXB0eUluZGV4KGdhbWUudGV4dHMpO1xyXG5cdFx0Z2FtZS50ZXh0c1t0aGlzLmdhbWVJZF0gPSB0aGlzO1xyXG5cdH1cclxuXHRcclxuXHR1cGRhdGUoZGVsdGEpIHtcclxuXHRcdHRoaXMudGltZXIgKz0gZGVsdGE7XHJcblx0XHRpZiAodGhpcy5kaXNwbGF5VGltZSA+IDAgJiYgdGhpcy50aW1lciA+IHRoaXMuZGlzcGxheVRpbWUpIHtcclxuXHRcdFx0dGhpcy5yZW1vdmUoKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLmxlcnBYICs9IGRlbHRhICogdGhpcy52ZWxYO1xyXG5cdFx0dGhpcy5sZXJwWSArPSBkZWx0YSAqIHRoaXMudmVsWTtcclxuXHJcblx0XHRpZiAodGhpcy5sZXJwWCA8IC0xKSB7XHJcblx0XHRcdHRoaXMubGVycFgrKztcclxuXHRcdFx0dGhpcy54LS07XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmICh0aGlzLmxlcnBYID4gMSkge1xyXG5cdFx0XHR0aGlzLmxlcnBYLS07XHJcblx0XHRcdHRoaXMueCsrO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLmxlcnBZIDwgLTEpIHtcclxuXHRcdFx0dGhpcy5sZXJwWSsrO1xyXG5cdFx0XHR0aGlzLnktLTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKHRoaXMubGVycFkgPiAxKSB7XHJcblx0XHRcdHRoaXMubGVycFktLTtcclxuXHRcdFx0dGhpcy55Kys7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiB0aGlzLmdldFBhY2soKTtcclxuXHR9XHJcblx0XHJcblx0Z2V0UGFjaygpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGdhbWVJZDogdGhpcy5nYW1lSWQsXHJcblx0XHRcdG1hcElkOiB0aGlzLm1hcElkLFxyXG5cdFx0XHR4OiB0aGlzLngsXHJcblx0XHRcdHk6IHRoaXMueSxcclxuXHRcdFx0bGVycFg6IHRoaXMubGVycFgsXHJcblx0XHRcdGxlcnBZOiB0aGlzLmxlcnBZLFxyXG5cdFx0XHRtZXNzYWdlOiB0aGlzLm1lc3NhZ2UsXHJcblx0XHRcdGNvbG91cjogdGhpcy5jb2xvdXJcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHRyZW1vdmUoKSB7XHJcblx0XHRkZWxldGUgZ2FtZS50ZXh0c1t0aGlzLmdhbWVJZF07XHJcblx0fVxyXG59XHJcbiIsImNvbnN0IGNvbmZpZyA9IHt9O1xyXG5cclxuY29uZmlnLlBPUlQgPSAyMDAwO1xyXG5jb25maWcuRlJBTUVSQVRFID0gMTAwMCAvIDYwO1xyXG5jb25maWcuQkFDS1VQX1RJTUUgPSAxMjA7XHJcblxyXG5jb25maWcuTUFQX0xBWUVSUyA9IDY7XHJcbmNvbmZpZy5NQVBfQ09MVU1OUyA9IDEyO1xyXG5jb25maWcuTUFQX1JPV1MgPSAxMjtcclxuXHJcbmNvbmZpZy5NQVhfTUFQUyA9IDEwO1xyXG5jb25maWcuTUFYX1VTRVJTID0gMTAwO1xyXG5jb25maWcuTUFYX1NQUklURVMgPSAxMztcclxuY29uZmlnLk1BWF9FRkZFQ1RTID0gNzE7XHJcbmNvbmZpZy5NQVhfTEVWRUwgPSAzMDtcclxuXHJcbmNvbmZpZy5NQVhfSEVBTFRIX0JBU0UgPSAyMDA7XHJcbmNvbmZpZy5NQVhfSEVBTFRIX0JPTlVTID0gNTU7XHJcbmNvbmZpZy5NQVhfRU5FUkdZX0JBU0UgPSAyMDA7XHJcbmNvbmZpZy5NQVhfRU5FUkdZX0JPTlVTID0gNTU7XHJcblxyXG5jb25maWcuSU5WRU5UT1JZX1NJWkUgPSAyMDtcclxuY29uZmlnLkVRVUlQTUVOVF9TSVpFID0gNTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNvbmZpZztcclxuIiwiaW1wb3J0IG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcclxuaW1wb3J0IGJjcnlwdCBmcm9tICdiY3J5cHQnO1xyXG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xyXG5cclxuaW1wb3J0IHV0aWwgZnJvbSBcIi4vdXRpbC5qc1wiO1xyXG5pbXBvcnQgQWNjb3VudCBmcm9tICcuL21vZGVscy9hY2NvdW50LmpzJztcclxuaW1wb3J0IFBsYXllciBmcm9tICcuL21vZGVscy9wbGF5ZXIuanMnO1xyXG5pbXBvcnQgUGxheWVyVGVtcGxhdGUgZnJvbSAnLi9tb2RlbHMvcGxheWVyVGVtcGxhdGUuanMnO1xyXG5pbXBvcnQgQm90IGZyb20gJy4vbW9kZWxzL2JvdC5qcyc7XHJcbmltcG9ydCBCb3RUZW1wbGF0ZSBmcm9tICcuL21vZGVscy9ib3RUZW1wbGF0ZS5qcyc7XHJcbmltcG9ydCBJdGVtIGZyb20gJy4vbW9kZWxzL2l0ZW0uanMnO1xyXG5pbXBvcnQgSXRlbVRlbXBsYXRlIGZyb20gJy4vbW9kZWxzL2l0ZW1UZW1wbGF0ZS5qcyc7XHJcbmltcG9ydCBJdGVtVHlwZSBmcm9tICcuL21vZGVscy9pdGVtVHlwZS5qcyc7XHJcbmltcG9ydCBNYXAgZnJvbSAnLi9tb2RlbHMvbWFwLmpzJztcclxuXHJcbmNvbnN0IGZzcCA9IGZzLnByb21pc2VzO1xyXG5tb25nb29zZS5Qcm9taXNlID0gUHJvbWlzZTtcclxubW9uZ29vc2UuY29ubmVjdCgnbW9uZ29kYjovL2xvY2FsaG9zdC9vZHlzc2V5Jywge3VzZU5ld1VybFBhcnNlcjogdHJ1ZX0pO1xyXG5cclxuY2xhc3MgRGF0YWJhc2Uge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0dGhpcy5zZXJ2ZXJMb2cgPSBbXTtcclxuXHR9XHJcblxyXG5cdGFzeW5jIGJhY2t1cChkYXRhID0ge30pIHtcclxuXHRcdC8vVE9ETyBzYXZlIGV2ZXJ5dGhpbmdcclxuXHRcdC8vIGNvbnN0IG1hcHMgPSBzYXZlLWFsbC1tYXBzXHJcblx0XHRsZXQgcGxheWVycyA9IHRoaXMuc2F2ZU9ubGluZVBsYXllcnMoZGF0YS5wbGF5ZXJzKTtcclxuXHRcdGNvbnN0IGJvdHMgPSB0aGlzLnNhdmVBbGxCb3RzKGRhdGEuYm90cyk7XHJcblx0XHRsZXQgaXRlbXMgPSB0aGlzLnNhdmVBbGxJdGVtcyhkYXRhLml0ZW1zKTtcclxuXHRcdGxldCBsb2dTYXZlZCA9IHRoaXMuc2F2ZUxvZygpO1xyXG5cdFx0UHJvbWlzZS5hbGwoW3BsYXllcnMsIGJvdHMsIGl0ZW1zLCBsb2dTYXZlZF0pXHJcblx0XHQudGhlbigoKSA9PiB0aGlzLmxvZyhcIkdhbWUgc2F2ZWQgdG8gZGlzay5cIikpO1xyXG5cdH1cclxuXHRcclxuXHRsb2cobWVzc2FnZSkge1xyXG5cdFx0Y29uc3QgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcblx0XHRjb25zb2xlLmxvZyh1dGlsLnRpbWVzdGFtcChkYXRlKSArIFwiIC0gXCIgKyBtZXNzYWdlKTtcclxuXHRcdHRoaXMuc2VydmVyTG9nLnB1c2goe1xyXG5cdFx0XHRtZXNzYWdlLFxyXG5cdFx0XHRkYXRlXHJcblx0XHR9KTtcclxuXHR9XHJcblx0YXN5bmMgc2F2ZUxvZygpIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGNvbnN0IHNhdmVkTG9nID0gYXdhaXQgZnNwLnJlYWRGaWxlKCcuL3NlcnZlci9sb2cuanNvbicpO1xyXG5cdFx0XHRjb25zdCBuZXdMb2cgPSBKU09OLnBhcnNlKHNhdmVkTG9nKS5jb25jYXQodGhpcy5zZXJ2ZXJMb2cpO1xyXG5cdFx0XHR0aGlzLnNlcnZlckxvZyA9IFtdO1xyXG5cdFx0XHRhd2FpdCBmc3Aud3JpdGVGaWxlKCcuL3NlcnZlci9sb2cuanNvbicsIEpTT04uc3RyaW5naWZ5KG5ld0xvZykpO1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGNhdGNoKGVycikge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0fVxyXG5cdGFzeW5jIGNsZWFyTG9nKCkge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0dGhpcy5zZXJ2ZXJMb2cgPSBbXTtcclxuXHRcdFx0YXdhaXQgZnNwLndyaXRlRmlsZSgnLi9zZXJ2ZXIvbG9nLmpzb24nLCBcIltdXCIpO1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGNhdGNoIChlcnIpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Z2VuZXJhdGVJZCgpIHtcclxuXHRcdHJldHVybiBuZXcgbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQ7XHJcblx0fVxyXG5cdGFzeW5jIGhhc2hQYXNzd29yZChwYXNzd29yZCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0YmNyeXB0Lmhhc2gocGFzc3dvcmQsIDEwLCAoZXJyLCBoYXNoKSA9PiB7XHJcblx0XHRcdFx0aWYgKGVycikgcmVqZWN0KGVycik7XHJcblx0XHRcdFx0ZWxzZSByZXNvbHZlKGhhc2gpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRhc3luYyBjb21wYXJlUGFzc3dvcmQocGFzc3dvcmQsIGhhc2hlZFBhc3N3b3JkKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHRiY3J5cHQuY29tcGFyZShwYXNzd29yZCwgaGFzaGVkUGFzc3dvcmQsIChlcnIsIG1hdGNoKSA9PiB7XHJcblx0XHRcdFx0aWYgKGVycikgcmVqZWN0KGVycik7XHJcblx0XHRcdFx0ZWxzZSByZXNvbHZlKG1hdGNoKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0YXN5bmMgYXV0aEFjY291bnQodXNlcm5hbWUsIHBhc3N3b3JkKSB7XHJcblx0XHRsZXQgYWNjb3VudCA9IGF3YWl0IEFjY291bnQuZmluZE9uZSh7dXNlcm5hbWU6IHVzZXJuYW1lfSkuZXhlYygpO1xyXG5cdFx0aWYgKCFhY2NvdW50KSByZXR1cm4gZmFsc2U7XHJcblx0XHRcclxuXHRcdHJldHVybiB0aGlzLmNvbXBhcmVQYXNzd29yZChwYXNzd29yZCwgYWNjb3VudC5wYXNzd29yZCk7XHJcblx0fVxyXG5cclxuXHRhc3luYyBhZGRBY2NvdW50KHVzZXJuYW1lLCBwYXNzd29yZCwgZW1haWwpIHtcclxuXHRcdGxldCBhY2NvdW50ID0gYXdhaXQgdGhpcy5nZXRBY2NvdW50SWQodXNlcm5hbWUpO1xyXG5cdFx0aWYgKGFjY291bnQpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coYEFjY291bnQgYWxyZWFkeSBleGlzdHMgd2l0aCB1c2VybmFtZSAke3VzZXJuYW1lfS5gKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IGhhc2hlZFBhc3N3b3JkID0gYXdhaXQgdGhpcy5oYXNoUGFzc3dvcmQocGFzc3dvcmQpO1xyXG5cdFx0YWNjb3VudCA9IG5ldyBBY2NvdW50KHtcclxuXHRcdFx0X2lkOiBuZXcgbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQsXHJcblx0XHRcdHVzZXJuYW1lLFxyXG5cdFx0XHRwYXNzd29yZDogaGFzaGVkUGFzc3dvcmRcclxuXHRcdH0pO1xyXG5cdFx0Ly9pZiAoZW1haWwpIGFjY291bnQuZW1haWwgPSBlbWFpbDtcclxuXHJcblx0XHRyZXR1cm4gYXdhaXQgYWNjb3VudC5zYXZlKClcclxuXHRcdC50aGVuKHJlc3VsdCA9PiB7XHJcblx0XHRcdHRoaXMubG9nKGBBY2NvdW50IGFkZGVkOiAke3VzZXJuYW1lfS5gKVxyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH0pXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBnZXRBY2NvdW50KGFjY291bnRJZCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IEFjY291bnQuZmluZEJ5SWQoYWNjb3VudElkKVxyXG5cdFx0LnNlbGVjdCgnX2lkIHVzZXJuYW1lIHBhc3N3b3JkIGVtYWlsIHZlcmlmaWVkJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKGFjY291bnQgPT4gYWNjb3VudClcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIGdldEFjY291bnRCeVVzZXJuYW1lKHVzZXJuYW1lKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgQWNjb3VudC5maW5kT25lKHt1c2VybmFtZTogdXNlcm5hbWV9KVxyXG5cdFx0LnNlbGVjdCgnX2lkIHVzZXJuYW1lIHBhc3N3b3JkIGVtYWlsIHZlcmlmaWVkJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKGFjY291bnQgPT4gYWNjb3VudClcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIGdldEFjY291bnRJZCh1c2VybmFtZSkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IEFjY291bnQuZmluZE9uZSh7dXNlcm5hbWU6IHVzZXJuYW1lfSlcclxuXHRcdC5zZWxlY3QoJ19pZCcpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbihhY2NvdW50ID0+IHtcclxuXHRcdFx0aWYgKGFjY291bnQpIHtcclxuXHRcdFx0XHRyZXR1cm4gYWNjb3VudC5faWQ7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBzYXZlQWNjb3VudChkYXRhKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgQWNjb3VudC51cGRhdGVPbmUoe3VzZXJuYW1lOiBkYXRhLnVzZXJuYW1lfSwgeyRzZXQ6IGRhdGF9KVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4ocmVzdWx0ID0+IHRydWUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHJcblx0YXN5bmMgYWRkUGxheWVyKGFjY291bnRJZCwgbmFtZSwgdGVtcGxhdGVJZCkge1xyXG5cdFx0bGV0IGFjY291bnQgPSBhd2FpdCB0aGlzLmdldEFjY291bnQoYWNjb3VudElkKTtcclxuXHRcdGlmICghYWNjb3VudCkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIkFjY291bnQgZG9lcyBub3QgZXhpc3Qgd2l0aCB0aGF0IGlkLlwiKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0bGV0IHRlbXBsYXRlID0gYXdhaXQgdGhpcy5nZXRQbGF5ZXJUZW1wbGF0ZSh0ZW1wbGF0ZUlkKTtcclxuXHRcdGlmICghdGVtcGxhdGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJQbGF5ZXIgVGVtcGxhdGUgZG9lcyBub3QgZXhpc3Qgd2l0aCB0aGF0IGlkLlwiKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0bGV0IHBsYXllciA9IGF3YWl0IHRoaXMuZ2V0UGxheWVyKG5hbWUpO1xyXG5cdFx0aWYgKHBsYXllcikge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIlBsYXllciBhbHJlYWR5IGV4aXN0cyB3aXRoIHRoYXQgbmFtZS5cIik7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHRwbGF5ZXIgPSBuZXcgUGxheWVyKHtcclxuXHRcdFx0X2lkIDogbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkLFxyXG5cdFx0XHRuYW1lLFxyXG5cdFx0XHRhY2NvdW50OiBhY2NvdW50SWQsXHJcblx0XHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZUlkXHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gYXdhaXQgcGxheWVyLnNhdmUoKVxyXG5cdFx0LnRoZW4ocmVzdWx0ID0+IHRydWUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBnZXRQbGF5ZXIobmFtZSkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IFBsYXllci5maW5kT25lKHtuYW1lOiBuYW1lfSlcclxuXHRcdC5zZWxlY3QoJ19pZCBhY2NvdW50IG5hbWUgdGVtcGxhdGUgbGV2ZWwgZXhwZXJpZW5jZSBtYXBJZCB4IHkgZGlyZWN0aW9uIGFkbWluQWNjZXNzIHNwcml0ZScpXHJcblx0XHQucG9wdWxhdGUoJ3RlbXBsYXRlJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHBsYXllciA9PiBwbGF5ZXIpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBnZXRQbGF5ZXJzQnlBY2NvdW50KGFjY291bnRJZCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IFBsYXllci5maW5kKHthY2NvdW50OiBhY2NvdW50SWR9KVxyXG5cdFx0LnNlbGVjdCgnX2lkIGFjY291bnQgbmFtZSB0ZW1wbGF0ZSBsZXZlbCBleHBlcmllbmNlIG1hcElkIHggeSBkaXJlY3Rpb24gYWRtaW5BY2Nlc3Mgc3ByaXRlJylcclxuXHRcdC5wb3B1bGF0ZSgndGVtcGxhdGUnKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4ocGxheWVycyA9PiBwbGF5ZXJzKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgc2F2ZVBsYXllcihkYXRhKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgUGxheWVyLnVwZGF0ZU9uZSh7bmFtZTogZGF0YS5uYW1lfSwgeyRzZXQ6IGRhdGF9KVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4ocmVzdWx0ID0+IHRydWUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRzYXZlT25saW5lUGxheWVycyhwbGF5ZXJzID0gW10pIHtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcGxheWVycy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRjb25zdCBwbGF5ZXIgPSBwbGF5ZXJzW2ldO1xyXG5cdFx0XHRpZiAoIXBsYXllcikgY29udGludWU7XHJcblx0XHRcdHRoaXMuc2F2ZVBsYXllcihwbGF5ZXIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0YXN5bmMgYWRkQm90KGRhdGEpIHtcclxuXHRcdGxldCB0ZW1wbGF0ZSA9IGF3YWl0IHRoaXMuZ2V0Qm90VGVtcGxhdGUoZGF0YS50ZW1wbGF0ZUlkKTtcclxuXHRcdGlmICghdGVtcGxhdGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJCb3QgVGVtcGxhdGUgZG9lcyBub3QgZXhpc3Qgd2l0aCB0aGF0IGlkLlwiKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBfaWQgPSBkYXRhLmJvdElkO1xyXG5cdFx0aWYgKCFfaWQpIF9pZCA9IG5ldyBtb25nb29zZS5UeXBlcy5PYmplY3RJZDtcclxuXHJcblx0XHRjb25zdCBib3QgPSBuZXcgQm90KHtcclxuXHRcdFx0X2lkLFxyXG5cdFx0XHR0ZW1wbGF0ZTogZGF0YS50ZW1wbGF0ZUlkLFxyXG5cdFx0XHRtYXBJZDogZGF0YS5tYXBJZCxcclxuXHRcdFx0eDogZGF0YS54LFxyXG5cdFx0XHR5OiBkYXRhLnksXHJcblx0XHRcdGRpcmVjdGlvbjogZGF0YS5kaXJlY3Rpb25cclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBhd2FpdCBib3Quc2F2ZSgpXHJcblx0XHQudGhlbihyZXN1bHQgPT4gdHJ1ZSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIGdldEJvdChib3RJZCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IEJvdC5maW5kT25lKHtfaWQ6IGJvdElkfSlcclxuXHRcdC5zZWxlY3QoJ19pZCBuYW1lIHNwcml0ZSB0ZW1wbGF0ZSBsZXZlbCBleHBlcmllbmNlIG1hcElkIHggeSBkaXJlY3Rpb24nKVxyXG5cdFx0LnBvcHVsYXRlKCd0ZW1wbGF0ZScpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbihib3QgPT4gYm90KVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgc2F2ZUJvdChkYXRhKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgQm90LnVwZGF0ZU9uZSh7X2lkOiBkYXRhLmJvdElkfSwgeyRzZXQ6IGRhdGF9KVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4ocmVzdWx0ID0+IHRydWUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBnZXRBbGxCb3RzKCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IEJvdC5maW5kKHt9KVxyXG5cdFx0LnNlbGVjdCgnX2lkIHRlbXBsYXRlIG1hcElkIHggeSBkaXJlY3Rpb24nKVxyXG5cdFx0LnBvcHVsYXRlKCd0ZW1wbGF0ZScpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbihib3RzID0+IGJvdHMpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBzYXZlQWxsQm90cyhjdXJyZW50Qm90cykge1xyXG5cdFx0aWYgKCFjdXJyZW50Qm90cykgcmV0dXJuO1xyXG5cclxuXHRcdGxldCBzYXZlZEJvdHMgPSBhd2FpdCB0aGlzLmdldEFsbEJvdHMoKTtcclxuXHRcdGNvbnN0IG5ld0JvdHMgPSBjdXJyZW50Qm90cy5maWx0ZXIoYm90ID0+ICFzYXZlZEJvdHMuZmluZChzYXZlZEJvdCA9PiBzYXZlZEJvdC5faWQgPT09IGJvdC5ib3RJZCkpO1xyXG5cdFx0Y29uc3QgZXhpc3RpbmdCb3RzID0gY3VycmVudEJvdHMuZmlsdGVyKGJvdCA9PiBzYXZlZEJvdHMuZmluZChzYXZlZEJvdCA9PiBzYXZlZEJvdC5faWQgPT09IGJvdC5ib3RJZCkpO1xyXG5cdFx0Y29uc3QgZGVsZXRlQm90cyA9IHNhdmVkQm90cy5maWx0ZXIoYm90ID0+ICFleGlzdGluZ0JvdHMuZmluZChleGlzdGluZ0JvdCA9PiBleGlzdGluZ0JvdC5ib3RJZCA9PT0gYm90Ll9pZCkpO1xyXG5cdFx0Y29uc3QgdXBkYXRlQm90cyA9IGV4aXN0aW5nQm90cy5maWx0ZXIoYm90ID0+ICFkZWxldGVCb3RzLmluY2x1ZGVzKGJvdCkpO1xyXG5cclxuXHRcdC8vIEFkZCBuZXcgQm90c1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBuZXdCb3RzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHRoaXMuYWRkQm90KG5ld0JvdHNbaV0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIERlbGV0ZSByZW1vdmVkIEJvdHNcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgZGVsZXRlQm90cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRCb3QuZGVsZXRlT25lKHtfaWQ6IGRlbGV0ZUJvdHNbaV0uX2lkfSwgZXJyID0+IHtcclxuXHRcdFx0XHRpZiAoZXJyKSBjb25zb2xlLmxvZyhlcnIpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBVcGRhdGUgdGhlIHJlc3RcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdXBkYXRlQm90cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRjb25zdCBib3QgPSB1cGRhdGVCb3RzW2ldO1xyXG5cdFx0XHRpZiAoIWJvdCkgY29udGludWU7XHJcblx0XHRcdHRoaXMuc2F2ZUJvdChib3QpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0YXN5bmMgZ2V0TWFwKG1hcElkKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgTWFwLmZpbmRPbmUoe21hcElkOiBtYXBJZH0pXHJcblx0XHQuc2VsZWN0KCdtYXBJZCBuYW1lIGRyb3BDaGFuY2UgZHJvcEFtb3VudEVRIHRpbGVzIGlzV2FsbCBpc0hvc3RpbGUgZGFtYWdlIHdhcnBNYXAgd2FycFggd2FycFknKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4obWFwID0+IG1hcClcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIHNhdmVNYXAoZGF0YSkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IE1hcC51cGRhdGVPbmUoe21hcElkOiBkYXRhLm1hcElkfSwgeyRzZXQ6IGRhdGF9LCB7dXBzZXJ0OiB0cnVlfSlcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHJlc3VsdCA9PiB0cnVlKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgZ2V0QWxsTWFwcygpIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHJldHVybiBhd2FpdCBNYXAuZmluZCh7fSlcclxuXHRcdFx0LnNlbGVjdCgnbWFwSWQgbmFtZSBkcm9wQ2hhbmNlIGRyb3BBbW91bnRFUSB0aWxlcyBpc1dhbGwgaXNIb3N0aWxlIGRhbWFnZSB3YXJwTWFwIHdhcnBYIHdhcnBZJylcclxuXHRcdFx0LmV4ZWMoKVxyXG5cdFx0XHQudGhlbihtYXBzID0+IG1hcHMpXHJcblx0XHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0XHR9XHJcblx0XHRjYXRjaChlcnIpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGFzeW5jIGFkZFBsYXllclRlbXBsYXRlKGRhdGEpIHtcclxuXHRcdGlmICghZGF0YS5uYW1lKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiTmFtZSBpcyByZXF1aXJlZC5cIik7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgY2hlY2tUZW1wbGF0ZSA9IGF3YWl0IFBsYXllclRlbXBsYXRlLmZpbmRPbmUoe25hbWU6IGRhdGEubmFtZX0pXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbih0ZW1wbGF0ZSA9PiB0ZW1wbGF0ZSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblxyXG5cdFx0aWYgKGNoZWNrVGVtcGxhdGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJUZW1wbGF0ZSBhbHJlYWR5IGV4aXN0cyB3aXRoIHRoYXQgbmFtZS5cIik7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCB0ZW1wbGF0ZSA9IG5ldyBQbGF5ZXJUZW1wbGF0ZSh7XHJcblx0XHRcdF9pZDogbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkLFxyXG5cdFx0XHRuYW1lOiBkYXRhLm5hbWUsXHJcblx0XHRcdHNwcml0ZTogZGF0YS5zcHJpdGUsXHJcblx0XHRcdGRhbWFnZUJhc2U6IGRhdGEuZGFtYWdlQmFzZSxcclxuXHRcdFx0ZGVmZW5jZUJhc2U6IGRhdGEuZGVmZW5jZUJhc2UsXHJcblx0XHRcdGhlYWx0aE1heEJhc2U6IGRhdGEuaGVhbHRoTWF4QmFzZSxcclxuXHRcdFx0ZW5lcmd5TWF4QmFzZTogZGF0YS5lbmVyZ3lNYXhCYXNlLFxyXG5cdFx0XHRyYW5nZUJhc2U6IGRhdGEucmFuZ2VCYXNlLFxyXG5cdFx0XHRoZWFsdGhQZXJMZXZlbDogZGF0YS5oZWFsdGhQZXJMZXZlbCxcclxuXHRcdFx0ZW5lcmd5UGVyTGV2ZWw6IGRhdGEuZW5lcmd5UGVyTGV2ZWxcclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBhd2FpdCB0ZW1wbGF0ZS5zYXZlKClcclxuXHRcdC50aGVuKHJlc3VsdCA9PiB0cnVlKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgZ2V0UGxheWVyVGVtcGxhdGUodGVtcGxhdGVJZCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IFBsYXllclRlbXBsYXRlLmZpbmRCeUlkKHRlbXBsYXRlSWQpXHJcblx0XHQuc2VsZWN0KCduYW1lIHNwcml0ZSBkYW1hZ2VCYXNlIGRlZmVuY2VCYXNlIGhlYWx0aE1heEJhc2UgZW5lcmd5TWF4QmFzZSByYW5nZUJhc2UgaGVhbHRoUGVyTGV2ZWwsIGVuZXJneVBlckxldmVsJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHRlbXBsYXRlID0+IHRlbXBsYXRlKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgZ2V0QWxsUGxheWVyVGVtcGxhdGVzKCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IFBsYXllclRlbXBsYXRlLmZpbmQoe30pXHJcblx0XHQuc2VsZWN0KCdfaWQgbmFtZSBzcHJpdGUgZGFtYWdlQmFzZSBkZWZlbmNlQmFzZSBoZWFsdGhNYXhCYXNlIGVuZXJneU1heEJhc2UgcmFuZ2VCYXNlIGhlYWx0aFBlckxldmVsLCBlbmVyZ3lQZXJMZXZlbCcpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbih0ZW1wbGF0ZXMgPT4gdGVtcGxhdGVzKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblxyXG5cdGFzeW5jIGFkZEJvdFRlbXBsYXRlKGRhdGEpIHtcclxuXHRcdGNvbnN0IHRlbXBsYXRlID0gbmV3IEJvdFRlbXBsYXRlKHtcclxuXHRcdFx0X2lkOiBuZXcgbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQsXHJcblx0XHRcdG5hbWU6IGRhdGEubmFtZSxcclxuXHRcdFx0c3ByaXRlOiBkYXRhLnNwcml0ZSxcclxuXHRcdFx0ZGFtYWdlQmFzZTogZGF0YS5kYW1hZ2VCYXNlLFxyXG5cdFx0XHRkZWZlbmNlQmFzZTogZGF0YS5kZWZlbmNlQmFzZSxcclxuXHRcdFx0aGVhbHRoTWF4QmFzZTogZGF0YS5oZWFsdGhNYXhCYXNlLFxyXG5cdFx0XHRlbmVyZ3lNYXhCYXNlOiBkYXRhLmVuZXJneU1heEJhc2UsXHJcblx0XHRcdHJhbmdlQmFzZTogZGF0YS5yYW5nZUJhc2UsXHJcblx0XHRcdGhvc3RpbGU6IGRhdGEuaG9zdGlsZVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIGF3YWl0IHRlbXBsYXRlLnNhdmUoKVxyXG5cdFx0LnRoZW4ocmVzdWx0ID0+IHRydWUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBnZXRCb3RUZW1wbGF0ZSh0ZW1wbGF0ZUlkKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgQm90VGVtcGxhdGUuZmluZEJ5SWQodGVtcGxhdGVJZClcclxuXHRcdC5zZWxlY3QoJ19pZCBuYW1lIHNwcml0ZSBkYW1hZ2VCYXNlIGRlZmVuY2VCYXNlIGhlYWx0aE1heEJhc2UgZW5lcmd5TWF4QmFzZSByYW5nZUJhc2UgaG9zdGlsZScpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbih0ZW1wbGF0ZSA9PiB0ZW1wbGF0ZSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIGdldEFsbEJvdFRlbXBsYXRlcygpIHtcclxuXHRcdHJldHVybiBhd2FpdCBCb3RUZW1wbGF0ZS5maW5kKHt9KVxyXG5cdFx0LnNlbGVjdCgnX2lkIG5hbWUgc3ByaXRlIGRhbWFnZUJhc2UgZGVmZW5jZUJhc2UgaGVhbHRoTWF4QmFzZSBlbmVyZ3lNYXhCYXNlIHJhbmdlQmFzZSBob3N0aWxlJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHRlbXBsYXRlcyA9PiB0ZW1wbGF0ZXMpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHJcblx0YXN5bmMgYWRkSXRlbVR5cGUoZGF0YSkge1xyXG5cdFx0Y29uc3QgdHlwZSA9IG5ldyBJdGVtVHlwZSh7XHJcblx0XHRcdF9pZDogbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkLFxyXG5cdFx0XHRuYW1lOiBkYXRhLm5hbWUsXHJcblx0XHRcdHN0YWNrYWJsZTogZGF0YS5zdGFja2FibGUsXHJcblx0XHRcdGVxdWlwcGVkU2xvdDogZGF0YS5lcXVpcHBlZFNsb3RcclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBhd2FpdCB0eXBlLnNhdmUoKVxyXG5cdFx0LnRoZW4ocmVzdWx0ID0+IHRydWUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBnZXRJdGVtVHlwZSh0eXBlSWQpIHtcclxuXHRcdHJldHVybiBhd2FpdCBJdGVtVHlwZS5maW5kQnlJZCh0eXBlSWQpXHJcblx0XHQuc2VsZWN0KCduYW1lIHN0YWNrYWJsZSBlcXVpcHBlZFNsb3QnKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4odHlwZSA9PiB0eXBlKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgZ2V0QWxsSXRlbVR5cGVzKCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IEl0ZW1UeXBlLmZpbmQoe30pXHJcblx0XHQuc2VsZWN0KCdfaWQgbmFtZSBzdGFja2FibGUgZXF1aXBwZWRTbG90JylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHR5cGVzID0+IHR5cGVzKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblxyXG5cdGFzeW5jIGFkZEl0ZW1UZW1wbGF0ZShkYXRhKSB7XHJcblx0XHRjb25zdCB0ZW1wbGF0ZSA9IG5ldyBJdGVtVGVtcGxhdGUoe1xyXG5cdFx0XHRfaWQ6IG5ldyBtb25nb29zZS5UeXBlcy5PYmplY3RJZCxcclxuXHRcdFx0bmFtZTogZGF0YS5uYW1lLFxyXG5cdFx0XHRzcHJpdGU6IGRhdGEuc3ByaXRlLFxyXG5cdFx0XHRyZXVzYWJsZTogZGF0YS5yZXVzYWJsZSxcclxuXHRcdFx0dHlwZTogZGF0YS50eXBlSWQsXHJcblx0XHRcdHBhc3NpdmVEYW1hZ2U6IGRhdGEucGFzc2l2ZURhbWFnZSxcclxuXHRcdFx0cGFzc2l2ZURlZmVuY2U6IGRhdGEucGFzc2l2ZURlZmVuY2UsXHJcblx0XHRcdHBhc3NpdmVIZWFsdGhNYXg6IGRhdGEucGFzc2l2ZUhlYWx0aE1heCxcclxuXHRcdFx0cGFzc2l2ZUVuZXJneU1heDogZGF0YS5wYXNzaXZlRW5lcmd5TWF4LFxyXG5cdFx0XHRwYXNzaXZlUmFuZ2U6IGRhdGEucGFzc2l2ZVJhbmdlLFxyXG5cdFx0XHRlcXVpcHBlZERhbWFnZTogZGF0YS5lcXVpcHBlZERhbWFnZSxcclxuXHRcdFx0ZXF1aXBwZWREZWZlbmNlOiBkYXRhLmVxdWlwcGVkRGVmZW5jZSxcclxuXHRcdFx0ZXF1aXBwZWRIZWFsdGhNYXg6IGRhdGEuZXF1aXBwZWRIZWFsdGhNYXgsXHJcblx0XHRcdGVxdWlwcGVkRW5lcmd5TWF4OiBkYXRhLmVxdWlwcGVkRW5lcmd5TWF4LFxyXG5cdFx0XHRlcXVpcHBlZFJhbmdlOiBkYXRhLmVxdWlwcGVkUmFuZ2VcclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBhd2FpdCB0ZW1wbGF0ZS5zYXZlKClcclxuXHRcdC50aGVuKHJlc3VsdCA9PiB0cnVlKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgZ2V0SXRlbVRlbXBsYXRlKHRlbXBsYXRlSWQpIHtcclxuXHRcdHJldHVybiBhd2FpdCBJdGVtVGVtcGxhdGUuZmluZEJ5SWQodGVtcGxhdGVJZClcclxuXHRcdC5zZWxlY3QoJ25hbWUgc3ByaXRlIHJldXNhYmxlIHR5cGUgcGFzc2l2ZURhbWFnZSBwYXNzaXZlRGVmZW5jZSBwYXNzaXZlSGVhbHRoTWF4IHBhc3NpdmVFbmVyZ3lNYXhCYXNlIHBhc3NpdmVSYW5nZSBlcXVpcHBlZERhbWFnZSBlcXVpcHBlZERlZmVuY2UgZXF1aXBwZWRIZWFsdGhNYXggZXF1aXBwZWRFbmVyZ3lNYXhCYXNlIGVxdWlwcGVkUmFuZ2UnKVxyXG5cdFx0LnBvcHVsYXRlKCd0eXBlJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHRlbXBsYXRlID0+IHRlbXBsYXRlKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgZ2V0QWxsSXRlbVRlbXBsYXRlcygpIHtcclxuXHRcdHJldHVybiBhd2FpdCBJdGVtVGVtcGxhdGUuZmluZCh7fSlcclxuXHRcdC5zZWxlY3QoJ19pZCBuYW1lIHNwcml0ZSByZXVzYWJsZSB0eXBlIHBhc3NpdmVEYW1hZ2UgcGFzc2l2ZURlZmVuY2UgcGFzc2l2ZUhlYWx0aE1heCBwYXNzaXZlRW5lcmd5TWF4QmFzZSBwYXNzaXZlUmFuZ2UgZXF1aXBwZWREYW1hZ2UgZXF1aXBwZWREZWZlbmNlIGVxdWlwcGVkSGVhbHRoTWF4IGVxdWlwcGVkRW5lcmd5TWF4QmFzZSBlcXVpcHBlZFJhbmdlJylcclxuXHRcdC5wb3B1bGF0ZSgndHlwZScpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbih0ZW1wbGF0ZXMgPT4gdGVtcGxhdGVzKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblxyXG5cdGFzeW5jIGFkZEl0ZW0oZGF0YSkge1xyXG5cdFx0bGV0IHRlbXBsYXRlID0gYXdhaXQgdGhpcy5nZXRJdGVtVGVtcGxhdGUoZGF0YS50ZW1wbGF0ZUlkKTtcclxuXHRcdGlmICghdGVtcGxhdGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJJdGVtIFRlbXBsYXRlIGRvZXMgbm90IGV4aXN0IHdpdGggdGhhdCBpZC5cIik7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHRcdGxldCBfaWQgPSBkYXRhLml0ZW1JZDtcclxuXHRcdGlmICghX2lkKSBfaWQgPSBuZXcgbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQ7XHJcblxyXG5cdFx0Y29uc3QgaXRlbSA9IG5ldyBJdGVtKHtcclxuXHRcdFx0X2lkLFxyXG5cdFx0XHR0ZW1wbGF0ZTogZGF0YS50ZW1wbGF0ZUlkLFxyXG5cdFx0XHRzdGFjazogZGF0YS5zdGFjayxcclxuXHRcdFx0cGxheWVySWQ6IGRhdGEucGxheWVySWQsXHJcblx0XHRcdGJvdElkOiBkYXRhLmJvdElkLFxyXG5cdFx0XHRzbG90OiBkYXRhLnNsb3QsXHJcblx0XHRcdG1hcElkOiBkYXRhLm1hcElkLFxyXG5cdFx0XHR4OiBkYXRhLngsXHJcblx0XHRcdHk6IGRhdGEueSxcclxuXHRcdFx0Y3JlYXRlZEJ5OiBkYXRhLmNyZWF0ZWRCeSxcclxuXHRcdFx0Y3JlYXRlZERhdGU6IGRhdGEuY3JlYXRlZERhdGVcclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBhd2FpdCBpdGVtLnNhdmUoKVxyXG5cdFx0LnRoZW4ocmVzdWx0ID0+IHRydWUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBnZXRJdGVtKGl0ZW1JZCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IEl0ZW0uZmluZE9uZSh7X2lkOiBpdGVtSWR9KVxyXG5cdFx0LnNlbGVjdCgnX2lkIHRlbXBsYXRlIHN0YWNrIHBsYXllcklkIGJvdElkIHNsb3QgbWFwSWQgeCB5IGNyZWF0ZWREYXRlIGNyZWF0ZWRCeScpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbihpdGVtID0+IGl0ZW0pXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBzYXZlSXRlbShkYXRhKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgSXRlbS51cGRhdGVPbmUoe19pZDogZGF0YS5pdGVtSWR9LCB7JHNldDogZGF0YX0sIHt1cHNlcnQ6IHRydWV9KVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4ocmVzdWx0ID0+IHRydWUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBnZXRBbGxJdGVtcygpIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHJldHVybiBhd2FpdCBJdGVtLmZpbmQoe30pXHJcblx0XHRcdC5zZWxlY3QoJ19pZCB0ZW1wbGF0ZSBzdGFjayBwbGF5ZXJJZCBib3RJZCBzbG90IG1hcElkIHggeSBjcmVhdGVkRGF0ZSBjcmVhdGVkQnknKVxyXG5cdFx0XHQucG9wdWxhdGUoJ3RlbXBsYXRlJylcclxuXHRcdFx0LmV4ZWMoKVxyXG5cdFx0XHQudGhlbihpdGVtcyA9PiBpdGVtcylcclxuXHRcdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHRcdH1cclxuXHRcdGNhdGNoKGVycikge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRhc3luYyBzYXZlQWxsSXRlbXMoY3VycmVudEl0ZW1zKSB7XHJcblx0XHRpZiAoIWN1cnJlbnRJdGVtcykgcmV0dXJuO1xyXG5cclxuXHRcdGxldCBzYXZlZEl0ZW1zID0gYXdhaXQgdGhpcy5nZXRBbGxJdGVtcygpO1xyXG5cdFx0Y29uc3QgbmV3SXRlbXMgPSBjdXJyZW50SXRlbXMuZmlsdGVyKGl0ZW0gPT4gIXNhdmVkSXRlbXMuZmluZChzYXZlZEl0ZW0gPT4gc2F2ZWRJdGVtLl9pZCA9PT0gaXRlbS5pdGVtSWQpKTtcclxuXHRcdGNvbnN0IGV4aXN0aW5nSXRlbXMgPSBjdXJyZW50SXRlbXMuZmlsdGVyKGl0ZW0gPT4gc2F2ZWRJdGVtcy5maW5kKHNhdmVkSXRlbSA9PiBzYXZlZEl0ZW0uX2lkID09PSBpdGVtLml0ZW1JZCkpO1xyXG5cdFx0Y29uc3QgZGVsZXRlSXRlbXMgPSBzYXZlZEl0ZW1zLmZpbHRlcihpdGVtID0+ICFleGlzdGluZ0l0ZW1zLmZpbmQoZXhpc3RpbmdJdGVtID0+IGV4aXN0aW5nSXRlbS5pdGVtSWQgPT09IGl0ZW0uX2lkKSk7XHJcblx0XHRjb25zdCB1cGRhdGVJdGVtcyA9IGV4aXN0aW5nSXRlbXMuZmlsdGVyKGl0ZW0gPT4gIWRlbGV0ZUl0ZW1zLmluY2x1ZGVzKGl0ZW0pKTtcclxuXHRcdFxyXG5cdFx0Ly8gQWRkIG5ldyBJdGVtc1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBuZXdJdGVtcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR0aGlzLmFkZEl0ZW0obmV3SXRlbXNbaV0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIERlbGV0ZSByZW1vdmVkIEl0ZW1zXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGRlbGV0ZUl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdEl0ZW0uZGVsZXRlT25lKHtfaWQ6IGRlbGV0ZUl0ZW1zW2ldLl9pZH0sIGVyciA9PiB7XHJcblx0XHRcdFx0aWYgKGVycikgY29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gVXBkYXRlIHRoZSByZXN0XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHVwZGF0ZUl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IGl0ZW0gPSB1cGRhdGVJdGVtc1tpXTtcclxuXHRcdFx0aWYgKCFpdGVtKSBjb250aW51ZTtcclxuXHRcdFx0dGhpcy5zYXZlSXRlbShpdGVtKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmNvbnN0IGRiID0gbmV3IERhdGFiYXNlKCk7XHJcbmV4cG9ydCBkZWZhdWx0IGRiO1xyXG4iLCJpbXBvcnQgZGIgZnJvbSAnLi9kYi5qcyc7XHJcbmltcG9ydCBjb25maWcgZnJvbSAnLi9jb25maWcuanMnO1xyXG5cclxuaW1wb3J0IE1hcCBmcm9tICcuL2NsYXNzZXMvbWFwLmpzJztcclxuaW1wb3J0IFBsYXllciBmcm9tICcuL2NsYXNzZXMvcGxheWVyLmpzJztcclxuaW1wb3J0IEJvdCBmcm9tICcuL2NsYXNzZXMvYm90LmpzJztcclxuaW1wb3J0IEl0ZW0gZnJvbSAnLi9jbGFzc2VzL2l0ZW0uanMnO1xyXG5pbXBvcnQgRWZmZWN0IGZyb20gJy4vY2xhc3Nlcy9lZmZlY3QuanMnO1xyXG5pbXBvcnQgVGV4dCBmcm9tICcuL2NsYXNzZXMvdGV4dC5qcyc7XHJcbmltcG9ydCBNZXNzYWdlIGZyb20gJy4vY2xhc3Nlcy9tZXNzYWdlLmpzJztcclxuXHJcbmNsYXNzIEdhbWUge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0dGhpcy5tYXBzID0gW107XHJcblx0XHR0aGlzLnBsYXllcnMgPSBbXTtcclxuXHRcdHRoaXMuYm90cyA9IFtdO1xyXG5cdFx0dGhpcy5pdGVtcyA9IFtdO1xyXG5cdFx0dGhpcy5lZmZlY3RzID0gW107XHJcblx0XHR0aGlzLnRleHRzID0gW107XHJcblx0XHR0aGlzLm1lc3NhZ2VRdWV1ZSA9IFtdO1xyXG5cdFx0XHJcblx0XHR0aGlzLnBsYXllclRlbXBsYXRlcyA9IHt9O1xyXG5cdFx0dGhpcy5ib3RUZW1wbGF0ZXMgPSB7fTtcclxuXHRcdHRoaXMuaXRlbVRlbXBsYXRlcyA9IHt9O1xyXG5cclxuXHRcdHRoaXMubG9hZE1hcHMoKTtcclxuXHRcdHRoaXMubG9hZFBsYXllclRlbXBsYXRlcygpO1xyXG5cdFx0dGhpcy5sb2FkQm90VGVtcGxhdGVzKCk7XHJcblx0XHR0aGlzLmxvYWRJdGVtVGVtcGxhdGVzKCk7XHJcblx0XHR0aGlzLmxvYWRDb21tYW5kcygpO1xyXG5cdFx0dGhpcy5sb2FkSXRlbXMoKTtcclxuXHRcdHRoaXMubG9hZEJvdHMoKTtcclxuXHR9XHJcblxyXG5cdGxvYWRNYXBzKCkge1xyXG5cdFx0ZGIuZ2V0QWxsTWFwcygpXHJcblx0XHQudGhlbihtYXBEYXRhID0+IHtcclxuXHRcdFx0Y29uc3Qgb3JkZXJlZE1hcERhdGEgPSBbXTtcclxuXHRcdFx0Zm9yIChsZXQgaWQgPSAwOyBpZCA8IG1hcERhdGEubGVuZ3RoOyBpZCsrKSB7XHJcblx0XHRcdFx0Y29uc3QgZGF0YSA9IG1hcERhdGFbaWRdO1xyXG5cdFx0XHRcdGlmIChkYXRhKSBvcmRlcmVkTWFwRGF0YVtkYXRhLm1hcElkXSA9IGRhdGE7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZvciAobGV0IGlkID0gMDsgaWQgPCBjb25maWcuTUFYX01BUFM7IGlkKyspIHtcclxuXHRcdFx0XHRpZiAob3JkZXJlZE1hcERhdGFbaWRdKSB7XHJcblx0XHRcdFx0XHR0aGlzLm1hcHNbaWRdID0gbmV3IE1hcChpZCwgb3JkZXJlZE1hcERhdGFbaWRdKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1hcHNbaWRdID0gbmV3IE1hcChpZCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblxyXG5cdGxvYWRQbGF5ZXJUZW1wbGF0ZXMoKSB7XHJcblx0XHRkYi5nZXRBbGxQbGF5ZXJUZW1wbGF0ZXMoKVxyXG5cdFx0LnRoZW4odGVtcGxhdGVzID0+IHtcclxuXHRcdFx0dGhpcy5wbGF5ZXJUZW1wbGF0ZXMgPSB7fTtcclxuXHRcdFx0dGVtcGxhdGVzLmZvckVhY2godGVtcGxhdGUgPT4ge1xyXG5cdFx0XHRcdHRoaXMucGxheWVyVGVtcGxhdGVzW3RlbXBsYXRlLl9pZF0gPSB0ZW1wbGF0ZTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KS5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cclxuXHRsb2FkQm90VGVtcGxhdGVzKCkge1xyXG5cdFx0ZGIuZ2V0QWxsQm90VGVtcGxhdGVzKClcclxuXHRcdC50aGVuKHRlbXBsYXRlcyA9PiB7XHJcblx0XHRcdHRoaXMuYm90VGVtcGxhdGVzID0ge307XHJcblx0XHRcdHRlbXBsYXRlcy5mb3JFYWNoKHRlbXBsYXRlID0+IHtcclxuXHRcdFx0XHR0aGlzLmJvdFRlbXBsYXRlc1t0ZW1wbGF0ZS5faWRdID0gdGVtcGxhdGU7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSkuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHJcblx0bG9hZEl0ZW1UZW1wbGF0ZXMoKSB7XHJcblx0XHRkYi5nZXRBbGxJdGVtVGVtcGxhdGVzKClcclxuXHRcdC50aGVuKHRlbXBsYXRlcyA9PiB7XHJcblx0XHRcdHRoaXMuaXRlbVRlbXBsYXRlcyA9IHt9O1xyXG5cdFx0XHR0ZW1wbGF0ZXMuZm9yRWFjaCh0ZW1wbGF0ZSA9PiB7XHJcblx0XHRcdFx0dGhpcy5pdGVtVGVtcGxhdGVzW3RlbXBsYXRlLl9pZF0gPSB0ZW1wbGF0ZTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KS5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cclxuXHRsb2FkQ29tbWFuZHMoKSB7XHJcblx0XHR0aGlzLmNvbW1hbmRzID0ge1xyXG5cdFx0XHRtb3ZlOiAoZGF0YSwgcGxheWVyKSA9PiBwbGF5ZXIuaW5wdXQuZGlyZWN0aW9uID0gZGF0YS5kaXJlY3Rpb24sXHJcblx0XHRcdHJ1bjogKGRhdGEsIHBsYXllcikgPT4gcGxheWVyLmlucHV0LnJ1biA9IGRhdGEuc3RhdGUsXHJcblx0XHRcdHBpY2t1cDogKGRhdGEsIHBsYXllcikgPT4ge1xyXG5cdFx0XHRcdGlmICghcGxheWVyLmlucHV0LnBpY2t1cCAmJiBkYXRhLnN0YXRlKSBwbGF5ZXIucGlja1VwKCk7XHJcblx0XHRcdFx0cGxheWVyLmlucHV0LnBpY2t1cCA9IGRhdGEuc3RhdGU7XHJcblx0XHRcdH0sXHJcblx0XHRcdGF0dGFjazogKGRhdGEsIHBsYXllcikgPT4ge1xyXG5cdFx0XHRcdHBsYXllci5pbnB1dC5hdHRhY2sgPSBkYXRhLnN0YXRlO1xyXG5cdFx0XHRcdHBsYXllci5hdHRhY2soMSwgcGxheWVyLmRpcmVjdGlvbik7XHJcblx0XHRcdH0sXHJcblx0XHRcdGRvdWJsZUNsaWNrSXRlbTogKGRhdGEsIHBsYXllcikgPT4gcGxheWVyLnVzZUl0ZW0oZGF0YS5zbG90KSxcclxuXHRcdFx0cmlnaHRDbGlja0l0ZW06IChkYXRhLCBwbGF5ZXIpID0+IHBsYXllci5kcm9wSXRlbShkYXRhLnNsb3QpLFxyXG5cdFx0XHRkcmFnU3RvcEdhbWU6IChkYXRhLCBwbGF5ZXIpID0+IHBsYXllci5kcm9wSXRlbShkYXRhLnNsb3QpLFxyXG5cdFx0XHRkcmFnU3RvcEludmVudG9yeTogKGRhdGEsIHBsYXllcikgPT4gcGxheWVyLm1vdmVJdGVtVG9TbG90KGRhdGEuc2xvdCwgZGF0YS5uZXdTbG90KSxcclxuXHRcdFx0ZHJhZ1N0b3BFcXVpcG1lbnQ6IChkYXRhLCBwbGF5ZXIpID0+IHBsYXllci5tb3ZlSXRlbVRvU2xvdChkYXRhLnNsb3QsIGRhdGEubmV3U2xvdCksXHJcblx0XHRcdHNlcnZlckNoYXQ6IChkYXRhLCBwbGF5ZXIpID0+IGdhbWUuc2VuZE1lc3NhZ2VHbG9iYWwocGxheWVyLmdhbWVJZCwgYCR7cGxheWVyLm5hbWV9IHllbGxzLCBcIiR7ZGF0YS5tZXNzYWdlfVwiYCksXHJcblx0XHRcdG1hcENoYXQ6IChkYXRhLCBwbGF5ZXIpID0+IGdhbWUuc2VuZE1lc3NhZ2VNYXAocGxheWVyLmdhbWVJZCwgcGxheWVyLm1hcElkLCBgJHtwbGF5ZXIubmFtZX0gc2F5cywgXCIke2RhdGEubWVzc2FnZX1cImApLFxyXG5cdFx0XHRwbGF5ZXJDaGF0OiAoZGF0YSwgcGxheWVyKSA9PiB7XHJcblx0XHRcdFx0Y29uc3QgdGFyZ2V0ID0gZ2FtZS5wbGF5ZXJzW2RhdGEudGFyZ2V0SWRdO1xyXG5cdFx0XHRcdGlmICh0YXJnZXQpIHtcclxuXHRcdFx0XHRcdGdhbWUuc2VuZE1lc3NhZ2VQbGF5ZXIocGxheWVyLmdhbWVJZCwgdGFyZ2V0LmdhbWVJZCwgYCR7cGxheWVyLm5hbWV9IHdoaXNwZXJzLCBcIiR7ZGF0YS5tZXNzYWdlfVwiYCk7XHJcblx0XHRcdFx0XHRnYW1lLnNlbmRNZXNzYWdlUGxheWVyKHBsYXllci5nYW1lSWQsIHBsYXllci5nYW1lSWQsIGBZb3Ugd2hpc3BlciB0byAke3RhcmdldC5uYW1lfSwgXCIke2RhdGEubWVzc2FnZX1cImApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0bWFjcm8xOiAoZGF0YSkgPT4ge1xyXG5cdFx0XHRcdGlmIChkYXRhKSB0aGlzLnNwYXduTWFwSXRlbSgxLCA1LCA1LCBcIjVjMWJmZWI3ZDhmYjYwMTJjYzk2NjA4M1wiKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0bWFjcm8yOiAoZGF0YSkgPT4ge1xyXG5cdFx0XHRcdGlmIChkYXRhKSB0aGlzLnNwYXduQm90KDEsIDUsIDUsIFwiNWMxYmVjZGUyOGQwNWIwNzdjYmFhMzg1XCIpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRtYWNybzM6IChkYXRhKSA9PiB7XHJcblx0XHRcdFx0aWYgKGRhdGEpIHtcclxuXHRcdFx0XHRcdGlmIChwbGF5ZXIuc3ByaXRlID49IGNvbmZpZy5NQVhfU1BSSVRFUykgcGxheWVyLnNwcml0ZSA9IDE7XHJcblx0XHRcdFx0XHRlbHNlIHBsYXllci5zcHJpdGUrKztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdG1hY3JvNDogKGRhdGEpID0+IHtcclxuXHRcdFx0fSxcclxuXHJcblx0XHR9O1xyXG5cdFx0XHJcblx0XHR0aGlzLmdvZENvbW1hbmRzID0ge1xyXG5cdFx0XHRzcGF3bk1hcEl0ZW06IChkYXRhKSA9PiB0aGlzLnNwYXduTWFwSXRlbShkYXRhLmFyZ3NbMF0sIGRhdGEuYXJnc1sxXSwgZGF0YS5hcmdzWzJdLCBkYXRhLmFyZ3NbM10sIGRhdGEuYXJnc1s0XSksXHJcblx0XHRcdHNwYXduQm90OiAoZGF0YSkgPT4gdGhpcy5zcGF3bkJvdChkYXRhLmFyZ3NbMF0sIGRhdGEuYXJnc1sxXSwgZGF0YS5hcmdzWzJdLCBkYXRhLmFyZ3NbM10sIGRhdGEuYXJnc1s0XSksXHJcblx0XHRcdHNldFNwcml0ZTogKGRhdGEsIHBsYXllcikgPT4gcGxheWVyLnNwcml0ZSA9IGRhdGEuYXJnc1swXVxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdGFzeW5jIGxvYWRJdGVtcygpIHtcclxuXHRcdGxldCBpdGVtRGF0YSA9IGF3YWl0IGRiLmdldEFsbEl0ZW1zKCk7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1EYXRhLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdG5ldyBJdGVtKGl0ZW1EYXRhW2ldKTtcclxuXHRcdH1cclxuXHR9XHJcblx0YXN5bmMgbG9hZEJvdHMoKSB7XHJcblx0XHRsZXQgYm90RGF0YSA9IGF3YWl0IGRiLmdldEFsbEJvdHMoKTtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYm90RGF0YS5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRuZXcgQm90KGJvdERhdGFbaV0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRyZXF1ZXN0REJJZCgpIHtcclxuXHRcdHJldHVybiBkYi5nZW5lcmF0ZUlkKCk7XHJcblx0fVxyXG5cclxuXHR1cGRhdGUoZGVsdGEpIHtcclxuXHRcdGNvbnN0IHBhY2sgPSB7XHJcblx0XHRcdHBsYXllcnM6IFtdLFxyXG5cdFx0XHRib3RzOiBbXSxcclxuXHRcdFx0aXRlbXM6IFtdLFxyXG5cdFx0XHRlZmZlY3RzOiBbXSxcclxuXHRcdFx0dGV4dHM6IFtdLFxyXG5cdFx0XHRtZXNzYWdlczogW10uY29uY2F0KHRoaXMubWVzc2FnZVF1ZXVlKVxyXG5cdFx0fTtcclxuXHRcdHRoaXMubWVzc2FnZVF1ZXVlID0gW107XHJcblxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBsYXllcnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgcGxheWVyID0gdGhpcy5wbGF5ZXJzW2ldO1xyXG5cdFx0XHRpZiAocGxheWVyICE9IG51bGwpIHBhY2sucGxheWVyc1twbGF5ZXIuZ2FtZUlkXSA9IHBsYXllci51cGRhdGUoZGVsdGEpO1xyXG5cdFx0fVxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmJvdHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgYm90ID0gdGhpcy5ib3RzW2ldO1xyXG5cdFx0XHRpZiAoYm90KSBwYWNrLmJvdHNbYm90LmdhbWVJZF0gPSBib3QudXBkYXRlKGRlbHRhKTtcclxuXHRcdH1cclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pdGVtcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRjb25zdCBpdGVtID0gdGhpcy5pdGVtc1tpXTtcclxuXHRcdFx0aWYgKGl0ZW0pIHBhY2suaXRlbXNbaXRlbS5nYW1lSWRdID0gaXRlbS51cGRhdGUoZGVsdGEpO1xyXG5cdFx0fVxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmVmZmVjdHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgZWZmZWN0ID0gdGhpcy5lZmZlY3RzW2ldO1xyXG5cdFx0XHRpZiAoZWZmZWN0KSBwYWNrLmVmZmVjdHNbZWZmZWN0LmlkXSA9IGVmZmVjdC51cGRhdGUoZGVsdGEpO1xyXG5cdFx0fVxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRleHRzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IHRleHQgPSB0aGlzLnRleHRzW2ldO1xyXG5cdFx0XHRpZiAodGV4dCkgcGFjay50ZXh0c1t0ZXh0LmdhbWVJZF0gPSB0ZXh0LnVwZGF0ZShkZWx0YSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcGFjaztcclxuXHR9XHJcblxyXG5cdGdldERCUGFjaygpIHtcclxuXHRcdGNvbnN0IGRiUGFjayA9IHtcclxuXHRcdFx0cGxheWVyczogW10sXHJcblx0XHRcdGJvdHM6IFtdLFxyXG5cdFx0XHRpdGVtczogW11cclxuXHRcdH07XHJcblx0XHR0aGlzLnBsYXllcnMuZm9yRWFjaChwbGF5ZXIgPT4gZGJQYWNrLnBsYXllcnMucHVzaChwbGF5ZXIuZ2V0REJQYWNrKCkpKTtcclxuXHRcdHRoaXMuYm90cy5mb3JFYWNoKGJvdCA9PiBkYlBhY2suYm90cy5wdXNoKGJvdC5nZXREQlBhY2soKSkpO1xyXG5cdFx0dGhpcy5pdGVtcy5mb3JFYWNoKGl0ZW0gPT4gZGJQYWNrLml0ZW1zLnB1c2goaXRlbS5nZXREQlBhY2soKSkpO1xyXG5cdFx0cmV0dXJuIGRiUGFjaztcclxuXHR9XHJcblxyXG5cdC8vIFBsYXllcnNcclxuXHRwbGF5ZXJMb2dpbihzb2NrZXRJZCwgZGF0YSkge1xyXG5cdFx0Zm9yIChsZXQgcGxheWVyIG9mIHRoaXMucGxheWVycykge1xyXG5cdFx0XHRpZiAocGxheWVyICYmIHBsYXllci5uYW1lID09PSBkYXRhLm5hbWUpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIlBsYXllciBpcyBhbHJlYWR5IHNpZ25lZCBpbi5cIik7XHJcblx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBwbGF5ZXIgPSBuZXcgUGxheWVyKHNvY2tldElkLCBkYXRhKTtcclxuXHRcdGRiLmxvZyhgJHtzb2NrZXRJZH0gLSAke3BsYXllci5uYW1lfSBoYXMgbG9nZ2VkIGluLmApO1xyXG5cdFx0dGhpcy5zZW5kR2FtZUluZm9HbG9iYWwoYCR7cGxheWVyLm5hbWV9IGhhcyBsb2dnZWQgaW4uYCk7XHJcblx0XHRyZXR1cm4gcGxheWVyO1xyXG5cdH1cclxuXHRwbGF5ZXJMb2dvdXQocGxheWVySWQpIHtcclxuXHRcdGxldCBwbGF5ZXIgPSB0aGlzLnBsYXllcnNbcGxheWVySWRdO1xyXG5cdFx0aWYgKHBsYXllcikge1xyXG5cdFx0XHRjb25zdCBwbGF5ZXJEYXRhID0gcGxheWVyLmdldERCUGFjaygpXHJcblx0XHRcdGRiLmxvZyhgJHtwbGF5ZXIuc29ja2V0SWR9IC0gJHtwbGF5ZXIubmFtZX0gaGFzIGxvZ2dlZCBvdXQuYCk7XHJcblx0XHRcdHRoaXMuc2VuZEdhbWVJbmZvR2xvYmFsKGAke3BsYXllci5uYW1lfSBoYXMgbG9nZ2VkIG91dC5gKTtcclxuXHRcdFx0ZGVsZXRlIHRoaXMudGV4dHNbcGxheWVyLmRpc3BsYXlOYW1lSWRdO1xyXG5cdFx0XHRkZWxldGUgdGhpcy5wbGF5ZXJzW3BsYXllcklkXTtcclxuXHRcdFx0ZGIuc2F2ZVBsYXllcihwbGF5ZXJEYXRhKTtcclxuXHRcdH1cclxuXHR9XHJcblx0Z2V0RXhwVG9MZXZlbChsZXZlbCkge1xyXG5cdFx0bGV0IGV4cCA9IDEwO1xyXG5cdFx0Zm9yIChsZXQgaSA9IDE7IGkgPCBjb25maWcuTUFYX0xFVkVMOyBpKyspIHtcclxuXHRcdFx0aWYgKGkgPT09IGxldmVsKSByZXR1cm4gZXhwO1xyXG5cdFx0XHRleHAgPSAoZXhwICsgKGV4cCAlIDIpKSAqIDEuNTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIEdhbWUgSW5mb1xyXG5cdHNlbmRHYW1lSW5mb0dsb2JhbChtZXNzYWdlKSB7XHJcblx0XHR0aGlzLm1lc3NhZ2VRdWV1ZS5wdXNoKG5ldyBNZXNzYWdlKG51bGwsIG1lc3NhZ2UsICdnYW1lSW5mbycpKTtcclxuXHR9XHJcblx0c2VuZEdhbWVJbmZvTWFwKG1hcElkLCBtZXNzYWdlKSB7XHJcblx0XHR0aGlzLm1lc3NhZ2VRdWV1ZS5wdXNoKG5ldyBNZXNzYWdlKG51bGwsIG1lc3NhZ2UsICdnYW1lSW5mbycsIG1hcElkKSk7XHJcblx0fVxyXG5cdHNlbmRHYW1lSW5mb1BsYXllcihpZCwgbWVzc2FnZSkge1xyXG5cdFx0dGhpcy5tZXNzYWdlUXVldWUucHVzaChuZXcgTWVzc2FnZShudWxsLCBtZXNzYWdlLCAnZ2FtZUluZm8nLCBudWxsLCBpZCkpO1xyXG5cdH1cclxuXHRcclxuXHQvLyBDaGF0IE1lc3NhZ2VzXHJcblx0c2VuZE1lc3NhZ2VHbG9iYWwoc2VuZGVySWQsIG1lc3NhZ2UpIHtcclxuXHRcdHRoaXMubWVzc2FnZVF1ZXVlLnB1c2gobmV3IE1lc3NhZ2Uoc2VuZGVySWQsIG1lc3NhZ2UsICdtZXNzYWdlR2xvYmFsJykpO1xyXG5cdH1cclxuXHRzZW5kTWVzc2FnZU1hcChzZW5kZXJJZCwgbWFwSWQsIG1lc3NhZ2UpIHtcclxuXHRcdHRoaXMubWVzc2FnZVF1ZXVlLnB1c2gobmV3IE1lc3NhZ2Uoc2VuZGVySWQsIG1lc3NhZ2UsICdtZXNzYWdlTWFwJywgbWFwSWQpKTtcclxuXHR9XHJcblx0c2VuZE1lc3NhZ2VQbGF5ZXIoc2VuZGVySWQsIGlkLCBtZXNzYWdlKSB7XHJcblx0XHR0aGlzLm1lc3NhZ2VRdWV1ZS5wdXNoKG5ldyBNZXNzYWdlKHNlbmRlcklkLCBtZXNzYWdlLCAnbWVzc2FnZVBsYXllcicsIG51bGwsIGlkKSk7XHJcblx0fVxyXG5cclxuXHQvLyBNYXBcclxuXHRpc1ZhY2FudChtYXBJZCwgeCwgeSkge1xyXG5cdFx0Ly8gQ2hlY2sgZm9yIE1hcCBFZGdlc1xyXG5cdFx0aWYgKHggPCAwIHx8IHggPj0gY29uZmlnLk1BUF9DT0xVTU5TIHx8IHkgPCAwIHx8IHkgPj0gY29uZmlnLk1BUF9ST1dTKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcclxuXHRcdC8vIENoZWNrIGZvciBXYWxsIFRpbGVzXHJcblx0XHRjb25zdCBtYXAgPSB0aGlzLm1hcHNbbWFwSWRdO1xyXG5cdFx0aWYgKG1hcC5pc1dhbGxbeV1beF0pIHJldHVybiBmYWxzZTtcclxuXHRcdFxyXG5cdFx0Ly8gQ2hlY2sgZm9yIEFjdG9yc1xyXG5cdFx0Y29uc3QgYWN0b3JMaXN0ID0gdGhpcy5wbGF5ZXJzLmNvbmNhdCh0aGlzLmJvdHMpO1xyXG5cdFx0Y29uc3QgYWN0b3JzT25UaWxlID0gYWN0b3JMaXN0LmZpbHRlcihhY3RvciA9PiB7XHJcblx0XHRcdHJldHVybiBhY3Rvci5tYXBJZCA9PT0gbWFwSWQgJiYgYWN0b3IueCA9PT0geCAmJiBhY3Rvci55ID09PSB5ICYmICFhY3Rvci5pc0RlYWQ7XHJcblx0XHR9KTtcclxuXHRcdGlmIChhY3RvcnNPblRpbGUubGVuZ3RoID4gMCkgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHJcblx0c3Bhd25Cb3QobWFwSWQsIHgsIHksIHRlbXBsYXRlSWQsIGRpcmVjdGlvbiA9ICdkb3duJykge1xyXG5cdFx0Y29uc3QgdGVtcGxhdGUgPSB0aGlzLmJvdFRlbXBsYXRlc1t0ZW1wbGF0ZUlkXTtcclxuXHRcdGlmICh0ZW1wbGF0ZSkge1xyXG5cdFx0XHRuZXcgQm90KHttYXBJZCwgeCwgeSwgZGlyZWN0aW9uLCB0ZW1wbGF0ZX0pO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiQm90IFRlbXBsYXRlIGRvZXMgbm90IGV4aXN0IHdpdGggdGhhdCBJZFwiKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0c3Bhd25NYXBJdGVtKG1hcElkLCB4LCB5LCB0ZW1wbGF0ZUlkLCBzdGFjayA9IDApIHtcclxuXHRcdGxldCB0ZW1wbGF0ZSA9IHRoaXMuaXRlbVRlbXBsYXRlc1t0ZW1wbGF0ZUlkXTtcclxuXHRcdGlmICh0ZW1wbGF0ZSkge1xyXG5cdFx0XHRuZXcgSXRlbSh7bWFwSWQsIHgsIHksIHRlbXBsYXRlLCBzdGFja30pO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiSXRlbSBUZW1wbGF0ZSBkb2VzIG5vdCBleGlzdCB3aXRoIHRoYXQgSWRcIik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzcGF3bkRhbWFnZVRleHQobWFwSWQsIHgsIHksIGRhbWFnZSkge1xyXG5cdFx0bmV3IFRleHQobWFwSWQsIHgsIHkgKyAwLjUsIGRhbWFnZSwgJyNmZjAwMDAnLCAxLjI1LCAwLCAtMSk7XHJcblx0fVxyXG5cclxuXHRzcGF3bkVmZmVjdChtYXBJZCwgeCwgeSwgc3ByaXRlLCBsb29wLCBzcGVlZCwgbWF4RnJhbWUsIHN0YXJ0RnJhbWUpIHtcclxuXHRcdG5ldyBFZmZlY3QobWFwSWQsIHgsIHksIHNwcml0ZSwgbG9vcCwgc3BlZWQsIG1heEZyYW1lLCBzdGFydEZyYW1lKTtcclxuXHR9XHJcbn1cclxuXHJcbmNvbnN0IGdhbWUgPSBuZXcgR2FtZSgpO1xyXG5leHBvcnQgZGVmYXVsdCBnYW1lO1xyXG4iLCIvKioqIEdhbWUgTG9vcCAqKiovXHJcbi8qIEtlZXBzIHRyYWNrIG9mIHRpbWUgYW5kIGNvLW9yZGluYXRlcyB0aGUgZ2FtZSBhbmQgc2VydmVyICovXHJcblxyXG5pbXBvcnQgTm9kZUdhbWVMb29wIGZyb20gJ25vZGUtZ2FtZWxvb3AnO1xyXG5cclxuaW1wb3J0IGRiIGZyb20gJy4vZGIuanMnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuL2dhbWUuanMnO1xyXG5pbXBvcnQgc2VydmVyIGZyb20gJy4vc2VydmVyLmpzJztcclxuaW1wb3J0IGNvbmZpZyBmcm9tICcuL2NvbmZpZy5qcyc7XHJcblxyXG5jbGFzcyBHYW1lTG9vcCB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHR0aGlzLnRpbWVyID0ge1xyXG5cdFx0XHRiYWNrdXA6IDAsXHJcblx0XHRcdG1pbnV0ZTogMFxyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLmlkID0gTm9kZUdhbWVMb29wLnNldEdhbWVMb29wKChkZWx0YSkgPT4gdGhpcy51cGRhdGUoZGVsdGEpLCBjb25maWcuRlJBTUVSQVRFKTtcclxuXHR9XHJcblxyXG5cdHVwZGF0ZShkZWx0YSkge1xyXG5cdFx0Ly8gSW5jcmVhc2UgVGltZXJzXHJcblx0XHR0aGlzLnRpbWVyLmJhY2t1cCArPSBkZWx0YTtcclxuXHRcdHRoaXMudGltZXIubWludXRlICs9IGRlbHRhO1xyXG5cclxuXHRcdC8vIFVwZGF0ZSB0aGUgZ2FtZSBzdGF0ZVxyXG5cdFx0bGV0IHVwZGF0ZVBhY2sgPSBnYW1lLnVwZGF0ZShkZWx0YSk7XHJcblx0XHQvLyBTZW5kIHVwZGF0ZWQgc3RhdGUgdG8gY2xpZW50c1xyXG5cdFx0c2VydmVyLnNlbmRVcGRhdGVQYWNrKHVwZGF0ZVBhY2spO1xyXG5cdFx0XHJcblx0XHQvLyBNaW51dGUgdGltZXIgc2NyaXB0XHJcblx0XHRpZiAodGhpcy50aW1lci5taW51dGUgPj0gNjApIHtcclxuXHRcdFx0dGhpcy50aW1lci5taW51dGUgLT0gNjA7XHJcblx0XHRcdC8vIFRPRE86IHJ1biBtaW51dGUgdGltZXIgc2NyaXB0XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gUGVyaW9kaWMgYmFja3VwIHRvIGRhdGFiYXNlXHJcblx0XHRpZiAodGhpcy50aW1lci5iYWNrdXAgPj0gY29uZmlnLkJBQ0tVUF9USU1FKSB7XHJcblx0XHRcdHRoaXMudGltZXIuYmFja3VwIC09IGNvbmZpZy5CQUNLVVBfVElNRTtcclxuXHRcdFx0bGV0IGRiUGFjayA9IGdhbWUuZ2V0REJQYWNrKCk7XHJcblx0XHRcdGRiLmJhY2t1cChkYlBhY2spO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuY29uc3QgZ2FtZUxvb3AgPSBuZXcgR2FtZUxvb3AoKTtcclxuZXhwb3J0IGRlZmF1bHQgZ2FtZUxvb3A7XHJcbiIsImltcG9ydCBkYiBmcm9tICcuL2RiLmpzJztcclxuaW1wb3J0IGdhbWUgZnJvbSAnLi9nYW1lLmpzJztcclxuaW1wb3J0IHNlcnZlciBmcm9tICcuL3NlcnZlci5qcyc7XHJcbmltcG9ydCBnYW1lbG9vcCBmcm9tICcuL2dhbWVsb29wLmpzJztcclxuIiwiaW1wb3J0IG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcclxuXHJcbmNvbnN0IGFjY291bnRTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcclxuICBfaWQ6IG1vbmdvb3NlLlNjaGVtYVR5cGVzLk9iamVjdElkLFxyXG4gIHVzZXJuYW1lOiB7dHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSwgdW5pcXVlOiB0cnVlfSxcclxuICBwYXNzd29yZDoge3R5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWV9LFxyXG4gIGVtYWlsOiB7dHlwZTogU3RyaW5nLCB1bmlxdWU6IHRydWUsIHNwYXJzZTogdHJ1ZSwgbWF0Y2g6IC9eKChbXjw+KClcXFtcXF1cXFxcLiw7Olxcc0BcIl0rKFxcLltePD4oKVxcW1xcXVxcXFwuLDs6XFxzQFwiXSspKil8KFwiLitcIikpQCgoXFxbWzAtOV17MSwzfVxcLlswLTldezEsM31cXC5bMC05XXsxLDN9XFwuWzAtOV17MSwzfV0pfCgoW2EtekEtWlxcLTAtOV0rXFwuKStbYS16QS1aXXsyLH0pKSQvfSxcclxuICB2ZXJpZmllZDoge3R5cGU6IEJvb2xlYW4sIGRlZmF1bHQ6IGZhbHNlfVxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1vbmdvb3NlLm1vZGVsKCdBY2NvdW50JywgYWNjb3VudFNjaGVtYSk7XHJcbiIsImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XHJcblxyXG5jb25zdCBib3RTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcclxuICBfaWQ6IG1vbmdvb3NlLlNjaGVtYVR5cGVzLk9iamVjdElkLFxyXG4gIG1hcElkOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuICB4OiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiA1fSxcclxuICB5OiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiA1fSxcclxuICB0ZW1wbGF0ZToge3R5cGU6IG1vbmdvb3NlLlNjaGVtYVR5cGVzLk9iamVjdElkLCByZWY6ICdCb3RUZW1wbGF0ZScsIHJlcXVpcmVkOiB0cnVlfSxcclxuICBkaXJlY3Rpb246IHt0eXBlOiBTdHJpbmcsIGRlZmF1bHQ6ICdkb3duJ31cclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBtb25nb29zZS5tb2RlbCgnQm90JywgYm90U2NoZW1hKTtcclxuIiwiaW1wb3J0IG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcclxuXHJcbmNvbnN0IGJvdFRlbXBsYXRlU2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYSh7XHJcbiAgX2lkOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCxcclxuICBuYW1lOiB7dHlwZTogU3RyaW5nLCBkZWZhdWx0OiBcIkJvdFwifSxcclxuICBzcHJpdGU6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDF9LFxyXG4gIGRhbWFnZUJhc2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG4gIGRlZmVuY2VCYXNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuICBoZWFsdGhNYXhCYXNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuICBlbmVyZ3lNYXhCYXNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuICByYW5nZUJhc2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDF9LFxyXG4gIGhvc3RpbGU6IHt0eXBlOiBCb29sZWFuLCBkZWZhdWx0OiB0cnVlfVxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1vbmdvb3NlLm1vZGVsKCdCb3RUZW1wbGF0ZScsIGJvdFRlbXBsYXRlU2NoZW1hKTtcclxuIiwiaW1wb3J0IG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcclxuXHJcbmNvbnN0IGl0ZW1TY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcclxuICBfaWQ6IG1vbmdvb3NlLlNjaGVtYVR5cGVzLk9iamVjdElkLFxyXG4gIHRlbXBsYXRlOiB7dHlwZTogbW9uZ29vc2UuU2NoZW1hVHlwZXMuT2JqZWN0SWQsIHJlZjogJ0l0ZW1UZW1wbGF0ZScsIHJlcXVpcmVkOiB0cnVlfSxcclxuICBzdGFjazoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcbiAgcGxheWVySWQ6IHt0eXBlOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCwgZGVmYXVsdDogbnVsbH0sXHJcbiAgYm90SWQ6IHt0eXBlOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCwgZGVmYXVsdDogbnVsbH0sXHJcbiAgc2xvdDoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogbnVsbH0sXHJcbiAgbWFwSWQ6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IG51bGx9LFxyXG4gIHg6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IG51bGx9LFxyXG4gIHk6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IG51bGx9LFxyXG4gIGNyZWF0ZWRCeToge3R5cGU6IFN0cmluZ30sXHJcbiAgY3JlYXRlZERhdGU6IHt0eXBlOiBEYXRlfVxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1vbmdvb3NlLm1vZGVsKCdJdGVtJywgaXRlbVNjaGVtYSk7XHJcbiIsImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XHJcblxyXG5jb25zdCBpdGVtVGVtcGxhdGVTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcclxuXHRfaWQ6IG1vbmdvb3NlLlNjaGVtYVR5cGVzLk9iamVjdElkLFxyXG5cdG5hbWU6IHt0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlfSxcclxuXHRzcHJpdGU6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDF9LFxyXG5cdHJldXNhYmxlOiB7dHlwZTogQm9vbGVhbiwgZGVmYXVsdDogdHJ1ZX0sXHJcblx0dHlwZToge3R5cGU6IG1vbmdvb3NlLlNjaGVtYVR5cGVzLk9iamVjdElkLCByZWY6ICdJdGVtVHlwZScsIHJlcXVpcmVkOiB0cnVlfSxcclxuXHRwYXNzaXZlRGFtYWdlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuXHRwYXNzaXZlRGVmZW5jZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcblx0cGFzc2l2ZUhlYWx0aE1heDoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcblx0cGFzc2l2ZUVuZXJneU1heDoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcblx0cGFzc2l2ZVJhbmdlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuXHRlcXVpcHBlZERhbWFnZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcblx0ZXF1aXBwZWREZWZlbmNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuXHRlcXVpcHBlZEhlYWx0aE1heDoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcblx0ZXF1aXBwZWRFbmVyZ3lNYXg6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG5cdGVxdWlwcGVkUmFuZ2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWwoJ0l0ZW1UZW1wbGF0ZScsIGl0ZW1UZW1wbGF0ZVNjaGVtYSk7XHJcbiIsImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XHJcblxyXG5jb25zdCBpdGVtVHlwZVNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoe1xyXG5cdF9pZDogbW9uZ29vc2UuU2NoZW1hVHlwZXMuT2JqZWN0SWQsXHJcblx0bmFtZToge3R5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWV9LFxyXG5cdGVxdWlwcGVkU2xvdDoge3R5cGU6IE51bWJlciwgcmVxdWlyZWQ6IHRydWV9LFxyXG5cdHN0YWNrYWJsZToge3R5cGU6IEJvb2xlYW4sIHJlcXVpcmVkOiB0cnVlfVxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1vbmdvb3NlLm1vZGVsKCdJdGVtVHlwZScsIGl0ZW1UeXBlU2NoZW1hKTtcclxuIiwiaW1wb3J0IG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcclxuXHJcbmNvbnN0IG1hcFNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoe1xyXG5cdF9pZDogbW9uZ29vc2UuU2NoZW1hVHlwZXMuT2JqZWN0SWQsXHJcblx0bWFwSWQ6IE51bWJlcixcclxuXHRuYW1lOiB7dHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZX0sXHJcblx0ZHJvcENoYW5jZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMTAwfSxcclxuXHRkcm9wQW1vdW50RVE6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDF9LFxyXG5cdHRpbGVzOiB7dHlwZTogW1tbTnVtYmVyXV1dLCBkZWZhdWx0OiBbW1tdXV19LFxyXG5cdGlzV2FsbDoge3R5cGU6IFtbQm9vbGVhbl1dLCBkZWZhdWx0OiBmYWxzZX0sXHJcblx0aXNIb3N0aWxlOiB7dHlwZTogW1tCb29sZWFuXV0sIGRlZmF1bHQ6IGZhbHNlfSxcclxuXHRkYW1hZ2U6IHt0eXBlOiBbW051bWJlcl1dLCBkZWZhdWx0OiBudWxsfSxcclxuXHR3YXJwTWFwOiB7dHlwZTogW1tOdW1iZXJdXSwgZGVmYXVsdDogbnVsbH0sXHJcblx0d2FycFg6IHt0eXBlOiBbW051bWJlcl1dLCBkZWZhdWx0OiBudWxsfSxcclxuXHR3YXJwWToge3R5cGU6IFtbTnVtYmVyXV0sIGRlZmF1bHQ6IG51bGx9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWwoJ01hcCcsIG1hcFNjaGVtYSk7XHJcbiIsImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XHJcblxyXG5jb25zdCBwbGF5ZXJTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcclxuICBfaWQ6IG1vbmdvb3NlLlNjaGVtYVR5cGVzLk9iamVjdElkLFxyXG4gIGFjY291bnQ6IHt0eXBlOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCwgcmVmOiAnQWNjb3VudCcsIHJlcXVpcmVkOiB0cnVlfSxcclxuICBuYW1lOiB7dHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSwgdW5pcXVlOiB0cnVlfSxcclxuICB0ZW1wbGF0ZToge3R5cGU6IG1vbmdvb3NlLlNjaGVtYVR5cGVzLk9iamVjdElkLCByZWY6ICdQbGF5ZXJUZW1wbGF0ZScsIHJlcXVpcmVkOiB0cnVlfSxcclxuICBsZXZlbDoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMX0sXHJcbiAgZXhwZXJpZW5jZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcbiAgbWFwSWQ6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDF9LFxyXG4gIHg6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDV9LFxyXG4gIHk6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDV9LFxyXG4gIGRpcmVjdGlvbjoge3R5cGU6IFN0cmluZywgZGVmYXVsdDogJ2Rvd24nfSxcclxuICBhZG1pbkFjY2Vzczoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcbiAgc3ByaXRlOiBOdW1iZXJcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBtb25nb29zZS5tb2RlbCgnUGxheWVyJywgcGxheWVyU2NoZW1hKTtcclxuIiwiaW1wb3J0IG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcclxuXHJcbmNvbnN0IHBsYXllclRlbXBsYXRlU2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYSh7XHJcbiAgX2lkOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCxcclxuICBuYW1lOiB7dHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSwgdW5pcXVlOiB0cnVlfSxcclxuICBzcHJpdGU6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDF9LFxyXG4gIGRhbWFnZUJhc2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG4gIGRlZmVuY2VCYXNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuICBoZWFsdGhNYXhCYXNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuICBlbmVyZ3lNYXhCYXNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuICByYW5nZUJhc2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDF9LFxyXG4gIGhlYWx0aFBlckxldmVsOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuICBlbmVyZ3lQZXJMZXZlbDoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH1cclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBtb25nb29zZS5tb2RlbCgnUGxheWVyVGVtcGxhdGUnLCBwbGF5ZXJUZW1wbGF0ZVNjaGVtYSk7XHJcbiIsImltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xyXG5pbXBvcnQgaHR0cCBmcm9tICdodHRwJztcclxuaW1wb3J0IHNvY2tldElPIGZyb20gJ3NvY2tldC5pbyc7XHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xyXG5cclxuaW1wb3J0IGRiIGZyb20gJy4vZGIuanMnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuL2dhbWUuanMnO1xyXG5pbXBvcnQgY29uZmlnIGZyb20gJy4vY29uZmlnLmpzJztcclxuXHJcbmNsYXNzIFNlcnZlciB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHRjb25zdCBhcHAgPSBleHByZXNzKCk7XHJcblx0XHRjb25zdCBodHRwU2VydmVyID0gaHR0cC5TZXJ2ZXIoYXBwKTtcclxuXHRcdGNvbnN0IGlvID0gc29ja2V0SU8oaHR0cFNlcnZlcik7XHJcblx0XHRjb25zdCBwb3J0ID0gcHJvY2Vzcy5lbnYuUE9SVCB8fCBjb25maWcuUE9SVDtcclxuXHRcdGNvbnN0IHB1YmxpY1BhdGggPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4vY2xpZW50Jyk7XHJcblx0XHRcclxuXHRcdGFwcC5nZXQoJy8nLCAocmVxLCByZXMpID0+IHJlcy5zZW5kRmlsZShwdWJsaWNQYXRoICsgJy9pbmRleC5odG1sJykpO1xyXG5cdFx0YXBwLnVzZSgnL2NsaWVudCcsIGV4cHJlc3Muc3RhdGljKHB1YmxpY1BhdGgpKTtcclxuXHRcdGh0dHBTZXJ2ZXIubGlzdGVuKHBvcnQsICgpID0+IGRiLmxvZyhgU2VydmVyIHN0YXJ0ZWQuIExpc3RlbmluZyBvbiBwb3J0ICR7aHR0cFNlcnZlci5hZGRyZXNzKCkucG9ydH0uLi5gKSk7XHJcblxyXG5cdFx0dGhpcy5zb2NrZXRMaXN0ID0ge307XHJcblx0XHR0aGlzLmFjdGl2ZUFjY291bnRzID0ge307XHJcblxyXG5cdFx0aW8uc29ja2V0cy5vbignY29ubmVjdGlvbicsIHNvY2tldCA9PiB0aGlzLm9uQ29ubmVjdChzb2NrZXQpKTtcclxuXHR9XHJcblxyXG5cdC8qIGNvbm5lY3QgPT4gc2lnbmluID0+IHNlbGVjdHBsYXllclxyXG5cdCoqIGNvbm5lY3Qgd2hlbiBwYWdlIGxvYWRzIC0gc2hvd3Mgc2lnbmluIHBhZ2VcclxuXHQqKiBzaWduaW4gd2hlbiB1c2VybmFtZSBhbmQgcGFzc3dvcmQgaXMgc3VibWl0dGVkXHJcbiBcdCoqIHNlbGVjdHBsYXllciB3aGVuIGNoYXJhY3RlciBpcyBjaG9zZW4gLSBsb2dzIGludG8gdGhlIGdhbWVcclxuXHQqL1xyXG5cclxuXHQvLyBSZWNlaXZlIGRhdGEgZnJvbSBjbGllbnRzXHJcblx0b25Db25uZWN0KHNvY2tldCkge1xyXG5cdFx0dGhpcy5zb2NrZXRMaXN0W3NvY2tldC5pZF0gPSBzb2NrZXQ7XHJcblx0XHRkYi5sb2coYCR7c29ja2V0LmlkfSAtIFNvY2tldCBjb25uZWN0ZWQuYCk7XHJcblx0XHRcclxuXHRcdHNvY2tldC5vbignZGlzY29ubmVjdCcsICgpID0+IHRoaXMub25EaXNjb25uZWN0KHNvY2tldCkpO1xyXG5cdFx0c29ja2V0Lm9uKCdzaWdudXAnLCAoZGF0YSkgPT4gdGhpcy5vblNpZ25VcChkYXRhLnVzZXJuYW1lLCBkYXRhLnBhc3N3b3JkLCBkYXRhLmVtYWlsKSk7XHJcblx0XHRzb2NrZXQub24oJ3NpZ25pbicsIChkYXRhKSA9PiB0aGlzLm9uU2lnbkluKHNvY2tldCwgZGF0YS51c2VybmFtZSwgZGF0YS5wYXNzd29yZCkpO1xyXG5cdFx0c29ja2V0Lm9uKCdzaWdub3V0JywgKCkgPT4gdGhpcy5vblNpZ25PdXQoc29ja2V0KSk7XHJcblx0XHQvLyBUZWxsIGNsaWVudCB0aGV5IGhhdmUgY29ubmVjdGVkXHJcblx0fVxyXG5cclxuXHRhc3luYyBvbkRpc2Nvbm5lY3Qoc29ja2V0KSB7XHJcblx0XHRpZiAoc29ja2V0LnBsYXllcklkICE9IG51bGwgJiYgZ2FtZS5wbGF5ZXJzW3NvY2tldC5wbGF5ZXJJZF0pIGF3YWl0IHRoaXMub25Mb2dPdXQoc29ja2V0KTtcclxuXHRcdGlmIChzb2NrZXQuYWNjb3VudElkICYmIHRoaXMuYWN0aXZlQWNjb3VudHNbc29ja2V0LmFjY291bnRJZF0pIGF3YWl0IHRoaXMub25TaWduT3V0KHNvY2tldCk7XHJcblxyXG5cdFx0ZGIubG9nKGAke3NvY2tldC5pZH0gLSBTb2NrZXQgZGlzY29ubmVjdGVkLmApO1xyXG5cdFx0ZGVsZXRlIHRoaXMuc29ja2V0TGlzdFtzb2NrZXQuaWRdO1xyXG5cdH1cclxuXHJcblx0YXN5bmMgb25TaWduVXAodXNlcm5hbWUsIHBhc3N3b3JkLCBlbWFpbCkge1xyXG5cdFx0bGV0IHN1Y2Nlc3MgPSBhd2FpdCBkYi5hZGRBY2NvdW50KHVzZXJuYW1lLCBwYXNzd29yZCwgZW1haWwpO1xyXG5cdFx0aWYgKHN1Y2Nlc3MpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJUZWxsIGNsaWVudCBzaWdudXAgd2FzIHN1Y2Nlc3NmdWxcIik7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJUZWxsIGNsaWVudCBzaWdudXAgd2FzIG5vdCBzdWNjZXNzZnVsXCIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0YXN5bmMgb25TaWduSW4oc29ja2V0LCB1c2VybmFtZSwgcGFzc3dvcmQpIHtcclxuXHRcdGxldCBzdWNjZXNzID0gYXdhaXQgZGIuYXV0aEFjY291bnQodXNlcm5hbWUsIHBhc3N3b3JkKTtcclxuXHRcdGlmICghc3VjY2Vzcykge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhgU2lnbiBpbiBmYWlsZWQgb24gdXNlcm5hbWUgJHt1c2VybmFtZX1gKTtcclxuXHRcdFx0c29ja2V0LmVtaXQoJ3NpZ25lZEluJywgZmFsc2UpO1x0Ly8gVGVsbCBjbGllbnQgc2lnbmluIHdhcyBub3Qgc3VjY2Vzc2Z1bFxyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGFjY291bnQgPSBhd2FpdCBkYi5nZXRBY2NvdW50QnlVc2VybmFtZSh1c2VybmFtZSk7XHJcblx0XHRpZiAodGhpcy5hY3RpdmVBY2NvdW50c1thY2NvdW50Ll9pZF0pIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJUaGF0IGFjY291bnQgaXMgYWxyZWFkeSBzaWduZWQgaW4uXCIpO1xyXG5cdFx0XHRzb2NrZXQuZW1pdCgnc2lnbmVkSW4nLCBmYWxzZSk7XHQvLyBUZWxsIGNsaWVudCB0aGF0IGFjY291bnQgaXMgYWxyZWFkeSBzaWduZWQgaW5cclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRzb2NrZXQuYWNjb3VudElkID0gYWNjb3VudC5faWQ7XHJcblx0XHR0aGlzLmFjdGl2ZUFjY291bnRzW2FjY291bnQuX2lkXSA9IHVzZXJuYW1lO1xyXG5cclxuXHRcdHNvY2tldC5vbignYWRkUGxheWVyJywgKGRhdGEpID0+IHRoaXMub25BZGRQbGF5ZXIoc29ja2V0LCBkYXRhLm5hbWUsIGRhdGEudGVtcGxhdGVOYW1lKSk7XHJcblx0XHRzb2NrZXQub24oJ2xvZ2luJywgKG5hbWUpID0+IHRoaXMub25Mb2dJbihzb2NrZXQsIG5hbWUpKTtcclxuXHRcdHNvY2tldC5vbignbG9nb3V0JywgKCkgPT4gdGhpcy5vbkxvZ091dChzb2NrZXQpKTtcclxuXHRcdHNvY2tldC5vbignYWRkUGxheWVyVGVtcGxhdGUnLCAoZGF0YSkgPT4gdGhpcy5vbkFkZFBsYXllclRlbXBsYXRlKGRhdGEpKTtcclxuXHJcblx0XHRkYi5sb2coYCR7c29ja2V0LmlkfSAtICR7dXNlcm5hbWV9IHNpZ25lZCBpbi5gKTtcclxuXHRcdGxldCBwbGF5ZXJzID0gYXdhaXQgZGIuZ2V0UGxheWVyc0J5QWNjb3VudChhY2NvdW50Ll9pZCk7XHJcblx0XHRzb2NrZXQuZW1pdCgnc2lnbmVkSW4nLCB7XHJcblx0XHRcdGFjY291bnQsXHJcblx0XHRcdHBsYXllcnNcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRcclxuXHRhc3luYyBvblNpZ25PdXQoc29ja2V0KSB7XHJcblx0XHRpZiAoc29ja2V0LnBsYXllcklkICE9IG51bGwpIGF3YWl0IHRoaXMub25Mb2dPdXQoc29ja2V0KTtcclxuXHRcdFxyXG5cdFx0aWYgKHNvY2tldC5hY2NvdW50SWQpIHtcclxuXHRcdFx0Y29uc3QgdXNlcm5hbWUgPSB0aGlzLmFjdGl2ZUFjY291bnRzW3NvY2tldC5hY2NvdW50SWRdO1xyXG5cdFx0XHRkYi5sb2coYCR7c29ja2V0LmlkfSAtICR7dXNlcm5hbWV9IHNpZ25lZCBvdXQuYCk7XHJcblx0XHRcdGRlbGV0ZSB0aGlzLmFjdGl2ZUFjY291bnRzW3NvY2tldC5hY2NvdW50SWRdO1xyXG5cdFx0XHRzb2NrZXQuYWNjb3VudElkID0gbnVsbDtcclxuXHRcdFx0c29ja2V0LmVtaXQoJ3NpZ25lZE91dCcpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0YXN5bmMgb25BZGRQbGF5ZXIoc29ja2V0LCBuYW1lLCB0ZW1wbGF0ZUlkKSB7XHJcblx0XHRsZXQgc3VjY2VzcyA9IGF3YWl0IGRiLmFkZFBsYXllcihzb2NrZXQuYWNjb3VudElkLCBuYW1lLCB0ZW1wbGF0ZUlkKTtcclxuXHRcdGlmIChzdWNjZXNzKSB7XHJcblx0XHRcdGNvbnN0IHVzZXJuYW1lID0gdGhpcy5hY3RpdmVBY2NvdW50c1tzb2NrZXQuYWNjb3VudElkXTtcclxuXHRcdFx0ZGIubG9nKGAke3NvY2tldC5pZH0gLSAke25hbWV9IGhhcyBiZWVuIGFkZGVkIGFzIGEgcGxheWVyIHRvIGFjY291bnQgJHt1c2VybmFtZX0uYCk7XHJcblx0XHRcdC8vIFRlbGwgY2xpZW50IGFkZCBwbGF5ZXIgd2FzIHN1Y2Nlc3NmdWxcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHQvLyBUZWxsIGNsaWVudCBhZGQgcGxheWVyIHdhcyBub3Qgc3VjY2Vzc2Z1bFxyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRhc3luYyBvbkFkZFBsYXllclRlbXBsYXRlKGRhdGEpIHtcclxuXHRcdGxldCBzdWNjZXNzID0gYXdhaXQgZGIuYWRkUGxheWVyVGVtcGxhdGUoZGF0YSk7XHJcblx0XHRpZiAoc3VjY2Vzcykge1xyXG5cdFx0XHRnYW1lLmxvYWRQbGF5ZXJUZW1wbGF0ZXMoKTtcclxuXHRcdFx0ZGIubG9nKGAke3NvY2tldC5pZH0gLSAke2RhdGEubmFtZX0gaGFzIGJlZW4gYWRkZWQgYXMgYSBwbGF5ZXIgdGVtcGxhdGUuYCk7XHJcblx0XHRcdC8vIFRlbGwgY2xpZW50IGFkZCBwbGF5ZXIgd2FzIHN1Y2Nlc3NmdWxcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHQvLyBUZWxsIGNsaWVudCBhZGQgcGxheWVyIHdhcyBub3Qgc3VjY2Vzc2Z1bFxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0YXN5bmMgb25Mb2dJbihzb2NrZXQsIG5hbWUpIHtcclxuXHRcdGlmICghc29ja2V0LmFjY291bnRJZCkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIk5vdCBzaWduZWQgaW50byBhY2NvdW50LlwiKTtcclxuXHRcdFx0c29ja2V0LmVtaXQoJ2xvZ2dlZEluJywgZmFsc2UpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRpZiAoc29ja2V0LnBsYXllcklkICE9IG51bGwpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJBbHJlYWR5IGxvZ2dlZCBpbi5cIik7XHJcblx0XHRcdHNvY2tldC5lbWl0KCdsb2dnZWRJbicsIGZhbHNlKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBwbGF5ZXJEYXRhID0gYXdhaXQgZGIuZ2V0UGxheWVyKG5hbWUpO1xyXG5cdFx0aWYgKCFwbGF5ZXJEYXRhKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiTm8gcGxheWVyIHdpdGggdGhhdCBuYW1lLlwiKTtcclxuXHRcdFx0c29ja2V0LmVtaXQoJ2xvZ2dlZEluJywgZmFsc2UpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKFwiXCIrc29ja2V0LmFjY291bnRJZCAhPT0gXCJcIitwbGF5ZXJEYXRhLmFjY291bnQpIHtcdC8vIENhc3QgdG8gc3RyaW5nIGJlZm9yZSBjb21wYXJpc29uXHJcblx0XHRcdGRiLmxvZyhgQXR0ZW1wdCB0byBsb2dpbiB0byBwbGF5ZXIgKCR7cGxheWVyRGF0YS5uYW1lfSkgZnJvbSB3cm9uZyBhY2NvdW50ICgke3NvY2tldC5hY2NvdW50SWR9KSBvbiBzb2NrZXQgJHtzb2NrZXQuaWR9LmApO1xyXG5cdFx0XHRzb2NrZXQuZW1pdCgnbG9nZ2VkSW4nLCBmYWxzZSk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBwbGF5ZXIgPSBnYW1lLnBsYXllckxvZ2luKHNvY2tldC5pZCwgcGxheWVyRGF0YSk7XHJcblx0XHRpZiAoIXBsYXllcikge1xyXG5cdFx0XHRzb2NrZXQuZW1pdCgnbG9nZ2VkSW4nLCBmYWxzZSk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcclxuXHRcdHNvY2tldC5wbGF5ZXJJZCA9IHBsYXllci5nYW1lSWQ7XHJcblx0XHRzb2NrZXQub24oJ2lucHV0JywgKGRhdGEpID0+IHBsYXllci5pbnB1dERhdGEoZGF0YSkpO1xyXG5cdFx0c29ja2V0Lm9uKCd1cGxvYWRNYXAnLCAoZGF0YSkgPT4ge1xyXG5cdFx0XHRpZiAocGxheWVyLmFkbWluQWNjZXNzID49IDIpIHRoaXMub25VcGxvYWRNYXAoZGF0YSk7XHJcblx0XHRcdGVsc2UgZ2FtZS5zZW5kR2FtZUluZm9QbGF5ZXIocGxheWVyLmdhbWVJZCwgYFlvdSBkb24ndCBoYXZlIGFjY2VzcyB0byB0aGF0IGNvbW1hbmQuYCk7XHJcblx0XHR9KTtcclxuXHRcdGNvbnN0IG1hcERhdGEgPSBnYW1lLm1hcHNbcGxheWVyLm1hcElkXS5nZXRQYWNrKCk7XHJcblx0XHRzb2NrZXQuZW1pdCgnbG9nZ2VkSW4nLCBtYXBEYXRhKTtcclxuXHR9XHJcblx0XHJcblx0YXN5bmMgb25Mb2dPdXQoc29ja2V0KSB7XHJcblx0XHRpZiAoc29ja2V0LnBsYXllcklkICE9IG51bGwpIHtcclxuXHRcdFx0YXdhaXQgZ2FtZS5wbGF5ZXJMb2dvdXQoc29ja2V0LnBsYXllcklkKTtcclxuXHRcdFx0c29ja2V0LnBsYXllcklkID0gbnVsbDtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0YXN5bmMgb25VcGxvYWRNYXAoZGF0YSkge1xyXG5cdFx0bGV0IHN1Y2Nlc3MgPSBhd2FpdCBkYi5zYXZlTWFwKGRhdGEpO1xyXG5cdFx0aWYgKCFzdWNjZXNzKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiRmFpbGVkIHRvIHVwbG9hZCBtYXAuXCIpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRnYW1lLm1hcHNbZGF0YS5tYXBJZF0udXBsb2FkKGRhdGEpO1xyXG5cdFx0XHJcblx0XHRnYW1lLnBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XHJcblx0XHRcdGlmIChwbGF5ZXIubWFwSWQgPT09IGRhdGEubWFwSWQpIHtcclxuXHRcdFx0XHR0aGlzLnNlbmRNYXBEYXRhKHRoaXMuc29ja2V0TGlzdFtwbGF5ZXIuc29ja2V0SWRdLCBwbGF5ZXIubWFwSWQpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdC8vIFNlbmQgZGF0YSB0byBjbGllbnRzXHJcblx0c2VuZFVwZGF0ZVBhY2sodXBkYXRlUGFjaykge1xyXG5cdFx0Z2FtZS5wbGF5ZXJzLmZvckVhY2gocGxheWVyID0+IHtcclxuXHRcdFx0Y29uc3QgcGFjayA9IHtcclxuXHRcdFx0XHRnYW1lOiB7XHJcblx0XHRcdFx0XHRwbGF5ZXJzOiBbXSxcclxuXHRcdFx0XHRcdGJvdHM6IFtdLFxyXG5cdFx0XHRcdFx0aXRlbXM6IFtdLFxyXG5cdFx0XHRcdFx0ZWZmZWN0czogW10sXHJcblx0XHRcdFx0XHR0ZXh0czogW11cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdG1lbnU6IHBsYXllci5nZXRVSVBhY2soKSxcclxuXHRcdFx0XHRjaGF0Ym94OiB7fVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0Zm9yIChsZXQgcGxheWVyRGF0YSBvZiB1cGRhdGVQYWNrLnBsYXllcnMpIHtcclxuXHRcdFx0XHRpZiAocGxheWVyRGF0YSAmJiAoKHBsYXllckRhdGEubWFwSWQgPT09IHBsYXllci5tYXBJZCAmJiBwbGF5ZXJEYXRhLmlzVmlzaWJsZSkgfHwgcGxheWVyRGF0YS5zb2NrZXRJZCA9PT0gcGxheWVyLnNvY2tldElkKSkge1xyXG5cdFx0XHRcdFx0cGFjay5nYW1lLnBsYXllcnNbcGxheWVyRGF0YS5nYW1lSWRdID0gcGxheWVyRGF0YTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0Zm9yIChsZXQgYm90IG9mIHVwZGF0ZVBhY2suYm90cykge1xyXG5cdFx0XHRcdGlmIChib3QgJiYgYm90Lm1hcElkID09PSBwbGF5ZXIubWFwSWQpIHBhY2suZ2FtZS5ib3RzW2JvdC5nYW1lSWRdID0gYm90O1xyXG5cdFx0XHR9XHJcblx0XHRcdGZvciAobGV0IGl0ZW0gb2YgdXBkYXRlUGFjay5pdGVtcykge1xyXG5cdFx0XHRcdGlmIChpdGVtICYmIGl0ZW0ubWFwSWQgPT09IHBsYXllci5tYXBJZCkgcGFjay5nYW1lLml0ZW1zW2l0ZW0uZ2FtZUlkXSA9IGl0ZW07XHJcblx0XHRcdH1cclxuXHRcdFx0Zm9yIChsZXQgZWZmZWN0IG9mIHVwZGF0ZVBhY2suZWZmZWN0cykge1xyXG5cdFx0XHRcdGlmIChlZmZlY3QgJiYgZWZmZWN0Lm1hcElkID09PSBwbGF5ZXIubWFwSWQpIHBhY2suZ2FtZS5lZmZlY3RzW2VmZmVjdC5nYW1lSWRdID0gZWZmZWN0O1xyXG5cdFx0XHR9XHJcblx0XHRcdGZvciAobGV0IHRleHQgb2YgdXBkYXRlUGFjay50ZXh0cykge1xyXG5cdFx0XHRcdGlmICh0ZXh0ICYmIHRleHQubWFwSWQgPT09IHBsYXllci5tYXBJZCkgcGFjay5nYW1lLnRleHRzW3RleHQuZ2FtZUlkXSA9IHRleHQ7XHJcblx0XHRcdH1cclxuXHJcblxyXG4vKiBcdFx0XHRwYWNrLmdhbWUucGxheWVycyA9IHVwZGF0ZVBhY2sucGxheWVycy5maWx0ZXIocGxheWVyRGF0YSA9PiBwbGF5ZXJEYXRhLnNvY2tldElkID09PSBwbGF5ZXIuc29ja2V0SWQgfHwgKHBsYXllckRhdGEubWFwSWQgPT09IHBsYXllci5tYXBJZCAmJiBwbGF5ZXJEYXRhLmlzVmlzaWJsZSkpO1xyXG5cdFx0XHRwYWNrLmdhbWUuYm90cyA9IHVwZGF0ZVBhY2suYm90cy5maWx0ZXIoYm90ID0+IGJvdC5tYXBJZCA9PT0gcGxheWVyLm1hcElkKTtcclxuXHRcdFx0cGFjay5nYW1lLml0ZW1zID0gdXBkYXRlUGFjay5pdGVtcy5maWx0ZXIoaXRlbSA9PiBpdGVtLm1hcElkID09PSBwbGF5ZXIubWFwSWQpO1xyXG5cdFx0XHRwYWNrLmdhbWUuZWZmZWN0cyA9IHVwZGF0ZVBhY2suZWZmZWN0cy5maWx0ZXIoZWZmZWN0ID0+IGVmZmVjdC5tYXBJZCA9PT0gcGxheWVyLm1hcElkKTtcclxuXHRcdFx0cGFjay5nYW1lLnRleHRzID0gdXBkYXRlUGFjay50ZXh0cy5maWx0ZXIodGV4dCA9PiB0ZXh0Lm1hcElkID09PSBwbGF5ZXIubWFwSWQpOyAqL1xyXG5cclxuXHRcdFx0cGFjay5jaGF0Ym94Lm1lc3NhZ2VzID0gdXBkYXRlUGFjay5tZXNzYWdlcy5maWx0ZXIobWVzc2FnZSA9PiB7XHJcblx0XHRcdFx0cmV0dXJuIChtZXNzYWdlLm1hcElkID09IG51bGwgJiYgbWVzc2FnZS5pZCA9PSBudWxsKSB8fCBwbGF5ZXIubWFwSWQgPT09IG1lc3NhZ2UubWFwSWQgfHwgcGxheWVyLmdhbWVJZCA9PT0gbWVzc2FnZS5pZDtcclxuXHRcdFx0fSk7XHJcblx0XHRcdFxyXG5cdFx0XHR0aGlzLnNvY2tldExpc3RbcGxheWVyLnNvY2tldElkXS5lbWl0KCd1cGRhdGUnLCBwYWNrKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRcclxuXHRzZW5kTWFwRGF0YShzb2NrZXQsIG1hcElkKSB7XHJcblx0XHRjb25zdCBtYXBEYXRhID0gZ2FtZS5tYXBzW21hcElkXS5nZXRQYWNrKCk7XHJcblx0XHRzb2NrZXQuZW1pdCgnbG9hZE1hcCcsIG1hcERhdGEpO1xyXG5cdH1cclxufVxyXG5cclxuY29uc3Qgc2VydmVyID0gbmV3IFNlcnZlcigpO1xyXG5leHBvcnQgZGVmYXVsdCBzZXJ2ZXI7XHJcbiIsImZ1bmN0aW9uIGNyZWF0ZTJkQXJyYXkoY29sdW1ucywgcm93cywgZGVmYXVsdFZhbHVlKSB7XHJcbiAgY29uc3QgYXJyYXkgPSBbXTtcclxuICBmb3IgKGxldCB5ID0gMDsgeSA8IHJvd3M7IHkrKykge1xyXG4gICAgYXJyYXlbeV0gPSBbXTtcclxuICAgIGZvciAobGV0IHggPSAwOyB4IDwgY29sdW1uczsgeCsrKSB7XHJcbiAgICAgIGFycmF5W3ldW3hdID0gZGVmYXVsdFZhbHVlO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gYXJyYXk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZTNkQXJyYXkoY29sdW1ucywgcm93cywgbGF5ZXJzLCBkZWZhdWx0VmFsdWUpIHtcclxuICBjb25zdCBhcnJheSA9IFtdO1xyXG4gIGZvciAobGV0IHogPSAwOyB6IDwgbGF5ZXJzOyB6KyspIHtcclxuICAgIGFycmF5W3pdID0gW107IFxyXG4gICAgZm9yIChsZXQgeSA9IDA7IHkgPCByb3dzOyB5KyspIHtcclxuICAgICAgYXJyYXlbel1beV0gPSBbXTtcclxuICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBjb2x1bW5zOyB4KyspIHtcclxuICAgICAgICBhcnJheVt6XVt5XVt4XSA9IGRlZmF1bHRWYWx1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gYXJyYXk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNodWZmbGUoYXJyYXkpIHtcclxuICBsZXQgY3VycmVudEluZGV4ID0gYXJyYXkubGVuZ3RoO1xyXG4gIGxldCB0ZW1wO1xyXG4gIGxldCByYW5kb21JbmRleDtcclxuICB3aGlsZSAoY3VycmVudEluZGV4ICE9PSAwKSB7XHJcbiAgICByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGN1cnJlbnRJbmRleCk7XHJcbiAgICBjdXJyZW50SW5kZXggLT0gMTtcclxuICAgIHRlbXAgPSBhcnJheVtjdXJyZW50SW5kZXhdO1xyXG4gICAgYXJyYXlbY3VycmVudEluZGV4XSA9IGFycmF5W3JhbmRvbUluZGV4XTtcclxuICAgIGFycmF5W3JhbmRvbUluZGV4XSA9IHRlbXA7XHJcbiAgfVxyXG4gIHJldHVybiBhcnJheTtcclxufVxyXG5cclxuZnVuY3Rpb24gc3dhcChhcnJheSwgaSwgaikge1xyXG4gIGNvbnN0IHRlbXAgPSBhcnJheVtpXTtcclxuICBhcnJheVtpXSA9IGFycmF5W2pdO1xyXG4gIGFycmF5W2pdID0gdGVtcDtcclxufVxyXG5cclxuZnVuY3Rpb24gZmlyc3RFbXB0eUluZGV4KGFycmF5KSB7XHJcbiAgaWYgKGFycmF5Lmxlbmd0aCA8IDEpIHJldHVybiAwO1xyXG4gIFxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDw9IGFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICBpZiAoYXJyYXlbaV0gPT0gbnVsbCkgcmV0dXJuIGk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBsZXJwKHN0YXJ0LCBlbmQsIHRpbWUpIHtcclxuICAvL3JldHVybiBzdGFydCArICh0aW1lICogKGVuZCAtIHN0YXJ0KSk7XHJcbiAgcmV0dXJuICgoMSAtIHRpbWUpICogc3RhcnQpICsgKHRpbWUgKiBlbmQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjbGFtcCh2YWx1ZSwgbWluaW11bSwgbWF4aW11bSkge1xyXG4gIGlmICh2YWx1ZSA8IG1pbmltdW0pIHtcclxuICAgIHJldHVybiBtaW5pbXVtO1xyXG4gIH1cclxuICBlbHNlIGlmICh2YWx1ZSA+IG1heGltdW0pIHtcclxuICAgIHJldHVybiBtYXhpbXVtO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHJldHVybiB2YWx1ZTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJhbmRvbUludChtaW5pbXVtLCBtYXhpbXVtKSB7XHJcbiAgcmV0dXJuIE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiAobWF4aW11bSArIDEpKSArIG1pbmltdW0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRYRnJvbUluZGV4KGluZGV4LCBjb2x1bW5zKSB7XHJcbiAgcmV0dXJuIGluZGV4ICUgY29sdW1ucztcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0WUZyb21JbmRleChpbmRleCwgY29sdW1ucykge1xyXG4gIHJldHVybiAoaW5kZXggLSAoaW5kZXggJSBjb2x1bW5zKSkgLyBjb2x1bW5zO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRJbmRleEZyb21YWSh4LCB5LCBjb2x1bW5zKSB7XHJcbiAgcmV0dXJuICh5ICogY29sdW1ucykgKyB4O1xyXG59XHJcblxyXG5mdW5jdGlvbiB0aW1lc3RhbXAoZGF0ZSkge1xyXG4gIGlmICghKGRhdGUgaW5zdGFuY2VvZiBEYXRlKSkgcmV0dXJuIFwiSW52YWxpZCBkYXRlXCI7XHJcbiAgbGV0IG1vbnRoID0gZGF0ZS5nZXRNb250aCgpICsgMTtcclxuICBsZXQgZGF5ID0gZGF0ZS5nZXREYXRlKCk7XHJcbiAgbGV0IGhvdXIgPSBkYXRlLmdldEhvdXJzKCk7XHJcbiAgbGV0IG1pbnV0ZSA9IGRhdGUuZ2V0TWludXRlcygpO1xyXG4gIGxldCBzZWNvbmQgPSBkYXRlLmdldFNlY29uZHMoKTtcclxuICBpZiAobW9udGggPCAxMCkgbW9udGggPSBcIjBcIiArIG1vbnRoO1xyXG4gIGlmIChkYXkgPCAxMCkgZGF5ID0gXCIwXCIgKyBkYXk7XHJcbiAgaWYgKGhvdXIgPCAxMCkgaG91ciA9IFwiMFwiICsgaG91cjtcclxuICBpZiAobWludXRlIDwgMTApIG1pbnV0ZSA9IFwiMFwiICsgbWludXRlO1xyXG4gIGlmIChzZWNvbmQgPCAxMCkgc2Vjb25kID0gXCIwXCIgKyBzZWNvbmQ7XHJcbiAgcmV0dXJuIGAke2RhdGUuZ2V0RnVsbFllYXIoKX0tJHttb250aH0tJHtkYXl9ICR7aG91cn06JHttaW51dGV9OiR7c2Vjb25kfWA7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluZGVmaW5pdGVBcnRpY2xlKHdvcmQpIHtcclxuXHRsZXQgcmVnZXggPSAvdHJvdXNlcnMkfGplYW5zJHxnbGFzc2VzJC9pO1xyXG5cdGlmICh3b3JkLm1hdGNoKHJlZ2V4KSkgcmV0dXJuIFwiYSBwYWlyIG9mIFwiICsgd29yZDtcclxuXHJcblx0cmVnZXggPSAvXlthZWlvdV0vaTtcclxuXHRpZiAod29yZC5tYXRjaChyZWdleCkpIHJldHVybiBcImFuIFwiICsgd29yZDtcclxuXHJcblx0cmV0dXJuIFwiYSBcIiArIHdvcmQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBsdXJhbCh3b3JkKSB7XHJcblx0bGV0IHJlZ2V4ID0gL3NoZWVwJHxkZWVyJHxmaXNoJC9pO1xyXG5cdGlmICh3b3JkLm1hdGNoKHJlZ2V4KSkgcmV0dXJuIHdvcmQ7XHJcblxyXG5cdHJlZ2V4ID0gL3Ryb3VzZXJzJHxqZWFucyR8Z2xhc3NlcyQvaTtcclxuXHRpZiAod29yZC5tYXRjaChyZWdleCkpIHJldHVybiBcInBhaXJzIG9mIFwiICsgd29yZDtcclxuXHRcclxuXHRyZWdleCA9IC9zdG9tYWNoJHxlcG9jaCR8L2k7XHJcblx0aWYgKHdvcmQubWF0Y2gocmVnZXgpKSByZXR1cm4gd29yZCArIFwic1wiO1xyXG5cdFxyXG5cdHJlZ2V4ID0gL2YkfGZlJC9pO1xyXG5cdGlmICh3b3JkLm1hdGNoKHJlZ2V4KSkgcmV0dXJuIHdvcmQucmVwbGFjZShyZWdleCwgXCJ2ZXNcIik7XHJcblxyXG5cdHJlZ2V4ID0gL1tzeHpdJHxjaCR8c2gkfGF0byQvaTtcclxuXHRpZiAod29yZC5tYXRjaChyZWdleCkpIHJldHVybiB3b3JkICsgXCJlc1wiO1xyXG5cdFxyXG5cdHJlZ2V4ID0gL3kkL2k7XHJcblx0aWYgKHdvcmQubWF0Y2gocmVnZXgpKSByZXR1cm4gd29yZC5yZXBsYWNlKHJlZ2V4LCBcImllc1wiKTtcclxuXHRcclxuXHRyZXR1cm4gd29yZCArIFwic1wiO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgY3JlYXRlMmRBcnJheSxcclxuICBjcmVhdGUzZEFycmF5LFxyXG4gIHNodWZmbGUsXHJcbiAgc3dhcCxcclxuICBmaXJzdEVtcHR5SW5kZXgsXHJcbiAgbGVycCxcclxuICBjbGFtcCxcclxuICByYW5kb21JbnQsXHJcbiAgZ2V0WEZyb21JbmRleCxcclxuICBnZXRZRnJvbUluZGV4LFxyXG4gIGdldEluZGV4RnJvbVhZLFxyXG4gIHRpbWVzdGFtcCxcclxuICBpbmRlZmluaXRlQXJ0aWNsZSxcclxuICBwbHVyYWxcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYmNyeXB0XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV4cHJlc3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZnNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaHR0cFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJtb25nb29zZVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJub2RlLWdhbWVsb29wXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInBhdGhcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwic29ja2V0LmlvXCIpOyJdLCJzb3VyY2VSb290IjoiIn0=
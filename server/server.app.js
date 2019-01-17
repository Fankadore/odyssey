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
		console.log(`${this.health}/${this.healthMax}`);
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
	constructor(mapId, x, y, direction, template) {
		super(mapId, x, y, direction, template.name, template.sprite);
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
		this.botId = this.gameId;
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
			return item.botId === this.botId;
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
		
		this.templateId = template._id;
		this.name = template.name;
		this.description = template.description;
		this.reusable = template.reusable;

		this.type = template.type.name;
		this.stackable = template.type.stackable;
		this.equippedSlot = template.type.equippedSlot;
		
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

		this.gameId = _util_js__WEBPACK_IMPORTED_MODULE_1__["default"].firstEmptyIndex(_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].items);
		_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].items[this.gameId] = this;
	}

	update(delta) {
		return this.getPack();
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
/* harmony import */ var _models_itemTemplate_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../models/itemTemplate.js */ "./server/src/models/itemTemplate.js");






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
			return item.playerId === this.playerId;
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

	async backup(data = {}) {
		//TODO save everything
		// const maps = save-all-maps
		let players = this.saveOnlinePlayers(data.players);
		// const bots = save-all-bots
		// const items = save-all-items
		let logSaved = this.saveLog();
		Promise.all([players, logSaved])
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
			this.savePlayer(player.getDBPack());
		}
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
		return await _models_itemTemplate_js__WEBPACK_IMPORTED_MODULE_9__["default"].findById(templateId)
		.select('name sprite reusable type passiveDamage passiveDefence passiveHealthMax passiveEnergyMaxBase passiveRange equippedDamage equippedDefence equippedHealthMax equippedEnergyMaxBase equippedRange')
		.populate('type')
		.exec()
		.then(template => template)
		.catch(err => console.log(err));
	}
	async getAllItemTemplates() {
		return await _models_itemTemplate_js__WEBPACK_IMPORTED_MODULE_9__["default"].find({})
		.select('_id name sprite reusable type passiveDamage passiveDefence passiveHealthMax passiveEnergyMaxBase passiveRange equippedDamage equippedDefence equippedHealthMax equippedEnergyMaxBase equippedRange')
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
		this.loadCommands();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL2FjdG9yLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy9ib3QuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL2VmZmVjdC5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2NsYXNzZXMvZW50aXR5LmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy9pdGVtLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy9tYXAuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL21lc3NhZ2UuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL3BsYXllci5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2NsYXNzZXMvdGV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2NvbmZpZy5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2RiLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvZ2FtZS5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2dhbWVsb29wLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL21vZGVscy9hY2NvdW50LmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvbW9kZWxzL2JvdFRlbXBsYXRlLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvbW9kZWxzL2l0ZW1UZW1wbGF0ZS5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL21vZGVscy9pdGVtVHlwZS5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL21vZGVscy9tYXAuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9tb2RlbHMvcGxheWVyLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvbW9kZWxzL3BsYXllclRlbXBsYXRlLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvc2VydmVyLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvdXRpbC5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJiY3J5cHRcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJleHByZXNzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZnNcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJodHRwXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibW9uZ29vc2VcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJub2RlLWdhbWVsb29wXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicGF0aFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInNvY2tldC5pb1wiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxpQkFBaUIsc0JBQXNCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsbUJBQW1CO0FBQ25CO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwrREFBK0Q7O0FBRS9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxzQkFBc0I7QUFDdEIsR0FBRzs7QUFFSDs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0EsaUJBQWlCLFlBQVksR0FBRyxlQUFlO0FBQy9DO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTs7QUFFSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJOztBQUVKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxpQkFBaUIscUJBQXFCO0FBQ3RDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsb0JBQW9CLDBFQUE4QjtBQUNsRDtBQUNBLGtCQUFrQixzQkFBc0I7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLHVGQUEyQztBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGtFQUFrRTtBQUNsRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdm5CQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxzQkFBc0I7QUFDdEI7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQiwwRUFBOEI7QUFDbEQ7QUFDQTs7QUFFQSxpQkFBaUIsc0JBQXNCO0FBQ3ZDO0FBQ0EscUJBQXFCLDBFQUE4QjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDak1BO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDM0RBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNiQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM5SEE7QUFDQTs7QUFFQTtBQUNBLDZCQUE2QjtBQUM3Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ3BFQTtBQUNBO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1IQUF1RSxXQUFXO0FBQ2xGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZOQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ3BFQTtBQUFBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDeEJBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx3RkFBaUQsc0JBQXNCOztBQUV2RTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0osR0FBRztBQUNIO0FBQ0E7QUFDQSw0RkFBeUMsbUJBQW1CO0FBQzVEOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsdURBQXVELFNBQVM7QUFDaEU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQSw4QkFBOEIsU0FBUztBQUN2QztBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1GQUFnQyxtQkFBbUI7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUZBQWdDLG1CQUFtQjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EscUZBQWtDLHdCQUF3QixHQUFHLFdBQVc7QUFDeEU7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtGQUErQixXQUFXO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0VBQTRCLG1CQUFtQjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9GQUFpQyxnQkFBZ0IsR0FBRyxXQUFXO0FBQy9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsb0JBQW9CO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsV0FBVztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QixnQkFBZ0IsR0FBRyxXQUFXO0FBQzVEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZ0ZBQTRCLGFBQWE7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0ZBQThCLGtCQUFrQixHQUFHLFdBQVcsR0FBRyxhQUFhO0FBQzlFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtFQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx1R0FBb0QsZ0JBQWdCO0FBQ3BFO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3RkFBcUM7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxRkFBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtGQUErQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0ZBQW1DO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbGFBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIscUJBQXFCO0FBQ3hDO0FBQ0E7QUFDQTs7QUFFQSxtQkFBbUIsa0VBQXNCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0osR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSixHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwRUFBMEUsWUFBWSxXQUFXLGFBQWE7QUFDOUcsa0ZBQWtGLFlBQVksVUFBVSxhQUFhO0FBQ3JIO0FBQ0E7QUFDQTtBQUNBLDZEQUE2RCxZQUFZLGNBQWMsYUFBYTtBQUNwRyw0RUFBNEUsWUFBWSxLQUFLLGFBQWE7QUFDMUc7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxJQUFJOztBQUVKOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpQkFBaUIseUJBQXlCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixzQkFBc0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLHVCQUF1QjtBQUN4QztBQUNBO0FBQ0E7QUFDQSxpQkFBaUIseUJBQXlCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQix1QkFBdUI7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esd0RBQVksU0FBUyxLQUFLLFlBQVk7QUFDdEMsNkJBQTZCLFlBQVk7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseURBQWEsZ0JBQWdCLEtBQUssWUFBWTtBQUM5Qyw4QkFBOEIsWUFBWTtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixrRUFBc0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUVBQWEsWUFBWTtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaFJBO0FBQUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzdDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQ0hBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLDJDQUEyQztBQUN4RCxhQUFhLDZCQUE2QjtBQUMxQyxVQUFVLG9FQUFvRSx5QkFBeUIsNkJBQTZCLElBQUksUUFBUSxJQUFJLFFBQVEsSUFBSSxRQUFRLElBQUksZ0NBQWdDLEdBQUcsS0FBSztBQUNwTixhQUFhO0FBQ2IsQ0FBQzs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7OztBQ1ZBOztBQUVBO0FBQ0E7QUFDQSxTQUFTLDZCQUE2QjtBQUN0QyxXQUFXLHlCQUF5QjtBQUNwQyxlQUFlLHlCQUF5QjtBQUN4QyxnQkFBZ0IseUJBQXlCO0FBQ3pDLGtCQUFrQix5QkFBeUI7QUFDM0Msa0JBQWtCLHlCQUF5QjtBQUMzQyxjQUFjLHlCQUF5QjtBQUN2QyxZQUFZO0FBQ1osQ0FBQzs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7OztBQ2RBOztBQUVBO0FBQ0E7QUFDQSxRQUFRLDZCQUE2QjtBQUNyQyxVQUFVLHlCQUF5QjtBQUNuQyxZQUFZLDZCQUE2QjtBQUN6QyxRQUFRLDRHQUFxRTtBQUM3RSxpQkFBaUIseUJBQXlCO0FBQzFDLGtCQUFrQix5QkFBeUI7QUFDM0Msb0JBQW9CLHlCQUF5QjtBQUM3QyxvQkFBb0IseUJBQXlCO0FBQzdDLGdCQUFnQix5QkFBeUI7QUFDekMsa0JBQWtCLHlCQUF5QjtBQUMzQyxtQkFBbUIseUJBQXlCO0FBQzVDLHFCQUFxQix5QkFBeUI7QUFDOUMscUJBQXFCLHlCQUF5QjtBQUM5QyxpQkFBaUI7QUFDakIsQ0FBQzs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7OztBQ3BCQTs7QUFFQTtBQUNBO0FBQ0EsUUFBUSw2QkFBNkI7QUFDckMsZ0JBQWdCLDZCQUE2QjtBQUM3QyxhQUFhO0FBQ2IsQ0FBQzs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7OztBQ1RBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsNkJBQTZCO0FBQ3JDLGNBQWMsMkJBQTJCO0FBQ3pDLGdCQUFnQix5QkFBeUI7QUFDekMsU0FBUyxvQ0FBb0M7QUFDN0MsVUFBVSxrQ0FBa0M7QUFDNUMsYUFBYSxrQ0FBa0M7QUFDL0MsVUFBVSxnQ0FBZ0M7QUFDMUMsV0FBVyxnQ0FBZ0M7QUFDM0MsU0FBUyxnQ0FBZ0M7QUFDekMsU0FBUztBQUNULENBQUM7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqQkE7O0FBRUE7QUFDQTtBQUNBLFlBQVksMkdBQW9FO0FBQ2hGLFNBQVMsMkNBQTJDO0FBQ3BELGFBQWEsa0hBQTJFO0FBQ3hGLFVBQVUseUJBQXlCO0FBQ25DLGVBQWUseUJBQXlCO0FBQ3hDLFVBQVUseUJBQXlCO0FBQ25DLE1BQU0seUJBQXlCO0FBQy9CLE1BQU0seUJBQXlCO0FBQy9CLGNBQWMsOEJBQThCO0FBQzVDLGdCQUFnQix5QkFBeUI7QUFDekM7QUFDQSxDQUFDOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7O0FDakJBOztBQUVBO0FBQ0E7QUFDQSxTQUFTLDJDQUEyQztBQUNwRCxXQUFXLHlCQUF5QjtBQUNwQyxlQUFlLHlCQUF5QjtBQUN4QyxnQkFBZ0IseUJBQXlCO0FBQ3pDLGtCQUFrQix5QkFBeUI7QUFDM0Msa0JBQWtCLHlCQUF5QjtBQUMzQyxjQUFjLHlCQUF5QjtBQUN2QyxtQkFBbUIseUJBQXlCO0FBQzVDLG1CQUFtQjtBQUNuQixDQUFDOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx3SEFBNEUsMEJBQTBCOztBQUV0RztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx3REFBWSxVQUFVOztBQUV0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLHdEQUFZLFVBQVU7QUFDdEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDLFNBQVM7QUFDdEQsa0NBQWtDO0FBQ2xDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDO0FBQ2xDO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx3REFBWSxVQUFVLEtBQUssU0FBUztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx5REFBYSxVQUFVLEtBQUssU0FBUztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseURBQWEsVUFBVSxLQUFLLEtBQUsseUNBQXlDLFNBQVM7QUFDbkY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseURBQWEsVUFBVSxLQUFLLFVBQVU7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHNEQUFzRDtBQUN0RCxxRkFBeUMsZ0JBQWdCLHdCQUF3QixpQkFBaUIsY0FBYyxVQUFVO0FBQzFIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrRkFBa0Y7O0FBRWxGO0FBQ0E7QUFDQSxJQUFJOztBQUVKO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7OztBQ3hQQTtBQUFBO0FBQ0E7QUFDQSxpQkFBaUIsVUFBVTtBQUMzQjtBQUNBLG1CQUFtQixhQUFhO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixZQUFZO0FBQzdCLGtCO0FBQ0EsbUJBQW1CLFVBQVU7QUFDN0I7QUFDQSxxQkFBcUIsYUFBYTtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGlCQUFpQixtQkFBbUI7QUFDcEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksbUJBQW1CLEdBQUcsTUFBTSxHQUFHLElBQUksR0FBRyxLQUFLLEdBQUcsT0FBTyxHQUFHLE9BQU87QUFDM0U7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3BKQSxtQzs7Ozs7Ozs7Ozs7QUNBQSxvQzs7Ozs7Ozs7Ozs7QUNBQSwrQjs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSxxQzs7Ozs7Ozs7Ozs7QUNBQSwwQzs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSxzQyIsImZpbGUiOiJzZXJ2ZXIuYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zZXJ2ZXIvc3JjL21haW4uanNcIik7XG4iLCJpbXBvcnQgZ2FtZSBmcm9tICcuLi9nYW1lLmpzJztcclxuaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9jb25maWcuanMnO1xyXG5pbXBvcnQgdXRpbCBmcm9tICcuLi91dGlsLmpzJztcclxuaW1wb3J0IEVudGl0eSBmcm9tICcuL2VudGl0eS5qcyc7XHJcblxyXG4vLyBBbiBBY3RvciBpcyBhbiBFbnRpdHkgd2hpY2ggY2FuIG1vdmUsIGF0dGFjayBhbmQgaW50ZXJhY3Qgd2l0aCBpdGVtc1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWN0b3IgZXh0ZW5kcyBFbnRpdHkge1xyXG5cdGNvbnN0cnVjdG9yKG1hcElkLCB4LCB5LCBkaXJlY3Rpb24sIG5hbWUsIHNwcml0ZSkge1xyXG5cdFx0c3ByaXRlID0gdXRpbC5jbGFtcChzcHJpdGUsIDEsIGNvbmZpZy5NQVhfU1BSSVRFUyk7XHJcblxyXG5cdFx0c3VwZXIobWFwSWQsIHgsIHksIHNwcml0ZSk7XHJcblx0XHR0aGlzLm5hbWUgPSBuYW1lO1xyXG5cdFx0dGhpcy5kZXNjcmlwdGlvbiA9IFwiXCI7XHJcblxyXG5cdFx0dGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XHJcblx0XHR0aGlzLnN0YXJ0WCA9IHRoaXMueDtcclxuXHRcdHRoaXMuc3RhcnRZID0gdGhpcy55O1xyXG5cdFx0dGhpcy5kZXN0aW5hdGlvblggPSB0aGlzLng7XHJcblx0XHR0aGlzLmRlc3RpbmF0aW9uWSA9IHRoaXMueTtcclxuXHRcdHRoaXMubGVycCA9IDA7XHJcblxyXG5cdFx0dGhpcy5pc01vdmluZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy5pc1J1bm5pbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMubW92ZVNwZWVkID0gMi41O1xyXG5cdFx0dGhpcy5tb3ZlbWVudFRpbWVyID0gMDtcclxuXHRcdHRoaXMubGF6aW5lc3MgPSAwO1xyXG5cclxuXHRcdHRoaXMuaXNBdHRhY2tpbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMuYXR0YWNrU3BlZWQgPSAxO1xyXG5cdFx0dGhpcy5hdHRhY2tUaW1lciA9IDA7XHRcclxuXHRcdHRoaXMudGFyZ2V0ID0gbnVsbDtcclxuXHRcdHRoaXMua2lsbHMgPSAwO1xyXG5cclxuXHRcdHRoaXMuY2FsY0JvbnVzU3RhdHMoKTtcclxuXHR9XHJcblx0XHJcblx0Ly8gQ2hhcmFjdGVyIFN0YXRzXHJcblx0Z2V0IGRhbWFnZSgpIHtcclxuXHRcdGxldCBkYW1hZ2VUb3RhbCA9IHRoaXMuZGFtYWdlQmFzZSArIHRoaXMuZGFtYWdlQm9udXM7XHJcblx0XHRyZXR1cm4gKGRhbWFnZVRvdGFsIDwgMCkgPyAwIDogZGFtYWdlVG90YWw7XHJcblx0fVxyXG5cdGdldCBkZWZlbmNlKCkge1xyXG5cdFx0bGV0IGRlZmVuY2VUb3RhbCA9IHRoaXMuZGVmZW5jZUJhc2UgKyB0aGlzLmRlZmVuY2VCb251cztcclxuXHRcdHJldHVybiAoZGVmZW5jZVRvdGFsIDwgMCkgPyAwIDogZGVmZW5jZVRvdGFsO1xyXG5cdH1cclxuXHRnZXQgaGVhbHRoTWF4KCkge1xyXG5cdFx0bGV0IGhlYWx0aE1heFRvdGFsID0gdGhpcy5oZWFsdGhNYXhCYXNlICsgdGhpcy5oZWFsdGhNYXhCb251c1xyXG5cdFx0cmV0dXJuIChoZWFsdGhNYXhUb3RhbCA8IDEpID8gMSA6IGhlYWx0aE1heFRvdGFsO1xyXG5cdH1cclxuXHRnZXQgZW5lcmd5TWF4KCkge1xyXG5cdFx0bGV0IGVuZXJneU1heFRvdGFsID0gdGhpcy5lbmVyZ3lNYXhCYXNlICsgdGhpcy5lbmVyZ3lNYXhCb251cztcclxuXHRcdHJldHVybiAoZW5lcmd5TWF4VG90YWwgPCAwKSA/IDAgOiBlbmVyZ3lNYXhUb3RhbDtcclxuXHR9XHJcblx0Z2V0IHJhbmdlKCkge1xyXG5cdFx0bGV0IHJhbmdlVG90YWwgPSB0aGlzLnJhbmdlQmFzZSArIHRoaXMucmFuZ2VCb251cztcclxuXHRcdHJldHVybiAocmFuZ2VUb3RhbCA8IDEpID8gMSA6IHJhbmdlVG90YWw7XHJcblx0fVxyXG5cclxuXHRjYWxjQmFzZVN0YXRzKHRlbXBsYXRlKSB7XHJcblx0XHR0aGlzLmRhbWFnZUJhc2UgPSB0ZW1wbGF0ZS5kYW1hZ2VCYXNlIHx8IDE7XHJcblx0XHR0aGlzLmRlZmVuY2VCYXNlID0gdGVtcGxhdGUuZGVmZW5jZUJhc2UgfHwgMDtcclxuXHRcdHRoaXMuaGVhbHRoTWF4QmFzZSA9IHRlbXBsYXRlLmhlYWx0aE1heEJhc2UgKyAodGVtcGxhdGUuaGVhbHRoUGVyTGV2ZWwgKiAodGhpcy5sZXZlbCAtIDEpKSB8fCAxO1xyXG5cdFx0dGhpcy5lbmVyZ3lNYXhCYXNlID0gdGVtcGxhdGUuZW5lcmd5TWF4QmFzZSArICh0ZW1wbGF0ZS5lbmVyZ3lQZXJMZXZlbCAqICh0aGlzLmxldmVsIC0gMSkpIHx8IDE7XHJcblx0XHR0aGlzLnJhbmdlQmFzZSA9IHRlbXBsYXRlLnJhbmdlQmFzZSB8fCAxO1xyXG5cdH1cclxuXHJcblx0Y2FsY0l0ZW1Cb251cygpIHtcclxuXHRcdGNvbnN0IGl0ZW1Cb251cyA9IHtcclxuXHRcdFx0ZGFtYWdlOiAwLFxyXG5cdFx0XHRkZWZlbmNlOiAwLFxyXG5cdFx0XHRoZWFsdGhNYXg6IDAsXHJcblx0XHRcdGVuZXJneU1heDogMCxcclxuXHRcdFx0cmFuZ2U6IDBcclxuXHRcdH07XHJcblxyXG5cdFx0Y29uc3QgaW52ZW50b3J5ID0gdGhpcy5nZXRJbnZlbnRvcnkoKTtcclxuXHJcblx0XHQvLyBGb3IgZWFjaCBpdGVtIGluIGludmVudG9yeSBjaGVjayBmb3IgYm9udXNlc1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBpbnZlbnRvcnkubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgaXRlbSA9IGludmVudG9yeVtpXTtcclxuXHRcdFx0aXRlbUJvbnVzLmRhbWFnZSArPSBpdGVtLnBhc3NpdmUuZGFtYWdlO1xyXG5cdFx0XHRpdGVtQm9udXMuZGVmZW5jZSArPSBpdGVtLnBhc3NpdmUuZGVmZW5jZTtcclxuXHRcdFx0aXRlbUJvbnVzLmhlYWx0aE1heCArPSBpdGVtLnBhc3NpdmUuaGVhbHRoTWF4O1xyXG5cdFx0XHRpdGVtQm9udXMuZW5lcmd5TWF4ICs9IGl0ZW0ucGFzc2l2ZS5lbmVyZ3lNYXg7XHJcblx0XHRcdGl0ZW1Cb251cy5yYW5nZSArPSBpdGVtLnBhc3NpdmUucmFuZ2U7XHJcblxyXG5cdFx0XHRpZiAoaXRlbS5zbG90ID49IGNvbmZpZy5JTlZFTlRPUllfU0laRSkge1xyXG5cdFx0XHRcdGl0ZW1Cb251cy5kYW1hZ2UgKz0gaXRlbS5lcXVpcHBlZC5kYW1hZ2U7XHJcblx0XHRcdFx0aXRlbUJvbnVzLmRlZmVuY2UgKz0gaXRlbS5lcXVpcHBlZC5kZWZlbmNlO1xyXG5cdFx0XHRcdGl0ZW1Cb251cy5oZWFsdGhNYXggKz0gaXRlbS5lcXVpcHBlZC5oZWFsdGhNYXg7XHJcblx0XHRcdFx0aXRlbUJvbnVzLmVuZXJneU1heCArPSBpdGVtLmVxdWlwcGVkLmVuZXJneU1heDtcclxuXHRcdFx0XHRpdGVtQm9udXMucmFuZ2UgKz0gaXRlbS5lcXVpcHBlZC5yYW5nZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gaXRlbUJvbnVzO1xyXG5cdH1cclxuXHJcblx0Y2FsY0VmZmVjdEJvbnVzKCkge1xyXG5cdFx0Y29uc3QgZWZmZWN0Qm9udXMgPSB7XHJcblx0XHRcdGRhbWFnZTogMCxcclxuXHRcdFx0ZGVmZW5jZTogMCxcclxuXHRcdFx0aGVhbHRoTWF4OiAwLFxyXG5cdFx0XHRlbmVyZ3lNYXg6IDAsXHJcblx0XHRcdHJhbmdlOiAwXHJcblx0XHR9O1xyXG5cclxuXHRcdC8vIFRPRE86IHdvcmsgb3V0IGhvdyB0byBkbyBlZmZlY3RzIGZvciBzcGVsbHMgYW5kIHBvdGlvbnNcclxuXHRcdHJldHVybiBlZmZlY3RCb251cztcclxuXHR9XHJcblx0XHJcblx0Y2FsY0JvbnVzU3RhdHMoKSB7XHQvLyBJdGVtcyAoZXF1aXBwZWQgYW5kIHBhc3NpdmUpIGFuZCBFZmZlY3RzIChzcGVsbHMgYW5kIHBvdGlvbnMpXHJcblx0XHRjb25zdCBpdGVtQm9udXMgPSB0aGlzLmNhbGNJdGVtQm9udXMoKTtcclxuXHRcdGNvbnN0IGVmZmVjdEJvbnVzID0gdGhpcy5jYWxjRWZmZWN0Qm9udXMoKTtcclxuXHJcblx0XHR0aGlzLmRhbWFnZUJvbnVzID0gaXRlbUJvbnVzLmRhbWFnZSArIGVmZmVjdEJvbnVzLmRhbWFnZTtcclxuXHRcdHRoaXMuZGVmZW5jZUJvbnVzID0gaXRlbUJvbnVzLmRlZmVuY2UgKyBlZmZlY3RCb251cy5kZWZlbmNlO1xyXG5cdFx0dGhpcy5oZWFsdGhNYXhCb251cyA9IGl0ZW1Cb251cy5oZWFsdGhNYXggKyBlZmZlY3RCb251cy5oZWFsdGhNYXg7XHJcblx0XHR0aGlzLmVuZXJneU1heEJvbnVzID0gaXRlbUJvbnVzLmVuZXJneU1heCArIGVmZmVjdEJvbnVzLmVuZXJneU1heDtcclxuXHRcdHRoaXMucmFuZ2VCb251cyA9IGl0ZW1Cb251cy5yYW5nZSArIGVmZmVjdEJvbnVzLnJhbmdlO1xyXG5cdH1cclxuXHJcblx0Y2FsY1N0YXRzKCkge1xyXG5cdFx0dGhpcy5jYWxjQmFzZVN0YXRzKCk7XHJcblx0XHR0aGlzLmNhbGNCb251c1N0YXRzKCk7XHJcblx0fVxyXG5cclxuXHRyZXN0b3JlKCkge1xyXG5cdFx0dGhpcy5oZWFsdGggPSB0aGlzLmhlYWx0aE1heDtcclxuXHRcdHRoaXMuZW5lcmd5ID0gdGhpcy5lbmVyZ3lNYXg7XHJcblx0fVxyXG5cdFxyXG5cdGlucHV0RGF0YSgpIHtcclxuXHRcdC8vIFNlZSBQbGF5ZXIgYW5kIEJvdCBjbGFzc2VzXHJcblx0fVxyXG5cclxuXHQvLyBNb3ZlbWVudFxyXG5cdG1vdmUoZGlyZWN0aW9uKSB7XHJcblx0XHRpZiAodGhpcy5pc01vdmluZykgcmV0dXJuO1xyXG5cclxuXHRcdGlmIChkaXJlY3Rpb24pIHtcclxuXHRcdFx0dGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGRpcmVjdGlvbiA9PT0gJ2xlZnQnKSB7XHJcblx0XHRcdGlmICghZ2FtZS5pc1ZhY2FudCh0aGlzLm1hcElkLCB0aGlzLnggLSAxLCB0aGlzLnkpKSByZXR1cm47XHJcblx0XHRcdHRoaXMuZGVzdGluYXRpb25YLS07XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdyaWdodCcpIHtcclxuXHRcdFx0aWYgKCFnYW1lLmlzVmFjYW50KHRoaXMubWFwSWQsIHRoaXMueCArIDEsIHRoaXMueSkpIHJldHVybjtcclxuXHRcdFx0dGhpcy5kZXN0aW5hdGlvblgrKztcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ3VwJykge1xyXG5cdFx0XHRpZiAoIWdhbWUuaXNWYWNhbnQodGhpcy5tYXBJZCwgdGhpcy54LCB0aGlzLnkgLSAxKSkgcmV0dXJuO1xyXG5cdFx0XHR0aGlzLmRlc3RpbmF0aW9uWS0tO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoZGlyZWN0aW9uID09PSAnZG93bicpIHtcclxuXHRcdFx0aWYgKCFnYW1lLmlzVmFjYW50KHRoaXMubWFwSWQsIHRoaXMueCwgdGhpcy55ICsgMSkpIHJldHVybjtcclxuXHRcdFx0dGhpcy5kZXN0aW5hdGlvblkrKztcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRzd2l0Y2ggKHV0aWwucmFuZG9tSW50KDAsIDMgKyB0aGlzLmxhemluZXNzKSkge1xyXG5cdFx0XHRcdGNhc2UgMDogdGhpcy5tb3ZlKCdsZWZ0Jyk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAxOiB0aGlzLm1vdmUoJ3JpZ2h0Jyk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAyOiB0aGlzLm1vdmUoJ3VwJyk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAzOiB0aGlzLm1vdmUoJ2Rvd24nKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRkZWZhdWx0OiAvLyBEb24ndCBNb3ZlXHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFNldCBtb3ZlIHNwZWVkXHJcblx0XHRpZiAodGhpcy5pc1J1bm5pbmcpIHtcclxuXHRcdFx0aWYgKHRoaXMuZW5lcmd5ID4gMCkge1xyXG5cdFx0XHRcdHRoaXMuZW5lcmd5LS07XHJcblx0XHRcdFx0dGhpcy5tb3ZlU3BlZWQgPSA0O1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMuZW5lcmd5ID0gMDtcclxuXHRcdFx0XHR0aGlzLm1vdmVTcGVlZCA9IDIuNTtcclxuXHRcdFx0XHR0aGlzLmlzUnVubmluZyA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0dGhpcy5tb3ZlU3BlZWQgPSAyLjU7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHRoaXMuaXNNb3ZpbmcgPSB0cnVlO1xyXG5cdH1cclxuXHRcclxuXHRtb3ZlVG9UYXJnZXQodGFyZ2V0LCBob3N0aWxlKSB7XHJcblx0XHRpZiAoIXRhcmdldCkgcmV0dXJuO1xyXG5cdFx0XHJcblx0XHRpZiAodGFyZ2V0LnggPT09IHRoaXMueCAmJiB0YXJnZXQueSA9PT0gdGhpcy55KSB7XHJcblx0XHRcdHRoaXMubW92ZSgpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAodXRpbC5yYW5kb21JbnQoMCwgMSkgPT09IDApIHtcclxuXHRcdFx0aWYgKHRhcmdldC54IDwgdGhpcy54KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID49ICh0aGlzLnggLSB0aGlzLnJhbmdlKSAmJiB0YXJnZXQueSA9PT0gdGhpcy55KSB7XHJcblx0XHRcdFx0XHRpZiAoaG9zdGlsZSAmJiAhdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdsZWZ0JztcclxuXHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ2xlZnQnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ2xlZnQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodGFyZ2V0LnggPiB0aGlzLngpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LnggPT09IHRoaXMueCArIHRoaXMucmFuZ2UgJiYgdGFyZ2V0LnkgPT09IHRoaXMueSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUgJiYgIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAncmlnaHQnO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmF0dGFjaygncmlnaHQnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ3JpZ2h0Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHRhcmdldC55IDwgdGhpcy55KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggJiYgdGFyZ2V0LnkgPT09IHRoaXMueSAtIHRoaXMucmFuZ2UpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlICYmICF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ3VwJztcclxuXHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ3VwJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCd1cCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICh0YXJnZXQueSA+IHRoaXMueSkge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICYmIHRhcmdldC55ID09PSB0aGlzLnkgKyB0aGlzLnJhbmdlKSB7XHJcblx0XHRcdFx0XHRpZiAoaG9zdGlsZSAmJiAhdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdkb3duJztcclxuXHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ2Rvd24nKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ2Rvd24nKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRpZiAodGFyZ2V0LnkgPiB0aGlzLnkpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LnggPT09IHRoaXMueCAmJiB0YXJnZXQueSA9PT0gdGhpcy55ICsgdGhpcy5yYW5nZSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUgJiYgIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnZG93bic7XHJcblx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCdkb3duJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCdkb3duJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHRhcmdldC55IDwgdGhpcy55KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggJiYgdGFyZ2V0LnkgPT09IHRoaXMueSAtIHRoaXMucmFuZ2UpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlICYmICF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ3VwJztcclxuXHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ3VwJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCd1cCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICh0YXJnZXQueCA+IHRoaXMueCkge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICsgdGhpcy5yYW5nZSAmJiB0YXJnZXQueSA9PT0gdGhpcy55KSB7XHJcblx0XHRcdFx0XHRpZiAoaG9zdGlsZSAmJiAhdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdyaWdodCc7XHJcblx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCdyaWdodCcpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSgncmlnaHQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodGFyZ2V0LnggPCB0aGlzLngpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LnggPj0gKHRoaXMueCAtIHRoaXMucmFuZ2UpICYmIHRhcmdldC55ID09PSB0aGlzLnkpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlICYmICF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ2xlZnQnO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmF0dGFjaygnbGVmdCcpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSgnbGVmdCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHQvLyBDb21iYXRcclxuXHRjaGVja0luUmFuZ2UoZGlyZWN0aW9uLCB0YXJnZXQsIHJhbmdlKSB7XHJcblx0XHRpZiAodGFyZ2V0Lm1hcElkICE9PSB0aGlzLm1hcElkKSByZXR1cm4gZmFsc2U7XHJcblx0XHRpZiAodGFyZ2V0LnggPT09IHRoaXMueCAmJiB0YXJnZXQueSA9PT0gdGhpcy55KSByZXR1cm4gZmFsc2U7XHQvLyBTdGFja2VkIGRvZXMgbm90IGNvdW50IGFzIGluIHJhbmdlXHJcblx0XHRcclxuXHRcdGlmICh0YXJnZXQueSA9PT0gdGhpcy55KSB7XHJcblx0XHRcdGlmIChkaXJlY3Rpb24gPT09ICdsZWZ0Jykge1xyXG5cdFx0XHRcdGlmICh0aGlzLnggPT09IDApIHtcclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gKHRhcmdldC54IDwgdGhpcy54ICYmIHRhcmdldC54ID49ICh0aGlzLnggLSByYW5nZSkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdyaWdodCcpIHtcclxuXHRcdFx0XHRpZiAodGhpcy54ID09PSBjb25maWcuTUFQX0NPTFVNTlMgLSAxKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0cmV0dXJuICh0YXJnZXQueCA+IHRoaXMueCAmJiB0YXJnZXQueCA8PSAodGhpcy54ICsgcmFuZ2UpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKHRhcmdldC54ID09PSB0aGlzLngpIHtcclxuXHRcdFx0aWYgKGRpcmVjdGlvbiA9PT0gJ3VwJykge1xyXG5cdFx0XHRcdGlmICh0aGlzLnkgPT09IDApIHtcclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gKHRhcmdldC55IDwgdGhpcy55ICYmIHRhcmdldC55ID49ICh0aGlzLnkgLSByYW5nZSkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdkb3duJykge1xyXG5cdFx0XHRcdGlmICh0aGlzLnkgPT09IGNvbmZpZy5NQVBfUk9XUyAtIDEpIHtcclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gKHRhcmdldC55ID4gdGhpcy55ICYmIHRhcmdldC55IDw9ICh0aGlzLnkgKyByYW5nZSkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG5cclxuXHRhdHRhY2sobnVtVGFyZ2V0cyA9IDEsIGRpcmVjdGlvbiA9IHRoaXMuZGlyZWN0aW9uKSB7XHJcblx0XHRpZiAodGhpcy5pc0F0dGFja2luZyB8fCB0aGlzLmF0dGFja1RpbWVyID4gMCkgcmV0dXJuO1xyXG5cclxuXHRcdHRoaXMuaXNBdHRhY2tpbmcgPSB0cnVlO1xyXG5cdFx0XHJcblx0XHRjb25zdCBwbGF5ZXJMaXN0ID0gZ2FtZS5wbGF5ZXJzLmZpbHRlcihwbGF5ZXIgPT4gcGxheWVyLm1hcElkID09PSB0aGlzLm1hcElkKTtcclxuXHRcdGNvbnN0IGJvdExpc3QgPSBnYW1lLmJvdHMuZmlsdGVyKGJvdCA9PiBib3QubWFwSWQgPT09IHRoaXMubWFwSWQpO1xyXG5cdFx0Y29uc3QgYWN0b3JMaXN0ID0gcGxheWVyTGlzdC5jb25jYXQoYm90TGlzdCk7XHJcblx0XHRsZXQgdGFyZ2V0TGlzdCA9IGFjdG9yTGlzdC5maWx0ZXIoYWN0b3IgPT4ge1xyXG5cdFx0XHRyZXR1cm4gYWN0b3IgIT09IHRoaXMgJiYgIWFjdG9yLmlzRGVhZCAmJiB0aGlzLmNoZWNrSW5SYW5nZShkaXJlY3Rpb24sIGFjdG9yLCB0aGlzLnJhbmdlKTtcclxuXHRcdH0pO1xyXG5cdFx0XHJcblx0XHR0YXJnZXRMaXN0LnNvcnQoKGEsIGIpID0+IHtcclxuXHRcdFx0cmV0dXJuIChhLnogLSBiLnopO1x0Ly8gTG93ZXN0IHRvIGhpZ2hlc3RcclxuXHRcdH0pO1xyXG5cdFx0XHJcblx0XHR0YXJnZXRMaXN0ID0gdGFyZ2V0TGlzdC5zcGxpY2UoLW51bVRhcmdldHMpO1xyXG5cdFx0XHJcblx0XHR0YXJnZXRMaXN0LmZvckVhY2goKHRhcmdldCkgPT4ge1xyXG5cdFx0XHR0YXJnZXQudGFrZURhbWFnZSh0aGlzLmRhbWFnZSwgdGhpcyk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0XHJcblx0dGFrZURhbWFnZShkYW1hZ2UsIGF0dGFja2VyKSB7XHJcblx0XHRjb25zb2xlLmxvZyhgJHt0aGlzLmhlYWx0aH0vJHt0aGlzLmhlYWx0aE1heH1gKTtcclxuXHRcdGRhbWFnZSAtPSB0aGlzLmRlZmVuY2U7XHJcblx0XHRpZiAoZGFtYWdlIDwgMCkgZGFtYWdlID0gMDtcclxuXHRcdGdhbWUuc3Bhd25EYW1hZ2VUZXh0KHRoaXMubWFwSWQsIHRoaXMueCwgdGhpcy55LCBkYW1hZ2UpO1xyXG5cdFx0aWYgKGRhbWFnZSA9PT0gMCkgcmV0dXJuO1xyXG5cdFx0XHJcblx0XHR0aGlzLmhlYWx0aCAtPSBkYW1hZ2U7XHJcblx0XHRpZiAodGhpcy5oZWFsdGggPD0gMCkge1xyXG5cdFx0XHR0aGlzLnNldERlYWQoKTtcclxuXHRcdFx0XHJcblx0XHRcdGlmICghYXR0YWNrZXIpIHtcclxuXHRcdFx0XHRnYW1lLnNlbmRHYW1lSW5mb0dsb2JhbCh0aGlzLm5hbWUgKyBcIiBoYXMgZGllZCFcIik7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRhdHRhY2tlci5raWxscysrO1xyXG5cdFx0XHRpZiAoYXR0YWNrZXIudGFyZ2V0ID09PSB0aGlzKSBhdHRhY2tlci50YXJnZXQgPSBudWxsO1xyXG5cdFx0XHRpZiAoYXR0YWNrZXIucGxheWVySWQpIHtcclxuXHRcdFx0XHRnYW1lLnNlbmRHYW1lSW5mb0dsb2JhbChhdHRhY2tlci5uYW1lICsgXCIgaGFzIG11cmRlcmVkIFwiICsgdGhpcy5uYW1lICsgXCIgaW4gY29sZCBibG9vZCFcIik7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0Z2FtZS5zZW5kR2FtZUluZm9HbG9iYWwodGhpcy5uYW1lICsgXCIgaGFzIGJlZW4ga2lsbGVkIGJ5IFwiICsgYXR0YWNrZXIubmFtZSArIFwiIVwiKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cdFxyXG5cclxuXHRzZXREZWFkKCkge1xyXG5cdFx0Y29uc3QgbWFwID0gZ2FtZS5tYXBzW3RoaXMubWFwSWRdO1xyXG5cdFx0Y29uc3QgaW52ZW50b3J5ID0gdGhpcy5nZXRJbnZlbnRvcnkoKTtcclxuXHJcblx0XHQvLyBJbnZlbnRvcnkgSXRlbSBEcm9wIENoYW5jZVxyXG5cdFx0Y29uc3QgZHJvcENoYW5jZSA9IHV0aWwuY2xhbXAobWFwLmRyb3BDaGFuY2UsIDAsIDEwMCk7XHJcblx0XHRpZiAoZHJvcENoYW5jZSA+IDApIHtcclxuXHRcdFx0Y29uc3QgaXRlbXMgPSBpbnZlbnRvcnkuZmlsdGVyKGl0ZW0gPT4ge1xyXG5cdFx0XHRcdHJldHVybiBpdGVtLnNsb3QgPCBjb25maWcuSU5WRU5UT1JZX1NJWkU7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0aXRlbXMuZm9yRWFjaChpdGVtID0+IHtcclxuXHRcdFx0XHRpZiAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAxKSA8PSBkcm9wQ2hhbmNlKSB7XHJcblx0XHRcdFx0XHRpdGVtLm1vdmVUb01hcCh0aGlzLm1hcElkLCB0aGlzLngsIHRoaXMueSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0dGhpcy5jYWxjQm9udXNTdGF0cygpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEVxdWlwcGVkIEl0ZW0gRHJvcCBBbW91bnRcclxuXHRcdGNvbnN0IGRyb3BBbW91bnRFUSA9IHV0aWwuY2xhbXAobWFwLmRyb3BBbW91bnRFUSwgMCwgY29uZmlnLkVRVUlQTUVOVF9TSVpFKTtcclxuXHRcdGlmIChkcm9wQW1vdW50RVEgPiAwKSB7XHJcblx0XHRcdGxldCBlcXVpcG1lbnQgPSBpbnZlbnRvcnkuZmlsdGVyKGl0ZW0gPT4ge1xyXG5cdFx0XHRcdHJldHVybiBpdGVtLnNsb3QgPj0gY29uZmlnLklOVkVOVE9SWV9TSVpFO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdGVxdWlwbWVudCA9IHV0aWwuc2h1ZmZsZShlcXVpcG1lbnQpO1xyXG5cdFx0XHRlcXVpcG1lbnQuc3BsaWNlKC1kcm9wQW1vdW50RVEpO1xyXG5cdFx0XHRlcXVpcG1lbnQuZm9yRWFjaChpdGVtID0+IHtcclxuXHRcdFx0XHRpdGVtLm1vdmVUb01hcCh0aGlzLm1hcElkLCB0aGlzLngsIHRoaXMueSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHR0aGlzLmNhbGNCb251c1N0YXRzKCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdC8vIEludmVudG9yeVxyXG5cdHBpY2tVcCgpIHtcclxuXHRcdGNvbnN0IG1hcEl0ZW1zID0gZ2FtZS5pdGVtcy5maWx0ZXIoaXRlbSA9PiB7XHJcblx0XHRcdHJldHVybiBpdGVtLm1hcElkID09PSB0aGlzLm1hcElkICYmIGl0ZW0ueCA9PT0gdGhpcy54ICYmIGl0ZW0ueSA9PT0gdGhpcy55O1xyXG5cdFx0fSk7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IG1hcEl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IGl0ZW0gPSBtYXBJdGVtc1tpXTtcclxuXHRcdFx0aWYgKCFpdGVtKSBjb250aW51ZTtcclxuXHRcdFx0XHJcblx0XHRcdGlmIChpdGVtLnN0YWNrYWJsZSkge1xyXG5cdFx0XHRcdGNvbnN0IGludmVudG9yeSA9IHRoaXMuZ2V0SW52ZW50b3J5KCk7XHJcblx0XHRcdFx0aWYgKGludmVudG9yeS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRjb25zdCBzYW1lSXRlbXMgPSBpbnZlbnRvcnkuZmlsdGVyKGludmVudG9yeUl0ZW0gPT4ge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gaW52ZW50b3J5SXRlbS50ZW1wbGF0ZUlkID09PSBpdGVtLnRlbXBsYXRlSWQ7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdGlmIChzYW1lSXRlbXMubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRzYW1lSXRlbXNbMF0uc3RhY2sgKz0gaXRlbS5zdGFjaztcclxuXHRcdFx0XHRcdFx0aXRlbS5yZW1vdmUoKTtcclxuXHRcdFx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb25zdCBzbG90ID0gdGhpcy5maW5kRmlyc3RFbXB0eVNsb3QoKTtcclxuXHRcdFx0aWYgKHNsb3QgPT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdFx0aXRlbS5tb3ZlVG9JbnZlbnRvcnkodGhpcy5wbGF5ZXJJZCwgdGhpcy5ib3RJZCwgc2xvdCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRnZXRJbnZlbnRvcnkoKSB7XHJcblx0XHQvLyBTZWUgUGxheWVyIGFuZCBCb3QgY2xhc3Nlc1xyXG5cdH1cclxuXHJcblx0Z2V0SXRlbShzbG90KSB7XHJcblx0XHRjb25zdCBpbnZlbnRvcnkgPSB0aGlzLmdldEludmVudG9yeSgpO1xyXG5cdFx0Y29uc3QgaXRlbXMgPSBpbnZlbnRvcnkuZmlsdGVyKGl0ZW0gPT4ge1xyXG5cdFx0XHRyZXR1cm4gaXRlbS5zbG90ID09PSBzbG90O1xyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gaXRlbXNbMF07XHJcblx0fVxyXG5cclxuXHRoYXNJdGVtKHRlbXBsYXRlSWQpIHtcclxuXHRcdGNvbnN0IGludmVudG9yeSA9IHRoaXMuZ2V0SW52ZW50b3J5KCk7XHJcblx0XHRjb25zdCBpdGVtcyA9IGdhbWUuaXRlbXMuZmlsdGVyKGl0ZW0gPT4ge1xyXG5cdFx0XHRyZXR1cm4gaXRlbS50ZW1wbGF0ZUlkID09PSB0ZW1wbGF0ZUlkO1xyXG5cdFx0fSk7XHJcblx0XHRpZiAoaXRlbXNbMF0uc3RhY2thYmxlKSB7XHJcblx0XHRcdHJldHVybiBpdGVtc1swXS5zdGFjaztcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gaXRlbXMubGVuZ3RoO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZmluZEl0ZW1TbG90KHRlbXBsYXRlSWQpIHtcclxuXHRcdGNvbnN0IGludmVudG9yeSA9IHRoaXMuZ2V0SW52ZW50b3J5KCk7XHJcblx0XHRjb25zdCBpdGVtcyA9IGludmVudG9yeS5maWx0ZXIoaXRlbSA9PiB7XHJcblx0XHRcdHJldHVybiBpdGVtLnRlbXBsYXRlSWQgPT09IHRlbXBsYXRlSWQ7XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBpdGVtc1swXS5zbG90O1xyXG5cdH1cclxuXHJcblx0ZmluZEZpcnN0RW1wdHlTbG90KCkge1xyXG5cdFx0Y29uc3QgaW52ZW50b3J5ID0gdGhpcy5nZXRJbnZlbnRvcnkoKTtcclxuXHJcblx0XHRmb3IgKGxldCBzbG90ID0gMDsgc2xvdCA8IGNvbmZpZy5JTlZFTlRPUllfU0laRTsgc2xvdCsrKSB7XHJcblx0XHRcdGxldCBvY2N1cGllZCA9IGZhbHNlO1xyXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGludmVudG9yeS5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdGlmIChpbnZlbnRvcnlbaV0uc2xvdCA9PT0gc2xvdCkge1xyXG5cdFx0XHRcdFx0b2NjdXBpZWQgPSB0cnVlO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICghb2NjdXBpZWQpIHJldHVybiBzbG90O1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fVxyXG5cclxuXHR1c2VJdGVtKHNsb3QpIHtcclxuXHRcdGNvbnN0IGl0ZW0gPSB0aGlzLmdldEl0ZW0oc2xvdCk7XHJcblx0XHRpZiAoIWl0ZW0pIHJldHVybjtcclxuXHJcblx0XHQvLyBUT0RPOiBpZiAoIXVzZVNjcmlwdCgpKSByZXR1cm47XHJcblxyXG5cdFx0aWYgKGl0ZW0uaXNFcXVpcG1lbnQoKSkge1xyXG5cdFx0XHRpZiAoaXRlbS5zbG90IDwgY29uZmlnLklOVkVOVE9SWV9TSVpFKSB7XHQvLyBDaGVjayBpZiBpdGVtIGlzIGVxdWlwcGVkXHJcblx0XHRcdFx0dGhpcy5lcXVpcEl0ZW0oaXRlbSk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMudW5lcXVpcEl0ZW0oaXRlbSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIWl0ZW0ucmV1c2FibGUpIGl0ZW0ucmVtb3ZlT25lKCk7XHJcblx0fVxyXG5cclxuXHRkcm9wSXRlbShzbG90KSB7XHJcblx0XHRjb25zdCBpdGVtID0gdGhpcy5nZXRJdGVtKHNsb3QpO1xyXG5cdFx0aWYgKCFpdGVtKSByZXR1cm47XHJcblx0XHRpdGVtLm1vdmVUb01hcCh0aGlzLm1hcElkLCB0aGlzLngsIHRoaXMueSk7XHJcblx0XHR0aGlzLmNhbGNCb251c1N0YXRzKCk7XHJcblx0fVxyXG5cclxuXHRtb3ZlSXRlbVRvU2xvdChzbG90LCBuZXdTbG90KSB7XHJcblx0XHRpZiAoc2xvdCA9PSBudWxsIHx8IG5ld1Nsb3QgPT0gbnVsbCB8fCBzbG90ID09PSBuZXdTbG90KSByZXR1cm47XHQvLyBudWxsID09IHVuZGVmaW5lZCwgbnVsbCAhPSAwXHJcblx0XHRpZiAoc2xvdCA+PSBjb25maWcuSU5WRU5UT1JZX1NJWkUgKyBjb25maWcuRVFVSVBNRU5UX1NJWkUpIHJldHVybjtcclxuXHRcdGlmIChuZXdTbG90ID49IGNvbmZpZy5JTlZFTlRPUllfU0laRSArIGNvbmZpZy5FUVVJUE1FTlRfU0laRSkgcmV0dXJuO1xyXG5cclxuXHRcdGNvbnN0IGl0ZW0gPSB0aGlzLmdldEl0ZW0oc2xvdCk7XHJcblx0XHRjb25zdCBuZXdJdGVtID0gdGhpcy5nZXRJdGVtKG5ld1Nsb3QpO1xyXG5cdFx0aWYgKCFpdGVtKSByZXR1cm47XHJcblxyXG5cdFx0Ly8gVGFyZ2V0IHNsb3QgaXMgZm9yIGVxdWlwbWVudCAtIGNoZWNrIHR5cGUgbWF0Y2hlc1xyXG5cdFx0aWYgKG5ld1Nsb3QgPj0gY29uZmlnLklOVkVOVE9SWV9TSVpFKSB7XHJcblx0XHRcdGlmIChpdGVtLmVxdWlwcGVkU2xvdCArIGNvbmZpZy5JTlZFTlRPUllfU0laRSAhPT0gbmV3U2xvdCkge1xyXG5cdFx0XHRcdGdhbWUuc2VuZEdhbWVJbmZvUGxheWVyKHRoaXMuaWQsIFwiVGhhdCBjYW5ub3QgYmUgZXF1aXBwZWQgdGhlcmUuXCIpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHN3YXBTbG90cyA9ICgpID0+IHtcclxuXHRcdFx0aXRlbS5zbG90ID0gbmV3U2xvdDtcclxuXHRcdFx0aWYgKG5ld0l0ZW0pIG5ld0l0ZW0uc2xvdCA9IHNsb3Q7XHJcblx0XHRcdHRoaXMuY2FsY0JvbnVzU3RhdHMoKTtcclxuXHRcdH07XHJcblxyXG5cdFx0Ly8gSUYgTm8gbmV3IGl0ZW0gaW4gbmV3IHNsb3RcclxuXHRcdC8vIE9SIE5ldyBpdGVtIGluIG5ldyBzbG90LCBvbGQgaXRlbSBpbiBpbnZlbnRvcnlcclxuXHRcdC8vIE9SIE5ldyBpdGVtIGluIG5ldyBzbG90LCBvbGQgaXRlbSBpcyBlcXVpcHBlZCwgbmV3IGl0ZW0gY2FuIGJlIGVxdWlwcGVkIGluIG9sZCBzbG90XHJcblx0XHRpZiAoIW5ld0l0ZW0gfHwgc2xvdCA8IGNvbmZpZy5JTlZFTlRPUllfU0laRSB8fCBuZXdJdGVtLmVxdWlwcGVkU2xvdCArIGNvbmZpZy5JTlZFTlRPUllfU0laRSA9PT0gc2xvdCkge1xyXG5cdFx0XHRzd2FwU2xvdHMoKTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHQvLyBPbGQgaXRlbSBpcyBlcXVpcHBlZCwgbmV3IGl0ZW0gY2Fubm90IGJlIGVxdWlwcGVkIGluIG9sZCBzbG90XHJcblx0XHRcdG5ld1Nsb3QgPSB0aGlzLmZpbmRGaXJzdEVtcHR5U2xvdCgpO1xyXG5cdFx0XHRpZiAobmV3U2xvdCAhPSBudWxsKSB7XHJcblx0XHRcdFx0c3dhcFNsb3RzKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0Z2FtZS5zZW5kR2FtZUluZm9QbGF5ZXIodGhpcy5pZCwgXCJZb3VyIGludmVudG9yeSBpcyBmdWxsLlwiKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZXF1aXBJdGVtKGl0ZW0pIHtcclxuXHRcdGNvbnN0IGVxdWlwcGVkSXRlbSA9IHRoaXMuZ2V0SXRlbShpdGVtLmVxdWlwcGVkU2xvdCArIGNvbmZpZy5JTlZFTlRPUllfU0laRSk7XHJcblx0XHRpdGVtLnNsb3QgPSBpdGVtLmVxdWlwcGVkU2xvdCArIGNvbmZpZy5JTlZFTlRPUllfU0laRTtcclxuXHRcdGlmIChlcXVpcHBlZEl0ZW0pIGVxdWlwcGVkSXRlbS5zbG90ID0gdGhpcy5maW5kRmlyc3RFbXB0eVNsb3QoKTtcclxuXHRcdHRoaXMuY2FsY0JvbnVzU3RhdHMoKTtcclxuXHR9XHJcblxyXG5cdHVuZXF1aXBJdGVtKGl0ZW0pIHtcclxuXHRcdGNvbnN0IG5ld1Nsb3QgPSB0aGlzLmZpbmRGaXJzdEVtcHR5U2xvdCgpO1xyXG5cdFx0aWYgKG5ld1Nsb3QgPT0gbnVsbCkge1xyXG5cdFx0XHRnYW1lLnNlbmRHYW1lSW5mb1BsYXllcih0aGlzLmdhbWVJZCwgXCJZb3VyIGludmVudG9yeSBpcyBmdWxsLlwiKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0aXRlbS5zbG90ID0gbmV3U2xvdDtcclxuXHRcdHRoaXMuY2FsY0JvbnVzU3RhdHMoKTtcclxuXHR9XHJcblxyXG5cdHVwZGF0ZShkZWx0YSkge1xyXG5cdFx0Ly8gSW52ZW50b3J5IEl0ZW0gVXBkYXRlXHJcblx0XHRjb25zdCBpbnZlbnRvcnkgPSB0aGlzLmdldEludmVudG9yeSgpO1xyXG5cdFx0aW52ZW50b3J5LmZvckVhY2goaXRlbSA9PiB7XHJcblx0XHRcdGlmIChpdGVtKSBpdGVtLnVwZGF0ZSgpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0aWYgKHRoaXMuaXNEZWFkKSByZXR1cm47XHJcblx0XHRcclxuXHRcdC8vIEF0dGFja2luZ1xyXG5cdFx0aWYgKHRoaXMuaXNBdHRhY2tpbmcgfHwgdGhpcy5hdHRhY2tUaW1lciA+IDApIHtcclxuXHRcdFx0dGhpcy5hdHRhY2tUaW1lciArPSBkZWx0YTtcclxuXHRcdFx0aWYgKHRoaXMuYXR0YWNrVGltZXIgPj0gMC4zKSB0aGlzLmlzQXR0YWNraW5nID0gZmFsc2U7XHJcblx0XHRcdGlmICh0aGlzLmF0dGFja1RpbWVyID49IHRoaXMuYXR0YWNrU3BlZWQpIHRoaXMuYXR0YWNrVGltZXIgPSAwO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBNb3ZlbWVudFxyXG5cdFx0aWYgKHRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0dGhpcy5sZXJwICs9IGRlbHRhICogdGhpcy5tb3ZlU3BlZWQ7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAodGhpcy5sZXJwID49IDAuNDkpIHtcclxuXHRcdFx0XHR0aGlzLnggPSB0aGlzLmRlc3RpbmF0aW9uWDtcclxuXHRcdFx0XHR0aGlzLnkgPSB0aGlzLmRlc3RpbmF0aW9uWTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0aWYgKHRoaXMubGVycCA+PSAwLjk5KSB7XHJcblx0XHRcdFx0dGhpcy5zdGFydFggPSB0aGlzLmRlc3RpbmF0aW9uWDtcclxuXHRcdFx0XHR0aGlzLnN0YXJ0WSA9IHRoaXMuZGVzdGluYXRpb25ZO1xyXG5cdFx0XHRcdHRoaXMubGVycCA9IDA7XHJcblx0XHRcdFx0dGhpcy5pc01vdmluZyA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRnZXRJbnZlbnRvcnlQYWNrKCkge1xyXG5cdFx0Y29uc3QgaW52ZW50b3J5UGFjayA9IFtdO1xyXG5cdFx0Y29uc3QgaW52ZW50b3J5ID0gdGhpcy5nZXRJbnZlbnRvcnkoKTtcclxuXHRcdGludmVudG9yeS5mb3JFYWNoKChpdGVtKSA9PiB7XHJcblx0XHRcdGlmIChpdGVtKSBpbnZlbnRvcnlQYWNrW2l0ZW0uc2xvdF0gPSBpdGVtLmdldFBhY2soKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBpbnZlbnRvcnlQYWNrO1xyXG5cdH1cclxufVxyXG4iLCJpbXBvcnQgZ2FtZSBmcm9tICcuLi9nYW1lLmpzJztcclxuaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9jb25maWcuanMnO1xyXG5pbXBvcnQgdXRpbCBmcm9tICcuLi91dGlsLmpzJztcclxuaW1wb3J0IEFjdG9yIGZyb20gJy4vYWN0b3IuanMnO1xyXG5cclxuLy8gQSBCb3QgaXMgYW4gQWN0b3Igd2l0aCBjb25kaXRpb25hbCBpbnB1dHNcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJvdCBleHRlbmRzIEFjdG9yIHtcclxuXHRjb25zdHJ1Y3RvcihtYXBJZCwgeCwgeSwgZGlyZWN0aW9uLCB0ZW1wbGF0ZSkge1xyXG5cdFx0c3VwZXIobWFwSWQsIHgsIHksIGRpcmVjdGlvbiwgdGVtcGxhdGUubmFtZSwgdGVtcGxhdGUuc3ByaXRlKTtcclxuXHRcdHRoaXMuZGFtYWdlQmFzZSA9IHRlbXBsYXRlLmRhbWFnZUJhc2U7XHJcblx0XHR0aGlzLmRlZmVuY2VCYXNlID0gdGVtcGxhdGUuZGVmZW5jZUJhc2U7XHJcblx0XHR0aGlzLmhlYWx0aE1heEJhc2UgPSB0ZW1wbGF0ZS5oZWFsdGhNYXhCYXNlO1xyXG5cdFx0dGhpcy5lbmVyZ3lNYXhCYXNlID0gdGVtcGxhdGUuZW5lcmd5TWF4QmFzZTtcclxuXHRcdHRoaXMucmFuZ2VCYXNlID0gdGVtcGxhdGUucmFuZ2VCYXNlO1xyXG5cdFx0dGhpcy5yZXN0b3JlKCk7XHJcblx0XHRcclxuXHRcdHRoaXMuaG9zdGlsZSA9IHRlbXBsYXRlLmhvc3RpbGU7XHJcblx0XHR0aGlzLnRhcmdldCA9IG51bGw7XHJcblx0XHR0aGlzLnNldFRhc2soJ3dhbmRlcmluZycpO1xyXG5cdFx0dGhpcy5tb3ZlVGltZXIgPSAwO1xyXG5cclxuXHRcdHRoaXMuZ2FtZUlkID0gdXRpbC5maXJzdEVtcHR5SW5kZXgoZ2FtZS5ib3RzKTtcclxuXHRcdHRoaXMuYm90SWQgPSB0aGlzLmdhbWVJZDtcclxuXHRcdGdhbWUuYm90c1t0aGlzLmdhbWVJZF0gPSB0aGlzO1xyXG5cdH1cclxuXHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHRzdXBlci51cGRhdGUoZGVsdGEpOyBcdC8vIERlZmF1bHQgQWN0b3IgVXBkYXRlXHJcblx0XHRpZiAodGhpcy5pc0RlYWQpIHJldHVybjtcclxuXHJcblx0XHR0aGlzLm1vdmVUaW1lcisrO1xyXG5cdFx0XHJcblx0XHQvLyBBSSBJbnB1dHNcclxuXHRcdHN3aXRjaCh0aGlzLnRhc2spIHtcclxuXHRcdFx0Y2FzZSAnd2FuZGVyaW5nJzpcdFx0Ly8gTW92ZSByYW5kb21seVxyXG5cdFx0XHRcdHRoaXMubW92ZSgpO1xyXG5cdFx0XHRcdHRoaXMucGlja1VwKCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdmb2xsb3dpbmcnOlx0XHQvLyBNb3ZlIHRvd2FyZHMgdGFyZ2V0XHJcblx0XHRcdFx0aWYgKHRoaXMudGFyZ2V0KSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmVUb1RhcmdldCh0aGlzLnRhcmdldCwgZmFsc2UpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdC8vIE5vIHRhcmdldFxyXG5cdFx0XHRcdFx0dGhpcy5zZXRUYXNrKCd3YW5kZXJpbmcnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdhdHRhY2tpbmcnOlx0XHQvLyBNb3ZlIHRvd2FyZHMgdGFyZ2V0IGFuZCBhdHRhY2tcclxuXHRcdFx0XHRpZiAodGhpcy50YXJnZXQpIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZVRvVGFyZ2V0KHRoaXMudGFyZ2V0LCB0cnVlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHQvLyBObyB0YXJnZXRcclxuXHRcdFx0XHRcdHRoaXMuc2V0VGFzaygnd2FuZGVyaW5nJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Ly8gY2FzZSAnaWRsZSc6XHJcblx0XHRcdGRlZmF1bHQ6IFx0XHRcdFx0XHQvLyBTdGFuZCBzdGlsbFxyXG5cdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIHRoaXMuZ2V0UGFjaygpO1xyXG5cdH1cclxuXHRcclxuXHRnZXRQYWNrKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0Z2FtZUlkOiB0aGlzLmdhbWVJZCxcclxuXHRcdFx0bmFtZTogdGhpcy5uYW1lLFxyXG5cdFx0XHRzcHJpdGU6IHRoaXMuc3ByaXRlLFxyXG5cdFx0XHRkaXJlY3Rpb246IHRoaXMuZGlyZWN0aW9uLFxyXG5cdFx0XHRtYXBJZDogdGhpcy5tYXBJZCxcclxuXHRcdFx0eDogdGhpcy5zdGFydFgsXHJcblx0XHRcdHk6IHRoaXMuc3RhcnRZLFxyXG5cdFx0XHR6OiB0aGlzLnosXHJcblx0XHRcdGRlc3RpbmF0aW9uWDogdGhpcy5kZXN0aW5hdGlvblgsXHJcblx0XHRcdGRlc3RpbmF0aW9uWTogdGhpcy5kZXN0aW5hdGlvblksXHJcblx0XHRcdGxlcnA6IHRoaXMubGVycCxcclxuXHRcdFx0aXNSdW5uaW5nOiB0aGlzLmlzUnVubmluZyxcclxuXHRcdFx0aXNBdHRhY2tpbmc6IHRoaXMuaXNBdHRhY2tpbmcsXHJcblx0XHRcdGlzRGVhZDogZmFsc2UsXHJcblx0XHRcdGlzVmlzaWJsZTogdGhpcy5pc1Zpc2libGVcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHRyZW1vdmUoKSB7XHJcblx0XHRkZWxldGUgZ2FtZS5ib3RzW3RoaXMuZ2FtZUlkXTtcclxuXHR9XHJcblx0XHJcblx0bW92ZShkaXJlY3Rpb24pIHtcclxuXHRcdGxldCBtb3ZlVGltZSA9IDI0O1xyXG5cdFx0aWYgKHRoaXMuaXNSdW5uaW5nKSBtb3ZlVGltZSA9IDE3O1xyXG5cdFx0aWYgKHRoaXMubW92ZVRpbWVyID4gbW92ZVRpbWUgJiYgdGhpcy5hdHRhY2tUaW1lciA9PT0gMCkge1xyXG5cdFx0XHRzdXBlci5tb3ZlKGRpcmVjdGlvbik7XHJcblx0XHRcdHRoaXMubW92ZVRpbWVyID0gMDtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0dGFrZURhbWFnZShkYW1hZ2UsIGF0dGFja2VyKSB7XHJcblx0XHRpZiAoYXR0YWNrZXIgaW5zdGFuY2VvZiBBY3RvcikgdGhpcy5zZXRUYXNrKCdhdHRhY2tpbmcnLCBhdHRhY2tlcik7XHJcblx0XHRzdXBlci50YWtlRGFtYWdlKGRhbWFnZSwgYXR0YWNrZXIpO1xyXG5cdH1cclxuXHRcclxuXHRwaWNrVXAoKSB7XHJcblx0XHRzdXBlci5waWNrVXAoKTtcclxuXHRcdHRoaXMuY2hlY2tCZXN0RXF1aXBtZW50KCk7XHJcblx0fVxyXG5cclxuXHRnZXRJbnZlbnRvcnkoKSB7XHJcblx0XHRjb25zdCBpbnZlbnRvcnkgPSBnYW1lLml0ZW1zLmZpbHRlcihpdGVtID0+IHtcclxuXHRcdFx0cmV0dXJuIGl0ZW0uYm90SWQgPT09IHRoaXMuYm90SWQ7XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBpbnZlbnRvcnk7XHJcblx0fVxyXG5cclxuXHRzZXREZWFkKCkge1xyXG5cdFx0c3VwZXIuc2V0RGVhZCgpO1xyXG5cdFx0dGhpcy5yZW1vdmUoKTtcclxuXHR9XHJcblxyXG5cdC8vIElucHV0c1xyXG5cdHNldFRhc2sodGFzaywgdGFyZ2V0KSB7XHJcblx0XHRzd2l0Y2ggKHRhc2spIHtcclxuXHRcdFx0Y2FzZSAnd2FuZGVyaW5nJzpcclxuXHRcdFx0XHR0aGlzLmxhemluZXNzID0gNztcclxuXHRcdFx0XHR0aGlzLnRhcmdldCA9IG51bGw7XHJcblx0XHRcdFx0dGhpcy50YXNrID0gdGFzaztcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ2ZvbGxvd2luZyc6XHJcblx0XHRcdFx0aWYgKHRhcmdldCA9PT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0dGhpcy5zZXRUYXNrKCd3YW5kZXJpbmcnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLmxhemluZXNzID0gMDtcclxuXHRcdFx0XHRcdHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xyXG5cdFx0XHRcdFx0dGhpcy50YXNrID0gdGFzaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdhdHRhY2tpbmcnOlxyXG5cdFx0XHRcdGlmICh0YXJnZXQgPT09IG51bGwpIHtcclxuXHRcdFx0XHRcdHRoaXMuc2V0VGFzaygnd2FuZGVyaW5nJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5sYXppbmVzcyA9IDA7XHJcblx0XHRcdFx0XHR0aGlzLnRhcmdldCA9IHRhcmdldDtcclxuXHRcdFx0XHRcdHRoaXMudGFzayA9IHRhc2s7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0ZGVmYXVsdDpcdC8vaWRsaW5nXHJcblx0XHRcdFx0dGhpcy5sYXppbmVzcyA9IDc7XHJcblx0XHRcdFx0dGhpcy50YXJnZXQgPSBudWxsO1xyXG5cdFx0XHRcdHRoaXMudGFzayA9ICdpZGxlJztcclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGNoZWNrQmVzdEVxdWlwbWVudCgpIHtcclxuXHRcdGNvbnN0IGludmVudG9yeSA9IHRoaXMuZ2V0SW52ZW50b3J5KCk7XHJcblx0XHRjb25zdCBlcXVpcG1lbnQgPSBbXTtcclxuXHRcdGZvciAobGV0IHNsb3QgPSAwOyBzbG90IDwgY29uZmlnLkVRVUlQTUVOVF9TSVpFOyBzbG90KyspIHtcclxuXHRcdFx0ZXF1aXBtZW50LnB1c2goW10pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgaW52ZW50b3J5Lmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IGl0ZW0gPSBpbnZlbnRvcnlbaV07XHJcblx0XHRcdGZvciAobGV0IHNsb3QgPSAwOyBzbG90IDwgY29uZmlnLkVRVUlQTUVOVF9TSVpFOyBzbG90KyspIHtcclxuXHRcdFx0XHRpZiAoaXRlbS5lcXVpcHBlZFNsb3QgPT09IHNsb3QpIHtcclxuXHRcdFx0XHRcdGVxdWlwbWVudFtzbG90XS5wdXNoKGl0ZW0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChlcXVpcG1lbnRbMF0ubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRlcXVpcG1lbnRbMF0uc29ydCgoYSwgYikgPT4gYi5lcXVpcHBlZC5kYW1hZ2UgLSBhLmVxdWlwcGVkLmRhbWFnZSk7XHJcblx0XHRcdHRoaXMuZXF1aXBJdGVtKGVxdWlwbWVudFswXVswXSk7XHJcblx0XHR9XHJcblx0XHRpZiAoZXF1aXBtZW50WzFdLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0ZXF1aXBtZW50WzFdLnNvcnQoKGEsIGIpID0+IGIuZXF1aXBwZWQuZGVmZW5jZSAtIGEuZXF1aXBwZWQuZGVmZW5jZSk7XHJcblx0XHRcdHRoaXMuZXF1aXBJdGVtKGVxdWlwbWVudFsxXVswXSk7XHJcblx0XHR9XHJcblx0XHRpZiAoZXF1aXBtZW50WzJdLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0ZXF1aXBtZW50WzJdLnNvcnQoKGEsIGIpID0+IGIuZXF1aXBwZWQuZGVmZW5jZSAtIGEuZXF1aXBwZWQuZGVmZW5jZSk7XHJcblx0XHRcdHRoaXMuZXF1aXBJdGVtKGVxdWlwbWVudFsyXVswXSk7XHJcblx0XHR9XHJcblx0XHRpZiAoZXF1aXBtZW50WzNdLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0ZXF1aXBtZW50WzNdLnNvcnQoKGEsIGIpID0+IGIuZXF1aXBwZWQuZGVmZW5jZSAtIGEuZXF1aXBwZWQuZGVmZW5jZSk7XHJcblx0XHRcdHRoaXMuZXF1aXBJdGVtKGVxdWlwbWVudFszXVswXSk7XHJcblx0XHR9XHJcblx0XHRpZiAoZXF1aXBtZW50WzRdLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0ZXF1aXBtZW50WzRdLnNvcnQoKGEsIGIpID0+IGIuZXF1aXBwZWQuZGVmZW5jZSAtIGEuZXF1aXBwZWQuZGVmZW5jZSk7XHJcblx0XHRcdHRoaXMuZXF1aXBJdGVtKGVxdWlwbWVudFs0XVswXSk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbiIsImltcG9ydCBFbnRpdHkgZnJvbSAnLi9lbnRpdHkuanMnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuLi9nYW1lLmpzJztcclxuaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9jb25maWcuanMnO1xyXG5pbXBvcnQgdXRpbCBmcm9tICcuLi91dGlsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVmZmVjdCBleHRlbmRzIEVudGl0eSB7XHJcblx0Y29uc3RydWN0b3IobWFwSWQsIHgsIHksIHNwcml0ZSA9IDAsIGxvb3AgPSAwLCBzcGVlZCA9IDEyLCBtYXhGcmFtZSA9IDcsIHN0YXJ0RnJhbWUgPSAwKSB7XHJcblx0XHRzdXBlcihtYXBJZCwgeCwgeSwgdXRpbC5jbGFtcChzcHJpdGUsIDAsIGNvbmZpZy5NQVhfRUZGRUNUUyAtIDEpKTtcclxuXHRcdHRoaXMubWF4RnJhbWUgPSB1dGlsLmNsYW1wKG1heEZyYW1lLCAwLCA3KTtcclxuXHRcdHRoaXMuc3RhcnRGcmFtZSA9IHV0aWwuY2xhbXAoc3RhcnRGcmFtZSwgMCwgdGhpcy5tYXhGcmFtZSk7XHJcblx0XHR0aGlzLmN1cnJlbnRGcmFtZSA9IHRoaXMuc3RhcnRGcmFtZTtcclxuXHRcdFxyXG5cdFx0dGhpcy5sb29wID0gbG9vcDtcclxuXHRcdHRoaXMuc3BlZWQgPSBzcGVlZDtcclxuXHRcdHRoaXMudGltZXIgPSAwO1xyXG5cdFx0XHJcblx0XHR0aGlzLmdhbWVJZCA9IHV0aWwuZmlyc3RFbXB0eUluZGV4KGdhbWUuZWZmZWN0cyk7XHJcblx0XHRnYW1lLmVmZmVjdHNbdGhpcy5nYW1lSWRdID0gdGhpcztcclxuXHR9XHJcblx0XHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHR0aGlzLnRpbWVyICs9IGRlbHRhO1xyXG5cdFx0XHJcblx0XHRpZiAodGhpcy50aW1lciA+PSAxIC8gdGhpcy5zcGVlZCkge1xyXG5cdFx0XHR0aGlzLnRpbWVyID0gMDtcclxuXHRcdFx0dGhpcy5jdXJyZW50RnJhbWUrKztcclxuXHJcblx0XHRcdGlmICh0aGlzLmN1cnJlbnRGcmFtZSA+IHRoaXMubWF4RnJhbWUpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5sb29wIDwgMCkge1xyXG5cdFx0XHRcdFx0dGhpcy5jdXJyZW50RnJhbWUgPSB0aGlzLnN0YXJ0RnJhbWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2UgaWYgKHRoaXMubG9vcCA+IDApIHtcclxuXHRcdFx0XHRcdHRoaXMuY3VycmVudEZyYW1lID0gdGhpcy5zdGFydEZyYW1lO1xyXG5cdFx0XHRcdFx0dGhpcy5sb29wLS07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5jdXJyZW50RnJhbWUgPSB0aGlzLm1heEZyYW1lO1xyXG5cdFx0XHRcdFx0dGhpcy5yZW1vdmUoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGhpcy5nZXRQYWNrKCk7XHJcblx0fVxyXG5cdFxyXG5cdGdldFBhY2soKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRnYW1lSWQ6IHRoaXMuZ2FtZUlkLFxyXG5cdFx0XHRtYXBJZDogdGhpcy5tYXBJZCxcclxuXHRcdFx0eDogdGhpcy54LFxyXG5cdFx0XHR5OiB0aGlzLnksXHJcblx0XHRcdHNwcml0ZTogdGhpcy5zcHJpdGUsXHJcblx0XHRcdGN1cnJlbnRGcmFtZTogdGhpcy5jdXJyZW50RnJhbWVcclxuXHRcdH07XHJcblx0fVxyXG5cdFxyXG5cdHJlbW92ZSgpIHtcclxuXHRcdGRlbGV0ZSBnYW1lLmVmZmVjdHNbdGhpcy5nYW1lSWRdO1xyXG5cdH1cdFxyXG59XHJcbiIsImltcG9ydCBjb25maWcgZnJvbSAnLi4vY29uZmlnLmpzJztcclxuXHJcbi8vIEFuIEVudGl0eSBpcyBhbnkgb2JqZWN0IHdoaWNoIGNhbiBhcHBlYXIgb24gdGhlIG1hcFxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW50aXR5IHtcclxuXHRjb25zdHJ1Y3RvcihtYXBJZCwgeCwgeSwgc3ByaXRlID0gMSkge1xyXG5cdFx0dGhpcy5tYXBJZCA9IG1hcElkO1xyXG5cdFx0dGhpcy54ID0geDtcclxuXHRcdHRoaXMueSA9IHk7XHJcblx0XHRpZiAoc3ByaXRlIDwgMSkgc3ByaXRlID0gMTtcclxuXHRcdHRoaXMuc3ByaXRlID0gc3ByaXRlO1xyXG5cdFx0dGhpcy5pc1Zpc2libGUgPSB0cnVlO1xyXG5cdH1cclxufVxyXG4iLCJpbXBvcnQgZ2FtZSBmcm9tICcuLi9nYW1lLmpzJztcclxuaW1wb3J0IHV0aWwgZnJvbSAnLi4vdXRpbC5qcyc7XHJcbmltcG9ydCBFbnRpdHkgZnJvbSAnLi9lbnRpdHkuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSXRlbSBleHRlbmRzIEVudGl0eSB7XHJcblx0Y29uc3RydWN0b3IocG9zaXRpb24sIHRlbXBsYXRlLCBzdGFjaykge1xyXG5cdFx0aWYgKHBvc2l0aW9uLnBsYXllcklkID09PSB1bmRlZmluZWQpIHBvc2l0aW9uLnBsYXllcklkID0gbnVsbDtcclxuXHRcdGlmIChwb3NpdGlvbi5ib3RJZCA9PT0gdW5kZWZpbmVkKSBwb3NpdGlvbi5ib3RJZCA9IG51bGw7XHJcblx0XHRpZiAocG9zaXRpb24uc2xvdCA9PT0gdW5kZWZpbmVkKSBwb3NpdGlvbi5zbG90ID0gbnVsbDtcclxuXHRcdGlmIChwb3NpdGlvbi5tYXBJZCA9PT0gdW5kZWZpbmVkKSBwb3NpdGlvbi5tYXBJZCA9IG51bGw7XHJcblx0XHRpZiAocG9zaXRpb24ueCA9PT0gdW5kZWZpbmVkKSBwb3NpdGlvbi54ID0gbnVsbDtcclxuXHRcdGlmIChwb3NpdGlvbi55ID09PSB1bmRlZmluZWQpIHBvc2l0aW9uLnkgPSBudWxsO1xyXG5cclxuXHRcdHN1cGVyKHBvc2l0aW9uLm1hcElkLCBwb3NpdGlvbi54LCBwb3NpdGlvbi55LCB0ZW1wbGF0ZS5zcHJpdGUpO1xyXG5cdFx0dGhpcy56ID0gLTEwO1xyXG5cdFx0dGhpcy5wbGF5ZXJJZCA9IHBvc2l0aW9uLnBsYXllcklkO1xyXG5cdFx0dGhpcy5ib3RJZCA9IHBvc2l0aW9uLmJvdElkO1xyXG5cdFx0dGhpcy5zbG90ID0gcG9zaXRpb24uc2xvdDtcclxuXHRcdFxyXG5cdFx0dGhpcy50ZW1wbGF0ZUlkID0gdGVtcGxhdGUuX2lkO1xyXG5cdFx0dGhpcy5uYW1lID0gdGVtcGxhdGUubmFtZTtcclxuXHRcdHRoaXMuZGVzY3JpcHRpb24gPSB0ZW1wbGF0ZS5kZXNjcmlwdGlvbjtcclxuXHRcdHRoaXMucmV1c2FibGUgPSB0ZW1wbGF0ZS5yZXVzYWJsZTtcclxuXHJcblx0XHR0aGlzLnR5cGUgPSB0ZW1wbGF0ZS50eXBlLm5hbWU7XHJcblx0XHR0aGlzLnN0YWNrYWJsZSA9IHRlbXBsYXRlLnR5cGUuc3RhY2thYmxlO1xyXG5cdFx0dGhpcy5lcXVpcHBlZFNsb3QgPSB0ZW1wbGF0ZS50eXBlLmVxdWlwcGVkU2xvdDtcclxuXHRcdFxyXG5cdFx0dGhpcy5wYXNzaXZlID0ge1xyXG5cdFx0XHRkYW1hZ2U6IHRlbXBsYXRlLnBhc3NpdmVEYW1hZ2UsXHJcblx0XHRcdGRlZmVuY2U6IHRlbXBsYXRlLnBhc3NpdmVEZWZlbmNlLFxyXG5cdFx0XHRoZWFsdGhNYXg6IHRlbXBsYXRlLnBhc3NpdmVIZWFsdGhNYXgsXHJcblx0XHRcdGVuZXJneU1heDogdGVtcGxhdGUucGFzc2l2ZUVuZXJneU1heCxcclxuXHRcdFx0cmFuZ2U6IHRlbXBsYXRlLnBhc3NpdmVSYW5nZVxyXG5cdFx0fTtcclxuXHRcdHRoaXMuZXF1aXBwZWQgPSB7XHJcblx0XHRcdGRhbWFnZTogdGVtcGxhdGUuZXF1aXBwZWREYW1hZ2UsXHJcblx0XHRcdGRlZmVuY2U6IHRlbXBsYXRlLmVxdWlwcGVkRGVmZW5jZSxcclxuXHRcdFx0aGVhbHRoTWF4OiB0ZW1wbGF0ZS5lcXVpcHBlZEhlYWx0aE1heCxcclxuXHRcdFx0ZW5lcmd5TWF4OiB0ZW1wbGF0ZS5lcXVpcHBlZEVuZXJneU1heCxcclxuXHRcdFx0cmFuZ2U6IHRlbXBsYXRlLmVxdWlwcGVkUmFuZ2VcclxuXHRcdH07XHJcblx0XHRcclxuXHRcdGlmICh0aGlzLnN0YWNrYWJsZSkge1xyXG5cdFx0XHRpZiAoc3RhY2sgPCAxKSBzdGFjayA9IDE7XHJcblx0XHRcdHRoaXMuc3RhY2sgPSBzdGFjaztcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHR0aGlzLnN0YWNrID0gMDtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLmdhbWVJZCA9IHV0aWwuZmlyc3RFbXB0eUluZGV4KGdhbWUuaXRlbXMpO1xyXG5cdFx0Z2FtZS5pdGVtc1t0aGlzLmdhbWVJZF0gPSB0aGlzO1xyXG5cdH1cclxuXHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5nZXRQYWNrKCk7XHJcblx0fVxyXG5cclxuXHRnZXRQYWNrKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0Z2FtZUlkOiB0aGlzLmdhbWVJZCxcclxuXHRcdFx0cGxheWVySWQ6IHRoaXMucGxheWVySWQsXHJcblx0XHRcdGJvdElkOiB0aGlzLmJvdElkLFxyXG5cdFx0XHRzbG90OiB0aGlzLnNsb3QsXHJcblx0XHRcdG1hcElkOiB0aGlzLm1hcElkLFxyXG5cdFx0XHR4OiB0aGlzLngsXHJcblx0XHRcdHk6IHRoaXMueSxcclxuXHRcdFx0ejogdGhpcy56LFxyXG5cdFx0XHRuYW1lOiB0aGlzLm5hbWUsXHJcblx0XHRcdGRlc2NyaXB0aW9uOiB0aGlzLmRlc2NyaXB0aW9uLFxyXG5cdFx0XHRzcHJpdGU6IHRoaXMuc3ByaXRlLFxyXG5cdFx0XHR0eXBlOiB0aGlzLnR5cGUsXHJcblx0XHRcdHJldXNhYmxlOiB0aGlzLnJldXNhYmxlLFxyXG5cdFx0XHRwYXNzaXZlOiB0aGlzLnBhc3NpdmUsXHJcblx0XHRcdGVxdWlwcGVkOiB0aGlzLmVxdWlwcGVkLFxyXG5cdFx0XHRzdGFjazogdGhpcy5zdGFjayxcclxuXHRcdFx0aXNWaXNpYmxlOiB0aGlzLmlzVmlzaWJsZVxyXG5cdFx0fTtcclxuXHR9XHJcblx0XHJcblx0cmVtb3ZlKCkge1xyXG5cdFx0ZGVsZXRlIGdhbWUuaXRlbXNbdGhpcy5nYW1lSWRdO1xyXG5cdH1cclxuXHJcblx0cmVtb3ZlT25lKCkge1xyXG5cdFx0aWYgKHRoaXMuc3RhY2sgPiAxKSB7XHJcblx0XHRcdHRoaXMuc3RhY2stLTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHR0aGlzLnJlbW92ZSgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0bW92ZVRvSW52ZW50b3J5KHBsYXllcklkLCBib3RJZCwgc2xvdCkge1xyXG5cdFx0dGhpcy5wbGF5ZXJJZCA9IHBsYXllcklkO1xyXG5cdFx0dGhpcy5ib3RJZCA9IGJvdElkO1xyXG5cdFx0dGhpcy5zbG90ID0gc2xvdDtcclxuXHRcdHRoaXMubWFwSWQgPSBudWxsO1xyXG5cdFx0dGhpcy54ID0gbnVsbDtcclxuXHRcdHRoaXMueSA9IG51bGw7XHJcblx0XHR0aGlzLnogPSBudWxsO1xyXG5cdH1cclxuXHJcblx0bW92ZVRvTWFwKG1hcElkLCB4LCB5KSB7XHJcblx0XHR0aGlzLm1hcElkID0gbWFwSWQ7XHJcblx0XHR0aGlzLnggPSB4O1xyXG5cdFx0dGhpcy55ID0geTtcclxuXHRcdHRoaXMueiA9IHRoaXMuZ2V0WlBvc2l0aW9uKG1hcElkLCB4LCB5KTtcclxuXHRcdHRoaXMucGxheWVySWQgPSBudWxsO1xyXG5cdFx0dGhpcy5ib3RJZCA9IG51bGw7XHJcblx0XHR0aGlzLnNsb3QgPSBudWxsO1xyXG5cdH1cclxuXHRcclxuXHRnZXRaUG9zaXRpb24obWFwSWQsIHgsIHkpIHtcclxuXHRcdHJldHVybiAtMTA7XHJcblx0fVxyXG5cclxuXHRpc0VxdWlwbWVudCgpIHtcclxuXHRcdGlmICh0aGlzLmVxdWlwcGVkU2xvdCA+PSAwKSB7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuIiwiaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9jb25maWcuanMnO1xyXG5pbXBvcnQgdXRpbCBmcm9tICcuLi91dGlsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hcCB7XHJcblx0Y29uc3RydWN0b3IobWFwSWQsIGRhdGEgPSB7fSkge1xyXG5cdFx0dGhpcy5tYXBJZCA9IG1hcElkO1xyXG5cclxuXHRcdGlmIChkYXRhLm5hbWUgPT0gbnVsbCkgZGF0YS5uYW1lID0gXCJCbGFuayBNYXBcIjtcclxuXHRcdGlmIChkYXRhLmRyb3BDaGFuY2UgPT0gbnVsbCkgZGF0YS5kcm9wQ2hhbmNlID0gMTAwO1xyXG5cdFx0aWYgKGRhdGEuZHJvcEFtb3VudEVRID09IG51bGwpIGRhdGEuZHJvcEFtb3VudEVRID0gMTtcclxuXHRcdGlmICghZGF0YS50aWxlcykgZGF0YS50aWxlcyA9IHV0aWwuY3JlYXRlM2RBcnJheShjb25maWcuTUFQX0NPTFVNTlMsIGNvbmZpZy5NQVBfUk9XUywgY29uZmlnLk1BUF9MQVlFUlMsIDApO1xyXG5cdFx0aWYgKCFkYXRhLmlzV2FsbCkgZGF0YS5pc1dhbGwgPSB1dGlsLmNyZWF0ZTJkQXJyYXkoY29uZmlnLk1BUF9DT0xVTU5TLCBjb25maWcuTUFQX1JPV1MsIGZhbHNlKTtcclxuXHRcdGlmICghZGF0YS5pc0hvc3RpbGUpIGRhdGEuaXNIb3N0aWxlID0gdXRpbC5jcmVhdGUyZEFycmF5KGNvbmZpZy5NQVBfQ09MVU1OUywgY29uZmlnLk1BUF9ST1dTLCBmYWxzZSk7XHJcblx0XHRpZiAoIWRhdGEuZGFtYWdlKSBkYXRhLmRhbWFnZSA9IHV0aWwuY3JlYXRlMmRBcnJheShjb25maWcuTUFQX0NPTFVNTlMsIGNvbmZpZy5NQVBfUk9XUywgbnVsbCk7XHJcblx0XHRpZiAoIWRhdGEud2FycE1hcCkgZGF0YS53YXJwTWFwID0gdXRpbC5jcmVhdGUyZEFycmF5KGNvbmZpZy5NQVBfQ09MVU1OUywgY29uZmlnLk1BUF9ST1dTLCBudWxsKTtcclxuXHRcdGlmICghZGF0YS53YXJwWCkgZGF0YS53YXJwWCA9IHV0aWwuY3JlYXRlMmRBcnJheShjb25maWcuTUFQX0NPTFVNTlMsIGNvbmZpZy5NQVBfUk9XUywgbnVsbCk7XHJcblx0XHRpZiAoIWRhdGEud2FycFkpIGRhdGEud2FycFkgPSB1dGlsLmNyZWF0ZTJkQXJyYXkoY29uZmlnLk1BUF9DT0xVTU5TLCBjb25maWcuTUFQX1JPV1MsIG51bGwpO1xyXG5cclxuXHRcdHRoaXMubmFtZSA9IGRhdGEubmFtZTtcclxuXHRcdHRoaXMuZHJvcENoYW5jZSA9IHV0aWwuY2xhbXAoZGF0YS5kcm9wQ2hhbmNlLCAwLCAxMDApO1xyXG5cdFx0dGhpcy5kcm9wQW1vdW50RVEgPSB1dGlsLmNsYW1wKGRhdGEuZHJvcEFtb3VudEVRLCAwLCBjb25maWcuRVFVSVBNRU5UX1NJWkUpO1xyXG5cdFx0Ly90aGlzLmRyb3BDaGFuY2UgPSAwID0gMCUgY2hhbmNlIHRvIGRyb3AgaXRlbXMgaW4gaW52ZW50b3J5IChkcm9wIG5vdGhpbmcpLCAxMDAgPSAxMDAlIGNoYW5jZSB0byBkcm9wIChkcm9wIGV2ZXJ5dGhpbmcpXHJcblx0XHQvL3RoaXMuZHJvcEFtb3VudEVRID0gbnVtYmVyIG9mIGVxdWlwcGVkIGl0ZW1zIHRoZSBwbGF5ZXIgd2lsbCBkcm9wIG9uIGRlYXRoLiBkcm9wRVEgPSBFUVVJUE1FTlRfU0laRSA9IGRyb3AgYWxsIGVxdWlwbWVudFxyXG5cdFx0dGhpcy50aWxlcyA9IGRhdGEudGlsZXM7XHJcblx0XHR0aGlzLmlzV2FsbCA9IGRhdGEuaXNXYWxsO1xyXG5cdFx0dGhpcy5pc0hvc3RpbGUgPSBkYXRhLmlzSG9zdGlsZTtcclxuXHRcdHRoaXMuZGFtYWdlID0gZGF0YS5kYW1hZ2U7XHJcblx0XHR0aGlzLndhcnBNYXAgPSBkYXRhLndhcnBNYXA7XHJcblx0XHR0aGlzLndhcnBYID0gZGF0YS53YXJwWDtcclxuXHRcdHRoaXMud2FycFkgPSBkYXRhLndhcnBZO1xyXG5cdH1cclxuXHRcclxuXHR1cGxvYWQoZGF0YSkge1xyXG5cdFx0aWYgKGRhdGEubmFtZSAhPSBudWxsKSB0aGlzLm5hbWUgPSBkYXRhLm5hbWU7XHJcblx0XHRpZiAoZGF0YS5kcm9wQ2hhbmNlICE9IG51bGwpIHRoaXMuZHJvcENoYW5jZSA9IGRhdGEuZHJvcENoYW5jZTtcclxuXHRcdGlmIChkYXRhLmRyb3BBbW91bnRFUSAhPSBudWxsKSB0aGlzLmRyb3BBbW91bnRFUSA9IGRhdGEuZHJvcEFtb3VudEVRO1xyXG5cdFx0aWYgKGRhdGEudGlsZXMpIHRoaXMudGlsZXMgPSBkYXRhLnRpbGVzO1xyXG5cdFx0aWYgKGRhdGEuaXNXYWxsKSB0aGlzLmlzV2FsbCA9IGRhdGEuaXNXYWxsO1xyXG5cdFx0aWYgKGRhdGEuaXNIb3N0aWxlKSB0aGlzLmlzSG9zdGlsZSA9IGRhdGEuaXNIb3N0aWxlO1xyXG5cdFx0aWYgKGRhdGEuZGFtYWdlKSB0aGlzLmRhbWFnZSA9IGRhdGEuZGFtYWdlO1xyXG5cdFx0aWYgKGRhdGEud2FycE1hcCkgdGhpcy53YXJwTWFwID0gZGF0YS53YXJwTWFwO1xyXG5cdFx0aWYgKGRhdGEud2FycFgpIHRoaXMud2FycFggPSBkYXRhLndhcnBYO1xyXG5cdFx0aWYgKGRhdGEud2FycFkpIHRoaXMud2FycFkgPSBkYXRhLndhcnBZO1xyXG5cdH1cclxuXHJcblx0Z2V0UGFjaygpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdG1hcElkOiB0aGlzLm1hcElkLFxyXG5cdFx0XHRuYW1lOiB0aGlzLm5hbWUsXHJcblx0XHRcdGRyb3BDaGFuY2U6IHRoaXMuZHJvcENoYW5jZSxcclxuXHRcdFx0ZHJvcEFtb3VudEVROiB0aGlzLmRyb3BBbW91bnRFUSxcclxuXHRcdFx0dGlsZXM6IHRoaXMudGlsZXMsXHJcblx0XHRcdGlzV2FsbDogdGhpcy5pc1dhbGwsXHJcblx0XHRcdGlzSG9zdGlsZTogdGhpcy5pc0hvc3RpbGUsXHJcblx0XHRcdGRhbWFnZTogdGhpcy5kYW1hZ2UsXHJcblx0XHRcdHdhcnBNYXA6IHRoaXMud2FycE1hcCxcclxuXHRcdFx0d2FycFg6IHRoaXMud2FycFgsXHJcblx0XHRcdHdhcnBZOiB0aGlzLndhcnBZXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0Z2V0VXBkYXRlUGFjaygpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdG1hcElkOiB0aGlzLm1hcElkLFxyXG5cdFx0XHRuYW1lOiB0aGlzLm5hbWUsXHJcblx0XHRcdHRpbGVzOiB0aGlzLnRpbGVzXHJcblx0XHR9O1xyXG5cdH1cclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBNZXNzYWdlIHtcclxuXHRjb25zdHJ1Y3RvcihzZW5kZXJJZCwgbWVzc2FnZSwgdHlwZSwgbWFwSWQsIGlkLCBjb2xvdXIpIHtcclxuXHRcdHRoaXMuc2VuZGVySWQgPSBzZW5kZXJJZDsgLy8gbnVsbCA9IHNlcnZlclxyXG5cdFx0dGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcclxuXHRcdHRoaXMudHlwZSA9IHR5cGU7XHJcblx0XHR0aGlzLm1hcElkID0gbWFwSWQ7XHJcblx0XHR0aGlzLmlkID0gaWQ7XHJcblx0XHR0aGlzLmNvbG91ciA9IGNvbG91cjtcclxuXHR9XHJcbn0iLCJpbXBvcnQgZ2FtZSBmcm9tICcuLi9nYW1lLmpzJztcclxuaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9jb25maWcuanMnO1xyXG5pbXBvcnQgdXRpbCBmcm9tICcuLi91dGlsLmpzJztcclxuaW1wb3J0IEFjdG9yIGZyb20gJy4vYWN0b3IuanMnO1xyXG5pbXBvcnQgaXRlbVRlbXBsYXRlIGZyb20gJy4uL21vZGVscy9pdGVtVGVtcGxhdGUuanMnO1xyXG5cclxuLy8gQSBQbGF5ZXIgaXMgYW4gaW1tb3J0YWwgQWN0b3Igd2hpY2ggdGFrZXMgaW5wdXQgZnJvbSBhIGNsaWVudFxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyIGV4dGVuZHMgQWN0b3Ige1xyXG5cdGNvbnN0cnVjdG9yKHNvY2tldElkLCBkYXRhKSB7XHJcblx0XHRpZiAoZGF0YS5zcHJpdGUgPT0gbnVsbCkgZGF0YS5zcHJpdGUgPSBkYXRhLnRlbXBsYXRlLnNwcml0ZTtcclxuXHJcblx0XHRzdXBlcihkYXRhLm1hcElkLCBkYXRhLngsIGRhdGEueSwgZGF0YS5kaXJlY3Rpb24sIGRhdGEubmFtZSwgZGF0YS5zcHJpdGUpO1xyXG5cdFx0dGhpcy5wbGF5ZXJJZCA9IGRhdGEuX2lkO1xyXG5cdFx0dGhpcy5zb2NrZXRJZCA9IHNvY2tldElkO1xyXG5cdFx0dGhpcy5hY2NvdW50SWQgPSBkYXRhLmFjY291bnQ7XHJcblx0XHR0aGlzLmFkbWluQWNjZXNzID0gZGF0YS5hZG1pbkFjY2VzcztcclxuXHJcblx0XHR0aGlzLmxldmVsID0gZGF0YS5sZXZlbDtcclxuXHRcdHRoaXMuZXhwZXJpZW5jZSA9IGRhdGEuZXhwZXJpZW5jZTtcclxuXHRcdHRoaXMudGVtcGxhdGVJZCA9IGRhdGEudGVtcGxhdGUuX2lkO1xyXG5cdFx0dGhpcy50ZW1wbGF0ZSA9IGRhdGEudGVtcGxhdGUubmFtZTtcclxuXHRcdHRoaXMuY2FsY0Jhc2VTdGF0cyhkYXRhLnRlbXBsYXRlKTtcclxuXHRcdHRoaXMucmVzdG9yZSgpO1xyXG5cclxuXHRcdHRoaXMuaXNEZWFkID0gZmFsc2U7XHJcblx0XHR0aGlzLmRlYXRocyA9IDA7XHJcblx0XHR0aGlzLnJlc3Bhd25UaW1lciA9IDA7XHJcblx0XHR0aGlzLnJlc3Bhd25TcGVlZCA9IDEwO1xyXG5cdFx0dGhpcy5yZXNwYXduTWFwID0gZGF0YS5tYXBJZDtcclxuXHRcdHRoaXMucmVzcGF3blggPSBkYXRhLng7XHJcblx0XHR0aGlzLnJlc3Bhd25ZID0gZGF0YS55O1xyXG5cclxuXHRcdHRoaXMuaW5wdXQgPSB7XHJcblx0XHRcdGRpcmVjdGlvbjogbnVsbCxcclxuXHRcdFx0cnVuOiBmYWxzZSxcclxuXHRcdFx0cGlja3VwOiBmYWxzZSxcclxuXHRcdFx0YXR0YWNrOiBmYWxzZVxyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLmdhbWVJZCA9IHV0aWwuZmlyc3RFbXB0eUluZGV4KGdhbWUucGxheWVycyk7XHJcblx0XHRnYW1lLnBsYXllcnNbdGhpcy5nYW1lSWRdID0gdGhpcztcclxuXHR9XHJcblxyXG5cdHVwZGF0ZShkZWx0YSkge1xyXG5cdFx0c3VwZXIudXBkYXRlKGRlbHRhKTtcdFx0Ly8gRGVmYXVsdCBBY3RvciBVcGRhdGVcclxuXHRcdGlmICh0aGlzLmlzRGVhZCkge1xyXG5cdFx0XHQvLyBSZXNwYXduaW5nXHJcblx0XHRcdHRoaXMucmVzcGF3blRpbWVyICs9IGRlbHRhO1xyXG5cdFx0XHRpZiAodGhpcy5yZXNwYXduVGltZXIgPj0gdGhpcy5yZXNwYXduU3BlZWQpIHRoaXMucmVzcGF3bigpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdC8vIENoZWNrIGZvciBBdHRhY2sgSW5wdXRcclxuXHRcdFx0aWYgKHRoaXMuaW5wdXQuYXR0YWNrICYmIHRoaXMuYXR0YWNrVGltZXIgPT09IDApIHRoaXMuYXR0YWNrKCk7XHJcblx0XHRcdFxyXG5cdFx0XHQvLyBDaGVjayBmb3IgTW92ZW1lbnQgSW5wdXRcclxuXHRcdFx0aWYgKCF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuaW5wdXQuZGlyZWN0aW9uKSB7XHJcblx0XHRcdFx0XHQvLyBDaGVjayBmb3IgUnVuIElucHV0XHJcblx0XHRcdFx0XHRpZiAodGhpcy5pbnB1dC5ydW4pIHtcclxuXHRcdFx0XHRcdFx0KHRoaXMuZW5lcmd5ID4gMCkgPyB0aGlzLmlzUnVubmluZyA9IHRydWUgOiB0aGlzLmlzUnVubmluZyA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuaXNSdW5uaW5nID0gZmFsc2U7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUodGhpcy5pbnB1dC5kaXJlY3Rpb24pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gdGhpcy5nZXRHYW1lUGFjaygpO1xyXG5cdH1cclxuXHRcclxuXHRnZXRHYW1lUGFjaygpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGdhbWVJZDogdGhpcy5nYW1lSWQsXHJcblx0XHRcdG5hbWU6IHRoaXMubmFtZSxcclxuXHRcdFx0ZGVzY3JpcHRpb246IHRoaXMuZGVzY3JpcHRpb24sXHJcblx0XHRcdHNwcml0ZTogdGhpcy5zcHJpdGUsXHJcblx0XHRcdGRpcmVjdGlvbjogdGhpcy5kaXJlY3Rpb24sXHJcblx0XHRcdG1hcElkOiB0aGlzLm1hcElkLFxyXG5cdFx0XHR4OiB0aGlzLnN0YXJ0WCxcclxuXHRcdFx0eTogdGhpcy5zdGFydFksXHJcblx0XHRcdHo6IHRoaXMueixcclxuXHRcdFx0ZGVzdGluYXRpb25YOiB0aGlzLmRlc3RpbmF0aW9uWCxcclxuXHRcdFx0ZGVzdGluYXRpb25ZOiB0aGlzLmRlc3RpbmF0aW9uWSxcclxuXHRcdFx0bGVycDogdGhpcy5sZXJwLFxyXG5cdFx0XHRpc1J1bm5pbmc6IHRoaXMuaXNSdW5uaW5nLFxyXG5cdFx0XHRpc0F0dGFja2luZzogdGhpcy5pc0F0dGFja2luZyxcclxuXHRcdFx0aXNEZWFkOiB0aGlzLmlzRGVhZCxcclxuXHRcdFx0aXNWaXNpYmxlOiB0aGlzLmlzVmlzaWJsZVxyXG5cdFx0fTtcclxuXHR9XHJcblx0XHJcblx0Z2V0VUlQYWNrKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0bGV2ZWw6IHRoaXMubGV2ZWwsXHJcblx0XHRcdGV4cGVyaWVuY2U6IHRoaXMuZXhwZXJpZW5jZSxcclxuXHRcdFx0aGVhbHRoOiB0aGlzLmhlYWx0aCxcclxuXHRcdFx0aGVhbHRoTWF4OiB0aGlzLmhlYWx0aE1heCxcclxuXHRcdFx0ZW5lcmd5OiB0aGlzLmVuZXJneSxcclxuXHRcdFx0ZW5lcmd5TWF4OiB0aGlzLmVuZXJneU1heCxcclxuXHRcdFx0bW92ZVNwZWVkOiB0aGlzLm1vdmVTcGVlZCxcclxuXHRcdFx0YXR0YWNrU3BlZWQ6IHRoaXMuYXR0YWNrU3BlZWQsXHJcblx0XHRcdGF0dGFja1RpbWVyOiB0aGlzLmF0dGFja1RpbWVyLFxyXG5cdFx0XHRpbnZlbnRvcnk6IHRoaXMuZ2V0SW52ZW50b3J5UGFjaygpXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0Z2V0REJQYWNrKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0bmFtZTogdGhpcy5uYW1lLFxyXG5cdFx0XHRhY2NvdW50OiB0aGlzLmFjY291bnRJZCxcclxuXHRcdFx0dGVtcGxhdGU6IHRoaXMudGVtcGxhdGVJZCxcclxuXHRcdFx0bGV2ZWw6IHRoaXMubGV2ZWwsXHJcblx0XHRcdGV4cGVyaWVuY2U6IHRoaXMuZXhwZXJpZW5jZSxcclxuXHRcdFx0bWFwSWQ6IHRoaXMubWFwSWQsXHJcblx0XHRcdHg6IHRoaXMueCxcclxuXHRcdFx0eTogdGhpcy55LFxyXG5cdFx0XHRkaXJlY3Rpb246IHRoaXMuZGlyZWN0aW9uLFxyXG5cdFx0XHRhZG1pbkFjY2VzczogdGhpcy5hZG1pbkFjY2VzcyxcclxuXHRcdFx0c3ByaXRlOiB0aGlzLnNwcml0ZVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0aW5wdXREYXRhKGRhdGEpIHtcclxuXHRcdGlmICh0aGlzLmlzRGVhZCkge1xyXG5cdFx0XHRnYW1lLnNlbmRHYW1lSW5mb1BsYXllcih0aGlzLmdhbWVJZCwgXCJZb3UgYXJlIGRlYWQuXCIpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGdhbWUuZ29kQ29tbWFuZHNbZGF0YS5pbnB1dF0pIHtcclxuXHRcdFx0aWYgKHRoaXMuYWRtaW5BY2Nlc3MgPiAwKSB7XHJcblx0XHRcdFx0Z2FtZS5nb2RDb21tYW5kc1tkYXRhLmlucHV0XShkYXRhLCB0aGlzKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRnYW1lLnNlbmRHYW1lSW5mb1BsYXllcih0aGlzLmdhbWVJZCwgXCJZb3UgZG9uJ3QgaGF2ZSBhY2Nlc3MgdG8gdGhhdCBjb21tYW5kLlwiKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGlmIChnYW1lLmNvbW1hbmRzW2RhdGEuaW5wdXRdKSB7XHJcblx0XHRcdFx0Z2FtZS5jb21tYW5kc1tkYXRhLmlucHV0XShkYXRhLCB0aGlzKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRnYW1lLnNlbmRHYW1lSW5mb1BsYXllcih0aGlzLmdhbWVJZCwgXCJJbnZhbGlkIGNvbW1hbmQuXCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwaWNrVXAoKSB7XHJcblx0XHRpZiAoc3VwZXIucGlja1VwKCkgPT09IGZhbHNlKSBnYW1lLnNlbmRHYW1lSW5mb1BsYXllcih0aGlzLmdhbWVJZCwgXCJZb3VyIGludmVudG9yeSBpcyBmdWxsLlwiKTtcclxuXHR9XHJcblx0XHJcblx0Z2V0SW52ZW50b3J5KCkge1xyXG5cdFx0Y29uc3QgaW52ZW50b3J5ID0gZ2FtZS5pdGVtcy5maWx0ZXIoaXRlbSA9PiB7XHJcblx0XHRcdHJldHVybiBpdGVtLnBsYXllcklkID09PSB0aGlzLnBsYXllcklkO1xyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gaW52ZW50b3J5O1xyXG5cdH1cclxuXHJcblx0c2V0RGVhZCgpIHtcclxuXHRcdHN1cGVyLnNldERlYWQoKTtcclxuXHRcdHRoaXMuaXNEZWFkID0gdHJ1ZTtcclxuXHRcdHRoaXMuaGVhbHRoID0gMDtcclxuXHRcdHRoaXMuZW5lcmd5ID0gMDtcclxuXHRcdHRoaXMuZGVhdGhzKys7XHJcblx0fVxyXG5cclxuXHRyZXNwYXduKCkge1xyXG5cdFx0dGhpcy5tYXBJZCA9IHRoaXMucmVzcGF3bk1hcDtcclxuXHRcdHRoaXMueCA9IHRoaXMucmVzcGF3blg7XHJcblx0XHR0aGlzLnkgPSB0aGlzLnJlc3Bhd25ZO1xyXG5cdFx0dGhpcy5zdGFydFggPSB0aGlzLnJlc3Bhd25YO1xyXG5cdFx0dGhpcy5zdGFydFkgPSB0aGlzLnJlc3Bhd25ZO1xyXG5cdFx0dGhpcy5kZXN0aW5hdGlvblggPSB0aGlzLnJlc3Bhd25YO1xyXG5cdFx0dGhpcy5kZXN0aW5hdGlvblkgPSB0aGlzLnJlc3Bhd25ZO1xyXG5cdFx0XHJcblx0XHR0aGlzLmNhbGNCb251c1N0YXRzKCk7XHJcblx0XHR0aGlzLnJlc3RvcmUoKTtcclxuXHRcdFxyXG5cdFx0dGhpcy5pc1dhbGtpbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMuaXNSdW5uaW5nID0gZmFsc2U7XHJcblx0XHR0aGlzLmlzQXR0YWNraW5nID0gZmFsc2U7XHJcblx0XHR0aGlzLmlzRGVhZCA9IGZhbHNlO1xyXG5cdFx0dGhpcy5yZXNwYXduVGltZXIgPSAwO1xyXG5cdFx0Z2FtZS5zZW5kR2FtZUluZm9QbGF5ZXIodGhpcy5nYW1lSWQsIFwiVGhlIEFuZ2VsIG9mIE1lcmN5IHJlZnVzZXMgdG8gbGV0IHlvdSBkaWUuXCIpO1xyXG5cdH1cclxuXHJcblx0Z2FpbkV4cGVyaWVuY2UoZXhwZXJpZW5jZSkge1xyXG5cdFx0aWYgKHRoaXMuZXhwZXJpZW5jZSArIGV4cGVyaWVuY2UgPD0gMCkge1xyXG5cdFx0XHR0aGlzLmV4cGVyaWVuY2UgPSAwO1x0XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLmV4cGVyaWVuY2UgKz0gZXhwZXJpZW5jZTtcclxuXHRcdGlmICh0aGlzLmV4cGVyaWVuY2UgPj0gZ2FtZS5leHBlcmllbmNlVG9MZXZlbFt0aGlzLmxldmVsXSkge1xyXG5cdFx0XHR0aGlzLmxldmVsVXAoKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGxldmVsVXAoKSB7XHJcblx0XHRpZiAodGhpcy5sZXZlbCA8IGNvbmZpZy5NQVhfTEVWRUwpIHtcclxuXHRcdFx0Y29uc3Qgcm9sbG92ZXJFeHBlcmllbmNlID0gdGhpcy5leHBlcmllbmNlIC0gZ2FtZS5leHBlcmllbmNlVG9MZXZlbFt0aGlzLmxldmVsXTtcclxuXHRcdFx0dGhpcy5leHBlcmllbmNlID0gMDtcclxuXHRcdFx0dGhpcy5sZXZlbCsrO1xyXG5cdFx0XHR0aGlzLmNhbGNCYXNlU3RhdHMoKTtcclxuXHRcdFx0Z2FtZS5zZW5kR2FtZUluZm9QbGF5ZXIodGhpcy5nYW1lSWQsIGBMZXZlbCB1cCEgWW91IGFyZSBub3cgbGV2ZWwgJHt0aGlzLmxldmVsfSFgKTtcclxuXHRcdFx0dGhpcy5nYWluRXhwZXJpZW5jZShyb2xsb3ZlckV4cGVyaWVuY2UpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRjYWxjQmFzZVN0YXRzKHRlbXBsYXRlKSB7XHJcblx0XHRpZiAoIXRlbXBsYXRlKSB0ZW1wbGF0ZSA9IGdhbWUucGxheWVyVGVtcGxhdGVzW3RoaXMudGVtcGxhdGVJZF07XHJcblx0XHRzdXBlci5jYWxjQmFzZVN0YXRzKHRlbXBsYXRlKTtcclxuXHR9XHJcbn1cclxuIiwiaW1wb3J0IGdhbWUgZnJvbSAnLi4vZ2FtZS5qcyc7XHJcbmltcG9ydCB1dGlsIGZyb20gJy4uL3V0aWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGV4dCB7XHJcblx0Y29uc3RydWN0b3IobWFwSWQsIHgsIHksIG1lc3NhZ2UsIGNvbG91ciA9ICcjMDAwMDAwJywgZGlzcGxheVRpbWUgPSAyLCB2ZWxYID0gMCwgdmVsWSA9IDApIHtcclxuXHRcdHRoaXMubWFwSWQgPSBtYXBJZDtcclxuXHRcdHRoaXMueCA9IHg7XHJcblx0XHR0aGlzLnkgPSB5O1xyXG5cdFx0dGhpcy52ZWxYID0gdmVsWDtcclxuXHRcdHRoaXMudmVsWSA9IHZlbFk7XHJcblx0XHR0aGlzLmxlcnBYID0gMDtcclxuXHRcdHRoaXMubGVycFkgPSAwO1xyXG5cclxuXHRcdHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XHJcblx0XHR0aGlzLmNvbG91ciA9IGNvbG91cjtcclxuXHRcdHRoaXMuZGlzcGxheVRpbWUgPSBkaXNwbGF5VGltZTtcclxuXHRcdHRoaXMudGltZXIgPSAwO1xyXG5cclxuXHRcdHRoaXMuZ2FtZUlkID0gdXRpbC5maXJzdEVtcHR5SW5kZXgoZ2FtZS50ZXh0cyk7XHJcblx0XHRnYW1lLnRleHRzW3RoaXMuZ2FtZUlkXSA9IHRoaXM7XHJcblx0fVxyXG5cdFxyXG5cdHVwZGF0ZShkZWx0YSkge1xyXG5cdFx0dGhpcy50aW1lciArPSBkZWx0YTtcclxuXHRcdGlmICh0aGlzLmRpc3BsYXlUaW1lID4gMCAmJiB0aGlzLnRpbWVyID4gdGhpcy5kaXNwbGF5VGltZSkge1xyXG5cdFx0XHR0aGlzLnJlbW92ZSgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMubGVycFggKz0gZGVsdGEgKiB0aGlzLnZlbFg7XHJcblx0XHR0aGlzLmxlcnBZICs9IGRlbHRhICogdGhpcy52ZWxZO1xyXG5cclxuXHRcdGlmICh0aGlzLmxlcnBYIDwgLTEpIHtcclxuXHRcdFx0dGhpcy5sZXJwWCsrO1xyXG5cdFx0XHR0aGlzLngtLTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKHRoaXMubGVycFggPiAxKSB7XHJcblx0XHRcdHRoaXMubGVycFgtLTtcclxuXHRcdFx0dGhpcy54Kys7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMubGVycFkgPCAtMSkge1xyXG5cdFx0XHR0aGlzLmxlcnBZKys7XHJcblx0XHRcdHRoaXMueS0tO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAodGhpcy5sZXJwWSA+IDEpIHtcclxuXHRcdFx0dGhpcy5sZXJwWS0tO1xyXG5cdFx0XHR0aGlzLnkrKztcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIHRoaXMuZ2V0UGFjaygpO1xyXG5cdH1cclxuXHRcclxuXHRnZXRQYWNrKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0Z2FtZUlkOiB0aGlzLmdhbWVJZCxcclxuXHRcdFx0bWFwSWQ6IHRoaXMubWFwSWQsXHJcblx0XHRcdHg6IHRoaXMueCxcclxuXHRcdFx0eTogdGhpcy55LFxyXG5cdFx0XHRsZXJwWDogdGhpcy5sZXJwWCxcclxuXHRcdFx0bGVycFk6IHRoaXMubGVycFksXHJcblx0XHRcdG1lc3NhZ2U6IHRoaXMubWVzc2FnZSxcclxuXHRcdFx0Y29sb3VyOiB0aGlzLmNvbG91clxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdHJlbW92ZSgpIHtcclxuXHRcdGRlbGV0ZSBnYW1lLnRleHRzW3RoaXMuZ2FtZUlkXTtcclxuXHR9XHJcbn1cclxuIiwiY29uc3QgY29uZmlnID0ge307XHJcblxyXG5jb25maWcuUE9SVCA9IDIwMDA7XHJcbmNvbmZpZy5GUkFNRVJBVEUgPSAxMDAwIC8gNjA7XHJcbmNvbmZpZy5CQUNLVVBfVElNRSA9IDEyMDtcclxuXHJcbmNvbmZpZy5NQVBfTEFZRVJTID0gNjtcclxuY29uZmlnLk1BUF9DT0xVTU5TID0gMTI7XHJcbmNvbmZpZy5NQVBfUk9XUyA9IDEyO1xyXG5cclxuY29uZmlnLk1BWF9NQVBTID0gMTA7XHJcbmNvbmZpZy5NQVhfVVNFUlMgPSAxMDA7XHJcbmNvbmZpZy5NQVhfU1BSSVRFUyA9IDEzO1xyXG5jb25maWcuTUFYX0VGRkVDVFMgPSA3MTtcclxuY29uZmlnLk1BWF9MRVZFTCA9IDMwO1xyXG5cclxuY29uZmlnLk1BWF9IRUFMVEhfQkFTRSA9IDIwMDtcclxuY29uZmlnLk1BWF9IRUFMVEhfQk9OVVMgPSA1NTtcclxuY29uZmlnLk1BWF9FTkVSR1lfQkFTRSA9IDIwMDtcclxuY29uZmlnLk1BWF9FTkVSR1lfQk9OVVMgPSA1NTtcclxuXHJcbmNvbmZpZy5JTlZFTlRPUllfU0laRSA9IDIwO1xyXG5jb25maWcuRVFVSVBNRU5UX1NJWkUgPSA1O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY29uZmlnO1xyXG4iLCJpbXBvcnQgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xyXG5pbXBvcnQgYmNyeXB0IGZyb20gJ2JjcnlwdCc7XHJcbmltcG9ydCBmcyBmcm9tICdmcyc7XHJcblxyXG5pbXBvcnQgdXRpbCBmcm9tIFwiLi91dGlsLmpzXCI7XHJcbmltcG9ydCBBY2NvdW50IGZyb20gJy4vbW9kZWxzL2FjY291bnQuanMnO1xyXG5pbXBvcnQgUGxheWVyIGZyb20gJy4vbW9kZWxzL3BsYXllci5qcyc7XHJcbmltcG9ydCBQbGF5ZXJUZW1wbGF0ZSBmcm9tICcuL21vZGVscy9wbGF5ZXJUZW1wbGF0ZS5qcyc7XHJcbmltcG9ydCBCb3RUZW1wbGF0ZSBmcm9tICcuL21vZGVscy9ib3RUZW1wbGF0ZS5qcyc7XHJcbmltcG9ydCBJdGVtVHlwZSBmcm9tICcuL21vZGVscy9pdGVtVHlwZS5qcyc7XHJcbmltcG9ydCBJdGVtVGVtcGxhdGUgZnJvbSAnLi9tb2RlbHMvaXRlbVRlbXBsYXRlLmpzJztcclxuaW1wb3J0IE1hcCBmcm9tICcuL21vZGVscy9tYXAuanMnO1xyXG5cclxuY29uc3QgZnNwID0gZnMucHJvbWlzZXM7XHJcbm1vbmdvb3NlLlByb21pc2UgPSBQcm9taXNlO1xyXG5tb25nb29zZS5jb25uZWN0KCdtb25nb2RiOi8vbG9jYWxob3N0L29keXNzZXknLCB7dXNlTmV3VXJsUGFyc2VyOiB0cnVlfSk7XHJcblxyXG5jbGFzcyBEYXRhYmFzZSB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHR0aGlzLnNlcnZlckxvZyA9IFtdO1xyXG5cdH1cclxuXHJcblx0YXN5bmMgYmFja3VwKGRhdGEgPSB7fSkge1xyXG5cdFx0Ly9UT0RPIHNhdmUgZXZlcnl0aGluZ1xyXG5cdFx0Ly8gY29uc3QgbWFwcyA9IHNhdmUtYWxsLW1hcHNcclxuXHRcdGxldCBwbGF5ZXJzID0gdGhpcy5zYXZlT25saW5lUGxheWVycyhkYXRhLnBsYXllcnMpO1xyXG5cdFx0Ly8gY29uc3QgYm90cyA9IHNhdmUtYWxsLWJvdHNcclxuXHRcdC8vIGNvbnN0IGl0ZW1zID0gc2F2ZS1hbGwtaXRlbXNcclxuXHRcdGxldCBsb2dTYXZlZCA9IHRoaXMuc2F2ZUxvZygpO1xyXG5cdFx0UHJvbWlzZS5hbGwoW3BsYXllcnMsIGxvZ1NhdmVkXSlcclxuXHRcdC50aGVuKCgpID0+IHRoaXMubG9nKFwiR2FtZSBzYXZlZCB0byBkaXNrLlwiKSk7XHJcblx0fVxyXG5cdFxyXG5cdGxvZyhtZXNzYWdlKSB7XHJcblx0XHRjb25zdCBkYXRlID0gbmV3IERhdGUoKTtcclxuXHRcdGNvbnNvbGUubG9nKHV0aWwudGltZXN0YW1wKGRhdGUpICsgXCIgLSBcIiArIG1lc3NhZ2UpO1xyXG5cdFx0dGhpcy5zZXJ2ZXJMb2cucHVzaCh7XHJcblx0XHRcdG1lc3NhZ2UsXHJcblx0XHRcdGRhdGVcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRhc3luYyBzYXZlTG9nKCkge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0Y29uc3Qgc2F2ZWRMb2cgPSBhd2FpdCBmc3AucmVhZEZpbGUoJy4vc2VydmVyL2xvZy5qc29uJyk7XHJcblx0XHRcdGNvbnN0IG5ld0xvZyA9IEpTT04ucGFyc2Uoc2F2ZWRMb2cpLmNvbmNhdCh0aGlzLnNlcnZlckxvZyk7XHJcblx0XHRcdHRoaXMuc2VydmVyTG9nID0gW107XHJcblx0XHRcdGF3YWl0IGZzcC53cml0ZUZpbGUoJy4vc2VydmVyL2xvZy5qc29uJywgSlNPTi5zdHJpbmdpZnkobmV3TG9nKSk7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0Y2F0Y2goZXJyKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHR9XHJcblx0YXN5bmMgY2xlYXJMb2coKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHR0aGlzLnNlcnZlckxvZyA9IFtdO1xyXG5cdFx0XHRhd2FpdCBmc3Aud3JpdGVGaWxlKCcuL3NlcnZlci9sb2cuanNvbicsIFwiW11cIik7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0Y2F0Y2ggKGVycikge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRhc3luYyBoYXNoUGFzc3dvcmQocGFzc3dvcmQpIHtcclxuXHRcdHJldHVybiBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblx0XHRcdGJjcnlwdC5oYXNoKHBhc3N3b3JkLCAxMCwgKGVyciwgaGFzaCkgPT4ge1xyXG5cdFx0XHRcdGlmIChlcnIpIHJlamVjdChlcnIpO1xyXG5cdFx0XHRcdGVsc2UgcmVzb2x2ZShoYXNoKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0YXN5bmMgY29tcGFyZVBhc3N3b3JkKHBhc3N3b3JkLCBoYXNoZWRQYXNzd29yZCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0YmNyeXB0LmNvbXBhcmUocGFzc3dvcmQsIGhhc2hlZFBhc3N3b3JkLCAoZXJyLCBtYXRjaCkgPT4ge1xyXG5cdFx0XHRcdGlmIChlcnIpIHJlamVjdChlcnIpO1xyXG5cdFx0XHRcdGVsc2UgcmVzb2x2ZShtYXRjaCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdGFzeW5jIGF1dGhBY2NvdW50KHVzZXJuYW1lLCBwYXNzd29yZCkge1xyXG5cdFx0Y29uc3QgYWNjb3VudCA9IGF3YWl0IEFjY291bnQuZmluZE9uZSh7dXNlcm5hbWU6IHVzZXJuYW1lfSkuZXhlYygpO1xyXG5cdFx0aWYgKCFhY2NvdW50KSByZXR1cm4gZmFsc2U7XHJcblx0XHRcclxuXHRcdHJldHVybiB0aGlzLmNvbXBhcmVQYXNzd29yZChwYXNzd29yZCwgYWNjb3VudC5wYXNzd29yZCk7XHJcblx0fVxyXG5cclxuXHRhc3luYyBhZGRBY2NvdW50KHVzZXJuYW1lLCBwYXNzd29yZCwgZW1haWwpIHtcclxuXHRcdGxldCBhY2NvdW50ID0gYXdhaXQgdGhpcy5nZXRBY2NvdW50SWQodXNlcm5hbWUpO1xyXG5cdFx0aWYgKGFjY291bnQpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coYEFjY291bnQgYWxyZWFkeSBleGlzdHMgd2l0aCB1c2VybmFtZSAke3VzZXJuYW1lfS5gKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IGhhc2hlZFBhc3N3b3JkID0gYXdhaXQgdGhpcy5oYXNoUGFzc3dvcmQocGFzc3dvcmQpO1xyXG5cdFx0YWNjb3VudCA9IG5ldyBBY2NvdW50KHtcclxuXHRcdFx0X2lkOiBuZXcgbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQsXHJcblx0XHRcdHVzZXJuYW1lLFxyXG5cdFx0XHRwYXNzd29yZDogaGFzaGVkUGFzc3dvcmRcclxuXHRcdH0pO1xyXG5cdFx0Ly9pZiAoZW1haWwpIGFjY291bnQuZW1haWwgPSBlbWFpbDtcclxuXHJcblx0XHRyZXR1cm4gYXdhaXQgYWNjb3VudC5zYXZlKClcclxuXHRcdC50aGVuKHJlc3VsdCA9PiB7XHJcblx0XHRcdHRoaXMubG9nKGBBY2NvdW50IGFkZGVkOiAke3VzZXJuYW1lfS5gKVxyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH0pXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBnZXRBY2NvdW50KGFjY291bnRJZCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IEFjY291bnQuZmluZEJ5SWQoYWNjb3VudElkKVxyXG5cdFx0LnNlbGVjdCgnX2lkIHVzZXJuYW1lIHBhc3N3b3JkIGVtYWlsIHZlcmlmaWVkJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKGFjY291bnQgPT4gYWNjb3VudClcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIGdldEFjY291bnRCeVVzZXJuYW1lKHVzZXJuYW1lKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgQWNjb3VudC5maW5kT25lKHt1c2VybmFtZTogdXNlcm5hbWV9KVxyXG5cdFx0LnNlbGVjdCgnX2lkIHVzZXJuYW1lIHBhc3N3b3JkIGVtYWlsIHZlcmlmaWVkJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKGFjY291bnQgPT4gYWNjb3VudClcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIGdldEFjY291bnRJZCh1c2VybmFtZSkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IEFjY291bnQuZmluZE9uZSh7dXNlcm5hbWU6IHVzZXJuYW1lfSlcclxuXHRcdC5zZWxlY3QoJ19pZCcpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbihhY2NvdW50ID0+IHtcclxuXHRcdFx0aWYgKGFjY291bnQpIHtcclxuXHRcdFx0XHRyZXR1cm4gYWNjb3VudC5faWQ7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBzYXZlQWNjb3VudChkYXRhKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgQWNjb3VudC51cGRhdGVPbmUoe3VzZXJuYW1lOiBkYXRhLnVzZXJuYW1lfSwgeyRzZXQ6IGRhdGF9KVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4ocmVzdWx0ID0+IHRydWUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHJcblx0YXN5bmMgYWRkUGxheWVyKGFjY291bnRJZCwgbmFtZSwgdGVtcGxhdGVJZCkge1xyXG5cdFx0bGV0IGFjY291bnQgPSBhd2FpdCB0aGlzLmdldEFjY291bnQoYWNjb3VudElkKTtcclxuXHRcdGlmICghYWNjb3VudCkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIkFjY291bnQgZG9lcyBub3QgZXhpc3Qgd2l0aCB0aGF0IGlkLlwiKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0bGV0IHRlbXBsYXRlID0gYXdhaXQgdGhpcy5nZXRQbGF5ZXJUZW1wbGF0ZSh0ZW1wbGF0ZUlkKTtcclxuXHRcdGlmICghdGVtcGxhdGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJQbGF5ZXIgVGVtcGxhdGUgZG9lcyBub3QgZXhpc3Qgd2l0aCB0aGF0IGlkLlwiKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0bGV0IHBsYXllciA9IGF3YWl0IHRoaXMuZ2V0UGxheWVyKG5hbWUpO1xyXG5cdFx0aWYgKHBsYXllcikge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIlBsYXllciBhbHJlYWR5IGV4aXN0cyB3aXRoIHRoYXQgbmFtZS5cIik7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHRwbGF5ZXIgPSBuZXcgUGxheWVyKHtcclxuXHRcdFx0X2lkIDogbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkLFxyXG5cdFx0XHRuYW1lLFxyXG5cdFx0XHRhY2NvdW50OiBhY2NvdW50SWQsXHJcblx0XHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZUlkXHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gYXdhaXQgcGxheWVyLnNhdmUoKVxyXG5cdFx0LnRoZW4ocmVzdWx0ID0+IHRydWUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBnZXRQbGF5ZXIobmFtZSkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IFBsYXllci5maW5kT25lKHtuYW1lOiBuYW1lfSlcclxuXHRcdC5zZWxlY3QoJ19pZCBhY2NvdW50IG5hbWUgdGVtcGxhdGUgbGV2ZWwgZXhwZXJpZW5jZSBtYXBJZCB4IHkgZGlyZWN0aW9uIGFkbWluQWNjZXNzIHNwcml0ZScpXHJcblx0XHQucG9wdWxhdGUoJ3RlbXBsYXRlJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHBsYXllciA9PiBwbGF5ZXIpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBnZXRQbGF5ZXJzQnlBY2NvdW50KGFjY291bnRJZCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IFBsYXllci5maW5kKHthY2NvdW50OiBhY2NvdW50SWR9KVxyXG5cdFx0LnNlbGVjdCgnX2lkIGFjY291bnQgbmFtZSB0ZW1wbGF0ZSBsZXZlbCBleHBlcmllbmNlIG1hcElkIHggeSBkaXJlY3Rpb24gYWRtaW5BY2Nlc3Mgc3ByaXRlJylcclxuXHRcdC5wb3B1bGF0ZSgndGVtcGxhdGUnKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4ocGxheWVycyA9PiBwbGF5ZXJzKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgc2F2ZVBsYXllcihkYXRhKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgUGxheWVyLnVwZGF0ZU9uZSh7bmFtZTogZGF0YS5uYW1lfSwgeyRzZXQ6IGRhdGF9KVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4ocmVzdWx0ID0+IHRydWUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRzYXZlT25saW5lUGxheWVycyhwbGF5ZXJzID0gW10pIHtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcGxheWVycy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRjb25zdCBwbGF5ZXIgPSBwbGF5ZXJzW2ldO1xyXG5cdFx0XHRpZiAoIXBsYXllcikgY29udGludWU7XHJcblx0XHRcdHRoaXMuc2F2ZVBsYXllcihwbGF5ZXIuZ2V0REJQYWNrKCkpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0YXN5bmMgYWRkQm90KHRlbXBsYXRlTmFtZSwgbWFwSWQsIHgsIHkpIHtcclxuXHRcdGxldCB0ZW1wbGF0ZUlkID0gYXdhaXQgdGhpcy5nZXRQbGF5ZXJUZW1wbGF0ZUlkKHRlbXBsYXRlTmFtZSk7XHJcblx0XHRpZiAoIXRlbXBsYXRlSWQpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJCb3QgVGVtcGxhdGUgZG9lcyBub3QgZXhpc3Qgd2l0aCB0aGF0IG5hbWUuXCIpO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0XHRsZXQgYm90ID0gYXdhaXQgdGhpcy5nZXRCb3QobmFtZSk7XHJcblx0XHRpZiAoYm90KSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiQm90IGFscmVhZHkgZXhpc3RzIHdpdGggdGhhdCBuYW1lLlwiKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGJvdCA9IG5ldyBCb3Qoe1xyXG5cdFx0XHRfaWQgOiBuZXcgbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQsXHJcblx0XHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZUlkLFxyXG5cdFx0XHRtYXBJZCxcclxuXHRcdFx0eCxcclxuXHRcdFx0eVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIGF3YWl0IGJvdC5zYXZlKClcclxuXHRcdC50aGVuKHJlc3VsdCA9PiB0cnVlKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgZ2V0Qm90KG5hbWUpIHtcclxuXHRcdHJldHVybiBhd2FpdCBCb3QuZmluZE9uZSh7bmFtZTogbmFtZX0pXHJcblx0XHQuc2VsZWN0KCdfaWQgbmFtZSBzcHJpdGUgdGVtcGxhdGUgbGV2ZWwgZXhwZXJpZW5jZSBtYXBJZCB4IHkgZGlyZWN0aW9uJylcclxuXHRcdC5wb3B1bGF0ZSgndGVtcGxhdGUnKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4oYm90ID0+IGJvdClcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIHNhdmVCb3QoZGF0YSkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IEJvdC51cGRhdGVPbmUoe25hbWU6IGRhdGEubmFtZX0sIHskc2V0OiBkYXRhfSlcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHJlc3VsdCA9PiB0cnVlKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblxyXG5cdGFzeW5jIGdldE1hcChtYXBJZCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IE1hcC5maW5kT25lKHttYXBJZDogbWFwSWR9KVxyXG5cdFx0LnNlbGVjdCgnbWFwSWQgbmFtZSBkcm9wQ2hhbmNlIGRyb3BBbW91bnRFUSB0aWxlcyBpc1dhbGwgaXNIb3N0aWxlIGRhbWFnZSB3YXJwTWFwIHdhcnBYIHdhcnBZJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKG1hcCA9PiBtYXApXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBzYXZlTWFwKGRhdGEpIHtcclxuXHRcdHJldHVybiBhd2FpdCBNYXAudXBkYXRlT25lKHttYXBJZDogZGF0YS5tYXBJZH0sIHskc2V0OiBkYXRhfSwge3Vwc2VydDogdHJ1ZX0pXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbihyZXN1bHQgPT4gdHJ1ZSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIGdldEFsbE1hcHMoKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRyZXR1cm4gYXdhaXQgTWFwLmZpbmQoe30pXHJcblx0XHRcdC5zZWxlY3QoJ21hcElkIG5hbWUgZHJvcENoYW5jZSBkcm9wQW1vdW50RVEgdGlsZXMgaXNXYWxsIGlzSG9zdGlsZSBkYW1hZ2Ugd2FycE1hcCB3YXJwWCB3YXJwWScpXHJcblx0XHRcdC5leGVjKClcclxuXHRcdFx0LnRoZW4obWFwcyA9PiBtYXBzKVxyXG5cdFx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdFx0fVxyXG5cdFx0Y2F0Y2goZXJyKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRhc3luYyBhZGRQbGF5ZXJUZW1wbGF0ZShkYXRhKSB7XHJcblx0XHRpZiAoIWRhdGEubmFtZSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIk5hbWUgaXMgcmVxdWlyZWQuXCIpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGNoZWNrVGVtcGxhdGUgPSBhd2FpdCBQbGF5ZXJUZW1wbGF0ZS5maW5kT25lKHtuYW1lOiBkYXRhLm5hbWV9KVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4odGVtcGxhdGUgPT4gdGVtcGxhdGUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cclxuXHRcdGlmIChjaGVja1RlbXBsYXRlKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiVGVtcGxhdGUgYWxyZWFkeSBleGlzdHMgd2l0aCB0aGF0IG5hbWUuXCIpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgdGVtcGxhdGUgPSBuZXcgUGxheWVyVGVtcGxhdGUoe1xyXG5cdFx0XHRfaWQ6IG5ldyBtb25nb29zZS5UeXBlcy5PYmplY3RJZCxcclxuXHRcdFx0bmFtZTogZGF0YS5uYW1lLFxyXG5cdFx0XHRzcHJpdGU6IGRhdGEuc3ByaXRlLFxyXG5cdFx0XHRkYW1hZ2VCYXNlOiBkYXRhLmRhbWFnZUJhc2UsXHJcblx0XHRcdGRlZmVuY2VCYXNlOiBkYXRhLmRlZmVuY2VCYXNlLFxyXG5cdFx0XHRoZWFsdGhNYXhCYXNlOiBkYXRhLmhlYWx0aE1heEJhc2UsXHJcblx0XHRcdGVuZXJneU1heEJhc2U6IGRhdGEuZW5lcmd5TWF4QmFzZSxcclxuXHRcdFx0cmFuZ2VCYXNlOiBkYXRhLnJhbmdlQmFzZSxcclxuXHRcdFx0aGVhbHRoUGVyTGV2ZWw6IGRhdGEuaGVhbHRoUGVyTGV2ZWwsXHJcblx0XHRcdGVuZXJneVBlckxldmVsOiBkYXRhLmVuZXJneVBlckxldmVsXHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gYXdhaXQgdGVtcGxhdGUuc2F2ZSgpXHJcblx0XHQudGhlbihyZXN1bHQgPT4gdHJ1ZSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIGdldFBsYXllclRlbXBsYXRlKHRlbXBsYXRlSWQpIHtcclxuXHRcdHJldHVybiBhd2FpdCBQbGF5ZXJUZW1wbGF0ZS5maW5kQnlJZCh0ZW1wbGF0ZUlkKVxyXG5cdFx0LnNlbGVjdCgnbmFtZSBzcHJpdGUgZGFtYWdlQmFzZSBkZWZlbmNlQmFzZSBoZWFsdGhNYXhCYXNlIGVuZXJneU1heEJhc2UgcmFuZ2VCYXNlIGhlYWx0aFBlckxldmVsLCBlbmVyZ3lQZXJMZXZlbCcpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbih0ZW1wbGF0ZSA9PiB0ZW1wbGF0ZSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIGdldEFsbFBsYXllclRlbXBsYXRlcygpIHtcclxuXHRcdHJldHVybiBhd2FpdCBQbGF5ZXJUZW1wbGF0ZS5maW5kKHt9KVxyXG5cdFx0LnNlbGVjdCgnX2lkIG5hbWUgc3ByaXRlIGRhbWFnZUJhc2UgZGVmZW5jZUJhc2UgaGVhbHRoTWF4QmFzZSBlbmVyZ3lNYXhCYXNlIHJhbmdlQmFzZSBoZWFsdGhQZXJMZXZlbCwgZW5lcmd5UGVyTGV2ZWwnKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4odGVtcGxhdGVzID0+IHRlbXBsYXRlcylcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cclxuXHRhc3luYyBhZGRCb3RUZW1wbGF0ZShkYXRhKSB7XHJcblx0XHRjb25zdCB0ZW1wbGF0ZSA9IG5ldyBCb3RUZW1wbGF0ZSh7XHJcblx0XHRcdF9pZDogbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkLFxyXG5cdFx0XHRuYW1lOiBkYXRhLm5hbWUsXHJcblx0XHRcdHNwcml0ZTogZGF0YS5zcHJpdGUsXHJcblx0XHRcdGRhbWFnZUJhc2U6IGRhdGEuZGFtYWdlQmFzZSxcclxuXHRcdFx0ZGVmZW5jZUJhc2U6IGRhdGEuZGVmZW5jZUJhc2UsXHJcblx0XHRcdGhlYWx0aE1heEJhc2U6IGRhdGEuaGVhbHRoTWF4QmFzZSxcclxuXHRcdFx0ZW5lcmd5TWF4QmFzZTogZGF0YS5lbmVyZ3lNYXhCYXNlLFxyXG5cdFx0XHRyYW5nZUJhc2U6IGRhdGEucmFuZ2VCYXNlLFxyXG5cdFx0XHRob3N0aWxlOiBkYXRhLmhvc3RpbGVcclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBhd2FpdCB0ZW1wbGF0ZS5zYXZlKClcclxuXHRcdC50aGVuKHJlc3VsdCA9PiB0cnVlKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgZ2V0Qm90VGVtcGxhdGUodGVtcGxhdGVJZCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IEJvdFRlbXBsYXRlLmZpbmRCeUlkKHRlbXBsYXRlSWQpXHJcblx0XHQuc2VsZWN0KCduYW1lIHNwcml0ZSBkYW1hZ2VCYXNlIGRlZmVuY2VCYXNlIGhlYWx0aE1heEJhc2UgZW5lcmd5TWF4QmFzZSByYW5nZUJhc2UgaG9zdGlsZScpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbih0ZW1wbGF0ZSA9PiB0ZW1wbGF0ZSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIGdldEFsbEJvdFRlbXBsYXRlcygpIHtcclxuXHRcdHJldHVybiBhd2FpdCBCb3RUZW1wbGF0ZS5maW5kKHt9KVxyXG5cdFx0LnNlbGVjdCgnX2lkIG5hbWUgc3ByaXRlIGRhbWFnZUJhc2UgZGVmZW5jZUJhc2UgaGVhbHRoTWF4QmFzZSBlbmVyZ3lNYXhCYXNlIHJhbmdlQmFzZSBob3N0aWxlJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHRlbXBsYXRlcyA9PiB0ZW1wbGF0ZXMpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHJcblx0YXN5bmMgYWRkSXRlbVR5cGUoZGF0YSkge1xyXG5cdFx0Y29uc3QgdHlwZSA9IG5ldyBJdGVtVHlwZSh7XHJcblx0XHRcdF9pZDogbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkLFxyXG5cdFx0XHRuYW1lOiBkYXRhLm5hbWUsXHJcblx0XHRcdHN0YWNrYWJsZTogZGF0YS5zdGFja2FibGUsXHJcblx0XHRcdGVxdWlwcGVkU2xvdDogZGF0YS5lcXVpcHBlZFNsb3RcclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBhd2FpdCB0eXBlLnNhdmUoKVxyXG5cdFx0LnRoZW4ocmVzdWx0ID0+IHRydWUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBnZXRJdGVtVHlwZSh0eXBlSWQpIHtcclxuXHRcdHJldHVybiBhd2FpdCBJdGVtVHlwZS5maW5kQnlJZCh0eXBlSWQpXHJcblx0XHQuc2VsZWN0KCduYW1lIHN0YWNrYWJsZSBlcXVpcHBlZFNsb3QnKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4odHlwZSA9PiB0eXBlKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgZ2V0QWxsSXRlbVR5cGVzKCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IEl0ZW1UeXBlLmZpbmQoe30pXHJcblx0XHQuc2VsZWN0KCdfaWQgbmFtZSBzdGFja2FibGUgZXF1aXBwZWRTbG90JylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHR5cGVzID0+IHR5cGVzKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblxyXG5cdGFzeW5jIGFkZEl0ZW1UZW1wbGF0ZShkYXRhKSB7XHJcblx0XHRjb25zdCB0ZW1wbGF0ZSA9IG5ldyBJdGVtVGVtcGxhdGUoe1xyXG5cdFx0XHRfaWQ6IG5ldyBtb25nb29zZS5UeXBlcy5PYmplY3RJZCxcclxuXHRcdFx0bmFtZTogZGF0YS5uYW1lLFxyXG5cdFx0XHRzcHJpdGU6IGRhdGEuc3ByaXRlLFxyXG5cdFx0XHRyZXVzYWJsZTogZGF0YS5yZXVzYWJsZSxcclxuXHRcdFx0dHlwZTogZGF0YS50eXBlSWQsXHJcblx0XHRcdHBhc3NpdmVEYW1hZ2U6IGRhdGEucGFzc2l2ZURhbWFnZSxcclxuXHRcdFx0cGFzc2l2ZURlZmVuY2U6IGRhdGEucGFzc2l2ZURlZmVuY2UsXHJcblx0XHRcdHBhc3NpdmVIZWFsdGhNYXg6IGRhdGEucGFzc2l2ZUhlYWx0aE1heCxcclxuXHRcdFx0cGFzc2l2ZUVuZXJneU1heDogZGF0YS5wYXNzaXZlRW5lcmd5TWF4LFxyXG5cdFx0XHRwYXNzaXZlUmFuZ2U6IGRhdGEucGFzc2l2ZVJhbmdlLFxyXG5cdFx0XHRlcXVpcHBlZERhbWFnZTogZGF0YS5lcXVpcHBlZERhbWFnZSxcclxuXHRcdFx0ZXF1aXBwZWREZWZlbmNlOiBkYXRhLmVxdWlwcGVkRGVmZW5jZSxcclxuXHRcdFx0ZXF1aXBwZWRIZWFsdGhNYXg6IGRhdGEuZXF1aXBwZWRIZWFsdGhNYXgsXHJcblx0XHRcdGVxdWlwcGVkRW5lcmd5TWF4OiBkYXRhLmVxdWlwcGVkRW5lcmd5TWF4LFxyXG5cdFx0XHRlcXVpcHBlZFJhbmdlOiBkYXRhLmVxdWlwcGVkUmFuZ2VcclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBhd2FpdCB0ZW1wbGF0ZS5zYXZlKClcclxuXHRcdC50aGVuKHJlc3VsdCA9PiB0cnVlKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgZ2V0SXRlbVRlbXBsYXRlKHRlbXBsYXRlSWQpIHtcclxuXHRcdHJldHVybiBhd2FpdCBJdGVtVGVtcGxhdGUuZmluZEJ5SWQodGVtcGxhdGVJZClcclxuXHRcdC5zZWxlY3QoJ25hbWUgc3ByaXRlIHJldXNhYmxlIHR5cGUgcGFzc2l2ZURhbWFnZSBwYXNzaXZlRGVmZW5jZSBwYXNzaXZlSGVhbHRoTWF4IHBhc3NpdmVFbmVyZ3lNYXhCYXNlIHBhc3NpdmVSYW5nZSBlcXVpcHBlZERhbWFnZSBlcXVpcHBlZERlZmVuY2UgZXF1aXBwZWRIZWFsdGhNYXggZXF1aXBwZWRFbmVyZ3lNYXhCYXNlIGVxdWlwcGVkUmFuZ2UnKVxyXG5cdFx0LnBvcHVsYXRlKCd0eXBlJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHRlbXBsYXRlID0+IHRlbXBsYXRlKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgZ2V0QWxsSXRlbVRlbXBsYXRlcygpIHtcclxuXHRcdHJldHVybiBhd2FpdCBJdGVtVGVtcGxhdGUuZmluZCh7fSlcclxuXHRcdC5zZWxlY3QoJ19pZCBuYW1lIHNwcml0ZSByZXVzYWJsZSB0eXBlIHBhc3NpdmVEYW1hZ2UgcGFzc2l2ZURlZmVuY2UgcGFzc2l2ZUhlYWx0aE1heCBwYXNzaXZlRW5lcmd5TWF4QmFzZSBwYXNzaXZlUmFuZ2UgZXF1aXBwZWREYW1hZ2UgZXF1aXBwZWREZWZlbmNlIGVxdWlwcGVkSGVhbHRoTWF4IGVxdWlwcGVkRW5lcmd5TWF4QmFzZSBlcXVpcHBlZFJhbmdlJylcclxuXHRcdC5wb3B1bGF0ZSgndHlwZScpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbih0ZW1wbGF0ZXMgPT4gdGVtcGxhdGVzKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcbn1cclxuXHJcbmNvbnN0IGRiID0gbmV3IERhdGFiYXNlKCk7XHJcbmV4cG9ydCBkZWZhdWx0IGRiO1xyXG4iLCJpbXBvcnQgZGIgZnJvbSAnLi9kYi5qcyc7XHJcbmltcG9ydCBjb25maWcgZnJvbSAnLi9jb25maWcuanMnO1xyXG5cclxuaW1wb3J0IE1hcCBmcm9tICcuL2NsYXNzZXMvbWFwLmpzJztcclxuaW1wb3J0IFBsYXllciBmcm9tICcuL2NsYXNzZXMvcGxheWVyLmpzJztcclxuaW1wb3J0IEJvdCBmcm9tICcuL2NsYXNzZXMvYm90LmpzJztcclxuaW1wb3J0IEl0ZW0gZnJvbSAnLi9jbGFzc2VzL2l0ZW0uanMnO1xyXG5pbXBvcnQgRWZmZWN0IGZyb20gJy4vY2xhc3Nlcy9lZmZlY3QuanMnO1xyXG5pbXBvcnQgVGV4dCBmcm9tICcuL2NsYXNzZXMvdGV4dC5qcyc7XHJcbmltcG9ydCBNZXNzYWdlIGZyb20gJy4vY2xhc3Nlcy9tZXNzYWdlLmpzJztcclxuXHJcbmNsYXNzIEdhbWUge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0dGhpcy5tYXBzID0gW107XHJcblx0XHR0aGlzLnBsYXllcnMgPSBbXTtcclxuXHRcdHRoaXMuYm90cyA9IFtdO1xyXG5cdFx0dGhpcy5pdGVtcyA9IFtdO1xyXG5cdFx0dGhpcy5lZmZlY3RzID0gW107XHJcblx0XHR0aGlzLnRleHRzID0gW107XHJcblx0XHR0aGlzLm1lc3NhZ2VRdWV1ZSA9IFtdO1xyXG5cdFx0XHJcblx0XHR0aGlzLnBsYXllclRlbXBsYXRlcyA9IHt9O1xyXG5cdFx0dGhpcy5ib3RUZW1wbGF0ZXMgPSB7fTtcclxuXHRcdHRoaXMuaXRlbVRlbXBsYXRlcyA9IHt9O1xyXG5cclxuXHRcdHRoaXMubG9hZE1hcHMoKTtcclxuXHRcdHRoaXMubG9hZFBsYXllclRlbXBsYXRlcygpO1xyXG5cdFx0dGhpcy5sb2FkQm90VGVtcGxhdGVzKCk7XHJcblx0XHR0aGlzLmxvYWRJdGVtVGVtcGxhdGVzKCk7XHJcblx0XHR0aGlzLmxvYWRDb21tYW5kcygpO1xyXG5cdH1cclxuXHJcblx0bG9hZE1hcHMoKSB7XHJcblx0XHRkYi5nZXRBbGxNYXBzKClcclxuXHRcdC50aGVuKG1hcERhdGEgPT4ge1xyXG5cdFx0XHRjb25zdCBvcmRlcmVkTWFwRGF0YSA9IFtdO1xyXG5cdFx0XHRmb3IgKGxldCBpZCA9IDA7IGlkIDwgbWFwRGF0YS5sZW5ndGg7IGlkKyspIHtcclxuXHRcdFx0XHRjb25zdCBkYXRhID0gbWFwRGF0YVtpZF07XHJcblx0XHRcdFx0aWYgKGRhdGEpIG9yZGVyZWRNYXBEYXRhW2RhdGEubWFwSWRdID0gZGF0YTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Zm9yIChsZXQgaWQgPSAwOyBpZCA8IGNvbmZpZy5NQVhfTUFQUzsgaWQrKykge1xyXG5cdFx0XHRcdGlmIChvcmRlcmVkTWFwRGF0YVtpZF0pIHtcclxuXHRcdFx0XHRcdHRoaXMubWFwc1tpZF0gPSBuZXcgTWFwKGlkLCBvcmRlcmVkTWFwRGF0YVtpZF0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubWFwc1tpZF0gPSBuZXcgTWFwKGlkKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHJcblx0bG9hZFBsYXllclRlbXBsYXRlcygpIHtcclxuXHRcdGRiLmdldEFsbFBsYXllclRlbXBsYXRlcygpXHJcblx0XHQudGhlbih0ZW1wbGF0ZXMgPT4ge1xyXG5cdFx0XHR0aGlzLnBsYXllclRlbXBsYXRlcyA9IHt9O1xyXG5cdFx0XHR0ZW1wbGF0ZXMuZm9yRWFjaCh0ZW1wbGF0ZSA9PiB7XHJcblx0XHRcdFx0dGhpcy5wbGF5ZXJUZW1wbGF0ZXNbdGVtcGxhdGUuX2lkXSA9IHRlbXBsYXRlO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pLmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblxyXG5cdGxvYWRCb3RUZW1wbGF0ZXMoKSB7XHJcblx0XHRkYi5nZXRBbGxCb3RUZW1wbGF0ZXMoKVxyXG5cdFx0LnRoZW4odGVtcGxhdGVzID0+IHtcclxuXHRcdFx0dGhpcy5ib3RUZW1wbGF0ZXMgPSB7fTtcclxuXHRcdFx0dGVtcGxhdGVzLmZvckVhY2godGVtcGxhdGUgPT4ge1xyXG5cdFx0XHRcdHRoaXMuYm90VGVtcGxhdGVzW3RlbXBsYXRlLl9pZF0gPSB0ZW1wbGF0ZTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KS5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cclxuXHRsb2FkSXRlbVRlbXBsYXRlcygpIHtcclxuXHRcdGRiLmdldEFsbEl0ZW1UZW1wbGF0ZXMoKVxyXG5cdFx0LnRoZW4odGVtcGxhdGVzID0+IHtcclxuXHRcdFx0dGhpcy5pdGVtVGVtcGxhdGVzID0ge307XHJcblx0XHRcdHRlbXBsYXRlcy5mb3JFYWNoKHRlbXBsYXRlID0+IHtcclxuXHRcdFx0XHR0aGlzLml0ZW1UZW1wbGF0ZXNbdGVtcGxhdGUuX2lkXSA9IHRlbXBsYXRlO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pLmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblxyXG5cdGxvYWRDb21tYW5kcygpIHtcclxuXHRcdHRoaXMuY29tbWFuZHMgPSB7XHJcblx0XHRcdG1vdmU6IChkYXRhLCBwbGF5ZXIpID0+IHBsYXllci5pbnB1dC5kaXJlY3Rpb24gPSBkYXRhLmRpcmVjdGlvbixcclxuXHRcdFx0cnVuOiAoZGF0YSwgcGxheWVyKSA9PiBwbGF5ZXIuaW5wdXQucnVuID0gZGF0YS5zdGF0ZSxcclxuXHRcdFx0cGlja3VwOiAoZGF0YSwgcGxheWVyKSA9PiB7XHJcblx0XHRcdFx0aWYgKCFwbGF5ZXIuaW5wdXQucGlja3VwICYmIGRhdGEuc3RhdGUpIHBsYXllci5waWNrVXAoKTtcclxuXHRcdFx0XHRwbGF5ZXIuaW5wdXQucGlja3VwID0gZGF0YS5zdGF0ZTtcclxuXHRcdFx0fSxcclxuXHRcdFx0YXR0YWNrOiAoZGF0YSwgcGxheWVyKSA9PiB7XHJcblx0XHRcdFx0cGxheWVyLmlucHV0LmF0dGFjayA9IGRhdGEuc3RhdGU7XHJcblx0XHRcdFx0cGxheWVyLmF0dGFjaygxLCBwbGF5ZXIuZGlyZWN0aW9uKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0ZG91YmxlQ2xpY2tJdGVtOiAoZGF0YSwgcGxheWVyKSA9PiBwbGF5ZXIudXNlSXRlbShkYXRhLnNsb3QpLFxyXG5cdFx0XHRyaWdodENsaWNrSXRlbTogKGRhdGEsIHBsYXllcikgPT4gcGxheWVyLmRyb3BJdGVtKGRhdGEuc2xvdCksXHJcblx0XHRcdGRyYWdTdG9wR2FtZTogKGRhdGEsIHBsYXllcikgPT4gcGxheWVyLmRyb3BJdGVtKGRhdGEuc2xvdCksXHJcblx0XHRcdGRyYWdTdG9wSW52ZW50b3J5OiAoZGF0YSwgcGxheWVyKSA9PiBwbGF5ZXIubW92ZUl0ZW1Ub1Nsb3QoZGF0YS5zbG90LCBkYXRhLm5ld1Nsb3QpLFxyXG5cdFx0XHRkcmFnU3RvcEVxdWlwbWVudDogKGRhdGEsIHBsYXllcikgPT4gcGxheWVyLm1vdmVJdGVtVG9TbG90KGRhdGEuc2xvdCwgZGF0YS5uZXdTbG90KSxcclxuXHRcdFx0c2VydmVyQ2hhdDogKGRhdGEsIHBsYXllcikgPT4gZ2FtZS5zZW5kTWVzc2FnZUdsb2JhbChwbGF5ZXIuZ2FtZUlkLCBgJHtwbGF5ZXIubmFtZX0geWVsbHMsIFwiJHtkYXRhLm1lc3NhZ2V9XCJgKSxcclxuXHRcdFx0bWFwQ2hhdDogKGRhdGEsIHBsYXllcikgPT4gZ2FtZS5zZW5kTWVzc2FnZU1hcChwbGF5ZXIuZ2FtZUlkLCBwbGF5ZXIubWFwSWQsIGAke3BsYXllci5uYW1lfSBzYXlzLCBcIiR7ZGF0YS5tZXNzYWdlfVwiYCksXHJcblx0XHRcdHBsYXllckNoYXQ6IChkYXRhLCBwbGF5ZXIpID0+IHtcclxuXHRcdFx0XHRjb25zdCB0YXJnZXQgPSBnYW1lLnBsYXllcnNbZGF0YS50YXJnZXRJZF07XHJcblx0XHRcdFx0aWYgKHRhcmdldCkge1xyXG5cdFx0XHRcdFx0Z2FtZS5zZW5kTWVzc2FnZVBsYXllcihwbGF5ZXIuZ2FtZUlkLCB0YXJnZXQuZ2FtZUlkLCBgJHtwbGF5ZXIubmFtZX0gd2hpc3BlcnMsIFwiJHtkYXRhLm1lc3NhZ2V9XCJgKTtcclxuXHRcdFx0XHRcdGdhbWUuc2VuZE1lc3NhZ2VQbGF5ZXIocGxheWVyLmdhbWVJZCwgcGxheWVyLmdhbWVJZCwgYFlvdSB3aGlzcGVyIHRvICR7dGFyZ2V0Lm5hbWV9LCBcIiR7ZGF0YS5tZXNzYWdlfVwiYCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRtYWNybzE6IChkYXRhKSA9PiB7XHJcblx0XHRcdFx0aWYgKGRhdGEpIHRoaXMuc3Bhd25NYXBJdGVtKDEsIDUsIDUsIFwiNWMxYmZlYjdkOGZiNjAxMmNjOTY2MDgzXCIpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRtYWNybzI6IChkYXRhKSA9PiB7XHJcblx0XHRcdFx0aWYgKGRhdGEpIHRoaXMuc3Bhd25Cb3QoMSwgNSwgNSwgXCI1YzFiZWNkZTI4ZDA1YjA3N2NiYWEzODVcIik7XHJcblx0XHRcdH0sXHJcblx0XHRcdG1hY3JvMzogKGRhdGEpID0+IHtcclxuXHRcdFx0XHRpZiAoZGF0YSkge1xyXG5cdFx0XHRcdFx0aWYgKHBsYXllci5zcHJpdGUgPj0gY29uZmlnLk1BWF9TUFJJVEVTKSBwbGF5ZXIuc3ByaXRlID0gMTtcclxuXHRcdFx0XHRcdGVsc2UgcGxheWVyLnNwcml0ZSsrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0bWFjcm80OiAoZGF0YSkgPT4ge1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdH07XHJcblx0XHRcclxuXHRcdHRoaXMuZ29kQ29tbWFuZHMgPSB7XHJcblx0XHRcdHNwYXduTWFwSXRlbTogKGRhdGEpID0+IHRoaXMuc3Bhd25NYXBJdGVtKGRhdGEuYXJnc1swXSwgZGF0YS5hcmdzWzFdLCBkYXRhLmFyZ3NbMl0sIGRhdGEuYXJnc1szXSwgZGF0YS5hcmdzWzRdKSxcclxuXHRcdFx0c3Bhd25Cb3Q6IChkYXRhKSA9PiB0aGlzLnNwYXduQm90KGRhdGEuYXJnc1swXSwgZGF0YS5hcmdzWzFdLCBkYXRhLmFyZ3NbMl0sIGRhdGEuYXJnc1szXSwgZGF0YS5hcmdzWzRdKSxcclxuXHRcdFx0c2V0U3ByaXRlOiAoZGF0YSwgcGxheWVyKSA9PiBwbGF5ZXIuc3ByaXRlID0gZGF0YS5hcmdzWzBdXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHRjb25zdCBwYWNrID0ge1xyXG5cdFx0XHRwbGF5ZXJzOiBbXSxcclxuXHRcdFx0Ym90czogW10sXHJcblx0XHRcdGl0ZW1zOiBbXSxcclxuXHRcdFx0ZWZmZWN0czogW10sXHJcblx0XHRcdHRleHRzOiBbXSxcclxuXHRcdFx0bWVzc2FnZXM6IFtdLmNvbmNhdCh0aGlzLm1lc3NhZ2VRdWV1ZSlcclxuXHRcdH07XHJcblx0XHR0aGlzLm1lc3NhZ2VRdWV1ZSA9IFtdO1xyXG5cclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IHBsYXllciA9IHRoaXMucGxheWVyc1tpXTtcclxuXHRcdFx0aWYgKHBsYXllciAhPSBudWxsKSBwYWNrLnBsYXllcnNbcGxheWVyLmdhbWVJZF0gPSBwbGF5ZXIudXBkYXRlKGRlbHRhKTtcclxuXHRcdH1cclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ib3RzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IGJvdCA9IHRoaXMuYm90c1tpXTtcclxuXHRcdFx0aWYgKGJvdCkgcGFjay5ib3RzW2JvdC5nYW1lSWRdID0gYm90LnVwZGF0ZShkZWx0YSk7XHJcblx0XHR9XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgaXRlbSA9IHRoaXMuaXRlbXNbaV07XHJcblx0XHRcdGlmIChpdGVtKSBwYWNrLml0ZW1zW2l0ZW0uZ2FtZUlkXSA9IGl0ZW0udXBkYXRlKGRlbHRhKTtcclxuXHRcdH1cclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5lZmZlY3RzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IGVmZmVjdCA9IHRoaXMuZWZmZWN0c1tpXTtcclxuXHRcdFx0aWYgKGVmZmVjdCkgcGFjay5lZmZlY3RzW2VmZmVjdC5pZF0gPSBlZmZlY3QudXBkYXRlKGRlbHRhKTtcclxuXHRcdH1cclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy50ZXh0cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRjb25zdCB0ZXh0ID0gdGhpcy50ZXh0c1tpXTtcclxuXHRcdFx0aWYgKHRleHQpIHBhY2sudGV4dHNbdGV4dC5nYW1lSWRdID0gdGV4dC51cGRhdGUoZGVsdGEpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHBhY2s7XHJcblx0fVxyXG5cclxuXHQvLyBQbGF5ZXJzXHJcblx0cGxheWVyTG9naW4oc29ja2V0SWQsIGRhdGEpIHtcclxuXHRcdGZvciAobGV0IHBsYXllciBvZiB0aGlzLnBsYXllcnMpIHtcclxuXHRcdFx0aWYgKHBsYXllciAmJiBwbGF5ZXIubmFtZSA9PT0gZGF0YS5uYW1lKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJQbGF5ZXIgaXMgYWxyZWFkeSBzaWduZWQgaW4uXCIpO1xyXG5cdFx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgcGxheWVyID0gbmV3IFBsYXllcihzb2NrZXRJZCwgZGF0YSk7XHJcblx0XHRkYi5sb2coYCR7c29ja2V0SWR9IC0gJHtwbGF5ZXIubmFtZX0gaGFzIGxvZ2dlZCBpbi5gKTtcclxuXHRcdHRoaXMuc2VuZEdhbWVJbmZvR2xvYmFsKGAke3BsYXllci5uYW1lfSBoYXMgbG9nZ2VkIGluLmApO1xyXG5cdFx0cmV0dXJuIHBsYXllcjtcclxuXHR9XHJcblx0cGxheWVyTG9nb3V0KHBsYXllcklkKSB7XHJcblx0XHRsZXQgcGxheWVyID0gdGhpcy5wbGF5ZXJzW3BsYXllcklkXTtcclxuXHRcdGlmIChwbGF5ZXIpIHtcclxuXHRcdFx0Y29uc3QgcGxheWVyRGF0YSA9IHBsYXllci5nZXREQlBhY2soKVxyXG5cdFx0XHRkYi5sb2coYCR7cGxheWVyLnNvY2tldElkfSAtICR7cGxheWVyLm5hbWV9IGhhcyBsb2dnZWQgb3V0LmApO1xyXG5cdFx0XHR0aGlzLnNlbmRHYW1lSW5mb0dsb2JhbChgJHtwbGF5ZXIubmFtZX0gaGFzIGxvZ2dlZCBvdXQuYCk7XHJcblx0XHRcdGRlbGV0ZSB0aGlzLnRleHRzW3BsYXllci5kaXNwbGF5TmFtZUlkXTtcclxuXHRcdFx0ZGVsZXRlIHRoaXMucGxheWVyc1twbGF5ZXJJZF07XHJcblx0XHRcdGRiLnNhdmVQbGF5ZXIocGxheWVyRGF0YSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdGdldEV4cFRvTGV2ZWwobGV2ZWwpIHtcclxuXHRcdGxldCBleHAgPSAxMDtcclxuXHRcdGZvciAobGV0IGkgPSAxOyBpIDwgY29uZmlnLk1BWF9MRVZFTDsgaSsrKSB7XHJcblx0XHRcdGlmIChpID09PSBsZXZlbCkgcmV0dXJuIGV4cDtcclxuXHRcdFx0ZXhwID0gKGV4cCArIChleHAgJSAyKSkgKiAxLjU7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLyBHYW1lIEluZm9cclxuXHRzZW5kR2FtZUluZm9HbG9iYWwobWVzc2FnZSkge1xyXG5cdFx0dGhpcy5tZXNzYWdlUXVldWUucHVzaChuZXcgTWVzc2FnZShudWxsLCBtZXNzYWdlLCAnZ2FtZUluZm8nKSk7XHJcblx0fVxyXG5cdHNlbmRHYW1lSW5mb01hcChtYXBJZCwgbWVzc2FnZSkge1xyXG5cdFx0dGhpcy5tZXNzYWdlUXVldWUucHVzaChuZXcgTWVzc2FnZShudWxsLCBtZXNzYWdlLCAnZ2FtZUluZm8nLCBtYXBJZCkpO1xyXG5cdH1cclxuXHRzZW5kR2FtZUluZm9QbGF5ZXIoaWQsIG1lc3NhZ2UpIHtcclxuXHRcdHRoaXMubWVzc2FnZVF1ZXVlLnB1c2gobmV3IE1lc3NhZ2UobnVsbCwgbWVzc2FnZSwgJ2dhbWVJbmZvJywgbnVsbCwgaWQpKTtcclxuXHR9XHJcblx0XHJcblx0Ly8gQ2hhdCBNZXNzYWdlc1xyXG5cdHNlbmRNZXNzYWdlR2xvYmFsKHNlbmRlcklkLCBtZXNzYWdlKSB7XHJcblx0XHR0aGlzLm1lc3NhZ2VRdWV1ZS5wdXNoKG5ldyBNZXNzYWdlKHNlbmRlcklkLCBtZXNzYWdlLCAnbWVzc2FnZUdsb2JhbCcpKTtcclxuXHR9XHJcblx0c2VuZE1lc3NhZ2VNYXAoc2VuZGVySWQsIG1hcElkLCBtZXNzYWdlKSB7XHJcblx0XHR0aGlzLm1lc3NhZ2VRdWV1ZS5wdXNoKG5ldyBNZXNzYWdlKHNlbmRlcklkLCBtZXNzYWdlLCAnbWVzc2FnZU1hcCcsIG1hcElkKSk7XHJcblx0fVxyXG5cdHNlbmRNZXNzYWdlUGxheWVyKHNlbmRlcklkLCBpZCwgbWVzc2FnZSkge1xyXG5cdFx0dGhpcy5tZXNzYWdlUXVldWUucHVzaChuZXcgTWVzc2FnZShzZW5kZXJJZCwgbWVzc2FnZSwgJ21lc3NhZ2VQbGF5ZXInLCBudWxsLCBpZCkpO1xyXG5cdH1cclxuXHJcblx0Ly8gTWFwXHJcblx0aXNWYWNhbnQobWFwSWQsIHgsIHkpIHtcclxuXHRcdC8vIENoZWNrIGZvciBNYXAgRWRnZXNcclxuXHRcdGlmICh4IDwgMCB8fCB4ID49IGNvbmZpZy5NQVBfQ09MVU1OUyB8fCB5IDwgMCB8fCB5ID49IGNvbmZpZy5NQVBfUk9XUykgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHJcblx0XHQvLyBDaGVjayBmb3IgV2FsbCBUaWxlc1xyXG5cdFx0Y29uc3QgbWFwID0gdGhpcy5tYXBzW21hcElkXTtcclxuXHRcdGlmIChtYXAuaXNXYWxsW3ldW3hdKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcclxuXHRcdC8vIENoZWNrIGZvciBBY3RvcnNcclxuXHRcdGNvbnN0IGFjdG9yTGlzdCA9IHRoaXMucGxheWVycy5jb25jYXQodGhpcy5ib3RzKTtcclxuXHRcdGNvbnN0IGFjdG9yc09uVGlsZSA9IGFjdG9yTGlzdC5maWx0ZXIoYWN0b3IgPT4ge1xyXG5cdFx0XHRyZXR1cm4gYWN0b3IubWFwSWQgPT09IG1hcElkICYmIGFjdG9yLnggPT09IHggJiYgYWN0b3IueSA9PT0geSAmJiAhYWN0b3IuaXNEZWFkO1xyXG5cdFx0fSk7XHJcblx0XHRpZiAoYWN0b3JzT25UaWxlLmxlbmd0aCA+IDApIHJldHVybiBmYWxzZTtcclxuXHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdHNwYXduQm90KG1hcElkLCB4LCB5LCB0ZW1wbGF0ZUlkLCBkaXJlY3Rpb24gPSAnZG93bicpIHtcclxuXHRcdHRlbXBsYXRlSWQgPSAnNWMxYmVjZGUyOGQwNWIwNzdjYmFhMzg1JztcclxuXHRcdGNvbnN0IHRlbXBsYXRlID0gdGhpcy5ib3RUZW1wbGF0ZXNbdGVtcGxhdGVJZF07XHJcblx0XHRpZiAodGVtcGxhdGUpIHtcclxuXHRcdFx0bmV3IEJvdChtYXBJZCwgeCwgeSwgZGlyZWN0aW9uLCB0ZW1wbGF0ZSk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJCb3QgVGVtcGxhdGUgZG9lcyBub3QgZXhpc3Qgd2l0aCB0aGF0IElkXCIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRzcGF3bk1hcEl0ZW0obWFwSWQsIHgsIHksIHRlbXBsYXRlSWQsIHN0YWNrID0gMSkge1xyXG5cdFx0bGV0IHRlbXBsYXRlID0gdGhpcy5pdGVtVGVtcGxhdGVzW3RlbXBsYXRlSWRdO1xyXG5cdFx0aWYgKHRlbXBsYXRlKSB7XHJcblx0XHRcdG5ldyBJdGVtKHttYXBJZCwgeCwgeX0sIHRlbXBsYXRlLCBzdGFjayk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJJdGVtIFRlbXBsYXRlIGRvZXMgbm90IGV4aXN0IHdpdGggdGhhdCBJZFwiKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHNwYXduRGFtYWdlVGV4dChtYXBJZCwgeCwgeSwgZGFtYWdlKSB7XHJcblx0XHRuZXcgVGV4dChtYXBJZCwgeCwgeSArIDAuNSwgZGFtYWdlLCAnI2ZmMDAwMCcsIDEuMjUsIDAsIC0xKTtcclxuXHR9XHJcblxyXG5cdHNwYXduRWZmZWN0KG1hcElkLCB4LCB5LCBzcHJpdGUsIGxvb3AsIHNwZWVkLCBtYXhGcmFtZSwgc3RhcnRGcmFtZSkge1xyXG5cdFx0bmV3IEVmZmVjdChtYXBJZCwgeCwgeSwgc3ByaXRlLCBsb29wLCBzcGVlZCwgbWF4RnJhbWUsIHN0YXJ0RnJhbWUpO1xyXG5cdH1cclxufVxyXG5cclxuY29uc3QgZ2FtZSA9IG5ldyBHYW1lKCk7XHJcbmV4cG9ydCBkZWZhdWx0IGdhbWU7XHJcbiIsIi8qKiogR2FtZSBMb29wICoqKi9cclxuLyogS2VlcHMgdHJhY2sgb2YgdGltZSBhbmQgY28tb3JkaW5hdGVzIHRoZSBnYW1lIGFuZCBzZXJ2ZXIgKi9cclxuXHJcbmltcG9ydCBOb2RlR2FtZUxvb3AgZnJvbSAnbm9kZS1nYW1lbG9vcCc7XHJcblxyXG5pbXBvcnQgZGIgZnJvbSAnLi9kYi5qcyc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4vZ2FtZS5qcyc7XHJcbmltcG9ydCBzZXJ2ZXIgZnJvbSAnLi9zZXJ2ZXIuanMnO1xyXG5pbXBvcnQgY29uZmlnIGZyb20gJy4vY29uZmlnLmpzJztcclxuXHJcbmNsYXNzIEdhbWVMb29wIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHRoaXMudGltZXIgPSB7XHJcblx0XHRcdGJhY2t1cDogMCxcclxuXHRcdFx0bWludXRlOiAwXHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuaWQgPSBOb2RlR2FtZUxvb3Auc2V0R2FtZUxvb3AoKGRlbHRhKSA9PiB0aGlzLnVwZGF0ZShkZWx0YSksIGNvbmZpZy5GUkFNRVJBVEUpO1xyXG5cdH1cclxuXHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHQvLyBJbmNyZWFzZSBUaW1lcnNcclxuXHRcdHRoaXMudGltZXIuYmFja3VwICs9IGRlbHRhO1xyXG5cdFx0dGhpcy50aW1lci5taW51dGUgKz0gZGVsdGE7XHJcblxyXG5cdFx0Ly8gVXBkYXRlIHRoZSBnYW1lIHN0YXRlXHJcblx0XHRsZXQgdXBkYXRlUGFjayA9IGdhbWUudXBkYXRlKGRlbHRhKTtcclxuXHRcdC8vIFNlbmQgdXBkYXRlZCBzdGF0ZSB0byBjbGllbnRzXHJcblx0XHRzZXJ2ZXIuc2VuZFVwZGF0ZVBhY2sodXBkYXRlUGFjayk7XHJcblx0XHRcclxuXHRcdC8vIE1pbnV0ZSB0aW1lciBzY3JpcHRcclxuXHRcdGlmICh0aGlzLnRpbWVyLm1pbnV0ZSA+PSA2MCkge1xyXG5cdFx0XHR0aGlzLnRpbWVyLm1pbnV0ZSAtPSA2MDtcclxuXHRcdFx0Ly8gVE9ETzogcnVuIG1pbnV0ZSB0aW1lciBzY3JpcHRcclxuXHRcdH1cclxuXHJcblx0XHQvLyBQZXJpb2RpYyBiYWNrdXAgdG8gZGF0YWJhc2VcclxuXHRcdGlmICh0aGlzLnRpbWVyLmJhY2t1cCA+PSBjb25maWcuQkFDS1VQX1RJTUUpIHtcclxuXHRcdFx0dGhpcy50aW1lci5iYWNrdXAgLT0gY29uZmlnLkJBQ0tVUF9USU1FO1xyXG5cdFx0XHRkYi5iYWNrdXAoKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmNvbnN0IGdhbWVMb29wID0gbmV3IEdhbWVMb29wKCk7XHJcbmV4cG9ydCBkZWZhdWx0IGdhbWVMb29wO1xyXG4iLCJpbXBvcnQgZGIgZnJvbSAnLi9kYi5qcyc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4vZ2FtZS5qcyc7XHJcbmltcG9ydCBzZXJ2ZXIgZnJvbSAnLi9zZXJ2ZXIuanMnO1xyXG5pbXBvcnQgZ2FtZWxvb3AgZnJvbSAnLi9nYW1lbG9vcC5qcyc7XHJcbiIsImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XHJcblxyXG5jb25zdCBhY2NvdW50U2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYSh7XHJcbiAgX2lkOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCxcclxuICB1c2VybmFtZToge3R5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUsIHVuaXF1ZTogdHJ1ZX0sXHJcbiAgcGFzc3dvcmQ6IHt0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlfSxcclxuICBlbWFpbDoge3R5cGU6IFN0cmluZywgdW5pcXVlOiB0cnVlLCBzcGFyc2U6IHRydWUsIG1hdGNoOiAvXigoW148PigpXFxbXFxdXFxcXC4sOzpcXHNAXCJdKyhcXC5bXjw+KClcXFtcXF1cXFxcLiw7Olxcc0BcIl0rKSopfChcIi4rXCIpKUAoKFxcW1swLTldezEsM31cXC5bMC05XXsxLDN9XFwuWzAtOV17MSwzfVxcLlswLTldezEsM31dKXwoKFthLXpBLVpcXC0wLTldK1xcLikrW2EtekEtWl17Mix9KSkkL30sXHJcbiAgdmVyaWZpZWQ6IHt0eXBlOiBCb29sZWFuLCBkZWZhdWx0OiBmYWxzZX1cclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBtb25nb29zZS5tb2RlbCgnQWNjb3VudCcsIGFjY291bnRTY2hlbWEpO1xyXG4iLCJpbXBvcnQgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xyXG5cclxuY29uc3QgYm90VGVtcGxhdGVTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcclxuICBfaWQ6IG1vbmdvb3NlLlNjaGVtYVR5cGVzLk9iamVjdElkLFxyXG4gIG5hbWU6IHt0eXBlOiBTdHJpbmcsIGRlZmF1bHQ6IFwiQm90XCJ9LFxyXG4gIHNwcml0ZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMX0sXHJcbiAgZGFtYWdlQmFzZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcbiAgZGVmZW5jZUJhc2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG4gIGhlYWx0aE1heEJhc2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDF9LFxyXG4gIGVuZXJneU1heEJhc2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDF9LFxyXG4gIHJhbmdlQmFzZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMX0sXHJcbiAgaG9zdGlsZToge3R5cGU6IEJvb2xlYW4sIGRlZmF1bHQ6IHRydWV9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWwoJ0JvdFRlbXBsYXRlJywgYm90VGVtcGxhdGVTY2hlbWEpO1xyXG4iLCJpbXBvcnQgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xyXG5cclxuY29uc3QgaXRlbVRlbXBsYXRlU2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYSh7XHJcblx0X2lkOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCxcclxuXHRuYW1lOiB7dHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZX0sXHJcblx0c3ByaXRlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuXHRyZXVzYWJsZToge3R5cGU6IEJvb2xlYW4sIGRlZmF1bHQ6IHRydWV9LFxyXG5cdHR5cGU6IHt0eXBlOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCwgcmVmOiAnSXRlbVR5cGUnLCByZXF1aXJlZDogdHJ1ZX0sXHJcblx0cGFzc2l2ZURhbWFnZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcblx0cGFzc2l2ZURlZmVuY2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG5cdHBhc3NpdmVIZWFsdGhNYXg6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG5cdHBhc3NpdmVFbmVyZ3lNYXg6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG5cdHBhc3NpdmVSYW5nZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcblx0ZXF1aXBwZWREYW1hZ2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG5cdGVxdWlwcGVkRGVmZW5jZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcblx0ZXF1aXBwZWRIZWFsdGhNYXg6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG5cdGVxdWlwcGVkRW5lcmd5TWF4OiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuXHRlcXVpcHBlZFJhbmdlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfVxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1vbmdvb3NlLm1vZGVsKCdJdGVtVGVtcGxhdGUnLCBpdGVtVGVtcGxhdGVTY2hlbWEpO1xyXG4iLCJpbXBvcnQgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xyXG5cclxuY29uc3QgaXRlbVR5cGVTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcclxuXHRfaWQ6IG1vbmdvb3NlLlNjaGVtYVR5cGVzLk9iamVjdElkLFxyXG5cdG5hbWU6IHt0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlfSxcclxuXHRlcXVpcHBlZFNsb3Q6IHt0eXBlOiBOdW1iZXIsIHJlcXVpcmVkOiB0cnVlfSxcclxuXHRzdGFja2FibGU6IHt0eXBlOiBCb29sZWFuLCByZXF1aXJlZDogdHJ1ZX1cclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBtb25nb29zZS5tb2RlbCgnSXRlbVR5cGUnLCBpdGVtVHlwZVNjaGVtYSk7XHJcbiIsImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XHJcblxyXG5jb25zdCBtYXBTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcclxuXHRfaWQ6IG1vbmdvb3NlLlNjaGVtYVR5cGVzLk9iamVjdElkLFxyXG5cdG1hcElkOiBOdW1iZXIsXHJcblx0bmFtZToge3R5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWV9LFxyXG5cdGRyb3BDaGFuY2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDEwMH0sXHJcblx0ZHJvcEFtb3VudEVROiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuXHR0aWxlczoge3R5cGU6IFtbW051bWJlcl1dXSwgZGVmYXVsdDogW1tbXV1dfSxcclxuXHRpc1dhbGw6IHt0eXBlOiBbW0Jvb2xlYW5dXSwgZGVmYXVsdDogZmFsc2V9LFxyXG5cdGlzSG9zdGlsZToge3R5cGU6IFtbQm9vbGVhbl1dLCBkZWZhdWx0OiBmYWxzZX0sXHJcblx0ZGFtYWdlOiB7dHlwZTogW1tOdW1iZXJdXSwgZGVmYXVsdDogbnVsbH0sXHJcblx0d2FycE1hcDoge3R5cGU6IFtbTnVtYmVyXV0sIGRlZmF1bHQ6IG51bGx9LFxyXG5cdHdhcnBYOiB7dHlwZTogW1tOdW1iZXJdXSwgZGVmYXVsdDogbnVsbH0sXHJcblx0d2FycFk6IHt0eXBlOiBbW051bWJlcl1dLCBkZWZhdWx0OiBudWxsfVxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1vbmdvb3NlLm1vZGVsKCdNYXAnLCBtYXBTY2hlbWEpO1xyXG4iLCJpbXBvcnQgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xyXG5cclxuY29uc3QgcGxheWVyU2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYSh7XHJcbiAgX2lkOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCxcclxuICBhY2NvdW50OiB7dHlwZTogbW9uZ29vc2UuU2NoZW1hVHlwZXMuT2JqZWN0SWQsIHJlZjogJ0FjY291bnQnLCByZXF1aXJlZDogdHJ1ZX0sXHJcbiAgbmFtZToge3R5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUsIHVuaXF1ZTogdHJ1ZX0sXHJcbiAgdGVtcGxhdGU6IHt0eXBlOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCwgcmVmOiAnUGxheWVyVGVtcGxhdGUnLCByZXF1aXJlZDogdHJ1ZX0sXHJcbiAgbGV2ZWw6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDF9LFxyXG4gIGV4cGVyaWVuY2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG4gIG1hcElkOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuICB4OiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiA1fSxcclxuICB5OiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiA1fSxcclxuICBkaXJlY3Rpb246IHt0eXBlOiBTdHJpbmcsIGRlZmF1bHQ6ICdkb3duJ30sXHJcbiAgYWRtaW5BY2Nlc3M6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG4gIHNwcml0ZTogTnVtYmVyXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWwoJ1BsYXllcicsIHBsYXllclNjaGVtYSk7XHJcbiIsImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XHJcblxyXG5jb25zdCBwbGF5ZXJUZW1wbGF0ZVNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoe1xyXG4gIF9pZDogbW9uZ29vc2UuU2NoZW1hVHlwZXMuT2JqZWN0SWQsXHJcbiAgbmFtZToge3R5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUsIHVuaXF1ZTogdHJ1ZX0sXHJcbiAgc3ByaXRlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuICBkYW1hZ2VCYXNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuICBkZWZlbmNlQmFzZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcbiAgaGVhbHRoTWF4QmFzZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMX0sXHJcbiAgZW5lcmd5TWF4QmFzZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMX0sXHJcbiAgcmFuZ2VCYXNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuICBoZWFsdGhQZXJMZXZlbDoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcbiAgZW5lcmd5UGVyTGV2ZWw6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWwoJ1BsYXllclRlbXBsYXRlJywgcGxheWVyVGVtcGxhdGVTY2hlbWEpO1xyXG4iLCJpbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcclxuaW1wb3J0IGh0dHAgZnJvbSAnaHR0cCc7XHJcbmltcG9ydCBzb2NrZXRJTyBmcm9tICdzb2NrZXQuaW8nO1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuXHJcbmltcG9ydCBkYiBmcm9tICcuL2RiLmpzJztcclxuaW1wb3J0IGdhbWUgZnJvbSAnLi9nYW1lLmpzJztcclxuaW1wb3J0IGNvbmZpZyBmcm9tICcuL2NvbmZpZy5qcyc7XHJcblxyXG5jbGFzcyBTZXJ2ZXIge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0Y29uc3QgYXBwID0gZXhwcmVzcygpO1xyXG5cdFx0Y29uc3QgaHR0cFNlcnZlciA9IGh0dHAuU2VydmVyKGFwcCk7XHJcblx0XHRjb25zdCBpbyA9IHNvY2tldElPKGh0dHBTZXJ2ZXIpO1xyXG5cdFx0Y29uc3QgcG9ydCA9IHByb2Nlc3MuZW52LlBPUlQgfHwgY29uZmlnLlBPUlQ7XHJcblx0XHRjb25zdCBwdWJsaWNQYXRoID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uL2NsaWVudCcpO1xyXG5cdFx0XHJcblx0XHRhcHAuZ2V0KCcvJywgKHJlcSwgcmVzKSA9PiByZXMuc2VuZEZpbGUocHVibGljUGF0aCArICcvaW5kZXguaHRtbCcpKTtcclxuXHRcdGFwcC51c2UoJy9jbGllbnQnLCBleHByZXNzLnN0YXRpYyhwdWJsaWNQYXRoKSk7XHJcblx0XHRodHRwU2VydmVyLmxpc3Rlbihwb3J0LCAoKSA9PiBkYi5sb2coYFNlcnZlciBzdGFydGVkLiBMaXN0ZW5pbmcgb24gcG9ydCAke2h0dHBTZXJ2ZXIuYWRkcmVzcygpLnBvcnR9Li4uYCkpO1xyXG5cclxuXHRcdHRoaXMuc29ja2V0TGlzdCA9IHt9O1xyXG5cdFx0dGhpcy5hY3RpdmVBY2NvdW50cyA9IHt9O1xyXG5cclxuXHRcdGlvLnNvY2tldHMub24oJ2Nvbm5lY3Rpb24nLCBzb2NrZXQgPT4gdGhpcy5vbkNvbm5lY3Qoc29ja2V0KSk7XHJcblx0fVxyXG5cclxuXHQvKiBjb25uZWN0ID0+IHNpZ25pbiA9PiBzZWxlY3RwbGF5ZXJcclxuXHQqKiBjb25uZWN0IHdoZW4gcGFnZSBsb2FkcyAtIHNob3dzIHNpZ25pbiBwYWdlXHJcblx0Kiogc2lnbmluIHdoZW4gdXNlcm5hbWUgYW5kIHBhc3N3b3JkIGlzIHN1Ym1pdHRlZFxyXG4gXHQqKiBzZWxlY3RwbGF5ZXIgd2hlbiBjaGFyYWN0ZXIgaXMgY2hvc2VuIC0gbG9ncyBpbnRvIHRoZSBnYW1lXHJcblx0Ki9cclxuXHJcblx0Ly8gUmVjZWl2ZSBkYXRhIGZyb20gY2xpZW50c1xyXG5cdG9uQ29ubmVjdChzb2NrZXQpIHtcclxuXHRcdHRoaXMuc29ja2V0TGlzdFtzb2NrZXQuaWRdID0gc29ja2V0O1xyXG5cdFx0ZGIubG9nKGAke3NvY2tldC5pZH0gLSBTb2NrZXQgY29ubmVjdGVkLmApO1xyXG5cdFx0XHJcblx0XHRzb2NrZXQub24oJ2Rpc2Nvbm5lY3QnLCAoKSA9PiB0aGlzLm9uRGlzY29ubmVjdChzb2NrZXQpKTtcclxuXHRcdHNvY2tldC5vbignc2lnbnVwJywgKGRhdGEpID0+IHRoaXMub25TaWduVXAoZGF0YS51c2VybmFtZSwgZGF0YS5wYXNzd29yZCwgZGF0YS5lbWFpbCkpO1xyXG5cdFx0c29ja2V0Lm9uKCdzaWduaW4nLCAoZGF0YSkgPT4gdGhpcy5vblNpZ25Jbihzb2NrZXQsIGRhdGEudXNlcm5hbWUsIGRhdGEucGFzc3dvcmQpKTtcclxuXHRcdHNvY2tldC5vbignc2lnbm91dCcsICgpID0+IHRoaXMub25TaWduT3V0KHNvY2tldCkpO1xyXG5cdFx0Ly8gVGVsbCBjbGllbnQgdGhleSBoYXZlIGNvbm5lY3RlZFxyXG5cdH1cclxuXHJcblx0YXN5bmMgb25EaXNjb25uZWN0KHNvY2tldCkge1xyXG5cdFx0aWYgKHNvY2tldC5wbGF5ZXJJZCAhPSBudWxsICYmIGdhbWUucGxheWVyc1tzb2NrZXQucGxheWVySWRdKSBhd2FpdCB0aGlzLm9uTG9nT3V0KHNvY2tldCk7XHJcblx0XHRpZiAoc29ja2V0LmFjY291bnRJZCAmJiB0aGlzLmFjdGl2ZUFjY291bnRzW3NvY2tldC5hY2NvdW50SWRdKSBhd2FpdCB0aGlzLm9uU2lnbk91dChzb2NrZXQpO1xyXG5cclxuXHRcdGRiLmxvZyhgJHtzb2NrZXQuaWR9IC0gU29ja2V0IGRpc2Nvbm5lY3RlZC5gKTtcclxuXHRcdGRlbGV0ZSB0aGlzLnNvY2tldExpc3Rbc29ja2V0LmlkXTtcclxuXHR9XHJcblxyXG5cdGFzeW5jIG9uU2lnblVwKHVzZXJuYW1lLCBwYXNzd29yZCwgZW1haWwpIHtcclxuXHRcdGxldCBzdWNjZXNzID0gYXdhaXQgZGIuYWRkQWNjb3VudCh1c2VybmFtZSwgcGFzc3dvcmQsIGVtYWlsKTtcclxuXHRcdGlmIChzdWNjZXNzKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiVGVsbCBjbGllbnQgc2lnbnVwIHdhcyBzdWNjZXNzZnVsXCIpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiVGVsbCBjbGllbnQgc2lnbnVwIHdhcyBub3Qgc3VjY2Vzc2Z1bFwiKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGFzeW5jIG9uU2lnbkluKHNvY2tldCwgdXNlcm5hbWUsIHBhc3N3b3JkKSB7XHJcblx0XHRsZXQgc3VjY2VzcyA9IGF3YWl0IGRiLmF1dGhBY2NvdW50KHVzZXJuYW1lLCBwYXNzd29yZCk7XHJcblx0XHRpZiAoIXN1Y2Nlc3MpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coYFNpZ24gaW4gZmFpbGVkIG9uIHVzZXJuYW1lICR7dXNlcm5hbWV9YCk7XHJcblx0XHRcdHNvY2tldC5lbWl0KCdzaWduZWRJbicsIGZhbHNlKTtcdC8vIFRlbGwgY2xpZW50IHNpZ25pbiB3YXMgbm90IHN1Y2Nlc3NmdWxcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBhY2NvdW50ID0gYXdhaXQgZGIuZ2V0QWNjb3VudEJ5VXNlcm5hbWUodXNlcm5hbWUpO1xyXG5cdFx0aWYgKHRoaXMuYWN0aXZlQWNjb3VudHNbYWNjb3VudC5faWRdKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiVGhhdCBhY2NvdW50IGlzIGFscmVhZHkgc2lnbmVkIGluLlwiKTtcclxuXHRcdFx0c29ja2V0LmVtaXQoJ3NpZ25lZEluJywgZmFsc2UpO1x0Ly8gVGVsbCBjbGllbnQgdGhhdCBhY2NvdW50IGlzIGFscmVhZHkgc2lnbmVkIGluXHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0c29ja2V0LmFjY291bnRJZCA9IGFjY291bnQuX2lkO1xyXG5cdFx0dGhpcy5hY3RpdmVBY2NvdW50c1thY2NvdW50Ll9pZF0gPSB1c2VybmFtZTtcclxuXHJcblx0XHRzb2NrZXQub24oJ2FkZFBsYXllcicsIChkYXRhKSA9PiB0aGlzLm9uQWRkUGxheWVyKHNvY2tldCwgZGF0YS5uYW1lLCBkYXRhLnRlbXBsYXRlTmFtZSkpO1xyXG5cdFx0c29ja2V0Lm9uKCdsb2dpbicsIChuYW1lKSA9PiB0aGlzLm9uTG9nSW4oc29ja2V0LCBuYW1lKSk7XHJcblx0XHRzb2NrZXQub24oJ2xvZ291dCcsICgpID0+IHRoaXMub25Mb2dPdXQoc29ja2V0KSk7XHJcblx0XHRzb2NrZXQub24oJ2FkZFBsYXllclRlbXBsYXRlJywgKGRhdGEpID0+IHRoaXMub25BZGRQbGF5ZXJUZW1wbGF0ZShkYXRhKSk7XHJcblxyXG5cdFx0ZGIubG9nKGAke3NvY2tldC5pZH0gLSAke3VzZXJuYW1lfSBzaWduZWQgaW4uYCk7XHJcblx0XHRsZXQgcGxheWVycyA9IGF3YWl0IGRiLmdldFBsYXllcnNCeUFjY291bnQoYWNjb3VudC5faWQpO1xyXG5cdFx0c29ja2V0LmVtaXQoJ3NpZ25lZEluJywge1xyXG5cdFx0XHRhY2NvdW50LFxyXG5cdFx0XHRwbGF5ZXJzXHJcblx0XHR9KTtcclxuXHR9XHJcblx0XHJcblx0YXN5bmMgb25TaWduT3V0KHNvY2tldCkge1xyXG5cdFx0aWYgKHNvY2tldC5wbGF5ZXJJZCAhPSBudWxsKSBhd2FpdCB0aGlzLm9uTG9nT3V0KHNvY2tldCk7XHJcblx0XHRcclxuXHRcdGlmIChzb2NrZXQuYWNjb3VudElkKSB7XHJcblx0XHRcdGNvbnN0IHVzZXJuYW1lID0gdGhpcy5hY3RpdmVBY2NvdW50c1tzb2NrZXQuYWNjb3VudElkXTtcclxuXHRcdFx0ZGIubG9nKGAke3NvY2tldC5pZH0gLSAke3VzZXJuYW1lfSBzaWduZWQgb3V0LmApO1xyXG5cdFx0XHRkZWxldGUgdGhpcy5hY3RpdmVBY2NvdW50c1tzb2NrZXQuYWNjb3VudElkXTtcclxuXHRcdFx0c29ja2V0LmFjY291bnRJZCA9IG51bGw7XHJcblx0XHRcdHNvY2tldC5lbWl0KCdzaWduZWRPdXQnKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGFzeW5jIG9uQWRkUGxheWVyKHNvY2tldCwgbmFtZSwgdGVtcGxhdGVJZCkge1xyXG5cdFx0bGV0IHN1Y2Nlc3MgPSBhd2FpdCBkYi5hZGRQbGF5ZXIoc29ja2V0LmFjY291bnRJZCwgbmFtZSwgdGVtcGxhdGVJZCk7XHJcblx0XHRpZiAoc3VjY2Vzcykge1xyXG5cdFx0XHRjb25zdCB1c2VybmFtZSA9IHRoaXMuYWN0aXZlQWNjb3VudHNbc29ja2V0LmFjY291bnRJZF07XHJcblx0XHRcdGRiLmxvZyhgJHtzb2NrZXQuaWR9IC0gJHtuYW1lfSBoYXMgYmVlbiBhZGRlZCBhcyBhIHBsYXllciB0byBhY2NvdW50ICR7dXNlcm5hbWV9LmApO1xyXG5cdFx0XHQvLyBUZWxsIGNsaWVudCBhZGQgcGxheWVyIHdhcyBzdWNjZXNzZnVsXHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Ly8gVGVsbCBjbGllbnQgYWRkIHBsYXllciB3YXMgbm90IHN1Y2Nlc3NmdWxcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0YXN5bmMgb25BZGRQbGF5ZXJUZW1wbGF0ZShkYXRhKSB7XHJcblx0XHRsZXQgc3VjY2VzcyA9IGF3YWl0IGRiLmFkZFBsYXllclRlbXBsYXRlKGRhdGEpO1xyXG5cdFx0aWYgKHN1Y2Nlc3MpIHtcclxuXHRcdFx0Z2FtZS5sb2FkUGxheWVyVGVtcGxhdGVzKCk7XHJcblx0XHRcdGRiLmxvZyhgJHtzb2NrZXQuaWR9IC0gJHtkYXRhLm5hbWV9IGhhcyBiZWVuIGFkZGVkIGFzIGEgcGxheWVyIHRlbXBsYXRlLmApO1xyXG5cdFx0XHQvLyBUZWxsIGNsaWVudCBhZGQgcGxheWVyIHdhcyBzdWNjZXNzZnVsXHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Ly8gVGVsbCBjbGllbnQgYWRkIHBsYXllciB3YXMgbm90IHN1Y2Nlc3NmdWxcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGFzeW5jIG9uTG9nSW4oc29ja2V0LCBuYW1lKSB7XHJcblx0XHRpZiAoIXNvY2tldC5hY2NvdW50SWQpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJOb3Qgc2lnbmVkIGludG8gYWNjb3VudC5cIik7XHJcblx0XHRcdHNvY2tldC5lbWl0KCdsb2dnZWRJbicsIGZhbHNlKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHNvY2tldC5wbGF5ZXJJZCAhPSBudWxsKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiQWxyZWFkeSBsb2dnZWQgaW4uXCIpO1xyXG5cdFx0XHRzb2NrZXQuZW1pdCgnbG9nZ2VkSW4nLCBmYWxzZSk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgcGxheWVyRGF0YSA9IGF3YWl0IGRiLmdldFBsYXllcihuYW1lKTtcclxuXHRcdGlmICghcGxheWVyRGF0YSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIk5vIHBsYXllciB3aXRoIHRoYXQgbmFtZS5cIik7XHJcblx0XHRcdHNvY2tldC5lbWl0KCdsb2dnZWRJbicsIGZhbHNlKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChcIlwiK3NvY2tldC5hY2NvdW50SWQgIT09IFwiXCIrcGxheWVyRGF0YS5hY2NvdW50KSB7XHQvLyBDYXN0IHRvIHN0cmluZyBiZWZvcmUgY29tcGFyaXNvblxyXG5cdFx0XHRkYi5sb2coYEF0dGVtcHQgdG8gbG9naW4gdG8gcGxheWVyICgke3BsYXllckRhdGEubmFtZX0pIGZyb20gd3JvbmcgYWNjb3VudCAoJHtzb2NrZXQuYWNjb3VudElkfSkgb24gc29ja2V0ICR7c29ja2V0LmlkfS5gKTtcclxuXHRcdFx0c29ja2V0LmVtaXQoJ2xvZ2dlZEluJywgZmFsc2UpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgcGxheWVyID0gZ2FtZS5wbGF5ZXJMb2dpbihzb2NrZXQuaWQsIHBsYXllckRhdGEpO1xyXG5cdFx0aWYgKCFwbGF5ZXIpIHtcclxuXHRcdFx0c29ja2V0LmVtaXQoJ2xvZ2dlZEluJywgZmFsc2UpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHJcblx0XHRzb2NrZXQucGxheWVySWQgPSBwbGF5ZXIuZ2FtZUlkO1xyXG5cdFx0c29ja2V0Lm9uKCdpbnB1dCcsIChkYXRhKSA9PiBwbGF5ZXIuaW5wdXREYXRhKGRhdGEpKTtcclxuXHRcdHNvY2tldC5vbigndXBsb2FkTWFwJywgKGRhdGEpID0+IHtcclxuXHRcdFx0aWYgKHBsYXllci5hZG1pbkFjY2VzcyA+PSAyKSB0aGlzLm9uVXBsb2FkTWFwKGRhdGEpO1xyXG5cdFx0XHRlbHNlIGdhbWUuc2VuZEdhbWVJbmZvUGxheWVyKHBsYXllci5nYW1lSWQsIGBZb3UgZG9uJ3QgaGF2ZSBhY2Nlc3MgdG8gdGhhdCBjb21tYW5kLmApO1xyXG5cdFx0fSk7XHJcblx0XHRjb25zdCBtYXBEYXRhID0gZ2FtZS5tYXBzW3BsYXllci5tYXBJZF0uZ2V0UGFjaygpO1xyXG5cdFx0c29ja2V0LmVtaXQoJ2xvZ2dlZEluJywgbWFwRGF0YSk7XHJcblx0fVxyXG5cdFxyXG5cdGFzeW5jIG9uTG9nT3V0KHNvY2tldCkge1xyXG5cdFx0aWYgKHNvY2tldC5wbGF5ZXJJZCAhPSBudWxsKSB7XHJcblx0XHRcdGF3YWl0IGdhbWUucGxheWVyTG9nb3V0KHNvY2tldC5wbGF5ZXJJZCk7XHJcblx0XHRcdHNvY2tldC5wbGF5ZXJJZCA9IG51bGw7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGFzeW5jIG9uVXBsb2FkTWFwKGRhdGEpIHtcclxuXHRcdGxldCBzdWNjZXNzID0gYXdhaXQgZGIuc2F2ZU1hcChkYXRhKTtcclxuXHRcdGlmICghc3VjY2Vzcykge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIkZhaWxlZCB0byB1cGxvYWQgbWFwLlwiKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0Z2FtZS5tYXBzW2RhdGEubWFwSWRdLnVwbG9hZChkYXRhKTtcclxuXHRcdFxyXG5cdFx0Z2FtZS5wbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xyXG5cdFx0XHRpZiAocGxheWVyLm1hcElkID09PSBkYXRhLm1hcElkKSB7XHJcblx0XHRcdFx0dGhpcy5zZW5kTWFwRGF0YSh0aGlzLnNvY2tldExpc3RbcGxheWVyLnNvY2tldElkXSwgcGxheWVyLm1hcElkKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHQvLyBTZW5kIGRhdGEgdG8gY2xpZW50c1xyXG5cdHNlbmRVcGRhdGVQYWNrKHVwZGF0ZVBhY2spIHtcclxuXHRcdGdhbWUucGxheWVycy5mb3JFYWNoKHBsYXllciA9PiB7XHJcblx0XHRcdGNvbnN0IHBhY2sgPSB7XHJcblx0XHRcdFx0Z2FtZToge1xyXG5cdFx0XHRcdFx0cGxheWVyczogW10sXHJcblx0XHRcdFx0XHRib3RzOiBbXSxcclxuXHRcdFx0XHRcdGl0ZW1zOiBbXSxcclxuXHRcdFx0XHRcdGVmZmVjdHM6IFtdLFxyXG5cdFx0XHRcdFx0dGV4dHM6IFtdXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRtZW51OiBwbGF5ZXIuZ2V0VUlQYWNrKCksXHJcblx0XHRcdFx0Y2hhdGJveDoge31cclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdGZvciAobGV0IHBsYXllckRhdGEgb2YgdXBkYXRlUGFjay5wbGF5ZXJzKSB7XHJcblx0XHRcdFx0aWYgKHBsYXllckRhdGEgJiYgKChwbGF5ZXJEYXRhLm1hcElkID09PSBwbGF5ZXIubWFwSWQgJiYgcGxheWVyRGF0YS5pc1Zpc2libGUpIHx8IHBsYXllckRhdGEuc29ja2V0SWQgPT09IHBsYXllci5zb2NrZXRJZCkpIHtcclxuXHRcdFx0XHRcdHBhY2suZ2FtZS5wbGF5ZXJzW3BsYXllckRhdGEuZ2FtZUlkXSA9IHBsYXllckRhdGE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGZvciAobGV0IGJvdCBvZiB1cGRhdGVQYWNrLmJvdHMpIHtcclxuXHRcdFx0XHRpZiAoYm90ICYmIGJvdC5tYXBJZCA9PT0gcGxheWVyLm1hcElkKSBwYWNrLmdhbWUuYm90c1tib3QuZ2FtZUlkXSA9IGJvdDtcclxuXHRcdFx0fVxyXG5cdFx0XHRmb3IgKGxldCBpdGVtIG9mIHVwZGF0ZVBhY2suaXRlbXMpIHtcclxuXHRcdFx0XHRpZiAoaXRlbSAmJiBpdGVtLm1hcElkID09PSBwbGF5ZXIubWFwSWQpIHBhY2suZ2FtZS5pdGVtc1tpdGVtLmdhbWVJZF0gPSBpdGVtO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZvciAobGV0IGVmZmVjdCBvZiB1cGRhdGVQYWNrLmVmZmVjdHMpIHtcclxuXHRcdFx0XHRpZiAoZWZmZWN0ICYmIGVmZmVjdC5tYXBJZCA9PT0gcGxheWVyLm1hcElkKSBwYWNrLmdhbWUuZWZmZWN0c1tlZmZlY3QuZ2FtZUlkXSA9IGVmZmVjdDtcclxuXHRcdFx0fVxyXG5cdFx0XHRmb3IgKGxldCB0ZXh0IG9mIHVwZGF0ZVBhY2sudGV4dHMpIHtcclxuXHRcdFx0XHRpZiAodGV4dCAmJiB0ZXh0Lm1hcElkID09PSBwbGF5ZXIubWFwSWQpIHBhY2suZ2FtZS50ZXh0c1t0ZXh0LmdhbWVJZF0gPSB0ZXh0O1xyXG5cdFx0XHR9XHJcblxyXG5cclxuLyogXHRcdFx0cGFjay5nYW1lLnBsYXllcnMgPSB1cGRhdGVQYWNrLnBsYXllcnMuZmlsdGVyKHBsYXllckRhdGEgPT4gcGxheWVyRGF0YS5zb2NrZXRJZCA9PT0gcGxheWVyLnNvY2tldElkIHx8IChwbGF5ZXJEYXRhLm1hcElkID09PSBwbGF5ZXIubWFwSWQgJiYgcGxheWVyRGF0YS5pc1Zpc2libGUpKTtcclxuXHRcdFx0cGFjay5nYW1lLmJvdHMgPSB1cGRhdGVQYWNrLmJvdHMuZmlsdGVyKGJvdCA9PiBib3QubWFwSWQgPT09IHBsYXllci5tYXBJZCk7XHJcblx0XHRcdHBhY2suZ2FtZS5pdGVtcyA9IHVwZGF0ZVBhY2suaXRlbXMuZmlsdGVyKGl0ZW0gPT4gaXRlbS5tYXBJZCA9PT0gcGxheWVyLm1hcElkKTtcclxuXHRcdFx0cGFjay5nYW1lLmVmZmVjdHMgPSB1cGRhdGVQYWNrLmVmZmVjdHMuZmlsdGVyKGVmZmVjdCA9PiBlZmZlY3QubWFwSWQgPT09IHBsYXllci5tYXBJZCk7XHJcblx0XHRcdHBhY2suZ2FtZS50ZXh0cyA9IHVwZGF0ZVBhY2sudGV4dHMuZmlsdGVyKHRleHQgPT4gdGV4dC5tYXBJZCA9PT0gcGxheWVyLm1hcElkKTsgKi9cclxuXHJcblx0XHRcdHBhY2suY2hhdGJveC5tZXNzYWdlcyA9IHVwZGF0ZVBhY2subWVzc2FnZXMuZmlsdGVyKG1lc3NhZ2UgPT4ge1xyXG5cdFx0XHRcdHJldHVybiAobWVzc2FnZS5tYXBJZCA9PSBudWxsICYmIG1lc3NhZ2UuaWQgPT0gbnVsbCkgfHwgcGxheWVyLm1hcElkID09PSBtZXNzYWdlLm1hcElkIHx8IHBsYXllci5nYW1lSWQgPT09IG1lc3NhZ2UuaWQ7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRcclxuXHRcdFx0dGhpcy5zb2NrZXRMaXN0W3BsYXllci5zb2NrZXRJZF0uZW1pdCgndXBkYXRlJywgcGFjayk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0XHJcblx0c2VuZE1hcERhdGEoc29ja2V0LCBtYXBJZCkge1xyXG5cdFx0Y29uc3QgbWFwRGF0YSA9IGdhbWUubWFwc1ttYXBJZF0uZ2V0UGFjaygpO1xyXG5cdFx0c29ja2V0LmVtaXQoJ2xvYWRNYXAnLCBtYXBEYXRhKTtcclxuXHR9XHJcbn1cclxuXHJcbmNvbnN0IHNlcnZlciA9IG5ldyBTZXJ2ZXIoKTtcclxuZXhwb3J0IGRlZmF1bHQgc2VydmVyO1xyXG4iLCJmdW5jdGlvbiBjcmVhdGUyZEFycmF5KGNvbHVtbnMsIHJvd3MsIGRlZmF1bHRWYWx1ZSkge1xyXG4gIGNvbnN0IGFycmF5ID0gW107XHJcbiAgZm9yIChsZXQgeSA9IDA7IHkgPCByb3dzOyB5KyspIHtcclxuICAgIGFycmF5W3ldID0gW107XHJcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IGNvbHVtbnM7IHgrKykge1xyXG4gICAgICBhcnJheVt5XVt4XSA9IGRlZmF1bHRWYWx1ZTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGFycmF5O1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGUzZEFycmF5KGNvbHVtbnMsIHJvd3MsIGxheWVycywgZGVmYXVsdFZhbHVlKSB7XHJcbiAgY29uc3QgYXJyYXkgPSBbXTtcclxuICBmb3IgKGxldCB6ID0gMDsgeiA8IGxheWVyczsgeisrKSB7XHJcbiAgICBhcnJheVt6XSA9IFtdOyBcclxuICAgIGZvciAobGV0IHkgPSAwOyB5IDwgcm93czsgeSsrKSB7XHJcbiAgICAgIGFycmF5W3pdW3ldID0gW107XHJcbiAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgY29sdW1uczsgeCsrKSB7XHJcbiAgICAgICAgYXJyYXlbel1beV1beF0gPSBkZWZhdWx0VmFsdWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGFycmF5O1xyXG59XHJcblxyXG5mdW5jdGlvbiBzaHVmZmxlKGFycmF5KSB7XHJcbiAgbGV0IGN1cnJlbnRJbmRleCA9IGFycmF5Lmxlbmd0aDtcclxuICBsZXQgdGVtcDtcclxuICBsZXQgcmFuZG9tSW5kZXg7XHJcbiAgd2hpbGUgKGN1cnJlbnRJbmRleCAhPT0gMCkge1xyXG4gICAgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyZW50SW5kZXgpO1xyXG4gICAgY3VycmVudEluZGV4IC09IDE7XHJcbiAgICB0ZW1wID0gYXJyYXlbY3VycmVudEluZGV4XTtcclxuICAgIGFycmF5W2N1cnJlbnRJbmRleF0gPSBhcnJheVtyYW5kb21JbmRleF07XHJcbiAgICBhcnJheVtyYW5kb21JbmRleF0gPSB0ZW1wO1xyXG4gIH1cclxuICByZXR1cm4gYXJyYXk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN3YXAoYXJyYXksIGksIGopIHtcclxuICBjb25zdCB0ZW1wID0gYXJyYXlbaV07XHJcbiAgYXJyYXlbaV0gPSBhcnJheVtqXTtcclxuICBhcnJheVtqXSA9IHRlbXA7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpcnN0RW1wdHlJbmRleChhcnJheSkge1xyXG4gIGlmIChhcnJheS5sZW5ndGggPCAxKSByZXR1cm4gMDtcclxuICBcclxuICBmb3IgKGxldCBpID0gMDsgaSA8PSBhcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgaWYgKGFycmF5W2ldID09IG51bGwpIHJldHVybiBpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbGVycChzdGFydCwgZW5kLCB0aW1lKSB7XHJcbiAgLy9yZXR1cm4gc3RhcnQgKyAodGltZSAqIChlbmQgLSBzdGFydCkpO1xyXG4gIHJldHVybiAoKDEgLSB0aW1lKSAqIHN0YXJ0KSArICh0aW1lICogZW5kKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2xhbXAodmFsdWUsIG1pbmltdW0sIG1heGltdW0pIHtcclxuICBpZiAodmFsdWUgPCBtaW5pbXVtKSB7XHJcbiAgICByZXR1cm4gbWluaW11bTtcclxuICB9XHJcbiAgZWxzZSBpZiAodmFsdWUgPiBtYXhpbXVtKSB7XHJcbiAgICByZXR1cm4gbWF4aW11bTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiByYW5kb21JbnQobWluaW11bSwgbWF4aW11bSkge1xyXG4gIHJldHVybiBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogKG1heGltdW0gKyAxKSkgKyBtaW5pbXVtKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0WEZyb21JbmRleChpbmRleCwgY29sdW1ucykge1xyXG4gIHJldHVybiBpbmRleCAlIGNvbHVtbnM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFlGcm9tSW5kZXgoaW5kZXgsIGNvbHVtbnMpIHtcclxuICByZXR1cm4gKGluZGV4IC0gKGluZGV4ICUgY29sdW1ucykpIC8gY29sdW1ucztcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0SW5kZXhGcm9tWFkoeCwgeSwgY29sdW1ucykge1xyXG4gIHJldHVybiAoeSAqIGNvbHVtbnMpICsgeDtcclxufVxyXG5cclxuZnVuY3Rpb24gdGltZXN0YW1wKGRhdGUpIHtcclxuICBpZiAoIShkYXRlIGluc3RhbmNlb2YgRGF0ZSkpIHJldHVybiBcIkludmFsaWQgZGF0ZVwiO1xyXG4gIGxldCBtb250aCA9IGRhdGUuZ2V0TW9udGgoKSArIDE7XHJcbiAgbGV0IGRheSA9IGRhdGUuZ2V0RGF0ZSgpO1xyXG4gIGxldCBob3VyID0gZGF0ZS5nZXRIb3VycygpO1xyXG4gIGxldCBtaW51dGUgPSBkYXRlLmdldE1pbnV0ZXMoKTtcclxuICBsZXQgc2Vjb25kID0gZGF0ZS5nZXRTZWNvbmRzKCk7XHJcbiAgaWYgKG1vbnRoIDwgMTApIG1vbnRoID0gXCIwXCIgKyBtb250aDtcclxuICBpZiAoZGF5IDwgMTApIGRheSA9IFwiMFwiICsgZGF5O1xyXG4gIGlmIChob3VyIDwgMTApIGhvdXIgPSBcIjBcIiArIGhvdXI7XHJcbiAgaWYgKG1pbnV0ZSA8IDEwKSBtaW51dGUgPSBcIjBcIiArIG1pbnV0ZTtcclxuICBpZiAoc2Vjb25kIDwgMTApIHNlY29uZCA9IFwiMFwiICsgc2Vjb25kO1xyXG4gIHJldHVybiBgJHtkYXRlLmdldEZ1bGxZZWFyKCl9LSR7bW9udGh9LSR7ZGF5fSAke2hvdXJ9OiR7bWludXRlfToke3NlY29uZH1gO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbmRlZmluaXRlQXJ0aWNsZSh3b3JkKSB7XHJcblx0bGV0IHJlZ2V4ID0gL3Ryb3VzZXJzJHxqZWFucyR8Z2xhc3NlcyQvaTtcclxuXHRpZiAod29yZC5tYXRjaChyZWdleCkpIHJldHVybiBcImEgcGFpciBvZiBcIiArIHdvcmQ7XHJcblxyXG5cdHJlZ2V4ID0gL15bYWVpb3VdL2k7XHJcblx0aWYgKHdvcmQubWF0Y2gocmVnZXgpKSByZXR1cm4gXCJhbiBcIiArIHdvcmQ7XHJcblxyXG5cdHJldHVybiBcImEgXCIgKyB3b3JkO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwbHVyYWwod29yZCkge1xyXG5cdGxldCByZWdleCA9IC9zaGVlcCR8ZGVlciR8ZmlzaCQvaTtcclxuXHRpZiAod29yZC5tYXRjaChyZWdleCkpIHJldHVybiB3b3JkO1xyXG5cclxuXHRyZWdleCA9IC90cm91c2VycyR8amVhbnMkfGdsYXNzZXMkL2k7XHJcblx0aWYgKHdvcmQubWF0Y2gocmVnZXgpKSByZXR1cm4gXCJwYWlycyBvZiBcIiArIHdvcmQ7XHJcblx0XHJcblx0cmVnZXggPSAvc3RvbWFjaCR8ZXBvY2gkfC9pO1xyXG5cdGlmICh3b3JkLm1hdGNoKHJlZ2V4KSkgcmV0dXJuIHdvcmQgKyBcInNcIjtcclxuXHRcclxuXHRyZWdleCA9IC9mJHxmZSQvaTtcclxuXHRpZiAod29yZC5tYXRjaChyZWdleCkpIHJldHVybiB3b3JkLnJlcGxhY2UocmVnZXgsIFwidmVzXCIpO1xyXG5cclxuXHRyZWdleCA9IC9bc3h6XSR8Y2gkfHNoJHxhdG8kL2k7XHJcblx0aWYgKHdvcmQubWF0Y2gocmVnZXgpKSByZXR1cm4gd29yZCArIFwiZXNcIjtcclxuXHRcclxuXHRyZWdleCA9IC95JC9pO1xyXG5cdGlmICh3b3JkLm1hdGNoKHJlZ2V4KSkgcmV0dXJuIHdvcmQucmVwbGFjZShyZWdleCwgXCJpZXNcIik7XHJcblx0XHJcblx0cmV0dXJuIHdvcmQgKyBcInNcIjtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIGNyZWF0ZTJkQXJyYXksXHJcbiAgY3JlYXRlM2RBcnJheSxcclxuICBzaHVmZmxlLFxyXG4gIHN3YXAsXHJcbiAgZmlyc3RFbXB0eUluZGV4LFxyXG4gIGxlcnAsXHJcbiAgY2xhbXAsXHJcbiAgcmFuZG9tSW50LFxyXG4gIGdldFhGcm9tSW5kZXgsXHJcbiAgZ2V0WUZyb21JbmRleCxcclxuICBnZXRJbmRleEZyb21YWSxcclxuICB0aW1lc3RhbXAsXHJcbiAgaW5kZWZpbml0ZUFydGljbGUsXHJcbiAgcGx1cmFsXHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImJjcnlwdFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJleHByZXNzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImZzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImh0dHBcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibW9uZ29vc2VcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibm9kZS1nYW1lbG9vcFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXRoXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInNvY2tldC5pb1wiKTsiXSwic291cmNlUm9vdCI6IiJ9
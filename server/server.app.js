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
			}
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
			if (bot != null) pack.bots[bot.gameId] = bot.update(delta);
		}
		for (let i = 0; i < this.items.length; i++) {
			const item = this.items[i];
			if (item != null) pack.items[item.gameId] = item.update(delta);
		}
		for (let i = 0; i < this.effects.length; i++) {
			const effect = this.effects[i];
			if (effect != null) pack.effects[effect.id] = effect.update(delta);
		}
		for (let i = 0; i < this.texts.length; i++) {
			const text = this.texts[i];
			if (text != null) pack.texts[text.gameId] = text.update(delta);
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
		socket.on('input', (data) => player.inputData(data));
		socket.on('uploadMap', (data) => {
			if (player.adminAccess >= 2) {
				this.onUploadMap(data);
			}
			else {
				_game_js__WEBPACK_IMPORTED_MODULE_5__["default"].sendGameInfoPlayer(player.gameId, `You don't have access to that command.`);
			}
		});
		this.sendMapData(socket, player.mapId);
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

		_game_js__WEBPACK_IMPORTED_MODULE_5__["default"].players.forEach((player) => {
			if (player.mapId === data.mapId) {
				this.sendMapData(this.socketList[player.socketId], player.mapId);
			}
		});
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL2FjdG9yLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy9ib3QuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL2VmZmVjdC5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2NsYXNzZXMvZW50aXR5LmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy9pdGVtLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy9tYXAuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL21lc3NhZ2UuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL3BsYXllci5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2NsYXNzZXMvdGV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2NvbmZpZy5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2RiLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvZ2FtZS5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2dhbWVsb29wLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL21vZGVscy9hY2NvdW50LmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvbW9kZWxzL2JvdFRlbXBsYXRlLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvbW9kZWxzL2l0ZW1UZW1wbGF0ZS5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL21vZGVscy9pdGVtVHlwZS5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL21vZGVscy9tYXAuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9tb2RlbHMvcGxheWVyLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvbW9kZWxzL3BsYXllclRlbXBsYXRlLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvc2VydmVyLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvdXRpbC5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJiY3J5cHRcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJleHByZXNzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZnNcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJodHRwXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibW9uZ29vc2VcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJub2RlLWdhbWVsb29wXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicGF0aFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInNvY2tldC5pb1wiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxpQkFBaUIsc0JBQXNCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsbUJBQW1CO0FBQ25CO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwrREFBK0Q7O0FBRS9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxzQkFBc0I7QUFDdEIsR0FBRzs7QUFFSDs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0EsaUJBQWlCLFlBQVksR0FBRyxlQUFlO0FBQy9DO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTs7QUFFSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJOztBQUVKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxpQkFBaUIscUJBQXFCO0FBQ3RDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsb0JBQW9CLDBFQUE4QjtBQUNsRDtBQUNBLGtCQUFrQixzQkFBc0I7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLHVGQUEyQztBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGtFQUFrRTtBQUNsRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbm9CQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0Esc0JBQXNCO0FBQ3RCOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsMEVBQThCO0FBQ2xEO0FBQ0E7O0FBRUEsaUJBQWlCLHNCQUFzQjtBQUN2QztBQUNBLHFCQUFxQiwwRUFBOEI7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2hNQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEU7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQzNEQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDYkE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDOUhBO0FBQ0E7O0FBRUE7QUFDQSw2QkFBNkI7QUFDN0I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUM1REE7QUFDQTtBQUNBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtSEFBdUUsV0FBVztBQUNsRjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN2TkE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNwRUE7QUFBQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3hCQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esd0ZBQWlELHNCQUFzQjs7QUFFdkU7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNwSkEsbUM7Ozs7Ozs7Ozs7O0FDQUEsb0M7Ozs7Ozs7Ozs7O0FDQUEsK0I7Ozs7Ozs7Ozs7O0FDQUEsaUM7Ozs7Ozs7Ozs7O0FDQUEscUM7Ozs7Ozs7Ozs7O0FDQUEsMEM7Ozs7Ozs7Ozs7O0FDQUEsaUM7Ozs7Ozs7Ozs7O0FDQUEsc0MiLCJmaWxlIjoic2VydmVyLmFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc2VydmVyL3NyYy9tYWluLmpzXCIpO1xuIiwiaW1wb3J0IGdhbWUgZnJvbSAnLi4vZ2FtZS5qcyc7XHJcbmltcG9ydCBjb25maWcgZnJvbSAnLi4vY29uZmlnLmpzJztcclxuaW1wb3J0IHV0aWwgZnJvbSAnLi4vdXRpbC5qcyc7XHJcbmltcG9ydCBFbnRpdHkgZnJvbSAnLi9lbnRpdHkuanMnO1xyXG5cclxuLy8gQW4gQWN0b3IgaXMgYW4gRW50aXR5IHdoaWNoIGNhbiBtb3ZlLCBhdHRhY2sgYW5kIGludGVyYWN0IHdpdGggaXRlbXNcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFjdG9yIGV4dGVuZHMgRW50aXR5IHtcclxuXHRjb25zdHJ1Y3RvcihtYXBJZCwgeCwgeSwgZGlyZWN0aW9uLCBuYW1lLCBzcHJpdGUpIHtcclxuXHRcdHNwcml0ZSA9IHV0aWwuY2xhbXAoc3ByaXRlLCAxLCBjb25maWcuTUFYX1NQUklURVMpO1xyXG5cclxuXHRcdHN1cGVyKG1hcElkLCB4LCB5LCBzcHJpdGUpO1xyXG5cdFx0dGhpcy5uYW1lID0gbmFtZTtcclxuXHRcdHRoaXMuZGVzY3JpcHRpb24gPSBcIlwiO1xyXG5cclxuXHRcdHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xyXG5cdFx0dGhpcy5zdGFydFggPSB0aGlzLng7XHJcblx0XHR0aGlzLnN0YXJ0WSA9IHRoaXMueTtcclxuXHRcdHRoaXMuZGVzdGluYXRpb25YID0gdGhpcy54O1xyXG5cdFx0dGhpcy5kZXN0aW5hdGlvblkgPSB0aGlzLnk7XHJcblx0XHR0aGlzLmxlcnAgPSAwO1xyXG5cclxuXHRcdHRoaXMuaXNNb3ZpbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMuaXNSdW5uaW5nID0gZmFsc2U7XHJcblx0XHR0aGlzLm1vdmVTcGVlZCA9IDIuNTtcclxuXHRcdHRoaXMubW92ZW1lbnRUaW1lciA9IDA7XHJcblx0XHR0aGlzLmxhemluZXNzID0gMDtcclxuXHJcblx0XHR0aGlzLmlzQXR0YWNraW5nID0gZmFsc2U7XHJcblx0XHR0aGlzLmF0dGFja1NwZWVkID0gMTtcclxuXHRcdHRoaXMuYXR0YWNrVGltZXIgPSAwO1x0XHJcblx0XHR0aGlzLnRhcmdldCA9IG51bGw7XHJcblx0XHR0aGlzLmtpbGxzID0gMDtcclxuXHJcblx0XHR0aGlzLmNhbGNCb251c1N0YXRzKCk7XHJcblx0fVxyXG5cdFxyXG5cdC8vIENoYXJhY3RlciBTdGF0c1xyXG5cdGdldCBkYW1hZ2UoKSB7XHJcblx0XHRsZXQgZGFtYWdlVG90YWwgPSB0aGlzLmRhbWFnZUJhc2UgKyB0aGlzLmRhbWFnZUJvbnVzO1xyXG5cdFx0cmV0dXJuIChkYW1hZ2VUb3RhbCA8IDApID8gMCA6IGRhbWFnZVRvdGFsO1xyXG5cdH1cclxuXHRnZXQgZGVmZW5jZSgpIHtcclxuXHRcdGxldCBkZWZlbmNlVG90YWwgPSB0aGlzLmRlZmVuY2VCYXNlICsgdGhpcy5kZWZlbmNlQm9udXM7XHJcblx0XHRyZXR1cm4gKGRlZmVuY2VUb3RhbCA8IDApID8gMCA6IGRlZmVuY2VUb3RhbDtcclxuXHR9XHJcblx0Z2V0IGhlYWx0aE1heCgpIHtcclxuXHRcdGxldCBoZWFsdGhNYXhUb3RhbCA9IHRoaXMuaGVhbHRoTWF4QmFzZSArIHRoaXMuaGVhbHRoTWF4Qm9udXNcclxuXHRcdHJldHVybiAoaGVhbHRoTWF4VG90YWwgPCAxKSA/IDEgOiBoZWFsdGhNYXhUb3RhbDtcclxuXHR9XHJcblx0Z2V0IGVuZXJneU1heCgpIHtcclxuXHRcdGxldCBlbmVyZ3lNYXhUb3RhbCA9IHRoaXMuZW5lcmd5TWF4QmFzZSArIHRoaXMuZW5lcmd5TWF4Qm9udXM7XHJcblx0XHRyZXR1cm4gKGVuZXJneU1heFRvdGFsIDwgMCkgPyAwIDogZW5lcmd5TWF4VG90YWw7XHJcblx0fVxyXG5cdGdldCByYW5nZSgpIHtcclxuXHRcdGxldCByYW5nZVRvdGFsID0gdGhpcy5yYW5nZUJhc2UgKyB0aGlzLnJhbmdlQm9udXM7XHJcblx0XHRyZXR1cm4gKHJhbmdlVG90YWwgPCAxKSA/IDEgOiByYW5nZVRvdGFsO1xyXG5cdH1cclxuXHJcblx0Y2FsY0Jhc2VTdGF0cyh0ZW1wbGF0ZSkge1xyXG5cdFx0dGhpcy5kYW1hZ2VCYXNlID0gdGVtcGxhdGUuZGFtYWdlQmFzZSB8fCAxO1xyXG5cdFx0dGhpcy5kZWZlbmNlQmFzZSA9IHRlbXBsYXRlLmRlZmVuY2VCYXNlIHx8IDA7XHJcblx0XHR0aGlzLmhlYWx0aE1heEJhc2UgPSB0ZW1wbGF0ZS5oZWFsdGhNYXhCYXNlICsgKHRlbXBsYXRlLmhlYWx0aFBlckxldmVsICogKHRoaXMubGV2ZWwgLSAxKSkgfHwgMTtcclxuXHRcdHRoaXMuZW5lcmd5TWF4QmFzZSA9IHRlbXBsYXRlLmVuZXJneU1heEJhc2UgKyAodGVtcGxhdGUuZW5lcmd5UGVyTGV2ZWwgKiAodGhpcy5sZXZlbCAtIDEpKSB8fCAxO1xyXG5cdFx0dGhpcy5yYW5nZUJhc2UgPSB0ZW1wbGF0ZS5yYW5nZUJhc2UgfHwgMTtcclxuXHR9XHJcblxyXG5cdGNhbGNJdGVtQm9udXMoKSB7XHJcblx0XHRjb25zdCBpdGVtQm9udXMgPSB7XHJcblx0XHRcdGRhbWFnZTogMCxcclxuXHRcdFx0ZGVmZW5jZTogMCxcclxuXHRcdFx0aGVhbHRoTWF4OiAwLFxyXG5cdFx0XHRlbmVyZ3lNYXg6IDAsXHJcblx0XHRcdHJhbmdlOiAwXHJcblx0XHR9O1xyXG5cclxuXHRcdGNvbnN0IGludmVudG9yeSA9IHRoaXMuZ2V0SW52ZW50b3J5KCk7XHJcblxyXG5cdFx0Ly8gRm9yIGVhY2ggaXRlbSBpbiBpbnZlbnRvcnkgY2hlY2sgZm9yIGJvbnVzZXNcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgaW52ZW50b3J5Lmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IGl0ZW0gPSBpbnZlbnRvcnlbaV07XHJcblx0XHRcdGl0ZW1Cb251cy5kYW1hZ2UgKz0gaXRlbS5wYXNzaXZlLmRhbWFnZTtcclxuXHRcdFx0aXRlbUJvbnVzLmRlZmVuY2UgKz0gaXRlbS5wYXNzaXZlLmRlZmVuY2U7XHJcblx0XHRcdGl0ZW1Cb251cy5oZWFsdGhNYXggKz0gaXRlbS5wYXNzaXZlLmhlYWx0aE1heDtcclxuXHRcdFx0aXRlbUJvbnVzLmVuZXJneU1heCArPSBpdGVtLnBhc3NpdmUuZW5lcmd5TWF4O1xyXG5cdFx0XHRpdGVtQm9udXMucmFuZ2UgKz0gaXRlbS5wYXNzaXZlLnJhbmdlO1xyXG5cclxuXHRcdFx0aWYgKGl0ZW0uc2xvdCA+PSBjb25maWcuSU5WRU5UT1JZX1NJWkUpIHtcclxuXHRcdFx0XHRpdGVtQm9udXMuZGFtYWdlICs9IGl0ZW0uZXF1aXBwZWQuZGFtYWdlO1xyXG5cdFx0XHRcdGl0ZW1Cb251cy5kZWZlbmNlICs9IGl0ZW0uZXF1aXBwZWQuZGVmZW5jZTtcclxuXHRcdFx0XHRpdGVtQm9udXMuaGVhbHRoTWF4ICs9IGl0ZW0uZXF1aXBwZWQuaGVhbHRoTWF4O1xyXG5cdFx0XHRcdGl0ZW1Cb251cy5lbmVyZ3lNYXggKz0gaXRlbS5lcXVpcHBlZC5lbmVyZ3lNYXg7XHJcblx0XHRcdFx0aXRlbUJvbnVzLnJhbmdlICs9IGl0ZW0uZXF1aXBwZWQucmFuZ2U7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIGl0ZW1Cb251cztcclxuXHR9XHJcblxyXG5cdGNhbGNFZmZlY3RCb251cygpIHtcclxuXHRcdGNvbnN0IGVmZmVjdEJvbnVzID0ge1xyXG5cdFx0XHRkYW1hZ2U6IDAsXHJcblx0XHRcdGRlZmVuY2U6IDAsXHJcblx0XHRcdGhlYWx0aE1heDogMCxcclxuXHRcdFx0ZW5lcmd5TWF4OiAwLFxyXG5cdFx0XHRyYW5nZTogMFxyXG5cdFx0fTtcclxuXHJcblx0XHQvLyBUT0RPOiB3b3JrIG91dCBob3cgdG8gZG8gZWZmZWN0cyBmb3Igc3BlbGxzIGFuZCBwb3Rpb25zXHJcblx0XHRyZXR1cm4gZWZmZWN0Qm9udXM7XHJcblx0fVxyXG5cdFxyXG5cdGNhbGNCb251c1N0YXRzKCkge1x0Ly8gSXRlbXMgKGVxdWlwcGVkIGFuZCBwYXNzaXZlKSBhbmQgRWZmZWN0cyAoc3BlbGxzIGFuZCBwb3Rpb25zKVxyXG5cdFx0Y29uc3QgaXRlbUJvbnVzID0gdGhpcy5jYWxjSXRlbUJvbnVzKCk7XHJcblx0XHRjb25zdCBlZmZlY3RCb251cyA9IHRoaXMuY2FsY0VmZmVjdEJvbnVzKCk7XHJcblxyXG5cdFx0dGhpcy5kYW1hZ2VCb251cyA9IGl0ZW1Cb251cy5kYW1hZ2UgKyBlZmZlY3RCb251cy5kYW1hZ2U7XHJcblx0XHR0aGlzLmRlZmVuY2VCb251cyA9IGl0ZW1Cb251cy5kZWZlbmNlICsgZWZmZWN0Qm9udXMuZGVmZW5jZTtcclxuXHRcdHRoaXMuaGVhbHRoTWF4Qm9udXMgPSBpdGVtQm9udXMuaGVhbHRoTWF4ICsgZWZmZWN0Qm9udXMuaGVhbHRoTWF4O1xyXG5cdFx0dGhpcy5lbmVyZ3lNYXhCb251cyA9IGl0ZW1Cb251cy5lbmVyZ3lNYXggKyBlZmZlY3RCb251cy5lbmVyZ3lNYXg7XHJcblx0XHR0aGlzLnJhbmdlQm9udXMgPSBpdGVtQm9udXMucmFuZ2UgKyBlZmZlY3RCb251cy5yYW5nZTtcclxuXHR9XHJcblxyXG5cdGNhbGNTdGF0cygpIHtcclxuXHRcdHRoaXMuY2FsY0Jhc2VTdGF0cygpO1xyXG5cdFx0dGhpcy5jYWxjQm9udXNTdGF0cygpO1xyXG5cdH1cclxuXHJcblx0cmVzdG9yZSgpIHtcclxuXHRcdHRoaXMuaGVhbHRoID0gdGhpcy5oZWFsdGhNYXg7XHJcblx0XHR0aGlzLmVuZXJneSA9IHRoaXMuZW5lcmd5TWF4O1xyXG5cdH1cclxuXHRcclxuXHRpbnB1dERhdGEoKSB7XHJcblx0XHQvLyBTZWUgUGxheWVyIGFuZCBCb3QgY2xhc3Nlc1xyXG5cdH1cclxuXHJcblx0Ly8gTW92ZW1lbnRcclxuXHRtb3ZlKGRpcmVjdGlvbikge1xyXG5cdFx0aWYgKHRoaXMuaXNNb3ZpbmcpIHJldHVybjtcclxuXHJcblx0XHRpZiAoZGlyZWN0aW9uKSB7XHJcblx0XHRcdHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChkaXJlY3Rpb24gPT09ICdsZWZ0Jykge1xyXG5cdFx0XHRpZiAoIWdhbWUuaXNWYWNhbnQodGhpcy5tYXBJZCwgdGhpcy54IC0gMSwgdGhpcy55KSkgcmV0dXJuO1xyXG5cdFx0XHR0aGlzLmRlc3RpbmF0aW9uWC0tO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoZGlyZWN0aW9uID09PSAncmlnaHQnKSB7XHJcblx0XHRcdGlmICghZ2FtZS5pc1ZhY2FudCh0aGlzLm1hcElkLCB0aGlzLnggKyAxLCB0aGlzLnkpKSByZXR1cm47XHJcblx0XHRcdHRoaXMuZGVzdGluYXRpb25YKys7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChkaXJlY3Rpb24gPT09ICd1cCcpIHtcclxuXHRcdFx0aWYgKCFnYW1lLmlzVmFjYW50KHRoaXMubWFwSWQsIHRoaXMueCwgdGhpcy55IC0gMSkpIHJldHVybjtcclxuXHRcdFx0dGhpcy5kZXN0aW5hdGlvblktLTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ2Rvd24nKSB7XHJcblx0XHRcdGlmICghZ2FtZS5pc1ZhY2FudCh0aGlzLm1hcElkLCB0aGlzLngsIHRoaXMueSArIDEpKSByZXR1cm47XHJcblx0XHRcdHRoaXMuZGVzdGluYXRpb25ZKys7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0c3dpdGNoICh1dGlsLnJhbmRvbUludCgwLCAzICsgdGhpcy5sYXppbmVzcykpIHtcclxuXHRcdFx0XHRjYXNlIDA6IHRoaXMubW92ZSgnbGVmdCcpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgMTogdGhpcy5tb3ZlKCdyaWdodCcpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgMjogdGhpcy5tb3ZlKCd1cCcpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgMzogdGhpcy5tb3ZlKCdkb3duJyk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0ZGVmYXVsdDogLy8gRG9uJ3QgTW92ZVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBTZXQgbW92ZSBzcGVlZFxyXG5cdFx0aWYgKHRoaXMuaXNSdW5uaW5nKSB7XHJcblx0XHRcdGlmICh0aGlzLmVuZXJneSA+IDApIHtcclxuXHRcdFx0XHR0aGlzLmVuZXJneS0tO1xyXG5cdFx0XHRcdHRoaXMubW92ZVNwZWVkID0gNDtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHR0aGlzLmVuZXJneSA9IDA7XHJcblx0XHRcdFx0dGhpcy5tb3ZlU3BlZWQgPSAyLjU7XHJcblx0XHRcdFx0dGhpcy5pc1J1bm5pbmcgPSBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHRoaXMubW92ZVNwZWVkID0gMi41O1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR0aGlzLmlzTW92aW5nID0gdHJ1ZTtcclxuXHR9XHJcblx0XHJcblx0bW92ZVRvVGFyZ2V0KHRhcmdldCwgaG9zdGlsZSkge1xyXG5cdFx0aWYgKCF0YXJnZXQpIHJldHVybjtcclxuXHRcdFxyXG5cdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggJiYgdGFyZ2V0LnkgPT09IHRoaXMueSkge1xyXG5cdFx0XHR0aGlzLm1vdmUoKTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKHV0aWwucmFuZG9tSW50KDAsIDEpID09PSAwKSB7XHJcblx0XHRcdGlmICh0YXJnZXQueCA8IHRoaXMueCkge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQueCA+PSAodGhpcy54IC0gdGhpcy5yYW5nZSkgJiYgdGFyZ2V0LnkgPT09IHRoaXMueSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnbGVmdCc7XHJcblx0XHRcdFx0XHRcdGlmICghdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCdsZWZ0Jyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ2xlZnQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodGFyZ2V0LnggPiB0aGlzLngpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LnggPT09IHRoaXMueCArIHRoaXMucmFuZ2UgJiYgdGFyZ2V0LnkgPT09IHRoaXMueSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAncmlnaHQnO1xyXG5cdFx0XHRcdFx0XHRpZiAoIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmF0dGFjaygncmlnaHQnKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSgncmlnaHQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodGFyZ2V0LnkgPCB0aGlzLnkpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LnggPT09IHRoaXMueCAmJiB0YXJnZXQueSA9PT0gdGhpcy55IC0gdGhpcy5yYW5nZSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAndXAnO1xyXG5cdFx0XHRcdFx0XHRpZiAoIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmF0dGFjaygndXAnKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSgndXAnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodGFyZ2V0LnkgPiB0aGlzLnkpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LnggPT09IHRoaXMueCAmJiB0YXJnZXQueSA9PT0gdGhpcy55ICsgdGhpcy5yYW5nZSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnZG93bic7XHJcblx0XHRcdFx0XHRcdGlmICghdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCdkb3duJyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ2Rvd24nKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRpZiAodGFyZ2V0LnkgPiB0aGlzLnkpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LnggPT09IHRoaXMueCAmJiB0YXJnZXQueSA9PT0gdGhpcy55ICsgdGhpcy5yYW5nZSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUpIHtcclxuXHRcdFx0XHRcdFx0aWYgKCF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ2Rvd24nKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSgnZG93bicpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICh0YXJnZXQueSA8IHRoaXMueSkge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICYmIHRhcmdldC55ID09PSB0aGlzLnkgLSB0aGlzLnJhbmdlKSB7XHJcblx0XHRcdFx0XHRpZiAoaG9zdGlsZSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmF0dGFjaygndXAnKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSgndXAnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodGFyZ2V0LnggPiB0aGlzLngpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LnggPT09IHRoaXMueCArIHRoaXMucmFuZ2UgJiYgdGFyZ2V0LnkgPT09IHRoaXMueSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUpIHtcclxuXHRcdFx0XHRcdFx0aWYgKCF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ3JpZ2h0Jyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ3JpZ2h0Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHRhcmdldC54IDwgdGhpcy54KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID49ICh0aGlzLnggLSB0aGlzLnJhbmdlKSAmJiB0YXJnZXQueSA9PT0gdGhpcy55KSB7XHJcblx0XHRcdFx0XHRpZiAoaG9zdGlsZSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmF0dGFjaygnbGVmdCcpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCdsZWZ0Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdC8vIENvbWJhdFxyXG5cdGNoZWNrSW5SYW5nZShkaXJlY3Rpb24sIHRhcmdldCwgcmFuZ2UpIHtcclxuXHRcdGlmICh0YXJnZXQubWFwSWQgIT09IHRoaXMubWFwSWQpIHJldHVybiBmYWxzZTtcclxuXHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICYmIHRhcmdldC55ID09PSB0aGlzLnkpIHJldHVybiBmYWxzZTtcdC8vIFN0YWNrZWQgZG9lcyBub3QgY291bnQgYXMgaW4gcmFuZ2VcclxuXHRcdFxyXG5cdFx0aWYgKHRhcmdldC55ID09PSB0aGlzLnkpIHtcclxuXHRcdFx0aWYgKGRpcmVjdGlvbiA9PT0gJ2xlZnQnKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMueCA9PT0gMCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHJldHVybiAodGFyZ2V0LnggPCB0aGlzLnggJiYgdGFyZ2V0LnggPj0gKHRoaXMueCAtIHJhbmdlKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ3JpZ2h0Jykge1xyXG5cdFx0XHRcdGlmICh0aGlzLnggPT09IGNvbmZpZy5NQVBfQ09MVU1OUyAtIDEpIHtcclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gKHRhcmdldC54ID4gdGhpcy54ICYmIHRhcmdldC54IDw9ICh0aGlzLnggKyByYW5nZSkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAodGFyZ2V0LnggPT09IHRoaXMueCkge1xyXG5cdFx0XHRpZiAoZGlyZWN0aW9uID09PSAndXAnKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMueSA9PT0gMCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHJldHVybiAodGFyZ2V0LnkgPCB0aGlzLnkgJiYgdGFyZ2V0LnkgPj0gKHRoaXMueSAtIHJhbmdlKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ2Rvd24nKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMueSA9PT0gY29uZmlnLk1BUF9ST1dTIC0gMSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHJldHVybiAodGFyZ2V0LnkgPiB0aGlzLnkgJiYgdGFyZ2V0LnkgPD0gKHRoaXMueSArIHJhbmdlKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblxyXG5cdGF0dGFjayhudW1UYXJnZXRzID0gMSwgZGlyZWN0aW9uID0gdGhpcy5kaXJlY3Rpb24pIHtcclxuXHRcdGlmICh0aGlzLmlzQXR0YWNraW5nIHx8IHRoaXMuYXR0YWNrVGltZXIgPiAwKSByZXR1cm47XHJcblxyXG5cdFx0dGhpcy5pc0F0dGFja2luZyA9IHRydWU7XHJcblx0XHRcclxuXHRcdGNvbnN0IHBsYXllckxpc3QgPSBnYW1lLnBsYXllcnMuZmlsdGVyKHBsYXllciA9PiBwbGF5ZXIubWFwSWQgPT09IHRoaXMubWFwSWQpO1xyXG5cdFx0Y29uc3QgYm90TGlzdCA9IGdhbWUuYm90cy5maWx0ZXIoYm90ID0+IGJvdC5tYXBJZCA9PT0gdGhpcy5tYXBJZCk7XHJcblx0XHRjb25zdCBhY3Rvckxpc3QgPSBwbGF5ZXJMaXN0LmNvbmNhdChib3RMaXN0KTtcclxuXHRcdGxldCB0YXJnZXRMaXN0ID0gYWN0b3JMaXN0LmZpbHRlcihhY3RvciA9PiB7XHJcblx0XHRcdHJldHVybiBhY3RvciAhPT0gdGhpcyAmJiAhYWN0b3IuaXNEZWFkICYmIHRoaXMuY2hlY2tJblJhbmdlKGRpcmVjdGlvbiwgYWN0b3IsIHRoaXMucmFuZ2UpO1xyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcdHRhcmdldExpc3Quc29ydCgoYSwgYikgPT4ge1xyXG5cdFx0XHRyZXR1cm4gKGEueiAtIGIueik7XHQvLyBMb3dlc3QgdG8gaGlnaGVzdFxyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcdHRhcmdldExpc3QgPSB0YXJnZXRMaXN0LnNwbGljZSgtbnVtVGFyZ2V0cyk7XHJcblx0XHRcclxuXHRcdHRhcmdldExpc3QuZm9yRWFjaCgodGFyZ2V0KSA9PiB7XHJcblx0XHRcdHRhcmdldC50YWtlRGFtYWdlKHRoaXMuZGFtYWdlLCB0aGlzKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRcclxuXHR0YWtlRGFtYWdlKGRhbWFnZSwgYXR0YWNrZXIpIHtcclxuXHRcdGNvbnNvbGUubG9nKGAke3RoaXMuaGVhbHRofS8ke3RoaXMuaGVhbHRoTWF4fWApO1xyXG5cdFx0ZGFtYWdlIC09IHRoaXMuZGVmZW5jZTtcclxuXHRcdGlmIChkYW1hZ2UgPCAwKSBkYW1hZ2UgPSAwO1xyXG5cdFx0Z2FtZS5zcGF3bkRhbWFnZVRleHQodGhpcy5tYXBJZCwgdGhpcy54LCB0aGlzLnksIGRhbWFnZSk7XHJcblx0XHRpZiAoZGFtYWdlID09PSAwKSByZXR1cm47XHJcblx0XHRcclxuXHRcdHRoaXMuaGVhbHRoIC09IGRhbWFnZTtcclxuXHRcdGlmICh0aGlzLmhlYWx0aCA8PSAwKSB7XHJcblx0XHRcdHRoaXMuc2V0RGVhZCgpO1xyXG5cdFx0XHRcclxuXHRcdFx0aWYgKCFhdHRhY2tlcikge1xyXG5cdFx0XHRcdGdhbWUuc2VuZEdhbWVJbmZvR2xvYmFsKHRoaXMubmFtZSArIFwiIGhhcyBkaWVkIVwiKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGF0dGFja2VyLmtpbGxzKys7XHJcblx0XHRcdGlmIChhdHRhY2tlci50YXJnZXQgPT09IHRoaXMpIGF0dGFja2VyLnRhcmdldCA9IG51bGw7XHJcblx0XHRcdGlmIChhdHRhY2tlci5wbGF5ZXJJZCkge1xyXG5cdFx0XHRcdGdhbWUuc2VuZEdhbWVJbmZvR2xvYmFsKGF0dGFja2VyLm5hbWUgKyBcIiBoYXMgbXVyZGVyZWQgXCIgKyB0aGlzLm5hbWUgKyBcIiBpbiBjb2xkIGJsb29kIVwiKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRnYW1lLnNlbmRHYW1lSW5mb0dsb2JhbCh0aGlzLm5hbWUgKyBcIiBoYXMgYmVlbiBraWxsZWQgYnkgXCIgKyBhdHRhY2tlci5uYW1lICsgXCIhXCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVx0XHJcblxyXG5cdHNldERlYWQoKSB7XHJcblx0XHRjb25zdCBtYXAgPSBnYW1lLm1hcHNbdGhpcy5tYXBJZF07XHJcblx0XHRjb25zdCBpbnZlbnRvcnkgPSB0aGlzLmdldEludmVudG9yeSgpO1xyXG5cclxuXHRcdC8vIEludmVudG9yeSBJdGVtIERyb3AgQ2hhbmNlXHJcblx0XHRjb25zdCBkcm9wQ2hhbmNlID0gdXRpbC5jbGFtcChtYXAuZHJvcENoYW5jZSwgMCwgMTAwKTtcclxuXHRcdGlmIChkcm9wQ2hhbmNlID4gMCkge1xyXG5cdFx0XHRjb25zdCBpdGVtcyA9IGludmVudG9yeS5maWx0ZXIoaXRlbSA9PiB7XHJcblx0XHRcdFx0cmV0dXJuIGl0ZW0uc2xvdCA8IGNvbmZpZy5JTlZFTlRPUllfU0laRTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRpdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xyXG5cdFx0XHRcdGlmIChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDEpIDw9IGRyb3BDaGFuY2UpIHtcclxuXHRcdFx0XHRcdGl0ZW0ubW92ZVRvTWFwKHRoaXMubWFwSWQsIHRoaXMueCwgdGhpcy55KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0XHR0aGlzLmNhbGNCb251c1N0YXRzKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gRXF1aXBwZWQgSXRlbSBEcm9wIEFtb3VudFxyXG5cdFx0Y29uc3QgZHJvcEFtb3VudEVRID0gdXRpbC5jbGFtcChtYXAuZHJvcEFtb3VudEVRLCAwLCBjb25maWcuRVFVSVBNRU5UX1NJWkUpO1xyXG5cdFx0aWYgKGRyb3BBbW91bnRFUSA+IDApIHtcclxuXHRcdFx0bGV0IGVxdWlwbWVudCA9IGludmVudG9yeS5maWx0ZXIoaXRlbSA9PiB7XHJcblx0XHRcdFx0cmV0dXJuIGl0ZW0uc2xvdCA+PSBjb25maWcuSU5WRU5UT1JZX1NJWkU7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0ZXF1aXBtZW50ID0gdXRpbC5zaHVmZmxlKGVxdWlwbWVudCk7XHJcblx0XHRcdGVxdWlwbWVudC5zcGxpY2UoLWRyb3BBbW91bnRFUSk7XHJcblx0XHRcdGVxdWlwbWVudC5mb3JFYWNoKGl0ZW0gPT4ge1xyXG5cdFx0XHRcdGl0ZW0ubW92ZVRvTWFwKHRoaXMubWFwSWQsIHRoaXMueCwgdGhpcy55KTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdHRoaXMuY2FsY0JvbnVzU3RhdHMoKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0Ly8gSW52ZW50b3J5XHJcblx0cGlja1VwKCkge1xyXG5cdFx0Y29uc3QgbWFwSXRlbXMgPSBnYW1lLml0ZW1zLmZpbHRlcihpdGVtID0+IHtcclxuXHRcdFx0cmV0dXJuIGl0ZW0ubWFwSWQgPT09IHRoaXMubWFwSWQgJiYgaXRlbS54ID09PSB0aGlzLnggJiYgaXRlbS55ID09PSB0aGlzLnk7XHJcblx0XHR9KTtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbWFwSXRlbXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgaXRlbSA9IG1hcEl0ZW1zW2ldO1xyXG5cdFx0XHRpZiAoIWl0ZW0pIGNvbnRpbnVlO1xyXG5cdFx0XHRcclxuXHRcdFx0aWYgKGl0ZW0uc3RhY2thYmxlKSB7XHJcblx0XHRcdFx0Y29uc3QgaW52ZW50b3J5ID0gdGhpcy5nZXRJbnZlbnRvcnkoKTtcclxuXHRcdFx0XHRpZiAoaW52ZW50b3J5Lmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdGNvbnN0IHNhbWVJdGVtcyA9IGludmVudG9yeS5maWx0ZXIoaW52ZW50b3J5SXRlbSA9PiB7XHJcblx0XHRcdFx0XHRcdHJldHVybiBpbnZlbnRvcnlJdGVtLnRlbXBsYXRlSWQgPT09IGl0ZW0udGVtcGxhdGVJZDtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0aWYgKHNhbWVJdGVtcy5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdHNhbWVJdGVtc1swXS5zdGFjayArPSBpdGVtLnN0YWNrO1xyXG5cdFx0XHRcdFx0XHRpdGVtLnJlbW92ZSgpO1xyXG5cdFx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbnN0IHNsb3QgPSB0aGlzLmZpbmRGaXJzdEVtcHR5U2xvdCgpO1xyXG5cdFx0XHRpZiAoc2xvdCA9PSBudWxsKSByZXR1cm4gZmFsc2U7XHJcblxyXG5cdFx0XHRpdGVtLm1vdmVUb0ludmVudG9yeSh0aGlzLnBsYXllcklkLCB0aGlzLmJvdElkLCBzbG90KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGdldEludmVudG9yeSgpIHtcclxuXHRcdC8vIFNlZSBQbGF5ZXIgYW5kIEJvdCBjbGFzc2VzXHJcblx0fVxyXG5cclxuXHRnZXRJdGVtKHNsb3QpIHtcclxuXHRcdGNvbnN0IGludmVudG9yeSA9IHRoaXMuZ2V0SW52ZW50b3J5KCk7XHJcblx0XHRjb25zdCBpdGVtcyA9IGludmVudG9yeS5maWx0ZXIoaXRlbSA9PiB7XHJcblx0XHRcdHJldHVybiBpdGVtLnNsb3QgPT09IHNsb3Q7XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBpdGVtc1swXTtcclxuXHR9XHJcblxyXG5cdGhhc0l0ZW0odGVtcGxhdGVJZCkge1xyXG5cdFx0Y29uc3QgaW52ZW50b3J5ID0gdGhpcy5nZXRJbnZlbnRvcnkoKTtcclxuXHRcdGNvbnN0IGl0ZW1zID0gZ2FtZS5pdGVtcy5maWx0ZXIoaXRlbSA9PiB7XHJcblx0XHRcdHJldHVybiBpdGVtLnRlbXBsYXRlSWQgPT09IHRlbXBsYXRlSWQ7XHJcblx0XHR9KTtcclxuXHRcdGlmIChpdGVtc1swXS5zdGFja2FibGUpIHtcclxuXHRcdFx0cmV0dXJuIGl0ZW1zWzBdLnN0YWNrO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHJldHVybiBpdGVtcy5sZW5ndGg7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRmaW5kSXRlbVNsb3QodGVtcGxhdGVJZCkge1xyXG5cdFx0Y29uc3QgaW52ZW50b3J5ID0gdGhpcy5nZXRJbnZlbnRvcnkoKTtcclxuXHRcdGNvbnN0IGl0ZW1zID0gaW52ZW50b3J5LmZpbHRlcihpdGVtID0+IHtcclxuXHRcdFx0cmV0dXJuIGl0ZW0udGVtcGxhdGVJZCA9PT0gdGVtcGxhdGVJZDtcclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIGl0ZW1zWzBdLnNsb3Q7XHJcblx0fVxyXG5cclxuXHRmaW5kRmlyc3RFbXB0eVNsb3QoKSB7XHJcblx0XHRjb25zdCBpbnZlbnRvcnkgPSB0aGlzLmdldEludmVudG9yeSgpO1xyXG5cclxuXHRcdGZvciAobGV0IHNsb3QgPSAwOyBzbG90IDwgY29uZmlnLklOVkVOVE9SWV9TSVpFOyBzbG90KyspIHtcclxuXHRcdFx0bGV0IG9jY3VwaWVkID0gZmFsc2U7XHJcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgaW52ZW50b3J5Lmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0aWYgKGludmVudG9yeVtpXS5zbG90ID09PSBzbG90KSB7XHJcblx0XHRcdFx0XHRvY2N1cGllZCA9IHRydWU7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCFvY2N1cGllZCkgcmV0dXJuIHNsb3Q7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9XHJcblxyXG5cdHVzZUl0ZW0oc2xvdCkge1xyXG5cdFx0Y29uc3QgaXRlbSA9IHRoaXMuZ2V0SXRlbShzbG90KTtcclxuXHRcdGlmICghaXRlbSkgcmV0dXJuO1xyXG5cclxuXHRcdC8vIFRPRE86IGlmICghdXNlU2NyaXB0KCkpIHJldHVybjtcclxuXHJcblx0XHRpZiAoaXRlbS5pc0VxdWlwbWVudCgpKSB7XHJcblx0XHRcdGlmIChpdGVtLnNsb3QgPCBjb25maWcuSU5WRU5UT1JZX1NJWkUpIHtcdC8vIENoZWNrIGlmIGl0ZW0gaXMgZXF1aXBwZWRcclxuXHRcdFx0XHR0aGlzLmVxdWlwSXRlbShpdGVtKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0dGhpcy51bmVxdWlwSXRlbShpdGVtKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghaXRlbS5yZXVzYWJsZSkgaXRlbS5yZW1vdmVPbmUoKTtcclxuXHR9XHJcblxyXG5cdGRyb3BJdGVtKHNsb3QpIHtcclxuXHRcdGNvbnN0IGl0ZW0gPSB0aGlzLmdldEl0ZW0oc2xvdCk7XHJcblx0XHRpZiAoIWl0ZW0pIHJldHVybjtcclxuXHRcdGl0ZW0ubW92ZVRvTWFwKHRoaXMubWFwSWQsIHRoaXMueCwgdGhpcy55KTtcclxuXHRcdHRoaXMuY2FsY0JvbnVzU3RhdHMoKTtcclxuXHR9XHJcblxyXG5cdG1vdmVJdGVtVG9TbG90KHNsb3QsIG5ld1Nsb3QpIHtcclxuXHRcdGlmIChzbG90ID09IG51bGwgfHwgbmV3U2xvdCA9PSBudWxsIHx8IHNsb3QgPT09IG5ld1Nsb3QpIHJldHVybjtcdC8vIG51bGwgPT0gdW5kZWZpbmVkLCBudWxsICE9IDBcclxuXHRcdGlmIChzbG90ID49IGNvbmZpZy5JTlZFTlRPUllfU0laRSArIGNvbmZpZy5FUVVJUE1FTlRfU0laRSkgcmV0dXJuO1xyXG5cdFx0aWYgKG5ld1Nsb3QgPj0gY29uZmlnLklOVkVOVE9SWV9TSVpFICsgY29uZmlnLkVRVUlQTUVOVF9TSVpFKSByZXR1cm47XHJcblxyXG5cdFx0Y29uc3QgaXRlbSA9IHRoaXMuZ2V0SXRlbShzbG90KTtcclxuXHRcdGNvbnN0IG5ld0l0ZW0gPSB0aGlzLmdldEl0ZW0obmV3U2xvdCk7XHJcblx0XHRpZiAoIWl0ZW0pIHJldHVybjtcclxuXHJcblx0XHQvLyBUYXJnZXQgc2xvdCBpcyBmb3IgZXF1aXBtZW50IC0gY2hlY2sgdHlwZSBtYXRjaGVzXHJcblx0XHRpZiAobmV3U2xvdCA+PSBjb25maWcuSU5WRU5UT1JZX1NJWkUpIHtcclxuXHRcdFx0aWYgKGl0ZW0uZXF1aXBwZWRTbG90ICsgY29uZmlnLklOVkVOVE9SWV9TSVpFICE9PSBuZXdTbG90KSB7XHJcblx0XHRcdFx0Z2FtZS5zZW5kR2FtZUluZm9QbGF5ZXIodGhpcy5pZCwgXCJUaGF0IGNhbm5vdCBiZSBlcXVpcHBlZCB0aGVyZS5cIik7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3Qgc3dhcFNsb3RzID0gKCkgPT4ge1xyXG5cdFx0XHRpdGVtLnNsb3QgPSBuZXdTbG90O1xyXG5cdFx0XHRpZiAobmV3SXRlbSkgbmV3SXRlbS5zbG90ID0gc2xvdDtcclxuXHRcdFx0dGhpcy5jYWxjQm9udXNTdGF0cygpO1xyXG5cdFx0fTtcclxuXHJcblx0XHQvLyBJRiBObyBuZXcgaXRlbSBpbiBuZXcgc2xvdFxyXG5cdFx0Ly8gT1IgTmV3IGl0ZW0gaW4gbmV3IHNsb3QsIG9sZCBpdGVtIGluIGludmVudG9yeVxyXG5cdFx0Ly8gT1IgTmV3IGl0ZW0gaW4gbmV3IHNsb3QsIG9sZCBpdGVtIGlzIGVxdWlwcGVkLCBuZXcgaXRlbSBjYW4gYmUgZXF1aXBwZWQgaW4gb2xkIHNsb3RcclxuXHRcdGlmICghbmV3SXRlbSB8fCBzbG90IDwgY29uZmlnLklOVkVOVE9SWV9TSVpFIHx8IG5ld0l0ZW0uZXF1aXBwZWRTbG90ICsgY29uZmlnLklOVkVOVE9SWV9TSVpFID09PSBzbG90KSB7XHJcblx0XHRcdHN3YXBTbG90cygpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdC8vIE9sZCBpdGVtIGlzIGVxdWlwcGVkLCBuZXcgaXRlbSBjYW5ub3QgYmUgZXF1aXBwZWQgaW4gb2xkIHNsb3RcclxuXHRcdFx0bmV3U2xvdCA9IHRoaXMuZmluZEZpcnN0RW1wdHlTbG90KCk7XHJcblx0XHRcdGlmIChuZXdTbG90ICE9IG51bGwpIHtcclxuXHRcdFx0XHRzd2FwU2xvdHMoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRnYW1lLnNlbmRHYW1lSW5mb1BsYXllcih0aGlzLmlkLCBcIllvdXIgaW52ZW50b3J5IGlzIGZ1bGwuXCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRlcXVpcEl0ZW0oaXRlbSkge1xyXG5cdFx0Y29uc3QgZXF1aXBwZWRJdGVtID0gdGhpcy5nZXRJdGVtKGl0ZW0uZXF1aXBwZWRTbG90ICsgY29uZmlnLklOVkVOVE9SWV9TSVpFKTtcclxuXHRcdGl0ZW0uc2xvdCA9IGl0ZW0uZXF1aXBwZWRTbG90ICsgY29uZmlnLklOVkVOVE9SWV9TSVpFO1xyXG5cdFx0aWYgKGVxdWlwcGVkSXRlbSkgZXF1aXBwZWRJdGVtLnNsb3QgPSB0aGlzLmZpbmRGaXJzdEVtcHR5U2xvdCgpO1xyXG5cdFx0dGhpcy5jYWxjQm9udXNTdGF0cygpO1xyXG5cdH1cclxuXHJcblx0dW5lcXVpcEl0ZW0oaXRlbSkge1xyXG5cdFx0Y29uc3QgbmV3U2xvdCA9IHRoaXMuZmluZEZpcnN0RW1wdHlTbG90KCk7XHJcblx0XHRpZiAobmV3U2xvdCA9PSBudWxsKSB7XHJcblx0XHRcdGdhbWUuc2VuZEdhbWVJbmZvUGxheWVyKHRoaXMuZ2FtZUlkLCBcIllvdXIgaW52ZW50b3J5IGlzIGZ1bGwuXCIpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRpdGVtLnNsb3QgPSBuZXdTbG90O1xyXG5cdFx0dGhpcy5jYWxjQm9udXNTdGF0cygpO1xyXG5cdH1cclxuXHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHQvLyBJbnZlbnRvcnkgSXRlbSBVcGRhdGVcclxuXHRcdGNvbnN0IGludmVudG9yeSA9IHRoaXMuZ2V0SW52ZW50b3J5KCk7XHJcblx0XHRpbnZlbnRvcnkuZm9yRWFjaChpdGVtID0+IHtcclxuXHRcdFx0aWYgKGl0ZW0pIGl0ZW0udXBkYXRlKCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRpZiAodGhpcy5pc0RlYWQpIHJldHVybjtcclxuXHRcdFxyXG5cdFx0Ly8gQXR0YWNraW5nXHJcblx0XHRpZiAodGhpcy5pc0F0dGFja2luZyB8fCB0aGlzLmF0dGFja1RpbWVyID4gMCkge1xyXG5cdFx0XHR0aGlzLmF0dGFja1RpbWVyICs9IGRlbHRhO1xyXG5cdFx0XHRpZiAodGhpcy5hdHRhY2tUaW1lciA+PSAwLjMpIHRoaXMuaXNBdHRhY2tpbmcgPSBmYWxzZTtcclxuXHRcdFx0aWYgKHRoaXMuYXR0YWNrVGltZXIgPj0gdGhpcy5hdHRhY2tTcGVlZCkgdGhpcy5hdHRhY2tUaW1lciA9IDA7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vIE1vdmVtZW50XHJcblx0XHRpZiAodGhpcy5pc01vdmluZykge1xyXG5cdFx0XHR0aGlzLmxlcnAgKz0gZGVsdGEgKiB0aGlzLm1vdmVTcGVlZDtcclxuXHRcdFx0XHJcblx0XHRcdGlmICh0aGlzLmxlcnAgPj0gMC40OSkge1xyXG5cdFx0XHRcdHRoaXMueCA9IHRoaXMuZGVzdGluYXRpb25YO1xyXG5cdFx0XHRcdHRoaXMueSA9IHRoaXMuZGVzdGluYXRpb25ZO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAodGhpcy5sZXJwID49IDAuOTkpIHtcclxuXHRcdFx0XHR0aGlzLnN0YXJ0WCA9IHRoaXMuZGVzdGluYXRpb25YO1xyXG5cdFx0XHRcdHRoaXMuc3RhcnRZID0gdGhpcy5kZXN0aW5hdGlvblk7XHJcblx0XHRcdFx0dGhpcy5sZXJwID0gMDtcclxuXHRcdFx0XHR0aGlzLmlzTW92aW5nID0gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGdldEludmVudG9yeVBhY2soKSB7XHJcblx0XHRjb25zdCBpbnZlbnRvcnlQYWNrID0gW107XHJcblx0XHRjb25zdCBpbnZlbnRvcnkgPSB0aGlzLmdldEludmVudG9yeSgpO1xyXG5cdFx0aW52ZW50b3J5LmZvckVhY2goKGl0ZW0pID0+IHtcclxuXHRcdFx0aWYgKGl0ZW0pIGludmVudG9yeVBhY2tbaXRlbS5zbG90XSA9IGl0ZW0uZ2V0UGFjaygpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIGludmVudG9yeVBhY2s7XHJcblx0fVxyXG59XHJcbiIsImltcG9ydCBnYW1lIGZyb20gJy4uL2dhbWUuanMnO1xyXG5pbXBvcnQgY29uZmlnIGZyb20gJy4uL2NvbmZpZy5qcyc7XHJcbmltcG9ydCB1dGlsIGZyb20gJy4uL3V0aWwuanMnO1xyXG5pbXBvcnQgQWN0b3IgZnJvbSAnLi9hY3Rvci5qcyc7XHJcblxyXG4vLyBBIEJvdCBpcyBhbiBBY3RvciB3aXRoIGNvbmRpdGlvbmFsIGlucHV0c1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQm90IGV4dGVuZHMgQWN0b3Ige1xyXG5cdGNvbnN0cnVjdG9yKG1hcElkLCB4LCB5LCBkaXJlY3Rpb24sIHRlbXBsYXRlKSB7XHJcblx0XHRzdXBlcihtYXBJZCwgeCwgeSwgZGlyZWN0aW9uLCB0ZW1wbGF0ZS5uYW1lLCB0ZW1wbGF0ZS5zcHJpdGUpO1xyXG5cdFx0dGhpcy5kYW1hZ2VCYXNlID0gdGVtcGxhdGUuZGFtYWdlQmFzZTtcclxuXHRcdHRoaXMuZGVmZW5jZUJhc2UgPSB0ZW1wbGF0ZS5kZWZlbmNlQmFzZTtcclxuXHRcdHRoaXMuaGVhbHRoTWF4QmFzZSA9IHRlbXBsYXRlLmhlYWx0aE1heEJhc2U7XHJcblx0XHR0aGlzLmVuZXJneU1heEJhc2UgPSB0ZW1wbGF0ZS5lbmVyZ3lNYXhCYXNlO1xyXG5cdFx0dGhpcy5yYW5nZUJhc2UgPSB0ZW1wbGF0ZS5yYW5nZUJhc2U7XHJcblx0XHR0aGlzLnJlc3RvcmUoKTtcclxuXHRcdFxyXG5cdFx0dGhpcy5ob3N0aWxlID0gdGVtcGxhdGUuaG9zdGlsZTtcclxuXHRcdHRoaXMudGFyZ2V0ID0gbnVsbDtcclxuXHRcdHRoaXMuc2V0VGFzaygnd2FuZGVyaW5nJyk7XHJcblx0XHR0aGlzLm1vdmVUaW1lciA9IDA7XHJcblxyXG5cdFx0dGhpcy5nYW1lSWQgPSB1dGlsLmZpcnN0RW1wdHlJbmRleChnYW1lLmJvdHMpO1xyXG5cdFx0Z2FtZS5ib3RzW3RoaXMuZ2FtZUlkXSA9IHRoaXM7XHJcblx0fVxyXG5cclxuXHR1cGRhdGUoZGVsdGEpIHtcclxuXHRcdHN1cGVyLnVwZGF0ZShkZWx0YSk7IFx0Ly8gRGVmYXVsdCBBY3RvciBVcGRhdGVcclxuXHRcdGlmICh0aGlzLmlzRGVhZCkgcmV0dXJuO1xyXG5cclxuXHRcdHRoaXMubW92ZVRpbWVyKys7XHJcblx0XHRcclxuXHRcdC8vIEFJIElucHV0c1xyXG5cdFx0c3dpdGNoKHRoaXMudGFzaykge1xyXG5cdFx0XHRjYXNlICd3YW5kZXJpbmcnOlx0XHQvLyBNb3ZlIHJhbmRvbWx5XHJcblx0XHRcdFx0dGhpcy5tb3ZlKCk7XHJcblx0XHRcdFx0dGhpcy5waWNrVXAoKTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ2ZvbGxvd2luZyc6XHRcdC8vIE1vdmUgdG93YXJkcyB0YXJnZXRcclxuXHRcdFx0XHRpZiAodGhpcy50YXJnZXQpIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZVRvVGFyZ2V0KHRoaXMudGFyZ2V0LCBmYWxzZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly8gTm8gdGFyZ2V0XHJcblx0XHRcdFx0XHR0aGlzLnNldFRhc2soJ3dhbmRlcmluZycpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ2F0dGFja2luZyc6XHRcdC8vIE1vdmUgdG93YXJkcyB0YXJnZXQgYW5kIGF0dGFja1xyXG5cdFx0XHRcdGlmICh0aGlzLnRhcmdldCkge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlVG9UYXJnZXQodGhpcy50YXJnZXQsIHRydWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdC8vIE5vIHRhcmdldFxyXG5cdFx0XHRcdFx0dGhpcy5zZXRUYXNrKCd3YW5kZXJpbmcnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHQvLyBjYXNlICdpZGxlJzpcclxuXHRcdFx0ZGVmYXVsdDogXHRcdFx0XHRcdC8vIFN0YW5kIHN0aWxsXHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gdGhpcy5nZXRQYWNrKCk7XHJcblx0fVxyXG5cdFxyXG5cdGdldFBhY2soKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRnYW1lSWQ6IHRoaXMuZ2FtZUlkLFxyXG5cdFx0XHRuYW1lOiB0aGlzLm5hbWUsXHJcblx0XHRcdHNwcml0ZTogdGhpcy5zcHJpdGUsXHJcblx0XHRcdGRpcmVjdGlvbjogdGhpcy5kaXJlY3Rpb24sXHJcblx0XHRcdG1hcElkOiB0aGlzLm1hcElkLFxyXG5cdFx0XHR4OiB0aGlzLnN0YXJ0WCxcclxuXHRcdFx0eTogdGhpcy5zdGFydFksXHJcblx0XHRcdHo6IHRoaXMueixcclxuXHRcdFx0ZGVzdGluYXRpb25YOiB0aGlzLmRlc3RpbmF0aW9uWCxcclxuXHRcdFx0ZGVzdGluYXRpb25ZOiB0aGlzLmRlc3RpbmF0aW9uWSxcclxuXHRcdFx0bGVycDogdGhpcy5sZXJwLFxyXG5cdFx0XHRpc1J1bm5pbmc6IHRoaXMuaXNSdW5uaW5nLFxyXG5cdFx0XHRpc0F0dGFja2luZzogdGhpcy5pc0F0dGFja2luZyxcclxuXHRcdFx0aXNEZWFkOiBmYWxzZSxcclxuXHRcdFx0aXNWaXNpYmxlOiB0aGlzLmlzVmlzaWJsZVxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdHJlbW92ZSgpIHtcclxuXHRcdGRlbGV0ZSBnYW1lLmJvdHNbdGhpcy5nYW1lSWRdO1xyXG5cdH1cclxuXHRcclxuXHRtb3ZlKGRpcmVjdGlvbikge1xyXG5cdFx0bGV0IG1vdmVUaW1lID0gMjQ7XHJcblx0XHRpZiAodGhpcy5pc1J1bm5pbmcpIG1vdmVUaW1lID0gMTc7XHJcblx0XHRpZiAodGhpcy5tb3ZlVGltZXIgPiBtb3ZlVGltZSAmJiB0aGlzLmF0dGFja1RpbWVyID09PSAwKSB7XHJcblx0XHRcdHN1cGVyLm1vdmUoZGlyZWN0aW9uKTtcclxuXHRcdFx0dGhpcy5tb3ZlVGltZXIgPSAwO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHR0YWtlRGFtYWdlKGRhbWFnZSwgYXR0YWNrZXIpIHtcclxuXHRcdGlmIChhdHRhY2tlciBpbnN0YW5jZW9mIEFjdG9yKSB0aGlzLnNldFRhc2soJ2F0dGFja2luZycsIGF0dGFja2VyKTtcclxuXHRcdHN1cGVyLnRha2VEYW1hZ2UoZGFtYWdlLCBhdHRhY2tlcik7XHJcblx0fVxyXG5cdFxyXG5cdHBpY2tVcCgpIHtcclxuXHRcdHN1cGVyLnBpY2tVcCgpO1xyXG5cdFx0dGhpcy5jaGVja0Jlc3RFcXVpcG1lbnQoKTtcclxuXHR9XHJcblxyXG5cdGdldEludmVudG9yeSgpIHtcclxuXHRcdGNvbnN0IGludmVudG9yeSA9IGdhbWUuaXRlbXMuZmlsdGVyKGl0ZW0gPT4ge1xyXG5cdFx0XHRyZXR1cm4gaXRlbS5ib3RJZCA9PT0gdGhpcy5ib3RJZDtcclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIGludmVudG9yeTtcclxuXHR9XHJcblxyXG5cdHNldERlYWQoKSB7XHJcblx0XHRzdXBlci5zZXREZWFkKCk7XHJcblx0XHR0aGlzLnJlbW92ZSgpO1xyXG5cdH1cclxuXHJcblx0Ly8gSW5wdXRzXHJcblx0c2V0VGFzayh0YXNrLCB0YXJnZXQpIHtcclxuXHRcdHN3aXRjaCAodGFzaykge1xyXG5cdFx0XHRjYXNlICd3YW5kZXJpbmcnOlxyXG5cdFx0XHRcdHRoaXMubGF6aW5lc3MgPSA3O1xyXG5cdFx0XHRcdHRoaXMudGFyZ2V0ID0gbnVsbDtcclxuXHRcdFx0XHR0aGlzLnRhc2sgPSB0YXNrO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnZm9sbG93aW5nJzpcclxuXHRcdFx0XHRpZiAodGFyZ2V0ID09PSBudWxsKSB7XHJcblx0XHRcdFx0XHR0aGlzLnNldFRhc2soJ3dhbmRlcmluZycpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubGF6aW5lc3MgPSAwO1xyXG5cdFx0XHRcdFx0dGhpcy50YXJnZXQgPSB0YXJnZXQ7XHJcblx0XHRcdFx0XHR0aGlzLnRhc2sgPSB0YXNrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ2F0dGFja2luZyc6XHJcblx0XHRcdFx0aWYgKHRhcmdldCA9PT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0dGhpcy5zZXRUYXNrKCd3YW5kZXJpbmcnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLmxhemluZXNzID0gMDtcclxuXHRcdFx0XHRcdHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xyXG5cdFx0XHRcdFx0dGhpcy50YXNrID0gdGFzaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRkZWZhdWx0Olx0Ly9pZGxpbmdcclxuXHRcdFx0XHR0aGlzLmxhemluZXNzID0gNztcclxuXHRcdFx0XHR0aGlzLnRhcmdldCA9IG51bGw7XHJcblx0XHRcdFx0dGhpcy50YXNrID0gJ2lkbGUnO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0Y2hlY2tCZXN0RXF1aXBtZW50KCkge1xyXG5cdFx0Y29uc3QgaW52ZW50b3J5ID0gdGhpcy5nZXRJbnZlbnRvcnkoKTtcclxuXHRcdGNvbnN0IGVxdWlwbWVudCA9IFtdO1xyXG5cdFx0Zm9yIChsZXQgc2xvdCA9IDA7IHNsb3QgPCBjb25maWcuRVFVSVBNRU5UX1NJWkU7IHNsb3QrKykge1xyXG5cdFx0XHRlcXVpcG1lbnQucHVzaChbXSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBpbnZlbnRvcnkubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgaXRlbSA9IGludmVudG9yeVtpXTtcclxuXHRcdFx0Zm9yIChsZXQgc2xvdCA9IDA7IHNsb3QgPCBjb25maWcuRVFVSVBNRU5UX1NJWkU7IHNsb3QrKykge1xyXG5cdFx0XHRcdGlmIChpdGVtLmVxdWlwcGVkU2xvdCA9PT0gc2xvdCkge1xyXG5cdFx0XHRcdFx0ZXF1aXBtZW50W3Nsb3RdLnB1c2goaXRlbSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGVxdWlwbWVudFswXS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdGVxdWlwbWVudFswXS5zb3J0KChhLCBiKSA9PiBiLmVxdWlwcGVkLmRhbWFnZSAtIGEuZXF1aXBwZWQuZGFtYWdlKTtcclxuXHRcdFx0dGhpcy5lcXVpcEl0ZW0oZXF1aXBtZW50WzBdWzBdKTtcclxuXHRcdH1cclxuXHRcdGlmIChlcXVpcG1lbnRbMV0ubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRlcXVpcG1lbnRbMV0uc29ydCgoYSwgYikgPT4gYi5lcXVpcHBlZC5kZWZlbmNlIC0gYS5lcXVpcHBlZC5kZWZlbmNlKTtcclxuXHRcdFx0dGhpcy5lcXVpcEl0ZW0oZXF1aXBtZW50WzFdWzBdKTtcclxuXHRcdH1cclxuXHRcdGlmIChlcXVpcG1lbnRbMl0ubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRlcXVpcG1lbnRbMl0uc29ydCgoYSwgYikgPT4gYi5lcXVpcHBlZC5kZWZlbmNlIC0gYS5lcXVpcHBlZC5kZWZlbmNlKTtcclxuXHRcdFx0dGhpcy5lcXVpcEl0ZW0oZXF1aXBtZW50WzJdWzBdKTtcclxuXHRcdH1cclxuXHRcdGlmIChlcXVpcG1lbnRbM10ubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRlcXVpcG1lbnRbM10uc29ydCgoYSwgYikgPT4gYi5lcXVpcHBlZC5kZWZlbmNlIC0gYS5lcXVpcHBlZC5kZWZlbmNlKTtcclxuXHRcdFx0dGhpcy5lcXVpcEl0ZW0oZXF1aXBtZW50WzNdWzBdKTtcclxuXHRcdH1cclxuXHRcdGlmIChlcXVpcG1lbnRbNF0ubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRlcXVpcG1lbnRbNF0uc29ydCgoYSwgYikgPT4gYi5lcXVpcHBlZC5kZWZlbmNlIC0gYS5lcXVpcHBlZC5kZWZlbmNlKTtcclxuXHRcdFx0dGhpcy5lcXVpcEl0ZW0oZXF1aXBtZW50WzRdWzBdKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuIiwiaW1wb3J0IEVudGl0eSBmcm9tICcuL2VudGl0eS5qcyc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4uL2dhbWUuanMnO1xyXG5pbXBvcnQgY29uZmlnIGZyb20gJy4uL2NvbmZpZy5qcyc7XHJcbmltcG9ydCB1dGlsIGZyb20gJy4uL3V0aWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWZmZWN0IGV4dGVuZHMgRW50aXR5IHtcclxuXHRjb25zdHJ1Y3RvcihtYXBJZCwgeCwgeSwgc3ByaXRlID0gMCwgbG9vcCA9IDAsIHNwZWVkID0gMTIsIG1heEZyYW1lID0gNywgc3RhcnRGcmFtZSA9IDApIHtcclxuXHRcdHN1cGVyKG1hcElkLCB4LCB5LCB1dGlsLmNsYW1wKHNwcml0ZSwgMCwgY29uZmlnLk1BWF9FRkZFQ1RTIC0gMSkpO1xyXG5cdFx0dGhpcy5tYXhGcmFtZSA9IHV0aWwuY2xhbXAobWF4RnJhbWUsIDAsIDcpO1xyXG5cdFx0dGhpcy5zdGFydEZyYW1lID0gdXRpbC5jbGFtcChzdGFydEZyYW1lLCAwLCB0aGlzLm1heEZyYW1lKTtcclxuXHRcdHRoaXMuY3VycmVudEZyYW1lID0gdGhpcy5zdGFydEZyYW1lO1xyXG5cdFx0XHJcblx0XHR0aGlzLmxvb3AgPSBsb29wO1xyXG5cdFx0dGhpcy5zcGVlZCA9IHNwZWVkO1xyXG5cdFx0dGhpcy50aW1lciA9IDA7XHJcblx0XHRcclxuXHRcdHRoaXMuZ2FtZUlkID0gdXRpbC5maXJzdEVtcHR5SW5kZXgoZ2FtZS5lZmZlY3RzKTtcclxuXHRcdGdhbWUuZWZmZWN0c1t0aGlzLmdhbWVJZF0gPSB0aGlzO1xyXG5cdH1cclxuXHRcclxuXHR1cGRhdGUoZGVsdGEpIHtcclxuXHRcdHRoaXMudGltZXIgKz0gZGVsdGE7XHJcblx0XHRcclxuXHRcdGlmICh0aGlzLnRpbWVyID49IDEgLyB0aGlzLnNwZWVkKSB7XHJcblx0XHRcdHRoaXMudGltZXIgPSAwO1xyXG5cdFx0XHR0aGlzLmN1cnJlbnRGcmFtZSsrO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuY3VycmVudEZyYW1lID4gdGhpcy5tYXhGcmFtZSkge1xyXG5cdFx0XHRcdGlmICh0aGlzLmxvb3AgPCAwKSB7XHJcblx0XHRcdFx0XHR0aGlzLmN1cnJlbnRGcmFtZSA9IHRoaXMuc3RhcnRGcmFtZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBpZiAodGhpcy5sb29wID4gMCkge1xyXG5cdFx0XHRcdFx0dGhpcy5jdXJyZW50RnJhbWUgPSB0aGlzLnN0YXJ0RnJhbWU7XHJcblx0XHRcdFx0XHR0aGlzLmxvb3AtLTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLmN1cnJlbnRGcmFtZSA9IHRoaXMubWF4RnJhbWU7XHJcblx0XHRcdFx0XHR0aGlzLnJlbW92ZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0aGlzLmdldFBhY2soKTtcclxuXHR9XHJcblx0XHJcblx0Z2V0UGFjaygpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGdhbWVJZDogdGhpcy5nYW1lSWQsXHJcblx0XHRcdG1hcElkOiB0aGlzLm1hcElkLFxyXG5cdFx0XHR4OiB0aGlzLngsXHJcblx0XHRcdHk6IHRoaXMueSxcclxuXHRcdFx0c3ByaXRlOiB0aGlzLnNwcml0ZSxcclxuXHRcdFx0Y3VycmVudEZyYW1lOiB0aGlzLmN1cnJlbnRGcmFtZVxyXG5cdFx0fTtcclxuXHR9XHJcblx0XHJcblx0cmVtb3ZlKCkge1xyXG5cdFx0ZGVsZXRlIGdhbWUuZWZmZWN0c1t0aGlzLmdhbWVJZF07XHJcblx0fVx0XHJcbn1cclxuIiwiaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9jb25maWcuanMnO1xyXG5cclxuLy8gQW4gRW50aXR5IGlzIGFueSBvYmplY3Qgd2hpY2ggY2FuIGFwcGVhciBvbiB0aGUgbWFwXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbnRpdHkge1xyXG5cdGNvbnN0cnVjdG9yKG1hcElkLCB4LCB5LCBzcHJpdGUgPSAxKSB7XHJcblx0XHR0aGlzLm1hcElkID0gbWFwSWQ7XHJcblx0XHR0aGlzLnggPSB4O1xyXG5cdFx0dGhpcy55ID0geTtcclxuXHRcdGlmIChzcHJpdGUgPCAxKSBzcHJpdGUgPSAxO1xyXG5cdFx0dGhpcy5zcHJpdGUgPSBzcHJpdGU7XHJcblx0XHR0aGlzLmlzVmlzaWJsZSA9IHRydWU7XHJcblx0fVxyXG59XHJcbiIsImltcG9ydCBnYW1lIGZyb20gJy4uL2dhbWUuanMnO1xyXG5pbXBvcnQgdXRpbCBmcm9tICcuLi91dGlsLmpzJztcclxuaW1wb3J0IEVudGl0eSBmcm9tICcuL2VudGl0eS5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJdGVtIGV4dGVuZHMgRW50aXR5IHtcclxuXHRjb25zdHJ1Y3Rvcihwb3NpdGlvbiwgdGVtcGxhdGUsIHN0YWNrKSB7XHJcblx0XHRpZiAocG9zaXRpb24ucGxheWVySWQgPT09IHVuZGVmaW5lZCkgcG9zaXRpb24ucGxheWVySWQgPSBudWxsO1xyXG5cdFx0aWYgKHBvc2l0aW9uLmJvdElkID09PSB1bmRlZmluZWQpIHBvc2l0aW9uLmJvdElkID0gbnVsbDtcclxuXHRcdGlmIChwb3NpdGlvbi5zbG90ID09PSB1bmRlZmluZWQpIHBvc2l0aW9uLnNsb3QgPSBudWxsO1xyXG5cdFx0aWYgKHBvc2l0aW9uLm1hcElkID09PSB1bmRlZmluZWQpIHBvc2l0aW9uLm1hcElkID0gbnVsbDtcclxuXHRcdGlmIChwb3NpdGlvbi54ID09PSB1bmRlZmluZWQpIHBvc2l0aW9uLnggPSBudWxsO1xyXG5cdFx0aWYgKHBvc2l0aW9uLnkgPT09IHVuZGVmaW5lZCkgcG9zaXRpb24ueSA9IG51bGw7XHJcblxyXG5cdFx0c3VwZXIocG9zaXRpb24ubWFwSWQsIHBvc2l0aW9uLngsIHBvc2l0aW9uLnksIHRlbXBsYXRlLnNwcml0ZSk7XHJcblx0XHR0aGlzLnogPSAtMTA7XHJcblx0XHR0aGlzLnBsYXllcklkID0gcG9zaXRpb24ucGxheWVySWQ7XHJcblx0XHR0aGlzLmJvdElkID0gcG9zaXRpb24uYm90SWQ7XHJcblx0XHR0aGlzLnNsb3QgPSBwb3NpdGlvbi5zbG90O1xyXG5cdFx0XHJcblx0XHR0aGlzLnRlbXBsYXRlSWQgPSB0ZW1wbGF0ZS5faWQ7XHJcblx0XHR0aGlzLm5hbWUgPSB0ZW1wbGF0ZS5uYW1lO1xyXG5cdFx0dGhpcy5kZXNjcmlwdGlvbiA9IHRlbXBsYXRlLmRlc2NyaXB0aW9uO1xyXG5cdFx0dGhpcy5yZXVzYWJsZSA9IHRlbXBsYXRlLnJldXNhYmxlO1xyXG5cclxuXHRcdHRoaXMudHlwZSA9IHRlbXBsYXRlLnR5cGUubmFtZTtcclxuXHRcdHRoaXMuc3RhY2thYmxlID0gdGVtcGxhdGUudHlwZS5zdGFja2FibGU7XHJcblx0XHR0aGlzLmVxdWlwcGVkU2xvdCA9IHRlbXBsYXRlLnR5cGUuZXF1aXBwZWRTbG90O1xyXG5cdFx0XHJcblx0XHR0aGlzLnBhc3NpdmUgPSB7XHJcblx0XHRcdGRhbWFnZTogdGVtcGxhdGUucGFzc2l2ZURhbWFnZSxcclxuXHRcdFx0ZGVmZW5jZTogdGVtcGxhdGUucGFzc2l2ZURlZmVuY2UsXHJcblx0XHRcdGhlYWx0aE1heDogdGVtcGxhdGUucGFzc2l2ZUhlYWx0aE1heCxcclxuXHRcdFx0ZW5lcmd5TWF4OiB0ZW1wbGF0ZS5wYXNzaXZlRW5lcmd5TWF4LFxyXG5cdFx0XHRyYW5nZTogdGVtcGxhdGUucGFzc2l2ZVJhbmdlXHJcblx0XHR9O1xyXG5cdFx0dGhpcy5lcXVpcHBlZCA9IHtcclxuXHRcdFx0ZGFtYWdlOiB0ZW1wbGF0ZS5lcXVpcHBlZERhbWFnZSxcclxuXHRcdFx0ZGVmZW5jZTogdGVtcGxhdGUuZXF1aXBwZWREZWZlbmNlLFxyXG5cdFx0XHRoZWFsdGhNYXg6IHRlbXBsYXRlLmVxdWlwcGVkSGVhbHRoTWF4LFxyXG5cdFx0XHRlbmVyZ3lNYXg6IHRlbXBsYXRlLmVxdWlwcGVkRW5lcmd5TWF4LFxyXG5cdFx0XHRyYW5nZTogdGVtcGxhdGUuZXF1aXBwZWRSYW5nZVxyXG5cdFx0fTtcclxuXHRcdFxyXG5cdFx0aWYgKHRoaXMuc3RhY2thYmxlKSB7XHJcblx0XHRcdGlmIChzdGFjayA8IDEpIHN0YWNrID0gMTtcclxuXHRcdFx0dGhpcy5zdGFjayA9IHN0YWNrO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHRoaXMuc3RhY2sgPSAwO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuZ2FtZUlkID0gdXRpbC5maXJzdEVtcHR5SW5kZXgoZ2FtZS5pdGVtcyk7XHJcblx0XHRnYW1lLml0ZW1zW3RoaXMuZ2FtZUlkXSA9IHRoaXM7XHJcblx0fVxyXG5cclxuXHR1cGRhdGUoZGVsdGEpIHtcclxuXHRcdHJldHVybiB0aGlzLmdldFBhY2soKTtcclxuXHR9XHJcblxyXG5cdGdldFBhY2soKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRnYW1lSWQ6IHRoaXMuZ2FtZUlkLFxyXG5cdFx0XHRwbGF5ZXJJZDogdGhpcy5wbGF5ZXJJZCxcclxuXHRcdFx0Ym90SWQ6IHRoaXMuYm90SWQsXHJcblx0XHRcdHNsb3Q6IHRoaXMuc2xvdCxcclxuXHRcdFx0bWFwSWQ6IHRoaXMubWFwSWQsXHJcblx0XHRcdHg6IHRoaXMueCxcclxuXHRcdFx0eTogdGhpcy55LFxyXG5cdFx0XHR6OiB0aGlzLnosXHJcblx0XHRcdG5hbWU6IHRoaXMubmFtZSxcclxuXHRcdFx0ZGVzY3JpcHRpb246IHRoaXMuZGVzY3JpcHRpb24sXHJcblx0XHRcdHNwcml0ZTogdGhpcy5zcHJpdGUsXHJcblx0XHRcdHR5cGU6IHRoaXMudHlwZSxcclxuXHRcdFx0cmV1c2FibGU6IHRoaXMucmV1c2FibGUsXHJcblx0XHRcdHBhc3NpdmU6IHRoaXMucGFzc2l2ZSxcclxuXHRcdFx0ZXF1aXBwZWQ6IHRoaXMuZXF1aXBwZWQsXHJcblx0XHRcdHN0YWNrOiB0aGlzLnN0YWNrLFxyXG5cdFx0XHRpc1Zpc2libGU6IHRoaXMuaXNWaXNpYmxlXHJcblx0XHR9O1xyXG5cdH1cclxuXHRcclxuXHRyZW1vdmUoKSB7XHJcblx0XHRkZWxldGUgZ2FtZS5pdGVtc1t0aGlzLmdhbWVJZF07XHJcblx0fVxyXG5cclxuXHRyZW1vdmVPbmUoKSB7XHJcblx0XHRpZiAodGhpcy5zdGFjayA+IDEpIHtcclxuXHRcdFx0dGhpcy5zdGFjay0tO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHRoaXMucmVtb3ZlKCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRtb3ZlVG9JbnZlbnRvcnkocGxheWVySWQsIGJvdElkLCBzbG90KSB7XHJcblx0XHR0aGlzLnBsYXllcklkID0gcGxheWVySWQ7XHJcblx0XHR0aGlzLmJvdElkID0gYm90SWQ7XHJcblx0XHR0aGlzLnNsb3QgPSBzbG90O1xyXG5cdFx0dGhpcy5tYXBJZCA9IG51bGw7XHJcblx0XHR0aGlzLnggPSBudWxsO1xyXG5cdFx0dGhpcy55ID0gbnVsbDtcclxuXHRcdHRoaXMueiA9IG51bGw7XHJcblx0fVxyXG5cclxuXHRtb3ZlVG9NYXAobWFwSWQsIHgsIHkpIHtcclxuXHRcdHRoaXMubWFwSWQgPSBtYXBJZDtcclxuXHRcdHRoaXMueCA9IHg7XHJcblx0XHR0aGlzLnkgPSB5O1xyXG5cdFx0dGhpcy56ID0gdGhpcy5nZXRaUG9zaXRpb24obWFwSWQsIHgsIHkpO1xyXG5cdFx0dGhpcy5wbGF5ZXJJZCA9IG51bGw7XHJcblx0XHR0aGlzLmJvdElkID0gbnVsbDtcclxuXHRcdHRoaXMuc2xvdCA9IG51bGw7XHJcblx0fVxyXG5cdFxyXG5cdGdldFpQb3NpdGlvbihtYXBJZCwgeCwgeSkge1xyXG5cdFx0cmV0dXJuIC0xMDtcclxuXHR9XHJcblxyXG5cdGlzRXF1aXBtZW50KCkge1xyXG5cdFx0aWYgKHRoaXMuZXF1aXBwZWRTbG90ID49IDApIHtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG4iLCJpbXBvcnQgY29uZmlnIGZyb20gJy4uL2NvbmZpZy5qcyc7XHJcbmltcG9ydCB1dGlsIGZyb20gJy4uL3V0aWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFwIHtcclxuXHRjb25zdHJ1Y3RvcihtYXBJZCwgZGF0YSA9IHt9KSB7XHJcblx0XHR0aGlzLm1hcElkID0gbWFwSWQ7XHJcblxyXG5cdFx0aWYgKGRhdGEubmFtZSA9PSBudWxsKSBkYXRhLm5hbWUgPSBcIkJsYW5rIE1hcFwiO1xyXG5cdFx0aWYgKGRhdGEuZHJvcENoYW5jZSA9PSBudWxsKSBkYXRhLmRyb3BDaGFuY2UgPSAxMDA7XHJcblx0XHRpZiAoZGF0YS5kcm9wQW1vdW50RVEgPT0gbnVsbCkgZGF0YS5kcm9wQW1vdW50RVEgPSAxO1xyXG5cdFx0aWYgKCFkYXRhLnRpbGVzKSBkYXRhLnRpbGVzID0gdXRpbC5jcmVhdGUzZEFycmF5KGNvbmZpZy5NQVBfQ09MVU1OUywgY29uZmlnLk1BUF9ST1dTLCBjb25maWcuTUFQX0xBWUVSUywgMCk7XHJcblx0XHRpZiAoIWRhdGEuaXNXYWxsKSBkYXRhLmlzV2FsbCA9IHV0aWwuY3JlYXRlMmRBcnJheShjb25maWcuTUFQX0NPTFVNTlMsIGNvbmZpZy5NQVBfUk9XUywgZmFsc2UpO1xyXG5cdFx0aWYgKCFkYXRhLmlzSG9zdGlsZSkgZGF0YS5pc0hvc3RpbGUgPSB1dGlsLmNyZWF0ZTJkQXJyYXkoY29uZmlnLk1BUF9DT0xVTU5TLCBjb25maWcuTUFQX1JPV1MsIGZhbHNlKTtcclxuXHRcdGlmICghZGF0YS5kYW1hZ2UpIGRhdGEuZGFtYWdlID0gdXRpbC5jcmVhdGUyZEFycmF5KGNvbmZpZy5NQVBfQ09MVU1OUywgY29uZmlnLk1BUF9ST1dTLCBudWxsKTtcclxuXHRcdGlmICghZGF0YS53YXJwTWFwKSBkYXRhLndhcnBNYXAgPSB1dGlsLmNyZWF0ZTJkQXJyYXkoY29uZmlnLk1BUF9DT0xVTU5TLCBjb25maWcuTUFQX1JPV1MsIG51bGwpO1xyXG5cdFx0aWYgKCFkYXRhLndhcnBYKSBkYXRhLndhcnBYID0gdXRpbC5jcmVhdGUyZEFycmF5KGNvbmZpZy5NQVBfQ09MVU1OUywgY29uZmlnLk1BUF9ST1dTLCBudWxsKTtcclxuXHRcdGlmICghZGF0YS53YXJwWSkgZGF0YS53YXJwWSA9IHV0aWwuY3JlYXRlMmRBcnJheShjb25maWcuTUFQX0NPTFVNTlMsIGNvbmZpZy5NQVBfUk9XUywgbnVsbCk7XHJcblxyXG5cdFx0dGhpcy5uYW1lID0gZGF0YS5uYW1lO1xyXG5cdFx0dGhpcy5kcm9wQ2hhbmNlID0gdXRpbC5jbGFtcChkYXRhLmRyb3BDaGFuY2UsIDAsIDEwMCk7XHJcblx0XHR0aGlzLmRyb3BBbW91bnRFUSA9IHV0aWwuY2xhbXAoZGF0YS5kcm9wQW1vdW50RVEsIDAsIGNvbmZpZy5FUVVJUE1FTlRfU0laRSk7XHJcblx0XHQvL3RoaXMuZHJvcENoYW5jZSA9IDAgPSAwJSBjaGFuY2UgdG8gZHJvcCBpdGVtcyBpbiBpbnZlbnRvcnkgKGRyb3Agbm90aGluZyksIDEwMCA9IDEwMCUgY2hhbmNlIHRvIGRyb3AgKGRyb3AgZXZlcnl0aGluZylcclxuXHRcdC8vdGhpcy5kcm9wQW1vdW50RVEgPSBudW1iZXIgb2YgZXF1aXBwZWQgaXRlbXMgdGhlIHBsYXllciB3aWxsIGRyb3Agb24gZGVhdGguIGRyb3BFUSA9IEVRVUlQTUVOVF9TSVpFID0gZHJvcCBhbGwgZXF1aXBtZW50XHJcblx0XHR0aGlzLnRpbGVzID0gZGF0YS50aWxlcztcclxuXHRcdHRoaXMuaXNXYWxsID0gZGF0YS5pc1dhbGw7XHJcblx0XHR0aGlzLmlzSG9zdGlsZSA9IGRhdGEuaXNIb3N0aWxlO1xyXG5cdFx0dGhpcy5kYW1hZ2UgPSBkYXRhLmRhbWFnZTtcclxuXHRcdHRoaXMud2FycE1hcCA9IGRhdGEud2FycE1hcDtcclxuXHRcdHRoaXMud2FycFggPSBkYXRhLndhcnBYO1xyXG5cdFx0dGhpcy53YXJwWSA9IGRhdGEud2FycFk7XHJcblx0fVxyXG5cdFxyXG5cdHVwbG9hZChkYXRhKSB7XHJcblx0XHRpZiAoZGF0YS5uYW1lICE9IG51bGwpIHRoaXMubmFtZSA9IGRhdGEubmFtZTtcclxuXHRcdGlmIChkYXRhLmRyb3BDaGFuY2UgIT0gbnVsbCkgdGhpcy5kcm9wQ2hhbmNlID0gZGF0YS5kcm9wQ2hhbmNlO1xyXG5cdFx0aWYgKGRhdGEuZHJvcEFtb3VudEVRICE9IG51bGwpIHRoaXMuZHJvcEFtb3VudEVRID0gZGF0YS5kcm9wQW1vdW50RVE7XHJcblx0XHRpZiAoZGF0YS50aWxlcykgdGhpcy50aWxlcyA9IGRhdGEudGlsZXM7XHJcblx0XHRpZiAoZGF0YS5pc1dhbGwpIHRoaXMuaXNXYWxsID0gZGF0YS5pc1dhbGw7XHJcblx0XHRpZiAoZGF0YS5pc0hvc3RpbGUpIHRoaXMuaXNIb3N0aWxlID0gZGF0YS5pc0hvc3RpbGU7XHJcblx0XHRpZiAoZGF0YS5kYW1hZ2UpIHRoaXMuZGFtYWdlID0gZGF0YS5kYW1hZ2U7XHJcblx0XHRpZiAoZGF0YS53YXJwTWFwKSB0aGlzLndhcnBNYXAgPSBkYXRhLndhcnBNYXA7XHJcblx0XHRpZiAoZGF0YS53YXJwWCkgdGhpcy53YXJwWCA9IGRhdGEud2FycFg7XHJcblx0XHRpZiAoZGF0YS53YXJwWSkgdGhpcy53YXJwWSA9IGRhdGEud2FycFk7XHJcblx0fVxyXG5cclxuXHRnZXRQYWNrKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0bWFwSWQ6IHRoaXMubWFwSWQsXHJcblx0XHRcdG5hbWU6IHRoaXMubmFtZSxcclxuXHRcdFx0ZHJvcENoYW5jZTogdGhpcy5kcm9wQ2hhbmNlLFxyXG5cdFx0XHRkcm9wQW1vdW50RVE6IHRoaXMuZHJvcEFtb3VudEVRLFxyXG5cdFx0XHR0aWxlczogdGhpcy50aWxlcyxcclxuXHRcdFx0aXNXYWxsOiB0aGlzLmlzV2FsbCxcclxuXHRcdFx0aXNIb3N0aWxlOiB0aGlzLmlzSG9zdGlsZSxcclxuXHRcdFx0ZGFtYWdlOiB0aGlzLmRhbWFnZSxcclxuXHRcdFx0d2FycE1hcDogdGhpcy53YXJwTWFwLFxyXG5cdFx0XHR3YXJwWDogdGhpcy53YXJwWCxcclxuXHRcdFx0d2FycFk6IHRoaXMud2FycFlcclxuXHRcdH07XHJcblx0fVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIE1lc3NhZ2Uge1xyXG5cdGNvbnN0cnVjdG9yKHNlbmRlcklkLCBtZXNzYWdlLCB0eXBlLCBtYXBJZCwgaWQsIGNvbG91cikge1xyXG5cdFx0dGhpcy5zZW5kZXJJZCA9IHNlbmRlcklkOyAvLyBudWxsID0gc2VydmVyXHJcblx0XHR0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xyXG5cdFx0dGhpcy50eXBlID0gdHlwZTtcclxuXHRcdHRoaXMubWFwSWQgPSBtYXBJZDtcclxuXHRcdHRoaXMuaWQgPSBpZDtcclxuXHRcdHRoaXMuY29sb3VyID0gY29sb3VyO1xyXG5cdH1cclxufSIsImltcG9ydCBnYW1lIGZyb20gJy4uL2dhbWUuanMnO1xyXG5pbXBvcnQgY29uZmlnIGZyb20gJy4uL2NvbmZpZy5qcyc7XHJcbmltcG9ydCB1dGlsIGZyb20gJy4uL3V0aWwuanMnO1xyXG5pbXBvcnQgQWN0b3IgZnJvbSAnLi9hY3Rvci5qcyc7XHJcbmltcG9ydCBpdGVtVGVtcGxhdGUgZnJvbSAnLi4vbW9kZWxzL2l0ZW1UZW1wbGF0ZS5qcyc7XHJcblxyXG4vLyBBIFBsYXllciBpcyBhbiBpbW1vcnRhbCBBY3RvciB3aGljaCB0YWtlcyBpbnB1dCBmcm9tIGEgY2xpZW50XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF5ZXIgZXh0ZW5kcyBBY3RvciB7XHJcblx0Y29uc3RydWN0b3Ioc29ja2V0SWQsIGRhdGEpIHtcclxuXHRcdGlmIChkYXRhLnNwcml0ZSA9PSBudWxsKSBkYXRhLnNwcml0ZSA9IGRhdGEudGVtcGxhdGUuc3ByaXRlO1xyXG5cclxuXHRcdHN1cGVyKGRhdGEubWFwSWQsIGRhdGEueCwgZGF0YS55LCBkYXRhLmRpcmVjdGlvbiwgZGF0YS5uYW1lLCBkYXRhLnNwcml0ZSk7XHJcblx0XHR0aGlzLmlkID0gZGF0YS5faWQ7XHJcblx0XHR0aGlzLnNvY2tldElkID0gc29ja2V0SWQ7XHJcblx0XHR0aGlzLmFjY291bnRJZCA9IGRhdGEuYWNjb3VudDtcclxuXHRcdHRoaXMuYWRtaW5BY2Nlc3MgPSBkYXRhLmFkbWluQWNjZXNzO1xyXG5cclxuXHRcdHRoaXMubGV2ZWwgPSBkYXRhLmxldmVsO1xyXG5cdFx0dGhpcy5leHBlcmllbmNlID0gZGF0YS5leHBlcmllbmNlO1xyXG5cdFx0dGhpcy50ZW1wbGF0ZUlkID0gZGF0YS50ZW1wbGF0ZS5faWQ7XHJcblx0XHR0aGlzLnRlbXBsYXRlID0gZGF0YS50ZW1wbGF0ZS5uYW1lO1xyXG5cdFx0dGhpcy5jYWxjQmFzZVN0YXRzKGRhdGEudGVtcGxhdGUpO1xyXG5cdFx0dGhpcy5yZXN0b3JlKCk7XHJcblxyXG5cdFx0dGhpcy5pc0RlYWQgPSBmYWxzZTtcclxuXHRcdHRoaXMuZGVhdGhzID0gMDtcclxuXHRcdHRoaXMucmVzcGF3blRpbWVyID0gMDtcclxuXHRcdHRoaXMucmVzcGF3blNwZWVkID0gMTA7XHJcblx0XHR0aGlzLnJlc3Bhd25NYXAgPSBkYXRhLm1hcElkO1xyXG5cdFx0dGhpcy5yZXNwYXduWCA9IGRhdGEueDtcclxuXHRcdHRoaXMucmVzcGF3blkgPSBkYXRhLnk7XHJcblxyXG5cdFx0dGhpcy5pbnB1dCA9IHtcclxuXHRcdFx0ZGlyZWN0aW9uOiBudWxsLFxyXG5cdFx0XHRydW46IGZhbHNlLFxyXG5cdFx0XHRwaWNrdXA6IGZhbHNlLFxyXG5cdFx0XHRhdHRhY2s6IGZhbHNlXHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuZ2FtZUlkID0gdXRpbC5maXJzdEVtcHR5SW5kZXgoZ2FtZS5wbGF5ZXJzKTtcclxuXHRcdGdhbWUucGxheWVyc1t0aGlzLmdhbWVJZF0gPSB0aGlzO1xyXG5cdH1cclxuXHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHRzdXBlci51cGRhdGUoZGVsdGEpO1x0XHQvLyBEZWZhdWx0IEFjdG9yIFVwZGF0ZVxyXG5cdFx0aWYgKHRoaXMuaXNEZWFkKSB7XHJcblx0XHRcdC8vIFJlc3Bhd25pbmdcclxuXHRcdFx0dGhpcy5yZXNwYXduVGltZXIgKz0gZGVsdGE7XHJcblx0XHRcdGlmICh0aGlzLnJlc3Bhd25UaW1lciA+PSB0aGlzLnJlc3Bhd25TcGVlZCkgdGhpcy5yZXNwYXduKCk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Ly8gQ2hlY2sgZm9yIEF0dGFjayBJbnB1dFxyXG5cdFx0XHRpZiAodGhpcy5pbnB1dC5hdHRhY2sgJiYgdGhpcy5hdHRhY2tUaW1lciA9PT0gMCkgdGhpcy5hdHRhY2soKTtcclxuXHRcdFx0XHJcblx0XHRcdC8vIENoZWNrIGZvciBNb3ZlbWVudCBJbnB1dFxyXG5cdFx0XHRpZiAoIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5pbnB1dC5kaXJlY3Rpb24pIHtcclxuXHRcdFx0XHRcdC8vIENoZWNrIGZvciBSdW4gSW5wdXRcclxuXHRcdFx0XHRcdGlmICh0aGlzLmlucHV0LnJ1bikge1xyXG5cdFx0XHRcdFx0XHQodGhpcy5lbmVyZ3kgPiAwKSA/IHRoaXMuaXNSdW5uaW5nID0gdHJ1ZSA6IHRoaXMuaXNSdW5uaW5nID0gZmFsc2U7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5pc1J1bm5pbmcgPSBmYWxzZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHRoaXMubW92ZSh0aGlzLmlucHV0LmRpcmVjdGlvbik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiB0aGlzLmdldEdhbWVQYWNrKCk7XHJcblx0fVxyXG5cdFxyXG5cdGdldEdhbWVQYWNrKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0Z2FtZUlkOiB0aGlzLmdhbWVJZCxcclxuXHRcdFx0bmFtZTogdGhpcy5uYW1lLFxyXG5cdFx0XHRkZXNjcmlwdGlvbjogdGhpcy5kZXNjcmlwdGlvbixcclxuXHRcdFx0c3ByaXRlOiB0aGlzLnNwcml0ZSxcclxuXHRcdFx0ZGlyZWN0aW9uOiB0aGlzLmRpcmVjdGlvbixcclxuXHRcdFx0bWFwSWQ6IHRoaXMubWFwSWQsXHJcblx0XHRcdHg6IHRoaXMuc3RhcnRYLFxyXG5cdFx0XHR5OiB0aGlzLnN0YXJ0WSxcclxuXHRcdFx0ejogdGhpcy56LFxyXG5cdFx0XHRkZXN0aW5hdGlvblg6IHRoaXMuZGVzdGluYXRpb25YLFxyXG5cdFx0XHRkZXN0aW5hdGlvblk6IHRoaXMuZGVzdGluYXRpb25ZLFxyXG5cdFx0XHRsZXJwOiB0aGlzLmxlcnAsXHJcblx0XHRcdGlzUnVubmluZzogdGhpcy5pc1J1bm5pbmcsXHJcblx0XHRcdGlzQXR0YWNraW5nOiB0aGlzLmlzQXR0YWNraW5nLFxyXG5cdFx0XHRpc0RlYWQ6IHRoaXMuaXNEZWFkLFxyXG5cdFx0XHRpc1Zpc2libGU6IHRoaXMuaXNWaXNpYmxlXHJcblx0XHR9O1xyXG5cdH1cclxuXHRcclxuXHRnZXRVSVBhY2soKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRsZXZlbDogdGhpcy5sZXZlbCxcclxuXHRcdFx0ZXhwZXJpZW5jZTogdGhpcy5leHBlcmllbmNlLFxyXG5cdFx0XHRoZWFsdGg6IHRoaXMuaGVhbHRoLFxyXG5cdFx0XHRoZWFsdGhNYXg6IHRoaXMuaGVhbHRoTWF4LFxyXG5cdFx0XHRlbmVyZ3k6IHRoaXMuZW5lcmd5LFxyXG5cdFx0XHRlbmVyZ3lNYXg6IHRoaXMuZW5lcmd5TWF4LFxyXG5cdFx0XHRtb3ZlU3BlZWQ6IHRoaXMubW92ZVNwZWVkLFxyXG5cdFx0XHRhdHRhY2tTcGVlZDogdGhpcy5hdHRhY2tTcGVlZCxcclxuXHRcdFx0YXR0YWNrVGltZXI6IHRoaXMuYXR0YWNrVGltZXIsXHJcblx0XHRcdGludmVudG9yeTogdGhpcy5nZXRJbnZlbnRvcnlQYWNrKClcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHRnZXREQlBhY2soKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRuYW1lOiB0aGlzLm5hbWUsXHJcblx0XHRcdGFjY291bnQ6IHRoaXMuYWNjb3VudElkLFxyXG5cdFx0XHR0ZW1wbGF0ZTogdGhpcy50ZW1wbGF0ZUlkLFxyXG5cdFx0XHRsZXZlbDogdGhpcy5sZXZlbCxcclxuXHRcdFx0ZXhwZXJpZW5jZTogdGhpcy5leHBlcmllbmNlLFxyXG5cdFx0XHRtYXBJZDogdGhpcy5tYXBJZCxcclxuXHRcdFx0eDogdGhpcy54LFxyXG5cdFx0XHR5OiB0aGlzLnksXHJcblx0XHRcdGRpcmVjdGlvbjogdGhpcy5kaXJlY3Rpb24sXHJcblx0XHRcdGFkbWluQWNjZXNzOiB0aGlzLmFkbWluQWNjZXNzLFxyXG5cdFx0XHRzcHJpdGU6IHRoaXMuc3ByaXRlXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRpbnB1dERhdGEoZGF0YSkge1xyXG5cdFx0aWYgKHRoaXMuaXNEZWFkKSB7XHJcblx0XHRcdGdhbWUuc2VuZEdhbWVJbmZvUGxheWVyKHRoaXMuZ2FtZUlkLCBcIllvdSBhcmUgZGVhZC5cIik7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoZ2FtZS5nb2RDb21tYW5kc1tkYXRhLmlucHV0XSkge1xyXG5cdFx0XHRpZiAodGhpcy5hZG1pbkFjY2VzcyA+IDApIHtcclxuXHRcdFx0XHRnYW1lLmdvZENvbW1hbmRzW2RhdGEuaW5wdXRdKGRhdGEsIHRoaXMpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdGdhbWUuc2VuZEdhbWVJbmZvUGxheWVyKHRoaXMuZ2FtZUlkLCBcIllvdSBkb24ndCBoYXZlIGFjY2VzcyB0byB0aGF0IGNvbW1hbmQuXCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0aWYgKGdhbWUuY29tbWFuZHNbZGF0YS5pbnB1dF0pIHtcclxuXHRcdFx0XHRnYW1lLmNvbW1hbmRzW2RhdGEuaW5wdXRdKGRhdGEsIHRoaXMpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdGdhbWUuc2VuZEdhbWVJbmZvUGxheWVyKHRoaXMuZ2FtZUlkLCBcIkludmFsaWQgY29tbWFuZC5cIik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHBpY2tVcCgpIHtcclxuXHRcdGlmIChzdXBlci5waWNrVXAoKSA9PT0gZmFsc2UpIGdhbWUuc2VuZEdhbWVJbmZvUGxheWVyKHRoaXMuZ2FtZUlkLCBcIllvdXIgaW52ZW50b3J5IGlzIGZ1bGwuXCIpO1xyXG5cdH1cclxuXHRcclxuXHRnZXRJbnZlbnRvcnkoKSB7XHJcblx0XHRjb25zdCBpbnZlbnRvcnkgPSBnYW1lLml0ZW1zLmZpbHRlcihpdGVtID0+IHtcclxuXHRcdFx0cmV0dXJuIGl0ZW0ucGxheWVySWQgPT09IHRoaXMucGxheWVySWQ7XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBpbnZlbnRvcnk7XHJcblx0fVxyXG5cclxuXHRzZXREZWFkKCkge1xyXG5cdFx0c3VwZXIuc2V0RGVhZCgpO1xyXG5cdFx0dGhpcy5pc0RlYWQgPSB0cnVlO1xyXG5cdFx0dGhpcy5oZWFsdGggPSAwO1xyXG5cdFx0dGhpcy5lbmVyZ3kgPSAwO1xyXG5cdFx0dGhpcy5kZWF0aHMrKztcclxuXHR9XHJcblxyXG5cdHJlc3Bhd24oKSB7XHJcblx0XHR0aGlzLm1hcElkID0gdGhpcy5yZXNwYXduTWFwO1xyXG5cdFx0dGhpcy54ID0gdGhpcy5yZXNwYXduWDtcclxuXHRcdHRoaXMueSA9IHRoaXMucmVzcGF3blk7XHJcblx0XHR0aGlzLnN0YXJ0WCA9IHRoaXMucmVzcGF3blg7XHJcblx0XHR0aGlzLnN0YXJ0WSA9IHRoaXMucmVzcGF3blk7XHJcblx0XHR0aGlzLmRlc3RpbmF0aW9uWCA9IHRoaXMucmVzcGF3blg7XHJcblx0XHR0aGlzLmRlc3RpbmF0aW9uWSA9IHRoaXMucmVzcGF3blk7XHJcblx0XHRcclxuXHRcdHRoaXMuY2FsY0JvbnVzU3RhdHMoKTtcclxuXHRcdHRoaXMucmVzdG9yZSgpO1xyXG5cdFx0XHJcblx0XHR0aGlzLmlzV2Fsa2luZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy5pc1J1bm5pbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMuaXNBdHRhY2tpbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMuaXNEZWFkID0gZmFsc2U7XHJcblx0XHR0aGlzLnJlc3Bhd25UaW1lciA9IDA7XHJcblx0XHRnYW1lLnNlbmRHYW1lSW5mb1BsYXllcih0aGlzLmdhbWVJZCwgXCJUaGUgQW5nZWwgb2YgTWVyY3kgcmVmdXNlcyB0byBsZXQgeW91IGRpZS5cIik7XHJcblx0fVxyXG5cclxuXHRnYWluRXhwZXJpZW5jZShleHBlcmllbmNlKSB7XHJcblx0XHRpZiAodGhpcy5leHBlcmllbmNlICsgZXhwZXJpZW5jZSA8PSAwKSB7XHJcblx0XHRcdHRoaXMuZXhwZXJpZW5jZSA9IDA7XHRcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuZXhwZXJpZW5jZSArPSBleHBlcmllbmNlO1xyXG5cdFx0aWYgKHRoaXMuZXhwZXJpZW5jZSA+PSBnYW1lLmV4cGVyaWVuY2VUb0xldmVsW3RoaXMubGV2ZWxdKSB7XHJcblx0XHRcdHRoaXMubGV2ZWxVcCgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0bGV2ZWxVcCgpIHtcclxuXHRcdGlmICh0aGlzLmxldmVsIDwgY29uZmlnLk1BWF9MRVZFTCkge1xyXG5cdFx0XHRjb25zdCByb2xsb3ZlckV4cGVyaWVuY2UgPSB0aGlzLmV4cGVyaWVuY2UgLSBnYW1lLmV4cGVyaWVuY2VUb0xldmVsW3RoaXMubGV2ZWxdO1xyXG5cdFx0XHR0aGlzLmV4cGVyaWVuY2UgPSAwO1xyXG5cdFx0XHR0aGlzLmxldmVsKys7XHJcblx0XHRcdHRoaXMuY2FsY0Jhc2VTdGF0cygpO1xyXG5cdFx0XHRnYW1lLnNlbmRHYW1lSW5mb1BsYXllcih0aGlzLmdhbWVJZCwgYExldmVsIHVwISBZb3UgYXJlIG5vdyBsZXZlbCAke3RoaXMubGV2ZWx9IWApO1xyXG5cdFx0XHR0aGlzLmdhaW5FeHBlcmllbmNlKHJvbGxvdmVyRXhwZXJpZW5jZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGNhbGNCYXNlU3RhdHModGVtcGxhdGUpIHtcclxuXHRcdGlmICghdGVtcGxhdGUpIHRlbXBsYXRlID0gZ2FtZS5wbGF5ZXJUZW1wbGF0ZXNbdGhpcy50ZW1wbGF0ZUlkXTtcclxuXHRcdHN1cGVyLmNhbGNCYXNlU3RhdHModGVtcGxhdGUpO1xyXG5cdH1cclxufVxyXG4iLCJpbXBvcnQgZ2FtZSBmcm9tICcuLi9nYW1lLmpzJztcclxuaW1wb3J0IHV0aWwgZnJvbSAnLi4vdXRpbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXh0IHtcclxuXHRjb25zdHJ1Y3RvcihtYXBJZCwgeCwgeSwgbWVzc2FnZSwgY29sb3VyID0gJyMwMDAwMDAnLCBkaXNwbGF5VGltZSA9IDIsIHZlbFggPSAwLCB2ZWxZID0gMCkge1xyXG5cdFx0dGhpcy5tYXBJZCA9IG1hcElkO1xyXG5cdFx0dGhpcy54ID0geDtcclxuXHRcdHRoaXMueSA9IHk7XHJcblx0XHR0aGlzLnZlbFggPSB2ZWxYO1xyXG5cdFx0dGhpcy52ZWxZID0gdmVsWTtcclxuXHRcdHRoaXMubGVycFggPSAwO1xyXG5cdFx0dGhpcy5sZXJwWSA9IDA7XHJcblxyXG5cdFx0dGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcclxuXHRcdHRoaXMuY29sb3VyID0gY29sb3VyO1xyXG5cdFx0dGhpcy5kaXNwbGF5VGltZSA9IGRpc3BsYXlUaW1lO1xyXG5cdFx0dGhpcy50aW1lciA9IDA7XHJcblxyXG5cdFx0dGhpcy5nYW1lSWQgPSB1dGlsLmZpcnN0RW1wdHlJbmRleChnYW1lLnRleHRzKTtcclxuXHRcdGdhbWUudGV4dHNbdGhpcy5nYW1lSWRdID0gdGhpcztcclxuXHR9XHJcblx0XHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHR0aGlzLnRpbWVyICs9IGRlbHRhO1xyXG5cdFx0aWYgKHRoaXMuZGlzcGxheVRpbWUgPiAwICYmIHRoaXMudGltZXIgPiB0aGlzLmRpc3BsYXlUaW1lKSB7XHJcblx0XHRcdHRoaXMucmVtb3ZlKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5sZXJwWCArPSBkZWx0YSAqIHRoaXMudmVsWDtcclxuXHRcdHRoaXMubGVycFkgKz0gZGVsdGEgKiB0aGlzLnZlbFk7XHJcblxyXG5cdFx0aWYgKHRoaXMubGVycFggPCAtMSkge1xyXG5cdFx0XHR0aGlzLmxlcnBYKys7XHJcblx0XHRcdHRoaXMueC0tO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAodGhpcy5sZXJwWCA+IDEpIHtcclxuXHRcdFx0dGhpcy5sZXJwWC0tO1xyXG5cdFx0XHR0aGlzLngrKztcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5sZXJwWSA8IC0xKSB7XHJcblx0XHRcdHRoaXMubGVycFkrKztcclxuXHRcdFx0dGhpcy55LS07XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmICh0aGlzLmxlcnBZID4gMSkge1xyXG5cdFx0XHR0aGlzLmxlcnBZLS07XHJcblx0XHRcdHRoaXMueSsrO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gdGhpcy5nZXRQYWNrKCk7XHJcblx0fVxyXG5cdFxyXG5cdGdldFBhY2soKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRnYW1lSWQ6IHRoaXMuZ2FtZUlkLFxyXG5cdFx0XHRtYXBJZDogdGhpcy5tYXBJZCxcclxuXHRcdFx0eDogdGhpcy54LFxyXG5cdFx0XHR5OiB0aGlzLnksXHJcblx0XHRcdGxlcnBYOiB0aGlzLmxlcnBYLFxyXG5cdFx0XHRsZXJwWTogdGhpcy5sZXJwWSxcclxuXHRcdFx0bWVzc2FnZTogdGhpcy5tZXNzYWdlLFxyXG5cdFx0XHRjb2xvdXI6IHRoaXMuY29sb3VyXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0cmVtb3ZlKCkge1xyXG5cdFx0ZGVsZXRlIGdhbWUudGV4dHNbdGhpcy5nYW1lSWRdO1xyXG5cdH1cclxufVxyXG4iLCJjb25zdCBjb25maWcgPSB7fTtcclxuXHJcbmNvbmZpZy5QT1JUID0gMjAwMDtcclxuY29uZmlnLkZSQU1FUkFURSA9IDEwMDAgLyA2MDtcclxuY29uZmlnLkJBQ0tVUF9USU1FID0gMTIwO1xyXG5cclxuY29uZmlnLk1BUF9MQVlFUlMgPSA2O1xyXG5jb25maWcuTUFQX0NPTFVNTlMgPSAxMjtcclxuY29uZmlnLk1BUF9ST1dTID0gMTI7XHJcblxyXG5jb25maWcuTUFYX01BUFMgPSAxMDtcclxuY29uZmlnLk1BWF9VU0VSUyA9IDEwMDtcclxuY29uZmlnLk1BWF9TUFJJVEVTID0gMTM7XHJcbmNvbmZpZy5NQVhfRUZGRUNUUyA9IDcxO1xyXG5jb25maWcuTUFYX0xFVkVMID0gMzA7XHJcblxyXG5jb25maWcuTUFYX0hFQUxUSF9CQVNFID0gMjAwO1xyXG5jb25maWcuTUFYX0hFQUxUSF9CT05VUyA9IDU1O1xyXG5jb25maWcuTUFYX0VORVJHWV9CQVNFID0gMjAwO1xyXG5jb25maWcuTUFYX0VORVJHWV9CT05VUyA9IDU1O1xyXG5cclxuY29uZmlnLklOVkVOVE9SWV9TSVpFID0gMjA7XHJcbmNvbmZpZy5FUVVJUE1FTlRfU0laRSA9IDU7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjb25maWc7XHJcbiIsImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XHJcbmltcG9ydCBiY3J5cHQgZnJvbSAnYmNyeXB0JztcclxuaW1wb3J0IGZzIGZyb20gJ2ZzJztcclxuXHJcbmltcG9ydCB1dGlsIGZyb20gXCIuL3V0aWwuanNcIjtcclxuaW1wb3J0IEFjY291bnQgZnJvbSAnLi9tb2RlbHMvYWNjb3VudC5qcyc7XHJcbmltcG9ydCBQbGF5ZXIgZnJvbSAnLi9tb2RlbHMvcGxheWVyLmpzJztcclxuaW1wb3J0IFBsYXllclRlbXBsYXRlIGZyb20gJy4vbW9kZWxzL3BsYXllclRlbXBsYXRlLmpzJztcclxuaW1wb3J0IEJvdFRlbXBsYXRlIGZyb20gJy4vbW9kZWxzL2JvdFRlbXBsYXRlLmpzJztcclxuaW1wb3J0IEl0ZW1UeXBlIGZyb20gJy4vbW9kZWxzL2l0ZW1UeXBlLmpzJztcclxuaW1wb3J0IEl0ZW1UZW1wbGF0ZSBmcm9tICcuL21vZGVscy9pdGVtVGVtcGxhdGUuanMnO1xyXG5pbXBvcnQgTWFwIGZyb20gJy4vbW9kZWxzL21hcC5qcyc7XHJcblxyXG5jb25zdCBmc3AgPSBmcy5wcm9taXNlcztcclxubW9uZ29vc2UuUHJvbWlzZSA9IFByb21pc2U7XHJcbm1vbmdvb3NlLmNvbm5lY3QoJ21vbmdvZGI6Ly9sb2NhbGhvc3Qvb2R5c3NleScsIHt1c2VOZXdVcmxQYXJzZXI6IHRydWV9KTtcclxuXHJcbmNsYXNzIERhdGFiYXNlIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHRoaXMuc2VydmVyTG9nID0gW107XHJcblx0fVxyXG5cclxuXHRhc3luYyBiYWNrdXAoKSB7XHJcblx0XHQvL1RPRE8gc2F2ZSBldmVyeXRoaW5nXHJcblx0XHQvLyBjb25zdCBtYXBzID0gc2F2ZS1hbGwtbWFwc1xyXG5cdFx0Ly8gY29uc3QgcGxheWVycyA9IHNhdmUtYWxsLW9ubGluZS1wbGF5ZXJzXHJcblx0XHQvLyBjb25zdCBib3RzID0gc2F2ZS1hbGwtYm90c1xyXG5cdFx0Ly8gY29uc3QgaXRlbXMgPSBzYXZlLWFsbC1pdGVtc1xyXG5cdFx0bGV0IGxvZ1NhdmVkID0gdGhpcy5zYXZlTG9nKCk7XHJcblx0XHRhd2FpdCBQcm9taXNlLmFsbChbbG9nU2F2ZWRdKTtcclxuXHRcdHRoaXMubG9nKFwiR2FtZSBzYXZlZCB0byBkaXNrLlwiKTtcclxuXHR9XHJcblx0XHJcblx0bG9nKG1lc3NhZ2UpIHtcclxuXHRcdGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG5cdFx0Y29uc29sZS5sb2codXRpbC50aW1lc3RhbXAoZGF0ZSkgKyBcIiAtIFwiICsgbWVzc2FnZSk7XHJcblx0XHR0aGlzLnNlcnZlckxvZy5wdXNoKHtcclxuXHRcdFx0bWVzc2FnZSxcclxuXHRcdFx0ZGF0ZVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cdGFzeW5jIHNhdmVMb2coKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRjb25zdCBzYXZlZExvZyA9IGF3YWl0IGZzcC5yZWFkRmlsZSgnLi9zZXJ2ZXIvbG9nLmpzb24nKTtcclxuXHRcdFx0Y29uc3QgbmV3TG9nID0gSlNPTi5wYXJzZShzYXZlZExvZykuY29uY2F0KHRoaXMuc2VydmVyTG9nKTtcclxuXHRcdFx0dGhpcy5zZXJ2ZXJMb2cgPSBbXTtcclxuXHRcdFx0YXdhaXQgZnNwLndyaXRlRmlsZSgnLi9zZXJ2ZXIvbG9nLmpzb24nLCBKU09OLnN0cmluZ2lmeShuZXdMb2cpKTtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRjYXRjaChlcnIpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRhc3luYyBjbGVhckxvZygpIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHRoaXMuc2VydmVyTG9nID0gW107XHJcblx0XHRcdGF3YWl0IGZzcC53cml0ZUZpbGUoJy4vc2VydmVyL2xvZy5qc29uJywgXCJbXVwiKTtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRjYXRjaCAoZXJyKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGFzeW5jIGhhc2hQYXNzd29yZChwYXNzd29yZCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0YmNyeXB0Lmhhc2gocGFzc3dvcmQsIDEwLCAoZXJyLCBoYXNoKSA9PiB7XHJcblx0XHRcdFx0aWYgKGVycikgcmVqZWN0KGVycik7XHJcblx0XHRcdFx0ZWxzZSByZXNvbHZlKGhhc2gpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRhc3luYyBjb21wYXJlUGFzc3dvcmQocGFzc3dvcmQsIGhhc2hlZFBhc3N3b3JkKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHRiY3J5cHQuY29tcGFyZShwYXNzd29yZCwgaGFzaGVkUGFzc3dvcmQsIChlcnIsIG1hdGNoKSA9PiB7XHJcblx0XHRcdFx0aWYgKGVycikgcmVqZWN0KGVycik7XHJcblx0XHRcdFx0ZWxzZSByZXNvbHZlKG1hdGNoKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0YXN5bmMgYXV0aEFjY291bnQodXNlcm5hbWUsIHBhc3N3b3JkKSB7XHJcblx0XHRjb25zdCBhY2NvdW50ID0gYXdhaXQgQWNjb3VudC5maW5kT25lKHt1c2VybmFtZTogdXNlcm5hbWV9KS5leGVjKCk7XHJcblx0XHRpZiAoIWFjY291bnQpIHJldHVybiBmYWxzZTtcclxuXHRcdFxyXG5cdFx0cmV0dXJuIHRoaXMuY29tcGFyZVBhc3N3b3JkKHBhc3N3b3JkLCBhY2NvdW50LnBhc3N3b3JkKTtcclxuXHR9XHJcblxyXG5cdGFzeW5jIGFkZEFjY291bnQodXNlcm5hbWUsIHBhc3N3b3JkLCBlbWFpbCkge1xyXG5cdFx0bGV0IGFjY291bnQgPSBhd2FpdCB0aGlzLmdldEFjY291bnRJZCh1c2VybmFtZSk7XHJcblx0XHRpZiAoYWNjb3VudCkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhgQWNjb3VudCBhbHJlYWR5IGV4aXN0cyB3aXRoIHVzZXJuYW1lICR7dXNlcm5hbWV9LmApO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgaGFzaGVkUGFzc3dvcmQgPSBhd2FpdCB0aGlzLmhhc2hQYXNzd29yZChwYXNzd29yZCk7XHJcblx0XHRhY2NvdW50ID0gbmV3IEFjY291bnQoe1xyXG5cdFx0XHRfaWQ6IG5ldyBtb25nb29zZS5UeXBlcy5PYmplY3RJZCxcclxuXHRcdFx0dXNlcm5hbWUsXHJcblx0XHRcdHBhc3N3b3JkOiBoYXNoZWRQYXNzd29yZFxyXG5cdFx0fSk7XHJcblx0XHQvL2lmIChlbWFpbCkgYWNjb3VudC5lbWFpbCA9IGVtYWlsO1xyXG5cclxuXHRcdHJldHVybiBhd2FpdCBhY2NvdW50LnNhdmUoKVxyXG5cdFx0LnRoZW4ocmVzdWx0ID0+IHtcclxuXHRcdFx0dGhpcy5sb2coYEFjY291bnQgYWRkZWQ6ICR7dXNlcm5hbWV9LmApXHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIGdldEFjY291bnQoYWNjb3VudElkKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgQWNjb3VudC5maW5kQnlJZChhY2NvdW50SWQpXHJcblx0XHQuc2VsZWN0KCdfaWQgdXNlcm5hbWUgcGFzc3dvcmQgZW1haWwgdmVyaWZpZWQnKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4oYWNjb3VudCA9PiBhY2NvdW50KVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgZ2V0QWNjb3VudElkKHVzZXJuYW1lKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgQWNjb3VudC5maW5kT25lKHt1c2VybmFtZTogdXNlcm5hbWV9KVxyXG5cdFx0LnNlbGVjdCgnX2lkJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKGFjY291bnQgPT4ge1xyXG5cdFx0XHRpZiAoYWNjb3VudCkge1xyXG5cdFx0XHRcdHJldHVybiBhY2NvdW50Ll9pZDtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIHNhdmVBY2NvdW50KGRhdGEpIHtcclxuXHRcdHJldHVybiBhd2FpdCBBY2NvdW50LnVwZGF0ZU9uZSh7dXNlcm5hbWU6IGRhdGEudXNlcm5hbWV9LCB7JHNldDogZGF0YX0pXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbihyZXN1bHQgPT4gdHJ1ZSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cclxuXHRhc3luYyBhZGRQbGF5ZXIoYWNjb3VudElkLCBuYW1lLCB0ZW1wbGF0ZUlkKSB7XHJcblx0XHRsZXQgYWNjb3VudCA9IGF3YWl0IHRoaXMuZ2V0QWNjb3VudChhY2NvdW50SWQpO1xyXG5cdFx0aWYgKCFhY2NvdW50KSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiQWNjb3VudCBkb2VzIG5vdCBleGlzdCB3aXRoIHRoYXQgaWQuXCIpO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0XHRsZXQgdGVtcGxhdGUgPSBhd2FpdCB0aGlzLmdldFBsYXllclRlbXBsYXRlKHRlbXBsYXRlSWQpO1xyXG5cdFx0aWYgKCF0ZW1wbGF0ZSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIlBsYXllciBUZW1wbGF0ZSBkb2VzIG5vdCBleGlzdCB3aXRoIHRoYXQgaWQuXCIpO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0XHRsZXQgcGxheWVyID0gYXdhaXQgdGhpcy5nZXRQbGF5ZXIobmFtZSk7XHJcblx0XHRpZiAocGxheWVyKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiUGxheWVyIGFscmVhZHkgZXhpc3RzIHdpdGggdGhhdCBuYW1lLlwiKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdHBsYXllciA9IG5ldyBQbGF5ZXIoe1xyXG5cdFx0XHRfaWQgOiBuZXcgbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQsXHJcblx0XHRcdG5hbWUsXHJcblx0XHRcdGFjY291bnQ6IGFjY291bnRJZCxcclxuXHRcdFx0dGVtcGxhdGU6IHRlbXBsYXRlSWRcclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBhd2FpdCBwbGF5ZXIuc2F2ZSgpXHJcblx0XHQudGhlbihyZXN1bHQgPT4gdHJ1ZSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIGdldFBsYXllcihuYW1lKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgUGxheWVyLmZpbmRPbmUoe25hbWU6IG5hbWV9KVxyXG5cdFx0LnNlbGVjdCgnX2lkIGFjY291bnQgbmFtZSB0ZW1wbGF0ZSBsZXZlbCBleHBlcmllbmNlIG1hcElkIHggeSBkaXJlY3Rpb24gYWRtaW5BY2Nlc3Mgc3ByaXRlJylcclxuXHRcdC5wb3B1bGF0ZSgndGVtcGxhdGUnKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4ocGxheWVyID0+IHBsYXllcilcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIHNhdmVQbGF5ZXIoZGF0YSkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IFBsYXllci51cGRhdGVPbmUoe25hbWU6IGRhdGEubmFtZX0sIHskc2V0OiBkYXRhfSlcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHJlc3VsdCA9PiB0cnVlKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblxyXG5cdGFzeW5jIGFkZEJvdCh0ZW1wbGF0ZU5hbWUsIG1hcElkLCB4LCB5KSB7XHJcblx0XHRsZXQgdGVtcGxhdGVJZCA9IGF3YWl0IHRoaXMuZ2V0UGxheWVyVGVtcGxhdGVJZCh0ZW1wbGF0ZU5hbWUpO1xyXG5cdFx0aWYgKCF0ZW1wbGF0ZUlkKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiQm90IFRlbXBsYXRlIGRvZXMgbm90IGV4aXN0IHdpdGggdGhhdCBuYW1lLlwiKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0bGV0IGJvdCA9IGF3YWl0IHRoaXMuZ2V0Qm90KG5hbWUpO1xyXG5cdFx0aWYgKGJvdCkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIkJvdCBhbHJlYWR5IGV4aXN0cyB3aXRoIHRoYXQgbmFtZS5cIik7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHRib3QgPSBuZXcgQm90KHtcclxuXHRcdFx0X2lkIDogbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkLFxyXG5cdFx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVJZCxcclxuXHRcdFx0bWFwSWQsXHJcblx0XHRcdHgsXHJcblx0XHRcdHlcclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBhd2FpdCBib3Quc2F2ZSgpXHJcblx0XHQudGhlbihyZXN1bHQgPT4gdHJ1ZSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIGdldEJvdChuYW1lKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgQm90LmZpbmRPbmUoe25hbWU6IG5hbWV9KVxyXG5cdFx0LnNlbGVjdCgnX2lkIG5hbWUgc3ByaXRlIHRlbXBsYXRlIGxldmVsIGV4cGVyaWVuY2UgbWFwSWQgeCB5IGRpcmVjdGlvbicpXHJcblx0XHQucG9wdWxhdGUoJ3RlbXBsYXRlJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKGJvdCA9PiBib3QpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBzYXZlQm90KGRhdGEpIHtcclxuXHRcdHJldHVybiBhd2FpdCBCb3QudXBkYXRlT25lKHtuYW1lOiBkYXRhLm5hbWV9LCB7JHNldDogZGF0YX0pXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbihyZXN1bHQgPT4gdHJ1ZSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cclxuXHRhc3luYyBnZXRNYXAobWFwSWQpIHtcclxuXHRcdHJldHVybiBhd2FpdCBNYXAuZmluZE9uZSh7bWFwSWQ6IG1hcElkfSlcclxuXHRcdC5zZWxlY3QoJ21hcElkIG5hbWUgZHJvcENoYW5jZSBkcm9wQW1vdW50RVEgdGlsZXMgaXNXYWxsIGlzSG9zdGlsZSBkYW1hZ2Ugd2FycE1hcCB3YXJwWCB3YXJwWScpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbihtYXAgPT4gbWFwKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgc2F2ZU1hcChkYXRhKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgTWFwLnVwZGF0ZU9uZSh7bWFwSWQ6IGRhdGEubWFwSWR9LCB7JHNldDogZGF0YX0sIHt1cHNlcnQ6IHRydWV9KVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4ocmVzdWx0ID0+IHRydWUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBnZXRBbGxNYXBzKCkge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0cmV0dXJuIGF3YWl0IE1hcC5maW5kKHt9KVxyXG5cdFx0XHQuc2VsZWN0KCdtYXBJZCBuYW1lIHRpbGVzIGhvc3RpbGUgZHJvcENoYW5jZSBkcm9wQW1vdW50RVEnKVxyXG5cdFx0XHQuZXhlYygpXHJcblx0XHRcdC50aGVuKG1hcHMgPT4gbWFwcylcclxuXHRcdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHRcdH1cclxuXHRcdGNhdGNoKGVycikge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0YXN5bmMgYWRkUGxheWVyVGVtcGxhdGUoZGF0YSkge1xyXG5cdFx0aWYgKCFkYXRhLm5hbWUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJOYW1lIGlzIHJlcXVpcmVkLlwiKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBjaGVja1RlbXBsYXRlID0gYXdhaXQgUGxheWVyVGVtcGxhdGUuZmluZE9uZSh7bmFtZTogZGF0YS5uYW1lfSlcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHRlbXBsYXRlID0+IHRlbXBsYXRlKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHJcblx0XHRpZiAoY2hlY2tUZW1wbGF0ZSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIlRlbXBsYXRlIGFscmVhZHkgZXhpc3RzIHdpdGggdGhhdCBuYW1lLlwiKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHRlbXBsYXRlID0gbmV3IFBsYXllclRlbXBsYXRlKHtcclxuXHRcdFx0X2lkOiBuZXcgbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQsXHJcblx0XHRcdG5hbWU6IGRhdGEubmFtZSxcclxuXHRcdFx0c3ByaXRlOiBkYXRhLnNwcml0ZSxcclxuXHRcdFx0ZGFtYWdlQmFzZTogZGF0YS5kYW1hZ2VCYXNlLFxyXG5cdFx0XHRkZWZlbmNlQmFzZTogZGF0YS5kZWZlbmNlQmFzZSxcclxuXHRcdFx0aGVhbHRoTWF4QmFzZTogZGF0YS5oZWFsdGhNYXhCYXNlLFxyXG5cdFx0XHRlbmVyZ3lNYXhCYXNlOiBkYXRhLmVuZXJneU1heEJhc2UsXHJcblx0XHRcdHJhbmdlQmFzZTogZGF0YS5yYW5nZUJhc2UsXHJcblx0XHRcdGhlYWx0aFBlckxldmVsOiBkYXRhLmhlYWx0aFBlckxldmVsLFxyXG5cdFx0XHRlbmVyZ3lQZXJMZXZlbDogZGF0YS5lbmVyZ3lQZXJMZXZlbFxyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIGF3YWl0IHRlbXBsYXRlLnNhdmUoKVxyXG5cdFx0LnRoZW4ocmVzdWx0ID0+IHRydWUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBnZXRQbGF5ZXJUZW1wbGF0ZSh0ZW1wbGF0ZUlkKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgUGxheWVyVGVtcGxhdGUuZmluZEJ5SWQodGVtcGxhdGVJZClcclxuXHRcdC5zZWxlY3QoJ25hbWUgc3ByaXRlIGRhbWFnZUJhc2UgZGVmZW5jZUJhc2UgaGVhbHRoTWF4QmFzZSBlbmVyZ3lNYXhCYXNlIHJhbmdlQmFzZSBoZWFsdGhQZXJMZXZlbCwgZW5lcmd5UGVyTGV2ZWwnKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4odGVtcGxhdGUgPT4gdGVtcGxhdGUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBnZXRBbGxQbGF5ZXJUZW1wbGF0ZXMoKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgUGxheWVyVGVtcGxhdGUuZmluZCh7fSlcclxuXHRcdC5zZWxlY3QoJ19pZCBuYW1lIHNwcml0ZSBkYW1hZ2VCYXNlIGRlZmVuY2VCYXNlIGhlYWx0aE1heEJhc2UgZW5lcmd5TWF4QmFzZSByYW5nZUJhc2UgaGVhbHRoUGVyTGV2ZWwsIGVuZXJneVBlckxldmVsJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHRlbXBsYXRlcyA9PiB0ZW1wbGF0ZXMpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHJcblx0YXN5bmMgYWRkQm90VGVtcGxhdGUoZGF0YSkge1xyXG5cdFx0Y29uc3QgdGVtcGxhdGUgPSBuZXcgQm90VGVtcGxhdGUoe1xyXG5cdFx0XHRfaWQ6IG5ldyBtb25nb29zZS5UeXBlcy5PYmplY3RJZCxcclxuXHRcdFx0bmFtZTogZGF0YS5uYW1lLFxyXG5cdFx0XHRzcHJpdGU6IGRhdGEuc3ByaXRlLFxyXG5cdFx0XHRkYW1hZ2VCYXNlOiBkYXRhLmRhbWFnZUJhc2UsXHJcblx0XHRcdGRlZmVuY2VCYXNlOiBkYXRhLmRlZmVuY2VCYXNlLFxyXG5cdFx0XHRoZWFsdGhNYXhCYXNlOiBkYXRhLmhlYWx0aE1heEJhc2UsXHJcblx0XHRcdGVuZXJneU1heEJhc2U6IGRhdGEuZW5lcmd5TWF4QmFzZSxcclxuXHRcdFx0cmFuZ2VCYXNlOiBkYXRhLnJhbmdlQmFzZSxcclxuXHRcdFx0aG9zdGlsZTogZGF0YS5ob3N0aWxlXHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gYXdhaXQgdGVtcGxhdGUuc2F2ZSgpXHJcblx0XHQudGhlbihyZXN1bHQgPT4gdHJ1ZSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIGdldEJvdFRlbXBsYXRlKHRlbXBsYXRlSWQpIHtcclxuXHRcdHJldHVybiBhd2FpdCBCb3RUZW1wbGF0ZS5maW5kQnlJZCh0ZW1wbGF0ZUlkKVxyXG5cdFx0LnNlbGVjdCgnbmFtZSBzcHJpdGUgZGFtYWdlQmFzZSBkZWZlbmNlQmFzZSBoZWFsdGhNYXhCYXNlIGVuZXJneU1heEJhc2UgcmFuZ2VCYXNlIGhvc3RpbGUnKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4odGVtcGxhdGUgPT4gdGVtcGxhdGUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBnZXRBbGxCb3RUZW1wbGF0ZXMoKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgQm90VGVtcGxhdGUuZmluZCh7fSlcclxuXHRcdC5zZWxlY3QoJ19pZCBuYW1lIHNwcml0ZSBkYW1hZ2VCYXNlIGRlZmVuY2VCYXNlIGhlYWx0aE1heEJhc2UgZW5lcmd5TWF4QmFzZSByYW5nZUJhc2UgaG9zdGlsZScpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbih0ZW1wbGF0ZXMgPT4gdGVtcGxhdGVzKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblxyXG5cdGFzeW5jIGFkZEl0ZW1UeXBlKGRhdGEpIHtcclxuXHRcdGNvbnN0IHR5cGUgPSBuZXcgSXRlbVR5cGUoe1xyXG5cdFx0XHRfaWQ6IG5ldyBtb25nb29zZS5UeXBlcy5PYmplY3RJZCxcclxuXHRcdFx0bmFtZTogZGF0YS5uYW1lLFxyXG5cdFx0XHRzdGFja2FibGU6IGRhdGEuc3RhY2thYmxlLFxyXG5cdFx0XHRlcXVpcHBlZFNsb3Q6IGRhdGEuZXF1aXBwZWRTbG90XHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gYXdhaXQgdHlwZS5zYXZlKClcclxuXHRcdC50aGVuKHJlc3VsdCA9PiB0cnVlKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgZ2V0SXRlbVR5cGUodHlwZUlkKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgSXRlbVR5cGUuZmluZEJ5SWQodHlwZUlkKVxyXG5cdFx0LnNlbGVjdCgnbmFtZSBzdGFja2FibGUgZXF1aXBwZWRTbG90JylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHR5cGUgPT4gdHlwZSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIGdldEFsbEl0ZW1UeXBlcygpIHtcclxuXHRcdHJldHVybiBhd2FpdCBJdGVtVHlwZS5maW5kKHt9KVxyXG5cdFx0LnNlbGVjdCgnX2lkIG5hbWUgc3RhY2thYmxlIGVxdWlwcGVkU2xvdCcpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbih0eXBlcyA9PiB0eXBlcylcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cclxuXHRhc3luYyBhZGRJdGVtVGVtcGxhdGUoZGF0YSkge1xyXG5cdFx0Y29uc3QgdGVtcGxhdGUgPSBuZXcgSXRlbVRlbXBsYXRlKHtcclxuXHRcdFx0X2lkOiBuZXcgbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQsXHJcblx0XHRcdG5hbWU6IGRhdGEubmFtZSxcclxuXHRcdFx0c3ByaXRlOiBkYXRhLnNwcml0ZSxcclxuXHRcdFx0cmV1c2FibGU6IGRhdGEucmV1c2FibGUsXHJcblx0XHRcdHR5cGU6IGRhdGEudHlwZUlkLFxyXG5cdFx0XHRwYXNzaXZlRGFtYWdlOiBkYXRhLnBhc3NpdmVEYW1hZ2UsXHJcblx0XHRcdHBhc3NpdmVEZWZlbmNlOiBkYXRhLnBhc3NpdmVEZWZlbmNlLFxyXG5cdFx0XHRwYXNzaXZlSGVhbHRoTWF4OiBkYXRhLnBhc3NpdmVIZWFsdGhNYXgsXHJcblx0XHRcdHBhc3NpdmVFbmVyZ3lNYXg6IGRhdGEucGFzc2l2ZUVuZXJneU1heCxcclxuXHRcdFx0cGFzc2l2ZVJhbmdlOiBkYXRhLnBhc3NpdmVSYW5nZSxcclxuXHRcdFx0ZXF1aXBwZWREYW1hZ2U6IGRhdGEuZXF1aXBwZWREYW1hZ2UsXHJcblx0XHRcdGVxdWlwcGVkRGVmZW5jZTogZGF0YS5lcXVpcHBlZERlZmVuY2UsXHJcblx0XHRcdGVxdWlwcGVkSGVhbHRoTWF4OiBkYXRhLmVxdWlwcGVkSGVhbHRoTWF4LFxyXG5cdFx0XHRlcXVpcHBlZEVuZXJneU1heDogZGF0YS5lcXVpcHBlZEVuZXJneU1heCxcclxuXHRcdFx0ZXF1aXBwZWRSYW5nZTogZGF0YS5lcXVpcHBlZFJhbmdlXHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gYXdhaXQgdGVtcGxhdGUuc2F2ZSgpXHJcblx0XHQudGhlbihyZXN1bHQgPT4gdHJ1ZSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIGdldEl0ZW1UZW1wbGF0ZSh0ZW1wbGF0ZUlkKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgSXRlbVRlbXBsYXRlLmZpbmRCeUlkKHRlbXBsYXRlSWQpXHJcblx0XHQuc2VsZWN0KCduYW1lIHNwcml0ZSByZXVzYWJsZSB0eXBlIHBhc3NpdmVEYW1hZ2UgcGFzc2l2ZURlZmVuY2UgcGFzc2l2ZUhlYWx0aE1heCBwYXNzaXZlRW5lcmd5TWF4QmFzZSBwYXNzaXZlUmFuZ2UgZXF1aXBwZWREYW1hZ2UgZXF1aXBwZWREZWZlbmNlIGVxdWlwcGVkSGVhbHRoTWF4IGVxdWlwcGVkRW5lcmd5TWF4QmFzZSBlcXVpcHBlZFJhbmdlJylcclxuXHRcdC5wb3B1bGF0ZSgndHlwZScpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbih0ZW1wbGF0ZSA9PiB0ZW1wbGF0ZSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIGdldEFsbEl0ZW1UZW1wbGF0ZXMoKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgSXRlbVRlbXBsYXRlLmZpbmQoe30pXHJcblx0XHQuc2VsZWN0KCdfaWQgbmFtZSBzcHJpdGUgcmV1c2FibGUgdHlwZSBwYXNzaXZlRGFtYWdlIHBhc3NpdmVEZWZlbmNlIHBhc3NpdmVIZWFsdGhNYXggcGFzc2l2ZUVuZXJneU1heEJhc2UgcGFzc2l2ZVJhbmdlIGVxdWlwcGVkRGFtYWdlIGVxdWlwcGVkRGVmZW5jZSBlcXVpcHBlZEhlYWx0aE1heCBlcXVpcHBlZEVuZXJneU1heEJhc2UgZXF1aXBwZWRSYW5nZScpXHJcblx0XHQucG9wdWxhdGUoJ3R5cGUnKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4odGVtcGxhdGVzID0+IHRlbXBsYXRlcylcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG59XHJcblxyXG5jb25zdCBkYiA9IG5ldyBEYXRhYmFzZSgpO1xyXG5leHBvcnQgZGVmYXVsdCBkYjtcclxuIiwiaW1wb3J0IGRiIGZyb20gJy4vZGIuanMnO1xyXG5pbXBvcnQgY29uZmlnIGZyb20gJy4vY29uZmlnLmpzJztcclxuXHJcbmltcG9ydCBNYXAgZnJvbSAnLi9jbGFzc2VzL21hcC5qcyc7XHJcbmltcG9ydCBQbGF5ZXIgZnJvbSAnLi9jbGFzc2VzL3BsYXllci5qcyc7XHJcbmltcG9ydCBCb3QgZnJvbSAnLi9jbGFzc2VzL2JvdC5qcyc7XHJcbmltcG9ydCBJdGVtIGZyb20gJy4vY2xhc3Nlcy9pdGVtLmpzJztcclxuaW1wb3J0IEVmZmVjdCBmcm9tICcuL2NsYXNzZXMvZWZmZWN0LmpzJztcclxuaW1wb3J0IFRleHQgZnJvbSAnLi9jbGFzc2VzL3RleHQuanMnO1xyXG5pbXBvcnQgTWVzc2FnZSBmcm9tICcuL2NsYXNzZXMvbWVzc2FnZS5qcyc7XHJcblxyXG5jbGFzcyBHYW1lIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHRoaXMubWFwcyA9IFtdO1xyXG5cdFx0dGhpcy5wbGF5ZXJzID0gW107XHJcblx0XHR0aGlzLmJvdHMgPSBbXTtcclxuXHRcdHRoaXMuaXRlbXMgPSBbXTtcclxuXHRcdHRoaXMuZWZmZWN0cyA9IFtdO1xyXG5cdFx0dGhpcy50ZXh0cyA9IFtdO1xyXG5cdFx0dGhpcy5tZXNzYWdlUXVldWUgPSBbXTtcclxuXHRcdFxyXG5cdFx0dGhpcy5wbGF5ZXJUZW1wbGF0ZXMgPSB7fTtcclxuXHRcdHRoaXMuYm90VGVtcGxhdGVzID0ge307XHJcblx0XHR0aGlzLml0ZW1UZW1wbGF0ZXMgPSB7fTtcclxuXHJcblx0XHR0aGlzLmxvYWRNYXBzKCk7XHJcblx0XHR0aGlzLmxvYWRQbGF5ZXJUZW1wbGF0ZXMoKTtcclxuXHRcdHRoaXMubG9hZEJvdFRlbXBsYXRlcygpO1xyXG5cdFx0dGhpcy5sb2FkSXRlbVRlbXBsYXRlcygpO1xyXG5cdFx0dGhpcy5sb2FkQ29tbWFuZHMoKTtcclxuXHR9XHJcblxyXG5cdGxvYWRNYXBzKCkge1xyXG5cdFx0ZGIuZ2V0QWxsTWFwcygpXHJcblx0XHQudGhlbihtYXBEYXRhID0+IHtcclxuXHRcdFx0Y29uc3Qgb3JkZXJlZE1hcERhdGEgPSBbXTtcclxuXHRcdFx0Zm9yIChsZXQgaWQgPSAwOyBpZCA8IG1hcERhdGEubGVuZ3RoOyBpZCsrKSB7XHJcblx0XHRcdFx0Y29uc3QgZGF0YSA9IG1hcERhdGFbaWRdO1xyXG5cdFx0XHRcdGlmIChkYXRhKSBvcmRlcmVkTWFwRGF0YVtkYXRhLm1hcElkXSA9IGRhdGE7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZvciAobGV0IGlkID0gMDsgaWQgPCBjb25maWcuTUFYX01BUFM7IGlkKyspIHtcclxuXHRcdFx0XHRpZiAob3JkZXJlZE1hcERhdGFbaWRdKSB7XHJcblx0XHRcdFx0XHR0aGlzLm1hcHNbaWRdID0gbmV3IE1hcChpZCwgb3JkZXJlZE1hcERhdGFbaWRdKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1hcHNbaWRdID0gbmV3IE1hcChpZCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblxyXG5cdGxvYWRQbGF5ZXJUZW1wbGF0ZXMoKSB7XHJcblx0XHRkYi5nZXRBbGxQbGF5ZXJUZW1wbGF0ZXMoKVxyXG5cdFx0LnRoZW4odGVtcGxhdGVzID0+IHtcclxuXHRcdFx0dGhpcy5wbGF5ZXJUZW1wbGF0ZXMgPSB7fTtcclxuXHRcdFx0dGVtcGxhdGVzLmZvckVhY2godGVtcGxhdGUgPT4ge1xyXG5cdFx0XHRcdHRoaXMucGxheWVyVGVtcGxhdGVzW3RlbXBsYXRlLl9pZF0gPSB0ZW1wbGF0ZTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KS5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cclxuXHRsb2FkQm90VGVtcGxhdGVzKCkge1xyXG5cdFx0ZGIuZ2V0QWxsQm90VGVtcGxhdGVzKClcclxuXHRcdC50aGVuKHRlbXBsYXRlcyA9PiB7XHJcblx0XHRcdHRoaXMuYm90VGVtcGxhdGVzID0ge307XHJcblx0XHRcdHRlbXBsYXRlcy5mb3JFYWNoKHRlbXBsYXRlID0+IHtcclxuXHRcdFx0XHR0aGlzLmJvdFRlbXBsYXRlc1t0ZW1wbGF0ZS5faWRdID0gdGVtcGxhdGU7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSkuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHJcblx0bG9hZEl0ZW1UZW1wbGF0ZXMoKSB7XHJcblx0XHRkYi5nZXRBbGxJdGVtVGVtcGxhdGVzKClcclxuXHRcdC50aGVuKHRlbXBsYXRlcyA9PiB7XHJcblx0XHRcdHRoaXMuaXRlbVRlbXBsYXRlcyA9IHt9O1xyXG5cdFx0XHR0ZW1wbGF0ZXMuZm9yRWFjaCh0ZW1wbGF0ZSA9PiB7XHJcblx0XHRcdFx0dGhpcy5pdGVtVGVtcGxhdGVzW3RlbXBsYXRlLl9pZF0gPSB0ZW1wbGF0ZTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KS5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cclxuXHRsb2FkQ29tbWFuZHMoKSB7XHJcblx0XHR0aGlzLmNvbW1hbmRzID0ge1xyXG5cdFx0XHRtb3ZlOiAoZGF0YSwgcGxheWVyKSA9PiBwbGF5ZXIuaW5wdXQuZGlyZWN0aW9uID0gZGF0YS5kaXJlY3Rpb24sXHJcblx0XHRcdHJ1bjogKGRhdGEsIHBsYXllcikgPT4gcGxheWVyLmlucHV0LnJ1biA9IGRhdGEuc3RhdGUsXHJcblx0XHRcdHBpY2t1cDogKGRhdGEsIHBsYXllcikgPT4ge1xyXG5cdFx0XHRcdGlmICghcGxheWVyLmlucHV0LnBpY2t1cCAmJiBkYXRhLnN0YXRlKSBwbGF5ZXIucGlja1VwKCk7XHJcblx0XHRcdFx0cGxheWVyLmlucHV0LnBpY2t1cCA9IGRhdGEuc3RhdGU7XHJcblx0XHRcdH0sXHJcblx0XHRcdGF0dGFjazogKGRhdGEsIHBsYXllcikgPT4ge1xyXG5cdFx0XHRcdHBsYXllci5pbnB1dC5hdHRhY2sgPSBkYXRhLnN0YXRlO1xyXG5cdFx0XHRcdHBsYXllci5hdHRhY2soMSwgcGxheWVyLmRpcmVjdGlvbik7XHJcblx0XHRcdH0sXHJcblx0XHRcdGRvdWJsZUNsaWNrSXRlbTogKGRhdGEsIHBsYXllcikgPT4gcGxheWVyLnVzZUl0ZW0oZGF0YS5zbG90KSxcclxuXHRcdFx0cmlnaHRDbGlja0l0ZW06IChkYXRhLCBwbGF5ZXIpID0+IHBsYXllci5kcm9wSXRlbShkYXRhLnNsb3QpLFxyXG5cdFx0XHRkcmFnU3RvcEdhbWU6IChkYXRhLCBwbGF5ZXIpID0+IHBsYXllci5kcm9wSXRlbShkYXRhLnNsb3QpLFxyXG5cdFx0XHRkcmFnU3RvcEludmVudG9yeTogKGRhdGEsIHBsYXllcikgPT4gcGxheWVyLm1vdmVJdGVtVG9TbG90KGRhdGEuc2xvdCwgZGF0YS5uZXdTbG90KSxcclxuXHRcdFx0ZHJhZ1N0b3BFcXVpcG1lbnQ6IChkYXRhLCBwbGF5ZXIpID0+IHBsYXllci5tb3ZlSXRlbVRvU2xvdChkYXRhLnNsb3QsIGRhdGEubmV3U2xvdCksXHJcblx0XHRcdHNlcnZlckNoYXQ6IChkYXRhLCBwbGF5ZXIpID0+IGdhbWUuc2VuZE1lc3NhZ2VHbG9iYWwocGxheWVyLmdhbWVJZCwgYCR7cGxheWVyLm5hbWV9IHllbGxzLCBcIiR7ZGF0YS5tZXNzYWdlfVwiYCksXHJcblx0XHRcdG1hcENoYXQ6IChkYXRhLCBwbGF5ZXIpID0+IGdhbWUuc2VuZE1lc3NhZ2VNYXAocGxheWVyLmdhbWVJZCwgcGxheWVyLm1hcElkLCBgJHtwbGF5ZXIubmFtZX0gc2F5cywgXCIke2RhdGEubWVzc2FnZX1cImApLFxyXG5cdFx0XHRwbGF5ZXJDaGF0OiAoZGF0YSwgcGxheWVyKSA9PiB7XHJcblx0XHRcdFx0Y29uc3QgdGFyZ2V0ID0gZ2FtZS5wbGF5ZXJzW2RhdGEudGFyZ2V0SWRdO1xyXG5cdFx0XHRcdGlmICh0YXJnZXQpIHtcclxuXHRcdFx0XHRcdGdhbWUuc2VuZE1lc3NhZ2VQbGF5ZXIocGxheWVyLmdhbWVJZCwgdGFyZ2V0LmdhbWVJZCwgYCR7cGxheWVyLm5hbWV9IHdoaXNwZXJzLCBcIiR7ZGF0YS5tZXNzYWdlfVwiYCk7XHJcblx0XHRcdFx0XHRnYW1lLnNlbmRNZXNzYWdlUGxheWVyKHBsYXllci5nYW1lSWQsIHBsYXllci5nYW1lSWQsIGBZb3Ugd2hpc3BlciB0byAke3RhcmdldC5uYW1lfSwgXCIke2RhdGEubWVzc2FnZX1cImApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHRcdFxyXG5cdFx0dGhpcy5nb2RDb21tYW5kcyA9IHtcclxuXHRcdFx0c3Bhd25NYXBJdGVtOiAoZGF0YSkgPT4gdGhpcy5zcGF3bk1hcEl0ZW0oZGF0YS5hcmdzWzBdLCBkYXRhLmFyZ3NbMV0sIGRhdGEuYXJnc1syXSwgZGF0YS5hcmdzWzNdLCBkYXRhLmFyZ3NbNF0pLFxyXG5cdFx0XHRzcGF3bkJvdDogKGRhdGEpID0+IHRoaXMuc3Bhd25Cb3QoZGF0YS5hcmdzWzBdLCBkYXRhLmFyZ3NbMV0sIGRhdGEuYXJnc1syXSwgZGF0YS5hcmdzWzNdLCBkYXRhLmFyZ3NbNF0pLFxyXG5cdFx0XHRzZXRTcHJpdGU6IChkYXRhLCBwbGF5ZXIpID0+IHBsYXllci5zcHJpdGUgPSBkYXRhLmFyZ3NbMF1cclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHR1cGRhdGUoZGVsdGEpIHtcclxuXHRcdGNvbnN0IHBhY2sgPSB7XHJcblx0XHRcdHBsYXllcnM6IFtdLFxyXG5cdFx0XHRib3RzOiBbXSxcclxuXHRcdFx0aXRlbXM6IFtdLFxyXG5cdFx0XHRlZmZlY3RzOiBbXSxcclxuXHRcdFx0dGV4dHM6IFtdLFxyXG5cdFx0XHRtZXNzYWdlczogW10uY29uY2F0KHRoaXMubWVzc2FnZVF1ZXVlKVxyXG5cdFx0fTtcclxuXHRcdHRoaXMubWVzc2FnZVF1ZXVlID0gW107XHJcblxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBsYXllcnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgcGxheWVyID0gdGhpcy5wbGF5ZXJzW2ldO1xyXG5cdFx0XHRpZiAocGxheWVyICE9IG51bGwpIHBhY2sucGxheWVyc1twbGF5ZXIuZ2FtZUlkXSA9IHBsYXllci51cGRhdGUoZGVsdGEpO1xyXG5cdFx0fVxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmJvdHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgYm90ID0gdGhpcy5ib3RzW2ldO1xyXG5cdFx0XHRpZiAoYm90ICE9IG51bGwpIHBhY2suYm90c1tib3QuZ2FtZUlkXSA9IGJvdC51cGRhdGUoZGVsdGEpO1xyXG5cdFx0fVxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLml0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IGl0ZW0gPSB0aGlzLml0ZW1zW2ldO1xyXG5cdFx0XHRpZiAoaXRlbSAhPSBudWxsKSBwYWNrLml0ZW1zW2l0ZW0uZ2FtZUlkXSA9IGl0ZW0udXBkYXRlKGRlbHRhKTtcclxuXHRcdH1cclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5lZmZlY3RzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IGVmZmVjdCA9IHRoaXMuZWZmZWN0c1tpXTtcclxuXHRcdFx0aWYgKGVmZmVjdCAhPSBudWxsKSBwYWNrLmVmZmVjdHNbZWZmZWN0LmlkXSA9IGVmZmVjdC51cGRhdGUoZGVsdGEpO1xyXG5cdFx0fVxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRleHRzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IHRleHQgPSB0aGlzLnRleHRzW2ldO1xyXG5cdFx0XHRpZiAodGV4dCAhPSBudWxsKSBwYWNrLnRleHRzW3RleHQuZ2FtZUlkXSA9IHRleHQudXBkYXRlKGRlbHRhKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBwYWNrO1xyXG5cdH1cclxuXHJcblx0Ly8gUGxheWVyc1xyXG5cdHBsYXllckxvZ2luKHNvY2tldElkLCBkYXRhKSB7XHJcblx0XHRmb3IgKGxldCBwbGF5ZXIgb2YgdGhpcy5wbGF5ZXJzKSB7XHJcblx0XHRcdGlmIChwbGF5ZXIgJiYgcGxheWVyLm5hbWUgPT09IGRhdGEubmFtZSkge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiUGxheWVyIGlzIGFscmVhZHkgc2lnbmVkIGluLlwiKTtcclxuXHRcdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHBsYXllciA9IG5ldyBQbGF5ZXIoc29ja2V0SWQsIGRhdGEpO1xyXG5cdFx0ZGIubG9nKGAke3NvY2tldElkfSAtICR7cGxheWVyLm5hbWV9IGhhcyBsb2dnZWQgaW4uYCk7XHJcblx0XHR0aGlzLnNlbmRHYW1lSW5mb0dsb2JhbChgJHtwbGF5ZXIubmFtZX0gaGFzIGxvZ2dlZCBpbi5gKTtcclxuXHRcdHJldHVybiBwbGF5ZXI7XHJcblx0fVxyXG5cdHBsYXllckxvZ291dChwbGF5ZXJJZCkge1xyXG5cdFx0bGV0IHBsYXllciA9IHRoaXMucGxheWVyc1twbGF5ZXJJZF07XHJcblx0XHRpZiAocGxheWVyKSB7XHJcblx0XHRcdGNvbnN0IHBsYXllckRhdGEgPSBwbGF5ZXIuZ2V0REJQYWNrKClcclxuXHRcdFx0ZGIubG9nKGAke3BsYXllci5zb2NrZXRJZH0gLSAke3BsYXllci5uYW1lfSBoYXMgbG9nZ2VkIG91dC5gKTtcclxuXHRcdFx0dGhpcy5zZW5kR2FtZUluZm9HbG9iYWwoYCR7cGxheWVyLm5hbWV9IGhhcyBsb2dnZWQgb3V0LmApO1xyXG5cdFx0XHRkZWxldGUgdGhpcy50ZXh0c1twbGF5ZXIuZGlzcGxheU5hbWVJZF07XHJcblx0XHRcdGRlbGV0ZSB0aGlzLnBsYXllcnNbcGxheWVySWRdO1xyXG5cdFx0XHRkYi5zYXZlUGxheWVyKHBsYXllckRhdGEpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRnZXRFeHBUb0xldmVsKGxldmVsKSB7XHJcblx0XHRsZXQgZXhwID0gMTA7XHJcblx0XHRmb3IgKGxldCBpID0gMTsgaSA8IGNvbmZpZy5NQVhfTEVWRUw7IGkrKykge1xyXG5cdFx0XHRpZiAoaSA9PT0gbGV2ZWwpIHJldHVybiBleHA7XHJcblx0XHRcdGV4cCA9IChleHAgKyAoZXhwICUgMikpICogMS41O1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gR2FtZSBJbmZvXHJcblx0c2VuZEdhbWVJbmZvR2xvYmFsKG1lc3NhZ2UpIHtcclxuXHRcdHRoaXMubWVzc2FnZVF1ZXVlLnB1c2gobmV3IE1lc3NhZ2UobnVsbCwgbWVzc2FnZSwgJ2dhbWVJbmZvJykpO1xyXG5cdH1cclxuXHRzZW5kR2FtZUluZm9NYXAobWFwSWQsIG1lc3NhZ2UpIHtcclxuXHRcdHRoaXMubWVzc2FnZVF1ZXVlLnB1c2gobmV3IE1lc3NhZ2UobnVsbCwgbWVzc2FnZSwgJ2dhbWVJbmZvJywgbWFwSWQpKTtcclxuXHR9XHJcblx0c2VuZEdhbWVJbmZvUGxheWVyKGlkLCBtZXNzYWdlKSB7XHJcblx0XHR0aGlzLm1lc3NhZ2VRdWV1ZS5wdXNoKG5ldyBNZXNzYWdlKG51bGwsIG1lc3NhZ2UsICdnYW1lSW5mbycsIG51bGwsIGlkKSk7XHJcblx0fVxyXG5cdFxyXG5cdC8vIENoYXQgTWVzc2FnZXNcclxuXHRzZW5kTWVzc2FnZUdsb2JhbChzZW5kZXJJZCwgbWVzc2FnZSkge1xyXG5cdFx0dGhpcy5tZXNzYWdlUXVldWUucHVzaChuZXcgTWVzc2FnZShzZW5kZXJJZCwgbWVzc2FnZSwgJ21lc3NhZ2VHbG9iYWwnKSk7XHJcblx0fVxyXG5cdHNlbmRNZXNzYWdlTWFwKHNlbmRlcklkLCBtYXBJZCwgbWVzc2FnZSkge1xyXG5cdFx0dGhpcy5tZXNzYWdlUXVldWUucHVzaChuZXcgTWVzc2FnZShzZW5kZXJJZCwgbWVzc2FnZSwgJ21lc3NhZ2VNYXAnLCBtYXBJZCkpO1xyXG5cdH1cclxuXHRzZW5kTWVzc2FnZVBsYXllcihzZW5kZXJJZCwgaWQsIG1lc3NhZ2UpIHtcclxuXHRcdHRoaXMubWVzc2FnZVF1ZXVlLnB1c2gobmV3IE1lc3NhZ2Uoc2VuZGVySWQsIG1lc3NhZ2UsICdtZXNzYWdlUGxheWVyJywgbnVsbCwgaWQpKTtcclxuXHR9XHJcblxyXG5cdC8vIE1hcFxyXG5cdGlzVmFjYW50KG1hcElkLCB4LCB5KSB7XHJcblx0XHQvLyBDaGVjayBmb3IgTWFwIEVkZ2VzXHJcblx0XHRpZiAoeCA8IDAgfHwgeCA+PSBjb25maWcuTUFQX0NPTFVNTlMpIHJldHVybiBmYWxzZTtcclxuXHRcdGlmICh5IDwgMCB8fCB5ID49IGNvbmZpZy5NQVBfUk9XUykgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHJcblx0XHQvLyBDaGVjayBmb3IgV2FsbCBUaWxlc1xyXG5cdFx0bGV0IG1hcCA9IHRoaXMubWFwc1ttYXBJZF07XHJcblx0XHRpZiAobWFwLmlzV2FsbFt5XVt4XSA9PT0gdHJ1ZSkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHJcblx0XHQvLyBDaGVjayBmb3IgQm90c1xyXG5cdFx0bGV0IGJvdHMgPSB0aGlzLmJvdHMuZmlsdGVyKChib3QpID0+IHtcclxuXHRcdFx0aWYgKGJvdC5tYXBJZCA9PT0gbWFwSWQgJiYgYm90LnggPT09IHggJiYgYm90LnkgPT09IHkgJiYgIWJvdC5pc0RlYWQpIHJldHVybiB0cnVlO1xyXG5cdFx0fSk7XHJcblx0XHRpZiAoYm90cy5sZW5ndGggPiAwKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcclxuXHRcdC8vIENoZWNrIGZvciBQbGF5ZXJzXHJcblx0XHRsZXQgcGxheWVycyA9IHRoaXMucGxheWVycy5maWx0ZXIoKHBsYXllcikgPT4ge1xyXG5cdFx0XHRpZiAocGxheWVyLm1hcElkID09PSBtYXBJZCAmJiBwbGF5ZXIueCA9PT0geCAmJiBwbGF5ZXIueSA9PT0geSAmJiAhcGxheWVyLmlzRGVhZCkgcmV0dXJuIHRydWU7XHJcblx0XHR9KTtcclxuXHRcdGlmIChwbGF5ZXJzLmxlbmd0aCA+IDApIHJldHVybiBmYWxzZTtcclxuXHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdHNwYXduQm90KG1hcElkLCB4LCB5LCB0ZW1wbGF0ZUlkLCBkaXJlY3Rpb24gPSAnZG93bicpIHtcclxuXHRcdHRlbXBsYXRlSWQgPSAnNWMxYmVjZGUyOGQwNWIwNzdjYmFhMzg1JztcclxuXHRcdGNvbnN0IHRlbXBsYXRlID0gdGhpcy5ib3RUZW1wbGF0ZXNbdGVtcGxhdGVJZF07XHJcblx0XHRpZiAodGVtcGxhdGUpIHtcclxuXHRcdFx0bmV3IEJvdChtYXBJZCwgeCwgeSwgZGlyZWN0aW9uLCB0ZW1wbGF0ZSk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJCb3QgVGVtcGxhdGUgZG9lcyBub3QgZXhpc3Qgd2l0aCB0aGF0IElkXCIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRzcGF3bk1hcEl0ZW0obWFwSWQsIHgsIHksIHRlbXBsYXRlSWQsIHN0YWNrID0gMSkge1xyXG5cdFx0bGV0IHRlbXBsYXRlID0gdGhpcy5pdGVtVGVtcGxhdGVzW3RlbXBsYXRlSWRdO1xyXG5cdFx0aWYgKHRlbXBsYXRlKSB7XHJcblx0XHRcdG5ldyBJdGVtKHttYXBJZCwgeCwgeX0sIHRlbXBsYXRlLCBzdGFjayk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJJdGVtIFRlbXBsYXRlIGRvZXMgbm90IGV4aXN0IHdpdGggdGhhdCBJZFwiKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHNwYXduRGFtYWdlVGV4dChtYXBJZCwgeCwgeSwgZGFtYWdlKSB7XHJcblx0XHRuZXcgVGV4dChtYXBJZCwgeCwgeSArIDAuNSwgZGFtYWdlLCAnI2ZmMDAwMCcsIDEuMjUsIDAsIC0xKTtcclxuXHR9XHJcblxyXG5cdHNwYXduRWZmZWN0KG1hcElkLCB4LCB5LCBzcHJpdGUsIGxvb3AsIHNwZWVkLCBtYXhGcmFtZSwgc3RhcnRGcmFtZSkge1xyXG5cdFx0bmV3IEVmZmVjdChtYXBJZCwgeCwgeSwgc3ByaXRlLCBsb29wLCBzcGVlZCwgbWF4RnJhbWUsIHN0YXJ0RnJhbWUpO1xyXG5cdH1cclxufVxyXG5cclxuY29uc3QgZ2FtZSA9IG5ldyBHYW1lKCk7XHJcbmV4cG9ydCBkZWZhdWx0IGdhbWU7XHJcbiIsIi8qKiogR2FtZSBMb29wICoqKi9cclxuLyogS2VlcHMgdHJhY2sgb2YgdGltZSBhbmQgY28tb3JkaW5hdGVzIHRoZSBnYW1lIGFuZCBzZXJ2ZXIgKi9cclxuXHJcbmltcG9ydCBOb2RlR2FtZUxvb3AgZnJvbSAnbm9kZS1nYW1lbG9vcCc7XHJcblxyXG5pbXBvcnQgZGIgZnJvbSAnLi9kYi5qcyc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4vZ2FtZS5qcyc7XHJcbmltcG9ydCBzZXJ2ZXIgZnJvbSAnLi9zZXJ2ZXIuanMnO1xyXG5pbXBvcnQgY29uZmlnIGZyb20gJy4vY29uZmlnLmpzJztcclxuXHJcbmNsYXNzIEdhbWVMb29wIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHRoaXMudGltZXIgPSB7XHJcblx0XHRcdGJhY2t1cDogMCxcclxuXHRcdFx0bWludXRlOiAwXHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuaWQgPSBOb2RlR2FtZUxvb3Auc2V0R2FtZUxvb3AoKGRlbHRhKSA9PiB0aGlzLnVwZGF0ZShkZWx0YSksIGNvbmZpZy5GUkFNRVJBVEUpO1xyXG5cdH1cclxuXHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHQvLyBJbmNyZWFzZSBUaW1lcnNcclxuXHRcdHRoaXMudGltZXIuYmFja3VwICs9IGRlbHRhO1xyXG5cdFx0dGhpcy50aW1lci5taW51dGUgKz0gZGVsdGE7XHJcblxyXG5cdFx0Ly8gVXBkYXRlIHRoZSBnYW1lIHN0YXRlXHJcblx0XHRsZXQgdXBkYXRlUGFjayA9IGdhbWUudXBkYXRlKGRlbHRhKTtcclxuXHRcdC8vIFNlbmQgdXBkYXRlZCBzdGF0ZSB0byBjbGllbnRzXHJcblx0XHRzZXJ2ZXIuc2VuZFVwZGF0ZVBhY2sodXBkYXRlUGFjayk7XHJcblx0XHRcclxuXHRcdC8vIE1pbnV0ZSB0aW1lciBzY3JpcHRcclxuXHRcdGlmICh0aGlzLnRpbWVyLm1pbnV0ZSA+PSA2MCkge1xyXG5cdFx0XHR0aGlzLnRpbWVyLm1pbnV0ZSAtPSA2MDtcclxuXHRcdFx0Ly8gVE9ETzogcnVuIG1pbnV0ZSB0aW1lciBzY3JpcHRcclxuXHRcdH1cclxuXHJcblx0XHQvLyBQZXJpb2RpYyBiYWNrdXAgdG8gZGF0YWJhc2VcclxuXHRcdGlmICh0aGlzLnRpbWVyLmJhY2t1cCA+PSBjb25maWcuQkFDS1VQX1RJTUUpIHtcclxuXHRcdFx0dGhpcy50aW1lci5iYWNrdXAgLT0gY29uZmlnLkJBQ0tVUF9USU1FO1xyXG5cdFx0XHRkYi5iYWNrdXAoKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmNvbnN0IGdhbWVMb29wID0gbmV3IEdhbWVMb29wKCk7XHJcbmV4cG9ydCBkZWZhdWx0IGdhbWVMb29wO1xyXG4iLCJpbXBvcnQgZGIgZnJvbSAnLi9kYi5qcyc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4vZ2FtZS5qcyc7XHJcbmltcG9ydCBzZXJ2ZXIgZnJvbSAnLi9zZXJ2ZXIuanMnO1xyXG5pbXBvcnQgZ2FtZWxvb3AgZnJvbSAnLi9nYW1lbG9vcC5qcyc7XHJcbiIsImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XHJcblxyXG5jb25zdCBhY2NvdW50U2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYSh7XHJcbiAgX2lkOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCxcclxuICB1c2VybmFtZToge3R5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUsIHVuaXF1ZTogdHJ1ZX0sXHJcbiAgcGFzc3dvcmQ6IHt0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlfSxcclxuICBlbWFpbDoge3R5cGU6IFN0cmluZywgdW5pcXVlOiB0cnVlLCBzcGFyc2U6IHRydWUsIG1hdGNoOiAvXigoW148PigpXFxbXFxdXFxcXC4sOzpcXHNAXCJdKyhcXC5bXjw+KClcXFtcXF1cXFxcLiw7Olxcc0BcIl0rKSopfChcIi4rXCIpKUAoKFxcW1swLTldezEsM31cXC5bMC05XXsxLDN9XFwuWzAtOV17MSwzfVxcLlswLTldezEsM31dKXwoKFthLXpBLVpcXC0wLTldK1xcLikrW2EtekEtWl17Mix9KSkkL30sXHJcbiAgdmVyaWZpZWQ6IHt0eXBlOiBCb29sZWFuLCBkZWZhdWx0OiBmYWxzZX1cclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBtb25nb29zZS5tb2RlbCgnQWNjb3VudCcsIGFjY291bnRTY2hlbWEpO1xyXG4iLCJpbXBvcnQgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xyXG5cclxuY29uc3QgYm90VGVtcGxhdGVTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcclxuICBfaWQ6IG1vbmdvb3NlLlNjaGVtYVR5cGVzLk9iamVjdElkLFxyXG4gIG5hbWU6IHt0eXBlOiBTdHJpbmcsIGRlZmF1bHQ6IFwiQm90XCJ9LFxyXG4gIHNwcml0ZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMX0sXHJcbiAgZGFtYWdlQmFzZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcbiAgZGVmZW5jZUJhc2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG4gIGhlYWx0aE1heEJhc2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDF9LFxyXG4gIGVuZXJneU1heEJhc2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDF9LFxyXG4gIHJhbmdlQmFzZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMX0sXHJcbiAgaG9zdGlsZToge3R5cGU6IEJvb2xlYW4sIGRlZmF1bHQ6IHRydWV9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWwoJ0JvdFRlbXBsYXRlJywgYm90VGVtcGxhdGVTY2hlbWEpO1xyXG4iLCJpbXBvcnQgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xyXG5cclxuY29uc3QgaXRlbVRlbXBsYXRlU2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYSh7XHJcblx0X2lkOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCxcclxuXHRuYW1lOiB7dHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZX0sXHJcblx0c3ByaXRlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuXHRyZXVzYWJsZToge3R5cGU6IEJvb2xlYW4sIGRlZmF1bHQ6IHRydWV9LFxyXG5cdHR5cGU6IHt0eXBlOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCwgcmVmOiAnSXRlbVR5cGUnLCByZXF1aXJlZDogdHJ1ZX0sXHJcblx0cGFzc2l2ZURhbWFnZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcblx0cGFzc2l2ZURlZmVuY2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG5cdHBhc3NpdmVIZWFsdGhNYXg6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG5cdHBhc3NpdmVFbmVyZ3lNYXg6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG5cdHBhc3NpdmVSYW5nZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcblx0ZXF1aXBwZWREYW1hZ2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG5cdGVxdWlwcGVkRGVmZW5jZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcblx0ZXF1aXBwZWRIZWFsdGhNYXg6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG5cdGVxdWlwcGVkRW5lcmd5TWF4OiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuXHRlcXVpcHBlZFJhbmdlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfVxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1vbmdvb3NlLm1vZGVsKCdJdGVtVGVtcGxhdGUnLCBpdGVtVGVtcGxhdGVTY2hlbWEpO1xyXG4iLCJpbXBvcnQgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xyXG5cclxuY29uc3QgaXRlbVR5cGVTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcclxuXHRfaWQ6IG1vbmdvb3NlLlNjaGVtYVR5cGVzLk9iamVjdElkLFxyXG5cdG5hbWU6IHt0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlfSxcclxuXHRlcXVpcHBlZFNsb3Q6IHt0eXBlOiBOdW1iZXIsIHJlcXVpcmVkOiB0cnVlfSxcclxuXHRzdGFja2FibGU6IHt0eXBlOiBCb29sZWFuLCByZXF1aXJlZDogdHJ1ZX1cclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBtb25nb29zZS5tb2RlbCgnSXRlbVR5cGUnLCBpdGVtVHlwZVNjaGVtYSk7XHJcbiIsImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XHJcblxyXG5jb25zdCBtYXBTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcclxuXHRfaWQ6IG1vbmdvb3NlLlNjaGVtYVR5cGVzLk9iamVjdElkLFxyXG5cdG1hcElkOiBOdW1iZXIsXHJcblx0bmFtZToge3R5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWV9LFxyXG5cdGRyb3BDaGFuY2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDEwMH0sXHJcblx0ZHJvcEFtb3VudEVROiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuXHR0aWxlczoge3R5cGU6IFtbW051bWJlcl1dXSwgZGVmYXVsdDogW1tbXV1dfSxcclxuXHRpc1dhbGw6IHt0eXBlOiBbW0Jvb2xlYW5dXSwgZGVmYXVsdDogZmFsc2V9LFxyXG5cdGlzSG9zdGlsZToge3R5cGU6IFtbQm9vbGVhbl1dLCBkZWZhdWx0OiBmYWxzZX0sXHJcblx0ZGFtYWdlOiB7dHlwZTogW1tOdW1iZXJdXSwgZGVmYXVsdDogbnVsbH0sXHJcblx0d2FycE1hcDoge3R5cGU6IFtbTnVtYmVyXV0sIGRlZmF1bHQ6IG51bGx9LFxyXG5cdHdhcnBYOiB7dHlwZTogW1tOdW1iZXJdXSwgZGVmYXVsdDogbnVsbH0sXHJcblx0d2FycFk6IHt0eXBlOiBbW051bWJlcl1dLCBkZWZhdWx0OiBudWxsfVxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1vbmdvb3NlLm1vZGVsKCdNYXAnLCBtYXBTY2hlbWEpO1xyXG4iLCJpbXBvcnQgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xyXG5cclxuY29uc3QgcGxheWVyU2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYSh7XHJcbiAgX2lkOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCxcclxuICBhY2NvdW50OiB7dHlwZTogbW9uZ29vc2UuU2NoZW1hVHlwZXMuT2JqZWN0SWQsIHJlZjogJ0FjY291bnQnLCByZXF1aXJlZDogdHJ1ZX0sXHJcbiAgbmFtZToge3R5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUsIHVuaXF1ZTogdHJ1ZX0sXHJcbiAgdGVtcGxhdGU6IHt0eXBlOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCwgcmVmOiAnUGxheWVyVGVtcGxhdGUnLCByZXF1aXJlZDogdHJ1ZX0sXHJcbiAgbGV2ZWw6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDF9LFxyXG4gIGV4cGVyaWVuY2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG4gIG1hcElkOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuICB4OiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiA1fSxcclxuICB5OiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiA1fSxcclxuICBkaXJlY3Rpb246IHt0eXBlOiBTdHJpbmcsIGRlZmF1bHQ6ICdkb3duJ30sXHJcbiAgYWRtaW5BY2Nlc3M6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG4gIHNwcml0ZTogTnVtYmVyXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWwoJ1BsYXllcicsIHBsYXllclNjaGVtYSk7XHJcbiIsImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XHJcblxyXG5jb25zdCBwbGF5ZXJUZW1wbGF0ZVNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoe1xyXG4gIF9pZDogbW9uZ29vc2UuU2NoZW1hVHlwZXMuT2JqZWN0SWQsXHJcbiAgbmFtZToge3R5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUsIHVuaXF1ZTogdHJ1ZX0sXHJcbiAgc3ByaXRlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuICBkYW1hZ2VCYXNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuICBkZWZlbmNlQmFzZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcbiAgaGVhbHRoTWF4QmFzZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMX0sXHJcbiAgZW5lcmd5TWF4QmFzZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMX0sXHJcbiAgcmFuZ2VCYXNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuICBoZWFsdGhQZXJMZXZlbDoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcbiAgZW5lcmd5UGVyTGV2ZWw6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWwoJ1BsYXllclRlbXBsYXRlJywgcGxheWVyVGVtcGxhdGVTY2hlbWEpO1xyXG4iLCJpbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcclxuaW1wb3J0IGh0dHAgZnJvbSAnaHR0cCc7XHJcbmltcG9ydCBzb2NrZXRJTyBmcm9tICdzb2NrZXQuaW8nO1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuXHJcbmltcG9ydCBkYiBmcm9tICcuL2RiLmpzJztcclxuaW1wb3J0IGdhbWUgZnJvbSAnLi9nYW1lLmpzJztcclxuaW1wb3J0IGNvbmZpZyBmcm9tICcuL2NvbmZpZy5qcyc7XHJcblxyXG5jbGFzcyBTZXJ2ZXIge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0Y29uc3QgYXBwID0gZXhwcmVzcygpO1xyXG5cdFx0Y29uc3QgaHR0cFNlcnZlciA9IGh0dHAuU2VydmVyKGFwcCk7XHJcblx0XHRjb25zdCBpbyA9IHNvY2tldElPKGh0dHBTZXJ2ZXIpO1xyXG5cdFx0Y29uc3QgcG9ydCA9IHByb2Nlc3MuZW52LlBPUlQgfHwgY29uZmlnLlBPUlQ7XHJcblx0XHRjb25zdCBwdWJsaWNQYXRoID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uL2NsaWVudCcpO1xyXG5cdFx0XHJcblx0XHRhcHAuZ2V0KCcvJywgKHJlcSwgcmVzKSA9PiByZXMuc2VuZEZpbGUocHVibGljUGF0aCArICcvaW5kZXguaHRtbCcpKTtcclxuXHRcdGFwcC51c2UoJy9jbGllbnQnLCBleHByZXNzLnN0YXRpYyhwdWJsaWNQYXRoKSk7XHJcblx0XHRodHRwU2VydmVyLmxpc3Rlbihwb3J0LCAoKSA9PiBkYi5sb2coYFNlcnZlciBzdGFydGVkLiBMaXN0ZW5pbmcgb24gcG9ydCAke2h0dHBTZXJ2ZXIuYWRkcmVzcygpLnBvcnR9Li4uYCkpO1xyXG5cclxuXHRcdHRoaXMuc29ja2V0TGlzdCA9IHt9O1xyXG5cdFx0dGhpcy5hY3RpdmVBY2NvdW50cyA9IHt9O1xyXG5cclxuXHRcdGlvLnNvY2tldHMub24oJ2Nvbm5lY3Rpb24nLCBzb2NrZXQgPT4gdGhpcy5vbkNvbm5lY3Qoc29ja2V0KSk7XHJcblx0fVxyXG5cclxuXHQvKiBjb25uZWN0ID0+IHNpZ25pbiA9PiBzZWxlY3RwbGF5ZXJcclxuXHQqKiBjb25uZWN0IHdoZW4gcGFnZSBsb2FkcyAtIHNob3dzIHNpZ25pbiBwYWdlXHJcblx0Kiogc2lnbmluIHdoZW4gdXNlcm5hbWUgYW5kIHBhc3N3b3JkIGlzIHN1Ym1pdHRlZFxyXG4gXHQqKiBzZWxlY3RwbGF5ZXIgd2hlbiBjaGFyYWN0ZXIgaXMgY2hvc2VuIC0gbG9ncyBpbnRvIHRoZSBnYW1lXHJcblx0Ki9cclxuXHJcblx0Ly8gUmVjZWl2ZSBkYXRhIGZyb20gY2xpZW50c1xyXG5cdG9uQ29ubmVjdChzb2NrZXQpIHtcclxuXHRcdHRoaXMuc29ja2V0TGlzdFtzb2NrZXQuaWRdID0gc29ja2V0O1xyXG5cdFx0ZGIubG9nKGAke3NvY2tldC5pZH0gLSBTb2NrZXQgY29ubmVjdGVkLmApO1xyXG5cdFx0XHJcblx0XHRzb2NrZXQub24oJ2Rpc2Nvbm5lY3QnLCAoKSA9PiB0aGlzLm9uRGlzY29ubmVjdChzb2NrZXQpKTtcclxuXHRcdHNvY2tldC5vbignc2lnbnVwJywgKGRhdGEpID0+IHRoaXMub25TaWduVXAoZGF0YS51c2VybmFtZSwgZGF0YS5wYXNzd29yZCwgZGF0YS5lbWFpbCkpO1xyXG5cdFx0c29ja2V0Lm9uKCdzaWduaW4nLCAoZGF0YSkgPT4gdGhpcy5vblNpZ25Jbihzb2NrZXQsIGRhdGEudXNlcm5hbWUsIGRhdGEucGFzc3dvcmQpKTtcclxuXHRcdHNvY2tldC5vbignc2lnbm91dCcsICgpID0+IHRoaXMub25TaWduT3V0KHNvY2tldCkpO1xyXG5cdFx0Ly8gVGVsbCBjbGllbnQgdGhleSBoYXZlIGNvbm5lY3RlZFxyXG5cdH1cclxuXHJcblx0YXN5bmMgb25EaXNjb25uZWN0KHNvY2tldCkge1xyXG5cdFx0aWYgKHNvY2tldC5wbGF5ZXJJZCAhPSBudWxsICYmIGdhbWUucGxheWVyc1tzb2NrZXQucGxheWVySWRdKSBhd2FpdCB0aGlzLm9uTG9nT3V0KHNvY2tldCk7XHJcblx0XHRpZiAoc29ja2V0LmFjY291bnRJZCAmJiB0aGlzLmFjdGl2ZUFjY291bnRzW3NvY2tldC5hY2NvdW50SWRdKSBhd2FpdCB0aGlzLm9uU2lnbk91dChzb2NrZXQpO1xyXG5cclxuXHRcdGRiLmxvZyhgJHtzb2NrZXQuaWR9IC0gU29ja2V0IGRpc2Nvbm5lY3RlZC5gKTtcclxuXHRcdGRlbGV0ZSB0aGlzLnNvY2tldExpc3Rbc29ja2V0LmlkXTtcclxuXHR9XHJcblxyXG5cdGFzeW5jIG9uU2lnblVwKHVzZXJuYW1lLCBwYXNzd29yZCwgZW1haWwpIHtcclxuXHRcdGxldCBzdWNjZXNzID0gYXdhaXQgZGIuYWRkQWNjb3VudCh1c2VybmFtZSwgcGFzc3dvcmQsIGVtYWlsKTtcclxuXHRcdGlmIChzdWNjZXNzKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiVGVsbCBjbGllbnQgc2lnbnVwIHdhcyBzdWNjZXNzZnVsXCIpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiVGVsbCBjbGllbnQgc2lnbnVwIHdhcyBub3Qgc3VjY2Vzc2Z1bFwiKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGFzeW5jIG9uU2lnbkluKHNvY2tldCwgdXNlcm5hbWUsIHBhc3N3b3JkKSB7XHJcblx0XHRsZXQgc3VjY2VzcyA9IGF3YWl0IGRiLmF1dGhBY2NvdW50KHVzZXJuYW1lLCBwYXNzd29yZCk7XHJcblx0XHRpZiAoIXN1Y2Nlc3MpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coYFNpZ24gaW4gZmFpbGVkIG9uIHVzZXJuYW1lICR7dXNlcm5hbWV9YCk7XHJcblx0XHRcdC8vIFRlbGwgY2xpZW50IHNpZ25pbiB3YXMgbm90IHN1Y2Nlc3NmdWxcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBhY2NvdW50SWQgPSBhd2FpdCBkYi5nZXRBY2NvdW50SWQodXNlcm5hbWUpO1xyXG5cdFx0aWYgKHRoaXMuYWN0aXZlQWNjb3VudHNbYWNjb3VudElkXSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIlRoYXQgYWNjb3VudCBpcyBhbHJlYWR5IHNpZ25lZCBpbi5cIik7XHJcblx0XHRcdC8vIFRlbGwgY2xpZW50IHRoYXQgYWNjb3VudCBpcyBhbHJlYWR5IHNpZ25lZCBpblxyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHNvY2tldC5hY2NvdW50SWQgPSBhY2NvdW50SWQ7XHJcblx0XHR0aGlzLmFjdGl2ZUFjY291bnRzW2FjY291bnRJZF0gPSB1c2VybmFtZTtcclxuXHJcblx0XHRzb2NrZXQub24oJ2FkZFBsYXllcicsIChkYXRhKSA9PiB0aGlzLm9uQWRkUGxheWVyKHNvY2tldCwgZGF0YS5uYW1lLCBkYXRhLnRlbXBsYXRlTmFtZSkpO1xyXG5cdFx0c29ja2V0Lm9uKCdsb2dpbicsIChuYW1lKSA9PiB0aGlzLm9uTG9nSW4oc29ja2V0LCBuYW1lKSk7XHJcblx0XHRzb2NrZXQub24oJ2xvZ291dCcsICgpID0+IHRoaXMub25Mb2dPdXQoc29ja2V0KSk7XHJcblx0XHRzb2NrZXQub24oJ2FkZFBsYXllclRlbXBsYXRlJywgKGRhdGEpID0+IHRoaXMub25BZGRQbGF5ZXJUZW1wbGF0ZShkYXRhKSk7XHJcblxyXG5cdFx0ZGIubG9nKGAke3NvY2tldC5pZH0gLSAke3VzZXJuYW1lfSBzaWduZWQgaW4uYCk7XHJcblx0XHR0aGlzLnNlbmRTaWduZWRJbihzb2NrZXQpO1xyXG5cdH1cclxuXHRcclxuXHRhc3luYyBvblNpZ25PdXQoc29ja2V0KSB7XHJcblx0XHRpZiAoc29ja2V0LnBsYXllcklkICE9IG51bGwpIGF3YWl0IHRoaXMub25Mb2dPdXQoc29ja2V0KTtcclxuXHRcdFxyXG5cdFx0aWYgKHNvY2tldC5hY2NvdW50SWQpIHtcclxuXHRcdFx0Y29uc3QgdXNlcm5hbWUgPSB0aGlzLmFjdGl2ZUFjY291bnRzW3NvY2tldC5hY2NvdW50SWRdO1xyXG5cdFx0XHRkYi5sb2coYCR7c29ja2V0LmlkfSAtICR7dXNlcm5hbWV9IHNpZ25lZCBvdXQuYCk7XHJcblx0XHRcdGRlbGV0ZSB0aGlzLmFjdGl2ZUFjY291bnRzW3NvY2tldC5hY2NvdW50SWRdO1xyXG5cdFx0XHRzb2NrZXQuYWNjb3VudElkID0gbnVsbDtcclxuXHRcdFx0dGhpcy5zZW5kU2lnbmVkT3V0KHNvY2tldCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRhc3luYyBvbkFkZFBsYXllcihzb2NrZXQsIG5hbWUsIHRlbXBsYXRlSWQpIHtcclxuXHRcdGxldCBzdWNjZXNzID0gYXdhaXQgZGIuYWRkUGxheWVyKHNvY2tldC5hY2NvdW50SWQsIG5hbWUsIHRlbXBsYXRlSWQpO1xyXG5cdFx0aWYgKHN1Y2Nlc3MpIHtcclxuXHRcdFx0Y29uc3QgdXNlcm5hbWUgPSB0aGlzLmFjdGl2ZUFjY291bnRzW3NvY2tldC5hY2NvdW50SWRdO1xyXG5cdFx0XHRkYi5sb2coYCR7c29ja2V0LmlkfSAtICR7bmFtZX0gaGFzIGJlZW4gYWRkZWQgYXMgYSBwbGF5ZXIgdG8gYWNjb3VudCAke3VzZXJuYW1lfS5gKTtcclxuXHRcdFx0Ly8gVGVsbCBjbGllbnQgYWRkIHBsYXllciB3YXMgc3VjY2Vzc2Z1bFxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdC8vIFRlbGwgY2xpZW50IGFkZCBwbGF5ZXIgd2FzIG5vdCBzdWNjZXNzZnVsXHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGFzeW5jIG9uQWRkUGxheWVyVGVtcGxhdGUoZGF0YSkge1xyXG5cdFx0bGV0IHN1Y2Nlc3MgPSBhd2FpdCBkYi5hZGRQbGF5ZXJUZW1wbGF0ZShkYXRhKTtcclxuXHRcdGlmIChzdWNjZXNzKSB7XHJcblx0XHRcdGdhbWUubG9hZFBsYXllclRlbXBsYXRlcygpO1xyXG5cdFx0XHRkYi5sb2coYCR7c29ja2V0LmlkfSAtICR7ZGF0YS5uYW1lfSBoYXMgYmVlbiBhZGRlZCBhcyBhIHBsYXllciB0ZW1wbGF0ZS5gKTtcclxuXHRcdFx0Ly8gVGVsbCBjbGllbnQgYWRkIHBsYXllciB3YXMgc3VjY2Vzc2Z1bFxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdC8vIFRlbGwgY2xpZW50IGFkZCBwbGF5ZXIgd2FzIG5vdCBzdWNjZXNzZnVsXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRhc3luYyBvbkxvZ0luKHNvY2tldCwgbmFtZSkge1xyXG5cdFx0aWYgKCFzb2NrZXQuYWNjb3VudElkKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiTm90IHNpZ25lZCBpbnRvIGFjY291bnQuXCIpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRpZiAoc29ja2V0LnBsYXllcklkICE9IG51bGwpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJBbHJlYWR5IGxvZ2dlZCBpbi5cIik7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgcGxheWVyRGF0YSA9IGF3YWl0IGRiLmdldFBsYXllcihuYW1lKTtcclxuXHRcdGlmICghcGxheWVyRGF0YSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIk5vIHBsYXllciB3aXRoIHRoYXQgbmFtZS5cIik7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoXCJcIitzb2NrZXQuYWNjb3VudElkICE9PSBcIlwiK3BsYXllckRhdGEuYWNjb3VudCkge1x0Ly8gQ2FzdCB0byBzdHJpbmcgYmVmb3JlIGNvbXBhcmlzb25cclxuXHRcdFx0ZGIubG9nKGBBdHRlbXB0IHRvIGxvZ2luIHRvIHBsYXllciAoJHtwbGF5ZXJEYXRhLm5hbWV9KSBmcm9tIHdyb25nIGFjY291bnQgKCR7c29ja2V0LmFjY291bnRJZH0pIG9uIHNvY2tldCAke3NvY2tldC5pZH0uYCk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBwbGF5ZXIgPSBnYW1lLnBsYXllckxvZ2luKHNvY2tldC5pZCwgcGxheWVyRGF0YSk7XHJcblx0XHRpZiAoIXBsYXllcikgcmV0dXJuO1xyXG5cdFxyXG5cdFx0c29ja2V0LnBsYXllcklkID0gcGxheWVyLmdhbWVJZDtcclxuXHRcdHNvY2tldC5vbignaW5wdXQnLCAoZGF0YSkgPT4gcGxheWVyLmlucHV0RGF0YShkYXRhKSk7XHJcblx0XHRzb2NrZXQub24oJ3VwbG9hZE1hcCcsIChkYXRhKSA9PiB7XHJcblx0XHRcdGlmIChwbGF5ZXIuYWRtaW5BY2Nlc3MgPj0gMikge1xyXG5cdFx0XHRcdHRoaXMub25VcGxvYWRNYXAoZGF0YSk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0Z2FtZS5zZW5kR2FtZUluZm9QbGF5ZXIocGxheWVyLmdhbWVJZCwgYFlvdSBkb24ndCBoYXZlIGFjY2VzcyB0byB0aGF0IGNvbW1hbmQuYCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5zZW5kTWFwRGF0YShzb2NrZXQsIHBsYXllci5tYXBJZCk7XHJcblx0fVxyXG5cdFxyXG5cdGFzeW5jIG9uTG9nT3V0KHNvY2tldCkge1xyXG5cdFx0aWYgKHNvY2tldC5wbGF5ZXJJZCAhPSBudWxsKSB7XHJcblx0XHRcdGF3YWl0IGdhbWUucGxheWVyTG9nb3V0KHNvY2tldC5wbGF5ZXJJZCk7XHJcblx0XHRcdHNvY2tldC5wbGF5ZXJJZCA9IG51bGw7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGFzeW5jIG9uVXBsb2FkTWFwKGRhdGEpIHtcclxuXHRcdGxldCBzdWNjZXNzID0gYXdhaXQgZGIuc2F2ZU1hcChkYXRhKTtcclxuXHRcdGlmICghc3VjY2Vzcykge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIkZhaWxlZCB0byB1cGxvYWQgbWFwLlwiKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGdhbWUucGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcclxuXHRcdFx0aWYgKHBsYXllci5tYXBJZCA9PT0gZGF0YS5tYXBJZCkge1xyXG5cdFx0XHRcdHRoaXMuc2VuZE1hcERhdGEodGhpcy5zb2NrZXRMaXN0W3BsYXllci5zb2NrZXRJZF0sIHBsYXllci5tYXBJZCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0Ly8gU2VuZCBkYXRhIHRvIGNsaWVudHNcclxuXHRzZW5kVXBkYXRlUGFjayh1cGRhdGVQYWNrKSB7XHJcblx0XHRnYW1lLnBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XHJcblx0XHRcdGNvbnN0IHBhY2sgPSB7XHJcblx0XHRcdFx0Z2FtZToge1xyXG5cdFx0XHRcdFx0cGxheWVyczogW11cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHVpOiBwbGF5ZXIuZ2V0VUlQYWNrKClcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdGZvciAobGV0IHBsYXllckRhdGEgb2YgdXBkYXRlUGFjay5wbGF5ZXJzKSB7XHJcblx0XHRcdFx0aWYgKHBsYXllckRhdGEgJiYgKHBsYXllckRhdGEubWFwSWQgPT09IHBsYXllci5tYXBJZCAmJiAocGxheWVyRGF0YS5pc1Zpc2libGUgfHwgcGxheWVyRGF0YS5zb2NrZXRJZCA9PT0gcGxheWVyLnNvY2tldElkKSkpIHtcclxuXHRcdFx0XHRcdHBhY2suZ2FtZS5wbGF5ZXJzW3BsYXllckRhdGEuZ2FtZUlkXSA9IHBsYXllckRhdGE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdC8vIHBhY2suZ2FtZS5wbGF5ZXJzID0gdXBkYXRlUGFjay5wbGF5ZXJzLmZpbHRlcigocGxheWVyRGF0YSkgPT4ge1xyXG5cdFx0XHQvLyBcdHJldHVybiAocGxheWVyRGF0YS5tYXBJZCA9PT0gcGxheWVyLm1hcElkICYmIChwbGF5ZXJEYXRhLmlzVmlzaWJsZSB8fCBwbGF5ZXJEYXRhLnNvY2tldElkID09PSBwbGF5ZXIuc29ja2V0SWQpKTtcclxuXHRcdFx0Ly8gfSk7XHJcblx0XHRcdHBhY2suZ2FtZS5ib3RzID0gdXBkYXRlUGFjay5ib3RzLmZpbHRlcihib3QgPT4ge1xyXG5cdFx0XHRcdHJldHVybiBib3QubWFwSWQgPT09IHBsYXllci5tYXBJZDtcclxuXHRcdFx0fSk7XHJcblx0XHRcdHBhY2suZ2FtZS5pdGVtcyA9IHVwZGF0ZVBhY2suaXRlbXMuZmlsdGVyKGl0ZW0gPT4ge1xyXG5cdFx0XHRcdHJldHVybiBpdGVtLm1hcElkID09PSBwbGF5ZXIubWFwSWQ7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRwYWNrLmdhbWUuZWZmZWN0cyA9IHVwZGF0ZVBhY2suZWZmZWN0cy5maWx0ZXIoZWZmZWN0ID0+IHtcclxuXHRcdFx0XHRyZXR1cm4gZWZmZWN0Lm1hcElkID09PSBwbGF5ZXIubWFwSWQ7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRwYWNrLmdhbWUudGV4dHMgPSB1cGRhdGVQYWNrLnRleHRzLmZpbHRlcih0ZXh0ID0+IHtcclxuXHRcdFx0XHRyZXR1cm4gdGV4dC5tYXBJZCA9PT0gcGxheWVyLm1hcElkO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHBhY2sudWkubWVzc2FnZXMgPSB1cGRhdGVQYWNrLm1lc3NhZ2VzLmZpbHRlcigobWVzc2FnZSkgPT4ge1xyXG5cdFx0XHRcdHJldHVybiAoKG1lc3NhZ2UubWFwSWQgPT0gbnVsbCAmJiBtZXNzYWdlLmlkID09IG51bGwpIHx8IHBsYXllci5tYXBJZCA9PT0gbWVzc2FnZS5tYXBJZCB8fCBwbGF5ZXIuZ2FtZUlkID09PSBtZXNzYWdlLmlkKTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdFxyXG5cdFx0XHR0aGlzLnNvY2tldExpc3RbcGxheWVyLnNvY2tldElkXS5lbWl0KCd1cGRhdGUnLCBwYWNrKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRcclxuXHRzZW5kTWFwRGF0YShzb2NrZXQsIG1hcElkKSB7XHJcblx0XHRjb25zdCBtYXBEYXRhID0gZ2FtZS5tYXBzW21hcElkXS5nZXRQYWNrKCk7XHJcblx0XHRzb2NrZXQuZW1pdCgnbG9hZE1hcCcsIG1hcERhdGEpO1xyXG5cdH1cclxuXHJcblx0YXN5bmMgc2VuZFNpZ25lZEluKHNvY2tldCkge1xyXG5cdFx0bGV0IGFjY291bnQgPSBhd2FpdCBkYi5nZXRBY2NvdW50KHNvY2tldC5hY2NvdW50SWQpO1xyXG5cdFx0c29ja2V0LmVtaXQoJ3NpZ25lZEluJywge1xyXG5cdFx0XHRlbWFpbDogYWNjb3VudC5lbWFpbCxcclxuXHRcdFx0dmVyaWZpZWQ6IGFjY291bnQudmVyaWZpZWQsXHJcblx0XHRcdC8vZGF0ZUNyZWF0ZWQ6IGFjY291bnQuZGF0ZUNyZWF0ZWRcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0c2VuZFNpZ25lZE91dChzb2NrZXQpIHtcclxuXHRcdHNvY2tldC5lbWl0KCdzaWduZWRPdXQnKTtcclxuXHR9XHJcbn1cclxuXHJcbmNvbnN0IHNlcnZlciA9IG5ldyBTZXJ2ZXIoKTtcclxuZXhwb3J0IGRlZmF1bHQgc2VydmVyO1xyXG4iLCJmdW5jdGlvbiBjcmVhdGUyZEFycmF5KGNvbHVtbnMsIHJvd3MsIGRlZmF1bHRWYWx1ZSkge1xyXG4gIGNvbnN0IGFycmF5ID0gW107XHJcbiAgZm9yIChsZXQgeSA9IDA7IHkgPCByb3dzOyB5KyspIHtcclxuICAgIGFycmF5W3ldID0gW107XHJcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IGNvbHVtbnM7IHgrKykge1xyXG4gICAgICBhcnJheVt5XVt4XSA9IGRlZmF1bHRWYWx1ZTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGFycmF5O1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGUzZEFycmF5KGNvbHVtbnMsIHJvd3MsIGxheWVycywgZGVmYXVsdFZhbHVlKSB7XHJcbiAgY29uc3QgYXJyYXkgPSBbXTtcclxuICBmb3IgKGxldCB6ID0gMDsgeiA8IGxheWVyczsgeisrKSB7XHJcbiAgICBhcnJheVt6XSA9IFtdOyBcclxuICAgIGZvciAobGV0IHkgPSAwOyB5IDwgcm93czsgeSsrKSB7XHJcbiAgICAgIGFycmF5W3pdW3ldID0gW107XHJcbiAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgY29sdW1uczsgeCsrKSB7XHJcbiAgICAgICAgYXJyYXlbel1beV1beF0gPSBkZWZhdWx0VmFsdWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGFycmF5O1xyXG59XHJcblxyXG5mdW5jdGlvbiBzaHVmZmxlKGFycmF5KSB7XHJcbiAgbGV0IGN1cnJlbnRJbmRleCA9IGFycmF5Lmxlbmd0aDtcclxuICBsZXQgdGVtcDtcclxuICBsZXQgcmFuZG9tSW5kZXg7XHJcbiAgd2hpbGUgKGN1cnJlbnRJbmRleCAhPT0gMCkge1xyXG4gICAgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyZW50SW5kZXgpO1xyXG4gICAgY3VycmVudEluZGV4IC09IDE7XHJcbiAgICB0ZW1wID0gYXJyYXlbY3VycmVudEluZGV4XTtcclxuICAgIGFycmF5W2N1cnJlbnRJbmRleF0gPSBhcnJheVtyYW5kb21JbmRleF07XHJcbiAgICBhcnJheVtyYW5kb21JbmRleF0gPSB0ZW1wO1xyXG4gIH1cclxuICByZXR1cm4gYXJyYXk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN3YXAoYXJyYXksIGksIGopIHtcclxuICBjb25zdCB0ZW1wID0gYXJyYXlbaV07XHJcbiAgYXJyYXlbaV0gPSBhcnJheVtqXTtcclxuICBhcnJheVtqXSA9IHRlbXA7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpcnN0RW1wdHlJbmRleChhcnJheSkge1xyXG4gIGlmIChhcnJheS5sZW5ndGggPCAxKSByZXR1cm4gMDtcclxuICBcclxuICBmb3IgKGxldCBpID0gMDsgaSA8PSBhcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgaWYgKGFycmF5W2ldID09IG51bGwpIHJldHVybiBpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbGVycChzdGFydCwgZW5kLCB0aW1lKSB7XHJcbiAgLy9yZXR1cm4gc3RhcnQgKyAodGltZSAqIChlbmQgLSBzdGFydCkpO1xyXG4gIHJldHVybiAoKDEgLSB0aW1lKSAqIHN0YXJ0KSArICh0aW1lICogZW5kKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2xhbXAodmFsdWUsIG1pbmltdW0sIG1heGltdW0pIHtcclxuICBpZiAodmFsdWUgPCBtaW5pbXVtKSB7XHJcbiAgICByZXR1cm4gbWluaW11bTtcclxuICB9XHJcbiAgZWxzZSBpZiAodmFsdWUgPiBtYXhpbXVtKSB7XHJcbiAgICByZXR1cm4gbWF4aW11bTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiByYW5kb21JbnQobWluaW11bSwgbWF4aW11bSkge1xyXG4gIHJldHVybiBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogKG1heGltdW0gKyAxKSkgKyBtaW5pbXVtKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0WEZyb21JbmRleChpbmRleCwgY29sdW1ucykge1xyXG4gIHJldHVybiBpbmRleCAlIGNvbHVtbnM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFlGcm9tSW5kZXgoaW5kZXgsIGNvbHVtbnMpIHtcclxuICByZXR1cm4gKGluZGV4IC0gKGluZGV4ICUgY29sdW1ucykpIC8gY29sdW1ucztcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0SW5kZXhGcm9tWFkoeCwgeSwgY29sdW1ucykge1xyXG4gIHJldHVybiAoeSAqIGNvbHVtbnMpICsgeDtcclxufVxyXG5cclxuZnVuY3Rpb24gdGltZXN0YW1wKGRhdGUpIHtcclxuICBpZiAoIShkYXRlIGluc3RhbmNlb2YgRGF0ZSkpIHJldHVybiBcIkludmFsaWQgZGF0ZVwiO1xyXG4gIGxldCBtb250aCA9IGRhdGUuZ2V0TW9udGgoKSArIDE7XHJcbiAgbGV0IGRheSA9IGRhdGUuZ2V0RGF0ZSgpO1xyXG4gIGxldCBob3VyID0gZGF0ZS5nZXRIb3VycygpO1xyXG4gIGxldCBtaW51dGUgPSBkYXRlLmdldE1pbnV0ZXMoKTtcclxuICBsZXQgc2Vjb25kID0gZGF0ZS5nZXRTZWNvbmRzKCk7XHJcbiAgaWYgKG1vbnRoIDwgMTApIG1vbnRoID0gXCIwXCIgKyBtb250aDtcclxuICBpZiAoZGF5IDwgMTApIGRheSA9IFwiMFwiICsgZGF5O1xyXG4gIGlmIChob3VyIDwgMTApIGhvdXIgPSBcIjBcIiArIGhvdXI7XHJcbiAgaWYgKG1pbnV0ZSA8IDEwKSBtaW51dGUgPSBcIjBcIiArIG1pbnV0ZTtcclxuICBpZiAoc2Vjb25kIDwgMTApIHNlY29uZCA9IFwiMFwiICsgc2Vjb25kO1xyXG4gIHJldHVybiBgJHtkYXRlLmdldEZ1bGxZZWFyKCl9LSR7bW9udGh9LSR7ZGF5fSAke2hvdXJ9OiR7bWludXRlfToke3NlY29uZH1gO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbmRlZmluaXRlQXJ0aWNsZSh3b3JkKSB7XHJcblx0bGV0IHJlZ2V4ID0gL3Ryb3VzZXJzJHxqZWFucyR8Z2xhc3NlcyQvaTtcclxuXHRpZiAod29yZC5tYXRjaChyZWdleCkpIHJldHVybiBcImEgcGFpciBvZiBcIiArIHdvcmQ7XHJcblxyXG5cdHJlZ2V4ID0gL15bYWVpb3VdL2k7XHJcblx0aWYgKHdvcmQubWF0Y2gocmVnZXgpKSByZXR1cm4gXCJhbiBcIiArIHdvcmQ7XHJcblxyXG5cdHJldHVybiBcImEgXCIgKyB3b3JkO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwbHVyYWwod29yZCkge1xyXG5cdGxldCByZWdleCA9IC9zaGVlcCR8ZGVlciR8ZmlzaCQvaTtcclxuXHRpZiAod29yZC5tYXRjaChyZWdleCkpIHJldHVybiB3b3JkO1xyXG5cclxuXHRyZWdleCA9IC90cm91c2VycyR8amVhbnMkfGdsYXNzZXMkL2k7XHJcblx0aWYgKHdvcmQubWF0Y2gocmVnZXgpKSByZXR1cm4gXCJwYWlycyBvZiBcIiArIHdvcmQ7XHJcblx0XHJcblx0cmVnZXggPSAvc3RvbWFjaCR8ZXBvY2gkfC9pO1xyXG5cdGlmICh3b3JkLm1hdGNoKHJlZ2V4KSkgcmV0dXJuIHdvcmQgKyBcInNcIjtcclxuXHRcclxuXHRyZWdleCA9IC9mJHxmZSQvaTtcclxuXHRpZiAod29yZC5tYXRjaChyZWdleCkpIHJldHVybiB3b3JkLnJlcGxhY2UocmVnZXgsIFwidmVzXCIpO1xyXG5cclxuXHRyZWdleCA9IC9bc3h6XSR8Y2gkfHNoJHxhdG8kL2k7XHJcblx0aWYgKHdvcmQubWF0Y2gocmVnZXgpKSByZXR1cm4gd29yZCArIFwiZXNcIjtcclxuXHRcclxuXHRyZWdleCA9IC95JC9pO1xyXG5cdGlmICh3b3JkLm1hdGNoKHJlZ2V4KSkgcmV0dXJuIHdvcmQucmVwbGFjZShyZWdleCwgXCJpZXNcIik7XHJcblx0XHJcblx0cmV0dXJuIHdvcmQgKyBcInNcIjtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIGNyZWF0ZTJkQXJyYXksXHJcbiAgY3JlYXRlM2RBcnJheSxcclxuICBzaHVmZmxlLFxyXG4gIHN3YXAsXHJcbiAgZmlyc3RFbXB0eUluZGV4LFxyXG4gIGxlcnAsXHJcbiAgY2xhbXAsXHJcbiAgcmFuZG9tSW50LFxyXG4gIGdldFhGcm9tSW5kZXgsXHJcbiAgZ2V0WUZyb21JbmRleCxcclxuICBnZXRJbmRleEZyb21YWSxcclxuICB0aW1lc3RhbXAsXHJcbiAgaW5kZWZpbml0ZUFydGljbGUsXHJcbiAgcGx1cmFsXHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImJjcnlwdFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJleHByZXNzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImZzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImh0dHBcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibW9uZ29vc2VcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibm9kZS1nYW1lbG9vcFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXRoXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInNvY2tldC5pb1wiKTsiXSwic291cmNlUm9vdCI6IiJ9
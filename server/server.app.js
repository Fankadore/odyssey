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

		this.health = this.healthMax;
		this.energy = this.energyMax;
		this.regenTimer = 0;
		this.isHit = false;
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
	get healthRegen() {
		let healthRegenTotal = this.healthRegenBase + this.healthRegenBonus
		return (healthRegenTotal < 1) ? 1 : healthRegenTotal;
	}
	get energyRegen() {
		let energyRegenTotal = this.energyRegenBase + this.energyRegenBonus;
		return (energyRegenTotal < 0) ? 0 : energyRegenTotal;
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
		this.healthRegenBase = template.healthRegenBase || 1;
		this.energyRegenBase = template.energyRegenBase || 1;
		this.rangeBase = template.rangeBase || 1;
	}

	calcItemBonus() {
		const itemBonus = {
			damage: 0,
			defence: 0,
			healthMax: 0,
			energyMax: 0,
			healthRegen: 0,
			energyRegen: 0,
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
			itemBonus.healthRegen += item.passive.healthRegen;
			itemBonus.energyRegen += item.passive.energyRegen;
			itemBonus.range += item.passive.range;

			if (item.slot >= _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].INVENTORY_SIZE) {
				itemBonus.damage += item.equipped.damage;
				itemBonus.defence += item.equipped.defence;
				itemBonus.healthMax += item.equipped.healthMax;
				itemBonus.energyMax += item.equipped.energyMax;
				itemBonus.healthRegen += item.equipped.healthRegen;
				itemBonus.energyRegen += item.equipped.energyRegen;
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
			healthRegen: 0,
			energyRegen: 0,
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
		this.healthRegenBonus = itemBonus.healthRegen + effectBonus.healthRegen;
		this.energyRegenBonus = itemBonus.energyRegen + effectBonus.energyRegen;
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
	setPosition(mapId, x, y) {
		this.mapId = mapId;
		this.x = x;
		this.startX = x;
		this.destinationX = x;
		this.y = y;
		this.startY = y;
		this.destinationY = y;
	}

	move(direction) {
		if (this.isMoving) return;

		if (direction) this.direction = direction;

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
	
	switchMap(direction) {
		if (!direction) return;
		this.direction = direction;

		const map = _game_js__WEBPACK_IMPORTED_MODULE_0__["default"].maps[this.mapId];
		let newMapId = null;
		let newX = null;
		let newY = null;

		if (direction === 'left') {
			newMapId = map.exitLeft;
			newX = _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].MAP_COLUMNS - 1;
			newY = this.y;
		}
		else if (direction === 'right') {
			newMapId = map.exitRight;
			newX = 0;
			newY = this.y;
		}
		else if (direction === 'up') {
			newMapId = map.exitUp;
			newX = this.x;
			newY = _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].MAP_ROWS - 1;
		}
		else if (direction === 'down') {
			newMapId = map.exitDown;
			newX = this.x;
			newY = 0;
		}

		if (newMapId) {
			this.setPosition(newMapId, newX, newY);
			_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].sendMapData(this.socket, newMapId);
		}
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
		
		this.isHit = true;
		this.health -= damage;

		if (this.health <= 0) {
			this.setDead();
			
			if (!attacker) {
				_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].sendGameInfoGlobal(this.name + " has died!");
				return;
			}

			attacker.kills++;
			if (attacker.target === this) attacker.target = null;
			if (this.playerId) {
				if (attacker.playerId) _game_js__WEBPACK_IMPORTED_MODULE_0__["default"].sendGameInfoGlobal(attacker.name + " has murdered " + this.name + " in cold blood!");
				else _game_js__WEBPACK_IMPORTED_MODULE_0__["default"].sendGameInfoGlobal(this.name + " has been killed by " + attacker.name + "!");
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
		if (slot < 0 || slot >= _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].INVENTORY_SIZE + _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].EQUIPMENT_SIZE) return;
		if (newSlot < 0 || newSlot >= _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].INVENTORY_SIZE + _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].EQUIPMENT_SIZE) return;

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

		// Regen
		this.regenTimer += delta;
		if (this.regenTimer >= 1) {
			this.regenTimer = 0;
			if (this.health < this.healthMax) {
				if (this.isHit) {
					this.isHit = false;
				}
				else {
					this.health += this.healthRegen;
					if (this.health > this.healthMax) this.health = this.healthMax;
				}
			}

			if (this.energy < this.energyMax) {
				if (!this.isRunning) {
					this.energy += this.energyRegen;
					if (this.energy > this.energyMax) this.energy = this.energyMax;
				}
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
					damageBase, defenceBase, healthMaxBase, energyMaxBase, healthRegenBase, energyRegenBase, rangeBase 
				} = data;
		
		if (_id == null) _id = _game_js__WEBPACK_IMPORTED_MODULE_0__["default"].requestDBId();
		if (name == null) name = template.name;
		if (sprite == null) sprite = template.sprite;
		if (hostile == null) hostile = template.hostile;
		if (damageBase == null) damageBase = template.damageBase;
		if (defenceBase == null) defenceBase = template.defenceBase;
		if (healthMaxBase == null) healthMaxBase = template.healthMaxBase;
		if (energyMaxBase == null) energyMaxBase = template.energyMaxBase;
		if (healthRegenBase == null) healthRegenBase = template.healthRegenBase;
		if (energyRegenBase == null) energyRegenBase = template.energyRegenBase;
		if (rangeBase == null) rangeBase = template.rangeBase;

		super(mapId, x, y, direction, name, sprite);
		this.botId = _id;
		this.templateId = template._id;
		this.damageBase = damageBase;
		this.defenceBase = defenceBase;
		this.healthMaxBase = healthMaxBase;
		this.energyMaxBase = energyMaxBase;
		this.healthRegenBase = healthRegenBase;
		this.energyRegenBase = energyRegenBase;
		this.rangeBase = rangeBase;
		this.calcBonusStats();
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
					passiveDamage, passiveDefence, passiveHealthMax, passiveEnergyMax, passiveHealthRegen, passiveEnergyRegen, passiveRange,
					equippedDamage, equippedDefence, equippedHealthMax, equippedEnergyMax, equippedHealthRegen, equippedEnergyRegen, equippedRange
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
		if (passiveHealthRegen === undefined) passiveHealthRegen = template.passiveHealthRegen;
		if (passiveEnergyRegen === undefined) passiveEnergyRegen = template.passiveEnergyRegen;
		if (passiveRange === undefined) passiveRange = template.passiveRange;
		if (equippedDamage === undefined) equippedDamage = template.equippedDamage;
		if (equippedDefence === undefined) equippedDefence = template.equippedDefence;
		if (equippedHealthMax === undefined) equippedHealthMax = template.equippedHealthMax;
		if (equippedEnergyMax === undefined) equippedEnergyMax = template.equippedEnergyMax;
		if (equippedHealthRegen === undefined) equippedHealthRegen = template.equippedHealthRegen;
		if (equippedEnergyRegen === undefined) equippedEnergyRegen = template.equippedEnergyRegen;
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
			healthRegen: passiveHealthRegen,
			energyRegen: passiveEnergyRegen,
			range: passiveRange
		};
		this.equipped = {
			damage: equippedDamage,
			defence: equippedDefence,
			healthMax: equippedHealthMax,
			energyMax: equippedEnergyMax,
			healthRegen: equippedHealthRegen,
			energyRegen: equippedEnergyRegen,
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
		if (!data.exitLeft) data.exitLeft = 0;
		if (!data.exitRight) data.exitRight = 0;
		if (!data.exitUp) data.exitUp = 0;
		if (!data.exitDown) data.exitDown = 0;

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
		this.exitLeft = data.exitLeft;
		this.exitRight = data.exitRight;
		this.exitUp = data.exitUp;
		this.exitDown = data.exitDown;
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
		if (data.exitLeft) this.warpY = data.exitLeft;
		if (data.exitRight) this.warpY = data.exitRight;
		if (data.exitUp) this.warpY = data.exitUp;
		if (data.exitDown) this.warpY = data.exitDown;
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
			warpY: this.warpY,
			exitLeft: this.exitLeft,
			exitRight: this.exitRight,
			exitUp: this.exitUp,
			exitDown: this.exitDown,
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
	constructor(socket, data) {
		if (data.sprite == null) data.sprite = data.template.sprite;

		super(data.mapId, data.x, data.y, data.direction, data.name, data.sprite);
		this.playerId = data._id;
		this.socket = socket;
		this.accountId = data.account;
		this.adminAccess = data.adminAccess;

		this.level = data.level;
		this.experience = data.experience;
		this.templateId = data.template._id;
		this.template = data.template.name;
		this.calcBaseStats(data.template);
		this.calcBonusStats();
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
				this.isRunning = false;
				if (this.input.direction) {
					// Check for Run Input
					if (this.input.run && this.energy > 0) this.isRunning = true;
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
			if (this.adminAccess > 0) _game_js__WEBPACK_IMPORTED_MODULE_0__["default"].godCommands[data.input](data, this);
			else _game_js__WEBPACK_IMPORTED_MODULE_0__["default"].sendGameInfoPlayer(this.gameId, "You don't have access to that command.");
		}
		else {
			if (_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].commands[data.input]) _game_js__WEBPACK_IMPORTED_MODULE_0__["default"].commands[data.input](data, this);
			else _game_js__WEBPACK_IMPORTED_MODULE_0__["default"].sendGameInfoPlayer(this.gameId, "Invalid command.");
		}
	}

	move(direction) {
		if (this.isMoving) return;

		if ((direction === 'left' && this.x === 0) || (direction === 'right' && this.x === _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].MAP_COLUMNS - 1) || (direction === 'up' && this.y === 0) || (direction === 'down' && this.y === _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].MAP_ROWS - 1)) {
			super.switchMap(direction);
		}
		else {
			super.move(direction);
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

	switchMap(mapId, direction) {
		if (direction === 'left') {
			if (this.x !== 0) return;

			const newMap = _game_js__WEBPACK_IMPORTED_MODULE_0__["default"].maps[mapId].exitLeft;
			if (newMap) {
				this.mapId = newMap;
				this.x = _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].MAP_COLUMNS - 1;
			}
		}
		else if (direction === 'right') {
			if (this.x !== _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].MAP_COLUMNS - 1) return;

			const newMap = _game_js__WEBPACK_IMPORTED_MODULE_0__["default"].maps[mapId].exitRight;
			if (newMap) {
				this.mapId = newMap;
				this.x = 0;
			}
		}
		else if (direction === 'up') {
			if (this.y !== 0) return;

			const newMap = _game_js__WEBPACK_IMPORTED_MODULE_0__["default"].maps[mapId].exitUp;
			if (newMap) {
				this.mapId = newMap;
				this.y = _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].MAP_COLUMNS - 1;
			}
		}
		else if (direction === 'down') {
			if (this.y !== _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].MAP_ROWS - 1) return;

			const newMap = _game_js__WEBPACK_IMPORTED_MODULE_0__["default"].maps[mapId].exitDown;
			if (newMap) {
				this.mapId = newMap;
				this.y = 0;
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
config.DB_URL = 'ds149706.mlab.com:49706/odyssey';
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

config.ITEM_TYPES = [
  {name: "Normal", equippedSlot: null, stackable: false},
  {name: "Stacking", equippedSlot: null, stackable: true},
  {name: "Weapon", equippedSlot: 0, stackable: false},
  {name: "Shield", equippedSlot: 1, stackable: false},
  {name: "Armour", equippedSlot: 2, stackable: false},
  {name: "Helmet", equippedSlot: 3, stackable: false},
  {name: "Ring", equippedSlot: 4, stackable: false}
];

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
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./keys.js */ "./server/src/keys.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./config.js */ "./server/src/config.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./util.js */ "./server/src/util.js");
/* harmony import */ var _models_account_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./models/account.js */ "./server/src/models/account.js");
/* harmony import */ var _models_player_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./models/player.js */ "./server/src/models/player.js");
/* harmony import */ var _models_playerTemplate_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./models/playerTemplate.js */ "./server/src/models/playerTemplate.js");
/* harmony import */ var _models_bot_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./models/bot.js */ "./server/src/models/bot.js");
/* harmony import */ var _models_botTemplate_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./models/botTemplate.js */ "./server/src/models/botTemplate.js");
/* harmony import */ var _models_item_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./models/item.js */ "./server/src/models/item.js");
/* harmony import */ var _models_itemTemplate_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./models/itemTemplate.js */ "./server/src/models/itemTemplate.js");
/* harmony import */ var _models_map_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./models/map.js */ "./server/src/models/map.js");
















const fsp = fs__WEBPACK_IMPORTED_MODULE_2___default.a.promises;
mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Promise = Promise;
mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.connect(process.env.MONGODB_URI || `mongodb://${_keys_js__WEBPACK_IMPORTED_MODULE_3__["default"].mongo.user}:${_keys_js__WEBPACK_IMPORTED_MODULE_3__["default"].mongo.pass}@${_config_js__WEBPACK_IMPORTED_MODULE_4__["default"].DB_URL}`, {useNewUrlParser: true});
//'mongodb://localhost/odyssey', {useNewUrlParser: true});

class Database {
	constructor() {
		this.serverLog = [];
	}

	backup(data = {}) {
		//TODO save everything
		// const maps = save-all-maps
		let players = this.saveOnlinePlayers(data.players);
		let bots = this.saveAllBots(data.bots);
		let items = this.saveAllItems(data.items);
		let logSaved = this.saveLog();
		Promise.all([players, bots, items, logSaved])
		.then(() => this.log("Game saved to disk."));
	}
	
	log(message) {
		const date = new Date();
		console.log(_util_js__WEBPACK_IMPORTED_MODULE_5__["default"].timestamp(date) + " - " + message);
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
	hashPassword(password) {
		return new Promise((resolve, reject) => {
			bcrypt__WEBPACK_IMPORTED_MODULE_1___default.a.hash(password, 10, (err, hash) => {
				if (err) reject(err);
				else resolve(hash);
			});
		});
	}
	comparePassword(password, hashedPassword) {
		return new Promise((resolve, reject) => {
			bcrypt__WEBPACK_IMPORTED_MODULE_1___default.a.compare(password, hashedPassword, (err, match) => {
				if (err) reject(err);
				else resolve(match);
			});
		});
	}
	async authAccount(username, password) {
		let account = await _models_account_js__WEBPACK_IMPORTED_MODULE_6__["default"].findOne({usernameLowerCase: username.toLowerCase()}).exec();
		if (!account) return false;
		let match = await this.comparePassword(password, account.password);
		return match;
	}

	async addAccount(username, password, email) {
		let admin = false;
		let accounts = await this.getAllAccounts();
		if (accounts.length === 0) {
			admin = true;
		}
		else {
			let existingAccount = accounts.find(account => account.username.toLowerCase() === username.toLowerCase());
			if (existingAccount) {
				console.log(`Account already exists with username ${username}.`);
				return false;
			}
		}

		let hashedPassword = await this.hashPassword(password);
		const account = new _models_account_js__WEBPACK_IMPORTED_MODULE_6__["default"]({
			_id: new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Types.ObjectId,
			username,
			usernameLowerCase: username.toLowerCase(),
			password: hashedPassword,
			email,
			verified: false,
			admin
		});

		return await account.save()
		.then(result => account._id)
		.catch(err => console.log(err));
	}
	getAccount(accountId) {
		return _models_account_js__WEBPACK_IMPORTED_MODULE_6__["default"].findById(accountId)
		.select('_id username password email verified admin')
		.exec()
		.then(account => account)
		.catch(err => console.log(err));
	}
	getAccountByUsername(username) {
		return _models_account_js__WEBPACK_IMPORTED_MODULE_6__["default"].findOne({usernameLowerCase: username.toLowerCase()})
		.select('_id username password email verified admin')
		.exec()
		.then(account => account)
		.catch(err => console.log(err));
	}
	getAllAccounts() {
		return _models_account_js__WEBPACK_IMPORTED_MODULE_6__["default"].find({})
		.select('_id username password email verified admin')
		.exec()
		.then(accounts => accounts)
		.catch(err => console.log(err));
	}
	saveAccount(data) {
		return _models_account_js__WEBPACK_IMPORTED_MODULE_6__["default"].updateOne({username: data.username}, {$set: data})
		.exec()
		.then(result => true)
		.catch(err => console.log(err));
	}

	async addPlayer(accountId, name, templateId) {
		let account = await this.getAccount(accountId);
		if (!account) {
			console.log("Account does not exist with that id.");
			return null;
		}
		let template = await this.getPlayerTemplate(templateId);
		if (!template) {
			console.log("Player Template does not exist with that id.");
			return null;
		}
		let player = await this.getPlayerByName(name);
		if (player) {
			console.log("Player already exists with that name.");
			return null;
		}

		player = new _models_player_js__WEBPACK_IMPORTED_MODULE_7__["default"]({
			_id : new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Types.ObjectId,
			name,
			nameLowerCase: name.toLowerCase(),
			account: accountId,
			template: templateId
		});

		return player.save()
		.then(result => player._id)
		.catch(err => console.log(err));
	}
	getPlayer(playerId) {
		return _models_player_js__WEBPACK_IMPORTED_MODULE_7__["default"].findById(playerId)
		.select('_id account name template level experience mapId x y direction adminAccess sprite')
		.populate('template')
		.exec()
		.then(player => player)
		.catch(err => console.log(err));
	}
	getPlayerByName(name) {
		return _models_player_js__WEBPACK_IMPORTED_MODULE_7__["default"].findOne({nameLowerCase: name.toLowerCase()})
		.select('_id account name template level experience mapId x y direction adminAccess sprite')
		.populate('template')
		.exec()
		.then(player => player)
		.catch(err => console.log(err));
	}
	getPlayersByAccount(accountId) {
		return _models_player_js__WEBPACK_IMPORTED_MODULE_7__["default"].find({account: accountId})
		.select('_id account name template level experience mapId x y direction adminAccess sprite')
		.populate('template')
		.exec()
		.then(players => players)
		.catch(err => console.log(err));
	}
	savePlayer(data) {
		return _models_player_js__WEBPACK_IMPORTED_MODULE_7__["default"].updateOne({name: data.name}, {$set: data})
		.exec()
		.then(result => true)
		.catch(err => console.log(err));
	}
	saveOnlinePlayers(players = []) {
		return new Promise((resolve, reject) => {
			for (let i = 0; i < players.length; i++) {
				const player = players[i];
				if (!player) continue;
				this.savePlayer(player);
			}
			resolve(true);
		});
	}

	async addBot(data) {
		let template = await this.getBotTemplate(data.templateId);
		if (!template) {
			console.log("Bot Template does not exist with that id.");
			return false;
		}

		let _id = data.botId;
		if (!_id) _id = new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Types.ObjectId;

		const bot = new _models_bot_js__WEBPACK_IMPORTED_MODULE_9__["default"]({
			_id,
			template: data.templateId,
			mapId: data.mapId,
			x: data.x,
			y: data.y,
			direction: data.direction
		});

		return bot.save()
		.then(result => true)
		.catch(err => console.log(err));
	}
	getBot(botId) {
		return _models_bot_js__WEBPACK_IMPORTED_MODULE_9__["default"].findOne({_id: botId})
		.select('_id template mapId x y direction')
		.populate('template')
		.exec()
		.then(bot => bot)
		.catch(err => console.log(err));
	}
	saveBot(data) {
		return _models_bot_js__WEBPACK_IMPORTED_MODULE_9__["default"].updateOne({_id: data.botId}, {$set: data})
		.exec()
		.then(result => true)
		.catch(err => console.log(err));
	}
	getAllBots() {
		return _models_bot_js__WEBPACK_IMPORTED_MODULE_9__["default"].find({})
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
			_models_bot_js__WEBPACK_IMPORTED_MODULE_9__["default"].deleteOne({_id: deleteBots[i]._id}, err => {
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

	getMap(mapId) {
		return _models_map_js__WEBPACK_IMPORTED_MODULE_13__["default"].findOne({mapId: mapId})
		.select('mapId name dropChance dropAmountEQ tiles isWall isHostile damage warpMap warpX warpY exitLeft exitRight exitUp exitDown')
		.exec()
		.then(map => map)
		.catch(err => console.log(err));
	}
	saveMap(data) {
		return _models_map_js__WEBPACK_IMPORTED_MODULE_13__["default"].updateOne({mapId: data.mapId}, {$set: data}, {new: true, upsert: true, setDefaultsOnInsert: true})
		.exec()
		.then(result => true)
		.catch(err => console.log(err));
	}
	getAllMaps() {
		return _models_map_js__WEBPACK_IMPORTED_MODULE_13__["default"].find({})
		.select('mapId name dropChance dropAmountEQ tiles isWall isHostile damage warpMap warpX warpY exitLeft exitRight exitUp exitDown')
		.exec()
		.then(maps => maps)
		.catch(err => console.log(err));
	}

	async addPlayerTemplate(data) {
		if (!data.name) {
			console.log("Name is required.");
			return false;
		}

		let checkTemplate = await _models_playerTemplate_js__WEBPACK_IMPORTED_MODULE_8__["default"].findOne({name: data.name})
		.exec()
		.then(template => template)
		.catch(err => console.log(err));

		if (checkTemplate) {
			console.log("Template already exists with that name.");
			return false;
		}

		const template = new _models_playerTemplate_js__WEBPACK_IMPORTED_MODULE_8__["default"]({
			_id: new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Types.ObjectId,
			name: data.name,
			sprite: data.sprite,
			damageBase: data.damageBase,
			defenceBase: data.defenceBase,
			healthMaxBase: data.healthMaxBase,
			energyMaxBase: data.energyMaxBase,
			healthRegenBase: data.healthRegenBase,
			energyRegenBase: data.energyRegenBase,
			rangeBase: data.rangeBase,
			healthPerLevel: data.healthPerLevel,
			energyPerLevel: data.energyPerLevel
		});

		return template.save()
		.then(result => true)
		.catch(err => console.log(err));
	}
	getPlayerTemplate(templateId) {
		return _models_playerTemplate_js__WEBPACK_IMPORTED_MODULE_8__["default"].findById(templateId)
		.select('name sprite damageBase defenceBase healthMaxBase energyMaxBase healthRegenBase energyRegenBase rangeBase healthPerLevel, energyPerLevel')
		.exec()
		.then(template => template)
		.catch(err => console.log(err));
	}
	getAllPlayerTemplates() {
		return _models_playerTemplate_js__WEBPACK_IMPORTED_MODULE_8__["default"].find({})
		.select('_id name sprite damageBase defenceBase healthMaxBase energyMaxBase healthRegenBase energyRegenBase rangeBase healthPerLevel, energyPerLevel')
		.exec()
		.then(templates => templates)
		.catch(err => console.log(err));
	}

	addBotTemplate(data) {
		const template = new _models_botTemplate_js__WEBPACK_IMPORTED_MODULE_10__["default"]({
			_id: new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Types.ObjectId,
			name: data.name,
			sprite: data.sprite,
			damageBase: data.damageBase,
			defenceBase: data.defenceBase,
			healthMaxBase: data.healthMaxBase,
			energyMaxBase: data.energyMaxBase,
			healthRegenBase: data.healthRegenBase,
			energyRegenBase: data.energyRegenBase,
			rangeBase: data.rangeBase,
			hostile: data.hostile
		});

		return template.save()
		.then(result => true)
		.catch(err => console.log(err));
	}
	getBotTemplate(templateId) {
		return _models_botTemplate_js__WEBPACK_IMPORTED_MODULE_10__["default"].findById(templateId)
		.select('_id name sprite damageBase defenceBase healthMaxBase energyMaxBase healthRegenBase energyRegenBase rangeBase hostile')
		.exec()
		.then(template => template)
		.catch(err => console.log(err));
	}
	getAllBotTemplates() {
		return _models_botTemplate_js__WEBPACK_IMPORTED_MODULE_10__["default"].find({})
		.select('_id name sprite damageBase defenceBase healthMaxBase energyMaxBase healthRegenBase energyRegenBase rangeBase hostile')
		.exec()
		.then(templates => templates)
		.catch(err => console.log(err));
	}

	addItemTemplate(data) {
		const template = new _models_itemTemplate_js__WEBPACK_IMPORTED_MODULE_12__["default"]({
			_id: new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Types.ObjectId,
			name: data.name,
			sprite: data.sprite,
			reusable: data.reusable,
			itemType: data.itemTypeId,
			passiveDamage: data.passiveDamage,
			passiveDefence: data.passiveDefence,
			passiveHealthMax: data.passiveHealthMax,
			passiveEnergyMax: data.passiveEnergyMax,
			passiveHealthRegen: data.passiveHealthRegen,
			passiveEnergyRegen: data.passiveEnergyRegen,
			passiveRange: data.passiveRange,
			equippedDamage: data.equippedDamage,
			equippedDefence: data.equippedDefence,
			equippedHealthMax: data.equippedHealthMax,
			equippedEnergyMax: data.equippedEnergyMax,
			equippedHealthRegen: data.equippedHealthRegen,
			equippedEnergyRegen: data.equippedEnergyRegen,
			equippedRange: data.equippedRange
		});

		return template.save()
		.then(result => true)
		.catch(err => console.log(err));
	}
	getItemTemplate(templateId) {
		return _models_itemTemplate_js__WEBPACK_IMPORTED_MODULE_12__["default"].findById(templateId)
		.select('name sprite reusable itemType passiveDamage passiveDefence passiveHealthMax passiveEnergyMaxBase passiveHealthRegen passiveEnergyRegen passiveRange equippedDamage equippedDefence equippedHealthMax equippedEnergyMaxBase equippedHealthRegen equippedEnergyRegen equippedRange')
		.exec()
		.then(template => template)
		.catch(err => console.log(err));
	}
	getAllItemTemplates() {
		return _models_itemTemplate_js__WEBPACK_IMPORTED_MODULE_12__["default"].find({})
		.select('_id name sprite reusable itemType passiveDamage passiveDefence passiveHealthMax passiveEnergyMaxBase passiveHealthRegen passiveEnergyRegen passiveRange equippedDamage equippedDefence equippedHealthMax equippedEnergyMaxBase equippedHealthRegen equippedEnergyRegen equippedRange')
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

		const item = new _models_item_js__WEBPACK_IMPORTED_MODULE_11__["default"]({
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

		return item.save()
		.then(result => true)
		.catch(err => console.log(err));
	}
	saveItem(data) {
		return _models_item_js__WEBPACK_IMPORTED_MODULE_11__["default"].updateOne({_id: data.itemId}, {$set: data}, {upsert: true})
		.exec()
		.then(result => true)
		.catch(err => console.log(err));
	}
	getAllItems() {
		return _models_item_js__WEBPACK_IMPORTED_MODULE_11__["default"].find({})
		.select('_id template stack playerId botId slot mapId x y createdDate createdBy')
		.populate('template')
		.exec()
		.then(items => items)
		.catch(err => console.log(err));
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
			_models_item_js__WEBPACK_IMPORTED_MODULE_11__["default"].deleteOne({_id: deleteItems[i]._id}, err => {
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
/* harmony import */ var _server_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./server.js */ "./server/src/server.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./config.js */ "./server/src/config.js");
/* harmony import */ var _classes_map_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./classes/map.js */ "./server/src/classes/map.js");
/* harmony import */ var _classes_player_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./classes/player.js */ "./server/src/classes/player.js");
/* harmony import */ var _classes_bot_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./classes/bot.js */ "./server/src/classes/bot.js");
/* harmony import */ var _classes_item_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./classes/item.js */ "./server/src/classes/item.js");
/* harmony import */ var _classes_effect_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./classes/effect.js */ "./server/src/classes/effect.js");
/* harmony import */ var _classes_text_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./classes/text.js */ "./server/src/classes/text.js");
/* harmony import */ var _classes_message_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./classes/message.js */ "./server/src/classes/message.js");












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

	async loadMaps() {
		let mapData = await _db_js__WEBPACK_IMPORTED_MODULE_0__["default"].getAllMaps();
		const orderedMapData = [];

		for (let id = 0; id < mapData.length; id++) {
			const data = mapData[id];
			if (data) orderedMapData[data.mapId] = data;
		}

		for (let id = 0; id < _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].MAX_MAPS; id++) {
			if (orderedMapData[id]) {
				this.maps[id] = new _classes_map_js__WEBPACK_IMPORTED_MODULE_3__["default"](id, orderedMapData[id]);
			}
			else {
				this.maps[id + 1] = new _classes_map_js__WEBPACK_IMPORTED_MODULE_3__["default"](id);
				_db_js__WEBPACK_IMPORTED_MODULE_0__["default"].saveMap({mapId: id});
			}
		}
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
				template.type = _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].ITEM_TYPES[template.itemType];
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
				if (data) this.spawnMapItem(1, 5, 5, "5d25c5200b126c011c6af28d");
			},
			macro2: (data) => {
				if (data) this.spawnBot(1, 5, 5, "5d25c3aa76cb6f1fbc10e7bf");
			},
			macro3: (data, player) => {
				if (data) {
					if (player.sprite >= _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].MAX_SPRITES) player.sprite = 1;
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
			const item = itemData[i];
			if (!item) continue;
			item.template.type = _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].ITEM_TYPES[item.template.itemType]
			new _classes_item_js__WEBPACK_IMPORTED_MODULE_6__["default"](item);
		}
	}
	async loadBots() {
		let botData = await _db_js__WEBPACK_IMPORTED_MODULE_0__["default"].getAllBots();
		for (let i = 0; i < botData.length; i++) {
			new _classes_bot_js__WEBPACK_IMPORTED_MODULE_5__["default"](botData[i]);
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
	playerLogin(socket, data) {
		for (let player of this.players) {
			if (player && player.name === data.name) {
				console.log("Player is already signed in.");
				return null;
			}
		}

		const player = new _classes_player_js__WEBPACK_IMPORTED_MODULE_4__["default"](socket, data);
		_db_js__WEBPACK_IMPORTED_MODULE_0__["default"].log(`${socket.id} - ${player.name} has logged in.`);
		this.sendGameInfoGlobal(`${player.name} has logged in.`);
		return player;
	}
	playerLogout(playerId) {
		let player = this.players[playerId];
		if (player) {
			const playerData = player.getDBPack()
			_db_js__WEBPACK_IMPORTED_MODULE_0__["default"].log(`${player.socket.id} - ${player.name} has logged out.`);
			this.sendGameInfoGlobal(`${player.name} has logged out.`);
			delete this.texts[player.displayNameId];
			delete this.players[playerId];
			_db_js__WEBPACK_IMPORTED_MODULE_0__["default"].savePlayer(playerData);
		}
	}
	getExpToLevel(level) {
		let exp = 10;
		for (let i = 1; i < _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].MAX_LEVEL; i++) {
			if (i === level) return exp;
			exp = (exp + (exp % 2)) * 1.5;
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
	sendMapData(socket, mapId) {
		_server_js__WEBPACK_IMPORTED_MODULE_1__["default"].sendMapData(socket, mapId);
	}

	isVacant(mapId, x, y) {
		// Check for Map Edges
		if (x < 0 || x >= _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].MAP_COLUMNS || y < 0 || y >= _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].MAP_ROWS) return false;
		
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
			new _classes_bot_js__WEBPACK_IMPORTED_MODULE_5__["default"]({mapId, x, y, direction, template});
		}
		else {
			console.log("Bot Template does not exist with that Id");
		}
	}
	
	spawnMapItem(mapId, x, y, templateId, stack = 0) {
		let template = this.itemTemplates[templateId];
		if (template) {
			new _classes_item_js__WEBPACK_IMPORTED_MODULE_6__["default"]({mapId, x, y, template, stack});
		}
		else {
			console.log("Item Template does not exist with that Id");
		}
	}

	spawnDamageText(mapId, x, y, damage) {
		new _classes_text_js__WEBPACK_IMPORTED_MODULE_8__["default"](mapId, x, y + 0.5, damage, '#ff0000', 1.25, 0, -1);
	}

	spawnEffect(mapId, x, y, sprite, loop, speed, maxFrame, startFrame) {
		new _classes_effect_js__WEBPACK_IMPORTED_MODULE_7__["default"](mapId, x, y, sprite, loop, speed, maxFrame, startFrame);
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

/***/ "./server/src/keys.js":
/*!****************************!*\
  !*** ./server/src/keys.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const keys = {
	mongo: {
		user: "Fankadore",
		pass: "odyssey1",
	},
};

/* harmony default export */ __webpack_exports__["default"] = (keys);

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
  usernameLowerCase: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  email: {type: String, match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/},
  verified: {type: Boolean, default: false},
  admin: {type: Boolean, default: false}
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
  healthRegenBase: {type: Number, default: 1},
  energyRegenBase: {type: Number, default: 1},
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
	itemType: {type: Number, required: true},
	passiveDamage: {type: Number, default: 0},
	passiveDefence: {type: Number, default: 0},
	passiveHealthMax: {type: Number, default: 0},
	passiveEnergyMax: {type: Number, default: 0},
	passiveHealthRegen: {type: Number, default: 0},
	passiveEnergyRegen: {type: Number, default: 0},
	passiveRange: {type: Number, default: 0},
	equippedDamage: {type: Number, default: 0},
	equippedDefence: {type: Number, default: 0},
	equippedHealthMax: {type: Number, default: 0},
	equippedEnergyMax: {type: Number, default: 0},
	equippedHealthRegen: {type: Number, default: 0},
	equippedEnergyRegen: {type: Number, default: 0},
	equippedRange: {type: Number, default: 0}
});

/* harmony default export */ __webpack_exports__["default"] = (mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.model('ItemTemplate', itemTemplateSchema));


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


const defaultTiles = new Array(6).fill(new Array(12).fill(new Array(12).fill(0)));
const falseLayer = new Array(12).fill(new Array(12).fill(false));
const nullLayer = new Array(12).fill(new Array(12).fill(null));

const mapSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema({
	_id: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.SchemaTypes.ObjectId,
	mapId: {type: Number, required: true},
	name: {type: String, required: true},
	dropChance: {type: Number, default: 100},
	dropAmountEQ: {type: Number, default: 1},
	tiles: {type: [[[Number]]], default: defaultTiles},
	isWall: {type: [[Boolean]], default: falseLayer},
	isHostile: {type: [[Boolean]], default: falseLayer},
	damage: {type: [[Number]], default: nullLayer},
	warpMap: {type: [[Number]], default: nullLayer},
	warpX: {type: [[Number]], default: nullLayer},
	warpY: {type: [[Number]], default: nullLayer},
	exitLeft: {type: Number, default: 0},
	exitRight: {type: Number, default: 0},
	exitUp: {type: Number, default: 0},
	exitDown: {type: Number, default: 0},
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
  nameLowerCase: {type: String, required: true, unique: true},
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
  healthRegenBase: {type: Number, default: 1},
  energyRegenBase: {type: Number, default: 1},
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

		io.sockets.on('connect', socket => this.onConnect(socket));
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
		socket.on('signup', (data) => this.onSignUp(socket, data.username, data.password, data.email));
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

	async onSignUp(socket, username, password, email) {
		let accountId = await _db_js__WEBPACK_IMPORTED_MODULE_4__["default"].addAccount(username, password, email);
		if (accountId) {
			_db_js__WEBPACK_IMPORTED_MODULE_4__["default"].log(`${socket.id} - Account added: ${username}`);
			socket.emit('signedUp', {username, password});
		}
		else {
			socket.emit('signedUp', null);
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

		socket.on('addPlayer', (data) => this.onAddPlayer(socket, data.name, data.templateId));
		socket.on('login', (name) => this.onLogIn(socket, name));
		socket.on('logout', () => this.onLogOut(socket));
		socket.on('addPlayerTemplate', (data) => this.onAddPlayerTemplate(data));

		_db_js__WEBPACK_IMPORTED_MODULE_4__["default"].log(`${socket.id} - ${username} signed in.`);
		let players = await _db_js__WEBPACK_IMPORTED_MODULE_4__["default"].getPlayersByAccount(account._id);
		let playerTemplates = await _db_js__WEBPACK_IMPORTED_MODULE_4__["default"].getAllPlayerTemplates();
		socket.emit('signedIn', {account, players, playerTemplates});
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
		let playerId = await _db_js__WEBPACK_IMPORTED_MODULE_4__["default"].addPlayer(socket.accountId, name, templateId);
		if (playerId) {
			const username = this.activeAccounts[socket.accountId];
			_db_js__WEBPACK_IMPORTED_MODULE_4__["default"].log(`${socket.id} - ${name} has been added as a player to account ${username}.`);
			socket.emit('playerAdded', playerId);
		}
		else {
			socket.emit('playerAdded', null);
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

	async onLogIn(socket, playerId) {
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

		let playerData = await _db_js__WEBPACK_IMPORTED_MODULE_4__["default"].getPlayer(playerId);
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

		const player = _game_js__WEBPACK_IMPORTED_MODULE_5__["default"].playerLogin(socket, playerData);
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
			socket.emit('loggedOut');
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
				this.sendMapData(player.socket, player.mapId);
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
				if (playerData && ((playerData.mapId === player.mapId && playerData.isVisible) || playerData.socketId === player.socket.id)) {
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
			
			player.socket.emit('update', pack);
		});
	}
	
	sendMapData(socket, mapId) {
		const mapData = _game_js__WEBPACK_IMPORTED_MODULE_5__["default"].maps[mapId].getPack();
		socket.emit('loadMap', mapData);
	}

	addDefaultTemplates() {
				// db.addPlayerTemplate({
		// 	name: "Knight",
		// 	sprite: "1",
		// 	damageBase: 10,
		// 	defenceBase: 0,
		// 	healthMaxBase: 20,
		// 	energyMaxBase: 40,
		// 	healthRegenBase: 1,
		// 	energyRegenBase: 1,
		// 	rangeBase: 1,
		// 	healthPerLevel: 1,
		// 	energyPerLevel: 1,
		// });

		// db.addBotTemplate({
		// 	name: "Rat",
		// 	sprite: "3",
		// 	damageBase: 10,
		// 	defenceBase: 0,
		// 	healthMaxBase: 20,
		// 	energyMaxBase: 40,
		// 	healthRegenBase: 1,
		// 	energyRegenBase: 1,
		// 	rangeBase: 1,
		// 	hostile: false,
		// });
		
		// db.addItemTemplate({
		// 	name: "Sword",
		// 	itemTypeId: 2,
		// 	sprite: 1,
		// 	reusable: true,
		// 	passiveDamage: 0,
		// 	passiveDefence: 0,
		// 	passiveHealthMax: 0,
		// 	passiveEnergyMax: 0,
		// 	passiveHealthRegen: 0,
		// 	passiveEnergyRegen: 0,
		// 	passiveRange: 0,
		// 	equippedDamage: 1,
		// 	equippedDefence: 0,
		// 	equippedHealthMax: 0,
		// 	equippedEnergyMax: 0,
		// 	equippedHealthRegen: 0,
		// 	equippedEnergyRegen: 0,
		// 	equippedRange: 0,
		// });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL2FjdG9yLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy9ib3QuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL2VmZmVjdC5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2NsYXNzZXMvZW50aXR5LmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy9pdGVtLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy9tYXAuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL21lc3NhZ2UuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL3BsYXllci5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2NsYXNzZXMvdGV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2NvbmZpZy5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2RiLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvZ2FtZS5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2dhbWVsb29wLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMva2V5cy5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9tb2RlbHMvYWNjb3VudC5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL21vZGVscy9ib3QuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9tb2RlbHMvYm90VGVtcGxhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9tb2RlbHMvaXRlbS5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL21vZGVscy9pdGVtVGVtcGxhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9tb2RlbHMvbWFwLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvbW9kZWxzL3BsYXllci5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL21vZGVscy9wbGF5ZXJUZW1wbGF0ZS5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL3NlcnZlci5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL3V0aWwuanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiYmNyeXB0XCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZXhwcmVzc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImZzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiaHR0cFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcIm1vbmdvb3NlXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibm9kZS1nYW1lbG9vcFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInBhdGhcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJzb2NrZXQuaW9cIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsaUJBQWlCLHNCQUFzQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLG1CQUFtQjtBQUNuQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsK0RBQStEOztBQUUvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0Esc0JBQXNCO0FBQ3RCLEdBQUc7O0FBRUg7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEU7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJOztBQUVKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7O0FBRUo7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILGlCQUFpQixxQkFBcUI7QUFDdEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxvQkFBb0IsMEVBQThCO0FBQ2xEO0FBQ0Esa0JBQWtCLHNCQUFzQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsdUZBQTJDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0VBQWtFO0FBQ2xFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaHRCQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxzQkFBc0I7QUFDdEI7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQiwwRUFBOEI7QUFDbEQ7QUFDQTs7QUFFQSxpQkFBaUIsc0JBQXNCO0FBQ3ZDO0FBQ0EscUJBQXFCLDBFQUE4QjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbk9BO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDM0RBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNiQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLE9BQU87QUFDUDtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDL0xBO0FBQ0E7O0FBRUE7QUFDQSw2QkFBNkI7QUFDN0I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ3BGQTtBQUNBO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1RBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtSEFBdUUsV0FBVztBQUNsRjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDN1BBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDcEVBO0FBQUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLEdBQUcscURBQXFEO0FBQ3hELEdBQUcsc0RBQXNEO0FBQ3pELEdBQUcs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Ozs7QUNBQSxvQzs7Ozs7Ozs7Ozs7QUNBQSwrQjs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSxxQzs7Ozs7Ozs7Ozs7QUNBQSwwQzs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSxzQyIsImZpbGUiOiJzZXJ2ZXIuYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zZXJ2ZXIvc3JjL21haW4uanNcIik7XG4iLCJpbXBvcnQgZ2FtZSBmcm9tICcuLi9nYW1lLmpzJztcclxuaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9jb25maWcuanMnO1xyXG5pbXBvcnQgdXRpbCBmcm9tICcuLi91dGlsLmpzJztcclxuaW1wb3J0IEVudGl0eSBmcm9tICcuL2VudGl0eS5qcyc7XHJcblxyXG4vLyBBbiBBY3RvciBpcyBhbiBFbnRpdHkgd2hpY2ggY2FuIG1vdmUsIGF0dGFjayBhbmQgaW50ZXJhY3Qgd2l0aCBpdGVtc1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWN0b3IgZXh0ZW5kcyBFbnRpdHkge1xyXG5cdGNvbnN0cnVjdG9yKG1hcElkLCB4LCB5LCBkaXJlY3Rpb24sIG5hbWUsIHNwcml0ZSkge1xyXG5cdFx0c3ByaXRlID0gdXRpbC5jbGFtcChzcHJpdGUsIDEsIGNvbmZpZy5NQVhfU1BSSVRFUyk7XHJcblxyXG5cdFx0c3VwZXIobWFwSWQsIHgsIHksIHNwcml0ZSk7XHJcblx0XHR0aGlzLm5hbWUgPSBuYW1lO1xyXG5cdFx0dGhpcy5kZXNjcmlwdGlvbiA9IFwiXCI7XHJcblxyXG5cdFx0dGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XHJcblx0XHR0aGlzLnN0YXJ0WCA9IHRoaXMueDtcclxuXHRcdHRoaXMuc3RhcnRZID0gdGhpcy55O1xyXG5cdFx0dGhpcy5kZXN0aW5hdGlvblggPSB0aGlzLng7XHJcblx0XHR0aGlzLmRlc3RpbmF0aW9uWSA9IHRoaXMueTtcclxuXHRcdHRoaXMubGVycCA9IDA7XHJcblxyXG5cdFx0dGhpcy5pc01vdmluZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy5pc1J1bm5pbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMubW92ZVNwZWVkID0gMi41O1xyXG5cdFx0dGhpcy5tb3ZlbWVudFRpbWVyID0gMDtcclxuXHRcdHRoaXMubGF6aW5lc3MgPSAwO1xyXG5cclxuXHRcdHRoaXMuaXNBdHRhY2tpbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMuYXR0YWNrU3BlZWQgPSAxO1xyXG5cdFx0dGhpcy5hdHRhY2tUaW1lciA9IDA7XHRcclxuXHRcdHRoaXMudGFyZ2V0ID0gbnVsbDtcclxuXHRcdHRoaXMua2lsbHMgPSAwO1xyXG5cclxuXHRcdHRoaXMuaGVhbHRoID0gdGhpcy5oZWFsdGhNYXg7XHJcblx0XHR0aGlzLmVuZXJneSA9IHRoaXMuZW5lcmd5TWF4O1xyXG5cdFx0dGhpcy5yZWdlblRpbWVyID0gMDtcclxuXHRcdHRoaXMuaXNIaXQgPSBmYWxzZTtcclxuXHR9XHJcblx0XHJcblx0Ly8gQ2hhcmFjdGVyIFN0YXRzXHJcblx0Z2V0IGRhbWFnZSgpIHtcclxuXHRcdGxldCBkYW1hZ2VUb3RhbCA9IHRoaXMuZGFtYWdlQmFzZSArIHRoaXMuZGFtYWdlQm9udXM7XHJcblx0XHRyZXR1cm4gKGRhbWFnZVRvdGFsIDwgMCkgPyAwIDogZGFtYWdlVG90YWw7XHJcblx0fVxyXG5cdGdldCBkZWZlbmNlKCkge1xyXG5cdFx0bGV0IGRlZmVuY2VUb3RhbCA9IHRoaXMuZGVmZW5jZUJhc2UgKyB0aGlzLmRlZmVuY2VCb251cztcclxuXHRcdHJldHVybiAoZGVmZW5jZVRvdGFsIDwgMCkgPyAwIDogZGVmZW5jZVRvdGFsO1xyXG5cdH1cclxuXHRnZXQgaGVhbHRoTWF4KCkge1xyXG5cdFx0bGV0IGhlYWx0aE1heFRvdGFsID0gdGhpcy5oZWFsdGhNYXhCYXNlICsgdGhpcy5oZWFsdGhNYXhCb251c1xyXG5cdFx0cmV0dXJuIChoZWFsdGhNYXhUb3RhbCA8IDEpID8gMSA6IGhlYWx0aE1heFRvdGFsO1xyXG5cdH1cclxuXHRnZXQgZW5lcmd5TWF4KCkge1xyXG5cdFx0bGV0IGVuZXJneU1heFRvdGFsID0gdGhpcy5lbmVyZ3lNYXhCYXNlICsgdGhpcy5lbmVyZ3lNYXhCb251cztcclxuXHRcdHJldHVybiAoZW5lcmd5TWF4VG90YWwgPCAwKSA/IDAgOiBlbmVyZ3lNYXhUb3RhbDtcclxuXHR9XHJcblx0Z2V0IGhlYWx0aFJlZ2VuKCkge1xyXG5cdFx0bGV0IGhlYWx0aFJlZ2VuVG90YWwgPSB0aGlzLmhlYWx0aFJlZ2VuQmFzZSArIHRoaXMuaGVhbHRoUmVnZW5Cb251c1xyXG5cdFx0cmV0dXJuIChoZWFsdGhSZWdlblRvdGFsIDwgMSkgPyAxIDogaGVhbHRoUmVnZW5Ub3RhbDtcclxuXHR9XHJcblx0Z2V0IGVuZXJneVJlZ2VuKCkge1xyXG5cdFx0bGV0IGVuZXJneVJlZ2VuVG90YWwgPSB0aGlzLmVuZXJneVJlZ2VuQmFzZSArIHRoaXMuZW5lcmd5UmVnZW5Cb251cztcclxuXHRcdHJldHVybiAoZW5lcmd5UmVnZW5Ub3RhbCA8IDApID8gMCA6IGVuZXJneVJlZ2VuVG90YWw7XHJcblx0fVxyXG5cdGdldCByYW5nZSgpIHtcclxuXHRcdGxldCByYW5nZVRvdGFsID0gdGhpcy5yYW5nZUJhc2UgKyB0aGlzLnJhbmdlQm9udXM7XHJcblx0XHRyZXR1cm4gKHJhbmdlVG90YWwgPCAxKSA/IDEgOiByYW5nZVRvdGFsO1xyXG5cdH1cclxuXHJcblx0Y2FsY0Jhc2VTdGF0cyh0ZW1wbGF0ZSkge1xyXG5cdFx0dGhpcy5kYW1hZ2VCYXNlID0gdGVtcGxhdGUuZGFtYWdlQmFzZSB8fCAxO1xyXG5cdFx0dGhpcy5kZWZlbmNlQmFzZSA9IHRlbXBsYXRlLmRlZmVuY2VCYXNlIHx8IDA7XHJcblx0XHR0aGlzLmhlYWx0aE1heEJhc2UgPSB0ZW1wbGF0ZS5oZWFsdGhNYXhCYXNlICsgKHRlbXBsYXRlLmhlYWx0aFBlckxldmVsICogKHRoaXMubGV2ZWwgLSAxKSkgfHwgMTtcclxuXHRcdHRoaXMuZW5lcmd5TWF4QmFzZSA9IHRlbXBsYXRlLmVuZXJneU1heEJhc2UgKyAodGVtcGxhdGUuZW5lcmd5UGVyTGV2ZWwgKiAodGhpcy5sZXZlbCAtIDEpKSB8fCAxO1xyXG5cdFx0dGhpcy5oZWFsdGhSZWdlbkJhc2UgPSB0ZW1wbGF0ZS5oZWFsdGhSZWdlbkJhc2UgfHwgMTtcclxuXHRcdHRoaXMuZW5lcmd5UmVnZW5CYXNlID0gdGVtcGxhdGUuZW5lcmd5UmVnZW5CYXNlIHx8IDE7XHJcblx0XHR0aGlzLnJhbmdlQmFzZSA9IHRlbXBsYXRlLnJhbmdlQmFzZSB8fCAxO1xyXG5cdH1cclxuXHJcblx0Y2FsY0l0ZW1Cb251cygpIHtcclxuXHRcdGNvbnN0IGl0ZW1Cb251cyA9IHtcclxuXHRcdFx0ZGFtYWdlOiAwLFxyXG5cdFx0XHRkZWZlbmNlOiAwLFxyXG5cdFx0XHRoZWFsdGhNYXg6IDAsXHJcblx0XHRcdGVuZXJneU1heDogMCxcclxuXHRcdFx0aGVhbHRoUmVnZW46IDAsXHJcblx0XHRcdGVuZXJneVJlZ2VuOiAwLFxyXG5cdFx0XHRyYW5nZTogMFxyXG5cdFx0fTtcclxuXHJcblx0XHRjb25zdCBpbnZlbnRvcnkgPSB0aGlzLmdldEludmVudG9yeSgpO1xyXG5cclxuXHRcdC8vIEZvciBlYWNoIGl0ZW0gaW4gaW52ZW50b3J5IGNoZWNrIGZvciBib251c2VzXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGludmVudG9yeS5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRjb25zdCBpdGVtID0gaW52ZW50b3J5W2ldO1xyXG5cdFx0XHRpdGVtQm9udXMuZGFtYWdlICs9IGl0ZW0ucGFzc2l2ZS5kYW1hZ2U7XHJcblx0XHRcdGl0ZW1Cb251cy5kZWZlbmNlICs9IGl0ZW0ucGFzc2l2ZS5kZWZlbmNlO1xyXG5cdFx0XHRpdGVtQm9udXMuaGVhbHRoTWF4ICs9IGl0ZW0ucGFzc2l2ZS5oZWFsdGhNYXg7XHJcblx0XHRcdGl0ZW1Cb251cy5lbmVyZ3lNYXggKz0gaXRlbS5wYXNzaXZlLmVuZXJneU1heDtcclxuXHRcdFx0aXRlbUJvbnVzLmhlYWx0aFJlZ2VuICs9IGl0ZW0ucGFzc2l2ZS5oZWFsdGhSZWdlbjtcclxuXHRcdFx0aXRlbUJvbnVzLmVuZXJneVJlZ2VuICs9IGl0ZW0ucGFzc2l2ZS5lbmVyZ3lSZWdlbjtcclxuXHRcdFx0aXRlbUJvbnVzLnJhbmdlICs9IGl0ZW0ucGFzc2l2ZS5yYW5nZTtcclxuXHJcblx0XHRcdGlmIChpdGVtLnNsb3QgPj0gY29uZmlnLklOVkVOVE9SWV9TSVpFKSB7XHJcblx0XHRcdFx0aXRlbUJvbnVzLmRhbWFnZSArPSBpdGVtLmVxdWlwcGVkLmRhbWFnZTtcclxuXHRcdFx0XHRpdGVtQm9udXMuZGVmZW5jZSArPSBpdGVtLmVxdWlwcGVkLmRlZmVuY2U7XHJcblx0XHRcdFx0aXRlbUJvbnVzLmhlYWx0aE1heCArPSBpdGVtLmVxdWlwcGVkLmhlYWx0aE1heDtcclxuXHRcdFx0XHRpdGVtQm9udXMuZW5lcmd5TWF4ICs9IGl0ZW0uZXF1aXBwZWQuZW5lcmd5TWF4O1xyXG5cdFx0XHRcdGl0ZW1Cb251cy5oZWFsdGhSZWdlbiArPSBpdGVtLmVxdWlwcGVkLmhlYWx0aFJlZ2VuO1xyXG5cdFx0XHRcdGl0ZW1Cb251cy5lbmVyZ3lSZWdlbiArPSBpdGVtLmVxdWlwcGVkLmVuZXJneVJlZ2VuO1xyXG5cdFx0XHRcdGl0ZW1Cb251cy5yYW5nZSArPSBpdGVtLmVxdWlwcGVkLnJhbmdlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiBpdGVtQm9udXM7XHJcblx0fVxyXG5cclxuXHRjYWxjRWZmZWN0Qm9udXMoKSB7XHJcblx0XHRjb25zdCBlZmZlY3RCb251cyA9IHtcclxuXHRcdFx0ZGFtYWdlOiAwLFxyXG5cdFx0XHRkZWZlbmNlOiAwLFxyXG5cdFx0XHRoZWFsdGhNYXg6IDAsXHJcblx0XHRcdGVuZXJneU1heDogMCxcclxuXHRcdFx0aGVhbHRoUmVnZW46IDAsXHJcblx0XHRcdGVuZXJneVJlZ2VuOiAwLFxyXG5cdFx0XHRyYW5nZTogMFxyXG5cdFx0fTtcclxuXHJcblx0XHQvLyBUT0RPOiB3b3JrIG91dCBob3cgdG8gZG8gZWZmZWN0cyBmb3Igc3BlbGxzIGFuZCBwb3Rpb25zXHJcblx0XHRyZXR1cm4gZWZmZWN0Qm9udXM7XHJcblx0fVxyXG5cdFxyXG5cdGNhbGNCb251c1N0YXRzKCkge1x0Ly8gSXRlbXMgKGVxdWlwcGVkIGFuZCBwYXNzaXZlKSBhbmQgRWZmZWN0cyAoc3BlbGxzIGFuZCBwb3Rpb25zKVxyXG5cdFx0Y29uc3QgaXRlbUJvbnVzID0gdGhpcy5jYWxjSXRlbUJvbnVzKCk7XHJcblx0XHRjb25zdCBlZmZlY3RCb251cyA9IHRoaXMuY2FsY0VmZmVjdEJvbnVzKCk7XHJcblxyXG5cdFx0dGhpcy5kYW1hZ2VCb251cyA9IGl0ZW1Cb251cy5kYW1hZ2UgKyBlZmZlY3RCb251cy5kYW1hZ2U7XHJcblx0XHR0aGlzLmRlZmVuY2VCb251cyA9IGl0ZW1Cb251cy5kZWZlbmNlICsgZWZmZWN0Qm9udXMuZGVmZW5jZTtcclxuXHRcdHRoaXMuaGVhbHRoTWF4Qm9udXMgPSBpdGVtQm9udXMuaGVhbHRoTWF4ICsgZWZmZWN0Qm9udXMuaGVhbHRoTWF4O1xyXG5cdFx0dGhpcy5lbmVyZ3lNYXhCb251cyA9IGl0ZW1Cb251cy5lbmVyZ3lNYXggKyBlZmZlY3RCb251cy5lbmVyZ3lNYXg7XHJcblx0XHR0aGlzLmhlYWx0aFJlZ2VuQm9udXMgPSBpdGVtQm9udXMuaGVhbHRoUmVnZW4gKyBlZmZlY3RCb251cy5oZWFsdGhSZWdlbjtcclxuXHRcdHRoaXMuZW5lcmd5UmVnZW5Cb251cyA9IGl0ZW1Cb251cy5lbmVyZ3lSZWdlbiArIGVmZmVjdEJvbnVzLmVuZXJneVJlZ2VuO1xyXG5cdFx0dGhpcy5yYW5nZUJvbnVzID0gaXRlbUJvbnVzLnJhbmdlICsgZWZmZWN0Qm9udXMucmFuZ2U7XHJcblx0fVxyXG5cclxuXHRjYWxjU3RhdHMoKSB7XHJcblx0XHR0aGlzLmNhbGNCYXNlU3RhdHMoKTtcclxuXHRcdHRoaXMuY2FsY0JvbnVzU3RhdHMoKTtcclxuXHR9XHJcblxyXG5cdHJlc3RvcmUoKSB7XHJcblx0XHR0aGlzLmhlYWx0aCA9IHRoaXMuaGVhbHRoTWF4O1xyXG5cdFx0dGhpcy5lbmVyZ3kgPSB0aGlzLmVuZXJneU1heDtcclxuXHR9XHJcblx0XHJcblx0aW5wdXREYXRhKCkge1xyXG5cdFx0Ly8gU2VlIFBsYXllciBhbmQgQm90IGNsYXNzZXNcclxuXHR9XHJcblxyXG5cdC8vIE1vdmVtZW50XHJcblx0c2V0UG9zaXRpb24obWFwSWQsIHgsIHkpIHtcclxuXHRcdHRoaXMubWFwSWQgPSBtYXBJZDtcclxuXHRcdHRoaXMueCA9IHg7XHJcblx0XHR0aGlzLnN0YXJ0WCA9IHg7XHJcblx0XHR0aGlzLmRlc3RpbmF0aW9uWCA9IHg7XHJcblx0XHR0aGlzLnkgPSB5O1xyXG5cdFx0dGhpcy5zdGFydFkgPSB5O1xyXG5cdFx0dGhpcy5kZXN0aW5hdGlvblkgPSB5O1xyXG5cdH1cclxuXHJcblx0bW92ZShkaXJlY3Rpb24pIHtcclxuXHRcdGlmICh0aGlzLmlzTW92aW5nKSByZXR1cm47XHJcblxyXG5cdFx0aWYgKGRpcmVjdGlvbikgdGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XHJcblxyXG5cdFx0aWYgKGRpcmVjdGlvbiA9PT0gJ2xlZnQnKSB7XHJcblx0XHRcdGlmICghZ2FtZS5pc1ZhY2FudCh0aGlzLm1hcElkLCB0aGlzLnggLSAxLCB0aGlzLnkpKSByZXR1cm47XHJcblx0XHRcdHRoaXMuZGVzdGluYXRpb25YLS07XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdyaWdodCcpIHtcclxuXHRcdFx0aWYgKCFnYW1lLmlzVmFjYW50KHRoaXMubWFwSWQsIHRoaXMueCArIDEsIHRoaXMueSkpIHJldHVybjtcclxuXHRcdFx0dGhpcy5kZXN0aW5hdGlvblgrKztcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ3VwJykge1xyXG5cdFx0XHRpZiAoIWdhbWUuaXNWYWNhbnQodGhpcy5tYXBJZCwgdGhpcy54LCB0aGlzLnkgLSAxKSkgcmV0dXJuO1xyXG5cdFx0XHR0aGlzLmRlc3RpbmF0aW9uWS0tO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoZGlyZWN0aW9uID09PSAnZG93bicpIHtcclxuXHRcdFx0aWYgKCFnYW1lLmlzVmFjYW50KHRoaXMubWFwSWQsIHRoaXMueCwgdGhpcy55ICsgMSkpIHJldHVybjtcclxuXHRcdFx0dGhpcy5kZXN0aW5hdGlvblkrKztcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRzd2l0Y2ggKHV0aWwucmFuZG9tSW50KDAsIDMgKyB0aGlzLmxhemluZXNzKSkge1xyXG5cdFx0XHRcdGNhc2UgMDogdGhpcy5tb3ZlKCdsZWZ0Jyk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAxOiB0aGlzLm1vdmUoJ3JpZ2h0Jyk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAyOiB0aGlzLm1vdmUoJ3VwJyk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAzOiB0aGlzLm1vdmUoJ2Rvd24nKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRkZWZhdWx0OiAvLyBEb24ndCBNb3ZlXHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFNldCBtb3ZlIHNwZWVkXHJcblx0XHRpZiAodGhpcy5pc1J1bm5pbmcpIHtcclxuXHRcdFx0aWYgKHRoaXMuZW5lcmd5ID4gMCkge1xyXG5cdFx0XHRcdHRoaXMuZW5lcmd5LS07XHJcblx0XHRcdFx0dGhpcy5tb3ZlU3BlZWQgPSA0O1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMuZW5lcmd5ID0gMDtcclxuXHRcdFx0XHR0aGlzLm1vdmVTcGVlZCA9IDIuNTtcclxuXHRcdFx0XHR0aGlzLmlzUnVubmluZyA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0dGhpcy5tb3ZlU3BlZWQgPSAyLjU7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHRoaXMuaXNNb3ZpbmcgPSB0cnVlO1xyXG5cdH1cclxuXHRcclxuXHRzd2l0Y2hNYXAoZGlyZWN0aW9uKSB7XHJcblx0XHRpZiAoIWRpcmVjdGlvbikgcmV0dXJuO1xyXG5cdFx0dGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XHJcblxyXG5cdFx0Y29uc3QgbWFwID0gZ2FtZS5tYXBzW3RoaXMubWFwSWRdO1xyXG5cdFx0bGV0IG5ld01hcElkID0gbnVsbDtcclxuXHRcdGxldCBuZXdYID0gbnVsbDtcclxuXHRcdGxldCBuZXdZID0gbnVsbDtcclxuXHJcblx0XHRpZiAoZGlyZWN0aW9uID09PSAnbGVmdCcpIHtcclxuXHRcdFx0bmV3TWFwSWQgPSBtYXAuZXhpdExlZnQ7XHJcblx0XHRcdG5ld1ggPSBjb25maWcuTUFQX0NPTFVNTlMgLSAxO1xyXG5cdFx0XHRuZXdZID0gdGhpcy55O1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoZGlyZWN0aW9uID09PSAncmlnaHQnKSB7XHJcblx0XHRcdG5ld01hcElkID0gbWFwLmV4aXRSaWdodDtcclxuXHRcdFx0bmV3WCA9IDA7XHJcblx0XHRcdG5ld1kgPSB0aGlzLnk7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChkaXJlY3Rpb24gPT09ICd1cCcpIHtcclxuXHRcdFx0bmV3TWFwSWQgPSBtYXAuZXhpdFVwO1xyXG5cdFx0XHRuZXdYID0gdGhpcy54O1xyXG5cdFx0XHRuZXdZID0gY29uZmlnLk1BUF9ST1dTIC0gMTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ2Rvd24nKSB7XHJcblx0XHRcdG5ld01hcElkID0gbWFwLmV4aXREb3duO1xyXG5cdFx0XHRuZXdYID0gdGhpcy54O1xyXG5cdFx0XHRuZXdZID0gMDtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAobmV3TWFwSWQpIHtcclxuXHRcdFx0dGhpcy5zZXRQb3NpdGlvbihuZXdNYXBJZCwgbmV3WCwgbmV3WSk7XHJcblx0XHRcdGdhbWUuc2VuZE1hcERhdGEodGhpcy5zb2NrZXQsIG5ld01hcElkKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdG1vdmVUb1RhcmdldCh0YXJnZXQsIGhvc3RpbGUpIHtcclxuXHRcdGlmICghdGFyZ2V0KSByZXR1cm47XHJcblx0XHRcclxuXHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICYmIHRhcmdldC55ID09PSB0aGlzLnkpIHtcclxuXHRcdFx0dGhpcy5tb3ZlKCk7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmICh1dGlsLnJhbmRvbUludCgwLCAxKSA9PT0gMCkge1xyXG5cdFx0XHRpZiAodGFyZ2V0LnggPCB0aGlzLngpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LnggPj0gKHRoaXMueCAtIHRoaXMucmFuZ2UpICYmIHRhcmdldC55ID09PSB0aGlzLnkpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlICYmICF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ2xlZnQnO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmF0dGFjaygnbGVmdCcpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSgnbGVmdCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICh0YXJnZXQueCA+IHRoaXMueCkge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICsgdGhpcy5yYW5nZSAmJiB0YXJnZXQueSA9PT0gdGhpcy55KSB7XHJcblx0XHRcdFx0XHRpZiAoaG9zdGlsZSAmJiAhdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdyaWdodCc7XHJcblx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCdyaWdodCcpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSgncmlnaHQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodGFyZ2V0LnkgPCB0aGlzLnkpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LnggPT09IHRoaXMueCAmJiB0YXJnZXQueSA9PT0gdGhpcy55IC0gdGhpcy5yYW5nZSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUgJiYgIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAndXAnO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmF0dGFjaygndXAnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ3VwJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHRhcmdldC55ID4gdGhpcy55KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggJiYgdGFyZ2V0LnkgPT09IHRoaXMueSArIHRoaXMucmFuZ2UpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlICYmICF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ2Rvd24nO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmF0dGFjaygnZG93bicpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSgnZG93bicpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGlmICh0YXJnZXQueSA+IHRoaXMueSkge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICYmIHRhcmdldC55ID09PSB0aGlzLnkgKyB0aGlzLnJhbmdlKSB7XHJcblx0XHRcdFx0XHRpZiAoaG9zdGlsZSAmJiAhdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdkb3duJztcclxuXHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ2Rvd24nKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ2Rvd24nKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodGFyZ2V0LnkgPCB0aGlzLnkpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LnggPT09IHRoaXMueCAmJiB0YXJnZXQueSA9PT0gdGhpcy55IC0gdGhpcy5yYW5nZSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUgJiYgIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAndXAnO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmF0dGFjaygndXAnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ3VwJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHRhcmdldC54ID4gdGhpcy54KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggKyB0aGlzLnJhbmdlICYmIHRhcmdldC55ID09PSB0aGlzLnkpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlICYmICF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ3JpZ2h0JztcclxuXHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ3JpZ2h0Jyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCdyaWdodCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICh0YXJnZXQueCA8IHRoaXMueCkge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQueCA+PSAodGhpcy54IC0gdGhpcy5yYW5nZSkgJiYgdGFyZ2V0LnkgPT09IHRoaXMueSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUgJiYgIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnbGVmdCc7XHJcblx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCdsZWZ0Jyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCdsZWZ0Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdC8vIENvbWJhdFxyXG5cdGNoZWNrSW5SYW5nZShkaXJlY3Rpb24sIHRhcmdldCwgcmFuZ2UpIHtcclxuXHRcdGlmICh0YXJnZXQubWFwSWQgIT09IHRoaXMubWFwSWQpIHJldHVybiBmYWxzZTtcclxuXHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICYmIHRhcmdldC55ID09PSB0aGlzLnkpIHJldHVybiBmYWxzZTtcdC8vIFN0YWNrZWQgZG9lcyBub3QgY291bnQgYXMgaW4gcmFuZ2VcclxuXHRcdFxyXG5cdFx0aWYgKHRhcmdldC55ID09PSB0aGlzLnkpIHtcclxuXHRcdFx0aWYgKGRpcmVjdGlvbiA9PT0gJ2xlZnQnKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMueCA9PT0gMCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHJldHVybiAodGFyZ2V0LnggPCB0aGlzLnggJiYgdGFyZ2V0LnggPj0gKHRoaXMueCAtIHJhbmdlKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ3JpZ2h0Jykge1xyXG5cdFx0XHRcdGlmICh0aGlzLnggPT09IGNvbmZpZy5NQVBfQ09MVU1OUyAtIDEpIHtcclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gKHRhcmdldC54ID4gdGhpcy54ICYmIHRhcmdldC54IDw9ICh0aGlzLnggKyByYW5nZSkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAodGFyZ2V0LnggPT09IHRoaXMueCkge1xyXG5cdFx0XHRpZiAoZGlyZWN0aW9uID09PSAndXAnKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMueSA9PT0gMCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHJldHVybiAodGFyZ2V0LnkgPCB0aGlzLnkgJiYgdGFyZ2V0LnkgPj0gKHRoaXMueSAtIHJhbmdlKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ2Rvd24nKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMueSA9PT0gY29uZmlnLk1BUF9ST1dTIC0gMSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHJldHVybiAodGFyZ2V0LnkgPiB0aGlzLnkgJiYgdGFyZ2V0LnkgPD0gKHRoaXMueSArIHJhbmdlKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblxyXG5cdGF0dGFjayhudW1UYXJnZXRzID0gMSwgZGlyZWN0aW9uID0gdGhpcy5kaXJlY3Rpb24pIHtcclxuXHRcdGlmICh0aGlzLmlzQXR0YWNraW5nIHx8IHRoaXMuYXR0YWNrVGltZXIgPiAwKSByZXR1cm47XHJcblxyXG5cdFx0dGhpcy5pc0F0dGFja2luZyA9IHRydWU7XHJcblx0XHRcclxuXHRcdGNvbnN0IHBsYXllckxpc3QgPSBnYW1lLnBsYXllcnMuZmlsdGVyKHBsYXllciA9PiBwbGF5ZXIubWFwSWQgPT09IHRoaXMubWFwSWQpO1xyXG5cdFx0Y29uc3QgYm90TGlzdCA9IGdhbWUuYm90cy5maWx0ZXIoYm90ID0+IGJvdC5tYXBJZCA9PT0gdGhpcy5tYXBJZCk7XHJcblx0XHRjb25zdCBhY3Rvckxpc3QgPSBwbGF5ZXJMaXN0LmNvbmNhdChib3RMaXN0KTtcclxuXHRcdGxldCB0YXJnZXRMaXN0ID0gYWN0b3JMaXN0LmZpbHRlcihhY3RvciA9PiB7XHJcblx0XHRcdHJldHVybiBhY3RvciAhPT0gdGhpcyAmJiAhYWN0b3IuaXNEZWFkICYmIHRoaXMuY2hlY2tJblJhbmdlKGRpcmVjdGlvbiwgYWN0b3IsIHRoaXMucmFuZ2UpO1xyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcdHRhcmdldExpc3Quc29ydCgoYSwgYikgPT4ge1xyXG5cdFx0XHRyZXR1cm4gKGEueiAtIGIueik7XHQvLyBMb3dlc3QgdG8gaGlnaGVzdFxyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcdHRhcmdldExpc3QgPSB0YXJnZXRMaXN0LnNwbGljZSgtbnVtVGFyZ2V0cyk7XHJcblx0XHRcclxuXHRcdHRhcmdldExpc3QuZm9yRWFjaCgodGFyZ2V0KSA9PiB7XHJcblx0XHRcdHRhcmdldC50YWtlRGFtYWdlKHRoaXMuZGFtYWdlLCB0aGlzKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRcclxuXHR0YWtlRGFtYWdlKGRhbWFnZSwgYXR0YWNrZXIpIHtcclxuXHRcdGRhbWFnZSAtPSB0aGlzLmRlZmVuY2U7XHJcblx0XHRpZiAoZGFtYWdlIDwgMCkgZGFtYWdlID0gMDtcclxuXHRcdGdhbWUuc3Bhd25EYW1hZ2VUZXh0KHRoaXMubWFwSWQsIHRoaXMueCwgdGhpcy55LCBkYW1hZ2UpO1xyXG5cdFx0aWYgKGRhbWFnZSA9PT0gMCkgcmV0dXJuO1xyXG5cdFx0XHJcblx0XHR0aGlzLmlzSGl0ID0gdHJ1ZTtcclxuXHRcdHRoaXMuaGVhbHRoIC09IGRhbWFnZTtcclxuXHJcblx0XHRpZiAodGhpcy5oZWFsdGggPD0gMCkge1xyXG5cdFx0XHR0aGlzLnNldERlYWQoKTtcclxuXHRcdFx0XHJcblx0XHRcdGlmICghYXR0YWNrZXIpIHtcclxuXHRcdFx0XHRnYW1lLnNlbmRHYW1lSW5mb0dsb2JhbCh0aGlzLm5hbWUgKyBcIiBoYXMgZGllZCFcIik7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRhdHRhY2tlci5raWxscysrO1xyXG5cdFx0XHRpZiAoYXR0YWNrZXIudGFyZ2V0ID09PSB0aGlzKSBhdHRhY2tlci50YXJnZXQgPSBudWxsO1xyXG5cdFx0XHRpZiAodGhpcy5wbGF5ZXJJZCkge1xyXG5cdFx0XHRcdGlmIChhdHRhY2tlci5wbGF5ZXJJZCkgZ2FtZS5zZW5kR2FtZUluZm9HbG9iYWwoYXR0YWNrZXIubmFtZSArIFwiIGhhcyBtdXJkZXJlZCBcIiArIHRoaXMubmFtZSArIFwiIGluIGNvbGQgYmxvb2QhXCIpO1xyXG5cdFx0XHRcdGVsc2UgZ2FtZS5zZW5kR2FtZUluZm9HbG9iYWwodGhpcy5uYW1lICsgXCIgaGFzIGJlZW4ga2lsbGVkIGJ5IFwiICsgYXR0YWNrZXIubmFtZSArIFwiIVwiKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cdFxyXG5cclxuXHRzZXREZWFkKCkge1xyXG5cdFx0Y29uc3QgbWFwID0gZ2FtZS5tYXBzW3RoaXMubWFwSWRdO1xyXG5cdFx0Y29uc3QgaW52ZW50b3J5ID0gdGhpcy5nZXRJbnZlbnRvcnkoKTtcclxuXHJcblx0XHQvLyBJbnZlbnRvcnkgSXRlbSBEcm9wIENoYW5jZVxyXG5cdFx0Y29uc3QgZHJvcENoYW5jZSA9IHV0aWwuY2xhbXAobWFwLmRyb3BDaGFuY2UsIDAsIDEwMCk7XHJcblx0XHRpZiAoZHJvcENoYW5jZSA+IDApIHtcclxuXHRcdFx0Y29uc3QgaXRlbXMgPSBpbnZlbnRvcnkuZmlsdGVyKGl0ZW0gPT4ge1xyXG5cdFx0XHRcdHJldHVybiBpdGVtLnNsb3QgPCBjb25maWcuSU5WRU5UT1JZX1NJWkU7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0aXRlbXMuZm9yRWFjaChpdGVtID0+IHtcclxuXHRcdFx0XHRpZiAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAxKSA8PSBkcm9wQ2hhbmNlKSB7XHJcblx0XHRcdFx0XHRpdGVtLm1vdmVUb01hcCh0aGlzLm1hcElkLCB0aGlzLngsIHRoaXMueSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0dGhpcy5jYWxjQm9udXNTdGF0cygpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEVxdWlwcGVkIEl0ZW0gRHJvcCBBbW91bnRcclxuXHRcdGNvbnN0IGRyb3BBbW91bnRFUSA9IHV0aWwuY2xhbXAobWFwLmRyb3BBbW91bnRFUSwgMCwgY29uZmlnLkVRVUlQTUVOVF9TSVpFKTtcclxuXHRcdGlmIChkcm9wQW1vdW50RVEgPiAwKSB7XHJcblx0XHRcdGxldCBlcXVpcG1lbnQgPSBpbnZlbnRvcnkuZmlsdGVyKGl0ZW0gPT4ge1xyXG5cdFx0XHRcdHJldHVybiBpdGVtLnNsb3QgPj0gY29uZmlnLklOVkVOVE9SWV9TSVpFO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdGVxdWlwbWVudCA9IHV0aWwuc2h1ZmZsZShlcXVpcG1lbnQpO1xyXG5cdFx0XHRlcXVpcG1lbnQuc3BsaWNlKC1kcm9wQW1vdW50RVEpO1xyXG5cdFx0XHRlcXVpcG1lbnQuZm9yRWFjaChpdGVtID0+IHtcclxuXHRcdFx0XHRpdGVtLm1vdmVUb01hcCh0aGlzLm1hcElkLCB0aGlzLngsIHRoaXMueSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHR0aGlzLmNhbGNCb251c1N0YXRzKCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdC8vIEludmVudG9yeVxyXG5cdHBpY2tVcCgpIHtcclxuXHRcdGNvbnN0IG1hcEl0ZW1zID0gZ2FtZS5pdGVtcy5maWx0ZXIoaXRlbSA9PiB7XHJcblx0XHRcdHJldHVybiBpdGVtLm1hcElkID09PSB0aGlzLm1hcElkICYmIGl0ZW0ueCA9PT0gdGhpcy54ICYmIGl0ZW0ueSA9PT0gdGhpcy55O1xyXG5cdFx0fSk7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IG1hcEl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IGl0ZW0gPSBtYXBJdGVtc1tpXTtcclxuXHRcdFx0aWYgKCFpdGVtKSBjb250aW51ZTtcclxuXHRcdFx0XHJcblx0XHRcdGlmIChpdGVtLnN0YWNrYWJsZSkge1xyXG5cdFx0XHRcdGNvbnN0IGludmVudG9yeSA9IHRoaXMuZ2V0SW52ZW50b3J5KCk7XHJcblx0XHRcdFx0aWYgKGludmVudG9yeS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRjb25zdCBzYW1lSXRlbXMgPSBpbnZlbnRvcnkuZmlsdGVyKGludmVudG9yeUl0ZW0gPT4ge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gaW52ZW50b3J5SXRlbS50ZW1wbGF0ZUlkID09PSBpdGVtLnRlbXBsYXRlSWQ7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdGlmIChzYW1lSXRlbXMubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRzYW1lSXRlbXNbMF0uc3RhY2sgKz0gaXRlbS5zdGFjaztcclxuXHRcdFx0XHRcdFx0aXRlbS5yZW1vdmUoKTtcclxuXHRcdFx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb25zdCBzbG90ID0gdGhpcy5maW5kRmlyc3RFbXB0eVNsb3QoKTtcclxuXHRcdFx0aWYgKHNsb3QgPT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdFx0aXRlbS5tb3ZlVG9JbnZlbnRvcnkodGhpcy5wbGF5ZXJJZCwgdGhpcy5ib3RJZCwgc2xvdCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRnZXRJbnZlbnRvcnkoKSB7XHJcblx0XHQvLyBTZWUgUGxheWVyIGFuZCBCb3QgY2xhc3Nlc1xyXG5cdH1cclxuXHJcblx0Z2V0SXRlbShzbG90KSB7XHJcblx0XHRjb25zdCBpbnZlbnRvcnkgPSB0aGlzLmdldEludmVudG9yeSgpO1xyXG5cdFx0Y29uc3QgaXRlbXMgPSBpbnZlbnRvcnkuZmlsdGVyKGl0ZW0gPT4ge1xyXG5cdFx0XHRyZXR1cm4gaXRlbS5zbG90ID09PSBzbG90O1xyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gaXRlbXNbMF07XHJcblx0fVxyXG5cclxuXHRoYXNJdGVtKHRlbXBsYXRlSWQpIHtcclxuXHRcdGNvbnN0IGludmVudG9yeSA9IHRoaXMuZ2V0SW52ZW50b3J5KCk7XHJcblx0XHRjb25zdCBpdGVtcyA9IGdhbWUuaXRlbXMuZmlsdGVyKGl0ZW0gPT4ge1xyXG5cdFx0XHRyZXR1cm4gaXRlbS50ZW1wbGF0ZUlkID09PSB0ZW1wbGF0ZUlkO1xyXG5cdFx0fSk7XHJcblx0XHRpZiAoaXRlbXNbMF0uc3RhY2thYmxlKSB7XHJcblx0XHRcdHJldHVybiBpdGVtc1swXS5zdGFjaztcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gaXRlbXMubGVuZ3RoO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZmluZEl0ZW1TbG90KHRlbXBsYXRlSWQpIHtcclxuXHRcdGNvbnN0IGludmVudG9yeSA9IHRoaXMuZ2V0SW52ZW50b3J5KCk7XHJcblx0XHRjb25zdCBpdGVtcyA9IGludmVudG9yeS5maWx0ZXIoaXRlbSA9PiB7XHJcblx0XHRcdHJldHVybiBpdGVtLnRlbXBsYXRlSWQgPT09IHRlbXBsYXRlSWQ7XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBpdGVtc1swXS5zbG90O1xyXG5cdH1cclxuXHJcblx0ZmluZEZpcnN0RW1wdHlTbG90KCkge1xyXG5cdFx0Y29uc3QgaW52ZW50b3J5ID0gdGhpcy5nZXRJbnZlbnRvcnkoKTtcclxuXHJcblx0XHRmb3IgKGxldCBzbG90ID0gMDsgc2xvdCA8IGNvbmZpZy5JTlZFTlRPUllfU0laRTsgc2xvdCsrKSB7XHJcblx0XHRcdGxldCBvY2N1cGllZCA9IGZhbHNlO1xyXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGludmVudG9yeS5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdGlmIChpbnZlbnRvcnlbaV0uc2xvdCA9PT0gc2xvdCkge1xyXG5cdFx0XHRcdFx0b2NjdXBpZWQgPSB0cnVlO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICghb2NjdXBpZWQpIHJldHVybiBzbG90O1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fVxyXG5cclxuXHR1c2VJdGVtKHNsb3QpIHtcclxuXHRcdGNvbnN0IGl0ZW0gPSB0aGlzLmdldEl0ZW0oc2xvdCk7XHJcblx0XHRpZiAoIWl0ZW0pIHJldHVybjtcclxuXHJcblx0XHQvLyBUT0RPOiBpZiAoIXVzZVNjcmlwdCgpKSByZXR1cm47XHJcblxyXG5cdFx0aWYgKGl0ZW0uaXNFcXVpcG1lbnQoKSkge1xyXG5cdFx0XHRpZiAoaXRlbS5zbG90IDwgY29uZmlnLklOVkVOVE9SWV9TSVpFKSB7XHQvLyBDaGVjayBpZiBpdGVtIGlzIGVxdWlwcGVkXHJcblx0XHRcdFx0dGhpcy5lcXVpcEl0ZW0oaXRlbSk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMudW5lcXVpcEl0ZW0oaXRlbSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIWl0ZW0ucmV1c2FibGUpIGl0ZW0ucmVtb3ZlT25lKCk7XHJcblx0fVxyXG5cclxuXHRkcm9wSXRlbShzbG90KSB7XHJcblx0XHRjb25zdCBpdGVtID0gdGhpcy5nZXRJdGVtKHNsb3QpO1xyXG5cdFx0aWYgKCFpdGVtKSByZXR1cm47XHJcblx0XHRpdGVtLm1vdmVUb01hcCh0aGlzLm1hcElkLCB0aGlzLngsIHRoaXMueSk7XHJcblx0XHR0aGlzLmNhbGNCb251c1N0YXRzKCk7XHJcblx0fVxyXG5cclxuXHRtb3ZlSXRlbVRvU2xvdChzbG90LCBuZXdTbG90KSB7XHJcblx0XHRpZiAoc2xvdCA9PSBudWxsIHx8IG5ld1Nsb3QgPT0gbnVsbCB8fCBzbG90ID09PSBuZXdTbG90KSByZXR1cm47XHQvLyBudWxsID09IHVuZGVmaW5lZCwgbnVsbCAhPSAwXHJcblx0XHRpZiAoc2xvdCA8IDAgfHwgc2xvdCA+PSBjb25maWcuSU5WRU5UT1JZX1NJWkUgKyBjb25maWcuRVFVSVBNRU5UX1NJWkUpIHJldHVybjtcclxuXHRcdGlmIChuZXdTbG90IDwgMCB8fCBuZXdTbG90ID49IGNvbmZpZy5JTlZFTlRPUllfU0laRSArIGNvbmZpZy5FUVVJUE1FTlRfU0laRSkgcmV0dXJuO1xyXG5cclxuXHRcdGNvbnN0IGl0ZW0gPSB0aGlzLmdldEl0ZW0oc2xvdCk7XHJcblx0XHRjb25zdCBuZXdJdGVtID0gdGhpcy5nZXRJdGVtKG5ld1Nsb3QpO1xyXG5cdFx0aWYgKCFpdGVtKSByZXR1cm47XHJcblxyXG5cdFx0Ly8gVGFyZ2V0IHNsb3QgaXMgZm9yIGVxdWlwbWVudCAtIGNoZWNrIHR5cGUgbWF0Y2hlc1xyXG5cdFx0aWYgKG5ld1Nsb3QgPj0gY29uZmlnLklOVkVOVE9SWV9TSVpFKSB7XHJcblx0XHRcdGlmIChpdGVtLmVxdWlwcGVkU2xvdCArIGNvbmZpZy5JTlZFTlRPUllfU0laRSAhPT0gbmV3U2xvdCkge1xyXG5cdFx0XHRcdGdhbWUuc2VuZEdhbWVJbmZvUGxheWVyKHRoaXMuaWQsIFwiVGhhdCBjYW5ub3QgYmUgZXF1aXBwZWQgdGhlcmUuXCIpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHN3YXBTbG90cyA9ICgpID0+IHtcclxuXHRcdFx0aXRlbS5zbG90ID0gbmV3U2xvdDtcclxuXHRcdFx0aWYgKG5ld0l0ZW0pIG5ld0l0ZW0uc2xvdCA9IHNsb3Q7XHJcblx0XHRcdHRoaXMuY2FsY0JvbnVzU3RhdHMoKTtcclxuXHRcdH07XHJcblxyXG5cdFx0Ly8gSUYgTm8gbmV3IGl0ZW0gaW4gbmV3IHNsb3RcclxuXHRcdC8vIE9SIE5ldyBpdGVtIGluIG5ldyBzbG90LCBvbGQgaXRlbSBpbiBpbnZlbnRvcnlcclxuXHRcdC8vIE9SIE5ldyBpdGVtIGluIG5ldyBzbG90LCBvbGQgaXRlbSBpcyBlcXVpcHBlZCwgbmV3IGl0ZW0gY2FuIGJlIGVxdWlwcGVkIGluIG9sZCBzbG90XHJcblx0XHRpZiAoIW5ld0l0ZW0gfHwgc2xvdCA8IGNvbmZpZy5JTlZFTlRPUllfU0laRSB8fCBuZXdJdGVtLmVxdWlwcGVkU2xvdCArIGNvbmZpZy5JTlZFTlRPUllfU0laRSA9PT0gc2xvdCkge1xyXG5cdFx0XHRzd2FwU2xvdHMoKTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHQvLyBPbGQgaXRlbSBpcyBlcXVpcHBlZCwgbmV3IGl0ZW0gY2Fubm90IGJlIGVxdWlwcGVkIGluIG9sZCBzbG90XHJcblx0XHRcdG5ld1Nsb3QgPSB0aGlzLmZpbmRGaXJzdEVtcHR5U2xvdCgpO1xyXG5cdFx0XHRpZiAobmV3U2xvdCAhPSBudWxsKSB7XHJcblx0XHRcdFx0c3dhcFNsb3RzKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0Z2FtZS5zZW5kR2FtZUluZm9QbGF5ZXIodGhpcy5pZCwgXCJZb3VyIGludmVudG9yeSBpcyBmdWxsLlwiKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZXF1aXBJdGVtKGl0ZW0pIHtcclxuXHRcdGNvbnN0IGVxdWlwcGVkSXRlbSA9IHRoaXMuZ2V0SXRlbShpdGVtLmVxdWlwcGVkU2xvdCArIGNvbmZpZy5JTlZFTlRPUllfU0laRSk7XHJcblx0XHRpdGVtLnNsb3QgPSBpdGVtLmVxdWlwcGVkU2xvdCArIGNvbmZpZy5JTlZFTlRPUllfU0laRTtcclxuXHRcdGlmIChlcXVpcHBlZEl0ZW0pIGVxdWlwcGVkSXRlbS5zbG90ID0gdGhpcy5maW5kRmlyc3RFbXB0eVNsb3QoKTtcclxuXHRcdHRoaXMuY2FsY0JvbnVzU3RhdHMoKTtcclxuXHR9XHJcblxyXG5cdHVuZXF1aXBJdGVtKGl0ZW0pIHtcclxuXHRcdGNvbnN0IG5ld1Nsb3QgPSB0aGlzLmZpbmRGaXJzdEVtcHR5U2xvdCgpO1xyXG5cdFx0aWYgKG5ld1Nsb3QgPT0gbnVsbCkge1xyXG5cdFx0XHRnYW1lLnNlbmRHYW1lSW5mb1BsYXllcih0aGlzLmdhbWVJZCwgXCJZb3VyIGludmVudG9yeSBpcyBmdWxsLlwiKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0aXRlbS5zbG90ID0gbmV3U2xvdDtcclxuXHRcdHRoaXMuY2FsY0JvbnVzU3RhdHMoKTtcclxuXHR9XHJcblxyXG5cdHVwZGF0ZShkZWx0YSkge1xyXG5cdFx0Ly8gSW52ZW50b3J5IEl0ZW0gVXBkYXRlXHJcblx0XHRjb25zdCBpbnZlbnRvcnkgPSB0aGlzLmdldEludmVudG9yeSgpO1xyXG5cdFx0aW52ZW50b3J5LmZvckVhY2goaXRlbSA9PiB7XHJcblx0XHRcdGlmIChpdGVtKSBpdGVtLnVwZGF0ZSgpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0aWYgKHRoaXMuaXNEZWFkKSByZXR1cm47XHJcblx0XHRcclxuXHRcdC8vIEF0dGFja2luZ1xyXG5cdFx0aWYgKHRoaXMuaXNBdHRhY2tpbmcgfHwgdGhpcy5hdHRhY2tUaW1lciA+IDApIHtcclxuXHRcdFx0dGhpcy5hdHRhY2tUaW1lciArPSBkZWx0YTtcclxuXHRcdFx0aWYgKHRoaXMuYXR0YWNrVGltZXIgPj0gMC4zKSB0aGlzLmlzQXR0YWNraW5nID0gZmFsc2U7XHJcblx0XHRcdGlmICh0aGlzLmF0dGFja1RpbWVyID49IHRoaXMuYXR0YWNrU3BlZWQpIHRoaXMuYXR0YWNrVGltZXIgPSAwO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBNb3ZlbWVudFxyXG5cdFx0aWYgKHRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0dGhpcy5sZXJwICs9IGRlbHRhICogdGhpcy5tb3ZlU3BlZWQ7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAodGhpcy5sZXJwID49IDAuNDkpIHtcclxuXHRcdFx0XHR0aGlzLnggPSB0aGlzLmRlc3RpbmF0aW9uWDtcclxuXHRcdFx0XHR0aGlzLnkgPSB0aGlzLmRlc3RpbmF0aW9uWTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0aWYgKHRoaXMubGVycCA+PSAwLjk5KSB7XHJcblx0XHRcdFx0dGhpcy5zdGFydFggPSB0aGlzLmRlc3RpbmF0aW9uWDtcclxuXHRcdFx0XHR0aGlzLnN0YXJ0WSA9IHRoaXMuZGVzdGluYXRpb25ZO1xyXG5cdFx0XHRcdHRoaXMubGVycCA9IDA7XHJcblx0XHRcdFx0dGhpcy5pc01vdmluZyA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gUmVnZW5cclxuXHRcdHRoaXMucmVnZW5UaW1lciArPSBkZWx0YTtcclxuXHRcdGlmICh0aGlzLnJlZ2VuVGltZXIgPj0gMSkge1xyXG5cdFx0XHR0aGlzLnJlZ2VuVGltZXIgPSAwO1xyXG5cdFx0XHRpZiAodGhpcy5oZWFsdGggPCB0aGlzLmhlYWx0aE1heCkge1xyXG5cdFx0XHRcdGlmICh0aGlzLmlzSGl0KSB7XHJcblx0XHRcdFx0XHR0aGlzLmlzSGl0ID0gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5oZWFsdGggKz0gdGhpcy5oZWFsdGhSZWdlbjtcclxuXHRcdFx0XHRcdGlmICh0aGlzLmhlYWx0aCA+IHRoaXMuaGVhbHRoTWF4KSB0aGlzLmhlYWx0aCA9IHRoaXMuaGVhbHRoTWF4O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHRoaXMuZW5lcmd5IDwgdGhpcy5lbmVyZ3lNYXgpIHtcclxuXHRcdFx0XHRpZiAoIXRoaXMuaXNSdW5uaW5nKSB7XHJcblx0XHRcdFx0XHR0aGlzLmVuZXJneSArPSB0aGlzLmVuZXJneVJlZ2VuO1xyXG5cdFx0XHRcdFx0aWYgKHRoaXMuZW5lcmd5ID4gdGhpcy5lbmVyZ3lNYXgpIHRoaXMuZW5lcmd5ID0gdGhpcy5lbmVyZ3lNYXg7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0Z2V0SW52ZW50b3J5UGFjaygpIHtcclxuXHRcdGNvbnN0IGludmVudG9yeVBhY2sgPSBbXTtcclxuXHRcdGNvbnN0IGludmVudG9yeSA9IHRoaXMuZ2V0SW52ZW50b3J5KCk7XHJcblx0XHRpbnZlbnRvcnkuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG5cdFx0XHRpZiAoaXRlbSkgaW52ZW50b3J5UGFja1tpdGVtLnNsb3RdID0gaXRlbS5nZXRQYWNrKCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gaW52ZW50b3J5UGFjaztcclxuXHR9XHJcbn1cclxuIiwiaW1wb3J0IGdhbWUgZnJvbSAnLi4vZ2FtZS5qcyc7XHJcbmltcG9ydCBjb25maWcgZnJvbSAnLi4vY29uZmlnLmpzJztcclxuaW1wb3J0IHV0aWwgZnJvbSAnLi4vdXRpbC5qcyc7XHJcbmltcG9ydCBBY3RvciBmcm9tICcuL2FjdG9yLmpzJztcclxuXHJcbi8vIEEgQm90IGlzIGFuIEFjdG9yIHdpdGggY29uZGl0aW9uYWwgaW5wdXRzXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCb3QgZXh0ZW5kcyBBY3RvciB7XHJcblx0Y29uc3RydWN0b3IoZGF0YSkge1xyXG5cdFx0bGV0IHsgX2lkLCBtYXBJZCwgeCwgeSwgZGlyZWN0aW9uLCB0ZW1wbGF0ZSwgbmFtZSwgc3ByaXRlLCBob3N0aWxlLFxyXG5cdFx0XHRcdFx0ZGFtYWdlQmFzZSwgZGVmZW5jZUJhc2UsIGhlYWx0aE1heEJhc2UsIGVuZXJneU1heEJhc2UsIGhlYWx0aFJlZ2VuQmFzZSwgZW5lcmd5UmVnZW5CYXNlLCByYW5nZUJhc2UgXHJcblx0XHRcdFx0fSA9IGRhdGE7XHJcblx0XHRcclxuXHRcdGlmIChfaWQgPT0gbnVsbCkgX2lkID0gZ2FtZS5yZXF1ZXN0REJJZCgpO1xyXG5cdFx0aWYgKG5hbWUgPT0gbnVsbCkgbmFtZSA9IHRlbXBsYXRlLm5hbWU7XHJcblx0XHRpZiAoc3ByaXRlID09IG51bGwpIHNwcml0ZSA9IHRlbXBsYXRlLnNwcml0ZTtcclxuXHRcdGlmIChob3N0aWxlID09IG51bGwpIGhvc3RpbGUgPSB0ZW1wbGF0ZS5ob3N0aWxlO1xyXG5cdFx0aWYgKGRhbWFnZUJhc2UgPT0gbnVsbCkgZGFtYWdlQmFzZSA9IHRlbXBsYXRlLmRhbWFnZUJhc2U7XHJcblx0XHRpZiAoZGVmZW5jZUJhc2UgPT0gbnVsbCkgZGVmZW5jZUJhc2UgPSB0ZW1wbGF0ZS5kZWZlbmNlQmFzZTtcclxuXHRcdGlmIChoZWFsdGhNYXhCYXNlID09IG51bGwpIGhlYWx0aE1heEJhc2UgPSB0ZW1wbGF0ZS5oZWFsdGhNYXhCYXNlO1xyXG5cdFx0aWYgKGVuZXJneU1heEJhc2UgPT0gbnVsbCkgZW5lcmd5TWF4QmFzZSA9IHRlbXBsYXRlLmVuZXJneU1heEJhc2U7XHJcblx0XHRpZiAoaGVhbHRoUmVnZW5CYXNlID09IG51bGwpIGhlYWx0aFJlZ2VuQmFzZSA9IHRlbXBsYXRlLmhlYWx0aFJlZ2VuQmFzZTtcclxuXHRcdGlmIChlbmVyZ3lSZWdlbkJhc2UgPT0gbnVsbCkgZW5lcmd5UmVnZW5CYXNlID0gdGVtcGxhdGUuZW5lcmd5UmVnZW5CYXNlO1xyXG5cdFx0aWYgKHJhbmdlQmFzZSA9PSBudWxsKSByYW5nZUJhc2UgPSB0ZW1wbGF0ZS5yYW5nZUJhc2U7XHJcblxyXG5cdFx0c3VwZXIobWFwSWQsIHgsIHksIGRpcmVjdGlvbiwgbmFtZSwgc3ByaXRlKTtcclxuXHRcdHRoaXMuYm90SWQgPSBfaWQ7XHJcblx0XHR0aGlzLnRlbXBsYXRlSWQgPSB0ZW1wbGF0ZS5faWQ7XHJcblx0XHR0aGlzLmRhbWFnZUJhc2UgPSBkYW1hZ2VCYXNlO1xyXG5cdFx0dGhpcy5kZWZlbmNlQmFzZSA9IGRlZmVuY2VCYXNlO1xyXG5cdFx0dGhpcy5oZWFsdGhNYXhCYXNlID0gaGVhbHRoTWF4QmFzZTtcclxuXHRcdHRoaXMuZW5lcmd5TWF4QmFzZSA9IGVuZXJneU1heEJhc2U7XHJcblx0XHR0aGlzLmhlYWx0aFJlZ2VuQmFzZSA9IGhlYWx0aFJlZ2VuQmFzZTtcclxuXHRcdHRoaXMuZW5lcmd5UmVnZW5CYXNlID0gZW5lcmd5UmVnZW5CYXNlO1xyXG5cdFx0dGhpcy5yYW5nZUJhc2UgPSByYW5nZUJhc2U7XHJcblx0XHR0aGlzLmNhbGNCb251c1N0YXRzKCk7XHJcblx0XHR0aGlzLnJlc3RvcmUoKTtcclxuXHRcdFxyXG5cdFx0dGhpcy5ob3N0aWxlID0gaG9zdGlsZTtcclxuXHRcdHRoaXMudGFyZ2V0ID0gbnVsbDtcclxuXHRcdHRoaXMuc2V0VGFzaygnd2FuZGVyaW5nJyk7XHJcblx0XHR0aGlzLm1vdmVUaW1lciA9IDA7XHJcblxyXG5cdFx0dGhpcy5nYW1lSWQgPSB1dGlsLmZpcnN0RW1wdHlJbmRleChnYW1lLmJvdHMpO1xyXG5cdFx0Z2FtZS5ib3RzW3RoaXMuZ2FtZUlkXSA9IHRoaXM7XHJcblx0fVxyXG5cclxuXHR1cGRhdGUoZGVsdGEpIHtcclxuXHRcdHN1cGVyLnVwZGF0ZShkZWx0YSk7IFx0Ly8gRGVmYXVsdCBBY3RvciBVcGRhdGVcclxuXHRcdGlmICh0aGlzLmlzRGVhZCkgcmV0dXJuO1xyXG5cclxuXHRcdHRoaXMubW92ZVRpbWVyKys7XHJcblx0XHRcclxuXHRcdC8vIEFJIElucHV0c1xyXG5cdFx0c3dpdGNoKHRoaXMudGFzaykge1xyXG5cdFx0XHRjYXNlICd3YW5kZXJpbmcnOlx0XHQvLyBNb3ZlIHJhbmRvbWx5XHJcblx0XHRcdFx0dGhpcy5tb3ZlKCk7XHJcblx0XHRcdFx0dGhpcy5waWNrVXAoKTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ2ZvbGxvd2luZyc6XHRcdC8vIE1vdmUgdG93YXJkcyB0YXJnZXRcclxuXHRcdFx0XHRpZiAodGhpcy50YXJnZXQpIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZVRvVGFyZ2V0KHRoaXMudGFyZ2V0LCBmYWxzZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly8gTm8gdGFyZ2V0XHJcblx0XHRcdFx0XHR0aGlzLnNldFRhc2soJ3dhbmRlcmluZycpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ2F0dGFja2luZyc6XHRcdC8vIE1vdmUgdG93YXJkcyB0YXJnZXQgYW5kIGF0dGFja1xyXG5cdFx0XHRcdGlmICh0aGlzLnRhcmdldCkge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlVG9UYXJnZXQodGhpcy50YXJnZXQsIHRydWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdC8vIE5vIHRhcmdldFxyXG5cdFx0XHRcdFx0dGhpcy5zZXRUYXNrKCd3YW5kZXJpbmcnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHQvLyBjYXNlICdpZGxlJzpcclxuXHRcdFx0ZGVmYXVsdDogXHRcdFx0XHRcdC8vIFN0YW5kIHN0aWxsXHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gdGhpcy5nZXRQYWNrKCk7XHJcblx0fVxyXG5cdFxyXG5cdGdldFBhY2soKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRnYW1lSWQ6IHRoaXMuZ2FtZUlkLFxyXG5cdFx0XHRuYW1lOiB0aGlzLm5hbWUsXHJcblx0XHRcdHNwcml0ZTogdGhpcy5zcHJpdGUsXHJcblx0XHRcdGRpcmVjdGlvbjogdGhpcy5kaXJlY3Rpb24sXHJcblx0XHRcdG1hcElkOiB0aGlzLm1hcElkLFxyXG5cdFx0XHR4OiB0aGlzLnN0YXJ0WCxcclxuXHRcdFx0eTogdGhpcy5zdGFydFksXHJcblx0XHRcdHo6IHRoaXMueixcclxuXHRcdFx0ZGVzdGluYXRpb25YOiB0aGlzLmRlc3RpbmF0aW9uWCxcclxuXHRcdFx0ZGVzdGluYXRpb25ZOiB0aGlzLmRlc3RpbmF0aW9uWSxcclxuXHRcdFx0bGVycDogdGhpcy5sZXJwLFxyXG5cdFx0XHRpc1J1bm5pbmc6IHRoaXMuaXNSdW5uaW5nLFxyXG5cdFx0XHRpc0F0dGFja2luZzogdGhpcy5pc0F0dGFja2luZyxcclxuXHRcdFx0aXNEZWFkOiBmYWxzZSxcclxuXHRcdFx0aXNWaXNpYmxlOiB0aGlzLmlzVmlzaWJsZVxyXG5cdFx0fTtcclxuXHR9XHJcblx0XHJcblx0Z2V0REJQYWNrKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0Ym90SWQ6IHRoaXMuYm90SWQsXHJcblx0XHRcdHRlbXBsYXRlSWQ6IHRoaXMudGVtcGxhdGVJZCxcclxuXHRcdFx0bWFwSWQ6IHRoaXMubWFwSWQsXHJcblx0XHRcdHg6IHRoaXMueCxcclxuXHRcdFx0eTogdGhpcy55LFxyXG5cdFx0XHRkaXJlY3Rpb246IHRoaXMuZGlyZWN0aW9uLFxyXG5cdFx0XHRuYW1lOiB0aGlzLm5hbWUsXHJcblx0XHRcdHNwcml0ZTogdGhpcy5zcHJpdGUsXHJcblx0XHRcdGhvc3RpbGU6IHRoaXMuaG9zdGlsZVxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdHJlbW92ZSgpIHtcclxuXHRcdGRlbGV0ZSBnYW1lLmJvdHNbdGhpcy5nYW1lSWRdO1xyXG5cdH1cclxuXHRcclxuXHRtb3ZlKGRpcmVjdGlvbikge1xyXG5cdFx0bGV0IG1vdmVUaW1lID0gMjQ7XHJcblx0XHRpZiAodGhpcy5pc1J1bm5pbmcpIG1vdmVUaW1lID0gMTc7XHJcblx0XHRpZiAodGhpcy5tb3ZlVGltZXIgPiBtb3ZlVGltZSAmJiB0aGlzLmF0dGFja1RpbWVyID09PSAwKSB7XHJcblx0XHRcdHN1cGVyLm1vdmUoZGlyZWN0aW9uKTtcclxuXHRcdFx0dGhpcy5tb3ZlVGltZXIgPSAwO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHR0YWtlRGFtYWdlKGRhbWFnZSwgYXR0YWNrZXIpIHtcclxuXHRcdGlmIChhdHRhY2tlciBpbnN0YW5jZW9mIEFjdG9yKSB0aGlzLnNldFRhc2soJ2F0dGFja2luZycsIGF0dGFja2VyKTtcclxuXHRcdHN1cGVyLnRha2VEYW1hZ2UoZGFtYWdlLCBhdHRhY2tlcik7XHJcblx0fVxyXG5cdFxyXG5cdHBpY2tVcCgpIHtcclxuXHRcdHN1cGVyLnBpY2tVcCgpO1xyXG5cdFx0dGhpcy5jaGVja0Jlc3RFcXVpcG1lbnQoKTtcclxuXHR9XHJcblxyXG5cdGdldEludmVudG9yeSgpIHtcclxuXHRcdGNvbnN0IGludmVudG9yeSA9IGdhbWUuaXRlbXMuZmlsdGVyKGl0ZW0gPT4ge1xyXG5cdFx0XHRyZXR1cm4gXCJcIitpdGVtLmJvdElkID09PSBcIlwiK3RoaXMuYm90SWQ7XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBpbnZlbnRvcnk7XHJcblx0fVxyXG5cclxuXHRzZXREZWFkKCkge1xyXG5cdFx0c3VwZXIuc2V0RGVhZCgpO1xyXG5cdFx0dGhpcy5yZW1vdmUoKTtcclxuXHR9XHJcblxyXG5cdC8vIElucHV0c1xyXG5cdHNldFRhc2sodGFzaywgdGFyZ2V0KSB7XHJcblx0XHRzd2l0Y2ggKHRhc2spIHtcclxuXHRcdFx0Y2FzZSAnd2FuZGVyaW5nJzpcclxuXHRcdFx0XHR0aGlzLmxhemluZXNzID0gNztcclxuXHRcdFx0XHR0aGlzLnRhcmdldCA9IG51bGw7XHJcblx0XHRcdFx0dGhpcy50YXNrID0gdGFzaztcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ2ZvbGxvd2luZyc6XHJcblx0XHRcdFx0aWYgKHRhcmdldCA9PT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0dGhpcy5zZXRUYXNrKCd3YW5kZXJpbmcnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLmxhemluZXNzID0gMDtcclxuXHRcdFx0XHRcdHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xyXG5cdFx0XHRcdFx0dGhpcy50YXNrID0gdGFzaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdhdHRhY2tpbmcnOlxyXG5cdFx0XHRcdGlmICh0YXJnZXQgPT09IG51bGwpIHtcclxuXHRcdFx0XHRcdHRoaXMuc2V0VGFzaygnd2FuZGVyaW5nJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5sYXppbmVzcyA9IDA7XHJcblx0XHRcdFx0XHR0aGlzLnRhcmdldCA9IHRhcmdldDtcclxuXHRcdFx0XHRcdHRoaXMudGFzayA9IHRhc2s7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0ZGVmYXVsdDpcdC8vaWRsaW5nXHJcblx0XHRcdFx0dGhpcy5sYXppbmVzcyA9IDc7XHJcblx0XHRcdFx0dGhpcy50YXJnZXQgPSBudWxsO1xyXG5cdFx0XHRcdHRoaXMudGFzayA9ICdpZGxlJztcclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGNoZWNrQmVzdEVxdWlwbWVudCgpIHtcclxuXHRcdGNvbnN0IGludmVudG9yeSA9IHRoaXMuZ2V0SW52ZW50b3J5KCk7XHJcblx0XHRjb25zdCBlcXVpcG1lbnQgPSBbXTtcclxuXHRcdGZvciAobGV0IHNsb3QgPSAwOyBzbG90IDwgY29uZmlnLkVRVUlQTUVOVF9TSVpFOyBzbG90KyspIHtcclxuXHRcdFx0ZXF1aXBtZW50LnB1c2goW10pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgaW52ZW50b3J5Lmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IGl0ZW0gPSBpbnZlbnRvcnlbaV07XHJcblx0XHRcdGZvciAobGV0IHNsb3QgPSAwOyBzbG90IDwgY29uZmlnLkVRVUlQTUVOVF9TSVpFOyBzbG90KyspIHtcclxuXHRcdFx0XHRpZiAoaXRlbS5lcXVpcHBlZFNsb3QgPT09IHNsb3QpIHtcclxuXHRcdFx0XHRcdGVxdWlwbWVudFtzbG90XS5wdXNoKGl0ZW0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChlcXVpcG1lbnRbMF0ubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRlcXVpcG1lbnRbMF0uc29ydCgoYSwgYikgPT4gYi5lcXVpcHBlZC5kYW1hZ2UgLSBhLmVxdWlwcGVkLmRhbWFnZSk7XHJcblx0XHRcdHRoaXMuZXF1aXBJdGVtKGVxdWlwbWVudFswXVswXSk7XHJcblx0XHR9XHJcblx0XHRpZiAoZXF1aXBtZW50WzFdLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0ZXF1aXBtZW50WzFdLnNvcnQoKGEsIGIpID0+IGIuZXF1aXBwZWQuZGVmZW5jZSAtIGEuZXF1aXBwZWQuZGVmZW5jZSk7XHJcblx0XHRcdHRoaXMuZXF1aXBJdGVtKGVxdWlwbWVudFsxXVswXSk7XHJcblx0XHR9XHJcblx0XHRpZiAoZXF1aXBtZW50WzJdLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0ZXF1aXBtZW50WzJdLnNvcnQoKGEsIGIpID0+IGIuZXF1aXBwZWQuZGVmZW5jZSAtIGEuZXF1aXBwZWQuZGVmZW5jZSk7XHJcblx0XHRcdHRoaXMuZXF1aXBJdGVtKGVxdWlwbWVudFsyXVswXSk7XHJcblx0XHR9XHJcblx0XHRpZiAoZXF1aXBtZW50WzNdLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0ZXF1aXBtZW50WzNdLnNvcnQoKGEsIGIpID0+IGIuZXF1aXBwZWQuZGVmZW5jZSAtIGEuZXF1aXBwZWQuZGVmZW5jZSk7XHJcblx0XHRcdHRoaXMuZXF1aXBJdGVtKGVxdWlwbWVudFszXVswXSk7XHJcblx0XHR9XHJcblx0XHRpZiAoZXF1aXBtZW50WzRdLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0ZXF1aXBtZW50WzRdLnNvcnQoKGEsIGIpID0+IGIuZXF1aXBwZWQuZGVmZW5jZSAtIGEuZXF1aXBwZWQuZGVmZW5jZSk7XHJcblx0XHRcdHRoaXMuZXF1aXBJdGVtKGVxdWlwbWVudFs0XVswXSk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbiIsImltcG9ydCBFbnRpdHkgZnJvbSAnLi9lbnRpdHkuanMnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuLi9nYW1lLmpzJztcclxuaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9jb25maWcuanMnO1xyXG5pbXBvcnQgdXRpbCBmcm9tICcuLi91dGlsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVmZmVjdCBleHRlbmRzIEVudGl0eSB7XHJcblx0Y29uc3RydWN0b3IobWFwSWQsIHgsIHksIHNwcml0ZSA9IDAsIGxvb3AgPSAwLCBzcGVlZCA9IDEyLCBtYXhGcmFtZSA9IDcsIHN0YXJ0RnJhbWUgPSAwKSB7XHJcblx0XHRzdXBlcihtYXBJZCwgeCwgeSwgdXRpbC5jbGFtcChzcHJpdGUsIDAsIGNvbmZpZy5NQVhfRUZGRUNUUyAtIDEpKTtcclxuXHRcdHRoaXMubWF4RnJhbWUgPSB1dGlsLmNsYW1wKG1heEZyYW1lLCAwLCA3KTtcclxuXHRcdHRoaXMuc3RhcnRGcmFtZSA9IHV0aWwuY2xhbXAoc3RhcnRGcmFtZSwgMCwgdGhpcy5tYXhGcmFtZSk7XHJcblx0XHR0aGlzLmN1cnJlbnRGcmFtZSA9IHRoaXMuc3RhcnRGcmFtZTtcclxuXHRcdFxyXG5cdFx0dGhpcy5sb29wID0gbG9vcDtcclxuXHRcdHRoaXMuc3BlZWQgPSBzcGVlZDtcclxuXHRcdHRoaXMudGltZXIgPSAwO1xyXG5cdFx0XHJcblx0XHR0aGlzLmdhbWVJZCA9IHV0aWwuZmlyc3RFbXB0eUluZGV4KGdhbWUuZWZmZWN0cyk7XHJcblx0XHRnYW1lLmVmZmVjdHNbdGhpcy5nYW1lSWRdID0gdGhpcztcclxuXHR9XHJcblx0XHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHR0aGlzLnRpbWVyICs9IGRlbHRhO1xyXG5cdFx0XHJcblx0XHRpZiAodGhpcy50aW1lciA+PSAxIC8gdGhpcy5zcGVlZCkge1xyXG5cdFx0XHR0aGlzLnRpbWVyID0gMDtcclxuXHRcdFx0dGhpcy5jdXJyZW50RnJhbWUrKztcclxuXHJcblx0XHRcdGlmICh0aGlzLmN1cnJlbnRGcmFtZSA+IHRoaXMubWF4RnJhbWUpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5sb29wIDwgMCkge1xyXG5cdFx0XHRcdFx0dGhpcy5jdXJyZW50RnJhbWUgPSB0aGlzLnN0YXJ0RnJhbWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2UgaWYgKHRoaXMubG9vcCA+IDApIHtcclxuXHRcdFx0XHRcdHRoaXMuY3VycmVudEZyYW1lID0gdGhpcy5zdGFydEZyYW1lO1xyXG5cdFx0XHRcdFx0dGhpcy5sb29wLS07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5jdXJyZW50RnJhbWUgPSB0aGlzLm1heEZyYW1lO1xyXG5cdFx0XHRcdFx0dGhpcy5yZW1vdmUoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGhpcy5nZXRQYWNrKCk7XHJcblx0fVxyXG5cdFxyXG5cdGdldFBhY2soKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRnYW1lSWQ6IHRoaXMuZ2FtZUlkLFxyXG5cdFx0XHRtYXBJZDogdGhpcy5tYXBJZCxcclxuXHRcdFx0eDogdGhpcy54LFxyXG5cdFx0XHR5OiB0aGlzLnksXHJcblx0XHRcdHNwcml0ZTogdGhpcy5zcHJpdGUsXHJcblx0XHRcdGN1cnJlbnRGcmFtZTogdGhpcy5jdXJyZW50RnJhbWVcclxuXHRcdH07XHJcblx0fVxyXG5cdFxyXG5cdHJlbW92ZSgpIHtcclxuXHRcdGRlbGV0ZSBnYW1lLmVmZmVjdHNbdGhpcy5nYW1lSWRdO1xyXG5cdH1cdFxyXG59XHJcbiIsImltcG9ydCBjb25maWcgZnJvbSAnLi4vY29uZmlnLmpzJztcclxuXHJcbi8vIEFuIEVudGl0eSBpcyBhbnkgb2JqZWN0IHdoaWNoIGNhbiBhcHBlYXIgb24gdGhlIG1hcFxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW50aXR5IHtcclxuXHRjb25zdHJ1Y3RvcihtYXBJZCwgeCwgeSwgc3ByaXRlID0gMSkge1xyXG5cdFx0dGhpcy5tYXBJZCA9IG1hcElkO1xyXG5cdFx0dGhpcy54ID0geDtcclxuXHRcdHRoaXMueSA9IHk7XHJcblx0XHRpZiAoc3ByaXRlIDwgMSkgc3ByaXRlID0gMTtcclxuXHRcdHRoaXMuc3ByaXRlID0gc3ByaXRlO1xyXG5cdFx0dGhpcy5pc1Zpc2libGUgPSB0cnVlO1xyXG5cdH1cclxufVxyXG4iLCJpbXBvcnQgZ2FtZSBmcm9tICcuLi9nYW1lLmpzJztcclxuaW1wb3J0IHV0aWwgZnJvbSAnLi4vdXRpbC5qcyc7XHJcbmltcG9ydCBFbnRpdHkgZnJvbSAnLi9lbnRpdHkuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSXRlbSBleHRlbmRzIEVudGl0eSB7XHJcblx0Y29uc3RydWN0b3IoZGF0YSkge1xyXG5cdFx0aWYgKCFkYXRhKSByZXR1cm47XHJcblxyXG5cdFx0bGV0IHsgX2lkLCBwbGF5ZXJJZCwgYm90SWQsIHNsb3QsIG1hcElkLCB4LCB5LCB0ZW1wbGF0ZSwgc3RhY2ssIHNwcml0ZSwgbmFtZSwgZGVzY3JpcHRpb24sIHJldXNhYmxlLCBjcmVhdGVkQnksIGNyZWF0ZWREYXRlLFxyXG5cdFx0XHRcdFx0cGFzc2l2ZURhbWFnZSwgcGFzc2l2ZURlZmVuY2UsIHBhc3NpdmVIZWFsdGhNYXgsIHBhc3NpdmVFbmVyZ3lNYXgsIHBhc3NpdmVIZWFsdGhSZWdlbiwgcGFzc2l2ZUVuZXJneVJlZ2VuLCBwYXNzaXZlUmFuZ2UsXHJcblx0XHRcdFx0XHRlcXVpcHBlZERhbWFnZSwgZXF1aXBwZWREZWZlbmNlLCBlcXVpcHBlZEhlYWx0aE1heCwgZXF1aXBwZWRFbmVyZ3lNYXgsIGVxdWlwcGVkSGVhbHRoUmVnZW4sIGVxdWlwcGVkRW5lcmd5UmVnZW4sIGVxdWlwcGVkUmFuZ2VcclxuXHRcdFx0XHR9ID0gZGF0YTtcclxuXHJcblx0XHRpZiAoX2lkID09IG51bGwpIF9pZCA9IGdhbWUucmVxdWVzdERCSWQoKTtcclxuXHRcdGlmIChwbGF5ZXJJZCA9PT0gdW5kZWZpbmVkKSBwbGF5ZXJJZCA9IG51bGw7XHJcblx0XHRpZiAoYm90SWQgPT09IHVuZGVmaW5lZCkgYm90SWQgPSBudWxsO1xyXG5cdFx0aWYgKHNsb3QgPT09IHVuZGVmaW5lZCkgc2xvdCA9IG51bGw7XHJcblx0XHRpZiAobWFwSWQgPT09IHVuZGVmaW5lZCkgbWFwSWQgPSBudWxsO1xyXG5cdFx0aWYgKHggPT09IHVuZGVmaW5lZCkgeCA9IG51bGw7XHJcblx0XHRpZiAoeSA9PT0gdW5kZWZpbmVkKSB5ID0gbnVsbDtcclxuXHRcdGlmIChjcmVhdGVkQnkgPT09IHVuZGVmaW5lZCkgY3JlYXRlZEJ5ID0gbnVsbDtcclxuXHRcdGlmIChjcmVhdGVkRGF0ZSA9PT0gdW5kZWZpbmVkKSBjcmVhdGVkRGF0ZSA9IG5ldyBEYXRlKCk7XHJcblxyXG5cdFx0aWYgKHNwcml0ZSA9PT0gdW5kZWZpbmVkKSBzcHJpdGUgPSB0ZW1wbGF0ZS5zcHJpdGU7XHJcblx0XHRpZiAobmFtZSA9PT0gdW5kZWZpbmVkKSBuYW1lID0gdGVtcGxhdGUubmFtZTtcclxuXHRcdGlmIChkZXNjcmlwdGlvbiA9PT0gdW5kZWZpbmVkKSBkZXNjcmlwdGlvbiA9IHRlbXBsYXRlLmRlc2NyaXB0aW9uO1xyXG5cdFx0aWYgKHJldXNhYmxlID09PSB1bmRlZmluZWQpIHJldXNhYmxlID0gdGVtcGxhdGUucmV1c2FibGU7XHJcblx0XHRpZiAocGFzc2l2ZURhbWFnZSA9PT0gdW5kZWZpbmVkKSBwYXNzaXZlRGFtYWdlID0gdGVtcGxhdGUucGFzc2l2ZURhbWFnZTtcclxuXHRcdGlmIChwYXNzaXZlRGVmZW5jZSA9PT0gdW5kZWZpbmVkKSBwYXNzaXZlRGVmZW5jZSA9IHRlbXBsYXRlLnBhc3NpdmVEZWZlbmNlO1xyXG5cdFx0aWYgKHBhc3NpdmVIZWFsdGhNYXggPT09IHVuZGVmaW5lZCkgcGFzc2l2ZUhlYWx0aE1heCA9IHRlbXBsYXRlLnBhc3NpdmVIZWFsdGhNYXg7XHJcblx0XHRpZiAocGFzc2l2ZUVuZXJneU1heCA9PT0gdW5kZWZpbmVkKSBwYXNzaXZlRW5lcmd5TWF4ID0gdGVtcGxhdGUucGFzc2l2ZUVuZXJneU1heDtcclxuXHRcdGlmIChwYXNzaXZlSGVhbHRoUmVnZW4gPT09IHVuZGVmaW5lZCkgcGFzc2l2ZUhlYWx0aFJlZ2VuID0gdGVtcGxhdGUucGFzc2l2ZUhlYWx0aFJlZ2VuO1xyXG5cdFx0aWYgKHBhc3NpdmVFbmVyZ3lSZWdlbiA9PT0gdW5kZWZpbmVkKSBwYXNzaXZlRW5lcmd5UmVnZW4gPSB0ZW1wbGF0ZS5wYXNzaXZlRW5lcmd5UmVnZW47XHJcblx0XHRpZiAocGFzc2l2ZVJhbmdlID09PSB1bmRlZmluZWQpIHBhc3NpdmVSYW5nZSA9IHRlbXBsYXRlLnBhc3NpdmVSYW5nZTtcclxuXHRcdGlmIChlcXVpcHBlZERhbWFnZSA9PT0gdW5kZWZpbmVkKSBlcXVpcHBlZERhbWFnZSA9IHRlbXBsYXRlLmVxdWlwcGVkRGFtYWdlO1xyXG5cdFx0aWYgKGVxdWlwcGVkRGVmZW5jZSA9PT0gdW5kZWZpbmVkKSBlcXVpcHBlZERlZmVuY2UgPSB0ZW1wbGF0ZS5lcXVpcHBlZERlZmVuY2U7XHJcblx0XHRpZiAoZXF1aXBwZWRIZWFsdGhNYXggPT09IHVuZGVmaW5lZCkgZXF1aXBwZWRIZWFsdGhNYXggPSB0ZW1wbGF0ZS5lcXVpcHBlZEhlYWx0aE1heDtcclxuXHRcdGlmIChlcXVpcHBlZEVuZXJneU1heCA9PT0gdW5kZWZpbmVkKSBlcXVpcHBlZEVuZXJneU1heCA9IHRlbXBsYXRlLmVxdWlwcGVkRW5lcmd5TWF4O1xyXG5cdFx0aWYgKGVxdWlwcGVkSGVhbHRoUmVnZW4gPT09IHVuZGVmaW5lZCkgZXF1aXBwZWRIZWFsdGhSZWdlbiA9IHRlbXBsYXRlLmVxdWlwcGVkSGVhbHRoUmVnZW47XHJcblx0XHRpZiAoZXF1aXBwZWRFbmVyZ3lSZWdlbiA9PT0gdW5kZWZpbmVkKSBlcXVpcHBlZEVuZXJneVJlZ2VuID0gdGVtcGxhdGUuZXF1aXBwZWRFbmVyZ3lSZWdlbjtcclxuXHRcdGlmIChlcXVpcHBlZFJhbmdlID09PSB1bmRlZmluZWQpIGVxdWlwcGVkUmFuZ2UgPSB0ZW1wbGF0ZS5lcXVpcHBlZFJhbmdlO1xyXG5cclxuXHRcdHN1cGVyKG1hcElkLCB4LCB5LCBzcHJpdGUpO1xyXG5cdFx0dGhpcy56ID0gLTEwO1xyXG5cdFx0dGhpcy5pdGVtSWQgPSBfaWQ7XHJcblx0XHR0aGlzLnBsYXllcklkID0gcGxheWVySWQ7XHJcblx0XHR0aGlzLmJvdElkID0gYm90SWQ7XHJcblx0XHR0aGlzLnNsb3QgPSBzbG90O1xyXG5cdFx0XHJcblx0XHR0aGlzLnRlbXBsYXRlSWQgPSB0ZW1wbGF0ZS5faWQ7XHJcblx0XHR0aGlzLm5hbWUgPSBuYW1lO1xyXG5cdFx0dGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xyXG5cdFx0dGhpcy5yZXVzYWJsZSA9IHJldXNhYmxlO1xyXG5cclxuXHRcdHRoaXMudHlwZSA9IHRlbXBsYXRlLnR5cGUubmFtZTtcclxuXHRcdHRoaXMuc3RhY2thYmxlID0gdGVtcGxhdGUudHlwZS5zdGFja2FibGU7XHJcblx0XHR0aGlzLmVxdWlwcGVkU2xvdCA9IHRlbXBsYXRlLnR5cGUuZXF1aXBwZWRTbG90O1xyXG5cdFx0XHJcblx0XHR0aGlzLnBhc3NpdmUgPSB7XHJcblx0XHRcdGRhbWFnZTogcGFzc2l2ZURhbWFnZSxcclxuXHRcdFx0ZGVmZW5jZTogcGFzc2l2ZURlZmVuY2UsXHJcblx0XHRcdGhlYWx0aE1heDogcGFzc2l2ZUhlYWx0aE1heCxcclxuXHRcdFx0ZW5lcmd5TWF4OiBwYXNzaXZlRW5lcmd5TWF4LFxyXG5cdFx0XHRoZWFsdGhSZWdlbjogcGFzc2l2ZUhlYWx0aFJlZ2VuLFxyXG5cdFx0XHRlbmVyZ3lSZWdlbjogcGFzc2l2ZUVuZXJneVJlZ2VuLFxyXG5cdFx0XHRyYW5nZTogcGFzc2l2ZVJhbmdlXHJcblx0XHR9O1xyXG5cdFx0dGhpcy5lcXVpcHBlZCA9IHtcclxuXHRcdFx0ZGFtYWdlOiBlcXVpcHBlZERhbWFnZSxcclxuXHRcdFx0ZGVmZW5jZTogZXF1aXBwZWREZWZlbmNlLFxyXG5cdFx0XHRoZWFsdGhNYXg6IGVxdWlwcGVkSGVhbHRoTWF4LFxyXG5cdFx0XHRlbmVyZ3lNYXg6IGVxdWlwcGVkRW5lcmd5TWF4LFxyXG5cdFx0XHRoZWFsdGhSZWdlbjogZXF1aXBwZWRIZWFsdGhSZWdlbixcclxuXHRcdFx0ZW5lcmd5UmVnZW46IGVxdWlwcGVkRW5lcmd5UmVnZW4sXHJcblx0XHRcdHJhbmdlOiBlcXVpcHBlZFJhbmdlXHJcblx0XHR9O1xyXG5cdFx0XHJcblx0XHRpZiAodGhpcy5zdGFja2FibGUpIHtcclxuXHRcdFx0aWYgKHN0YWNrIDwgMSkgc3RhY2sgPSAxO1xyXG5cdFx0XHR0aGlzLnN0YWNrID0gc3RhY2s7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0dGhpcy5zdGFjayA9IDA7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5nYW1lSWQgPSB1dGlsLmZpcnN0RW1wdHlJbmRleChnYW1lLml0ZW1zKTtcclxuXHRcdGdhbWUuaXRlbXNbdGhpcy5nYW1lSWRdID0gdGhpcztcclxuXHR9XHJcblxyXG5cdHVwZGF0ZShkZWx0YSkge1xyXG5cdFx0cmV0dXJuIHRoaXMuZ2V0UGFjaygpO1xyXG5cdH1cclxuXHJcblx0Z2V0REJQYWNrKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0aXRlbUlkOiB0aGlzLml0ZW1JZCxcclxuXHRcdFx0cGxheWVySWQ6IHRoaXMucGxheWVySWQsXHJcblx0XHRcdGJvdElkOiB0aGlzLmJvdElkLFxyXG5cdFx0XHRzbG90OiB0aGlzLnNsb3QsXHJcblx0XHRcdG1hcElkOiB0aGlzLm1hcElkLFxyXG5cdFx0XHR4OiB0aGlzLngsXHJcblx0XHRcdHk6IHRoaXMueSxcclxuXHRcdFx0Y3JlYXRlZEJ5OiB0aGlzLmNyZWF0ZWRCeSxcclxuXHRcdFx0Y3JlYXRlZERhdGU6IHRoaXMuY3JlYXRlZERhdGUsXHJcblx0XHRcdHRlbXBsYXRlSWQ6IHRoaXMudGVtcGxhdGVJZCxcclxuXHRcdFx0bmFtZTogdGhpcy5uYW1lLFxyXG5cdFx0XHRkZXNjcmlwdGlvbjogdGhpcy5kZXNjcmlwdGlvbixcclxuXHRcdFx0c3ByaXRlOiB0aGlzLnNwcml0ZSxcclxuXHRcdFx0cmV1c2FibGU6IHRoaXMucmV1c2FibGUsXHJcblx0XHRcdHBhc3NpdmVEYW1hZ2U6IHRoaXMucGFzc2l2ZS5kYW1hZ2UsXHJcblx0XHRcdHBhc3NpdmVEZWZlbmNlOiB0aGlzLnBhc3NpdmUuZGVmZW5jZSxcclxuXHRcdFx0cGFzc2l2ZUhlYWx0aE1heDogdGhpcy5wYXNzaXZlLmhlYWx0aE1heCxcclxuXHRcdFx0cGFzc2l2ZUVuZXJneU1heDogdGhpcy5wYXNzaXZlLmVuZXJneU1heCxcclxuXHRcdFx0cGFzc2l2ZVJhbmdlOiB0aGlzLnBhc3NpdmUucmFuZ2UsXHJcblx0XHRcdGVxdWlwcGVkRGFtYWdlOiB0aGlzLmVxdWlwcGVkLmRhbWFnZSxcclxuXHRcdFx0ZXF1aXBwZWREZWZlbmNlOiB0aGlzLmVxdWlwcGVkLmRlZmVuY2UsXHJcblx0XHRcdGVxdWlwcGVkSGVhbHRoTWF4OiB0aGlzLmVxdWlwcGVkLmhlYWx0aE1heCxcclxuXHRcdFx0ZXF1aXBwZWRFbmVyZ3lNYXg6IHRoaXMuZXF1aXBwZWQuZW5lcmd5TWF4LFxyXG5cdFx0XHRlcXVpcHBlZFJhbmdlOiB0aGlzLmVxdWlwcGVkLnJhbmdlLFxyXG5cdFx0XHRzdGFjazogdGhpcy5zdGFjayxcclxuXHRcdFx0aXNWaXNpYmxlOiB0aGlzLmlzVmlzaWJsZVxyXG5cdFx0fTtcclxuXHR9XHJcblx0XHJcblx0Z2V0UGFjaygpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGdhbWVJZDogdGhpcy5nYW1lSWQsXHJcblx0XHRcdHBsYXllcklkOiB0aGlzLnBsYXllcklkLFxyXG5cdFx0XHRib3RJZDogdGhpcy5ib3RJZCxcclxuXHRcdFx0c2xvdDogdGhpcy5zbG90LFxyXG5cdFx0XHRtYXBJZDogdGhpcy5tYXBJZCxcclxuXHRcdFx0eDogdGhpcy54LFxyXG5cdFx0XHR5OiB0aGlzLnksXHJcblx0XHRcdHo6IHRoaXMueixcclxuXHRcdFx0bmFtZTogdGhpcy5uYW1lLFxyXG5cdFx0XHRkZXNjcmlwdGlvbjogdGhpcy5kZXNjcmlwdGlvbixcclxuXHRcdFx0c3ByaXRlOiB0aGlzLnNwcml0ZSxcclxuXHRcdFx0dHlwZTogdGhpcy50eXBlLFxyXG5cdFx0XHRyZXVzYWJsZTogdGhpcy5yZXVzYWJsZSxcclxuXHRcdFx0cGFzc2l2ZTogdGhpcy5wYXNzaXZlLFxyXG5cdFx0XHRlcXVpcHBlZDogdGhpcy5lcXVpcHBlZCxcclxuXHRcdFx0c3RhY2s6IHRoaXMuc3RhY2ssXHJcblx0XHRcdGlzVmlzaWJsZTogdGhpcy5pc1Zpc2libGVcclxuXHRcdH07XHJcblx0fVxyXG5cdFxyXG5cdHJlbW92ZSgpIHtcclxuXHRcdGRlbGV0ZSBnYW1lLml0ZW1zW3RoaXMuZ2FtZUlkXTtcclxuXHR9XHJcblxyXG5cdHJlbW92ZU9uZSgpIHtcclxuXHRcdGlmICh0aGlzLnN0YWNrID4gMSkge1xyXG5cdFx0XHR0aGlzLnN0YWNrLS07XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0dGhpcy5yZW1vdmUoKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdG1vdmVUb0ludmVudG9yeShwbGF5ZXJJZCwgYm90SWQsIHNsb3QpIHtcclxuXHRcdHRoaXMucGxheWVySWQgPSBwbGF5ZXJJZDtcclxuXHRcdHRoaXMuYm90SWQgPSBib3RJZDtcclxuXHRcdHRoaXMuc2xvdCA9IHNsb3Q7XHJcblx0XHR0aGlzLm1hcElkID0gbnVsbDtcclxuXHRcdHRoaXMueCA9IG51bGw7XHJcblx0XHR0aGlzLnkgPSBudWxsO1xyXG5cdFx0dGhpcy56ID0gbnVsbDtcclxuXHR9XHJcblxyXG5cdG1vdmVUb01hcChtYXBJZCwgeCwgeSkge1xyXG5cdFx0dGhpcy5tYXBJZCA9IG1hcElkO1xyXG5cdFx0dGhpcy54ID0geDtcclxuXHRcdHRoaXMueSA9IHk7XHJcblx0XHR0aGlzLnogPSB0aGlzLmdldFpQb3NpdGlvbihtYXBJZCwgeCwgeSk7XHJcblx0XHR0aGlzLnBsYXllcklkID0gbnVsbDtcclxuXHRcdHRoaXMuYm90SWQgPSBudWxsO1xyXG5cdFx0dGhpcy5zbG90ID0gbnVsbDtcclxuXHR9XHJcblx0XHJcblx0Z2V0WlBvc2l0aW9uKG1hcElkLCB4LCB5KSB7XHJcblx0XHRyZXR1cm4gLTEwO1xyXG5cdH1cclxuXHJcblx0aXNFcXVpcG1lbnQoKSB7XHJcblx0XHRpZiAodGhpcy5lcXVpcHBlZFNsb3QgPj0gMCkge1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbiIsImltcG9ydCBjb25maWcgZnJvbSAnLi4vY29uZmlnLmpzJztcclxuaW1wb3J0IHV0aWwgZnJvbSAnLi4vdXRpbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXAge1xyXG5cdGNvbnN0cnVjdG9yKG1hcElkLCBkYXRhID0ge30pIHtcclxuXHRcdHRoaXMubWFwSWQgPSBtYXBJZDtcclxuXHJcblx0XHRpZiAoZGF0YS5uYW1lID09IG51bGwpIGRhdGEubmFtZSA9IFwiQmxhbmsgTWFwXCI7XHJcblx0XHRpZiAoZGF0YS5kcm9wQ2hhbmNlID09IG51bGwpIGRhdGEuZHJvcENoYW5jZSA9IDEwMDtcclxuXHRcdGlmIChkYXRhLmRyb3BBbW91bnRFUSA9PSBudWxsKSBkYXRhLmRyb3BBbW91bnRFUSA9IDE7XHJcblx0XHRpZiAoIWRhdGEudGlsZXMpIGRhdGEudGlsZXMgPSB1dGlsLmNyZWF0ZTNkQXJyYXkoY29uZmlnLk1BUF9DT0xVTU5TLCBjb25maWcuTUFQX1JPV1MsIGNvbmZpZy5NQVBfTEFZRVJTLCAwKTtcclxuXHRcdGlmICghZGF0YS5pc1dhbGwpIGRhdGEuaXNXYWxsID0gdXRpbC5jcmVhdGUyZEFycmF5KGNvbmZpZy5NQVBfQ09MVU1OUywgY29uZmlnLk1BUF9ST1dTLCBmYWxzZSk7XHJcblx0XHRpZiAoIWRhdGEuaXNIb3N0aWxlKSBkYXRhLmlzSG9zdGlsZSA9IHV0aWwuY3JlYXRlMmRBcnJheShjb25maWcuTUFQX0NPTFVNTlMsIGNvbmZpZy5NQVBfUk9XUywgZmFsc2UpO1xyXG5cdFx0aWYgKCFkYXRhLmRhbWFnZSkgZGF0YS5kYW1hZ2UgPSB1dGlsLmNyZWF0ZTJkQXJyYXkoY29uZmlnLk1BUF9DT0xVTU5TLCBjb25maWcuTUFQX1JPV1MsIG51bGwpO1xyXG5cdFx0aWYgKCFkYXRhLndhcnBNYXApIGRhdGEud2FycE1hcCA9IHV0aWwuY3JlYXRlMmRBcnJheShjb25maWcuTUFQX0NPTFVNTlMsIGNvbmZpZy5NQVBfUk9XUywgbnVsbCk7XHJcblx0XHRpZiAoIWRhdGEud2FycFgpIGRhdGEud2FycFggPSB1dGlsLmNyZWF0ZTJkQXJyYXkoY29uZmlnLk1BUF9DT0xVTU5TLCBjb25maWcuTUFQX1JPV1MsIG51bGwpO1xyXG5cdFx0aWYgKCFkYXRhLndhcnBZKSBkYXRhLndhcnBZID0gdXRpbC5jcmVhdGUyZEFycmF5KGNvbmZpZy5NQVBfQ09MVU1OUywgY29uZmlnLk1BUF9ST1dTLCBudWxsKTtcclxuXHRcdGlmICghZGF0YS5leGl0TGVmdCkgZGF0YS5leGl0TGVmdCA9IDA7XHJcblx0XHRpZiAoIWRhdGEuZXhpdFJpZ2h0KSBkYXRhLmV4aXRSaWdodCA9IDA7XHJcblx0XHRpZiAoIWRhdGEuZXhpdFVwKSBkYXRhLmV4aXRVcCA9IDA7XHJcblx0XHRpZiAoIWRhdGEuZXhpdERvd24pIGRhdGEuZXhpdERvd24gPSAwO1xyXG5cclxuXHRcdHRoaXMubmFtZSA9IGRhdGEubmFtZTtcclxuXHRcdHRoaXMuZHJvcENoYW5jZSA9IHV0aWwuY2xhbXAoZGF0YS5kcm9wQ2hhbmNlLCAwLCAxMDApO1xyXG5cdFx0dGhpcy5kcm9wQW1vdW50RVEgPSB1dGlsLmNsYW1wKGRhdGEuZHJvcEFtb3VudEVRLCAwLCBjb25maWcuRVFVSVBNRU5UX1NJWkUpO1xyXG5cdFx0Ly90aGlzLmRyb3BDaGFuY2UgPSAwID0gMCUgY2hhbmNlIHRvIGRyb3AgaXRlbXMgaW4gaW52ZW50b3J5IChkcm9wIG5vdGhpbmcpLCAxMDAgPSAxMDAlIGNoYW5jZSB0byBkcm9wIChkcm9wIGV2ZXJ5dGhpbmcpXHJcblx0XHQvL3RoaXMuZHJvcEFtb3VudEVRID0gbnVtYmVyIG9mIGVxdWlwcGVkIGl0ZW1zIHRoZSBwbGF5ZXIgd2lsbCBkcm9wIG9uIGRlYXRoLiBkcm9wRVEgPSBFUVVJUE1FTlRfU0laRSA9IGRyb3AgYWxsIGVxdWlwbWVudFxyXG5cdFx0dGhpcy50aWxlcyA9IGRhdGEudGlsZXM7XHJcblx0XHR0aGlzLmlzV2FsbCA9IGRhdGEuaXNXYWxsO1xyXG5cdFx0dGhpcy5pc0hvc3RpbGUgPSBkYXRhLmlzSG9zdGlsZTtcclxuXHRcdHRoaXMuZGFtYWdlID0gZGF0YS5kYW1hZ2U7XHJcblx0XHR0aGlzLndhcnBNYXAgPSBkYXRhLndhcnBNYXA7XHJcblx0XHR0aGlzLndhcnBYID0gZGF0YS53YXJwWDtcclxuXHRcdHRoaXMud2FycFkgPSBkYXRhLndhcnBZO1xyXG5cdFx0dGhpcy5leGl0TGVmdCA9IGRhdGEuZXhpdExlZnQ7XHJcblx0XHR0aGlzLmV4aXRSaWdodCA9IGRhdGEuZXhpdFJpZ2h0O1xyXG5cdFx0dGhpcy5leGl0VXAgPSBkYXRhLmV4aXRVcDtcclxuXHRcdHRoaXMuZXhpdERvd24gPSBkYXRhLmV4aXREb3duO1xyXG5cdH1cclxuXHRcclxuXHR1cGxvYWQoZGF0YSkge1xyXG5cdFx0aWYgKGRhdGEubmFtZSAhPSBudWxsKSB0aGlzLm5hbWUgPSBkYXRhLm5hbWU7XHJcblx0XHRpZiAoZGF0YS5kcm9wQ2hhbmNlICE9IG51bGwpIHRoaXMuZHJvcENoYW5jZSA9IGRhdGEuZHJvcENoYW5jZTtcclxuXHRcdGlmIChkYXRhLmRyb3BBbW91bnRFUSAhPSBudWxsKSB0aGlzLmRyb3BBbW91bnRFUSA9IGRhdGEuZHJvcEFtb3VudEVRO1xyXG5cdFx0aWYgKGRhdGEudGlsZXMpIHRoaXMudGlsZXMgPSBkYXRhLnRpbGVzO1xyXG5cdFx0aWYgKGRhdGEuaXNXYWxsKSB0aGlzLmlzV2FsbCA9IGRhdGEuaXNXYWxsO1xyXG5cdFx0aWYgKGRhdGEuaXNIb3N0aWxlKSB0aGlzLmlzSG9zdGlsZSA9IGRhdGEuaXNIb3N0aWxlO1xyXG5cdFx0aWYgKGRhdGEuZGFtYWdlKSB0aGlzLmRhbWFnZSA9IGRhdGEuZGFtYWdlO1xyXG5cdFx0aWYgKGRhdGEud2FycE1hcCkgdGhpcy53YXJwTWFwID0gZGF0YS53YXJwTWFwO1xyXG5cdFx0aWYgKGRhdGEud2FycFgpIHRoaXMud2FycFggPSBkYXRhLndhcnBYO1xyXG5cdFx0aWYgKGRhdGEud2FycFkpIHRoaXMud2FycFkgPSBkYXRhLndhcnBZO1xyXG5cdFx0aWYgKGRhdGEuZXhpdExlZnQpIHRoaXMud2FycFkgPSBkYXRhLmV4aXRMZWZ0O1xyXG5cdFx0aWYgKGRhdGEuZXhpdFJpZ2h0KSB0aGlzLndhcnBZID0gZGF0YS5leGl0UmlnaHQ7XHJcblx0XHRpZiAoZGF0YS5leGl0VXApIHRoaXMud2FycFkgPSBkYXRhLmV4aXRVcDtcclxuXHRcdGlmIChkYXRhLmV4aXREb3duKSB0aGlzLndhcnBZID0gZGF0YS5leGl0RG93bjtcclxuXHR9XHJcblxyXG5cdGdldFBhY2soKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRtYXBJZDogdGhpcy5tYXBJZCxcclxuXHRcdFx0bmFtZTogdGhpcy5uYW1lLFxyXG5cdFx0XHRkcm9wQ2hhbmNlOiB0aGlzLmRyb3BDaGFuY2UsXHJcblx0XHRcdGRyb3BBbW91bnRFUTogdGhpcy5kcm9wQW1vdW50RVEsXHJcblx0XHRcdHRpbGVzOiB0aGlzLnRpbGVzLFxyXG5cdFx0XHRpc1dhbGw6IHRoaXMuaXNXYWxsLFxyXG5cdFx0XHRpc0hvc3RpbGU6IHRoaXMuaXNIb3N0aWxlLFxyXG5cdFx0XHRkYW1hZ2U6IHRoaXMuZGFtYWdlLFxyXG5cdFx0XHR3YXJwTWFwOiB0aGlzLndhcnBNYXAsXHJcblx0XHRcdHdhcnBYOiB0aGlzLndhcnBYLFxyXG5cdFx0XHR3YXJwWTogdGhpcy53YXJwWSxcclxuXHRcdFx0ZXhpdExlZnQ6IHRoaXMuZXhpdExlZnQsXHJcblx0XHRcdGV4aXRSaWdodDogdGhpcy5leGl0UmlnaHQsXHJcblx0XHRcdGV4aXRVcDogdGhpcy5leGl0VXAsXHJcblx0XHRcdGV4aXREb3duOiB0aGlzLmV4aXREb3duLFxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdGdldFVwZGF0ZVBhY2soKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRtYXBJZDogdGhpcy5tYXBJZCxcclxuXHRcdFx0bmFtZTogdGhpcy5uYW1lLFxyXG5cdFx0XHR0aWxlczogdGhpcy50aWxlc1xyXG5cdFx0fTtcclxuXHR9XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWVzc2FnZSB7XHJcblx0Y29uc3RydWN0b3Ioc2VuZGVySWQsIG1lc3NhZ2UsIHR5cGUsIG1hcElkLCBpZCwgY29sb3VyKSB7XHJcblx0XHR0aGlzLnNlbmRlcklkID0gc2VuZGVySWQ7IC8vIG51bGwgPSBzZXJ2ZXJcclxuXHRcdHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XHJcblx0XHR0aGlzLnR5cGUgPSB0eXBlO1xyXG5cdFx0dGhpcy5tYXBJZCA9IG1hcElkO1xyXG5cdFx0dGhpcy5pZCA9IGlkO1xyXG5cdFx0dGhpcy5jb2xvdXIgPSBjb2xvdXI7XHJcblx0fVxyXG59IiwiaW1wb3J0IGdhbWUgZnJvbSAnLi4vZ2FtZS5qcyc7XHJcbmltcG9ydCBjb25maWcgZnJvbSAnLi4vY29uZmlnLmpzJztcclxuaW1wb3J0IHV0aWwgZnJvbSAnLi4vdXRpbC5qcyc7XHJcbmltcG9ydCBBY3RvciBmcm9tICcuL2FjdG9yLmpzJztcclxuXHJcbi8vIEEgUGxheWVyIGlzIGFuIGltbW9ydGFsIEFjdG9yIHdoaWNoIHRha2VzIGlucHV0IGZyb20gYSBjbGllbnRcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXllciBleHRlbmRzIEFjdG9yIHtcclxuXHRjb25zdHJ1Y3Rvcihzb2NrZXQsIGRhdGEpIHtcclxuXHRcdGlmIChkYXRhLnNwcml0ZSA9PSBudWxsKSBkYXRhLnNwcml0ZSA9IGRhdGEudGVtcGxhdGUuc3ByaXRlO1xyXG5cclxuXHRcdHN1cGVyKGRhdGEubWFwSWQsIGRhdGEueCwgZGF0YS55LCBkYXRhLmRpcmVjdGlvbiwgZGF0YS5uYW1lLCBkYXRhLnNwcml0ZSk7XHJcblx0XHR0aGlzLnBsYXllcklkID0gZGF0YS5faWQ7XHJcblx0XHR0aGlzLnNvY2tldCA9IHNvY2tldDtcclxuXHRcdHRoaXMuYWNjb3VudElkID0gZGF0YS5hY2NvdW50O1xyXG5cdFx0dGhpcy5hZG1pbkFjY2VzcyA9IGRhdGEuYWRtaW5BY2Nlc3M7XHJcblxyXG5cdFx0dGhpcy5sZXZlbCA9IGRhdGEubGV2ZWw7XHJcblx0XHR0aGlzLmV4cGVyaWVuY2UgPSBkYXRhLmV4cGVyaWVuY2U7XHJcblx0XHR0aGlzLnRlbXBsYXRlSWQgPSBkYXRhLnRlbXBsYXRlLl9pZDtcclxuXHRcdHRoaXMudGVtcGxhdGUgPSBkYXRhLnRlbXBsYXRlLm5hbWU7XHJcblx0XHR0aGlzLmNhbGNCYXNlU3RhdHMoZGF0YS50ZW1wbGF0ZSk7XHJcblx0XHR0aGlzLmNhbGNCb251c1N0YXRzKCk7XHJcblx0XHR0aGlzLnJlc3RvcmUoKTtcclxuXHJcblx0XHR0aGlzLmlzRGVhZCA9IGZhbHNlO1xyXG5cdFx0dGhpcy5kZWF0aHMgPSAwO1xyXG5cdFx0dGhpcy5yZXNwYXduVGltZXIgPSAwO1xyXG5cdFx0dGhpcy5yZXNwYXduU3BlZWQgPSAxMDtcclxuXHRcdHRoaXMucmVzcGF3bk1hcCA9IGRhdGEubWFwSWQ7XHJcblx0XHR0aGlzLnJlc3Bhd25YID0gZGF0YS54O1xyXG5cdFx0dGhpcy5yZXNwYXduWSA9IGRhdGEueTtcclxuXHJcblx0XHR0aGlzLmlucHV0ID0ge1xyXG5cdFx0XHRkaXJlY3Rpb246IG51bGwsXHJcblx0XHRcdHJ1bjogZmFsc2UsXHJcblx0XHRcdHBpY2t1cDogZmFsc2UsXHJcblx0XHRcdGF0dGFjazogZmFsc2VcclxuXHRcdH07XHJcblxyXG5cdFx0dGhpcy5nYW1lSWQgPSB1dGlsLmZpcnN0RW1wdHlJbmRleChnYW1lLnBsYXllcnMpO1xyXG5cdFx0Z2FtZS5wbGF5ZXJzW3RoaXMuZ2FtZUlkXSA9IHRoaXM7XHJcblx0fVxyXG5cclxuXHR1cGRhdGUoZGVsdGEpIHtcclxuXHRcdHN1cGVyLnVwZGF0ZShkZWx0YSk7XHRcdC8vIERlZmF1bHQgQWN0b3IgVXBkYXRlXHJcblx0XHRpZiAodGhpcy5pc0RlYWQpIHtcclxuXHRcdFx0Ly8gUmVzcGF3bmluZ1xyXG5cdFx0XHR0aGlzLnJlc3Bhd25UaW1lciArPSBkZWx0YTtcclxuXHRcdFx0aWYgKHRoaXMucmVzcGF3blRpbWVyID49IHRoaXMucmVzcGF3blNwZWVkKSB0aGlzLnJlc3Bhd24oKTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHQvLyBDaGVjayBmb3IgQXR0YWNrIElucHV0XHJcblx0XHRcdGlmICh0aGlzLmlucHV0LmF0dGFjayAmJiB0aGlzLmF0dGFja1RpbWVyID09PSAwKSB0aGlzLmF0dGFjaygpO1xyXG5cdFx0XHRcclxuXHRcdFx0Ly8gQ2hlY2sgZm9yIE1vdmVtZW50IElucHV0XHJcblx0XHRcdGlmICghdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdHRoaXMuaXNSdW5uaW5nID0gZmFsc2U7XHJcblx0XHRcdFx0aWYgKHRoaXMuaW5wdXQuZGlyZWN0aW9uKSB7XHJcblx0XHRcdFx0XHQvLyBDaGVjayBmb3IgUnVuIElucHV0XHJcblx0XHRcdFx0XHRpZiAodGhpcy5pbnB1dC5ydW4gJiYgdGhpcy5lbmVyZ3kgPiAwKSB0aGlzLmlzUnVubmluZyA9IHRydWU7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUodGhpcy5pbnB1dC5kaXJlY3Rpb24pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gdGhpcy5nZXRHYW1lUGFjaygpO1xyXG5cdH1cclxuXHRcclxuXHRnZXRHYW1lUGFjaygpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGdhbWVJZDogdGhpcy5nYW1lSWQsXHJcblx0XHRcdG5hbWU6IHRoaXMubmFtZSxcclxuXHRcdFx0ZGVzY3JpcHRpb246IHRoaXMuZGVzY3JpcHRpb24sXHJcblx0XHRcdHNwcml0ZTogdGhpcy5zcHJpdGUsXHJcblx0XHRcdGRpcmVjdGlvbjogdGhpcy5kaXJlY3Rpb24sXHJcblx0XHRcdG1hcElkOiB0aGlzLm1hcElkLFxyXG5cdFx0XHR4OiB0aGlzLnN0YXJ0WCxcclxuXHRcdFx0eTogdGhpcy5zdGFydFksXHJcblx0XHRcdHo6IHRoaXMueixcclxuXHRcdFx0ZGVzdGluYXRpb25YOiB0aGlzLmRlc3RpbmF0aW9uWCxcclxuXHRcdFx0ZGVzdGluYXRpb25ZOiB0aGlzLmRlc3RpbmF0aW9uWSxcclxuXHRcdFx0bGVycDogdGhpcy5sZXJwLFxyXG5cdFx0XHRpc1J1bm5pbmc6IHRoaXMuaXNSdW5uaW5nLFxyXG5cdFx0XHRpc0F0dGFja2luZzogdGhpcy5pc0F0dGFja2luZyxcclxuXHRcdFx0aXNEZWFkOiB0aGlzLmlzRGVhZCxcclxuXHRcdFx0aXNWaXNpYmxlOiB0aGlzLmlzVmlzaWJsZVxyXG5cdFx0fTtcclxuXHR9XHJcblx0XHJcblx0Z2V0VUlQYWNrKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0bGV2ZWw6IHRoaXMubGV2ZWwsXHJcblx0XHRcdGV4cGVyaWVuY2U6IHRoaXMuZXhwZXJpZW5jZSxcclxuXHRcdFx0aGVhbHRoOiB0aGlzLmhlYWx0aCxcclxuXHRcdFx0aGVhbHRoTWF4OiB0aGlzLmhlYWx0aE1heCxcclxuXHRcdFx0ZW5lcmd5OiB0aGlzLmVuZXJneSxcclxuXHRcdFx0ZW5lcmd5TWF4OiB0aGlzLmVuZXJneU1heCxcclxuXHRcdFx0bW92ZVNwZWVkOiB0aGlzLm1vdmVTcGVlZCxcclxuXHRcdFx0YXR0YWNrU3BlZWQ6IHRoaXMuYXR0YWNrU3BlZWQsXHJcblx0XHRcdGF0dGFja1RpbWVyOiB0aGlzLmF0dGFja1RpbWVyLFxyXG5cdFx0XHRpbnZlbnRvcnk6IHRoaXMuZ2V0SW52ZW50b3J5UGFjaygpXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0Z2V0REJQYWNrKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0bmFtZTogdGhpcy5uYW1lLFxyXG5cdFx0XHRhY2NvdW50OiB0aGlzLmFjY291bnRJZCxcclxuXHRcdFx0dGVtcGxhdGU6IHRoaXMudGVtcGxhdGVJZCxcclxuXHRcdFx0bGV2ZWw6IHRoaXMubGV2ZWwsXHJcblx0XHRcdGV4cGVyaWVuY2U6IHRoaXMuZXhwZXJpZW5jZSxcclxuXHRcdFx0bWFwSWQ6IHRoaXMubWFwSWQsXHJcblx0XHRcdHg6IHRoaXMueCxcclxuXHRcdFx0eTogdGhpcy55LFxyXG5cdFx0XHRkaXJlY3Rpb246IHRoaXMuZGlyZWN0aW9uLFxyXG5cdFx0XHRhZG1pbkFjY2VzczogdGhpcy5hZG1pbkFjY2VzcyxcclxuXHRcdFx0c3ByaXRlOiB0aGlzLnNwcml0ZVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0aW5wdXREYXRhKGRhdGEpIHtcclxuXHRcdGlmICh0aGlzLmlzRGVhZCkge1xyXG5cdFx0XHRnYW1lLnNlbmRHYW1lSW5mb1BsYXllcih0aGlzLmdhbWVJZCwgXCJZb3UgYXJlIGRlYWQuXCIpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGdhbWUuZ29kQ29tbWFuZHNbZGF0YS5pbnB1dF0pIHtcclxuXHRcdFx0aWYgKHRoaXMuYWRtaW5BY2Nlc3MgPiAwKSBnYW1lLmdvZENvbW1hbmRzW2RhdGEuaW5wdXRdKGRhdGEsIHRoaXMpO1xyXG5cdFx0XHRlbHNlIGdhbWUuc2VuZEdhbWVJbmZvUGxheWVyKHRoaXMuZ2FtZUlkLCBcIllvdSBkb24ndCBoYXZlIGFjY2VzcyB0byB0aGF0IGNvbW1hbmQuXCIpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGlmIChnYW1lLmNvbW1hbmRzW2RhdGEuaW5wdXRdKSBnYW1lLmNvbW1hbmRzW2RhdGEuaW5wdXRdKGRhdGEsIHRoaXMpO1xyXG5cdFx0XHRlbHNlIGdhbWUuc2VuZEdhbWVJbmZvUGxheWVyKHRoaXMuZ2FtZUlkLCBcIkludmFsaWQgY29tbWFuZC5cIik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRtb3ZlKGRpcmVjdGlvbikge1xyXG5cdFx0aWYgKHRoaXMuaXNNb3ZpbmcpIHJldHVybjtcclxuXHJcblx0XHRpZiAoKGRpcmVjdGlvbiA9PT0gJ2xlZnQnICYmIHRoaXMueCA9PT0gMCkgfHwgKGRpcmVjdGlvbiA9PT0gJ3JpZ2h0JyAmJiB0aGlzLnggPT09IGNvbmZpZy5NQVBfQ09MVU1OUyAtIDEpIHx8IChkaXJlY3Rpb24gPT09ICd1cCcgJiYgdGhpcy55ID09PSAwKSB8fCAoZGlyZWN0aW9uID09PSAnZG93bicgJiYgdGhpcy55ID09PSBjb25maWcuTUFQX1JPV1MgLSAxKSkge1xyXG5cdFx0XHRzdXBlci5zd2l0Y2hNYXAoZGlyZWN0aW9uKTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRzdXBlci5tb3ZlKGRpcmVjdGlvbik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwaWNrVXAoKSB7XHJcblx0XHRpZiAoc3VwZXIucGlja1VwKCkgPT09IGZhbHNlKSBnYW1lLnNlbmRHYW1lSW5mb1BsYXllcih0aGlzLmdhbWVJZCwgXCJZb3VyIGludmVudG9yeSBpcyBmdWxsLlwiKTtcclxuXHR9XHJcblx0XHJcblx0Z2V0SW52ZW50b3J5KCkge1xyXG5cdFx0Y29uc3QgaW52ZW50b3J5ID0gZ2FtZS5pdGVtcy5maWx0ZXIoaXRlbSA9PiB7XHJcblx0XHRcdHJldHVybiBcIlwiK2l0ZW0ucGxheWVySWQgPT09IFwiXCIrdGhpcy5wbGF5ZXJJZDtcclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIGludmVudG9yeTtcclxuXHR9XHJcblxyXG5cdHNldERlYWQoKSB7XHJcblx0XHRzdXBlci5zZXREZWFkKCk7XHJcblx0XHR0aGlzLmlzRGVhZCA9IHRydWU7XHJcblx0XHR0aGlzLmhlYWx0aCA9IDA7XHJcblx0XHR0aGlzLmVuZXJneSA9IDA7XHJcblx0XHR0aGlzLmRlYXRocysrO1xyXG5cdH1cclxuXHJcblx0cmVzcGF3bigpIHtcclxuXHRcdHRoaXMubWFwSWQgPSB0aGlzLnJlc3Bhd25NYXA7XHJcblx0XHR0aGlzLnggPSB0aGlzLnJlc3Bhd25YO1xyXG5cdFx0dGhpcy55ID0gdGhpcy5yZXNwYXduWTtcclxuXHRcdHRoaXMuc3RhcnRYID0gdGhpcy5yZXNwYXduWDtcclxuXHRcdHRoaXMuc3RhcnRZID0gdGhpcy5yZXNwYXduWTtcclxuXHRcdHRoaXMuZGVzdGluYXRpb25YID0gdGhpcy5yZXNwYXduWDtcclxuXHRcdHRoaXMuZGVzdGluYXRpb25ZID0gdGhpcy5yZXNwYXduWTtcclxuXHRcdFxyXG5cdFx0dGhpcy5jYWxjQm9udXNTdGF0cygpO1xyXG5cdFx0dGhpcy5yZXN0b3JlKCk7XHJcblx0XHRcclxuXHRcdHRoaXMuaXNXYWxraW5nID0gZmFsc2U7XHJcblx0XHR0aGlzLmlzUnVubmluZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy5pc0F0dGFja2luZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy5pc0RlYWQgPSBmYWxzZTtcclxuXHRcdHRoaXMucmVzcGF3blRpbWVyID0gMDtcclxuXHRcdGdhbWUuc2VuZEdhbWVJbmZvUGxheWVyKHRoaXMuZ2FtZUlkLCBcIlRoZSBBbmdlbCBvZiBNZXJjeSByZWZ1c2VzIHRvIGxldCB5b3UgZGllLlwiKTtcclxuXHR9XHJcblxyXG5cdGdhaW5FeHBlcmllbmNlKGV4cGVyaWVuY2UpIHtcclxuXHRcdGlmICh0aGlzLmV4cGVyaWVuY2UgKyBleHBlcmllbmNlIDw9IDApIHtcclxuXHRcdFx0dGhpcy5leHBlcmllbmNlID0gMDtcdFxyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5leHBlcmllbmNlICs9IGV4cGVyaWVuY2U7XHJcblx0XHRpZiAodGhpcy5leHBlcmllbmNlID49IGdhbWUuZXhwZXJpZW5jZVRvTGV2ZWxbdGhpcy5sZXZlbF0pIHtcclxuXHRcdFx0dGhpcy5sZXZlbFVwKCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRsZXZlbFVwKCkge1xyXG5cdFx0aWYgKHRoaXMubGV2ZWwgPCBjb25maWcuTUFYX0xFVkVMKSB7XHJcblx0XHRcdGNvbnN0IHJvbGxvdmVyRXhwZXJpZW5jZSA9IHRoaXMuZXhwZXJpZW5jZSAtIGdhbWUuZXhwZXJpZW5jZVRvTGV2ZWxbdGhpcy5sZXZlbF07XHJcblx0XHRcdHRoaXMuZXhwZXJpZW5jZSA9IDA7XHJcblx0XHRcdHRoaXMubGV2ZWwrKztcclxuXHRcdFx0dGhpcy5jYWxjQmFzZVN0YXRzKCk7XHJcblx0XHRcdGdhbWUuc2VuZEdhbWVJbmZvUGxheWVyKHRoaXMuZ2FtZUlkLCBgTGV2ZWwgdXAhIFlvdSBhcmUgbm93IGxldmVsICR7dGhpcy5sZXZlbH0hYCk7XHJcblx0XHRcdHRoaXMuZ2FpbkV4cGVyaWVuY2Uocm9sbG92ZXJFeHBlcmllbmNlKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0Y2FsY0Jhc2VTdGF0cyh0ZW1wbGF0ZSkge1xyXG5cdFx0aWYgKCF0ZW1wbGF0ZSkgdGVtcGxhdGUgPSBnYW1lLnBsYXllclRlbXBsYXRlc1t0aGlzLnRlbXBsYXRlSWRdO1xyXG5cdFx0c3VwZXIuY2FsY0Jhc2VTdGF0cyh0ZW1wbGF0ZSk7XHJcblx0fVxyXG5cclxuXHRzd2l0Y2hNYXAobWFwSWQsIGRpcmVjdGlvbikge1xyXG5cdFx0aWYgKGRpcmVjdGlvbiA9PT0gJ2xlZnQnKSB7XHJcblx0XHRcdGlmICh0aGlzLnggIT09IDApIHJldHVybjtcclxuXHJcblx0XHRcdGNvbnN0IG5ld01hcCA9IGdhbWUubWFwc1ttYXBJZF0uZXhpdExlZnQ7XHJcblx0XHRcdGlmIChuZXdNYXApIHtcclxuXHRcdFx0XHR0aGlzLm1hcElkID0gbmV3TWFwO1xyXG5cdFx0XHRcdHRoaXMueCA9IGNvbmZpZy5NQVBfQ09MVU1OUyAtIDE7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ3JpZ2h0Jykge1xyXG5cdFx0XHRpZiAodGhpcy54ICE9PSBjb25maWcuTUFQX0NPTFVNTlMgLSAxKSByZXR1cm47XHJcblxyXG5cdFx0XHRjb25zdCBuZXdNYXAgPSBnYW1lLm1hcHNbbWFwSWRdLmV4aXRSaWdodDtcclxuXHRcdFx0aWYgKG5ld01hcCkge1xyXG5cdFx0XHRcdHRoaXMubWFwSWQgPSBuZXdNYXA7XHJcblx0XHRcdFx0dGhpcy54ID0gMDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoZGlyZWN0aW9uID09PSAndXAnKSB7XHJcblx0XHRcdGlmICh0aGlzLnkgIT09IDApIHJldHVybjtcclxuXHJcblx0XHRcdGNvbnN0IG5ld01hcCA9IGdhbWUubWFwc1ttYXBJZF0uZXhpdFVwO1xyXG5cdFx0XHRpZiAobmV3TWFwKSB7XHJcblx0XHRcdFx0dGhpcy5tYXBJZCA9IG5ld01hcDtcclxuXHRcdFx0XHR0aGlzLnkgPSBjb25maWcuTUFQX0NPTFVNTlMgLSAxO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdkb3duJykge1xyXG5cdFx0XHRpZiAodGhpcy55ICE9PSBjb25maWcuTUFQX1JPV1MgLSAxKSByZXR1cm47XHJcblxyXG5cdFx0XHRjb25zdCBuZXdNYXAgPSBnYW1lLm1hcHNbbWFwSWRdLmV4aXREb3duO1xyXG5cdFx0XHRpZiAobmV3TWFwKSB7XHJcblx0XHRcdFx0dGhpcy5tYXBJZCA9IG5ld01hcDtcclxuXHRcdFx0XHR0aGlzLnkgPSAwO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbiIsImltcG9ydCBnYW1lIGZyb20gJy4uL2dhbWUuanMnO1xyXG5pbXBvcnQgdXRpbCBmcm9tICcuLi91dGlsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRleHQge1xyXG5cdGNvbnN0cnVjdG9yKG1hcElkLCB4LCB5LCBtZXNzYWdlLCBjb2xvdXIgPSAnIzAwMDAwMCcsIGRpc3BsYXlUaW1lID0gMiwgdmVsWCA9IDAsIHZlbFkgPSAwKSB7XHJcblx0XHR0aGlzLm1hcElkID0gbWFwSWQ7XHJcblx0XHR0aGlzLnggPSB4O1xyXG5cdFx0dGhpcy55ID0geTtcclxuXHRcdHRoaXMudmVsWCA9IHZlbFg7XHJcblx0XHR0aGlzLnZlbFkgPSB2ZWxZO1xyXG5cdFx0dGhpcy5sZXJwWCA9IDA7XHJcblx0XHR0aGlzLmxlcnBZID0gMDtcclxuXHJcblx0XHR0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xyXG5cdFx0dGhpcy5jb2xvdXIgPSBjb2xvdXI7XHJcblx0XHR0aGlzLmRpc3BsYXlUaW1lID0gZGlzcGxheVRpbWU7XHJcblx0XHR0aGlzLnRpbWVyID0gMDtcclxuXHJcblx0XHR0aGlzLmdhbWVJZCA9IHV0aWwuZmlyc3RFbXB0eUluZGV4KGdhbWUudGV4dHMpO1xyXG5cdFx0Z2FtZS50ZXh0c1t0aGlzLmdhbWVJZF0gPSB0aGlzO1xyXG5cdH1cclxuXHRcclxuXHR1cGRhdGUoZGVsdGEpIHtcclxuXHRcdHRoaXMudGltZXIgKz0gZGVsdGE7XHJcblx0XHRpZiAodGhpcy5kaXNwbGF5VGltZSA+IDAgJiYgdGhpcy50aW1lciA+IHRoaXMuZGlzcGxheVRpbWUpIHtcclxuXHRcdFx0dGhpcy5yZW1vdmUoKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLmxlcnBYICs9IGRlbHRhICogdGhpcy52ZWxYO1xyXG5cdFx0dGhpcy5sZXJwWSArPSBkZWx0YSAqIHRoaXMudmVsWTtcclxuXHJcblx0XHRpZiAodGhpcy5sZXJwWCA8IC0xKSB7XHJcblx0XHRcdHRoaXMubGVycFgrKztcclxuXHRcdFx0dGhpcy54LS07XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmICh0aGlzLmxlcnBYID4gMSkge1xyXG5cdFx0XHR0aGlzLmxlcnBYLS07XHJcblx0XHRcdHRoaXMueCsrO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLmxlcnBZIDwgLTEpIHtcclxuXHRcdFx0dGhpcy5sZXJwWSsrO1xyXG5cdFx0XHR0aGlzLnktLTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKHRoaXMubGVycFkgPiAxKSB7XHJcblx0XHRcdHRoaXMubGVycFktLTtcclxuXHRcdFx0dGhpcy55Kys7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiB0aGlzLmdldFBhY2soKTtcclxuXHR9XHJcblx0XHJcblx0Z2V0UGFjaygpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGdhbWVJZDogdGhpcy5nYW1lSWQsXHJcblx0XHRcdG1hcElkOiB0aGlzLm1hcElkLFxyXG5cdFx0XHR4OiB0aGlzLngsXHJcblx0XHRcdHk6IHRoaXMueSxcclxuXHRcdFx0bGVycFg6IHRoaXMubGVycFgsXHJcblx0XHRcdGxlcnBZOiB0aGlzLmxlcnBZLFxyXG5cdFx0XHRtZXNzYWdlOiB0aGlzLm1lc3NhZ2UsXHJcblx0XHRcdGNvbG91cjogdGhpcy5jb2xvdXJcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHRyZW1vdmUoKSB7XHJcblx0XHRkZWxldGUgZ2FtZS50ZXh0c1t0aGlzLmdhbWVJZF07XHJcblx0fVxyXG59XHJcbiIsImNvbnN0IGNvbmZpZyA9IHt9O1xyXG5cclxuY29uZmlnLlBPUlQgPSAyMDAwO1xyXG5jb25maWcuREJfVVJMID0gJ2RzMTQ5NzA2Lm1sYWIuY29tOjQ5NzA2L29keXNzZXknO1xyXG5jb25maWcuRlJBTUVSQVRFID0gMTAwMCAvIDYwO1xyXG5jb25maWcuQkFDS1VQX1RJTUUgPSAxMjA7XHJcblxyXG5jb25maWcuTUFQX0xBWUVSUyA9IDY7XHJcbmNvbmZpZy5NQVBfQ09MVU1OUyA9IDEyO1xyXG5jb25maWcuTUFQX1JPV1MgPSAxMjtcclxuXHJcbmNvbmZpZy5NQVhfTUFQUyA9IDEwO1xyXG5jb25maWcuTUFYX1VTRVJTID0gMTAwO1xyXG5jb25maWcuTUFYX1NQUklURVMgPSAxMztcclxuY29uZmlnLk1BWF9FRkZFQ1RTID0gNzE7XHJcbmNvbmZpZy5NQVhfTEVWRUwgPSAzMDtcclxuXHJcbmNvbmZpZy5NQVhfSEVBTFRIX0JBU0UgPSAyMDA7XHJcbmNvbmZpZy5NQVhfSEVBTFRIX0JPTlVTID0gNTU7XHJcbmNvbmZpZy5NQVhfRU5FUkdZX0JBU0UgPSAyMDA7XHJcbmNvbmZpZy5NQVhfRU5FUkdZX0JPTlVTID0gNTU7XHJcblxyXG5jb25maWcuSU5WRU5UT1JZX1NJWkUgPSAyMDtcclxuY29uZmlnLkVRVUlQTUVOVF9TSVpFID0gNTtcclxuXHJcbmNvbmZpZy5JVEVNX1RZUEVTID0gW1xyXG4gIHtuYW1lOiBcIk5vcm1hbFwiLCBlcXVpcHBlZFNsb3Q6IG51bGwsIHN0YWNrYWJsZTogZmFsc2V9LFxyXG4gIHtuYW1lOiBcIlN0YWNraW5nXCIsIGVxdWlwcGVkU2xvdDogbnVsbCwgc3RhY2thYmxlOiB0cnVlfSxcclxuICB7bmFtZTogXCJXZWFwb25cIiwgZXF1aXBwZWRTbG90OiAwLCBzdGFja2FibGU6IGZhbHNlfSxcclxuICB7bmFtZTogXCJTaGllbGRcIiwgZXF1aXBwZWRTbG90OiAxLCBzdGFja2FibGU6IGZhbHNlfSxcclxuICB7bmFtZTogXCJBcm1vdXJcIiwgZXF1aXBwZWRTbG90OiAyLCBzdGFja2FibGU6IGZhbHNlfSxcclxuICB7bmFtZTogXCJIZWxtZXRcIiwgZXF1aXBwZWRTbG90OiAzLCBzdGFja2FibGU6IGZhbHNlfSxcclxuICB7bmFtZTogXCJSaW5nXCIsIGVxdWlwcGVkU2xvdDogNCwgc3RhY2thYmxlOiBmYWxzZX1cclxuXTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNvbmZpZztcclxuIiwiaW1wb3J0IG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcclxuaW1wb3J0IGJjcnlwdCBmcm9tICdiY3J5cHQnO1xyXG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xyXG5cclxuaW1wb3J0IGtleXMgZnJvbSAnLi9rZXlzLmpzJztcclxuaW1wb3J0IGNvbmZpZyBmcm9tICcuL2NvbmZpZy5qcyc7XHJcbmltcG9ydCB1dGlsIGZyb20gXCIuL3V0aWwuanNcIjtcclxuaW1wb3J0IEFjY291bnQgZnJvbSAnLi9tb2RlbHMvYWNjb3VudC5qcyc7XHJcbmltcG9ydCBQbGF5ZXIgZnJvbSAnLi9tb2RlbHMvcGxheWVyLmpzJztcclxuaW1wb3J0IFBsYXllclRlbXBsYXRlIGZyb20gJy4vbW9kZWxzL3BsYXllclRlbXBsYXRlLmpzJztcclxuaW1wb3J0IEJvdCBmcm9tICcuL21vZGVscy9ib3QuanMnO1xyXG5pbXBvcnQgQm90VGVtcGxhdGUgZnJvbSAnLi9tb2RlbHMvYm90VGVtcGxhdGUuanMnO1xyXG5pbXBvcnQgSXRlbSBmcm9tICcuL21vZGVscy9pdGVtLmpzJztcclxuaW1wb3J0IEl0ZW1UZW1wbGF0ZSBmcm9tICcuL21vZGVscy9pdGVtVGVtcGxhdGUuanMnO1xyXG5pbXBvcnQgTWFwIGZyb20gJy4vbW9kZWxzL21hcC5qcyc7XHJcblxyXG5jb25zdCBmc3AgPSBmcy5wcm9taXNlcztcclxubW9uZ29vc2UuUHJvbWlzZSA9IFByb21pc2U7XHJcbm1vbmdvb3NlLmNvbm5lY3QocHJvY2Vzcy5lbnYuTU9OR09EQl9VUkkgfHwgYG1vbmdvZGI6Ly8ke2tleXMubW9uZ28udXNlcn06JHtrZXlzLm1vbmdvLnBhc3N9QCR7Y29uZmlnLkRCX1VSTH1gLCB7dXNlTmV3VXJsUGFyc2VyOiB0cnVlfSk7XHJcbi8vJ21vbmdvZGI6Ly9sb2NhbGhvc3Qvb2R5c3NleScsIHt1c2VOZXdVcmxQYXJzZXI6IHRydWV9KTtcclxuXHJcbmNsYXNzIERhdGFiYXNlIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHRoaXMuc2VydmVyTG9nID0gW107XHJcblx0fVxyXG5cclxuXHRiYWNrdXAoZGF0YSA9IHt9KSB7XHJcblx0XHQvL1RPRE8gc2F2ZSBldmVyeXRoaW5nXHJcblx0XHQvLyBjb25zdCBtYXBzID0gc2F2ZS1hbGwtbWFwc1xyXG5cdFx0bGV0IHBsYXllcnMgPSB0aGlzLnNhdmVPbmxpbmVQbGF5ZXJzKGRhdGEucGxheWVycyk7XHJcblx0XHRsZXQgYm90cyA9IHRoaXMuc2F2ZUFsbEJvdHMoZGF0YS5ib3RzKTtcclxuXHRcdGxldCBpdGVtcyA9IHRoaXMuc2F2ZUFsbEl0ZW1zKGRhdGEuaXRlbXMpO1xyXG5cdFx0bGV0IGxvZ1NhdmVkID0gdGhpcy5zYXZlTG9nKCk7XHJcblx0XHRQcm9taXNlLmFsbChbcGxheWVycywgYm90cywgaXRlbXMsIGxvZ1NhdmVkXSlcclxuXHRcdC50aGVuKCgpID0+IHRoaXMubG9nKFwiR2FtZSBzYXZlZCB0byBkaXNrLlwiKSk7XHJcblx0fVxyXG5cdFxyXG5cdGxvZyhtZXNzYWdlKSB7XHJcblx0XHRjb25zdCBkYXRlID0gbmV3IERhdGUoKTtcclxuXHRcdGNvbnNvbGUubG9nKHV0aWwudGltZXN0YW1wKGRhdGUpICsgXCIgLSBcIiArIG1lc3NhZ2UpO1xyXG5cdFx0dGhpcy5zZXJ2ZXJMb2cucHVzaCh7XHJcblx0XHRcdG1lc3NhZ2UsXHJcblx0XHRcdGRhdGVcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRhc3luYyBzYXZlTG9nKCkge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0Y29uc3Qgc2F2ZWRMb2cgPSBhd2FpdCBmc3AucmVhZEZpbGUoJy4vc2VydmVyL2xvZy5qc29uJyk7XHJcblx0XHRcdGNvbnN0IG5ld0xvZyA9IEpTT04ucGFyc2Uoc2F2ZWRMb2cpLmNvbmNhdCh0aGlzLnNlcnZlckxvZyk7XHJcblx0XHRcdHRoaXMuc2VydmVyTG9nID0gW107XHJcblx0XHRcdGF3YWl0IGZzcC53cml0ZUZpbGUoJy4vc2VydmVyL2xvZy5qc29uJywgSlNPTi5zdHJpbmdpZnkobmV3TG9nKSk7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0Y2F0Y2goZXJyKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHR9XHJcblx0YXN5bmMgY2xlYXJMb2coKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHR0aGlzLnNlcnZlckxvZyA9IFtdO1xyXG5cdFx0XHRhd2FpdCBmc3Aud3JpdGVGaWxlKCcuL3NlcnZlci9sb2cuanNvbicsIFwiW11cIik7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0Y2F0Y2ggKGVycikge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRnZW5lcmF0ZUlkKCkge1xyXG5cdFx0cmV0dXJuIG5ldyBtb25nb29zZS5UeXBlcy5PYmplY3RJZDtcclxuXHR9XHJcblx0aGFzaFBhc3N3b3JkKHBhc3N3b3JkKSB7XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHRiY3J5cHQuaGFzaChwYXNzd29yZCwgMTAsIChlcnIsIGhhc2gpID0+IHtcclxuXHRcdFx0XHRpZiAoZXJyKSByZWplY3QoZXJyKTtcclxuXHRcdFx0XHRlbHNlIHJlc29sdmUoaGFzaCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdGNvbXBhcmVQYXNzd29yZChwYXNzd29yZCwgaGFzaGVkUGFzc3dvcmQpIHtcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblx0XHRcdGJjcnlwdC5jb21wYXJlKHBhc3N3b3JkLCBoYXNoZWRQYXNzd29yZCwgKGVyciwgbWF0Y2gpID0+IHtcclxuXHRcdFx0XHRpZiAoZXJyKSByZWplY3QoZXJyKTtcclxuXHRcdFx0XHRlbHNlIHJlc29sdmUobWF0Y2gpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRhc3luYyBhdXRoQWNjb3VudCh1c2VybmFtZSwgcGFzc3dvcmQpIHtcclxuXHRcdGxldCBhY2NvdW50ID0gYXdhaXQgQWNjb3VudC5maW5kT25lKHt1c2VybmFtZUxvd2VyQ2FzZTogdXNlcm5hbWUudG9Mb3dlckNhc2UoKX0pLmV4ZWMoKTtcclxuXHRcdGlmICghYWNjb3VudCkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0bGV0IG1hdGNoID0gYXdhaXQgdGhpcy5jb21wYXJlUGFzc3dvcmQocGFzc3dvcmQsIGFjY291bnQucGFzc3dvcmQpO1xyXG5cdFx0cmV0dXJuIG1hdGNoO1xyXG5cdH1cclxuXHJcblx0YXN5bmMgYWRkQWNjb3VudCh1c2VybmFtZSwgcGFzc3dvcmQsIGVtYWlsKSB7XHJcblx0XHRsZXQgYWRtaW4gPSBmYWxzZTtcclxuXHRcdGxldCBhY2NvdW50cyA9IGF3YWl0IHRoaXMuZ2V0QWxsQWNjb3VudHMoKTtcclxuXHRcdGlmIChhY2NvdW50cy5sZW5ndGggPT09IDApIHtcclxuXHRcdFx0YWRtaW4gPSB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGxldCBleGlzdGluZ0FjY291bnQgPSBhY2NvdW50cy5maW5kKGFjY291bnQgPT4gYWNjb3VudC51c2VybmFtZS50b0xvd2VyQ2FzZSgpID09PSB1c2VybmFtZS50b0xvd2VyQ2FzZSgpKTtcclxuXHRcdFx0aWYgKGV4aXN0aW5nQWNjb3VudCkge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGBBY2NvdW50IGFscmVhZHkgZXhpc3RzIHdpdGggdXNlcm5hbWUgJHt1c2VybmFtZX0uYCk7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGhhc2hlZFBhc3N3b3JkID0gYXdhaXQgdGhpcy5oYXNoUGFzc3dvcmQocGFzc3dvcmQpO1xyXG5cdFx0Y29uc3QgYWNjb3VudCA9IG5ldyBBY2NvdW50KHtcclxuXHRcdFx0X2lkOiBuZXcgbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQsXHJcblx0XHRcdHVzZXJuYW1lLFxyXG5cdFx0XHR1c2VybmFtZUxvd2VyQ2FzZTogdXNlcm5hbWUudG9Mb3dlckNhc2UoKSxcclxuXHRcdFx0cGFzc3dvcmQ6IGhhc2hlZFBhc3N3b3JkLFxyXG5cdFx0XHRlbWFpbCxcclxuXHRcdFx0dmVyaWZpZWQ6IGZhbHNlLFxyXG5cdFx0XHRhZG1pblxyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIGF3YWl0IGFjY291bnQuc2F2ZSgpXHJcblx0XHQudGhlbihyZXN1bHQgPT4gYWNjb3VudC5faWQpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRnZXRBY2NvdW50KGFjY291bnRJZCkge1xyXG5cdFx0cmV0dXJuIEFjY291bnQuZmluZEJ5SWQoYWNjb3VudElkKVxyXG5cdFx0LnNlbGVjdCgnX2lkIHVzZXJuYW1lIHBhc3N3b3JkIGVtYWlsIHZlcmlmaWVkIGFkbWluJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKGFjY291bnQgPT4gYWNjb3VudClcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGdldEFjY291bnRCeVVzZXJuYW1lKHVzZXJuYW1lKSB7XHJcblx0XHRyZXR1cm4gQWNjb3VudC5maW5kT25lKHt1c2VybmFtZUxvd2VyQ2FzZTogdXNlcm5hbWUudG9Mb3dlckNhc2UoKX0pXHJcblx0XHQuc2VsZWN0KCdfaWQgdXNlcm5hbWUgcGFzc3dvcmQgZW1haWwgdmVyaWZpZWQgYWRtaW4nKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4oYWNjb3VudCA9PiBhY2NvdW50KVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0Z2V0QWxsQWNjb3VudHMoKSB7XHJcblx0XHRyZXR1cm4gQWNjb3VudC5maW5kKHt9KVxyXG5cdFx0LnNlbGVjdCgnX2lkIHVzZXJuYW1lIHBhc3N3b3JkIGVtYWlsIHZlcmlmaWVkIGFkbWluJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKGFjY291bnRzID0+IGFjY291bnRzKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0c2F2ZUFjY291bnQoZGF0YSkge1xyXG5cdFx0cmV0dXJuIEFjY291bnQudXBkYXRlT25lKHt1c2VybmFtZTogZGF0YS51c2VybmFtZX0sIHskc2V0OiBkYXRhfSlcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHJlc3VsdCA9PiB0cnVlKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblxyXG5cdGFzeW5jIGFkZFBsYXllcihhY2NvdW50SWQsIG5hbWUsIHRlbXBsYXRlSWQpIHtcclxuXHRcdGxldCBhY2NvdW50ID0gYXdhaXQgdGhpcy5nZXRBY2NvdW50KGFjY291bnRJZCk7XHJcblx0XHRpZiAoIWFjY291bnQpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJBY2NvdW50IGRvZXMgbm90IGV4aXN0IHdpdGggdGhhdCBpZC5cIik7XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fVxyXG5cdFx0bGV0IHRlbXBsYXRlID0gYXdhaXQgdGhpcy5nZXRQbGF5ZXJUZW1wbGF0ZSh0ZW1wbGF0ZUlkKTtcclxuXHRcdGlmICghdGVtcGxhdGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJQbGF5ZXIgVGVtcGxhdGUgZG9lcyBub3QgZXhpc3Qgd2l0aCB0aGF0IGlkLlwiKTtcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9XHJcblx0XHRsZXQgcGxheWVyID0gYXdhaXQgdGhpcy5nZXRQbGF5ZXJCeU5hbWUobmFtZSk7XHJcblx0XHRpZiAocGxheWVyKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiUGxheWVyIGFscmVhZHkgZXhpc3RzIHdpdGggdGhhdCBuYW1lLlwiKTtcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9XHJcblxyXG5cdFx0cGxheWVyID0gbmV3IFBsYXllcih7XHJcblx0XHRcdF9pZCA6IG5ldyBtb25nb29zZS5UeXBlcy5PYmplY3RJZCxcclxuXHRcdFx0bmFtZSxcclxuXHRcdFx0bmFtZUxvd2VyQ2FzZTogbmFtZS50b0xvd2VyQ2FzZSgpLFxyXG5cdFx0XHRhY2NvdW50OiBhY2NvdW50SWQsXHJcblx0XHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZUlkXHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gcGxheWVyLnNhdmUoKVxyXG5cdFx0LnRoZW4ocmVzdWx0ID0+IHBsYXllci5faWQpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRnZXRQbGF5ZXIocGxheWVySWQpIHtcclxuXHRcdHJldHVybiBQbGF5ZXIuZmluZEJ5SWQocGxheWVySWQpXHJcblx0XHQuc2VsZWN0KCdfaWQgYWNjb3VudCBuYW1lIHRlbXBsYXRlIGxldmVsIGV4cGVyaWVuY2UgbWFwSWQgeCB5IGRpcmVjdGlvbiBhZG1pbkFjY2VzcyBzcHJpdGUnKVxyXG5cdFx0LnBvcHVsYXRlKCd0ZW1wbGF0ZScpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbihwbGF5ZXIgPT4gcGxheWVyKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0Z2V0UGxheWVyQnlOYW1lKG5hbWUpIHtcclxuXHRcdHJldHVybiBQbGF5ZXIuZmluZE9uZSh7bmFtZUxvd2VyQ2FzZTogbmFtZS50b0xvd2VyQ2FzZSgpfSlcclxuXHRcdC5zZWxlY3QoJ19pZCBhY2NvdW50IG5hbWUgdGVtcGxhdGUgbGV2ZWwgZXhwZXJpZW5jZSBtYXBJZCB4IHkgZGlyZWN0aW9uIGFkbWluQWNjZXNzIHNwcml0ZScpXHJcblx0XHQucG9wdWxhdGUoJ3RlbXBsYXRlJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHBsYXllciA9PiBwbGF5ZXIpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRnZXRQbGF5ZXJzQnlBY2NvdW50KGFjY291bnRJZCkge1xyXG5cdFx0cmV0dXJuIFBsYXllci5maW5kKHthY2NvdW50OiBhY2NvdW50SWR9KVxyXG5cdFx0LnNlbGVjdCgnX2lkIGFjY291bnQgbmFtZSB0ZW1wbGF0ZSBsZXZlbCBleHBlcmllbmNlIG1hcElkIHggeSBkaXJlY3Rpb24gYWRtaW5BY2Nlc3Mgc3ByaXRlJylcclxuXHRcdC5wb3B1bGF0ZSgndGVtcGxhdGUnKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4ocGxheWVycyA9PiBwbGF5ZXJzKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0c2F2ZVBsYXllcihkYXRhKSB7XHJcblx0XHRyZXR1cm4gUGxheWVyLnVwZGF0ZU9uZSh7bmFtZTogZGF0YS5uYW1lfSwgeyRzZXQ6IGRhdGF9KVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4ocmVzdWx0ID0+IHRydWUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRzYXZlT25saW5lUGxheWVycyhwbGF5ZXJzID0gW10pIHtcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcGxheWVycy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdGNvbnN0IHBsYXllciA9IHBsYXllcnNbaV07XHJcblx0XHRcdFx0aWYgKCFwbGF5ZXIpIGNvbnRpbnVlO1xyXG5cdFx0XHRcdHRoaXMuc2F2ZVBsYXllcihwbGF5ZXIpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJlc29sdmUodHJ1ZSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGFzeW5jIGFkZEJvdChkYXRhKSB7XHJcblx0XHRsZXQgdGVtcGxhdGUgPSBhd2FpdCB0aGlzLmdldEJvdFRlbXBsYXRlKGRhdGEudGVtcGxhdGVJZCk7XHJcblx0XHRpZiAoIXRlbXBsYXRlKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiQm90IFRlbXBsYXRlIGRvZXMgbm90IGV4aXN0IHdpdGggdGhhdCBpZC5cIik7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgX2lkID0gZGF0YS5ib3RJZDtcclxuXHRcdGlmICghX2lkKSBfaWQgPSBuZXcgbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQ7XHJcblxyXG5cdFx0Y29uc3QgYm90ID0gbmV3IEJvdCh7XHJcblx0XHRcdF9pZCxcclxuXHRcdFx0dGVtcGxhdGU6IGRhdGEudGVtcGxhdGVJZCxcclxuXHRcdFx0bWFwSWQ6IGRhdGEubWFwSWQsXHJcblx0XHRcdHg6IGRhdGEueCxcclxuXHRcdFx0eTogZGF0YS55LFxyXG5cdFx0XHRkaXJlY3Rpb246IGRhdGEuZGlyZWN0aW9uXHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gYm90LnNhdmUoKVxyXG5cdFx0LnRoZW4ocmVzdWx0ID0+IHRydWUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRnZXRCb3QoYm90SWQpIHtcclxuXHRcdHJldHVybiBCb3QuZmluZE9uZSh7X2lkOiBib3RJZH0pXHJcblx0XHQuc2VsZWN0KCdfaWQgdGVtcGxhdGUgbWFwSWQgeCB5IGRpcmVjdGlvbicpXHJcblx0XHQucG9wdWxhdGUoJ3RlbXBsYXRlJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKGJvdCA9PiBib3QpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRzYXZlQm90KGRhdGEpIHtcclxuXHRcdHJldHVybiBCb3QudXBkYXRlT25lKHtfaWQ6IGRhdGEuYm90SWR9LCB7JHNldDogZGF0YX0pXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbihyZXN1bHQgPT4gdHJ1ZSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGdldEFsbEJvdHMoKSB7XHJcblx0XHRyZXR1cm4gQm90LmZpbmQoe30pXHJcblx0XHQuc2VsZWN0KCdfaWQgdGVtcGxhdGUgbWFwSWQgeCB5IGRpcmVjdGlvbicpXHJcblx0XHQucG9wdWxhdGUoJ3RlbXBsYXRlJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKGJvdHMgPT4gYm90cylcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIHNhdmVBbGxCb3RzKGN1cnJlbnRCb3RzKSB7XHJcblx0XHRpZiAoIWN1cnJlbnRCb3RzKSByZXR1cm47XHJcblxyXG5cdFx0bGV0IHNhdmVkQm90cyA9IGF3YWl0IHRoaXMuZ2V0QWxsQm90cygpO1xyXG5cdFx0Y29uc3QgbmV3Qm90cyA9IGN1cnJlbnRCb3RzLmZpbHRlcihib3QgPT4gIXNhdmVkQm90cy5maW5kKHNhdmVkQm90ID0+IHNhdmVkQm90Ll9pZCA9PT0gYm90LmJvdElkKSk7XHJcblx0XHRjb25zdCBleGlzdGluZ0JvdHMgPSBjdXJyZW50Qm90cy5maWx0ZXIoYm90ID0+IHNhdmVkQm90cy5maW5kKHNhdmVkQm90ID0+IHNhdmVkQm90Ll9pZCA9PT0gYm90LmJvdElkKSk7XHJcblx0XHRjb25zdCBkZWxldGVCb3RzID0gc2F2ZWRCb3RzLmZpbHRlcihib3QgPT4gIWV4aXN0aW5nQm90cy5maW5kKGV4aXN0aW5nQm90ID0+IGV4aXN0aW5nQm90LmJvdElkID09PSBib3QuX2lkKSk7XHJcblx0XHRjb25zdCB1cGRhdGVCb3RzID0gZXhpc3RpbmdCb3RzLmZpbHRlcihib3QgPT4gIWRlbGV0ZUJvdHMuaW5jbHVkZXMoYm90KSk7XHJcblxyXG5cdFx0Ly8gQWRkIG5ldyBCb3RzXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IG5ld0JvdHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dGhpcy5hZGRCb3QobmV3Qm90c1tpXSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gRGVsZXRlIHJlbW92ZWQgQm90c1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBkZWxldGVCb3RzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdEJvdC5kZWxldGVPbmUoe19pZDogZGVsZXRlQm90c1tpXS5faWR9LCBlcnIgPT4ge1xyXG5cdFx0XHRcdGlmIChlcnIpIGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFVwZGF0ZSB0aGUgcmVzdFxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB1cGRhdGVCb3RzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IGJvdCA9IHVwZGF0ZUJvdHNbaV07XHJcblx0XHRcdGlmICghYm90KSBjb250aW51ZTtcclxuXHRcdFx0dGhpcy5zYXZlQm90KGJvdCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRnZXRNYXAobWFwSWQpIHtcclxuXHRcdHJldHVybiBNYXAuZmluZE9uZSh7bWFwSWQ6IG1hcElkfSlcclxuXHRcdC5zZWxlY3QoJ21hcElkIG5hbWUgZHJvcENoYW5jZSBkcm9wQW1vdW50RVEgdGlsZXMgaXNXYWxsIGlzSG9zdGlsZSBkYW1hZ2Ugd2FycE1hcCB3YXJwWCB3YXJwWSBleGl0TGVmdCBleGl0UmlnaHQgZXhpdFVwIGV4aXREb3duJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKG1hcCA9PiBtYXApXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRzYXZlTWFwKGRhdGEpIHtcclxuXHRcdHJldHVybiBNYXAudXBkYXRlT25lKHttYXBJZDogZGF0YS5tYXBJZH0sIHskc2V0OiBkYXRhfSwge25ldzogdHJ1ZSwgdXBzZXJ0OiB0cnVlLCBzZXREZWZhdWx0c09uSW5zZXJ0OiB0cnVlfSlcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHJlc3VsdCA9PiB0cnVlKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0Z2V0QWxsTWFwcygpIHtcclxuXHRcdHJldHVybiBNYXAuZmluZCh7fSlcclxuXHRcdC5zZWxlY3QoJ21hcElkIG5hbWUgZHJvcENoYW5jZSBkcm9wQW1vdW50RVEgdGlsZXMgaXNXYWxsIGlzSG9zdGlsZSBkYW1hZ2Ugd2FycE1hcCB3YXJwWCB3YXJwWSBleGl0TGVmdCBleGl0UmlnaHQgZXhpdFVwIGV4aXREb3duJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKG1hcHMgPT4gbWFwcylcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cclxuXHRhc3luYyBhZGRQbGF5ZXJUZW1wbGF0ZShkYXRhKSB7XHJcblx0XHRpZiAoIWRhdGEubmFtZSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIk5hbWUgaXMgcmVxdWlyZWQuXCIpO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGNoZWNrVGVtcGxhdGUgPSBhd2FpdCBQbGF5ZXJUZW1wbGF0ZS5maW5kT25lKHtuYW1lOiBkYXRhLm5hbWV9KVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4odGVtcGxhdGUgPT4gdGVtcGxhdGUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cclxuXHRcdGlmIChjaGVja1RlbXBsYXRlKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiVGVtcGxhdGUgYWxyZWFkeSBleGlzdHMgd2l0aCB0aGF0IG5hbWUuXCIpO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgdGVtcGxhdGUgPSBuZXcgUGxheWVyVGVtcGxhdGUoe1xyXG5cdFx0XHRfaWQ6IG5ldyBtb25nb29zZS5UeXBlcy5PYmplY3RJZCxcclxuXHRcdFx0bmFtZTogZGF0YS5uYW1lLFxyXG5cdFx0XHRzcHJpdGU6IGRhdGEuc3ByaXRlLFxyXG5cdFx0XHRkYW1hZ2VCYXNlOiBkYXRhLmRhbWFnZUJhc2UsXHJcblx0XHRcdGRlZmVuY2VCYXNlOiBkYXRhLmRlZmVuY2VCYXNlLFxyXG5cdFx0XHRoZWFsdGhNYXhCYXNlOiBkYXRhLmhlYWx0aE1heEJhc2UsXHJcblx0XHRcdGVuZXJneU1heEJhc2U6IGRhdGEuZW5lcmd5TWF4QmFzZSxcclxuXHRcdFx0aGVhbHRoUmVnZW5CYXNlOiBkYXRhLmhlYWx0aFJlZ2VuQmFzZSxcclxuXHRcdFx0ZW5lcmd5UmVnZW5CYXNlOiBkYXRhLmVuZXJneVJlZ2VuQmFzZSxcclxuXHRcdFx0cmFuZ2VCYXNlOiBkYXRhLnJhbmdlQmFzZSxcclxuXHRcdFx0aGVhbHRoUGVyTGV2ZWw6IGRhdGEuaGVhbHRoUGVyTGV2ZWwsXHJcblx0XHRcdGVuZXJneVBlckxldmVsOiBkYXRhLmVuZXJneVBlckxldmVsXHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gdGVtcGxhdGUuc2F2ZSgpXHJcblx0XHQudGhlbihyZXN1bHQgPT4gdHJ1ZSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGdldFBsYXllclRlbXBsYXRlKHRlbXBsYXRlSWQpIHtcclxuXHRcdHJldHVybiBQbGF5ZXJUZW1wbGF0ZS5maW5kQnlJZCh0ZW1wbGF0ZUlkKVxyXG5cdFx0LnNlbGVjdCgnbmFtZSBzcHJpdGUgZGFtYWdlQmFzZSBkZWZlbmNlQmFzZSBoZWFsdGhNYXhCYXNlIGVuZXJneU1heEJhc2UgaGVhbHRoUmVnZW5CYXNlIGVuZXJneVJlZ2VuQmFzZSByYW5nZUJhc2UgaGVhbHRoUGVyTGV2ZWwsIGVuZXJneVBlckxldmVsJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHRlbXBsYXRlID0+IHRlbXBsYXRlKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0Z2V0QWxsUGxheWVyVGVtcGxhdGVzKCkge1xyXG5cdFx0cmV0dXJuIFBsYXllclRlbXBsYXRlLmZpbmQoe30pXHJcblx0XHQuc2VsZWN0KCdfaWQgbmFtZSBzcHJpdGUgZGFtYWdlQmFzZSBkZWZlbmNlQmFzZSBoZWFsdGhNYXhCYXNlIGVuZXJneU1heEJhc2UgaGVhbHRoUmVnZW5CYXNlIGVuZXJneVJlZ2VuQmFzZSByYW5nZUJhc2UgaGVhbHRoUGVyTGV2ZWwsIGVuZXJneVBlckxldmVsJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHRlbXBsYXRlcyA9PiB0ZW1wbGF0ZXMpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHJcblx0YWRkQm90VGVtcGxhdGUoZGF0YSkge1xyXG5cdFx0Y29uc3QgdGVtcGxhdGUgPSBuZXcgQm90VGVtcGxhdGUoe1xyXG5cdFx0XHRfaWQ6IG5ldyBtb25nb29zZS5UeXBlcy5PYmplY3RJZCxcclxuXHRcdFx0bmFtZTogZGF0YS5uYW1lLFxyXG5cdFx0XHRzcHJpdGU6IGRhdGEuc3ByaXRlLFxyXG5cdFx0XHRkYW1hZ2VCYXNlOiBkYXRhLmRhbWFnZUJhc2UsXHJcblx0XHRcdGRlZmVuY2VCYXNlOiBkYXRhLmRlZmVuY2VCYXNlLFxyXG5cdFx0XHRoZWFsdGhNYXhCYXNlOiBkYXRhLmhlYWx0aE1heEJhc2UsXHJcblx0XHRcdGVuZXJneU1heEJhc2U6IGRhdGEuZW5lcmd5TWF4QmFzZSxcclxuXHRcdFx0aGVhbHRoUmVnZW5CYXNlOiBkYXRhLmhlYWx0aFJlZ2VuQmFzZSxcclxuXHRcdFx0ZW5lcmd5UmVnZW5CYXNlOiBkYXRhLmVuZXJneVJlZ2VuQmFzZSxcclxuXHRcdFx0cmFuZ2VCYXNlOiBkYXRhLnJhbmdlQmFzZSxcclxuXHRcdFx0aG9zdGlsZTogZGF0YS5ob3N0aWxlXHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gdGVtcGxhdGUuc2F2ZSgpXHJcblx0XHQudGhlbihyZXN1bHQgPT4gdHJ1ZSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGdldEJvdFRlbXBsYXRlKHRlbXBsYXRlSWQpIHtcclxuXHRcdHJldHVybiBCb3RUZW1wbGF0ZS5maW5kQnlJZCh0ZW1wbGF0ZUlkKVxyXG5cdFx0LnNlbGVjdCgnX2lkIG5hbWUgc3ByaXRlIGRhbWFnZUJhc2UgZGVmZW5jZUJhc2UgaGVhbHRoTWF4QmFzZSBlbmVyZ3lNYXhCYXNlIGhlYWx0aFJlZ2VuQmFzZSBlbmVyZ3lSZWdlbkJhc2UgcmFuZ2VCYXNlIGhvc3RpbGUnKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4odGVtcGxhdGUgPT4gdGVtcGxhdGUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRnZXRBbGxCb3RUZW1wbGF0ZXMoKSB7XHJcblx0XHRyZXR1cm4gQm90VGVtcGxhdGUuZmluZCh7fSlcclxuXHRcdC5zZWxlY3QoJ19pZCBuYW1lIHNwcml0ZSBkYW1hZ2VCYXNlIGRlZmVuY2VCYXNlIGhlYWx0aE1heEJhc2UgZW5lcmd5TWF4QmFzZSBoZWFsdGhSZWdlbkJhc2UgZW5lcmd5UmVnZW5CYXNlIHJhbmdlQmFzZSBob3N0aWxlJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHRlbXBsYXRlcyA9PiB0ZW1wbGF0ZXMpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHJcblx0YWRkSXRlbVRlbXBsYXRlKGRhdGEpIHtcclxuXHRcdGNvbnN0IHRlbXBsYXRlID0gbmV3IEl0ZW1UZW1wbGF0ZSh7XHJcblx0XHRcdF9pZDogbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkLFxyXG5cdFx0XHRuYW1lOiBkYXRhLm5hbWUsXHJcblx0XHRcdHNwcml0ZTogZGF0YS5zcHJpdGUsXHJcblx0XHRcdHJldXNhYmxlOiBkYXRhLnJldXNhYmxlLFxyXG5cdFx0XHRpdGVtVHlwZTogZGF0YS5pdGVtVHlwZUlkLFxyXG5cdFx0XHRwYXNzaXZlRGFtYWdlOiBkYXRhLnBhc3NpdmVEYW1hZ2UsXHJcblx0XHRcdHBhc3NpdmVEZWZlbmNlOiBkYXRhLnBhc3NpdmVEZWZlbmNlLFxyXG5cdFx0XHRwYXNzaXZlSGVhbHRoTWF4OiBkYXRhLnBhc3NpdmVIZWFsdGhNYXgsXHJcblx0XHRcdHBhc3NpdmVFbmVyZ3lNYXg6IGRhdGEucGFzc2l2ZUVuZXJneU1heCxcclxuXHRcdFx0cGFzc2l2ZUhlYWx0aFJlZ2VuOiBkYXRhLnBhc3NpdmVIZWFsdGhSZWdlbixcclxuXHRcdFx0cGFzc2l2ZUVuZXJneVJlZ2VuOiBkYXRhLnBhc3NpdmVFbmVyZ3lSZWdlbixcclxuXHRcdFx0cGFzc2l2ZVJhbmdlOiBkYXRhLnBhc3NpdmVSYW5nZSxcclxuXHRcdFx0ZXF1aXBwZWREYW1hZ2U6IGRhdGEuZXF1aXBwZWREYW1hZ2UsXHJcblx0XHRcdGVxdWlwcGVkRGVmZW5jZTogZGF0YS5lcXVpcHBlZERlZmVuY2UsXHJcblx0XHRcdGVxdWlwcGVkSGVhbHRoTWF4OiBkYXRhLmVxdWlwcGVkSGVhbHRoTWF4LFxyXG5cdFx0XHRlcXVpcHBlZEVuZXJneU1heDogZGF0YS5lcXVpcHBlZEVuZXJneU1heCxcclxuXHRcdFx0ZXF1aXBwZWRIZWFsdGhSZWdlbjogZGF0YS5lcXVpcHBlZEhlYWx0aFJlZ2VuLFxyXG5cdFx0XHRlcXVpcHBlZEVuZXJneVJlZ2VuOiBkYXRhLmVxdWlwcGVkRW5lcmd5UmVnZW4sXHJcblx0XHRcdGVxdWlwcGVkUmFuZ2U6IGRhdGEuZXF1aXBwZWRSYW5nZVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIHRlbXBsYXRlLnNhdmUoKVxyXG5cdFx0LnRoZW4ocmVzdWx0ID0+IHRydWUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRnZXRJdGVtVGVtcGxhdGUodGVtcGxhdGVJZCkge1xyXG5cdFx0cmV0dXJuIEl0ZW1UZW1wbGF0ZS5maW5kQnlJZCh0ZW1wbGF0ZUlkKVxyXG5cdFx0LnNlbGVjdCgnbmFtZSBzcHJpdGUgcmV1c2FibGUgaXRlbVR5cGUgcGFzc2l2ZURhbWFnZSBwYXNzaXZlRGVmZW5jZSBwYXNzaXZlSGVhbHRoTWF4IHBhc3NpdmVFbmVyZ3lNYXhCYXNlIHBhc3NpdmVIZWFsdGhSZWdlbiBwYXNzaXZlRW5lcmd5UmVnZW4gcGFzc2l2ZVJhbmdlIGVxdWlwcGVkRGFtYWdlIGVxdWlwcGVkRGVmZW5jZSBlcXVpcHBlZEhlYWx0aE1heCBlcXVpcHBlZEVuZXJneU1heEJhc2UgZXF1aXBwZWRIZWFsdGhSZWdlbiBlcXVpcHBlZEVuZXJneVJlZ2VuIGVxdWlwcGVkUmFuZ2UnKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4odGVtcGxhdGUgPT4gdGVtcGxhdGUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRnZXRBbGxJdGVtVGVtcGxhdGVzKCkge1xyXG5cdFx0cmV0dXJuIEl0ZW1UZW1wbGF0ZS5maW5kKHt9KVxyXG5cdFx0LnNlbGVjdCgnX2lkIG5hbWUgc3ByaXRlIHJldXNhYmxlIGl0ZW1UeXBlIHBhc3NpdmVEYW1hZ2UgcGFzc2l2ZURlZmVuY2UgcGFzc2l2ZUhlYWx0aE1heCBwYXNzaXZlRW5lcmd5TWF4QmFzZSBwYXNzaXZlSGVhbHRoUmVnZW4gcGFzc2l2ZUVuZXJneVJlZ2VuIHBhc3NpdmVSYW5nZSBlcXVpcHBlZERhbWFnZSBlcXVpcHBlZERlZmVuY2UgZXF1aXBwZWRIZWFsdGhNYXggZXF1aXBwZWRFbmVyZ3lNYXhCYXNlIGVxdWlwcGVkSGVhbHRoUmVnZW4gZXF1aXBwZWRFbmVyZ3lSZWdlbiBlcXVpcHBlZFJhbmdlJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHRlbXBsYXRlcyA9PiB0ZW1wbGF0ZXMpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHJcblx0YXN5bmMgYWRkSXRlbShkYXRhKSB7XHJcblx0XHRsZXQgdGVtcGxhdGUgPSBhd2FpdCB0aGlzLmdldEl0ZW1UZW1wbGF0ZShkYXRhLnRlbXBsYXRlSWQpO1xyXG5cdFx0aWYgKCF0ZW1wbGF0ZSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIkl0ZW0gVGVtcGxhdGUgZG9lcyBub3QgZXhpc3Qgd2l0aCB0aGF0IGlkLlwiKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0bGV0IF9pZCA9IGRhdGEuaXRlbUlkO1xyXG5cdFx0aWYgKCFfaWQpIF9pZCA9IG5ldyBtb25nb29zZS5UeXBlcy5PYmplY3RJZDtcclxuXHJcblx0XHRjb25zdCBpdGVtID0gbmV3IEl0ZW0oe1xyXG5cdFx0XHRfaWQsXHJcblx0XHRcdHRlbXBsYXRlOiBkYXRhLnRlbXBsYXRlSWQsXHJcblx0XHRcdHN0YWNrOiBkYXRhLnN0YWNrLFxyXG5cdFx0XHRwbGF5ZXJJZDogZGF0YS5wbGF5ZXJJZCxcclxuXHRcdFx0Ym90SWQ6IGRhdGEuYm90SWQsXHJcblx0XHRcdHNsb3Q6IGRhdGEuc2xvdCxcclxuXHRcdFx0bWFwSWQ6IGRhdGEubWFwSWQsXHJcblx0XHRcdHg6IGRhdGEueCxcclxuXHRcdFx0eTogZGF0YS55LFxyXG5cdFx0XHRjcmVhdGVkQnk6IGRhdGEuY3JlYXRlZEJ5LFxyXG5cdFx0XHRjcmVhdGVkRGF0ZTogZGF0YS5jcmVhdGVkRGF0ZVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIGl0ZW0uc2F2ZSgpXHJcblx0XHQudGhlbihyZXN1bHQgPT4gdHJ1ZSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdHNhdmVJdGVtKGRhdGEpIHtcclxuXHRcdHJldHVybiBJdGVtLnVwZGF0ZU9uZSh7X2lkOiBkYXRhLml0ZW1JZH0sIHskc2V0OiBkYXRhfSwge3Vwc2VydDogdHJ1ZX0pXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbihyZXN1bHQgPT4gdHJ1ZSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGdldEFsbEl0ZW1zKCkge1xyXG5cdFx0cmV0dXJuIEl0ZW0uZmluZCh7fSlcclxuXHRcdC5zZWxlY3QoJ19pZCB0ZW1wbGF0ZSBzdGFjayBwbGF5ZXJJZCBib3RJZCBzbG90IG1hcElkIHggeSBjcmVhdGVkRGF0ZSBjcmVhdGVkQnknKVxyXG5cdFx0LnBvcHVsYXRlKCd0ZW1wbGF0ZScpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbihpdGVtcyA9PiBpdGVtcylcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIHNhdmVBbGxJdGVtcyhjdXJyZW50SXRlbXMpIHtcclxuXHRcdGlmICghY3VycmVudEl0ZW1zKSByZXR1cm47XHJcblxyXG5cdFx0bGV0IHNhdmVkSXRlbXMgPSBhd2FpdCB0aGlzLmdldEFsbEl0ZW1zKCk7XHJcblx0XHRjb25zdCBuZXdJdGVtcyA9IGN1cnJlbnRJdGVtcy5maWx0ZXIoaXRlbSA9PiAhc2F2ZWRJdGVtcy5maW5kKHNhdmVkSXRlbSA9PiBzYXZlZEl0ZW0uX2lkID09PSBpdGVtLml0ZW1JZCkpO1xyXG5cdFx0Y29uc3QgZXhpc3RpbmdJdGVtcyA9IGN1cnJlbnRJdGVtcy5maWx0ZXIoaXRlbSA9PiBzYXZlZEl0ZW1zLmZpbmQoc2F2ZWRJdGVtID0+IHNhdmVkSXRlbS5faWQgPT09IGl0ZW0uaXRlbUlkKSk7XHJcblx0XHRjb25zdCBkZWxldGVJdGVtcyA9IHNhdmVkSXRlbXMuZmlsdGVyKGl0ZW0gPT4gIWV4aXN0aW5nSXRlbXMuZmluZChleGlzdGluZ0l0ZW0gPT4gZXhpc3RpbmdJdGVtLml0ZW1JZCA9PT0gaXRlbS5faWQpKTtcclxuXHRcdGNvbnN0IHVwZGF0ZUl0ZW1zID0gZXhpc3RpbmdJdGVtcy5maWx0ZXIoaXRlbSA9PiAhZGVsZXRlSXRlbXMuaW5jbHVkZXMoaXRlbSkpO1xyXG5cdFx0XHJcblx0XHQvLyBBZGQgbmV3IEl0ZW1zXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IG5ld0l0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHRoaXMuYWRkSXRlbShuZXdJdGVtc1tpXSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gRGVsZXRlIHJlbW92ZWQgSXRlbXNcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgZGVsZXRlSXRlbXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0SXRlbS5kZWxldGVPbmUoe19pZDogZGVsZXRlSXRlbXNbaV0uX2lkfSwgZXJyID0+IHtcclxuXHRcdFx0XHRpZiAoZXJyKSBjb25zb2xlLmxvZyhlcnIpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBVcGRhdGUgdGhlIHJlc3RcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdXBkYXRlSXRlbXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgaXRlbSA9IHVwZGF0ZUl0ZW1zW2ldO1xyXG5cdFx0XHRpZiAoIWl0ZW0pIGNvbnRpbnVlO1xyXG5cdFx0XHR0aGlzLnNhdmVJdGVtKGl0ZW0pO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuY29uc3QgZGIgPSBuZXcgRGF0YWJhc2UoKTtcclxuZXhwb3J0IGRlZmF1bHQgZGI7XHJcbiIsImltcG9ydCBkYiBmcm9tICcuL2RiLmpzJztcclxuaW1wb3J0IHNlcnZlciBmcm9tICcuL3NlcnZlci5qcyc7XHJcbmltcG9ydCBjb25maWcgZnJvbSAnLi9jb25maWcuanMnO1xyXG5cclxuaW1wb3J0IE1hcCBmcm9tICcuL2NsYXNzZXMvbWFwLmpzJztcclxuaW1wb3J0IFBsYXllciBmcm9tICcuL2NsYXNzZXMvcGxheWVyLmpzJztcclxuaW1wb3J0IEJvdCBmcm9tICcuL2NsYXNzZXMvYm90LmpzJztcclxuaW1wb3J0IEl0ZW0gZnJvbSAnLi9jbGFzc2VzL2l0ZW0uanMnO1xyXG5pbXBvcnQgRWZmZWN0IGZyb20gJy4vY2xhc3Nlcy9lZmZlY3QuanMnO1xyXG5pbXBvcnQgVGV4dCBmcm9tICcuL2NsYXNzZXMvdGV4dC5qcyc7XHJcbmltcG9ydCBNZXNzYWdlIGZyb20gJy4vY2xhc3Nlcy9tZXNzYWdlLmpzJztcclxuXHJcbmNsYXNzIEdhbWUge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0dGhpcy5tYXBzID0gW107XHJcblx0XHR0aGlzLnBsYXllcnMgPSBbXTtcclxuXHRcdHRoaXMuYm90cyA9IFtdO1xyXG5cdFx0dGhpcy5pdGVtcyA9IFtdO1xyXG5cdFx0dGhpcy5lZmZlY3RzID0gW107XHJcblx0XHR0aGlzLnRleHRzID0gW107XHJcblx0XHR0aGlzLm1lc3NhZ2VRdWV1ZSA9IFtdO1xyXG5cdFx0XHJcblx0XHR0aGlzLnBsYXllclRlbXBsYXRlcyA9IHt9O1xyXG5cdFx0dGhpcy5ib3RUZW1wbGF0ZXMgPSB7fTtcclxuXHRcdHRoaXMuaXRlbVRlbXBsYXRlcyA9IHt9O1xyXG5cclxuXHRcdHRoaXMubG9hZE1hcHMoKTtcclxuXHRcdHRoaXMubG9hZFBsYXllclRlbXBsYXRlcygpO1xyXG5cdFx0dGhpcy5sb2FkQm90VGVtcGxhdGVzKCk7XHJcblx0XHR0aGlzLmxvYWRJdGVtVGVtcGxhdGVzKCk7XHJcblx0XHR0aGlzLmxvYWRDb21tYW5kcygpO1xyXG5cdFx0dGhpcy5sb2FkSXRlbXMoKTtcclxuXHRcdHRoaXMubG9hZEJvdHMoKTtcclxuXHR9XHJcblxyXG5cdGFzeW5jIGxvYWRNYXBzKCkge1xyXG5cdFx0bGV0IG1hcERhdGEgPSBhd2FpdCBkYi5nZXRBbGxNYXBzKCk7XHJcblx0XHRjb25zdCBvcmRlcmVkTWFwRGF0YSA9IFtdO1xyXG5cclxuXHRcdGZvciAobGV0IGlkID0gMDsgaWQgPCBtYXBEYXRhLmxlbmd0aDsgaWQrKykge1xyXG5cdFx0XHRjb25zdCBkYXRhID0gbWFwRGF0YVtpZF07XHJcblx0XHRcdGlmIChkYXRhKSBvcmRlcmVkTWFwRGF0YVtkYXRhLm1hcElkXSA9IGRhdGE7XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yIChsZXQgaWQgPSAwOyBpZCA8IGNvbmZpZy5NQVhfTUFQUzsgaWQrKykge1xyXG5cdFx0XHRpZiAob3JkZXJlZE1hcERhdGFbaWRdKSB7XHJcblx0XHRcdFx0dGhpcy5tYXBzW2lkXSA9IG5ldyBNYXAoaWQsIG9yZGVyZWRNYXBEYXRhW2lkXSk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5tYXBzW2lkICsgMV0gPSBuZXcgTWFwKGlkKTtcclxuXHRcdFx0XHRkYi5zYXZlTWFwKHttYXBJZDogaWR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0bG9hZFBsYXllclRlbXBsYXRlcygpIHtcclxuXHRcdGRiLmdldEFsbFBsYXllclRlbXBsYXRlcygpXHJcblx0XHQudGhlbih0ZW1wbGF0ZXMgPT4ge1xyXG5cdFx0XHR0aGlzLnBsYXllclRlbXBsYXRlcyA9IHt9O1xyXG5cdFx0XHR0ZW1wbGF0ZXMuZm9yRWFjaCh0ZW1wbGF0ZSA9PiB7XHJcblx0XHRcdFx0dGhpcy5wbGF5ZXJUZW1wbGF0ZXNbdGVtcGxhdGUuX2lkXSA9IHRlbXBsYXRlO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pLmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblxyXG5cdGxvYWRCb3RUZW1wbGF0ZXMoKSB7XHJcblx0XHRkYi5nZXRBbGxCb3RUZW1wbGF0ZXMoKVxyXG5cdFx0LnRoZW4odGVtcGxhdGVzID0+IHtcclxuXHRcdFx0dGhpcy5ib3RUZW1wbGF0ZXMgPSB7fTtcclxuXHRcdFx0dGVtcGxhdGVzLmZvckVhY2godGVtcGxhdGUgPT4ge1xyXG5cdFx0XHRcdHRoaXMuYm90VGVtcGxhdGVzW3RlbXBsYXRlLl9pZF0gPSB0ZW1wbGF0ZTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KS5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cclxuXHRsb2FkSXRlbVRlbXBsYXRlcygpIHtcclxuXHRcdGRiLmdldEFsbEl0ZW1UZW1wbGF0ZXMoKVxyXG5cdFx0LnRoZW4odGVtcGxhdGVzID0+IHtcclxuXHRcdFx0dGhpcy5pdGVtVGVtcGxhdGVzID0ge307XHJcblx0XHRcdHRlbXBsYXRlcy5mb3JFYWNoKHRlbXBsYXRlID0+IHtcclxuXHRcdFx0XHR0ZW1wbGF0ZS50eXBlID0gY29uZmlnLklURU1fVFlQRVNbdGVtcGxhdGUuaXRlbVR5cGVdO1xyXG5cdFx0XHRcdHRoaXMuaXRlbVRlbXBsYXRlc1t0ZW1wbGF0ZS5faWRdID0gdGVtcGxhdGU7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSkuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHJcblx0bG9hZENvbW1hbmRzKCkge1xyXG5cdFx0dGhpcy5jb21tYW5kcyA9IHtcclxuXHRcdFx0bW92ZTogKGRhdGEsIHBsYXllcikgPT4gcGxheWVyLmlucHV0LmRpcmVjdGlvbiA9IGRhdGEuZGlyZWN0aW9uLFxyXG5cdFx0XHRydW46IChkYXRhLCBwbGF5ZXIpID0+IHBsYXllci5pbnB1dC5ydW4gPSBkYXRhLnN0YXRlLFxyXG5cdFx0XHRwaWNrdXA6IChkYXRhLCBwbGF5ZXIpID0+IHtcclxuXHRcdFx0XHRpZiAoIXBsYXllci5pbnB1dC5waWNrdXAgJiYgZGF0YS5zdGF0ZSkgcGxheWVyLnBpY2tVcCgpO1xyXG5cdFx0XHRcdHBsYXllci5pbnB1dC5waWNrdXAgPSBkYXRhLnN0YXRlO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRhdHRhY2s6IChkYXRhLCBwbGF5ZXIpID0+IHtcclxuXHRcdFx0XHRwbGF5ZXIuaW5wdXQuYXR0YWNrID0gZGF0YS5zdGF0ZTtcclxuXHRcdFx0XHRwbGF5ZXIuYXR0YWNrKDEsIHBsYXllci5kaXJlY3Rpb24pO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRkb3VibGVDbGlja0l0ZW06IChkYXRhLCBwbGF5ZXIpID0+IHBsYXllci51c2VJdGVtKGRhdGEuc2xvdCksXHJcblx0XHRcdHJpZ2h0Q2xpY2tJdGVtOiAoZGF0YSwgcGxheWVyKSA9PiBwbGF5ZXIuZHJvcEl0ZW0oZGF0YS5zbG90KSxcclxuXHRcdFx0ZHJhZ1N0b3BHYW1lOiAoZGF0YSwgcGxheWVyKSA9PiBwbGF5ZXIuZHJvcEl0ZW0oZGF0YS5zbG90KSxcclxuXHRcdFx0ZHJhZ1N0b3BJbnZlbnRvcnk6IChkYXRhLCBwbGF5ZXIpID0+IHBsYXllci5tb3ZlSXRlbVRvU2xvdChkYXRhLnNsb3QsIGRhdGEubmV3U2xvdCksXHJcblx0XHRcdGRyYWdTdG9wRXF1aXBtZW50OiAoZGF0YSwgcGxheWVyKSA9PiBwbGF5ZXIubW92ZUl0ZW1Ub1Nsb3QoZGF0YS5zbG90LCBkYXRhLm5ld1Nsb3QpLFxyXG5cdFx0XHRzZXJ2ZXJDaGF0OiAoZGF0YSwgcGxheWVyKSA9PiBnYW1lLnNlbmRNZXNzYWdlR2xvYmFsKHBsYXllci5nYW1lSWQsIGAke3BsYXllci5uYW1lfSB5ZWxscywgXCIke2RhdGEubWVzc2FnZX1cImApLFxyXG5cdFx0XHRtYXBDaGF0OiAoZGF0YSwgcGxheWVyKSA9PiBnYW1lLnNlbmRNZXNzYWdlTWFwKHBsYXllci5nYW1lSWQsIHBsYXllci5tYXBJZCwgYCR7cGxheWVyLm5hbWV9IHNheXMsIFwiJHtkYXRhLm1lc3NhZ2V9XCJgKSxcclxuXHRcdFx0cGxheWVyQ2hhdDogKGRhdGEsIHBsYXllcikgPT4ge1xyXG5cdFx0XHRcdGNvbnN0IHRhcmdldCA9IGdhbWUucGxheWVyc1tkYXRhLnRhcmdldElkXTtcclxuXHRcdFx0XHRpZiAodGFyZ2V0KSB7XHJcblx0XHRcdFx0XHRnYW1lLnNlbmRNZXNzYWdlUGxheWVyKHBsYXllci5nYW1lSWQsIHRhcmdldC5nYW1lSWQsIGAke3BsYXllci5uYW1lfSB3aGlzcGVycywgXCIke2RhdGEubWVzc2FnZX1cImApO1xyXG5cdFx0XHRcdFx0Z2FtZS5zZW5kTWVzc2FnZVBsYXllcihwbGF5ZXIuZ2FtZUlkLCBwbGF5ZXIuZ2FtZUlkLCBgWW91IHdoaXNwZXIgdG8gJHt0YXJnZXQubmFtZX0sIFwiJHtkYXRhLm1lc3NhZ2V9XCJgKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdG1hY3JvMTogKGRhdGEpID0+IHtcclxuXHRcdFx0XHRpZiAoZGF0YSkgdGhpcy5zcGF3bk1hcEl0ZW0oMSwgNSwgNSwgXCI1ZDI1YzUyMDBiMTI2YzAxMWM2YWYyOGRcIik7XHJcblx0XHRcdH0sXHJcblx0XHRcdG1hY3JvMjogKGRhdGEpID0+IHtcclxuXHRcdFx0XHRpZiAoZGF0YSkgdGhpcy5zcGF3bkJvdCgxLCA1LCA1LCBcIjVkMjVjM2FhNzZjYjZmMWZiYzEwZTdiZlwiKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0bWFjcm8zOiAoZGF0YSwgcGxheWVyKSA9PiB7XHJcblx0XHRcdFx0aWYgKGRhdGEpIHtcclxuXHRcdFx0XHRcdGlmIChwbGF5ZXIuc3ByaXRlID49IGNvbmZpZy5NQVhfU1BSSVRFUykgcGxheWVyLnNwcml0ZSA9IDE7XHJcblx0XHRcdFx0XHRlbHNlIHBsYXllci5zcHJpdGUrKztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdG1hY3JvNDogKGRhdGEpID0+IHtcclxuXHRcdFx0fSxcclxuXHJcblx0XHR9O1xyXG5cdFx0XHJcblx0XHR0aGlzLmdvZENvbW1hbmRzID0ge1xyXG5cdFx0XHRzcGF3bk1hcEl0ZW06IChkYXRhKSA9PiB0aGlzLnNwYXduTWFwSXRlbShkYXRhLmFyZ3NbMF0sIGRhdGEuYXJnc1sxXSwgZGF0YS5hcmdzWzJdLCBkYXRhLmFyZ3NbM10sIGRhdGEuYXJnc1s0XSksXHJcblx0XHRcdHNwYXduQm90OiAoZGF0YSkgPT4gdGhpcy5zcGF3bkJvdChkYXRhLmFyZ3NbMF0sIGRhdGEuYXJnc1sxXSwgZGF0YS5hcmdzWzJdLCBkYXRhLmFyZ3NbM10sIGRhdGEuYXJnc1s0XSksXHJcblx0XHRcdHNldFNwcml0ZTogKGRhdGEsIHBsYXllcikgPT4gcGxheWVyLnNwcml0ZSA9IGRhdGEuYXJnc1swXVxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdGFzeW5jIGxvYWRJdGVtcygpIHtcclxuXHRcdGxldCBpdGVtRGF0YSA9IGF3YWl0IGRiLmdldEFsbEl0ZW1zKCk7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1EYXRhLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IGl0ZW0gPSBpdGVtRGF0YVtpXTtcclxuXHRcdFx0aWYgKCFpdGVtKSBjb250aW51ZTtcclxuXHRcdFx0aXRlbS50ZW1wbGF0ZS50eXBlID0gY29uZmlnLklURU1fVFlQRVNbaXRlbS50ZW1wbGF0ZS5pdGVtVHlwZV1cclxuXHRcdFx0bmV3IEl0ZW0oaXRlbSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdGFzeW5jIGxvYWRCb3RzKCkge1xyXG5cdFx0bGV0IGJvdERhdGEgPSBhd2FpdCBkYi5nZXRBbGxCb3RzKCk7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGJvdERhdGEubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0bmV3IEJvdChib3REYXRhW2ldKTtcclxuXHRcdH1cclxuXHR9XHJcblx0cmVxdWVzdERCSWQoKSB7XHJcblx0XHRyZXR1cm4gZGIuZ2VuZXJhdGVJZCgpO1xyXG5cdH1cclxuXHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHRjb25zdCBwYWNrID0ge1xyXG5cdFx0XHRwbGF5ZXJzOiBbXSxcclxuXHRcdFx0Ym90czogW10sXHJcblx0XHRcdGl0ZW1zOiBbXSxcclxuXHRcdFx0ZWZmZWN0czogW10sXHJcblx0XHRcdHRleHRzOiBbXSxcclxuXHRcdFx0bWVzc2FnZXM6IFtdLmNvbmNhdCh0aGlzLm1lc3NhZ2VRdWV1ZSlcclxuXHRcdH07XHJcblx0XHR0aGlzLm1lc3NhZ2VRdWV1ZSA9IFtdO1xyXG5cclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IHBsYXllciA9IHRoaXMucGxheWVyc1tpXTtcclxuXHRcdFx0aWYgKHBsYXllciAhPSBudWxsKSBwYWNrLnBsYXllcnNbcGxheWVyLmdhbWVJZF0gPSBwbGF5ZXIudXBkYXRlKGRlbHRhKTtcclxuXHRcdH1cclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ib3RzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IGJvdCA9IHRoaXMuYm90c1tpXTtcclxuXHRcdFx0aWYgKGJvdCkgcGFjay5ib3RzW2JvdC5nYW1lSWRdID0gYm90LnVwZGF0ZShkZWx0YSk7XHJcblx0XHR9XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgaXRlbSA9IHRoaXMuaXRlbXNbaV07XHJcblx0XHRcdGlmIChpdGVtKSBwYWNrLml0ZW1zW2l0ZW0uZ2FtZUlkXSA9IGl0ZW0udXBkYXRlKGRlbHRhKTtcclxuXHRcdH1cclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5lZmZlY3RzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IGVmZmVjdCA9IHRoaXMuZWZmZWN0c1tpXTtcclxuXHRcdFx0aWYgKGVmZmVjdCkgcGFjay5lZmZlY3RzW2VmZmVjdC5pZF0gPSBlZmZlY3QudXBkYXRlKGRlbHRhKTtcclxuXHRcdH1cclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy50ZXh0cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRjb25zdCB0ZXh0ID0gdGhpcy50ZXh0c1tpXTtcclxuXHRcdFx0aWYgKHRleHQpIHBhY2sudGV4dHNbdGV4dC5nYW1lSWRdID0gdGV4dC51cGRhdGUoZGVsdGEpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHBhY2s7XHJcblx0fVxyXG5cclxuXHRnZXREQlBhY2soKSB7XHJcblx0XHRjb25zdCBkYlBhY2sgPSB7XHJcblx0XHRcdHBsYXllcnM6IFtdLFxyXG5cdFx0XHRib3RzOiBbXSxcclxuXHRcdFx0aXRlbXM6IFtdXHJcblx0XHR9O1xyXG5cdFx0dGhpcy5wbGF5ZXJzLmZvckVhY2gocGxheWVyID0+IGRiUGFjay5wbGF5ZXJzLnB1c2gocGxheWVyLmdldERCUGFjaygpKSk7XHJcblx0XHR0aGlzLmJvdHMuZm9yRWFjaChib3QgPT4gZGJQYWNrLmJvdHMucHVzaChib3QuZ2V0REJQYWNrKCkpKTtcclxuXHRcdHRoaXMuaXRlbXMuZm9yRWFjaChpdGVtID0+IGRiUGFjay5pdGVtcy5wdXNoKGl0ZW0uZ2V0REJQYWNrKCkpKTtcclxuXHRcdHJldHVybiBkYlBhY2s7XHJcblx0fVxyXG5cclxuXHQvLyBQbGF5ZXJzXHJcblx0cGxheWVyTG9naW4oc29ja2V0LCBkYXRhKSB7XHJcblx0XHRmb3IgKGxldCBwbGF5ZXIgb2YgdGhpcy5wbGF5ZXJzKSB7XHJcblx0XHRcdGlmIChwbGF5ZXIgJiYgcGxheWVyLm5hbWUgPT09IGRhdGEubmFtZSkge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiUGxheWVyIGlzIGFscmVhZHkgc2lnbmVkIGluLlwiKTtcclxuXHRcdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHBsYXllciA9IG5ldyBQbGF5ZXIoc29ja2V0LCBkYXRhKTtcclxuXHRcdGRiLmxvZyhgJHtzb2NrZXQuaWR9IC0gJHtwbGF5ZXIubmFtZX0gaGFzIGxvZ2dlZCBpbi5gKTtcclxuXHRcdHRoaXMuc2VuZEdhbWVJbmZvR2xvYmFsKGAke3BsYXllci5uYW1lfSBoYXMgbG9nZ2VkIGluLmApO1xyXG5cdFx0cmV0dXJuIHBsYXllcjtcclxuXHR9XHJcblx0cGxheWVyTG9nb3V0KHBsYXllcklkKSB7XHJcblx0XHRsZXQgcGxheWVyID0gdGhpcy5wbGF5ZXJzW3BsYXllcklkXTtcclxuXHRcdGlmIChwbGF5ZXIpIHtcclxuXHRcdFx0Y29uc3QgcGxheWVyRGF0YSA9IHBsYXllci5nZXREQlBhY2soKVxyXG5cdFx0XHRkYi5sb2coYCR7cGxheWVyLnNvY2tldC5pZH0gLSAke3BsYXllci5uYW1lfSBoYXMgbG9nZ2VkIG91dC5gKTtcclxuXHRcdFx0dGhpcy5zZW5kR2FtZUluZm9HbG9iYWwoYCR7cGxheWVyLm5hbWV9IGhhcyBsb2dnZWQgb3V0LmApO1xyXG5cdFx0XHRkZWxldGUgdGhpcy50ZXh0c1twbGF5ZXIuZGlzcGxheU5hbWVJZF07XHJcblx0XHRcdGRlbGV0ZSB0aGlzLnBsYXllcnNbcGxheWVySWRdO1xyXG5cdFx0XHRkYi5zYXZlUGxheWVyKHBsYXllckRhdGEpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRnZXRFeHBUb0xldmVsKGxldmVsKSB7XHJcblx0XHRsZXQgZXhwID0gMTA7XHJcblx0XHRmb3IgKGxldCBpID0gMTsgaSA8IGNvbmZpZy5NQVhfTEVWRUw7IGkrKykge1xyXG5cdFx0XHRpZiAoaSA9PT0gbGV2ZWwpIHJldHVybiBleHA7XHJcblx0XHRcdGV4cCA9IChleHAgKyAoZXhwICUgMikpICogMS41O1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gR2FtZSBJbmZvXHJcblx0c2VuZEdhbWVJbmZvR2xvYmFsKG1lc3NhZ2UpIHtcclxuXHRcdHRoaXMubWVzc2FnZVF1ZXVlLnB1c2gobmV3IE1lc3NhZ2UobnVsbCwgbWVzc2FnZSwgJ2dhbWVJbmZvJykpO1xyXG5cdH1cclxuXHRzZW5kR2FtZUluZm9NYXAobWFwSWQsIG1lc3NhZ2UpIHtcclxuXHRcdHRoaXMubWVzc2FnZVF1ZXVlLnB1c2gobmV3IE1lc3NhZ2UobnVsbCwgbWVzc2FnZSwgJ2dhbWVJbmZvJywgbWFwSWQpKTtcclxuXHR9XHJcblx0c2VuZEdhbWVJbmZvUGxheWVyKGlkLCBtZXNzYWdlKSB7XHJcblx0XHR0aGlzLm1lc3NhZ2VRdWV1ZS5wdXNoKG5ldyBNZXNzYWdlKG51bGwsIG1lc3NhZ2UsICdnYW1lSW5mbycsIG51bGwsIGlkKSk7XHJcblx0fVxyXG5cdFxyXG5cdC8vIENoYXQgTWVzc2FnZXNcclxuXHRzZW5kTWVzc2FnZUdsb2JhbChzZW5kZXJJZCwgbWVzc2FnZSkge1xyXG5cdFx0dGhpcy5tZXNzYWdlUXVldWUucHVzaChuZXcgTWVzc2FnZShzZW5kZXJJZCwgbWVzc2FnZSwgJ21lc3NhZ2VHbG9iYWwnKSk7XHJcblx0fVxyXG5cdHNlbmRNZXNzYWdlTWFwKHNlbmRlcklkLCBtYXBJZCwgbWVzc2FnZSkge1xyXG5cdFx0dGhpcy5tZXNzYWdlUXVldWUucHVzaChuZXcgTWVzc2FnZShzZW5kZXJJZCwgbWVzc2FnZSwgJ21lc3NhZ2VNYXAnLCBtYXBJZCkpO1xyXG5cdH1cclxuXHRzZW5kTWVzc2FnZVBsYXllcihzZW5kZXJJZCwgaWQsIG1lc3NhZ2UpIHtcclxuXHRcdHRoaXMubWVzc2FnZVF1ZXVlLnB1c2gobmV3IE1lc3NhZ2Uoc2VuZGVySWQsIG1lc3NhZ2UsICdtZXNzYWdlUGxheWVyJywgbnVsbCwgaWQpKTtcclxuXHR9XHJcblxyXG5cdC8vIE1hcFxyXG5cdHNlbmRNYXBEYXRhKHNvY2tldCwgbWFwSWQpIHtcclxuXHRcdHNlcnZlci5zZW5kTWFwRGF0YShzb2NrZXQsIG1hcElkKTtcclxuXHR9XHJcblxyXG5cdGlzVmFjYW50KG1hcElkLCB4LCB5KSB7XHJcblx0XHQvLyBDaGVjayBmb3IgTWFwIEVkZ2VzXHJcblx0XHRpZiAoeCA8IDAgfHwgeCA+PSBjb25maWcuTUFQX0NPTFVNTlMgfHwgeSA8IDAgfHwgeSA+PSBjb25maWcuTUFQX1JPV1MpIHJldHVybiBmYWxzZTtcclxuXHRcdFxyXG5cdFx0Ly8gQ2hlY2sgZm9yIFdhbGwgVGlsZXNcclxuXHRcdGNvbnN0IG1hcCA9IHRoaXMubWFwc1ttYXBJZF07XHJcblx0XHRpZiAobWFwLmlzV2FsbFt5XVt4XSkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHJcblx0XHQvLyBDaGVjayBmb3IgQWN0b3JzXHJcblx0XHRjb25zdCBhY3Rvckxpc3QgPSB0aGlzLnBsYXllcnMuY29uY2F0KHRoaXMuYm90cyk7XHJcblx0XHRjb25zdCBhY3RvcnNPblRpbGUgPSBhY3Rvckxpc3QuZmlsdGVyKGFjdG9yID0+IHtcclxuXHRcdFx0cmV0dXJuIGFjdG9yLm1hcElkID09PSBtYXBJZCAmJiBhY3Rvci54ID09PSB4ICYmIGFjdG9yLnkgPT09IHkgJiYgIWFjdG9yLmlzRGVhZDtcclxuXHRcdH0pO1xyXG5cdFx0aWYgKGFjdG9yc09uVGlsZS5sZW5ndGggPiAwKSByZXR1cm4gZmFsc2U7XHJcblxyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cclxuXHRzcGF3bkJvdChtYXBJZCwgeCwgeSwgdGVtcGxhdGVJZCwgZGlyZWN0aW9uID0gJ2Rvd24nKSB7XHJcblx0XHRjb25zdCB0ZW1wbGF0ZSA9IHRoaXMuYm90VGVtcGxhdGVzW3RlbXBsYXRlSWRdO1xyXG5cdFx0aWYgKHRlbXBsYXRlKSB7XHJcblx0XHRcdG5ldyBCb3Qoe21hcElkLCB4LCB5LCBkaXJlY3Rpb24sIHRlbXBsYXRlfSk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJCb3QgVGVtcGxhdGUgZG9lcyBub3QgZXhpc3Qgd2l0aCB0aGF0IElkXCIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRzcGF3bk1hcEl0ZW0obWFwSWQsIHgsIHksIHRlbXBsYXRlSWQsIHN0YWNrID0gMCkge1xyXG5cdFx0bGV0IHRlbXBsYXRlID0gdGhpcy5pdGVtVGVtcGxhdGVzW3RlbXBsYXRlSWRdO1xyXG5cdFx0aWYgKHRlbXBsYXRlKSB7XHJcblx0XHRcdG5ldyBJdGVtKHttYXBJZCwgeCwgeSwgdGVtcGxhdGUsIHN0YWNrfSk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJJdGVtIFRlbXBsYXRlIGRvZXMgbm90IGV4aXN0IHdpdGggdGhhdCBJZFwiKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHNwYXduRGFtYWdlVGV4dChtYXBJZCwgeCwgeSwgZGFtYWdlKSB7XHJcblx0XHRuZXcgVGV4dChtYXBJZCwgeCwgeSArIDAuNSwgZGFtYWdlLCAnI2ZmMDAwMCcsIDEuMjUsIDAsIC0xKTtcclxuXHR9XHJcblxyXG5cdHNwYXduRWZmZWN0KG1hcElkLCB4LCB5LCBzcHJpdGUsIGxvb3AsIHNwZWVkLCBtYXhGcmFtZSwgc3RhcnRGcmFtZSkge1xyXG5cdFx0bmV3IEVmZmVjdChtYXBJZCwgeCwgeSwgc3ByaXRlLCBsb29wLCBzcGVlZCwgbWF4RnJhbWUsIHN0YXJ0RnJhbWUpO1xyXG5cdH1cclxufVxyXG5cclxuY29uc3QgZ2FtZSA9IG5ldyBHYW1lKCk7XHJcbmV4cG9ydCBkZWZhdWx0IGdhbWU7XHJcbiIsIi8qKiogR2FtZSBMb29wICoqKi9cclxuLyogS2VlcHMgdHJhY2sgb2YgdGltZSBhbmQgY28tb3JkaW5hdGVzIHRoZSBnYW1lIGFuZCBzZXJ2ZXIgKi9cclxuXHJcbmltcG9ydCBOb2RlR2FtZUxvb3AgZnJvbSAnbm9kZS1nYW1lbG9vcCc7XHJcblxyXG5pbXBvcnQgZGIgZnJvbSAnLi9kYi5qcyc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4vZ2FtZS5qcyc7XHJcbmltcG9ydCBzZXJ2ZXIgZnJvbSAnLi9zZXJ2ZXIuanMnO1xyXG5pbXBvcnQgY29uZmlnIGZyb20gJy4vY29uZmlnLmpzJztcclxuXHJcbmNsYXNzIEdhbWVMb29wIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHRoaXMudGltZXIgPSB7XHJcblx0XHRcdGJhY2t1cDogMCxcclxuXHRcdFx0bWludXRlOiAwXHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuaWQgPSBOb2RlR2FtZUxvb3Auc2V0R2FtZUxvb3AoKGRlbHRhKSA9PiB0aGlzLnVwZGF0ZShkZWx0YSksIGNvbmZpZy5GUkFNRVJBVEUpO1xyXG5cdH1cclxuXHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHQvLyBJbmNyZWFzZSBUaW1lcnNcclxuXHRcdHRoaXMudGltZXIuYmFja3VwICs9IGRlbHRhO1xyXG5cdFx0dGhpcy50aW1lci5taW51dGUgKz0gZGVsdGE7XHJcblxyXG5cdFx0Ly8gVXBkYXRlIHRoZSBnYW1lIHN0YXRlXHJcblx0XHRsZXQgdXBkYXRlUGFjayA9IGdhbWUudXBkYXRlKGRlbHRhKTtcclxuXHRcdC8vIFNlbmQgdXBkYXRlZCBzdGF0ZSB0byBjbGllbnRzXHJcblx0XHRzZXJ2ZXIuc2VuZFVwZGF0ZVBhY2sodXBkYXRlUGFjayk7XHJcblx0XHRcclxuXHRcdC8vIE1pbnV0ZSB0aW1lciBzY3JpcHRcclxuXHRcdGlmICh0aGlzLnRpbWVyLm1pbnV0ZSA+PSA2MCkge1xyXG5cdFx0XHR0aGlzLnRpbWVyLm1pbnV0ZSAtPSA2MDtcclxuXHRcdFx0Ly8gVE9ETzogcnVuIG1pbnV0ZSB0aW1lciBzY3JpcHRcclxuXHRcdH1cclxuXHJcblx0XHQvLyBQZXJpb2RpYyBiYWNrdXAgdG8gZGF0YWJhc2VcclxuXHRcdGlmICh0aGlzLnRpbWVyLmJhY2t1cCA+PSBjb25maWcuQkFDS1VQX1RJTUUpIHtcclxuXHRcdFx0dGhpcy50aW1lci5iYWNrdXAgLT0gY29uZmlnLkJBQ0tVUF9USU1FO1xyXG5cdFx0XHRsZXQgZGJQYWNrID0gZ2FtZS5nZXREQlBhY2soKTtcclxuXHRcdFx0ZGIuYmFja3VwKGRiUGFjayk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5jb25zdCBnYW1lTG9vcCA9IG5ldyBHYW1lTG9vcCgpO1xyXG5leHBvcnQgZGVmYXVsdCBnYW1lTG9vcDtcclxuIiwiY29uc3Qga2V5cyA9IHtcclxuXHRtb25nbzoge1xyXG5cdFx0dXNlcjogXCJGYW5rYWRvcmVcIixcclxuXHRcdHBhc3M6IFwib2R5c3NleTFcIixcclxuXHR9LFxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQga2V5czsiLCJpbXBvcnQgZGIgZnJvbSAnLi9kYi5qcyc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4vZ2FtZS5qcyc7XHJcbmltcG9ydCBzZXJ2ZXIgZnJvbSAnLi9zZXJ2ZXIuanMnO1xyXG5pbXBvcnQgZ2FtZWxvb3AgZnJvbSAnLi9nYW1lbG9vcC5qcyc7XHJcbiIsImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XHJcblxyXG5jb25zdCBhY2NvdW50U2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYSh7XHJcbiAgX2lkOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCxcclxuICB1c2VybmFtZToge3R5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUsIHVuaXF1ZTogdHJ1ZX0sXHJcbiAgdXNlcm5hbWVMb3dlckNhc2U6IHt0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlLCB1bmlxdWU6IHRydWV9LFxyXG4gIHBhc3N3b3JkOiB7dHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZX0sXHJcbiAgZW1haWw6IHt0eXBlOiBTdHJpbmcsIG1hdGNoOiAvXigoW148PigpXFxbXFxdXFxcXC4sOzpcXHNAXCJdKyhcXC5bXjw+KClcXFtcXF1cXFxcLiw7Olxcc0BcIl0rKSopfChcIi4rXCIpKUAoKFxcW1swLTldezEsM31cXC5bMC05XXsxLDN9XFwuWzAtOV17MSwzfVxcLlswLTldezEsM31dKXwoKFthLXpBLVpcXC0wLTldK1xcLikrW2EtekEtWl17Mix9KSkkL30sXHJcbiAgdmVyaWZpZWQ6IHt0eXBlOiBCb29sZWFuLCBkZWZhdWx0OiBmYWxzZX0sXHJcbiAgYWRtaW46IHt0eXBlOiBCb29sZWFuLCBkZWZhdWx0OiBmYWxzZX1cclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBtb25nb29zZS5tb2RlbCgnQWNjb3VudCcsIGFjY291bnRTY2hlbWEpO1xyXG4iLCJpbXBvcnQgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xyXG5cclxuY29uc3QgYm90U2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYSh7XHJcbiAgX2lkOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCxcclxuICBtYXBJZDoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMX0sXHJcbiAgeDoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogNX0sXHJcbiAgeToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogNX0sXHJcbiAgdGVtcGxhdGU6IHt0eXBlOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCwgcmVmOiAnQm90VGVtcGxhdGUnLCByZXF1aXJlZDogdHJ1ZX0sXHJcbiAgZGlyZWN0aW9uOiB7dHlwZTogU3RyaW5nLCBkZWZhdWx0OiAnZG93bid9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWwoJ0JvdCcsIGJvdFNjaGVtYSk7XHJcbiIsImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XHJcblxyXG5jb25zdCBib3RUZW1wbGF0ZVNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoe1xyXG4gIF9pZDogbW9uZ29vc2UuU2NoZW1hVHlwZXMuT2JqZWN0SWQsXHJcbiAgbmFtZToge3R5cGU6IFN0cmluZywgZGVmYXVsdDogXCJCb3RcIn0sXHJcbiAgc3ByaXRlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuICBkYW1hZ2VCYXNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuICBkZWZlbmNlQmFzZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcbiAgaGVhbHRoTWF4QmFzZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMX0sXHJcbiAgZW5lcmd5TWF4QmFzZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMX0sXHJcbiAgaGVhbHRoUmVnZW5CYXNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuICBlbmVyZ3lSZWdlbkJhc2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDF9LFxyXG4gIHJhbmdlQmFzZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMX0sXHJcbiAgaG9zdGlsZToge3R5cGU6IEJvb2xlYW4sIGRlZmF1bHQ6IHRydWV9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWwoJ0JvdFRlbXBsYXRlJywgYm90VGVtcGxhdGVTY2hlbWEpO1xyXG4iLCJpbXBvcnQgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xyXG5cclxuY29uc3QgaXRlbVNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoe1xyXG4gIF9pZDogbW9uZ29vc2UuU2NoZW1hVHlwZXMuT2JqZWN0SWQsXHJcbiAgdGVtcGxhdGU6IHt0eXBlOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCwgcmVmOiAnSXRlbVRlbXBsYXRlJywgcmVxdWlyZWQ6IHRydWV9LFxyXG4gIHN0YWNrOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuICBwbGF5ZXJJZDoge3R5cGU6IG1vbmdvb3NlLlNjaGVtYVR5cGVzLk9iamVjdElkLCBkZWZhdWx0OiBudWxsfSxcclxuICBib3RJZDoge3R5cGU6IG1vbmdvb3NlLlNjaGVtYVR5cGVzLk9iamVjdElkLCBkZWZhdWx0OiBudWxsfSxcclxuICBzbG90OiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiBudWxsfSxcclxuICBtYXBJZDoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogbnVsbH0sXHJcbiAgeDoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogbnVsbH0sXHJcbiAgeToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogbnVsbH0sXHJcbiAgY3JlYXRlZEJ5OiB7dHlwZTogU3RyaW5nfSxcclxuICBjcmVhdGVkRGF0ZToge3R5cGU6IERhdGV9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWwoJ0l0ZW0nLCBpdGVtU2NoZW1hKTtcclxuIiwiaW1wb3J0IG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcclxuXHJcbmNvbnN0IGl0ZW1UZW1wbGF0ZVNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoe1xyXG5cdF9pZDogbW9uZ29vc2UuU2NoZW1hVHlwZXMuT2JqZWN0SWQsXHJcblx0bmFtZToge3R5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWV9LFxyXG5cdHNwcml0ZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMX0sXHJcblx0cmV1c2FibGU6IHt0eXBlOiBCb29sZWFuLCBkZWZhdWx0OiB0cnVlfSxcclxuXHRpdGVtVHlwZToge3R5cGU6IE51bWJlciwgcmVxdWlyZWQ6IHRydWV9LFxyXG5cdHBhc3NpdmVEYW1hZ2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG5cdHBhc3NpdmVEZWZlbmNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuXHRwYXNzaXZlSGVhbHRoTWF4OiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuXHRwYXNzaXZlRW5lcmd5TWF4OiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuXHRwYXNzaXZlSGVhbHRoUmVnZW46IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG5cdHBhc3NpdmVFbmVyZ3lSZWdlbjoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcblx0cGFzc2l2ZVJhbmdlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuXHRlcXVpcHBlZERhbWFnZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcblx0ZXF1aXBwZWREZWZlbmNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuXHRlcXVpcHBlZEhlYWx0aE1heDoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcblx0ZXF1aXBwZWRFbmVyZ3lNYXg6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG5cdGVxdWlwcGVkSGVhbHRoUmVnZW46IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG5cdGVxdWlwcGVkRW5lcmd5UmVnZW46IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG5cdGVxdWlwcGVkUmFuZ2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWwoJ0l0ZW1UZW1wbGF0ZScsIGl0ZW1UZW1wbGF0ZVNjaGVtYSk7XHJcbiIsImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XHJcblxyXG5jb25zdCBkZWZhdWx0VGlsZXMgPSBuZXcgQXJyYXkoNikuZmlsbChuZXcgQXJyYXkoMTIpLmZpbGwobmV3IEFycmF5KDEyKS5maWxsKDApKSk7XHJcbmNvbnN0IGZhbHNlTGF5ZXIgPSBuZXcgQXJyYXkoMTIpLmZpbGwobmV3IEFycmF5KDEyKS5maWxsKGZhbHNlKSk7XHJcbmNvbnN0IG51bGxMYXllciA9IG5ldyBBcnJheSgxMikuZmlsbChuZXcgQXJyYXkoMTIpLmZpbGwobnVsbCkpO1xyXG5cclxuY29uc3QgbWFwU2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYSh7XHJcblx0X2lkOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCxcclxuXHRtYXBJZDoge3R5cGU6IE51bWJlciwgcmVxdWlyZWQ6IHRydWV9LFxyXG5cdG5hbWU6IHt0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlfSxcclxuXHRkcm9wQ2hhbmNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxMDB9LFxyXG5cdGRyb3BBbW91bnRFUToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMX0sXHJcblx0dGlsZXM6IHt0eXBlOiBbW1tOdW1iZXJdXV0sIGRlZmF1bHQ6IGRlZmF1bHRUaWxlc30sXHJcblx0aXNXYWxsOiB7dHlwZTogW1tCb29sZWFuXV0sIGRlZmF1bHQ6IGZhbHNlTGF5ZXJ9LFxyXG5cdGlzSG9zdGlsZToge3R5cGU6IFtbQm9vbGVhbl1dLCBkZWZhdWx0OiBmYWxzZUxheWVyfSxcclxuXHRkYW1hZ2U6IHt0eXBlOiBbW051bWJlcl1dLCBkZWZhdWx0OiBudWxsTGF5ZXJ9LFxyXG5cdHdhcnBNYXA6IHt0eXBlOiBbW051bWJlcl1dLCBkZWZhdWx0OiBudWxsTGF5ZXJ9LFxyXG5cdHdhcnBYOiB7dHlwZTogW1tOdW1iZXJdXSwgZGVmYXVsdDogbnVsbExheWVyfSxcclxuXHR3YXJwWToge3R5cGU6IFtbTnVtYmVyXV0sIGRlZmF1bHQ6IG51bGxMYXllcn0sXHJcblx0ZXhpdExlZnQ6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG5cdGV4aXRSaWdodDoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcblx0ZXhpdFVwOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuXHRleGl0RG93bjoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWwoJ01hcCcsIG1hcFNjaGVtYSk7XHJcbiIsImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XHJcblxyXG5jb25zdCBwbGF5ZXJTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcclxuICBfaWQ6IG1vbmdvb3NlLlNjaGVtYVR5cGVzLk9iamVjdElkLFxyXG4gIGFjY291bnQ6IHt0eXBlOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCwgcmVmOiAnQWNjb3VudCcsIHJlcXVpcmVkOiB0cnVlfSxcclxuICBuYW1lOiB7dHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSwgdW5pcXVlOiB0cnVlfSxcclxuICBuYW1lTG93ZXJDYXNlOiB7dHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSwgdW5pcXVlOiB0cnVlfSxcclxuICB0ZW1wbGF0ZToge3R5cGU6IG1vbmdvb3NlLlNjaGVtYVR5cGVzLk9iamVjdElkLCByZWY6ICdQbGF5ZXJUZW1wbGF0ZScsIHJlcXVpcmVkOiB0cnVlfSxcclxuICBsZXZlbDoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMX0sXHJcbiAgZXhwZXJpZW5jZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcbiAgbWFwSWQ6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDF9LFxyXG4gIHg6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDV9LFxyXG4gIHk6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDV9LFxyXG4gIGRpcmVjdGlvbjoge3R5cGU6IFN0cmluZywgZGVmYXVsdDogJ2Rvd24nfSxcclxuICBhZG1pbkFjY2Vzczoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcbiAgc3ByaXRlOiBOdW1iZXJcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBtb25nb29zZS5tb2RlbCgnUGxheWVyJywgcGxheWVyU2NoZW1hKTtcclxuIiwiaW1wb3J0IG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcclxuXHJcbmNvbnN0IHBsYXllclRlbXBsYXRlU2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYSh7XHJcbiAgX2lkOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCxcclxuICBuYW1lOiB7dHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSwgdW5pcXVlOiB0cnVlfSxcclxuICBzcHJpdGU6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDF9LFxyXG4gIGRhbWFnZUJhc2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG4gIGRlZmVuY2VCYXNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuICBoZWFsdGhNYXhCYXNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuICBlbmVyZ3lNYXhCYXNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuICBoZWFsdGhSZWdlbkJhc2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDF9LFxyXG4gIGVuZXJneVJlZ2VuQmFzZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMX0sXHJcbiAgcmFuZ2VCYXNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuICBoZWFsdGhQZXJMZXZlbDoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcbiAgZW5lcmd5UGVyTGV2ZWw6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWwoJ1BsYXllclRlbXBsYXRlJywgcGxheWVyVGVtcGxhdGVTY2hlbWEpO1xyXG4iLCJpbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcclxuaW1wb3J0IGh0dHAgZnJvbSAnaHR0cCc7XHJcbmltcG9ydCBzb2NrZXRJTyBmcm9tICdzb2NrZXQuaW8nO1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuXHJcbmltcG9ydCBkYiBmcm9tICcuL2RiLmpzJztcclxuaW1wb3J0IGdhbWUgZnJvbSAnLi9nYW1lLmpzJztcclxuaW1wb3J0IGNvbmZpZyBmcm9tICcuL2NvbmZpZy5qcyc7XHJcblxyXG5jbGFzcyBTZXJ2ZXIge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0Y29uc3QgYXBwID0gZXhwcmVzcygpO1xyXG5cdFx0Y29uc3QgaHR0cFNlcnZlciA9IGh0dHAuU2VydmVyKGFwcCk7XHJcblx0XHRjb25zdCBpbyA9IHNvY2tldElPKGh0dHBTZXJ2ZXIpO1xyXG5cdFx0Y29uc3QgcG9ydCA9IHByb2Nlc3MuZW52LlBPUlQgfHwgY29uZmlnLlBPUlQ7XHJcblx0XHRjb25zdCBwdWJsaWNQYXRoID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uL2NsaWVudCcpO1xyXG5cdFx0XHJcblx0XHRhcHAuZ2V0KCcvJywgKHJlcSwgcmVzKSA9PiByZXMuc2VuZEZpbGUocHVibGljUGF0aCArICcvaW5kZXguaHRtbCcpKTtcclxuXHRcdGFwcC51c2UoJy9jbGllbnQnLCBleHByZXNzLnN0YXRpYyhwdWJsaWNQYXRoKSk7XHJcblx0XHRodHRwU2VydmVyLmxpc3Rlbihwb3J0LCAoKSA9PiBkYi5sb2coYFNlcnZlciBzdGFydGVkLiBMaXN0ZW5pbmcgb24gcG9ydCAke2h0dHBTZXJ2ZXIuYWRkcmVzcygpLnBvcnR9Li4uYCkpO1xyXG5cclxuXHRcdHRoaXMuc29ja2V0TGlzdCA9IHt9O1xyXG5cdFx0dGhpcy5hY3RpdmVBY2NvdW50cyA9IHt9O1xyXG5cclxuXHRcdGlvLnNvY2tldHMub24oJ2Nvbm5lY3QnLCBzb2NrZXQgPT4gdGhpcy5vbkNvbm5lY3Qoc29ja2V0KSk7XHJcblx0fVxyXG5cclxuXHQvKiBjb25uZWN0ID0+IHNpZ25pbiA9PiBzZWxlY3RwbGF5ZXJcclxuXHQqKiBjb25uZWN0IHdoZW4gcGFnZSBsb2FkcyAtIHNob3dzIHNpZ25pbiBwYWdlXHJcblx0Kiogc2lnbmluIHdoZW4gdXNlcm5hbWUgYW5kIHBhc3N3b3JkIGlzIHN1Ym1pdHRlZFxyXG4gXHQqKiBzZWxlY3RwbGF5ZXIgd2hlbiBjaGFyYWN0ZXIgaXMgY2hvc2VuIC0gbG9ncyBpbnRvIHRoZSBnYW1lXHJcblx0Ki9cclxuXHJcblx0Ly8gUmVjZWl2ZSBkYXRhIGZyb20gY2xpZW50c1xyXG5cdG9uQ29ubmVjdChzb2NrZXQpIHtcclxuXHRcdHRoaXMuc29ja2V0TGlzdFtzb2NrZXQuaWRdID0gc29ja2V0O1xyXG5cdFx0ZGIubG9nKGAke3NvY2tldC5pZH0gLSBTb2NrZXQgY29ubmVjdGVkLmApO1xyXG5cdFx0XHJcblx0XHRzb2NrZXQub24oJ2Rpc2Nvbm5lY3QnLCAoKSA9PiB0aGlzLm9uRGlzY29ubmVjdChzb2NrZXQpKTtcclxuXHRcdHNvY2tldC5vbignc2lnbnVwJywgKGRhdGEpID0+IHRoaXMub25TaWduVXAoc29ja2V0LCBkYXRhLnVzZXJuYW1lLCBkYXRhLnBhc3N3b3JkLCBkYXRhLmVtYWlsKSk7XHJcblx0XHRzb2NrZXQub24oJ3NpZ25pbicsIChkYXRhKSA9PiB0aGlzLm9uU2lnbkluKHNvY2tldCwgZGF0YS51c2VybmFtZSwgZGF0YS5wYXNzd29yZCkpO1xyXG5cdFx0c29ja2V0Lm9uKCdzaWdub3V0JywgKCkgPT4gdGhpcy5vblNpZ25PdXQoc29ja2V0KSk7XHJcblx0XHQvLyBUZWxsIGNsaWVudCB0aGV5IGhhdmUgY29ubmVjdGVkXHJcblx0fVxyXG5cclxuXHRhc3luYyBvbkRpc2Nvbm5lY3Qoc29ja2V0KSB7XHJcblx0XHRpZiAoc29ja2V0LnBsYXllcklkICE9IG51bGwgJiYgZ2FtZS5wbGF5ZXJzW3NvY2tldC5wbGF5ZXJJZF0pIGF3YWl0IHRoaXMub25Mb2dPdXQoc29ja2V0KTtcclxuXHRcdGlmIChzb2NrZXQuYWNjb3VudElkICYmIHRoaXMuYWN0aXZlQWNjb3VudHNbc29ja2V0LmFjY291bnRJZF0pIGF3YWl0IHRoaXMub25TaWduT3V0KHNvY2tldCk7XHJcblxyXG5cdFx0ZGIubG9nKGAke3NvY2tldC5pZH0gLSBTb2NrZXQgZGlzY29ubmVjdGVkLmApO1xyXG5cdFx0ZGVsZXRlIHRoaXMuc29ja2V0TGlzdFtzb2NrZXQuaWRdO1xyXG5cdH1cclxuXHJcblx0YXN5bmMgb25TaWduVXAoc29ja2V0LCB1c2VybmFtZSwgcGFzc3dvcmQsIGVtYWlsKSB7XHJcblx0XHRsZXQgYWNjb3VudElkID0gYXdhaXQgZGIuYWRkQWNjb3VudCh1c2VybmFtZSwgcGFzc3dvcmQsIGVtYWlsKTtcclxuXHRcdGlmIChhY2NvdW50SWQpIHtcclxuXHRcdFx0ZGIubG9nKGAke3NvY2tldC5pZH0gLSBBY2NvdW50IGFkZGVkOiAke3VzZXJuYW1lfWApO1xyXG5cdFx0XHRzb2NrZXQuZW1pdCgnc2lnbmVkVXAnLCB7dXNlcm5hbWUsIHBhc3N3b3JkfSk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0c29ja2V0LmVtaXQoJ3NpZ25lZFVwJywgbnVsbCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRhc3luYyBvblNpZ25Jbihzb2NrZXQsIHVzZXJuYW1lLCBwYXNzd29yZCkge1xyXG5cdFx0bGV0IHN1Y2Nlc3MgPSBhd2FpdCBkYi5hdXRoQWNjb3VudCh1c2VybmFtZSwgcGFzc3dvcmQpO1xyXG5cdFx0aWYgKCFzdWNjZXNzKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGBTaWduIGluIGZhaWxlZCBvbiB1c2VybmFtZSAke3VzZXJuYW1lfWApO1xyXG5cdFx0XHRzb2NrZXQuZW1pdCgnc2lnbmVkSW4nLCBmYWxzZSk7XHQvLyBUZWxsIGNsaWVudCBzaWduaW4gd2FzIG5vdCBzdWNjZXNzZnVsXHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgYWNjb3VudCA9IGF3YWl0IGRiLmdldEFjY291bnRCeVVzZXJuYW1lKHVzZXJuYW1lKTtcclxuXHRcdGlmICh0aGlzLmFjdGl2ZUFjY291bnRzW2FjY291bnQuX2lkXSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIlRoYXQgYWNjb3VudCBpcyBhbHJlYWR5IHNpZ25lZCBpbi5cIik7XHJcblx0XHRcdHNvY2tldC5lbWl0KCdzaWduZWRJbicsIGZhbHNlKTtcdC8vIFRlbGwgY2xpZW50IHRoYXQgYWNjb3VudCBpcyBhbHJlYWR5IHNpZ25lZCBpblxyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHNvY2tldC5hY2NvdW50SWQgPSBhY2NvdW50Ll9pZDtcclxuXHRcdHRoaXMuYWN0aXZlQWNjb3VudHNbYWNjb3VudC5faWRdID0gdXNlcm5hbWU7XHJcblxyXG5cdFx0c29ja2V0Lm9uKCdhZGRQbGF5ZXInLCAoZGF0YSkgPT4gdGhpcy5vbkFkZFBsYXllcihzb2NrZXQsIGRhdGEubmFtZSwgZGF0YS50ZW1wbGF0ZUlkKSk7XHJcblx0XHRzb2NrZXQub24oJ2xvZ2luJywgKG5hbWUpID0+IHRoaXMub25Mb2dJbihzb2NrZXQsIG5hbWUpKTtcclxuXHRcdHNvY2tldC5vbignbG9nb3V0JywgKCkgPT4gdGhpcy5vbkxvZ091dChzb2NrZXQpKTtcclxuXHRcdHNvY2tldC5vbignYWRkUGxheWVyVGVtcGxhdGUnLCAoZGF0YSkgPT4gdGhpcy5vbkFkZFBsYXllclRlbXBsYXRlKGRhdGEpKTtcclxuXHJcblx0XHRkYi5sb2coYCR7c29ja2V0LmlkfSAtICR7dXNlcm5hbWV9IHNpZ25lZCBpbi5gKTtcclxuXHRcdGxldCBwbGF5ZXJzID0gYXdhaXQgZGIuZ2V0UGxheWVyc0J5QWNjb3VudChhY2NvdW50Ll9pZCk7XHJcblx0XHRsZXQgcGxheWVyVGVtcGxhdGVzID0gYXdhaXQgZGIuZ2V0QWxsUGxheWVyVGVtcGxhdGVzKCk7XHJcblx0XHRzb2NrZXQuZW1pdCgnc2lnbmVkSW4nLCB7YWNjb3VudCwgcGxheWVycywgcGxheWVyVGVtcGxhdGVzfSk7XHJcblx0fVxyXG5cdFxyXG5cdGFzeW5jIG9uU2lnbk91dChzb2NrZXQpIHtcclxuXHRcdGlmIChzb2NrZXQucGxheWVySWQgIT0gbnVsbCkgYXdhaXQgdGhpcy5vbkxvZ091dChzb2NrZXQpO1xyXG5cdFx0XHJcblx0XHRpZiAoc29ja2V0LmFjY291bnRJZCkge1xyXG5cdFx0XHRjb25zdCB1c2VybmFtZSA9IHRoaXMuYWN0aXZlQWNjb3VudHNbc29ja2V0LmFjY291bnRJZF07XHJcblx0XHRcdGRiLmxvZyhgJHtzb2NrZXQuaWR9IC0gJHt1c2VybmFtZX0gc2lnbmVkIG91dC5gKTtcclxuXHRcdFx0ZGVsZXRlIHRoaXMuYWN0aXZlQWNjb3VudHNbc29ja2V0LmFjY291bnRJZF07XHJcblx0XHRcdHNvY2tldC5hY2NvdW50SWQgPSBudWxsO1xyXG5cdFx0XHRzb2NrZXQuZW1pdCgnc2lnbmVkT3V0Jyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRhc3luYyBvbkFkZFBsYXllcihzb2NrZXQsIG5hbWUsIHRlbXBsYXRlSWQpIHtcclxuXHRcdGxldCBwbGF5ZXJJZCA9IGF3YWl0IGRiLmFkZFBsYXllcihzb2NrZXQuYWNjb3VudElkLCBuYW1lLCB0ZW1wbGF0ZUlkKTtcclxuXHRcdGlmIChwbGF5ZXJJZCkge1xyXG5cdFx0XHRjb25zdCB1c2VybmFtZSA9IHRoaXMuYWN0aXZlQWNjb3VudHNbc29ja2V0LmFjY291bnRJZF07XHJcblx0XHRcdGRiLmxvZyhgJHtzb2NrZXQuaWR9IC0gJHtuYW1lfSBoYXMgYmVlbiBhZGRlZCBhcyBhIHBsYXllciB0byBhY2NvdW50ICR7dXNlcm5hbWV9LmApO1xyXG5cdFx0XHRzb2NrZXQuZW1pdCgncGxheWVyQWRkZWQnLCBwbGF5ZXJJZCk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0c29ja2V0LmVtaXQoJ3BsYXllckFkZGVkJywgbnVsbCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGFzeW5jIG9uQWRkUGxheWVyVGVtcGxhdGUoZGF0YSkge1xyXG5cdFx0bGV0IHN1Y2Nlc3MgPSBhd2FpdCBkYi5hZGRQbGF5ZXJUZW1wbGF0ZShkYXRhKTtcclxuXHRcdGlmIChzdWNjZXNzKSB7XHJcblx0XHRcdGdhbWUubG9hZFBsYXllclRlbXBsYXRlcygpO1xyXG5cdFx0XHRkYi5sb2coYCR7c29ja2V0LmlkfSAtICR7ZGF0YS5uYW1lfSBoYXMgYmVlbiBhZGRlZCBhcyBhIHBsYXllciB0ZW1wbGF0ZS5gKTtcclxuXHRcdFx0Ly8gVGVsbCBjbGllbnQgYWRkIHBsYXllciB3YXMgc3VjY2Vzc2Z1bFxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdC8vIFRlbGwgY2xpZW50IGFkZCBwbGF5ZXIgd2FzIG5vdCBzdWNjZXNzZnVsXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRhc3luYyBvbkxvZ0luKHNvY2tldCwgcGxheWVySWQpIHtcclxuXHRcdGlmICghc29ja2V0LmFjY291bnRJZCkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIk5vdCBzaWduZWQgaW50byBhY2NvdW50LlwiKTtcclxuXHRcdFx0c29ja2V0LmVtaXQoJ2xvZ2dlZEluJywgZmFsc2UpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRpZiAoc29ja2V0LnBsYXllcklkICE9IG51bGwpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJBbHJlYWR5IGxvZ2dlZCBpbi5cIik7XHJcblx0XHRcdHNvY2tldC5lbWl0KCdsb2dnZWRJbicsIGZhbHNlKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBwbGF5ZXJEYXRhID0gYXdhaXQgZGIuZ2V0UGxheWVyKHBsYXllcklkKTtcclxuXHRcdGlmICghcGxheWVyRGF0YSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIk5vIHBsYXllciB3aXRoIHRoYXQgbmFtZS5cIik7XHJcblx0XHRcdHNvY2tldC5lbWl0KCdsb2dnZWRJbicsIGZhbHNlKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChcIlwiK3NvY2tldC5hY2NvdW50SWQgIT09IFwiXCIrcGxheWVyRGF0YS5hY2NvdW50KSB7XHQvLyBDYXN0IHRvIHN0cmluZyBiZWZvcmUgY29tcGFyaXNvblxyXG5cdFx0XHRkYi5sb2coYEF0dGVtcHQgdG8gbG9naW4gdG8gcGxheWVyICgke3BsYXllckRhdGEubmFtZX0pIGZyb20gd3JvbmcgYWNjb3VudCAoJHtzb2NrZXQuYWNjb3VudElkfSkgb24gc29ja2V0ICR7c29ja2V0LmlkfS5gKTtcclxuXHRcdFx0c29ja2V0LmVtaXQoJ2xvZ2dlZEluJywgZmFsc2UpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgcGxheWVyID0gZ2FtZS5wbGF5ZXJMb2dpbihzb2NrZXQsIHBsYXllckRhdGEpO1xyXG5cdFx0aWYgKCFwbGF5ZXIpIHtcclxuXHRcdFx0c29ja2V0LmVtaXQoJ2xvZ2dlZEluJywgZmFsc2UpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHJcblx0XHRzb2NrZXQucGxheWVySWQgPSBwbGF5ZXIuZ2FtZUlkO1xyXG5cdFx0c29ja2V0Lm9uKCdpbnB1dCcsIChkYXRhKSA9PiBwbGF5ZXIuaW5wdXREYXRhKGRhdGEpKTtcclxuXHRcdHNvY2tldC5vbigndXBsb2FkTWFwJywgKGRhdGEpID0+IHtcclxuXHRcdFx0aWYgKHBsYXllci5hZG1pbkFjY2VzcyA+PSAyKSB0aGlzLm9uVXBsb2FkTWFwKGRhdGEpO1xyXG5cdFx0XHRlbHNlIGdhbWUuc2VuZEdhbWVJbmZvUGxheWVyKHBsYXllci5nYW1lSWQsIGBZb3UgZG9uJ3QgaGF2ZSBhY2Nlc3MgdG8gdGhhdCBjb21tYW5kLmApO1xyXG5cdFx0fSk7XHJcblx0XHRjb25zdCBtYXBEYXRhID0gZ2FtZS5tYXBzW3BsYXllci5tYXBJZF0uZ2V0UGFjaygpO1xyXG5cdFx0c29ja2V0LmVtaXQoJ2xvZ2dlZEluJywgbWFwRGF0YSk7XHJcblx0fVxyXG5cdFxyXG5cdGFzeW5jIG9uTG9nT3V0KHNvY2tldCkge1xyXG5cdFx0aWYgKHNvY2tldC5wbGF5ZXJJZCAhPSBudWxsKSB7XHJcblx0XHRcdGF3YWl0IGdhbWUucGxheWVyTG9nb3V0KHNvY2tldC5wbGF5ZXJJZCk7XHJcblx0XHRcdHNvY2tldC5wbGF5ZXJJZCA9IG51bGw7XHJcblx0XHRcdHNvY2tldC5lbWl0KCdsb2dnZWRPdXQnKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0YXN5bmMgb25VcGxvYWRNYXAoZGF0YSkge1xyXG5cdFx0bGV0IHN1Y2Nlc3MgPSBhd2FpdCBkYi5zYXZlTWFwKGRhdGEpO1xyXG5cdFx0aWYgKCFzdWNjZXNzKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiRmFpbGVkIHRvIHVwbG9hZCBtYXAuXCIpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRnYW1lLm1hcHNbZGF0YS5tYXBJZF0udXBsb2FkKGRhdGEpO1xyXG5cdFx0XHJcblx0XHRnYW1lLnBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XHJcblx0XHRcdGlmIChwbGF5ZXIubWFwSWQgPT09IGRhdGEubWFwSWQpIHtcclxuXHRcdFx0XHR0aGlzLnNlbmRNYXBEYXRhKHBsYXllci5zb2NrZXQsIHBsYXllci5tYXBJZCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0Ly8gU2VuZCBkYXRhIHRvIGNsaWVudHNcclxuXHRzZW5kVXBkYXRlUGFjayh1cGRhdGVQYWNrKSB7XHJcblx0XHRnYW1lLnBsYXllcnMuZm9yRWFjaChwbGF5ZXIgPT4ge1xyXG5cdFx0XHRjb25zdCBwYWNrID0ge1xyXG5cdFx0XHRcdGdhbWU6IHtcclxuXHRcdFx0XHRcdHBsYXllcnM6IFtdLFxyXG5cdFx0XHRcdFx0Ym90czogW10sXHJcblx0XHRcdFx0XHRpdGVtczogW10sXHJcblx0XHRcdFx0XHRlZmZlY3RzOiBbXSxcclxuXHRcdFx0XHRcdHRleHRzOiBbXVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0bWVudTogcGxheWVyLmdldFVJUGFjaygpLFxyXG5cdFx0XHRcdGNoYXRib3g6IHt9XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRmb3IgKGxldCBwbGF5ZXJEYXRhIG9mIHVwZGF0ZVBhY2sucGxheWVycykge1xyXG5cdFx0XHRcdGlmIChwbGF5ZXJEYXRhICYmICgocGxheWVyRGF0YS5tYXBJZCA9PT0gcGxheWVyLm1hcElkICYmIHBsYXllckRhdGEuaXNWaXNpYmxlKSB8fCBwbGF5ZXJEYXRhLnNvY2tldElkID09PSBwbGF5ZXIuc29ja2V0LmlkKSkge1xyXG5cdFx0XHRcdFx0cGFjay5nYW1lLnBsYXllcnNbcGxheWVyRGF0YS5nYW1lSWRdID0gcGxheWVyRGF0YTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0Zm9yIChsZXQgYm90IG9mIHVwZGF0ZVBhY2suYm90cykge1xyXG5cdFx0XHRcdGlmIChib3QgJiYgYm90Lm1hcElkID09PSBwbGF5ZXIubWFwSWQpIHBhY2suZ2FtZS5ib3RzW2JvdC5nYW1lSWRdID0gYm90O1xyXG5cdFx0XHR9XHJcblx0XHRcdGZvciAobGV0IGl0ZW0gb2YgdXBkYXRlUGFjay5pdGVtcykge1xyXG5cdFx0XHRcdGlmIChpdGVtICYmIGl0ZW0ubWFwSWQgPT09IHBsYXllci5tYXBJZCkgcGFjay5nYW1lLml0ZW1zW2l0ZW0uZ2FtZUlkXSA9IGl0ZW07XHJcblx0XHRcdH1cclxuXHRcdFx0Zm9yIChsZXQgZWZmZWN0IG9mIHVwZGF0ZVBhY2suZWZmZWN0cykge1xyXG5cdFx0XHRcdGlmIChlZmZlY3QgJiYgZWZmZWN0Lm1hcElkID09PSBwbGF5ZXIubWFwSWQpIHBhY2suZ2FtZS5lZmZlY3RzW2VmZmVjdC5nYW1lSWRdID0gZWZmZWN0O1xyXG5cdFx0XHR9XHJcblx0XHRcdGZvciAobGV0IHRleHQgb2YgdXBkYXRlUGFjay50ZXh0cykge1xyXG5cdFx0XHRcdGlmICh0ZXh0ICYmIHRleHQubWFwSWQgPT09IHBsYXllci5tYXBJZCkgcGFjay5nYW1lLnRleHRzW3RleHQuZ2FtZUlkXSA9IHRleHQ7XHJcblx0XHRcdH1cclxuXHJcblxyXG4vKiBcdFx0XHRwYWNrLmdhbWUucGxheWVycyA9IHVwZGF0ZVBhY2sucGxheWVycy5maWx0ZXIocGxheWVyRGF0YSA9PiBwbGF5ZXJEYXRhLnNvY2tldElkID09PSBwbGF5ZXIuc29ja2V0SWQgfHwgKHBsYXllckRhdGEubWFwSWQgPT09IHBsYXllci5tYXBJZCAmJiBwbGF5ZXJEYXRhLmlzVmlzaWJsZSkpO1xyXG5cdFx0XHRwYWNrLmdhbWUuYm90cyA9IHVwZGF0ZVBhY2suYm90cy5maWx0ZXIoYm90ID0+IGJvdC5tYXBJZCA9PT0gcGxheWVyLm1hcElkKTtcclxuXHRcdFx0cGFjay5nYW1lLml0ZW1zID0gdXBkYXRlUGFjay5pdGVtcy5maWx0ZXIoaXRlbSA9PiBpdGVtLm1hcElkID09PSBwbGF5ZXIubWFwSWQpO1xyXG5cdFx0XHRwYWNrLmdhbWUuZWZmZWN0cyA9IHVwZGF0ZVBhY2suZWZmZWN0cy5maWx0ZXIoZWZmZWN0ID0+IGVmZmVjdC5tYXBJZCA9PT0gcGxheWVyLm1hcElkKTtcclxuXHRcdFx0cGFjay5nYW1lLnRleHRzID0gdXBkYXRlUGFjay50ZXh0cy5maWx0ZXIodGV4dCA9PiB0ZXh0Lm1hcElkID09PSBwbGF5ZXIubWFwSWQpOyAqL1xyXG5cclxuXHRcdFx0cGFjay5jaGF0Ym94Lm1lc3NhZ2VzID0gdXBkYXRlUGFjay5tZXNzYWdlcy5maWx0ZXIobWVzc2FnZSA9PiB7XHJcblx0XHRcdFx0cmV0dXJuIChtZXNzYWdlLm1hcElkID09IG51bGwgJiYgbWVzc2FnZS5pZCA9PSBudWxsKSB8fCBwbGF5ZXIubWFwSWQgPT09IG1lc3NhZ2UubWFwSWQgfHwgcGxheWVyLmdhbWVJZCA9PT0gbWVzc2FnZS5pZDtcclxuXHRcdFx0fSk7XHJcblx0XHRcdFxyXG5cdFx0XHRwbGF5ZXIuc29ja2V0LmVtaXQoJ3VwZGF0ZScsIHBhY2spO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdFxyXG5cdHNlbmRNYXBEYXRhKHNvY2tldCwgbWFwSWQpIHtcclxuXHRcdGNvbnN0IG1hcERhdGEgPSBnYW1lLm1hcHNbbWFwSWRdLmdldFBhY2soKTtcclxuXHRcdHNvY2tldC5lbWl0KCdsb2FkTWFwJywgbWFwRGF0YSk7XHJcblx0fVxyXG5cclxuXHRhZGREZWZhdWx0VGVtcGxhdGVzKCkge1xyXG5cdFx0XHRcdC8vIGRiLmFkZFBsYXllclRlbXBsYXRlKHtcclxuXHRcdC8vIFx0bmFtZTogXCJLbmlnaHRcIixcclxuXHRcdC8vIFx0c3ByaXRlOiBcIjFcIixcclxuXHRcdC8vIFx0ZGFtYWdlQmFzZTogMTAsXHJcblx0XHQvLyBcdGRlZmVuY2VCYXNlOiAwLFxyXG5cdFx0Ly8gXHRoZWFsdGhNYXhCYXNlOiAyMCxcclxuXHRcdC8vIFx0ZW5lcmd5TWF4QmFzZTogNDAsXHJcblx0XHQvLyBcdGhlYWx0aFJlZ2VuQmFzZTogMSxcclxuXHRcdC8vIFx0ZW5lcmd5UmVnZW5CYXNlOiAxLFxyXG5cdFx0Ly8gXHRyYW5nZUJhc2U6IDEsXHJcblx0XHQvLyBcdGhlYWx0aFBlckxldmVsOiAxLFxyXG5cdFx0Ly8gXHRlbmVyZ3lQZXJMZXZlbDogMSxcclxuXHRcdC8vIH0pO1xyXG5cclxuXHRcdC8vIGRiLmFkZEJvdFRlbXBsYXRlKHtcclxuXHRcdC8vIFx0bmFtZTogXCJSYXRcIixcclxuXHRcdC8vIFx0c3ByaXRlOiBcIjNcIixcclxuXHRcdC8vIFx0ZGFtYWdlQmFzZTogMTAsXHJcblx0XHQvLyBcdGRlZmVuY2VCYXNlOiAwLFxyXG5cdFx0Ly8gXHRoZWFsdGhNYXhCYXNlOiAyMCxcclxuXHRcdC8vIFx0ZW5lcmd5TWF4QmFzZTogNDAsXHJcblx0XHQvLyBcdGhlYWx0aFJlZ2VuQmFzZTogMSxcclxuXHRcdC8vIFx0ZW5lcmd5UmVnZW5CYXNlOiAxLFxyXG5cdFx0Ly8gXHRyYW5nZUJhc2U6IDEsXHJcblx0XHQvLyBcdGhvc3RpbGU6IGZhbHNlLFxyXG5cdFx0Ly8gfSk7XHJcblx0XHRcclxuXHRcdC8vIGRiLmFkZEl0ZW1UZW1wbGF0ZSh7XHJcblx0XHQvLyBcdG5hbWU6IFwiU3dvcmRcIixcclxuXHRcdC8vIFx0aXRlbVR5cGVJZDogMixcclxuXHRcdC8vIFx0c3ByaXRlOiAxLFxyXG5cdFx0Ly8gXHRyZXVzYWJsZTogdHJ1ZSxcclxuXHRcdC8vIFx0cGFzc2l2ZURhbWFnZTogMCxcclxuXHRcdC8vIFx0cGFzc2l2ZURlZmVuY2U6IDAsXHJcblx0XHQvLyBcdHBhc3NpdmVIZWFsdGhNYXg6IDAsXHJcblx0XHQvLyBcdHBhc3NpdmVFbmVyZ3lNYXg6IDAsXHJcblx0XHQvLyBcdHBhc3NpdmVIZWFsdGhSZWdlbjogMCxcclxuXHRcdC8vIFx0cGFzc2l2ZUVuZXJneVJlZ2VuOiAwLFxyXG5cdFx0Ly8gXHRwYXNzaXZlUmFuZ2U6IDAsXHJcblx0XHQvLyBcdGVxdWlwcGVkRGFtYWdlOiAxLFxyXG5cdFx0Ly8gXHRlcXVpcHBlZERlZmVuY2U6IDAsXHJcblx0XHQvLyBcdGVxdWlwcGVkSGVhbHRoTWF4OiAwLFxyXG5cdFx0Ly8gXHRlcXVpcHBlZEVuZXJneU1heDogMCxcclxuXHRcdC8vIFx0ZXF1aXBwZWRIZWFsdGhSZWdlbjogMCxcclxuXHRcdC8vIFx0ZXF1aXBwZWRFbmVyZ3lSZWdlbjogMCxcclxuXHRcdC8vIFx0ZXF1aXBwZWRSYW5nZTogMCxcclxuXHRcdC8vIH0pO1xyXG5cdH1cclxufVxyXG5cclxuY29uc3Qgc2VydmVyID0gbmV3IFNlcnZlcigpO1xyXG5leHBvcnQgZGVmYXVsdCBzZXJ2ZXI7XHJcbiIsImZ1bmN0aW9uIGNyZWF0ZTJkQXJyYXkoY29sdW1ucywgcm93cywgZGVmYXVsdFZhbHVlKSB7XHJcbiAgY29uc3QgYXJyYXkgPSBbXTtcclxuICBmb3IgKGxldCB5ID0gMDsgeSA8IHJvd3M7IHkrKykge1xyXG4gICAgYXJyYXlbeV0gPSBbXTtcclxuICAgIGZvciAobGV0IHggPSAwOyB4IDwgY29sdW1uczsgeCsrKSB7XHJcbiAgICAgIGFycmF5W3ldW3hdID0gZGVmYXVsdFZhbHVlO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gYXJyYXk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZTNkQXJyYXkoY29sdW1ucywgcm93cywgbGF5ZXJzLCBkZWZhdWx0VmFsdWUpIHtcclxuICBjb25zdCBhcnJheSA9IFtdO1xyXG4gIGZvciAobGV0IHogPSAwOyB6IDwgbGF5ZXJzOyB6KyspIHtcclxuICAgIGFycmF5W3pdID0gW107IFxyXG4gICAgZm9yIChsZXQgeSA9IDA7IHkgPCByb3dzOyB5KyspIHtcclxuICAgICAgYXJyYXlbel1beV0gPSBbXTtcclxuICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBjb2x1bW5zOyB4KyspIHtcclxuICAgICAgICBhcnJheVt6XVt5XVt4XSA9IGRlZmF1bHRWYWx1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gYXJyYXk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNodWZmbGUoYXJyYXkpIHtcclxuICBsZXQgY3VycmVudEluZGV4ID0gYXJyYXkubGVuZ3RoO1xyXG4gIGxldCB0ZW1wO1xyXG4gIGxldCByYW5kb21JbmRleDtcclxuICB3aGlsZSAoY3VycmVudEluZGV4ICE9PSAwKSB7XHJcbiAgICByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGN1cnJlbnRJbmRleCk7XHJcbiAgICBjdXJyZW50SW5kZXggLT0gMTtcclxuICAgIHRlbXAgPSBhcnJheVtjdXJyZW50SW5kZXhdO1xyXG4gICAgYXJyYXlbY3VycmVudEluZGV4XSA9IGFycmF5W3JhbmRvbUluZGV4XTtcclxuICAgIGFycmF5W3JhbmRvbUluZGV4XSA9IHRlbXA7XHJcbiAgfVxyXG4gIHJldHVybiBhcnJheTtcclxufVxyXG5cclxuZnVuY3Rpb24gc3dhcChhcnJheSwgaSwgaikge1xyXG4gIGNvbnN0IHRlbXAgPSBhcnJheVtpXTtcclxuICBhcnJheVtpXSA9IGFycmF5W2pdO1xyXG4gIGFycmF5W2pdID0gdGVtcDtcclxufVxyXG5cclxuZnVuY3Rpb24gZmlyc3RFbXB0eUluZGV4KGFycmF5KSB7XHJcbiAgaWYgKGFycmF5Lmxlbmd0aCA8IDEpIHJldHVybiAwO1xyXG4gIFxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDw9IGFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICBpZiAoYXJyYXlbaV0gPT0gbnVsbCkgcmV0dXJuIGk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBsZXJwKHN0YXJ0LCBlbmQsIHRpbWUpIHtcclxuICAvL3JldHVybiBzdGFydCArICh0aW1lICogKGVuZCAtIHN0YXJ0KSk7XHJcbiAgcmV0dXJuICgoMSAtIHRpbWUpICogc3RhcnQpICsgKHRpbWUgKiBlbmQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjbGFtcCh2YWx1ZSwgbWluaW11bSwgbWF4aW11bSkge1xyXG4gIGlmICh2YWx1ZSA8IG1pbmltdW0pIHtcclxuICAgIHJldHVybiBtaW5pbXVtO1xyXG4gIH1cclxuICBlbHNlIGlmICh2YWx1ZSA+IG1heGltdW0pIHtcclxuICAgIHJldHVybiBtYXhpbXVtO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHJldHVybiB2YWx1ZTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJhbmRvbUludChtaW5pbXVtLCBtYXhpbXVtKSB7XHJcbiAgcmV0dXJuIE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiAobWF4aW11bSArIDEpKSArIG1pbmltdW0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRYRnJvbUluZGV4KGluZGV4LCBjb2x1bW5zKSB7XHJcbiAgcmV0dXJuIGluZGV4ICUgY29sdW1ucztcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0WUZyb21JbmRleChpbmRleCwgY29sdW1ucykge1xyXG4gIHJldHVybiAoaW5kZXggLSAoaW5kZXggJSBjb2x1bW5zKSkgLyBjb2x1bW5zO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRJbmRleEZyb21YWSh4LCB5LCBjb2x1bW5zKSB7XHJcbiAgcmV0dXJuICh5ICogY29sdW1ucykgKyB4O1xyXG59XHJcblxyXG5mdW5jdGlvbiB0aW1lc3RhbXAoZGF0ZSkge1xyXG4gIGlmICghKGRhdGUgaW5zdGFuY2VvZiBEYXRlKSkgcmV0dXJuIFwiSW52YWxpZCBkYXRlXCI7XHJcbiAgbGV0IG1vbnRoID0gZGF0ZS5nZXRNb250aCgpICsgMTtcclxuICBsZXQgZGF5ID0gZGF0ZS5nZXREYXRlKCk7XHJcbiAgbGV0IGhvdXIgPSBkYXRlLmdldEhvdXJzKCk7XHJcbiAgbGV0IG1pbnV0ZSA9IGRhdGUuZ2V0TWludXRlcygpO1xyXG4gIGxldCBzZWNvbmQgPSBkYXRlLmdldFNlY29uZHMoKTtcclxuICBpZiAobW9udGggPCAxMCkgbW9udGggPSBcIjBcIiArIG1vbnRoO1xyXG4gIGlmIChkYXkgPCAxMCkgZGF5ID0gXCIwXCIgKyBkYXk7XHJcbiAgaWYgKGhvdXIgPCAxMCkgaG91ciA9IFwiMFwiICsgaG91cjtcclxuICBpZiAobWludXRlIDwgMTApIG1pbnV0ZSA9IFwiMFwiICsgbWludXRlO1xyXG4gIGlmIChzZWNvbmQgPCAxMCkgc2Vjb25kID0gXCIwXCIgKyBzZWNvbmQ7XHJcbiAgcmV0dXJuIGAke2RhdGUuZ2V0RnVsbFllYXIoKX0tJHttb250aH0tJHtkYXl9ICR7aG91cn06JHttaW51dGV9OiR7c2Vjb25kfWA7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluZGVmaW5pdGVBcnRpY2xlKHdvcmQpIHtcclxuXHRsZXQgcmVnZXggPSAvdHJvdXNlcnMkfGplYW5zJHxnbGFzc2VzJC9pO1xyXG5cdGlmICh3b3JkLm1hdGNoKHJlZ2V4KSkgcmV0dXJuIFwiYSBwYWlyIG9mIFwiICsgd29yZDtcclxuXHJcblx0cmVnZXggPSAvXlthZWlvdV0vaTtcclxuXHRpZiAod29yZC5tYXRjaChyZWdleCkpIHJldHVybiBcImFuIFwiICsgd29yZDtcclxuXHJcblx0cmV0dXJuIFwiYSBcIiArIHdvcmQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBsdXJhbCh3b3JkKSB7XHJcblx0bGV0IHJlZ2V4ID0gL3NoZWVwJHxkZWVyJHxmaXNoJC9pO1xyXG5cdGlmICh3b3JkLm1hdGNoKHJlZ2V4KSkgcmV0dXJuIHdvcmQ7XHJcblxyXG5cdHJlZ2V4ID0gL3Ryb3VzZXJzJHxqZWFucyR8Z2xhc3NlcyQvaTtcclxuXHRpZiAod29yZC5tYXRjaChyZWdleCkpIHJldHVybiBcInBhaXJzIG9mIFwiICsgd29yZDtcclxuXHRcclxuXHRyZWdleCA9IC9zdG9tYWNoJHxlcG9jaCR8L2k7XHJcblx0aWYgKHdvcmQubWF0Y2gocmVnZXgpKSByZXR1cm4gd29yZCArIFwic1wiO1xyXG5cdFxyXG5cdHJlZ2V4ID0gL2YkfGZlJC9pO1xyXG5cdGlmICh3b3JkLm1hdGNoKHJlZ2V4KSkgcmV0dXJuIHdvcmQucmVwbGFjZShyZWdleCwgXCJ2ZXNcIik7XHJcblxyXG5cdHJlZ2V4ID0gL1tzeHpdJHxjaCR8c2gkfGF0byQvaTtcclxuXHRpZiAod29yZC5tYXRjaChyZWdleCkpIHJldHVybiB3b3JkICsgXCJlc1wiO1xyXG5cdFxyXG5cdHJlZ2V4ID0gL3kkL2k7XHJcblx0aWYgKHdvcmQubWF0Y2gocmVnZXgpKSByZXR1cm4gd29yZC5yZXBsYWNlKHJlZ2V4LCBcImllc1wiKTtcclxuXHRcclxuXHRyZXR1cm4gd29yZCArIFwic1wiO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgY3JlYXRlMmRBcnJheSxcclxuICBjcmVhdGUzZEFycmF5LFxyXG4gIHNodWZmbGUsXHJcbiAgc3dhcCxcclxuICBmaXJzdEVtcHR5SW5kZXgsXHJcbiAgbGVycCxcclxuICBjbGFtcCxcclxuICByYW5kb21JbnQsXHJcbiAgZ2V0WEZyb21JbmRleCxcclxuICBnZXRZRnJvbUluZGV4LFxyXG4gIGdldEluZGV4RnJvbVhZLFxyXG4gIHRpbWVzdGFtcCxcclxuICBpbmRlZmluaXRlQXJ0aWNsZSxcclxuICBwbHVyYWxcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYmNyeXB0XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV4cHJlc3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZnNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaHR0cFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJtb25nb29zZVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJub2RlLWdhbWVsb29wXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInBhdGhcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwic29ja2V0LmlvXCIpOyJdLCJzb3VyY2VSb290IjoiIn0=
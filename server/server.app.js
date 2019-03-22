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
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util.js */ "./server/src/util.js");
/* harmony import */ var _models_account_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./models/account.js */ "./server/src/models/account.js");
/* harmony import */ var _models_player_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./models/player.js */ "./server/src/models/player.js");
/* harmony import */ var _models_playerTemplate_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./models/playerTemplate.js */ "./server/src/models/playerTemplate.js");
/* harmony import */ var _models_bot_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./models/bot.js */ "./server/src/models/bot.js");
/* harmony import */ var _models_botTemplate_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./models/botTemplate.js */ "./server/src/models/botTemplate.js");
/* harmony import */ var _models_item_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./models/item.js */ "./server/src/models/item.js");
/* harmony import */ var _models_itemTemplate_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./models/itemTemplate.js */ "./server/src/models/itemTemplate.js");
/* harmony import */ var _models_map_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./models/map.js */ "./server/src/models/map.js");














const fsp = fs__WEBPACK_IMPORTED_MODULE_2___default.a.promises;
mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Promise = Promise;
mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.connect('mongodb://localhost/odyssey', {useNewUrlParser: true});

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
		let account = await _models_account_js__WEBPACK_IMPORTED_MODULE_4__["default"].findOne({usernameLowerCase: username.toLowerCase()}).exec();
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
		const account = new _models_account_js__WEBPACK_IMPORTED_MODULE_4__["default"]({
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
		return _models_account_js__WEBPACK_IMPORTED_MODULE_4__["default"].findById(accountId)
		.select('_id username password email verified admin')
		.exec()
		.then(account => account)
		.catch(err => console.log(err));
	}
	getAccountByUsername(username) {
		return _models_account_js__WEBPACK_IMPORTED_MODULE_4__["default"].findOne({usernameLowerCase: username.toLowerCase()})
		.select('_id username password email verified admin')
		.exec()
		.then(account => account)
		.catch(err => console.log(err));
	}
	getAllAccounts() {
		return _models_account_js__WEBPACK_IMPORTED_MODULE_4__["default"].find({})
		.select('_id username password email verified admin')
		.exec()
		.then(accounts => accounts)
		.catch(err => console.log(err));
	}
	saveAccount(data) {
		return _models_account_js__WEBPACK_IMPORTED_MODULE_4__["default"].updateOne({username: data.username}, {$set: data})
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

		player = new _models_player_js__WEBPACK_IMPORTED_MODULE_5__["default"]({
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
		return _models_player_js__WEBPACK_IMPORTED_MODULE_5__["default"].findById(playerId)
		.select('_id account name template level experience mapId x y direction adminAccess sprite')
		.populate('template')
		.exec()
		.then(player => player)
		.catch(err => console.log(err));
	}
	getPlayerByName(name) {
		return _models_player_js__WEBPACK_IMPORTED_MODULE_5__["default"].findOne({nameLowerCase: name.toLowerCase()})
		.select('_id account name template level experience mapId x y direction adminAccess sprite')
		.populate('template')
		.exec()
		.then(player => player)
		.catch(err => console.log(err));
	}
	getPlayersByAccount(accountId) {
		return _models_player_js__WEBPACK_IMPORTED_MODULE_5__["default"].find({account: accountId})
		.select('_id account name template level experience mapId x y direction adminAccess sprite')
		.populate('template')
		.exec()
		.then(players => players)
		.catch(err => console.log(err));
	}
	savePlayer(data) {
		return _models_player_js__WEBPACK_IMPORTED_MODULE_5__["default"].updateOne({name: data.name}, {$set: data})
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

		const bot = new _models_bot_js__WEBPACK_IMPORTED_MODULE_7__["default"]({
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
		return _models_bot_js__WEBPACK_IMPORTED_MODULE_7__["default"].findOne({_id: botId})
		.select('_id template mapId x y direction')
		.populate('template')
		.exec()
		.then(bot => bot)
		.catch(err => console.log(err));
	}
	saveBot(data) {
		return _models_bot_js__WEBPACK_IMPORTED_MODULE_7__["default"].updateOne({_id: data.botId}, {$set: data})
		.exec()
		.then(result => true)
		.catch(err => console.log(err));
	}
	getAllBots() {
		return _models_bot_js__WEBPACK_IMPORTED_MODULE_7__["default"].find({})
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

	getMap(mapId) {
		return _models_map_js__WEBPACK_IMPORTED_MODULE_11__["default"].findOne({mapId: mapId})
		.select('mapId name dropChance dropAmountEQ tiles isWall isHostile damage warpMap warpX warpY')
		.exec()
		.then(map => map)
		.catch(err => console.log(err));
	}
	saveMap(data) {
		return _models_map_js__WEBPACK_IMPORTED_MODULE_11__["default"].updateOne({mapId: data.mapId}, {$set: data}, {upsert: true})
		.exec()
		.then(result => true)
		.catch(err => console.log(err));
	}
	getAllMaps() {
		return _models_map_js__WEBPACK_IMPORTED_MODULE_11__["default"].find({})
		.select('mapId name dropChance dropAmountEQ tiles isWall isHostile damage warpMap warpX warpY')
		.exec()
		.then(maps => maps)
		.catch(err => console.log(err));
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
		return _models_playerTemplate_js__WEBPACK_IMPORTED_MODULE_6__["default"].findById(templateId)
		.select('name sprite damageBase defenceBase healthMaxBase energyMaxBase healthRegenBase energyRegenBase rangeBase healthPerLevel, energyPerLevel')
		.exec()
		.then(template => template)
		.catch(err => console.log(err));
	}
	getAllPlayerTemplates() {
		return _models_playerTemplate_js__WEBPACK_IMPORTED_MODULE_6__["default"].find({})
		.select('_id name sprite damageBase defenceBase healthMaxBase energyMaxBase healthRegenBase energyRegenBase rangeBase healthPerLevel, energyPerLevel')
		.exec()
		.then(templates => templates)
		.catch(err => console.log(err));
	}

	addBotTemplate(data) {
		const template = new _models_botTemplate_js__WEBPACK_IMPORTED_MODULE_8__["default"]({
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
		return _models_botTemplate_js__WEBPACK_IMPORTED_MODULE_8__["default"].findById(templateId)
		.select('_id name sprite damageBase defenceBase healthMaxBase energyMaxBase healthRegenBase energyRegenBase rangeBase hostile')
		.exec()
		.then(template => template)
		.catch(err => console.log(err));
	}
	getAllBotTemplates() {
		return _models_botTemplate_js__WEBPACK_IMPORTED_MODULE_8__["default"].find({})
		.select('_id name sprite damageBase defenceBase healthMaxBase energyMaxBase healthRegenBase energyRegenBase rangeBase hostile')
		.exec()
		.then(templates => templates)
		.catch(err => console.log(err));
	}

	addItemTemplate(data) {
		const template = new _models_itemTemplate_js__WEBPACK_IMPORTED_MODULE_10__["default"]({
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
		return _models_itemTemplate_js__WEBPACK_IMPORTED_MODULE_10__["default"].findById(templateId)
		.select('name sprite reusable itemType passiveDamage passiveDefence passiveHealthMax passiveEnergyMaxBase passiveHealthRegen passiveEnergyRegen passiveRange equippedDamage equippedDefence equippedHealthMax equippedEnergyMaxBase equippedHealthRegen equippedEnergyRegen equippedRange')
		.exec()
		.then(template => template)
		.catch(err => console.log(err));
	}
	getAllItemTemplates() {
		return _models_itemTemplate_js__WEBPACK_IMPORTED_MODULE_10__["default"].find({})
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

		return item.save()
		.then(result => true)
		.catch(err => console.log(err));
	}
	saveItem(data) {
		return _models_item_js__WEBPACK_IMPORTED_MODULE_9__["default"].updateOne({_id: data.itemId}, {$set: data}, {upsert: true})
		.exec()
		.then(result => true)
		.catch(err => console.log(err));
	}
	getAllItems() {
		return _models_item_js__WEBPACK_IMPORTED_MODULE_9__["default"].find({})
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

	async loadMaps() {
		let mapData = await _db_js__WEBPACK_IMPORTED_MODULE_0__["default"].getAllMaps();
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
				template.type = _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].ITEM_TYPES[template.itemType];
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
			const item = itemData[i];
			if (!item) continue;
			item.template.type = _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].ITEM_TYPES[item.template.itemType]
			new _classes_item_js__WEBPACK_IMPORTED_MODULE_5__["default"](item);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL2FjdG9yLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy9ib3QuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL2VmZmVjdC5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2NsYXNzZXMvZW50aXR5LmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy9pdGVtLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy9tYXAuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL21lc3NhZ2UuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL3BsYXllci5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2NsYXNzZXMvdGV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2NvbmZpZy5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2RiLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvZ2FtZS5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2dhbWVsb29wLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL21vZGVscy9hY2NvdW50LmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvbW9kZWxzL2JvdC5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL21vZGVscy9ib3RUZW1wbGF0ZS5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL21vZGVscy9pdGVtLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvbW9kZWxzL2l0ZW1UZW1wbGF0ZS5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL21vZGVscy9tYXAuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9tb2RlbHMvcGxheWVyLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvbW9kZWxzL3BsYXllclRlbXBsYXRlLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvc2VydmVyLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvdXRpbC5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJiY3J5cHRcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJleHByZXNzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZnNcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJodHRwXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibW9uZ29vc2VcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJub2RlLWdhbWVsb29wXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicGF0aFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInNvY2tldC5pb1wiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxpQkFBaUIsc0JBQXNCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsbUJBQW1CO0FBQ25CO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwrREFBK0Q7O0FBRS9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxzQkFBc0I7QUFDdEIsR0FBRzs7QUFFSDs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7O0FBRUo7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTs7QUFFSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsaUJBQWlCLHFCQUFxQjtBQUN0QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBOztBQUVBLG9CQUFvQiwwRUFBOEI7QUFDbEQ7QUFDQSxrQkFBa0Isc0JBQXNCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSx1RkFBMkM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrRUFBa0U7QUFDbEU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNscUJBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHNCQUFzQjtBQUN0Qjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLDBFQUE4QjtBQUNsRDtBQUNBOztBQUVBLGlCQUFpQixzQkFBc0I7QUFDdkM7QUFDQSxxQkFBcUIsMEVBQThCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuT0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzREE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2JBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsT0FBTztBQUNQO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMvTEE7QUFDQTs7QUFFQTtBQUNBLDZCQUE2QjtBQUM3Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ3BFQTtBQUNBO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1RBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUhBQXVFLFdBQVc7QUFDbEY7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM01BO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztB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aGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc2VydmVyL3NyYy9tYWluLmpzXCIpO1xuIiwiaW1wb3J0IGdhbWUgZnJvbSAnLi4vZ2FtZS5qcyc7XHJcbmltcG9ydCBjb25maWcgZnJvbSAnLi4vY29uZmlnLmpzJztcclxuaW1wb3J0IHV0aWwgZnJvbSAnLi4vdXRpbC5qcyc7XHJcbmltcG9ydCBFbnRpdHkgZnJvbSAnLi9lbnRpdHkuanMnO1xyXG5cclxuLy8gQW4gQWN0b3IgaXMgYW4gRW50aXR5IHdoaWNoIGNhbiBtb3ZlLCBhdHRhY2sgYW5kIGludGVyYWN0IHdpdGggaXRlbXNcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFjdG9yIGV4dGVuZHMgRW50aXR5IHtcclxuXHRjb25zdHJ1Y3RvcihtYXBJZCwgeCwgeSwgZGlyZWN0aW9uLCBuYW1lLCBzcHJpdGUpIHtcclxuXHRcdHNwcml0ZSA9IHV0aWwuY2xhbXAoc3ByaXRlLCAxLCBjb25maWcuTUFYX1NQUklURVMpO1xyXG5cclxuXHRcdHN1cGVyKG1hcElkLCB4LCB5LCBzcHJpdGUpO1xyXG5cdFx0dGhpcy5uYW1lID0gbmFtZTtcclxuXHRcdHRoaXMuZGVzY3JpcHRpb24gPSBcIlwiO1xyXG5cclxuXHRcdHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xyXG5cdFx0dGhpcy5zdGFydFggPSB0aGlzLng7XHJcblx0XHR0aGlzLnN0YXJ0WSA9IHRoaXMueTtcclxuXHRcdHRoaXMuZGVzdGluYXRpb25YID0gdGhpcy54O1xyXG5cdFx0dGhpcy5kZXN0aW5hdGlvblkgPSB0aGlzLnk7XHJcblx0XHR0aGlzLmxlcnAgPSAwO1xyXG5cclxuXHRcdHRoaXMuaXNNb3ZpbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMuaXNSdW5uaW5nID0gZmFsc2U7XHJcblx0XHR0aGlzLm1vdmVTcGVlZCA9IDIuNTtcclxuXHRcdHRoaXMubW92ZW1lbnRUaW1lciA9IDA7XHJcblx0XHR0aGlzLmxhemluZXNzID0gMDtcclxuXHJcblx0XHR0aGlzLmlzQXR0YWNraW5nID0gZmFsc2U7XHJcblx0XHR0aGlzLmF0dGFja1NwZWVkID0gMTtcclxuXHRcdHRoaXMuYXR0YWNrVGltZXIgPSAwO1x0XHJcblx0XHR0aGlzLnRhcmdldCA9IG51bGw7XHJcblx0XHR0aGlzLmtpbGxzID0gMDtcclxuXHJcblx0XHR0aGlzLmhlYWx0aCA9IHRoaXMuaGVhbHRoTWF4O1xyXG5cdFx0dGhpcy5lbmVyZ3kgPSB0aGlzLmVuZXJneU1heDtcclxuXHRcdHRoaXMucmVnZW5UaW1lciA9IDA7XHJcblx0XHR0aGlzLmlzSGl0ID0gZmFsc2U7XHJcblx0fVxyXG5cdFxyXG5cdC8vIENoYXJhY3RlciBTdGF0c1xyXG5cdGdldCBkYW1hZ2UoKSB7XHJcblx0XHRsZXQgZGFtYWdlVG90YWwgPSB0aGlzLmRhbWFnZUJhc2UgKyB0aGlzLmRhbWFnZUJvbnVzO1xyXG5cdFx0cmV0dXJuIChkYW1hZ2VUb3RhbCA8IDApID8gMCA6IGRhbWFnZVRvdGFsO1xyXG5cdH1cclxuXHRnZXQgZGVmZW5jZSgpIHtcclxuXHRcdGxldCBkZWZlbmNlVG90YWwgPSB0aGlzLmRlZmVuY2VCYXNlICsgdGhpcy5kZWZlbmNlQm9udXM7XHJcblx0XHRyZXR1cm4gKGRlZmVuY2VUb3RhbCA8IDApID8gMCA6IGRlZmVuY2VUb3RhbDtcclxuXHR9XHJcblx0Z2V0IGhlYWx0aE1heCgpIHtcclxuXHRcdGxldCBoZWFsdGhNYXhUb3RhbCA9IHRoaXMuaGVhbHRoTWF4QmFzZSArIHRoaXMuaGVhbHRoTWF4Qm9udXNcclxuXHRcdHJldHVybiAoaGVhbHRoTWF4VG90YWwgPCAxKSA/IDEgOiBoZWFsdGhNYXhUb3RhbDtcclxuXHR9XHJcblx0Z2V0IGVuZXJneU1heCgpIHtcclxuXHRcdGxldCBlbmVyZ3lNYXhUb3RhbCA9IHRoaXMuZW5lcmd5TWF4QmFzZSArIHRoaXMuZW5lcmd5TWF4Qm9udXM7XHJcblx0XHRyZXR1cm4gKGVuZXJneU1heFRvdGFsIDwgMCkgPyAwIDogZW5lcmd5TWF4VG90YWw7XHJcblx0fVxyXG5cdGdldCBoZWFsdGhSZWdlbigpIHtcclxuXHRcdGxldCBoZWFsdGhSZWdlblRvdGFsID0gdGhpcy5oZWFsdGhSZWdlbkJhc2UgKyB0aGlzLmhlYWx0aFJlZ2VuQm9udXNcclxuXHRcdHJldHVybiAoaGVhbHRoUmVnZW5Ub3RhbCA8IDEpID8gMSA6IGhlYWx0aFJlZ2VuVG90YWw7XHJcblx0fVxyXG5cdGdldCBlbmVyZ3lSZWdlbigpIHtcclxuXHRcdGxldCBlbmVyZ3lSZWdlblRvdGFsID0gdGhpcy5lbmVyZ3lSZWdlbkJhc2UgKyB0aGlzLmVuZXJneVJlZ2VuQm9udXM7XHJcblx0XHRyZXR1cm4gKGVuZXJneVJlZ2VuVG90YWwgPCAwKSA/IDAgOiBlbmVyZ3lSZWdlblRvdGFsO1xyXG5cdH1cclxuXHRnZXQgcmFuZ2UoKSB7XHJcblx0XHRsZXQgcmFuZ2VUb3RhbCA9IHRoaXMucmFuZ2VCYXNlICsgdGhpcy5yYW5nZUJvbnVzO1xyXG5cdFx0cmV0dXJuIChyYW5nZVRvdGFsIDwgMSkgPyAxIDogcmFuZ2VUb3RhbDtcclxuXHR9XHJcblxyXG5cdGNhbGNCYXNlU3RhdHModGVtcGxhdGUpIHtcclxuXHRcdHRoaXMuZGFtYWdlQmFzZSA9IHRlbXBsYXRlLmRhbWFnZUJhc2UgfHwgMTtcclxuXHRcdHRoaXMuZGVmZW5jZUJhc2UgPSB0ZW1wbGF0ZS5kZWZlbmNlQmFzZSB8fCAwO1xyXG5cdFx0dGhpcy5oZWFsdGhNYXhCYXNlID0gdGVtcGxhdGUuaGVhbHRoTWF4QmFzZSArICh0ZW1wbGF0ZS5oZWFsdGhQZXJMZXZlbCAqICh0aGlzLmxldmVsIC0gMSkpIHx8IDE7XHJcblx0XHR0aGlzLmVuZXJneU1heEJhc2UgPSB0ZW1wbGF0ZS5lbmVyZ3lNYXhCYXNlICsgKHRlbXBsYXRlLmVuZXJneVBlckxldmVsICogKHRoaXMubGV2ZWwgLSAxKSkgfHwgMTtcclxuXHRcdHRoaXMuaGVhbHRoUmVnZW5CYXNlID0gdGVtcGxhdGUuaGVhbHRoUmVnZW5CYXNlIHx8IDE7XHJcblx0XHR0aGlzLmVuZXJneVJlZ2VuQmFzZSA9IHRlbXBsYXRlLmVuZXJneVJlZ2VuQmFzZSB8fCAxO1xyXG5cdFx0dGhpcy5yYW5nZUJhc2UgPSB0ZW1wbGF0ZS5yYW5nZUJhc2UgfHwgMTtcclxuXHR9XHJcblxyXG5cdGNhbGNJdGVtQm9udXMoKSB7XHJcblx0XHRjb25zdCBpdGVtQm9udXMgPSB7XHJcblx0XHRcdGRhbWFnZTogMCxcclxuXHRcdFx0ZGVmZW5jZTogMCxcclxuXHRcdFx0aGVhbHRoTWF4OiAwLFxyXG5cdFx0XHRlbmVyZ3lNYXg6IDAsXHJcblx0XHRcdGhlYWx0aFJlZ2VuOiAwLFxyXG5cdFx0XHRlbmVyZ3lSZWdlbjogMCxcclxuXHRcdFx0cmFuZ2U6IDBcclxuXHRcdH07XHJcblxyXG5cdFx0Y29uc3QgaW52ZW50b3J5ID0gdGhpcy5nZXRJbnZlbnRvcnkoKTtcclxuXHJcblx0XHQvLyBGb3IgZWFjaCBpdGVtIGluIGludmVudG9yeSBjaGVjayBmb3IgYm9udXNlc1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBpbnZlbnRvcnkubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgaXRlbSA9IGludmVudG9yeVtpXTtcclxuXHRcdFx0aXRlbUJvbnVzLmRhbWFnZSArPSBpdGVtLnBhc3NpdmUuZGFtYWdlO1xyXG5cdFx0XHRpdGVtQm9udXMuZGVmZW5jZSArPSBpdGVtLnBhc3NpdmUuZGVmZW5jZTtcclxuXHRcdFx0aXRlbUJvbnVzLmhlYWx0aE1heCArPSBpdGVtLnBhc3NpdmUuaGVhbHRoTWF4O1xyXG5cdFx0XHRpdGVtQm9udXMuZW5lcmd5TWF4ICs9IGl0ZW0ucGFzc2l2ZS5lbmVyZ3lNYXg7XHJcblx0XHRcdGl0ZW1Cb251cy5oZWFsdGhSZWdlbiArPSBpdGVtLnBhc3NpdmUuaGVhbHRoUmVnZW47XHJcblx0XHRcdGl0ZW1Cb251cy5lbmVyZ3lSZWdlbiArPSBpdGVtLnBhc3NpdmUuZW5lcmd5UmVnZW47XHJcblx0XHRcdGl0ZW1Cb251cy5yYW5nZSArPSBpdGVtLnBhc3NpdmUucmFuZ2U7XHJcblxyXG5cdFx0XHRpZiAoaXRlbS5zbG90ID49IGNvbmZpZy5JTlZFTlRPUllfU0laRSkge1xyXG5cdFx0XHRcdGl0ZW1Cb251cy5kYW1hZ2UgKz0gaXRlbS5lcXVpcHBlZC5kYW1hZ2U7XHJcblx0XHRcdFx0aXRlbUJvbnVzLmRlZmVuY2UgKz0gaXRlbS5lcXVpcHBlZC5kZWZlbmNlO1xyXG5cdFx0XHRcdGl0ZW1Cb251cy5oZWFsdGhNYXggKz0gaXRlbS5lcXVpcHBlZC5oZWFsdGhNYXg7XHJcblx0XHRcdFx0aXRlbUJvbnVzLmVuZXJneU1heCArPSBpdGVtLmVxdWlwcGVkLmVuZXJneU1heDtcclxuXHRcdFx0XHRpdGVtQm9udXMuaGVhbHRoUmVnZW4gKz0gaXRlbS5lcXVpcHBlZC5oZWFsdGhSZWdlbjtcclxuXHRcdFx0XHRpdGVtQm9udXMuZW5lcmd5UmVnZW4gKz0gaXRlbS5lcXVpcHBlZC5lbmVyZ3lSZWdlbjtcclxuXHRcdFx0XHRpdGVtQm9udXMucmFuZ2UgKz0gaXRlbS5lcXVpcHBlZC5yYW5nZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gaXRlbUJvbnVzO1xyXG5cdH1cclxuXHJcblx0Y2FsY0VmZmVjdEJvbnVzKCkge1xyXG5cdFx0Y29uc3QgZWZmZWN0Qm9udXMgPSB7XHJcblx0XHRcdGRhbWFnZTogMCxcclxuXHRcdFx0ZGVmZW5jZTogMCxcclxuXHRcdFx0aGVhbHRoTWF4OiAwLFxyXG5cdFx0XHRlbmVyZ3lNYXg6IDAsXHJcblx0XHRcdGhlYWx0aFJlZ2VuOiAwLFxyXG5cdFx0XHRlbmVyZ3lSZWdlbjogMCxcclxuXHRcdFx0cmFuZ2U6IDBcclxuXHRcdH07XHJcblxyXG5cdFx0Ly8gVE9ETzogd29yayBvdXQgaG93IHRvIGRvIGVmZmVjdHMgZm9yIHNwZWxscyBhbmQgcG90aW9uc1xyXG5cdFx0cmV0dXJuIGVmZmVjdEJvbnVzO1xyXG5cdH1cclxuXHRcclxuXHRjYWxjQm9udXNTdGF0cygpIHtcdC8vIEl0ZW1zIChlcXVpcHBlZCBhbmQgcGFzc2l2ZSkgYW5kIEVmZmVjdHMgKHNwZWxscyBhbmQgcG90aW9ucylcclxuXHRcdGNvbnN0IGl0ZW1Cb251cyA9IHRoaXMuY2FsY0l0ZW1Cb251cygpO1xyXG5cdFx0Y29uc3QgZWZmZWN0Qm9udXMgPSB0aGlzLmNhbGNFZmZlY3RCb251cygpO1xyXG5cclxuXHRcdHRoaXMuZGFtYWdlQm9udXMgPSBpdGVtQm9udXMuZGFtYWdlICsgZWZmZWN0Qm9udXMuZGFtYWdlO1xyXG5cdFx0dGhpcy5kZWZlbmNlQm9udXMgPSBpdGVtQm9udXMuZGVmZW5jZSArIGVmZmVjdEJvbnVzLmRlZmVuY2U7XHJcblx0XHR0aGlzLmhlYWx0aE1heEJvbnVzID0gaXRlbUJvbnVzLmhlYWx0aE1heCArIGVmZmVjdEJvbnVzLmhlYWx0aE1heDtcclxuXHRcdHRoaXMuZW5lcmd5TWF4Qm9udXMgPSBpdGVtQm9udXMuZW5lcmd5TWF4ICsgZWZmZWN0Qm9udXMuZW5lcmd5TWF4O1xyXG5cdFx0dGhpcy5oZWFsdGhSZWdlbkJvbnVzID0gaXRlbUJvbnVzLmhlYWx0aFJlZ2VuICsgZWZmZWN0Qm9udXMuaGVhbHRoUmVnZW47XHJcblx0XHR0aGlzLmVuZXJneVJlZ2VuQm9udXMgPSBpdGVtQm9udXMuZW5lcmd5UmVnZW4gKyBlZmZlY3RCb251cy5lbmVyZ3lSZWdlbjtcclxuXHRcdHRoaXMucmFuZ2VCb251cyA9IGl0ZW1Cb251cy5yYW5nZSArIGVmZmVjdEJvbnVzLnJhbmdlO1xyXG5cdH1cclxuXHJcblx0Y2FsY1N0YXRzKCkge1xyXG5cdFx0dGhpcy5jYWxjQmFzZVN0YXRzKCk7XHJcblx0XHR0aGlzLmNhbGNCb251c1N0YXRzKCk7XHJcblx0fVxyXG5cclxuXHRyZXN0b3JlKCkge1xyXG5cdFx0dGhpcy5oZWFsdGggPSB0aGlzLmhlYWx0aE1heDtcclxuXHRcdHRoaXMuZW5lcmd5ID0gdGhpcy5lbmVyZ3lNYXg7XHJcblx0fVxyXG5cdFxyXG5cdGlucHV0RGF0YSgpIHtcclxuXHRcdC8vIFNlZSBQbGF5ZXIgYW5kIEJvdCBjbGFzc2VzXHJcblx0fVxyXG5cclxuXHQvLyBNb3ZlbWVudFxyXG5cdG1vdmUoZGlyZWN0aW9uKSB7XHJcblx0XHRpZiAodGhpcy5pc01vdmluZykgcmV0dXJuO1xyXG5cclxuXHRcdGlmIChkaXJlY3Rpb24pIHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xyXG5cclxuXHRcdGlmIChkaXJlY3Rpb24gPT09ICdsZWZ0Jykge1xyXG5cdFx0XHRpZiAoIWdhbWUuaXNWYWNhbnQodGhpcy5tYXBJZCwgdGhpcy54IC0gMSwgdGhpcy55KSkgcmV0dXJuO1xyXG5cdFx0XHR0aGlzLmRlc3RpbmF0aW9uWC0tO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoZGlyZWN0aW9uID09PSAncmlnaHQnKSB7XHJcblx0XHRcdGlmICghZ2FtZS5pc1ZhY2FudCh0aGlzLm1hcElkLCB0aGlzLnggKyAxLCB0aGlzLnkpKSByZXR1cm47XHJcblx0XHRcdHRoaXMuZGVzdGluYXRpb25YKys7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChkaXJlY3Rpb24gPT09ICd1cCcpIHtcclxuXHRcdFx0aWYgKCFnYW1lLmlzVmFjYW50KHRoaXMubWFwSWQsIHRoaXMueCwgdGhpcy55IC0gMSkpIHJldHVybjtcclxuXHRcdFx0dGhpcy5kZXN0aW5hdGlvblktLTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ2Rvd24nKSB7XHJcblx0XHRcdGlmICghZ2FtZS5pc1ZhY2FudCh0aGlzLm1hcElkLCB0aGlzLngsIHRoaXMueSArIDEpKSByZXR1cm47XHJcblx0XHRcdHRoaXMuZGVzdGluYXRpb25ZKys7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0c3dpdGNoICh1dGlsLnJhbmRvbUludCgwLCAzICsgdGhpcy5sYXppbmVzcykpIHtcclxuXHRcdFx0XHRjYXNlIDA6IHRoaXMubW92ZSgnbGVmdCcpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgMTogdGhpcy5tb3ZlKCdyaWdodCcpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgMjogdGhpcy5tb3ZlKCd1cCcpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgMzogdGhpcy5tb3ZlKCdkb3duJyk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0ZGVmYXVsdDogLy8gRG9uJ3QgTW92ZVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBTZXQgbW92ZSBzcGVlZFxyXG5cdFx0aWYgKHRoaXMuaXNSdW5uaW5nKSB7XHJcblx0XHRcdGlmICh0aGlzLmVuZXJneSA+IDApIHtcclxuXHRcdFx0XHR0aGlzLmVuZXJneS0tO1xyXG5cdFx0XHRcdHRoaXMubW92ZVNwZWVkID0gNDtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHR0aGlzLmVuZXJneSA9IDA7XHJcblx0XHRcdFx0dGhpcy5tb3ZlU3BlZWQgPSAyLjU7XHJcblx0XHRcdFx0dGhpcy5pc1J1bm5pbmcgPSBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHRoaXMubW92ZVNwZWVkID0gMi41O1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR0aGlzLmlzTW92aW5nID0gdHJ1ZTtcclxuXHR9XHJcblx0XHJcblx0bW92ZVRvVGFyZ2V0KHRhcmdldCwgaG9zdGlsZSkge1xyXG5cdFx0aWYgKCF0YXJnZXQpIHJldHVybjtcclxuXHRcdFxyXG5cdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggJiYgdGFyZ2V0LnkgPT09IHRoaXMueSkge1xyXG5cdFx0XHR0aGlzLm1vdmUoKTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKHV0aWwucmFuZG9tSW50KDAsIDEpID09PSAwKSB7XHJcblx0XHRcdGlmICh0YXJnZXQueCA8IHRoaXMueCkge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQueCA+PSAodGhpcy54IC0gdGhpcy5yYW5nZSkgJiYgdGFyZ2V0LnkgPT09IHRoaXMueSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUgJiYgIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnbGVmdCc7XHJcblx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCdsZWZ0Jyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCdsZWZ0Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHRhcmdldC54ID4gdGhpcy54KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggKyB0aGlzLnJhbmdlICYmIHRhcmdldC55ID09PSB0aGlzLnkpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlICYmICF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ3JpZ2h0JztcclxuXHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ3JpZ2h0Jyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCdyaWdodCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICh0YXJnZXQueSA8IHRoaXMueSkge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICYmIHRhcmdldC55ID09PSB0aGlzLnkgLSB0aGlzLnJhbmdlKSB7XHJcblx0XHRcdFx0XHRpZiAoaG9zdGlsZSAmJiAhdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICd1cCc7XHJcblx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCd1cCcpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSgndXAnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodGFyZ2V0LnkgPiB0aGlzLnkpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LnggPT09IHRoaXMueCAmJiB0YXJnZXQueSA9PT0gdGhpcy55ICsgdGhpcy5yYW5nZSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUgJiYgIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnZG93bic7XHJcblx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCdkb3duJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCdkb3duJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0aWYgKHRhcmdldC55ID4gdGhpcy55KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggJiYgdGFyZ2V0LnkgPT09IHRoaXMueSArIHRoaXMucmFuZ2UpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlICYmICF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ2Rvd24nO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmF0dGFjaygnZG93bicpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSgnZG93bicpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICh0YXJnZXQueSA8IHRoaXMueSkge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICYmIHRhcmdldC55ID09PSB0aGlzLnkgLSB0aGlzLnJhbmdlKSB7XHJcblx0XHRcdFx0XHRpZiAoaG9zdGlsZSAmJiAhdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICd1cCc7XHJcblx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCd1cCcpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSgndXAnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodGFyZ2V0LnggPiB0aGlzLngpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LnggPT09IHRoaXMueCArIHRoaXMucmFuZ2UgJiYgdGFyZ2V0LnkgPT09IHRoaXMueSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUgJiYgIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAncmlnaHQnO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmF0dGFjaygncmlnaHQnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ3JpZ2h0Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHRhcmdldC54IDwgdGhpcy54KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID49ICh0aGlzLnggLSB0aGlzLnJhbmdlKSAmJiB0YXJnZXQueSA9PT0gdGhpcy55KSB7XHJcblx0XHRcdFx0XHRpZiAoaG9zdGlsZSAmJiAhdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdsZWZ0JztcclxuXHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ2xlZnQnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ2xlZnQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0Ly8gQ29tYmF0XHJcblx0Y2hlY2tJblJhbmdlKGRpcmVjdGlvbiwgdGFyZ2V0LCByYW5nZSkge1xyXG5cdFx0aWYgKHRhcmdldC5tYXBJZCAhPT0gdGhpcy5tYXBJZCkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggJiYgdGFyZ2V0LnkgPT09IHRoaXMueSkgcmV0dXJuIGZhbHNlO1x0Ly8gU3RhY2tlZCBkb2VzIG5vdCBjb3VudCBhcyBpbiByYW5nZVxyXG5cdFx0XHJcblx0XHRpZiAodGFyZ2V0LnkgPT09IHRoaXMueSkge1xyXG5cdFx0XHRpZiAoZGlyZWN0aW9uID09PSAnbGVmdCcpIHtcclxuXHRcdFx0XHRpZiAodGhpcy54ID09PSAwKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0cmV0dXJuICh0YXJnZXQueCA8IHRoaXMueCAmJiB0YXJnZXQueCA+PSAodGhpcy54IC0gcmFuZ2UpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAoZGlyZWN0aW9uID09PSAncmlnaHQnKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMueCA9PT0gY29uZmlnLk1BUF9DT0xVTU5TIC0gMSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHJldHVybiAodGFyZ2V0LnggPiB0aGlzLnggJiYgdGFyZ2V0LnggPD0gKHRoaXMueCArIHJhbmdlKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmICh0YXJnZXQueCA9PT0gdGhpcy54KSB7XHJcblx0XHRcdGlmIChkaXJlY3Rpb24gPT09ICd1cCcpIHtcclxuXHRcdFx0XHRpZiAodGhpcy55ID09PSAwKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0cmV0dXJuICh0YXJnZXQueSA8IHRoaXMueSAmJiB0YXJnZXQueSA+PSAodGhpcy55IC0gcmFuZ2UpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAoZGlyZWN0aW9uID09PSAnZG93bicpIHtcclxuXHRcdFx0XHRpZiAodGhpcy55ID09PSBjb25maWcuTUFQX1JPV1MgLSAxKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0cmV0dXJuICh0YXJnZXQueSA+IHRoaXMueSAmJiB0YXJnZXQueSA8PSAodGhpcy55ICsgcmFuZ2UpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0YXR0YWNrKG51bVRhcmdldHMgPSAxLCBkaXJlY3Rpb24gPSB0aGlzLmRpcmVjdGlvbikge1xyXG5cdFx0aWYgKHRoaXMuaXNBdHRhY2tpbmcgfHwgdGhpcy5hdHRhY2tUaW1lciA+IDApIHJldHVybjtcclxuXHJcblx0XHR0aGlzLmlzQXR0YWNraW5nID0gdHJ1ZTtcclxuXHRcdFxyXG5cdFx0Y29uc3QgcGxheWVyTGlzdCA9IGdhbWUucGxheWVycy5maWx0ZXIocGxheWVyID0+IHBsYXllci5tYXBJZCA9PT0gdGhpcy5tYXBJZCk7XHJcblx0XHRjb25zdCBib3RMaXN0ID0gZ2FtZS5ib3RzLmZpbHRlcihib3QgPT4gYm90Lm1hcElkID09PSB0aGlzLm1hcElkKTtcclxuXHRcdGNvbnN0IGFjdG9yTGlzdCA9IHBsYXllckxpc3QuY29uY2F0KGJvdExpc3QpO1xyXG5cdFx0bGV0IHRhcmdldExpc3QgPSBhY3Rvckxpc3QuZmlsdGVyKGFjdG9yID0+IHtcclxuXHRcdFx0cmV0dXJuIGFjdG9yICE9PSB0aGlzICYmICFhY3Rvci5pc0RlYWQgJiYgdGhpcy5jaGVja0luUmFuZ2UoZGlyZWN0aW9uLCBhY3RvciwgdGhpcy5yYW5nZSk7XHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdFx0dGFyZ2V0TGlzdC5zb3J0KChhLCBiKSA9PiB7XHJcblx0XHRcdHJldHVybiAoYS56IC0gYi56KTtcdC8vIExvd2VzdCB0byBoaWdoZXN0XHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdFx0dGFyZ2V0TGlzdCA9IHRhcmdldExpc3Quc3BsaWNlKC1udW1UYXJnZXRzKTtcclxuXHRcdFxyXG5cdFx0dGFyZ2V0TGlzdC5mb3JFYWNoKCh0YXJnZXQpID0+IHtcclxuXHRcdFx0dGFyZ2V0LnRha2VEYW1hZ2UodGhpcy5kYW1hZ2UsIHRoaXMpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdFxyXG5cdHRha2VEYW1hZ2UoZGFtYWdlLCBhdHRhY2tlcikge1xyXG5cdFx0ZGFtYWdlIC09IHRoaXMuZGVmZW5jZTtcclxuXHRcdGlmIChkYW1hZ2UgPCAwKSBkYW1hZ2UgPSAwO1xyXG5cdFx0Z2FtZS5zcGF3bkRhbWFnZVRleHQodGhpcy5tYXBJZCwgdGhpcy54LCB0aGlzLnksIGRhbWFnZSk7XHJcblx0XHRpZiAoZGFtYWdlID09PSAwKSByZXR1cm47XHJcblx0XHRcclxuXHRcdHRoaXMuaXNIaXQgPSB0cnVlO1xyXG5cdFx0dGhpcy5oZWFsdGggLT0gZGFtYWdlO1xyXG5cclxuXHRcdGlmICh0aGlzLmhlYWx0aCA8PSAwKSB7XHJcblx0XHRcdHRoaXMuc2V0RGVhZCgpO1xyXG5cdFx0XHRcclxuXHRcdFx0aWYgKCFhdHRhY2tlcikge1xyXG5cdFx0XHRcdGdhbWUuc2VuZEdhbWVJbmZvR2xvYmFsKHRoaXMubmFtZSArIFwiIGhhcyBkaWVkIVwiKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGF0dGFja2VyLmtpbGxzKys7XHJcblx0XHRcdGlmIChhdHRhY2tlci50YXJnZXQgPT09IHRoaXMpIGF0dGFja2VyLnRhcmdldCA9IG51bGw7XHJcblx0XHRcdGlmICh0aGlzLnBsYXllcklkKSB7XHJcblx0XHRcdFx0aWYgKGF0dGFja2VyLnBsYXllcklkKSBnYW1lLnNlbmRHYW1lSW5mb0dsb2JhbChhdHRhY2tlci5uYW1lICsgXCIgaGFzIG11cmRlcmVkIFwiICsgdGhpcy5uYW1lICsgXCIgaW4gY29sZCBibG9vZCFcIik7XHJcblx0XHRcdFx0ZWxzZSBnYW1lLnNlbmRHYW1lSW5mb0dsb2JhbCh0aGlzLm5hbWUgKyBcIiBoYXMgYmVlbiBraWxsZWQgYnkgXCIgKyBhdHRhY2tlci5uYW1lICsgXCIhXCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVx0XHJcblxyXG5cdHNldERlYWQoKSB7XHJcblx0XHRjb25zdCBtYXAgPSBnYW1lLm1hcHNbdGhpcy5tYXBJZF07XHJcblx0XHRjb25zdCBpbnZlbnRvcnkgPSB0aGlzLmdldEludmVudG9yeSgpO1xyXG5cclxuXHRcdC8vIEludmVudG9yeSBJdGVtIERyb3AgQ2hhbmNlXHJcblx0XHRjb25zdCBkcm9wQ2hhbmNlID0gdXRpbC5jbGFtcChtYXAuZHJvcENoYW5jZSwgMCwgMTAwKTtcclxuXHRcdGlmIChkcm9wQ2hhbmNlID4gMCkge1xyXG5cdFx0XHRjb25zdCBpdGVtcyA9IGludmVudG9yeS5maWx0ZXIoaXRlbSA9PiB7XHJcblx0XHRcdFx0cmV0dXJuIGl0ZW0uc2xvdCA8IGNvbmZpZy5JTlZFTlRPUllfU0laRTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRpdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xyXG5cdFx0XHRcdGlmIChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDEpIDw9IGRyb3BDaGFuY2UpIHtcclxuXHRcdFx0XHRcdGl0ZW0ubW92ZVRvTWFwKHRoaXMubWFwSWQsIHRoaXMueCwgdGhpcy55KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0XHR0aGlzLmNhbGNCb251c1N0YXRzKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gRXF1aXBwZWQgSXRlbSBEcm9wIEFtb3VudFxyXG5cdFx0Y29uc3QgZHJvcEFtb3VudEVRID0gdXRpbC5jbGFtcChtYXAuZHJvcEFtb3VudEVRLCAwLCBjb25maWcuRVFVSVBNRU5UX1NJWkUpO1xyXG5cdFx0aWYgKGRyb3BBbW91bnRFUSA+IDApIHtcclxuXHRcdFx0bGV0IGVxdWlwbWVudCA9IGludmVudG9yeS5maWx0ZXIoaXRlbSA9PiB7XHJcblx0XHRcdFx0cmV0dXJuIGl0ZW0uc2xvdCA+PSBjb25maWcuSU5WRU5UT1JZX1NJWkU7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0ZXF1aXBtZW50ID0gdXRpbC5zaHVmZmxlKGVxdWlwbWVudCk7XHJcblx0XHRcdGVxdWlwbWVudC5zcGxpY2UoLWRyb3BBbW91bnRFUSk7XHJcblx0XHRcdGVxdWlwbWVudC5mb3JFYWNoKGl0ZW0gPT4ge1xyXG5cdFx0XHRcdGl0ZW0ubW92ZVRvTWFwKHRoaXMubWFwSWQsIHRoaXMueCwgdGhpcy55KTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdHRoaXMuY2FsY0JvbnVzU3RhdHMoKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0Ly8gSW52ZW50b3J5XHJcblx0cGlja1VwKCkge1xyXG5cdFx0Y29uc3QgbWFwSXRlbXMgPSBnYW1lLml0ZW1zLmZpbHRlcihpdGVtID0+IHtcclxuXHRcdFx0cmV0dXJuIGl0ZW0ubWFwSWQgPT09IHRoaXMubWFwSWQgJiYgaXRlbS54ID09PSB0aGlzLnggJiYgaXRlbS55ID09PSB0aGlzLnk7XHJcblx0XHR9KTtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbWFwSXRlbXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgaXRlbSA9IG1hcEl0ZW1zW2ldO1xyXG5cdFx0XHRpZiAoIWl0ZW0pIGNvbnRpbnVlO1xyXG5cdFx0XHRcclxuXHRcdFx0aWYgKGl0ZW0uc3RhY2thYmxlKSB7XHJcblx0XHRcdFx0Y29uc3QgaW52ZW50b3J5ID0gdGhpcy5nZXRJbnZlbnRvcnkoKTtcclxuXHRcdFx0XHRpZiAoaW52ZW50b3J5Lmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdGNvbnN0IHNhbWVJdGVtcyA9IGludmVudG9yeS5maWx0ZXIoaW52ZW50b3J5SXRlbSA9PiB7XHJcblx0XHRcdFx0XHRcdHJldHVybiBpbnZlbnRvcnlJdGVtLnRlbXBsYXRlSWQgPT09IGl0ZW0udGVtcGxhdGVJZDtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0aWYgKHNhbWVJdGVtcy5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdHNhbWVJdGVtc1swXS5zdGFjayArPSBpdGVtLnN0YWNrO1xyXG5cdFx0XHRcdFx0XHRpdGVtLnJlbW92ZSgpO1xyXG5cdFx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbnN0IHNsb3QgPSB0aGlzLmZpbmRGaXJzdEVtcHR5U2xvdCgpO1xyXG5cdFx0XHRpZiAoc2xvdCA9PSBudWxsKSByZXR1cm4gZmFsc2U7XHJcblxyXG5cdFx0XHRpdGVtLm1vdmVUb0ludmVudG9yeSh0aGlzLnBsYXllcklkLCB0aGlzLmJvdElkLCBzbG90KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGdldEludmVudG9yeSgpIHtcclxuXHRcdC8vIFNlZSBQbGF5ZXIgYW5kIEJvdCBjbGFzc2VzXHJcblx0fVxyXG5cclxuXHRnZXRJdGVtKHNsb3QpIHtcclxuXHRcdGNvbnN0IGludmVudG9yeSA9IHRoaXMuZ2V0SW52ZW50b3J5KCk7XHJcblx0XHRjb25zdCBpdGVtcyA9IGludmVudG9yeS5maWx0ZXIoaXRlbSA9PiB7XHJcblx0XHRcdHJldHVybiBpdGVtLnNsb3QgPT09IHNsb3Q7XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBpdGVtc1swXTtcclxuXHR9XHJcblxyXG5cdGhhc0l0ZW0odGVtcGxhdGVJZCkge1xyXG5cdFx0Y29uc3QgaW52ZW50b3J5ID0gdGhpcy5nZXRJbnZlbnRvcnkoKTtcclxuXHRcdGNvbnN0IGl0ZW1zID0gZ2FtZS5pdGVtcy5maWx0ZXIoaXRlbSA9PiB7XHJcblx0XHRcdHJldHVybiBpdGVtLnRlbXBsYXRlSWQgPT09IHRlbXBsYXRlSWQ7XHJcblx0XHR9KTtcclxuXHRcdGlmIChpdGVtc1swXS5zdGFja2FibGUpIHtcclxuXHRcdFx0cmV0dXJuIGl0ZW1zWzBdLnN0YWNrO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHJldHVybiBpdGVtcy5sZW5ndGg7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRmaW5kSXRlbVNsb3QodGVtcGxhdGVJZCkge1xyXG5cdFx0Y29uc3QgaW52ZW50b3J5ID0gdGhpcy5nZXRJbnZlbnRvcnkoKTtcclxuXHRcdGNvbnN0IGl0ZW1zID0gaW52ZW50b3J5LmZpbHRlcihpdGVtID0+IHtcclxuXHRcdFx0cmV0dXJuIGl0ZW0udGVtcGxhdGVJZCA9PT0gdGVtcGxhdGVJZDtcclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIGl0ZW1zWzBdLnNsb3Q7XHJcblx0fVxyXG5cclxuXHRmaW5kRmlyc3RFbXB0eVNsb3QoKSB7XHJcblx0XHRjb25zdCBpbnZlbnRvcnkgPSB0aGlzLmdldEludmVudG9yeSgpO1xyXG5cclxuXHRcdGZvciAobGV0IHNsb3QgPSAwOyBzbG90IDwgY29uZmlnLklOVkVOVE9SWV9TSVpFOyBzbG90KyspIHtcclxuXHRcdFx0bGV0IG9jY3VwaWVkID0gZmFsc2U7XHJcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgaW52ZW50b3J5Lmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0aWYgKGludmVudG9yeVtpXS5zbG90ID09PSBzbG90KSB7XHJcblx0XHRcdFx0XHRvY2N1cGllZCA9IHRydWU7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCFvY2N1cGllZCkgcmV0dXJuIHNsb3Q7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9XHJcblxyXG5cdHVzZUl0ZW0oc2xvdCkge1xyXG5cdFx0Y29uc3QgaXRlbSA9IHRoaXMuZ2V0SXRlbShzbG90KTtcclxuXHRcdGlmICghaXRlbSkgcmV0dXJuO1xyXG5cclxuXHRcdC8vIFRPRE86IGlmICghdXNlU2NyaXB0KCkpIHJldHVybjtcclxuXHJcblx0XHRpZiAoaXRlbS5pc0VxdWlwbWVudCgpKSB7XHJcblx0XHRcdGlmIChpdGVtLnNsb3QgPCBjb25maWcuSU5WRU5UT1JZX1NJWkUpIHtcdC8vIENoZWNrIGlmIGl0ZW0gaXMgZXF1aXBwZWRcclxuXHRcdFx0XHR0aGlzLmVxdWlwSXRlbShpdGVtKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0dGhpcy51bmVxdWlwSXRlbShpdGVtKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghaXRlbS5yZXVzYWJsZSkgaXRlbS5yZW1vdmVPbmUoKTtcclxuXHR9XHJcblxyXG5cdGRyb3BJdGVtKHNsb3QpIHtcclxuXHRcdGNvbnN0IGl0ZW0gPSB0aGlzLmdldEl0ZW0oc2xvdCk7XHJcblx0XHRpZiAoIWl0ZW0pIHJldHVybjtcclxuXHRcdGl0ZW0ubW92ZVRvTWFwKHRoaXMubWFwSWQsIHRoaXMueCwgdGhpcy55KTtcclxuXHRcdHRoaXMuY2FsY0JvbnVzU3RhdHMoKTtcclxuXHR9XHJcblxyXG5cdG1vdmVJdGVtVG9TbG90KHNsb3QsIG5ld1Nsb3QpIHtcclxuXHRcdGlmIChzbG90ID09IG51bGwgfHwgbmV3U2xvdCA9PSBudWxsIHx8IHNsb3QgPT09IG5ld1Nsb3QpIHJldHVybjtcdC8vIG51bGwgPT0gdW5kZWZpbmVkLCBudWxsICE9IDBcclxuXHRcdGlmIChzbG90IDwgMCB8fCBzbG90ID49IGNvbmZpZy5JTlZFTlRPUllfU0laRSArIGNvbmZpZy5FUVVJUE1FTlRfU0laRSkgcmV0dXJuO1xyXG5cdFx0aWYgKG5ld1Nsb3QgPCAwIHx8IG5ld1Nsb3QgPj0gY29uZmlnLklOVkVOVE9SWV9TSVpFICsgY29uZmlnLkVRVUlQTUVOVF9TSVpFKSByZXR1cm47XHJcblxyXG5cdFx0Y29uc3QgaXRlbSA9IHRoaXMuZ2V0SXRlbShzbG90KTtcclxuXHRcdGNvbnN0IG5ld0l0ZW0gPSB0aGlzLmdldEl0ZW0obmV3U2xvdCk7XHJcblx0XHRpZiAoIWl0ZW0pIHJldHVybjtcclxuXHJcblx0XHQvLyBUYXJnZXQgc2xvdCBpcyBmb3IgZXF1aXBtZW50IC0gY2hlY2sgdHlwZSBtYXRjaGVzXHJcblx0XHRpZiAobmV3U2xvdCA+PSBjb25maWcuSU5WRU5UT1JZX1NJWkUpIHtcclxuXHRcdFx0aWYgKGl0ZW0uZXF1aXBwZWRTbG90ICsgY29uZmlnLklOVkVOVE9SWV9TSVpFICE9PSBuZXdTbG90KSB7XHJcblx0XHRcdFx0Z2FtZS5zZW5kR2FtZUluZm9QbGF5ZXIodGhpcy5pZCwgXCJUaGF0IGNhbm5vdCBiZSBlcXVpcHBlZCB0aGVyZS5cIik7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3Qgc3dhcFNsb3RzID0gKCkgPT4ge1xyXG5cdFx0XHRpdGVtLnNsb3QgPSBuZXdTbG90O1xyXG5cdFx0XHRpZiAobmV3SXRlbSkgbmV3SXRlbS5zbG90ID0gc2xvdDtcclxuXHRcdFx0dGhpcy5jYWxjQm9udXNTdGF0cygpO1xyXG5cdFx0fTtcclxuXHJcblx0XHQvLyBJRiBObyBuZXcgaXRlbSBpbiBuZXcgc2xvdFxyXG5cdFx0Ly8gT1IgTmV3IGl0ZW0gaW4gbmV3IHNsb3QsIG9sZCBpdGVtIGluIGludmVudG9yeVxyXG5cdFx0Ly8gT1IgTmV3IGl0ZW0gaW4gbmV3IHNsb3QsIG9sZCBpdGVtIGlzIGVxdWlwcGVkLCBuZXcgaXRlbSBjYW4gYmUgZXF1aXBwZWQgaW4gb2xkIHNsb3RcclxuXHRcdGlmICghbmV3SXRlbSB8fCBzbG90IDwgY29uZmlnLklOVkVOVE9SWV9TSVpFIHx8IG5ld0l0ZW0uZXF1aXBwZWRTbG90ICsgY29uZmlnLklOVkVOVE9SWV9TSVpFID09PSBzbG90KSB7XHJcblx0XHRcdHN3YXBTbG90cygpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdC8vIE9sZCBpdGVtIGlzIGVxdWlwcGVkLCBuZXcgaXRlbSBjYW5ub3QgYmUgZXF1aXBwZWQgaW4gb2xkIHNsb3RcclxuXHRcdFx0bmV3U2xvdCA9IHRoaXMuZmluZEZpcnN0RW1wdHlTbG90KCk7XHJcblx0XHRcdGlmIChuZXdTbG90ICE9IG51bGwpIHtcclxuXHRcdFx0XHRzd2FwU2xvdHMoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRnYW1lLnNlbmRHYW1lSW5mb1BsYXllcih0aGlzLmlkLCBcIllvdXIgaW52ZW50b3J5IGlzIGZ1bGwuXCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRlcXVpcEl0ZW0oaXRlbSkge1xyXG5cdFx0Y29uc3QgZXF1aXBwZWRJdGVtID0gdGhpcy5nZXRJdGVtKGl0ZW0uZXF1aXBwZWRTbG90ICsgY29uZmlnLklOVkVOVE9SWV9TSVpFKTtcclxuXHRcdGl0ZW0uc2xvdCA9IGl0ZW0uZXF1aXBwZWRTbG90ICsgY29uZmlnLklOVkVOVE9SWV9TSVpFO1xyXG5cdFx0aWYgKGVxdWlwcGVkSXRlbSkgZXF1aXBwZWRJdGVtLnNsb3QgPSB0aGlzLmZpbmRGaXJzdEVtcHR5U2xvdCgpO1xyXG5cdFx0dGhpcy5jYWxjQm9udXNTdGF0cygpO1xyXG5cdH1cclxuXHJcblx0dW5lcXVpcEl0ZW0oaXRlbSkge1xyXG5cdFx0Y29uc3QgbmV3U2xvdCA9IHRoaXMuZmluZEZpcnN0RW1wdHlTbG90KCk7XHJcblx0XHRpZiAobmV3U2xvdCA9PSBudWxsKSB7XHJcblx0XHRcdGdhbWUuc2VuZEdhbWVJbmZvUGxheWVyKHRoaXMuZ2FtZUlkLCBcIllvdXIgaW52ZW50b3J5IGlzIGZ1bGwuXCIpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRpdGVtLnNsb3QgPSBuZXdTbG90O1xyXG5cdFx0dGhpcy5jYWxjQm9udXNTdGF0cygpO1xyXG5cdH1cclxuXHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHQvLyBJbnZlbnRvcnkgSXRlbSBVcGRhdGVcclxuXHRcdGNvbnN0IGludmVudG9yeSA9IHRoaXMuZ2V0SW52ZW50b3J5KCk7XHJcblx0XHRpbnZlbnRvcnkuZm9yRWFjaChpdGVtID0+IHtcclxuXHRcdFx0aWYgKGl0ZW0pIGl0ZW0udXBkYXRlKCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRpZiAodGhpcy5pc0RlYWQpIHJldHVybjtcclxuXHRcdFxyXG5cdFx0Ly8gQXR0YWNraW5nXHJcblx0XHRpZiAodGhpcy5pc0F0dGFja2luZyB8fCB0aGlzLmF0dGFja1RpbWVyID4gMCkge1xyXG5cdFx0XHR0aGlzLmF0dGFja1RpbWVyICs9IGRlbHRhO1xyXG5cdFx0XHRpZiAodGhpcy5hdHRhY2tUaW1lciA+PSAwLjMpIHRoaXMuaXNBdHRhY2tpbmcgPSBmYWxzZTtcclxuXHRcdFx0aWYgKHRoaXMuYXR0YWNrVGltZXIgPj0gdGhpcy5hdHRhY2tTcGVlZCkgdGhpcy5hdHRhY2tUaW1lciA9IDA7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vIE1vdmVtZW50XHJcblx0XHRpZiAodGhpcy5pc01vdmluZykge1xyXG5cdFx0XHR0aGlzLmxlcnAgKz0gZGVsdGEgKiB0aGlzLm1vdmVTcGVlZDtcclxuXHRcdFx0XHJcblx0XHRcdGlmICh0aGlzLmxlcnAgPj0gMC40OSkge1xyXG5cdFx0XHRcdHRoaXMueCA9IHRoaXMuZGVzdGluYXRpb25YO1xyXG5cdFx0XHRcdHRoaXMueSA9IHRoaXMuZGVzdGluYXRpb25ZO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAodGhpcy5sZXJwID49IDAuOTkpIHtcclxuXHRcdFx0XHR0aGlzLnN0YXJ0WCA9IHRoaXMuZGVzdGluYXRpb25YO1xyXG5cdFx0XHRcdHRoaXMuc3RhcnRZID0gdGhpcy5kZXN0aW5hdGlvblk7XHJcblx0XHRcdFx0dGhpcy5sZXJwID0gMDtcclxuXHRcdFx0XHR0aGlzLmlzTW92aW5nID0gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyBSZWdlblxyXG5cdFx0dGhpcy5yZWdlblRpbWVyICs9IGRlbHRhO1xyXG5cdFx0aWYgKHRoaXMucmVnZW5UaW1lciA+PSAxKSB7XHJcblx0XHRcdHRoaXMucmVnZW5UaW1lciA9IDA7XHJcblx0XHRcdGlmICh0aGlzLmhlYWx0aCA8IHRoaXMuaGVhbHRoTWF4KSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuaXNIaXQpIHtcclxuXHRcdFx0XHRcdHRoaXMuaXNIaXQgPSBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLmhlYWx0aCArPSB0aGlzLmhlYWx0aFJlZ2VuO1xyXG5cdFx0XHRcdFx0aWYgKHRoaXMuaGVhbHRoID4gdGhpcy5oZWFsdGhNYXgpIHRoaXMuaGVhbHRoID0gdGhpcy5oZWFsdGhNYXg7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAodGhpcy5lbmVyZ3kgPCB0aGlzLmVuZXJneU1heCkge1xyXG5cdFx0XHRcdGlmICghdGhpcy5pc1J1bm5pbmcpIHtcclxuXHRcdFx0XHRcdHRoaXMuZW5lcmd5ICs9IHRoaXMuZW5lcmd5UmVnZW47XHJcblx0XHRcdFx0XHRpZiAodGhpcy5lbmVyZ3kgPiB0aGlzLmVuZXJneU1heCkgdGhpcy5lbmVyZ3kgPSB0aGlzLmVuZXJneU1heDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHRnZXRJbnZlbnRvcnlQYWNrKCkge1xyXG5cdFx0Y29uc3QgaW52ZW50b3J5UGFjayA9IFtdO1xyXG5cdFx0Y29uc3QgaW52ZW50b3J5ID0gdGhpcy5nZXRJbnZlbnRvcnkoKTtcclxuXHRcdGludmVudG9yeS5mb3JFYWNoKChpdGVtKSA9PiB7XHJcblx0XHRcdGlmIChpdGVtKSBpbnZlbnRvcnlQYWNrW2l0ZW0uc2xvdF0gPSBpdGVtLmdldFBhY2soKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBpbnZlbnRvcnlQYWNrO1xyXG5cdH1cclxufVxyXG4iLCJpbXBvcnQgZ2FtZSBmcm9tICcuLi9nYW1lLmpzJztcclxuaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9jb25maWcuanMnO1xyXG5pbXBvcnQgdXRpbCBmcm9tICcuLi91dGlsLmpzJztcclxuaW1wb3J0IEFjdG9yIGZyb20gJy4vYWN0b3IuanMnO1xyXG5cclxuLy8gQSBCb3QgaXMgYW4gQWN0b3Igd2l0aCBjb25kaXRpb25hbCBpbnB1dHNcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJvdCBleHRlbmRzIEFjdG9yIHtcclxuXHRjb25zdHJ1Y3RvcihkYXRhKSB7XHJcblx0XHRsZXQgeyBfaWQsIG1hcElkLCB4LCB5LCBkaXJlY3Rpb24sIHRlbXBsYXRlLCBuYW1lLCBzcHJpdGUsIGhvc3RpbGUsXHJcblx0XHRcdFx0XHRkYW1hZ2VCYXNlLCBkZWZlbmNlQmFzZSwgaGVhbHRoTWF4QmFzZSwgZW5lcmd5TWF4QmFzZSwgaGVhbHRoUmVnZW5CYXNlLCBlbmVyZ3lSZWdlbkJhc2UsIHJhbmdlQmFzZSBcclxuXHRcdFx0XHR9ID0gZGF0YTtcclxuXHRcdFxyXG5cdFx0aWYgKF9pZCA9PSBudWxsKSBfaWQgPSBnYW1lLnJlcXVlc3REQklkKCk7XHJcblx0XHRpZiAobmFtZSA9PSBudWxsKSBuYW1lID0gdGVtcGxhdGUubmFtZTtcclxuXHRcdGlmIChzcHJpdGUgPT0gbnVsbCkgc3ByaXRlID0gdGVtcGxhdGUuc3ByaXRlO1xyXG5cdFx0aWYgKGhvc3RpbGUgPT0gbnVsbCkgaG9zdGlsZSA9IHRlbXBsYXRlLmhvc3RpbGU7XHJcblx0XHRpZiAoZGFtYWdlQmFzZSA9PSBudWxsKSBkYW1hZ2VCYXNlID0gdGVtcGxhdGUuZGFtYWdlQmFzZTtcclxuXHRcdGlmIChkZWZlbmNlQmFzZSA9PSBudWxsKSBkZWZlbmNlQmFzZSA9IHRlbXBsYXRlLmRlZmVuY2VCYXNlO1xyXG5cdFx0aWYgKGhlYWx0aE1heEJhc2UgPT0gbnVsbCkgaGVhbHRoTWF4QmFzZSA9IHRlbXBsYXRlLmhlYWx0aE1heEJhc2U7XHJcblx0XHRpZiAoZW5lcmd5TWF4QmFzZSA9PSBudWxsKSBlbmVyZ3lNYXhCYXNlID0gdGVtcGxhdGUuZW5lcmd5TWF4QmFzZTtcclxuXHRcdGlmIChoZWFsdGhSZWdlbkJhc2UgPT0gbnVsbCkgaGVhbHRoUmVnZW5CYXNlID0gdGVtcGxhdGUuaGVhbHRoUmVnZW5CYXNlO1xyXG5cdFx0aWYgKGVuZXJneVJlZ2VuQmFzZSA9PSBudWxsKSBlbmVyZ3lSZWdlbkJhc2UgPSB0ZW1wbGF0ZS5lbmVyZ3lSZWdlbkJhc2U7XHJcblx0XHRpZiAocmFuZ2VCYXNlID09IG51bGwpIHJhbmdlQmFzZSA9IHRlbXBsYXRlLnJhbmdlQmFzZTtcclxuXHJcblx0XHRzdXBlcihtYXBJZCwgeCwgeSwgZGlyZWN0aW9uLCBuYW1lLCBzcHJpdGUpO1xyXG5cdFx0dGhpcy5ib3RJZCA9IF9pZDtcclxuXHRcdHRoaXMudGVtcGxhdGVJZCA9IHRlbXBsYXRlLl9pZDtcclxuXHRcdHRoaXMuZGFtYWdlQmFzZSA9IGRhbWFnZUJhc2U7XHJcblx0XHR0aGlzLmRlZmVuY2VCYXNlID0gZGVmZW5jZUJhc2U7XHJcblx0XHR0aGlzLmhlYWx0aE1heEJhc2UgPSBoZWFsdGhNYXhCYXNlO1xyXG5cdFx0dGhpcy5lbmVyZ3lNYXhCYXNlID0gZW5lcmd5TWF4QmFzZTtcclxuXHRcdHRoaXMuaGVhbHRoUmVnZW5CYXNlID0gaGVhbHRoUmVnZW5CYXNlO1xyXG5cdFx0dGhpcy5lbmVyZ3lSZWdlbkJhc2UgPSBlbmVyZ3lSZWdlbkJhc2U7XHJcblx0XHR0aGlzLnJhbmdlQmFzZSA9IHJhbmdlQmFzZTtcclxuXHRcdHRoaXMuY2FsY0JvbnVzU3RhdHMoKTtcclxuXHRcdHRoaXMucmVzdG9yZSgpO1xyXG5cdFx0XHJcblx0XHR0aGlzLmhvc3RpbGUgPSBob3N0aWxlO1xyXG5cdFx0dGhpcy50YXJnZXQgPSBudWxsO1xyXG5cdFx0dGhpcy5zZXRUYXNrKCd3YW5kZXJpbmcnKTtcclxuXHRcdHRoaXMubW92ZVRpbWVyID0gMDtcclxuXHJcblx0XHR0aGlzLmdhbWVJZCA9IHV0aWwuZmlyc3RFbXB0eUluZGV4KGdhbWUuYm90cyk7XHJcblx0XHRnYW1lLmJvdHNbdGhpcy5nYW1lSWRdID0gdGhpcztcclxuXHR9XHJcblxyXG5cdHVwZGF0ZShkZWx0YSkge1xyXG5cdFx0c3VwZXIudXBkYXRlKGRlbHRhKTsgXHQvLyBEZWZhdWx0IEFjdG9yIFVwZGF0ZVxyXG5cdFx0aWYgKHRoaXMuaXNEZWFkKSByZXR1cm47XHJcblxyXG5cdFx0dGhpcy5tb3ZlVGltZXIrKztcclxuXHRcdFxyXG5cdFx0Ly8gQUkgSW5wdXRzXHJcblx0XHRzd2l0Y2godGhpcy50YXNrKSB7XHJcblx0XHRcdGNhc2UgJ3dhbmRlcmluZyc6XHRcdC8vIE1vdmUgcmFuZG9tbHlcclxuXHRcdFx0XHR0aGlzLm1vdmUoKTtcclxuXHRcdFx0XHR0aGlzLnBpY2tVcCgpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnZm9sbG93aW5nJzpcdFx0Ly8gTW92ZSB0b3dhcmRzIHRhcmdldFxyXG5cdFx0XHRcdGlmICh0aGlzLnRhcmdldCkge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlVG9UYXJnZXQodGhpcy50YXJnZXQsIGZhbHNlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHQvLyBObyB0YXJnZXRcclxuXHRcdFx0XHRcdHRoaXMuc2V0VGFzaygnd2FuZGVyaW5nJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnYXR0YWNraW5nJzpcdFx0Ly8gTW92ZSB0b3dhcmRzIHRhcmdldCBhbmQgYXR0YWNrXHJcblx0XHRcdFx0aWYgKHRoaXMudGFyZ2V0KSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmVUb1RhcmdldCh0aGlzLnRhcmdldCwgdHJ1ZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly8gTm8gdGFyZ2V0XHJcblx0XHRcdFx0XHR0aGlzLnNldFRhc2soJ3dhbmRlcmluZycpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdC8vIGNhc2UgJ2lkbGUnOlxyXG5cdFx0XHRkZWZhdWx0OiBcdFx0XHRcdFx0Ly8gU3RhbmQgc3RpbGxcclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiB0aGlzLmdldFBhY2soKTtcclxuXHR9XHJcblx0XHJcblx0Z2V0UGFjaygpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGdhbWVJZDogdGhpcy5nYW1lSWQsXHJcblx0XHRcdG5hbWU6IHRoaXMubmFtZSxcclxuXHRcdFx0c3ByaXRlOiB0aGlzLnNwcml0ZSxcclxuXHRcdFx0ZGlyZWN0aW9uOiB0aGlzLmRpcmVjdGlvbixcclxuXHRcdFx0bWFwSWQ6IHRoaXMubWFwSWQsXHJcblx0XHRcdHg6IHRoaXMuc3RhcnRYLFxyXG5cdFx0XHR5OiB0aGlzLnN0YXJ0WSxcclxuXHRcdFx0ejogdGhpcy56LFxyXG5cdFx0XHRkZXN0aW5hdGlvblg6IHRoaXMuZGVzdGluYXRpb25YLFxyXG5cdFx0XHRkZXN0aW5hdGlvblk6IHRoaXMuZGVzdGluYXRpb25ZLFxyXG5cdFx0XHRsZXJwOiB0aGlzLmxlcnAsXHJcblx0XHRcdGlzUnVubmluZzogdGhpcy5pc1J1bm5pbmcsXHJcblx0XHRcdGlzQXR0YWNraW5nOiB0aGlzLmlzQXR0YWNraW5nLFxyXG5cdFx0XHRpc0RlYWQ6IGZhbHNlLFxyXG5cdFx0XHRpc1Zpc2libGU6IHRoaXMuaXNWaXNpYmxlXHJcblx0XHR9O1xyXG5cdH1cclxuXHRcclxuXHRnZXREQlBhY2soKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRib3RJZDogdGhpcy5ib3RJZCxcclxuXHRcdFx0dGVtcGxhdGVJZDogdGhpcy50ZW1wbGF0ZUlkLFxyXG5cdFx0XHRtYXBJZDogdGhpcy5tYXBJZCxcclxuXHRcdFx0eDogdGhpcy54LFxyXG5cdFx0XHR5OiB0aGlzLnksXHJcblx0XHRcdGRpcmVjdGlvbjogdGhpcy5kaXJlY3Rpb24sXHJcblx0XHRcdG5hbWU6IHRoaXMubmFtZSxcclxuXHRcdFx0c3ByaXRlOiB0aGlzLnNwcml0ZSxcclxuXHRcdFx0aG9zdGlsZTogdGhpcy5ob3N0aWxlXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0cmVtb3ZlKCkge1xyXG5cdFx0ZGVsZXRlIGdhbWUuYm90c1t0aGlzLmdhbWVJZF07XHJcblx0fVxyXG5cdFxyXG5cdG1vdmUoZGlyZWN0aW9uKSB7XHJcblx0XHRsZXQgbW92ZVRpbWUgPSAyNDtcclxuXHRcdGlmICh0aGlzLmlzUnVubmluZykgbW92ZVRpbWUgPSAxNztcclxuXHRcdGlmICh0aGlzLm1vdmVUaW1lciA+IG1vdmVUaW1lICYmIHRoaXMuYXR0YWNrVGltZXIgPT09IDApIHtcclxuXHRcdFx0c3VwZXIubW92ZShkaXJlY3Rpb24pO1xyXG5cdFx0XHR0aGlzLm1vdmVUaW1lciA9IDA7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHRha2VEYW1hZ2UoZGFtYWdlLCBhdHRhY2tlcikge1xyXG5cdFx0aWYgKGF0dGFja2VyIGluc3RhbmNlb2YgQWN0b3IpIHRoaXMuc2V0VGFzaygnYXR0YWNraW5nJywgYXR0YWNrZXIpO1xyXG5cdFx0c3VwZXIudGFrZURhbWFnZShkYW1hZ2UsIGF0dGFja2VyKTtcclxuXHR9XHJcblx0XHJcblx0cGlja1VwKCkge1xyXG5cdFx0c3VwZXIucGlja1VwKCk7XHJcblx0XHR0aGlzLmNoZWNrQmVzdEVxdWlwbWVudCgpO1xyXG5cdH1cclxuXHJcblx0Z2V0SW52ZW50b3J5KCkge1xyXG5cdFx0Y29uc3QgaW52ZW50b3J5ID0gZ2FtZS5pdGVtcy5maWx0ZXIoaXRlbSA9PiB7XHJcblx0XHRcdHJldHVybiBcIlwiK2l0ZW0uYm90SWQgPT09IFwiXCIrdGhpcy5ib3RJZDtcclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIGludmVudG9yeTtcclxuXHR9XHJcblxyXG5cdHNldERlYWQoKSB7XHJcblx0XHRzdXBlci5zZXREZWFkKCk7XHJcblx0XHR0aGlzLnJlbW92ZSgpO1xyXG5cdH1cclxuXHJcblx0Ly8gSW5wdXRzXHJcblx0c2V0VGFzayh0YXNrLCB0YXJnZXQpIHtcclxuXHRcdHN3aXRjaCAodGFzaykge1xyXG5cdFx0XHRjYXNlICd3YW5kZXJpbmcnOlxyXG5cdFx0XHRcdHRoaXMubGF6aW5lc3MgPSA3O1xyXG5cdFx0XHRcdHRoaXMudGFyZ2V0ID0gbnVsbDtcclxuXHRcdFx0XHR0aGlzLnRhc2sgPSB0YXNrO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnZm9sbG93aW5nJzpcclxuXHRcdFx0XHRpZiAodGFyZ2V0ID09PSBudWxsKSB7XHJcblx0XHRcdFx0XHR0aGlzLnNldFRhc2soJ3dhbmRlcmluZycpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubGF6aW5lc3MgPSAwO1xyXG5cdFx0XHRcdFx0dGhpcy50YXJnZXQgPSB0YXJnZXQ7XHJcblx0XHRcdFx0XHR0aGlzLnRhc2sgPSB0YXNrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ2F0dGFja2luZyc6XHJcblx0XHRcdFx0aWYgKHRhcmdldCA9PT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0dGhpcy5zZXRUYXNrKCd3YW5kZXJpbmcnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLmxhemluZXNzID0gMDtcclxuXHRcdFx0XHRcdHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xyXG5cdFx0XHRcdFx0dGhpcy50YXNrID0gdGFzaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRkZWZhdWx0Olx0Ly9pZGxpbmdcclxuXHRcdFx0XHR0aGlzLmxhemluZXNzID0gNztcclxuXHRcdFx0XHR0aGlzLnRhcmdldCA9IG51bGw7XHJcblx0XHRcdFx0dGhpcy50YXNrID0gJ2lkbGUnO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0Y2hlY2tCZXN0RXF1aXBtZW50KCkge1xyXG5cdFx0Y29uc3QgaW52ZW50b3J5ID0gdGhpcy5nZXRJbnZlbnRvcnkoKTtcclxuXHRcdGNvbnN0IGVxdWlwbWVudCA9IFtdO1xyXG5cdFx0Zm9yIChsZXQgc2xvdCA9IDA7IHNsb3QgPCBjb25maWcuRVFVSVBNRU5UX1NJWkU7IHNsb3QrKykge1xyXG5cdFx0XHRlcXVpcG1lbnQucHVzaChbXSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBpbnZlbnRvcnkubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgaXRlbSA9IGludmVudG9yeVtpXTtcclxuXHRcdFx0Zm9yIChsZXQgc2xvdCA9IDA7IHNsb3QgPCBjb25maWcuRVFVSVBNRU5UX1NJWkU7IHNsb3QrKykge1xyXG5cdFx0XHRcdGlmIChpdGVtLmVxdWlwcGVkU2xvdCA9PT0gc2xvdCkge1xyXG5cdFx0XHRcdFx0ZXF1aXBtZW50W3Nsb3RdLnB1c2goaXRlbSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGVxdWlwbWVudFswXS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdGVxdWlwbWVudFswXS5zb3J0KChhLCBiKSA9PiBiLmVxdWlwcGVkLmRhbWFnZSAtIGEuZXF1aXBwZWQuZGFtYWdlKTtcclxuXHRcdFx0dGhpcy5lcXVpcEl0ZW0oZXF1aXBtZW50WzBdWzBdKTtcclxuXHRcdH1cclxuXHRcdGlmIChlcXVpcG1lbnRbMV0ubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRlcXVpcG1lbnRbMV0uc29ydCgoYSwgYikgPT4gYi5lcXVpcHBlZC5kZWZlbmNlIC0gYS5lcXVpcHBlZC5kZWZlbmNlKTtcclxuXHRcdFx0dGhpcy5lcXVpcEl0ZW0oZXF1aXBtZW50WzFdWzBdKTtcclxuXHRcdH1cclxuXHRcdGlmIChlcXVpcG1lbnRbMl0ubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRlcXVpcG1lbnRbMl0uc29ydCgoYSwgYikgPT4gYi5lcXVpcHBlZC5kZWZlbmNlIC0gYS5lcXVpcHBlZC5kZWZlbmNlKTtcclxuXHRcdFx0dGhpcy5lcXVpcEl0ZW0oZXF1aXBtZW50WzJdWzBdKTtcclxuXHRcdH1cclxuXHRcdGlmIChlcXVpcG1lbnRbM10ubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRlcXVpcG1lbnRbM10uc29ydCgoYSwgYikgPT4gYi5lcXVpcHBlZC5kZWZlbmNlIC0gYS5lcXVpcHBlZC5kZWZlbmNlKTtcclxuXHRcdFx0dGhpcy5lcXVpcEl0ZW0oZXF1aXBtZW50WzNdWzBdKTtcclxuXHRcdH1cclxuXHRcdGlmIChlcXVpcG1lbnRbNF0ubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRlcXVpcG1lbnRbNF0uc29ydCgoYSwgYikgPT4gYi5lcXVpcHBlZC5kZWZlbmNlIC0gYS5lcXVpcHBlZC5kZWZlbmNlKTtcclxuXHRcdFx0dGhpcy5lcXVpcEl0ZW0oZXF1aXBtZW50WzRdWzBdKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuIiwiaW1wb3J0IEVudGl0eSBmcm9tICcuL2VudGl0eS5qcyc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4uL2dhbWUuanMnO1xyXG5pbXBvcnQgY29uZmlnIGZyb20gJy4uL2NvbmZpZy5qcyc7XHJcbmltcG9ydCB1dGlsIGZyb20gJy4uL3V0aWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWZmZWN0IGV4dGVuZHMgRW50aXR5IHtcclxuXHRjb25zdHJ1Y3RvcihtYXBJZCwgeCwgeSwgc3ByaXRlID0gMCwgbG9vcCA9IDAsIHNwZWVkID0gMTIsIG1heEZyYW1lID0gNywgc3RhcnRGcmFtZSA9IDApIHtcclxuXHRcdHN1cGVyKG1hcElkLCB4LCB5LCB1dGlsLmNsYW1wKHNwcml0ZSwgMCwgY29uZmlnLk1BWF9FRkZFQ1RTIC0gMSkpO1xyXG5cdFx0dGhpcy5tYXhGcmFtZSA9IHV0aWwuY2xhbXAobWF4RnJhbWUsIDAsIDcpO1xyXG5cdFx0dGhpcy5zdGFydEZyYW1lID0gdXRpbC5jbGFtcChzdGFydEZyYW1lLCAwLCB0aGlzLm1heEZyYW1lKTtcclxuXHRcdHRoaXMuY3VycmVudEZyYW1lID0gdGhpcy5zdGFydEZyYW1lO1xyXG5cdFx0XHJcblx0XHR0aGlzLmxvb3AgPSBsb29wO1xyXG5cdFx0dGhpcy5zcGVlZCA9IHNwZWVkO1xyXG5cdFx0dGhpcy50aW1lciA9IDA7XHJcblx0XHRcclxuXHRcdHRoaXMuZ2FtZUlkID0gdXRpbC5maXJzdEVtcHR5SW5kZXgoZ2FtZS5lZmZlY3RzKTtcclxuXHRcdGdhbWUuZWZmZWN0c1t0aGlzLmdhbWVJZF0gPSB0aGlzO1xyXG5cdH1cclxuXHRcclxuXHR1cGRhdGUoZGVsdGEpIHtcclxuXHRcdHRoaXMudGltZXIgKz0gZGVsdGE7XHJcblx0XHRcclxuXHRcdGlmICh0aGlzLnRpbWVyID49IDEgLyB0aGlzLnNwZWVkKSB7XHJcblx0XHRcdHRoaXMudGltZXIgPSAwO1xyXG5cdFx0XHR0aGlzLmN1cnJlbnRGcmFtZSsrO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuY3VycmVudEZyYW1lID4gdGhpcy5tYXhGcmFtZSkge1xyXG5cdFx0XHRcdGlmICh0aGlzLmxvb3AgPCAwKSB7XHJcblx0XHRcdFx0XHR0aGlzLmN1cnJlbnRGcmFtZSA9IHRoaXMuc3RhcnRGcmFtZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBpZiAodGhpcy5sb29wID4gMCkge1xyXG5cdFx0XHRcdFx0dGhpcy5jdXJyZW50RnJhbWUgPSB0aGlzLnN0YXJ0RnJhbWU7XHJcblx0XHRcdFx0XHR0aGlzLmxvb3AtLTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLmN1cnJlbnRGcmFtZSA9IHRoaXMubWF4RnJhbWU7XHJcblx0XHRcdFx0XHR0aGlzLnJlbW92ZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0aGlzLmdldFBhY2soKTtcclxuXHR9XHJcblx0XHJcblx0Z2V0UGFjaygpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGdhbWVJZDogdGhpcy5nYW1lSWQsXHJcblx0XHRcdG1hcElkOiB0aGlzLm1hcElkLFxyXG5cdFx0XHR4OiB0aGlzLngsXHJcblx0XHRcdHk6IHRoaXMueSxcclxuXHRcdFx0c3ByaXRlOiB0aGlzLnNwcml0ZSxcclxuXHRcdFx0Y3VycmVudEZyYW1lOiB0aGlzLmN1cnJlbnRGcmFtZVxyXG5cdFx0fTtcclxuXHR9XHJcblx0XHJcblx0cmVtb3ZlKCkge1xyXG5cdFx0ZGVsZXRlIGdhbWUuZWZmZWN0c1t0aGlzLmdhbWVJZF07XHJcblx0fVx0XHJcbn1cclxuIiwiaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9jb25maWcuanMnO1xyXG5cclxuLy8gQW4gRW50aXR5IGlzIGFueSBvYmplY3Qgd2hpY2ggY2FuIGFwcGVhciBvbiB0aGUgbWFwXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbnRpdHkge1xyXG5cdGNvbnN0cnVjdG9yKG1hcElkLCB4LCB5LCBzcHJpdGUgPSAxKSB7XHJcblx0XHR0aGlzLm1hcElkID0gbWFwSWQ7XHJcblx0XHR0aGlzLnggPSB4O1xyXG5cdFx0dGhpcy55ID0geTtcclxuXHRcdGlmIChzcHJpdGUgPCAxKSBzcHJpdGUgPSAxO1xyXG5cdFx0dGhpcy5zcHJpdGUgPSBzcHJpdGU7XHJcblx0XHR0aGlzLmlzVmlzaWJsZSA9IHRydWU7XHJcblx0fVxyXG59XHJcbiIsImltcG9ydCBnYW1lIGZyb20gJy4uL2dhbWUuanMnO1xyXG5pbXBvcnQgdXRpbCBmcm9tICcuLi91dGlsLmpzJztcclxuaW1wb3J0IEVudGl0eSBmcm9tICcuL2VudGl0eS5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJdGVtIGV4dGVuZHMgRW50aXR5IHtcclxuXHRjb25zdHJ1Y3RvcihkYXRhKSB7XHJcblx0XHRpZiAoIWRhdGEpIHJldHVybjtcclxuXHJcblx0XHRsZXQgeyBfaWQsIHBsYXllcklkLCBib3RJZCwgc2xvdCwgbWFwSWQsIHgsIHksIHRlbXBsYXRlLCBzdGFjaywgc3ByaXRlLCBuYW1lLCBkZXNjcmlwdGlvbiwgcmV1c2FibGUsIGNyZWF0ZWRCeSwgY3JlYXRlZERhdGUsXHJcblx0XHRcdFx0XHRwYXNzaXZlRGFtYWdlLCBwYXNzaXZlRGVmZW5jZSwgcGFzc2l2ZUhlYWx0aE1heCwgcGFzc2l2ZUVuZXJneU1heCwgcGFzc2l2ZUhlYWx0aFJlZ2VuLCBwYXNzaXZlRW5lcmd5UmVnZW4sIHBhc3NpdmVSYW5nZSxcclxuXHRcdFx0XHRcdGVxdWlwcGVkRGFtYWdlLCBlcXVpcHBlZERlZmVuY2UsIGVxdWlwcGVkSGVhbHRoTWF4LCBlcXVpcHBlZEVuZXJneU1heCwgZXF1aXBwZWRIZWFsdGhSZWdlbiwgZXF1aXBwZWRFbmVyZ3lSZWdlbiwgZXF1aXBwZWRSYW5nZVxyXG5cdFx0XHRcdH0gPSBkYXRhO1xyXG5cclxuXHRcdGlmIChfaWQgPT0gbnVsbCkgX2lkID0gZ2FtZS5yZXF1ZXN0REJJZCgpO1xyXG5cdFx0aWYgKHBsYXllcklkID09PSB1bmRlZmluZWQpIHBsYXllcklkID0gbnVsbDtcclxuXHRcdGlmIChib3RJZCA9PT0gdW5kZWZpbmVkKSBib3RJZCA9IG51bGw7XHJcblx0XHRpZiAoc2xvdCA9PT0gdW5kZWZpbmVkKSBzbG90ID0gbnVsbDtcclxuXHRcdGlmIChtYXBJZCA9PT0gdW5kZWZpbmVkKSBtYXBJZCA9IG51bGw7XHJcblx0XHRpZiAoeCA9PT0gdW5kZWZpbmVkKSB4ID0gbnVsbDtcclxuXHRcdGlmICh5ID09PSB1bmRlZmluZWQpIHkgPSBudWxsO1xyXG5cdFx0aWYgKGNyZWF0ZWRCeSA9PT0gdW5kZWZpbmVkKSBjcmVhdGVkQnkgPSBudWxsO1xyXG5cdFx0aWYgKGNyZWF0ZWREYXRlID09PSB1bmRlZmluZWQpIGNyZWF0ZWREYXRlID0gbmV3IERhdGUoKTtcclxuXHJcblx0XHRpZiAoc3ByaXRlID09PSB1bmRlZmluZWQpIHNwcml0ZSA9IHRlbXBsYXRlLnNwcml0ZTtcclxuXHRcdGlmIChuYW1lID09PSB1bmRlZmluZWQpIG5hbWUgPSB0ZW1wbGF0ZS5uYW1lO1xyXG5cdFx0aWYgKGRlc2NyaXB0aW9uID09PSB1bmRlZmluZWQpIGRlc2NyaXB0aW9uID0gdGVtcGxhdGUuZGVzY3JpcHRpb247XHJcblx0XHRpZiAocmV1c2FibGUgPT09IHVuZGVmaW5lZCkgcmV1c2FibGUgPSB0ZW1wbGF0ZS5yZXVzYWJsZTtcclxuXHRcdGlmIChwYXNzaXZlRGFtYWdlID09PSB1bmRlZmluZWQpIHBhc3NpdmVEYW1hZ2UgPSB0ZW1wbGF0ZS5wYXNzaXZlRGFtYWdlO1xyXG5cdFx0aWYgKHBhc3NpdmVEZWZlbmNlID09PSB1bmRlZmluZWQpIHBhc3NpdmVEZWZlbmNlID0gdGVtcGxhdGUucGFzc2l2ZURlZmVuY2U7XHJcblx0XHRpZiAocGFzc2l2ZUhlYWx0aE1heCA9PT0gdW5kZWZpbmVkKSBwYXNzaXZlSGVhbHRoTWF4ID0gdGVtcGxhdGUucGFzc2l2ZUhlYWx0aE1heDtcclxuXHRcdGlmIChwYXNzaXZlRW5lcmd5TWF4ID09PSB1bmRlZmluZWQpIHBhc3NpdmVFbmVyZ3lNYXggPSB0ZW1wbGF0ZS5wYXNzaXZlRW5lcmd5TWF4O1xyXG5cdFx0aWYgKHBhc3NpdmVIZWFsdGhSZWdlbiA9PT0gdW5kZWZpbmVkKSBwYXNzaXZlSGVhbHRoUmVnZW4gPSB0ZW1wbGF0ZS5wYXNzaXZlSGVhbHRoUmVnZW47XHJcblx0XHRpZiAocGFzc2l2ZUVuZXJneVJlZ2VuID09PSB1bmRlZmluZWQpIHBhc3NpdmVFbmVyZ3lSZWdlbiA9IHRlbXBsYXRlLnBhc3NpdmVFbmVyZ3lSZWdlbjtcclxuXHRcdGlmIChwYXNzaXZlUmFuZ2UgPT09IHVuZGVmaW5lZCkgcGFzc2l2ZVJhbmdlID0gdGVtcGxhdGUucGFzc2l2ZVJhbmdlO1xyXG5cdFx0aWYgKGVxdWlwcGVkRGFtYWdlID09PSB1bmRlZmluZWQpIGVxdWlwcGVkRGFtYWdlID0gdGVtcGxhdGUuZXF1aXBwZWREYW1hZ2U7XHJcblx0XHRpZiAoZXF1aXBwZWREZWZlbmNlID09PSB1bmRlZmluZWQpIGVxdWlwcGVkRGVmZW5jZSA9IHRlbXBsYXRlLmVxdWlwcGVkRGVmZW5jZTtcclxuXHRcdGlmIChlcXVpcHBlZEhlYWx0aE1heCA9PT0gdW5kZWZpbmVkKSBlcXVpcHBlZEhlYWx0aE1heCA9IHRlbXBsYXRlLmVxdWlwcGVkSGVhbHRoTWF4O1xyXG5cdFx0aWYgKGVxdWlwcGVkRW5lcmd5TWF4ID09PSB1bmRlZmluZWQpIGVxdWlwcGVkRW5lcmd5TWF4ID0gdGVtcGxhdGUuZXF1aXBwZWRFbmVyZ3lNYXg7XHJcblx0XHRpZiAoZXF1aXBwZWRIZWFsdGhSZWdlbiA9PT0gdW5kZWZpbmVkKSBlcXVpcHBlZEhlYWx0aFJlZ2VuID0gdGVtcGxhdGUuZXF1aXBwZWRIZWFsdGhSZWdlbjtcclxuXHRcdGlmIChlcXVpcHBlZEVuZXJneVJlZ2VuID09PSB1bmRlZmluZWQpIGVxdWlwcGVkRW5lcmd5UmVnZW4gPSB0ZW1wbGF0ZS5lcXVpcHBlZEVuZXJneVJlZ2VuO1xyXG5cdFx0aWYgKGVxdWlwcGVkUmFuZ2UgPT09IHVuZGVmaW5lZCkgZXF1aXBwZWRSYW5nZSA9IHRlbXBsYXRlLmVxdWlwcGVkUmFuZ2U7XHJcblxyXG5cdFx0c3VwZXIobWFwSWQsIHgsIHksIHNwcml0ZSk7XHJcblx0XHR0aGlzLnogPSAtMTA7XHJcblx0XHR0aGlzLml0ZW1JZCA9IF9pZDtcclxuXHRcdHRoaXMucGxheWVySWQgPSBwbGF5ZXJJZDtcclxuXHRcdHRoaXMuYm90SWQgPSBib3RJZDtcclxuXHRcdHRoaXMuc2xvdCA9IHNsb3Q7XHJcblx0XHRcclxuXHRcdHRoaXMudGVtcGxhdGVJZCA9IHRlbXBsYXRlLl9pZDtcclxuXHRcdHRoaXMubmFtZSA9IG5hbWU7XHJcblx0XHR0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XHJcblx0XHR0aGlzLnJldXNhYmxlID0gcmV1c2FibGU7XHJcblxyXG5cdFx0dGhpcy50eXBlID0gdGVtcGxhdGUudHlwZS5uYW1lO1xyXG5cdFx0dGhpcy5zdGFja2FibGUgPSB0ZW1wbGF0ZS50eXBlLnN0YWNrYWJsZTtcclxuXHRcdHRoaXMuZXF1aXBwZWRTbG90ID0gdGVtcGxhdGUudHlwZS5lcXVpcHBlZFNsb3Q7XHJcblx0XHRcclxuXHRcdHRoaXMucGFzc2l2ZSA9IHtcclxuXHRcdFx0ZGFtYWdlOiBwYXNzaXZlRGFtYWdlLFxyXG5cdFx0XHRkZWZlbmNlOiBwYXNzaXZlRGVmZW5jZSxcclxuXHRcdFx0aGVhbHRoTWF4OiBwYXNzaXZlSGVhbHRoTWF4LFxyXG5cdFx0XHRlbmVyZ3lNYXg6IHBhc3NpdmVFbmVyZ3lNYXgsXHJcblx0XHRcdGhlYWx0aFJlZ2VuOiBwYXNzaXZlSGVhbHRoUmVnZW4sXHJcblx0XHRcdGVuZXJneVJlZ2VuOiBwYXNzaXZlRW5lcmd5UmVnZW4sXHJcblx0XHRcdHJhbmdlOiBwYXNzaXZlUmFuZ2VcclxuXHRcdH07XHJcblx0XHR0aGlzLmVxdWlwcGVkID0ge1xyXG5cdFx0XHRkYW1hZ2U6IGVxdWlwcGVkRGFtYWdlLFxyXG5cdFx0XHRkZWZlbmNlOiBlcXVpcHBlZERlZmVuY2UsXHJcblx0XHRcdGhlYWx0aE1heDogZXF1aXBwZWRIZWFsdGhNYXgsXHJcblx0XHRcdGVuZXJneU1heDogZXF1aXBwZWRFbmVyZ3lNYXgsXHJcblx0XHRcdGhlYWx0aFJlZ2VuOiBlcXVpcHBlZEhlYWx0aFJlZ2VuLFxyXG5cdFx0XHRlbmVyZ3lSZWdlbjogZXF1aXBwZWRFbmVyZ3lSZWdlbixcclxuXHRcdFx0cmFuZ2U6IGVxdWlwcGVkUmFuZ2VcclxuXHRcdH07XHJcblx0XHRcclxuXHRcdGlmICh0aGlzLnN0YWNrYWJsZSkge1xyXG5cdFx0XHRpZiAoc3RhY2sgPCAxKSBzdGFjayA9IDE7XHJcblx0XHRcdHRoaXMuc3RhY2sgPSBzdGFjaztcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHR0aGlzLnN0YWNrID0gMDtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLmdhbWVJZCA9IHV0aWwuZmlyc3RFbXB0eUluZGV4KGdhbWUuaXRlbXMpO1xyXG5cdFx0Z2FtZS5pdGVtc1t0aGlzLmdhbWVJZF0gPSB0aGlzO1xyXG5cdH1cclxuXHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5nZXRQYWNrKCk7XHJcblx0fVxyXG5cclxuXHRnZXREQlBhY2soKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRpdGVtSWQ6IHRoaXMuaXRlbUlkLFxyXG5cdFx0XHRwbGF5ZXJJZDogdGhpcy5wbGF5ZXJJZCxcclxuXHRcdFx0Ym90SWQ6IHRoaXMuYm90SWQsXHJcblx0XHRcdHNsb3Q6IHRoaXMuc2xvdCxcclxuXHRcdFx0bWFwSWQ6IHRoaXMubWFwSWQsXHJcblx0XHRcdHg6IHRoaXMueCxcclxuXHRcdFx0eTogdGhpcy55LFxyXG5cdFx0XHRjcmVhdGVkQnk6IHRoaXMuY3JlYXRlZEJ5LFxyXG5cdFx0XHRjcmVhdGVkRGF0ZTogdGhpcy5jcmVhdGVkRGF0ZSxcclxuXHRcdFx0dGVtcGxhdGVJZDogdGhpcy50ZW1wbGF0ZUlkLFxyXG5cdFx0XHRuYW1lOiB0aGlzLm5hbWUsXHJcblx0XHRcdGRlc2NyaXB0aW9uOiB0aGlzLmRlc2NyaXB0aW9uLFxyXG5cdFx0XHRzcHJpdGU6IHRoaXMuc3ByaXRlLFxyXG5cdFx0XHRyZXVzYWJsZTogdGhpcy5yZXVzYWJsZSxcclxuXHRcdFx0cGFzc2l2ZURhbWFnZTogdGhpcy5wYXNzaXZlLmRhbWFnZSxcclxuXHRcdFx0cGFzc2l2ZURlZmVuY2U6IHRoaXMucGFzc2l2ZS5kZWZlbmNlLFxyXG5cdFx0XHRwYXNzaXZlSGVhbHRoTWF4OiB0aGlzLnBhc3NpdmUuaGVhbHRoTWF4LFxyXG5cdFx0XHRwYXNzaXZlRW5lcmd5TWF4OiB0aGlzLnBhc3NpdmUuZW5lcmd5TWF4LFxyXG5cdFx0XHRwYXNzaXZlUmFuZ2U6IHRoaXMucGFzc2l2ZS5yYW5nZSxcclxuXHRcdFx0ZXF1aXBwZWREYW1hZ2U6IHRoaXMuZXF1aXBwZWQuZGFtYWdlLFxyXG5cdFx0XHRlcXVpcHBlZERlZmVuY2U6IHRoaXMuZXF1aXBwZWQuZGVmZW5jZSxcclxuXHRcdFx0ZXF1aXBwZWRIZWFsdGhNYXg6IHRoaXMuZXF1aXBwZWQuaGVhbHRoTWF4LFxyXG5cdFx0XHRlcXVpcHBlZEVuZXJneU1heDogdGhpcy5lcXVpcHBlZC5lbmVyZ3lNYXgsXHJcblx0XHRcdGVxdWlwcGVkUmFuZ2U6IHRoaXMuZXF1aXBwZWQucmFuZ2UsXHJcblx0XHRcdHN0YWNrOiB0aGlzLnN0YWNrLFxyXG5cdFx0XHRpc1Zpc2libGU6IHRoaXMuaXNWaXNpYmxlXHJcblx0XHR9O1xyXG5cdH1cclxuXHRcclxuXHRnZXRQYWNrKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0Z2FtZUlkOiB0aGlzLmdhbWVJZCxcclxuXHRcdFx0cGxheWVySWQ6IHRoaXMucGxheWVySWQsXHJcblx0XHRcdGJvdElkOiB0aGlzLmJvdElkLFxyXG5cdFx0XHRzbG90OiB0aGlzLnNsb3QsXHJcblx0XHRcdG1hcElkOiB0aGlzLm1hcElkLFxyXG5cdFx0XHR4OiB0aGlzLngsXHJcblx0XHRcdHk6IHRoaXMueSxcclxuXHRcdFx0ejogdGhpcy56LFxyXG5cdFx0XHRuYW1lOiB0aGlzLm5hbWUsXHJcblx0XHRcdGRlc2NyaXB0aW9uOiB0aGlzLmRlc2NyaXB0aW9uLFxyXG5cdFx0XHRzcHJpdGU6IHRoaXMuc3ByaXRlLFxyXG5cdFx0XHR0eXBlOiB0aGlzLnR5cGUsXHJcblx0XHRcdHJldXNhYmxlOiB0aGlzLnJldXNhYmxlLFxyXG5cdFx0XHRwYXNzaXZlOiB0aGlzLnBhc3NpdmUsXHJcblx0XHRcdGVxdWlwcGVkOiB0aGlzLmVxdWlwcGVkLFxyXG5cdFx0XHRzdGFjazogdGhpcy5zdGFjayxcclxuXHRcdFx0aXNWaXNpYmxlOiB0aGlzLmlzVmlzaWJsZVxyXG5cdFx0fTtcclxuXHR9XHJcblx0XHJcblx0cmVtb3ZlKCkge1xyXG5cdFx0ZGVsZXRlIGdhbWUuaXRlbXNbdGhpcy5nYW1lSWRdO1xyXG5cdH1cclxuXHJcblx0cmVtb3ZlT25lKCkge1xyXG5cdFx0aWYgKHRoaXMuc3RhY2sgPiAxKSB7XHJcblx0XHRcdHRoaXMuc3RhY2stLTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHR0aGlzLnJlbW92ZSgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0bW92ZVRvSW52ZW50b3J5KHBsYXllcklkLCBib3RJZCwgc2xvdCkge1xyXG5cdFx0dGhpcy5wbGF5ZXJJZCA9IHBsYXllcklkO1xyXG5cdFx0dGhpcy5ib3RJZCA9IGJvdElkO1xyXG5cdFx0dGhpcy5zbG90ID0gc2xvdDtcclxuXHRcdHRoaXMubWFwSWQgPSBudWxsO1xyXG5cdFx0dGhpcy54ID0gbnVsbDtcclxuXHRcdHRoaXMueSA9IG51bGw7XHJcblx0XHR0aGlzLnogPSBudWxsO1xyXG5cdH1cclxuXHJcblx0bW92ZVRvTWFwKG1hcElkLCB4LCB5KSB7XHJcblx0XHR0aGlzLm1hcElkID0gbWFwSWQ7XHJcblx0XHR0aGlzLnggPSB4O1xyXG5cdFx0dGhpcy55ID0geTtcclxuXHRcdHRoaXMueiA9IHRoaXMuZ2V0WlBvc2l0aW9uKG1hcElkLCB4LCB5KTtcclxuXHRcdHRoaXMucGxheWVySWQgPSBudWxsO1xyXG5cdFx0dGhpcy5ib3RJZCA9IG51bGw7XHJcblx0XHR0aGlzLnNsb3QgPSBudWxsO1xyXG5cdH1cclxuXHRcclxuXHRnZXRaUG9zaXRpb24obWFwSWQsIHgsIHkpIHtcclxuXHRcdHJldHVybiAtMTA7XHJcblx0fVxyXG5cclxuXHRpc0VxdWlwbWVudCgpIHtcclxuXHRcdGlmICh0aGlzLmVxdWlwcGVkU2xvdCA+PSAwKSB7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuIiwiaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9jb25maWcuanMnO1xyXG5pbXBvcnQgdXRpbCBmcm9tICcuLi91dGlsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hcCB7XHJcblx0Y29uc3RydWN0b3IobWFwSWQsIGRhdGEgPSB7fSkge1xyXG5cdFx0dGhpcy5tYXBJZCA9IG1hcElkO1xyXG5cclxuXHRcdGlmIChkYXRhLm5hbWUgPT0gbnVsbCkgZGF0YS5uYW1lID0gXCJCbGFuayBNYXBcIjtcclxuXHRcdGlmIChkYXRhLmRyb3BDaGFuY2UgPT0gbnVsbCkgZGF0YS5kcm9wQ2hhbmNlID0gMTAwO1xyXG5cdFx0aWYgKGRhdGEuZHJvcEFtb3VudEVRID09IG51bGwpIGRhdGEuZHJvcEFtb3VudEVRID0gMTtcclxuXHRcdGlmICghZGF0YS50aWxlcykgZGF0YS50aWxlcyA9IHV0aWwuY3JlYXRlM2RBcnJheShjb25maWcuTUFQX0NPTFVNTlMsIGNvbmZpZy5NQVBfUk9XUywgY29uZmlnLk1BUF9MQVlFUlMsIDApO1xyXG5cdFx0aWYgKCFkYXRhLmlzV2FsbCkgZGF0YS5pc1dhbGwgPSB1dGlsLmNyZWF0ZTJkQXJyYXkoY29uZmlnLk1BUF9DT0xVTU5TLCBjb25maWcuTUFQX1JPV1MsIGZhbHNlKTtcclxuXHRcdGlmICghZGF0YS5pc0hvc3RpbGUpIGRhdGEuaXNIb3N0aWxlID0gdXRpbC5jcmVhdGUyZEFycmF5KGNvbmZpZy5NQVBfQ09MVU1OUywgY29uZmlnLk1BUF9ST1dTLCBmYWxzZSk7XHJcblx0XHRpZiAoIWRhdGEuZGFtYWdlKSBkYXRhLmRhbWFnZSA9IHV0aWwuY3JlYXRlMmRBcnJheShjb25maWcuTUFQX0NPTFVNTlMsIGNvbmZpZy5NQVBfUk9XUywgbnVsbCk7XHJcblx0XHRpZiAoIWRhdGEud2FycE1hcCkgZGF0YS53YXJwTWFwID0gdXRpbC5jcmVhdGUyZEFycmF5KGNvbmZpZy5NQVBfQ09MVU1OUywgY29uZmlnLk1BUF9ST1dTLCBudWxsKTtcclxuXHRcdGlmICghZGF0YS53YXJwWCkgZGF0YS53YXJwWCA9IHV0aWwuY3JlYXRlMmRBcnJheShjb25maWcuTUFQX0NPTFVNTlMsIGNvbmZpZy5NQVBfUk9XUywgbnVsbCk7XHJcblx0XHRpZiAoIWRhdGEud2FycFkpIGRhdGEud2FycFkgPSB1dGlsLmNyZWF0ZTJkQXJyYXkoY29uZmlnLk1BUF9DT0xVTU5TLCBjb25maWcuTUFQX1JPV1MsIG51bGwpO1xyXG5cclxuXHRcdHRoaXMubmFtZSA9IGRhdGEubmFtZTtcclxuXHRcdHRoaXMuZHJvcENoYW5jZSA9IHV0aWwuY2xhbXAoZGF0YS5kcm9wQ2hhbmNlLCAwLCAxMDApO1xyXG5cdFx0dGhpcy5kcm9wQW1vdW50RVEgPSB1dGlsLmNsYW1wKGRhdGEuZHJvcEFtb3VudEVRLCAwLCBjb25maWcuRVFVSVBNRU5UX1NJWkUpO1xyXG5cdFx0Ly90aGlzLmRyb3BDaGFuY2UgPSAwID0gMCUgY2hhbmNlIHRvIGRyb3AgaXRlbXMgaW4gaW52ZW50b3J5IChkcm9wIG5vdGhpbmcpLCAxMDAgPSAxMDAlIGNoYW5jZSB0byBkcm9wIChkcm9wIGV2ZXJ5dGhpbmcpXHJcblx0XHQvL3RoaXMuZHJvcEFtb3VudEVRID0gbnVtYmVyIG9mIGVxdWlwcGVkIGl0ZW1zIHRoZSBwbGF5ZXIgd2lsbCBkcm9wIG9uIGRlYXRoLiBkcm9wRVEgPSBFUVVJUE1FTlRfU0laRSA9IGRyb3AgYWxsIGVxdWlwbWVudFxyXG5cdFx0dGhpcy50aWxlcyA9IGRhdGEudGlsZXM7XHJcblx0XHR0aGlzLmlzV2FsbCA9IGRhdGEuaXNXYWxsO1xyXG5cdFx0dGhpcy5pc0hvc3RpbGUgPSBkYXRhLmlzSG9zdGlsZTtcclxuXHRcdHRoaXMuZGFtYWdlID0gZGF0YS5kYW1hZ2U7XHJcblx0XHR0aGlzLndhcnBNYXAgPSBkYXRhLndhcnBNYXA7XHJcblx0XHR0aGlzLndhcnBYID0gZGF0YS53YXJwWDtcclxuXHRcdHRoaXMud2FycFkgPSBkYXRhLndhcnBZO1xyXG5cdH1cclxuXHRcclxuXHR1cGxvYWQoZGF0YSkge1xyXG5cdFx0aWYgKGRhdGEubmFtZSAhPSBudWxsKSB0aGlzLm5hbWUgPSBkYXRhLm5hbWU7XHJcblx0XHRpZiAoZGF0YS5kcm9wQ2hhbmNlICE9IG51bGwpIHRoaXMuZHJvcENoYW5jZSA9IGRhdGEuZHJvcENoYW5jZTtcclxuXHRcdGlmIChkYXRhLmRyb3BBbW91bnRFUSAhPSBudWxsKSB0aGlzLmRyb3BBbW91bnRFUSA9IGRhdGEuZHJvcEFtb3VudEVRO1xyXG5cdFx0aWYgKGRhdGEudGlsZXMpIHRoaXMudGlsZXMgPSBkYXRhLnRpbGVzO1xyXG5cdFx0aWYgKGRhdGEuaXNXYWxsKSB0aGlzLmlzV2FsbCA9IGRhdGEuaXNXYWxsO1xyXG5cdFx0aWYgKGRhdGEuaXNIb3N0aWxlKSB0aGlzLmlzSG9zdGlsZSA9IGRhdGEuaXNIb3N0aWxlO1xyXG5cdFx0aWYgKGRhdGEuZGFtYWdlKSB0aGlzLmRhbWFnZSA9IGRhdGEuZGFtYWdlO1xyXG5cdFx0aWYgKGRhdGEud2FycE1hcCkgdGhpcy53YXJwTWFwID0gZGF0YS53YXJwTWFwO1xyXG5cdFx0aWYgKGRhdGEud2FycFgpIHRoaXMud2FycFggPSBkYXRhLndhcnBYO1xyXG5cdFx0aWYgKGRhdGEud2FycFkpIHRoaXMud2FycFkgPSBkYXRhLndhcnBZO1xyXG5cdH1cclxuXHJcblx0Z2V0UGFjaygpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdG1hcElkOiB0aGlzLm1hcElkLFxyXG5cdFx0XHRuYW1lOiB0aGlzLm5hbWUsXHJcblx0XHRcdGRyb3BDaGFuY2U6IHRoaXMuZHJvcENoYW5jZSxcclxuXHRcdFx0ZHJvcEFtb3VudEVROiB0aGlzLmRyb3BBbW91bnRFUSxcclxuXHRcdFx0dGlsZXM6IHRoaXMudGlsZXMsXHJcblx0XHRcdGlzV2FsbDogdGhpcy5pc1dhbGwsXHJcblx0XHRcdGlzSG9zdGlsZTogdGhpcy5pc0hvc3RpbGUsXHJcblx0XHRcdGRhbWFnZTogdGhpcy5kYW1hZ2UsXHJcblx0XHRcdHdhcnBNYXA6IHRoaXMud2FycE1hcCxcclxuXHRcdFx0d2FycFg6IHRoaXMud2FycFgsXHJcblx0XHRcdHdhcnBZOiB0aGlzLndhcnBZXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0Z2V0VXBkYXRlUGFjaygpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdG1hcElkOiB0aGlzLm1hcElkLFxyXG5cdFx0XHRuYW1lOiB0aGlzLm5hbWUsXHJcblx0XHRcdHRpbGVzOiB0aGlzLnRpbGVzXHJcblx0XHR9O1xyXG5cdH1cclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBNZXNzYWdlIHtcclxuXHRjb25zdHJ1Y3RvcihzZW5kZXJJZCwgbWVzc2FnZSwgdHlwZSwgbWFwSWQsIGlkLCBjb2xvdXIpIHtcclxuXHRcdHRoaXMuc2VuZGVySWQgPSBzZW5kZXJJZDsgLy8gbnVsbCA9IHNlcnZlclxyXG5cdFx0dGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcclxuXHRcdHRoaXMudHlwZSA9IHR5cGU7XHJcblx0XHR0aGlzLm1hcElkID0gbWFwSWQ7XHJcblx0XHR0aGlzLmlkID0gaWQ7XHJcblx0XHR0aGlzLmNvbG91ciA9IGNvbG91cjtcclxuXHR9XHJcbn0iLCJpbXBvcnQgZ2FtZSBmcm9tICcuLi9nYW1lLmpzJztcclxuaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9jb25maWcuanMnO1xyXG5pbXBvcnQgdXRpbCBmcm9tICcuLi91dGlsLmpzJztcclxuaW1wb3J0IEFjdG9yIGZyb20gJy4vYWN0b3IuanMnO1xyXG5cclxuLy8gQSBQbGF5ZXIgaXMgYW4gaW1tb3J0YWwgQWN0b3Igd2hpY2ggdGFrZXMgaW5wdXQgZnJvbSBhIGNsaWVudFxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyIGV4dGVuZHMgQWN0b3Ige1xyXG5cdGNvbnN0cnVjdG9yKHNvY2tldElkLCBkYXRhKSB7XHJcblx0XHRpZiAoZGF0YS5zcHJpdGUgPT0gbnVsbCkgZGF0YS5zcHJpdGUgPSBkYXRhLnRlbXBsYXRlLnNwcml0ZTtcclxuXHJcblx0XHRzdXBlcihkYXRhLm1hcElkLCBkYXRhLngsIGRhdGEueSwgZGF0YS5kaXJlY3Rpb24sIGRhdGEubmFtZSwgZGF0YS5zcHJpdGUpO1xyXG5cdFx0dGhpcy5wbGF5ZXJJZCA9IGRhdGEuX2lkO1xyXG5cdFx0dGhpcy5zb2NrZXRJZCA9IHNvY2tldElkO1xyXG5cdFx0dGhpcy5hY2NvdW50SWQgPSBkYXRhLmFjY291bnQ7XHJcblx0XHR0aGlzLmFkbWluQWNjZXNzID0gZGF0YS5hZG1pbkFjY2VzcztcclxuXHJcblx0XHR0aGlzLmxldmVsID0gZGF0YS5sZXZlbDtcclxuXHRcdHRoaXMuZXhwZXJpZW5jZSA9IGRhdGEuZXhwZXJpZW5jZTtcclxuXHRcdHRoaXMudGVtcGxhdGVJZCA9IGRhdGEudGVtcGxhdGUuX2lkO1xyXG5cdFx0dGhpcy50ZW1wbGF0ZSA9IGRhdGEudGVtcGxhdGUubmFtZTtcclxuXHRcdHRoaXMuY2FsY0Jhc2VTdGF0cyhkYXRhLnRlbXBsYXRlKTtcclxuXHRcdHRoaXMuY2FsY0JvbnVzU3RhdHMoKTtcclxuXHRcdHRoaXMucmVzdG9yZSgpO1xyXG5cclxuXHRcdHRoaXMuaXNEZWFkID0gZmFsc2U7XHJcblx0XHR0aGlzLmRlYXRocyA9IDA7XHJcblx0XHR0aGlzLnJlc3Bhd25UaW1lciA9IDA7XHJcblx0XHR0aGlzLnJlc3Bhd25TcGVlZCA9IDEwO1xyXG5cdFx0dGhpcy5yZXNwYXduTWFwID0gZGF0YS5tYXBJZDtcclxuXHRcdHRoaXMucmVzcGF3blggPSBkYXRhLng7XHJcblx0XHR0aGlzLnJlc3Bhd25ZID0gZGF0YS55O1xyXG5cclxuXHRcdHRoaXMuaW5wdXQgPSB7XHJcblx0XHRcdGRpcmVjdGlvbjogbnVsbCxcclxuXHRcdFx0cnVuOiBmYWxzZSxcclxuXHRcdFx0cGlja3VwOiBmYWxzZSxcclxuXHRcdFx0YXR0YWNrOiBmYWxzZVxyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLmdhbWVJZCA9IHV0aWwuZmlyc3RFbXB0eUluZGV4KGdhbWUucGxheWVycyk7XHJcblx0XHRnYW1lLnBsYXllcnNbdGhpcy5nYW1lSWRdID0gdGhpcztcclxuXHR9XHJcblxyXG5cdHVwZGF0ZShkZWx0YSkge1xyXG5cdFx0c3VwZXIudXBkYXRlKGRlbHRhKTtcdFx0Ly8gRGVmYXVsdCBBY3RvciBVcGRhdGVcclxuXHRcdGlmICh0aGlzLmlzRGVhZCkge1xyXG5cdFx0XHQvLyBSZXNwYXduaW5nXHJcblx0XHRcdHRoaXMucmVzcGF3blRpbWVyICs9IGRlbHRhO1xyXG5cdFx0XHRpZiAodGhpcy5yZXNwYXduVGltZXIgPj0gdGhpcy5yZXNwYXduU3BlZWQpIHRoaXMucmVzcGF3bigpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdC8vIENoZWNrIGZvciBBdHRhY2sgSW5wdXRcclxuXHRcdFx0aWYgKHRoaXMuaW5wdXQuYXR0YWNrICYmIHRoaXMuYXR0YWNrVGltZXIgPT09IDApIHRoaXMuYXR0YWNrKCk7XHJcblx0XHRcdFxyXG5cdFx0XHQvLyBDaGVjayBmb3IgTW92ZW1lbnQgSW5wdXRcclxuXHRcdFx0aWYgKCF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0dGhpcy5pc1J1bm5pbmcgPSBmYWxzZTtcclxuXHRcdFx0XHRpZiAodGhpcy5pbnB1dC5kaXJlY3Rpb24pIHtcclxuXHRcdFx0XHRcdC8vIENoZWNrIGZvciBSdW4gSW5wdXRcclxuXHRcdFx0XHRcdGlmICh0aGlzLmlucHV0LnJ1biAmJiB0aGlzLmVuZXJneSA+IDApIHRoaXMuaXNSdW5uaW5nID0gdHJ1ZTtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSh0aGlzLmlucHV0LmRpcmVjdGlvbik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiB0aGlzLmdldEdhbWVQYWNrKCk7XHJcblx0fVxyXG5cdFxyXG5cdGdldEdhbWVQYWNrKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0Z2FtZUlkOiB0aGlzLmdhbWVJZCxcclxuXHRcdFx0bmFtZTogdGhpcy5uYW1lLFxyXG5cdFx0XHRkZXNjcmlwdGlvbjogdGhpcy5kZXNjcmlwdGlvbixcclxuXHRcdFx0c3ByaXRlOiB0aGlzLnNwcml0ZSxcclxuXHRcdFx0ZGlyZWN0aW9uOiB0aGlzLmRpcmVjdGlvbixcclxuXHRcdFx0bWFwSWQ6IHRoaXMubWFwSWQsXHJcblx0XHRcdHg6IHRoaXMuc3RhcnRYLFxyXG5cdFx0XHR5OiB0aGlzLnN0YXJ0WSxcclxuXHRcdFx0ejogdGhpcy56LFxyXG5cdFx0XHRkZXN0aW5hdGlvblg6IHRoaXMuZGVzdGluYXRpb25YLFxyXG5cdFx0XHRkZXN0aW5hdGlvblk6IHRoaXMuZGVzdGluYXRpb25ZLFxyXG5cdFx0XHRsZXJwOiB0aGlzLmxlcnAsXHJcblx0XHRcdGlzUnVubmluZzogdGhpcy5pc1J1bm5pbmcsXHJcblx0XHRcdGlzQXR0YWNraW5nOiB0aGlzLmlzQXR0YWNraW5nLFxyXG5cdFx0XHRpc0RlYWQ6IHRoaXMuaXNEZWFkLFxyXG5cdFx0XHRpc1Zpc2libGU6IHRoaXMuaXNWaXNpYmxlXHJcblx0XHR9O1xyXG5cdH1cclxuXHRcclxuXHRnZXRVSVBhY2soKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRsZXZlbDogdGhpcy5sZXZlbCxcclxuXHRcdFx0ZXhwZXJpZW5jZTogdGhpcy5leHBlcmllbmNlLFxyXG5cdFx0XHRoZWFsdGg6IHRoaXMuaGVhbHRoLFxyXG5cdFx0XHRoZWFsdGhNYXg6IHRoaXMuaGVhbHRoTWF4LFxyXG5cdFx0XHRlbmVyZ3k6IHRoaXMuZW5lcmd5LFxyXG5cdFx0XHRlbmVyZ3lNYXg6IHRoaXMuZW5lcmd5TWF4LFxyXG5cdFx0XHRtb3ZlU3BlZWQ6IHRoaXMubW92ZVNwZWVkLFxyXG5cdFx0XHRhdHRhY2tTcGVlZDogdGhpcy5hdHRhY2tTcGVlZCxcclxuXHRcdFx0YXR0YWNrVGltZXI6IHRoaXMuYXR0YWNrVGltZXIsXHJcblx0XHRcdGludmVudG9yeTogdGhpcy5nZXRJbnZlbnRvcnlQYWNrKClcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHRnZXREQlBhY2soKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRuYW1lOiB0aGlzLm5hbWUsXHJcblx0XHRcdGFjY291bnQ6IHRoaXMuYWNjb3VudElkLFxyXG5cdFx0XHR0ZW1wbGF0ZTogdGhpcy50ZW1wbGF0ZUlkLFxyXG5cdFx0XHRsZXZlbDogdGhpcy5sZXZlbCxcclxuXHRcdFx0ZXhwZXJpZW5jZTogdGhpcy5leHBlcmllbmNlLFxyXG5cdFx0XHRtYXBJZDogdGhpcy5tYXBJZCxcclxuXHRcdFx0eDogdGhpcy54LFxyXG5cdFx0XHR5OiB0aGlzLnksXHJcblx0XHRcdGRpcmVjdGlvbjogdGhpcy5kaXJlY3Rpb24sXHJcblx0XHRcdGFkbWluQWNjZXNzOiB0aGlzLmFkbWluQWNjZXNzLFxyXG5cdFx0XHRzcHJpdGU6IHRoaXMuc3ByaXRlXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRpbnB1dERhdGEoZGF0YSkge1xyXG5cdFx0aWYgKHRoaXMuaXNEZWFkKSB7XHJcblx0XHRcdGdhbWUuc2VuZEdhbWVJbmZvUGxheWVyKHRoaXMuZ2FtZUlkLCBcIllvdSBhcmUgZGVhZC5cIik7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoZ2FtZS5nb2RDb21tYW5kc1tkYXRhLmlucHV0XSkge1xyXG5cdFx0XHRpZiAodGhpcy5hZG1pbkFjY2VzcyA+IDApIGdhbWUuZ29kQ29tbWFuZHNbZGF0YS5pbnB1dF0oZGF0YSwgdGhpcyk7XHJcblx0XHRcdGVsc2UgZ2FtZS5zZW5kR2FtZUluZm9QbGF5ZXIodGhpcy5nYW1lSWQsIFwiWW91IGRvbid0IGhhdmUgYWNjZXNzIHRvIHRoYXQgY29tbWFuZC5cIik7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0aWYgKGdhbWUuY29tbWFuZHNbZGF0YS5pbnB1dF0pIGdhbWUuY29tbWFuZHNbZGF0YS5pbnB1dF0oZGF0YSwgdGhpcyk7XHJcblx0XHRcdGVsc2UgZ2FtZS5zZW5kR2FtZUluZm9QbGF5ZXIodGhpcy5nYW1lSWQsIFwiSW52YWxpZCBjb21tYW5kLlwiKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHBpY2tVcCgpIHtcclxuXHRcdGlmIChzdXBlci5waWNrVXAoKSA9PT0gZmFsc2UpIGdhbWUuc2VuZEdhbWVJbmZvUGxheWVyKHRoaXMuZ2FtZUlkLCBcIllvdXIgaW52ZW50b3J5IGlzIGZ1bGwuXCIpO1xyXG5cdH1cclxuXHRcclxuXHRnZXRJbnZlbnRvcnkoKSB7XHJcblx0XHRjb25zdCBpbnZlbnRvcnkgPSBnYW1lLml0ZW1zLmZpbHRlcihpdGVtID0+IHtcclxuXHRcdFx0cmV0dXJuIFwiXCIraXRlbS5wbGF5ZXJJZCA9PT0gXCJcIit0aGlzLnBsYXllcklkO1xyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gaW52ZW50b3J5O1xyXG5cdH1cclxuXHJcblx0c2V0RGVhZCgpIHtcclxuXHRcdHN1cGVyLnNldERlYWQoKTtcclxuXHRcdHRoaXMuaXNEZWFkID0gdHJ1ZTtcclxuXHRcdHRoaXMuaGVhbHRoID0gMDtcclxuXHRcdHRoaXMuZW5lcmd5ID0gMDtcclxuXHRcdHRoaXMuZGVhdGhzKys7XHJcblx0fVxyXG5cclxuXHRyZXNwYXduKCkge1xyXG5cdFx0dGhpcy5tYXBJZCA9IHRoaXMucmVzcGF3bk1hcDtcclxuXHRcdHRoaXMueCA9IHRoaXMucmVzcGF3blg7XHJcblx0XHR0aGlzLnkgPSB0aGlzLnJlc3Bhd25ZO1xyXG5cdFx0dGhpcy5zdGFydFggPSB0aGlzLnJlc3Bhd25YO1xyXG5cdFx0dGhpcy5zdGFydFkgPSB0aGlzLnJlc3Bhd25ZO1xyXG5cdFx0dGhpcy5kZXN0aW5hdGlvblggPSB0aGlzLnJlc3Bhd25YO1xyXG5cdFx0dGhpcy5kZXN0aW5hdGlvblkgPSB0aGlzLnJlc3Bhd25ZO1xyXG5cdFx0XHJcblx0XHR0aGlzLmNhbGNCb251c1N0YXRzKCk7XHJcblx0XHR0aGlzLnJlc3RvcmUoKTtcclxuXHRcdFxyXG5cdFx0dGhpcy5pc1dhbGtpbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMuaXNSdW5uaW5nID0gZmFsc2U7XHJcblx0XHR0aGlzLmlzQXR0YWNraW5nID0gZmFsc2U7XHJcblx0XHR0aGlzLmlzRGVhZCA9IGZhbHNlO1xyXG5cdFx0dGhpcy5yZXNwYXduVGltZXIgPSAwO1xyXG5cdFx0Z2FtZS5zZW5kR2FtZUluZm9QbGF5ZXIodGhpcy5nYW1lSWQsIFwiVGhlIEFuZ2VsIG9mIE1lcmN5IHJlZnVzZXMgdG8gbGV0IHlvdSBkaWUuXCIpO1xyXG5cdH1cclxuXHJcblx0Z2FpbkV4cGVyaWVuY2UoZXhwZXJpZW5jZSkge1xyXG5cdFx0aWYgKHRoaXMuZXhwZXJpZW5jZSArIGV4cGVyaWVuY2UgPD0gMCkge1xyXG5cdFx0XHR0aGlzLmV4cGVyaWVuY2UgPSAwO1x0XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLmV4cGVyaWVuY2UgKz0gZXhwZXJpZW5jZTtcclxuXHRcdGlmICh0aGlzLmV4cGVyaWVuY2UgPj0gZ2FtZS5leHBlcmllbmNlVG9MZXZlbFt0aGlzLmxldmVsXSkge1xyXG5cdFx0XHR0aGlzLmxldmVsVXAoKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGxldmVsVXAoKSB7XHJcblx0XHRpZiAodGhpcy5sZXZlbCA8IGNvbmZpZy5NQVhfTEVWRUwpIHtcclxuXHRcdFx0Y29uc3Qgcm9sbG92ZXJFeHBlcmllbmNlID0gdGhpcy5leHBlcmllbmNlIC0gZ2FtZS5leHBlcmllbmNlVG9MZXZlbFt0aGlzLmxldmVsXTtcclxuXHRcdFx0dGhpcy5leHBlcmllbmNlID0gMDtcclxuXHRcdFx0dGhpcy5sZXZlbCsrO1xyXG5cdFx0XHR0aGlzLmNhbGNCYXNlU3RhdHMoKTtcclxuXHRcdFx0Z2FtZS5zZW5kR2FtZUluZm9QbGF5ZXIodGhpcy5nYW1lSWQsIGBMZXZlbCB1cCEgWW91IGFyZSBub3cgbGV2ZWwgJHt0aGlzLmxldmVsfSFgKTtcclxuXHRcdFx0dGhpcy5nYWluRXhwZXJpZW5jZShyb2xsb3ZlckV4cGVyaWVuY2UpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRjYWxjQmFzZVN0YXRzKHRlbXBsYXRlKSB7XHJcblx0XHRpZiAoIXRlbXBsYXRlKSB0ZW1wbGF0ZSA9IGdhbWUucGxheWVyVGVtcGxhdGVzW3RoaXMudGVtcGxhdGVJZF07XHJcblx0XHRzdXBlci5jYWxjQmFzZVN0YXRzKHRlbXBsYXRlKTtcclxuXHR9XHJcbn1cclxuIiwiaW1wb3J0IGdhbWUgZnJvbSAnLi4vZ2FtZS5qcyc7XHJcbmltcG9ydCB1dGlsIGZyb20gJy4uL3V0aWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGV4dCB7XHJcblx0Y29uc3RydWN0b3IobWFwSWQsIHgsIHksIG1lc3NhZ2UsIGNvbG91ciA9ICcjMDAwMDAwJywgZGlzcGxheVRpbWUgPSAyLCB2ZWxYID0gMCwgdmVsWSA9IDApIHtcclxuXHRcdHRoaXMubWFwSWQgPSBtYXBJZDtcclxuXHRcdHRoaXMueCA9IHg7XHJcblx0XHR0aGlzLnkgPSB5O1xyXG5cdFx0dGhpcy52ZWxYID0gdmVsWDtcclxuXHRcdHRoaXMudmVsWSA9IHZlbFk7XHJcblx0XHR0aGlzLmxlcnBYID0gMDtcclxuXHRcdHRoaXMubGVycFkgPSAwO1xyXG5cclxuXHRcdHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XHJcblx0XHR0aGlzLmNvbG91ciA9IGNvbG91cjtcclxuXHRcdHRoaXMuZGlzcGxheVRpbWUgPSBkaXNwbGF5VGltZTtcclxuXHRcdHRoaXMudGltZXIgPSAwO1xyXG5cclxuXHRcdHRoaXMuZ2FtZUlkID0gdXRpbC5maXJzdEVtcHR5SW5kZXgoZ2FtZS50ZXh0cyk7XHJcblx0XHRnYW1lLnRleHRzW3RoaXMuZ2FtZUlkXSA9IHRoaXM7XHJcblx0fVxyXG5cdFxyXG5cdHVwZGF0ZShkZWx0YSkge1xyXG5cdFx0dGhpcy50aW1lciArPSBkZWx0YTtcclxuXHRcdGlmICh0aGlzLmRpc3BsYXlUaW1lID4gMCAmJiB0aGlzLnRpbWVyID4gdGhpcy5kaXNwbGF5VGltZSkge1xyXG5cdFx0XHR0aGlzLnJlbW92ZSgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMubGVycFggKz0gZGVsdGEgKiB0aGlzLnZlbFg7XHJcblx0XHR0aGlzLmxlcnBZICs9IGRlbHRhICogdGhpcy52ZWxZO1xyXG5cclxuXHRcdGlmICh0aGlzLmxlcnBYIDwgLTEpIHtcclxuXHRcdFx0dGhpcy5sZXJwWCsrO1xyXG5cdFx0XHR0aGlzLngtLTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKHRoaXMubGVycFggPiAxKSB7XHJcblx0XHRcdHRoaXMubGVycFgtLTtcclxuXHRcdFx0dGhpcy54Kys7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMubGVycFkgPCAtMSkge1xyXG5cdFx0XHR0aGlzLmxlcnBZKys7XHJcblx0XHRcdHRoaXMueS0tO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAodGhpcy5sZXJwWSA+IDEpIHtcclxuXHRcdFx0dGhpcy5sZXJwWS0tO1xyXG5cdFx0XHR0aGlzLnkrKztcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIHRoaXMuZ2V0UGFjaygpO1xyXG5cdH1cclxuXHRcclxuXHRnZXRQYWNrKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0Z2FtZUlkOiB0aGlzLmdhbWVJZCxcclxuXHRcdFx0bWFwSWQ6IHRoaXMubWFwSWQsXHJcblx0XHRcdHg6IHRoaXMueCxcclxuXHRcdFx0eTogdGhpcy55LFxyXG5cdFx0XHRsZXJwWDogdGhpcy5sZXJwWCxcclxuXHRcdFx0bGVycFk6IHRoaXMubGVycFksXHJcblx0XHRcdG1lc3NhZ2U6IHRoaXMubWVzc2FnZSxcclxuXHRcdFx0Y29sb3VyOiB0aGlzLmNvbG91clxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdHJlbW92ZSgpIHtcclxuXHRcdGRlbGV0ZSBnYW1lLnRleHRzW3RoaXMuZ2FtZUlkXTtcclxuXHR9XHJcbn1cclxuIiwiY29uc3QgY29uZmlnID0ge307XHJcblxyXG5jb25maWcuUE9SVCA9IDIwMDA7XHJcbmNvbmZpZy5GUkFNRVJBVEUgPSAxMDAwIC8gNjA7XHJcbmNvbmZpZy5CQUNLVVBfVElNRSA9IDEyMDtcclxuXHJcbmNvbmZpZy5NQVBfTEFZRVJTID0gNjtcclxuY29uZmlnLk1BUF9DT0xVTU5TID0gMTI7XHJcbmNvbmZpZy5NQVBfUk9XUyA9IDEyO1xyXG5cclxuY29uZmlnLk1BWF9NQVBTID0gMTA7XHJcbmNvbmZpZy5NQVhfVVNFUlMgPSAxMDA7XHJcbmNvbmZpZy5NQVhfU1BSSVRFUyA9IDEzO1xyXG5jb25maWcuTUFYX0VGRkVDVFMgPSA3MTtcclxuY29uZmlnLk1BWF9MRVZFTCA9IDMwO1xyXG5cclxuY29uZmlnLk1BWF9IRUFMVEhfQkFTRSA9IDIwMDtcclxuY29uZmlnLk1BWF9IRUFMVEhfQk9OVVMgPSA1NTtcclxuY29uZmlnLk1BWF9FTkVSR1lfQkFTRSA9IDIwMDtcclxuY29uZmlnLk1BWF9FTkVSR1lfQk9OVVMgPSA1NTtcclxuXHJcbmNvbmZpZy5JTlZFTlRPUllfU0laRSA9IDIwO1xyXG5jb25maWcuRVFVSVBNRU5UX1NJWkUgPSA1O1xyXG5cclxuY29uZmlnLklURU1fVFlQRVMgPSBbXHJcbiAge25hbWU6IFwiTm9ybWFsXCIsIGVxdWlwcGVkU2xvdDogbnVsbCwgc3RhY2thYmxlOiBmYWxzZX0sXHJcbiAge25hbWU6IFwiU3RhY2tpbmdcIiwgZXF1aXBwZWRTbG90OiBudWxsLCBzdGFja2FibGU6IHRydWV9LFxyXG4gIHtuYW1lOiBcIldlYXBvblwiLCBlcXVpcHBlZFNsb3Q6IDAsIHN0YWNrYWJsZTogZmFsc2V9LFxyXG4gIHtuYW1lOiBcIlNoaWVsZFwiLCBlcXVpcHBlZFNsb3Q6IDEsIHN0YWNrYWJsZTogZmFsc2V9LFxyXG4gIHtuYW1lOiBcIkFybW91clwiLCBlcXVpcHBlZFNsb3Q6IDIsIHN0YWNrYWJsZTogZmFsc2V9LFxyXG4gIHtuYW1lOiBcIkhlbG1ldFwiLCBlcXVpcHBlZFNsb3Q6IDMsIHN0YWNrYWJsZTogZmFsc2V9LFxyXG4gIHtuYW1lOiBcIlJpbmdcIiwgZXF1aXBwZWRTbG90OiA0LCBzdGFja2FibGU6IGZhbHNlfVxyXG5dO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY29uZmlnO1xyXG4iLCJpbXBvcnQgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xyXG5pbXBvcnQgYmNyeXB0IGZyb20gJ2JjcnlwdCc7XHJcbmltcG9ydCBmcyBmcm9tICdmcyc7XHJcblxyXG5pbXBvcnQgdXRpbCBmcm9tIFwiLi91dGlsLmpzXCI7XHJcbmltcG9ydCBBY2NvdW50IGZyb20gJy4vbW9kZWxzL2FjY291bnQuanMnO1xyXG5pbXBvcnQgUGxheWVyIGZyb20gJy4vbW9kZWxzL3BsYXllci5qcyc7XHJcbmltcG9ydCBQbGF5ZXJUZW1wbGF0ZSBmcm9tICcuL21vZGVscy9wbGF5ZXJUZW1wbGF0ZS5qcyc7XHJcbmltcG9ydCBCb3QgZnJvbSAnLi9tb2RlbHMvYm90LmpzJztcclxuaW1wb3J0IEJvdFRlbXBsYXRlIGZyb20gJy4vbW9kZWxzL2JvdFRlbXBsYXRlLmpzJztcclxuaW1wb3J0IEl0ZW0gZnJvbSAnLi9tb2RlbHMvaXRlbS5qcyc7XHJcbmltcG9ydCBJdGVtVGVtcGxhdGUgZnJvbSAnLi9tb2RlbHMvaXRlbVRlbXBsYXRlLmpzJztcclxuaW1wb3J0IE1hcCBmcm9tICcuL21vZGVscy9tYXAuanMnO1xyXG5cclxuY29uc3QgZnNwID0gZnMucHJvbWlzZXM7XHJcbm1vbmdvb3NlLlByb21pc2UgPSBQcm9taXNlO1xyXG5tb25nb29zZS5jb25uZWN0KCdtb25nb2RiOi8vbG9jYWxob3N0L29keXNzZXknLCB7dXNlTmV3VXJsUGFyc2VyOiB0cnVlfSk7XHJcblxyXG5jbGFzcyBEYXRhYmFzZSB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHR0aGlzLnNlcnZlckxvZyA9IFtdO1xyXG5cdH1cclxuXHJcblx0YmFja3VwKGRhdGEgPSB7fSkge1xyXG5cdFx0Ly9UT0RPIHNhdmUgZXZlcnl0aGluZ1xyXG5cdFx0Ly8gY29uc3QgbWFwcyA9IHNhdmUtYWxsLW1hcHNcclxuXHRcdGxldCBwbGF5ZXJzID0gdGhpcy5zYXZlT25saW5lUGxheWVycyhkYXRhLnBsYXllcnMpO1xyXG5cdFx0bGV0IGJvdHMgPSB0aGlzLnNhdmVBbGxCb3RzKGRhdGEuYm90cyk7XHJcblx0XHRsZXQgaXRlbXMgPSB0aGlzLnNhdmVBbGxJdGVtcyhkYXRhLml0ZW1zKTtcclxuXHRcdGxldCBsb2dTYXZlZCA9IHRoaXMuc2F2ZUxvZygpO1xyXG5cdFx0UHJvbWlzZS5hbGwoW3BsYXllcnMsIGJvdHMsIGl0ZW1zLCBsb2dTYXZlZF0pXHJcblx0XHQudGhlbigoKSA9PiB0aGlzLmxvZyhcIkdhbWUgc2F2ZWQgdG8gZGlzay5cIikpO1xyXG5cdH1cclxuXHRcclxuXHRsb2cobWVzc2FnZSkge1xyXG5cdFx0Y29uc3QgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcblx0XHRjb25zb2xlLmxvZyh1dGlsLnRpbWVzdGFtcChkYXRlKSArIFwiIC0gXCIgKyBtZXNzYWdlKTtcclxuXHRcdHRoaXMuc2VydmVyTG9nLnB1c2goe1xyXG5cdFx0XHRtZXNzYWdlLFxyXG5cdFx0XHRkYXRlXHJcblx0XHR9KTtcclxuXHR9XHJcblx0YXN5bmMgc2F2ZUxvZygpIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGNvbnN0IHNhdmVkTG9nID0gYXdhaXQgZnNwLnJlYWRGaWxlKCcuL3NlcnZlci9sb2cuanNvbicpO1xyXG5cdFx0XHRjb25zdCBuZXdMb2cgPSBKU09OLnBhcnNlKHNhdmVkTG9nKS5jb25jYXQodGhpcy5zZXJ2ZXJMb2cpO1xyXG5cdFx0XHR0aGlzLnNlcnZlckxvZyA9IFtdO1xyXG5cdFx0XHRhd2FpdCBmc3Aud3JpdGVGaWxlKCcuL3NlcnZlci9sb2cuanNvbicsIEpTT04uc3RyaW5naWZ5KG5ld0xvZykpO1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGNhdGNoKGVycikge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0fVxyXG5cdGFzeW5jIGNsZWFyTG9nKCkge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0dGhpcy5zZXJ2ZXJMb2cgPSBbXTtcclxuXHRcdFx0YXdhaXQgZnNwLndyaXRlRmlsZSgnLi9zZXJ2ZXIvbG9nLmpzb24nLCBcIltdXCIpO1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGNhdGNoIChlcnIpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Z2VuZXJhdGVJZCgpIHtcclxuXHRcdHJldHVybiBuZXcgbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQ7XHJcblx0fVxyXG5cdGhhc2hQYXNzd29yZChwYXNzd29yZCkge1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0YmNyeXB0Lmhhc2gocGFzc3dvcmQsIDEwLCAoZXJyLCBoYXNoKSA9PiB7XHJcblx0XHRcdFx0aWYgKGVycikgcmVqZWN0KGVycik7XHJcblx0XHRcdFx0ZWxzZSByZXNvbHZlKGhhc2gpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRjb21wYXJlUGFzc3dvcmQocGFzc3dvcmQsIGhhc2hlZFBhc3N3b3JkKSB7XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHRiY3J5cHQuY29tcGFyZShwYXNzd29yZCwgaGFzaGVkUGFzc3dvcmQsIChlcnIsIG1hdGNoKSA9PiB7XHJcblx0XHRcdFx0aWYgKGVycikgcmVqZWN0KGVycik7XHJcblx0XHRcdFx0ZWxzZSByZXNvbHZlKG1hdGNoKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0YXN5bmMgYXV0aEFjY291bnQodXNlcm5hbWUsIHBhc3N3b3JkKSB7XHJcblx0XHRsZXQgYWNjb3VudCA9IGF3YWl0IEFjY291bnQuZmluZE9uZSh7dXNlcm5hbWVMb3dlckNhc2U6IHVzZXJuYW1lLnRvTG93ZXJDYXNlKCl9KS5leGVjKCk7XHJcblx0XHRpZiAoIWFjY291bnQpIHJldHVybiBmYWxzZTtcclxuXHRcdGxldCBtYXRjaCA9IGF3YWl0IHRoaXMuY29tcGFyZVBhc3N3b3JkKHBhc3N3b3JkLCBhY2NvdW50LnBhc3N3b3JkKTtcclxuXHRcdHJldHVybiBtYXRjaDtcclxuXHR9XHJcblxyXG5cdGFzeW5jIGFkZEFjY291bnQodXNlcm5hbWUsIHBhc3N3b3JkLCBlbWFpbCkge1xyXG5cdFx0bGV0IGFkbWluID0gZmFsc2U7XHJcblx0XHRsZXQgYWNjb3VudHMgPSBhd2FpdCB0aGlzLmdldEFsbEFjY291bnRzKCk7XHJcblx0XHRpZiAoYWNjb3VudHMubGVuZ3RoID09PSAwKSB7XHJcblx0XHRcdGFkbWluID0gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRsZXQgZXhpc3RpbmdBY2NvdW50ID0gYWNjb3VudHMuZmluZChhY2NvdW50ID0+IGFjY291bnQudXNlcm5hbWUudG9Mb3dlckNhc2UoKSA9PT0gdXNlcm5hbWUudG9Mb3dlckNhc2UoKSk7XHJcblx0XHRcdGlmIChleGlzdGluZ0FjY291bnQpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhgQWNjb3VudCBhbHJlYWR5IGV4aXN0cyB3aXRoIHVzZXJuYW1lICR7dXNlcm5hbWV9LmApO1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBoYXNoZWRQYXNzd29yZCA9IGF3YWl0IHRoaXMuaGFzaFBhc3N3b3JkKHBhc3N3b3JkKTtcclxuXHRcdGNvbnN0IGFjY291bnQgPSBuZXcgQWNjb3VudCh7XHJcblx0XHRcdF9pZDogbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkLFxyXG5cdFx0XHR1c2VybmFtZSxcclxuXHRcdFx0dXNlcm5hbWVMb3dlckNhc2U6IHVzZXJuYW1lLnRvTG93ZXJDYXNlKCksXHJcblx0XHRcdHBhc3N3b3JkOiBoYXNoZWRQYXNzd29yZCxcclxuXHRcdFx0ZW1haWwsXHJcblx0XHRcdHZlcmlmaWVkOiBmYWxzZSxcclxuXHRcdFx0YWRtaW5cclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBhd2FpdCBhY2NvdW50LnNhdmUoKVxyXG5cdFx0LnRoZW4ocmVzdWx0ID0+IGFjY291bnQuX2lkKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0Z2V0QWNjb3VudChhY2NvdW50SWQpIHtcclxuXHRcdHJldHVybiBBY2NvdW50LmZpbmRCeUlkKGFjY291bnRJZClcclxuXHRcdC5zZWxlY3QoJ19pZCB1c2VybmFtZSBwYXNzd29yZCBlbWFpbCB2ZXJpZmllZCBhZG1pbicpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbihhY2NvdW50ID0+IGFjY291bnQpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRnZXRBY2NvdW50QnlVc2VybmFtZSh1c2VybmFtZSkge1xyXG5cdFx0cmV0dXJuIEFjY291bnQuZmluZE9uZSh7dXNlcm5hbWVMb3dlckNhc2U6IHVzZXJuYW1lLnRvTG93ZXJDYXNlKCl9KVxyXG5cdFx0LnNlbGVjdCgnX2lkIHVzZXJuYW1lIHBhc3N3b3JkIGVtYWlsIHZlcmlmaWVkIGFkbWluJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKGFjY291bnQgPT4gYWNjb3VudClcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGdldEFsbEFjY291bnRzKCkge1xyXG5cdFx0cmV0dXJuIEFjY291bnQuZmluZCh7fSlcclxuXHRcdC5zZWxlY3QoJ19pZCB1c2VybmFtZSBwYXNzd29yZCBlbWFpbCB2ZXJpZmllZCBhZG1pbicpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbihhY2NvdW50cyA9PiBhY2NvdW50cylcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdHNhdmVBY2NvdW50KGRhdGEpIHtcclxuXHRcdHJldHVybiBBY2NvdW50LnVwZGF0ZU9uZSh7dXNlcm5hbWU6IGRhdGEudXNlcm5hbWV9LCB7JHNldDogZGF0YX0pXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbihyZXN1bHQgPT4gdHJ1ZSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cclxuXHRhc3luYyBhZGRQbGF5ZXIoYWNjb3VudElkLCBuYW1lLCB0ZW1wbGF0ZUlkKSB7XHJcblx0XHRsZXQgYWNjb3VudCA9IGF3YWl0IHRoaXMuZ2V0QWNjb3VudChhY2NvdW50SWQpO1xyXG5cdFx0aWYgKCFhY2NvdW50KSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiQWNjb3VudCBkb2VzIG5vdCBleGlzdCB3aXRoIHRoYXQgaWQuXCIpO1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHRcdGxldCB0ZW1wbGF0ZSA9IGF3YWl0IHRoaXMuZ2V0UGxheWVyVGVtcGxhdGUodGVtcGxhdGVJZCk7XHJcblx0XHRpZiAoIXRlbXBsYXRlKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiUGxheWVyIFRlbXBsYXRlIGRvZXMgbm90IGV4aXN0IHdpdGggdGhhdCBpZC5cIik7XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fVxyXG5cdFx0bGV0IHBsYXllciA9IGF3YWl0IHRoaXMuZ2V0UGxheWVyQnlOYW1lKG5hbWUpO1xyXG5cdFx0aWYgKHBsYXllcikge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIlBsYXllciBhbHJlYWR5IGV4aXN0cyB3aXRoIHRoYXQgbmFtZS5cIik7XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fVxyXG5cclxuXHRcdHBsYXllciA9IG5ldyBQbGF5ZXIoe1xyXG5cdFx0XHRfaWQgOiBuZXcgbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQsXHJcblx0XHRcdG5hbWUsXHJcblx0XHRcdG5hbWVMb3dlckNhc2U6IG5hbWUudG9Mb3dlckNhc2UoKSxcclxuXHRcdFx0YWNjb3VudDogYWNjb3VudElkLFxyXG5cdFx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVJZFxyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIHBsYXllci5zYXZlKClcclxuXHRcdC50aGVuKHJlc3VsdCA9PiBwbGF5ZXIuX2lkKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0Z2V0UGxheWVyKHBsYXllcklkKSB7XHJcblx0XHRyZXR1cm4gUGxheWVyLmZpbmRCeUlkKHBsYXllcklkKVxyXG5cdFx0LnNlbGVjdCgnX2lkIGFjY291bnQgbmFtZSB0ZW1wbGF0ZSBsZXZlbCBleHBlcmllbmNlIG1hcElkIHggeSBkaXJlY3Rpb24gYWRtaW5BY2Nlc3Mgc3ByaXRlJylcclxuXHRcdC5wb3B1bGF0ZSgndGVtcGxhdGUnKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4ocGxheWVyID0+IHBsYXllcilcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGdldFBsYXllckJ5TmFtZShuYW1lKSB7XHJcblx0XHRyZXR1cm4gUGxheWVyLmZpbmRPbmUoe25hbWVMb3dlckNhc2U6IG5hbWUudG9Mb3dlckNhc2UoKX0pXHJcblx0XHQuc2VsZWN0KCdfaWQgYWNjb3VudCBuYW1lIHRlbXBsYXRlIGxldmVsIGV4cGVyaWVuY2UgbWFwSWQgeCB5IGRpcmVjdGlvbiBhZG1pbkFjY2VzcyBzcHJpdGUnKVxyXG5cdFx0LnBvcHVsYXRlKCd0ZW1wbGF0ZScpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbihwbGF5ZXIgPT4gcGxheWVyKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0Z2V0UGxheWVyc0J5QWNjb3VudChhY2NvdW50SWQpIHtcclxuXHRcdHJldHVybiBQbGF5ZXIuZmluZCh7YWNjb3VudDogYWNjb3VudElkfSlcclxuXHRcdC5zZWxlY3QoJ19pZCBhY2NvdW50IG5hbWUgdGVtcGxhdGUgbGV2ZWwgZXhwZXJpZW5jZSBtYXBJZCB4IHkgZGlyZWN0aW9uIGFkbWluQWNjZXNzIHNwcml0ZScpXHJcblx0XHQucG9wdWxhdGUoJ3RlbXBsYXRlJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHBsYXllcnMgPT4gcGxheWVycylcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdHNhdmVQbGF5ZXIoZGF0YSkge1xyXG5cdFx0cmV0dXJuIFBsYXllci51cGRhdGVPbmUoe25hbWU6IGRhdGEubmFtZX0sIHskc2V0OiBkYXRhfSlcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHJlc3VsdCA9PiB0cnVlKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0c2F2ZU9ubGluZVBsYXllcnMocGxheWVycyA9IFtdKSB7XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHBsYXllcnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRjb25zdCBwbGF5ZXIgPSBwbGF5ZXJzW2ldO1xyXG5cdFx0XHRcdGlmICghcGxheWVyKSBjb250aW51ZTtcclxuXHRcdFx0XHR0aGlzLnNhdmVQbGF5ZXIocGxheWVyKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXNvbHZlKHRydWUpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRhc3luYyBhZGRCb3QoZGF0YSkge1xyXG5cdFx0bGV0IHRlbXBsYXRlID0gYXdhaXQgdGhpcy5nZXRCb3RUZW1wbGF0ZShkYXRhLnRlbXBsYXRlSWQpO1xyXG5cdFx0aWYgKCF0ZW1wbGF0ZSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIkJvdCBUZW1wbGF0ZSBkb2VzIG5vdCBleGlzdCB3aXRoIHRoYXQgaWQuXCIpO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IF9pZCA9IGRhdGEuYm90SWQ7XHJcblx0XHRpZiAoIV9pZCkgX2lkID0gbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkO1xyXG5cclxuXHRcdGNvbnN0IGJvdCA9IG5ldyBCb3Qoe1xyXG5cdFx0XHRfaWQsXHJcblx0XHRcdHRlbXBsYXRlOiBkYXRhLnRlbXBsYXRlSWQsXHJcblx0XHRcdG1hcElkOiBkYXRhLm1hcElkLFxyXG5cdFx0XHR4OiBkYXRhLngsXHJcblx0XHRcdHk6IGRhdGEueSxcclxuXHRcdFx0ZGlyZWN0aW9uOiBkYXRhLmRpcmVjdGlvblxyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIGJvdC5zYXZlKClcclxuXHRcdC50aGVuKHJlc3VsdCA9PiB0cnVlKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0Z2V0Qm90KGJvdElkKSB7XHJcblx0XHRyZXR1cm4gQm90LmZpbmRPbmUoe19pZDogYm90SWR9KVxyXG5cdFx0LnNlbGVjdCgnX2lkIHRlbXBsYXRlIG1hcElkIHggeSBkaXJlY3Rpb24nKVxyXG5cdFx0LnBvcHVsYXRlKCd0ZW1wbGF0ZScpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbihib3QgPT4gYm90KVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0c2F2ZUJvdChkYXRhKSB7XHJcblx0XHRyZXR1cm4gQm90LnVwZGF0ZU9uZSh7X2lkOiBkYXRhLmJvdElkfSwgeyRzZXQ6IGRhdGF9KVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4ocmVzdWx0ID0+IHRydWUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRnZXRBbGxCb3RzKCkge1xyXG5cdFx0cmV0dXJuIEJvdC5maW5kKHt9KVxyXG5cdFx0LnNlbGVjdCgnX2lkIHRlbXBsYXRlIG1hcElkIHggeSBkaXJlY3Rpb24nKVxyXG5cdFx0LnBvcHVsYXRlKCd0ZW1wbGF0ZScpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbihib3RzID0+IGJvdHMpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBzYXZlQWxsQm90cyhjdXJyZW50Qm90cykge1xyXG5cdFx0aWYgKCFjdXJyZW50Qm90cykgcmV0dXJuO1xyXG5cclxuXHRcdGxldCBzYXZlZEJvdHMgPSBhd2FpdCB0aGlzLmdldEFsbEJvdHMoKTtcclxuXHRcdGNvbnN0IG5ld0JvdHMgPSBjdXJyZW50Qm90cy5maWx0ZXIoYm90ID0+ICFzYXZlZEJvdHMuZmluZChzYXZlZEJvdCA9PiBzYXZlZEJvdC5faWQgPT09IGJvdC5ib3RJZCkpO1xyXG5cdFx0Y29uc3QgZXhpc3RpbmdCb3RzID0gY3VycmVudEJvdHMuZmlsdGVyKGJvdCA9PiBzYXZlZEJvdHMuZmluZChzYXZlZEJvdCA9PiBzYXZlZEJvdC5faWQgPT09IGJvdC5ib3RJZCkpO1xyXG5cdFx0Y29uc3QgZGVsZXRlQm90cyA9IHNhdmVkQm90cy5maWx0ZXIoYm90ID0+ICFleGlzdGluZ0JvdHMuZmluZChleGlzdGluZ0JvdCA9PiBleGlzdGluZ0JvdC5ib3RJZCA9PT0gYm90Ll9pZCkpO1xyXG5cdFx0Y29uc3QgdXBkYXRlQm90cyA9IGV4aXN0aW5nQm90cy5maWx0ZXIoYm90ID0+ICFkZWxldGVCb3RzLmluY2x1ZGVzKGJvdCkpO1xyXG5cclxuXHRcdC8vIEFkZCBuZXcgQm90c1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBuZXdCb3RzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHRoaXMuYWRkQm90KG5ld0JvdHNbaV0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIERlbGV0ZSByZW1vdmVkIEJvdHNcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgZGVsZXRlQm90cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRCb3QuZGVsZXRlT25lKHtfaWQ6IGRlbGV0ZUJvdHNbaV0uX2lkfSwgZXJyID0+IHtcclxuXHRcdFx0XHRpZiAoZXJyKSBjb25zb2xlLmxvZyhlcnIpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBVcGRhdGUgdGhlIHJlc3RcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdXBkYXRlQm90cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRjb25zdCBib3QgPSB1cGRhdGVCb3RzW2ldO1xyXG5cdFx0XHRpZiAoIWJvdCkgY29udGludWU7XHJcblx0XHRcdHRoaXMuc2F2ZUJvdChib3QpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Z2V0TWFwKG1hcElkKSB7XHJcblx0XHRyZXR1cm4gTWFwLmZpbmRPbmUoe21hcElkOiBtYXBJZH0pXHJcblx0XHQuc2VsZWN0KCdtYXBJZCBuYW1lIGRyb3BDaGFuY2UgZHJvcEFtb3VudEVRIHRpbGVzIGlzV2FsbCBpc0hvc3RpbGUgZGFtYWdlIHdhcnBNYXAgd2FycFggd2FycFknKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4obWFwID0+IG1hcClcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdHNhdmVNYXAoZGF0YSkge1xyXG5cdFx0cmV0dXJuIE1hcC51cGRhdGVPbmUoe21hcElkOiBkYXRhLm1hcElkfSwgeyRzZXQ6IGRhdGF9LCB7dXBzZXJ0OiB0cnVlfSlcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHJlc3VsdCA9PiB0cnVlKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0Z2V0QWxsTWFwcygpIHtcclxuXHRcdHJldHVybiBNYXAuZmluZCh7fSlcclxuXHRcdC5zZWxlY3QoJ21hcElkIG5hbWUgZHJvcENoYW5jZSBkcm9wQW1vdW50RVEgdGlsZXMgaXNXYWxsIGlzSG9zdGlsZSBkYW1hZ2Ugd2FycE1hcCB3YXJwWCB3YXJwWScpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbihtYXBzID0+IG1hcHMpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHJcblx0YXN5bmMgYWRkUGxheWVyVGVtcGxhdGUoZGF0YSkge1xyXG5cdFx0aWYgKCFkYXRhLm5hbWUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJOYW1lIGlzIHJlcXVpcmVkLlwiKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBjaGVja1RlbXBsYXRlID0gYXdhaXQgUGxheWVyVGVtcGxhdGUuZmluZE9uZSh7bmFtZTogZGF0YS5uYW1lfSlcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHRlbXBsYXRlID0+IHRlbXBsYXRlKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHJcblx0XHRpZiAoY2hlY2tUZW1wbGF0ZSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIlRlbXBsYXRlIGFscmVhZHkgZXhpc3RzIHdpdGggdGhhdCBuYW1lLlwiKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHRlbXBsYXRlID0gbmV3IFBsYXllclRlbXBsYXRlKHtcclxuXHRcdFx0X2lkOiBuZXcgbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQsXHJcblx0XHRcdG5hbWU6IGRhdGEubmFtZSxcclxuXHRcdFx0c3ByaXRlOiBkYXRhLnNwcml0ZSxcclxuXHRcdFx0ZGFtYWdlQmFzZTogZGF0YS5kYW1hZ2VCYXNlLFxyXG5cdFx0XHRkZWZlbmNlQmFzZTogZGF0YS5kZWZlbmNlQmFzZSxcclxuXHRcdFx0aGVhbHRoTWF4QmFzZTogZGF0YS5oZWFsdGhNYXhCYXNlLFxyXG5cdFx0XHRlbmVyZ3lNYXhCYXNlOiBkYXRhLmVuZXJneU1heEJhc2UsXHJcblx0XHRcdGhlYWx0aFJlZ2VuQmFzZTogZGF0YS5oZWFsdGhSZWdlbkJhc2UsXHJcblx0XHRcdGVuZXJneVJlZ2VuQmFzZTogZGF0YS5lbmVyZ3lSZWdlbkJhc2UsXHJcblx0XHRcdHJhbmdlQmFzZTogZGF0YS5yYW5nZUJhc2UsXHJcblx0XHRcdGhlYWx0aFBlckxldmVsOiBkYXRhLmhlYWx0aFBlckxldmVsLFxyXG5cdFx0XHRlbmVyZ3lQZXJMZXZlbDogZGF0YS5lbmVyZ3lQZXJMZXZlbFxyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIHRlbXBsYXRlLnNhdmUoKVxyXG5cdFx0LnRoZW4ocmVzdWx0ID0+IHRydWUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRnZXRQbGF5ZXJUZW1wbGF0ZSh0ZW1wbGF0ZUlkKSB7XHJcblx0XHRyZXR1cm4gUGxheWVyVGVtcGxhdGUuZmluZEJ5SWQodGVtcGxhdGVJZClcclxuXHRcdC5zZWxlY3QoJ25hbWUgc3ByaXRlIGRhbWFnZUJhc2UgZGVmZW5jZUJhc2UgaGVhbHRoTWF4QmFzZSBlbmVyZ3lNYXhCYXNlIGhlYWx0aFJlZ2VuQmFzZSBlbmVyZ3lSZWdlbkJhc2UgcmFuZ2VCYXNlIGhlYWx0aFBlckxldmVsLCBlbmVyZ3lQZXJMZXZlbCcpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbih0ZW1wbGF0ZSA9PiB0ZW1wbGF0ZSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGdldEFsbFBsYXllclRlbXBsYXRlcygpIHtcclxuXHRcdHJldHVybiBQbGF5ZXJUZW1wbGF0ZS5maW5kKHt9KVxyXG5cdFx0LnNlbGVjdCgnX2lkIG5hbWUgc3ByaXRlIGRhbWFnZUJhc2UgZGVmZW5jZUJhc2UgaGVhbHRoTWF4QmFzZSBlbmVyZ3lNYXhCYXNlIGhlYWx0aFJlZ2VuQmFzZSBlbmVyZ3lSZWdlbkJhc2UgcmFuZ2VCYXNlIGhlYWx0aFBlckxldmVsLCBlbmVyZ3lQZXJMZXZlbCcpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbih0ZW1wbGF0ZXMgPT4gdGVtcGxhdGVzKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblxyXG5cdGFkZEJvdFRlbXBsYXRlKGRhdGEpIHtcclxuXHRcdGNvbnN0IHRlbXBsYXRlID0gbmV3IEJvdFRlbXBsYXRlKHtcclxuXHRcdFx0X2lkOiBuZXcgbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQsXHJcblx0XHRcdG5hbWU6IGRhdGEubmFtZSxcclxuXHRcdFx0c3ByaXRlOiBkYXRhLnNwcml0ZSxcclxuXHRcdFx0ZGFtYWdlQmFzZTogZGF0YS5kYW1hZ2VCYXNlLFxyXG5cdFx0XHRkZWZlbmNlQmFzZTogZGF0YS5kZWZlbmNlQmFzZSxcclxuXHRcdFx0aGVhbHRoTWF4QmFzZTogZGF0YS5oZWFsdGhNYXhCYXNlLFxyXG5cdFx0XHRlbmVyZ3lNYXhCYXNlOiBkYXRhLmVuZXJneU1heEJhc2UsXHJcblx0XHRcdGhlYWx0aFJlZ2VuQmFzZTogZGF0YS5oZWFsdGhSZWdlbkJhc2UsXHJcblx0XHRcdGVuZXJneVJlZ2VuQmFzZTogZGF0YS5lbmVyZ3lSZWdlbkJhc2UsXHJcblx0XHRcdHJhbmdlQmFzZTogZGF0YS5yYW5nZUJhc2UsXHJcblx0XHRcdGhvc3RpbGU6IGRhdGEuaG9zdGlsZVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIHRlbXBsYXRlLnNhdmUoKVxyXG5cdFx0LnRoZW4ocmVzdWx0ID0+IHRydWUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRnZXRCb3RUZW1wbGF0ZSh0ZW1wbGF0ZUlkKSB7XHJcblx0XHRyZXR1cm4gQm90VGVtcGxhdGUuZmluZEJ5SWQodGVtcGxhdGVJZClcclxuXHRcdC5zZWxlY3QoJ19pZCBuYW1lIHNwcml0ZSBkYW1hZ2VCYXNlIGRlZmVuY2VCYXNlIGhlYWx0aE1heEJhc2UgZW5lcmd5TWF4QmFzZSBoZWFsdGhSZWdlbkJhc2UgZW5lcmd5UmVnZW5CYXNlIHJhbmdlQmFzZSBob3N0aWxlJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHRlbXBsYXRlID0+IHRlbXBsYXRlKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0Z2V0QWxsQm90VGVtcGxhdGVzKCkge1xyXG5cdFx0cmV0dXJuIEJvdFRlbXBsYXRlLmZpbmQoe30pXHJcblx0XHQuc2VsZWN0KCdfaWQgbmFtZSBzcHJpdGUgZGFtYWdlQmFzZSBkZWZlbmNlQmFzZSBoZWFsdGhNYXhCYXNlIGVuZXJneU1heEJhc2UgaGVhbHRoUmVnZW5CYXNlIGVuZXJneVJlZ2VuQmFzZSByYW5nZUJhc2UgaG9zdGlsZScpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbih0ZW1wbGF0ZXMgPT4gdGVtcGxhdGVzKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblxyXG5cdGFkZEl0ZW1UZW1wbGF0ZShkYXRhKSB7XHJcblx0XHRjb25zdCB0ZW1wbGF0ZSA9IG5ldyBJdGVtVGVtcGxhdGUoe1xyXG5cdFx0XHRfaWQ6IG5ldyBtb25nb29zZS5UeXBlcy5PYmplY3RJZCxcclxuXHRcdFx0bmFtZTogZGF0YS5uYW1lLFxyXG5cdFx0XHRzcHJpdGU6IGRhdGEuc3ByaXRlLFxyXG5cdFx0XHRyZXVzYWJsZTogZGF0YS5yZXVzYWJsZSxcclxuXHRcdFx0aXRlbVR5cGU6IGRhdGEuaXRlbVR5cGVJZCxcclxuXHRcdFx0cGFzc2l2ZURhbWFnZTogZGF0YS5wYXNzaXZlRGFtYWdlLFxyXG5cdFx0XHRwYXNzaXZlRGVmZW5jZTogZGF0YS5wYXNzaXZlRGVmZW5jZSxcclxuXHRcdFx0cGFzc2l2ZUhlYWx0aE1heDogZGF0YS5wYXNzaXZlSGVhbHRoTWF4LFxyXG5cdFx0XHRwYXNzaXZlRW5lcmd5TWF4OiBkYXRhLnBhc3NpdmVFbmVyZ3lNYXgsXHJcblx0XHRcdHBhc3NpdmVIZWFsdGhSZWdlbjogZGF0YS5wYXNzaXZlSGVhbHRoUmVnZW4sXHJcblx0XHRcdHBhc3NpdmVFbmVyZ3lSZWdlbjogZGF0YS5wYXNzaXZlRW5lcmd5UmVnZW4sXHJcblx0XHRcdHBhc3NpdmVSYW5nZTogZGF0YS5wYXNzaXZlUmFuZ2UsXHJcblx0XHRcdGVxdWlwcGVkRGFtYWdlOiBkYXRhLmVxdWlwcGVkRGFtYWdlLFxyXG5cdFx0XHRlcXVpcHBlZERlZmVuY2U6IGRhdGEuZXF1aXBwZWREZWZlbmNlLFxyXG5cdFx0XHRlcXVpcHBlZEhlYWx0aE1heDogZGF0YS5lcXVpcHBlZEhlYWx0aE1heCxcclxuXHRcdFx0ZXF1aXBwZWRFbmVyZ3lNYXg6IGRhdGEuZXF1aXBwZWRFbmVyZ3lNYXgsXHJcblx0XHRcdGVxdWlwcGVkSGVhbHRoUmVnZW46IGRhdGEuZXF1aXBwZWRIZWFsdGhSZWdlbixcclxuXHRcdFx0ZXF1aXBwZWRFbmVyZ3lSZWdlbjogZGF0YS5lcXVpcHBlZEVuZXJneVJlZ2VuLFxyXG5cdFx0XHRlcXVpcHBlZFJhbmdlOiBkYXRhLmVxdWlwcGVkUmFuZ2VcclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiB0ZW1wbGF0ZS5zYXZlKClcclxuXHRcdC50aGVuKHJlc3VsdCA9PiB0cnVlKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0Z2V0SXRlbVRlbXBsYXRlKHRlbXBsYXRlSWQpIHtcclxuXHRcdHJldHVybiBJdGVtVGVtcGxhdGUuZmluZEJ5SWQodGVtcGxhdGVJZClcclxuXHRcdC5zZWxlY3QoJ25hbWUgc3ByaXRlIHJldXNhYmxlIGl0ZW1UeXBlIHBhc3NpdmVEYW1hZ2UgcGFzc2l2ZURlZmVuY2UgcGFzc2l2ZUhlYWx0aE1heCBwYXNzaXZlRW5lcmd5TWF4QmFzZSBwYXNzaXZlSGVhbHRoUmVnZW4gcGFzc2l2ZUVuZXJneVJlZ2VuIHBhc3NpdmVSYW5nZSBlcXVpcHBlZERhbWFnZSBlcXVpcHBlZERlZmVuY2UgZXF1aXBwZWRIZWFsdGhNYXggZXF1aXBwZWRFbmVyZ3lNYXhCYXNlIGVxdWlwcGVkSGVhbHRoUmVnZW4gZXF1aXBwZWRFbmVyZ3lSZWdlbiBlcXVpcHBlZFJhbmdlJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHRlbXBsYXRlID0+IHRlbXBsYXRlKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0Z2V0QWxsSXRlbVRlbXBsYXRlcygpIHtcclxuXHRcdHJldHVybiBJdGVtVGVtcGxhdGUuZmluZCh7fSlcclxuXHRcdC5zZWxlY3QoJ19pZCBuYW1lIHNwcml0ZSByZXVzYWJsZSBpdGVtVHlwZSBwYXNzaXZlRGFtYWdlIHBhc3NpdmVEZWZlbmNlIHBhc3NpdmVIZWFsdGhNYXggcGFzc2l2ZUVuZXJneU1heEJhc2UgcGFzc2l2ZUhlYWx0aFJlZ2VuIHBhc3NpdmVFbmVyZ3lSZWdlbiBwYXNzaXZlUmFuZ2UgZXF1aXBwZWREYW1hZ2UgZXF1aXBwZWREZWZlbmNlIGVxdWlwcGVkSGVhbHRoTWF4IGVxdWlwcGVkRW5lcmd5TWF4QmFzZSBlcXVpcHBlZEhlYWx0aFJlZ2VuIGVxdWlwcGVkRW5lcmd5UmVnZW4gZXF1aXBwZWRSYW5nZScpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbih0ZW1wbGF0ZXMgPT4gdGVtcGxhdGVzKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblxyXG5cdGFzeW5jIGFkZEl0ZW0oZGF0YSkge1xyXG5cdFx0bGV0IHRlbXBsYXRlID0gYXdhaXQgdGhpcy5nZXRJdGVtVGVtcGxhdGUoZGF0YS50ZW1wbGF0ZUlkKTtcclxuXHRcdGlmICghdGVtcGxhdGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJJdGVtIFRlbXBsYXRlIGRvZXMgbm90IGV4aXN0IHdpdGggdGhhdCBpZC5cIik7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHRcdGxldCBfaWQgPSBkYXRhLml0ZW1JZDtcclxuXHRcdGlmICghX2lkKSBfaWQgPSBuZXcgbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQ7XHJcblxyXG5cdFx0Y29uc3QgaXRlbSA9IG5ldyBJdGVtKHtcclxuXHRcdFx0X2lkLFxyXG5cdFx0XHR0ZW1wbGF0ZTogZGF0YS50ZW1wbGF0ZUlkLFxyXG5cdFx0XHRzdGFjazogZGF0YS5zdGFjayxcclxuXHRcdFx0cGxheWVySWQ6IGRhdGEucGxheWVySWQsXHJcblx0XHRcdGJvdElkOiBkYXRhLmJvdElkLFxyXG5cdFx0XHRzbG90OiBkYXRhLnNsb3QsXHJcblx0XHRcdG1hcElkOiBkYXRhLm1hcElkLFxyXG5cdFx0XHR4OiBkYXRhLngsXHJcblx0XHRcdHk6IGRhdGEueSxcclxuXHRcdFx0Y3JlYXRlZEJ5OiBkYXRhLmNyZWF0ZWRCeSxcclxuXHRcdFx0Y3JlYXRlZERhdGU6IGRhdGEuY3JlYXRlZERhdGVcclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBpdGVtLnNhdmUoKVxyXG5cdFx0LnRoZW4ocmVzdWx0ID0+IHRydWUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRzYXZlSXRlbShkYXRhKSB7XHJcblx0XHRyZXR1cm4gSXRlbS51cGRhdGVPbmUoe19pZDogZGF0YS5pdGVtSWR9LCB7JHNldDogZGF0YX0sIHt1cHNlcnQ6IHRydWV9KVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4ocmVzdWx0ID0+IHRydWUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRnZXRBbGxJdGVtcygpIHtcclxuXHRcdHJldHVybiBJdGVtLmZpbmQoe30pXHJcblx0XHQuc2VsZWN0KCdfaWQgdGVtcGxhdGUgc3RhY2sgcGxheWVySWQgYm90SWQgc2xvdCBtYXBJZCB4IHkgY3JlYXRlZERhdGUgY3JlYXRlZEJ5JylcclxuXHRcdC5wb3B1bGF0ZSgndGVtcGxhdGUnKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4oaXRlbXMgPT4gaXRlbXMpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBzYXZlQWxsSXRlbXMoY3VycmVudEl0ZW1zKSB7XHJcblx0XHRpZiAoIWN1cnJlbnRJdGVtcykgcmV0dXJuO1xyXG5cclxuXHRcdGxldCBzYXZlZEl0ZW1zID0gYXdhaXQgdGhpcy5nZXRBbGxJdGVtcygpO1xyXG5cdFx0Y29uc3QgbmV3SXRlbXMgPSBjdXJyZW50SXRlbXMuZmlsdGVyKGl0ZW0gPT4gIXNhdmVkSXRlbXMuZmluZChzYXZlZEl0ZW0gPT4gc2F2ZWRJdGVtLl9pZCA9PT0gaXRlbS5pdGVtSWQpKTtcclxuXHRcdGNvbnN0IGV4aXN0aW5nSXRlbXMgPSBjdXJyZW50SXRlbXMuZmlsdGVyKGl0ZW0gPT4gc2F2ZWRJdGVtcy5maW5kKHNhdmVkSXRlbSA9PiBzYXZlZEl0ZW0uX2lkID09PSBpdGVtLml0ZW1JZCkpO1xyXG5cdFx0Y29uc3QgZGVsZXRlSXRlbXMgPSBzYXZlZEl0ZW1zLmZpbHRlcihpdGVtID0+ICFleGlzdGluZ0l0ZW1zLmZpbmQoZXhpc3RpbmdJdGVtID0+IGV4aXN0aW5nSXRlbS5pdGVtSWQgPT09IGl0ZW0uX2lkKSk7XHJcblx0XHRjb25zdCB1cGRhdGVJdGVtcyA9IGV4aXN0aW5nSXRlbXMuZmlsdGVyKGl0ZW0gPT4gIWRlbGV0ZUl0ZW1zLmluY2x1ZGVzKGl0ZW0pKTtcclxuXHRcdFxyXG5cdFx0Ly8gQWRkIG5ldyBJdGVtc1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBuZXdJdGVtcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR0aGlzLmFkZEl0ZW0obmV3SXRlbXNbaV0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIERlbGV0ZSByZW1vdmVkIEl0ZW1zXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGRlbGV0ZUl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdEl0ZW0uZGVsZXRlT25lKHtfaWQ6IGRlbGV0ZUl0ZW1zW2ldLl9pZH0sIGVyciA9PiB7XHJcblx0XHRcdFx0aWYgKGVycikgY29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gVXBkYXRlIHRoZSByZXN0XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHVwZGF0ZUl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IGl0ZW0gPSB1cGRhdGVJdGVtc1tpXTtcclxuXHRcdFx0aWYgKCFpdGVtKSBjb250aW51ZTtcclxuXHRcdFx0dGhpcy5zYXZlSXRlbShpdGVtKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmNvbnN0IGRiID0gbmV3IERhdGFiYXNlKCk7XHJcbmV4cG9ydCBkZWZhdWx0IGRiO1xyXG4iLCJpbXBvcnQgZGIgZnJvbSAnLi9kYi5qcyc7XHJcbmltcG9ydCBjb25maWcgZnJvbSAnLi9jb25maWcuanMnO1xyXG5cclxuaW1wb3J0IE1hcCBmcm9tICcuL2NsYXNzZXMvbWFwLmpzJztcclxuaW1wb3J0IFBsYXllciBmcm9tICcuL2NsYXNzZXMvcGxheWVyLmpzJztcclxuaW1wb3J0IEJvdCBmcm9tICcuL2NsYXNzZXMvYm90LmpzJztcclxuaW1wb3J0IEl0ZW0gZnJvbSAnLi9jbGFzc2VzL2l0ZW0uanMnO1xyXG5pbXBvcnQgRWZmZWN0IGZyb20gJy4vY2xhc3Nlcy9lZmZlY3QuanMnO1xyXG5pbXBvcnQgVGV4dCBmcm9tICcuL2NsYXNzZXMvdGV4dC5qcyc7XHJcbmltcG9ydCBNZXNzYWdlIGZyb20gJy4vY2xhc3Nlcy9tZXNzYWdlLmpzJztcclxuXHJcbmNsYXNzIEdhbWUge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0dGhpcy5tYXBzID0gW107XHJcblx0XHR0aGlzLnBsYXllcnMgPSBbXTtcclxuXHRcdHRoaXMuYm90cyA9IFtdO1xyXG5cdFx0dGhpcy5pdGVtcyA9IFtdO1xyXG5cdFx0dGhpcy5lZmZlY3RzID0gW107XHJcblx0XHR0aGlzLnRleHRzID0gW107XHJcblx0XHR0aGlzLm1lc3NhZ2VRdWV1ZSA9IFtdO1xyXG5cdFx0XHJcblx0XHR0aGlzLnBsYXllclRlbXBsYXRlcyA9IHt9O1xyXG5cdFx0dGhpcy5ib3RUZW1wbGF0ZXMgPSB7fTtcclxuXHRcdHRoaXMuaXRlbVRlbXBsYXRlcyA9IHt9O1xyXG5cclxuXHRcdHRoaXMubG9hZE1hcHMoKTtcclxuXHRcdHRoaXMubG9hZFBsYXllclRlbXBsYXRlcygpO1xyXG5cdFx0dGhpcy5sb2FkQm90VGVtcGxhdGVzKCk7XHJcblx0XHR0aGlzLmxvYWRJdGVtVGVtcGxhdGVzKCk7XHJcblx0XHR0aGlzLmxvYWRDb21tYW5kcygpO1xyXG5cdFx0dGhpcy5sb2FkSXRlbXMoKTtcclxuXHRcdHRoaXMubG9hZEJvdHMoKTtcclxuXHR9XHJcblxyXG5cdGFzeW5jIGxvYWRNYXBzKCkge1xyXG5cdFx0bGV0IG1hcERhdGEgPSBhd2FpdCBkYi5nZXRBbGxNYXBzKCk7XHJcblx0XHRjb25zdCBvcmRlcmVkTWFwRGF0YSA9IFtdO1xyXG5cclxuXHRcdGZvciAobGV0IGlkID0gMDsgaWQgPCBtYXBEYXRhLmxlbmd0aDsgaWQrKykge1xyXG5cdFx0XHRjb25zdCBkYXRhID0gbWFwRGF0YVtpZF07XHJcblx0XHRcdGlmIChkYXRhKSBvcmRlcmVkTWFwRGF0YVtkYXRhLm1hcElkXSA9IGRhdGE7XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yIChsZXQgaWQgPSAwOyBpZCA8IGNvbmZpZy5NQVhfTUFQUzsgaWQrKykge1xyXG5cdFx0XHRpZiAob3JkZXJlZE1hcERhdGFbaWRdKSB7XHJcblx0XHRcdFx0dGhpcy5tYXBzW2lkXSA9IG5ldyBNYXAoaWQsIG9yZGVyZWRNYXBEYXRhW2lkXSk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5tYXBzW2lkXSA9IG5ldyBNYXAoaWQpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRsb2FkUGxheWVyVGVtcGxhdGVzKCkge1xyXG5cdFx0ZGIuZ2V0QWxsUGxheWVyVGVtcGxhdGVzKClcclxuXHRcdC50aGVuKHRlbXBsYXRlcyA9PiB7XHJcblx0XHRcdHRoaXMucGxheWVyVGVtcGxhdGVzID0ge307XHJcblx0XHRcdHRlbXBsYXRlcy5mb3JFYWNoKHRlbXBsYXRlID0+IHtcclxuXHRcdFx0XHR0aGlzLnBsYXllclRlbXBsYXRlc1t0ZW1wbGF0ZS5faWRdID0gdGVtcGxhdGU7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSkuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHJcblx0bG9hZEJvdFRlbXBsYXRlcygpIHtcclxuXHRcdGRiLmdldEFsbEJvdFRlbXBsYXRlcygpXHJcblx0XHQudGhlbih0ZW1wbGF0ZXMgPT4ge1xyXG5cdFx0XHR0aGlzLmJvdFRlbXBsYXRlcyA9IHt9O1xyXG5cdFx0XHR0ZW1wbGF0ZXMuZm9yRWFjaCh0ZW1wbGF0ZSA9PiB7XHJcblx0XHRcdFx0dGhpcy5ib3RUZW1wbGF0ZXNbdGVtcGxhdGUuX2lkXSA9IHRlbXBsYXRlO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pLmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblxyXG5cdGxvYWRJdGVtVGVtcGxhdGVzKCkge1xyXG5cdFx0ZGIuZ2V0QWxsSXRlbVRlbXBsYXRlcygpXHJcblx0XHQudGhlbih0ZW1wbGF0ZXMgPT4ge1xyXG5cdFx0XHR0aGlzLml0ZW1UZW1wbGF0ZXMgPSB7fTtcclxuXHRcdFx0dGVtcGxhdGVzLmZvckVhY2godGVtcGxhdGUgPT4ge1xyXG5cdFx0XHRcdHRlbXBsYXRlLnR5cGUgPSBjb25maWcuSVRFTV9UWVBFU1t0ZW1wbGF0ZS5pdGVtVHlwZV07XHJcblx0XHRcdFx0dGhpcy5pdGVtVGVtcGxhdGVzW3RlbXBsYXRlLl9pZF0gPSB0ZW1wbGF0ZTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KS5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cclxuXHRsb2FkQ29tbWFuZHMoKSB7XHJcblx0XHR0aGlzLmNvbW1hbmRzID0ge1xyXG5cdFx0XHRtb3ZlOiAoZGF0YSwgcGxheWVyKSA9PiBwbGF5ZXIuaW5wdXQuZGlyZWN0aW9uID0gZGF0YS5kaXJlY3Rpb24sXHJcblx0XHRcdHJ1bjogKGRhdGEsIHBsYXllcikgPT4gcGxheWVyLmlucHV0LnJ1biA9IGRhdGEuc3RhdGUsXHJcblx0XHRcdHBpY2t1cDogKGRhdGEsIHBsYXllcikgPT4ge1xyXG5cdFx0XHRcdGlmICghcGxheWVyLmlucHV0LnBpY2t1cCAmJiBkYXRhLnN0YXRlKSBwbGF5ZXIucGlja1VwKCk7XHJcblx0XHRcdFx0cGxheWVyLmlucHV0LnBpY2t1cCA9IGRhdGEuc3RhdGU7XHJcblx0XHRcdH0sXHJcblx0XHRcdGF0dGFjazogKGRhdGEsIHBsYXllcikgPT4ge1xyXG5cdFx0XHRcdHBsYXllci5pbnB1dC5hdHRhY2sgPSBkYXRhLnN0YXRlO1xyXG5cdFx0XHRcdHBsYXllci5hdHRhY2soMSwgcGxheWVyLmRpcmVjdGlvbik7XHJcblx0XHRcdH0sXHJcblx0XHRcdGRvdWJsZUNsaWNrSXRlbTogKGRhdGEsIHBsYXllcikgPT4gcGxheWVyLnVzZUl0ZW0oZGF0YS5zbG90KSxcclxuXHRcdFx0cmlnaHRDbGlja0l0ZW06IChkYXRhLCBwbGF5ZXIpID0+IHBsYXllci5kcm9wSXRlbShkYXRhLnNsb3QpLFxyXG5cdFx0XHRkcmFnU3RvcEdhbWU6IChkYXRhLCBwbGF5ZXIpID0+IHBsYXllci5kcm9wSXRlbShkYXRhLnNsb3QpLFxyXG5cdFx0XHRkcmFnU3RvcEludmVudG9yeTogKGRhdGEsIHBsYXllcikgPT4gcGxheWVyLm1vdmVJdGVtVG9TbG90KGRhdGEuc2xvdCwgZGF0YS5uZXdTbG90KSxcclxuXHRcdFx0ZHJhZ1N0b3BFcXVpcG1lbnQ6IChkYXRhLCBwbGF5ZXIpID0+IHBsYXllci5tb3ZlSXRlbVRvU2xvdChkYXRhLnNsb3QsIGRhdGEubmV3U2xvdCksXHJcblx0XHRcdHNlcnZlckNoYXQ6IChkYXRhLCBwbGF5ZXIpID0+IGdhbWUuc2VuZE1lc3NhZ2VHbG9iYWwocGxheWVyLmdhbWVJZCwgYCR7cGxheWVyLm5hbWV9IHllbGxzLCBcIiR7ZGF0YS5tZXNzYWdlfVwiYCksXHJcblx0XHRcdG1hcENoYXQ6IChkYXRhLCBwbGF5ZXIpID0+IGdhbWUuc2VuZE1lc3NhZ2VNYXAocGxheWVyLmdhbWVJZCwgcGxheWVyLm1hcElkLCBgJHtwbGF5ZXIubmFtZX0gc2F5cywgXCIke2RhdGEubWVzc2FnZX1cImApLFxyXG5cdFx0XHRwbGF5ZXJDaGF0OiAoZGF0YSwgcGxheWVyKSA9PiB7XHJcblx0XHRcdFx0Y29uc3QgdGFyZ2V0ID0gZ2FtZS5wbGF5ZXJzW2RhdGEudGFyZ2V0SWRdO1xyXG5cdFx0XHRcdGlmICh0YXJnZXQpIHtcclxuXHRcdFx0XHRcdGdhbWUuc2VuZE1lc3NhZ2VQbGF5ZXIocGxheWVyLmdhbWVJZCwgdGFyZ2V0LmdhbWVJZCwgYCR7cGxheWVyLm5hbWV9IHdoaXNwZXJzLCBcIiR7ZGF0YS5tZXNzYWdlfVwiYCk7XHJcblx0XHRcdFx0XHRnYW1lLnNlbmRNZXNzYWdlUGxheWVyKHBsYXllci5nYW1lSWQsIHBsYXllci5nYW1lSWQsIGBZb3Ugd2hpc3BlciB0byAke3RhcmdldC5uYW1lfSwgXCIke2RhdGEubWVzc2FnZX1cImApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0bWFjcm8xOiAoZGF0YSkgPT4ge1xyXG5cdFx0XHRcdGlmIChkYXRhKSB0aGlzLnNwYXduTWFwSXRlbSgxLCA1LCA1LCBcIjVjMWJmZWI3ZDhmYjYwMTJjYzk2NjA4M1wiKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0bWFjcm8yOiAoZGF0YSkgPT4ge1xyXG5cdFx0XHRcdGlmIChkYXRhKSB0aGlzLnNwYXduQm90KDEsIDUsIDUsIFwiNWMxYmVjZGUyOGQwNWIwNzdjYmFhMzg1XCIpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRtYWNybzM6IChkYXRhKSA9PiB7XHJcblx0XHRcdFx0aWYgKGRhdGEpIHtcclxuXHRcdFx0XHRcdGlmIChwbGF5ZXIuc3ByaXRlID49IGNvbmZpZy5NQVhfU1BSSVRFUykgcGxheWVyLnNwcml0ZSA9IDE7XHJcblx0XHRcdFx0XHRlbHNlIHBsYXllci5zcHJpdGUrKztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdG1hY3JvNDogKGRhdGEpID0+IHtcclxuXHRcdFx0fSxcclxuXHJcblx0XHR9O1xyXG5cdFx0XHJcblx0XHR0aGlzLmdvZENvbW1hbmRzID0ge1xyXG5cdFx0XHRzcGF3bk1hcEl0ZW06IChkYXRhKSA9PiB0aGlzLnNwYXduTWFwSXRlbShkYXRhLmFyZ3NbMF0sIGRhdGEuYXJnc1sxXSwgZGF0YS5hcmdzWzJdLCBkYXRhLmFyZ3NbM10sIGRhdGEuYXJnc1s0XSksXHJcblx0XHRcdHNwYXduQm90OiAoZGF0YSkgPT4gdGhpcy5zcGF3bkJvdChkYXRhLmFyZ3NbMF0sIGRhdGEuYXJnc1sxXSwgZGF0YS5hcmdzWzJdLCBkYXRhLmFyZ3NbM10sIGRhdGEuYXJnc1s0XSksXHJcblx0XHRcdHNldFNwcml0ZTogKGRhdGEsIHBsYXllcikgPT4gcGxheWVyLnNwcml0ZSA9IGRhdGEuYXJnc1swXVxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdGFzeW5jIGxvYWRJdGVtcygpIHtcclxuXHRcdGxldCBpdGVtRGF0YSA9IGF3YWl0IGRiLmdldEFsbEl0ZW1zKCk7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1EYXRhLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IGl0ZW0gPSBpdGVtRGF0YVtpXTtcclxuXHRcdFx0aWYgKCFpdGVtKSBjb250aW51ZTtcclxuXHRcdFx0aXRlbS50ZW1wbGF0ZS50eXBlID0gY29uZmlnLklURU1fVFlQRVNbaXRlbS50ZW1wbGF0ZS5pdGVtVHlwZV1cclxuXHRcdFx0bmV3IEl0ZW0oaXRlbSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdGFzeW5jIGxvYWRCb3RzKCkge1xyXG5cdFx0bGV0IGJvdERhdGEgPSBhd2FpdCBkYi5nZXRBbGxCb3RzKCk7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGJvdERhdGEubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0bmV3IEJvdChib3REYXRhW2ldKTtcclxuXHRcdH1cclxuXHR9XHJcblx0cmVxdWVzdERCSWQoKSB7XHJcblx0XHRyZXR1cm4gZGIuZ2VuZXJhdGVJZCgpO1xyXG5cdH1cclxuXHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHRjb25zdCBwYWNrID0ge1xyXG5cdFx0XHRwbGF5ZXJzOiBbXSxcclxuXHRcdFx0Ym90czogW10sXHJcblx0XHRcdGl0ZW1zOiBbXSxcclxuXHRcdFx0ZWZmZWN0czogW10sXHJcblx0XHRcdHRleHRzOiBbXSxcclxuXHRcdFx0bWVzc2FnZXM6IFtdLmNvbmNhdCh0aGlzLm1lc3NhZ2VRdWV1ZSlcclxuXHRcdH07XHJcblx0XHR0aGlzLm1lc3NhZ2VRdWV1ZSA9IFtdO1xyXG5cclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IHBsYXllciA9IHRoaXMucGxheWVyc1tpXTtcclxuXHRcdFx0aWYgKHBsYXllciAhPSBudWxsKSBwYWNrLnBsYXllcnNbcGxheWVyLmdhbWVJZF0gPSBwbGF5ZXIudXBkYXRlKGRlbHRhKTtcclxuXHRcdH1cclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ib3RzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IGJvdCA9IHRoaXMuYm90c1tpXTtcclxuXHRcdFx0aWYgKGJvdCkgcGFjay5ib3RzW2JvdC5nYW1lSWRdID0gYm90LnVwZGF0ZShkZWx0YSk7XHJcblx0XHR9XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgaXRlbSA9IHRoaXMuaXRlbXNbaV07XHJcblx0XHRcdGlmIChpdGVtKSBwYWNrLml0ZW1zW2l0ZW0uZ2FtZUlkXSA9IGl0ZW0udXBkYXRlKGRlbHRhKTtcclxuXHRcdH1cclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5lZmZlY3RzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IGVmZmVjdCA9IHRoaXMuZWZmZWN0c1tpXTtcclxuXHRcdFx0aWYgKGVmZmVjdCkgcGFjay5lZmZlY3RzW2VmZmVjdC5pZF0gPSBlZmZlY3QudXBkYXRlKGRlbHRhKTtcclxuXHRcdH1cclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy50ZXh0cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRjb25zdCB0ZXh0ID0gdGhpcy50ZXh0c1tpXTtcclxuXHRcdFx0aWYgKHRleHQpIHBhY2sudGV4dHNbdGV4dC5nYW1lSWRdID0gdGV4dC51cGRhdGUoZGVsdGEpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHBhY2s7XHJcblx0fVxyXG5cclxuXHRnZXREQlBhY2soKSB7XHJcblx0XHRjb25zdCBkYlBhY2sgPSB7XHJcblx0XHRcdHBsYXllcnM6IFtdLFxyXG5cdFx0XHRib3RzOiBbXSxcclxuXHRcdFx0aXRlbXM6IFtdXHJcblx0XHR9O1xyXG5cdFx0dGhpcy5wbGF5ZXJzLmZvckVhY2gocGxheWVyID0+IGRiUGFjay5wbGF5ZXJzLnB1c2gocGxheWVyLmdldERCUGFjaygpKSk7XHJcblx0XHR0aGlzLmJvdHMuZm9yRWFjaChib3QgPT4gZGJQYWNrLmJvdHMucHVzaChib3QuZ2V0REJQYWNrKCkpKTtcclxuXHRcdHRoaXMuaXRlbXMuZm9yRWFjaChpdGVtID0+IGRiUGFjay5pdGVtcy5wdXNoKGl0ZW0uZ2V0REJQYWNrKCkpKTtcclxuXHRcdHJldHVybiBkYlBhY2s7XHJcblx0fVxyXG5cclxuXHQvLyBQbGF5ZXJzXHJcblx0cGxheWVyTG9naW4oc29ja2V0SWQsIGRhdGEpIHtcclxuXHRcdGZvciAobGV0IHBsYXllciBvZiB0aGlzLnBsYXllcnMpIHtcclxuXHRcdFx0aWYgKHBsYXllciAmJiBwbGF5ZXIubmFtZSA9PT0gZGF0YS5uYW1lKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJQbGF5ZXIgaXMgYWxyZWFkeSBzaWduZWQgaW4uXCIpO1xyXG5cdFx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgcGxheWVyID0gbmV3IFBsYXllcihzb2NrZXRJZCwgZGF0YSk7XHJcblx0XHRkYi5sb2coYCR7c29ja2V0SWR9IC0gJHtwbGF5ZXIubmFtZX0gaGFzIGxvZ2dlZCBpbi5gKTtcclxuXHRcdHRoaXMuc2VuZEdhbWVJbmZvR2xvYmFsKGAke3BsYXllci5uYW1lfSBoYXMgbG9nZ2VkIGluLmApO1xyXG5cdFx0cmV0dXJuIHBsYXllcjtcclxuXHR9XHJcblx0cGxheWVyTG9nb3V0KHBsYXllcklkKSB7XHJcblx0XHRsZXQgcGxheWVyID0gdGhpcy5wbGF5ZXJzW3BsYXllcklkXTtcclxuXHRcdGlmIChwbGF5ZXIpIHtcclxuXHRcdFx0Y29uc3QgcGxheWVyRGF0YSA9IHBsYXllci5nZXREQlBhY2soKVxyXG5cdFx0XHRkYi5sb2coYCR7cGxheWVyLnNvY2tldElkfSAtICR7cGxheWVyLm5hbWV9IGhhcyBsb2dnZWQgb3V0LmApO1xyXG5cdFx0XHR0aGlzLnNlbmRHYW1lSW5mb0dsb2JhbChgJHtwbGF5ZXIubmFtZX0gaGFzIGxvZ2dlZCBvdXQuYCk7XHJcblx0XHRcdGRlbGV0ZSB0aGlzLnRleHRzW3BsYXllci5kaXNwbGF5TmFtZUlkXTtcclxuXHRcdFx0ZGVsZXRlIHRoaXMucGxheWVyc1twbGF5ZXJJZF07XHJcblx0XHRcdGRiLnNhdmVQbGF5ZXIocGxheWVyRGF0YSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdGdldEV4cFRvTGV2ZWwobGV2ZWwpIHtcclxuXHRcdGxldCBleHAgPSAxMDtcclxuXHRcdGZvciAobGV0IGkgPSAxOyBpIDwgY29uZmlnLk1BWF9MRVZFTDsgaSsrKSB7XHJcblx0XHRcdGlmIChpID09PSBsZXZlbCkgcmV0dXJuIGV4cDtcclxuXHRcdFx0ZXhwID0gKGV4cCArIChleHAgJSAyKSkgKiAxLjU7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLyBHYW1lIEluZm9cclxuXHRzZW5kR2FtZUluZm9HbG9iYWwobWVzc2FnZSkge1xyXG5cdFx0dGhpcy5tZXNzYWdlUXVldWUucHVzaChuZXcgTWVzc2FnZShudWxsLCBtZXNzYWdlLCAnZ2FtZUluZm8nKSk7XHJcblx0fVxyXG5cdHNlbmRHYW1lSW5mb01hcChtYXBJZCwgbWVzc2FnZSkge1xyXG5cdFx0dGhpcy5tZXNzYWdlUXVldWUucHVzaChuZXcgTWVzc2FnZShudWxsLCBtZXNzYWdlLCAnZ2FtZUluZm8nLCBtYXBJZCkpO1xyXG5cdH1cclxuXHRzZW5kR2FtZUluZm9QbGF5ZXIoaWQsIG1lc3NhZ2UpIHtcclxuXHRcdHRoaXMubWVzc2FnZVF1ZXVlLnB1c2gobmV3IE1lc3NhZ2UobnVsbCwgbWVzc2FnZSwgJ2dhbWVJbmZvJywgbnVsbCwgaWQpKTtcclxuXHR9XHJcblx0XHJcblx0Ly8gQ2hhdCBNZXNzYWdlc1xyXG5cdHNlbmRNZXNzYWdlR2xvYmFsKHNlbmRlcklkLCBtZXNzYWdlKSB7XHJcblx0XHR0aGlzLm1lc3NhZ2VRdWV1ZS5wdXNoKG5ldyBNZXNzYWdlKHNlbmRlcklkLCBtZXNzYWdlLCAnbWVzc2FnZUdsb2JhbCcpKTtcclxuXHR9XHJcblx0c2VuZE1lc3NhZ2VNYXAoc2VuZGVySWQsIG1hcElkLCBtZXNzYWdlKSB7XHJcblx0XHR0aGlzLm1lc3NhZ2VRdWV1ZS5wdXNoKG5ldyBNZXNzYWdlKHNlbmRlcklkLCBtZXNzYWdlLCAnbWVzc2FnZU1hcCcsIG1hcElkKSk7XHJcblx0fVxyXG5cdHNlbmRNZXNzYWdlUGxheWVyKHNlbmRlcklkLCBpZCwgbWVzc2FnZSkge1xyXG5cdFx0dGhpcy5tZXNzYWdlUXVldWUucHVzaChuZXcgTWVzc2FnZShzZW5kZXJJZCwgbWVzc2FnZSwgJ21lc3NhZ2VQbGF5ZXInLCBudWxsLCBpZCkpO1xyXG5cdH1cclxuXHJcblx0Ly8gTWFwXHJcblx0aXNWYWNhbnQobWFwSWQsIHgsIHkpIHtcclxuXHRcdC8vIENoZWNrIGZvciBNYXAgRWRnZXNcclxuXHRcdGlmICh4IDwgMCB8fCB4ID49IGNvbmZpZy5NQVBfQ09MVU1OUyB8fCB5IDwgMCB8fCB5ID49IGNvbmZpZy5NQVBfUk9XUykgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHJcblx0XHQvLyBDaGVjayBmb3IgV2FsbCBUaWxlc1xyXG5cdFx0Y29uc3QgbWFwID0gdGhpcy5tYXBzW21hcElkXTtcclxuXHRcdGlmIChtYXAuaXNXYWxsW3ldW3hdKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcclxuXHRcdC8vIENoZWNrIGZvciBBY3RvcnNcclxuXHRcdGNvbnN0IGFjdG9yTGlzdCA9IHRoaXMucGxheWVycy5jb25jYXQodGhpcy5ib3RzKTtcclxuXHRcdGNvbnN0IGFjdG9yc09uVGlsZSA9IGFjdG9yTGlzdC5maWx0ZXIoYWN0b3IgPT4ge1xyXG5cdFx0XHRyZXR1cm4gYWN0b3IubWFwSWQgPT09IG1hcElkICYmIGFjdG9yLnggPT09IHggJiYgYWN0b3IueSA9PT0geSAmJiAhYWN0b3IuaXNEZWFkO1xyXG5cdFx0fSk7XHJcblx0XHRpZiAoYWN0b3JzT25UaWxlLmxlbmd0aCA+IDApIHJldHVybiBmYWxzZTtcclxuXHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdHNwYXduQm90KG1hcElkLCB4LCB5LCB0ZW1wbGF0ZUlkLCBkaXJlY3Rpb24gPSAnZG93bicpIHtcclxuXHRcdGNvbnN0IHRlbXBsYXRlID0gdGhpcy5ib3RUZW1wbGF0ZXNbdGVtcGxhdGVJZF07XHJcblx0XHRpZiAodGVtcGxhdGUpIHtcclxuXHRcdFx0bmV3IEJvdCh7bWFwSWQsIHgsIHksIGRpcmVjdGlvbiwgdGVtcGxhdGV9KTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIkJvdCBUZW1wbGF0ZSBkb2VzIG5vdCBleGlzdCB3aXRoIHRoYXQgSWRcIik7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHNwYXduTWFwSXRlbShtYXBJZCwgeCwgeSwgdGVtcGxhdGVJZCwgc3RhY2sgPSAwKSB7XHJcblx0XHRsZXQgdGVtcGxhdGUgPSB0aGlzLml0ZW1UZW1wbGF0ZXNbdGVtcGxhdGVJZF07XHJcblx0XHRpZiAodGVtcGxhdGUpIHtcclxuXHRcdFx0bmV3IEl0ZW0oe21hcElkLCB4LCB5LCB0ZW1wbGF0ZSwgc3RhY2t9KTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIkl0ZW0gVGVtcGxhdGUgZG9lcyBub3QgZXhpc3Qgd2l0aCB0aGF0IElkXCIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c3Bhd25EYW1hZ2VUZXh0KG1hcElkLCB4LCB5LCBkYW1hZ2UpIHtcclxuXHRcdG5ldyBUZXh0KG1hcElkLCB4LCB5ICsgMC41LCBkYW1hZ2UsICcjZmYwMDAwJywgMS4yNSwgMCwgLTEpO1xyXG5cdH1cclxuXHJcblx0c3Bhd25FZmZlY3QobWFwSWQsIHgsIHksIHNwcml0ZSwgbG9vcCwgc3BlZWQsIG1heEZyYW1lLCBzdGFydEZyYW1lKSB7XHJcblx0XHRuZXcgRWZmZWN0KG1hcElkLCB4LCB5LCBzcHJpdGUsIGxvb3AsIHNwZWVkLCBtYXhGcmFtZSwgc3RhcnRGcmFtZSk7XHJcblx0fVxyXG59XHJcblxyXG5jb25zdCBnYW1lID0gbmV3IEdhbWUoKTtcclxuZXhwb3J0IGRlZmF1bHQgZ2FtZTtcclxuIiwiLyoqKiBHYW1lIExvb3AgKioqL1xyXG4vKiBLZWVwcyB0cmFjayBvZiB0aW1lIGFuZCBjby1vcmRpbmF0ZXMgdGhlIGdhbWUgYW5kIHNlcnZlciAqL1xyXG5cclxuaW1wb3J0IE5vZGVHYW1lTG9vcCBmcm9tICdub2RlLWdhbWVsb29wJztcclxuXHJcbmltcG9ydCBkYiBmcm9tICcuL2RiLmpzJztcclxuaW1wb3J0IGdhbWUgZnJvbSAnLi9nYW1lLmpzJztcclxuaW1wb3J0IHNlcnZlciBmcm9tICcuL3NlcnZlci5qcyc7XHJcbmltcG9ydCBjb25maWcgZnJvbSAnLi9jb25maWcuanMnO1xyXG5cclxuY2xhc3MgR2FtZUxvb3Age1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0dGhpcy50aW1lciA9IHtcclxuXHRcdFx0YmFja3VwOiAwLFxyXG5cdFx0XHRtaW51dGU6IDBcclxuXHRcdH07XHJcblxyXG5cdFx0dGhpcy5pZCA9IE5vZGVHYW1lTG9vcC5zZXRHYW1lTG9vcCgoZGVsdGEpID0+IHRoaXMudXBkYXRlKGRlbHRhKSwgY29uZmlnLkZSQU1FUkFURSk7XHJcblx0fVxyXG5cclxuXHR1cGRhdGUoZGVsdGEpIHtcclxuXHRcdC8vIEluY3JlYXNlIFRpbWVyc1xyXG5cdFx0dGhpcy50aW1lci5iYWNrdXAgKz0gZGVsdGE7XHJcblx0XHR0aGlzLnRpbWVyLm1pbnV0ZSArPSBkZWx0YTtcclxuXHJcblx0XHQvLyBVcGRhdGUgdGhlIGdhbWUgc3RhdGVcclxuXHRcdGxldCB1cGRhdGVQYWNrID0gZ2FtZS51cGRhdGUoZGVsdGEpO1xyXG5cdFx0Ly8gU2VuZCB1cGRhdGVkIHN0YXRlIHRvIGNsaWVudHNcclxuXHRcdHNlcnZlci5zZW5kVXBkYXRlUGFjayh1cGRhdGVQYWNrKTtcclxuXHRcdFxyXG5cdFx0Ly8gTWludXRlIHRpbWVyIHNjcmlwdFxyXG5cdFx0aWYgKHRoaXMudGltZXIubWludXRlID49IDYwKSB7XHJcblx0XHRcdHRoaXMudGltZXIubWludXRlIC09IDYwO1xyXG5cdFx0XHQvLyBUT0RPOiBydW4gbWludXRlIHRpbWVyIHNjcmlwdFxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFBlcmlvZGljIGJhY2t1cCB0byBkYXRhYmFzZVxyXG5cdFx0aWYgKHRoaXMudGltZXIuYmFja3VwID49IGNvbmZpZy5CQUNLVVBfVElNRSkge1xyXG5cdFx0XHR0aGlzLnRpbWVyLmJhY2t1cCAtPSBjb25maWcuQkFDS1VQX1RJTUU7XHJcblx0XHRcdGxldCBkYlBhY2sgPSBnYW1lLmdldERCUGFjaygpO1xyXG5cdFx0XHRkYi5iYWNrdXAoZGJQYWNrKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmNvbnN0IGdhbWVMb29wID0gbmV3IEdhbWVMb29wKCk7XHJcbmV4cG9ydCBkZWZhdWx0IGdhbWVMb29wO1xyXG4iLCJpbXBvcnQgZGIgZnJvbSAnLi9kYi5qcyc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4vZ2FtZS5qcyc7XHJcbmltcG9ydCBzZXJ2ZXIgZnJvbSAnLi9zZXJ2ZXIuanMnO1xyXG5pbXBvcnQgZ2FtZWxvb3AgZnJvbSAnLi9nYW1lbG9vcC5qcyc7XHJcbiIsImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XHJcblxyXG5jb25zdCBhY2NvdW50U2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYSh7XHJcbiAgX2lkOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCxcclxuICB1c2VybmFtZToge3R5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUsIHVuaXF1ZTogdHJ1ZX0sXHJcbiAgdXNlcm5hbWVMb3dlckNhc2U6IHt0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlLCB1bmlxdWU6IHRydWV9LFxyXG4gIHBhc3N3b3JkOiB7dHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZX0sXHJcbiAgZW1haWw6IHt0eXBlOiBTdHJpbmcsIG1hdGNoOiAvXigoW148PigpXFxbXFxdXFxcXC4sOzpcXHNAXCJdKyhcXC5bXjw+KClcXFtcXF1cXFxcLiw7Olxcc0BcIl0rKSopfChcIi4rXCIpKUAoKFxcW1swLTldezEsM31cXC5bMC05XXsxLDN9XFwuWzAtOV17MSwzfVxcLlswLTldezEsM31dKXwoKFthLXpBLVpcXC0wLTldK1xcLikrW2EtekEtWl17Mix9KSkkL30sXHJcbiAgdmVyaWZpZWQ6IHt0eXBlOiBCb29sZWFuLCBkZWZhdWx0OiBmYWxzZX0sXHJcbiAgYWRtaW46IHt0eXBlOiBCb29sZWFuLCBkZWZhdWx0OiBmYWxzZX1cclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBtb25nb29zZS5tb2RlbCgnQWNjb3VudCcsIGFjY291bnRTY2hlbWEpO1xyXG4iLCJpbXBvcnQgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xyXG5cclxuY29uc3QgYm90U2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYSh7XHJcbiAgX2lkOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCxcclxuICBtYXBJZDoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMX0sXHJcbiAgeDoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogNX0sXHJcbiAgeToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogNX0sXHJcbiAgdGVtcGxhdGU6IHt0eXBlOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCwgcmVmOiAnQm90VGVtcGxhdGUnLCByZXF1aXJlZDogdHJ1ZX0sXHJcbiAgZGlyZWN0aW9uOiB7dHlwZTogU3RyaW5nLCBkZWZhdWx0OiAnZG93bid9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWwoJ0JvdCcsIGJvdFNjaGVtYSk7XHJcbiIsImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XHJcblxyXG5jb25zdCBib3RUZW1wbGF0ZVNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoe1xyXG4gIF9pZDogbW9uZ29vc2UuU2NoZW1hVHlwZXMuT2JqZWN0SWQsXHJcbiAgbmFtZToge3R5cGU6IFN0cmluZywgZGVmYXVsdDogXCJCb3RcIn0sXHJcbiAgc3ByaXRlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuICBkYW1hZ2VCYXNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuICBkZWZlbmNlQmFzZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcbiAgaGVhbHRoTWF4QmFzZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMX0sXHJcbiAgZW5lcmd5TWF4QmFzZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMX0sXHJcbiAgaGVhbHRoUmVnZW5CYXNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuICBlbmVyZ3lSZWdlbkJhc2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDF9LFxyXG4gIHJhbmdlQmFzZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMX0sXHJcbiAgaG9zdGlsZToge3R5cGU6IEJvb2xlYW4sIGRlZmF1bHQ6IHRydWV9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWwoJ0JvdFRlbXBsYXRlJywgYm90VGVtcGxhdGVTY2hlbWEpO1xyXG4iLCJpbXBvcnQgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xyXG5cclxuY29uc3QgaXRlbVNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoe1xyXG4gIF9pZDogbW9uZ29vc2UuU2NoZW1hVHlwZXMuT2JqZWN0SWQsXHJcbiAgdGVtcGxhdGU6IHt0eXBlOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCwgcmVmOiAnSXRlbVRlbXBsYXRlJywgcmVxdWlyZWQ6IHRydWV9LFxyXG4gIHN0YWNrOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuICBwbGF5ZXJJZDoge3R5cGU6IG1vbmdvb3NlLlNjaGVtYVR5cGVzLk9iamVjdElkLCBkZWZhdWx0OiBudWxsfSxcclxuICBib3RJZDoge3R5cGU6IG1vbmdvb3NlLlNjaGVtYVR5cGVzLk9iamVjdElkLCBkZWZhdWx0OiBudWxsfSxcclxuICBzbG90OiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiBudWxsfSxcclxuICBtYXBJZDoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogbnVsbH0sXHJcbiAgeDoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogbnVsbH0sXHJcbiAgeToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogbnVsbH0sXHJcbiAgY3JlYXRlZEJ5OiB7dHlwZTogU3RyaW5nfSxcclxuICBjcmVhdGVkRGF0ZToge3R5cGU6IERhdGV9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWwoJ0l0ZW0nLCBpdGVtU2NoZW1hKTtcclxuIiwiaW1wb3J0IG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcclxuXHJcbmNvbnN0IGl0ZW1UZW1wbGF0ZVNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoe1xyXG5cdF9pZDogbW9uZ29vc2UuU2NoZW1hVHlwZXMuT2JqZWN0SWQsXHJcblx0bmFtZToge3R5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWV9LFxyXG5cdHNwcml0ZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMX0sXHJcblx0cmV1c2FibGU6IHt0eXBlOiBCb29sZWFuLCBkZWZhdWx0OiB0cnVlfSxcclxuXHRpdGVtVHlwZToge3R5cGU6IE51bWJlciwgcmVxdWlyZWQ6IHRydWV9LFxyXG5cdHBhc3NpdmVEYW1hZ2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG5cdHBhc3NpdmVEZWZlbmNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuXHRwYXNzaXZlSGVhbHRoTWF4OiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuXHRwYXNzaXZlRW5lcmd5TWF4OiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuXHRwYXNzaXZlSGVhbHRoUmVnZW46IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG5cdHBhc3NpdmVFbmVyZ3lSZWdlbjoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcblx0cGFzc2l2ZVJhbmdlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuXHRlcXVpcHBlZERhbWFnZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcblx0ZXF1aXBwZWREZWZlbmNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuXHRlcXVpcHBlZEhlYWx0aE1heDoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcblx0ZXF1aXBwZWRFbmVyZ3lNYXg6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG5cdGVxdWlwcGVkSGVhbHRoUmVnZW46IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG5cdGVxdWlwcGVkRW5lcmd5UmVnZW46IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG5cdGVxdWlwcGVkUmFuZ2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWwoJ0l0ZW1UZW1wbGF0ZScsIGl0ZW1UZW1wbGF0ZVNjaGVtYSk7XHJcbiIsImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XHJcblxyXG5jb25zdCBtYXBTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcclxuXHRfaWQ6IG1vbmdvb3NlLlNjaGVtYVR5cGVzLk9iamVjdElkLFxyXG5cdG1hcElkOiBOdW1iZXIsXHJcblx0bmFtZToge3R5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWV9LFxyXG5cdGRyb3BDaGFuY2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDEwMH0sXHJcblx0ZHJvcEFtb3VudEVROiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuXHR0aWxlczoge3R5cGU6IFtbW051bWJlcl1dXSwgZGVmYXVsdDogW1tbXV1dfSxcclxuXHRpc1dhbGw6IHt0eXBlOiBbW0Jvb2xlYW5dXSwgZGVmYXVsdDogZmFsc2V9LFxyXG5cdGlzSG9zdGlsZToge3R5cGU6IFtbQm9vbGVhbl1dLCBkZWZhdWx0OiBmYWxzZX0sXHJcblx0ZGFtYWdlOiB7dHlwZTogW1tOdW1iZXJdXSwgZGVmYXVsdDogbnVsbH0sXHJcblx0d2FycE1hcDoge3R5cGU6IFtbTnVtYmVyXV0sIGRlZmF1bHQ6IG51bGx9LFxyXG5cdHdhcnBYOiB7dHlwZTogW1tOdW1iZXJdXSwgZGVmYXVsdDogbnVsbH0sXHJcblx0d2FycFk6IHt0eXBlOiBbW051bWJlcl1dLCBkZWZhdWx0OiBudWxsfVxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1vbmdvb3NlLm1vZGVsKCdNYXAnLCBtYXBTY2hlbWEpO1xyXG4iLCJpbXBvcnQgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xyXG5cclxuY29uc3QgcGxheWVyU2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYSh7XHJcbiAgX2lkOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCxcclxuICBhY2NvdW50OiB7dHlwZTogbW9uZ29vc2UuU2NoZW1hVHlwZXMuT2JqZWN0SWQsIHJlZjogJ0FjY291bnQnLCByZXF1aXJlZDogdHJ1ZX0sXHJcbiAgbmFtZToge3R5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUsIHVuaXF1ZTogdHJ1ZX0sXHJcbiAgbmFtZUxvd2VyQ2FzZToge3R5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUsIHVuaXF1ZTogdHJ1ZX0sXHJcbiAgdGVtcGxhdGU6IHt0eXBlOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCwgcmVmOiAnUGxheWVyVGVtcGxhdGUnLCByZXF1aXJlZDogdHJ1ZX0sXHJcbiAgbGV2ZWw6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDF9LFxyXG4gIGV4cGVyaWVuY2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG4gIG1hcElkOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuICB4OiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiA1fSxcclxuICB5OiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiA1fSxcclxuICBkaXJlY3Rpb246IHt0eXBlOiBTdHJpbmcsIGRlZmF1bHQ6ICdkb3duJ30sXHJcbiAgYWRtaW5BY2Nlc3M6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG4gIHNwcml0ZTogTnVtYmVyXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWwoJ1BsYXllcicsIHBsYXllclNjaGVtYSk7XHJcbiIsImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XHJcblxyXG5jb25zdCBwbGF5ZXJUZW1wbGF0ZVNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoe1xyXG4gIF9pZDogbW9uZ29vc2UuU2NoZW1hVHlwZXMuT2JqZWN0SWQsXHJcbiAgbmFtZToge3R5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUsIHVuaXF1ZTogdHJ1ZX0sXHJcbiAgc3ByaXRlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuICBkYW1hZ2VCYXNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuICBkZWZlbmNlQmFzZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcbiAgaGVhbHRoTWF4QmFzZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMX0sXHJcbiAgZW5lcmd5TWF4QmFzZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMX0sXHJcbiAgaGVhbHRoUmVnZW5CYXNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuICBlbmVyZ3lSZWdlbkJhc2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDF9LFxyXG4gIHJhbmdlQmFzZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMX0sXHJcbiAgaGVhbHRoUGVyTGV2ZWw6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG4gIGVuZXJneVBlckxldmVsOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfVxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1vbmdvb3NlLm1vZGVsKCdQbGF5ZXJUZW1wbGF0ZScsIHBsYXllclRlbXBsYXRlU2NoZW1hKTtcclxuIiwiaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XHJcbmltcG9ydCBodHRwIGZyb20gJ2h0dHAnO1xyXG5pbXBvcnQgc29ja2V0SU8gZnJvbSAnc29ja2V0LmlvJztcclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcblxyXG5pbXBvcnQgZGIgZnJvbSAnLi9kYi5qcyc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4vZ2FtZS5qcyc7XHJcbmltcG9ydCBjb25maWcgZnJvbSAnLi9jb25maWcuanMnO1xyXG5cclxuY2xhc3MgU2VydmVyIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdGNvbnN0IGFwcCA9IGV4cHJlc3MoKTtcclxuXHRcdGNvbnN0IGh0dHBTZXJ2ZXIgPSBodHRwLlNlcnZlcihhcHApO1xyXG5cdFx0Y29uc3QgaW8gPSBzb2NrZXRJTyhodHRwU2VydmVyKTtcclxuXHRcdGNvbnN0IHBvcnQgPSBwcm9jZXNzLmVudi5QT1JUIHx8IGNvbmZpZy5QT1JUO1xyXG5cdFx0Y29uc3QgcHVibGljUGF0aCA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLi9jbGllbnQnKTtcclxuXHRcdFxyXG5cdFx0YXBwLmdldCgnLycsIChyZXEsIHJlcykgPT4gcmVzLnNlbmRGaWxlKHB1YmxpY1BhdGggKyAnL2luZGV4Lmh0bWwnKSk7XHJcblx0XHRhcHAudXNlKCcvY2xpZW50JywgZXhwcmVzcy5zdGF0aWMocHVibGljUGF0aCkpO1xyXG5cdFx0aHR0cFNlcnZlci5saXN0ZW4ocG9ydCwgKCkgPT4gZGIubG9nKGBTZXJ2ZXIgc3RhcnRlZC4gTGlzdGVuaW5nIG9uIHBvcnQgJHtodHRwU2VydmVyLmFkZHJlc3MoKS5wb3J0fS4uLmApKTtcclxuXHJcblx0XHR0aGlzLnNvY2tldExpc3QgPSB7fTtcclxuXHRcdHRoaXMuYWN0aXZlQWNjb3VudHMgPSB7fTtcclxuXHJcblx0XHRpby5zb2NrZXRzLm9uKCdjb25uZWN0Jywgc29ja2V0ID0+IHRoaXMub25Db25uZWN0KHNvY2tldCkpO1xyXG5cdH1cclxuXHJcblx0LyogY29ubmVjdCA9PiBzaWduaW4gPT4gc2VsZWN0cGxheWVyXHJcblx0KiogY29ubmVjdCB3aGVuIHBhZ2UgbG9hZHMgLSBzaG93cyBzaWduaW4gcGFnZVxyXG5cdCoqIHNpZ25pbiB3aGVuIHVzZXJuYW1lIGFuZCBwYXNzd29yZCBpcyBzdWJtaXR0ZWRcclxuIFx0Kiogc2VsZWN0cGxheWVyIHdoZW4gY2hhcmFjdGVyIGlzIGNob3NlbiAtIGxvZ3MgaW50byB0aGUgZ2FtZVxyXG5cdCovXHJcblxyXG5cdC8vIFJlY2VpdmUgZGF0YSBmcm9tIGNsaWVudHNcclxuXHRvbkNvbm5lY3Qoc29ja2V0KSB7XHJcblx0XHR0aGlzLnNvY2tldExpc3Rbc29ja2V0LmlkXSA9IHNvY2tldDtcclxuXHRcdGRiLmxvZyhgJHtzb2NrZXQuaWR9IC0gU29ja2V0IGNvbm5lY3RlZC5gKTtcclxuXHRcdFxyXG5cdFx0c29ja2V0Lm9uKCdkaXNjb25uZWN0JywgKCkgPT4gdGhpcy5vbkRpc2Nvbm5lY3Qoc29ja2V0KSk7XHJcblx0XHRzb2NrZXQub24oJ3NpZ251cCcsIChkYXRhKSA9PiB0aGlzLm9uU2lnblVwKHNvY2tldCwgZGF0YS51c2VybmFtZSwgZGF0YS5wYXNzd29yZCwgZGF0YS5lbWFpbCkpO1xyXG5cdFx0c29ja2V0Lm9uKCdzaWduaW4nLCAoZGF0YSkgPT4gdGhpcy5vblNpZ25Jbihzb2NrZXQsIGRhdGEudXNlcm5hbWUsIGRhdGEucGFzc3dvcmQpKTtcclxuXHRcdHNvY2tldC5vbignc2lnbm91dCcsICgpID0+IHRoaXMub25TaWduT3V0KHNvY2tldCkpO1xyXG5cdFx0Ly8gVGVsbCBjbGllbnQgdGhleSBoYXZlIGNvbm5lY3RlZFxyXG5cdH1cclxuXHJcblx0YXN5bmMgb25EaXNjb25uZWN0KHNvY2tldCkge1xyXG5cdFx0aWYgKHNvY2tldC5wbGF5ZXJJZCAhPSBudWxsICYmIGdhbWUucGxheWVyc1tzb2NrZXQucGxheWVySWRdKSBhd2FpdCB0aGlzLm9uTG9nT3V0KHNvY2tldCk7XHJcblx0XHRpZiAoc29ja2V0LmFjY291bnRJZCAmJiB0aGlzLmFjdGl2ZUFjY291bnRzW3NvY2tldC5hY2NvdW50SWRdKSBhd2FpdCB0aGlzLm9uU2lnbk91dChzb2NrZXQpO1xyXG5cclxuXHRcdGRiLmxvZyhgJHtzb2NrZXQuaWR9IC0gU29ja2V0IGRpc2Nvbm5lY3RlZC5gKTtcclxuXHRcdGRlbGV0ZSB0aGlzLnNvY2tldExpc3Rbc29ja2V0LmlkXTtcclxuXHR9XHJcblxyXG5cdGFzeW5jIG9uU2lnblVwKHNvY2tldCwgdXNlcm5hbWUsIHBhc3N3b3JkLCBlbWFpbCkge1xyXG5cdFx0bGV0IGFjY291bnRJZCA9IGF3YWl0IGRiLmFkZEFjY291bnQodXNlcm5hbWUsIHBhc3N3b3JkLCBlbWFpbCk7XHJcblx0XHRpZiAoYWNjb3VudElkKSB7XHJcblx0XHRcdGRiLmxvZyhgJHtzb2NrZXQuaWR9IC0gQWNjb3VudCBhZGRlZDogJHt1c2VybmFtZX1gKTtcclxuXHRcdFx0c29ja2V0LmVtaXQoJ3NpZ25lZFVwJywge3VzZXJuYW1lLCBwYXNzd29yZH0pO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHNvY2tldC5lbWl0KCdzaWduZWRVcCcsIG51bGwpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0YXN5bmMgb25TaWduSW4oc29ja2V0LCB1c2VybmFtZSwgcGFzc3dvcmQpIHtcclxuXHRcdGxldCBzdWNjZXNzID0gYXdhaXQgZGIuYXV0aEFjY291bnQodXNlcm5hbWUsIHBhc3N3b3JkKTtcclxuXHRcdGlmICghc3VjY2Vzcykge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhgU2lnbiBpbiBmYWlsZWQgb24gdXNlcm5hbWUgJHt1c2VybmFtZX1gKTtcclxuXHRcdFx0c29ja2V0LmVtaXQoJ3NpZ25lZEluJywgZmFsc2UpO1x0Ly8gVGVsbCBjbGllbnQgc2lnbmluIHdhcyBub3Qgc3VjY2Vzc2Z1bFxyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGFjY291bnQgPSBhd2FpdCBkYi5nZXRBY2NvdW50QnlVc2VybmFtZSh1c2VybmFtZSk7XHJcblx0XHRpZiAodGhpcy5hY3RpdmVBY2NvdW50c1thY2NvdW50Ll9pZF0pIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJUaGF0IGFjY291bnQgaXMgYWxyZWFkeSBzaWduZWQgaW4uXCIpO1xyXG5cdFx0XHRzb2NrZXQuZW1pdCgnc2lnbmVkSW4nLCBmYWxzZSk7XHQvLyBUZWxsIGNsaWVudCB0aGF0IGFjY291bnQgaXMgYWxyZWFkeSBzaWduZWQgaW5cclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRzb2NrZXQuYWNjb3VudElkID0gYWNjb3VudC5faWQ7XHJcblx0XHR0aGlzLmFjdGl2ZUFjY291bnRzW2FjY291bnQuX2lkXSA9IHVzZXJuYW1lO1xyXG5cclxuXHRcdHNvY2tldC5vbignYWRkUGxheWVyJywgKGRhdGEpID0+IHRoaXMub25BZGRQbGF5ZXIoc29ja2V0LCBkYXRhLm5hbWUsIGRhdGEudGVtcGxhdGVJZCkpO1xyXG5cdFx0c29ja2V0Lm9uKCdsb2dpbicsIChuYW1lKSA9PiB0aGlzLm9uTG9nSW4oc29ja2V0LCBuYW1lKSk7XHJcblx0XHRzb2NrZXQub24oJ2xvZ291dCcsICgpID0+IHRoaXMub25Mb2dPdXQoc29ja2V0KSk7XHJcblx0XHRzb2NrZXQub24oJ2FkZFBsYXllclRlbXBsYXRlJywgKGRhdGEpID0+IHRoaXMub25BZGRQbGF5ZXJUZW1wbGF0ZShkYXRhKSk7XHJcblxyXG5cdFx0ZGIubG9nKGAke3NvY2tldC5pZH0gLSAke3VzZXJuYW1lfSBzaWduZWQgaW4uYCk7XHJcblx0XHRsZXQgcGxheWVycyA9IGF3YWl0IGRiLmdldFBsYXllcnNCeUFjY291bnQoYWNjb3VudC5faWQpO1xyXG5cdFx0bGV0IHBsYXllclRlbXBsYXRlcyA9IGF3YWl0IGRiLmdldEFsbFBsYXllclRlbXBsYXRlcygpO1xyXG5cdFx0c29ja2V0LmVtaXQoJ3NpZ25lZEluJywge2FjY291bnQsIHBsYXllcnMsIHBsYXllclRlbXBsYXRlc30pO1xyXG5cdH1cclxuXHRcclxuXHRhc3luYyBvblNpZ25PdXQoc29ja2V0KSB7XHJcblx0XHRpZiAoc29ja2V0LnBsYXllcklkICE9IG51bGwpIGF3YWl0IHRoaXMub25Mb2dPdXQoc29ja2V0KTtcclxuXHRcdFxyXG5cdFx0aWYgKHNvY2tldC5hY2NvdW50SWQpIHtcclxuXHRcdFx0Y29uc3QgdXNlcm5hbWUgPSB0aGlzLmFjdGl2ZUFjY291bnRzW3NvY2tldC5hY2NvdW50SWRdO1xyXG5cdFx0XHRkYi5sb2coYCR7c29ja2V0LmlkfSAtICR7dXNlcm5hbWV9IHNpZ25lZCBvdXQuYCk7XHJcblx0XHRcdGRlbGV0ZSB0aGlzLmFjdGl2ZUFjY291bnRzW3NvY2tldC5hY2NvdW50SWRdO1xyXG5cdFx0XHRzb2NrZXQuYWNjb3VudElkID0gbnVsbDtcclxuXHRcdFx0c29ja2V0LmVtaXQoJ3NpZ25lZE91dCcpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0YXN5bmMgb25BZGRQbGF5ZXIoc29ja2V0LCBuYW1lLCB0ZW1wbGF0ZUlkKSB7XHJcblx0XHRsZXQgcGxheWVySWQgPSBhd2FpdCBkYi5hZGRQbGF5ZXIoc29ja2V0LmFjY291bnRJZCwgbmFtZSwgdGVtcGxhdGVJZCk7XHJcblx0XHRpZiAocGxheWVySWQpIHtcclxuXHRcdFx0Y29uc3QgdXNlcm5hbWUgPSB0aGlzLmFjdGl2ZUFjY291bnRzW3NvY2tldC5hY2NvdW50SWRdO1xyXG5cdFx0XHRkYi5sb2coYCR7c29ja2V0LmlkfSAtICR7bmFtZX0gaGFzIGJlZW4gYWRkZWQgYXMgYSBwbGF5ZXIgdG8gYWNjb3VudCAke3VzZXJuYW1lfS5gKTtcclxuXHRcdFx0c29ja2V0LmVtaXQoJ3BsYXllckFkZGVkJywgcGxheWVySWQpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHNvY2tldC5lbWl0KCdwbGF5ZXJBZGRlZCcsIG51bGwpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRhc3luYyBvbkFkZFBsYXllclRlbXBsYXRlKGRhdGEpIHtcclxuXHRcdGxldCBzdWNjZXNzID0gYXdhaXQgZGIuYWRkUGxheWVyVGVtcGxhdGUoZGF0YSk7XHJcblx0XHRpZiAoc3VjY2Vzcykge1xyXG5cdFx0XHRnYW1lLmxvYWRQbGF5ZXJUZW1wbGF0ZXMoKTtcclxuXHRcdFx0ZGIubG9nKGAke3NvY2tldC5pZH0gLSAke2RhdGEubmFtZX0gaGFzIGJlZW4gYWRkZWQgYXMgYSBwbGF5ZXIgdGVtcGxhdGUuYCk7XHJcblx0XHRcdC8vIFRlbGwgY2xpZW50IGFkZCBwbGF5ZXIgd2FzIHN1Y2Nlc3NmdWxcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHQvLyBUZWxsIGNsaWVudCBhZGQgcGxheWVyIHdhcyBub3Qgc3VjY2Vzc2Z1bFxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0YXN5bmMgb25Mb2dJbihzb2NrZXQsIHBsYXllcklkKSB7XHJcblx0XHRpZiAoIXNvY2tldC5hY2NvdW50SWQpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJOb3Qgc2lnbmVkIGludG8gYWNjb3VudC5cIik7XHJcblx0XHRcdHNvY2tldC5lbWl0KCdsb2dnZWRJbicsIGZhbHNlKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHNvY2tldC5wbGF5ZXJJZCAhPSBudWxsKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiQWxyZWFkeSBsb2dnZWQgaW4uXCIpO1xyXG5cdFx0XHRzb2NrZXQuZW1pdCgnbG9nZ2VkSW4nLCBmYWxzZSk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgcGxheWVyRGF0YSA9IGF3YWl0IGRiLmdldFBsYXllcihwbGF5ZXJJZCk7XHJcblx0XHRpZiAoIXBsYXllckRhdGEpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJObyBwbGF5ZXIgd2l0aCB0aGF0IG5hbWUuXCIpO1xyXG5cdFx0XHRzb2NrZXQuZW1pdCgnbG9nZ2VkSW4nLCBmYWxzZSk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoXCJcIitzb2NrZXQuYWNjb3VudElkICE9PSBcIlwiK3BsYXllckRhdGEuYWNjb3VudCkge1x0Ly8gQ2FzdCB0byBzdHJpbmcgYmVmb3JlIGNvbXBhcmlzb25cclxuXHRcdFx0ZGIubG9nKGBBdHRlbXB0IHRvIGxvZ2luIHRvIHBsYXllciAoJHtwbGF5ZXJEYXRhLm5hbWV9KSBmcm9tIHdyb25nIGFjY291bnQgKCR7c29ja2V0LmFjY291bnRJZH0pIG9uIHNvY2tldCAke3NvY2tldC5pZH0uYCk7XHJcblx0XHRcdHNvY2tldC5lbWl0KCdsb2dnZWRJbicsIGZhbHNlKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHBsYXllciA9IGdhbWUucGxheWVyTG9naW4oc29ja2V0LmlkLCBwbGF5ZXJEYXRhKTtcclxuXHRcdGlmICghcGxheWVyKSB7XHJcblx0XHRcdHNvY2tldC5lbWl0KCdsb2dnZWRJbicsIGZhbHNlKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFxyXG5cdFx0c29ja2V0LnBsYXllcklkID0gcGxheWVyLmdhbWVJZDtcclxuXHRcdHNvY2tldC5vbignaW5wdXQnLCAoZGF0YSkgPT4gcGxheWVyLmlucHV0RGF0YShkYXRhKSk7XHJcblx0XHRzb2NrZXQub24oJ3VwbG9hZE1hcCcsIChkYXRhKSA9PiB7XHJcblx0XHRcdGlmIChwbGF5ZXIuYWRtaW5BY2Nlc3MgPj0gMikgdGhpcy5vblVwbG9hZE1hcChkYXRhKTtcclxuXHRcdFx0ZWxzZSBnYW1lLnNlbmRHYW1lSW5mb1BsYXllcihwbGF5ZXIuZ2FtZUlkLCBgWW91IGRvbid0IGhhdmUgYWNjZXNzIHRvIHRoYXQgY29tbWFuZC5gKTtcclxuXHRcdH0pO1xyXG5cdFx0Y29uc3QgbWFwRGF0YSA9IGdhbWUubWFwc1twbGF5ZXIubWFwSWRdLmdldFBhY2soKTtcclxuXHRcdHNvY2tldC5lbWl0KCdsb2dnZWRJbicsIG1hcERhdGEpO1xyXG5cdH1cclxuXHRcclxuXHRhc3luYyBvbkxvZ091dChzb2NrZXQpIHtcclxuXHRcdGlmIChzb2NrZXQucGxheWVySWQgIT0gbnVsbCkge1xyXG5cdFx0XHRhd2FpdCBnYW1lLnBsYXllckxvZ291dChzb2NrZXQucGxheWVySWQpO1xyXG5cdFx0XHRzb2NrZXQucGxheWVySWQgPSBudWxsO1xyXG5cdFx0XHRzb2NrZXQuZW1pdCgnbG9nZ2VkT3V0Jyk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGFzeW5jIG9uVXBsb2FkTWFwKGRhdGEpIHtcclxuXHRcdGxldCBzdWNjZXNzID0gYXdhaXQgZGIuc2F2ZU1hcChkYXRhKTtcclxuXHRcdGlmICghc3VjY2Vzcykge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIkZhaWxlZCB0byB1cGxvYWQgbWFwLlwiKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0Z2FtZS5tYXBzW2RhdGEubWFwSWRdLnVwbG9hZChkYXRhKTtcclxuXHRcdFxyXG5cdFx0Z2FtZS5wbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xyXG5cdFx0XHRpZiAocGxheWVyLm1hcElkID09PSBkYXRhLm1hcElkKSB7XHJcblx0XHRcdFx0dGhpcy5zZW5kTWFwRGF0YSh0aGlzLnNvY2tldExpc3RbcGxheWVyLnNvY2tldElkXSwgcGxheWVyLm1hcElkKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHQvLyBTZW5kIGRhdGEgdG8gY2xpZW50c1xyXG5cdHNlbmRVcGRhdGVQYWNrKHVwZGF0ZVBhY2spIHtcclxuXHRcdGdhbWUucGxheWVycy5mb3JFYWNoKHBsYXllciA9PiB7XHJcblx0XHRcdGNvbnN0IHBhY2sgPSB7XHJcblx0XHRcdFx0Z2FtZToge1xyXG5cdFx0XHRcdFx0cGxheWVyczogW10sXHJcblx0XHRcdFx0XHRib3RzOiBbXSxcclxuXHRcdFx0XHRcdGl0ZW1zOiBbXSxcclxuXHRcdFx0XHRcdGVmZmVjdHM6IFtdLFxyXG5cdFx0XHRcdFx0dGV4dHM6IFtdXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRtZW51OiBwbGF5ZXIuZ2V0VUlQYWNrKCksXHJcblx0XHRcdFx0Y2hhdGJveDoge31cclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdGZvciAobGV0IHBsYXllckRhdGEgb2YgdXBkYXRlUGFjay5wbGF5ZXJzKSB7XHJcblx0XHRcdFx0aWYgKHBsYXllckRhdGEgJiYgKChwbGF5ZXJEYXRhLm1hcElkID09PSBwbGF5ZXIubWFwSWQgJiYgcGxheWVyRGF0YS5pc1Zpc2libGUpIHx8IHBsYXllckRhdGEuc29ja2V0SWQgPT09IHBsYXllci5zb2NrZXRJZCkpIHtcclxuXHRcdFx0XHRcdHBhY2suZ2FtZS5wbGF5ZXJzW3BsYXllckRhdGEuZ2FtZUlkXSA9IHBsYXllckRhdGE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGZvciAobGV0IGJvdCBvZiB1cGRhdGVQYWNrLmJvdHMpIHtcclxuXHRcdFx0XHRpZiAoYm90ICYmIGJvdC5tYXBJZCA9PT0gcGxheWVyLm1hcElkKSBwYWNrLmdhbWUuYm90c1tib3QuZ2FtZUlkXSA9IGJvdDtcclxuXHRcdFx0fVxyXG5cdFx0XHRmb3IgKGxldCBpdGVtIG9mIHVwZGF0ZVBhY2suaXRlbXMpIHtcclxuXHRcdFx0XHRpZiAoaXRlbSAmJiBpdGVtLm1hcElkID09PSBwbGF5ZXIubWFwSWQpIHBhY2suZ2FtZS5pdGVtc1tpdGVtLmdhbWVJZF0gPSBpdGVtO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZvciAobGV0IGVmZmVjdCBvZiB1cGRhdGVQYWNrLmVmZmVjdHMpIHtcclxuXHRcdFx0XHRpZiAoZWZmZWN0ICYmIGVmZmVjdC5tYXBJZCA9PT0gcGxheWVyLm1hcElkKSBwYWNrLmdhbWUuZWZmZWN0c1tlZmZlY3QuZ2FtZUlkXSA9IGVmZmVjdDtcclxuXHRcdFx0fVxyXG5cdFx0XHRmb3IgKGxldCB0ZXh0IG9mIHVwZGF0ZVBhY2sudGV4dHMpIHtcclxuXHRcdFx0XHRpZiAodGV4dCAmJiB0ZXh0Lm1hcElkID09PSBwbGF5ZXIubWFwSWQpIHBhY2suZ2FtZS50ZXh0c1t0ZXh0LmdhbWVJZF0gPSB0ZXh0O1xyXG5cdFx0XHR9XHJcblxyXG5cclxuLyogXHRcdFx0cGFjay5nYW1lLnBsYXllcnMgPSB1cGRhdGVQYWNrLnBsYXllcnMuZmlsdGVyKHBsYXllckRhdGEgPT4gcGxheWVyRGF0YS5zb2NrZXRJZCA9PT0gcGxheWVyLnNvY2tldElkIHx8IChwbGF5ZXJEYXRhLm1hcElkID09PSBwbGF5ZXIubWFwSWQgJiYgcGxheWVyRGF0YS5pc1Zpc2libGUpKTtcclxuXHRcdFx0cGFjay5nYW1lLmJvdHMgPSB1cGRhdGVQYWNrLmJvdHMuZmlsdGVyKGJvdCA9PiBib3QubWFwSWQgPT09IHBsYXllci5tYXBJZCk7XHJcblx0XHRcdHBhY2suZ2FtZS5pdGVtcyA9IHVwZGF0ZVBhY2suaXRlbXMuZmlsdGVyKGl0ZW0gPT4gaXRlbS5tYXBJZCA9PT0gcGxheWVyLm1hcElkKTtcclxuXHRcdFx0cGFjay5nYW1lLmVmZmVjdHMgPSB1cGRhdGVQYWNrLmVmZmVjdHMuZmlsdGVyKGVmZmVjdCA9PiBlZmZlY3QubWFwSWQgPT09IHBsYXllci5tYXBJZCk7XHJcblx0XHRcdHBhY2suZ2FtZS50ZXh0cyA9IHVwZGF0ZVBhY2sudGV4dHMuZmlsdGVyKHRleHQgPT4gdGV4dC5tYXBJZCA9PT0gcGxheWVyLm1hcElkKTsgKi9cclxuXHJcblx0XHRcdHBhY2suY2hhdGJveC5tZXNzYWdlcyA9IHVwZGF0ZVBhY2subWVzc2FnZXMuZmlsdGVyKG1lc3NhZ2UgPT4ge1xyXG5cdFx0XHRcdHJldHVybiAobWVzc2FnZS5tYXBJZCA9PSBudWxsICYmIG1lc3NhZ2UuaWQgPT0gbnVsbCkgfHwgcGxheWVyLm1hcElkID09PSBtZXNzYWdlLm1hcElkIHx8IHBsYXllci5nYW1lSWQgPT09IG1lc3NhZ2UuaWQ7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRcclxuXHRcdFx0dGhpcy5zb2NrZXRMaXN0W3BsYXllci5zb2NrZXRJZF0uZW1pdCgndXBkYXRlJywgcGFjayk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0XHJcblx0c2VuZE1hcERhdGEoc29ja2V0LCBtYXBJZCkge1xyXG5cdFx0Y29uc3QgbWFwRGF0YSA9IGdhbWUubWFwc1ttYXBJZF0uZ2V0UGFjaygpO1xyXG5cdFx0c29ja2V0LmVtaXQoJ2xvYWRNYXAnLCBtYXBEYXRhKTtcclxuXHR9XHJcbn1cclxuXHJcbmNvbnN0IHNlcnZlciA9IG5ldyBTZXJ2ZXIoKTtcclxuZXhwb3J0IGRlZmF1bHQgc2VydmVyO1xyXG4iLCJmdW5jdGlvbiBjcmVhdGUyZEFycmF5KGNvbHVtbnMsIHJvd3MsIGRlZmF1bHRWYWx1ZSkge1xyXG4gIGNvbnN0IGFycmF5ID0gW107XHJcbiAgZm9yIChsZXQgeSA9IDA7IHkgPCByb3dzOyB5KyspIHtcclxuICAgIGFycmF5W3ldID0gW107XHJcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IGNvbHVtbnM7IHgrKykge1xyXG4gICAgICBhcnJheVt5XVt4XSA9IGRlZmF1bHRWYWx1ZTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGFycmF5O1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGUzZEFycmF5KGNvbHVtbnMsIHJvd3MsIGxheWVycywgZGVmYXVsdFZhbHVlKSB7XHJcbiAgY29uc3QgYXJyYXkgPSBbXTtcclxuICBmb3IgKGxldCB6ID0gMDsgeiA8IGxheWVyczsgeisrKSB7XHJcbiAgICBhcnJheVt6XSA9IFtdOyBcclxuICAgIGZvciAobGV0IHkgPSAwOyB5IDwgcm93czsgeSsrKSB7XHJcbiAgICAgIGFycmF5W3pdW3ldID0gW107XHJcbiAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgY29sdW1uczsgeCsrKSB7XHJcbiAgICAgICAgYXJyYXlbel1beV1beF0gPSBkZWZhdWx0VmFsdWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGFycmF5O1xyXG59XHJcblxyXG5mdW5jdGlvbiBzaHVmZmxlKGFycmF5KSB7XHJcbiAgbGV0IGN1cnJlbnRJbmRleCA9IGFycmF5Lmxlbmd0aDtcclxuICBsZXQgdGVtcDtcclxuICBsZXQgcmFuZG9tSW5kZXg7XHJcbiAgd2hpbGUgKGN1cnJlbnRJbmRleCAhPT0gMCkge1xyXG4gICAgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyZW50SW5kZXgpO1xyXG4gICAgY3VycmVudEluZGV4IC09IDE7XHJcbiAgICB0ZW1wID0gYXJyYXlbY3VycmVudEluZGV4XTtcclxuICAgIGFycmF5W2N1cnJlbnRJbmRleF0gPSBhcnJheVtyYW5kb21JbmRleF07XHJcbiAgICBhcnJheVtyYW5kb21JbmRleF0gPSB0ZW1wO1xyXG4gIH1cclxuICByZXR1cm4gYXJyYXk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN3YXAoYXJyYXksIGksIGopIHtcclxuICBjb25zdCB0ZW1wID0gYXJyYXlbaV07XHJcbiAgYXJyYXlbaV0gPSBhcnJheVtqXTtcclxuICBhcnJheVtqXSA9IHRlbXA7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpcnN0RW1wdHlJbmRleChhcnJheSkge1xyXG4gIGlmIChhcnJheS5sZW5ndGggPCAxKSByZXR1cm4gMDtcclxuICBcclxuICBmb3IgKGxldCBpID0gMDsgaSA8PSBhcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgaWYgKGFycmF5W2ldID09IG51bGwpIHJldHVybiBpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbGVycChzdGFydCwgZW5kLCB0aW1lKSB7XHJcbiAgLy9yZXR1cm4gc3RhcnQgKyAodGltZSAqIChlbmQgLSBzdGFydCkpO1xyXG4gIHJldHVybiAoKDEgLSB0aW1lKSAqIHN0YXJ0KSArICh0aW1lICogZW5kKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2xhbXAodmFsdWUsIG1pbmltdW0sIG1heGltdW0pIHtcclxuICBpZiAodmFsdWUgPCBtaW5pbXVtKSB7XHJcbiAgICByZXR1cm4gbWluaW11bTtcclxuICB9XHJcbiAgZWxzZSBpZiAodmFsdWUgPiBtYXhpbXVtKSB7XHJcbiAgICByZXR1cm4gbWF4aW11bTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiByYW5kb21JbnQobWluaW11bSwgbWF4aW11bSkge1xyXG4gIHJldHVybiBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogKG1heGltdW0gKyAxKSkgKyBtaW5pbXVtKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0WEZyb21JbmRleChpbmRleCwgY29sdW1ucykge1xyXG4gIHJldHVybiBpbmRleCAlIGNvbHVtbnM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFlGcm9tSW5kZXgoaW5kZXgsIGNvbHVtbnMpIHtcclxuICByZXR1cm4gKGluZGV4IC0gKGluZGV4ICUgY29sdW1ucykpIC8gY29sdW1ucztcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0SW5kZXhGcm9tWFkoeCwgeSwgY29sdW1ucykge1xyXG4gIHJldHVybiAoeSAqIGNvbHVtbnMpICsgeDtcclxufVxyXG5cclxuZnVuY3Rpb24gdGltZXN0YW1wKGRhdGUpIHtcclxuICBpZiAoIShkYXRlIGluc3RhbmNlb2YgRGF0ZSkpIHJldHVybiBcIkludmFsaWQgZGF0ZVwiO1xyXG4gIGxldCBtb250aCA9IGRhdGUuZ2V0TW9udGgoKSArIDE7XHJcbiAgbGV0IGRheSA9IGRhdGUuZ2V0RGF0ZSgpO1xyXG4gIGxldCBob3VyID0gZGF0ZS5nZXRIb3VycygpO1xyXG4gIGxldCBtaW51dGUgPSBkYXRlLmdldE1pbnV0ZXMoKTtcclxuICBsZXQgc2Vjb25kID0gZGF0ZS5nZXRTZWNvbmRzKCk7XHJcbiAgaWYgKG1vbnRoIDwgMTApIG1vbnRoID0gXCIwXCIgKyBtb250aDtcclxuICBpZiAoZGF5IDwgMTApIGRheSA9IFwiMFwiICsgZGF5O1xyXG4gIGlmIChob3VyIDwgMTApIGhvdXIgPSBcIjBcIiArIGhvdXI7XHJcbiAgaWYgKG1pbnV0ZSA8IDEwKSBtaW51dGUgPSBcIjBcIiArIG1pbnV0ZTtcclxuICBpZiAoc2Vjb25kIDwgMTApIHNlY29uZCA9IFwiMFwiICsgc2Vjb25kO1xyXG4gIHJldHVybiBgJHtkYXRlLmdldEZ1bGxZZWFyKCl9LSR7bW9udGh9LSR7ZGF5fSAke2hvdXJ9OiR7bWludXRlfToke3NlY29uZH1gO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbmRlZmluaXRlQXJ0aWNsZSh3b3JkKSB7XHJcblx0bGV0IHJlZ2V4ID0gL3Ryb3VzZXJzJHxqZWFucyR8Z2xhc3NlcyQvaTtcclxuXHRpZiAod29yZC5tYXRjaChyZWdleCkpIHJldHVybiBcImEgcGFpciBvZiBcIiArIHdvcmQ7XHJcblxyXG5cdHJlZ2V4ID0gL15bYWVpb3VdL2k7XHJcblx0aWYgKHdvcmQubWF0Y2gocmVnZXgpKSByZXR1cm4gXCJhbiBcIiArIHdvcmQ7XHJcblxyXG5cdHJldHVybiBcImEgXCIgKyB3b3JkO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwbHVyYWwod29yZCkge1xyXG5cdGxldCByZWdleCA9IC9zaGVlcCR8ZGVlciR8ZmlzaCQvaTtcclxuXHRpZiAod29yZC5tYXRjaChyZWdleCkpIHJldHVybiB3b3JkO1xyXG5cclxuXHRyZWdleCA9IC90cm91c2VycyR8amVhbnMkfGdsYXNzZXMkL2k7XHJcblx0aWYgKHdvcmQubWF0Y2gocmVnZXgpKSByZXR1cm4gXCJwYWlycyBvZiBcIiArIHdvcmQ7XHJcblx0XHJcblx0cmVnZXggPSAvc3RvbWFjaCR8ZXBvY2gkfC9pO1xyXG5cdGlmICh3b3JkLm1hdGNoKHJlZ2V4KSkgcmV0dXJuIHdvcmQgKyBcInNcIjtcclxuXHRcclxuXHRyZWdleCA9IC9mJHxmZSQvaTtcclxuXHRpZiAod29yZC5tYXRjaChyZWdleCkpIHJldHVybiB3b3JkLnJlcGxhY2UocmVnZXgsIFwidmVzXCIpO1xyXG5cclxuXHRyZWdleCA9IC9bc3h6XSR8Y2gkfHNoJHxhdG8kL2k7XHJcblx0aWYgKHdvcmQubWF0Y2gocmVnZXgpKSByZXR1cm4gd29yZCArIFwiZXNcIjtcclxuXHRcclxuXHRyZWdleCA9IC95JC9pO1xyXG5cdGlmICh3b3JkLm1hdGNoKHJlZ2V4KSkgcmV0dXJuIHdvcmQucmVwbGFjZShyZWdleCwgXCJpZXNcIik7XHJcblx0XHJcblx0cmV0dXJuIHdvcmQgKyBcInNcIjtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIGNyZWF0ZTJkQXJyYXksXHJcbiAgY3JlYXRlM2RBcnJheSxcclxuICBzaHVmZmxlLFxyXG4gIHN3YXAsXHJcbiAgZmlyc3RFbXB0eUluZGV4LFxyXG4gIGxlcnAsXHJcbiAgY2xhbXAsXHJcbiAgcmFuZG9tSW50LFxyXG4gIGdldFhGcm9tSW5kZXgsXHJcbiAgZ2V0WUZyb21JbmRleCxcclxuICBnZXRJbmRleEZyb21YWSxcclxuICB0aW1lc3RhbXAsXHJcbiAgaW5kZWZpbml0ZUFydGljbGUsXHJcbiAgcGx1cmFsXHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImJjcnlwdFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJleHByZXNzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImZzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImh0dHBcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibW9uZ29vc2VcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibm9kZS1nYW1lbG9vcFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXRoXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInNvY2tldC5pb1wiKTsiXSwic291cmNlUm9vdCI6IiJ9
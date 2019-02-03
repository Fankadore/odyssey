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
		let admin = false;
		let accounts = await this.getAllAccounts();
		if (accounts.length === 0) {
			admin = true;
		}
		else {
			let existingAccount = accounts.find(account => account.username === username)
			if (existingAccount) {
				console.log(`Account already exists with username ${username}.`);
				return false;
			}
		}

		const hashedPassword = await this.hashPassword(password);
		account = new _models_account_js__WEBPACK_IMPORTED_MODULE_4__["default"]({
			_id: new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Types.ObjectId,
			username,
			password: hashedPassword,
			email,
			verified: false,
			admin
		});

		return await account.save()
		.then(result => account._id)
		.catch(err => console.log(err));
	}
	async getAccount(accountId) {
		return await _models_account_js__WEBPACK_IMPORTED_MODULE_4__["default"].findById(accountId)
		.select('_id username password email verified admin')
		.exec()
		.then(account => account)
		.catch(err => console.log(err));
	}
	async getAccountByUsername(username) {
		return await _models_account_js__WEBPACK_IMPORTED_MODULE_4__["default"].findOne({username: username})
		.select('_id username password email verified admin')
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
	async getAllAccounts() {
		return await _models_account_js__WEBPACK_IMPORTED_MODULE_4__["default"].find({})
		.select('_id username password email verified admin')
		.exec()
		.then(accounts => accounts)
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
			account: accountId,
			template: templateId
		});

		return await player.save()
		.then(result => player._id)
		.catch(err => console.log(err));
	}
	async getPlayer(playerId) {
		return await _models_player_js__WEBPACK_IMPORTED_MODULE_5__["default"].findById(playerId)
		.select('_id account name template level experience mapId x y direction adminAccess sprite')
		.populate('template')
		.exec()
		.then(player => player)
		.catch(err => console.log(err));
	}
	async getPlayerByName(name) {
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
		.select('_id template mapId x y direction')
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
			healthRegenBase: data.healthRegenBase,
			energyRegenBase: data.energyRegenBase,
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
		.select('name sprite damageBase defenceBase healthMaxBase energyMaxBase healthRegenBase energyRegenBase rangeBase healthPerLevel, energyPerLevel')
		.exec()
		.then(template => template)
		.catch(err => console.log(err));
	}
	async getAllPlayerTemplates() {
		return await _models_playerTemplate_js__WEBPACK_IMPORTED_MODULE_6__["default"].find({})
		.select('_id name sprite damageBase defenceBase healthMaxBase energyMaxBase healthRegenBase energyRegenBase rangeBase healthPerLevel, energyPerLevel')
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
			healthRegenBase: data.healthRegenBase,
			energyRegenBase: data.energyRegenBase,
			rangeBase: data.rangeBase,
			hostile: data.hostile
		});

		return await template.save()
		.then(result => true)
		.catch(err => console.log(err));
	}
	async getBotTemplate(templateId) {
		return await _models_botTemplate_js__WEBPACK_IMPORTED_MODULE_8__["default"].findById(templateId)
		.select('_id name sprite damageBase defenceBase healthMaxBase energyMaxBase healthRegenBase energyRegenBase rangeBase hostile')
		.exec()
		.then(template => template)
		.catch(err => console.log(err));
	}
	async getAllBotTemplates() {
		return await _models_botTemplate_js__WEBPACK_IMPORTED_MODULE_8__["default"].find({})
		.select('_id name sprite damageBase defenceBase healthMaxBase energyMaxBase healthRegenBase energyRegenBase rangeBase hostile')
		.exec()
		.then(templates => templates)
		.catch(err => console.log(err));
	}

	async addItemTemplate(data) {
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

		return await template.save()
		.then(result => true)
		.catch(err => console.log(err));
	}
	async getItemTemplate(templateId) {
		return await _models_itemTemplate_js__WEBPACK_IMPORTED_MODULE_10__["default"].findById(templateId)
		.select('name sprite reusable itemType passiveDamage passiveDefence passiveHealthMax passiveEnergyMaxBase passiveHealthRegen passiveEnergyRegen passiveRange equippedDamage equippedDefence equippedHealthMax equippedEnergyMaxBase equippedHealthRegen equippedEnergyRegen equippedRange')
		.exec()
		.then(template => template)
		.catch(err => console.log(err));
	}
	async getAllItemTemplates() {
		return await _models_itemTemplate_js__WEBPACK_IMPORTED_MODULE_10__["default"].find({})
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

		return await item.save()
		.then(result => true)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL2FjdG9yLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy9ib3QuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL2VmZmVjdC5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2NsYXNzZXMvZW50aXR5LmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy9pdGVtLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy9tYXAuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL21lc3NhZ2UuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL3BsYXllci5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2NsYXNzZXMvdGV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2NvbmZpZy5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2RiLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvZ2FtZS5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2dhbWVsb29wLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL21vZGVscy9hY2NvdW50LmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvbW9kZWxzL2JvdC5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL21vZGVscy9ib3RUZW1wbGF0ZS5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL21vZGVscy9pdGVtLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvbW9kZWxzL2l0ZW1UZW1wbGF0ZS5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL21vZGVscy9pdGVtVHlwZS5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL21vZGVscy9tYXAuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9tb2RlbHMvcGxheWVyLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvbW9kZWxzL3BsYXllclRlbXBsYXRlLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvc2VydmVyLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvdXRpbC5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJiY3J5cHRcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJleHByZXNzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZnNcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJodHRwXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibW9uZ29vc2VcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJub2RlLWdhbWVsb29wXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicGF0aFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInNvY2tldC5pb1wiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxpQkFBaUIsc0JBQXNCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsbUJBQW1CO0FBQ25CO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwrREFBK0Q7O0FBRS9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxzQkFBc0I7QUFDdEIsR0FBRzs7QUFFSDs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7O0FBRUo7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTs7QUFFSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsaUJBQWlCLHFCQUFxQjtBQUN0QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBOztBQUVBLG9CQUFvQiwwRUFBOEI7QUFDbEQ7QUFDQSxrQkFBa0Isc0JBQXNCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSx1RkFBMkM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrRUFBa0U7QUFDbEU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNscUJBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHNCQUFzQjtBQUN0Qjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLDBFQUE4QjtBQUNsRDtBQUNBOztBQUVBLGlCQUFpQixzQkFBc0I7QUFDdkM7QUFDQSxxQkFBcUIsMEVBQThCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuT0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzREE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2JBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsT0FBTztBQUNQO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMvTEE7QUFDQTs7QUFFQTtBQUNBLDZCQUE2QjtBQUM3Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ3BFQTtBQUNBO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1RBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUhBQXVFLFdBQVc7QUFDbEY7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM01BO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDcEVBO0FBQUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHLHFEQUFxRDtBQUN4RCxHQUFHLHNEQUFzRDtBQUN6RCxHQUFHLGtEQUFrRDtBQUNyRCxHQUFHLGtEQUFrRDtBQUNyRCxHQUFHLGtEQUFrRDtBQUNyRCxHQUFHLGtEQUFrRDtBQUNyRCxHQUFHO0FBQ0g7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2xDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHdGQUFpRCxzQkFBc0I7O0FBRXZFO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJ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QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDcEpBLG1DOzs7Ozs7Ozs7OztBQ0FBLG9DOzs7Ozs7Ozs7OztBQ0FBLCtCOzs7Ozs7Ozs7OztBQ0FBLGlDOzs7Ozs7Ozs7OztBQ0FBLHFDOzs7Ozs7Ozs7OztBQ0FBLDBDOzs7Ozs7Ozs7OztBQ0FBLGlDOzs7Ozs7Ozs7OztBQ0FBLHNDIiwiZmlsZSI6InNlcnZlci5hcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NlcnZlci9zcmMvbWFpbi5qc1wiKTtcbiIsImltcG9ydCBnYW1lIGZyb20gJy4uL2dhbWUuanMnO1xyXG5pbXBvcnQgY29uZmlnIGZyb20gJy4uL2NvbmZpZy5qcyc7XHJcbmltcG9ydCB1dGlsIGZyb20gJy4uL3V0aWwuanMnO1xyXG5pbXBvcnQgRW50aXR5IGZyb20gJy4vZW50aXR5LmpzJztcclxuXHJcbi8vIEFuIEFjdG9yIGlzIGFuIEVudGl0eSB3aGljaCBjYW4gbW92ZSwgYXR0YWNrIGFuZCBpbnRlcmFjdCB3aXRoIGl0ZW1zXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBY3RvciBleHRlbmRzIEVudGl0eSB7XHJcblx0Y29uc3RydWN0b3IobWFwSWQsIHgsIHksIGRpcmVjdGlvbiwgbmFtZSwgc3ByaXRlKSB7XHJcblx0XHRzcHJpdGUgPSB1dGlsLmNsYW1wKHNwcml0ZSwgMSwgY29uZmlnLk1BWF9TUFJJVEVTKTtcclxuXHJcblx0XHRzdXBlcihtYXBJZCwgeCwgeSwgc3ByaXRlKTtcclxuXHRcdHRoaXMubmFtZSA9IG5hbWU7XHJcblx0XHR0aGlzLmRlc2NyaXB0aW9uID0gXCJcIjtcclxuXHJcblx0XHR0aGlzLmRpcmVjdGlvbiA9IGRpcmVjdGlvbjtcclxuXHRcdHRoaXMuc3RhcnRYID0gdGhpcy54O1xyXG5cdFx0dGhpcy5zdGFydFkgPSB0aGlzLnk7XHJcblx0XHR0aGlzLmRlc3RpbmF0aW9uWCA9IHRoaXMueDtcclxuXHRcdHRoaXMuZGVzdGluYXRpb25ZID0gdGhpcy55O1xyXG5cdFx0dGhpcy5sZXJwID0gMDtcclxuXHJcblx0XHR0aGlzLmlzTW92aW5nID0gZmFsc2U7XHJcblx0XHR0aGlzLmlzUnVubmluZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy5tb3ZlU3BlZWQgPSAyLjU7XHJcblx0XHR0aGlzLm1vdmVtZW50VGltZXIgPSAwO1xyXG5cdFx0dGhpcy5sYXppbmVzcyA9IDA7XHJcblxyXG5cdFx0dGhpcy5pc0F0dGFja2luZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy5hdHRhY2tTcGVlZCA9IDE7XHJcblx0XHR0aGlzLmF0dGFja1RpbWVyID0gMDtcdFxyXG5cdFx0dGhpcy50YXJnZXQgPSBudWxsO1xyXG5cdFx0dGhpcy5raWxscyA9IDA7XHJcblxyXG5cdFx0dGhpcy5oZWFsdGggPSB0aGlzLmhlYWx0aE1heDtcclxuXHRcdHRoaXMuZW5lcmd5ID0gdGhpcy5lbmVyZ3lNYXg7XHJcblx0XHR0aGlzLnJlZ2VuVGltZXIgPSAwO1xyXG5cdFx0dGhpcy5pc0hpdCA9IGZhbHNlO1xyXG5cdH1cclxuXHRcclxuXHQvLyBDaGFyYWN0ZXIgU3RhdHNcclxuXHRnZXQgZGFtYWdlKCkge1xyXG5cdFx0bGV0IGRhbWFnZVRvdGFsID0gdGhpcy5kYW1hZ2VCYXNlICsgdGhpcy5kYW1hZ2VCb251cztcclxuXHRcdHJldHVybiAoZGFtYWdlVG90YWwgPCAwKSA/IDAgOiBkYW1hZ2VUb3RhbDtcclxuXHR9XHJcblx0Z2V0IGRlZmVuY2UoKSB7XHJcblx0XHRsZXQgZGVmZW5jZVRvdGFsID0gdGhpcy5kZWZlbmNlQmFzZSArIHRoaXMuZGVmZW5jZUJvbnVzO1xyXG5cdFx0cmV0dXJuIChkZWZlbmNlVG90YWwgPCAwKSA/IDAgOiBkZWZlbmNlVG90YWw7XHJcblx0fVxyXG5cdGdldCBoZWFsdGhNYXgoKSB7XHJcblx0XHRsZXQgaGVhbHRoTWF4VG90YWwgPSB0aGlzLmhlYWx0aE1heEJhc2UgKyB0aGlzLmhlYWx0aE1heEJvbnVzXHJcblx0XHRyZXR1cm4gKGhlYWx0aE1heFRvdGFsIDwgMSkgPyAxIDogaGVhbHRoTWF4VG90YWw7XHJcblx0fVxyXG5cdGdldCBlbmVyZ3lNYXgoKSB7XHJcblx0XHRsZXQgZW5lcmd5TWF4VG90YWwgPSB0aGlzLmVuZXJneU1heEJhc2UgKyB0aGlzLmVuZXJneU1heEJvbnVzO1xyXG5cdFx0cmV0dXJuIChlbmVyZ3lNYXhUb3RhbCA8IDApID8gMCA6IGVuZXJneU1heFRvdGFsO1xyXG5cdH1cclxuXHRnZXQgaGVhbHRoUmVnZW4oKSB7XHJcblx0XHRsZXQgaGVhbHRoUmVnZW5Ub3RhbCA9IHRoaXMuaGVhbHRoUmVnZW5CYXNlICsgdGhpcy5oZWFsdGhSZWdlbkJvbnVzXHJcblx0XHRyZXR1cm4gKGhlYWx0aFJlZ2VuVG90YWwgPCAxKSA/IDEgOiBoZWFsdGhSZWdlblRvdGFsO1xyXG5cdH1cclxuXHRnZXQgZW5lcmd5UmVnZW4oKSB7XHJcblx0XHRsZXQgZW5lcmd5UmVnZW5Ub3RhbCA9IHRoaXMuZW5lcmd5UmVnZW5CYXNlICsgdGhpcy5lbmVyZ3lSZWdlbkJvbnVzO1xyXG5cdFx0cmV0dXJuIChlbmVyZ3lSZWdlblRvdGFsIDwgMCkgPyAwIDogZW5lcmd5UmVnZW5Ub3RhbDtcclxuXHR9XHJcblx0Z2V0IHJhbmdlKCkge1xyXG5cdFx0bGV0IHJhbmdlVG90YWwgPSB0aGlzLnJhbmdlQmFzZSArIHRoaXMucmFuZ2VCb251cztcclxuXHRcdHJldHVybiAocmFuZ2VUb3RhbCA8IDEpID8gMSA6IHJhbmdlVG90YWw7XHJcblx0fVxyXG5cclxuXHRjYWxjQmFzZVN0YXRzKHRlbXBsYXRlKSB7XHJcblx0XHR0aGlzLmRhbWFnZUJhc2UgPSB0ZW1wbGF0ZS5kYW1hZ2VCYXNlIHx8IDE7XHJcblx0XHR0aGlzLmRlZmVuY2VCYXNlID0gdGVtcGxhdGUuZGVmZW5jZUJhc2UgfHwgMDtcclxuXHRcdHRoaXMuaGVhbHRoTWF4QmFzZSA9IHRlbXBsYXRlLmhlYWx0aE1heEJhc2UgKyAodGVtcGxhdGUuaGVhbHRoUGVyTGV2ZWwgKiAodGhpcy5sZXZlbCAtIDEpKSB8fCAxO1xyXG5cdFx0dGhpcy5lbmVyZ3lNYXhCYXNlID0gdGVtcGxhdGUuZW5lcmd5TWF4QmFzZSArICh0ZW1wbGF0ZS5lbmVyZ3lQZXJMZXZlbCAqICh0aGlzLmxldmVsIC0gMSkpIHx8IDE7XHJcblx0XHR0aGlzLmhlYWx0aFJlZ2VuQmFzZSA9IHRlbXBsYXRlLmhlYWx0aFJlZ2VuQmFzZSB8fCAxO1xyXG5cdFx0dGhpcy5lbmVyZ3lSZWdlbkJhc2UgPSB0ZW1wbGF0ZS5lbmVyZ3lSZWdlbkJhc2UgfHwgMTtcclxuXHRcdHRoaXMucmFuZ2VCYXNlID0gdGVtcGxhdGUucmFuZ2VCYXNlIHx8IDE7XHJcblx0fVxyXG5cclxuXHRjYWxjSXRlbUJvbnVzKCkge1xyXG5cdFx0Y29uc3QgaXRlbUJvbnVzID0ge1xyXG5cdFx0XHRkYW1hZ2U6IDAsXHJcblx0XHRcdGRlZmVuY2U6IDAsXHJcblx0XHRcdGhlYWx0aE1heDogMCxcclxuXHRcdFx0ZW5lcmd5TWF4OiAwLFxyXG5cdFx0XHRoZWFsdGhSZWdlbjogMCxcclxuXHRcdFx0ZW5lcmd5UmVnZW46IDAsXHJcblx0XHRcdHJhbmdlOiAwXHJcblx0XHR9O1xyXG5cclxuXHRcdGNvbnN0IGludmVudG9yeSA9IHRoaXMuZ2V0SW52ZW50b3J5KCk7XHJcblxyXG5cdFx0Ly8gRm9yIGVhY2ggaXRlbSBpbiBpbnZlbnRvcnkgY2hlY2sgZm9yIGJvbnVzZXNcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgaW52ZW50b3J5Lmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IGl0ZW0gPSBpbnZlbnRvcnlbaV07XHJcblx0XHRcdGl0ZW1Cb251cy5kYW1hZ2UgKz0gaXRlbS5wYXNzaXZlLmRhbWFnZTtcclxuXHRcdFx0aXRlbUJvbnVzLmRlZmVuY2UgKz0gaXRlbS5wYXNzaXZlLmRlZmVuY2U7XHJcblx0XHRcdGl0ZW1Cb251cy5oZWFsdGhNYXggKz0gaXRlbS5wYXNzaXZlLmhlYWx0aE1heDtcclxuXHRcdFx0aXRlbUJvbnVzLmVuZXJneU1heCArPSBpdGVtLnBhc3NpdmUuZW5lcmd5TWF4O1xyXG5cdFx0XHRpdGVtQm9udXMuaGVhbHRoUmVnZW4gKz0gaXRlbS5wYXNzaXZlLmhlYWx0aFJlZ2VuO1xyXG5cdFx0XHRpdGVtQm9udXMuZW5lcmd5UmVnZW4gKz0gaXRlbS5wYXNzaXZlLmVuZXJneVJlZ2VuO1xyXG5cdFx0XHRpdGVtQm9udXMucmFuZ2UgKz0gaXRlbS5wYXNzaXZlLnJhbmdlO1xyXG5cclxuXHRcdFx0aWYgKGl0ZW0uc2xvdCA+PSBjb25maWcuSU5WRU5UT1JZX1NJWkUpIHtcclxuXHRcdFx0XHRpdGVtQm9udXMuZGFtYWdlICs9IGl0ZW0uZXF1aXBwZWQuZGFtYWdlO1xyXG5cdFx0XHRcdGl0ZW1Cb251cy5kZWZlbmNlICs9IGl0ZW0uZXF1aXBwZWQuZGVmZW5jZTtcclxuXHRcdFx0XHRpdGVtQm9udXMuaGVhbHRoTWF4ICs9IGl0ZW0uZXF1aXBwZWQuaGVhbHRoTWF4O1xyXG5cdFx0XHRcdGl0ZW1Cb251cy5lbmVyZ3lNYXggKz0gaXRlbS5lcXVpcHBlZC5lbmVyZ3lNYXg7XHJcblx0XHRcdFx0aXRlbUJvbnVzLmhlYWx0aFJlZ2VuICs9IGl0ZW0uZXF1aXBwZWQuaGVhbHRoUmVnZW47XHJcblx0XHRcdFx0aXRlbUJvbnVzLmVuZXJneVJlZ2VuICs9IGl0ZW0uZXF1aXBwZWQuZW5lcmd5UmVnZW47XHJcblx0XHRcdFx0aXRlbUJvbnVzLnJhbmdlICs9IGl0ZW0uZXF1aXBwZWQucmFuZ2U7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIGl0ZW1Cb251cztcclxuXHR9XHJcblxyXG5cdGNhbGNFZmZlY3RCb251cygpIHtcclxuXHRcdGNvbnN0IGVmZmVjdEJvbnVzID0ge1xyXG5cdFx0XHRkYW1hZ2U6IDAsXHJcblx0XHRcdGRlZmVuY2U6IDAsXHJcblx0XHRcdGhlYWx0aE1heDogMCxcclxuXHRcdFx0ZW5lcmd5TWF4OiAwLFxyXG5cdFx0XHRoZWFsdGhSZWdlbjogMCxcclxuXHRcdFx0ZW5lcmd5UmVnZW46IDAsXHJcblx0XHRcdHJhbmdlOiAwXHJcblx0XHR9O1xyXG5cclxuXHRcdC8vIFRPRE86IHdvcmsgb3V0IGhvdyB0byBkbyBlZmZlY3RzIGZvciBzcGVsbHMgYW5kIHBvdGlvbnNcclxuXHRcdHJldHVybiBlZmZlY3RCb251cztcclxuXHR9XHJcblx0XHJcblx0Y2FsY0JvbnVzU3RhdHMoKSB7XHQvLyBJdGVtcyAoZXF1aXBwZWQgYW5kIHBhc3NpdmUpIGFuZCBFZmZlY3RzIChzcGVsbHMgYW5kIHBvdGlvbnMpXHJcblx0XHRjb25zdCBpdGVtQm9udXMgPSB0aGlzLmNhbGNJdGVtQm9udXMoKTtcclxuXHRcdGNvbnN0IGVmZmVjdEJvbnVzID0gdGhpcy5jYWxjRWZmZWN0Qm9udXMoKTtcclxuXHJcblx0XHR0aGlzLmRhbWFnZUJvbnVzID0gaXRlbUJvbnVzLmRhbWFnZSArIGVmZmVjdEJvbnVzLmRhbWFnZTtcclxuXHRcdHRoaXMuZGVmZW5jZUJvbnVzID0gaXRlbUJvbnVzLmRlZmVuY2UgKyBlZmZlY3RCb251cy5kZWZlbmNlO1xyXG5cdFx0dGhpcy5oZWFsdGhNYXhCb251cyA9IGl0ZW1Cb251cy5oZWFsdGhNYXggKyBlZmZlY3RCb251cy5oZWFsdGhNYXg7XHJcblx0XHR0aGlzLmVuZXJneU1heEJvbnVzID0gaXRlbUJvbnVzLmVuZXJneU1heCArIGVmZmVjdEJvbnVzLmVuZXJneU1heDtcclxuXHRcdHRoaXMuaGVhbHRoUmVnZW5Cb251cyA9IGl0ZW1Cb251cy5oZWFsdGhSZWdlbiArIGVmZmVjdEJvbnVzLmhlYWx0aFJlZ2VuO1xyXG5cdFx0dGhpcy5lbmVyZ3lSZWdlbkJvbnVzID0gaXRlbUJvbnVzLmVuZXJneVJlZ2VuICsgZWZmZWN0Qm9udXMuZW5lcmd5UmVnZW47XHJcblx0XHR0aGlzLnJhbmdlQm9udXMgPSBpdGVtQm9udXMucmFuZ2UgKyBlZmZlY3RCb251cy5yYW5nZTtcclxuXHR9XHJcblxyXG5cdGNhbGNTdGF0cygpIHtcclxuXHRcdHRoaXMuY2FsY0Jhc2VTdGF0cygpO1xyXG5cdFx0dGhpcy5jYWxjQm9udXNTdGF0cygpO1xyXG5cdH1cclxuXHJcblx0cmVzdG9yZSgpIHtcclxuXHRcdHRoaXMuaGVhbHRoID0gdGhpcy5oZWFsdGhNYXg7XHJcblx0XHR0aGlzLmVuZXJneSA9IHRoaXMuZW5lcmd5TWF4O1xyXG5cdH1cclxuXHRcclxuXHRpbnB1dERhdGEoKSB7XHJcblx0XHQvLyBTZWUgUGxheWVyIGFuZCBCb3QgY2xhc3Nlc1xyXG5cdH1cclxuXHJcblx0Ly8gTW92ZW1lbnRcclxuXHRtb3ZlKGRpcmVjdGlvbikge1xyXG5cdFx0aWYgKHRoaXMuaXNNb3ZpbmcpIHJldHVybjtcclxuXHJcblx0XHRpZiAoZGlyZWN0aW9uKSB0aGlzLmRpcmVjdGlvbiA9IGRpcmVjdGlvbjtcclxuXHJcblx0XHRpZiAoZGlyZWN0aW9uID09PSAnbGVmdCcpIHtcclxuXHRcdFx0aWYgKCFnYW1lLmlzVmFjYW50KHRoaXMubWFwSWQsIHRoaXMueCAtIDEsIHRoaXMueSkpIHJldHVybjtcclxuXHRcdFx0dGhpcy5kZXN0aW5hdGlvblgtLTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ3JpZ2h0Jykge1xyXG5cdFx0XHRpZiAoIWdhbWUuaXNWYWNhbnQodGhpcy5tYXBJZCwgdGhpcy54ICsgMSwgdGhpcy55KSkgcmV0dXJuO1xyXG5cdFx0XHR0aGlzLmRlc3RpbmF0aW9uWCsrO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoZGlyZWN0aW9uID09PSAndXAnKSB7XHJcblx0XHRcdGlmICghZ2FtZS5pc1ZhY2FudCh0aGlzLm1hcElkLCB0aGlzLngsIHRoaXMueSAtIDEpKSByZXR1cm47XHJcblx0XHRcdHRoaXMuZGVzdGluYXRpb25ZLS07XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdkb3duJykge1xyXG5cdFx0XHRpZiAoIWdhbWUuaXNWYWNhbnQodGhpcy5tYXBJZCwgdGhpcy54LCB0aGlzLnkgKyAxKSkgcmV0dXJuO1xyXG5cdFx0XHR0aGlzLmRlc3RpbmF0aW9uWSsrO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHN3aXRjaCAodXRpbC5yYW5kb21JbnQoMCwgMyArIHRoaXMubGF6aW5lc3MpKSB7XHJcblx0XHRcdFx0Y2FzZSAwOiB0aGlzLm1vdmUoJ2xlZnQnKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIDE6IHRoaXMubW92ZSgncmlnaHQnKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIDI6IHRoaXMubW92ZSgndXAnKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIDM6IHRoaXMubW92ZSgnZG93bicpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGRlZmF1bHQ6IC8vIERvbid0IE1vdmVcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gU2V0IG1vdmUgc3BlZWRcclxuXHRcdGlmICh0aGlzLmlzUnVubmluZykge1xyXG5cdFx0XHRpZiAodGhpcy5lbmVyZ3kgPiAwKSB7XHJcblx0XHRcdFx0dGhpcy5lbmVyZ3ktLTtcclxuXHRcdFx0XHR0aGlzLm1vdmVTcGVlZCA9IDQ7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5lbmVyZ3kgPSAwO1xyXG5cdFx0XHRcdHRoaXMubW92ZVNwZWVkID0gMi41O1xyXG5cdFx0XHRcdHRoaXMuaXNSdW5uaW5nID0gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHR0aGlzLm1vdmVTcGVlZCA9IDIuNTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dGhpcy5pc01vdmluZyA9IHRydWU7XHJcblx0fVxyXG5cdFxyXG5cdG1vdmVUb1RhcmdldCh0YXJnZXQsIGhvc3RpbGUpIHtcclxuXHRcdGlmICghdGFyZ2V0KSByZXR1cm47XHJcblx0XHRcclxuXHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICYmIHRhcmdldC55ID09PSB0aGlzLnkpIHtcclxuXHRcdFx0dGhpcy5tb3ZlKCk7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmICh1dGlsLnJhbmRvbUludCgwLCAxKSA9PT0gMCkge1xyXG5cdFx0XHRpZiAodGFyZ2V0LnggPCB0aGlzLngpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LnggPj0gKHRoaXMueCAtIHRoaXMucmFuZ2UpICYmIHRhcmdldC55ID09PSB0aGlzLnkpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlICYmICF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ2xlZnQnO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmF0dGFjaygnbGVmdCcpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSgnbGVmdCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICh0YXJnZXQueCA+IHRoaXMueCkge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICsgdGhpcy5yYW5nZSAmJiB0YXJnZXQueSA9PT0gdGhpcy55KSB7XHJcblx0XHRcdFx0XHRpZiAoaG9zdGlsZSAmJiAhdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdyaWdodCc7XHJcblx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCdyaWdodCcpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSgncmlnaHQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodGFyZ2V0LnkgPCB0aGlzLnkpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LnggPT09IHRoaXMueCAmJiB0YXJnZXQueSA9PT0gdGhpcy55IC0gdGhpcy5yYW5nZSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUgJiYgIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAndXAnO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmF0dGFjaygndXAnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ3VwJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHRhcmdldC55ID4gdGhpcy55KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggJiYgdGFyZ2V0LnkgPT09IHRoaXMueSArIHRoaXMucmFuZ2UpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlICYmICF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ2Rvd24nO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmF0dGFjaygnZG93bicpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSgnZG93bicpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGlmICh0YXJnZXQueSA+IHRoaXMueSkge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICYmIHRhcmdldC55ID09PSB0aGlzLnkgKyB0aGlzLnJhbmdlKSB7XHJcblx0XHRcdFx0XHRpZiAoaG9zdGlsZSAmJiAhdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdkb3duJztcclxuXHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ2Rvd24nKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ2Rvd24nKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodGFyZ2V0LnkgPCB0aGlzLnkpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LnggPT09IHRoaXMueCAmJiB0YXJnZXQueSA9PT0gdGhpcy55IC0gdGhpcy5yYW5nZSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUgJiYgIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAndXAnO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmF0dGFjaygndXAnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ3VwJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHRhcmdldC54ID4gdGhpcy54KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggKyB0aGlzLnJhbmdlICYmIHRhcmdldC55ID09PSB0aGlzLnkpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlICYmICF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ3JpZ2h0JztcclxuXHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ3JpZ2h0Jyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCdyaWdodCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICh0YXJnZXQueCA8IHRoaXMueCkge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQueCA+PSAodGhpcy54IC0gdGhpcy5yYW5nZSkgJiYgdGFyZ2V0LnkgPT09IHRoaXMueSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUgJiYgIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnbGVmdCc7XHJcblx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCdsZWZ0Jyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCdsZWZ0Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdC8vIENvbWJhdFxyXG5cdGNoZWNrSW5SYW5nZShkaXJlY3Rpb24sIHRhcmdldCwgcmFuZ2UpIHtcclxuXHRcdGlmICh0YXJnZXQubWFwSWQgIT09IHRoaXMubWFwSWQpIHJldHVybiBmYWxzZTtcclxuXHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICYmIHRhcmdldC55ID09PSB0aGlzLnkpIHJldHVybiBmYWxzZTtcdC8vIFN0YWNrZWQgZG9lcyBub3QgY291bnQgYXMgaW4gcmFuZ2VcclxuXHRcdFxyXG5cdFx0aWYgKHRhcmdldC55ID09PSB0aGlzLnkpIHtcclxuXHRcdFx0aWYgKGRpcmVjdGlvbiA9PT0gJ2xlZnQnKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMueCA9PT0gMCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHJldHVybiAodGFyZ2V0LnggPCB0aGlzLnggJiYgdGFyZ2V0LnggPj0gKHRoaXMueCAtIHJhbmdlKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ3JpZ2h0Jykge1xyXG5cdFx0XHRcdGlmICh0aGlzLnggPT09IGNvbmZpZy5NQVBfQ09MVU1OUyAtIDEpIHtcclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gKHRhcmdldC54ID4gdGhpcy54ICYmIHRhcmdldC54IDw9ICh0aGlzLnggKyByYW5nZSkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAodGFyZ2V0LnggPT09IHRoaXMueCkge1xyXG5cdFx0XHRpZiAoZGlyZWN0aW9uID09PSAndXAnKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMueSA9PT0gMCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHJldHVybiAodGFyZ2V0LnkgPCB0aGlzLnkgJiYgdGFyZ2V0LnkgPj0gKHRoaXMueSAtIHJhbmdlKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ2Rvd24nKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMueSA9PT0gY29uZmlnLk1BUF9ST1dTIC0gMSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHJldHVybiAodGFyZ2V0LnkgPiB0aGlzLnkgJiYgdGFyZ2V0LnkgPD0gKHRoaXMueSArIHJhbmdlKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblxyXG5cdGF0dGFjayhudW1UYXJnZXRzID0gMSwgZGlyZWN0aW9uID0gdGhpcy5kaXJlY3Rpb24pIHtcclxuXHRcdGlmICh0aGlzLmlzQXR0YWNraW5nIHx8IHRoaXMuYXR0YWNrVGltZXIgPiAwKSByZXR1cm47XHJcblxyXG5cdFx0dGhpcy5pc0F0dGFja2luZyA9IHRydWU7XHJcblx0XHRcclxuXHRcdGNvbnN0IHBsYXllckxpc3QgPSBnYW1lLnBsYXllcnMuZmlsdGVyKHBsYXllciA9PiBwbGF5ZXIubWFwSWQgPT09IHRoaXMubWFwSWQpO1xyXG5cdFx0Y29uc3QgYm90TGlzdCA9IGdhbWUuYm90cy5maWx0ZXIoYm90ID0+IGJvdC5tYXBJZCA9PT0gdGhpcy5tYXBJZCk7XHJcblx0XHRjb25zdCBhY3Rvckxpc3QgPSBwbGF5ZXJMaXN0LmNvbmNhdChib3RMaXN0KTtcclxuXHRcdGxldCB0YXJnZXRMaXN0ID0gYWN0b3JMaXN0LmZpbHRlcihhY3RvciA9PiB7XHJcblx0XHRcdHJldHVybiBhY3RvciAhPT0gdGhpcyAmJiAhYWN0b3IuaXNEZWFkICYmIHRoaXMuY2hlY2tJblJhbmdlKGRpcmVjdGlvbiwgYWN0b3IsIHRoaXMucmFuZ2UpO1xyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcdHRhcmdldExpc3Quc29ydCgoYSwgYikgPT4ge1xyXG5cdFx0XHRyZXR1cm4gKGEueiAtIGIueik7XHQvLyBMb3dlc3QgdG8gaGlnaGVzdFxyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcdHRhcmdldExpc3QgPSB0YXJnZXRMaXN0LnNwbGljZSgtbnVtVGFyZ2V0cyk7XHJcblx0XHRcclxuXHRcdHRhcmdldExpc3QuZm9yRWFjaCgodGFyZ2V0KSA9PiB7XHJcblx0XHRcdHRhcmdldC50YWtlRGFtYWdlKHRoaXMuZGFtYWdlLCB0aGlzKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRcclxuXHR0YWtlRGFtYWdlKGRhbWFnZSwgYXR0YWNrZXIpIHtcclxuXHRcdGRhbWFnZSAtPSB0aGlzLmRlZmVuY2U7XHJcblx0XHRpZiAoZGFtYWdlIDwgMCkgZGFtYWdlID0gMDtcclxuXHRcdGdhbWUuc3Bhd25EYW1hZ2VUZXh0KHRoaXMubWFwSWQsIHRoaXMueCwgdGhpcy55LCBkYW1hZ2UpO1xyXG5cdFx0aWYgKGRhbWFnZSA9PT0gMCkgcmV0dXJuO1xyXG5cdFx0XHJcblx0XHR0aGlzLmlzSGl0ID0gdHJ1ZTtcclxuXHRcdHRoaXMuaGVhbHRoIC09IGRhbWFnZTtcclxuXHJcblx0XHRpZiAodGhpcy5oZWFsdGggPD0gMCkge1xyXG5cdFx0XHR0aGlzLnNldERlYWQoKTtcclxuXHRcdFx0XHJcblx0XHRcdGlmICghYXR0YWNrZXIpIHtcclxuXHRcdFx0XHRnYW1lLnNlbmRHYW1lSW5mb0dsb2JhbCh0aGlzLm5hbWUgKyBcIiBoYXMgZGllZCFcIik7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRhdHRhY2tlci5raWxscysrO1xyXG5cdFx0XHRpZiAoYXR0YWNrZXIudGFyZ2V0ID09PSB0aGlzKSBhdHRhY2tlci50YXJnZXQgPSBudWxsO1xyXG5cdFx0XHRpZiAodGhpcy5wbGF5ZXJJZCkge1xyXG5cdFx0XHRcdGlmIChhdHRhY2tlci5wbGF5ZXJJZCkgZ2FtZS5zZW5kR2FtZUluZm9HbG9iYWwoYXR0YWNrZXIubmFtZSArIFwiIGhhcyBtdXJkZXJlZCBcIiArIHRoaXMubmFtZSArIFwiIGluIGNvbGQgYmxvb2QhXCIpO1xyXG5cdFx0XHRcdGVsc2UgZ2FtZS5zZW5kR2FtZUluZm9HbG9iYWwodGhpcy5uYW1lICsgXCIgaGFzIGJlZW4ga2lsbGVkIGJ5IFwiICsgYXR0YWNrZXIubmFtZSArIFwiIVwiKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cdFxyXG5cclxuXHRzZXREZWFkKCkge1xyXG5cdFx0Y29uc3QgbWFwID0gZ2FtZS5tYXBzW3RoaXMubWFwSWRdO1xyXG5cdFx0Y29uc3QgaW52ZW50b3J5ID0gdGhpcy5nZXRJbnZlbnRvcnkoKTtcclxuXHJcblx0XHQvLyBJbnZlbnRvcnkgSXRlbSBEcm9wIENoYW5jZVxyXG5cdFx0Y29uc3QgZHJvcENoYW5jZSA9IHV0aWwuY2xhbXAobWFwLmRyb3BDaGFuY2UsIDAsIDEwMCk7XHJcblx0XHRpZiAoZHJvcENoYW5jZSA+IDApIHtcclxuXHRcdFx0Y29uc3QgaXRlbXMgPSBpbnZlbnRvcnkuZmlsdGVyKGl0ZW0gPT4ge1xyXG5cdFx0XHRcdHJldHVybiBpdGVtLnNsb3QgPCBjb25maWcuSU5WRU5UT1JZX1NJWkU7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0aXRlbXMuZm9yRWFjaChpdGVtID0+IHtcclxuXHRcdFx0XHRpZiAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAxKSA8PSBkcm9wQ2hhbmNlKSB7XHJcblx0XHRcdFx0XHRpdGVtLm1vdmVUb01hcCh0aGlzLm1hcElkLCB0aGlzLngsIHRoaXMueSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0dGhpcy5jYWxjQm9udXNTdGF0cygpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEVxdWlwcGVkIEl0ZW0gRHJvcCBBbW91bnRcclxuXHRcdGNvbnN0IGRyb3BBbW91bnRFUSA9IHV0aWwuY2xhbXAobWFwLmRyb3BBbW91bnRFUSwgMCwgY29uZmlnLkVRVUlQTUVOVF9TSVpFKTtcclxuXHRcdGlmIChkcm9wQW1vdW50RVEgPiAwKSB7XHJcblx0XHRcdGxldCBlcXVpcG1lbnQgPSBpbnZlbnRvcnkuZmlsdGVyKGl0ZW0gPT4ge1xyXG5cdFx0XHRcdHJldHVybiBpdGVtLnNsb3QgPj0gY29uZmlnLklOVkVOVE9SWV9TSVpFO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdGVxdWlwbWVudCA9IHV0aWwuc2h1ZmZsZShlcXVpcG1lbnQpO1xyXG5cdFx0XHRlcXVpcG1lbnQuc3BsaWNlKC1kcm9wQW1vdW50RVEpO1xyXG5cdFx0XHRlcXVpcG1lbnQuZm9yRWFjaChpdGVtID0+IHtcclxuXHRcdFx0XHRpdGVtLm1vdmVUb01hcCh0aGlzLm1hcElkLCB0aGlzLngsIHRoaXMueSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHR0aGlzLmNhbGNCb251c1N0YXRzKCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdC8vIEludmVudG9yeVxyXG5cdHBpY2tVcCgpIHtcclxuXHRcdGNvbnN0IG1hcEl0ZW1zID0gZ2FtZS5pdGVtcy5maWx0ZXIoaXRlbSA9PiB7XHJcblx0XHRcdHJldHVybiBpdGVtLm1hcElkID09PSB0aGlzLm1hcElkICYmIGl0ZW0ueCA9PT0gdGhpcy54ICYmIGl0ZW0ueSA9PT0gdGhpcy55O1xyXG5cdFx0fSk7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IG1hcEl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IGl0ZW0gPSBtYXBJdGVtc1tpXTtcclxuXHRcdFx0aWYgKCFpdGVtKSBjb250aW51ZTtcclxuXHRcdFx0XHJcblx0XHRcdGlmIChpdGVtLnN0YWNrYWJsZSkge1xyXG5cdFx0XHRcdGNvbnN0IGludmVudG9yeSA9IHRoaXMuZ2V0SW52ZW50b3J5KCk7XHJcblx0XHRcdFx0aWYgKGludmVudG9yeS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRjb25zdCBzYW1lSXRlbXMgPSBpbnZlbnRvcnkuZmlsdGVyKGludmVudG9yeUl0ZW0gPT4ge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gaW52ZW50b3J5SXRlbS50ZW1wbGF0ZUlkID09PSBpdGVtLnRlbXBsYXRlSWQ7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdGlmIChzYW1lSXRlbXMubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRzYW1lSXRlbXNbMF0uc3RhY2sgKz0gaXRlbS5zdGFjaztcclxuXHRcdFx0XHRcdFx0aXRlbS5yZW1vdmUoKTtcclxuXHRcdFx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb25zdCBzbG90ID0gdGhpcy5maW5kRmlyc3RFbXB0eVNsb3QoKTtcclxuXHRcdFx0aWYgKHNsb3QgPT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdFx0aXRlbS5tb3ZlVG9JbnZlbnRvcnkodGhpcy5wbGF5ZXJJZCwgdGhpcy5ib3RJZCwgc2xvdCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRnZXRJbnZlbnRvcnkoKSB7XHJcblx0XHQvLyBTZWUgUGxheWVyIGFuZCBCb3QgY2xhc3Nlc1xyXG5cdH1cclxuXHJcblx0Z2V0SXRlbShzbG90KSB7XHJcblx0XHRjb25zdCBpbnZlbnRvcnkgPSB0aGlzLmdldEludmVudG9yeSgpO1xyXG5cdFx0Y29uc3QgaXRlbXMgPSBpbnZlbnRvcnkuZmlsdGVyKGl0ZW0gPT4ge1xyXG5cdFx0XHRyZXR1cm4gaXRlbS5zbG90ID09PSBzbG90O1xyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gaXRlbXNbMF07XHJcblx0fVxyXG5cclxuXHRoYXNJdGVtKHRlbXBsYXRlSWQpIHtcclxuXHRcdGNvbnN0IGludmVudG9yeSA9IHRoaXMuZ2V0SW52ZW50b3J5KCk7XHJcblx0XHRjb25zdCBpdGVtcyA9IGdhbWUuaXRlbXMuZmlsdGVyKGl0ZW0gPT4ge1xyXG5cdFx0XHRyZXR1cm4gaXRlbS50ZW1wbGF0ZUlkID09PSB0ZW1wbGF0ZUlkO1xyXG5cdFx0fSk7XHJcblx0XHRpZiAoaXRlbXNbMF0uc3RhY2thYmxlKSB7XHJcblx0XHRcdHJldHVybiBpdGVtc1swXS5zdGFjaztcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gaXRlbXMubGVuZ3RoO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZmluZEl0ZW1TbG90KHRlbXBsYXRlSWQpIHtcclxuXHRcdGNvbnN0IGludmVudG9yeSA9IHRoaXMuZ2V0SW52ZW50b3J5KCk7XHJcblx0XHRjb25zdCBpdGVtcyA9IGludmVudG9yeS5maWx0ZXIoaXRlbSA9PiB7XHJcblx0XHRcdHJldHVybiBpdGVtLnRlbXBsYXRlSWQgPT09IHRlbXBsYXRlSWQ7XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBpdGVtc1swXS5zbG90O1xyXG5cdH1cclxuXHJcblx0ZmluZEZpcnN0RW1wdHlTbG90KCkge1xyXG5cdFx0Y29uc3QgaW52ZW50b3J5ID0gdGhpcy5nZXRJbnZlbnRvcnkoKTtcclxuXHJcblx0XHRmb3IgKGxldCBzbG90ID0gMDsgc2xvdCA8IGNvbmZpZy5JTlZFTlRPUllfU0laRTsgc2xvdCsrKSB7XHJcblx0XHRcdGxldCBvY2N1cGllZCA9IGZhbHNlO1xyXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGludmVudG9yeS5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdGlmIChpbnZlbnRvcnlbaV0uc2xvdCA9PT0gc2xvdCkge1xyXG5cdFx0XHRcdFx0b2NjdXBpZWQgPSB0cnVlO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICghb2NjdXBpZWQpIHJldHVybiBzbG90O1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fVxyXG5cclxuXHR1c2VJdGVtKHNsb3QpIHtcclxuXHRcdGNvbnN0IGl0ZW0gPSB0aGlzLmdldEl0ZW0oc2xvdCk7XHJcblx0XHRpZiAoIWl0ZW0pIHJldHVybjtcclxuXHJcblx0XHQvLyBUT0RPOiBpZiAoIXVzZVNjcmlwdCgpKSByZXR1cm47XHJcblxyXG5cdFx0aWYgKGl0ZW0uaXNFcXVpcG1lbnQoKSkge1xyXG5cdFx0XHRpZiAoaXRlbS5zbG90IDwgY29uZmlnLklOVkVOVE9SWV9TSVpFKSB7XHQvLyBDaGVjayBpZiBpdGVtIGlzIGVxdWlwcGVkXHJcblx0XHRcdFx0dGhpcy5lcXVpcEl0ZW0oaXRlbSk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMudW5lcXVpcEl0ZW0oaXRlbSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIWl0ZW0ucmV1c2FibGUpIGl0ZW0ucmVtb3ZlT25lKCk7XHJcblx0fVxyXG5cclxuXHRkcm9wSXRlbShzbG90KSB7XHJcblx0XHRjb25zdCBpdGVtID0gdGhpcy5nZXRJdGVtKHNsb3QpO1xyXG5cdFx0aWYgKCFpdGVtKSByZXR1cm47XHJcblx0XHRpdGVtLm1vdmVUb01hcCh0aGlzLm1hcElkLCB0aGlzLngsIHRoaXMueSk7XHJcblx0XHR0aGlzLmNhbGNCb251c1N0YXRzKCk7XHJcblx0fVxyXG5cclxuXHRtb3ZlSXRlbVRvU2xvdChzbG90LCBuZXdTbG90KSB7XHJcblx0XHRpZiAoc2xvdCA9PSBudWxsIHx8IG5ld1Nsb3QgPT0gbnVsbCB8fCBzbG90ID09PSBuZXdTbG90KSByZXR1cm47XHQvLyBudWxsID09IHVuZGVmaW5lZCwgbnVsbCAhPSAwXHJcblx0XHRpZiAoc2xvdCA8IDAgfHwgc2xvdCA+PSBjb25maWcuSU5WRU5UT1JZX1NJWkUgKyBjb25maWcuRVFVSVBNRU5UX1NJWkUpIHJldHVybjtcclxuXHRcdGlmIChuZXdTbG90IDwgMCB8fCBuZXdTbG90ID49IGNvbmZpZy5JTlZFTlRPUllfU0laRSArIGNvbmZpZy5FUVVJUE1FTlRfU0laRSkgcmV0dXJuO1xyXG5cclxuXHRcdGNvbnN0IGl0ZW0gPSB0aGlzLmdldEl0ZW0oc2xvdCk7XHJcblx0XHRjb25zdCBuZXdJdGVtID0gdGhpcy5nZXRJdGVtKG5ld1Nsb3QpO1xyXG5cdFx0aWYgKCFpdGVtKSByZXR1cm47XHJcblxyXG5cdFx0Ly8gVGFyZ2V0IHNsb3QgaXMgZm9yIGVxdWlwbWVudCAtIGNoZWNrIHR5cGUgbWF0Y2hlc1xyXG5cdFx0aWYgKG5ld1Nsb3QgPj0gY29uZmlnLklOVkVOVE9SWV9TSVpFKSB7XHJcblx0XHRcdGlmIChpdGVtLmVxdWlwcGVkU2xvdCArIGNvbmZpZy5JTlZFTlRPUllfU0laRSAhPT0gbmV3U2xvdCkge1xyXG5cdFx0XHRcdGdhbWUuc2VuZEdhbWVJbmZvUGxheWVyKHRoaXMuaWQsIFwiVGhhdCBjYW5ub3QgYmUgZXF1aXBwZWQgdGhlcmUuXCIpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHN3YXBTbG90cyA9ICgpID0+IHtcclxuXHRcdFx0aXRlbS5zbG90ID0gbmV3U2xvdDtcclxuXHRcdFx0aWYgKG5ld0l0ZW0pIG5ld0l0ZW0uc2xvdCA9IHNsb3Q7XHJcblx0XHRcdHRoaXMuY2FsY0JvbnVzU3RhdHMoKTtcclxuXHRcdH07XHJcblxyXG5cdFx0Ly8gSUYgTm8gbmV3IGl0ZW0gaW4gbmV3IHNsb3RcclxuXHRcdC8vIE9SIE5ldyBpdGVtIGluIG5ldyBzbG90LCBvbGQgaXRlbSBpbiBpbnZlbnRvcnlcclxuXHRcdC8vIE9SIE5ldyBpdGVtIGluIG5ldyBzbG90LCBvbGQgaXRlbSBpcyBlcXVpcHBlZCwgbmV3IGl0ZW0gY2FuIGJlIGVxdWlwcGVkIGluIG9sZCBzbG90XHJcblx0XHRpZiAoIW5ld0l0ZW0gfHwgc2xvdCA8IGNvbmZpZy5JTlZFTlRPUllfU0laRSB8fCBuZXdJdGVtLmVxdWlwcGVkU2xvdCArIGNvbmZpZy5JTlZFTlRPUllfU0laRSA9PT0gc2xvdCkge1xyXG5cdFx0XHRzd2FwU2xvdHMoKTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHQvLyBPbGQgaXRlbSBpcyBlcXVpcHBlZCwgbmV3IGl0ZW0gY2Fubm90IGJlIGVxdWlwcGVkIGluIG9sZCBzbG90XHJcblx0XHRcdG5ld1Nsb3QgPSB0aGlzLmZpbmRGaXJzdEVtcHR5U2xvdCgpO1xyXG5cdFx0XHRpZiAobmV3U2xvdCAhPSBudWxsKSB7XHJcblx0XHRcdFx0c3dhcFNsb3RzKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0Z2FtZS5zZW5kR2FtZUluZm9QbGF5ZXIodGhpcy5pZCwgXCJZb3VyIGludmVudG9yeSBpcyBmdWxsLlwiKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZXF1aXBJdGVtKGl0ZW0pIHtcclxuXHRcdGNvbnN0IGVxdWlwcGVkSXRlbSA9IHRoaXMuZ2V0SXRlbShpdGVtLmVxdWlwcGVkU2xvdCArIGNvbmZpZy5JTlZFTlRPUllfU0laRSk7XHJcblx0XHRpdGVtLnNsb3QgPSBpdGVtLmVxdWlwcGVkU2xvdCArIGNvbmZpZy5JTlZFTlRPUllfU0laRTtcclxuXHRcdGlmIChlcXVpcHBlZEl0ZW0pIGVxdWlwcGVkSXRlbS5zbG90ID0gdGhpcy5maW5kRmlyc3RFbXB0eVNsb3QoKTtcclxuXHRcdHRoaXMuY2FsY0JvbnVzU3RhdHMoKTtcclxuXHR9XHJcblxyXG5cdHVuZXF1aXBJdGVtKGl0ZW0pIHtcclxuXHRcdGNvbnN0IG5ld1Nsb3QgPSB0aGlzLmZpbmRGaXJzdEVtcHR5U2xvdCgpO1xyXG5cdFx0aWYgKG5ld1Nsb3QgPT0gbnVsbCkge1xyXG5cdFx0XHRnYW1lLnNlbmRHYW1lSW5mb1BsYXllcih0aGlzLmdhbWVJZCwgXCJZb3VyIGludmVudG9yeSBpcyBmdWxsLlwiKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0aXRlbS5zbG90ID0gbmV3U2xvdDtcclxuXHRcdHRoaXMuY2FsY0JvbnVzU3RhdHMoKTtcclxuXHR9XHJcblxyXG5cdHVwZGF0ZShkZWx0YSkge1xyXG5cdFx0Ly8gSW52ZW50b3J5IEl0ZW0gVXBkYXRlXHJcblx0XHRjb25zdCBpbnZlbnRvcnkgPSB0aGlzLmdldEludmVudG9yeSgpO1xyXG5cdFx0aW52ZW50b3J5LmZvckVhY2goaXRlbSA9PiB7XHJcblx0XHRcdGlmIChpdGVtKSBpdGVtLnVwZGF0ZSgpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0aWYgKHRoaXMuaXNEZWFkKSByZXR1cm47XHJcblx0XHRcclxuXHRcdC8vIEF0dGFja2luZ1xyXG5cdFx0aWYgKHRoaXMuaXNBdHRhY2tpbmcgfHwgdGhpcy5hdHRhY2tUaW1lciA+IDApIHtcclxuXHRcdFx0dGhpcy5hdHRhY2tUaW1lciArPSBkZWx0YTtcclxuXHRcdFx0aWYgKHRoaXMuYXR0YWNrVGltZXIgPj0gMC4zKSB0aGlzLmlzQXR0YWNraW5nID0gZmFsc2U7XHJcblx0XHRcdGlmICh0aGlzLmF0dGFja1RpbWVyID49IHRoaXMuYXR0YWNrU3BlZWQpIHRoaXMuYXR0YWNrVGltZXIgPSAwO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBNb3ZlbWVudFxyXG5cdFx0aWYgKHRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0dGhpcy5sZXJwICs9IGRlbHRhICogdGhpcy5tb3ZlU3BlZWQ7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAodGhpcy5sZXJwID49IDAuNDkpIHtcclxuXHRcdFx0XHR0aGlzLnggPSB0aGlzLmRlc3RpbmF0aW9uWDtcclxuXHRcdFx0XHR0aGlzLnkgPSB0aGlzLmRlc3RpbmF0aW9uWTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0aWYgKHRoaXMubGVycCA+PSAwLjk5KSB7XHJcblx0XHRcdFx0dGhpcy5zdGFydFggPSB0aGlzLmRlc3RpbmF0aW9uWDtcclxuXHRcdFx0XHR0aGlzLnN0YXJ0WSA9IHRoaXMuZGVzdGluYXRpb25ZO1xyXG5cdFx0XHRcdHRoaXMubGVycCA9IDA7XHJcblx0XHRcdFx0dGhpcy5pc01vdmluZyA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gUmVnZW5cclxuXHRcdHRoaXMucmVnZW5UaW1lciArPSBkZWx0YTtcclxuXHRcdGlmICh0aGlzLnJlZ2VuVGltZXIgPj0gMSkge1xyXG5cdFx0XHR0aGlzLnJlZ2VuVGltZXIgPSAwO1xyXG5cdFx0XHRpZiAodGhpcy5oZWFsdGggPCB0aGlzLmhlYWx0aE1heCkge1xyXG5cdFx0XHRcdGlmICh0aGlzLmlzSGl0KSB7XHJcblx0XHRcdFx0XHR0aGlzLmlzSGl0ID0gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5oZWFsdGggKz0gdGhpcy5oZWFsdGhSZWdlbjtcclxuXHRcdFx0XHRcdGlmICh0aGlzLmhlYWx0aCA+IHRoaXMuaGVhbHRoTWF4KSB0aGlzLmhlYWx0aCA9IHRoaXMuaGVhbHRoTWF4O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHRoaXMuZW5lcmd5IDwgdGhpcy5lbmVyZ3lNYXgpIHtcclxuXHRcdFx0XHRpZiAoIXRoaXMuaXNSdW5uaW5nKSB7XHJcblx0XHRcdFx0XHR0aGlzLmVuZXJneSArPSB0aGlzLmVuZXJneVJlZ2VuO1xyXG5cdFx0XHRcdFx0aWYgKHRoaXMuZW5lcmd5ID4gdGhpcy5lbmVyZ3lNYXgpIHRoaXMuZW5lcmd5ID0gdGhpcy5lbmVyZ3lNYXg7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0Z2V0SW52ZW50b3J5UGFjaygpIHtcclxuXHRcdGNvbnN0IGludmVudG9yeVBhY2sgPSBbXTtcclxuXHRcdGNvbnN0IGludmVudG9yeSA9IHRoaXMuZ2V0SW52ZW50b3J5KCk7XHJcblx0XHRpbnZlbnRvcnkuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG5cdFx0XHRpZiAoaXRlbSkgaW52ZW50b3J5UGFja1tpdGVtLnNsb3RdID0gaXRlbS5nZXRQYWNrKCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gaW52ZW50b3J5UGFjaztcclxuXHR9XHJcbn1cclxuIiwiaW1wb3J0IGdhbWUgZnJvbSAnLi4vZ2FtZS5qcyc7XHJcbmltcG9ydCBjb25maWcgZnJvbSAnLi4vY29uZmlnLmpzJztcclxuaW1wb3J0IHV0aWwgZnJvbSAnLi4vdXRpbC5qcyc7XHJcbmltcG9ydCBBY3RvciBmcm9tICcuL2FjdG9yLmpzJztcclxuXHJcbi8vIEEgQm90IGlzIGFuIEFjdG9yIHdpdGggY29uZGl0aW9uYWwgaW5wdXRzXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCb3QgZXh0ZW5kcyBBY3RvciB7XHJcblx0Y29uc3RydWN0b3IoZGF0YSkge1xyXG5cdFx0bGV0IHsgX2lkLCBtYXBJZCwgeCwgeSwgZGlyZWN0aW9uLCB0ZW1wbGF0ZSwgbmFtZSwgc3ByaXRlLCBob3N0aWxlLFxyXG5cdFx0XHRcdFx0ZGFtYWdlQmFzZSwgZGVmZW5jZUJhc2UsIGhlYWx0aE1heEJhc2UsIGVuZXJneU1heEJhc2UsIGhlYWx0aFJlZ2VuQmFzZSwgZW5lcmd5UmVnZW5CYXNlLCByYW5nZUJhc2UgXHJcblx0XHRcdFx0fSA9IGRhdGE7XHJcblx0XHRcclxuXHRcdGlmIChfaWQgPT0gbnVsbCkgX2lkID0gZ2FtZS5yZXF1ZXN0REJJZCgpO1xyXG5cdFx0aWYgKG5hbWUgPT0gbnVsbCkgbmFtZSA9IHRlbXBsYXRlLm5hbWU7XHJcblx0XHRpZiAoc3ByaXRlID09IG51bGwpIHNwcml0ZSA9IHRlbXBsYXRlLnNwcml0ZTtcclxuXHRcdGlmIChob3N0aWxlID09IG51bGwpIGhvc3RpbGUgPSB0ZW1wbGF0ZS5ob3N0aWxlO1xyXG5cdFx0aWYgKGRhbWFnZUJhc2UgPT0gbnVsbCkgZGFtYWdlQmFzZSA9IHRlbXBsYXRlLmRhbWFnZUJhc2U7XHJcblx0XHRpZiAoZGVmZW5jZUJhc2UgPT0gbnVsbCkgZGVmZW5jZUJhc2UgPSB0ZW1wbGF0ZS5kZWZlbmNlQmFzZTtcclxuXHRcdGlmIChoZWFsdGhNYXhCYXNlID09IG51bGwpIGhlYWx0aE1heEJhc2UgPSB0ZW1wbGF0ZS5oZWFsdGhNYXhCYXNlO1xyXG5cdFx0aWYgKGVuZXJneU1heEJhc2UgPT0gbnVsbCkgZW5lcmd5TWF4QmFzZSA9IHRlbXBsYXRlLmVuZXJneU1heEJhc2U7XHJcblx0XHRpZiAoaGVhbHRoUmVnZW5CYXNlID09IG51bGwpIGhlYWx0aFJlZ2VuQmFzZSA9IHRlbXBsYXRlLmhlYWx0aFJlZ2VuQmFzZTtcclxuXHRcdGlmIChlbmVyZ3lSZWdlbkJhc2UgPT0gbnVsbCkgZW5lcmd5UmVnZW5CYXNlID0gdGVtcGxhdGUuZW5lcmd5UmVnZW5CYXNlO1xyXG5cdFx0aWYgKHJhbmdlQmFzZSA9PSBudWxsKSByYW5nZUJhc2UgPSB0ZW1wbGF0ZS5yYW5nZUJhc2U7XHJcblxyXG5cdFx0c3VwZXIobWFwSWQsIHgsIHksIGRpcmVjdGlvbiwgbmFtZSwgc3ByaXRlKTtcclxuXHRcdHRoaXMuYm90SWQgPSBfaWQ7XHJcblx0XHR0aGlzLnRlbXBsYXRlSWQgPSB0ZW1wbGF0ZS5faWQ7XHJcblx0XHR0aGlzLmRhbWFnZUJhc2UgPSBkYW1hZ2VCYXNlO1xyXG5cdFx0dGhpcy5kZWZlbmNlQmFzZSA9IGRlZmVuY2VCYXNlO1xyXG5cdFx0dGhpcy5oZWFsdGhNYXhCYXNlID0gaGVhbHRoTWF4QmFzZTtcclxuXHRcdHRoaXMuZW5lcmd5TWF4QmFzZSA9IGVuZXJneU1heEJhc2U7XHJcblx0XHR0aGlzLmhlYWx0aFJlZ2VuQmFzZSA9IGhlYWx0aFJlZ2VuQmFzZTtcclxuXHRcdHRoaXMuZW5lcmd5UmVnZW5CYXNlID0gZW5lcmd5UmVnZW5CYXNlO1xyXG5cdFx0dGhpcy5yYW5nZUJhc2UgPSByYW5nZUJhc2U7XHJcblx0XHR0aGlzLmNhbGNCb251c1N0YXRzKCk7XHJcblx0XHR0aGlzLnJlc3RvcmUoKTtcclxuXHRcdFxyXG5cdFx0dGhpcy5ob3N0aWxlID0gaG9zdGlsZTtcclxuXHRcdHRoaXMudGFyZ2V0ID0gbnVsbDtcclxuXHRcdHRoaXMuc2V0VGFzaygnd2FuZGVyaW5nJyk7XHJcblx0XHR0aGlzLm1vdmVUaW1lciA9IDA7XHJcblxyXG5cdFx0dGhpcy5nYW1lSWQgPSB1dGlsLmZpcnN0RW1wdHlJbmRleChnYW1lLmJvdHMpO1xyXG5cdFx0Z2FtZS5ib3RzW3RoaXMuZ2FtZUlkXSA9IHRoaXM7XHJcblx0fVxyXG5cclxuXHR1cGRhdGUoZGVsdGEpIHtcclxuXHRcdHN1cGVyLnVwZGF0ZShkZWx0YSk7IFx0Ly8gRGVmYXVsdCBBY3RvciBVcGRhdGVcclxuXHRcdGlmICh0aGlzLmlzRGVhZCkgcmV0dXJuO1xyXG5cclxuXHRcdHRoaXMubW92ZVRpbWVyKys7XHJcblx0XHRcclxuXHRcdC8vIEFJIElucHV0c1xyXG5cdFx0c3dpdGNoKHRoaXMudGFzaykge1xyXG5cdFx0XHRjYXNlICd3YW5kZXJpbmcnOlx0XHQvLyBNb3ZlIHJhbmRvbWx5XHJcblx0XHRcdFx0dGhpcy5tb3ZlKCk7XHJcblx0XHRcdFx0dGhpcy5waWNrVXAoKTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ2ZvbGxvd2luZyc6XHRcdC8vIE1vdmUgdG93YXJkcyB0YXJnZXRcclxuXHRcdFx0XHRpZiAodGhpcy50YXJnZXQpIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZVRvVGFyZ2V0KHRoaXMudGFyZ2V0LCBmYWxzZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly8gTm8gdGFyZ2V0XHJcblx0XHRcdFx0XHR0aGlzLnNldFRhc2soJ3dhbmRlcmluZycpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ2F0dGFja2luZyc6XHRcdC8vIE1vdmUgdG93YXJkcyB0YXJnZXQgYW5kIGF0dGFja1xyXG5cdFx0XHRcdGlmICh0aGlzLnRhcmdldCkge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlVG9UYXJnZXQodGhpcy50YXJnZXQsIHRydWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdC8vIE5vIHRhcmdldFxyXG5cdFx0XHRcdFx0dGhpcy5zZXRUYXNrKCd3YW5kZXJpbmcnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHQvLyBjYXNlICdpZGxlJzpcclxuXHRcdFx0ZGVmYXVsdDogXHRcdFx0XHRcdC8vIFN0YW5kIHN0aWxsXHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gdGhpcy5nZXRQYWNrKCk7XHJcblx0fVxyXG5cdFxyXG5cdGdldFBhY2soKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRnYW1lSWQ6IHRoaXMuZ2FtZUlkLFxyXG5cdFx0XHRuYW1lOiB0aGlzLm5hbWUsXHJcblx0XHRcdHNwcml0ZTogdGhpcy5zcHJpdGUsXHJcblx0XHRcdGRpcmVjdGlvbjogdGhpcy5kaXJlY3Rpb24sXHJcblx0XHRcdG1hcElkOiB0aGlzLm1hcElkLFxyXG5cdFx0XHR4OiB0aGlzLnN0YXJ0WCxcclxuXHRcdFx0eTogdGhpcy5zdGFydFksXHJcblx0XHRcdHo6IHRoaXMueixcclxuXHRcdFx0ZGVzdGluYXRpb25YOiB0aGlzLmRlc3RpbmF0aW9uWCxcclxuXHRcdFx0ZGVzdGluYXRpb25ZOiB0aGlzLmRlc3RpbmF0aW9uWSxcclxuXHRcdFx0bGVycDogdGhpcy5sZXJwLFxyXG5cdFx0XHRpc1J1bm5pbmc6IHRoaXMuaXNSdW5uaW5nLFxyXG5cdFx0XHRpc0F0dGFja2luZzogdGhpcy5pc0F0dGFja2luZyxcclxuXHRcdFx0aXNEZWFkOiBmYWxzZSxcclxuXHRcdFx0aXNWaXNpYmxlOiB0aGlzLmlzVmlzaWJsZVxyXG5cdFx0fTtcclxuXHR9XHJcblx0XHJcblx0Z2V0REJQYWNrKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0Ym90SWQ6IHRoaXMuYm90SWQsXHJcblx0XHRcdHRlbXBsYXRlSWQ6IHRoaXMudGVtcGxhdGVJZCxcclxuXHRcdFx0bWFwSWQ6IHRoaXMubWFwSWQsXHJcblx0XHRcdHg6IHRoaXMueCxcclxuXHRcdFx0eTogdGhpcy55LFxyXG5cdFx0XHRkaXJlY3Rpb246IHRoaXMuZGlyZWN0aW9uLFxyXG5cdFx0XHRuYW1lOiB0aGlzLm5hbWUsXHJcblx0XHRcdHNwcml0ZTogdGhpcy5zcHJpdGUsXHJcblx0XHRcdGhvc3RpbGU6IHRoaXMuaG9zdGlsZVxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdHJlbW92ZSgpIHtcclxuXHRcdGRlbGV0ZSBnYW1lLmJvdHNbdGhpcy5nYW1lSWRdO1xyXG5cdH1cclxuXHRcclxuXHRtb3ZlKGRpcmVjdGlvbikge1xyXG5cdFx0bGV0IG1vdmVUaW1lID0gMjQ7XHJcblx0XHRpZiAodGhpcy5pc1J1bm5pbmcpIG1vdmVUaW1lID0gMTc7XHJcblx0XHRpZiAodGhpcy5tb3ZlVGltZXIgPiBtb3ZlVGltZSAmJiB0aGlzLmF0dGFja1RpbWVyID09PSAwKSB7XHJcblx0XHRcdHN1cGVyLm1vdmUoZGlyZWN0aW9uKTtcclxuXHRcdFx0dGhpcy5tb3ZlVGltZXIgPSAwO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHR0YWtlRGFtYWdlKGRhbWFnZSwgYXR0YWNrZXIpIHtcclxuXHRcdGlmIChhdHRhY2tlciBpbnN0YW5jZW9mIEFjdG9yKSB0aGlzLnNldFRhc2soJ2F0dGFja2luZycsIGF0dGFja2VyKTtcclxuXHRcdHN1cGVyLnRha2VEYW1hZ2UoZGFtYWdlLCBhdHRhY2tlcik7XHJcblx0fVxyXG5cdFxyXG5cdHBpY2tVcCgpIHtcclxuXHRcdHN1cGVyLnBpY2tVcCgpO1xyXG5cdFx0dGhpcy5jaGVja0Jlc3RFcXVpcG1lbnQoKTtcclxuXHR9XHJcblxyXG5cdGdldEludmVudG9yeSgpIHtcclxuXHRcdGNvbnN0IGludmVudG9yeSA9IGdhbWUuaXRlbXMuZmlsdGVyKGl0ZW0gPT4ge1xyXG5cdFx0XHRyZXR1cm4gXCJcIitpdGVtLmJvdElkID09PSBcIlwiK3RoaXMuYm90SWQ7XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBpbnZlbnRvcnk7XHJcblx0fVxyXG5cclxuXHRzZXREZWFkKCkge1xyXG5cdFx0c3VwZXIuc2V0RGVhZCgpO1xyXG5cdFx0dGhpcy5yZW1vdmUoKTtcclxuXHR9XHJcblxyXG5cdC8vIElucHV0c1xyXG5cdHNldFRhc2sodGFzaywgdGFyZ2V0KSB7XHJcblx0XHRzd2l0Y2ggKHRhc2spIHtcclxuXHRcdFx0Y2FzZSAnd2FuZGVyaW5nJzpcclxuXHRcdFx0XHR0aGlzLmxhemluZXNzID0gNztcclxuXHRcdFx0XHR0aGlzLnRhcmdldCA9IG51bGw7XHJcblx0XHRcdFx0dGhpcy50YXNrID0gdGFzaztcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ2ZvbGxvd2luZyc6XHJcblx0XHRcdFx0aWYgKHRhcmdldCA9PT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0dGhpcy5zZXRUYXNrKCd3YW5kZXJpbmcnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLmxhemluZXNzID0gMDtcclxuXHRcdFx0XHRcdHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xyXG5cdFx0XHRcdFx0dGhpcy50YXNrID0gdGFzaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdhdHRhY2tpbmcnOlxyXG5cdFx0XHRcdGlmICh0YXJnZXQgPT09IG51bGwpIHtcclxuXHRcdFx0XHRcdHRoaXMuc2V0VGFzaygnd2FuZGVyaW5nJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5sYXppbmVzcyA9IDA7XHJcblx0XHRcdFx0XHR0aGlzLnRhcmdldCA9IHRhcmdldDtcclxuXHRcdFx0XHRcdHRoaXMudGFzayA9IHRhc2s7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0ZGVmYXVsdDpcdC8vaWRsaW5nXHJcblx0XHRcdFx0dGhpcy5sYXppbmVzcyA9IDc7XHJcblx0XHRcdFx0dGhpcy50YXJnZXQgPSBudWxsO1xyXG5cdFx0XHRcdHRoaXMudGFzayA9ICdpZGxlJztcclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGNoZWNrQmVzdEVxdWlwbWVudCgpIHtcclxuXHRcdGNvbnN0IGludmVudG9yeSA9IHRoaXMuZ2V0SW52ZW50b3J5KCk7XHJcblx0XHRjb25zdCBlcXVpcG1lbnQgPSBbXTtcclxuXHRcdGZvciAobGV0IHNsb3QgPSAwOyBzbG90IDwgY29uZmlnLkVRVUlQTUVOVF9TSVpFOyBzbG90KyspIHtcclxuXHRcdFx0ZXF1aXBtZW50LnB1c2goW10pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgaW52ZW50b3J5Lmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IGl0ZW0gPSBpbnZlbnRvcnlbaV07XHJcblx0XHRcdGZvciAobGV0IHNsb3QgPSAwOyBzbG90IDwgY29uZmlnLkVRVUlQTUVOVF9TSVpFOyBzbG90KyspIHtcclxuXHRcdFx0XHRpZiAoaXRlbS5lcXVpcHBlZFNsb3QgPT09IHNsb3QpIHtcclxuXHRcdFx0XHRcdGVxdWlwbWVudFtzbG90XS5wdXNoKGl0ZW0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChlcXVpcG1lbnRbMF0ubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRlcXVpcG1lbnRbMF0uc29ydCgoYSwgYikgPT4gYi5lcXVpcHBlZC5kYW1hZ2UgLSBhLmVxdWlwcGVkLmRhbWFnZSk7XHJcblx0XHRcdHRoaXMuZXF1aXBJdGVtKGVxdWlwbWVudFswXVswXSk7XHJcblx0XHR9XHJcblx0XHRpZiAoZXF1aXBtZW50WzFdLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0ZXF1aXBtZW50WzFdLnNvcnQoKGEsIGIpID0+IGIuZXF1aXBwZWQuZGVmZW5jZSAtIGEuZXF1aXBwZWQuZGVmZW5jZSk7XHJcblx0XHRcdHRoaXMuZXF1aXBJdGVtKGVxdWlwbWVudFsxXVswXSk7XHJcblx0XHR9XHJcblx0XHRpZiAoZXF1aXBtZW50WzJdLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0ZXF1aXBtZW50WzJdLnNvcnQoKGEsIGIpID0+IGIuZXF1aXBwZWQuZGVmZW5jZSAtIGEuZXF1aXBwZWQuZGVmZW5jZSk7XHJcblx0XHRcdHRoaXMuZXF1aXBJdGVtKGVxdWlwbWVudFsyXVswXSk7XHJcblx0XHR9XHJcblx0XHRpZiAoZXF1aXBtZW50WzNdLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0ZXF1aXBtZW50WzNdLnNvcnQoKGEsIGIpID0+IGIuZXF1aXBwZWQuZGVmZW5jZSAtIGEuZXF1aXBwZWQuZGVmZW5jZSk7XHJcblx0XHRcdHRoaXMuZXF1aXBJdGVtKGVxdWlwbWVudFszXVswXSk7XHJcblx0XHR9XHJcblx0XHRpZiAoZXF1aXBtZW50WzRdLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0ZXF1aXBtZW50WzRdLnNvcnQoKGEsIGIpID0+IGIuZXF1aXBwZWQuZGVmZW5jZSAtIGEuZXF1aXBwZWQuZGVmZW5jZSk7XHJcblx0XHRcdHRoaXMuZXF1aXBJdGVtKGVxdWlwbWVudFs0XVswXSk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbiIsImltcG9ydCBFbnRpdHkgZnJvbSAnLi9lbnRpdHkuanMnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuLi9nYW1lLmpzJztcclxuaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9jb25maWcuanMnO1xyXG5pbXBvcnQgdXRpbCBmcm9tICcuLi91dGlsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVmZmVjdCBleHRlbmRzIEVudGl0eSB7XHJcblx0Y29uc3RydWN0b3IobWFwSWQsIHgsIHksIHNwcml0ZSA9IDAsIGxvb3AgPSAwLCBzcGVlZCA9IDEyLCBtYXhGcmFtZSA9IDcsIHN0YXJ0RnJhbWUgPSAwKSB7XHJcblx0XHRzdXBlcihtYXBJZCwgeCwgeSwgdXRpbC5jbGFtcChzcHJpdGUsIDAsIGNvbmZpZy5NQVhfRUZGRUNUUyAtIDEpKTtcclxuXHRcdHRoaXMubWF4RnJhbWUgPSB1dGlsLmNsYW1wKG1heEZyYW1lLCAwLCA3KTtcclxuXHRcdHRoaXMuc3RhcnRGcmFtZSA9IHV0aWwuY2xhbXAoc3RhcnRGcmFtZSwgMCwgdGhpcy5tYXhGcmFtZSk7XHJcblx0XHR0aGlzLmN1cnJlbnRGcmFtZSA9IHRoaXMuc3RhcnRGcmFtZTtcclxuXHRcdFxyXG5cdFx0dGhpcy5sb29wID0gbG9vcDtcclxuXHRcdHRoaXMuc3BlZWQgPSBzcGVlZDtcclxuXHRcdHRoaXMudGltZXIgPSAwO1xyXG5cdFx0XHJcblx0XHR0aGlzLmdhbWVJZCA9IHV0aWwuZmlyc3RFbXB0eUluZGV4KGdhbWUuZWZmZWN0cyk7XHJcblx0XHRnYW1lLmVmZmVjdHNbdGhpcy5nYW1lSWRdID0gdGhpcztcclxuXHR9XHJcblx0XHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHR0aGlzLnRpbWVyICs9IGRlbHRhO1xyXG5cdFx0XHJcblx0XHRpZiAodGhpcy50aW1lciA+PSAxIC8gdGhpcy5zcGVlZCkge1xyXG5cdFx0XHR0aGlzLnRpbWVyID0gMDtcclxuXHRcdFx0dGhpcy5jdXJyZW50RnJhbWUrKztcclxuXHJcblx0XHRcdGlmICh0aGlzLmN1cnJlbnRGcmFtZSA+IHRoaXMubWF4RnJhbWUpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5sb29wIDwgMCkge1xyXG5cdFx0XHRcdFx0dGhpcy5jdXJyZW50RnJhbWUgPSB0aGlzLnN0YXJ0RnJhbWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2UgaWYgKHRoaXMubG9vcCA+IDApIHtcclxuXHRcdFx0XHRcdHRoaXMuY3VycmVudEZyYW1lID0gdGhpcy5zdGFydEZyYW1lO1xyXG5cdFx0XHRcdFx0dGhpcy5sb29wLS07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5jdXJyZW50RnJhbWUgPSB0aGlzLm1heEZyYW1lO1xyXG5cdFx0XHRcdFx0dGhpcy5yZW1vdmUoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGhpcy5nZXRQYWNrKCk7XHJcblx0fVxyXG5cdFxyXG5cdGdldFBhY2soKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRnYW1lSWQ6IHRoaXMuZ2FtZUlkLFxyXG5cdFx0XHRtYXBJZDogdGhpcy5tYXBJZCxcclxuXHRcdFx0eDogdGhpcy54LFxyXG5cdFx0XHR5OiB0aGlzLnksXHJcblx0XHRcdHNwcml0ZTogdGhpcy5zcHJpdGUsXHJcblx0XHRcdGN1cnJlbnRGcmFtZTogdGhpcy5jdXJyZW50RnJhbWVcclxuXHRcdH07XHJcblx0fVxyXG5cdFxyXG5cdHJlbW92ZSgpIHtcclxuXHRcdGRlbGV0ZSBnYW1lLmVmZmVjdHNbdGhpcy5nYW1lSWRdO1xyXG5cdH1cdFxyXG59XHJcbiIsImltcG9ydCBjb25maWcgZnJvbSAnLi4vY29uZmlnLmpzJztcclxuXHJcbi8vIEFuIEVudGl0eSBpcyBhbnkgb2JqZWN0IHdoaWNoIGNhbiBhcHBlYXIgb24gdGhlIG1hcFxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW50aXR5IHtcclxuXHRjb25zdHJ1Y3RvcihtYXBJZCwgeCwgeSwgc3ByaXRlID0gMSkge1xyXG5cdFx0dGhpcy5tYXBJZCA9IG1hcElkO1xyXG5cdFx0dGhpcy54ID0geDtcclxuXHRcdHRoaXMueSA9IHk7XHJcblx0XHRpZiAoc3ByaXRlIDwgMSkgc3ByaXRlID0gMTtcclxuXHRcdHRoaXMuc3ByaXRlID0gc3ByaXRlO1xyXG5cdFx0dGhpcy5pc1Zpc2libGUgPSB0cnVlO1xyXG5cdH1cclxufVxyXG4iLCJpbXBvcnQgZ2FtZSBmcm9tICcuLi9nYW1lLmpzJztcclxuaW1wb3J0IHV0aWwgZnJvbSAnLi4vdXRpbC5qcyc7XHJcbmltcG9ydCBFbnRpdHkgZnJvbSAnLi9lbnRpdHkuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSXRlbSBleHRlbmRzIEVudGl0eSB7XHJcblx0Y29uc3RydWN0b3IoZGF0YSkge1xyXG5cdFx0aWYgKCFkYXRhKSByZXR1cm47XHJcblxyXG5cdFx0bGV0IHsgX2lkLCBwbGF5ZXJJZCwgYm90SWQsIHNsb3QsIG1hcElkLCB4LCB5LCB0ZW1wbGF0ZSwgc3RhY2ssIHNwcml0ZSwgbmFtZSwgZGVzY3JpcHRpb24sIHJldXNhYmxlLCBjcmVhdGVkQnksIGNyZWF0ZWREYXRlLFxyXG5cdFx0XHRcdFx0cGFzc2l2ZURhbWFnZSwgcGFzc2l2ZURlZmVuY2UsIHBhc3NpdmVIZWFsdGhNYXgsIHBhc3NpdmVFbmVyZ3lNYXgsIHBhc3NpdmVIZWFsdGhSZWdlbiwgcGFzc2l2ZUVuZXJneVJlZ2VuLCBwYXNzaXZlUmFuZ2UsXHJcblx0XHRcdFx0XHRlcXVpcHBlZERhbWFnZSwgZXF1aXBwZWREZWZlbmNlLCBlcXVpcHBlZEhlYWx0aE1heCwgZXF1aXBwZWRFbmVyZ3lNYXgsIGVxdWlwcGVkSGVhbHRoUmVnZW4sIGVxdWlwcGVkRW5lcmd5UmVnZW4sIGVxdWlwcGVkUmFuZ2VcclxuXHRcdFx0XHR9ID0gZGF0YTtcclxuXHJcblx0XHRpZiAoX2lkID09IG51bGwpIF9pZCA9IGdhbWUucmVxdWVzdERCSWQoKTtcclxuXHRcdGlmIChwbGF5ZXJJZCA9PT0gdW5kZWZpbmVkKSBwbGF5ZXJJZCA9IG51bGw7XHJcblx0XHRpZiAoYm90SWQgPT09IHVuZGVmaW5lZCkgYm90SWQgPSBudWxsO1xyXG5cdFx0aWYgKHNsb3QgPT09IHVuZGVmaW5lZCkgc2xvdCA9IG51bGw7XHJcblx0XHRpZiAobWFwSWQgPT09IHVuZGVmaW5lZCkgbWFwSWQgPSBudWxsO1xyXG5cdFx0aWYgKHggPT09IHVuZGVmaW5lZCkgeCA9IG51bGw7XHJcblx0XHRpZiAoeSA9PT0gdW5kZWZpbmVkKSB5ID0gbnVsbDtcclxuXHRcdGlmIChjcmVhdGVkQnkgPT09IHVuZGVmaW5lZCkgY3JlYXRlZEJ5ID0gbnVsbDtcclxuXHRcdGlmIChjcmVhdGVkRGF0ZSA9PT0gdW5kZWZpbmVkKSBjcmVhdGVkRGF0ZSA9IG5ldyBEYXRlKCk7XHJcblxyXG5cdFx0aWYgKHNwcml0ZSA9PT0gdW5kZWZpbmVkKSBzcHJpdGUgPSB0ZW1wbGF0ZS5zcHJpdGU7XHJcblx0XHRpZiAobmFtZSA9PT0gdW5kZWZpbmVkKSBuYW1lID0gdGVtcGxhdGUubmFtZTtcclxuXHRcdGlmIChkZXNjcmlwdGlvbiA9PT0gdW5kZWZpbmVkKSBkZXNjcmlwdGlvbiA9IHRlbXBsYXRlLmRlc2NyaXB0aW9uO1xyXG5cdFx0aWYgKHJldXNhYmxlID09PSB1bmRlZmluZWQpIHJldXNhYmxlID0gdGVtcGxhdGUucmV1c2FibGU7XHJcblx0XHRpZiAocGFzc2l2ZURhbWFnZSA9PT0gdW5kZWZpbmVkKSBwYXNzaXZlRGFtYWdlID0gdGVtcGxhdGUucGFzc2l2ZURhbWFnZTtcclxuXHRcdGlmIChwYXNzaXZlRGVmZW5jZSA9PT0gdW5kZWZpbmVkKSBwYXNzaXZlRGVmZW5jZSA9IHRlbXBsYXRlLnBhc3NpdmVEZWZlbmNlO1xyXG5cdFx0aWYgKHBhc3NpdmVIZWFsdGhNYXggPT09IHVuZGVmaW5lZCkgcGFzc2l2ZUhlYWx0aE1heCA9IHRlbXBsYXRlLnBhc3NpdmVIZWFsdGhNYXg7XHJcblx0XHRpZiAocGFzc2l2ZUVuZXJneU1heCA9PT0gdW5kZWZpbmVkKSBwYXNzaXZlRW5lcmd5TWF4ID0gdGVtcGxhdGUucGFzc2l2ZUVuZXJneU1heDtcclxuXHRcdGlmIChwYXNzaXZlSGVhbHRoUmVnZW4gPT09IHVuZGVmaW5lZCkgcGFzc2l2ZUhlYWx0aFJlZ2VuID0gdGVtcGxhdGUucGFzc2l2ZUhlYWx0aFJlZ2VuO1xyXG5cdFx0aWYgKHBhc3NpdmVFbmVyZ3lSZWdlbiA9PT0gdW5kZWZpbmVkKSBwYXNzaXZlRW5lcmd5UmVnZW4gPSB0ZW1wbGF0ZS5wYXNzaXZlRW5lcmd5UmVnZW47XHJcblx0XHRpZiAocGFzc2l2ZVJhbmdlID09PSB1bmRlZmluZWQpIHBhc3NpdmVSYW5nZSA9IHRlbXBsYXRlLnBhc3NpdmVSYW5nZTtcclxuXHRcdGlmIChlcXVpcHBlZERhbWFnZSA9PT0gdW5kZWZpbmVkKSBlcXVpcHBlZERhbWFnZSA9IHRlbXBsYXRlLmVxdWlwcGVkRGFtYWdlO1xyXG5cdFx0aWYgKGVxdWlwcGVkRGVmZW5jZSA9PT0gdW5kZWZpbmVkKSBlcXVpcHBlZERlZmVuY2UgPSB0ZW1wbGF0ZS5lcXVpcHBlZERlZmVuY2U7XHJcblx0XHRpZiAoZXF1aXBwZWRIZWFsdGhNYXggPT09IHVuZGVmaW5lZCkgZXF1aXBwZWRIZWFsdGhNYXggPSB0ZW1wbGF0ZS5lcXVpcHBlZEhlYWx0aE1heDtcclxuXHRcdGlmIChlcXVpcHBlZEVuZXJneU1heCA9PT0gdW5kZWZpbmVkKSBlcXVpcHBlZEVuZXJneU1heCA9IHRlbXBsYXRlLmVxdWlwcGVkRW5lcmd5TWF4O1xyXG5cdFx0aWYgKGVxdWlwcGVkSGVhbHRoUmVnZW4gPT09IHVuZGVmaW5lZCkgZXF1aXBwZWRIZWFsdGhSZWdlbiA9IHRlbXBsYXRlLmVxdWlwcGVkSGVhbHRoUmVnZW47XHJcblx0XHRpZiAoZXF1aXBwZWRFbmVyZ3lSZWdlbiA9PT0gdW5kZWZpbmVkKSBlcXVpcHBlZEVuZXJneVJlZ2VuID0gdGVtcGxhdGUuZXF1aXBwZWRFbmVyZ3lSZWdlbjtcclxuXHRcdGlmIChlcXVpcHBlZFJhbmdlID09PSB1bmRlZmluZWQpIGVxdWlwcGVkUmFuZ2UgPSB0ZW1wbGF0ZS5lcXVpcHBlZFJhbmdlO1xyXG5cclxuXHRcdHN1cGVyKG1hcElkLCB4LCB5LCBzcHJpdGUpO1xyXG5cdFx0dGhpcy56ID0gLTEwO1xyXG5cdFx0dGhpcy5pdGVtSWQgPSBfaWQ7XHJcblx0XHR0aGlzLnBsYXllcklkID0gcGxheWVySWQ7XHJcblx0XHR0aGlzLmJvdElkID0gYm90SWQ7XHJcblx0XHR0aGlzLnNsb3QgPSBzbG90O1xyXG5cdFx0XHJcblx0XHR0aGlzLnRlbXBsYXRlSWQgPSB0ZW1wbGF0ZS5faWQ7XHJcblx0XHR0aGlzLm5hbWUgPSBuYW1lO1xyXG5cdFx0dGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xyXG5cdFx0dGhpcy5yZXVzYWJsZSA9IHJldXNhYmxlO1xyXG5cclxuXHRcdHRoaXMudHlwZSA9IHRlbXBsYXRlLnR5cGUubmFtZTtcclxuXHRcdHRoaXMuc3RhY2thYmxlID0gdGVtcGxhdGUudHlwZS5zdGFja2FibGU7XHJcblx0XHR0aGlzLmVxdWlwcGVkU2xvdCA9IHRlbXBsYXRlLnR5cGUuZXF1aXBwZWRTbG90O1xyXG5cdFx0XHJcblx0XHR0aGlzLnBhc3NpdmUgPSB7XHJcblx0XHRcdGRhbWFnZTogcGFzc2l2ZURhbWFnZSxcclxuXHRcdFx0ZGVmZW5jZTogcGFzc2l2ZURlZmVuY2UsXHJcblx0XHRcdGhlYWx0aE1heDogcGFzc2l2ZUhlYWx0aE1heCxcclxuXHRcdFx0ZW5lcmd5TWF4OiBwYXNzaXZlRW5lcmd5TWF4LFxyXG5cdFx0XHRoZWFsdGhSZWdlbjogcGFzc2l2ZUhlYWx0aFJlZ2VuLFxyXG5cdFx0XHRlbmVyZ3lSZWdlbjogcGFzc2l2ZUVuZXJneVJlZ2VuLFxyXG5cdFx0XHRyYW5nZTogcGFzc2l2ZVJhbmdlXHJcblx0XHR9O1xyXG5cdFx0dGhpcy5lcXVpcHBlZCA9IHtcclxuXHRcdFx0ZGFtYWdlOiBlcXVpcHBlZERhbWFnZSxcclxuXHRcdFx0ZGVmZW5jZTogZXF1aXBwZWREZWZlbmNlLFxyXG5cdFx0XHRoZWFsdGhNYXg6IGVxdWlwcGVkSGVhbHRoTWF4LFxyXG5cdFx0XHRlbmVyZ3lNYXg6IGVxdWlwcGVkRW5lcmd5TWF4LFxyXG5cdFx0XHRoZWFsdGhSZWdlbjogZXF1aXBwZWRIZWFsdGhSZWdlbixcclxuXHRcdFx0ZW5lcmd5UmVnZW46IGVxdWlwcGVkRW5lcmd5UmVnZW4sXHJcblx0XHRcdHJhbmdlOiBlcXVpcHBlZFJhbmdlXHJcblx0XHR9O1xyXG5cdFx0XHJcblx0XHRpZiAodGhpcy5zdGFja2FibGUpIHtcclxuXHRcdFx0aWYgKHN0YWNrIDwgMSkgc3RhY2sgPSAxO1xyXG5cdFx0XHR0aGlzLnN0YWNrID0gc3RhY2s7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0dGhpcy5zdGFjayA9IDA7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5nYW1lSWQgPSB1dGlsLmZpcnN0RW1wdHlJbmRleChnYW1lLml0ZW1zKTtcclxuXHRcdGdhbWUuaXRlbXNbdGhpcy5nYW1lSWRdID0gdGhpcztcclxuXHR9XHJcblxyXG5cdHVwZGF0ZShkZWx0YSkge1xyXG5cdFx0cmV0dXJuIHRoaXMuZ2V0UGFjaygpO1xyXG5cdH1cclxuXHJcblx0Z2V0REJQYWNrKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0aXRlbUlkOiB0aGlzLml0ZW1JZCxcclxuXHRcdFx0cGxheWVySWQ6IHRoaXMucGxheWVySWQsXHJcblx0XHRcdGJvdElkOiB0aGlzLmJvdElkLFxyXG5cdFx0XHRzbG90OiB0aGlzLnNsb3QsXHJcblx0XHRcdG1hcElkOiB0aGlzLm1hcElkLFxyXG5cdFx0XHR4OiB0aGlzLngsXHJcblx0XHRcdHk6IHRoaXMueSxcclxuXHRcdFx0Y3JlYXRlZEJ5OiB0aGlzLmNyZWF0ZWRCeSxcclxuXHRcdFx0Y3JlYXRlZERhdGU6IHRoaXMuY3JlYXRlZERhdGUsXHJcblx0XHRcdHRlbXBsYXRlSWQ6IHRoaXMudGVtcGxhdGVJZCxcclxuXHRcdFx0bmFtZTogdGhpcy5uYW1lLFxyXG5cdFx0XHRkZXNjcmlwdGlvbjogdGhpcy5kZXNjcmlwdGlvbixcclxuXHRcdFx0c3ByaXRlOiB0aGlzLnNwcml0ZSxcclxuXHRcdFx0cmV1c2FibGU6IHRoaXMucmV1c2FibGUsXHJcblx0XHRcdHBhc3NpdmVEYW1hZ2U6IHRoaXMucGFzc2l2ZS5kYW1hZ2UsXHJcblx0XHRcdHBhc3NpdmVEZWZlbmNlOiB0aGlzLnBhc3NpdmUuZGVmZW5jZSxcclxuXHRcdFx0cGFzc2l2ZUhlYWx0aE1heDogdGhpcy5wYXNzaXZlLmhlYWx0aE1heCxcclxuXHRcdFx0cGFzc2l2ZUVuZXJneU1heDogdGhpcy5wYXNzaXZlLmVuZXJneU1heCxcclxuXHRcdFx0cGFzc2l2ZVJhbmdlOiB0aGlzLnBhc3NpdmUucmFuZ2UsXHJcblx0XHRcdGVxdWlwcGVkRGFtYWdlOiB0aGlzLmVxdWlwcGVkLmRhbWFnZSxcclxuXHRcdFx0ZXF1aXBwZWREZWZlbmNlOiB0aGlzLmVxdWlwcGVkLmRlZmVuY2UsXHJcblx0XHRcdGVxdWlwcGVkSGVhbHRoTWF4OiB0aGlzLmVxdWlwcGVkLmhlYWx0aE1heCxcclxuXHRcdFx0ZXF1aXBwZWRFbmVyZ3lNYXg6IHRoaXMuZXF1aXBwZWQuZW5lcmd5TWF4LFxyXG5cdFx0XHRlcXVpcHBlZFJhbmdlOiB0aGlzLmVxdWlwcGVkLnJhbmdlLFxyXG5cdFx0XHRzdGFjazogdGhpcy5zdGFjayxcclxuXHRcdFx0aXNWaXNpYmxlOiB0aGlzLmlzVmlzaWJsZVxyXG5cdFx0fTtcclxuXHR9XHJcblx0XHJcblx0Z2V0UGFjaygpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGdhbWVJZDogdGhpcy5nYW1lSWQsXHJcblx0XHRcdHBsYXllcklkOiB0aGlzLnBsYXllcklkLFxyXG5cdFx0XHRib3RJZDogdGhpcy5ib3RJZCxcclxuXHRcdFx0c2xvdDogdGhpcy5zbG90LFxyXG5cdFx0XHRtYXBJZDogdGhpcy5tYXBJZCxcclxuXHRcdFx0eDogdGhpcy54LFxyXG5cdFx0XHR5OiB0aGlzLnksXHJcblx0XHRcdHo6IHRoaXMueixcclxuXHRcdFx0bmFtZTogdGhpcy5uYW1lLFxyXG5cdFx0XHRkZXNjcmlwdGlvbjogdGhpcy5kZXNjcmlwdGlvbixcclxuXHRcdFx0c3ByaXRlOiB0aGlzLnNwcml0ZSxcclxuXHRcdFx0dHlwZTogdGhpcy50eXBlLFxyXG5cdFx0XHRyZXVzYWJsZTogdGhpcy5yZXVzYWJsZSxcclxuXHRcdFx0cGFzc2l2ZTogdGhpcy5wYXNzaXZlLFxyXG5cdFx0XHRlcXVpcHBlZDogdGhpcy5lcXVpcHBlZCxcclxuXHRcdFx0c3RhY2s6IHRoaXMuc3RhY2ssXHJcblx0XHRcdGlzVmlzaWJsZTogdGhpcy5pc1Zpc2libGVcclxuXHRcdH07XHJcblx0fVxyXG5cdFxyXG5cdHJlbW92ZSgpIHtcclxuXHRcdGRlbGV0ZSBnYW1lLml0ZW1zW3RoaXMuZ2FtZUlkXTtcclxuXHR9XHJcblxyXG5cdHJlbW92ZU9uZSgpIHtcclxuXHRcdGlmICh0aGlzLnN0YWNrID4gMSkge1xyXG5cdFx0XHR0aGlzLnN0YWNrLS07XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0dGhpcy5yZW1vdmUoKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdG1vdmVUb0ludmVudG9yeShwbGF5ZXJJZCwgYm90SWQsIHNsb3QpIHtcclxuXHRcdHRoaXMucGxheWVySWQgPSBwbGF5ZXJJZDtcclxuXHRcdHRoaXMuYm90SWQgPSBib3RJZDtcclxuXHRcdHRoaXMuc2xvdCA9IHNsb3Q7XHJcblx0XHR0aGlzLm1hcElkID0gbnVsbDtcclxuXHRcdHRoaXMueCA9IG51bGw7XHJcblx0XHR0aGlzLnkgPSBudWxsO1xyXG5cdFx0dGhpcy56ID0gbnVsbDtcclxuXHR9XHJcblxyXG5cdG1vdmVUb01hcChtYXBJZCwgeCwgeSkge1xyXG5cdFx0dGhpcy5tYXBJZCA9IG1hcElkO1xyXG5cdFx0dGhpcy54ID0geDtcclxuXHRcdHRoaXMueSA9IHk7XHJcblx0XHR0aGlzLnogPSB0aGlzLmdldFpQb3NpdGlvbihtYXBJZCwgeCwgeSk7XHJcblx0XHR0aGlzLnBsYXllcklkID0gbnVsbDtcclxuXHRcdHRoaXMuYm90SWQgPSBudWxsO1xyXG5cdFx0dGhpcy5zbG90ID0gbnVsbDtcclxuXHR9XHJcblx0XHJcblx0Z2V0WlBvc2l0aW9uKG1hcElkLCB4LCB5KSB7XHJcblx0XHRyZXR1cm4gLTEwO1xyXG5cdH1cclxuXHJcblx0aXNFcXVpcG1lbnQoKSB7XHJcblx0XHRpZiAodGhpcy5lcXVpcHBlZFNsb3QgPj0gMCkge1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbiIsImltcG9ydCBjb25maWcgZnJvbSAnLi4vY29uZmlnLmpzJztcclxuaW1wb3J0IHV0aWwgZnJvbSAnLi4vdXRpbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXAge1xyXG5cdGNvbnN0cnVjdG9yKG1hcElkLCBkYXRhID0ge30pIHtcclxuXHRcdHRoaXMubWFwSWQgPSBtYXBJZDtcclxuXHJcblx0XHRpZiAoZGF0YS5uYW1lID09IG51bGwpIGRhdGEubmFtZSA9IFwiQmxhbmsgTWFwXCI7XHJcblx0XHRpZiAoZGF0YS5kcm9wQ2hhbmNlID09IG51bGwpIGRhdGEuZHJvcENoYW5jZSA9IDEwMDtcclxuXHRcdGlmIChkYXRhLmRyb3BBbW91bnRFUSA9PSBudWxsKSBkYXRhLmRyb3BBbW91bnRFUSA9IDE7XHJcblx0XHRpZiAoIWRhdGEudGlsZXMpIGRhdGEudGlsZXMgPSB1dGlsLmNyZWF0ZTNkQXJyYXkoY29uZmlnLk1BUF9DT0xVTU5TLCBjb25maWcuTUFQX1JPV1MsIGNvbmZpZy5NQVBfTEFZRVJTLCAwKTtcclxuXHRcdGlmICghZGF0YS5pc1dhbGwpIGRhdGEuaXNXYWxsID0gdXRpbC5jcmVhdGUyZEFycmF5KGNvbmZpZy5NQVBfQ09MVU1OUywgY29uZmlnLk1BUF9ST1dTLCBmYWxzZSk7XHJcblx0XHRpZiAoIWRhdGEuaXNIb3N0aWxlKSBkYXRhLmlzSG9zdGlsZSA9IHV0aWwuY3JlYXRlMmRBcnJheShjb25maWcuTUFQX0NPTFVNTlMsIGNvbmZpZy5NQVBfUk9XUywgZmFsc2UpO1xyXG5cdFx0aWYgKCFkYXRhLmRhbWFnZSkgZGF0YS5kYW1hZ2UgPSB1dGlsLmNyZWF0ZTJkQXJyYXkoY29uZmlnLk1BUF9DT0xVTU5TLCBjb25maWcuTUFQX1JPV1MsIG51bGwpO1xyXG5cdFx0aWYgKCFkYXRhLndhcnBNYXApIGRhdGEud2FycE1hcCA9IHV0aWwuY3JlYXRlMmRBcnJheShjb25maWcuTUFQX0NPTFVNTlMsIGNvbmZpZy5NQVBfUk9XUywgbnVsbCk7XHJcblx0XHRpZiAoIWRhdGEud2FycFgpIGRhdGEud2FycFggPSB1dGlsLmNyZWF0ZTJkQXJyYXkoY29uZmlnLk1BUF9DT0xVTU5TLCBjb25maWcuTUFQX1JPV1MsIG51bGwpO1xyXG5cdFx0aWYgKCFkYXRhLndhcnBZKSBkYXRhLndhcnBZID0gdXRpbC5jcmVhdGUyZEFycmF5KGNvbmZpZy5NQVBfQ09MVU1OUywgY29uZmlnLk1BUF9ST1dTLCBudWxsKTtcclxuXHJcblx0XHR0aGlzLm5hbWUgPSBkYXRhLm5hbWU7XHJcblx0XHR0aGlzLmRyb3BDaGFuY2UgPSB1dGlsLmNsYW1wKGRhdGEuZHJvcENoYW5jZSwgMCwgMTAwKTtcclxuXHRcdHRoaXMuZHJvcEFtb3VudEVRID0gdXRpbC5jbGFtcChkYXRhLmRyb3BBbW91bnRFUSwgMCwgY29uZmlnLkVRVUlQTUVOVF9TSVpFKTtcclxuXHRcdC8vdGhpcy5kcm9wQ2hhbmNlID0gMCA9IDAlIGNoYW5jZSB0byBkcm9wIGl0ZW1zIGluIGludmVudG9yeSAoZHJvcCBub3RoaW5nKSwgMTAwID0gMTAwJSBjaGFuY2UgdG8gZHJvcCAoZHJvcCBldmVyeXRoaW5nKVxyXG5cdFx0Ly90aGlzLmRyb3BBbW91bnRFUSA9IG51bWJlciBvZiBlcXVpcHBlZCBpdGVtcyB0aGUgcGxheWVyIHdpbGwgZHJvcCBvbiBkZWF0aC4gZHJvcEVRID0gRVFVSVBNRU5UX1NJWkUgPSBkcm9wIGFsbCBlcXVpcG1lbnRcclxuXHRcdHRoaXMudGlsZXMgPSBkYXRhLnRpbGVzO1xyXG5cdFx0dGhpcy5pc1dhbGwgPSBkYXRhLmlzV2FsbDtcclxuXHRcdHRoaXMuaXNIb3N0aWxlID0gZGF0YS5pc0hvc3RpbGU7XHJcblx0XHR0aGlzLmRhbWFnZSA9IGRhdGEuZGFtYWdlO1xyXG5cdFx0dGhpcy53YXJwTWFwID0gZGF0YS53YXJwTWFwO1xyXG5cdFx0dGhpcy53YXJwWCA9IGRhdGEud2FycFg7XHJcblx0XHR0aGlzLndhcnBZID0gZGF0YS53YXJwWTtcclxuXHR9XHJcblx0XHJcblx0dXBsb2FkKGRhdGEpIHtcclxuXHRcdGlmIChkYXRhLm5hbWUgIT0gbnVsbCkgdGhpcy5uYW1lID0gZGF0YS5uYW1lO1xyXG5cdFx0aWYgKGRhdGEuZHJvcENoYW5jZSAhPSBudWxsKSB0aGlzLmRyb3BDaGFuY2UgPSBkYXRhLmRyb3BDaGFuY2U7XHJcblx0XHRpZiAoZGF0YS5kcm9wQW1vdW50RVEgIT0gbnVsbCkgdGhpcy5kcm9wQW1vdW50RVEgPSBkYXRhLmRyb3BBbW91bnRFUTtcclxuXHRcdGlmIChkYXRhLnRpbGVzKSB0aGlzLnRpbGVzID0gZGF0YS50aWxlcztcclxuXHRcdGlmIChkYXRhLmlzV2FsbCkgdGhpcy5pc1dhbGwgPSBkYXRhLmlzV2FsbDtcclxuXHRcdGlmIChkYXRhLmlzSG9zdGlsZSkgdGhpcy5pc0hvc3RpbGUgPSBkYXRhLmlzSG9zdGlsZTtcclxuXHRcdGlmIChkYXRhLmRhbWFnZSkgdGhpcy5kYW1hZ2UgPSBkYXRhLmRhbWFnZTtcclxuXHRcdGlmIChkYXRhLndhcnBNYXApIHRoaXMud2FycE1hcCA9IGRhdGEud2FycE1hcDtcclxuXHRcdGlmIChkYXRhLndhcnBYKSB0aGlzLndhcnBYID0gZGF0YS53YXJwWDtcclxuXHRcdGlmIChkYXRhLndhcnBZKSB0aGlzLndhcnBZID0gZGF0YS53YXJwWTtcclxuXHR9XHJcblxyXG5cdGdldFBhY2soKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRtYXBJZDogdGhpcy5tYXBJZCxcclxuXHRcdFx0bmFtZTogdGhpcy5uYW1lLFxyXG5cdFx0XHRkcm9wQ2hhbmNlOiB0aGlzLmRyb3BDaGFuY2UsXHJcblx0XHRcdGRyb3BBbW91bnRFUTogdGhpcy5kcm9wQW1vdW50RVEsXHJcblx0XHRcdHRpbGVzOiB0aGlzLnRpbGVzLFxyXG5cdFx0XHRpc1dhbGw6IHRoaXMuaXNXYWxsLFxyXG5cdFx0XHRpc0hvc3RpbGU6IHRoaXMuaXNIb3N0aWxlLFxyXG5cdFx0XHRkYW1hZ2U6IHRoaXMuZGFtYWdlLFxyXG5cdFx0XHR3YXJwTWFwOiB0aGlzLndhcnBNYXAsXHJcblx0XHRcdHdhcnBYOiB0aGlzLndhcnBYLFxyXG5cdFx0XHR3YXJwWTogdGhpcy53YXJwWVxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdGdldFVwZGF0ZVBhY2soKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRtYXBJZDogdGhpcy5tYXBJZCxcclxuXHRcdFx0bmFtZTogdGhpcy5uYW1lLFxyXG5cdFx0XHR0aWxlczogdGhpcy50aWxlc1xyXG5cdFx0fTtcclxuXHR9XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWVzc2FnZSB7XHJcblx0Y29uc3RydWN0b3Ioc2VuZGVySWQsIG1lc3NhZ2UsIHR5cGUsIG1hcElkLCBpZCwgY29sb3VyKSB7XHJcblx0XHR0aGlzLnNlbmRlcklkID0gc2VuZGVySWQ7IC8vIG51bGwgPSBzZXJ2ZXJcclxuXHRcdHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XHJcblx0XHR0aGlzLnR5cGUgPSB0eXBlO1xyXG5cdFx0dGhpcy5tYXBJZCA9IG1hcElkO1xyXG5cdFx0dGhpcy5pZCA9IGlkO1xyXG5cdFx0dGhpcy5jb2xvdXIgPSBjb2xvdXI7XHJcblx0fVxyXG59IiwiaW1wb3J0IGdhbWUgZnJvbSAnLi4vZ2FtZS5qcyc7XHJcbmltcG9ydCBjb25maWcgZnJvbSAnLi4vY29uZmlnLmpzJztcclxuaW1wb3J0IHV0aWwgZnJvbSAnLi4vdXRpbC5qcyc7XHJcbmltcG9ydCBBY3RvciBmcm9tICcuL2FjdG9yLmpzJztcclxuXHJcbi8vIEEgUGxheWVyIGlzIGFuIGltbW9ydGFsIEFjdG9yIHdoaWNoIHRha2VzIGlucHV0IGZyb20gYSBjbGllbnRcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXllciBleHRlbmRzIEFjdG9yIHtcclxuXHRjb25zdHJ1Y3Rvcihzb2NrZXRJZCwgZGF0YSkge1xyXG5cdFx0aWYgKGRhdGEuc3ByaXRlID09IG51bGwpIGRhdGEuc3ByaXRlID0gZGF0YS50ZW1wbGF0ZS5zcHJpdGU7XHJcblxyXG5cdFx0c3VwZXIoZGF0YS5tYXBJZCwgZGF0YS54LCBkYXRhLnksIGRhdGEuZGlyZWN0aW9uLCBkYXRhLm5hbWUsIGRhdGEuc3ByaXRlKTtcclxuXHRcdHRoaXMucGxheWVySWQgPSBkYXRhLl9pZDtcclxuXHRcdHRoaXMuc29ja2V0SWQgPSBzb2NrZXRJZDtcclxuXHRcdHRoaXMuYWNjb3VudElkID0gZGF0YS5hY2NvdW50O1xyXG5cdFx0dGhpcy5hZG1pbkFjY2VzcyA9IGRhdGEuYWRtaW5BY2Nlc3M7XHJcblxyXG5cdFx0dGhpcy5sZXZlbCA9IGRhdGEubGV2ZWw7XHJcblx0XHR0aGlzLmV4cGVyaWVuY2UgPSBkYXRhLmV4cGVyaWVuY2U7XHJcblx0XHR0aGlzLnRlbXBsYXRlSWQgPSBkYXRhLnRlbXBsYXRlLl9pZDtcclxuXHRcdHRoaXMudGVtcGxhdGUgPSBkYXRhLnRlbXBsYXRlLm5hbWU7XHJcblx0XHR0aGlzLmNhbGNCYXNlU3RhdHMoZGF0YS50ZW1wbGF0ZSk7XHJcblx0XHR0aGlzLmNhbGNCb251c1N0YXRzKCk7XHJcblx0XHR0aGlzLnJlc3RvcmUoKTtcclxuXHJcblx0XHR0aGlzLmlzRGVhZCA9IGZhbHNlO1xyXG5cdFx0dGhpcy5kZWF0aHMgPSAwO1xyXG5cdFx0dGhpcy5yZXNwYXduVGltZXIgPSAwO1xyXG5cdFx0dGhpcy5yZXNwYXduU3BlZWQgPSAxMDtcclxuXHRcdHRoaXMucmVzcGF3bk1hcCA9IGRhdGEubWFwSWQ7XHJcblx0XHR0aGlzLnJlc3Bhd25YID0gZGF0YS54O1xyXG5cdFx0dGhpcy5yZXNwYXduWSA9IGRhdGEueTtcclxuXHJcblx0XHR0aGlzLmlucHV0ID0ge1xyXG5cdFx0XHRkaXJlY3Rpb246IG51bGwsXHJcblx0XHRcdHJ1bjogZmFsc2UsXHJcblx0XHRcdHBpY2t1cDogZmFsc2UsXHJcblx0XHRcdGF0dGFjazogZmFsc2VcclxuXHRcdH07XHJcblxyXG5cdFx0dGhpcy5nYW1lSWQgPSB1dGlsLmZpcnN0RW1wdHlJbmRleChnYW1lLnBsYXllcnMpO1xyXG5cdFx0Z2FtZS5wbGF5ZXJzW3RoaXMuZ2FtZUlkXSA9IHRoaXM7XHJcblx0fVxyXG5cclxuXHR1cGRhdGUoZGVsdGEpIHtcclxuXHRcdHN1cGVyLnVwZGF0ZShkZWx0YSk7XHRcdC8vIERlZmF1bHQgQWN0b3IgVXBkYXRlXHJcblx0XHRpZiAodGhpcy5pc0RlYWQpIHtcclxuXHRcdFx0Ly8gUmVzcGF3bmluZ1xyXG5cdFx0XHR0aGlzLnJlc3Bhd25UaW1lciArPSBkZWx0YTtcclxuXHRcdFx0aWYgKHRoaXMucmVzcGF3blRpbWVyID49IHRoaXMucmVzcGF3blNwZWVkKSB0aGlzLnJlc3Bhd24oKTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHQvLyBDaGVjayBmb3IgQXR0YWNrIElucHV0XHJcblx0XHRcdGlmICh0aGlzLmlucHV0LmF0dGFjayAmJiB0aGlzLmF0dGFja1RpbWVyID09PSAwKSB0aGlzLmF0dGFjaygpO1xyXG5cdFx0XHRcclxuXHRcdFx0Ly8gQ2hlY2sgZm9yIE1vdmVtZW50IElucHV0XHJcblx0XHRcdGlmICghdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdHRoaXMuaXNSdW5uaW5nID0gZmFsc2U7XHJcblx0XHRcdFx0aWYgKHRoaXMuaW5wdXQuZGlyZWN0aW9uKSB7XHJcblx0XHRcdFx0XHQvLyBDaGVjayBmb3IgUnVuIElucHV0XHJcblx0XHRcdFx0XHRpZiAodGhpcy5pbnB1dC5ydW4gJiYgdGhpcy5lbmVyZ3kgPiAwKSB0aGlzLmlzUnVubmluZyA9IHRydWU7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUodGhpcy5pbnB1dC5kaXJlY3Rpb24pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gdGhpcy5nZXRHYW1lUGFjaygpO1xyXG5cdH1cclxuXHRcclxuXHRnZXRHYW1lUGFjaygpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGdhbWVJZDogdGhpcy5nYW1lSWQsXHJcblx0XHRcdG5hbWU6IHRoaXMubmFtZSxcclxuXHRcdFx0ZGVzY3JpcHRpb246IHRoaXMuZGVzY3JpcHRpb24sXHJcblx0XHRcdHNwcml0ZTogdGhpcy5zcHJpdGUsXHJcblx0XHRcdGRpcmVjdGlvbjogdGhpcy5kaXJlY3Rpb24sXHJcblx0XHRcdG1hcElkOiB0aGlzLm1hcElkLFxyXG5cdFx0XHR4OiB0aGlzLnN0YXJ0WCxcclxuXHRcdFx0eTogdGhpcy5zdGFydFksXHJcblx0XHRcdHo6IHRoaXMueixcclxuXHRcdFx0ZGVzdGluYXRpb25YOiB0aGlzLmRlc3RpbmF0aW9uWCxcclxuXHRcdFx0ZGVzdGluYXRpb25ZOiB0aGlzLmRlc3RpbmF0aW9uWSxcclxuXHRcdFx0bGVycDogdGhpcy5sZXJwLFxyXG5cdFx0XHRpc1J1bm5pbmc6IHRoaXMuaXNSdW5uaW5nLFxyXG5cdFx0XHRpc0F0dGFja2luZzogdGhpcy5pc0F0dGFja2luZyxcclxuXHRcdFx0aXNEZWFkOiB0aGlzLmlzRGVhZCxcclxuXHRcdFx0aXNWaXNpYmxlOiB0aGlzLmlzVmlzaWJsZVxyXG5cdFx0fTtcclxuXHR9XHJcblx0XHJcblx0Z2V0VUlQYWNrKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0bGV2ZWw6IHRoaXMubGV2ZWwsXHJcblx0XHRcdGV4cGVyaWVuY2U6IHRoaXMuZXhwZXJpZW5jZSxcclxuXHRcdFx0aGVhbHRoOiB0aGlzLmhlYWx0aCxcclxuXHRcdFx0aGVhbHRoTWF4OiB0aGlzLmhlYWx0aE1heCxcclxuXHRcdFx0ZW5lcmd5OiB0aGlzLmVuZXJneSxcclxuXHRcdFx0ZW5lcmd5TWF4OiB0aGlzLmVuZXJneU1heCxcclxuXHRcdFx0bW92ZVNwZWVkOiB0aGlzLm1vdmVTcGVlZCxcclxuXHRcdFx0YXR0YWNrU3BlZWQ6IHRoaXMuYXR0YWNrU3BlZWQsXHJcblx0XHRcdGF0dGFja1RpbWVyOiB0aGlzLmF0dGFja1RpbWVyLFxyXG5cdFx0XHRpbnZlbnRvcnk6IHRoaXMuZ2V0SW52ZW50b3J5UGFjaygpXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0Z2V0REJQYWNrKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0bmFtZTogdGhpcy5uYW1lLFxyXG5cdFx0XHRhY2NvdW50OiB0aGlzLmFjY291bnRJZCxcclxuXHRcdFx0dGVtcGxhdGU6IHRoaXMudGVtcGxhdGVJZCxcclxuXHRcdFx0bGV2ZWw6IHRoaXMubGV2ZWwsXHJcblx0XHRcdGV4cGVyaWVuY2U6IHRoaXMuZXhwZXJpZW5jZSxcclxuXHRcdFx0bWFwSWQ6IHRoaXMubWFwSWQsXHJcblx0XHRcdHg6IHRoaXMueCxcclxuXHRcdFx0eTogdGhpcy55LFxyXG5cdFx0XHRkaXJlY3Rpb246IHRoaXMuZGlyZWN0aW9uLFxyXG5cdFx0XHRhZG1pbkFjY2VzczogdGhpcy5hZG1pbkFjY2VzcyxcclxuXHRcdFx0c3ByaXRlOiB0aGlzLnNwcml0ZVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0aW5wdXREYXRhKGRhdGEpIHtcclxuXHRcdGlmICh0aGlzLmlzRGVhZCkge1xyXG5cdFx0XHRnYW1lLnNlbmRHYW1lSW5mb1BsYXllcih0aGlzLmdhbWVJZCwgXCJZb3UgYXJlIGRlYWQuXCIpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGdhbWUuZ29kQ29tbWFuZHNbZGF0YS5pbnB1dF0pIHtcclxuXHRcdFx0aWYgKHRoaXMuYWRtaW5BY2Nlc3MgPiAwKSBnYW1lLmdvZENvbW1hbmRzW2RhdGEuaW5wdXRdKGRhdGEsIHRoaXMpO1xyXG5cdFx0XHRlbHNlIGdhbWUuc2VuZEdhbWVJbmZvUGxheWVyKHRoaXMuZ2FtZUlkLCBcIllvdSBkb24ndCBoYXZlIGFjY2VzcyB0byB0aGF0IGNvbW1hbmQuXCIpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGlmIChnYW1lLmNvbW1hbmRzW2RhdGEuaW5wdXRdKSBnYW1lLmNvbW1hbmRzW2RhdGEuaW5wdXRdKGRhdGEsIHRoaXMpO1xyXG5cdFx0XHRlbHNlIGdhbWUuc2VuZEdhbWVJbmZvUGxheWVyKHRoaXMuZ2FtZUlkLCBcIkludmFsaWQgY29tbWFuZC5cIik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwaWNrVXAoKSB7XHJcblx0XHRpZiAoc3VwZXIucGlja1VwKCkgPT09IGZhbHNlKSBnYW1lLnNlbmRHYW1lSW5mb1BsYXllcih0aGlzLmdhbWVJZCwgXCJZb3VyIGludmVudG9yeSBpcyBmdWxsLlwiKTtcclxuXHR9XHJcblx0XHJcblx0Z2V0SW52ZW50b3J5KCkge1xyXG5cdFx0Y29uc3QgaW52ZW50b3J5ID0gZ2FtZS5pdGVtcy5maWx0ZXIoaXRlbSA9PiB7XHJcblx0XHRcdHJldHVybiBcIlwiK2l0ZW0ucGxheWVySWQgPT09IFwiXCIrdGhpcy5wbGF5ZXJJZDtcclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIGludmVudG9yeTtcclxuXHR9XHJcblxyXG5cdHNldERlYWQoKSB7XHJcblx0XHRzdXBlci5zZXREZWFkKCk7XHJcblx0XHR0aGlzLmlzRGVhZCA9IHRydWU7XHJcblx0XHR0aGlzLmhlYWx0aCA9IDA7XHJcblx0XHR0aGlzLmVuZXJneSA9IDA7XHJcblx0XHR0aGlzLmRlYXRocysrO1xyXG5cdH1cclxuXHJcblx0cmVzcGF3bigpIHtcclxuXHRcdHRoaXMubWFwSWQgPSB0aGlzLnJlc3Bhd25NYXA7XHJcblx0XHR0aGlzLnggPSB0aGlzLnJlc3Bhd25YO1xyXG5cdFx0dGhpcy55ID0gdGhpcy5yZXNwYXduWTtcclxuXHRcdHRoaXMuc3RhcnRYID0gdGhpcy5yZXNwYXduWDtcclxuXHRcdHRoaXMuc3RhcnRZID0gdGhpcy5yZXNwYXduWTtcclxuXHRcdHRoaXMuZGVzdGluYXRpb25YID0gdGhpcy5yZXNwYXduWDtcclxuXHRcdHRoaXMuZGVzdGluYXRpb25ZID0gdGhpcy5yZXNwYXduWTtcclxuXHRcdFxyXG5cdFx0dGhpcy5jYWxjQm9udXNTdGF0cygpO1xyXG5cdFx0dGhpcy5yZXN0b3JlKCk7XHJcblx0XHRcclxuXHRcdHRoaXMuaXNXYWxraW5nID0gZmFsc2U7XHJcblx0XHR0aGlzLmlzUnVubmluZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy5pc0F0dGFja2luZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy5pc0RlYWQgPSBmYWxzZTtcclxuXHRcdHRoaXMucmVzcGF3blRpbWVyID0gMDtcclxuXHRcdGdhbWUuc2VuZEdhbWVJbmZvUGxheWVyKHRoaXMuZ2FtZUlkLCBcIlRoZSBBbmdlbCBvZiBNZXJjeSByZWZ1c2VzIHRvIGxldCB5b3UgZGllLlwiKTtcclxuXHR9XHJcblxyXG5cdGdhaW5FeHBlcmllbmNlKGV4cGVyaWVuY2UpIHtcclxuXHRcdGlmICh0aGlzLmV4cGVyaWVuY2UgKyBleHBlcmllbmNlIDw9IDApIHtcclxuXHRcdFx0dGhpcy5leHBlcmllbmNlID0gMDtcdFxyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5leHBlcmllbmNlICs9IGV4cGVyaWVuY2U7XHJcblx0XHRpZiAodGhpcy5leHBlcmllbmNlID49IGdhbWUuZXhwZXJpZW5jZVRvTGV2ZWxbdGhpcy5sZXZlbF0pIHtcclxuXHRcdFx0dGhpcy5sZXZlbFVwKCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRsZXZlbFVwKCkge1xyXG5cdFx0aWYgKHRoaXMubGV2ZWwgPCBjb25maWcuTUFYX0xFVkVMKSB7XHJcblx0XHRcdGNvbnN0IHJvbGxvdmVyRXhwZXJpZW5jZSA9IHRoaXMuZXhwZXJpZW5jZSAtIGdhbWUuZXhwZXJpZW5jZVRvTGV2ZWxbdGhpcy5sZXZlbF07XHJcblx0XHRcdHRoaXMuZXhwZXJpZW5jZSA9IDA7XHJcblx0XHRcdHRoaXMubGV2ZWwrKztcclxuXHRcdFx0dGhpcy5jYWxjQmFzZVN0YXRzKCk7XHJcblx0XHRcdGdhbWUuc2VuZEdhbWVJbmZvUGxheWVyKHRoaXMuZ2FtZUlkLCBgTGV2ZWwgdXAhIFlvdSBhcmUgbm93IGxldmVsICR7dGhpcy5sZXZlbH0hYCk7XHJcblx0XHRcdHRoaXMuZ2FpbkV4cGVyaWVuY2Uocm9sbG92ZXJFeHBlcmllbmNlKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0Y2FsY0Jhc2VTdGF0cyh0ZW1wbGF0ZSkge1xyXG5cdFx0aWYgKCF0ZW1wbGF0ZSkgdGVtcGxhdGUgPSBnYW1lLnBsYXllclRlbXBsYXRlc1t0aGlzLnRlbXBsYXRlSWRdO1xyXG5cdFx0c3VwZXIuY2FsY0Jhc2VTdGF0cyh0ZW1wbGF0ZSk7XHJcblx0fVxyXG59XHJcbiIsImltcG9ydCBnYW1lIGZyb20gJy4uL2dhbWUuanMnO1xyXG5pbXBvcnQgdXRpbCBmcm9tICcuLi91dGlsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRleHQge1xyXG5cdGNvbnN0cnVjdG9yKG1hcElkLCB4LCB5LCBtZXNzYWdlLCBjb2xvdXIgPSAnIzAwMDAwMCcsIGRpc3BsYXlUaW1lID0gMiwgdmVsWCA9IDAsIHZlbFkgPSAwKSB7XHJcblx0XHR0aGlzLm1hcElkID0gbWFwSWQ7XHJcblx0XHR0aGlzLnggPSB4O1xyXG5cdFx0dGhpcy55ID0geTtcclxuXHRcdHRoaXMudmVsWCA9IHZlbFg7XHJcblx0XHR0aGlzLnZlbFkgPSB2ZWxZO1xyXG5cdFx0dGhpcy5sZXJwWCA9IDA7XHJcblx0XHR0aGlzLmxlcnBZID0gMDtcclxuXHJcblx0XHR0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xyXG5cdFx0dGhpcy5jb2xvdXIgPSBjb2xvdXI7XHJcblx0XHR0aGlzLmRpc3BsYXlUaW1lID0gZGlzcGxheVRpbWU7XHJcblx0XHR0aGlzLnRpbWVyID0gMDtcclxuXHJcblx0XHR0aGlzLmdhbWVJZCA9IHV0aWwuZmlyc3RFbXB0eUluZGV4KGdhbWUudGV4dHMpO1xyXG5cdFx0Z2FtZS50ZXh0c1t0aGlzLmdhbWVJZF0gPSB0aGlzO1xyXG5cdH1cclxuXHRcclxuXHR1cGRhdGUoZGVsdGEpIHtcclxuXHRcdHRoaXMudGltZXIgKz0gZGVsdGE7XHJcblx0XHRpZiAodGhpcy5kaXNwbGF5VGltZSA+IDAgJiYgdGhpcy50aW1lciA+IHRoaXMuZGlzcGxheVRpbWUpIHtcclxuXHRcdFx0dGhpcy5yZW1vdmUoKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLmxlcnBYICs9IGRlbHRhICogdGhpcy52ZWxYO1xyXG5cdFx0dGhpcy5sZXJwWSArPSBkZWx0YSAqIHRoaXMudmVsWTtcclxuXHJcblx0XHRpZiAodGhpcy5sZXJwWCA8IC0xKSB7XHJcblx0XHRcdHRoaXMubGVycFgrKztcclxuXHRcdFx0dGhpcy54LS07XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmICh0aGlzLmxlcnBYID4gMSkge1xyXG5cdFx0XHR0aGlzLmxlcnBYLS07XHJcblx0XHRcdHRoaXMueCsrO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLmxlcnBZIDwgLTEpIHtcclxuXHRcdFx0dGhpcy5sZXJwWSsrO1xyXG5cdFx0XHR0aGlzLnktLTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKHRoaXMubGVycFkgPiAxKSB7XHJcblx0XHRcdHRoaXMubGVycFktLTtcclxuXHRcdFx0dGhpcy55Kys7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiB0aGlzLmdldFBhY2soKTtcclxuXHR9XHJcblx0XHJcblx0Z2V0UGFjaygpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGdhbWVJZDogdGhpcy5nYW1lSWQsXHJcblx0XHRcdG1hcElkOiB0aGlzLm1hcElkLFxyXG5cdFx0XHR4OiB0aGlzLngsXHJcblx0XHRcdHk6IHRoaXMueSxcclxuXHRcdFx0bGVycFg6IHRoaXMubGVycFgsXHJcblx0XHRcdGxlcnBZOiB0aGlzLmxlcnBZLFxyXG5cdFx0XHRtZXNzYWdlOiB0aGlzLm1lc3NhZ2UsXHJcblx0XHRcdGNvbG91cjogdGhpcy5jb2xvdXJcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHRyZW1vdmUoKSB7XHJcblx0XHRkZWxldGUgZ2FtZS50ZXh0c1t0aGlzLmdhbWVJZF07XHJcblx0fVxyXG59XHJcbiIsImNvbnN0IGNvbmZpZyA9IHt9O1xyXG5cclxuY29uZmlnLlBPUlQgPSAyMDAwO1xyXG5jb25maWcuRlJBTUVSQVRFID0gMTAwMCAvIDYwO1xyXG5jb25maWcuQkFDS1VQX1RJTUUgPSAxMjA7XHJcblxyXG5jb25maWcuTUFQX0xBWUVSUyA9IDY7XHJcbmNvbmZpZy5NQVBfQ09MVU1OUyA9IDEyO1xyXG5jb25maWcuTUFQX1JPV1MgPSAxMjtcclxuXHJcbmNvbmZpZy5NQVhfTUFQUyA9IDEwO1xyXG5jb25maWcuTUFYX1VTRVJTID0gMTAwO1xyXG5jb25maWcuTUFYX1NQUklURVMgPSAxMztcclxuY29uZmlnLk1BWF9FRkZFQ1RTID0gNzE7XHJcbmNvbmZpZy5NQVhfTEVWRUwgPSAzMDtcclxuXHJcbmNvbmZpZy5NQVhfSEVBTFRIX0JBU0UgPSAyMDA7XHJcbmNvbmZpZy5NQVhfSEVBTFRIX0JPTlVTID0gNTU7XHJcbmNvbmZpZy5NQVhfRU5FUkdZX0JBU0UgPSAyMDA7XHJcbmNvbmZpZy5NQVhfRU5FUkdZX0JPTlVTID0gNTU7XHJcblxyXG5jb25maWcuSU5WRU5UT1JZX1NJWkUgPSAyMDtcclxuY29uZmlnLkVRVUlQTUVOVF9TSVpFID0gNTtcclxuXHJcbmNvbmZpZy5JVEVNX1RZUEVTID0gW1xyXG4gIHtuYW1lOiBcIk5vcm1hbFwiLCBlcXVpcHBlZFNsb3Q6IG51bGwsIHN0YWNrYWJsZTogZmFsc2V9LFxyXG4gIHtuYW1lOiBcIlN0YWNraW5nXCIsIGVxdWlwcGVkU2xvdDogbnVsbCwgc3RhY2thYmxlOiB0cnVlfSxcclxuICB7bmFtZTogXCJXZWFwb25cIiwgZXF1aXBwZWRTbG90OiAwLCBzdGFja2FibGU6IGZhbHNlfSxcclxuICB7bmFtZTogXCJTaGllbGRcIiwgZXF1aXBwZWRTbG90OiAxLCBzdGFja2FibGU6IGZhbHNlfSxcclxuICB7bmFtZTogXCJBcm1vdXJcIiwgZXF1aXBwZWRTbG90OiAyLCBzdGFja2FibGU6IGZhbHNlfSxcclxuICB7bmFtZTogXCJIZWxtZXRcIiwgZXF1aXBwZWRTbG90OiAzLCBzdGFja2FibGU6IGZhbHNlfSxcclxuICB7bmFtZTogXCJSaW5nXCIsIGVxdWlwcGVkU2xvdDogNCwgc3RhY2thYmxlOiBmYWxzZX1cclxuXTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNvbmZpZztcclxuIiwiaW1wb3J0IG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcclxuaW1wb3J0IGJjcnlwdCBmcm9tICdiY3J5cHQnO1xyXG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xyXG5cclxuaW1wb3J0IHV0aWwgZnJvbSBcIi4vdXRpbC5qc1wiO1xyXG5pbXBvcnQgQWNjb3VudCBmcm9tICcuL21vZGVscy9hY2NvdW50LmpzJztcclxuaW1wb3J0IFBsYXllciBmcm9tICcuL21vZGVscy9wbGF5ZXIuanMnO1xyXG5pbXBvcnQgUGxheWVyVGVtcGxhdGUgZnJvbSAnLi9tb2RlbHMvcGxheWVyVGVtcGxhdGUuanMnO1xyXG5pbXBvcnQgQm90IGZyb20gJy4vbW9kZWxzL2JvdC5qcyc7XHJcbmltcG9ydCBCb3RUZW1wbGF0ZSBmcm9tICcuL21vZGVscy9ib3RUZW1wbGF0ZS5qcyc7XHJcbmltcG9ydCBJdGVtIGZyb20gJy4vbW9kZWxzL2l0ZW0uanMnO1xyXG5pbXBvcnQgSXRlbVRlbXBsYXRlIGZyb20gJy4vbW9kZWxzL2l0ZW1UZW1wbGF0ZS5qcyc7XHJcbmltcG9ydCBJdGVtVHlwZSBmcm9tICcuL21vZGVscy9pdGVtVHlwZS5qcyc7XHJcbmltcG9ydCBNYXAgZnJvbSAnLi9tb2RlbHMvbWFwLmpzJztcclxuXHJcbmNvbnN0IGZzcCA9IGZzLnByb21pc2VzO1xyXG5tb25nb29zZS5Qcm9taXNlID0gUHJvbWlzZTtcclxubW9uZ29vc2UuY29ubmVjdCgnbW9uZ29kYjovL2xvY2FsaG9zdC9vZHlzc2V5Jywge3VzZU5ld1VybFBhcnNlcjogdHJ1ZX0pO1xyXG5cclxuY2xhc3MgRGF0YWJhc2Uge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0dGhpcy5zZXJ2ZXJMb2cgPSBbXTtcclxuXHR9XHJcblxyXG5cdGFzeW5jIGJhY2t1cChkYXRhID0ge30pIHtcclxuXHRcdC8vVE9ETyBzYXZlIGV2ZXJ5dGhpbmdcclxuXHRcdC8vIGNvbnN0IG1hcHMgPSBzYXZlLWFsbC1tYXBzXHJcblx0XHRsZXQgcGxheWVycyA9IHRoaXMuc2F2ZU9ubGluZVBsYXllcnMoZGF0YS5wbGF5ZXJzKTtcclxuXHRcdGNvbnN0IGJvdHMgPSB0aGlzLnNhdmVBbGxCb3RzKGRhdGEuYm90cyk7XHJcblx0XHRsZXQgaXRlbXMgPSB0aGlzLnNhdmVBbGxJdGVtcyhkYXRhLml0ZW1zKTtcclxuXHRcdGxldCBsb2dTYXZlZCA9IHRoaXMuc2F2ZUxvZygpO1xyXG5cdFx0UHJvbWlzZS5hbGwoW3BsYXllcnMsIGJvdHMsIGl0ZW1zLCBsb2dTYXZlZF0pXHJcblx0XHQudGhlbigoKSA9PiB0aGlzLmxvZyhcIkdhbWUgc2F2ZWQgdG8gZGlzay5cIikpO1xyXG5cdH1cclxuXHRcclxuXHRsb2cobWVzc2FnZSkge1xyXG5cdFx0Y29uc3QgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcblx0XHRjb25zb2xlLmxvZyh1dGlsLnRpbWVzdGFtcChkYXRlKSArIFwiIC0gXCIgKyBtZXNzYWdlKTtcclxuXHRcdHRoaXMuc2VydmVyTG9nLnB1c2goe1xyXG5cdFx0XHRtZXNzYWdlLFxyXG5cdFx0XHRkYXRlXHJcblx0XHR9KTtcclxuXHR9XHJcblx0YXN5bmMgc2F2ZUxvZygpIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGNvbnN0IHNhdmVkTG9nID0gYXdhaXQgZnNwLnJlYWRGaWxlKCcuL3NlcnZlci9sb2cuanNvbicpO1xyXG5cdFx0XHRjb25zdCBuZXdMb2cgPSBKU09OLnBhcnNlKHNhdmVkTG9nKS5jb25jYXQodGhpcy5zZXJ2ZXJMb2cpO1xyXG5cdFx0XHR0aGlzLnNlcnZlckxvZyA9IFtdO1xyXG5cdFx0XHRhd2FpdCBmc3Aud3JpdGVGaWxlKCcuL3NlcnZlci9sb2cuanNvbicsIEpTT04uc3RyaW5naWZ5KG5ld0xvZykpO1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGNhdGNoKGVycikge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0fVxyXG5cdGFzeW5jIGNsZWFyTG9nKCkge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0dGhpcy5zZXJ2ZXJMb2cgPSBbXTtcclxuXHRcdFx0YXdhaXQgZnNwLndyaXRlRmlsZSgnLi9zZXJ2ZXIvbG9nLmpzb24nLCBcIltdXCIpO1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGNhdGNoIChlcnIpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Z2VuZXJhdGVJZCgpIHtcclxuXHRcdHJldHVybiBuZXcgbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQ7XHJcblx0fVxyXG5cdGFzeW5jIGhhc2hQYXNzd29yZChwYXNzd29yZCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0YmNyeXB0Lmhhc2gocGFzc3dvcmQsIDEwLCAoZXJyLCBoYXNoKSA9PiB7XHJcblx0XHRcdFx0aWYgKGVycikgcmVqZWN0KGVycik7XHJcblx0XHRcdFx0ZWxzZSByZXNvbHZlKGhhc2gpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRhc3luYyBjb21wYXJlUGFzc3dvcmQocGFzc3dvcmQsIGhhc2hlZFBhc3N3b3JkKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHRiY3J5cHQuY29tcGFyZShwYXNzd29yZCwgaGFzaGVkUGFzc3dvcmQsIChlcnIsIG1hdGNoKSA9PiB7XHJcblx0XHRcdFx0aWYgKGVycikgcmVqZWN0KGVycik7XHJcblx0XHRcdFx0ZWxzZSByZXNvbHZlKG1hdGNoKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0YXN5bmMgYXV0aEFjY291bnQodXNlcm5hbWUsIHBhc3N3b3JkKSB7XHJcblx0XHRsZXQgYWNjb3VudCA9IGF3YWl0IEFjY291bnQuZmluZE9uZSh7dXNlcm5hbWU6IHVzZXJuYW1lfSkuZXhlYygpO1xyXG5cdFx0aWYgKCFhY2NvdW50KSByZXR1cm4gZmFsc2U7XHJcblx0XHRcclxuXHRcdHJldHVybiB0aGlzLmNvbXBhcmVQYXNzd29yZChwYXNzd29yZCwgYWNjb3VudC5wYXNzd29yZCk7XHJcblx0fVxyXG5cclxuXHRhc3luYyBhZGRBY2NvdW50KHVzZXJuYW1lLCBwYXNzd29yZCwgZW1haWwpIHtcclxuXHRcdGxldCBhZG1pbiA9IGZhbHNlO1xyXG5cdFx0bGV0IGFjY291bnRzID0gYXdhaXQgdGhpcy5nZXRBbGxBY2NvdW50cygpO1xyXG5cdFx0aWYgKGFjY291bnRzLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0XHRhZG1pbiA9IHRydWU7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0bGV0IGV4aXN0aW5nQWNjb3VudCA9IGFjY291bnRzLmZpbmQoYWNjb3VudCA9PiBhY2NvdW50LnVzZXJuYW1lID09PSB1c2VybmFtZSlcclxuXHRcdFx0aWYgKGV4aXN0aW5nQWNjb3VudCkge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGBBY2NvdW50IGFscmVhZHkgZXhpc3RzIHdpdGggdXNlcm5hbWUgJHt1c2VybmFtZX0uYCk7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgaGFzaGVkUGFzc3dvcmQgPSBhd2FpdCB0aGlzLmhhc2hQYXNzd29yZChwYXNzd29yZCk7XHJcblx0XHRhY2NvdW50ID0gbmV3IEFjY291bnQoe1xyXG5cdFx0XHRfaWQ6IG5ldyBtb25nb29zZS5UeXBlcy5PYmplY3RJZCxcclxuXHRcdFx0dXNlcm5hbWUsXHJcblx0XHRcdHBhc3N3b3JkOiBoYXNoZWRQYXNzd29yZCxcclxuXHRcdFx0ZW1haWwsXHJcblx0XHRcdHZlcmlmaWVkOiBmYWxzZSxcclxuXHRcdFx0YWRtaW5cclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBhd2FpdCBhY2NvdW50LnNhdmUoKVxyXG5cdFx0LnRoZW4ocmVzdWx0ID0+IGFjY291bnQuX2lkKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgZ2V0QWNjb3VudChhY2NvdW50SWQpIHtcclxuXHRcdHJldHVybiBhd2FpdCBBY2NvdW50LmZpbmRCeUlkKGFjY291bnRJZClcclxuXHRcdC5zZWxlY3QoJ19pZCB1c2VybmFtZSBwYXNzd29yZCBlbWFpbCB2ZXJpZmllZCBhZG1pbicpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbihhY2NvdW50ID0+IGFjY291bnQpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBnZXRBY2NvdW50QnlVc2VybmFtZSh1c2VybmFtZSkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IEFjY291bnQuZmluZE9uZSh7dXNlcm5hbWU6IHVzZXJuYW1lfSlcclxuXHRcdC5zZWxlY3QoJ19pZCB1c2VybmFtZSBwYXNzd29yZCBlbWFpbCB2ZXJpZmllZCBhZG1pbicpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbihhY2NvdW50ID0+IGFjY291bnQpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBnZXRBY2NvdW50SWQodXNlcm5hbWUpIHtcclxuXHRcdHJldHVybiBhd2FpdCBBY2NvdW50LmZpbmRPbmUoe3VzZXJuYW1lOiB1c2VybmFtZX0pXHJcblx0XHQuc2VsZWN0KCdfaWQnKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4oYWNjb3VudCA9PiB7XHJcblx0XHRcdGlmIChhY2NvdW50KSB7XHJcblx0XHRcdFx0cmV0dXJuIGFjY291bnQuX2lkO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgZ2V0QWxsQWNjb3VudHMoKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgQWNjb3VudC5maW5kKHt9KVxyXG5cdFx0LnNlbGVjdCgnX2lkIHVzZXJuYW1lIHBhc3N3b3JkIGVtYWlsIHZlcmlmaWVkIGFkbWluJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKGFjY291bnRzID0+IGFjY291bnRzKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgc2F2ZUFjY291bnQoZGF0YSkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IEFjY291bnQudXBkYXRlT25lKHt1c2VybmFtZTogZGF0YS51c2VybmFtZX0sIHskc2V0OiBkYXRhfSlcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHJlc3VsdCA9PiB0cnVlKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblxyXG5cdGFzeW5jIGFkZFBsYXllcihhY2NvdW50SWQsIG5hbWUsIHRlbXBsYXRlSWQpIHtcclxuXHRcdGxldCBhY2NvdW50ID0gYXdhaXQgdGhpcy5nZXRBY2NvdW50KGFjY291bnRJZCk7XHJcblx0XHRpZiAoIWFjY291bnQpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJBY2NvdW50IGRvZXMgbm90IGV4aXN0IHdpdGggdGhhdCBpZC5cIik7XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fVxyXG5cdFx0bGV0IHRlbXBsYXRlID0gYXdhaXQgdGhpcy5nZXRQbGF5ZXJUZW1wbGF0ZSh0ZW1wbGF0ZUlkKTtcclxuXHRcdGlmICghdGVtcGxhdGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJQbGF5ZXIgVGVtcGxhdGUgZG9lcyBub3QgZXhpc3Qgd2l0aCB0aGF0IGlkLlwiKTtcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9XHJcblx0XHRsZXQgcGxheWVyID0gYXdhaXQgdGhpcy5nZXRQbGF5ZXJCeU5hbWUobmFtZSk7XHJcblx0XHRpZiAocGxheWVyKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiUGxheWVyIGFscmVhZHkgZXhpc3RzIHdpdGggdGhhdCBuYW1lLlwiKTtcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9XHJcblxyXG5cdFx0cGxheWVyID0gbmV3IFBsYXllcih7XHJcblx0XHRcdF9pZCA6IG5ldyBtb25nb29zZS5UeXBlcy5PYmplY3RJZCxcclxuXHRcdFx0bmFtZSxcclxuXHRcdFx0YWNjb3VudDogYWNjb3VudElkLFxyXG5cdFx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVJZFxyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIGF3YWl0IHBsYXllci5zYXZlKClcclxuXHRcdC50aGVuKHJlc3VsdCA9PiBwbGF5ZXIuX2lkKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgZ2V0UGxheWVyKHBsYXllcklkKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgUGxheWVyLmZpbmRCeUlkKHBsYXllcklkKVxyXG5cdFx0LnNlbGVjdCgnX2lkIGFjY291bnQgbmFtZSB0ZW1wbGF0ZSBsZXZlbCBleHBlcmllbmNlIG1hcElkIHggeSBkaXJlY3Rpb24gYWRtaW5BY2Nlc3Mgc3ByaXRlJylcclxuXHRcdC5wb3B1bGF0ZSgndGVtcGxhdGUnKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4ocGxheWVyID0+IHBsYXllcilcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIGdldFBsYXllckJ5TmFtZShuYW1lKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgUGxheWVyLmZpbmRPbmUoe25hbWU6IG5hbWV9KVxyXG5cdFx0LnNlbGVjdCgnX2lkIGFjY291bnQgbmFtZSB0ZW1wbGF0ZSBsZXZlbCBleHBlcmllbmNlIG1hcElkIHggeSBkaXJlY3Rpb24gYWRtaW5BY2Nlc3Mgc3ByaXRlJylcclxuXHRcdC5wb3B1bGF0ZSgndGVtcGxhdGUnKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4ocGxheWVyID0+IHBsYXllcilcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIGdldFBsYXllcnNCeUFjY291bnQoYWNjb3VudElkKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgUGxheWVyLmZpbmQoe2FjY291bnQ6IGFjY291bnRJZH0pXHJcblx0XHQuc2VsZWN0KCdfaWQgYWNjb3VudCBuYW1lIHRlbXBsYXRlIGxldmVsIGV4cGVyaWVuY2UgbWFwSWQgeCB5IGRpcmVjdGlvbiBhZG1pbkFjY2VzcyBzcHJpdGUnKVxyXG5cdFx0LnBvcHVsYXRlKCd0ZW1wbGF0ZScpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbihwbGF5ZXJzID0+IHBsYXllcnMpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBzYXZlUGxheWVyKGRhdGEpIHtcclxuXHRcdHJldHVybiBhd2FpdCBQbGF5ZXIudXBkYXRlT25lKHtuYW1lOiBkYXRhLm5hbWV9LCB7JHNldDogZGF0YX0pXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbihyZXN1bHQgPT4gdHJ1ZSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdHNhdmVPbmxpbmVQbGF5ZXJzKHBsYXllcnMgPSBbXSkge1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBwbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IHBsYXllciA9IHBsYXllcnNbaV07XHJcblx0XHRcdGlmICghcGxheWVyKSBjb250aW51ZTtcclxuXHRcdFx0dGhpcy5zYXZlUGxheWVyKHBsYXllcik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRhc3luYyBhZGRCb3QoZGF0YSkge1xyXG5cdFx0bGV0IHRlbXBsYXRlID0gYXdhaXQgdGhpcy5nZXRCb3RUZW1wbGF0ZShkYXRhLnRlbXBsYXRlSWQpO1xyXG5cdFx0aWYgKCF0ZW1wbGF0ZSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIkJvdCBUZW1wbGF0ZSBkb2VzIG5vdCBleGlzdCB3aXRoIHRoYXQgaWQuXCIpO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IF9pZCA9IGRhdGEuYm90SWQ7XHJcblx0XHRpZiAoIV9pZCkgX2lkID0gbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkO1xyXG5cclxuXHRcdGNvbnN0IGJvdCA9IG5ldyBCb3Qoe1xyXG5cdFx0XHRfaWQsXHJcblx0XHRcdHRlbXBsYXRlOiBkYXRhLnRlbXBsYXRlSWQsXHJcblx0XHRcdG1hcElkOiBkYXRhLm1hcElkLFxyXG5cdFx0XHR4OiBkYXRhLngsXHJcblx0XHRcdHk6IGRhdGEueSxcclxuXHRcdFx0ZGlyZWN0aW9uOiBkYXRhLmRpcmVjdGlvblxyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIGF3YWl0IGJvdC5zYXZlKClcclxuXHRcdC50aGVuKHJlc3VsdCA9PiB0cnVlKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgZ2V0Qm90KGJvdElkKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgQm90LmZpbmRPbmUoe19pZDogYm90SWR9KVxyXG5cdFx0LnNlbGVjdCgnX2lkIHRlbXBsYXRlIG1hcElkIHggeSBkaXJlY3Rpb24nKVxyXG5cdFx0LnBvcHVsYXRlKCd0ZW1wbGF0ZScpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbihib3QgPT4gYm90KVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgc2F2ZUJvdChkYXRhKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgQm90LnVwZGF0ZU9uZSh7X2lkOiBkYXRhLmJvdElkfSwgeyRzZXQ6IGRhdGF9KVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4ocmVzdWx0ID0+IHRydWUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBnZXRBbGxCb3RzKCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IEJvdC5maW5kKHt9KVxyXG5cdFx0LnNlbGVjdCgnX2lkIHRlbXBsYXRlIG1hcElkIHggeSBkaXJlY3Rpb24nKVxyXG5cdFx0LnBvcHVsYXRlKCd0ZW1wbGF0ZScpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbihib3RzID0+IGJvdHMpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBzYXZlQWxsQm90cyhjdXJyZW50Qm90cykge1xyXG5cdFx0aWYgKCFjdXJyZW50Qm90cykgcmV0dXJuO1xyXG5cclxuXHRcdGxldCBzYXZlZEJvdHMgPSBhd2FpdCB0aGlzLmdldEFsbEJvdHMoKTtcclxuXHRcdGNvbnN0IG5ld0JvdHMgPSBjdXJyZW50Qm90cy5maWx0ZXIoYm90ID0+ICFzYXZlZEJvdHMuZmluZChzYXZlZEJvdCA9PiBzYXZlZEJvdC5faWQgPT09IGJvdC5ib3RJZCkpO1xyXG5cdFx0Y29uc3QgZXhpc3RpbmdCb3RzID0gY3VycmVudEJvdHMuZmlsdGVyKGJvdCA9PiBzYXZlZEJvdHMuZmluZChzYXZlZEJvdCA9PiBzYXZlZEJvdC5faWQgPT09IGJvdC5ib3RJZCkpO1xyXG5cdFx0Y29uc3QgZGVsZXRlQm90cyA9IHNhdmVkQm90cy5maWx0ZXIoYm90ID0+ICFleGlzdGluZ0JvdHMuZmluZChleGlzdGluZ0JvdCA9PiBleGlzdGluZ0JvdC5ib3RJZCA9PT0gYm90Ll9pZCkpO1xyXG5cdFx0Y29uc3QgdXBkYXRlQm90cyA9IGV4aXN0aW5nQm90cy5maWx0ZXIoYm90ID0+ICFkZWxldGVCb3RzLmluY2x1ZGVzKGJvdCkpO1xyXG5cclxuXHRcdC8vIEFkZCBuZXcgQm90c1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBuZXdCb3RzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHRoaXMuYWRkQm90KG5ld0JvdHNbaV0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIERlbGV0ZSByZW1vdmVkIEJvdHNcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgZGVsZXRlQm90cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRCb3QuZGVsZXRlT25lKHtfaWQ6IGRlbGV0ZUJvdHNbaV0uX2lkfSwgZXJyID0+IHtcclxuXHRcdFx0XHRpZiAoZXJyKSBjb25zb2xlLmxvZyhlcnIpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBVcGRhdGUgdGhlIHJlc3RcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdXBkYXRlQm90cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRjb25zdCBib3QgPSB1cGRhdGVCb3RzW2ldO1xyXG5cdFx0XHRpZiAoIWJvdCkgY29udGludWU7XHJcblx0XHRcdHRoaXMuc2F2ZUJvdChib3QpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0YXN5bmMgZ2V0TWFwKG1hcElkKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgTWFwLmZpbmRPbmUoe21hcElkOiBtYXBJZH0pXHJcblx0XHQuc2VsZWN0KCdtYXBJZCBuYW1lIGRyb3BDaGFuY2UgZHJvcEFtb3VudEVRIHRpbGVzIGlzV2FsbCBpc0hvc3RpbGUgZGFtYWdlIHdhcnBNYXAgd2FycFggd2FycFknKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4obWFwID0+IG1hcClcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIHNhdmVNYXAoZGF0YSkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IE1hcC51cGRhdGVPbmUoe21hcElkOiBkYXRhLm1hcElkfSwgeyRzZXQ6IGRhdGF9LCB7dXBzZXJ0OiB0cnVlfSlcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHJlc3VsdCA9PiB0cnVlKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgZ2V0QWxsTWFwcygpIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHJldHVybiBhd2FpdCBNYXAuZmluZCh7fSlcclxuXHRcdFx0LnNlbGVjdCgnbWFwSWQgbmFtZSBkcm9wQ2hhbmNlIGRyb3BBbW91bnRFUSB0aWxlcyBpc1dhbGwgaXNIb3N0aWxlIGRhbWFnZSB3YXJwTWFwIHdhcnBYIHdhcnBZJylcclxuXHRcdFx0LmV4ZWMoKVxyXG5cdFx0XHQudGhlbihtYXBzID0+IG1hcHMpXHJcblx0XHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0XHR9XHJcblx0XHRjYXRjaChlcnIpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGFzeW5jIGFkZFBsYXllclRlbXBsYXRlKGRhdGEpIHtcclxuXHRcdGlmICghZGF0YS5uYW1lKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiTmFtZSBpcyByZXF1aXJlZC5cIik7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgY2hlY2tUZW1wbGF0ZSA9IGF3YWl0IFBsYXllclRlbXBsYXRlLmZpbmRPbmUoe25hbWU6IGRhdGEubmFtZX0pXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbih0ZW1wbGF0ZSA9PiB0ZW1wbGF0ZSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblxyXG5cdFx0aWYgKGNoZWNrVGVtcGxhdGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJUZW1wbGF0ZSBhbHJlYWR5IGV4aXN0cyB3aXRoIHRoYXQgbmFtZS5cIik7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCB0ZW1wbGF0ZSA9IG5ldyBQbGF5ZXJUZW1wbGF0ZSh7XHJcblx0XHRcdF9pZDogbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkLFxyXG5cdFx0XHRuYW1lOiBkYXRhLm5hbWUsXHJcblx0XHRcdHNwcml0ZTogZGF0YS5zcHJpdGUsXHJcblx0XHRcdGRhbWFnZUJhc2U6IGRhdGEuZGFtYWdlQmFzZSxcclxuXHRcdFx0ZGVmZW5jZUJhc2U6IGRhdGEuZGVmZW5jZUJhc2UsXHJcblx0XHRcdGhlYWx0aE1heEJhc2U6IGRhdGEuaGVhbHRoTWF4QmFzZSxcclxuXHRcdFx0ZW5lcmd5TWF4QmFzZTogZGF0YS5lbmVyZ3lNYXhCYXNlLFxyXG5cdFx0XHRoZWFsdGhSZWdlbkJhc2U6IGRhdGEuaGVhbHRoUmVnZW5CYXNlLFxyXG5cdFx0XHRlbmVyZ3lSZWdlbkJhc2U6IGRhdGEuZW5lcmd5UmVnZW5CYXNlLFxyXG5cdFx0XHRyYW5nZUJhc2U6IGRhdGEucmFuZ2VCYXNlLFxyXG5cdFx0XHRoZWFsdGhQZXJMZXZlbDogZGF0YS5oZWFsdGhQZXJMZXZlbCxcclxuXHRcdFx0ZW5lcmd5UGVyTGV2ZWw6IGRhdGEuZW5lcmd5UGVyTGV2ZWxcclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBhd2FpdCB0ZW1wbGF0ZS5zYXZlKClcclxuXHRcdC50aGVuKHJlc3VsdCA9PiB0cnVlKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgZ2V0UGxheWVyVGVtcGxhdGUodGVtcGxhdGVJZCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IFBsYXllclRlbXBsYXRlLmZpbmRCeUlkKHRlbXBsYXRlSWQpXHJcblx0XHQuc2VsZWN0KCduYW1lIHNwcml0ZSBkYW1hZ2VCYXNlIGRlZmVuY2VCYXNlIGhlYWx0aE1heEJhc2UgZW5lcmd5TWF4QmFzZSBoZWFsdGhSZWdlbkJhc2UgZW5lcmd5UmVnZW5CYXNlIHJhbmdlQmFzZSBoZWFsdGhQZXJMZXZlbCwgZW5lcmd5UGVyTGV2ZWwnKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4odGVtcGxhdGUgPT4gdGVtcGxhdGUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBnZXRBbGxQbGF5ZXJUZW1wbGF0ZXMoKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgUGxheWVyVGVtcGxhdGUuZmluZCh7fSlcclxuXHRcdC5zZWxlY3QoJ19pZCBuYW1lIHNwcml0ZSBkYW1hZ2VCYXNlIGRlZmVuY2VCYXNlIGhlYWx0aE1heEJhc2UgZW5lcmd5TWF4QmFzZSBoZWFsdGhSZWdlbkJhc2UgZW5lcmd5UmVnZW5CYXNlIHJhbmdlQmFzZSBoZWFsdGhQZXJMZXZlbCwgZW5lcmd5UGVyTGV2ZWwnKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4odGVtcGxhdGVzID0+IHRlbXBsYXRlcylcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cclxuXHRhc3luYyBhZGRCb3RUZW1wbGF0ZShkYXRhKSB7XHJcblx0XHRjb25zdCB0ZW1wbGF0ZSA9IG5ldyBCb3RUZW1wbGF0ZSh7XHJcblx0XHRcdF9pZDogbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkLFxyXG5cdFx0XHRuYW1lOiBkYXRhLm5hbWUsXHJcblx0XHRcdHNwcml0ZTogZGF0YS5zcHJpdGUsXHJcblx0XHRcdGRhbWFnZUJhc2U6IGRhdGEuZGFtYWdlQmFzZSxcclxuXHRcdFx0ZGVmZW5jZUJhc2U6IGRhdGEuZGVmZW5jZUJhc2UsXHJcblx0XHRcdGhlYWx0aE1heEJhc2U6IGRhdGEuaGVhbHRoTWF4QmFzZSxcclxuXHRcdFx0ZW5lcmd5TWF4QmFzZTogZGF0YS5lbmVyZ3lNYXhCYXNlLFxyXG5cdFx0XHRoZWFsdGhSZWdlbkJhc2U6IGRhdGEuaGVhbHRoUmVnZW5CYXNlLFxyXG5cdFx0XHRlbmVyZ3lSZWdlbkJhc2U6IGRhdGEuZW5lcmd5UmVnZW5CYXNlLFxyXG5cdFx0XHRyYW5nZUJhc2U6IGRhdGEucmFuZ2VCYXNlLFxyXG5cdFx0XHRob3N0aWxlOiBkYXRhLmhvc3RpbGVcclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBhd2FpdCB0ZW1wbGF0ZS5zYXZlKClcclxuXHRcdC50aGVuKHJlc3VsdCA9PiB0cnVlKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgZ2V0Qm90VGVtcGxhdGUodGVtcGxhdGVJZCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IEJvdFRlbXBsYXRlLmZpbmRCeUlkKHRlbXBsYXRlSWQpXHJcblx0XHQuc2VsZWN0KCdfaWQgbmFtZSBzcHJpdGUgZGFtYWdlQmFzZSBkZWZlbmNlQmFzZSBoZWFsdGhNYXhCYXNlIGVuZXJneU1heEJhc2UgaGVhbHRoUmVnZW5CYXNlIGVuZXJneVJlZ2VuQmFzZSByYW5nZUJhc2UgaG9zdGlsZScpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbih0ZW1wbGF0ZSA9PiB0ZW1wbGF0ZSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIGdldEFsbEJvdFRlbXBsYXRlcygpIHtcclxuXHRcdHJldHVybiBhd2FpdCBCb3RUZW1wbGF0ZS5maW5kKHt9KVxyXG5cdFx0LnNlbGVjdCgnX2lkIG5hbWUgc3ByaXRlIGRhbWFnZUJhc2UgZGVmZW5jZUJhc2UgaGVhbHRoTWF4QmFzZSBlbmVyZ3lNYXhCYXNlIGhlYWx0aFJlZ2VuQmFzZSBlbmVyZ3lSZWdlbkJhc2UgcmFuZ2VCYXNlIGhvc3RpbGUnKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4odGVtcGxhdGVzID0+IHRlbXBsYXRlcylcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cclxuXHRhc3luYyBhZGRJdGVtVGVtcGxhdGUoZGF0YSkge1xyXG5cdFx0Y29uc3QgdGVtcGxhdGUgPSBuZXcgSXRlbVRlbXBsYXRlKHtcclxuXHRcdFx0X2lkOiBuZXcgbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQsXHJcblx0XHRcdG5hbWU6IGRhdGEubmFtZSxcclxuXHRcdFx0c3ByaXRlOiBkYXRhLnNwcml0ZSxcclxuXHRcdFx0cmV1c2FibGU6IGRhdGEucmV1c2FibGUsXHJcblx0XHRcdGl0ZW1UeXBlOiBkYXRhLml0ZW1UeXBlSWQsXHJcblx0XHRcdHBhc3NpdmVEYW1hZ2U6IGRhdGEucGFzc2l2ZURhbWFnZSxcclxuXHRcdFx0cGFzc2l2ZURlZmVuY2U6IGRhdGEucGFzc2l2ZURlZmVuY2UsXHJcblx0XHRcdHBhc3NpdmVIZWFsdGhNYXg6IGRhdGEucGFzc2l2ZUhlYWx0aE1heCxcclxuXHRcdFx0cGFzc2l2ZUVuZXJneU1heDogZGF0YS5wYXNzaXZlRW5lcmd5TWF4LFxyXG5cdFx0XHRwYXNzaXZlSGVhbHRoUmVnZW46IGRhdGEucGFzc2l2ZUhlYWx0aFJlZ2VuLFxyXG5cdFx0XHRwYXNzaXZlRW5lcmd5UmVnZW46IGRhdGEucGFzc2l2ZUVuZXJneVJlZ2VuLFxyXG5cdFx0XHRwYXNzaXZlUmFuZ2U6IGRhdGEucGFzc2l2ZVJhbmdlLFxyXG5cdFx0XHRlcXVpcHBlZERhbWFnZTogZGF0YS5lcXVpcHBlZERhbWFnZSxcclxuXHRcdFx0ZXF1aXBwZWREZWZlbmNlOiBkYXRhLmVxdWlwcGVkRGVmZW5jZSxcclxuXHRcdFx0ZXF1aXBwZWRIZWFsdGhNYXg6IGRhdGEuZXF1aXBwZWRIZWFsdGhNYXgsXHJcblx0XHRcdGVxdWlwcGVkRW5lcmd5TWF4OiBkYXRhLmVxdWlwcGVkRW5lcmd5TWF4LFxyXG5cdFx0XHRlcXVpcHBlZEhlYWx0aFJlZ2VuOiBkYXRhLmVxdWlwcGVkSGVhbHRoUmVnZW4sXHJcblx0XHRcdGVxdWlwcGVkRW5lcmd5UmVnZW46IGRhdGEuZXF1aXBwZWRFbmVyZ3lSZWdlbixcclxuXHRcdFx0ZXF1aXBwZWRSYW5nZTogZGF0YS5lcXVpcHBlZFJhbmdlXHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gYXdhaXQgdGVtcGxhdGUuc2F2ZSgpXHJcblx0XHQudGhlbihyZXN1bHQgPT4gdHJ1ZSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIGdldEl0ZW1UZW1wbGF0ZSh0ZW1wbGF0ZUlkKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgSXRlbVRlbXBsYXRlLmZpbmRCeUlkKHRlbXBsYXRlSWQpXHJcblx0XHQuc2VsZWN0KCduYW1lIHNwcml0ZSByZXVzYWJsZSBpdGVtVHlwZSBwYXNzaXZlRGFtYWdlIHBhc3NpdmVEZWZlbmNlIHBhc3NpdmVIZWFsdGhNYXggcGFzc2l2ZUVuZXJneU1heEJhc2UgcGFzc2l2ZUhlYWx0aFJlZ2VuIHBhc3NpdmVFbmVyZ3lSZWdlbiBwYXNzaXZlUmFuZ2UgZXF1aXBwZWREYW1hZ2UgZXF1aXBwZWREZWZlbmNlIGVxdWlwcGVkSGVhbHRoTWF4IGVxdWlwcGVkRW5lcmd5TWF4QmFzZSBlcXVpcHBlZEhlYWx0aFJlZ2VuIGVxdWlwcGVkRW5lcmd5UmVnZW4gZXF1aXBwZWRSYW5nZScpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbih0ZW1wbGF0ZSA9PiB0ZW1wbGF0ZSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIGdldEFsbEl0ZW1UZW1wbGF0ZXMoKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgSXRlbVRlbXBsYXRlLmZpbmQoe30pXHJcblx0XHQuc2VsZWN0KCdfaWQgbmFtZSBzcHJpdGUgcmV1c2FibGUgaXRlbVR5cGUgcGFzc2l2ZURhbWFnZSBwYXNzaXZlRGVmZW5jZSBwYXNzaXZlSGVhbHRoTWF4IHBhc3NpdmVFbmVyZ3lNYXhCYXNlIHBhc3NpdmVIZWFsdGhSZWdlbiBwYXNzaXZlRW5lcmd5UmVnZW4gcGFzc2l2ZVJhbmdlIGVxdWlwcGVkRGFtYWdlIGVxdWlwcGVkRGVmZW5jZSBlcXVpcHBlZEhlYWx0aE1heCBlcXVpcHBlZEVuZXJneU1heEJhc2UgZXF1aXBwZWRIZWFsdGhSZWdlbiBlcXVpcHBlZEVuZXJneVJlZ2VuIGVxdWlwcGVkUmFuZ2UnKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4odGVtcGxhdGVzID0+IHRlbXBsYXRlcylcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cclxuXHRhc3luYyBhZGRJdGVtKGRhdGEpIHtcclxuXHRcdGxldCB0ZW1wbGF0ZSA9IGF3YWl0IHRoaXMuZ2V0SXRlbVRlbXBsYXRlKGRhdGEudGVtcGxhdGVJZCk7XHJcblx0XHRpZiAoIXRlbXBsYXRlKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiSXRlbSBUZW1wbGF0ZSBkb2VzIG5vdCBleGlzdCB3aXRoIHRoYXQgaWQuXCIpO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0XHRsZXQgX2lkID0gZGF0YS5pdGVtSWQ7XHJcblx0XHRpZiAoIV9pZCkgX2lkID0gbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkO1xyXG5cclxuXHRcdGNvbnN0IGl0ZW0gPSBuZXcgSXRlbSh7XHJcblx0XHRcdF9pZCxcclxuXHRcdFx0dGVtcGxhdGU6IGRhdGEudGVtcGxhdGVJZCxcclxuXHRcdFx0c3RhY2s6IGRhdGEuc3RhY2ssXHJcblx0XHRcdHBsYXllcklkOiBkYXRhLnBsYXllcklkLFxyXG5cdFx0XHRib3RJZDogZGF0YS5ib3RJZCxcclxuXHRcdFx0c2xvdDogZGF0YS5zbG90LFxyXG5cdFx0XHRtYXBJZDogZGF0YS5tYXBJZCxcclxuXHRcdFx0eDogZGF0YS54LFxyXG5cdFx0XHR5OiBkYXRhLnksXHJcblx0XHRcdGNyZWF0ZWRCeTogZGF0YS5jcmVhdGVkQnksXHJcblx0XHRcdGNyZWF0ZWREYXRlOiBkYXRhLmNyZWF0ZWREYXRlXHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gYXdhaXQgaXRlbS5zYXZlKClcclxuXHRcdC50aGVuKHJlc3VsdCA9PiB0cnVlKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgc2F2ZUl0ZW0oZGF0YSkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IEl0ZW0udXBkYXRlT25lKHtfaWQ6IGRhdGEuaXRlbUlkfSwgeyRzZXQ6IGRhdGF9LCB7dXBzZXJ0OiB0cnVlfSlcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHJlc3VsdCA9PiB0cnVlKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgZ2V0QWxsSXRlbXMoKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRyZXR1cm4gYXdhaXQgSXRlbS5maW5kKHt9KVxyXG5cdFx0XHQuc2VsZWN0KCdfaWQgdGVtcGxhdGUgc3RhY2sgcGxheWVySWQgYm90SWQgc2xvdCBtYXBJZCB4IHkgY3JlYXRlZERhdGUgY3JlYXRlZEJ5JylcclxuXHRcdFx0LnBvcHVsYXRlKCd0ZW1wbGF0ZScpXHJcblx0XHRcdC5leGVjKClcclxuXHRcdFx0LnRoZW4oaXRlbXMgPT4gaXRlbXMpXHJcblx0XHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0XHR9XHJcblx0XHRjYXRjaChlcnIpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdH1cclxuXHR9XHJcblx0YXN5bmMgc2F2ZUFsbEl0ZW1zKGN1cnJlbnRJdGVtcykge1xyXG5cdFx0aWYgKCFjdXJyZW50SXRlbXMpIHJldHVybjtcclxuXHJcblx0XHRsZXQgc2F2ZWRJdGVtcyA9IGF3YWl0IHRoaXMuZ2V0QWxsSXRlbXMoKTtcclxuXHRcdGNvbnN0IG5ld0l0ZW1zID0gY3VycmVudEl0ZW1zLmZpbHRlcihpdGVtID0+ICFzYXZlZEl0ZW1zLmZpbmQoc2F2ZWRJdGVtID0+IHNhdmVkSXRlbS5faWQgPT09IGl0ZW0uaXRlbUlkKSk7XHJcblx0XHRjb25zdCBleGlzdGluZ0l0ZW1zID0gY3VycmVudEl0ZW1zLmZpbHRlcihpdGVtID0+IHNhdmVkSXRlbXMuZmluZChzYXZlZEl0ZW0gPT4gc2F2ZWRJdGVtLl9pZCA9PT0gaXRlbS5pdGVtSWQpKTtcclxuXHRcdGNvbnN0IGRlbGV0ZUl0ZW1zID0gc2F2ZWRJdGVtcy5maWx0ZXIoaXRlbSA9PiAhZXhpc3RpbmdJdGVtcy5maW5kKGV4aXN0aW5nSXRlbSA9PiBleGlzdGluZ0l0ZW0uaXRlbUlkID09PSBpdGVtLl9pZCkpO1xyXG5cdFx0Y29uc3QgdXBkYXRlSXRlbXMgPSBleGlzdGluZ0l0ZW1zLmZpbHRlcihpdGVtID0+ICFkZWxldGVJdGVtcy5pbmNsdWRlcyhpdGVtKSk7XHJcblx0XHRcclxuXHRcdC8vIEFkZCBuZXcgSXRlbXNcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbmV3SXRlbXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dGhpcy5hZGRJdGVtKG5ld0l0ZW1zW2ldKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBEZWxldGUgcmVtb3ZlZCBJdGVtc1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBkZWxldGVJdGVtcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRJdGVtLmRlbGV0ZU9uZSh7X2lkOiBkZWxldGVJdGVtc1tpXS5faWR9LCBlcnIgPT4ge1xyXG5cdFx0XHRcdGlmIChlcnIpIGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFVwZGF0ZSB0aGUgcmVzdFxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB1cGRhdGVJdGVtcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRjb25zdCBpdGVtID0gdXBkYXRlSXRlbXNbaV07XHJcblx0XHRcdGlmICghaXRlbSkgY29udGludWU7XHJcblx0XHRcdHRoaXMuc2F2ZUl0ZW0oaXRlbSk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5jb25zdCBkYiA9IG5ldyBEYXRhYmFzZSgpO1xyXG5leHBvcnQgZGVmYXVsdCBkYjtcclxuIiwiaW1wb3J0IGRiIGZyb20gJy4vZGIuanMnO1xyXG5pbXBvcnQgY29uZmlnIGZyb20gJy4vY29uZmlnLmpzJztcclxuXHJcbmltcG9ydCBNYXAgZnJvbSAnLi9jbGFzc2VzL21hcC5qcyc7XHJcbmltcG9ydCBQbGF5ZXIgZnJvbSAnLi9jbGFzc2VzL3BsYXllci5qcyc7XHJcbmltcG9ydCBCb3QgZnJvbSAnLi9jbGFzc2VzL2JvdC5qcyc7XHJcbmltcG9ydCBJdGVtIGZyb20gJy4vY2xhc3Nlcy9pdGVtLmpzJztcclxuaW1wb3J0IEVmZmVjdCBmcm9tICcuL2NsYXNzZXMvZWZmZWN0LmpzJztcclxuaW1wb3J0IFRleHQgZnJvbSAnLi9jbGFzc2VzL3RleHQuanMnO1xyXG5pbXBvcnQgTWVzc2FnZSBmcm9tICcuL2NsYXNzZXMvbWVzc2FnZS5qcyc7XHJcblxyXG5jbGFzcyBHYW1lIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHRoaXMubWFwcyA9IFtdO1xyXG5cdFx0dGhpcy5wbGF5ZXJzID0gW107XHJcblx0XHR0aGlzLmJvdHMgPSBbXTtcclxuXHRcdHRoaXMuaXRlbXMgPSBbXTtcclxuXHRcdHRoaXMuZWZmZWN0cyA9IFtdO1xyXG5cdFx0dGhpcy50ZXh0cyA9IFtdO1xyXG5cdFx0dGhpcy5tZXNzYWdlUXVldWUgPSBbXTtcclxuXHRcdFxyXG5cdFx0dGhpcy5wbGF5ZXJUZW1wbGF0ZXMgPSB7fTtcclxuXHRcdHRoaXMuYm90VGVtcGxhdGVzID0ge307XHJcblx0XHR0aGlzLml0ZW1UZW1wbGF0ZXMgPSB7fTtcclxuXHJcblx0XHR0aGlzLmxvYWRNYXBzKCk7XHJcblx0XHR0aGlzLmxvYWRQbGF5ZXJUZW1wbGF0ZXMoKTtcclxuXHRcdHRoaXMubG9hZEJvdFRlbXBsYXRlcygpO1xyXG5cdFx0dGhpcy5sb2FkSXRlbVRlbXBsYXRlcygpO1xyXG5cdFx0dGhpcy5sb2FkQ29tbWFuZHMoKTtcclxuXHRcdHRoaXMubG9hZEl0ZW1zKCk7XHJcblx0XHR0aGlzLmxvYWRCb3RzKCk7XHJcblx0fVxyXG5cclxuXHRsb2FkTWFwcygpIHtcclxuXHRcdGRiLmdldEFsbE1hcHMoKVxyXG5cdFx0LnRoZW4obWFwRGF0YSA9PiB7XHJcblx0XHRcdGNvbnN0IG9yZGVyZWRNYXBEYXRhID0gW107XHJcblx0XHRcdGZvciAobGV0IGlkID0gMDsgaWQgPCBtYXBEYXRhLmxlbmd0aDsgaWQrKykge1xyXG5cdFx0XHRcdGNvbnN0IGRhdGEgPSBtYXBEYXRhW2lkXTtcclxuXHRcdFx0XHRpZiAoZGF0YSkgb3JkZXJlZE1hcERhdGFbZGF0YS5tYXBJZF0gPSBkYXRhO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmb3IgKGxldCBpZCA9IDA7IGlkIDwgY29uZmlnLk1BWF9NQVBTOyBpZCsrKSB7XHJcblx0XHRcdFx0aWYgKG9yZGVyZWRNYXBEYXRhW2lkXSkge1xyXG5cdFx0XHRcdFx0dGhpcy5tYXBzW2lkXSA9IG5ldyBNYXAoaWQsIG9yZGVyZWRNYXBEYXRhW2lkXSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tYXBzW2lkXSA9IG5ldyBNYXAoaWQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cclxuXHRsb2FkUGxheWVyVGVtcGxhdGVzKCkge1xyXG5cdFx0ZGIuZ2V0QWxsUGxheWVyVGVtcGxhdGVzKClcclxuXHRcdC50aGVuKHRlbXBsYXRlcyA9PiB7XHJcblx0XHRcdHRoaXMucGxheWVyVGVtcGxhdGVzID0ge307XHJcblx0XHRcdHRlbXBsYXRlcy5mb3JFYWNoKHRlbXBsYXRlID0+IHtcclxuXHRcdFx0XHR0aGlzLnBsYXllclRlbXBsYXRlc1t0ZW1wbGF0ZS5faWRdID0gdGVtcGxhdGU7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSkuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHJcblx0bG9hZEJvdFRlbXBsYXRlcygpIHtcclxuXHRcdGRiLmdldEFsbEJvdFRlbXBsYXRlcygpXHJcblx0XHQudGhlbih0ZW1wbGF0ZXMgPT4ge1xyXG5cdFx0XHR0aGlzLmJvdFRlbXBsYXRlcyA9IHt9O1xyXG5cdFx0XHR0ZW1wbGF0ZXMuZm9yRWFjaCh0ZW1wbGF0ZSA9PiB7XHJcblx0XHRcdFx0dGhpcy5ib3RUZW1wbGF0ZXNbdGVtcGxhdGUuX2lkXSA9IHRlbXBsYXRlO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pLmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblxyXG5cdGxvYWRJdGVtVGVtcGxhdGVzKCkge1xyXG5cdFx0ZGIuZ2V0QWxsSXRlbVRlbXBsYXRlcygpXHJcblx0XHQudGhlbih0ZW1wbGF0ZXMgPT4ge1xyXG5cdFx0XHR0aGlzLml0ZW1UZW1wbGF0ZXMgPSB7fTtcclxuXHRcdFx0dGVtcGxhdGVzLmZvckVhY2godGVtcGxhdGUgPT4ge1xyXG5cdFx0XHRcdHRlbXBsYXRlLnR5cGUgPSBjb25maWcuSVRFTV9UWVBFU1t0ZW1wbGF0ZS5pdGVtVHlwZV07XHJcblx0XHRcdFx0dGhpcy5pdGVtVGVtcGxhdGVzW3RlbXBsYXRlLl9pZF0gPSB0ZW1wbGF0ZTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KS5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cclxuXHRsb2FkQ29tbWFuZHMoKSB7XHJcblx0XHR0aGlzLmNvbW1hbmRzID0ge1xyXG5cdFx0XHRtb3ZlOiAoZGF0YSwgcGxheWVyKSA9PiBwbGF5ZXIuaW5wdXQuZGlyZWN0aW9uID0gZGF0YS5kaXJlY3Rpb24sXHJcblx0XHRcdHJ1bjogKGRhdGEsIHBsYXllcikgPT4gcGxheWVyLmlucHV0LnJ1biA9IGRhdGEuc3RhdGUsXHJcblx0XHRcdHBpY2t1cDogKGRhdGEsIHBsYXllcikgPT4ge1xyXG5cdFx0XHRcdGlmICghcGxheWVyLmlucHV0LnBpY2t1cCAmJiBkYXRhLnN0YXRlKSBwbGF5ZXIucGlja1VwKCk7XHJcblx0XHRcdFx0cGxheWVyLmlucHV0LnBpY2t1cCA9IGRhdGEuc3RhdGU7XHJcblx0XHRcdH0sXHJcblx0XHRcdGF0dGFjazogKGRhdGEsIHBsYXllcikgPT4ge1xyXG5cdFx0XHRcdHBsYXllci5pbnB1dC5hdHRhY2sgPSBkYXRhLnN0YXRlO1xyXG5cdFx0XHRcdHBsYXllci5hdHRhY2soMSwgcGxheWVyLmRpcmVjdGlvbik7XHJcblx0XHRcdH0sXHJcblx0XHRcdGRvdWJsZUNsaWNrSXRlbTogKGRhdGEsIHBsYXllcikgPT4gcGxheWVyLnVzZUl0ZW0oZGF0YS5zbG90KSxcclxuXHRcdFx0cmlnaHRDbGlja0l0ZW06IChkYXRhLCBwbGF5ZXIpID0+IHBsYXllci5kcm9wSXRlbShkYXRhLnNsb3QpLFxyXG5cdFx0XHRkcmFnU3RvcEdhbWU6IChkYXRhLCBwbGF5ZXIpID0+IHBsYXllci5kcm9wSXRlbShkYXRhLnNsb3QpLFxyXG5cdFx0XHRkcmFnU3RvcEludmVudG9yeTogKGRhdGEsIHBsYXllcikgPT4gcGxheWVyLm1vdmVJdGVtVG9TbG90KGRhdGEuc2xvdCwgZGF0YS5uZXdTbG90KSxcclxuXHRcdFx0ZHJhZ1N0b3BFcXVpcG1lbnQ6IChkYXRhLCBwbGF5ZXIpID0+IHBsYXllci5tb3ZlSXRlbVRvU2xvdChkYXRhLnNsb3QsIGRhdGEubmV3U2xvdCksXHJcblx0XHRcdHNlcnZlckNoYXQ6IChkYXRhLCBwbGF5ZXIpID0+IGdhbWUuc2VuZE1lc3NhZ2VHbG9iYWwocGxheWVyLmdhbWVJZCwgYCR7cGxheWVyLm5hbWV9IHllbGxzLCBcIiR7ZGF0YS5tZXNzYWdlfVwiYCksXHJcblx0XHRcdG1hcENoYXQ6IChkYXRhLCBwbGF5ZXIpID0+IGdhbWUuc2VuZE1lc3NhZ2VNYXAocGxheWVyLmdhbWVJZCwgcGxheWVyLm1hcElkLCBgJHtwbGF5ZXIubmFtZX0gc2F5cywgXCIke2RhdGEubWVzc2FnZX1cImApLFxyXG5cdFx0XHRwbGF5ZXJDaGF0OiAoZGF0YSwgcGxheWVyKSA9PiB7XHJcblx0XHRcdFx0Y29uc3QgdGFyZ2V0ID0gZ2FtZS5wbGF5ZXJzW2RhdGEudGFyZ2V0SWRdO1xyXG5cdFx0XHRcdGlmICh0YXJnZXQpIHtcclxuXHRcdFx0XHRcdGdhbWUuc2VuZE1lc3NhZ2VQbGF5ZXIocGxheWVyLmdhbWVJZCwgdGFyZ2V0LmdhbWVJZCwgYCR7cGxheWVyLm5hbWV9IHdoaXNwZXJzLCBcIiR7ZGF0YS5tZXNzYWdlfVwiYCk7XHJcblx0XHRcdFx0XHRnYW1lLnNlbmRNZXNzYWdlUGxheWVyKHBsYXllci5nYW1lSWQsIHBsYXllci5nYW1lSWQsIGBZb3Ugd2hpc3BlciB0byAke3RhcmdldC5uYW1lfSwgXCIke2RhdGEubWVzc2FnZX1cImApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0bWFjcm8xOiAoZGF0YSkgPT4ge1xyXG5cdFx0XHRcdGlmIChkYXRhKSB0aGlzLnNwYXduTWFwSXRlbSgxLCA1LCA1LCBcIjVjMWJmZWI3ZDhmYjYwMTJjYzk2NjA4M1wiKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0bWFjcm8yOiAoZGF0YSkgPT4ge1xyXG5cdFx0XHRcdGlmIChkYXRhKSB0aGlzLnNwYXduQm90KDEsIDUsIDUsIFwiNWMxYmVjZGUyOGQwNWIwNzdjYmFhMzg1XCIpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRtYWNybzM6IChkYXRhKSA9PiB7XHJcblx0XHRcdFx0aWYgKGRhdGEpIHtcclxuXHRcdFx0XHRcdGlmIChwbGF5ZXIuc3ByaXRlID49IGNvbmZpZy5NQVhfU1BSSVRFUykgcGxheWVyLnNwcml0ZSA9IDE7XHJcblx0XHRcdFx0XHRlbHNlIHBsYXllci5zcHJpdGUrKztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdG1hY3JvNDogKGRhdGEpID0+IHtcclxuXHRcdFx0fSxcclxuXHJcblx0XHR9O1xyXG5cdFx0XHJcblx0XHR0aGlzLmdvZENvbW1hbmRzID0ge1xyXG5cdFx0XHRzcGF3bk1hcEl0ZW06IChkYXRhKSA9PiB0aGlzLnNwYXduTWFwSXRlbShkYXRhLmFyZ3NbMF0sIGRhdGEuYXJnc1sxXSwgZGF0YS5hcmdzWzJdLCBkYXRhLmFyZ3NbM10sIGRhdGEuYXJnc1s0XSksXHJcblx0XHRcdHNwYXduQm90OiAoZGF0YSkgPT4gdGhpcy5zcGF3bkJvdChkYXRhLmFyZ3NbMF0sIGRhdGEuYXJnc1sxXSwgZGF0YS5hcmdzWzJdLCBkYXRhLmFyZ3NbM10sIGRhdGEuYXJnc1s0XSksXHJcblx0XHRcdHNldFNwcml0ZTogKGRhdGEsIHBsYXllcikgPT4gcGxheWVyLnNwcml0ZSA9IGRhdGEuYXJnc1swXVxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdGFzeW5jIGxvYWRJdGVtcygpIHtcclxuXHRcdGxldCBpdGVtRGF0YSA9IGF3YWl0IGRiLmdldEFsbEl0ZW1zKCk7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1EYXRhLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IGl0ZW0gPSBpdGVtRGF0YVtpXTtcclxuXHRcdFx0aWYgKCFpdGVtKSBjb250aW51ZTtcclxuXHRcdFx0aXRlbS50ZW1wbGF0ZS50eXBlID0gY29uZmlnLklURU1fVFlQRVNbaXRlbS50ZW1wbGF0ZS5pdGVtVHlwZV1cclxuXHRcdFx0bmV3IEl0ZW0oaXRlbSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdGFzeW5jIGxvYWRCb3RzKCkge1xyXG5cdFx0bGV0IGJvdERhdGEgPSBhd2FpdCBkYi5nZXRBbGxCb3RzKCk7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGJvdERhdGEubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0bmV3IEJvdChib3REYXRhW2ldKTtcclxuXHRcdH1cclxuXHR9XHJcblx0cmVxdWVzdERCSWQoKSB7XHJcblx0XHRyZXR1cm4gZGIuZ2VuZXJhdGVJZCgpO1xyXG5cdH1cclxuXHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHRjb25zdCBwYWNrID0ge1xyXG5cdFx0XHRwbGF5ZXJzOiBbXSxcclxuXHRcdFx0Ym90czogW10sXHJcblx0XHRcdGl0ZW1zOiBbXSxcclxuXHRcdFx0ZWZmZWN0czogW10sXHJcblx0XHRcdHRleHRzOiBbXSxcclxuXHRcdFx0bWVzc2FnZXM6IFtdLmNvbmNhdCh0aGlzLm1lc3NhZ2VRdWV1ZSlcclxuXHRcdH07XHJcblx0XHR0aGlzLm1lc3NhZ2VRdWV1ZSA9IFtdO1xyXG5cclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IHBsYXllciA9IHRoaXMucGxheWVyc1tpXTtcclxuXHRcdFx0aWYgKHBsYXllciAhPSBudWxsKSBwYWNrLnBsYXllcnNbcGxheWVyLmdhbWVJZF0gPSBwbGF5ZXIudXBkYXRlKGRlbHRhKTtcclxuXHRcdH1cclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ib3RzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IGJvdCA9IHRoaXMuYm90c1tpXTtcclxuXHRcdFx0aWYgKGJvdCkgcGFjay5ib3RzW2JvdC5nYW1lSWRdID0gYm90LnVwZGF0ZShkZWx0YSk7XHJcblx0XHR9XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgaXRlbSA9IHRoaXMuaXRlbXNbaV07XHJcblx0XHRcdGlmIChpdGVtKSBwYWNrLml0ZW1zW2l0ZW0uZ2FtZUlkXSA9IGl0ZW0udXBkYXRlKGRlbHRhKTtcclxuXHRcdH1cclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5lZmZlY3RzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IGVmZmVjdCA9IHRoaXMuZWZmZWN0c1tpXTtcclxuXHRcdFx0aWYgKGVmZmVjdCkgcGFjay5lZmZlY3RzW2VmZmVjdC5pZF0gPSBlZmZlY3QudXBkYXRlKGRlbHRhKTtcclxuXHRcdH1cclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy50ZXh0cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRjb25zdCB0ZXh0ID0gdGhpcy50ZXh0c1tpXTtcclxuXHRcdFx0aWYgKHRleHQpIHBhY2sudGV4dHNbdGV4dC5nYW1lSWRdID0gdGV4dC51cGRhdGUoZGVsdGEpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHBhY2s7XHJcblx0fVxyXG5cclxuXHRnZXREQlBhY2soKSB7XHJcblx0XHRjb25zdCBkYlBhY2sgPSB7XHJcblx0XHRcdHBsYXllcnM6IFtdLFxyXG5cdFx0XHRib3RzOiBbXSxcclxuXHRcdFx0aXRlbXM6IFtdXHJcblx0XHR9O1xyXG5cdFx0dGhpcy5wbGF5ZXJzLmZvckVhY2gocGxheWVyID0+IGRiUGFjay5wbGF5ZXJzLnB1c2gocGxheWVyLmdldERCUGFjaygpKSk7XHJcblx0XHR0aGlzLmJvdHMuZm9yRWFjaChib3QgPT4gZGJQYWNrLmJvdHMucHVzaChib3QuZ2V0REJQYWNrKCkpKTtcclxuXHRcdHRoaXMuaXRlbXMuZm9yRWFjaChpdGVtID0+IGRiUGFjay5pdGVtcy5wdXNoKGl0ZW0uZ2V0REJQYWNrKCkpKTtcclxuXHRcdHJldHVybiBkYlBhY2s7XHJcblx0fVxyXG5cclxuXHQvLyBQbGF5ZXJzXHJcblx0cGxheWVyTG9naW4oc29ja2V0SWQsIGRhdGEpIHtcclxuXHRcdGZvciAobGV0IHBsYXllciBvZiB0aGlzLnBsYXllcnMpIHtcclxuXHRcdFx0aWYgKHBsYXllciAmJiBwbGF5ZXIubmFtZSA9PT0gZGF0YS5uYW1lKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJQbGF5ZXIgaXMgYWxyZWFkeSBzaWduZWQgaW4uXCIpO1xyXG5cdFx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgcGxheWVyID0gbmV3IFBsYXllcihzb2NrZXRJZCwgZGF0YSk7XHJcblx0XHRkYi5sb2coYCR7c29ja2V0SWR9IC0gJHtwbGF5ZXIubmFtZX0gaGFzIGxvZ2dlZCBpbi5gKTtcclxuXHRcdHRoaXMuc2VuZEdhbWVJbmZvR2xvYmFsKGAke3BsYXllci5uYW1lfSBoYXMgbG9nZ2VkIGluLmApO1xyXG5cdFx0cmV0dXJuIHBsYXllcjtcclxuXHR9XHJcblx0cGxheWVyTG9nb3V0KHBsYXllcklkKSB7XHJcblx0XHRsZXQgcGxheWVyID0gdGhpcy5wbGF5ZXJzW3BsYXllcklkXTtcclxuXHRcdGlmIChwbGF5ZXIpIHtcclxuXHRcdFx0Y29uc3QgcGxheWVyRGF0YSA9IHBsYXllci5nZXREQlBhY2soKVxyXG5cdFx0XHRkYi5sb2coYCR7cGxheWVyLnNvY2tldElkfSAtICR7cGxheWVyLm5hbWV9IGhhcyBsb2dnZWQgb3V0LmApO1xyXG5cdFx0XHR0aGlzLnNlbmRHYW1lSW5mb0dsb2JhbChgJHtwbGF5ZXIubmFtZX0gaGFzIGxvZ2dlZCBvdXQuYCk7XHJcblx0XHRcdGRlbGV0ZSB0aGlzLnRleHRzW3BsYXllci5kaXNwbGF5TmFtZUlkXTtcclxuXHRcdFx0ZGVsZXRlIHRoaXMucGxheWVyc1twbGF5ZXJJZF07XHJcblx0XHRcdGRiLnNhdmVQbGF5ZXIocGxheWVyRGF0YSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdGdldEV4cFRvTGV2ZWwobGV2ZWwpIHtcclxuXHRcdGxldCBleHAgPSAxMDtcclxuXHRcdGZvciAobGV0IGkgPSAxOyBpIDwgY29uZmlnLk1BWF9MRVZFTDsgaSsrKSB7XHJcblx0XHRcdGlmIChpID09PSBsZXZlbCkgcmV0dXJuIGV4cDtcclxuXHRcdFx0ZXhwID0gKGV4cCArIChleHAgJSAyKSkgKiAxLjU7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLyBHYW1lIEluZm9cclxuXHRzZW5kR2FtZUluZm9HbG9iYWwobWVzc2FnZSkge1xyXG5cdFx0dGhpcy5tZXNzYWdlUXVldWUucHVzaChuZXcgTWVzc2FnZShudWxsLCBtZXNzYWdlLCAnZ2FtZUluZm8nKSk7XHJcblx0fVxyXG5cdHNlbmRHYW1lSW5mb01hcChtYXBJZCwgbWVzc2FnZSkge1xyXG5cdFx0dGhpcy5tZXNzYWdlUXVldWUucHVzaChuZXcgTWVzc2FnZShudWxsLCBtZXNzYWdlLCAnZ2FtZUluZm8nLCBtYXBJZCkpO1xyXG5cdH1cclxuXHRzZW5kR2FtZUluZm9QbGF5ZXIoaWQsIG1lc3NhZ2UpIHtcclxuXHRcdHRoaXMubWVzc2FnZVF1ZXVlLnB1c2gobmV3IE1lc3NhZ2UobnVsbCwgbWVzc2FnZSwgJ2dhbWVJbmZvJywgbnVsbCwgaWQpKTtcclxuXHR9XHJcblx0XHJcblx0Ly8gQ2hhdCBNZXNzYWdlc1xyXG5cdHNlbmRNZXNzYWdlR2xvYmFsKHNlbmRlcklkLCBtZXNzYWdlKSB7XHJcblx0XHR0aGlzLm1lc3NhZ2VRdWV1ZS5wdXNoKG5ldyBNZXNzYWdlKHNlbmRlcklkLCBtZXNzYWdlLCAnbWVzc2FnZUdsb2JhbCcpKTtcclxuXHR9XHJcblx0c2VuZE1lc3NhZ2VNYXAoc2VuZGVySWQsIG1hcElkLCBtZXNzYWdlKSB7XHJcblx0XHR0aGlzLm1lc3NhZ2VRdWV1ZS5wdXNoKG5ldyBNZXNzYWdlKHNlbmRlcklkLCBtZXNzYWdlLCAnbWVzc2FnZU1hcCcsIG1hcElkKSk7XHJcblx0fVxyXG5cdHNlbmRNZXNzYWdlUGxheWVyKHNlbmRlcklkLCBpZCwgbWVzc2FnZSkge1xyXG5cdFx0dGhpcy5tZXNzYWdlUXVldWUucHVzaChuZXcgTWVzc2FnZShzZW5kZXJJZCwgbWVzc2FnZSwgJ21lc3NhZ2VQbGF5ZXInLCBudWxsLCBpZCkpO1xyXG5cdH1cclxuXHJcblx0Ly8gTWFwXHJcblx0aXNWYWNhbnQobWFwSWQsIHgsIHkpIHtcclxuXHRcdC8vIENoZWNrIGZvciBNYXAgRWRnZXNcclxuXHRcdGlmICh4IDwgMCB8fCB4ID49IGNvbmZpZy5NQVBfQ09MVU1OUyB8fCB5IDwgMCB8fCB5ID49IGNvbmZpZy5NQVBfUk9XUykgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHJcblx0XHQvLyBDaGVjayBmb3IgV2FsbCBUaWxlc1xyXG5cdFx0Y29uc3QgbWFwID0gdGhpcy5tYXBzW21hcElkXTtcclxuXHRcdGlmIChtYXAuaXNXYWxsW3ldW3hdKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcclxuXHRcdC8vIENoZWNrIGZvciBBY3RvcnNcclxuXHRcdGNvbnN0IGFjdG9yTGlzdCA9IHRoaXMucGxheWVycy5jb25jYXQodGhpcy5ib3RzKTtcclxuXHRcdGNvbnN0IGFjdG9yc09uVGlsZSA9IGFjdG9yTGlzdC5maWx0ZXIoYWN0b3IgPT4ge1xyXG5cdFx0XHRyZXR1cm4gYWN0b3IubWFwSWQgPT09IG1hcElkICYmIGFjdG9yLnggPT09IHggJiYgYWN0b3IueSA9PT0geSAmJiAhYWN0b3IuaXNEZWFkO1xyXG5cdFx0fSk7XHJcblx0XHRpZiAoYWN0b3JzT25UaWxlLmxlbmd0aCA+IDApIHJldHVybiBmYWxzZTtcclxuXHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdHNwYXduQm90KG1hcElkLCB4LCB5LCB0ZW1wbGF0ZUlkLCBkaXJlY3Rpb24gPSAnZG93bicpIHtcclxuXHRcdGNvbnN0IHRlbXBsYXRlID0gdGhpcy5ib3RUZW1wbGF0ZXNbdGVtcGxhdGVJZF07XHJcblx0XHRpZiAodGVtcGxhdGUpIHtcclxuXHRcdFx0bmV3IEJvdCh7bWFwSWQsIHgsIHksIGRpcmVjdGlvbiwgdGVtcGxhdGV9KTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIkJvdCBUZW1wbGF0ZSBkb2VzIG5vdCBleGlzdCB3aXRoIHRoYXQgSWRcIik7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHNwYXduTWFwSXRlbShtYXBJZCwgeCwgeSwgdGVtcGxhdGVJZCwgc3RhY2sgPSAwKSB7XHJcblx0XHRsZXQgdGVtcGxhdGUgPSB0aGlzLml0ZW1UZW1wbGF0ZXNbdGVtcGxhdGVJZF07XHJcblx0XHRpZiAodGVtcGxhdGUpIHtcclxuXHRcdFx0bmV3IEl0ZW0oe21hcElkLCB4LCB5LCB0ZW1wbGF0ZSwgc3RhY2t9KTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIkl0ZW0gVGVtcGxhdGUgZG9lcyBub3QgZXhpc3Qgd2l0aCB0aGF0IElkXCIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c3Bhd25EYW1hZ2VUZXh0KG1hcElkLCB4LCB5LCBkYW1hZ2UpIHtcclxuXHRcdG5ldyBUZXh0KG1hcElkLCB4LCB5ICsgMC41LCBkYW1hZ2UsICcjZmYwMDAwJywgMS4yNSwgMCwgLTEpO1xyXG5cdH1cclxuXHJcblx0c3Bhd25FZmZlY3QobWFwSWQsIHgsIHksIHNwcml0ZSwgbG9vcCwgc3BlZWQsIG1heEZyYW1lLCBzdGFydEZyYW1lKSB7XHJcblx0XHRuZXcgRWZmZWN0KG1hcElkLCB4LCB5LCBzcHJpdGUsIGxvb3AsIHNwZWVkLCBtYXhGcmFtZSwgc3RhcnRGcmFtZSk7XHJcblx0fVxyXG59XHJcblxyXG5jb25zdCBnYW1lID0gbmV3IEdhbWUoKTtcclxuZXhwb3J0IGRlZmF1bHQgZ2FtZTtcclxuIiwiLyoqKiBHYW1lIExvb3AgKioqL1xyXG4vKiBLZWVwcyB0cmFjayBvZiB0aW1lIGFuZCBjby1vcmRpbmF0ZXMgdGhlIGdhbWUgYW5kIHNlcnZlciAqL1xyXG5cclxuaW1wb3J0IE5vZGVHYW1lTG9vcCBmcm9tICdub2RlLWdhbWVsb29wJztcclxuXHJcbmltcG9ydCBkYiBmcm9tICcuL2RiLmpzJztcclxuaW1wb3J0IGdhbWUgZnJvbSAnLi9nYW1lLmpzJztcclxuaW1wb3J0IHNlcnZlciBmcm9tICcuL3NlcnZlci5qcyc7XHJcbmltcG9ydCBjb25maWcgZnJvbSAnLi9jb25maWcuanMnO1xyXG5cclxuY2xhc3MgR2FtZUxvb3Age1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0dGhpcy50aW1lciA9IHtcclxuXHRcdFx0YmFja3VwOiAwLFxyXG5cdFx0XHRtaW51dGU6IDBcclxuXHRcdH07XHJcblxyXG5cdFx0dGhpcy5pZCA9IE5vZGVHYW1lTG9vcC5zZXRHYW1lTG9vcCgoZGVsdGEpID0+IHRoaXMudXBkYXRlKGRlbHRhKSwgY29uZmlnLkZSQU1FUkFURSk7XHJcblx0fVxyXG5cclxuXHR1cGRhdGUoZGVsdGEpIHtcclxuXHRcdC8vIEluY3JlYXNlIFRpbWVyc1xyXG5cdFx0dGhpcy50aW1lci5iYWNrdXAgKz0gZGVsdGE7XHJcblx0XHR0aGlzLnRpbWVyLm1pbnV0ZSArPSBkZWx0YTtcclxuXHJcblx0XHQvLyBVcGRhdGUgdGhlIGdhbWUgc3RhdGVcclxuXHRcdGxldCB1cGRhdGVQYWNrID0gZ2FtZS51cGRhdGUoZGVsdGEpO1xyXG5cdFx0Ly8gU2VuZCB1cGRhdGVkIHN0YXRlIHRvIGNsaWVudHNcclxuXHRcdHNlcnZlci5zZW5kVXBkYXRlUGFjayh1cGRhdGVQYWNrKTtcclxuXHRcdFxyXG5cdFx0Ly8gTWludXRlIHRpbWVyIHNjcmlwdFxyXG5cdFx0aWYgKHRoaXMudGltZXIubWludXRlID49IDYwKSB7XHJcblx0XHRcdHRoaXMudGltZXIubWludXRlIC09IDYwO1xyXG5cdFx0XHQvLyBUT0RPOiBydW4gbWludXRlIHRpbWVyIHNjcmlwdFxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFBlcmlvZGljIGJhY2t1cCB0byBkYXRhYmFzZVxyXG5cdFx0aWYgKHRoaXMudGltZXIuYmFja3VwID49IGNvbmZpZy5CQUNLVVBfVElNRSkge1xyXG5cdFx0XHR0aGlzLnRpbWVyLmJhY2t1cCAtPSBjb25maWcuQkFDS1VQX1RJTUU7XHJcblx0XHRcdGxldCBkYlBhY2sgPSBnYW1lLmdldERCUGFjaygpO1xyXG5cdFx0XHRkYi5iYWNrdXAoZGJQYWNrKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmNvbnN0IGdhbWVMb29wID0gbmV3IEdhbWVMb29wKCk7XHJcbmV4cG9ydCBkZWZhdWx0IGdhbWVMb29wO1xyXG4iLCJpbXBvcnQgZGIgZnJvbSAnLi9kYi5qcyc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4vZ2FtZS5qcyc7XHJcbmltcG9ydCBzZXJ2ZXIgZnJvbSAnLi9zZXJ2ZXIuanMnO1xyXG5pbXBvcnQgZ2FtZWxvb3AgZnJvbSAnLi9nYW1lbG9vcC5qcyc7XHJcbiIsImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XHJcblxyXG5jb25zdCBhY2NvdW50U2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYSh7XHJcbiAgX2lkOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCxcclxuICB1c2VybmFtZToge3R5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUsIHVuaXF1ZTogdHJ1ZX0sXHJcbiAgcGFzc3dvcmQ6IHt0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlfSxcclxuICBlbWFpbDoge3R5cGU6IFN0cmluZywgbWF0Y2g6IC9eKChbXjw+KClcXFtcXF1cXFxcLiw7Olxcc0BcIl0rKFxcLltePD4oKVxcW1xcXVxcXFwuLDs6XFxzQFwiXSspKil8KFwiLitcIikpQCgoXFxbWzAtOV17MSwzfVxcLlswLTldezEsM31cXC5bMC05XXsxLDN9XFwuWzAtOV17MSwzfV0pfCgoW2EtekEtWlxcLTAtOV0rXFwuKStbYS16QS1aXXsyLH0pKSQvfSxcclxuICB2ZXJpZmllZDoge3R5cGU6IEJvb2xlYW4sIGRlZmF1bHQ6IGZhbHNlfSxcclxuICBhZG1pbjoge3R5cGU6IEJvb2xlYW4sIGRlZmF1bHQ6IGZhbHNlfVxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1vbmdvb3NlLm1vZGVsKCdBY2NvdW50JywgYWNjb3VudFNjaGVtYSk7XHJcbiIsImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XHJcblxyXG5jb25zdCBib3RTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcclxuICBfaWQ6IG1vbmdvb3NlLlNjaGVtYVR5cGVzLk9iamVjdElkLFxyXG4gIG1hcElkOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuICB4OiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiA1fSxcclxuICB5OiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiA1fSxcclxuICB0ZW1wbGF0ZToge3R5cGU6IG1vbmdvb3NlLlNjaGVtYVR5cGVzLk9iamVjdElkLCByZWY6ICdCb3RUZW1wbGF0ZScsIHJlcXVpcmVkOiB0cnVlfSxcclxuICBkaXJlY3Rpb246IHt0eXBlOiBTdHJpbmcsIGRlZmF1bHQ6ICdkb3duJ31cclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBtb25nb29zZS5tb2RlbCgnQm90JywgYm90U2NoZW1hKTtcclxuIiwiaW1wb3J0IG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcclxuXHJcbmNvbnN0IGJvdFRlbXBsYXRlU2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYSh7XHJcbiAgX2lkOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCxcclxuICBuYW1lOiB7dHlwZTogU3RyaW5nLCBkZWZhdWx0OiBcIkJvdFwifSxcclxuICBzcHJpdGU6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDF9LFxyXG4gIGRhbWFnZUJhc2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG4gIGRlZmVuY2VCYXNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuICBoZWFsdGhNYXhCYXNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuICBlbmVyZ3lNYXhCYXNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuICBoZWFsdGhSZWdlbkJhc2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDF9LFxyXG4gIGVuZXJneVJlZ2VuQmFzZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMX0sXHJcbiAgcmFuZ2VCYXNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuICBob3N0aWxlOiB7dHlwZTogQm9vbGVhbiwgZGVmYXVsdDogdHJ1ZX1cclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBtb25nb29zZS5tb2RlbCgnQm90VGVtcGxhdGUnLCBib3RUZW1wbGF0ZVNjaGVtYSk7XHJcbiIsImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XHJcblxyXG5jb25zdCBpdGVtU2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYSh7XHJcbiAgX2lkOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCxcclxuICB0ZW1wbGF0ZToge3R5cGU6IG1vbmdvb3NlLlNjaGVtYVR5cGVzLk9iamVjdElkLCByZWY6ICdJdGVtVGVtcGxhdGUnLCByZXF1aXJlZDogdHJ1ZX0sXHJcbiAgc3RhY2s6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG4gIHBsYXllcklkOiB7dHlwZTogbW9uZ29vc2UuU2NoZW1hVHlwZXMuT2JqZWN0SWQsIGRlZmF1bHQ6IG51bGx9LFxyXG4gIGJvdElkOiB7dHlwZTogbW9uZ29vc2UuU2NoZW1hVHlwZXMuT2JqZWN0SWQsIGRlZmF1bHQ6IG51bGx9LFxyXG4gIHNsb3Q6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IG51bGx9LFxyXG4gIG1hcElkOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiBudWxsfSxcclxuICB4OiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiBudWxsfSxcclxuICB5OiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiBudWxsfSxcclxuICBjcmVhdGVkQnk6IHt0eXBlOiBTdHJpbmd9LFxyXG4gIGNyZWF0ZWREYXRlOiB7dHlwZTogRGF0ZX1cclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBtb25nb29zZS5tb2RlbCgnSXRlbScsIGl0ZW1TY2hlbWEpO1xyXG4iLCJpbXBvcnQgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xyXG5cclxuY29uc3QgaXRlbVRlbXBsYXRlU2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYSh7XHJcblx0X2lkOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCxcclxuXHRuYW1lOiB7dHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZX0sXHJcblx0c3ByaXRlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuXHRyZXVzYWJsZToge3R5cGU6IEJvb2xlYW4sIGRlZmF1bHQ6IHRydWV9LFxyXG5cdGl0ZW1UeXBlOiB7dHlwZTogTnVtYmVyLCByZXF1aXJlZDogdHJ1ZX0sXHJcblx0cGFzc2l2ZURhbWFnZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcblx0cGFzc2l2ZURlZmVuY2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG5cdHBhc3NpdmVIZWFsdGhNYXg6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG5cdHBhc3NpdmVFbmVyZ3lNYXg6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG5cdHBhc3NpdmVIZWFsdGhSZWdlbjoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcblx0cGFzc2l2ZUVuZXJneVJlZ2VuOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuXHRwYXNzaXZlUmFuZ2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG5cdGVxdWlwcGVkRGFtYWdlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuXHRlcXVpcHBlZERlZmVuY2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG5cdGVxdWlwcGVkSGVhbHRoTWF4OiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuXHRlcXVpcHBlZEVuZXJneU1heDoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcblx0ZXF1aXBwZWRIZWFsdGhSZWdlbjoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcblx0ZXF1aXBwZWRFbmVyZ3lSZWdlbjoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcblx0ZXF1aXBwZWRSYW5nZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH1cclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBtb25nb29zZS5tb2RlbCgnSXRlbVRlbXBsYXRlJywgaXRlbVRlbXBsYXRlU2NoZW1hKTtcclxuIiwiaW1wb3J0IG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcclxuXHJcbmNvbnN0IGl0ZW1UeXBlU2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYSh7XHJcblx0X2lkOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCxcclxuXHRuYW1lOiB7dHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZX0sXHJcblx0ZXF1aXBwZWRTbG90OiB7dHlwZTogTnVtYmVyLCByZXF1aXJlZDogdHJ1ZX0sXHJcblx0c3RhY2thYmxlOiB7dHlwZTogQm9vbGVhbiwgcmVxdWlyZWQ6IHRydWV9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWwoJ0l0ZW1UeXBlJywgaXRlbVR5cGVTY2hlbWEpO1xyXG4iLCJpbXBvcnQgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xyXG5cclxuY29uc3QgbWFwU2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYSh7XHJcblx0X2lkOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCxcclxuXHRtYXBJZDogTnVtYmVyLFxyXG5cdG5hbWU6IHt0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlfSxcclxuXHRkcm9wQ2hhbmNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxMDB9LFxyXG5cdGRyb3BBbW91bnRFUToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMX0sXHJcblx0dGlsZXM6IHt0eXBlOiBbW1tOdW1iZXJdXV0sIGRlZmF1bHQ6IFtbW11dXX0sXHJcblx0aXNXYWxsOiB7dHlwZTogW1tCb29sZWFuXV0sIGRlZmF1bHQ6IGZhbHNlfSxcclxuXHRpc0hvc3RpbGU6IHt0eXBlOiBbW0Jvb2xlYW5dXSwgZGVmYXVsdDogZmFsc2V9LFxyXG5cdGRhbWFnZToge3R5cGU6IFtbTnVtYmVyXV0sIGRlZmF1bHQ6IG51bGx9LFxyXG5cdHdhcnBNYXA6IHt0eXBlOiBbW051bWJlcl1dLCBkZWZhdWx0OiBudWxsfSxcclxuXHR3YXJwWDoge3R5cGU6IFtbTnVtYmVyXV0sIGRlZmF1bHQ6IG51bGx9LFxyXG5cdHdhcnBZOiB7dHlwZTogW1tOdW1iZXJdXSwgZGVmYXVsdDogbnVsbH1cclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBtb25nb29zZS5tb2RlbCgnTWFwJywgbWFwU2NoZW1hKTtcclxuIiwiaW1wb3J0IG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcclxuXHJcbmNvbnN0IHBsYXllclNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoe1xyXG4gIF9pZDogbW9uZ29vc2UuU2NoZW1hVHlwZXMuT2JqZWN0SWQsXHJcbiAgYWNjb3VudDoge3R5cGU6IG1vbmdvb3NlLlNjaGVtYVR5cGVzLk9iamVjdElkLCByZWY6ICdBY2NvdW50JywgcmVxdWlyZWQ6IHRydWV9LFxyXG4gIG5hbWU6IHt0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlLCB1bmlxdWU6IHRydWV9LFxyXG4gIHRlbXBsYXRlOiB7dHlwZTogbW9uZ29vc2UuU2NoZW1hVHlwZXMuT2JqZWN0SWQsIHJlZjogJ1BsYXllclRlbXBsYXRlJywgcmVxdWlyZWQ6IHRydWV9LFxyXG4gIGxldmVsOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuICBleHBlcmllbmNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuICBtYXBJZDoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMX0sXHJcbiAgeDoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogNX0sXHJcbiAgeToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogNX0sXHJcbiAgZGlyZWN0aW9uOiB7dHlwZTogU3RyaW5nLCBkZWZhdWx0OiAnZG93bid9LFxyXG4gIGFkbWluQWNjZXNzOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuICBzcHJpdGU6IE51bWJlclxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1vbmdvb3NlLm1vZGVsKCdQbGF5ZXInLCBwbGF5ZXJTY2hlbWEpO1xyXG4iLCJpbXBvcnQgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xyXG5cclxuY29uc3QgcGxheWVyVGVtcGxhdGVTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcclxuICBfaWQ6IG1vbmdvb3NlLlNjaGVtYVR5cGVzLk9iamVjdElkLFxyXG4gIG5hbWU6IHt0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlLCB1bmlxdWU6IHRydWV9LFxyXG4gIHNwcml0ZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMX0sXHJcbiAgZGFtYWdlQmFzZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcbiAgZGVmZW5jZUJhc2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG4gIGhlYWx0aE1heEJhc2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDF9LFxyXG4gIGVuZXJneU1heEJhc2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDF9LFxyXG4gIGhlYWx0aFJlZ2VuQmFzZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMX0sXHJcbiAgZW5lcmd5UmVnZW5CYXNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuICByYW5nZUJhc2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDF9LFxyXG4gIGhlYWx0aFBlckxldmVsOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuICBlbmVyZ3lQZXJMZXZlbDoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH1cclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBtb25nb29zZS5tb2RlbCgnUGxheWVyVGVtcGxhdGUnLCBwbGF5ZXJUZW1wbGF0ZVNjaGVtYSk7XHJcbiIsImltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xyXG5pbXBvcnQgaHR0cCBmcm9tICdodHRwJztcclxuaW1wb3J0IHNvY2tldElPIGZyb20gJ3NvY2tldC5pbyc7XHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xyXG5cclxuaW1wb3J0IGRiIGZyb20gJy4vZGIuanMnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuL2dhbWUuanMnO1xyXG5pbXBvcnQgY29uZmlnIGZyb20gJy4vY29uZmlnLmpzJztcclxuXHJcbmNsYXNzIFNlcnZlciB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHRjb25zdCBhcHAgPSBleHByZXNzKCk7XHJcblx0XHRjb25zdCBodHRwU2VydmVyID0gaHR0cC5TZXJ2ZXIoYXBwKTtcclxuXHRcdGNvbnN0IGlvID0gc29ja2V0SU8oaHR0cFNlcnZlcik7XHJcblx0XHRjb25zdCBwb3J0ID0gcHJvY2Vzcy5lbnYuUE9SVCB8fCBjb25maWcuUE9SVDtcclxuXHRcdGNvbnN0IHB1YmxpY1BhdGggPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4vY2xpZW50Jyk7XHJcblx0XHRcclxuXHRcdGFwcC5nZXQoJy8nLCAocmVxLCByZXMpID0+IHJlcy5zZW5kRmlsZShwdWJsaWNQYXRoICsgJy9pbmRleC5odG1sJykpO1xyXG5cdFx0YXBwLnVzZSgnL2NsaWVudCcsIGV4cHJlc3Muc3RhdGljKHB1YmxpY1BhdGgpKTtcclxuXHRcdGh0dHBTZXJ2ZXIubGlzdGVuKHBvcnQsICgpID0+IGRiLmxvZyhgU2VydmVyIHN0YXJ0ZWQuIExpc3RlbmluZyBvbiBwb3J0ICR7aHR0cFNlcnZlci5hZGRyZXNzKCkucG9ydH0uLi5gKSk7XHJcblxyXG5cdFx0dGhpcy5zb2NrZXRMaXN0ID0ge307XHJcblx0XHR0aGlzLmFjdGl2ZUFjY291bnRzID0ge307XHJcblxyXG5cdFx0aW8uc29ja2V0cy5vbignY29ubmVjdCcsIHNvY2tldCA9PiB0aGlzLm9uQ29ubmVjdChzb2NrZXQpKTtcclxuXHR9XHJcblxyXG5cdC8qIGNvbm5lY3QgPT4gc2lnbmluID0+IHNlbGVjdHBsYXllclxyXG5cdCoqIGNvbm5lY3Qgd2hlbiBwYWdlIGxvYWRzIC0gc2hvd3Mgc2lnbmluIHBhZ2VcclxuXHQqKiBzaWduaW4gd2hlbiB1c2VybmFtZSBhbmQgcGFzc3dvcmQgaXMgc3VibWl0dGVkXHJcbiBcdCoqIHNlbGVjdHBsYXllciB3aGVuIGNoYXJhY3RlciBpcyBjaG9zZW4gLSBsb2dzIGludG8gdGhlIGdhbWVcclxuXHQqL1xyXG5cclxuXHQvLyBSZWNlaXZlIGRhdGEgZnJvbSBjbGllbnRzXHJcblx0b25Db25uZWN0KHNvY2tldCkge1xyXG5cdFx0dGhpcy5zb2NrZXRMaXN0W3NvY2tldC5pZF0gPSBzb2NrZXQ7XHJcblx0XHRkYi5sb2coYCR7c29ja2V0LmlkfSAtIFNvY2tldCBjb25uZWN0ZWQuYCk7XHJcblx0XHRcclxuXHRcdHNvY2tldC5vbignZGlzY29ubmVjdCcsICgpID0+IHRoaXMub25EaXNjb25uZWN0KHNvY2tldCkpO1xyXG5cdFx0c29ja2V0Lm9uKCdzaWdudXAnLCAoZGF0YSkgPT4gdGhpcy5vblNpZ25VcChzb2NrZXQsIGRhdGEudXNlcm5hbWUsIGRhdGEucGFzc3dvcmQsIGRhdGEuZW1haWwpKTtcclxuXHRcdHNvY2tldC5vbignc2lnbmluJywgKGRhdGEpID0+IHRoaXMub25TaWduSW4oc29ja2V0LCBkYXRhLnVzZXJuYW1lLCBkYXRhLnBhc3N3b3JkKSk7XHJcblx0XHRzb2NrZXQub24oJ3NpZ25vdXQnLCAoKSA9PiB0aGlzLm9uU2lnbk91dChzb2NrZXQpKTtcclxuXHRcdC8vIFRlbGwgY2xpZW50IHRoZXkgaGF2ZSBjb25uZWN0ZWRcclxuXHR9XHJcblxyXG5cdGFzeW5jIG9uRGlzY29ubmVjdChzb2NrZXQpIHtcclxuXHRcdGlmIChzb2NrZXQucGxheWVySWQgIT0gbnVsbCAmJiBnYW1lLnBsYXllcnNbc29ja2V0LnBsYXllcklkXSkgYXdhaXQgdGhpcy5vbkxvZ091dChzb2NrZXQpO1xyXG5cdFx0aWYgKHNvY2tldC5hY2NvdW50SWQgJiYgdGhpcy5hY3RpdmVBY2NvdW50c1tzb2NrZXQuYWNjb3VudElkXSkgYXdhaXQgdGhpcy5vblNpZ25PdXQoc29ja2V0KTtcclxuXHJcblx0XHRkYi5sb2coYCR7c29ja2V0LmlkfSAtIFNvY2tldCBkaXNjb25uZWN0ZWQuYCk7XHJcblx0XHRkZWxldGUgdGhpcy5zb2NrZXRMaXN0W3NvY2tldC5pZF07XHJcblx0fVxyXG5cclxuXHRhc3luYyBvblNpZ25VcChzb2NrZXQsIHVzZXJuYW1lLCBwYXNzd29yZCwgZW1haWwpIHtcclxuXHRcdGxldCBhY2NvdW50SWQgPSBhd2FpdCBkYi5hZGRBY2NvdW50KHVzZXJuYW1lLCBwYXNzd29yZCwgZW1haWwpO1xyXG5cdFx0aWYgKGFjY291bnRJZCkge1xyXG5cdFx0XHRkYi5sb2coYCR7c29ja2V0LmlkfSAtIEFjY291bnQgYWRkZWQ6ICR7dXNlcm5hbWV9YCk7XHJcblx0XHRcdHNvY2tldC5lbWl0KCdzaWduZWRVcCcsIHt1c2VybmFtZSwgcGFzc3dvcmR9KTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRzb2NrZXQuZW1pdCgnc2lnbmVkVXAnLCBudWxsKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGFzeW5jIG9uU2lnbkluKHNvY2tldCwgdXNlcm5hbWUsIHBhc3N3b3JkKSB7XHJcblx0XHRsZXQgc3VjY2VzcyA9IGF3YWl0IGRiLmF1dGhBY2NvdW50KHVzZXJuYW1lLCBwYXNzd29yZCk7XHJcblx0XHRpZiAoIXN1Y2Nlc3MpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coYFNpZ24gaW4gZmFpbGVkIG9uIHVzZXJuYW1lICR7dXNlcm5hbWV9YCk7XHJcblx0XHRcdHNvY2tldC5lbWl0KCdzaWduZWRJbicsIGZhbHNlKTtcdC8vIFRlbGwgY2xpZW50IHNpZ25pbiB3YXMgbm90IHN1Y2Nlc3NmdWxcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBhY2NvdW50ID0gYXdhaXQgZGIuZ2V0QWNjb3VudEJ5VXNlcm5hbWUodXNlcm5hbWUpO1xyXG5cdFx0aWYgKHRoaXMuYWN0aXZlQWNjb3VudHNbYWNjb3VudC5faWRdKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiVGhhdCBhY2NvdW50IGlzIGFscmVhZHkgc2lnbmVkIGluLlwiKTtcclxuXHRcdFx0c29ja2V0LmVtaXQoJ3NpZ25lZEluJywgZmFsc2UpO1x0Ly8gVGVsbCBjbGllbnQgdGhhdCBhY2NvdW50IGlzIGFscmVhZHkgc2lnbmVkIGluXHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0c29ja2V0LmFjY291bnRJZCA9IGFjY291bnQuX2lkO1xyXG5cdFx0dGhpcy5hY3RpdmVBY2NvdW50c1thY2NvdW50Ll9pZF0gPSB1c2VybmFtZTtcclxuXHJcblx0XHRzb2NrZXQub24oJ2FkZFBsYXllcicsIChkYXRhKSA9PiB0aGlzLm9uQWRkUGxheWVyKHNvY2tldCwgZGF0YS5uYW1lLCBkYXRhLnRlbXBsYXRlSWQpKTtcclxuXHRcdHNvY2tldC5vbignbG9naW4nLCAobmFtZSkgPT4gdGhpcy5vbkxvZ0luKHNvY2tldCwgbmFtZSkpO1xyXG5cdFx0c29ja2V0Lm9uKCdsb2dvdXQnLCAoKSA9PiB0aGlzLm9uTG9nT3V0KHNvY2tldCkpO1xyXG5cdFx0c29ja2V0Lm9uKCdhZGRQbGF5ZXJUZW1wbGF0ZScsIChkYXRhKSA9PiB0aGlzLm9uQWRkUGxheWVyVGVtcGxhdGUoZGF0YSkpO1xyXG5cclxuXHRcdGRiLmxvZyhgJHtzb2NrZXQuaWR9IC0gJHt1c2VybmFtZX0gc2lnbmVkIGluLmApO1xyXG5cdFx0bGV0IHBsYXllcnMgPSBhd2FpdCBkYi5nZXRQbGF5ZXJzQnlBY2NvdW50KGFjY291bnQuX2lkKTtcclxuXHRcdGxldCBwbGF5ZXJUZW1wbGF0ZXMgPSBhd2FpdCBkYi5nZXRBbGxQbGF5ZXJUZW1wbGF0ZXMoKTtcclxuXHRcdHNvY2tldC5lbWl0KCdzaWduZWRJbicsIHthY2NvdW50LCBwbGF5ZXJzLCBwbGF5ZXJUZW1wbGF0ZXN9KTtcclxuXHR9XHJcblx0XHJcblx0YXN5bmMgb25TaWduT3V0KHNvY2tldCkge1xyXG5cdFx0aWYgKHNvY2tldC5wbGF5ZXJJZCAhPSBudWxsKSBhd2FpdCB0aGlzLm9uTG9nT3V0KHNvY2tldCk7XHJcblx0XHRcclxuXHRcdGlmIChzb2NrZXQuYWNjb3VudElkKSB7XHJcblx0XHRcdGNvbnN0IHVzZXJuYW1lID0gdGhpcy5hY3RpdmVBY2NvdW50c1tzb2NrZXQuYWNjb3VudElkXTtcclxuXHRcdFx0ZGIubG9nKGAke3NvY2tldC5pZH0gLSAke3VzZXJuYW1lfSBzaWduZWQgb3V0LmApO1xyXG5cdFx0XHRkZWxldGUgdGhpcy5hY3RpdmVBY2NvdW50c1tzb2NrZXQuYWNjb3VudElkXTtcclxuXHRcdFx0c29ja2V0LmFjY291bnRJZCA9IG51bGw7XHJcblx0XHRcdHNvY2tldC5lbWl0KCdzaWduZWRPdXQnKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGFzeW5jIG9uQWRkUGxheWVyKHNvY2tldCwgbmFtZSwgdGVtcGxhdGVJZCkge1xyXG5cdFx0bGV0IHBsYXllcklkID0gYXdhaXQgZGIuYWRkUGxheWVyKHNvY2tldC5hY2NvdW50SWQsIG5hbWUsIHRlbXBsYXRlSWQpO1xyXG5cdFx0aWYgKHBsYXllcklkKSB7XHJcblx0XHRcdGNvbnN0IHVzZXJuYW1lID0gdGhpcy5hY3RpdmVBY2NvdW50c1tzb2NrZXQuYWNjb3VudElkXTtcclxuXHRcdFx0ZGIubG9nKGAke3NvY2tldC5pZH0gLSAke25hbWV9IGhhcyBiZWVuIGFkZGVkIGFzIGEgcGxheWVyIHRvIGFjY291bnQgJHt1c2VybmFtZX0uYCk7XHJcblx0XHRcdHNvY2tldC5lbWl0KCdwbGF5ZXJBZGRlZCcsIHBsYXllcklkKTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRzb2NrZXQuZW1pdCgncGxheWVyQWRkZWQnLCBudWxsKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0YXN5bmMgb25BZGRQbGF5ZXJUZW1wbGF0ZShkYXRhKSB7XHJcblx0XHRsZXQgc3VjY2VzcyA9IGF3YWl0IGRiLmFkZFBsYXllclRlbXBsYXRlKGRhdGEpO1xyXG5cdFx0aWYgKHN1Y2Nlc3MpIHtcclxuXHRcdFx0Z2FtZS5sb2FkUGxheWVyVGVtcGxhdGVzKCk7XHJcblx0XHRcdGRiLmxvZyhgJHtzb2NrZXQuaWR9IC0gJHtkYXRhLm5hbWV9IGhhcyBiZWVuIGFkZGVkIGFzIGEgcGxheWVyIHRlbXBsYXRlLmApO1xyXG5cdFx0XHQvLyBUZWxsIGNsaWVudCBhZGQgcGxheWVyIHdhcyBzdWNjZXNzZnVsXHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Ly8gVGVsbCBjbGllbnQgYWRkIHBsYXllciB3YXMgbm90IHN1Y2Nlc3NmdWxcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGFzeW5jIG9uTG9nSW4oc29ja2V0LCBwbGF5ZXJJZCkge1xyXG5cdFx0aWYgKCFzb2NrZXQuYWNjb3VudElkKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiTm90IHNpZ25lZCBpbnRvIGFjY291bnQuXCIpO1xyXG5cdFx0XHRzb2NrZXQuZW1pdCgnbG9nZ2VkSW4nLCBmYWxzZSk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdGlmIChzb2NrZXQucGxheWVySWQgIT0gbnVsbCkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIkFscmVhZHkgbG9nZ2VkIGluLlwiKTtcclxuXHRcdFx0c29ja2V0LmVtaXQoJ2xvZ2dlZEluJywgZmFsc2UpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IHBsYXllckRhdGEgPSBhd2FpdCBkYi5nZXRQbGF5ZXIocGxheWVySWQpO1xyXG5cdFx0aWYgKCFwbGF5ZXJEYXRhKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiTm8gcGxheWVyIHdpdGggdGhhdCBuYW1lLlwiKTtcclxuXHRcdFx0c29ja2V0LmVtaXQoJ2xvZ2dlZEluJywgZmFsc2UpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKFwiXCIrc29ja2V0LmFjY291bnRJZCAhPT0gXCJcIitwbGF5ZXJEYXRhLmFjY291bnQpIHtcdC8vIENhc3QgdG8gc3RyaW5nIGJlZm9yZSBjb21wYXJpc29uXHJcblx0XHRcdGRiLmxvZyhgQXR0ZW1wdCB0byBsb2dpbiB0byBwbGF5ZXIgKCR7cGxheWVyRGF0YS5uYW1lfSkgZnJvbSB3cm9uZyBhY2NvdW50ICgke3NvY2tldC5hY2NvdW50SWR9KSBvbiBzb2NrZXQgJHtzb2NrZXQuaWR9LmApO1xyXG5cdFx0XHRzb2NrZXQuZW1pdCgnbG9nZ2VkSW4nLCBmYWxzZSk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBwbGF5ZXIgPSBnYW1lLnBsYXllckxvZ2luKHNvY2tldC5pZCwgcGxheWVyRGF0YSk7XHJcblx0XHRpZiAoIXBsYXllcikge1xyXG5cdFx0XHRzb2NrZXQuZW1pdCgnbG9nZ2VkSW4nLCBmYWxzZSk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcclxuXHRcdHNvY2tldC5wbGF5ZXJJZCA9IHBsYXllci5nYW1lSWQ7XHJcblx0XHRzb2NrZXQub24oJ2lucHV0JywgKGRhdGEpID0+IHBsYXllci5pbnB1dERhdGEoZGF0YSkpO1xyXG5cdFx0c29ja2V0Lm9uKCd1cGxvYWRNYXAnLCAoZGF0YSkgPT4ge1xyXG5cdFx0XHRpZiAocGxheWVyLmFkbWluQWNjZXNzID49IDIpIHRoaXMub25VcGxvYWRNYXAoZGF0YSk7XHJcblx0XHRcdGVsc2UgZ2FtZS5zZW5kR2FtZUluZm9QbGF5ZXIocGxheWVyLmdhbWVJZCwgYFlvdSBkb24ndCBoYXZlIGFjY2VzcyB0byB0aGF0IGNvbW1hbmQuYCk7XHJcblx0XHR9KTtcclxuXHRcdGNvbnN0IG1hcERhdGEgPSBnYW1lLm1hcHNbcGxheWVyLm1hcElkXS5nZXRQYWNrKCk7XHJcblx0XHRzb2NrZXQuZW1pdCgnbG9nZ2VkSW4nLCBtYXBEYXRhKTtcclxuXHR9XHJcblx0XHJcblx0YXN5bmMgb25Mb2dPdXQoc29ja2V0KSB7XHJcblx0XHRpZiAoc29ja2V0LnBsYXllcklkICE9IG51bGwpIHtcclxuXHRcdFx0YXdhaXQgZ2FtZS5wbGF5ZXJMb2dvdXQoc29ja2V0LnBsYXllcklkKTtcclxuXHRcdFx0c29ja2V0LnBsYXllcklkID0gbnVsbDtcclxuXHRcdFx0c29ja2V0LmVtaXQoJ2xvZ2dlZE91dCcpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRhc3luYyBvblVwbG9hZE1hcChkYXRhKSB7XHJcblx0XHRsZXQgc3VjY2VzcyA9IGF3YWl0IGRiLnNhdmVNYXAoZGF0YSk7XHJcblx0XHRpZiAoIXN1Y2Nlc3MpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJGYWlsZWQgdG8gdXBsb2FkIG1hcC5cIik7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdGdhbWUubWFwc1tkYXRhLm1hcElkXS51cGxvYWQoZGF0YSk7XHJcblx0XHRcclxuXHRcdGdhbWUucGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcclxuXHRcdFx0aWYgKHBsYXllci5tYXBJZCA9PT0gZGF0YS5tYXBJZCkge1xyXG5cdFx0XHRcdHRoaXMuc2VuZE1hcERhdGEodGhpcy5zb2NrZXRMaXN0W3BsYXllci5zb2NrZXRJZF0sIHBsYXllci5tYXBJZCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0Ly8gU2VuZCBkYXRhIHRvIGNsaWVudHNcclxuXHRzZW5kVXBkYXRlUGFjayh1cGRhdGVQYWNrKSB7XHJcblx0XHRnYW1lLnBsYXllcnMuZm9yRWFjaChwbGF5ZXIgPT4ge1xyXG5cdFx0XHRjb25zdCBwYWNrID0ge1xyXG5cdFx0XHRcdGdhbWU6IHtcclxuXHRcdFx0XHRcdHBsYXllcnM6IFtdLFxyXG5cdFx0XHRcdFx0Ym90czogW10sXHJcblx0XHRcdFx0XHRpdGVtczogW10sXHJcblx0XHRcdFx0XHRlZmZlY3RzOiBbXSxcclxuXHRcdFx0XHRcdHRleHRzOiBbXVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0bWVudTogcGxheWVyLmdldFVJUGFjaygpLFxyXG5cdFx0XHRcdGNoYXRib3g6IHt9XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRmb3IgKGxldCBwbGF5ZXJEYXRhIG9mIHVwZGF0ZVBhY2sucGxheWVycykge1xyXG5cdFx0XHRcdGlmIChwbGF5ZXJEYXRhICYmICgocGxheWVyRGF0YS5tYXBJZCA9PT0gcGxheWVyLm1hcElkICYmIHBsYXllckRhdGEuaXNWaXNpYmxlKSB8fCBwbGF5ZXJEYXRhLnNvY2tldElkID09PSBwbGF5ZXIuc29ja2V0SWQpKSB7XHJcblx0XHRcdFx0XHRwYWNrLmdhbWUucGxheWVyc1twbGF5ZXJEYXRhLmdhbWVJZF0gPSBwbGF5ZXJEYXRhO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRmb3IgKGxldCBib3Qgb2YgdXBkYXRlUGFjay5ib3RzKSB7XHJcblx0XHRcdFx0aWYgKGJvdCAmJiBib3QubWFwSWQgPT09IHBsYXllci5tYXBJZCkgcGFjay5nYW1lLmJvdHNbYm90LmdhbWVJZF0gPSBib3Q7XHJcblx0XHRcdH1cclxuXHRcdFx0Zm9yIChsZXQgaXRlbSBvZiB1cGRhdGVQYWNrLml0ZW1zKSB7XHJcblx0XHRcdFx0aWYgKGl0ZW0gJiYgaXRlbS5tYXBJZCA9PT0gcGxheWVyLm1hcElkKSBwYWNrLmdhbWUuaXRlbXNbaXRlbS5nYW1lSWRdID0gaXRlbTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmb3IgKGxldCBlZmZlY3Qgb2YgdXBkYXRlUGFjay5lZmZlY3RzKSB7XHJcblx0XHRcdFx0aWYgKGVmZmVjdCAmJiBlZmZlY3QubWFwSWQgPT09IHBsYXllci5tYXBJZCkgcGFjay5nYW1lLmVmZmVjdHNbZWZmZWN0LmdhbWVJZF0gPSBlZmZlY3Q7XHJcblx0XHRcdH1cclxuXHRcdFx0Zm9yIChsZXQgdGV4dCBvZiB1cGRhdGVQYWNrLnRleHRzKSB7XHJcblx0XHRcdFx0aWYgKHRleHQgJiYgdGV4dC5tYXBJZCA9PT0gcGxheWVyLm1hcElkKSBwYWNrLmdhbWUudGV4dHNbdGV4dC5nYW1lSWRdID0gdGV4dDtcclxuXHRcdFx0fVxyXG5cclxuXHJcbi8qIFx0XHRcdHBhY2suZ2FtZS5wbGF5ZXJzID0gdXBkYXRlUGFjay5wbGF5ZXJzLmZpbHRlcihwbGF5ZXJEYXRhID0+IHBsYXllckRhdGEuc29ja2V0SWQgPT09IHBsYXllci5zb2NrZXRJZCB8fCAocGxheWVyRGF0YS5tYXBJZCA9PT0gcGxheWVyLm1hcElkICYmIHBsYXllckRhdGEuaXNWaXNpYmxlKSk7XHJcblx0XHRcdHBhY2suZ2FtZS5ib3RzID0gdXBkYXRlUGFjay5ib3RzLmZpbHRlcihib3QgPT4gYm90Lm1hcElkID09PSBwbGF5ZXIubWFwSWQpO1xyXG5cdFx0XHRwYWNrLmdhbWUuaXRlbXMgPSB1cGRhdGVQYWNrLml0ZW1zLmZpbHRlcihpdGVtID0+IGl0ZW0ubWFwSWQgPT09IHBsYXllci5tYXBJZCk7XHJcblx0XHRcdHBhY2suZ2FtZS5lZmZlY3RzID0gdXBkYXRlUGFjay5lZmZlY3RzLmZpbHRlcihlZmZlY3QgPT4gZWZmZWN0Lm1hcElkID09PSBwbGF5ZXIubWFwSWQpO1xyXG5cdFx0XHRwYWNrLmdhbWUudGV4dHMgPSB1cGRhdGVQYWNrLnRleHRzLmZpbHRlcih0ZXh0ID0+IHRleHQubWFwSWQgPT09IHBsYXllci5tYXBJZCk7ICovXHJcblxyXG5cdFx0XHRwYWNrLmNoYXRib3gubWVzc2FnZXMgPSB1cGRhdGVQYWNrLm1lc3NhZ2VzLmZpbHRlcihtZXNzYWdlID0+IHtcclxuXHRcdFx0XHRyZXR1cm4gKG1lc3NhZ2UubWFwSWQgPT0gbnVsbCAmJiBtZXNzYWdlLmlkID09IG51bGwpIHx8IHBsYXllci5tYXBJZCA9PT0gbWVzc2FnZS5tYXBJZCB8fCBwbGF5ZXIuZ2FtZUlkID09PSBtZXNzYWdlLmlkO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0XHJcblx0XHRcdHRoaXMuc29ja2V0TGlzdFtwbGF5ZXIuc29ja2V0SWRdLmVtaXQoJ3VwZGF0ZScsIHBhY2spO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdFxyXG5cdHNlbmRNYXBEYXRhKHNvY2tldCwgbWFwSWQpIHtcclxuXHRcdGNvbnN0IG1hcERhdGEgPSBnYW1lLm1hcHNbbWFwSWRdLmdldFBhY2soKTtcclxuXHRcdHNvY2tldC5lbWl0KCdsb2FkTWFwJywgbWFwRGF0YSk7XHJcblx0fVxyXG59XHJcblxyXG5jb25zdCBzZXJ2ZXIgPSBuZXcgU2VydmVyKCk7XHJcbmV4cG9ydCBkZWZhdWx0IHNlcnZlcjtcclxuIiwiZnVuY3Rpb24gY3JlYXRlMmRBcnJheShjb2x1bW5zLCByb3dzLCBkZWZhdWx0VmFsdWUpIHtcclxuICBjb25zdCBhcnJheSA9IFtdO1xyXG4gIGZvciAobGV0IHkgPSAwOyB5IDwgcm93czsgeSsrKSB7XHJcbiAgICBhcnJheVt5XSA9IFtdO1xyXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCBjb2x1bW5zOyB4KyspIHtcclxuICAgICAgYXJyYXlbeV1beF0gPSBkZWZhdWx0VmFsdWU7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBhcnJheTtcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlM2RBcnJheShjb2x1bW5zLCByb3dzLCBsYXllcnMsIGRlZmF1bHRWYWx1ZSkge1xyXG4gIGNvbnN0IGFycmF5ID0gW107XHJcbiAgZm9yIChsZXQgeiA9IDA7IHogPCBsYXllcnM7IHorKykge1xyXG4gICAgYXJyYXlbel0gPSBbXTsgXHJcbiAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHJvd3M7IHkrKykge1xyXG4gICAgICBhcnJheVt6XVt5XSA9IFtdO1xyXG4gICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IGNvbHVtbnM7IHgrKykge1xyXG4gICAgICAgIGFycmF5W3pdW3ldW3hdID0gZGVmYXVsdFZhbHVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBhcnJheTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2h1ZmZsZShhcnJheSkge1xyXG4gIGxldCBjdXJyZW50SW5kZXggPSBhcnJheS5sZW5ndGg7XHJcbiAgbGV0IHRlbXA7XHJcbiAgbGV0IHJhbmRvbUluZGV4O1xyXG4gIHdoaWxlIChjdXJyZW50SW5kZXggIT09IDApIHtcclxuICAgIHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY3VycmVudEluZGV4KTtcclxuICAgIGN1cnJlbnRJbmRleCAtPSAxO1xyXG4gICAgdGVtcCA9IGFycmF5W2N1cnJlbnRJbmRleF07XHJcbiAgICBhcnJheVtjdXJyZW50SW5kZXhdID0gYXJyYXlbcmFuZG9tSW5kZXhdO1xyXG4gICAgYXJyYXlbcmFuZG9tSW5kZXhdID0gdGVtcDtcclxuICB9XHJcbiAgcmV0dXJuIGFycmF5O1xyXG59XHJcblxyXG5mdW5jdGlvbiBzd2FwKGFycmF5LCBpLCBqKSB7XHJcbiAgY29uc3QgdGVtcCA9IGFycmF5W2ldO1xyXG4gIGFycmF5W2ldID0gYXJyYXlbal07XHJcbiAgYXJyYXlbal0gPSB0ZW1wO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmaXJzdEVtcHR5SW5kZXgoYXJyYXkpIHtcclxuICBpZiAoYXJyYXkubGVuZ3RoIDwgMSkgcmV0dXJuIDA7XHJcbiAgXHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPD0gYXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgIGlmIChhcnJheVtpXSA9PSBudWxsKSByZXR1cm4gaTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxlcnAoc3RhcnQsIGVuZCwgdGltZSkge1xyXG4gIC8vcmV0dXJuIHN0YXJ0ICsgKHRpbWUgKiAoZW5kIC0gc3RhcnQpKTtcclxuICByZXR1cm4gKCgxIC0gdGltZSkgKiBzdGFydCkgKyAodGltZSAqIGVuZCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNsYW1wKHZhbHVlLCBtaW5pbXVtLCBtYXhpbXVtKSB7XHJcbiAgaWYgKHZhbHVlIDwgbWluaW11bSkge1xyXG4gICAgcmV0dXJuIG1pbmltdW07XHJcbiAgfVxyXG4gIGVsc2UgaWYgKHZhbHVlID4gbWF4aW11bSkge1xyXG4gICAgcmV0dXJuIG1heGltdW07XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gcmFuZG9tSW50KG1pbmltdW0sIG1heGltdW0pIHtcclxuICByZXR1cm4gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIChtYXhpbXVtICsgMSkpICsgbWluaW11bSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFhGcm9tSW5kZXgoaW5kZXgsIGNvbHVtbnMpIHtcclxuICByZXR1cm4gaW5kZXggJSBjb2x1bW5zO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRZRnJvbUluZGV4KGluZGV4LCBjb2x1bW5zKSB7XHJcbiAgcmV0dXJuIChpbmRleCAtIChpbmRleCAlIGNvbHVtbnMpKSAvIGNvbHVtbnM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEluZGV4RnJvbVhZKHgsIHksIGNvbHVtbnMpIHtcclxuICByZXR1cm4gKHkgKiBjb2x1bW5zKSArIHg7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRpbWVzdGFtcChkYXRlKSB7XHJcbiAgaWYgKCEoZGF0ZSBpbnN0YW5jZW9mIERhdGUpKSByZXR1cm4gXCJJbnZhbGlkIGRhdGVcIjtcclxuICBsZXQgbW9udGggPSBkYXRlLmdldE1vbnRoKCkgKyAxO1xyXG4gIGxldCBkYXkgPSBkYXRlLmdldERhdGUoKTtcclxuICBsZXQgaG91ciA9IGRhdGUuZ2V0SG91cnMoKTtcclxuICBsZXQgbWludXRlID0gZGF0ZS5nZXRNaW51dGVzKCk7XHJcbiAgbGV0IHNlY29uZCA9IGRhdGUuZ2V0U2Vjb25kcygpO1xyXG4gIGlmIChtb250aCA8IDEwKSBtb250aCA9IFwiMFwiICsgbW9udGg7XHJcbiAgaWYgKGRheSA8IDEwKSBkYXkgPSBcIjBcIiArIGRheTtcclxuICBpZiAoaG91ciA8IDEwKSBob3VyID0gXCIwXCIgKyBob3VyO1xyXG4gIGlmIChtaW51dGUgPCAxMCkgbWludXRlID0gXCIwXCIgKyBtaW51dGU7XHJcbiAgaWYgKHNlY29uZCA8IDEwKSBzZWNvbmQgPSBcIjBcIiArIHNlY29uZDtcclxuICByZXR1cm4gYCR7ZGF0ZS5nZXRGdWxsWWVhcigpfS0ke21vbnRofS0ke2RheX0gJHtob3VyfToke21pbnV0ZX06JHtzZWNvbmR9YDtcclxufVxyXG5cclxuZnVuY3Rpb24gaW5kZWZpbml0ZUFydGljbGUod29yZCkge1xyXG5cdGxldCByZWdleCA9IC90cm91c2VycyR8amVhbnMkfGdsYXNzZXMkL2k7XHJcblx0aWYgKHdvcmQubWF0Y2gocmVnZXgpKSByZXR1cm4gXCJhIHBhaXIgb2YgXCIgKyB3b3JkO1xyXG5cclxuXHRyZWdleCA9IC9eW2FlaW91XS9pO1xyXG5cdGlmICh3b3JkLm1hdGNoKHJlZ2V4KSkgcmV0dXJuIFwiYW4gXCIgKyB3b3JkO1xyXG5cclxuXHRyZXR1cm4gXCJhIFwiICsgd29yZDtcclxufVxyXG5cclxuZnVuY3Rpb24gcGx1cmFsKHdvcmQpIHtcclxuXHRsZXQgcmVnZXggPSAvc2hlZXAkfGRlZXIkfGZpc2gkL2k7XHJcblx0aWYgKHdvcmQubWF0Y2gocmVnZXgpKSByZXR1cm4gd29yZDtcclxuXHJcblx0cmVnZXggPSAvdHJvdXNlcnMkfGplYW5zJHxnbGFzc2VzJC9pO1xyXG5cdGlmICh3b3JkLm1hdGNoKHJlZ2V4KSkgcmV0dXJuIFwicGFpcnMgb2YgXCIgKyB3b3JkO1xyXG5cdFxyXG5cdHJlZ2V4ID0gL3N0b21hY2gkfGVwb2NoJHwvaTtcclxuXHRpZiAod29yZC5tYXRjaChyZWdleCkpIHJldHVybiB3b3JkICsgXCJzXCI7XHJcblx0XHJcblx0cmVnZXggPSAvZiR8ZmUkL2k7XHJcblx0aWYgKHdvcmQubWF0Y2gocmVnZXgpKSByZXR1cm4gd29yZC5yZXBsYWNlKHJlZ2V4LCBcInZlc1wiKTtcclxuXHJcblx0cmVnZXggPSAvW3N4el0kfGNoJHxzaCR8YXRvJC9pO1xyXG5cdGlmICh3b3JkLm1hdGNoKHJlZ2V4KSkgcmV0dXJuIHdvcmQgKyBcImVzXCI7XHJcblx0XHJcblx0cmVnZXggPSAveSQvaTtcclxuXHRpZiAod29yZC5tYXRjaChyZWdleCkpIHJldHVybiB3b3JkLnJlcGxhY2UocmVnZXgsIFwiaWVzXCIpO1xyXG5cdFxyXG5cdHJldHVybiB3b3JkICsgXCJzXCI7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBjcmVhdGUyZEFycmF5LFxyXG4gIGNyZWF0ZTNkQXJyYXksXHJcbiAgc2h1ZmZsZSxcclxuICBzd2FwLFxyXG4gIGZpcnN0RW1wdHlJbmRleCxcclxuICBsZXJwLFxyXG4gIGNsYW1wLFxyXG4gIHJhbmRvbUludCxcclxuICBnZXRYRnJvbUluZGV4LFxyXG4gIGdldFlGcm9tSW5kZXgsXHJcbiAgZ2V0SW5kZXhGcm9tWFksXHJcbiAgdGltZXN0YW1wLFxyXG4gIGluZGVmaW5pdGVBcnRpY2xlLFxyXG4gIHBsdXJhbFxyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJiY3J5cHRcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJmc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJodHRwXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm1vbmdvb3NlXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm5vZGUtZ2FtZWxvb3BcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJzb2NrZXQuaW9cIik7Il0sInNvdXJjZVJvb3QiOiIifQ==
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL2FjdG9yLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy9ib3QuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL2VmZmVjdC5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2NsYXNzZXMvZW50aXR5LmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy9pdGVtLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy9tYXAuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL21lc3NhZ2UuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL3BsYXllci5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2NsYXNzZXMvdGV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2NvbmZpZy5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2RiLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvZ2FtZS5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2dhbWVsb29wLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL21vZGVscy9hY2NvdW50LmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvbW9kZWxzL2JvdC5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL21vZGVscy9ib3RUZW1wbGF0ZS5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL21vZGVscy9pdGVtLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvbW9kZWxzL2l0ZW1UZW1wbGF0ZS5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL21vZGVscy9pdGVtVHlwZS5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL21vZGVscy9tYXAuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9tb2RlbHMvcGxheWVyLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvbW9kZWxzL3BsYXllclRlbXBsYXRlLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvc2VydmVyLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvdXRpbC5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJiY3J5cHRcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJleHByZXNzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZnNcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJodHRwXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibW9uZ29vc2VcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJub2RlLWdhbWVsb29wXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicGF0aFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInNvY2tldC5pb1wiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxpQkFBaUIsc0JBQXNCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsbUJBQW1CO0FBQ25CO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwrREFBK0Q7O0FBRS9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxzQkFBc0I7QUFDdEIsR0FBRzs7QUFFSDs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7O0FBRUo7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTs7QUFFSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsaUJBQWlCLHFCQUFxQjtBQUN0QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBOztBQUVBLG9CQUFvQiwwRUFBOEI7QUFDbEQ7QUFDQSxrQkFBa0Isc0JBQXNCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSx1RkFBMkM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrRUFBa0U7QUFDbEU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNscUJBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHNCQUFzQjtBQUN0Qjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLDBFQUE4QjtBQUNsRDtBQUNBOztBQUVBLGlCQUFpQixzQkFBc0I7QUFDdkM7QUFDQSxxQkFBcUIsMEVBQThCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuT0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzREE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2JBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsT0FBTztBQUNQO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMvTEE7QUFDQTs7QUFFQTtBQUNBLDZCQUE2QjtBQUM3Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ3BFQTtBQUNBO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1RBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUhBQXVFLFdBQVc7QUFDbEY7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM01BO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDcEVBO0FBQUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHLHFEQUFxRDtBQUN4RCxHQUFHLHNEQUFzRDtBQUN6RCxHQUFHLGtEQUFrRDtBQUNyRCxHQUFHLGtEQUFrRDtBQUNyRCxHQUFHLGtEQUFrRDtBQUNyRCxHQUFHLGtEQUFrRDtBQUNyRCxHQUFHO0FBQ0g7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2xDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHdGQUFpRCxzQkFBc0I7O0FBRXZFO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0osR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSixHQUFHO0FBQ0g7QUFDQTtBQUNBLDBGQUF1QyxtQkFBbUI7QUFDMUQ7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3REFBd0QsU0FBUztBQUNqRTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUZBQWdDLG1CQUFtQjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtRkFBZ0MsbUJBQW1CO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxpRkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUZBQWtDLHdCQUF3QixHQUFHLFdBQVc7QUFDeEU7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrRkFBK0IsV0FBVztBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtFQUE0QixtQkFBbUI7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvRkFBaUMsZ0JBQWdCLEdBQUcsV0FBVztBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLG9CQUFvQjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0VBQTRCLFdBQVc7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpRkFBOEIsZ0JBQWdCLEdBQUcsV0FBVztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkVBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQixvQkFBb0I7QUFDckM7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQix1QkFBdUI7QUFDeEMscUVBQWtCLHVCQUF1QjtBQUN6QztBQUNBLElBQUk7QUFDSjs7QUFFQTtBQUNBLGlCQUFpQix1QkFBdUI7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGdGQUE0QixhQUFhO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtGQUE4QixrQkFBa0IsR0FBRyxXQUFXLEdBQUcsYUFBYTtBQUM5RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrRUFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsdUdBQW9ELGdCQUFnQjtBQUNwRTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdGQUFxQztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxRkFBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVGQUFtQztBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0ZBQStCLGlCQUFpQixHQUFHLFdBQVcsR0FBRyxhQUFhO0FBQzlFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtFQUE0QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQixxQkFBcUI7QUFDdEM7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQix3QkFBd0I7QUFDekMsc0VBQW1CLHdCQUF3QjtBQUMzQztBQUNBLElBQUk7QUFDSjs7QUFFQTtBQUNBLGlCQUFpQix3QkFBd0I7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcmhCQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixxQkFBcUI7QUFDeEM7QUFDQTtBQUNBOztBQUVBLG1CQUFtQixrRUFBc0I7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0osR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSixHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0osR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEVBQTBFLFlBQVksV0FBVyxhQUFhO0FBQzlHLGtGQUFrRixZQUFZLFVBQVUsYUFBYTtBQUNySDtBQUNBO0FBQ0E7QUFDQSw2REFBNkQsWUFBWSxjQUFjLGFBQWE7QUFDcEcsNEVBQTRFLFlBQVksS0FBSyxhQUFhO0FBQzFHO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0EsSUFBSTs7QUFFSjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixxQkFBcUI7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixvQkFBb0I7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlCQUFpQix5QkFBeUI7QUFDMUM7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLHNCQUFzQjtBQUN2QztBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsdUJBQXVCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQix5QkFBeUI7QUFDMUM7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLHVCQUF1QjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHdEQUFZLFNBQVMsS0FBSyxZQUFZO0FBQ3RDLDZCQUE2QixZQUFZO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlEQUFhLGdCQUFnQixLQUFLLFlBQVk7QUFDOUMsOEJBQThCLFlBQVk7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsa0VBQXNCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUFZLGlDQUFpQztBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGlFQUFhLDZCQUE2QjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDalRBO0FBQUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDSEE7O0FBRUE7QUFDQTtBQUNBLGFBQWEsMkNBQTJDO0FBQ3hELGFBQWEsNkJBQTZCO0FBQzFDLFVBQVUsd0NBQXdDLHlCQUF5Qiw2QkFBNkIsSUFBSSxRQUFRLElBQUksUUFBUSxJQUFJLFFBQVEsSUFBSSxnQ0FBZ0MsR0FBRyxLQUFLO0FBQ3hMLGFBQWEsOEJBQThCO0FBQzNDLFVBQVU7QUFDVixDQUFDOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7O0FDWEE7O0FBRUE7QUFDQTtBQUNBLFVBQVUseUJBQXlCO0FBQ25DLE1BQU0seUJBQXlCO0FBQy9CLE1BQU0seUJBQXlCO0FBQy9CLGFBQWEsK0dBQXdFO0FBQ3JGLGNBQWM7QUFDZCxDQUFDOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7O0FDWEE7O0FBRUE7QUFDQTtBQUNBLFNBQVMsNkJBQTZCO0FBQ3RDLFdBQVcseUJBQXlCO0FBQ3BDLGVBQWUseUJBQXlCO0FBQ3hDLGdCQUFnQix5QkFBeUI7QUFDekMsa0JBQWtCLHlCQUF5QjtBQUMzQyxrQkFBa0IseUJBQXlCO0FBQzNDLG9CQUFvQix5QkFBeUI7QUFDN0Msb0JBQW9CLHlCQUF5QjtBQUM3QyxjQUFjLHlCQUF5QjtBQUN2QyxZQUFZO0FBQ1osQ0FBQzs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7OztBQ2hCQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxnSEFBeUU7QUFDdEYsVUFBVSx5QkFBeUI7QUFDbkMsYUFBYSwwRkFBbUQ7QUFDaEUsVUFBVSwwRkFBbUQ7QUFDN0QsU0FBUyw0QkFBNEI7QUFDckMsVUFBVSw0QkFBNEI7QUFDdEMsTUFBTSw0QkFBNEI7QUFDbEMsTUFBTSw0QkFBNEI7QUFDbEMsY0FBYyxhQUFhO0FBQzNCLGdCQUFnQjtBQUNoQixDQUFDOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7O0FDaEJBOztBQUVBO0FBQ0E7QUFDQSxRQUFRLDZCQUE2QjtBQUNyQyxVQUFVLHlCQUF5QjtBQUNuQyxZQUFZLDZCQUE2QjtBQUN6QyxZQUFZLDZCQUE2QjtBQUN6QyxpQkFBaUIseUJBQXlCO0FBQzFDLGtCQUFrQix5QkFBeUI7QUFDM0Msb0JBQW9CLHlCQUF5QjtBQUM3QyxvQkFBb0IseUJBQXlCO0FBQzdDLHNCQUFzQix5QkFBeUI7QUFDL0Msc0JBQXNCLHlCQUF5QjtBQUMvQyxnQkFBZ0IseUJBQXlCO0FBQ3pDLGtCQUFrQix5QkFBeUI7QUFDM0MsbUJBQW1CLHlCQUF5QjtBQUM1QyxxQkFBcUIseUJBQXlCO0FBQzlDLHFCQUFxQix5QkFBeUI7QUFDOUMsdUJBQXVCLHlCQUF5QjtBQUNoRCx1QkFBdUIseUJBQXlCO0FBQ2hELGlCQUFpQjtBQUNqQixDQUFDOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7O0FDeEJBOztBQUVBO0FBQ0E7QUFDQSxRQUFRLDZCQUE2QjtBQUNyQyxnQkFBZ0IsNkJBQTZCO0FBQzdDLGFBQWE7QUFDYixDQUFDOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7O0FDVEE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUSw2QkFBNkI7QUFDckMsY0FBYywyQkFBMkI7QUFDekMsZ0JBQWdCLHlCQUF5QjtBQUN6QyxTQUFTLG9DQUFvQztBQUM3QyxVQUFVLGtDQUFrQztBQUM1QyxhQUFhLGtDQUFrQztBQUMvQyxVQUFVLGdDQUFnQztBQUMxQyxXQUFXLGdDQUFnQztBQUMzQyxTQUFTLGdDQUFnQztBQUN6QyxTQUFTO0FBQ1QsQ0FBQzs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7OztBQ2pCQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWSwyR0FBb0U7QUFDaEYsU0FBUywyQ0FBMkM7QUFDcEQsYUFBYSxrSEFBMkU7QUFDeEYsVUFBVSx5QkFBeUI7QUFDbkMsZUFBZSx5QkFBeUI7QUFDeEMsVUFBVSx5QkFBeUI7QUFDbkMsTUFBTSx5QkFBeUI7QUFDL0IsTUFBTSx5QkFBeUI7QUFDL0IsY0FBYyw4QkFBOEI7QUFDNUMsZ0JBQWdCLHlCQUF5QjtBQUN6QztBQUNBLENBQUM7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqQkE7O0FBRUE7QUFDQTtBQUNBLFNBQVMsMkNBQTJDO0FBQ3BELFdBQVcseUJBQXlCO0FBQ3BDLGVBQWUseUJBQXlCO0FBQ3hDLGdCQUFnQix5QkFBeUI7QUFDekMsa0JBQWtCLHlCQUF5QjtBQUMzQyxrQkFBa0IseUJBQXlCO0FBQzNDLG9CQUFvQix5QkFBeUI7QUFDN0Msb0JBQW9CLHlCQUF5QjtBQUM3QyxjQUFjLHlCQUF5QjtBQUN2QyxtQkFBbUIseUJBQXlCO0FBQzVDLG1CQUFtQjtBQUNuQixDQUFDOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDakJBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esd0hBQTRFLDBCQUEwQjs7QUFFdEc7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esd0RBQVksVUFBVTs7QUFFdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSx3REFBWSxVQUFVO0FBQ3RCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EseURBQWEsVUFBVSxvQkFBb0IsU0FBUztBQUNwRCw0QkFBNEIsbUJBQW1CO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDLFNBQVM7QUFDdEQsa0NBQWtDO0FBQ2xDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDO0FBQ2xDO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx3REFBWSxVQUFVLEtBQUssU0FBUztBQUNwQztBQUNBO0FBQ0EsMkJBQTJCLGtDQUFrQztBQUM3RDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx5REFBYSxVQUFVLEtBQUssU0FBUztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseURBQWEsVUFBVSxLQUFLLEtBQUsseUNBQXlDLFNBQVM7QUFDbkY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseURBQWEsVUFBVSxLQUFLLFVBQVU7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHNEQUFzRDtBQUN0RCxxRkFBeUMsZ0JBQWdCLHdCQUF3QixpQkFBaUIsY0FBYyxVQUFVO0FBQzFIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrRkFBa0Y7O0FBRWxGO0FBQ0E7QUFDQSxJQUFJOztBQUVKO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7OztBQ3ZQQTtBQUFBO0FBQ0E7QUFDQSxpQkFBaUIsVUFBVTtBQUMzQjtBQUNBLG1CQUFtQixhQUFhO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixZQUFZO0FBQzdCLGtCO0FBQ0EsbUJBQW1CLFVBQVU7QUFDN0I7QUFDQSxxQkFBcUIsYUFBYTtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGlCQUFpQixtQkFBbUI7QUFDcEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksbUJBQW1CLEdBQUcsTUFBTSxHQUFHLElBQUksR0FBRyxLQUFLLEdBQUcsT0FBTyxHQUFHLE9BQU87QUFDM0U7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3BKQSxtQzs7Ozs7Ozs7Ozs7QUNBQSxvQzs7Ozs7Ozs7Ozs7QUNBQSwrQjs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSxxQzs7Ozs7Ozs7Ozs7QUNBQSwwQzs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSxzQyIsImZpbGUiOiJzZXJ2ZXIuYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zZXJ2ZXIvc3JjL21haW4uanNcIik7XG4iLCJpbXBvcnQgZ2FtZSBmcm9tICcuLi9nYW1lLmpzJztcclxuaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9jb25maWcuanMnO1xyXG5pbXBvcnQgdXRpbCBmcm9tICcuLi91dGlsLmpzJztcclxuaW1wb3J0IEVudGl0eSBmcm9tICcuL2VudGl0eS5qcyc7XHJcblxyXG4vLyBBbiBBY3RvciBpcyBhbiBFbnRpdHkgd2hpY2ggY2FuIG1vdmUsIGF0dGFjayBhbmQgaW50ZXJhY3Qgd2l0aCBpdGVtc1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWN0b3IgZXh0ZW5kcyBFbnRpdHkge1xyXG5cdGNvbnN0cnVjdG9yKG1hcElkLCB4LCB5LCBkaXJlY3Rpb24sIG5hbWUsIHNwcml0ZSkge1xyXG5cdFx0c3ByaXRlID0gdXRpbC5jbGFtcChzcHJpdGUsIDEsIGNvbmZpZy5NQVhfU1BSSVRFUyk7XHJcblxyXG5cdFx0c3VwZXIobWFwSWQsIHgsIHksIHNwcml0ZSk7XHJcblx0XHR0aGlzLm5hbWUgPSBuYW1lO1xyXG5cdFx0dGhpcy5kZXNjcmlwdGlvbiA9IFwiXCI7XHJcblxyXG5cdFx0dGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XHJcblx0XHR0aGlzLnN0YXJ0WCA9IHRoaXMueDtcclxuXHRcdHRoaXMuc3RhcnRZID0gdGhpcy55O1xyXG5cdFx0dGhpcy5kZXN0aW5hdGlvblggPSB0aGlzLng7XHJcblx0XHR0aGlzLmRlc3RpbmF0aW9uWSA9IHRoaXMueTtcclxuXHRcdHRoaXMubGVycCA9IDA7XHJcblxyXG5cdFx0dGhpcy5pc01vdmluZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy5pc1J1bm5pbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMubW92ZVNwZWVkID0gMi41O1xyXG5cdFx0dGhpcy5tb3ZlbWVudFRpbWVyID0gMDtcclxuXHRcdHRoaXMubGF6aW5lc3MgPSAwO1xyXG5cclxuXHRcdHRoaXMuaXNBdHRhY2tpbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMuYXR0YWNrU3BlZWQgPSAxO1xyXG5cdFx0dGhpcy5hdHRhY2tUaW1lciA9IDA7XHRcclxuXHRcdHRoaXMudGFyZ2V0ID0gbnVsbDtcclxuXHRcdHRoaXMua2lsbHMgPSAwO1xyXG5cclxuXHRcdHRoaXMuaGVhbHRoID0gdGhpcy5oZWFsdGhNYXg7XHJcblx0XHR0aGlzLmVuZXJneSA9IHRoaXMuZW5lcmd5TWF4O1xyXG5cdFx0dGhpcy5yZWdlblRpbWVyID0gMDtcclxuXHRcdHRoaXMuaXNIaXQgPSBmYWxzZTtcclxuXHR9XHJcblx0XHJcblx0Ly8gQ2hhcmFjdGVyIFN0YXRzXHJcblx0Z2V0IGRhbWFnZSgpIHtcclxuXHRcdGxldCBkYW1hZ2VUb3RhbCA9IHRoaXMuZGFtYWdlQmFzZSArIHRoaXMuZGFtYWdlQm9udXM7XHJcblx0XHRyZXR1cm4gKGRhbWFnZVRvdGFsIDwgMCkgPyAwIDogZGFtYWdlVG90YWw7XHJcblx0fVxyXG5cdGdldCBkZWZlbmNlKCkge1xyXG5cdFx0bGV0IGRlZmVuY2VUb3RhbCA9IHRoaXMuZGVmZW5jZUJhc2UgKyB0aGlzLmRlZmVuY2VCb251cztcclxuXHRcdHJldHVybiAoZGVmZW5jZVRvdGFsIDwgMCkgPyAwIDogZGVmZW5jZVRvdGFsO1xyXG5cdH1cclxuXHRnZXQgaGVhbHRoTWF4KCkge1xyXG5cdFx0bGV0IGhlYWx0aE1heFRvdGFsID0gdGhpcy5oZWFsdGhNYXhCYXNlICsgdGhpcy5oZWFsdGhNYXhCb251c1xyXG5cdFx0cmV0dXJuIChoZWFsdGhNYXhUb3RhbCA8IDEpID8gMSA6IGhlYWx0aE1heFRvdGFsO1xyXG5cdH1cclxuXHRnZXQgZW5lcmd5TWF4KCkge1xyXG5cdFx0bGV0IGVuZXJneU1heFRvdGFsID0gdGhpcy5lbmVyZ3lNYXhCYXNlICsgdGhpcy5lbmVyZ3lNYXhCb251cztcclxuXHRcdHJldHVybiAoZW5lcmd5TWF4VG90YWwgPCAwKSA/IDAgOiBlbmVyZ3lNYXhUb3RhbDtcclxuXHR9XHJcblx0Z2V0IGhlYWx0aFJlZ2VuKCkge1xyXG5cdFx0bGV0IGhlYWx0aFJlZ2VuVG90YWwgPSB0aGlzLmhlYWx0aFJlZ2VuQmFzZSArIHRoaXMuaGVhbHRoUmVnZW5Cb251c1xyXG5cdFx0cmV0dXJuIChoZWFsdGhSZWdlblRvdGFsIDwgMSkgPyAxIDogaGVhbHRoUmVnZW5Ub3RhbDtcclxuXHR9XHJcblx0Z2V0IGVuZXJneVJlZ2VuKCkge1xyXG5cdFx0bGV0IGVuZXJneVJlZ2VuVG90YWwgPSB0aGlzLmVuZXJneVJlZ2VuQmFzZSArIHRoaXMuZW5lcmd5UmVnZW5Cb251cztcclxuXHRcdHJldHVybiAoZW5lcmd5UmVnZW5Ub3RhbCA8IDApID8gMCA6IGVuZXJneVJlZ2VuVG90YWw7XHJcblx0fVxyXG5cdGdldCByYW5nZSgpIHtcclxuXHRcdGxldCByYW5nZVRvdGFsID0gdGhpcy5yYW5nZUJhc2UgKyB0aGlzLnJhbmdlQm9udXM7XHJcblx0XHRyZXR1cm4gKHJhbmdlVG90YWwgPCAxKSA/IDEgOiByYW5nZVRvdGFsO1xyXG5cdH1cclxuXHJcblx0Y2FsY0Jhc2VTdGF0cyh0ZW1wbGF0ZSkge1xyXG5cdFx0dGhpcy5kYW1hZ2VCYXNlID0gdGVtcGxhdGUuZGFtYWdlQmFzZSB8fCAxO1xyXG5cdFx0dGhpcy5kZWZlbmNlQmFzZSA9IHRlbXBsYXRlLmRlZmVuY2VCYXNlIHx8IDA7XHJcblx0XHR0aGlzLmhlYWx0aE1heEJhc2UgPSB0ZW1wbGF0ZS5oZWFsdGhNYXhCYXNlICsgKHRlbXBsYXRlLmhlYWx0aFBlckxldmVsICogKHRoaXMubGV2ZWwgLSAxKSkgfHwgMTtcclxuXHRcdHRoaXMuZW5lcmd5TWF4QmFzZSA9IHRlbXBsYXRlLmVuZXJneU1heEJhc2UgKyAodGVtcGxhdGUuZW5lcmd5UGVyTGV2ZWwgKiAodGhpcy5sZXZlbCAtIDEpKSB8fCAxO1xyXG5cdFx0dGhpcy5oZWFsdGhSZWdlbkJhc2UgPSB0ZW1wbGF0ZS5oZWFsdGhSZWdlbkJhc2UgfHwgMTtcclxuXHRcdHRoaXMuZW5lcmd5UmVnZW5CYXNlID0gdGVtcGxhdGUuZW5lcmd5UmVnZW5CYXNlIHx8IDE7XHJcblx0XHR0aGlzLnJhbmdlQmFzZSA9IHRlbXBsYXRlLnJhbmdlQmFzZSB8fCAxO1xyXG5cdH1cclxuXHJcblx0Y2FsY0l0ZW1Cb251cygpIHtcclxuXHRcdGNvbnN0IGl0ZW1Cb251cyA9IHtcclxuXHRcdFx0ZGFtYWdlOiAwLFxyXG5cdFx0XHRkZWZlbmNlOiAwLFxyXG5cdFx0XHRoZWFsdGhNYXg6IDAsXHJcblx0XHRcdGVuZXJneU1heDogMCxcclxuXHRcdFx0aGVhbHRoUmVnZW46IDAsXHJcblx0XHRcdGVuZXJneVJlZ2VuOiAwLFxyXG5cdFx0XHRyYW5nZTogMFxyXG5cdFx0fTtcclxuXHJcblx0XHRjb25zdCBpbnZlbnRvcnkgPSB0aGlzLmdldEludmVudG9yeSgpO1xyXG5cclxuXHRcdC8vIEZvciBlYWNoIGl0ZW0gaW4gaW52ZW50b3J5IGNoZWNrIGZvciBib251c2VzXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGludmVudG9yeS5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRjb25zdCBpdGVtID0gaW52ZW50b3J5W2ldO1xyXG5cdFx0XHRpdGVtQm9udXMuZGFtYWdlICs9IGl0ZW0ucGFzc2l2ZS5kYW1hZ2U7XHJcblx0XHRcdGl0ZW1Cb251cy5kZWZlbmNlICs9IGl0ZW0ucGFzc2l2ZS5kZWZlbmNlO1xyXG5cdFx0XHRpdGVtQm9udXMuaGVhbHRoTWF4ICs9IGl0ZW0ucGFzc2l2ZS5oZWFsdGhNYXg7XHJcblx0XHRcdGl0ZW1Cb251cy5lbmVyZ3lNYXggKz0gaXRlbS5wYXNzaXZlLmVuZXJneU1heDtcclxuXHRcdFx0aXRlbUJvbnVzLmhlYWx0aFJlZ2VuICs9IGl0ZW0ucGFzc2l2ZS5oZWFsdGhSZWdlbjtcclxuXHRcdFx0aXRlbUJvbnVzLmVuZXJneVJlZ2VuICs9IGl0ZW0ucGFzc2l2ZS5lbmVyZ3lSZWdlbjtcclxuXHRcdFx0aXRlbUJvbnVzLnJhbmdlICs9IGl0ZW0ucGFzc2l2ZS5yYW5nZTtcclxuXHJcblx0XHRcdGlmIChpdGVtLnNsb3QgPj0gY29uZmlnLklOVkVOVE9SWV9TSVpFKSB7XHJcblx0XHRcdFx0aXRlbUJvbnVzLmRhbWFnZSArPSBpdGVtLmVxdWlwcGVkLmRhbWFnZTtcclxuXHRcdFx0XHRpdGVtQm9udXMuZGVmZW5jZSArPSBpdGVtLmVxdWlwcGVkLmRlZmVuY2U7XHJcblx0XHRcdFx0aXRlbUJvbnVzLmhlYWx0aE1heCArPSBpdGVtLmVxdWlwcGVkLmhlYWx0aE1heDtcclxuXHRcdFx0XHRpdGVtQm9udXMuZW5lcmd5TWF4ICs9IGl0ZW0uZXF1aXBwZWQuZW5lcmd5TWF4O1xyXG5cdFx0XHRcdGl0ZW1Cb251cy5oZWFsdGhSZWdlbiArPSBpdGVtLmVxdWlwcGVkLmhlYWx0aFJlZ2VuO1xyXG5cdFx0XHRcdGl0ZW1Cb251cy5lbmVyZ3lSZWdlbiArPSBpdGVtLmVxdWlwcGVkLmVuZXJneVJlZ2VuO1xyXG5cdFx0XHRcdGl0ZW1Cb251cy5yYW5nZSArPSBpdGVtLmVxdWlwcGVkLnJhbmdlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiBpdGVtQm9udXM7XHJcblx0fVxyXG5cclxuXHRjYWxjRWZmZWN0Qm9udXMoKSB7XHJcblx0XHRjb25zdCBlZmZlY3RCb251cyA9IHtcclxuXHRcdFx0ZGFtYWdlOiAwLFxyXG5cdFx0XHRkZWZlbmNlOiAwLFxyXG5cdFx0XHRoZWFsdGhNYXg6IDAsXHJcblx0XHRcdGVuZXJneU1heDogMCxcclxuXHRcdFx0aGVhbHRoUmVnZW46IDAsXHJcblx0XHRcdGVuZXJneVJlZ2VuOiAwLFxyXG5cdFx0XHRyYW5nZTogMFxyXG5cdFx0fTtcclxuXHJcblx0XHQvLyBUT0RPOiB3b3JrIG91dCBob3cgdG8gZG8gZWZmZWN0cyBmb3Igc3BlbGxzIGFuZCBwb3Rpb25zXHJcblx0XHRyZXR1cm4gZWZmZWN0Qm9udXM7XHJcblx0fVxyXG5cdFxyXG5cdGNhbGNCb251c1N0YXRzKCkge1x0Ly8gSXRlbXMgKGVxdWlwcGVkIGFuZCBwYXNzaXZlKSBhbmQgRWZmZWN0cyAoc3BlbGxzIGFuZCBwb3Rpb25zKVxyXG5cdFx0Y29uc3QgaXRlbUJvbnVzID0gdGhpcy5jYWxjSXRlbUJvbnVzKCk7XHJcblx0XHRjb25zdCBlZmZlY3RCb251cyA9IHRoaXMuY2FsY0VmZmVjdEJvbnVzKCk7XHJcblxyXG5cdFx0dGhpcy5kYW1hZ2VCb251cyA9IGl0ZW1Cb251cy5kYW1hZ2UgKyBlZmZlY3RCb251cy5kYW1hZ2U7XHJcblx0XHR0aGlzLmRlZmVuY2VCb251cyA9IGl0ZW1Cb251cy5kZWZlbmNlICsgZWZmZWN0Qm9udXMuZGVmZW5jZTtcclxuXHRcdHRoaXMuaGVhbHRoTWF4Qm9udXMgPSBpdGVtQm9udXMuaGVhbHRoTWF4ICsgZWZmZWN0Qm9udXMuaGVhbHRoTWF4O1xyXG5cdFx0dGhpcy5lbmVyZ3lNYXhCb251cyA9IGl0ZW1Cb251cy5lbmVyZ3lNYXggKyBlZmZlY3RCb251cy5lbmVyZ3lNYXg7XHJcblx0XHR0aGlzLmhlYWx0aFJlZ2VuQm9udXMgPSBpdGVtQm9udXMuaGVhbHRoUmVnZW4gKyBlZmZlY3RCb251cy5oZWFsdGhSZWdlbjtcclxuXHRcdHRoaXMuZW5lcmd5UmVnZW5Cb251cyA9IGl0ZW1Cb251cy5lbmVyZ3lSZWdlbiArIGVmZmVjdEJvbnVzLmVuZXJneVJlZ2VuO1xyXG5cdFx0dGhpcy5yYW5nZUJvbnVzID0gaXRlbUJvbnVzLnJhbmdlICsgZWZmZWN0Qm9udXMucmFuZ2U7XHJcblx0fVxyXG5cclxuXHRjYWxjU3RhdHMoKSB7XHJcblx0XHR0aGlzLmNhbGNCYXNlU3RhdHMoKTtcclxuXHRcdHRoaXMuY2FsY0JvbnVzU3RhdHMoKTtcclxuXHR9XHJcblxyXG5cdHJlc3RvcmUoKSB7XHJcblx0XHR0aGlzLmhlYWx0aCA9IHRoaXMuaGVhbHRoTWF4O1xyXG5cdFx0dGhpcy5lbmVyZ3kgPSB0aGlzLmVuZXJneU1heDtcclxuXHR9XHJcblx0XHJcblx0aW5wdXREYXRhKCkge1xyXG5cdFx0Ly8gU2VlIFBsYXllciBhbmQgQm90IGNsYXNzZXNcclxuXHR9XHJcblxyXG5cdC8vIE1vdmVtZW50XHJcblx0bW92ZShkaXJlY3Rpb24pIHtcclxuXHRcdGlmICh0aGlzLmlzTW92aW5nKSByZXR1cm47XHJcblxyXG5cdFx0aWYgKGRpcmVjdGlvbikgdGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XHJcblxyXG5cdFx0aWYgKGRpcmVjdGlvbiA9PT0gJ2xlZnQnKSB7XHJcblx0XHRcdGlmICghZ2FtZS5pc1ZhY2FudCh0aGlzLm1hcElkLCB0aGlzLnggLSAxLCB0aGlzLnkpKSByZXR1cm47XHJcblx0XHRcdHRoaXMuZGVzdGluYXRpb25YLS07XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdyaWdodCcpIHtcclxuXHRcdFx0aWYgKCFnYW1lLmlzVmFjYW50KHRoaXMubWFwSWQsIHRoaXMueCArIDEsIHRoaXMueSkpIHJldHVybjtcclxuXHRcdFx0dGhpcy5kZXN0aW5hdGlvblgrKztcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ3VwJykge1xyXG5cdFx0XHRpZiAoIWdhbWUuaXNWYWNhbnQodGhpcy5tYXBJZCwgdGhpcy54LCB0aGlzLnkgLSAxKSkgcmV0dXJuO1xyXG5cdFx0XHR0aGlzLmRlc3RpbmF0aW9uWS0tO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoZGlyZWN0aW9uID09PSAnZG93bicpIHtcclxuXHRcdFx0aWYgKCFnYW1lLmlzVmFjYW50KHRoaXMubWFwSWQsIHRoaXMueCwgdGhpcy55ICsgMSkpIHJldHVybjtcclxuXHRcdFx0dGhpcy5kZXN0aW5hdGlvblkrKztcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRzd2l0Y2ggKHV0aWwucmFuZG9tSW50KDAsIDMgKyB0aGlzLmxhemluZXNzKSkge1xyXG5cdFx0XHRcdGNhc2UgMDogdGhpcy5tb3ZlKCdsZWZ0Jyk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAxOiB0aGlzLm1vdmUoJ3JpZ2h0Jyk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAyOiB0aGlzLm1vdmUoJ3VwJyk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAzOiB0aGlzLm1vdmUoJ2Rvd24nKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRkZWZhdWx0OiAvLyBEb24ndCBNb3ZlXHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFNldCBtb3ZlIHNwZWVkXHJcblx0XHRpZiAodGhpcy5pc1J1bm5pbmcpIHtcclxuXHRcdFx0aWYgKHRoaXMuZW5lcmd5ID4gMCkge1xyXG5cdFx0XHRcdHRoaXMuZW5lcmd5LS07XHJcblx0XHRcdFx0dGhpcy5tb3ZlU3BlZWQgPSA0O1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMuZW5lcmd5ID0gMDtcclxuXHRcdFx0XHR0aGlzLm1vdmVTcGVlZCA9IDIuNTtcclxuXHRcdFx0XHR0aGlzLmlzUnVubmluZyA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0dGhpcy5tb3ZlU3BlZWQgPSAyLjU7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHRoaXMuaXNNb3ZpbmcgPSB0cnVlO1xyXG5cdH1cclxuXHRcclxuXHRtb3ZlVG9UYXJnZXQodGFyZ2V0LCBob3N0aWxlKSB7XHJcblx0XHRpZiAoIXRhcmdldCkgcmV0dXJuO1xyXG5cdFx0XHJcblx0XHRpZiAodGFyZ2V0LnggPT09IHRoaXMueCAmJiB0YXJnZXQueSA9PT0gdGhpcy55KSB7XHJcblx0XHRcdHRoaXMubW92ZSgpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAodXRpbC5yYW5kb21JbnQoMCwgMSkgPT09IDApIHtcclxuXHRcdFx0aWYgKHRhcmdldC54IDwgdGhpcy54KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID49ICh0aGlzLnggLSB0aGlzLnJhbmdlKSAmJiB0YXJnZXQueSA9PT0gdGhpcy55KSB7XHJcblx0XHRcdFx0XHRpZiAoaG9zdGlsZSAmJiAhdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdsZWZ0JztcclxuXHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ2xlZnQnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ2xlZnQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodGFyZ2V0LnggPiB0aGlzLngpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LnggPT09IHRoaXMueCArIHRoaXMucmFuZ2UgJiYgdGFyZ2V0LnkgPT09IHRoaXMueSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUgJiYgIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAncmlnaHQnO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmF0dGFjaygncmlnaHQnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ3JpZ2h0Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHRhcmdldC55IDwgdGhpcy55KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggJiYgdGFyZ2V0LnkgPT09IHRoaXMueSAtIHRoaXMucmFuZ2UpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlICYmICF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ3VwJztcclxuXHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ3VwJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCd1cCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICh0YXJnZXQueSA+IHRoaXMueSkge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICYmIHRhcmdldC55ID09PSB0aGlzLnkgKyB0aGlzLnJhbmdlKSB7XHJcblx0XHRcdFx0XHRpZiAoaG9zdGlsZSAmJiAhdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdkb3duJztcclxuXHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ2Rvd24nKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ2Rvd24nKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRpZiAodGFyZ2V0LnkgPiB0aGlzLnkpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LnggPT09IHRoaXMueCAmJiB0YXJnZXQueSA9PT0gdGhpcy55ICsgdGhpcy5yYW5nZSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUgJiYgIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnZG93bic7XHJcblx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCdkb3duJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCdkb3duJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHRhcmdldC55IDwgdGhpcy55KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggJiYgdGFyZ2V0LnkgPT09IHRoaXMueSAtIHRoaXMucmFuZ2UpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlICYmICF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ3VwJztcclxuXHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ3VwJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCd1cCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICh0YXJnZXQueCA+IHRoaXMueCkge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICsgdGhpcy5yYW5nZSAmJiB0YXJnZXQueSA9PT0gdGhpcy55KSB7XHJcblx0XHRcdFx0XHRpZiAoaG9zdGlsZSAmJiAhdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdyaWdodCc7XHJcblx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCdyaWdodCcpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSgncmlnaHQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodGFyZ2V0LnggPCB0aGlzLngpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LnggPj0gKHRoaXMueCAtIHRoaXMucmFuZ2UpICYmIHRhcmdldC55ID09PSB0aGlzLnkpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlICYmICF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ2xlZnQnO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmF0dGFjaygnbGVmdCcpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSgnbGVmdCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHQvLyBDb21iYXRcclxuXHRjaGVja0luUmFuZ2UoZGlyZWN0aW9uLCB0YXJnZXQsIHJhbmdlKSB7XHJcblx0XHRpZiAodGFyZ2V0Lm1hcElkICE9PSB0aGlzLm1hcElkKSByZXR1cm4gZmFsc2U7XHJcblx0XHRpZiAodGFyZ2V0LnggPT09IHRoaXMueCAmJiB0YXJnZXQueSA9PT0gdGhpcy55KSByZXR1cm4gZmFsc2U7XHQvLyBTdGFja2VkIGRvZXMgbm90IGNvdW50IGFzIGluIHJhbmdlXHJcblx0XHRcclxuXHRcdGlmICh0YXJnZXQueSA9PT0gdGhpcy55KSB7XHJcblx0XHRcdGlmIChkaXJlY3Rpb24gPT09ICdsZWZ0Jykge1xyXG5cdFx0XHRcdGlmICh0aGlzLnggPT09IDApIHtcclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gKHRhcmdldC54IDwgdGhpcy54ICYmIHRhcmdldC54ID49ICh0aGlzLnggLSByYW5nZSkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdyaWdodCcpIHtcclxuXHRcdFx0XHRpZiAodGhpcy54ID09PSBjb25maWcuTUFQX0NPTFVNTlMgLSAxKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0cmV0dXJuICh0YXJnZXQueCA+IHRoaXMueCAmJiB0YXJnZXQueCA8PSAodGhpcy54ICsgcmFuZ2UpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKHRhcmdldC54ID09PSB0aGlzLngpIHtcclxuXHRcdFx0aWYgKGRpcmVjdGlvbiA9PT0gJ3VwJykge1xyXG5cdFx0XHRcdGlmICh0aGlzLnkgPT09IDApIHtcclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gKHRhcmdldC55IDwgdGhpcy55ICYmIHRhcmdldC55ID49ICh0aGlzLnkgLSByYW5nZSkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdkb3duJykge1xyXG5cdFx0XHRcdGlmICh0aGlzLnkgPT09IGNvbmZpZy5NQVBfUk9XUyAtIDEpIHtcclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gKHRhcmdldC55ID4gdGhpcy55ICYmIHRhcmdldC55IDw9ICh0aGlzLnkgKyByYW5nZSkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG5cclxuXHRhdHRhY2sobnVtVGFyZ2V0cyA9IDEsIGRpcmVjdGlvbiA9IHRoaXMuZGlyZWN0aW9uKSB7XHJcblx0XHRpZiAodGhpcy5pc0F0dGFja2luZyB8fCB0aGlzLmF0dGFja1RpbWVyID4gMCkgcmV0dXJuO1xyXG5cclxuXHRcdHRoaXMuaXNBdHRhY2tpbmcgPSB0cnVlO1xyXG5cdFx0XHJcblx0XHRjb25zdCBwbGF5ZXJMaXN0ID0gZ2FtZS5wbGF5ZXJzLmZpbHRlcihwbGF5ZXIgPT4gcGxheWVyLm1hcElkID09PSB0aGlzLm1hcElkKTtcclxuXHRcdGNvbnN0IGJvdExpc3QgPSBnYW1lLmJvdHMuZmlsdGVyKGJvdCA9PiBib3QubWFwSWQgPT09IHRoaXMubWFwSWQpO1xyXG5cdFx0Y29uc3QgYWN0b3JMaXN0ID0gcGxheWVyTGlzdC5jb25jYXQoYm90TGlzdCk7XHJcblx0XHRsZXQgdGFyZ2V0TGlzdCA9IGFjdG9yTGlzdC5maWx0ZXIoYWN0b3IgPT4ge1xyXG5cdFx0XHRyZXR1cm4gYWN0b3IgIT09IHRoaXMgJiYgIWFjdG9yLmlzRGVhZCAmJiB0aGlzLmNoZWNrSW5SYW5nZShkaXJlY3Rpb24sIGFjdG9yLCB0aGlzLnJhbmdlKTtcclxuXHRcdH0pO1xyXG5cdFx0XHJcblx0XHR0YXJnZXRMaXN0LnNvcnQoKGEsIGIpID0+IHtcclxuXHRcdFx0cmV0dXJuIChhLnogLSBiLnopO1x0Ly8gTG93ZXN0IHRvIGhpZ2hlc3RcclxuXHRcdH0pO1xyXG5cdFx0XHJcblx0XHR0YXJnZXRMaXN0ID0gdGFyZ2V0TGlzdC5zcGxpY2UoLW51bVRhcmdldHMpO1xyXG5cdFx0XHJcblx0XHR0YXJnZXRMaXN0LmZvckVhY2goKHRhcmdldCkgPT4ge1xyXG5cdFx0XHR0YXJnZXQudGFrZURhbWFnZSh0aGlzLmRhbWFnZSwgdGhpcyk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0XHJcblx0dGFrZURhbWFnZShkYW1hZ2UsIGF0dGFja2VyKSB7XHJcblx0XHRkYW1hZ2UgLT0gdGhpcy5kZWZlbmNlO1xyXG5cdFx0aWYgKGRhbWFnZSA8IDApIGRhbWFnZSA9IDA7XHJcblx0XHRnYW1lLnNwYXduRGFtYWdlVGV4dCh0aGlzLm1hcElkLCB0aGlzLngsIHRoaXMueSwgZGFtYWdlKTtcclxuXHRcdGlmIChkYW1hZ2UgPT09IDApIHJldHVybjtcclxuXHRcdFxyXG5cdFx0dGhpcy5pc0hpdCA9IHRydWU7XHJcblx0XHR0aGlzLmhlYWx0aCAtPSBkYW1hZ2U7XHJcblxyXG5cdFx0aWYgKHRoaXMuaGVhbHRoIDw9IDApIHtcclxuXHRcdFx0dGhpcy5zZXREZWFkKCk7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoIWF0dGFja2VyKSB7XHJcblx0XHRcdFx0Z2FtZS5zZW5kR2FtZUluZm9HbG9iYWwodGhpcy5uYW1lICsgXCIgaGFzIGRpZWQhXCIpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0YXR0YWNrZXIua2lsbHMrKztcclxuXHRcdFx0aWYgKGF0dGFja2VyLnRhcmdldCA9PT0gdGhpcykgYXR0YWNrZXIudGFyZ2V0ID0gbnVsbDtcclxuXHRcdFx0aWYgKHRoaXMucGxheWVySWQpIHtcclxuXHRcdFx0XHRpZiAoYXR0YWNrZXIucGxheWVySWQpIGdhbWUuc2VuZEdhbWVJbmZvR2xvYmFsKGF0dGFja2VyLm5hbWUgKyBcIiBoYXMgbXVyZGVyZWQgXCIgKyB0aGlzLm5hbWUgKyBcIiBpbiBjb2xkIGJsb29kIVwiKTtcclxuXHRcdFx0XHRlbHNlIGdhbWUuc2VuZEdhbWVJbmZvR2xvYmFsKHRoaXMubmFtZSArIFwiIGhhcyBiZWVuIGtpbGxlZCBieSBcIiArIGF0dGFja2VyLm5hbWUgKyBcIiFcIik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHRcclxuXHJcblx0c2V0RGVhZCgpIHtcclxuXHRcdGNvbnN0IG1hcCA9IGdhbWUubWFwc1t0aGlzLm1hcElkXTtcclxuXHRcdGNvbnN0IGludmVudG9yeSA9IHRoaXMuZ2V0SW52ZW50b3J5KCk7XHJcblxyXG5cdFx0Ly8gSW52ZW50b3J5IEl0ZW0gRHJvcCBDaGFuY2VcclxuXHRcdGNvbnN0IGRyb3BDaGFuY2UgPSB1dGlsLmNsYW1wKG1hcC5kcm9wQ2hhbmNlLCAwLCAxMDApO1xyXG5cdFx0aWYgKGRyb3BDaGFuY2UgPiAwKSB7XHJcblx0XHRcdGNvbnN0IGl0ZW1zID0gaW52ZW50b3J5LmZpbHRlcihpdGVtID0+IHtcclxuXHRcdFx0XHRyZXR1cm4gaXRlbS5zbG90IDwgY29uZmlnLklOVkVOVE9SWV9TSVpFO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdGl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XHJcblx0XHRcdFx0aWYgKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMSkgPD0gZHJvcENoYW5jZSkge1xyXG5cdFx0XHRcdFx0aXRlbS5tb3ZlVG9NYXAodGhpcy5tYXBJZCwgdGhpcy54LCB0aGlzLnkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdHRoaXMuY2FsY0JvbnVzU3RhdHMoKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBFcXVpcHBlZCBJdGVtIERyb3AgQW1vdW50XHJcblx0XHRjb25zdCBkcm9wQW1vdW50RVEgPSB1dGlsLmNsYW1wKG1hcC5kcm9wQW1vdW50RVEsIDAsIGNvbmZpZy5FUVVJUE1FTlRfU0laRSk7XHJcblx0XHRpZiAoZHJvcEFtb3VudEVRID4gMCkge1xyXG5cdFx0XHRsZXQgZXF1aXBtZW50ID0gaW52ZW50b3J5LmZpbHRlcihpdGVtID0+IHtcclxuXHRcdFx0XHRyZXR1cm4gaXRlbS5zbG90ID49IGNvbmZpZy5JTlZFTlRPUllfU0laRTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRlcXVpcG1lbnQgPSB1dGlsLnNodWZmbGUoZXF1aXBtZW50KTtcclxuXHRcdFx0ZXF1aXBtZW50LnNwbGljZSgtZHJvcEFtb3VudEVRKTtcclxuXHRcdFx0ZXF1aXBtZW50LmZvckVhY2goaXRlbSA9PiB7XHJcblx0XHRcdFx0aXRlbS5tb3ZlVG9NYXAodGhpcy5tYXBJZCwgdGhpcy54LCB0aGlzLnkpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0dGhpcy5jYWxjQm9udXNTdGF0cygpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHQvLyBJbnZlbnRvcnlcclxuXHRwaWNrVXAoKSB7XHJcblx0XHRjb25zdCBtYXBJdGVtcyA9IGdhbWUuaXRlbXMuZmlsdGVyKGl0ZW0gPT4ge1xyXG5cdFx0XHRyZXR1cm4gaXRlbS5tYXBJZCA9PT0gdGhpcy5tYXBJZCAmJiBpdGVtLnggPT09IHRoaXMueCAmJiBpdGVtLnkgPT09IHRoaXMueTtcclxuXHRcdH0pO1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBtYXBJdGVtcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRjb25zdCBpdGVtID0gbWFwSXRlbXNbaV07XHJcblx0XHRcdGlmICghaXRlbSkgY29udGludWU7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoaXRlbS5zdGFja2FibGUpIHtcclxuXHRcdFx0XHRjb25zdCBpbnZlbnRvcnkgPSB0aGlzLmdldEludmVudG9yeSgpO1xyXG5cdFx0XHRcdGlmIChpbnZlbnRvcnkubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0Y29uc3Qgc2FtZUl0ZW1zID0gaW52ZW50b3J5LmZpbHRlcihpbnZlbnRvcnlJdGVtID0+IHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGludmVudG9yeUl0ZW0udGVtcGxhdGVJZCA9PT0gaXRlbS50ZW1wbGF0ZUlkO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRpZiAoc2FtZUl0ZW1zLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0c2FtZUl0ZW1zWzBdLnN0YWNrICs9IGl0ZW0uc3RhY2s7XHJcblx0XHRcdFx0XHRcdGl0ZW0ucmVtb3ZlKCk7XHJcblx0XHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29uc3Qgc2xvdCA9IHRoaXMuZmluZEZpcnN0RW1wdHlTbG90KCk7XHJcblx0XHRcdGlmIChzbG90ID09IG51bGwpIHJldHVybiBmYWxzZTtcclxuXHJcblx0XHRcdGl0ZW0ubW92ZVRvSW52ZW50b3J5KHRoaXMucGxheWVySWQsIHRoaXMuYm90SWQsIHNsb3QpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Z2V0SW52ZW50b3J5KCkge1xyXG5cdFx0Ly8gU2VlIFBsYXllciBhbmQgQm90IGNsYXNzZXNcclxuXHR9XHJcblxyXG5cdGdldEl0ZW0oc2xvdCkge1xyXG5cdFx0Y29uc3QgaW52ZW50b3J5ID0gdGhpcy5nZXRJbnZlbnRvcnkoKTtcclxuXHRcdGNvbnN0IGl0ZW1zID0gaW52ZW50b3J5LmZpbHRlcihpdGVtID0+IHtcclxuXHRcdFx0cmV0dXJuIGl0ZW0uc2xvdCA9PT0gc2xvdDtcclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIGl0ZW1zWzBdO1xyXG5cdH1cclxuXHJcblx0aGFzSXRlbSh0ZW1wbGF0ZUlkKSB7XHJcblx0XHRjb25zdCBpbnZlbnRvcnkgPSB0aGlzLmdldEludmVudG9yeSgpO1xyXG5cdFx0Y29uc3QgaXRlbXMgPSBnYW1lLml0ZW1zLmZpbHRlcihpdGVtID0+IHtcclxuXHRcdFx0cmV0dXJuIGl0ZW0udGVtcGxhdGVJZCA9PT0gdGVtcGxhdGVJZDtcclxuXHRcdH0pO1xyXG5cdFx0aWYgKGl0ZW1zWzBdLnN0YWNrYWJsZSkge1xyXG5cdFx0XHRyZXR1cm4gaXRlbXNbMF0uc3RhY2s7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0cmV0dXJuIGl0ZW1zLmxlbmd0aDtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZpbmRJdGVtU2xvdCh0ZW1wbGF0ZUlkKSB7XHJcblx0XHRjb25zdCBpbnZlbnRvcnkgPSB0aGlzLmdldEludmVudG9yeSgpO1xyXG5cdFx0Y29uc3QgaXRlbXMgPSBpbnZlbnRvcnkuZmlsdGVyKGl0ZW0gPT4ge1xyXG5cdFx0XHRyZXR1cm4gaXRlbS50ZW1wbGF0ZUlkID09PSB0ZW1wbGF0ZUlkO1xyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gaXRlbXNbMF0uc2xvdDtcclxuXHR9XHJcblxyXG5cdGZpbmRGaXJzdEVtcHR5U2xvdCgpIHtcclxuXHRcdGNvbnN0IGludmVudG9yeSA9IHRoaXMuZ2V0SW52ZW50b3J5KCk7XHJcblxyXG5cdFx0Zm9yIChsZXQgc2xvdCA9IDA7IHNsb3QgPCBjb25maWcuSU5WRU5UT1JZX1NJWkU7IHNsb3QrKykge1xyXG5cdFx0XHRsZXQgb2NjdXBpZWQgPSBmYWxzZTtcclxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBpbnZlbnRvcnkubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRpZiAoaW52ZW50b3J5W2ldLnNsb3QgPT09IHNsb3QpIHtcclxuXHRcdFx0XHRcdG9jY3VwaWVkID0gdHJ1ZTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoIW9jY3VwaWVkKSByZXR1cm4gc2xvdDtcclxuXHRcdH1cclxuXHRcdHJldHVybiBudWxsO1xyXG5cdH1cclxuXHJcblx0dXNlSXRlbShzbG90KSB7XHJcblx0XHRjb25zdCBpdGVtID0gdGhpcy5nZXRJdGVtKHNsb3QpO1xyXG5cdFx0aWYgKCFpdGVtKSByZXR1cm47XHJcblxyXG5cdFx0Ly8gVE9ETzogaWYgKCF1c2VTY3JpcHQoKSkgcmV0dXJuO1xyXG5cclxuXHRcdGlmIChpdGVtLmlzRXF1aXBtZW50KCkpIHtcclxuXHRcdFx0aWYgKGl0ZW0uc2xvdCA8IGNvbmZpZy5JTlZFTlRPUllfU0laRSkge1x0Ly8gQ2hlY2sgaWYgaXRlbSBpcyBlcXVpcHBlZFxyXG5cdFx0XHRcdHRoaXMuZXF1aXBJdGVtKGl0ZW0pO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHR0aGlzLnVuZXF1aXBJdGVtKGl0ZW0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCFpdGVtLnJldXNhYmxlKSBpdGVtLnJlbW92ZU9uZSgpO1xyXG5cdH1cclxuXHJcblx0ZHJvcEl0ZW0oc2xvdCkge1xyXG5cdFx0Y29uc3QgaXRlbSA9IHRoaXMuZ2V0SXRlbShzbG90KTtcclxuXHRcdGlmICghaXRlbSkgcmV0dXJuO1xyXG5cdFx0aXRlbS5tb3ZlVG9NYXAodGhpcy5tYXBJZCwgdGhpcy54LCB0aGlzLnkpO1xyXG5cdFx0dGhpcy5jYWxjQm9udXNTdGF0cygpO1xyXG5cdH1cclxuXHJcblx0bW92ZUl0ZW1Ub1Nsb3Qoc2xvdCwgbmV3U2xvdCkge1xyXG5cdFx0aWYgKHNsb3QgPT0gbnVsbCB8fCBuZXdTbG90ID09IG51bGwgfHwgc2xvdCA9PT0gbmV3U2xvdCkgcmV0dXJuO1x0Ly8gbnVsbCA9PSB1bmRlZmluZWQsIG51bGwgIT0gMFxyXG5cdFx0aWYgKHNsb3QgPCAwIHx8IHNsb3QgPj0gY29uZmlnLklOVkVOVE9SWV9TSVpFICsgY29uZmlnLkVRVUlQTUVOVF9TSVpFKSByZXR1cm47XHJcblx0XHRpZiAobmV3U2xvdCA8IDAgfHwgbmV3U2xvdCA+PSBjb25maWcuSU5WRU5UT1JZX1NJWkUgKyBjb25maWcuRVFVSVBNRU5UX1NJWkUpIHJldHVybjtcclxuXHJcblx0XHRjb25zdCBpdGVtID0gdGhpcy5nZXRJdGVtKHNsb3QpO1xyXG5cdFx0Y29uc3QgbmV3SXRlbSA9IHRoaXMuZ2V0SXRlbShuZXdTbG90KTtcclxuXHRcdGlmICghaXRlbSkgcmV0dXJuO1xyXG5cclxuXHRcdC8vIFRhcmdldCBzbG90IGlzIGZvciBlcXVpcG1lbnQgLSBjaGVjayB0eXBlIG1hdGNoZXNcclxuXHRcdGlmIChuZXdTbG90ID49IGNvbmZpZy5JTlZFTlRPUllfU0laRSkge1xyXG5cdFx0XHRpZiAoaXRlbS5lcXVpcHBlZFNsb3QgKyBjb25maWcuSU5WRU5UT1JZX1NJWkUgIT09IG5ld1Nsb3QpIHtcclxuXHRcdFx0XHRnYW1lLnNlbmRHYW1lSW5mb1BsYXllcih0aGlzLmlkLCBcIlRoYXQgY2Fubm90IGJlIGVxdWlwcGVkIHRoZXJlLlwiKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBzd2FwU2xvdHMgPSAoKSA9PiB7XHJcblx0XHRcdGl0ZW0uc2xvdCA9IG5ld1Nsb3Q7XHJcblx0XHRcdGlmIChuZXdJdGVtKSBuZXdJdGVtLnNsb3QgPSBzbG90O1xyXG5cdFx0XHR0aGlzLmNhbGNCb251c1N0YXRzKCk7XHJcblx0XHR9O1xyXG5cclxuXHRcdC8vIElGIE5vIG5ldyBpdGVtIGluIG5ldyBzbG90XHJcblx0XHQvLyBPUiBOZXcgaXRlbSBpbiBuZXcgc2xvdCwgb2xkIGl0ZW0gaW4gaW52ZW50b3J5XHJcblx0XHQvLyBPUiBOZXcgaXRlbSBpbiBuZXcgc2xvdCwgb2xkIGl0ZW0gaXMgZXF1aXBwZWQsIG5ldyBpdGVtIGNhbiBiZSBlcXVpcHBlZCBpbiBvbGQgc2xvdFxyXG5cdFx0aWYgKCFuZXdJdGVtIHx8IHNsb3QgPCBjb25maWcuSU5WRU5UT1JZX1NJWkUgfHwgbmV3SXRlbS5lcXVpcHBlZFNsb3QgKyBjb25maWcuSU5WRU5UT1JZX1NJWkUgPT09IHNsb3QpIHtcclxuXHRcdFx0c3dhcFNsb3RzKCk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Ly8gT2xkIGl0ZW0gaXMgZXF1aXBwZWQsIG5ldyBpdGVtIGNhbm5vdCBiZSBlcXVpcHBlZCBpbiBvbGQgc2xvdFxyXG5cdFx0XHRuZXdTbG90ID0gdGhpcy5maW5kRmlyc3RFbXB0eVNsb3QoKTtcclxuXHRcdFx0aWYgKG5ld1Nsb3QgIT0gbnVsbCkge1xyXG5cdFx0XHRcdHN3YXBTbG90cygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdGdhbWUuc2VuZEdhbWVJbmZvUGxheWVyKHRoaXMuaWQsIFwiWW91ciBpbnZlbnRvcnkgaXMgZnVsbC5cIik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGVxdWlwSXRlbShpdGVtKSB7XHJcblx0XHRjb25zdCBlcXVpcHBlZEl0ZW0gPSB0aGlzLmdldEl0ZW0oaXRlbS5lcXVpcHBlZFNsb3QgKyBjb25maWcuSU5WRU5UT1JZX1NJWkUpO1xyXG5cdFx0aXRlbS5zbG90ID0gaXRlbS5lcXVpcHBlZFNsb3QgKyBjb25maWcuSU5WRU5UT1JZX1NJWkU7XHJcblx0XHRpZiAoZXF1aXBwZWRJdGVtKSBlcXVpcHBlZEl0ZW0uc2xvdCA9IHRoaXMuZmluZEZpcnN0RW1wdHlTbG90KCk7XHJcblx0XHR0aGlzLmNhbGNCb251c1N0YXRzKCk7XHJcblx0fVxyXG5cclxuXHR1bmVxdWlwSXRlbShpdGVtKSB7XHJcblx0XHRjb25zdCBuZXdTbG90ID0gdGhpcy5maW5kRmlyc3RFbXB0eVNsb3QoKTtcclxuXHRcdGlmIChuZXdTbG90ID09IG51bGwpIHtcclxuXHRcdFx0Z2FtZS5zZW5kR2FtZUluZm9QbGF5ZXIodGhpcy5nYW1lSWQsIFwiWW91ciBpbnZlbnRvcnkgaXMgZnVsbC5cIik7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdGl0ZW0uc2xvdCA9IG5ld1Nsb3Q7XHJcblx0XHR0aGlzLmNhbGNCb251c1N0YXRzKCk7XHJcblx0fVxyXG5cclxuXHR1cGRhdGUoZGVsdGEpIHtcclxuXHRcdC8vIEludmVudG9yeSBJdGVtIFVwZGF0ZVxyXG5cdFx0Y29uc3QgaW52ZW50b3J5ID0gdGhpcy5nZXRJbnZlbnRvcnkoKTtcclxuXHRcdGludmVudG9yeS5mb3JFYWNoKGl0ZW0gPT4ge1xyXG5cdFx0XHRpZiAoaXRlbSkgaXRlbS51cGRhdGUoKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGlmICh0aGlzLmlzRGVhZCkgcmV0dXJuO1xyXG5cdFx0XHJcblx0XHQvLyBBdHRhY2tpbmdcclxuXHRcdGlmICh0aGlzLmlzQXR0YWNraW5nIHx8IHRoaXMuYXR0YWNrVGltZXIgPiAwKSB7XHJcblx0XHRcdHRoaXMuYXR0YWNrVGltZXIgKz0gZGVsdGE7XHJcblx0XHRcdGlmICh0aGlzLmF0dGFja1RpbWVyID49IDAuMykgdGhpcy5pc0F0dGFja2luZyA9IGZhbHNlO1xyXG5cdFx0XHRpZiAodGhpcy5hdHRhY2tUaW1lciA+PSB0aGlzLmF0dGFja1NwZWVkKSB0aGlzLmF0dGFja1RpbWVyID0gMDtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly8gTW92ZW1lbnRcclxuXHRcdGlmICh0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdHRoaXMubGVycCArPSBkZWx0YSAqIHRoaXMubW92ZVNwZWVkO1xyXG5cdFx0XHRcclxuXHRcdFx0aWYgKHRoaXMubGVycCA+PSAwLjQ5KSB7XHJcblx0XHRcdFx0dGhpcy54ID0gdGhpcy5kZXN0aW5hdGlvblg7XHJcblx0XHRcdFx0dGhpcy55ID0gdGhpcy5kZXN0aW5hdGlvblk7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdGlmICh0aGlzLmxlcnAgPj0gMC45OSkge1xyXG5cdFx0XHRcdHRoaXMuc3RhcnRYID0gdGhpcy5kZXN0aW5hdGlvblg7XHJcblx0XHRcdFx0dGhpcy5zdGFydFkgPSB0aGlzLmRlc3RpbmF0aW9uWTtcclxuXHRcdFx0XHR0aGlzLmxlcnAgPSAwO1xyXG5cdFx0XHRcdHRoaXMuaXNNb3ZpbmcgPSBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFJlZ2VuXHJcblx0XHR0aGlzLnJlZ2VuVGltZXIgKz0gZGVsdGE7XHJcblx0XHRpZiAodGhpcy5yZWdlblRpbWVyID49IDEpIHtcclxuXHRcdFx0dGhpcy5yZWdlblRpbWVyID0gMDtcclxuXHRcdFx0aWYgKHRoaXMuaGVhbHRoIDwgdGhpcy5oZWFsdGhNYXgpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5pc0hpdCkge1xyXG5cdFx0XHRcdFx0dGhpcy5pc0hpdCA9IGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMuaGVhbHRoICs9IHRoaXMuaGVhbHRoUmVnZW47XHJcblx0XHRcdFx0XHRpZiAodGhpcy5oZWFsdGggPiB0aGlzLmhlYWx0aE1heCkgdGhpcy5oZWFsdGggPSB0aGlzLmhlYWx0aE1heDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh0aGlzLmVuZXJneSA8IHRoaXMuZW5lcmd5TWF4KSB7XHJcblx0XHRcdFx0aWYgKCF0aGlzLmlzUnVubmluZykge1xyXG5cdFx0XHRcdFx0dGhpcy5lbmVyZ3kgKz0gdGhpcy5lbmVyZ3lSZWdlbjtcclxuXHRcdFx0XHRcdGlmICh0aGlzLmVuZXJneSA+IHRoaXMuZW5lcmd5TWF4KSB0aGlzLmVuZXJneSA9IHRoaXMuZW5lcmd5TWF4O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cdGdldEludmVudG9yeVBhY2soKSB7XHJcblx0XHRjb25zdCBpbnZlbnRvcnlQYWNrID0gW107XHJcblx0XHRjb25zdCBpbnZlbnRvcnkgPSB0aGlzLmdldEludmVudG9yeSgpO1xyXG5cdFx0aW52ZW50b3J5LmZvckVhY2goKGl0ZW0pID0+IHtcclxuXHRcdFx0aWYgKGl0ZW0pIGludmVudG9yeVBhY2tbaXRlbS5zbG90XSA9IGl0ZW0uZ2V0UGFjaygpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIGludmVudG9yeVBhY2s7XHJcblx0fVxyXG59XHJcbiIsImltcG9ydCBnYW1lIGZyb20gJy4uL2dhbWUuanMnO1xyXG5pbXBvcnQgY29uZmlnIGZyb20gJy4uL2NvbmZpZy5qcyc7XHJcbmltcG9ydCB1dGlsIGZyb20gJy4uL3V0aWwuanMnO1xyXG5pbXBvcnQgQWN0b3IgZnJvbSAnLi9hY3Rvci5qcyc7XHJcblxyXG4vLyBBIEJvdCBpcyBhbiBBY3RvciB3aXRoIGNvbmRpdGlvbmFsIGlucHV0c1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQm90IGV4dGVuZHMgQWN0b3Ige1xyXG5cdGNvbnN0cnVjdG9yKGRhdGEpIHtcclxuXHRcdGxldCB7IF9pZCwgbWFwSWQsIHgsIHksIGRpcmVjdGlvbiwgdGVtcGxhdGUsIG5hbWUsIHNwcml0ZSwgaG9zdGlsZSxcclxuXHRcdFx0XHRcdGRhbWFnZUJhc2UsIGRlZmVuY2VCYXNlLCBoZWFsdGhNYXhCYXNlLCBlbmVyZ3lNYXhCYXNlLCBoZWFsdGhSZWdlbkJhc2UsIGVuZXJneVJlZ2VuQmFzZSwgcmFuZ2VCYXNlIFxyXG5cdFx0XHRcdH0gPSBkYXRhO1xyXG5cdFx0XHJcblx0XHRpZiAoX2lkID09IG51bGwpIF9pZCA9IGdhbWUucmVxdWVzdERCSWQoKTtcclxuXHRcdGlmIChuYW1lID09IG51bGwpIG5hbWUgPSB0ZW1wbGF0ZS5uYW1lO1xyXG5cdFx0aWYgKHNwcml0ZSA9PSBudWxsKSBzcHJpdGUgPSB0ZW1wbGF0ZS5zcHJpdGU7XHJcblx0XHRpZiAoaG9zdGlsZSA9PSBudWxsKSBob3N0aWxlID0gdGVtcGxhdGUuaG9zdGlsZTtcclxuXHRcdGlmIChkYW1hZ2VCYXNlID09IG51bGwpIGRhbWFnZUJhc2UgPSB0ZW1wbGF0ZS5kYW1hZ2VCYXNlO1xyXG5cdFx0aWYgKGRlZmVuY2VCYXNlID09IG51bGwpIGRlZmVuY2VCYXNlID0gdGVtcGxhdGUuZGVmZW5jZUJhc2U7XHJcblx0XHRpZiAoaGVhbHRoTWF4QmFzZSA9PSBudWxsKSBoZWFsdGhNYXhCYXNlID0gdGVtcGxhdGUuaGVhbHRoTWF4QmFzZTtcclxuXHRcdGlmIChlbmVyZ3lNYXhCYXNlID09IG51bGwpIGVuZXJneU1heEJhc2UgPSB0ZW1wbGF0ZS5lbmVyZ3lNYXhCYXNlO1xyXG5cdFx0aWYgKGhlYWx0aFJlZ2VuQmFzZSA9PSBudWxsKSBoZWFsdGhSZWdlbkJhc2UgPSB0ZW1wbGF0ZS5oZWFsdGhSZWdlbkJhc2U7XHJcblx0XHRpZiAoZW5lcmd5UmVnZW5CYXNlID09IG51bGwpIGVuZXJneVJlZ2VuQmFzZSA9IHRlbXBsYXRlLmVuZXJneVJlZ2VuQmFzZTtcclxuXHRcdGlmIChyYW5nZUJhc2UgPT0gbnVsbCkgcmFuZ2VCYXNlID0gdGVtcGxhdGUucmFuZ2VCYXNlO1xyXG5cclxuXHRcdHN1cGVyKG1hcElkLCB4LCB5LCBkaXJlY3Rpb24sIG5hbWUsIHNwcml0ZSk7XHJcblx0XHR0aGlzLmJvdElkID0gX2lkO1xyXG5cdFx0dGhpcy50ZW1wbGF0ZUlkID0gdGVtcGxhdGUuX2lkO1xyXG5cdFx0dGhpcy5kYW1hZ2VCYXNlID0gZGFtYWdlQmFzZTtcclxuXHRcdHRoaXMuZGVmZW5jZUJhc2UgPSBkZWZlbmNlQmFzZTtcclxuXHRcdHRoaXMuaGVhbHRoTWF4QmFzZSA9IGhlYWx0aE1heEJhc2U7XHJcblx0XHR0aGlzLmVuZXJneU1heEJhc2UgPSBlbmVyZ3lNYXhCYXNlO1xyXG5cdFx0dGhpcy5oZWFsdGhSZWdlbkJhc2UgPSBoZWFsdGhSZWdlbkJhc2U7XHJcblx0XHR0aGlzLmVuZXJneVJlZ2VuQmFzZSA9IGVuZXJneVJlZ2VuQmFzZTtcclxuXHRcdHRoaXMucmFuZ2VCYXNlID0gcmFuZ2VCYXNlO1xyXG5cdFx0dGhpcy5jYWxjQm9udXNTdGF0cygpO1xyXG5cdFx0dGhpcy5yZXN0b3JlKCk7XHJcblx0XHRcclxuXHRcdHRoaXMuaG9zdGlsZSA9IGhvc3RpbGU7XHJcblx0XHR0aGlzLnRhcmdldCA9IG51bGw7XHJcblx0XHR0aGlzLnNldFRhc2soJ3dhbmRlcmluZycpO1xyXG5cdFx0dGhpcy5tb3ZlVGltZXIgPSAwO1xyXG5cclxuXHRcdHRoaXMuZ2FtZUlkID0gdXRpbC5maXJzdEVtcHR5SW5kZXgoZ2FtZS5ib3RzKTtcclxuXHRcdGdhbWUuYm90c1t0aGlzLmdhbWVJZF0gPSB0aGlzO1xyXG5cdH1cclxuXHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHRzdXBlci51cGRhdGUoZGVsdGEpOyBcdC8vIERlZmF1bHQgQWN0b3IgVXBkYXRlXHJcblx0XHRpZiAodGhpcy5pc0RlYWQpIHJldHVybjtcclxuXHJcblx0XHR0aGlzLm1vdmVUaW1lcisrO1xyXG5cdFx0XHJcblx0XHQvLyBBSSBJbnB1dHNcclxuXHRcdHN3aXRjaCh0aGlzLnRhc2spIHtcclxuXHRcdFx0Y2FzZSAnd2FuZGVyaW5nJzpcdFx0Ly8gTW92ZSByYW5kb21seVxyXG5cdFx0XHRcdHRoaXMubW92ZSgpO1xyXG5cdFx0XHRcdHRoaXMucGlja1VwKCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdmb2xsb3dpbmcnOlx0XHQvLyBNb3ZlIHRvd2FyZHMgdGFyZ2V0XHJcblx0XHRcdFx0aWYgKHRoaXMudGFyZ2V0KSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmVUb1RhcmdldCh0aGlzLnRhcmdldCwgZmFsc2UpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdC8vIE5vIHRhcmdldFxyXG5cdFx0XHRcdFx0dGhpcy5zZXRUYXNrKCd3YW5kZXJpbmcnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdhdHRhY2tpbmcnOlx0XHQvLyBNb3ZlIHRvd2FyZHMgdGFyZ2V0IGFuZCBhdHRhY2tcclxuXHRcdFx0XHRpZiAodGhpcy50YXJnZXQpIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZVRvVGFyZ2V0KHRoaXMudGFyZ2V0LCB0cnVlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHQvLyBObyB0YXJnZXRcclxuXHRcdFx0XHRcdHRoaXMuc2V0VGFzaygnd2FuZGVyaW5nJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Ly8gY2FzZSAnaWRsZSc6XHJcblx0XHRcdGRlZmF1bHQ6IFx0XHRcdFx0XHQvLyBTdGFuZCBzdGlsbFxyXG5cdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIHRoaXMuZ2V0UGFjaygpO1xyXG5cdH1cclxuXHRcclxuXHRnZXRQYWNrKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0Z2FtZUlkOiB0aGlzLmdhbWVJZCxcclxuXHRcdFx0bmFtZTogdGhpcy5uYW1lLFxyXG5cdFx0XHRzcHJpdGU6IHRoaXMuc3ByaXRlLFxyXG5cdFx0XHRkaXJlY3Rpb246IHRoaXMuZGlyZWN0aW9uLFxyXG5cdFx0XHRtYXBJZDogdGhpcy5tYXBJZCxcclxuXHRcdFx0eDogdGhpcy5zdGFydFgsXHJcblx0XHRcdHk6IHRoaXMuc3RhcnRZLFxyXG5cdFx0XHR6OiB0aGlzLnosXHJcblx0XHRcdGRlc3RpbmF0aW9uWDogdGhpcy5kZXN0aW5hdGlvblgsXHJcblx0XHRcdGRlc3RpbmF0aW9uWTogdGhpcy5kZXN0aW5hdGlvblksXHJcblx0XHRcdGxlcnA6IHRoaXMubGVycCxcclxuXHRcdFx0aXNSdW5uaW5nOiB0aGlzLmlzUnVubmluZyxcclxuXHRcdFx0aXNBdHRhY2tpbmc6IHRoaXMuaXNBdHRhY2tpbmcsXHJcblx0XHRcdGlzRGVhZDogZmFsc2UsXHJcblx0XHRcdGlzVmlzaWJsZTogdGhpcy5pc1Zpc2libGVcclxuXHRcdH07XHJcblx0fVxyXG5cdFxyXG5cdGdldERCUGFjaygpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGJvdElkOiB0aGlzLmJvdElkLFxyXG5cdFx0XHR0ZW1wbGF0ZUlkOiB0aGlzLnRlbXBsYXRlSWQsXHJcblx0XHRcdG1hcElkOiB0aGlzLm1hcElkLFxyXG5cdFx0XHR4OiB0aGlzLngsXHJcblx0XHRcdHk6IHRoaXMueSxcclxuXHRcdFx0ZGlyZWN0aW9uOiB0aGlzLmRpcmVjdGlvbixcclxuXHRcdFx0bmFtZTogdGhpcy5uYW1lLFxyXG5cdFx0XHRzcHJpdGU6IHRoaXMuc3ByaXRlLFxyXG5cdFx0XHRob3N0aWxlOiB0aGlzLmhvc3RpbGVcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHRyZW1vdmUoKSB7XHJcblx0XHRkZWxldGUgZ2FtZS5ib3RzW3RoaXMuZ2FtZUlkXTtcclxuXHR9XHJcblx0XHJcblx0bW92ZShkaXJlY3Rpb24pIHtcclxuXHRcdGxldCBtb3ZlVGltZSA9IDI0O1xyXG5cdFx0aWYgKHRoaXMuaXNSdW5uaW5nKSBtb3ZlVGltZSA9IDE3O1xyXG5cdFx0aWYgKHRoaXMubW92ZVRpbWVyID4gbW92ZVRpbWUgJiYgdGhpcy5hdHRhY2tUaW1lciA9PT0gMCkge1xyXG5cdFx0XHRzdXBlci5tb3ZlKGRpcmVjdGlvbik7XHJcblx0XHRcdHRoaXMubW92ZVRpbWVyID0gMDtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0dGFrZURhbWFnZShkYW1hZ2UsIGF0dGFja2VyKSB7XHJcblx0XHRpZiAoYXR0YWNrZXIgaW5zdGFuY2VvZiBBY3RvcikgdGhpcy5zZXRUYXNrKCdhdHRhY2tpbmcnLCBhdHRhY2tlcik7XHJcblx0XHRzdXBlci50YWtlRGFtYWdlKGRhbWFnZSwgYXR0YWNrZXIpO1xyXG5cdH1cclxuXHRcclxuXHRwaWNrVXAoKSB7XHJcblx0XHRzdXBlci5waWNrVXAoKTtcclxuXHRcdHRoaXMuY2hlY2tCZXN0RXF1aXBtZW50KCk7XHJcblx0fVxyXG5cclxuXHRnZXRJbnZlbnRvcnkoKSB7XHJcblx0XHRjb25zdCBpbnZlbnRvcnkgPSBnYW1lLml0ZW1zLmZpbHRlcihpdGVtID0+IHtcclxuXHRcdFx0cmV0dXJuIFwiXCIraXRlbS5ib3RJZCA9PT0gXCJcIit0aGlzLmJvdElkO1xyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gaW52ZW50b3J5O1xyXG5cdH1cclxuXHJcblx0c2V0RGVhZCgpIHtcclxuXHRcdHN1cGVyLnNldERlYWQoKTtcclxuXHRcdHRoaXMucmVtb3ZlKCk7XHJcblx0fVxyXG5cclxuXHQvLyBJbnB1dHNcclxuXHRzZXRUYXNrKHRhc2ssIHRhcmdldCkge1xyXG5cdFx0c3dpdGNoICh0YXNrKSB7XHJcblx0XHRcdGNhc2UgJ3dhbmRlcmluZyc6XHJcblx0XHRcdFx0dGhpcy5sYXppbmVzcyA9IDc7XHJcblx0XHRcdFx0dGhpcy50YXJnZXQgPSBudWxsO1xyXG5cdFx0XHRcdHRoaXMudGFzayA9IHRhc2s7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdmb2xsb3dpbmcnOlxyXG5cdFx0XHRcdGlmICh0YXJnZXQgPT09IG51bGwpIHtcclxuXHRcdFx0XHRcdHRoaXMuc2V0VGFzaygnd2FuZGVyaW5nJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5sYXppbmVzcyA9IDA7XHJcblx0XHRcdFx0XHR0aGlzLnRhcmdldCA9IHRhcmdldDtcclxuXHRcdFx0XHRcdHRoaXMudGFzayA9IHRhc2s7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnYXR0YWNraW5nJzpcclxuXHRcdFx0XHRpZiAodGFyZ2V0ID09PSBudWxsKSB7XHJcblx0XHRcdFx0XHR0aGlzLnNldFRhc2soJ3dhbmRlcmluZycpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubGF6aW5lc3MgPSAwO1xyXG5cdFx0XHRcdFx0dGhpcy50YXJnZXQgPSB0YXJnZXQ7XHJcblx0XHRcdFx0XHR0aGlzLnRhc2sgPSB0YXNrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGRlZmF1bHQ6XHQvL2lkbGluZ1xyXG5cdFx0XHRcdHRoaXMubGF6aW5lc3MgPSA3O1xyXG5cdFx0XHRcdHRoaXMudGFyZ2V0ID0gbnVsbDtcclxuXHRcdFx0XHR0aGlzLnRhc2sgPSAnaWRsZSc7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRjaGVja0Jlc3RFcXVpcG1lbnQoKSB7XHJcblx0XHRjb25zdCBpbnZlbnRvcnkgPSB0aGlzLmdldEludmVudG9yeSgpO1xyXG5cdFx0Y29uc3QgZXF1aXBtZW50ID0gW107XHJcblx0XHRmb3IgKGxldCBzbG90ID0gMDsgc2xvdCA8IGNvbmZpZy5FUVVJUE1FTlRfU0laRTsgc2xvdCsrKSB7XHJcblx0XHRcdGVxdWlwbWVudC5wdXNoKFtdKTtcclxuXHRcdH1cclxuXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGludmVudG9yeS5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRjb25zdCBpdGVtID0gaW52ZW50b3J5W2ldO1xyXG5cdFx0XHRmb3IgKGxldCBzbG90ID0gMDsgc2xvdCA8IGNvbmZpZy5FUVVJUE1FTlRfU0laRTsgc2xvdCsrKSB7XHJcblx0XHRcdFx0aWYgKGl0ZW0uZXF1aXBwZWRTbG90ID09PSBzbG90KSB7XHJcblx0XHRcdFx0XHRlcXVpcG1lbnRbc2xvdF0ucHVzaChpdGVtKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoZXF1aXBtZW50WzBdLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0ZXF1aXBtZW50WzBdLnNvcnQoKGEsIGIpID0+IGIuZXF1aXBwZWQuZGFtYWdlIC0gYS5lcXVpcHBlZC5kYW1hZ2UpO1xyXG5cdFx0XHR0aGlzLmVxdWlwSXRlbShlcXVpcG1lbnRbMF1bMF0pO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGVxdWlwbWVudFsxXS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdGVxdWlwbWVudFsxXS5zb3J0KChhLCBiKSA9PiBiLmVxdWlwcGVkLmRlZmVuY2UgLSBhLmVxdWlwcGVkLmRlZmVuY2UpO1xyXG5cdFx0XHR0aGlzLmVxdWlwSXRlbShlcXVpcG1lbnRbMV1bMF0pO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGVxdWlwbWVudFsyXS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdGVxdWlwbWVudFsyXS5zb3J0KChhLCBiKSA9PiBiLmVxdWlwcGVkLmRlZmVuY2UgLSBhLmVxdWlwcGVkLmRlZmVuY2UpO1xyXG5cdFx0XHR0aGlzLmVxdWlwSXRlbShlcXVpcG1lbnRbMl1bMF0pO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGVxdWlwbWVudFszXS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdGVxdWlwbWVudFszXS5zb3J0KChhLCBiKSA9PiBiLmVxdWlwcGVkLmRlZmVuY2UgLSBhLmVxdWlwcGVkLmRlZmVuY2UpO1xyXG5cdFx0XHR0aGlzLmVxdWlwSXRlbShlcXVpcG1lbnRbM11bMF0pO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGVxdWlwbWVudFs0XS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdGVxdWlwbWVudFs0XS5zb3J0KChhLCBiKSA9PiBiLmVxdWlwcGVkLmRlZmVuY2UgLSBhLmVxdWlwcGVkLmRlZmVuY2UpO1xyXG5cdFx0XHR0aGlzLmVxdWlwSXRlbShlcXVpcG1lbnRbNF1bMF0pO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG4iLCJpbXBvcnQgRW50aXR5IGZyb20gJy4vZW50aXR5LmpzJztcclxuaW1wb3J0IGdhbWUgZnJvbSAnLi4vZ2FtZS5qcyc7XHJcbmltcG9ydCBjb25maWcgZnJvbSAnLi4vY29uZmlnLmpzJztcclxuaW1wb3J0IHV0aWwgZnJvbSAnLi4vdXRpbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFZmZlY3QgZXh0ZW5kcyBFbnRpdHkge1xyXG5cdGNvbnN0cnVjdG9yKG1hcElkLCB4LCB5LCBzcHJpdGUgPSAwLCBsb29wID0gMCwgc3BlZWQgPSAxMiwgbWF4RnJhbWUgPSA3LCBzdGFydEZyYW1lID0gMCkge1xyXG5cdFx0c3VwZXIobWFwSWQsIHgsIHksIHV0aWwuY2xhbXAoc3ByaXRlLCAwLCBjb25maWcuTUFYX0VGRkVDVFMgLSAxKSk7XHJcblx0XHR0aGlzLm1heEZyYW1lID0gdXRpbC5jbGFtcChtYXhGcmFtZSwgMCwgNyk7XHJcblx0XHR0aGlzLnN0YXJ0RnJhbWUgPSB1dGlsLmNsYW1wKHN0YXJ0RnJhbWUsIDAsIHRoaXMubWF4RnJhbWUpO1xyXG5cdFx0dGhpcy5jdXJyZW50RnJhbWUgPSB0aGlzLnN0YXJ0RnJhbWU7XHJcblx0XHRcclxuXHRcdHRoaXMubG9vcCA9IGxvb3A7XHJcblx0XHR0aGlzLnNwZWVkID0gc3BlZWQ7XHJcblx0XHR0aGlzLnRpbWVyID0gMDtcclxuXHRcdFxyXG5cdFx0dGhpcy5nYW1lSWQgPSB1dGlsLmZpcnN0RW1wdHlJbmRleChnYW1lLmVmZmVjdHMpO1xyXG5cdFx0Z2FtZS5lZmZlY3RzW3RoaXMuZ2FtZUlkXSA9IHRoaXM7XHJcblx0fVxyXG5cdFxyXG5cdHVwZGF0ZShkZWx0YSkge1xyXG5cdFx0dGhpcy50aW1lciArPSBkZWx0YTtcclxuXHRcdFxyXG5cdFx0aWYgKHRoaXMudGltZXIgPj0gMSAvIHRoaXMuc3BlZWQpIHtcclxuXHRcdFx0dGhpcy50aW1lciA9IDA7XHJcblx0XHRcdHRoaXMuY3VycmVudEZyYW1lKys7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5jdXJyZW50RnJhbWUgPiB0aGlzLm1heEZyYW1lKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMubG9vcCA8IDApIHtcclxuXHRcdFx0XHRcdHRoaXMuY3VycmVudEZyYW1lID0gdGhpcy5zdGFydEZyYW1lO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIGlmICh0aGlzLmxvb3AgPiAwKSB7XHJcblx0XHRcdFx0XHR0aGlzLmN1cnJlbnRGcmFtZSA9IHRoaXMuc3RhcnRGcmFtZTtcclxuXHRcdFx0XHRcdHRoaXMubG9vcC0tO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMuY3VycmVudEZyYW1lID0gdGhpcy5tYXhGcmFtZTtcclxuXHRcdFx0XHRcdHRoaXMucmVtb3ZlKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuZ2V0UGFjaygpO1xyXG5cdH1cclxuXHRcclxuXHRnZXRQYWNrKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0Z2FtZUlkOiB0aGlzLmdhbWVJZCxcclxuXHRcdFx0bWFwSWQ6IHRoaXMubWFwSWQsXHJcblx0XHRcdHg6IHRoaXMueCxcclxuXHRcdFx0eTogdGhpcy55LFxyXG5cdFx0XHRzcHJpdGU6IHRoaXMuc3ByaXRlLFxyXG5cdFx0XHRjdXJyZW50RnJhbWU6IHRoaXMuY3VycmVudEZyYW1lXHJcblx0XHR9O1xyXG5cdH1cclxuXHRcclxuXHRyZW1vdmUoKSB7XHJcblx0XHRkZWxldGUgZ2FtZS5lZmZlY3RzW3RoaXMuZ2FtZUlkXTtcclxuXHR9XHRcclxufVxyXG4iLCJpbXBvcnQgY29uZmlnIGZyb20gJy4uL2NvbmZpZy5qcyc7XHJcblxyXG4vLyBBbiBFbnRpdHkgaXMgYW55IG9iamVjdCB3aGljaCBjYW4gYXBwZWFyIG9uIHRoZSBtYXBcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVudGl0eSB7XHJcblx0Y29uc3RydWN0b3IobWFwSWQsIHgsIHksIHNwcml0ZSA9IDEpIHtcclxuXHRcdHRoaXMubWFwSWQgPSBtYXBJZDtcclxuXHRcdHRoaXMueCA9IHg7XHJcblx0XHR0aGlzLnkgPSB5O1xyXG5cdFx0aWYgKHNwcml0ZSA8IDEpIHNwcml0ZSA9IDE7XHJcblx0XHR0aGlzLnNwcml0ZSA9IHNwcml0ZTtcclxuXHRcdHRoaXMuaXNWaXNpYmxlID0gdHJ1ZTtcclxuXHR9XHJcbn1cclxuIiwiaW1wb3J0IGdhbWUgZnJvbSAnLi4vZ2FtZS5qcyc7XHJcbmltcG9ydCB1dGlsIGZyb20gJy4uL3V0aWwuanMnO1xyXG5pbXBvcnQgRW50aXR5IGZyb20gJy4vZW50aXR5LmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEl0ZW0gZXh0ZW5kcyBFbnRpdHkge1xyXG5cdGNvbnN0cnVjdG9yKGRhdGEpIHtcclxuXHRcdGlmICghZGF0YSkgcmV0dXJuO1xyXG5cclxuXHRcdGxldCB7IF9pZCwgcGxheWVySWQsIGJvdElkLCBzbG90LCBtYXBJZCwgeCwgeSwgdGVtcGxhdGUsIHN0YWNrLCBzcHJpdGUsIG5hbWUsIGRlc2NyaXB0aW9uLCByZXVzYWJsZSwgY3JlYXRlZEJ5LCBjcmVhdGVkRGF0ZSxcclxuXHRcdFx0XHRcdHBhc3NpdmVEYW1hZ2UsIHBhc3NpdmVEZWZlbmNlLCBwYXNzaXZlSGVhbHRoTWF4LCBwYXNzaXZlRW5lcmd5TWF4LCBwYXNzaXZlSGVhbHRoUmVnZW4sIHBhc3NpdmVFbmVyZ3lSZWdlbiwgcGFzc2l2ZVJhbmdlLFxyXG5cdFx0XHRcdFx0ZXF1aXBwZWREYW1hZ2UsIGVxdWlwcGVkRGVmZW5jZSwgZXF1aXBwZWRIZWFsdGhNYXgsIGVxdWlwcGVkRW5lcmd5TWF4LCBlcXVpcHBlZEhlYWx0aFJlZ2VuLCBlcXVpcHBlZEVuZXJneVJlZ2VuLCBlcXVpcHBlZFJhbmdlXHJcblx0XHRcdFx0fSA9IGRhdGE7XHJcblxyXG5cdFx0aWYgKF9pZCA9PSBudWxsKSBfaWQgPSBnYW1lLnJlcXVlc3REQklkKCk7XHJcblx0XHRpZiAocGxheWVySWQgPT09IHVuZGVmaW5lZCkgcGxheWVySWQgPSBudWxsO1xyXG5cdFx0aWYgKGJvdElkID09PSB1bmRlZmluZWQpIGJvdElkID0gbnVsbDtcclxuXHRcdGlmIChzbG90ID09PSB1bmRlZmluZWQpIHNsb3QgPSBudWxsO1xyXG5cdFx0aWYgKG1hcElkID09PSB1bmRlZmluZWQpIG1hcElkID0gbnVsbDtcclxuXHRcdGlmICh4ID09PSB1bmRlZmluZWQpIHggPSBudWxsO1xyXG5cdFx0aWYgKHkgPT09IHVuZGVmaW5lZCkgeSA9IG51bGw7XHJcblx0XHRpZiAoY3JlYXRlZEJ5ID09PSB1bmRlZmluZWQpIGNyZWF0ZWRCeSA9IG51bGw7XHJcblx0XHRpZiAoY3JlYXRlZERhdGUgPT09IHVuZGVmaW5lZCkgY3JlYXRlZERhdGUgPSBuZXcgRGF0ZSgpO1xyXG5cclxuXHRcdGlmIChzcHJpdGUgPT09IHVuZGVmaW5lZCkgc3ByaXRlID0gdGVtcGxhdGUuc3ByaXRlO1xyXG5cdFx0aWYgKG5hbWUgPT09IHVuZGVmaW5lZCkgbmFtZSA9IHRlbXBsYXRlLm5hbWU7XHJcblx0XHRpZiAoZGVzY3JpcHRpb24gPT09IHVuZGVmaW5lZCkgZGVzY3JpcHRpb24gPSB0ZW1wbGF0ZS5kZXNjcmlwdGlvbjtcclxuXHRcdGlmIChyZXVzYWJsZSA9PT0gdW5kZWZpbmVkKSByZXVzYWJsZSA9IHRlbXBsYXRlLnJldXNhYmxlO1xyXG5cdFx0aWYgKHBhc3NpdmVEYW1hZ2UgPT09IHVuZGVmaW5lZCkgcGFzc2l2ZURhbWFnZSA9IHRlbXBsYXRlLnBhc3NpdmVEYW1hZ2U7XHJcblx0XHRpZiAocGFzc2l2ZURlZmVuY2UgPT09IHVuZGVmaW5lZCkgcGFzc2l2ZURlZmVuY2UgPSB0ZW1wbGF0ZS5wYXNzaXZlRGVmZW5jZTtcclxuXHRcdGlmIChwYXNzaXZlSGVhbHRoTWF4ID09PSB1bmRlZmluZWQpIHBhc3NpdmVIZWFsdGhNYXggPSB0ZW1wbGF0ZS5wYXNzaXZlSGVhbHRoTWF4O1xyXG5cdFx0aWYgKHBhc3NpdmVFbmVyZ3lNYXggPT09IHVuZGVmaW5lZCkgcGFzc2l2ZUVuZXJneU1heCA9IHRlbXBsYXRlLnBhc3NpdmVFbmVyZ3lNYXg7XHJcblx0XHRpZiAocGFzc2l2ZUhlYWx0aFJlZ2VuID09PSB1bmRlZmluZWQpIHBhc3NpdmVIZWFsdGhSZWdlbiA9IHRlbXBsYXRlLnBhc3NpdmVIZWFsdGhSZWdlbjtcclxuXHRcdGlmIChwYXNzaXZlRW5lcmd5UmVnZW4gPT09IHVuZGVmaW5lZCkgcGFzc2l2ZUVuZXJneVJlZ2VuID0gdGVtcGxhdGUucGFzc2l2ZUVuZXJneVJlZ2VuO1xyXG5cdFx0aWYgKHBhc3NpdmVSYW5nZSA9PT0gdW5kZWZpbmVkKSBwYXNzaXZlUmFuZ2UgPSB0ZW1wbGF0ZS5wYXNzaXZlUmFuZ2U7XHJcblx0XHRpZiAoZXF1aXBwZWREYW1hZ2UgPT09IHVuZGVmaW5lZCkgZXF1aXBwZWREYW1hZ2UgPSB0ZW1wbGF0ZS5lcXVpcHBlZERhbWFnZTtcclxuXHRcdGlmIChlcXVpcHBlZERlZmVuY2UgPT09IHVuZGVmaW5lZCkgZXF1aXBwZWREZWZlbmNlID0gdGVtcGxhdGUuZXF1aXBwZWREZWZlbmNlO1xyXG5cdFx0aWYgKGVxdWlwcGVkSGVhbHRoTWF4ID09PSB1bmRlZmluZWQpIGVxdWlwcGVkSGVhbHRoTWF4ID0gdGVtcGxhdGUuZXF1aXBwZWRIZWFsdGhNYXg7XHJcblx0XHRpZiAoZXF1aXBwZWRFbmVyZ3lNYXggPT09IHVuZGVmaW5lZCkgZXF1aXBwZWRFbmVyZ3lNYXggPSB0ZW1wbGF0ZS5lcXVpcHBlZEVuZXJneU1heDtcclxuXHRcdGlmIChlcXVpcHBlZEhlYWx0aFJlZ2VuID09PSB1bmRlZmluZWQpIGVxdWlwcGVkSGVhbHRoUmVnZW4gPSB0ZW1wbGF0ZS5lcXVpcHBlZEhlYWx0aFJlZ2VuO1xyXG5cdFx0aWYgKGVxdWlwcGVkRW5lcmd5UmVnZW4gPT09IHVuZGVmaW5lZCkgZXF1aXBwZWRFbmVyZ3lSZWdlbiA9IHRlbXBsYXRlLmVxdWlwcGVkRW5lcmd5UmVnZW47XHJcblx0XHRpZiAoZXF1aXBwZWRSYW5nZSA9PT0gdW5kZWZpbmVkKSBlcXVpcHBlZFJhbmdlID0gdGVtcGxhdGUuZXF1aXBwZWRSYW5nZTtcclxuXHJcblx0XHRzdXBlcihtYXBJZCwgeCwgeSwgc3ByaXRlKTtcclxuXHRcdHRoaXMueiA9IC0xMDtcclxuXHRcdHRoaXMuaXRlbUlkID0gX2lkO1xyXG5cdFx0dGhpcy5wbGF5ZXJJZCA9IHBsYXllcklkO1xyXG5cdFx0dGhpcy5ib3RJZCA9IGJvdElkO1xyXG5cdFx0dGhpcy5zbG90ID0gc2xvdDtcclxuXHRcdFxyXG5cdFx0dGhpcy50ZW1wbGF0ZUlkID0gdGVtcGxhdGUuX2lkO1xyXG5cdFx0dGhpcy5uYW1lID0gbmFtZTtcclxuXHRcdHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcclxuXHRcdHRoaXMucmV1c2FibGUgPSByZXVzYWJsZTtcclxuXHJcblx0XHR0aGlzLnR5cGUgPSB0ZW1wbGF0ZS50eXBlLm5hbWU7XHJcblx0XHR0aGlzLnN0YWNrYWJsZSA9IHRlbXBsYXRlLnR5cGUuc3RhY2thYmxlO1xyXG5cdFx0dGhpcy5lcXVpcHBlZFNsb3QgPSB0ZW1wbGF0ZS50eXBlLmVxdWlwcGVkU2xvdDtcclxuXHRcdFxyXG5cdFx0dGhpcy5wYXNzaXZlID0ge1xyXG5cdFx0XHRkYW1hZ2U6IHBhc3NpdmVEYW1hZ2UsXHJcblx0XHRcdGRlZmVuY2U6IHBhc3NpdmVEZWZlbmNlLFxyXG5cdFx0XHRoZWFsdGhNYXg6IHBhc3NpdmVIZWFsdGhNYXgsXHJcblx0XHRcdGVuZXJneU1heDogcGFzc2l2ZUVuZXJneU1heCxcclxuXHRcdFx0aGVhbHRoUmVnZW46IHBhc3NpdmVIZWFsdGhSZWdlbixcclxuXHRcdFx0ZW5lcmd5UmVnZW46IHBhc3NpdmVFbmVyZ3lSZWdlbixcclxuXHRcdFx0cmFuZ2U6IHBhc3NpdmVSYW5nZVxyXG5cdFx0fTtcclxuXHRcdHRoaXMuZXF1aXBwZWQgPSB7XHJcblx0XHRcdGRhbWFnZTogZXF1aXBwZWREYW1hZ2UsXHJcblx0XHRcdGRlZmVuY2U6IGVxdWlwcGVkRGVmZW5jZSxcclxuXHRcdFx0aGVhbHRoTWF4OiBlcXVpcHBlZEhlYWx0aE1heCxcclxuXHRcdFx0ZW5lcmd5TWF4OiBlcXVpcHBlZEVuZXJneU1heCxcclxuXHRcdFx0aGVhbHRoUmVnZW46IGVxdWlwcGVkSGVhbHRoUmVnZW4sXHJcblx0XHRcdGVuZXJneVJlZ2VuOiBlcXVpcHBlZEVuZXJneVJlZ2VuLFxyXG5cdFx0XHRyYW5nZTogZXF1aXBwZWRSYW5nZVxyXG5cdFx0fTtcclxuXHRcdFxyXG5cdFx0aWYgKHRoaXMuc3RhY2thYmxlKSB7XHJcblx0XHRcdGlmIChzdGFjayA8IDEpIHN0YWNrID0gMTtcclxuXHRcdFx0dGhpcy5zdGFjayA9IHN0YWNrO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHRoaXMuc3RhY2sgPSAwO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuZ2FtZUlkID0gdXRpbC5maXJzdEVtcHR5SW5kZXgoZ2FtZS5pdGVtcyk7XHJcblx0XHRnYW1lLml0ZW1zW3RoaXMuZ2FtZUlkXSA9IHRoaXM7XHJcblx0fVxyXG5cclxuXHR1cGRhdGUoZGVsdGEpIHtcclxuXHRcdHJldHVybiB0aGlzLmdldFBhY2soKTtcclxuXHR9XHJcblxyXG5cdGdldERCUGFjaygpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGl0ZW1JZDogdGhpcy5pdGVtSWQsXHJcblx0XHRcdHBsYXllcklkOiB0aGlzLnBsYXllcklkLFxyXG5cdFx0XHRib3RJZDogdGhpcy5ib3RJZCxcclxuXHRcdFx0c2xvdDogdGhpcy5zbG90LFxyXG5cdFx0XHRtYXBJZDogdGhpcy5tYXBJZCxcclxuXHRcdFx0eDogdGhpcy54LFxyXG5cdFx0XHR5OiB0aGlzLnksXHJcblx0XHRcdGNyZWF0ZWRCeTogdGhpcy5jcmVhdGVkQnksXHJcblx0XHRcdGNyZWF0ZWREYXRlOiB0aGlzLmNyZWF0ZWREYXRlLFxyXG5cdFx0XHR0ZW1wbGF0ZUlkOiB0aGlzLnRlbXBsYXRlSWQsXHJcblx0XHRcdG5hbWU6IHRoaXMubmFtZSxcclxuXHRcdFx0ZGVzY3JpcHRpb246IHRoaXMuZGVzY3JpcHRpb24sXHJcblx0XHRcdHNwcml0ZTogdGhpcy5zcHJpdGUsXHJcblx0XHRcdHJldXNhYmxlOiB0aGlzLnJldXNhYmxlLFxyXG5cdFx0XHRwYXNzaXZlRGFtYWdlOiB0aGlzLnBhc3NpdmUuZGFtYWdlLFxyXG5cdFx0XHRwYXNzaXZlRGVmZW5jZTogdGhpcy5wYXNzaXZlLmRlZmVuY2UsXHJcblx0XHRcdHBhc3NpdmVIZWFsdGhNYXg6IHRoaXMucGFzc2l2ZS5oZWFsdGhNYXgsXHJcblx0XHRcdHBhc3NpdmVFbmVyZ3lNYXg6IHRoaXMucGFzc2l2ZS5lbmVyZ3lNYXgsXHJcblx0XHRcdHBhc3NpdmVSYW5nZTogdGhpcy5wYXNzaXZlLnJhbmdlLFxyXG5cdFx0XHRlcXVpcHBlZERhbWFnZTogdGhpcy5lcXVpcHBlZC5kYW1hZ2UsXHJcblx0XHRcdGVxdWlwcGVkRGVmZW5jZTogdGhpcy5lcXVpcHBlZC5kZWZlbmNlLFxyXG5cdFx0XHRlcXVpcHBlZEhlYWx0aE1heDogdGhpcy5lcXVpcHBlZC5oZWFsdGhNYXgsXHJcblx0XHRcdGVxdWlwcGVkRW5lcmd5TWF4OiB0aGlzLmVxdWlwcGVkLmVuZXJneU1heCxcclxuXHRcdFx0ZXF1aXBwZWRSYW5nZTogdGhpcy5lcXVpcHBlZC5yYW5nZSxcclxuXHRcdFx0c3RhY2s6IHRoaXMuc3RhY2ssXHJcblx0XHRcdGlzVmlzaWJsZTogdGhpcy5pc1Zpc2libGVcclxuXHRcdH07XHJcblx0fVxyXG5cdFxyXG5cdGdldFBhY2soKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRnYW1lSWQ6IHRoaXMuZ2FtZUlkLFxyXG5cdFx0XHRwbGF5ZXJJZDogdGhpcy5wbGF5ZXJJZCxcclxuXHRcdFx0Ym90SWQ6IHRoaXMuYm90SWQsXHJcblx0XHRcdHNsb3Q6IHRoaXMuc2xvdCxcclxuXHRcdFx0bWFwSWQ6IHRoaXMubWFwSWQsXHJcblx0XHRcdHg6IHRoaXMueCxcclxuXHRcdFx0eTogdGhpcy55LFxyXG5cdFx0XHR6OiB0aGlzLnosXHJcblx0XHRcdG5hbWU6IHRoaXMubmFtZSxcclxuXHRcdFx0ZGVzY3JpcHRpb246IHRoaXMuZGVzY3JpcHRpb24sXHJcblx0XHRcdHNwcml0ZTogdGhpcy5zcHJpdGUsXHJcblx0XHRcdHR5cGU6IHRoaXMudHlwZSxcclxuXHRcdFx0cmV1c2FibGU6IHRoaXMucmV1c2FibGUsXHJcblx0XHRcdHBhc3NpdmU6IHRoaXMucGFzc2l2ZSxcclxuXHRcdFx0ZXF1aXBwZWQ6IHRoaXMuZXF1aXBwZWQsXHJcblx0XHRcdHN0YWNrOiB0aGlzLnN0YWNrLFxyXG5cdFx0XHRpc1Zpc2libGU6IHRoaXMuaXNWaXNpYmxlXHJcblx0XHR9O1xyXG5cdH1cclxuXHRcclxuXHRyZW1vdmUoKSB7XHJcblx0XHRkZWxldGUgZ2FtZS5pdGVtc1t0aGlzLmdhbWVJZF07XHJcblx0fVxyXG5cclxuXHRyZW1vdmVPbmUoKSB7XHJcblx0XHRpZiAodGhpcy5zdGFjayA+IDEpIHtcclxuXHRcdFx0dGhpcy5zdGFjay0tO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHRoaXMucmVtb3ZlKCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRtb3ZlVG9JbnZlbnRvcnkocGxheWVySWQsIGJvdElkLCBzbG90KSB7XHJcblx0XHR0aGlzLnBsYXllcklkID0gcGxheWVySWQ7XHJcblx0XHR0aGlzLmJvdElkID0gYm90SWQ7XHJcblx0XHR0aGlzLnNsb3QgPSBzbG90O1xyXG5cdFx0dGhpcy5tYXBJZCA9IG51bGw7XHJcblx0XHR0aGlzLnggPSBudWxsO1xyXG5cdFx0dGhpcy55ID0gbnVsbDtcclxuXHRcdHRoaXMueiA9IG51bGw7XHJcblx0fVxyXG5cclxuXHRtb3ZlVG9NYXAobWFwSWQsIHgsIHkpIHtcclxuXHRcdHRoaXMubWFwSWQgPSBtYXBJZDtcclxuXHRcdHRoaXMueCA9IHg7XHJcblx0XHR0aGlzLnkgPSB5O1xyXG5cdFx0dGhpcy56ID0gdGhpcy5nZXRaUG9zaXRpb24obWFwSWQsIHgsIHkpO1xyXG5cdFx0dGhpcy5wbGF5ZXJJZCA9IG51bGw7XHJcblx0XHR0aGlzLmJvdElkID0gbnVsbDtcclxuXHRcdHRoaXMuc2xvdCA9IG51bGw7XHJcblx0fVxyXG5cdFxyXG5cdGdldFpQb3NpdGlvbihtYXBJZCwgeCwgeSkge1xyXG5cdFx0cmV0dXJuIC0xMDtcclxuXHR9XHJcblxyXG5cdGlzRXF1aXBtZW50KCkge1xyXG5cdFx0aWYgKHRoaXMuZXF1aXBwZWRTbG90ID49IDApIHtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG4iLCJpbXBvcnQgY29uZmlnIGZyb20gJy4uL2NvbmZpZy5qcyc7XHJcbmltcG9ydCB1dGlsIGZyb20gJy4uL3V0aWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFwIHtcclxuXHRjb25zdHJ1Y3RvcihtYXBJZCwgZGF0YSA9IHt9KSB7XHJcblx0XHR0aGlzLm1hcElkID0gbWFwSWQ7XHJcblxyXG5cdFx0aWYgKGRhdGEubmFtZSA9PSBudWxsKSBkYXRhLm5hbWUgPSBcIkJsYW5rIE1hcFwiO1xyXG5cdFx0aWYgKGRhdGEuZHJvcENoYW5jZSA9PSBudWxsKSBkYXRhLmRyb3BDaGFuY2UgPSAxMDA7XHJcblx0XHRpZiAoZGF0YS5kcm9wQW1vdW50RVEgPT0gbnVsbCkgZGF0YS5kcm9wQW1vdW50RVEgPSAxO1xyXG5cdFx0aWYgKCFkYXRhLnRpbGVzKSBkYXRhLnRpbGVzID0gdXRpbC5jcmVhdGUzZEFycmF5KGNvbmZpZy5NQVBfQ09MVU1OUywgY29uZmlnLk1BUF9ST1dTLCBjb25maWcuTUFQX0xBWUVSUywgMCk7XHJcblx0XHRpZiAoIWRhdGEuaXNXYWxsKSBkYXRhLmlzV2FsbCA9IHV0aWwuY3JlYXRlMmRBcnJheShjb25maWcuTUFQX0NPTFVNTlMsIGNvbmZpZy5NQVBfUk9XUywgZmFsc2UpO1xyXG5cdFx0aWYgKCFkYXRhLmlzSG9zdGlsZSkgZGF0YS5pc0hvc3RpbGUgPSB1dGlsLmNyZWF0ZTJkQXJyYXkoY29uZmlnLk1BUF9DT0xVTU5TLCBjb25maWcuTUFQX1JPV1MsIGZhbHNlKTtcclxuXHRcdGlmICghZGF0YS5kYW1hZ2UpIGRhdGEuZGFtYWdlID0gdXRpbC5jcmVhdGUyZEFycmF5KGNvbmZpZy5NQVBfQ09MVU1OUywgY29uZmlnLk1BUF9ST1dTLCBudWxsKTtcclxuXHRcdGlmICghZGF0YS53YXJwTWFwKSBkYXRhLndhcnBNYXAgPSB1dGlsLmNyZWF0ZTJkQXJyYXkoY29uZmlnLk1BUF9DT0xVTU5TLCBjb25maWcuTUFQX1JPV1MsIG51bGwpO1xyXG5cdFx0aWYgKCFkYXRhLndhcnBYKSBkYXRhLndhcnBYID0gdXRpbC5jcmVhdGUyZEFycmF5KGNvbmZpZy5NQVBfQ09MVU1OUywgY29uZmlnLk1BUF9ST1dTLCBudWxsKTtcclxuXHRcdGlmICghZGF0YS53YXJwWSkgZGF0YS53YXJwWSA9IHV0aWwuY3JlYXRlMmRBcnJheShjb25maWcuTUFQX0NPTFVNTlMsIGNvbmZpZy5NQVBfUk9XUywgbnVsbCk7XHJcblxyXG5cdFx0dGhpcy5uYW1lID0gZGF0YS5uYW1lO1xyXG5cdFx0dGhpcy5kcm9wQ2hhbmNlID0gdXRpbC5jbGFtcChkYXRhLmRyb3BDaGFuY2UsIDAsIDEwMCk7XHJcblx0XHR0aGlzLmRyb3BBbW91bnRFUSA9IHV0aWwuY2xhbXAoZGF0YS5kcm9wQW1vdW50RVEsIDAsIGNvbmZpZy5FUVVJUE1FTlRfU0laRSk7XHJcblx0XHQvL3RoaXMuZHJvcENoYW5jZSA9IDAgPSAwJSBjaGFuY2UgdG8gZHJvcCBpdGVtcyBpbiBpbnZlbnRvcnkgKGRyb3Agbm90aGluZyksIDEwMCA9IDEwMCUgY2hhbmNlIHRvIGRyb3AgKGRyb3AgZXZlcnl0aGluZylcclxuXHRcdC8vdGhpcy5kcm9wQW1vdW50RVEgPSBudW1iZXIgb2YgZXF1aXBwZWQgaXRlbXMgdGhlIHBsYXllciB3aWxsIGRyb3Agb24gZGVhdGguIGRyb3BFUSA9IEVRVUlQTUVOVF9TSVpFID0gZHJvcCBhbGwgZXF1aXBtZW50XHJcblx0XHR0aGlzLnRpbGVzID0gZGF0YS50aWxlcztcclxuXHRcdHRoaXMuaXNXYWxsID0gZGF0YS5pc1dhbGw7XHJcblx0XHR0aGlzLmlzSG9zdGlsZSA9IGRhdGEuaXNIb3N0aWxlO1xyXG5cdFx0dGhpcy5kYW1hZ2UgPSBkYXRhLmRhbWFnZTtcclxuXHRcdHRoaXMud2FycE1hcCA9IGRhdGEud2FycE1hcDtcclxuXHRcdHRoaXMud2FycFggPSBkYXRhLndhcnBYO1xyXG5cdFx0dGhpcy53YXJwWSA9IGRhdGEud2FycFk7XHJcblx0fVxyXG5cdFxyXG5cdHVwbG9hZChkYXRhKSB7XHJcblx0XHRpZiAoZGF0YS5uYW1lICE9IG51bGwpIHRoaXMubmFtZSA9IGRhdGEubmFtZTtcclxuXHRcdGlmIChkYXRhLmRyb3BDaGFuY2UgIT0gbnVsbCkgdGhpcy5kcm9wQ2hhbmNlID0gZGF0YS5kcm9wQ2hhbmNlO1xyXG5cdFx0aWYgKGRhdGEuZHJvcEFtb3VudEVRICE9IG51bGwpIHRoaXMuZHJvcEFtb3VudEVRID0gZGF0YS5kcm9wQW1vdW50RVE7XHJcblx0XHRpZiAoZGF0YS50aWxlcykgdGhpcy50aWxlcyA9IGRhdGEudGlsZXM7XHJcblx0XHRpZiAoZGF0YS5pc1dhbGwpIHRoaXMuaXNXYWxsID0gZGF0YS5pc1dhbGw7XHJcblx0XHRpZiAoZGF0YS5pc0hvc3RpbGUpIHRoaXMuaXNIb3N0aWxlID0gZGF0YS5pc0hvc3RpbGU7XHJcblx0XHRpZiAoZGF0YS5kYW1hZ2UpIHRoaXMuZGFtYWdlID0gZGF0YS5kYW1hZ2U7XHJcblx0XHRpZiAoZGF0YS53YXJwTWFwKSB0aGlzLndhcnBNYXAgPSBkYXRhLndhcnBNYXA7XHJcblx0XHRpZiAoZGF0YS53YXJwWCkgdGhpcy53YXJwWCA9IGRhdGEud2FycFg7XHJcblx0XHRpZiAoZGF0YS53YXJwWSkgdGhpcy53YXJwWSA9IGRhdGEud2FycFk7XHJcblx0fVxyXG5cclxuXHRnZXRQYWNrKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0bWFwSWQ6IHRoaXMubWFwSWQsXHJcblx0XHRcdG5hbWU6IHRoaXMubmFtZSxcclxuXHRcdFx0ZHJvcENoYW5jZTogdGhpcy5kcm9wQ2hhbmNlLFxyXG5cdFx0XHRkcm9wQW1vdW50RVE6IHRoaXMuZHJvcEFtb3VudEVRLFxyXG5cdFx0XHR0aWxlczogdGhpcy50aWxlcyxcclxuXHRcdFx0aXNXYWxsOiB0aGlzLmlzV2FsbCxcclxuXHRcdFx0aXNIb3N0aWxlOiB0aGlzLmlzSG9zdGlsZSxcclxuXHRcdFx0ZGFtYWdlOiB0aGlzLmRhbWFnZSxcclxuXHRcdFx0d2FycE1hcDogdGhpcy53YXJwTWFwLFxyXG5cdFx0XHR3YXJwWDogdGhpcy53YXJwWCxcclxuXHRcdFx0d2FycFk6IHRoaXMud2FycFlcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHRnZXRVcGRhdGVQYWNrKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0bWFwSWQ6IHRoaXMubWFwSWQsXHJcblx0XHRcdG5hbWU6IHRoaXMubmFtZSxcclxuXHRcdFx0dGlsZXM6IHRoaXMudGlsZXNcclxuXHRcdH07XHJcblx0fVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIE1lc3NhZ2Uge1xyXG5cdGNvbnN0cnVjdG9yKHNlbmRlcklkLCBtZXNzYWdlLCB0eXBlLCBtYXBJZCwgaWQsIGNvbG91cikge1xyXG5cdFx0dGhpcy5zZW5kZXJJZCA9IHNlbmRlcklkOyAvLyBudWxsID0gc2VydmVyXHJcblx0XHR0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xyXG5cdFx0dGhpcy50eXBlID0gdHlwZTtcclxuXHRcdHRoaXMubWFwSWQgPSBtYXBJZDtcclxuXHRcdHRoaXMuaWQgPSBpZDtcclxuXHRcdHRoaXMuY29sb3VyID0gY29sb3VyO1xyXG5cdH1cclxufSIsImltcG9ydCBnYW1lIGZyb20gJy4uL2dhbWUuanMnO1xyXG5pbXBvcnQgY29uZmlnIGZyb20gJy4uL2NvbmZpZy5qcyc7XHJcbmltcG9ydCB1dGlsIGZyb20gJy4uL3V0aWwuanMnO1xyXG5pbXBvcnQgQWN0b3IgZnJvbSAnLi9hY3Rvci5qcyc7XHJcblxyXG4vLyBBIFBsYXllciBpcyBhbiBpbW1vcnRhbCBBY3RvciB3aGljaCB0YWtlcyBpbnB1dCBmcm9tIGEgY2xpZW50XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF5ZXIgZXh0ZW5kcyBBY3RvciB7XHJcblx0Y29uc3RydWN0b3Ioc29ja2V0SWQsIGRhdGEpIHtcclxuXHRcdGlmIChkYXRhLnNwcml0ZSA9PSBudWxsKSBkYXRhLnNwcml0ZSA9IGRhdGEudGVtcGxhdGUuc3ByaXRlO1xyXG5cclxuXHRcdHN1cGVyKGRhdGEubWFwSWQsIGRhdGEueCwgZGF0YS55LCBkYXRhLmRpcmVjdGlvbiwgZGF0YS5uYW1lLCBkYXRhLnNwcml0ZSk7XHJcblx0XHR0aGlzLnBsYXllcklkID0gZGF0YS5faWQ7XHJcblx0XHR0aGlzLnNvY2tldElkID0gc29ja2V0SWQ7XHJcblx0XHR0aGlzLmFjY291bnRJZCA9IGRhdGEuYWNjb3VudDtcclxuXHRcdHRoaXMuYWRtaW5BY2Nlc3MgPSBkYXRhLmFkbWluQWNjZXNzO1xyXG5cclxuXHRcdHRoaXMubGV2ZWwgPSBkYXRhLmxldmVsO1xyXG5cdFx0dGhpcy5leHBlcmllbmNlID0gZGF0YS5leHBlcmllbmNlO1xyXG5cdFx0dGhpcy50ZW1wbGF0ZUlkID0gZGF0YS50ZW1wbGF0ZS5faWQ7XHJcblx0XHR0aGlzLnRlbXBsYXRlID0gZGF0YS50ZW1wbGF0ZS5uYW1lO1xyXG5cdFx0dGhpcy5jYWxjQmFzZVN0YXRzKGRhdGEudGVtcGxhdGUpO1xyXG5cdFx0dGhpcy5jYWxjQm9udXNTdGF0cygpO1xyXG5cdFx0dGhpcy5yZXN0b3JlKCk7XHJcblxyXG5cdFx0dGhpcy5pc0RlYWQgPSBmYWxzZTtcclxuXHRcdHRoaXMuZGVhdGhzID0gMDtcclxuXHRcdHRoaXMucmVzcGF3blRpbWVyID0gMDtcclxuXHRcdHRoaXMucmVzcGF3blNwZWVkID0gMTA7XHJcblx0XHR0aGlzLnJlc3Bhd25NYXAgPSBkYXRhLm1hcElkO1xyXG5cdFx0dGhpcy5yZXNwYXduWCA9IGRhdGEueDtcclxuXHRcdHRoaXMucmVzcGF3blkgPSBkYXRhLnk7XHJcblxyXG5cdFx0dGhpcy5pbnB1dCA9IHtcclxuXHRcdFx0ZGlyZWN0aW9uOiBudWxsLFxyXG5cdFx0XHRydW46IGZhbHNlLFxyXG5cdFx0XHRwaWNrdXA6IGZhbHNlLFxyXG5cdFx0XHRhdHRhY2s6IGZhbHNlXHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuZ2FtZUlkID0gdXRpbC5maXJzdEVtcHR5SW5kZXgoZ2FtZS5wbGF5ZXJzKTtcclxuXHRcdGdhbWUucGxheWVyc1t0aGlzLmdhbWVJZF0gPSB0aGlzO1xyXG5cdH1cclxuXHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHRzdXBlci51cGRhdGUoZGVsdGEpO1x0XHQvLyBEZWZhdWx0IEFjdG9yIFVwZGF0ZVxyXG5cdFx0aWYgKHRoaXMuaXNEZWFkKSB7XHJcblx0XHRcdC8vIFJlc3Bhd25pbmdcclxuXHRcdFx0dGhpcy5yZXNwYXduVGltZXIgKz0gZGVsdGE7XHJcblx0XHRcdGlmICh0aGlzLnJlc3Bhd25UaW1lciA+PSB0aGlzLnJlc3Bhd25TcGVlZCkgdGhpcy5yZXNwYXduKCk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Ly8gQ2hlY2sgZm9yIEF0dGFjayBJbnB1dFxyXG5cdFx0XHRpZiAodGhpcy5pbnB1dC5hdHRhY2sgJiYgdGhpcy5hdHRhY2tUaW1lciA9PT0gMCkgdGhpcy5hdHRhY2soKTtcclxuXHRcdFx0XHJcblx0XHRcdC8vIENoZWNrIGZvciBNb3ZlbWVudCBJbnB1dFxyXG5cdFx0XHRpZiAoIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHR0aGlzLmlzUnVubmluZyA9IGZhbHNlO1xyXG5cdFx0XHRcdGlmICh0aGlzLmlucHV0LmRpcmVjdGlvbikge1xyXG5cdFx0XHRcdFx0Ly8gQ2hlY2sgZm9yIFJ1biBJbnB1dFxyXG5cdFx0XHRcdFx0aWYgKHRoaXMuaW5wdXQucnVuICYmIHRoaXMuZW5lcmd5ID4gMCkgdGhpcy5pc1J1bm5pbmcgPSB0cnVlO1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKHRoaXMuaW5wdXQuZGlyZWN0aW9uKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIHRoaXMuZ2V0R2FtZVBhY2soKTtcclxuXHR9XHJcblx0XHJcblx0Z2V0R2FtZVBhY2soKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRnYW1lSWQ6IHRoaXMuZ2FtZUlkLFxyXG5cdFx0XHRuYW1lOiB0aGlzLm5hbWUsXHJcblx0XHRcdGRlc2NyaXB0aW9uOiB0aGlzLmRlc2NyaXB0aW9uLFxyXG5cdFx0XHRzcHJpdGU6IHRoaXMuc3ByaXRlLFxyXG5cdFx0XHRkaXJlY3Rpb246IHRoaXMuZGlyZWN0aW9uLFxyXG5cdFx0XHRtYXBJZDogdGhpcy5tYXBJZCxcclxuXHRcdFx0eDogdGhpcy5zdGFydFgsXHJcblx0XHRcdHk6IHRoaXMuc3RhcnRZLFxyXG5cdFx0XHR6OiB0aGlzLnosXHJcblx0XHRcdGRlc3RpbmF0aW9uWDogdGhpcy5kZXN0aW5hdGlvblgsXHJcblx0XHRcdGRlc3RpbmF0aW9uWTogdGhpcy5kZXN0aW5hdGlvblksXHJcblx0XHRcdGxlcnA6IHRoaXMubGVycCxcclxuXHRcdFx0aXNSdW5uaW5nOiB0aGlzLmlzUnVubmluZyxcclxuXHRcdFx0aXNBdHRhY2tpbmc6IHRoaXMuaXNBdHRhY2tpbmcsXHJcblx0XHRcdGlzRGVhZDogdGhpcy5pc0RlYWQsXHJcblx0XHRcdGlzVmlzaWJsZTogdGhpcy5pc1Zpc2libGVcclxuXHRcdH07XHJcblx0fVxyXG5cdFxyXG5cdGdldFVJUGFjaygpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGxldmVsOiB0aGlzLmxldmVsLFxyXG5cdFx0XHRleHBlcmllbmNlOiB0aGlzLmV4cGVyaWVuY2UsXHJcblx0XHRcdGhlYWx0aDogdGhpcy5oZWFsdGgsXHJcblx0XHRcdGhlYWx0aE1heDogdGhpcy5oZWFsdGhNYXgsXHJcblx0XHRcdGVuZXJneTogdGhpcy5lbmVyZ3ksXHJcblx0XHRcdGVuZXJneU1heDogdGhpcy5lbmVyZ3lNYXgsXHJcblx0XHRcdG1vdmVTcGVlZDogdGhpcy5tb3ZlU3BlZWQsXHJcblx0XHRcdGF0dGFja1NwZWVkOiB0aGlzLmF0dGFja1NwZWVkLFxyXG5cdFx0XHRhdHRhY2tUaW1lcjogdGhpcy5hdHRhY2tUaW1lcixcclxuXHRcdFx0aW52ZW50b3J5OiB0aGlzLmdldEludmVudG9yeVBhY2soKVxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdGdldERCUGFjaygpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdG5hbWU6IHRoaXMubmFtZSxcclxuXHRcdFx0YWNjb3VudDogdGhpcy5hY2NvdW50SWQsXHJcblx0XHRcdHRlbXBsYXRlOiB0aGlzLnRlbXBsYXRlSWQsXHJcblx0XHRcdGxldmVsOiB0aGlzLmxldmVsLFxyXG5cdFx0XHRleHBlcmllbmNlOiB0aGlzLmV4cGVyaWVuY2UsXHJcblx0XHRcdG1hcElkOiB0aGlzLm1hcElkLFxyXG5cdFx0XHR4OiB0aGlzLngsXHJcblx0XHRcdHk6IHRoaXMueSxcclxuXHRcdFx0ZGlyZWN0aW9uOiB0aGlzLmRpcmVjdGlvbixcclxuXHRcdFx0YWRtaW5BY2Nlc3M6IHRoaXMuYWRtaW5BY2Nlc3MsXHJcblx0XHRcdHNwcml0ZTogdGhpcy5zcHJpdGVcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGlucHV0RGF0YShkYXRhKSB7XHJcblx0XHRpZiAodGhpcy5pc0RlYWQpIHtcclxuXHRcdFx0Z2FtZS5zZW5kR2FtZUluZm9QbGF5ZXIodGhpcy5nYW1lSWQsIFwiWW91IGFyZSBkZWFkLlwiKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChnYW1lLmdvZENvbW1hbmRzW2RhdGEuaW5wdXRdKSB7XHJcblx0XHRcdGlmICh0aGlzLmFkbWluQWNjZXNzID4gMCkgZ2FtZS5nb2RDb21tYW5kc1tkYXRhLmlucHV0XShkYXRhLCB0aGlzKTtcclxuXHRcdFx0ZWxzZSBnYW1lLnNlbmRHYW1lSW5mb1BsYXllcih0aGlzLmdhbWVJZCwgXCJZb3UgZG9uJ3QgaGF2ZSBhY2Nlc3MgdG8gdGhhdCBjb21tYW5kLlwiKTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRpZiAoZ2FtZS5jb21tYW5kc1tkYXRhLmlucHV0XSkgZ2FtZS5jb21tYW5kc1tkYXRhLmlucHV0XShkYXRhLCB0aGlzKTtcclxuXHRcdFx0ZWxzZSBnYW1lLnNlbmRHYW1lSW5mb1BsYXllcih0aGlzLmdhbWVJZCwgXCJJbnZhbGlkIGNvbW1hbmQuXCIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cGlja1VwKCkge1xyXG5cdFx0aWYgKHN1cGVyLnBpY2tVcCgpID09PSBmYWxzZSkgZ2FtZS5zZW5kR2FtZUluZm9QbGF5ZXIodGhpcy5nYW1lSWQsIFwiWW91ciBpbnZlbnRvcnkgaXMgZnVsbC5cIik7XHJcblx0fVxyXG5cdFxyXG5cdGdldEludmVudG9yeSgpIHtcclxuXHRcdGNvbnN0IGludmVudG9yeSA9IGdhbWUuaXRlbXMuZmlsdGVyKGl0ZW0gPT4ge1xyXG5cdFx0XHRyZXR1cm4gXCJcIitpdGVtLnBsYXllcklkID09PSBcIlwiK3RoaXMucGxheWVySWQ7XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBpbnZlbnRvcnk7XHJcblx0fVxyXG5cclxuXHRzZXREZWFkKCkge1xyXG5cdFx0c3VwZXIuc2V0RGVhZCgpO1xyXG5cdFx0dGhpcy5pc0RlYWQgPSB0cnVlO1xyXG5cdFx0dGhpcy5oZWFsdGggPSAwO1xyXG5cdFx0dGhpcy5lbmVyZ3kgPSAwO1xyXG5cdFx0dGhpcy5kZWF0aHMrKztcclxuXHR9XHJcblxyXG5cdHJlc3Bhd24oKSB7XHJcblx0XHR0aGlzLm1hcElkID0gdGhpcy5yZXNwYXduTWFwO1xyXG5cdFx0dGhpcy54ID0gdGhpcy5yZXNwYXduWDtcclxuXHRcdHRoaXMueSA9IHRoaXMucmVzcGF3blk7XHJcblx0XHR0aGlzLnN0YXJ0WCA9IHRoaXMucmVzcGF3blg7XHJcblx0XHR0aGlzLnN0YXJ0WSA9IHRoaXMucmVzcGF3blk7XHJcblx0XHR0aGlzLmRlc3RpbmF0aW9uWCA9IHRoaXMucmVzcGF3blg7XHJcblx0XHR0aGlzLmRlc3RpbmF0aW9uWSA9IHRoaXMucmVzcGF3blk7XHJcblx0XHRcclxuXHRcdHRoaXMuY2FsY0JvbnVzU3RhdHMoKTtcclxuXHRcdHRoaXMucmVzdG9yZSgpO1xyXG5cdFx0XHJcblx0XHR0aGlzLmlzV2Fsa2luZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy5pc1J1bm5pbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMuaXNBdHRhY2tpbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMuaXNEZWFkID0gZmFsc2U7XHJcblx0XHR0aGlzLnJlc3Bhd25UaW1lciA9IDA7XHJcblx0XHRnYW1lLnNlbmRHYW1lSW5mb1BsYXllcih0aGlzLmdhbWVJZCwgXCJUaGUgQW5nZWwgb2YgTWVyY3kgcmVmdXNlcyB0byBsZXQgeW91IGRpZS5cIik7XHJcblx0fVxyXG5cclxuXHRnYWluRXhwZXJpZW5jZShleHBlcmllbmNlKSB7XHJcblx0XHRpZiAodGhpcy5leHBlcmllbmNlICsgZXhwZXJpZW5jZSA8PSAwKSB7XHJcblx0XHRcdHRoaXMuZXhwZXJpZW5jZSA9IDA7XHRcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuZXhwZXJpZW5jZSArPSBleHBlcmllbmNlO1xyXG5cdFx0aWYgKHRoaXMuZXhwZXJpZW5jZSA+PSBnYW1lLmV4cGVyaWVuY2VUb0xldmVsW3RoaXMubGV2ZWxdKSB7XHJcblx0XHRcdHRoaXMubGV2ZWxVcCgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0bGV2ZWxVcCgpIHtcclxuXHRcdGlmICh0aGlzLmxldmVsIDwgY29uZmlnLk1BWF9MRVZFTCkge1xyXG5cdFx0XHRjb25zdCByb2xsb3ZlckV4cGVyaWVuY2UgPSB0aGlzLmV4cGVyaWVuY2UgLSBnYW1lLmV4cGVyaWVuY2VUb0xldmVsW3RoaXMubGV2ZWxdO1xyXG5cdFx0XHR0aGlzLmV4cGVyaWVuY2UgPSAwO1xyXG5cdFx0XHR0aGlzLmxldmVsKys7XHJcblx0XHRcdHRoaXMuY2FsY0Jhc2VTdGF0cygpO1xyXG5cdFx0XHRnYW1lLnNlbmRHYW1lSW5mb1BsYXllcih0aGlzLmdhbWVJZCwgYExldmVsIHVwISBZb3UgYXJlIG5vdyBsZXZlbCAke3RoaXMubGV2ZWx9IWApO1xyXG5cdFx0XHR0aGlzLmdhaW5FeHBlcmllbmNlKHJvbGxvdmVyRXhwZXJpZW5jZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGNhbGNCYXNlU3RhdHModGVtcGxhdGUpIHtcclxuXHRcdGlmICghdGVtcGxhdGUpIHRlbXBsYXRlID0gZ2FtZS5wbGF5ZXJUZW1wbGF0ZXNbdGhpcy50ZW1wbGF0ZUlkXTtcclxuXHRcdHN1cGVyLmNhbGNCYXNlU3RhdHModGVtcGxhdGUpO1xyXG5cdH1cclxufVxyXG4iLCJpbXBvcnQgZ2FtZSBmcm9tICcuLi9nYW1lLmpzJztcclxuaW1wb3J0IHV0aWwgZnJvbSAnLi4vdXRpbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXh0IHtcclxuXHRjb25zdHJ1Y3RvcihtYXBJZCwgeCwgeSwgbWVzc2FnZSwgY29sb3VyID0gJyMwMDAwMDAnLCBkaXNwbGF5VGltZSA9IDIsIHZlbFggPSAwLCB2ZWxZID0gMCkge1xyXG5cdFx0dGhpcy5tYXBJZCA9IG1hcElkO1xyXG5cdFx0dGhpcy54ID0geDtcclxuXHRcdHRoaXMueSA9IHk7XHJcblx0XHR0aGlzLnZlbFggPSB2ZWxYO1xyXG5cdFx0dGhpcy52ZWxZID0gdmVsWTtcclxuXHRcdHRoaXMubGVycFggPSAwO1xyXG5cdFx0dGhpcy5sZXJwWSA9IDA7XHJcblxyXG5cdFx0dGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcclxuXHRcdHRoaXMuY29sb3VyID0gY29sb3VyO1xyXG5cdFx0dGhpcy5kaXNwbGF5VGltZSA9IGRpc3BsYXlUaW1lO1xyXG5cdFx0dGhpcy50aW1lciA9IDA7XHJcblxyXG5cdFx0dGhpcy5nYW1lSWQgPSB1dGlsLmZpcnN0RW1wdHlJbmRleChnYW1lLnRleHRzKTtcclxuXHRcdGdhbWUudGV4dHNbdGhpcy5nYW1lSWRdID0gdGhpcztcclxuXHR9XHJcblx0XHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHR0aGlzLnRpbWVyICs9IGRlbHRhO1xyXG5cdFx0aWYgKHRoaXMuZGlzcGxheVRpbWUgPiAwICYmIHRoaXMudGltZXIgPiB0aGlzLmRpc3BsYXlUaW1lKSB7XHJcblx0XHRcdHRoaXMucmVtb3ZlKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5sZXJwWCArPSBkZWx0YSAqIHRoaXMudmVsWDtcclxuXHRcdHRoaXMubGVycFkgKz0gZGVsdGEgKiB0aGlzLnZlbFk7XHJcblxyXG5cdFx0aWYgKHRoaXMubGVycFggPCAtMSkge1xyXG5cdFx0XHR0aGlzLmxlcnBYKys7XHJcblx0XHRcdHRoaXMueC0tO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAodGhpcy5sZXJwWCA+IDEpIHtcclxuXHRcdFx0dGhpcy5sZXJwWC0tO1xyXG5cdFx0XHR0aGlzLngrKztcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5sZXJwWSA8IC0xKSB7XHJcblx0XHRcdHRoaXMubGVycFkrKztcclxuXHRcdFx0dGhpcy55LS07XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmICh0aGlzLmxlcnBZID4gMSkge1xyXG5cdFx0XHR0aGlzLmxlcnBZLS07XHJcblx0XHRcdHRoaXMueSsrO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gdGhpcy5nZXRQYWNrKCk7XHJcblx0fVxyXG5cdFxyXG5cdGdldFBhY2soKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRnYW1lSWQ6IHRoaXMuZ2FtZUlkLFxyXG5cdFx0XHRtYXBJZDogdGhpcy5tYXBJZCxcclxuXHRcdFx0eDogdGhpcy54LFxyXG5cdFx0XHR5OiB0aGlzLnksXHJcblx0XHRcdGxlcnBYOiB0aGlzLmxlcnBYLFxyXG5cdFx0XHRsZXJwWTogdGhpcy5sZXJwWSxcclxuXHRcdFx0bWVzc2FnZTogdGhpcy5tZXNzYWdlLFxyXG5cdFx0XHRjb2xvdXI6IHRoaXMuY29sb3VyXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0cmVtb3ZlKCkge1xyXG5cdFx0ZGVsZXRlIGdhbWUudGV4dHNbdGhpcy5nYW1lSWRdO1xyXG5cdH1cclxufVxyXG4iLCJjb25zdCBjb25maWcgPSB7fTtcclxuXHJcbmNvbmZpZy5QT1JUID0gMjAwMDtcclxuY29uZmlnLkZSQU1FUkFURSA9IDEwMDAgLyA2MDtcclxuY29uZmlnLkJBQ0tVUF9USU1FID0gMTIwO1xyXG5cclxuY29uZmlnLk1BUF9MQVlFUlMgPSA2O1xyXG5jb25maWcuTUFQX0NPTFVNTlMgPSAxMjtcclxuY29uZmlnLk1BUF9ST1dTID0gMTI7XHJcblxyXG5jb25maWcuTUFYX01BUFMgPSAxMDtcclxuY29uZmlnLk1BWF9VU0VSUyA9IDEwMDtcclxuY29uZmlnLk1BWF9TUFJJVEVTID0gMTM7XHJcbmNvbmZpZy5NQVhfRUZGRUNUUyA9IDcxO1xyXG5jb25maWcuTUFYX0xFVkVMID0gMzA7XHJcblxyXG5jb25maWcuTUFYX0hFQUxUSF9CQVNFID0gMjAwO1xyXG5jb25maWcuTUFYX0hFQUxUSF9CT05VUyA9IDU1O1xyXG5jb25maWcuTUFYX0VORVJHWV9CQVNFID0gMjAwO1xyXG5jb25maWcuTUFYX0VORVJHWV9CT05VUyA9IDU1O1xyXG5cclxuY29uZmlnLklOVkVOVE9SWV9TSVpFID0gMjA7XHJcbmNvbmZpZy5FUVVJUE1FTlRfU0laRSA9IDU7XHJcblxyXG5jb25maWcuSVRFTV9UWVBFUyA9IFtcclxuICB7bmFtZTogXCJOb3JtYWxcIiwgZXF1aXBwZWRTbG90OiBudWxsLCBzdGFja2FibGU6IGZhbHNlfSxcclxuICB7bmFtZTogXCJTdGFja2luZ1wiLCBlcXVpcHBlZFNsb3Q6IG51bGwsIHN0YWNrYWJsZTogdHJ1ZX0sXHJcbiAge25hbWU6IFwiV2VhcG9uXCIsIGVxdWlwcGVkU2xvdDogMCwgc3RhY2thYmxlOiBmYWxzZX0sXHJcbiAge25hbWU6IFwiU2hpZWxkXCIsIGVxdWlwcGVkU2xvdDogMSwgc3RhY2thYmxlOiBmYWxzZX0sXHJcbiAge25hbWU6IFwiQXJtb3VyXCIsIGVxdWlwcGVkU2xvdDogMiwgc3RhY2thYmxlOiBmYWxzZX0sXHJcbiAge25hbWU6IFwiSGVsbWV0XCIsIGVxdWlwcGVkU2xvdDogMywgc3RhY2thYmxlOiBmYWxzZX0sXHJcbiAge25hbWU6IFwiUmluZ1wiLCBlcXVpcHBlZFNsb3Q6IDQsIHN0YWNrYWJsZTogZmFsc2V9XHJcbl07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjb25maWc7XHJcbiIsImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XHJcbmltcG9ydCBiY3J5cHQgZnJvbSAnYmNyeXB0JztcclxuaW1wb3J0IGZzIGZyb20gJ2ZzJztcclxuXHJcbmltcG9ydCB1dGlsIGZyb20gXCIuL3V0aWwuanNcIjtcclxuaW1wb3J0IEFjY291bnQgZnJvbSAnLi9tb2RlbHMvYWNjb3VudC5qcyc7XHJcbmltcG9ydCBQbGF5ZXIgZnJvbSAnLi9tb2RlbHMvcGxheWVyLmpzJztcclxuaW1wb3J0IFBsYXllclRlbXBsYXRlIGZyb20gJy4vbW9kZWxzL3BsYXllclRlbXBsYXRlLmpzJztcclxuaW1wb3J0IEJvdCBmcm9tICcuL21vZGVscy9ib3QuanMnO1xyXG5pbXBvcnQgQm90VGVtcGxhdGUgZnJvbSAnLi9tb2RlbHMvYm90VGVtcGxhdGUuanMnO1xyXG5pbXBvcnQgSXRlbSBmcm9tICcuL21vZGVscy9pdGVtLmpzJztcclxuaW1wb3J0IEl0ZW1UZW1wbGF0ZSBmcm9tICcuL21vZGVscy9pdGVtVGVtcGxhdGUuanMnO1xyXG5pbXBvcnQgSXRlbVR5cGUgZnJvbSAnLi9tb2RlbHMvaXRlbVR5cGUuanMnO1xyXG5pbXBvcnQgTWFwIGZyb20gJy4vbW9kZWxzL21hcC5qcyc7XHJcblxyXG5jb25zdCBmc3AgPSBmcy5wcm9taXNlcztcclxubW9uZ29vc2UuUHJvbWlzZSA9IFByb21pc2U7XHJcbm1vbmdvb3NlLmNvbm5lY3QoJ21vbmdvZGI6Ly9sb2NhbGhvc3Qvb2R5c3NleScsIHt1c2VOZXdVcmxQYXJzZXI6IHRydWV9KTtcclxuXHJcbmNsYXNzIERhdGFiYXNlIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHRoaXMuc2VydmVyTG9nID0gW107XHJcblx0fVxyXG5cclxuXHRhc3luYyBiYWNrdXAoZGF0YSA9IHt9KSB7XHJcblx0XHQvL1RPRE8gc2F2ZSBldmVyeXRoaW5nXHJcblx0XHQvLyBjb25zdCBtYXBzID0gc2F2ZS1hbGwtbWFwc1xyXG5cdFx0bGV0IHBsYXllcnMgPSB0aGlzLnNhdmVPbmxpbmVQbGF5ZXJzKGRhdGEucGxheWVycyk7XHJcblx0XHRjb25zdCBib3RzID0gdGhpcy5zYXZlQWxsQm90cyhkYXRhLmJvdHMpO1xyXG5cdFx0bGV0IGl0ZW1zID0gdGhpcy5zYXZlQWxsSXRlbXMoZGF0YS5pdGVtcyk7XHJcblx0XHRsZXQgbG9nU2F2ZWQgPSB0aGlzLnNhdmVMb2coKTtcclxuXHRcdFByb21pc2UuYWxsKFtwbGF5ZXJzLCBib3RzLCBpdGVtcywgbG9nU2F2ZWRdKVxyXG5cdFx0LnRoZW4oKCkgPT4gdGhpcy5sb2coXCJHYW1lIHNhdmVkIHRvIGRpc2suXCIpKTtcclxuXHR9XHJcblx0XHJcblx0bG9nKG1lc3NhZ2UpIHtcclxuXHRcdGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG5cdFx0Y29uc29sZS5sb2codXRpbC50aW1lc3RhbXAoZGF0ZSkgKyBcIiAtIFwiICsgbWVzc2FnZSk7XHJcblx0XHR0aGlzLnNlcnZlckxvZy5wdXNoKHtcclxuXHRcdFx0bWVzc2FnZSxcclxuXHRcdFx0ZGF0ZVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cdGFzeW5jIHNhdmVMb2coKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRjb25zdCBzYXZlZExvZyA9IGF3YWl0IGZzcC5yZWFkRmlsZSgnLi9zZXJ2ZXIvbG9nLmpzb24nKTtcclxuXHRcdFx0Y29uc3QgbmV3TG9nID0gSlNPTi5wYXJzZShzYXZlZExvZykuY29uY2F0KHRoaXMuc2VydmVyTG9nKTtcclxuXHRcdFx0dGhpcy5zZXJ2ZXJMb2cgPSBbXTtcclxuXHRcdFx0YXdhaXQgZnNwLndyaXRlRmlsZSgnLi9zZXJ2ZXIvbG9nLmpzb24nLCBKU09OLnN0cmluZ2lmeShuZXdMb2cpKTtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRjYXRjaChlcnIpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRhc3luYyBjbGVhckxvZygpIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHRoaXMuc2VydmVyTG9nID0gW107XHJcblx0XHRcdGF3YWl0IGZzcC53cml0ZUZpbGUoJy4vc2VydmVyL2xvZy5qc29uJywgXCJbXVwiKTtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRjYXRjaCAoZXJyKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGdlbmVyYXRlSWQoKSB7XHJcblx0XHRyZXR1cm4gbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkO1xyXG5cdH1cclxuXHRhc3luYyBoYXNoUGFzc3dvcmQocGFzc3dvcmQpIHtcclxuXHRcdHJldHVybiBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblx0XHRcdGJjcnlwdC5oYXNoKHBhc3N3b3JkLCAxMCwgKGVyciwgaGFzaCkgPT4ge1xyXG5cdFx0XHRcdGlmIChlcnIpIHJlamVjdChlcnIpO1xyXG5cdFx0XHRcdGVsc2UgcmVzb2x2ZShoYXNoKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0YXN5bmMgY29tcGFyZVBhc3N3b3JkKHBhc3N3b3JkLCBoYXNoZWRQYXNzd29yZCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0YmNyeXB0LmNvbXBhcmUocGFzc3dvcmQsIGhhc2hlZFBhc3N3b3JkLCAoZXJyLCBtYXRjaCkgPT4ge1xyXG5cdFx0XHRcdGlmIChlcnIpIHJlamVjdChlcnIpO1xyXG5cdFx0XHRcdGVsc2UgcmVzb2x2ZShtYXRjaCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdGFzeW5jIGF1dGhBY2NvdW50KHVzZXJuYW1lLCBwYXNzd29yZCkge1xyXG5cdFx0bGV0IGFjY291bnQgPSBhd2FpdCBBY2NvdW50LmZpbmRPbmUoe3VzZXJuYW1lOiB1c2VybmFtZX0pLmV4ZWMoKTtcclxuXHRcdGlmICghYWNjb3VudCkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gdGhpcy5jb21wYXJlUGFzc3dvcmQocGFzc3dvcmQsIGFjY291bnQucGFzc3dvcmQpO1xyXG5cdH1cclxuXHJcblx0YXN5bmMgYWRkQWNjb3VudCh1c2VybmFtZSwgcGFzc3dvcmQsIGVtYWlsKSB7XHJcblx0XHRsZXQgYWRtaW4gPSBmYWxzZTtcclxuXHRcdGxldCBhY2NvdW50cyA9IGF3YWl0IHRoaXMuZ2V0QWxsQWNjb3VudHMoKTtcclxuXHRcdGlmIChhY2NvdW50cy5sZW5ndGggPT09IDApIHtcclxuXHRcdFx0YWRtaW4gPSB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGxldCBleGlzdGluZ0FjY291bnQgPSBhY2NvdW50cy5maW5kKGFjY291bnQgPT4gYWNjb3VudC51c2VybmFtZSA9PT0gdXNlcm5hbWUpXHJcblx0XHRcdGlmIChleGlzdGluZ0FjY291bnQpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhgQWNjb3VudCBhbHJlYWR5IGV4aXN0cyB3aXRoIHVzZXJuYW1lICR7dXNlcm5hbWV9LmApO1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IGhhc2hlZFBhc3N3b3JkID0gYXdhaXQgdGhpcy5oYXNoUGFzc3dvcmQocGFzc3dvcmQpO1xyXG5cdFx0YWNjb3VudCA9IG5ldyBBY2NvdW50KHtcclxuXHRcdFx0X2lkOiBuZXcgbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQsXHJcblx0XHRcdHVzZXJuYW1lLFxyXG5cdFx0XHRwYXNzd29yZDogaGFzaGVkUGFzc3dvcmQsXHJcblx0XHRcdGVtYWlsLFxyXG5cdFx0XHR2ZXJpZmllZDogZmFsc2UsXHJcblx0XHRcdGFkbWluXHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gYXdhaXQgYWNjb3VudC5zYXZlKClcclxuXHRcdC50aGVuKHJlc3VsdCA9PiBhY2NvdW50Ll9pZClcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIGdldEFjY291bnQoYWNjb3VudElkKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgQWNjb3VudC5maW5kQnlJZChhY2NvdW50SWQpXHJcblx0XHQuc2VsZWN0KCdfaWQgdXNlcm5hbWUgcGFzc3dvcmQgZW1haWwgdmVyaWZpZWQgYWRtaW4nKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4oYWNjb3VudCA9PiBhY2NvdW50KVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgZ2V0QWNjb3VudEJ5VXNlcm5hbWUodXNlcm5hbWUpIHtcclxuXHRcdHJldHVybiBhd2FpdCBBY2NvdW50LmZpbmRPbmUoe3VzZXJuYW1lOiB1c2VybmFtZX0pXHJcblx0XHQuc2VsZWN0KCdfaWQgdXNlcm5hbWUgcGFzc3dvcmQgZW1haWwgdmVyaWZpZWQgYWRtaW4nKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4oYWNjb3VudCA9PiBhY2NvdW50KVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgZ2V0QWNjb3VudElkKHVzZXJuYW1lKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgQWNjb3VudC5maW5kT25lKHt1c2VybmFtZTogdXNlcm5hbWV9KVxyXG5cdFx0LnNlbGVjdCgnX2lkJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKGFjY291bnQgPT4ge1xyXG5cdFx0XHRpZiAoYWNjb3VudCkge1xyXG5cdFx0XHRcdHJldHVybiBhY2NvdW50Ll9pZDtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIGdldEFsbEFjY291bnRzKCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IEFjY291bnQuZmluZCh7fSlcclxuXHRcdC5zZWxlY3QoJ19pZCB1c2VybmFtZSBwYXNzd29yZCBlbWFpbCB2ZXJpZmllZCBhZG1pbicpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbihhY2NvdW50cyA9PiBhY2NvdW50cylcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIHNhdmVBY2NvdW50KGRhdGEpIHtcclxuXHRcdHJldHVybiBhd2FpdCBBY2NvdW50LnVwZGF0ZU9uZSh7dXNlcm5hbWU6IGRhdGEudXNlcm5hbWV9LCB7JHNldDogZGF0YX0pXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbihyZXN1bHQgPT4gdHJ1ZSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cclxuXHRhc3luYyBhZGRQbGF5ZXIoYWNjb3VudElkLCBuYW1lLCB0ZW1wbGF0ZUlkKSB7XHJcblx0XHRsZXQgYWNjb3VudCA9IGF3YWl0IHRoaXMuZ2V0QWNjb3VudChhY2NvdW50SWQpO1xyXG5cdFx0aWYgKCFhY2NvdW50KSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiQWNjb3VudCBkb2VzIG5vdCBleGlzdCB3aXRoIHRoYXQgaWQuXCIpO1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHRcdGxldCB0ZW1wbGF0ZSA9IGF3YWl0IHRoaXMuZ2V0UGxheWVyVGVtcGxhdGUodGVtcGxhdGVJZCk7XHJcblx0XHRpZiAoIXRlbXBsYXRlKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiUGxheWVyIFRlbXBsYXRlIGRvZXMgbm90IGV4aXN0IHdpdGggdGhhdCBpZC5cIik7XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fVxyXG5cdFx0bGV0IHBsYXllciA9IGF3YWl0IHRoaXMuZ2V0UGxheWVyQnlOYW1lKG5hbWUpO1xyXG5cdFx0aWYgKHBsYXllcikge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIlBsYXllciBhbHJlYWR5IGV4aXN0cyB3aXRoIHRoYXQgbmFtZS5cIik7XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fVxyXG5cclxuXHRcdHBsYXllciA9IG5ldyBQbGF5ZXIoe1xyXG5cdFx0XHRfaWQgOiBuZXcgbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQsXHJcblx0XHRcdG5hbWUsXHJcblx0XHRcdGFjY291bnQ6IGFjY291bnRJZCxcclxuXHRcdFx0dGVtcGxhdGU6IHRlbXBsYXRlSWRcclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBhd2FpdCBwbGF5ZXIuc2F2ZSgpXHJcblx0XHQudGhlbihyZXN1bHQgPT4gcGxheWVyLl9pZClcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIGdldFBsYXllcihwbGF5ZXJJZCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IFBsYXllci5maW5kQnlJZChwbGF5ZXJJZClcclxuXHRcdC5zZWxlY3QoJ19pZCBhY2NvdW50IG5hbWUgdGVtcGxhdGUgbGV2ZWwgZXhwZXJpZW5jZSBtYXBJZCB4IHkgZGlyZWN0aW9uIGFkbWluQWNjZXNzIHNwcml0ZScpXHJcblx0XHQucG9wdWxhdGUoJ3RlbXBsYXRlJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHBsYXllciA9PiBwbGF5ZXIpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBnZXRQbGF5ZXJCeU5hbWUobmFtZSkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IFBsYXllci5maW5kT25lKHtuYW1lOiBuYW1lfSlcclxuXHRcdC5zZWxlY3QoJ19pZCBhY2NvdW50IG5hbWUgdGVtcGxhdGUgbGV2ZWwgZXhwZXJpZW5jZSBtYXBJZCB4IHkgZGlyZWN0aW9uIGFkbWluQWNjZXNzIHNwcml0ZScpXHJcblx0XHQucG9wdWxhdGUoJ3RlbXBsYXRlJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHBsYXllciA9PiBwbGF5ZXIpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBnZXRQbGF5ZXJzQnlBY2NvdW50KGFjY291bnRJZCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IFBsYXllci5maW5kKHthY2NvdW50OiBhY2NvdW50SWR9KVxyXG5cdFx0LnNlbGVjdCgnX2lkIGFjY291bnQgbmFtZSB0ZW1wbGF0ZSBsZXZlbCBleHBlcmllbmNlIG1hcElkIHggeSBkaXJlY3Rpb24gYWRtaW5BY2Nlc3Mgc3ByaXRlJylcclxuXHRcdC5wb3B1bGF0ZSgndGVtcGxhdGUnKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4ocGxheWVycyA9PiBwbGF5ZXJzKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgc2F2ZVBsYXllcihkYXRhKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgUGxheWVyLnVwZGF0ZU9uZSh7bmFtZTogZGF0YS5uYW1lfSwgeyRzZXQ6IGRhdGF9KVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4ocmVzdWx0ID0+IHRydWUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRzYXZlT25saW5lUGxheWVycyhwbGF5ZXJzID0gW10pIHtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcGxheWVycy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRjb25zdCBwbGF5ZXIgPSBwbGF5ZXJzW2ldO1xyXG5cdFx0XHRpZiAoIXBsYXllcikgY29udGludWU7XHJcblx0XHRcdHRoaXMuc2F2ZVBsYXllcihwbGF5ZXIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0YXN5bmMgYWRkQm90KGRhdGEpIHtcclxuXHRcdGxldCB0ZW1wbGF0ZSA9IGF3YWl0IHRoaXMuZ2V0Qm90VGVtcGxhdGUoZGF0YS50ZW1wbGF0ZUlkKTtcclxuXHRcdGlmICghdGVtcGxhdGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJCb3QgVGVtcGxhdGUgZG9lcyBub3QgZXhpc3Qgd2l0aCB0aGF0IGlkLlwiKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBfaWQgPSBkYXRhLmJvdElkO1xyXG5cdFx0aWYgKCFfaWQpIF9pZCA9IG5ldyBtb25nb29zZS5UeXBlcy5PYmplY3RJZDtcclxuXHJcblx0XHRjb25zdCBib3QgPSBuZXcgQm90KHtcclxuXHRcdFx0X2lkLFxyXG5cdFx0XHR0ZW1wbGF0ZTogZGF0YS50ZW1wbGF0ZUlkLFxyXG5cdFx0XHRtYXBJZDogZGF0YS5tYXBJZCxcclxuXHRcdFx0eDogZGF0YS54LFxyXG5cdFx0XHR5OiBkYXRhLnksXHJcblx0XHRcdGRpcmVjdGlvbjogZGF0YS5kaXJlY3Rpb25cclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBhd2FpdCBib3Quc2F2ZSgpXHJcblx0XHQudGhlbihyZXN1bHQgPT4gdHJ1ZSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIGdldEJvdChib3RJZCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IEJvdC5maW5kT25lKHtfaWQ6IGJvdElkfSlcclxuXHRcdC5zZWxlY3QoJ19pZCB0ZW1wbGF0ZSBtYXBJZCB4IHkgZGlyZWN0aW9uJylcclxuXHRcdC5wb3B1bGF0ZSgndGVtcGxhdGUnKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4oYm90ID0+IGJvdClcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIHNhdmVCb3QoZGF0YSkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IEJvdC51cGRhdGVPbmUoe19pZDogZGF0YS5ib3RJZH0sIHskc2V0OiBkYXRhfSlcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHJlc3VsdCA9PiB0cnVlKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgZ2V0QWxsQm90cygpIHtcclxuXHRcdHJldHVybiBhd2FpdCBCb3QuZmluZCh7fSlcclxuXHRcdC5zZWxlY3QoJ19pZCB0ZW1wbGF0ZSBtYXBJZCB4IHkgZGlyZWN0aW9uJylcclxuXHRcdC5wb3B1bGF0ZSgndGVtcGxhdGUnKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4oYm90cyA9PiBib3RzKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgc2F2ZUFsbEJvdHMoY3VycmVudEJvdHMpIHtcclxuXHRcdGlmICghY3VycmVudEJvdHMpIHJldHVybjtcclxuXHJcblx0XHRsZXQgc2F2ZWRCb3RzID0gYXdhaXQgdGhpcy5nZXRBbGxCb3RzKCk7XHJcblx0XHRjb25zdCBuZXdCb3RzID0gY3VycmVudEJvdHMuZmlsdGVyKGJvdCA9PiAhc2F2ZWRCb3RzLmZpbmQoc2F2ZWRCb3QgPT4gc2F2ZWRCb3QuX2lkID09PSBib3QuYm90SWQpKTtcclxuXHRcdGNvbnN0IGV4aXN0aW5nQm90cyA9IGN1cnJlbnRCb3RzLmZpbHRlcihib3QgPT4gc2F2ZWRCb3RzLmZpbmQoc2F2ZWRCb3QgPT4gc2F2ZWRCb3QuX2lkID09PSBib3QuYm90SWQpKTtcclxuXHRcdGNvbnN0IGRlbGV0ZUJvdHMgPSBzYXZlZEJvdHMuZmlsdGVyKGJvdCA9PiAhZXhpc3RpbmdCb3RzLmZpbmQoZXhpc3RpbmdCb3QgPT4gZXhpc3RpbmdCb3QuYm90SWQgPT09IGJvdC5faWQpKTtcclxuXHRcdGNvbnN0IHVwZGF0ZUJvdHMgPSBleGlzdGluZ0JvdHMuZmlsdGVyKGJvdCA9PiAhZGVsZXRlQm90cy5pbmNsdWRlcyhib3QpKTtcclxuXHJcblx0XHQvLyBBZGQgbmV3IEJvdHNcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbmV3Qm90cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR0aGlzLmFkZEJvdChuZXdCb3RzW2ldKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBEZWxldGUgcmVtb3ZlZCBCb3RzXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGRlbGV0ZUJvdHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Qm90LmRlbGV0ZU9uZSh7X2lkOiBkZWxldGVCb3RzW2ldLl9pZH0sIGVyciA9PiB7XHJcblx0XHRcdFx0aWYgKGVycikgY29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gVXBkYXRlIHRoZSByZXN0XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHVwZGF0ZUJvdHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgYm90ID0gdXBkYXRlQm90c1tpXTtcclxuXHRcdFx0aWYgKCFib3QpIGNvbnRpbnVlO1xyXG5cdFx0XHR0aGlzLnNhdmVCb3QoYm90KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGFzeW5jIGdldE1hcChtYXBJZCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IE1hcC5maW5kT25lKHttYXBJZDogbWFwSWR9KVxyXG5cdFx0LnNlbGVjdCgnbWFwSWQgbmFtZSBkcm9wQ2hhbmNlIGRyb3BBbW91bnRFUSB0aWxlcyBpc1dhbGwgaXNIb3N0aWxlIGRhbWFnZSB3YXJwTWFwIHdhcnBYIHdhcnBZJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKG1hcCA9PiBtYXApXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBzYXZlTWFwKGRhdGEpIHtcclxuXHRcdHJldHVybiBhd2FpdCBNYXAudXBkYXRlT25lKHttYXBJZDogZGF0YS5tYXBJZH0sIHskc2V0OiBkYXRhfSwge3Vwc2VydDogdHJ1ZX0pXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbihyZXN1bHQgPT4gdHJ1ZSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIGdldEFsbE1hcHMoKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRyZXR1cm4gYXdhaXQgTWFwLmZpbmQoe30pXHJcblx0XHRcdC5zZWxlY3QoJ21hcElkIG5hbWUgZHJvcENoYW5jZSBkcm9wQW1vdW50RVEgdGlsZXMgaXNXYWxsIGlzSG9zdGlsZSBkYW1hZ2Ugd2FycE1hcCB3YXJwWCB3YXJwWScpXHJcblx0XHRcdC5leGVjKClcclxuXHRcdFx0LnRoZW4obWFwcyA9PiBtYXBzKVxyXG5cdFx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdFx0fVxyXG5cdFx0Y2F0Y2goZXJyKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRhc3luYyBhZGRQbGF5ZXJUZW1wbGF0ZShkYXRhKSB7XHJcblx0XHRpZiAoIWRhdGEubmFtZSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIk5hbWUgaXMgcmVxdWlyZWQuXCIpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGNoZWNrVGVtcGxhdGUgPSBhd2FpdCBQbGF5ZXJUZW1wbGF0ZS5maW5kT25lKHtuYW1lOiBkYXRhLm5hbWV9KVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4odGVtcGxhdGUgPT4gdGVtcGxhdGUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cclxuXHRcdGlmIChjaGVja1RlbXBsYXRlKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiVGVtcGxhdGUgYWxyZWFkeSBleGlzdHMgd2l0aCB0aGF0IG5hbWUuXCIpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgdGVtcGxhdGUgPSBuZXcgUGxheWVyVGVtcGxhdGUoe1xyXG5cdFx0XHRfaWQ6IG5ldyBtb25nb29zZS5UeXBlcy5PYmplY3RJZCxcclxuXHRcdFx0bmFtZTogZGF0YS5uYW1lLFxyXG5cdFx0XHRzcHJpdGU6IGRhdGEuc3ByaXRlLFxyXG5cdFx0XHRkYW1hZ2VCYXNlOiBkYXRhLmRhbWFnZUJhc2UsXHJcblx0XHRcdGRlZmVuY2VCYXNlOiBkYXRhLmRlZmVuY2VCYXNlLFxyXG5cdFx0XHRoZWFsdGhNYXhCYXNlOiBkYXRhLmhlYWx0aE1heEJhc2UsXHJcblx0XHRcdGVuZXJneU1heEJhc2U6IGRhdGEuZW5lcmd5TWF4QmFzZSxcclxuXHRcdFx0aGVhbHRoUmVnZW5CYXNlOiBkYXRhLmhlYWx0aFJlZ2VuQmFzZSxcclxuXHRcdFx0ZW5lcmd5UmVnZW5CYXNlOiBkYXRhLmVuZXJneVJlZ2VuQmFzZSxcclxuXHRcdFx0cmFuZ2VCYXNlOiBkYXRhLnJhbmdlQmFzZSxcclxuXHRcdFx0aGVhbHRoUGVyTGV2ZWw6IGRhdGEuaGVhbHRoUGVyTGV2ZWwsXHJcblx0XHRcdGVuZXJneVBlckxldmVsOiBkYXRhLmVuZXJneVBlckxldmVsXHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gYXdhaXQgdGVtcGxhdGUuc2F2ZSgpXHJcblx0XHQudGhlbihyZXN1bHQgPT4gdHJ1ZSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIGdldFBsYXllclRlbXBsYXRlKHRlbXBsYXRlSWQpIHtcclxuXHRcdHJldHVybiBhd2FpdCBQbGF5ZXJUZW1wbGF0ZS5maW5kQnlJZCh0ZW1wbGF0ZUlkKVxyXG5cdFx0LnNlbGVjdCgnbmFtZSBzcHJpdGUgZGFtYWdlQmFzZSBkZWZlbmNlQmFzZSBoZWFsdGhNYXhCYXNlIGVuZXJneU1heEJhc2UgaGVhbHRoUmVnZW5CYXNlIGVuZXJneVJlZ2VuQmFzZSByYW5nZUJhc2UgaGVhbHRoUGVyTGV2ZWwsIGVuZXJneVBlckxldmVsJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHRlbXBsYXRlID0+IHRlbXBsYXRlKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgZ2V0QWxsUGxheWVyVGVtcGxhdGVzKCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IFBsYXllclRlbXBsYXRlLmZpbmQoe30pXHJcblx0XHQuc2VsZWN0KCdfaWQgbmFtZSBzcHJpdGUgZGFtYWdlQmFzZSBkZWZlbmNlQmFzZSBoZWFsdGhNYXhCYXNlIGVuZXJneU1heEJhc2UgaGVhbHRoUmVnZW5CYXNlIGVuZXJneVJlZ2VuQmFzZSByYW5nZUJhc2UgaGVhbHRoUGVyTGV2ZWwsIGVuZXJneVBlckxldmVsJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHRlbXBsYXRlcyA9PiB0ZW1wbGF0ZXMpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHJcblx0YXN5bmMgYWRkQm90VGVtcGxhdGUoZGF0YSkge1xyXG5cdFx0Y29uc3QgdGVtcGxhdGUgPSBuZXcgQm90VGVtcGxhdGUoe1xyXG5cdFx0XHRfaWQ6IG5ldyBtb25nb29zZS5UeXBlcy5PYmplY3RJZCxcclxuXHRcdFx0bmFtZTogZGF0YS5uYW1lLFxyXG5cdFx0XHRzcHJpdGU6IGRhdGEuc3ByaXRlLFxyXG5cdFx0XHRkYW1hZ2VCYXNlOiBkYXRhLmRhbWFnZUJhc2UsXHJcblx0XHRcdGRlZmVuY2VCYXNlOiBkYXRhLmRlZmVuY2VCYXNlLFxyXG5cdFx0XHRoZWFsdGhNYXhCYXNlOiBkYXRhLmhlYWx0aE1heEJhc2UsXHJcblx0XHRcdGVuZXJneU1heEJhc2U6IGRhdGEuZW5lcmd5TWF4QmFzZSxcclxuXHRcdFx0aGVhbHRoUmVnZW5CYXNlOiBkYXRhLmhlYWx0aFJlZ2VuQmFzZSxcclxuXHRcdFx0ZW5lcmd5UmVnZW5CYXNlOiBkYXRhLmVuZXJneVJlZ2VuQmFzZSxcclxuXHRcdFx0cmFuZ2VCYXNlOiBkYXRhLnJhbmdlQmFzZSxcclxuXHRcdFx0aG9zdGlsZTogZGF0YS5ob3N0aWxlXHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gYXdhaXQgdGVtcGxhdGUuc2F2ZSgpXHJcblx0XHQudGhlbihyZXN1bHQgPT4gdHJ1ZSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIGdldEJvdFRlbXBsYXRlKHRlbXBsYXRlSWQpIHtcclxuXHRcdHJldHVybiBhd2FpdCBCb3RUZW1wbGF0ZS5maW5kQnlJZCh0ZW1wbGF0ZUlkKVxyXG5cdFx0LnNlbGVjdCgnX2lkIG5hbWUgc3ByaXRlIGRhbWFnZUJhc2UgZGVmZW5jZUJhc2UgaGVhbHRoTWF4QmFzZSBlbmVyZ3lNYXhCYXNlIGhlYWx0aFJlZ2VuQmFzZSBlbmVyZ3lSZWdlbkJhc2UgcmFuZ2VCYXNlIGhvc3RpbGUnKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4odGVtcGxhdGUgPT4gdGVtcGxhdGUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBnZXRBbGxCb3RUZW1wbGF0ZXMoKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgQm90VGVtcGxhdGUuZmluZCh7fSlcclxuXHRcdC5zZWxlY3QoJ19pZCBuYW1lIHNwcml0ZSBkYW1hZ2VCYXNlIGRlZmVuY2VCYXNlIGhlYWx0aE1heEJhc2UgZW5lcmd5TWF4QmFzZSBoZWFsdGhSZWdlbkJhc2UgZW5lcmd5UmVnZW5CYXNlIHJhbmdlQmFzZSBob3N0aWxlJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHRlbXBsYXRlcyA9PiB0ZW1wbGF0ZXMpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHJcblx0YXN5bmMgYWRkSXRlbVRlbXBsYXRlKGRhdGEpIHtcclxuXHRcdGNvbnN0IHRlbXBsYXRlID0gbmV3IEl0ZW1UZW1wbGF0ZSh7XHJcblx0XHRcdF9pZDogbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkLFxyXG5cdFx0XHRuYW1lOiBkYXRhLm5hbWUsXHJcblx0XHRcdHNwcml0ZTogZGF0YS5zcHJpdGUsXHJcblx0XHRcdHJldXNhYmxlOiBkYXRhLnJldXNhYmxlLFxyXG5cdFx0XHRpdGVtVHlwZTogZGF0YS5pdGVtVHlwZUlkLFxyXG5cdFx0XHRwYXNzaXZlRGFtYWdlOiBkYXRhLnBhc3NpdmVEYW1hZ2UsXHJcblx0XHRcdHBhc3NpdmVEZWZlbmNlOiBkYXRhLnBhc3NpdmVEZWZlbmNlLFxyXG5cdFx0XHRwYXNzaXZlSGVhbHRoTWF4OiBkYXRhLnBhc3NpdmVIZWFsdGhNYXgsXHJcblx0XHRcdHBhc3NpdmVFbmVyZ3lNYXg6IGRhdGEucGFzc2l2ZUVuZXJneU1heCxcclxuXHRcdFx0cGFzc2l2ZUhlYWx0aFJlZ2VuOiBkYXRhLnBhc3NpdmVIZWFsdGhSZWdlbixcclxuXHRcdFx0cGFzc2l2ZUVuZXJneVJlZ2VuOiBkYXRhLnBhc3NpdmVFbmVyZ3lSZWdlbixcclxuXHRcdFx0cGFzc2l2ZVJhbmdlOiBkYXRhLnBhc3NpdmVSYW5nZSxcclxuXHRcdFx0ZXF1aXBwZWREYW1hZ2U6IGRhdGEuZXF1aXBwZWREYW1hZ2UsXHJcblx0XHRcdGVxdWlwcGVkRGVmZW5jZTogZGF0YS5lcXVpcHBlZERlZmVuY2UsXHJcblx0XHRcdGVxdWlwcGVkSGVhbHRoTWF4OiBkYXRhLmVxdWlwcGVkSGVhbHRoTWF4LFxyXG5cdFx0XHRlcXVpcHBlZEVuZXJneU1heDogZGF0YS5lcXVpcHBlZEVuZXJneU1heCxcclxuXHRcdFx0ZXF1aXBwZWRIZWFsdGhSZWdlbjogZGF0YS5lcXVpcHBlZEhlYWx0aFJlZ2VuLFxyXG5cdFx0XHRlcXVpcHBlZEVuZXJneVJlZ2VuOiBkYXRhLmVxdWlwcGVkRW5lcmd5UmVnZW4sXHJcblx0XHRcdGVxdWlwcGVkUmFuZ2U6IGRhdGEuZXF1aXBwZWRSYW5nZVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIGF3YWl0IHRlbXBsYXRlLnNhdmUoKVxyXG5cdFx0LnRoZW4ocmVzdWx0ID0+IHRydWUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBnZXRJdGVtVGVtcGxhdGUodGVtcGxhdGVJZCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IEl0ZW1UZW1wbGF0ZS5maW5kQnlJZCh0ZW1wbGF0ZUlkKVxyXG5cdFx0LnNlbGVjdCgnbmFtZSBzcHJpdGUgcmV1c2FibGUgaXRlbVR5cGUgcGFzc2l2ZURhbWFnZSBwYXNzaXZlRGVmZW5jZSBwYXNzaXZlSGVhbHRoTWF4IHBhc3NpdmVFbmVyZ3lNYXhCYXNlIHBhc3NpdmVIZWFsdGhSZWdlbiBwYXNzaXZlRW5lcmd5UmVnZW4gcGFzc2l2ZVJhbmdlIGVxdWlwcGVkRGFtYWdlIGVxdWlwcGVkRGVmZW5jZSBlcXVpcHBlZEhlYWx0aE1heCBlcXVpcHBlZEVuZXJneU1heEJhc2UgZXF1aXBwZWRIZWFsdGhSZWdlbiBlcXVpcHBlZEVuZXJneVJlZ2VuIGVxdWlwcGVkUmFuZ2UnKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4odGVtcGxhdGUgPT4gdGVtcGxhdGUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBnZXRBbGxJdGVtVGVtcGxhdGVzKCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IEl0ZW1UZW1wbGF0ZS5maW5kKHt9KVxyXG5cdFx0LnNlbGVjdCgnX2lkIG5hbWUgc3ByaXRlIHJldXNhYmxlIGl0ZW1UeXBlIHBhc3NpdmVEYW1hZ2UgcGFzc2l2ZURlZmVuY2UgcGFzc2l2ZUhlYWx0aE1heCBwYXNzaXZlRW5lcmd5TWF4QmFzZSBwYXNzaXZlSGVhbHRoUmVnZW4gcGFzc2l2ZUVuZXJneVJlZ2VuIHBhc3NpdmVSYW5nZSBlcXVpcHBlZERhbWFnZSBlcXVpcHBlZERlZmVuY2UgZXF1aXBwZWRIZWFsdGhNYXggZXF1aXBwZWRFbmVyZ3lNYXhCYXNlIGVxdWlwcGVkSGVhbHRoUmVnZW4gZXF1aXBwZWRFbmVyZ3lSZWdlbiBlcXVpcHBlZFJhbmdlJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHRlbXBsYXRlcyA9PiB0ZW1wbGF0ZXMpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHJcblx0YXN5bmMgYWRkSXRlbShkYXRhKSB7XHJcblx0XHRsZXQgdGVtcGxhdGUgPSBhd2FpdCB0aGlzLmdldEl0ZW1UZW1wbGF0ZShkYXRhLnRlbXBsYXRlSWQpO1xyXG5cdFx0aWYgKCF0ZW1wbGF0ZSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIkl0ZW0gVGVtcGxhdGUgZG9lcyBub3QgZXhpc3Qgd2l0aCB0aGF0IGlkLlwiKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0bGV0IF9pZCA9IGRhdGEuaXRlbUlkO1xyXG5cdFx0aWYgKCFfaWQpIF9pZCA9IG5ldyBtb25nb29zZS5UeXBlcy5PYmplY3RJZDtcclxuXHJcblx0XHRjb25zdCBpdGVtID0gbmV3IEl0ZW0oe1xyXG5cdFx0XHRfaWQsXHJcblx0XHRcdHRlbXBsYXRlOiBkYXRhLnRlbXBsYXRlSWQsXHJcblx0XHRcdHN0YWNrOiBkYXRhLnN0YWNrLFxyXG5cdFx0XHRwbGF5ZXJJZDogZGF0YS5wbGF5ZXJJZCxcclxuXHRcdFx0Ym90SWQ6IGRhdGEuYm90SWQsXHJcblx0XHRcdHNsb3Q6IGRhdGEuc2xvdCxcclxuXHRcdFx0bWFwSWQ6IGRhdGEubWFwSWQsXHJcblx0XHRcdHg6IGRhdGEueCxcclxuXHRcdFx0eTogZGF0YS55LFxyXG5cdFx0XHRjcmVhdGVkQnk6IGRhdGEuY3JlYXRlZEJ5LFxyXG5cdFx0XHRjcmVhdGVkRGF0ZTogZGF0YS5jcmVhdGVkRGF0ZVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIGF3YWl0IGl0ZW0uc2F2ZSgpXHJcblx0XHQudGhlbihyZXN1bHQgPT4gdHJ1ZSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIHNhdmVJdGVtKGRhdGEpIHtcclxuXHRcdHJldHVybiBhd2FpdCBJdGVtLnVwZGF0ZU9uZSh7X2lkOiBkYXRhLml0ZW1JZH0sIHskc2V0OiBkYXRhfSwge3Vwc2VydDogdHJ1ZX0pXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbihyZXN1bHQgPT4gdHJ1ZSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIGdldEFsbEl0ZW1zKCkge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0cmV0dXJuIGF3YWl0IEl0ZW0uZmluZCh7fSlcclxuXHRcdFx0LnNlbGVjdCgnX2lkIHRlbXBsYXRlIHN0YWNrIHBsYXllcklkIGJvdElkIHNsb3QgbWFwSWQgeCB5IGNyZWF0ZWREYXRlIGNyZWF0ZWRCeScpXHJcblx0XHRcdC5wb3B1bGF0ZSgndGVtcGxhdGUnKVxyXG5cdFx0XHQuZXhlYygpXHJcblx0XHRcdC50aGVuKGl0ZW1zID0+IGl0ZW1zKVxyXG5cdFx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdFx0fVxyXG5cdFx0Y2F0Y2goZXJyKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHR9XHJcblx0fVxyXG5cdGFzeW5jIHNhdmVBbGxJdGVtcyhjdXJyZW50SXRlbXMpIHtcclxuXHRcdGlmICghY3VycmVudEl0ZW1zKSByZXR1cm47XHJcblxyXG5cdFx0bGV0IHNhdmVkSXRlbXMgPSBhd2FpdCB0aGlzLmdldEFsbEl0ZW1zKCk7XHJcblx0XHRjb25zdCBuZXdJdGVtcyA9IGN1cnJlbnRJdGVtcy5maWx0ZXIoaXRlbSA9PiAhc2F2ZWRJdGVtcy5maW5kKHNhdmVkSXRlbSA9PiBzYXZlZEl0ZW0uX2lkID09PSBpdGVtLml0ZW1JZCkpO1xyXG5cdFx0Y29uc3QgZXhpc3RpbmdJdGVtcyA9IGN1cnJlbnRJdGVtcy5maWx0ZXIoaXRlbSA9PiBzYXZlZEl0ZW1zLmZpbmQoc2F2ZWRJdGVtID0+IHNhdmVkSXRlbS5faWQgPT09IGl0ZW0uaXRlbUlkKSk7XHJcblx0XHRjb25zdCBkZWxldGVJdGVtcyA9IHNhdmVkSXRlbXMuZmlsdGVyKGl0ZW0gPT4gIWV4aXN0aW5nSXRlbXMuZmluZChleGlzdGluZ0l0ZW0gPT4gZXhpc3RpbmdJdGVtLml0ZW1JZCA9PT0gaXRlbS5faWQpKTtcclxuXHRcdGNvbnN0IHVwZGF0ZUl0ZW1zID0gZXhpc3RpbmdJdGVtcy5maWx0ZXIoaXRlbSA9PiAhZGVsZXRlSXRlbXMuaW5jbHVkZXMoaXRlbSkpO1xyXG5cdFx0XHJcblx0XHQvLyBBZGQgbmV3IEl0ZW1zXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IG5ld0l0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHRoaXMuYWRkSXRlbShuZXdJdGVtc1tpXSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gRGVsZXRlIHJlbW92ZWQgSXRlbXNcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgZGVsZXRlSXRlbXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0SXRlbS5kZWxldGVPbmUoe19pZDogZGVsZXRlSXRlbXNbaV0uX2lkfSwgZXJyID0+IHtcclxuXHRcdFx0XHRpZiAoZXJyKSBjb25zb2xlLmxvZyhlcnIpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBVcGRhdGUgdGhlIHJlc3RcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdXBkYXRlSXRlbXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgaXRlbSA9IHVwZGF0ZUl0ZW1zW2ldO1xyXG5cdFx0XHRpZiAoIWl0ZW0pIGNvbnRpbnVlO1xyXG5cdFx0XHR0aGlzLnNhdmVJdGVtKGl0ZW0pO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuY29uc3QgZGIgPSBuZXcgRGF0YWJhc2UoKTtcclxuZXhwb3J0IGRlZmF1bHQgZGI7XHJcbiIsImltcG9ydCBkYiBmcm9tICcuL2RiLmpzJztcclxuaW1wb3J0IGNvbmZpZyBmcm9tICcuL2NvbmZpZy5qcyc7XHJcblxyXG5pbXBvcnQgTWFwIGZyb20gJy4vY2xhc3Nlcy9tYXAuanMnO1xyXG5pbXBvcnQgUGxheWVyIGZyb20gJy4vY2xhc3Nlcy9wbGF5ZXIuanMnO1xyXG5pbXBvcnQgQm90IGZyb20gJy4vY2xhc3Nlcy9ib3QuanMnO1xyXG5pbXBvcnQgSXRlbSBmcm9tICcuL2NsYXNzZXMvaXRlbS5qcyc7XHJcbmltcG9ydCBFZmZlY3QgZnJvbSAnLi9jbGFzc2VzL2VmZmVjdC5qcyc7XHJcbmltcG9ydCBUZXh0IGZyb20gJy4vY2xhc3Nlcy90ZXh0LmpzJztcclxuaW1wb3J0IE1lc3NhZ2UgZnJvbSAnLi9jbGFzc2VzL21lc3NhZ2UuanMnO1xyXG5cclxuY2xhc3MgR2FtZSB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHR0aGlzLm1hcHMgPSBbXTtcclxuXHRcdHRoaXMucGxheWVycyA9IFtdO1xyXG5cdFx0dGhpcy5ib3RzID0gW107XHJcblx0XHR0aGlzLml0ZW1zID0gW107XHJcblx0XHR0aGlzLmVmZmVjdHMgPSBbXTtcclxuXHRcdHRoaXMudGV4dHMgPSBbXTtcclxuXHRcdHRoaXMubWVzc2FnZVF1ZXVlID0gW107XHJcblx0XHRcclxuXHRcdHRoaXMucGxheWVyVGVtcGxhdGVzID0ge307XHJcblx0XHR0aGlzLmJvdFRlbXBsYXRlcyA9IHt9O1xyXG5cdFx0dGhpcy5pdGVtVGVtcGxhdGVzID0ge307XHJcblxyXG5cdFx0dGhpcy5sb2FkTWFwcygpO1xyXG5cdFx0dGhpcy5sb2FkUGxheWVyVGVtcGxhdGVzKCk7XHJcblx0XHR0aGlzLmxvYWRCb3RUZW1wbGF0ZXMoKTtcclxuXHRcdHRoaXMubG9hZEl0ZW1UZW1wbGF0ZXMoKTtcclxuXHRcdHRoaXMubG9hZENvbW1hbmRzKCk7XHJcblx0XHR0aGlzLmxvYWRJdGVtcygpO1xyXG5cdFx0dGhpcy5sb2FkQm90cygpO1xyXG5cdH1cclxuXHJcblx0bG9hZE1hcHMoKSB7XHJcblx0XHRkYi5nZXRBbGxNYXBzKClcclxuXHRcdC50aGVuKG1hcERhdGEgPT4ge1xyXG5cdFx0XHRjb25zdCBvcmRlcmVkTWFwRGF0YSA9IFtdO1xyXG5cdFx0XHRmb3IgKGxldCBpZCA9IDA7IGlkIDwgbWFwRGF0YS5sZW5ndGg7IGlkKyspIHtcclxuXHRcdFx0XHRjb25zdCBkYXRhID0gbWFwRGF0YVtpZF07XHJcblx0XHRcdFx0aWYgKGRhdGEpIG9yZGVyZWRNYXBEYXRhW2RhdGEubWFwSWRdID0gZGF0YTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Zm9yIChsZXQgaWQgPSAwOyBpZCA8IGNvbmZpZy5NQVhfTUFQUzsgaWQrKykge1xyXG5cdFx0XHRcdGlmIChvcmRlcmVkTWFwRGF0YVtpZF0pIHtcclxuXHRcdFx0XHRcdHRoaXMubWFwc1tpZF0gPSBuZXcgTWFwKGlkLCBvcmRlcmVkTWFwRGF0YVtpZF0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubWFwc1tpZF0gPSBuZXcgTWFwKGlkKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHJcblx0bG9hZFBsYXllclRlbXBsYXRlcygpIHtcclxuXHRcdGRiLmdldEFsbFBsYXllclRlbXBsYXRlcygpXHJcblx0XHQudGhlbih0ZW1wbGF0ZXMgPT4ge1xyXG5cdFx0XHR0aGlzLnBsYXllclRlbXBsYXRlcyA9IHt9O1xyXG5cdFx0XHR0ZW1wbGF0ZXMuZm9yRWFjaCh0ZW1wbGF0ZSA9PiB7XHJcblx0XHRcdFx0dGhpcy5wbGF5ZXJUZW1wbGF0ZXNbdGVtcGxhdGUuX2lkXSA9IHRlbXBsYXRlO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pLmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblxyXG5cdGxvYWRCb3RUZW1wbGF0ZXMoKSB7XHJcblx0XHRkYi5nZXRBbGxCb3RUZW1wbGF0ZXMoKVxyXG5cdFx0LnRoZW4odGVtcGxhdGVzID0+IHtcclxuXHRcdFx0dGhpcy5ib3RUZW1wbGF0ZXMgPSB7fTtcclxuXHRcdFx0dGVtcGxhdGVzLmZvckVhY2godGVtcGxhdGUgPT4ge1xyXG5cdFx0XHRcdHRoaXMuYm90VGVtcGxhdGVzW3RlbXBsYXRlLl9pZF0gPSB0ZW1wbGF0ZTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KS5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cclxuXHRsb2FkSXRlbVRlbXBsYXRlcygpIHtcclxuXHRcdGRiLmdldEFsbEl0ZW1UZW1wbGF0ZXMoKVxyXG5cdFx0LnRoZW4odGVtcGxhdGVzID0+IHtcclxuXHRcdFx0dGhpcy5pdGVtVGVtcGxhdGVzID0ge307XHJcblx0XHRcdHRlbXBsYXRlcy5mb3JFYWNoKHRlbXBsYXRlID0+IHtcclxuXHRcdFx0XHR0ZW1wbGF0ZS50eXBlID0gY29uZmlnLklURU1fVFlQRVNbdGVtcGxhdGUuaXRlbVR5cGVdO1xyXG5cdFx0XHRcdHRoaXMuaXRlbVRlbXBsYXRlc1t0ZW1wbGF0ZS5faWRdID0gdGVtcGxhdGU7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSkuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHJcblx0bG9hZENvbW1hbmRzKCkge1xyXG5cdFx0dGhpcy5jb21tYW5kcyA9IHtcclxuXHRcdFx0bW92ZTogKGRhdGEsIHBsYXllcikgPT4gcGxheWVyLmlucHV0LmRpcmVjdGlvbiA9IGRhdGEuZGlyZWN0aW9uLFxyXG5cdFx0XHRydW46IChkYXRhLCBwbGF5ZXIpID0+IHBsYXllci5pbnB1dC5ydW4gPSBkYXRhLnN0YXRlLFxyXG5cdFx0XHRwaWNrdXA6IChkYXRhLCBwbGF5ZXIpID0+IHtcclxuXHRcdFx0XHRpZiAoIXBsYXllci5pbnB1dC5waWNrdXAgJiYgZGF0YS5zdGF0ZSkgcGxheWVyLnBpY2tVcCgpO1xyXG5cdFx0XHRcdHBsYXllci5pbnB1dC5waWNrdXAgPSBkYXRhLnN0YXRlO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRhdHRhY2s6IChkYXRhLCBwbGF5ZXIpID0+IHtcclxuXHRcdFx0XHRwbGF5ZXIuaW5wdXQuYXR0YWNrID0gZGF0YS5zdGF0ZTtcclxuXHRcdFx0XHRwbGF5ZXIuYXR0YWNrKDEsIHBsYXllci5kaXJlY3Rpb24pO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRkb3VibGVDbGlja0l0ZW06IChkYXRhLCBwbGF5ZXIpID0+IHBsYXllci51c2VJdGVtKGRhdGEuc2xvdCksXHJcblx0XHRcdHJpZ2h0Q2xpY2tJdGVtOiAoZGF0YSwgcGxheWVyKSA9PiBwbGF5ZXIuZHJvcEl0ZW0oZGF0YS5zbG90KSxcclxuXHRcdFx0ZHJhZ1N0b3BHYW1lOiAoZGF0YSwgcGxheWVyKSA9PiBwbGF5ZXIuZHJvcEl0ZW0oZGF0YS5zbG90KSxcclxuXHRcdFx0ZHJhZ1N0b3BJbnZlbnRvcnk6IChkYXRhLCBwbGF5ZXIpID0+IHBsYXllci5tb3ZlSXRlbVRvU2xvdChkYXRhLnNsb3QsIGRhdGEubmV3U2xvdCksXHJcblx0XHRcdGRyYWdTdG9wRXF1aXBtZW50OiAoZGF0YSwgcGxheWVyKSA9PiBwbGF5ZXIubW92ZUl0ZW1Ub1Nsb3QoZGF0YS5zbG90LCBkYXRhLm5ld1Nsb3QpLFxyXG5cdFx0XHRzZXJ2ZXJDaGF0OiAoZGF0YSwgcGxheWVyKSA9PiBnYW1lLnNlbmRNZXNzYWdlR2xvYmFsKHBsYXllci5nYW1lSWQsIGAke3BsYXllci5uYW1lfSB5ZWxscywgXCIke2RhdGEubWVzc2FnZX1cImApLFxyXG5cdFx0XHRtYXBDaGF0OiAoZGF0YSwgcGxheWVyKSA9PiBnYW1lLnNlbmRNZXNzYWdlTWFwKHBsYXllci5nYW1lSWQsIHBsYXllci5tYXBJZCwgYCR7cGxheWVyLm5hbWV9IHNheXMsIFwiJHtkYXRhLm1lc3NhZ2V9XCJgKSxcclxuXHRcdFx0cGxheWVyQ2hhdDogKGRhdGEsIHBsYXllcikgPT4ge1xyXG5cdFx0XHRcdGNvbnN0IHRhcmdldCA9IGdhbWUucGxheWVyc1tkYXRhLnRhcmdldElkXTtcclxuXHRcdFx0XHRpZiAodGFyZ2V0KSB7XHJcblx0XHRcdFx0XHRnYW1lLnNlbmRNZXNzYWdlUGxheWVyKHBsYXllci5nYW1lSWQsIHRhcmdldC5nYW1lSWQsIGAke3BsYXllci5uYW1lfSB3aGlzcGVycywgXCIke2RhdGEubWVzc2FnZX1cImApO1xyXG5cdFx0XHRcdFx0Z2FtZS5zZW5kTWVzc2FnZVBsYXllcihwbGF5ZXIuZ2FtZUlkLCBwbGF5ZXIuZ2FtZUlkLCBgWW91IHdoaXNwZXIgdG8gJHt0YXJnZXQubmFtZX0sIFwiJHtkYXRhLm1lc3NhZ2V9XCJgKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdG1hY3JvMTogKGRhdGEpID0+IHtcclxuXHRcdFx0XHRpZiAoZGF0YSkgdGhpcy5zcGF3bk1hcEl0ZW0oMSwgNSwgNSwgXCI1YzFiZmViN2Q4ZmI2MDEyY2M5NjYwODNcIik7XHJcblx0XHRcdH0sXHJcblx0XHRcdG1hY3JvMjogKGRhdGEpID0+IHtcclxuXHRcdFx0XHRpZiAoZGF0YSkgdGhpcy5zcGF3bkJvdCgxLCA1LCA1LCBcIjVjMWJlY2RlMjhkMDViMDc3Y2JhYTM4NVwiKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0bWFjcm8zOiAoZGF0YSkgPT4ge1xyXG5cdFx0XHRcdGlmIChkYXRhKSB7XHJcblx0XHRcdFx0XHRpZiAocGxheWVyLnNwcml0ZSA+PSBjb25maWcuTUFYX1NQUklURVMpIHBsYXllci5zcHJpdGUgPSAxO1xyXG5cdFx0XHRcdFx0ZWxzZSBwbGF5ZXIuc3ByaXRlKys7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRtYWNybzQ6IChkYXRhKSA9PiB7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0fTtcclxuXHRcdFxyXG5cdFx0dGhpcy5nb2RDb21tYW5kcyA9IHtcclxuXHRcdFx0c3Bhd25NYXBJdGVtOiAoZGF0YSkgPT4gdGhpcy5zcGF3bk1hcEl0ZW0oZGF0YS5hcmdzWzBdLCBkYXRhLmFyZ3NbMV0sIGRhdGEuYXJnc1syXSwgZGF0YS5hcmdzWzNdLCBkYXRhLmFyZ3NbNF0pLFxyXG5cdFx0XHRzcGF3bkJvdDogKGRhdGEpID0+IHRoaXMuc3Bhd25Cb3QoZGF0YS5hcmdzWzBdLCBkYXRhLmFyZ3NbMV0sIGRhdGEuYXJnc1syXSwgZGF0YS5hcmdzWzNdLCBkYXRhLmFyZ3NbNF0pLFxyXG5cdFx0XHRzZXRTcHJpdGU6IChkYXRhLCBwbGF5ZXIpID0+IHBsYXllci5zcHJpdGUgPSBkYXRhLmFyZ3NbMF1cclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHRhc3luYyBsb2FkSXRlbXMoKSB7XHJcblx0XHRsZXQgaXRlbURhdGEgPSBhd2FpdCBkYi5nZXRBbGxJdGVtcygpO1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtRGF0YS5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRjb25zdCBpdGVtID0gaXRlbURhdGFbaV07XHJcblx0XHRcdGlmICghaXRlbSkgY29udGludWU7XHJcblx0XHRcdGl0ZW0udGVtcGxhdGUudHlwZSA9IGNvbmZpZy5JVEVNX1RZUEVTW2l0ZW0udGVtcGxhdGUuaXRlbVR5cGVdXHJcblx0XHRcdG5ldyBJdGVtKGl0ZW0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRhc3luYyBsb2FkQm90cygpIHtcclxuXHRcdGxldCBib3REYXRhID0gYXdhaXQgZGIuZ2V0QWxsQm90cygpO1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBib3REYXRhLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdG5ldyBCb3QoYm90RGF0YVtpXSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdHJlcXVlc3REQklkKCkge1xyXG5cdFx0cmV0dXJuIGRiLmdlbmVyYXRlSWQoKTtcclxuXHR9XHJcblxyXG5cdHVwZGF0ZShkZWx0YSkge1xyXG5cdFx0Y29uc3QgcGFjayA9IHtcclxuXHRcdFx0cGxheWVyczogW10sXHJcblx0XHRcdGJvdHM6IFtdLFxyXG5cdFx0XHRpdGVtczogW10sXHJcblx0XHRcdGVmZmVjdHM6IFtdLFxyXG5cdFx0XHR0ZXh0czogW10sXHJcblx0XHRcdG1lc3NhZ2VzOiBbXS5jb25jYXQodGhpcy5tZXNzYWdlUXVldWUpXHJcblx0XHR9O1xyXG5cdFx0dGhpcy5tZXNzYWdlUXVldWUgPSBbXTtcclxuXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGxheWVycy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRjb25zdCBwbGF5ZXIgPSB0aGlzLnBsYXllcnNbaV07XHJcblx0XHRcdGlmIChwbGF5ZXIgIT0gbnVsbCkgcGFjay5wbGF5ZXJzW3BsYXllci5nYW1lSWRdID0gcGxheWVyLnVwZGF0ZShkZWx0YSk7XHJcblx0XHR9XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYm90cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRjb25zdCBib3QgPSB0aGlzLmJvdHNbaV07XHJcblx0XHRcdGlmIChib3QpIHBhY2suYm90c1tib3QuZ2FtZUlkXSA9IGJvdC51cGRhdGUoZGVsdGEpO1xyXG5cdFx0fVxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLml0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IGl0ZW0gPSB0aGlzLml0ZW1zW2ldO1xyXG5cdFx0XHRpZiAoaXRlbSkgcGFjay5pdGVtc1tpdGVtLmdhbWVJZF0gPSBpdGVtLnVwZGF0ZShkZWx0YSk7XHJcblx0XHR9XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZWZmZWN0cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRjb25zdCBlZmZlY3QgPSB0aGlzLmVmZmVjdHNbaV07XHJcblx0XHRcdGlmIChlZmZlY3QpIHBhY2suZWZmZWN0c1tlZmZlY3QuaWRdID0gZWZmZWN0LnVwZGF0ZShkZWx0YSk7XHJcblx0XHR9XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudGV4dHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgdGV4dCA9IHRoaXMudGV4dHNbaV07XHJcblx0XHRcdGlmICh0ZXh0KSBwYWNrLnRleHRzW3RleHQuZ2FtZUlkXSA9IHRleHQudXBkYXRlKGRlbHRhKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBwYWNrO1xyXG5cdH1cclxuXHJcblx0Z2V0REJQYWNrKCkge1xyXG5cdFx0Y29uc3QgZGJQYWNrID0ge1xyXG5cdFx0XHRwbGF5ZXJzOiBbXSxcclxuXHRcdFx0Ym90czogW10sXHJcblx0XHRcdGl0ZW1zOiBbXVxyXG5cdFx0fTtcclxuXHRcdHRoaXMucGxheWVycy5mb3JFYWNoKHBsYXllciA9PiBkYlBhY2sucGxheWVycy5wdXNoKHBsYXllci5nZXREQlBhY2soKSkpO1xyXG5cdFx0dGhpcy5ib3RzLmZvckVhY2goYm90ID0+IGRiUGFjay5ib3RzLnB1c2goYm90LmdldERCUGFjaygpKSk7XHJcblx0XHR0aGlzLml0ZW1zLmZvckVhY2goaXRlbSA9PiBkYlBhY2suaXRlbXMucHVzaChpdGVtLmdldERCUGFjaygpKSk7XHJcblx0XHRyZXR1cm4gZGJQYWNrO1xyXG5cdH1cclxuXHJcblx0Ly8gUGxheWVyc1xyXG5cdHBsYXllckxvZ2luKHNvY2tldElkLCBkYXRhKSB7XHJcblx0XHRmb3IgKGxldCBwbGF5ZXIgb2YgdGhpcy5wbGF5ZXJzKSB7XHJcblx0XHRcdGlmIChwbGF5ZXIgJiYgcGxheWVyLm5hbWUgPT09IGRhdGEubmFtZSkge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiUGxheWVyIGlzIGFscmVhZHkgc2lnbmVkIGluLlwiKTtcclxuXHRcdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHBsYXllciA9IG5ldyBQbGF5ZXIoc29ja2V0SWQsIGRhdGEpO1xyXG5cdFx0ZGIubG9nKGAke3NvY2tldElkfSAtICR7cGxheWVyLm5hbWV9IGhhcyBsb2dnZWQgaW4uYCk7XHJcblx0XHR0aGlzLnNlbmRHYW1lSW5mb0dsb2JhbChgJHtwbGF5ZXIubmFtZX0gaGFzIGxvZ2dlZCBpbi5gKTtcclxuXHRcdHJldHVybiBwbGF5ZXI7XHJcblx0fVxyXG5cdHBsYXllckxvZ291dChwbGF5ZXJJZCkge1xyXG5cdFx0bGV0IHBsYXllciA9IHRoaXMucGxheWVyc1twbGF5ZXJJZF07XHJcblx0XHRpZiAocGxheWVyKSB7XHJcblx0XHRcdGNvbnN0IHBsYXllckRhdGEgPSBwbGF5ZXIuZ2V0REJQYWNrKClcclxuXHRcdFx0ZGIubG9nKGAke3BsYXllci5zb2NrZXRJZH0gLSAke3BsYXllci5uYW1lfSBoYXMgbG9nZ2VkIG91dC5gKTtcclxuXHRcdFx0dGhpcy5zZW5kR2FtZUluZm9HbG9iYWwoYCR7cGxheWVyLm5hbWV9IGhhcyBsb2dnZWQgb3V0LmApO1xyXG5cdFx0XHRkZWxldGUgdGhpcy50ZXh0c1twbGF5ZXIuZGlzcGxheU5hbWVJZF07XHJcblx0XHRcdGRlbGV0ZSB0aGlzLnBsYXllcnNbcGxheWVySWRdO1xyXG5cdFx0XHRkYi5zYXZlUGxheWVyKHBsYXllckRhdGEpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRnZXRFeHBUb0xldmVsKGxldmVsKSB7XHJcblx0XHRsZXQgZXhwID0gMTA7XHJcblx0XHRmb3IgKGxldCBpID0gMTsgaSA8IGNvbmZpZy5NQVhfTEVWRUw7IGkrKykge1xyXG5cdFx0XHRpZiAoaSA9PT0gbGV2ZWwpIHJldHVybiBleHA7XHJcblx0XHRcdGV4cCA9IChleHAgKyAoZXhwICUgMikpICogMS41O1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gR2FtZSBJbmZvXHJcblx0c2VuZEdhbWVJbmZvR2xvYmFsKG1lc3NhZ2UpIHtcclxuXHRcdHRoaXMubWVzc2FnZVF1ZXVlLnB1c2gobmV3IE1lc3NhZ2UobnVsbCwgbWVzc2FnZSwgJ2dhbWVJbmZvJykpO1xyXG5cdH1cclxuXHRzZW5kR2FtZUluZm9NYXAobWFwSWQsIG1lc3NhZ2UpIHtcclxuXHRcdHRoaXMubWVzc2FnZVF1ZXVlLnB1c2gobmV3IE1lc3NhZ2UobnVsbCwgbWVzc2FnZSwgJ2dhbWVJbmZvJywgbWFwSWQpKTtcclxuXHR9XHJcblx0c2VuZEdhbWVJbmZvUGxheWVyKGlkLCBtZXNzYWdlKSB7XHJcblx0XHR0aGlzLm1lc3NhZ2VRdWV1ZS5wdXNoKG5ldyBNZXNzYWdlKG51bGwsIG1lc3NhZ2UsICdnYW1lSW5mbycsIG51bGwsIGlkKSk7XHJcblx0fVxyXG5cdFxyXG5cdC8vIENoYXQgTWVzc2FnZXNcclxuXHRzZW5kTWVzc2FnZUdsb2JhbChzZW5kZXJJZCwgbWVzc2FnZSkge1xyXG5cdFx0dGhpcy5tZXNzYWdlUXVldWUucHVzaChuZXcgTWVzc2FnZShzZW5kZXJJZCwgbWVzc2FnZSwgJ21lc3NhZ2VHbG9iYWwnKSk7XHJcblx0fVxyXG5cdHNlbmRNZXNzYWdlTWFwKHNlbmRlcklkLCBtYXBJZCwgbWVzc2FnZSkge1xyXG5cdFx0dGhpcy5tZXNzYWdlUXVldWUucHVzaChuZXcgTWVzc2FnZShzZW5kZXJJZCwgbWVzc2FnZSwgJ21lc3NhZ2VNYXAnLCBtYXBJZCkpO1xyXG5cdH1cclxuXHRzZW5kTWVzc2FnZVBsYXllcihzZW5kZXJJZCwgaWQsIG1lc3NhZ2UpIHtcclxuXHRcdHRoaXMubWVzc2FnZVF1ZXVlLnB1c2gobmV3IE1lc3NhZ2Uoc2VuZGVySWQsIG1lc3NhZ2UsICdtZXNzYWdlUGxheWVyJywgbnVsbCwgaWQpKTtcclxuXHR9XHJcblxyXG5cdC8vIE1hcFxyXG5cdGlzVmFjYW50KG1hcElkLCB4LCB5KSB7XHJcblx0XHQvLyBDaGVjayBmb3IgTWFwIEVkZ2VzXHJcblx0XHRpZiAoeCA8IDAgfHwgeCA+PSBjb25maWcuTUFQX0NPTFVNTlMgfHwgeSA8IDAgfHwgeSA+PSBjb25maWcuTUFQX1JPV1MpIHJldHVybiBmYWxzZTtcclxuXHRcdFxyXG5cdFx0Ly8gQ2hlY2sgZm9yIFdhbGwgVGlsZXNcclxuXHRcdGNvbnN0IG1hcCA9IHRoaXMubWFwc1ttYXBJZF07XHJcblx0XHRpZiAobWFwLmlzV2FsbFt5XVt4XSkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHJcblx0XHQvLyBDaGVjayBmb3IgQWN0b3JzXHJcblx0XHRjb25zdCBhY3Rvckxpc3QgPSB0aGlzLnBsYXllcnMuY29uY2F0KHRoaXMuYm90cyk7XHJcblx0XHRjb25zdCBhY3RvcnNPblRpbGUgPSBhY3Rvckxpc3QuZmlsdGVyKGFjdG9yID0+IHtcclxuXHRcdFx0cmV0dXJuIGFjdG9yLm1hcElkID09PSBtYXBJZCAmJiBhY3Rvci54ID09PSB4ICYmIGFjdG9yLnkgPT09IHkgJiYgIWFjdG9yLmlzRGVhZDtcclxuXHRcdH0pO1xyXG5cdFx0aWYgKGFjdG9yc09uVGlsZS5sZW5ndGggPiAwKSByZXR1cm4gZmFsc2U7XHJcblxyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cclxuXHRzcGF3bkJvdChtYXBJZCwgeCwgeSwgdGVtcGxhdGVJZCwgZGlyZWN0aW9uID0gJ2Rvd24nKSB7XHJcblx0XHRjb25zdCB0ZW1wbGF0ZSA9IHRoaXMuYm90VGVtcGxhdGVzW3RlbXBsYXRlSWRdO1xyXG5cdFx0aWYgKHRlbXBsYXRlKSB7XHJcblx0XHRcdG5ldyBCb3Qoe21hcElkLCB4LCB5LCBkaXJlY3Rpb24sIHRlbXBsYXRlfSk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJCb3QgVGVtcGxhdGUgZG9lcyBub3QgZXhpc3Qgd2l0aCB0aGF0IElkXCIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRzcGF3bk1hcEl0ZW0obWFwSWQsIHgsIHksIHRlbXBsYXRlSWQsIHN0YWNrID0gMCkge1xyXG5cdFx0bGV0IHRlbXBsYXRlID0gdGhpcy5pdGVtVGVtcGxhdGVzW3RlbXBsYXRlSWRdO1xyXG5cdFx0aWYgKHRlbXBsYXRlKSB7XHJcblx0XHRcdG5ldyBJdGVtKHttYXBJZCwgeCwgeSwgdGVtcGxhdGUsIHN0YWNrfSk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJJdGVtIFRlbXBsYXRlIGRvZXMgbm90IGV4aXN0IHdpdGggdGhhdCBJZFwiKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHNwYXduRGFtYWdlVGV4dChtYXBJZCwgeCwgeSwgZGFtYWdlKSB7XHJcblx0XHRuZXcgVGV4dChtYXBJZCwgeCwgeSArIDAuNSwgZGFtYWdlLCAnI2ZmMDAwMCcsIDEuMjUsIDAsIC0xKTtcclxuXHR9XHJcblxyXG5cdHNwYXduRWZmZWN0KG1hcElkLCB4LCB5LCBzcHJpdGUsIGxvb3AsIHNwZWVkLCBtYXhGcmFtZSwgc3RhcnRGcmFtZSkge1xyXG5cdFx0bmV3IEVmZmVjdChtYXBJZCwgeCwgeSwgc3ByaXRlLCBsb29wLCBzcGVlZCwgbWF4RnJhbWUsIHN0YXJ0RnJhbWUpO1xyXG5cdH1cclxufVxyXG5cclxuY29uc3QgZ2FtZSA9IG5ldyBHYW1lKCk7XHJcbmV4cG9ydCBkZWZhdWx0IGdhbWU7XHJcbiIsIi8qKiogR2FtZSBMb29wICoqKi9cclxuLyogS2VlcHMgdHJhY2sgb2YgdGltZSBhbmQgY28tb3JkaW5hdGVzIHRoZSBnYW1lIGFuZCBzZXJ2ZXIgKi9cclxuXHJcbmltcG9ydCBOb2RlR2FtZUxvb3AgZnJvbSAnbm9kZS1nYW1lbG9vcCc7XHJcblxyXG5pbXBvcnQgZGIgZnJvbSAnLi9kYi5qcyc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4vZ2FtZS5qcyc7XHJcbmltcG9ydCBzZXJ2ZXIgZnJvbSAnLi9zZXJ2ZXIuanMnO1xyXG5pbXBvcnQgY29uZmlnIGZyb20gJy4vY29uZmlnLmpzJztcclxuXHJcbmNsYXNzIEdhbWVMb29wIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHRoaXMudGltZXIgPSB7XHJcblx0XHRcdGJhY2t1cDogMCxcclxuXHRcdFx0bWludXRlOiAwXHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuaWQgPSBOb2RlR2FtZUxvb3Auc2V0R2FtZUxvb3AoKGRlbHRhKSA9PiB0aGlzLnVwZGF0ZShkZWx0YSksIGNvbmZpZy5GUkFNRVJBVEUpO1xyXG5cdH1cclxuXHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHQvLyBJbmNyZWFzZSBUaW1lcnNcclxuXHRcdHRoaXMudGltZXIuYmFja3VwICs9IGRlbHRhO1xyXG5cdFx0dGhpcy50aW1lci5taW51dGUgKz0gZGVsdGE7XHJcblxyXG5cdFx0Ly8gVXBkYXRlIHRoZSBnYW1lIHN0YXRlXHJcblx0XHRsZXQgdXBkYXRlUGFjayA9IGdhbWUudXBkYXRlKGRlbHRhKTtcclxuXHRcdC8vIFNlbmQgdXBkYXRlZCBzdGF0ZSB0byBjbGllbnRzXHJcblx0XHRzZXJ2ZXIuc2VuZFVwZGF0ZVBhY2sodXBkYXRlUGFjayk7XHJcblx0XHRcclxuXHRcdC8vIE1pbnV0ZSB0aW1lciBzY3JpcHRcclxuXHRcdGlmICh0aGlzLnRpbWVyLm1pbnV0ZSA+PSA2MCkge1xyXG5cdFx0XHR0aGlzLnRpbWVyLm1pbnV0ZSAtPSA2MDtcclxuXHRcdFx0Ly8gVE9ETzogcnVuIG1pbnV0ZSB0aW1lciBzY3JpcHRcclxuXHRcdH1cclxuXHJcblx0XHQvLyBQZXJpb2RpYyBiYWNrdXAgdG8gZGF0YWJhc2VcclxuXHRcdGlmICh0aGlzLnRpbWVyLmJhY2t1cCA+PSBjb25maWcuQkFDS1VQX1RJTUUpIHtcclxuXHRcdFx0dGhpcy50aW1lci5iYWNrdXAgLT0gY29uZmlnLkJBQ0tVUF9USU1FO1xyXG5cdFx0XHRsZXQgZGJQYWNrID0gZ2FtZS5nZXREQlBhY2soKTtcclxuXHRcdFx0ZGIuYmFja3VwKGRiUGFjayk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5jb25zdCBnYW1lTG9vcCA9IG5ldyBHYW1lTG9vcCgpO1xyXG5leHBvcnQgZGVmYXVsdCBnYW1lTG9vcDtcclxuIiwiaW1wb3J0IGRiIGZyb20gJy4vZGIuanMnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuL2dhbWUuanMnO1xyXG5pbXBvcnQgc2VydmVyIGZyb20gJy4vc2VydmVyLmpzJztcclxuaW1wb3J0IGdhbWVsb29wIGZyb20gJy4vZ2FtZWxvb3AuanMnO1xyXG4iLCJpbXBvcnQgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xyXG5cclxuY29uc3QgYWNjb3VudFNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoe1xyXG4gIF9pZDogbW9uZ29vc2UuU2NoZW1hVHlwZXMuT2JqZWN0SWQsXHJcbiAgdXNlcm5hbWU6IHt0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlLCB1bmlxdWU6IHRydWV9LFxyXG4gIHBhc3N3b3JkOiB7dHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZX0sXHJcbiAgZW1haWw6IHt0eXBlOiBTdHJpbmcsIG1hdGNoOiAvXigoW148PigpXFxbXFxdXFxcXC4sOzpcXHNAXCJdKyhcXC5bXjw+KClcXFtcXF1cXFxcLiw7Olxcc0BcIl0rKSopfChcIi4rXCIpKUAoKFxcW1swLTldezEsM31cXC5bMC05XXsxLDN9XFwuWzAtOV17MSwzfVxcLlswLTldezEsM31dKXwoKFthLXpBLVpcXC0wLTldK1xcLikrW2EtekEtWl17Mix9KSkkL30sXHJcbiAgdmVyaWZpZWQ6IHt0eXBlOiBCb29sZWFuLCBkZWZhdWx0OiBmYWxzZX0sXHJcbiAgYWRtaW46IHt0eXBlOiBCb29sZWFuLCBkZWZhdWx0OiBmYWxzZX1cclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBtb25nb29zZS5tb2RlbCgnQWNjb3VudCcsIGFjY291bnRTY2hlbWEpO1xyXG4iLCJpbXBvcnQgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xyXG5cclxuY29uc3QgYm90U2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYSh7XHJcbiAgX2lkOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCxcclxuICBtYXBJZDoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMX0sXHJcbiAgeDoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogNX0sXHJcbiAgeToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogNX0sXHJcbiAgdGVtcGxhdGU6IHt0eXBlOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCwgcmVmOiAnQm90VGVtcGxhdGUnLCByZXF1aXJlZDogdHJ1ZX0sXHJcbiAgZGlyZWN0aW9uOiB7dHlwZTogU3RyaW5nLCBkZWZhdWx0OiAnZG93bid9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWwoJ0JvdCcsIGJvdFNjaGVtYSk7XHJcbiIsImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XHJcblxyXG5jb25zdCBib3RUZW1wbGF0ZVNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoe1xyXG4gIF9pZDogbW9uZ29vc2UuU2NoZW1hVHlwZXMuT2JqZWN0SWQsXHJcbiAgbmFtZToge3R5cGU6IFN0cmluZywgZGVmYXVsdDogXCJCb3RcIn0sXHJcbiAgc3ByaXRlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuICBkYW1hZ2VCYXNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuICBkZWZlbmNlQmFzZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcbiAgaGVhbHRoTWF4QmFzZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMX0sXHJcbiAgZW5lcmd5TWF4QmFzZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMX0sXHJcbiAgaGVhbHRoUmVnZW5CYXNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuICBlbmVyZ3lSZWdlbkJhc2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDF9LFxyXG4gIHJhbmdlQmFzZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMX0sXHJcbiAgaG9zdGlsZToge3R5cGU6IEJvb2xlYW4sIGRlZmF1bHQ6IHRydWV9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWwoJ0JvdFRlbXBsYXRlJywgYm90VGVtcGxhdGVTY2hlbWEpO1xyXG4iLCJpbXBvcnQgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xyXG5cclxuY29uc3QgaXRlbVNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoe1xyXG4gIF9pZDogbW9uZ29vc2UuU2NoZW1hVHlwZXMuT2JqZWN0SWQsXHJcbiAgdGVtcGxhdGU6IHt0eXBlOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCwgcmVmOiAnSXRlbVRlbXBsYXRlJywgcmVxdWlyZWQ6IHRydWV9LFxyXG4gIHN0YWNrOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuICBwbGF5ZXJJZDoge3R5cGU6IG1vbmdvb3NlLlNjaGVtYVR5cGVzLk9iamVjdElkLCBkZWZhdWx0OiBudWxsfSxcclxuICBib3RJZDoge3R5cGU6IG1vbmdvb3NlLlNjaGVtYVR5cGVzLk9iamVjdElkLCBkZWZhdWx0OiBudWxsfSxcclxuICBzbG90OiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiBudWxsfSxcclxuICBtYXBJZDoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogbnVsbH0sXHJcbiAgeDoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogbnVsbH0sXHJcbiAgeToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogbnVsbH0sXHJcbiAgY3JlYXRlZEJ5OiB7dHlwZTogU3RyaW5nfSxcclxuICBjcmVhdGVkRGF0ZToge3R5cGU6IERhdGV9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWwoJ0l0ZW0nLCBpdGVtU2NoZW1hKTtcclxuIiwiaW1wb3J0IG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcclxuXHJcbmNvbnN0IGl0ZW1UZW1wbGF0ZVNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoe1xyXG5cdF9pZDogbW9uZ29vc2UuU2NoZW1hVHlwZXMuT2JqZWN0SWQsXHJcblx0bmFtZToge3R5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWV9LFxyXG5cdHNwcml0ZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMX0sXHJcblx0cmV1c2FibGU6IHt0eXBlOiBCb29sZWFuLCBkZWZhdWx0OiB0cnVlfSxcclxuXHRpdGVtVHlwZToge3R5cGU6IE51bWJlciwgcmVxdWlyZWQ6IHRydWV9LFxyXG5cdHBhc3NpdmVEYW1hZ2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG5cdHBhc3NpdmVEZWZlbmNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuXHRwYXNzaXZlSGVhbHRoTWF4OiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuXHRwYXNzaXZlRW5lcmd5TWF4OiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuXHRwYXNzaXZlSGVhbHRoUmVnZW46IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG5cdHBhc3NpdmVFbmVyZ3lSZWdlbjoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcblx0cGFzc2l2ZVJhbmdlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuXHRlcXVpcHBlZERhbWFnZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcblx0ZXF1aXBwZWREZWZlbmNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuXHRlcXVpcHBlZEhlYWx0aE1heDoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcblx0ZXF1aXBwZWRFbmVyZ3lNYXg6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG5cdGVxdWlwcGVkSGVhbHRoUmVnZW46IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG5cdGVxdWlwcGVkRW5lcmd5UmVnZW46IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG5cdGVxdWlwcGVkUmFuZ2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWwoJ0l0ZW1UZW1wbGF0ZScsIGl0ZW1UZW1wbGF0ZVNjaGVtYSk7XHJcbiIsImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XHJcblxyXG5jb25zdCBpdGVtVHlwZVNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoe1xyXG5cdF9pZDogbW9uZ29vc2UuU2NoZW1hVHlwZXMuT2JqZWN0SWQsXHJcblx0bmFtZToge3R5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWV9LFxyXG5cdGVxdWlwcGVkU2xvdDoge3R5cGU6IE51bWJlciwgcmVxdWlyZWQ6IHRydWV9LFxyXG5cdHN0YWNrYWJsZToge3R5cGU6IEJvb2xlYW4sIHJlcXVpcmVkOiB0cnVlfVxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1vbmdvb3NlLm1vZGVsKCdJdGVtVHlwZScsIGl0ZW1UeXBlU2NoZW1hKTtcclxuIiwiaW1wb3J0IG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcclxuXHJcbmNvbnN0IG1hcFNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoe1xyXG5cdF9pZDogbW9uZ29vc2UuU2NoZW1hVHlwZXMuT2JqZWN0SWQsXHJcblx0bWFwSWQ6IE51bWJlcixcclxuXHRuYW1lOiB7dHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZX0sXHJcblx0ZHJvcENoYW5jZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMTAwfSxcclxuXHRkcm9wQW1vdW50RVE6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDF9LFxyXG5cdHRpbGVzOiB7dHlwZTogW1tbTnVtYmVyXV1dLCBkZWZhdWx0OiBbW1tdXV19LFxyXG5cdGlzV2FsbDoge3R5cGU6IFtbQm9vbGVhbl1dLCBkZWZhdWx0OiBmYWxzZX0sXHJcblx0aXNIb3N0aWxlOiB7dHlwZTogW1tCb29sZWFuXV0sIGRlZmF1bHQ6IGZhbHNlfSxcclxuXHRkYW1hZ2U6IHt0eXBlOiBbW051bWJlcl1dLCBkZWZhdWx0OiBudWxsfSxcclxuXHR3YXJwTWFwOiB7dHlwZTogW1tOdW1iZXJdXSwgZGVmYXVsdDogbnVsbH0sXHJcblx0d2FycFg6IHt0eXBlOiBbW051bWJlcl1dLCBkZWZhdWx0OiBudWxsfSxcclxuXHR3YXJwWToge3R5cGU6IFtbTnVtYmVyXV0sIGRlZmF1bHQ6IG51bGx9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWwoJ01hcCcsIG1hcFNjaGVtYSk7XHJcbiIsImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XHJcblxyXG5jb25zdCBwbGF5ZXJTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcclxuICBfaWQ6IG1vbmdvb3NlLlNjaGVtYVR5cGVzLk9iamVjdElkLFxyXG4gIGFjY291bnQ6IHt0eXBlOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCwgcmVmOiAnQWNjb3VudCcsIHJlcXVpcmVkOiB0cnVlfSxcclxuICBuYW1lOiB7dHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSwgdW5pcXVlOiB0cnVlfSxcclxuICB0ZW1wbGF0ZToge3R5cGU6IG1vbmdvb3NlLlNjaGVtYVR5cGVzLk9iamVjdElkLCByZWY6ICdQbGF5ZXJUZW1wbGF0ZScsIHJlcXVpcmVkOiB0cnVlfSxcclxuICBsZXZlbDoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMX0sXHJcbiAgZXhwZXJpZW5jZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcbiAgbWFwSWQ6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDF9LFxyXG4gIHg6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDV9LFxyXG4gIHk6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDV9LFxyXG4gIGRpcmVjdGlvbjoge3R5cGU6IFN0cmluZywgZGVmYXVsdDogJ2Rvd24nfSxcclxuICBhZG1pbkFjY2Vzczoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcbiAgc3ByaXRlOiBOdW1iZXJcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBtb25nb29zZS5tb2RlbCgnUGxheWVyJywgcGxheWVyU2NoZW1hKTtcclxuIiwiaW1wb3J0IG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcclxuXHJcbmNvbnN0IHBsYXllclRlbXBsYXRlU2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYSh7XHJcbiAgX2lkOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCxcclxuICBuYW1lOiB7dHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSwgdW5pcXVlOiB0cnVlfSxcclxuICBzcHJpdGU6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDF9LFxyXG4gIGRhbWFnZUJhc2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG4gIGRlZmVuY2VCYXNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuICBoZWFsdGhNYXhCYXNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuICBlbmVyZ3lNYXhCYXNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuICBoZWFsdGhSZWdlbkJhc2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDF9LFxyXG4gIGVuZXJneVJlZ2VuQmFzZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMX0sXHJcbiAgcmFuZ2VCYXNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuICBoZWFsdGhQZXJMZXZlbDoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcbiAgZW5lcmd5UGVyTGV2ZWw6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWwoJ1BsYXllclRlbXBsYXRlJywgcGxheWVyVGVtcGxhdGVTY2hlbWEpO1xyXG4iLCJpbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcclxuaW1wb3J0IGh0dHAgZnJvbSAnaHR0cCc7XHJcbmltcG9ydCBzb2NrZXRJTyBmcm9tICdzb2NrZXQuaW8nO1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuXHJcbmltcG9ydCBkYiBmcm9tICcuL2RiLmpzJztcclxuaW1wb3J0IGdhbWUgZnJvbSAnLi9nYW1lLmpzJztcclxuaW1wb3J0IGNvbmZpZyBmcm9tICcuL2NvbmZpZy5qcyc7XHJcblxyXG5jbGFzcyBTZXJ2ZXIge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0Y29uc3QgYXBwID0gZXhwcmVzcygpO1xyXG5cdFx0Y29uc3QgaHR0cFNlcnZlciA9IGh0dHAuU2VydmVyKGFwcCk7XHJcblx0XHRjb25zdCBpbyA9IHNvY2tldElPKGh0dHBTZXJ2ZXIpO1xyXG5cdFx0Y29uc3QgcG9ydCA9IHByb2Nlc3MuZW52LlBPUlQgfHwgY29uZmlnLlBPUlQ7XHJcblx0XHRjb25zdCBwdWJsaWNQYXRoID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uL2NsaWVudCcpO1xyXG5cdFx0XHJcblx0XHRhcHAuZ2V0KCcvJywgKHJlcSwgcmVzKSA9PiByZXMuc2VuZEZpbGUocHVibGljUGF0aCArICcvaW5kZXguaHRtbCcpKTtcclxuXHRcdGFwcC51c2UoJy9jbGllbnQnLCBleHByZXNzLnN0YXRpYyhwdWJsaWNQYXRoKSk7XHJcblx0XHRodHRwU2VydmVyLmxpc3Rlbihwb3J0LCAoKSA9PiBkYi5sb2coYFNlcnZlciBzdGFydGVkLiBMaXN0ZW5pbmcgb24gcG9ydCAke2h0dHBTZXJ2ZXIuYWRkcmVzcygpLnBvcnR9Li4uYCkpO1xyXG5cclxuXHRcdHRoaXMuc29ja2V0TGlzdCA9IHt9O1xyXG5cdFx0dGhpcy5hY3RpdmVBY2NvdW50cyA9IHt9O1xyXG5cclxuXHRcdGlvLnNvY2tldHMub24oJ2Nvbm5lY3QnLCBzb2NrZXQgPT4gdGhpcy5vbkNvbm5lY3Qoc29ja2V0KSk7XHJcblx0fVxyXG5cclxuXHQvKiBjb25uZWN0ID0+IHNpZ25pbiA9PiBzZWxlY3RwbGF5ZXJcclxuXHQqKiBjb25uZWN0IHdoZW4gcGFnZSBsb2FkcyAtIHNob3dzIHNpZ25pbiBwYWdlXHJcblx0Kiogc2lnbmluIHdoZW4gdXNlcm5hbWUgYW5kIHBhc3N3b3JkIGlzIHN1Ym1pdHRlZFxyXG4gXHQqKiBzZWxlY3RwbGF5ZXIgd2hlbiBjaGFyYWN0ZXIgaXMgY2hvc2VuIC0gbG9ncyBpbnRvIHRoZSBnYW1lXHJcblx0Ki9cclxuXHJcblx0Ly8gUmVjZWl2ZSBkYXRhIGZyb20gY2xpZW50c1xyXG5cdG9uQ29ubmVjdChzb2NrZXQpIHtcclxuXHRcdHRoaXMuc29ja2V0TGlzdFtzb2NrZXQuaWRdID0gc29ja2V0O1xyXG5cdFx0ZGIubG9nKGAke3NvY2tldC5pZH0gLSBTb2NrZXQgY29ubmVjdGVkLmApO1xyXG5cdFx0XHJcblx0XHRzb2NrZXQub24oJ2Rpc2Nvbm5lY3QnLCAoKSA9PiB0aGlzLm9uRGlzY29ubmVjdChzb2NrZXQpKTtcclxuXHRcdHNvY2tldC5vbignc2lnbnVwJywgKGRhdGEpID0+IHRoaXMub25TaWduVXAoc29ja2V0LCBkYXRhLnVzZXJuYW1lLCBkYXRhLnBhc3N3b3JkLCBkYXRhLmVtYWlsKSk7XHJcblx0XHRzb2NrZXQub24oJ3NpZ25pbicsIChkYXRhKSA9PiB0aGlzLm9uU2lnbkluKHNvY2tldCwgZGF0YS51c2VybmFtZSwgZGF0YS5wYXNzd29yZCkpO1xyXG5cdFx0c29ja2V0Lm9uKCdzaWdub3V0JywgKCkgPT4gdGhpcy5vblNpZ25PdXQoc29ja2V0KSk7XHJcblx0XHQvLyBUZWxsIGNsaWVudCB0aGV5IGhhdmUgY29ubmVjdGVkXHJcblx0fVxyXG5cclxuXHRhc3luYyBvbkRpc2Nvbm5lY3Qoc29ja2V0KSB7XHJcblx0XHRpZiAoc29ja2V0LnBsYXllcklkICE9IG51bGwgJiYgZ2FtZS5wbGF5ZXJzW3NvY2tldC5wbGF5ZXJJZF0pIGF3YWl0IHRoaXMub25Mb2dPdXQoc29ja2V0KTtcclxuXHRcdGlmIChzb2NrZXQuYWNjb3VudElkICYmIHRoaXMuYWN0aXZlQWNjb3VudHNbc29ja2V0LmFjY291bnRJZF0pIGF3YWl0IHRoaXMub25TaWduT3V0KHNvY2tldCk7XHJcblxyXG5cdFx0ZGIubG9nKGAke3NvY2tldC5pZH0gLSBTb2NrZXQgZGlzY29ubmVjdGVkLmApO1xyXG5cdFx0ZGVsZXRlIHRoaXMuc29ja2V0TGlzdFtzb2NrZXQuaWRdO1xyXG5cdH1cclxuXHJcblx0YXN5bmMgb25TaWduVXAoc29ja2V0LCB1c2VybmFtZSwgcGFzc3dvcmQsIGVtYWlsKSB7XHJcblx0XHRsZXQgYWNjb3VudElkID0gYXdhaXQgZGIuYWRkQWNjb3VudCh1c2VybmFtZSwgcGFzc3dvcmQsIGVtYWlsKTtcclxuXHRcdGlmIChhY2NvdW50SWQpIHtcclxuXHRcdFx0ZGIubG9nKGAke3NvY2tldC5pZH0gLSBBY2NvdW50IGFkZGVkOiAke3VzZXJuYW1lfWApO1xyXG5cdFx0XHRzb2NrZXQuZW1pdCgnc2lnbmVkVXAnLCB7dXNlcm5hbWUsIHBhc3N3b3JkfSk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0c29ja2V0LmVtaXQoJ3NpZ25lZFVwJywgbnVsbCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRhc3luYyBvblNpZ25Jbihzb2NrZXQsIHVzZXJuYW1lLCBwYXNzd29yZCkge1xyXG5cdFx0bGV0IHN1Y2Nlc3MgPSBhd2FpdCBkYi5hdXRoQWNjb3VudCh1c2VybmFtZSwgcGFzc3dvcmQpO1xyXG5cdFx0aWYgKCFzdWNjZXNzKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGBTaWduIGluIGZhaWxlZCBvbiB1c2VybmFtZSAke3VzZXJuYW1lfWApO1xyXG5cdFx0XHRzb2NrZXQuZW1pdCgnc2lnbmVkSW4nLCBmYWxzZSk7XHQvLyBUZWxsIGNsaWVudCBzaWduaW4gd2FzIG5vdCBzdWNjZXNzZnVsXHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgYWNjb3VudCA9IGF3YWl0IGRiLmdldEFjY291bnRCeVVzZXJuYW1lKHVzZXJuYW1lKTtcclxuXHRcdGlmICh0aGlzLmFjdGl2ZUFjY291bnRzW2FjY291bnQuX2lkXSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIlRoYXQgYWNjb3VudCBpcyBhbHJlYWR5IHNpZ25lZCBpbi5cIik7XHJcblx0XHRcdHNvY2tldC5lbWl0KCdzaWduZWRJbicsIGZhbHNlKTtcdC8vIFRlbGwgY2xpZW50IHRoYXQgYWNjb3VudCBpcyBhbHJlYWR5IHNpZ25lZCBpblxyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHNvY2tldC5hY2NvdW50SWQgPSBhY2NvdW50Ll9pZDtcclxuXHRcdHRoaXMuYWN0aXZlQWNjb3VudHNbYWNjb3VudC5faWRdID0gdXNlcm5hbWU7XHJcblxyXG5cdFx0c29ja2V0Lm9uKCdhZGRQbGF5ZXInLCAoZGF0YSkgPT4gdGhpcy5vbkFkZFBsYXllcihzb2NrZXQsIGRhdGEubmFtZSwgZGF0YS50ZW1wbGF0ZUlkKSk7XHJcblx0XHRzb2NrZXQub24oJ2xvZ2luJywgKG5hbWUpID0+IHRoaXMub25Mb2dJbihzb2NrZXQsIG5hbWUpKTtcclxuXHRcdHNvY2tldC5vbignbG9nb3V0JywgKCkgPT4gdGhpcy5vbkxvZ091dChzb2NrZXQpKTtcclxuXHRcdHNvY2tldC5vbignYWRkUGxheWVyVGVtcGxhdGUnLCAoZGF0YSkgPT4gdGhpcy5vbkFkZFBsYXllclRlbXBsYXRlKGRhdGEpKTtcclxuXHJcblx0XHRkYi5sb2coYCR7c29ja2V0LmlkfSAtICR7dXNlcm5hbWV9IHNpZ25lZCBpbi5gKTtcclxuXHRcdGxldCBwbGF5ZXJzID0gYXdhaXQgZGIuZ2V0UGxheWVyc0J5QWNjb3VudChhY2NvdW50Ll9pZCk7XHJcblx0XHRsZXQgcGxheWVyVGVtcGxhdGVzID0gYXdhaXQgZGIuZ2V0QWxsUGxheWVyVGVtcGxhdGVzKCk7XHJcblx0XHRzb2NrZXQuZW1pdCgnc2lnbmVkSW4nLCB7YWNjb3VudCwgcGxheWVycywgcGxheWVyVGVtcGxhdGVzfSk7XHJcblx0fVxyXG5cdFxyXG5cdGFzeW5jIG9uU2lnbk91dChzb2NrZXQpIHtcclxuXHRcdGlmIChzb2NrZXQucGxheWVySWQgIT0gbnVsbCkgYXdhaXQgdGhpcy5vbkxvZ091dChzb2NrZXQpO1xyXG5cdFx0XHJcblx0XHRpZiAoc29ja2V0LmFjY291bnRJZCkge1xyXG5cdFx0XHRjb25zdCB1c2VybmFtZSA9IHRoaXMuYWN0aXZlQWNjb3VudHNbc29ja2V0LmFjY291bnRJZF07XHJcblx0XHRcdGRiLmxvZyhgJHtzb2NrZXQuaWR9IC0gJHt1c2VybmFtZX0gc2lnbmVkIG91dC5gKTtcclxuXHRcdFx0ZGVsZXRlIHRoaXMuYWN0aXZlQWNjb3VudHNbc29ja2V0LmFjY291bnRJZF07XHJcblx0XHRcdHNvY2tldC5hY2NvdW50SWQgPSBudWxsO1xyXG5cdFx0XHRzb2NrZXQuZW1pdCgnc2lnbmVkT3V0Jyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRhc3luYyBvbkFkZFBsYXllcihzb2NrZXQsIG5hbWUsIHRlbXBsYXRlSWQpIHtcclxuXHRcdGxldCBwbGF5ZXJJZCA9IGF3YWl0IGRiLmFkZFBsYXllcihzb2NrZXQuYWNjb3VudElkLCBuYW1lLCB0ZW1wbGF0ZUlkKTtcclxuXHRcdGlmIChwbGF5ZXJJZCkge1xyXG5cdFx0XHRjb25zdCB1c2VybmFtZSA9IHRoaXMuYWN0aXZlQWNjb3VudHNbc29ja2V0LmFjY291bnRJZF07XHJcblx0XHRcdGRiLmxvZyhgJHtzb2NrZXQuaWR9IC0gJHtuYW1lfSBoYXMgYmVlbiBhZGRlZCBhcyBhIHBsYXllciB0byBhY2NvdW50ICR7dXNlcm5hbWV9LmApO1xyXG5cdFx0XHRzb2NrZXQuZW1pdCgncGxheWVyQWRkZWQnLCBwbGF5ZXJJZCk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0c29ja2V0LmVtaXQoJ3BsYXllckFkZGVkJywgbnVsbCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGFzeW5jIG9uQWRkUGxheWVyVGVtcGxhdGUoZGF0YSkge1xyXG5cdFx0bGV0IHN1Y2Nlc3MgPSBhd2FpdCBkYi5hZGRQbGF5ZXJUZW1wbGF0ZShkYXRhKTtcclxuXHRcdGlmIChzdWNjZXNzKSB7XHJcblx0XHRcdGdhbWUubG9hZFBsYXllclRlbXBsYXRlcygpO1xyXG5cdFx0XHRkYi5sb2coYCR7c29ja2V0LmlkfSAtICR7ZGF0YS5uYW1lfSBoYXMgYmVlbiBhZGRlZCBhcyBhIHBsYXllciB0ZW1wbGF0ZS5gKTtcclxuXHRcdFx0Ly8gVGVsbCBjbGllbnQgYWRkIHBsYXllciB3YXMgc3VjY2Vzc2Z1bFxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdC8vIFRlbGwgY2xpZW50IGFkZCBwbGF5ZXIgd2FzIG5vdCBzdWNjZXNzZnVsXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRhc3luYyBvbkxvZ0luKHNvY2tldCwgcGxheWVySWQpIHtcclxuXHRcdGlmICghc29ja2V0LmFjY291bnRJZCkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIk5vdCBzaWduZWQgaW50byBhY2NvdW50LlwiKTtcclxuXHRcdFx0c29ja2V0LmVtaXQoJ2xvZ2dlZEluJywgZmFsc2UpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRpZiAoc29ja2V0LnBsYXllcklkICE9IG51bGwpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJBbHJlYWR5IGxvZ2dlZCBpbi5cIik7XHJcblx0XHRcdHNvY2tldC5lbWl0KCdsb2dnZWRJbicsIGZhbHNlKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBwbGF5ZXJEYXRhID0gYXdhaXQgZGIuZ2V0UGxheWVyKHBsYXllcklkKTtcclxuXHRcdGlmICghcGxheWVyRGF0YSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIk5vIHBsYXllciB3aXRoIHRoYXQgbmFtZS5cIik7XHJcblx0XHRcdHNvY2tldC5lbWl0KCdsb2dnZWRJbicsIGZhbHNlKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChcIlwiK3NvY2tldC5hY2NvdW50SWQgIT09IFwiXCIrcGxheWVyRGF0YS5hY2NvdW50KSB7XHQvLyBDYXN0IHRvIHN0cmluZyBiZWZvcmUgY29tcGFyaXNvblxyXG5cdFx0XHRkYi5sb2coYEF0dGVtcHQgdG8gbG9naW4gdG8gcGxheWVyICgke3BsYXllckRhdGEubmFtZX0pIGZyb20gd3JvbmcgYWNjb3VudCAoJHtzb2NrZXQuYWNjb3VudElkfSkgb24gc29ja2V0ICR7c29ja2V0LmlkfS5gKTtcclxuXHRcdFx0c29ja2V0LmVtaXQoJ2xvZ2dlZEluJywgZmFsc2UpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgcGxheWVyID0gZ2FtZS5wbGF5ZXJMb2dpbihzb2NrZXQuaWQsIHBsYXllckRhdGEpO1xyXG5cdFx0aWYgKCFwbGF5ZXIpIHtcclxuXHRcdFx0c29ja2V0LmVtaXQoJ2xvZ2dlZEluJywgZmFsc2UpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHJcblx0XHRzb2NrZXQucGxheWVySWQgPSBwbGF5ZXIuZ2FtZUlkO1xyXG5cdFx0c29ja2V0Lm9uKCdpbnB1dCcsIChkYXRhKSA9PiBwbGF5ZXIuaW5wdXREYXRhKGRhdGEpKTtcclxuXHRcdHNvY2tldC5vbigndXBsb2FkTWFwJywgKGRhdGEpID0+IHtcclxuXHRcdFx0aWYgKHBsYXllci5hZG1pbkFjY2VzcyA+PSAyKSB0aGlzLm9uVXBsb2FkTWFwKGRhdGEpO1xyXG5cdFx0XHRlbHNlIGdhbWUuc2VuZEdhbWVJbmZvUGxheWVyKHBsYXllci5nYW1lSWQsIGBZb3UgZG9uJ3QgaGF2ZSBhY2Nlc3MgdG8gdGhhdCBjb21tYW5kLmApO1xyXG5cdFx0fSk7XHJcblx0XHRjb25zdCBtYXBEYXRhID0gZ2FtZS5tYXBzW3BsYXllci5tYXBJZF0uZ2V0UGFjaygpO1xyXG5cdFx0c29ja2V0LmVtaXQoJ2xvZ2dlZEluJywgbWFwRGF0YSk7XHJcblx0fVxyXG5cdFxyXG5cdGFzeW5jIG9uTG9nT3V0KHNvY2tldCkge1xyXG5cdFx0aWYgKHNvY2tldC5wbGF5ZXJJZCAhPSBudWxsKSB7XHJcblx0XHRcdGF3YWl0IGdhbWUucGxheWVyTG9nb3V0KHNvY2tldC5wbGF5ZXJJZCk7XHJcblx0XHRcdHNvY2tldC5wbGF5ZXJJZCA9IG51bGw7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGFzeW5jIG9uVXBsb2FkTWFwKGRhdGEpIHtcclxuXHRcdGxldCBzdWNjZXNzID0gYXdhaXQgZGIuc2F2ZU1hcChkYXRhKTtcclxuXHRcdGlmICghc3VjY2Vzcykge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIkZhaWxlZCB0byB1cGxvYWQgbWFwLlwiKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0Z2FtZS5tYXBzW2RhdGEubWFwSWRdLnVwbG9hZChkYXRhKTtcclxuXHRcdFxyXG5cdFx0Z2FtZS5wbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xyXG5cdFx0XHRpZiAocGxheWVyLm1hcElkID09PSBkYXRhLm1hcElkKSB7XHJcblx0XHRcdFx0dGhpcy5zZW5kTWFwRGF0YSh0aGlzLnNvY2tldExpc3RbcGxheWVyLnNvY2tldElkXSwgcGxheWVyLm1hcElkKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHQvLyBTZW5kIGRhdGEgdG8gY2xpZW50c1xyXG5cdHNlbmRVcGRhdGVQYWNrKHVwZGF0ZVBhY2spIHtcclxuXHRcdGdhbWUucGxheWVycy5mb3JFYWNoKHBsYXllciA9PiB7XHJcblx0XHRcdGNvbnN0IHBhY2sgPSB7XHJcblx0XHRcdFx0Z2FtZToge1xyXG5cdFx0XHRcdFx0cGxheWVyczogW10sXHJcblx0XHRcdFx0XHRib3RzOiBbXSxcclxuXHRcdFx0XHRcdGl0ZW1zOiBbXSxcclxuXHRcdFx0XHRcdGVmZmVjdHM6IFtdLFxyXG5cdFx0XHRcdFx0dGV4dHM6IFtdXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRtZW51OiBwbGF5ZXIuZ2V0VUlQYWNrKCksXHJcblx0XHRcdFx0Y2hhdGJveDoge31cclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdGZvciAobGV0IHBsYXllckRhdGEgb2YgdXBkYXRlUGFjay5wbGF5ZXJzKSB7XHJcblx0XHRcdFx0aWYgKHBsYXllckRhdGEgJiYgKChwbGF5ZXJEYXRhLm1hcElkID09PSBwbGF5ZXIubWFwSWQgJiYgcGxheWVyRGF0YS5pc1Zpc2libGUpIHx8IHBsYXllckRhdGEuc29ja2V0SWQgPT09IHBsYXllci5zb2NrZXRJZCkpIHtcclxuXHRcdFx0XHRcdHBhY2suZ2FtZS5wbGF5ZXJzW3BsYXllckRhdGEuZ2FtZUlkXSA9IHBsYXllckRhdGE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGZvciAobGV0IGJvdCBvZiB1cGRhdGVQYWNrLmJvdHMpIHtcclxuXHRcdFx0XHRpZiAoYm90ICYmIGJvdC5tYXBJZCA9PT0gcGxheWVyLm1hcElkKSBwYWNrLmdhbWUuYm90c1tib3QuZ2FtZUlkXSA9IGJvdDtcclxuXHRcdFx0fVxyXG5cdFx0XHRmb3IgKGxldCBpdGVtIG9mIHVwZGF0ZVBhY2suaXRlbXMpIHtcclxuXHRcdFx0XHRpZiAoaXRlbSAmJiBpdGVtLm1hcElkID09PSBwbGF5ZXIubWFwSWQpIHBhY2suZ2FtZS5pdGVtc1tpdGVtLmdhbWVJZF0gPSBpdGVtO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZvciAobGV0IGVmZmVjdCBvZiB1cGRhdGVQYWNrLmVmZmVjdHMpIHtcclxuXHRcdFx0XHRpZiAoZWZmZWN0ICYmIGVmZmVjdC5tYXBJZCA9PT0gcGxheWVyLm1hcElkKSBwYWNrLmdhbWUuZWZmZWN0c1tlZmZlY3QuZ2FtZUlkXSA9IGVmZmVjdDtcclxuXHRcdFx0fVxyXG5cdFx0XHRmb3IgKGxldCB0ZXh0IG9mIHVwZGF0ZVBhY2sudGV4dHMpIHtcclxuXHRcdFx0XHRpZiAodGV4dCAmJiB0ZXh0Lm1hcElkID09PSBwbGF5ZXIubWFwSWQpIHBhY2suZ2FtZS50ZXh0c1t0ZXh0LmdhbWVJZF0gPSB0ZXh0O1xyXG5cdFx0XHR9XHJcblxyXG5cclxuLyogXHRcdFx0cGFjay5nYW1lLnBsYXllcnMgPSB1cGRhdGVQYWNrLnBsYXllcnMuZmlsdGVyKHBsYXllckRhdGEgPT4gcGxheWVyRGF0YS5zb2NrZXRJZCA9PT0gcGxheWVyLnNvY2tldElkIHx8IChwbGF5ZXJEYXRhLm1hcElkID09PSBwbGF5ZXIubWFwSWQgJiYgcGxheWVyRGF0YS5pc1Zpc2libGUpKTtcclxuXHRcdFx0cGFjay5nYW1lLmJvdHMgPSB1cGRhdGVQYWNrLmJvdHMuZmlsdGVyKGJvdCA9PiBib3QubWFwSWQgPT09IHBsYXllci5tYXBJZCk7XHJcblx0XHRcdHBhY2suZ2FtZS5pdGVtcyA9IHVwZGF0ZVBhY2suaXRlbXMuZmlsdGVyKGl0ZW0gPT4gaXRlbS5tYXBJZCA9PT0gcGxheWVyLm1hcElkKTtcclxuXHRcdFx0cGFjay5nYW1lLmVmZmVjdHMgPSB1cGRhdGVQYWNrLmVmZmVjdHMuZmlsdGVyKGVmZmVjdCA9PiBlZmZlY3QubWFwSWQgPT09IHBsYXllci5tYXBJZCk7XHJcblx0XHRcdHBhY2suZ2FtZS50ZXh0cyA9IHVwZGF0ZVBhY2sudGV4dHMuZmlsdGVyKHRleHQgPT4gdGV4dC5tYXBJZCA9PT0gcGxheWVyLm1hcElkKTsgKi9cclxuXHJcblx0XHRcdHBhY2suY2hhdGJveC5tZXNzYWdlcyA9IHVwZGF0ZVBhY2subWVzc2FnZXMuZmlsdGVyKG1lc3NhZ2UgPT4ge1xyXG5cdFx0XHRcdHJldHVybiAobWVzc2FnZS5tYXBJZCA9PSBudWxsICYmIG1lc3NhZ2UuaWQgPT0gbnVsbCkgfHwgcGxheWVyLm1hcElkID09PSBtZXNzYWdlLm1hcElkIHx8IHBsYXllci5nYW1lSWQgPT09IG1lc3NhZ2UuaWQ7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRcclxuXHRcdFx0dGhpcy5zb2NrZXRMaXN0W3BsYXllci5zb2NrZXRJZF0uZW1pdCgndXBkYXRlJywgcGFjayk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0XHJcblx0c2VuZE1hcERhdGEoc29ja2V0LCBtYXBJZCkge1xyXG5cdFx0Y29uc3QgbWFwRGF0YSA9IGdhbWUubWFwc1ttYXBJZF0uZ2V0UGFjaygpO1xyXG5cdFx0c29ja2V0LmVtaXQoJ2xvYWRNYXAnLCBtYXBEYXRhKTtcclxuXHR9XHJcbn1cclxuXHJcbmNvbnN0IHNlcnZlciA9IG5ldyBTZXJ2ZXIoKTtcclxuZXhwb3J0IGRlZmF1bHQgc2VydmVyO1xyXG4iLCJmdW5jdGlvbiBjcmVhdGUyZEFycmF5KGNvbHVtbnMsIHJvd3MsIGRlZmF1bHRWYWx1ZSkge1xyXG4gIGNvbnN0IGFycmF5ID0gW107XHJcbiAgZm9yIChsZXQgeSA9IDA7IHkgPCByb3dzOyB5KyspIHtcclxuICAgIGFycmF5W3ldID0gW107XHJcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IGNvbHVtbnM7IHgrKykge1xyXG4gICAgICBhcnJheVt5XVt4XSA9IGRlZmF1bHRWYWx1ZTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGFycmF5O1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGUzZEFycmF5KGNvbHVtbnMsIHJvd3MsIGxheWVycywgZGVmYXVsdFZhbHVlKSB7XHJcbiAgY29uc3QgYXJyYXkgPSBbXTtcclxuICBmb3IgKGxldCB6ID0gMDsgeiA8IGxheWVyczsgeisrKSB7XHJcbiAgICBhcnJheVt6XSA9IFtdOyBcclxuICAgIGZvciAobGV0IHkgPSAwOyB5IDwgcm93czsgeSsrKSB7XHJcbiAgICAgIGFycmF5W3pdW3ldID0gW107XHJcbiAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgY29sdW1uczsgeCsrKSB7XHJcbiAgICAgICAgYXJyYXlbel1beV1beF0gPSBkZWZhdWx0VmFsdWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGFycmF5O1xyXG59XHJcblxyXG5mdW5jdGlvbiBzaHVmZmxlKGFycmF5KSB7XHJcbiAgbGV0IGN1cnJlbnRJbmRleCA9IGFycmF5Lmxlbmd0aDtcclxuICBsZXQgdGVtcDtcclxuICBsZXQgcmFuZG9tSW5kZXg7XHJcbiAgd2hpbGUgKGN1cnJlbnRJbmRleCAhPT0gMCkge1xyXG4gICAgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyZW50SW5kZXgpO1xyXG4gICAgY3VycmVudEluZGV4IC09IDE7XHJcbiAgICB0ZW1wID0gYXJyYXlbY3VycmVudEluZGV4XTtcclxuICAgIGFycmF5W2N1cnJlbnRJbmRleF0gPSBhcnJheVtyYW5kb21JbmRleF07XHJcbiAgICBhcnJheVtyYW5kb21JbmRleF0gPSB0ZW1wO1xyXG4gIH1cclxuICByZXR1cm4gYXJyYXk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN3YXAoYXJyYXksIGksIGopIHtcclxuICBjb25zdCB0ZW1wID0gYXJyYXlbaV07XHJcbiAgYXJyYXlbaV0gPSBhcnJheVtqXTtcclxuICBhcnJheVtqXSA9IHRlbXA7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpcnN0RW1wdHlJbmRleChhcnJheSkge1xyXG4gIGlmIChhcnJheS5sZW5ndGggPCAxKSByZXR1cm4gMDtcclxuICBcclxuICBmb3IgKGxldCBpID0gMDsgaSA8PSBhcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgaWYgKGFycmF5W2ldID09IG51bGwpIHJldHVybiBpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbGVycChzdGFydCwgZW5kLCB0aW1lKSB7XHJcbiAgLy9yZXR1cm4gc3RhcnQgKyAodGltZSAqIChlbmQgLSBzdGFydCkpO1xyXG4gIHJldHVybiAoKDEgLSB0aW1lKSAqIHN0YXJ0KSArICh0aW1lICogZW5kKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2xhbXAodmFsdWUsIG1pbmltdW0sIG1heGltdW0pIHtcclxuICBpZiAodmFsdWUgPCBtaW5pbXVtKSB7XHJcbiAgICByZXR1cm4gbWluaW11bTtcclxuICB9XHJcbiAgZWxzZSBpZiAodmFsdWUgPiBtYXhpbXVtKSB7XHJcbiAgICByZXR1cm4gbWF4aW11bTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiByYW5kb21JbnQobWluaW11bSwgbWF4aW11bSkge1xyXG4gIHJldHVybiBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogKG1heGltdW0gKyAxKSkgKyBtaW5pbXVtKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0WEZyb21JbmRleChpbmRleCwgY29sdW1ucykge1xyXG4gIHJldHVybiBpbmRleCAlIGNvbHVtbnM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFlGcm9tSW5kZXgoaW5kZXgsIGNvbHVtbnMpIHtcclxuICByZXR1cm4gKGluZGV4IC0gKGluZGV4ICUgY29sdW1ucykpIC8gY29sdW1ucztcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0SW5kZXhGcm9tWFkoeCwgeSwgY29sdW1ucykge1xyXG4gIHJldHVybiAoeSAqIGNvbHVtbnMpICsgeDtcclxufVxyXG5cclxuZnVuY3Rpb24gdGltZXN0YW1wKGRhdGUpIHtcclxuICBpZiAoIShkYXRlIGluc3RhbmNlb2YgRGF0ZSkpIHJldHVybiBcIkludmFsaWQgZGF0ZVwiO1xyXG4gIGxldCBtb250aCA9IGRhdGUuZ2V0TW9udGgoKSArIDE7XHJcbiAgbGV0IGRheSA9IGRhdGUuZ2V0RGF0ZSgpO1xyXG4gIGxldCBob3VyID0gZGF0ZS5nZXRIb3VycygpO1xyXG4gIGxldCBtaW51dGUgPSBkYXRlLmdldE1pbnV0ZXMoKTtcclxuICBsZXQgc2Vjb25kID0gZGF0ZS5nZXRTZWNvbmRzKCk7XHJcbiAgaWYgKG1vbnRoIDwgMTApIG1vbnRoID0gXCIwXCIgKyBtb250aDtcclxuICBpZiAoZGF5IDwgMTApIGRheSA9IFwiMFwiICsgZGF5O1xyXG4gIGlmIChob3VyIDwgMTApIGhvdXIgPSBcIjBcIiArIGhvdXI7XHJcbiAgaWYgKG1pbnV0ZSA8IDEwKSBtaW51dGUgPSBcIjBcIiArIG1pbnV0ZTtcclxuICBpZiAoc2Vjb25kIDwgMTApIHNlY29uZCA9IFwiMFwiICsgc2Vjb25kO1xyXG4gIHJldHVybiBgJHtkYXRlLmdldEZ1bGxZZWFyKCl9LSR7bW9udGh9LSR7ZGF5fSAke2hvdXJ9OiR7bWludXRlfToke3NlY29uZH1gO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbmRlZmluaXRlQXJ0aWNsZSh3b3JkKSB7XHJcblx0bGV0IHJlZ2V4ID0gL3Ryb3VzZXJzJHxqZWFucyR8Z2xhc3NlcyQvaTtcclxuXHRpZiAod29yZC5tYXRjaChyZWdleCkpIHJldHVybiBcImEgcGFpciBvZiBcIiArIHdvcmQ7XHJcblxyXG5cdHJlZ2V4ID0gL15bYWVpb3VdL2k7XHJcblx0aWYgKHdvcmQubWF0Y2gocmVnZXgpKSByZXR1cm4gXCJhbiBcIiArIHdvcmQ7XHJcblxyXG5cdHJldHVybiBcImEgXCIgKyB3b3JkO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwbHVyYWwod29yZCkge1xyXG5cdGxldCByZWdleCA9IC9zaGVlcCR8ZGVlciR8ZmlzaCQvaTtcclxuXHRpZiAod29yZC5tYXRjaChyZWdleCkpIHJldHVybiB3b3JkO1xyXG5cclxuXHRyZWdleCA9IC90cm91c2VycyR8amVhbnMkfGdsYXNzZXMkL2k7XHJcblx0aWYgKHdvcmQubWF0Y2gocmVnZXgpKSByZXR1cm4gXCJwYWlycyBvZiBcIiArIHdvcmQ7XHJcblx0XHJcblx0cmVnZXggPSAvc3RvbWFjaCR8ZXBvY2gkfC9pO1xyXG5cdGlmICh3b3JkLm1hdGNoKHJlZ2V4KSkgcmV0dXJuIHdvcmQgKyBcInNcIjtcclxuXHRcclxuXHRyZWdleCA9IC9mJHxmZSQvaTtcclxuXHRpZiAod29yZC5tYXRjaChyZWdleCkpIHJldHVybiB3b3JkLnJlcGxhY2UocmVnZXgsIFwidmVzXCIpO1xyXG5cclxuXHRyZWdleCA9IC9bc3h6XSR8Y2gkfHNoJHxhdG8kL2k7XHJcblx0aWYgKHdvcmQubWF0Y2gocmVnZXgpKSByZXR1cm4gd29yZCArIFwiZXNcIjtcclxuXHRcclxuXHRyZWdleCA9IC95JC9pO1xyXG5cdGlmICh3b3JkLm1hdGNoKHJlZ2V4KSkgcmV0dXJuIHdvcmQucmVwbGFjZShyZWdleCwgXCJpZXNcIik7XHJcblx0XHJcblx0cmV0dXJuIHdvcmQgKyBcInNcIjtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIGNyZWF0ZTJkQXJyYXksXHJcbiAgY3JlYXRlM2RBcnJheSxcclxuICBzaHVmZmxlLFxyXG4gIHN3YXAsXHJcbiAgZmlyc3RFbXB0eUluZGV4LFxyXG4gIGxlcnAsXHJcbiAgY2xhbXAsXHJcbiAgcmFuZG9tSW50LFxyXG4gIGdldFhGcm9tSW5kZXgsXHJcbiAgZ2V0WUZyb21JbmRleCxcclxuICBnZXRJbmRleEZyb21YWSxcclxuICB0aW1lc3RhbXAsXHJcbiAgaW5kZWZpbml0ZUFydGljbGUsXHJcbiAgcGx1cmFsXHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImJjcnlwdFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJleHByZXNzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImZzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImh0dHBcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibW9uZ29vc2VcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibm9kZS1nYW1lbG9vcFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXRoXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInNvY2tldC5pb1wiKTsiXSwic291cmNlUm9vdCI6IiJ9
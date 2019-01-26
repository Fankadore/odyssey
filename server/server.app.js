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
		console.log(`${this.name} - ${this.health}`);
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
		.select('name sprite reusable type passiveDamage passiveDefence passiveHealthMax passiveEnergyMaxBase passiveHealthRegen passiveEnergyRegen passiveRange equippedDamage equippedDefence equippedHealthMax equippedEnergyMaxBase equippedHealthRegen equippedEnergyRegen equippedRange')
		.populate('type')
		.exec()
		.then(template => template)
		.catch(err => console.log(err));
	}
	async getAllItemTemplates() {
		return await _models_itemTemplate_js__WEBPACK_IMPORTED_MODULE_10__["default"].find({})
		.select('_id name sprite reusable type passiveDamage passiveDefence passiveHealthMax passiveEnergyMaxBase passiveHealthRegen passiveEnergyRegen passiveRange equippedDamage equippedDefence equippedHealthMax equippedEnergyMaxBase equippedHealthRegen equippedEnergyRegen equippedRange')
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
	type: {type: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.SchemaTypes.ObjectId, ref: 'ItemType', required: true},
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL2FjdG9yLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy9ib3QuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL2VmZmVjdC5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2NsYXNzZXMvZW50aXR5LmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy9pdGVtLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvY2xhc3Nlcy9tYXAuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL21lc3NhZ2UuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9jbGFzc2VzL3BsYXllci5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2NsYXNzZXMvdGV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2NvbmZpZy5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2RiLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvZ2FtZS5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL2dhbWVsb29wLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL21vZGVscy9hY2NvdW50LmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvbW9kZWxzL2JvdC5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL21vZGVscy9ib3RUZW1wbGF0ZS5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL21vZGVscy9pdGVtLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvbW9kZWxzL2l0ZW1UZW1wbGF0ZS5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL21vZGVscy9pdGVtVHlwZS5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvc3JjL21vZGVscy9tYXAuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3NyYy9tb2RlbHMvcGxheWVyLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvbW9kZWxzL3BsYXllclRlbXBsYXRlLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvc2VydmVyLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zcmMvdXRpbC5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJiY3J5cHRcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJleHByZXNzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZnNcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJodHRwXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibW9uZ29vc2VcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJub2RlLWdhbWVsb29wXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicGF0aFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInNvY2tldC5pb1wiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxpQkFBaUIsc0JBQXNCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsbUJBQW1CO0FBQ25CO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwrREFBK0Q7O0FBRS9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxzQkFBc0I7QUFDdEIsR0FBRzs7QUFFSDs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixVQUFVLEtBQUssWUFBWTtBQUM1QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEU7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJOztBQUVKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7O0FBRUo7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILGlCQUFpQixxQkFBcUI7QUFDdEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxvQkFBb0IsMEVBQThCO0FBQ2xEO0FBQ0Esa0JBQWtCLHNCQUFzQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsdUZBQTJDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0VBQWtFO0FBQ2xFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdHFCQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0Esc0JBQXNCO0FBQ3RCOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsMEVBQThCO0FBQ2xEO0FBQ0E7O0FBRUEsaUJBQWlCLHNCQUFzQjtBQUN2QztBQUNBLHFCQUFxQiwwRUFBOEI7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2xPQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEU7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQzNEQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDYkE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdkxBO0FBQ0E7O0FBRUE7QUFDQSw2QkFBNkI7QUFDN0I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUNwRUE7QUFDQTtBQUNBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNUQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtSEFBdUUsV0FBVztBQUNsRjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMxTUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNwRUE7QUFBQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDeEJBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esd0ZBQWlELHNCQUFzQjs7QUFFdkU7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSixHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKLEdBQUc7QUFDSDtBQUNBO0FBQ0EsMEZBQXVDLG1CQUFtQjtBQUMxRDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3BKQSxtQzs7Ozs7Ozs7Ozs7QUNBQSxvQzs7Ozs7Ozs7Ozs7QUNBQSwrQjs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSxxQzs7Ozs7Ozs7Ozs7QUNBQSwwQzs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSxzQyIsImZpbGUiOiJzZXJ2ZXIuYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zZXJ2ZXIvc3JjL21haW4uanNcIik7XG4iLCJpbXBvcnQgZ2FtZSBmcm9tICcuLi9nYW1lLmpzJztcclxuaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9jb25maWcuanMnO1xyXG5pbXBvcnQgdXRpbCBmcm9tICcuLi91dGlsLmpzJztcclxuaW1wb3J0IEVudGl0eSBmcm9tICcuL2VudGl0eS5qcyc7XHJcblxyXG4vLyBBbiBBY3RvciBpcyBhbiBFbnRpdHkgd2hpY2ggY2FuIG1vdmUsIGF0dGFjayBhbmQgaW50ZXJhY3Qgd2l0aCBpdGVtc1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWN0b3IgZXh0ZW5kcyBFbnRpdHkge1xyXG5cdGNvbnN0cnVjdG9yKG1hcElkLCB4LCB5LCBkaXJlY3Rpb24sIG5hbWUsIHNwcml0ZSkge1xyXG5cdFx0c3ByaXRlID0gdXRpbC5jbGFtcChzcHJpdGUsIDEsIGNvbmZpZy5NQVhfU1BSSVRFUyk7XHJcblxyXG5cdFx0c3VwZXIobWFwSWQsIHgsIHksIHNwcml0ZSk7XHJcblx0XHR0aGlzLm5hbWUgPSBuYW1lO1xyXG5cdFx0dGhpcy5kZXNjcmlwdGlvbiA9IFwiXCI7XHJcblxyXG5cdFx0dGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XHJcblx0XHR0aGlzLnN0YXJ0WCA9IHRoaXMueDtcclxuXHRcdHRoaXMuc3RhcnRZID0gdGhpcy55O1xyXG5cdFx0dGhpcy5kZXN0aW5hdGlvblggPSB0aGlzLng7XHJcblx0XHR0aGlzLmRlc3RpbmF0aW9uWSA9IHRoaXMueTtcclxuXHRcdHRoaXMubGVycCA9IDA7XHJcblxyXG5cdFx0dGhpcy5pc01vdmluZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy5pc1J1bm5pbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMubW92ZVNwZWVkID0gMi41O1xyXG5cdFx0dGhpcy5tb3ZlbWVudFRpbWVyID0gMDtcclxuXHRcdHRoaXMubGF6aW5lc3MgPSAwO1xyXG5cclxuXHRcdHRoaXMuaXNBdHRhY2tpbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMuYXR0YWNrU3BlZWQgPSAxO1xyXG5cdFx0dGhpcy5hdHRhY2tUaW1lciA9IDA7XHRcclxuXHRcdHRoaXMudGFyZ2V0ID0gbnVsbDtcclxuXHRcdHRoaXMua2lsbHMgPSAwO1xyXG5cclxuXHRcdHRoaXMuaGVhbHRoID0gdGhpcy5oZWFsdGhNYXg7XHJcblx0XHR0aGlzLmVuZXJneSA9IHRoaXMuZW5lcmd5TWF4O1xyXG5cdFx0dGhpcy5yZWdlblRpbWVyID0gMDtcclxuXHRcdHRoaXMuaXNIaXQgPSBmYWxzZTtcclxuXHJcblx0XHR0aGlzLmNhbGNCb251c1N0YXRzKCk7XHJcblx0fVxyXG5cdFxyXG5cdC8vIENoYXJhY3RlciBTdGF0c1xyXG5cdGdldCBkYW1hZ2UoKSB7XHJcblx0XHRsZXQgZGFtYWdlVG90YWwgPSB0aGlzLmRhbWFnZUJhc2UgKyB0aGlzLmRhbWFnZUJvbnVzO1xyXG5cdFx0cmV0dXJuIChkYW1hZ2VUb3RhbCA8IDApID8gMCA6IGRhbWFnZVRvdGFsO1xyXG5cdH1cclxuXHRnZXQgZGVmZW5jZSgpIHtcclxuXHRcdGxldCBkZWZlbmNlVG90YWwgPSB0aGlzLmRlZmVuY2VCYXNlICsgdGhpcy5kZWZlbmNlQm9udXM7XHJcblx0XHRyZXR1cm4gKGRlZmVuY2VUb3RhbCA8IDApID8gMCA6IGRlZmVuY2VUb3RhbDtcclxuXHR9XHJcblx0Z2V0IGhlYWx0aE1heCgpIHtcclxuXHRcdGxldCBoZWFsdGhNYXhUb3RhbCA9IHRoaXMuaGVhbHRoTWF4QmFzZSArIHRoaXMuaGVhbHRoTWF4Qm9udXNcclxuXHRcdHJldHVybiAoaGVhbHRoTWF4VG90YWwgPCAxKSA/IDEgOiBoZWFsdGhNYXhUb3RhbDtcclxuXHR9XHJcblx0Z2V0IGVuZXJneU1heCgpIHtcclxuXHRcdGxldCBlbmVyZ3lNYXhUb3RhbCA9IHRoaXMuZW5lcmd5TWF4QmFzZSArIHRoaXMuZW5lcmd5TWF4Qm9udXM7XHJcblx0XHRyZXR1cm4gKGVuZXJneU1heFRvdGFsIDwgMCkgPyAwIDogZW5lcmd5TWF4VG90YWw7XHJcblx0fVxyXG5cdGdldCBoZWFsdGhSZWdlbigpIHtcclxuXHRcdGxldCBoZWFsdGhSZWdlblRvdGFsID0gdGhpcy5oZWFsdGhSZWdlbkJhc2UgKyB0aGlzLmhlYWx0aFJlZ2VuQm9udXNcclxuXHRcdHJldHVybiAoaGVhbHRoUmVnZW5Ub3RhbCA8IDEpID8gMSA6IGhlYWx0aFJlZ2VuVG90YWw7XHJcblx0fVxyXG5cdGdldCBlbmVyZ3lSZWdlbigpIHtcclxuXHRcdGxldCBlbmVyZ3lSZWdlblRvdGFsID0gdGhpcy5lbmVyZ3lSZWdlbkJhc2UgKyB0aGlzLmVuZXJneVJlZ2VuQm9udXM7XHJcblx0XHRyZXR1cm4gKGVuZXJneVJlZ2VuVG90YWwgPCAwKSA/IDAgOiBlbmVyZ3lSZWdlblRvdGFsO1xyXG5cdH1cclxuXHRnZXQgcmFuZ2UoKSB7XHJcblx0XHRsZXQgcmFuZ2VUb3RhbCA9IHRoaXMucmFuZ2VCYXNlICsgdGhpcy5yYW5nZUJvbnVzO1xyXG5cdFx0cmV0dXJuIChyYW5nZVRvdGFsIDwgMSkgPyAxIDogcmFuZ2VUb3RhbDtcclxuXHR9XHJcblxyXG5cdGNhbGNCYXNlU3RhdHModGVtcGxhdGUpIHtcclxuXHRcdHRoaXMuZGFtYWdlQmFzZSA9IHRlbXBsYXRlLmRhbWFnZUJhc2UgfHwgMTtcclxuXHRcdHRoaXMuZGVmZW5jZUJhc2UgPSB0ZW1wbGF0ZS5kZWZlbmNlQmFzZSB8fCAwO1xyXG5cdFx0dGhpcy5oZWFsdGhNYXhCYXNlID0gdGVtcGxhdGUuaGVhbHRoTWF4QmFzZSArICh0ZW1wbGF0ZS5oZWFsdGhQZXJMZXZlbCAqICh0aGlzLmxldmVsIC0gMSkpIHx8IDE7XHJcblx0XHR0aGlzLmVuZXJneU1heEJhc2UgPSB0ZW1wbGF0ZS5lbmVyZ3lNYXhCYXNlICsgKHRlbXBsYXRlLmVuZXJneVBlckxldmVsICogKHRoaXMubGV2ZWwgLSAxKSkgfHwgMTtcclxuXHRcdHRoaXMuaGVhbHRoUmVnZW5CYXNlID0gdGVtcGxhdGUuaGVhbHRoUmVnZW5CYXNlIHx8IDE7XHJcblx0XHR0aGlzLmVuZXJneVJlZ2VuQmFzZSA9IHRlbXBsYXRlLmVuZXJneVJlZ2VuQmFzZSB8fCAxO1xyXG5cdFx0dGhpcy5yYW5nZUJhc2UgPSB0ZW1wbGF0ZS5yYW5nZUJhc2UgfHwgMTtcclxuXHR9XHJcblxyXG5cdGNhbGNJdGVtQm9udXMoKSB7XHJcblx0XHRjb25zdCBpdGVtQm9udXMgPSB7XHJcblx0XHRcdGRhbWFnZTogMCxcclxuXHRcdFx0ZGVmZW5jZTogMCxcclxuXHRcdFx0aGVhbHRoTWF4OiAwLFxyXG5cdFx0XHRlbmVyZ3lNYXg6IDAsXHJcblx0XHRcdGhlYWx0aFJlZ2VuOiAwLFxyXG5cdFx0XHRlbmVyZ3lSZWdlbjogMCxcclxuXHRcdFx0cmFuZ2U6IDBcclxuXHRcdH07XHJcblxyXG5cdFx0Y29uc3QgaW52ZW50b3J5ID0gdGhpcy5nZXRJbnZlbnRvcnkoKTtcclxuXHJcblx0XHQvLyBGb3IgZWFjaCBpdGVtIGluIGludmVudG9yeSBjaGVjayBmb3IgYm9udXNlc1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBpbnZlbnRvcnkubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgaXRlbSA9IGludmVudG9yeVtpXTtcclxuXHRcdFx0aXRlbUJvbnVzLmRhbWFnZSArPSBpdGVtLnBhc3NpdmUuZGFtYWdlO1xyXG5cdFx0XHRpdGVtQm9udXMuZGVmZW5jZSArPSBpdGVtLnBhc3NpdmUuZGVmZW5jZTtcclxuXHRcdFx0aXRlbUJvbnVzLmhlYWx0aE1heCArPSBpdGVtLnBhc3NpdmUuaGVhbHRoTWF4O1xyXG5cdFx0XHRpdGVtQm9udXMuZW5lcmd5TWF4ICs9IGl0ZW0ucGFzc2l2ZS5lbmVyZ3lNYXg7XHJcblx0XHRcdGl0ZW1Cb251cy5oZWFsdGhSZWdlbiArPSBpdGVtLnBhc3NpdmUuaGVhbHRoUmVnZW47XHJcblx0XHRcdGl0ZW1Cb251cy5lbmVyZ3lSZWdlbiArPSBpdGVtLnBhc3NpdmUuZW5lcmd5UmVnZW47XHJcblx0XHRcdGl0ZW1Cb251cy5yYW5nZSArPSBpdGVtLnBhc3NpdmUucmFuZ2U7XHJcblxyXG5cdFx0XHRpZiAoaXRlbS5zbG90ID49IGNvbmZpZy5JTlZFTlRPUllfU0laRSkge1xyXG5cdFx0XHRcdGl0ZW1Cb251cy5kYW1hZ2UgKz0gaXRlbS5lcXVpcHBlZC5kYW1hZ2U7XHJcblx0XHRcdFx0aXRlbUJvbnVzLmRlZmVuY2UgKz0gaXRlbS5lcXVpcHBlZC5kZWZlbmNlO1xyXG5cdFx0XHRcdGl0ZW1Cb251cy5oZWFsdGhNYXggKz0gaXRlbS5lcXVpcHBlZC5oZWFsdGhNYXg7XHJcblx0XHRcdFx0aXRlbUJvbnVzLmVuZXJneU1heCArPSBpdGVtLmVxdWlwcGVkLmVuZXJneU1heDtcclxuXHRcdFx0XHRpdGVtQm9udXMuaGVhbHRoUmVnZW4gKz0gaXRlbS5lcXVpcHBlZC5oZWFsdGhSZWdlbjtcclxuXHRcdFx0XHRpdGVtQm9udXMuZW5lcmd5UmVnZW4gKz0gaXRlbS5lcXVpcHBlZC5lbmVyZ3lSZWdlbjtcclxuXHRcdFx0XHRpdGVtQm9udXMucmFuZ2UgKz0gaXRlbS5lcXVpcHBlZC5yYW5nZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gaXRlbUJvbnVzO1xyXG5cdH1cclxuXHJcblx0Y2FsY0VmZmVjdEJvbnVzKCkge1xyXG5cdFx0Y29uc3QgZWZmZWN0Qm9udXMgPSB7XHJcblx0XHRcdGRhbWFnZTogMCxcclxuXHRcdFx0ZGVmZW5jZTogMCxcclxuXHRcdFx0aGVhbHRoTWF4OiAwLFxyXG5cdFx0XHRlbmVyZ3lNYXg6IDAsXHJcblx0XHRcdGhlYWx0aFJlZ2VuOiAwLFxyXG5cdFx0XHRlbmVyZ3lSZWdlbjogMCxcclxuXHRcdFx0cmFuZ2U6IDBcclxuXHRcdH07XHJcblxyXG5cdFx0Ly8gVE9ETzogd29yayBvdXQgaG93IHRvIGRvIGVmZmVjdHMgZm9yIHNwZWxscyBhbmQgcG90aW9uc1xyXG5cdFx0cmV0dXJuIGVmZmVjdEJvbnVzO1xyXG5cdH1cclxuXHRcclxuXHRjYWxjQm9udXNTdGF0cygpIHtcdC8vIEl0ZW1zIChlcXVpcHBlZCBhbmQgcGFzc2l2ZSkgYW5kIEVmZmVjdHMgKHNwZWxscyBhbmQgcG90aW9ucylcclxuXHRcdGNvbnN0IGl0ZW1Cb251cyA9IHRoaXMuY2FsY0l0ZW1Cb251cygpO1xyXG5cdFx0Y29uc3QgZWZmZWN0Qm9udXMgPSB0aGlzLmNhbGNFZmZlY3RCb251cygpO1xyXG5cclxuXHRcdHRoaXMuZGFtYWdlQm9udXMgPSBpdGVtQm9udXMuZGFtYWdlICsgZWZmZWN0Qm9udXMuZGFtYWdlO1xyXG5cdFx0dGhpcy5kZWZlbmNlQm9udXMgPSBpdGVtQm9udXMuZGVmZW5jZSArIGVmZmVjdEJvbnVzLmRlZmVuY2U7XHJcblx0XHR0aGlzLmhlYWx0aE1heEJvbnVzID0gaXRlbUJvbnVzLmhlYWx0aE1heCArIGVmZmVjdEJvbnVzLmhlYWx0aE1heDtcclxuXHRcdHRoaXMuZW5lcmd5TWF4Qm9udXMgPSBpdGVtQm9udXMuZW5lcmd5TWF4ICsgZWZmZWN0Qm9udXMuZW5lcmd5TWF4O1xyXG5cdFx0dGhpcy5oZWFsdGhSZWdlbkJvbnVzID0gaXRlbUJvbnVzLmhlYWx0aFJlZ2VuICsgZWZmZWN0Qm9udXMuaGVhbHRoUmVnZW47XHJcblx0XHR0aGlzLmVuZXJneVJlZ2VuQm9udXMgPSBpdGVtQm9udXMuZW5lcmd5UmVnZW4gKyBlZmZlY3RCb251cy5lbmVyZ3lSZWdlbjtcclxuXHRcdHRoaXMucmFuZ2VCb251cyA9IGl0ZW1Cb251cy5yYW5nZSArIGVmZmVjdEJvbnVzLnJhbmdlO1xyXG5cdH1cclxuXHJcblx0Y2FsY1N0YXRzKCkge1xyXG5cdFx0dGhpcy5jYWxjQmFzZVN0YXRzKCk7XHJcblx0XHR0aGlzLmNhbGNCb251c1N0YXRzKCk7XHJcblx0fVxyXG5cclxuXHRyZXN0b3JlKCkge1xyXG5cdFx0dGhpcy5oZWFsdGggPSB0aGlzLmhlYWx0aE1heDtcclxuXHRcdHRoaXMuZW5lcmd5ID0gdGhpcy5lbmVyZ3lNYXg7XHJcblx0fVxyXG5cdFxyXG5cdGlucHV0RGF0YSgpIHtcclxuXHRcdC8vIFNlZSBQbGF5ZXIgYW5kIEJvdCBjbGFzc2VzXHJcblx0fVxyXG5cclxuXHQvLyBNb3ZlbWVudFxyXG5cdG1vdmUoZGlyZWN0aW9uKSB7XHJcblx0XHRpZiAodGhpcy5pc01vdmluZykgcmV0dXJuO1xyXG5cclxuXHRcdGlmIChkaXJlY3Rpb24pIHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xyXG5cclxuXHRcdGlmIChkaXJlY3Rpb24gPT09ICdsZWZ0Jykge1xyXG5cdFx0XHRpZiAoIWdhbWUuaXNWYWNhbnQodGhpcy5tYXBJZCwgdGhpcy54IC0gMSwgdGhpcy55KSkgcmV0dXJuO1xyXG5cdFx0XHR0aGlzLmRlc3RpbmF0aW9uWC0tO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoZGlyZWN0aW9uID09PSAncmlnaHQnKSB7XHJcblx0XHRcdGlmICghZ2FtZS5pc1ZhY2FudCh0aGlzLm1hcElkLCB0aGlzLnggKyAxLCB0aGlzLnkpKSByZXR1cm47XHJcblx0XHRcdHRoaXMuZGVzdGluYXRpb25YKys7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChkaXJlY3Rpb24gPT09ICd1cCcpIHtcclxuXHRcdFx0aWYgKCFnYW1lLmlzVmFjYW50KHRoaXMubWFwSWQsIHRoaXMueCwgdGhpcy55IC0gMSkpIHJldHVybjtcclxuXHRcdFx0dGhpcy5kZXN0aW5hdGlvblktLTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ2Rvd24nKSB7XHJcblx0XHRcdGlmICghZ2FtZS5pc1ZhY2FudCh0aGlzLm1hcElkLCB0aGlzLngsIHRoaXMueSArIDEpKSByZXR1cm47XHJcblx0XHRcdHRoaXMuZGVzdGluYXRpb25ZKys7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0c3dpdGNoICh1dGlsLnJhbmRvbUludCgwLCAzICsgdGhpcy5sYXppbmVzcykpIHtcclxuXHRcdFx0XHRjYXNlIDA6IHRoaXMubW92ZSgnbGVmdCcpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgMTogdGhpcy5tb3ZlKCdyaWdodCcpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgMjogdGhpcy5tb3ZlKCd1cCcpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgMzogdGhpcy5tb3ZlKCdkb3duJyk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0ZGVmYXVsdDogLy8gRG9uJ3QgTW92ZVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBTZXQgbW92ZSBzcGVlZFxyXG5cdFx0aWYgKHRoaXMuaXNSdW5uaW5nKSB7XHJcblx0XHRcdGlmICh0aGlzLmVuZXJneSA+IDApIHtcclxuXHRcdFx0XHR0aGlzLmVuZXJneS0tO1xyXG5cdFx0XHRcdHRoaXMubW92ZVNwZWVkID0gNDtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHR0aGlzLmVuZXJneSA9IDA7XHJcblx0XHRcdFx0dGhpcy5tb3ZlU3BlZWQgPSAyLjU7XHJcblx0XHRcdFx0dGhpcy5pc1J1bm5pbmcgPSBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHRoaXMubW92ZVNwZWVkID0gMi41O1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR0aGlzLmlzTW92aW5nID0gdHJ1ZTtcclxuXHR9XHJcblx0XHJcblx0bW92ZVRvVGFyZ2V0KHRhcmdldCwgaG9zdGlsZSkge1xyXG5cdFx0aWYgKCF0YXJnZXQpIHJldHVybjtcclxuXHRcdFxyXG5cdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggJiYgdGFyZ2V0LnkgPT09IHRoaXMueSkge1xyXG5cdFx0XHR0aGlzLm1vdmUoKTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKHV0aWwucmFuZG9tSW50KDAsIDEpID09PSAwKSB7XHJcblx0XHRcdGlmICh0YXJnZXQueCA8IHRoaXMueCkge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQueCA+PSAodGhpcy54IC0gdGhpcy5yYW5nZSkgJiYgdGFyZ2V0LnkgPT09IHRoaXMueSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUgJiYgIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnbGVmdCc7XHJcblx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCdsZWZ0Jyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCdsZWZ0Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHRhcmdldC54ID4gdGhpcy54KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggKyB0aGlzLnJhbmdlICYmIHRhcmdldC55ID09PSB0aGlzLnkpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlICYmICF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ3JpZ2h0JztcclxuXHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ3JpZ2h0Jyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCdyaWdodCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICh0YXJnZXQueSA8IHRoaXMueSkge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICYmIHRhcmdldC55ID09PSB0aGlzLnkgLSB0aGlzLnJhbmdlKSB7XHJcblx0XHRcdFx0XHRpZiAoaG9zdGlsZSAmJiAhdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICd1cCc7XHJcblx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCd1cCcpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSgndXAnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodGFyZ2V0LnkgPiB0aGlzLnkpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LnggPT09IHRoaXMueCAmJiB0YXJnZXQueSA9PT0gdGhpcy55ICsgdGhpcy5yYW5nZSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUgJiYgIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnZG93bic7XHJcblx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCdkb3duJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKCdkb3duJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0aWYgKHRhcmdldC55ID4gdGhpcy55KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggJiYgdGFyZ2V0LnkgPT09IHRoaXMueSArIHRoaXMucmFuZ2UpIHtcclxuXHRcdFx0XHRcdGlmIChob3N0aWxlICYmICF0aGlzLmlzTW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ2Rvd24nO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmF0dGFjaygnZG93bicpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSgnZG93bicpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICh0YXJnZXQueSA8IHRoaXMueSkge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQueCA9PT0gdGhpcy54ICYmIHRhcmdldC55ID09PSB0aGlzLnkgLSB0aGlzLnJhbmdlKSB7XHJcblx0XHRcdFx0XHRpZiAoaG9zdGlsZSAmJiAhdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICd1cCc7XHJcblx0XHRcdFx0XHRcdHRoaXMuYXR0YWNrKCd1cCcpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZSgndXAnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodGFyZ2V0LnggPiB0aGlzLngpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LnggPT09IHRoaXMueCArIHRoaXMucmFuZ2UgJiYgdGFyZ2V0LnkgPT09IHRoaXMueSkge1xyXG5cdFx0XHRcdFx0aWYgKGhvc3RpbGUgJiYgIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAncmlnaHQnO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmF0dGFjaygncmlnaHQnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ3JpZ2h0Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHRhcmdldC54IDwgdGhpcy54KSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldC54ID49ICh0aGlzLnggLSB0aGlzLnJhbmdlKSAmJiB0YXJnZXQueSA9PT0gdGhpcy55KSB7XHJcblx0XHRcdFx0XHRpZiAoaG9zdGlsZSAmJiAhdGhpcy5pc01vdmluZykge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdsZWZ0JztcclxuXHRcdFx0XHRcdFx0dGhpcy5hdHRhY2soJ2xlZnQnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vdmUoJ2xlZnQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0Ly8gQ29tYmF0XHJcblx0Y2hlY2tJblJhbmdlKGRpcmVjdGlvbiwgdGFyZ2V0LCByYW5nZSkge1xyXG5cdFx0aWYgKHRhcmdldC5tYXBJZCAhPT0gdGhpcy5tYXBJZCkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0aWYgKHRhcmdldC54ID09PSB0aGlzLnggJiYgdGFyZ2V0LnkgPT09IHRoaXMueSkgcmV0dXJuIGZhbHNlO1x0Ly8gU3RhY2tlZCBkb2VzIG5vdCBjb3VudCBhcyBpbiByYW5nZVxyXG5cdFx0XHJcblx0XHRpZiAodGFyZ2V0LnkgPT09IHRoaXMueSkge1xyXG5cdFx0XHRpZiAoZGlyZWN0aW9uID09PSAnbGVmdCcpIHtcclxuXHRcdFx0XHRpZiAodGhpcy54ID09PSAwKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0cmV0dXJuICh0YXJnZXQueCA8IHRoaXMueCAmJiB0YXJnZXQueCA+PSAodGhpcy54IC0gcmFuZ2UpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAoZGlyZWN0aW9uID09PSAncmlnaHQnKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMueCA9PT0gY29uZmlnLk1BUF9DT0xVTU5TIC0gMSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHJldHVybiAodGFyZ2V0LnggPiB0aGlzLnggJiYgdGFyZ2V0LnggPD0gKHRoaXMueCArIHJhbmdlKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmICh0YXJnZXQueCA9PT0gdGhpcy54KSB7XHJcblx0XHRcdGlmIChkaXJlY3Rpb24gPT09ICd1cCcpIHtcclxuXHRcdFx0XHRpZiAodGhpcy55ID09PSAwKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0cmV0dXJuICh0YXJnZXQueSA8IHRoaXMueSAmJiB0YXJnZXQueSA+PSAodGhpcy55IC0gcmFuZ2UpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAoZGlyZWN0aW9uID09PSAnZG93bicpIHtcclxuXHRcdFx0XHRpZiAodGhpcy55ID09PSBjb25maWcuTUFQX1JPV1MgLSAxKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0cmV0dXJuICh0YXJnZXQueSA+IHRoaXMueSAmJiB0YXJnZXQueSA8PSAodGhpcy55ICsgcmFuZ2UpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0YXR0YWNrKG51bVRhcmdldHMgPSAxLCBkaXJlY3Rpb24gPSB0aGlzLmRpcmVjdGlvbikge1xyXG5cdFx0aWYgKHRoaXMuaXNBdHRhY2tpbmcgfHwgdGhpcy5hdHRhY2tUaW1lciA+IDApIHJldHVybjtcclxuXHJcblx0XHR0aGlzLmlzQXR0YWNraW5nID0gdHJ1ZTtcclxuXHRcdFxyXG5cdFx0Y29uc3QgcGxheWVyTGlzdCA9IGdhbWUucGxheWVycy5maWx0ZXIocGxheWVyID0+IHBsYXllci5tYXBJZCA9PT0gdGhpcy5tYXBJZCk7XHJcblx0XHRjb25zdCBib3RMaXN0ID0gZ2FtZS5ib3RzLmZpbHRlcihib3QgPT4gYm90Lm1hcElkID09PSB0aGlzLm1hcElkKTtcclxuXHRcdGNvbnN0IGFjdG9yTGlzdCA9IHBsYXllckxpc3QuY29uY2F0KGJvdExpc3QpO1xyXG5cdFx0bGV0IHRhcmdldExpc3QgPSBhY3Rvckxpc3QuZmlsdGVyKGFjdG9yID0+IHtcclxuXHRcdFx0cmV0dXJuIGFjdG9yICE9PSB0aGlzICYmICFhY3Rvci5pc0RlYWQgJiYgdGhpcy5jaGVja0luUmFuZ2UoZGlyZWN0aW9uLCBhY3RvciwgdGhpcy5yYW5nZSk7XHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdFx0dGFyZ2V0TGlzdC5zb3J0KChhLCBiKSA9PiB7XHJcblx0XHRcdHJldHVybiAoYS56IC0gYi56KTtcdC8vIExvd2VzdCB0byBoaWdoZXN0XHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdFx0dGFyZ2V0TGlzdCA9IHRhcmdldExpc3Quc3BsaWNlKC1udW1UYXJnZXRzKTtcclxuXHRcdFxyXG5cdFx0dGFyZ2V0TGlzdC5mb3JFYWNoKCh0YXJnZXQpID0+IHtcclxuXHRcdFx0dGFyZ2V0LnRha2VEYW1hZ2UodGhpcy5kYW1hZ2UsIHRoaXMpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdFxyXG5cdHRha2VEYW1hZ2UoZGFtYWdlLCBhdHRhY2tlcikge1xyXG5cdFx0ZGFtYWdlIC09IHRoaXMuZGVmZW5jZTtcclxuXHRcdGlmIChkYW1hZ2UgPCAwKSBkYW1hZ2UgPSAwO1xyXG5cdFx0Z2FtZS5zcGF3bkRhbWFnZVRleHQodGhpcy5tYXBJZCwgdGhpcy54LCB0aGlzLnksIGRhbWFnZSk7XHJcblx0XHRpZiAoZGFtYWdlID09PSAwKSByZXR1cm47XHJcblx0XHRcclxuXHRcdHRoaXMuaXNIaXQgPSB0cnVlO1xyXG5cdFx0dGhpcy5oZWFsdGggLT0gZGFtYWdlO1xyXG5cdFx0Y29uc29sZS5sb2coYCR7dGhpcy5uYW1lfSAtICR7dGhpcy5oZWFsdGh9YCk7XHJcblx0XHRpZiAodGhpcy5oZWFsdGggPD0gMCkge1xyXG5cdFx0XHR0aGlzLnNldERlYWQoKTtcclxuXHRcdFx0XHJcblx0XHRcdGlmICghYXR0YWNrZXIpIHtcclxuXHRcdFx0XHRnYW1lLnNlbmRHYW1lSW5mb0dsb2JhbCh0aGlzLm5hbWUgKyBcIiBoYXMgZGllZCFcIik7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRhdHRhY2tlci5raWxscysrO1xyXG5cdFx0XHRpZiAoYXR0YWNrZXIudGFyZ2V0ID09PSB0aGlzKSBhdHRhY2tlci50YXJnZXQgPSBudWxsO1xyXG5cdFx0XHRpZiAoYXR0YWNrZXIucGxheWVySWQpIHtcclxuXHRcdFx0XHRnYW1lLnNlbmRHYW1lSW5mb0dsb2JhbChhdHRhY2tlci5uYW1lICsgXCIgaGFzIG11cmRlcmVkIFwiICsgdGhpcy5uYW1lICsgXCIgaW4gY29sZCBibG9vZCFcIik7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0Z2FtZS5zZW5kR2FtZUluZm9HbG9iYWwodGhpcy5uYW1lICsgXCIgaGFzIGJlZW4ga2lsbGVkIGJ5IFwiICsgYXR0YWNrZXIubmFtZSArIFwiIVwiKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cdFxyXG5cclxuXHRzZXREZWFkKCkge1xyXG5cdFx0Y29uc3QgbWFwID0gZ2FtZS5tYXBzW3RoaXMubWFwSWRdO1xyXG5cdFx0Y29uc3QgaW52ZW50b3J5ID0gdGhpcy5nZXRJbnZlbnRvcnkoKTtcclxuXHJcblx0XHQvLyBJbnZlbnRvcnkgSXRlbSBEcm9wIENoYW5jZVxyXG5cdFx0Y29uc3QgZHJvcENoYW5jZSA9IHV0aWwuY2xhbXAobWFwLmRyb3BDaGFuY2UsIDAsIDEwMCk7XHJcblx0XHRpZiAoZHJvcENoYW5jZSA+IDApIHtcclxuXHRcdFx0Y29uc3QgaXRlbXMgPSBpbnZlbnRvcnkuZmlsdGVyKGl0ZW0gPT4ge1xyXG5cdFx0XHRcdHJldHVybiBpdGVtLnNsb3QgPCBjb25maWcuSU5WRU5UT1JZX1NJWkU7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0aXRlbXMuZm9yRWFjaChpdGVtID0+IHtcclxuXHRcdFx0XHRpZiAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAxKSA8PSBkcm9wQ2hhbmNlKSB7XHJcblx0XHRcdFx0XHRpdGVtLm1vdmVUb01hcCh0aGlzLm1hcElkLCB0aGlzLngsIHRoaXMueSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0dGhpcy5jYWxjQm9udXNTdGF0cygpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEVxdWlwcGVkIEl0ZW0gRHJvcCBBbW91bnRcclxuXHRcdGNvbnN0IGRyb3BBbW91bnRFUSA9IHV0aWwuY2xhbXAobWFwLmRyb3BBbW91bnRFUSwgMCwgY29uZmlnLkVRVUlQTUVOVF9TSVpFKTtcclxuXHRcdGlmIChkcm9wQW1vdW50RVEgPiAwKSB7XHJcblx0XHRcdGxldCBlcXVpcG1lbnQgPSBpbnZlbnRvcnkuZmlsdGVyKGl0ZW0gPT4ge1xyXG5cdFx0XHRcdHJldHVybiBpdGVtLnNsb3QgPj0gY29uZmlnLklOVkVOVE9SWV9TSVpFO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdGVxdWlwbWVudCA9IHV0aWwuc2h1ZmZsZShlcXVpcG1lbnQpO1xyXG5cdFx0XHRlcXVpcG1lbnQuc3BsaWNlKC1kcm9wQW1vdW50RVEpO1xyXG5cdFx0XHRlcXVpcG1lbnQuZm9yRWFjaChpdGVtID0+IHtcclxuXHRcdFx0XHRpdGVtLm1vdmVUb01hcCh0aGlzLm1hcElkLCB0aGlzLngsIHRoaXMueSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHR0aGlzLmNhbGNCb251c1N0YXRzKCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdC8vIEludmVudG9yeVxyXG5cdHBpY2tVcCgpIHtcclxuXHRcdGNvbnN0IG1hcEl0ZW1zID0gZ2FtZS5pdGVtcy5maWx0ZXIoaXRlbSA9PiB7XHJcblx0XHRcdHJldHVybiBpdGVtLm1hcElkID09PSB0aGlzLm1hcElkICYmIGl0ZW0ueCA9PT0gdGhpcy54ICYmIGl0ZW0ueSA9PT0gdGhpcy55O1xyXG5cdFx0fSk7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IG1hcEl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IGl0ZW0gPSBtYXBJdGVtc1tpXTtcclxuXHRcdFx0aWYgKCFpdGVtKSBjb250aW51ZTtcclxuXHRcdFx0XHJcblx0XHRcdGlmIChpdGVtLnN0YWNrYWJsZSkge1xyXG5cdFx0XHRcdGNvbnN0IGludmVudG9yeSA9IHRoaXMuZ2V0SW52ZW50b3J5KCk7XHJcblx0XHRcdFx0aWYgKGludmVudG9yeS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRjb25zdCBzYW1lSXRlbXMgPSBpbnZlbnRvcnkuZmlsdGVyKGludmVudG9yeUl0ZW0gPT4ge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gaW52ZW50b3J5SXRlbS50ZW1wbGF0ZUlkID09PSBpdGVtLnRlbXBsYXRlSWQ7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdGlmIChzYW1lSXRlbXMubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRzYW1lSXRlbXNbMF0uc3RhY2sgKz0gaXRlbS5zdGFjaztcclxuXHRcdFx0XHRcdFx0aXRlbS5yZW1vdmUoKTtcclxuXHRcdFx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb25zdCBzbG90ID0gdGhpcy5maW5kRmlyc3RFbXB0eVNsb3QoKTtcclxuXHRcdFx0aWYgKHNsb3QgPT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdFx0aXRlbS5tb3ZlVG9JbnZlbnRvcnkodGhpcy5wbGF5ZXJJZCwgdGhpcy5ib3RJZCwgc2xvdCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRnZXRJbnZlbnRvcnkoKSB7XHJcblx0XHQvLyBTZWUgUGxheWVyIGFuZCBCb3QgY2xhc3Nlc1xyXG5cdH1cclxuXHJcblx0Z2V0SXRlbShzbG90KSB7XHJcblx0XHRjb25zdCBpbnZlbnRvcnkgPSB0aGlzLmdldEludmVudG9yeSgpO1xyXG5cdFx0Y29uc3QgaXRlbXMgPSBpbnZlbnRvcnkuZmlsdGVyKGl0ZW0gPT4ge1xyXG5cdFx0XHRyZXR1cm4gaXRlbS5zbG90ID09PSBzbG90O1xyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gaXRlbXNbMF07XHJcblx0fVxyXG5cclxuXHRoYXNJdGVtKHRlbXBsYXRlSWQpIHtcclxuXHRcdGNvbnN0IGludmVudG9yeSA9IHRoaXMuZ2V0SW52ZW50b3J5KCk7XHJcblx0XHRjb25zdCBpdGVtcyA9IGdhbWUuaXRlbXMuZmlsdGVyKGl0ZW0gPT4ge1xyXG5cdFx0XHRyZXR1cm4gaXRlbS50ZW1wbGF0ZUlkID09PSB0ZW1wbGF0ZUlkO1xyXG5cdFx0fSk7XHJcblx0XHRpZiAoaXRlbXNbMF0uc3RhY2thYmxlKSB7XHJcblx0XHRcdHJldHVybiBpdGVtc1swXS5zdGFjaztcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gaXRlbXMubGVuZ3RoO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZmluZEl0ZW1TbG90KHRlbXBsYXRlSWQpIHtcclxuXHRcdGNvbnN0IGludmVudG9yeSA9IHRoaXMuZ2V0SW52ZW50b3J5KCk7XHJcblx0XHRjb25zdCBpdGVtcyA9IGludmVudG9yeS5maWx0ZXIoaXRlbSA9PiB7XHJcblx0XHRcdHJldHVybiBpdGVtLnRlbXBsYXRlSWQgPT09IHRlbXBsYXRlSWQ7XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBpdGVtc1swXS5zbG90O1xyXG5cdH1cclxuXHJcblx0ZmluZEZpcnN0RW1wdHlTbG90KCkge1xyXG5cdFx0Y29uc3QgaW52ZW50b3J5ID0gdGhpcy5nZXRJbnZlbnRvcnkoKTtcclxuXHJcblx0XHRmb3IgKGxldCBzbG90ID0gMDsgc2xvdCA8IGNvbmZpZy5JTlZFTlRPUllfU0laRTsgc2xvdCsrKSB7XHJcblx0XHRcdGxldCBvY2N1cGllZCA9IGZhbHNlO1xyXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGludmVudG9yeS5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdGlmIChpbnZlbnRvcnlbaV0uc2xvdCA9PT0gc2xvdCkge1xyXG5cdFx0XHRcdFx0b2NjdXBpZWQgPSB0cnVlO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICghb2NjdXBpZWQpIHJldHVybiBzbG90O1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fVxyXG5cclxuXHR1c2VJdGVtKHNsb3QpIHtcclxuXHRcdGNvbnN0IGl0ZW0gPSB0aGlzLmdldEl0ZW0oc2xvdCk7XHJcblx0XHRpZiAoIWl0ZW0pIHJldHVybjtcclxuXHJcblx0XHQvLyBUT0RPOiBpZiAoIXVzZVNjcmlwdCgpKSByZXR1cm47XHJcblxyXG5cdFx0aWYgKGl0ZW0uaXNFcXVpcG1lbnQoKSkge1xyXG5cdFx0XHRpZiAoaXRlbS5zbG90IDwgY29uZmlnLklOVkVOVE9SWV9TSVpFKSB7XHQvLyBDaGVjayBpZiBpdGVtIGlzIGVxdWlwcGVkXHJcblx0XHRcdFx0dGhpcy5lcXVpcEl0ZW0oaXRlbSk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMudW5lcXVpcEl0ZW0oaXRlbSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIWl0ZW0ucmV1c2FibGUpIGl0ZW0ucmVtb3ZlT25lKCk7XHJcblx0fVxyXG5cclxuXHRkcm9wSXRlbShzbG90KSB7XHJcblx0XHRjb25zdCBpdGVtID0gdGhpcy5nZXRJdGVtKHNsb3QpO1xyXG5cdFx0aWYgKCFpdGVtKSByZXR1cm47XHJcblx0XHRpdGVtLm1vdmVUb01hcCh0aGlzLm1hcElkLCB0aGlzLngsIHRoaXMueSk7XHJcblx0XHR0aGlzLmNhbGNCb251c1N0YXRzKCk7XHJcblx0fVxyXG5cclxuXHRtb3ZlSXRlbVRvU2xvdChzbG90LCBuZXdTbG90KSB7XHJcblx0XHRpZiAoc2xvdCA9PSBudWxsIHx8IG5ld1Nsb3QgPT0gbnVsbCB8fCBzbG90ID09PSBuZXdTbG90KSByZXR1cm47XHQvLyBudWxsID09IHVuZGVmaW5lZCwgbnVsbCAhPSAwXHJcblx0XHRpZiAoc2xvdCA+PSBjb25maWcuSU5WRU5UT1JZX1NJWkUgKyBjb25maWcuRVFVSVBNRU5UX1NJWkUpIHJldHVybjtcclxuXHRcdGlmIChuZXdTbG90ID49IGNvbmZpZy5JTlZFTlRPUllfU0laRSArIGNvbmZpZy5FUVVJUE1FTlRfU0laRSkgcmV0dXJuO1xyXG5cclxuXHRcdGNvbnN0IGl0ZW0gPSB0aGlzLmdldEl0ZW0oc2xvdCk7XHJcblx0XHRjb25zdCBuZXdJdGVtID0gdGhpcy5nZXRJdGVtKG5ld1Nsb3QpO1xyXG5cdFx0aWYgKCFpdGVtKSByZXR1cm47XHJcblxyXG5cdFx0Ly8gVGFyZ2V0IHNsb3QgaXMgZm9yIGVxdWlwbWVudCAtIGNoZWNrIHR5cGUgbWF0Y2hlc1xyXG5cdFx0aWYgKG5ld1Nsb3QgPj0gY29uZmlnLklOVkVOVE9SWV9TSVpFKSB7XHJcblx0XHRcdGlmIChpdGVtLmVxdWlwcGVkU2xvdCArIGNvbmZpZy5JTlZFTlRPUllfU0laRSAhPT0gbmV3U2xvdCkge1xyXG5cdFx0XHRcdGdhbWUuc2VuZEdhbWVJbmZvUGxheWVyKHRoaXMuaWQsIFwiVGhhdCBjYW5ub3QgYmUgZXF1aXBwZWQgdGhlcmUuXCIpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHN3YXBTbG90cyA9ICgpID0+IHtcclxuXHRcdFx0aXRlbS5zbG90ID0gbmV3U2xvdDtcclxuXHRcdFx0aWYgKG5ld0l0ZW0pIG5ld0l0ZW0uc2xvdCA9IHNsb3Q7XHJcblx0XHRcdHRoaXMuY2FsY0JvbnVzU3RhdHMoKTtcclxuXHRcdH07XHJcblxyXG5cdFx0Ly8gSUYgTm8gbmV3IGl0ZW0gaW4gbmV3IHNsb3RcclxuXHRcdC8vIE9SIE5ldyBpdGVtIGluIG5ldyBzbG90LCBvbGQgaXRlbSBpbiBpbnZlbnRvcnlcclxuXHRcdC8vIE9SIE5ldyBpdGVtIGluIG5ldyBzbG90LCBvbGQgaXRlbSBpcyBlcXVpcHBlZCwgbmV3IGl0ZW0gY2FuIGJlIGVxdWlwcGVkIGluIG9sZCBzbG90XHJcblx0XHRpZiAoIW5ld0l0ZW0gfHwgc2xvdCA8IGNvbmZpZy5JTlZFTlRPUllfU0laRSB8fCBuZXdJdGVtLmVxdWlwcGVkU2xvdCArIGNvbmZpZy5JTlZFTlRPUllfU0laRSA9PT0gc2xvdCkge1xyXG5cdFx0XHRzd2FwU2xvdHMoKTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHQvLyBPbGQgaXRlbSBpcyBlcXVpcHBlZCwgbmV3IGl0ZW0gY2Fubm90IGJlIGVxdWlwcGVkIGluIG9sZCBzbG90XHJcblx0XHRcdG5ld1Nsb3QgPSB0aGlzLmZpbmRGaXJzdEVtcHR5U2xvdCgpO1xyXG5cdFx0XHRpZiAobmV3U2xvdCAhPSBudWxsKSB7XHJcblx0XHRcdFx0c3dhcFNsb3RzKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0Z2FtZS5zZW5kR2FtZUluZm9QbGF5ZXIodGhpcy5pZCwgXCJZb3VyIGludmVudG9yeSBpcyBmdWxsLlwiKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZXF1aXBJdGVtKGl0ZW0pIHtcclxuXHRcdGNvbnN0IGVxdWlwcGVkSXRlbSA9IHRoaXMuZ2V0SXRlbShpdGVtLmVxdWlwcGVkU2xvdCArIGNvbmZpZy5JTlZFTlRPUllfU0laRSk7XHJcblx0XHRpdGVtLnNsb3QgPSBpdGVtLmVxdWlwcGVkU2xvdCArIGNvbmZpZy5JTlZFTlRPUllfU0laRTtcclxuXHRcdGlmIChlcXVpcHBlZEl0ZW0pIGVxdWlwcGVkSXRlbS5zbG90ID0gdGhpcy5maW5kRmlyc3RFbXB0eVNsb3QoKTtcclxuXHRcdHRoaXMuY2FsY0JvbnVzU3RhdHMoKTtcclxuXHR9XHJcblxyXG5cdHVuZXF1aXBJdGVtKGl0ZW0pIHtcclxuXHRcdGNvbnN0IG5ld1Nsb3QgPSB0aGlzLmZpbmRGaXJzdEVtcHR5U2xvdCgpO1xyXG5cdFx0aWYgKG5ld1Nsb3QgPT0gbnVsbCkge1xyXG5cdFx0XHRnYW1lLnNlbmRHYW1lSW5mb1BsYXllcih0aGlzLmdhbWVJZCwgXCJZb3VyIGludmVudG9yeSBpcyBmdWxsLlwiKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0aXRlbS5zbG90ID0gbmV3U2xvdDtcclxuXHRcdHRoaXMuY2FsY0JvbnVzU3RhdHMoKTtcclxuXHR9XHJcblxyXG5cdHVwZGF0ZShkZWx0YSkge1xyXG5cdFx0Ly8gSW52ZW50b3J5IEl0ZW0gVXBkYXRlXHJcblx0XHRjb25zdCBpbnZlbnRvcnkgPSB0aGlzLmdldEludmVudG9yeSgpO1xyXG5cdFx0aW52ZW50b3J5LmZvckVhY2goaXRlbSA9PiB7XHJcblx0XHRcdGlmIChpdGVtKSBpdGVtLnVwZGF0ZSgpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0aWYgKHRoaXMuaXNEZWFkKSByZXR1cm47XHJcblx0XHRcclxuXHRcdC8vIEF0dGFja2luZ1xyXG5cdFx0aWYgKHRoaXMuaXNBdHRhY2tpbmcgfHwgdGhpcy5hdHRhY2tUaW1lciA+IDApIHtcclxuXHRcdFx0dGhpcy5hdHRhY2tUaW1lciArPSBkZWx0YTtcclxuXHRcdFx0aWYgKHRoaXMuYXR0YWNrVGltZXIgPj0gMC4zKSB0aGlzLmlzQXR0YWNraW5nID0gZmFsc2U7XHJcblx0XHRcdGlmICh0aGlzLmF0dGFja1RpbWVyID49IHRoaXMuYXR0YWNrU3BlZWQpIHRoaXMuYXR0YWNrVGltZXIgPSAwO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBNb3ZlbWVudFxyXG5cdFx0aWYgKHRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0dGhpcy5sZXJwICs9IGRlbHRhICogdGhpcy5tb3ZlU3BlZWQ7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAodGhpcy5sZXJwID49IDAuNDkpIHtcclxuXHRcdFx0XHR0aGlzLnggPSB0aGlzLmRlc3RpbmF0aW9uWDtcclxuXHRcdFx0XHR0aGlzLnkgPSB0aGlzLmRlc3RpbmF0aW9uWTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0aWYgKHRoaXMubGVycCA+PSAwLjk5KSB7XHJcblx0XHRcdFx0dGhpcy5zdGFydFggPSB0aGlzLmRlc3RpbmF0aW9uWDtcclxuXHRcdFx0XHR0aGlzLnN0YXJ0WSA9IHRoaXMuZGVzdGluYXRpb25ZO1xyXG5cdFx0XHRcdHRoaXMubGVycCA9IDA7XHJcblx0XHRcdFx0dGhpcy5pc01vdmluZyA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gUmVnZW5cclxuXHRcdHRoaXMucmVnZW5UaW1lciArPSBkZWx0YTtcclxuXHRcdGlmICh0aGlzLnJlZ2VuVGltZXIgPj0gMSkge1xyXG5cdFx0XHR0aGlzLnJlZ2VuVGltZXIgPSAwO1xyXG5cdFx0XHRpZiAodGhpcy5oZWFsdGggPCB0aGlzLmhlYWx0aE1heCkge1xyXG5cdFx0XHRcdGlmICh0aGlzLmlzSGl0KSB7XHJcblx0XHRcdFx0XHR0aGlzLmlzSGl0ID0gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5oZWFsdGggKz0gdGhpcy5oZWFsdGhSZWdlbjtcclxuXHRcdFx0XHRcdGlmICh0aGlzLmhlYWx0aCA+IHRoaXMuaGVhbHRoTWF4KSB0aGlzLmhlYWx0aCA9IHRoaXMuaGVhbHRoTWF4O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHRoaXMuZW5lcmd5IDwgdGhpcy5lbmVyZ3lNYXgpIHtcclxuXHRcdFx0XHRpZiAoIXRoaXMuaXNSdW5uaW5nKSB7XHJcblx0XHRcdFx0XHR0aGlzLmVuZXJneSArPSB0aGlzLmVuZXJneVJlZ2VuO1xyXG5cdFx0XHRcdFx0aWYgKHRoaXMuZW5lcmd5ID4gdGhpcy5lbmVyZ3lNYXgpIHRoaXMuZW5lcmd5ID0gdGhpcy5lbmVyZ3lNYXg7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0Z2V0SW52ZW50b3J5UGFjaygpIHtcclxuXHRcdGNvbnN0IGludmVudG9yeVBhY2sgPSBbXTtcclxuXHRcdGNvbnN0IGludmVudG9yeSA9IHRoaXMuZ2V0SW52ZW50b3J5KCk7XHJcblx0XHRpbnZlbnRvcnkuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG5cdFx0XHRpZiAoaXRlbSkgaW52ZW50b3J5UGFja1tpdGVtLnNsb3RdID0gaXRlbS5nZXRQYWNrKCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gaW52ZW50b3J5UGFjaztcclxuXHR9XHJcbn1cclxuIiwiaW1wb3J0IGdhbWUgZnJvbSAnLi4vZ2FtZS5qcyc7XHJcbmltcG9ydCBjb25maWcgZnJvbSAnLi4vY29uZmlnLmpzJztcclxuaW1wb3J0IHV0aWwgZnJvbSAnLi4vdXRpbC5qcyc7XHJcbmltcG9ydCBBY3RvciBmcm9tICcuL2FjdG9yLmpzJztcclxuXHJcbi8vIEEgQm90IGlzIGFuIEFjdG9yIHdpdGggY29uZGl0aW9uYWwgaW5wdXRzXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCb3QgZXh0ZW5kcyBBY3RvciB7XHJcblx0Y29uc3RydWN0b3IoZGF0YSkge1xyXG5cdFx0bGV0IHsgX2lkLCBtYXBJZCwgeCwgeSwgZGlyZWN0aW9uLCB0ZW1wbGF0ZSwgbmFtZSwgc3ByaXRlLCBob3N0aWxlLFxyXG5cdFx0XHRcdFx0ZGFtYWdlQmFzZSwgZGVmZW5jZUJhc2UsIGhlYWx0aE1heEJhc2UsIGVuZXJneU1heEJhc2UsIGhlYWx0aFJlZ2VuQmFzZSwgZW5lcmd5UmVnZW5CYXNlLCByYW5nZUJhc2UgXHJcblx0XHRcdFx0fSA9IGRhdGE7XHJcblx0XHRcclxuXHRcdGlmIChfaWQgPT0gbnVsbCkgX2lkID0gZ2FtZS5yZXF1ZXN0REJJZCgpO1xyXG5cdFx0aWYgKG5hbWUgPT0gbnVsbCkgbmFtZSA9IHRlbXBsYXRlLm5hbWU7XHJcblx0XHRpZiAoc3ByaXRlID09IG51bGwpIHNwcml0ZSA9IHRlbXBsYXRlLnNwcml0ZTtcclxuXHRcdGlmIChob3N0aWxlID09IG51bGwpIGhvc3RpbGUgPSB0ZW1wbGF0ZS5ob3N0aWxlO1xyXG5cdFx0aWYgKGRhbWFnZUJhc2UgPT0gbnVsbCkgZGFtYWdlQmFzZSA9IHRlbXBsYXRlLmRhbWFnZUJhc2U7XHJcblx0XHRpZiAoZGVmZW5jZUJhc2UgPT0gbnVsbCkgZGVmZW5jZUJhc2UgPSB0ZW1wbGF0ZS5kZWZlbmNlQmFzZTtcclxuXHRcdGlmIChoZWFsdGhNYXhCYXNlID09IG51bGwpIGhlYWx0aE1heEJhc2UgPSB0ZW1wbGF0ZS5oZWFsdGhNYXhCYXNlO1xyXG5cdFx0aWYgKGVuZXJneU1heEJhc2UgPT0gbnVsbCkgZW5lcmd5TWF4QmFzZSA9IHRlbXBsYXRlLmVuZXJneU1heEJhc2U7XHJcblx0XHRpZiAoaGVhbHRoUmVnZW5CYXNlID09IG51bGwpIGhlYWx0aFJlZ2VuQmFzZSA9IHRlbXBsYXRlLmhlYWx0aFJlZ2VuQmFzZTtcclxuXHRcdGlmIChlbmVyZ3lSZWdlbkJhc2UgPT0gbnVsbCkgZW5lcmd5UmVnZW5CYXNlID0gdGVtcGxhdGUuZW5lcmd5UmVnZW5CYXNlO1xyXG5cdFx0aWYgKHJhbmdlQmFzZSA9PSBudWxsKSByYW5nZUJhc2UgPSB0ZW1wbGF0ZS5yYW5nZUJhc2U7XHJcblxyXG5cdFx0c3VwZXIobWFwSWQsIHgsIHksIGRpcmVjdGlvbiwgbmFtZSwgc3ByaXRlKTtcclxuXHRcdHRoaXMuYm90SWQgPSBfaWQ7XHJcblx0XHR0aGlzLnRlbXBsYXRlSWQgPSB0ZW1wbGF0ZS5faWQ7XHJcblx0XHR0aGlzLmRhbWFnZUJhc2UgPSBkYW1hZ2VCYXNlO1xyXG5cdFx0dGhpcy5kZWZlbmNlQmFzZSA9IGRlZmVuY2VCYXNlO1xyXG5cdFx0dGhpcy5oZWFsdGhNYXhCYXNlID0gaGVhbHRoTWF4QmFzZTtcclxuXHRcdHRoaXMuZW5lcmd5TWF4QmFzZSA9IGVuZXJneU1heEJhc2U7XHJcblx0XHR0aGlzLmhlYWx0aFJlZ2VuQmFzZSA9IGhlYWx0aFJlZ2VuQmFzZTtcclxuXHRcdHRoaXMuZW5lcmd5UmVnZW5CYXNlID0gZW5lcmd5UmVnZW5CYXNlO1xyXG5cdFx0dGhpcy5yYW5nZUJhc2UgPSByYW5nZUJhc2U7XHJcblx0XHR0aGlzLnJlc3RvcmUoKTtcclxuXHRcdFxyXG5cdFx0dGhpcy5ob3N0aWxlID0gaG9zdGlsZTtcclxuXHRcdHRoaXMudGFyZ2V0ID0gbnVsbDtcclxuXHRcdHRoaXMuc2V0VGFzaygnd2FuZGVyaW5nJyk7XHJcblx0XHR0aGlzLm1vdmVUaW1lciA9IDA7XHJcblxyXG5cdFx0dGhpcy5nYW1lSWQgPSB1dGlsLmZpcnN0RW1wdHlJbmRleChnYW1lLmJvdHMpO1xyXG5cdFx0Z2FtZS5ib3RzW3RoaXMuZ2FtZUlkXSA9IHRoaXM7XHJcblx0fVxyXG5cclxuXHR1cGRhdGUoZGVsdGEpIHtcclxuXHRcdHN1cGVyLnVwZGF0ZShkZWx0YSk7IFx0Ly8gRGVmYXVsdCBBY3RvciBVcGRhdGVcclxuXHRcdGlmICh0aGlzLmlzRGVhZCkgcmV0dXJuO1xyXG5cclxuXHRcdHRoaXMubW92ZVRpbWVyKys7XHJcblx0XHRcclxuXHRcdC8vIEFJIElucHV0c1xyXG5cdFx0c3dpdGNoKHRoaXMudGFzaykge1xyXG5cdFx0XHRjYXNlICd3YW5kZXJpbmcnOlx0XHQvLyBNb3ZlIHJhbmRvbWx5XHJcblx0XHRcdFx0dGhpcy5tb3ZlKCk7XHJcblx0XHRcdFx0dGhpcy5waWNrVXAoKTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ2ZvbGxvd2luZyc6XHRcdC8vIE1vdmUgdG93YXJkcyB0YXJnZXRcclxuXHRcdFx0XHRpZiAodGhpcy50YXJnZXQpIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZVRvVGFyZ2V0KHRoaXMudGFyZ2V0LCBmYWxzZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly8gTm8gdGFyZ2V0XHJcblx0XHRcdFx0XHR0aGlzLnNldFRhc2soJ3dhbmRlcmluZycpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ2F0dGFja2luZyc6XHRcdC8vIE1vdmUgdG93YXJkcyB0YXJnZXQgYW5kIGF0dGFja1xyXG5cdFx0XHRcdGlmICh0aGlzLnRhcmdldCkge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlVG9UYXJnZXQodGhpcy50YXJnZXQsIHRydWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdC8vIE5vIHRhcmdldFxyXG5cdFx0XHRcdFx0dGhpcy5zZXRUYXNrKCd3YW5kZXJpbmcnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHQvLyBjYXNlICdpZGxlJzpcclxuXHRcdFx0ZGVmYXVsdDogXHRcdFx0XHRcdC8vIFN0YW5kIHN0aWxsXHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gdGhpcy5nZXRQYWNrKCk7XHJcblx0fVxyXG5cdFxyXG5cdGdldFBhY2soKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRnYW1lSWQ6IHRoaXMuZ2FtZUlkLFxyXG5cdFx0XHRuYW1lOiB0aGlzLm5hbWUsXHJcblx0XHRcdHNwcml0ZTogdGhpcy5zcHJpdGUsXHJcblx0XHRcdGRpcmVjdGlvbjogdGhpcy5kaXJlY3Rpb24sXHJcblx0XHRcdG1hcElkOiB0aGlzLm1hcElkLFxyXG5cdFx0XHR4OiB0aGlzLnN0YXJ0WCxcclxuXHRcdFx0eTogdGhpcy5zdGFydFksXHJcblx0XHRcdHo6IHRoaXMueixcclxuXHRcdFx0ZGVzdGluYXRpb25YOiB0aGlzLmRlc3RpbmF0aW9uWCxcclxuXHRcdFx0ZGVzdGluYXRpb25ZOiB0aGlzLmRlc3RpbmF0aW9uWSxcclxuXHRcdFx0bGVycDogdGhpcy5sZXJwLFxyXG5cdFx0XHRpc1J1bm5pbmc6IHRoaXMuaXNSdW5uaW5nLFxyXG5cdFx0XHRpc0F0dGFja2luZzogdGhpcy5pc0F0dGFja2luZyxcclxuXHRcdFx0aXNEZWFkOiBmYWxzZSxcclxuXHRcdFx0aXNWaXNpYmxlOiB0aGlzLmlzVmlzaWJsZVxyXG5cdFx0fTtcclxuXHR9XHJcblx0XHJcblx0Z2V0REJQYWNrKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0Ym90SWQ6IHRoaXMuYm90SWQsXHJcblx0XHRcdHRlbXBsYXRlSWQ6IHRoaXMudGVtcGxhdGVJZCxcclxuXHRcdFx0bWFwSWQ6IHRoaXMubWFwSWQsXHJcblx0XHRcdHg6IHRoaXMueCxcclxuXHRcdFx0eTogdGhpcy55LFxyXG5cdFx0XHRkaXJlY3Rpb246IHRoaXMuZGlyZWN0aW9uLFxyXG5cdFx0XHRuYW1lOiB0aGlzLm5hbWUsXHJcblx0XHRcdHNwcml0ZTogdGhpcy5zcHJpdGUsXHJcblx0XHRcdGhvc3RpbGU6IHRoaXMuaG9zdGlsZVxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdHJlbW92ZSgpIHtcclxuXHRcdGRlbGV0ZSBnYW1lLmJvdHNbdGhpcy5nYW1lSWRdO1xyXG5cdH1cclxuXHRcclxuXHRtb3ZlKGRpcmVjdGlvbikge1xyXG5cdFx0bGV0IG1vdmVUaW1lID0gMjQ7XHJcblx0XHRpZiAodGhpcy5pc1J1bm5pbmcpIG1vdmVUaW1lID0gMTc7XHJcblx0XHRpZiAodGhpcy5tb3ZlVGltZXIgPiBtb3ZlVGltZSAmJiB0aGlzLmF0dGFja1RpbWVyID09PSAwKSB7XHJcblx0XHRcdHN1cGVyLm1vdmUoZGlyZWN0aW9uKTtcclxuXHRcdFx0dGhpcy5tb3ZlVGltZXIgPSAwO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHR0YWtlRGFtYWdlKGRhbWFnZSwgYXR0YWNrZXIpIHtcclxuXHRcdGlmIChhdHRhY2tlciBpbnN0YW5jZW9mIEFjdG9yKSB0aGlzLnNldFRhc2soJ2F0dGFja2luZycsIGF0dGFja2VyKTtcclxuXHRcdHN1cGVyLnRha2VEYW1hZ2UoZGFtYWdlLCBhdHRhY2tlcik7XHJcblx0fVxyXG5cdFxyXG5cdHBpY2tVcCgpIHtcclxuXHRcdHN1cGVyLnBpY2tVcCgpO1xyXG5cdFx0dGhpcy5jaGVja0Jlc3RFcXVpcG1lbnQoKTtcclxuXHR9XHJcblxyXG5cdGdldEludmVudG9yeSgpIHtcclxuXHRcdGNvbnN0IGludmVudG9yeSA9IGdhbWUuaXRlbXMuZmlsdGVyKGl0ZW0gPT4ge1xyXG5cdFx0XHRyZXR1cm4gXCJcIitpdGVtLmJvdElkID09PSBcIlwiK3RoaXMuYm90SWQ7XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBpbnZlbnRvcnk7XHJcblx0fVxyXG5cclxuXHRzZXREZWFkKCkge1xyXG5cdFx0c3VwZXIuc2V0RGVhZCgpO1xyXG5cdFx0dGhpcy5yZW1vdmUoKTtcclxuXHR9XHJcblxyXG5cdC8vIElucHV0c1xyXG5cdHNldFRhc2sodGFzaywgdGFyZ2V0KSB7XHJcblx0XHRzd2l0Y2ggKHRhc2spIHtcclxuXHRcdFx0Y2FzZSAnd2FuZGVyaW5nJzpcclxuXHRcdFx0XHR0aGlzLmxhemluZXNzID0gNztcclxuXHRcdFx0XHR0aGlzLnRhcmdldCA9IG51bGw7XHJcblx0XHRcdFx0dGhpcy50YXNrID0gdGFzaztcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ2ZvbGxvd2luZyc6XHJcblx0XHRcdFx0aWYgKHRhcmdldCA9PT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0dGhpcy5zZXRUYXNrKCd3YW5kZXJpbmcnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLmxhemluZXNzID0gMDtcclxuXHRcdFx0XHRcdHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xyXG5cdFx0XHRcdFx0dGhpcy50YXNrID0gdGFzaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdhdHRhY2tpbmcnOlxyXG5cdFx0XHRcdGlmICh0YXJnZXQgPT09IG51bGwpIHtcclxuXHRcdFx0XHRcdHRoaXMuc2V0VGFzaygnd2FuZGVyaW5nJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5sYXppbmVzcyA9IDA7XHJcblx0XHRcdFx0XHR0aGlzLnRhcmdldCA9IHRhcmdldDtcclxuXHRcdFx0XHRcdHRoaXMudGFzayA9IHRhc2s7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0ZGVmYXVsdDpcdC8vaWRsaW5nXHJcblx0XHRcdFx0dGhpcy5sYXppbmVzcyA9IDc7XHJcblx0XHRcdFx0dGhpcy50YXJnZXQgPSBudWxsO1xyXG5cdFx0XHRcdHRoaXMudGFzayA9ICdpZGxlJztcclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGNoZWNrQmVzdEVxdWlwbWVudCgpIHtcclxuXHRcdGNvbnN0IGludmVudG9yeSA9IHRoaXMuZ2V0SW52ZW50b3J5KCk7XHJcblx0XHRjb25zdCBlcXVpcG1lbnQgPSBbXTtcclxuXHRcdGZvciAobGV0IHNsb3QgPSAwOyBzbG90IDwgY29uZmlnLkVRVUlQTUVOVF9TSVpFOyBzbG90KyspIHtcclxuXHRcdFx0ZXF1aXBtZW50LnB1c2goW10pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgaW52ZW50b3J5Lmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IGl0ZW0gPSBpbnZlbnRvcnlbaV07XHJcblx0XHRcdGZvciAobGV0IHNsb3QgPSAwOyBzbG90IDwgY29uZmlnLkVRVUlQTUVOVF9TSVpFOyBzbG90KyspIHtcclxuXHRcdFx0XHRpZiAoaXRlbS5lcXVpcHBlZFNsb3QgPT09IHNsb3QpIHtcclxuXHRcdFx0XHRcdGVxdWlwbWVudFtzbG90XS5wdXNoKGl0ZW0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChlcXVpcG1lbnRbMF0ubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRlcXVpcG1lbnRbMF0uc29ydCgoYSwgYikgPT4gYi5lcXVpcHBlZC5kYW1hZ2UgLSBhLmVxdWlwcGVkLmRhbWFnZSk7XHJcblx0XHRcdHRoaXMuZXF1aXBJdGVtKGVxdWlwbWVudFswXVswXSk7XHJcblx0XHR9XHJcblx0XHRpZiAoZXF1aXBtZW50WzFdLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0ZXF1aXBtZW50WzFdLnNvcnQoKGEsIGIpID0+IGIuZXF1aXBwZWQuZGVmZW5jZSAtIGEuZXF1aXBwZWQuZGVmZW5jZSk7XHJcblx0XHRcdHRoaXMuZXF1aXBJdGVtKGVxdWlwbWVudFsxXVswXSk7XHJcblx0XHR9XHJcblx0XHRpZiAoZXF1aXBtZW50WzJdLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0ZXF1aXBtZW50WzJdLnNvcnQoKGEsIGIpID0+IGIuZXF1aXBwZWQuZGVmZW5jZSAtIGEuZXF1aXBwZWQuZGVmZW5jZSk7XHJcblx0XHRcdHRoaXMuZXF1aXBJdGVtKGVxdWlwbWVudFsyXVswXSk7XHJcblx0XHR9XHJcblx0XHRpZiAoZXF1aXBtZW50WzNdLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0ZXF1aXBtZW50WzNdLnNvcnQoKGEsIGIpID0+IGIuZXF1aXBwZWQuZGVmZW5jZSAtIGEuZXF1aXBwZWQuZGVmZW5jZSk7XHJcblx0XHRcdHRoaXMuZXF1aXBJdGVtKGVxdWlwbWVudFszXVswXSk7XHJcblx0XHR9XHJcblx0XHRpZiAoZXF1aXBtZW50WzRdLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0ZXF1aXBtZW50WzRdLnNvcnQoKGEsIGIpID0+IGIuZXF1aXBwZWQuZGVmZW5jZSAtIGEuZXF1aXBwZWQuZGVmZW5jZSk7XHJcblx0XHRcdHRoaXMuZXF1aXBJdGVtKGVxdWlwbWVudFs0XVswXSk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbiIsImltcG9ydCBFbnRpdHkgZnJvbSAnLi9lbnRpdHkuanMnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuLi9nYW1lLmpzJztcclxuaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9jb25maWcuanMnO1xyXG5pbXBvcnQgdXRpbCBmcm9tICcuLi91dGlsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVmZmVjdCBleHRlbmRzIEVudGl0eSB7XHJcblx0Y29uc3RydWN0b3IobWFwSWQsIHgsIHksIHNwcml0ZSA9IDAsIGxvb3AgPSAwLCBzcGVlZCA9IDEyLCBtYXhGcmFtZSA9IDcsIHN0YXJ0RnJhbWUgPSAwKSB7XHJcblx0XHRzdXBlcihtYXBJZCwgeCwgeSwgdXRpbC5jbGFtcChzcHJpdGUsIDAsIGNvbmZpZy5NQVhfRUZGRUNUUyAtIDEpKTtcclxuXHRcdHRoaXMubWF4RnJhbWUgPSB1dGlsLmNsYW1wKG1heEZyYW1lLCAwLCA3KTtcclxuXHRcdHRoaXMuc3RhcnRGcmFtZSA9IHV0aWwuY2xhbXAoc3RhcnRGcmFtZSwgMCwgdGhpcy5tYXhGcmFtZSk7XHJcblx0XHR0aGlzLmN1cnJlbnRGcmFtZSA9IHRoaXMuc3RhcnRGcmFtZTtcclxuXHRcdFxyXG5cdFx0dGhpcy5sb29wID0gbG9vcDtcclxuXHRcdHRoaXMuc3BlZWQgPSBzcGVlZDtcclxuXHRcdHRoaXMudGltZXIgPSAwO1xyXG5cdFx0XHJcblx0XHR0aGlzLmdhbWVJZCA9IHV0aWwuZmlyc3RFbXB0eUluZGV4KGdhbWUuZWZmZWN0cyk7XHJcblx0XHRnYW1lLmVmZmVjdHNbdGhpcy5nYW1lSWRdID0gdGhpcztcclxuXHR9XHJcblx0XHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHR0aGlzLnRpbWVyICs9IGRlbHRhO1xyXG5cdFx0XHJcblx0XHRpZiAodGhpcy50aW1lciA+PSAxIC8gdGhpcy5zcGVlZCkge1xyXG5cdFx0XHR0aGlzLnRpbWVyID0gMDtcclxuXHRcdFx0dGhpcy5jdXJyZW50RnJhbWUrKztcclxuXHJcblx0XHRcdGlmICh0aGlzLmN1cnJlbnRGcmFtZSA+IHRoaXMubWF4RnJhbWUpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5sb29wIDwgMCkge1xyXG5cdFx0XHRcdFx0dGhpcy5jdXJyZW50RnJhbWUgPSB0aGlzLnN0YXJ0RnJhbWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2UgaWYgKHRoaXMubG9vcCA+IDApIHtcclxuXHRcdFx0XHRcdHRoaXMuY3VycmVudEZyYW1lID0gdGhpcy5zdGFydEZyYW1lO1xyXG5cdFx0XHRcdFx0dGhpcy5sb29wLS07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5jdXJyZW50RnJhbWUgPSB0aGlzLm1heEZyYW1lO1xyXG5cdFx0XHRcdFx0dGhpcy5yZW1vdmUoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGhpcy5nZXRQYWNrKCk7XHJcblx0fVxyXG5cdFxyXG5cdGdldFBhY2soKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRnYW1lSWQ6IHRoaXMuZ2FtZUlkLFxyXG5cdFx0XHRtYXBJZDogdGhpcy5tYXBJZCxcclxuXHRcdFx0eDogdGhpcy54LFxyXG5cdFx0XHR5OiB0aGlzLnksXHJcblx0XHRcdHNwcml0ZTogdGhpcy5zcHJpdGUsXHJcblx0XHRcdGN1cnJlbnRGcmFtZTogdGhpcy5jdXJyZW50RnJhbWVcclxuXHRcdH07XHJcblx0fVxyXG5cdFxyXG5cdHJlbW92ZSgpIHtcclxuXHRcdGRlbGV0ZSBnYW1lLmVmZmVjdHNbdGhpcy5nYW1lSWRdO1xyXG5cdH1cdFxyXG59XHJcbiIsImltcG9ydCBjb25maWcgZnJvbSAnLi4vY29uZmlnLmpzJztcclxuXHJcbi8vIEFuIEVudGl0eSBpcyBhbnkgb2JqZWN0IHdoaWNoIGNhbiBhcHBlYXIgb24gdGhlIG1hcFxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW50aXR5IHtcclxuXHRjb25zdHJ1Y3RvcihtYXBJZCwgeCwgeSwgc3ByaXRlID0gMSkge1xyXG5cdFx0dGhpcy5tYXBJZCA9IG1hcElkO1xyXG5cdFx0dGhpcy54ID0geDtcclxuXHRcdHRoaXMueSA9IHk7XHJcblx0XHRpZiAoc3ByaXRlIDwgMSkgc3ByaXRlID0gMTtcclxuXHRcdHRoaXMuc3ByaXRlID0gc3ByaXRlO1xyXG5cdFx0dGhpcy5pc1Zpc2libGUgPSB0cnVlO1xyXG5cdH1cclxufVxyXG4iLCJpbXBvcnQgZ2FtZSBmcm9tICcuLi9nYW1lLmpzJztcclxuaW1wb3J0IHV0aWwgZnJvbSAnLi4vdXRpbC5qcyc7XHJcbmltcG9ydCBFbnRpdHkgZnJvbSAnLi9lbnRpdHkuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSXRlbSBleHRlbmRzIEVudGl0eSB7XHJcblx0Y29uc3RydWN0b3IoZGF0YSkge1xyXG5cdFx0aWYgKCFkYXRhKSByZXR1cm47XHJcblxyXG5cdFx0bGV0IHsgX2lkLCBwbGF5ZXJJZCwgYm90SWQsIHNsb3QsIG1hcElkLCB4LCB5LCB0ZW1wbGF0ZSwgc3RhY2ssIHNwcml0ZSwgbmFtZSwgZGVzY3JpcHRpb24sIHJldXNhYmxlLCBjcmVhdGVkQnksIGNyZWF0ZWREYXRlLFxyXG5cdFx0XHRcdFx0cGFzc2l2ZURhbWFnZSwgcGFzc2l2ZURlZmVuY2UsIHBhc3NpdmVIZWFsdGhNYXgsIHBhc3NpdmVFbmVyZ3lNYXgsIHBhc3NpdmVSYW5nZSxcclxuXHRcdFx0XHRcdGVxdWlwcGVkRGFtYWdlLCBlcXVpcHBlZERlZmVuY2UsIGVxdWlwcGVkSGVhbHRoTWF4LCBlcXVpcHBlZEVuZXJneU1heCwgZXF1aXBwZWRSYW5nZVxyXG5cdFx0XHRcdH0gPSBkYXRhO1xyXG5cclxuXHRcdGlmIChfaWQgPT0gbnVsbCkgX2lkID0gZ2FtZS5yZXF1ZXN0REJJZCgpO1xyXG5cdFx0aWYgKHBsYXllcklkID09PSB1bmRlZmluZWQpIHBsYXllcklkID0gbnVsbDtcclxuXHRcdGlmIChib3RJZCA9PT0gdW5kZWZpbmVkKSBib3RJZCA9IG51bGw7XHJcblx0XHRpZiAoc2xvdCA9PT0gdW5kZWZpbmVkKSBzbG90ID0gbnVsbDtcclxuXHRcdGlmIChtYXBJZCA9PT0gdW5kZWZpbmVkKSBtYXBJZCA9IG51bGw7XHJcblx0XHRpZiAoeCA9PT0gdW5kZWZpbmVkKSB4ID0gbnVsbDtcclxuXHRcdGlmICh5ID09PSB1bmRlZmluZWQpIHkgPSBudWxsO1xyXG5cdFx0aWYgKGNyZWF0ZWRCeSA9PT0gdW5kZWZpbmVkKSBjcmVhdGVkQnkgPSBudWxsO1xyXG5cdFx0aWYgKGNyZWF0ZWREYXRlID09PSB1bmRlZmluZWQpIGNyZWF0ZWREYXRlID0gbmV3IERhdGUoKTtcclxuXHJcblx0XHRpZiAoc3ByaXRlID09PSB1bmRlZmluZWQpIHNwcml0ZSA9IHRlbXBsYXRlLnNwcml0ZTtcclxuXHRcdGlmIChuYW1lID09PSB1bmRlZmluZWQpIG5hbWUgPSB0ZW1wbGF0ZS5uYW1lO1xyXG5cdFx0aWYgKGRlc2NyaXB0aW9uID09PSB1bmRlZmluZWQpIGRlc2NyaXB0aW9uID0gdGVtcGxhdGUuZGVzY3JpcHRpb247XHJcblx0XHRpZiAocmV1c2FibGUgPT09IHVuZGVmaW5lZCkgcmV1c2FibGUgPSB0ZW1wbGF0ZS5yZXVzYWJsZTtcclxuXHRcdGlmIChwYXNzaXZlRGFtYWdlID09PSB1bmRlZmluZWQpIHBhc3NpdmVEYW1hZ2UgPSB0ZW1wbGF0ZS5wYXNzaXZlRGFtYWdlO1xyXG5cdFx0aWYgKHBhc3NpdmVEZWZlbmNlID09PSB1bmRlZmluZWQpIHBhc3NpdmVEZWZlbmNlID0gdGVtcGxhdGUucGFzc2l2ZURlZmVuY2U7XHJcblx0XHRpZiAocGFzc2l2ZUhlYWx0aE1heCA9PT0gdW5kZWZpbmVkKSBwYXNzaXZlSGVhbHRoTWF4ID0gdGVtcGxhdGUucGFzc2l2ZUhlYWx0aE1heDtcclxuXHRcdGlmIChwYXNzaXZlRW5lcmd5TWF4ID09PSB1bmRlZmluZWQpIHBhc3NpdmVFbmVyZ3lNYXggPSB0ZW1wbGF0ZS5wYXNzaXZlRW5lcmd5TWF4O1xyXG5cdFx0aWYgKHBhc3NpdmVSYW5nZSA9PT0gdW5kZWZpbmVkKSBwYXNzaXZlUmFuZ2UgPSB0ZW1wbGF0ZS5wYXNzaXZlUmFuZ2U7XHJcblx0XHRpZiAoZXF1aXBwZWREYW1hZ2UgPT09IHVuZGVmaW5lZCkgZXF1aXBwZWREYW1hZ2UgPSB0ZW1wbGF0ZS5lcXVpcHBlZERhbWFnZTtcclxuXHRcdGlmIChlcXVpcHBlZERlZmVuY2UgPT09IHVuZGVmaW5lZCkgZXF1aXBwZWREZWZlbmNlID0gdGVtcGxhdGUuZXF1aXBwZWREZWZlbmNlO1xyXG5cdFx0aWYgKGVxdWlwcGVkSGVhbHRoTWF4ID09PSB1bmRlZmluZWQpIGVxdWlwcGVkSGVhbHRoTWF4ID0gdGVtcGxhdGUuZXF1aXBwZWRIZWFsdGhNYXg7XHJcblx0XHRpZiAoZXF1aXBwZWRFbmVyZ3lNYXggPT09IHVuZGVmaW5lZCkgZXF1aXBwZWRFbmVyZ3lNYXggPSB0ZW1wbGF0ZS5lcXVpcHBlZEVuZXJneU1heDtcclxuXHRcdGlmIChlcXVpcHBlZFJhbmdlID09PSB1bmRlZmluZWQpIGVxdWlwcGVkUmFuZ2UgPSB0ZW1wbGF0ZS5lcXVpcHBlZFJhbmdlO1xyXG5cclxuXHRcdHN1cGVyKG1hcElkLCB4LCB5LCBzcHJpdGUpO1xyXG5cdFx0dGhpcy56ID0gLTEwO1xyXG5cdFx0dGhpcy5pdGVtSWQgPSBfaWQ7XHJcblx0XHR0aGlzLnBsYXllcklkID0gcGxheWVySWQ7XHJcblx0XHR0aGlzLmJvdElkID0gYm90SWQ7XHJcblx0XHR0aGlzLnNsb3QgPSBzbG90O1xyXG5cdFx0XHJcblx0XHR0aGlzLnRlbXBsYXRlSWQgPSB0ZW1wbGF0ZS5faWQ7XHJcblx0XHR0aGlzLm5hbWUgPSBuYW1lO1xyXG5cdFx0dGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xyXG5cdFx0dGhpcy5yZXVzYWJsZSA9IHJldXNhYmxlO1xyXG5cclxuXHRcdHRoaXMudHlwZSA9IHRlbXBsYXRlLnR5cGUubmFtZTtcclxuXHRcdHRoaXMuc3RhY2thYmxlID0gdGVtcGxhdGUudHlwZS5zdGFja2FibGU7XHJcblx0XHR0aGlzLmVxdWlwcGVkU2xvdCA9IHRlbXBsYXRlLnR5cGUuZXF1aXBwZWRTbG90O1xyXG5cdFx0XHJcblx0XHR0aGlzLnBhc3NpdmUgPSB7XHJcblx0XHRcdGRhbWFnZTogcGFzc2l2ZURhbWFnZSxcclxuXHRcdFx0ZGVmZW5jZTogcGFzc2l2ZURlZmVuY2UsXHJcblx0XHRcdGhlYWx0aE1heDogcGFzc2l2ZUhlYWx0aE1heCxcclxuXHRcdFx0ZW5lcmd5TWF4OiBwYXNzaXZlRW5lcmd5TWF4LFxyXG5cdFx0XHRyYW5nZTogcGFzc2l2ZVJhbmdlXHJcblx0XHR9O1xyXG5cdFx0dGhpcy5lcXVpcHBlZCA9IHtcclxuXHRcdFx0ZGFtYWdlOiBlcXVpcHBlZERhbWFnZSxcclxuXHRcdFx0ZGVmZW5jZTogZXF1aXBwZWREZWZlbmNlLFxyXG5cdFx0XHRoZWFsdGhNYXg6IGVxdWlwcGVkSGVhbHRoTWF4LFxyXG5cdFx0XHRlbmVyZ3lNYXg6IGVxdWlwcGVkRW5lcmd5TWF4LFxyXG5cdFx0XHRyYW5nZTogZXF1aXBwZWRSYW5nZVxyXG5cdFx0fTtcclxuXHRcdFxyXG5cdFx0aWYgKHRoaXMuc3RhY2thYmxlKSB7XHJcblx0XHRcdGlmIChzdGFjayA8IDEpIHN0YWNrID0gMTtcclxuXHRcdFx0dGhpcy5zdGFjayA9IHN0YWNrO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHRoaXMuc3RhY2sgPSAwO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuZ2FtZUlkID0gdXRpbC5maXJzdEVtcHR5SW5kZXgoZ2FtZS5pdGVtcyk7XHJcblx0XHRnYW1lLml0ZW1zW3RoaXMuZ2FtZUlkXSA9IHRoaXM7XHJcblx0fVxyXG5cclxuXHR1cGRhdGUoZGVsdGEpIHtcclxuXHRcdHJldHVybiB0aGlzLmdldFBhY2soKTtcclxuXHR9XHJcblxyXG5cdGdldERCUGFjaygpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGl0ZW1JZDogdGhpcy5pdGVtSWQsXHJcblx0XHRcdHBsYXllcklkOiB0aGlzLnBsYXllcklkLFxyXG5cdFx0XHRib3RJZDogdGhpcy5ib3RJZCxcclxuXHRcdFx0c2xvdDogdGhpcy5zbG90LFxyXG5cdFx0XHRtYXBJZDogdGhpcy5tYXBJZCxcclxuXHRcdFx0eDogdGhpcy54LFxyXG5cdFx0XHR5OiB0aGlzLnksXHJcblx0XHRcdGNyZWF0ZWRCeTogdGhpcy5jcmVhdGVkQnksXHJcblx0XHRcdGNyZWF0ZWREYXRlOiB0aGlzLmNyZWF0ZWREYXRlLFxyXG5cdFx0XHR0ZW1wbGF0ZUlkOiB0aGlzLnRlbXBsYXRlSWQsXHJcblx0XHRcdG5hbWU6IHRoaXMubmFtZSxcclxuXHRcdFx0ZGVzY3JpcHRpb246IHRoaXMuZGVzY3JpcHRpb24sXHJcblx0XHRcdHNwcml0ZTogdGhpcy5zcHJpdGUsXHJcblx0XHRcdHJldXNhYmxlOiB0aGlzLnJldXNhYmxlLFxyXG5cdFx0XHRwYXNzaXZlRGFtYWdlOiB0aGlzLnBhc3NpdmUuZGFtYWdlLFxyXG5cdFx0XHRwYXNzaXZlRGVmZW5jZTogdGhpcy5wYXNzaXZlLmRlZmVuY2UsXHJcblx0XHRcdHBhc3NpdmVIZWFsdGhNYXg6IHRoaXMucGFzc2l2ZS5oZWFsdGhNYXgsXHJcblx0XHRcdHBhc3NpdmVFbmVyZ3lNYXg6IHRoaXMucGFzc2l2ZS5lbmVyZ3lNYXgsXHJcblx0XHRcdHBhc3NpdmVSYW5nZTogdGhpcy5wYXNzaXZlLnJhbmdlLFxyXG5cdFx0XHRlcXVpcHBlZERhbWFnZTogdGhpcy5lcXVpcHBlZC5kYW1hZ2UsXHJcblx0XHRcdGVxdWlwcGVkRGVmZW5jZTogdGhpcy5lcXVpcHBlZC5kZWZlbmNlLFxyXG5cdFx0XHRlcXVpcHBlZEhlYWx0aE1heDogdGhpcy5lcXVpcHBlZC5oZWFsdGhNYXgsXHJcblx0XHRcdGVxdWlwcGVkRW5lcmd5TWF4OiB0aGlzLmVxdWlwcGVkLmVuZXJneU1heCxcclxuXHRcdFx0ZXF1aXBwZWRSYW5nZTogdGhpcy5lcXVpcHBlZC5yYW5nZSxcclxuXHRcdFx0c3RhY2s6IHRoaXMuc3RhY2ssXHJcblx0XHRcdGlzVmlzaWJsZTogdGhpcy5pc1Zpc2libGVcclxuXHRcdH07XHJcblx0fVxyXG5cdFxyXG5cdGdldFBhY2soKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRnYW1lSWQ6IHRoaXMuZ2FtZUlkLFxyXG5cdFx0XHRwbGF5ZXJJZDogdGhpcy5wbGF5ZXJJZCxcclxuXHRcdFx0Ym90SWQ6IHRoaXMuYm90SWQsXHJcblx0XHRcdHNsb3Q6IHRoaXMuc2xvdCxcclxuXHRcdFx0bWFwSWQ6IHRoaXMubWFwSWQsXHJcblx0XHRcdHg6IHRoaXMueCxcclxuXHRcdFx0eTogdGhpcy55LFxyXG5cdFx0XHR6OiB0aGlzLnosXHJcblx0XHRcdG5hbWU6IHRoaXMubmFtZSxcclxuXHRcdFx0ZGVzY3JpcHRpb246IHRoaXMuZGVzY3JpcHRpb24sXHJcblx0XHRcdHNwcml0ZTogdGhpcy5zcHJpdGUsXHJcblx0XHRcdHR5cGU6IHRoaXMudHlwZSxcclxuXHRcdFx0cmV1c2FibGU6IHRoaXMucmV1c2FibGUsXHJcblx0XHRcdHBhc3NpdmU6IHRoaXMucGFzc2l2ZSxcclxuXHRcdFx0ZXF1aXBwZWQ6IHRoaXMuZXF1aXBwZWQsXHJcblx0XHRcdHN0YWNrOiB0aGlzLnN0YWNrLFxyXG5cdFx0XHRpc1Zpc2libGU6IHRoaXMuaXNWaXNpYmxlXHJcblx0XHR9O1xyXG5cdH1cclxuXHRcclxuXHRyZW1vdmUoKSB7XHJcblx0XHRkZWxldGUgZ2FtZS5pdGVtc1t0aGlzLmdhbWVJZF07XHJcblx0fVxyXG5cclxuXHRyZW1vdmVPbmUoKSB7XHJcblx0XHRpZiAodGhpcy5zdGFjayA+IDEpIHtcclxuXHRcdFx0dGhpcy5zdGFjay0tO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHRoaXMucmVtb3ZlKCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRtb3ZlVG9JbnZlbnRvcnkocGxheWVySWQsIGJvdElkLCBzbG90KSB7XHJcblx0XHR0aGlzLnBsYXllcklkID0gcGxheWVySWQ7XHJcblx0XHR0aGlzLmJvdElkID0gYm90SWQ7XHJcblx0XHR0aGlzLnNsb3QgPSBzbG90O1xyXG5cdFx0dGhpcy5tYXBJZCA9IG51bGw7XHJcblx0XHR0aGlzLnggPSBudWxsO1xyXG5cdFx0dGhpcy55ID0gbnVsbDtcclxuXHRcdHRoaXMueiA9IG51bGw7XHJcblx0fVxyXG5cclxuXHRtb3ZlVG9NYXAobWFwSWQsIHgsIHkpIHtcclxuXHRcdHRoaXMubWFwSWQgPSBtYXBJZDtcclxuXHRcdHRoaXMueCA9IHg7XHJcblx0XHR0aGlzLnkgPSB5O1xyXG5cdFx0dGhpcy56ID0gdGhpcy5nZXRaUG9zaXRpb24obWFwSWQsIHgsIHkpO1xyXG5cdFx0dGhpcy5wbGF5ZXJJZCA9IG51bGw7XHJcblx0XHR0aGlzLmJvdElkID0gbnVsbDtcclxuXHRcdHRoaXMuc2xvdCA9IG51bGw7XHJcblx0fVxyXG5cdFxyXG5cdGdldFpQb3NpdGlvbihtYXBJZCwgeCwgeSkge1xyXG5cdFx0cmV0dXJuIC0xMDtcclxuXHR9XHJcblxyXG5cdGlzRXF1aXBtZW50KCkge1xyXG5cdFx0aWYgKHRoaXMuZXF1aXBwZWRTbG90ID49IDApIHtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG4iLCJpbXBvcnQgY29uZmlnIGZyb20gJy4uL2NvbmZpZy5qcyc7XHJcbmltcG9ydCB1dGlsIGZyb20gJy4uL3V0aWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFwIHtcclxuXHRjb25zdHJ1Y3RvcihtYXBJZCwgZGF0YSA9IHt9KSB7XHJcblx0XHR0aGlzLm1hcElkID0gbWFwSWQ7XHJcblxyXG5cdFx0aWYgKGRhdGEubmFtZSA9PSBudWxsKSBkYXRhLm5hbWUgPSBcIkJsYW5rIE1hcFwiO1xyXG5cdFx0aWYgKGRhdGEuZHJvcENoYW5jZSA9PSBudWxsKSBkYXRhLmRyb3BDaGFuY2UgPSAxMDA7XHJcblx0XHRpZiAoZGF0YS5kcm9wQW1vdW50RVEgPT0gbnVsbCkgZGF0YS5kcm9wQW1vdW50RVEgPSAxO1xyXG5cdFx0aWYgKCFkYXRhLnRpbGVzKSBkYXRhLnRpbGVzID0gdXRpbC5jcmVhdGUzZEFycmF5KGNvbmZpZy5NQVBfQ09MVU1OUywgY29uZmlnLk1BUF9ST1dTLCBjb25maWcuTUFQX0xBWUVSUywgMCk7XHJcblx0XHRpZiAoIWRhdGEuaXNXYWxsKSBkYXRhLmlzV2FsbCA9IHV0aWwuY3JlYXRlMmRBcnJheShjb25maWcuTUFQX0NPTFVNTlMsIGNvbmZpZy5NQVBfUk9XUywgZmFsc2UpO1xyXG5cdFx0aWYgKCFkYXRhLmlzSG9zdGlsZSkgZGF0YS5pc0hvc3RpbGUgPSB1dGlsLmNyZWF0ZTJkQXJyYXkoY29uZmlnLk1BUF9DT0xVTU5TLCBjb25maWcuTUFQX1JPV1MsIGZhbHNlKTtcclxuXHRcdGlmICghZGF0YS5kYW1hZ2UpIGRhdGEuZGFtYWdlID0gdXRpbC5jcmVhdGUyZEFycmF5KGNvbmZpZy5NQVBfQ09MVU1OUywgY29uZmlnLk1BUF9ST1dTLCBudWxsKTtcclxuXHRcdGlmICghZGF0YS53YXJwTWFwKSBkYXRhLndhcnBNYXAgPSB1dGlsLmNyZWF0ZTJkQXJyYXkoY29uZmlnLk1BUF9DT0xVTU5TLCBjb25maWcuTUFQX1JPV1MsIG51bGwpO1xyXG5cdFx0aWYgKCFkYXRhLndhcnBYKSBkYXRhLndhcnBYID0gdXRpbC5jcmVhdGUyZEFycmF5KGNvbmZpZy5NQVBfQ09MVU1OUywgY29uZmlnLk1BUF9ST1dTLCBudWxsKTtcclxuXHRcdGlmICghZGF0YS53YXJwWSkgZGF0YS53YXJwWSA9IHV0aWwuY3JlYXRlMmRBcnJheShjb25maWcuTUFQX0NPTFVNTlMsIGNvbmZpZy5NQVBfUk9XUywgbnVsbCk7XHJcblxyXG5cdFx0dGhpcy5uYW1lID0gZGF0YS5uYW1lO1xyXG5cdFx0dGhpcy5kcm9wQ2hhbmNlID0gdXRpbC5jbGFtcChkYXRhLmRyb3BDaGFuY2UsIDAsIDEwMCk7XHJcblx0XHR0aGlzLmRyb3BBbW91bnRFUSA9IHV0aWwuY2xhbXAoZGF0YS5kcm9wQW1vdW50RVEsIDAsIGNvbmZpZy5FUVVJUE1FTlRfU0laRSk7XHJcblx0XHQvL3RoaXMuZHJvcENoYW5jZSA9IDAgPSAwJSBjaGFuY2UgdG8gZHJvcCBpdGVtcyBpbiBpbnZlbnRvcnkgKGRyb3Agbm90aGluZyksIDEwMCA9IDEwMCUgY2hhbmNlIHRvIGRyb3AgKGRyb3AgZXZlcnl0aGluZylcclxuXHRcdC8vdGhpcy5kcm9wQW1vdW50RVEgPSBudW1iZXIgb2YgZXF1aXBwZWQgaXRlbXMgdGhlIHBsYXllciB3aWxsIGRyb3Agb24gZGVhdGguIGRyb3BFUSA9IEVRVUlQTUVOVF9TSVpFID0gZHJvcCBhbGwgZXF1aXBtZW50XHJcblx0XHR0aGlzLnRpbGVzID0gZGF0YS50aWxlcztcclxuXHRcdHRoaXMuaXNXYWxsID0gZGF0YS5pc1dhbGw7XHJcblx0XHR0aGlzLmlzSG9zdGlsZSA9IGRhdGEuaXNIb3N0aWxlO1xyXG5cdFx0dGhpcy5kYW1hZ2UgPSBkYXRhLmRhbWFnZTtcclxuXHRcdHRoaXMud2FycE1hcCA9IGRhdGEud2FycE1hcDtcclxuXHRcdHRoaXMud2FycFggPSBkYXRhLndhcnBYO1xyXG5cdFx0dGhpcy53YXJwWSA9IGRhdGEud2FycFk7XHJcblx0fVxyXG5cdFxyXG5cdHVwbG9hZChkYXRhKSB7XHJcblx0XHRpZiAoZGF0YS5uYW1lICE9IG51bGwpIHRoaXMubmFtZSA9IGRhdGEubmFtZTtcclxuXHRcdGlmIChkYXRhLmRyb3BDaGFuY2UgIT0gbnVsbCkgdGhpcy5kcm9wQ2hhbmNlID0gZGF0YS5kcm9wQ2hhbmNlO1xyXG5cdFx0aWYgKGRhdGEuZHJvcEFtb3VudEVRICE9IG51bGwpIHRoaXMuZHJvcEFtb3VudEVRID0gZGF0YS5kcm9wQW1vdW50RVE7XHJcblx0XHRpZiAoZGF0YS50aWxlcykgdGhpcy50aWxlcyA9IGRhdGEudGlsZXM7XHJcblx0XHRpZiAoZGF0YS5pc1dhbGwpIHRoaXMuaXNXYWxsID0gZGF0YS5pc1dhbGw7XHJcblx0XHRpZiAoZGF0YS5pc0hvc3RpbGUpIHRoaXMuaXNIb3N0aWxlID0gZGF0YS5pc0hvc3RpbGU7XHJcblx0XHRpZiAoZGF0YS5kYW1hZ2UpIHRoaXMuZGFtYWdlID0gZGF0YS5kYW1hZ2U7XHJcblx0XHRpZiAoZGF0YS53YXJwTWFwKSB0aGlzLndhcnBNYXAgPSBkYXRhLndhcnBNYXA7XHJcblx0XHRpZiAoZGF0YS53YXJwWCkgdGhpcy53YXJwWCA9IGRhdGEud2FycFg7XHJcblx0XHRpZiAoZGF0YS53YXJwWSkgdGhpcy53YXJwWSA9IGRhdGEud2FycFk7XHJcblx0fVxyXG5cclxuXHRnZXRQYWNrKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0bWFwSWQ6IHRoaXMubWFwSWQsXHJcblx0XHRcdG5hbWU6IHRoaXMubmFtZSxcclxuXHRcdFx0ZHJvcENoYW5jZTogdGhpcy5kcm9wQ2hhbmNlLFxyXG5cdFx0XHRkcm9wQW1vdW50RVE6IHRoaXMuZHJvcEFtb3VudEVRLFxyXG5cdFx0XHR0aWxlczogdGhpcy50aWxlcyxcclxuXHRcdFx0aXNXYWxsOiB0aGlzLmlzV2FsbCxcclxuXHRcdFx0aXNIb3N0aWxlOiB0aGlzLmlzSG9zdGlsZSxcclxuXHRcdFx0ZGFtYWdlOiB0aGlzLmRhbWFnZSxcclxuXHRcdFx0d2FycE1hcDogdGhpcy53YXJwTWFwLFxyXG5cdFx0XHR3YXJwWDogdGhpcy53YXJwWCxcclxuXHRcdFx0d2FycFk6IHRoaXMud2FycFlcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHRnZXRVcGRhdGVQYWNrKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0bWFwSWQ6IHRoaXMubWFwSWQsXHJcblx0XHRcdG5hbWU6IHRoaXMubmFtZSxcclxuXHRcdFx0dGlsZXM6IHRoaXMudGlsZXNcclxuXHRcdH07XHJcblx0fVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIE1lc3NhZ2Uge1xyXG5cdGNvbnN0cnVjdG9yKHNlbmRlcklkLCBtZXNzYWdlLCB0eXBlLCBtYXBJZCwgaWQsIGNvbG91cikge1xyXG5cdFx0dGhpcy5zZW5kZXJJZCA9IHNlbmRlcklkOyAvLyBudWxsID0gc2VydmVyXHJcblx0XHR0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xyXG5cdFx0dGhpcy50eXBlID0gdHlwZTtcclxuXHRcdHRoaXMubWFwSWQgPSBtYXBJZDtcclxuXHRcdHRoaXMuaWQgPSBpZDtcclxuXHRcdHRoaXMuY29sb3VyID0gY29sb3VyO1xyXG5cdH1cclxufSIsImltcG9ydCBnYW1lIGZyb20gJy4uL2dhbWUuanMnO1xyXG5pbXBvcnQgY29uZmlnIGZyb20gJy4uL2NvbmZpZy5qcyc7XHJcbmltcG9ydCB1dGlsIGZyb20gJy4uL3V0aWwuanMnO1xyXG5pbXBvcnQgQWN0b3IgZnJvbSAnLi9hY3Rvci5qcyc7XHJcblxyXG4vLyBBIFBsYXllciBpcyBhbiBpbW1vcnRhbCBBY3RvciB3aGljaCB0YWtlcyBpbnB1dCBmcm9tIGEgY2xpZW50XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF5ZXIgZXh0ZW5kcyBBY3RvciB7XHJcblx0Y29uc3RydWN0b3Ioc29ja2V0SWQsIGRhdGEpIHtcclxuXHRcdGlmIChkYXRhLnNwcml0ZSA9PSBudWxsKSBkYXRhLnNwcml0ZSA9IGRhdGEudGVtcGxhdGUuc3ByaXRlO1xyXG5cclxuXHRcdHN1cGVyKGRhdGEubWFwSWQsIGRhdGEueCwgZGF0YS55LCBkYXRhLmRpcmVjdGlvbiwgZGF0YS5uYW1lLCBkYXRhLnNwcml0ZSk7XHJcblx0XHR0aGlzLnBsYXllcklkID0gZGF0YS5faWQ7XHJcblx0XHR0aGlzLnNvY2tldElkID0gc29ja2V0SWQ7XHJcblx0XHR0aGlzLmFjY291bnRJZCA9IGRhdGEuYWNjb3VudDtcclxuXHRcdHRoaXMuYWRtaW5BY2Nlc3MgPSBkYXRhLmFkbWluQWNjZXNzO1xyXG5cclxuXHRcdHRoaXMubGV2ZWwgPSBkYXRhLmxldmVsO1xyXG5cdFx0dGhpcy5leHBlcmllbmNlID0gZGF0YS5leHBlcmllbmNlO1xyXG5cdFx0dGhpcy50ZW1wbGF0ZUlkID0gZGF0YS50ZW1wbGF0ZS5faWQ7XHJcblx0XHR0aGlzLnRlbXBsYXRlID0gZGF0YS50ZW1wbGF0ZS5uYW1lO1xyXG5cdFx0dGhpcy5jYWxjQmFzZVN0YXRzKGRhdGEudGVtcGxhdGUpO1xyXG5cdFx0dGhpcy5yZXN0b3JlKCk7XHJcblxyXG5cdFx0dGhpcy5pc0RlYWQgPSBmYWxzZTtcclxuXHRcdHRoaXMuZGVhdGhzID0gMDtcclxuXHRcdHRoaXMucmVzcGF3blRpbWVyID0gMDtcclxuXHRcdHRoaXMucmVzcGF3blNwZWVkID0gMTA7XHJcblx0XHR0aGlzLnJlc3Bhd25NYXAgPSBkYXRhLm1hcElkO1xyXG5cdFx0dGhpcy5yZXNwYXduWCA9IGRhdGEueDtcclxuXHRcdHRoaXMucmVzcGF3blkgPSBkYXRhLnk7XHJcblxyXG5cdFx0dGhpcy5pbnB1dCA9IHtcclxuXHRcdFx0ZGlyZWN0aW9uOiBudWxsLFxyXG5cdFx0XHRydW46IGZhbHNlLFxyXG5cdFx0XHRwaWNrdXA6IGZhbHNlLFxyXG5cdFx0XHRhdHRhY2s6IGZhbHNlXHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuZ2FtZUlkID0gdXRpbC5maXJzdEVtcHR5SW5kZXgoZ2FtZS5wbGF5ZXJzKTtcclxuXHRcdGdhbWUucGxheWVyc1t0aGlzLmdhbWVJZF0gPSB0aGlzO1xyXG5cdH1cclxuXHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHRzdXBlci51cGRhdGUoZGVsdGEpO1x0XHQvLyBEZWZhdWx0IEFjdG9yIFVwZGF0ZVxyXG5cdFx0aWYgKHRoaXMuaXNEZWFkKSB7XHJcblx0XHRcdC8vIFJlc3Bhd25pbmdcclxuXHRcdFx0dGhpcy5yZXNwYXduVGltZXIgKz0gZGVsdGE7XHJcblx0XHRcdGlmICh0aGlzLnJlc3Bhd25UaW1lciA+PSB0aGlzLnJlc3Bhd25TcGVlZCkgdGhpcy5yZXNwYXduKCk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Ly8gQ2hlY2sgZm9yIEF0dGFjayBJbnB1dFxyXG5cdFx0XHRpZiAodGhpcy5pbnB1dC5hdHRhY2sgJiYgdGhpcy5hdHRhY2tUaW1lciA9PT0gMCkgdGhpcy5hdHRhY2soKTtcclxuXHRcdFx0XHJcblx0XHRcdC8vIENoZWNrIGZvciBNb3ZlbWVudCBJbnB1dFxyXG5cdFx0XHRpZiAoIXRoaXMuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHR0aGlzLmlzUnVubmluZyA9IGZhbHNlO1xyXG5cdFx0XHRcdGlmICh0aGlzLmlucHV0LmRpcmVjdGlvbikge1xyXG5cdFx0XHRcdFx0Ly8gQ2hlY2sgZm9yIFJ1biBJbnB1dFxyXG5cdFx0XHRcdFx0aWYgKHRoaXMuaW5wdXQucnVuICYmIHRoaXMuZW5lcmd5ID4gMCkgdGhpcy5pc1J1bm5pbmcgPSB0cnVlO1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlKHRoaXMuaW5wdXQuZGlyZWN0aW9uKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIHRoaXMuZ2V0R2FtZVBhY2soKTtcclxuXHR9XHJcblx0XHJcblx0Z2V0R2FtZVBhY2soKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRnYW1lSWQ6IHRoaXMuZ2FtZUlkLFxyXG5cdFx0XHRuYW1lOiB0aGlzLm5hbWUsXHJcblx0XHRcdGRlc2NyaXB0aW9uOiB0aGlzLmRlc2NyaXB0aW9uLFxyXG5cdFx0XHRzcHJpdGU6IHRoaXMuc3ByaXRlLFxyXG5cdFx0XHRkaXJlY3Rpb246IHRoaXMuZGlyZWN0aW9uLFxyXG5cdFx0XHRtYXBJZDogdGhpcy5tYXBJZCxcclxuXHRcdFx0eDogdGhpcy5zdGFydFgsXHJcblx0XHRcdHk6IHRoaXMuc3RhcnRZLFxyXG5cdFx0XHR6OiB0aGlzLnosXHJcblx0XHRcdGRlc3RpbmF0aW9uWDogdGhpcy5kZXN0aW5hdGlvblgsXHJcblx0XHRcdGRlc3RpbmF0aW9uWTogdGhpcy5kZXN0aW5hdGlvblksXHJcblx0XHRcdGxlcnA6IHRoaXMubGVycCxcclxuXHRcdFx0aXNSdW5uaW5nOiB0aGlzLmlzUnVubmluZyxcclxuXHRcdFx0aXNBdHRhY2tpbmc6IHRoaXMuaXNBdHRhY2tpbmcsXHJcblx0XHRcdGlzRGVhZDogdGhpcy5pc0RlYWQsXHJcblx0XHRcdGlzVmlzaWJsZTogdGhpcy5pc1Zpc2libGVcclxuXHRcdH07XHJcblx0fVxyXG5cdFxyXG5cdGdldFVJUGFjaygpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGxldmVsOiB0aGlzLmxldmVsLFxyXG5cdFx0XHRleHBlcmllbmNlOiB0aGlzLmV4cGVyaWVuY2UsXHJcblx0XHRcdGhlYWx0aDogdGhpcy5oZWFsdGgsXHJcblx0XHRcdGhlYWx0aE1heDogdGhpcy5oZWFsdGhNYXgsXHJcblx0XHRcdGVuZXJneTogdGhpcy5lbmVyZ3ksXHJcblx0XHRcdGVuZXJneU1heDogdGhpcy5lbmVyZ3lNYXgsXHJcblx0XHRcdG1vdmVTcGVlZDogdGhpcy5tb3ZlU3BlZWQsXHJcblx0XHRcdGF0dGFja1NwZWVkOiB0aGlzLmF0dGFja1NwZWVkLFxyXG5cdFx0XHRhdHRhY2tUaW1lcjogdGhpcy5hdHRhY2tUaW1lcixcclxuXHRcdFx0aW52ZW50b3J5OiB0aGlzLmdldEludmVudG9yeVBhY2soKVxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdGdldERCUGFjaygpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdG5hbWU6IHRoaXMubmFtZSxcclxuXHRcdFx0YWNjb3VudDogdGhpcy5hY2NvdW50SWQsXHJcblx0XHRcdHRlbXBsYXRlOiB0aGlzLnRlbXBsYXRlSWQsXHJcblx0XHRcdGxldmVsOiB0aGlzLmxldmVsLFxyXG5cdFx0XHRleHBlcmllbmNlOiB0aGlzLmV4cGVyaWVuY2UsXHJcblx0XHRcdG1hcElkOiB0aGlzLm1hcElkLFxyXG5cdFx0XHR4OiB0aGlzLngsXHJcblx0XHRcdHk6IHRoaXMueSxcclxuXHRcdFx0ZGlyZWN0aW9uOiB0aGlzLmRpcmVjdGlvbixcclxuXHRcdFx0YWRtaW5BY2Nlc3M6IHRoaXMuYWRtaW5BY2Nlc3MsXHJcblx0XHRcdHNwcml0ZTogdGhpcy5zcHJpdGVcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGlucHV0RGF0YShkYXRhKSB7XHJcblx0XHRpZiAodGhpcy5pc0RlYWQpIHtcclxuXHRcdFx0Z2FtZS5zZW5kR2FtZUluZm9QbGF5ZXIodGhpcy5nYW1lSWQsIFwiWW91IGFyZSBkZWFkLlwiKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChnYW1lLmdvZENvbW1hbmRzW2RhdGEuaW5wdXRdKSB7XHJcblx0XHRcdGlmICh0aGlzLmFkbWluQWNjZXNzID4gMCkgZ2FtZS5nb2RDb21tYW5kc1tkYXRhLmlucHV0XShkYXRhLCB0aGlzKTtcclxuXHRcdFx0ZWxzZSBnYW1lLnNlbmRHYW1lSW5mb1BsYXllcih0aGlzLmdhbWVJZCwgXCJZb3UgZG9uJ3QgaGF2ZSBhY2Nlc3MgdG8gdGhhdCBjb21tYW5kLlwiKTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRpZiAoZ2FtZS5jb21tYW5kc1tkYXRhLmlucHV0XSkgZ2FtZS5jb21tYW5kc1tkYXRhLmlucHV0XShkYXRhLCB0aGlzKTtcclxuXHRcdFx0ZWxzZSBnYW1lLnNlbmRHYW1lSW5mb1BsYXllcih0aGlzLmdhbWVJZCwgXCJJbnZhbGlkIGNvbW1hbmQuXCIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cGlja1VwKCkge1xyXG5cdFx0aWYgKHN1cGVyLnBpY2tVcCgpID09PSBmYWxzZSkgZ2FtZS5zZW5kR2FtZUluZm9QbGF5ZXIodGhpcy5nYW1lSWQsIFwiWW91ciBpbnZlbnRvcnkgaXMgZnVsbC5cIik7XHJcblx0fVxyXG5cdFxyXG5cdGdldEludmVudG9yeSgpIHtcclxuXHRcdGNvbnN0IGludmVudG9yeSA9IGdhbWUuaXRlbXMuZmlsdGVyKGl0ZW0gPT4ge1xyXG5cdFx0XHRyZXR1cm4gXCJcIitpdGVtLnBsYXllcklkID09PSBcIlwiK3RoaXMucGxheWVySWQ7XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBpbnZlbnRvcnk7XHJcblx0fVxyXG5cclxuXHRzZXREZWFkKCkge1xyXG5cdFx0c3VwZXIuc2V0RGVhZCgpO1xyXG5cdFx0dGhpcy5pc0RlYWQgPSB0cnVlO1xyXG5cdFx0dGhpcy5oZWFsdGggPSAwO1xyXG5cdFx0dGhpcy5lbmVyZ3kgPSAwO1xyXG5cdFx0dGhpcy5kZWF0aHMrKztcclxuXHR9XHJcblxyXG5cdHJlc3Bhd24oKSB7XHJcblx0XHR0aGlzLm1hcElkID0gdGhpcy5yZXNwYXduTWFwO1xyXG5cdFx0dGhpcy54ID0gdGhpcy5yZXNwYXduWDtcclxuXHRcdHRoaXMueSA9IHRoaXMucmVzcGF3blk7XHJcblx0XHR0aGlzLnN0YXJ0WCA9IHRoaXMucmVzcGF3blg7XHJcblx0XHR0aGlzLnN0YXJ0WSA9IHRoaXMucmVzcGF3blk7XHJcblx0XHR0aGlzLmRlc3RpbmF0aW9uWCA9IHRoaXMucmVzcGF3blg7XHJcblx0XHR0aGlzLmRlc3RpbmF0aW9uWSA9IHRoaXMucmVzcGF3blk7XHJcblx0XHRcclxuXHRcdHRoaXMuY2FsY0JvbnVzU3RhdHMoKTtcclxuXHRcdHRoaXMucmVzdG9yZSgpO1xyXG5cdFx0XHJcblx0XHR0aGlzLmlzV2Fsa2luZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy5pc1J1bm5pbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMuaXNBdHRhY2tpbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMuaXNEZWFkID0gZmFsc2U7XHJcblx0XHR0aGlzLnJlc3Bhd25UaW1lciA9IDA7XHJcblx0XHRnYW1lLnNlbmRHYW1lSW5mb1BsYXllcih0aGlzLmdhbWVJZCwgXCJUaGUgQW5nZWwgb2YgTWVyY3kgcmVmdXNlcyB0byBsZXQgeW91IGRpZS5cIik7XHJcblx0fVxyXG5cclxuXHRnYWluRXhwZXJpZW5jZShleHBlcmllbmNlKSB7XHJcblx0XHRpZiAodGhpcy5leHBlcmllbmNlICsgZXhwZXJpZW5jZSA8PSAwKSB7XHJcblx0XHRcdHRoaXMuZXhwZXJpZW5jZSA9IDA7XHRcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuZXhwZXJpZW5jZSArPSBleHBlcmllbmNlO1xyXG5cdFx0aWYgKHRoaXMuZXhwZXJpZW5jZSA+PSBnYW1lLmV4cGVyaWVuY2VUb0xldmVsW3RoaXMubGV2ZWxdKSB7XHJcblx0XHRcdHRoaXMubGV2ZWxVcCgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0bGV2ZWxVcCgpIHtcclxuXHRcdGlmICh0aGlzLmxldmVsIDwgY29uZmlnLk1BWF9MRVZFTCkge1xyXG5cdFx0XHRjb25zdCByb2xsb3ZlckV4cGVyaWVuY2UgPSB0aGlzLmV4cGVyaWVuY2UgLSBnYW1lLmV4cGVyaWVuY2VUb0xldmVsW3RoaXMubGV2ZWxdO1xyXG5cdFx0XHR0aGlzLmV4cGVyaWVuY2UgPSAwO1xyXG5cdFx0XHR0aGlzLmxldmVsKys7XHJcblx0XHRcdHRoaXMuY2FsY0Jhc2VTdGF0cygpO1xyXG5cdFx0XHRnYW1lLnNlbmRHYW1lSW5mb1BsYXllcih0aGlzLmdhbWVJZCwgYExldmVsIHVwISBZb3UgYXJlIG5vdyBsZXZlbCAke3RoaXMubGV2ZWx9IWApO1xyXG5cdFx0XHR0aGlzLmdhaW5FeHBlcmllbmNlKHJvbGxvdmVyRXhwZXJpZW5jZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGNhbGNCYXNlU3RhdHModGVtcGxhdGUpIHtcclxuXHRcdGlmICghdGVtcGxhdGUpIHRlbXBsYXRlID0gZ2FtZS5wbGF5ZXJUZW1wbGF0ZXNbdGhpcy50ZW1wbGF0ZUlkXTtcclxuXHRcdHN1cGVyLmNhbGNCYXNlU3RhdHModGVtcGxhdGUpO1xyXG5cdH1cclxufVxyXG4iLCJpbXBvcnQgZ2FtZSBmcm9tICcuLi9nYW1lLmpzJztcclxuaW1wb3J0IHV0aWwgZnJvbSAnLi4vdXRpbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXh0IHtcclxuXHRjb25zdHJ1Y3RvcihtYXBJZCwgeCwgeSwgbWVzc2FnZSwgY29sb3VyID0gJyMwMDAwMDAnLCBkaXNwbGF5VGltZSA9IDIsIHZlbFggPSAwLCB2ZWxZID0gMCkge1xyXG5cdFx0dGhpcy5tYXBJZCA9IG1hcElkO1xyXG5cdFx0dGhpcy54ID0geDtcclxuXHRcdHRoaXMueSA9IHk7XHJcblx0XHR0aGlzLnZlbFggPSB2ZWxYO1xyXG5cdFx0dGhpcy52ZWxZID0gdmVsWTtcclxuXHRcdHRoaXMubGVycFggPSAwO1xyXG5cdFx0dGhpcy5sZXJwWSA9IDA7XHJcblxyXG5cdFx0dGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcclxuXHRcdHRoaXMuY29sb3VyID0gY29sb3VyO1xyXG5cdFx0dGhpcy5kaXNwbGF5VGltZSA9IGRpc3BsYXlUaW1lO1xyXG5cdFx0dGhpcy50aW1lciA9IDA7XHJcblxyXG5cdFx0dGhpcy5nYW1lSWQgPSB1dGlsLmZpcnN0RW1wdHlJbmRleChnYW1lLnRleHRzKTtcclxuXHRcdGdhbWUudGV4dHNbdGhpcy5nYW1lSWRdID0gdGhpcztcclxuXHR9XHJcblx0XHJcblx0dXBkYXRlKGRlbHRhKSB7XHJcblx0XHR0aGlzLnRpbWVyICs9IGRlbHRhO1xyXG5cdFx0aWYgKHRoaXMuZGlzcGxheVRpbWUgPiAwICYmIHRoaXMudGltZXIgPiB0aGlzLmRpc3BsYXlUaW1lKSB7XHJcblx0XHRcdHRoaXMucmVtb3ZlKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5sZXJwWCArPSBkZWx0YSAqIHRoaXMudmVsWDtcclxuXHRcdHRoaXMubGVycFkgKz0gZGVsdGEgKiB0aGlzLnZlbFk7XHJcblxyXG5cdFx0aWYgKHRoaXMubGVycFggPCAtMSkge1xyXG5cdFx0XHR0aGlzLmxlcnBYKys7XHJcblx0XHRcdHRoaXMueC0tO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAodGhpcy5sZXJwWCA+IDEpIHtcclxuXHRcdFx0dGhpcy5sZXJwWC0tO1xyXG5cdFx0XHR0aGlzLngrKztcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5sZXJwWSA8IC0xKSB7XHJcblx0XHRcdHRoaXMubGVycFkrKztcclxuXHRcdFx0dGhpcy55LS07XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmICh0aGlzLmxlcnBZID4gMSkge1xyXG5cdFx0XHR0aGlzLmxlcnBZLS07XHJcblx0XHRcdHRoaXMueSsrO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gdGhpcy5nZXRQYWNrKCk7XHJcblx0fVxyXG5cdFxyXG5cdGdldFBhY2soKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRnYW1lSWQ6IHRoaXMuZ2FtZUlkLFxyXG5cdFx0XHRtYXBJZDogdGhpcy5tYXBJZCxcclxuXHRcdFx0eDogdGhpcy54LFxyXG5cdFx0XHR5OiB0aGlzLnksXHJcblx0XHRcdGxlcnBYOiB0aGlzLmxlcnBYLFxyXG5cdFx0XHRsZXJwWTogdGhpcy5sZXJwWSxcclxuXHRcdFx0bWVzc2FnZTogdGhpcy5tZXNzYWdlLFxyXG5cdFx0XHRjb2xvdXI6IHRoaXMuY29sb3VyXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0cmVtb3ZlKCkge1xyXG5cdFx0ZGVsZXRlIGdhbWUudGV4dHNbdGhpcy5nYW1lSWRdO1xyXG5cdH1cclxufVxyXG4iLCJjb25zdCBjb25maWcgPSB7fTtcclxuXHJcbmNvbmZpZy5QT1JUID0gMjAwMDtcclxuY29uZmlnLkZSQU1FUkFURSA9IDEwMDAgLyA2MDtcclxuY29uZmlnLkJBQ0tVUF9USU1FID0gMTIwO1xyXG5cclxuY29uZmlnLk1BUF9MQVlFUlMgPSA2O1xyXG5jb25maWcuTUFQX0NPTFVNTlMgPSAxMjtcclxuY29uZmlnLk1BUF9ST1dTID0gMTI7XHJcblxyXG5jb25maWcuTUFYX01BUFMgPSAxMDtcclxuY29uZmlnLk1BWF9VU0VSUyA9IDEwMDtcclxuY29uZmlnLk1BWF9TUFJJVEVTID0gMTM7XHJcbmNvbmZpZy5NQVhfRUZGRUNUUyA9IDcxO1xyXG5jb25maWcuTUFYX0xFVkVMID0gMzA7XHJcblxyXG5jb25maWcuTUFYX0hFQUxUSF9CQVNFID0gMjAwO1xyXG5jb25maWcuTUFYX0hFQUxUSF9CT05VUyA9IDU1O1xyXG5jb25maWcuTUFYX0VORVJHWV9CQVNFID0gMjAwO1xyXG5jb25maWcuTUFYX0VORVJHWV9CT05VUyA9IDU1O1xyXG5cclxuY29uZmlnLklOVkVOVE9SWV9TSVpFID0gMjA7XHJcbmNvbmZpZy5FUVVJUE1FTlRfU0laRSA9IDU7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjb25maWc7XHJcbiIsImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XHJcbmltcG9ydCBiY3J5cHQgZnJvbSAnYmNyeXB0JztcclxuaW1wb3J0IGZzIGZyb20gJ2ZzJztcclxuXHJcbmltcG9ydCB1dGlsIGZyb20gXCIuL3V0aWwuanNcIjtcclxuaW1wb3J0IEFjY291bnQgZnJvbSAnLi9tb2RlbHMvYWNjb3VudC5qcyc7XHJcbmltcG9ydCBQbGF5ZXIgZnJvbSAnLi9tb2RlbHMvcGxheWVyLmpzJztcclxuaW1wb3J0IFBsYXllclRlbXBsYXRlIGZyb20gJy4vbW9kZWxzL3BsYXllclRlbXBsYXRlLmpzJztcclxuaW1wb3J0IEJvdCBmcm9tICcuL21vZGVscy9ib3QuanMnO1xyXG5pbXBvcnQgQm90VGVtcGxhdGUgZnJvbSAnLi9tb2RlbHMvYm90VGVtcGxhdGUuanMnO1xyXG5pbXBvcnQgSXRlbSBmcm9tICcuL21vZGVscy9pdGVtLmpzJztcclxuaW1wb3J0IEl0ZW1UZW1wbGF0ZSBmcm9tICcuL21vZGVscy9pdGVtVGVtcGxhdGUuanMnO1xyXG5pbXBvcnQgSXRlbVR5cGUgZnJvbSAnLi9tb2RlbHMvaXRlbVR5cGUuanMnO1xyXG5pbXBvcnQgTWFwIGZyb20gJy4vbW9kZWxzL21hcC5qcyc7XHJcblxyXG5jb25zdCBmc3AgPSBmcy5wcm9taXNlcztcclxubW9uZ29vc2UuUHJvbWlzZSA9IFByb21pc2U7XHJcbm1vbmdvb3NlLmNvbm5lY3QoJ21vbmdvZGI6Ly9sb2NhbGhvc3Qvb2R5c3NleScsIHt1c2VOZXdVcmxQYXJzZXI6IHRydWV9KTtcclxuXHJcbmNsYXNzIERhdGFiYXNlIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHRoaXMuc2VydmVyTG9nID0gW107XHJcblx0fVxyXG5cclxuXHRhc3luYyBiYWNrdXAoZGF0YSA9IHt9KSB7XHJcblx0XHQvL1RPRE8gc2F2ZSBldmVyeXRoaW5nXHJcblx0XHQvLyBjb25zdCBtYXBzID0gc2F2ZS1hbGwtbWFwc1xyXG5cdFx0bGV0IHBsYXllcnMgPSB0aGlzLnNhdmVPbmxpbmVQbGF5ZXJzKGRhdGEucGxheWVycyk7XHJcblx0XHRjb25zdCBib3RzID0gdGhpcy5zYXZlQWxsQm90cyhkYXRhLmJvdHMpO1xyXG5cdFx0bGV0IGl0ZW1zID0gdGhpcy5zYXZlQWxsSXRlbXMoZGF0YS5pdGVtcyk7XHJcblx0XHRsZXQgbG9nU2F2ZWQgPSB0aGlzLnNhdmVMb2coKTtcclxuXHRcdFByb21pc2UuYWxsKFtwbGF5ZXJzLCBib3RzLCBpdGVtcywgbG9nU2F2ZWRdKVxyXG5cdFx0LnRoZW4oKCkgPT4gdGhpcy5sb2coXCJHYW1lIHNhdmVkIHRvIGRpc2suXCIpKTtcclxuXHR9XHJcblx0XHJcblx0bG9nKG1lc3NhZ2UpIHtcclxuXHRcdGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG5cdFx0Y29uc29sZS5sb2codXRpbC50aW1lc3RhbXAoZGF0ZSkgKyBcIiAtIFwiICsgbWVzc2FnZSk7XHJcblx0XHR0aGlzLnNlcnZlckxvZy5wdXNoKHtcclxuXHRcdFx0bWVzc2FnZSxcclxuXHRcdFx0ZGF0ZVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cdGFzeW5jIHNhdmVMb2coKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRjb25zdCBzYXZlZExvZyA9IGF3YWl0IGZzcC5yZWFkRmlsZSgnLi9zZXJ2ZXIvbG9nLmpzb24nKTtcclxuXHRcdFx0Y29uc3QgbmV3TG9nID0gSlNPTi5wYXJzZShzYXZlZExvZykuY29uY2F0KHRoaXMuc2VydmVyTG9nKTtcclxuXHRcdFx0dGhpcy5zZXJ2ZXJMb2cgPSBbXTtcclxuXHRcdFx0YXdhaXQgZnNwLndyaXRlRmlsZSgnLi9zZXJ2ZXIvbG9nLmpzb24nLCBKU09OLnN0cmluZ2lmeShuZXdMb2cpKTtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRjYXRjaChlcnIpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRhc3luYyBjbGVhckxvZygpIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHRoaXMuc2VydmVyTG9nID0gW107XHJcblx0XHRcdGF3YWl0IGZzcC53cml0ZUZpbGUoJy4vc2VydmVyL2xvZy5qc29uJywgXCJbXVwiKTtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRjYXRjaCAoZXJyKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGdlbmVyYXRlSWQoKSB7XHJcblx0XHRyZXR1cm4gbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkO1xyXG5cdH1cclxuXHRhc3luYyBoYXNoUGFzc3dvcmQocGFzc3dvcmQpIHtcclxuXHRcdHJldHVybiBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblx0XHRcdGJjcnlwdC5oYXNoKHBhc3N3b3JkLCAxMCwgKGVyciwgaGFzaCkgPT4ge1xyXG5cdFx0XHRcdGlmIChlcnIpIHJlamVjdChlcnIpO1xyXG5cdFx0XHRcdGVsc2UgcmVzb2x2ZShoYXNoKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0YXN5bmMgY29tcGFyZVBhc3N3b3JkKHBhc3N3b3JkLCBoYXNoZWRQYXNzd29yZCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0YmNyeXB0LmNvbXBhcmUocGFzc3dvcmQsIGhhc2hlZFBhc3N3b3JkLCAoZXJyLCBtYXRjaCkgPT4ge1xyXG5cdFx0XHRcdGlmIChlcnIpIHJlamVjdChlcnIpO1xyXG5cdFx0XHRcdGVsc2UgcmVzb2x2ZShtYXRjaCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdGFzeW5jIGF1dGhBY2NvdW50KHVzZXJuYW1lLCBwYXNzd29yZCkge1xyXG5cdFx0bGV0IGFjY291bnQgPSBhd2FpdCBBY2NvdW50LmZpbmRPbmUoe3VzZXJuYW1lOiB1c2VybmFtZX0pLmV4ZWMoKTtcclxuXHRcdGlmICghYWNjb3VudCkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gdGhpcy5jb21wYXJlUGFzc3dvcmQocGFzc3dvcmQsIGFjY291bnQucGFzc3dvcmQpO1xyXG5cdH1cclxuXHJcblx0YXN5bmMgYWRkQWNjb3VudCh1c2VybmFtZSwgcGFzc3dvcmQsIGVtYWlsKSB7XHJcblx0XHRsZXQgYWRtaW4gPSBmYWxzZTtcclxuXHRcdGxldCBhY2NvdW50cyA9IGF3YWl0IHRoaXMuZ2V0QWxsQWNjb3VudHMoKTtcclxuXHRcdGlmIChhY2NvdW50cy5sZW5ndGggPT09IDApIHtcclxuXHRcdFx0YWRtaW4gPSB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGxldCBleGlzdGluZ0FjY291bnQgPSBhY2NvdW50cy5maW5kKGFjY291bnQgPT4gYWNjb3VudC51c2VybmFtZSA9PT0gdXNlcm5hbWUpXHJcblx0XHRcdGlmIChleGlzdGluZ0FjY291bnQpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhgQWNjb3VudCBhbHJlYWR5IGV4aXN0cyB3aXRoIHVzZXJuYW1lICR7dXNlcm5hbWV9LmApO1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IGhhc2hlZFBhc3N3b3JkID0gYXdhaXQgdGhpcy5oYXNoUGFzc3dvcmQocGFzc3dvcmQpO1xyXG5cdFx0YWNjb3VudCA9IG5ldyBBY2NvdW50KHtcclxuXHRcdFx0X2lkOiBuZXcgbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQsXHJcblx0XHRcdHVzZXJuYW1lLFxyXG5cdFx0XHRwYXNzd29yZDogaGFzaGVkUGFzc3dvcmQsXHJcblx0XHRcdGVtYWlsLFxyXG5cdFx0XHR2ZXJpZmllZDogZmFsc2UsXHJcblx0XHRcdGFkbWluXHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gYXdhaXQgYWNjb3VudC5zYXZlKClcclxuXHRcdC50aGVuKHJlc3VsdCA9PiBhY2NvdW50Ll9pZClcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIGdldEFjY291bnQoYWNjb3VudElkKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgQWNjb3VudC5maW5kQnlJZChhY2NvdW50SWQpXHJcblx0XHQuc2VsZWN0KCdfaWQgdXNlcm5hbWUgcGFzc3dvcmQgZW1haWwgdmVyaWZpZWQnKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4oYWNjb3VudCA9PiBhY2NvdW50KVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgZ2V0QWNjb3VudEJ5VXNlcm5hbWUodXNlcm5hbWUpIHtcclxuXHRcdHJldHVybiBhd2FpdCBBY2NvdW50LmZpbmRPbmUoe3VzZXJuYW1lOiB1c2VybmFtZX0pXHJcblx0XHQuc2VsZWN0KCdfaWQgdXNlcm5hbWUgcGFzc3dvcmQgZW1haWwgdmVyaWZpZWQnKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4oYWNjb3VudCA9PiBhY2NvdW50KVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgZ2V0QWNjb3VudElkKHVzZXJuYW1lKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgQWNjb3VudC5maW5kT25lKHt1c2VybmFtZTogdXNlcm5hbWV9KVxyXG5cdFx0LnNlbGVjdCgnX2lkJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKGFjY291bnQgPT4ge1xyXG5cdFx0XHRpZiAoYWNjb3VudCkge1xyXG5cdFx0XHRcdHJldHVybiBhY2NvdW50Ll9pZDtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIGdldEFsbEFjY291bnRzKCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IEFjY291bnQuZmluZCh7fSlcclxuXHRcdC5zZWxlY3QoJ19pZCB1c2VybmFtZSBwYXNzd29yZCBlbWFpbCB2ZXJpZmllZCBhZG1pbicpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbihhY2NvdW50cyA9PiBhY2NvdW50cylcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIHNhdmVBY2NvdW50KGRhdGEpIHtcclxuXHRcdHJldHVybiBhd2FpdCBBY2NvdW50LnVwZGF0ZU9uZSh7dXNlcm5hbWU6IGRhdGEudXNlcm5hbWV9LCB7JHNldDogZGF0YX0pXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbihyZXN1bHQgPT4gdHJ1ZSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cclxuXHRhc3luYyBhZGRQbGF5ZXIoYWNjb3VudElkLCBuYW1lLCB0ZW1wbGF0ZUlkKSB7XHJcblx0XHRsZXQgYWNjb3VudCA9IGF3YWl0IHRoaXMuZ2V0QWNjb3VudChhY2NvdW50SWQpO1xyXG5cdFx0aWYgKCFhY2NvdW50KSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiQWNjb3VudCBkb2VzIG5vdCBleGlzdCB3aXRoIHRoYXQgaWQuXCIpO1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHRcdGxldCB0ZW1wbGF0ZSA9IGF3YWl0IHRoaXMuZ2V0UGxheWVyVGVtcGxhdGUodGVtcGxhdGVJZCk7XHJcblx0XHRpZiAoIXRlbXBsYXRlKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiUGxheWVyIFRlbXBsYXRlIGRvZXMgbm90IGV4aXN0IHdpdGggdGhhdCBpZC5cIik7XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fVxyXG5cdFx0bGV0IHBsYXllciA9IGF3YWl0IHRoaXMuZ2V0UGxheWVyQnlOYW1lKG5hbWUpO1xyXG5cdFx0aWYgKHBsYXllcikge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIlBsYXllciBhbHJlYWR5IGV4aXN0cyB3aXRoIHRoYXQgbmFtZS5cIik7XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fVxyXG5cclxuXHRcdHBsYXllciA9IG5ldyBQbGF5ZXIoe1xyXG5cdFx0XHRfaWQgOiBuZXcgbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQsXHJcblx0XHRcdG5hbWUsXHJcblx0XHRcdGFjY291bnQ6IGFjY291bnRJZCxcclxuXHRcdFx0dGVtcGxhdGU6IHRlbXBsYXRlSWRcclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBhd2FpdCBwbGF5ZXIuc2F2ZSgpXHJcblx0XHQudGhlbihyZXN1bHQgPT4gcGxheWVyLl9pZClcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIGdldFBsYXllcihwbGF5ZXJJZCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IFBsYXllci5maW5kQnlJZChwbGF5ZXJJZClcclxuXHRcdC5zZWxlY3QoJ19pZCBhY2NvdW50IG5hbWUgdGVtcGxhdGUgbGV2ZWwgZXhwZXJpZW5jZSBtYXBJZCB4IHkgZGlyZWN0aW9uIGFkbWluQWNjZXNzIHNwcml0ZScpXHJcblx0XHQucG9wdWxhdGUoJ3RlbXBsYXRlJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHBsYXllciA9PiBwbGF5ZXIpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBnZXRQbGF5ZXJCeU5hbWUobmFtZSkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IFBsYXllci5maW5kT25lKHtuYW1lOiBuYW1lfSlcclxuXHRcdC5zZWxlY3QoJ19pZCBhY2NvdW50IG5hbWUgdGVtcGxhdGUgbGV2ZWwgZXhwZXJpZW5jZSBtYXBJZCB4IHkgZGlyZWN0aW9uIGFkbWluQWNjZXNzIHNwcml0ZScpXHJcblx0XHQucG9wdWxhdGUoJ3RlbXBsYXRlJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHBsYXllciA9PiBwbGF5ZXIpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBnZXRQbGF5ZXJzQnlBY2NvdW50KGFjY291bnRJZCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IFBsYXllci5maW5kKHthY2NvdW50OiBhY2NvdW50SWR9KVxyXG5cdFx0LnNlbGVjdCgnX2lkIGFjY291bnQgbmFtZSB0ZW1wbGF0ZSBsZXZlbCBleHBlcmllbmNlIG1hcElkIHggeSBkaXJlY3Rpb24gYWRtaW5BY2Nlc3Mgc3ByaXRlJylcclxuXHRcdC5wb3B1bGF0ZSgndGVtcGxhdGUnKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4ocGxheWVycyA9PiBwbGF5ZXJzKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgc2F2ZVBsYXllcihkYXRhKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgUGxheWVyLnVwZGF0ZU9uZSh7bmFtZTogZGF0YS5uYW1lfSwgeyRzZXQ6IGRhdGF9KVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4ocmVzdWx0ID0+IHRydWUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRzYXZlT25saW5lUGxheWVycyhwbGF5ZXJzID0gW10pIHtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcGxheWVycy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRjb25zdCBwbGF5ZXIgPSBwbGF5ZXJzW2ldO1xyXG5cdFx0XHRpZiAoIXBsYXllcikgY29udGludWU7XHJcblx0XHRcdHRoaXMuc2F2ZVBsYXllcihwbGF5ZXIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0YXN5bmMgYWRkQm90KGRhdGEpIHtcclxuXHRcdGxldCB0ZW1wbGF0ZSA9IGF3YWl0IHRoaXMuZ2V0Qm90VGVtcGxhdGUoZGF0YS50ZW1wbGF0ZUlkKTtcclxuXHRcdGlmICghdGVtcGxhdGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJCb3QgVGVtcGxhdGUgZG9lcyBub3QgZXhpc3Qgd2l0aCB0aGF0IGlkLlwiKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBfaWQgPSBkYXRhLmJvdElkO1xyXG5cdFx0aWYgKCFfaWQpIF9pZCA9IG5ldyBtb25nb29zZS5UeXBlcy5PYmplY3RJZDtcclxuXHJcblx0XHRjb25zdCBib3QgPSBuZXcgQm90KHtcclxuXHRcdFx0X2lkLFxyXG5cdFx0XHR0ZW1wbGF0ZTogZGF0YS50ZW1wbGF0ZUlkLFxyXG5cdFx0XHRtYXBJZDogZGF0YS5tYXBJZCxcclxuXHRcdFx0eDogZGF0YS54LFxyXG5cdFx0XHR5OiBkYXRhLnksXHJcblx0XHRcdGRpcmVjdGlvbjogZGF0YS5kaXJlY3Rpb25cclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBhd2FpdCBib3Quc2F2ZSgpXHJcblx0XHQudGhlbihyZXN1bHQgPT4gdHJ1ZSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIGdldEJvdChib3RJZCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IEJvdC5maW5kT25lKHtfaWQ6IGJvdElkfSlcclxuXHRcdC5zZWxlY3QoJ19pZCBuYW1lIHNwcml0ZSB0ZW1wbGF0ZSBsZXZlbCBleHBlcmllbmNlIG1hcElkIHggeSBkaXJlY3Rpb24nKVxyXG5cdFx0LnBvcHVsYXRlKCd0ZW1wbGF0ZScpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbihib3QgPT4gYm90KVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgc2F2ZUJvdChkYXRhKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgQm90LnVwZGF0ZU9uZSh7X2lkOiBkYXRhLmJvdElkfSwgeyRzZXQ6IGRhdGF9KVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4ocmVzdWx0ID0+IHRydWUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBnZXRBbGxCb3RzKCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IEJvdC5maW5kKHt9KVxyXG5cdFx0LnNlbGVjdCgnX2lkIHRlbXBsYXRlIG1hcElkIHggeSBkaXJlY3Rpb24nKVxyXG5cdFx0LnBvcHVsYXRlKCd0ZW1wbGF0ZScpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbihib3RzID0+IGJvdHMpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBzYXZlQWxsQm90cyhjdXJyZW50Qm90cykge1xyXG5cdFx0aWYgKCFjdXJyZW50Qm90cykgcmV0dXJuO1xyXG5cclxuXHRcdGxldCBzYXZlZEJvdHMgPSBhd2FpdCB0aGlzLmdldEFsbEJvdHMoKTtcclxuXHRcdGNvbnN0IG5ld0JvdHMgPSBjdXJyZW50Qm90cy5maWx0ZXIoYm90ID0+ICFzYXZlZEJvdHMuZmluZChzYXZlZEJvdCA9PiBzYXZlZEJvdC5faWQgPT09IGJvdC5ib3RJZCkpO1xyXG5cdFx0Y29uc3QgZXhpc3RpbmdCb3RzID0gY3VycmVudEJvdHMuZmlsdGVyKGJvdCA9PiBzYXZlZEJvdHMuZmluZChzYXZlZEJvdCA9PiBzYXZlZEJvdC5faWQgPT09IGJvdC5ib3RJZCkpO1xyXG5cdFx0Y29uc3QgZGVsZXRlQm90cyA9IHNhdmVkQm90cy5maWx0ZXIoYm90ID0+ICFleGlzdGluZ0JvdHMuZmluZChleGlzdGluZ0JvdCA9PiBleGlzdGluZ0JvdC5ib3RJZCA9PT0gYm90Ll9pZCkpO1xyXG5cdFx0Y29uc3QgdXBkYXRlQm90cyA9IGV4aXN0aW5nQm90cy5maWx0ZXIoYm90ID0+ICFkZWxldGVCb3RzLmluY2x1ZGVzKGJvdCkpO1xyXG5cclxuXHRcdC8vIEFkZCBuZXcgQm90c1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBuZXdCb3RzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHRoaXMuYWRkQm90KG5ld0JvdHNbaV0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIERlbGV0ZSByZW1vdmVkIEJvdHNcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgZGVsZXRlQm90cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRCb3QuZGVsZXRlT25lKHtfaWQ6IGRlbGV0ZUJvdHNbaV0uX2lkfSwgZXJyID0+IHtcclxuXHRcdFx0XHRpZiAoZXJyKSBjb25zb2xlLmxvZyhlcnIpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBVcGRhdGUgdGhlIHJlc3RcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdXBkYXRlQm90cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRjb25zdCBib3QgPSB1cGRhdGVCb3RzW2ldO1xyXG5cdFx0XHRpZiAoIWJvdCkgY29udGludWU7XHJcblx0XHRcdHRoaXMuc2F2ZUJvdChib3QpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0YXN5bmMgZ2V0TWFwKG1hcElkKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgTWFwLmZpbmRPbmUoe21hcElkOiBtYXBJZH0pXHJcblx0XHQuc2VsZWN0KCdtYXBJZCBuYW1lIGRyb3BDaGFuY2UgZHJvcEFtb3VudEVRIHRpbGVzIGlzV2FsbCBpc0hvc3RpbGUgZGFtYWdlIHdhcnBNYXAgd2FycFggd2FycFknKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4obWFwID0+IG1hcClcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIHNhdmVNYXAoZGF0YSkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IE1hcC51cGRhdGVPbmUoe21hcElkOiBkYXRhLm1hcElkfSwgeyRzZXQ6IGRhdGF9LCB7dXBzZXJ0OiB0cnVlfSlcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHJlc3VsdCA9PiB0cnVlKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgZ2V0QWxsTWFwcygpIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHJldHVybiBhd2FpdCBNYXAuZmluZCh7fSlcclxuXHRcdFx0LnNlbGVjdCgnbWFwSWQgbmFtZSBkcm9wQ2hhbmNlIGRyb3BBbW91bnRFUSB0aWxlcyBpc1dhbGwgaXNIb3N0aWxlIGRhbWFnZSB3YXJwTWFwIHdhcnBYIHdhcnBZJylcclxuXHRcdFx0LmV4ZWMoKVxyXG5cdFx0XHQudGhlbihtYXBzID0+IG1hcHMpXHJcblx0XHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0XHR9XHJcblx0XHRjYXRjaChlcnIpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGFzeW5jIGFkZFBsYXllclRlbXBsYXRlKGRhdGEpIHtcclxuXHRcdGlmICghZGF0YS5uYW1lKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiTmFtZSBpcyByZXF1aXJlZC5cIik7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgY2hlY2tUZW1wbGF0ZSA9IGF3YWl0IFBsYXllclRlbXBsYXRlLmZpbmRPbmUoe25hbWU6IGRhdGEubmFtZX0pXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbih0ZW1wbGF0ZSA9PiB0ZW1wbGF0ZSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblxyXG5cdFx0aWYgKGNoZWNrVGVtcGxhdGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJUZW1wbGF0ZSBhbHJlYWR5IGV4aXN0cyB3aXRoIHRoYXQgbmFtZS5cIik7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCB0ZW1wbGF0ZSA9IG5ldyBQbGF5ZXJUZW1wbGF0ZSh7XHJcblx0XHRcdF9pZDogbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkLFxyXG5cdFx0XHRuYW1lOiBkYXRhLm5hbWUsXHJcblx0XHRcdHNwcml0ZTogZGF0YS5zcHJpdGUsXHJcblx0XHRcdGRhbWFnZUJhc2U6IGRhdGEuZGFtYWdlQmFzZSxcclxuXHRcdFx0ZGVmZW5jZUJhc2U6IGRhdGEuZGVmZW5jZUJhc2UsXHJcblx0XHRcdGhlYWx0aE1heEJhc2U6IGRhdGEuaGVhbHRoTWF4QmFzZSxcclxuXHRcdFx0ZW5lcmd5TWF4QmFzZTogZGF0YS5lbmVyZ3lNYXhCYXNlLFxyXG5cdFx0XHRoZWFsdGhSZWdlbkJhc2U6IGRhdGEuaGVhbHRoUmVnZW5CYXNlLFxyXG5cdFx0XHRlbmVyZ3lSZWdlbkJhc2U6IGRhdGEuZW5lcmd5UmVnZW5CYXNlLFxyXG5cdFx0XHRyYW5nZUJhc2U6IGRhdGEucmFuZ2VCYXNlLFxyXG5cdFx0XHRoZWFsdGhQZXJMZXZlbDogZGF0YS5oZWFsdGhQZXJMZXZlbCxcclxuXHRcdFx0ZW5lcmd5UGVyTGV2ZWw6IGRhdGEuZW5lcmd5UGVyTGV2ZWxcclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBhd2FpdCB0ZW1wbGF0ZS5zYXZlKClcclxuXHRcdC50aGVuKHJlc3VsdCA9PiB0cnVlKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgZ2V0UGxheWVyVGVtcGxhdGUodGVtcGxhdGVJZCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IFBsYXllclRlbXBsYXRlLmZpbmRCeUlkKHRlbXBsYXRlSWQpXHJcblx0XHQuc2VsZWN0KCduYW1lIHNwcml0ZSBkYW1hZ2VCYXNlIGRlZmVuY2VCYXNlIGhlYWx0aE1heEJhc2UgZW5lcmd5TWF4QmFzZSBoZWFsdGhSZWdlbkJhc2UgZW5lcmd5UmVnZW5CYXNlIHJhbmdlQmFzZSBoZWFsdGhQZXJMZXZlbCwgZW5lcmd5UGVyTGV2ZWwnKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4odGVtcGxhdGUgPT4gdGVtcGxhdGUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBnZXRBbGxQbGF5ZXJUZW1wbGF0ZXMoKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgUGxheWVyVGVtcGxhdGUuZmluZCh7fSlcclxuXHRcdC5zZWxlY3QoJ19pZCBuYW1lIHNwcml0ZSBkYW1hZ2VCYXNlIGRlZmVuY2VCYXNlIGhlYWx0aE1heEJhc2UgZW5lcmd5TWF4QmFzZSBoZWFsdGhSZWdlbkJhc2UgZW5lcmd5UmVnZW5CYXNlIHJhbmdlQmFzZSBoZWFsdGhQZXJMZXZlbCwgZW5lcmd5UGVyTGV2ZWwnKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4odGVtcGxhdGVzID0+IHRlbXBsYXRlcylcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cclxuXHRhc3luYyBhZGRCb3RUZW1wbGF0ZShkYXRhKSB7XHJcblx0XHRjb25zdCB0ZW1wbGF0ZSA9IG5ldyBCb3RUZW1wbGF0ZSh7XHJcblx0XHRcdF9pZDogbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkLFxyXG5cdFx0XHRuYW1lOiBkYXRhLm5hbWUsXHJcblx0XHRcdHNwcml0ZTogZGF0YS5zcHJpdGUsXHJcblx0XHRcdGRhbWFnZUJhc2U6IGRhdGEuZGFtYWdlQmFzZSxcclxuXHRcdFx0ZGVmZW5jZUJhc2U6IGRhdGEuZGVmZW5jZUJhc2UsXHJcblx0XHRcdGhlYWx0aE1heEJhc2U6IGRhdGEuaGVhbHRoTWF4QmFzZSxcclxuXHRcdFx0ZW5lcmd5TWF4QmFzZTogZGF0YS5lbmVyZ3lNYXhCYXNlLFxyXG5cdFx0XHRoZWFsdGhSZWdlbkJhc2U6IGRhdGEuaGVhbHRoUmVnZW5CYXNlLFxyXG5cdFx0XHRlbmVyZ3lSZWdlbkJhc2U6IGRhdGEuZW5lcmd5UmVnZW5CYXNlLFxyXG5cdFx0XHRyYW5nZUJhc2U6IGRhdGEucmFuZ2VCYXNlLFxyXG5cdFx0XHRob3N0aWxlOiBkYXRhLmhvc3RpbGVcclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBhd2FpdCB0ZW1wbGF0ZS5zYXZlKClcclxuXHRcdC50aGVuKHJlc3VsdCA9PiB0cnVlKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgZ2V0Qm90VGVtcGxhdGUodGVtcGxhdGVJZCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IEJvdFRlbXBsYXRlLmZpbmRCeUlkKHRlbXBsYXRlSWQpXHJcblx0XHQuc2VsZWN0KCdfaWQgbmFtZSBzcHJpdGUgZGFtYWdlQmFzZSBkZWZlbmNlQmFzZSBoZWFsdGhNYXhCYXNlIGVuZXJneU1heEJhc2UgaGVhbHRoUmVnZW5CYXNlIGVuZXJneVJlZ2VuQmFzZSByYW5nZUJhc2UgaG9zdGlsZScpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbih0ZW1wbGF0ZSA9PiB0ZW1wbGF0ZSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIGdldEFsbEJvdFRlbXBsYXRlcygpIHtcclxuXHRcdHJldHVybiBhd2FpdCBCb3RUZW1wbGF0ZS5maW5kKHt9KVxyXG5cdFx0LnNlbGVjdCgnX2lkIG5hbWUgc3ByaXRlIGRhbWFnZUJhc2UgZGVmZW5jZUJhc2UgaGVhbHRoTWF4QmFzZSBlbmVyZ3lNYXhCYXNlIGhlYWx0aFJlZ2VuQmFzZSBlbmVyZ3lSZWdlbkJhc2UgcmFuZ2VCYXNlIGhvc3RpbGUnKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4odGVtcGxhdGVzID0+IHRlbXBsYXRlcylcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cclxuXHRhc3luYyBhZGRJdGVtVHlwZShkYXRhKSB7XHJcblx0XHRjb25zdCB0eXBlID0gbmV3IEl0ZW1UeXBlKHtcclxuXHRcdFx0X2lkOiBuZXcgbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQsXHJcblx0XHRcdG5hbWU6IGRhdGEubmFtZSxcclxuXHRcdFx0c3RhY2thYmxlOiBkYXRhLnN0YWNrYWJsZSxcclxuXHRcdFx0ZXF1aXBwZWRTbG90OiBkYXRhLmVxdWlwcGVkU2xvdFxyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIGF3YWl0IHR5cGUuc2F2ZSgpXHJcblx0XHQudGhlbihyZXN1bHQgPT4gdHJ1ZSlcclxuXHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cdGFzeW5jIGdldEl0ZW1UeXBlKHR5cGVJZCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IEl0ZW1UeXBlLmZpbmRCeUlkKHR5cGVJZClcclxuXHRcdC5zZWxlY3QoJ25hbWUgc3RhY2thYmxlIGVxdWlwcGVkU2xvdCcpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbih0eXBlID0+IHR5cGUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBnZXRBbGxJdGVtVHlwZXMoKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgSXRlbVR5cGUuZmluZCh7fSlcclxuXHRcdC5zZWxlY3QoJ19pZCBuYW1lIHN0YWNrYWJsZSBlcXVpcHBlZFNsb3QnKVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4odHlwZXMgPT4gdHlwZXMpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHJcblx0YXN5bmMgYWRkSXRlbVRlbXBsYXRlKGRhdGEpIHtcclxuXHRcdGNvbnN0IHRlbXBsYXRlID0gbmV3IEl0ZW1UZW1wbGF0ZSh7XHJcblx0XHRcdF9pZDogbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkLFxyXG5cdFx0XHRuYW1lOiBkYXRhLm5hbWUsXHJcblx0XHRcdHNwcml0ZTogZGF0YS5zcHJpdGUsXHJcblx0XHRcdHJldXNhYmxlOiBkYXRhLnJldXNhYmxlLFxyXG5cdFx0XHR0eXBlOiBkYXRhLnR5cGVJZCxcclxuXHRcdFx0cGFzc2l2ZURhbWFnZTogZGF0YS5wYXNzaXZlRGFtYWdlLFxyXG5cdFx0XHRwYXNzaXZlRGVmZW5jZTogZGF0YS5wYXNzaXZlRGVmZW5jZSxcclxuXHRcdFx0cGFzc2l2ZUhlYWx0aE1heDogZGF0YS5wYXNzaXZlSGVhbHRoTWF4LFxyXG5cdFx0XHRwYXNzaXZlRW5lcmd5TWF4OiBkYXRhLnBhc3NpdmVFbmVyZ3lNYXgsXHJcblx0XHRcdHBhc3NpdmVIZWFsdGhSZWdlbjogZGF0YS5wYXNzaXZlSGVhbHRoUmVnZW4sXHJcblx0XHRcdHBhc3NpdmVFbmVyZ3lSZWdlbjogZGF0YS5wYXNzaXZlRW5lcmd5UmVnZW4sXHJcblx0XHRcdHBhc3NpdmVSYW5nZTogZGF0YS5wYXNzaXZlUmFuZ2UsXHJcblx0XHRcdGVxdWlwcGVkRGFtYWdlOiBkYXRhLmVxdWlwcGVkRGFtYWdlLFxyXG5cdFx0XHRlcXVpcHBlZERlZmVuY2U6IGRhdGEuZXF1aXBwZWREZWZlbmNlLFxyXG5cdFx0XHRlcXVpcHBlZEhlYWx0aE1heDogZGF0YS5lcXVpcHBlZEhlYWx0aE1heCxcclxuXHRcdFx0ZXF1aXBwZWRFbmVyZ3lNYXg6IGRhdGEuZXF1aXBwZWRFbmVyZ3lNYXgsXHJcblx0XHRcdGVxdWlwcGVkSGVhbHRoUmVnZW46IGRhdGEuZXF1aXBwZWRIZWFsdGhSZWdlbixcclxuXHRcdFx0ZXF1aXBwZWRFbmVyZ3lSZWdlbjogZGF0YS5lcXVpcHBlZEVuZXJneVJlZ2VuLFxyXG5cdFx0XHRlcXVpcHBlZFJhbmdlOiBkYXRhLmVxdWlwcGVkUmFuZ2VcclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBhd2FpdCB0ZW1wbGF0ZS5zYXZlKClcclxuXHRcdC50aGVuKHJlc3VsdCA9PiB0cnVlKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgZ2V0SXRlbVRlbXBsYXRlKHRlbXBsYXRlSWQpIHtcclxuXHRcdHJldHVybiBhd2FpdCBJdGVtVGVtcGxhdGUuZmluZEJ5SWQodGVtcGxhdGVJZClcclxuXHRcdC5zZWxlY3QoJ25hbWUgc3ByaXRlIHJldXNhYmxlIHR5cGUgcGFzc2l2ZURhbWFnZSBwYXNzaXZlRGVmZW5jZSBwYXNzaXZlSGVhbHRoTWF4IHBhc3NpdmVFbmVyZ3lNYXhCYXNlIHBhc3NpdmVIZWFsdGhSZWdlbiBwYXNzaXZlRW5lcmd5UmVnZW4gcGFzc2l2ZVJhbmdlIGVxdWlwcGVkRGFtYWdlIGVxdWlwcGVkRGVmZW5jZSBlcXVpcHBlZEhlYWx0aE1heCBlcXVpcHBlZEVuZXJneU1heEJhc2UgZXF1aXBwZWRIZWFsdGhSZWdlbiBlcXVpcHBlZEVuZXJneVJlZ2VuIGVxdWlwcGVkUmFuZ2UnKVxyXG5cdFx0LnBvcHVsYXRlKCd0eXBlJylcclxuXHRcdC5leGVjKClcclxuXHRcdC50aGVuKHRlbXBsYXRlID0+IHRlbXBsYXRlKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblx0YXN5bmMgZ2V0QWxsSXRlbVRlbXBsYXRlcygpIHtcclxuXHRcdHJldHVybiBhd2FpdCBJdGVtVGVtcGxhdGUuZmluZCh7fSlcclxuXHRcdC5zZWxlY3QoJ19pZCBuYW1lIHNwcml0ZSByZXVzYWJsZSB0eXBlIHBhc3NpdmVEYW1hZ2UgcGFzc2l2ZURlZmVuY2UgcGFzc2l2ZUhlYWx0aE1heCBwYXNzaXZlRW5lcmd5TWF4QmFzZSBwYXNzaXZlSGVhbHRoUmVnZW4gcGFzc2l2ZUVuZXJneVJlZ2VuIHBhc3NpdmVSYW5nZSBlcXVpcHBlZERhbWFnZSBlcXVpcHBlZERlZmVuY2UgZXF1aXBwZWRIZWFsdGhNYXggZXF1aXBwZWRFbmVyZ3lNYXhCYXNlIGVxdWlwcGVkSGVhbHRoUmVnZW4gZXF1aXBwZWRFbmVyZ3lSZWdlbiBlcXVpcHBlZFJhbmdlJylcclxuXHRcdC5wb3B1bGF0ZSgndHlwZScpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbih0ZW1wbGF0ZXMgPT4gdGVtcGxhdGVzKVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblxyXG5cdGFzeW5jIGFkZEl0ZW0oZGF0YSkge1xyXG5cdFx0bGV0IHRlbXBsYXRlID0gYXdhaXQgdGhpcy5nZXRJdGVtVGVtcGxhdGUoZGF0YS50ZW1wbGF0ZUlkKTtcclxuXHRcdGlmICghdGVtcGxhdGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJJdGVtIFRlbXBsYXRlIGRvZXMgbm90IGV4aXN0IHdpdGggdGhhdCBpZC5cIik7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHRcdGxldCBfaWQgPSBkYXRhLml0ZW1JZDtcclxuXHRcdGlmICghX2lkKSBfaWQgPSBuZXcgbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQ7XHJcblxyXG5cdFx0Y29uc3QgaXRlbSA9IG5ldyBJdGVtKHtcclxuXHRcdFx0X2lkLFxyXG5cdFx0XHR0ZW1wbGF0ZTogZGF0YS50ZW1wbGF0ZUlkLFxyXG5cdFx0XHRzdGFjazogZGF0YS5zdGFjayxcclxuXHRcdFx0cGxheWVySWQ6IGRhdGEucGxheWVySWQsXHJcblx0XHRcdGJvdElkOiBkYXRhLmJvdElkLFxyXG5cdFx0XHRzbG90OiBkYXRhLnNsb3QsXHJcblx0XHRcdG1hcElkOiBkYXRhLm1hcElkLFxyXG5cdFx0XHR4OiBkYXRhLngsXHJcblx0XHRcdHk6IGRhdGEueSxcclxuXHRcdFx0Y3JlYXRlZEJ5OiBkYXRhLmNyZWF0ZWRCeSxcclxuXHRcdFx0Y3JlYXRlZERhdGU6IGRhdGEuY3JlYXRlZERhdGVcclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBhd2FpdCBpdGVtLnNhdmUoKVxyXG5cdFx0LnRoZW4ocmVzdWx0ID0+IHRydWUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBnZXRJdGVtKGl0ZW1JZCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IEl0ZW0uZmluZE9uZSh7X2lkOiBpdGVtSWR9KVxyXG5cdFx0LnNlbGVjdCgnX2lkIHRlbXBsYXRlIHN0YWNrIHBsYXllcklkIGJvdElkIHNsb3QgbWFwSWQgeCB5IGNyZWF0ZWREYXRlIGNyZWF0ZWRCeScpXHJcblx0XHQuZXhlYygpXHJcblx0XHQudGhlbihpdGVtID0+IGl0ZW0pXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBzYXZlSXRlbShkYXRhKSB7XHJcblx0XHRyZXR1cm4gYXdhaXQgSXRlbS51cGRhdGVPbmUoe19pZDogZGF0YS5pdGVtSWR9LCB7JHNldDogZGF0YX0sIHt1cHNlcnQ6IHRydWV9KVxyXG5cdFx0LmV4ZWMoKVxyXG5cdFx0LnRoZW4ocmVzdWx0ID0+IHRydWUpXHJcblx0XHQuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHRhc3luYyBnZXRBbGxJdGVtcygpIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHJldHVybiBhd2FpdCBJdGVtLmZpbmQoe30pXHJcblx0XHRcdC5zZWxlY3QoJ19pZCB0ZW1wbGF0ZSBzdGFjayBwbGF5ZXJJZCBib3RJZCBzbG90IG1hcElkIHggeSBjcmVhdGVkRGF0ZSBjcmVhdGVkQnknKVxyXG5cdFx0XHQucG9wdWxhdGUoJ3RlbXBsYXRlJylcclxuXHRcdFx0LmV4ZWMoKVxyXG5cdFx0XHQudGhlbihpdGVtcyA9PiBpdGVtcylcclxuXHRcdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHRcdH1cclxuXHRcdGNhdGNoKGVycikge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRhc3luYyBzYXZlQWxsSXRlbXMoY3VycmVudEl0ZW1zKSB7XHJcblx0XHRpZiAoIWN1cnJlbnRJdGVtcykgcmV0dXJuO1xyXG5cclxuXHRcdGxldCBzYXZlZEl0ZW1zID0gYXdhaXQgdGhpcy5nZXRBbGxJdGVtcygpO1xyXG5cdFx0Y29uc3QgbmV3SXRlbXMgPSBjdXJyZW50SXRlbXMuZmlsdGVyKGl0ZW0gPT4gIXNhdmVkSXRlbXMuZmluZChzYXZlZEl0ZW0gPT4gc2F2ZWRJdGVtLl9pZCA9PT0gaXRlbS5pdGVtSWQpKTtcclxuXHRcdGNvbnN0IGV4aXN0aW5nSXRlbXMgPSBjdXJyZW50SXRlbXMuZmlsdGVyKGl0ZW0gPT4gc2F2ZWRJdGVtcy5maW5kKHNhdmVkSXRlbSA9PiBzYXZlZEl0ZW0uX2lkID09PSBpdGVtLml0ZW1JZCkpO1xyXG5cdFx0Y29uc3QgZGVsZXRlSXRlbXMgPSBzYXZlZEl0ZW1zLmZpbHRlcihpdGVtID0+ICFleGlzdGluZ0l0ZW1zLmZpbmQoZXhpc3RpbmdJdGVtID0+IGV4aXN0aW5nSXRlbS5pdGVtSWQgPT09IGl0ZW0uX2lkKSk7XHJcblx0XHRjb25zdCB1cGRhdGVJdGVtcyA9IGV4aXN0aW5nSXRlbXMuZmlsdGVyKGl0ZW0gPT4gIWRlbGV0ZUl0ZW1zLmluY2x1ZGVzKGl0ZW0pKTtcclxuXHRcdFxyXG5cdFx0Ly8gQWRkIG5ldyBJdGVtc1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBuZXdJdGVtcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR0aGlzLmFkZEl0ZW0obmV3SXRlbXNbaV0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIERlbGV0ZSByZW1vdmVkIEl0ZW1zXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGRlbGV0ZUl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdEl0ZW0uZGVsZXRlT25lKHtfaWQ6IGRlbGV0ZUl0ZW1zW2ldLl9pZH0sIGVyciA9PiB7XHJcblx0XHRcdFx0aWYgKGVycikgY29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gVXBkYXRlIHRoZSByZXN0XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHVwZGF0ZUl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IGl0ZW0gPSB1cGRhdGVJdGVtc1tpXTtcclxuXHRcdFx0aWYgKCFpdGVtKSBjb250aW51ZTtcclxuXHRcdFx0dGhpcy5zYXZlSXRlbShpdGVtKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmNvbnN0IGRiID0gbmV3IERhdGFiYXNlKCk7XHJcbmV4cG9ydCBkZWZhdWx0IGRiO1xyXG4iLCJpbXBvcnQgZGIgZnJvbSAnLi9kYi5qcyc7XHJcbmltcG9ydCBjb25maWcgZnJvbSAnLi9jb25maWcuanMnO1xyXG5cclxuaW1wb3J0IE1hcCBmcm9tICcuL2NsYXNzZXMvbWFwLmpzJztcclxuaW1wb3J0IFBsYXllciBmcm9tICcuL2NsYXNzZXMvcGxheWVyLmpzJztcclxuaW1wb3J0IEJvdCBmcm9tICcuL2NsYXNzZXMvYm90LmpzJztcclxuaW1wb3J0IEl0ZW0gZnJvbSAnLi9jbGFzc2VzL2l0ZW0uanMnO1xyXG5pbXBvcnQgRWZmZWN0IGZyb20gJy4vY2xhc3Nlcy9lZmZlY3QuanMnO1xyXG5pbXBvcnQgVGV4dCBmcm9tICcuL2NsYXNzZXMvdGV4dC5qcyc7XHJcbmltcG9ydCBNZXNzYWdlIGZyb20gJy4vY2xhc3Nlcy9tZXNzYWdlLmpzJztcclxuXHJcbmNsYXNzIEdhbWUge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0dGhpcy5tYXBzID0gW107XHJcblx0XHR0aGlzLnBsYXllcnMgPSBbXTtcclxuXHRcdHRoaXMuYm90cyA9IFtdO1xyXG5cdFx0dGhpcy5pdGVtcyA9IFtdO1xyXG5cdFx0dGhpcy5lZmZlY3RzID0gW107XHJcblx0XHR0aGlzLnRleHRzID0gW107XHJcblx0XHR0aGlzLm1lc3NhZ2VRdWV1ZSA9IFtdO1xyXG5cdFx0XHJcblx0XHR0aGlzLnBsYXllclRlbXBsYXRlcyA9IHt9O1xyXG5cdFx0dGhpcy5ib3RUZW1wbGF0ZXMgPSB7fTtcclxuXHRcdHRoaXMuaXRlbVRlbXBsYXRlcyA9IHt9O1xyXG5cclxuXHRcdHRoaXMubG9hZE1hcHMoKTtcclxuXHRcdHRoaXMubG9hZFBsYXllclRlbXBsYXRlcygpO1xyXG5cdFx0dGhpcy5sb2FkQm90VGVtcGxhdGVzKCk7XHJcblx0XHR0aGlzLmxvYWRJdGVtVGVtcGxhdGVzKCk7XHJcblx0XHR0aGlzLmxvYWRDb21tYW5kcygpO1xyXG5cdFx0dGhpcy5sb2FkSXRlbXMoKTtcclxuXHRcdHRoaXMubG9hZEJvdHMoKTtcclxuXHR9XHJcblxyXG5cdGxvYWRNYXBzKCkge1xyXG5cdFx0ZGIuZ2V0QWxsTWFwcygpXHJcblx0XHQudGhlbihtYXBEYXRhID0+IHtcclxuXHRcdFx0Y29uc3Qgb3JkZXJlZE1hcERhdGEgPSBbXTtcclxuXHRcdFx0Zm9yIChsZXQgaWQgPSAwOyBpZCA8IG1hcERhdGEubGVuZ3RoOyBpZCsrKSB7XHJcblx0XHRcdFx0Y29uc3QgZGF0YSA9IG1hcERhdGFbaWRdO1xyXG5cdFx0XHRcdGlmIChkYXRhKSBvcmRlcmVkTWFwRGF0YVtkYXRhLm1hcElkXSA9IGRhdGE7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZvciAobGV0IGlkID0gMDsgaWQgPCBjb25maWcuTUFYX01BUFM7IGlkKyspIHtcclxuXHRcdFx0XHRpZiAob3JkZXJlZE1hcERhdGFbaWRdKSB7XHJcblx0XHRcdFx0XHR0aGlzLm1hcHNbaWRdID0gbmV3IE1hcChpZCwgb3JkZXJlZE1hcERhdGFbaWRdKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm1hcHNbaWRdID0gbmV3IE1hcChpZCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuXHR9XHJcblxyXG5cdGxvYWRQbGF5ZXJUZW1wbGF0ZXMoKSB7XHJcblx0XHRkYi5nZXRBbGxQbGF5ZXJUZW1wbGF0ZXMoKVxyXG5cdFx0LnRoZW4odGVtcGxhdGVzID0+IHtcclxuXHRcdFx0dGhpcy5wbGF5ZXJUZW1wbGF0ZXMgPSB7fTtcclxuXHRcdFx0dGVtcGxhdGVzLmZvckVhY2godGVtcGxhdGUgPT4ge1xyXG5cdFx0XHRcdHRoaXMucGxheWVyVGVtcGxhdGVzW3RlbXBsYXRlLl9pZF0gPSB0ZW1wbGF0ZTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KS5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cclxuXHRsb2FkQm90VGVtcGxhdGVzKCkge1xyXG5cdFx0ZGIuZ2V0QWxsQm90VGVtcGxhdGVzKClcclxuXHRcdC50aGVuKHRlbXBsYXRlcyA9PiB7XHJcblx0XHRcdHRoaXMuYm90VGVtcGxhdGVzID0ge307XHJcblx0XHRcdHRlbXBsYXRlcy5mb3JFYWNoKHRlbXBsYXRlID0+IHtcclxuXHRcdFx0XHR0aGlzLmJvdFRlbXBsYXRlc1t0ZW1wbGF0ZS5faWRdID0gdGVtcGxhdGU7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSkuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xyXG5cdH1cclxuXHJcblx0bG9hZEl0ZW1UZW1wbGF0ZXMoKSB7XHJcblx0XHRkYi5nZXRBbGxJdGVtVGVtcGxhdGVzKClcclxuXHRcdC50aGVuKHRlbXBsYXRlcyA9PiB7XHJcblx0XHRcdHRoaXMuaXRlbVRlbXBsYXRlcyA9IHt9O1xyXG5cdFx0XHR0ZW1wbGF0ZXMuZm9yRWFjaCh0ZW1wbGF0ZSA9PiB7XHJcblx0XHRcdFx0dGhpcy5pdGVtVGVtcGxhdGVzW3RlbXBsYXRlLl9pZF0gPSB0ZW1wbGF0ZTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KS5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0fVxyXG5cclxuXHRsb2FkQ29tbWFuZHMoKSB7XHJcblx0XHR0aGlzLmNvbW1hbmRzID0ge1xyXG5cdFx0XHRtb3ZlOiAoZGF0YSwgcGxheWVyKSA9PiBwbGF5ZXIuaW5wdXQuZGlyZWN0aW9uID0gZGF0YS5kaXJlY3Rpb24sXHJcblx0XHRcdHJ1bjogKGRhdGEsIHBsYXllcikgPT4gcGxheWVyLmlucHV0LnJ1biA9IGRhdGEuc3RhdGUsXHJcblx0XHRcdHBpY2t1cDogKGRhdGEsIHBsYXllcikgPT4ge1xyXG5cdFx0XHRcdGlmICghcGxheWVyLmlucHV0LnBpY2t1cCAmJiBkYXRhLnN0YXRlKSBwbGF5ZXIucGlja1VwKCk7XHJcblx0XHRcdFx0cGxheWVyLmlucHV0LnBpY2t1cCA9IGRhdGEuc3RhdGU7XHJcblx0XHRcdH0sXHJcblx0XHRcdGF0dGFjazogKGRhdGEsIHBsYXllcikgPT4ge1xyXG5cdFx0XHRcdHBsYXllci5pbnB1dC5hdHRhY2sgPSBkYXRhLnN0YXRlO1xyXG5cdFx0XHRcdHBsYXllci5hdHRhY2soMSwgcGxheWVyLmRpcmVjdGlvbik7XHJcblx0XHRcdH0sXHJcblx0XHRcdGRvdWJsZUNsaWNrSXRlbTogKGRhdGEsIHBsYXllcikgPT4gcGxheWVyLnVzZUl0ZW0oZGF0YS5zbG90KSxcclxuXHRcdFx0cmlnaHRDbGlja0l0ZW06IChkYXRhLCBwbGF5ZXIpID0+IHBsYXllci5kcm9wSXRlbShkYXRhLnNsb3QpLFxyXG5cdFx0XHRkcmFnU3RvcEdhbWU6IChkYXRhLCBwbGF5ZXIpID0+IHBsYXllci5kcm9wSXRlbShkYXRhLnNsb3QpLFxyXG5cdFx0XHRkcmFnU3RvcEludmVudG9yeTogKGRhdGEsIHBsYXllcikgPT4gcGxheWVyLm1vdmVJdGVtVG9TbG90KGRhdGEuc2xvdCwgZGF0YS5uZXdTbG90KSxcclxuXHRcdFx0ZHJhZ1N0b3BFcXVpcG1lbnQ6IChkYXRhLCBwbGF5ZXIpID0+IHBsYXllci5tb3ZlSXRlbVRvU2xvdChkYXRhLnNsb3QsIGRhdGEubmV3U2xvdCksXHJcblx0XHRcdHNlcnZlckNoYXQ6IChkYXRhLCBwbGF5ZXIpID0+IGdhbWUuc2VuZE1lc3NhZ2VHbG9iYWwocGxheWVyLmdhbWVJZCwgYCR7cGxheWVyLm5hbWV9IHllbGxzLCBcIiR7ZGF0YS5tZXNzYWdlfVwiYCksXHJcblx0XHRcdG1hcENoYXQ6IChkYXRhLCBwbGF5ZXIpID0+IGdhbWUuc2VuZE1lc3NhZ2VNYXAocGxheWVyLmdhbWVJZCwgcGxheWVyLm1hcElkLCBgJHtwbGF5ZXIubmFtZX0gc2F5cywgXCIke2RhdGEubWVzc2FnZX1cImApLFxyXG5cdFx0XHRwbGF5ZXJDaGF0OiAoZGF0YSwgcGxheWVyKSA9PiB7XHJcblx0XHRcdFx0Y29uc3QgdGFyZ2V0ID0gZ2FtZS5wbGF5ZXJzW2RhdGEudGFyZ2V0SWRdO1xyXG5cdFx0XHRcdGlmICh0YXJnZXQpIHtcclxuXHRcdFx0XHRcdGdhbWUuc2VuZE1lc3NhZ2VQbGF5ZXIocGxheWVyLmdhbWVJZCwgdGFyZ2V0LmdhbWVJZCwgYCR7cGxheWVyLm5hbWV9IHdoaXNwZXJzLCBcIiR7ZGF0YS5tZXNzYWdlfVwiYCk7XHJcblx0XHRcdFx0XHRnYW1lLnNlbmRNZXNzYWdlUGxheWVyKHBsYXllci5nYW1lSWQsIHBsYXllci5nYW1lSWQsIGBZb3Ugd2hpc3BlciB0byAke3RhcmdldC5uYW1lfSwgXCIke2RhdGEubWVzc2FnZX1cImApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0bWFjcm8xOiAoZGF0YSkgPT4ge1xyXG5cdFx0XHRcdGlmIChkYXRhKSB0aGlzLnNwYXduTWFwSXRlbSgxLCA1LCA1LCBcIjVjMWJmZWI3ZDhmYjYwMTJjYzk2NjA4M1wiKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0bWFjcm8yOiAoZGF0YSkgPT4ge1xyXG5cdFx0XHRcdGlmIChkYXRhKSB0aGlzLnNwYXduQm90KDEsIDUsIDUsIFwiNWMxYmVjZGUyOGQwNWIwNzdjYmFhMzg1XCIpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRtYWNybzM6IChkYXRhKSA9PiB7XHJcblx0XHRcdFx0aWYgKGRhdGEpIHtcclxuXHRcdFx0XHRcdGlmIChwbGF5ZXIuc3ByaXRlID49IGNvbmZpZy5NQVhfU1BSSVRFUykgcGxheWVyLnNwcml0ZSA9IDE7XHJcblx0XHRcdFx0XHRlbHNlIHBsYXllci5zcHJpdGUrKztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdG1hY3JvNDogKGRhdGEpID0+IHtcclxuXHRcdFx0fSxcclxuXHJcblx0XHR9O1xyXG5cdFx0XHJcblx0XHR0aGlzLmdvZENvbW1hbmRzID0ge1xyXG5cdFx0XHRzcGF3bk1hcEl0ZW06IChkYXRhKSA9PiB0aGlzLnNwYXduTWFwSXRlbShkYXRhLmFyZ3NbMF0sIGRhdGEuYXJnc1sxXSwgZGF0YS5hcmdzWzJdLCBkYXRhLmFyZ3NbM10sIGRhdGEuYXJnc1s0XSksXHJcblx0XHRcdHNwYXduQm90OiAoZGF0YSkgPT4gdGhpcy5zcGF3bkJvdChkYXRhLmFyZ3NbMF0sIGRhdGEuYXJnc1sxXSwgZGF0YS5hcmdzWzJdLCBkYXRhLmFyZ3NbM10sIGRhdGEuYXJnc1s0XSksXHJcblx0XHRcdHNldFNwcml0ZTogKGRhdGEsIHBsYXllcikgPT4gcGxheWVyLnNwcml0ZSA9IGRhdGEuYXJnc1swXVxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdGFzeW5jIGxvYWRJdGVtcygpIHtcclxuXHRcdGxldCBpdGVtRGF0YSA9IGF3YWl0IGRiLmdldEFsbEl0ZW1zKCk7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1EYXRhLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdG5ldyBJdGVtKGl0ZW1EYXRhW2ldKTtcclxuXHRcdH1cclxuXHR9XHJcblx0YXN5bmMgbG9hZEJvdHMoKSB7XHJcblx0XHRsZXQgYm90RGF0YSA9IGF3YWl0IGRiLmdldEFsbEJvdHMoKTtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYm90RGF0YS5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRuZXcgQm90KGJvdERhdGFbaV0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRyZXF1ZXN0REJJZCgpIHtcclxuXHRcdHJldHVybiBkYi5nZW5lcmF0ZUlkKCk7XHJcblx0fVxyXG5cclxuXHR1cGRhdGUoZGVsdGEpIHtcclxuXHRcdGNvbnN0IHBhY2sgPSB7XHJcblx0XHRcdHBsYXllcnM6IFtdLFxyXG5cdFx0XHRib3RzOiBbXSxcclxuXHRcdFx0aXRlbXM6IFtdLFxyXG5cdFx0XHRlZmZlY3RzOiBbXSxcclxuXHRcdFx0dGV4dHM6IFtdLFxyXG5cdFx0XHRtZXNzYWdlczogW10uY29uY2F0KHRoaXMubWVzc2FnZVF1ZXVlKVxyXG5cdFx0fTtcclxuXHRcdHRoaXMubWVzc2FnZVF1ZXVlID0gW107XHJcblxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBsYXllcnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgcGxheWVyID0gdGhpcy5wbGF5ZXJzW2ldO1xyXG5cdFx0XHRpZiAocGxheWVyICE9IG51bGwpIHBhY2sucGxheWVyc1twbGF5ZXIuZ2FtZUlkXSA9IHBsYXllci51cGRhdGUoZGVsdGEpO1xyXG5cdFx0fVxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmJvdHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgYm90ID0gdGhpcy5ib3RzW2ldO1xyXG5cdFx0XHRpZiAoYm90KSBwYWNrLmJvdHNbYm90LmdhbWVJZF0gPSBib3QudXBkYXRlKGRlbHRhKTtcclxuXHRcdH1cclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pdGVtcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRjb25zdCBpdGVtID0gdGhpcy5pdGVtc1tpXTtcclxuXHRcdFx0aWYgKGl0ZW0pIHBhY2suaXRlbXNbaXRlbS5nYW1lSWRdID0gaXRlbS51cGRhdGUoZGVsdGEpO1xyXG5cdFx0fVxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmVmZmVjdHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgZWZmZWN0ID0gdGhpcy5lZmZlY3RzW2ldO1xyXG5cdFx0XHRpZiAoZWZmZWN0KSBwYWNrLmVmZmVjdHNbZWZmZWN0LmlkXSA9IGVmZmVjdC51cGRhdGUoZGVsdGEpO1xyXG5cdFx0fVxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRleHRzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IHRleHQgPSB0aGlzLnRleHRzW2ldO1xyXG5cdFx0XHRpZiAodGV4dCkgcGFjay50ZXh0c1t0ZXh0LmdhbWVJZF0gPSB0ZXh0LnVwZGF0ZShkZWx0YSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcGFjaztcclxuXHR9XHJcblxyXG5cdGdldERCUGFjaygpIHtcclxuXHRcdGNvbnN0IGRiUGFjayA9IHtcclxuXHRcdFx0cGxheWVyczogW10sXHJcblx0XHRcdGJvdHM6IFtdLFxyXG5cdFx0XHRpdGVtczogW11cclxuXHRcdH07XHJcblx0XHR0aGlzLnBsYXllcnMuZm9yRWFjaChwbGF5ZXIgPT4gZGJQYWNrLnBsYXllcnMucHVzaChwbGF5ZXIuZ2V0REJQYWNrKCkpKTtcclxuXHRcdHRoaXMuYm90cy5mb3JFYWNoKGJvdCA9PiBkYlBhY2suYm90cy5wdXNoKGJvdC5nZXREQlBhY2soKSkpO1xyXG5cdFx0dGhpcy5pdGVtcy5mb3JFYWNoKGl0ZW0gPT4gZGJQYWNrLml0ZW1zLnB1c2goaXRlbS5nZXREQlBhY2soKSkpO1xyXG5cdFx0cmV0dXJuIGRiUGFjaztcclxuXHR9XHJcblxyXG5cdC8vIFBsYXllcnNcclxuXHRwbGF5ZXJMb2dpbihzb2NrZXRJZCwgZGF0YSkge1xyXG5cdFx0Zm9yIChsZXQgcGxheWVyIG9mIHRoaXMucGxheWVycykge1xyXG5cdFx0XHRpZiAocGxheWVyICYmIHBsYXllci5uYW1lID09PSBkYXRhLm5hbWUpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIlBsYXllciBpcyBhbHJlYWR5IHNpZ25lZCBpbi5cIik7XHJcblx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBwbGF5ZXIgPSBuZXcgUGxheWVyKHNvY2tldElkLCBkYXRhKTtcclxuXHRcdGRiLmxvZyhgJHtzb2NrZXRJZH0gLSAke3BsYXllci5uYW1lfSBoYXMgbG9nZ2VkIGluLmApO1xyXG5cdFx0dGhpcy5zZW5kR2FtZUluZm9HbG9iYWwoYCR7cGxheWVyLm5hbWV9IGhhcyBsb2dnZWQgaW4uYCk7XHJcblx0XHRyZXR1cm4gcGxheWVyO1xyXG5cdH1cclxuXHRwbGF5ZXJMb2dvdXQocGxheWVySWQpIHtcclxuXHRcdGxldCBwbGF5ZXIgPSB0aGlzLnBsYXllcnNbcGxheWVySWRdO1xyXG5cdFx0aWYgKHBsYXllcikge1xyXG5cdFx0XHRjb25zdCBwbGF5ZXJEYXRhID0gcGxheWVyLmdldERCUGFjaygpXHJcblx0XHRcdGRiLmxvZyhgJHtwbGF5ZXIuc29ja2V0SWR9IC0gJHtwbGF5ZXIubmFtZX0gaGFzIGxvZ2dlZCBvdXQuYCk7XHJcblx0XHRcdHRoaXMuc2VuZEdhbWVJbmZvR2xvYmFsKGAke3BsYXllci5uYW1lfSBoYXMgbG9nZ2VkIG91dC5gKTtcclxuXHRcdFx0ZGVsZXRlIHRoaXMudGV4dHNbcGxheWVyLmRpc3BsYXlOYW1lSWRdO1xyXG5cdFx0XHRkZWxldGUgdGhpcy5wbGF5ZXJzW3BsYXllcklkXTtcclxuXHRcdFx0ZGIuc2F2ZVBsYXllcihwbGF5ZXJEYXRhKTtcclxuXHRcdH1cclxuXHR9XHJcblx0Z2V0RXhwVG9MZXZlbChsZXZlbCkge1xyXG5cdFx0bGV0IGV4cCA9IDEwO1xyXG5cdFx0Zm9yIChsZXQgaSA9IDE7IGkgPCBjb25maWcuTUFYX0xFVkVMOyBpKyspIHtcclxuXHRcdFx0aWYgKGkgPT09IGxldmVsKSByZXR1cm4gZXhwO1xyXG5cdFx0XHRleHAgPSAoZXhwICsgKGV4cCAlIDIpKSAqIDEuNTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIEdhbWUgSW5mb1xyXG5cdHNlbmRHYW1lSW5mb0dsb2JhbChtZXNzYWdlKSB7XHJcblx0XHR0aGlzLm1lc3NhZ2VRdWV1ZS5wdXNoKG5ldyBNZXNzYWdlKG51bGwsIG1lc3NhZ2UsICdnYW1lSW5mbycpKTtcclxuXHR9XHJcblx0c2VuZEdhbWVJbmZvTWFwKG1hcElkLCBtZXNzYWdlKSB7XHJcblx0XHR0aGlzLm1lc3NhZ2VRdWV1ZS5wdXNoKG5ldyBNZXNzYWdlKG51bGwsIG1lc3NhZ2UsICdnYW1lSW5mbycsIG1hcElkKSk7XHJcblx0fVxyXG5cdHNlbmRHYW1lSW5mb1BsYXllcihpZCwgbWVzc2FnZSkge1xyXG5cdFx0dGhpcy5tZXNzYWdlUXVldWUucHVzaChuZXcgTWVzc2FnZShudWxsLCBtZXNzYWdlLCAnZ2FtZUluZm8nLCBudWxsLCBpZCkpO1xyXG5cdH1cclxuXHRcclxuXHQvLyBDaGF0IE1lc3NhZ2VzXHJcblx0c2VuZE1lc3NhZ2VHbG9iYWwoc2VuZGVySWQsIG1lc3NhZ2UpIHtcclxuXHRcdHRoaXMubWVzc2FnZVF1ZXVlLnB1c2gobmV3IE1lc3NhZ2Uoc2VuZGVySWQsIG1lc3NhZ2UsICdtZXNzYWdlR2xvYmFsJykpO1xyXG5cdH1cclxuXHRzZW5kTWVzc2FnZU1hcChzZW5kZXJJZCwgbWFwSWQsIG1lc3NhZ2UpIHtcclxuXHRcdHRoaXMubWVzc2FnZVF1ZXVlLnB1c2gobmV3IE1lc3NhZ2Uoc2VuZGVySWQsIG1lc3NhZ2UsICdtZXNzYWdlTWFwJywgbWFwSWQpKTtcclxuXHR9XHJcblx0c2VuZE1lc3NhZ2VQbGF5ZXIoc2VuZGVySWQsIGlkLCBtZXNzYWdlKSB7XHJcblx0XHR0aGlzLm1lc3NhZ2VRdWV1ZS5wdXNoKG5ldyBNZXNzYWdlKHNlbmRlcklkLCBtZXNzYWdlLCAnbWVzc2FnZVBsYXllcicsIG51bGwsIGlkKSk7XHJcblx0fVxyXG5cclxuXHQvLyBNYXBcclxuXHRpc1ZhY2FudChtYXBJZCwgeCwgeSkge1xyXG5cdFx0Ly8gQ2hlY2sgZm9yIE1hcCBFZGdlc1xyXG5cdFx0aWYgKHggPCAwIHx8IHggPj0gY29uZmlnLk1BUF9DT0xVTU5TIHx8IHkgPCAwIHx8IHkgPj0gY29uZmlnLk1BUF9ST1dTKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcclxuXHRcdC8vIENoZWNrIGZvciBXYWxsIFRpbGVzXHJcblx0XHRjb25zdCBtYXAgPSB0aGlzLm1hcHNbbWFwSWRdO1xyXG5cdFx0aWYgKG1hcC5pc1dhbGxbeV1beF0pIHJldHVybiBmYWxzZTtcclxuXHRcdFxyXG5cdFx0Ly8gQ2hlY2sgZm9yIEFjdG9yc1xyXG5cdFx0Y29uc3QgYWN0b3JMaXN0ID0gdGhpcy5wbGF5ZXJzLmNvbmNhdCh0aGlzLmJvdHMpO1xyXG5cdFx0Y29uc3QgYWN0b3JzT25UaWxlID0gYWN0b3JMaXN0LmZpbHRlcihhY3RvciA9PiB7XHJcblx0XHRcdHJldHVybiBhY3Rvci5tYXBJZCA9PT0gbWFwSWQgJiYgYWN0b3IueCA9PT0geCAmJiBhY3Rvci55ID09PSB5ICYmICFhY3Rvci5pc0RlYWQ7XHJcblx0XHR9KTtcclxuXHRcdGlmIChhY3RvcnNPblRpbGUubGVuZ3RoID4gMCkgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHJcblx0c3Bhd25Cb3QobWFwSWQsIHgsIHksIHRlbXBsYXRlSWQsIGRpcmVjdGlvbiA9ICdkb3duJykge1xyXG5cdFx0Y29uc3QgdGVtcGxhdGUgPSB0aGlzLmJvdFRlbXBsYXRlc1t0ZW1wbGF0ZUlkXTtcclxuXHRcdGlmICh0ZW1wbGF0ZSkge1xyXG5cdFx0XHRuZXcgQm90KHttYXBJZCwgeCwgeSwgZGlyZWN0aW9uLCB0ZW1wbGF0ZX0pO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiQm90IFRlbXBsYXRlIGRvZXMgbm90IGV4aXN0IHdpdGggdGhhdCBJZFwiKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0c3Bhd25NYXBJdGVtKG1hcElkLCB4LCB5LCB0ZW1wbGF0ZUlkLCBzdGFjayA9IDApIHtcclxuXHRcdGxldCB0ZW1wbGF0ZSA9IHRoaXMuaXRlbVRlbXBsYXRlc1t0ZW1wbGF0ZUlkXTtcclxuXHRcdGlmICh0ZW1wbGF0ZSkge1xyXG5cdFx0XHRuZXcgSXRlbSh7bWFwSWQsIHgsIHksIHRlbXBsYXRlLCBzdGFja30pO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiSXRlbSBUZW1wbGF0ZSBkb2VzIG5vdCBleGlzdCB3aXRoIHRoYXQgSWRcIik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzcGF3bkRhbWFnZVRleHQobWFwSWQsIHgsIHksIGRhbWFnZSkge1xyXG5cdFx0bmV3IFRleHQobWFwSWQsIHgsIHkgKyAwLjUsIGRhbWFnZSwgJyNmZjAwMDAnLCAxLjI1LCAwLCAtMSk7XHJcblx0fVxyXG5cclxuXHRzcGF3bkVmZmVjdChtYXBJZCwgeCwgeSwgc3ByaXRlLCBsb29wLCBzcGVlZCwgbWF4RnJhbWUsIHN0YXJ0RnJhbWUpIHtcclxuXHRcdG5ldyBFZmZlY3QobWFwSWQsIHgsIHksIHNwcml0ZSwgbG9vcCwgc3BlZWQsIG1heEZyYW1lLCBzdGFydEZyYW1lKTtcclxuXHR9XHJcbn1cclxuXHJcbmNvbnN0IGdhbWUgPSBuZXcgR2FtZSgpO1xyXG5leHBvcnQgZGVmYXVsdCBnYW1lO1xyXG4iLCIvKioqIEdhbWUgTG9vcCAqKiovXHJcbi8qIEtlZXBzIHRyYWNrIG9mIHRpbWUgYW5kIGNvLW9yZGluYXRlcyB0aGUgZ2FtZSBhbmQgc2VydmVyICovXHJcblxyXG5pbXBvcnQgTm9kZUdhbWVMb29wIGZyb20gJ25vZGUtZ2FtZWxvb3AnO1xyXG5cclxuaW1wb3J0IGRiIGZyb20gJy4vZGIuanMnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuL2dhbWUuanMnO1xyXG5pbXBvcnQgc2VydmVyIGZyb20gJy4vc2VydmVyLmpzJztcclxuaW1wb3J0IGNvbmZpZyBmcm9tICcuL2NvbmZpZy5qcyc7XHJcblxyXG5jbGFzcyBHYW1lTG9vcCB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHR0aGlzLnRpbWVyID0ge1xyXG5cdFx0XHRiYWNrdXA6IDAsXHJcblx0XHRcdG1pbnV0ZTogMFxyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLmlkID0gTm9kZUdhbWVMb29wLnNldEdhbWVMb29wKChkZWx0YSkgPT4gdGhpcy51cGRhdGUoZGVsdGEpLCBjb25maWcuRlJBTUVSQVRFKTtcclxuXHR9XHJcblxyXG5cdHVwZGF0ZShkZWx0YSkge1xyXG5cdFx0Ly8gSW5jcmVhc2UgVGltZXJzXHJcblx0XHR0aGlzLnRpbWVyLmJhY2t1cCArPSBkZWx0YTtcclxuXHRcdHRoaXMudGltZXIubWludXRlICs9IGRlbHRhO1xyXG5cclxuXHRcdC8vIFVwZGF0ZSB0aGUgZ2FtZSBzdGF0ZVxyXG5cdFx0bGV0IHVwZGF0ZVBhY2sgPSBnYW1lLnVwZGF0ZShkZWx0YSk7XHJcblx0XHQvLyBTZW5kIHVwZGF0ZWQgc3RhdGUgdG8gY2xpZW50c1xyXG5cdFx0c2VydmVyLnNlbmRVcGRhdGVQYWNrKHVwZGF0ZVBhY2spO1xyXG5cdFx0XHJcblx0XHQvLyBNaW51dGUgdGltZXIgc2NyaXB0XHJcblx0XHRpZiAodGhpcy50aW1lci5taW51dGUgPj0gNjApIHtcclxuXHRcdFx0dGhpcy50aW1lci5taW51dGUgLT0gNjA7XHJcblx0XHRcdC8vIFRPRE86IHJ1biBtaW51dGUgdGltZXIgc2NyaXB0XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gUGVyaW9kaWMgYmFja3VwIHRvIGRhdGFiYXNlXHJcblx0XHRpZiAodGhpcy50aW1lci5iYWNrdXAgPj0gY29uZmlnLkJBQ0tVUF9USU1FKSB7XHJcblx0XHRcdHRoaXMudGltZXIuYmFja3VwIC09IGNvbmZpZy5CQUNLVVBfVElNRTtcclxuXHRcdFx0bGV0IGRiUGFjayA9IGdhbWUuZ2V0REJQYWNrKCk7XHJcblx0XHRcdGRiLmJhY2t1cChkYlBhY2spO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuY29uc3QgZ2FtZUxvb3AgPSBuZXcgR2FtZUxvb3AoKTtcclxuZXhwb3J0IGRlZmF1bHQgZ2FtZUxvb3A7XHJcbiIsImltcG9ydCBkYiBmcm9tICcuL2RiLmpzJztcclxuaW1wb3J0IGdhbWUgZnJvbSAnLi9nYW1lLmpzJztcclxuaW1wb3J0IHNlcnZlciBmcm9tICcuL3NlcnZlci5qcyc7XHJcbmltcG9ydCBnYW1lbG9vcCBmcm9tICcuL2dhbWVsb29wLmpzJztcclxuIiwiaW1wb3J0IG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcclxuXHJcbmNvbnN0IGFjY291bnRTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcclxuICBfaWQ6IG1vbmdvb3NlLlNjaGVtYVR5cGVzLk9iamVjdElkLFxyXG4gIHVzZXJuYW1lOiB7dHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSwgdW5pcXVlOiB0cnVlfSxcclxuICBwYXNzd29yZDoge3R5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWV9LFxyXG4gIGVtYWlsOiB7dHlwZTogU3RyaW5nLCBtYXRjaDogL14oKFtePD4oKVxcW1xcXVxcXFwuLDs6XFxzQFwiXSsoXFwuW148PigpXFxbXFxdXFxcXC4sOzpcXHNAXCJdKykqKXwoXCIuK1wiKSlAKChcXFtbMC05XXsxLDN9XFwuWzAtOV17MSwzfVxcLlswLTldezEsM31cXC5bMC05XXsxLDN9XSl8KChbYS16QS1aXFwtMC05XStcXC4pK1thLXpBLVpdezIsfSkpJC99LFxyXG4gIHZlcmlmaWVkOiB7dHlwZTogQm9vbGVhbiwgZGVmYXVsdDogZmFsc2V9LFxyXG4gIGFkbWluOiB7dHlwZTogQm9vbGVhbiwgZGVmYXVsdDogZmFsc2V9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWwoJ0FjY291bnQnLCBhY2NvdW50U2NoZW1hKTtcclxuIiwiaW1wb3J0IG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcclxuXHJcbmNvbnN0IGJvdFNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoe1xyXG4gIF9pZDogbW9uZ29vc2UuU2NoZW1hVHlwZXMuT2JqZWN0SWQsXHJcbiAgbWFwSWQ6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDF9LFxyXG4gIHg6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDV9LFxyXG4gIHk6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDV9LFxyXG4gIHRlbXBsYXRlOiB7dHlwZTogbW9uZ29vc2UuU2NoZW1hVHlwZXMuT2JqZWN0SWQsIHJlZjogJ0JvdFRlbXBsYXRlJywgcmVxdWlyZWQ6IHRydWV9LFxyXG4gIGRpcmVjdGlvbjoge3R5cGU6IFN0cmluZywgZGVmYXVsdDogJ2Rvd24nfVxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1vbmdvb3NlLm1vZGVsKCdCb3QnLCBib3RTY2hlbWEpO1xyXG4iLCJpbXBvcnQgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xyXG5cclxuY29uc3QgYm90VGVtcGxhdGVTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcclxuICBfaWQ6IG1vbmdvb3NlLlNjaGVtYVR5cGVzLk9iamVjdElkLFxyXG4gIG5hbWU6IHt0eXBlOiBTdHJpbmcsIGRlZmF1bHQ6IFwiQm90XCJ9LFxyXG4gIHNwcml0ZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMX0sXHJcbiAgZGFtYWdlQmFzZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcbiAgZGVmZW5jZUJhc2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG4gIGhlYWx0aE1heEJhc2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDF9LFxyXG4gIGVuZXJneU1heEJhc2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDF9LFxyXG4gIGhlYWx0aFJlZ2VuQmFzZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMX0sXHJcbiAgZW5lcmd5UmVnZW5CYXNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuICByYW5nZUJhc2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDF9LFxyXG4gIGhvc3RpbGU6IHt0eXBlOiBCb29sZWFuLCBkZWZhdWx0OiB0cnVlfVxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1vbmdvb3NlLm1vZGVsKCdCb3RUZW1wbGF0ZScsIGJvdFRlbXBsYXRlU2NoZW1hKTtcclxuIiwiaW1wb3J0IG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcclxuXHJcbmNvbnN0IGl0ZW1TY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcclxuICBfaWQ6IG1vbmdvb3NlLlNjaGVtYVR5cGVzLk9iamVjdElkLFxyXG4gIHRlbXBsYXRlOiB7dHlwZTogbW9uZ29vc2UuU2NoZW1hVHlwZXMuT2JqZWN0SWQsIHJlZjogJ0l0ZW1UZW1wbGF0ZScsIHJlcXVpcmVkOiB0cnVlfSxcclxuICBzdGFjazoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcbiAgcGxheWVySWQ6IHt0eXBlOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCwgZGVmYXVsdDogbnVsbH0sXHJcbiAgYm90SWQ6IHt0eXBlOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCwgZGVmYXVsdDogbnVsbH0sXHJcbiAgc2xvdDoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogbnVsbH0sXHJcbiAgbWFwSWQ6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IG51bGx9LFxyXG4gIHg6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IG51bGx9LFxyXG4gIHk6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IG51bGx9LFxyXG4gIGNyZWF0ZWRCeToge3R5cGU6IFN0cmluZ30sXHJcbiAgY3JlYXRlZERhdGU6IHt0eXBlOiBEYXRlfVxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1vbmdvb3NlLm1vZGVsKCdJdGVtJywgaXRlbVNjaGVtYSk7XHJcbiIsImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XHJcblxyXG5jb25zdCBpdGVtVGVtcGxhdGVTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcclxuXHRfaWQ6IG1vbmdvb3NlLlNjaGVtYVR5cGVzLk9iamVjdElkLFxyXG5cdG5hbWU6IHt0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlfSxcclxuXHRzcHJpdGU6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDF9LFxyXG5cdHJldXNhYmxlOiB7dHlwZTogQm9vbGVhbiwgZGVmYXVsdDogdHJ1ZX0sXHJcblx0dHlwZToge3R5cGU6IG1vbmdvb3NlLlNjaGVtYVR5cGVzLk9iamVjdElkLCByZWY6ICdJdGVtVHlwZScsIHJlcXVpcmVkOiB0cnVlfSxcclxuXHRwYXNzaXZlRGFtYWdlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuXHRwYXNzaXZlRGVmZW5jZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcblx0cGFzc2l2ZUhlYWx0aE1heDoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcblx0cGFzc2l2ZUVuZXJneU1heDoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcblx0cGFzc2l2ZUhlYWx0aFJlZ2VuOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuXHRwYXNzaXZlRW5lcmd5UmVnZW46IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG5cdHBhc3NpdmVSYW5nZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcblx0ZXF1aXBwZWREYW1hZ2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG5cdGVxdWlwcGVkRGVmZW5jZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcblx0ZXF1aXBwZWRIZWFsdGhNYXg6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG5cdGVxdWlwcGVkRW5lcmd5TWF4OiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuXHRlcXVpcHBlZEhlYWx0aFJlZ2VuOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuXHRlcXVpcHBlZEVuZXJneVJlZ2VuOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuXHRlcXVpcHBlZFJhbmdlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfVxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1vbmdvb3NlLm1vZGVsKCdJdGVtVGVtcGxhdGUnLCBpdGVtVGVtcGxhdGVTY2hlbWEpO1xyXG4iLCJpbXBvcnQgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xyXG5cclxuY29uc3QgaXRlbVR5cGVTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcclxuXHRfaWQ6IG1vbmdvb3NlLlNjaGVtYVR5cGVzLk9iamVjdElkLFxyXG5cdG5hbWU6IHt0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlfSxcclxuXHRlcXVpcHBlZFNsb3Q6IHt0eXBlOiBOdW1iZXIsIHJlcXVpcmVkOiB0cnVlfSxcclxuXHRzdGFja2FibGU6IHt0eXBlOiBCb29sZWFuLCByZXF1aXJlZDogdHJ1ZX1cclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBtb25nb29zZS5tb2RlbCgnSXRlbVR5cGUnLCBpdGVtVHlwZVNjaGVtYSk7XHJcbiIsImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XHJcblxyXG5jb25zdCBtYXBTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcclxuXHRfaWQ6IG1vbmdvb3NlLlNjaGVtYVR5cGVzLk9iamVjdElkLFxyXG5cdG1hcElkOiBOdW1iZXIsXHJcblx0bmFtZToge3R5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWV9LFxyXG5cdGRyb3BDaGFuY2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDEwMH0sXHJcblx0ZHJvcEFtb3VudEVROiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuXHR0aWxlczoge3R5cGU6IFtbW051bWJlcl1dXSwgZGVmYXVsdDogW1tbXV1dfSxcclxuXHRpc1dhbGw6IHt0eXBlOiBbW0Jvb2xlYW5dXSwgZGVmYXVsdDogZmFsc2V9LFxyXG5cdGlzSG9zdGlsZToge3R5cGU6IFtbQm9vbGVhbl1dLCBkZWZhdWx0OiBmYWxzZX0sXHJcblx0ZGFtYWdlOiB7dHlwZTogW1tOdW1iZXJdXSwgZGVmYXVsdDogbnVsbH0sXHJcblx0d2FycE1hcDoge3R5cGU6IFtbTnVtYmVyXV0sIGRlZmF1bHQ6IG51bGx9LFxyXG5cdHdhcnBYOiB7dHlwZTogW1tOdW1iZXJdXSwgZGVmYXVsdDogbnVsbH0sXHJcblx0d2FycFk6IHt0eXBlOiBbW051bWJlcl1dLCBkZWZhdWx0OiBudWxsfVxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1vbmdvb3NlLm1vZGVsKCdNYXAnLCBtYXBTY2hlbWEpO1xyXG4iLCJpbXBvcnQgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xyXG5cclxuY29uc3QgcGxheWVyU2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYSh7XHJcbiAgX2lkOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCxcclxuICBhY2NvdW50OiB7dHlwZTogbW9uZ29vc2UuU2NoZW1hVHlwZXMuT2JqZWN0SWQsIHJlZjogJ0FjY291bnQnLCByZXF1aXJlZDogdHJ1ZX0sXHJcbiAgbmFtZToge3R5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUsIHVuaXF1ZTogdHJ1ZX0sXHJcbiAgdGVtcGxhdGU6IHt0eXBlOiBtb25nb29zZS5TY2hlbWFUeXBlcy5PYmplY3RJZCwgcmVmOiAnUGxheWVyVGVtcGxhdGUnLCByZXF1aXJlZDogdHJ1ZX0sXHJcbiAgbGV2ZWw6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDF9LFxyXG4gIGV4cGVyaWVuY2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG4gIG1hcElkOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuICB4OiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiA1fSxcclxuICB5OiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiA1fSxcclxuICBkaXJlY3Rpb246IHt0eXBlOiBTdHJpbmcsIGRlZmF1bHQ6ICdkb3duJ30sXHJcbiAgYWRtaW5BY2Nlc3M6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG4gIHNwcml0ZTogTnVtYmVyXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWwoJ1BsYXllcicsIHBsYXllclNjaGVtYSk7XHJcbiIsImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XHJcblxyXG5jb25zdCBwbGF5ZXJUZW1wbGF0ZVNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoe1xyXG4gIF9pZDogbW9uZ29vc2UuU2NoZW1hVHlwZXMuT2JqZWN0SWQsXHJcbiAgbmFtZToge3R5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUsIHVuaXF1ZTogdHJ1ZX0sXHJcbiAgc3ByaXRlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuICBkYW1hZ2VCYXNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfSxcclxuICBkZWZlbmNlQmFzZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0sXHJcbiAgaGVhbHRoTWF4QmFzZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMX0sXHJcbiAgZW5lcmd5TWF4QmFzZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMX0sXHJcbiAgaGVhbHRoUmVnZW5CYXNlOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxfSxcclxuICBlbmVyZ3lSZWdlbkJhc2U6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDF9LFxyXG4gIHJhbmdlQmFzZToge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMX0sXHJcbiAgaGVhbHRoUGVyTGV2ZWw6IHt0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDB9LFxyXG4gIGVuZXJneVBlckxldmVsOiB7dHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwfVxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1vbmdvb3NlLm1vZGVsKCdQbGF5ZXJUZW1wbGF0ZScsIHBsYXllclRlbXBsYXRlU2NoZW1hKTtcclxuIiwiaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XHJcbmltcG9ydCBodHRwIGZyb20gJ2h0dHAnO1xyXG5pbXBvcnQgc29ja2V0SU8gZnJvbSAnc29ja2V0LmlvJztcclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcblxyXG5pbXBvcnQgZGIgZnJvbSAnLi9kYi5qcyc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4vZ2FtZS5qcyc7XHJcbmltcG9ydCBjb25maWcgZnJvbSAnLi9jb25maWcuanMnO1xyXG5cclxuY2xhc3MgU2VydmVyIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdGNvbnN0IGFwcCA9IGV4cHJlc3MoKTtcclxuXHRcdGNvbnN0IGh0dHBTZXJ2ZXIgPSBodHRwLlNlcnZlcihhcHApO1xyXG5cdFx0Y29uc3QgaW8gPSBzb2NrZXRJTyhodHRwU2VydmVyKTtcclxuXHRcdGNvbnN0IHBvcnQgPSBwcm9jZXNzLmVudi5QT1JUIHx8IGNvbmZpZy5QT1JUO1xyXG5cdFx0Y29uc3QgcHVibGljUGF0aCA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLi9jbGllbnQnKTtcclxuXHRcdFxyXG5cdFx0YXBwLmdldCgnLycsIChyZXEsIHJlcykgPT4gcmVzLnNlbmRGaWxlKHB1YmxpY1BhdGggKyAnL2luZGV4Lmh0bWwnKSk7XHJcblx0XHRhcHAudXNlKCcvY2xpZW50JywgZXhwcmVzcy5zdGF0aWMocHVibGljUGF0aCkpO1xyXG5cdFx0aHR0cFNlcnZlci5saXN0ZW4ocG9ydCwgKCkgPT4gZGIubG9nKGBTZXJ2ZXIgc3RhcnRlZC4gTGlzdGVuaW5nIG9uIHBvcnQgJHtodHRwU2VydmVyLmFkZHJlc3MoKS5wb3J0fS4uLmApKTtcclxuXHJcblx0XHR0aGlzLnNvY2tldExpc3QgPSB7fTtcclxuXHRcdHRoaXMuYWN0aXZlQWNjb3VudHMgPSB7fTtcclxuXHJcblx0XHRpby5zb2NrZXRzLm9uKCdjb25uZWN0aW9uJywgc29ja2V0ID0+IHRoaXMub25Db25uZWN0KHNvY2tldCkpO1xyXG5cdH1cclxuXHJcblx0LyogY29ubmVjdCA9PiBzaWduaW4gPT4gc2VsZWN0cGxheWVyXHJcblx0KiogY29ubmVjdCB3aGVuIHBhZ2UgbG9hZHMgLSBzaG93cyBzaWduaW4gcGFnZVxyXG5cdCoqIHNpZ25pbiB3aGVuIHVzZXJuYW1lIGFuZCBwYXNzd29yZCBpcyBzdWJtaXR0ZWRcclxuIFx0Kiogc2VsZWN0cGxheWVyIHdoZW4gY2hhcmFjdGVyIGlzIGNob3NlbiAtIGxvZ3MgaW50byB0aGUgZ2FtZVxyXG5cdCovXHJcblxyXG5cdC8vIFJlY2VpdmUgZGF0YSBmcm9tIGNsaWVudHNcclxuXHRvbkNvbm5lY3Qoc29ja2V0KSB7XHJcblx0XHR0aGlzLnNvY2tldExpc3Rbc29ja2V0LmlkXSA9IHNvY2tldDtcclxuXHRcdGRiLmxvZyhgJHtzb2NrZXQuaWR9IC0gU29ja2V0IGNvbm5lY3RlZC5gKTtcclxuXHRcdFxyXG5cdFx0c29ja2V0Lm9uKCdkaXNjb25uZWN0JywgKCkgPT4gdGhpcy5vbkRpc2Nvbm5lY3Qoc29ja2V0KSk7XHJcblx0XHRzb2NrZXQub24oJ3NpZ251cCcsIChkYXRhKSA9PiB0aGlzLm9uU2lnblVwKHNvY2tldCwgZGF0YS51c2VybmFtZSwgZGF0YS5wYXNzd29yZCwgZGF0YS5lbWFpbCkpO1xyXG5cdFx0c29ja2V0Lm9uKCdzaWduaW4nLCAoZGF0YSkgPT4gdGhpcy5vblNpZ25Jbihzb2NrZXQsIGRhdGEudXNlcm5hbWUsIGRhdGEucGFzc3dvcmQpKTtcclxuXHRcdHNvY2tldC5vbignc2lnbm91dCcsICgpID0+IHRoaXMub25TaWduT3V0KHNvY2tldCkpO1xyXG5cdFx0Ly8gVGVsbCBjbGllbnQgdGhleSBoYXZlIGNvbm5lY3RlZFxyXG5cdH1cclxuXHJcblx0YXN5bmMgb25EaXNjb25uZWN0KHNvY2tldCkge1xyXG5cdFx0aWYgKHNvY2tldC5wbGF5ZXJJZCAhPSBudWxsICYmIGdhbWUucGxheWVyc1tzb2NrZXQucGxheWVySWRdKSBhd2FpdCB0aGlzLm9uTG9nT3V0KHNvY2tldCk7XHJcblx0XHRpZiAoc29ja2V0LmFjY291bnRJZCAmJiB0aGlzLmFjdGl2ZUFjY291bnRzW3NvY2tldC5hY2NvdW50SWRdKSBhd2FpdCB0aGlzLm9uU2lnbk91dChzb2NrZXQpO1xyXG5cclxuXHRcdGRiLmxvZyhgJHtzb2NrZXQuaWR9IC0gU29ja2V0IGRpc2Nvbm5lY3RlZC5gKTtcclxuXHRcdGRlbGV0ZSB0aGlzLnNvY2tldExpc3Rbc29ja2V0LmlkXTtcclxuXHR9XHJcblxyXG5cdGFzeW5jIG9uU2lnblVwKHNvY2tldCwgdXNlcm5hbWUsIHBhc3N3b3JkLCBlbWFpbCkge1xyXG5cdFx0bGV0IGFjY291bnRJZCA9IGF3YWl0IGRiLmFkZEFjY291bnQodXNlcm5hbWUsIHBhc3N3b3JkLCBlbWFpbCk7XHJcblx0XHRpZiAoYWNjb3VudElkKSB7XHJcblx0XHRcdGRiLmxvZyhgJHtzb2NrZXQuaWR9IC0gQWNjb3VudCBhZGRlZDogJHt1c2VybmFtZX1gKTtcclxuXHRcdFx0c29ja2V0LmVtaXQoJ3NpZ25lZFVwJywge3VzZXJuYW1lLCBwYXNzd29yZH0pO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHNvY2tldC5lbWl0KCdzaWduZWRVcCcsIG51bGwpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0YXN5bmMgb25TaWduSW4oc29ja2V0LCB1c2VybmFtZSwgcGFzc3dvcmQpIHtcclxuXHRcdGxldCBzdWNjZXNzID0gYXdhaXQgZGIuYXV0aEFjY291bnQodXNlcm5hbWUsIHBhc3N3b3JkKTtcclxuXHRcdGlmICghc3VjY2Vzcykge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhgU2lnbiBpbiBmYWlsZWQgb24gdXNlcm5hbWUgJHt1c2VybmFtZX1gKTtcclxuXHRcdFx0c29ja2V0LmVtaXQoJ3NpZ25lZEluJywgZmFsc2UpO1x0Ly8gVGVsbCBjbGllbnQgc2lnbmluIHdhcyBub3Qgc3VjY2Vzc2Z1bFxyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGFjY291bnQgPSBhd2FpdCBkYi5nZXRBY2NvdW50QnlVc2VybmFtZSh1c2VybmFtZSk7XHJcblx0XHRpZiAodGhpcy5hY3RpdmVBY2NvdW50c1thY2NvdW50Ll9pZF0pIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJUaGF0IGFjY291bnQgaXMgYWxyZWFkeSBzaWduZWQgaW4uXCIpO1xyXG5cdFx0XHRzb2NrZXQuZW1pdCgnc2lnbmVkSW4nLCBmYWxzZSk7XHQvLyBUZWxsIGNsaWVudCB0aGF0IGFjY291bnQgaXMgYWxyZWFkeSBzaWduZWQgaW5cclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRzb2NrZXQuYWNjb3VudElkID0gYWNjb3VudC5faWQ7XHJcblx0XHR0aGlzLmFjdGl2ZUFjY291bnRzW2FjY291bnQuX2lkXSA9IHVzZXJuYW1lO1xyXG5cclxuXHRcdHNvY2tldC5vbignYWRkUGxheWVyJywgKGRhdGEpID0+IHRoaXMub25BZGRQbGF5ZXIoc29ja2V0LCBkYXRhLm5hbWUsIGRhdGEudGVtcGxhdGVJZCkpO1xyXG5cdFx0c29ja2V0Lm9uKCdsb2dpbicsIChuYW1lKSA9PiB0aGlzLm9uTG9nSW4oc29ja2V0LCBuYW1lKSk7XHJcblx0XHRzb2NrZXQub24oJ2xvZ291dCcsICgpID0+IHRoaXMub25Mb2dPdXQoc29ja2V0KSk7XHJcblx0XHRzb2NrZXQub24oJ2FkZFBsYXllclRlbXBsYXRlJywgKGRhdGEpID0+IHRoaXMub25BZGRQbGF5ZXJUZW1wbGF0ZShkYXRhKSk7XHJcblxyXG5cdFx0ZGIubG9nKGAke3NvY2tldC5pZH0gLSAke3VzZXJuYW1lfSBzaWduZWQgaW4uYCk7XHJcblx0XHRsZXQgcGxheWVycyA9IGF3YWl0IGRiLmdldFBsYXllcnNCeUFjY291bnQoYWNjb3VudC5faWQpO1xyXG5cdFx0bGV0IHBsYXllclRlbXBsYXRlcyA9IGF3YWl0IGRiLmdldEFsbFBsYXllclRlbXBsYXRlcygpO1xyXG5cdFx0c29ja2V0LmVtaXQoJ3NpZ25lZEluJywge2FjY291bnQsIHBsYXllcnMsIHBsYXllclRlbXBsYXRlc30pO1xyXG5cdH1cclxuXHRcclxuXHRhc3luYyBvblNpZ25PdXQoc29ja2V0KSB7XHJcblx0XHRpZiAoc29ja2V0LnBsYXllcklkICE9IG51bGwpIGF3YWl0IHRoaXMub25Mb2dPdXQoc29ja2V0KTtcclxuXHRcdFxyXG5cdFx0aWYgKHNvY2tldC5hY2NvdW50SWQpIHtcclxuXHRcdFx0Y29uc3QgdXNlcm5hbWUgPSB0aGlzLmFjdGl2ZUFjY291bnRzW3NvY2tldC5hY2NvdW50SWRdO1xyXG5cdFx0XHRkYi5sb2coYCR7c29ja2V0LmlkfSAtICR7dXNlcm5hbWV9IHNpZ25lZCBvdXQuYCk7XHJcblx0XHRcdGRlbGV0ZSB0aGlzLmFjdGl2ZUFjY291bnRzW3NvY2tldC5hY2NvdW50SWRdO1xyXG5cdFx0XHRzb2NrZXQuYWNjb3VudElkID0gbnVsbDtcclxuXHRcdFx0c29ja2V0LmVtaXQoJ3NpZ25lZE91dCcpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0YXN5bmMgb25BZGRQbGF5ZXIoc29ja2V0LCBuYW1lLCB0ZW1wbGF0ZUlkKSB7XHJcblx0XHRsZXQgcGxheWVySWQgPSBhd2FpdCBkYi5hZGRQbGF5ZXIoc29ja2V0LmFjY291bnRJZCwgbmFtZSwgdGVtcGxhdGVJZCk7XHJcblx0XHRpZiAocGxheWVySWQpIHtcclxuXHRcdFx0Y29uc3QgdXNlcm5hbWUgPSB0aGlzLmFjdGl2ZUFjY291bnRzW3NvY2tldC5hY2NvdW50SWRdO1xyXG5cdFx0XHRkYi5sb2coYCR7c29ja2V0LmlkfSAtICR7bmFtZX0gaGFzIGJlZW4gYWRkZWQgYXMgYSBwbGF5ZXIgdG8gYWNjb3VudCAke3VzZXJuYW1lfS5gKTtcclxuXHRcdFx0c29ja2V0LmVtaXQoJ3BsYXllckFkZGVkJywgcGxheWVySWQpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHNvY2tldC5lbWl0KCdwbGF5ZXJBZGRlZCcsIG51bGwpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRhc3luYyBvbkFkZFBsYXllclRlbXBsYXRlKGRhdGEpIHtcclxuXHRcdGxldCBzdWNjZXNzID0gYXdhaXQgZGIuYWRkUGxheWVyVGVtcGxhdGUoZGF0YSk7XHJcblx0XHRpZiAoc3VjY2Vzcykge1xyXG5cdFx0XHRnYW1lLmxvYWRQbGF5ZXJUZW1wbGF0ZXMoKTtcclxuXHRcdFx0ZGIubG9nKGAke3NvY2tldC5pZH0gLSAke2RhdGEubmFtZX0gaGFzIGJlZW4gYWRkZWQgYXMgYSBwbGF5ZXIgdGVtcGxhdGUuYCk7XHJcblx0XHRcdC8vIFRlbGwgY2xpZW50IGFkZCBwbGF5ZXIgd2FzIHN1Y2Nlc3NmdWxcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHQvLyBUZWxsIGNsaWVudCBhZGQgcGxheWVyIHdhcyBub3Qgc3VjY2Vzc2Z1bFxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0YXN5bmMgb25Mb2dJbihzb2NrZXQsIHBsYXllcklkKSB7XHJcblx0XHRpZiAoIXNvY2tldC5hY2NvdW50SWQpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJOb3Qgc2lnbmVkIGludG8gYWNjb3VudC5cIik7XHJcblx0XHRcdHNvY2tldC5lbWl0KCdsb2dnZWRJbicsIGZhbHNlKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHNvY2tldC5wbGF5ZXJJZCAhPSBudWxsKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiQWxyZWFkeSBsb2dnZWQgaW4uXCIpO1xyXG5cdFx0XHRzb2NrZXQuZW1pdCgnbG9nZ2VkSW4nLCBmYWxzZSk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgcGxheWVyRGF0YSA9IGF3YWl0IGRiLmdldFBsYXllcihwbGF5ZXJJZCk7XHJcblx0XHRpZiAoIXBsYXllckRhdGEpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJObyBwbGF5ZXIgd2l0aCB0aGF0IG5hbWUuXCIpO1xyXG5cdFx0XHRzb2NrZXQuZW1pdCgnbG9nZ2VkSW4nLCBmYWxzZSk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoXCJcIitzb2NrZXQuYWNjb3VudElkICE9PSBcIlwiK3BsYXllckRhdGEuYWNjb3VudCkge1x0Ly8gQ2FzdCB0byBzdHJpbmcgYmVmb3JlIGNvbXBhcmlzb25cclxuXHRcdFx0ZGIubG9nKGBBdHRlbXB0IHRvIGxvZ2luIHRvIHBsYXllciAoJHtwbGF5ZXJEYXRhLm5hbWV9KSBmcm9tIHdyb25nIGFjY291bnQgKCR7c29ja2V0LmFjY291bnRJZH0pIG9uIHNvY2tldCAke3NvY2tldC5pZH0uYCk7XHJcblx0XHRcdHNvY2tldC5lbWl0KCdsb2dnZWRJbicsIGZhbHNlKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHBsYXllciA9IGdhbWUucGxheWVyTG9naW4oc29ja2V0LmlkLCBwbGF5ZXJEYXRhKTtcclxuXHRcdGlmICghcGxheWVyKSB7XHJcblx0XHRcdHNvY2tldC5lbWl0KCdsb2dnZWRJbicsIGZhbHNlKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFxyXG5cdFx0c29ja2V0LnBsYXllcklkID0gcGxheWVyLmdhbWVJZDtcclxuXHRcdHNvY2tldC5vbignaW5wdXQnLCAoZGF0YSkgPT4gcGxheWVyLmlucHV0RGF0YShkYXRhKSk7XHJcblx0XHRzb2NrZXQub24oJ3VwbG9hZE1hcCcsIChkYXRhKSA9PiB7XHJcblx0XHRcdGlmIChwbGF5ZXIuYWRtaW5BY2Nlc3MgPj0gMikgdGhpcy5vblVwbG9hZE1hcChkYXRhKTtcclxuXHRcdFx0ZWxzZSBnYW1lLnNlbmRHYW1lSW5mb1BsYXllcihwbGF5ZXIuZ2FtZUlkLCBgWW91IGRvbid0IGhhdmUgYWNjZXNzIHRvIHRoYXQgY29tbWFuZC5gKTtcclxuXHRcdH0pO1xyXG5cdFx0Y29uc3QgbWFwRGF0YSA9IGdhbWUubWFwc1twbGF5ZXIubWFwSWRdLmdldFBhY2soKTtcclxuXHRcdHNvY2tldC5lbWl0KCdsb2dnZWRJbicsIG1hcERhdGEpO1xyXG5cdH1cclxuXHRcclxuXHRhc3luYyBvbkxvZ091dChzb2NrZXQpIHtcclxuXHRcdGlmIChzb2NrZXQucGxheWVySWQgIT0gbnVsbCkge1xyXG5cdFx0XHRhd2FpdCBnYW1lLnBsYXllckxvZ291dChzb2NrZXQucGxheWVySWQpO1xyXG5cdFx0XHRzb2NrZXQucGxheWVySWQgPSBudWxsO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRhc3luYyBvblVwbG9hZE1hcChkYXRhKSB7XHJcblx0XHRsZXQgc3VjY2VzcyA9IGF3YWl0IGRiLnNhdmVNYXAoZGF0YSk7XHJcblx0XHRpZiAoIXN1Y2Nlc3MpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJGYWlsZWQgdG8gdXBsb2FkIG1hcC5cIik7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdGdhbWUubWFwc1tkYXRhLm1hcElkXS51cGxvYWQoZGF0YSk7XHJcblx0XHRcclxuXHRcdGdhbWUucGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcclxuXHRcdFx0aWYgKHBsYXllci5tYXBJZCA9PT0gZGF0YS5tYXBJZCkge1xyXG5cdFx0XHRcdHRoaXMuc2VuZE1hcERhdGEodGhpcy5zb2NrZXRMaXN0W3BsYXllci5zb2NrZXRJZF0sIHBsYXllci5tYXBJZCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0Ly8gU2VuZCBkYXRhIHRvIGNsaWVudHNcclxuXHRzZW5kVXBkYXRlUGFjayh1cGRhdGVQYWNrKSB7XHJcblx0XHRnYW1lLnBsYXllcnMuZm9yRWFjaChwbGF5ZXIgPT4ge1xyXG5cdFx0XHRjb25zdCBwYWNrID0ge1xyXG5cdFx0XHRcdGdhbWU6IHtcclxuXHRcdFx0XHRcdHBsYXllcnM6IFtdLFxyXG5cdFx0XHRcdFx0Ym90czogW10sXHJcblx0XHRcdFx0XHRpdGVtczogW10sXHJcblx0XHRcdFx0XHRlZmZlY3RzOiBbXSxcclxuXHRcdFx0XHRcdHRleHRzOiBbXVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0bWVudTogcGxheWVyLmdldFVJUGFjaygpLFxyXG5cdFx0XHRcdGNoYXRib3g6IHt9XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRmb3IgKGxldCBwbGF5ZXJEYXRhIG9mIHVwZGF0ZVBhY2sucGxheWVycykge1xyXG5cdFx0XHRcdGlmIChwbGF5ZXJEYXRhICYmICgocGxheWVyRGF0YS5tYXBJZCA9PT0gcGxheWVyLm1hcElkICYmIHBsYXllckRhdGEuaXNWaXNpYmxlKSB8fCBwbGF5ZXJEYXRhLnNvY2tldElkID09PSBwbGF5ZXIuc29ja2V0SWQpKSB7XHJcblx0XHRcdFx0XHRwYWNrLmdhbWUucGxheWVyc1twbGF5ZXJEYXRhLmdhbWVJZF0gPSBwbGF5ZXJEYXRhO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRmb3IgKGxldCBib3Qgb2YgdXBkYXRlUGFjay5ib3RzKSB7XHJcblx0XHRcdFx0aWYgKGJvdCAmJiBib3QubWFwSWQgPT09IHBsYXllci5tYXBJZCkgcGFjay5nYW1lLmJvdHNbYm90LmdhbWVJZF0gPSBib3Q7XHJcblx0XHRcdH1cclxuXHRcdFx0Zm9yIChsZXQgaXRlbSBvZiB1cGRhdGVQYWNrLml0ZW1zKSB7XHJcblx0XHRcdFx0aWYgKGl0ZW0gJiYgaXRlbS5tYXBJZCA9PT0gcGxheWVyLm1hcElkKSBwYWNrLmdhbWUuaXRlbXNbaXRlbS5nYW1lSWRdID0gaXRlbTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmb3IgKGxldCBlZmZlY3Qgb2YgdXBkYXRlUGFjay5lZmZlY3RzKSB7XHJcblx0XHRcdFx0aWYgKGVmZmVjdCAmJiBlZmZlY3QubWFwSWQgPT09IHBsYXllci5tYXBJZCkgcGFjay5nYW1lLmVmZmVjdHNbZWZmZWN0LmdhbWVJZF0gPSBlZmZlY3Q7XHJcblx0XHRcdH1cclxuXHRcdFx0Zm9yIChsZXQgdGV4dCBvZiB1cGRhdGVQYWNrLnRleHRzKSB7XHJcblx0XHRcdFx0aWYgKHRleHQgJiYgdGV4dC5tYXBJZCA9PT0gcGxheWVyLm1hcElkKSBwYWNrLmdhbWUudGV4dHNbdGV4dC5nYW1lSWRdID0gdGV4dDtcclxuXHRcdFx0fVxyXG5cclxuXHJcbi8qIFx0XHRcdHBhY2suZ2FtZS5wbGF5ZXJzID0gdXBkYXRlUGFjay5wbGF5ZXJzLmZpbHRlcihwbGF5ZXJEYXRhID0+IHBsYXllckRhdGEuc29ja2V0SWQgPT09IHBsYXllci5zb2NrZXRJZCB8fCAocGxheWVyRGF0YS5tYXBJZCA9PT0gcGxheWVyLm1hcElkICYmIHBsYXllckRhdGEuaXNWaXNpYmxlKSk7XHJcblx0XHRcdHBhY2suZ2FtZS5ib3RzID0gdXBkYXRlUGFjay5ib3RzLmZpbHRlcihib3QgPT4gYm90Lm1hcElkID09PSBwbGF5ZXIubWFwSWQpO1xyXG5cdFx0XHRwYWNrLmdhbWUuaXRlbXMgPSB1cGRhdGVQYWNrLml0ZW1zLmZpbHRlcihpdGVtID0+IGl0ZW0ubWFwSWQgPT09IHBsYXllci5tYXBJZCk7XHJcblx0XHRcdHBhY2suZ2FtZS5lZmZlY3RzID0gdXBkYXRlUGFjay5lZmZlY3RzLmZpbHRlcihlZmZlY3QgPT4gZWZmZWN0Lm1hcElkID09PSBwbGF5ZXIubWFwSWQpO1xyXG5cdFx0XHRwYWNrLmdhbWUudGV4dHMgPSB1cGRhdGVQYWNrLnRleHRzLmZpbHRlcih0ZXh0ID0+IHRleHQubWFwSWQgPT09IHBsYXllci5tYXBJZCk7ICovXHJcblxyXG5cdFx0XHRwYWNrLmNoYXRib3gubWVzc2FnZXMgPSB1cGRhdGVQYWNrLm1lc3NhZ2VzLmZpbHRlcihtZXNzYWdlID0+IHtcclxuXHRcdFx0XHRyZXR1cm4gKG1lc3NhZ2UubWFwSWQgPT0gbnVsbCAmJiBtZXNzYWdlLmlkID09IG51bGwpIHx8IHBsYXllci5tYXBJZCA9PT0gbWVzc2FnZS5tYXBJZCB8fCBwbGF5ZXIuZ2FtZUlkID09PSBtZXNzYWdlLmlkO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0XHJcblx0XHRcdHRoaXMuc29ja2V0TGlzdFtwbGF5ZXIuc29ja2V0SWRdLmVtaXQoJ3VwZGF0ZScsIHBhY2spO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdFxyXG5cdHNlbmRNYXBEYXRhKHNvY2tldCwgbWFwSWQpIHtcclxuXHRcdGNvbnN0IG1hcERhdGEgPSBnYW1lLm1hcHNbbWFwSWRdLmdldFBhY2soKTtcclxuXHRcdHNvY2tldC5lbWl0KCdsb2FkTWFwJywgbWFwRGF0YSk7XHJcblx0fVxyXG59XHJcblxyXG5jb25zdCBzZXJ2ZXIgPSBuZXcgU2VydmVyKCk7XHJcbmV4cG9ydCBkZWZhdWx0IHNlcnZlcjtcclxuIiwiZnVuY3Rpb24gY3JlYXRlMmRBcnJheShjb2x1bW5zLCByb3dzLCBkZWZhdWx0VmFsdWUpIHtcclxuICBjb25zdCBhcnJheSA9IFtdO1xyXG4gIGZvciAobGV0IHkgPSAwOyB5IDwgcm93czsgeSsrKSB7XHJcbiAgICBhcnJheVt5XSA9IFtdO1xyXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCBjb2x1bW5zOyB4KyspIHtcclxuICAgICAgYXJyYXlbeV1beF0gPSBkZWZhdWx0VmFsdWU7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBhcnJheTtcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlM2RBcnJheShjb2x1bW5zLCByb3dzLCBsYXllcnMsIGRlZmF1bHRWYWx1ZSkge1xyXG4gIGNvbnN0IGFycmF5ID0gW107XHJcbiAgZm9yIChsZXQgeiA9IDA7IHogPCBsYXllcnM7IHorKykge1xyXG4gICAgYXJyYXlbel0gPSBbXTsgXHJcbiAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHJvd3M7IHkrKykge1xyXG4gICAgICBhcnJheVt6XVt5XSA9IFtdO1xyXG4gICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IGNvbHVtbnM7IHgrKykge1xyXG4gICAgICAgIGFycmF5W3pdW3ldW3hdID0gZGVmYXVsdFZhbHVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBhcnJheTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2h1ZmZsZShhcnJheSkge1xyXG4gIGxldCBjdXJyZW50SW5kZXggPSBhcnJheS5sZW5ndGg7XHJcbiAgbGV0IHRlbXA7XHJcbiAgbGV0IHJhbmRvbUluZGV4O1xyXG4gIHdoaWxlIChjdXJyZW50SW5kZXggIT09IDApIHtcclxuICAgIHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY3VycmVudEluZGV4KTtcclxuICAgIGN1cnJlbnRJbmRleCAtPSAxO1xyXG4gICAgdGVtcCA9IGFycmF5W2N1cnJlbnRJbmRleF07XHJcbiAgICBhcnJheVtjdXJyZW50SW5kZXhdID0gYXJyYXlbcmFuZG9tSW5kZXhdO1xyXG4gICAgYXJyYXlbcmFuZG9tSW5kZXhdID0gdGVtcDtcclxuICB9XHJcbiAgcmV0dXJuIGFycmF5O1xyXG59XHJcblxyXG5mdW5jdGlvbiBzd2FwKGFycmF5LCBpLCBqKSB7XHJcbiAgY29uc3QgdGVtcCA9IGFycmF5W2ldO1xyXG4gIGFycmF5W2ldID0gYXJyYXlbal07XHJcbiAgYXJyYXlbal0gPSB0ZW1wO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmaXJzdEVtcHR5SW5kZXgoYXJyYXkpIHtcclxuICBpZiAoYXJyYXkubGVuZ3RoIDwgMSkgcmV0dXJuIDA7XHJcbiAgXHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPD0gYXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgIGlmIChhcnJheVtpXSA9PSBudWxsKSByZXR1cm4gaTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxlcnAoc3RhcnQsIGVuZCwgdGltZSkge1xyXG4gIC8vcmV0dXJuIHN0YXJ0ICsgKHRpbWUgKiAoZW5kIC0gc3RhcnQpKTtcclxuICByZXR1cm4gKCgxIC0gdGltZSkgKiBzdGFydCkgKyAodGltZSAqIGVuZCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNsYW1wKHZhbHVlLCBtaW5pbXVtLCBtYXhpbXVtKSB7XHJcbiAgaWYgKHZhbHVlIDwgbWluaW11bSkge1xyXG4gICAgcmV0dXJuIG1pbmltdW07XHJcbiAgfVxyXG4gIGVsc2UgaWYgKHZhbHVlID4gbWF4aW11bSkge1xyXG4gICAgcmV0dXJuIG1heGltdW07XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gcmFuZG9tSW50KG1pbmltdW0sIG1heGltdW0pIHtcclxuICByZXR1cm4gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIChtYXhpbXVtICsgMSkpICsgbWluaW11bSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFhGcm9tSW5kZXgoaW5kZXgsIGNvbHVtbnMpIHtcclxuICByZXR1cm4gaW5kZXggJSBjb2x1bW5zO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRZRnJvbUluZGV4KGluZGV4LCBjb2x1bW5zKSB7XHJcbiAgcmV0dXJuIChpbmRleCAtIChpbmRleCAlIGNvbHVtbnMpKSAvIGNvbHVtbnM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEluZGV4RnJvbVhZKHgsIHksIGNvbHVtbnMpIHtcclxuICByZXR1cm4gKHkgKiBjb2x1bW5zKSArIHg7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRpbWVzdGFtcChkYXRlKSB7XHJcbiAgaWYgKCEoZGF0ZSBpbnN0YW5jZW9mIERhdGUpKSByZXR1cm4gXCJJbnZhbGlkIGRhdGVcIjtcclxuICBsZXQgbW9udGggPSBkYXRlLmdldE1vbnRoKCkgKyAxO1xyXG4gIGxldCBkYXkgPSBkYXRlLmdldERhdGUoKTtcclxuICBsZXQgaG91ciA9IGRhdGUuZ2V0SG91cnMoKTtcclxuICBsZXQgbWludXRlID0gZGF0ZS5nZXRNaW51dGVzKCk7XHJcbiAgbGV0IHNlY29uZCA9IGRhdGUuZ2V0U2Vjb25kcygpO1xyXG4gIGlmIChtb250aCA8IDEwKSBtb250aCA9IFwiMFwiICsgbW9udGg7XHJcbiAgaWYgKGRheSA8IDEwKSBkYXkgPSBcIjBcIiArIGRheTtcclxuICBpZiAoaG91ciA8IDEwKSBob3VyID0gXCIwXCIgKyBob3VyO1xyXG4gIGlmIChtaW51dGUgPCAxMCkgbWludXRlID0gXCIwXCIgKyBtaW51dGU7XHJcbiAgaWYgKHNlY29uZCA8IDEwKSBzZWNvbmQgPSBcIjBcIiArIHNlY29uZDtcclxuICByZXR1cm4gYCR7ZGF0ZS5nZXRGdWxsWWVhcigpfS0ke21vbnRofS0ke2RheX0gJHtob3VyfToke21pbnV0ZX06JHtzZWNvbmR9YDtcclxufVxyXG5cclxuZnVuY3Rpb24gaW5kZWZpbml0ZUFydGljbGUod29yZCkge1xyXG5cdGxldCByZWdleCA9IC90cm91c2VycyR8amVhbnMkfGdsYXNzZXMkL2k7XHJcblx0aWYgKHdvcmQubWF0Y2gocmVnZXgpKSByZXR1cm4gXCJhIHBhaXIgb2YgXCIgKyB3b3JkO1xyXG5cclxuXHRyZWdleCA9IC9eW2FlaW91XS9pO1xyXG5cdGlmICh3b3JkLm1hdGNoKHJlZ2V4KSkgcmV0dXJuIFwiYW4gXCIgKyB3b3JkO1xyXG5cclxuXHRyZXR1cm4gXCJhIFwiICsgd29yZDtcclxufVxyXG5cclxuZnVuY3Rpb24gcGx1cmFsKHdvcmQpIHtcclxuXHRsZXQgcmVnZXggPSAvc2hlZXAkfGRlZXIkfGZpc2gkL2k7XHJcblx0aWYgKHdvcmQubWF0Y2gocmVnZXgpKSByZXR1cm4gd29yZDtcclxuXHJcblx0cmVnZXggPSAvdHJvdXNlcnMkfGplYW5zJHxnbGFzc2VzJC9pO1xyXG5cdGlmICh3b3JkLm1hdGNoKHJlZ2V4KSkgcmV0dXJuIFwicGFpcnMgb2YgXCIgKyB3b3JkO1xyXG5cdFxyXG5cdHJlZ2V4ID0gL3N0b21hY2gkfGVwb2NoJHwvaTtcclxuXHRpZiAod29yZC5tYXRjaChyZWdleCkpIHJldHVybiB3b3JkICsgXCJzXCI7XHJcblx0XHJcblx0cmVnZXggPSAvZiR8ZmUkL2k7XHJcblx0aWYgKHdvcmQubWF0Y2gocmVnZXgpKSByZXR1cm4gd29yZC5yZXBsYWNlKHJlZ2V4LCBcInZlc1wiKTtcclxuXHJcblx0cmVnZXggPSAvW3N4el0kfGNoJHxzaCR8YXRvJC9pO1xyXG5cdGlmICh3b3JkLm1hdGNoKHJlZ2V4KSkgcmV0dXJuIHdvcmQgKyBcImVzXCI7XHJcblx0XHJcblx0cmVnZXggPSAveSQvaTtcclxuXHRpZiAod29yZC5tYXRjaChyZWdleCkpIHJldHVybiB3b3JkLnJlcGxhY2UocmVnZXgsIFwiaWVzXCIpO1xyXG5cdFxyXG5cdHJldHVybiB3b3JkICsgXCJzXCI7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBjcmVhdGUyZEFycmF5LFxyXG4gIGNyZWF0ZTNkQXJyYXksXHJcbiAgc2h1ZmZsZSxcclxuICBzd2FwLFxyXG4gIGZpcnN0RW1wdHlJbmRleCxcclxuICBsZXJwLFxyXG4gIGNsYW1wLFxyXG4gIHJhbmRvbUludCxcclxuICBnZXRYRnJvbUluZGV4LFxyXG4gIGdldFlGcm9tSW5kZXgsXHJcbiAgZ2V0SW5kZXhGcm9tWFksXHJcbiAgdGltZXN0YW1wLFxyXG4gIGluZGVmaW5pdGVBcnRpY2xlLFxyXG4gIHBsdXJhbFxyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJiY3J5cHRcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJmc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJodHRwXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm1vbmdvb3NlXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm5vZGUtZ2FtZWxvb3BcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJzb2NrZXQuaW9cIik7Il0sInNvdXJjZVJvb3QiOiIifQ==
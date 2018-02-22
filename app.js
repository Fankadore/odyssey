'use strict';

const mongojs = require("mongojs");
const db = mongojs('localhost:27017/odyssey', ['accounts', 'maps']);

db.accounts.find({username: "fankadore", password: "123"}, function(err, res) {
	if (res.length) {
		for (let i = 0; i < res.length; i++) {
			console.log(res[i].username);
		}
	}
	else {
		console.log("Player not found");
	}
});

const fs = require('fs');

// Global Constants
const FRAMERATE = 60;
const TILE_SIZE = 32;
const SLOT_SIZE = TILE_SIZE + 6;

const MAP_LAYERS = 6;
const MAP_COLUMNS = 12;
const MAP_ROWS = 12;

const MAX_MAPS = 10;
const MAX_USERS = 100;
const MAX_SPRITES = 13;
const MAX_EFFECTS = 70;

const INVENTORY_SIZE = 20;
const EQUIPMENT_SIZE = 5;	

const START_MAP = 1;
const START_X = 5;
const START_Y = 5;


// Global Functions
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

function lerp(start, end, time) {
	//return start + (time * (end - start));
	return ((1 - time) * start) + (time * end);
}

function clamp(value, min, max) {
	if (value < min) {
		return min;
	}
	else if (value > max) {
		return max;
	}
	else {
		return value;
	}
}


// This should be held in a database
const items = [
	{	// type 0
		name: "Blank Item",
		sprite: 68,
		type: 'none',
		reusable: false,
		
		use:		function() {
						return true;
					},
		get:		function() {
						return true;
					},
		drop:	function() {
						return true;
					},
	},
	{	// type 1
		name: "Health Potion",
		sprite: 1,
		type: 'potion',
		reusable: false,
		
		use:		function() {
						let value = 10;
						this.health += value;
						new FloatText(this.gridPosition.x, this.gridPosition.y, value, "#00FF00");
						if (this.health > this.healthMax) {
							this.health = this.healthMax;
						}
						return true;
					},
		get:		function() {
						return true;
					},
		drop:	function() {
						return true;
					},
	}, 
	{	// type 2
		name: "Energy Potion",
		sprite: 2,
		type: 'potion',
		reusable: false,
		
		use:		function() {
						let value = 10;
						this.energy += value;
						new FloatText(this.gridPosition.x, this.gridPosition.y, value, "#FFFF00");
						if (this.energy > this.energyMax) {
							this.energy = this.energyMax;
						}
						return true;
					},
		get:		function() {
						return true;
					},
		drop:	function() {
						return true;
					},
	}, 
	{	// type 3
		name: "Incognito",
		sprite: 12,
		type: 'special',
		reusable: true,
		
		use:		function() {
						this.setSprite(game.rnd.integerInRange(1, MAX_SPRITES));
						return true;
					},
		get:		function() {
						return true;
					},
		drop:	function() {
						return true;
					},
	},
	{	// type 4
		name: "Sword",
		sprite: 10,
		type: 'weapon',
		reusable: true,
		
		use:		function() {
						return true;
					},
		get:		function() {
						return true;
					},
		drop:	function() {
						return true;
					},
		
		damageBonus: 1,
		defenceBonus: 0,
		healthMaxBonus: 0,
		energyMaxBonus: 0,
		rangeBonus: 0,
		
	},
	{	// type 5
		name: "Axe",
		sprite: 14,
		type: 'weapon',
		reusable: true,
		
		use:		function() {
						return true;
					},
		get:		function() {
						return true;
					},
		drop:	function() {
						return true;
					},
		
		damageBonus: 2,
		defenceBonus: 0,
		healthMaxBonus: 0,
		energyMaxBonus: 0,
		rangeBonus: 0,
		
	},
	
];

const maps = [
	{	// id 0
		name: "Blank Map",
		dropChance: 100,
		dropAmountEQ: 0,
		join:		function() {
						return true;
					},
		leave:	function() {
						return true;
					},
	},
	{	// id 1
		name: "Crendale 1",
		dropChance: 100,
		dropAmountEQ: 0,
		join:		function() {
						return true;
					},
		leave:	function() {
						return true;
					},
	},
	{	// id 2
		name: "Crendale 2",
		dropChance: 100,
		dropAmountEQ: 0,
		join:		function() {
						return true;
					},
		leave:	function() {
						return true;
					},
	},
	{	// id 3
		name: "Crendale 3",
		dropChance: 100,
		dropAmountEQ: 0,
		join:		function() {
						return true;
					},
		leave:	function() {
						return true;
					},
	},
	{	// id 4
		name: "Crendale 4",
		dropChance: 100,
		dropAmountEQ: 0,
		join:		function() {
						return true;
					},
		leave:	function() {
						return true;
					},
	},
	{	// id 5
		name: "Crendale 5",
		dropChance: 100,
		dropAmountEQ: 0,
		join:		function() {
						return true;
					},
		leave:	function() {
						return true;
					},
	},
	{	// id 6
		name: "Crendale 6",
		dropChance: 100,
		dropAmountEQ: 0,
		join:		function() {
						return true;
					},
		leave:	function() {
						return true;
					},
	},
	{	// id 7
		name: "Crendale 7",
		dropChance: 100,
		dropAmountEQ: 0,
		join:		function() {
						return true;
					},
		leave:	function() {
						return true;
					},
	},
	{	// id 8
		name: "Crendale 8",
		dropChance: 100,
		dropAmountEQ: 0,
		join:		function() {
						return true;
					},
		leave:	function() {
						return true;
					},
	},
	{	// id 9
		name: "Crendale 9",
		dropChance: 100,
		dropAmountEQ: 0,
		join:		function() {
						return true;
					},
		leave:	function() {
						return true;
					},
	},
];

const players = [
	{	//id 0
		name: "Fankadore",
		sprite: 1,
		map: 1,
		x: 3,
		y: 3,
	},
	{	//id 1
		name: "Obbitt",
		sprite: 3,
		map: 1,
		x: 4,
		y: 4,
	},
	{	//id 2
		name: "Frolik",
		sprite: 5,
		map: 1,
		x: 5,
		y: 5,
	},
   ];

const bots = [
	{	//id 0
		name: "Rat",
		sprite: 0,
		damage: 1,
		healthMax: 3,
	},
	{	//id 1
		name: "Snake",
		sprite: 1,
		damage: 2,
		healthMax: 5,
	},
];


class Tile {
	constructor(mapData, x, y) {
		this.layer = [];
		for (let i = 0; i < MAP_LAYERS; i++) {
			this.layer[i] = mapData.tiles[i][(y * MAP_COLUMNS) + x];
		}
		
		this.wall = mapData.walls[(y * MAP_COLUMNS) + x];
		this.canAttack = false;
		this.healthMax = 0;
		this.health = this.healthMax;
		this.defence = 0;

		this.warpMap = 0;
		this.warpX = 0;
		this.warpY = 0;

		this.walkScript = function() {
			// Run MapWalk#_x_y script
		};
		this.clickScript = function() {
			// Run MapClick#_x_y script
		};
		this.attackScript = function() {
			// Run MapAttack#_x_y script
		};
		
	}
	
}

class Map {
	constructor(id) {
		this.id = id;
		let data = Map.data[this.id];

		this.name = data.name;
		this.dropChance = clamp(data.dropChance, 0, 100);
		//this.dropChance = 0 = 0% chance to drop items in inventory (drop nothing), 100 = 100% chance to drop (drop everything)
		this.dropAmountEQ = clamp(data.dropAmountEQ, 0, EQUIPMENT_SIZE);
		//this.dropAmountEQ = number of equipped items the player will drop on death. dropEQ = EQUIPMENT_SIZE = drop all equipment
		
		this.items = data.items;
		this.bots = data.bots;
		this.effects = data.effects;
		this.texts = data.texts;
		
		this.tiles = [];
		for (let y = 0; y < MAP_COLUMNS; y++) {
			this.tiles[y] = [];
			for (let x = 0; x < MAP_ROWS; x++) {
				this.tiles[y][x] = new Tile(data, x, y);
			}
		}
		
		this.initPack = {players: [], items: [], bots: [], effects: [], texts: []};
		this.removePack = {players: [], items: [], bots: [], effects: [], texts: []};
		Map.list[this.id] = this;
	}
	
	upload() {
		Map.data[this.id] = JSON.parse(fs.readFileSync('./server/data/map.json', 'utf8'))[this.id];
		for (let y = 0; y < MAP_ROWS; y++) {
			for (let x = 0; x < MAP_COLUMNS; x++) {
				let tile = this.tiles[y][x];
				for (let i = 0; i < MAP_LAYERS; i++) {
					tile.layer[i] = Map.data[this.id].tiles[i][(y * MAP_COLUMNS) + x];
				}
			}
		}
		for (let i in Player.list) {
			let player = Player.list[i];
			if (player.map === this.id) {
				player.loadMap();
			}
		}
	}
	
	update() {
		let mapPack = {
			name: this.name,
			items: [],
			bots: [],
			effects: [],
			texts: []
		};
		
		for (let i in this.items) {
			mapPack.items.push(this.items[i].update());
		}
		for (let i in this.bots) {
			mapPack.bots.push(this.bots[i].update());
		}
		for (let i in this.effects) {
			mapPack.effects.push(this.effects[i].update());
		}
		for (let i in this.texts) {
			mapPack.texts[i].push(this.texts[i].update());
		}
		
		return mapPack;
	}
	
	getPack() {
		let mapPack = {
			name: this.name,
			tiles: this.getTilePack(),
			items: [],
			bots: [],
			effects: [],
			texts: []
		};
		
		for (let i in this.items) {
			mapPack.items.push(this.items[i].getPack());
		}
		for (let i in this.bots) {
			mapPack.bots.push(this.bots[i].getPack());
		}
		for (let i in this.effects) {
			mapPack.effects.push(this.effects[i].getPack());
		}
		for (let i in this.texts) {
			mapPack.texts.push(this.texts[i].getPack());
		}
		
		return mapPack;
	}
	
	getTilePack() {
		let tilePack = [];
		for (let i = 0; i < MAP_LAYERS; i++) {
			tilePack[i] = [];
		}
		
		for (let y = 0; y < MAP_ROWS; y++) {
			for (let x = 0; x < MAP_COLUMNS; x++) {
				for (let i = 0; i < MAP_LAYERS; i++) {
					tilePack[i][(y * MAP_COLUMNS) + x] = this.tiles[y][x].layer[i];
				}
			}
		}
		
		return tilePack;
	}
	
	static updateAll() {
		let allMapPack = [];
		for (let i in Map.list) {
			allMapPack[i] = Map.list[i].update();
		}
		return allMapPack;
	}
}

Map.list = {};

Map.data = JSON.parse(fs.readFileSync('./server/data/map.json', 'utf8'));

class Entity {
	constructor(map, x, y, sprite) {
		this.map = map;
		this.gridPosition = {
			x,
			y
		};
		this.x = this.gridPosition.x * TILE_SIZE;
		this.y = this.gridPosition.y * TILE_SIZE;
		if (sprite < 0) {
			sprite = 0;
		}
		this.sprite = sprite;
	}
}

class Actor extends Entity {
	constructor(map, x, y, name, sprite) {
		if (sprite < 1 || sprite > MAX_SPRITES) {
			sprite = 1;
		}
		super(map, x, y, sprite);
		this.name = name;
		
		this.startPosition = {
			x: this.gridPosition.x,
			y: this.gridPosition.y
		};
		this.destination = {
			x: this.gridPosition.x,
			y: this.gridPosition.y
		};	
		this.isMoving = false;
		this.isRunning = false;
		this.direction = 'down';
		this.moveSpeed = 400;							// time to move 1 tile in ms
		this.movementTimer = 0;
		this.laziness = 0;

		this.inventory = new Array(INVENTORY_SIZE);
		
		this.isDead = false;
		this.respawnTimer = 0;
		this.respawnCooldown = 200;
		this.respawnMap = map;
		this.respawnX = x;
		this.respawnY = y;
		
		this._healthMaxBase = 10;						// maximum health a player can have without bonuses
		this._healthMax = this._healthMaxBase;	// maximum health a player can have including bonuses
		this._health = this._healthMax;					// current health
		this._energyMaxBase = 40;
		this._energyMax = this._energyMaxBase;
		this._energy = this._energyMax;
		
		this.damageBase = 1;
		this.damage = this.damageBase;				// amount of health removed when attacking
		this.defenceBase = 0;						
		this.defence = this.defenceBase;				// amount of damage blocked when attacked
		this.rangeBase = 1;
		this.range = this.rangeBase;						// number of tiles your attack can reach

		this.isAttacking = false;
		this.attackSpeed = 1000;							// time between attacks in ms
		this.attackTimer = 0;	
		this.target = null;
		this.kills = 0;
		this.deaths = 0;
		
		this.calcStats();
		this.restore();
	}
	
	get health() {
		return this._health;
	}
	
	set health(val) {
		this._health = clamp(val, 0, this._healthMax);
	}
	
	get healthMaxBase() {
		return this._healthMaxBase;
	}
	
	set healthMaxBase(val) {
		if (val < 1) {
			this._healthMaxBase = 1;
		}
		else {
			this._healthMaxBase = val;
		}
	}
	
	get healthMax() {
		return this._healthMax;
	}
	
	set healthMax(val) {
		if (val < 1) {
			this._healthMax = 1;
		}
		else {
			this._healthMax = val;
		}
	}
	
	get energy() {
		return this._energy;
	}
	
	set energy(val) {
		this._energy = clamp(val, 0, this._energyMax);
	}
	
	get energyMaxBase() {
		return this._energyMaxBase;
	}
	
	set energyMaxBase(val) {
		if (val < 0) {
			this._energyMaxBase = 0;
		}
		else {
			this._energyMaxBase = val;
		}
	}
	
	get energyMax() {
		return this._energyMax;
	}
	
	set energyMax(val) {
		if (val < 0) {
			this._energyMax = 0;
		}
		else {
			this._energyMax = val;
		}
	}
	
	
	update() {		
		// Respawn Cooldown
		if (this.isDead) {
			this.respawnTimer += 30 / FRAMERATE;
			if (this.respawnTimer >= this.respawnCooldown) {
				this.respawn();
			}
			return;
		}
		
		// Inventory Item Update
		for (let slot = 0; slot < INVENTORY_SIZE + EQUIPMENT_SIZE; slot++) {
			if (this.inventory[slot]) {
				this.inventory[slot].update();
			}
		}
		
		// Attack Cooldown
		if (this.attackTimer > 0) {
			if (this.attackTimer > this.attackSpeed - 300) {
				this.isAttacking = false;
			}
			
			if (this.attackTimer - (1000 / FRAMERATE) <= 0) {
				this.attackTimer = 0;
			}
			else {
				this.attackTimer -= 1000 / FRAMERATE;
			}
		}
		
		// Set Run from Input
		if (this.pressingRun) {
			if (this.energy > 0) {
				this.isRunning = true;
			}
			else {
				this.isRunning = false;
			}
		}
		else {
			this.isRunning = false;
		}
		
		// Player Movement
		if (this.x / TILE_SIZE !== this.destination.x || this.y / TILE_SIZE !== this.destination.y) {
			this.x = lerp(this.startPosition.x, this.destination.x, this.movementTimer) * TILE_SIZE;
			this.y = lerp(this.startPosition.y, this.destination.y, this.movementTimer) * TILE_SIZE;
			let timer = (1000 / this.moveSpeed) / FRAMERATE;
			if (this.movementTimer + timer >= 0.49) {
				this.gridPosition.x = this.destination.x;
				this.gridPosition.y = this.destination.y;
			}
			if (this.movementTimer + timer >= 0.99) {
				this.x = this.destination.x * TILE_SIZE;
				this.y = this.destination.y * TILE_SIZE;
				this.startPosition.x = this.destination.x;
				this.startPosition.y = this.destination.y;
				this.movementTimer = 0;
				this.isMoving = false;
			}
			else {
				this.movementTimer += timer;
			}
		}
	}
	
	// Movement
	checkActorInRange(direction, target, range) {
		if (target.map !== this.map) {
			return false;
		}
		
		if (target.gridPosition === this.gridPosition) {
			return false;	// Stacked does not count as in range
		}
		
		if (target.gridPosition.y === this.gridPosition.y) {
			if (direction === 'left') {
				if (this.gridPosition.x === 0) {
					return false;
				}
				else {
					return (target.gridPosition.x < this.gridPosition.x && target.gridPosition.x >= (this.gridPosition.x - range));
				}
			}
			else if (direction === 'right') {
				if (this.gridPosition.x === MAP_COLUMNS - 1) {
					return false;
				}
				else {
					return (target.gridPosition.x > this.gridPosition.x && target.gridPosition.x <= (this.gridPosition.x + range));
				}
			}
		}
		else if (target.gridPosition.x === this.gridPosition.x) {
			if (direction === 'up') {
				if (this.gridPosition.y === 0) {
					return false;
				}
				else {
					return (target.gridPosition.y < this.gridPosition.y && target.gridPosition.y >= (this.gridPosition.y - range));
				}
			}
			else if (direction === 'down') {
				if (this.gridPosition.y === MAP_ROWS - 1) {
					return false;
				}
				else {
					return (target.gridPosition.y > this.gridPosition.y && target.gridPosition.y <= (this.gridPosition.y + range));
				}
			}
		}
		
		return false;
	}
	
	checkVacant(direction) {
		// Check for Map Edges
		if (direction === 'left') {
			if (this.gridPosition.x === 0) {
				return false;
			}
		}
		else if (direction === 'right') {
			if (this.gridPosition.x === MAP_COLUMNS - 1) {
				return false;
			}
		}
		else if (direction === 'up') {
			if (this.gridPosition.y === 0) {
				return false;
			}
		}
		else if (direction === 'down') {
			if (this.gridPosition.y === MAP_ROWS - 1) {
				return false;
			}
		}
		
		// Check for Wall Tiles
		
		
		// Check for Players
		for (let i in Player.list) {
			let target = Player.list[i];
			if (target !== this) {
				if (this.checkActorInRange(direction, target, 1)) {
					return false;
				}
			}
		}
		
		// Check for Bots
		for (let i in Bot.list) {
			let target = Bot.list[i];
			if (target !== this) {
				if (this.checkActorInRange(direction, target, 1)) {
					return false;
				}
			}
		}
		
		return true;
	}
		
	move(direction) {
		if (this.isMoving) {
			return;
		}
		
		if(direction) {
			this.direction = direction;
		}
		
		if (!this.checkVacant(direction)) {
			return;
		}
		
		// Set new destination
		if (direction === 'left') {
			this.destination.x--;
		}
		else if (direction === 'right') {
			this.destination.x++;
		}
		else if (direction === 'up') {
			this.destination.y--;
		}
		else if (direction === 'down') {
			this.destination.y++;
		}
		else {
			switch (game.rnd.integerInRange(0, this.laziness + 3)) {
				case 0:
					this.move('left');
				break;
				case 1:
					this.move('right');
				break;
				case 2:
					this.move('up');
				break;
				case 3:
					this.move('down');
				break;
				default:
					// Don't Move
				break;
			}
			return;
		}

		// Clamp to map boundries
		this.destination.x = clamp(this.destination.x, 0, MAP_ROWS - 1);
		this.destination.y = clamp(this.destination.y, 0, MAP_COLUMNS - 1);
		
		if (this.startPosition.x !== this.destination.x || this.startPosition.y !== this.destination.y) {
			// Set move speed
			if (this.isRunning) {
				if (this.energy > 0) {
					this.energy--;
					this.moveSpeed = 250;
				}
				else {
					this.energy = 0;
					this.moveSpeed = 400;
					this.isRunning = false;
				}
			}
			else {
				this.moveSpeed = 400;
			}
			
			this.isMoving = true;
		}
	}
	
	moveToTarget(target, hostile) {
		if (!target) {
			return;
		}
		
		if (target.gridPosition.x === this.gridPosition.x && target.gridPosition.y === this.gridPosition.y) {
			this.move();
		}
		else if (game.rnd.integerInRange(0, 1) === 0) {
			if (target.gridPosition.x < this.gridPosition.x) {
				if (target.gridPosition.x >= (this.gridPosition.x - this.range) && target.gridPosition.y === this.gridPosition.y) {
					if(hostile) {
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
			else if (target.gridPosition.x > this.gridPosition.x) {
				if (target.gridPosition.x === this.gridPosition.x + this.range && target.gridPosition.y === this.gridPosition.y) {
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
			else if (target.gridPosition.y < this.gridPosition.y) {
				if (target.gridPosition.x === this.gridPosition.x && target.gridPosition.y === this.gridPosition.y - this.range) {
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
			else if (target.gridPosition.y > this.gridPosition.y) {
				if (target.gridPosition.x === this.gridPosition.x && target.gridPosition.y === this.gridPosition.y + this.range) {
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
			if (target.gridPosition.y > this.gridPosition.y) {
				if (target.gridPosition.x === this.gridPosition.x && target.gridPosition.y === this.gridPosition.y + this.range) {
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
			else if (target.gridPosition.y < this.gridPosition.y) {
				if (target.gridPosition.x === this.gridPosition.x && target.gridPosition.y === this.gridPosition.y - this.range) {
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
			else if (target.gridPosition.x > this.gridPosition.x) {
				if (target.gridPosition.x === this.gridPosition.x + this.range && target.gridPosition.y === this.gridPosition.y) {
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
			else if (target.gridPosition.x < this.gridPosition.x) {
				if (target.gridPosition.x >= (this.gridPosition.x - this.range) && target.gridPosition.y === this.gridPosition.y) {
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
	attack(direction = this.direction) {
		if (this.attackTimer > 0) {
			return;
		}
		
		this.isAttacking = true;
		this.attackTimer = this.attackSpeed;
		
		for (let i in Player.list) {
			let target = Player.list[i];
			if (this.checkActorInRange(direction, target, this.range)) {
				target.takeDamage(this.damage, this);		//(damage, source)
				return;
			}
		}
	}
	
	takeDamage(damage, source) {
		this.health -= damage;
		new FloatText(this.map, this.gridPosition.x, this.gridPosition.y, damage, '#FF0000');
		if (this.health <= 0) {
			this.setDead(source);
			return;
		}
	}
	
	respawn() {
		sendServerMessage(this.name + " is back from the dead.");
		this.map = this.respawnMap;
		this.gridPosition.x = this.respawnX;
		this.gridPosition.y = this.respawnY;
		this.startPosition.x = this.respawnX;
		this.startPosition.y = this.respawnY;
		this.destination.x = this.respawnX;
		this.destination.y = this.respawnY;
		this.x = this.respawnX * TILE_SIZE;
		this.y = this.respawnY * TILE_SIZE;
		
		this.calcStats();
		this.restore();
		
		this.isWalking = false;
		this.isRunning = false;
		this.isAttacking = false;
		this.isDead = false;
		this.respawnTimer = 0;
	}
	
	setDead(source) {
		if (Map.list[this.map].dropChance > 0) {
			for (let i = 0; i < INVENTORY_SIZE; i++) {
				if (Math.floor(Math.random() * (101)) <= Map.list[this.map].dropChance) {
					this.dropItem(i);
				}
			}
		}
		if (Map.list[this.map].dropAmountEQ > 0) {
			if (Map.list[this.map].dropAmountEQ > EQUIPMENT_SIZE) {
				Map.list[this.map].dropAmountEQ = EQUIPMENT_SIZE;
			}
			
			let slots = [];
			for (let i = 0; i < dropAmountEQ; i++) {
				if (this.inventory[i + INVENTORY_SIZE]) {
					slots.push(i);
				}
			}
			shuffle(slots);
			
			for (let i = 0; i < slots.length; i++) {
				this.dropItem(slots[i] + INVENTORY_SIZE);
			}
		}
		
		this.isDead = true;
		this.health = 0;
		this.energy = 0;
		this.gridPosition.x = 100;
		this.gridPosition.y = 100;
		this.deaths++;
		
		if (source) {
			if (source instanceof Player) {
				sendServerMessage(source.name + " has murdered " + this.name + " in cold blood!");
				source.kills++;
				if (source.target === this) {
					source.target = null;
				}
			}
			else {
				sendServerMessage(this.name + " has been killed by " + source.name + "!");
			}
		}
		else {
			sendServerMessage(this.name + " has died!");
		}
	}
	
	// Inventory
	pickUp() {
		for (let i in Map.list[this.map].items) {
			let item = Map.list[this.map].items[i];
			if (item) {
				if (item.gridPosition.x === this.gridPosition.x && item.gridPosition.y === this.gridPosition.y) {
					if (this.getItem(item.id, item.stack)) {
						item.remove();
					}
				}
			}
		}
	}
	
	getItem(id, stack) {
		if (stack > 0) {			// Stackable Items
			let emptySlot = -1;
			for (let slot = 0; slot < INVENTORY_SIZE; slot++) {
				if (this.inventory[slot]) {
					if (this.inventory[slot].id === id) {
						this.inventory[slot].stack += stack;
						return true;
					}
				}
				else if (emptySlot < 0) {
					emptySlot = slot;
				}
				
				if (slot === INVENTORY_SIZE - 1) {
					if (emptySlot >= 0 && emptySlot < INVENTORY_SIZE) {
						new InventoryItem(this.id, emptySlot, id, stack);
						return true;
					}
					else {
						console.log("Inventory full");
						return false;
					}
				}
			}
		}
		else {			// Non-Stackable Item
			for (let slot = 0; slot < INVENTORY_SIZE; slot++) {
				if (!this.inventory[slot]) {
					new InventoryItem(this.id, slot, id, stack);
					return true;
				}
				else {
					if (slot === INVENTORY_SIZE - 1) {
						console.log("Inventory full");
						return false;
					}
				}
			}
		}
	}
	
	dropItem(slot) {
		let item = this.inventory[slot];
		if (item) {
			if (slot < INVENTORY_SIZE) {
				// Destroy Inventory Item
				item.remove();
				if (slot >= INVENTORY_SIZE) {
					this.calcStats();
				}
				
				// Create Map Item
				new MapItem(this.map, this.gridPosition.x, this.gridPosition.y, item.id, item.stack);
			}
			else {
				this.unequipItem(slot);
			}
		}
	}
	
	useItem(slot) {
		let item = this.inventory[slot];
		if (!item) {
			return;
		}
		
		// Run 'use' script
		if (!items[item.id].use.call(this, slot)) {
			return;
		}
		
		// Equipment Items
		if (item.checkIsEquipment()) {
			if (slot < INVENTORY_SIZE) {		// Check if item is equipped
				this.equipItem(slot);
			}
			else {
				this.unequipItem(slot);
			}
			return;
		}
		
		// Non-Equipment Items
		if (!item.reusable) {
			if (item.stack > 1) {
				item.stack--;
			}
			else {
				item.remove();
			}
			return;
		}
	}
	
	hasItem(id) {
		for (let i = 0; i < INVENTORY_SIZE; i++) {
			if (this.inventory[i].id === id) {
				return true;
			}
		}
		return false;
	}
	
	moveItemToSlot(slot, newSlot) {
		if (!newSlot) {
			return;
		}
		
		let item = this.inventory[slot];
		if (item) {
			let newItem = this.inventory[newSlot];
			if (newItem) {
				if (newItem === item) {
					return;
				}
				if (slot >= INVENTORY_SIZE) {
					if (newSlot >= INVENTORY_SIZE) {
						if (newItem.type === item.type) {
							item.slot = newSlot;
							newItem.slot = slot;
							swap(this.inventory, slot, newSlot);
						}
						else {
							sendPlayerMessage(this.id, "That cannot be equipped there.");
						}
					}
					else {
						if (newItem.type === item.type) {
							item.equipped = false;
							newItem.equipped = true;
							item.slot = newSlot;
							newItem.slot = slot;
							swap(this.inventory, slot, newSlot);
							this.calcStats();
						}
						else {
							newSlot = this.findFirstEmptySlot();
							if (newSlot) {
								item.equipped = false;
								item.slot = newSlot;
								swap(this.inventory, slot, newSlot);
								this.calcStats();
							}
							else {
								sendPlayerMessage(this.id, "Your inventory is full.");
							}
						}
					}
				}
				else {
					if (newSlot >= INVENTORY_SIZE) {
						if (newItem.type === item.type) {
							item.equipped = true;
							newItem.equipped = false;
							item.slot = newSlot;
							newItem.slot = slot;
							swap(this.inventory, slot, newSlot);
							this.calcStats();
						}
						else {
							sendPlayerMessage(this.id, "That cannot be equipped there.");
						}
					}
					else {
						item.slot = newSlot;
						newItem.slot = slot;
						swap(this.inventory, slot, newSlot);
					}
				}
			}
			else {
				if (slot >= INVENTORY_SIZE) {
					if (newSlot >= INVENTORY_SIZE) {
						if (newSlot === item.findEquipmentSlot()) {
							item.slot = newSlot;
							this.inventory[newSlot] = item;
							delete this.inventory[slot];
						}
						else {
							sendPlayerMessage(this.id, "That cannot be equipped there.");
						}
					}
					else {
						item.equipped = false;
						item.slot = newSlot;
						this.inventory[newSlot] = item;
						delete this.inventory[slot];
						this.calcStats();
					}
				}
				else {
					if (newSlot >= INVENTORY_SIZE) {
						if (newSlot === item.findEquipmentSlot()) {
							item.equipped = true;
							item.slot = newSlot;
							this.inventory[newSlot] = item;
							delete this.inventory[slot];
							this.calcStats();
						}
						else {
							sendPlayerMessage(this.id, "That cannot be equipped there.");
						}
					}
					else {
						item.slot = newSlot;
						this.inventory[newSlot] = item;
						delete this.inventory[slot];
					}
				}
			}
		}
	}

	equipItem(slot) {
		let newSlot = item.findEquipmentSlot();
		this.moveItemToSlot(slot, newSlot);
	}

	unequipItem(slot) {
		let item = this.inventory[slot];
		if (item) {
			if (item.slot >= INVENTORY_SIZE) {
				let newSlot = this.findFirstEmptySlot();
				if (newSlot) {
					this.moveItemToSlot(slot, newSlot);
				}
				else {
					sendPlayerMessage(this.id, "Your inventory is full.");
				}
			}
		}
	}
	
	checkIsInventoryFull() {
		for (let slot = 0; slot < INVENTORY_SIZE; slot++) {
			if (!this.inventory[slot]) {
				return false;
			}
		}
		return true;
	}
	
	findFirstEmptySlot() {
		for (let slot = 0; slot < INVENTORY_SIZE; slot++) {
			if (!this.inventory[slot]) {
				return slot;
			}
		}
		return null;
	}
	
	// Character Stats
	calcStats() {
		let damageTotalBonus = 0;
		let defenceTotalBonus = 0;
		let healthMaxTotalBonus = 0;
		let energyMaxTotalBonus = 0;
		let rangeTotalBonus = 0;
		
		// For each equipped item check for bonuses
		for (let i = 0; i < EQUIPMENT_SIZE; i++) {
			let item = this.inventory[INVENTORY_SIZE + i];
			if (item && !item.remove) {
				damageTotalBonus += item.damageBonus;
				defenceTotalBonus += item.defenceBonus;
				healthMaxTotalBonus += item.healthMaxBonus;
				energyMaxTotalBonus += item.energyMaxBonus;
				rangeTotalBonus += item.rangeBonus;
				
			}
		}
		
		this.damage = this.damageBase + damageTotalBonus;
		this.defence = this.defenceBase + defenceTotalBonus;
		this.healthMax = this.healthMaxBase + healthMaxTotalBonus;
		this.energyMax = this.energyMaxBase + energyMaxTotalBonus;
		this.range = this.rangeBase + rangeTotalBonus;
	}
	
	restore() {
		this.health = this.healthMax;
		this.energy = this.energyMax;
	}
	
}

class Player extends Actor {
	constructor(socket) {
		if (!players[socket.id]) {
			id = 0;
		}
		super(players[socket.id].map, players[socket.id].x, players[socket.id].y, players[socket.id].name, players[socket.id].sprite);
		this.socket = socket;
		this.id = socket.id;
		this.adminAccess = 0;
		if (this.id === 0) {
			this.adminAccess = 1;
		}
		this.selected = null;
		this.lastPressed = null;
		this.pressingPickUp = false;
		this.pressingRun = false;
		this.pressingAttack = false;
				
		this.healthMaxBase = 20;				// maximum health a player can have
		this.damageBase = 2;					// amount of health removed per attack
		this.calcStats();
		this.restore();
		
		this.inventoryInitPack = [];
		this.inventoryUpdatePack = [];
		this.inventoryRemovePack = [];
		
		Player.list[this.id] = this;
		SOCKET_LIST[this.id].player = this;
		Map.list[this.map].initPack.players.push(this.getPack());
		this.loadMap();
	}
	
	update() {
		super.update();		// Default Actor Update
		
		if (!this.isDead) {
			if (this.pressingAttack) {
				if (this.attackTimer === 0) {
					this.attack();
				}
			}
			
			// If player is not moving, get input and move in that direction
			if (!this.isMoving) {
				if (this.lastPressed) {
					this.move(this.lastPressed);
				}
			}
		}
		
		return this.getPack();
	}

	getPack() {
		return {
			id: this.id,
			name: this.name,
			map: this.map,
			pixelX: this.x,
			pixelY: this.y,
			gridX: this.gridPosition.x,
			gridY: this.gridPosition.y,
			sprite: this.sprite,
			direction: this.direction,
			isMoving: this.isMoving,
			isRunning: this.isRunning,
			isAttacking: this.isAttacking,
			isDead: this.isDead
		}
	}
	
	getSelfPack() {
		return {
			health: this.health,
			healthMax: this.healthMax,
			energy: this.energy,
			energyMax: this.energyMax,
			moveSpeed: this.moveSpeed,
			attackSpeed: this.attackSpeed,
			attackTimer: this.attackTimer
		};
	}

	getInventoryPack() {
		let inventoryPack = [];
		for (let i in this.inventory) {
			let item = this.inventory[i];
			if (item) {
				inventoryPack[i] = item.getPack();
			}
		}
	}
	
	loadMap() {
		this.socket.emit('loadMap', {
			map: Map.list[this.map].getPack()
		});
	}
	
	
	doubleClickItem(slot) {
		if (!this.isDead) {
			this.useItem(slot);
		}
	}
	
	rightClickItem(slot) {
		if (!this.isDead) {
			this.dropItem(slot);
		}
	}
	
	dragStopMap(slot, x, y) {
		this.dropItem(slot);
	}
	
	dragStopInventory(slot, newSlot) {
		let item = this.inventory[slot];
		if (item) {
			this.moveItemToSlot(slot, newSlot);
		}
	}
	
	dragStopEquipment(slot, newSlot) {
		let item = this.inventory[slot];
		if (item) {
			this.moveItemToSlot(slot, newSlot);
		}
	}
	
	
	static getAllInitPack(player) {
		let playerPack = [];
		for (let i in Player.list) {
			let currentPlayer = Player.list[i];
			if (currentPlayer !== player && currentPlayer.map === player.map) {
				playerPack[currentPlayer.id] = currentPlayer.getPack();
			}
		}
		return playerPack;
	}
	
	static updateAll() {
		let playerPack = [];
		for (let i in Player.list) {
			let player = Player.list[i];
			playerPack[i] = player.update();
		}
		return playerPack;
	}

	static onConnect(socket) {
		let player = new Player(socket);
		// Listen for Inputs
		socket.on('cursorPress', function(data) {
			player.lastPressed = data.lastPressed;
		});
		socket.on('keyPress', function(data) {
			if (data.inputId === 'pickUp') {
				if (player.pressingPickUp === false && data.state === true) {
					player.pickUp();
				}
				player.pressingPickUp = data.state;
			}
			else if (data.inputId === 'run') {
				player.pressingRun = data.state;
			}
			else if (data.inputId === 'attack') {
				player.pressingAttack = data.state;
			}
		});

		socket.on('chatServer', function(data) {
			sendServerMessage(player.name + " yells, \"" + data.message + "\"");
		});
		socket.on('chatMap', function(data) {
			sendMapMessage(player.map, player.name + " says, \"" + data.message + "\"");
		});
		socket.on('chatPlayer', function(data) {
			if (Player.list[data.id]) {
				sendPlayerMessage(data.id, player.name + " whispers, \"" + data.message + "\"");
				sendPlayerMessage(player.id, "You whisper to " + Player.list[data.id].name + ", \"" + data.message + "\"");
			}
		});
		
		socket.on('spawnItem', function(data) {
			if (Player.list[socket.id].adminAccess > 0) {
				new MapItem(data.map, data.x, data.y, data.id, data.stack);
			}
			else {
				sendPlayerMessage(socket.id, "You don't have access to that command.");
			}
		});
		socket.on('uploadMap', function(data) {
			if (Player.list[socket.id].adminAccess > 0) {
				Map.list[data.map].upload();
			}
			else {
				sendPlayerMessage(socket.id, "You don't have access to that command.");
			}
		});
		
		socket.on('doubleClickItem', function(data) {
			let item = player.inventory[data.slot];
			if (item) {
				player.doubleClickItem(data.slot);
			}
		});
		socket.on('rightClickItem', function(data) {
			let item = player.inventory[data.slot];
			if (item) {
				player.rightClickItem(data.slot);
			}
		});
		socket.on('dragStopGame', function(data) {
			let item = player.inventory[data.slot];
			if (item) {
				player.dragStopMap(data.slot, data.x, data.y);
			}
		});
		socket.on('dragStopInventory', function(data) {
			let item = player.inventory[data.slot];
			if (item) {
				player.dragStopInventory(data.slot, data.newSlot);
			}
		});
		socket.on('dragStopEquipment', function(data) {
			let item = player.inventory[data.slot];
			if (item) {
				player.dragStopEquipment(data.slot, data.newSlot);
			}
		});
		
		// Initialize all Entities
		let initPack = Map.list[player.map].getPack();
		socket.emit('init', {
			selfId: socket.id,
			players: Player.getAllInitPack(player),
			items: initPack.items,
			bots: initPack.bots,
			effects: initPack.effects,
			texts: initPack.texts,
			inventory: player.getInventoryPack(),
			self: player.getSelfPack()
		});
		
		sendServerMessage(player.name + " has logged in.");
	}
	
	static onDisconnect(socket) {
		let player = Player.list[socket.id];
		sendServerMessage(player.name + " has logged out.");
		
		Map.list[player.map].removePack.players.push(player.id);
		delete Player.list[player.id];
	}
	
}

Player.list = {};

class Bot extends Actor {
	constructor(id, map, x, y) {
		super(map, x, y, bots[id].name, bots[id].sprite);
		this.id = id;
		
		this.moveTimer = 0;
		this.hostile = false;		// Whether bot attacks on sight
		this.setTask('wandering');
		
		let botList = Map.list[map].bots;
		for (let i = 0; i <= botList.length; i++) {
			if (!botList[i]) {
				this.mapIndex = i;
				break;
			}
		}
		
		Map.list[this.map].bots[this.mapIndex] = this;
		Map.list[this.map].initPack.bots.push(this.getPack());
	}
	
	update() {
		super.update(); 	// Default Actor Update
		if (this.isDead) {
			return;
		}
		
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
			mapIndex: this.mapIndex,
			name: this.name,
			pixelX: this.x,
			pixelY: this.y,
			gridX: this.gridPosition.x,
			gridY: this.gridPosition.y,
			sprite: this.sprite,
			direction: this.direction,
			isMoving: this.isMoving,
			isRunning: this.isRunning,
			isAttacking: this.isAttacking,
			isDead: this.isDead
		};
	}

	remove() {
		Map.list[this.map].removePack.bots.push(this.mapIndex);
		delete Map.list[this.map].bots[this.mapIndex];
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
		if (source instanceof Actor) {
			this.setTask('attacking', source);
		}
		super.takeDamage(damage, source);
	}
	
	respawn() {
		super.respawn();
		this.setTask('wandering');
	}
	
	pickUp() {
		super.pickUp();
		this.checkBestEquipment();
	}
	
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
		for (let slot = 0; slot < INVENTORY_SIZE; slot++) {
			let item = this.inventory[slot];
			if (!item) {
				continue;
			}
			
			switch (item.type) {
				case 'weapon':
					if (this.inventory[INVENTORY_SIZE]) {
						if (item.damageBonus > this.inventory[INVENTORY_SIZE].damageBonus) {
							this.equipItem(slot);
							continue;
						}
					}
					else {
						this.equipItem(slot);
					}
				break;
				case 'shield':
					if (this.inventory[INVENTORY_SIZE + 1]) {
						if (item.defenceBonus > this.inventory[INVENTORY_SIZE + 1].defenceBonus) {
							this.equipItem(slot);
							continue;
						}
					}
					else {
						this.equipItem(slot);
					}
				break;
				case 'armour':
					if (this.inventory[INVENTORY_SIZE + 2]) {
						if (item.defenceBonus > this.inventory[INVENTORY_SIZE + 2].defenceBonus) {
							this.equipItem(slot);
							continue;
						}
					}
					else {
						this.equipItem(slot);
					}
				break;
				case 'helmet':
					if (this.inventory[INVENTORY_SIZE + 3]) {
						if (item.defenceBonus > this.inventory[INVENTORY_SIZE + 3].defenceBonus) {
							this.equipItem(slot);
							continue;
						}
					}
					else {
						this.equipItem(slot);
					}
				break;
				case 'ring':
					if (this.inventory[INVENTORY_SIZE + 4]) {
						if (item.damageBonus > this.inventory[INVENTORY_SIZE + 4].damageBonus) {
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

class MapItem extends Entity {
	constructor(map, x, y, id, stack) {
		super(map, x, y, 0);

		this.id = id;
		this.stack = stack;
		
		// from database...
		this.name = items[this.id].name;
		this.sprite = items[this.id].sprite;
		
		// Get first unused Map Index
		let itemList = Map.list[this.map].items;
		if (itemList.length === 0) {
			this.mapIndex = 0;
		}
		else {
			for (let i = 0; i <= itemList.length; i++) {
				if (!itemList[i]) {
					this.mapIndex = i;
				}
			}
		}
		Map.list[this.map].items[this.mapIndex] = this;
		Map.list[this.map].initPack.items.push(this.getPack());
	}

	update() {
		return this.getPack();
	}
	
	getPack() {
		return {
			mapIndex: this.mapIndex,
			gridX: this.gridPosition.x,
			gridY: this.gridPosition.y,
			name: this.name,
			sprite: this.sprite,
			stack: this.stack
		};
	}

	remove() {
		Map.list[this.map].removePack.items.push(this.mapIndex);
		delete Map.list[this.map].items[this.mapIndex];
	}
	
}

class InventoryItem {
	constructor(playerId, slot, id, stack) {
		this.playerId = playerId;
		this.slot = slot;
		this.id = id;
		this.stack = stack;

		this.name = items[this.id].name;
		this.type = items[this.id].type;
		this.sprite = items[this.id].sprite;
		this.reusable = items[this.id].reusable;
		
		if (this.checkIsEquipment()) {
			this.damageBonus = items[this.id].damageBonus;
			this.defenceBonus = items[this.id].defenceBonus;
			this.healthMaxBonus = items[this.id].healthMaxBonus;
			this.energyMaxBonus = items[this.id].energyMaxBonus;
			this.rangeBonus = items[this.id].rangeBonus;
		}
		
		this.equipped = false;
		
		this.clicked = false;
		this.clickTime = 0;
		
		// Get first unused Inventory Index
		let inventory = Player.list[this.playerId].inventory;
		if (inventory.length === 0) {
			this.index = 0;
		}
		else {
			for (let i = 0; i <= inventory.length; i++) {
				if (!inventory[i]) {
					this.index = i;
				}
			}
		}
		
		Player.list[this.playerId].inventory[this.slot] = this;
		Player.list[this.playerId].inventoryInitPack.push(this.getPack());
	}

	update() {
		return this.getPack();
	}

	getPack() {
		return {
			slot: this.slot,
			index: this.index,
			stack: this.stack,
			name: this.name,
			sprite: this.sprite,
			type: this.type,
			reusable: this.reusable,
			damageBonus: this.damageBonus,
			defenceBonus: this.defenceBonus,
			healthMaxBonus: this.healthMaxBonus,
			energyMaxBonus: this.energyMaxBonus,
			rangeBonus: this.rangeBonus
		};
	}
	
	remove() {
		Player.list[this.playerId].inventoryRemovePack.push(this.slot);
		delete Player.list[this.playerId].inventory[this.slot];
	}
	
	checkIsEquipment() {
		if (this.type === 'weapon' || this.type === 'shield' || this.type === 'armour' || this.type === 'helmet' || this.type === 'ring') {
			return true;
		}
		else {
			return false;
		}
	}
	
	findEquipmentSlot() {
		switch (this.type) {
			case "weapon":
				return INVENTORY_SIZE;
			break;
			case "shield":
				return INVENTORY_SIZE + 1;
			break;
			case "armour":
				return INVENTORY_SIZE + 2;
			break;
			case "helmet":
				return INVENTORY_SIZE + 3;
			break;
			case "ring":
				return INVENTORY_SIZE + 4;
			break;
			default:
				return null;
			break;
		}
	}
	
}

class Effect {
	constructor(map, x, y, sprite, speed, loop = 1, maxFrames = 7, startFrame = 0) {
		this.sprite = clamp(sprite, 1, MAX_EFFECTS);
		this.maxFrames = clamp(maxFrames, 1, 7);
		this.startFrame = clamp(startFrame, 0, this.maxFrames);
		this.frame = this.startFrame;

		this.x = x * TILE_SIZE;
		this.y = y * TILE_SIZE;
		
		this.speed = speed;
		this.loop = loop;
		this.counter = 0;
		
		// Get first unused Map Index
		let effectList = Map.list[this.map].effects;
		if (effectList.length === 0) {
			this.mapIndex = 0;
		}
		else {
			for (let i = 0; i <= effectList.length; i++) {
				if (!effectList[i]) {
					this.mapIndex = i;
				}
			}
		}

		Map.list[this.map].effects[this.mapIndex] = this;
		Map.list[this.map].initPack.effects.push(this.getPack());
	}
	
	update() {
		this.counter += 1000 / FRAMERATE;
		
		if (this.counter >= this.speed) {
			this.counter = 0;

			if (this.frame > this.maxFrames) {
				if (this.loop < 0) {
					this.frame = this.startFrame;
				}
				else if (this.loop >= 1) {
					this.frame = this.startFrame;
					this.loop--;
				}
				else {
					this.remove();
				}
			}
			else {
				this.frame++;
			}
		}

		return this.getPack();
	}
	
	getPack() {
		return {
			mapIndex: this.mapIndex,
			x: this.x,
			y: this.y,
			sprite: this.sprite,
			frame: this.frame,
		};
	}
	
	remove() {
		Map.list[this.map].removePack.effects.push(this.mapIndex);
		delete Map.list[this.map].effects[this.mapIndex];
	}
	
}

class Text {
	constructor(map, x, y, message, colour) {
		this.map = map;
		this.x = x;
		this.y = y;
		this.message = message;
		this.colour = colour;
		this.counter = 0;
		
		// Get first unused Map Index
		let textList = Map.list[this.map].texts;
		if (textList.length === 0) {
			this.mapIndex = 0;
		}
		else {
			for (let i = 0; i <= textList.length; i++) {
				if (!effectList[i]) {
					this.mapIndex = i;
				}
			}
		}
		
		Map.list[this.map].texts[this.mapIndex] = this;
		Map.list[this.map].initPack.texts.push(this.getPack());
	}
	
	update() {
		return getPack();
	}
	
	getPack() {
		return {
			mapIndex: this.mapIndex,
			x: this.x,
			y: this.y,
			message: this.message,
			colour: this.colour,
		};
	}

	remove() {
		Map.list[this.map].removePack.texts.push(this.mapIndex);
		delete Map.list[this.map].texts[this.mapIndex];
	}
	
}

class FloatText extends Text {
	constructor(map, x, y, message, colour) {
		super(map, x * TILE_SIZE, y * TILE_SIZE, message, colour);
		this.x += (TILE_SIZE / 2);
	}

	update() {
		this.counter += 1000 / FRAMERATE;
		this.y -= 30 / FRAMERATE;
		
		if (this.counter >= 1500) {
			this.remove();
		}
		
		return this.getPack();
	}
}

class ScrollText extends Text {
	constructor(map, x, y, message, colour) {
		super(map, x * TILE_SIZE, y * TILE_SIZE, message, colour);
		this.y += (TILE_SIZE / 2);
	}

	update() {
		this.counter += 1000 / FRAMERATE;
		this.x += 30 / FRAMERATE;
		
		if (this.counter >= 1500) {
			this.remove();
		}
		
		return this.getPack();
	}
}


const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});

app.use('/client', express.static(__dirname + '/client'));

server.listen(process.env.PORT || 2000, function() {
	console.log("Server started. Listening on " + server.address().port);
});

let lastSocketID = 0;
let SOCKET_LIST = {};
let currentTime = 0;
let messagePackMaster = {messages: []};

// Message Functions
function sendServerMessage(message) {
	messagePackMaster.messages.push({message});
}

function sendMapMessage(map, message) {
	messagePackMaster.messages.push({message, map});
}

function sendPlayerMessage(id, message) {
	messagePackMaster.messages.push({message, id});
}


// Create all Maps
for (let i = 0; i < MAX_MAPS; i++) {
	new Map(i);
}

io.sockets.on('connection', function(socket){
	socket.id = lastSocketID++;
	SOCKET_LIST[socket.id] = socket;
	console.log("New Connection: " + socket.id);
	
	socket.on('disconnect', function() {
		if (Player.list[socket.id]) {
			Player.onDisconnect(socket);
		}
		delete SOCKET_LIST[socket.id];
	});
	
	socket.on('login', function() {
		if (!Player.list[socket.id]) {
			Player.onConnect(socket);
		}
	});
	
	
});

setInterval(function() {
	currentTime += FRAMERATE;

	let playerUpdatePack = Player.updateAll();
	let mapUpdatePack = Map.updateAll();
	
	for (let i in SOCKET_LIST) {
		let socket = SOCKET_LIST[i];
		let player = socket.player;
		if (player) {
			// Create Initialize Pack
			let initPack = Map.list[player.map].initPack;
			initPack.inventory = player.inventoryInitPack;
			
			// Create Update Pack
			let currentMapUpdatePack = mapUpdatePack[player.map];
			let currentPlayerUpdatePack = playerUpdatePack.filter(target => target.map === player.map);
			
			let updatePack = {
				players: currentPlayerUpdatePack,
				items: currentMapUpdatePack.items,
				bots: currentMapUpdatePack.bots,
				effects: currentMapUpdatePack.effects,
				texts: currentMapUpdatePack.texts,
				inventory: player.getInventoryPack(),
				self: player.getSelfPack()
			};
			
			// Create Remove Pack
			let removePack = Map.list[player.map].removePack;
			removePack.inventory = player.inventoryRemovePack;
			
			let messagePack = messagePackMaster.filter(function(pack) {
				// Server Message
				if (!pack.map && !pack.id) {
					return pack;
				}
				// Map Message
				if (pack.map) {
					if (pack.map === player.map) {
						return pack;
					}
				}
				// Player Message
				if (pack.id) {
					if (pack.id === player.id) {
						return pack;
					}
				}
			});
			
			// Emit Packs to Client
			socket.emit('init', initPack);
			socket.emit('update', updatePack);
			socket.emit('remove', removePack);
			socket.emit('message', messagePack);
			
			// Reset Player Inventory Init and Remove Packs
			player.inventoryInitPack = [];
			player.inventoryRemovePack = [];
		}
	}
	
	// Reset Map Init and Remove Packs
	for (let i in Map.list) {
		let map = Map.list[i];
		if (map) {
			map.initPack = {players: [], items: [], bots: [], effects: [], texts: []};
			map.removePack = {players: [], items: [], bots: [], effects: [], texts: []};
		}
	}
	
	// Reset Message Pack Master
	messagePackMaster = {messages: []};

}, 1000/FRAMERATE);
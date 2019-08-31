import game from '../game.js';
import config from '../config.js';
import util from '../util.js';
import Actor from './actor.js';

// A Player is an immortal Actor which takes input from a client

export default class Player extends Actor {
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

		this.gameId = util.firstEmptyIndex(game.players);
		game.players[this.gameId] = this;
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
			game.sendGameInfoPlayer(this.gameId, "You are dead.");
			return;
		}

		if (game.godCommands[data.input]) {
			if (this.adminAccess > 0) game.godCommands[data.input](data, this);
			else game.sendGameInfoPlayer(this.gameId, "You don't have access to that command.");
		}
		else {
			if (game.commands[data.input]) game.commands[data.input](data, this);
			else game.sendGameInfoPlayer(this.gameId, "Invalid command.");
		}
	}

	move(direction) {
		if (this.isMoving) return;

		if ((direction === 'left' && this.x === 0) || (direction === 'right' && this.x === config.MAP_COLUMNS - 1) || (direction === 'up' && this.y === 0) || (direction === 'down' && this.y === config.MAP_ROWS - 1)) {
			super.switchMap(direction);
		}
		else {
			super.move(direction);
		}
	}

	pickUp() {
		if (super.pickUp() === false) game.sendGameInfoPlayer(this.gameId, "Your inventory is full.");
	}
	
	getInventory() {
		const inventory = game.items.filter(item => {
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
		game.sendGameInfoPlayer(this.gameId, "The Angel of Mercy refuses to let you die.");
	}

	gainExperience(experience) {
		if (this.experience + experience <= 0) {
			this.experience = 0;	
			return;
		}

		this.experience += experience;
		if (this.experience >= game.experienceToLevel[this.level]) {
			this.levelUp();
		}
	}

	levelUp() {
		if (this.level < config.MAX_LEVEL) {
			const rolloverExperience = this.experience - game.experienceToLevel[this.level];
			this.experience = 0;
			this.level++;
			this.calcBaseStats();
			game.sendGameInfoPlayer(this.gameId, `Level up! You are now level ${this.level}!`);
			this.gainExperience(rolloverExperience);
		}
	}
	
	calcBaseStats(template) {
		if (!template) template = game.playerTemplates[this.templateId];
		super.calcBaseStats(template);
	}

	switchMap(mapId, direction) {
		if (direction === 'left') {
			if (this.x !== 0) return;

			const newMap = game.maps[mapId].exitLeft;
			if (newMap) {
				this.mapId = newMap;
				this.x = config.MAP_COLUMNS - 1;
			}
		}
		else if (direction === 'right') {
			if (this.x !== config.MAP_COLUMNS - 1) return;

			const newMap = game.maps[mapId].exitRight;
			if (newMap) {
				this.mapId = newMap;
				this.x = 0;
			}
		}
		else if (direction === 'up') {
			if (this.y !== 0) return;

			const newMap = game.maps[mapId].exitUp;
			if (newMap) {
				this.mapId = newMap;
				this.y = config.MAP_COLUMNS - 1;
			}
		}
		else if (direction === 'down') {
			if (this.y !== config.MAP_ROWS - 1) return;

			const newMap = game.maps[mapId].exitDown;
			if (newMap) {
				this.mapId = newMap;
				this.y = 0;
			}
		}
	}
}

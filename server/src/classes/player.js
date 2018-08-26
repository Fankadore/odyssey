import db from '../db.js';
import game from '../game.js';
import Actor from './actor.js';

// A Player is an Actor which takes input from a client

export default class Player extends Actor {
	constructor(id) {
		let data = db.getPlayerData(id);

		super(data.mapId, data.x, data.y, data.name, data.sprite);
		this.controller = 'player';
		this.id = id;
		this.adminAccess = data.adminAccess;

		this.damageBase = data.damageBase;				// minimum damage a player can have
		this.defenceBase = data.defenceBase;			// minimum defence a player can have
		this.healthMaxBase = data.healthMaxBase;	// max health without bonuses
		this.energyMaxBase = data.energyMaxBase;	// max energy without bonuses
		this.calcStats();
		this.restore();

		this.selected = null;
		this.input = {
			direction: null,
			run: false,
			pickup: false,
			attack: false
		}
	}

	loadMap() {
		
	}

	update(delta) {
		super.update(delta);		// Default Actor Update
		
		if (!this.isDead) {
			// Check for Atack Input
			if (this.input.attack && this.attackTimer === 0) {
				this.attack();
			}
			
			// Check for Movement Input
			if (!this.isMoving) {
				if (this.input.direction) {
					// Check for Run Input
					if (this.input.run) {
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
					this.move(this.input.direction);
				}
			}
		}
		
		return this.getPack();
	}
	
	getPack() {
		return {
			id: this.id,
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
			isDead: this.isDead,
			isVisible: this.isVisible
		};
	}
	
	getPrivatePack() {
		return {
			id: this.id,
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
	
	checkAdmin(access = 1) {
		if (access < 1) access = 1;
		return (this.adminAccess >= access);
	}

	onInput(data) {
		switch (data.input) {
			case null:
			case 'move': this.input.direction = data.direction;
			break;
			case 'run': this.input.run = data.state;
			break;
			case 'pickup':
				if (!this.input.pickup && data.state) {
					this.pickUp();
				}
				this.input.pickup = data.state;
			break;
			case 'attack':
				this.input.attack = data.state;
				this.attack(1, this.direction);
			break;
			case 'doubleClickItem':
				if (this.inventory[data.slot]) {
					if (!this.isDead) {
						this.useItem(data.slot);
					}
				}
			break;
			case 'rightClickItem':
				if (this.inventory[data.slot]) {
					if (!this.isDead) {
						this.dropItem(data.slot);
					}
				}
			break;
			case 'dragStopGame':
				if (this.inventory[data.slot]) {
					if (!this.isDead) {
						this.dropItem(data.slot);
					}
				}
			break;
			case 'dragStopInventory':
			case 'dragStopEquipment':
				if (this.inventory[data.slot]) {
					if (!this.isDead) {
						this.moveItemToSlot(data.slot, data.newSlot);
					}
				}
			break;
			case 'serverChat': game.sendServerMessage(`${this.name} yells, "${data.message}"`);
			break;
			case 'mapChat': game.sendMapMessage(this.mapId, `${this.name} says, "${data.message}"`);
			break;
			case 'playerChat':
				let target = this.playerList[data.targetId];
				if (target) {
					game.sendPlayerMessage(target.id, `${this.name} whispers, "${data.message}"`);
					game.sendPlayerMessage(this.id, `You whisper to ${target.name}, "${data.message}"`);
				}
			break;

			// God Inputs
			case 'spawnItem':
				if (this.checkAdmin(2)) {
					game.spawnMapItem(data.mapId, data.x, data.y, data.type, data.stack);
				}
				else {
					game.sendPlayerMessage(this.id, `You don't have access to that command.`);
				}
			break;
			case 'uploadMap':
				if (this.checkAdmin(2)) {
					game.mapList[data.mapId].upload();
				}
				else {
					game.sendPlayerMessage(this.id, `You don't have access to that command.`);
				}
			break;
		}
	}

	pickUp() {
		for (let item of game.mapList[this.mapId].items) {
			if (item && item.x === this.x && item.y === this.y) {
				let slot = this.getMapItem(item.mapId, item.id);
				if (slot != null) {
					item.moveToPlayer(this.id, slot);
				}
				else {
					// Inventory full
					game.sendPlayerMessage(this.id, "Your inventory is full.");
					break;
				}
			}
		}
	}
}
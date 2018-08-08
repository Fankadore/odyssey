'use strict';

// Map Entities
class ClientEntity extends Phaser.Sprite {
	constructor(x, y, spriteSet, sprite) {
		super(game, x * TILE_SIZE, y * TILE_SIZE, spriteSet);
		this.gridPosition = {
			x,
			y
		};
		this.pixelPosition = {
			x: x * TILE_SIZE,
			y: y * TILE_SIZE
		};
		if (sprite < 0) {
			sprite = 0;
		}
		this.sprite = sprite;
		this.frame = this.sprite;
	}
	
	update() {
		super.update();
	}

}

class ClientActor extends ClientEntity {
	constructor(initPack) {
		super(initPack.gridX, initPack.gridY, 'sprites', initPack.sprite * SPRITESHEET_COLUMNS);
		this.anchor.y = 0.5;
		this.name = initPack.name;
		this.sprite = initPack.sprite;
		this.direction = initPack.direction;
		this.isMoving = initPack.isMoving;
		this.isRunning = initPack.isRunning;
		this.isAttacking = initPack.isAttacking;
		this.isDead = initPack.isDead;

		this.moveTimer = 0;
		
		this.displayName = game.add.text(this.x, this.y, this.name, { font: "14px Arial", fill: "#ff8800"});
		this.displayName.anchor.setTo(0.5);
		this.setSprite(this.sprite);
	}
	
	update() {
		super.update();
		
		// Update Sprite Position
		this.x = this.pixelPosition.x;
		this.y = this.pixelPosition.y;
		this.displayName.x = this.x + ((TILE_SIZE / 4) * 2.5);
		this.displayName.y = this.y - ((TILE_SIZE / 4) * 3);
		
		// Update Sprite Frame
		let sprite = this.sprite * SPRITESHEET_COLUMNS;
		
		if (this.isDead) {																// Dead Animation
			this.frame = sprite + 12;
		}
		else if (this.isAttacking) {													// Attacking Animation
			if (this.direction === 'left') {
				this.frame = sprite + 8;
			}
			else if (this.direction === 'right') {
				this.frame = sprite + 11;
			}
			else if (this.direction === 'up') {
				this.frame = sprite + 5;
			}
			else if (this.direction === 'down') {
				this.frame = sprite + 2;
			}
			return;
		}
		else if (this.isMoving) {														// Walking Animation
			if (game.time.now - this.moveTimer >= 200) {
				this.animMove[this.direction].next();
				this.moveTimer = game.time.now;
			}
		}
		else {																				// Turning Animation
			if (this.direction === 'left') {
				if (this.frame === sprite + 7) {
					this.frame = sprite + 7;
				}
				else {
					this.frame = sprite + 6;
				}
			}
			else if (this.direction === 'right') {
				if (this.frame === sprite + 10) {
					this.frame = sprite + 10;
				}
				else {
					this.frame = sprite + 9;
				}
			}
			else if (this.direction === 'up') {
				if (this.frame === sprite + 4) {
					this.frame = sprite + 4;
				}
				else {
					this.frame = sprite + 3;
				}
			}
			else if (this.direction === 'down') {
				if (this.frame === sprite + 1) {
					this.frame = sprite + 1;
				}
				else {
					this.frame = sprite;
				}
			}
		}
	}
	
	setSprite(sprite) {
		let frame = sprite * SPRITESHEET_COLUMNS;
		this.frame = frame + (this.frame % SPRITESHEET_COLUMNS);
		
		this.animMove = [];
		this.animMove['left'] = this.animations.add('moveLeft', [frame + 6, frame + 7], 1, true);
		this.animMove['right'] = this.animations.add('moveRight', [frame + 9, frame + 10], 1, true);
		this.animMove['up'] = this.animations.add('moveUp', [frame + 3, frame + 4], 1, true);
		this.animMove['down'] = this.animations.add('moveDown', [frame, frame + 1], 1, true);
		
		this.animAttack = [];
		this.animAttack['left'] = this.animations.add('attackLeft', [frame + 8]);
		this.animAttack['right'] = this.animations.add('attackRight', [frame + 11]);
		this.animAttack['up'] = this.animations.add('attackUp', [frame + 5]);
		this.animAttack['down'] = this.animations.add('attackDown', [frame + 2]);
	}

	setDead(state) {
		if (state === false) {
			this.displayName.visible = true;
			this.anchor.setTo(0, 0.5);
		}
		else {
			this.displayName.visible = false;
			this.anchor.setTo(0);
		}
	}
}


class ClientPlayer extends ClientActor {
	constructor(initPack) {
		super(initPack);
		this.id = initPack.id;
		
		if (this.id === Client.selfId) {
			if (initPack.health !== undefined) {
				this.health = initPack.health;
			}
			if (initPack.healthMax !== undefined) {
				this.healthMax = initPack.healthMax;
			}
			if (initPack.energy !== undefined) {
				this.energy = initPack.energy;
			}
			if (initPack.energyMax !== undefined) {
				this.energyMax = initPack.energyMax;
			}
			Game.player = this;
		}
		
		ClientPlayer.list[this.id] = this;
		Game.playerGroup.add(this);
	}
}

ClientPlayer.list = {};

class ClientBot extends ClientActor {
	constructor(initPack) {
		super(initPack);
		this.id = initPack.id;
		ClientBot.list[this.id] = this;
		Game.botGroup.add(this);
	}
}

ClientBot.list = {};

class ClientMapItem extends ClientEntity {
	constructor(initPack) {
		super(initPack.gridX, initPack.gridY, 'items', initPack.sprite);
		this.inputEnabled = true;
		
		this.id = initPack.mapIndex;
		this.stack = initPack.stack;
		this.sprite = initPack.sprite;
		this.name = initPack.name;
	
		// Get full name, eg "a Banana" or "an Apple"
		let letter = this.name[0].toLowerCase();
		if (letter === 'a' || letter === 'e' || letter === 'i' || letter === 'o' || letter === 'u') {
			this.fullName = "an " + this.name;
		}
		else {
			this.fullName = "a " + this.name;
		}

		ClientMapItem.list[this.id] = this;
		Game.mapItemGroup.add(this);
	}
}

ClientMapItem.list = {};

class ClientEffect extends ClientEntity {
	constructor(initPack) {			//id, map, x, y, sprite, frame
		let sprite = clamp(initPack.sprite, 1, EFFECTSHEET_ROWS);
		super(initPack.map, initPack.x, initPack.y, 'effects', sprite * EFFECTSHEET_COLUMNS);
		this.anchor.setTo(0, 0.5);
		this.sprite = sprite;
		this.currentFrame = initPack.frame;
		
		this.id = initPack.id;
		this.map = initPack.map;
		this.pixelPosition = {
			x: initPack.x,
			y: initPack.y,
		};
		
		Game.effectGroup.add(this);
		ClientEffect.list[this.id] = this;
	}
	
	update() {
		super.update();
		this.x = this.pixelPosition.x;
		this.y = this.pixelPosition.y;
		this.frame = (this.sprite * EFFECTSHEET_COLUMNS) + this.currentFrame;
	}

}

ClientEffect.list = {};

class ClientText extends Phaser.Text {
	constructor(initPack) {
		let style = {
			font: "14px Arial",
			fill: initPack.colour
		};
		super(game, initPack.x, initPack.y, initPack.message, style);
		this.anchor.setTo(0.5);
		this.id = initPack.id;
		this.map = initPack.map;
		this.pixelPosition = {
			x: initPack.x,
			y: initPack.y,
		};
		Game.textGroup.add(this);
		ClientText.list[this.id] = this;
	}
	
	update() {
		super.update();
		this.x = this.pixelPosition.x;
		this.y = this.pixelPosition.y;
	}

}

ClientText.list = {};


// UI Entities
class ClientUI {
	constructor() {
		// Player Stats
		this.health = 0;
		this.maxHealth = 0;
		this.energy = 0;
		this.maxEnergy = 0;
		this.moveSpeed =0;
		this.attackSpeed = 0;
		this.attackTimer = 0;
		
		// Stat Bars
		this.statBar = new ClientStatBar();
		
		// Inventory and Equipment Slots
		this.slots = [];
		for (let i = 0; i < INVENTORY_SIZE + EQUIPMENT_SIZE; i++) {
			this.slots.push(new ClientInventorySlot(i));
		}
		
		// Selected Inventory Slot
		this.selected = null;
		
		// Info Box
		this.info = new ClientInfo();
	}

	setSelected(slot) {
		// Clear highlight from all slots and clear info box
		for (let i = 0; i < INVENTORY_SIZE + EQUIPMENT_SIZE; i++) {
			this.slots[i].tint = 0xFFFFFF;
		}
		this.info.clear();
		
		if (this.slots[slot]) {
			// Highlight selected slot and show item info
			this.selected = slot;
			this.slots[slot].tint = 0x00FFFF;
			if (ClientInventoryItem.list[slot]) {
				this.info.setToItem(ClientInventoryItem.list[slot]);
			}
			else {
				this.info.clear();
			}
		}
		else {
			this.selected = null;
		}
	}
}

class ClientStatBar {
	constructor() {
		this.health = game.add.sprite(STATBAR_LEFT, STATBAR_TOP, 'healthBar');
		this.energy = game.add.sprite(STATBAR_LEFT, STATBAR_TOP + 16 + 2, 'energyBar');
	}
	
	update() {
		this.health.scale.x = ((UI.health / UI.healthMax) * 100) / 100;
		this.energy.scale.x = ((UI.energy / UI.energyMax) * 100) / 100;
	}
}

class ClientInventorySlot extends Phaser.Sprite {
	constructor(slot) {
		let x = 0;
		let y = 0;
		if (slot < INVENTORY_SIZE) {
			x = findInventoryX(slot);
			y = findInventoryY(slot);
		}
		else {
			x = findEquipmentX(slot);
			y = findEquipmentY(slot);
		}

		super(game, x, y, 'slot');
		this.anchor.setTo(0.5);
		
		Game.UIGroup.add(this);
	}
	
}

class ClientInventoryItem extends Phaser.Sprite {
	constructor(initPack) {
		let x = findInventoryX(initPack.slot);
		let y = findInventoryY(initPack.slot);
		
		// Create Sprite
		super(game, x, y, 'items');
		this.anchor.setTo(0.5);
		this.sprite = initPack.sprite;
		this.frame = this.sprite;

		this.inputEnabled = true;
		this.input.enableDrag(true);
		this.events.onDragStop.add(this.dragStop, this);
		
		// Set Stats
		this.slot = initPack.slot;
		this.name = initPack.name;
		let letter = this.name[0].toLowerCase();
		if (letter === 'a' || letter === 'e' || letter === 'i' || letter === 'o' || letter === 'u') {
			this.fullName = "an " + this.name;
		}
		else {
			this.fullName = "a " + this.name;
		}
		
		this.stack = initPack.stack;
		this.type = initPack.type;
		this.reusable = initPack.reusable;
		
		this.equipped = initPack.equipped;
		this.damageBonus = initPack.damageBonus;
		this.defenceBonus = initPack.defenceBonus;
		this.healthMaxBonus = initPack.healthMaxBonus;
		this.energyMaxBonus = initPack.energyMaxBonus;
		this.rangeBonus = initPack.rangeBonus;
		
		this.clickTime = 0;
		this.clicked = false;
		
		ClientInventoryItem.list[this.slot] = this;
		Game.inventoryItemGroup.add(this);
	}

	dragStop() {
		let x = this.x;
		let y = this.y;
		
		if (isWithinMapBounds(x, y)) {
			x = findGridPosition(x);
			y = findGridPosition(y);
			Client.dragStopGame(this.slot, x, y);
		}
		else {
			x += TILE_SIZE / 2;
			y +=  TILE_SIZE / 2;
			if (isWithinInventoryBounds(x, y)) {
				x = findInventoryGridX(x);
				y = findInventoryGridY(y);
				let newSlot = findInventorySlot(x, y);
				Client.dragStopInventory(this.slot, newSlot);
			}
			else if (isWithinEquipmentBounds(x, y)) {
				x = findEquipmentGridX(x);
				y = findEquipmentGridY(y);
				let newSlot = findEquipmentSlot(x, y);
				Client.dragStopEquipment(this.slot, newSlot);
			}
		}
	}
	
	singleClick() {
		if (this.clicked === false) {
			this.clicked = true;
			this.clickTime = game.time.now;
		}
		else {
			if (game.time.now - this.clickTime < 300) {
				this.clicked = false;
				this.doubleClick();
			}
			else {
				this.clickTime = game.time.now;
			}
		}
	}
	
	doubleClick() {
		Client.doubleClickItem(this.slot);
	}
	
}

ClientInventoryItem.list = {};

class ClientInfo {
	constructor() {
		this.previewPlayer = game.add.sprite(INFO_LEFT, INFO_TOP, "sprites");
		this.previewItem = game.add.sprite(INFO_LEFT, INFO_TOP, "items");
		this.textBox = game.add.text(INFO_LEFT + SLOT_SIZE, INFO_TOP + (SLOT_SIZE / 2), "", {
			font: "14px Arial",
			fill: "#FFF"
		});
		this.textBox.anchor.y = 0.5;
	}
	
	clear() {
		this.previewPlayer.frame = 0;
		this.previewItem.frame = 0;
		this.textBox.text = "";
	}
	
	setToItem(item) {
		if (item) {
			this.previewPlayer.frame = 0;
			this.previewItem.frame = item.sprite;
			if (item.stack > 0) {
				this.textBox.text = item.name + " x" + item.stack;
			}
			else {
				this.textBox.text = item.name;
			}
		}
		else {
			this.clear();
		}
	}
	
	setToPlayer(player) {
		if (player) {
			this.previewItem.frame = 0;
			this.previewPlayer.frame = player.sprite * SPRITESHEET_COLUMNS;
			this.textBox.text = player.name;
		}
		else {
			this.clear();
		}
	}
	
}

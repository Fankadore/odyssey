'use strict';

const Game = {};
const UI = {};

Game.create = function() {
	Game.createMap();
	Game.createGroups();
	UI = new ClientUI();
	Game.createInputs();
	Client.login();
};

Game.createMap = function() {
	Game.map = game.add.tilemap();
	Game.map.addTilesetImage('tiles');
	Game.map.layer0 = Game.map.create('ground1', MAP_COLUMNS, MAP_ROWS, TILE_SIZE, TILE_SIZE);
	Game.map.layer1 = Game.map.createBlankLayer('ground2', MAP_COLUMNS, MAP_ROWS, TILE_SIZE, TILE_SIZE);
	Game.map.layer2 = Game.map.createBlankLayer('background1', MAP_COLUMNS, MAP_ROWS, TILE_SIZE, TILE_SIZE);
	Game.map.layer3 = Game.map.createBlankLayer('background2', MAP_COLUMNS, MAP_ROWS, TILE_SIZE, TILE_SIZE);
	Game.map.layer4 = Game.map.createBlankLayer('foreground1', MAP_COLUMNS, MAP_ROWS, TILE_SIZE, TILE_SIZE);
	Game.map.layer5 = Game.map.createBlankLayer('foreground2', MAP_COLUMNS, MAP_ROWS, TILE_SIZE, TILE_SIZE);
};

Game.createGroups = function() {
	Game.UIGroup = game.add.group();
	Game.mapItemGroup = game.add.group();
	Game.playerGroup = game.add.group();
	Game.botGroup = game.add.group();
	Game.inventoryItemGroup = game.add.group();
	Game.effectGroup = game.add.group();
	Game.textGroup = game.add.group();
};

Game.createInputs = function() {
	// Player Inputs
	keyEnter.onDown.add(function() {
		Client.keyPress('pickUp', true);
	});
	keyEnter.onUp.add(function() {
		Client.keyPress('pickUp', false);
	});
	keyShift.onDown.add(function() {
		Client.keyPress('run', true);
	});
	keyShift.onUp.add(function() {
		Client.keyPress('run', false);
	});
	keyCtrl.onDown.add(function() {
		Client.keyPress('attack', true);
	});
	keyCtrl.onUp.add(function() {
		Client.keyPress('attack', false);
	});
	
	// Player Movement Inputs
	cursors.left.onDown.add(function() {
		if (cursors.lastPressed !== 'left') {
			Client.cursorPress('left');
		}
	});
	cursors.right.onDown.add(function() {
		if (cursors.lastPressed !== 'right') {
			Client.cursorPress('right');
		}
	});
	cursors.up.onDown.add(function() {
		if (cursors.lastPressed !== 'up') {
			Client.cursorPress('up');
		}
	});
	cursors.down.onDown.add(function() {
		if (cursors.lastPressed !== 'down') {
			Client.cursorPress('down');
		}
	});
	
	cursors.left.onUp.add(function() {
		if(cursors.lastPressed === 'left') {
			if (cursors.right.isDown) {
				if (cursors.lastPressed !== 'right') {
					Client.cursorPress('right');
				}
			}
			else if(cursors.up.isDown) {
				if (cursors.lastPressed !== 'up') {
					Client.cursorPress('up');
				}
			}
			else if(cursors.down.isDown) {
				if (cursors.lastPressed !== 'down') {
					Client.cursorPress('down');
				}
			}
			else {
				if (cursors.lastPressed !== null) {
					Client.cursorPress(null);
				}
			}
		}
	});
	cursors.right.onUp.add(function() {
		if(cursors.lastPressed === 'right') {
			if (cursors.left.isDown) {
				if (cursors.lastPressed !== 'left') {
					Client.cursorPress('left');
				}
			}
			else if(cursors.up.isDown) {
				if (cursors.lastPressed !== 'up') {
					Client.cursorPress('up');
				}
			}
			else if(cursors.down.isDown) {
				if (cursors.lastPressed !== 'down') {
					Client.cursorPress('down');
				}
			}
			else {
				if (cursors.lastPressed !== null) {
					Client.cursorPress(null);
				}
			}
		}
	});
	cursors.up.onUp.add(function() {
		if(cursors.lastPressed === 'up') {
			if (cursors.left.isDown) {
				if (cursors.lastPressed !== 'left') {
					Client.cursorPress('left');
				}
			}
			else if(cursors.right.isDown) {
				if (cursors.lastPressed !== 'right') {
					Client.cursorPress('right');
				}
			}
			else if(cursors.down.isDown) {
				if (cursors.lastPressed !== 'down') {
					Client.cursorPress('down');
				}
			}
			else {
				if (cursors.lastPressed !== null) {
					Client.cursorPress(null);
				}
			}
		}
	});
	cursors.down.onUp.add(function() {
		if (cursors.lastPressed === 'down') {
			if (cursors.left.isDown) {
				if (cursors.lastPressed !== 'left') {
					Client.cursorPress('left');
				}
			}
			else if (cursors.right.isDown) {
				if (cursors.lastPressed !== 'right') {
					Client.cursorPress('right');
				}
			}
			else if (cursors.up.isDown) {
				if (cursors.lastPressed !== 'up') {
					Client.cursorPress('up');
				}
			}
			else {
				if (cursors.lastPressed !== null) {
					Client.cursorPress(null);
				}
			}
		}
	});
	
	game.input.mousePointer.leftButton.onDown.add(function() { Game.singleClick() }, Game.player);
	game.input.mousePointer.rightButton.onDown.add(function() {Game.rightClick() }, Game.player);
};

Game.update = function() {
	// Stat Bars Update
	UI.statBar.update();
	
	if (!cursors.left.isDown && !cursors.right.isDown && !cursors.up.isDown && !cursors.down.isDown) {
		Client.cursorPress(null);
	}
};

Game.singleClick = function() {
	let x = game.input.mousePointer.x;
	let y = game.input.mousePointer.y;
	
 	if (isWithinMapBounds(x, y)) {
		x = findGridPosition(x);
		y = findGridPosition(y);
		
		for (let i in ClientMapItem.list) {
			let item = ClientMapItem.list[i];
			if (item) {
				if (item.gridPosition.x === x && item.gridPosition.y === y) {
					console.log("You see " + item.fullName + "!");
				}
			}
		}
		
		for (let i in ClientPlayer.list) {
			let target = ClientPlayer.list[i];
			if (target.gridPosition.x === x & target.gridPosition.y === y) {
				Game.info.setToPlayer(target);
				if (target === Game.player) {
					console.log("You see yourself!");
				}
				else {
					console.log("You see " + target.name + "!");
				}
			}
		}
	}
	else {
		x += SLOT_SIZE / 2;
		y += SLOT_SIZE / 2;
		if (isWithinInventoryBounds(x, y)) {
			x = findInventoryGridX(x);
			y = findInventoryGridY(y);
			let slot = findInventorySlot(x, y);
			
			let item = ClientInventoryItem.list[slot];
			if (item) {
				item.singleClick();
			}
		}
		else if (isWithinEquipmentBounds(x, y)) {
			x = findEquipmentGridX(x);
			y = findEquipmentGridY(y);
			let slot = findEquipmentSlot(x, y);
			
			let item = ClientInventoryItem.list[slot];
			if (item) {
				item.singleClick();
			}
		}
	}
};

Game.rightClick = function() {
	let x = game.input.mousePointer.x;
	let y = game.input.mousePointer.y;
	
 	if (isWithinMapBounds(x, y)) {
		x = findGridPosition(x);
		y = findGridPosition(y);
	}
	else {
		x += SLOT_SIZE / 2;
		y += SLOT_SIZE / 2;
		if (isWithinInventoryBounds(x, y)) {
			x = findInventoryGridX(x);
			y = findInventoryGridY(y);
			let slot = findInventorySlot(x, y);
			let item = ClientInventoryItem.list[slot];
			if (item) {
				Client.rightClickItem(slot);
			}
		}
		else if (isWithinEquipmentBounds(x, y)) {
			x = findEquipmentGridX(x);
			y = findEquipmentGridY(y);
			let slot = findEquipmentSlot(x, y);
			let item = ClientInventoryItem.list[slot];
			if (item) {
				Client.rightClickItem(slot);
			}
		}
	}
};

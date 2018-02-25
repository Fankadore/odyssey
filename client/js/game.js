'use strict';

// Global Constants
const TILE_SIZE = 32;
const SLOT_SIZE = TILE_SIZE + 6;

const MAP_LAYERS = 6;

const MAP_COLUMNS = 12;
const MAP_ROWS = 12;
const MAP_LEFT = 0;																					// x = 0 to 384
const MAP_TOP = 0;																						// y = 0 to 384

const MAP_WIDTH = MAP_COLUMNS * TILE_SIZE;											// width = 384
const MAP_HEIGHT = MAP_ROWS * TILE_SIZE;												// height = 384
const MAP_RIGHT = MAP_LEFT + MAP_WIDTH;
const MAP_BOTTOM = MAP_TOP + MAP_HEIGHT;


const INVENTORY_COLUMNS = 5;
const INVENTORY_ROWS = 4;
const INVENTORY_LEFT = MAP_RIGHT + 32;													// x = 416
const INVENTORY_TOP = MAP_BOTTOM / 4;													// y = 96

const INVENTORY_SIZE = INVENTORY_COLUMNS * INVENTORY_ROWS;			// size = 20
const INVENTORY_WIDTH = INVENTORY_COLUMNS * SLOT_SIZE;					// wdith = 190
const INVENTORY_HEIGHT = INVENTORY_ROWS * SLOT_SIZE;						// height = 152
const INVENTORY_RIGHT = INVENTORY_LEFT + INVENTORY_WIDTH;				// x = 606
const INVENTORY_BOTTOM = INVENTORY_TOP + INVENTORY_HEIGHT;			// y = 248


const EQUIPMENT_LEFT = INVENTORY_LEFT;													// x = 416
const EQUIPMENT_TOP = INVENTORY_BOTTOM + 2;										// y = 250
const EQUIPMENT_COLUMNS = 5;
const EQUIPMENT_ROWS = 1;

const EQUIPMENT_SIZE = EQUIPMENT_COLUMNS * EQUIPMENT_ROWS;			// size = 5
const EQUIPMENT_WIDTH = EQUIPMENT_COLUMNS * SLOT_SIZE;					// width = 190
const EQUIPMENT_HEIGHT = EQUIPMENT_ROWS * SLOT_SIZE;						// height = 38
const EQUIPMENT_RIGHT = EQUIPMENT_LEFT + EQUIPMENT_WIDTH;				// x = 606
const EQUIPMENT_BOTTOM = EQUIPMENT_TOP + EQUIPMENT_HEIGHT;			// y = 288

const INFO_LEFT = EQUIPMENT_LEFT - (SLOT_SIZE / 2);
const INFO_TOP = EQUIPMENT_BOTTOM;
const STATBAR_LEFT = INVENTORY_LEFT;
const STATBAR_TOP = 32;

const SPRITESHEET_COLUMNS = 13;
const SPRITESHEET_ROWS = 13;
const EFFECTSHEET_COLUMNS = 9;
const EFFECTSHEET_ROWS = 70;


// Input Keys
let cursors;
let keyEnter;
let keyShift;
let keyCtrl;
let keyOne;
let keyTwo;
let keyThree;
let keyFour;
let keyFive;


// Global Functions
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

function findGridPosition(x) {			// Takes a pixel position and turns it into a grid position
	return (x - x % TILE_SIZE) / TILE_SIZE;
}

function findInventoryGridX(x) {		// Takes a pixel position and turns it into an inventory grid position
	return (x - ((x - INVENTORY_LEFT) % SLOT_SIZE) - INVENTORY_LEFT) / SLOT_SIZE;
}

function findInventoryGridY(y) {		// Takes a pixel position and turns it into an inventory grid position
	return (y - ((y - INVENTORY_TOP) % SLOT_SIZE) - INVENTORY_TOP) / SLOT_SIZE;
}

function findInventoryX(slot) {			// Takes a slot number and turns it into a pixel position
	return INVENTORY_LEFT + ((slot % INVENTORY_COLUMNS) * SLOT_SIZE);
}

function findInventoryY(slot) {			// Takes a slot number and turns it into a pixel position
	return INVENTORY_TOP + (((slot - (slot % INVENTORY_COLUMNS)) / INVENTORY_COLUMNS) * SLOT_SIZE);
}

function findInventorySlot(gridX, gridY) {			// Takes a grid position and turns it into a slot number
	return (gridY * INVENTORY_COLUMNS) + gridX;
}

function findEquipmentGridX(x) {						// Takes a pixel position and turns it into an equipment grid position
	return (x - ((x - EQUIPMENT_LEFT) % SLOT_SIZE) - EQUIPMENT_LEFT) / SLOT_SIZE;
}

function findEquipmentGridY(y) {						// Takes a pixel position and turns it into an equipment grid position
	return (y - ((y - EQUIPMENT_TOP) % SLOT_SIZE) - EQUIPMENT_TOP) / SLOT_SIZE;
}

function findEquipmentX(slot) {			// Takes a slot number and turns it into a pixel position
	slot = slot - INVENTORY_SIZE;
	slot = clamp(slot, 0, EQUIPMENT_SIZE);
	return EQUIPMENT_LEFT + ((slot % EQUIPMENT_COLUMNS) * SLOT_SIZE);
}

function findEquipmentY(slot) {			// Takes a slot number and turns it into a pixel position
	slot = slot - INVENTORY_SIZE;
	slot = clamp(slot, 0, EQUIPMENT_SIZE);
	return EQUIPMENT_TOP + (((slot - (slot % EQUIPMENT_COLUMNS)) / EQUIPMENT_COLUMNS) * SLOT_SIZE);
}

function findEquipmentSlot(gridX, gridY) {			// Takes a grid position and turns it into a slot number
	return INVENTORY_SIZE + (gridY * EQUIPMENT_COLUMNS) + gridX;
}


function isWithinMapBounds(x, y) {				// Checks if a pixel position is over the map
	return (x >= MAP_LEFT && x < MAP_RIGHT && y >= MAP_TOP && y < MAP_BOTTOM);
}

function isWithinInventoryBounds(x, y) {		// Checks if a pixel position is over the inventory
	return (x >= INVENTORY_LEFT && x < INVENTORY_RIGHT && y >= INVENTORY_TOP && y < INVENTORY_BOTTOM);
}

function isWithinEquipmentBounds(x, y) {		// Checks if a pixel position is over the equipment bar
	return (x >= EQUIPMENT_LEFT && x < EQUIPMENT_RIGHT && y >= EQUIPMENT_TOP && y < EQUIPMENT_BOTTOM);
}


// Create Game
const game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-window');
game.state.add('load', Load);
game.state.add('login', Login);
game.state.add('play', Game);
game.state.start('load');

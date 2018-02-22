'use strict';

module.exports = {
	const FRAMERATE = 30;
	const TILE_SIZE = 32;
	const SLOT_SIZE = TILE_SIZE + 6;

	const MAX_MAPS = 10;
	const MAX_USERS = 100;

	
	const MAP_LAYERS = 6;
	const MAP_COLUMNS = 12;
	const MAP_ROWS = 12;
	const MAP_LEFT = 0;																									// x = 0 to 384
	const MAP_TOP = 0;																										// y = 0 to 384

	const MAP_WIDTH = MAP_COLUMNS * TILE_SIZE;															// width = 384
	const MAP_HEIGHT = MAP_ROWS * TILE_SIZE;																// height = 384
	const MAP_RIGHT = MAP_LEFT + MAP_WIDTH;
	const MAP_BOTTOM = MAP_TOP + MAP_HEIGHT;


	const INVENTORY_COLUMNS = 5;
	const INVENTORY_ROWS = 4;
	const INVENTORY_LEFT = MAP_RIGHT + 32;																	// x = 416
	const INVENTORY_TOP = MAP_BOTTOM / 4;																	// y = 96

	const INVENTORY_SIZE = INVENTORY_COLUMNS * INVENTORY_ROWS;							// size = 20
	const INVENTORY_WIDTH = INVENTORY_COLUMNS * SLOT_SIZE;									// wdith = 190
	const INVENTORY_HEIGHT = INVENTORY_ROWS * SLOT_SIZE;										// height = 152
	const INVENTORY_RIGHT = INVENTORY_LEFT + INVENTORY_WIDTH;								// x = 606
	const INVENTORY_BOTTOM = INVENTORY_TOP + INVENTORY_HEIGHT;							// y = 248


	const EQUIPMENT_LEFT = INVENTORY_LEFT;																	// x = 416
	const EQUIPMENT_TOP = INVENTORY_BOTTOM + 2;														// y = 250
	const EQUIPMENT_COLUMNS = 5;
	const EQUIPMENT_ROWS = 1;

	const EQUIPMENT_SIZE = EQUIPMENT_COLUMNS * EQUIPMENT_ROWS;							// size = 5
	const EQUIPMENT_WIDTH = EQUIPMENT_COLUMNS * SLOT_SIZE;									// width = 190
	const EQUIPMENT_HEIGHT = EQUIPMENT_ROWS * SLOT_SIZE;										// height = 38
	const EQUIPMENT_RIGHT = EQUIPMENT_LEFT + EQUIPMENT_WIDTH;								// x = 606
	const EQUIPMENT_BOTTOM = EQUIPMENT_TOP + EQUIPMENT_WIDTH;							// y = 288


	const SPRITESHEET_COLUMNS = 13;
	const SPRITESHEET_ROWS = 13;
	const EFFECTSHEET_COLUMNS = 9;
	const EFFECTSHEET_ROWS = 70;
	
	const START_MAP = 1;
	const START_X = 5;
	const START_Y = 5;
};
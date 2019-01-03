class Config {
	constructor() {
		// Client Config
		this.MAP_COLUMNS = 12;
		this.MAP_ROWS = 12;
		this.MAP_LAYERS = 6;
		
		this.TILE_SIZE = 32;
		this.SLOT_SIZE = this.TILE_SIZE + 6;
		this.FONT_SIZE = 12;

		this.SPRITE_FRAMES = 13;
		this.SPRITE_COUNT = 13;
		this.EFFECT_FRAMES = 8;

		this.INVENTORY_COLUMNS = 5;
		this.INVENTORY_ROWS = 4;
		this.INVENTORY_SIZE = this.INVENTORY_COLUMNS * this.INVENTORY_ROWS;
		
		this.EQUIPMENT_COLUMNS = 5;
		this.EQUIPMENT_ROWS = 1;
		this.EQUIPMENT_SIZE = this.EQUIPMENT_COLUMNS * this.EQUIPMENT_ROWS;
		
		this.CHATBOX_LINES = 9;

		this.MAP_LEFT = 0;
		this.MAP_TOP = 0;
		this.MAP_WIDTH = this.MAP_COLUMNS * this.TILE_SIZE;
		this.MAP_HEIGHT = this.MAP_ROWS * this.TILE_SIZE;
		this.MAP_RIGHT = this.MAP_LEFT + this.MAP_WIDTH;
		this.MAP_BOTTOM = this.MAP_TOP + this.MAP_HEIGHT;

		this.MENU_LEFT = this.MAP_RIGHT;
		this.MENU_TOP = this.MAP_TOP;
		this.MENU_WIDTH = (this.INVENTORY_COLUMNS * this.SLOT_SIZE) + this.SLOT_SIZE;
		this.MENU_HEIGHT = this.MAP_HEIGHT;
		this.MENU_RIGHT = this.MENU_LEFT + this.MENU_WIDTH;
		this.MENU_BOTTOM = this.MENU_TOP + this.MENU_HEIGHT;
		
		this.MAPNAME_LEFT = this.MENU_LEFT + (this.SLOT_SIZE / 2);
		this.MAPNAME_TOP = this.MENU_TOP + 8;
		this.MAPNAME_WIDTH = this.MENU_WIDTH - this.SLOT_SIZE;
		this.MAPNAME_HEIGHT = this.FONT_SIZE * 2;

		this.STATBAR_WIDTH = this.SLOT_SIZE * 4;
		this.STATBAR_HEIGHT = 12;

		this.STATBOX_LEFT = this.MAP_RIGHT + (this.SLOT_SIZE / 2);
		this.STATBOX_TOP = this.MENU_TOP + this.SLOT_SIZE;
		this.STATBOX_WIDTH = this.STATBAR_WIDTH + this.SLOT_SIZE;
		this.STATBOX_HEIGHT = ((this.STATBAR_HEIGHT + 2) * 4) + 10;
		this.STATBOX_RIGHT = this.STATBOX_LEFT + this.STATBOX_WIDTH;
		this.STATBOX_BOTTOM = this.STATBOX_TOP + this.STATBOX_HEIGHT;

		this.STATBAR_LEFT = this.STATBOX_LEFT + (this.SLOT_SIZE / 2);
		this.STATBAR_TOP = this.STATBOX_TOP + 6;

		this.INVENTORY_LEFT = this.MENU_LEFT + (this.SLOT_SIZE / 2);
		this.INVENTORY_TOP = this.STATBOX_BOTTOM + 9;
		this.INVENTORY_WIDTH = this.INVENTORY_COLUMNS * this.SLOT_SIZE;
		this.INVENTORY_HEIGHT = this.INVENTORY_ROWS * this.SLOT_SIZE;
		this.INVENTORY_RIGHT = this.INVENTORY_LEFT + this.INVENTORY_WIDTH;
		this.INVENTORY_BOTTOM = this.INVENTORY_TOP + this.INVENTORY_HEIGHT;
		
		this.EQUIPMENT_LEFT = this.INVENTORY_LEFT;
		this.EQUIPMENT_TOP = this.INVENTORY_BOTTOM + 1;
		this.EQUIPMENT_WIDTH = this.EQUIPMENT_COLUMNS * this.SLOT_SIZE;
		this.EQUIPMENT_HEIGHT = this.EQUIPMENT_ROWS * this.SLOT_SIZE;
		this.EQUIPMENT_RIGHT = this.EQUIPMENT_LEFT + this.EQUIPMENT_WIDTH;
		this.EQUIPMENT_BOTTOM = this.EQUIPMENT_TOP + this.EQUIPMENT_HEIGHT;

		this.INFOBOX_LEFT = this.MENU_LEFT + (this.SLOT_SIZE / 2);
		this.INFOBOX_TOP = this.EQUIPMENT_BOTTOM + 4;
		this.INFOBOX_WIDTH = this.EQUIPMENT_WIDTH;
		this.INFOBOX_HEIGHT = this.SLOT_SIZE * 2;
		this.INFOBOX_RIGHT = this.INFOBOX_LEFT + this.INFOBOX_WIDTH;
		this.INFOBOX_BOTTOM = this.INFOBOX_TOP + this.INFOBOX_HEIGHT;

		this.INFOPREVIEW_WIDTH = this.SLOT_SIZE;
		this.INFOPREVIEW_HEIGHT = this.SLOT_SIZE;
		this.INFOPREVIEW_LEFT = this.INFOBOX_LEFT + 6;
		this.INFOPREVIEW_TOP = this.INFOBOX_TOP + (this.FONT_SIZE * 1.2) + 10;
		this.INFOPREVIEW_RIGHT = this.INFOPREVIEW_LEFT + this.INFOPREVIEW_WIDTH;

		this.CHATBOX_LEFT = this.MAP_LEFT;
		this.CHATBOX_TOP = this.MAP_BOTTOM;
		this.CHATBOX_WIDTH = this.MAP_WIDTH + this.MENU_WIDTH;
		this.CHATBOX_HEIGHT = this.FONT_SIZE * (this.CHATBOX_LINES + 3);
		this.CHATBOX_RIGHT = this.CHATBOX_LEFT + this.CHATBOX_WIDTH;
		this.CHATBOX_BOTTOM = this.CHATBOX_TOP + this.CHATBOX_HEIGHT;
		this.CRENDALE = {
			mapId: 1,
			tiles: [
				[
					[1, 2, 3, 4, 5, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
				],
				[
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
				],
				[
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
				],
				[
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
				],
				[
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
				],
				[
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
				]
			],
			isWall: [
				[true, true, true, true, true, true, false, false, false, false, true, true],
				[true, true, true, false, false, false, false, false, false, false, true, true],
				[true, true, false, false, false, false, true, true, false, false, true, true],
				[true, false, false, true, true, false, false, false, false, true, true, true],
				[true, false, false, false, false, false, false, false, false, true, true, true],
				[false, false, false, false, true, false, false, false, false, false, true, true],
				[false, false, false, false, false, false, false, false, false, false, true, true],
				[true, false, false, false, false, false, false, false, false, false, false, true],
				[true, false, false, false, false, false, false, true, true, false, false, true],
				[true, true, true, false, false, false, false, false, false, false, false, true],
				[true, false, false, false, false, false, false, false, false, false, false, true],
				[true, false, false, false, false, false, false, false, false, true, true, true]
			]
		};

		if (this.EQUIPMENT_BOTTOM > this.MENU_BOTTOM) {
			this.MENU_HEIGHT = this.INVENTORY_HEIGHT + this.EQUIPMENT_HEIGHT + (this.TILE_SIZE * 2);
			this.MENU_BOTTOM = this.MENU_TOP + this.MENU_HEIGHT;
			this.CHATBOX_WIDTH = this.MAP_WIDTH;
			this.CHATBOX_RIGHT = this.CHATBOX_LEFT + this.CHATBOX_WIDTH;
		}

		if (this.MENU_BOTTOM > this.CHATBOX_BOTTOM) {
			this.CHATBOX_BOTTOM = this.MENU_BOTTOM;
			this.CHATBOX_HEIGHT = this.CHATBOX_BOTTOM - this.CHATBOX_TOP;
		}

		this.WIDTH = this.MAP_WIDTH + this.MENU_WIDTH;
		this.HEIGHT = this.MAP_HEIGHT + this.CHATBOX_HEIGHT;
	}
}

const config = new Config();
export default config;
class Config {
	constructor() {
		// Client Config
		this.TILE_SIZE = 32;
		this.SLOT_SIZE = this.TILE_SIZE + 4;

		this.FONT = {
			fontFamily: 'Arial',
			fontSize: '12px',
			height: 14,
			fill: '#000000'
		};

		this.SPRITE_FRAMES = 13;
		this.SPRITE_COUNT = 13;
		this.EFFECT_FRAMES = 8;

		this.MAX_HEALTH_BASE = 200;
		this.MAX_ENERGY_BASE = 200;
		this.MAX_DAMAGE_BASE = 255;
		this.MAX_DEFENCE_BASE = 255;
		this.MAX_RANGE_BASE = 11;
		this.MAX_HEALTH_REGEN_BASE = 255;
		this.MAX_ENERGY_REGEN_BASE = 255;
		this.MAX_HEALTH_PER_LEVEL = 255;
		this.MAX_ENERGY_PER_LEVEL = 255;

		this.GAME = {
			x: 0,
			y: 0,
			width: 800,
			height: 556
		};
		this.GAME.centreX = this.GAME.x + (this.GAME.width / 2);
		this.GAME.centreY = this.GAME.y + (this.GAME.height / 2);

		this.MAP = {
			x: this.GAME.x + 3,
			y: this.GAME.y + 3,
			layers: 6,
			columns: 12,
			rows: 12
		};
		this.MAP.width = this.MAP.columns * this.TILE_SIZE;
		this.MAP.height = this.MAP.rows * this.TILE_SIZE;
		this.MAP.centreX = this.MAP.x + (this.MAP.width / 2);
		this.MAP.centreY = this.MAP.y + (this.MAP.height / 2);

		this.INVENTORY = {
			x: this.GAME.x + 452,
			y: this.GAME.y + 86,
			columns: 5,
			rows: 4
		};
		this.INVENTORY.size = this.INVENTORY.columns * this.INVENTORY.rows;
		this.INVENTORY.width = this.INVENTORY.columns * this.SLOT_SIZE;
		this.INVENTORY.height = this.INVENTORY.rows * this.SLOT_SIZE;
		this.INVENTORY.centreX = this.INVENTORY.x + (this.INVENTORY.width / 2);
		this.INVENTORY.centreY = this.INVENTORY.y + (this.INVENTORY.height / 2);

		this.EQUIPMENT = {
			x: this.INVENTORY.x,
			y: this.INVENTORY.y + this.INVENTORY.height + 2,
			columns: this.INVENTORY.columns,
			rows: 1
		};
		this.EQUIPMENT.size = this.EQUIPMENT.columns * this.EQUIPMENT.rows;
		this.EQUIPMENT.width = this.EQUIPMENT.columns * this.SLOT_SIZE;
		this.EQUIPMENT.height = this.EQUIPMENT.rows * this.SLOT_SIZE;
		this.EQUIPMENT.centreX = this.EQUIPMENT.x + (this.EQUIPMENT.width / 2);
		this.EQUIPMENT.centreY = this.EQUIPMENT.y + (this.EQUIPMENT.height / 2);

		this.MAPNAME = {
			x: this.GAME.x + 394,
			y: this.GAME.y + 6,
			width: 241,
			height: 18
		};
		this.MAPNAME.centreX = this.MAPNAME.x + (this.MAPNAME.width / 2);
		this.MAPNAME.centreY = this.MAPNAME.y + (this.MAPNAME.height / 2);

		this.STATBOX = {
			x: this.GAME.x + 480,
			y: this.GAME.y + 32,
			width: 151,
			height: 44
		};
		this.STATBOX.centreX = this.STATBOX.x + (this.STATBOX.width / 2);
		this.STATBOX.centreY = this.STATBOX.y + (this.STATBOX.height / 2);

		this.CHATBOX = {
			x: this.GAME.x + 3,
			y: this.GAME.y + 394,
			width: 793,
			height: 128,
			style: {fontFamily: this.FONT.fontFamily, fontSize: this.FONT.fontSize, fill: '#ffffff'}
		};
		this.CHATBOX.centreX = this.CHATBOX.x + (this.CHATBOX.width / 2);
		this.CHATBOX.centreY = this.CHATBOX.y + (this.CHATBOX.height / 2);		

		this.CHATINPUT = {
			x: this.GAME.x + 3,
			y: this.GAME.y + 527,
			width: 793,
			height: 24
		};
		this.CHATINPUT.centreX = this.CHATINPUT.x + (this.CHATINPUT.width / 2);
		this.CHATINPUT.centreY = this.CHATINPUT.y + (this.CHATINPUT.height / 2);

		this.INFOBOX = {
			x: this.GAME.x + 400,
			y: this.GAME.y + 300,
			width: 390,
			height: 84
		};
		this.INFOBOX.centreX = this.INFOBOX.x + (this.INFOBOX.width / 2);
		this.INFOBOX.centreY = this.INFOBOX.y + (this.INFOBOX.height / 2);
		
		this.PREVIEW = {
			x: 400,
			y: 256,
			width: 32,
			height: 32
		};
		this.PREVIEW.centreX = this.PREVIEW.x + (this.PREVIEW.width / 2);
		this.PREVIEW.centreY = this.PREVIEW.y + (this.PREVIEW.height / 2);

		this.SPRITESHEETS = ['sprites', 'effects', 'floor', 'potions'];
		this.IMAGES = [
			'map', 'interface', 'chatbox-input', 'chatbox-input-active', 'selected',
			'health-bar', 'health-bar-empty', 'energy-bar', 'energy-bar-empty',
			'mana-bar', 'mana-bar-empty', 'experience-bar', 'experience-bar-empty',
			'background-small', 'background-medium', 'background-large',
			'text-input', 'text-input-active', 'number-input', 'number-input-active',
			'toggle', 'toggle-active', 'toggle-slim', 'toggle-slim-active',
			'button-light', 'button-light-active', 'button-slim', 'button-slim-active',
			'close-button', 'close-button-active', 'logout-button', 'logout-button-active'
		];
		this.KEYBOARD_KEYS = 'LEFT,RIGHT,UP,DOWN,SPACE,BACKSPACE,DELETE,CONTROL,SHIFT,ALT,ALTGRAPH,ENTER,TAB,ESCAPE,CAPS_LOCK,PAGE_UP,PAGE_DOWN,HOME,END,INSERT,F1,F2,F3,F4,F5,F6,F7,F8,F9,F10,F11,F12,BACKTICK';
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
	}
}

const config = new Config();
export default config;

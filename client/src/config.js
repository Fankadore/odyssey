"use strict";

class Config {
	constructor() {
		// Shared Config
		this.MAP_COLUMNS = 12;
		this.MAP_ROWS = 12;
		this.SPRITE_COUNT = 13;

		// Client Config
		this.TILESIZE = 32;
		this.FONT_SIZE = 12;
		this.MAP_WIDTH = this.MAP_COLUMNS * this.TILESIZE;
		this.MAP_HEIGHT = this.MAP_ROWS * this.TILESIZE;

		this.MENU_WIDTH = 7 * this.TILESIZE;
		this.MENU_HEIGHT = this.MAP_HEIGHT;

		this.CHATBOX_WIDTH = this.MAP_WIDTH + this.MENU_WIDTH;
		this.CHATBOX_HEIGHT = 5 * this.TILESIZE;

		this.WIDTH = this.MAP_WIDTH + this.MENU_WIDTH;
		this.HEIGHT = this.MAP_HEIGHT + this.CHATBOX_HEIGHT;
	}
}

const config = new Config();
export default config;
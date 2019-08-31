import config from '../config.js';
import util from '../util.js';

export default class Map {
	constructor(mapId, data = {}) {
		this.mapId = mapId;

		if (data.name == null) data.name = "Blank Map";
		if (data.dropChance == null) data.dropChance = 100;
		if (data.dropAmountEQ == null) data.dropAmountEQ = 1;
		if (!data.tiles) data.tiles = util.create3dArray(config.MAP_COLUMNS, config.MAP_ROWS, config.MAP_LAYERS, 0);
		if (!data.isWall) data.isWall = util.create2dArray(config.MAP_COLUMNS, config.MAP_ROWS, false);
		if (!data.isHostile) data.isHostile = util.create2dArray(config.MAP_COLUMNS, config.MAP_ROWS, false);
		if (!data.damage) data.damage = util.create2dArray(config.MAP_COLUMNS, config.MAP_ROWS, null);
		if (!data.warpMap) data.warpMap = util.create2dArray(config.MAP_COLUMNS, config.MAP_ROWS, null);
		if (!data.warpX) data.warpX = util.create2dArray(config.MAP_COLUMNS, config.MAP_ROWS, null);
		if (!data.warpY) data.warpY = util.create2dArray(config.MAP_COLUMNS, config.MAP_ROWS, null);
		if (!data.exitLeft) data.exitLeft = 0;
		if (!data.exitRight) data.exitRight = 0;
		if (!data.exitUp) data.exitUp = 0;
		if (!data.exitDown) data.exitDown = 0;

		this.name = data.name;
		this.dropChance = util.clamp(data.dropChance, 0, 100);
		this.dropAmountEQ = util.clamp(data.dropAmountEQ, 0, config.EQUIPMENT_SIZE);
		//this.dropChance = 0 = 0% chance to drop items in inventory (drop nothing), 100 = 100% chance to drop (drop everything)
		//this.dropAmountEQ = number of equipped items the player will drop on death. dropEQ = EQUIPMENT_SIZE = drop all equipment
		this.tiles = data.tiles;
		this.isWall = data.isWall;
		this.isHostile = data.isHostile;
		this.damage = data.damage;
		this.warpMap = data.warpMap;
		this.warpX = data.warpX;
		this.warpY = data.warpY;
		this.exitLeft = data.exitLeft;
		this.exitRight = data.exitRight;
		this.exitUp = data.exitUp;
		this.exitDown = data.exitDown;
	}
	
	upload(data) {
		if (data.name != null) this.name = data.name;
		if (data.dropChance != null) this.dropChance = data.dropChance;
		if (data.dropAmountEQ != null) this.dropAmountEQ = data.dropAmountEQ;
		if (data.tiles) this.tiles = data.tiles;
		if (data.isWall) this.isWall = data.isWall;
		if (data.isHostile) this.isHostile = data.isHostile;
		if (data.damage) this.damage = data.damage;
		if (data.warpMap) this.warpMap = data.warpMap;
		if (data.warpX) this.warpX = data.warpX;
		if (data.warpY) this.warpY = data.warpY;
		if (data.exitLeft) this.warpY = data.exitLeft;
		if (data.exitRight) this.warpY = data.exitRight;
		if (data.exitUp) this.warpY = data.exitUp;
		if (data.exitDown) this.warpY = data.exitDown;
	}

	getPack() {
		return {
			mapId: this.mapId,
			name: this.name,
			dropChance: this.dropChance,
			dropAmountEQ: this.dropAmountEQ,
			tiles: this.tiles,
			isWall: this.isWall,
			isHostile: this.isHostile,
			damage: this.damage,
			warpMap: this.warpMap,
			warpX: this.warpX,
			warpY: this.warpY,
			exitLeft: this.exitLeft,
			exitRight: this.exitRight,
			exitUp: this.exitUp,
			exitDown: this.exitDown,
		};
	}

	getUpdatePack() {
		return {
			mapId: this.mapId,
			name: this.name,
			tiles: this.tiles
		};
	}
}

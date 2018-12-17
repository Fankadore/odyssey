import config from '../config.js';

// An Entity is any object which can appear on the map

export default class Entity {
	constructor(mapId, x, y, sprite = 1) {
		this.mapId = mapId;
		this.x = x;
		this.y = y;
		if (sprite < 1) sprite = 1;
		this.sprite = sprite;
		this.isVisible = true;
	}
}

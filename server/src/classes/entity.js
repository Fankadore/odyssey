import config from '../config.js';

// An Entity is any object that appears on the map

export default class Entity {
	constructor(map, x, y, sprite = 0) {
		this.map = map;
		this.x = x;
		this.y = y;
		if (sprite < 0) {
			sprite = 0;
		}
		this.sprite = sprite;
		this.isVisiable = true;
	}
}
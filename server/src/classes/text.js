import game from '../game.js';
import util from '../util.js';

export default class Text {
	constructor(map, x, y, message, colour = '#000000', velX = 0, velY = 0) {
		this.map = map;
		this.x = x;
		this.y = y;
		this.message = message;
		this.colour = colour;
		
		this.velX = velX;
		this.velY = velY;
		this.timer = 0;

		this.id = util.firstEmptyIndex(game.mapList[this.map].texts);
		game.mapList[this.map].texts[this.id] = this;
	}
	
	update(delta) {
		this.timer += delta;
		if (this.timer > 3) {
			this.remove();
		}

		this.x += this.velX;
		this.y += this.velY;

		return this.getPack();
	}
	
	getPack() {
		return {
			id: this.id,
			map: this.map,
			x: this.x,
			y: this.y,
			message: this.message,
			colour: this.colour
		};
	}

	remove() {
		delete game.mapList[this.map].texts[this.id];
	}
}

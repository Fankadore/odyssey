import game from '../game.js';
import config from '../config.js';
import util from '../util.js';

export default class Effect {
	constructor(map, x, y, sprite, speed, loop = 1, maxFrames = 7, startFrame = 0) {
		this.sprite = clamp(sprite, 1, config.MAX_EFFECTS);
		this.maxFrames = clamp(maxFrames, 1, 7);
		this.startFrame = clamp(startFrame, 0, this.maxFrames);
		this.frame = this.startFrame;

		this.x *= config.TILE_SIZE;
		this.y *= config.TILE_SIZE;
		
		this.speed = speed;
		this.loop = loop;
		this.timer = 0;
		
		this.id = util.firstEmptyIndex(game.mapList[this.map].effects);
		game.mapList[this.map].effects[this.id] = this;
	}
	
	update(delta) {
		this.timer += delta;
		
		if (this.timer >= this.speed) {
			this.timer = 0;

			if (this.frame > this.maxFrames) {
				if (this.loop < 0) {
					this.frame = this.startFrame;
				}
				else if (this.loop >= 1) {
					this.frame = this.startFrame;
					this.loop--;
				}
				else {
					this.remove();
				}
			}
			else {
				this.frame++;
			}
		}

		return this.getPack();
	}
	
	getPack() {
		return {
			id: this.id,
			map: this.map,
			x: this.x,
			y: this.y,
			sprite: this.sprite,
			frame: this.frame
		};
	}
	
	remove() {
		delete game.mapList[this.map].effects[this.id];
	}	
}
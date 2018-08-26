import game from '../game.js';
import config from '../config.js';
import util from '../util.js';

export default class Effect {
	constructor(mapId, x, y, sprite, speed, loop = 1, maxFrames = 7, startFrame = 0) {
		this.sprite = util.clamp(sprite, 1, config.MAX_EFFECTS);
		this.maxFrames = util.clamp(maxFrames, 1, 7);
		this.startFrame = util.clamp(startFrame, 0, this.maxFrames);
		this.frame = this.startFrame;
		
		this.speed = speed;
		this.loop = loop;
		this.timer = 0;
		
		this.id = util.firstEmptyIndex(game.mapList[this.mapId].effects);
		game.mapList[this.mapId].effects[this.id] = this;
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
			mapId: this.mapId,
			x: this.x,
			y: this.y,
			sprite: this.sprite,
			frame: this.frame
		};
	}
	
	remove() {
		delete game.mapList[this.mapId].effects[this.id];
	}	
}
import config from '../../config.js';
import Entity from './entity.js';

export default class Effect extends Entity {
  constructor(scene, data) {
    super(scene, data.gameId, data.x, data.y, data.sprite, 'effects').setOrigin(0, 0.5);
    this.update(data);
  }

  onUpdate(data) {
    if (data.x != null) this.x = config.MAP.x + (data.x * config.TILE_SIZE);
    if (data.y != null) this.y = config.MAP.y + (data.y * config.TILE_SIZE);
    if (data.currentFrame != null && data.currentFrame !== this.currentFrame) {
      this.currentFrame = data.currentFrame;
      if (data.sprite == null || data.sprite === this.sprite) this.setFrame();
    }
    if (data.sprite != null && data.sprite !== this.sprite) {
      this.sprite = data.sprite;
      this.setFrame();
    }
  }

	setFrame() {
    const frame = (this.sprite * config.EFFECT_FRAMES) + this.currentFrame;
		if (!this.frame || this.frame.name !== frame) super.setFrame(frame);
	}
}

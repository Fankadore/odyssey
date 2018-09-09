import Entity from './entity.js';
import config from '../config.js';

export default class Effect extends Entity {
  constructor(scene, data) {
    super(scene, data.id, data.x, data.y, data.sprite, 'effects');
  }

  update(data) {
    if (data.x != null) this.x = data.x * config.TILE_SIZE;
    if (data.y != null) this.y = data.y * config.TILE_SIZE;
    if (data.sprite != null) this.sprite = data.sprite;
    if (data.frame != null) this.currentFrame = data.frame;
  }
}
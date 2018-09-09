import config from '../config.js';
import Phaser from '../lib/phaser.js';

export default class Entity extends Phaser.GameObjects.Sprite {
  constructor(scene, id, x, y, sprite, spritesheet) {
    super(scene, x * config.TILE_SIZE, y * config.TILE_SIZE, spritesheet, sprite);
    this.id = id;
    this.grid = {
      x,
      y
    };
    this.sprite = sprite;
    this.setOrigin(0, 0);
    scene.add.existing(this);
  }
}

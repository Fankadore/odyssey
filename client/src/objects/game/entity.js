import Phaser from '../../lib/phaser.js';
import config from '../../config.js';

export default class Entity extends Phaser.GameObjects.Sprite {
  constructor(scene, gameId, x, y, sprite, spritesheet) {
    super(scene, x * config.TILE_SIZE, y * config.TILE_SIZE, spritesheet, sprite);
    this.gameId = gameId;
    this.grid = {
      x,
      y
    };
    this.sprite = sprite;
    this.setOrigin(0, 0);
    scene.add.existing(this);
  }

  setFrame(frame) {
    super.setFrame(frame);
  }
}

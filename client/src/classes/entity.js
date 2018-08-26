"use strict";

import config from '../config.js';
import Phaser from '../lib/phaser.js';

export default class Entity extends Phaser.GameObjects.Sprite {
  constructor(scene, id, name, x, y, sprite, spritesheet) {
    super(scene, x * config.TILE_SIZE, y * config.TILE_SIZE, spritesheet);
    this.id = id;
    this.name = name;
    this.grid = {
      x,
      y
    };
    this.sprite = sprite;
    this.setOrigin(0, 0);
    this.setTexture(spritesheet, sprite);
    scene.add.existing(this);
  }
}

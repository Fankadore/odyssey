"use strict";

import config from '../config.js';
import Phaser from '../lib/phaser.js';

class Entity extends Phaser.GameObjects.Sprite {
  constructor(scene, id, name, x, y, sprite, spritesheet) {
    super(scene, x * config.TILESIZE, y * config.TILESIZE, spritesheet);
    this.id = id;
    this.name = name;
    this.grid = {
      x,
      y
    };
    this.sprite = sprite;
    scene.add.existing(this);
  }
}

export default Entity;

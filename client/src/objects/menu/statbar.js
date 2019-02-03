import { Panel } from '../../lib/phaser-ui.js';

export default class StatBar extends Panel {
  constructor(scene, x, y, fullBarTexture, emptyBarTexture) {
    super(scene, x, y, true);

    // Empty Bar
    this.empty = scene.add.image(x, y, emptyBarTexture).setOrigin(0, 0);
    this.width = this.empty.width;
    this.height = this.empty.height;
    
    // Full Bar
    this.full = scene.add.image(x, y, fullBarTexture).setOrigin(0, 0);
    
    // Bar Mask
    this.graphics = scene.make.graphics();
    this.drawMask();
    this.full.setMask(this.graphics.createGeometryMask());

    this.children = [this.empty, this.full, this.graphics];
  }
	
	setPosition(x, y, z, w) {
		super.setPosition(x, y, z, w);
    this.drawMask();
  }
  
  drawMask(value = 1, max = 1) {
		if (this.graphics) {
			this.graphics.clear();
      this.graphics.fillRect(this.x, this.y, this.width * (value / max), this.height);
		}
  }

  onUpdate(value, max) {
    this.drawMask(value, max);
  }
}

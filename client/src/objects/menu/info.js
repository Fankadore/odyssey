import config from '../../config.js';

export default class Infobox {
  constructor(scene, x, y, width, height) {
    this.title = null;
    this.message = null;

    const graphics = scene.add.graphics({ lineStyle: { width: 2, color: 0xaa0000 }, fillStyle: { color: 0x0000aa } });
    const rect = new Phaser.Geom.Rectangle();
    rect.width = width;
    rect.height = height;
    graphics.fillRectShape(rect);
    graphics.strokeRectShape(rect);
    this.title = scene.add.text(x, y, "", { fontFamily: 'Arial', fontSize: '24px', fill: '#ffffff' });
    this.message = scene.add.text(x, y + 24, "", { fontFamily: 'Arial', fontSize: '24px', fill: '#ffffff' });
  }
  
  setMessage(message) {
    this.message.setText(message);
  }

	clear() {
    this.message.setText("");
	}
}

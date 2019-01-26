import Phaser from '../../lib/phaser.js';

export default class InfoPanel extends Phaser.GameObjects.Shape {
  constructor(scene, x, y, width, height) {
    super(scene);
    this.graphics = scene.graphics;
    this.shape = new Phaser.Geom.Rectangle(x, y, width, height);
    
    this.graphics.setLineStyle({ lineStyle: { width: 2, color: 0xaa0000 }, fillStyle: { color: 0x0000aa } });
    graphics.fillRectShape(this.shape);
    graphics.strokeRectShape(this.shape);

    let style = { fontFamily: 'Arial', fontSize: '24px', fill: '#ffffff' }
    this.title = scene.add.text(x, y, "", style);
    this.message = scene.add.text(x, y + 24, "", style);
  }
  
  setMessage(message) {
    this.message.setText(message);
  }

	clear() {
    this.message.setText("");
	}
}

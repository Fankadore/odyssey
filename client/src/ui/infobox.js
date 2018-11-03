import config from '../config.js';

export default class Infobox {
  constructor() {
    this.preview = null;
    this.name = null;
    this.description = null;
  }
  
  create(scene) {
    scene.add.image(config.INFOBOX_LEFT, config.INFOBOX_TOP, 'infobox').setOrigin(0, 0);
		scene.add.image(config.INFOPREVIEW_LEFT, config.INFOPREVIEW_TOP, 'info-preview').setOrigin(0, 0);
    this.preview = scene.add.sprite(config.INFOPREVIEW_LEFT + 3, config.INFOPREVIEW_TOP + 3, 'potions').setOrigin(0, 0);
    this.name = scene.add.text(config.INFOPREVIEW_LEFT, config.INFOPREVIEW_TOP - (config.FONT_SIZE * 1.2) - 7, "", { fontFamily: 'Arial', fontSize: (config.FONT_SIZE * 1.2) + 'px', fill: '#ffffff' });
    this.description = scene.add.text(config.INFOPREVIEW_RIGHT + 7, config.INFOPREVIEW_TOP, "", { fontFamily: 'Arial', fontSize: (config.FONT_SIZE * 0.9) + 'px', fill: '#ffffff' });
  }

  setPreview(sprite, name, description, stack) {
		this.preview.setFrame(sprite);
		if (stack > 0) name = `${name} x${stack}`;
		this.name.setText(name);
		this.description.setText(description);
	}
	
	clear() {
		this.preview.setFrame(0);	
    this.name.setText("");
    this.description.setText("");
	}
}

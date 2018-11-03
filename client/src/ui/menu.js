import config from '../config.js';

export default class Menu {
  constructor(scene) {
		this.mapName = "";
		const style = { fontFamily: 'Arial', fontSize: (config.FONT_SIZE * 1.5) + 'px', fill: '#ff0000' };
		const x = config.MAPNAME_LEFT + (config.MAPNAME_WIDTH / 2);
		const y = config.MAPNAME_TOP + (config.MAPNAME_HEIGHT / 2);
    this.mapNameText = scene.add.text(x, y, this.mapName, style).setOrigin(0.5);
    this.menuView = 'inventory';
  }

	create(scene) {
    scene.add.image(config.MENU_LEFT, config.MENU_TOP, 'menu').setOrigin(0).setDepth(-1);
		scene.add.image(config.INVENTORY_LEFT, config.INVENTORY_TOP, 'menu-panel').setOrigin(0).setDepth(-1);
    scene.add.image(config.MAPNAME_LEFT, config.MAPNAME_TOP, 'map-name').setOrigin(0).setDepth(-1);
	}

  onLoadMap(mapName) {
		this.mapName = mapName;
		this.mapNameText.setText(this.mapName);
	}

  displayInventory() {
		this.menuView = 'inventory';
	}
	
	displayOptions() {
		this.menuView = 'options';
  }
  
	displayPlayers() {
		this.menuView = 'players';
	}
}

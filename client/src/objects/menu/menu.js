import util from '../../lib/util.js';
import config from '../../config.js';

import Statbox from './statbox.js';
import Inventory from './inventory.js';
import Infobox from './infobox.js';

export default class Menu {
	constructor(scene) {
		this.scene = scene;
		scene.add.image(config.MENU_LEFT, config.MENU_TOP, 'menu').setOrigin(0).setDepth(-1);
		
		// Create Menu Panel
		scene.add.image(config.INVENTORY_LEFT, config.INVENTORY_TOP, 'menu-panel').setOrigin(0).setDepth(-1);
		
		// Create Menu Info
		scene.add.image(config.MAPNAME_LEFT, config.MAPNAME_TOP, 'map-name').setOrigin(0).setDepth(-1);
		const style = { fontFamily: 'Arial', fontSize: (config.FONT_SIZE * 1.5) + 'px', fill: '#ff0000' };
		const x = config.MAPNAME_LEFT + (config.MAPNAME_WIDTH / 2);
		const y = config.MAPNAME_TOP + (config.MAPNAME_HEIGHT / 2);
		this.mapName = scene.add.text(x, y, scene.initData.name, style).setOrigin(0.5);
		
		this.statbox = new Statbox(scene);
		this.inventory = new Inventory(scene);
		this.infobox = new Infobox(scene);
	}

	onUpdate(data) {
		if (this.statbox) this.statbox.onUpdate(data);
		if (this.inventory) this.inventory.onUpdate(data.inventory);
		if (this.chatbox) this.chatbox.onUpdate(data.messages);
	}
	
	onLoadMap(mapName) {
		this.mapName.setText(mapName);
	}

	clickInventory(x, y, rightClick) {
		const slotX = this.inventory.getSlotXFromX(x, config.INVENTORY_LEFT);
		const slotY = this.inventory.getSlotYFromY(y, config.INVENTORY_TOP);
		const slot = util.getIndexFromXY(slotX, slotY, config.INVENTORY_COLUMNS);
		this.clickSlot(slot, rightClick);
	}

	clickEquipment(x, y, rightClick) {
		const slotX = this.inventory.getSlotXFromX(x, config.EQUIPMENT_LEFT);
		const slotY = this.inventory.getSlotYFromY(y, config.EQUIPMENT_TOP);
		const slot = config.INVENTORY_SIZE + util.getIndexFromXY(slotX, slotY, config.EQUIPMENT_COLUMNS);
		this.clickSlot(slot, rightClick);
	}

	clickSlot(slot, rightClick) {
		if (rightClick) {
			this.clearItemInfo();
			if (this.inventory.hasItemInSlot(slot)) this.scene.client.emitInputClick('rightClickItem', slot);
		}
		else {
			const data = this.inventory.clickSlot(slot);
			if (data.item) {
				this.infobox.setPreview(data.item);
				if (data.doubleClick) this.scene.client.emitInputClick('doubleClickItem', slot);
			}
			else {
				this.infobox.clear();
			}
		}
	}

	clearItemInfo() {
		this.inventory.setSelected(null);
		this.infobox.clear();
	}
}

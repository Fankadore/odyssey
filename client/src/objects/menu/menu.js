import util from '../../lib/util.js';
import config from '../../config.js';

import { Button } from '../../lib/phaser-ui.js';
import StatBarPanel from '../../panels/statbarpanel.js';
import Inventory from './inventory.js';
import Preview from './preview.js';
import Infobox from './infobox.js';

export default class Menu {
	constructor(scene) {
		this.scene = scene;
		this.background = scene.add.image(config.GAME.x, config.GAME.y, 'interface').setOrigin(0).setDepth(-2);

		const style = { fontFamily: 'Arial', fontSize: '18px', fill: '#ff0000' };
		this.mapName = scene.add.text(config.MAPNAME.centreX, config.MAPNAME.centreY, scene.initData.name, style).setOrigin(0.5);
		this.statbox = new StatBarPanel(scene, config.STATBOX.x, config.STATBOX.y);
		this.inventory = new Inventory(scene, config.INVENTORY.x, config.INVENTORY.y);
		this.preview = new Preview(scene, config.PREVIEW.centreX, config.PREVIEW.centreY);
		this.infobox = new Infobox(scene, config.INFOBOX.x, config.INFOBOX.y);
		this.logoutButton = new Button(scene, config.GAME.x + config.GAME.width - 9, config.GAME.y + 9, 'logout-button', 'logout-button-active', "", null, () => {
			scene.client.emitLogOut();
		});
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
		const slotX = this.inventory.getSlotXFromX(x, config.INVENTORY.x);
		const slotY = this.inventory.getSlotYFromY(y, config.INVENTORY.y);
		const slot = util.getIndexFromXY(slotX, slotY, config.INVENTORY.columns);
		this.clickSlot(slot, rightClick);
	}

	clickEquipment(x, y, rightClick) {
		const slotX = this.inventory.getSlotXFromX(x, config.EQUIPMENT.x);
		const slotY = this.inventory.getSlotYFromY(y, config.EQUIPMENT.y);
		const slot = config.INVENTORY.size + util.getIndexFromXY(slotX, slotY, config.EQUIPMENT.columns);
		this.clickSlot(slot, rightClick);
	}

	clickSlot(slot, rightClick) {
		if (rightClick) {
			this.clearItemInfo();
			if (this.inventory.hasItemInSlot(slot)) this.scene.client.emitInputClick('rightClickItem', slot);
			return;
		}

		const data = this.inventory.clickSlot(slot);
		if (!data.item) {
			this.infobox.clear();
			this.preview.clear();
			return;
		}

		this.infobox.setSelected(data.item);
		this.preview.setSelected(data.item);
		if (data.doubleClick) {
			this.scene.client.emitInputClick('doubleClickItem', slot);
			this.clearItemInfo();
		}
	}

	clearItemInfo() {
		this.inventory.setSelected(null);
		this.infobox.clear();
		this.preview.clear();
	}
}

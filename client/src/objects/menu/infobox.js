import Phaser from '../../lib/phaser.js';
import config from '../../config.js';

export default class Infobox extends Phaser.GameObjects.Container {
	constructor(scene, x, y) {
		super(scene, x, y);

		// Item Info
		const style = { fontFamily: 'Arial', fontSize: '14px', fill: '#ffffff' }
		this.name = scene.add.text(328, -13, "", style).setOrigin(0.5);
		this.description = scene.add.text(0, 0, "", style).setFontSize(11);
		this.add([this.name, this.description]);
		scene.add.existing(this);
	}

	setSelected(item) {
		let name = item.name;
		if (item.stack > 0) name = `${name} x${stack}`;
		this.name.setText(name);
		let description = [];
		if (item.equipped.damage) description.push(`Damage: +${item.equipped.damage}`);
		if (item.equipped.defence) description.push(`Defence: +${item.equipped.defence}`);
		this.description.setText(description);
	}
	
	clear() {
		this.name.setText("");
		this.description.setText("");
	}
}

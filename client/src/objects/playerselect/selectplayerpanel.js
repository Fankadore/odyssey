import Phaser from '../../lib/phaser.js';

import Panel from '../ui/panel.js';
import ButtonLightSlim from '../ui/buttonlightslim.js';

export default class SelectPlayerPanel extends Phaser.GameObjects.Container {
	constructor(scene, x, y) {
		super(scene, x, y);
		
		// Panel
		this.background = new Panel(scene, 0, 0, 'panel-large');

		// Title
		let style = { fontFamily: 'Arial', fontSize: '36px', fill: '#ffffff' };
		this.title = scene.add.text(0, -132, "Player Select", style).setOrigin(0.5);
		
		// Add Player Button
		this.addPlayerButton = new ButtonLightSlim(scene, 0, -64, "Add Player", () => scene.switchPanel());

		// Player Select Buttons
		this.playerButtons = [];
		if (scene.players) {
			for (let i = 0; i < scene.players.length; i++) {
				const player = scene.players[i];
				this.playerButtons[i] = new ButtonLightSlim(scene, 0, (i * 32), player.name, (button) => {
					const index = this.playerButtons.indexOf(button);
					scene.client.emitLogIn(scene.players[index]._id);
				});
			}

			this.signOutButton = new ButtonLightSlim(scene, 0, 160, "Sign Out", () => scene.client.emitSignOut());
		}

		this.add([this.background, this.title, this.addPlayerButton, this.signOutButton].concat(this.playerButtons));
		scene.add.existing(this);
	}
}

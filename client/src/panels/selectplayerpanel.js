import { Panel } from '../lib/phaser-ui.js';
import ButtonLightSlim from '../objects/ui/buttonlightslim.js';
import ToggleLightSlim from '../objects/ui/togglelightslim.js';

export default class SelectPlayerPanel extends Panel {
	constructor(scene, x, y) {
		super(scene, x, y, true);

		// Background
		this.background = scene.add.image(x, y, 'background-large');

		// Title
		let style = { fontFamily: 'Arial', fontSize: '36px', fill: '#ffffff' };
		this.title = scene.add.text(x, y - 132, "Player Select", style).setOrigin(0.5);

		// Sign Out Button
		this.signOutButton = new ButtonLightSlim(scene, x - 78, y - 64, "Sign Out", () => scene.client.emitSignOut());

		// Add Player Button
		this.addPlayerButton = new ButtonLightSlim(scene, x + 78, y - 64, "Add Player", () => scene.switchPanel());

		// Player Select Toggles
		this.activeToggle = null;
		this.playerToggles = [];
		if (scene.players.length > 0) {
			for (let i = 0; i < scene.players.length; i++) {
				const player = scene.players[i];
				this.playerToggles[i] = new ToggleLightSlim(scene, x, y + (i * 32), player.name, () => {
					scene.client.emitLogIn(player._id);
				});
			}
			this.setActiveToggle(this.playerToggles[0]);
		}

		scene.input.on('gameobjectover', (pointer, gameObject) => {
			if (this.playerToggles.includes(gameObject)) {
				this.setActiveToggle(gameObject);
			}
		});

		this.children = [this.background, this.title, this.addPlayerButton, this.signOutButton].concat(this.playerToggles);
		this.setActive(true);
	}

	setActiveToggle(toggle) {
		if (this.activeToggle) this.activeToggle.onUp();
		this.activeToggle = toggle;
		this.activeToggle.onDown();
	}

	selectPrevToggle() {
		if (this.playerToggles.length === 0) return;

		let index = this.playerToggles.indexOf(this.activeToggle);
		if (index - 1 < 0) index = this.playerToggles.length - 1;
		else index--;
		this.setActiveToggle(this.playerToggles[index]);
	}
	
	selectNextToggle() {
		if (this.playerToggles.length === 0) return;

		let index = this.playerToggles.indexOf(this.activeToggle);
		if (index + 1 >= this.playerToggles.length) index = 0;
		else index++;
		this.setActiveToggle(this.playerToggles[index]);
	}

	selectPlayer() {
		if (this.playerToggles.length > 0) {
			const index = this.playerToggles.indexOf(this.activeToggle);
			this.scene.client.emitLogIn(this.scene.players[index]._id);
		}
		else {
			this.scene.switchPanel();
		}
	}

	onKeyDown(key) {
		if (key === 'ArrowUp') {
			this.selectPrevToggle();
		}
		else if (key === 'ArrowDown') {
			this.selectNextToggle();
		}
		else if (key === 'Tab') {	//	Switch selected player
			this.selectNextToggle();
		}
		else if (key === 'Enter') {	// Select player
			this.selectPlayer();
		}
		else if (key === 'Escape') {	// Sign out
			this.scene.client.emitSignOut();
		}
		else if (key === 'Home') {
			if (this.scene.account.admin) {
				console.log("WORKS");
			}
		}
	}
}

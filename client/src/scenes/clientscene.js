import { Scene } from '../lib/phaser.js';

export default class ClientScene extends Scene {
	constructor() {
		super({key: 'clientScene', active: true});
	}

	init() {
		this.socket = null;
		this.gameData = {};
		this.uiData = {};
	}

	create() {
		this.socket = io.connect();
		this.socket.on('update', (data) => this.onUpdate(data));
		this.socket.on('loadMap', (data) => this.onLoadMap(data));
		this.socket.emit('login');
	}

	update(time, delta) {
		const game = this.scene.get('gameScene');
		const ui = this.scene.get('uiScene');
		game.onUpdate(this.gameData, delta);
		ui.onUpdate(this.uiData, delta);
		this.uiData.messages = [];
	}

	onUpdate(data) {
		if (data) {
			this.gameData = data.game;
			this.uiData = data.ui;
		}
	}
	
	onLoadMap(data) {
		if (data) {
			const game = this.scene.get('gameScene');
			game.loadMap(data);
		}
	}

	emitInput(input, state) {
		this.socket.emit('input', {
			input,
			state
		});
	}

	emitInputMove(direction) {
		this.socket.emit('input', {
			input: 'move',
			direction
		});
	}

	emitInputClick(input, slot) {
		this.socket.emit('input', {
			input,
			slot
		});
	}
	
	emitInputDrag(input, slot, newSlot) {
		this.socket.emit('input', {
			input,
			slot,
			newSlot
		});
	}
}

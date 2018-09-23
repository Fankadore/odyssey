import { Scene } from '../lib/phaser.js';

export default class ClientScene extends Scene {
	constructor() {
		super({key: 'clientScene', active: true});
	}

	init() {
		this.socket = null;
	}

	create() {
		const game = this.scene.get('gameScene');
		const ui = this.scene.get('uiScene');

		this.socket = io.connect();
		
		this.socket.on('update', (data) => {
			game.onUpdate(data.game);
			ui.onUpdate(data.ui);
		});
		this.socket.on('loadMap', (data) => {
			game.onLoadMap(data.tiles);
			ui.onLoadMap(data.name);
		});

		this.socket.emit('login');
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

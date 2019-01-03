import { Scene } from '../lib/phaser.js';

export default class ClientScene extends Scene {
	constructor() {
		super({key: 'clientScene', active: true});
	}

	init() {
		this.socket = null;
		this.account = null;
	}

	create() {
		this.socket = io.connect();
		
		this.socket.on('signedIn', (data) => this.onSignedIn(data));
		this.socket.on('signedOut', () => this.onSignedOut());
		this.socket.on('loggedIn', (data) => this.onLoggedIn(data));
		this.socket.on('loggedOut', () => this.onLoggedOut());
		this.socket.on('loadMap', (data) => this.onLoadMap(data));
		this.socket.on('update', (data) => this.onUpdate(data));
		
		setTimeout(() => this.emitSignIn("Fank", "asd"), 500);
		setTimeout(() => this.emitLogIn("Fankadore"), 2000);
	}
	
	onSignedIn(data) {
		// Show create/select player scene
		this.account = {
			email: data.email,
			verified: data.verified,
			//dateCreated: data.dateCreated
		};
	}
	onSignedOut() {
		// Show signup/signin scene
		this.account = null;
	}
	onLoggedIn(data) {
		// Show game scene
	}
	onLoggedOut() {
		// Show create/select character scene
	}
	onLoadMap(data) {
		const game = this.scene.get('gameScene');
		const ui = this.scene.get('uiScene');
		game.onLoadMap(data.tiles);
		ui.onLoadMap(data);
	}
	onUpdate(data) {
		const game = this.scene.get('gameScene');
		const ui = this.scene.get('uiScene');
		game.onUpdate(data.game);
		ui.onUpdate(data.ui);
	}

	emitSignUp(username, password, email) {
		this.socket.emit('signup', {
			username,
			password,
			email
		});
	}
	emitSignIn(username, password) {
		this.socket.emit('signin', {
			username,
			password
		});
	}
	emitSignOut() {
		this.socket.emit('signout');
	}

	emitAddPlayer(name, templateName) {
		this.socket.emit('addPlayer', {
			name,
			templateName
		});
	}
	emitLogIn(name) {
		this.socket.emit('login', name);
	}
	emitLogOut() {
		this.socket.emit('logout');
	}

	emitAddPlayerTemplate(data) {
		this.socket.emit('addPlayerTemplate', data);
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
	
	emitCommand(command, ...args) {
		this.socket.emit('input', {
			input: command,
			args
		});
	}
	emitUploadMap(data) {
		this.socket.emit('uploadMap', data);
	}
}

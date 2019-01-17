import { Scene } from '../lib/phaser.js';

export default class ClientScene extends Scene {
	constructor() {
		super({key: 'clientScene'});
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
		this.scene.launch('signInScene');
	}
	
	onSignedIn(data) {
		if (data) {
			// Show create/select player scene
			this.account = data.account;
			this.players = data.players;
			this.emitLogIn(this.players[0].name);
		}
	}
	onSignedOut() {
		// Show signup/signin scene
		this.account = null;
	}
	onLoggedIn(mapData) {
		if (mapData) {
			this.scene.stop('signInScene');
			this.scene.launch('playScene', mapData);
		}
	}
	onLoggedOut() {
		// Show create/select character scene
	}
	onLoadMap(mapData) {
		const play = this.scene.get('playScene');
		play.onLoadMap(mapData);
	}

	onUpdate(data) {
		const play = this.scene.get('playScene');
		play.onUpdate(data);
	}

	emitSignUp(username, password, email) {
		this.socket.emit('signup', {username, password, email});
	}
	emitSignIn(username, password) {
		this.socket.emit('signin', {username, password});
	}
	emitSignOut() {
		this.socket.emit('signout');
	}

	emitAddPlayer(name, templateName) {
		this.socket.emit('addPlayer', {name, templateName});
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
		this.socket.emit('input', {input, state});
	}
	emitInputMove(direction) {
		this.socket.emit('input', {input: 'move', direction});
	}
	emitInputClick(input, slot) {
		this.socket.emit('input', {input, slot});
	}
	emitInputDrag(input, slot, newSlot) {
		this.socket.emit('input', {input, slot, newSlot});
	}
	
	emitCommand(command, ...args) {
		this.socket.emit('input', {input: command, args});
	}
	emitUploadMap(data) {
		this.socket.emit('uploadMap', data);
	}
}

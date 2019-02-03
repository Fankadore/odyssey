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
		this.socket.on('disconnect', () => this.onDisconnect());
		this.socket.on('signedUp', (data) => this.onSignedUp(data));
		this.socket.on('signedIn', (data) => this.onSignedIn(data));
		this.socket.on('signedOut', () => this.onSignedOut());
		this.socket.on('loggedIn', (data) => this.onLoggedIn(data));
		this.socket.on('loggedOut', () => this.onLoggedOut());
		this.socket.on('loadMap', (data) => this.onLoadMap(data));
		this.socket.on('update', (data) => this.onUpdate(data));
		this.socket.on('playerAdded', (playerId) => this.onPlayerAdded(playerId));
		
		this.scene.launch('signInScene');
	}

	onDisconnect() {
		this.onSignedOut();
	}
	
	onSignedUp(data) {
		if (data) {
			this.socket.emit('signin', data);
		}
		else {
			console.log("Account already exists with that username.");
		}
	}
	onSignedIn(data) {
		if (data) {
			this.scene.stop('signInScene');
			this.scene.launch('playerSelectScene', data);
		}
		else {
			console.log("Incorrect username/password.");
		}
	}
	onSignedOut() {
		if (this.scene.isActive('playerSelectScene')) this.scene.stop('playerSelectScene');
		else if (this.scene.isActive('playScene')) this.scene.stop('playScene');

		this.scene.launch('signInScene');
		this.account = null;
	}
	onPlayerAdded(playerId) {
		if (playerId) {
			this.emitLogIn(playerId);
		}
		else {
			console.log("Player already exists with that name.");
		}
	}
	onLoggedIn(mapData) {
		if (mapData) {
			this.scene.stop('playerSelectScene');
			this.scene.launch('playScene', mapData);
		}
	}
	onLoggedOut() {
		this.scene.stop('playScene');
		this.scene.launch('playerSelectScene');
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

	emitAddPlayer(name, templateId) {
		this.socket.emit('addPlayer', {name, templateId});
	}
	emitLogIn(playerId) {
		this.socket.emit('login', playerId);
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
	emitMapChat(message) {
		this.socket.emit('input', {input: 'mapChat', message});
	}
	
	emitCommand(command, ...args) {
		this.socket.emit('input', {input: command, args});
	}
	emitUploadMap(data) {
		this.socket.emit('uploadMap', data);
	}
}

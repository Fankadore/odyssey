import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
import path from 'path';

import db from './db.js';
import game from './game.js';
import config from './config.js';
import util from './util.js';

class Server {
	constructor() {
		const app = express();
		const server = http.Server(app);
		const io = socketIO(server);
		const port = process.env.PORT || config.PORT;
		const publicPath = path.resolve(__dirname, '../client');
		
		app.get('/', (req, res) => res.sendFile(publicPath + '/index.html'));
		app.use('/client', express.static(publicPath));
		server.listen(port, () => db.log(`Server started. Listening on ${server.address().port}`));

		this.socketList = [];
		io.sockets.on('connection', (socket) => this.onConnect(socket));
	}

	// Receive data from clients
	onConnect(socket) {
		socket.id = util.firstEmptyIndex(this.socketList);
		this.socketList[socket.id] = socket;
		db.log(`New Connection: Id ${socket.id}`);
		
		socket.on('disconnect', () => this.onDisconnect(socket.id));
		socket.on('login', () => this.onLogin(socket.id));
		socket.on('logout', () => this.onLogout(socket.id));
	}

	onDisconnect(id) {
		if (game.playerList[id]) {
			game.playerLogout(id);
		}
		delete this.socketList[id];
		db.log(`Disconnected: Id ${id}`);
	}

	onLogin(id) {		
		// Create Player
		let player = game.playerLogin(id);
		
		// Receive Inputs
		let socket = this.socketList[id];
		socket.on('input', (data) => player.onInput(data));
	}
	
	onLogout(id) {
		game.playerLogout(id);
	}
	
	// Send data to clients
	sendUpdatePack(updatePack) {
		game.playerList.forEach((player) => {
			let pack = {};
			
			pack.game = updatePack.maps[player.mapId];
			pack.game.players = updatePack.players.filter((playerData) => {
				return (playerData.mapId === player.mapId && (playerData.isVisible || playerData.id === player.id));
			});

			pack.ui = player.getPrivatePack();
			pack.ui.messages = updatePack.messages.filter((message) => {
				return ((message.mapId == null && message.id == null) || player.mapId === message.mapId || player.id === message.id);
			});

			let socket = this.socketList[player.id];
			socket.emit('update', pack);
		});
	}
	
	sendMapData(mapId) {
		game.playerList.forEach((player) => {
			if (player.mapId === mapId) {
				let socket = this.socketList[player.id];
				socket.emit('loadMap', db.map[mapId]);
			}
		});
	}

}

const server = new Server();
export default server;

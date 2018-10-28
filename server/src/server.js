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
		const httpServer = http.Server(app);
		const io = socketIO(httpServer);
		const port = process.env.PORT || config.PORT;
		const publicPath = path.resolve(__dirname, '../client');
		
		app.get('/', (req, res) => res.sendFile(publicPath + '/index.html'));
		app.use('/client', express.static(publicPath));
		httpServer.listen(port, () => db.log(`Server started. Listening on port ${httpServer.address().port}...`));

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
		socket.on('input', (data) => this.onInput(player, data));

		// Send Map Data
		this.sendMapData(player.id, player.mapId);
	}
	
	onLogout(id) {
		game.playerLogout(id);
	}
	
	async onInput(player, data) {
		switch (data.input) {
			case null:
			case 'move': player.input.direction = data.direction;
			break;
			case 'run': player.input.run = data.state;
			break;
			case 'pickup':
				if (!player.input.pickup && data.state) {
					player.pickUp();
				}
				player.input.pickup = data.state;
			break;
			case 'attack':
			player.input.attack = data.state;
				if (!player.isDead) player.attack(1, player.direction);
			break;
			case 'doubleClickItem':
				if (player.inventory[data.slot]) {
					if (!player.isDead) player.useItem(data.slot);
				}
			break;
			case 'rightClickItem':
				if (player.inventory[data.slot]) {
					if (!player.isDead) player.dropItem(data.slot);
				}
			break;
			case 'dragStopGame':
				if (player.inventory[data.slot]) {
					if (!player.isDead) player.dropItem(data.slot);
				}
			break;
			case 'dragStopInventory':
			case 'dragStopEquipment':
				if (player.inventory[data.slot]) {
					if (!player.isDead) player.moveItemToSlot(data.slot, data.newSlot);
				}
			break;
			case 'serverChat': game.sendMessageGlobal(player.id, `${player.name} yells, "${data.message}"`);
			break;
			case 'mapChat': game.sendMessageMap(player.id, player.mapId, `${player.name} says, "${data.message}"`);
			break;
			case 'playerChat':
				let target = player.playerList[data.targetId];
				if (target) {
					game.sendMessagePlayer(player.id, target.id, `${player.name} whispers, "${data.message}"`);
					game.sendMessagePlayer(player.id, player.id, `You whisper to ${target.name}, "${data.message}"`);
				}
			break;

			// God Inputs
			case 'spawnMapItem':
				if (player.adminAccess >= 2) {
					game.spawnMapItem(data.args[0], data.args[1], data.args[2], data.args[3], data.args[4]);
				}
				else {
					game.sendGameInfoPlayer(player.id, `You don't have access to that command.`);
				}
			break;
			case 'spawnBot':
				if (player.adminAccess >= 2) {
					game.spawnBot(data.args[0], data.args[1], data.args[2], data.args[3]);
				}
				else {
					game.sendGameInfoPlayer(player.id, `You don't have access to that command.`);
				}
			break;
			case 'uploadMap':
				if (player.adminAccess >= 2) {
					await db.saveMapData(data);
		
					game.playerList.forEach((player) => {
						if (player.mapId === data.id) {
							this.sendMapData(player.id, player.mapId);
						}
					});
				}
				else {
					game.sendGameInfoPlayer(player.id, `You don't have access to that command.`);
				}
			break;
		}
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
	
	sendMapData(id, mapId) {
		let socket = this.socketList[id];
		socket.emit('loadMap', db.getMapData(mapId));
	}

}

const server = new Server();
export default server;

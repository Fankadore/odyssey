import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
import path from 'path';

import db from './db.js';
import game from './game.js';
import config from './config.js';

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

		this.socketList = {};
		this.activeAccounts = {};

		io.sockets.on('connection', socket => this.onConnect(socket));
	}

	/* connect => signin => selectplayer
	** connect when page loads - shows signin page
	** signin when username and password is submitted
 	** selectplayer when character is chosen - logs into the game
	*/

	// Receive data from clients
	onConnect(socket) {
		this.socketList[socket.id] = socket;
		db.log(`${socket.id} - Socket connected.`);
		
		socket.on('disconnect', () => this.onDisconnect(socket));
		socket.on('signup', (data) => this.onSignUp(data.username, data.password, data.email));
		socket.on('signin', (data) => this.onSignIn(socket, data.username, data.password));
		socket.on('signout', () => this.onSignOut(socket));
		// Tell client they have connected
	}

	async onDisconnect(socket) {
		if (socket.playerId != null && game.players[socket.playerId]) await this.onLogOut(socket);
		if (socket.accountId && this.activeAccounts[socket.accountId]) await this.onSignOut(socket);

		db.log(`${socket.id} - Socket disconnected.`);
		delete this.socketList[socket.id];
	}

	async onSignUp(username, password, email) {
		let success = await db.addAccount(username, password, email);
		if (success) {
			console.log("Tell client signup was successful");
		}
		else {
			console.log("Tell client signup was not successful");
		}
	}

	async onSignIn(socket, username, password) {
		let success = await db.authAccount(username, password);
		if (!success) {
			console.log(`Sign in failed on username ${username}`);
			// Tell client signin was not successful
			return;
		}

		let accountId = await db.getAccountId(username);
		if (this.activeAccounts[accountId]) {
			console.log("That account is already signed in.");
			// Tell client that account is already signed in
			return;
		}
		
		socket.accountId = accountId;
		this.activeAccounts[accountId] = username;

		socket.on('addPlayer', (data) => this.onAddPlayer(socket, data.name, data.templateName));
		socket.on('login', (name) => this.onLogIn(socket, name));
		socket.on('logout', () => this.onLogOut(socket));
		socket.on('addPlayerTemplate', (data) => this.onAddPlayerTemplate(data));

		db.log(`${socket.id} - ${username} signed in.`);
		this.sendSignedIn(socket);
	}
	
	async onSignOut(socket) {
		if (socket.playerId != null) await this.onLogOut(socket);
		
		if (socket.accountId) {
			const username = this.activeAccounts[socket.accountId];
			db.log(`${socket.id} - ${username} signed out.`);
			delete this.activeAccounts[socket.accountId];
			socket.accountId = null;
			this.sendSignedOut(socket);
		}
	}

	async onAddPlayer(socket, name, templateId) {
		let success = await db.addPlayer(socket.accountId, name, templateId);
		if (success) {
			const username = this.activeAccounts[socket.accountId];
			db.log(`${socket.id} - ${name} has been added as a player to account ${username}.`);
			// Tell client add player was successful
		}
		else {
			// Tell client add player was not successful
		}
	}
	
	async onAddPlayerTemplate(data) {
		let success = await db.addPlayerTemplate(data);
		if (success) {
			game.loadPlayerTemplates();
			db.log(`${socket.id} - ${data.name} has been added as a player template.`);
			// Tell client add player was successful
		}
		else {
			// Tell client add player was not successful
		}
	}

	async onLogIn(socket, name) {
		if (!socket.accountId) {
			console.log("Not signed into account.");
			return;
		}
		if (socket.playerId != null) {
			console.log("Already logged in.");
			return;
		}

		let playerData = await db.getPlayer(name);
		if (!playerData) {
			console.log("No player with that name.");
			return;
		}

		if (""+socket.accountId !== ""+playerData.account) {	// Cast to string before comparison
			db.log(`Attempt to login to player (${playerData.name}) from wrong account (${socket.accountId}) on socket ${socket.id}.`);
			return;
		}

		const player = game.playerLogin(socket.id, playerData);
		if (!player) return;
	
		socket.playerId = player.gameId;
		socket.on('input', (data) => this.onInput(player, data));
		this.sendMapData(socket, player.mapId);
	}
	
	async onLogOut(socket) {
		if (socket.playerId != null) {
			await game.playerLogout(socket.playerId);
			socket.playerId = null;
		}
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
			case 'serverChat': game.sendMessageGlobal(player.gameId, `${player.name} yells, "${data.message}"`);
			break;
			case 'mapChat': game.sendMessageMap(player.gameId, player.mapId, `${player.name} says, "${data.message}"`);
			break;
			case 'playerChat':
				let target = game.players[data.targetId];
				if (target) {
					game.sendMessagePlayer(player.gameId, target.gameId, `${player.name} whispers, "${data.message}"`);
					game.sendMessagePlayer(player.gameId, player.gameId, `You whisper to ${target.name}, "${data.message}"`);
				}
			break;

			// God Inputs
			case 'spawnMapItem':
				if (player.adminAccess >= 2) {
					game.spawnMapItem(data.args[0], data.args[1], data.args[2], data.args[3], data.args[4]);
				}
				else {
					game.sendGameInfoPlayer(player.gameId, `You don't have access to that command.`);
				}
			break;
			case 'spawnBot':
				if (player.adminAccess >= 2) {
					game.spawnBot(data.args[0], data.args[1], data.args[2], data.args[3]);
				}
				else {
					game.sendGameInfoPlayer(player.gameId, `You don't have access to that command.`);
				}
			case 'setSprite':
				if (player.adminAccess >= 2) {
					player.sprite = data.args[0];
				}
				else {
					game.sendGameInfoPlayer(player.gameId, `You don't have access to that command.`);
				}
			break;
			case 'uploadMap':
				if (player.adminAccess < 2) {
					game.sendGameInfoPlayer(player.gameId, `You don't have access to that command.`);
					return;
				}

				let success = await db.saveMap(data);
				if (!success) {
					console.log("Failed to upload map.");
					return;
				}

				game.players.forEach((player) => {
					if (player.mapId === data.mapId) {
						this.sendMapData(this.socketList[player.socketId], player.mapId);
					}
				});
			break;
		}
	}

	// Send data to clients
	sendUpdatePack(updatePack) {
		game.players.forEach((player) => {
			const pack = {
				game: {
					players: []
				},
				ui: player.getUIPack()
			};

			for (let playerData of updatePack.players) {
				if (playerData && (playerData.mapId === player.mapId && (playerData.isVisible || playerData.socketId === player.socketId))) {
					pack.game.players[playerData.gameId] = playerData;
				}
			}
			// pack.game.players = updatePack.players.filter((playerData) => {
			// 	return (playerData.mapId === player.mapId && (playerData.isVisible || playerData.socketId === player.socketId));
			// });
			pack.game.bots = updatePack.bots.filter(bot => {
				return bot.mapId === player.mapId;
			});
			pack.game.items = updatePack.items.filter(item => {
				return item.mapId === player.mapId;
			});
			pack.game.effects = updatePack.effects.filter(effect => {
				return effect.mapId === player.mapId;
			});
			pack.game.texts = updatePack.texts.filter(text => {
				return text.mapId === player.mapId;
			});

			pack.ui.messages = updatePack.messages.filter((message) => {
				return ((message.mapId == null && message.id == null) || player.mapId === message.mapId || player.gameId === message.id);
			});
			
			this.socketList[player.socketId].emit('update', pack);
		});
	}
	
	sendMapData(socket, mapId) {
		const mapData = game.maps[mapId].getPack();
		socket.emit('loadMap', mapData);
	}

	async sendSignedIn(socket) {
		let account = await db.getAccount(socket.accountId);
		socket.emit('signedIn', {
			email: account.email,
			verified: account.verified,
			//dateCreated: account.dateCreated
		});
	}

	sendSignedOut(socket) {
		socket.emit('signedOut');
	}
}

const server = new Server();
export default server;

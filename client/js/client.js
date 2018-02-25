'use strict';
//TEEEEEESTINGGG

const Client = {};

Client.connect = function() {
	Client.socket = io.connect();
	Client.selfId = null;

	Client.socket.on('init', function(data) {
		if (data.selfId >= 0) {
			if (Client.selfId === null) {
				Client.selfId = data.selfId;
			}
		}
		if (data.players) {
			for (let i = 0; i < data.players.length; i++) {
				new ClientPlayer(data.players[i]);
			}
		}
		if (data.items) {
			for (let i in data.items) {
				new ClientMapItem(data.items[i]);
			}
		}
		if (data.bots) {
			for (let i = 0; i < data.bots.length; i++) {
				new ClientBot(data.bots.items[i]);
			}
		}
		if (data.effects) {
			for (let i = 0; i < data.effects.length; i++) {
				new ClientEffect(data.effects[i]);
			}
		}
		if (data.texts) {
			for (let i = 0; i < data.texts.length; i++) {
				new ClientText(data.texts[i]);
			}
		}
		if (data.inventory) {
			for (let i = 0; i < data.inventory.length; i++) {
				new ClientInventoryItem(data.inventory[i]);
			}
		}
		if (data.self) {
			let pack = data.self;
			if (pack.health !== undefined) {
				UI.health = pack.health;
			}
			if (pack.healthMax !== undefined) {
				UI.healthMax = pack.healthMax;
			}
			if (pack.energy !== undefined) {
				UI.energy = pack.energy;
			}
			if (pack.energyMax !== undefined) {
				UI.energyMax = pack.energyMax;
			}
			if (pack.moveSpeed !== undefined) {
				UI.moveSpeed = pack.moveSpeed;
			}
			if (pack.attackSpeed !== undefined) {
				UI.attackSpeed = pack.attackSpeed;
			}
			if (pack.attackTimer !== undefined) {
				UI.attackTimer = pack.attackTimer;
			}
		}
	});
	Client.socket.on('update', function(data) {
		if (data.players) {
			for (let i = 0; i < data.players.length; i++) {
				let pack = data.players[i];
				let player = ClientPlayer.list[pack.id];
				if (player) {
					if (pack.name !== undefined) {
						player.name = pack.name;
					}
					if (pack.pixelX !== undefined) {
						player.pixelPosition.x = pack.pixelX;
					}
					if (pack.pixelY !== undefined) {
						player.pixelPosition.y = pack.pixelY;
					}
					if (pack.gridX !== undefined) {
						player.gridPosition.x = pack.gridX;
					}
					if (pack.gridY !== undefined) {
						player.gridPosition.y = pack.gridY;
					}
					if (pack.direction !== undefined) {
						player.direction = pack.direction;
					}
					if (pack.sprite !== undefined) {
						if (player.sprite !== pack.sprite) {
							player.sprite = pack.sprite;
							player.setSprite(pack.sprite);
						}
					}
					if (pack.isMoving !== undefined) {
						player.isMoving = pack.isMoving;
					}
					if (pack.isAttacking !== undefined) {
						player.isAttacking = pack.isAttacking;
					}
					if (pack.isDead !== undefined) {
						if (player.isDead !== pack.isDead) {
							player.isDead = pack.isDead;
							player.setDead(pack.isDead);
						}
					}

					if (pack.health !== undefined) {
						player.health = pack.health;
					}
					if (pack.healthMax !== undefined) {
						player.healthMax = pack.healthMax;
					}
					if (pack.energy !== undefined) {
						player.energy = pack.energy;
					}
					if (pack.energyMax !== undefined) {
						player.energyMax = pack.energyMax;
					}
				}
			}
		}
		if (data.items) {
			for (let i = 0; i < data.items.length; i++) {
				let pack = data.items[i];
				let mapItem = ClientMapItem.list[pack.mapIndex];
				if (mapItem) {
					if (pack.gridX !== undefined) {
						mapItem.gridPosition.x = pack.gridX;
					}
					if (pack.gridY !== undefined) {
						mapItem.gridPosition.y = pack.gridY;
					}
					if (pack.name !== undefined) {
						mapItem.name = pack.name;
					}
					if (pack.sprite !== undefined) {
						mapItem.sprite = pack.sprite;
					}
					if (pack.stack !== undefined) {
						mapItem.stack = pack.stack;
					}
				}
			}
		}
		if (data.bots) {
			for (let i = 0; i < data.bots.length; i++) {
				let pack = data.bots[i];
				let bot = ClientBot.list[pack.mapIndex];
				if (bot) {
					if (pack.name !== undefined) {
						bot.name = pack.name;
					}
					if (pack.pixelX !== undefined) {
						bot.pixelPosition.x = pack.pixelX;
					}
					if (pack.pixelY !== undefined) {
						bot.pixelPosition.y = pack.pixelY;
					}
					if (pack.gridX !== undefined) {
						bot.gridPosition.x = pack.gridX;
					}
					if (pack.gridY !== undefined) {
						bot.gridPosition.y = pack.gridY;
					}
					if (pack.direction !== undefined) {
						bot.direction = pack.direction;
					}
					if (pack.sprite !== undefined) {
						if (bot.sprite !== pack.sprite) {
							bot.setSprite(pack.sprite);
						}
					}
					if (pack.isMoving !== undefined) {
						bot.isMoving = pack.isMoving;
					}
					if (pack.isRunning !== undefined) {
						bot.isRunning = pack.isRunning;
					}
					if (pack.isAttacking !== undefined) {
						bot.isAttacking = pack.isAttacking;
					}
					if (pack.isDead !== undefined) {
						if (bot.isDead !== pack.isDead) {
							bot.setDead(pack.isDead);
						}
					}
				}
			}
		}
		if (data.effects) {
			for (let i = 0; i < data.effects.length; i++) {
				let pack = data.effects[i];
				let effect = ClientEffect.list[pack.mapIndex];
				if (effect) {
					if (pack.x !== undefined) {
						effect.pixelPosition.x = pack.x;
					}
					if (pack.y !== undefined) {
						effect.pixelPosition.y = pack.y;
					}
					if (pack.sprite !== undefined) {
						effect.sprite = pack.sprite;
					}
					if (pack.frame !== undefined) {
						effect.currentFrame = pack.frame;
					}
				}
			}
		}
		if (data.texts) {
			for (let i = 0; i < data.texts.length; i++) {
				let pack = data.texts[i];
				let text = ClientText.list[pack.mapIndex];
				if (text) {
					if (pack.x !== undefined) {
						text.pixelPosition.x = pack.x;
					}
					if (pack.y !== undefined) {
						text.pixelPosition.y = pack.y;
					}
					if (pack.message !== undefined) {
						text.message = pack.message;
					}
					if (pack.colour !== undefined) {
						text.colour = pack.colour;
					}
				}
			}
		}
		if (data.inventory) {
			for (let i = 0; i < data.inventory.length; i++) {
				let pack = data.inventory[i];
				let item = ClientInventoryItem.list[pack.index];
				if (item) {
					if (pack.slot !== undefined) {
						item.slot = pack.slot;
					}
					if (pack.stack !== undefined) {
						item.stack = pack.stack;
					}
					if (pack.name !== undefined) {
						item.name = pack.name;
					}
					if (pack.sprite !== undefined) {
						item.sprite = pack.sprite;
						item.frame = item.sprite;
					}
					if (pack.type !== undefined) {
						item.type = pack.type;
					}
					if (pack.reusable !== undefined) {
						item.reusable = pack.reusable;
					}
					if (pack.damageBonus !== undefined) {
						item.damageBonus = pack.damageBonus;
					}
					if (pack.defenceBonus !== undefined) {
						item.defenceBonus = pack.defenceBonus;
					}
					if (pack.healthMaxBonus !== undefined) {
						item.healthMaxBonus = pack.healthMaxBonus;
					}
					if (pack.energyMaxBonus !== undefined) {
						item.energyMaxBonus = pack.energyMaxBonus;
					}
					if (pack.rangeBonus !== undefined) {
						item.rangeBonus = pack.rangeBonus;
					}
				}
			}
		}
		if (data.self) {
			let pack = data.self;
			if (pack.health !== undefined) {
				UI.health = pack.health;
			}
			if (pack.healthMax !== undefined) {
				UI.healthMax = pack.healthMax;
			}
			if (pack.energy !== undefined) {
				UI.energy = pack.energy;
			}
			if (pack.energyMax !== undefined) {
				UI.energyMax = pack.energyMax;
			}
			if (pack.moveSpeed !== undefined) {
				UI.moveSpeed = pack.moveSpeed;
			}
			if (pack.attackSpeed !== undefined) {
				UI.attackSpeed = pack.attackSpeed;
			}
			if (pack.attackTimer !== undefined) {
				UI.attackTimer = pack.attackTimer;
			}
		}
	});
	Client.socket.on('remove', function(data) {
		if (data.players) {
			for(let i = 0; i < data.players.length; i++){
				let player = ClientPlayer.list[data.players[i]];
				if (player) {
					player.displayName.destroy();
					player.destroy();
					delete ClientPlayer.list[data.players[i]];
				}
			}
		}
		if (data.items) {
			for(let i = 0; i < data.items.length; i++){
				let mapItem = ClientMapItem.list[data.items[i]];
				if (mapItem) {
					mapItem.destroy();
					delete ClientMapItem.list[data.items[i]];
				}
			}
		}
		if (data.bots) {
			for(let i = 0; i < data.bots.length; i++){
				let bot = ClientBot.list[data.bots[i]];
				if (bot) {
					bot.displayName.destroy();
					bot.destroy();
					delete ClientBot.list[data.bots[i]];
				}
			}
		}
		if (data.effects) {
			for(let i = 0; i < data.effects.length; i++){
				let effect = ClientEffect.list[data.effects[i]];
				if (effect) {
					effect.destroy();
					delete ClientEffect.list[data.effects[i]];
				}
			}
		}
		if (data.texts) {
			for(let i = 0; i < data.texts.length; i++){
				let text = ClientText.list[data.texts[i]];
				if (text) {
					text.destroy();
					delete ClientText.list[data.texts[i]];
				}
			}
		}
		if (data.inventory) {
			for (let i = 0; i < data.inventory.length; i++) {
				let item = ClientInventoryItem.list[data.inventory[i]];
				if (item) {
					item.destroy();
					delete ClientInventoryItem.list[data.inventory[i]];
				}
			}
		}
	});
	Client.socket.on('message', function(data) {
		if (data.messages) {
			for (let i = 0; i < data.messages.length; i++) {
				let pack = data.messages[i];
				if (pack.message) {
					let colour = 'magenta';
					if (pack.map) {
						colour = 'grey';
					}
					if (pack.id) {
						colour = 'green';
					}
					// printMessage(message, colour);
					console.log(pack.message);
				}
			}
		}
	}

	Client.socket.on('loadMap', function(data) {
		for (let currentLayer = 0; currentLayer < MAP_LAYERS; currentLayer++) {
			for (let y = 0; y < MAP_ROWS; y++) {
				for (let x = 0; x < MAP_COLUMNS; x++) {
					let tile = data.map.tiles[currentLayer][(y * MAP_COLUMNS) + x];
					let layerString = "layer" + currentLayer.toString();
					Game.map.putTile(tile, x, y, Game.map[layerString]);
				}
			}
		}
		for (let i in ClientBot.list) {
			if (ClientBot.list[i]) {
				ClientBot.list[i];
			}
		}
		ClientMapItem.list = {};
		ClientEffect.list = {};
		ClientText.list = {};

	});
};

Client.cursorPress = function(state) {
	cursors.lastPressed = state;
	Client.socket.emit('cursorPress', {
		lastPressed: state,
	});
};
Client.keyPress = function(inputId, state) {
	cursors.lastPressed = state;
	Client.socket.emit('keyPress', {
		inputId,
		state
	});
};
Client.chat = function(message) {
	Client.socket.emit('chat', {
		name: Game.player.name,
		message: message,
	});
};

Client.doubleClickItem = function(slot) {
	Client.socket.emit('doubleClickItem', {
		slot
	});
};
Client.rightClickItem = function(slot) {
	Client.socket.emit('rightClickItem', {
		slot
	});
};
Client.dragStopGame = function(slot, x, y) {
	Client.socket.emit('dragStopGame', {
		slot,
		x,
		y
	});
};
Client.dragStopInventory = function(slot, newSlot) {
	Client.socket.emit('dragStopInventory', {
		slot,
		newSlot
	});
};
Client.dragStopEquipment = function(slot, newSlot) {
	Client.socket.emit('dragStopEquipment', {
		slot,
		newSlot
	});
};

Client.login = function() {
	Client.socket.emit('login');
};

Client.chatServer = function(message) {
	Client.socket.emit('chatServer', {
		message
	});
}
Client.chatMap = function(message) {
	Client.socket.emit('chatMap', {
		message
	});
}
Client.chatPlayer = function(id, message) {
	Client.socket.emit('chatPlayer', {
		message,
		id
	});
}

// Admin Commands
Client.spawnItem = function(map, x, y, id, stack) {
	Client.socket.emit('spawnItem', {
		map,
		x,
		y,
		id,
		stack
	});
};
Client.uploadMap = function(map) {
	Client.socket.emit('uploadMap', {
		map
	});
};

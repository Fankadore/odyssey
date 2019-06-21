import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import fs from 'fs';

import util from "./util.js";
import Account from './models/account.js';
import Player from './models/player.js';
import PlayerTemplate from './models/playerTemplate.js';
import Bot from './models/bot.js';
import BotTemplate from './models/botTemplate.js';
import Item from './models/item.js';
import ItemTemplate from './models/itemTemplate.js';
import Map from './models/map.js';

const fsp = fs.promises;
mongoose.Promise = Promise;
process.env.MONGODB_URI = 'mongodb://Fankadore:odyssey1@ds149706.mlab.com:49706/odyssey'; // REMOVE
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/odyssey', {useNewUrlParser: true});

class Database {
	constructor() {
		this.serverLog = [];
	}

	backup(data = {}) {
		//TODO save everything
		// const maps = save-all-maps
		let players = this.saveOnlinePlayers(data.players);
		let bots = this.saveAllBots(data.bots);
		let items = this.saveAllItems(data.items);
		let logSaved = this.saveLog();
		Promise.all([players, bots, items, logSaved])
		.then(() => this.log("Game saved to disk."));
	}
	
	log(message) {
		const date = new Date();
		console.log(util.timestamp(date) + " - " + message);
		this.serverLog.push({
			message,
			date
		});
	}
	async saveLog() {
		try {
			const savedLog = await fsp.readFile('./server/log.json');
			const newLog = JSON.parse(savedLog).concat(this.serverLog);
			this.serverLog = [];
			await fsp.writeFile('./server/log.json', JSON.stringify(newLog));
			return true;
		}
		catch(err) {
			console.log(err);
			return false;
		}
	}
	async clearLog() {
		try {
			this.serverLog = [];
			await fsp.writeFile('./server/log.json', "[]");
			return true;
		}
		catch (err) {
			console.log(err);
			return false;
		}
	}

	generateId() {
		return new mongoose.Types.ObjectId;
	}
	hashPassword(password) {
		return new Promise((resolve, reject) => {
			bcrypt.hash(password, 10, (err, hash) => {
				if (err) reject(err);
				else resolve(hash);
			});
		});
	}
	comparePassword(password, hashedPassword) {
		return new Promise((resolve, reject) => {
			bcrypt.compare(password, hashedPassword, (err, match) => {
				if (err) reject(err);
				else resolve(match);
			});
		});
	}
	async authAccount(username, password) {
		let account = await Account.findOne({usernameLowerCase: username.toLowerCase()}).exec();
		if (!account) return false;
		let match = await this.comparePassword(password, account.password);
		return match;
	}

	async addAccount(username, password, email) {
		let admin = false;
		let accounts = await this.getAllAccounts();
		if (accounts.length === 0) {
			admin = true;
		}
		else {
			let existingAccount = accounts.find(account => account.username.toLowerCase() === username.toLowerCase());
			if (existingAccount) {
				console.log(`Account already exists with username ${username}.`);
				return false;
			}
		}

		let hashedPassword = await this.hashPassword(password);
		const account = new Account({
			_id: new mongoose.Types.ObjectId,
			username,
			usernameLowerCase: username.toLowerCase(),
			password: hashedPassword,
			email,
			verified: false,
			admin
		});

		return await account.save()
		.then(result => account._id)
		.catch(err => console.log(err));
	}
	getAccount(accountId) {
		return Account.findById(accountId)
		.select('_id username password email verified admin')
		.exec()
		.then(account => account)
		.catch(err => console.log(err));
	}
	getAccountByUsername(username) {
		return Account.findOne({usernameLowerCase: username.toLowerCase()})
		.select('_id username password email verified admin')
		.exec()
		.then(account => account)
		.catch(err => console.log(err));
	}
	getAllAccounts() {
		return Account.find({})
		.select('_id username password email verified admin')
		.exec()
		.then(accounts => accounts)
		.catch(err => console.log(err));
	}
	saveAccount(data) {
		return Account.updateOne({username: data.username}, {$set: data})
		.exec()
		.then(result => true)
		.catch(err => console.log(err));
	}

	async addPlayer(accountId, name, templateId) {
		let account = await this.getAccount(accountId);
		if (!account) {
			console.log("Account does not exist with that id.");
			return null;
		}
		let template = await this.getPlayerTemplate(templateId);
		if (!template) {
			console.log("Player Template does not exist with that id.");
			return null;
		}
		let player = await this.getPlayerByName(name);
		if (player) {
			console.log("Player already exists with that name.");
			return null;
		}

		player = new Player({
			_id : new mongoose.Types.ObjectId,
			name,
			nameLowerCase: name.toLowerCase(),
			account: accountId,
			template: templateId
		});

		return player.save()
		.then(result => player._id)
		.catch(err => console.log(err));
	}
	getPlayer(playerId) {
		return Player.findById(playerId)
		.select('_id account name template level experience mapId x y direction adminAccess sprite')
		.populate('template')
		.exec()
		.then(player => player)
		.catch(err => console.log(err));
	}
	getPlayerByName(name) {
		return Player.findOne({nameLowerCase: name.toLowerCase()})
		.select('_id account name template level experience mapId x y direction adminAccess sprite')
		.populate('template')
		.exec()
		.then(player => player)
		.catch(err => console.log(err));
	}
	getPlayersByAccount(accountId) {
		return Player.find({account: accountId})
		.select('_id account name template level experience mapId x y direction adminAccess sprite')
		.populate('template')
		.exec()
		.then(players => players)
		.catch(err => console.log(err));
	}
	savePlayer(data) {
		return Player.updateOne({name: data.name}, {$set: data})
		.exec()
		.then(result => true)
		.catch(err => console.log(err));
	}
	saveOnlinePlayers(players = []) {
		return new Promise((resolve, reject) => {
			for (let i = 0; i < players.length; i++) {
				const player = players[i];
				if (!player) continue;
				this.savePlayer(player);
			}
			resolve(true);
		});
	}

	async addBot(data) {
		let template = await this.getBotTemplate(data.templateId);
		if (!template) {
			console.log("Bot Template does not exist with that id.");
			return false;
		}

		let _id = data.botId;
		if (!_id) _id = new mongoose.Types.ObjectId;

		const bot = new Bot({
			_id,
			template: data.templateId,
			mapId: data.mapId,
			x: data.x,
			y: data.y,
			direction: data.direction
		});

		return bot.save()
		.then(result => true)
		.catch(err => console.log(err));
	}
	getBot(botId) {
		return Bot.findOne({_id: botId})
		.select('_id template mapId x y direction')
		.populate('template')
		.exec()
		.then(bot => bot)
		.catch(err => console.log(err));
	}
	saveBot(data) {
		return Bot.updateOne({_id: data.botId}, {$set: data})
		.exec()
		.then(result => true)
		.catch(err => console.log(err));
	}
	getAllBots() {
		return Bot.find({})
		.select('_id template mapId x y direction')
		.populate('template')
		.exec()
		.then(bots => bots)
		.catch(err => console.log(err));
	}
	async saveAllBots(currentBots) {
		if (!currentBots) return;

		let savedBots = await this.getAllBots();
		const newBots = currentBots.filter(bot => !savedBots.find(savedBot => savedBot._id === bot.botId));
		const existingBots = currentBots.filter(bot => savedBots.find(savedBot => savedBot._id === bot.botId));
		const deleteBots = savedBots.filter(bot => !existingBots.find(existingBot => existingBot.botId === bot._id));
		const updateBots = existingBots.filter(bot => !deleteBots.includes(bot));

		// Add new Bots
		for (let i = 0; i < newBots.length; i++) {
			this.addBot(newBots[i]);
		}

		// Delete removed Bots
		for (let i = 0; i < deleteBots.length; i++) {
			Bot.deleteOne({_id: deleteBots[i]._id}, err => {
				if (err) console.log(err);
			});
		}

		// Update the rest
		for (let i = 0; i < updateBots.length; i++) {
			const bot = updateBots[i];
			if (!bot) continue;
			this.saveBot(bot);
		}
	}

	getMap(mapId) {
		return Map.findOne({mapId: mapId})
		.select('mapId name dropChance dropAmountEQ tiles isWall isHostile damage warpMap warpX warpY')
		.exec()
		.then(map => map)
		.catch(err => console.log(err));
	}
	saveMap(data) {
		return Map.updateOne({mapId: data.mapId}, {$set: data}, {upsert: true})
		.exec()
		.then(result => true)
		.catch(err => console.log(err));
	}
	getAllMaps() {
		return Map.find({})
		.select('mapId name dropChance dropAmountEQ tiles isWall isHostile damage warpMap warpX warpY')
		.exec()
		.then(maps => maps)
		.catch(err => console.log(err));
	}

	async addPlayerTemplate(data) {
		if (!data.name) {
			console.log("Name is required.");
			return false;
		}

		let checkTemplate = await PlayerTemplate.findOne({name: data.name})
		.exec()
		.then(template => template)
		.catch(err => console.log(err));

		if (checkTemplate) {
			console.log("Template already exists with that name.");
			return false;
		}

		const template = new PlayerTemplate({
			_id: new mongoose.Types.ObjectId,
			name: data.name,
			sprite: data.sprite,
			damageBase: data.damageBase,
			defenceBase: data.defenceBase,
			healthMaxBase: data.healthMaxBase,
			energyMaxBase: data.energyMaxBase,
			healthRegenBase: data.healthRegenBase,
			energyRegenBase: data.energyRegenBase,
			rangeBase: data.rangeBase,
			healthPerLevel: data.healthPerLevel,
			energyPerLevel: data.energyPerLevel
		});

		return template.save()
		.then(result => true)
		.catch(err => console.log(err));
	}
	getPlayerTemplate(templateId) {
		return PlayerTemplate.findById(templateId)
		.select('name sprite damageBase defenceBase healthMaxBase energyMaxBase healthRegenBase energyRegenBase rangeBase healthPerLevel, energyPerLevel')
		.exec()
		.then(template => template)
		.catch(err => console.log(err));
	}
	getAllPlayerTemplates() {
		return PlayerTemplate.find({})
		.select('_id name sprite damageBase defenceBase healthMaxBase energyMaxBase healthRegenBase energyRegenBase rangeBase healthPerLevel, energyPerLevel')
		.exec()
		.then(templates => templates)
		.catch(err => console.log(err));
	}

	addBotTemplate(data) {
		const template = new BotTemplate({
			_id: new mongoose.Types.ObjectId,
			name: data.name,
			sprite: data.sprite,
			damageBase: data.damageBase,
			defenceBase: data.defenceBase,
			healthMaxBase: data.healthMaxBase,
			energyMaxBase: data.energyMaxBase,
			healthRegenBase: data.healthRegenBase,
			energyRegenBase: data.energyRegenBase,
			rangeBase: data.rangeBase,
			hostile: data.hostile
		});

		return template.save()
		.then(result => true)
		.catch(err => console.log(err));
	}
	getBotTemplate(templateId) {
		return BotTemplate.findById(templateId)
		.select('_id name sprite damageBase defenceBase healthMaxBase energyMaxBase healthRegenBase energyRegenBase rangeBase hostile')
		.exec()
		.then(template => template)
		.catch(err => console.log(err));
	}
	getAllBotTemplates() {
		return BotTemplate.find({})
		.select('_id name sprite damageBase defenceBase healthMaxBase energyMaxBase healthRegenBase energyRegenBase rangeBase hostile')
		.exec()
		.then(templates => templates)
		.catch(err => console.log(err));
	}

	addItemTemplate(data) {
		const template = new ItemTemplate({
			_id: new mongoose.Types.ObjectId,
			name: data.name,
			sprite: data.sprite,
			reusable: data.reusable,
			itemType: data.itemTypeId,
			passiveDamage: data.passiveDamage,
			passiveDefence: data.passiveDefence,
			passiveHealthMax: data.passiveHealthMax,
			passiveEnergyMax: data.passiveEnergyMax,
			passiveHealthRegen: data.passiveHealthRegen,
			passiveEnergyRegen: data.passiveEnergyRegen,
			passiveRange: data.passiveRange,
			equippedDamage: data.equippedDamage,
			equippedDefence: data.equippedDefence,
			equippedHealthMax: data.equippedHealthMax,
			equippedEnergyMax: data.equippedEnergyMax,
			equippedHealthRegen: data.equippedHealthRegen,
			equippedEnergyRegen: data.equippedEnergyRegen,
			equippedRange: data.equippedRange
		});

		return template.save()
		.then(result => true)
		.catch(err => console.log(err));
	}
	getItemTemplate(templateId) {
		return ItemTemplate.findById(templateId)
		.select('name sprite reusable itemType passiveDamage passiveDefence passiveHealthMax passiveEnergyMaxBase passiveHealthRegen passiveEnergyRegen passiveRange equippedDamage equippedDefence equippedHealthMax equippedEnergyMaxBase equippedHealthRegen equippedEnergyRegen equippedRange')
		.exec()
		.then(template => template)
		.catch(err => console.log(err));
	}
	getAllItemTemplates() {
		return ItemTemplate.find({})
		.select('_id name sprite reusable itemType passiveDamage passiveDefence passiveHealthMax passiveEnergyMaxBase passiveHealthRegen passiveEnergyRegen passiveRange equippedDamage equippedDefence equippedHealthMax equippedEnergyMaxBase equippedHealthRegen equippedEnergyRegen equippedRange')
		.exec()
		.then(templates => templates)
		.catch(err => console.log(err));
	}

	async addItem(data) {
		let template = await this.getItemTemplate(data.templateId);
		if (!template) {
			console.log("Item Template does not exist with that id.");
			return false;
		}
		let _id = data.itemId;
		if (!_id) _id = new mongoose.Types.ObjectId;

		const item = new Item({
			_id,
			template: data.templateId,
			stack: data.stack,
			playerId: data.playerId,
			botId: data.botId,
			slot: data.slot,
			mapId: data.mapId,
			x: data.x,
			y: data.y,
			createdBy: data.createdBy,
			createdDate: data.createdDate
		});

		return item.save()
		.then(result => true)
		.catch(err => console.log(err));
	}
	saveItem(data) {
		return Item.updateOne({_id: data.itemId}, {$set: data}, {upsert: true})
		.exec()
		.then(result => true)
		.catch(err => console.log(err));
	}
	getAllItems() {
		return Item.find({})
		.select('_id template stack playerId botId slot mapId x y createdDate createdBy')
		.populate('template')
		.exec()
		.then(items => items)
		.catch(err => console.log(err));
	}
	async saveAllItems(currentItems) {
		if (!currentItems) return;

		let savedItems = await this.getAllItems();
		const newItems = currentItems.filter(item => !savedItems.find(savedItem => savedItem._id === item.itemId));
		const existingItems = currentItems.filter(item => savedItems.find(savedItem => savedItem._id === item.itemId));
		const deleteItems = savedItems.filter(item => !existingItems.find(existingItem => existingItem.itemId === item._id));
		const updateItems = existingItems.filter(item => !deleteItems.includes(item));
		
		// Add new Items
		for (let i = 0; i < newItems.length; i++) {
			this.addItem(newItems[i]);
		}

		// Delete removed Items
		for (let i = 0; i < deleteItems.length; i++) {
			Item.deleteOne({_id: deleteItems[i]._id}, err => {
				if (err) console.log(err);
			});
		}

		// Update the rest
		for (let i = 0; i < updateItems.length; i++) {
			const item = updateItems[i];
			if (!item) continue;
			this.saveItem(item);
		}
	}
}

const db = new Database();
export default db;

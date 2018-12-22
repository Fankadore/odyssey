import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import fs from 'fs';

import util from "./util.js";
import Account from './models/account.js';
import Player from './models/player.js';
import PlayerTemplate from './models/playerTemplate.js';
import BotTemplate from './models/botTemplate.js';
import ItemType from './models/itemType.js';
import ItemTemplate from './models/itemTemplate.js';
import Map from './models/map.js';

const fsp = fs.promises;
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/odyssey', {useNewUrlParser: true});

class Database {
	constructor() {
		this.serverLog = [];
	}

	async backup() {
		//TODO save everything
		// const maps = save-all-maps
		// const players = save-all-online-players
		// const bots = save-all-bots
		// const items = save-all-items
		let logSaved = this.saveLog();
		await Promise.all([logSaved]);
		this.log("Game saved to disk.");
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

	async hashPassword(password) {
		return await new Promise((resolve, reject) => {
			bcrypt.hash(password, 10, (err, hash) => {
				if (err) reject(err);
				else resolve(hash);
			});
		});
	}
	async comparePassword(password, hashedPassword) {
		return await new Promise((resolve, reject) => {
			bcrypt.compare(password, hashedPassword, (err, match) => {
				if (err) reject(err);
				else resolve(match);
			});
		});
	}
	async authAccount(username, password) {
		const account = await Account.findOne({username: username}).exec();
		if (!account) return false;
		
		return this.comparePassword(password, account.password);
	}

	async addAccount(username, password, email) {
		let account = await this.getAccountId(username);
		if (account) {
			console.log(`Account already exists with username ${username}.`);
			return false;
		}

		const hashedPassword = await this.hashPassword(password);
		account = new Account({
			_id: new mongoose.Types.ObjectId,
			username,
			password: hashedPassword
		});
		//if (email) account.email = email;

		return await account.save()
		.then(result => {
			this.log(`Account added: ${username}.`)
			return true;
		})
		.catch(err => console.log(err));
	}
	async getAccount(accountId) {
		return await Account.findById(accountId)
		.select('_id username password email verified')
		.exec()
		.then(account => account)
		.catch(err => console.log(err));
	}
	async getAccountId(username) {
		return await Account.findOne({username: username})
		.select('_id')
		.exec()
		.then(account => {
			if (account) {
				return account._id;
			}
			else {
				return null;
			}
		})
		.catch(err => console.log(err));
	}
	async saveAccount(data) {
		return await Account.updateOne({username: data.username}, {$set: data})
		.exec()
		.then(result => true)
		.catch(err => console.log(err));
	}

	async addPlayer(accountId, name, templateId) {
		let account = await this.getAccount(accountId);
		if (!account) {
			console.log("Account does not exist with that id.");
			return false;
		}
		let template = await this.getPlayerTemplate(templateId);
		if (!template) {
			console.log("Player Template does not exist with that id.");
			return false;
		}
		let player = await this.getPlayer(name);
		if (player) {
			console.log("Player already exists with that name.");
			return false;
		}

		player = new Player({
			_id : new mongoose.Types.ObjectId,
			name,
			account: accountId,
			template: templateId
		});

		return await player.save()
		.then(result => true)
		.catch(err => console.log(err));
	}
	async getPlayer(name) {
		return await Player.findOne({name: name})
		.select('_id account name template level experience mapId x y direction adminAccess sprite')
		.populate('template')
		.exec()
		.then(player => player)
		.catch(err => console.log(err));
	}
	async savePlayer(data) {
		return await Player.updateOne({name: data.name}, {$set: data})
		.exec()
		.then(result => true)
		.catch(err => console.log(err));
	}

	async addBot(templateName, mapId, x, y) {
		let templateId = await this.getPlayerTemplateId(templateName);
		if (!templateId) {
			console.log("Bot Template does not exist with that name.");
			return false;
		}
		let bot = await this.getBot(name);
		if (bot) {
			console.log("Bot already exists with that name.");
			return false;
		}

		bot = new Bot({
			_id : new mongoose.Types.ObjectId,
			template: templateId,
			mapId,
			x,
			y
		});

		return await bot.save()
		.then(result => true)
		.catch(err => console.log(err));
	}
	async getBot(name) {
		return await Bot.findOne({name: name})
		.select('_id name sprite template level experience mapId x y direction')
		.populate('template')
		.exec()
		.then(bot => bot)
		.catch(err => console.log(err));
	}
	async saveBot(data) {
		return await Bot.updateOne({name: data.name}, {$set: data})
		.exec()
		.then(result => true)
		.catch(err => console.log(err));
	}

	async getMap(mapId) {
		return await Map.findOne({mapId: mapId})
		.select('mapId name dropChance dropAmountEQ tiles isWall isHostile damage warpMap warpX warpY')
		.exec()
		.then(map => map)
		.catch(err => console.log(err));
	}
	async saveMap(data) {
		return await Map.updateOne({mapId: data.mapId}, {$set: data}, {upsert: true})
		.exec()
		.then(result => true)
		.catch(err => console.log(err));
	}
	async getAllMaps() {
		try {
			return await Map.find({})
			.select('mapId name tiles hostile dropChance dropAmountEQ')
			.exec()
			.then(maps => maps)
			.catch(err => console.log(err));
		}
		catch(err) {
			console.log(err);
		}
	}

	async addPlayerTemplate(data) {
		if (!data.name) {
			console.log("Name is required.");
			return;
		}

		let checkTemplate = await PlayerTemplate.findOne({name: data.name})
		.exec()
		.then(template => template)
		.catch(err => console.log(err));

		if (checkTemplate) {
			console.log("Template already exists with that name.");
			return;
		}

		const template = new PlayerTemplate({
			_id: new mongoose.Types.ObjectId,
			name: data.name,
			sprite: data.sprite,
			damageBase: data.damageBase,
			defenceBase: data.defenceBase,
			healthMaxBase: data.healthMaxBase,
			energyMaxBase: data.energyMaxBase,
			rangeBase: data.rangeBase,
			healthPerLevel: data.healthPerLevel,
			energyPerLevel: data.energyPerLevel
		});

		return await template.save()
		.then(result => true)
		.catch(err => console.log(err));
	}
	async getPlayerTemplate(templateId) {
		return await PlayerTemplate.findById(templateId)
		.select('name sprite damageBase defenceBase healthMaxBase energyMaxBase rangeBase healthPerLevel, energyPerLevel')
		.exec()
		.then(template => template)
		.catch(err => console.log(err));
	}
	async getAllPlayerTemplates() {
		return await PlayerTemplate.find({})
		.select('_id name sprite damageBase defenceBase healthMaxBase energyMaxBase rangeBase healthPerLevel, energyPerLevel')
		.exec()
		.then(templates => templates)
		.catch(err => console.log(err));
	}

	async addBotTemplate(data) {
		const template = new BotTemplate({
			_id: new mongoose.Types.ObjectId,
			name: data.name,
			sprite: data.sprite,
			damageBase: data.damageBase,
			defenceBase: data.defenceBase,
			healthMaxBase: data.healthMaxBase,
			energyMaxBase: data.energyMaxBase,
			rangeBase: data.rangeBase,
			hostile: data.hostile
		});

		return await template.save()
		.then(result => true)
		.catch(err => console.log(err));
	}
	async getBotTemplate(templateId) {
		return await BotTemplate.findById(templateId)
		.select('name sprite damageBase defenceBase healthMaxBase energyMaxBase rangeBase hostile')
		.exec()
		.then(template => template)
		.catch(err => console.log(err));
	}
	async getAllBotTemplates() {
		return await BotTemplate.find({})
		.select('_id name sprite damageBase defenceBase healthMaxBase energyMaxBase rangeBase hostile')
		.exec()
		.then(templates => templates)
		.catch(err => console.log(err));
	}

	async addItemType(data) {
		const type = new ItemType({
			_id: new mongoose.Types.ObjectId,
			name: data.name,
			stackable: data.stackable,
			equippedSlot: data.equippedSlot
		});

		return await type.save()
		.then(result => true)
		.catch(err => console.log(err));
	}
	async getItemType(typeId) {
		return await ItemType.findById(typeId)
		.select('name stackable equippedSlot')
		.exec()
		.then(type => type)
		.catch(err => console.log(err));
	}
	async getAllItemTypes() {
		return await ItemType.find({})
		.select('_id name stackable equippedSlot')
		.exec()
		.then(types => types)
		.catch(err => console.log(err));
	}

	async addItemTemplate(data) {
		const template = new ItemTemplate({
			_id: new mongoose.Types.ObjectId,
			name: data.name,
			sprite: data.sprite,
			type: data.typeId,
			passiveDamage: data.passiveDamage,
			passiveDefence: data.passiveDefence,
			passiveHealthMax: data.passiveHealthMax,
			passiveEnergyMax: data.passiveEnergyMax,
			passiveRange: data.passiveRange,
			equippedDamage: data.equippedDamage,
			equippedDefence: data.equippedDefence,
			equippedHealthMax: data.equippedHealthMax,
			equippedEnergyMax: data.equippedEnergyMax,
			equippedRange: data.equippedRange
		});

		return await template.save()
		.then(result => true)
		.catch(err => console.log(err));
	}
	async getItemTemplate(templateId) {
		return await ItemTemplate.findById(templateId)
		.select('name sprite type passiveDamage passiveDefence passiveHealthMax passiveEnergyMaxBase passiveRange equippedDamage equippedDefence equippedHealthMax equippedEnergyMaxBase equippedRange')
		.populate('type')
		.exec()
		.then(template => template)
		.catch(err => console.log(err));
	}
	async getAllItemTemplates() {
		return await ItemTemplate.find({})
		.select('_id name sprite type passiveDamage passiveDefence passiveHealthMax passiveEnergyMaxBase passiveRange equippedDamage equippedDefence equippedHealthMax equippedEnergyMaxBase equippedRange')
		.populate('type')
		.exec()
		.then(templates => templates)
		.catch(err => console.log(err));
	}
}

const db = new Database();
export default db;

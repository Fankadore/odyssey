import Actor from './actor.js';
import MapItem from './mapitem.js';
import Text from './text.js';
import Effect from './effect.js';

export default class Map {
	constructor() {
		this.id = 0;
		this.name = 'Blank Map';

		this.tiles = [];
		this.bots = [];
		this.items = [];
		this.texts = [];
		this.effects = [];
	}

	update(scene, data, delta) {
		if (data.id != null) this.id = data.id;
		if (data.name != null) this.name = data.name;

		// Update Bots
		if (data.bots) {
			let addBots = data.bots.filter((botData) => {	// filter bots on new list but not old
				if (!botData) return false;
				return (this.bots[botData.id] == null);
			});
			let removeBots = this.bots.filter((bot) => {	// filter bots on old list but not new
				if (!bot) return false;
				return (data.bots[bot.id] == null);
			});
			let updateBots = this.bots.filter((bot) => {	// filter bots on both lists
				if (!bot) return false;
				return (data.bots[bot.id] != null);
			});
			
			addBots.forEach((botData) => {
				this.bots[botData.id] = new Actor(scene, botData);
			});
			removeBots.forEach((bot) => {
				delete this.bots[bot.id];
				bot.destroy();
			});
			updateBots.forEach((bot) => {
				bot.update(data.bots[bot.id]);
			});
		}

		// Update Map Items
		if (data.items) {
			let addItems = data.items.filter((itemData) => {	// filter item on new list but not old
				if (!itemData) return false;
				return (this.items[itemData.id] == null);
			});
			let removeItems = this.items.filter((item) => {	// filter items on old list but not new
				if (!item) return false;
				return (data.items[item.id] == null);
			});
			let updateItems = this.items.filter((item) => {	// filter items on both lists
				if (!item) return false;
				return (data.items[item.id] != null);
			});
		
			addItems.forEach((itemData) => {
				this.items[itemData.id] = new MapItem(scene, itemData);
			});
			removeItems.forEach((item) => {
				delete this.items[item.id];
				item.destroy();
			});
			updateItems.forEach((item) => {
				item.update(data.items[item.id]);
			});
		}

		// Update Text
		if (data.texts) {
			let addTexts = data.texts.filter((textData) => {	// filter text on new list but not old
				if (!textData) return false;
				return (this.texts[textData.id] == null);
			});
			let removeTexts = this.texts.filter((text) => {	// filter texts on old list but not new
				if (!text) return false;
				return (data.texts[text.id] == null);
			});
			let updateTexts = this.texts.filter((text) => {	// filter texts on both lists
				if (!text) return false;
				return (data.texts[text.id] != null);
			});
			
			addTexts.forEach((textData) => {
				this.texts[textData.id] = new Text(scene, textData);
			});
			removeTexts.forEach((text) => {
				delete this.texts[text.id];
				text.destroy();
			});
			updateTexts.forEach((text) => {
				text.update(data.texts[text.id]);
			});
		}

		// Update Effects
		if (data.effects) {
			let addEffects = data.effects.filter((effectData) => {	// filter effect on new list but not old
				if (!effectData) return false;
				return (this.effects[effectData.id] == null);
			});
			let removeEffects = this.effects.filter((effect) => {	// filter effects on old list but not new
				if (!effect) return false;
				return (data.effects[effect.id] == null);
			});
			let updateEffects = this.effects.filter((effect) => {	// filter effects on both lists
				if (!effect) return false;
				return (data.effects[effect.id] != null);
			});
			
			addEffects.forEach((effectData) => {
				this.effects[effectData.id] = new Effect(scene, effectData);
			});
			removeEffects.forEach((effect) => {
				delete this.effects[effect.id];
				effect.destroy();
			});
			updateEffects.forEach((effect) => {
				effect.update(data.effects[effect.id]);
			});
		}
	}
}
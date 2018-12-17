import mongoose from 'mongoose';

const itemTemplateSchema = new mongoose.Schema({
	_id: mongoose.SchemaTypes.ObjectId,
	name: {type: String, required: true},
	sprite: {type: Number, default: 1},
	type: {type: mongoose.SchemaTypes.ObjectId, ref: 'ItemType', required: true},
	damageBonus: {type: Number, default: 0},
	defenceBonus: {type: Number, default: 0},
	healthMaxBonus: {type: Number, default: 0},
	energyMaxBonus: {type: Number, default: 0},
	rangeBonus: {type: Number, default: 0}
});

export default mongoose.model('ItemTemplate', itemTemplateSchema);

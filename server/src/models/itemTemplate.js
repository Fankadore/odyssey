import mongoose from 'mongoose';

const itemTemplateSchema = new mongoose.Schema({
	_id: mongoose.SchemaTypes.ObjectId,
	name: {type: String, required: true},
	sprite: {type: Number, default: 1},
	reusable: {type: Boolean, default: true},
	itemType: {type: Number, required: true},
	passiveDamage: {type: Number, default: 0},
	passiveDefence: {type: Number, default: 0},
	passiveHealthMax: {type: Number, default: 0},
	passiveEnergyMax: {type: Number, default: 0},
	passiveHealthRegen: {type: Number, default: 0},
	passiveEnergyRegen: {type: Number, default: 0},
	passiveRange: {type: Number, default: 0},
	equippedDamage: {type: Number, default: 0},
	equippedDefence: {type: Number, default: 0},
	equippedHealthMax: {type: Number, default: 0},
	equippedEnergyMax: {type: Number, default: 0},
	equippedHealthRegen: {type: Number, default: 0},
	equippedEnergyRegen: {type: Number, default: 0},
	equippedRange: {type: Number, default: 0}
});

export default mongoose.model('ItemTemplate', itemTemplateSchema);

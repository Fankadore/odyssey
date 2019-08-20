import mongoose from 'mongoose';

const defaultTiles = new Array(6).fill(new Array(12).fill(new Array(12).fill(0)));
const falseLayer = new Array(12).fill(new Array(12).fill(false));
const nullLayer = new Array(12).fill(new Array(12).fill(null));

const mapSchema = new mongoose.Schema({
	_id: mongoose.SchemaTypes.ObjectId,
	mapId: {type: Number, required: true},
	name: {type: String, required: true},
	dropChance: {type: Number, default: 100},
	dropAmountEQ: {type: Number, default: 1},
	tiles: {type: [[[Number]]], default: defaultTiles},
	isWall: {type: [[Boolean]], default: falseLayer},
	isHostile: {type: [[Boolean]], default: falseLayer},
	damage: {type: [[Number]], default: nullLayer},
	warpMap: {type: [[Number]], default: nullLayer},
	warpX: {type: [[Number]], default: nullLayer},
	warpY: {type: [[Number]], default: nullLayer},
});

export default mongoose.model('Map', mapSchema);

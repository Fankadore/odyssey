import mongoose from 'mongoose';

const itemTypeSchema = new mongoose.Schema({
	_id: mongoose.SchemaTypes.ObjectId,
	name: {type: String, required: true},
	equippedSlot: {type: Number, required: true},
	stackable: {type: Boolean, required: true}
});

export default mongoose.model('ItemType', itemTypeSchema);

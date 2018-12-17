import mongoose from 'mongoose';

const playerTemplateSchema = new mongoose.Schema({
  _id: mongoose.SchemaTypes.ObjectId,
  name: {type: String, required: true, unique: true},
  sprite: {type: Number, default: 1},
  damageBase: {type: Number, default: 0},
  defenceBase: {type: Number, default: 0},
  healthMaxBase: {type: Number, default: 1},
  energyMaxBase: {type: Number, default: 1},
  rangeBase: {type: Number, default: 1},
  healthPerLevel: {type: Number, default: 0},
  energyPerLevel: {type: Number, default: 0}
});

export default mongoose.model('PlayerTemplate', playerTemplateSchema);

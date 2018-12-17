import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  _id: mongoose.SchemaTypes.ObjectId,
  account: {type: mongoose.SchemaTypes.ObjectId, ref: 'Account', required: true},
  name: {type: String, required: true, unique: true},
  template: {type: mongoose.SchemaTypes.ObjectId, ref: 'PlayerTemplate', required: true},
  level: {type: Number, default: 1},
  experience: {type: Number, default: 0},
  mapId: {type: Number, default: 1},
  x: {type: Number, default: 5},
  y: {type: Number, default: 5},
  direction: {type: String, default: 'down'},
  adminAccess: {type: Number, default: 0},
  sprite: Number
});

export default mongoose.model('Player', playerSchema);

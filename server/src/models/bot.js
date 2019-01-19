import mongoose from 'mongoose';

const botSchema = new mongoose.Schema({
  _id: mongoose.SchemaTypes.ObjectId,
  mapId: {type: Number, default: 1},
  x: {type: Number, default: 5},
  y: {type: Number, default: 5},
  template: {type: mongoose.SchemaTypes.ObjectId, ref: 'BotTemplate', required: true},
  direction: {type: String, default: 'down'}
});

export default mongoose.model('Bot', botSchema);

import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  _id: mongoose.SchemaTypes.ObjectId,
  template: {type: mongoose.SchemaTypes.ObjectId, ref: 'ItemTemplate', required: true},
  stack: {type: Number, default: 0},
  playerId: {type: Number, default: null},
  botId: {type: Number, default: null},
  slot: {type: Number, default: null},
  mapId: {type: Number, default: null},
  x: {type: Number, default: null},
  y: {type: Number, default: null},
  createdDate: {type: Date},
  createdBy: {type: String}
});

export default mongoose.model('Item', itemSchema);

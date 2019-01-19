import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  _id: mongoose.SchemaTypes.ObjectId,
  template: {type: mongoose.SchemaTypes.ObjectId, ref: 'ItemTemplate', required: true},
  stack: {type: Number, default: 0},
  playerId: {type: mongoose.SchemaTypes.ObjectId, default: null},
  botId: {type: mongoose.SchemaTypes.ObjectId, default: null},
  slot: {type: Number, default: null},
  mapId: {type: Number, default: null},
  x: {type: Number, default: null},
  y: {type: Number, default: null},
  createdBy: {type: String},
  createdDate: {type: Date}
});

export default mongoose.model('Item', itemSchema);

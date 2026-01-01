import { Schema, model } from 'mongoose';

const HistorySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  from: String,
  to: String,
  time: { type: Date, default: Date.now }
});

export default model('History', HistorySchema);

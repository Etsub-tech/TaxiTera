import mongoose from 'mongoose';

const TerminalSchema = new mongoose.Schema({
    name: String,
    area: String,
    routes: [String],
    price: Number,
    location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  }
});

TerminalSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Terminal', TerminalSchema);
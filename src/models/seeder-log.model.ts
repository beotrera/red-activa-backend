import mongoose from 'mongoose';

const seederLogSchema = new mongoose.Schema({
  _id: { type: String },
  ranAt: { type: Date, default: Date.now },
});

export const SeederLog = mongoose.model('SeederLog', seederLogSchema);

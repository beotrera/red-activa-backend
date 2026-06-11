import mongoose, { Document, Schema } from 'mongoose';

export interface ISimilarityMatch extends Document {
  person: mongoose.Types.ObjectId;
  report: mongoose.Types.ObjectId;
  score: number;
  matches: string[];
}

const similarityMatchSchema = new Schema<ISimilarityMatch>(
  {
    person: { type: Schema.Types.ObjectId, ref: 'Person', required: true },
    report: { type: Schema.Types.ObjectId, ref: 'Report', required: true },
    score: { type: Number, required: true },
    matches: { type: [String], default: [] },
  },
  { timestamps: true },
);

similarityMatchSchema.index({ person: 1 });
similarityMatchSchema.index({ report: 1 });

export const SimilarityMatchModel = mongoose.model<ISimilarityMatch>('SimilarityMatch', similarityMatchSchema);

import mongoose, { Document, Schema } from 'mongoose';

export interface IPersonAudio extends Document {
  person: mongoose.Types.ObjectId;
  data: Buffer;
  mimeType: string;
  uploadedAt: Date;
}

const personAudioSchema = new Schema<IPersonAudio>(
  {
    person: { type: Schema.Types.ObjectId, ref: 'Person', required: true, unique: true },
    data: { type: Buffer, required: true },
    mimeType: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: false, versionKey: false },
);

export const PersonAudioModel = mongoose.model<IPersonAudio>('PersonAudio', personAudioSchema);

import mongoose, { Document, Schema } from 'mongoose';
import { Gender, ConsciousnessLevel, PersonStatus } from '../enums';

export interface IIdentifyingPhoto {
  url: string;
  caption?: string;
  uploadedAt: Date;
}

export interface IPerson extends Document {
  estimatedAge: number;
  gender: Gender;
  height: string;
  weight: string;
  distinctiveFeatures: string;
  consciousnessLevel: ConsciousnessLevel;
  location: string;
  institution: mongoose.Types.ObjectId;
  dateOfAdmission: Date;
  status: PersonStatus;
  reportedBy: string;
  assignedTo?: string;
  notes?: string;
  identifyingPhotos?: IIdentifyingPhoto[];
  createdBy: mongoose.Types.ObjectId;
}

const identifyingPhotoSchema = new Schema<IIdentifyingPhoto>(
  {
    url: { type: String, required: true },
    caption: { type: String },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const personSchema = new Schema<IPerson>(
  {
    estimatedAge: { type: Number, required: true },
    gender: { type: String, required: true, enum: Object.values(Gender) },
    height: { type: String, required: true, trim: true },
    weight: { type: String, required: true, trim: true },
    distinctiveFeatures: { type: String, required: true, trim: true },
    consciousnessLevel: { type: String, required: true, enum: Object.values(ConsciousnessLevel) },
    location: { type: String, required: true, trim: true },
    institution: { type: Schema.Types.ObjectId, ref: 'Institution', required: true },
    dateOfAdmission: { type: Date, required: true },
    status: { type: String, required: true, enum: Object.values(PersonStatus), default: PersonStatus.UNIDENTIFIED },
    reportedBy: { type: String, required: true, trim: true },
    assignedTo: { type: String, trim: true },
    notes: { type: String },
    identifyingPhotos: { type: [identifyingPhotoSchema], default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

export const PersonModel = mongoose.model<IPerson>('Person', personSchema);

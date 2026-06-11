import mongoose, { Document, Schema } from 'mongoose';

export interface IReport extends Document {
  fullName: string;
  description: string;
  picture: string;
}

const reportSchema = new Schema<IReport>(
  {
    fullName: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    picture: { type: String, required: true },
  },
  { timestamps: true },
);

export const ReportModel = mongoose.model<IReport>('Report', reportSchema);

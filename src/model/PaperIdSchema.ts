import mongoose, { Schema, Document } from 'mongoose';

export interface PaperId extends Document {
  paperIdNumber: number;
  conferenceAcronym: string;
}

const PaperIdSchema: Schema<PaperId> = new Schema(
  {
    paperIdNumber: {
      required: true,
      type: Number,
      default: 0,
    },
    conferenceAcronym: {
      required: true,
      type: String,
    },
  },
  { timestamps: true },
);

const PaperIdModel =
  (mongoose.models.PaperId as mongoose.Model<PaperId>) ||
  mongoose.model<PaperId>('PaperId', PaperIdSchema);

export default PaperIdModel;

import mongoose, { Schema, Document } from 'mongoose';

// Interface for Paper document
export interface IPaper extends Document {
  paperAuthor:  {
    email: string;
    userId?: mongoose.Types.ObjectId;
  }[];
  correspondingAuthor: {
    email: string;
    userId?: mongoose.Types.ObjectId;
  }[];
  paperTitle: string;
  paperFile: string;
  paperKeywords: string[];
  paperAbstract: string;
  paperSubmissionDate: Date;
  conference: mongoose.Types.ObjectId;
  paperStatus: 'submitted' | 'accepted' | 'rejected' | 'review';
  paperID: string;
  paperCommentHistory: { comment: string; updatedAt: Date }[];
  reviewers: {
    Id: mongoose.Types.ObjectId;
    status: 'review' | 'accepted' | 'rejected';
    assignedAt?: Date;
    reviewedAt?: Date;
    comments?: string;
  }[];
  reviewRequests: {
    reviewerId: mongoose.Types.ObjectId;
    requestedBy: mongoose.Types.ObjectId;
    status: 'pending' | 'accepted' | 'rejected';
    requestedAt?: Date;
    resolvedAt?: Date;
  }[];
}

// Paper schema definition
const PaperSchema: Schema<IPaper> = new Schema(
  {
    paperAuthor: [
      {
        name:{
          type:String,
        },
        email: {
          type: String,
          required: true,
        },
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        }
      },
    ],
    correspondingAuthor: [
      {
        name:{
          type:String,
        },
        email: {
          type: String,
          required: true,
        },
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        }
      },
    ],    
    paperTitle: {
      type: String,
      required: true,
    },
    paperFile: {
      type: String, // cloudinary url
      required: true,
    },
    paperKeywords: {
      type: [String],
      required: true,
    },
    paperAbstract: {
      type: String,
      required: true,
    },
    paperSubmissionDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    conference: {
      type: Schema.Types.ObjectId,
      ref: 'Conference',
      required: true,
    },
    paperStatus: {
      type: String,
      enum: ['submitted', 'accepted', 'rejected', 'review'],
      default: 'submitted',
    },
    paperID: {
      type: String,
      required: true,
    },
    paperCommentHistory: [
      {
        comment: String,
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    reviewers: [
      {
        Id: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        status: {
          type: String,
          enum: ['accepted', 'review', 'rejected'],
          default: 'review',
        },
        assignedAt: { type: Date, default: Date.now },
        reviewedAt: { type: Date },
        comments: String, // Reviewer's comments
      },
    ],
    reviewRequests: [
      {
        reviewerId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        status: {
          type: String,
          enum: ['pending', 'accepted', 'rejected'],
          default: 'pending',
        },
        requestedBy: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        requestedAt: { type: Date, default: Date.now },
        resolvedAt: { type: Date },
      },
    ],
  },
  { timestamps: true },
);

// Paper model
const PaperModel =
  (mongoose.models.Paper as mongoose.Model<IPaper>) ||
  mongoose.model<IPaper>('Paper', PaperSchema);

export default PaperModel;

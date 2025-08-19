import mongoose, { Schema, Document } from 'mongoose';
// Interface for Conference document
export interface IConference extends Document {
  conferenceCategory: string;
  conferenceOrganizer: mongoose.Types.ObjectId;
  conferenceOrganizerWebPage: string;
  conferenceOrganizerPhoneNumber: number;
  conferenceOrganizerRole: string;
  conferenceTitle: string;
  conferenceEmail: string;
  conferenceAnyOtherInformation: string;
  conferenceAcronym: string;
  conferenceWebpage: string;
  conferenceVenue: string;
  conferenceCity: string;
  conferenceCountry: string;
  conferenceEstimatedNumberOfSubmissions: number;
  conferenceFirstDay: Date;
  conferenceLastDay: Date;
  conferencePrimaryArea: string;
  conferenceSecondaryArea: string;
  conferenceAreaNotes: string;
  conferenceCreatedAt: Date;
  // conferenceDescription: string;
  conferenceIsAcceptingPaper: boolean;
  conferenceStatus: string;
  conferenceStatusComment: { comment: string; updatedAt: Date }[];
  conferenceSubmissionsDeadlineDate: Date;
  conferenceSecurityDeposit2000Paid: boolean;
}

// Conference schema definition
const ConferenceSchema: Schema<IConference> = new Schema({
  conferenceCategory: {
    type: String,
    required: true,
    enum: [
      'Conference',
      'Book',
      'Used for teaching',
      'Journal',
      'Conference proceedings',
      'Processing applications',
    ],
    default: 'Conference',
  },
  conferenceOrganizer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  conferenceOrganizerWebPage: { type: String },
  conferenceOrganizerPhoneNumber: { type: Number, required: true },
  conferenceOrganizerRole: { type: String, required: true },
  conferenceTitle: { type: String, required: true },
  conferenceEmail: { type: String, required: true },
  conferenceAnyOtherInformation: { type: String, required: false },
  conferenceAcronym: { type: String, required: true },
  conferenceWebpage: { type: String},
  conferenceVenue: { type: String},
  conferenceCity: { type: String}, 
  conferenceCountry: { type: String},
  conferenceEstimatedNumberOfSubmissions: { type: Number },
  conferenceFirstDay: { type: Date },
  conferenceLastDay: { type: Date, required: true },
  conferencePrimaryArea: { type: String },
  conferenceSecondaryArea: { type: String },
  conferenceAreaNotes: { type: String, length: 500 },
  conferenceCreatedAt: { type: Date, required: true, default: Date.now },
  conferenceIsAcceptingPaper: { type: Boolean, default: true },
  conferenceStatus: {
    type: String,
    required: true,
    enum: ['submitted', 'accepted', 'rejected', 'review'],
    default: 'submitted',
  },
  conferenceStatusComment: [
    {
      comment: String,
      updatedAt: { type: Date, default: Date.now },
    },
  ],
  conferenceSubmissionsDeadlineDate: { type: Date, required: true },
  conferenceSecurityDeposit2000Paid: { type: Boolean, default: false },
});

// Conference model
const ConferenceModel =
  (mongoose.models.Conference as mongoose.Model<IConference>) ||
  mongoose.model<IConference>('Conference', ConferenceSchema);

export default ConferenceModel;

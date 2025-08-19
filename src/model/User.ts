import mongoose, { Schema, Document } from 'mongoose';

export interface User extends Document {
  fullname: string;
  email: string;
  password: string;
  verifyCode: string | undefined;
  verifyCodeExpiry: Date | undefined;
  forgotPasswordToken: string | undefined;
  forgotPasswordTokenExpiry: Date | undefined; // Token expires in 1 hour
  isVerified: boolean;
  affilation: string;
  country: string;
  contactNumber: number;
  isReviewer: boolean;
  // Organizedconferences:mongoose.Types.ObjectId[],
  // submittedPapers:mongoose.Types.ObjectId[]
}

const UserSchema: Schema<User> = new Schema(
  {
    fullname: {
      type: String,
      required: [true, 'Full Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'please use a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'password is required'],
    },
    verifyCode: {
      type: String,
    },
    verifyCodeExpiry: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    forgotPasswordTokenExpiry: {
      type: Date,
    },
    forgotPasswordToken: {
      type: String,
      default: false,
    },
    affilation: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
      default: 'India',
    },
    contactNumber: {
      type: Number,
      required: true,
    },
    isReviewer: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>('User', UserSchema);

export default UserModel;

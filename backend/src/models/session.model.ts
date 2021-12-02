import Mongoose from "mongoose";
import { UserDocument } from "./user.model";

export interface SessionDocument extends Mongoose.Document {
  user: UserDocument["_id"];
  valid: boolean;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new Mongoose.Schema(
  {
    user: { type: Mongoose.Schema.Types.ObjectId, ref: "User" },
    valid: { type: Boolean, default: true },
    userAgent: { type: String },
  },
  {
    timestamps: true,
  }
);

const SessionModel = Mongoose.model("sessions", SessionSchema);

export default SessionModel;

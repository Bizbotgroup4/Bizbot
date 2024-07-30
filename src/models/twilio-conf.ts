import { ObjectId } from "mongodb";
import { Model, Schema, model } from "mongoose";

export interface TwilioType {
  _id: ObjectId;
  orgId: string;
  phone: string;
  accountSid: string;
  authToken: string;
}

const twilioSchema = new Schema<TwilioType>(
  {
    orgId: { type: String, required: false, ref: "Org" },
    phone: { type: String, required: false },
    accountSid: { type: String, required: false },
    authToken: { type: String, required: false },
  },
  { timestamps: true }
);

const TwilioConfs: Model<TwilioType> = model<TwilioType>(
  "twilio-confs",
  twilioSchema
);

export default TwilioConfs;

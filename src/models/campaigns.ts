import { ObjectId } from "mongodb";
import { Model, Schema, model } from "mongoose";

export interface CampaignType {
  _id: ObjectId;
  orgId: string;
  name: string;
  description: string;
  category: string;
  targetQuantity?: number;
  donationUrl: string;
}

const campaignSchema = new Schema<CampaignType>(
  {
    orgId: { type: String, required: true, ref: "Org" },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    targetQuantity: { type: Number, required: false },
    donationUrl: { type: String, required: true },
  },
  { timestamps: true }
);

const Campaigns: Model<CampaignType> = model<CampaignType>("campaigns", campaignSchema);

export default Campaigns;
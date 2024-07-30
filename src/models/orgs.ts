import { ObjectId } from "mongodb";
import { Model, Schema, model } from "mongoose";

export interface OrgType {
  _id: ObjectId;
  name: string;
  description: string;
  url: string;
  city: string;
  category: string;
  type: string;
  email: string;
  phone: string;
  customer_id: ObjectId;
}

const orgScheme = new Schema<OrgType>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String, required: true },
    city: { type: String, required: true },
    category: { type: String, required: true },
    type: { type: String, required: true, enum: ["business", "ngo"] },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    customer_id: { type: "ObjectId", required: true },
  },
  { timestamps: true }
);

const Orgs: Model<OrgType> = model<OrgType>("orgs", orgScheme);

export default Orgs;

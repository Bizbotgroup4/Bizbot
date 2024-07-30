import { ObjectId } from "mongodb";
import { Model, Schema, model } from "mongoose";
export interface NgoType {
  _id: ObjectId;
  name: string;
  description: string;
  url: string;
  city: string;
  category: string;
  type: string;
}
const ngoScheme = new Schema<NgoType>(
  {
    name: { type: String, required: false },
    description: { type: String, required: false },
    url: { type: String, required: false },
    city: { type: String, required: false },
    category: { type: String, required: false },
    type: { type: String, required: false },
  },
  { timestamps: true }
);
const Ngo: Model<NgoType> = model<NgoType>("ngo", ngoScheme);
export default Ngo;

import { ObjectId } from "mongodb";
import { Model, Schema, model } from "mongoose";

export interface CustomersType {
  _id: ObjectId;
  email: string;
  password: string;
  is_onboarded: false;
}

const customersScheme = new Schema<CustomersType>(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    is_onboarded: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Customers: Model<CustomersType> = model<CustomersType>(
  "customers",
  customersScheme
);

export default Customers;

import { ObjectId } from "mongodb";
import { Model, Schema, model } from "mongoose";

export interface UserType {
  _id: ObjectId;
  phone_number: string;
  city: string;
}

const userScheme = new Schema<UserType>(
  {
    phone_number: { type: String, required: false },
    city: { type: String, required: false },
  },
  { timestamps: true }
);

const Users: Model<UserType> = model<UserType>("users", userScheme);

export default Users;

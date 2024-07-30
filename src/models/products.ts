import { ObjectId } from "mongodb";
import { Model, Schema, model } from "mongoose";

export interface ProductType {
  _id: ObjectId;
  orgId: String;
  name: string;
  description: string;
  price: number;
  category: string;
  sizes: string[];
  colors: string[];
  url: string;
  stock: number;
}

const productSchema = new Schema<ProductType>(
  {
    orgId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    sizes: { type: [String], required: true },
    colors: { type: [String], required: true },
    url: { type: String, required: true },
    stock: { type: Number, required: true },
  },
  { timestamps: true }
);

const Products: Model<ProductType> = model<ProductType>("products", productSchema);

export default Products;

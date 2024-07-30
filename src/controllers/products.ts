import { Request, Response } from "express";
import Orgs from "../models/orgs";
import { CustomRequest } from "../middleware/checkUserAuth";
import Products from "../models/products";

const AddProducts = async (req: Request, res: Response) => {
  const { _id } = (req as CustomRequest).user;
  const Org = await Orgs.findOne({ customer_id: _id });
  try {
    const { name, description, url, category, colors, price, stock, sizes } =
      req.body;
    await Products.create({
      name,
      description,
      category,
      url,
      price,
      stock,
      colors,
      sizes,
      orgId: Org?._id,
    });
    return res.status(200).json({
      status: "success",
      message: "Product added successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      status: "failed",
      error: error.message,
    });
  }
};
const UpdateProducts = async (req: Request, res: Response) => {
  try {
    const { _id, ...body } = req.body;
    const products = await Products.findOneAndUpdate({ _id }, { $set: body });
    return res.status(200).json({
      status: "success",
      message: "Product updated successfully",
      data: products,
    });
  } catch (error: any) {
    res.status(400).json({
      status: "failed",
      error: error.message,
    });
  }
};

const GetProductById = async (req: Request, res: Response) => {
  try {
    const { _id } = req.body;
    const products = await Products.findOne({ _id });
    return res.status(200).json({
      status: "success",
      message: "Products found successfully",
      data: products,
    });
  } catch (error: any) {
    res.status(400).json({
      status: "failed",
      error: error.message,
    });
  }
};

const FindProductsList = async (req: Request, res: Response) => {
  try {
    const { page, limit = 10, orgId } = req.body;
    const data = await Products.find({ orgId })
      .skip((page - 1) * limit)
      .limit(limit);
    const counts = await Products.countDocuments({ orgId });
    return res.status(200).json({
      status: "success",
      data: data ? data : [],
      counts,
      page: Math.ceil(counts / limit),
    });
  } catch (error: any) {
    res.status(400).json({
      status: "failed",
      error: error.message,
    });
  }
};
const DeleteProducts = async (req: Request, res: Response) => {
  try {
    const { _id } = req.body;
    await Products.deleteOne({ _id });
    return res.status(200).json({
      status: "success",
      message: "Product deleted successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      status: "failed",
      error: error.message,
    });
  }
};
export {
  AddProducts,
  UpdateProducts,
  GetProductById,
  FindProductsList,
  DeleteProducts,
};

import { Request, Response } from "express";
import Customers, { CustomersType } from "../models/customers";
import bcrypt, { compareSync } from "bcryptjs";
import { generateToken } from "../utils/generateToken";
import { CustomRequest } from "../middleware/checkUserAuth";
import Orgs from "../models/orgs";

const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await Customers.findOne({ email });
    if (user) {
      return res.status(400).json({
        status: "failed",
        error: "Email is already registered. Try login or use other email.",
      });
    }
    const hash = await bcrypt.hash(password, 8);
    const registeredUser = await Customers.create({
      email,
      password: hash,
    });
    const responseUser = await Customers.aggregate([
      { $match: { _id: registeredUser._id } },
      { $unset: "password" },
    ]);
    return res.status(200).json({
      status: "success",
      message: "Registered successfully",
      data: {
        user: responseUser[0],
      },
    });
  } catch (error: any) {
    res.status(400).json({
      status: "failed",
      error: error.message,
    });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as CustomersType;
    let user: any;
    if (!email || !password) {
      return res.status(400).json({
        status: "failed",
        error: "Invalid credentials",
      });
    } else {
      user = await Customers.findOne({ email });
    }
    if (user) {
      const validUser = compareSync(password, user.password);
      if (!validUser) {
        return res.status(400).json({
          status: "failed",
          error: "Invalid credentials",
        });
      }
      const token = generateToken(user._id.toString());
      if (!token) {
        return res.status(400).json({
          status: "failed",
          error: "Error while generating token",
        });
      }
      const responseUser = await Customers.aggregate([
        { $match: { _id: user._id } },
        { $unset: "password" },
      ]);
      return res.status(200).json({
        status: "success",
        message: "Authenticated successfully",
        data: {
          user: responseUser[0],
          token: token,
        },
      });
    } else {
      res.status(400).json({
        status: "failed",
        error: "User not found",
      });
    }
  } catch (error: any) {
    res.status(400).json({
      status: "failed",
      error: error.message,
    });
  }
};
const getCustomer = async (req: Request, res: Response) => {
  const { _id } = (req as CustomRequest).user;
  try {
    const customer = await Customers.findById(_id);
    const organization = await Orgs.findOne({ customer_id: customer?._id });

    return res.status(200).json({
      status: "success",
      message: "User found",
      data: {
        ...customer?.toObject(),
        org_type: organization?.type,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      status: "failed",
      error: error.message,
    });
  }
};

export { register, login, getCustomer };

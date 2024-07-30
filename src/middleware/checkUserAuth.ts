import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import Customers, { CustomersType } from "../models/customers";
require("dotenv").config();
export interface CustomRequest extends Request {
  user: CustomersType;
}
const checkUserAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorization = req.header("Authorization");
    if (!authorization) {
      return res.status(400).json({
        status: "failed",
        error: "Request must be authenticated",
      });
    }
    const decoded: any = jwt.verify(
      authorization,
      process.env.SECRET_KEY ?? ""
    );
    let find = await Customers.findOne({ _id: decoded._id }, { password: 0 });
    if (find) {
      (req as CustomRequest).user = find;
      next();
    } else {
      return res.status(401).json({
        status: "failed",
        error: "Invalid token",
      });
    }
  } catch (err) {
    console.trace('Error while validating user token! Error:', err);
    return res.status(500).json({
      status: "failed",
      error: "Something went wrong, please try again",
    });
  }
};
export default checkUserAuth;

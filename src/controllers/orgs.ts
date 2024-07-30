import { Request, Response } from "express";
import Orgs from "../models/orgs";
import { CustomRequest } from "../middleware/checkUserAuth";
import Customers from "../models/customers";
import TwilioConfs from "../models/twilio-conf";

const AddOrgs = async (req: Request, res: Response) => {
  const { _id } = (req as CustomRequest).user;
  try {
    const { name, description, url, city, category, email, phone, type } =
      req.body;
    const createdOrg = await Orgs.create({
      name,
      description,
      url,
      city,
      category,
      email,
      phone,
      type,
      customer_id: _id,
    });
    await Customers.updateOne({ _id }, { is_onboarded: true });
    await TwilioConfs.create({
      accountSid: "",
      authToken: "",
      orgId: createdOrg._id,
      phone: phone,
    });
    return res.status(200).json({
      status: "success",
      message: "Registered successfully",
      org_type: type,
    });
  } catch (error: any) {
    res.status(400).json({
      status: "failed",
      error: error.message,
    });
  }
};
const UpdateOrganization = async (req: Request, res: Response) => {
  const { _id } = (req as CustomRequest).user;
  try {
    const { ...body } = req.body;
    const OrgId = await Orgs.findOne({ customer_id: _id });
    await Orgs.findOneAndUpdate({ _id: OrgId?._id }, { $set: body });
    return res.status(200).json({
      status: "success",
      message: "Organization updated successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      status: "failed",
      error: error.message,
    });
  }
};
const getOrgsDetail = async (req: Request, res: Response) => {
  const { _id } = (req as CustomRequest).user;
  try {
    const customer = await Customers.findById(_id);
    const organization = await Orgs.findOne({ customer_id: customer?._id });
    if (organization == null) {
      throw Error("Org not found!");
    }
    return res.status(200).json({
      status: "success",
      message: "Org found",
      organization: organization,
    });
  } catch (error: any) {
    res.status(400).json({
      status: "failed",
      error: error.message,
    });
  }
};

export { AddOrgs, getOrgsDetail, UpdateOrganization };

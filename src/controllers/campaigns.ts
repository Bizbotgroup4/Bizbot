import { Request, Response } from "express";
import Orgs from "../models/orgs";
import { CustomRequest } from "../middleware/checkUserAuth";
import Campaigns from "../models/campaigns";

const AddCampaigns = async (req: Request, res: Response) => {
  const { _id } = (req as CustomRequest).user;
  const Org = await Orgs.findOne({ customer_id: _id });
  try {
    const { name, description, donationUrl, targetQuantity, category } =
      req.body;
    await Campaigns.create({
      name,
      description,
      category,
      donationUrl,
      targetQuantity,
      orgId: Org?._id,
    });
    return res.status(200).json({
      status: "success",
      message: "Campaign added successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      status: "failed",
      error: error.message,
    });
  }
};
const UpdateCampaigns = async (req: Request, res: Response) => {
  try {
    const { _id, ...body } = req.body;
    const campaigns = await Campaigns.findOneAndUpdate({ _id }, { $set: body });
    return res.status(200).json({
      status: "success",
      message: "Campaign updated successfully",
      data: campaigns,
    });
  } catch (error: any) {
    res.status(400).json({
      status: "failed",
      error: error.message,
    });
  }
};

const GetCampaignsById = async (req: Request, res: Response) => {
  try {
    const { _id } = req.body;
    const campaigns = await Campaigns.findOne({ _id });
    return res.status(200).json({
      status: "success",
      message: "Campaigns found successfully",
      data: campaigns,
    });
  } catch (error: any) {
    res.status(400).json({
      status: "failed",
      error: error.message,
    });
  }
};

const FindCampaignsList = async (req: Request, res: Response) => {
  try {
    const { page, limit = 10, orgId } = req.body;
    const data = await Campaigns.find({ orgId })
      .skip((page - 1) * limit)
      .limit(limit);
    const counts = await Campaigns.countDocuments({ orgId });
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
const DeleteCampaigns = async (req: Request, res: Response) => {
  try {
    const { _id } = req.body;
    await Campaigns.deleteOne({ _id });
    return res.status(200).json({
      status: "success",
      message: "Campaign deleted successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      status: "failed",
      error: error.message,
    });
  }
};
export {
  AddCampaigns,
  UpdateCampaigns,
  GetCampaignsById,
  FindCampaignsList,
  DeleteCampaigns,
};

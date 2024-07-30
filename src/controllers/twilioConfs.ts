import { Request, Response } from "express";
import Orgs from "../models/orgs";
import { CustomRequest } from "../middleware/checkUserAuth";
import TwilioConfs from "../models/twilio-conf";
import { Twilio } from "twilio";
const UpdateTwilioConfs = async (req: Request, res: Response) => {
  const { _id } = (req as CustomRequest).user;
  try {
    const Org = await Orgs.findOne({ customer_id: _id });
    const { authToken, accountSid, phone } = req.body;
    const twilioClient = new Twilio(accountSid, authToken);
    twilioClient.api
      .accounts(accountSid)
      .fetch()
      .then(async () => {
        await TwilioConfs.updateOne(
          { orgId: Org?._id },
          { authToken, accountSid, phone }
        );
        return res.status(200).json({
          status: "success",
          message: "Twilio configured successfully",
        });
      })
      .catch((error) => {
        return res.status(200).json({
          status: "failed",
          error: "Please check your SID and auth token of twilio",
        });
      });
  } catch (error: any) {
    res.status(400).json({
      status: "failed",
      error: error.message,
    });
  }
};
const GetTwilioConfs = async (req: Request, res: Response) => {
  const { _id } = (req as CustomRequest).user;
  try {
    const Org = await Orgs.findOne({ customer_id: _id });
    const twilioConfig = await TwilioConfs.findOne({ orgId: Org?._id });
    return res.status(200).json({
      status: "success",
      message: "Twilio configuration fetched successfully",
      data: twilioConfig,
    });
  } catch (error: any) {
    res.status(400).json({
      status: "failed",
      error: error.message,
    });
  }
};

export { UpdateTwilioConfs, GetTwilioConfs };

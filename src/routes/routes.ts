import { Router } from "express";
import { chatBot } from "../controllers/chatbot";
import { getCustomer, login, register } from "../controllers/auth";
import checkUserAuth from "../middleware/checkUserAuth";
import {
  AddOrgs,
  getOrgsDetail,
  UpdateOrganization,
} from "../controllers/orgs";
import {
  AddCampaigns,
  DeleteCampaigns,
  FindCampaignsList,
  GetCampaignsById,
  UpdateCampaigns,
} from "../controllers/campaigns";
import {
  AddProducts,
  DeleteProducts,
  FindProductsList,
  GetProductById,
  UpdateProducts,
} from "../controllers/products";
import { GetTwilioConfs, UpdateTwilioConfs } from "../controllers/twilioConfs";
import { SendEmailToCustomer } from "../controllers/sendContactDetails";

const router = Router();

router.post("/webhook", chatBot);
router.post("/sign-in", login);
router.post("/sign-up", register);
router.get("/get-customer", checkUserAuth, getCustomer);
router.post("/onboarding", checkUserAuth, AddOrgs);

// campaigns
router.post("/campaigns/add", checkUserAuth, AddCampaigns);
router.put("/campaigns/update", checkUserAuth, UpdateCampaigns);
router.post("/campaigns", checkUserAuth, FindCampaignsList);
router.post("/campaigns/by-id", checkUserAuth, GetCampaignsById);
router.delete("/campaigns/delete", checkUserAuth, DeleteCampaigns);

// products
router.post("/products/add", checkUserAuth, AddProducts);
router.put("/products/update", checkUserAuth, UpdateProducts);
router.post("/products", checkUserAuth, FindProductsList);
router.post("/products/by-id", checkUserAuth, GetProductById);
router.delete("/products/delete", checkUserAuth, DeleteProducts);

// twilio conf
router.put("/twilio-config/update", checkUserAuth, UpdateTwilioConfs);
router.get("/twilio-config", checkUserAuth, GetTwilioConfs);

// profile
router.put("/profile/update", checkUserAuth, UpdateOrganization);
router.get("/profile", checkUserAuth, getOrgsDetail);

// contact us
router.post("/send-contact-details", SendEmailToCustomer);

export default router;

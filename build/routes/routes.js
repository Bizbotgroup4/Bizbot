"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatbot_1 = require("../controllers/chatbot");
const auth_1 = require("../controllers/auth");
const checkUserAuth_1 = __importDefault(require("../middleware/checkUserAuth"));
const orgs_1 = require("../controllers/orgs");
const campaigns_1 = require("../controllers/campaigns");
const products_1 = require("../controllers/products");
const twilioConfs_1 = require("../controllers/twilioConfs");
const sendContactDetails_1 = require("../controllers/sendContactDetails");
const router = (0, express_1.Router)();
router.post("/webhook", chatbot_1.chatBot);
router.post("/sign-in", auth_1.login);
router.post("/sign-up", auth_1.register);
router.get("/get-customer", checkUserAuth_1.default, auth_1.getCustomer);
router.post("/onboarding", checkUserAuth_1.default, orgs_1.AddOrgs);
// campaigns
router.post("/campaigns/add", checkUserAuth_1.default, campaigns_1.AddCampaigns);
router.put("/campaigns/update", checkUserAuth_1.default, campaigns_1.UpdateCampaigns);
router.post("/campaigns", checkUserAuth_1.default, campaigns_1.FindCampaignsList);
router.post("/campaigns/by-id", checkUserAuth_1.default, campaigns_1.GetCampaignsById);
router.delete("/campaigns/delete", checkUserAuth_1.default, campaigns_1.DeleteCampaigns);
// products
router.post("/products/add", checkUserAuth_1.default, products_1.AddProducts);
router.put("/products/update", checkUserAuth_1.default, products_1.UpdateProducts);
router.post("/products", checkUserAuth_1.default, products_1.FindProductsList);
router.post("/products/by-id", checkUserAuth_1.default, products_1.GetProductById);
router.delete("/products/delete", checkUserAuth_1.default, products_1.DeleteProducts);
// twilio conf
router.put("/twilio-config/update", checkUserAuth_1.default, twilioConfs_1.UpdateTwilioConfs);
router.get("/twilio-config", checkUserAuth_1.default, twilioConfs_1.GetTwilioConfs);
// profile
router.put("/profile/update", checkUserAuth_1.default, orgs_1.UpdateOrganization);
router.get("/profile", checkUserAuth_1.default, orgs_1.getOrgsDetail);
// contact us
router.post("/send-contact-details", sendContactDetails_1.SendEmailToCustomer);
exports.default = router;

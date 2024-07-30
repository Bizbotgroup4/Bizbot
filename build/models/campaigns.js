"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const campaignSchema = new mongoose_1.Schema({
    orgId: { type: String, required: true, ref: "Org" },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    targetQuantity: { type: Number, required: false },
    donationUrl: { type: String, required: true },
}, { timestamps: true });
const Campaigns = (0, mongoose_1.model)("campaigns", campaignSchema);
exports.default = Campaigns;

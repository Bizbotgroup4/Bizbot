"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const twilioSchema = new mongoose_1.Schema({
    orgId: { type: String, required: false, ref: "Org" },
    phone: { type: String, required: false },
    accountSid: { type: String, required: false },
    authToken: { type: String, required: false },
}, { timestamps: true });
const TwilioConfs = (0, mongoose_1.model)("twilio-confs", twilioSchema);
exports.default = TwilioConfs;

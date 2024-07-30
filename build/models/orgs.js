"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orgScheme = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String, required: true },
    city: { type: String, required: true },
    category: { type: String, required: true },
    type: { type: String, required: true, enum: ["business", "ngo"] },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    customer_id: { type: "ObjectId", required: true },
}, { timestamps: true });
const Orgs = (0, mongoose_1.model)("orgs", orgScheme);
exports.default = Orgs;

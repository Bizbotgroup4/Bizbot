"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const customersScheme = new mongoose_1.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    is_onboarded: { type: Boolean, default: false },
}, { timestamps: true });
const Customers = (0, mongoose_1.model)("customers", customersScheme);
exports.default = Customers;

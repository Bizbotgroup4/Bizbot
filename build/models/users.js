"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userScheme = new mongoose_1.Schema({
    phone_number: { type: String, required: false },
    city: { type: String, required: false },
}, { timestamps: true });
const Users = (0, mongoose_1.model)("users", userScheme);
exports.default = Users;

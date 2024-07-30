"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ngoScheme = new mongoose_1.Schema({
    name: { type: String, required: false },
    description: { type: String, required: false },
    url: { type: String, required: false },
    city: { type: String, required: false },
    category: { type: String, required: false },
    type: { type: String, required: false },
}, { timestamps: true });
const Ngo = (0, mongoose_1.model)("ngo", ngoScheme);
exports.default = Ngo;

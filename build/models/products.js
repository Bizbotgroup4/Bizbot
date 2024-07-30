"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    orgId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    sizes: { type: [String], required: true },
    colors: { type: [String], required: true },
    url: { type: String, required: true },
    stock: { type: Number, required: true },
}, { timestamps: true });
const Products = (0, mongoose_1.model)("products", productSchema);
exports.default = Products;

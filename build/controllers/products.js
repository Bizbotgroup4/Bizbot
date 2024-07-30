"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteProducts = exports.FindProductsList = exports.GetProductById = exports.UpdateProducts = exports.AddProducts = void 0;
const orgs_1 = __importDefault(require("../models/orgs"));
const products_1 = __importDefault(require("../models/products"));
const AddProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.user;
    const Org = yield orgs_1.default.findOne({ customer_id: _id });
    try {
        const { name, description, url, category, colors, price, stock, sizes } = req.body;
        yield products_1.default.create({
            name,
            description,
            category,
            url,
            price,
            stock,
            colors,
            sizes,
            orgId: Org === null || Org === void 0 ? void 0 : Org._id,
        });
        return res.status(200).json({
            status: "success",
            message: "Product added successfully",
        });
    }
    catch (error) {
        res.status(400).json({
            status: "failed",
            error: error.message,
        });
    }
});
exports.AddProducts = AddProducts;
const UpdateProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { _id } = _a, body = __rest(_a, ["_id"]);
        const products = yield products_1.default.findOneAndUpdate({ _id }, { $set: body });
        return res.status(200).json({
            status: "success",
            message: "Product updated successfully",
            data: products,
        });
    }
    catch (error) {
        res.status(400).json({
            status: "failed",
            error: error.message,
        });
    }
});
exports.UpdateProducts = UpdateProducts;
const GetProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.body;
        const products = yield products_1.default.findOne({ _id });
        return res.status(200).json({
            status: "success",
            message: "Products found successfully",
            data: products,
        });
    }
    catch (error) {
        res.status(400).json({
            status: "failed",
            error: error.message,
        });
    }
});
exports.GetProductById = GetProductById;
const FindProductsList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit = 10, orgId } = req.body;
        const data = yield products_1.default.find({ orgId })
            .skip((page - 1) * limit)
            .limit(limit);
        const counts = yield products_1.default.countDocuments({ orgId });
        return res.status(200).json({
            status: "success",
            data: data ? data : [],
            counts,
            page: Math.ceil(counts / limit),
        });
    }
    catch (error) {
        res.status(400).json({
            status: "failed",
            error: error.message,
        });
    }
});
exports.FindProductsList = FindProductsList;
const DeleteProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.body;
        yield products_1.default.deleteOne({ _id });
        return res.status(200).json({
            status: "success",
            message: "Product deleted successfully",
        });
    }
    catch (error) {
        res.status(400).json({
            status: "failed",
            error: error.message,
        });
    }
});
exports.DeleteProducts = DeleteProducts;

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
exports.DeleteCampaigns = exports.FindCampaignsList = exports.GetCampaignsById = exports.UpdateCampaigns = exports.AddCampaigns = void 0;
const orgs_1 = __importDefault(require("../models/orgs"));
const campaigns_1 = __importDefault(require("../models/campaigns"));
const AddCampaigns = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.user;
    const Org = yield orgs_1.default.findOne({ customer_id: _id });
    try {
        const { name, description, donationUrl, targetQuantity, category } = req.body;
        yield campaigns_1.default.create({
            name,
            description,
            category,
            donationUrl,
            targetQuantity,
            orgId: Org === null || Org === void 0 ? void 0 : Org._id,
        });
        return res.status(200).json({
            status: "success",
            message: "Campaign added successfully",
        });
    }
    catch (error) {
        res.status(400).json({
            status: "failed",
            error: error.message,
        });
    }
});
exports.AddCampaigns = AddCampaigns;
const UpdateCampaigns = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { _id } = _a, body = __rest(_a, ["_id"]);
        const campaigns = yield campaigns_1.default.findOneAndUpdate({ _id }, { $set: body });
        return res.status(200).json({
            status: "success",
            message: "Campaign updated successfully",
            data: campaigns,
        });
    }
    catch (error) {
        res.status(400).json({
            status: "failed",
            error: error.message,
        });
    }
});
exports.UpdateCampaigns = UpdateCampaigns;
const GetCampaignsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.body;
        const campaigns = yield campaigns_1.default.findOne({ _id });
        return res.status(200).json({
            status: "success",
            message: "Campaigns found successfully",
            data: campaigns,
        });
    }
    catch (error) {
        res.status(400).json({
            status: "failed",
            error: error.message,
        });
    }
});
exports.GetCampaignsById = GetCampaignsById;
const FindCampaignsList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit = 10, orgId } = req.body;
        const data = yield campaigns_1.default.find({ orgId })
            .skip((page - 1) * limit)
            .limit(limit);
        const counts = yield campaigns_1.default.countDocuments({ orgId });
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
exports.FindCampaignsList = FindCampaignsList;
const DeleteCampaigns = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.body;
        yield campaigns_1.default.deleteOne({ _id });
        return res.status(200).json({
            status: "success",
            message: "Campaign deleted successfully",
        });
    }
    catch (error) {
        res.status(400).json({
            status: "failed",
            error: error.message,
        });
    }
});
exports.DeleteCampaigns = DeleteCampaigns;

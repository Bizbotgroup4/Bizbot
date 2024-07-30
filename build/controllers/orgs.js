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
exports.UpdateOrganization = exports.getOrgsDetail = exports.AddOrgs = void 0;
const orgs_1 = __importDefault(require("../models/orgs"));
const customers_1 = __importDefault(require("../models/customers"));
const twilio_conf_1 = __importDefault(require("../models/twilio-conf"));
const AddOrgs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.user;
    try {
        const { name, description, url, city, category, email, phone, type } = req.body;
        const createdOrg = yield orgs_1.default.create({
            name,
            description,
            url,
            city,
            category,
            email,
            phone,
            type,
            customer_id: _id,
        });
        yield customers_1.default.updateOne({ _id }, { is_onboarded: true });
        yield twilio_conf_1.default.create({
            accountSid: "",
            authToken: "",
            orgId: createdOrg._id,
            phone: phone,
        });
        return res.status(200).json({
            status: "success",
            message: "Registered successfully",
            org_type: type,
        });
    }
    catch (error) {
        res.status(400).json({
            status: "failed",
            error: error.message,
        });
    }
});
exports.AddOrgs = AddOrgs;
const UpdateOrganization = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.user;
    try {
        const body = __rest(req.body, []);
        const OrgId = yield orgs_1.default.findOne({ customer_id: _id });
        yield orgs_1.default.findOneAndUpdate({ _id: OrgId === null || OrgId === void 0 ? void 0 : OrgId._id }, { $set: body });
        return res.status(200).json({
            status: "success",
            message: "Organization updated successfully",
        });
    }
    catch (error) {
        res.status(400).json({
            status: "failed",
            error: error.message,
        });
    }
});
exports.UpdateOrganization = UpdateOrganization;
const getOrgsDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.user;
    try {
        const customer = yield customers_1.default.findById(_id);
        const organization = yield orgs_1.default.findOne({ customer_id: customer === null || customer === void 0 ? void 0 : customer._id });
        if (organization == null) {
            throw Error("Org not found!");
        }
        return res.status(200).json({
            status: "success",
            message: "Org found",
            organization: organization,
        });
    }
    catch (error) {
        res.status(400).json({
            status: "failed",
            error: error.message,
        });
    }
});
exports.getOrgsDetail = getOrgsDetail;

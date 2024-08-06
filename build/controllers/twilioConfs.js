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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTwilioConfs = exports.UpdateTwilioConfs = void 0;
const orgs_1 = __importDefault(require("../models/orgs"));
const twilio_conf_1 = __importDefault(require("../models/twilio-conf"));
const twilio_1 = require("twilio");
const chatbot_1 = require("./chatbot");
const UpdateTwilioConfs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.user;
    try {
        const Org = yield orgs_1.default.findOne({ customer_id: _id });
        const orgId = Org === null || Org === void 0 ? void 0 : Org._id;
        const { authToken, accountSid, phone } = req.body;
        const twilioClient = new twilio_1.Twilio(accountSid, authToken);
        twilioClient.api
            .accounts(accountSid)
            .fetch()
            .then(() => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            yield twilio_conf_1.default.updateOne({ orgId }, { authToken, accountSid, phone });
            yield (0, chatbot_1.initializeTwilioByOrgId)((_a = orgId === null || orgId === void 0 ? void 0 : orgId.toString()) !== null && _a !== void 0 ? _a : "");
            return res.status(200).json({
                status: "success",
                message: "Twilio configured successfully",
            });
        }))
            .catch((error) => {
            return res.status(200).json({
                status: "failed",
                error: "Please check your SID and auth token of twilio",
            });
        });
    }
    catch (error) {
        res.status(400).json({
            status: "failed",
            error: error.message,
        });
    }
});
exports.UpdateTwilioConfs = UpdateTwilioConfs;
const GetTwilioConfs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.user;
    try {
        const Org = yield orgs_1.default.findOne({ customer_id: _id });
        const twilioConfig = yield twilio_conf_1.default.findOne({ orgId: Org === null || Org === void 0 ? void 0 : Org._id });
        return res.status(200).json({
            status: "success",
            message: "Twilio configuration fetched successfully",
            data: twilioConfig,
        });
    }
    catch (error) {
        res.status(400).json({
            status: "failed",
            error: error.message,
        });
    }
});
exports.GetTwilioConfs = GetTwilioConfs;

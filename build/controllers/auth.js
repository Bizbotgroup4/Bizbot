"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getCustomer = exports.login = exports.register = void 0;
const customers_1 = __importDefault(require("../models/customers"));
const bcryptjs_1 = __importStar(require("bcryptjs"));
const generateToken_1 = require("../utils/generateToken");
const orgs_1 = __importDefault(require("../models/orgs"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield customers_1.default.findOne({ email });
        if (user) {
            return res.status(400).json({
                status: "failed",
                error: "Email is already registered. Try login or use other email.",
            });
        }
        const hash = yield bcryptjs_1.default.hash(password, 8);
        const registeredUser = yield customers_1.default.create({
            email,
            password: hash,
        });
        const responseUser = yield customers_1.default.aggregate([
            { $match: { _id: registeredUser._id } },
            { $unset: "password" },
        ]);
        return res.status(200).json({
            status: "success",
            message: "Registered successfully",
            data: {
                user: responseUser[0],
            },
        });
    }
    catch (error) {
        res.status(400).json({
            status: "failed",
            error: error.message,
        });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        let user;
        if (!email || !password) {
            return res.status(400).json({
                status: "failed",
                error: "Invalid credentials",
            });
        }
        else {
            user = yield customers_1.default.findOne({ email });
        }
        if (user) {
            const validUser = (0, bcryptjs_1.compareSync)(password, user.password);
            if (!validUser) {
                return res.status(400).json({
                    status: "failed",
                    error: "Invalid credentials",
                });
            }
            const token = (0, generateToken_1.generateToken)(user._id.toString());
            if (!token) {
                return res.status(400).json({
                    status: "failed",
                    error: "Error while generating token",
                });
            }
            const responseUser = yield customers_1.default.aggregate([
                { $match: { _id: user._id } },
                { $unset: "password" },
            ]);
            return res.status(200).json({
                status: "success",
                message: "Authenticated successfully",
                data: {
                    user: responseUser[0],
                    token: token,
                },
            });
        }
        else {
            res.status(400).json({
                status: "failed",
                error: "User not found",
            });
        }
    }
    catch (error) {
        res.status(400).json({
            status: "failed",
            error: error.message,
        });
    }
});
exports.login = login;
const getCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.user;
    try {
        const customer = yield customers_1.default.findById(_id);
        const organization = yield orgs_1.default.findOne({ customer_id: customer === null || customer === void 0 ? void 0 : customer._id });
        return res.status(200).json({
            status: "success",
            message: "User found",
            data: Object.assign(Object.assign({}, customer === null || customer === void 0 ? void 0 : customer.toObject()), { org_type: organization === null || organization === void 0 ? void 0 : organization.type }),
        });
    }
    catch (error) {
        res.status(400).json({
            status: "failed",
            error: error.message,
        });
    }
});
exports.getCustomer = getCustomer;

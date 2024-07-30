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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const customers_1 = __importDefault(require("../models/customers"));
require("dotenv").config();
const checkUserAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const authorization = req.header("Authorization");
        if (!authorization) {
            return res.status(400).json({
                status: "failed",
                error: "Request must be authenticated",
            });
        }
        const decoded = jsonwebtoken_1.default.verify(authorization, (_a = process.env.SECRET_KEY) !== null && _a !== void 0 ? _a : "");
        let find = yield customers_1.default.findOne({ _id: decoded._id }, { password: 0 });
        if (find) {
            req.user = find;
            next();
        }
        else {
            return res.status(401).json({
                status: "failed",
                error: "Invalid token",
            });
        }
    }
    catch (err) {
        console.trace('Error while validating user token! Error:', err);
        return res.status(500).json({
            status: "failed",
            error: "Something went wrong, please try again",
        });
    }
});
exports.default = checkUserAuth;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (_id) => {
    var _a;
    const payload = {
        _id,
        iat: Math.floor(Date.now() / 1000) - 30,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 60 * 24,
    };
    try {
        const token = jsonwebtoken_1.default.sign(payload, (_a = process.env.SECRET_KEY) !== null && _a !== void 0 ? _a : "");
        return token;
    }
    catch (err) {
        return false;
    }
};
exports.generateToken = generateToken;

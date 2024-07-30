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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const routes_1 = __importDefault(require("./routes/routes"));
const chatbot_1 = require("./controllers/chatbot");
const PORT = process.env.PORT || 5000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
mongoose_1.default
    .connect((_a = process.env.MONGODB_URI) !== null && _a !== void 0 ? _a : "")
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("MongoDB connected!");
    yield (0, chatbot_1.initializeTwilio)();
    app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return res.send("Yay! App is running."); }));
    app.use(routes_1.default);
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}))
    .catch((error) => {
    console.log("MongoDB connection error: ", error.message);
});

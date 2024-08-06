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
exports.chatBot = exports.initializeTwilioByOrgId = exports.initializeTwilio = void 0;
const twilio_1 = __importDefault(require("twilio"));
const openai_1 = __importDefault(require("openai"));
const orgs_1 = __importDefault(require("../models/orgs"));
const users_1 = __importDefault(require("../models/users"));
const twilio_conf_1 = __importDefault(require("../models/twilio-conf"));
const agent_1 = require("../controllers/agent");
const prompts_1 = require("../controllers/prompts");
const clients = {};
const HISTORY_MESSAGES_LIMIT = 10;
const initializeTwilio = () => __awaiter(void 0, void 0, void 0, function* () {
    const orgs = yield orgs_1.default.find({});
    for (const org of orgs) {
        const orgId = org._id.toString();
        const twilioConf = yield twilio_conf_1.default.findOne({ orgId });
        if (twilioConf == null || !(twilioConf === null || twilioConf === void 0 ? void 0 : twilioConf.accountSid) || !twilioConf.authToken)
            continue;
        try {
            clients[orgId] = (0, twilio_1.default)(twilioConf.accountSid, twilioConf.authToken);
        }
        catch (error) {
            console.log(`twilio connection error for this organization id ${orgId}`, error);
        }
    }
    console.log("Twilio client initialized!");
});
exports.initializeTwilio = initializeTwilio;
const initializeTwilioByOrgId = (orgId) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield getTwilioClient(orgId);
    if (client == null) {
        console.log(`initializeTwilioByOrgId::OrgId: ${orgId} | Couldn't initialize Twilio client!`);
        return;
    }
    clients[orgId] = client;
    console.log(`initializeTwilioByOrgId::OrgId: ${orgId} | Twilio client initialized!`);
});
exports.initializeTwilioByOrgId = initializeTwilioByOrgId;
const getTwilioClient = (orgId) => __awaiter(void 0, void 0, void 0, function* () {
    const twilioConf = yield twilio_conf_1.default.findOne({ orgId });
    if (twilioConf == null || !(twilioConf === null || twilioConf === void 0 ? void 0 : twilioConf.accountSid) || !twilioConf.authToken)
        return;
    let client = null;
    try {
        client = (0, twilio_1.default)(twilioConf.accountSid, twilioConf.authToken);
    }
    catch (error) {
        console.log(`twilio connection error for this organization id ${orgId}`, error);
    }
    return client;
});
const sendMessage = (client, to, from, text) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = [];
    if (text.length >= 1600) {
        messages.push(...text.split("\n\n"));
    }
    else {
        messages.push(text);
    }
    let message = { sid: 'null', status: 'null' };
    for (const messageStr of messages) {
        message = yield client.messages.create({
            from: to,
            to: from,
            body: messageStr,
        });
    }
    return message;
});
const chatBot = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const openai = new openai_1.default.OpenAI({ apiKey: process.env.OPEN_AI_TOKEN });
    // const orgId = "6682fb77038d6b31df3bebc0"; // business
    // const orgId = "66915e179951cd4ad9bfb945"; // ngo
    const orgId = (_b = (_a = req.query.id) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "";
    const incomingMsg = req.body.Body;
    const to = req.body.To;
    const from = req.body.From;
    const phone_number = req.body.From.replace("whatsapp:", "");
    const client = clients[orgId];
    console.log("================== New Request ==================");
    console.log(`webhook::OrgId: ${orgId} | From: ${from} | To: ${to}`);
    console.log(`webhook::OrgId: ${orgId} | Question: ${incomingMsg}`);
    if (client == null) {
        console.log(`webhook::OrgId: ${orgId} | Twilio client not found for orgId.`);
        return;
    }
    const is_user_exist = yield users_1.default.findOne({ phone_number });
    let org = null;
    try {
        org = yield orgs_1.default.findById(orgId);
    }
    catch (error) {
        // do nothing as it's already handled below
    }
    let answer = "...";
    if (typeof orgId !== "string" || org == null) {
        answer =
            "It seems this chatbot is not configured correctly. Please contact the admin.";
    }
    else if (!is_user_exist) {
        yield users_1.default.create({
            phone_number: req.body.From.replace("whatsapp:", ""),
            city: "",
        });
        answer =
            "Welcome to BizBot!\n\nPlease enter your city name to improve your experience and recommendations";
    }
    else if (!is_user_exist.city) {
        const prompt = (0, prompts_1.cityDetectionPrompt)(req.body.Body);
        const response = yield openai.chat.completions.create({
            model: (_c = process.env.OPEN_AI_MODEL) !== null && _c !== void 0 ? _c : "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
        });
        let jsonString = (_e = (_d = response.choices[0].message.content) === null || _d === void 0 ? void 0 : _d.trim()) !== null && _e !== void 0 ? _e : "";
        if (jsonString.includes("```") === true) {
            jsonString = jsonString.split(/```(?:json)?/)[1];
        }
        console.log("CityDetection::Response:", JSON.stringify(response.choices[0].message.content));
        console.log("CityDetection::Parsed JSON: ", JSON.stringify(jsonString));
        const isCityValidate = JSON.parse(jsonString !== null && jsonString !== void 0 ? jsonString : "{}");
        if (isCityValidate.valid) {
            yield users_1.default.findOneAndUpdate({
                phone_number: req.body.From.replace("whatsapp:", ""),
            }, { city: isCityValidate.city });
            answer = `Welcome to BizBot!\n\nAsk me anything about *${org === null || org === void 0 ? void 0 : org.name}*.`;
        }
        else {
            answer = isCityValidate.message;
        }
    }
    else if (incomingMsg === "CLEAR DATA") {
        yield users_1.default.deleteOne({ phone_number: phone_number });
        answer = "Your stored preference has been remove from our system.";
    }
    else {
        const sendedMessage = yield client.messages.list({
            limit: HISTORY_MESSAGES_LIMIT,
            to: from,
        });
        const receivedMessage = yield client.messages.list({
            limit: HISTORY_MESSAGES_LIMIT,
            from: from,
        });
        const sendedAndReceivedMsg = receivedMessage.concat(sendedMessage);
        const sorted = sendedAndReceivedMsg.sort((first, second) => (first === null || first === void 0 ? void 0 : first.dateSent) - (second === null || second === void 0 ? void 0 : second.dateSent));
        const response = yield (0, agent_1.executeQuery)(orgId, incomingMsg, phone_number, sorted);
        answer = response;
    }
    try {
        const message = yield sendMessage(client, to, from, answer);
        console.log(`webhook::OrgId: ${orgId} | Answer: ${answer}`);
        console.log(`webhook::OrgId: ${orgId} | MessageSID: ${message.sid} | MessageStatus: ${message.status}`);
    }
    catch (error) {
        console.log(`webhook::OrgId: ${orgId} | Error: ${error}`);
    }
    res.end();
});
exports.chatBot = chatBot;

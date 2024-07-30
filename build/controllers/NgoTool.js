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
const openai_1 = require("@langchain/openai");
const agents_1 = require("langchain/agents");
const prompts_1 = require("@langchain/core/prompts");
const agents_2 = require("langchain/agents");
const messages_1 = require("@langchain/core/messages");
const zod_1 = require("zod");
const tools_1 = require("@langchain/core/tools");
const users_1 = __importDefault(require("../models/users"));
const ngos_1 = __importDefault(require("../models/ngos"));
const NgoTool = (incomingMsg, phone_number, old_message) => __awaiter(void 0, void 0, void 0, function* () {
    const oldChat = old_message.map((chat) => {
        return chat.from === "whatsapp:+14155238886"
            ? new messages_1.AIMessage(chat.body)
            : new messages_1.HumanMessage(chat.body);
    });
    const llm = new openai_1.ChatOpenAI({
        apiKey: process.env.OPEN_AI_TOKEN,
        model: "gpt-4o",
        temperature: 0,
    });
    const tools = [
        new tools_1.DynamicTool({
            name: "fetch-user-city",
            description: "call this to get the city of user. input should be an empty string.",
            func: () => __awaiter(void 0, void 0, void 0, function* () {
                var _a;
                console.log("Invoked::getCity");
                const user = yield users_1.default.findOne({ phone_number: phone_number });
                console.log("Result::getCity : ", user === null || user === void 0 ? void 0 : user.city);
                return (_a = user === null || user === void 0 ? void 0 : user.city) !== null && _a !== void 0 ? _a : "";
            }),
        }),
        // tool with multiple inputs
        new tools_1.DynamicStructuredTool({
            name: "nearest-ngo-or-shop-finder",
            description: "use this to get details of nearest NGO and local businesses.",
            schema: zod_1.z.object({
                city: zod_1.z.string().describe("name of the city where user lives"),
                category: zod_1.z
                    .string()
                    .describe("category of the ngo or shop to search. Allowed value is one of [any,health, education, advocacy]"),
                type: zod_1.z
                    .string()
                    .describe("type of data to search. Allowed value is on of [ngo,business]"),
            }),
            func: (_b) => __awaiter(void 0, [_b], void 0, function* ({ city, category, type }) {
                console.log("Invoked::getNGOOrBusiness");
                console.log("Result:getNGOOrBusiness", city, category, type);
                const ngos = yield ngos_1.default.find(Object.assign(Object.assign({ city: city }, (category === "any" ? {} : { category: category.toLowerCase() })), { type: type.toLowerCase() }));
                console.log("Answer : ", ngos);
                return JSON.stringify(ngos);
            }),
        }),
    ];
    const prompt = prompts_1.ChatPromptTemplate.fromMessages([
        ["system", "You are a helpful assistant"],
        ["placeholder", "{chat_history}"],
        ["human", "{input}"],
        ["placeholder", "{agent_scratchpad}"],
    ]);
    const agent = (0, agents_1.createToolCallingAgent)({
        llm,
        tools,
        prompt,
    });
    const agentExecutor = new agents_2.AgentExecutor({
        agent,
        tools,
        verbose: false,
    });
    const result = yield agentExecutor.invoke({
        input: incomingMsg,
        chat_history: oldChat.slice(-10),
    });
    return result.output;
});
exports.default = NgoTool;

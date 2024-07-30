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
exports.executeQuery = void 0;
const zod_1 = require("zod");
const openai_1 = require("@langchain/openai");
const agents_1 = require("langchain/agents");
const prompts_1 = require("@langchain/core/prompts");
const agents_2 = require("langchain/agents");
const messages_1 = require("@langchain/core/messages");
const tools_1 = require("@langchain/core/tools");
const orgs_1 = __importDefault(require("../models/orgs"));
const products_1 = __importDefault(require("../models/products"));
const campaigns_1 = __importDefault(require("../models/campaigns"));
const orgTypes_1 = __importDefault(require("../constants/orgTypes"));
const prompts_2 = require("./prompts");
const productFields = ['name', 'description', 'price', 'category', 'sizes', 'colors', 'stock', 'url'];
const campaignFields = ['name', 'description', 'category', 'targetQuantity', 'donationUrl', 'email', 'phone'];
const searchProducts = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const { category, color, size } = input;
    console.log(`Invoked::searchProducts | Category: ${category} | Color: ${color} | Size: ${size}`);
    const query = Object.assign(Object.assign(Object.assign({}, (category === "Any" ? {} : { category })), (color === "Any" ? {} : { colors: color })), (size === "Any" ? {} : { sizes: size }));
    console.log(`Invoked::searchProducts | Find Query: ${JSON.stringify(query)}`);
    const products = yield products_1.default.find(query, productFields).limit(10);
    console.log(`Result::searchProducts | Products: ${JSON.stringify(products)}`);
    return JSON.stringify(products);
});
const searchCampaigns = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const { category } = input;
    console.log(`Invoked::searchCampaigns | Category: ${category}`);
    const query = Object.assign({}, (category === "Any" ? {} : { category }));
    console.log(`Invoked::searchCampaigns | Find Query: ${JSON.stringify(query)}`);
    const campaigns = yield campaigns_1.default.find(query, campaignFields).limit(10);
    console.log(`Result::searchCampaigns | Campaigns: ${JSON.stringify(campaigns)}`);
    return JSON.stringify(campaigns);
});
const getBusinessTools = (orgId) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield products_1.default.distinct("category", { orgId });
    const colors = yield products_1.default.distinct("colors", { orgId });
    const sizes = yield products_1.default.distinct("sizes", { orgId });
    // add universal 'Any' value
    categories.push("Any");
    colors.push("Any");
    sizes.push("Any");
    console.log(`getBusinessTools::Category: ${categories}`);
    console.log(`getBusinessTools::Colors: ${colors}`);
    console.log(`getBusinessTools::Sizes: ${sizes}`);
    const tools = [
        new tools_1.DynamicStructuredTool({
            name: "search-products",
            description: `Search products by category, color and size. Product fields: ${productFields}.`,
            schema: zod_1.z.object({
                category: zod_1.z.string().describe(`Category of the product to search. Allowed value is one of ${categories}`),
                color: zod_1.z.string().describe(`Color of the product to search. Allowed value is one of ${colors}`),
                size: zod_1.z.string().describe(`Size of the product to search. Allowed value is one of ${sizes}`),
            }),
            func: searchProducts,
        }),
    ];
    console.log(`getBusinessTools::Tools: ${tools.map(tool => tool.name)}`);
    return tools;
});
const getNgoTools = (orgId) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield campaigns_1.default.distinct("category", { orgId });
    // add universal 'Any' value
    categories.push("Any");
    console.log(`getNgoTools::Category: ${categories}`);
    const tools = [
        new tools_1.DynamicStructuredTool({
            name: "search-campaigns",
            description: `Search campaigns by category. Product fields: ${campaignFields}`,
            schema: zod_1.z.object({
                category: zod_1.z.string().describe(`Category of the campaign to search. Allowed value is one of ${categories}`),
            }),
            func: searchCampaigns,
        }),
    ];
    console.log(`getNgoTools::Tools: ${tools.map(tool => tool.name)}`);
    return tools;
});
const executeQuery = (orgId, inputMessage, phoneNumber, oldMessage) => __awaiter(void 0, void 0, void 0, function* () {
    const org = yield orgs_1.default.findById(orgId);
    console.log(`executeQuery::Organization: ${JSON.stringify(org)}`);
    const llm = new openai_1.ChatOpenAI({
        apiKey: process.env.OPEN_AI_TOKEN,
        model: "gpt-4o",
        temperature: 0,
    });
    const tools = (org === null || org === void 0 ? void 0 : org.type) === orgTypes_1.default.BUSINESS
        ? yield getBusinessTools(orgId)
        : yield getNgoTools(orgId);
    const systemPrompt = (org === null || org === void 0 ? void 0 : org.type) === orgTypes_1.default.BUSINESS ? prompts_2.businessAgentSystemPrompt : prompts_2.ngoAgentSystemPrompt;
    const prompt = prompts_1.ChatPromptTemplate.fromMessages([
        ["system", systemPrompt],
        ["placeholder", "{chat_history}"],
        ["human", "{input}"],
        ["placeholder", "{agent_scratchpad}"],
    ]);
    const agent = (0, agents_1.createToolCallingAgent)({ llm, tools, prompt });
    const agentExecutor = new agents_2.AgentExecutor({ agent, tools, verbose: false });
    const oldChat = oldMessage.map((chat) => {
        return chat.from === `whatsapp:${phoneNumber}`
            ? new messages_1.HumanMessage(chat.body)
            : new messages_1.AIMessage(chat.body);
    });
    const result = yield agentExecutor.invoke({
        input: inputMessage,
        chat_history: oldChat.slice(-10),
        orgName: org === null || org === void 0 ? void 0 : org.name,
        org: JSON.stringify(org),
    });
    return result.output;
});
exports.executeQuery = executeQuery;

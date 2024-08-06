import { z } from "zod";

import { ChatOpenAI } from "@langchain/openai";
import { createToolCallingAgent } from "langchain/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { AgentExecutor } from "langchain/agents";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { DynamicStructuredTool } from "@langchain/core/tools";

import Orgs from "../models/orgs";
import Products from "../models/products";
import Campaigns from "../models/campaigns";
import orgTypes from "../constants/orgTypes";

import { businessAgentSystemPrompt, ngoAgentSystemPrompt } from "./prompts";

const productFields = ['name', 'description', 'price', 'category', 'sizes', 'colors', 'stock', 'url'];
const campaignFields = ['name', 'description', 'category', 'targetQuantity', 'donationUrl', 'email', 'phone'];

const searchProducts = async (orgId: string, input: { category: string, color: string, size: string }) => {

  const { category, color, size } = input;
  console.log(`Invoked::searchProducts | Category: ${category} | Color: ${color} | Size: ${size}`);

  const query = {
    orgId,
    ...(category === "Any" ? {} : { category }),
    ...(color === "Any" ? {} : { colors: color }),
    ...(size === "Any" ? {} : { sizes: size }),
  };
  console.log(`Invoked::searchProducts | Find Query: ${JSON.stringify(query)}`);

  const products = await Products.find(query, productFields).limit(10);
  console.log(`Result::searchProducts | Products: ${JSON.stringify(products)}`);

  return JSON.stringify(products);

}

const searchCampaigns = async (orgId: string, input: { category: string }) => {

  const { category } = input;
  console.log(`Invoked::searchCampaigns | Category: ${category}`);

  const query = {
    orgId,
    ...(category === "Any" ? {} : { category }),
  };
  console.log(`Invoked::searchCampaigns | Find Query: ${JSON.stringify(query)}`);

  const campaigns = await Campaigns.find(query, campaignFields).limit(10);
  console.log(`Result::searchCampaigns | Campaigns: ${JSON.stringify(campaigns)}`);

  return JSON.stringify(campaigns);

}

const getBusinessTools = async (orgId: string) => {

  const categories = await Products.distinct("category", { orgId });
  const colors = await Products.distinct("colors", { orgId });
  const sizes = await Products.distinct("sizes", { orgId });
  // add universal 'Any' value
  categories.push("Any");
  colors.push("Any");
  sizes.push("Any");

  console.log(`getBusinessTools::Category: ${categories}`);
  console.log(`getBusinessTools::Colors: ${colors}`);
  console.log(`getBusinessTools::Sizes: ${sizes}`);

  const tools = [

    new DynamicStructuredTool({
      name: "search-products",
      description: `Search products by category, color and size. Product fields: ${productFields}.`,
      schema: z.object({
        category: z.string().describe(`Category of the product to search. Allowed value is one of ${categories}`),
        color: z.string().describe(`Color of the product to search. Allowed value is one of ${colors}`),
        size: z.string().describe(`Size of the product to search. Allowed value is one of ${sizes}`),
      }),
      func: searchProducts.bind(null, orgId),
    }),

  ];
  console.log(`getBusinessTools::Tools: ${tools.map(tool => tool.name)}`);

  return tools;

};

const getNgoTools = async (orgId: string) => {

  const categories = await Campaigns.distinct("category", { orgId });
  // add universal 'Any' value
  categories.push("Any");

  console.log(`getNgoTools::Category: ${categories}`);

  const tools = [

    new DynamicStructuredTool({
      name: "search-campaigns",
      description: `Search campaigns by category. Product fields: ${campaignFields}`,
      schema: z.object({
        category: z.string().describe(`Category of the campaign to search. Allowed value is one of ${categories}`),
      }),
      func: searchCampaigns.bind(null, orgId),
    }),

  ];
  console.log(`getNgoTools::Tools: ${tools.map(tool => tool.name)}`);

  return tools;

};

const executeQuery = async (orgId: string, inputMessage: string, phoneNumber: string, oldMessage: any[]) => {

  const org = await Orgs.findById(orgId);
  console.log(`executeQuery::Organization: ${JSON.stringify(org)}`);

  const llm = new ChatOpenAI({
    apiKey: process.env.OPEN_AI_TOKEN,
    model: process.env.OPEN_AI_MODEL,
    temperature: 0,
  });

  const tools = org?.type === orgTypes.BUSINESS
    ? await getBusinessTools(orgId)
    : await getNgoTools(orgId);

  const systemPrompt = org?.type === orgTypes.BUSINESS ? businessAgentSystemPrompt : ngoAgentSystemPrompt;

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    ["placeholder", "{chat_history}"],
    ["human", "{input}"],
    ["placeholder", "{agent_scratchpad}"],
  ]);

  const agent = createToolCallingAgent({ llm, tools, prompt });

  const agentExecutor = new AgentExecutor({ agent, tools, verbose: false });

  const oldChat: any[] = oldMessage.map((chat) => {
    return chat.from === `whatsapp:${phoneNumber}`
      ? new HumanMessage(chat.body)
      : new AIMessage(chat.body);
  });

  const result = await agentExecutor.invoke({
    input: inputMessage,
    chat_history: oldChat.slice(-10),
    orgName: org?.name,
    org: JSON.stringify(org),
    contactUrl: `${process.env.PLATFORM_URL}/contact-us?id=${orgId}`,
  });

  return result.output;

};

export { executeQuery };

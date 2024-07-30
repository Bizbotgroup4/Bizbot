import { ChatOpenAI } from "@langchain/openai";
import { createToolCallingAgent } from "langchain/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { AgentExecutor } from "langchain/agents";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { z } from "zod";
import { DynamicTool, DynamicStructuredTool } from "@langchain/core/tools";
import Users from "../models/users";
import Ngo from "../models/ngos";

const NgoTool = async (
  incomingMsg: string,
  phone_number: string,
  old_message: any[]
) => {
  const oldChat: any[] = old_message.map((chat) => {
    return chat.from === "whatsapp:+14155238886"
      ? new AIMessage(chat.body)
      : new HumanMessage(chat.body);
  });
  const llm = new ChatOpenAI({
    apiKey: process.env.OPEN_AI_TOKEN,
    model: "gpt-4o",
    temperature: 0,
  });

  const tools = [
    new DynamicTool({
      name: "fetch-user-city",
      description:
        "call this to get the city of user. input should be an empty string.",
      func: async () => {
        console.log("Invoked::getCity");
        const user = await Users.findOne({ phone_number: phone_number });
        console.log("Result::getCity : ", user?.city);
        return user?.city ?? "";
      },
    }),

    // tool with multiple inputs
    new DynamicStructuredTool({
      name: "nearest-ngo-or-shop-finder",
      description:
        "use this to get details of nearest NGO and local businesses.",
      schema: z.object({
        city: z.string().describe("name of the city where user lives"),
        category: z
          .string()
          .describe(
            "category of the ngo or shop to search. Allowed value is one of [any,health, education, advocacy]"
          ),
        type: z
          .string()
          .describe(
            "type of data to search. Allowed value is on of [ngo,business]"
          ),
      }),
      func: async ({ city, category, type }) => {
        console.log("Invoked::getNGOOrBusiness");
        console.log("Result:getNGOOrBusiness", city, category, type);
        const ngos = await Ngo.find({
          city: city,
          ...(category === "any" ? {} : { category: category.toLowerCase() }),
          type: type.toLowerCase(),
        });
        console.log("Answer : ", ngos);
        return JSON.stringify(ngos);
      },
    }),
  ];

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a helpful assistant"],
    ["placeholder", "{chat_history}"],
    ["human", "{input}"],
    ["placeholder", "{agent_scratchpad}"],
  ]);

  const agent = createToolCallingAgent({
    llm,
    tools,
    prompt,
  });

  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    verbose: false,
  });

  const result = await agentExecutor.invoke({
    input: incomingMsg,
    chat_history: oldChat.slice(-10),
  });
  return result.output;
};

export default NgoTool;

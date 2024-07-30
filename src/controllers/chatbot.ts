import { Request, Response } from "express";
import twilio, { Twilio } from "twilio";
import OpenAIApi from "openai";

import Orgs from "../models/orgs";
import Users from "../models/users";
import TwilioConfs from "../models/twilio-conf";

import { executeQuery } from "../controllers/agent";
import { cityDetectionPrompt } from "../controllers/prompts";

const clients: Record<string, Twilio> = {};

const HISTORY_MESSAGES_LIMIT = 10;

const initializeTwilio = async () => {
  const orgs = await Orgs.find({});

  for (const org of orgs) {
    const orgId: string = org._id.toString();
    const twilioConf = await TwilioConfs.findOne({ orgId });

    if (twilioConf == null || !twilioConf?.accountSid || !twilioConf.authToken)
      continue;

    try {
      clients[orgId] = twilio(twilioConf.accountSid, twilioConf.authToken);
    } catch (error) {
      console.log(`twilio connection error for this organization id ${orgId}`, error);
    }
  }

  console.log("Twilio client initialized!");
};

const chatBot = async (req: Request, res: Response) => {
  const openai = new OpenAIApi.OpenAI({ apiKey: process.env.OPEN_AI_TOKEN });

  // const orgId = "6682fb77038d6b31df3bebc0"; // business
  // const orgId = "66915e179951cd4ad9bfb945"; // ngo
  const orgId = req.query.id?.toString() ?? "";
  const incomingMsg = req.body.Body;
  const to = req.body.To;
  const from = req.body.From;
  const phone_number = req.body.From.replace("whatsapp:", "");

  if (clients[orgId] == null) {
    console.log(
      `webhook::OrgId: ${orgId} | Twilio client not found for orgId.`
    );
  }
  const client = clients[orgId];

  const is_user_exist = await Users.findOne({ phone_number });

  let org = null;
  try {
    org = await Orgs.findById(orgId);
  } catch (error) {
    // do nothing as it's already handled below
  }

  console.log("================== New Request ==================");
  console.log(`webhook::OrgId: ${orgId} | From: ${from} | To: ${to}`);
  console.log(`webhook::OrgId: ${orgId} | Question: ${incomingMsg}`);

  let answer = "...";

  if (typeof orgId !== "string" || org == null) {
    answer =
      "It seems this chatbot is not configured correctly. Please contact the admin.";
  } else if (!is_user_exist) {
    await Users.create({
      phone_number: req.body.From.replace("whatsapp:", ""),
      city: "",
    });

    answer =
      "Welcome to BizBot!\n\nPlease enter your city name to improve your experience and recommendations";
  } else if (!is_user_exist.city) {
    const prompt = cityDetectionPrompt(req.body.Body);
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    let jsonString = response.choices[0].message.content?.trim() ?? "";
    if (jsonString.includes("```") === true) {
      jsonString = jsonString.split(/```(?:json)?/)[1];
    }

    console.log(
      "CityDetection::Response:",
      JSON.stringify(response.choices[0].message.content)
    );
    console.log("CityDetection::Parsed JSON: ", JSON.stringify(jsonString));

    const isCityValidate = JSON.parse(jsonString ?? "{}");

    if (isCityValidate.valid) {
      await Users.findOneAndUpdate(
        {
          phone_number: req.body.From.replace("whatsapp:", ""),
        },
        { city: isCityValidate.city }
      );

      answer = `Welcome to BizBot!\n\nAsk me anything about *${org?.name}*.`;
    } else {
      answer = isCityValidate.message;
    }
  } else if (incomingMsg === "CLEAR DATA") {
    await Users.deleteOne({ phone_number: phone_number });

    answer = "Your stored preference has been remove from our system.";
  } else {
    const sendedMessage = await client.messages.list({
      limit: HISTORY_MESSAGES_LIMIT,
      to: from,
    });
    const receivedMessage = await client.messages.list({
      limit: HISTORY_MESSAGES_LIMIT,
      from: from,
    });
    const sendedAndReceivedMsg = receivedMessage.concat(sendedMessage);
    const sorted = sendedAndReceivedMsg.sort(
      (first: any, second: any) => first?.dateSent - second?.dateSent
    );

    const response = await executeQuery(
      orgId,
      incomingMsg,
      phone_number,
      sorted
    );

    answer = response;
  }

  try {
    const message = await client.messages.create({
      from: to,
      to: from,
      body: answer,
    });
    console.log(`webhook::OrgId: ${orgId} | Answer: ${answer}`);
    console.log(
      `webhook::OrgId: ${orgId} | MessageSID: ${message.sid} | MessageStatus: ${message.status}`
    );
  } catch (error) {
    console.log(`webhook::OrgId: ${orgId} | Error: ${error}`);
  }

  res.end();
};

export { initializeTwilio, chatBot };

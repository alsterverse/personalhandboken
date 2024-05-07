
import { App, ExpressReceiver } from "@slack/bolt";
import dotenv from "dotenv";
import {
    parseRequestBody,
    generateReceiverEvent,
    isUrlVerificationRequest
} from  "../utils";
import { getOpenAiResponse } from "../utils";

dotenv.config();

const expressReceiver = new ExpressReceiver({
    signingSecret: `${process.env.SLACK_SIGNING_SECRET}`,
    processBeforeResponse: true
});

const app = new App({
    signingSecret: `${process.env.SLACK_SIGNING_SECRET}`,
    token: `${process.env.SLACK_BOT_TOKEN}`,
    receiver: expressReceiver
});

app.message(async ({ message, say }) => {
    try {
      let text = message.text
      console.log(text)
      text = getOpenAiResponse("text")
      console.log(text+"2")
    //   const res = await fetch(process.env.CHAT_URL, {
    //         method: 'POST',
    //         body: JSON.stringify(
    //             {"messages": [{"content": text}]}
    //         )
    //     })
        
    //     const answer = await res.text()

        say(text)
   
    } catch (error) {
      console.log("err")
      console.error(error);
    }
});

exports.handler = async (event, context) => {
    const payload = parseRequestBody(event.body, event.headers["content-type"]);

    if (isUrlVerificationRequest(payload)) {
        return {
            statusCode: 200,
            body: payload?.challenge
        };
    }

    const slackEvent = generateReceiverEvent(payload);
    await app.processEvent(slackEvent);

    return {
        "x-slack-no-retry": 1,
        statusCode: 200,
        body: "body"
    };
};

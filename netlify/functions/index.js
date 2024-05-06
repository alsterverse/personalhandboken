
import { App, ExpressReceiver } from "@slack/bolt";
import dotenv from "dotenv";
import {
    parseRequestBody,
    generateReceiverEvent,
    isUrlVerificationRequest
} from  "../utils";

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
      const res = await fetch(process.env.CHAT_URL, {
            method: 'POST',
            body: JSON.stringify(
                {"messages": [{"content": text}]}
            )
        })
        
        const answer = await res.text()

        say(answer)
   
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
        statusCode: 200,
        body: "body"
    };
};

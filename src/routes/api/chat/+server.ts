import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { env } from "$env/dynamic/private";
import type { RequestHandler } from "./$types";
import getFileContents from "../../../lib/google";

const text = await getFileContents(env.GOOGLE_DRIVE_FILE_ID);

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY || "",
});

export const POST = (async ({ request }) => {
  // Extract the `prompt` from the body of the request
  const { messages } = await request.json();
  const latestMessage = messages[messages.length - 1];

  const query = `Använd denna information för att svara på frågan

      Information:
      ${text}

      Fråga: ${latestMessage.content}?`;

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [
      {
        role: "system",
        content:
          "Svara på frågor om företaget Alster, baserat på din information.",
      },
      { role: "user", content: query },
    ],
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}) satisfies RequestHandler;

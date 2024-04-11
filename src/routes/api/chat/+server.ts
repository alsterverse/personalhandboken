import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

import { env } from "$env/dynamic/private";
// You may want to replace the above with a static private env variable
// for dead-code elimination and build-time type-checking:
// import { OPENAI_API_KEY } from '$env/static/private'

import type { RequestHandler } from "./$types";

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Pinecone } from "@pinecone-database/pinecone";
import { Document } from "@langchain/core/documents";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";

// Instantiate a new Pinecone client, which will automatically read the
// env vars: PINECONE_API_KEY and PINECONE_ENVIRONMENT which come from
// the Pinecone dashboard at https://app.pinecone.io

const pinecone = new Pinecone({ apiKey: env.PINECONE_API_KEY });

const pineconeIndex = pinecone.Index("sample-movies");

// const docs = [
//   new Document({
//     metadata: { foo: "bar" },
//     pageContent: "Jim likes to run and he is a good swimmer",
//   }),
//   new Document({
//     metadata: { foo: "bar" },
//     pageContent: "Johanna likes to run too and she also likes to swim",
//   }),
//   new Document({
//     metadata: { baz: "qux" },
//     pageContent: "John likes to run too and he also likes to swim and bike",
//   }),
//   new Document({
//     metadata: { baz: "qux" },
//     pageContent:
//       "Viktor likes to run too and he also likes to swim and bike and play basketball",
//   }),
// ];

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY || "",
});

export const POST = (async ({ request }) => {
  // const psResponse = await PineconeStore.fromDocuments(
  //   docs,
  //   new OpenAIEmbeddings({ openAIApiKey: env.OPENAI_API_KEY }),
  //   {
  //     pineconeIndex,
  //     maxConcurrency: 5, // Maximum number of batch requests to allow at once. Each batch is 1000 vectors.
  //   }
  // );

  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings({ openAIApiKey: env.OPENAI_API_KEY }),
    { pineconeIndex }
  );

  // Extract the `prompt` from the body of the request
  const { messages } = await request.json();

  // Search the vector DB independently with the latest message
  const latestMessage = messages[messages.length - 1];
  const results = await vectorStore.similaritySearch(latestMessage.content, 1);

  const searchResult = results[0]?.pageContent;

  const query = `Use the below article to help answer questions if needed"

      Article:
      ${searchResult}

      Question: ${latestMessage.content}?`;

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [
      { role: "system", content: "You answer questions about training" },
      { role: "user", content: query },
    ],
  });
  // const response = await openai.chat.completions.create({
  //   model: "gpt-3.5-turbo",
  //   stream: true,
  //   messages: messages.map((message: any) => ({
  //     content: ` ${searchResult}

  //     Question: ${message.content}`,
  //     role: message.role,
  //   })),
  // });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}) satisfies RequestHandler;

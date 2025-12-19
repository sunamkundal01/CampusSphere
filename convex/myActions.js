"use node";

import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { action } from "./_generated/server.js";
import { v } from "convex/values";

export const ingest = action({
  args: {
    sliptText: v.any(),
    fileId: v.any(),
    apiKey: v.string(), // Accept API key from client
  },
  handler: async (ctx, args) => {
    const formattedMetadata = { fileId: args.fileId };

    await ConvexVectorStore.fromTexts(
      args.sliptText,
      formattedMetadata,
      new GoogleGenerativeAIEmbeddings({
        apiKey: args.apiKey, // Use client-provided API key
        model: "text-embedding-004",
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),
      { ctx }
    );

    return "Completed.... ";
  },
});

export const search = action({
  args: {
    query: v.string(),
    fileId: v.string(),
    apiKey: v.string(), // Accept API key from client
  },
  handler: async (ctx, args) => {
    const vectorStore = new ConvexVectorStore(
      new GoogleGenerativeAIEmbeddings({
        apiKey: args.apiKey, // Use client-provided API key
        model: "text-embedding-004",
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),
      { ctx }
    );

    const resultOne = await (
      await vectorStore.similaritySearch(args.query, 1)
    ).filter((q) => q.metadata.fileId == args.fileId);
    console.log(resultOne);

    return JSON.stringify(resultOne);
  },
});

"use node";

// LangChain imports commented out - replaced with direct Gemini API
// import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
// import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
// import { TaskType } from "@google/generative-ai";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { action } from "./_generated/server.js";
import { api } from "./_generated/api.js";
import { v } from "convex/values";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export const ingest = action({
  args: {
    sliptText: v.any(),
    fileId: v.any(),
  },
  handler: async (ctx, args) => {
    // Store text chunks directly in the documents table
    const chunks = args.sliptText;
    
    for (let i = 0; i < chunks.length; i++) {
      await ctx.runMutation(api.documents.insertChunk, {
        text: chunks[i],
        fileId: args.fileId,
        chunkIndex: i,
        metadata: { fileId: args.fileId },
      });
    }

    return "Completed.... ";
  },
});

export const search = action({
  args: {
    query: v.string(),
    fileId: v.string()
  },
  handler: async (ctx, args) => {
    // Query documents from Convex by fileId
    const chunks = await ctx.runQuery(api.documents.getChunksByFileId, { 
      fileId: args.fileId 
    });

    // Build context from chunks with size limit to avoid token limits
    // Gemini 2.0 Flash has ~1M token context, but we'll be conservative
    const maxContextLength = 50000; // ~50K characters should be safe
    let context = "";
    let usedChunks = [];
    
    for (const chunk of chunks) {
      if (context.length + chunk.text.length > maxContextLength) {
        break;
      }
      context += chunk.text + "\n\n";
      usedChunks.push(chunk);
    }

    // Use Gemini API to generate response based on document context
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const prompt = `Based on the following document content, answer this question: "${args.query}"\n\nDocument Content:\n${context}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const answer = response.text();

    // Return formatted results with answer and context
    return JSON.stringify({
      answer: answer,
      context: usedChunks.slice(0, 3).map(c => ({ text: c.text })) // Return top 3 chunks as context
    });
  },
});

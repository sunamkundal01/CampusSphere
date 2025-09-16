"use node";

import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { action } from "./_generated/server.js";
import { v } from "convex/values";
import {
  initializeLangChainVectorStore,
  LANGCHAIN_CONFIG,
} from "./langchain/db.js";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

// Initialize Gemini AI for answer formatting
const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_API_KEY || "AIzaSyAnnFpHYGUSb4GmGe6LtutpA_OTeOtQwIw"
);
const geminiModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 0.7,
  topP: 0.8,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export const ingest = action({
  args: {
    sliptText: v.any(),
    fileId: v.any(),
  },
  handler: async (ctx, args) => {
    // Ensure the fileId is stored in the desired format
    const formattedMetadata = { fileId: args.fileId };

    await ConvexVectorStore.fromTexts(
      args.sliptText, // Array of texts
      formattedMetadata, // Pass the metadata as an object
      new GoogleGenerativeAIEmbeddings({
        apiKey: "AIzaSyAnnFpHYGUSb4GmGe6LtutpA_OTeOtQwIw",
        model: "text-embedding-004", // 768 dimensions
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),
      { ctx }
    );

    return "Completed....";
  },
});

// Enhanced LangChain-based ingestion with better error handling
export const ingestWithLangChain = action({
  args: {
    splitText: v.array(v.string()),
    fileId: v.string(),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    try {
      const vectorStore = initializeLangChainVectorStore(ctx);

      // Enhanced metadata with file information
      const enhancedMetadata = {
        fileId: args.fileId,
        timestamp: new Date().toISOString(),
        chunkCount: args.splitText.length,
        ...args.metadata,
      };

      // Store each text chunk with enhanced metadata
      await vectorStore.addDocuments(
        args.splitText.map((text, index) => ({
          pageContent: text,
          metadata: {
            ...enhancedMetadata,
            chunkIndex: index,
            chunkId: `${args.fileId}_chunk_${index}`,
          },
        }))
      );

      return {
        success: true,
        message: `Successfully ingested ${args.splitText.length} chunks for file ${args.fileId}`,
        chunksProcessed: args.splitText.length,
      };
    } catch (error) {
      console.error("Error in LangChain ingestion:", error);
      throw new Error(`Failed to ingest document: ${error.message}`);
    }
  },
});

export const search = action({
  args: {
    query: v.string(),
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      console.log("Search query:", args.query);
      console.log("File ID:", args.fileId);

      const vectorStore = new ConvexVectorStore(
        new GoogleGenerativeAIEmbeddings({
          apiKey: "AIzaSyAnnFpHYGUSb4GmGe6LtutpA_OTeOtQwIw",
          model: "text-embedding-004", // 768 dimensions
          taskType: TaskType.RETRIEVAL_DOCUMENT,
          title: "Document title",
        }),
        { ctx }
      );

      // Get more results initially (increase from 15 to 20 for more comprehensive coverage)
      const allResults = await vectorStore.similaritySearch(args.query, 20);
      console.log("All search results:", allResults.length);

      // Filter by fileId with more flexible matching
      const filteredResults = allResults.filter((doc) => {
        const docFileId = doc.metadata?.fileId;
        console.log(
          "Document fileId:",
          docFileId,
          "Target fileId:",
          args.fileId
        );
        return docFileId && docFileId.toString() === args.fileId.toString();
      });

      console.log("Filtered results:", filteredResults.length);
      console.log("Final results:", filteredResults);

      return JSON.stringify(filteredResults);
    } catch (error) {
      console.error("Search error:", error);
      throw error;
    }
  },
});

// Enhanced LangChain-based search with better filtering and scoring
export const searchWithLangChain = action({
  args: {
    query: v.string(),
    fileId: v.string(),
    limit: v.optional(v.number()),
    scoreThreshold: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    try {
      console.log(
        "LangChain search - Query:",
        args.query,
        "FileId:",
        args.fileId
      );

      const vectorStore = initializeLangChainVectorStore(ctx);

      const searchLimit = args.limit || 8; // Increased from 5 to 8 for more comprehensive answers
      // Lower the threshold to be more permissive (0.1 instead of 0.2) to capture more content
      const threshold = args.scoreThreshold || 0.1;

      // Perform similarity search with scoring - get even more results
      const searchResults = await vectorStore.similaritySearchWithScore(
        args.query,
        searchLimit * 6 // Increased from 4 to 6 to ensure we capture complete lists and sequences
      );

      console.log("Raw search results count:", searchResults.length);

      // Filter by fileId with more flexible matching
      const filteredResults = searchResults
        .filter(([doc, score]) => {
          const docFileId = doc.metadata?.fileId;
          const isMatchingFile =
            docFileId && docFileId.toString() === args.fileId.toString();
          const isAboveThreshold = score >= threshold;

          console.log(
            "Document check - FileId:",
            docFileId,
            "Score:",
            score,
            "Matches:",
            isMatchingFile,
            "Above threshold:",
            isAboveThreshold
          );

          return isMatchingFile && isAboveThreshold;
        })
        .slice(0, searchLimit)
        .map(([doc, score]) => ({
          ...doc,
          score,
          relevanceScore: score,
        }));

      console.log("Filtered results count:", filteredResults.length);

      return {
        success: true,
        results: filteredResults,
        totalFound: filteredResults.length,
        query: args.query,
        fileId: args.fileId,
      };
    } catch (error) {
      console.error("Error in LangChain search:", error);
      return {
        success: false,
        results: [],
        totalFound: 0,
        error: error.message,
      };
    }
  },
});

// New hybrid function: LangChain retrieval + Gemini formatting
export const queryWithLangChainAndGemini = action({
  args: {
    question: v.string(),
    fileId: v.string(),
    limit: v.optional(v.number()),
    includeContext: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    try {
      // Step 1: Use LangChain for document retrieval
      const searchResponse = await ctx.runAction(
        "myActions:searchWithLangChain",
        {
          query: args.question,
          fileId: args.fileId,
          limit: args.limit || 8, // Increased from 5 to 8 for more comprehensive answers
        }
      );

      if (!searchResponse.success || searchResponse.results.length === 0) {
        // Fallback to the basic search if enhanced search fails
        console.log("Enhanced search failed, trying basic search...");

        try {
          const fallbackResult = await ctx.runAction("myActions:search", {
            query: args.question,
            fileId: args.fileId,
          });

          const fallbackDocs = JSON.parse(fallbackResult);
          if (fallbackDocs && fallbackDocs.length > 0) {
            // Sort by relevance and join with proper spacing
            const contextText = fallbackDocs
              .map((doc) => doc.pageContent.trim())
              .join("\n\n");

            // Create optimized prompt for Gemini
            const systemPrompt = `You are a document text extractor. Extract and present comprehensive, detailed information from the document to answer the question.

CRITICAL RULES:
- NEVER mention "chunk", "context", "provided text", "based on", or any reference to source material
- Extract ALL relevant information, including complete numbered lists, bullet points, and sequential information
- When extracting lists (numbered or bulleted), include ALL items in the complete sequence
- Present information as if it's directly from the source document
- Provide comprehensive, detailed responses that include all relevant details
- Use the exact wording from the document without any modifications
- Include dates, numbers, names, addresses, and any supporting details found
- Pay special attention to numbered lists, requests, requirements, or sequential information
- If there are multiple relevant pieces, merge them naturally into a comprehensive, flowing response
- Preserve the original structure of lists, numbered items, and formatted content
- Provide thorough explanations with all available details from the document
- Format clearly with HTML using headings, lists, and emphasis for better readability
- Answer as if you are reading the complete relevant sections from the document

DOCUMENT TEXT:
${contextText}

QUESTION: ${args.question}

Extract a comprehensive, detailed answer with all relevant information, especially complete lists and numbered items:`;

            // Get formatted answer from Gemini
            const chatSession = geminiModel.startChat({
              generationConfig,
              history: [],
            });

            const result = await chatSession.sendMessage(systemPrompt);
            const formattedAnswer = result.response.text();

            // Clean up the response
            const cleanAnswer = formattedAnswer
              .replace(/```html/g, "")
              .replace(/```/g, "")
              .trim();

            return {
              success: true,
              answer: cleanAnswer,
              question: args.question,
              sourceChunks: fallbackDocs.length,
              metadata: {
                chunksUsed: fallbackDocs.length,
                fileId: args.fileId,
                method: "fallback_search",
              },
            };
          }
        } catch (fallbackError) {
          console.error("Fallback search also failed:", fallbackError);
        }

        return {
          success: false,
          message: "No relevant content found for your question.",
          answer:
            "I couldn't find relevant information in the document to answer your question.",
        };
      }

      // Step 2: Prepare unstructured context from LangChain results
      const retrievedChunks = searchResponse.results;

      // Sort chunks by relevance score to get the best content first
      const sortedChunks = retrievedChunks.sort(
        (a, b) => (b.score || 0) - (a.score || 0)
      );

      // Join with some spacing to maintain document structure
      const contextText = sortedChunks
        .map((chunk) => chunk.pageContent.trim())
        .join("\n\n");

      // Step 3: Create optimized prompt for Gemini
      const systemPrompt = `You are a document text extractor. Extract and present comprehensive, detailed information from the document to answer the question.

CRITICAL RULES:
- NEVER mention "chunk", "context", "provided text", "based on", or any reference to source material
- Extract ALL relevant information, including complete numbered lists, bullet points, and sequential information
- When extracting lists (numbered or bulleted), include ALL items in the complete sequence
- Present information as if it's directly from the source document
- Provide comprehensive, detailed responses that include all relevant details
- Use the exact wording from the document without any modifications
- Include dates, numbers, names, addresses, and any supporting details found
- Pay special attention to numbered lists, requests, requirements, or sequential information
- If there are multiple relevant pieces, merge them naturally into a comprehensive, flowing response
- Preserve the original structure of lists, numbered items, and formatted content
- Provide thorough explanations with all available details from the document
- Format clearly with HTML using headings, lists, and emphasis for better readability
- Answer as if you are reading the complete relevant sections from the document

DOCUMENT TEXT:
${contextText}

QUESTION: ${args.question}

Extract a comprehensive, detailed answer with all relevant information, especially complete lists and numbered items:`;

      // Step 4: Get formatted answer from Gemini
      const chatSession = geminiModel.startChat({
        generationConfig,
        history: [],
      });

      const result = await chatSession.sendMessage(systemPrompt);
      const formattedAnswer = result.response.text();

      // Step 5: Clean up the response
      const cleanAnswer = formattedAnswer
        .replace(/```html/g, "")
        .replace(/```/g, "")
        .trim();

      return {
        success: true,
        answer: cleanAnswer,
        question: args.question,
        sourceChunks: args.includeContext
          ? retrievedChunks
          : retrievedChunks.length,
        relevanceScores: retrievedChunks.map((chunk) => chunk.score),
        metadata: {
          chunksUsed: retrievedChunks.length,
          averageRelevance:
            retrievedChunks.reduce((sum, chunk) => sum + chunk.score, 0) /
            retrievedChunks.length,
          fileId: args.fileId,
        },
      };
    } catch (error) {
      console.error("Error in hybrid LangChain + Gemini query:", error);
      return {
        success: false,
        message: `Query failed: ${error.message}`,
        answer:
          "I encountered an error while processing your question. Please try again.",
      };
    }
  },
});

// Test function to validate the LangChain + Gemini integration
export const testLangChainGeminiIntegration = action({
  args: {
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // Test 1: Check if vector store is working
      const vectorStore = initializeLangChainVectorStore(ctx);
      console.log("✅ Vector store initialized successfully");

      // Test 2: Test search functionality
      const testQuery = "test query";
      const searchResults = await vectorStore.similaritySearch(testQuery, 1);
      console.log(
        "✅ Search functionality working, found:",
        searchResults.length,
        "results"
      );

      // Test 3: Test Gemini API
      const testPrompt = "Say 'Hello, I am working!' in HTML format.";
      const chatSession = geminiModel.startChat({
        generationConfig,
        history: [],
      });
      const geminiResult = await chatSession.sendMessage(testPrompt);
      console.log(
        "✅ Gemini API working, response:",
        geminiResult.response.text()
      );

      return {
        success: true,
        message: "All systems are working correctly!",
        tests: {
          vectorStore: "✅ Working",
          search: `✅ Working (${searchResults.length} results)`,
          gemini: "✅ Working",
        },
      };
    } catch (error) {
      console.error("❌ Integration test failed:", error);
      return {
        success: false,
        message: `Integration test failed: ${error.message}`,
        error: error.toString(),
      };
    }
  },
});

// Helper function to migrate existing documents to enhanced LangChain format
export const migrateToLangChain = action({
  args: {
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      console.log(`Starting migration for file: ${args.fileId}`);

      // Check if documents already exist for this file
      const existingDocs = await ctx.vectorSearch("documents", "embedding", {
        vector: new Array(768).fill(0), // Dummy vector for counting
        limit: 1,
        filter: (q) => q.eq("fileId", args.fileId),
      });

      if (existingDocs.length === 0) {
        return {
          success: false,
          message: `No existing documents found for file ${args.fileId}. Use ingestWithLangChain for new documents.`,
        };
      }

      // Get all documents for this file
      const allDocs = await ctx.vectorSearch("documents", "embedding", {
        vector: new Array(768).fill(0),
        limit: 1000, // Get all chunks
        filter: (q) => q.eq("fileId", args.fileId),
      });

      console.log(`Found ${allDocs.length} existing documents to migrate`);

      // Extract text content from existing documents
      const textChunks = allDocs.map((doc) => doc.text || doc.content || "");

      // Use enhanced ingestion
      const migrationResult = await ctx.runAction(
        "myActions:ingestWithLangChain",
        {
          splitText: textChunks,
          fileId: args.fileId,
          metadata: {
            migrated: true,
            originalChunkCount: allDocs.length,
            migrationDate: new Date().toISOString(),
          },
        }
      );

      return {
        success: true,
        message: `Migration completed for file ${args.fileId}`,
        originalDocuments: allDocs.length,
        migrationResult,
      };
    } catch (error) {
      console.error("Migration error:", error);
      return {
        success: false,
        message: `Migration failed: ${error.message}`,
        error: error.toString(),
      };
    }
  },
});

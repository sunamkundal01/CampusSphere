import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";

export * from "@langchain/community/utils/convex";

/**
 * Initialize LangChain ConvexVectorStore with Google Generative AI Embeddings
 * @param ctx - Convex context
 * @returns ConvexVectorStore instance
 */
export function initializeLangChainVectorStore(ctx: any) {
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY || 'AIzaSyAnnFpHYGUSb4GmGe6LtutpA_OTeOtQwIw',
    model: "text-embedding-004", // 768 dimensions
    taskType: TaskType.RETRIEVAL_DOCUMENT,
    title: "Document retrieval",
  });

  return new ConvexVectorStore(embeddings, { ctx });
}

/**
 * Configuration for LangChain vector operations
 */
export const LANGCHAIN_CONFIG = {
  EMBEDDING_MODEL: "text-embedding-004",
  VECTOR_DIMENSIONS: 768,
  SIMILARITY_SEARCH_LIMIT: 8,
  RETRIEVAL_SCORE_THRESHOLD: 0.1, // Lowered from 0.2 to capture more content including numbered lists
};
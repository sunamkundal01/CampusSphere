import { mutation, query } from "./_generated/server.js";
import { v } from "convex/values";

// Insert a text chunk with fileId and chunkIndex
export const insertChunk = mutation({
  args: {
    text: v.string(),
    fileId: v.string(),
    chunkIndex: v.number(),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const documentId = await ctx.db.insert("documents", {
      text: args.text,
      fileId: args.fileId,
      chunkIndex: args.chunkIndex,
      metadata: args.metadata || {},
    });
    return documentId;
  },
});

// Retrieve all chunks for a specific fileId
export const getChunksByFileId = query({
  args: {
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    const chunks = await ctx.db
      .query("documents")
      .withIndex("by_fileId", (q) => q.eq("fileId", args.fileId))
      .order("asc")
      .collect();
    return chunks;
  },
});

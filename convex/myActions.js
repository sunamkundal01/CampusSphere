import { action, internalMutation, internalQuery } from "./_generated/server.js";
import { internal } from "./_generated/api.js";
import { v } from "convex/values";
import { rankPdfChunks } from "../lib/pdfRetrieval.js";

export const storeChunks = internalMutation({
  args: { sliptText: v.array(v.string()), fileId: v.string() },
  handler: async (ctx, { sliptText, fileId }) => {
    const previous = await ctx.db.query("documents")
      .withIndex("by_fileId", (q) => q.eq("fileId", fileId)).collect();
    for (const doc of previous) await ctx.db.delete(doc._id);
    for (const text of sliptText) {
      if (text.trim()) {
        await ctx.db.insert("documents", { text, fileId, metadata: { fileId } });
      }
    }
  },
});

export const getChunks = internalQuery({
  args: { fileId: v.string() },
  handler: async (ctx, { fileId }) => {
    const chunks = await ctx.db.query("documents")
      .withIndex("by_fileId", (q) => q.eq("fileId", fileId)).collect();
    if (chunks.length) return chunks.map(({ text, metadata }) => ({ text, metadata }));
    // PDFs uploaded before migration only have metadata.fileId.
    const legacy = await ctx.db.query("documents")
      .filter((q) => q.eq(q.field("metadata.fileId"), fileId)).collect();
    return legacy.map(({ text, metadata }) => ({ text, metadata }));
  },
});

// Preserve the action contract used by both upload components.
export const ingest = action({
  args: { sliptText: v.array(v.string()), fileId: v.string() },
  handler: async (ctx, args) => {
    await ctx.runMutation(internal.myActions.storeChunks, args);
    return "Completed";
  },
});

export const search = action({
  args: { query: v.string(), fileId: v.string() },
  handler: async (ctx, { query, fileId }) => {
    const chunks = await ctx.runQuery(internal.myActions.getChunks, { fileId });
    return JSON.stringify(rankPdfChunks(chunks, query));
  },
});

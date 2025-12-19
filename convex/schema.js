import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    imageURL: v.string(),
    userName: v.string(),
    name: v.optional(v.string()),
    department: v.optional(v.string()),
    batch: v.optional(v.string()),
    linkedinProfile: v.optional(v.string()),
    expertise: v.optional(v.array(v.string())),
    bio: v.optional(v.string()),
    isProfileComplete: v.optional(v.boolean()),
    joinedAt: v.optional(v.number()),
  }),

  pdfFiles: defineTable({
    fileId: v.string(),
    storageId: v.string(),
    fileName: v.string(),
    fileUrl: v.string(),
    createdBy: v.string(),
    semester: v.optional(v.string()),
    subject: v.optional(v.string()),
  }),

  documents: defineTable({
    text: v.string(),
    metadata: v.any(),
    fileId: v.string(),
    chunkIndex: v.number(),
  }).index("by_fileId", ["fileId"]),

  notes: defineTable({
    fileId: v.string(),
    notes: v.any(),
    createdBy: v.string(),
  }),

  pyqFiles: defineTable({
    fileId: v.string(),
    storageId: v.string(),
    fileName: v.string(),
    fileUrl: v.string(),
    semester: v.string(),
    subject: v.string(),
    uploadedBy: v.string(),
    uploadedAt: v.number(),
  }),
});

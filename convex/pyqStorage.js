import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Add PYQ file entry to database
export const AddPyqFileEntryToDb = mutation({
  args: {
    fileId: v.string(),
    storageId: v.string(),
    fileName: v.string(),
    fileUrl: v.string(),
    semester: v.string(),
    subject: v.string(),
    uploadedBy: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.insert("pyqFiles", {
      fileId: args.fileId,
      storageId: args.storageId,
      fileName: args.fileName,
      fileUrl: args.fileUrl,
      semester: args.semester,
      subject: args.subject,
      uploadedBy: args.uploadedBy,
      uploadedAt: Date.now(),
    });
    return result;
  },
});

// Get all PYQ files
export const GetAllPyqFiles = query({
  handler: async (ctx) => {
    const result = await ctx.db.query("pyqFiles").order("desc").collect();
    return result;
  },
});

// Get PYQ files by semester and subject
export const GetPyqFilesByFilter = query({
  args: {
    semester: v.optional(v.string()),
    subject: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("pyqFiles");

    if (args.semester) {
      query = query.filter((q) => q.eq(q.field("semester"), args.semester));
    }

    if (args.subject) {
      query = query.filter((q) => q.eq(q.field("subject"), args.subject));
    }

    const result = await query.order("desc").collect();
    return result;
  },
});

// Get unique semesters
export const GetUniqueSemesters = query({
  handler: async (ctx) => {
    const files = await ctx.db.query("pyqFiles").collect();
    const semesters = [...new Set(files.map((file) => file.semester))];
    return semesters.sort();
  },
});

// Get unique subjects by semester
export const GetUniqueSubjects = query({
  args: {
    semester: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("pyqFiles");

    if (args.semester) {
      query = query.filter((q) => q.eq(q.field("semester"), args.semester));
    }

    const files = await query.collect();
    const subjects = [...new Set(files.map((file) => file.subject))];
    return subjects.sort();
  },
});

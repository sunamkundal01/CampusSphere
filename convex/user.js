import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createuser = mutation({
  args: {
    email: v.string(),
    userName: v.string(),
    imageURL: v.string(),
  },
  handler: async (ctx, args) => {
    //if user exists
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();

    //user not insert
    if (user?.length == 0) {
      await ctx.db.insert("users", {
        email: args.email,
        userName: args.userName,
        imageURL: args.imageURL,
        name: undefined,
        department: undefined,
        batch: undefined,
        linkedinProfile: undefined,
        expertise: undefined,
        bio: undefined,
        isProfileComplete: false,
        joinedAt: Date.now(),
      });

      return "inserted new user";
    }

    return "user already exist";
  },
});

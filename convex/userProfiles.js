import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Update user profile
export const updateUserProfile = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    department: v.optional(v.string()),
    batch: v.optional(v.string()),
    linkedinProfile: v.optional(v.string()),
    expertise: v.optional(v.array(v.string())),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (existingUser) {
      const result = await ctx.db.patch(existingUser._id, {
        name: args.name,
        department: args.department,
        batch: args.batch,
        linkedinProfile: args.linkedinProfile,
        expertise: args.expertise,
        bio: args.bio,
        isProfileComplete: !!(args.name && args.department && args.batch),
      });
      return result;
    } else {
      throw new Error("User not found");
    }
  },
});

// Get user profile by email
export const getUserProfile = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();
    return user;
  },
});

// Get all users for community page
export const getAllUsers = query({
  handler: async (ctx) => {
    const users = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("isProfileComplete"), true))
      .collect();
    return users;
  },
});

// Search users by expertise
export const searchUsersByExpertise = query({
  args: {
    expertise: v.string(),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("isProfileComplete"), true))
      .collect();

    const matchingUsers = users.filter(
      (user) =>
        user.expertise &&
        user.expertise.some((skill) =>
          skill.toLowerCase().includes(args.expertise.toLowerCase())
        )
    );

    return matchingUsers;
  },
});

// Get users by department
export const getUsersByDepartment = query({
  args: {
    department: v.string(),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("department"), args.department))
      .filter((q) => q.eq(q.field("isProfileComplete"), true))
      .collect();
    return users;
  },
});

// Get users by batch
export const getUsersByBatch = query({
  args: {
    batch: v.string(),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("batch"), args.batch))
      .filter((q) => q.eq(q.field("isProfileComplete"), true))
      .collect();
    return users;
  },
});

// Get recommended users based on similar expertise
export const getRecommendedUsers = query({
  args: {
    userEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.userEmail))
      .first();

    if (!currentUser || !currentUser.expertise) {
      return [];
    }

    const allUsers = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("isProfileComplete"), true))
      .filter((q) => q.neq(q.field("email"), args.userEmail))
      .collect();

    const recommendations = allUsers.filter((user) => {
      if (!user.expertise) return false;

      const commonSkills = user.expertise.filter((skill) =>
        currentUser.expertise.some(
          (currentSkill) => currentSkill.toLowerCase() === skill.toLowerCase()
        )
      );

      return commonSkills.length > 0;
    });

    // Sort by number of common skills
    recommendations.sort((a, b) => {
      const aCommon = a.expertise.filter((skill) =>
        currentUser.expertise.some(
          (currentSkill) => currentSkill.toLowerCase() === skill.toLowerCase()
        )
      ).length;

      const bCommon = b.expertise.filter((skill) =>
        currentUser.expertise.some(
          (currentSkill) => currentSkill.toLowerCase() === skill.toLowerCase()
        )
      ).length;

      return bCommon - aCommon;
    });

    return recommendations;
  },
});

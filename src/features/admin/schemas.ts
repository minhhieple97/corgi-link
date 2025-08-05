import { z } from "zod";

export const manageFlaggedUrlSchema = z.object({
  urlId: z.number().positive("URL ID must be a positive number"),
  action: z.enum(["approve", "delete"], {
    required_error: "Action is required",
    invalid_type_error: 'Action must be either "approve" or "delete"',
  }),
});

export const UpdateUserRoleSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  role: z.enum(["admin", "user"] as const),
});

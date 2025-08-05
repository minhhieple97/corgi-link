"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { ActionError, adminAction } from "@/lib/safe-action";
import { routes } from "@/routes";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { UpdateUserRoleSchema } from "../schemas";

export const updateUserRole = adminAction
  .schema(UpdateUserRoleSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { userId, role } = parsedInput;

    if (ctx.user.id === userId) {
      throw new ActionError("You cannot change your own role");
    }

    const userToUpdate = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId),
    });

    if (!userToUpdate) {
      throw new ActionError("User not found");
    }

    await db
      .update(users)
      .set({
        role,
      })
      .where(eq(users.id, userId));

    revalidatePath(routes.admin.users);

    return {
      success: true,
      userId,
      role,
    };
  });

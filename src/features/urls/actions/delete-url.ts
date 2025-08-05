"use server";

import { db, eq } from "@/db";
import { urls } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { ActionError, authAction } from "@/lib/safe-action";
import { DeleteUrlSchema } from "../schemas";
import { routes } from "@/routes";

export const deleteUrl = authAction
  .schema(DeleteUrlSchema)
  .action(async ({ parsedInput: { id }, ctx }) => {
    const { user } = ctx;

    const existingUrl = await db.query.urls.findFirst({
      where: (urls, { eq, and }) =>
        and(eq(urls.id, id), eq(urls.userId, user.id)),
    });

    if (!existingUrl) {
      throw new ActionError(
        "URL not found or you don't have permission to delete it"
      );
    }

    await db.delete(urls).where(eq(urls.id, id));

    revalidatePath(routes.dashboard.root);

    return {
      success: true,
      id,
    };
  });

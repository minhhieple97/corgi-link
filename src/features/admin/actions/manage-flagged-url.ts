"use server";

import { db } from "@/db";
import { urls } from "@/db/schema";
import { eq } from "drizzle-orm";
import { routes } from "@/routes";
import { revalidatePath } from "next/cache";
import { adminAction } from "@/lib/safe-action"; // Adjust import path as needed
import { manageFlaggedUrlSchema } from "../schemas";
import type { ManageFlaggedUrlResult } from "../types";

export const manageFlaggedUrl = adminAction
  .schema(manageFlaggedUrlSchema)
  .action(
    async ({
      parsedInput: { urlId, action },
    }): Promise<ManageFlaggedUrlResult> => {
      try {
        const urlToManage = await db.query.urls.findFirst({
          where: (urls, { eq }) => eq(urls.id, urlId),
        });

        if (!urlToManage) {
          return {
            success: false,
            error: "URL not found",
          };
        }

        if (action === "approve") {
          await db
            .update(urls)
            .set({
              flagged: false,
              flagReason: null,
            })
            .where(eq(urls.id, urlId));

          revalidatePath(routes.admin.urls);
          revalidatePath(routes.admin.flagged);

          return {
            success: true,
            message: "URL approved successfully",
          };
        } else if (action === "delete") {
          await db.delete(urls).where(eq(urls.id, urlId));

          revalidatePath(routes.admin.urls);
          revalidatePath(routes.admin.flagged);

          return {
            success: true,
            message: "URL deleted successfully",
          };
        }

        return {
          success: false,
          error: "Invalid action",
        };
      } catch (error) {
        console.error("Error managing flagged URL:", error);
        return {
          success: false,
          error: "Failed to manage flagged URL",
        };
      }
    }
  );

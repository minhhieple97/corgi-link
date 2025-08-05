"use server";

import { db } from "@/db";
import { urls } from "@/db/schema";
import { count, sql } from "drizzle-orm";

export const getPublicStats = async () => {
  const [urlCount] = await db.select({ value: count() }).from(urls);
  const totalUrls = urlCount?.value || 0;

  const [clicksResult] = await db
    .select({ total: sql<number>`sum(${urls.clicks})` })
    .from(urls);
  const totalClicks = clicksResult?.total || 0;

  return {
    totalUrls,
    totalClicks,
  };
};

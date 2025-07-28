'use server';

import { db } from '@/db';
import { urls } from '@/db/schema';
import { eq } from 'drizzle-orm';

type GetUserUrlsForStatsParams = {
  userId: string;
};

export const getUserUrlsForStats = async ({ userId }: GetUserUrlsForStatsParams) => {
  const userUrls = await db
    .select({
      id: urls.id,
      originalUrl: urls.originalUrl,
      shortCode: urls.shortCode,
      clicks: urls.clicks,
      createdAt: urls.createdAt,
      expiresAt: urls.expiresAt,
    })
    .from(urls)
    .where(eq(urls.userId, userId))
    .orderBy(urls.createdAt);

  return userUrls;
};

'use server';

import { db } from '@/db';
import { urls } from '@/db/schema';
import { eq, count } from 'drizzle-orm';
import { PAGINATION } from '@/constants';

type GetUserUrlsParams = {
  userId: string;
  page?: number;
  limit?: number;
};

export const getUserUrls = async ({
  userId,
  page = PAGINATION.DEFAULT_PAGE,
  limit = PAGINATION.DEFAULT_LIMIT,
}: GetUserUrlsParams) => {
  const offset = (page - PAGINATION.MIN_PAGE) * limit;


  const [totalResult] = await db
    .select({ count: count() })
    .from(urls)
    .where(eq(urls.userId, userId));

  const total = totalResult.count;

  const userUrls = await db.query.urls.findMany({
    where: (urls, { eq }) => eq(urls.userId, userId),
    orderBy: (urls, { desc }) => [desc(urls.createdAt)],
    limit,
    offset,
  });

  const urlsData = userUrls.map((url) => ({
    id: url.id,
    originalUrl: url.originalUrl,
    shortCode: url.shortCode,
    createdAt: url.createdAt,
    clicks: url.clicks,
    expiresAt: url.expiresAt,
  }));

  const totalPages = Math.ceil(total / limit);

  return {
    urls: urlsData,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > PAGINATION.MIN_PAGE,
    },
  };
};

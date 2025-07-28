'use server';

import { db, eq } from '@/db';
import { urls } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { ActionError, authAction } from '@/lib/safe-action';
import { UpdateUrlSchema } from '../schemas';
import { env } from '@/env';
import { routes } from '@/routes';
import { redis } from '@/lib/redis';

export const updateUrl = authAction
  .schema(UpdateUrlSchema)
  .action(async ({ parsedInput: { id, customCode, expiresAt }, ctx }) => {
    const { user } = ctx;

    const existingUrl = await db.query.urls.findFirst({
      where: (urls, { eq, and }) => and(eq(urls.id, id), eq(urls.userId, user.id)),
    });

    if (!existingUrl) {
      throw new ActionError("URL not found or you don't have permission to update it");
    }

    const codeExists = await db.query.urls.findFirst({
      where: (urls, { eq, and, ne }) => and(eq(urls.shortCode, customCode), ne(urls.id, id)),
    });

    if (codeExists) {
      throw new ActionError('Custom code already exists');
    }

    const [updatedUrl] = await db
      .update(urls)
      .set({
        shortCode: customCode,
        expiresAt: expiresAt || null,
        updatedAt: new Date(),
      })
      .where(eq(urls.id, id))
      .returning();

    // Update Redis cache if it exists
    const cacheKey = `url:${existingUrl.shortCode}`;
    const cachedData = await redis.hgetall(cacheKey);

    if (cachedData && Object.keys(cachedData).length > 0) {
      // If short code changed, we need to update the cache key
      if (existingUrl.shortCode !== customCode) {
        // Delete old cache entry
        await redis.del(cacheKey);
        // Create new cache entry with updated shortCode
        await redis.hset(`url:${customCode}`, {
          ...cachedData,
          expiresAt: expiresAt ? expiresAt.toISOString() : 'null',
        });
      } else {
        // Just update expiration in existing cache
        await redis.hset(cacheKey, {
          expiresAt: expiresAt ? expiresAt.toISOString() : 'null',
        });
      }
    }

    const baseUrl = env.NEXT_PUBLIC_APP_URL;
    const shortUrl = `${baseUrl}/r/${customCode}`;

    revalidatePath(routes.dashboard.root);

    return {
      success: true,
      shortUrl,
      customCode,
      expiresAt: updatedUrl.expiresAt,
      message: 'URL updated successfully',
    };
  });

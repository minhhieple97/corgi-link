'use server';
import {
  checkUrlSafety,
  cleanupShortCode,
  ensureHttps,
  generateShortCode,
  processSafetyCheck,
} from '../services';
import { db } from '@/db';
import { urls } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { ActionError, authAction } from '@/lib/safe-action';
import { UrlFormSchema } from '../schemas';
import { isAdmin } from '@/lib/utils';
import { env } from '@/env';
import { CACHE_TTL } from '@/constants';
import { routes } from '@/routes';
import { redis } from '@/lib/redis';
import { RateLimiter } from '@/lib/rate-limiter';

export const shortenUrl = authAction
  .schema(UrlFormSchema)
  .action(async ({ parsedInput: { url, customCode, expiresAt }, ctx }) => {
    const { user } = ctx;

    const rateLimitResult = await RateLimiter.checkRateLimit(user.id);

    if (!rateLimitResult.allowed) {
      throw new ActionError(
        `Rate limit exceeded. Try again in a minute. Remaining: ${rateLimitResult.remaining}`,
      );
    }

    const originalUrl = ensureHttps(url);
    const userIsAdmin = isAdmin(user);
    const shortCode = await generateShortCode(customCode);
    const safetyCheck = await checkUrlSafety(originalUrl);

    const { flagged, flagReason, shouldBlock } = processSafetyCheck(safetyCheck, userIsAdmin);

    if (shouldBlock) {
      await cleanupShortCode(shortCode);
      throw new ActionError('This URL is flagged as malicious');
    }

    try {
      await db.transaction(async (tx) => {
        const [result] = await tx
          .insert(urls)
          .values({
            originalUrl,
            shortCode,
            userId: user.id,
            flagged,
            flagReason,
            expiresAt,
          })
          .returning()
          .catch(async (error) => {
            if (error.code === '23505') {
              throw new ActionError('Short code collision detected');
            }
            throw error;
          });

        return result;
      });

      const baseUrl = env.NEXT_PUBLIC_APP_URL;
      const shortUrl = `${baseUrl}/r/${shortCode}`;

      const cacheData = {
        originalUrl,
        flagged: flagged.toString(),
        flagReason: flagReason || 'null',
        userId: user.id,
        clicks: '0',
        expiresAt: expiresAt ? expiresAt.toISOString() : 'null',
      };

      await redis.hset(`url:${shortCode}`, cacheData);
      await redis.expire(`url:${shortCode}`, CACHE_TTL.URL_MAPPING);

      revalidatePath(routes.dashboard.root);

      return {
        shortUrl,
        flagged,
        flagReason,
      };
    } catch (error) {
      await cleanupShortCode(shortCode);
      throw error;
    }
  });


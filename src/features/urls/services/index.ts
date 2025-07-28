import { env } from '@/env';
import { SHORT_CODE, URL_SAFETY } from '@/constants';
import { redis } from '@/lib/redis';
import { ShortCodeGenerator } from '@/lib/short-code-generator';
import { ActionError } from '@/lib/safe-action';
import { queueClient } from '@/lib/qstash';
import { db } from '@/db';
import { urls } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { QSTASH_QUEUE, RESPONSE_MESSAGES, CONTENT_TYPES } from '@/constants';
import { isExpired } from '@/lib/date-utils';
import { UrlValidator } from '@/lib/url-validator';
import { WebCrawler, type CrawledContent } from '@/lib/crawler';
import { LLMService, type UrlSafetyCheck, type AliasGenerationOptions } from '@/lib/llm-service';

export const isValidUrl = UrlValidator.isValid;
export const ensureHttps = UrlValidator.ensureHttps;

export const checkUrlSafety = async (url: string) => {
  try {
    const data = await LLMService.checkUrlSafety(url);
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Error checking URL safety:', error);
    return {
      success: false,
      error: 'Failed to analyze URL safety',
    };
  }
};

export const crawlWebContent = WebCrawler.crawl;

export const generateAliasesWithLLM = async (
  content: CrawledContent,
  options: AliasGenerationOptions = {},
) => {
  const result = await LLMService.generateAliases(content, options);
  return result;
};


export const generateShortCode = async (customCode?: string): Promise<string> => {
  if (customCode) {
    const isAvailable = await ShortCodeGenerator.isCodeAvailable(customCode);
    if (!isAvailable) {
      throw new ActionError('Custom code already exists');
    }

    const reserved = await ShortCodeGenerator.reserveCode(customCode);
    if (!reserved) {
      throw new ActionError('Custom code was taken by another user');
    }

    return customCode;
  }

  return ShortCodeGenerator.generateUniqueCode();
};


export const processSafetyCheck = (
  safetyCheck: Awaited<ReturnType<typeof checkUrlSafety>>,
  userIsAdmin: boolean,
): { flagged: boolean; flagReason: string | null; shouldBlock: boolean } => {
  if (!safetyCheck.success || !safetyCheck.data) {
    return { flagged: false, flagReason: null, shouldBlock: false };
  }

  const { flagged, reason, category, confidence } = safetyCheck.data;

  const shouldBlock =
    category === URL_SAFETY.CATEGORIES.MALICIOUS &&
    confidence > URL_SAFETY.CONFIDENCE_THRESHOLD &&
    !userIsAdmin;

  return {
    flagged,
    flagReason: reason,
    shouldBlock,
  };
};


export const cleanupShortCode = async (shortCode: string): Promise<void> => {
  await redis.srem(SHORT_CODE.REDIS_SET_KEY, shortCode);
};


export const queueClickIncrement = async (shortCode: string) => {
  try {
    const baseUrl = env.NEXT_PUBLIC_APP_URL;
    await queueClient.enqueueJSON({
      url: `${baseUrl}${QSTASH_QUEUE.ENDPOINTS.CLICK_INCREMENT}`,
      body: {
        action: QSTASH_QUEUE.ACTIONS.INCREMENT_CLICK,
        shortCode,
        timestamp: Date.now(),
      },
      headers: {
        'Content-Type': CONTENT_TYPES.JSON,
      },
    });
  } catch (error) {
    console.error(RESPONSE_MESSAGES.ERRORS.QUEUE_FAILED, error);
    await incrementClicksDirectly(shortCode);
  }
};


const incrementClicksDirectly = async (shortCode: string) => {
  try {
    await db.transaction(async (tx) => {
      const url = await tx.query.urls.findFirst({
        where: eq(urls.shortCode, shortCode),
      });

      if (url) {
        // Check if the URL has expired
        if (isExpired(url.expiresAt)) {
          console.warn(`URL expired during direct update: ${shortCode}`);
          return;
        }

        const newClicks = url.clicks + 1;
        await tx
          .update(urls)
          .set({
            clicks: newClicks,
          })
          .where(eq(urls.shortCode, shortCode));

        await redis.hincrby(`url:${shortCode}`, 'clicks', 1);
      }
    });
  } catch (error) {
    console.error(RESPONSE_MESSAGES.ERRORS.DIRECT_UPDATE_FAILED, error);
  }
};

export type { CrawledContent, UrlSafetyCheck, AliasGenerationOptions };

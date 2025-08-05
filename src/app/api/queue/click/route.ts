import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { urls } from "@/db/schema";
import { redis } from "@/lib/redis";
import {
  QSTASH_QUEUE,
  HTTP_STATUS,
  RESPONSE_MESSAGES,
  CONTENT_TYPES,
} from "@/constants";
import { isExpired } from "@/lib/date-utils";

type QueuePayload = {
  action: typeof QSTASH_QUEUE.ACTIONS.INCREMENT_CLICK;
  shortCode: string;
  timestamp: number;
};

const createResponse = (data: object, status: number) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": CONTENT_TYPES.JSON },
  });
};

const createErrorResponse = (
  message: string,
  status: number = HTTP_STATUS.BAD_REQUEST
) => {
  return new Response(message, { status });
};

async function handler(request: Request) {
  try {
    const body = (await request.json()) as QueuePayload;
    const { action, shortCode } = body;

    if (action !== QSTASH_QUEUE.ACTIONS.INCREMENT_CLICK) {
      return createErrorResponse(RESPONSE_MESSAGES.QUEUE.INVALID_ACTION);
    }

    if (!shortCode) {
      return createErrorResponse(RESPONSE_MESSAGES.QUEUE.MISSING_SHORT_CODE);
    }

    await db.transaction(async tx => {
      const url = await tx.query.urls.findFirst({
        where: eq(urls.shortCode, shortCode),
      });

      if (!url) {
        console.warn(`${RESPONSE_MESSAGES.QUEUE.URL_NOT_FOUND} ${shortCode}`);
        return;
      }

      if (isExpired(url.expiresAt)) {
        console.warn(`URL expired: ${shortCode}`);
        return;
      }

      const newClicks = url.clicks + 1;

      await tx
        .update(urls)
        .set({
          clicks: newClicks,
        })
        .where(eq(urls.shortCode, shortCode));

      await redis.hincrby(`url:${shortCode}`, "clicks", 1);
    });

    return createResponse(
      {
        success: true,
        message: `${RESPONSE_MESSAGES.QUEUE.CLICK_UPDATE_SUCCESS} ${shortCode}`,
      },
      HTTP_STATUS.OK
    );
  } catch (error) {
    console.error("Queue processing error:", error);

    return createResponse(
      {
        success: false,
        error: RESPONSE_MESSAGES.QUEUE.PROCESSING_ERROR,
      },
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
}

export const POST = verifySignatureAppRouter(handler);

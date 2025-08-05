import { customAlphabet } from "nanoid";
import { redis } from "./redis";
import { SHORT_CODE, CACHE_TTL } from "@/constants";

const generateId = customAlphabet(SHORT_CODE.ALPHABET, SHORT_CODE.LENGTH);

export class ShortCodeGenerator {
  static async generateUniqueCode(): Promise<string> {
    for (let attempt = 0; attempt < SHORT_CODE.MAX_RETRIES; attempt++) {
      const shortCode = generateId();

      const isUnique = await redis.sadd(SHORT_CODE.REDIS_SET_KEY, shortCode);

      if (isUnique) {
        await redis.expire(
          `shortcode:${shortCode}`,
          CACHE_TTL.URL_REDIS_EXPIRY
        );
        return shortCode;
      }
    }

    throw new Error(
      "Failed to generate unique short code after maximum retries"
    );
  }

  static async isCodeAvailable(customCode: string): Promise<boolean> {
    const exists = await redis.sismember(SHORT_CODE.REDIS_SET_KEY, customCode);
    return exists === 0;
  }

  static async reserveCode(shortCode: string): Promise<boolean> {
    const reserved = await redis.sadd(SHORT_CODE.REDIS_SET_KEY, shortCode);
    return reserved === 1;
  }
}

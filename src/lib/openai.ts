import OpenAI from "openai";
import { env } from "@/env";
import { OPENAI_CONFIG } from "@/constants";

export const openaiClient = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
  baseURL: OPENAI_CONFIG.BASE_URL,
});

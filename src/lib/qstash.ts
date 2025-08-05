import { QSTASH_QUEUE } from "@/constants";
import { env } from "@/env";
import { Client } from "@upstash/qstash";

export const qstashClient = new Client({
  token: env.QSTASH_TOKEN,
});

export const queueClient = qstashClient.queue({
  queueName: QSTASH_QUEUE.NAME,
});

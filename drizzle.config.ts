import { Config, defineConfig } from "drizzle-kit";
import "dotenv/config";
import { env } from "@/env";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
}) satisfies Config;

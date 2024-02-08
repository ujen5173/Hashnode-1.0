import type { Config } from "drizzle-kit";
import { env } from "~/env.mjs";

export default {
  schema: "./src/server/db/schema/index.ts",
  driver: "pg",
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  out: "./drizzle",
} satisfies Config;

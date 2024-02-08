/* eslint-disable no-var */
import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { env } from "~/env.mjs";
import * as schema from "./schema";

declare global {
  var db: NeonHttpDatabase<typeof schema> | undefined;
}

let db: NeonHttpDatabase<typeof schema>;

if (env.NODE_ENV === "development") {
  db = drizzle(neon(env.DATABASE_URL), { schema });
} else {
  if (!global.db) {
    global.db = drizzle(neon(env.DATABASE_URL), {
      schema,
    });
  }
  db = global.db;
}

export { db };

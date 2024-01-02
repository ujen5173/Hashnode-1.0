import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "~/env.mjs";
import * as schema from "./schema";
export * from "./schema";

declare global {
  // eslint-disable-next-line no-var -- only var works here
  var db: PostgresJsDatabase<typeof schema> | undefined;
}

let db: PostgresJsDatabase<typeof schema>;

if (env.NODE_ENV === "production") {
  db = drizzle(postgres(env.DATABASE_URL), { schema });
} else {
  if (!global.db) {
    global.db = drizzle(postgres(env.DATABASE_URL), { schema });
  }
  db = global.db;
}

export { db };

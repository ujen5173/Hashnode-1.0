import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "~/env.mjs";
import * as schema from "./schema";

neonConfig.fetchConnectionCache = true;

const client = neon(env.DATABASE_URL);
const db = drizzle(client, {
  schema,
});

export default db;

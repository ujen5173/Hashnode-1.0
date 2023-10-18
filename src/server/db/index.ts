import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "~/env.mjs";

neonConfig.fetchConnectionCache = true;

const sql = neon(env.DATABASE_URL);
const db = drizzle(sql);

export { db };

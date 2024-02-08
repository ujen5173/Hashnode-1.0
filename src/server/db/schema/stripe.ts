import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  json,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const stripeSubscriptionEnum = pgEnum("stripeSubscriptionStatus", [
  "incomplete",
  "incomplete_expired",
  "trialing",
  "active",
  "past_due",
  "canceled",
  "unpaid",
  "paused",
]);

// stripe event
export const stripeEvents = pgTable(
  "stripeEvents",
  {
    id: text("id")
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    api_version: text("api_version"),
    data: json("data").notNull(),
    request: json("request"),
    type: text("type").notNull(),
    object: text("object").notNull(),
    account: text("account"),
    created: timestamp("created", { mode: "date" }).notNull().defaultNow(),
    pending_webhooks: integer("pending_webhooks").notNull(),
    livemode: boolean("livemode").notNull(),
  },
  (stripeEvents) => ({
    userIdIdx: index("stripeEventsuserId_idx").on(stripeEvents.id),
  }),
);

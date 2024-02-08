import { relations, sql } from "drizzle-orm";
import { boolean, index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

// notifications
export const notifications = pgTable(
  "notifications",
  {
    id: text("id")
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    type: text("type").default("ARTICLE").notNull(),
    isRead: boolean("is_read").default(false),

    body: text("body").default(""),
    slug: text("slug").default("").notNull(),
    title: text("title").default(""),
    articleAuthor: text("article_author").default(""),

    userId: text("user_id").notNull(),
    fromId: text("from_id").notNull(),

    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (notifications) => ({
    userIdIdx: index("notificationuserId_idx").on(notifications.id),
  }),
);

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
    relationName: "notifications",
  }),
  from: one(users, {
    fields: [notifications.fromId],
    references: [users.id],
    relationName: "notificationsFrom",
  }),
}));

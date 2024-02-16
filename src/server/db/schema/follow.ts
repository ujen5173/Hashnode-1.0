import { relations } from "drizzle-orm";
import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { users } from "./users";

export const follow = pgTable(
  "follow",
  {
    userId: text("user_id")
      .references(() => users.id)
      .notNull(),
    followingId: text("following_id")
      .references(() => users.id)
      .notNull(),
  },
  (table) => ({
    pk: primaryKey(table.userId, table.followingId),
  }),
);

export const followRelations = relations(follow, ({ one }) => ({
  user: one(users, {
    fields: [follow.userId],
    references: [users.id],
    relationName: "following",
  }),
  following: one(users, {
    fields: [follow.followingId],
    references: [users.id],
    relationName: "followers",
  }),
}));

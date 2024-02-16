import { relations } from "drizzle-orm";
import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { articles } from "./articles";
import { users } from "./users";

export const readersToArticles = pgTable(
  "readers_to_articles",
  {
    userId: text("user_id")
      .references(() => users.id)
      .notNull(),

    articleId: text("article_id")
      .notNull()
      .references(() => articles.id),
  },
  (t) => ({
    pk: primaryKey(t.userId, t.articleId),
  }),
);

export const readersToArticlesRelations = relations(
  readersToArticles,
  ({ one }) => ({
    articles: one(articles, {
      fields: [readersToArticles.articleId],
      references: [articles.id],
    }),
    readers: one(users, {
      fields: [readersToArticles.userId],
      references: [users.id],
    }),
  }),
);

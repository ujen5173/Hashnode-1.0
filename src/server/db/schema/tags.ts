import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { articles } from "./articles";
import { users } from "./users";

export const tags = pgTable(
  "tags",
  {
    id: text("id")
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    name: text("name").notNull().unique(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    followersCount: integer("followers_count").notNull().default(0),
    articlesCount: integer("articles_count").notNull().default(0),
    logo: text("logo"),
    // logoKey: text("logoKey"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (tags) => ({
    nameIdx: index("tagsname_idx").on(tags.name),
    slugIdx: index("tagsslug_idx").on(tags.slug),
  }),
);

export const tagsRelations = relations(tags, ({ many }) => ({
  followers: many(tagsToUsers),
  articles: many(tagsToArticles),
}));

export const tagsToUsers = pgTable(
  "tags_to_users",
  {
    userId: text("user_id")
      .references(() => users.id)
      .notNull(),
    tagId: text("tag_id")
      .references(() => tags.id)
      .notNull(),
  },
  (tagsToUsers) => ({
    pk: primaryKey(tagsToUsers.tagId, tagsToUsers.userId),
  }),
);

export const tagsToUsersRelations = relations(tagsToUsers, ({ one }) => ({
  user: one(users, {
    fields: [tagsToUsers.userId],
    references: [users.id],
  }),
  tag: one(tags, {
    fields: [tagsToUsers.tagId],
    references: [tags.id],
  }),
}));

export const tagsToArticles = pgTable(
  "tags_to_articles",
  {
    tagId: text("tag_id")
      .references(() => tags.id)
      .notNull(),
    articleId: text("article_id")
      .references(() => articles.id)
      .notNull(),
  },
  (tagsToArticles) => ({
    pk: primaryKey(tagsToArticles.tagId, tagsToArticles.articleId),
  }),
);

export const tagsToArticlesRelations = relations(tagsToArticles, ({ one }) => ({
  article: one(articles, {
    fields: [tagsToArticles.articleId],
    references: [articles.id],
  }),
  tag: one(tags, {
    fields: [tagsToArticles.tagId],
    references: [tags.id],
  }),
}));

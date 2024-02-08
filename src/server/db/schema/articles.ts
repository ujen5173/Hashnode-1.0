import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { comments } from "./comments";
import { likesToArticles } from "./likes";
import { readersToArticles } from "./read";
import { series } from "./series";
import { tagsToArticles } from "./tags";
import { users } from "./users";

export const articles = pgTable(
  "articles",
  {
    id: text("id")
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    userId: text("user_id").notNull(),
    title: text("title").notNull(),
    cover_image: text("cover_image"),
    cover_image_key: text("cover_image_key"),
    content: text("content").notNull(),
    subContent: text("sub_content").notNull(),
    read_time: integer("read_time").notNull(),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    seoOgImage: text("seo_og_image"),
    seoOgImageKey: text("seo_og_image_key"),
    subtitle: text("subtitle"),
    disabledComments: boolean("disabled_comments").notNull().default(true),
    likesCount: integer("likes_count").notNull().default(0),
    slug: text("slug").notNull(),
    commentsCount: integer("comments_count").notNull().default(0),
    readCount: integer("read_count").notNull().default(0),
    isDeleted: boolean("is_deleted").notNull().default(false),

    seriesId: text("series_id"),

    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (articles) => ({
    userIdIdx: index("userId_idx").on(articles.id),
    slugIdx: index("slug_idx").on(articles.slug),
  }),
);

export const newArticleSchema = createInsertSchema(articles).pick({
  title: true,
  subtitle: true,
  content: true,
  cover_image: true,
  cover_image_key: true,
  slug: true,
  seriesId: true,
  seoTitle: true,
  seoDescription: true,
  seoOgImage: true,
  disabledComments: true,
});

export const articlesRelations = relations(articles, ({ one, many }) => ({
  series: one(series, {
    fields: [articles.seriesId],
    references: [series.id],
  }),
  user: one(users, {
    fields: [articles.userId],
    references: [users.id],
  }),
  comments: many(comments),
  tags: many(tagsToArticles),
  likes: many(likesToArticles),
  readers: many(readersToArticles),
}));

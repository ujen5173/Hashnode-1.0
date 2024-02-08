import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { articles } from "./articles";
import { likesToComment } from "./likes";
import { users } from "./users";

export const commentEnum = pgEnum("commentStatus", ["COMMENT", "REPLY"]);

// comment
export const comments = pgTable(
  "comments",
  {
    id: text("id")
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    userId: text("user_id").notNull(),
    articleId: text("article_id").notNull(),
    body: text("body").notNull(),
    likesCount: integer("likes_count").notNull().default(0),
    type: commentEnum("type").notNull(),
    parentId: text("parent_id"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (comments) => ({
    userIdIdx: index("commentsuserId_idx").on(comments.id),
    articleIdIdx: index("articleId_idx").on(comments.id),
  }),
);

export type Comments = typeof comments.$inferSelect;

export const commentsRelations = relations(comments, ({ one, many }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  article: one(articles, {
    fields: [comments.articleId],
    references: [articles.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
    relationName: "parent",
  }),
  replies: many(comments, {
    relationName: "parent",
  }),
  likes: many(likesToComment),
}));

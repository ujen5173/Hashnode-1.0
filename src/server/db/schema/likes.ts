import { relations } from "drizzle-orm";
import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { articles } from "./articles";
import { comments } from "./comments";
import { users } from "./users";

export const likesToComment = pgTable(
  "likes_to_comments",
  {
    userId: text("user_id")
      .references(() => users.id)
      .notNull(),

    commentId: text("comment_id")
      .notNull()
      .references(() => comments.id),
  },
  (t) => ({
    pk: primaryKey(t.userId, t.commentId),
  }),
);

export const likesToCommentRelations = relations(likesToComment, ({ one }) => ({
  comment: one(comments, {
    fields: [likesToComment.commentId],
    references: [comments.id],
  }),
  likes: one(users, {
    fields: [likesToComment.userId],
    references: [users.id],
  }),
}));

export const likesToArticles = pgTable(
  "likes_to_articles",
  {
    userId: text("user_id")
      .references(() => users.id)
      .notNull(),
    articleId: text("article_id")
      .references(() => articles.id)
      .notNull(),
  },
  (t) => ({
    pk: primaryKey(t.userId, t.articleId),
  }),
);

export const likesToArticlesRelations = relations(
  likesToArticles,
  ({ one }) => ({
    articles: one(articles, {
      fields: [likesToArticles.articleId],
      references: [articles.id],
    }),
    likes: one(users, {
      fields: [likesToArticles.userId],
      references: [users.id],
    }),
  }),
);

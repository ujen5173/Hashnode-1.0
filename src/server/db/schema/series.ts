import { relations, sql } from "drizzle-orm";
import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { articles } from "./articles";
import { users } from "./users";

// series
export const series = pgTable(
  "series",
  {
    id: text("id")
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    cover_image: text("cover_image"),

    authorId: text("author_id").notNull(),

    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (series) => ({
    userIdIdx: index("seriesuserId_idx").on(series.id),
    seriesSlugIdx: index("seriesSlug_idx").on(series.slug),
  }),
);

export const seriesRelations = relations(series, ({ one, many }) => ({
  author: one(users, {
    fields: [series.authorId],
    references: [users.id],
  }),
  articles: many(articles),
}));

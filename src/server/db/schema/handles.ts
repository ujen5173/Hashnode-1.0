import { relations, sql } from "drizzle-orm";
import { json, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { customTabs } from "./custom_tabs";
import { users } from "./users";

// Handle
export const handles = pgTable("handles", {
  id: text("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  handle: text("handle").notNull(),
  name: text("name").notNull(),
  about: text("about"),
  userId: text("user_id").notNull(),
  social: json("social").default({
    github: "",
    twitter: "",
    website: "",
    youtube: "",
    facebook: "",
    linkedin: "",
    instagram: "",
    stackoverflow: "",
  }),
  appearance: json("appearance").default({
    layout: "MAGAZINE",
    logo: null,
  }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const handlesRelations = relations(handles, ({ one, many }) => ({
  user: one(users, { fields: [handles.userId], references: [users.id] }),
  customTabs: many(customTabs),
}));

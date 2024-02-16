import { relations, sql } from "drizzle-orm";
import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { handles } from "./handles";

// custom tab
export const customTabs = pgTable(
  "customTabs",
  {
    id: text("id")
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    label: text("label").notNull(),
    type: text("type").notNull(),
    value: text("value").notNull(),
    priority: integer("priority").notNull(),
    handleId: text("handle_id").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (customTabs) => ({
    handleIdIdx: index("handleId_idx").on(customTabs.id),
  }),
);

export const customTabsRelations = relations(customTabs, ({ one }) => ({
  handle: one(handles, {
    fields: [customTabs.handleId],
    references: [handles.id],
  }),
}));

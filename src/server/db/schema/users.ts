import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  json,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { type AdapterAccount } from "next-auth/adapters";
import { articles } from "./articles";
import { follow } from "./follow";
import { handles } from "./handles";
import { likesToArticles, likesToComment } from "./likes";
import { notifications } from "./notifications";
import { readersToArticles } from "./read";
import { series } from "./series";
import { stripeSubscriptionEnum } from "./stripe";
import { tagsToUsers } from "./tags";

export const users = pgTable("user", {
  id: text("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  name: text("name").notNull(),
  username: text("username").unique().notNull(),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  tagline: text("tagline"),
  cover_image: text("cover_image"),
  bio: text("bio"),
  skills: text("skills").array(),
  location: text("location"),
  available: text("available"),
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
  followersCount: integer("followers_count").default(0).notNull(),
  followingCount: integer("following_count").default(0).notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  stripeSubscriptionStatus: stripeSubscriptionEnum(
    "stripe_subscription_status",
  ),

  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  accounts: many(accounts),
  handle: one(handles),
  articles: many(articles),
  followingTags: many(tagsToUsers),
  notifications: many(notifications, {
    relationName: "notifications",
  }),
  notificationsFrom: many(notifications, {
    relationName: "notificationsFrom",
  }),
  series: many(series),
  readArtices: many(readersToArticles),
  likedArticles: many(likesToArticles),
  likedComments: many(likesToComment),
  following: many(follow, {
    relationName: "followers",
  }),
  followers: many(follow, {
    relationName: "following",
  }),
}));

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    userIdIdx: index("accountuserId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = pgTable(
  "session",
  {
    sessionToken: text("session_token").notNull().primaryKey(),
    userId: text("userId"),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("sessionuserId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    pk: primaryKey(vt.identifier, vt.token),
  }),
);

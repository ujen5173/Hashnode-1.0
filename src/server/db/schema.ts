import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  json,
  pgEnum,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

export const pgTable = pgTableCreator((name) => `${name}`);

export const stripeSubscriptionEnum = pgEnum("stripeSubscriptionStatus", [
  "incomplete",
  "incomplete_expired",
  "trialing",
  "active",
  "past_due",
  "canceled",
  "unpaid",
  "paused",
]);

export const commentEnum = pgEnum("commentStatus", ["COMMENT", "REPLY"]);

export const users = pgTable("user", {
  id: text("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  name: varchar("name").notNull(),
  username: varchar("username").notNull(),
  email: varchar("email").notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  profile: varchar("profile"),
  tagline: varchar("tagline", { length: 50 }),
  cover_image: varchar("cover_image"),
  bio: varchar("bio"),
  skills: varchar("skills", { length: 10 }).array(),
  location: varchar("location", { length: 20 }),
  available: varchar("available", { length: 50 }),
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
  followersCount: integer("followersCount").default(0).notNull(),
  followingCount: integer("followingCount").default(0).notNull(),
  stripeCustomerId: varchar("stripeCustomerId"),
  stripeSubscriptionId: varchar("stripeSubscriptionId"),
  stripeSubscriptionStatus: stripeSubscriptionEnum("stripeSubscriptionStatus"),

  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  accounts: many(accounts),
  handle: one(handles),
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

export const follow = pgTable(
  "follow",
  {
    userId: text("userId")
      .references(() => users.id)
      .notNull(),
    followingId: text("followingId")
      .references(() => users.id)
      .notNull(),
  },
  (table) => ({
    pk: primaryKey(table.userId, table.followingId),
  })
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

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    type: varchar("type").$type<AdapterAccount["type"]>().notNull(),
    provider: varchar("provider").notNull(),
    providerAccountId: varchar("providerAccountId").notNull(),
    refresh_token: varchar("refresh_token"),
    access_token: varchar("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type"),
    scope: varchar("scope"),
    id_token: varchar("id_token"),
    session_state: varchar("session_state"),
  },
  (account) => ({
    // pk: primaryKey(account.provider, account.providerAccountId),
    userIdIdx: index("userId_idx").on(account.userId),
  })
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = pgTable(
  "session",
  {
    sessionToken: varchar("sessionToken").notNull().primaryKey(),
    userId: text("userId"),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("userId_idx").on(session.userId),
  })
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: varchar("identifier").notNull(),
    token: varchar("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    pk: primaryKey(vt.identifier, vt.token),
  })
);

// Handle
export const handles = pgTable("handles", {
  id: text("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  handle: varchar("handle").notNull(),
  name: varchar("name").notNull(),
  about: varchar("about"),
  userId: text("userId").notNull(),
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
});

export const handlesRelations = relations(handles, ({ one, many }) => ({
  user: one(users, { fields: [handles.userId], references: [users.id] }),
  customTabs: many(customTabs),
}));

// custom tab
export const customTabs = pgTable(
  "customTabs",
  {
    id: text("id")
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    label: varchar("label").notNull(),
    type: varchar("type").notNull(),
    value: varchar("value").notNull(),
    priority: integer("priority").notNull(),
    handleId: text("handleId").notNull(),
  },
  (customTabs) => ({
    handleIdIdx: index("handleId_idx").on(customTabs.id),
  })
);

export const customTabsRelations = relations(customTabs, ({ one }) => ({
  handle: one(handles, {
    fields: [customTabs.handleId],
    references: [handles.id],
  }),
}));

export const tags = pgTable(
  "tags",
  {
    id: text("id")
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    name: varchar("name").notNull().unique(),
    slug: varchar("slug").notNull().unique(),
    description: varchar("description"),
    followersCount: integer("followersCount").notNull().default(0),
    articlesCount: integer("articlesCount").notNull().default(0),
    logo: varchar("logo"),
    // logoKey: varchar("logoKey"),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
  },
  (tags) => ({
    nameIdx: index("name_idx").on(tags.name),
    slugIdx: index("slug_idx").on(tags.slug),
  })
);

export const tagsRelations = relations(tags, ({ many }) => ({
  followers: many(tagsToUsers),
  articles: many(tagsToArticles),
}));

export const tagsToUsers = pgTable(
  "tags_to_users",
  {
    userId: text("userId")
      .references(() => users.id)
      .notNull(),
    tagId: text("tagId")
      .references(() => tags.id)
      .notNull(),
  },
  (tagsToUsers) => ({
    pk: primaryKey(tagsToUsers.tagId, tagsToUsers.userId),
  })
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
    tagId: text("tagId")
      .references(() => tags.id)
      .notNull(),
    articleId: text("articleId")
      .references(() => articles.id)
      .notNull(),
  },
  (tagsToArticles) => ({
    pk: primaryKey(tagsToArticles.tagId, tagsToArticles.articleId),
  })
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

// comment
export const comments = pgTable(
  "comments",
  {
    id: text("id")
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    userId: text("userId").notNull(),
    articleId: text("articleId").notNull(),
    body: varchar("body").notNull(),
    likesCount: integer("likesCount").notNull().default(0),
    type: commentEnum("type").notNull(),
    parentId: text("parentId"),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
  },
  (comments) => ({
    userIdIdx: index("userId_idx").on(comments.id),
    articleIdIdx: index("articleId_idx").on(comments.id),
  })
);

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

export const likesToComment = pgTable(
  "likes_to_comments",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id),
    commentId: text("commentId")
      .notNull()
      .references(() => comments.id),
  },
  (t) => ({
    pk: primaryKey(t.userId, t.commentId),
  })
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

// article
export const articles = pgTable(
  "articles",
  {
    id: text("id")
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    title: varchar("title").notNull(),
    cover_image: varchar("cover_image"),
    cover_image_key: varchar("cover_image_key"),
    userId: text("userId").notNull(),
    content: varchar("body").notNull(),
    read_time: integer("read_time").notNull(),
    seoTitle: varchar("seoTitle"),
    seoDescription: varchar("seoDescription"),
    seoOgImage: varchar("seoOgImage"),
    seoOgImageKey: varchar("seoOgImageKey"),
    subtitle: varchar("subtitle"),
    disabledComments: boolean("disabledComments").notNull().default(true),
    likesCount: integer("likesCount").notNull().default(0),
    slug: varchar("slug").notNull(),
    commentsCount: integer("commentsCount").notNull().default(0),
    readCount: integer("readCount").notNull().default(0),
    isDeleted: boolean("isDeleted").notNull().default(false),

    seriesId: text("seriesId"),

    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
  },
  (articles) => ({
    userIdIdx: index("userId_idx").on(articles.id),
    slugIdx: index("slug_idx").on(articles.slug),
  })
);

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

export const likesToArticles = pgTable(
  "likes_to_articles",
  {
    userId: text("userId")
      .references(() => users.id)
      .notNull(),
    articleId: text("articleId")
      .references(() => articles.id)
      .notNull(),
  },
  (t) => ({
    pk: primaryKey(t.userId, t.articleId),
  })
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
  })
);

export const readersToArticles = pgTable(
  "readers_to_articles",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id),
    articleId: text("articleId")
      .notNull()
      .references(() => articles.id),
  },
  (t) => ({
    pk: primaryKey(t.userId, t.articleId),
  })
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
  })
);

// stripe event
export const stripeEvents = pgTable(
  "stripeEvents",
  {
    id: text("id")
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    type: varchar("type").notNull(),
    data: json("data").notNull(),
    request: json("request").notNull(),
    pending_webhooks: integer("pending_webhooks").notNull(),
    livemode: boolean("livemode").notNull(),
    api_version: varchar("api_version").notNull(),
    object: varchar("object").notNull(),
    account: varchar("account").notNull(),
    created: timestamp("created", { mode: "date" }).notNull(),
  },
  (stripeEvents) => ({
    userIdIdx: index("userId_idx").on(stripeEvents.id),
  })
);

// series
export const series = pgTable(
  "series",
  {
    id: text("id")
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    title: varchar("title").notNull(),
    slug: varchar("slug").notNull(),
    description: varchar("description"),
    cover_image: varchar("cover_image"),

    authorId: text("authorId").notNull(),

    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
  },
  (series) => ({
    userIdIdx: index("userId_idx").on(series.id),
    seriesSlugIdx: index("seriesSlug_idx").on(series.slug),
  })
);

export const seriesRelations = relations(series, ({ one, many }) => ({
  author: one(users, {
    fields: [series.authorId],
    references: [users.id],
  }),
  articles: many(articles),
}));

// notification
export const notifications = pgTable(
  "notifications",
  {
    id: text("id")
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    type: varchar("type").notNull(),
    isRead: boolean("isRead").default(false),

    body: varchar("body").default(""),
    slug: varchar("slug").default("").notNull(),
    title: varchar("title").default(""),
    articleAuthor: varchar("articleAuthor").default(""),

    userId: text("userId").notNull(),
    fromId: text("fromId").notNull(),

    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
  },
  (notifications) => ({
    userIdIdx: index("userId_idx").on(notifications.id),
  })
);

export const notificationsRelations = relations(notifications, ({ one }) => ({
  userId: one(users, {
    fields: [notifications.userId],
    references: [users.id],
    relationName: "notifications",
  }),
  fromId: one(users, {
    fields: [notifications.fromId],
    references: [users.id],
    relationName: "notificationsFrom",
  }),
}));

export const verificationToken = pgTable(
  "verificationToken",
  {
    identifier: varchar("identifier").notNull(),
    token: varchar("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    pk: primaryKey(vt.identifier, vt.token),
  })
);

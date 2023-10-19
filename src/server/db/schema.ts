import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer as int,
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
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  username: varchar("username", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  profile: varchar("profile", { length: 255 }),
  tagline: varchar("tagline", { length: 50 }),
  cover_image: varchar("cover_image", { length: 255 }),
  bio: varchar("bio", { length: 255 }),
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
  followersCount: int("followersCount").default(0),
  followingCount: int("followingCount").default(0),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
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
  following: many(following, {
    relationName: "name",
  }),
  follower: many(following, {
    relationName: "name",
  }),
}));

export const following = pgTable(
  "following",
  {
    userId: text("user_id")
      .references(() => users.id)
      .notNull(),
    followingId: text("following_id")
      .references(() => users.id)
      .notNull(),
  },
  (table) => ({
    cpk: primaryKey(table.userId, table.followingId),
  })
);

export const followingRelations = relations(following, ({ one }) => ({
  user: one(users, {
    fields: [following.userId],
    references: [users.id],
    relationName: "name",
  }),
  following: one(users, {
    fields: [following.followingId],
    references: [users.id],
    relationName: "asc",
  }),
}));
export const follower = pgTable(
  "follower",
  {
    userId: text("user_id")
      .references(() => users.id)
      .notNull(),
    followerId: text("follower_id")
      .references(() => users.id)
      .notNull(),
  },
  (table) => ({
    cpk: primaryKey(table.userId, table.followerId),
  })
);

export const followerRelations = relations(follower, ({ one }) => ({
  user: one(users, {
    fields: [follower.userId],
    references: [users.id],
    relationName: "name",
  }),
  follower: one(users, {
    fields: [follower.followerId],
    references: [users.id],
    relationName: "asc",
  }),
}));

export const accounts = pgTable(
  "account",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
    userIdIdx: index("userId_idx").on(account.userId),
  })
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = pgTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
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
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  })
);

// Handle
export const handles = pgTable("handles", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  handle: varchar("handle", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  about: varchar("about", { length: 255 }),
  userId: varchar("userId", { length: 255 }).notNull(),
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
  }),
});

export const handlesRelations = relations(handles, ({ one }) => ({
  user: one(users, { fields: [handles.userId], references: [users.id] }),
}));

// custom tab
export const customTabs = pgTable(
  "customTabs",
  {
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    label: varchar("label", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 }).notNull(),
    value: varchar("value", { length: 255 }).notNull(),
    priority: int("priority").notNull(),
    handleId: varchar("handleId", { length: 255 }).notNull(),
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
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }),
    followersCount: int("followersCount").notNull(),
    articlesCount: int("articlesCount").notNull(),
    logo: varchar("logo", { length: 255 }),
    // logoKey: varchar("logoKey", { length: 255 }),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
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
    tagId: varchar("tagId", { length: 255 })
      .notNull()
      .references(() => tags.id),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
  },
  (tagsToUsers) => ({
    compoundKey: primaryKey(tagsToUsers.tagId, tagsToUsers.userId),
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
    tagId: varchar("tagId", { length: 255 }).notNull(),
    articleId: varchar("articleId", { length: 255 }).notNull(),
  },
  (tagsToArticles) => ({
    compoundKey: primaryKey(tagsToArticles.tagId, tagsToArticles.articleId),
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
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    articleId: varchar("articleId", { length: 255 }).notNull(),
    body: varchar("body", { length: 255 }).notNull(),
    likesCount: int("likesCount").notNull().default(0),
    type: commentEnum("type").notNull(),
    parentId: varchar("parentId", { length: 255 }),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
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
  }),
  likes: many(likesToComment),
}));

export const likesToComment = pgTable(
  "likes_to_comments",
  {
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id),
    commentId: varchar("comment_id")
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
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    cover_image: varchar("cover_image", { length: 255 }).notNull(),
    cover_image_key: varchar("cover_image_key", { length: 255 }).notNull(),
    userId: varchar("userId", { length: 255 }).notNull(),
    content: varchar("body", { length: 255 }).notNull(),
    read_time: varchar("body", { length: 255 }).notNull(),
    seoTitle: varchar("seoTitle", { length: 255 }).notNull(),
    seoDescription: varchar("seoDescription"),
    seoOgImage: varchar("seoOgImage"),
    seoOgImageKey: varchar("seoOgImageKey"),
    subtitle: varchar("subtitle"),
    disabledComments: boolean("disabledComments").notNull().default(true),
    likesCount: int("likesCount").notNull().default(0),
    slug: varchar("slug", { length: 255 }).notNull(),
    commentsCount: int("commentsCount").notNull().default(0),
    readCount: int("readCount").notNull().default(0),
    idDeleted: boolean("idDeleted").notNull().default(false),

    seriesId: varchar("seriesId", { length: 255 }),

    createdAt: timestamp("createdAt", { mode: "date" }).notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
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
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    articleId: varchar("articleId", { length: 255 })
      .notNull()
      .references(() => articles.id),
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
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    articleId: varchar("articleId", { length: 255 })
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
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    type: varchar("type", { length: 255 }).notNull(),
    data: json("data").notNull(),
    request: json("request").notNull(),
    pending_webhooks: int("pending_webhooks").notNull(),
    livemode: boolean("livemode").notNull(),
    api_version: varchar("api_version", { length: 255 }).notNull(),
    object: varchar("object", { length: 255 }).notNull(),
    account: varchar("account", { length: 255 }).notNull(),
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
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }).notNull(),
    cover_image: varchar("cover_image", { length: 255 }).notNull(),

    authorId: varchar("authorId", { length: 255 }).notNull(),

    createdAt: timestamp("createdAt", { mode: "date" }).notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
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
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    type: varchar("type", { length: 255 }).notNull(),
    isRead: boolean("isRead").notNull(),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),

    body: varchar("body").default("").notNull(),
    slug: varchar("slug").default("").notNull(),
    title: varchar("title").default("").notNull(),
    articleAuthor: varchar("articleAuthor").default("").notNull(),

    userId: varchar("userId", { length: 255 }).notNull(),
    fromId: varchar("fromId", { length: 255 }).notNull(),
  },
  (notifications) => ({
    userIdIdx: index("userId_idx").on(notifications.id),
  })
);

export const notificationsRelations = relations(notifications, ({ one }) => ({
  notifications: one(users, {
    fields: [notifications.userId],
    references: [users.id],
    relationName: "notifications",
  }),
  notificationsFrom: one(users, {
    fields: [notifications.fromId],
    references: [users.id],
    relationName: "notificationsFrom",
  }),
}));

export const verificationToken = pgTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  })
);

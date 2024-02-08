import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import { pgTable, type PgTableFn } from "drizzle-orm/pg-core";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
  type User,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import GoogleProvider, { type GoogleProfile } from "next-auth/providers/google";
import slugify from "slugify";
import { env } from "~/env.mjs";
import { type BlogSocial } from "~/pages/dev/[username]";
import { slugSetting } from "~/utils/constants";
import { db } from "./db";
import {
  accounts,
  articles,
  comments,
  customTabs,
  follow,
  handles,
  likesToArticles,
  likesToComment,
  notifications,
  readersToArticles,
  series,
  sessions,
  stripeEvents,
  tags,
  tagsToArticles,
  tagsToUsers,
  users,
  verificationTokens,
} from "./db/schema";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User;
  }

  interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    image: string;
    emailVerified: Date | null;
    tagline: string;
    stripeSubscriptionStatus: string | null;
    handle?: {
      handle: string;
      id: string;
      name: string;
      about: string | null;
      social: BlogSocial;
      appearance?: {
        layout: "MAGAZINE" | "STACKED" | "GRID";
      };
    } | null;
  }
}

/*
  pgTableHijack is a function which is responsible for using my schema instead of nextauth default schema.
  ? source: https://github.com/nextauthjs/next-auth/discussions/7005#discussioncomment-7276938
*/
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const pgTableHijack: PgTableFn = (name, columns, extraConfig) => {
  switch (name) {
    case "user":
      return users;
    case "follow":
      return follow;
    case "account":
      return accounts;
    case "session":
      return sessions;
    case "handles":
      return handles;
    case "customTabs":
      return customTabs;
    case "tags":
      return tags;
    case "tags_to_users":
      return tagsToUsers;
    case "tags_to_articles":
      return tagsToArticles;
    case "comments":
      return comments;
    case "likes_to_comments":
      return likesToComment;
    case "articles":
      return articles;
    case "likes_to_articles":
      return likesToArticles;
    case "readers_to_articles":
      return readersToArticles;
    case "stripeEvents":
      return stripeEvents;
    case "series":
      return series;
    case "notifications":
      return notifications;
    case "verificationTokens":
      return verificationTokens;
    default:
      return pgTable(name, columns, extraConfig);
  }
};

export const authOptions: NextAuthOptions = {
  callbacks: {
    session: async ({ session, user }) => {
      const handle = await db.query.handles.findFirst({
        where: eq(handles.userId, user.id),
        columns: {
          id: true,
          handle: true,
          name: true,
          social: true,
          about: true,
          appearance: true,
        },
      });
      return {
        ...session,
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          image: user.image,
          emailVerified: user.emailVerified,
          tagline: user.tagline,
          handle: handle,
          stripeSubscriptionStatus: user.stripeSubscriptionStatus,
        },
      };
    },
  },
  adapter: DrizzleAdapter(db, pgTableHijack) as Adapter,
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,

      async profile(profile: GoogleProfile): Promise<User> {
        const usernameOccurance = await db.query.users.findMany({
          where: eq(
            users.username,
            slugify(profile.name, {
              ...slugSetting,
              replacement: "_",
            }),
          ),
          columns: {
            username: true,
          },
        });
        const isUsernameExists = (username: string): boolean => {
          return usernameOccurance.some((user) => user.username === username);
        };
        // Function to generate a random number
        const generateRandomNumber = () => {
          return Math.floor(Math.random() * 10);
        };
        // Function to generate a unique username
        const generateUniqueUsername = (desiredUsername: string): string => {
          let username = desiredUsername;
          let suffix = 1;
          while (isUsernameExists(username)) {
            username = `${desiredUsername}${generateRandomNumber()}${suffix}`;
            suffix++;
          }
          return username;
        };

        return {
          id: profile.sub,
          name: profile.name,
          username: generateUniqueUsername(
            slugify(profile.name, {
              ...slugSetting,
              replacement: "_",
            }),
          ),
          email: profile.email,
          image: profile.picture,
          stripeSubscriptionStatus: "incomplete",
          emailVerified: profile.email_verified ? new Date() : null,
          tagline: "Software Devloper",
        };
      },
    }),
  ],
  pages: {
    signIn: "/onboard",
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *import { db } from '~/server/db';

 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};

import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
  type User,
} from "next-auth";
import GoogleProvider, { type GoogleProfile } from "next-auth/providers/google";
import GithubProvider, { type GithubProfile } from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import slugify from "slugify";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User;
  }

  interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    profile: string;
    emailVerified: Date | null;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        ...user,
      },
    }),
  },
  // session: {
  //   strategy: "jwt",
  // },
  // secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      profile(profile: GoogleProfile): User {
        return {
          id: profile.sub,
          name: profile.name,
          username: slugify(profile.name, {
            lower: true,
            replacement: "_",
            trim: true,
          }),
          email: profile.email,
          profile: profile.picture,
          emailVerified: profile.email_verified ? new Date() : null,
        };
      },
    }),

    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      profile(profile: GithubProfile): User {
        return {
          id: profile.id.toString() || "",
          name: profile.name || "",
          username: profile.login,
          email: profile.email || "",
          profile: profile.avatar_url,
          emailVerified: profile.email ? new Date() : null,
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
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};

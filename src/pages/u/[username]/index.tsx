import {type User } from "@prisma/client";
import { type NextPage, type GetServerSideProps } from "next";
import { getServerSession, type Session } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useContext, useEffect } from "react";
import { Header } from "~/components";
import UserProfileMainBody from "~/components/UserProfileBody";
import UserBlogSEO from "~/SEO/UserBlog.seo";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";
import { C, type ContextValue } from "~/utils/context";

const UserBlog: NextPage<{
  user: User & {
    followers: { id: string }[];
    isFollowing: boolean
  };
}> = ({ user }) => {
  console.log({ user });
  const { data: session } = useSession();
  const { setUser } = useContext(C) as ContextValue;

  useEffect(() => {
    setUser(session);
  }, []);

  return (
    <>
      <UserBlogSEO />
      <Header />
      <UserProfileMainBody user={user} />
    </>
  );
};

export default UserBlog;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  const username = context.query?.username as string | undefined;
  let user = null;

  if (username) {
    user = (await prisma.user.findUnique({
      where: {
        username: username.slice(1, username.length),
      },
      include: {
        followers: {
          select: {
            id: true,
          },
        },
      },
    })) as User & {
      followers: { id: string }[];
    };
  }

  let isFollowing = false;

  if (session !== null) {
    isFollowing = user?.followers.some(
      (follower) => follower.id === session?.user.id
    )
      ? true
      : false;
  }

  return {
    props: {
      session: session
        ? (JSON.parse(JSON.stringify(session)) as Session)
        : null,
      user: JSON.parse(JSON.stringify({ ...user, isFollowing })) as User & {
        followers: { id: string }[];
        isFollowing: boolean;
      },
    },
  };
};

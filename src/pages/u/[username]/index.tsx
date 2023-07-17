import { type User } from "@prisma/client";
import { type GetServerSideProps, type NextPage } from "next";
import { getServerSession, type Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useContext, useEffect } from "react";
import { Header } from "~/components";
import UserProfileMainBody from "~/components/UserProfileBody";
import { type SocialHandles } from "~/pages/settings";
import UserBlogSEO from "~/SEO/UserBlog.seo";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";
import { C, type ContextValue } from "~/utils/context";

export interface UserDetailsInterface {
  followers: { id: string }[];
  isFollowing: boolean;
  handle: {
    handle: string;
  } | null;
  followersCount: number;
  social: SocialHandles;
  id: string;
  name: string;
  username: string;
  email: string;
  emailVerified: Date | null;
  profile: string;
  tagline: string;
  cover_image: string;
  bio: string;
  skills: string[];
  location: string;
  available: string;
  followingCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserBlog: NextPage<{
  user: UserDetailsInterface;
}> = ({ user }) => {
  const { data: session } = useSession();
  const { setUser } = useContext(C) as ContextValue;

  useEffect(() => {
    setUser(session);
  }, []);

  return (
    <>
      <UserBlogSEO user={user} />
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
        handle: {
          select: {
            handle: true,
          },
        },
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

  if (user === null) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  let isFollowing = false;

  if (session !== null) {
    isFollowing = user.followers.some(
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
      user: JSON.parse(
        JSON.stringify({
          ...user,
          isFollowing,
          social: JSON.parse(JSON.stringify(user?.social)) as SocialHandles,
        })
      ) as UserDetailsInterface,
    },
  };
};

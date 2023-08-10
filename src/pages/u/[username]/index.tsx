import { type User } from "@prisma/client";
import { type GetServerSideProps, type NextPage } from "next";
import { getServerSession, type Session } from "next-auth";
import { Header, UserProfileBody } from "~/component";
import UserBlogSEO from "~/SEO/UserBlog.seo";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";
import { type DetailedUser, type SocialHandles } from "~/types";

const UserBlog: NextPage<{
  user: DetailedUser;
}> = ({ user }) => {
  return (
    <>
      <UserBlogSEO user={user} />
      <Header />
      <UserProfileBody user={user} />
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
            about: true,
            id: true,
            name: true,
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
      ) as DetailedUser,
    },
  };
};

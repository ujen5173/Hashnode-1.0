import { eq } from "drizzle-orm";
import { type GetServerSideProps, type NextPage } from "next";
import { getServerSession, type Session } from "next-auth";
import { Header, UserProfileBody } from "~/component";
import UserBlogSEO from "~/SEO/UserBlog.seo";
import { authOptions } from "~/server/auth";
import db from "~/server/db";
import { follow, users } from "~/server/db/schema";
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

    user = await db.query.users.findFirst({
      where: eq(users.username, username.slice(1, username.length)),
      with: {
        handle: {
          columns: {
            id: true,
            name: true,
            handle: true,
            about: true,
          },
        },
        followers: {
          columns: {
            followingId: false,
            userId: false,
          },
          where: eq(follow.userId, session?.user.id as string),
          with: {
            following: {
              columns: {
                id: true,
              },
            }
          }
        },
      },
    })
  }

  if (user === null) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }
  const isFollowing = (user?.followers ?? []).length > 0;

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

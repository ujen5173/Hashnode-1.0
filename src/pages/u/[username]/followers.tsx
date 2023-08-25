import { type GetServerSideProps, type NextPage } from "next";
import { getServerSession, type Session } from "next-auth";
import Head from "next/head";
import { FollowArea, FollowHeader, FollowProfileArea, Header } from "~/component";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";

const Followers: NextPage<{
  user: {
    name: string;
    username: string;
    followersCount: number;
    followingCount: number;
    profile: string;
    createdAt: Date;
  };
}> = ({ user }) => {
  return (
    <>
      <Head>
        <title>{user.name}&apos;s Followers | Hashnode Clone</title>
      </Head>
      <Header />
      <main className="min-h-[100dvh] w-full bg-light-bg dark:bg-black">
        <div className="mx-auto flex flex-col md:flex-row max-w-[1550px] gap-4 py-8 sm:px-4">
          <FollowProfileArea user={user} />

          <div className="flex-1 rounded-md border border-border-light bg-white p-4 dark:border-border dark:bg-primary">
            <FollowHeader
              user={{
                username: user.username,
                followersCount: user.followersCount,
                followingCount: user.followingCount,
              }}
            />
            <FollowArea />
          </div>
        </div>
      </main>
    </>
  );
};

export default Followers;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  const username = context.query?.username as string | undefined;

  if (!username) {
    return {
      props: {
        session: null,
      },
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      username: username.slice(1, username.length),
    },
    select: {
      username: true,
      name: true,
      profile: true,
      createdAt: true,
      followersCount: true,
      followingCount: true,
    },
  });

  if (!user) {
    return {
      props: {
        session: null,
      },
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }

  return {
    props: {
      session: session
        ? (JSON.parse(JSON.stringify(session)) as Session)
        : null,
      user: user
        ? (JSON.parse(JSON.stringify(user)) as {
          name: string;
          username: string;
          profile: string;
          createdAt: Date;
          followersCount: number;
          followingCount: number;
        })
        : null,
    },
  };
};

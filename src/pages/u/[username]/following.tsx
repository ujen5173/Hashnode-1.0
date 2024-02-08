import { eq } from "drizzle-orm";
import { type GetServerSideProps, type NextPage } from "next";
import {
  FollowArea,
  FollowHeader,
  FollowProfileArea,
  Header,
} from "~/component";
import MetaTags from "~/component/MetaTags";
import { db } from "~/server/db";

import { users } from "~/server/db/schema";

const Following: NextPage<{
  user: {
    name: string;
    username: string;
    followersCount: number;
    followingCount: number;
    image: string;
    createdAt: Date;
    id: string;
  };
}> = ({ user }) => {
  return (
    <>
      <MetaTags
        title={user.name + " (@ " + user.username + ") Following"}
        description="Followers"
      />
      <Header />
      <main className="min-h-[100dvh] w-full bg-light-bg dark:bg-black">
        <div className="mx-auto flex max-w-[1550px] flex-col gap-4 py-8 sm:px-4 md:flex-row">
          <FollowProfileArea user={user} />

          <div className="flex-1 rounded-md border border-border-light bg-white p-4 dark:border-border dark:bg-primary">
            <FollowHeader
              user={{
                username: user.username,
                followersCount: user.followersCount,
                followingCount: user.followingCount,
              }}
            />
            <FollowArea userId={user.id} />
          </div>
        </div>
      </main>
    </>
  );
};

export default Following;

export const getServerSideProps: GetServerSideProps = async (context) => {
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

  const user = await db.query.users.findFirst({
    where: eq(users.username, username.slice(1, username.length)),
    columns: {
      id: true,
      username: true,
      name: true,
      image: true,
      createdAt: true,
      followersCount: true,
      followingCount: true,
    },
  });

  if (!user) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      user: user
        ? (JSON.parse(JSON.stringify(user)) as {
            name: string;
            username: string;
            image: string;
            createdAt: Date;
            followersCount: number;
            followingCount: number;
          })
        : null,
    },
  };
};

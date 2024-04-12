import { eq } from "drizzle-orm";
import { type GetServerSideProps, type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import Header from "~/components/header/Header";
import MetaTags from "~/components/meta/MetaTags";
import FollowArea from "~/components/pages/follows/FollowArea";
import FollowProfileArea from "~/components/pages/follows/FollowProfile";
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
  const path = useRouter();

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
            <header className="flex gap-1 border-b border-border-light px-3 dark:border-border">
              <Link href={`/u/@${user.username}/followers`}>
                <button
                  className={`${
                    path.pathname?.includes("followers")
                      ? "btn-tab-active"
                      : "btn-tab"
                  } font-semibold`}
                >
                  Followers ({user.followersCount})
                </button>
              </Link>

              <Link href={`/u/@${user.username}/following`}>
                <button
                  className={`${
                    path.pathname?.includes("following")
                      ? "btn-tab-active"
                      : "btn-tab"
                  } font-semibold`}
                >
                  Following ({user.followingCount})
                </button>
              </Link>
            </header>

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

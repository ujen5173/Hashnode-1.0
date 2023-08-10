import { type GetServerSideProps, type NextPage } from "next";
import { getServerSession, type Session } from "next-auth";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { type FC } from "react";
import { FollowCard, Header, TagLoading } from "~/component";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";
import { DateSVG, Pen } from "~/svgs";
import { api } from "~/utils/api";

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
  const { data: session } = useSession();


  return (
    <>
      <Header />
      <main className="min-h-screen w-full bg-light-bg dark:bg-black">
        <div className="mx-auto flex max-w-[1550px] gap-4 py-8 sm:px-4">
          <div className="w-1/4 rounded-md border border-border-light bg-white p-6 dark:border-border dark:bg-primary">
            <Link href={`/u/@${user.username}`}>
              <Image
                src={user?.profile}
                width={600}
                height={600}
                className="mb-4 h-28 w-28 overflow-hidden rounded-full object-cover"
                alt="User Profile"
              />
            </Link>

            <Link href={`/u/@${user.username}`}>
              <h1 className="mb-4 text-2xl font-semibold text-gray-700 dark:text-text-secondary">{user.name}</h1>
            </Link>

            {user.username === session?.user.username && (
              <button className="btn-outline mb-4 flex items-center gap-2">
                <Pen className="h-5 w-5 fill-none stroke-secondary" />
                <span>Edit Profile</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              <span>
                <DateSVG className="h-4 w-4 fill-gray-500 dark:fill-text-primary" />
              </span>

              <span className="text-lg text-gray-500 dark:text-text-primary">
                Member since{" "}
                <span className="font-medium">
                  {new Date(user.createdAt).toDateString()}
                </span>
              </span>
            </div>
          </div>

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

export const FollowArea = () => {
  const router = useRouter();

  const { data: followersData, isLoading: isFollowersLoading } =
    api.users.getFollowersList.useQuery(
      {
        username: router.query.username as string,
      },
      {
        enabled: router.pathname?.includes("followers"),
        refetchOnWindowFocus: false,
      }
    );

  const { data: followingData, isLoading: isFollowingLoading } =
    api.users.getFollowingList.useQuery(
      {
        username: router.query.username as string,
      },
      {
        enabled: router.pathname?.includes("following"),
        refetchOnWindowFocus: false,
      }
    );

  const { mutate: follow } = api.users.followUserToggle.useMutation();

  const followUser = (username: string) => {
    follow({
      username,
    });
  }

  return (
    <div className="flex-1 py-6">
      {router.pathname.includes("followers") ? (
        <div className="flex flex-wrap gap-2">
          {isFollowersLoading ? (
            <>
              {Array(4)
                .fill("")
                .map((_, i) => (
                  <div
                    key={i}
                    className="tagloading w-full rounded-md border border-border-light dark:border-border md:w-[calc(100%/2-0.5rem)] lg:w-[calc(100%/3-0.5rem)]"
                  >
                    <TagLoading />
                  </div>
                ))}
            </>
          ) : (
            followersData?.map((user) => (
              <FollowCard user={user} key={user.id} followUser={followUser} />
            ))
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {isFollowingLoading ? (
            <>
              {Array(4)
                .fill("")
                .map((_, i) => (
                  <div
                    key={i}
                    className="tagloading w-full rounded-md border border-border-light dark:border-border md:w-[calc(100%/2-0.5rem)] lg:w-[calc(100%/3-0.5rem)]"
                  >
                    <TagLoading />
                  </div>
                ))}
            </>
          ) : (
            followingData?.map((user) => (
              <FollowCard user={user} key={user.id} followUser={followUser} />
            ))
          )}
        </div>
      )}
    </div>
  );
};




export const FollowHeader: FC<{
  user: {
    followersCount: number;
    username: string;
    followingCount: number;
  };
}> = ({ user }) => {
  const path = useRouter();

  return (
    <header className="flex gap-1 border-b border-border-light px-3 dark:border-border">
      <Link href={`/u/@${user.username}/followers`}>
        <button
          className={`${path.pathname?.includes("followers") ? "btn-tab-active" : "btn-tab"
            } font-semibold`}
        >
          Followers ({user.followersCount})
        </button>
      </Link>

      <Link href={`/u/@${user.username}/following`}>
        <button
          className={`${path.pathname?.includes("following") ? "btn-tab-active" : "btn-tab"
            } font-semibold`}
        >
          Following ({user.followingCount})
        </button>
      </Link>
    </header>
  );
};

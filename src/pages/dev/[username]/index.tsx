import { type GetServerSideProps, type NextPage } from "next";
import { getServerSession, type Session } from "next-auth";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState, type FC } from "react";
import { toast } from "react-toastify";
import { AuthorBlogHeader, Footer, Grid, Magazine, Stacked } from "~/component";
import useOnScreen from "~/hooks/useOnScreen";
import AuthorBlog from "~/SEO/AuthorBlog.seo";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";

export interface BlogSocial {
  twitter: string;
  mastodon: string;
  instagram: string;
  github: string;
  website: string;
  linkedin: string;
  youtube: string;
  dailydev: string;
}

export interface CustomTabs {
  id: string;
  label: string;
  type: string;
  value: string;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

const AuthorBlogs: NextPage<{
  user: {
    id: string;
    name: string;
    username: string;
    profile: string;
    bio: string;
    handle: {
      id: string;
      handle: string;
      name: string;
      social: BlogSocial;
      about: string;
      customTabs: CustomTabs[];
    };
    followers: { id: string }[];
  };
}> = ({ user }) => {
  const { data: session } = useSession();
  const [appearance, setAppearance] = useState<
    | {
      layout: "MAGAZINE" | "STACKED" | "GRID";
    }
    | undefined
  >(undefined);

  useEffect(() => {
    if (session && session.user.handle) {
      setAppearance(session.user.handle.appearance);
    }
  }, [session]);

  const router = useRouter();

  const { data, isLoading, isError, fetchNextPage, isFetchingNextPage, hasNextPage } =
    api.posts.getAuthorArticlesByHandle.useInfiniteQuery(
      {
        handle: router.query.username
          ? (router.query?.username.slice(
            1,
            router.query?.username.length
          ) as string) || ""
          : "",
      },
      {
        enabled: !!router.query.username,
        refetchOnWindowFocus: false,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  useEffect(() => {
    if (isError) {
      toast.error("Something went wrong!");
    }
  }, [isError]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const reachedBottom = useOnScreen(bottomRef);
  useEffect(() => {
    if (reachedBottom && hasNextPage) {
      void fetchNextPage();
    }
  }, [reachedBottom]);

  const articles = useMemo(
    () => data?.pages.flatMap((page) => page.posts),
    [data]
  );
  return (
    <>
      <AuthorBlog author={user} />
      <AuthorBlogHeader user={user} />
      {/* Home, Badge, Newsletter */}
      <AuthorBlogNavigation tabs={user.handle.customTabs} />
      {/* Show the article according to the layout selected by the user from the dashboard. default is `MAGAZINE` layout. */}
      {
        {
          MAGAZINE: (
            <Magazine
              author={(() => {
                const { followers, handle, ...rest } = user;
                return {
                  ...rest,
                  handle: {
                    about: handle.about,
                  },
                };
              })()}
              data={articles}
              isLoading={isLoading}
              isFetchingNextPage={isFetchingNextPage}
              ref={bottomRef}
            />
          ),
          STACKED: (
            <Stacked
              author={(() => {
                const { followers, handle, ...rest } = user;
                return {
                  ...rest,
                  handle: {
                    about: handle.about,
                  },
                };
              })()}
              data={articles}
              isLoading={isLoading}
              isFetchingNextPage={isFetchingNextPage}
              ref={bottomRef}
            />
          ),
          GRID: (
            <Grid
              author={(() => {
                const { followers, handle, ...rest } = user;
                return {
                  ...rest,
                  handle: {
                    about: handle.about,
                  },
                };
              })()}
              data={articles}
              isLoading={isLoading}
              isFetchingNextPage={isFetchingNextPage}
              ref={bottomRef}
            />
          ),
        }[appearance?.layout || "MAGAZINE"]
      }

      <Footer />
    </>
  );
};

export default AuthorBlogs;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  const username = context.query.username as string;

  const user = await prisma.user.findFirst({
    where: {
      handle: {
        handle: username.slice(1, username.length),
      },
    },
    select: {
      id: true,
      name: true,
      username: true,
      profile: true,
      bio: true,
      handle: {
        select: {
          id: true,
          handle: true,
          name: true,
          customTabs: true,
          about: true,
          social: true,
        },
      },
      followers: {
        select: { id: true },
      },
    },
  });

  if (!user) {
    return {
      notFound: true,
      redirect: {
        destination: "/404",
      },
    };
  }

  return {
    props: {
      user: user
        ? (JSON.parse(JSON.stringify(user)) as {
          username: string;
          profile: string;
          handle: {
            handle: string;
            name: string;
            social: BlogSocial;
            customTabs: CustomTabs[];
          };
          followers: { id: string }[];
        })
        : null,
      session: session
        ? (JSON.parse(JSON.stringify(session)) as Session)
        : null,
    },
  };
};

export const AuthorBlogNavigation: FC<{ tabs: CustomTabs[] }> = ({ tabs }) => {
  return (
    <section className="hidden border-b border-border-light bg-white dark:border-border dark:bg-primary lg:block">
      <div className="mx-auto flex max-w-[1300px] items-center justify-center px-4">
        <div className="flex items-center gap-4">
          <ul className="flex">
            <li className="border-b-2 border-gray-500 py-2 dark:border-gray-400">
              <span className="cursor-pointer rounded-md bg-transparent px-4 py-2 text-lg font-medium text-gray-700 hover:bg-gray-100 dark:text-text-secondary dark:hover:bg-primary-light">
                Home
              </span>
            </li>

            <li className="py-2">
              <span className="cursor-pointer rounded-md bg-transparent px-4 py-2 text-lg font-medium text-gray-700 hover:bg-gray-100 dark:text-text-secondary dark:hover:bg-primary-light">
                Badge
              </span>
            </li>

            {tabs.map((tab) => (
              <li key={tab.id} className="py-2">
                <a target="_blank" href={tab.value}>
                  <span className="cursor-pointer rounded-md bg-transparent px-4 py-2 text-lg font-medium text-gray-700 hover:bg-gray-100 dark:text-text-secondary dark:hover:bg-primary-light">
                    {tab.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export const AuthorArea: FC<{
  author: {
    name: string;
    profile: string;
    username: string;
    handle: {
      about: string;
    };
  };
}> = ({ author }) => {
  return (
    <div className="bg-white dark:bg-primary">
      <div className="mx-auto flex max-w-[1000px] flex-col items-center justify-center px-4 py-14 md:py-16">
        <div className="flex flex-col items-center justify-center gap-2">
          <Image
            src={author.profile || ""}
            width={120}
            height={120}
            alt="User Profile"
            className="h-16 md:h-20 w-16 md:w-20 rounded-full object-cover"
          />
          <h1 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-text-secondary">
            {author.name}
          </h1>
          <p className="text-center text-base text-gray-500 dark:text-text-primary">
            {author.handle.about || "No bio added yet!"}
          </p>
        </div>
      </div>
    </div>
  );
};

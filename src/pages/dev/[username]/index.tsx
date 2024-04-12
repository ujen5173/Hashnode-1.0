import { eq } from "drizzle-orm";
import { type GetServerSideProps, type NextPage } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState, type FC } from "react";
import { toast } from "react-toastify";
import Footer from "~/components/footer/Main";
import AuthorBlogHeader from "~/components/header/AuthorBlogHeader";
import Grid from "~/components/layouts/Grid";
import Magazine from "~/components/layouts/Magazine";
import Stacked from "~/components/layouts/Stacked";
import MetaTags from "~/components/meta/MetaTags";
import useOnScreen from "~/hooks/useOnScreen";
import { db } from "~/server/db";
import { handles } from "~/server/db/schema";
import { type DataType } from "~/types";
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
    image: string;
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
    if (session?.user.handle) {
      setAppearance(session.user.handle.appearance);
    }
  }, [session]);

  const router = useRouter();

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = api.posts.getAuthorArticlesByHandle.useInfiniteQuery(
    {
      handleDomain: router.query.username
        ? (router.query?.username.slice(
            1,
            router.query?.username.length,
          ) as string) ?? ""
        : "",
    },
    {
      enabled: !!router.query.username,
      refetchOnWindowFocus: false,
      retry: 0,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  useEffect(() => {
    if (isError) {
      toast.error("Something went wrong!");
    }
  }, [isError]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const reachedBottom = useOnScreen(bottomRef);
  const [articles, setArticles] = useState<{
    data: DataType[];
    isLoading: boolean;
  }>({
    data: [],
    isLoading: true,
  });

  useEffect(() => {
    if (reachedBottom && hasNextPage) {
      void fetchNextPage();
    }
  }, [reachedBottom]);

  useEffect(() => {
    if (data) {
      setArticles({
        data: data?.pages.flatMap((page) => page.posts),
        isLoading: isLoading,
      });
    }
  }, [data, isLoading]);

  return (
    <>
      <MetaTags
        title={`${user.name}'s Blog | Hashnode`}
        description={`${user.name}'s Blog | Hashnode`}
      />

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
                } as {
                  name: string;
                  username: string;
                  image: string;
                  bio: string;
                  handle: {
                    about: string;
                  };
                };
              })()}
              data={articles.data}
              isLoading={isLoading}
              isFetchingNextPage={isFetchingNextPage}
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
                } as {
                  name: string;
                  username: string;
                  image: string;
                  bio: string;
                  handle: {
                    about: string;
                  };
                };
              })()}
              data={articles.data}
              isLoading={isLoading}
              isFetchingNextPage={isFetchingNextPage}
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
                } as {
                  name: string;
                  username: string;
                  image: string;
                  bio: string;
                  handle: {
                    about: string;
                  };
                };
              })()}
              data={articles.data}
              isLoading={isLoading}
              isFetchingNextPage={isFetchingNextPage}
            />
          ),
        }[appearance?.layout ?? "MAGAZINE"]
      }

      <div ref={bottomRef} />
      <Footer />
    </>
  );
};

export default AuthorBlogs;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const handleDomain = context.query.username as string;

  const user = await db.query.handles
    .findFirst({
      where: eq(handles.handle, handleDomain.slice(1, handleDomain.length)),
      columns: {
        about: false,
        handle: false,
        id: false,
        social: false,
        appearance: false,
        name: false,
        userId: false,
      },
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            username: true,
            image: true,
            bio: true,
          },
          with: {
            handle: {
              columns: {
                id: true,
                handle: true,
                name: true,
                about: true,
                social: true,
              },
              with: {
                customTabs: true,
              },
            },
            followers: {
              columns: {
                followingId: true,
                userId: false,
              },
            },
          },
        },
      },
    })
    .then((res) => ({
      ...res?.user,
      followers: res?.user?.followers?.map((follower) => ({
        id: follower.followingId,
      })),
    }));

  if (!user) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      user: user
        ? (JSON.parse(JSON.stringify(user)) as {
            username: string;
            image: string;
            handle: {
              handle: string;
              name: string;
              social: BlogSocial;
              customTabs: CustomTabs[];
            };
            followers: { id: string }[];
          })
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
    image: string;
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
            src={author.image ?? ""}
            width={120}
            height={120}
            alt="User image"
            className="h-16 w-16 rounded-full object-cover md:h-20 md:w-20"
          />
          <h1 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-text-secondary">
            {author.name}
          </h1>
          <p className="text-center text-base text-gray-500 dark:text-text-primary">
            {author.handle.about ?? "No bio added yet!"}
          </p>
        </div>
      </div>
    </div>
  );
};

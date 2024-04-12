import { useSession } from "next-auth/react";
import Link from "next/link";
import { useContext, type FC } from "react";
import { FilterTimeOption } from "~/hooks/useFilter";
import type { DetailedTag } from "~/types";
import { api } from "~/utils/api";
import { others } from "~/utils/constants";
import { C } from "~/utils/context";
import AIBanner from "../AIBanner";
import ManageData from "../ManageData";
import BookmarkCard from "../card/BookmarkCard";
import BookmarkLoading from "../loading/Bookmark";

const RightAside: FC<{ tagDetails?: DetailedTag }> = ({ tagDetails }) => {
  const { data: session } = useSession();

  return (
    <aside className="container-right-aside my-4 hidden min-h-[100dvh] lg:block">
      {tagDetails ? (
        <div className="mb-4 rounded-md border border-border-light bg-white p-6 dark:border-border dark:bg-primary">
          <header className="mb-5 flex gap-4">
            <h1 className="text-xl font-bold text-black dark:text-white">
              About this Tag
            </h1>
          </header>

          <p className="text-base text-gray-500 dark:text-text-primary">
            {tagDetails.description || "No description provided."}
          </p>
        </div>
      ) : (
        session?.user.stripeSubscriptionStatus !== "active" && (
          <div className="mb-4">
            <AIBanner />
          </div>
        )
      )}
      <Trending />
      <Bookmarks />
      <Others />
    </aside>
  );
};

export default RightAside;

const Trending = () => {
  const { data: articlesData, isLoading } = api.posts.trendingArticles.useQuery(
    {
      variant: FilterTimeOption.any,
      limit: 4,
    },
    {
      retry: 0,
      refetchOnWindowFocus: false,
    },
  );

  return (
    <div className="mb-4 rounded-md border border-border-light bg-white p-4 dark:border-border dark:bg-primary">
      <header className="flex items-center justify-between border-b border-border-light pb-2 dark:border-border">
        <h1 className="text-xl font-bold text-gray-700 dark:text-text-secondary">
          Trending
        </h1>

        <Link href={"/explore/articles"}>
          <button
            aria-label="See all the trending articles"
            role="button"
            className="btn-outline-small"
          >
            See all
          </button>
        </Link>
      </header>

      <div>
        <ManageData
          loading={<BookmarkLoading />}
          type="MINI_ARTICLES"
          error={
            articlesData?.posts?.length === 0 ? "No Trending Articles" : null
          }
          articleData={{ isLoading, data: articlesData?.posts }}
        />
      </div>
    </div>
  );
};

const Bookmarks = () => {
  const { bookmarks } = useContext(C)!;
  const { data: bookmarksData, isFetching } = api.posts.getBookmarks.useQuery(
    {
      ids: bookmarks,
    },
    {
      enabled: bookmarks && bookmarks.length > 0,
      refetchOnWindowFocus: false,
      retry: 0,
    },
  );

  return (
    <div className="my-4 rounded-md border border-border-light bg-white p-4 dark:border-border dark:bg-primary">
      <header className="flex items-center justify-between border-b border-border-light py-2 dark:border-border">
        <h1 className="text-xl font-bold text-gray-700 dark:text-text-secondary">
          Bookmarks ({bookmarksData?.length ?? 0})
        </h1>

        <Link href={`/bookmarks`}>
          <button
            aria-label="See all the saved bookmarks"
            role="button"
            className="btn-outline-small"
          >
            See all
          </button>
        </Link>
      </header>

      <div>
        {isFetching ? (
          Array(4)
            .fill("")
            .map((_, i) => <BookmarkLoading key={i} />)
        ) : bookmarks.length > 0 ? (
          bookmarksData ? (
            bookmarksData?.length > 0 ? (
              bookmarksData?.map((bookmark) => (
                <BookmarkCard key={bookmark.id} bookmark={bookmark} />
              ))
            ) : (
              <div className="py-8">
                <p className="text-center text-gray-700 dark:text-text-secondary">
                  You don&apos;t have any bookmarks yet.
                </p>
              </div>
            )
          ) : (
            <div className="py-8">
              <p className="text-center text-gray-700 dark:text-text-secondary">
                You don&apos;t have any bookmarks yet.
              </p>
            </div>
          )
        ) : (
          <div className="py-8">
            <p className="text-center text-gray-700 dark:text-text-secondary">
              You don&apos;t have any bookmarks yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
const Others = () => {
  return (
    <div className="my-4 rounded-md border border-border-light bg-white p-4 dark:border-border dark:bg-primary">
      <header className="flex items-center justify-between border-b border-border-light py-2 dark:border-border">
        <h1 className="text-xl font-bold text-gray-700 dark:text-text-secondary">
          Others
        </h1>
      </header>

      <div>
        {others.map((other, index) => {
          return (
            <div
              key={index}
              className="flex flex-wrap gap-2 border-b border-border-light py-4 last:border-0 dark:border-border"
            >
              {other.map((item, index) => {
                return (
                  <Link
                    href={item.link}
                    key={index}
                    className="flex w-[calc(100%/2-0.5rem)] items-center gap-2 text-sm text-gray-600 hover:text-secondary hover:underline dark:text-text-primary"
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

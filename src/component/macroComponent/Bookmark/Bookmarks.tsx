import Link from "next/link";
import { useContext } from "react";
import { BookmarkCard } from "~/component/card";
import { BookmarkLoading } from "~/component/loading";
import { api } from "~/utils/api";
import { C, type ContextValue } from "~/utils/context";

const Bookmarks = () => {
  const { bookmarks } = useContext(C) as ContextValue;
  const { data: bookmarksData, isFetching } = api.posts.getBookmarks.useQuery(
    {
      ids: bookmarks,
    },
    {
      enabled: bookmarks && bookmarks.length > 0,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <div className="my-4 rounded-md border border-border-light bg-white p-4 dark:border-border dark:bg-primary">
      <header className="flex items-center justify-between border-b border-border-light py-2 dark:border-border">
        <h1 className="text-xl font-bold text-gray-700 dark:text-text-secondary">
          Bookmarks ({bookmarksData?.length || 0})
        </h1>

        <Link href={`/bookmarks`}>
          <button
            aria-label="view all the saved bookmarks"
            role="button"
            className="btn-outline-small"
          >
            See all
          </button>
        </Link>
      </header>

      <div>
        {isFetching ? (
          <>
            <BookmarkLoading />
            <BookmarkLoading />
            <BookmarkLoading />
            <BookmarkLoading />
          </>
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

export default Bookmarks;

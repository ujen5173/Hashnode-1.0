import Link from "next/link";
import { useMemo } from "react";
import { api } from "~/utils/api";
import { BookmarkLoading } from "../loading";
import ManageData from "./ManageData";

const Trending = () => {
  const { data: articlesData, isLoading } = api.posts.trendingArticles.useInfiniteQuery(
    {
      variant: "any",
      limit: 4,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const articles = useMemo(() => articlesData?.pages.flatMap((page) => page.posts), [articlesData])

  return (
    <div className="mb-4 rounded-md border border-border-light bg-white p-4 dark:border-border dark:bg-primary">
      <header className="flex items-center justify-between border-b border-border-light pb-2 dark:border-border">
        <h1 className="text-xl font-bold text-gray-700 dark:text-text-secondary">
          Trending
        </h1>

        <Link href={"/explore/articles"}>
          <button
            aria-label="view all the trending articles"
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
          articleData={{ isLoading, data: articles }}
        />
      </div>
    </div>
  );
};

export default Trending;

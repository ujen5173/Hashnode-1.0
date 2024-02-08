import Link from "next/link";
import { FilterTimeOption } from "~/hooks/useFilter";
import { api } from "~/utils/api";
import { BookmarkLoading } from "../loading";
import ManageData from "./ManageData";

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

export default Trending;

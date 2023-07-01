import Link from "next/link";
import { api } from "~/utils/api";
import ManageData from "./Cards/ManageData";
import BookmarkLoading from "./Loading/BookmarkLoading";

const Trending = () => {
  const { data, isLoading } = api.posts.trendingArticles.useQuery(
    {
      limit: 4,
      variant: "week",
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  return (
    <div className="my-4 rounded-md border border-border-light bg-white p-4 dark:border-border dark:bg-primary">
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
          articleData={{ isLoading, data }}
        />
      </div>
    </div>
  );
};

export default Trending;

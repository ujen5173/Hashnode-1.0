import { useContext } from "react";
import { api } from "~/utils/api";
import { C, type ContextValue } from "~/utils/context";
import ArticleCard from "./Cards/ArticleCard";
import ArticleLoading from "./Loading/ArticleLoading";

const BookmarkMainComponent = () => {
  const { bookmarks } = useContext(C) as ContextValue;

  const { data: bookmarksData, isLoading } = api.posts.getMany.useQuery(
    {
      ids: bookmarks,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  return (
    <section className="container-main my-4 min-h-screen w-full">
      <div className="mb-4 rounded-md border border-border-light bg-white px-6 py-12 dark:border-border dark:bg-primary">
        <h1 className="mb-2 text-center text-3xl font-semibold text-gray-700 dark:text-text-secondary">
          Bookmarks
        </h1>
        <p className="mx-auto w-10/12 text-center text-base font-normal text-gray-500 dark:text-text-primary">
          All articles you have bookmarked on Hashnode Clone
        </p>
      </div>

      <div className="rounded-md border border-border-light bg-white pt-2 dark:border-border dark:bg-primary">
        {isLoading && !bookmarksData ? (
          <>
            <ArticleLoading />
            <ArticleLoading />
            <ArticleLoading />
            <ArticleLoading />
            <ArticleLoading />
          </>
        ) : bookmarksData?.length === 0 ? (
          <div className="flex min-h-[18rem] w-full items-center justify-center">
            <h1 className="text-2xl font-medium text-gray-500 dark:text-gray-400">
              No Bookmarks Added 🙄
            </h1>
          </div>
        ) : (
          bookmarksData?.map((article) => (
            <div
              key={article.id}
              className="border-b border-border-light bg-white last:border-0 dark:border-border dark:bg-primary"
            >
              <ArticleCard card={article} key={article.id} />
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default BookmarkMainComponent;

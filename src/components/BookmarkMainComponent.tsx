import { useContext } from "react";
import { api } from "~/utils/api";
import { C, type ContextValue } from "~/utils/context";
import ManageData from "./Cards/ManageData";
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
        <ManageData
          loading={<ArticleLoading />}
          type="ARTICLE"
          articleData={{ data: bookmarksData, isLoading }}
        />
      </div>
    </section>
  );
};

export default BookmarkMainComponent;

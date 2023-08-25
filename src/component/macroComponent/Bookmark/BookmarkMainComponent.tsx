import { useContext } from "react";
import { ArticleLoading } from "~/component/loading";
import { ManageData } from "~/component/miniComponent";
import { api } from "~/utils/api";
import { C, type ContextValue } from "~/utils/context";

const BookmarkMainComponent = () => {
  const { bookmarks } = useContext(C) as ContextValue;

  const { data: bookmarksData, isLoading } = api.posts.getMany.useQuery(
    {
      ids: bookmarks,
    },
    {
      enabled: !!bookmarks.length,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <section className="container-main my-4 min-h-[100dvh] w-full">
      <div className="mb-4 rounded-md border border-border-light bg-white px-3 py-12 dark:border-border dark:bg-primary md:px-6">
        <h1 className="mb-2 text-center text-3xl font-semibold text-gray-700 dark:text-text-secondary">
          Bookmarks
        </h1>
        <p className="mx-auto w-full text-center text-base font-normal text-gray-500 dark:text-text-primary">
          All articles you have bookmarked on Hashnode Clone
        </p>
      </div>

      <div className="rounded-md border border-border-light bg-white pt-2 dark:border-border dark:bg-primary">
        {!!bookmarks.length ? (
          <ManageData
            loading={<ArticleLoading />}
            type="ARTICLE"
            articleData={{ data: bookmarksData, isLoading }}
          />
        ) : (
          <div className="p-8 text-center">
            <h1 className="text-xl font-semibold text-gray-700 dark:text-text-secondary">
              No Articles saved!
            </h1>
          </div>
        )}
      </div>
    </section>
  );
};

export default BookmarkMainComponent;

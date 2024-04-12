import type { NextPage } from "next";
import { useContext } from "react";
import ManageData from "~/components/ManageData";
import MainLayout from "~/components/layouts/MainLayout";
import ArticleLoading from "~/components/loading/Article";
import { api } from "~/utils/api";
import { C } from "~/utils/context";

const Bookmark: NextPage = () => {
  const { bookmarks } = useContext(C)!;

  const { data: bookmarksData, isLoading } = api.posts.getMany.useQuery(
    {
      ids: bookmarks,
    },
    {
      enabled: !!bookmarks.length,
      refetchOnWindowFocus: false,
      retry: 0,
    },
  );
  return (
    <MainLayout
      title="Bookmarks"
      description="See all the bookmarks you have saved."
    >
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
    </MainLayout>
  );
};

export default Bookmark;

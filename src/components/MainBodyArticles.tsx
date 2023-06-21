import ArticleCard from "./Cards/ArticleCard";
// import { articles } from "~/utils/constants";
import MainBodyHeader from "./MainBodyHeader";
import { api } from "~/utils/api";
import ArticleLoading from "./Loading/ArticleLoading";
import { useState } from "react";

export interface Tag {
  id: string;
  name: string;
}

export interface FilterData {
  status: boolean;
  data: {
    read_time: "over_5" | "5" | "under_5" | null | undefined;
    tags: Tag[];
  };
}
const MainBodyArticles = () => {
  const [filter, setFilter] = useState<FilterData>({
    status: false,
    data: {
      read_time: null,
      tags: [],
    },
  });

  const { data, isLoading } = api.posts.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const applyFilter = () => {
    console.log("refetching");

    // TODO: Refetch data
  };

  return (
    <section className="container-main my-4 min-h-screen w-full overflow-hidden rounded-md border border-border-light bg-white dark:border-border dark:bg-primary">
      <MainBodyHeader
        applyFilter={applyFilter}
        filter={filter}
        setFilter={setFilter}
      />

      <div>
        {isLoading && !data ? (
          <>
            <ArticleLoading />
            <ArticleLoading />
            <ArticleLoading />
            <ArticleLoading />
            <ArticleLoading />
          </>
        ) : data?.length === 0 ? (
          <div className="min-h-[18rem] flex w-full items-center justify-center">
            <h1 className="text-2xl font-medium text-gray-500 dark:text-gray-400">
              No articles found 🙄
            </h1>
          </div>
        ) : (
          data?.map((card) => <ArticleCard key={card.id} card={card} />)
        )}
      </div>
    </section>
  );
};

export default MainBodyArticles;

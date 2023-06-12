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
    <section className="container-main my-4 min-h-screen w-full rounded-md border border-border-light bg-white dark:border-border dark:bg-primary">
      <MainBodyHeader
        applyFilter={applyFilter}
        filter={filter}
        setFilter={setFilter}
      />

      <div>
        {isLoading ? (
          <>
            <ArticleLoading />
            <ArticleLoading />
            <ArticleLoading />
            <ArticleLoading />
            <ArticleLoading />
          </>
        ) : (
          data?.map((card) => <ArticleCard key={card.id} card={card} />)
        )}
      </div>
    </section>
  );
};

export default MainBodyArticles;

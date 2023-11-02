import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MainBodyHeader } from "~/component/header";
import { ArticleLoading } from "~/component/loading";
import { ManageData } from "~/component/miniComponent";
import { type FilterData } from "~/types";
import { api } from "~/utils/api";
import { type TrendingArticleTypes } from "~/utils/context";

const MainBodyArticles = () => {
  const tab = useRouter().query.tab as string | undefined;

  const [filter, setFilter] = useState<FilterData>({
    status: false,
    data: {
      read_time: null,
      tags: [],
    },
  });

  const read_time_options = [
    { label: "Under 5 min", value: "under_5" },
    { label: "5 min", value: "5" },
    { label: "Over 5 min", value: "over_5" },
  ];

  const [newFilterData, setNewFilterData] = useState<FilterData["data"]>({
    read_time: filter.data.read_time,
    tags: filter.data.tags,
  });

  const filterData = {
    type: (tab || "personalized") as "personalized" | "latest" | "following",
    filter: {
      tags: newFilterData.tags,
      read_time: newFilterData.read_time
        ? (read_time_options.find(
          (option) => option.label === newFilterData.read_time
        )?.value as "over_5" | "5" | "under_5" | null | undefined)
        : null,
    },
  };


  const { isFetching, refetch } = api.posts.getAll.useQuery(
    {
      ...({ ...filterData, filter: { ...filterData.filter, tags: filterData.filter.tags.map(tag => tag.name) } }),
      limit: 4,
    },
    {
      enabled: false,
      refetchOnWindowFocus: false,
    }
  );

  const [articles, setArticles] = useState<TrendingArticleTypes>({ data: [], isLoading: true });

  useEffect(() => {
    void (async () => {
      const { data } = await refetch();

      if (data) {
        setArticles({ data: data.posts, isLoading: isFetching });
      }
    })();
  }, [tab, newFilterData]);

  const applyFilter = () => {
    setNewFilterData((prev) => ({ ...prev, ...filter.data }));
    setFilter({
      status: false,
      data: {
        read_time: null,
        tags: [],
      },
    });
  };

  const clearFilter = () => {
    setNewFilterData((prev) => ({
      ...prev,
      read_time: null,
      tags: [],
    }));
    setFilter({
      status: false,
      data: {
        read_time: null,
        tags: [],
      },
    });
  };

  return (
    <section className="container-main my-4 min-h-[100dvh] w-full overflow-hidden rounded-md border border-border-light bg-white dark:border-border dark:bg-primary">
      <MainBodyHeader
        applyFilter={() => void applyFilter()}
        clearFilter={() => void clearFilter()}
        filter={filter}
        setFilter={setFilter}
      />

      {
        isFetching ? (
          <>
            <ArticleLoading />
            <ArticleLoading />
            <ArticleLoading />
            <ArticleLoading />
            <ArticleLoading />
            <ArticleLoading />
          </>
        ) : <ManageData
          loading={<ArticleLoading />}
          type="ARTICLE"
          articleData={articles}
        />
      }

    </section>
  );
};

export default MainBodyArticles;

import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { MainBodyHeader } from "~/component/header";
import { ArticleLoading } from "~/component/loading";
import { ManageData } from "~/component/miniComponent";
import useOnScreen from "~/hooks/useOnScreen";
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

  const { data, isLoading, refetch, fetchNextPage, isFetchingNextPage, hasNextPage } = api.posts.getAll.useInfiniteQuery(
    {
      ...filterData,
      limit: 4,
    },
    {
      enabled: true,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const [articles, setArticles] = useState<TrendingArticleTypes>({ data: [], isLoading: true });

  const bottomRef = useRef<HTMLDivElement>(null);
  const reachedBottom = useOnScreen(bottomRef);

  useEffect(() => {
    if (data) {
      setArticles({ data: data?.pages.flatMap((page) => page.posts), isLoading: isLoading });
    }
  }, [data, isLoading]);

  useEffect(() => {
    if (reachedBottom && hasNextPage) {
      void fetchNextPage();
    }
  }, [reachedBottom]);

  useEffect(() => {
    void (async () => {
      const { data } = await refetch();
      setArticles({ data: data?.pages.flatMap((page) => page.posts), isLoading: isLoading });
    })();
  }, [tab, newFilterData]);

  const applyFilter = () => {
    setNewFilterData((prev) => ({ ...prev, ...filter.data }));
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

      <ManageData
        loading={<ArticleLoading />}
        type="ARTICLE"
        articleData={articles}
      />

      {
        isFetchingNextPage && (
          <>
            <ArticleLoading />
            <ArticleLoading />
            <ArticleLoading />
            <ArticleLoading />
            <ArticleLoading />
            <ArticleLoading />
          </>
        )
      }
      <div ref={bottomRef} />

    </section>
  );
};

export default MainBodyArticles;

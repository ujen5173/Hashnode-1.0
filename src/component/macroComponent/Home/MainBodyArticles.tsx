import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { ArticleLoading, ManageData } from "~/component";
import { MainBodyHeader } from "~/component/header";
import { type ArticleCard } from "~/types";
import { api } from "~/utils/api";
import { C, type TrendingArticleTypes } from "~/utils/context";

const MainBodyArticles = () => {
  const tab = useRouter().query.tab as
    | string
    | undefined
    | TrendingArticleTypes;
  const { filter } = useContext(C)!;

  const { isFetching, data, error } = api.posts.getAll.useQuery(
    {
      type: (tab?.toString().toUpperCase() ?? "PERSONALIZED") as
        | "LATEST"
        | "PERSONALIZED"
        | "FOLLOWING",
      filter: filter.data,
    },
    {
      enabled: filter.data.shouldApply,
      retry: 0,
      refetchOnWindowFocus: false,
    },
  );

  const [articles, setArticles] = useState<ArticleCard[]>([]);

  useEffect(() => {
    if (data) {
      setArticles(data?.posts);
    }
  }, [data]);

  return (
    <section className="container-main my-4 min-h-[100dvh] w-full overflow-hidden rounded-md border border-border-light bg-white dark:border-border dark:bg-primary">
      <MainBodyHeader />

      {isFetching ? (
        Array.from({ length: 7 }).map((_, i) => <ArticleLoading key={i} />)
      ) : (
        <ManageData
          loading={<ArticleLoading />}
          type="ARTICLE"
          error={error?.message ?? null}
          articleData={{
            isLoading: isFetching,
            data: articles,
          }}
        />
      )}
    </section>
  );
};

export default MainBodyArticles;

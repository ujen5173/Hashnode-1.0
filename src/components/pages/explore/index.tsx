import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useRef, type FC } from "react";
import ManageData from "~/components/ManageData";
import Select from "~/components/inputs/Select";
import ArticleLoading from "~/components/loading/Article";
import TagLoading from "~/components/loading/Tag";
import {
  FILTER_TIME_OPTIONS,
  FILTER_TIME_OPTIONS_LABEL,
  type FilterTimeOption,
} from "~/hooks/useFilter";
import useOnScreen from "~/hooks/useOnScreen";
import { api } from "~/utils/api";
import {
  C,
  type TrendingArticleTypes,
  type TrendingTagsTypes,
} from "~/utils/context";
import ExploreNavigation from "./Navigation";

const ExploreMainComponent = () => {
  const { slug } = useRouter().query;
  const { data: userData } = useSession();
  const { timeFilter } = useContext(C)!;

  const trendingTagsData = api.tags.getTrendingTags.useQuery(
    {
      limit: 4,
    },
    {
      refetchOnWindowFocus: false,
      enabled: !slug || slug[0] === "tags",
      retry: 0,
      keepPreviousData: true,
    },
  );

  const followingTagsData = api.tags.getFollowingTags.useQuery(
    {
      limit: 4,
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!userData && (!slug || slug[0] === "tags-following"),
      retry: 0,
      keepPreviousData: true,
    },
  );

  const {
    data: followingData,
    isLoading: followingLoading,
    fetchNextPage: followingNextPage,
    isFetchingNextPage: followingIsFetchingNextPage,
    hasNextPage: followingHasNextPage,
  } = api.posts.getFollowingArticles.useInfiniteQuery(
    {
      limit: 4,
      variant: timeFilter,
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!userData && (!slug || slug[0] === "articles-following"),
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      retry: 0,
      keepPreviousData: true,
    },
  );

  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    api.posts.trendingArticles.useInfiniteQuery(
      {
        limit: 4,
        variant: timeFilter,
      },
      {
        refetchOnWindowFocus: false,
        enabled: !slug || slug[0] === "articles",
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        retry: 0,
        keepPreviousData: true,
      },
    );

  const trendingArticles = useMemo(
    () => data?.pages.flatMap((page) => page.posts),
    [data],
  );

  const followingArticles = useMemo(
    () => followingData?.pages.flatMap((page) => page.posts),
    [followingData],
  );

  const bottomRef = useRef<HTMLDivElement>(null);
  const reachedBottom = useOnScreen(bottomRef);

  useEffect(() => {
    if (reachedBottom && hasNextPage) {
      if (slug?.includes("articles-following")) {
        void followingNextPage();
        return;
      }
      void fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reachedBottom]);

  return (
    <section className="container-main my-4 min-h-[100dvh] w-full">
      <div className="mb-4 rounded-md border border-border-light bg-white px-4 py-12 dark:border-border dark:bg-primary md:px-6">
        <h1 className="mb-4 text-center text-3xl font-semibold text-gray-700 dark:text-text-secondary">
          Explore Tech articles & Tags
        </h1>
        <p className="mx-auto w-full text-center text-base font-normal text-gray-500 dark:text-text-primary md:w-10/12 lg:w-8/12">
          Everything that&apos;s… Hashnode. Explore the most popular tech
          articles from the Hashnode community. A constantly updating list of
          popular tags and the best minds in tech.
        </p>
      </div>

      <div className="rounded-md border border-border-light bg-white pt-2 dark:border-border dark:bg-primary">
        <ExploreNavigation slug={slug} />

        {
          {
            default: (
              <>
                <div className="border-b border-border-light dark:border-border">
                  <ExploreSection
                    title="Trending Tags"
                    type="TAG"
                    tagsData={{
                      data: trendingTagsData.data,
                      isLoading: trendingTagsData.isFetching,
                    }}
                  />
                </div>

                <ExploreSection
                  title="Trending Articles"
                  type="ARTICLE"
                  articlesData={{
                    data: trendingArticles,
                    isLoading: isLoading,
                  }}
                />
              </>
            ),
            "tags-following": (
              <ExploreSection
                title="Tags You Follow"
                type="TAG"
                tagsData={{
                  data: followingTagsData.data,
                  isLoading: followingTagsData.isFetching,
                }}
              />
            ),
            "articles-following": (
              <ExploreSection
                title="Articles You Follow"
                type="ARTICLE"
                articlesData={{
                  data: followingArticles,
                  isLoading: followingLoading,
                }}
              />
            ),
            articles: (
              <ExploreSection
                title="Trending Articles"
                type="ARTICLE"
                articlesData={{
                  data: trendingArticles,
                  isLoading: isLoading,
                }}
                showFilter={true}
              />
            ),
            tags: (
              <ExploreSection
                title="Trending Tags"
                subtitle="Tags with most number of articles"
                type="TAG"
                tagsData={{
                  data: trendingTagsData.data,
                  isLoading: trendingTagsData.isFetching,
                }}
                showFilter={true}
              />
            ),
          }[slug ? slug[0]! : "default"]
        }
        {(isFetchingNextPage || followingIsFetchingNextPage) &&
          Array(6)
            .fill("")
            .map((_, i) => <ArticleLoading key={i} />)}
        <div ref={bottomRef} />
      </div>
    </section>
  );
};

export default ExploreMainComponent;

const ExploreSection: FC<{
  articlesData?: TrendingArticleTypes;
  tagsData?: TrendingTagsTypes;
  type: "TAG" | "ARTICLE";
  title: string;
  subtitle?: string;

  showFilter?: boolean;
}> = ({
  articlesData,
  tagsData,
  title,
  type,
  subtitle,
  showFilter = false,
}) => {
  const { setTimeFilter } = useContext(C)!;

  return (
    <>
      <div className="flex items-center justify-between p-4 pb-0">
        <div className="mb-2">
          <h1 className="text-xl font-semibold text-gray-700 dark:text-text-secondary">
            {title}
          </h1>
          {subtitle && (
            <p className="text-base font-normal text-gray-500 dark:text-text-primary">
              {subtitle}
            </p>
          )}
        </div>

        {showFilter && (
          <div className="max-w-[350px]">
            <Select
              onChange={(value) => {
                setTimeFilter(value.value as FilterTimeOption);
              }}
              defaultText={FILTER_TIME_OPTIONS.any}
              options={Object.entries(FILTER_TIME_OPTIONS_LABEL).map(
                ([key, value]) => ({
                  label: value,
                  value: key.toUpperCase(),
                }),
              )}
            />
          </div>
        )}
      </div>

      <div className="">
        <ManageData
          type={type}
          loading={type === "TAG" ? <TagLoading /> : <ArticleLoading />}
          articleData={articlesData}
          tagsData={tagsData}
        />
      </div>
    </>
  );
};

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useContext, type FC } from "react";
import { ArticleLoading, TagLoading } from "~/component/loading";
import { ManageData, Select } from "~/component/miniComponent";
import {
  FILTER_TIME_OPTIONS,
  FILTER_TIME_OPTIONS_LABEL,
  type FilterTimeOption,
} from "~/hooks/useFilter";
import { api } from "~/utils/api";
import {
  C,
  type ContextValue,
  type TrendingArticleTypes,
  type TrendingTagsTypes,
} from "~/utils/context";
import ExploreMainComponentNavigation from "./ExploreMainComponentNavigation";

const ExploreMainComponent = () => {
  const { slug } = useRouter().query;
  const { data } = useSession();
  const { timeFilter } = useContext(C) as ContextValue;

  const trendingTags = api.tags.getTrendingTags.useQuery(
    {
      limit: 10,
    },
    {
      refetchOnWindowFocus: false,
      retry: false,
      enabled: !slug || slug[0] === "tags",
    }
  );

  const followingTags = api.tags.getFollowingTags.useQuery(
    {
      limit: 10,
    },
    {
      refetchOnWindowFocus: false,
      retry: false,
      enabled: !!data && (!slug || slug[0] === "tags-following"),
    }
  );

  const followingArticles = api.posts.getFollowingArticles.useQuery(
    {
      limit: 10,
      variant: timeFilter,
    },
    {
      refetchOnWindowFocus: false,
      retry: false,
      enabled: !!data && (!slug || slug[0] === "articles-following"),
    }
  );

  const trendingArticles = api.posts.trendingArticles.useQuery(
    {
      limit: 10,
      variant: timeFilter,
    },
    {
      refetchOnWindowFocus: false,
      retry: false,
      enabled: !slug || slug[0] === "articles",
    }
  );

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
        <ExploreMainComponentNavigation slug={slug} />

        {
          {
            default: (
              <>
                <div className="border-b border-border-light dark:border-border">
                  <ExploreSection
                    title="Trending Tags"
                    type="TAG"
                    tagsData={{
                      data: trendingTags.data ?? [],
                      isLoading: trendingTags.isFetching,
                    }}
                  />
                </div>

                <ExploreSection
                  title="Trending Articles"
                  type="ARTICLE"
                  articlesData={{
                    data: trendingArticles?.data?.posts ?? [],
                    isLoading: trendingArticles.isLoading,
                  }}
                />
              </>
            ),
            "tags-following": (
              <ExploreSection
                title="Tags You Follow"
                type="TAG"
                tagsData={{
                  data: followingTags.data ?? [],
                  isLoading: followingTags.isLoading,
                }}
              />
            ),
            "articles-following": (
              <ExploreSection
                title="Articles You Follow"
                type="ARTICLE"
                articlesData={{
                  data: followingArticles?.data?.posts ?? [],
                  isLoading: followingArticles.isLoading,
                }}
              />
            ),
            articles: (
              <ExploreSection
                title="Trending Articles"
                type="ARTICLE"
                articlesData={{
                  data: trendingArticles?.data?.posts ?? [],
                  isLoading: trendingArticles.isLoading,
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
                  data: trendingTags.data ?? [],
                  isLoading: trendingTags.isLoading,
                }}
                showFilter={true}
              />
            ),
          }[(slug ? slug[0] : "default") as string]
        }
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
    const { setTimeFilter } = useContext(C) as ContextValue;

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
                options={
                  Object.entries(FILTER_TIME_OPTIONS_LABEL).map(
                    ([key, value]) => ({
                      label: value,
                      value: key.toUpperCase(),
                    })
                  )
                }
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

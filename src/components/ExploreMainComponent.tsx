import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  type FC,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Hashtag } from "~/svgs";
import { api } from "~/utils/api";
import {
  C,
  type TrendingArticleTypes,
  type ContextValue,
  type TrendingTagsTypes,
} from "~/utils/context";
import ArticleCard from "./Cards/ArticleCard";
import ArticleLoading from "./Loading/ArticleLoading";
import Select from "./Select";

const ExploreMainComponent = () => {
  const { slug } = useRouter().query;
  const { user } = useContext(C) as ContextValue;
  const [tagsSortingDate, setTagsSortingDate] = useState<
    "This week" | "This month" | "This year"
  >("This week");
  const trendingTagsData = api.tags.getTredingTags.useQuery(
    {
      limit: 10,
      variant: tagsSortingDate.replace("This ", "").toLowerCase() as
        | "week"
        | "month"
        | "year",
    },
    {
      enabled: slug === undefined ? true : slug.includes("tags"),
      refetchOnWindowFocus: false,
    }
  );
  const trendingArticlesData = api.posts.trendingArticles.useQuery(
    {
      limit: 10,
      variant: tagsSortingDate.replace("This ", "").toLowerCase() as
        | "week"
        | "month"
        | "year",
    },
    {
      enabled:
        slug === undefined
          ? true
          : slug.includes("tags") || slug.includes("articles"),
      refetchOnWindowFocus: false,
    }
  );
  const followingTagsData = api.tags.getFollowingTags.useQuery(
    {
      limit: 10,
      variant: tagsSortingDate.replace("This ", "").toLowerCase() as
        | "week"
        | "month"
        | "year",
    },
    {
      enabled: slug === undefined ? true : slug.includes("tags-following"),
      refetchOnWindowFocus: false,
    }
  );
  const followingArticlesData = api.posts.getFollowingArticles.useQuery(
    {
      limit: 10,
      variant: tagsSortingDate.replace("This ", "").toLowerCase() as
        | "week"
        | "month"
        | "year",
    },
    {
      enabled: slug === undefined ? true : slug.includes("articles-following"),
      refetchOnWindowFocus: false,
    }
  );

  return (
    <section className="container-main my-4 min-h-screen w-full">
      <div className="mb-4 rounded-md border border-border-light bg-white px-6 py-12 dark:border-border dark:bg-primary">
        <h1 className="mb-2 text-center text-3xl font-semibold text-gray-700 dark:text-text-secondary">
          Explore Tech articles & Tags
        </h1>
        <p className="mx-auto w-10/12 text-center text-base font-normal text-gray-500 dark:text-text-primary">
          Everything that&apos;s… Hashnode. Explore the most popular tech
          articles from the Hashnode community. A constantly updating list of
          popular tags and the best minds in tech.
        </p>
      </div>

      <div className="overflow-hidden rounded-md border border-border-light bg-white pt-2 dark:border-border dark:bg-primary">
        <header className="scroll-area overflow-auto border-b border-border-light px-4 dark:border-border">
          <div className="mx-auto flex w-max items-end justify-center gap-2">
            {[
              {
                id: 123,
                name: "Trending",
                slug: "",
              },
              {
                id: 456,
                name: "Tags",
                slug: "tags",
              },
              {
                id: 789,
                name: "Articles",
                slug: "articles",
              },
              ...(user?.user
                ? [
                    {
                      id: 123541,
                      name: "Tags you follow",
                      slug: "tags-following",
                    },
                    {
                      id: 5134523,
                      name: "Articles you follow",
                      slug: "articles-following",
                    },
                  ]
                : []),
            ].map((item) => (
              <Link href={`/explore/${item.slug}`} key={item.id}>
                <button
                  className={`${
                    slug === undefined
                      ? item.slug === ""
                        ? "btn-tab-active"
                        : "btn-tab"
                      : slug.includes(item.slug)
                      ? "btn-tab-active"
                      : "btn-tab"
                  }`}
                >
                  {item.name}
                </button>
              </Link>
            ))}
          </div>
        </header>

        {
          {
            default: (
              <>
                <TrendingTags
                  setTagsSortingDate={setTagsSortingDate}
                  trendingTags={trendingTagsData}
                />
                <section className="w-full py-6">
                  <ExploreArticleSection articles={trendingArticlesData} />
                </section>
              </>
            ),
            "tags-following": (
              <section className="w-full py-6">
                <ExploreFollowingTagSection followingTags={followingTagsData} />
              </section>
            ),
            "articles-following": (
              <section className="w-full py-6">
                <ExploreFollowingArticleSection
                  followingArticles={followingArticlesData}
                />
              </section>
            ),
            articles: (
              <section className="w-full py-6">
                <ExploreArticleSection articles={trendingArticlesData} />,
              </section>
            ),
            tags: (
              <section className="w-full py-6">
                <ExploreTagSection />,
              </section>
            ),
          }[(slug ? slug[0] : "default") as string]
        }
      </div>
    </section>
  );
};

export default ExploreMainComponent;

export const TrendingTags: FC<{
  setTagsSortingDate: Dispatch<
    SetStateAction<"This week" | "This month" | "This year">
  >;
  trendingTags: TrendingTagsTypes;
}> = ({ setTagsSortingDate, trendingTags }) => {
  return (
    <section className="w-full border-b border-border-light px-4 py-6 dark:border-border">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-center text-xl font-semibold text-gray-700 dark:text-text-secondary">
            Trending Tags
          </h1>
          <button className="btn-outline-small">
            <span className="text-secondary">See all tags</span>
          </button>
        </div>
        <div className="max-w-[350px]">
          <Select
            onChange={(value) => {
              setTagsSortingDate(
                value as "This week" | "This month" | "This year"
              );
            }}
            defaultText="This week"
            options={[
              {
                label: "This week",
                value: "this_week",
              },
              {
                label: "This month",
                value: "this_month",
              },
              {
                label: "This year",
                value: "this_year",
              },
            ]}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        {trendingTags.isLoading ? (
          <h1 className="text-white">Loading...</h1>
        ) : trendingTags.data && trendingTags.data.length > 0 ? (
          trendingTags.data.map((tag) => (
            <Link
              href={`/tag/${tag.slug}`}
              key={tag.id}
              className="w-full sm:w-[calc(100%/2-0.5rem)]"
            >
              <div className="flex gap-3 rounded-md border border-border-light bg-light-bg p-2 dark:border-border dark:bg-primary-light">
                {tag.logo ? (
                  <Image
                    src={tag.logo}
                    alt={tag.name}
                    width={70}
                    height={70}
                    className="h-12 w-12 rounded-md object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-200 dark:bg-primary">
                    <Hashtag className="mx-auto my-3 h-6 w-6 fill-none stroke-gray-500" />
                  </div>
                )}
                <div>
                  <h1 className="text-base font-medium text-gray-700 dark:text-text-secondary">
                    {tag.name}
                  </h1>
                  <p className="text-sm font-normal text-gray-700 dark:text-text-primary">
                    {tag.articlesCount} articles this week
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <h1 className="text-white">No tags found</h1>
        )}
      </div>
    </section>
  );
};

const ExploreArticleSection: FC<{ articles: TrendingArticleTypes }> = ({
  articles,
}) => {
  return (
    <>
      <div className="mb-4 flex items-center gap-4 px-4">
        <h1 className="text-center text-xl font-semibold text-gray-700 dark:text-text-secondary">
          Trending articles
        </h1>
        <button className="btn-outline-small">
          <span className="text-secondary">See all articles</span>
        </button>
      </div>

      <div className="">
        {articles.isLoading ? (
          <>
            <ArticleLoading />
            <ArticleLoading />
            <ArticleLoading />
            <ArticleLoading />
          </>
        ) : articles.data ? (
          articles.data.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2">
              <h1 className="text-xl font-semibold text-gray-700 dark:text-text-secondary">
                No articles found
              </h1>
            </div>
          ) : (
            articles.data.map((article) => (
              <div
                key={article.id}
                className="border-b border-border-light bg-white last:border-0 dark:border-border dark:bg-primary"
              >
                <ArticleCard card={article} />
              </div>
            ))
          )
        ) : (
          <div className="flex flex-col items-center justify-center gap-2">
            <h1 className="text-xl font-semibold text-gray-700 dark:text-text-secondary">
              No articles found
            </h1>
          </div>
        )}
      </div>
    </>
  );
};

const ExploreTagSection = () => {
  const data = api.tags.getAll.useQuery();

  return (
    <>
      <div className="mb-4 px-4">
        <h1 className="text-xl font-semibold text-gray-700 dark:text-text-secondary">
          Trending Tags
        </h1>
        <p className="text-base font-normal text-gray-500 dark:text-text-primary">
          Tags with most number of articles
        </p>
      </div>

      <div>
        {data.isLoading ? (
          <div className="flex flex-col items-center justify-center gap-2">
            <h1 className="text-xl font-semibold text-gray-700 dark:text-text-secondary">
              Loading...
            </h1>
          </div>
        ) : data.data ? (
          data.data.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2">
              <h1 className="text-xl font-semibold text-gray-700 dark:text-text-secondary">
                No tags found
              </h1>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4 p-4">
              {data.data.map((tag) => (
                <div key={tag.id} className="w-full lg:w-[calc(100%/2-1rem)]">
                  <Link href={`/tag/${tag.slug}`}>
                    <div className="flex gap-3 rounded-md border  border-border-light bg-light-bg p-2 dark:border-border dark:bg-primary-light">
                      {tag.logo ? (
                        <Image
                          src={tag.logo}
                          alt={tag.name}
                          width={70}
                          height={70}
                          className="h-12 w-12 rounded-md object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-200 dark:bg-primary">
                          <Hashtag className="mx-auto my-3 h-6 w-6 fill-none stroke-gray-500" />
                        </div>
                      )}
                      <div>
                        <h1 className="text-base font-medium text-gray-700 dark:text-text-secondary">
                          {tag.name}
                        </h1>
                        <p className="text-sm font-normal text-gray-700 dark:text-text-primary">
                          {tag.articlesCount} articles this week
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center gap-2">
            <h1 className="text-xl font-semibold text-gray-700 dark:text-text-secondary">
              No tags found
            </h1>
          </div>
        )}
      </div>
    </>
  );
};

const ExploreFollowingTagSection: FC<{
  followingTags: TrendingTagsTypes;
}> = ({ followingTags }) => {
  return (
    <>
      <div className="mb-4 px-4">
        <h1 className="text-xl font-semibold text-gray-700 dark:text-text-secondary">
          Tags You Follow
        </h1>
      </div>

      <div>
        {followingTags.isLoading ? (
          <div className="flex flex-col items-center justify-center gap-2">
            <h1 className="text-xl font-semibold text-gray-700 dark:text-text-secondary">
              Loading...
            </h1>
          </div>
        ) : followingTags.data ? (
          followingTags.data.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2">
              <h1 className="text-xl font-semibold text-gray-700 dark:text-text-secondary">
                No tags found
              </h1>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4 p-4">
              {followingTags.data.map((tag) => (
                <div key={tag.id} className="w-full lg:w-[calc(100%/2-1rem)]">
                  <Link href={`/tag/${tag.slug}`}>
                    <div className="flex gap-3 rounded-md border  border-border-light bg-light-bg p-2 dark:border-border dark:bg-primary-light">
                      {tag.logo ? (
                        <Image
                          src={tag.logo}
                          alt={tag.name}
                          width={70}
                          height={70}
                          className="h-12 w-12 rounded-md object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-200 dark:bg-primary">
                          <Hashtag className="mx-auto my-3 h-6 w-6 fill-none stroke-gray-500" />
                        </div>
                      )}
                      <div>
                        <h1 className="text-base font-medium text-gray-700 dark:text-text-secondary">
                          {tag.name}
                        </h1>
                        <p className="text-sm font-normal text-gray-700 dark:text-text-primary">
                          {tag.articlesCount} articles this week
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center gap-2">
            <h1 className="text-xl font-semibold text-gray-700 dark:text-text-secondary">
              No tags found
            </h1>
          </div>
        )}
      </div>
    </>
  );
};

const ExploreFollowingArticleSection: FC<{
  followingArticles: TrendingArticleTypes;
}> = ({ followingArticles }) => {
  return (
    <>
      <div className="mb-4 flex items-center gap-4 px-4">
        <h1 className="text-center text-xl font-semibold text-gray-700 dark:text-text-secondary">
          Articles You Follow
        </h1>
      </div>

      <div className="">
        {followingArticles.isLoading ? (
          <>
            <ArticleLoading />
            <ArticleLoading />
            <ArticleLoading />
            <ArticleLoading />
          </>
        ) : followingArticles.data ? (
          followingArticles.data.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2">
              <h1 className="text-xl font-semibold text-gray-700 dark:text-text-secondary">
                You have not followed any blogs. Follow blogs you like from the
                blogs tab.
              </h1>
            </div>
          ) : (
            followingArticles.data.map((article) => (
              <div
                key={article.id}
                className="border-b border-border-light bg-white last:border-0 dark:border-border dark:bg-primary"
              >
                <ArticleCard card={article} />
              </div>
            ))
          )
        ) : (
          <div className="flex flex-col items-center justify-center gap-2">
            <h1 className="text-xl font-semibold text-gray-700 dark:text-text-secondary">
              You have not followed any blogs. Follow blogs you like from the
              blogs tab.
            </h1>
          </div>
        )}
      </div>
    </>
  );
};

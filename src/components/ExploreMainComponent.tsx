import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { Hashtag } from "~/svgs";
import { api } from "~/utils/api";
import { C, type ContextValue } from "~/utils/context";
import ArticleCard from "./Cards/ArticleCard";

const ExploreMainComponent = () => {
  const { slug } = useRouter().query;
  const { trendingTags, setTrendingArticles } = useContext(C) as ContextValue;
  const { data, isLoading } = api.posts.trendingArticles.useQuery();

  useEffect(() => {
    if (data && !isLoading) {
      setTrendingArticles({
        data: data.map((item) => ({
          id: item.id,
          title: item.title,
          slug: item.slug,
          user: {
            profile: item.user.profile,
            id: item.user.id,
            name: item.user.name,
          },
          likesCount: item.likesCount,
          commentsCount: item.commentsCount,
        })),
        isLoading,
      });
    }
  }, [isLoading, data]);

  return (
    <section className="container-main my-4 min-h-screen w-full">
      <div className="mb-4 rounded-md border border-border-light bg-white px-6 py-12 dark:border-border dark:bg-primary">
        <h1 className="mb-2 text-center text-3xl font-semibold text-gray-700 dark:text-text-secondary">
          Explore Tech Blogs & Tags
        </h1>
        <p className="mx-auto w-10/12 text-center text-base font-normal text-gray-500 dark:text-text-primary">
          Everything that&apos;s… Hashnode. Explore the most popular tech blogs
          from the Hashnode community. A constantly updating list of popular
          tags and the best minds in tech.
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
                name: "Blogs",
                slug: "blogs",
              },
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

        <section className="w-full border-b border-border-light px-4 py-6 dark:border-border">
          <div className="mb-4 flex items-center gap-4">
            <h1 className="text-center text-xl font-semibold text-gray-700 dark:text-text-secondary">
              Trending Tags
            </h1>
            <button className="btn-outline-small">
              <span className="text-secondary">See all tags</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-4">
            {trendingTags.data?.map((tag) => (
              <Link
                href={`/tag/${tag.slug}`}
                key={tag.id}
                className="w-full sm:w-[calc(100%/2-1rem)]"
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
            ))}
          </div>
        </section>
        <section className="w-full py-6">
          <div className="mb-4 flex items-center gap-4 px-4">
            <h1 className="text-center text-xl font-semibold text-gray-700 dark:text-text-secondary">
              Trending Blogs
            </h1>
            <button className="btn-outline-small">
              <span className="text-secondary">See all blogs</span>
            </button>
          </div>

          <div className="">
            {data?.map((card) => (
              <div
                key={card.id}
                className="border-b border-border-light bg-white p-4 last:border-0 dark:border-border dark:bg-primary"
              >
                <ArticleCard card={card} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
};

export default ExploreMainComponent;

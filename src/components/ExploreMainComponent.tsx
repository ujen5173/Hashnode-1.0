import Image from "next/image";
import Link from "next/link";
import { trendingTags } from "~/utils/constants";

const ExploreMainComponent = () => {
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

      <div className="rounded-md border border-border-light bg-white pt-2 dark:border-border dark:bg-primary">
        <header className="scroll-area overflow-auto border-b border-border-light px-4 dark:border-border">
          <div className="mx-auto flex w-max items-end justify-center gap-2">
            <button className="btn-tab">Trending</button>
            <button className="btn-tab">Tags</button>
            <button className="btn-tab">Blogs</button>
            <button className="btn-tab">Tags you follow</button>
            <button className="btn-tab">Blogs you follow</button>
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
            {trendingTags.map((tag) => (
              <Link
                href={`/tag/${tag.name}`}
                key={tag.id}
                className="w-full sm:w-[calc(100%/2-1rem)]"
              >
                <div className="flex gap-2 rounded-md border border-border-light bg-gray-100 p-2 dark:border-border dark:bg-primary-light">
                  <Image
                    src={tag.image}
                    alt={tag.name}
                    width={70}
                    height={70}
                    className="h-12 w-12 rounded-md object-cover"
                  />
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
        <section className="w-full border-b border-border-light py-6 dark:border-border">
          <div className="mb-4 flex items-center gap-4 px-4">
            <h1 className="text-center text-xl font-semibold text-gray-700 dark:text-text-secondary">
              Trending Blogs
            </h1>
            <button className="btn-outline-small">
              <span className="text-secondary">See all blogs</span>
            </button>
          </div>

          <div className="">
            {/* {trendingArticles.map((card) => (
              <ArticleCard card={card} key={card.id} />
            ))} */}
          </div>
        </section>
      </div>
    </section>
  );
};

export default ExploreMainComponent;

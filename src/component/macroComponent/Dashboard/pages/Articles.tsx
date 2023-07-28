import { useClickOutside } from "@mantine/hooks";
import Link from "next/link";
import { useContext, useState, type FC } from "react";
import { Dots } from "~/svgs";
import { api } from "~/utils/api";
import { C, type ContextValue } from "~/utils/context";
import { limitText } from "~/utils/miniFunctions";

const Articles = () => {
  const { user } = useContext(C) as ContextValue;

  const { data, isLoading } = api.posts.getAuthorArticles.useQuery(
    {
      username: user?.user.username as string,
    },
    {
      enabled: !!user?.user,
    }
  );

  const [type, setType] = useState<"Published" | "Scheduled" | "Deleted">(
    "Published"
  );

  return (
    <section className="relative w-full p-8">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-4xl font-semibold text-gray-700 dark:text-text-secondary">
          {isLoading
            ? "Fetching your articles..."
            : `${type.charAt(0).toUpperCase() + type.slice(1)} (${
                data?.length as number
              })`}
        </h1>

        <div className="flex items-center gap-2">
          {["Published", "Scheduled", "Deleted"].map((item) => (
            <button
              onClick={() =>
                setType(item as "Published" | "Scheduled" | "Deleted")
              }
              key={item}
              className={`rounded-lg bg-transparent px-4 py-1 text-base font-medium hover:bg-gray-100 dark:hover:bg-primary-light ${
                type === item ? "text-secondary" : ""
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </header>

      <main className="py-4">
        <header className="flex items-center gap-4 border-b border-border-light py-2 dark:border-border">
          <div className="flex flex-1">
            <h1 className="text-lg font-semibold text-gray-700 dark:text-text-secondary">
              Article
            </h1>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-700 dark:text-text-secondary">
              Status
            </h1>
          </div>
          <div className="px-12"></div>
        </header>

        {isLoading ? (
          <>
            <ArticleLoading />
            <ArticleLoading />
            <ArticleLoading />
            <ArticleLoading />
          </>
        ) : data ? (
          data.length > 0 ? (
            data.map((article) => (
              <ArticleCard key={article.id} data={article} />
            ))
          ) : (
            <div className="flex items-center justify-center px-4 py-8">
              <h1 className="text-3xl font-semibold text-gray-700 dark:text-text-secondary">
                No articles Publised yet.
              </h1>
            </div>
          )
        ) : (
          <div className="flex items-center justify-center px-4 py-8">
            <h1 className="text-3xl font-semibold text-gray-700 dark:text-text-secondary">
              No articles Publised yet.
            </h1>
          </div>
        )}
      </main>
    </section>
  );
};
export default Articles;

const ArticleCard: FC<{
  data: {
    id: string;
    title: string;
    createdAt: Date;
    slug: string;
    read_time: number;
    user: {
      profile: string;
      username: string;
    };
    subtitle: string | null;
    cover_image: string | null;
  };
}> = ({ data }) => {
  const [opened, setOpened] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpened((prev) => !prev));

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 py-3">
        <Link href={`/u/@${data.user.username}/${data.slug}`}>
          <h1 className="max-height-one mb-1 text-xl font-semibold text-gray-700 dark:text-text-secondary">
            {limitText(data.title, 100)}
          </h1>
        </Link>
        <p className="text-base text-gray-500 dark:text-text-primary">
          {data.read_time} min read - Published on{" "}
          <span className="font-semibold">
            {new Date(data.createdAt).toDateString()}
          </span>
        </p>
      </div>
      <div>
        <button
          type="button"
          className="cursor-default rounded-lg border border-border-light bg-slate-200 px-4 py-2 text-sm font-bold uppercase tracking-wider text-black dark:border-border"
        >
          PUBLISHED
        </button>
      </div>
      <div className="relative px-6">
        <button
          onClick={() => setOpened((prev) => !prev)}
          type="button"
          className="rounded-md border border-border-light px-2 py-2 text-sm font-semibold uppercase hover:bg-light-bg dark:border-border dark:hover:bg-primary-light"
        >
          <Dots className="h-4 w-4 fill-none stroke-gray-700 dark:stroke-text-secondary" />
        </button>
        {opened && (
          <div
            ref={ref}
            className="absolute right-6 top-full mt-2 w-44 rounded-md border border-border-light bg-light-bg shadow-md dark:border-border dark:bg-primary"
          >
            <button className="w-full px-4 py-2 text-left hover:bg-gray-200 dark:hover:bg-primary-light">
              Edit
            </button>
            <button className="w-full px-4 py-2 text-left hover:bg-gray-200 dark:hover:bg-primary-light">
              <span className="text-red">Delete</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ArticleLoading = () => {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex-1">
        <div className="loading mb-2 h-6 w-3/4 rounded-lg bg-gray-200"></div>
        <div className="loading h-4 w-1/2 rounded-lg bg-gray-200"></div>
      </div>
      <div className="flex items-center gap-2">
        <div className="loading h-10 w-32 rounded-lg bg-gray-200"></div>
        <div className="loading h-10 w-32 rounded-lg bg-gray-200"></div>
      </div>
    </div>
  );
};

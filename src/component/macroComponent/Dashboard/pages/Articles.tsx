import { useClickOutside } from "@mantine/hooks";
import { TRPCClientError } from "@trpc/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type FC } from "react";
import { toast } from "react-toastify";
import useOnScreen from "~/hooks/useOnScreen";
import { Dots } from "~/svgs";
import { api } from "~/utils/api";
import { limitText } from "~/utils/miniFunctions";

const Articles = () => {
  const { data: user } = useSession();

  const [type, setType] = useState<"PUBLISHED" | "DELETED">(
    "PUBLISHED"
  );

  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } = api.posts.getAuthorArticles.useInfiniteQuery(
    {
      username: user?.user.username as string,
      limit: 10,
      type,
    },
    {
      enabled: !!user?.user,
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const bottomRef = useRef<HTMLDivElement>(null);
  const reachedBottom = useOnScreen(bottomRef);

  const articles = useMemo(
    () => data?.pages.flatMap((page) => page.posts),
    [data]
  );

  useEffect(() => {
    if (reachedBottom && hasNextPage) {
      void fetchNextPage();
    }
  }, [reachedBottom]);

  return (
    <section className="relative w-full">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-700 dark:text-text-secondary">
          {isLoading
            ? "Fetching your articles..."
            : `${type.charAt(0).toUpperCase() + type.slice(1)} (${articles?.length as number
            })`}
        </h1>

        <div className="hidden md:flex items-center gap-2">
          {["PUBLISHED", "DELETED"].map((item) => (
            <button
              onClick={() =>
                setType(item as "PUBLISHED" | "DELETED")
              }
              key={item}
              className={`rounded-lg px-2 py-1 text-base font-medium  ${type === item ? "text-secondary bg-border-light dark:bg-border" : "text-gray-700 dark:text-text-secondary hover:bg-gray-100 dark:hover:bg-primary-light"
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
          <div className="hidden sm:block">
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
        ) : articles ? (
          articles.length > 0 ? (
            articles.map((article) => (
              <ArticleCard type={type} key={article.id} data={article} />
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
  type: "PUBLISHED" | "DELETED";
}> = ({ data, type }) => {
  const [opened, setOpened] = useState(false);
  const [control, setControl] = useState<HTMLDivElement | null>(null);
  const [dropdown, setDropdown] = useState<HTMLDivElement | null>(null);

  useClickOutside<HTMLDivElement>(() => setOpened(false), null, [
    control,
    dropdown,
  ]);
  const { mutateAsync } = api.posts.restoreArticle.useMutation()
  const { mutateAsync: deleteTemporarily } = api.posts.deleteTemporarily.useMutation();
  const { mutateAsync: deletePermanently } = api.posts.deleteArticlePermantly.useMutation()

  const restoreArticle = async () => {
    try {

      const res = await mutateAsync({
        slug: data.slug
      });

      if (res) {
        toast.success("Article restored successfully");
      } else {
        toast.error("Something went wrong");
      }
    } catch (err) {
      if (err instanceof TRPCClientError) {
        toast.error(err.message)
      } else {
        toast.error("Something went wrong");
      }
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 py-3">
        <Link href={`/u/@${data.user.username}/${data.slug}`}>
          <h1 className="max-height-one mb-1 text-lg md:text-xl font-semibold text-gray-700 dark:text-text-secondary">
            {limitText(data.title, 100)}
          </h1>
        </Link>
        <p className="text-sm md:text-base text-gray-500 dark:text-text-primary">
          {data.read_time} min read - Published on{" "}
          <span className="font-semibold">
            {new Date(data.createdAt).toDateString()}
          </span>
        </p>
      </div>

      <div className="hidden sm:block">
        {
          type === "PUBLISHED" ? (
            <button
              type="button"
              className="cursor-default rounded-lg border border-border-light bg-slate-200 px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm font-bold uppercase tracking-wider text-black dark:border-border"
            >
              PUBLISHED
            </button>
          ) : (
            <button
              type="button"
              className="cursor-default rounded-lg border border-border-light bg-slate-200 px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm font-bold uppercase tracking-wider text-black dark:border-border"
            >
              DELETED
            </button>
          )
        }
      </div>

      <div className="relative px-6">
        <div
          onClick={() => setOpened((prev) => !prev)}
          ref={setControl}
          className="rounded-md border cursor-pointer border-border-light px-2 py-2 text-sm font-semibold uppercase hover:bg-light-bg dark:border-border dark:hover:bg-primary-light"
        >
          <Dots className="h-4 w-4 fill-none stroke-gray-700 dark:stroke-text-secondary" />
        </div>

        {opened && (
          <div
            ref={setDropdown}
            className="absolute py-2 select-none z-10 right-6 top-full mt-2 w-44 rounded-md border border-border-light bg-light-bg shadow-md dark:border-border dark:bg-primary"
          >
            {
              type === "PUBLISHED" ? (
                <>
                  <Link href={`/article/edit/${data.slug}`} className="w-full block px-4 py-2 text-left text-gray-700 dark:text-text-secondary hover:bg-gray-200 dark:hover:bg-primary-light">
                    Edit
                  </Link>
                  <button onClick={() => {
                    void deleteTemporarily({
                      slug: data.slug
                    })
                    window.location.reload()
                  }} className="w-full px-4 py-2 text-left hover:bg-gray-200 dark:hover:bg-primary-light">
                    <span className="text-red">Delete</span>
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => void restoreArticle()} className="w-full px-4 py-2 text-left text-gray-700 dark:text-text-secondary hover:bg-gray-200 dark:hover:bg-primary-light">
                    Restore
                  </button>
                  <button onClick={() => {
                    alert("Are you sure to delete this parmanently?")
                    void deletePermanently({
                      slug: data.slug
                    });

                    window.location.reload()
                  }} className="text-red w-full px-4 py-2 text-left hover:bg-gray-200 dark:hover:bg-primary-light">
                    Delete
                  </button>
                </>
              )
            }
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
        <div className="loading mb-2 h-4 w-3/4 rounded-lg bg-border-light dark:bg-border"></div>
        <div className="loading h-4 w-1/2 rounded-lg bg-border-light dark:bg-border"></div>
      </div>
      <div className="flex items-center gap-2">
        <div className="loading h-8 w-32 rounded-lg bg-border-light dark:bg-border"></div>
        <div className="loading h-8 w-12 rounded-lg bg-border-light dark:bg-border"></div>
      </div>
    </div>
  );
};

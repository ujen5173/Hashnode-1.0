import { useClickOutside } from "@mantine/hooks";
import { useContext, useState } from "react";
import { Dots } from "~/svgs";
import { api } from "~/utils/api";
import { C, type ContextValue } from "~/utils/context";

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

  const [opened, setOpened] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpened((prev) => !prev));

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
          <div className="px-6"></div>
        </header>

        <div className="flex items-center gap-4">
          <div className="flex-1 py-3">
            <h1 className="mb-1 text-lg font-semibold text-gray-700 dark:text-text-secondary">
              Testing hashnode article system
            </h1>
            <p className="text-base text-gray-500 dark:text-text-primary">
              1 min read - Published on 18 Jul, 2023
            </p>
          </div>
          <div>
            <button
              disabled
              type="button"
              className="rounded-md border border-border-light bg-green px-4 py-1 text-sm font-semibold uppercase tracking-wider text-black dark:border-border"
            >
              PUBLISHED
            </button>
          </div>
          <div className="relative">
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
                className="absolute right-0 top-full mt-2 w-44 rounded-md border border-border-light bg-light-bg shadow-md dark:border-border dark:bg-primary"
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
      </main>
    </section>
  );
};
export default Articles;

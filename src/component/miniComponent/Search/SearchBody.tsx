import React, { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { TagsSearchCard, UserSearchCard } from "~/component/card";
import { SearchLoading } from "~/component/loading";
import { Search } from "~/svgs";
import { type SearchResults } from "~/types";
import { api } from "~/utils/api";
import SearchArticle from "./SearchArticle";

const SearchBody = React.forwardRef<
  HTMLDivElement,
  {
    setOpened: React.Dispatch<React.SetStateAction<boolean>>;
  }
>(({ setOpened }, ref) => {
  const [query, setQuery] = useState<string>("");
  const [type, setType] = useState<
    "TOP" | "LATEST" | "ARTICLES" | "USERS" | "TAGS"
  >("TOP");
  const { refetch, isFetching } = api.posts.search.useQuery(
    {
      query,
      type,
    },
    {
      enabled: false,
      refetchOnWindowFocus: false,
    }
  );

  const [data, setData] = useState<SearchResults>({
    articles: null,
    tags: null,
    users: null,
  });

  const [refetching, setRefetching] = useState(false);

  useEffect(() => {
    // just to show loading when changing search type (top, latest, articles, users, tags)
    if (isFetching) {
      setRefetching(true);
    }
  }, [isFetching]);

  async function search(criteria: string): Promise<SearchResults> {
    let response;
    if (criteria.trim().length > 0) {
      response = await refetch();
      setRefetching(false);
      if (response.data) {
        return response.data as SearchResults;
      } else {
        return {
          articles: null,
          tags: null,
          users: null,
        };
      }
    }

    return {
      articles: null,
      tags: null,
      users: null,
    };
  }

  const debounced = useDebouncedCallback(async (value: string) => {
    return setData(await search(value));
  }, 500);

  const refetchData = async () => {
    if (query.trim().length > 0) {
      const res = await refetch();
      setData(res.data as SearchResults);
      setRefetching(false);
    } else {
      return {
        articles: null,
        tags: null,
        users: null,
      };
    }
  };

  return (
    <div
      ref={ref}
      className="absolute inset-0 flex items-start justify-center py-24"
    >
      <div
        onClick={() => setOpened(false)}
        className="fixed inset-0 z-40 bg-gray-700 bg-opacity-50 backdrop-blur"
      />

      <div className="z-50 w-11/12 max-w-[950px] overflow-hidden rounded-xl border border-border-light bg-white shadow-lg dark:border-border dark:bg-primary">
        <header className="p-4">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2">
              <Search className="h-4 w-4 stroke-gray-700 dark:stroke-text-primary" />
            </span>

            <input
              type="text"
              placeholder="Search Hashnode"
              className="input-primary w-full"
              autoFocus
              onChange={(e) => {
                setQuery(e.target.value);
                setRefetching(true);

                void debounced(e.target.value);
              }}
            />

            <span className="absolute right-4 top-1/2 -translate-y-1/2">
              <span className="rounded-md border border-border-light bg-gray-200 px-2 py-1 text-xs text-gray-700 dark:border-border dark:bg-primary-light dark:text-text-primary">
                CTRL + K
              </span>
            </span>
          </div>
        </header>

        <div className="">
          {query.trim() !== "" && (
            <div className="w-full overflow-auto">
              <ul className="scroll-area flex w-full items-center gap-2 border-b border-border-light px-4 dark:border-border">
                {["TOP", "LATEST", "ARTICLES", "USERS", "TAGS"].map(
                  (item, index) => (
                    <li key={index}>
                      <button
                        onClick={() => {
                          setType(
                            item as
                              | "TOP"
                              | "LATEST"
                              | "ARTICLES"
                              | "USERS"
                              | "TAGS"
                          );
                          setTimeout(() => {
                            void refetchData();
                          }, 200);
                        }}
                        className={`${
                          type === item ? "btn-tab-active" : "btn-tab"
                        }`}
                      >
                        {`${item.slice(0, 1)}${item
                          .slice(1, item.length)
                          .toLowerCase()} `}
                      </button>
                    </li>
                  )
                )}
              </ul>
            </div>
          )}

          <section>
            {query.trim() === "" ? (
              <div className="flex min-h-[10rem] items-center justify-center p-4">
                <h1 className="flex items-center gap-2 text-center text-base text-gray-700 dark:text-text-secondary">
                  <Search className="hidden h-4 w-4 stroke-gray-700 dark:stroke-text-primary md:block" />
                  Search for tags, people, articles, and more
                </h1>
              </div>
            ) : (
              <div className="">
                {refetching ? (
                  <SearchLoading />
                ) : type === "USERS" && data.users && data.users.length > 0 ? (
                  <ul className="scroll-area max-h-[20rem] overflow-auto">
                    {data.users.map((user) => (
                      <div
                        // onClick={() => setOpened(false)}
                        key={user.id}
                        className="border-b border-border-light dark:border-border"
                      >
                        <UserSearchCard
                          key={user.id}
                          user={user}
                          setOpened={setOpened}
                        />
                      </div>
                    ))}
                  </ul>
                ) : type === "TAGS" && data.tags && data.tags.length > 0 ? (
                  <ul className="scroll-area max-h-[20rem] overflow-auto">
                    {data.tags.map((tag) => (
                      <div
                        // onClick={() => setOpened(false)}
                        key={tag.id}
                        className="border-b border-border-light dark:border-border"
                      >
                        <TagsSearchCard
                          key={tag.id}
                          tag={tag}
                          setOpened={setOpened}
                        />
                      </div>
                    ))}
                  </ul>
                ) : data.articles && data.articles.length > 0 ? (
                  <ul className="scroll-area max-h-[20rem] overflow-auto">
                    {data.articles.map((article) => (
                      <div
                        onClick={() => setOpened(false)}
                        key={article.id}
                        className="border-b border-border-light dark:border-border"
                      >
                        <SearchArticle data={article} />
                      </div>
                    ))}
                  </ul>
                ) : (
                  <div className="flex h-64 items-center justify-center">
                    <p className="text-center text-base font-semibold text-gray-700 dark:text-text-secondary md:text-xl">
                      Whoops! No results found. Try a new keyword or phrase.
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
});

SearchBody.displayName = "SearchBody";

export default SearchBody;

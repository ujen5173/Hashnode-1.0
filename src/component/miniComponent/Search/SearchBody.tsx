/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { faker } from "@faker-js/faker";
import React, { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { TagsSearchCard, UserSearchCard } from "~/component/card";
import { SearchLoading } from "~/component/loading";
import { Search } from "~/svgs";
import { type SearchResults } from "~/types";
import { api } from "~/utils/api";
import SearchArticle from "./SearchArticle";

interface ArticleSeach {
  id: string;
  title: string;
  user: {
    id: string;
    name: string;
    username: string;
    profile: string;
    stripeSubscriptionStatus: string | null;
  };
  cover_image: string;
  slug: string;
  read_time: number;
  likesCount: number;
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface TagSearch {
  id: string;
  name: string;
  slug: string;
  isFollowing: boolean;
}

interface UserSearch {
  id: string;
  name: string;
  username: string;
  profile: string;
  isFollowing: boolean;
  stripeSubscriptionStatus: string | null;
}
const searchNavigation = [
  "TOP",
  "LATEST",
  "ARTICLES",
  "USERS",
  "TAGS",
] as const;

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
  const { refetch } = api.posts.search.useQuery(
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

  const [topResults, setTopResults] = useState<any>([]);

  const [refetching, setRefetching] = useState(false);

  async function search(criteria: string): Promise<SearchResults> {
    let response;
    if (criteria.trim().length > 0) {
      response = await refetch();

      if (response.data) {
        if (type === "TOP") {
          const data = response.data as SearchResults;
          const randomizeResponse = faker.helpers.shuffle(
            [
              ...(data.articles?.map((e) => ({ ...e, type: "ARTICLES" })) ||
                []),
              ...(data.tags?.map((e) => ({ ...e, type: "TAGS" })) || []),
              ...(data.users?.map((e) => ({ ...e, type: "USERS" })) || []),
            ].flat()
          );
          setTopResults(randomizeResponse);
        }
        setData(response.data as SearchResults);
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
    setData(await search(value));
    setRefetching(false);
    return;
  }, 500);

  const refetchData = async (
    currentType: "TOP" | "LATEST" | "ARTICLES" | "USERS" | "TAGS"
  ) => {
    if (query.trim().length > 0) {
      const res = await refetch();
      if (currentType === "TOP") {
        const data = res.data as SearchResults;
        const randomizeResponse = faker.helpers.shuffle(
          [
            ...(data.articles?.map((e) => ({ ...e, type: "ARTICLES" })) || []),
            ...(data.tags?.map((e) => ({ ...e, type: "TAGS" })) || []),
            ...(data.users?.map((e) => ({ ...e, type: "USERS" })) || []),
          ].flat()
        );
        setTopResults(randomizeResponse);
        return;
      }
      setData(res.data as SearchResults);
    } else {
      setData({
        articles: null,
        tags: null,
        users: null,
      });
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
          </div>
        </header>

        <div className="">
          {query.trim() !== "" && (
            <div className="w-full overflow-auto">
              <ul className="scroll-area flex w-full items-center gap-2 border-b border-border-light px-4 dark:border-border">
                {searchNavigation.map((item, index) => (
                  <li key={index}>
                    <button
                      onClick={() => {
                        setType(item);
                        setRefetching(true);
                        setTimeout(() => {
                          void refetchData(item);
                        }, 100);
                        setRefetching(false);
                      }}
                      className={`${type === item ? "btn-tab-active" : "btn-tab"
                        }`}
                    >
                      {`${item.slice(0, 1)}${item
                        .slice(1, item.length)
                        .toLowerCase()} `}
                    </button>
                  </li>
                ))}
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
              <div className="scroll-area max-h-[65vh] min-h-[350px] overflow-auto">
                {refetching ? (
                  <SearchLoading />
                ) : type === "USERS" ? data.users && data.users.length > 0 ? (
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
                ) : <NoSearchResults /> : type === "TAGS" ? data.tags && data.tags.length > 0 ? (
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
                ) : <NoSearchResults /> : (type === "ARTICLES" || type === "LATEST") ?
                  data.articles &&
                    data.articles.length > 0 ? (
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
                  ) : <NoSearchResults /> : type === "TOP" ? (
                    topResults.length > 0 ? topResults.map((search: any) => {
                      const { type, ...rest } = search;
                      return type === "ARTICLES" ? (
                        <div
                          onClick={() => setOpened(false)}
                          key={rest.id as string}
                          className="border-b border-border-light dark:border-border"
                        >
                          <SearchArticle data={rest as ArticleSeach} />
                        </div>
                      ) : type === "TAGS" ? (
                        <div
                          // onClick={() => setOpened(false)}
                          key={rest.id as string}
                          className="border-b border-border-light dark:border-border"
                        >
                          <TagsSearchCard
                            key={rest.id as string}
                            tag={rest as TagSearch}
                            setOpened={setOpened}
                          />
                        </div>
                      ) : type === "USERS" ? (
                        <div
                          // onClick={() => setOpened(false)}
                          key={rest.id as string}
                          className="border-b border-border-light dark:border-border"
                        >
                          <UserSearchCard
                            key={rest.id as string}
                            user={rest as UserSearch}
                            setOpened={setOpened}
                          />
                        </div>
                      ) : null;
                    }) : <NoSearchResults />
                  ) : (
                    <NoSearchResults />
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

const NoSearchResults = () => <div className="flex h-64 items-center justify-center">
  <p className="text-center text-base font-semibold text-gray-700 dark:text-text-secondary md:text-xl">
    Whoops! No results found. Try a new keyword or phrase.
  </p>
</div>

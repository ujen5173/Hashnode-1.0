import React, { useState, type FC } from "react";
import { Search } from "~/svgs";
import { api } from "~/utils/api";
import SearchArticle from "./SearchArticle";
import { useDebouncedCallback } from "use-debounce";
import { type SearchResults } from "~/types";
import Image from "next/image";
import Link from "next/link";

const SearchBody: FC<{
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setOpened }) => {
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

  const [refetching, setRefetching] = useState(false);

  async function search(criteria: string): Promise<SearchResults> {
    let response;
    if (criteria.trim().length > 0) {
      setRefetching(true);
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
      setRefetching(true);

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
    <div className="absolute inset-0 flex items-start justify-center py-16">
      <div
        onClick={() => setOpened(false)}
        className="fixed inset-0 z-40 bg-gray-700 bg-opacity-50 backdrop-blur"
      />

      <div className="z-50 w-6/12 overflow-hidden rounded-xl border border-border-light bg-white shadow-lg dark:border-border dark:bg-primary">
        <header className="p-4">
          <div className="relative hidden flex-1 lg:block">
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
                void debounced(e.target.value);
              }}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md border border-border-light bg-gray-200 px-2 py-1 text-gray-700 dark:border-border dark:bg-primary-light dark:text-text-primary">
              /
            </span>
          </div>
        </header>
        <div className="">
          {query.trim() !== "" && (
            <ul className="flex items-center gap-2 border-b border-border-light px-4 dark:border-border">
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
          )}
          <section>
            {query.trim() === "" ? (
              <div className="flex min-h-[10rem] items-center justify-center p-4">
                <h1 className="flex items-center gap-2 text-center text-base text-gray-700 dark:text-text-secondary">
                  <Search className="h-4 w-4 stroke-gray-700 dark:stroke-text-primary" />
                  Search for tags, people, articles, and more
                </h1>
              </div>
            ) : (
              <div className="">
                {refetching ? (
                  <div className="h-64 flex-1 ">
                    <div className="border-b border-border-light p-4 last:border-0 dark:border-border">
                      <div className="loading mb-1 h-4 w-8/12 rounded-full bg-border-light dark:bg-border" />
                      <div className="loading mb-1 h-4 w-6/12 rounded-full bg-border-light dark:bg-border" />
                      <div className="loading mb-1 h-4 w-3/12 rounded-full bg-border-light dark:bg-border" />
                    </div>
                    <div className="border-b border-border-light p-4 last:border-0 dark:border-border">
                      <div className="loading mb-1 h-4 w-8/12 rounded-full bg-border-light dark:bg-border" />
                      <div className="loading mb-1 h-4 w-6/12 rounded-full bg-border-light dark:bg-border" />
                      <div className="loading mb-1 h-4 w-3/12 rounded-full bg-border-light dark:bg-border" />
                    </div>
                  </div>
                ) : type === "USERS" && data.users && data.users.length > 0 ? (
                  <ul className="scroll-area max-h-[20rem] overflow-auto">
                    {data.users.map((user) => (
                      <div
                        key={user.id}
                        className="border-b border-border-light dark:border-border"
                      >
                        <UserSearchCard key={user.id} user={user} />
                      </div>
                    ))}
                  </ul>
                ) : type === "TAGS" && data.tags && data.tags.length > 0 ? (
                  <ul className="scroll-area max-h-[20rem] overflow-auto">
                    {data.tags.map((tag) => (
                      <div
                        key={tag.id}
                        className="border-b border-border-light dark:border-border"
                      >
                        <TagsSearchCard key={tag.id} tag={tag} />
                      </div>
                    ))}
                  </ul>
                ) : data.articles && data.articles.length > 0 ? (
                  <ul className="scroll-area max-h-[20rem] overflow-auto">
                    {data.articles.map((article) => (
                      <div
                        key={article.id}
                        className="border-b border-border-light dark:border-border"
                      >
                        <SearchArticle data={article} />
                      </div>
                    ))}
                  </ul>
                ) : (
                  <div className="flex h-64 items-center justify-center">
                    <p className="text-xl font-semibold text-gray-700 dark:text-text-secondary">
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
};

export default SearchBody;

const UserSearchCard: FC<{
  user: {
    id: string;
    name: string;
    username: string;
    profile: string;
    followersCount: number;
  };
}> = ({ user }) => {
  return (
    <div className="flex items-center justify-between  p-4">
      <div className="flex items-center gap-4">
        <Image
          width={50}
          height={50}
          src={user.profile}
          alt={user.name}
          className="h-12 w-12 rounded-full"
        />
        <div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-text-secondary">
            {user.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-text-primary">
            {user.username}
          </p>
        </div>
      </div>
      <button className="btn-filled">Follow</button>
    </div>
  );
};

const TagsSearchCard: FC<{
  tag: {
    id: string;
    name: string;
    slug: string;
    followersCount: number;
    articlesCount: number;
  };
}> = ({ tag }) => {
  return (
    <li key={tag.id}>
      <Link
        href={`/tag/${tag.slug}`}
        className="tag flex items-center justify-between border-b border-border-light p-4 dark:border-border"
      >
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-700 dark:text-text-primary">
            #{tag.slug}
          </h1>
          <p className="text-sm text-gray-500 dark:text-text-primary">
            {tag.articlesCount} posts
          </p>
        </div>
        <button className="btn-filled">Follow</button>
      </Link>
    </li>
  );
};

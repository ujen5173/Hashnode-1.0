import Link from "next/link";
import React, { type FC, useContext } from "react";
import { C, type ContextValue } from "~/utils/context";

const ExploreMainComponentNavigation: FC<{
  slug: string | string[] | undefined;
}> = ({ slug }) => {
  const { user } = useContext(C) as ContextValue;
  return (
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
  );
};

export default ExploreMainComponentNavigation;

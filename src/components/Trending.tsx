import React, { useContext } from "react";
import TrendingCard from "./Cards/TrendingCard";
import { C, type ContextValue } from "~/utils/context";

const Trending = () => {
  const { trendingArticles } = useContext(C) as ContextValue;
  return (
    <div className="my-4 rounded-md border border-border-light bg-white p-4 dark:border-border dark:bg-primary">
      <header className="flex items-center justify-between border-b border-border-light py-2 dark:border-border">
        <h1 className="text-xl font-bold text-gray-700 dark:text-text-secondary">
          Trending
        </h1>
        <button
          aria-label="view all the trending articles"
          role="button"
          className="btn-outline-small"
        >
          See all
        </button>
      </header>
      <div>
        {trendingArticles.data?.map((article) => {
          return <TrendingCard article={article} key={article.id} />;
        })}
      </div>
    </div>
  );
};

export default Trending;

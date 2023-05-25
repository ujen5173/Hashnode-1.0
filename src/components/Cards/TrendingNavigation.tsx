import React, { type FC } from "react";
import Link from "next/link";

interface Props {
  item: {
    name: string;
    href: string;
    latest_articles: number;
  };
}

const TrendingNavigation: FC<Props> = ({ item }) => {
  return (
    <Link
      aria-label="Read more on this article"
      href={item.href}
      title={item.name}
    >
      <div className="flex cursor-pointer select-none items-center justify-between rounded-md p-1 text-sm hover:bg-border-light dark:bg-primary dark:hover:bg-primary-light">
        <span className="max-height-one text-sm font-medium text-gray-500 dark:text-text-secondary">
          {item.name}
        </span>
        <div className="rounded-full border bg-light-bg px-2 py-[3px] text-xs font-bold text-gray-500 dark:border-border dark:bg-primary-light dark:text-text-secondary">
          {item.latest_articles}+
        </div>
      </div>
    </Link>
  );
};

export default TrendingNavigation;

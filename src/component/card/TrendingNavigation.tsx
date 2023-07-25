import Link from "next/link";
import { type FC } from "react";

interface Props {
  item: {
    articlesCount: number;
    id: string;
    name: string;
    slug: string;
  };
}

const TrendingNavigation: FC<Props> = ({ item }) => {
  return (
    <Link
      aria-label="Read more on this article"
      href={`/tag/${item.slug}`}
      title={item.name}
    >
      <div className="flex cursor-pointer select-none items-center justify-between rounded-md p-1 text-sm hover:bg-gray-100 dark:bg-primary dark:hover:bg-primary-light">
        <span className="text-limit-horizontal text-sm font-medium text-gray-500 dark:text-text-secondary">
          {item.name}
        </span>

        <div className="rounded-full border bg-light-bg px-2 py-[3px] text-xs font-bold text-gray-500 dark:border-border dark:bg-primary-light dark:text-text-secondary">
          {item.articlesCount}+
        </div>
      </div>
    </Link>
  );
};

export default TrendingNavigation;

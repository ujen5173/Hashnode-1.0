import Link from "next/link";
import { type FC } from "react";

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

export default TagsSearchCard;

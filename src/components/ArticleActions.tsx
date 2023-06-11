import { type FC, useContext } from "react";
import {
  Heart,
  Comment,
  BookmarkArticle,
  Share,
  Dots,
  Bookmarkplus,
} from "~/svgs";
import Bookmarked from "~/svgs/Bookmarked";
import type { ArticleCard } from "~/types";
import { C, type ContextValue } from "~/utils/context";

const ArticleActions: FC<{ article: ArticleCard }> = ({ article }) => {
  const { bookmarks, updateBookmark } = useContext(C) as ContextValue;

  return (
    <div className="sticky bottom-4 mx-auto flex w-11/12 items-center justify-between gap-2 rounded-full border border-border-light bg-light-bg px-4 py-1 dark:border-border dark:bg-primary-light sm:w-max md:left-1/2 md:-translate-x-1/2">
      <button
        aria-label="icon"
        role="button"
        className="flex items-center gap-2 rounded-full p-2 text-gray-700 hover:bg-text-secondary dark:text-text-secondary dark:hover:bg-border"
      >
        <div className="flex items-center justify-center gap-2">
          <Heart className="h-5 w-5 fill-none stroke-border dark:stroke-text-primary md:h-6 md:w-6" />
        </div>
        <span>{article.likes.length}</span>
      </button>
      <div className="h-6 w-[2px] bg-border-light dark:bg-border"></div>
      <button
        aria-label="icon"
        role="button"
        className="flex items-center gap-2 rounded-full p-2 text-gray-700 hover:bg-text-secondary dark:text-text-secondary dark:hover:bg-border"
      >
        <div className="flex items-center justify-center gap-2">
          <Comment className="h-5 w-5 fill-none stroke-border dark:stroke-text-primary md:h-6 md:w-6" />
        </div>
        <span>{article.comments.length}</span>
      </button>
      <div className="h-6 w-[2px] bg-border-light dark:bg-border"></div>
      <button
        aria-label="icon"
        onClick={() => updateBookmark(article.id)}
        role="button"
        className={`btn-icon-large flex items-center justify-center`}
      >
        {bookmarks.find((bookmark) => bookmark.id === article.id) ? (
          <Bookmarkplus className="h-5 w-5 fill-gray-700 dark:fill-text-primary" />
        ) : (
          <Bookmarked className="h-5 w-5" />
        )}
      </button>

      <div className="h-6 w-[2px] bg-border-light dark:bg-border"></div>
      <button
        aria-label="icon"
        role="button"
        className="flex items-center gap-2 rounded-full p-2 text-gray-700 hover:bg-text-secondary dark:text-text-secondary dark:hover:bg-border"
      >
        <div className="flex items-center justify-center gap-2">
          <Share className="h-5 w-5 fill-none stroke-border dark:stroke-text-primary md:h-6 md:w-6" />
        </div>
      </button>
      <div className="h-6 w-[2px] bg-border-light dark:bg-border"></div>
      <button
        aria-label="icon"
        role="button"
        className="flex items-center gap-2 rounded-full p-2 text-gray-700 hover:bg-text-secondary dark:text-text-secondary dark:hover:bg-border"
      >
        <div className="flex items-center justify-center gap-2">
          <Dots className="h-5 w-5 stroke-border dark:stroke-text-primary md:h-6 md:w-6" />
        </div>
      </button>
    </div>
  );
};

export default ArticleActions;

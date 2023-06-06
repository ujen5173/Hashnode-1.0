import { type FC, useContext } from "react";
import {
  Heart,
  Comment,
  BookmarkArticle,
  Share,
  Dots,
  Bookmarkplus,
} from "~/svgs";
import type { ArticleCard } from "~/types";
import { C, type ContextValue } from "~/utils/context";

const ArticleActions: FC<{ article: ArticleCard }> = ({ article }) => {
  const { bookmarks, updateBookmark } = useContext(C) as ContextValue;

  return (
    <div className="sticky bottom-0 left-0 flex w-full items-center justify-between gap-2 rounded-md border border-border-light bg-light-bg px-4 py-1 dark:border-border dark:bg-primary-light md:bottom-10 md:left-1/2 md:w-max md:-translate-x-1/2 md:rounded-full">
      <button
        aria-label="icon"
        role="button"
        className="flex items-center gap-2 rounded-full p-2 text-gray-700 hover:bg-text-secondary dark:text-text-secondary dark:hover:bg-border"
      >
        <div className="flex items-center justify-center gap-2">
          <Heart className="h-7 w-7 fill-none stroke-primary-light dark:stroke-white" />
        </div>
        <span>{article.likes.length}</span>
      </button>
      <button
        aria-label="icon"
        role="button"
        className="flex items-center gap-2 rounded-full p-2 text-gray-700 hover:bg-text-secondary dark:text-text-secondary dark:hover:bg-border"
      >
        <div className="flex items-center justify-center gap-2">
          <Comment className="h-7 w-7 fill-none stroke-primary-light dark:stroke-white" />
        </div>
        <span>{article.comments.length}</span>
      </button>
      <button
        aria-label="icon"
        onClick={() => updateBookmark(article.id)}
        role="button"
        className="btn-icon-small flex items-center justify-center"
      >
        {bookmarks.find((bookmark) => bookmark.id === article.id) ? (
          <BookmarkArticle className="h-7 w-7 fill-gray-700 dark:fill-text-primary" />
        ) : (
          <Bookmarkplus className="h-7 w-7 fill-gray-700 dark:fill-text-primary" />
        )}
      </button>
      <button
        aria-label="icon"
        role="button"
        className="hidden items-center gap-2 rounded-full p-2 text-gray-700 hover:bg-text-secondary dark:text-text-secondary dark:hover:bg-border md:flex"
      >
        <div className="flex items-center justify-center gap-2">
          <Share className="h-6 w-6 fill-none stroke-primary-light dark:stroke-white" />
        </div>
      </button>
      <button
        aria-label="icon"
        role="button"
        className="hidden items-center gap-2 rounded-full p-2 text-gray-700 hover:bg-text-secondary dark:text-text-secondary dark:hover:bg-border md:flex"
      >
        <div className="flex items-center justify-center gap-2">
          <Dots className="h-7 w-7 stroke-primary-light dark:stroke-white" />
        </div>
      </button>
    </div>
  );
};

export default ArticleActions;

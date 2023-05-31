import { Heart, Comment, BookmarkArticle, Share, Dots } from "~/svgs";

const ArticleActions = () => {
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
        <span>1.2k</span>
      </button>
      <button
        aria-label="icon"
        role="button"
        className="flex items-center gap-2 rounded-full p-2 text-gray-700 hover:bg-text-secondary dark:text-text-secondary dark:hover:bg-border"
      >
        <div className="flex items-center justify-center gap-2">
          <Comment className="h-7 w-7 fill-none stroke-primary-light dark:stroke-white" />
        </div>
        <span>1.2k</span>
      </button>
      <button
        aria-label="icon"
        role="button"
        className="flex items-center gap-2 rounded-full p-2 text-gray-700 hover:bg-text-secondary dark:text-text-secondary dark:hover:bg-border"
      >
        <div className="flex items-center justify-center gap-2">
          <BookmarkArticle className="h-5 w-5 fill-none stroke-primary-light dark:stroke-white" />
        </div>
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

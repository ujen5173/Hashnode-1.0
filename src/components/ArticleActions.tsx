import Heart from "~/svgs/Heart";
import Comment from "~/svgs/Comment";
import BookmarkArticle from "~/svgs/BookmarkArticle";
import Share from "~/svgs/Share";
import Dots from "~/svgs/Dots";

const ArticleActions = () => {
  return (
    <div className="sticky bottom-10 left-1/2 flex w-max -translate-x-1/2 items-center gap-2 rounded-full border border-border-light bg-primary-light px-4 py-1 dark:border-border">
      <button
        aria-label="icon"
        role="button"
        className="flex items-center gap-2 rounded-full p-2 text-gray-700 hover:bg-border dark:text-text-secondary"
      >
        <div className="flex items-center justify-center gap-2">
          <Heart className="h-7 w-7 fill-none stroke-white" />
        </div>
        <span>1.2k</span>
      </button>
      <button
        aria-label="icon"
        role="button"
        className="flex items-center gap-2 rounded-full p-2 text-gray-700 hover:bg-border dark:text-text-secondary"
      >
        <div className="flex items-center justify-center gap-2">
          <Comment className="h-7 w-7 fill-none stroke-white" />
        </div>
        <span>1.2k</span>
      </button>
      <button
        aria-label="icon"
        role="button"
        className="flex items-center gap-2 rounded-full p-2 text-gray-700 hover:bg-border dark:text-text-secondary"
      >
        <div className="flex items-center justify-center gap-2">
          <BookmarkArticle className="h-5 w-5 fill-none stroke-white" />
        </div>
      </button>
      <button
        aria-label="icon"
        role="button"
        className="flex items-center gap-2 rounded-full p-2 text-gray-700 hover:bg-border dark:text-text-secondary"
      >
        <div className="flex items-center justify-center gap-2">
          <Share className="h-6 w-6 stroke-white" />
        </div>
      </button>
      <button
        aria-label="icon"
        role="button"
        className="flex items-center gap-2 rounded-full p-2 text-gray-700 hover:bg-border dark:text-text-secondary"
      >
        <div className="flex items-center justify-center gap-2">
          <Dots className="h-7 w-7 stroke-white" />
        </div>
      </button>
    </div>
  );
};

export default ArticleActions;

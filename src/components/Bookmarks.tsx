import { ArticleCard } from "~/types";
import { bookmarks } from "~/utils/constants";
import BookmarkCard from "./Cards/BookmarkCard";

export interface BookmarkInterface {
  id: string;
  title: string;
  read_time: number;
  user: string;
}

const Bookmarks = () => {
  return (
    <div className="my-4 rounded-md border border-border-light bg-white p-4 dark:border-border dark:bg-primary">
      <header className="flex items-center justify-between border-b border-border-light py-2 dark:border-border">
        <h1 className="text-xl font-bold text-gray-700 dark:text-text-secondary">
          Bookmarks ({bookmarks.length})
        </h1>
        <button
          aria-label="view all the saved bookmarks"
          role="button"
          className="btn-outline-small"
        >
          See all
        </button>
      </header>

      <div>
        {bookmarks.map((bookmark: ArticleCard) => (
          <BookmarkCard key={bookmark.id} bookmark={bookmark} />
        ))}
      </div>
    </div>
  );
};

export default Bookmarks;

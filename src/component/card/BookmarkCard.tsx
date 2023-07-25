import Link from "next/link";
import { type BookmarkInterface } from "past/components/Bookmarks";

const BookmarkCard = ({ bookmark }: { bookmark: BookmarkInterface }) => {
  return (
    <div className="border-b border-border-light py-2 last:border-0 dark:border-border">
      <Link href={`/u/@${bookmark.user.username}/${bookmark.slug}`}>
        <h1 className="max-height-two mb-2 text-base font-semibold text-gray-600 dark:text-white">
          {bookmark.title}
        </h1>
      </Link>

      <div className="flex gap-2 text-sm text-gray-500 dark:text-text-secondary">
        <Link href={`/u/@${bookmark.user.username}`}>
          <span>{bookmark.user.name}</span>
        </Link>

        <span>-</span>

        <span>{bookmark.read_time} min read</span>
      </div>
    </div>
  );
};

export default BookmarkCard;

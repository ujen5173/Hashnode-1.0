import Image from "next/image";
import Link from "next/link";
import { useContext, type FC } from "react";
import removeMd from "remove-markdown";
import { Book, Bookmarkplus, Like, Multicomment } from "~/svgs";
import Bookmarked from "~/svgs/Bookmarked";
import { ArticleCard } from "~/types";
import { C, type ContextValue } from "~/utils/context";
import { formatDate, limitTags, limitText } from "~/utils/miniFunctions";

const ArticleCard: FC<{ card: ArticleCard }> = ({ card }) => {
  const { bookmarks, updateBookmark } = useContext(C) as ContextValue;

  return (
    <div className="w-full p-4">
      <header className="mb-4 flex items-center gap-2">
        <Link href={`/u/@${card.user.username}`}>
          <div>
            <Image
              src={card.user.profile || ""}
              width={60}
              height={60}
              alt="User Profile"
              className="h-10 w-10 rounded-full object-cover"
            />
          </div>
        </Link>
        <div className="flex-1">
          <Link href={`/u/@${card.user.username}`}>
            <h1 className="text-base font-semibold text-gray-900 dark:text-text-secondary">
              {card.user.name}
            </h1>
          </Link>
          <p className="flex items-center gap-1 text-sm font-normal text-gray-500 dark:text-text-primary">
            <Link href={`/u/@${card.user.username}`}>
              @{card.user.username}
            </Link>
            <span className="text-gray-900 dark:text-text-primary">·</span>
            <span>{formatDate(card.createdAt)}</span>
          </p>
        </div>
      </header>

      <main className="">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-[2]">
            <Link href={`/u/@${card.user.username}/${card.slug}`}>
              <h1 className="mb-2 text-xl font-semibold text-gray-700 dark:text-text-secondary">
                {card.title}
              </h1>
            </Link>

            <Link href={`/u/@${card.user.username}/${card.slug}`}>
              <div className="mb-4 flex items-center gap-2">
                <Book className="h-4 w-4 fill-secondary" />
                <p className="text-sm font-medium text-gray-700 dark:text-text-primary">
                  {card.read_time} min read
                </p>
              </div>
            </Link>

            <Link href={`/u/@${card.user.username}/${card.slug}`}>
              <p
                className={`${
                  card.cover_image ? "max-height-4" : "max-height-3 mb-3 w-full"
                } break-words break-keep text-sm text-gray-500 dark:text-text-primary`}
              >
                {limitText(removeMd(card.content), 350)}
              </p>
            </Link>
          </div>

          {card.cover_image && (
            <Link
              className="flex-1"
              href={`/@${card.user.username}/${card.slug}`}
            >
              <div>
                <Image
                  src={card.cover_image || "/imagePlaceholder-removebg.png"}
                  alt={`${card.title} image not found!`}
                  width={500}
                  height={300}
                  className="w-full rounded-md bg-white object-cover text-gray-700 dark:bg-primary-light dark:text-text-secondary"
                />
              </div>
            </Link>
          )}
        </div>

        <div className="mt-2 flex flex-col-reverse justify-between gap-2 md:flex-row">
          <div className="flex gap-2">
            <button
              aria-label="icon"
              onClick={() => updateBookmark(card.id)}
              role="button"
              className={`${
                bookmarks.find((bookmark) => bookmark.id === card.id)
                  ? "bg-secondary bg-opacity-20"
                  : ""
              } btn-icon-large flex w-max items-center justify-center`}
            >
              {bookmarks.find((bookmark) => bookmark.id === card.id) ? (
                <Bookmarked className="h-5 w-5" />
              ) : (
                <Bookmarkplus className="h-5 w-5 fill-gray-700 dark:fill-text-primary" />
              )}
            </button>

            <div className="flex flex-wrap items-center gap-2">
              {limitTags(card.tags, 13).map((tag, index) =>
                tag.id ? (
                  <Link href={`/tag/${tag.slug}`} key={index}>
                    <button
                      aria-label="tag"
                      key={tag.id}
                      className="rounded-md border border-border-light px-2 py-1 text-xs font-medium text-gray-700 hover:bg-border-light dark:border-border dark:text-text-primary dark:hover:bg-primary-light"
                    >
                      {tag.name}
                    </button>
                  </Link>
                ) : (
                  <button
                    aria-label="tag"
                    key={index}
                    className="rounded-md border border-border-light px-2 py-1 text-xs font-medium text-gray-700 hover:bg-border-light dark:border-border dark:text-text-primary dark:hover:bg-primary-light"
                  >
                    {tag.name}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="flex items-center">
            <button className="flex items-center gap-1 rounded-full bg-transparent px-3 py-2 hover:bg-light-bg dark:hover:bg-primary-light">
              <Like className="h-5 w-5 fill-gray-700 dark:fill-text-primary" />
              <span className="text-sm font-medium text-gray-700 dark:text-text-primary">
                {card.likesCount}
              </span>
            </button>
            {!card.disabledComments && (
              <div className="flex w-max flex-1 items-center justify-between gap-2">
                <button className="flex items-center gap-1 rounded-full bg-transparent px-3 py-2 hover:bg-light-bg dark:hover:bg-primary-light">
                  <Multicomment className="h-5 w-5 fill-gray-700 dark:fill-text-primary" />
                  <span className="text-sm font-medium text-gray-700 dark:text-text-primary">
                    {card.commentsCount}
                  </span>
                </button>
                {card.commonUsers.length > 0 && (
                  <div className="flex flex-1">
                    {card.commonUsers.map((user, index) => (
                      <button
                        className={`relative -ml-2 first:ml-0`}
                        style={{
                          zIndex: card.commonUsers.length - index,
                        }}
                        key={user.id}
                      >
                        <Image
                          src={user.profile}
                          alt="user"
                          width={20}
                          height={20}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ArticleCard;

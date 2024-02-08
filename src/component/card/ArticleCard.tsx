import { Tooltip } from "@mantine/core";
import {
  Book,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  MessageCircle,
  ThumbsUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useContext, type FC } from "react";
import removeMd from "remove-markdown";
import { ArticleCard } from "~/types";
import { C } from "~/utils/context";
import { formatDate, limitTags, limitText } from "~/utils/miniFunctions";

const ArticleCard: FC<{ card: ArticleCard }> = ({ card }) => {
  const { bookmarks, updateBookmark } = useContext(C)!;

  return (
    <div className="w-full p-4">
      <header className="mb-4 flex gap-2">
        <Link href={`/u/@${card.user?.username}`}>
          <div>
            <Image
              src={card.user?.image ?? "/static/default_user.avif"}
              width={60}
              height={60}
              alt="User image"
              className="mt-1 h-10 w-10 rounded-full object-cover"
            />
          </div>
        </Link>

        <div className="flex-1">
          <div className="itmes-center flex gap-2">
            <Link href={`/u/@${card.user?.username}`}>
              <h1 className="text-sm font-semibold text-gray-900 dark:text-text-secondary">
                {card.user?.name}
              </h1>
            </Link>

            {card.user?.stripeSubscriptionStatus === "active" && (
              <Tooltip
                label="Hashnode Clone Pro User"
                position="bottom"
                style={{
                  fontSize: "0.8rem",
                  fontWeight: "400",
                  letterSpacing: "0.5px",
                }}
              >
                <span className="rounded-md border border-border-light bg-light-bg px-1 py-0 text-xs font-medium leading-5 tracking-wider text-gray-700 dark:border-border dark:bg-primary-light dark:text-text-secondary">
                  PRO
                </span>
              </Tooltip>
            )}
          </div>

          {card.user?.handle && (
            <p className="flex gap-1 text-sm font-normal text-gray-500 dark:text-text-primary">
              <Link
                className="hidden xs:block"
                href={`/dev/@${card.user?.handle?.handle}`}
              >
                <span>@{card.user?.handle?.handle}</span>
              </Link>

              <span className="hidden text-gray-900 dark:text-text-primary xs:block">
                ·
              </span>

              <span>{formatDate(card.createdAt)}</span>
            </p>
          )}
        </div>
      </header>

      <main className="">
        <div className="flex flex-col justify-between gap-4 md:flex-row">
          <div className="flex-[2]">
            <Link href={`/u/@${card.user?.username}/${card.slug}`}>
              <h1 className="max-height-three mb-2 text-xl font-semibold text-gray-700 dark:text-text-secondary">
                {card.title}
              </h1>
            </Link>

            <Link href={`/u/@${card.user?.username}/${card.slug}`}>
              <div className="mb-4 flex items-center gap-2">
                <BookOpen className="h-4 w-4 stroke-secondary" />
                <p className="text-sm font-medium text-gray-700 dark:text-text-primary">
                  {card.read_time} min read
                </p>
              </div>
            </Link>

            <Link href={`/u/@${card.user?.username}/${card.slug}`}>
              <p
                className={`${
                  card.cover_image
                    ? "max-height-four"
                    : "max-height-three mb-0 w-full md:mb-3"
                } break-words text-sm text-gray-500 dark:text-text-primary`}
              >
                {removeMd(card.subContent ?? "")}
              </p>
            </Link>
          </div>

          {card.cover_image && (
            <Link
              className="flex-1"
              href={`/@${card.user?.username}/${card.slug}`}
            >
              <div>
                <Image
                  src={
                    card.cover_image ?? "/static/imagePlaceholder-removebg.png"
                  }
                  alt={`${card.title} image not found!`}
                  width={500}
                  height={300}
                  className="max-h-40  w-full rounded-md bg-white object-cover text-gray-700 dark:bg-primary-light dark:text-text-secondary"
                />
              </div>
            </Link>
          )}
        </div>

        <div className="mt-2 flex flex-col-reverse justify-between gap-2 md:flex-row">
          <div className="flex items-center gap-2">
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
                <BookmarkCheck className="h-5 w-5 stroke-gray-700 dark:stroke-text-primary" />
              ) : (
                <Bookmark className="h-5 w-5 stroke-gray-700 dark:stroke-text-primary" />
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
                ),
              )}
            </div>
          </div>

          <ArticleCardFooter card={card} />
        </div>
      </main>
    </div>
  );
};

export default ArticleCard;

const ArticleCardFooter: FC<{ card: ArticleCard }> = ({ card }) => {
  return (
    <div className="flex items-center">
      {card.readCount > 0 && (
        <span className="mr-2 hidden rounded-md bg-gray-200 px-2 py-1 text-xs text-gray-500 dark:bg-primary-light dark:text-text-primary md:inline-flex">
          {card.readCount} reads
        </span>
      )}

      {card.series && (
        <Link
          href={`/dev/@${card.user?.handle?.handle ?? ""}/series/${card.series.slug}`}
        >
          <p className="mr-2 flex items-center gap-1 rounded-full bg-secondary bg-opacity-10 px-2 py-1">
            <span className="text-gray-900 dark:text-text-primary">
              <Book className="h-3 w-3 stroke-secondary" />
            </span>
            <span className="max-height-one text-xs font-semibold text-secondary">
              {limitText(card.series.title, 20)}
            </span>
          </p>
        </Link>
      )}

      <button className="flex items-center gap-1 rounded-full bg-transparent px-3 py-2 hover:bg-light-bg dark:hover:bg-primary-light">
        <ThumbsUp className="h-5 w-5 stroke-gray-700 dark:stroke-text-primary" />
        <span className="text-sm font-medium text-gray-700 dark:text-text-primary">
          {card.likesCount}
        </span>
      </button>

      {!card.disabledComments && (
        <div className="flex w-max flex-1 items-center justify-between gap-2">
          <button className="flex items-center gap-1 rounded-full bg-transparent px-3 py-2 hover:bg-light-bg dark:hover:bg-primary-light">
            <MessageCircle className="h-5 w-5 stroke-gray-700 dark:stroke-text-primary" />
            <span className="text-sm font-medium text-gray-700 dark:text-text-primary">
              {card.commentsCount}
            </span>
          </button>

          {/* {card.commonUsers.length > 0 && (
            <div className="hidden flex-1 sm:flex">
              {card.commonUsers.map((user, index) => (
                <button
                  className={`relative -ml-2 first:ml-0`}
                  style={{
                    zIndex: card.commonUsers.length - index,
                  }}
                  key={user.id}
                >
                  <Image
                    src={user.image ?? "/static/default_user.avif"}
                    alt="user"
                    width={20}
                    height={20}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                </button>
              ))}
            </div>
          )} */}
        </div>
      )}
    </div>
  );
};

import Image from "next/image";
import React, { useContext, type FC } from "react";
import { Bookmarkplus, Book, BookmarkArticle } from "~/svgs";
import { formatDate, limitTags, limitText } from "~/utils/miniFunctions";
import Link from "next/link";
import type { Article } from "@prisma/client";
import { C, type ContextValue } from "~/utils/context";
import Bookmarked from "~/svgs/Bookmarked";

interface Card {
  card: Article & {
    user: {
      id: string;
      name: string;
      username: string;
      profile: string;
    };
    tags: {
      id: string;
      name: string;
      slug: string;
    }[];
  };
}

const ArticleCard: FC<Card> = ({ card }) => {
  const { bookmarks, updateBookmark } = useContext(C) as ContextValue;

  return (
    <div className="border-b border-border-light bg-white p-4 last:border-0 dark:border-border dark:bg-primary">
      <div className="">
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
              <h1 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {card.user.name}
              </h1>
            </Link>
            <p className="flex items-center gap-2 text-sm font-normal text-gray-500 dark:text-text-primary">
              <Link
                className="hidden sm:block"
                href={`/u/@${card.user.username}`}
              >
                {card.user.username}.hashnode.dev ·{" "}
              </Link>
              <span>{formatDate(card.createdAt)}</span>
            </p>
          </div>
        </header>

        <main className="flex flex-col gap-6 md:flex-row">
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
                  {card.read_time}
                </p>
              </div>
            </Link>

            <Link
              className="mb-3"
              href={`/u/@${card.user.username}/${card.slug}`}
            >
              <p
                className={`${
                  card.cover_image ? "max-height-4" : "max-height-3 w-11/12"
                } break-all text-sm text-gray-500 dark:text-text-primary`}
              >
                {limitText(card.content, 350)}
              </p>
            </Link>

            <div className="mt-2 flex gap-2">
              <button
                aria-label="icon"
                onClick={() => updateBookmark(card.id)}
                role="button"
                className={`${
                  bookmarks.find((bookmark) => bookmark.id === card.id)
                    ? "bg-secondary bg-opacity-20"
                    : ""
                } btn-icon-large flex items-center justify-center`}
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
          </div>

          {card.cover_image && (
            <Link
              className="flex-1"
              href={`/@${card.user.username}/${card.slug}`}
            >
              <div>
                <Image
                  src={card.cover_image}
                  alt={`${card.title} image not found!`}
                  width={500}
                  height={300}
                  className="w-full rounded-md object-cover text-gray-700 dark:text-text-secondary"
                />
              </div>
            </Link>
          )}
        </main>
      </div>
    </div>
  );
};

export default ArticleCard;

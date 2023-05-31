import Image from "next/image";
import React, { type FC } from "react";
import { Bookmarkplus, Book } from "~/svgs";
import { limitTags } from "~/utils/miniFunctions";
import Link from "next/link";

interface Card {
  card: {
    id: string;
    title: string;
    slug: string;
    cover_image?: string;
    user: {
      id: string;
      name: string;
      username: string;
      profile?: string;
    };
    content: string;
    read_time: number;
    tags: string[];
    subtitle?: string;
    likes: string[];
    commentsCount: number;
    createdAt: Date;
    updatedAt: Date;
  };
}

const ArticleCard: FC<Card> = ({ card }) => {
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
                className="h-12 w-12 rounded-full object-cover"
              />
            </div>
          </Link>
          <div className="flex-1">
            <Link href={`/u/@${card.user.username}`}>
              <h1 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {card.user.name}
              </h1>
            </Link>
            <p className="text-base font-normal text-gray-500 dark:text-text-primary">
              <Link href={`/u/@${card.user.username}`}>
                {card.user.username}.hashnode.dev ·{" "}
              </Link>
              {new Date(card.createdAt).toDateString()}
            </p>
          </div>
        </header>

        <main className="flex flex-col gap-6 lg:flex-row">
          <div className="flex-[2]">
            <Link href={`/u/@${card.user.username}/${card.slug}`}>
              <h1 className="mb-2 text-xl font-semibold text-gray-700 dark:text-text-secondary">
                {card.title}
              </h1>
            </Link>

            <Link href={`/u/@${card.user.username}`}>
              <div className="mb-2 flex items-center gap-2">
                <Book className="h-4 w-4 fill-secondary" />
                <p className="text-sm font-medium text-gray-700 dark:text-text-primary">
                  {card.read_time} min read
                </p>
              </div>
            </Link>

            <Link href={`/u/@${card.user.username}/${card.slug}`}>
              <p
                className={`${
                  card.cover_image ? "max-height-4" : "max-height-3 w-11/12"
                } mb-5 text-sm text-gray-500 dark:text-text-primary`}
              >
                {card.content}
              </p>
            </Link>

            <div className="mt-2 flex gap-2">
              <button
                aria-label="icon"
                role="button"
                className="btn-icon-small flex items-center justify-center"
              >
                <Bookmarkplus className="h-4 w-4 fill-gray-700 dark:fill-text-primary" />
              </button>

              <div className="flex flex-wrap items-center gap-2">
                {limitTags(card.tags, 13).map((tag, index) => (
                  <Link href={`/tag/${tag}`} key={index}>
                    <button
                      aria-label="tag"
                      key={tag}
                      className="rounded-md border border-border-light px-2 py-1 text-xs font-medium text-gray-700 dark:border-border dark:text-text-primary"
                    >
                      {tag}
                    </button>
                  </Link>
                ))}
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
                  alt=""
                  width={500}
                  height={300}
                  className="w-full rounded-md object-cover"
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

import Image from "next/image";
import Link from "next/link";
import { useContext, type FC } from "react";
import removeMd from "remove-markdown";

import { BookOpen } from "lucide-react";
import { C } from "~/utils/context";
import { formatDate } from "~/utils/miniFunctions";
import { type CardProps } from "./SimpleArticleCard";

const StackedArticleCard: FC<CardProps> = ({ article }) => {
  const { theme } = useContext(C)!;

  return (
    <div
      className="w-full border-b-0 border-border-light last:border-none dark:border-border sm:border-b sm:py-4"
      key={article.id}
    >
      <main className="">
        <div className="flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
          <div className="flex-[2]">
            <Link href={`/u/@${article.user.username}/${article.slug}`}>
              <h1 className="max-height-two mb-2 text-2xl font-semibold text-gray-700 dark:text-text-secondary">
                {article.title}
              </h1>
            </Link>

            <Link
              href={`/u/@${article.user.username}/${article.slug}`}
              className="mb-4 flex items-center gap-2"
            >
              <p className="text-sm font-medium text-gray-700 dark:text-text-primary">
                {formatDate(article.createdAt)}
              </p>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 stroke-secondary" />
                <p className="text-sm font-medium text-gray-700 dark:text-text-primary">
                  {article.read_time} min read
                </p>
              </div>
            </Link>

            <Link href={`/u/@${article.user.username}/${article.slug}`}>
              <p
                className={`${
                  article.cover_image
                    ? "max-height-four"
                    : "max-height-three mb-0 w-full md:mb-3"
                } break-words text-base text-gray-500 dark:text-text-primary`}
              >
                {removeMd(article.subContent ?? "")}
              </p>
            </Link>
          </div>

          <Link
            className="flex-1"
            href={`/u/@${article.user.username}/${article.slug}`}
          >
            <div>
              <Image
                src={
                  article.cover_image
                    ? article.cover_image
                    : theme === "light"
                      ? "/static/imagePlaceholder-light.avif"
                      : "/static/imagePlaceholder-dark.avif"
                }
                alt={`${article.title} image not found!`}
                width={500}
                height={300}
                className="max-h-40 w-full rounded-md border border-border-light bg-white object-cover text-gray-700 dark:border-border dark:bg-primary-light dark:text-text-secondary"
              />
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default StackedArticleCard;

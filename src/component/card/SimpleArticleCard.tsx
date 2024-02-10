import { BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useContext, type FC } from "react";
import removeMd from "remove-markdown";

import { C } from "~/utils/context";
import { formatDate } from "~/utils/miniFunctions";

export interface CardProps {
  type?: "main" | "group";
  article: {
    user: {
      username: string;
    };
    id: string;
    slug: string;
    title: string;
    subContent: string | null;
    cover_image: string | null;
    createdAt: Date;
    read_time: number;
  };
  perRow?: 2 | 3;
}

const SimpleArticleCard: FC<CardProps> = ({ type, article, perRow = 2 }) => {
  const { theme } = useContext(C)!;

  return (
    <div
      className={`${type === "main"
          ? "main-block"
          : type === "group"
            ? "w-full"
            : perRow === 2
              ? "w-full md:w-[calc(100%/2-0.5rem)]"
              : "w-full md:w-[calc(100%/2-0.5rem)] lg:w-[calc(100%/3-0.67rem)]"
        }`}
      key={article.id}
    >
      <Link
        className="mb-4 block"
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
            className="max-h-96 w-full rounded-md border border-border-light bg-white object-cover text-gray-700 dark:border-border dark:bg-primary-light dark:text-text-secondary"
          />
        </div>
      </Link>

      <div className="">
        <Link href={`/u/@${article.user.username}/${article.slug}`}>
          <h1 className="mb-2 text-2xl font-semibold text-gray-700 dark:text-text-secondary">
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
            className={`max-height-three break-words text-base text-gray-500 dark:text-text-primary`}
          >
            {removeMd(article.subContent ?? "")}...
          </p>
        </Link>
      </div>
    </div>
  );
};

export default SimpleArticleCard;

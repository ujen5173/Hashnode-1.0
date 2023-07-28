import Image from "next/image";
import Link from "next/link";
import { useContext, type FC } from "react";
import { Book } from "~/svgs";
import { type DataType } from "~/types";
import { C, type ContextValue } from "~/utils/context";

interface Props {
  width?: string;
  type: "main" | "group" | "non-grid";
  article: DataType;
}

const AuthorBlogArticleCard: FC<Props> = ({
  type,
  width = "w-full",
  article,
}) => {
  const { theme } = useContext(C) as ContextValue;

  return (
    <Link
      target="_blank"
      className={type === "non-grid" ? width : "main-block"}
      href={`/u/@${article.user.username}/${article.slug}`}
    >
      <div className="mb-2 flex max-h-[60%] w-full items-center justify-center overflow-hidden rounded-md border border-border-light bg-light-bg dark:border-primary-light dark:bg-primary">
        <Image
          src={
            article.cover_image ||
            (theme === "dark"
              ? "/imagePlaceholder-dark.avif"
              : "/imagePlaceholder-light.avif")
          }
          alt="Error Loading Image!"
          width={1200}
          height={1200}
          className="h-full w-auto rounded-md bg-white object-cover dark:bg-primary-light"
        />
      </div>

      <div className="py-2">
        <h1
          className={`mb-3 ${
            type === "main" ? "text-2xl" : "text-xl xl:text-2xl"
          } font-semibold text-gray-700 dark:text-text-secondary`}
        >
          {article.title}
        </h1>

        {article.subtitle && (
          <p
            className={`text-${
              type === "main" ? "lg" : "base"
            } text-gray-500 dark:text-text-primary`}
          >
            {article.subtitle}
          </p>
        )}

        <div className="mt-4 flex items-center gap-2">
          <Image
            src={article.user.profile || "/default_user.avif"}
            alt="user"
            width={30}
            height={30}
            className="h-9 w-9 rounded-full object-cover md:h-10 md:w-10"
          />
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-gray-700 dark:text-text-primary md:mb-1">
              {article.user.username}
            </h1>

            <div className="flex items-center gap-1">
              <Book className="h-5 w-5 fill-gray-500 dark:fill-text-primary" />

              <p className="text-base text-gray-500 dark:text-text-primary">
                {article.read_time} min read
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AuthorBlogArticleCard;

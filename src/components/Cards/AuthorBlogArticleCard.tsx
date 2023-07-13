import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";
import { Book } from "~/svgs";

const AuthorBlogArticleCard: FC<{
  width?: string;
  type: "main" | "group" | "non-grid";
  article: {
    id: string;
    title: string;
    slug: string;
    read_time: number;
    user: {
      profile: string;
      username: string;
    };
    subtitle?: string | null;
    cover_image?: string | null;
  };
}> = ({ type, width = "w-full", article }) => {
  return (
    <Link
      target="_blank"
      className={type === "non-grid" ? width : "main-block"}
      href={`/u/@${article.user.username}/${article.slug}`}
    >
      <div>
        <div className="mb-2 flex min-h-[50%] w-full items-center justify-center overflow-hidden rounded-md border border-border-light bg-light-bg dark:border-primary-light dark:bg-primary">
          <Image
            src={
              article.cover_image ||
              ([
                "https://cdn.hashnode.com/res/hashnode/image/stock/unsplash/UYsBCu9RP3Y/upload/0fc68f8304b034fdc2ffac6f63d58d24.jpeg?w=1600&h=840&fit=crop&crop=entropy&auto=compress,format&format=webp",
                "https://cdn.hashnode.com/res/hashnode/image/stock/unsplash/agFmImWyPso/upload/5ed248fc8629df6d8824fd0d36433368.jpeg?w=1600&h=840&fit=crop&crop=entropy&auto=compress,format&format=webp",
                "https://cdn.hashnode.com/res/hashnode/image/upload/v1688886169067/20f23ddb-3acc-46d3-b7e5-7e65eb801c3a.png?w=1600&h=840&fit=crop&crop=entropy&auto=compress,format&format=webp",
                "https://cdn.hashnode.com/res/hashnode/image/upload/v1688879073994/0fbfeb98-50d5-496b-b5fc-cb91a82b4580.png?w=1600&h=840&fit=crop&crop=entropy&auto=compress,format&format=webp",
                "/imagePlaceholder.avif",
              ][Math.floor(Math.random() * 4 + 1)] as string)
            }
            alt="Error Loading Image!"
            width={500}
            height={500}
            className="h-full w-full rounded-md"
          />
        </div>
        <div className="p-2 md:p-4">
          <h1
            className={`mb-3 ${
              type === "main" ? "text-2xl xl:text-3xl" : "text-xl xl:text-2xl"
            } font-bold text-gray-700 dark:text-text-secondary`}
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
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <h1 className="mb-1 text-lg font-semibold text-gray-700 dark:text-text-primary">
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
      </div>
    </Link>
  );
};

export default AuthorBlogArticleCard;

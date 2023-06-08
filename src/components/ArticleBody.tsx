/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable react/no-children-prop */
import Image from "next/image";
import Link from "next/link";
import { Book, Follow } from "~/svgs";
import ArticleActions from "./ArticleActions";
import type { User, ArticleCard, Tag } from "~/types";
import { formatDate } from "./../utils/miniFunctions";
import ReactMarkdown from "react-markdown";
import { type FC } from "react";

const ArticleBody: FC<{ article: ArticleCard }> = ({ article }) => {
  return (
    <main className="min-h-screen bg-white pb-12 dark:bg-primary">
      <div className="mx-auto max-w-[1200px]">
        {article?.cover_image && (
          <Image
            src={article?.cover_image || ""}
            alt={article.title}
            width={1200}
            height={800}
            className="mb-16  w-full object-cover px-4"
          />
        )}

        <section className={`${!article?.cover_image ? "py-8 md:py-16" : ""}`}>
          <div className="px-4">
            <h1 className="mb-8 text-center text-3xl font-bold leading-snug text-gray-700 dark:text-text-secondary md:mx-auto md:w-10/12 md:text-5xl md:leading-tight">
              {article.title}{" "}
            </h1>
            {article?.subtitle && (
              <h2 className="mx-auto mb-10 w-full text-center text-xl font-normal text-gray-600 dark:text-text-primary sm:w-8/12 md:text-3xl">
                {article?.subtitle}{" "}
              </h2>
            )}

            <div className="mx-auto mb-10 flex w-full flex-col items-center justify-center gap-4 md:w-fit lg:flex-row">
              <Link
                aria-label="Visit Profile"
                className="mb-10 flex items-center gap-4 lg:mb-0"
                href="/u/@test"
              >
                <Image
                  src={article.user.profile || ""}
                  alt={article.user.name}
                  width={70}
                  height={70}
                  className=" h-8 w-8 rounded-full"
                />
                <h1 className="text-xl font-semibold text-gray-700 dark:text-text-secondary">
                  {article.user.name}&rsquo;s Blog
                </h1>
              </Link>

              <div className="flex w-full items-center justify-between gap-4 lg:w-fit">
                <span className="hidden text-gray-700 lg:block lg:text-text-secondary">
                  ·
                </span>
                <h3 className="text-lg font-medium text-gray-700 dark:text-text-primary">
                  {formatDate(new Date(article.createdAt))}
                </h3>
                <span className="hidden text-gray-700 lg:block lg:text-text-secondary">
                  ·
                </span>
                <div className="flex items-center gap-2">
                  <Book className="h-5 w-5 fill-gray-700 dark:fill-text-primary" />
                  <span className="text-lg text-gray-700 dark:text-text-primary">
                    {article.read_time}
                  </span>
                </div>
              </div>
            </div>

            <div className="article mb-10 w-full break-all md:w-11/12 lg:w-10/12">
              <ReactMarkdown children={article.content} />
            </div>
          </div>

          <ArticleActions article={article} />

          <ArticleTags tags={article.tags} />

          <ArticleAuthor author={article.user} />
        </section>
      </div>
    </main>
  );
};

export default ArticleBody;

const ArticleTags = ({ tags }: { tags: Tag[] }) => {
  return (
    <div className="mx-auto my-20 flex w-full flex-wrap items-center justify-center gap-2 lg:w-8/12">
      {tags.map((tag) => (
        <Link href={`/tag/${tag.slug}`} key={tag.id}>
          <span className="block rounded-md border border-border-light bg-light-bg px-4 py-2 text-sm text-gray-700 hover:shadow-md dark:border-border dark:bg-primary-light dark:text-text-secondary dark:hover:bg-border">
            {tag.name}
          </span>
        </Link>
      ))}
    </div>
  );
};

const ArticleAuthor: FC<{ author: User }> = ({ author }) => {
  return (
    <div className="px-4">
      <div className="mx-auto my-10 w-full border-y border-border-light px-4 py-6 dark:border-border md:w-8/12">
        <div className="flex flex-1 items-start gap-4">
          <Link href={`/@test`}>
            <Image
              src={author?.profile || ""}
              alt={author?.name}
              width={100}
              height={100}
              className="obejct-cover h-20 w-20 overflow-hidden rounded-full md:h-16 md:w-16"
            />
          </Link>

          <div className="flex-1">
            <div className="mb-4 flex w-full flex-col items-start justify-between sm:flex-row">
              <div className="mb-4 md:mb-0">
                <h2 className="text-uppercase mb-2 text-base font-medium text-gray-600 dark:text-text-primary">
                  WRITTEN BY
                </h2>
                <Link href={`/@test`}>
                  <h1 className="text-uppercase text-xl font-semibold text-gray-800 dark:text-text-secondary">
                    {author?.name}
                  </h1>
                </Link>
              </div>
              <button className="btn-follow gap-2">
                <Follow className="h-4 w-4 fill-none stroke-secondary" />
                <span>Follow</span>
              </button>
            </div>
          </div>
        </div>

        {!author?.bio && (
          <p className="text-lg text-gray-600 dark:text-text-primary">
            {author?.bio || "Coding is my life :)"}
          </p>
        )}
      </div>
    </div>
  );
};

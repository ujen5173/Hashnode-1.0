import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState, type FC } from "react";
import { Book, Check, Follow } from "~/svgs";
import type { Article, Tag, User } from "~/types";
import { C, type ContextValue } from "~/utils/context";
import { formatDate } from "./../utils/miniFunctions";
import ArticleActions from "./ArticleActions";
import CommentsModal from "./CommentsModal";

const ArticleBody: FC<{ article: Article }> = ({ article }) => {
  const [commentsModal, setCommentsModal] = useState(false);

  useEffect(() => {
    if (commentsModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [commentsModal]);

  return (
    <main className="min-h-screen bg-white pb-12 dark:bg-primary">
      <div className="mx-auto max-w-[1200px]">
        {!article?.cover_image && (
          <Image
            src={
              article?.cover_image ||
              "https://cdn.hashnode.com/res/hashnode/image/upload/v1688992349190/b3744811-3074-4284-8961-1cc8a052c83e.png?w=1600&h=840&fit=crop&crop=entropy&auto=compress,format&format=webp"
            }
            alt={article.title}
            width={1200}
            height={800}
            draggable={false}
            className="mb-16 w-full overflow-hidden rounded-b-md object-cover px-4"
          />
        )}

        <section
          className={`relative ${
            article?.cover_image ? "pt-8 md:pb-0 md:pt-16" : ""
          }`}
        >
          <div className="px-4">
            <h1 className="mb-6 text-center text-3xl font-bold leading-snug text-gray-700 dark:text-text-secondary md:mx-auto md:mb-8 md:w-11/12 md:text-5xl md:leading-tight">
              {article.title}
            </h1>
            {article?.subtitle && (
              <h2 className="mx-auto mb-5 w-full text-center text-xl font-normal text-gray-600 dark:text-text-primary sm:w-10/12 md:mb-10 md:text-3xl">
                {article?.subtitle}
              </h2>
            )}

            <div className="mx-auto mb-10 flex w-full flex-col items-center justify-center gap-2 md:w-fit lg:flex-row">
              <Link
                aria-label="Visit Profile"
                className="mb-10 flex items-center gap-2 lg:mb-0"
                href={`/u/@${article.user.username}`}
              >
                <Image
                  src={article.user.profile || ""}
                  alt={article.user.name}
                  width={70}
                  height={70}
                  draggable={false}
                  className="h-8 w-8 overflow-hidden rounded-full object-cover"
                />
                <h1 className="text-xl font-semibold text-gray-700 dark:text-text-secondary">
                  {article.user.name}
                </h1>
              </Link>

              <div className="flex w-full items-center justify-between gap-2 lg:w-fit">
                <span className="hidden text-gray-900 dark:text-text-secondary lg:block">
                  ·
                </span>
                <h3 className="text-base font-medium text-gray-700 dark:text-text-primary md:text-lg">
                  {formatDate(new Date(article.createdAt))}
                </h3>
                <span className="hidden text-gray-900 dark:text-text-secondary lg:block">
                  ·
                </span>
                <div className="flex items-center gap-2">
                  <Book className="h-5 w-5 fill-gray-700 dark:fill-text-primary" />
                  <span className="text-base text-gray-700 dark:text-text-primary md:text-lg">
                    {article.read_time} min read
                  </span>
                </div>
              </div>
            </div>

            <div
              dangerouslySetInnerHTML={{ __html: article.content || "" }}
              className="article mx-auto mb-10 w-full break-words md:w-11/12 lg:w-10/12 xl:w-full"
            ></div>
          </div>
          <ArticleActions
            article={article}
            setCommentsModal={setCommentsModal}
          />
          <ArticleTags tags={article.tags} />
          <ArticleAuthor author={article.user} />
          {commentsModal && (
            <CommentsModal
              id={article.id}
              commentsModal={commentsModal}
              authorUsername={article.user.username}
              setCommentsModal={setCommentsModal}
            />
          )}
        </section>
      </div>
    </main>
  );
};

export default ArticleBody;

const ArticleTags = ({ tags }: { tags: Tag[] }) => {
  return (
    <div className="mx-auto my-10 flex w-11/12 flex-wrap items-center justify-center gap-2 lg:w-8/12">
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
  const { following, followUser } = useContext(C) as ContextValue;
  return (
    <div className="px-4">
      <div className="mx-auto mb-4 mt-10 w-full border-y border-border-light px-4 py-6 dark:border-border md:w-8/12">
        <div className="flex flex-1 items-start gap-4">
          <Link href={`/u/@${author.username}`}>
            <Image
              src={author.profile || ""}
              alt={author.name}
              width={100}
              height={100}
              className="obejct-cover h-20 w-20 overflow-hidden rounded-full md:h-16 md:w-16"
            />
          </Link>

          <div className={"flex-1"}>
            <div className="flex w-full items-start justify-between">
              <div className="">
                <h2 className="text-uppercase mb-1 text-sm font-medium text-gray-600 dark:text-text-primary">
                  WRITTEN BY
                </h2>
                <Link href={`/u/@${author.username}`}>
                  <h1 className="text-uppercase text-lg font-semibold text-gray-800 dark:text-text-secondary">
                    {author?.name}
                  </h1>
                </Link>
              </div>
              <button
                onClick={followUser}
                className="btn-outline flex w-max items-center justify-center gap-2 text-secondary"
              >
                {following.status ? (
                  <>
                    <Check className="h-5 w-5 fill-secondary" />
                    Following
                  </>
                ) : (
                  <>
                    <Follow className="h-5 w-5 fill-secondary" />
                    Follow User
                  </>
                )}
              </button>
            </div>
            {author?.handle?.about && (
              <div className="mt-4 sm:mt-8">
                <p className="text-base text-gray-600 dark:text-text-primary">
                  {author.handle.about}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

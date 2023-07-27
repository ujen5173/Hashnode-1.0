import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState, type FC } from "react";
import removeMd from "remove-markdown";
import { ArticleActions } from "~/component/miniComponent";
import { CommentsModal } from "~/component/popup";
import { Book, Check, Follow, Settings } from "~/svgs";
import type { Article, Tag, User } from "~/types";
import { api } from "~/utils/api";
import { C, type ContextValue } from "~/utils/context";
import { formatDate } from "~/utils/miniFunctions";

const ArticleBody: FC<{ article: Article }> = ({ article }) => {
  const [commentsModal, setCommentsModal] = useState(false);
  const [commentsCount, setCommentsCount] = useState(article.commentsCount);

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
        {article?.cover_image && (
          <Image
            src={article.cover_image}
            alt={article.title}
            width={1200}
            height={800}
            draggable={false}
            className="w-full overflow-hidden rounded-b-md object-cover px-4"
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
            />
          </div>

          <ArticleActions
            article={article}
            setCommentsModal={setCommentsModal}
            commentsCount={commentsCount}
          />

          <ArticleTags tags={article.tags} />

          {article.user && <ArticleAuthor author={article.user as User} />}

          {commentsModal && (
            <CommentsModal
              id={article.id}
              commentsModal={commentsModal}
              authorUsername={article.user.username}
              setCommentsModal={setCommentsModal}
              setCommentsCount={setCommentsCount}
            />
          )}

          {article.series && (
            <SeriesSection series={article.series} slug={article.slug} />
          )}
        </section>
      </div>
    </main>
  );
};

export default ArticleBody;

const SeriesSection: FC<{
  slug: string;
  series: { title: string; slug: string };
}> = ({ series, slug }) => {
  const username = useRouter().query.username as string;

  const { data } = api.series.getSeriesOfArticle.useQuery({
    slug: series.slug,
  });

  return (
    <div className="px-4 py-16">
      <div className="mx-auto max-w-[1000px] rounded-md border border-border-light dark:border-border">
        <header className="border-b border-border-light px-6 py-4 dark:border-border">
          <h1 className="mb-1 text-sm font-bold text-gray-500 dark:text-text-primary">
            ARTICLE SERIES
          </h1>

          <span className="text-lg font-bold text-secondary hover:underline">
            <Link href={`/series/${series.slug}`}>{series.title}</Link>
          </span>
        </header>

        <main className="">
          {data &&
            data.map((article, index) => (
              <div
                className="flex flex-col gap-4 border-b border-border-light p-4 last:border-none dark:border-border md:flex-row md:items-center"
                key={article.id}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    article.slug === slug
                      ? "bg-secondary text-white"
                      : "bg-slate-200 text-primary"
                  }`}
                >
                  <h1 className="text-lg font-black">{index + 1}</h1>
                </div>

                <div className="flex flex-1 items-center gap-4">
                  <Link target="_blank" href={`/u/${username}/${article.slug}`}>
                    <h1 className="max-height-two mb-2 text-2xl font-bold text-gray-700 dark:text-text-secondary">
                      {article.title}
                    </h1>

                    <p className="max-height-two mb-2 text-lg text-gray-500 dark:text-text-primary">
                      {article?.subtitle || removeMd(article.content)}
                    </p>
                  </Link>
                </div>

                {!article?.cover_image && (
                  <Link
                    target="_blank"
                    className="w-full md:w-1/4"
                    href={`/u/${username}/${article.slug}`}
                  >
                    <Image
                      src={article.cover_image || "/hashnode-social-banner.png"}
                      alt={article.title}
                      width={1200}
                      height={800}
                      draggable={false}
                      className="w-full overflow-hidden rounded-md border border-border-light object-cover dark:border-border"
                    />
                  </Link>
                )}
              </div>
            ))}
        </main>
      </div>
    </div>
  );
};

const ArticleTags = ({ tags }: { tags: Tag[] }) => {
  return (
    <div className="mx-auto my-10 flex w-11/12 flex-wrap items-center justify-center gap-2 lg:w-8/12">
      {tags.map((tag) => (
        <Link href={`/tag/${tag.slug}`} key={tag.id}>
          <span className="block rounded-md border border-border-light bg-light-bg px-4 py-2 text-sm font-medium text-gray-700 hover:shadow-md dark:border-border dark:bg-primary-light dark:text-text-secondary dark:hover:bg-border">
            {tag.name}
          </span>
        </Link>
      ))}
    </div>
  );
};

export const ArticleAuthor: FC<{ author: User }> = ({ author }) => {
  const { user, following, followUser } = useContext(C) as ContextValue;

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

              {user?.user.username === author.username ? (
                <Link href={`/${user?.user.id}/dashboard`}>
                  <button className="btn-filled mx-4 flex w-full items-center justify-center gap-2 text-secondary md:w-max">
                    <Settings className="h-5 w-5 fill-white" />
                    Dashboard
                  </button>
                </Link>
              ) : (
                <button
                  onClick={() => void followUser()}
                  className="btn-outline flex w-full items-center justify-center gap-2 text-secondary md:w-max"
                >
                  {following.status ? (
                    <>
                      <Check className="h-5 w-5 fill-secondary" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <Follow className="h-5 w-5 fill-secondary" />
                      <span>Follow User</span>
                    </>
                  )}
                </button>
              )}
            </div>
            {author?.handle?.about && (
              <div className="mt-2 sm:mt-4">
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

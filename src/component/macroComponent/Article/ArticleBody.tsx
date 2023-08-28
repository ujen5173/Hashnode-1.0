import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState, type FC } from "react";
import { toast } from "react-toastify";
import { Balancer } from "react-wrap-balancer";
import removeMd from "remove-markdown";
import { StackedArticleLoading } from "~/component/loading";
import { ArticleActions } from "~/component/miniComponent";
import { CommentsModal } from "~/component/popup";
import { FollowContext } from "~/pages/u/[username]/[slug]";
import { Book, Check, Follow, Settings } from "~/svgs";
import type { Article, Tag, User } from "~/types";
import { api } from "~/utils/api";
import { formatDate } from "~/utils/miniFunctions";

const ArticleBody: FC<{ article: Article }> = ({ article }) => {
  const [commentsModal, setCommentsModal] = useState(false);
  const [commentsCount, setCommentsCount] = useState(article.commentsCount);
  const { mutate } = api.posts.read.useMutation();

  useEffect(() => {
    if (commentsModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [commentsModal]);

  useEffect(() => {
    setTimeout(() => {
      mutate({
        slug: article.slug,
      });
    }, 5000) // 5 seconds
  }, []);

  useEffect(() => {
    // Add copy button inside pre element
    const allCodeBlocks = document.querySelectorAll("pre");
    const copy = [...allCodeBlocks];
    allCodeBlocks.forEach((codeBlock, i) => {
      const parentContainer = document.createElement("div");
      parentContainer.className = "relative";
      codeBlock.parentNode?.replaceChild(parentContainer, codeBlock);
      parentContainer.appendChild(codeBlock);
      const copyButton = document.createElement("button");
      const copyButtonElements = `
        <span class="text-xs sm:text-sm text-[#e2e8f0!important]">Copy</span>
          <svg class="w-4 h-4 fill-[#e2e8f0]" viewBox="0 0 384 512"><path d="M336 64h-88.6c.4-2.6.6-5.3.6-8 0-30.9-25.1-56-56-56s-56 25.1-56 56c0 2.7.2 5.4.6 8H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48zM192 32c13.3 0 24 10.7 24 24s-10.7 24-24 24-24-10.7-24-24 10.7-24 24-24zm160 432c0 8.8-7.2 16-16 16H48c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16h48v20c0 6.6 5.4 12 12 12h168c6.6 0 12-5.4 12-12V96h48c8.8 0 16 7.2 16 16z"></path></svg>
        `
      copyButton.className = "absolute top-2 right-2 flex items-center justify-center gap-1";
      copyButton.innerHTML = copyButtonElements;
      copyButton.addEventListener("click", () => {
        void navigator.clipboard.writeText(copy[i]?.textContent || "");
        toast.success("Copied to clipboard");
      });

      parentContainer.appendChild(copyButton);
    });
  }, []);

  return (
    <main className="bg-white pb-12 dark:bg-primary">
      <div className="mx-auto max-w-[1200px]">
        {article?.cover_image && (
          <Image
            src={article.cover_image}
            alt={article.title}
            width={1200}
            height={800}
            draggable={false}
            className="w-full md:w-10/12 lg:w-full mx-auto overflow-hidden md:rounded-b-md object-cover md:px-4"
          />
        )}

        <section className={`relative pt-8 md:pb-0 md:pt-14`}>
          <div className="px-4">
            <div className="flex items-center w-full justify-center">
              <Balancer className="mx-auto block text-center mb-6 text-2xl sm:text-3xl font-bold leading-snug text-gray-700 dark:text-text-secondary w-full md:mb-8 md:text-5xl md:leading-tight">
                {article.title}
              </Balancer>
            </div>

            {article?.subtitle && (
              <div className="flex items-center w-full justify-center">
                <Balancer className="mx-auto mb-5 break-words text-center text-xl font-normal text-gray-600 dark:text-text-primary md:mb-10 md:text-3xl">
                  {article?.subtitle}
                </Balancer>
              </div>
            )}

            <div className="mx-auto mb-6 flex w-full flex-col items-center justify-center gap-2 md:mb-10 md:w-fit lg:flex-row">
              <Link
                aria-label="Visit Profile"
                className="mb-10 flex items-center gap-2 lg:mb-0"
                href={`/u/@${article?.user.username}`}
              >
                <Image
                  src={article?.user.profile}
                  alt={article?.user.name}
                  width={70}
                  height={70}
                  draggable={false}
                  className="h-8 w-8 overflow-hidden rounded-full object-cover"
                />

                <h1 className="text-xl font-semibold text-gray-700 dark:text-text-secondary">
                  {article?.user.name}
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
              className="article mx-auto w-full break-words text-gray-700 dark:text-text-secondary pb-10 pt-2 sm:pt-6 md:py-6"
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
  const { data: user } = useSession();
  const username = useRouter().query.username as string;

  const { data, isLoading } = api.series.getSeriesOfArticle.useQuery({
    slug: series.slug,
  }, {
    refetchOnWindowFocus: false,
  });

  return (
    <div className="px-4 py-16">
      <div className="mx-auto max-w-[1000px] rounded-md border border-border-light dark:border-border">
        <header className="border-b border-border-light px-6 py-4 dark:border-border">
          <h1 className="mb-1 text-sm font-bold text-gray-500 dark:text-text-primary">
            ARTICLE SERIES
          </h1>

          {isLoading ? (
            <>
              <StackedArticleLoading />
              <StackedArticleLoading />
              <StackedArticleLoading />
              <StackedArticleLoading />
              <StackedArticleLoading />
            </>
          ) : (
            data && (
              <span className="text-lg font-bold text-secondary hover:underline">
                <Link
                  href={`/dev/@${user?.user?.handle?.handle as string
                    }/series/${data.slug}`}
                >
                  {data.title}
                </Link>
              </span>
            )
          )}
        </header>

        <main className="">
          {data &&
            data.articles.map((article, index) => (
              <div
                className="flex flex-col gap-4 border-b border-border-light p-4 last:border-none dark:border-border md:flex-row md:items-center"
                key={article.id}
              >
                <div
                  className={`flex  h-10 w-10 items-center justify-center rounded-full ${article.slug === slug
                    ? "bg-secondary text-white"
                    : "bg-slate-200 text-primary"
                    }`}
                >
                  <h1 className="text-lg font-black">{index + 1}</h1>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-8 flex-1">
                  <div className="flex flex-1 items-center gap-4">
                    <Link target="_blank" href={`/u/${username}/${article.slug}`}>
                      <h1 className="max-height-two mb-1 text-xl font-bold text-gray-700 dark:text-text-secondary">
                        {article.title}
                      </h1>

                      <p className={`max-height-two mb-2 text-base text-gray-500 dark:text-text-primary ${article?.cover_image ? "" : "w-[95%]"}`}>
                        {removeMd(article.content)}
                      </p>
                    </Link>
                  </div>

                  {article?.cover_image && (
                    <Link
                      target="_blank"
                      className="w-full md:w-1/4"
                      href={`/u/${username}/${article.slug}`}
                    >
                      <Image
                        src={article.cover_image}
                        alt={article.title}
                        width={1200}
                        height={800}
                        draggable={false}
                        className="w-full overflow-hidden rounded-md border border-border-light object-cover dark:border-border"
                      />
                    </Link>
                  )}
                </div>
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
  // const { following, followUser } = useContext(C) as ContextValue;
  const { data: user } = useSession();

  const { following, setFollowing } = useContext(FollowContext) as {
    following: boolean;
    setFollowing: React.Dispatch<React.SetStateAction<boolean>>;
  }

  const { mutate: followToggle } = api.users.followUserToggle.useMutation();

  const followUser = () => {
    if (!user) {
      toast.error("You need to login to follow a user");
      return;
    }
    setFollowing(prev => !prev);

    followToggle({
      username: author.username,
    });
  };

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
              className="obejct-cover md:h-18 md:w-18 h-14 w-14 overflow-hidden rounded-full sm:h-16 sm:w-16 "
            />
          </Link>

          <div className={"flex-1"}>
            <div className="flex flex-col sm:flex-row w-full items-start justify-between">
              <div className="mb-3 sm:mb-0">
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
                  <button className="btn-filled flex w-full items-center justify-center gap-2 text-secondary md:w-max">
                    <Settings className="h-5 w-5 fill-white" />
                    Dashboard
                  </button>
                </Link>
              ) : (
                <button
                  onClick={() => void followUser()}
                  className="btn-outline hidden w-max items-center justify-center gap-2 text-secondary sm:flex"
                >
                  {following ? (
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
              <div className="mt-2 hidden sm:mt-4 sm:block">
                <p className="text-base text-gray-600 dark:text-text-primary">
                  {author.handle.about}
                </p>
              </div>
            )}
          </div>
        </div>
        {author?.handle?.about && (
          <div className="mt-4 block sm:mt-4 sm:hidden">
            <p className="text-base text-gray-600 dark:text-text-primary">
              {author.handle.about}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

import { useSession } from "next-auth/react";
import React from "react";
import { SimpleArticleCard } from "~/component/card";
import { SimpleArticleCardLoading } from "~/component/loading";
import { NoArticlesUploadedError } from "~/component/miniComponent";
import { AuthorArea } from "~/pages/dev/[username]";
import { type DataType } from "~/types";
import { type LayoutProps } from "./Stacked";

const Magazine = React.forwardRef<HTMLDivElement, LayoutProps>(({ isFetchingNextPage, data, isLoading, author }, bottomRef) => {
  const { data: user } = useSession();

  return (
    <>
      {isLoading ? (
        <div className="w-full border-b border-border-light bg-light-bg dark:border-border dark:bg-black">
          <div className="border-light loading h-[50%] min-h-[24rem] rounded-md border border-border-light bg-gray-200 shadow-md dark:border-border dark:bg-primary-light"></div>
        </div>
      ) : data && data.length > 0 ? (
        <div className="w-full border-b border-border-light bg-light-bg dark:border-border dark:bg-black">
          <div className="author-blog-grid mx-auto max-w-[1300px] px-4 py-4 sm:py-8">
            <SimpleArticleCard type="main" article={data[0] as DataType} />
            {data.length === 1 ? (
              <>
                {data?.slice(1, 3).map((article) => (
                  <div className="child-block" key={article.id}>
                    <SimpleArticleCard article={article} />
                  </div>
                ))}
                <div className="child-block hidden h-[18rem] rounded-md border border-border-light bg-gray-200 shadow-md dark:border-border dark:bg-primary-light md:block"></div>
                <div className="child-block hidden h-[18rem] rounded-md border border-border-light bg-gray-200 shadow-md dark:border-border dark:bg-primary-light md:block"></div>
              </>
            ) : data.length === 2 ? (
              <>
                {data?.slice(1, 3).map((article) => (
                  <div className="child-block" key={article.id}>
                    <SimpleArticleCard type="group" article={article} />
                  </div>
                ))}
                <div className="child-block hidden h-[18rem] rounded-md border border-border-light bg-gray-200 shadow-md dark:border-border dark:bg-primary-light md:block"></div>
              </>
            ) : (
              <>
                {data?.slice(1, 3).map((article) => (
                  <div className="child-block" key={article.id}>
                    <SimpleArticleCard type="group" article={article} />
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      ) : null}
      {data
        ? data?.length > 3 && (
          <div className="border-b border-border-light bg-light-bg px-4 py-16 dark:border-border dark:bg-primary">
            <div className="mx-auto flex max-w-[1300px] items-center justify-center">
              <div className="flex w-full flex-wrap gap-4">
                {data?.slice(3, data.length).map((article) => (
                  <SimpleArticleCard
                    key={article.id}
                    article={article}
                    perRow={3}
                  />
                ))}
                {
                  isFetchingNextPage && (
                    <>
                      <SimpleArticleCardLoading number={3} />
                      <SimpleArticleCardLoading number={3} />
                      <SimpleArticleCardLoading number={3} />
                      <SimpleArticleCardLoading number={3} />
                      <SimpleArticleCardLoading number={3} />
                      <SimpleArticleCardLoading number={3} />
                      <SimpleArticleCardLoading number={3} />
                      <SimpleArticleCardLoading number={3} />
                    </>
                  )
                }
              </div>
            </div>
          </div>
        )
        : null}
      <div ref={bottomRef} />
      <AuthorArea author={author} />
      {data?.length === 0 && (
        <NoArticlesUploadedError user={user} author={author} />
      )}
    </>
  );
});

Magazine.displayName = "Magazine";

export default Magazine;

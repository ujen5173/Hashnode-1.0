import { useSession } from "next-auth/react";
import React from "react";
import { StackedArticleCard } from "~/component/card";
import { StackedArticleLoading } from "~/component/loading";
import { NoArticlesUploadedError } from "~/component/miniComponent";
import { AuthorArea } from "~/pages/dev/[username]";
import { type DataType } from "~/types";

export interface LayoutProps {
  data: DataType[] | undefined;
  isLoading: boolean;
  author: {
    name: string;
    username: string;
    profile: string;
    bio: string;
    handle: {
      about: string;
    };
  };
  isFetchingNextPage: boolean;
}

const Stacked = React.forwardRef<HTMLDivElement, LayoutProps>(({ isFetchingNextPage, data, isLoading, author }, bottomRef) => {
  const { data: user } = useSession();
  return (
    <div className="w-full bg-light-bg dark:bg-primary">
      <AuthorArea author={author} />

      {isLoading ? (
        <div className="h-[50%] min-h-[24rem] rounded-md border border-border-light bg-gray-200 shadow-md dark:border-border dark:bg-primary-light"></div>
      ) : data && data.length > 0 ? (
        <div className="border-t border-border-light dark:border-border">
          <div className="mx-auto flex max-w-[1000px] flex-wrap gap-6 px-4 py-4 sm:py-8">
            {data.map((e) => (
              <StackedArticleCard key={e.id} article={e} />
            ))}
            {
              isFetchingNextPage && (
                <>
                  <StackedArticleLoading />
                  <StackedArticleLoading />
                  <StackedArticleLoading />
                  <StackedArticleLoading />
                  <StackedArticleLoading />
                </>)
            }
          </div>
        </div>
      ) : (
        <NoArticlesUploadedError user={user} author={author} />
      )}
      <div ref={bottomRef} />
    </div>
  );
});
Stacked.displayName = "Stacked";

export default Stacked;

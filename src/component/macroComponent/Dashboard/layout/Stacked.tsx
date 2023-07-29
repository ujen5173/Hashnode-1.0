import { useContext, type FC } from "react";
import { StackedArticleCard } from "~/component/card";
import { NoArticlesUploadedError } from "~/component/miniComponent";
import { AuthorArea } from "~/pages/dev/[username]";
import { type DataType } from "~/types";
import { C, type ContextValue } from "~/utils/context";

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
}

const Stacked: FC<LayoutProps> = ({ data, isLoading, author }) => {
  const { user } = useContext(C) as ContextValue;
  return (
    <div className="w-full border-b border-border-light bg-light-bg dark:border-border dark:bg-primary">
      <AuthorArea author={author} />

      {isLoading ? (
        <div className="h-[50%] min-h-[24rem] rounded-md border border-border-light bg-gray-200 shadow-md dark:border-border dark:bg-primary-light"></div>
      ) : data && data.length > 0 ? (
        <div className="border-t border-border-light dark:border-border">
          <div className="mx-auto flex max-w-[1000px] flex-wrap gap-6 px-4 py-8">
            {data.map((e) => (
              <StackedArticleCard key={e.id} article={e} />
            ))}
          </div>
        </div>
      ) : (
        <NoArticlesUploadedError user={user} author={author} />
      )}
    </div>
  );
};

export default Stacked;

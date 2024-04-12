import { useSession } from "next-auth/react";
import { type FC } from "react";
import { AuthorArea } from "~/pages/dev/[username]";
import { type DataType } from "~/types";
import StackedArticleCard from "../card/StackedArticle";
import StackedArticleLoading from "../loading/StackedArticle";
import NoArticlesUploadedError from "../pages/dashboard/NoArticlesUploadedError";

export interface LayoutProps {
  data: DataType[] | undefined;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  author: {
    name: string;
    username: string;
    image: string;
    bio: string;
    handle: {
      about: string;
    };
  };
}

const Stacked: FC<LayoutProps> = ({
  data,
  isLoading,
  author,
  isFetchingNextPage,
}) => {
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
            {isLoading &&
              Array(6)
                .fill("")
                .map((_, i) => <StackedArticleLoading key={i} />)}
            {isFetchingNextPage &&
              Array(4)
                .fill("")
                .map((_, i) => <StackedArticleLoading key={i} />)}
          </div>
        </div>
      ) : (
        <NoArticlesUploadedError user={user} author={author} />
      )}
    </div>
  );
};

export default Stacked;

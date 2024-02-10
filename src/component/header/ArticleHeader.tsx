import { type FC } from "react";
import { ArticleLeftArea, ArticleRightArea } from "../macroComponent/Article";

type UserType = {
  name: string;
  username: string;
  image: string | null;
};

const ArticleHeader: FC<{ user: UserType }> = ({
  user,
}) => {
  return (
    <header className="w-full border-b border-border-light bg-white dark:border-border dark:bg-primary">
      <div className="mx-auto flex max-w-[1550px] items-center justify-between gap-4 px-4 py-4">
        <div className="flex flex-1 items-center justify-between gap-8 md:gap-4">
          <ArticleLeftArea
            user={
              user as {
                image: string | null;
                name: string;
                username: string;
                id: string;
                followers: { userId: string }[];
              }
            }
          />
          <ArticleRightArea
            user={
              user as {
                image: string | null;
                name: string;
                id: string;
                followers: { userId: string }[];
                username: string;
              }
            }
          />
        </div>
      </div>
    </header>
  );
};

export default ArticleHeader;

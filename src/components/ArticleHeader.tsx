import { type FC } from "react";
import ArticleLeftArea from "./ArticleLeftArea";
import ArticleRightArea from "./ArticleRightArea";

export interface User {
  id: string;
  name: string;
  username: string;
  profile: string;
}

const ArticleHeader: FC<{ user: User }> = ({ user }) => {
  return (
    <header className="w-full border-b border-border-light bg-white dark:border-border dark:bg-primary">
      <div className="mx-auto flex max-w-[1550px] items-center justify-between gap-4 px-4 py-4">
        <div className="flex flex-1 items-center justify-between gap-8 md:gap-4">
          <ArticleLeftArea user={user} />
          <ArticleRightArea user={user} />
        </div>
      </div>
    </header>
  );
};

export default ArticleHeader;

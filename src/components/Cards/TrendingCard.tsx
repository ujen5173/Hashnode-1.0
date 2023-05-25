import Image from "next/image";
import { type FC } from "react";
import Like from "./../../svgs/Like";
import Multicomment from "./../../svgs/Multicomment";

interface TrendingCardProps {
  article: {
    id: string;
    title: string;
    user: {
      name: string;
      profile: string;
      id: string;
    };
    likesCount: number;
    commentsCount: number;
  };
}

const TrendingCard: FC<TrendingCardProps> = ({ article }) => {
  return (
    <div className="flex gap-4 border-b border-border-light py-4 last:border-0 dark:border-border">
      <Image
        src={article.user.profile}
        alt=""
        width={70}
        height={70}
        className="mt-2 h-8 w-8 overflow-hidden rounded-full object-cover"
      />
      <div className="flex-1">
        <h1 className="mb-1 text-base font-bold leading-tight text-gray-800 dark:text-text-secondary">
          {article.title}
        </h1>
        <span className="mb-3 block text-base font-medium text-gray-500 dark:text-text-primary">
          {article.user.name}
        </span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Like className="h-4 w-4 fill-gray-700 dark:fill-text-secondary" />
            <span className="text-sm font-medium text-gray-600 dark:text-text-primary">
              {article.likesCount}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Multicomment className="h-4 w-4 fill-gray-700 dark:fill-text-secondary" />
            <span className="text-sm font-medium text-gray-600 dark:text-text-primary">
              {article.commentsCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingCard;

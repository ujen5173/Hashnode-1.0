import { MessageCircle, ThumbsUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";

interface Props {
  article: {
    id: string;
    title: string;
    slug: string;
    user: {
      image: string | null;
      username: string;
      id: string;
      name: string;
    };
    likesCount: number;
    commentsCount: number;
  };
}

const TrendingCard: FC<Props> = ({ article }) => {
  return (
    <div className="flex items-start gap-4 py-4">
      <Link
        href={`/u/@${article.user.username}/${article.slug}`}
        className="block"
      >
        <Image
          src={article.user.image ?? "/static/default_user.avif"}
          alt="User image"
          width={180}
          height={180}
          className="h-10 w-10 overflow-hidden rounded-full object-cover"
        />
      </Link>

      <div className="flex-1">
        <Link href={`/u/@${article.user.username}/${article.slug}`}>
          <h1 className="max-height-two mb-1 text-lg font-bold leading-tight text-gray-800 dark:text-text-secondary">
            {article.title}
          </h1>
        </Link>

        <Link href={`/u/@${article.user.username}/${article.slug}`}>
          <span className="mb-3 inline-block text-base font-medium text-gray-500 dark:text-text-primary">
            {article.user.name}
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4 stroke-gray-700 dark:stroke-text-primary" />

            <span className="text-sm font-medium text-gray-600 dark:text-text-primary">
              {article.likesCount}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4 stroke-gray-700 dark:stroke-text-primary" />

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

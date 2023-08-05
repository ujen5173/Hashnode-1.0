import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";
import { Like, Multicomment } from "~/svgs";

interface Props {
  article: {
    id: string;
    title: string;
    slug: string;
    user: {
      profile: string | null;
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
          src={article.user.profile || "/default_user.avif"}
          alt="User Profile"
          width={180}
          height={180}
          className="h-10 w-10 overflow-hidden rounded-full object-cover"
        />
      </Link>

      <div className="flex-1">
        <Link href={`/u/@${article.user.username}/${article.slug}`}>
          <h1 className="max-height-two mb-1 text-base font-bold leading-tight text-gray-800 dark:text-text-secondary">
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
            <Like className="h-4 w-4 fill-gray-700 dark:fill-text-primary" />

            <span className="text-sm font-medium text-gray-600 dark:text-text-primary">
              {article.likesCount}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Multicomment className="h-4 w-4 fill-gray-700 dark:fill-text-primary" />

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

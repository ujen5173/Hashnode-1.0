import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";
import { Comment, Heart } from "~/svgs";
import { formatDate } from "~/utils/miniFunctions";

interface Props {
  data: {
    id: string;
    title: string;
    user: {
      name: string;
      username: string;
      profile: string;
      id: string;
    };
    cover_image: string;
    slug: string;
    read_time: number;
    likesCount: number;
    commentsCount: number;
    createdAt: Date;
    updatedAt: Date;
  };
}

const SearchArticle: FC<Props> = ({ data }) => {
  return (
    <Link href={`/u/@${data.user.username}/${data.slug}`}>
      <div className="flex items-center gap-2 border-b border-border-light bg-white p-4 last:border-none dark:border-border dark:bg-primary">
        <div className="flex-1">
          <h1 className="text-base font-medium text-gray-700 dark:text-text-secondary">
            {data.user.name}
          </h1>
          <div className="mb-4 flex items-center gap-2">
            <p className="text-base font-medium text-gray-700 dark:text-text-primary">
              {data.user.username}
            </p>
            <span className="text-base font-normal text-gray-700 dark:text-text-primary">
              ·
            </span>
            <span className="text-sm font-normal text-gray-700 dark:text-text-primary">
              {formatDate(new Date(data.createdAt))}
            </span>
          </div>
          <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-text-secondary">
            {data.title}
          </h1>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 fill-none stroke-gray-700 dark:stroke-text-primary" />
              <p className="text-base font-medium text-gray-700 dark:text-text-primary">
                {data.likesCount}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Comment className="h-6 w-6 fill-none stroke-gray-700 dark:stroke-text-primary" />
              <p className="text-base font-medium text-gray-700 dark:text-text-primary">
                {data.commentsCount}
              </p>
            </div>
          </div>
        </div>
        {data.cover_image && (
          <div className="relative hidden lg:block">
            <Image
              src={data.cover_image}
              alt={data.title}
              width={100}
              height={100}
              className="w-44 select-none overflow-hidden rounded-xl"
              draggable={false}
            />
          </div>
        )}
      </div>
    </Link>
  );
};

export default SearchArticle;

import { Tooltip } from "@mantine/core";
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
      stripeSubscriptionStatus: string | null;
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
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-gray-700 dark:text-text-secondary">
              {data.user.name}
            </h3>
            {
              data.user.stripeSubscriptionStatus === "active" && (
                <Tooltip label="Hashnode Clone Pro User" position="bottom" style={{
                  fontSize: "0.8rem",
                  fontWeight: "400",
                  letterSpacing: "0.5px"
                }}>
                  <span className="px-2 py-1 tracking-wider rounded-md bg-light-bg dark:bg-primary-light border border-border-light dark:border-border font-semibold text-xs text-gray-700 dark:text-text-secondary">PRO</span>
                </Tooltip>
              )
            }
          </div>

          <div className="mb-4 flex items-center gap-1">
            <p className="text-base font-medium text-gray-500 dark:text-text-primary">
              @{data.user.username}
            </p>

            <span className="text-base font-normal text-gray-500 dark:text-text-primary">
              ·
            </span>

            <span className="text-sm font-normal text-gray-500 dark:text-text-primary">
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
          <div className="relative hidden sm:block">
            <Image
              src={data.cover_image}
              alt={data.title}
              width={600}
              height={600}
              className="w-52 select-none overflow-hidden rounded-xl"
              draggable={false}
            />
          </div>
        )}
      </div>
    </Link>
  );
};

export default SearchArticle;

import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";
import { Hashtag } from "~/svgs";
import { type Tag } from "~/utils/context";

const TagCard: FC<{ tag: Tag }> = ({ tag }) => {
  return (
    <Link href={`/tag/${tag.slug}`}>
      <div className="flex gap-3 rounded-md border  border-border-light bg-light-bg p-2 dark:border-border dark:bg-primary-light">
        {tag.logo ? (
          <Image
            src={tag.logo}
            alt={tag.name}
            width={70}
            height={70}
            className="h-12 w-12 rounded-md object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-200 dark:bg-primary">
            <Hashtag className="mx-auto my-3 h-6 w-6 fill-none stroke-gray-500" />
          </div>
        )}
        <div>
          <h1 className="text-base font-medium text-gray-700 dark:text-text-secondary">
            {tag.name}
          </h1>
          <p className="text-sm font-normal text-gray-700 dark:text-text-primary">
            {tag.articlesCount} articles this week
          </p>
        </div>
      </div>
    </Link>
  );
};

export default TagCard;
